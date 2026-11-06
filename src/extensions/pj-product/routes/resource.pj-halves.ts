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
import type { Route } from './+types/resource.pj-halves';
import { getBasket } from '@/middlewares/basket.server';
import { loadHalvesBuilderData } from '../lib/halves.server';

/** GET /resource/pj-halves?primera=&segunda=&item= — datos del armador cuando se abre en la hoja (menú). */
export async function loader({ request, context }: Route.LoaderArgs) {
    const result = await loadHalvesBuilderData(context, request, async (itemId) => {
        const basket = (await getBasket(context, { ensureBasket: 'read' })).current;
        return basket?.productItems?.find((line) => line.itemId === itemId) as
            | { productId?: string; c_pjHalves?: unknown }
            | undefined;
    });
    return data(result, { headers: { 'Cache-Control': 'private, no-store' } });
}
