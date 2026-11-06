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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { formatClp, formatCount, formatRating } from '@/extensions/pj-shared/lib/format';
import { imageSrcSet, scaledImage } from '../lib/images';
import { MIN_WEEKLY_ORDERS } from '../lib/constants';
import type { PopularVM } from '../lib/types';

/** Saludo de Valentina: una línea bajo el encabezado (HOM-01 criterio 2). */
export function GreetingStrip({ strong, rest }: { strong?: string; rest?: string }): ReactElement {
    const { t } = useTranslation('extPjHome');
    return (
        <p
            data-testid="pj-home-greeting"
            className="bg-pj-lime-soft px-4 py-2.5 text-sm text-pj-green-dark lg:py-2.5 lg:text-center lg:text-[15px]">
            <strong>{strong ?? t('greeting.returningStrong')}</strong> {rest ?? t('greeting.returningRest')}
        </p>
    );
}

const START_TILE =
    'flex flex-col rounded-[14px] bg-pj-green px-3.5 py-3 text-pj-surface hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:rounded-2xl lg:px-5 lg:py-[18px]';
const START_TILE_LIGHT =
    'hidden flex-col rounded-2xl border-[1.5px] border-pj-sand bg-pj-surface px-5 py-[18px] text-pj-ink hover:border-pj-green lg:flex';

/** «Empieza tu pedido»: Delivery o Retiro con tiempos (en escritorio, suma Menú y Promos). */
export function StartOrder(): ReactElement {
    const { t } = useTranslation('extPjHome');
    return (
        <section
            aria-label={t('start.title')}
            className="grid grid-cols-2 gap-2.5 px-4 lg:grid-cols-4 lg:gap-3 lg:px-0">
            <Link to={`${PJ_ROUTES.stores}?modo=delivery`} className={START_TILE}>
                <span className="text-[17px] font-bold lg:text-xl">{t('start.delivery')}</span>
                <span className="text-[13px] text-pj-surface/85 lg:text-sm">{t('start.deliveryTime')}</span>
            </Link>
            <Link to={`${PJ_ROUTES.stores}?modo=pickup`} className={START_TILE}>
                <span className="text-[17px] font-bold lg:text-xl">{t('start.pickup')}</span>
                <span className="text-[13px] text-pj-surface/85 lg:text-sm">{t('start.pickupTime')}</span>
            </Link>
            <Link to={PJ_ROUTES.menu} className={START_TILE_LIGHT}>
                <span className="text-xl font-bold">{t('start.menu')}</span>
                <span className="text-sm text-pj-gray">{t('start.menuHint')}</span>
            </Link>
            <Link to={PJ_ROUTES.promos} className={START_TILE_LIGHT}>
                <span className="text-xl font-bold">{t('start.promos')}</span>
                <span className="text-sm text-pj-gray">{t('start.promosHint')}</span>
            </Link>
        </section>
    );
}

export interface PopularProps {
    items: PopularVM[];
    /** Título editable: «Las más pedidas» (Valentina) o «Más vendidos» (Diego). */
    title?: string;
    /** `compact` es la variante de Diego (sin insignia ni texto sensorial en móvil). */
    compact?: boolean;
    /** Variante «Más vendidos» (Diego). */
    best?: boolean;
}

/** «Las más pedidas»: ★, insignias y «N esta semana» solo si N ≥ 100 (HOM-01 criterio 4). */
export function Popular({ items, title, compact = false, best = false }: PopularProps): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    if (items.length === 0) return null;
    return (
        <section className="flex flex-col gap-2.5 lg:gap-4">
            <h2 className="px-4 font-heading text-[26px] font-extrabold uppercase lg:px-0 lg:text-4xl">
                {title ?? t(best ? 'popular.titleBestSellers' : 'popular.title')}
            </h2>
            <ul className="flex snap-x gap-3 overflow-x-auto px-4 pb-1 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0">
                {items.map((p) => (
                    <li key={p.id} className="w-[230px] shrink-0 snap-start lg:w-auto">
                        <Link
                            to={p.href}
                            className="flex h-full flex-col overflow-hidden rounded-2xl bg-pj-surface text-pj-ink shadow-pj-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:rounded-[20px]">
                            <FoodImage
                                src={scaledImage(p.image, 600)}
                                srcSet={imageSrcSet(p.image, [320, 480, 640, 900])}
                                sizes="(min-width: 1024px) 33vw, 230px"
                                alt={p.imageAlt}
                                bleed
                                crop="macro"
                                className={compact ? 'h-[140px] lg:h-[230px]' : 'h-[170px] lg:h-[260px]'}
                            />
                            <span className="flex flex-col gap-0.5 px-3 pt-2.5 pb-3 lg:gap-1.5 lg:px-[18px] lg:pt-4 lg:pb-5">
                                {p.badge && !compact && (
                                    <span className="self-start rounded-full bg-pj-sand px-2 py-0.5 text-xs font-bold text-pj-ink">
                                        {t(`popular.badge.${p.badge}`, { defaultValue: p.badge })}
                                    </span>
                                )}
                                <span className="text-[17px] font-bold lg:text-[22px]">{p.name}</span>
                                {p.rating !== null && (
                                    <span className="text-[13px] text-pj-gray-strong lg:text-sm">
                                        <span className="font-bold text-pj-star">★ {formatRating(p.rating)}</span>
                                        {p.weekly !== null && p.weekly >= MIN_WEEKLY_ORDERS && (
                                            <> · {t('popular.weekly', { n: formatCount(p.weekly) })}</>
                                        )}
                                    </span>
                                )}
                                {p.sensory && !compact && (
                                    <span className="text-[13px] leading-snug text-pj-gray-strong lg:text-[15px]">
                                        {p.sensory}
                                    </span>
                                )}
                                {p.familyPrice !== null && (
                                    <span className="mt-0.5 text-sm lg:text-base">
                                        {t('popular.family')} <strong>{formatClp(p.familyPrice)}</strong>
                                    </span>
                                )}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

/** Beneficios del canal propio (sin «sin crear cuenta», S-D13). */
export function Benefits({ title, items: custom }: { title?: string; items?: string[] }): ReactElement {
    const { t } = useTranslation('extPjHome');
    const items = custom?.length ? custom : [t('benefits.points'), t('benefits.tracking'), t('benefits.payment')];
    return (
        <section className="mx-4 flex flex-col gap-2.5 rounded-[18px] bg-pj-green-dark px-[18px] py-4 text-pj-surface lg:mx-0 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-10 lg:gap-y-5 lg:rounded-3xl lg:px-9 lg:py-8">
            <h2 className="font-heading text-[22px] leading-none font-extrabold text-pj-lime uppercase lg:min-w-[260px] lg:flex-1 lg:text-4xl">
                {title ?? t('benefits.title')}
            </h2>
            {items.map((text) => (
                <p key={text} className="flex items-start gap-2.5 text-sm lg:min-w-[220px] lg:flex-1 lg:text-base">
                    <svg
                        aria-hidden="true"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-px shrink-0 text-pj-lime">
                        <path d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                    <span>{text}</span>
                </p>
            ))}
        </section>
    );
}
