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
import { readCookie } from './profile';

/**
 * Modalidad elegida (CONTRATO §4.3): cookie `pj_fulfillment` con
 * `{ mode: "pickup" | "delivery", storeId, address?, when: "asap" | ISO }`.
 * Sirve en el servidor (cabecera `Cookie` / `Set-Cookie`) y en el cliente (`document.cookie`).
 */

export const PJ_FULFILLMENT_COOKIE = 'pj_fulfillment';

/** Un año: la tienda elegida se recuerda entre visitas. */
const MAX_AGE = 60 * 60 * 24 * 365;

export type FulfillmentMode = 'pickup' | 'delivery';

export interface Fulfillment {
    mode: FulfillmentMode;
    /** ID de la tienda en Commerce (`pj-<id>`). */
    storeId: string;
    /** Dirección de despacho (solo delivery). */
    address?: string;
    /** `asap` o fecha ISO de la hora programada. */
    when: 'asap' | string;
}

/** Mínimo de compra y costo de despacho para delivery (CONTRATO §4.3). */
export const DELIVERY_MINIMUM_CLP = 12000;
export const DELIVERY_FEE_CLP = 1990;

function isIsoDate(value: string): boolean {
    return !Number.isNaN(Date.parse(value));
}

/** Valida y normaliza un objeto desconocido; devuelve `null` si no es una modalidad válida. */
export function normalizeFulfillment(value: unknown): Fulfillment | null {
    if (!value || typeof value !== 'object') return null;
    const raw = value as Record<string, unknown>;
    if (raw.mode !== 'pickup' && raw.mode !== 'delivery') return null;
    if (typeof raw.storeId !== 'string' || raw.storeId.trim() === '') return null;
    const when = typeof raw.when === 'string' && (raw.when === 'asap' || isIsoDate(raw.when)) ? raw.when : 'asap';
    const result: Fulfillment = { mode: raw.mode, storeId: raw.storeId.trim(), when };
    if (raw.mode === 'delivery' && typeof raw.address === 'string' && raw.address.trim() !== '') {
        result.address = raw.address.trim();
    }
    return result;
}

/** Lee la modalidad del valor crudo de la cookie (JSON, con o sin codificar). */
export function parseFulfillment(cookieValue: string | null | undefined): Fulfillment | null {
    if (!cookieValue) return null;
    try {
        return normalizeFulfillment(JSON.parse(cookieValue));
    } catch {
        try {
            return normalizeFulfillment(JSON.parse(decodeURIComponent(cookieValue)));
        } catch {
            return null;
        }
    }
}

/** Lee la modalidad desde la cabecera `Cookie` de una request. */
export function readFulfillment(cookieHeader: string | null | undefined): Fulfillment | null {
    return parseFulfillment(readCookie(cookieHeader, PJ_FULFILLMENT_COOKIE));
}

/** Lee la modalidad en una request del servidor (loader o action). */
export function getFulfillment(request: Request): Fulfillment | null {
    return readFulfillment(request.headers.get('Cookie'));
}

/**
 * Cabecera `Set-Cookie` para guardar la modalidad (o borrarla con `null`).
 * Legible por el cliente para que el chip del encabezado se pinte sin esperar al servidor.
 */
export function serializeFulfillmentCookie(value: Fulfillment | null, options: { secure?: boolean } = {}): string {
    const parts =
        value === null
            ? [`${PJ_FULFILLMENT_COOKIE}=`, 'Path=/', 'Max-Age=0']
            : [
                  `${PJ_FULFILLMENT_COOKIE}=${encodeURIComponent(JSON.stringify(normalizeFulfillment(value) ?? value))}`,
                  'Path=/',
                  `Max-Age=${MAX_AGE}`,
              ];
    parts.push('SameSite=Lax');
    if (options.secure) parts.push('Secure');
    return parts.join('; ');
}

/** Lee la modalidad en el navegador. */
export function readFulfillmentFromDocument(doc: Pick<Document, 'cookie'> = document): Fulfillment | null {
    return readFulfillment(doc.cookie);
}

/** Guarda la modalidad en el navegador (por ejemplo, al elegir tienda sin recargar). */
export function writeFulfillmentToDocument(value: Fulfillment | null, doc: Pick<Document, 'cookie'> = document): void {
    const secure = typeof location !== 'undefined' && location.protocol === 'https:';
    doc.cookie = serializeFulfillmentCookie(value, { secure });
}

/** Costo de despacho del pedido según la modalidad (retiro no paga despacho). */
export function shippingFor(fulfillment: Fulfillment | null): number {
    return fulfillment?.mode === 'delivery' ? DELIVERY_FEE_CLP : 0;
}
