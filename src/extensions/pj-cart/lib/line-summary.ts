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
import {
    EXTRA_OPTION_PREFIX,
    displayIngredientName,
    lowerIngredientName,
    removedFromItem,
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
    c_pjRemoved?: unknown;
    c_pjHalves?: unknown;
    c_pjComboChoices?: unknown;
    [key: string]: unknown;
}

/** Nombre (y foto) de un producto por ID: especialidades de las mitades, pizzas y bebidas del combo. */
export interface LineProduct {
    name: string;
    image: string | null;
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
    /** «Editar»: la hoja de PRO (`sheet`) o el armador de mitades (`halves`). */
    edit: 'sheet' | 'halves' | null;
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

/** `c_pjComboChoices` → `[{ slot, product }]` (texto JSON o lista). */
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
    return value.filter(
        (entry): entry is { slot: string; product: string } =>
            !!entry && typeof entry === 'object' && typeof (entry as { product?: unknown }).product === 'string'
    );
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
        for (const choice of parseComboChoices(item.c_pjComboChoices)) ids.add(choiceProductId(choice.product));
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
    // Contrato §7: las opciones en `no` no se muestran.
    const extras: LineExtra[] = options
        .filter((o) => o.optionValueId === 'si' && o.optionId?.startsWith(EXTRA_OPTION_PREFIX))
        .map((o) => {
            const id = (o.optionId as string).slice(EXTRA_OPTION_PREFIX.length);
            // SCAPI da el precio de la opción por la cantidad de la línea: se muestra por unidad.
            const lineQuantity = Math.max(1, item.quantity ?? 1);
            const price = Math.round((o.priceAfterItemDiscount ?? o.price ?? 0) / lineQuantity);
            return { id, name: optionName(o) ?? humanizeId(id), price };
        });
    const removed = removedFromItem({ c_pjRemoved: item.c_pjRemoved as string[] | string | null | undefined }).map(
        (id) => ({ id, name: lowerIngredientName(optionName(optionById.get(id)) ?? humanizeId(id)) })
    );
    const halves = kind === 'halves' ? parseHalves(item.c_pjHalves) : [];
    const halvesInfo = halves.map((id) => ({
        id,
        name: names[id]?.name ?? humanizeId(id),
        image: names[id]?.image ?? null,
    }));
    const choices =
        kind === 'combo'
            ? parseComboChoices(item.c_pjComboChoices).map((choice) => {
                  const id = choiceProductId(choice.product);
                  return names[id]?.name ?? names[choice.product]?.name ?? humanizeId(id);
              })
            : [];

    const name =
        kind === 'pizza' && variant
            ? (names[variant.masterId]?.name ?? stripVariantSuffix(rawName, sizeLabel, crustLabel))
            : stripVariantSuffix(rawName, sizeLabel, crustLabel);

    const parts: string[] = [];
    if (sizeLabel) parts.push(sizeLabel);
    if (crustLabel) parts.push(crustLabel);
    for (const half of halvesInfo) parts.push(`½ ${half.name}`);
    for (const r of removed) parts.push(labels.without(r.name));
    if (choices.length) parts.push(choices.join(' + '));

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
        quantity: item.quantity ?? 1,
        total: lineTotal(item),
        edit: kind === 'pizza' ? 'sheet' : kind === 'halves' ? 'halves' : null,
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
