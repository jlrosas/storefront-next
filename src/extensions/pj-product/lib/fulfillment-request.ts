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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import { readFulfillmentFromDocument, type Fulfillment } from '@/extensions/pj-shared/lib/fulfillment';

/**
 * GANCHO CON TIE (panel de tienda y modalidad), contrato estándar de INT por eventos de `window`
 * (copia del de OFE, `pj-offers/lib/hooks-fulfillment.ts`; INT lo moverá a pj-shared):
 *
 * 1. Al agregar sin tienda (no hay cookie `pj_fulfillment`), PRO dispara `pj:open-fulfillment`
 *    (cancelable) con `detail = { source: 'pj-product', reason: 'add-to-cart', productName }`.
 * 2. Si el panel de TIE está montado, lo abre y llama a `event.preventDefault()`. PRO espera.
 * 3. Al confirmar, TIE guarda la cookie y dispara `pj:fulfillment-changed` (`detail = Fulfillment`):
 *    la hoja recarga su inventario con la tienda elegida y agrega la pizza sin perder lo elegido.
 * 4. Si se cierra sin elegir, TIE dispara `pj:fulfillment-dismissed`: la hoja queda como estaba.
 * 5. Si nadie llama a `preventDefault()` (TIE aún no integrado), PRO agrega igual para no bloquear.
 */
export const PJ_FULFILLMENT_EVENTS = {
    open: 'pj:open-fulfillment',
    changed: 'pj:fulfillment-changed',
    dismissed: 'pj:fulfillment-dismissed',
} as const;

export interface OpenFulfillmentDetail {
    source: 'pj-product';
    reason: 'add-to-cart';
    /** «Pollo BBQ Familiar» (para el texto «Para agregar tu …, dinos cómo lo quieres»). */
    productName?: string;
}

/** Pide abrir el panel de TIE. Devuelve `true` si alguien lo tomó (`preventDefault`). */
export function requestFulfillmentPanel(
    productName?: string,
    target: Pick<EventTarget, 'dispatchEvent'> = window
): boolean {
    const event = new CustomEvent<OpenFulfillmentDetail>(PJ_FULFILLMENT_EVENTS.open, {
        cancelable: true,
        detail: { source: 'pj-product', reason: 'add-to-cart', productName },
    });
    return !target.dispatchEvent(event);
}

/** Espera la respuesta del panel: la modalidad elegida o `null` si se cerró sin elegir. */
export function waitForFulfillment(target: EventTarget = window): Promise<Fulfillment | null> {
    return new Promise((resolve) => {
        const done = (value: Fulfillment | null) => {
            target.removeEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
            target.removeEventListener(PJ_FULFILLMENT_EVENTS.dismissed, onDismissed);
            resolve(value);
        };
        const onChanged = (event: Event) =>
            done((event as CustomEvent<Fulfillment>).detail ?? readFulfillmentFromDocument());
        const onDismissed = () => done(null);
        target.addEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
        target.addEventListener(PJ_FULFILLMENT_EVENTS.dismissed, onDismissed);
    });
}

/**
 * Asegura que haya tienda antes de agregar. `'ready'`: ya había o se eligió ahora (`changed` = true si
 * se eligió ahora); `'cancelled'`: el cliente cerró el panel.
 */
export async function ensureFulfillment(
    productName?: string
): Promise<{ status: 'ready' | 'cancelled'; changed: boolean }> {
    if (typeof window === 'undefined' || readFulfillmentFromDocument()) return { status: 'ready', changed: false };
    const wait = waitForFulfillment();
    if (!requestFulfillmentPanel(productName)) return { status: 'ready', changed: false };
    const value = await wait;
    return value ? { status: 'ready', changed: true } : { status: 'cancelled', changed: false };
}

export { readFulfillmentFromDocument };
