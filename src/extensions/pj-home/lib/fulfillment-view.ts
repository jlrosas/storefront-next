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
import type { Fulfillment } from '@/extensions/pj-shared/lib/fulfillment';

/** Lo que la Home necesita del meta de TIE (`FulfillmentMeta` de `pj-store`). */
export interface HomeFulfillmentMeta {
    storeId: string;
    storeName: string;
    timeText: string;
    scheduled?: boolean;
    addressText?: string;
}

/** Valores de la lámina (CONTRATO §4.3): El Bosque, retiro en 15 min, delivery en 35–45 min. */
export const HOME_FULFILLMENT_DEFAULTS = {
    storeName: 'El Bosque',
    pickupTime: '15 min',
    deliveryTime: '35–45 min',
} as const;

/** Modalidad tal como la repiten los textos de la Home (#10). */
export interface HomeFulfillmentView {
    mode: 'pickup' | 'delivery';
    storeName: string;
    /** «15 min», «35–45 min» o la hora programada («mañana 12:00»). */
    time: string;
    scheduled: boolean;
    address: string | null;
    /** `true` si viene de lo elegido (cookie + meta); `false` si son los valores de la lámina. */
    chosen: boolean;
}

/**
 * Una sola fuente para los textos de la Home que repiten la modalidad (INTEGRACION #10): la del
 * chip (`useFulfillment()` de TIE). Sin modalidad o sin el meta de esa tienda (en el servidor, antes
 * de hidratar) devuelve los valores de la lámina, que son los del perfil de Sofía: no hay salto.
 */
export function homeFulfillmentView(
    fulfillment: Fulfillment | null,
    meta: HomeFulfillmentMeta | null,
    fallbackStore: string = HOME_FULFILLMENT_DEFAULTS.storeName
): HomeFulfillmentView {
    const known = fulfillment && meta && meta.storeId === fulfillment.storeId ? meta : null;
    if (!fulfillment || !known) {
        return {
            mode: fulfillment?.mode ?? 'pickup',
            storeName: fallbackStore,
            time:
                fulfillment?.mode === 'delivery'
                    ? HOME_FULFILLMENT_DEFAULTS.deliveryTime
                    : HOME_FULFILLMENT_DEFAULTS.pickupTime,
            scheduled: false,
            address: fulfillment?.address ?? null,
            chosen: false,
        };
    }
    return {
        mode: fulfillment.mode,
        storeName: known.storeName,
        time: known.timeText,
        scheduled: known.scheduled === true,
        address: known.addressText ?? fulfillment.address ?? null,
        chosen: true,
    };
}
