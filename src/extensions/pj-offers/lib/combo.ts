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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import type { ComboSlot } from './offers';

/**
 * Lógica del constructor de combos (Combo.dc.html): casillas «Pizza 1 de 2», avance, botón que
 * dice lo que falta y elecciones que viajan en la línea (`c_pjComboChoices`, CONTRATO §7).
 */

/** Una elección por casilla: `null` mientras está vacía. */
export type Selection = (string | null)[];

/** Opción elegible (una pizza) con la variante que entra al carrito en cada tamaño. */
export interface PizzaOption {
    /** ID del maestro (`pz-pollo-bbq`), el que está en `choices` de la casilla. */
    id: string;
    name: string;
    /** Texto que se saborea (`c_pjSensory`). */
    taste: string;
    image: string | null;
    /** Variante por tamaño (`family` → `pz-pollo-bbq-family-traditional`). */
    variants: Record<string, string>;
}

export interface ComboState {
    selection: Selection;
    active: number;
}

/** Casillas donde hay que elegir (con más de una opción). Las de una sola opción ya vienen incluidas. */
export function choosableSlots(slots: readonly ComboSlot[]): ComboSlot[] {
    return slots.filter((s) => s.choices.length > 1);
}

/** Como el lienzo: la primera casilla viene con la favorita y la siguiente queda activa. */
export function initialState(slots: readonly ComboSlot[], preselectFirst = true): ComboState {
    const selection: Selection = slots.map(() => null);
    if (preselectFirst && slots.length > 1 && slots[0]?.default && slots[0].choices.includes(slots[0].default)) {
        selection[0] = slots[0].default;
    }
    const firstEmpty = selection.findIndex((s) => s === null);
    return { selection, active: firstEmpty >= 0 ? firstEmpty : 0 };
}

/** Elige una opción en la casilla activa y salta a la siguiente casilla vacía. */
export function selectOption(state: ComboState, optionId: string): ComboState {
    const selection = state.selection.slice();
    selection[state.active] = optionId;
    const firstEmpty = selection.findIndex((s) => s === null);
    return { selection, active: firstEmpty >= 0 ? firstEmpty : state.active };
}

export function selectSlot(state: ComboState, index: number): ComboState {
    if (index < 0 || index >= state.selection.length) return state;
    return { ...state, active: index };
}

export function missingCount(selection: Selection): number {
    return selection.filter((s) => s === null).length;
}

export function filledCount(selection: Selection): number {
    return selection.length - missingCount(selection);
}

/**
 * `c_pjComboChoices` (CONTRATO §7): `[{"slot":"pizza1","product":"pz-pollo-bbq-family-traditional"},…]`.
 * La variante sale del tamaño de la casilla; si la opción no tiene variante de ese tamaño devuelve `null`.
 */
export function buildChoices(
    slots: readonly ComboSlot[],
    selection: Selection,
    options: Record<string, PizzaOption>
): { slot: string; product: string }[] | null {
    const result: { slot: string; product: string }[] = [];
    for (let i = 0; i < slots.length; i += 1) {
        const slot = slots[i];
        const chosen = selection[i];
        if (!chosen) return null;
        if (slot.kind === 'pizza') {
            const variant = options[chosen]?.variants[slot.size ?? 'family'];
            if (!variant) return null;
            result.push({ slot: slot.id, product: variant });
        } else {
            result.push({ slot: slot.id, product: chosen });
        }
    }
    return result;
}

/** Valida en el servidor que las elecciones coinciden con las casillas del combo. */
export function validateChoices(
    slots: readonly ComboSlot[],
    choices: unknown
): choices is { slot: string; product: string }[] {
    if (!Array.isArray(choices) || choices.length !== slots.length) return false;
    return slots.every((slot) => {
        const entry = choices.find((c) => c && typeof c === 'object' && (c as { slot?: unknown }).slot === slot.id) as
            | { slot: string; product: string }
            | undefined;
        if (!entry || typeof entry.product !== 'string') return false;
        if (slot.kind === 'pizza') {
            return slot.choices.some((master) => entry.product.startsWith(`${master}-${slot.size ?? 'family'}-`));
        }
        return slot.choices.includes(entry.product);
    });
}
