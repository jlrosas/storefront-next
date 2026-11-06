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
import { useCallback, useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { useBasketUpdater } from '@/providers/basket';
import { PJ_CART_ACTION, type PjCartPayload, type PjCartResult } from '../lib/cart-payload';
import { bumpCartCounters } from '../lib/cart-bump';

/**
 * Mutaciones del carrito de PRO con `useFetcher` (no navegan). `submit` devuelve una promesa con el
 * resultado; al terminar bien actualiza el carrito del contexto (contador del encabezado y de la barra
 * inferior) y hace saltar el contador.
 */
export function usePjCart(): { submit: (payload: PjCartPayload) => Promise<PjCartResult>; busy: boolean } {
    const fetcher = useFetcher<PjCartResult>();
    const setBasket = useBasketUpdater();
    const pending = useRef<((result: PjCartResult) => void) | null>(null);
    const { state, data } = fetcher;

    useEffect(() => {
        if (state !== 'idle' || !pending.current) return;
        const resolve = pending.current;
        pending.current = null;
        const result: PjCartResult = data ?? { success: false };
        if (result.success && result.basket) {
            setBasket(result.basket);
            bumpCartCounters();
        }
        resolve(result);
    }, [state, data, setBasket]);

    const { submit: fetcherSubmit } = fetcher;
    const submit = useCallback(
        (payload: PjCartPayload) =>
            new Promise<PjCartResult>((resolve) => {
                pending.current = resolve;
                void fetcherSubmit({ payload: JSON.stringify(payload) }, { method: 'POST', action: PJ_CART_ACTION });
            }),
        [fetcherSubmit]
    );

    return { submit, busy: state !== 'idle' };
}
