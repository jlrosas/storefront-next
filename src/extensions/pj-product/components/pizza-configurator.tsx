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
import { type ReactElement, type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import {
    FEATURED_EXTRAS,
    crustSurcharge,
    crustsForSize,
    extraPriceForSize,
    lowerIngredientName,
    normalizeSelection,
    substituteFor,
    type PizzaConfig,
    type PizzaIngredient,
    type PizzaSelection,
} from '../lib/pizza';
import { CheckIcon, PlusIcon } from './icons';
import { useImageUrl } from '../hooks/use-image-url';

export interface PizzaConfiguratorProps {
    config: PizzaConfig;
    selection: PizzaSelection;
    onChange: (selection: PizzaSelection) => void;
    /** `sheet`: hoja «Arma tu pizza» (extras en filas). `pdp`: ficha (extras en chips; dos columnas de masa desde lg). */
    layout: 'sheet' | 'pdp';
    className?: string;
}

const SECTION_SHEET = 'flex flex-col gap-2.5 border-t-8 border-[var(--pj-section)] px-4 py-3';
const SECTION_PDP =
    'flex flex-col gap-2.5 border-t-8 border-[var(--pj-section)] px-4 py-3 lg:border-t-0 lg:px-0 lg:py-0';

function toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

/**
 * Configurador de la pizza (PRO-01 y PRO-03 criterio 3): tamaño y masa (variantes reales con el precio
 * del catálogo), ingredientes base que se quitan sin cambiar el precio y extras con precio por tamaño.
 * Un extra agotado en la tienda elegida queda bloqueado con la sugerencia de un sustituto (R4.6).
 */
export function PizzaConfigurator({
    config,
    selection,
    onChange,
    layout,
    className,
}: PizzaConfiguratorProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const [showAllExtras, setShowAllExtras] = useState(false);
    const update = (patch: Partial<PizzaSelection>) => onChange(normalizeSelection(config, { ...selection, ...patch }));
    const sheet = layout === 'sheet';
    const sectionClass = sheet ? SECTION_SHEET : SECTION_PDP;
    const crusts = crustsForSize(config, selection.size);
    const extraPrice = extraPriceForSize(config, selection.size);
    const storeName = config.store?.name ?? '';
    const featured = config.extras.filter((e) => FEATURED_EXTRAS.includes(e.id));
    const rest = config.extras.filter((e) => !FEATURED_EXTRAS.includes(e.id));
    const visibleExtras = showAllExtras || featured.length === 0 ? config.extras : featured;
    const outOfStock = config.extras.filter((e) => !e.available && visibleExtras.includes(e));

    const outNote = (extra: PizzaIngredient): string => {
        const substitute = substituteFor(config, extra.id);
        return substitute
            ? t('config.outOfStockTry', { store: storeName, substitute: lowerIngredientName(substitute.name) })
            : t('config.outOfStock', { store: storeName });
    };

    const heading = (text: ReactNode, aside?: ReactNode) => (
        <div className="flex items-baseline justify-between gap-3">
            {sheet ? (
                <h3 className="text-[17px] font-bold">{text}</h3>
            ) : (
                <h2 className="font-sans text-lg font-bold normal-case lg:font-heading lg:text-[26px] lg:leading-none lg:font-extrabold lg:uppercase">
                    {text}
                </h2>
            )}
            {aside}
        </div>
    );

    return (
        <div className={cn('flex flex-col', !sheet && 'lg:gap-5', className)} data-testid="pj-pizza-configurator">
            {/* Tamaño */}
            <section className={sectionClass} aria-labelledby={`${layout}-size`}>
                <div id={`${layout}-size`}>
                    {heading(
                        t('config.size'),
                        sheet ? <span className="text-xs font-semibold text-pj-green">{t('config.chosen')}</span> : null
                    )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {config.sizes.map((size) => {
                        const on = size.id === selection.size;
                        return (
                            <button
                                key={size.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => update({ size: size.id })}
                                data-testid={`pj-size-${size.id}`}
                                className={cn(
                                    'flex min-h-[44px] flex-col items-center gap-0.5 rounded-xl border-2 px-1 py-3 text-pj-ink',
                                    on ? 'border-pj-green bg-pj-lime-soft' : 'border-pj-line bg-pj-surface'
                                )}>
                                <span className="text-[15px] font-bold">{size.label}</span>
                                <span className="text-xs text-pj-gray">
                                    {t(`slices.${size.id}`, { defaultValue: '' })}
                                </span>
                                <span className="text-sm font-bold">{formatClp(size.price)}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Masa */}
            <section className={cn(sectionClass, 'gap-1')} aria-labelledby={`${layout}-crust`}>
                <div id={`${layout}-crust`} className="mb-1.5">
                    {heading(t('config.crust'))}
                </div>
                <div className={cn('flex flex-col', !sheet && 'lg:grid lg:grid-cols-2 lg:gap-2')}>
                    {crusts.map((crust) => {
                        const on = crust.id === selection.crust;
                        const add = crustSurcharge(config, selection.size, crust.id);
                        return (
                            <button
                                key={crust.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => update({ crust: crust.id })}
                                data-testid={`pj-crust-${crust.id}`}
                                className={cn(
                                    'flex min-h-[52px] items-center gap-3 border-b border-pj-track px-1 py-1.5 text-left text-pj-ink',
                                    !sheet && 'lg:rounded-xl lg:border-2 lg:px-3',
                                    !sheet && (on ? 'lg:border-pj-green lg:bg-pj-lime-soft' : 'lg:border-pj-line')
                                )}>
                                <span
                                    aria-hidden="true"
                                    className={cn(
                                        'flex size-[22px] shrink-0 items-center justify-center rounded-full border-2',
                                        on ? 'border-pj-green' : 'border-pj-gray/50',
                                        !sheet && 'lg:hidden'
                                    )}>
                                    <span
                                        className={cn('size-3 rounded-full', on ? 'bg-pj-green' : 'bg-transparent')}
                                    />
                                </span>
                                <span className="flex flex-1 flex-col">
                                    <span className="text-[15px] font-semibold">{crust.label}</span>
                                    <span className={cn('text-xs text-pj-gray', !sheet && 'lg:hidden')}>
                                        {t(`crustHint.${crust.id}`, { defaultValue: '' })}
                                    </span>
                                </span>
                                {add > 0 ? (
                                    <span className="text-sm font-bold">+{formatClp(add)}</span>
                                ) : (
                                    <span className="text-[13px] font-semibold text-pj-green">
                                        {t('config.included')}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Ingredientes base y extras */}
            {config.base.length > 0 && (
                <section className={sectionClass} aria-labelledby={`${layout}-base`}>
                    <div id={`${layout}-base`}>
                        {heading(
                            t('config.ingredients'),
                            <span className="text-xs text-pj-gray">
                                {sheet || config.extras.length === 0
                                    ? t('config.tapToRemove')
                                    : t('config.tapToRemoveAdd', { price: formatClp(extraPrice) })}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {config.base.map((ingredient) => {
                            const off = selection.removed.includes(ingredient.id);
                            return (
                                <button
                                    key={ingredient.id}
                                    type="button"
                                    aria-pressed={!off}
                                    aria-label={
                                        off
                                            ? t('config.restoreAria', { name: ingredient.name })
                                            : t('config.removeAria', { name: ingredient.name })
                                    }
                                    onClick={() => update({ removed: toggle(selection.removed, ingredient.id) })}
                                    data-testid={`pj-base-${ingredient.id}`}
                                    className={cn(
                                        'inline-flex min-h-[44px] items-center gap-2 rounded-full border-[1.5px] py-0 pr-3.5 pl-1.5 text-sm font-semibold',
                                        off
                                            ? 'border-dashed border-[var(--pj-removed-line)] bg-pj-surface text-[var(--pj-removed)] line-through'
                                            : 'border-[var(--pj-chip-line)] bg-[var(--pj-chip)] text-pj-ink'
                                    )}>
                                    <IngredientThumb ingredient={ingredient} size="sm" dimmed={off} />
                                    {off
                                        ? t('config.without', { name: lowerIngredientName(ingredient.name) })
                                        : ingredient.name}
                                </button>
                            );
                        })}
                        {!sheet &&
                            visibleExtras.map((extra) => {
                                const on = selection.extras.includes(extra.id);
                                const out = !extra.available;
                                return (
                                    <button
                                        key={extra.id}
                                        type="button"
                                        aria-pressed={on}
                                        aria-disabled={out || undefined}
                                        aria-label={
                                            out
                                                ? t('config.outAria', { name: extra.name, store: storeName })
                                                : on
                                                  ? t('config.extraRemoveAria', { name: extra.name })
                                                  : t('config.extraAddAria', {
                                                        name: extra.name,
                                                        price: formatClp(extraPrice),
                                                    })
                                        }
                                        onClick={() => !out && update({ extras: toggle(selection.extras, extra.id) })}
                                        data-testid={`pj-extra-${extra.id}`}
                                        className={cn(
                                            'inline-flex min-h-[44px] items-center gap-2 rounded-full border-[1.5px] py-0 pr-3.5 pl-1.5 text-sm font-semibold',
                                            out
                                                ? 'cursor-not-allowed border-dashed border-pj-gray/40 bg-[var(--pj-section)] text-pj-gray'
                                                : on
                                                  ? 'border-pj-green bg-pj-lime-soft text-pj-green-dark'
                                                  : 'border-pj-line bg-pj-surface text-pj-ink'
                                        )}>
                                        <IngredientThumb ingredient={extra} size="sm" dimmed={out} />
                                        {out
                                            ? t('config.outChip', { name: extra.name })
                                            : `${on ? '✓' : '+'} ${extra.name}`}
                                    </button>
                                );
                            })}
                    </div>
                    {!sheet &&
                        outOfStock.map((extra) => {
                            const substitute = substituteFor(config, extra.id);
                            return (
                                <p
                                    key={extra.id}
                                    className="rounded-xl bg-[var(--pj-chip)] px-3 py-2 text-[13px] text-pj-gray-strong"
                                    data-testid="pj-out-of-stock-note">
                                    {t('config.outNoteStart', { name: extra.name.toLowerCase(), store: storeName })}{' '}
                                    {substitute && (
                                        <>
                                            {t('config.outNoteTry')}{' '}
                                            <strong>{lowerIngredientName(substitute.name)}</strong>{' '}
                                            {t('config.outNoteEnd')}
                                        </>
                                    )}
                                </p>
                            );
                        })}
                    {!sheet && rest.length > 0 && featured.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowAllExtras((v) => !v)}
                            aria-expanded={showAllExtras}
                            className="min-h-[44px] self-start text-sm font-bold text-pj-green underline underline-offset-4">
                            {showAllExtras ? t('config.lessExtras') : t('config.moreExtras', { count: rest.length })}
                        </button>
                    )}
                </section>
            )}

            {/* Extras en filas (hoja) o, sin ingredientes base («Arma tu pizza»), también en la ficha */}
            {(sheet || config.base.length === 0) && config.extras.length > 0 && (
                <section className={cn(sectionClass, 'gap-1 pb-5')} aria-labelledby={`${layout}-extras`}>
                    <div id={`${layout}-extras`} className="mb-1.5">
                        {heading(
                            config.base.length === 0 ? t('config.ingredients') : t('config.addIngredients'),
                            <span className="text-xs text-pj-gray">
                                {t('config.optionalEach', { price: formatClp(extraPrice) })}
                            </span>
                        )}
                    </div>
                    <ul className="flex flex-col">
                        {visibleExtras.map((extra) => {
                            const on = selection.extras.includes(extra.id);
                            const out = !extra.available;
                            return (
                                <li
                                    key={extra.id}
                                    className="flex min-h-14 items-center gap-3 border-b border-pj-track"
                                    data-testid={`pj-extra-row-${extra.id}`}>
                                    <IngredientThumb ingredient={extra} size="md" dimmed={out} />
                                    <span className="flex flex-1 flex-col">
                                        <span className={cn('text-[15px] font-medium', out && 'text-pj-gray')}>
                                            {extra.name}
                                        </span>
                                        {out && (
                                            <span className="text-xs font-semibold text-[var(--pj-removed)]">
                                                {outNote(extra)}
                                            </span>
                                        )}
                                    </span>
                                    <button
                                        type="button"
                                        aria-pressed={on}
                                        aria-disabled={out || undefined}
                                        aria-label={
                                            out
                                                ? t('config.outAria', { name: extra.name, store: storeName })
                                                : on
                                                  ? t('config.extraRemoveAria', { name: extra.name })
                                                  : t('config.extraAddAria', {
                                                        name: extra.name,
                                                        price: formatClp(extraPrice),
                                                    })
                                        }
                                        onClick={() => !out && update({ extras: toggle(selection.extras, extra.id) })}
                                        data-testid={`pj-extra-${extra.id}`}
                                        className={cn(
                                            'flex size-[44px] shrink-0 items-center justify-center rounded-full',
                                            out
                                                ? 'cursor-not-allowed border-[1.5px] border-dashed border-pj-gray/40 bg-[var(--pj-section)] text-pj-gray/60'
                                                : on
                                                  ? 'bg-pj-green text-pj-surface'
                                                  : 'border-[1.5px] border-pj-green bg-pj-surface text-pj-green'
                                        )}>
                                        {on ? <CheckIcon /> : <PlusIcon />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    {rest.length > 0 && featured.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowAllExtras((v) => !v)}
                            aria-expanded={showAllExtras}
                            className="mt-1 min-h-[44px] self-start text-sm font-bold text-pj-green underline underline-offset-4">
                            {showAllExtras ? t('config.lessExtras') : t('config.moreExtras', { count: rest.length })}
                        </button>
                    )}
                </section>
            )}
        </div>
    );
}

function IngredientThumb({
    ingredient,
    size,
    dimmed,
}: {
    ingredient: PizzaIngredient;
    size: 'sm' | 'md';
    dimmed?: boolean;
}): ReactElement {
    const { url } = useImageUrl();
    const dimension = size === 'sm' ? 'size-[30px]' : 'size-[44px]';
    if (!ingredient.image) {
        return <span aria-hidden="true" className={cn(dimension, 'shrink-0 rounded-full bg-pj-sand')} />;
    }
    return (
        <img
            src={url(ingredient.image, size === 'sm' ? 60 : 88)}
            alt=""
            loading="lazy"
            decoding="async"
            width={size === 'sm' ? 30 : 44}
            height={size === 'sm' ? 30 : 44}
            className={cn(dimension, 'shrink-0 rounded-full bg-pj-sand object-cover', dimmed && 'opacity-35 grayscale')}
        />
    );
}

export default PizzaConfigurator;
