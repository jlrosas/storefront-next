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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useBasket, useBasketError, useBasketHydrated, useBasketSnapshot, useBasketUpdater } from '@/providers/basket';
import { resourceRoutes } from '@/route-paths';
import type { BasketActionResponse } from '@/routes/types/action-responses';
import { useNavigate } from '@/hooks/use-navigate';
import { formatClp } from '@/extensions/pj-shared';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { MenuAddedToast } from '../components/menu-added-toast';
import { ensureStore } from '../lib/menu-bridge';

/** Tope por línea, como en el lienzo (Simple-Add). */
export const MAX_LINE_QUANTITY = 9;
const UPDATE_DEBOUNCE_MS = 250;

export interface UseCartLineArgs {
    /** ID del producto simple o de la variante (la opción elegida). */
    productId: string;
    /** Nombre que se muestra en el aviso: «Coca-Cola 1,5 L». */
    name: string;
    /** Precio unitario, para los puntos del aviso. */
    price: number;
}

export interface CartLine {
    quantity: number;
    /** Todavía no se sabe qué hay en el carrito (se está cargando): se desactivan los botones. */
    resolving: boolean;
    increment: () => void;
    decrement: () => void;
}

/**
 * «+» y contador (− N +) de un producto simple (MEN-02). Lleva la cantidad deseada a la del
 * carrito con una sola petición a la vez (agrega, cambia la cantidad o quita la línea), muestra la
 * cantidad al instante y avisa con `AddedToast` cada vez que sube. Con `AllowRepeats` del sitio
 * un producto puede tener varias líneas: se suman y se modifica la primera.
 */
export function useCartLine({ productId, name }: UseCartLineArgs): CartLine {
    const { t } = useTranslation('extPjMenu');
    const basket = useBasket();
    const snapshot = useBasketSnapshot();
    const hydrated = useBasketHydrated();
    const basketError = useBasketError();
    const updateBasket = useBasketUpdater();
    const fetcher = useFetcher<BasketActionResponse>();
    const navigate = useNavigate();

    const lines = useMemo(
        () => (basket?.productItems ?? []).filter((item) => item.productId === productId),
        [basket, productId]
    );
    const basketQuantity = lines.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
    const resolving = Boolean(snapshot?.basketId) && !basket && !(hydrated && basketError?.length);

    const [target, setTarget] = useState<number | null>(null);
    const [settling, setSettling] = useState(false);
    const basketQuantityRef = useRef(basketQuantity);
    basketQuantityRef.current = basketQuantity;
    const sentRef = useRef<{ increase: boolean; previous: number } | null>(null);
    const handledRef = useRef<unknown>(null);

    const quantity = target ?? basketQuantity;

    // Lleva el carrito a la cantidad deseada, de a una petición.
    useEffect(() => {
        if (target === null) return;
        if (settling || fetcher.state !== 'idle') return;
        if (target === basketQuantity) {
            setTarget(null);
            return;
        }
        if (resolving) return;
        const delay = basketQuantity === 0 ? 0 : UPDATE_DEBOUNCE_MS;
        const timer = setTimeout(() => {
            sentRef.current = { increase: target > basketQuantity, previous: basketQuantity };
            setSettling(true);
            const first = lines[0];
            if (basketQuantity === 0) {
                void fetcher.submit(
                    { productItem: JSON.stringify({ productId, quantity: target }) },
                    { method: 'POST', action: resourceRoutes.cartItemAdd }
                );
            } else if (target === 0 && first?.itemId) {
                void fetcher.submit(
                    { itemId: first.itemId },
                    { method: 'POST', action: resourceRoutes.cartItemRemove }
                );
            } else if (first?.itemId) {
                const others = basketQuantity - (first.quantity ?? 1);
                void fetcher.submit(
                    { itemId: first.itemId, quantity: String(Math.max(1, target - others)) },
                    { method: 'PATCH', action: resourceRoutes.cartItemUpdate }
                );
            }
        }, delay);
        return () => clearTimeout(timer);
    }, [target, basketQuantity, settling, resolving, fetcher, lines, productId]);

    // Recibe la respuesta: actualiza el carrito del contexto y avisa.
    useEffect(() => {
        const result = fetcher.data;
        if (fetcher.state !== 'idle' || !result || handledRef.current === result) return;
        handledRef.current = result;
        const sent = sentRef.current;
        sentRef.current = null;
        if (result.success && result.basket) {
            updateBasket(result.basket);
            if (sent?.increase) {
                const total = result.basket.productTotal ?? result.basket.productSubTotal ?? 0;
                toast.custom(
                    (id) => (
                        <MenuAddedToast
                            name={t('toast.line', { name, total: formatClp(total) })}
                            onView={() => {
                                toast.dismiss(id);
                                void navigate(PJ_ROUTES.cart);
                            }}
                        />
                    ),
                    { duration: 6000 }
                );
            }
        } else {
            setTarget(null);
            toast.error(t('toast.failed'));
        }
        setSettling(false);
    }, [fetcher.data, fetcher.state, updateBasket, t, name, navigate]);

    const increment = useCallback(() => {
        void (async () => {
            if (basketQuantityRef.current === 0 && !(await ensureStore())) return;
            setTarget((previous) => Math.min(MAX_LINE_QUANTITY, (previous ?? basketQuantityRef.current) + 1));
        })();
    }, []);

    const decrement = useCallback(() => {
        setTarget((previous) => Math.max(0, (previous ?? basketQuantityRef.current) - 1));
    }, []);

    return { quantity, resolving, increment, decrement };
}
