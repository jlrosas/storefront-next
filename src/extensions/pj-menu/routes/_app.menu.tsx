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
import { useTranslation } from 'react-i18next';
import { useSearchParams, type ShouldRevalidateFunctionArgs } from 'react-router';
import type { Route } from './+types/_app.menu';
import { SeoMeta } from '@/components/seo-meta';
import { useBasket } from '@/providers/basket';
import { getActionPath, isAmbientMutation } from '@/lib/revalidation/routes/shared';
import { getDemoMoment, getDemoProfile } from '@/extensions/pj-shared/lib/profile';
import { CartBar } from '../components/cart-bar';
import { CategoryBar, type MenuCategory } from '../components/category-bar';
import { CompactSection } from '../components/compact-section';
import { OffersSection } from '../components/offers-section';
import { OrderSummary } from '../components/order-summary';
import { PizzasSection } from '../components/pizzas-section';
import { ResultsSection } from '../components/results-section';
import { SearchBox } from '../components/search-box';
import { loadMenu, searchMenu } from '../lib/menu.server';
import {
    DEFAULT_SIZE,
    isPizzaFilter,
    isPjSize,
    pizzaCount,
    totalProducts,
    type PizzaFilter,
    type PjSize,
} from '../lib/menu-model';

/**
 * Menú completo (MEN-01): ofertas, pizzas por grupo con selector de tamaño, acompañamientos,
 * bebidas, postres y extras, con la búsqueda del template. Sin tienda elegida se ve todo.
 * El tamaño y el filtro viven en la URL (`?tam=` y `?filtro=`) y se resuelven en el cliente con los
 * precios de todas las variantes que ya trajo el loader.
 */
export async function loader({ context, request }: Route.LoaderArgs) {
    const q = (new URL(request.url).searchParams.get('q') ?? '').trim();
    const profile = getDemoProfile(context);
    const moment = getDemoMoment(context);
    const [menu, results] = await Promise.all([
        loadMenu(context, { profile, moment }),
        q ? searchMenu(context, q) : Promise.resolve(null),
    ]);
    return { menu, q, results };
}

/** Solo `q`, el perfil y la hora cambian los datos; tamaño y filtro se resuelven en el cliente. */
const DATA_PARAMS = ['q', 'perfil', 'hora', 'utm_campaign'] as const;

export function shouldRevalidate({
    currentUrl,
    nextUrl,
    formMethod,
    formAction,
    defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs): boolean {
    if (formMethod && formMethod !== 'GET') {
        const actionPath = getActionPath(formAction, currentUrl.origin);
        return Boolean(actionPath && isAmbientMutation(actionPath)) && defaultShouldRevalidate;
    }
    if (currentUrl.pathname === nextUrl.pathname) {
        const same = DATA_PARAMS.every((key) => currentUrl.searchParams.get(key) === nextUrl.searchParams.get(key));
        if (same) return false;
    }
    return defaultShouldRevalidate;
}

export default function MenuRoute({ loaderData }: Route.ComponentProps) {
    const { menu, q, results } = loaderData;
    const { t } = useTranslation('extPjMenu');
    const [params, setParams] = useSearchParams();
    // Carga el carrito completo para los contadores de las tarjetas y «Tu pedido».
    useBasket({ autoLoad: true });

    const sizeParam = params.get('tam');
    const filterParam = params.get('filtro');
    const size: PjSize = isPjSize(sizeParam) ? sizeParam : DEFAULT_SIZE;
    const filter: PizzaFilter = isPizzaFilter(filterParam) ? filterParam : 'all';
    const setParam = (key: string, value: string, fallback: string) =>
        setParams(
            (previous) => {
                const next = new URLSearchParams(previous);
                if (value === fallback) next.delete(key);
                else next.set(key, value);
                return next;
            },
            { replace: true, preventScrollReset: true }
        );

    const total = totalProducts(menu);
    const categories: MenuCategory[] = [
        { id: 'ofertas', label: t('categories.offers'), count: menu.offers.length },
        { id: 'pizzas', label: t('categories.pizzas'), count: pizzaCount(menu.groups) },
        { id: 'acompanamientos', label: t('categories.sides'), count: menu.sides.length },
        { id: 'bebidas', label: t('categories.drinks'), count: menu.drinks.length },
        { id: 'postres', label: t('categories.desserts'), count: menu.desserts.length },
        { id: 'extras', label: t('categories.extras'), count: menu.extras.length },
    ].filter((category) => category.count > 0);

    return (
        <div
            className="[--pj-menu-offset:calc(var(--header-height,60px)+3.5rem)] -mt-8 overflow-x-clip bg-pj-cream"
            data-testid="pj-menu">
            <SeoMeta title={t('title')} description={t('description')} />
            <h1 className="sr-only">{t('title')}</h1>
            <div className="border-b border-pj-sand bg-pj-surface px-4 pt-2.5 pb-1.5 lg:hidden">
                <SearchBox total={total} defaultValue={q} variant="mobile" />
            </div>
            {q ? (
                <div className="mx-auto hidden max-w-[1360px] justify-end px-6 pt-4 lg:flex">
                    <SearchBox total={total} defaultValue={q} variant="desktop" />
                </div>
            ) : (
                <CategoryBar categories={categories}>
                    <SearchBox total={total} defaultValue={q} variant="desktop" className="hidden lg:block" />
                </CategoryBar>
            )}
            <div className="mx-auto grid max-w-[1360px] grid-cols-[minmax(0,1fr)] items-start gap-7 px-4 pt-4 pb-[calc(8rem+var(--pj-menu-strip,0px))] lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6 lg:pt-6 lg:pb-14">
                <div className="flex min-w-0 flex-col gap-[22px] lg:gap-9">
                    {q && results ? (
                        <ResultsSection query={q} results={results} size={size} />
                    ) : (
                        <>
                            <OffersSection offers={menu.offers} total={menu.offers.length} />
                            <PizzasSection
                                menu={menu}
                                size={size}
                                filter={filter}
                                onSize={(next) => setParam('tam', next, DEFAULT_SIZE)}
                                onFilter={(next) => setParam('filtro', next, 'all')}
                            />
                            <CompactSection id="acompanamientos" titleKey="sections.sides" products={menu.sides} />
                            <CompactSection
                                id="bebidas"
                                titleKey="sections.drinks"
                                products={menu.drinks}
                                moreKey="sections.viewMoreDrinks"
                            />
                            <CompactSection id="postres" titleKey="sections.desserts" products={menu.desserts} />
                            <CompactSection id="extras" titleKey="sections.extras" products={menu.extras} />
                        </>
                    )}
                </div>
                <OrderSummary />
            </div>
            <CartBar />
        </div>
    );
}
