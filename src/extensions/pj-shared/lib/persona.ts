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
import { isDemoProfile, PJ_PROFILE_COOKIE, readCookie, type DemoProfile } from './profile';
import { readFulfillment, type Fulfillment } from './fulfillment';

/**
 * Cliente de demo detrás de cada perfil (CONTRATO §3). Con `?perfil=` el encabezado lo muestra como
 * si hubiera sesión (INT-08): la sesión SLAS real no se puede abrir desde un parámetro de URL sin
 * guardar contraseñas en el servidor, así que el perfil forzado hace de «sesión de demo».
 * Con una sesión real (ingreso con correo y código) mandan los datos del cliente de Commerce.
 */
export interface DemoPersona {
    profile: DemoProfile;
    firstName: string;
    /** Saldo de Papa Puntos del cliente de demo (CONTRATO §3). */
    points: number;
    /**
     * Última modalidad del cliente: la que el chip muestra mientras no elija otra en la sesión.
     * Solo Sofía tiene una reciente (retiro en El Bosque, pedido canónico §6). Diego no tiene pedidos
     * y el de Valentina es de hace dos años: los dos eligen tienda (supuesto de INT-08).
     */
    lastFulfillment: Fulfillment | null;
}

/** El Bosque (CONTRATO §7). */
export const SOFIA_STORE_ID = 'pj-48';

export const DEMO_PERSONAS: Readonly<Record<DemoProfile, DemoPersona>> = {
    sofia: {
        profile: 'sofia',
        firstName: 'Sofía',
        points: 340,
        lastFulfillment: { mode: 'pickup', storeId: SOFIA_STORE_ID, when: 'asap' },
    },
    diego: { profile: 'diego', firstName: 'Diego', points: 0, lastFulfillment: null },
    valentina: { profile: 'valentina', firstName: 'Valentina', points: 40, lastFulfillment: null },
};

/** Inicial para el avatar: «Sofía» → «S». */
export function initialOf(name: string): string {
    const first = Array.from(name.trim())[0] ?? '';
    return first.toLocaleUpperCase('es-CL');
}

/** Lo que el encabezado muestra en el lugar de la cuenta. */
export type HeaderAccount =
    | { kind: 'guest' }
    | {
          kind: 'customer';
          firstName: string;
          initial: string;
          /** `null` = sin saldo que mostrar (no se pinta la píldora). */
          points: number | null;
          /** `session`: cliente real de Commerce. `demo`: perfil forzado con `?perfil=`. */
          source: 'session' | 'demo';
      };

/** Resumen del cliente con sesión (lo que entrega `/resource/pj-me`). */
export interface HeaderSessionInput {
    registered: boolean;
    firstName: string | null;
    points: number | null;
}

function visiblePoints(points: number | null | undefined): number | null {
    return typeof points === 'number' && Number.isFinite(points) && points > 0 ? points : null;
}

/**
 * Regla del encabezado (INT-08):
 * 1. Cliente con sesión real y nombre → sus datos.
 * 2. Perfil forzado (`?perfil=` / cookie `pj_perfil`) → el cliente de demo de ese perfil.
 * 3. Si no → invitado («Ingresar»).
 * Un saldo de 0 no se muestra (Diego): «0 Papa Puntos» no suma en el encabezado.
 */
export function resolveHeaderAccount(input: {
    me: HeaderSessionInput | null;
    demoProfile: DemoProfile | null | undefined;
}): HeaderAccount {
    const { me, demoProfile } = input;
    if (me?.registered && me.firstName) {
        return {
            kind: 'customer',
            firstName: me.firstName,
            initial: initialOf(me.firstName),
            points: visiblePoints(me.points),
            source: 'session',
        };
    }
    if (demoProfile && isDemoProfile(demoProfile)) {
        const persona = DEMO_PERSONAS[demoProfile];
        return {
            kind: 'customer',
            firstName: persona.firstName,
            initial: initialOf(persona.firstName),
            points: visiblePoints(persona.points),
            source: 'demo',
        };
    }
    return { kind: 'guest' };
}

/** `undefined` = no tocar la cookie `pj_fulfillment`; `null` = borrarla; valor = escribirla. */
export type FulfillmentCookieUpdate = Fulfillment | null | undefined;

/**
 * Modalidad al cambiar de perfil con `?perfil=` (INT-08). El cambio de perfil es un cambio de
 * cliente: la modalidad pasa a la última del nuevo cliente (o se borra si no tiene). Si el perfil
 * no cambia y ya hay una modalidad, gana la elegida en la sesión. `?perfil=auto` vuelve a la
 * regla del contrato (visitante) y borra la modalidad del perfil anterior.
 */
export function demoFulfillmentUpdate(
    searchParams: URLSearchParams,
    cookieHeader: string | null | undefined
): FulfillmentCookieUpdate {
    const perfil = searchParams.get('perfil')?.toLowerCase();
    const previous = readCookie(cookieHeader, PJ_PROFILE_COOKIE);
    const current = readFulfillment(cookieHeader);
    if (perfil === 'auto') {
        return isDemoProfile(previous) && current ? null : undefined;
    }
    if (!isDemoProfile(perfil)) return undefined;
    if (previous === perfil && current) return undefined;
    const next = DEMO_PERSONAS[perfil].lastFulfillment;
    if (next) return next;
    return current ? null : undefined;
}
