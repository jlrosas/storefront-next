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
import type { LoaderFunctionArgs } from 'react-router';
import type { ShopperBasketsV2, ShopperOrders } from '@/scapi';
import { createApiClients } from '@/lib/api-clients.server';
import { getFulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import { formatTime, formatTimeWindow } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { CANJE_PRODUCT } from '@/extensions/pj-cart/lib/canje';
import { loadLineProducts } from '@/extensions/pj-cart/lib/cart.server';
import { primaryImage, storeDisplayName } from '@/extensions/pj-product/lib/pizza.server';
import { HAZLO_COMBO_IMAGE_PRODUCT } from '@/extensions/pj-product/lib/upsell';
import { fetchProductsByIds } from '@/lib/api/products.server';
import { chargeFor, redeemedFromNote } from './checkout-model';
import { loadCheckoutContact } from './checkout.server';
import type { PjConfirmationData } from './types';

type Context = LoaderFunctionArgs['context'];
type Order = ShopperOrders.schemas['Order'];
type Custom = Record<string, unknown>;

const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null);

/**
 * «¡Pago aprobado!» (CHK-05) a partir del pedido de Commerce: modalidad y tienda del envío (`c_fromStoreId`, o la
 * cookie del chip en delivery), cuándo está listo, lo cobrado (sin la pizza canjeada) y los Papa Puntos.
 */
export async function loadPjConfirmation(
    context: Context,
    request: Request,
    order: Order
): Promise<PjConfirmationData> {
    const shipment = (order.shipments?.[0] ?? {}) as Custom & NonNullable<Order['shipments']>[number];
    const fromStore = typeof shipment.c_fromStoreId === 'string' ? shipment.c_fromStoreId : null;
    const fulfillment = getFulfillment(request);
    const mode: PjConfirmationData['mode'] = fromStore || shipment.shippingMethod?.id === '005' ? 'pickup' : 'delivery';
    const storeId = fromStore ?? fulfillment?.storeId ?? null;
    const note = typeof shipment.c_storePickupMessage === 'string' ? shipment.c_storePickupMessage : '';
    const redeemed = redeemedFromNote(note);
    const items = (order.productItems ?? []) as ShopperBasketsV2.schemas['ProductItem'][];
    const canjeItem = redeemed ? items.find((item) => item.productId === CANJE_PRODUCT.variantId) : undefined;

    const [store, lineProducts, contact, comboImage] = await Promise.all([
        storeId
            ? createApiClients(context)
                  .shopperStores.getStores({ params: { query: { ids: storeId } } })
                  .then(({ data }) => (data?.data?.[0] ?? null) as (Custom & { name?: string }) | null)
                  .catch(() => null)
            : Promise.resolve(null),
        loadLineProducts(context, { productItems: items }),
        loadCheckoutContact(context),
        fetchProductsByIds(context, [HAZLO_COMBO_IMAGE_PRODUCT], { expand: ['images'] })
            .then((products) => (products[0] ? primaryImage(products[0]) : null))
            .catch(() => null),
    ]);

    const { charged, canjeCharge } = chargeFor(
        order,
        canjeItem?.itemId
            ? { itemId: canjeItem.itemId, productId: CANJE_PRODUCT.variantId, points: redeemed, value: 0 }
            : null
    );
    const shipping = num(order.shippingTotal) ?? 0;
    const earned = pointsFor(charged, shipping, contact.doublePoints);
    const minutes = mode === 'pickup' ? num(store?.c_pjPickupMinutes) : num(store?.c_pjDeliveryMinutes);
    const placedAt = order.creationDate ?? new Date().toISOString();
    const start = Date.parse(placedAt);
    const readyAt =
        minutes === null
            ? null
            : mode === 'pickup'
              ? formatTime(start + minutes * 60_000)
              : formatTimeWindow(start + Math.max(5, minutes - 5) * 60_000, start + (minutes + 5) * 60_000);
    const card = order.paymentInstruments?.find((pi) => pi.paymentCard)?.paymentCard;
    const lat = num(store?.latitude);
    const lng = num(store?.longitude);
    const address = shipment.shippingAddress;

    return {
        orderNo: order.orderNo ?? '',
        mode,
        storeId,
        storeName: store?.name ? storeDisplayName(store.name) || store.name : null,
        storeAddress: typeof store?.address1 === 'string' ? store.address1 : null,
        storeCoords: lat !== null && lng !== null ? { latitude: lat, longitude: lng } : null,
        mapsUrl:
            lat !== null && lng !== null ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : null,
        address:
            mode === 'delivery' && address ? [address.address1, address.address2].filter(Boolean).join(', ') : null,
        minutes,
        placedAt,
        readyAt,
        charged,
        shipping,
        payment: card
            ? {
                  kind: 'card',
                  brand: card.cardType ?? 'Visa',
                  last4: (card.numberLastDigits ?? card.maskedNumber ?? '').replace(/\D/g, '').slice(-4),
              }
            : order.paymentInstruments?.length
              ? null
              : { kind: 'cash' },
        earned,
        redeemed,
        balanceAfter: contact.points === null ? null : contact.points - redeemed + earned,
        registered: contact.registered,
        phone: contact.phone || address?.phone || null,
        items,
        lineProducts,
        comboImage,
        canjeItemId: canjeItem?.itemId ?? null,
        canjeValue: canjeCharge,
    };
}
