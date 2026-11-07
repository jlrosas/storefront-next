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
import { type ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { useReducedMotion } from '@/extensions/pj-shared/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';
import type { CartTotals } from '../lib/cart-model';
import { useCountUp } from '../hooks/use-count-up';

export interface SummaryBlockProps {
    totals: CartTotals;
    delivery: boolean;
    className?: string;
}

/** «Ahorro en combos» entra con un destello lima de 600 ms (UX-3 §3.10.3). */
function useFlash(active: boolean): boolean {
    const reduced = useReducedMotion();
    const was = useRef(active);
    const [flash, setFlash] = useState(false);
    useEffect(() => {
        if (active && !was.current && !reduced) {
            setFlash(true);
            const timer = setTimeout(() => setFlash(false), 600);
            was.current = active;
            return () => clearTimeout(timer);
        }
        was.current = active;
        return undefined;
    }, [active, reduced]);
    return flash;
}

/**
 * Resumen (UX-3 §3.7): productos antes del ahorro, «Ahorro en combos» y «Canje Papa Puntos» en Rich Sauce, la
 * modalidad y el total en Condensed de 28 px que «cuenta» al cambiar.
 */
export function SummaryBlock({ totals, delivery, className }: SummaryBlockProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const total = useCountUp(totals.total);
    const flash = useFlash(totals.comboSavings > 0);
    return (
        <dl className={cn('m-0 flex flex-col gap-1.5 text-[15px]', className)} data-testid="pj-cart-summary">
            <div className="flex justify-between gap-3">
                <dt className="text-pj-gray-strong">{t('summary.subtotal')}</dt>
                <dd className="m-0 font-semibold tabular-nums">{formatClp(totals.products)}</dd>
            </div>
            {totals.comboSavings > 0 && (
                <div
                    className={cn(
                        '-mx-2 flex justify-between gap-3 rounded-md px-2 transition-colors duration-500',
                        flash ? 'bg-pj-pepperoncini' : 'bg-transparent'
                    )}
                    data-testid="pj-cart-combo-savings">
                    <dt className="text-pj-price">{t('summary.comboSavings')}</dt>
                    <dd className="m-0 font-bold text-pj-price tabular-nums">−{formatClp(totals.comboSavings)}</dd>
                </div>
            )}
            {totals.canje > 0 && (
                <div className="flex justify-between gap-3" data-testid="pj-cart-canje">
                    <dt className="text-pj-price">{t('summary.canje')}</dt>
                    <dd className="m-0 font-bold text-pj-price tabular-nums">−{formatClp(totals.canje)}</dd>
                </div>
            )}
            <div className="flex justify-between gap-3">
                <dt className="text-pj-gray-strong">{delivery ? t('summary.deliveryFee') : t('summary.pickupFee')}</dt>
                <dd className="m-0 font-semibold tabular-nums">
                    {delivery ? formatClp(totals.shipping) : t('summary.free')}
                </dd>
            </div>
            <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-pj-line pt-2">
                <dt className="text-xl font-bold">{t('summary.total')}</dt>
                <dd
                    className="m-0 font-heading text-[28px] leading-none text-pj-ink tabular-nums"
                    data-testid="pj-cart-total">
                    {formatClp(total)}
                </dd>
            </div>
        </dl>
    );
}

export default SummaryBlock;
