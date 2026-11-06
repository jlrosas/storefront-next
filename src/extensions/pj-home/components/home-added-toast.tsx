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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCount } from '@/extensions/pj-shared/lib/format';

export interface HomeAddedToastProps {
    productName: string;
    points: number;
    /** Lleva a Mi pedido (con \`useNavigate\`, porque el aviso vive fuera del SiteProvider). */
    onView: () => void;
}

/**
 * «¡Agregada! +N Papa Puntos por acreditar» con «Ver mi pedido». Mismo aspecto que el `AddedToast`
 * de pj-shared, pero con un botón que navega con el callback: el Toaster global se monta fuera del `SiteProvider` y el
 * `Link` del template lanza «useSite must be used within a SiteProvider» (informe a INT).
 */
export function HomeAddedToast({ productName, points, onView }: HomeAddedToastProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    return (
        <div
            role="status"
            data-testid="pj-added-toast"
            className="flex w-full max-w-[420px] items-center gap-3 rounded-pj-card bg-pj-green-dark px-4 py-3 text-pj-surface shadow-pj-strip">
            <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">
                    {t('toast.added')} {productName}
                </p>
                {points > 0 && (
                    <p className="text-sm font-semibold text-pj-lime">
                        {t('toast.addedPoints', { points: formatCount(points) })}
                    </p>
                )}
            </div>
            <button
                type="button"
                onClick={onView}
                className="flex min-h-11 shrink-0 items-center rounded-full bg-pj-lime px-4 text-sm font-bold text-pj-green-dark">
                {t('toast.viewOrder')}
            </button>
        </div>
    );
}
