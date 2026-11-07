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
import { DELIVERY_FEE_CLP, DELIVERY_MINIMUM_CLP } from '@/extensions/pj-shared/lib/fulfillment';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { COMBO_PROMOTIONS, type CartEntry, type LineSummary } from './line-summary';
import {
    cartRecommendations,
    type CrossSellBasket,
    type RecommendationKind,
} from '@/extensions/pj-product/lib/cross-sell';
import type { CrossSellCatalog } from '@/extensions/pj-product/lib/upsell';
import type { CartProduct } from './types';

/**
 * Reglas del carrito objetivo (UX-3): una sola oferta por prioridad, el resumen con ahorro y canje, los puntos
 * y la razón del CTA cuando no se puede pagar. Funciones puras: la vista solo pinta lo que devuelven.
 */

export const CANJE_PROMOTION_ID = 'pj-canje-puntos';

/** Prioridad de la venta cruzada (§3.5). */
export type OfferKind = 'convert' | 'drink' | 'dessert';

export interface OfferContext {
    /** Hay una bebida y un postre que ofrecer (los trae el loader). */
    hasDrinkCandidate: boolean;
    hasDessertCandidate: boolean;
    /** Palitos y bebidas 1,5 L que forman el combo. */
    comboSide: string;
    comboDrinks: readonly string[];
    /** Tienda cerrada: no se ofrece nada. */
    storeClosed: boolean;
}

const isPizza = (line: LineSummary) => line.kind === 'pizza' || line.kind === 'halves';
const isDrink = (line: LineSummary) => line.productKind === 'drink' || line.productId.startsWith('cp-coca-cola');
const isDessert = (line: LineSummary) => line.productKind === 'dessert';

/** La primera oferta que aplica, o ninguna. Nunca más de una. */
export function pickOffer(entries: CartEntry[], ctx: OfferContext): OfferKind | null {
    if (ctx.storeClosed) return null;
    const lines = entries.map((entry) => entry.summary);
    if (!lines.some(isPizza)) return null;
    // Sueltos y sin la promoción de combo (si la canasta ya los cobra como combo, no hay nada que convertir).
    const notCombo = (line: LineSummary) => !line.promotions.some((id) => COMBO_PROMOTIONS.includes(id));
    const looseSide = lines.some((line) => line.productId === ctx.comboSide && notCombo(line));
    const looseDrink = lines.some((line) => ctx.comboDrinks.includes(line.productId) && notCombo(line));
    if (looseSide && looseDrink) return 'convert';
    const hasCombo = entries.some((entry) => entry.combo) || lines.some((line) => !notCombo(line));
    if (!hasCombo && !lines.some(isDrink) && ctx.hasDrinkCandidate) return 'drink';
    if (!lines.some(isDessert) && ctx.hasDessertCandidate) return 'dessert';
    return null;
}

/**
 * Precio que muestra una línea (UX-3 §3.4, VAL-C3 H-3). Palitos o bebida que la canasta cobra como combo pero
 * que no se pudieron agrupar bajo su pizza se muestran a precio normal: nunca el precio por componente de la
 * promoción («$4.417»). El ahorro queda en «Ahorro en combos» del resumen.
 */
export function linePrice(line: LineSummary): number {
    return line.promotions.some((id) => COMBO_PROMOTIONS.includes(id)) ? line.baseTotal : line.total;
}

/** Canje de Papa Puntos activo en el carrito (cookie `pj_canje`, la misma que lee CHK). */
export interface CanjeState {
    itemId: string;
    productId: string;
    points: number;
    /** Precio de catálogo de la pizza canjeada («$13.000» tachado). */
    value: number;
}

export interface CartTotals {
    /** «Productos»: suma antes de los ahorros de combo. */
    products: number;
    /** «Ahorro en combos» (0 si no hay). */
    comboSavings: number;
    /** «Canje Papa Puntos» (0 si no hay). */
    canje: number;
    shipping: number;
    total: number;
    /** Puntos que suma el pedido: el canje no los cambia (§3.6). */
    points: number;
    /** Delivery bajo el mínimo: cuánto falta (0 si no aplica). */
    missingForDelivery: number;
}

/**
 * Totales del resumen a partir de las líneas (lo que cobra la canasta).
 * - El canje lo aplica la promoción `pj-canje-puntos` cuando DAT la publique; mientras tanto la línea
 *   canjeada se descuenta aquí por su precio de catálogo (supuesto de demo, anotado en el informe).
 */
export function cartTotals(
    lines: LineSummary[],
    options: { delivery: boolean; doublePoints: boolean; canje: CanjeState | null }
): CartTotals {
    const canjeLine = options.canje ? lines.find((line) => line.itemId === options.canje?.itemId) : undefined;
    const isCanje = (line: LineSummary) => line === canjeLine || line.promotions.includes(CANJE_PROMOTION_ID);
    let products = 0;
    let comboSavings = 0;
    let canje = 0;
    let charged = 0;
    for (const line of lines) {
        if (isCanje(line)) {
            canje += line.baseTotal;
            continue;
        }
        products += line.baseTotal;
        comboSavings += Math.max(0, line.baseTotal - line.total);
        charged += line.total;
    }
    const shipping = options.delivery ? DELIVERY_FEE_CLP : 0;
    const total = charged + shipping;
    return {
        products: products + canje,
        comboSavings,
        canje,
        shipping,
        total,
        points: pointsFor(total, shipping, options.doublePoints),
        missingForDelivery: options.delivery ? Math.max(0, DELIVERY_MINIMUM_CLP - charged) : 0,
    };
}

/** Por qué no se puede pagar (el CTA lo dice en el botón, §3.9). */
export type CheckoutBlock = 'no-fulfillment' | 'store-closed' | 'minimum' | 'pickup-only' | null;

export function checkoutBlock(input: {
    hasFulfillment: boolean;
    storeClosed: boolean;
    missingForDelivery: number;
    pickupOnlyWithDelivery: boolean;
}): CheckoutBlock {
    if (!input.hasFulfillment) return 'no-fulfillment';
    if (input.storeClosed) return 'store-closed';
    if (input.pickupOnlyWithDelivery) return 'pickup-only';
    if (input.missingForDelivery > 0) return 'minimum';
    return null;
}

/** La sección de venta cruzada del carrito (UX-3 §3.5 + S-D19): «Conviértelo en combo» o «¿Le sumamos algo?». */
export type CartSection = { kind: 'convert' } | { kind: 'recommend'; items: CartRecommendationItem[] } | null;

export interface CartRecommendationItem extends CartProduct {
    kind: RecommendationKind;
}

/** Producto de la venta cruzada por ID, con el nombre de la bebida y su tamaño («Coca-Cola 2,5 L»). */
export function crossSellProduct(catalog: CrossSellCatalog, productId: string): CartProduct | null {
    for (const drink of catalog.drinks) {
        const size = drink.sizes.find((s) => s.productId === productId);
        if (size) {
            return {
                productId,
                name: `${drink.name} ${size.size.replace('.', ',')} L`,
                price: size.price,
                image: drink.image,
            };
        }
    }
    const product = [...catalog.sides, ...catalog.desserts].find((p) => p.productId === productId);
    return product ? { productId, name: product.name, price: product.price, image: product.image } : null;
}

/**
 * Una sola sección (UX-3: no un muro). Prioridad 1: «Conviértelo en combo» (palitos y bebida 1,5 L sueltos). Si no,
 * «¿Le sumamos algo?» con hasta 3 recomendaciones (bebida, acompañamiento, postre) según lo que falte, nunca
 * pizzas (`cartRecommendations`, S-D19). Con la tienda cerrada, nada.
 */
export function pickCartSection(
    entries: CartEntry[],
    basket: CrossSellBasket | null | undefined,
    ctx: OfferContext & { catalog: CrossSellCatalog; kinds?: Record<string, string | null | undefined> }
): CartSection {
    if (ctx.storeClosed || !entries.length) return null;
    if (pickOffer(entries, ctx) === 'convert') return { kind: 'convert' };
    const items = cartRecommendations(basket, ctx.kinds).flatMap((rec) => {
        const product = crossSellProduct(ctx.catalog, rec.productId);
        return product ? [{ ...product, kind: rec.kind }] : [];
    });
    return items.length ? { kind: 'recommend', items } : null;
}
