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
import { type ReactElement, type ReactNode, Suspense } from 'react';
import { Await } from 'react-router';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Link } from '@/components/link';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import type { PizzaStore } from '../lib/pizza';
import type { SideProduct } from '../lib/upsell';
import { useImageUrl } from '../hooks/use-image-url';
import { CheckIcon, ClockIcon, GiftIcon, MinusIcon, PeopleIcon, PlusIcon } from './icons';

/**
 * Piezas comunes de las fichas de combo y de producto simple (PRO-08). La ficha de pizza (PRO-03) tiene
 * las suyas y no se toca: así lo aprobado en VAL-MEN-06 no cambia.
 */

export function Breadcrumb({ section, sectionHref, name }: { section: string; sectionHref: string; name: string }) {
    const { t } = useTranslation('extPjProduct');
    return (
        <nav
            aria-label={t('pdp.breadcrumb')}
            className="flex gap-1.5 px-4 py-2.5 text-[13px] text-pj-gray lg:px-0 lg:text-sm">
            <Link to={PJ_ROUTES.menu} className="-my-3 inline-flex min-w-11 justify-center py-3 text-pj-green">
                {t('pdp.menu')}
            </Link>
            <span aria-hidden="true">/</span>
            <Link to={sectionHref} className="-my-3 inline-flex min-w-11 justify-center py-3 text-pj-green">
                {section}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="truncate">
                {name}
            </span>
        </nav>
    );
}

/** Destacados: para cuántos, lista en N min, disponible hoy y puntos (Garlic + Sauce, N7). */
export function Highlights({
    serves,
    store,
    points,
}: {
    serves?: string | null;
    store: PizzaStore | null;
    points: number;
}): ReactElement | null {
    const { t } = useTranslation('extPjProduct');
    const items: Array<{ key: string; icon: ReactNode; text: string; strong?: boolean }> = [];
    if (serves) items.push({ key: 'serves', icon: <PeopleIcon />, text: serves });
    if (store) {
        const minutes = store.mode === 'delivery' ? store.deliveryMinutes : store.pickupMinutes;
        if (minutes) {
            items.push({
                key: 'ready',
                icon: <ClockIcon />,
                text:
                    store.mode === 'delivery'
                        ? t('pdp.arrivesIn', { minutes })
                        : t('pdpx.readyIn', { minutes, store: store.name }),
            });
        }
    }
    if (points > 0)
        items.push({ key: 'points', icon: <GiftIcon />, text: t('sheet.points', { count: points }), strong: true });
    if (items.length === 0) return null;
    return (
        <ul aria-label={t('pdp.highlights')} className="mt-0.5 grid grid-cols-2 gap-2" data-testid="pj-pdpx-highlights">
            {items.map((h) => (
                <li
                    key={h.key}
                    className={cn(
                        'flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[13px]',
                        h.strong
                            ? 'border-pj-garlic bg-pj-garlic font-bold text-pj-sauce'
                            : 'border-pj-sand bg-pj-surface font-semibold text-pj-ink'
                    )}>
                    <span className={cn('shrink-0', h.strong ? 'text-pj-sauce' : 'text-pj-green')}>{h.icon}</span>
                    {h.text}
                </li>
            ))}
        </ul>
    );
}

export function QuantityStepper({
    value,
    onChange,
    name,
}: {
    value: number;
    onChange: (next: number) => void;
    name: string;
}): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const button =
        'flex size-[44px] items-center justify-center rounded-full border-[1.5px] border-pj-green bg-pj-surface text-pj-green disabled:border-pj-line disabled:text-pj-gray';
    return (
        <div className="flex items-center justify-between gap-3" data-testid="pj-pdpx-quantity">
            <span className="text-[15px] font-bold">{t('pdpx.quantity')}</span>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className={button}
                    disabled={value <= 1}
                    aria-label={t('pdpx.decrease', { name })}
                    onClick={() => onChange(Math.max(1, value - 1))}>
                    <MinusIcon />
                </button>
                <span className="w-6 text-center text-lg font-bold" aria-live="polite">
                    {value}
                </span>
                <button
                    type="button"
                    className={button}
                    disabled={value >= 20}
                    aria-label={t('pdpx.increase', { name })}
                    onClick={() => onChange(Math.min(20, value + 1))}>
                    <PlusIcon />
                </button>
            </div>
        </div>
    );
}

/** «Completa tu pedido»: se marcan y se agregan junto con el producto en un solo botón (regla 7). */
export function CompleteOrder({
    sides,
    selected,
    onToggle,
    hint,
}: {
    sides: Promise<SideProduct[]>;
    selected: readonly string[];
    onToggle: (side: SideProduct) => void;
    hint: string;
}): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    return (
        <section
            className="flex flex-col gap-2.5 border-t-8 border-[var(--pj-section)] px-4 py-3 lg:border-0 lg:p-0"
            aria-labelledby="pj-pdpx-sides"
            data-testid="pj-pdpx-complete">
            <div>
                <h2 id="pj-pdpx-sides" className="pj-h2 text-pj-basil">
                    {t('pdp.completeTitle')}
                </h2>
                <p className="text-[13px] text-pj-gray lg:text-sm">{hint}</p>
            </div>
            <Suspense fallback={<div className="h-[210px]" aria-hidden="true" />}>
                <Await resolve={sides} errorElement={null}>
                    {(list: SideProduct[]) => (
                        <ul className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
                            {list.map((side) => {
                                const on = selected.includes(side.productId);
                                return (
                                    <li
                                        key={side.productId}
                                        className={cn(
                                            'flex w-[148px] shrink-0 flex-col gap-1.5 rounded-pj-card border-2 bg-pj-surface p-2 lg:w-auto',
                                            on ? 'border-pj-basil' : 'border-transparent'
                                        )}>
                                        {side.image && (
                                            <FoodImage
                                                src={url(side.image, 320) ?? side.image}
                                                alt={side.name}
                                                bleed
                                                crop="none"
                                                className="h-24 w-full rounded-[10px] lg:h-32"
                                            />
                                        )}
                                        <p className="text-sm leading-tight font-bold">{side.name}</p>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-sm font-bold">{formatClp(side.price)}</span>
                                            <button
                                                type="button"
                                                aria-pressed={on}
                                                aria-label={
                                                    on
                                                        ? t('upsell.removeAria', { name: side.name })
                                                        : t('upsell.addAria', { name: side.name })
                                                }
                                                onClick={() => onToggle(side)}
                                                data-testid={`pj-pdpx-side-${side.productId}`}
                                                className={cn(
                                                    'flex size-[44px] items-center justify-center rounded-full',
                                                    on
                                                        ? 'bg-pj-basil text-pj-dough'
                                                        : 'border-[1.5px] border-pj-green bg-pj-surface text-pj-green'
                                                )}>
                                                {on ? <CheckIcon /> : <PlusIcon />}
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Await>
            </Suspense>
        </section>
    );
}

/** Botón «Agregar · $X» (o «Ver mi pedido» después de agregar). */
export function AddButton({
    label,
    total,
    added,
    busy,
    onAdd,
}: {
    label: string;
    total: number;
    added: boolean;
    busy: boolean;
    onAdd: () => void;
}): ReactElement {
    const { t } = useTranslation('extPjProduct');
    if (added) {
        return (
            <Link
                to={PJ_ROUTES.cart}
                className="flex h-[52px] w-full items-center justify-between rounded-full bg-pj-lime px-5 text-base font-bold text-pj-green-dark no-underline"
                data-testid="pj-pdpx-view-order">
                <span>{t('pdp.viewOrder')}</span>
                <span>{formatClp(total)}</span>
            </Link>
        );
    }
    return (
        <button
            type="button"
            onClick={onAdd}
            disabled={busy}
            aria-busy={busy}
            className="flex h-[52px] w-full items-center justify-between rounded-full bg-pj-basil px-5 text-base font-bold text-pj-dough hover:bg-pj-green-dark disabled:opacity-70"
            data-testid="pj-pdpx-add">
            <span>{label}</span>
            <span data-testid="pj-pdpx-total">{formatClp(total)}</span>
        </button>
    );
}

/** Barra fija con el resumen y el total (móvil). En escritorio el botón va en la columna derecha. */
export function MobileBar({
    summary,
    error,
    children,
}: {
    summary: string;
    error: string | null;
    children: ReactNode;
}) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 border-t border-pj-line bg-pj-surface px-4 pt-2.5 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-6px_16px_rgb(19_52_35/0.08)] lg:hidden">
            <p className="truncate text-[13px] text-pj-gray" data-testid="pj-pdpx-bar-summary">
                {summary}
            </p>
            {error && (
                <p role="alert" className="text-sm font-semibold text-pj-sale">
                    {error}
                </p>
            )}
            {children}
        </div>
    );
}
