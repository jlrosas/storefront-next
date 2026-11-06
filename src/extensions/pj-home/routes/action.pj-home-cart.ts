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
import { data } from 'react-router';
import { BasketAction, createBasketAction } from '@/lib/cart/basket-action.server';
import { createActionError } from '@/lib/action-error-helpers.server';
import { ErrorCode } from '@/lib/error-codes';
import { getAuth } from '@/middlewares/auth.server';

/** Una línea que se agrega al pedido; los atributos `c_pj*` viajan con la línea (CONTRATO §4.1 y §7). */
interface LineInput {
    productId: string;
    quantity: number;
    [attribute: string]: unknown;
}

type Input = { intent: 'add'; lines: LineInput[] } | { intent: 'reorder' } | null;

/**
 * Acciones de carrito de la Home (HOM):
 * - `add`: agrega varias líneas a la vez («Para 3»: Pizza del Mes + Palitos + bebida).
 * - `reorder`: «Repetir pedido» de Sofía; reemplaza el carrito por las líneas de su último pedido
 *   (con sus atributos, como «sin cebolla») para ir directo al checkout.
 */
export const action = createBasketAction(
    {
        method: 'POST',
        action: BasketAction.CartItemAdd,
        parse: (fd): Input => {
            const intent = fd.get('intent');
            if (intent === 'reorder') return { intent };
            if (intent === 'add') {
                const lines = JSON.parse(String(fd.get('lines') ?? '[]')) as LineInput[];
                return { intent, lines };
            }
            return null;
        },
    },
    async ({ input, basket, basketId, clients, context, logger }) => {
        if (!input) {
            return data(
                { success: false, error: createActionError({ code: ErrorCode.INVALID_INPUT, message: 'intent' }) },
                { status: 400 }
            );
        }

        let lines: LineInput[];
        if (input.intent === 'add') {
            lines = input.lines.filter((l) => typeof l.productId === 'string' && l.quantity > 0);
        } else {
            const auth = getAuth(context);
            if (auth.userType !== 'registered' || !auth.customerId) {
                return data(
                    {
                        success: false,
                        error: createActionError({
                            code: ErrorCode.NOT_AUTHENTICATED,
                            message: 'Ingresa para repetir tu pedido',
                        }),
                    },
                    { status: 401 }
                );
            }
            const { data: orders } = await clients.shopperCustomers.getCustomerOrders({
                params: { path: { customerId: auth.customerId }, query: { limit: 50 } },
            });
            const placed = (o: Record<string, unknown>) => String(o.c_pjPlacedAt ?? o.creationDate ?? '');
            const last = ((orders?.data ?? []) as unknown as Record<string, unknown>[])
                .filter((o) => o.status !== 'cancelled' && o.status !== 'failed')
                .sort((a, b) => placed(b).localeCompare(placed(a)))[0];
            const items = (last?.productItems ?? []) as Record<string, unknown>[];
            lines = items.map((item) => {
                const line: LineInput = { productId: String(item.productId), quantity: Number(item.quantity ?? 1) };
                for (const [key, value] of Object.entries(item)) {
                    if (key.startsWith('c_') && value !== null && value !== undefined) line[key] = value;
                }
                return line;
            });
            // Repetir = el pedido de siempre, no sumado a lo que hubiera en el carrito.
            for (const existing of basket.productItems ?? []) {
                if (existing.itemId) {
                    await clients.shopperBasketsV2.removeItemFromBasket({
                        params: { path: { basketId, itemId: existing.itemId } },
                    });
                }
            }
        }

        if (lines.length === 0) {
            return data(
                { success: false, error: createActionError({ code: ErrorCode.INVALID_INPUT, message: 'Sin líneas' }) },
                { status: 400 }
            );
        }
        logger.debug('PjHomeCart: adding lines', { intent: input.intent, count: lines.length });
        const { data: updated } = await clients.shopperBasketsV2.addItemToBasket({
            params: { path: { basketId } },
            body: lines.map((line) => ({ ...line, shipmentId: 'me' })) as never,
        });
        return updated;
    }
);
