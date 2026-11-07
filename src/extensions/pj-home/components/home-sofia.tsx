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
import { LtoBadge } from '@/extensions/pj-shared/components/lto-badge';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import type { DemoMoment } from '@/extensions/pj-shared/lib/profile';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsToClp } from '@/extensions/pj-shared/lib/points';
import { useReorder } from '../hooks/use-home-cart';
import { imageSrcSet, scaledImage } from '../lib/images';
import type { FavoriteVM, LastOrderVM, OfferVM, SofiaVM } from '../lib/types';

/** «2 OCT» para el sello del último pedido. */
function badgeDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    const fmt = (opts: Intl.DateTimeFormatOptions) =>
        new Intl.DateTimeFormat('es-CL', { ...opts, timeZone: 'America/Santiago' }).format(date).replace('.', '');
    return `${fmt({ day: 'numeric' })}\n${fmt({ month: 'short' })}`;
}

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
            className="inline-flex min-h-11 items-center rounded-full bg-pj-pepperoncini px-3 text-sm font-bold text-pj-basil lg:px-4 lg:text-[15px]">
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
        <div className="flex items-center justify-between gap-3 px-4 pt-[18px] pb-3 lg:hidden">
            <h1 className="pj-h1">{t('sofia.greeting', { name: sofia.firstName })}</h1>
            <Balance points={sofia.points} />
        </div>
    );
}

/**
 * «¿Lo de siempre?» (HOM-03, HOM-07): su último pedido real como hero a sangre. En móvil la foto ocupa el
 * 60 % del alto con la tarjeta crema flotante (sello con la fecha, total en precio display y «Repetir
 * pedido»); en escritorio, layout *full* con el saludo sobre el degradado verde.
 */
export function UsualHero({ sofia }: { sofia: SofiaVM }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    const { reorder, pending, failed } = useReorder();
    const order: LastOrderVM | null = sofia.lastOrder;
    if (!order) return null;
    const hero = order.heroImage;
    const date = badgeDate(order.placedAt);
    const total = formatClp(order.total);
    return (
        <section
            aria-label={t('sofia.usualEyebrow', { date: shortDate(order.placedAt) })}
            data-testid="pj-home-usual"
            className="relative lg:flex lg:min-h-[560px] lg:items-center lg:overflow-hidden lg:bg-pj-basil-deep">
            <div
                data-testid="pj-home-hero-photo"
                className="relative h-[60svh] max-h-[620px] min-h-[360px] bg-pj-basil lg:absolute lg:inset-0 lg:h-auto lg:max-h-none">
                {hero && (
                    <FoodImage
                        src={scaledImage(hero, 1200)}
                        srcSet={imageSrcSet(hero, [480, 800, 1200, 1600])}
                        sizes="100vw"
                        alt={order.heroAlt}
                        bleed
                        crop="hero"
                        animate
                        priority
                        className="h-full [&_[aria-pressed]]:top-3 [&_[aria-pressed]]:bottom-auto lg:[&_[aria-pressed]]:top-auto lg:[&_[aria-pressed]]:bottom-4 lg:[&_[aria-pressed]]:right-4"
                        imgClassName="lg:object-[70%_55%]"
                    />
                )}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-pj-basil-deep via-pj-basil-deep/90 via-55% to-transparent lg:block lg:w-[80%]"
                />
            </div>
            <div className="relative z-10 mx-4 -mt-24 rounded-pj-section surface-dough p-5 shadow-pj-float lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1240px] lg:bg-[transparent] lg:px-6 lg:py-14 lg:text-pj-dough lg:shadow-none lg:[--pj-heading-color:var(--pj-dough)]">
                <div className="flex flex-col gap-3 lg:max-w-[560px] lg:gap-4">
                    <div className="hidden flex-wrap items-center gap-4 lg:flex">
                        <h1 className="pj-display">{t('sofia.greeting', { name: sofia.firstName })}</h1>
                        <Balance points={sofia.points} />
                    </div>
                    <div className="flex min-h-11 items-end gap-3">
                        {date && (
                            <LtoBadge
                                variant="garlic"
                                size="lg"
                                animate
                                label={t('sofia.badgeAria', { date: shortDate(order.placedAt) })}
                                className="-mt-16 shadow-pj-float lg:hidden">
                                {date}
                            </LtoBadge>
                        )}
                        <p className="pj-micro pb-1 text-pj-sauce lg:pb-0 lg:text-sm lg:text-pj-pepperoncini">
                            {t('sofia.usualEyebrow', { date: shortDate(order.placedAt) })}
                        </p>
                    </div>
                    <h2 className="pj-h2">{t('sofia.usualTitle')}</h2>
                    <p className="text-base leading-snug lg:text-xl">{order.summary}</p>
                    <p className="pj-small text-pj-gray-strong lg:text-pj-dough">
                        {t('sofia.usualMeta', { store: order.storeLabel })}
                    </p>
                    <p>
                        <PriceTag
                            variant="display"
                            size="md"
                            surface="dough"
                            price={order.total}
                            className="lg:hidden"
                        />
                        <PriceTag
                            variant="display"
                            size="md"
                            surface="basil"
                            price={order.total}
                            className="hidden lg:inline-flex"
                        />
                    </p>
                    <button
                        type="button"
                        onClick={reorder}
                        disabled={pending}
                        aria-busy={pending}
                        className="flex min-h-[52px] cursor-pointer items-center justify-between gap-6 rounded-full bg-pj-basil px-6 text-[17px] font-bold text-pj-dough transition-transform hover:bg-pj-basil-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97] disabled:opacity-80 lg:min-h-14 lg:self-start lg:bg-pj-pepperoncini lg:px-8 lg:text-lg lg:text-pj-basil lg:hover:bg-pj-pepperoncini/90 lg:focus-visible:outline-pj-pepperoncini">
                        <span>{pending ? t('sofia.reorderBusy') : t('sofia.reorder')}</span>
                        <span>{total}</span>
                    </button>
                    {failed && (
                        <p role="alert" className="text-sm text-pj-sauce lg:text-pj-pepperoncini">
                            {t('sofia.reorderFailed')}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

/** «Tus favoritas» (desde `c_pjFavorites`). */
export function Favorites({ items }: { items: FavoriteVM[] }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    if (items.length === 0) return null;
    return (
        <section className="flex flex-col gap-3 lg:gap-5">
            <h2 className="pj-h2 px-4 lg:px-0">{t('sofia.favorites')}</h2>
            <ul className="flex snap-x gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0">
                {items.map((p) => (
                    <li
                        key={p.id}
                        className="flex w-[200px] shrink-0 snap-start flex-col overflow-hidden rounded-pj-card bg-pj-surface shadow-pj-card lg:w-auto lg:rounded-[20px]">
                        <FoodImage
                            src={scaledImage(p.image, 480)}
                            srcSet={imageSrcSet(p.image, [320, 480, 640])}
                            sizes="(min-width: 1024px) 30vw, 180px"
                            alt={p.imageAlt}
                            bleed
                            crop="macro"
                            aspect="4/3"
                        />
                        <div className="flex flex-col gap-1.5 px-2.5 pt-2 pb-2.5 lg:px-[18px] lg:pt-3.5 lg:pb-[18px]">
                            <span className="pj-card-title">{p.name}</span>
                            <span className="pj-small text-pj-gray-strong">{t('sofia.times', { count: p.times })}</span>
                            <Link
                                to={p.href}
                                className="flex min-h-11 items-center justify-center rounded-full bg-pj-basil text-sm font-bold text-pj-dough transition-transform hover:bg-pj-basil-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97] lg:min-h-[46px] lg:text-base">
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

/**
 * Lealtad de Sofía en Rich Sauce (HOM-07, UX-1 §3.1): «Tus puntos ya alcanzan para una Super Pepperoni
 * mediana. ¿La sumamos?», con la barra de progreso en Tangy Tomato (forma, sin texto) y el CTA lima.
 */
export function RedeemCard({ sofia }: { sofia: SofiaVM }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    const redeem = sofia.redeem;
    if (!redeem) return null;
    const value = Math.min(sofia.points, redeem.points);
    return (
        <div
            data-testid="pj-home-redeem"
            className="surface-sauce flex h-full items-center gap-4 rounded-pj-section p-5 lg:gap-6 lg:p-7">
            <FoodImage
                src={scaledImage(redeem.image, 240)}
                alt=""
                bleed
                crop="macro"
                className="size-[84px] shrink-0 rounded-full ring-4 ring-pj-dough/15 lg:size-[128px]"
            />
            <div className="flex flex-1 flex-col gap-2 lg:gap-2.5">
                <p className="pj-micro text-pj-pepperoncini">{t('sofia.redeemEyebrow')}</p>
                <p className="text-base leading-snug lg:text-xl">
                    {t('sofia.redeemLead')}{' '}
                    <strong className="font-extrabold">{t('sofia.redeemName', { name: redeem.name })}</strong>.{' '}
                    {t('sofia.redeemAsk')}
                </p>
                <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={redeem.points}
                    aria-valuenow={value}
                    aria-label={t('sofia.redeemBar')}
                    className="h-2.5 overflow-hidden rounded-full bg-pj-dough/20">
                    <div
                        className="h-full origin-left rounded-full bg-pj-tomato"
                        style={{ width: `${Math.round((value / redeem.points) * 100)}%` }}
                    />
                </div>
                <p className="pj-small text-pj-dough/90">
                    {t('sofia.redeemMeta', {
                        points: sofia.points,
                        amount: formatClp(pointsToClp(sofia.points)),
                        needed: redeem.points,
                    })}
                </p>
                <Link
                    to={PJ_ROUTES.points}
                    className="flex min-h-11 items-center self-start rounded-full bg-pj-pepperoncini px-5 text-sm font-bold text-pj-basil transition-transform hover:bg-pj-pepperoncini/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-pepperoncini active:scale-[0.97] lg:text-[15px]">
                    {t('sofia.redeemCta')}
                </Link>
            </div>
        </div>
    );
}

/**
 * Pizza del mes para Sofía (S-D1). F7: el rótulo ya no dice «viernes»; sale del momento de la demo
 * (`getDemoMoment` o `?hora=`), así que sirve cualquier día.
 */
export function MonthCard({
    offer,
    moment,
}: {
    offer: OfferVM | null;
    moment?: DemoMoment | null;
}): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    if (!offer) return null;
    const eyebrow = t(`sofia.monthEyebrow.${moment ?? 'default'}`, { defaultValue: t('sofia.monthEyebrow.default') });
    const discount = offer.listPrice ? Math.round((1 - offer.price / offer.listPrice) * 100) : 0;
    return (
        <section
            aria-label={eyebrow}
            data-testid="pj-home-month"
            className="group relative overflow-hidden rounded-pj-section bg-pj-surface shadow-pj-card lg:flex lg:flex-[1.4]">
            <div className="relative h-[200px] lg:h-auto lg:min-h-[240px] lg:w-1/2">
                <FoodImage
                    src={scaledImage(offer.image, 800)}
                    srcSet={imageSrcSet(offer.image, [480, 640, 800])}
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    alt={offer.imageAlt}
                    bleed
                    crop="macro"
                    className="h-full"
                    imgClassName="transition-transform duration-500 ease-out motion-reduce:transition-none lg:group-hover:[transform:scale(1.05)]"
                />
                {discount > 0 && (
                    <LtoBadge
                        variant="sauce"
                        size="md"
                        className="absolute top-3 left-3"
                        label={t('hero.discountAria', { percent: discount })}>
                        {t('hero.discount', { percent: discount })}
                    </LtoBadge>
                )}
            </div>
            <div className="flex flex-col gap-2 px-5 pt-4 pb-5 lg:flex-1 lg:justify-center lg:p-7">
                <p className="pj-micro text-pj-sauce">{eyebrow}</p>
                <p className="pj-card-title">{offer.name}</p>
                <PriceTag
                    variant="display"
                    size="sm"
                    surface="dough"
                    price={offer.price}
                    listPrice={offer.listPrice}
                    showSavings={false}
                />
                <Link
                    to={offer.href}
                    aria-label={`${t('sofia.monthAdd')} ${offer.name} · ${formatClp(offer.price)}`}
                    className="mt-1 flex min-h-11 items-center justify-between gap-4 rounded-full bg-pj-basil px-5 font-bold text-pj-dough transition-transform hover:bg-pj-basil-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97] lg:self-start">
                    <span>{t('sofia.monthAdd')}</span>
                    <span>{formatClp(offer.price)}</span>
                </Link>
            </div>
        </section>
    );
}
