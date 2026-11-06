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

/** Pesos de compra (sin despacho) por cada Papa Punto (R1.1). */
export const PESOS_PER_POINT = 1000;

/** Valor de canje de un Papa Punto en pesos (S-D12: 103 puntos = $5.150). */
export const POINT_VALUE_CLP = 50;

/**
 * Papa Puntos que gana un pedido (CONTRATO §5, R1.1 y R1.2).
 *
 * `floor((total − despacho) / 1000)`, el doble si el cliente tiene `c_pjDoublePoints`.
 * El despacho nunca suma puntos. Valores negativos o no numéricos dan 0.
 *
 * @example pointsFor(23890, 0) // 23
 * @example pointsFor(23890, 0, true) // 46
 * @example pointsFor(25880, 1990) // 23
 */
export function pointsFor(total: number, shipping = 0, doublePoints = false): number {
    const base = Number.isFinite(total) ? total : 0;
    const delivery = Number.isFinite(shipping) ? Math.max(0, shipping) : 0;
    const points = Math.floor(Math.max(0, base - delivery) / PESOS_PER_POINT);
    return doublePoints ? points * 2 : points;
}

/** Pesos que valen `points` Papa Puntos al canjear (S-D12). */
export function pointsToClp(points: number): number {
    return Math.max(0, Math.floor(points)) * POINT_VALUE_CLP;
}
