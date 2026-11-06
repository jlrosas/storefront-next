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
import type { LoaderFunctionArgs } from 'react-router';
import { createApiClients } from '@/lib/api-clients.server';
import { fetchProductsByIds } from '@/lib/api/products.server';
import { getLogger } from '@/lib/logger.server';
import { getAuth } from '@/middlewares/auth.server';
import { updateShopperContext } from '@/lib/shopper-context/server-utils.server';
import type { PizzaOption } from './combo';
import {
    type ComboSlot,
    type Offer,
    type OfferProductLike,
    idFromSlug,
    offerFromProduct,
    orderOffers,
    productImage,
} from './offers';

type Context = LoaderFunctionArgs['context'];

/** IDs de respaldo si el índice de búsqueda aún no trae la categoría `ofertas`. */
const FALLBACK_OFFER_IDS = [
    'cb-pizza-del-mes',
    'cb-super-duo',
    'cb-super-trio',
    'cb-papa-combo-palitos',
    'cb-papa-flash',
    'cb-papa-combo-postre',
    'cb-box-halloween',
];

const OFFER_EXPAND = ['images', 'prices', 'promotions'] as const;

/**
 * Modo forzado SOLO PARA DESARROLLO del caso 2 (Super Dúo solo retiro).
 * La promoción real `pj-super-duo-pickup` está apagada y la activará el panel. Para probar la
 * interfaz sin escribir en el sandbox: `?solo-retiro=1` en cualquier URL de ofertas (en desarrollo).
 * Queda en la cookie `pj_dev_solo_retiro` hasta `?solo-retiro=0`. En producción se ignora.
 */
export const DEV_PICKUP_ONLY_PARAM = 'solo-retiro';
export const DEV_PICKUP_ONLY_COOKIE = 'pj_dev_solo_retiro';

export function readDevPickupOnly(request: Request): { forced: boolean; setCookie: string | null } {
    if (process.env.NODE_ENV === 'production') return { forced: false, setCookie: null };
    const param = new URL(request.url).searchParams.get(DEV_PICKUP_ONLY_PARAM);
    if (param === '1') return { forced: true, setCookie: `${DEV_PICKUP_ONLY_COOKIE}=1; Path=/; SameSite=Lax` };
    if (param === '0') return { forced: false, setCookie: `${DEV_PICKUP_ONLY_COOKIE}=; Path=/; Max-Age=0` };
    const cookie = request.headers.get('Cookie') ?? '';
    return { forced: new RegExp(`(?:^|;\\s*)${DEV_PICKUP_ONLY_COOKIE}=1`).test(cookie), setCookie: null };
}

async function offerIds(context: Context): Promise<string[]> {
    const logger = getLogger(context);
    try {
        const clients = createApiClients(context);
        const { data } = await clients.shopperSearch.productSearch({
            params: { query: { q: '', refine: ['cgid=ofertas'], limit: 50 } },
        });
        const ids = (data.hits ?? []).map((h) => h.productId).filter((id): id is string => !!id);
        if (ids.length > 0) return ids;
    } catch (error) {
        logger.warn('Offers: category search failed, using fallback ids', { error: String(error) });
    }
    return FALLBACK_OFFER_IDS;
}

/** Todas las ofertas de la categoría `ofertas`, con la destacada primero. Incluye las vencidas. */
export async function loadOffers(context: Context, request: Request): Promise<Offer[]> {
    const ids = await offerIds(context);
    const products = await fetchProductsByIds(context, ids, { expand: [...OFFER_EXPAND] as never });
    const { forced } = readDevPickupOnly(request);
    return orderOffers(
        products
            .filter((p) => p.id.startsWith('cb-'))
            .map((p) => offerFromProduct(p as unknown as OfferProductLike, { forcePickupOnly: forced }))
    );
}

export async function loadOffer(context: Context, request: Request, slug: string): Promise<Offer | null> {
    const [product] = await fetchProductsByIds(context, [idFromSlug(slug)], {
        expand: [...OFFER_EXPAND] as never,
    }).catch(() => []);
    if (!product) return null;
    return offerFromProduct(product as unknown as OfferProductLike, {
        forcePickupOnly: readDevPickupOnly(request).forced,
    });
}

interface PizzaProductLike extends OfferProductLike {
    c_pjSensory?: string;
    variants?: { productId: string; variationValues?: Record<string, string> }[];
}

/** Fotos, textos y variantes de las pizzas elegibles en las casillas del constructor. */
export async function loadPizzaOptions(context: Context, slots: readonly ComboSlot[]): Promise<PizzaOption[]> {
    const pizzaSlots = slots.filter((s) => s.kind === 'pizza');
    const ids = [...new Set(pizzaSlots.flatMap((s) => s.choices))];
    if (ids.length === 0) return [];
    const products = (await fetchProductsByIds(context, ids, {
        expand: ['images', 'variations'] as never,
    })) as unknown as PizzaProductLike[];
    const byId = new Map(products.map((p) => [p.id, p]));
    return ids.flatMap((id): PizzaOption[] => {
        const product = byId.get(id);
        if (!product) return [];
        const variants: Record<string, string> = {};
        for (const v of product.variants ?? []) {
            const size = v.variationValues?.pjSize;
            if (!size) continue;
            // La masa tradicional es la del precio de lista; si no existe, la primera de ese tamaño.
            if (!variants[size] || v.variationValues?.pjCrust === 'traditional') variants[size] = v.productId;
        }
        return [
            {
                id,
                name: product.name ?? id,
                taste: product.c_pjSensory ?? product.shortDescription ?? '',
                image: productImage(product),
                variants,
            },
        ];
    });
}

/** Source code del anuncio del Super Dúo (CONTRATO §4.2): asigna el grupo `pj-anuncio-super-duo`. */
export const DIEGO_SOURCE_CODE = 'PJSD26';
const SOURCE_CODE_RETRY_MS = 60_000;
let sourceCodeFailedAt = 0;

/**
 * Aplica el source code `PJSD26` al contexto del comprador (T2) con el mismo mecanismo del
 * template (`updateShopperContext`: contexto de Shopper Context + cookie `dwsourcecode_*`).
 *
 * Bloqueo conocido: sin el scope `sfcc.shopper-context.rw` en el cliente SLAS la llamada falla.
 * Aquí se registra y se sigue: el perfil de Diego ya lo resuelve la cookie `pj_campana` (INT).
 * Tras un fallo no se reintenta por un minuto, para no sumar un viaje fallido a cada visita.
 */
export async function applyDiegoSourceCode(context: Context, request: Request): Promise<string[]> {
    const cookieHeader = request.headers.get('Cookie');
    if (/dwsourcecode_[^=;]*=PJSD26/.test(cookieHeader ?? '')) return [];
    if (Date.now() - sourceCodeFailedAt < SOURCE_CODE_RETRY_MS) return [];
    const logger = getLogger(context);
    try {
        const { usid } = getAuth(context);
        if (!usid) return [];
        const { setCookieHeaders } = await updateShopperContext({
            context,
            usid,
            newShopperContext: {},
            newSourceCodeContext: { sourceCode: DIEGO_SOURCE_CODE },
            cookieHeader,
        });
        return setCookieHeaders;
    } catch (error) {
        sourceCodeFailedAt = Date.now();
        logger.warn('Offers: could not apply source code PJSD26 (¿falta el scope shopper-context.rw?)', {
            error: error instanceof Error ? error.message : String(error),
        });
        return [];
    }
}
