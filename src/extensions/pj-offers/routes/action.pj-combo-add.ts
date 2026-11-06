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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import { data } from 'react-router';
import { BasketAction, createBasketAction } from '@/lib/cart/basket-action.server';
import { createActionError } from '@/lib/action-error-helpers.server';
import { ErrorCode } from '@/lib/error-codes';
import { fetchProductById } from '@/lib/api/products.server';
import { parseSlots } from '../lib/offers';
import { validateChoices } from '../lib/combo';

/**
 * Agrega un combo armado al carrito (OFE-02): el producto `cb-*` a su precio fijo y las
 * elecciones en el atributo de la línea `c_pjComboChoices` (CONTRATO §7). El sitio permite
 * líneas repetidas (`AllowRepeats`), así que cada combo armado es su propia línea.
 *
 * Form data: `productId` (cb-*), `choices` (JSON `[{slot, product}]`).
 */
export const action = createBasketAction(
    {
        method: 'POST',
        action: BasketAction.CartItemAdd,
        parse: (fd) => ({
            productId: String(fd.get('productId') ?? ''),
            choices: String(fd.get('choices') ?? ''),
        }),
    },
    async ({ input, basketId, clients, context, logger }) => {
        const fail = (status: number, code: (typeof ErrorCode)[keyof typeof ErrorCode], message: string) =>
            data({ success: false, error: createActionError({ code, message }) }, { status });

        if (!input.productId.startsWith('cb-')) {
            return fail(400, ErrorCode.INVALID_INPUT, 'productId must be a combo (cb-*)');
        }
        let choices: unknown;
        try {
            choices = JSON.parse(input.choices);
        } catch {
            return fail(400, ErrorCode.INVALID_INPUT, 'choices must be valid JSON');
        }

        const product = (await fetchProductById(context, input.productId)) as { c_pjSlots?: unknown } | null;
        const slots = parseSlots(product?.c_pjSlots);
        if (!product || slots.length === 0 || !validateChoices(slots, choices)) {
            logger.warn('PjComboAdd: choices do not match the combo slots', { productId: input.productId });
            return fail(400, ErrorCode.INVALID_INPUT, 'choices do not match the combo slots');
        }

        const { data: basket } = await clients.shopperBasketsV2.addItemToBasket({
            params: { path: { basketId } },
            body: [
                {
                    productId: input.productId,
                    quantity: 1,
                    shipmentId: 'me',
                    c_pjComboChoices: JSON.stringify(choices),
                } as never,
            ],
        });
        return basket;
    }
);
