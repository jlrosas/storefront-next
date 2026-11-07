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
import { useCallback } from 'react';
import { usePjCart } from '@/extensions/pj-product/hooks/use-pj-cart';
import type { CanjeState } from '../lib/cart-model';
import { writeCanjeCookie } from '../lib/canje';

/** Pizza que se canjea: variante que entra al pedido, sus puntos y su precio de catálogo. */
export interface CanjeProduct {
    productId: string;
    points: number;
    price: number;
}

/**
 * Canje de Papa Puntos (CAR-02, UX-3 §3.6): agrega la pizza al pedido y guarda el canje en la cookie `pj_canje`,
 * que leen el carrito y el checkout. Lo usan el bloque de puntos del carrito y la página `/puntos` (CTA).
 * Devuelve el canje guardado, o `null` si el pedido no aceptó la pizza.
 */
export function useCanje(): {
    redeem: (product: CanjeProduct) => Promise<CanjeState | null>;
    undo: (canje: CanjeState) => Promise<boolean>;
    busy: boolean;
} {
    const { submit, busy } = usePjCart();

    const redeem = useCallback(
        async (product: CanjeProduct) => {
            const result = await submit({ intent: 'add', items: [{ productId: product.productId, quantity: 1 }] });
            const itemId = result.addedItemIds?.[0];
            if (!result.success || !itemId) return null;
            const next: CanjeState = {
                itemId,
                productId: product.productId,
                points: product.points,
                value: product.price,
            };
            writeCanjeCookie(next);
            return next;
        },
        [submit]
    );

    const undo = useCallback(
        async (canje: CanjeState) => {
            const result = await submit({ intent: 'remove', itemIds: [canje.itemId] });
            if (!result.success) return false;
            writeCanjeCookie(null);
            return true;
        },
        [submit]
    );

    return { redeem, undo, busy };
}
