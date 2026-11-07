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
import type { ShopperBasketsV2, ShopperProducts } from '@/scapi';
import { createApiClients } from '@/lib/api-clients.server';
import { fetchProductsByIds } from '@/lib/api/products.server';
import { getLogger } from '@/lib/logger.server';
import { getFulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import { primaryImage, storeDisplayName } from '@/extensions/pj-product/lib/pizza.server';
import { loadSheetUpsell } from '@/extensions/pj-product/lib/upsell.server';
import { EMPTY_CROSS_SELL, HAZLO_COMBO_IMAGE_PRODUCT } from '@/extensions/pj-product/lib/upsell';
import { opensAt, openUntil } from '@/extensions/pj-store/lib/store-info';
import { displayProductName, lineProductIds, type LineProducts, type SummaryLineItem } from './line-summary';
import { CANJE_PRODUCT, readCanjeCookie } from './canje';
import type { CartExtras, CartFulfillment, CartProduct, PjCartData } from './types';

type Context = LoaderFunctionArgs['context'];
type Basket = ShopperBasketsV2.schemas['Basket'];
type Product = ShopperProducts.schemas['Product'];
type Custom = Record<string, unknown>;

/** Bebida y postre de la venta cruzada (§3.5): Coca-Cola 1,5 L y Cookie. */
export const OFFER_DRINK = 'cp-coca-cola-2';
export const OFFER_DESSERT = 'cp-cookie';
/** Foto del carrito vacío. */
const EMPTY_IMAGE_PRODUCT = 'pz-pollo-bbq';

const num = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
const text = (value: unknown) => (typeof value === 'string' && value.trim() !== '' ? value.trim() : null);

function toLineProduct(p: Product) {
    const custom = p as unknown as Custom;
    return {
        name: displayProductName(p.name ?? p.id),
        image: primaryImage(p),
        kind: text(custom.c_pjKind),
        priceBefore: num(custom.c_pjPriceBefore),
        dispatch: text(custom.c_pjDispatch),
    };
}

/**
 * Nombre, foto y tipo de cada producto que las líneas necesitan (la línea, el maestro de la pizza, las mitades
 * y las elecciones de los combos). Una sola llamada a SCAPI; si falla, las líneas usan lo que traen.
 */
export async function loadLineProducts(context: Context, basket: Pick<Basket, 'productItems'> | null | undefined) {
    const ids = lineProductIds(basket?.productItems as SummaryLineItem[] | undefined);
    if (!ids.length) return {} as LineProducts;
    try {
        const products = await fetchProductsByIds(context, ids, { expand: ['images'] });
        return Object.fromEntries(products.map((p) => [p.id, toLineProduct(p)])) as LineProducts;
    } catch (error) {
        getLogger(context).warn('PjCart: line products lookup failed', { error });
        return {} as LineProducts;
    }
}

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
        closed: false,
        opensAt: null,
    };
    try {
        const clients = createApiClients(context);
        const { data } = await clients.shopperStores.getStores({ params: { query: { ids: fulfillment.storeId } } });
        const store = data?.data?.[0] as (Custom & { name?: string }) | undefined;
        if (!store) return base;
        return {
            ...base,
            storeName: storeDisplayName(store.name) || null,
            pickupMinutes: num(store.c_pjPickupMinutes),
            deliveryMinutes: num(store.c_pjDeliveryMinutes),
            openUntil: openUntil(store as { c_pjOpenUntil?: string }),
            closed: store.c_pjClosed === true,
            opensAt: opensAt(store as { c_pjOpensAt?: string }),
        };
    } catch (error) {
        getLogger(context).warn('PjCart: store lookup failed', { error, storeId: fulfillment.storeId });
        return base;
    }
}

function cartProduct(p: Product | undefined): CartProduct | null {
    if (!p || typeof p.price !== 'number') return null;
    return { productId: p.id, name: displayProductName(p.name ?? p.id), price: p.price, image: primaryImage(p) };
}

/** Oferta, canje y fotos de los estados (§3.5, §3.6, §3.9). Si algo falla, esa pieza no se muestra. */
export async function loadCartExtras(context: Context): Promise<CartExtras> {
    const empty: CartExtras = {
        drink: null,
        dessert: null,
        convert: null,
        redeem: null,
        emptyImage: null,
        comboImage: null,
        crossSell: EMPTY_CROSS_SELL,
    };
    try {
        const [products, upsell] = await Promise.all([
            fetchProductsByIds(
                context,
                [
                    OFFER_DRINK,
                    OFFER_DESSERT,
                    CANJE_PRODUCT.masterId,
                    CANJE_PRODUCT.variantId,
                    EMPTY_IMAGE_PRODUCT,
                    HAZLO_COMBO_IMAGE_PRODUCT,
                ],
                { expand: ['images', 'prices'] }
            ),
            loadSheetUpsell(context),
        ]);
        const byId = new Map(products.map((p) => [p.id, p]));
        const master = byId.get(CANJE_PRODUCT.masterId);
        const variant = byId.get(CANJE_PRODUCT.variantId);
        const points = num((master as unknown as Custom | undefined)?.c_pjRedeemPoints);
        const redeemBase = cartProduct(variant);
        const comboImage = byId.get(HAZLO_COMBO_IMAGE_PRODUCT);
        return {
            drink: cartProduct(byId.get(OFFER_DRINK)),
            dessert: cartProduct(byId.get(OFFER_DESSERT)),
            convert: upsell.offer?.savings ? { savings: upsell.offer.savings, image: upsell.offer.image } : null,
            redeem:
                redeemBase && points
                    ? {
                          ...redeemBase,
                          name: master?.name ?? redeemBase.name,
                          image: master ? primaryImage(master) : redeemBase.image,
                          points,
                      }
                    : null,
            emptyImage: byId.get(EMPTY_IMAGE_PRODUCT) ? primaryImage(byId.get(EMPTY_IMAGE_PRODUCT) as Product) : null,
            comboImage: comboImage ? primaryImage(comboImage) : null,
            crossSell: upsell.catalog,
        };
    } catch (error) {
        getLogger(context).warn('PjCart: extras lookup failed', { error });
        return empty;
    }
}

/** Todo lo que `/cart` suma al loader del template. */
export async function loadPjCartData(
    context: Context,
    request: Request,
    basket: Pick<Basket, 'productItems'> | null | undefined
): Promise<PjCartData> {
    const [lineProducts, fulfillment, extras] = await Promise.all([
        loadLineProducts(context, basket),
        loadCartFulfillment(context, request),
        loadCartExtras(context),
    ]);
    return { lineProducts, fulfillment, extras, canje: readCanjeCookie(request.headers.get('Cookie')) };
}
