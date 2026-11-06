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

interface LineLike {
    itemId?: string;
    productId?: string;
    quantity?: number;
    price?: number;
    priceAfterItemDiscount?: number;
    optionItems?: Array<{ optionValueId?: string; price?: number; priceAfterItemDiscount?: number }>;
}

interface BasketLike {
    productItems?: LineLike[];
    productTotal?: number;
    productSubTotal?: number;
}

/**
 * Total de una línea tal como la cobra el carrito: precio del producto (con descuentos de la línea) más
 * sus opciones (los extras `pjExtras_<id>` = `si`). SCAPI devuelve las opciones aparte del producto.
 */
export function lineTotal(item: LineLike): number {
    const product = item.priceAfterItemDiscount ?? item.price ?? 0;
    const options = (item.optionItems ?? [])
        .filter((o) => o.optionValueId !== 'no')
        .reduce((sum, o) => sum + (o.priceAfterItemDiscount ?? o.price ?? 0), 0);
    return product + options;
}

/** Suma de las líneas indicadas. */
export function linesTotal(basket: BasketLike | null | undefined, itemIds: string[]): number {
    return (basket?.productItems ?? [])
        .filter((item) => item.itemId && itemIds.includes(item.itemId))
        .reduce((sum, item) => sum + lineTotal(item), 0);
}

/** Líneas de pizza del pedido (especialidades, «Arma tu pizza» y mitades; no combos). */
export function pizzaLineCount(basket: BasketLike | null | undefined): number {
    return (basket?.productItems ?? []).filter((item) => (item.productId ?? '').startsWith('pz-')).length;
}

/** Cantidad de productos del pedido («Ver pedido (3)»). */
export function itemCount(basket: BasketLike | null | undefined): number {
    return (basket?.productItems ?? []).reduce((sum, item) => sum + (item.quantity ?? 1), 0);
}

/** Total del pedido con promociones de producto (lo que muestra «Ver pedido · $X»). */
export function basketTotal(basket: BasketLike | null | undefined): number {
    return basket?.productTotal ?? basket?.productSubTotal ?? 0;
}
