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

import type { MouseEvent } from 'react';
import { useNavigate } from '@/hooks/use-navigate';
import { configureFallbackHref, requestConfigure, type PjConfigureDetail } from '../lib/menu-bridge';

/**
 * Abre la configuración del producto: PRO la atiende (hoja o armador) y, mientras no esté montada,
 * navega a la ficha. Devuelve el manejador de `onClick` de un enlace.
 */
export function useConfigure(): (detail: PjConfigureDetail) => (event: MouseEvent<HTMLAnchorElement>) => void {
    const navigate = useNavigate();
    return (detail) => (event) => {
        // Tecla modificadora (abrir en pestaña nueva): deja que el navegador siga el enlace.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        if (!requestConfigure(detail)) {
            void navigate(configureFallbackHref(detail));
        }
    };
}
