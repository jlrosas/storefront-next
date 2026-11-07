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
import { describe, expect, it } from 'vitest';
import { HOME_FULFILLMENT_DEFAULTS, homeFulfillmentView } from './fulfillment-view';

const bosque = { mode: 'pickup', storeId: 'pj-48', when: 'asap' } as const;

describe('homeFulfillmentView (#10: los textos de la Home leen la modalidad del chip)', () => {
    it('sin modalidad usa los valores de la lámina (El Bosque, 15 min)', () => {
        expect(homeFulfillmentView(null, null)).toEqual({
            mode: 'pickup',
            storeName: HOME_FULFILLMENT_DEFAULTS.storeName,
            time: '15 min',
            scheduled: false,
            address: null,
            chosen: false,
        });
    });

    it('con la modalidad pero sin el meta de esa tienda (servidor) no salta', () => {
        expect(homeFulfillmentView(bosque, null, 'El Bosque')).toMatchObject({ storeName: 'El Bosque', chosen: false });
        expect(
            homeFulfillmentView(bosque, { storeId: 'pj-9', storeName: 'Salvador', timeText: '35 min' })
        ).toMatchObject({ storeName: 'El Bosque', chosen: false });
    });

    it('retiro elegido: tienda y tiempo del chip', () => {
        expect(
            homeFulfillmentView(
                { mode: 'pickup', storeId: 'pj-9', when: 'asap' },
                { storeId: 'pj-9', storeName: 'Salvador', timeText: '35 min' }
            )
        ).toEqual({
            mode: 'pickup',
            storeName: 'Salvador',
            time: '35 min',
            scheduled: false,
            address: null,
            chosen: true,
        });
    });

    it('delivery elegido: dirección y ventana', () => {
        expect(
            homeFulfillmentView(
                { mode: 'delivery', storeId: 'pj-9', when: 'asap', address: 'Av. Providencia 1234, depto 504' },
                { storeId: 'pj-9', storeName: 'Salvador', timeText: '35–45 min', addressText: 'Av. Providencia 1234' }
            )
        ).toMatchObject({ mode: 'delivery', time: '35–45 min', address: 'Av. Providencia 1234', chosen: true });
        expect(homeFulfillmentView({ mode: 'delivery', storeId: 'pj-9', when: 'asap' }, null)).toMatchObject({
            mode: 'delivery',
            time: '35–45 min',
            chosen: false,
        });
    });

    it('programado: marca scheduled con la hora del chip', () => {
        expect(
            homeFulfillmentView(bosque, {
                storeId: 'pj-48',
                storeName: 'El Bosque',
                timeText: 'mañana 12:00',
                scheduled: true,
            })
        ).toMatchObject({ scheduled: true, time: 'mañana 12:00' });
    });
});
