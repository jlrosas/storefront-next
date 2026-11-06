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
import {
    demoCookieUpdates,
    getDemoMoment,
    getDemoProfile,
    pjDemoContext,
    readCookie,
    readDemoSignals,
    resolveDemoMoment,
    resolveDemoProfile,
    serializeDemoCookie,
} from './profile';

const { mockGetAuth } = vi.hoisted(() => ({ mockGetAuth: vi.fn() }));
vi.mock('@/middlewares/auth.server', () => ({ getAuth: mockGetAuth }));
vi.mock('@salesforce/storefront-next-runtime/config', () => ({
    getConfig: () => ({ url: { prefix: '' } }),
}));

const { pjDemoMiddleware } = await import('../middlewares/demo.server');

/** Fecha en Santiago (UTC−3 en noviembre de 2026). */
const santiago = (iso: string) => new Date(`${iso}-03:00`);

describe('resolveDemoProfile (CONTRATO §2)', () => {
    it('sin datos es Valentina', () => {
        expect(resolveDemoProfile({})).toBe('valentina');
    });

    it('utm_campaign=PJSD26 o la URL de la oferta es Diego', () => {
        expect(resolveDemoProfile({ campaign: 'PJSD26' })).toBe('diego');
        expect(resolveDemoProfile({ campaign: 'pjsd26' })).toBe('diego');
        expect(resolveDemoProfile({ pathname: '/promos/super-duo' })).toBe('diego');
        expect(resolveDemoProfile({ campaign: 'PJSD26', isRegistered: true })).toBe('diego');
    });

    it('utm_campaign=reactivacion es Valentina aunque tenga sesión', () => {
        expect(resolveDemoProfile({ campaign: 'reactivacion', isRegistered: true })).toBe('valentina');
    });

    it('con sesión y sin campaña es Sofía', () => {
        expect(resolveDemoProfile({ isRegistered: true })).toBe('sofia');
    });

    it('el perfil forzado manda sobre todo', () => {
        expect(resolveDemoProfile({ forcedProfile: 'diego', isRegistered: true })).toBe('diego');
        expect(resolveDemoProfile({ forcedProfile: 'sofia', campaign: 'PJSD26' })).toBe('sofia');
    });
});

describe('resolveDemoMoment (R4.2)', () => {
    it('almuerzo de 12:00 a 15:00', () => {
        expect(resolveDemoMoment(null, santiago('2026-11-18T12:00:00'))).toBe('almuerzo');
        expect(resolveDemoMoment(null, santiago('2026-11-18T14:59:00'))).toBe('almuerzo');
        expect(resolveDemoMoment(null, santiago('2026-11-18T15:00:00'))).toBeNull();
    });

    it('celebración viernes y sábado de 19:00 a 22:00; otro día, nada', () => {
        expect(resolveDemoMoment(null, santiago('2026-11-20T20:00:00'))).toBe('celebracion');
        expect(resolveDemoMoment(null, santiago('2026-11-21T19:30:00'))).toBe('celebracion');
        expect(resolveDemoMoment(null, santiago('2026-11-18T20:00:00'))).toBeNull();
    });

    it('partido si el día está en el calendario', () => {
        expect(resolveDemoMoment(null, santiago('2026-11-18T20:00:00'), { matchDays: ['2026-11-18'] })).toBe('partido');
    });

    it('bajón de 22:00 a 02:00', () => {
        expect(resolveDemoMoment(null, santiago('2026-11-18T23:10:00'))).toBe('bajon');
        expect(resolveDemoMoment(null, santiago('2026-11-19T01:30:00'))).toBe('bajon');
        expect(resolveDemoMoment(null, santiago('2026-11-19T02:00:00'))).toBeNull();
    });

    it('la hora forzada manda', () => {
        expect(resolveDemoMoment('partido', santiago('2026-11-18T09:00:00'))).toBe('partido');
    });
});

describe('cookies de ?perfil= y ?hora=', () => {
    it('?perfil= y ?hora= se guardan en pj_perfil y pj_hora', () => {
        const updates = demoCookieUpdates(new URLSearchParams('perfil=diego&hora=partido'));
        expect(updates).toEqual([
            { name: 'pj_perfil', value: 'diego', maxAge: 604800 },
            { name: 'pj_hora', value: 'partido', maxAge: 604800 },
        ]);
    });

    it('?perfil=auto y ?hora=ahora borran la cookie; valores desconocidos se ignoran', () => {
        expect(demoCookieUpdates(new URLSearchParams('perfil=auto&hora=ahora'))).toEqual([
            { name: 'pj_perfil', value: null },
            { name: 'pj_campana', value: null },
            { name: 'pj_hora', value: null },
        ]);
        expect(demoCookieUpdates(new URLSearchParams('perfil=pedro&hora=cena'))).toEqual([]);
    });

    it('?perfil=auto borra también pj_hora y pj_campana (vuelve a la regla)', () => {
        expect(demoCookieUpdates(new URLSearchParams('perfil=auto'))).toEqual([
            { name: 'pj_perfil', value: null },
            { name: 'pj_hora', value: null },
            { name: 'pj_campana', value: null },
        ]);
        const request = new Request('https://x.test/?perfil=auto', {
            headers: { Cookie: 'pj_perfil=diego; pj_hora=bajon; pj_campana=PJSD26' },
        });
        expect(readDemoSignals(request)).toMatchObject({ forcedProfile: null, forcedMoment: null, campaign: null });
    });

    it('utm_campaign se recuerda en la cookie de sesión pj_campana', () => {
        expect(demoCookieUpdates(new URLSearchParams('utm_campaign=PJSD26'))).toEqual([
            { name: 'pj_campana', value: 'PJSD26' },
        ]);
    });

    it('serializa Set-Cookie legible por el cliente', () => {
        expect(serializeDemoCookie({ name: 'pj_perfil', value: 'sofia', maxAge: 60 })).toBe(
            'pj_perfil=sofia; Path=/; Max-Age=60; SameSite=Lax'
        );
        expect(serializeDemoCookie({ name: 'pj_hora', value: null }, true)).toBe(
            'pj_hora=; Path=/; Max-Age=0; SameSite=Lax; Secure'
        );
    });

    it('readCookie lee por nombre exacto', () => {
        expect(readCookie('a=1; pj_perfil=diego; pj_perfil_x=2', 'pj_perfil')).toBe('diego');
        expect(readCookie(null, 'pj_perfil')).toBeNull();
    });

    it('readDemoSignals: la URL manda sobre la cookie en la misma request', () => {
        const request = new Request('https://x.test/?perfil=sofia', {
            headers: { Cookie: 'pj_perfil=diego; pj_hora=bajon' },
        });
        expect(readDemoSignals(request)).toMatchObject({ forcedProfile: 'sofia', forcedMoment: 'bajon' });
    });
});

describe('pjDemoMiddleware + getDemoProfile / getDemoMoment', () => {
    async function run(url: string, cookie = '', userType = 'guest') {
        mockGetAuth.mockReturnValue({ userType });
        const context = new RouterContextProvider();
        const request = new Request(url, { headers: cookie ? { Cookie: cookie } : {} });
        const response = await pjDemoMiddleware({ request, context, params: {}, unstable_pattern: '/' } as never, () =>
            Promise.resolve(new Response('ok'))
        );
        return { context, response: response as Response };
    }

    it('guarda ?perfil= y ?hora= en cookie y getDemoProfile aplica el perfil forzado', async () => {
        const { context, response } = await run('https://x.test/?perfil=diego&hora=partido');
        const setCookie = response.headers.getSetCookie();
        expect(setCookie).toContain('pj_perfil=diego; Path=/; Max-Age=604800; SameSite=Lax; Secure');
        expect(setCookie).toContain('pj_hora=partido; Path=/; Max-Age=604800; SameSite=Lax; Secure');
        expect(getDemoProfile(context)).toBe('diego');
        expect(getDemoMoment(context)).toBe('partido');
    });

    it('en la siguiente visita lee la cookie', async () => {
        const { context, response } = await run(
            'https://x.test/menu',
            'pj_perfil=valentina; pj_hora=almuerzo',
            'registered'
        );
        expect(response.headers.getSetCookie()).toEqual([]);
        expect(getDemoProfile(context)).toBe('valentina');
        expect(getDemoMoment(context)).toBe('almuerzo');
    });

    it('sin cookie aplica la regla: con sesión es Sofía, sin sesión Valentina', async () => {
        expect(getDemoProfile((await run('https://x.test/', '', 'registered')).context)).toBe('sofia');
        expect(getDemoProfile((await run('https://x.test/', '', 'guest')).context)).toBe('valentina');
    });

    it('sin middleware el contexto vacío da Valentina', () => {
        const context = new RouterContextProvider();
        expect(context.get(pjDemoContext)).toBeNull();
        expect(getDemoProfile(context)).toBe('valentina');
    });
});
