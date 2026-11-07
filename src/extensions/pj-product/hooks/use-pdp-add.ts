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
import { type RefObject, useCallback, useState } from 'react';
import { useRevalidator } from 'react-router';
import { useTranslation } from 'react-i18next';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { useShowAddedToast } from '@/extensions/pj-shared/lib/added-toast';
import type { PjCartPayload } from '../lib/cart-payload';
import type { SideProduct } from '../lib/upsell';
import { linesTotal } from '../lib/cart-lines';
import { flyToCart } from '../lib/cart-bump';
import { ensureFulfillment } from '../lib/fulfillment-request';
import { usePjCart } from './use-pj-cart';

/** Agregar con la tienda resuelta por el panel de TIE, aviso con puntos, «Deshacer» y «Ver mi pedido». */
export function useAddFlow({
    productName,
    imageSrc,
    heroRef,
}: {
    productName: string;
    imageSrc: string | null;
    heroRef: RefObject<HTMLElement | null>;
}): {
    add: (payload: PjCartPayload, total: number) => Promise<void>;
    busy: boolean;
    added: boolean;
    error: string | null;
    reset: () => void;
} {
    const { t } = useTranslation('extPjProduct');
    const me = usePjMe();
    const showAddedToast = useShowAddedToast();
    const revalidator = useRevalidator();
    const { submit, busy } = usePjCart();
    const [added, setAdded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const add = useCallback(
        async (payload: PjCartPayload, total: number) => {
            if (busy) return;
            // Sin tienda, el panel de TIE resuelve la modalidad y el agregado se retoma al confirmar.
            const outcome = await ensureFulfillment(productName, formatClp(total));
            if (outcome.status === 'cancelled') return;
            if (outcome.changed) void revalidator.revalidate();
            setError(null);
            const result = await submit(payload);
            if (!result.success || !result.basket) {
                setError(t('pdpx.error'));
                return;
            }
            const ids = result.addedItemIds ?? [];
            flyToCart(heroRef.current, imageSrc);
            setAdded(true);
            showAddedToast({
                productName,
                points: pointsFor(linesTotal(result.basket, ids), 0, me?.doublePoints ?? false),
                onUndo: ids.length
                    ? () => {
                          void submit({ intent: 'remove', itemIds: ids });
                          setAdded(false);
                      }
                    : undefined,
            });
        },
        [busy, productName, imageSrc, heroRef, revalidator, submit, t, showAddedToast, me?.doublePoints]
    );

    return { add, busy, added, error, reset: () => setAdded(false) };
}

/** Complementos marcados con su precio (el precio viene de la tarjeta, sin volver a pedirlo). */
export function useSideSelection(): {
    ids: string[];
    total: number;
    toggle: (side: SideProduct) => void;
} {
    const [ids, setIds] = useState<string[]>([]);
    const [prices, setPrices] = useState<Record<string, number>>({});
    const toggle = useCallback((side: SideProduct) => {
        setPrices((prev) => ({ ...prev, [side.productId]: side.price }));
        setIds((prev) =>
            prev.includes(side.productId) ? prev.filter((id) => id !== side.productId) : [...prev, side.productId]
        );
    }, []);
    return { ids, total: ids.reduce((sum, id) => sum + (prices[id] ?? 0), 0), toggle };
}
