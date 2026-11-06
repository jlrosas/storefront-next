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
import { data } from 'react-router';
import type { ShopperBasketsV2 } from '@/scapi';
import { BasketAction, createBasketAction } from '@/lib/cart/basket-action.server';
import { createActionError } from '@/lib/action-error-helpers.server';
import { ErrorCode } from '@/lib/error-codes';
import { updateBasketResource } from '@/middlewares/basket.server';
import type { BasketActionResponse } from '@/routes/types/action-responses';
import { HALVES_PARTS, serializeHalves } from '../lib/halves';
import { parsePjCartPayload, type PjCartPayload } from '../lib/cart-payload';

type Basket = ShopperBasketsV2.schemas['Basket'];
type ProductItem = ShopperBasketsV2.schemas['ProductItem'];

function newItemIds(before: Basket, after: Basket): string[] {
    const known = new Set((before.productItems ?? []).map((item) => item.itemId));
    return (after.productItems ?? []).map((item) => item.itemId ?? '').filter((id) => id && !known.has(id));
}

/**
 * POST /action/pj-cart — carrito de la hoja, la ficha, «Hazlo combo» y el armador de mitades.
 *
 * - `pizza`: agrega (o con `itemId` actualiza en el lugar) una pizza con sus extras (`optionItems`
 *   `pjExtras_<id>` = `si`) y los ingredientes quitados en `c_pjRemoved`. Con `sides`, agrega los
 *   complementos en la misma llamada.
 * - `halves`: `pz-mitades-<tamaño>-<masa>` con `c_pjHalves` y `c_pjParts`. El precio (promedio) lo pone el
 *   hook del carrito; esta acción no lo calcula.
 * - `add`, `remove`, `swap`: productos simples («Hazlo combo», «O agrega por separado», sabor de la bebida).
 *
 * Responde `{ success, basket, addedItemIds }`.
 */
export const action = createBasketAction<PjCartPayload | null>(
    {
        method: 'POST',
        action: BasketAction.CartItemAdd,
        parse: (fd) => parsePjCartPayload(fd.get('payload')),
    },
    async ({ input, basket, basketId, context, clients, logger }) => {
        if (!input) {
            return data<BasketActionResponse>(
                {
                    success: false,
                    error: createActionError({ code: ErrorCode.INVALID_INPUT, message: 'Invalid pj-cart payload' }),
                },
                { status: 400 }
            );
        }
        const path = { basketId };
        let result: Basket = basket;
        let edited: string | null = null;

        switch (input.intent) {
            case 'pizza': {
                const custom = { c_pjRemoved: input.removed } as Record<string, unknown>;
                if (input.itemId) {
                    const { data: updated } = await clients.shopperBasketsV2.updateItemInBasket({
                        params: { path: { ...path, itemId: input.itemId } },
                        body: {
                            productId: input.productId,
                            quantity: input.quantity,
                            optionItems: input.optionItems,
                            ...custom,
                        } as ProductItem,
                    });
                    result = updated;
                    edited = input.itemId;
                }
                const items: ProductItem[] = [];
                if (!input.itemId) {
                    items.push({
                        productId: input.productId,
                        quantity: input.quantity,
                        optionItems: input.optionItems,
                        ...custom,
                    } as ProductItem);
                }
                for (const productId of input.sides ?? []) items.push({ productId, quantity: 1 });
                if (items.length) {
                    const { data: added } = await clients.shopperBasketsV2.addItemToBasket({
                        params: { path },
                        body: items,
                    });
                    result = added;
                }
                break;
            }
            case 'halves': {
                const custom = { c_pjHalves: serializeHalves(input.halves), c_pjParts: HALVES_PARTS } as Record<
                    string,
                    unknown
                >;
                if (input.itemId) {
                    const { data: updated } = await clients.shopperBasketsV2.updateItemInBasket({
                        params: { path: { ...path, itemId: input.itemId } },
                        body: { productId: input.productId, quantity: input.quantity, ...custom } as ProductItem,
                    });
                    result = updated;
                    edited = input.itemId;
                } else {
                    const { data: added } = await clients.shopperBasketsV2.addItemToBasket({
                        params: { path },
                        body: [{ productId: input.productId, quantity: input.quantity, ...custom } as ProductItem],
                    });
                    result = added;
                }
                break;
            }
            case 'add': {
                const { data: added } = await clients.shopperBasketsV2.addItemToBasket({
                    params: { path },
                    body: input.items,
                });
                result = added;
                break;
            }
            case 'remove': {
                for (const itemId of input.itemIds) {
                    if (!(result.productItems ?? []).some((item) => item.itemId === itemId)) continue;
                    const { data: removed } = await clients.shopperBasketsV2.removeItemFromBasket({
                        params: { path: { ...path, itemId } },
                    });
                    result = removed;
                }
                break;
            }
            case 'swap': {
                const existing = basket.productItems?.find((item) => item.itemId === input.itemId);
                const { data: updated } = await clients.shopperBasketsV2.updateItemInBasket({
                    params: { path: { ...path, itemId: input.itemId } },
                    body: { productId: input.productId, quantity: existing?.quantity ?? 1 },
                });
                result = updated;
                edited = input.itemId;
                break;
            }
            default:
                break;
        }

        updateBasketResource(context, result);
        const addedItemIds = [...(edited ? [edited] : []), ...newItemIds(basket, result)];
        logger.info('PjCart: succeeded', { intent: input.intent, addedItemIds });
        return data({ success: true, basket: result, addedItemIds } as BasketActionResponse);
    }
);
