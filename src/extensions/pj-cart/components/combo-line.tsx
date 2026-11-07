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
import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { usePjCart } from '@/extensions/pj-product/hooks/use-pj-cart';
import { cn } from '@/lib/utils';
import type { ComboGroup } from '../lib/line-summary';
import { LinePhoto } from './cart-line';

export interface ComboLineProps {
    combo: ComboGroup;
    image: string | null;
    /** En el panel «Tu pedido» va sin «Quitar». */
    compact?: boolean;
    onRemoved?: (combo: ComboGroup) => void;
}

/**
 * «Combo Palitos y bebida» (UX-3 §3.4): línea propia pegada a su pizza, con sangría y una guía vertical, foto
 * del combo, lo que incluye, el precio con la promoción y «Ahorras $X». Sin precios tachados por componente.
 */
export function ComboLine({ combo, image, compact = false, onRemoved }: ComboLineProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { submit, busy } = usePjCart();
    const [leaving, setLeaving] = useState(false);
    const name = t('line.comboName');
    const remove = async () => {
        setLeaving(true);
        const result = await submit({ intent: 'remove', itemIds: combo.itemIds });
        if (result.success) onRemoved?.(combo);
        else setLeaving(false);
    };
    return (
        <li
            className={cn(
                'grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none',
                leaving ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
                'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200'
            )}
            data-testid="pj-combo-line">
            <div
                className={cn(
                    'flex min-h-0 gap-3 overflow-hidden border-l-2 border-pj-line',
                    compact ? 'ml-2 py-1 pl-3' : 'mb-3 ml-4 pl-3'
                )}>
                {!compact && <LinePhoto src={image} alt={name} crop="combo" small />}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <div className="flex items-start justify-between gap-3">
                        <p
                            className={cn(
                                'm-0 min-w-0 text-pj-heading',
                                compact ? 'text-[15px] font-bold' : 'pj-card-title text-lg lg:text-xl'
                            )}>
                            {name}
                        </p>
                        <span className="shrink-0 text-base font-bold text-pj-ink tabular-nums">
                            {formatClp(combo.total)}
                        </span>
                    </div>
                    <p className={cn('m-0 text-pj-gray-strong', compact ? 'text-[13px]' : 'text-sm')}>
                        {combo.parts.join(' + ')}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                        {combo.savings > 0 ? (
                            <p className="pj-micro m-0 text-pj-price">
                                {t('line.savings', { amount: formatClp(combo.savings) })}
                            </p>
                        ) : (
                            <span />
                        )}
                        {!compact && (
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void remove()}
                                aria-label={t('line.removeAria', { name })}
                                className="-mr-1 inline-flex min-h-11 shrink-0 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                                {t('line.remove')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
}

export default ComboLine;
