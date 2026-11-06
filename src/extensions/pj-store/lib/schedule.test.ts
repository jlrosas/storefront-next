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
import { buildSlots, chileWallTimeToDate, dayOf } from './schedule';
import type { PjStore } from './store-info';

const store: PjStore = {
    id: 'pj-48',
    name: 'Papa Johns El Bosque',
    c_pjOpensAt: '11:00',
    c_pjOpenUntil: '23:30',
    c_pjPickupMinutes: 15,
};

describe('schedule', () => {
    // 6-nov-2026 18:30 en Chile (UTC-3 en noviembre).
    const now = chileWallTimeToDate(2026, 11, 6, 18, 30);

    it('convierte la hora de pared de Chile a un instante', () => {
        expect(chileWallTimeToDate(2026, 11, 6, 12, 0).toISOString()).toBe('2026-11-06T15:00:00.000Z');
    });

    it('hoy parte desde ahora más la preparación, de 15 en 15', () => {
        const slots = buildSlots(store, 'today', now);
        expect(slots[0].label).toBe('18:45');
        expect(slots[slots.length - 1].label).toBe('23:15');
    });

    it('mañana parte desde la apertura de la tienda', () => {
        const slots = buildSlots({ ...store, c_pjOpensAt: '12:00' }, 'tomorrow', now);
        expect(slots[0].label).toBe('12:00');
        expect(slots[0].value).toBe('2026-11-07T15:00:00.000Z');
    });

    it('hoy no tiene horas cuando ya pasó el cierre', () => {
        const late = chileWallTimeToDate(2026, 11, 6, 23, 20);
        expect(buildSlots(store, 'today', late)).toHaveLength(0);
    });

    it('reconoce el día de una hora programada', () => {
        expect(dayOf('2026-11-06T22:00:00.000Z', now)).toBe('today');
        expect(dayOf('2026-11-07T15:00:00.000Z', now)).toBe('tomorrow');
    });
});
