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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { PJ_ROUTES } from '../lib/routes';
import { formatCount } from '../lib/format';

export interface AddedToastProps {
    /** Nombre de lo agregado («Pollo BBQ Familiar»). Opcional: el título ya dice «¡Agregada!». */
    productName?: string;
    /** Papa Puntos por acreditar que suma lo agregado (`pointsFor`). 0 oculta la línea. */
    points?: number;
    /** «Deshacer»: quita lo recién agregado. Sin función, no se muestra. */
    onUndo?: () => void;
    /** Destino de «Ver mi pedido» (por defecto /cart). */
    orderHref?: string;
    /** Se llama al tocar cualquiera de las acciones (para cerrar el aviso). */
    onDismiss?: () => void;
    className?: string;
}

/**
 * Aviso de «agregado» del lienzo (Simple-Add.dc.html): «¡Agregada! +N Papa Puntos por
 * acreditar», «Deshacer» y «Ver mi pedido». Es un `role="status"` para que se anuncie.
 * Para mostrarlo como toast se usa `showAddedToast` (lib/added-toast.tsx).
 */
export function AddedToast({
    productName,
    points = 0,
    onUndo,
    orderHref = PJ_ROUTES.cart,
    onDismiss,
    className,
}: AddedToastProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    return (
        <div
            role="status"
            data-testid="pj-added-toast"
            className={cn(
                'flex w-[min(100vw-16px,420px)] items-center gap-3 rounded-pj-card bg-pj-green-dark px-4 py-3 text-pj-surface shadow-pj-strip',
                className
            )}>
            <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold">
                    {t('toast.added')}
                    {productName ? ` ${productName}` : ''}
                </p>
                {points > 0 && (
                    <p className="text-sm font-semibold text-pj-lime">
                        {t('toast.addedPoints', { points: formatCount(points) })}
                    </p>
                )}
            </div>
            {onUndo && (
                <button
                    type="button"
                    onClick={() => {
                        onUndo();
                        onDismiss?.();
                    }}
                    className="min-h-11 shrink-0 px-2 text-sm font-bold text-pj-surface underline underline-offset-4">
                    {t('toast.undo')}
                </button>
            )}
            <Link
                to={orderHref}
                onClick={onDismiss}
                className="flex min-h-11 shrink-0 items-center rounded-full bg-pj-lime px-4 text-sm font-bold text-pj-green-dark no-underline">
                {t('toast.viewOrder')}
            </Link>
        </div>
    );
}

export default AddedToast;
