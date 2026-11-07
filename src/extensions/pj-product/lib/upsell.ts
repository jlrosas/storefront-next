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

/**
 * «Hazlo combo» (PRO-02, 04 v2 R6/R7) y «Completa tu pedido» de la ficha (PRO-03).
 * La oferta usa la promoción `pj-hazlo-combo` (CONTRATO §4.2): pizza + Palitos de Ajo + bebida 1,5 L.
 */

export const HAZLO_COMBO_PROMOTION_ID = 'pj-hazlo-combo';
export const HAZLO_COMBO_SIDE = 'cp-palitos-de-ajo';
/** Imagen compuesta del combo (pizza + palitos + bebida). */
export const HAZLO_COMBO_IMAGE_PRODUCT = 'cb-papa-combo-palitos';

/** Sabores de la bebida 1,5 L del combo (CONTRATO §7: variantes con el ID de la API). */
export const HAZLO_COMBO_DRINKS: ReadonlyArray<{ flavor: 'original' | 'zero' | 'light'; productId: string }> = [
    { flavor: 'original', productId: 'cp-coca-cola-2' },
    { flavor: 'zero', productId: 'cp-coca-cola-sin-azucar-10' },
    { flavor: 'light', productId: 'cp-coca-cola-light-7' },
];
/** Sabor por defecto (REV-0: «Sin azúcar»). */
export const DEFAULT_DRINK_FLAVOR = 'zero';

/** «O agrega por separado» de la hoja. */
export const SHEET_EXTRA_SIDES: readonly string[] = ['cp-cheesyquenos', 'cp-chicken-poppers', 'cp-brownie'];

/** «Completa tu pedido» de la ficha. */
export const PDP_SIDES: readonly string[] = [
    'cp-palitos-de-ajo',
    'cp-cheesyquenos',
    'cp-coca-cola-2',
    'cp-brownie',
    'cp-chicken-poppers',
];

export interface SideProduct {
    productId: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
}

export interface HazloComboOffer {
    promotionId: string;
    /** Precio de palitos + bebida con la promoción («+$6.990»). */
    price: number;
    /** Lo que costarían por separado («$9.480 por separado»). */
    regularPrice: number;
    /** «Ahorras $2.490». */
    savings: number;
    image: string | null;
    side: SideProduct;
    drinks: Array<SideProduct & { flavor: string }>;
}

/** Montos en pesos de un texto («por $6.990 (ahorras $2.490)» → [6990, 2490]). */
export function parseClpAmounts(text: string | null | undefined): number[] {
    if (!text) return [];
    return [...text.matchAll(/\$\s?(\d{1,3}(?:\.\d{3})+|\d+)/g)].map((m) => Number(m[1].replace(/\./g, '')));
}

/**
 * Precio y ahorro de la oferta según la promoción. El monto del combo viaja en el mensaje de la
 * promoción (`calloutMsg`, administrable en Business Manager); el ahorro se valida contra los precios
 * del catálogo. Si el mensaje no trae un monto, la oferta se muestra al precio normal y sin ahorro.
 */
export function comboPricing(
    calloutMsg: string | null | undefined,
    regularPrice: number
): { price: number; savings: number } {
    const [price] = parseClpAmounts(calloutMsg);
    if (!price || price >= regularPrice) return { price: regularPrice, savings: 0 };
    return { price, savings: regularPrice - price };
}

/** Ahorro real que aplicó la promoción en el carrito (suma de los ajustes de `pj-hazlo-combo`). */
export function promotionSavingsInBasket(
    basket: { productItems?: Array<{ priceAdjustments?: Array<{ promotionId?: string; price?: number }> }> } | null,
    promotionId = HAZLO_COMBO_PROMOTION_ID
): number {
    let total = 0;
    for (const item of basket?.productItems ?? []) {
        for (const adjustment of item.priceAdjustments ?? []) {
            if (adjustment.promotionId === promotionId) total += Math.abs(adjustment.price ?? 0);
        }
    }
    return total;
}

/** Una bebida de «Completa tu pedido» con sus tamaños (chips «1,5 L · $3.490», «2,5 L · $4.490»). */
export interface CrossSellDrink {
    flavor: 'original' | 'zero';
    name: string;
    image: string | null;
    sizes: Array<{ size: '1.5' | '2.5'; productId: string; price: number }>;
}

/** Catálogo de la venta cruzada (S-D19): bebidas por tamaño, acompañamientos y postres. */
export interface CrossSellCatalog {
    drinks: CrossSellDrink[];
    sides: SideProduct[];
    desserts: SideProduct[];
}

export const EMPTY_CROSS_SELL: CrossSellCatalog = { drinks: [], sides: [], desserts: [] };

/** Datos del paso «Completa tu pedido» de la hoja (`/resource/pj-upsell`). */
export interface SheetUpsell {
    offer: HazloComboOffer | null;
    extras: SideProduct[];
    catalog: CrossSellCatalog;
}
