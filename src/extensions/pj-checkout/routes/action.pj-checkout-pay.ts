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
/** @sfdc-extension-file SFDC_EXT_PJ_CHECKOUT */
import { data, redirect } from 'react-router';
import type { Route } from './+types/action.pj-checkout-pay';
import { getLogger } from '@/lib/logger.server';
import { PJ_CANJE_COOKIE } from '@/extensions/pj-cart/lib/canje';
import { placePjOrder, readPayFields } from '../lib/pay.server';
import type { PayFailure } from '../lib/types';

/**
 * POST /action/pj-checkout-pay — «Pagar · $X» del checkout de Papa Johns. Crea el pedido y redirige a la
 * confirmación (borrando el canje del carrito); si no se puede, responde `{ success: false, code }` y la canasta
 * queda como estaba para reintentar.
 */
export async function action({ request, context }: Route.ActionArgs) {
    const fields = readPayFields(await request.formData());
    try {
        const result = await placePjOrder(context, request, fields);
        if (result.success) {
            return redirect(result.url, {
                headers: { 'Set-Cookie': `${PJ_CANJE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax` },
            });
        }
        return data<PayFailure>(result, { status: result.code === 'total' ? 409 : 400 });
    } catch (error) {
        getLogger(context).error('PjCheckout: pay failed', { error });
        return data<PayFailure>({ success: false, code: 'error' }, { status: 500 });
    }
}
