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
/** @sfdc-extension-file SFDC_EXT_PJ_ACCOUNT */
import type { LoaderFunctionArgs } from 'react-router';
import type { ShopperProducts } from '@/scapi';
import { getAuth } from '@/middlewares/auth.server';
import { getCustomer } from '@/lib/api/customer.server';
import { fetchProductsByIds } from '@/lib/api/products.server';
import { getLogger } from '@/lib/logger.server';
import { getDemoProfile, pjDemoContext } from '@/extensions/pj-shared/lib/profile';
import { primaryImage } from '@/extensions/pj-product/lib/pizza.server';
import { displayProductName } from '@/extensions/pj-cart/lib/line-summary';
import { CANJE_PRODUCT } from '@/extensions/pj-cart/lib/canje';
import { demoMember, sessionMember, type PjMember } from './member';

type Context = LoaderFunctionArgs['context'];

/** Pizza canjeable que ofrece `/puntos` (la misma del carrito: CAR, `CANJE_PRODUCT`). */
export interface RedeemOffer {
    /** Variante que entra al pedido (mediana tradicional). */
    productId: string;
    name: string;
    image: string | null;
    /** Precio de catálogo de la mediana («vale $13.000»). */
    price: number;
    points: number;
}

/**
 * El socio que mira la página: el cliente con sesión, o el de demo del perfil forzado (`?perfil=`), o `null`.
 * Si la API del cliente falla con sesión, cae al perfil (la página nunca se rompe por el saldo).
 */
export async function loadPjMember(context: Context): Promise<PjMember | null> {
    const auth = getAuth(context);
    const forced = context.get(pjDemoContext)?.forcedProfile ?? null;
    if (auth.userType === 'registered' && auth.customerId) {
        try {
            const customer = (await getCustomer(context, auth.customerId)) as unknown as Record<string, unknown> & {
                firstName?: string;
            };
            return sessionMember(customer, getDemoProfile(context));
        } catch (error) {
            getLogger(context).warn('PjAccount: customer fetch failed', { error });
        }
    }
    return forced ? demoMember(forced) : null;
}

/** La Super Pepperoni mediana con sus puntos (`c_pjRedeemPoints` del maestro). `null` si el catálogo no responde. */
export async function loadRedeemOffer(context: Context): Promise<RedeemOffer | null> {
    try {
        const products = await fetchProductsByIds(context, [CANJE_PRODUCT.masterId, CANJE_PRODUCT.variantId], {
            expand: ['images', 'prices'],
        });
        const byId = new Map<string, ShopperProducts.schemas['Product']>(products.map((p) => [p.id, p]));
        const master = byId.get(CANJE_PRODUCT.masterId);
        const variant = byId.get(CANJE_PRODUCT.variantId);
        const points = Number((master as unknown as Record<string, unknown> | undefined)?.c_pjRedeemPoints);
        if (!variant || typeof variant.price !== 'number' || !Number.isFinite(points) || points <= 0) return null;
        return {
            productId: variant.id,
            name: displayProductName(master?.name ?? variant.name ?? variant.id),
            image: master ? primaryImage(master) : primaryImage(variant),
            price: variant.price,
            points,
        };
    } catch (error) {
        getLogger(context).warn('PjAccount: redeem product lookup failed', { error });
        return null;
    }
}
