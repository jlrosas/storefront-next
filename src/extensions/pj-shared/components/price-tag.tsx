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
    /**
     * Tamaño. En `default`: `sm` tarjetas compactas · `md` tarjetas · `lg` grande. En `display`:
     * `sm` 28/32 px (constructor) · `md` 36/48 px (destacada, ficha) · `lg` 44/72 px (hero), móvil/escritorio.
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * `display` (UX-1 §3.4, playbook p. 118): precio protagonista en Papa Sans Condensed con el `$` en
     * superíndice, Rich Sauce sobre crema o lima sobre verde/granate (ver `surface`). Por defecto `default`.
     */
    variant?: 'default' | 'display';
    /**
     * Fondo sobre el que va el precio `display`, para usar el par ADA correcto:
     * `auto` (por defecto) toma el color de la superficie que lo contiene (`surface-*`, `bg-pj-basil`…:
     * variables --pj-price-color y --pj-price-muted) · `dough` crema o blanco → Rich Sauce ·
     * `basil` o `sauce` verde o granate → lima, y Dough para el tachado.
     */
    surface?: 'auto' | 'dough' | 'basil' | 'sauce';
    /** Texto visible del precio antes, si no basta el monto («Antes desde $21.900»). Se lee tal cual. */
    listPriceLabel?: string;
    /** Prefijo opcional antes del precio: «desde». */
    prefix?: string;
    className?: string;
}

const SIZE = {
    sm: { now: 'text-base', before: 'text-[13px]', save: 'text-xs' },
    md: { now: 'text-lg', before: 'text-sm', save: 'text-[13px]' },
    lg: { now: 'font-heading text-[44px] leading-none font-extrabold', before: 'text-lg', save: 'text-sm' },
} as const;

const DISPLAY_SIZE = {
    sm: { now: 'text-[28px] lg:text-[32px]', before: 'text-base', save: 'text-[13px]' },
    md: { now: 'text-[36px] lg:text-5xl', before: 'text-lg', save: 'text-sm' },
    lg: { now: 'text-[44px] lg:text-[72px]', before: 'text-lg lg:text-2xl', save: 'text-sm lg:text-base' },
} as const;

const DISPLAY_SURFACE = {
    auto: { now: 'text-pj-price', before: 'text-pj-price-muted', save: 'text-pj-price' },
    dough: { now: 'text-pj-sauce', before: 'text-pj-gray', save: 'text-pj-sauce' },
    basil: { now: 'text-pj-pepperoncini', before: 'text-pj-dough/85', save: 'text-pj-pepperoncini' },
    sauce: { now: 'text-pj-pepperoncini', before: 'text-pj-dough/85', save: 'text-pj-pepperoncini' },
} as const;

/**
 * Precio del lienzo (CONTRATO §5): precio ahora, antes tachado y ahorro en pesos, formato
 * CLP `$22.590`. Con precio antes, el precio ahora va en Rich Sauce (Tangy Tomato no lleva texto, S-D18).
 * `variant="display"` es el precio protagonista de la marca: hero, oferta destacada, constructor y ficha.
 */
export function PriceTag({
    price,
    listPrice,
    showSavings = true,
    size = 'md',
    prefix,
    listPriceLabel,
    variant = 'default',
    surface = 'auto',
    className,
}: PriceTagProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    const onSale = typeof listPrice === 'number' && listPrice > price;
    const styles = SIZE[size];
    const now = formatClp(price);
    const before = onSale ? (listPriceLabel ?? formatClp(listPrice)) : null;
    const savings = onSale ? formatClp(listPrice - price) : null;
    const spokenBefore = before && (listPriceLabel ?? t('price.before', { price: before }));
    const spoken = [prefix, t('price.now', { price: now }), spokenBefore].filter(Boolean).join(', ');
    if (variant === 'display') {
        const sizes = DISPLAY_SIZE[size];
        const colors = DISPLAY_SURFACE[surface];
        return (
            <span
                className={cn('inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5', className)}
                data-testid="pj-price-tag"
                data-variant="display"
                data-surface={surface}>
                <span className="sr-only">
                    {spoken}
                    {onSale && showSavings && savings ? `. ${t('price.save', { amount: savings })}` : ''}
                </span>
                {prefix && (
                    <span aria-hidden="true" className={cn('text-sm font-bold', colors.before)}>
                        {prefix}
                    </span>
                )}
                {/* El `$` va en superíndice con ::first-letter (playbook p. 118): el texto sigue siendo «$10.990». */}
                <strong
                    aria-hidden="true"
                    data-testid="pj-price-display"
                    className={cn(
                        'font-heading leading-[0.85] font-medium tracking-normal whitespace-nowrap uppercase first-letter:mr-[0.06em] first-letter:align-[0.78em] first-letter:text-[0.5em]',
                        sizes.now,
                        colors.now
                    )}>
                    {now}
                </strong>
                {before && (
                    <span aria-hidden="true" className={cn('line-through', sizes.before, colors.before)}>
                        {before}
                    </span>
                )}
                {onSale && showSavings && savings && (
                    <span aria-hidden="true" className={cn('basis-full font-bold', sizes.save, colors.save)}>
                        {t('price.save', { amount: savings })}
                    </span>
                )}
            </span>
        );
    }
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
