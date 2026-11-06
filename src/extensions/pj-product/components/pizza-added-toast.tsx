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
import { type ReactElement, useCallback } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@/hooks/use-navigate';
import { formatCount } from '@/extensions/pj-shared/lib/format';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';

export interface PizzaAddedToastProps {
    title: string;
    points?: string;
    undoLabel?: string;
    onUndo?: () => void;
    viewLabel: string;
    onView: () => void;
    onDismiss?: () => void;
}

/**
 * Aviso «¡Agregada! +N Papa Puntos por acreditar · Deshacer · Ver mi pedido», con la forma de `AddedToast`
 * de pj-shared. Existe porque el Toaster global se monta fuera de `SiteProvider` y `AddedToast` usa
 * `Link` (la página caía en «Algo salió mal», aviso de INT): aquí «Ver mi pedido» navega con un callback.
 */
export function PizzaAddedToast({
    title,
    points,
    undoLabel,
    onUndo,
    viewLabel,
    onView,
    onDismiss,
}: PizzaAddedToastProps): ReactElement {
    return (
        <div
            role="status"
            data-testid="pj-added-toast"
            className="flex w-full max-w-[420px] items-center gap-3 rounded-pj-card bg-pj-green-dark px-4 py-3 text-pj-surface shadow-pj-strip">
            <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">{title}</p>
                {points && <p className="truncate text-sm font-semibold text-pj-lime">{points}</p>}
            </div>
            {onUndo && undoLabel && (
                <button
                    type="button"
                    onClick={() => {
                        onUndo();
                        onDismiss?.();
                    }}
                    className="min-h-[44px] shrink-0 px-2 text-sm font-bold text-pj-surface underline underline-offset-4">
                    {undoLabel}
                </button>
            )}
            <button
                type="button"
                onClick={() => {
                    onView();
                    onDismiss?.();
                }}
                className="flex min-h-[44px] shrink-0 items-center rounded-full bg-pj-lime px-4 text-sm font-bold text-pj-green-dark">
                {viewLabel}
            </button>
        </div>
    );
}

/**
 * Devuelve `show({ productName, points, onUndo })`. Resuelve textos y navegación dentro del árbol de la
 * página (con `SiteProvider`), así el toast no necesita contexto propio.
 */
// oxlint-disable-next-line react-refresh/only-export-components
export function useShowAddedToast(): (props: { productName?: string; points?: number; onUndo?: () => void }) => void {
    const { t } = useTranslation('extPjShared');
    const navigate = useNavigate();
    return useCallback(
        ({ productName, points = 0, onUndo }) => {
            const title = `${t('toast.added')}${productName ? ` ${productName}` : ''}`;
            const pointsText = points > 0 ? t('toast.addedPoints', { points: formatCount(points) }) : undefined;
            toast.custom(
                (id) => (
                    <PizzaAddedToast
                        title={title}
                        points={pointsText}
                        undoLabel={t('toast.undo')}
                        onUndo={onUndo}
                        viewLabel={t('toast.viewOrder')}
                        onView={() => void navigate(PJ_ROUTES.cart)}
                        onDismiss={() => toast.dismiss(id)}
                    />
                ),
                { duration: 6000 }
            );
        },
        [t, navigate]
    );
}
