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
import { type ReactElement, type ReactNode, Suspense, lazy, useMemo, useRef, useState } from 'react';
import { Await, useRevalidator } from 'react-router';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Link } from '@/components/link';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp, formatCount, formatRating } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import {
    defaultSelection,
    findVariant,
    normalizeSelection,
    optionItemsFor,
    selectionSummary,
    totalPrice,
    type PizzaConfig,
    type PizzaSelection,
} from '../lib/pizza';
import type { SideProduct } from '../lib/upsell';
import { halvesHref } from '../lib/halves';
import { linesTotal } from '../lib/cart-lines';
import { flyToCart } from '../lib/cart-bump';
import { ensureFulfillment } from '../lib/fulfillment-request';
import { PRO_TOKENS } from '../lib/tokens';
import { reviewMockFor } from '../mocks/reviews';
import { usePjCart } from '../hooks/use-pj-cart';
import { PizzaConfigurator } from './pizza-configurator';
import { useShowAddedToast } from './pizza-added-toast';
import { CheckIcon, ClockIcon, GiftIcon, PeopleIcon, PlusIcon, TrendIcon, ZoomIcon } from './icons';
import { useImageUrl } from '../hooks/use-image-url';

const PhotoZoom = lazy(() => import('./photo-zoom'));

export interface PizzaPdpProps {
    config: PizzaConfig;
    /** «Completa tu pedido» (bajo el pliegue: promesa del loader). */
    sides: Promise<SideProduct[]>;
    /** Tamaño marcado al abrir (`?size=`, respaldo del menú). */
    initialSize?: string | null;
}

/**
 * Ficha de pizza que da hambre antes que precio (PDP-Mobile / PDP-Desktop, PRO-03): foto con movimiento
 * lento, pausa y lupa → nombre → ★ → texto que se saborea → destacados → configurador (el mismo de la
 * hoja) → «Completa tu pedido» → opiniones → preguntas. Barra fija con el total en móvil; dos columnas
 * en escritorio.
 */
export function PizzaPdp({ config, sides, initialSize }: PizzaPdpProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const me = usePjMe();
    const { url, srcSet } = useImageUrl();
    const showAddedToast = useShowAddedToast();
    const revalidator = useRevalidator();
    const { submit, busy } = usePjCart();
    const heroRef = useRef<HTMLDivElement>(null);
    const [selection, setSelection] = useState<PizzaSelection>(() =>
        initialSize ? { ...defaultSelection(config), size: initialSize } : defaultSelection(config)
    );
    const [sideIds, setSideIds] = useState<string[]>([]);
    const [sidePrices, setSidePrices] = useState<Record<string, number>>({});
    const [added, setAdded] = useState<string[] | null>(null);
    const [zoom, setZoom] = useState(false);
    const [zoomMounted, setZoomMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const current = useMemo(() => normalizeSelection(config, selection), [config, selection]);
    const pizzaTotal = totalPrice(config, current);
    const sidesTotal = sideIds.reduce((sum, id) => sum + (sidePrices[id] ?? 0), 0);
    const total = pizzaTotal + sidesTotal;
    const points = pointsFor(total, 0, me?.doublePoints ?? false);
    const size = config.sizes.find((s) => s.id === current.size);
    const store = config.store;
    const review = reviewMockFor(config.productId, config.foodTypes.includes('picante'));
    const summary = selectionSummary(config, current, {
        without: (name) => t('config.withoutLower', { name }),
        plus: (name) => t('config.plus', { name }),
    });

    const change = (next: PizzaSelection) => {
        setSelection(next);
        setAdded(null);
    };

    const toggleSide = (side: SideProduct) => {
        setSidePrices((prev) => ({ ...prev, [side.productId]: side.price }));
        setSideIds((prev) =>
            prev.includes(side.productId) ? prev.filter((id) => id !== side.productId) : [...prev, side.productId]
        );
        setAdded(null);
    };

    const add = async () => {
        if (busy) return;
        const variant = findVariant(config, current.size, current.crust);
        if (!variant) return;
        const outcome = await ensureFulfillment(`${config.name} ${size?.label ?? ''}`.trim());
        if (outcome.status === 'cancelled') return;
        // Con tienda recién elegida, la ficha recarga sus destacados («Lista en 15 min en …») e inventario.
        if (outcome.changed) void revalidator.revalidate();
        setError(null);
        const result = await submit({
            intent: 'pizza',
            productId: variant.productId,
            quantity: current.quantity,
            optionItems: optionItemsFor(config, current.extras),
            removed: current.removed,
            sides: sideIds,
        });
        if (!result.success || !result.basket) {
            setError(t('sheet.error'));
            return;
        }
        const ids = result.addedItemIds ?? [];
        flyToCart(heroRef.current, config.image?.src ?? null);
        setAdded(ids);
        showAddedToast({
            productName: `${config.name} ${size?.label ?? ''}`.trim(),
            points: pointsFor(linesTotal(result.basket, ids), 0, me?.doublePoints ?? false),
            onUndo: ids.length
                ? () => {
                      void submit({ intent: 'remove', itemIds: ids });
                      setAdded(null);
                  }
                : undefined,
        });
    };

    const openZoom = () => {
        setZoomMounted(true);
        setZoom(true);
    };

    const ctaLabel = sideIds.length ? t('pdp.addWithSides', { count: sideIds.length }) : t('pdp.add');
    const actionButton = (className?: string) =>
        added ? (
            <Link
                to={PJ_ROUTES.cart}
                className={cn(
                    'flex h-[52px] w-full items-center justify-between rounded-full bg-pj-lime px-5 text-base font-bold text-pj-green-dark no-underline',
                    className
                )}
                data-testid="pj-pdp-view-order">
                <span>{t('pdp.viewOrder')}</span>
                <span>{formatClp(total)}</span>
            </Link>
        ) : (
            <button
                type="button"
                onClick={() => void add()}
                disabled={busy}
                className={cn(
                    'flex h-[52px] w-full items-center justify-between rounded-full bg-pj-green px-5 text-base font-bold text-pj-surface disabled:opacity-70',
                    className
                )}
                data-testid="pj-pdp-add">
                <span>{ctaLabel}</span>
                <span data-testid="pj-pdp-total">{formatClp(total)}</span>
            </button>
        );

    const highlights: Array<{ key: string; icon: ReactNode; text: string; strong?: boolean }> = [];
    if (size?.serves)
        highlights.push({ key: 'serves', icon: <PeopleIcon />, text: t('sheet.serves', { serves: size.serves }) });
    if (store) {
        const minutes = store.mode === 'delivery' ? store.deliveryMinutes : store.pickupMinutes;
        if (minutes) {
            highlights.push({
                key: 'ready',
                icon: <ClockIcon />,
                text:
                    store.mode === 'delivery'
                        ? t('pdp.arrivesIn', { minutes })
                        : t('pdp.readyIn', { minutes, store: store.name }),
            });
        }
        highlights.push({ key: 'today', icon: <CheckIcon />, text: t('pdp.availableToday', { store: store.name }) });
    }
    if (points > 0)
        highlights.push({
            key: 'points',
            icon: <GiftIcon />,
            text: t('sheet.points', { count: points }),
            strong: true,
        });

    const badges = (
        <div className="flex flex-wrap items-center gap-1.5">
            {config.badges.includes('mas-pedida') && (
                <span className="rounded-full bg-pj-lime px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-pj-green-dark uppercase lg:text-xs">
                    {t('pdp.bestSeller')}
                </span>
            )}
            {config.weeklyOrders != null && config.weeklyOrders >= 100 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--pj-chip)] px-2.5 py-0.5 text-xs font-bold text-[var(--pj-removed)] lg:text-[13px]">
                    <TrendIcon size={13} />
                    {t('pdp.weeklyOrders', { count: config.weeklyOrders, formatted: formatCount(config.weeklyOrders) })}
                </span>
            )}
        </div>
    );

    const rating =
        config.rating != null ? (
            <a
                href="#opiniones"
                className="inline-flex min-h-8 items-center gap-1.5 self-start text-sm text-pj-ink no-underline lg:text-[15px]">
                <span
                    role="img"
                    aria-label={t('pdp.ratingAria', { rating: formatRating(config.rating) })}
                    className="tracking-wide text-pj-star">
                    {'★★★★★'.slice(0, Math.round(config.rating))}
                    <span className="opacity-45">{'★★★★★'.slice(Math.round(config.rating))}</span>
                </span>
                <strong>{formatRating(config.rating)}</strong>
                {config.reviewCount != null && (
                    <span className="text-pj-gray-strong underline">
                        {t('pdp.reviews', { count: config.reviewCount, formatted: formatCount(config.reviewCount) })}
                    </span>
                )}
            </a>
        ) : null;

    return (
        <div className="bg-pj-cream pb-[150px] text-pj-ink lg:pb-12" style={PRO_TOKENS} data-testid="pj-pizza-pdp">
            <div className="mx-auto flex max-w-[1200px] flex-col lg:gap-8 lg:px-6 lg:pt-4">
                <nav
                    aria-label={t('pdp.breadcrumb')}
                    className="flex gap-1.5 px-4 py-2.5 text-[13px] text-pj-gray lg:px-0 lg:text-sm">
                    <Link to={PJ_ROUTES.menu} className="text-pj-green">
                        {t('pdp.menu')}
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link to={`${PJ_ROUTES.menu}#pizzas`} className="text-pj-green">
                        {t('pdp.pizzas')}
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span aria-current="page">{config.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                    {/* Columna izquierda: foto */}
                    <div className="flex min-w-0 flex-col gap-3 lg:flex-[1_1_420px] lg:sticky lg:top-24">
                        <div ref={heroRef} className="relative">
                            {config.image ? (
                                <FoodImage
                                    src={url(config.image.src, 1280) ?? config.image.src}
                                    srcSet={srcSet(config.image.src, [480, 780, 960, 1280, 1600])}
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    alt={t('sheet.imageAlt', { name: config.name })}
                                    animate
                                    priority
                                    bleed
                                    className="h-[320px] w-full lg:aspect-[5/4] lg:h-auto lg:rounded-[18px]"
                                />
                            ) : (
                                <div className="h-[320px] bg-pj-sand lg:aspect-[5/4] lg:h-auto lg:rounded-[18px]" />
                            )}
                            <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-pj-ink/70 px-2.5 py-1 text-xs font-bold text-pj-surface lg:text-[13px]">
                                {t('pdp.fresh')}
                            </span>
                            {config.image && (
                                <button
                                    type="button"
                                    onClick={openZoom}
                                    aria-label={t('pdp.zoom')}
                                    className="absolute right-[60px] bottom-2 flex size-[44px] items-center justify-center rounded-full bg-pj-surface/90 text-pj-ink">
                                    <ZoomIcon size={20} />
                                </button>
                            )}
                        </div>
                        {config.description && (
                            <div className="hidden flex-col gap-1.5 rounded-pj-card bg-pj-surface p-4 lg:flex">
                                <h2 className="font-sans text-base font-bold normal-case">{t('pdp.carries')}</h2>
                                <p className="text-[15px] leading-normal text-pj-gray-strong">{config.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha: antojo y configurador */}
                    <div className="flex min-w-0 flex-col lg:flex-[1_1_440px] lg:gap-5 lg:rounded-[18px] lg:bg-pj-surface lg:p-6">
                        <section className="flex flex-col gap-2.5 p-4 lg:gap-2 lg:p-0">
                            {badges}
                            <h1 className="font-heading text-[38px] leading-none font-extrabold uppercase lg:text-5xl">
                                {config.name}
                            </h1>
                            {rating}
                            {config.sensory && (
                                <p className="text-[15px] leading-[1.45] text-pj-gray-strong lg:text-base">
                                    {config.sensory}
                                </p>
                            )}
                            {highlights.length > 0 && (
                                <ul aria-label={t('pdp.highlights')} className="mt-0.5 grid grid-cols-2 gap-2">
                                    {highlights.map((h) => (
                                        <li
                                            key={h.key}
                                            className={cn(
                                                'flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[13px]',
                                                h.strong
                                                    ? 'border-pj-lime-soft bg-pj-lime-soft font-bold text-pj-green-dark'
                                                    : 'border-pj-sand bg-pj-surface font-semibold text-pj-ink'
                                            )}>
                                            <span className="shrink-0 text-pj-green">{h.icon}</span>
                                            {h.text}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <PizzaConfigurator config={config} selection={current} onChange={change} layout="pdp" />

                        <div className="hidden flex-col gap-2 lg:flex">
                            <p className="truncate text-[13px] text-pj-gray" data-testid="pj-pdp-summary">
                                {config.name} · {summary}
                            </p>
                            {error && (
                                <p role="alert" className="text-sm font-semibold text-pj-sale">
                                    {error}
                                </p>
                            )}
                            {actionButton()}
                        </div>
                    </div>
                </div>

                {/* Completa tu pedido */}
                <section
                    className="flex flex-col gap-2.5 border-t-8 border-[var(--pj-section)] px-4 py-3 lg:border-0 lg:p-0"
                    aria-labelledby="pj-pdp-sides">
                    <div>
                        <h2
                            id="pj-pdp-sides"
                            className="font-sans text-lg font-bold normal-case lg:font-heading lg:text-[28px] lg:font-extrabold lg:uppercase">
                            {t('pdp.completeTitle')}
                        </h2>
                        <p className="text-[13px] text-pj-gray lg:text-sm">{t('pdp.completeHint')}</p>
                    </div>
                    <Suspense fallback={<div className="h-[210px]" aria-hidden="true" />}>
                        <Await resolve={sides} errorElement={null}>
                            {(list: SideProduct[]) => (
                                <ul className="-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
                                    {list.map((side) => {
                                        const on = sideIds.includes(side.productId);
                                        return (
                                            <li
                                                key={side.productId}
                                                className={cn(
                                                    'flex w-[148px] shrink-0 flex-col gap-1.5 rounded-pj-card border-2 bg-pj-surface p-2 lg:w-auto',
                                                    on ? 'border-pj-green' : 'border-transparent'
                                                )}>
                                                {side.image && (
                                                    <img
                                                        src={url(side.image, 320)}
                                                        alt={side.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-24 w-full rounded-[10px] object-cover lg:h-32"
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
                                                        onClick={() => toggleSide(side)}
                                                        className={cn(
                                                            'flex size-[44px] items-center justify-center rounded-full',
                                                            on
                                                                ? 'bg-pj-green text-pj-surface'
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

                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-8">
                    {/* Opiniones */}
                    <section
                        id="opiniones"
                        aria-labelledby="pj-pdp-reviews"
                        className="flex scroll-mt-24 flex-col gap-3 border-t-8 border-[var(--pj-section)] px-4 py-3 lg:border-0 lg:p-0">
                        <h2
                            id="pj-pdp-reviews"
                            className="font-sans text-lg font-bold normal-case lg:font-heading lg:text-[28px] lg:font-extrabold lg:uppercase">
                            {t('pdp.reviewsTitle')}
                        </h2>
                        {config.rating != null && (
                            <div className="flex items-center gap-3.5">
                                <div className="font-heading text-[52px] leading-none font-extrabold">
                                    {formatRating(config.rating)}
                                </div>
                                <div className="flex flex-1 flex-col gap-1">
                                    {review.distribution.map((pct, index) => (
                                        <div
                                            key={`stars-${5 - index}`}
                                            className="flex items-center gap-2 text-xs text-pj-gray-strong">
                                            <span className="w-2.5">{5 - index}</span>
                                            <span
                                                aria-hidden="true"
                                                className="h-1.5 flex-1 overflow-hidden rounded-full bg-pj-track">
                                                <span
                                                    className="block h-full bg-pj-star"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </span>
                                            <span className="w-[30px] text-right">{pct}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {config.reviewCount != null && (
                            <p className="text-[13px] text-pj-gray">
                                {t('pdp.reviewsFrom', { formatted: formatCount(config.reviewCount) })}
                            </p>
                        )}
                        {review.reviews.map((r) => (
                            <article
                                key={r.who}
                                className="flex flex-col gap-1.5 rounded-pj-card bg-pj-surface px-3.5 py-3 shadow-pj-card">
                                <div className="flex justify-between text-[13px]">
                                    <strong>{r.who}</strong>
                                    <span className="text-pj-gray">{r.when}</span>
                                </div>
                                <p className="text-[13px] font-bold text-pj-star">
                                    {'★★★★★'.slice(0, r.stars)}
                                    {'☆☆☆☆☆'.slice(r.stars)} {t('pdp.starsOf', { stars: r.stars })}
                                </p>
                                <p className="text-sm leading-snug text-pj-gray-strong">{r.text}</p>
                                <span className="text-xs font-semibold text-pj-green">
                                    {t('pdp.verified', { order: r.order })}
                                </span>
                            </article>
                        ))}
                    </section>

                    {/* Preguntas frecuentes (sin información nutricional hasta tener el dato) */}
                    <section
                        aria-labelledby="pj-pdp-faq"
                        className="border-t-8 border-[var(--pj-section)] px-4 pt-2 pb-4 lg:border-0 lg:p-0">
                        <h2
                            id="pj-pdp-faq"
                            className="mt-2 mb-1 font-sans text-lg font-bold normal-case lg:mt-0 lg:font-heading lg:text-[28px] lg:font-extrabold lg:uppercase">
                            {t('pdp.faqTitle')}
                        </h2>
                        <Faq question={t('pdp.faqServes')}>{t('pdp.faqServesAnswer')}</Faq>
                        <Faq question={t('pdp.faqSpicy')}>{review.spicy}</Faq>
                        {config.halvesEnabled && (
                            <Faq question={t('pdp.faqHalves')}>
                                {t('pdp.faqHalvesAnswer')}{' '}
                                <Link
                                    to={halvesHref({ first: config.productId })}
                                    className="font-bold text-pj-green underline">
                                    {t('pdp.faqHalvesLink')}
                                </Link>
                            </Faq>
                        )}
                    </section>
                </div>
            </div>

            {/* Barra fija con el total (móvil) */}
            <div className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 border-t border-pj-line bg-pj-surface px-4 pt-2.5 pb-[max(16px,env(safe-area-inset-bottom))] shadow-[0_-6px_16px_rgb(19_52_35/0.08)] lg:hidden">
                <p className="truncate text-[13px] text-pj-gray" data-testid="pj-pdp-bar-summary">
                    {config.name} · {summary}
                    {sideIds.length > 0 ? ` + ${sideIds.length}` : ''}
                </p>
                {error && (
                    <p role="alert" className="text-sm font-semibold text-pj-sale">
                        {error}
                    </p>
                )}
                {actionButton()}
            </div>

            {zoomMounted && config.image && (
                <Suspense fallback={null}>
                    <PhotoZoom
                        open={zoom}
                        onOpenChange={setZoom}
                        src={config.image.src}
                        name={config.name}
                        caption={config.description}
                    />
                </Suspense>
            )}
        </div>
    );
}

function Faq({ question, children }: { question: string; children: ReactNode }): ReactElement {
    return (
        <details className="border-b border-pj-track">
            <summary className="flex min-h-[52px] cursor-pointer items-center text-[15px] font-bold">
                {question}
            </summary>
            <p className="mb-3 text-sm text-pj-gray-strong">{children}</p>
        </details>
    );
}

export default PizzaPdp;
