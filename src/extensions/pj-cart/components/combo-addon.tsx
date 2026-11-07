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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { usePjCart } from '@/extensions/pj-product/hooks/use-pj-cart';
import { cn } from '@/lib/utils';
import type { ComboGroup } from '../lib/line-summary';

export interface ComboAddonProps {
    combo: ComboGroup;
    /** En el panel «Tu pedido» va sin «Quitar combo». */
    removable?: boolean;
    className?: string;
}

/**
 * «Combo: Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L · +$6.990» bajo la pizza (AUD-compra): las dos líneas
 * sueltas de «Hazlo combo» se leen como una sola cosa, con el precio que cobra la canasta.
 */
export function ComboAddon({ combo, removable = true, className }: ComboAddonProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { submit, busy } = usePjCart();
    const parts = combo.parts.join(' + ');
    return (
        <div
            className={cn(
                'flex flex-col rounded-pj-card bg-pj-cream px-3 py-2 text-sm',
                busy && 'opacity-50',
                className
            )}
            data-testid="pj-combo-addon">
            <p className="m-0 font-bold text-pj-basil">{t('line.combo', { parts })}</p>
            <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-pj-ink">
                    {t('line.comboPrice', { price: formatClp(combo.total) })}
                </span>
                {removable && (
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => void submit({ intent: 'remove', itemIds: combo.itemIds })}
                        aria-label={t('line.comboRemoveAria', { parts })}
                        className="-mr-1 inline-flex min-h-11 shrink-0 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                        {t('line.comboRemove')}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ComboAddon;
