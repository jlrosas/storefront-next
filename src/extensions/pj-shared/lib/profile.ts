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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */
import { createContext, type RouterContextProvider } from 'react-router';
import { PJ_TIME_ZONE } from './format';

/**
 * Perfil y momento de la demo (CONTRATO §2, R4.1 y R4.2).
 *
 * Única fuente de verdad: nadie más decide el perfil por su cuenta. El middleware
 * `pjDemoMiddleware` (middlewares/demo.server.ts) lee la URL, las cookies y la sesión en cada
 * request, guarda `?perfil=` y `?hora=` en cookie y deja las señales en `pjDemoContext`.
 * Los loaders llaman a `getDemoProfile(context)` y `getDemoMoment(context)`.
 */

export const DEMO_PROFILES = ['valentina', 'diego', 'sofia'] as const;
export type DemoProfile = (typeof DEMO_PROFILES)[number];

export const DEMO_MOMENTS = ['almuerzo', 'partido', 'celebracion', 'bajon'] as const;
export type DemoMoment = (typeof DEMO_MOMENTS)[number];

/** Cookie que fuerza el perfil (`?perfil=valentina|diego|sofia`; `?perfil=auto` la borra). */
export const PJ_PROFILE_COOKIE = 'pj_perfil';
/** Cookie que fuerza el momento (`?hora=almuerzo|partido|celebracion|bajon`; `?hora=ahora` la borra). */
export const PJ_MOMENT_COOKIE = 'pj_hora';
/** Cookie de sesión con el último `utm_campaign` recibido (Diego sigue siendo Diego al navegar). */
export const PJ_CAMPAIGN_COOKIE = 'pj_campana';

/** `utm_campaign` del anuncio del Super Dúo (source code `PJSD26`). */
export const DIEGO_CAMPAIGN = 'PJSD26';
/** `utm_campaign` del correo de reactivación. */
export const VALENTINA_CAMPAIGN = 'reactivacion';
/** Rutas de oferta que identifican a Diego aunque llegue sin parámetros. */
export const DIEGO_PATHS = ['/promos/super-duo'];

/**
 * Días con partido en el calendario de ejemplo (R4.2), en `AAAA-MM-DD` de Chile.
 * Sin partidos cargados, de 19:00 a 22:00 rige «Celebración» (viernes y sábado) o nada.
 */
export const PJ_MATCH_DAYS: readonly string[] = [];

/** Lo que el middleware deja en el contexto de cada request. */
export interface DemoSignals {
    /** Perfil forzado por `?perfil=` o su cookie. */
    forcedProfile: DemoProfile | null;
    /** Momento forzado por `?hora=` o su cookie. */
    forcedMoment: DemoMoment | null;
    /** `utm_campaign` de la URL o de la cookie de sesión. */
    campaign: string | null;
    /** Ruta sin el prefijo de sitio y locale (`/promos/super-duo`). */
    pathname: string;
    /** Hay sesión de cliente registrado. */
    isRegistered: boolean;
}

export const pjDemoContext = createContext<DemoSignals | null>(null);

export function isDemoProfile(value: unknown): value is DemoProfile {
    return typeof value === 'string' && (DEMO_PROFILES as readonly string[]).includes(value);
}

export function isDemoMoment(value: unknown): value is DemoMoment {
    return typeof value === 'string' && (DEMO_MOMENTS as readonly string[]).includes(value);
}

/**
 * Regla del perfil (CONTRATO §2):
 * 1. Perfil forzado (`?perfil=` / cookie `pj_perfil`).
 * 2. `utm_campaign=PJSD26` o una URL de oferta (`/promos/super-duo`) → Diego.
 * 3. `utm_campaign=reactivacion` → Valentina.
 * 4. Sesión iniciada → Sofía (supuesto: en la demo, los clientes con sesión que no llegan por
 *    campaña son los que tienen historial; Diego y Valentina llegan por campaña o con `?perfil=`).
 * 5. Sin datos → Valentina.
 */
export function resolveDemoProfile(signals: Partial<DemoSignals>): DemoProfile {
    if (signals.forcedProfile && isDemoProfile(signals.forcedProfile)) {
        return signals.forcedProfile;
    }
    const campaign = signals.campaign?.trim().toLowerCase() ?? '';
    const pathname = signals.pathname ?? '';
    if (campaign === DIEGO_CAMPAIGN.toLowerCase() || DIEGO_PATHS.some((p) => pathname.startsWith(p))) {
        return 'diego';
    }
    if (campaign === VALENTINA_CAMPAIGN) {
        return 'valentina';
    }
    if (signals.isRegistered) {
        return 'sofia';
    }
    return 'valentina';
}

function chileClock(now: Date, timeZone: string): { hour: number; weekday: number; day: string } {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        hour12: false,
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(now);
    const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
    const hour = Number(get('hour')) % 24;
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { hour, weekday, day: `${get('year')}-${get('month')}-${get('day')}` };
}

/**
 * Regla del momento (R4.2), con la hora de Chile:
 * - 12:00–15:00 → almuerzo
 * - 19:00–22:00 con partido en `PJ_MATCH_DAYS` → partido
 * - viernes y sábado 19:00–22:00 → celebración
 * - 22:00–02:00 → bajón
 * - resto → `null` (la Home muestra «¿Para cuántos?»)
 */
export function resolveDemoMoment(
    forced: DemoMoment | null | undefined,
    now: Date = new Date(),
    options: { matchDays?: readonly string[]; timeZone?: string } = {}
): DemoMoment | null {
    if (forced && isDemoMoment(forced)) {
        return forced;
    }
    const { hour, weekday, day } = chileClock(now, options.timeZone ?? PJ_TIME_ZONE);
    if (hour >= 12 && hour < 15) return 'almuerzo';
    if (hour >= 19 && hour < 22) {
        if ((options.matchDays ?? PJ_MATCH_DAYS).includes(day)) return 'partido';
        if (weekday === 5 || weekday === 6) return 'celebracion';
        return null;
    }
    if (hour >= 22 || hour < 2) return 'bajon';
    return null;
}

/** Perfil de la visita para un loader o action. */
export function getDemoProfile(context: Readonly<RouterContextProvider>): DemoProfile {
    return resolveDemoProfile(context.get(pjDemoContext) ?? {});
}

/** Momento del día para un loader o action (`null` = «¿Para cuántos?»). */
export function getDemoMoment(context: Readonly<RouterContextProvider>, now: Date = new Date()): DemoMoment | null {
    return resolveDemoMoment(context.get(pjDemoContext)?.forcedMoment ?? null, now);
}

/** Lee una cookie por nombre exacto desde la cabecera `Cookie`. */
export function readCookie(cookieHeader: string | null | undefined, name: string): string | null {
    if (!cookieHeader) return null;
    for (const part of cookieHeader.split(';')) {
        const index = part.indexOf('=');
        if (index === -1) continue;
        if (part.slice(0, index).trim() === name) {
            const raw = part.slice(index + 1).trim();
            try {
                return decodeURIComponent(raw);
            } catch {
                return raw;
            }
        }
    }
    return null;
}

export interface DemoCookieUpdate {
    name: string;
    /** `null` borra la cookie. */
    value: string | null;
    /** Segundos; sin valor es una cookie de sesión. */
    maxAge?: number;
}

const WEEK = 60 * 60 * 24 * 7;

/**
 * Cookies que hay que escribir según los parámetros de la URL:
 * `?perfil=` → `pj_perfil`, `?hora=` → `pj_hora`, `?utm_campaign=` → `pj_campana`.
 * Valores desconocidos se ignoran; `ahora` borra `pj_hora`; `?perfil=auto` borra `pj_perfil`,
 * `pj_hora` y `pj_campana` (vuelve a la regla del contrato).
 */
export function demoCookieUpdates(searchParams: URLSearchParams): DemoCookieUpdate[] {
    const updates: DemoCookieUpdate[] = [];
    const perfil = searchParams.get('perfil')?.toLowerCase();
    if (perfil === 'auto') {
        // Vuelve a la regla: también olvida la campaña y la hora forzada (salvo que vengan en la URL).
        updates.push({ name: PJ_PROFILE_COOKIE, value: null });
        if (!searchParams.get('hora')) updates.push({ name: PJ_MOMENT_COOKIE, value: null });
        if (!searchParams.get('utm_campaign')) updates.push({ name: PJ_CAMPAIGN_COOKIE, value: null });
    } else if (isDemoProfile(perfil)) updates.push({ name: PJ_PROFILE_COOKIE, value: perfil, maxAge: WEEK });

    const hora = searchParams.get('hora')?.toLowerCase();
    if (hora === 'ahora') updates.push({ name: PJ_MOMENT_COOKIE, value: null });
    else if (isDemoMoment(hora)) updates.push({ name: PJ_MOMENT_COOKIE, value: hora, maxAge: WEEK });

    const campaign = searchParams.get('utm_campaign');
    if (campaign) updates.push({ name: PJ_CAMPAIGN_COOKIE, value: campaign });
    return updates;
}

/** Cabecera `Set-Cookie` para una actualización (legible por el cliente, `SameSite=Lax`). */
export function serializeDemoCookie(update: DemoCookieUpdate, secure = false): string {
    const parts = [`${update.name}=${update.value === null ? '' : encodeURIComponent(update.value)}`, 'Path=/'];
    if (update.value === null) parts.push('Max-Age=0');
    else if (update.maxAge !== undefined) parts.push(`Max-Age=${update.maxAge}`);
    parts.push('SameSite=Lax');
    if (secure) parts.push('Secure');
    return parts.join('; ');
}

/**
 * Señales de la request con las cookies ya actualizadas por la URL (los parámetros mandan
 * sobre las cookies en la misma request).
 */
export function readDemoSignals(
    request: Request,
    options: { pathname?: string; isRegistered?: boolean } = {}
): DemoSignals {
    const url = new URL(request.url);
    const cookieHeader = request.headers.get('Cookie');
    const values = new Map<string, string | null>([
        [PJ_PROFILE_COOKIE, readCookie(cookieHeader, PJ_PROFILE_COOKIE)],
        [PJ_MOMENT_COOKIE, readCookie(cookieHeader, PJ_MOMENT_COOKIE)],
        [PJ_CAMPAIGN_COOKIE, readCookie(cookieHeader, PJ_CAMPAIGN_COOKIE)],
    ]);
    for (const update of demoCookieUpdates(url.searchParams)) {
        values.set(update.name, update.value);
    }
    const perfil = values.get(PJ_PROFILE_COOKIE);
    const hora = values.get(PJ_MOMENT_COOKIE);
    return {
        forcedProfile: isDemoProfile(perfil) ? perfil : null,
        forcedMoment: isDemoMoment(hora) ? hora : null,
        campaign: values.get(PJ_CAMPAIGN_COOKIE) ?? null,
        pathname: options.pathname ?? url.pathname,
        isRegistered: options.isRegistered ?? false,
    };
}
