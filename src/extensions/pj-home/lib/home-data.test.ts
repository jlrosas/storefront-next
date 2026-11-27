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

import { createApiClients } from '@/lib/api-clients.server';
import { getAuth } from '@/middlewares/auth.server';
import {
    familyPriceOf,
    featurePhotosOf,
    intentsOf,
    loadHomeData,
    offerOf,
    popularOf,
    visibleFor,
} from './home-data.server';
import { SOFIA_SAMPLE } from './mock';

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

    test('el «+» agrega la variante Familiar tradicional en un toque (HOM-07)', () => {
        const pizza = {
            id: 'pz-pollo-bbq',
            name: 'Pollo BBQ',
            price: 5900,
            variants: [
                {
                    productId: 'pz-pollo-bbq-medium-thin',
                    price: 9900,
                    variationValues: { pjSize: 'medium', pjCrust: 'thin' },
                },
                {
                    productId: 'pz-pollo-bbq-family-traditional',
                    price: 16900,
                    orderable: true,
                    variationValues: { pjSize: 'family', pjCrust: 'traditional' },
                },
            ],
        } as never;
        expect(popularOf(pizza)?.quickAddId).toBe('pz-pollo-bbq-family-traditional');
        expect(popularOf({ id: 'cb-x', name: 'Combo', price: 9900 } as never)?.quickAddId).toBeNull();
    });

    test('carruseles por intención: «Menos de $15 mil» solo bajo el tope y con al menos 2 productos', () => {
        const product = (id: string, price: number, variants = 0) =>
            ({
                id,
                name: id,
                price,
                variants: Array.from({ length: variants }, (_, i) => ({ productId: `${id}-${i}` })),
                imageGroups: [{ viewType: 'large', images: [{ link: `https://x.test/images/${id}.jpg` }] }],
            }) as never;
        const catalog = new Map<string, never>([
            ['cb-super-duo', product('cb-super-duo', 22590)],
            ['cb-super-trio', product('cb-super-trio', 31990)],
            ['cb-papa-flash', product('cb-papa-flash', 5490)],
            ['cb-pizza-del-mes', product('cb-pizza-del-mes', 10990)],
            ['pz-napolitana', product('pz-napolitana', 15900, 4)],
        ]);
        const intents = intentsOf((id) => catalog.get(id));
        expect(intents.map((i) => i.id)).toEqual(['compartir', 'economico']);
        const shared = intents[0].items;
        expect(shared.map((i) => i.href)).toEqual(['/promos/super-duo', '/promos/super-trio']);
        const budget = intents[1].items;
        expect(budget.map((i) => i.id)).toEqual(['cb-papa-flash', 'cb-pizza-del-mes']);
        expect(budget.every((i) => i.price < 15000)).toBe(true);
        expect(intentsOf(() => undefined)).toEqual([]);
    });

    test('fotos destacadas: misma carpeta del catálogo con el archivo del queso estirándose y napocherry (P2-17)', () => {
        const base =
            'https://zyfj-001.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-papajohns-cl-master/default/dw1a2b/images/pollo-bbq.jpg?sw=600';
        expect(featurePhotosOf(base)).toEqual({
            cheesePull:
                'https://zyfj-001.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-papajohns-cl-master/default/dw1a2b/images/napolitana-familiar-1788736846.jpg',
            napocherry:
                'https://zyfj-001.dx.commercecloud.salesforce.com/on/demandware.static/-/Sites-papajohns-cl-master/default/dw1a2b/images/napocherry-1730987248.jpg',
        });
        expect(featurePhotosOf(undefined)).toEqual({ cheesePull: null, napocherry: null });
        expect(featurePhotosOf('https://x.test/otra/foto.jpg').cheesePull).toBeNull();
    });
});

describe('Home de Sofía con y sin sesión', () => {
    const context = { get: () => undefined } as never;
    const getCustomer = vi.fn();
    const getCustomerOrders = vi.fn();

    function withSession(registered: boolean): void {
        vi.mocked(getAuth).mockReturnValue(
            (registered ? { userType: 'registered', customerId: 'cust-1' } : { userType: 'guest' }) as never
        );
        vi.mocked(createApiClients).mockReturnValue({
            shopperProducts: { getProducts: vi.fn().mockResolvedValue({ data: { data: [] } }) },
            shopperCustomers: { getCustomer, getCustomerOrders },
        } as never);
    }
    const load = () => loadHomeData({ context, profile: 'sofia', moment: null });

    test('sin sesión (?perfil=sofia) muestra los datos de ejemplo', async () => {
        withSession(false);
        expect((await load()).sofia).toMatchObject({ firstName: SOFIA_SAMPLE.firstName, live: false });
    });

    test('con sesión, si el cliente no responde, no muestra a Sofía de ejemplo', async () => {
        withSession(true);
        getCustomer.mockRejectedValueOnce(new Error('400 invalid-customer'));
        getCustomerOrders.mockResolvedValueOnce({ data: { data: [] } });
        expect((await load()).sofia).toBeNull();
    });

    test('con sesión, si fallan solo los pedidos, muestra el nombre y el saldo', async () => {
        withSession(true);
        getCustomer.mockResolvedValueOnce({ data: { firstName: 'Raúl', c_pjPoints: 0 } });
        getCustomerOrders.mockRejectedValueOnce(new Error('getCustomerOrders failed'));
        expect((await load()).sofia).toMatchObject({ firstName: 'Raúl', points: 0, live: true, lastOrder: null });
    });
});
