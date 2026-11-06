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
import { describe, expect, it } from 'vitest';
import {
    buildChoices,
    initialState,
    missingCount,
    selectOption,
    selectSlot,
    validateChoices,
    type PizzaOption,
} from './combo';
import type { ComboSlot } from './offers';

const choices = ['pz-a', 'pz-b', 'pz-c'];
const slots: ComboSlot[] = [
    { id: 'pizza1', kind: 'pizza', label: 'Pizza 1 de 2', size: 'family', choices, default: 'pz-a' },
    { id: 'pizza2', kind: 'pizza', label: 'Pizza 2 de 2', size: 'family', choices, default: 'pz-b' },
];
const options: Record<string, PizzaOption> = Object.fromEntries(
    choices.map((id) => [
        id,
        { id, name: id, taste: '', image: null, variants: { family: `${id}-family-traditional` } },
    ])
);

describe('constructor de combos', () => {
    it('parte con la primera casilla elegida y la segunda activa', () => {
        const state = initialState(slots);
        expect(state.selection).toEqual(['pz-a', null]);
        expect(state.active).toBe(1);
        expect(missingCount(state.selection)).toBe(1);
    });

    it('al elegir salta a la siguiente casilla vacía', () => {
        let state = initialState(slots, false);
        expect(state.active).toBe(0);
        state = selectOption(state, 'pz-c');
        expect(state.selection).toEqual(['pz-c', null]);
        expect(state.active).toBe(1);
        state = selectOption(state, 'pz-b');
        expect(missingCount(state.selection)).toBe(0);
        expect(selectSlot(state, 0).active).toBe(0);
    });

    it('arma c_pjComboChoices con la variante del tamaño', () => {
        expect(buildChoices(slots, ['pz-a', 'pz-b'], options)).toEqual([
            { slot: 'pizza1', product: 'pz-a-family-traditional' },
            { slot: 'pizza2', product: 'pz-b-family-traditional' },
        ]);
        expect(buildChoices(slots, ['pz-a', null], options)).toBeNull();
    });

    it('valida las elecciones en el servidor', () => {
        const ok = [
            { slot: 'pizza1', product: 'pz-a-family-traditional' },
            { slot: 'pizza2', product: 'pz-c-family-thin' },
        ];
        expect(validateChoices(slots, ok)).toBe(true);
        expect(validateChoices(slots, [ok[0]])).toBe(false);
        expect(validateChoices(slots, [ok[0], { slot: 'pizza2', product: 'pz-x-family-thin' }])).toBe(false);
        expect(validateChoices(slots, 'x')).toBe(false);
    });
});
