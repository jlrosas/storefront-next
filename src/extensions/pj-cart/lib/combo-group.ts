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
import { COMBO_CART, missingInGroup, parseComboGroup } from '@/extensions/pj-product/lib/combo-cart';
import { EXTRA_OPTION_PREFIX } from '@/extensions/pj-product/lib/pizza';
import type { CartEntry, LineSummary } from './line-summary';

/** Un Super Dúo / Super Trío armado en el carrito (S-D20, §7.1). */
export interface ComboGroupSummary {
    group: string;
    comboId: string;
    /** «Super Dúo». */
    name: string;
    /** Precio del combo ($22.590 / $33.900). */
    price: number;
    /** Extras de sus pizzas (se cobran encima del combo). */
    extras: number;
    /** Lo que se muestra: precio del combo + extras si está completo; si no, lo que cobra la canasta. */
    total: number;
    /** Frente a las pizzas a precio normal (0 si el grupo está incompleto). */
    savings: number;
    /** Pizzas que faltan (si se quitó una por otra vía, el resto vuelve a precio normal). */
    missing: number;
    itemIds: string[];
    /** Sus pizzas tal como estaban (para «Deshacer» después de quitarlas). */
    lines: LineSummary[];
}

/**
 * Resumen de un grupo. Con dos Dúos iguales Commerce puede repartir el precio entre grupos de otra forma (§7.1), así
 * que el precio del grupo completo es siempre el del combo + sus extras, no la suma de sus líneas.
 */
export function summarizeComboGroup(lines: LineSummary[], names: Record<string, string>): ComboGroupSummary | null {
    const group = lines[0]?.comboGroup;
    const parsed = parseComboGroup(group);
    if (!group || !parsed) return null;
    const def = COMBO_CART[parsed.comboId];
    const extras = lines.reduce(
        (sum, line) => sum + line.extras.reduce((acc, extra) => acc + extra.price, 0) * line.quantity,
        0
    );
    const missing = missingInGroup(parsed.comboId, lines.length);
    const charged = lines.reduce((sum, line) => sum + line.total, 0);
    const base = lines.reduce((sum, line) => sum + line.baseTotal, 0);
    const total = missing === 0 ? def.price + extras : charged;
    return {
        group,
        comboId: parsed.comboId,
        name: names[parsed.comboId] ?? parsed.comboId,
        price: def.price,
        extras,
        total,
        savings: missing === 0 ? Math.max(0, base - total) : 0,
        missing,
        itemIds: lines.map((line) => line.itemId),
        lines,
    };
}

/** Bloque de la lista del carrito: una línea suelta o un combo armado con sus pizzas. */
export type CartBlock =
    | { type: 'entry'; entry: CartEntry }
    | { type: 'group'; group: ComboGroupSummary; entries: CartEntry[] };

/** Junta las pizzas del mismo `c_pjComboGroup` en un bloque, en el lugar de la primera. */
export function cartBlocks(entries: CartEntry[], names: Record<string, string>): CartBlock[] {
    const blocks: CartBlock[] = [];
    const seen = new Set<string>();
    for (const entry of entries) {
        const group = entry.summary.comboGroup;
        if (!group || !parseComboGroup(group)) {
            blocks.push({ type: 'entry', entry });
            continue;
        }
        if (seen.has(group)) continue;
        seen.add(group);
        const members = entries.filter((e) => e.summary.comboGroup === group);
        const summary = summarizeComboGroup(
            members.map((e) => e.summary),
            names
        );
        if (summary) blocks.push({ type: 'group', group: summary, entries: members });
        else members.forEach((e) => blocks.push({ type: 'entry', entry: e }));
    }
    return blocks;
}

/** «Deshacer» de «Quitaste Super Dúo»: vuelve a armar el combo con las mismas pizzas, extras y quitados. */
export function readdGroupPayload(group: ComboGroupSummary, lines: LineSummary[] = group.lines): PjCartPayload {
    return {
        intent: 'combo-pizzas',
        comboId: group.comboId,
        pizzas: lines.map((line) => ({
            productId: line.productId,
            optionItems: line.extras.map((extra) => ({
                optionId: `${EXTRA_OPTION_PREFIX}${extra.id}`,
                optionValueId: 'si',
            })),
            removed: line.removed.map((r) => r.id),
        })),
    };
}
