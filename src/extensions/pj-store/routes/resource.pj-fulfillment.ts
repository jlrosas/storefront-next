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
/** @sfdc-extension-file SFDC_EXT_PJ_STORE */
import { data } from 'react-router';
import type { Route } from './+types/resource.pj-fulfillment';
import { getAuth } from '@/middlewares/auth.server';
import { getCustomer, updateCustomerCustomAttributes } from '@/lib/api/customer.server';
import { getLogger } from '@/lib/logger.server';
import { normalizeFulfillment, type Fulfillment } from '@/extensions/pj-shared/lib/fulfillment';

/** Atributo del cliente donde se guarda la preferencia (JSON de `pj_fulfillment`). Pedido a DAT. */
export const FULFILLMENT_PREFERENCE_ATTRIBUTE = 'c_pjFulfillment';

const NO_STORE = { 'Cache-Control': 'private, no-store' };

/** GET /resource/pj-fulfillment: la preferencia guardada del cliente con sesión (o `null`). */
export async function loader({ context }: Route.LoaderArgs) {
    const auth = getAuth(context);
    if (auth.userType !== 'registered' || !auth.customerId) {
        return data<{ fulfillment: Fulfillment | null }>({ fulfillment: null }, { headers: NO_STORE });
    }
    try {
        const customer = (await getCustomer(context, auth.customerId)) as Record<string, unknown>;
        const raw = customer[FULFILLMENT_PREFERENCE_ATTRIBUTE];
        const fulfillment = typeof raw === 'string' ? normalizeFulfillment(JSON.parse(raw)) : null;
        return data({ fulfillment }, { headers: NO_STORE });
    } catch (error) {
        getLogger(context).warn('PjFulfillment: no se pudo leer la preferencia', { error });
        return data<{ fulfillment: Fulfillment | null }>({ fulfillment: null }, { headers: NO_STORE });
    }
}

/**
 * POST /resource/pj-fulfillment: guarda la preferencia en el perfil del cliente con sesión.
 * Es de mejor esfuerzo: la cookie `pj_fulfillment` manda y esto solo la recuerda entre dispositivos.
 */
export async function action({ request, context }: Route.ActionArgs) {
    const auth = getAuth(context);
    if (auth.userType !== 'registered' || !auth.customerId) {
        return data({ saved: false }, { headers: NO_STORE });
    }
    const body = (await request.json().catch(() => null)) as unknown;
    const fulfillment = normalizeFulfillment(body);
    if (!fulfillment) {
        return data({ saved: false }, { status: 400, headers: NO_STORE });
    }
    const saved = await updateCustomerCustomAttributes(context, auth.customerId, {
        [FULFILLMENT_PREFERENCE_ATTRIBUTE]: JSON.stringify(fulfillment),
    });
    return data({ saved }, { headers: NO_STORE });
}
