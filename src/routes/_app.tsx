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
import { Outlet } from 'react-router';
import type { Route } from './+types/_app';
import { usePageUIConfig, mainPaddingDataAttributes } from '@/lib/routes/page-ui-config';
import { getConfig } from '@salesforce/storefront-next-runtime/config';
import { type ShopperProducts } from '@/scapi';
import { fetchCategory, fetchCategoriesByIds } from '@/lib/api/categories.server';
import { getLogger } from '@/lib/logger.server';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { type MegaMenuCategoryFields } from '@/components/navigation-menu-mega';
import type { CategoryItemsFilter } from '@/components/navigation-menu';
import { SkipLink } from '@/components/skip-link';
// @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
import { UITarget } from '@/targets/ui-target';
import { cn } from '@/lib/utils';
import { useBasketSnapshot } from '@/providers/basket';
import { BottomNav } from '@/extensions/pj-shared/components/bottom-nav';
import { usePjPath } from '@/extensions/pj-shared/hooks/use-pj-path';
import { showsBottomNav } from '@/extensions/pj-shared/lib/routes';
// @sfdc-extension-block-end SFDC_EXT_PJ_SHARED
import {
    fetchComponentWithComponentData,
    type ComponentWithComponentData,
} from '@/lib/page-designer/component-loader.server';

type LoaderData = {
    root: Promise<ShopperProducts.schemas['Category']>;
    subs: Promise<ShopperProducts.schemas['Category'][]>;
    headerComponent: Promise<ComponentWithComponentData | null>;
    megaMenuComponent: Promise<ComponentWithComponentData | null>;
};

const NAVIGATION_FIELDS_FILTER = 'c_showInMenu' satisfies CategoryItemsFilter;
const NAVIGATION_FIELDS_MEGAMENU = {
    contentField: 'c_headerMenuBanner',
    imageField: 'c_slotBannerImage',
    orientationField: 'c_headerMenuOrientation',
} satisfies MegaMenuCategoryFields;
const NAVIGATION_FIELDS_SELECT_ROOT = [
    'id',
    'name',
    'slug',
    'onlineSubCategoriesCount',
    NAVIGATION_FIELDS_FILTER,
    ...Object.values(NAVIGATION_FIELDS_MEGAMENU),
].join(',');
const NAVIGATION_FIELDS_SELECT_SUB = ['id', 'name', 'slug', 'onlineSubCategoriesCount', NAVIGATION_FIELDS_FILTER].join(
    ','
);

/**
 * We're using the `shouldRevalidate` functionality to only load the navigation menu categories from the server on the
 * very first navigation to a page using the (default) `_app` layout. Those categories requests are divided into two
 * discrete request phases; the first to only fetch the root categories, and subsequent multiple calls to fetch the
 * identified sub categories to be displayed in the navigation menu. This behavior ensures that the initial data
 * doesn't get overwritten/removed on subsequent client-side navigations.
 *
 * **Note:** If there is a desire/intent to customize that behavior, the `shouldRevalidate` function can be modified
 * accordingly. For example, a client-side storage for the categories could be introduced to implement any desired
 * caching strategy, including specific reload/refresh intervals/conditions.
 * @see {@link https://reactrouter.com/start/framework/route-module#shouldrevalidate}
 */
export function shouldRevalidate() {
    return false;
}

export function loader({ context, request }: Route.LoaderArgs): LoaderData {
    const logger = getLogger(context);
    const config = getConfig(context);
    const { rootCategoryId, maxDepth } = config.pages.navigation;

    logger.debug('AppLayout: loader starting', { rootCategoryId, maxDepth });

    // Load the root category and its sub categories information
    // Depth 1 fetches the root category with its immediate children
    const rootCategoryPromise = fetchCategory(context, rootCategoryId, 1, {
        select: NAVIGATION_FIELDS_SELECT_ROOT,
        personalized: 'none',
    }).catch((error: unknown) => {
        logger.error('AppLayout: root navigation fetch failed', { error, rootCategoryId });
        return { id: rootCategoryId, categories: [] };
    });

    // Load each second-level sub categories tree as well, in case the resolved root-level category has any sub
    // categories and maxDepth allows for it. We then base this composed second-level promise on the initial root
    // category promise to allow for parallel loading and streaming of the two main promises. The sub category trees
    // are fetched in a single (chunked) getCategories request rather than one getCategory request per root category.
    const subCategoriesPromise =
        maxDepth >= 2
            ? rootCategoryPromise.then((rootCategory: ShopperProducts.schemas['Category']) => {
                  const subCategoryIds =
                      rootCategory.categories?.reduce((acc: string[], subCategory) => {
                          if (
                              Boolean(subCategory[NAVIGATION_FIELDS_FILTER]) &&
                              typeof subCategory.onlineSubCategoriesCount === 'number' &&
                              subCategory.onlineSubCategoriesCount > 0
                          ) {
                              acc.push(subCategory.id);
                          }
                          return acc;
                      }, []) ?? [];

                  if (subCategoryIds.length === 0) {
                      return [];
                  }

                  return fetchCategoriesByIds(context, subCategoryIds, maxDepth as 0 | 1 | 2, {
                      select: NAVIGATION_FIELDS_SELECT_SUB,
                      personalized: 'none',
                  }).catch((error: unknown) => {
                      logger.warn('AppLayout: subcategory navigation fetch failed', { error, rootCategoryId });
                      return [];
                  });
              })
            : Promise.resolve([]);

    const fetchEmbeddedComponent = (componentId: string) =>
        fetchComponentWithComponentData({ context, request, params: {} } as Route.LoaderArgs, { componentId }).catch(
            (error: unknown) => {
                logger.warn('AppLayout: embedded component fetch failed', { componentId, error });
                return null;
            }
        );

    // Fetch header embedded component data (non-blocking, streamed to client, should be blocking once data is available from KVS to avoid layout shift)
    const headerComponentPromise = fetchEmbeddedComponent('header');

    // Fetch mega-menu embedded component data — populates per-category dropdown panel content slots
    const megaMenuComponentPromise = fetchEmbeddedComponent('mega-menu');

    return {
        root: rootCategoryPromise,
        subs: subCategoriesPromise,
        headerComponent: headerComponentPromise,
        megaMenuComponent: megaMenuComponentPromise,
    };
}

/**
 * Default Layout Route
 *
 * This pathless layout route provides the standard storefront UI structure:
 * - Header with navigation
 * - Main content area (via `<Outlet/>`)
 * - Footer
 *
 * Routes that need this layout should be prefixed with `_app.` in their filename.
 * For routes without default header/footer (e.g., login), use the `_empty.` prefix instead.
 */
export default function DefaultLayout(_props: { loaderData: LoaderData }) {
    // Reflect the route's `handle.ui` config onto <main> as data-* attributes
    // during render, so the correct top padding is present in the SSR'd HTML.
    // If your CSS keys <main> padding off these, emitting them at render (not
    // in a post-hydration effect) avoids a layout shift (CLS) when the padding
    // would otherwise be added after first paint. Inert if no CSS matches.
    const mainPaddingAttrs = mainPaddingDataAttributes(usePageUIConfig());
    // @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
    const currentPath = usePjPath();
    const cartCount = useBasketSnapshot()?.totalItemCount ?? 0;
    const showBottomNav = showsBottomNav(currentPath);
    // @sfdc-extension-block-end SFDC_EXT_PJ_SHARED

    // Papa Johns (INT-02): el lienzo no tiene mega-menú, franja de anuncio ni lista de deseos.
    // El encabezado trae su propia navegación (Menú, Promos, Papa Puntos, Locales, Sigue tu
    // pedido) y en móvil se navega con la barra inferior. El loader sigue entregando las
    // categorías por compatibilidad, pero el layout ya no las pinta.
    return (
        <>
            <SkipLink />
            <Header />
            {/* @sfdc-extension-block-start SFDC_EXT_PJ_SHARED */}
            {/* Franja del pedido en curso (SEG): bajo el encabezado en escritorio y fija sobre la barra inferior en móvil. Vacía no ocupa espacio. */}
            <div
                data-pj-slot="tracking-strip"
                data-with-bottom-nav={showBottomNav ? 'true' : 'false'}
                className={cn(
                    'pointer-events-none fixed inset-x-2 z-40 *:pointer-events-auto lg:pointer-events-auto lg:static lg:inset-auto lg:z-auto',
                    showBottomNav
                        ? 'bottom-[calc(var(--pj-bottom-nav-height)+env(safe-area-inset-bottom)+6px)]'
                        : 'bottom-[calc(env(safe-area-inset-bottom)+8px)]'
                )}>
                <UITarget targetId="pj.layout.tracking" />
            </div>
            {/* @sfdc-extension-block-end SFDC_EXT_PJ_SHARED */}
            <main id="main-content" tabIndex={-1} className="grow pt-8" {...mainPaddingAttrs}>
                <Outlet />
            </main>
            <Footer />
            {/* @sfdc-extension-line SFDC_EXT_PJ_SHARED */}
            {showBottomNav && <BottomNav currentPath={currentPath} cartCount={cartCount} />}
        </>
    );
}
