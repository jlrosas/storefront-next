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
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Fulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import {
    filterByOccasion,
    isOccasionFilterId,
    type Offer,
    type OccasionFilterId,
    FEATURED_OFFER_ID,
} from '../lib/offers';
import { useFulfillment } from '../lib/use-fulfillment';
import { OccasionFilter } from './occasion-filter';
import { OfferCard } from './offer-card';

export interface OffersPageProps {
    offers: Offer[];
    now: string;
    fulfillment: Fulfillment | null;
}

/** Parámetro de la URL con la ocasión elegida (`/promos?para=4`): se comparte y sobrevive a recargar. */
export const OCCASION_PARAM = 'para';

/** Ofertas por ocasión (OFE-01): móvil en lista, escritorio en grilla con la destacada arriba. */
export function OffersPage({ offers, now, fulfillment: initialFulfillment }: OffersPageProps): ReactElement {
    const { t } = useTranslation('extPjOffers');
    const [searchParams, setSearchParams] = useSearchParams();
    const fulfillment = useFulfillment(initialFulfillment);
    const raw = searchParams.get(OCCASION_PARAM);
    const filter: OccasionFilterId = isOccasionFilterId(raw) ? raw : 'todas';
    const visible = filterByOccasion(offers, filter);

    const onChange = (next: OccasionFilterId) => {
        const params = new URLSearchParams(searchParams);
        if (next === 'todas') params.delete(OCCASION_PARAM);
        else params.set(OCCASION_PARAM, next);
        setSearchParams(params, { replace: true, preventScrollReset: true });
    };

    return (
        <div
            className="mx-auto flex max-w-[1240px] flex-col gap-3.5 px-4 pt-0 pb-8 lg:gap-7 lg:px-6 lg:pb-14"
            data-testid="pj-offers-page">
            <h1 className="text-[32px] lg:text-[34px]">{t('page.title')}</h1>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                <p className="hidden font-heading text-[34px] font-extrabold uppercase lg:block" aria-hidden="true">
                    {t('page.filterLabel')}
                </p>
                <OccasionFilter value={filter} onChange={onChange} />
            </div>
            {visible.length === 0 ? (
                <p role="status" className="rounded-pj-card bg-pj-surface p-4 text-pj-gray-strong shadow-pj-card">
                    {t('page.empty')}
                </p>
            ) : (
                <div
                    aria-live="polite"
                    className="grid grid-cols-1 gap-3.5 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] lg:gap-5">
                    {visible.map((offer, index) => (
                        <OfferCard
                            key={offer.id}
                            offer={offer}
                            now={now}
                            mode={fulfillment?.mode ?? null}
                            search={searchParams.toString()}
                            featured={offer.id === FEATURED_OFFER_ID}
                            priority={index === 0}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default OffersPage;
