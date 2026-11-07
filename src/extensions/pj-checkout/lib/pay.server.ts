/**
 * Copyright 2026 Salesforce, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** @sfdc-extension-file SFDC_EXT_PJ_CHECKOUT */
import type { ActionFunctionArgs } from 'react-router';
import type { ShopperBasketsV2 } from '@/scapi';
import { createApiClients } from '@/lib/api-clients.server';
import { calculateBasket, getBasketCurrency } from '@/lib/api/basket.server';
import { getLogger } from '@/lib/logger.server';
import { getBasket, updateBasketResource } from '@/middlewares/basket.server';
import { getAuth } from '@/middlewares/auth.server';
import { finalizeOrderSuccess } from '@/lib/checkout/place-order-orchestration.server';
import { getFulfillment, type Fulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import { readCanjeCookie } from '@/extensions/pj-cart/lib/canje';
import type { CanjeState } from '@/extensions/pj-cart/lib/cart-model';
import { storeDisplayName } from '@/extensions/pj-product/lib/pizza.server';
import {
    CANJE_COUPON_CODE,
    CASH_METHOD_ID,
    DELIVERY_METHOD_ID,
    PICKUP_METHOD_ID,
    REJECTED_TEST_CARD,
    canjeCoveredByPromotion,
    cardBrand,
    chargeFor,
    digitsOnly,
    formatPhone,
    formatRut,
    invalidFields,
    maskCard,
    parseExpiry,
    shipmentNote,
} from './checkout-model';
import { loadCheckoutContact } from './checkout.server';
import type { PayFailure, PayFields } from './types';

type Context = ActionFunctionArgs['context'];
type Basket = ShopperBasketsV2.schemas['Basket'];
type OrderAddress = ShopperBasketsV2.schemas['OrderAddress'];

export type PayResult = { success: true; orderNo: string; url: string } | PayFailure;

/** El cupón de canje no existe en el sandbox (solicitud a DAT): no se vuelve a probar durante 10 minutos. */
let couponMissingUntil = 0;

export function readPayFields(form: FormData): PayFields {
    const s = (key: string) => String(form.get(key) ?? '').trim();
    const method = s('method');
    return {
        expectedTotal: Number(s('expectedTotal')),
        method: method === 'new-card' || method === 'cash' ? method : 'saved-card',
        firstName: s('firstName'),
        lastName: s('lastName'),
        email: s('email'),
        phone: s('phone'),
        cvv: s('cvv'),
        cardNumber: s('cardNumber'),
        cardExpiry: s('cardExpiry'),
        cardHolder: s('cardHolder'),
        cardRut: s('cardRut'),
        docType: s('docType') === 'factura' ? 'factura' : 'boleta',
        rut: s('rut'),
        businessName: s('businessName'),
        businessActivity: s('businessActivity'),
        businessAddress: s('businessAddress'),
        note: s('note').slice(0, 300),
    };
}

interface StoreInfo {
    name: string;
    address1: string;
    city: string;
}

async function loadStore(context: Context, storeId: string): Promise<StoreInfo | null> {
    try {
        const { data } = await createApiClients(context).shopperStores.getStores({
            params: { query: { ids: storeId } },
        });
        const store = data?.data?.[0];
        if (!store) return null;
        return {
            name: storeDisplayName(store.name) || store.name || storeId,
            address1: store.address1 ?? '',
            city: store.city ?? 'Santiago',
        };
    } catch {
        return null;
    }
}

/** Dirección del delivery: la de la libreta si coincide con la del chip; si no, la del chip partida en calle y comuna. */
async function deliveryAddress(
    context: Context,
    fulfillment: Fulfillment,
    person: { firstName: string; lastName: string; phone: string }
): Promise<OrderAddress> {
    const text = fulfillment.address ?? '';
    const auth = getAuth(context);
    if (auth.userType === 'registered' && auth.customerId) {
        try {
            const { data } = await createApiClients(context).shopperCustomers.getCustomer({
                params: { path: { customerId: auth.customerId } },
            });
            const match = (data.addresses ?? []).find(
                (a) => a.address1 && text.toLowerCase().includes(a.address1.toLowerCase())
            );
            if (match) {
                return {
                    firstName: person.firstName,
                    lastName: person.lastName,
                    address1: match.address1,
                    address2: match.address2,
                    city: match.city,
                    stateCode: match.stateCode,
                    countryCode: 'CL',
                    phone: person.phone,
                };
            }
        } catch {
            // Sin libreta: se usa el texto del chip.
        }
    }
    const [street, ...rest] = text.split(',').map((part) => part.trim());
    return {
        ...person,
        address1: street || text || 'Sin dirección',
        city: rest.filter(Boolean).join(', ') || 'Santiago',
        countryCode: 'CL',
    };
}

/** Intenta la promoción de Commerce para el canje (cupón). Si no existe, el canje se cobra por el medio de pago. */
async function tryCanjeCoupon(context: Context, basket: Basket, canje: CanjeState | null): Promise<Basket> {
    if (!canje || Date.now() < couponMissingUntil) return basket;
    const line = basket.productItems?.find((item) => item.itemId === canje.itemId);
    if (!line || canjeCoveredByPromotion(line)) return basket;
    if (basket.couponItems?.some((coupon) => coupon.code === CANJE_COUPON_CODE)) return basket;
    try {
        const { data } = await createApiClients(context).shopperBasketsV2.addCouponToBasket({
            params: { path: { basketId: basket.basketId ?? '' } },
            body: { code: CANJE_COUPON_CODE },
        });
        return data;
    } catch {
        couponMissingUntil = Date.now() + 10 * 60 * 1000;
        return basket;
    }
}

/**
 * Pagar (CHK-01..03): deja la canasta como la vio el cliente y crea el pedido.
 * 1. Contacto, modalidad del chip en el envío (retiro: método 005 + `c_fromStoreId`, pendiente #29) y facturación.
 * 2. Canje: promoción de Commerce si existe; si no, se descuenta del cobro (supuesto de demo).
 * 3. Verifica con SCAPI que el total que se cobra es el que el cliente vio. Si cambió, no paga.
 * 4. Medio de pago de prueba por ese total (sin pasarela, S-D4) y `createOrder`.
 */
export async function placePjOrder(context: Context, request: Request, fields: PayFields): Promise<PayResult> {
    const logger = getLogger(context);
    const clients = createApiClients(context);
    const basket = (await getBasket(context)).current;
    const basketId = basket?.basketId;
    if (!basket || !basketId || !basket.productItems?.length) return { success: false, code: 'empty' };

    const contact = await loadCheckoutContact(context);
    if (invalidFields(fields, Boolean(contact.savedCard)).length) return { success: false, code: 'invalid' };

    // Rechazo de la tarjeta de prueba (S-D4): no se toca la canasta, el cliente vuelve con todo intacto.
    if (fields.method === 'new-card' && digitsOnly(fields.cardNumber) === REJECTED_TEST_CARD) {
        return { success: false, code: 'rejected' };
    }

    const fulfillment = getFulfillment(request);
    const pickup = fulfillment?.mode !== 'delivery';
    const canje = readCanjeCookie(request.headers.get('Cookie'));
    const validCanje = canje && basket.productItems.some((item) => item.itemId === canje.itemId) ? canje : null;
    const path = { basketId };
    const person = {
        firstName: fields.firstName,
        lastName: fields.lastName || contact.lastName || '-',
        phone: formatPhone(fields.phone),
    };

    const store = fulfillment ? await loadStore(context, fulfillment.storeId) : null;
    const address: OrderAddress = pickup
        ? {
              ...person,
              address1: store?.address1 || 'Retiro en tienda',
              city: store?.city || 'Santiago',
              countryCode: 'CL',
          }
        : await deliveryAddress(context, fulfillment, person);

    const paymentText =
        fields.method === 'cash'
            ? pickup
                ? 'Pago: efectivo al retirar'
                : 'Pago: efectivo al recibir'
            : 'Pago: tarjeta de prueba (sin pasarela)';
    const documentText =
        fields.docType === 'factura'
            ? `Factura RUT ${formatRut(fields.rut)} · ${fields.businessName} · ${fields.businessActivity} · ${fields.businessAddress}`
            : 'Boleta';
    const storeText = !pickup && store ? `Despacha ${store.name} (${fulfillment?.storeId})` : null;

    await clients.shopperBasketsV2.updateCustomerForBasket({ params: { path }, body: { email: fields.email } });
    await clients.shopperBasketsV2.updateShippingMethodForShipment({
        params: { path: { ...path, shipmentId: 'me' } },
        body: { id: pickup ? PICKUP_METHOD_ID : DELIVERY_METHOD_ID },
    });
    await clients.shopperBasketsV2.updateShipmentForBasket({
        params: { path: { ...path, shipmentId: 'me' } },
        body: {
            shipmentId: 'me',
            c_fromStoreId: pickup ? (fulfillment?.storeId ?? null) : null,
            c_shipmentType: pickup ? 'instore' : 'delivery',
            c_storePickupMessage: shipmentNote({
                canje: validCanje ? { points: validCanje.points, name: 'Super Pepperoni mediana' } : null,
                payment: [paymentText, storeText].filter(Boolean).join(' · '),
                document: documentText,
                note: fields.note || null,
            }),
        } as ShopperBasketsV2.schemas['Shipment'],
    });
    await clients.shopperBasketsV2.updateShippingAddressForShipment({
        params: { path: { ...path, shipmentId: 'me' } },
        body: address,
    });
    const { data: withBilling } = await clients.shopperBasketsV2.updateBillingAddressForBasket({
        params: { path },
        body: address,
    });

    // Medios de pago que haya dejado otro intento (o el *prefill* del template): se parte de cero.
    let current: Basket = withBilling;
    for (const instrument of current.paymentInstruments ?? []) {
        if (!instrument.paymentInstrumentId) continue;
        const { data } = await clients.shopperBasketsV2.removePaymentInstrumentFromBasket({
            params: { path: { ...path, paymentInstrumentId: instrument.paymentInstrumentId } },
        });
        current = data;
    }
    current = await tryCanjeCoupon(context, current, validCanje);

    // Verificación con SCAPI (H-1): el total que queda en la canasta, menos el canje si Commerce no lo descontó.
    const calculated = await calculateBasket(context, basketId, getBasketCurrency(context, current));
    updateBasketResource(context, calculated);
    const charge = chargeFor(calculated, validCanje);
    logger.info('PjCheckout: verified basket total', { basketId, ...charge, expected: fields.expectedTotal });
    if (charge.charged !== fields.expectedTotal) {
        return { success: false, code: 'total', charged: charge.charged };
    }

    if (fields.method === 'cash') {
        // Sin `PJ_CASH` en el sitio, SCAPI rechaza el pedido: falla aquí, antes de crear nada.
        await clients.shopperBasketsV2.addPaymentInstrumentToBasket({
            params: { path },
            body: { paymentMethodId: CASH_METHOD_ID, amount: charge.charged },
        });
    } else {
        const expiry = parseExpiry(fields.cardExpiry);
        const body =
            fields.method === 'saved-card' && contact.savedCard
                ? {
                      paymentMethodId: 'CREDIT_CARD',
                      customerPaymentInstrumentId: contact.savedCard.id,
                      amount: charge.charged,
                  }
                : {
                      paymentMethodId: 'CREDIT_CARD',
                      amount: charge.charged,
                      paymentCard: {
                          cardType: cardBrand(fields.cardNumber) ?? 'Visa',
                          maskedNumber: maskCard(fields.cardNumber),
                          numberLastDigits: digitsOnly(fields.cardNumber).slice(-4),
                          holder: fields.cardHolder,
                          expirationMonth: expiry?.month,
                          expirationYear: expiry?.year,
                      },
                  };
        await clients.shopperBasketsV2.addPaymentInstrumentToBasket({
            params: { path },
            body: body as ShopperBasketsV2.schemas['BasketPaymentInstrumentRequest'],
        });
    }

    const { data: order } = await clients.shopperOrders.createOrder({ params: {}, body: { basketId } });
    if (!order?.orderNo) return { success: false, code: 'error' };
    logger.info('PjCheckout: order created', {
        orderNo: order.orderNo,
        orderTotal: order.orderTotal,
        charged: charge.charged,
        canje: validCanje?.points ?? 0,
    });
    const url = finalizeOrderSuccess(context, { orderNo: order.orderNo });
    return { success: true, orderNo: order.orderNo, url };
}
