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
import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { useShowAddedToast } from '@/extensions/pj-shared/lib/added-toast';
import { usePjCart } from '@/extensions/pj-product/hooks/use-pj-cart';
import { useImageUrl } from '@/extensions/pj-product/hooks/use-image-url';
import { PlusIcon } from '@/extensions/pj-product/components/icons';
import { cn } from '@/lib/utils';
import type { CartRecommendationItem } from '../lib/cart-model';

export interface CartRecommendationsProps {
    items: CartRecommendationItem[];
}

/**
 * «¿Le sumamos algo?» (S-D19): una sola sección con hasta tres recomendaciones —una bebida, un acompañamiento y un
 * postre, solo lo que falta en el pedido y nunca pizzas—. El «+» agrega sin salir del carrito, con el aviso de
 * siempre (puntos y «Deshacer»); la tarjeta agregada desaparece porque la regla deja de ofrecer ese tipo.
 */
export function CartRecommendations({ items }: CartRecommendationsProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { url } = useImageUrl();
    const me = usePjMe();
    const showAdded = useShowAddedToast();
    const { submit, busy } = usePjCart();
    const [pending, setPending] = useState<string | null>(null);

    const add = async (item: CartRecommendationItem) => {
        if (busy) return;
        setPending(item.productId);
        const result = await submit({ intent: 'add', items: [{ productId: item.productId, quantity: 1 }] });
        setPending(null);
        if (!result.success) return;
        const ids = result.addedItemIds ?? [];
        showAdded({
            productName: item.name,
            points: pointsFor(item.price, 0, me?.doublePoints ?? false),
            onUndo: ids.length ? () => void submit({ intent: 'remove', itemIds: ids }) : undefined,
        });
    };

    return (
        <section
            aria-labelledby="pj-cart-recs-title"
            data-testid="pj-cart-recommendations"
            className="flex flex-col gap-3 rounded-pj-card bg-pj-surface p-4 shadow-pj-card lg:p-5">
            <h2 id="pj-cart-recs-title" className="pj-card-title m-0 text-pj-heading">
                {t('recs.title')}
            </h2>
            <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0 lg:gap-4">
                {items.map((item) => (
                    <li
                        key={item.productId}
                        className="flex min-w-0 flex-col gap-1.5"
                        data-testid="pj-cart-rec"
                        data-kind={item.kind}>
                        <div className="relative">
                            {item.image ? (
                                <FoodImage
                                    src={url(item.image, 320) ?? item.image}
                                    alt=""
                                    crop="none"
                                    aspect="1/1"
                                    sizes="(min-width: 1024px) 200px, 30vw"
                                    className="w-full rounded-pj-card bg-pj-dough"
                                />
                            ) : (
                                <div className="aspect-square w-full rounded-pj-card bg-pj-sand" aria-hidden="true" />
                            )}
                            <button
                                type="button"
                                disabled={busy}
                                onClick={() => void add(item)}
                                aria-label={t('offer.add', { name: item.name, price: formatClp(item.price) })}
                                data-testid="pj-cart-rec-add"
                                className={cn(
                                    'absolute right-1 bottom-1 flex size-11 items-center justify-center rounded-full bg-pj-pepperoncini text-pj-basil shadow-pj-card',
                                    pending === item.productId && 'opacity-60'
                                )}>
                                <PlusIcon width={20} height={20} aria-hidden="true" />
                            </button>
                        </div>
                        <p className="m-0 text-xs font-bold tracking-wide text-pj-gray-strong uppercase">
                            {t(`recs.kind.${item.kind}`)}
                        </p>
                        <p className="m-0 line-clamp-2 text-sm leading-tight font-bold text-pj-ink lg:text-base">
                            {item.name}
                        </p>
                        <p className="m-0 text-sm text-pj-ink tabular-nums">{formatClp(item.price)}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default CartRecommendations;
