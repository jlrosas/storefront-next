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
import type { MouseEvent } from 'react';
import { requestConfigure, type ConfigureProductDetail } from '@/extensions/pj-shared/lib/events';

/**
 * «Agregar» de una pizza en la Home (04 regla 1, AUD-compra P0-3, P1-1 y P1-2): abre la hoja «Arma tu
 * pizza» de PRO sobre la Home (`pj:configure-product`), la única que pasa por el panel de tienda y
 * ofrece «Hazlo combo» después de la primera pizza. El control es un enlace real a la ficha
 * (`configureFallbackHref`): con tecla modificadora se abre en otra pestaña y, si PRO no atiende el
 * evento, el enlace sigue su curso y lleva a la ficha.
 */
export function configureOnClick(detail: ConfigureProductDetail): (event: MouseEvent<HTMLAnchorElement>) => void {
    return (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        if (requestConfigure(detail)) event.preventDefault();
    };
}
