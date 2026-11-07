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
import { describe, expect, it, vi } from 'vitest';
import { RouterContextProvider } from 'react-router';
import { DEMO_PERSONAS, demoFulfillmentUpdate, initialOf, resolveHeaderAccount, SOFIA_STORE_ID } from './persona';
import { readFulfillment } from './fulfillment';

const { mockGetAuth } = vi.hoisted(() => ({ mockGetAuth: vi.fn() }));
vi.mock('@/middlewares/auth.server', () => ({ getAuth: mockGetAuth }));
vi.mock('@salesforce/storefront-next-runtime/config', () => ({
    getConfig: () => ({ url: { prefix: '' } }),
}));

const { pjDemoMiddleware } = await import('../middlewares/demo.server');

const SOFIA_PICKUP = { mode: 'pickup', storeId: SOFIA_STORE_ID, when: 'asap' } as const;
const fulfillmentCookie = (value: object) => `pj_fulfillment=${encodeURIComponent(JSON.stringify(value))}`;
const params = (query: string) => new URLSearchParams(query);

describe('initialOf', () => {
    it('toma la primera letra en mayúscula', () => {
        expect(initialOf('Sofía')).toBe('S');
        expect(initialOf(' valentina')).toBe('V');
        expect(initialOf('Ángela')).toBe('Á');
        expect(initialOf('')).toBe('');
    });
});

describe('resolveHeaderAccount (INT-08: perfil → encabezado)', () => {
    it('sin sesión ni perfil forzado es invitado («Ingresar»)', () => {
        expect(resolveHeaderAccount({ me: null, demoProfile: null })).toEqual({ kind: 'guest' });
        expect(
            resolveHeaderAccount({ me: { registered: false, firstName: null, points: null }, demoProfile: undefined })
        ).toEqual({ kind: 'guest' });
    });

    it.each([
        ['sofia', 'Sofía', 'S', 340],
        ['diego', 'Diego', 'D', null],
        ['valentina', 'Valentina', 'V', 40],
    ] as const)('?perfil=%s muestra a %s', (profile, firstName, initial, points) => {
        expect(resolveHeaderAccount({ me: null, demoProfile: profile })).toEqual({
            kind: 'customer',
            firstName,
            initial,
            points,
            source: 'demo',
        });
    });

    it('la sesión real manda sobre el perfil forzado', () => {
        expect(
            resolveHeaderAccount({
                me: { registered: true, firstName: 'Raúl', points: 120 },
                demoProfile: 'sofia',
            })
        ).toEqual({ kind: 'customer', firstName: 'Raúl', initial: 'R', points: 120, source: 'session' });
    });

    it('con sesión todavía sin nombre cae al perfil forzado o al invitado', () => {
        const pending = { registered: true, firstName: null, points: null };
        expect(resolveHeaderAccount({ me: pending, demoProfile: 'diego' })).toMatchObject({ firstName: 'Diego' });
        expect(resolveHeaderAccount({ me: pending, demoProfile: null })).toEqual({ kind: 'guest' });
    });

    it('un saldo de 0 o desconocido no pinta la píldora', () => {
        expect(
            resolveHeaderAccount({ me: { registered: true, firstName: 'Ana', points: 0 }, demoProfile: null })
        ).toMatchObject({ points: null });
        expect(
            resolveHeaderAccount({ me: { registered: true, firstName: 'Ana', points: null }, demoProfile: null })
        ).toMatchObject({ points: null });
    });

    it('ignora un perfil desconocido', () => {
        expect(resolveHeaderAccount({ me: null, demoProfile: 'pedro' as never })).toEqual({ kind: 'guest' });
    });
});

describe('demoFulfillmentUpdate (INT-08: modalidad del perfil)', () => {
    it('Sofía sin modalidad toma la suya: retiro en El Bosque', () => {
        expect(DEMO_PERSONAS.sofia.lastFulfillment).toEqual(SOFIA_PICKUP);
        expect(demoFulfillmentUpdate(params('perfil=sofia'), '')).toEqual(SOFIA_PICKUP);
        expect(demoFulfillmentUpdate(params('perfil=SOFIA'), 'pj_perfil=sofia')).toEqual(SOFIA_PICKUP);
    });

    it('si Sofía ya eligió otra tienda en la sesión, gana su elección', () => {
        const salvador = fulfillmentCookie({ mode: 'pickup', storeId: 'pj-9', when: 'asap' });
        expect(demoFulfillmentUpdate(params('perfil=sofia'), `pj_perfil=sofia; ${salvador}`)).toBeUndefined();
        expect(demoFulfillmentUpdate(params(''), `pj_perfil=sofia; ${salvador}`)).toBeUndefined();
    });

    it('cambiar de perfil es cambiar de cliente: la modalidad pasa a la del nuevo', () => {
        const salvador = fulfillmentCookie({ mode: 'pickup', storeId: 'pj-9', when: 'asap' });
        expect(demoFulfillmentUpdate(params('perfil=sofia'), `pj_perfil=diego; ${salvador}`)).toEqual(SOFIA_PICKUP);
        expect(demoFulfillmentUpdate(params('perfil=diego'), `pj_perfil=sofia; ${salvador}`)).toBeNull();
        expect(demoFulfillmentUpdate(params('perfil=valentina'), salvador)).toBeNull();
    });

    it('Diego y Valentina sin modalidad siguen en «Elige tienda»', () => {
        expect(demoFulfillmentUpdate(params('perfil=diego'), '')).toBeUndefined();
        expect(demoFulfillmentUpdate(params('perfil=valentina'), 'pj_perfil=sofia')).toBeUndefined();
    });

    it('?perfil=auto borra la modalidad del perfil anterior; sin perfil no toca nada', () => {
        const bosque = fulfillmentCookie(SOFIA_PICKUP);
        expect(demoFulfillmentUpdate(params('perfil=auto'), `pj_perfil=sofia; ${bosque}`)).toBeNull();
        expect(demoFulfillmentUpdate(params('perfil=auto'), bosque)).toBeUndefined();
        expect(demoFulfillmentUpdate(params('perfil=pedro'), '')).toBeUndefined();
        expect(demoFulfillmentUpdate(params(''), '')).toBeUndefined();
    });
});

describe('pjDemoMiddleware escribe la modalidad del perfil', () => {
    async function run(url: string, cookie = '') {
        mockGetAuth.mockReturnValue({ userType: 'guest' });
        const context = new RouterContextProvider();
        const request = new Request(url, { headers: cookie ? { Cookie: cookie } : {} });
        let seenByLoaders: string | null = null;
        const response = (await pjDemoMiddleware(
            { request, context, params: {}, unstable_pattern: '/' } as never,
            () => {
                seenByLoaders = request.headers.get('Cookie');
                return Promise.resolve(new Response('ok'));
            }
        )) as Response;
        return { response, seenByLoaders: seenByLoaders as string | null };
    }

    it('?perfil=sofia deja retiro en El Bosque en la cookie y en la misma request', async () => {
        const { response, seenByLoaders } = await run('https://x.test/?perfil=sofia', 'currency=CLP');
        const setCookie = response.headers.getSetCookie().find((c) => c.startsWith('pj_fulfillment='));
        expect(setCookie).toMatch(/Path=\/; Max-Age=\d+; SameSite=Lax; Secure$/);
        expect(readFulfillment(setCookie?.split(';')[0])).toEqual(SOFIA_PICKUP);
        expect(readFulfillment(seenByLoaders)).toEqual(SOFIA_PICKUP);
        expect(seenByLoaders).toContain('currency=CLP');
    });

    it('al pasar de Sofía a Diego borra la modalidad', async () => {
        const { response, seenByLoaders } = await run(
            'https://x.test/?perfil=diego',
            `pj_perfil=sofia; ${fulfillmentCookie(SOFIA_PICKUP)}`
        );
        expect(response.headers.getSetCookie()).toContain('pj_fulfillment=; Path=/; Max-Age=0; SameSite=Lax; Secure');
        expect(readFulfillment(seenByLoaders)).toBeNull();
    });

    it('sin ?perfil= no escribe la modalidad', async () => {
        const { response } = await run('https://x.test/menu', 'pj_perfil=sofia');
        expect(response.headers.getSetCookie().some((c) => c.startsWith('pj_fulfillment='))).toBe(false);
    });
});
