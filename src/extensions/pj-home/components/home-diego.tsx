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
import { cropForPhoto } from '@/extensions/pj-shared/lib/photo';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import type { DemoMoment } from '@/extensions/pj-shared/lib/profile';
import { useAddLines } from '../hooks/use-home-cart';
import { useHomeFulfillment } from '../hooks/use-home-fulfillment';
import { HOME_FULFILLMENT_DEFAULTS } from '../lib/fulfillment-view';
import { imageSrcSet, scaledImage } from '../lib/images';
import type { MomentVM, OccasionVM } from '../lib/types';

const CARD =
    'group flex h-full w-full flex-col overflow-hidden rounded-pj-card bg-pj-surface text-left text-pj-ink shadow-pj-card transition-shadow hover:shadow-pj-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.98] lg:rounded-[20px]';

function OccasionBody({ o }: { o: OccasionVM }): ReactElement {
    const { t } = useTranslation('extPjHome');
    const isThree = o.key === 'para-3';
    return (
        <>
            <FoodImage
                src={scaledImage(o.image, 480)}
                srcSet={imageSrcSet(o.image, [320, 480, 640])}
                sizes="(min-width: 1024px) 20vw, 168px"
                alt={o.imageAlt}
                bleed
                crop={cropForPhoto(o.image)}
                aspect="4/3"
                imgClassName="transition-transform duration-500 ease-out motion-reduce:transition-none lg:group-hover:[transform:scale(1.05)]"
            />
            <span className="flex flex-1 flex-col gap-1 px-3 pt-2.5 pb-3 lg:gap-1.5 lg:px-4 lg:pt-3.5 lg:pb-[18px]">
                <span className="pj-card-title [--pj-heading-color:var(--pj-basil)]">{t(`serves.who.${o.key}`)}</span>
                {/* F11: el nombre ocupa siempre 2 líneas como máximo y la tarjeta no deja palabras huérfanas. */}
                <span className="line-clamp-2 min-h-[2lh] text-sm leading-snug font-bold text-balance lg:text-base">
                    {isThree ? t('serves.forThreeName') : o.name}
                </span>
                <span className="hidden text-sm text-pj-gray-strong lg:line-clamp-2">{t(`serves.desc.${o.key}`)}</span>
                <span className="mt-auto flex flex-wrap items-baseline gap-x-1.5 pt-0.5">
                    <strong className="text-lg text-pj-sauce lg:text-[22px]">{formatClp(o.price)}</strong>
                    {o.listPrice ? (
                        <span className="text-xs text-pj-gray line-through lg:text-sm">{formatClp(o.listPrice)}</span>
                    ) : isThree ? (
                        <span className="basis-full text-xs text-pj-gray-strong lg:text-sm">
                            {t('serves.forThreeNote')}
                        </span>
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
        <section className="flex flex-col gap-3 lg:gap-5">
            <h2 className="pj-h2 px-4 lg:px-0">{title ?? t('serves.title')}</h2>
            <ul className="flex snap-x gap-3 overflow-x-auto px-4 pt-1 pb-3 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0">
                {items.map((o) => (
                    <li key={o.key} className="w-[168px] shrink-0 snap-start lg:w-auto">
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
    /** Foto destacada del bloque (P2-17: el queso estirándose). Sin ella, solo la tarjeta del momento. */
    photo?: string | null;
}

/**
 * «¿Y para este momento?» (S-D2, HOM-07): bloque en Fresh Basil con la foto del queso estirándose y la
 * tarjeta del momento, que cambia con la hora y se puede tocar. Va entre bloques crema: nunca junto a otro verde.
 */
export function Moments({ items, initial, title, photo }: MomentsProps): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    const [picked, setPicked] = useState<DemoMoment | null>(null);
    // #10: «Lista en 15 min en El Bosque» repite la tienda y el tiempo del chip si hay retiro elegido.
    const fulfillment = useHomeFulfillment();
    if (items.length === 0) return null;
    const current = items.find((m) => m.id === (picked ?? initial)) ?? items[0];
    const view =
        fulfillment.mode === 'pickup' && !fulfillment.scheduled
            ? fulfillment
            : { storeName: HOME_FULFILLMENT_DEFAULTS.storeName, time: HOME_FULFILLMENT_DEFAULTS.pickupTime };
    const { offer } = current;
    return (
        <section
            aria-label={title ?? t('moment.title')}
            data-testid="pj-home-moments"
            className="surface-basil mx-4 flex flex-col overflow-hidden rounded-pj-section lg:mx-0 lg:flex-row">
            {photo && (
                <FoodImage
                    src={scaledImage(photo, 900)}
                    srcSet={imageSrcSet(photo, [480, 800, 1200])}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    alt={t('moment.photoAlt')}
                    bleed
                    crop="none"
                    imgClassName="object-[70%_30%]"
                    className="h-[200px] shrink-0 lg:h-auto lg:min-h-[380px] lg:w-[40%]"
                />
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-4 px-4 py-5 lg:justify-center lg:gap-5 lg:px-10 lg:py-10">
                <h2 className="pj-h2">{title ?? t('moment.title')}</h2>
                <div
                    role="group"
                    aria-label={t('moment.choose')}
                    className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
                    {items.map((m) => {
                        const on = m.id === current.id;
                        return (
                            <button
                                key={m.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setPicked(m.id)}
                                className={cn(
                                    'min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-pepperoncini lg:px-[18px] lg:text-[15px]',
                                    on
                                        ? 'bg-pj-dough text-pj-basil'
                                        : 'bg-pj-basil-deep text-pj-dough hover:bg-pj-basil-deep/70'
                                )}>
                                {t(`moment.${m.id}.label`)}
                            </button>
                        );
                    })}
                </div>
                <Link
                    key={current.id}
                    to={offer.href}
                    className="flex animate-[pj-in_0.3s_ease-out_both] overflow-hidden rounded-pj-card bg-pj-surface text-pj-ink shadow-pj-float transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-pepperoncini active:scale-[0.98] motion-reduce:animate-none lg:rounded-[20px]">
                    <FoodImage
                        src={scaledImage(offer.image, 480)}
                        srcSet={imageSrcSet(offer.image, [240, 320, 480, 640])}
                        sizes="(min-width: 1024px) 220px, 120px"
                        alt={offer.imageAlt}
                        bleed
                        crop={cropForPhoto(offer.image ?? offer.id, 'combo')}
                        className="h-[148px] w-[120px] shrink-0 lg:h-[180px] lg:w-[220px]"
                    />
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 px-3 py-2.5 lg:gap-1.5 lg:px-5 lg:py-4">
                        <span className="self-start rounded-full bg-pj-garlic px-2 py-0.5 pj-micro text-pj-sauce">
                            {t(`moment.${current.id}.tag`)}
                        </span>
                        <span className="pj-card-title [--pj-heading-color:var(--pj-basil)]">
                            {t(`moment.${current.id}.title`)}
                        </span>
                        <span className="line-clamp-2 text-[13px] leading-snug text-pj-gray-strong lg:text-[15px]">
                            <span className="lg:hidden">{offer.name}</span>
                            <span className="hidden lg:inline">
                                {t(`moment.${current.id}.desc`, { store: view.storeName, time: view.time })}
                            </span>
                        </span>
                        <span className="flex flex-wrap items-baseline gap-x-1.5">
                            <strong className="text-xl text-pj-sauce lg:text-2xl">{formatClp(offer.price)}</strong>
                            {offer.listPrice && (
                                <span className="text-sm text-pj-gray line-through">{formatClp(offer.listPrice)}</span>
                            )}
                        </span>
                    </span>
                    <span className="mr-5 hidden min-h-[52px] shrink-0 self-center rounded-full bg-pj-basil px-6 text-base font-bold text-pj-dough xl:flex xl:items-center">
                        {t(`moment.${current.id}.cta`)}
                    </span>
                </Link>
            </div>
        </section>
    );
}
