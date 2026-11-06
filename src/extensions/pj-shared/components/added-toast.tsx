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
import { cn } from '@/lib/utils';
import { formatCount } from '../lib/format';

export interface AddedToastProps {
    /** Nombre de lo agregado («Pollo BBQ Familiar»). Opcional: el título ya dice «¡Agregada!». */
    productName?: string;
    /** Papa Puntos por acreditar que suma lo agregado (`pointsFor`). 0 oculta la línea. */
    points?: number;
    /** «Deshacer»: quita lo recién agregado. Sin función, no se muestra. */
    onUndo?: () => void;
    /**
     * «Ver mi pedido». Es un callback (no un `Link`) porque el Toaster global vive fuera de los
     * providers del sitio: `useShowAddedToast()` lo arma con `useNavigate` de quien llama.
     */
    onViewOrder: () => void;
    /** Se llama al tocar cualquiera de las acciones (para cerrar el aviso). */
    onDismiss?: () => void;
    className?: string;
}

/**
 * Aviso de «agregado» del lienzo (Simple-Add.dc.html): «¡Agregada! +N Papa Puntos por
 * acreditar», «Deshacer» y «Ver mi pedido». Es un `role="status"` para que se anuncie.
 * Para mostrarlo como toast se usa `useShowAddedToast()` (lib/added-toast.tsx). No usa `Link` ni
 * hooks de sitio: se puede pintar fuera de `SiteProvider`.
 */
export function AddedToast({
    productName,
    points = 0,
    onUndo,
    onViewOrder,
    onDismiss,
    className,
}: AddedToastProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    return (
        <div
            role="status"
            data-testid="pj-added-toast"
            className={cn(
                'flex w-full max-w-[420px] flex-wrap items-center gap-x-2 gap-y-1 rounded-pj-card bg-pj-basil px-4 py-3 text-pj-dough shadow-pj-strip',
                className
            )}>
            <div className="min-w-0 flex-1 basis-[11.5rem]">
                <p className="truncate text-[15px] font-bold">
                    {t('toast.added')}
                    {productName ? ` ${productName}` : ''}
                </p>
                {points > 0 && (
                    <p className="text-sm font-semibold text-pj-pepperoncini">
                        {t('toast.addedPoints', { points: formatCount(points) })}
                    </p>
                )}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
                {onUndo && (
                    <button
                        type="button"
                        onClick={() => {
                            onUndo();
                            onDismiss?.();
                        }}
                        className="min-h-11 shrink-0 px-2 text-sm font-bold text-pj-dough underline underline-offset-4">
                        {t('toast.undo')}
                    </button>
                )}
                <button
                    type="button"
                    onClick={() => {
                        onViewOrder();
                        onDismiss?.();
                    }}
                    className="flex min-h-11 shrink-0 items-center rounded-full bg-pj-pepperoncini px-3.5 text-sm font-bold text-pj-basil">
                    {t('toast.viewOrder')}
                </button>
            </div>
        </div>
    );
}

export default AddedToast;
