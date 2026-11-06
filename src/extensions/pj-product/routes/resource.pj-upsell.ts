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
import type { Route } from './+types/resource.pj-upsell';
import { loadSheetUpsell } from '../lib/upsell.server';

/** GET /resource/pj-upsell — oferta «Hazlo combo» (promoción `pj-hazlo-combo`) y «O agrega por separado». */
export async function loader({ context }: Route.LoaderArgs) {
    return data(await loadSheetUpsell(context), { headers: { 'Cache-Control': 'private, max-age=60' } });
}
