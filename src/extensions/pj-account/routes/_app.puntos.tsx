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
/** @sfdc-extension-file SFDC_EXT_PJ_ACCOUNT */
import { data } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Route } from './+types/_app.puntos';
import { SeoMeta } from '@/components/seo-meta';
import { readCanjeCookie } from '@/extensions/pj-cart/lib/canje';
import { PointsPage } from '../components/points-page';
import { loadPjMember, loadRedeemOffer } from '../lib/member.server';

/**
 * `/puntos` (CTA-02, CTA-03): saldo y canje son contenido principal de la página, así que se esperan en el
 * loader (una llamada al cliente y una al catálogo, en paralelo). Privada: depende de la sesión y del perfil.
 */
export async function loader({ context, request }: Route.LoaderArgs) {
    const [member, redeem] = await Promise.all([loadPjMember(context), loadRedeemOffer(context)]);
    const canje = readCanjeCookie(request.headers.get('Cookie'));
    return data({ member, redeem, canje }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export default function PuntosRoute({ loaderData }: Route.ComponentProps) {
    const { t } = useTranslation('extPjAccount');
    return (
        <>
            <SeoMeta title={t('points.metaTitle')} description={t('points.metaDescription')} />
            <PointsPage member={loaderData.member} redeem={loaderData.redeem} canje={loaderData.canje} />
        </>
    );
}
