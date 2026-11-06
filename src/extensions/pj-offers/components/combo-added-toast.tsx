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
import type { ReactElement } from 'react';

export interface ComboAddedToastProps {
    title: string;
    points?: string;
    viewLabel: string;
    onView: () => void;
}

/**
 * Aviso «¡Agregado!» con la misma forma que `AddedToast` de pj-shared. Existe porque el Toaster
 * global se monta fuera de `SiteProvider` y `AddedToast` usa `Link` (que lo exige): al agregar,
 * la página caía en el error de «Algo salió mal». Aquí el destino se resuelve con un callback
 * (`useNavigate` del template) en vez de un `Link`. Ver informe: candidato a corregir en pj-shared.
 */
export function ComboAddedToast({ title, points, viewLabel, onView }: ComboAddedToastProps): ReactElement {
    return (
        <div
            role="status"
            data-testid="pj-combo-added-toast"
            className="flex w-full max-w-[420px] items-center gap-3 rounded-pj-card bg-pj-green-dark px-4 py-3 text-pj-surface shadow-pj-strip">
            <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{title}</p>
                {points && <p className="text-sm font-semibold text-pj-lime">{points}</p>}
            </div>
            <button
                type="button"
                onClick={onView}
                className="flex min-h-[44px] shrink-0 items-center rounded-full bg-pj-lime px-4 text-sm font-bold text-pj-green-dark">
                {viewLabel}
            </button>
        </div>
    );
}
