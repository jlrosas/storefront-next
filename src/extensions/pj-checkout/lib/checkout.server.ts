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
import { type LoaderFunctionArgs, redirect } from 'react-router';
import { getBasket } from '@/middlewares/basket.server';
import { getAuth } from '@/middlewares/auth.server';
import { getCustomer } from '@/lib/api/customer.server';
import { getPaymentMethodsForBasket } from '@/lib/api/basket.server';
import { CASH_METHOD_ID } from './checkout-model';
import { getLogger } from '@/lib/logger.server';
import { buildUrlFromContext } from '@/lib/url.server';
import { loadPjCartData } from '@/extensions/pj-cart/lib/cart.server';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import type { CheckoutContact, PjCheckoutData, SavedCard } from './types';

type Context = LoaderFunctionArgs['context'];
type Custom = Record<string, unknown>;

const EMPTY_CONTACT: CheckoutContact = {
    registered: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    points: null,
    doublePoints: false,
    savedCard: null,
};

function savedCardOf(customer: Custom): SavedCard | null {
    const instruments = (customer.paymentInstruments ?? []) as Array<{
        paymentInstrumentId?: string;
        paymentMethodId?: string;
        paymentCard?: { cardType?: string; maskedNumber?: string; numberLastDigits?: string };
    }>;
    const card = instruments.find((pi) => pi.paymentMethodId === 'CREDIT_CARD' && pi.paymentCard);
    if (!card?.paymentInstrumentId || !card.paymentCard) return null;
    const last4 = (card.paymentCard.numberLastDigits ?? card.paymentCard.maskedNumber ?? '').replace(/\D/g, '');
    return { id: card.paymentInstrumentId, brand: card.paymentCard.cardType ?? 'Visa', last4: last4.slice(-4) };
}

/** Datos del cliente con sesión para «Tus datos» en una línea (CHK-01.3) y la tarjeta guardada (CHK-03.1). */
export async function loadCheckoutContact(context: Context): Promise<CheckoutContact> {
    const auth = getAuth(context);
    if (auth.userType !== 'registered' || !auth.customerId) return EMPTY_CONTACT;
    try {
        const customer = (await getCustomer(context, auth.customerId)) as unknown as Custom;
        const points = Number(customer.c_pjPoints);
        return {
            registered: true,
            firstName: String(customer.firstName ?? ''),
            lastName: String(customer.lastName ?? ''),
            email: String(customer.email ?? customer.login ?? ''),
            phone: String(customer.phoneMobile ?? customer.phoneHome ?? ''),
            points: Number.isFinite(points) ? points : null,
            doublePoints: customer.c_pjDoublePoints === true,
            savedCard: savedCardOf(customer),
        };
    } catch (error) {
        getLogger(context).warn('PjCheckout: customer fetch failed', { error });
        return { ...EMPTY_CONTACT, registered: true };
    }
}

/**
 * Loader de `/checkout` de Papa Johns: la canasta tal cual (sin el *prefill* del template, que ponía la
 * dirección de la casa y el despacho con retiro), lo mismo que el carrito (líneas, modalidad, canje) y el cliente.
 * Sin productos vuelve a «Mi pedido».
 */
export async function loadPjCheckout({ context }: Pick<LoaderFunctionArgs, 'context'>, request: Request) {
    const basket = (await getBasket(context)).current ?? null;
    if (!basket?.basketId || !basket.productItems?.length) {
        return redirect(buildUrlFromContext(PJ_ROUTES.cart, context));
    }
    const [cart, contact, cashAvailable] = await Promise.all([
        loadPjCartData(context, request, basket),
        loadCheckoutContact(context),
        getPaymentMethodsForBasket(context, basket.basketId)
            .then((result) => Boolean(result.applicablePaymentMethods?.some((m) => m.id === CASH_METHOD_ID)))
            .catch(() => false),
    ]);
    const data: PjCheckoutData = { basket, cart, contact, cashAvailable };
    return data;
}
