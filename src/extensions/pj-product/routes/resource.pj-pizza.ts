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
import { data } from 'react-router';
import type { Route } from './+types/resource.pj-pizza';
import { getBasket } from '@/middlewares/basket.server';
import { getLogger } from '@/lib/logger.server';
import { loadPizzaConfig } from '../lib/pizza.server';
import { selectionFromItem, type PizzaConfig, type PizzaSelection } from '../lib/pizza';

export interface PizzaSheetData {
    config: PizzaConfig | null;
    /** Modo edición (PRO-05): la selección de la línea `item` del carrito. */
    selection: PizzaSelection | null;
    itemId: string | null;
}

/**
 * GET /resource/pj-pizza?product=<id>[&item=<itemId>] — datos de la hoja «Arma tu pizza».
 * La hoja se abre por interacción (desde el menú), así que sus datos se piden con `useFetcher`.
 */
export async function loader({ request, context }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const productId = url.searchParams.get('product')?.trim() ?? '';
    const itemId = url.searchParams.get('item')?.trim() || null;
    const headers = { 'Cache-Control': 'private, no-store' };
    if (!productId) {
        return data<PizzaSheetData>({ config: null, selection: null, itemId: null }, { status: 400, headers });
    }
    try {
        const config = await loadPizzaConfig(context, request, productId);
        let selection: PizzaSelection | null = null;
        if (config && itemId) {
            const basket = (await getBasket(context, { ensureBasket: 'read' })).current;
            const item = basket?.productItems?.find((line) => line.itemId === itemId);
            if (item) selection = selectionFromItem(config, item as Parameters<typeof selectionFromItem>[1]);
        }
        return data<PizzaSheetData>(
            { config, selection, itemId: selection ? itemId : null },
            { status: config ? 200 : 404, headers }
        );
    } catch (error) {
        getLogger(context).error('PjPizza: loader failed', { error, productId });
        return data<PizzaSheetData>({ config: null, selection: null, itemId: null }, { status: 500, headers });
    }
}
