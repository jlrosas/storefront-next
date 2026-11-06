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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
import { describe, expect, test, vi } from 'vitest';

vi.mock('@/lib/api-clients.server', () => ({ createApiClients: vi.fn() }));
vi.mock('@/middlewares/auth.server', () => ({ getAuth: vi.fn() }));
vi.mock('@/lib/logger.server', () => ({ getLogger: vi.fn(() => ({ warn: vi.fn() })) }));

import { familyPriceOf, offerOf, popularOf, visibleFor } from './home-data.server';

const combo = {
    id: 'cb-pizza-del-mes',
    name: 'Pizza del Mes The Works Familiar',
    price: 10990,
    c_pjPriceBefore: 21900,
    c_pjServes: 'Para 3–4',
    c_pjSensory: 'Todo lo bueno.',
    imageGroups: [{ viewType: 'large', images: [{ link: 'https://x.test/a.jpg' }] }],
} as never;

describe('datos de la Home', () => {
    test('la oferta toma nombre, precio, antes y foto del producto', () => {
        expect(offerOf(combo, '/p/cb-pizza-del-mes')).toMatchObject({
            name: 'Pizza del Mes The Works Familiar',
            price: 10990,
            listPrice: 21900,
            serves: 'Para 3–4',
            image: 'https://x.test/a.jpg',
            href: '/p/cb-pizza-del-mes',
        });
    });

    test('sin precio «antes» mayor, no hay precio tachado', () => {
        expect(offerOf({ ...(combo as object), c_pjPriceBefore: 5000 } as never, '/x')?.listPrice).toBeNull();
    });

    test('un producto sin precio no es una oferta', () => {
        expect(offerOf({ id: 'x', name: 'x' } as never, '/x')).toBeNull();
    });

    test('el precio de una pizza es el de la variante Familiar tradicional', () => {
        const pizza = {
            id: 'pz-pollo-bbq',
            name: 'Pollo BBQ',
            price: 5900,
            variants: [
                { price: 21900, variationValues: { pjSize: 'extra_large', pjCrust: 'parmesan' } },
                { price: 16900, variationValues: { pjSize: 'family', pjCrust: 'traditional' } },
            ],
            c_pjBadges: ['mas-pedida'],
            c_pjRating: 4.7,
            c_pjWeeklyOrders: 320,
        } as never;
        expect(familyPriceOf(pizza)).toBe(16900);
        expect(popularOf(pizza)).toMatchObject({ badge: 'mas-pedida', rating: 4.7, weekly: 320, familyPrice: 16900 });
    });

    test('el atributo perfil de Page Designer filtra por perfil', () => {
        expect(visibleFor(undefined, 'diego')).toBe(true);
        expect(visibleFor('all', 'sofia')).toBe(true);
        expect(visibleFor('diego', 'diego')).toBe(true);
        expect(visibleFor('diego', 'valentina')).toBe(false);
    });
});
