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

/**
 * «Hazlo combo» en escritorio (UX-2 #52). Al agregar una pizza desde la hoja, PRO dispara
 * `pj:hazlo-combo-offer` (cancelable). Si el panel «Tu pedido» del menú está a la vista, MEN llama a
 * `preventDefault()` y muestra la oferta bajo la línea recién agregada; la hoja se cierra con el aviso
 * corto. Sin nadie que lo atienda (móvil, Home, otras pantallas) la hoja sigue con su paso «Hazlo combo».
 */
export const PJ_COMBO_OFFER_EVENT = 'pj:hazlo-combo-offer';

export interface PjComboOfferDetail {
    /** Línea de la pizza recién agregada (`itemId` del carrito). */
    itemId: string;
    /** «Pollo BBQ». */
    productName: string;
}

/** `true` si alguien (el panel «Tu pedido») muestra la oferta. */
export function requestComboOffer(detail: PjComboOfferDetail): boolean {
    if (typeof window === 'undefined') return false;
    const event = new CustomEvent<PjComboOfferDetail>(PJ_COMBO_OFFER_EVENT, { detail, cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
}
