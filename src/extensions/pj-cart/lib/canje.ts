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
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import type { CanjeState } from './cart-model';

/**
 * Canje de Papa Puntos elegido en el carrito (UX-3 §3.6, CAR-04). Vive en la cookie `pj_canje` para que el
 * checkout (CHK-03) lo lea igual y lo muestre aplicado. Los puntos se descuentan al pagar, no aquí.
 */
export const PJ_CANJE_COOKIE = 'pj_canje';

/** Pizza canjeable de la demo: Super Pepperoni mediana por 260 puntos (CONTRATO §4.1, S-D12). */
export const CANJE_PRODUCT = { masterId: 'pz-super-pepperoni', variantId: 'pz-super-pepperoni-medium-traditional' };

export function parseCanje(raw: string | null | undefined): CanjeState | null {
    if (!raw) return null;
    try {
        const value = JSON.parse(decodeURIComponent(raw)) as Partial<CanjeState>;
        if (
            typeof value.itemId === 'string' &&
            typeof value.productId === 'string' &&
            typeof value.points === 'number' &&
            typeof value.value === 'number'
        ) {
            return { itemId: value.itemId, productId: value.productId, points: value.points, value: value.value };
        }
    } catch {
        return null;
    }
    return null;
}

export function readCanjeCookie(cookieHeader: string | null | undefined): CanjeState | null {
    const match = (cookieHeader ?? '').split(/;\s*/).find((part) => part.startsWith(`${PJ_CANJE_COOKIE}=`));
    return match ? parseCanje(match.slice(PJ_CANJE_COOKIE.length + 1)) : null;
}

export function writeCanjeCookie(value: CanjeState | null, doc: Pick<Document, 'cookie'> = document): void {
    doc.cookie = value
        ? `${PJ_CANJE_COOKIE}=${encodeURIComponent(JSON.stringify(value))}; Path=/; Max-Age=86400; SameSite=Lax`
        : `${PJ_CANJE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
