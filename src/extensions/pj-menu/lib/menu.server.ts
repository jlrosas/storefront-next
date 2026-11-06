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
import type { LoaderFunctionArgs } from 'react-router';
import { fetchSearchProducts } from '@/lib/api/search.server';
import type { DemoMoment, DemoProfile } from '@/extensions/pj-shared/lib/profile';
import { toMenuProduct, type MenuSearchHit } from './menu-mapper';
import { PIZZA_GROUP_IDS, rankOffers, type MenuData, type MenuProduct, type PizzaGroup } from './menu-model';

type Context = LoaderFunctionArgs['context'];

const EXPAND = ['promotions', 'variations', 'prices', 'images', 'custom_properties', 'represented_products'];
/** SCAPI devuelve hasta 200 por página; la categoría más grande tiene 26. */
const LIMIT = 50;

async function searchHits(context: Context, params: Record<string, unknown>): Promise<MenuProduct[]> {
    const result = await fetchSearchProducts(context, {
        limit: LIMIT,
        expand: EXPAND,
        includedCustomVariationProperties: 'c_pjServes',
        ...params,
    } as never);
    return ((result.hits ?? []) as unknown as MenuSearchHit[]).map(toMenuProduct);
}

const byCategory = (context: Context, categoryId: string) => searchHits(context, { refine: [`cgid=${categoryId}`] });

/**
 * El menú completo (MEN-01): 11 consultas en paralelo a la búsqueda de SCAPI (una por categoría;
 * SCAPI las cachea 15 min). Cada subcategoría de pizzas se consulta aparte porque el resultado no
 * dice a cuál pertenece cada pizza. Sin tienda elegida se ve todo (principio 1).
 */
export async function loadMenu(
    context: Context,
    { profile, moment }: { profile: DemoProfile; moment: DemoMoment | null }
): Promise<MenuData> {
    const [offers, pizzas, sides, drinks, desserts, extras, ...groupProducts] = await Promise.all([
        byCategory(context, 'ofertas'),
        byCategory(context, 'pizzas'),
        byCategory(context, 'acompanamientos'),
        byCategory(context, 'bebidas'),
        byCategory(context, 'postres'),
        byCategory(context, 'salsas-extras'),
        ...PIZZA_GROUP_IDS.map((id) => byCategory(context, id)),
    ]);
    const groups: PizzaGroup[] = PIZZA_GROUP_IDS.map((id, index) => ({
        id,
        products: groupProducts[index].filter((p) => p.kind === 'pizza'),
    })).filter((group) => group.products.length > 0);
    return {
        offers: rankOffers(offers, profile, moment),
        groups,
        mitades: pizzas.find((p) => p.kind === 'builder' && p.id === 'pz-mitades') ?? null,
        arma: pizzas.find((p) => p.kind === 'builder' && p.id === 'pz-arma-tu-pizza') ?? null,
        sides,
        drinks,
        desserts,
        extras,
    };
}

/** Búsqueda del template (SCAPI `productSearch`) para «Busca entre N productos» y la lupa. */
export function searchMenu(context: Context, q: string): Promise<MenuProduct[]> {
    return searchHits(context, { q });
}
