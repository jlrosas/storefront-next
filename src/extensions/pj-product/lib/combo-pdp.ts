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
import type { PizzaStore } from './pizza';
import type { SideProduct } from './upsell';
import type { SimpleKind } from './product-kind';

/**
 * Fichas propias de combos con ficha y de productos simples (PRO-08). Funciones puras, seguras en
 * cliente y servidor: el loader (`product-pdp.server.ts`) arma los datos y la ficha arma el agregado.
 */

export type ComboSlotKind = 'pizza' | 'side' | 'drink' | 'dessert';

/** Casilla de `c_pjSlots` tal como la guarda DAT (`{"slots":[{id, kind, label, size?, choices, default}]}`). */
export interface RawComboSlot {
    id: string;
    kind: ComboSlotKind;
    label: string;
    size?: string;
    choices: string[];
    default?: string;
}

/** Una opción elegible en una casilla. */
export interface ComboChoiceOption {
    /** ID de la opción: maestro de la pizza (`pz-pollo-bbq`) o producto (`cp-coca-cola-2`). */
    id: string;
    /** Lo que viaja en `c_pjComboChoices.product`: la variante de la pizza o el mismo producto. */
    product: string;
    name: string;
    image: string | null;
    /** Texto que se saborea (pizzas). */
    taste: string | null;
}

export interface ComboPdpSlot {
    id: string;
    kind: ComboSlotKind;
    label: string;
    size: string | null;
    options: ComboChoiceOption[];
    /** Lo más pedido (el `default` de la casilla), preseleccionado. */
    defaultId: string;
}

export interface ComboPdpData {
    productId: string;
    name: string;
    sensory: string | null;
    description: string | null;
    image: string | null;
    price: number;
    priceBefore: number | null;
    serves: string | null;
    validTo: string | null;
    slots: ComboPdpSlot[];
    store: PizzaStore | null;
    /** «Completa tu pedido» (bajo el pliegue: promesa del loader). */
    sides: Promise<SideProduct[]>;
}

export interface SimpleOption {
    /** Variante que entra al carrito (`cp-coca-cola-2`). */
    productId: string;
    /** «1,5 L», «350 ml», «Pepperoni Roll». */
    label: string;
    price: number;
}

export interface SimplePdpData {
    /** Maestro o producto (`cp-coca-cola`, `cp-palitos-de-ajo`). */
    productId: string;
    name: string;
    kind: SimpleKind;
    sensory: string | null;
    description: string | null;
    image: string | null;
    /** Precio del producto sin variantes (o el de la primera variante). */
    price: number;
    /** Tamaño o sabor en chips; vacío si el producto no tiene variantes. */
    options: SimpleOption[];
    /** Variante marcada al abrir (la de la URL, o 1,5 L si existe). */
    initialOptionId: string | null;
    store: PizzaStore | null;
    sides: Promise<SideProduct[]>;
}

/** Elección por casilla: `{ pizza1: 'pz-pollo-bbq', drink: 'cp-coca-cola-sin-azucar-10' }`. */
export type ComboSelection = Record<string, string>;

/** Una entrada de `c_pjComboChoices` (CONTRATO §7, el mismo formato que el constructor de OFE). */
export interface ComboChoice {
    slot: string;
    product: string;
}

const SLOT_KINDS: readonly ComboSlotKind[] = ['pizza', 'side', 'drink', 'dessert'];

function toList(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string' && v !== '');
    if (typeof value === 'string' && value !== '') return [value];
    return [];
}

/** Lee `c_pjSlots` (texto JSON). Devuelve `[]` si no tiene la forma esperada. */
export function parseComboSlots(raw: unknown): RawComboSlot[] {
    if (typeof raw !== 'string' || raw === '') return [];
    try {
        const parsed = JSON.parse(raw) as { slots?: unknown };
        if (!Array.isArray(parsed.slots)) return [];
        return parsed.slots.flatMap((slot): RawComboSlot[] => {
            if (!slot || typeof slot !== 'object') return [];
            const s = slot as Record<string, unknown>;
            if (typeof s.id !== 'string') return [];
            const choices = toList(s.choices);
            if (choices.length === 0) return [];
            return [
                {
                    id: s.id,
                    kind: SLOT_KINDS.includes(s.kind as ComboSlotKind) ? (s.kind as ComboSlotKind) : 'pizza',
                    label: typeof s.label === 'string' ? s.label : s.id,
                    ...(typeof s.size === 'string' ? { size: s.size } : {}),
                    choices,
                    ...(typeof s.default === 'string' ? { default: s.default } : {}),
                },
            ];
        });
    } catch {
        return [];
    }
}

/** IDs de producto que hay que cargar para mostrar las opciones de las casillas. */
export function slotProductIds(slots: readonly RawComboSlot[]): string[] {
    return [...new Set(slots.flatMap((s) => s.choices))];
}

/**
 * Ordena las opciones con lo más pedido primero: la de la casilla (`default`) y después por pedidos de la
 * semana, sin cambiar el orden del catálogo entre iguales.
 */
export function orderOptions<T extends { id: string }>(
    options: readonly T[],
    defaultId: string | undefined,
    weekly: (id: string) => number
): T[] {
    return options
        .map((option, index) => ({ option, index }))
        .sort((a, b) => {
            if (a.option.id === defaultId) return -1;
            if (b.option.id === defaultId) return 1;
            return weekly(b.option.id) - weekly(a.option.id) || a.index - b.index;
        })
        .map(({ option }) => option);
}

/** Preselección: lo más pedido de cada casilla. */
export function defaultComboSelection(slots: readonly ComboPdpSlot[]): ComboSelection {
    const selection: ComboSelection = {};
    for (const slot of slots) {
        const chosen = slot.options.find((o) => o.id === slot.defaultId) ?? slot.options[0];
        if (chosen) selection[slot.id] = chosen.id;
    }
    return selection;
}

/** Opción elegida de una casilla (o la primera, si la elección no existe). */
export function chosenOption(slot: ComboPdpSlot, selection: ComboSelection): ComboChoiceOption | undefined {
    return slot.options.find((o) => o.id === selection[slot.id]) ?? slot.options[0];
}

/**
 * `c_pjComboChoices` de la línea: `[{"slot":"pizza1","product":"pz-pollo-bbq-family-traditional"},
 * {"slot":"drink","product":"cp-coca-cola-sin-azucar-10"}]`. Una entrada por casilla, también las de una
 * sola opción (así el carrito dice todo lo que trae el combo). `null` si falta alguna.
 */
export function buildComboChoices(slots: readonly ComboPdpSlot[], selection: ComboSelection): ComboChoice[] | null {
    const out: ComboChoice[] = [];
    for (const slot of slots) {
        const option = chosenOption(slot, selection);
        if (!option) return null;
        out.push({ slot: slot.id, product: option.product });
    }
    return out;
}

/**
 * Valida en el servidor las elecciones contra `c_pjSlots`: una por casilla; la pizza es una variante del
 * tamaño de la casilla de una de las especialidades permitidas; lo demás, uno de los productos de la casilla.
 */
export function validateComboChoices(slots: readonly RawComboSlot[], choices: unknown): choices is ComboChoice[] {
    if (!Array.isArray(choices) || choices.length !== slots.length) return false;
    return slots.every((slot) => {
        const entry = choices.find(
            (c): c is ComboChoice => !!c && typeof c === 'object' && (c as { slot?: unknown }).slot === slot.id
        );
        if (!entry || typeof entry.product !== 'string') return false;
        if (slot.kind === 'pizza') {
            return slot.choices.some(
                (master) => entry.product === master || entry.product.startsWith(`${master}-${slot.size ?? 'family'}-`)
            );
        }
        return slot.choices.includes(entry.product);
    });
}

/**
 * Variante de la pizza para la casilla: el tamaño de la casilla en masa tradicional (la del precio de
 * lista); si no existe, la primera de ese tamaño. `null` si la pizza no viene en ese tamaño.
 */
export function pizzaVariantFor(
    variants: ReadonlyArray<{ productId: string; variationValues?: Record<string, string> }>,
    size: string
): string | null {
    let found: string | null = null;
    for (const v of variants) {
        if (v.variationValues?.pjSize !== size) continue;
        if (v.variationValues?.pjCrust === 'traditional') return v.productId;
        found ??= v.productId;
    }
    return found;
}

/** «Coca-Cola Light 1.5 LT» → «Coca-Cola Light» (la casilla ya dice «Bebida 1,5 L»). */
export function shortDrinkName(name: string): string {
    return name.replace(/\s+\d+(?:[.,]\d+)?\s*(?:lt|l|ml|cc)\.?$/i, '').trim() || name;
}

/** «Coca-Cola 350 ml» en una ficha de «Coca-Cola» → «350 ml»; «1.5 L» → «1,5 L». */
export function variantLabel(raw: string, productName: string): string {
    let label = raw.trim();
    if (label.toLowerCase().startsWith(productName.toLowerCase()) && label.length > productName.length) {
        label = label.slice(productName.length).trim();
    }
    return label.replace(/(\d)\.(\d)/g, '$1,$2').replace(/\bLT\b/, 'L');
}

/** Variante marcada al abrir: la pedida por URL, si no la de 1,5 L, si no la primera. */
export function initialSimpleOption(options: readonly SimpleOption[], requested: string | null): string | null {
    if (options.length === 0) return null;
    if (requested && options.some((o) => o.productId === requested)) return requested;
    return (options.find((o) => /1[.,]5/.test(o.label)) ?? options[0]).productId;
}

/** Candidatos de «Completa tu pedido» (acompañamientos, bebida y postre), en orden de preferencia. */
export const COMPLETE_CANDIDATES: ReadonlyArray<{ productId: string; kind: SimpleKind }> = [
    { productId: 'cp-palitos-de-ajo', kind: 'side' },
    { productId: 'cp-cheesyquenos', kind: 'side' },
    { productId: 'cp-coca-cola-2', kind: 'drink' },
    { productId: 'cp-brownie', kind: 'dessert' },
    { productId: 'cp-chicken-poppers', kind: 'side' },
    { productId: 'cp-cookie', kind: 'dessert' },
];

/**
 * «Completa tu pedido» sin repetir lo que ya trae el combo o la ficha: fuera los productos incluidos y,
 * si el combo ya trae bebida o postre, fuera las bebidas o postres. Máximo `limit`.
 */
export function completeCandidates(
    exclude: { productIds: readonly string[]; kinds: readonly string[] },
    limit = 5
): string[] {
    return COMPLETE_CANDIDATES.filter(
        (c) => !exclude.productIds.includes(c.productId) && !exclude.kinds.includes(c.kind)
    )
        .slice(0, limit)
        .map((c) => c.productId);
}

/** Total del agregado: (combo o producto) × cantidad + complementos marcados. */
export function addTotal(unitPrice: number, quantity: number, sidePrices: readonly number[]): number {
    return unitPrice * quantity + sidePrices.reduce((sum, p) => sum + p, 0);
}
