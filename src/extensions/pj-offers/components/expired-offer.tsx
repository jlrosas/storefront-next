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
import { createProductUrl } from '@/route-paths';
import { useSeoUrlContext } from '@/hooks/use-seo-url-context';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { formatDayMonth, imageAt, imageSrcSet, type Offer, withUtm } from '../lib/offers';

export interface ExpiredOfferProps {
    /** La oferta que terminó (puede faltar si el enlace es de una oferta que ya no existe). */
    expired: Offer | null;
    /** Tres ofertas vigentes con su precio real (tabla 1.1 del contrato). */
    alternatives: Offer[];
    search: string;
}

/** Enlace a una oferta vencida (Oferta-Vencida.dc.html): avisa y ofrece ofertas vigentes parecidas. */
export function ExpiredOffer({ expired, alternatives, search }: ExpiredOfferProps): ReactElement {
    const { t } = useTranslation('extPjOffers');
    const seoUrlContext = useSeoUrlContext();
    const endedOn = expired?.validTo ? formatDayMonth(expired.validTo) : null;

    return (
        <div
            className="mx-auto flex max-w-[720px] flex-col gap-[18px] px-4 pb-8 lg:pb-14"
            data-testid="pj-expired-offer">
            <section className="overflow-hidden rounded-[18px] bg-pj-surface shadow-pj-card">
                {expired?.image && (
                    <div className="relative">
                        <FoodImage
                            src={expired.image}
                            srcSet={imageSrcSet(expired.image)}
                            sizes="(min-width: 768px) 720px, 100vw"
                            alt={expired.name}
                            bleed
                            priority
                            className="h-[170px] opacity-75 grayscale-[0.7] lg:h-[260px]"
                        />
                        {endedOn && (
                            <span className="absolute top-3 left-3 rounded-full bg-pj-gray-strong px-2.5 py-1 text-xs font-extrabold tracking-wide text-pj-surface uppercase">
                                {t('expired.badge', { date: endedOn })}
                            </span>
                        )}
                    </div>
                )}
                <div className="flex flex-col gap-1.5 px-4 pt-3.5 pb-4">
                    <h1 className="text-[30px]">
                        {endedOn ? t('expired.title', { date: endedOn }) : t('expired.titleNoDate')}
                    </h1>
                    <p className="text-[15px] leading-snug text-pj-gray-strong">
                        {expired && endedOn
                            ? t('expired.body', { name: expired.name, date: endedOn })
                            : t('expired.bodyNoName')}
                    </p>
                </div>
            </section>

            <section aria-label={t('expired.listLabel')} className="flex flex-col gap-3">
                {alternatives.map((offer) => {
                    const href = withUtm(
                        offer.hasBuilder
                            ? `${PJ_ROUTES.promos}/${offer.slug}`
                            : createProductUrl({ productId: offer.id }, seoUrlContext),
                        search
                    );
                    const why = t(`expired.why.${offer.id}`, { defaultValue: '' });
                    return (
                        <Link
                            key={offer.id}
                            to={href}
                            data-testid="pj-expired-alternative"
                            data-offer={offer.id}
                            className="flex overflow-hidden rounded-2xl bg-pj-surface text-pj-ink no-underline shadow-pj-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                            <FoodImage
                                src={imageAt(offer.image, 240) ?? ''}
                                srcSet={imageSrcSet(offer.image, [240, 480])}
                                sizes="120px"
                                alt=""
                                bleed
                                className="size-[120px] shrink-0"
                            />
                            <div className="flex min-w-0 flex-1 flex-col justify-center gap-[3px] px-3 py-2.5">
                                {why && (
                                    <span className="self-start rounded-full bg-[#FBE9D7] px-2 py-0.5 text-[11px] font-bold text-[#7A3A12]">
                                        {why}
                                    </span>
                                )}
                                <span className="text-[17px] font-extrabold">{offer.name}</span>
                                <span className="text-[13px] leading-tight text-pj-gray-strong">
                                    {offer.description}
                                </span>
                                <PriceTag
                                    price={offer.price}
                                    listPrice={offer.priceBefore}
                                    showSavings={false}
                                    size="md"
                                />
                            </div>
                        </Link>
                    );
                })}
            </section>

            <Link
                to={withUtm(PJ_ROUTES.promos, search)}
                className="flex min-h-[52px] items-center justify-center rounded-full bg-pj-green text-base font-bold text-pj-surface no-underline hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                {t('expired.seeAll')}
            </Link>
            <Link
                to={withUtm(PJ_ROUTES.menu, search)}
                className="flex min-h-[44px] items-center justify-center font-bold text-pj-green no-underline focus-visible:outline-2 focus-visible:outline-pj-green">
                {t('expired.menu')}
            </Link>
        </div>
    );
}

export default ExpiredOffer;
