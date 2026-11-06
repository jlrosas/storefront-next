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
import { data, type ShouldRevalidateFunctionArgs } from 'react-router';
import type { Route } from './+types/_app.promos._index';
import { getFulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import OffersPage, { OCCASION_PARAM } from '../components/offers-page';
import { loadOffers, readDevPickupOnly } from '../lib/offers.server';
import { offerStatus } from '../lib/offers';

/**
 * `/promos` (OFE-01): ofertas vigentes para filtrar por ocasión. El filtro vive en la URL
 * (`?para=4`) y se aplica en el cliente, así que cambiarlo no vuelve a pedir datos.
 */
export async function loader({ context, request }: Route.LoaderArgs) {
    const now = new Date();
    const offers = (await loadOffers(context, request)).filter((o) => offerStatus(o, now) === 'active');
    const { setCookie } = readDevPickupOnly(request);
    return data(
        { offers, now: now.toISOString(), fulfillment: getFulfillment(request) },
        setCookie ? { headers: { 'Set-Cookie': setCookie } } : undefined
    );
}

/** Cambiar solo `?para=` no necesita volver al servidor: los datos ya están en la página. */
export function shouldRevalidate({ currentUrl, nextUrl, defaultShouldRevalidate }: ShouldRevalidateFunctionArgs) {
    const strip = (url: URL) => {
        const copy = new URL(url);
        copy.searchParams.delete(OCCASION_PARAM);
        return copy.toString();
    };
    return strip(currentUrl) === strip(nextUrl) ? false : defaultShouldRevalidate;
}

export function meta() {
    return [{ title: 'Promos y combos | Papa Johns' }];
}

export default function PromosPage({ loaderData }: Route.ComponentProps) {
    return <OffersPage offers={loaderData.offers} now={loaderData.now} fulfillment={loaderData.fulfillment} />;
}
