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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
import { useCallback, useEffect, useRef } from 'react';
import { useFetcher } from 'react-router';
import { useNavigate } from '@/hooks/use-navigate';
import { toast } from 'sonner';
import { flyToCart } from '@/extensions/pj-shared/lib/fly-to-cart';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { HomeAddedToast } from '../components/home-added-toast';
import { readFulfillmentFromDocument } from '@/extensions/pj-shared/lib/fulfillment';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { HOME_ROUTES } from '../lib/constants';

export const HOME_CART_ACTION = '/action/pj-home-cart';

interface CartResult {
    success?: boolean;
    basket?: { productTotal?: number; orderTotal?: number };
    error?: { code?: string; message?: string };
}

/**
 * «Repetir pedido» (HOM-03): carga el último pedido en el carrito y lleva directo al checkout.
 * Sin sesión de cliente, lleva al ingreso.
 */
export function useReorder() {
    const fetcher = useFetcher<CartResult>();
    const navigate = useNavigate();
    const handled = useRef<CartResult | null>(null);

    useEffect(() => {
        const result = fetcher.data;
        if (!result || handled.current === result) return;
        handled.current = result;
        if (result.success) void navigate(HOME_ROUTES.checkout);
        else if (result.error?.code === 'NOT_AUTHENTICATED') void navigate(HOME_ROUTES.login);
    }, [fetcher.data, navigate]);

    const reorder = useCallback(() => {
        void fetcher.submit({ intent: 'reorder' }, { method: 'POST', action: HOME_CART_ACTION });
    }, [fetcher]);

    return {
        reorder,
        pending: fetcher.state !== 'idle',
        failed: fetcher.data?.success === false && fetcher.data.error?.code !== 'NOT_AUTHENTICATED',
    };
}

/** Agrega varias líneas con el aviso «¡Agregada!» (HOM-02, «Para 3»). */
export function useAddLines(productName: string) {
    const fetcher = useFetcher<CartResult>();
    const handled = useRef<CartResult | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const result = fetcher.data;
        if (!result || handled.current === result) return;
        handled.current = result;
        if (result.success) {
            void flyToCart();
            const total = result.basket?.productTotal ?? result.basket?.orderTotal ?? 0;
            toast.custom(
                (id) => (
                    <HomeAddedToast
                        productName={productName}
                        points={pointsFor(total)}
                        onView={() => {
                            toast.dismiss(id);
                            void navigate(PJ_ROUTES.cart);
                        }}
                    />
                ),
                { duration: 6000 }
            );
        }
    }, [fetcher.data, productName, navigate]);

    const submit = useCallback(
        (lines: { productId: string; quantity: number }[]) => {
            void fetcher.submit(
                { intent: 'add', lines: JSON.stringify(lines) },
                { method: 'POST', action: HOME_CART_ACTION }
            );
        },
        [fetcher]
    );

    /**
     * Sin tienda elegida pide el panel de TIE (evento \`pj:open-fulfillment\`, mismo contrato que OFE) y
     * agrega al confirmar; si el panel se cierra no agrega; si nadie lo toma, agrega igual.
     */
    const add = useCallback(
        (lines: { productId: string; quantity: number }[]) => {
            if (readFulfillmentFromDocument()) {
                submit(lines);
                return;
            }
            const taken = !window.dispatchEvent(
                new CustomEvent('pj:open-fulfillment', {
                    cancelable: true,
                    detail: { source: 'pj-home', reason: 'add-to-cart' },
                })
            );
            if (!taken) {
                submit(lines);
                return;
            }
            const cleanup = () => {
                window.removeEventListener('pj:fulfillment-changed', onChanged);
                window.removeEventListener('pj:fulfillment-dismissed', cleanup);
            };
            const onChanged = () => {
                cleanup();
                submit(lines);
            };
            window.addEventListener('pj:fulfillment-changed', onChanged);
            window.addEventListener('pj:fulfillment-dismissed', cleanup);
        },
        [submit]
    );
    return { add, pending: fetcher.state !== 'idle', failed: fetcher.data?.success === false };
}
