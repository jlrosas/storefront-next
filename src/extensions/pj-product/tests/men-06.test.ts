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
import { afterEach, describe, expect, it } from 'vitest';
import { weeklyOrdersFor } from '../lib/weekly';
import { PJ_COMBO_OFFER_EVENT, requestComboOffer } from '../lib/combo-offer';

describe('weeklyOrdersFor (MEN-06 · #53)', () => {
    it('suma «320 esta semana» a la valoración desde 100 pedidos', () => {
        expect(weeklyOrdersFor(320)).toEqual({ count: 320, formatted: '320' });
        expect(weeklyOrdersFor(1240)?.formatted).toBe('1.240');
    });
    it('bajo 100 o sin dato no presume', () => {
        expect(weeklyOrdersFor(99)).toBeNull();
        expect(weeklyOrdersFor(null)).toBeNull();
        expect(weeklyOrdersFor(undefined)).toBeNull();
    });
});

describe('requestComboOffer (MEN-06 · #52)', () => {
    let handler: ((event: Event) => void) | null = null;
    afterEach(() => {
        if (handler) window.removeEventListener(PJ_COMBO_OFFER_EVENT, handler);
        handler = null;
    });

    it('sin panel que la atienda, la hoja sigue con su paso «Hazlo combo»', () => {
        expect(requestComboOffer({ itemId: 'a1', productName: 'Pollo BBQ' })).toBe(false);
    });

    it('con el panel «Tu pedido» a la vista, la oferta va al panel con la línea agregada', () => {
        const seen: unknown[] = [];
        handler = (event: Event) => {
            seen.push((event as CustomEvent).detail);
            event.preventDefault();
        };
        window.addEventListener(PJ_COMBO_OFFER_EVENT, handler);
        expect(requestComboOffer({ itemId: 'a1', productName: 'Pollo BBQ' })).toBe(true);
        expect(seen).toEqual([{ itemId: 'a1', productName: 'Pollo BBQ' }]);
    });
});
