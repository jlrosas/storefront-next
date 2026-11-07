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
import { HAZLO_COMBO_PROMOTION_ID, HAZLO_COMBO_SIDE } from './upsell';

/**
 * Regla única de venta cruzada (S-D19, EVAL-agregar §5): qué se ofrece después de agregar una pizza o un combo
 * con pizzas («Completa tu pedido» de la hoja, la ficha y el constructor) y qué recomienda el carrito
 * («¿Le sumamos algo?»). Funciones puras sobre la canasta de SCAPI: la usan PRO, OFE y CAR.
 */

/** Qué se acaba de agregar. */
export type AddedKind =
    | 'pizza'
    | 'halves'
    | 'builder'
    | 'super-duo'
    | 'super-trio'
    | 'pizza-del-mes'
    /** Otro combo con pizza (Papa Combo Palitos, Papa Combo con Postre, Papa Flash). */
    | 'combo'
    /** Bebida, acompañamiento o postre: después de estos no se ofrece nada (04 R6). */
    | 'simple';

export type ProductKind = 'pizza' | 'combo' | 'drink' | 'side' | 'dessert' | 'other';

/** Tamaños de bebida que ofrece la venta cruzada (catálogo: 1,5 L y 2,5 L; no hay 2 L ni 3 L). */
export type DrinkSize = '1.5' | '2.5';

/** Sabores de la bebida de la venta cruzada. */
export type DrinkFlavor = 'original' | 'zero';

/** Variantes de bebida por sabor y tamaño (IDs de la API del cliente, CONTRATO §7). */
export const CROSS_SELL_DRINKS: ReadonlyArray<{
    flavor: DrinkFlavor;
    masterId: string;
    sizes: Readonly<Record<DrinkSize, string>>;
}> = [
    { flavor: 'original', masterId: 'cp-coca-cola', sizes: { '1.5': 'cp-coca-cola-2', '2.5': 'cp-coca-cola-3' } },
    {
        flavor: 'zero',
        masterId: 'cp-coca-cola-sin-azucar',
        sizes: { '1.5': 'cp-coca-cola-sin-azucar-10', '2.5': 'cp-coca-cola-sin-azucar-9' },
    },
];

/** 1,5 L → 2,5 L del mismo sabor, para «Súbela a 2,5 L». Incluye las bebidas que no se ofrecen pero se suben. */
export const DRINK_UPSIZE: Readonly<Record<string, string>> = {
    'cp-coca-cola-2': 'cp-coca-cola-3',
    'cp-coca-cola-sin-azucar-10': 'cp-coca-cola-sin-azucar-9',
    'cp-coca-cola-light-7': 'cp-coca-cola-light-6',
    'cp-sprite-18': 'cp-sprite-19',
    'cp-fanta-22': 'cp-fanta-23',
};

/** Acompañamientos de la venta cruzada, en orden (los palitos primero: son los de compartir). */
export const CROSS_SELL_SIDES: readonly string[] = [
    HAZLO_COMBO_SIDE,
    'cp-cheesyquenos',
    'cp-chicken-poppers',
    'cp-alitas-de-pollo',
];

/** Postres de la venta cruzada, en orden. */
export const CROSS_SELL_DESSERTS: readonly string[] = ['cp-cookie', 'cp-brownie', 'cp-cinnapie'];

/** Bebidas del catálogo (maestros): todo lo que empieza así es bebida aunque no se ofrezca. */
const DRINK_PREFIXES = ['cp-coca-cola', 'cp-fanta', 'cp-sprite', 'cp-red-bull', 'cp-agua'];
/** Acompañamientos y postres del catálogo que no están en las listas de la venta cruzada. */
const OTHER_SIDES = [
    'cp-palitos-de-ajo-5-unidades',
    'cp-mini-palitos-de-ajo-6-unidades',
    'cp-mini-palitos-de-ajo-y-queso',
    'cp-palitos-de-queso',
    'cp-palitos-de-queso-y-tocino',
    'cp-pesto-rolls',
    'cp-rolls',
    'cp-cheesy-veggies',
];
const OTHER_DESSERTS = [
    'cp-pie-con-nutella',
    'cp-palitos-de-canela',
    'cp-boom-de-trencito',
    'cp-dulce-y-truco',
    'cp-helados-individuales',
    'cp-helados-la-cremeria',
    'cp-helados-tipo-bombones',
    'cp-el-ultimo-slice',
];

/** Promociones que vuelven combo a palitos + bebida 1,5 L (las mismas que agrupa el carrito). */
const COMBO_DRINK_PROMOTIONS = [HAZLO_COMBO_PROMOTION_ID, 'pj-combo-palitos-upsell'];

const matchesFamily = (id: string, base: string) => id === base || id.startsWith(`${base}-`);

/**
 * Tipo de un producto por su ID. `kinds` (el `c_pjKind` del catálogo, si se conoce) manda sobre la heurística
 * por prefijo, que cubre las líneas de la canasta (SCAPI no trae `c_pjKind` en la línea).
 */
export function productKindOf(
    productId: string,
    kinds: Readonly<Record<string, string | null | undefined>> = {}
): ProductKind {
    const known = kinds[productId];
    if (known === 'pizza' || known === 'builder') return 'pizza';
    if (known === 'combo' || known === 'drink' || known === 'side' || known === 'dessert') return known;
    if (productId.startsWith('pz-')) return 'pizza';
    if (productId.startsWith('cb-')) return 'combo';
    if (DRINK_PREFIXES.some((prefix) => matchesFamily(productId, prefix))) return 'drink';
    if ([...CROSS_SELL_SIDES, ...OTHER_SIDES].some((id) => matchesFamily(productId, id))) return 'side';
    if ([...CROSS_SELL_DESSERTS, ...OTHER_DESSERTS].some((id) => matchesFamily(productId, id))) return 'dessert';
    return 'other';
}

/** Línea de la canasta (subconjunto de `ProductItem` de SCAPI). */
export interface CrossSellLine {
    itemId?: string;
    productId?: string;
    quantity?: number;
    priceAdjustments?: Array<{ promotionId?: string }>;
    c_pjComboChoices?: unknown;
    [key: string]: unknown;
}

export interface CrossSellBasket {
    productItems?: CrossSellLine[];
}

/** Elecciones de un combo con ficha (`c_pjComboChoices`, texto JSON o lista). */
function choiceProducts(raw: unknown): string[] {
    let value: unknown = raw;
    if (typeof raw === 'string') {
        try {
            value = JSON.parse(raw);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(value)) return [];
    return value.flatMap((entry) => {
        if (typeof entry === 'string') return [entry];
        const product = (entry as { product?: unknown } | null)?.product;
        return typeof product === 'string' ? [product] : [];
    });
}

export interface BasketContents {
    /** Pizzas del pedido (unidades), contando las de los combos. */
    pizzas: number;
    /** Líneas de pizza sueltas (`pz-*`), como `pizzaLineCount`. */
    pizzaLines: number;
    hasCombo: boolean;
    hasDrink: boolean;
    hasSide: boolean;
    hasDessert: boolean;
    /** Bebida 1,5 L suelta (sin promoción de combo) que se puede subir a 2,5 L. */
    upsizable: { itemId: string; from: string; to: string } | null;
}

/** Qué hay en el pedido: pizzas, bebida, acompañamiento y postre (incluido lo que traen los combos). */
export function basketContents(
    basket: CrossSellBasket | null | undefined,
    kinds: Readonly<Record<string, string | null | undefined>> = {}
): BasketContents {
    const out: BasketContents = {
        pizzas: 0,
        pizzaLines: 0,
        hasCombo: false,
        hasDrink: false,
        hasSide: false,
        hasDessert: false,
        upsizable: null,
    };
    const mark = (kind: ProductKind, quantity: number) => {
        if (kind === 'pizza') out.pizzas += quantity;
        else if (kind === 'drink') out.hasDrink = true;
        else if (kind === 'side') out.hasSide = true;
        else if (kind === 'dessert') out.hasDessert = true;
    };
    for (const line of basket?.productItems ?? []) {
        const productId = line.productId ?? '';
        const quantity = Math.max(1, line.quantity ?? 1);
        const kind = productKindOf(productId, kinds);
        if (kind === 'combo') {
            out.hasCombo = true;
            for (const choice of choiceProducts(line.c_pjComboChoices)) mark(productKindOf(choice, kinds), quantity);
            continue;
        }
        if (kind === 'pizza') out.pizzaLines += 1;
        mark(kind, quantity);
        const inCombo = (line.priceAdjustments ?? []).some((a) => COMBO_DRINK_PROMOTIONS.includes(a.promotionId ?? ''));
        if (kind === 'drink' && !inCombo && !out.upsizable && line.itemId && DRINK_UPSIZE[productId]) {
            out.upsizable = { itemId: line.itemId, from: productId, to: DRINK_UPSIZE[productId] };
        }
    }
    return out;
}

/** Lo que ofrece «Completa tu pedido» después de agregar. `null`: no se ofrece nada. */
export interface CrossSellPlan {
    /** «Hazlo combo» arriba: solo con la primera pizza suelta del pedido y sin combo, palitos ni bebida. */
    hazloCombo: boolean;
    /**
     * Bebida: `add` con chips por tamaño (y el tamaño sugerido marcado), `upsize` para subir la bebida 1,5 L suelta
     * a 2,5 L, o `null` si el pedido ya trae bebida (también dentro de un combo: subirla ahí necesita a DAT).
     */
    drink: { mode: 'add'; suggested: DrinkSize } | { mode: 'upsize'; itemId: string; from: string; to: string } | null;
    /** Acompañamientos (con foto, precio y «+»). */
    sides: boolean;
    desserts: boolean;
    /** Mesa grande (Super Trío o 3+ pizzas): palitos primero y bebida grande. */
    party: boolean;
    pizzas: number;
}

const PIZZA_KINDS: readonly AddedKind[] = ['pizza', 'halves', 'builder'];

/**
 * Regla central de «Completa tu pedido» (S-D19). Se llama con la canasta **después** de agregar.
 *
 * - Solo después de una pizza o de un combo con pizzas; nunca después de una bebida o un acompañamiento.
 * - «Hazlo combo» va arriba solo con una pizza suelta, si es la primera del pedido y no hay combo, palitos ni
 *   bebida (04 v2: un solo «Hazlo combo» por pedido; D-P1-1).
 * - Bebida por tamaño si falta: 2,5 L sugerida desde dos pizzas (Super Dúo, Super Trío), 1,5 L con una. Con una
 *   bebida 1,5 L suelta se ofrece subirla a 2,5 L.
 * - Acompañamientos si faltan (o siempre en una mesa grande) y postres si faltan.
 */
export function nextCrossSell(
    basket: CrossSellBasket | null | undefined,
    addedKind: AddedKind,
    kinds: Readonly<Record<string, string | null | undefined>> = {}
): CrossSellPlan | null {
    if (addedKind === 'simple') return null;
    const contents = basketContents(basket, kinds);
    const pizzas = Math.max(contents.pizzas, 1);
    const party = addedKind === 'super-trio' || pizzas >= 3;
    const hazloCombo =
        PIZZA_KINDS.includes(addedKind) &&
        contents.pizzaLines === 1 &&
        !contents.hasCombo &&
        !contents.hasSide &&
        !contents.hasDrink;
    let drink: CrossSellPlan['drink'] = null;
    if (!contents.hasDrink) {
        const big = pizzas >= 2 || addedKind === 'super-duo' || party;
        drink = { mode: 'add', suggested: big ? '2.5' : '1.5' };
    } else if (contents.upsizable) {
        drink = { mode: 'upsize', ...contents.upsizable };
    }
    return {
        hazloCombo,
        drink,
        sides: !contents.hasSide || party,
        desserts: !contents.hasDessert,
        party,
        pizzas,
    };
}

/** Lo que recomienda el carrito: una bebida, un acompañamiento y un postre, según lo que falte. Nunca pizzas. */
export type RecommendationKind = 'drink' | 'side' | 'dessert';

export interface CartRecommendation {
    kind: RecommendationKind;
    productId: string;
}

/**
 * «¿Le sumamos algo?» (S-D19): como máximo tres, una por tipo y en el orden bebida, acompañamiento, postre. Si el
 * pedido ya trae bebida (aunque sea dentro de un combo) no ofrece bebida; lo mismo con los otros tipos. Con dos
 * pizzas o más, la bebida sugerida es la de 2,5 L. Sin productos en el pedido no recomienda nada.
 */
export function cartRecommendations(
    basket: CrossSellBasket | null | undefined,
    kinds: Readonly<Record<string, string | null | undefined>> = {}
): CartRecommendation[] {
    const lines = basket?.productItems ?? [];
    if (!lines.length) return [];
    const contents = basketContents(basket, kinds);
    const inBasket = new Set(lines.map((line) => line.productId));
    const out: CartRecommendation[] = [];
    if (!contents.hasDrink) {
        const size: DrinkSize = contents.pizzas >= 2 ? '2.5' : '1.5';
        out.push({ kind: 'drink', productId: CROSS_SELL_DRINKS[0].sizes[size] });
    }
    if (!contents.hasSide) {
        const side = CROSS_SELL_SIDES.find((id) => !inBasket.has(id));
        if (side) out.push({ kind: 'side', productId: side });
    }
    if (!contents.hasDessert) {
        const dessert = CROSS_SELL_DESSERTS.find((id) => !inBasket.has(id));
        if (dessert) out.push({ kind: 'dessert', productId: dessert });
    }
    return out;
}

/** Tipo de lo agregado por el constructor o la ficha de un combo. */
export function addedKindForCombo(comboId: string): AddedKind {
    if (comboId === 'cb-super-duo') return 'super-duo';
    if (comboId === 'cb-super-trio') return 'super-trio';
    if (comboId === 'cb-pizza-del-mes') return 'pizza-del-mes';
    return 'combo';
}
