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
import { lineTotal } from '@/extensions/pj-product/lib/cart-lines';
import { HALVES_PRODUCT_ID, parseHalves } from '@/extensions/pj-product/lib/halves';
import { COMBO_FOR_ATTRIBUTE, comboGroupOf, comboOptionOf } from '@/extensions/pj-product/lib/combo-cart';
import {
    EXTRA_OPTION_PREFIX,
    displayIngredientName,
    lowerIngredientName,
    removedFromItem,
    sortExtras,
} from '@/extensions/pj-product/lib/pizza';

/**
 * Lectura única de una línea del carrito (CAR-01 crit. 2, #34, #37): la usan `/cart`, el panel «Tu pedido»
 * del menú y el aviso de agregado. Todo sale de la línea de SCAPI (`productId` de la variante,
 * `optionItems` con `pjExtras_<id>`, `c_pjRemoved`, `c_pjHalves`, `c_pjComboChoices`); los nombres de las
 * mitades y de las pizzas del combo llegan aparte (`names`), porque la línea solo trae sus IDs.
 */

/** Línea de SCAPI (subconjunto que se lee). */
export interface SummaryLineItem {
    itemId?: string;
    productId?: string;
    productName?: string;
    itemText?: string;
    quantity?: number;
    price?: number;
    priceAfterItemDiscount?: number;
    optionItems?: Array<{
        optionId?: string;
        optionValueId?: string;
        itemText?: string;
        productName?: string;
        price?: number;
        priceAfterItemDiscount?: number;
    }>;
    priceAdjustments?: Array<{ promotionId?: string; price?: number }>;
    c_pjRemoved?: unknown;
    c_pjHalves?: unknown;
    c_pjComboChoices?: unknown;
    [key: string]: unknown;
}

/** Nombre (y foto) de un producto por ID: especialidades de las mitades, pizzas y bebidas del combo. */
export interface LineProduct {
    name: string;
    image: string | null;
    /** `c_pjKind`: `pizza`, `combo`, `side`, `drink`, `dessert`… */
    kind?: string | null;
    /** `c_pjPriceBefore` del combo («Ahorras $X» = antes − precio). */
    priceBefore?: number | null;
    /** `c_pjDispatch` del combo: `delivery`, `pickup` o `both`. */
    dispatch?: string | null;
}
export type LineProducts = Record<string, LineProduct>;

export interface LineLabels {
    /** `family` → «Familiar». Devuelve `''` si no lo conoce. */
    size: (id: string) => string;
    /** `traditional` → «Tradicional», `stuffed` → «Borde de queso mozzarella». */
    crust: (id: string) => string;
    /** «sin {{name}}» */
    without: (name: string) => string;
    /** «+ {{name}}» */
    plus: (name: string) => string;
}

export type LineKind = 'pizza' | 'halves' | 'combo' | 'other';

export interface LineExtra {
    id: string;
    name: string;
    /** Precio por pizza que cobra la canasta por el extra (0 si no viene). */
    price: number;
}

export interface LineSummary {
    itemId: string;
    productId: string;
    kind: LineKind;
    /** Maestro de la pizza (`pz-pollo-bbq`); para mitades, `pz-mitades`. */
    masterId: string | null;
    /** «Pollo BBQ», «Pizza mitad y mitad», «Super Dúo». */
    name: string;
    size: string | null;
    crust: string | null;
    /** «Familiar · Tradicional · ½ Pollo BBQ · ½ Pepperoni · sin cebolla» (sin los extras). */
    detail: string;
    extras: LineExtra[];
    removed: Array<{ id: string; name: string }>;
    halves: Array<{ id: string; name: string; image: string | null }>;
    /** Pizzas y productos elegidos del combo («Pollo BBQ», «Todas las Carnes»). */
    choices: string[];
    quantity: number;
    /** Precio de la línea con sus opciones (lo que cobra la canasta). */
    total: number;
    /** Lo mismo antes de las promociones de la línea (`price` + opciones). */
    baseTotal: number;
    /** Promociones que ajustan la línea (`pj-hazlo-combo`, `pj-canje-puntos`…). */
    promotions: string[];
    /** `c_pjKind` del producto, si se conoce (`drink`, `dessert`, `side`…). */
    productKind: string | null;
    /** Combos: «Ahorras $X» frente a `c_pjPriceBefore` (0 si no aplica). */
    savings: number;
    /** «Editar»: la hoja de PRO (`sheet`) o el armador de mitades (`halves`). */
    edit: 'sheet' | 'halves' | null;
    /** Super Dúo / Super Trío armado (S-D20, §7.1): grupo `c_pjComboGroup` de la pizza, o `null`. */
    comboGroup: string | null;
    /** Opción `pjCombo` de la pizza (`duo` / `trio`), o `null`. Se reenvía al editar. */
    comboOption: string | null;
    /** `c_pjComboFor` (§7.1): la pizza o el grupo al que acompaña esta línea de venta cruzada. */
    comboFor: string | null;
}

const SIZES = ['individual', 'medium', 'family', 'extra_large'] as const;
const CRUSTS = [
    'parmesan_base',
    'pan_pizza_stuffed',
    'cheddar_stuffed',
    'traditional',
    'thin',
    'stuffed',
    'parmesan',
    'philadelphia',
    'cauliflower',
    'croissant',
] as const;
const VARIANT_RE = new RegExp(`^(pz-.+?)-(${SIZES.join('|')})-(${CRUSTS.join('|')})$`);

/** `pz-pollo-bbq-family-traditional` → `{ masterId: 'pz-pollo-bbq', size: 'family', crust: 'traditional' }`. */
export function parseVariantId(
    productId: string | undefined
): { masterId: string; size: string; crust: string } | null {
    const match = VARIANT_RE.exec(productId ?? '');
    return match ? { masterId: match[1], size: match[2], crust: match[3] } : null;
}

export function lineKind(productId: string | undefined): LineKind {
    const id = productId ?? '';
    if (id === HALVES_PRODUCT_ID || id.startsWith(`${HALVES_PRODUCT_ID}-`)) return 'halves';
    if (id.startsWith('pz-')) return 'pizza';
    if (id.startsWith('cb-')) return 'combo';
    return 'other';
}

/**
 * Atributos de la línea que pueden traer las elecciones de un combo, en orden de preferencia. Hoy OFE escribe
 * `c_pjComboChoices` (CONTRATO §7); los combos con ficha (PRO-08) se suman aquí cuando fijen su formato.
 */
export const COMBO_CHOICE_ATTRIBUTES: readonly string[] = ['c_pjComboChoices'];

/**
 * Elecciones de un combo → `[{ slot, product }]`. Acepta texto JSON o lista, con entradas `{ slot, product }`,
 * `{ slot, productId }` o solo el ID del producto.
 */
export function parseComboChoices(raw: unknown): Array<{ slot: string; product: string }> {
    let value: unknown = raw;
    if (typeof raw === 'string') {
        try {
            value = JSON.parse(raw);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(value)) return [];
    const out: Array<{ slot: string; product: string }> = [];
    value.forEach((entry, index) => {
        if (typeof entry === 'string' && entry) {
            out.push({ slot: String(index + 1), product: entry });
            return;
        }
        if (!entry || typeof entry !== 'object') return;
        const e = entry as { slot?: unknown; product?: unknown; productId?: unknown };
        const product =
            typeof e.product === 'string' ? e.product : typeof e.productId === 'string' ? e.productId : null;
        if (product) out.push({ slot: typeof e.slot === 'string' ? e.slot : String(index + 1), product });
    });
    return out;
}

/** Elecciones del combo de una línea, desde el primer atributo de `COMBO_CHOICE_ATTRIBUTES` que traiga alguna. */
export function comboChoicesFromItem(item: Record<string, unknown>): Array<{ slot: string; product: string }> {
    for (const attribute of COMBO_CHOICE_ATTRIBUTES) {
        const choices = parseComboChoices(item[attribute]);
        if (choices.length) return choices;
    }
    return [];
}

/** El nombre del producto para mostrar: el de una variante de pizza va a su maestro («Pollo BBQ»). */
function choiceProductId(productId: string): string {
    return parseVariantId(productId)?.masterId ?? productId;
}

/** IDs de producto cuyo nombre o foto necesitan las líneas (mitades, elecciones del combo y las líneas mismas). */
export function lineProductIds(items: SummaryLineItem[] | undefined): string[] {
    const ids = new Set<string>();
    for (const item of items ?? []) {
        if (item.productId) ids.add(item.productId);
        const master = parseVariantId(item.productId)?.masterId;
        if (master) ids.add(master);
        for (const half of parseHalves(item.c_pjHalves)) ids.add(half);
        for (const choice of comboChoicesFromItem(item)) ids.add(choiceProductId(choice.product));
    }
    return [...ids];
}

/** «Champiñon: Champiñon» / «Cebolla: Sin extra» → «Champiñon» / «Cebolla». */
function optionName(option: { itemText?: string; productName?: string } | undefined): string | null {
    const text = option?.itemText ?? option?.productName;
    if (!text) return null;
    const name = text.split(':')[0]?.trim();
    return name ? displayIngredientName(name) : null;
}

/** «salsa-bbq» → «Salsa bbq» (solo si la línea no trae el nombre). */
function humanizeId(id: string): string {
    const text = id.replace(/^(ing|pz|cb|cp)-/, '').replace(/[-_]+/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Formato de la demo para nombres del catálogo (UX-3 §3.11): volumen con coma decimal y unidad corta
 * («1.5 LT» → «1,5 L», «350 ML» → «350 ml») y sin la marca repetida («Coca-Cola Coca-Cola 350 ml»).
 */
export function displayProductName(name: string): string {
    return name
        .replace(/(\d+)[.,](\d+)\s*(?:LT|Lt|lt|L)\b/g, '$1,$2 L')
        .replace(/(\d+)\s*(?:LT|Lt|lt)\b/g, '$1 L')
        .replace(/(\d+)\s*ML\b/gi, '$1 ml')
        .replace(/^(\S+(?:\s\S+)?)\s+\1\b/, '$1')
        .replace(/\s{2,}/g, ' ')
        .trim();
}

/** Quita «Familiar Tradicional» del final del nombre de la línea («Pollo BBQ Familiar Tradicional» → «Pollo BBQ»). */
export function stripVariantSuffix(name: string, sizeLabel: string, crustLabel: string): string {
    const suffix = [sizeLabel, crustLabel].filter(Boolean).join(' ');
    if (suffix && name.endsWith(` ${suffix}`)) return name.slice(0, -suffix.length - 1).trim();
    return name;
}

export function summarizeLine(item: SummaryLineItem, labels: LineLabels, names: LineProducts = {}): LineSummary {
    const productId = item.productId ?? '';
    const kind = lineKind(productId);
    const variant = parseVariantId(productId);
    const sizeLabel = variant ? labels.size(variant.size) : '';
    const crustLabel = variant ? labels.crust(variant.crust) : '';
    const rawName = item.productName ?? item.itemText ?? names[productId]?.name ?? productId;

    const options = item.optionItems ?? [];
    const optionById = new Map(
        options
            .filter((o) => o.optionId?.startsWith(EXTRA_OPTION_PREFIX))
            .map((o) => [(o.optionId as string).slice(EXTRA_OPTION_PREFIX.length), o])
    );
    // Contrato §7: las opciones en `no` no se muestran. Mismo orden que la hoja (los destacados primero).
    const extras: LineExtra[] = sortExtras(
        options
            .filter((o) => o.optionValueId === 'si' && o.optionId?.startsWith(EXTRA_OPTION_PREFIX))
            .map((o) => {
                const id = (o.optionId as string).slice(EXTRA_OPTION_PREFIX.length);
                // SCAPI da el precio de la opción por la cantidad de la línea: se muestra por unidad.
                const lineQuantity = Math.max(1, item.quantity ?? 1);
                const price = Math.round((o.priceAfterItemDiscount ?? o.price ?? 0) / lineQuantity);
                return { id, name: optionName(o) ?? humanizeId(id), price };
            })
    );
    const removed = removedFromItem({ c_pjRemoved: item.c_pjRemoved as string[] | string | null | undefined }).map(
        (id) => ({ id, name: lowerIngredientName(optionName(optionById.get(id)) ?? humanizeId(id)) })
    );
    const halves = kind === 'halves' ? parseHalves(item.c_pjHalves) : [];
    const halvesInfo = halves.map((id) => ({
        id,
        name: names[id]?.name ?? humanizeId(id),
        image: names[id]?.image ?? null,
    }));
    const rawChoices = kind === 'combo' ? comboChoicesFromItem(item) : [];
    // Solo pizzas (Super Dúo): «Pollo BBQ + Todas las Carnes». Con complementos (Papa Flash):
    // «Pepperoni individual · Mini palitos · Coca-Cola 350 ml».
    const onlyPizzas = rawChoices.every((choice) => parseVariantId(choice.product));
    const choices = rawChoices.map((choice) => {
        const pizza = parseVariantId(choice.product);
        const id = choiceProductId(choice.product);
        const base = displayProductName(names[id]?.name ?? names[choice.product]?.name ?? humanizeId(id));
        if (!pizza || onlyPizzas) return base;
        const size = labels.size(pizza.size).toLowerCase();
        return size ? `${base} ${size}` : base;
    });

    const name =
        kind === 'pizza' && variant
            ? (names[variant.masterId]?.name ?? stripVariantSuffix(rawName, sizeLabel, crustLabel))
            : displayProductName(stripVariantSuffix(rawName, sizeLabel, crustLabel));

    const parts: string[] = [];
    if (sizeLabel) parts.push(sizeLabel);
    if (crustLabel) parts.push(crustLabel);
    for (const half of halvesInfo) parts.push(`½\u00a0${half.name}`); // «½» no queda solo al final de la línea
    for (const r of removed) parts.push(labels.without(r.name));
    if (choices.length) parts.push(choices.join(onlyPizzas ? ' + ' : ' · '));
    const total = lineTotal(item);
    const baseTotal =
        (item.price ?? 0) + options.filter((o) => o.optionValueId !== 'no').reduce((sum, o) => sum + (o.price ?? 0), 0);
    const priceBefore = names[productId]?.priceBefore ?? null;
    const quantity = item.quantity ?? 1;
    const savings =
        kind === 'combo' && priceBefore && priceBefore * quantity > total ? priceBefore * quantity - total : 0;

    return {
        itemId: item.itemId ?? '',
        productId,
        kind,
        masterId: kind === 'halves' ? HALVES_PRODUCT_ID : (variant?.masterId ?? null),
        name,
        size: variant?.size ?? null,
        crust: variant?.crust ?? null,
        detail: parts.join(' · '),
        extras,
        removed,
        halves: halvesInfo,
        choices,
        quantity,
        total,
        baseTotal: Math.max(baseTotal, total),
        promotions: [...new Set((item.priceAdjustments ?? []).map((a) => a.promotionId ?? '').filter(Boolean))],
        productKind: names[productId]?.kind ?? null,
        savings,
        edit: kind === 'pizza' ? 'sheet' : kind === 'halves' ? 'halves' : null,
        comboGroup: comboGroupOf(item),
        comboOption: comboOptionOf(item),
        comboFor: typeof item[COMBO_FOR_ATTRIBUTE] === 'string' ? (item[COMBO_FOR_ATTRIBUTE] as string) : null,
    };
}

/**
 * La configuración en una sola línea, en el mismo orden que el resumen de la hoja de PRO
 * («Familiar · Tradicional · sin cebolla · + Pepperoni · + Champiñon»): aviso de agregado y panel «Tu pedido».
 */
export function lineText(summary: LineSummary, labels: Pick<LineLabels, 'plus'>): string {
    return [summary.detail, ...summary.extras.map((extra) => labels.plus(extra.name))].filter(Boolean).join(' · ');
}

/** Suma de las líneas tal como las cobra la canasta. */
export function summariesTotal(summaries: LineSummary[]): number {
    return summaries.reduce((sum, line) => sum + line.total, 0);
}

/** Promociones que vuelven combo a palitos + bebida 1,5 L (la de la hoja y la del carrito). */
export const COMBO_PROMOTIONS: readonly string[] = ['pj-hazlo-combo', 'pj-combo-palitos-upsell'];

/** «Combo Palitos y bebida» (UX-3 §3.4): línea propia bajo su pizza. */
export interface ComboGroup {
    /** «Palitos de Ajo», «Coca-Cola Sin azúcar 1,5 L». */
    parts: string[];
    /** Líneas del carrito que forman el combo (para quitarlo entero). */
    itemIds: string[];
    /** Productos de las líneas (para «Deshacer»). */
    productIds: string[];
    /** Lo que cobra la canasta por las dos líneas, con la promoción. */
    total: number;
    /** Lo que costarían sueltas (`price` de las líneas). */
    baseTotal: number;
    /** «Ahorras $X»: lo que descontó la promoción en la canasta. */
    savings: number;
}

export interface CartEntry {
    summary: LineSummary;
    combo: ComboGroup | null;
}

export interface HazloComboIds {
    side: string;
    drinks: readonly string[];
}

const hasComboPromotion = (line: LineSummary) => line.promotions.some((id) => COMBO_PROMOTIONS.includes(id));

/**
 * Agrupa palitos + bebida 1,5 L que la canasta cobra como combo (promoción `pj-hazlo-combo` o
 * `pj-combo-palitos-upsell`) bajo la pizza que los originó (VAL-C2 H1). La canasta guarda las líneas en orden
 * de creación y «Hazlo combo» agrega las dos piezas justo después de su pizza: solo se agrupan si van juntas y
 * la línea inmediatamente anterior es una pizza o mitades, o si el pedido tiene una sola pizza y ningún combo
 * con ficha. Si no hay una pizza clara (varias pizzas, o un `cb-*` con sus complementos de «Completa tu
 * pedido»), quedan como líneas propias.
 */
export function groupHazloCombo(
    summaries: LineSummary[],
    ids: HazloComboIds,
    /** Líneas que no cuentan como pizza del combo (la pizza canjeada con Papa Puntos). */
    ignore: readonly string[] = []
): CartEntry[] {
    const isPizza = (line: LineSummary) =>
        (line.kind === 'pizza' || line.kind === 'halves') && !ignore.includes(line.itemId);
    const isSide = (line: LineSummary) => line.productId === ids.side && line.quantity === 1 && hasComboPromotion(line);
    const isDrink = (line: LineSummary) =>
        ids.drinks.includes(line.productId) && line.quantity === 1 && hasComboPromotion(line);
    const indexed = summaries.map((line, index) => ({ line, index }));
    const combos = new Map<number, ComboGroup>();
    const grouped = new Set<number>();
    const makeGroup = (side: LineSummary, drink: LineSummary): ComboGroup => {
        const total = side.total + drink.total;
        const baseTotal = side.baseTotal + drink.baseTotal;
        return {
            parts: [side.name, drink.name],
            itemIds: [side.itemId, drink.itemId],
            productIds: [side.productId, drink.productId],
            total,
            baseTotal,
            savings: Math.max(0, baseTotal - total),
        };
    };
    // §7.1: con `c_pjComboFor` la línea dice a qué pizza (o grupo de combo) acompaña; manda sobre el orden.
    const anchorOf = (target: string): number => {
        const direct = summaries.findIndex((line) => line.itemId === target && isPizza(line));
        if (direct >= 0) return direct;
        let last = -1;
        summaries.forEach((line, index) => {
            if (line.comboGroup === target && isPizza(line)) last = index;
        });
        return last;
    };
    const targets = [...new Set(summaries.map((line) => line.comboFor).filter((v): v is string => Boolean(v)))];
    for (const target of targets) {
        const anchor = anchorOf(target);
        if (anchor < 0 || combos.has(anchor)) continue;
        const side = indexed.find(({ line, index }) => line.comboFor === target && isSide(line) && !grouped.has(index));
        const drink = indexed.find(
            ({ line, index }) => line.comboFor === target && isDrink(line) && !grouped.has(index)
        );
        if (!side || !drink) continue;
        combos.set(anchor, makeGroup(side.line, drink.line));
        grouped.add(side.index);
        grouped.add(drink.index);
    }
    for (let i = 1; i + 1 < summaries.length; i += 1) {
        const a = summaries[i];
        const b = summaries[i + 1];
        const pair = isSide(a) && isDrink(b) ? [a, b] : isDrink(a) && isSide(b) ? [b, a] : null;
        const anchor = i - 1;
        if (!pair || grouped.has(i) || grouped.has(i + 1) || combos.has(anchor) || !isPizza(summaries[anchor])) {
            continue;
        }
        const [side, drink] = pair;
        const total = side.total + drink.total;
        const baseTotal = side.baseTotal + drink.baseTotal;
        combos.set(anchor, {
            parts: [side.name, drink.name],
            itemIds: [side.itemId, drink.itemId],
            productIds: [side.productId, drink.productId],
            total,
            baseTotal,
            savings: Math.max(0, baseTotal - total),
        });
        grouped.add(i);
        grouped.add(i + 1);
        i += 1;
    }
    // Sin pizza contigua: si el pedido tiene una sola pizza y ningún combo con ficha, la pizza es clara.
    const pizzas = indexed.filter(({ line }) => isPizza(line));
    const hasFichaCombo = summaries.some((line) => line.kind === 'combo');
    if (pizzas.length === 1 && !hasFichaCombo && !combos.has(pizzas[0].index)) {
        const sides = indexed.filter(({ line, index }) => isSide(line) && !grouped.has(index));
        const drinks = indexed.filter(({ line, index }) => isDrink(line) && !grouped.has(index));
        if (sides.length === 1 && drinks.length === 1) {
            const side = sides[0].line;
            const drink = drinks[0].line;
            const total = side.total + drink.total;
            const baseTotal = side.baseTotal + drink.baseTotal;
            combos.set(pizzas[0].index, {
                parts: [side.name, drink.name],
                itemIds: [side.itemId, drink.itemId],
                productIds: [side.productId, drink.productId],
                total,
                baseTotal,
                savings: Math.max(0, baseTotal - total),
            });
            grouped.add(sides[0].index);
            grouped.add(drinks[0].index);
        }
    }
    return indexed
        .filter(({ index }) => !grouped.has(index))
        .map(({ line, index }) => ({ summary: line, combo: combos.get(index) ?? null }));
}
