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
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsToClp } from '@/extensions/pj-shared/lib/points';
import { useReorder } from '../hooks/use-home-cart';
import { imageSrcSet, scaledImage } from '../lib/images';
import type { FavoriteVM, LastOrderVM, OfferVM, SofiaVM } from '../lib/types';

function shortDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', timeZone: 'America/Santiago' })
        .format(date)
        .replace('.', '');
}

function Balance({ points }: { points: number }): ReactElement {
    const { t } = useTranslation('extPjHome');
    const amount = formatClp(pointsToClp(points));
    return (
        <Link
            to={PJ_ROUTES.points}
            aria-label={t('sofia.balanceAria', { points, amount })}
            className="inline-flex min-h-11 items-center rounded-full bg-pj-lime-soft px-3 text-sm font-bold text-pj-green-dark lg:bg-pj-lime lg:px-3 lg:text-[15px]">
            <span className="flex flex-col leading-tight lg:hidden">
                <span>{t('sofia.balance', { points })}</span>
                <span className="text-xs font-semibold">= {amount}</span>
            </span>
            <span className="hidden lg:inline">{t('sofia.balanceValue', { points, amount })}</span>
        </Link>
    );
}

/** Saludo y saldo de Papa Puntos (móvil: encima de «¿Lo de siempre?»). */
export function SofiaGreeting({ sofia }: { sofia: SofiaVM }): ReactElement {
    const { t } = useTranslation('extPjHome');
    return (
        <div className="flex items-center justify-between px-4 pt-[18px] lg:hidden">
            <h1 className="font-heading text-[32px] font-extrabold uppercase">
                {t('sofia.greeting', { name: sofia.firstName })}
            </h1>
            <Balance points={sofia.points} />
        </div>
    );
}

/** «¿Lo de siempre?»: su último pedido real con foto en primer plano y «Repetir pedido» (HOM-03). */
export function UsualHero({ sofia }: { sofia: SofiaVM }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    const { reorder, pending, failed } = useReorder();
    const order: LastOrderVM | null = sofia.lastOrder;
    if (!order) return null;
    const hero = order.heroImage;
    return (
        <section
            aria-label={t('sofia.usualEyebrow', { date: shortDate(order.placedAt) })}
            data-testid="pj-home-usual"
            className="mx-4 flex flex-col gap-3 overflow-hidden rounded-[18px] bg-pj-green-dark p-4 text-pj-surface lg:mx-0 lg:flex-row lg:gap-0 lg:rounded-none lg:p-0">
            {hero && (
                <div className="-mx-4 -mt-4 h-[180px] lg:order-2 lg:mx-0 lg:mt-0 lg:h-auto lg:min-h-[500px] lg:flex-[1.4]">
                    <FoodImage
                        src={scaledImage(hero, 1200)}
                        srcSet={imageSrcSet(hero, [480, 800, 1200, 1600])}
                        sizes="(min-width: 1024px) 58vw, 100vw"
                        alt={order.heroAlt}
                        bleed
                        animate
                        priority
                        className="h-full"
                    />
                </div>
            )}
            <div className="flex flex-col gap-3 lg:order-1 lg:flex-1 lg:justify-center lg:gap-3.5 lg:p-12">
                <div className="hidden flex-wrap items-center gap-3 lg:flex">
                    <h1 className="font-heading text-[56px] leading-[0.95] font-extrabold uppercase">
                        {t('sofia.greeting', { name: sofia.firstName })}
                    </h1>
                    <Balance points={sofia.points} />
                </div>
                <p className="text-xs font-bold tracking-wide text-pj-lime uppercase lg:text-[13px]">
                    {t('sofia.usualEyebrow', { date: shortDate(order.placedAt) })}
                </p>
                {order.thumbs.length > 0 && (
                    <ul className="flex gap-2 lg:hidden">
                        {order.thumbs.map((thumb) => (
                            <li key={`-`}>
                                <img
                                    src={scaledImage(thumb.src, 160)}
                                    alt={thumb.alt}
                                    width={72}
                                    height={72}
                                    loading="lazy"
                                    className="size-[72px] rounded-[10px] object-cover"
                                />
                            </li>
                        ))}
                    </ul>
                )}
                <p className="text-[15px] leading-snug lg:text-xl">{order.summary}</p>
                <p className="text-[13px] text-pj-surface/85 lg:text-[15px]">
                    {t('sofia.usualMeta', { store: order.storeLabel })}
                </p>
                <button
                    type="button"
                    onClick={reorder}
                    disabled={pending}
                    aria-busy={pending}
                    className="flex min-h-[52px] cursor-pointer items-center justify-between gap-6 rounded-full bg-pj-lime px-5 text-[17px] font-bold text-pj-green-dark hover:bg-pj-lime/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-surface disabled:opacity-80 lg:min-h-14 lg:self-start lg:px-7 lg:text-lg">
                    <span>{pending ? t('sofia.reorderBusy') : t('sofia.reorder')}</span>
                    <span>{formatClp(order.total)}</span>
                </button>
                {failed && (
                    <p role="alert" className="text-sm text-pj-lime">
                        {t('sofia.reorderFailed')}
                    </p>
                )}
            </div>
        </section>
    );
}

/** «Tus favoritas» (desde `c_pjFavorites`). */
export function Favorites({ items }: { items: FavoriteVM[] }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    if (items.length === 0) return null;
    return (
        <section className="flex flex-col gap-2.5 lg:gap-4">
            <h2 className="px-4 font-heading text-2xl font-extrabold uppercase lg:px-0 lg:text-4xl">
                {t('sofia.favorites')}
            </h2>
            <ul className="flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0">
                {items.map((p) => (
                    <li
                        key={p.id}
                        className="flex w-[180px] shrink-0 snap-start flex-col overflow-hidden rounded-[14px] bg-pj-surface shadow-pj-card lg:w-auto lg:rounded-[20px]">
                        <FoodImage
                            src={scaledImage(p.image, 480)}
                            srcSet={imageSrcSet(p.image, [320, 480, 640])}
                            sizes="(min-width: 1024px) 30vw, 180px"
                            alt={p.imageAlt}
                            bleed
                            className="h-[120px] lg:h-[220px]"
                        />
                        <div className="flex flex-col gap-1.5 px-2.5 pt-2 pb-2.5 lg:px-[18px] lg:pt-3.5 lg:pb-[18px]">
                            <span className="text-[15px] font-bold lg:text-xl">{p.name}</span>
                            <span className="text-xs text-pj-gray lg:text-sm">
                                {t('sofia.times', { count: p.times })}
                            </span>
                            <Link
                                to={p.href}
                                className="flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-pj-green text-sm font-bold text-pj-green hover:bg-pj-lime-soft lg:min-h-[46px] lg:text-base">
                                {p.price !== null
                                    ? t('sofia.addFor', { price: formatClp(p.price) })
                                    : t('sofia.monthAdd')}
                            </Link>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

/** «Ya puedes canjear una Super Pepperoni mediana (260 puntos)». */
export function RedeemCard({ sofia }: { sofia: SofiaVM }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    const redeem = sofia.redeem;
    if (!redeem) return null;
    const value = Math.min(sofia.points, redeem.points);
    return (
        <div className="flex items-center gap-3.5 rounded-[18px] bg-pj-surface p-4 shadow-pj-card lg:gap-[18px] lg:rounded-[20px] lg:p-6">
            <img
                src={scaledImage(redeem.image, 240)}
                alt=""
                width={72}
                height={72}
                loading="lazy"
                className="size-[72px] rounded-xl object-cover lg:size-[110px] lg:rounded-[14px]"
            />
            <div className="flex flex-1 flex-col gap-1.5 lg:gap-2">
                <p className="text-[15px] font-bold lg:text-[19px]">{t('sofia.redeemTitle', { name: redeem.name })}</p>
                <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={redeem.points}
                    aria-valuenow={value}
                    aria-label={t('sofia.redeemBar')}
                    className="h-2 overflow-hidden rounded-full bg-pj-track lg:h-2.5">
                    <div
                        className="h-full bg-pj-green"
                        style={{ width: `${Math.round((value / redeem.points) * 100)}%` }}
                    />
                </div>
                <p className="text-xs text-pj-gray lg:text-sm">
                    {t('sofia.redeemMeta', {
                        points: sofia.points,
                        amount: formatClp(pointsToClp(sofia.points)),
                        needed: redeem.points,
                    })}
                </p>
                <Link
                    to={PJ_ROUTES.points}
                    className="flex min-h-11 items-center self-start rounded-full bg-pj-green px-3.5 text-sm font-bold text-pj-surface hover:bg-pj-green-dark lg:px-[18px] lg:text-[15px]">
                    {t('sofia.redeemCta')}
                </Link>
            </div>
        </div>
    );
}

/** «Para tu viernes · Pizza del mes» con The Works (S-D1). */
export function MonthCard({ offer }: { offer: OfferVM | null }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    if (!offer) return null;
    return (
        <section
            aria-label={t('sofia.monthEyebrow')}
            className="overflow-hidden rounded-[18px] bg-pj-surface shadow-pj-card lg:flex lg:flex-[1.4] lg:rounded-[20px]">
            <FoodImage
                src={scaledImage(offer.image, 800)}
                srcSet={imageSrcSet(offer.image, [480, 640, 800])}
                sizes="(min-width: 1024px) 30vw, 100vw"
                alt={offer.imageAlt}
                bleed
                className="h-[170px] lg:h-auto lg:min-h-[200px] lg:w-1/2"
            />
            <div className="flex items-center justify-between gap-2.5 px-4 pt-3 pb-3.5 lg:flex-col lg:items-start lg:justify-center lg:gap-1.5 lg:p-[22px]">
                <div>
                    <p className="text-xs font-bold text-pj-sale uppercase">{t('sofia.monthEyebrow')}</p>
                    <p className="text-[17px] font-bold lg:text-[22px]">{offer.name}</p>
                    <p>
                        <strong className="text-pj-sale lg:text-2xl">{formatClp(offer.price)}</strong>{' '}
                        {offer.listPrice && (
                            <span className="text-[13px] text-pj-gray line-through lg:text-base">
                                {formatClp(offer.listPrice)}
                            </span>
                        )}
                    </p>
                </div>
                <Link
                    to={offer.href}
                    className="flex min-h-11 items-center rounded-full bg-pj-green px-[18px] font-bold text-pj-surface hover:bg-pj-green-dark">
                    {t('sofia.monthAdd')}
                </Link>
            </div>
        </section>
    );
}
