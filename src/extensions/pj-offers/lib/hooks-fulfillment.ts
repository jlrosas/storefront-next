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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import {
    readFulfillmentFromDocument,
    writeFulfillmentToDocument,
    type Fulfillment,
} from '@/extensions/pj-shared/lib/fulfillment';

/**
 * GANCHO CON TIE (panel de tienda y modalidad).
 *
 * Contrato por eventos de `window`, sin importar nada de `pj-store`:
 *
 * 1. Al agregar un combo sin tienda elegida (no hay cookie `pj_fulfillment`), OFE dispara
 *    `pj:open-fulfillment` (cancelable) con `detail = { source: 'pj-offers', reason: 'add-to-cart' }`.
 * 2. Si el panel de TIE está montado, escucha el evento, lo abre y llama a `event.preventDefault()`
 *    para decir «yo me encargo». OFE entonces espera.
 * 3. Cuando el cliente confirma, TIE guarda la cookie (`writeFulfillmentToDocument`) y dispara
 *    `pj:fulfillment-changed` con `detail = Fulfillment`. OFE retoma y agrega el combo armado.
 * 4. Si el panel se cierra sin elegir, TIE dispara `pj:fulfillment-dismissed` y OFE cancela sin perder las elecciones.
 * 5. Si nadie llama a `preventDefault()` (TIE aún no integrado), OFE agrega el combo sin tienda
 *    para no dejar la demo bloqueada.
 *
 * OFE también dispara `pj:fulfillment-changed` cuando cambia la modalidad por su cuenta
 * («Retirar en El Bosque», caso 2), para que el chip del encabezado se actualice.
 */
export const PJ_FULFILLMENT_EVENTS = {
    open: 'pj:open-fulfillment',
    changed: 'pj:fulfillment-changed',
    dismissed: 'pj:fulfillment-dismissed',
} as const;

export interface OpenFulfillmentDetail {
    source: 'pj-offers';
    reason: 'add-to-cart';
}

/** Pide abrir el panel de TIE. Devuelve `true` si alguien lo tomó (`preventDefault`). */
export function requestFulfillmentPanel(
    productName?: string,
    target: Pick<EventTarget, 'dispatchEvent'> = window
): boolean {
    const event = new CustomEvent<OpenFulfillmentDetail>(PJ_FULFILLMENT_EVENTS.open, {
        cancelable: true,
        // Con el nombre, el panel dice «Para agregar tu Super Dúo.» (diseño 05, VAL-ENT H1).
        detail: { source: 'pj-offers', reason: 'add-to-cart', ...(productName ? { productName } : {}) },
    });
    return !target.dispatchEvent(event);
}

/** Cambia la modalidad desde OFE y avisa al resto de la página. */
export function changeFulfillment(value: Fulfillment, target: EventTarget = window): void {
    writeFulfillmentToDocument(value);
    target.dispatchEvent(new CustomEvent<Fulfillment>(PJ_FULFILLMENT_EVENTS.changed, { detail: value }));
}

export { readFulfillmentFromDocument };
