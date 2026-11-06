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
import { redirect, type LoaderFunctionArgs } from 'react-router';
import { buildUrlFromContext } from '@/lib/url.server';
import type { ShopperProducts } from '@/scapi';
import { HALVES_PRODUCT_ID, HALVES_ROUTE } from './halves';
import { isConfigurablePizza, type PizzaConfig } from './pizza';
import { loadPizzaConfig, loadPizzaConfigFor } from './pizza.server';
import { loadPdpSides } from './upsell.server';
import type { SideProduct } from './upsell';

export interface PizzaPdpData {
    config: PizzaConfig;
    /** «Completa tu pedido»: no crítico, se resuelve después (Suspense). */
    sides: Promise<SideProduct[]>;
    /** Tamaño marcado al abrir (`?size=` del respaldo del menú). */
    initialSize: string | null;
}

/**
 * Datos de la ficha de pizza para el loader de `_app.p.$.tsx` (PRO-03). Devuelve `null` si el producto
 * no es una pizza armable (la ficha del template sigue igual). `pz-mitades` redirige al armador.
 */
export async function loadPizzaPdp(
    context: LoaderFunctionArgs['context'],
    request: Request,
    product: ShopperProducts.schemas['Product']
): Promise<PizzaPdpData | null> {
    const masterId = product.master?.masterId ?? product.id;
    const search = new URL(request.url).searchParams;
    if (masterId === HALVES_PRODUCT_ID) {
        // Respaldo del menú: `/p/pz-mitades?mitad1=<id>` → armador con esa mitad puesta.
        const query = search.toString();
        // oxlint-disable-next-line typescript/only-throw-error -- redirect() es la respuesta de React Router
        throw redirect(buildUrlFromContext(query ? `${HALVES_ROUTE}?${query}` : HALVES_ROUTE, context));
    }
    if (!isConfigurablePizza(product as { id?: string; c_pjKind?: unknown })) return null;
    const config =
        product.type?.variant && masterId !== product.id
            ? await loadPizzaConfig(context, request, masterId)
            : await loadPizzaConfigFor(context, request, product);
    if (!config || config.variants.length === 0) return null;
    return { config, sides: loadPdpSides(context), initialSize: search.get('size') };
}
