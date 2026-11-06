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
import { data, redirect } from 'react-router';
import type { Route } from './+types/_app.promos.$id';
import { createProductUrl } from '@/route-paths';
import { buildUrlFromContext } from '@/lib/url.server';
import { getFulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import ComboBuilder from '../components/combo-builder';
import ExpiredOffer from '../components/expired-offer';
import { applyDiegoSourceCode, loadOffer, loadOffers, loadPizzaOptions, readDevPickupOnly } from '../lib/offers.server';
import { hasBuilder, idFromSlug, offerStatus, withUtm } from '../lib/offers';

/** Las tres ofertas vigentes que se sugieren cuando el enlace es de una oferta vencida (tabla 1.1 del contrato). */
const ALTERNATIVE_IDS = ['cb-pizza-del-mes', 'cb-super-duo', 'cb-papa-combo-postre'];

/**
 * `/promos/:id` (OFE-02 a OFE-04). Cada oferta tiene URL propia que funciona sin tienda elegida:
 *
 * - Super Dúo y Super Trío abren su constructor.
 * - Una oferta vencida (`box-halloween`) responde 200 con el aviso y tres ofertas vigentes,
 *   para no perder la visita del anuncio.
 * - Las demás ofertas (Papa Flash, Papa Combo Palitos, Papa Combo con Postre, Pizza del Mes)
 *   abren su ficha de producto (S-D3). Los `utm_*` se conservan en cada salto.
 */
export async function loader({ params, context, request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const search = url.search;
    const offer = await loadOffer(context, request, params.id);
    if (!offer) throw new Response('Offer not found', { status: 404 });

    const now = new Date();
    const status = offerStatus(offer, now);
    const dev = readDevPickupOnly(request);
    const headers = new Headers();
    if (dev.setCookie) headers.append('Set-Cookie', dev.setCookie);

    if (status === 'expired') {
        const all = await loadOffers(context, request);
        const alternatives = ALTERNATIVE_IDS.flatMap((id) => {
            const found = all.find((o) => o.id === id);
            return found && offerStatus(found, now) === 'active' ? [found] : [];
        });
        return data({ kind: 'expired' as const, offer, alternatives, search }, { headers });
    }
    if (status === 'upcoming') {
        throw redirect(buildUrlFromContext(withUtm(PJ_ROUTES.promos, search), context));
    }
    if (!hasBuilder(idFromSlug(params.id))) {
        throw redirect(buildUrlFromContext(withUtm(createProductUrl({ productId: offer.id }), search), context));
    }

    if (offer.id === 'cb-super-duo') {
        for (const cookie of await applyDiegoSourceCode(context, request)) headers.append('Set-Cookie', cookie);
    }
    const options = await loadPizzaOptions(context, offer.slots);
    return data(
        { kind: 'builder' as const, offer, options, fulfillment: getFulfillment(request), search },
        { headers }
    );
}

export function meta({ data: loaderData }: Route.MetaArgs) {
    const name = loaderData?.offer?.name;
    return [{ title: name ? `${name} | Papa Johns` : 'Promos | Papa Johns' }];
}

export default function PromoPage({ loaderData }: Route.ComponentProps) {
    if (loaderData.kind === 'expired') {
        return (
            <ExpiredOffer
                expired={loaderData.offer}
                alternatives={loaderData.alternatives}
                search={loaderData.search}
            />
        );
    }
    return (
        <ComboBuilder
            // Una oferta distinta es un constructor nuevo: no arrastra las elecciones de la anterior.
            key={loaderData.offer.id}
            offer={loaderData.offer}
            options={loaderData.options}
            fulfillment={loaderData.fulfillment}
            search={loaderData.search}
        />
    );
}
