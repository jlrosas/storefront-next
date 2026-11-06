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

/**
 * Home de Papa Johns (HOM-01 a HOM-04): una sola portada que cambia según quién llega.
 *
 * Reemplaza la portada del template (carrusel de héroes, «Featured Collection», categorías).
 * El perfil lo decide `getDemoProfile` (Valentina, Diego o Sofía) y el momento, `getDemoMoment`.
 *
 * - Si la página `homepage` de Page Designer trae componentes en la región `home`, se muestran esos
 *   (una sola página sirve a los tres perfiles con visibilidad por grupo de clientes).
 * - Si no, se muestra la composición por defecto (`HomeDefault`), armada con los mismos bloques y
 *   con datos del catálogo y del cliente.
 */
import { useTranslation } from 'react-i18next';
import { redirect } from 'react-router';
import type { Route } from './+types/_app._index';
import { resolvePrefix } from '@salesforce/storefront-next-runtime/site-context';
import { getConfig } from '@salesforce/storefront-next-runtime/config';
import { Region } from '@/components/region';
import { SeoMeta } from '@/components/seo-meta';
import { PageType } from '@/lib/decorators/page-type';
import { RegionDefinition } from '@/lib/decorators/region-definition';
import { fetchPageWithComponentData } from '@/lib/page-designer/page-loader.server';
import { getLogger } from '@/lib/logger.server';
import { buildCanonicalUrl } from '@/utils/canonical-url';
import { getDemoMoment, getDemoProfile, type DemoProfile } from '@/extensions/pj-shared/lib/profile';
import { loadHomeData } from '@/extensions/pj-home/lib/home-data.server';
import { HomeDefault } from '@/extensions/pj-home/components/home-default';
import type { HomeData } from '@/extensions/pj-home/lib/types';

export { shouldRevalidate } from '@/lib/revalidation/routes/home';

@PageType({
    name: 'Home Page',
    description: 'Portada por perfil: una sola página para Valentina, Diego y Sofía',
    supportedAspectTypes: [],
})
@RegionDefinition([
    {
        id: 'home',
        name: 'Portada',
        description:
            'Hero de comida, ocasiones, «¿Para cuántos?», más pedidas, beneficios, «¿Lo de siempre?» y saldo. Cada bloque se muestra al perfil que corresponde con grupos de clientes.',
        maxComponents: 12,
    },
])
export class HomePageMetadata {}

export type HomePageData = {
    page: Awaited<ReturnType<typeof fetchPageWithComponentData>>;
    /** Datos de la composición por defecto; `null` cuando manda Page Designer. */
    home: HomeData | null;
    profile: DemoProfile;
    pageUrl: string;
};

/**
 * La portada depende del perfil y de la hora: no se comparte en cachés intermedios.
 */
export async function loader(args: Route.LoaderArgs): Promise<HomePageData> {
    const logger = getLogger(args.context);
    const config = getConfig(args.context);
    const requestUrl = new URL(args.request.url);

    // «/» sin prefijo de sitio y locale: va a la portada del sitio por defecto.
    if (requestUrl.pathname === '/' && config.url?.prefix && config.url.prefix !== '/') {
        const siteRef = config.siteAliasMap?.[config.defaultSiteId] ?? config.defaultSiteId;
        const defaultSite = config.commerce.sites.find((s) => s.id === config.defaultSiteId);
        const defaultLocale = defaultSite?.defaultLocale ?? config.i18n.fallbackLng;
        const localeRef = config.localeAliasMap?.[defaultLocale] ?? defaultLocale;
        const prefixedPath = resolvePrefix({
            prefix: config.url.prefix,
            params: { siteId: siteRef, localeId: localeRef },
        });
        throw redirect(`${prefixedPath}/`);
    }

    const profile = getDemoProfile(args.context);
    const moment = getDemoMoment(args.context);
    const pageUrl = buildCanonicalUrl(requestUrl.origin, requestUrl.pathname, requestUrl.search);

    const page = await fetchPageWithComponentData(args, { pageId: 'homepage' });
    const region = page?.regions?.find((r) => r.id === 'home');
    const hasPageDesignerContent = (region?.components?.length ?? 0) > 0;
    logger.debug('HomePage: loader', { profile, moment, hasPageDesignerContent });

    const home = hasPageDesignerContent ? null : await loadHomeData({ context: args.context, profile, moment });
    return { page, home, profile, pageUrl };
}

export default function HomePage({ loaderData }: { loaderData: HomePageData }) {
    const { t } = useTranslation('home');
    const { home, page, pageUrl } = loaderData;
    return (
        <div className="-mt-8 pb-16" data-profile={loaderData.profile}>
            <SeoMeta
                rawTitle
                title={t('meta.title', { defaultValue: 'Papa Johns Chile' })}
                description={t('meta.description', { defaultValue: 'Pizzas a domicilio y retiro' })}
                openGraph={{ type: 'website', url: pageUrl }}
            />
            <Region
                page={page}
                regionId="home"
                critical
                errorElement={home ? <HomeDefault data={home} /> : undefined}
            />
        </div>
    );
}
