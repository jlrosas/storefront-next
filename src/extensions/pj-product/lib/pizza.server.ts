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
import type { ShopperProducts } from '@/scapi';
import { createApiClients } from '@/lib/api-clients.server';
import { fetchProductById, fetchProductsByIds } from '@/lib/api/products.server';
import { getLogger } from '@/lib/logger.server';
import { getFulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import {
    CRUST_ORDER,
    EXTRA_OPTION_PREFIX,
    FALLBACK_EXTRA_PRICES,
    SHEET_SIZES,
    displayIngredientName,
    sortExtras,
    type PizzaConfig,
    type PizzaIngredient,
    type PizzaStore,
    type PizzaVariant,
} from './pizza';

type Product = ShopperProducts.schemas['Product'];
type Context = LoaderFunctionArgs['context'];
type Custom = Record<string, unknown>;

export const PIZZA_PRODUCT_EXPAND: Array<
    'availability' | 'images' | 'options' | 'prices' | 'variations' | 'promotions'
> = ['availability', 'images', 'options', 'prices', 'variations', 'promotions'];

const INGREDIENT_PREFIX = 'ing-';

/** «Para cuántos» por tamaño (CONTRATO §4.1, \`c_pjServes\`) cuando la variante no lo trae en \`getProduct\`. */
const DEFAULT_SERVES: Record<string, string> = {
    individual: 'Para 1',
    medium: 'Para 2–3',
    family: 'Para 3–4',
    extra_large: 'Para 4–5',
};

/** Primera imagen grande del producto (S-D8: la mayor resolución disponible). */
export function primaryImage(product: Product): string | null {
    const groups = product.imageGroups ?? [];
    const group = groups.find((g) => g.viewType === 'large') ?? groups[0];
    const image = group?.images?.[0];
    return image?.disBaseLink ?? image?.link ?? null;
}

/** «Papa Johns El Bosque» → «El Bosque». */
export function storeDisplayName(name: string | undefined): string {
    return (name ?? '').replace(/^Papa\s+John'?s\s+/i, '').trim();
}

/** Tienda elegida en `pj_fulfillment` con su inventario y tiempos (null sin tienda o si falla). */
export async function loadPjStore(context: Context, request: Request): Promise<PizzaStore | null> {
    const fulfillment = getFulfillment(request);
    if (!fulfillment) return null;
    const fallbackInventory = `inventory_${fulfillment.storeId.replace(/-/g, '_')}`;
    try {
        const clients = createApiClients(context);
        const { data } = await clients.shopperStores.getStores({ params: { query: { ids: fulfillment.storeId } } });
        const store = data?.data?.[0] as (Custom & { name?: string; inventoryId?: string }) | undefined;
        if (!store) return null;
        const minutes = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
        return {
            id: fulfillment.storeId,
            name: storeDisplayName(store.name),
            inventoryId: store.inventoryId ?? fallbackInventory,
            mode: fulfillment.mode,
            pickupMinutes: minutes(store.c_pjPickupMinutes),
            deliveryMinutes: minutes(store.c_pjDeliveryMinutes),
        };
    } catch (error) {
        getLogger(context).warn('PjProduct: store lookup failed', { error, storeId: fulfillment.storeId });
        return null;
    }
}

function parseExtraPrices(raw: unknown): Record<string, number> {
    if (typeof raw !== 'string') return { ...FALLBACK_EXTRA_PRICES };
    try {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const out: Record<string, number> = { ...FALLBACK_EXTRA_PRICES };
        for (const [key, value] of Object.entries(parsed)) {
            if (typeof value === 'number') out[key] = value;
        }
        return out;
    } catch {
        return { ...FALLBACK_EXTRA_PRICES };
    }
}

/** IDs de los extras pagados (`pjExtras_<id>` cuyo valor `si` cuesta > 0); las salsas y «Sin …» no son extras. */
export function paidExtraIds(product: Product): string[] {
    return (product.options ?? [])
        .filter((option) => option.id?.startsWith(EXTRA_OPTION_PREFIX))
        .filter((option) => (option.values ?? []).some((v) => v.id === 'si' && (v.price ?? 0) > 0))
        .map((option) => (option.id as string).slice(EXTRA_OPTION_PREFIX.length));
}

function isAvailableIn(ingredient: Product | undefined, inventoryId: string | null): boolean {
    if (!ingredient || !inventoryId) return true;
    const inventory = ingredient.inventories?.find((inv) => inv.id === inventoryId);
    if (!inventory) return true;
    return Boolean(inventory.orderable) && ((inventory.ats ?? 0) > 0 || (inventory.stockLevel ?? 0) > 0);
}

/**
 * Arma el `PizzaConfig` a partir del producto maestro de SCAPI, sus ingredientes (`ing-<id>`) y la
 * tienda elegida. Pura salvo por los datos de entrada: se prueba sin red.
 */
export function buildPizzaConfig(product: Product, ingredients: Product[], store: PizzaStore | null): PizzaConfig {
    const custom = product as Product & Custom;
    const extraPrices = parseExtraPrices(custom.c_pjExtraPrices);
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
    const servesBySize = new Map<string, string>();
    for (const v of product.variants ?? []) {
        const serves = (v as Custom).c_pjServes;
        if (typeof serves === 'string' && v.variationValues?.pjSize) servesBySize.set(v.variationValues.pjSize, serves);
    }
    const sizes = SHEET_SIZES.filter((id) => variants.some((v) => v.size === id)).map((id) => {
        const prices = variants.filter((v) => v.size === id).map((v) => v.price);
        return {
            id,
            label: sizeAttr?.values?.find((value) => value.value === id)?.name ?? id,
            price: Math.min(...prices),
            serves: servesBySize.get(id) ?? DEFAULT_SERVES[id] ?? null,
            extraPrice: extraPrices[id] ?? 0,
        };
    });
    const crusts = (crustAttr?.values ?? [])
        .filter((value) => variants.some((v) => v.crust === value.value))
        .map((value) => ({ id: value.value, label: value.name ?? value.value }))
        .sort((a, b) => {
            const rank = (id: string) => (CRUST_ORDER.includes(id) ? CRUST_ORDER.indexOf(id) : CRUST_ORDER.length);
            return rank(a.id) - rank(b.id);
        });

    const byId = new Map(ingredients.map((ing) => [ing.id.slice(INGREDIENT_PREFIX.length), ing]));
    const inventoryId = store?.inventoryId ?? null;
    const toIngredient = (id: string, fallbackName?: string): PizzaIngredient => {
        const ing = byId.get(id);
        const group = (ing as (Product & Custom) | undefined)?.c_pjIngredientGroup;
        return {
            id,
            name: displayIngredientName(ing?.name ?? fallbackName ?? id),
            image: ing ? primaryImage(ing) : null,
            group: typeof group === 'string' ? group : null,
            available: isAvailableIn(ing, inventoryId),
        };
    };
    const baseIds = Array.isArray(custom.c_pjBaseIngredients) ? (custom.c_pjBaseIngredients as string[]) : [];
    const optionNames = new Map(
        (product.options ?? []).map((o) => [(o.id ?? '').slice(EXTRA_OPTION_PREFIX.length), o.name ?? ''])
    );
    const extras = sortExtras(paidExtraIds(product).map((id) => toIngredient(id, optionNames.get(id))));

    const number = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null);
    const image = primaryImage(product);
    return {
        productId: product.id,
        name: product.name ?? product.id,
        kind: typeof custom.c_pjKind === 'string' ? custom.c_pjKind : 'pizza',
        sensory: typeof custom.c_pjSensory === 'string' ? custom.c_pjSensory : (product.shortDescription ?? null),
        description: product.longDescription ?? product.shortDescription ?? null,
        image: image ? { src: image, alt: product.name ?? '' } : null,
        rating: number(custom.c_pjRating),
        reviewCount: number(custom.c_pjReviewCount),
        weeklyOrders: number(custom.c_pjWeeklyOrders),
        badges: Array.isArray(custom.c_pjBadges) ? (custom.c_pjBadges as string[]) : [],
        foodTypes: Array.isArray(custom.c_pjFoodType) ? (custom.c_pjFoodType as string[]) : [],
        halvesEnabled: custom.c_pjHalvesEnabled === true,
        sizes,
        crusts,
        variants,
        base: baseIds.map((id) => toIngredient(id)),
        extras,
        store,
    };
}

/** Productos `ing-<id>` de la base y los extras, con el inventario de la tienda elegida. */
export async function fetchIngredients(
    context: Context,
    product: Product,
    store: PizzaStore | null
): Promise<Product[]> {
    const custom = product as Product & Custom;
    const baseIds = Array.isArray(custom.c_pjBaseIngredients) ? (custom.c_pjBaseIngredients as string[]) : [];
    const ids = [...new Set([...baseIds, ...paidExtraIds(product)])].map((id) => `${INGREDIENT_PREFIX}${id}`);
    try {
        return await fetchProductsByIds(context, ids, {
            expand: ['images', 'availability'],
            ...(store?.inventoryId ? { inventoryIds: [store.inventoryId] } : {}),
        });
    } catch (error) {
        getLogger(context).warn('PjProduct: ingredient lookup failed', { error });
        return [];
    }
}

/** Configurador listo para un producto ya cargado (la ficha lo usa con el producto de su loader). */
export async function loadPizzaConfigFor(context: Context, request: Request, product: Product): Promise<PizzaConfig> {
    const store = await loadPjStore(context, request);
    const ingredients = await fetchIngredients(context, product, store);
    return buildPizzaConfig(product, ingredients, store);
}

/** Configurador a partir del ID (la hoja desde el menú). Acepta el maestro o una variante. */
export async function loadPizzaConfig(
    context: Context,
    request: Request,
    productId: string
): Promise<PizzaConfig | null> {
    const [product, store] = await Promise.all([
        fetchProductById(context, productId, { expand: PIZZA_PRODUCT_EXPAND, allImages: true }),
        loadPjStore(context, request),
    ]);
    if (!product) return null;
    const masterId = product.master?.masterId;
    const master =
        masterId && masterId !== product.id
            ? await fetchProductById(context, masterId, { expand: PIZZA_PRODUCT_EXPAND, allImages: true })
            : product;
    if (!master) return null;
    const ingredients = await fetchIngredients(context, master, store);
    return buildPizzaConfig(master, ingredients, store);
}
