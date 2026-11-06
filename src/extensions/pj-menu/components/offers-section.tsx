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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { FoodImage, PriceTag } from '@/extensions/pj-shared';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { discountPercent, FEATURED_OFFERS, type MenuProduct } from '../lib/menu-model';

export function OfferCard({ offer, priority = false }: { offer: MenuProduct; priority?: boolean }): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const off = discountPercent(offer.price, offer.listPrice);
    return (
        <Link
            to={`/p/${offer.id}`}
            data-testid="pj-menu-offer-card"
            className="flex w-60 shrink-0 snap-start flex-col overflow-hidden rounded-[16px] bg-pj-surface text-pj-ink no-underline shadow-pj-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:w-auto">
            <div className="relative">
                {offer.image ? (
                    <FoodImage
                        src={offer.image.src}
                        srcSet={offer.image.srcSet}
                        sizes="(min-width: 1024px) 22vw, 240px"
                        alt={offer.image.alt}
                        aspect="2/1"
                        bleed
                        priority={priority}
                    />
                ) : (
                    <div className="bg-pj-sand" style={{ aspectRatio: '2/1' }} />
                )}
                {off !== null && (
                    <span className="absolute top-2 left-2 hidden rounded-full bg-pj-sale px-2 py-0.5 text-xs font-bold text-pj-surface lg:inline">
                        {t('offers.off', { percent: off })}
                    </span>
                )}
            </div>
            <div className="px-3 pt-2 pb-3">
                <div className="text-[15px] font-bold lg:text-base">{offer.name}</div>
                <PriceTag price={offer.price} listPrice={offer.listPrice} showSavings={false} size="sm" />
            </div>
        </Link>
    );
}

/** Ofertas (MEN-01.2): carrusel con las 4 más relevantes según el perfil y «Ver las N». */
export function OffersSection({ offers, total }: { offers: MenuProduct[]; total: number }): ReactElement | null {
    const { t } = useTranslation('extPjMenu');
    const featured = offers.slice(0, FEATURED_OFFERS);
    if (featured.length === 0) return null;
    return (
        <section
            id="ofertas"
            aria-labelledby="menu-ofertas"
            tabIndex={-1}
            className="flex scroll-mt-(--pj-menu-offset) flex-col gap-2.5 lg:gap-3">
            <div className="flex items-baseline justify-between">
                <h2 id="menu-ofertas" className="text-[26px] lg:text-[32px]">
                    <span className="lg:hidden">{t('offers.title')}</span>
                    <span className="hidden lg:inline">{t('offers.titleDesktop')}</span>
                </h2>
                <Link to={PJ_ROUTES.promos} className="text-sm font-bold text-pj-green lg:text-base">
                    <span className="lg:hidden">{t('offers.viewAll', { count: total })}</span>
                    <span className="hidden lg:inline">{t('offers.viewAllDesktop', { count: total })}</span>
                </Link>
            </div>
            <div className="-mx-4 flex scroll-pl-4 snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-3.5 lg:overflow-visible lg:px-0">
                {featured.map((offer, index) => (
                    <OfferCard key={offer.id} offer={offer} priority={index === 0} />
                ))}
            </div>
        </section>
    );
}
