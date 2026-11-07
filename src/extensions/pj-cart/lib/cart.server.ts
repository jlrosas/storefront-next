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
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import type { LoaderFunctionArgs } from 'react-router';
import type { ShopperBasketsV2 } from '@/scapi';
import { createApiClients } from '@/lib/api-clients.server';
import { fetchProductsByIds } from '@/lib/api/products.server';
import { getLogger } from '@/lib/logger.server';
import { getFulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import { primaryImage, storeDisplayName } from '@/extensions/pj-product/lib/pizza.server';
import { lineProductIds, type LineProducts, type SummaryLineItem } from './line-summary';
import type { CartFulfillment } from './types';

type Context = LoaderFunctionArgs['context'];
type Basket = ShopperBasketsV2.schemas['Basket'];

/**
 * Nombre y foto de cada producto que las líneas necesitan (la línea misma, el maestro de la pizza, las
 * mitades y las pizzas del combo). Una sola llamada a SCAPI; si falla, las líneas usan lo que traen.
 */
export async function loadLineProducts(context: Context, basket: Pick<Basket, 'productItems'> | null | undefined) {
    const ids = lineProductIds(basket?.productItems as SummaryLineItem[] | undefined);
    if (!ids.length) return {} as LineProducts;
    try {
        const products = await fetchProductsByIds(context, ids, { expand: ['images'] });
        return Object.fromEntries(
            products.map((p) => [p.id, { name: p.name ?? p.id, image: primaryImage(p) }])
        ) as LineProducts;
    } catch (error) {
        getLogger(context).warn('PjCart: line products lookup failed', { error });
        return {} as LineProducts;
    }
}

const minutes = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
const text = (value: unknown) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null);

/**
 * La modalidad del chip (`pj_fulfillment`) con su tienda, leída en el servidor para que la primera tarjeta del
 * carrito llegue en el HTML (#38: nunca «Despacho a domicilio» con retiro).
 */
export async function loadCartFulfillment(context: Context, request: Request): Promise<CartFulfillment | null> {
    const fulfillment = getFulfillment(request);
    if (!fulfillment) return null;
    const base: CartFulfillment = {
        mode: fulfillment.mode,
        storeId: fulfillment.storeId,
        storeName: null,
        address: fulfillment.address ?? null,
        when: fulfillment.when ?? 'asap',
        pickupMinutes: null,
        deliveryMinutes: null,
        openUntil: null,
    };
    try {
        const clients = createApiClients(context);
        const { data } = await clients.shopperStores.getStores({ params: { query: { ids: fulfillment.storeId } } });
        const store = data?.data?.[0] as (Record<string, unknown> & { name?: string }) | undefined;
        if (!store) return base;
        return {
            ...base,
            storeName: storeDisplayName(store.name) || null,
            pickupMinutes: minutes(store.c_pjPickupMinutes),
            deliveryMinutes: minutes(store.c_pjDeliveryMinutes),
            openUntil: text(store.c_pjOpenUntil),
        };
    } catch (error) {
        getLogger(context).warn('PjCart: store lookup failed', { error, storeId: fulfillment.storeId });
        return base;
    }
}
