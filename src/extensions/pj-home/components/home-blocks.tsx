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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { BagIcon } from '@/extensions/pj-shared/components/icons';
import { cropForPhoto } from '@/extensions/pj-shared/lib/photo';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { formatClp, formatCount, formatRating } from '@/extensions/pj-shared/lib/format';
import { FoodCard } from './food-card';
import { useHomeFulfillment } from '../hooks/use-home-fulfillment';
import { imageSrcSet, scaledImage } from '../lib/images';
import { MIN_WEEKLY_ORDERS, pizzaConfigure } from '../lib/constants';
import type { IntentVM, PopularVM } from '../lib/types';

/**
 * Saludo de Valentina (HOM-01 criterio 2, HOM-07): franja de 44 px en Punchy Garlic con texto Rich Sauce
 * (7,7:1) y un ícono Basil. Reemplaza la franja lima, que el playbook trata como acento (UX-1 C2).
 */
export function GreetingStrip({ strong, rest }: { strong?: string; rest?: string }): ReactElement {
    const { t } = useTranslation('extPjHome');
    return (
        <p
            data-testid="pj-home-greeting"
            className="surface-garlic flex min-h-11 items-center gap-2.5 px-4 py-2 text-sm leading-snug lg:justify-center lg:text-[15px]">
            <StarIcon className="text-pj-basil" />
            <span>
                <strong className="font-extrabold">{strong ?? t('greeting.returningStrong')}</strong>{' '}
                {rest ?? t('greeting.returningRest')}
            </span>
        </p>
    );
}

function StarIcon({ className }: { className: string }): ReactElement {
    return (
        <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={cn('shrink-0', className)}>
            <path d="M12 2.5l2.6 6 6.4.6-4.9 4.3 1.5 6.3L12 16.4l-5.6 3.3 1.5-6.3L3 9.1l6.4-.6z" />
        </svg>
    );
}

/**
 * Franja de Diego en Rich Sauce (HOM-08, UX-2 N8): el gancho del *switcher* («Primer pedido directo:
 * +100 Papa Puntos») y el acento granate que le faltaba a su Home. Lima sobre Rich Sauce (9,0:1).
 */
export function FirstOrderStrip({ lead, points }: { lead?: string; points?: string }): ReactElement {
    const { t } = useTranslation('extPjHome');
    return (
        <p
            data-testid="pj-home-first-order"
            className="surface-sauce flex min-h-11 items-center gap-2.5 px-4 py-2 text-sm leading-snug lg:justify-center lg:text-[15px]">
            <StarIcon className="text-pj-pepperoncini" />
            <span>
                {lead ?? t('firstOrder.lead')}{' '}
                <strong className="font-extrabold text-pj-pepperoncini">{points ?? t('firstOrder.points')}</strong>
            </span>
        </p>
    );
}

function DeliveryIcon(): ReactElement {
    return (
        <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="6" cy="17" r="2.5" />
            <circle cx="18" cy="17" r="2.5" />
            <path d="M8.5 17h7M3.5 17V9h8v8M11.5 11h4l3 3.5V17" />
        </svg>
    );
}

const START_TILE =
    'group flex min-h-16 items-center gap-3 rounded-pj-card bg-pj-surface px-3 py-3 text-pj-ink shadow-pj-card transition-transform hover:shadow-pj-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97] lg:rounded-2xl lg:px-5 lg:py-[18px]';
const START_ICON = 'grid size-11 shrink-0 place-items-center rounded-full bg-pj-garlic text-pj-basil lg:size-12';

/**
 * «Empieza tu pedido»: Delivery o Retiro con ícono y tiempo, en tarjetas blancas (dejan de pesar lo
 * mismo que el CTA del hero, UX-1 C3). En escritorio suma Menú y Promos.
 */
export function StartOrder(): ReactElement {
    const { t } = useTranslation('extPjHome');
    // #10: el tiempo de la modalidad elegida sale de la misma fuente que el chip del encabezado.
    const view = useHomeFulfillment();
    const pickupTime = view.chosen && view.mode === 'pickup' && !view.scheduled ? view.time : undefined;
    const deliveryTime = view.chosen && view.mode === 'delivery' && !view.scheduled ? view.time : undefined;
    return (
        <section
            aria-label={t('start.title')}
            className="grid grid-cols-2 gap-2.5 px-4 lg:grid-cols-4 lg:gap-3 lg:px-0">
            <Link to={`${PJ_ROUTES.stores}?modo=delivery`} className={START_TILE}>
                <span className={START_ICON}>
                    <DeliveryIcon />
                </span>
                <span className="flex min-w-0 flex-col">
                    <span className="text-base font-bold text-pj-basil lg:text-xl">{t('start.delivery')}</span>
                    <span className="pj-small text-pj-gray-strong">
                        {t('start.deliveryTime', { time: deliveryTime ?? '35–45 min' })}
                    </span>
                </span>
            </Link>
            <Link to={`${PJ_ROUTES.stores}?modo=pickup`} className={START_TILE}>
                <span className={START_ICON}>
                    <BagIcon size={22} />
                </span>
                <span className="flex min-w-0 flex-col">
                    <span className="text-base font-bold text-pj-basil lg:text-xl">{t('start.pickup')}</span>
                    <span className="pj-small text-pj-gray-strong">
                        {t('start.pickupTime', { time: pickupTime ?? '15 min' })}
                    </span>
                </span>
            </Link>
            <Link to={PJ_ROUTES.menu} className={cn(START_TILE, 'hidden lg:flex')}>
                <span className="flex flex-col">
                    <span className="text-xl font-bold text-pj-basil">{t('start.menu')}</span>
                    <span className="pj-small text-pj-gray-strong">{t('start.menuHint')}</span>
                </span>
            </Link>
            <Link to={PJ_ROUTES.promos} className={cn(START_TILE, 'hidden lg:flex')}>
                <span className="flex flex-col">
                    <span className="text-xl font-bold text-pj-basil">{t('start.promos')}</span>
                    <span className="pj-small text-pj-gray-strong">{t('start.promosHint')}</span>
                </span>
            </Link>
        </section>
    );
}

/** Carril horizontal en móvil y grilla en escritorio. */
const RAIL =
    'flex snap-x gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0';

export interface PopularProps {
    items: PopularVM[];
    /** Título editable: «Las más pedidas» (Valentina) o «Más vendidos» (Diego). */
    title?: string;
    /** `compact` es la variante de Diego (sin descripción). */
    compact?: boolean;
    /** Variante «Más vendidos» (Diego). */
    best?: boolean;
}

/**
 * «Las más pedidas» (HOM-01 criterio 4, HOM-07 P2-11): tarjetas con foto macro, sello «LA MÁS PEDIDA»,
 * «+» que abre la hoja con la Familiar marcada (04 regla 1, AUD-compra P1-1), ★ y «N esta semana» solo si N ≥ 100.
 */
export function Popular({ items, title, compact = false, best = false }: PopularProps): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    if (items.length === 0) return null;
    return (
        <section className="flex flex-col gap-3 lg:gap-5">
            <h2 className="pj-h2 px-4 lg:px-0">{title ?? t(best ? 'popular.titleBestSellers' : 'popular.title')}</h2>
            <ul className={RAIL}>
                {items.map((p) => {
                    const family = p.familyPrice !== null ? formatClp(p.familyPrice) : null;
                    return (
                        <li key={p.id} className="w-[240px] shrink-0 snap-start lg:w-auto">
                            <FoodCard
                                name={p.name}
                                href={p.href}
                                image={p.image}
                                imageAlt={p.imageAlt}
                                badge={p.badge ? t(`popular.badge.${p.badge}`, { defaultValue: p.badge }) : null}
                                meta={
                                    p.rating !== null ? (
                                        <>
                                            <span className="text-pj-star">★ {formatRating(p.rating)}</span>
                                            {p.weekly !== null && p.weekly >= MIN_WEEKLY_ORDERS && (
                                                <span className="font-normal">
                                                    {' '}
                                                    · {t('popular.weekly', { n: formatCount(p.weekly) })}
                                                </span>
                                            )}
                                        </>
                                    ) : null
                                }
                                description={compact ? null : p.sensory}
                                price={family ? `${t('popular.family')} ${family}` : null}
                                configure={p.quickAddId && family ? pizzaConfigure(p.id, 'family') : null}
                                plusLabel={
                                    p.quickAddId && family
                                        ? t('popular.quickAdd', { name: p.name, price: family })
                                        : t('popular.view', { name: p.name })
                                }
                            />
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

/**
 * Carrusel por intención de Valentina (HOM-07, UX-1 P2-13, patrón Uber Eats/Rappi): «Para compartir» y
 * «Menos de $15 mil». Las pestañas son botones con `aria-pressed`, con un solo patrón de seleccionado
 * (Basil + Dough).
 */
export function IntentRail({ intents, title }: { intents: IntentVM[]; title?: string }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    const [picked, setPicked] = useState<IntentVM['id'] | null>(null);
    if (intents.length === 0) return null;
    const current = intents.find((i) => i.id === picked) ?? intents[0];
    return (
        <section
            aria-label={title ?? t('intent.title')}
            className="flex flex-col gap-3 lg:gap-5"
            data-testid="pj-home-intents">
            <div className="flex flex-col gap-3 px-4 lg:flex-row lg:items-end lg:justify-between lg:px-0">
                <h2 className="pj-h2">{title ?? t('intent.title')}</h2>
                <div role="group" aria-label={t('intent.choose')} className="flex gap-2 overflow-x-auto">
                    {intents.map((i) => {
                        const on = i.id === current.id;
                        return (
                            <button
                                key={i.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setPicked(i.id)}
                                className={cn(
                                    'min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil lg:px-5 lg:text-[15px]',
                                    on
                                        ? 'bg-pj-basil text-pj-dough'
                                        : 'bg-pj-dough-deep text-pj-basil hover:bg-pj-garlic'
                                )}>
                                {t(`intent.${i.id}`)}
                            </button>
                        );
                    })}
                </div>
            </div>
            <ul key={current.id} className={cn(RAIL, 'lg:grid-cols-4')}>
                {current.items.map((p) => (
                    <li key={p.id} className="w-[200px] shrink-0 snap-start lg:w-auto">
                        <FoodCard
                            name={p.name}
                            href={p.href}
                            image={p.image}
                            imageAlt={p.imageAlt}
                            crop={cropForPhoto(p.image ?? p.id, 'macro')}
                            sizes="(min-width: 1024px) 23vw, 200px"
                            meta={
                                p.rating !== null ? (
                                    <span className="text-pj-star">★ {formatRating(p.rating)}</span>
                                ) : null
                            }
                            price={
                                <>
                                    {p.from && (
                                        <span className="text-sm font-normal text-pj-gray-strong">
                                            {t('intent.from')}{' '}
                                        </span>
                                    )}
                                    {formatClp(p.price)}
                                    {p.listPrice && (
                                        <span className="ml-1.5 text-sm font-normal text-pj-gray line-through">
                                            {formatClp(p.listPrice)}
                                        </span>
                                    )}
                                </>
                            }
                            configure={pizzaConfigure(p.id)}
                            plusLabel={
                                pizzaConfigure(p.id)
                                    ? t('intent.add', { name: p.name })
                                    : t('popular.view', { name: p.name })
                            }
                        />
                    </li>
                ))}
            </ul>
        </section>
    );
}

/**
 * Beneficios del canal propio (sin «sin crear cuenta», S-D13), en Rich Sauce (HOM-07, UX-1 §3.1): ya no
 * queda verde sobre el footer verde. Títulos y checks en lima (9,0:1); a la derecha, la foto napocherry
 * (P2-17) en recorte macro.
 */
export function Benefits({
    title,
    items: custom,
    photo,
}: {
    title?: string;
    items?: string[];
    /** Foto destacada (`napocherry`); sin ella, el bloque va solo con texto. */
    photo?: string | null;
}): ReactElement {
    const { t } = useTranslation('extPjHome');
    const items = custom?.length ? custom : [t('benefits.points'), t('benefits.tracking'), t('benefits.payment')];
    return (
        <section
            data-testid="pj-home-benefits"
            className="surface-sauce mx-4 flex flex-col overflow-hidden rounded-pj-section lg:mx-0 lg:flex-row">
            {photo && (
                <FoodImage
                    src={scaledImage(photo, 800)}
                    srcSet={imageSrcSet(photo, [480, 800, 1200])}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    alt={t('benefits.photoAlt')}
                    bleed
                    crop="none"
                    className="h-[180px] shrink-0 lg:order-2 lg:h-auto lg:min-h-[300px] lg:w-[42%]"
                />
            )}
            <div className="flex flex-1 flex-col gap-3 px-5 py-6 lg:justify-center lg:gap-4 lg:px-10 lg:py-10">
                <h2 className="pj-h2 [--pj-heading-color:var(--pj-pepperoncini)]">{title ?? t('benefits.title')}</h2>
                <ul className="flex flex-col gap-2.5 lg:gap-3">
                    {items.map((text) => (
                        <li key={text} className="flex items-start gap-2.5 text-base">
                            <svg
                                aria-hidden="true"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mt-0.5 shrink-0 text-pj-pepperoncini">
                                <path d="m5 12.5 4.5 4.5L19 7.5" />
                            </svg>
                            <span>{text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
