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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */
import { data } from 'react-router';
import type { Route } from './+types/resource.pj-me';
import { getAuth } from '@/middlewares/auth.server';
import { getCustomer } from '@/lib/api/customer.server';
import { getLogger } from '@/lib/logger.server';
import { getDemoProfile, type DemoProfile } from '@/extensions/pj-shared/lib/profile';

/** Resumen del cliente para el saludo del encabezado. */
export interface PjMe {
    registered: boolean;
    firstName: string | null;
    /** Saldo de Papa Puntos (`c_pjPoints`, S-D6). */
    points: number | null;
    /** Puntos dobles en el próximo pedido (`c_pjDoublePoints`). */
    doublePoints: boolean;
    profile: DemoProfile;
}

/**
 * GET /resource/pj-me — nombre y Papa Puntos del cliente con sesión (saludo del encabezado).
 * Sin sesión responde `registered: false` sin llamar a la API.
 */
export async function loader({ context }: Route.LoaderArgs) {
    const profile = getDemoProfile(context);
    const auth = getAuth(context);
    const empty: PjMe = { registered: false, firstName: null, points: null, doublePoints: false, profile };
    if (auth.userType !== 'registered' || !auth.customerId) {
        return data(empty, { headers: { 'Cache-Control': 'private, no-store' } });
    }
    try {
        const customer = (await getCustomer(context, auth.customerId)) as Record<string, unknown> & {
            firstName?: string;
        };
        const points = Number(customer.c_pjPoints);
        return data<PjMe>(
            {
                registered: true,
                firstName: customer.firstName ?? null,
                points: Number.isFinite(points) ? points : null,
                doublePoints: customer.c_pjDoublePoints === true,
                profile,
            },
            { headers: { 'Cache-Control': 'private, no-store' } }
        );
    } catch (error) {
        getLogger(context).warn('PjMe: customer fetch failed', { error });
        return data<PjMe>({ ...empty, registered: true }, { headers: { 'Cache-Control': 'private, no-store' } });
    }
}
