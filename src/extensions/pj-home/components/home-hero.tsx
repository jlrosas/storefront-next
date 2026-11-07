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
import { LtoBadge } from '@/extensions/pj-shared/components/lto-badge';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
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
 * Hero de comida (HOM-01/02, HOM-07): la foto es la protagonista. En móvil va a sangre en el 60 % del
 * alto de la pantalla, con una tarjeta crema flotante encima (patrón Domino's, UX-1 §3.4): sello LTO,
 * titular display, precio display y CTA con el precio. En escritorio, layout *full* del playbook: la foto
 * llena el ancho y el texto va sobre el degradado verde de la izquierda. Es el elemento LCP.
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
    // Con texto propio (Page Designer o el de la Home), se usa tal cual; sin él, el del catálogo + «Para N».
    const text =
        description ??
        (offer.sensory
            ? `${offer.sensory}${
                  offer.serves
                      ? ` ${t('hero.serves', { serves: offer.serves.replace(/^Para /, '').replace('–', '–\u2060') })}.`
                      : ''
              }`
            : '');
    const before = offer.listPrice
        ? variant === 'season'
            ? t('hero.beforeFrom', { price: formatClp(offer.listPrice) })
            : formatClp(offer.listPrice)
        : null;
    // «Antes desde $X» ya dice «Antes»: se muestra y se lee tal cual. En `ad`, PriceTag lee «antes $X».
    const beforeLabel = variant === 'season' && before ? before : undefined;
    const label = ctaLabel ?? t(variant === 'season' ? 'hero.seasonCta' : 'hero.adCta');
    const price = formatClp(offer.price);

    return (
        <section
            aria-label={t('hero.section')}
            data-testid="pj-home-hero"
            className="relative lg:flex lg:min-h-[600px] lg:items-center lg:overflow-hidden lg:bg-pj-basil-deep">
            <div
                data-testid="pj-home-hero-photo"
                className="relative h-[60svh] max-h-[640px] min-h-[380px] lg:absolute lg:inset-0 lg:h-auto lg:max-h-none">
                <FoodImage
                    src={scaledImage(offer.image, 1200)}
                    srcSet={imageSrcSet(offer.image, WIDTHS)}
                    sizes="100vw"
                    alt={offer.imageAlt}
                    bleed
                    crop="hero"
                    animate={animate && !video}
                    priority
                    className="h-full [&_[aria-pressed]]:top-3 [&_[aria-pressed]]:bottom-auto lg:[&_[aria-pressed]]:top-auto lg:[&_[aria-pressed]]:bottom-4 lg:[&_[aria-pressed]]:right-4"
                    imgClassName={
                        variant === 'ad'
                            ? // Dos pizzas en fila: en móvil se acerca a una para no dejar el hueco al centro.
                              'origin-[90%_60%] object-[90%_60%] lg:origin-[70%_55%] lg:object-[70%_55%]'
                            : 'lg:object-[70%_55%]'
                    }
                />
                {video && <HeroVideo src={video} poster={scaledImage(offer.image, 1200)} />}
                {/* Escritorio: degradado verde a la izquierda para el texto (layout full, UX-1 §3.2). */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-pj-basil-deep via-pj-basil-deep/90 via-55% to-transparent lg:block lg:w-[80%]"
                />
            </div>
            <div className="relative z-10 mx-4 -mt-24 rounded-pj-section surface-dough px-5 pt-5 pb-5 shadow-pj-float lg:mx-auto lg:mt-0 lg:w-full lg:max-w-[1240px] lg:bg-[transparent] lg:px-6 lg:py-16 lg:text-pj-dough lg:shadow-none lg:[--pj-heading-color:var(--pj-dough)]">
                <div className="flex flex-col gap-3 lg:max-w-[560px] lg:gap-4">
                    <div className="flex min-h-11 items-end gap-3">
                        {discount > 0 && (
                            <LtoBadge
                                variant="sauce"
                                size="lg"
                                animate
                                label={t('hero.discountAria', { percent: discount })}
                                className="-mt-16 shadow-pj-float lg:mt-0 lg:bg-pj-pepperoncini lg:text-pj-basil lg:shadow-none">
                                {t('hero.discount', { percent: discount })}
                            </LtoBadge>
                        )}
                        <p className="pj-micro pb-1 text-pj-sauce lg:pb-2 lg:text-sm lg:text-pj-pepperoncini">
                            {eyebrow ?? t(variant === 'season' ? 'hero.seasonEyebrow' : 'hero.adEyebrow')}
                        </p>
                    </div>
                    <h1 className="pj-display text-balance">{offer.name}</h1>
                    {text && (
                        <p className="line-clamp-3 text-base leading-snug text-pj-gray-strong lg:line-clamp-none lg:text-lg lg:text-pj-dough">
                            {text}
                        </p>
                    )}
                    <p data-testid="pj-home-hero-price">
                        <PriceTag
                            variant="display"
                            size="lg"
                            surface="dough"
                            price={offer.price}
                            listPrice={offer.listPrice}
                            listPriceLabel={beforeLabel}
                            showSavings={false}
                            className="lg:hidden"
                        />
                        <PriceTag
                            variant="display"
                            size="lg"
                            surface="basil"
                            price={offer.price}
                            listPrice={offer.listPrice}
                            listPriceLabel={beforeLabel}
                            showSavings={false}
                            className="hidden lg:inline-flex"
                        />
                    </p>
                    <div className="flex flex-wrap gap-3 lg:mt-1">
                        <Link
                            to={ctaHref ?? offer.href}
                            aria-label={`${label} · ${price}`}
                            data-testid="pj-home-hero-cta"
                            className="inline-flex min-h-[52px] flex-1 items-center justify-between gap-6 rounded-full bg-pj-basil px-6 text-[17px] font-bold text-pj-dough transition-transform hover:bg-pj-basil-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97] lg:min-h-14 lg:flex-none lg:bg-pj-pepperoncini lg:px-8 lg:text-lg lg:text-pj-basil lg:hover:bg-pj-pepperoncini/90 lg:focus-visible:outline-pj-pepperoncini">
                            <span>{label}</span>
                            <span>{price}</span>
                        </Link>
                        {showSecondary && (
                            <Link
                                to={HOME_ROUTES.menu}
                                className={cn(
                                    'hidden min-h-14 items-center rounded-full border-[1.5px] border-pj-dough/70 px-6 text-base font-bold text-pj-dough hover:bg-pj-dough/10 lg:inline-flex'
                                )}>
                                {t('hero.seasonSecondary')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeHero;
