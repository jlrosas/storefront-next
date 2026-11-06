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
import type { LoaderFunctionArgs } from 'react-router';
import type { ShopperBasketsV2, ShopperProducts } from '@/scapi';
import { createApiClients } from '@/lib/api-clients.server';
import { fetchProductById, fetchProductsByIds } from '@/lib/api/products.server';
import { getLogger } from '@/lib/logger.server';
import { CRUST_ORDER, SHEET_SIZES, type PizzaVariant } from './pizza';
import { primaryImage } from './pizza.server';
import {
    HALVES_PRODUCT_ID,
    isHalvesItem,
    parseHalves,
    sortFlavors,
    type HalfFlavor,
    type HalvesBuilderData,
    type HalvesConfig,
} from './halves';

type Product = ShopperProducts.schemas['Product'];
type Context = LoaderFunctionArgs['context'];

/** IDs de las pizzas de la categoría `pizzas` (los constructores quedan fuera). */
async function pizzaIds(context: Context): Promise<string[]> {
    const clients = createApiClients(context);
    const { data } = await clients.shopperSearch.productSearch({
        params: { query: { refine: ['cgid=pizzas'], limit: 50 } },
    });
    return (data?.hits ?? [])
        .map((hit) => hit.productId)
        .filter((id) => id.startsWith('pz-') && id !== HALVES_PRODUCT_ID);
}

/** Las especialidades que admiten mitades (`c_pjHalvesEnabled`), con foto y precio por tamaño. */
export async function loadHalfFlavors(context: Context): Promise<HalfFlavor[]> {
    const ids = await pizzaIds(context);
    const products = await fetchProductsByIds(context, ids, { expand: ['images', 'prices', 'variations'] });
    const flavors = products
        .filter((p) => (p as Product & Record<string, unknown>).c_pjHalvesEnabled === true)
        .map((p) => {
            const prices: Record<string, number> = {};
            for (const v of p.variants ?? []) {
                const size = v.variationValues?.pjSize;
                if (!size || v.price == null) continue;
                // Precio de la masa Tradicional (o la más barata) de cada tamaño.
                prices[size] = Math.min(prices[size] ?? Number.POSITIVE_INFINITY, v.price);
            }
            return { id: p.id, name: p.name ?? p.id, image: primaryImage(p), prices };
        });
    return sortFlavors(flavors);
}

/** Armador de mitades: el producto `pz-mitades` (tamaños, masas) y las 16 especialidades. */
export async function loadHalvesConfig(context: Context): Promise<HalvesConfig | null> {
    const [product, flavors] = await Promise.all([
        fetchProductById(context, HALVES_PRODUCT_ID, { expand: ['prices', 'variations', 'images'] }),
        loadHalfFlavors(context),
    ]);
    if (!product) return null;
    const sizeAttr = product.variationAttributes?.find((a) => a.id === 'pjSize');
    const crustAttr = product.variationAttributes?.find((a) => a.id === 'pjCrust');
    const variants: PizzaVariant[] = (product.variants ?? [])
        .map((v) => ({
            productId: v.productId,
            size: v.variationValues?.pjSize ?? '',
            crust: v.variationValues?.pjCrust ?? '',
            price: v.price ?? 0,
            orderable: v.orderable !== false,
        }))
        .filter((v) => v.orderable && SHEET_SIZES.includes(v.size));
    const sizes = SHEET_SIZES.filter((id) => variants.some((v) => v.size === id)).map((id) => ({
        id,
        label: sizeAttr?.values?.find((value) => value.value === id)?.name ?? id,
        price: Math.min(...variants.filter((v) => v.size === id).map((v) => v.price)),
        serves: null,
        extraPrice: 0,
    }));
    const crusts = (crustAttr?.values ?? [])
        .filter((value) => variants.some((v) => v.crust === value.value))
        .map((value) => ({ id: value.value, label: value.name ?? value.value }))
        .sort((a, b) => CRUST_ORDER.indexOf(a.id) - CRUST_ORDER.indexOf(b.id));
    const custom = product as Product & Record<string, unknown>;
    return {
        productId: product.id,
        name: product.name ?? product.id,
        sensory: typeof custom.c_pjSensory === 'string' ? custom.c_pjSensory : null,
        sizes,
        crusts,
        variants,
        flavors,
    };
}

export interface HalvesLineInfo {
    itemId: string;
    halves: Array<{ id: string; name: string; image: string | null }>;
}

/**
 * Para CAR: nombre y foto de cada mitad de las líneas de mitades del carrito («½ Pollo BBQ · ½ Todas
 * las Carnes» y la foto dividida). Una sola llamada a SCAPI para todas las líneas.
 */
export async function loadHalvesLines(
    context: Context,
    basket: Pick<ShopperBasketsV2.schemas['Basket'], 'productItems'> | null | undefined
): Promise<Record<string, HalvesLineInfo>> {
    const lines = (basket?.productItems ?? [])
        .filter((item) => isHalvesItem(item as { productId?: string; c_pjHalves?: unknown }))
        .map((item) => ({
            itemId: item.itemId ?? '',
            ids: parseHalves((item as Record<string, unknown>).c_pjHalves),
        }));
    const ids = [...new Set(lines.flatMap((line) => line.ids))];
    if (!ids.length) return {};
    try {
        const products = await fetchProductsByIds(context, ids, { expand: ['images'] });
        const byId = new Map(products.map((p) => [p.id, p]));
        return Object.fromEntries(
            lines.map((line) => [
                line.itemId,
                {
                    itemId: line.itemId,
                    halves: line.ids.map((id) => {
                        const p = byId.get(id);
                        return { id, name: p?.name ?? id, image: p ? primaryImage(p) : null };
                    }),
                },
            ])
        );
    } catch (error) {
        getLogger(context).warn('PjProduct: halves lookup failed', { error });
        return {};
    }
}

/**
 * Datos del armador: `?primera=<id>&segunda=<id>` precarga mitades (menú «½ Mitad», Home de Sofía
 * «después») y `?item=<itemId>` abre una línea del carrito para editarla («Editar mitades»).
 */
export async function loadHalvesBuilderData(
    context: Context,
    request: Request,
    getBasketItem: (itemId: string) => Promise<{ productId?: string; c_pjHalves?: unknown } | undefined>
): Promise<HalvesBuilderData> {
    const url = new URL(request.url);
    const itemId = url.searchParams.get('item')?.trim() || null;
    const config = await loadHalvesConfig(context);
    if (itemId) {
        const item = await getBasketItem(itemId);
        if (item) {
            const variant = config?.variants.find((v) => v.productId === item.productId);
            return {
                config,
                halves: parseHalves(item.c_pjHalves),
                size: variant?.size ?? null,
                crust: variant?.crust ?? null,
                itemId,
            };
        }
    }
    // `primera`/`segunda` (PRO) o `mitad1`/`mitad2` (respaldo del menú: `/p/pz-mitades?mitad1=<id>`).
    const q = url.searchParams;
    return {
        config,
        halves: [q.get('primera') ?? q.get('mitad1'), q.get('segunda') ?? q.get('mitad2')],
        size: q.get('size'),
        crust: null,
        itemId: null,
    };
}
