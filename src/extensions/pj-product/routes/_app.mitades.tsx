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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import type { ReactElement } from 'react';
import type { ShouldRevalidateFunctionArgs } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Route } from './+types/_app.mitades';
import { getBasket } from '@/middlewares/basket.server';
import { SeoMeta } from '@/components/seo-meta';
import { loadHalvesBuilderData } from '../lib/halves.server';
import type { HalvesBuilderData } from '../lib/halves';
import { HalvesBuilder } from '../components/halves-builder';

/**
 * /mitades — armador mitad y mitad (PRO-04).
 * - `?primera=pz-pollo-bbq`: «½ Mitad» del menú (primera mitad puesta).
 * - `?primera=pz-pollo-bbq&segunda=pz-todas-las-carnes`: Home de Sofía «después» (las dos puestas).
 * - `?item=<itemId>`: «Editar mitades» desde el carrito (CAR); «Guardar cambios» actualiza esa línea.
 */
export async function loader({ request, context }: Route.LoaderArgs): Promise<HalvesBuilderData> {
    const data = await loadHalvesBuilderData(context, request, async (itemId) => {
        const basket = (await getBasket(context, { ensureBasket: 'read' })).current;
        return basket?.productItems?.find((line) => line.itemId === itemId) as
            | { productId?: string; c_pjHalves?: unknown }
            | undefined;
    });
    if (!data.config) throw new Response('Halves product not found', { status: 404 });
    return data;
}

/** Las mutaciones del carrito no cambian lo que lee este loader (el armador conserva su estado). */
export function shouldRevalidate({
    formMethod,
    currentUrl,
    nextUrl,
    defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
    if (formMethod && formMethod !== 'GET') return false;
    if (currentUrl.search !== nextUrl.search) return true;
    return defaultShouldRevalidate;
}

export default function HalvesPage({ loaderData }: { loaderData: HalvesBuilderData }): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const key = `${loaderData.itemId ?? ''}|${loaderData.halves.join(',')}`;
    return (
        <div className="mx-auto w-full max-w-[640px] lg:my-6 lg:overflow-hidden lg:rounded-pj-section lg:shadow-pj-card">
            <SeoMeta title={t('halves.seoTitle')} description={t('halves.seoDescription')} />
            <HalvesBuilder key={key} data={loaderData} layout="page" />
        </div>
    );
}
