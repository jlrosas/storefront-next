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
import { formatClp } from '../lib/format';

export interface PriceTagProps {
    /** Precio actual en pesos. */
    price: number;
    /** Precio «antes» (se tacha). Solo se muestra si es mayor que `price`. */
    listPrice?: number | null;
    /** Muestra «Ahorras $X» cuando hay precio antes. Por defecto `true`. */
    showSavings?: boolean;
    /** `sm` tarjetas compactas · `md` tarjetas · `lg` hero y ficha (Barlow Condensed). */
    size?: 'sm' | 'md' | 'lg';
    /** Prefijo opcional antes del precio: «desde». */
    prefix?: string;
    className?: string;
}

const SIZE = {
    sm: { now: 'text-base', before: 'text-[13px]', save: 'text-xs' },
    md: { now: 'text-lg', before: 'text-sm', save: 'text-[13px]' },
    lg: { now: 'font-heading text-[44px] leading-none font-extrabold', before: 'text-lg', save: 'text-sm' },
} as const;

/**
 * Precio del lienzo (CONTRATO §5): precio ahora, antes tachado y ahorro en pesos, formato
 * CLP `$22.590`. Con precio antes, el precio ahora va en rojo tomate (#B3261E).
 */
export function PriceTag({
    price,
    listPrice,
    showSavings = true,
    size = 'md',
    prefix,
    className,
}: PriceTagProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    const onSale = typeof listPrice === 'number' && listPrice > price;
    const styles = SIZE[size];
    const now = formatClp(price);
    const before = onSale ? formatClp(listPrice) : null;
    const savings = onSale ? formatClp(listPrice - price) : null;
    const spoken = [prefix, t('price.now', { price: now }), before && t('price.before', { price: before })]
        .filter(Boolean)
        .join(', ');
    return (
        <span
            className={cn('inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}
            data-testid="pj-price-tag">
            <span className="sr-only">
                {spoken}
                {onSale && showSavings && savings ? `. ${t('price.save', { amount: savings })}` : ''}
            </span>
            {prefix && (
                <span aria-hidden="true" className="text-sm text-pj-gray">
                    {prefix}
                </span>
            )}
            <strong aria-hidden="true" className={cn('font-bold', styles.now, onSale ? 'text-pj-sale' : 'text-pj-ink')}>
                {now}
            </strong>
            {before && (
                <span aria-hidden="true" className={cn('text-pj-gray line-through', styles.before)}>
                    {before}
                </span>
            )}
            {onSale && showSavings && savings && (
                <span aria-hidden="true" className={cn('font-bold text-pj-sale', styles.save)}>
                    {t('price.save', { amount: savings })}
                </span>
            )}
        </span>
    );
}

export default PriceTag;
