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
import { useEffect, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { PauseIcon, PlayIcon } from '@/extensions/pj-shared/components/icons';
import { useReducedMotion } from '@/extensions/pj-shared/hooks/use-reduced-motion';
import { imageSrcSet, scaledImage } from '../lib/images';
import { HOME_ROUTES } from '../lib/constants';
import type { OfferVM } from '../lib/types';

export interface HomeHeroProps {
    /** Oferta del catálogo: nombre, precio, antes y foto salen de ahí. */
    offer: OfferVM | null;
    /** `season` = Pizza del Mes (Valentina) · `ad` = la oferta del anuncio (Diego). */
    variant?: 'season' | 'ad';
    /** Etiqueta sobre el título (editable en Page Designer). */
    eyebrow?: string;
    /** Texto que se saborea bajo el título; sin valor usa el del catálogo. */
    description?: string;
    ctaLabel?: string;
    /** Destino del botón; sin valor, el de la oferta (ficha lista para agregar o constructor). */
    ctaHref?: string;
    /** Botón secundario «Ver todo el menú» (escritorio). */
    showSecondary?: boolean;
    /** Movimiento lento con botón de pausa (R4.7). */
    animate?: boolean;
    /** URL de un MP4 corto (hasta 6 s). Con video, la foto es el póster; sin video, el movimiento lento de la foto. */
    video?: string;
}

const WIDTHS = [480, 800, 1200, 1600];

/**
 * Video del hero: se monta después del primer pintado (la foto sigue siendo el LCP), no se
 * reproduce con «reducir movimiento» y tiene botón de pausa.
 */
function HeroVideo({ src, poster }: { src: string; poster: string }): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    const reduced = useReducedMotion();
    const [ready, setReady] = useState(false);
    const [paused, setPaused] = useState(false);
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => setReady(true), 1200);
        return () => window.clearTimeout(timer);
    }, []);

    if (reduced || !ready) return null;
    const toggle = () => {
        const video = ref.current;
        if (!video) return;
        if (video.paused) void video.play();
        else video.pause();
        setPaused(!video.paused);
    };
    return (
        <>
            <video
                ref={ref}
                src={src}
                poster={poster}
                muted
                loop
                playsInline
                autoPlay
                preload="none"
                aria-hidden="true"
                data-testid="pj-home-hero-video"
                className="absolute inset-0 size-full object-cover"
            />
            <button
                type="button"
                onClick={toggle}
                aria-pressed={paused}
                aria-label={paused ? t('hero.play') : t('hero.pause')}
                className="absolute right-2 bottom-2 flex size-11 items-center justify-center rounded-full bg-pj-ink/60 text-pj-surface backdrop-blur-sm hover:bg-pj-ink/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-lime">
                {paused ? <PlayIcon size={18} /> : <PauseIcon size={18} />}
            </button>
        </>
    );
}

/**
 * Hero de comida (HOM-01/02): foto a sangre en primer plano con movimiento lento y pausa, y el
 * nombre, el precio y el botón como texto, nunca dentro de la imagen. Es el elemento LCP.
 */
export function HomeHero({
    offer,
    variant = 'season',
    eyebrow,
    description,
    ctaLabel,
    ctaHref,
    showSecondary = variant === 'season',
    animate = true,
    video,
}: HomeHeroProps): ReactElement | null {
    const { t } = useTranslation('extPjHome');
    if (!offer) return null;
    const discount = offer.listPrice ? Math.round((1 - offer.price / offer.listPrice) * 100) : 0;
    const text = description ?? offer.sensory ?? '';
    const before = offer.listPrice
        ? variant === 'season'
            ? t('hero.beforeFrom', { price: formatClp(offer.listPrice) })
            : formatClp(offer.listPrice)
        : null;
    // «Antes desde $X» ya dice «Antes»: se lee una sola vez.
    const spokenBefore = before && (variant === 'season' ? before : t('hero.before', { price: before }));
    const spoken = [formatClp(offer.price), spokenBefore].filter(Boolean).join(', ');

    return (
        <section
            aria-label={t('hero.section')}
            data-testid="pj-home-hero"
            className="bg-pj-surface lg:flex lg:bg-pj-green-dark lg:text-pj-surface">
            <div className="relative h-[250px] lg:order-2 lg:h-auto lg:min-h-[520px] lg:flex-[1.4]">
                <FoodImage
                    src={scaledImage(offer.image, 1200)}
                    srcSet={imageSrcSet(offer.image, WIDTHS)}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    alt={offer.imageAlt}
                    bleed
                    animate={animate && !video}
                    priority
                    className="h-full"
                />
                {video && <HeroVideo src={video} poster={scaledImage(offer.image, 1200)} />}
            </div>
            <div className="flex flex-col gap-1.5 px-4 pt-3.5 pb-[18px] lg:order-1 lg:flex-1 lg:justify-center lg:gap-3.5 lg:px-12 lg:py-14">
                <div className="flex gap-1.5">
                    <span className="rounded-full bg-pj-green-dark px-2.5 py-1 text-[11px] font-bold tracking-wide text-pj-lime uppercase lg:bg-pj-lime lg:text-pj-green-dark">
                        {eyebrow ?? t(variant === 'season' ? 'hero.seasonEyebrow' : 'hero.adEyebrow')}
                    </span>
                    {discount > 0 && (
                        <span className="rounded-full bg-pj-sale px-2.5 py-1 text-[11px] font-bold text-pj-surface">
                            {t('hero.discount', { percent: discount })}
                        </span>
                    )}
                </div>
                <h1 className="font-heading text-[34px] leading-[0.95] font-extrabold uppercase lg:text-[68px] lg:leading-[0.92]">
                    {offer.name}
                </h1>
                {text && (
                    <p className="text-[15px] leading-snug text-pj-gray-strong lg:text-lg lg:text-pj-surface/90">
                        {text}
                        {offer.serves
                            ? ` ${t('hero.serves', { serves: offer.serves.replace(/^Para /, '').replace('–', '–\u2060') })}.`
                            : ''}
                    </p>
                )}
                <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2.5">
                    <span className="sr-only">{spoken}</span>
                    <strong
                        aria-hidden="true"
                        className="text-3xl font-extrabold text-pj-sale lg:text-5xl lg:text-pj-lime">
                        {formatClp(offer.price)}
                    </strong>
                    {before && (
                        <span
                            aria-hidden="true"
                            className="text-[15px] text-pj-gray line-through lg:text-xl lg:text-pj-surface/80">
                            {before}
                        </span>
                    )}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-3">
                    <Link
                        to={ctaHref ?? offer.href}
                        className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-full bg-pj-green px-6 text-[17px] font-bold text-pj-surface hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-lime lg:min-h-14 lg:flex-none lg:bg-pj-lime lg:px-8 lg:text-lg lg:text-pj-green-dark lg:hover:bg-pj-lime/90">
                        {ctaLabel ?? t(variant === 'season' ? 'hero.seasonCta' : 'hero.adCta')}
                    </Link>
                    {showSecondary && (
                        <Link
                            to={HOME_ROUTES.menu}
                            className={cn(
                                'hidden min-h-14 items-center rounded-full border-[1.5px] border-pj-surface/60 px-6 text-base font-bold text-pj-surface lg:inline-flex'
                            )}>
                            {t('hero.seasonSecondary')}
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HomeHero;
