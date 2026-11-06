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

/**
 * Datos de ejemplo que todavía no salen de Commerce (solicitud a TIE/DAT).
 *
 * Caso 2: la tienda más cercana a la dirección de delivery. El lienzo (`Combo-NoDisponible`) dice
 * «Retirar en El Bosque · 0,8 km · listo en 15 min» para «Av. Providencia 1234». Mientras TIE no
 * entregue la tienda más cercana por dirección, se usa El Bosque (`pj-48`, contrato §7).
 */
export const NEAREST_PICKUP_STORE = {
    id: 'pj-48',
    name: 'El Bosque',
    address: 'Tobalaba 201',
    distanceKm: 0.8,
    pickupMinutes: 15,
} as const;

/** Dirección de delivery que muestra el aviso si la cookie no trae una. */
export const FALLBACK_DELIVERY_ADDRESS = 'Av. Providencia 1234';
