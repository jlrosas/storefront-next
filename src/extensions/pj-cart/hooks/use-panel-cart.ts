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
import { useEffect, useMemo, useState } from 'react';
import { readFulfillmentFromDocument } from '@/extensions/pj-shared/lib/fulfillment';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { cartTotals, type CanjeState, type CartTotals } from '../lib/cart-model';
import { readCanjeCookie } from '../lib/canje';
import type { CartEntry, LineProducts, SummaryLineItem } from '../lib/line-summary';
import { useLineSummaries } from './use-line-summaries';

/**
 * Lo que necesita el panel «Tu pedido» del menú para leer el pedido igual que `/cart` (VAL-C3 H-2): las mismas
 * líneas, el canje de la cookie `pj_canje` (la pizza a $0) y los mismos totales y puntos (`cartTotals`).
 */
export function usePanelCart(items: SummaryLineItem[]): {
    entries: CartEntry[];
    products: LineProducts;
    canje: CanjeState | null;
    totals: CartTotals;
} {
    const me = usePjMe();
    // La cookie y la modalidad solo existen en el navegador: se leen al montar y cuando cambia la canasta.
    const [cookie, setCookie] = useState<{ canje: CanjeState | null; delivery: boolean }>({
        canje: null,
        delivery: false,
    });
    const itemKey = items.map((item) => item.itemId).join(',');
    useEffect(() => {
        setCookie({
            canje: readCanjeCookie(document.cookie),
            delivery: readFulfillmentFromDocument()?.mode === 'delivery',
        });
    }, [itemKey]);
    const canje = cookie.canje && items.some((item) => item.itemId === cookie.canje?.itemId) ? cookie.canje : null;
    const ignore = useMemo(() => (canje ? [canje.itemId] : []), [canje]);
    const { summaries, entries, products } = useLineSummaries(items, undefined, ignore);
    const totals = cartTotals(summaries, {
        delivery: cookie.delivery,
        doublePoints: me?.doublePoints ?? false,
        canje,
    });
    return { entries, products, canje, totals };
}
