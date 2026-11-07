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
 * Super Dúo y Super Trío como pizzas reales + promoción (S-D20, opción A). **Único lugar** con el contrato de
 * datos de DAT-11 (CONTRATO §7.1):
 * - cada pizza del combo es una línea de pizza normal (`optionItems` con `pjExtras_*`, `c_pjRemoved`) que además
 *   lleva la opción `pjCombo` = `duo` / `trio` (precio $0): eso activa la promoción `pj-super-duo` ($22.590) o
 *   `pj-super-trio` ($33.900). **Sin cupón.** Los extras se cobran encima;
 * - todas las pizzas de un mismo combo armado llevan el mismo `c_pjComboGroup` (`duo-<id>` / `trio-<id>`);
 * - solo Familiar y masas `traditional`, `thin` o `parmesan` (otra masa deja el grupo a precio normal);
 * - las líneas de venta cruzada llevan `c_pjComboFor` = el grupo o el `itemId` de su pizza.
 */

/** Atributo de la línea que agrupa las pizzas de un combo armado. */
export const COMBO_GROUP_ATTRIBUTE = 'c_pjComboGroup';
/** Atributo de las líneas de venta cruzada («Hazlo combo», «Completa tu pedido»): su pizza o su grupo. */
export const COMBO_FOR_ATTRIBUTE = 'c_pjComboFor';
/** Opción de producto que marca la pizza como parte del combo. */
export const COMBO_OPTION_ID = 'pjCombo';

export interface ComboCartDefinition {
    /** Valor de `pjCombo` y prefijo del grupo. */
    option: 'duo' | 'trio';
    /** Pizzas que forman el combo. */
    pizzas: number;
    /** Precio del combo sin extras (para mostrar el grupo, §7.1). */
    price: number;
    promotionId: string;
    /** Tamaño de las pizzas del combo. */
    size: string;
}

/** Combos que se arman como pizzas reales + promoción. */
export const COMBO_CART: Readonly<Record<string, ComboCartDefinition>> = {
    'cb-super-duo': { option: 'duo', pizzas: 2, price: 22590, promotionId: 'pj-super-duo', size: 'family' },
    'cb-super-trio': { option: 'trio', pizzas: 3, price: 33900, promotionId: 'pj-super-trio', size: 'family' },
};

/** Masas que admite el combo (sin recargo); la rellena y la base parmesano no entran. */
export const COMBO_CRUSTS: readonly string[] = ['traditional', 'thin', 'parmesan'];

export function isComboCart(comboId: string): boolean {
    return Object.hasOwn(COMBO_CART, comboId);
}

/** `duo` → `cb-super-duo`. */
export function comboIdForOption(option: string): string | null {
    return Object.entries(COMBO_CART).find(([, def]) => def.option === option)?.[0] ?? null;
}

/** `{ optionId: 'pjCombo', optionValueId: 'duo' }` del combo. */
export function comboOptionItem(comboId: string): { optionId: string; optionValueId: 'duo' | 'trio' } | null {
    const def = COMBO_CART[comboId];
    return def ? { optionId: COMBO_OPTION_ID, optionValueId: def.option } : null;
}

/** Un grupo nuevo para un combo armado (`duo-k3f9a2`). */
export function newComboGroup(comboId: string, random: () => number = Math.random): string {
    const id = Math.floor(random() * 36 ** 6)
        .toString(36)
        .padStart(6, '0');
    return `${COMBO_CART[comboId]?.option ?? 'combo'}-${id}`;
}

/** `duo-k3f9a2` → `{ comboId: 'cb-super-duo', group }`; `null` si no es un grupo de combo. */
export function parseComboGroup(value: unknown): { comboId: string; group: string } | null {
    if (typeof value !== 'string') return null;
    const match = /^([a-z]+)-[a-z0-9-]+$/i.exec(value.trim());
    const comboId = match ? comboIdForOption(match[1].toLowerCase()) : null;
    return comboId ? { comboId, group: value.trim() } : null;
}

/** Grupo de una línea de la canasta. */
export function comboGroupOf(item: Record<string, unknown> | null | undefined): string | null {
    return parseComboGroup(item?.[COMBO_GROUP_ATTRIBUTE])?.group ?? null;
}

/** Combo de una línea por su opción `pjCombo` (`duo` / `trio`), o `null`. */
export function comboOptionOf(item: {
    optionItems?: Array<{ optionId?: string; optionValueId?: string }>;
}): string | null {
    const value = (item.optionItems ?? []).find((o) => o.optionId === COMBO_OPTION_ID)?.optionValueId;
    return value && value !== 'no' ? value : null;
}

/** Atributos de línea que lleva cada pizza del combo. */
export function comboLineAttributes(group: string): Record<string, string> {
    return { [COMBO_GROUP_ATTRIBUTE]: group };
}

interface BasketLike {
    productItems?: Array<Record<string, unknown> & { itemId?: string }>;
}

/** Líneas de un grupo. */
export function groupItemIds(basket: BasketLike | null | undefined, group: string): string[] {
    return (basket?.productItems ?? [])
        .filter((item) => comboGroupOf(item) === group)
        .map((item) => item.itemId ?? '')
        .filter(Boolean);
}

/** Pizzas que faltan para completar el grupo (0 si está completo). */
export function missingInGroup(comboId: string, present: number): number {
    return Math.max(0, (COMBO_CART[comboId]?.pizzas ?? 0) - present);
}

/** Recargo por pizza del combo: extras y masa con recargo (el combo cubre la Familiar Tradicional). */
export function slotSurcharge(input: { extras: number; extraPrice: number; crustSurcharge: number }): number {
    return input.extras * input.extraPrice + input.crustSurcharge;
}

/** Pizza de una ranura del constructor, armada en la hoja de PRO en modo «ranura» (sin agregar al carrito). */
export interface ComboSlotPizza {
    /** Maestro (`pz-pollo-bbq`). */
    masterId: string;
    /** Variante tamaño + masa (`pz-pollo-bbq-family-thin`). */
    productId: string;
    crust: string;
    extras: string[];
    removed: string[];
    /** «Familiar · Delgada · sin cebolla · + Pepperoni». */
    summary: string;
    /** Lo que suma a la ranura sobre el precio del combo (extras + recargo de masa). */
    surcharge: number;
}
