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

/**
 * Funciones del template que el diseño de Papa Johns no tiene (INT-02 · criterio 4).
 * Se apagan aquí y los componentes del core las consultan con marcadores `@sfdc-extension-*`.
 */
export const PJ_FEATURES: Readonly<{ wishlist: boolean }> = {
    /** Lista de deseos: corazón en tarjetas, ficha, carrito, menú de cuenta y encabezado. */
    wishlist: false,
};
