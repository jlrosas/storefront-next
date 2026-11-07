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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import type { LoaderFunctionArgs } from 'react-router';
import type { ShopperProducts } from '@/scapi';
import { createApiClients } from '@/lib/api-clients.server';
import { fetchProductsByIds } from '@/lib/api/products.server';
import { getLogger } from '@/lib/logger.server';
import { primaryImage } from './pizza.server';
import {
    HAZLO_COMBO_DRINKS,
    HAZLO_COMBO_IMAGE_PRODUCT,
    HAZLO_COMBO_PROMOTION_ID,
    HAZLO_COMBO_SIDE,
    PDP_SIDES,
    SHEET_EXTRA_SIDES,
    comboPricing,
    EMPTY_CROSS_SELL,
    type CrossSellCatalog,
    type CrossSellDrink,
    type HazloComboOffer,
    type SheetUpsell,
    type SideProduct,
} from './upsell';
import { CROSS_SELL_DESSERTS, CROSS_SELL_DRINKS, CROSS_SELL_SIDES, type DrinkSize } from './cross-sell';
import { displayProductName } from '@/extensions/pj-cart/lib/line-summary';

type Product = ShopperProducts.schemas['Product'];
type Context = LoaderFunctionArgs['context'];

function toSide(product: Product): SideProduct {
    const sensory = (product as Product & Record<string, unknown>).c_pjSensory;
    return {
        productId: product.id,
        name: product.name ?? product.id,
        description: typeof sensory === 'string' ? sensory : (product.shortDescription ?? null),
        price: product.price ?? 0,
        image: primaryImage(product),
    };
}

/** Nombre de la bebida con el tamaño («Coca-Cola Sin azúcar 1,5 L»). Las variantes no traen nombre propio. */
async function drinkProducts(context: Context): Promise<Map<string, Product>> {
    const products = await fetchProductsByIds(
        context,
        HAZLO_COMBO_DRINKS.map((d) => d.productId),
        { expand: ['images', 'prices'], allImages: true }
    );
    return new Map(products.map((p) => [p.id, p]));
}

/**
 * Bebidas por tamaño, acompañamientos y postres de «Completa tu pedido» y «¿Le sumamos algo?» (S-D19).
 * Una sola llamada a SCAPI; si falla, la venta cruzada no se muestra.
 */
export async function loadCrossSellCatalog(context: Context): Promise<CrossSellCatalog> {
    try {
        const sizeIds = CROSS_SELL_DRINKS.flatMap((d) => Object.values(d.sizes));
        const products = await fetchProductsByIds(
            context,
            [...CROSS_SELL_DRINKS.map((d) => d.masterId), ...sizeIds, ...CROSS_SELL_SIDES, ...CROSS_SELL_DESSERTS],
            { expand: ['images', 'prices'] }
        );
        const byId = new Map(products.map((p) => [p.id, p]));
        const drinks: CrossSellDrink[] = [];
        for (const def of CROSS_SELL_DRINKS) {
            const master = byId.get(def.masterId);
            const sizes = (Object.entries(def.sizes) as Array<[DrinkSize, string]>).flatMap(([size, productId]) => {
                const variant = byId.get(productId);
                return variant && typeof variant.price === 'number' ? [{ size, productId, price: variant.price }] : [];
            });
            if (!master || sizes.length === 0) continue;
            drinks.push({
                flavor: def.flavor,
                name: displayProductName(master.name ?? def.masterId),
                image: primaryImage(byId.get(sizes[0].productId) ?? master) ?? primaryImage(master),
                sizes,
            });
        }
        const list = (ids: readonly string[]) =>
            ids
                .map((id) => byId.get(id))
                .filter((p): p is Product => Boolean(p) && typeof p?.price === 'number')
                .map((p) => ({ ...toSide(p), name: displayProductName(p.name ?? p.id) }));
        return { drinks, sides: list(CROSS_SELL_SIDES), desserts: list(CROSS_SELL_DESSERTS) };
    } catch (error) {
        getLogger(context).warn('PjProduct: cross-sell catalog lookup failed', { error });
        return EMPTY_CROSS_SELL;
    }
}

/** Datos del paso «Completa tu pedido» de la hoja (se piden al agregar una pizza o un combo con pizzas). */
export async function loadSheetUpsell(context: Context): Promise<SheetUpsell> {
    const logger = getLogger(context);
    const clients = createApiClients(context);
    try {
        const [products, drinks, promotion, catalog] = await Promise.all([
            fetchProductsByIds(context, [HAZLO_COMBO_SIDE, HAZLO_COMBO_IMAGE_PRODUCT, ...SHEET_EXTRA_SIDES], {
                expand: ['images', 'prices'],
            }),
            drinkProducts(context),
            clients.shopperPromotions
                .getPromotions({ params: { query: { ids: [HAZLO_COMBO_PROMOTION_ID] } } })
                .then(({ data }) => data?.data?.[0] ?? null)
                .catch((error: unknown) => {
                    logger.warn('PjProduct: promotion lookup failed', { error });
                    return null;
                }),
            loadCrossSellCatalog(context),
        ]);
        const byId = new Map(products.map((p) => [p.id, p]));
        const side = byId.get(HAZLO_COMBO_SIDE);
        const drinkList: Array<SideProduct & { flavor: string }> = [];
        for (const d of HAZLO_COMBO_DRINKS) {
            const p = drinks.get(d.productId);
            if (p) drinkList.push({ ...toSide(p), flavor: d.flavor });
        }
        let offer: HazloComboOffer | null = null;
        if (promotion && side && drinkList.length) {
            const regularPrice = (side.price ?? 0) + drinkList[0].price;
            const { price, savings } = comboPricing(promotion.calloutMsg, regularPrice);
            const imageProduct = byId.get(HAZLO_COMBO_IMAGE_PRODUCT);
            offer = {
                promotionId: promotion.id,
                price,
                regularPrice,
                savings,
                image: imageProduct ? primaryImage(imageProduct) : primaryImage(side),
                side: toSide(side),
                drinks: drinkList,
            };
        }
        const extras = SHEET_EXTRA_SIDES.map((id) => byId.get(id))
            .filter((p): p is Product => Boolean(p))
            .map(toSide);
        return { offer, extras, catalog };
    } catch (error) {
        logger.warn('PjProduct: upsell lookup failed', { error });
        return { offer: null, extras: [], catalog: EMPTY_CROSS_SELL };
    }
}

/** «Completa tu pedido» de la ficha (bajo el pliegue: el loader lo devuelve como promesa). */
export async function loadPdpSides(context: Context): Promise<SideProduct[]> {
    try {
        const products = await fetchProductsByIds(context, [...PDP_SIDES], { expand: ['images', 'prices'] });
        const byId = new Map(products.map((p) => [p.id, p]));
        return PDP_SIDES.map((id) => byId.get(id))
            .filter((p): p is Product => Boolean(p))
            .map(toSide);
    } catch (error) {
        getLogger(context).warn('PjProduct: sides lookup failed', { error });
        return [];
    }
}
