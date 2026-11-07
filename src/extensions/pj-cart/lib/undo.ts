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
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import type { PjCartPayload } from '@/extensions/pj-product/lib/cart-payload';
import { EXTRA_OPTION_PREFIX } from '@/extensions/pj-product/lib/pizza';
import { comboChoicesFromItem, type ComboGroup, type LineSummary, type SummaryLineItem } from './line-summary';

/**
 * «Deshacer» de «Quitaste X» (UX-3 §3.10): la llamada que vuelve a agregar la línea con la misma configuración
 * (extras, quitados, mitades o elecciones del combo). Usa la acción de PRO (`/action/pj-cart`).
 */
export function readdPayload(summary: LineSummary, item: SummaryLineItem): PjCartPayload | null {
    const productId = item.productId ?? summary.productId;
    if (!productId) return null;
    const quantity = Math.max(1, summary.quantity);
    switch (summary.kind) {
        case 'pizza':
            return {
                intent: 'pizza',
                productId,
                quantity,
                optionItems: summary.extras.map((extra) => ({
                    optionId: `${EXTRA_OPTION_PREFIX}${extra.id}`,
                    optionValueId: 'si',
                })),
                removed: summary.removed.map((r) => r.id),
            };
        case 'halves':
            return summary.halves.length === 2
                ? { intent: 'halves', productId, quantity, halves: summary.halves.map((h) => h.id) }
                : null;
        case 'combo': {
            const choices = comboChoicesFromItem(item);
            return choices.length
                ? { intent: 'combo', productId, quantity, choices }
                : { intent: 'add', items: [{ productId, quantity }] };
        }
        default:
            return { intent: 'add', items: [{ productId, quantity }] };
    }
}

/** Volver a agregar «Combo Palitos y bebida»: las dos líneas, y la promoción las vuelve a juntar. */
export function readdComboPayload(combo: ComboGroup): PjCartPayload {
    return { intent: 'add', items: combo.productIds.map((productId) => ({ productId, quantity: 1 })) };
}
