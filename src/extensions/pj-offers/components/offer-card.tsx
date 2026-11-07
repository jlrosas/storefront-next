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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { createProductUrl } from '@/route-paths';
import { useSeoUrlContext } from '@/hooks/use-seo-url-context';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { cropForPhoto } from '@/extensions/pj-shared/lib/photo';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import { LtoBadge } from '@/extensions/pj-shared/components/lto-badge';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import type { FulfillmentMode } from '@/extensions/pj-shared/lib/fulfillment';
import {
    type Offer,
    discountPercent,
    dispatchKey,
    formatDayMonth,
    imageSrcSet,
    showsValidity,
    whoLabel,
    withUtm,
} from '../lib/offers';
import { NEAREST_PICKUP_STORE } from '../lib/mock';

export interface OfferCardProps {
    offer: Offer;
    /** Fecha de referencia para la vigencia (viene del servidor: SSR e hidratación coinciden). */
    now: string;
    /** Modalidad elegida; con `delivery` y oferta solo retiro la tarjeta avisa antes de abrirla. */
    mode: FulfillmentMode | null;
    /** `?…utm_*` de la URL para no perder la campaña. */
    search: string;
    /** Primera tarjeta: foto con prioridad (LCP). */
    priority?: boolean;
    /** La oferta destacada: en escritorio ocupa el ancho y se ve como portada. */
    featured?: boolean;
}

/** Tarjeta de oferta (Ofertas.dc.html / Ofertas-Desktop.dc.html). */
export function OfferCard({
    offer,
    now,
    mode,
    search,
    priority = false,
    featured = false,
}: OfferCardProps): ReactElement {
    const { t } = useTranslation('extPjOffers');
    const seoUrlContext = useSeoUrlContext();
    const nowDate = new Date(now);
    const href = withUtm(
        offer.hasBuilder
            ? `${PJ_ROUTES.promos}/${offer.slug}`
            : createProductUrl({ productId: offer.id }, seoUrlContext),
        search
    );
    const percent = discountPercent(offer);
    const who = whoLabel(offer.serves);
    const validity = showsValidity(offer.validTo, nowDate) && offer.validTo ? formatDayMonth(offer.validTo) : null;
    const blocked = offer.pickupOnly && mode === 'delivery';
    const cta = offer.hasBuilder ? t('card.build') : t('card.view');
    const ctaAria = offer.hasBuilder
        ? t('card.buildAria', { name: offer.name })
        : t('card.viewAria', { name: offer.name });
    const titleId = `pj-offer-${offer.slug}`;

    return (
        <article
            aria-labelledby={titleId}
            data-testid="pj-offer-card"
            data-offer={offer.id}
            data-featured={featured ? 'true' : undefined}
            className={cn(
                'flex flex-col overflow-hidden',
                featured ? '' : 'rounded-[18px] bg-pj-surface shadow-pj-card',
                featured && 'surface-basil rounded-pj-section shadow-pj-float lg:col-span-full lg:flex-row-reverse'
            )}>
            <div className={cn('relative', featured && 'lg:flex-[1.3_1_0%]')}>
                <FoodImage
                    src={offer.image ?? ''}
                    srcSet={imageSrcSet(offer.image)}
                    sizes={featured ? '(min-width: 1024px) 700px, 100vw' : '(min-width: 1024px) 400px, 100vw'}
                    alt={offer.name}
                    bleed
                    crop={cropForPhoto(offer.id)}
                    priority={priority}
                    className={cn('h-[180px] lg:h-[210px]', featured && 'h-[300px] lg:h-full lg:min-h-[420px]')}
                />
                {percent > 0 && (
                    <LtoBadge size={featured ? 'lg' : 'md'} animate={priority} className="absolute top-2.5 left-2.5">
                        {t('card.off', { percent })}
                    </LtoBadge>
                )}
                {who && (
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-pj-surface px-2.5 py-0.5 text-xs font-bold text-pj-green-dark">
                        {who}
                    </span>
                )}
            </div>
            <div
                className={cn(
                    'flex flex-1 flex-col gap-1 px-3.5 pt-3 pb-3.5',
                    featured && 'gap-2 px-5 pt-4 pb-5 lg:flex-[1_1_0%] lg:justify-center lg:gap-3 lg:p-10'
                )}>
                {featured && (
                    <span className="pj-micro inline-block self-start rounded-full bg-pj-garlic px-3 py-1 text-pj-sauce">
                        {t('card.featured')}
                    </span>
                )}
                <h2
                    id={titleId}
                    className={cn(
                        'font-sans text-[19px] leading-tight font-bold normal-case tracking-normal',
                        featured && 'font-heading text-[38px] leading-[0.92] font-extrabold uppercase lg:text-[52px]'
                    )}>
                    {offer.name}
                </h2>
                <p
                    className={cn(
                        'text-sm text-pj-gray-strong',
                        featured && 'text-[15px] text-pj-dough/90 lg:text-[17px]'
                    )}>
                    {offer.description}
                </p>
                <div className={cn('mt-0.5 flex gap-2.5 text-xs text-pj-gray', featured && 'text-pj-dough/80')}>
                    <span>{t(`card.mode.${dispatchKey(offer)}`)}</span>
                    {validity && (
                        <span className={cn('font-bold text-pj-sauce', featured && 'text-pj-accent')}>
                            {t('card.until', { date: validity })}
                        </span>
                    )}
                </div>
                {blocked && (
                    <p
                        role="note"
                        data-testid="pj-offer-pickup-only"
                        className="mt-1 rounded-xl border border-pj-dough-line bg-pj-dough-deep px-3 py-2 text-[13px] leading-snug text-pj-gray-strong lg:text-pj-gray-strong">
                        <strong className="text-pj-sauce">{t('card.pickupOnlyTitle')}.</strong>{' '}
                        {t('card.pickupOnlyBody', {
                            store: NEAREST_PICKUP_STORE.name,
                            minutes: NEAREST_PICKUP_STORE.pickupMinutes,
                        })}
                    </p>
                )}
                <div className="mt-1.5 flex items-center justify-between gap-3">
                    <div>
                        {featured ? (
                            <FeaturedPrice offer={offer} />
                        ) : (
                            <PriceTag price={offer.price} listPrice={offer.priceBefore} size="md" />
                        )}
                    </div>
                    <Link
                        to={href}
                        aria-label={ctaAria}
                        className={cn(
                            'inline-flex min-h-[46px] shrink-0 items-center rounded-full bg-pj-green px-5 font-bold text-pj-surface no-underline hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                            featured &&
                                'min-h-[50px] bg-pj-lime text-pj-green-dark hover:bg-pj-lime-soft focus-visible:outline-pj-lime lg:min-h-[54px] lg:px-[30px] lg:text-[17px] active:scale-[0.97] transition-transform'
                        )}>
                        {cta}
                    </Link>
                </div>
            </div>
        </article>
    );
}

/** Precio de la portada (VIS-02): precio display; en escritorio va sobre verde oscuro, así que usa lima. */
function FeaturedPrice({ offer }: { offer: Offer }): ReactElement {
    return (
        <span data-testid="pj-featured-price">
            <PriceTag variant="display" size="md" surface="basil" price={offer.price} listPrice={offer.priceBefore} />
        </span>
    );
}

export default OfferCard;
