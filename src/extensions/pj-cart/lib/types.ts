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
import type { FulfillmentMode } from '@/extensions/pj-shared/lib/fulfillment';
import type { LineProducts } from './line-summary';

/** Modalidad y tienda para la primera tarjeta del carrito (UX-2 §4 regla 2). */
export interface CartFulfillment {
    mode: FulfillmentMode;
    storeId: string;
    /** «El Bosque» (sin «Papa Johns»). */
    storeName: string | null;
    address: string | null;
    when: string;
    pickupMinutes: number | null;
    deliveryMinutes: number | null;
    /** `c_pjOpenUntil` de la tienda («23:30»). */
    openUntil: string | null;
}

/** Lo que el loader de `/cart` agrega para CAR. */
export interface PjCartData {
    lineProducts: LineProducts;
    fulfillment: CartFulfillment | null;
}
