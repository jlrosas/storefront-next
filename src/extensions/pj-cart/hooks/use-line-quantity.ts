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
import { useCallback, useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { useBasketUpdater } from '@/providers/basket';
import { resourceRoutes } from '@/route-paths';
import type { BasketActionResponse } from '@/routes/types/action-responses';

/**
 * Cantidad de una línea del carrito: «−», «+» y «Quitar» con las acciones del template (`cart-item-update`
 * conserva los extras y los atributos de la línea). Al volver, actualiza el carrito del contexto.
 */
export function useLineQuantity(itemId: string): {
    setQuantity: (quantity: number) => void;
    busy: boolean;
    failed: boolean;
    pending: number | null;
} {
    const fetcher = useFetcher<BasketActionResponse>();
    const updateBasket = useBasketUpdater();
    const handled = useRef<unknown>(null);
    const { submit, state, data, formData } = fetcher;

    useEffect(() => {
        if (state !== 'idle' || !data || handled.current === data) return;
        handled.current = data;
        if (data.success && data.basket) updateBasket(data.basket);
    }, [state, data, updateBasket]);

    const setQuantity = useCallback(
        (quantity: number) => {
            if (quantity <= 0) {
                void submit({ itemId }, { method: 'POST', action: resourceRoutes.cartItemRemove });
                return;
            }
            void submit(
                { itemId, quantity: String(quantity) },
                { method: 'PATCH', action: resourceRoutes.cartItemUpdate }
            );
        },
        [itemId, submit]
    );

    const pendingRaw = formData?.get('quantity');
    return {
        setQuantity,
        busy: state !== 'idle',
        failed: state === 'idle' && !!data && !data.success,
        pending: typeof pendingRaw === 'string' ? Number(pendingRaw) : formData ? 0 : null,
    };
}
