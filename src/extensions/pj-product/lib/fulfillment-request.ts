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
import { ensureStore, hasStore } from '@/extensions/pj-shared/lib/events';

/**
 * Tienda antes de agregar (PRO-01 crit. 8) con el contrato de INT en pj-shared (`lib/events.ts`):
 * `pj:open-fulfillment` → panel de TIE → `pj:fulfillment-changed` / `pj:fulfillment-dismissed`.
 *
 * `status: 'cancelled'` si el cliente cerró el panel; `changed: true` si la tienda se eligió recién
 * (la hoja recarga el inventario de esa tienda antes de agregar).
 */
export async function ensureFulfillment(
    productName?: string,
    amountLabel?: string
): Promise<{ status: 'ready' | 'cancelled'; changed: boolean }> {
    if (hasStore()) return { status: 'ready', changed: false };
    const ok = await ensureStore({ source: 'pj-product', reason: 'add-to-cart', productName, amountLabel });
    if (!ok) return { status: 'cancelled', changed: false };
    return { status: 'ready', changed: hasStore() };
}
