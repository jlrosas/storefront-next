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
import { fetchProductById } from '@/lib/api/products.server';
import { parseComboSlots, validateComboChoices } from '../lib/combo-pdp';
import {
    COMBO_CART,
    COMBO_CRUSTS,
    COMBO_FOR_ATTRIBUTE,
    COMBO_GROUP_ATTRIBUTE,
    COMBO_OPTION_ID,
    comboLineAttributes,
    comboOptionItem,
    groupItemIds,
    isComboCart,
    newComboGroup,
} from '../lib/combo-cart';
import { parseVariantId } from '@/extensions/pj-cart/lib/line-summary';

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
 * - `combo`: combo con ficha (PRO-08) con sus elecciones en `c_pjComboChoices` (texto JSON
 *   `[{"slot","product"}]`, validadas contra `c_pjSlots`) y los complementos marcados, en una sola llamada.
 * - `combo-pizzas` (S-D20, §7.1): Super Dúo / Super Trío como pizzas normales con `pjCombo` y `c_pjComboGroup`.
 * - `combo-remove`: quita todas las pizzas de un combo armado.
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
        let comboApplied: boolean | undefined;
        let comboGroup: string | null | undefined;

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
            case 'combo': {
                const combo = (await fetchProductById(context, input.productId)) as { c_pjSlots?: unknown } | null;
                const slots = parseComboSlots(combo?.c_pjSlots);
                if (!combo || slots.length === 0 || !validateComboChoices(slots, input.choices)) {
                    logger.warn('PjCart: combo choices do not match the slots', { productId: input.productId });
                    return data<BasketActionResponse>(
                        {
                            success: false,
                            error: createActionError({
                                code: ErrorCode.INVALID_INPUT,
                                message: 'Combo choices do not match the combo slots',
                            }),
                        },
                        { status: 400 }
                    );
                }
                const items: ProductItem[] = [
                    {
                        productId: input.productId,
                        quantity: input.quantity,
                        c_pjComboChoices: JSON.stringify(input.choices),
                    } as ProductItem,
                    ...(input.sides ?? []).map((productId) => ({ productId, quantity: 1 })),
                ];
                const { data: added } = await clients.shopperBasketsV2.addItemToBasket({
                    params: { path },
                    body: items,
                });
                result = added;
                break;
            }
            case 'combo-pizzas': {
                const combo = (await fetchProductById(context, input.comboId)) as { c_pjSlots?: unknown } | null;
                const slots = parseComboSlots(combo?.c_pjSlots).filter((slot) => slot.kind === 'pizza');
                const choices = input.pizzas.map((pizza, index) => ({
                    slot: slots[index]?.id ?? '',
                    product: pizza.productId,
                }));
                const crustsOk = input.pizzas.every((pizza) =>
                    COMBO_CRUSTS.includes(parseVariantId(pizza.productId)?.crust ?? '')
                );
                if (
                    !combo ||
                    !isComboCart(input.comboId) ||
                    slots.length !== input.pizzas.length ||
                    !crustsOk ||
                    !validateComboChoices(slots, choices)
                ) {
                    logger.warn('PjCart: combo pizzas do not match the slots', { comboId: input.comboId });
                    return data<BasketActionResponse>(
                        {
                            success: false,
                            error: createActionError({
                                code: ErrorCode.INVALID_INPUT,
                                message: 'Combo pizzas do not match the combo slots',
                            }),
                        },
                        { status: 400 }
                    );
                }
                const group = newComboGroup(input.comboId);
                const marker = comboOptionItem(input.comboId);
                const lines = (withGroup: boolean) =>
                    input.pizzas.map(
                        (pizza) =>
                            ({
                                productId: pizza.productId,
                                quantity: 1,
                                // §7.1: `pjCombo` activa la promoción del combo; los extras van en `si` encima.
                                optionItems: [
                                    ...(marker ? [marker] : []),
                                    ...pizza.optionItems.filter((o) => o.optionId !== COMBO_OPTION_ID),
                                ],
                                c_pjRemoved: pizza.removed,
                                ...(withGroup ? comboLineAttributes(group) : {}),
                            }) as unknown as ProductItem
                    );
                try {
                    ({ data: result } = await clients.shopperBasketsV2.addItemToBasket({
                        params: { path },
                        body: lines(true),
                    }));
                    comboGroup = group;
                } catch (error) {
                    // Sin el atributo de DAT-11 en el sandbox, las pizzas entran igual (sin agrupar en el carrito).
                    logger.warn('PjCart: combo group attribute rejected, adding without it', {
                        attribute: COMBO_GROUP_ATTRIBUTE,
                        error: String(error),
                    });
                    ({ data: result } = await clients.shopperBasketsV2.addItemToBasket({
                        params: { path },
                        body: lines(false),
                    }));
                    comboGroup = null;
                }
                const promotionId = COMBO_CART[input.comboId]?.promotionId;
                const fresh = new Set(newItemIds(basket, result));
                comboApplied = (result.productItems ?? [])
                    .filter((item) => fresh.has(item.itemId ?? ''))
                    .every((item) => (item.priceAdjustments ?? []).some((a) => a.promotionId === promotionId));
                break;
            }
            case 'combo-remove': {
                // §7.1: se quitan todas las líneas del grupo (una sola dejaría a la otra a precio normal).
                for (const itemId of groupItemIds(result, input.group)) {
                    const { data: removed } = await clients.shopperBasketsV2.removeItemFromBasket({
                        params: { path: { ...path, itemId } },
                    });
                    result = removed;
                }
                break;
            }
            case 'add': {
                const comboFor = input.comboFor ? { [COMBO_FOR_ATTRIBUTE]: input.comboFor } : {};
                const { data: added } = await clients.shopperBasketsV2.addItemToBasket({
                    params: { path },
                    body: input.items.map((item) => ({ ...item, ...comboFor }) as ProductItem),
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
        return data({
            success: true,
            basket: result,
            addedItemIds,
            ...(comboApplied !== undefined ? { comboApplied } : {}),
            ...(comboGroup !== undefined ? { comboGroup } : {}),
        } as BasketActionResponse);
    }
);
