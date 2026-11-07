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
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import { type ReactElement, type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { usePjCart } from '@/extensions/pj-product/hooks/use-pj-cart';
import { cn } from '@/lib/utils';
import type { ComboGroupSummary } from '../lib/combo-group';

export interface ComboGroupBlockProps {
    group: ComboGroupSummary;
    /** Las pizzas del grupo (`CartLine` con `grouped`) y lo que va pegado a ellas. */
    children: ReactNode;
    /** Se quitó el combo entero: la página muestra «Quitaste Super Dúo · Deshacer». */
    onRemoved: (group: ComboGroupSummary) => void;
}

/**
 * Super Dúo / Super Trío armado (S-D20, §7.1): las pizzas del mismo `c_pjComboGroup` juntas bajo
 * «SUPER DÚO · $22.590», cada una con su detalle y su «Editar». «Quitar Super Dúo» quita todas las pizzas del grupo
 * (quitar una sola dejaría la otra a precio normal). Si el grupo quedó incompleto, lo avisa.
 */
export function ComboGroupBlock({ group, children, onRemoved }: ComboGroupBlockProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { submit, busy } = usePjCart();
    const [leaving, setLeaving] = useState(false);
    const [failed, setFailed] = useState(false);

    const remove = async () => {
        setLeaving(true);
        setFailed(false);
        const result = await submit({ intent: 'combo-remove', group: group.group });
        if (result.success) onRemoved(group);
        else {
            setLeaving(false);
            setFailed(true);
        }
    };

    return (
        <li
            className={cn(
                'grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none',
                leaving ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'
            )}
            data-testid="pj-combo-group"
            data-group={group.group}>
            <div className="min-h-0 overflow-hidden pt-4">
                <div className="flex items-baseline justify-between gap-3">
                    <h3 className="pj-card-title m-0 text-pj-heading uppercase" data-testid="pj-combo-group-title">
                        {group.name}
                    </h3>
                    <span
                        className="shrink-0 text-base font-bold text-pj-ink tabular-nums"
                        data-testid="pj-combo-group-total">
                        {formatClp(group.total)}
                    </span>
                </div>
                {group.extras > 0 && (
                    <p className="m-0 text-sm text-pj-gray-strong" data-testid="pj-combo-group-extras">
                        {t('group.extras', { price: formatClp(group.price), extras: formatClp(group.extras) })}
                    </p>
                )}
                {group.savings > 0 && group.missing === 0 && (
                    <p className="pj-micro m-0 text-pj-price">
                        {t('line.savings', { amount: formatClp(group.savings) })}
                    </p>
                )}
                {group.missing > 0 && (
                    <p
                        role="status"
                        className="m-0 mt-1 text-sm font-semibold text-pj-price"
                        data-testid="pj-combo-group-broken">
                        {t('group.broken', { count: group.missing, name: group.name })}
                    </p>
                )}
                <ul
                    aria-label={t('group.listAria', { name: group.name })}
                    className="m-0 ml-1 list-none divide-y divide-pj-line border-l-2 border-pj-line pl-3">
                    {children}
                </ul>
                <div className="flex justify-end pb-2">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => void remove()}
                        aria-label={t('group.removeAria', { name: group.name })}
                        data-testid="pj-combo-group-remove"
                        className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                        {t('group.remove', { name: group.name })}
                    </button>
                </div>
                {failed && (
                    <p role="alert" className="m-0 pb-3 text-sm font-semibold text-pj-price">
                        {t('line.error')}
                    </p>
                )}
            </div>
        </li>
    );
}

export default ComboGroupBlock;
