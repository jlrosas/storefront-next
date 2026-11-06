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
import { formatClp } from '@/extensions/pj-shared/lib/format';
import type { DemoMoment } from '@/extensions/pj-shared/lib/profile';
import { useAddLines } from '../hooks/use-home-cart';
import { imageSrcSet, scaledImage } from '../lib/images';
import type { MomentVM, OccasionVM } from '../lib/types';

const CARD =
    'flex h-full w-full flex-col overflow-hidden rounded-[14px] bg-pj-surface text-left text-pj-ink shadow-pj-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:rounded-[20px]';

function OccasionBody({ o }: { o: OccasionVM }): ReactElement {
    const { t } = useTranslation('extPjHome');
    const isThree = o.key === 'para-3';
    return (
        <>
            <FoodImage
                src={scaledImage(o.image, 480)}
                srcSet={imageSrcSet(o.image, [320, 480, 640])}
                sizes="(min-width: 1024px) 20vw, 160px"
                alt={o.imageAlt}
                bleed
                className="h-[100px] lg:h-[190px]"
            />
            <span className="flex flex-col gap-0.5 px-2.5 pt-2 pb-2.5 lg:gap-1 lg:px-4 lg:pt-3.5 lg:pb-[18px]">
                <span className="font-heading text-xl leading-none font-extrabold text-pj-green uppercase lg:text-[28px]">
                    {t(`serves.who.${o.key}`)}
                </span>
                <span className="text-sm font-bold lg:text-[17px]">{isThree ? t('serves.forThreeName') : o.name}</span>
                <span className="hidden text-sm text-pj-gray-strong lg:block">{t(`serves.desc.${o.key}`)}</span>
                <span className="lg:mt-1">
                    <strong className="text-base text-pj-sale lg:text-[22px]">{formatClp(o.price)}</strong>{' '}
                    {o.listPrice ? (
                        <span className="text-xs text-pj-gray line-through lg:text-sm">{formatClp(o.listPrice)}</span>
                    ) : isThree ? (
                        <span className="text-xs text-pj-gray italic lg:text-sm">{t('serves.forThreeNote')}</span>
                    ) : null}
                </span>
            </span>
        </>
    );
}

function ForThreeCard({ o }: { o: OccasionVM }): ReactElement {
    const { t } = useTranslation('extPjHome');
    const { add, pending, failed } = useAddLines(t('serves.forThreeToast'));
    return (
        <>
            <button
                type="button"
                className={cn(CARD, 'cursor-pointer disabled:opacity-70')}
                disabled={pending}
                aria-busy={pending}
                aria-label={`${t('serves.who.para-3')}: ${t('serves.forThreeName')}, ${formatClp(o.price)}. ${t('serves.forThreeAdd')}`}
                onClick={() => add((o.lines ?? []).map((l) => ({ productId: l.productId, quantity: 1 })))}>
                <OccasionBody o={o} />
            </button>
            {failed && (
                <p role="alert" className="mt-1 text-xs text-pj-sale">
                    {t('serves.addFailed')}
                </p>
            )}
        </>
    );
}

export interface OccasionsProps {
    items: OccasionVM[];
    title?: string;
}

/** «¿Para cuántos?»: carrusel con foto; los precios crecen con las personas (HOM-02 criterios 2 y 3). */
export function Occasions({ items, title }: OccasionsProps): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    if (items.length === 0) return null;
    return (
        <section className="flex flex-col gap-2.5 lg:gap-4">
            <h2 className="px-4 font-heading text-[26px] font-extrabold uppercase lg:px-0 lg:text-4xl">
                {title ?? t('serves.title')}
            </h2>
            <ul className="flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
                {items.map((o) => (
                    <li key={o.key} className="w-40 shrink-0 snap-start lg:w-auto">
                        {o.href ? (
                            <Link to={o.href} className={CARD}>
                                <OccasionBody o={o} />
                            </Link>
                        ) : (
                            <ForThreeCard o={o} />
                        )}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export interface MomentsProps {
    items: MomentVM[];
    /** Momento que se muestra al entrar (la hora o `?hora=`). */
    initial: DemoMoment;
    title?: string;
}

/** «¿Y para este momento?»: tarjeta compacta que cambia con la hora y se puede tocar (S-D2). */
export function Moments({ items, initial, title }: MomentsProps): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    const [picked, setPicked] = useState<DemoMoment | null>(null);
    if (items.length === 0) return null;
    const current = items.find((m) => m.id === (picked ?? initial)) ?? items[0];
    const { offer } = current;
    return (
        <section aria-label={t('moment.title')} className="flex flex-col gap-2.5 px-4 lg:gap-3.5 lg:px-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading text-2xl font-extrabold uppercase lg:text-3xl">
                    {title ?? t('moment.title')}
                </h2>
                <div role="group" aria-label={t('moment.choose')} className="flex gap-2 overflow-x-auto">
                    {items.map((m) => {
                        const on = m.id === current.id;
                        return (
                            <button
                                key={m.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setPicked(m.id)}
                                className={cn(
                                    'min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-bold lg:px-[18px] lg:text-[15px]',
                                    on ? 'bg-pj-green text-pj-surface' : 'bg-pj-sand text-pj-ink'
                                )}>
                                {t(`moment.${m.id}.label`)}
                            </button>
                        );
                    })}
                </div>
            </div>
            <Link
                key={current.id}
                to={offer.href}
                className="flex animate-[pj-in_0.3s_ease-out_both] overflow-hidden rounded-2xl bg-pj-surface text-pj-ink shadow-pj-card motion-reduce:animate-none lg:rounded-[20px]">
                <FoodImage
                    src={scaledImage(offer.image, 480)}
                    srcSet={imageSrcSet(offer.image, [240, 320, 480, 640])}
                    sizes="(min-width: 1024px) 320px, 120px"
                    alt={offer.imageAlt}
                    bleed
                    className="h-[140px] w-[120px] shrink-0 lg:h-[200px] lg:w-80"
                />
                <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-2.5 lg:gap-1.5 lg:px-6 lg:py-5">
                    <span className="self-start rounded-full bg-pj-sand px-2 py-0.5 text-[11px] font-extrabold uppercase lg:text-xs">
                        {t(`moment.${current.id}.tag`)}
                    </span>
                    <span className="text-[17px] leading-tight font-extrabold lg:font-heading lg:text-[32px] lg:leading-none lg:uppercase">
                        {t(`moment.${current.id}.title`)}
                    </span>
                    <span className="text-[13px] leading-snug text-pj-gray-strong lg:text-base">
                        <span className="lg:hidden">{offer.name}</span>
                        <span className="hidden lg:inline">{t(`moment.${current.id}.desc`)}</span>
                    </span>
                    <span>
                        <strong className="text-lg text-pj-sale lg:text-[26px]">{formatClp(offer.price)}</strong>{' '}
                        {offer.listPrice && (
                            <span className="text-xs text-pj-gray line-through lg:text-[15px]">
                                {formatClp(offer.listPrice)}
                            </span>
                        )}
                    </span>
                </span>
                <span className="mr-6 hidden min-h-[52px] shrink-0 self-center rounded-full bg-pj-green px-6 text-base font-bold text-pj-surface lg:flex lg:items-center">
                    {t(`moment.${current.id}.cta`)}
                </span>
            </Link>
        </section>
    );
}
