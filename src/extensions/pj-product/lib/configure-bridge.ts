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
 * Contrato con MEN fijado por INT (`pj-menu/lib/menu-bridge.ts`): el menú dispara `pj:configure-product`
 * (cancelable) con `PjConfigureDetail`. PRO lo escucha en un provider global, llama a `preventDefault()`
 * y abre la hoja «Arma tu pizza» o el armador de mitades. Sin nadie que lo atienda, MEN navega a
 * `/p/<id>?size=…` o `/p/pz-mitades?mitad1=<id>`, que la ficha y `/mitades` también entienden.
 */
export const PJ_CONFIGURE_EVENT = 'pj:configure-product';

export interface PjConfigureDetail {
    productId: string;
    halfFirst?: boolean;
    builder?: 'mitades' | 'arma-tu-pizza';
    size?: string;
}

export const ARMA_TU_PIZZA_ID = 'pz-arma-tu-pizza';

/** Lo que abre la hoja para un detalle del evento. */
export function sheetRequestFor(detail: PjConfigureDetail): {
    productId: string;
    halfFirst: boolean;
    size?: string;
} | null {
    if (!detail || typeof detail.productId !== 'string' || detail.productId === '') return null;
    if (detail.builder === 'arma-tu-pizza') return { productId: ARMA_TU_PIZZA_ID, halfFirst: false, size: detail.size };
    if (detail.builder === 'mitades' || detail.halfFirst) {
        return { productId: detail.productId, halfFirst: true, size: detail.size };
    }
    return { productId: detail.productId, halfFirst: false, size: detail.size };
}
