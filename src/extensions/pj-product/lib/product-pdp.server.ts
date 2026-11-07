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
import { redirect, type LoaderFunctionArgs } from 'react-router';
import type { ShopperProducts } from '@/scapi';
import { buildUrlFromContext } from '@/lib/url.server';
import { fetchProductById, fetchProductsByIds } from '@/lib/api/products.server';
import { getLogger } from '@/lib/logger.server';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { loadPizzaPdp, type PizzaPdpData } from './pdp.server';
import { loadPjStore, primaryImage } from './pizza.server';
import { builderPath, pdpViewFor, simpleKind } from './product-kind';
import {
    completeCandidates,
    initialSimpleOption,
    orderOptions,
    parseComboSlots,
    pizzaVariantFor,
    shortDrinkName,
    slotProductIds,
    variantLabel,
    type ComboChoiceOption,
    type ComboPdpData,
    type ComboPdpSlot,
    type SimpleOption,
    type SimplePdpData,
} from './combo-pdp';
import type { SideProduct } from './upsell';

type Product = ShopperProducts.schemas['Product'];
type Context = LoaderFunctionArgs['context'];
type Custom = Record<string, unknown>;

/** Ficha propia de Papa Johns para `/p/<id>` (PRO-08): ningún producto cae en la del template. */
export type PjPdpData =
    | { view: 'pizza'; pizza: PizzaPdpData }
    | { view: 'combo'; combo: ComboPdpData }
    | { view: 'simple'; simple: SimplePdpData };

const str = (value: unknown): string | null => (typeof value === 'string' && value !== '' ? value : null);
const num = (value: unknown): number | null => (typeof value === 'number' && Number.isFinite(value) ? value : null);

/** «Coca-Cola 1.5 LT» → «Coca-Cola 1,5 L». */
function displayName(name: string): string {
    return name.replace(/(\d)\.(\d)/g, '$1,$2').replace(/\bLT\b/, 'L');
}

function toSide(product: Product): SideProduct {
    const custom = product as Product & Custom;
    return {
        productId: product.id,
        name: displayName(product.name ?? product.id),
        description: str(custom.c_pjSensory) ?? product.shortDescription ?? null,
        price: product.price ?? 0,
        image: primaryImage(product),
    };
}

/** «Completa tu pedido» en el orden de los candidatos (no crítico: el loader lo devuelve como promesa). */
async function loadSides(context: Context, ids: string[]): Promise<SideProduct[]> {
    if (ids.length === 0) return [];
    try {
        const products = await fetchProductsByIds(context, ids, { expand: ['images', 'prices'] });
        const byId = new Map(products.map((p) => [p.id, p]));
        return ids
            .map((id) => byId.get(id))
            .filter((p): p is Product => Boolean(p) && (p as Product).price != null)
            .map(toSide);
    } catch (error) {
        getLogger(context).warn('PjProduct: complete-your-order lookup failed', { error });
        return [];
    }
}

/** Con los `utm_*` y demás parámetros de la URL, para no perder la campaña en el salto. */
function withSearch(path: string, request: Request): string {
    const { search } = new URL(request.url);
    return search ? `${path}${search}` : path;
}

/** Arma las casillas de la ficha de combo a partir de `c_pjSlots` y los productos de las opciones. */
export function buildComboSlots(rawSlotsSource: unknown, products: Product[]): ComboPdpSlot[] {
    const byId = new Map(products.map((p) => [p.id, p]));
    const weekly = (id: string) => num((byId.get(id) as (Product & Custom) | undefined)?.c_pjWeeklyOrders) ?? 0;
    return parseComboSlots(rawSlotsSource).flatMap((slot): ComboPdpSlot[] => {
        const options = slot.choices.flatMap((id): ComboChoiceOption[] => {
            const product = byId.get(id);
            if (!product) return [];
            const custom = product as Product & Custom;
            if (slot.kind === 'pizza') {
                const variant = pizzaVariantFor(product.variants ?? [], slot.size ?? 'family');
                if (!variant) return [];
                return [
                    {
                        id,
                        product: variant,
                        name: product.name ?? id,
                        image: primaryImage(product),
                        taste: str(custom.c_pjSensory),
                    },
                ];
            }
            const name = product.name ?? id;
            return [
                {
                    id,
                    product: id,
                    name: slot.kind === 'drink' && slot.choices.length > 1 ? shortDrinkName(name) : displayName(name),
                    image: primaryImage(product),
                    taste: str(custom.c_pjSensory),
                },
            ];
        });
        if (options.length === 0) return [];
        const ordered = orderOptions(options, slot.default, weekly);
        return [
            {
                id: slot.id,
                kind: slot.kind,
                label: displayName(slot.label),
                size: slot.size ?? null,
                options: ordered,
                defaultId: ordered[0].id,
            },
        ];
    });
}

async function loadCombo(context: Context, request: Request, product: Product): Promise<ComboPdpData | null> {
    const custom = product as Product & Custom;
    const now = Date.now();
    const validTo = str(custom.c_pjValidTo);
    const validFrom = str(custom.c_pjValidFrom);
    // Vencida: el aviso con alternativas vive en /promos/<slug> (OFE-04). Aún no vigente: Promos.
    if (validTo && Date.parse(validTo) <= now) {
        // oxlint-disable-next-line typescript/only-throw-error -- redirect() es la respuesta de React Router
        throw redirect(buildUrlFromContext(withSearch(builderPath(product.id), request), context));
    }
    if (validFrom && Date.parse(validFrom) > now) {
        // oxlint-disable-next-line typescript/only-throw-error -- redirect() es la respuesta de React Router
        throw redirect(buildUrlFromContext(PJ_ROUTES.promos, context));
    }
    const rawSlots = parseComboSlots(custom.c_pjSlots);
    const [products, store] = await Promise.all([
        fetchProductsByIds(context, slotProductIds(rawSlots), {
            expand: ['images', 'variations', 'prices'],
        }).catch((error: unknown) => {
            getLogger(context).warn('PjProduct: combo choices lookup failed', { error });
            return [] as Product[];
        }),
        loadPjStore(context, request),
    ]);
    const slots = buildComboSlots(custom.c_pjSlots, products);
    if (slots.length !== rawSlots.length) return null;
    const before = num(custom.c_pjPriceBefore);
    const kinds = rawSlots.filter((s) => s.kind === 'drink' || s.kind === 'dessert').map((s) => s.kind);
    return {
        productId: product.id,
        name: product.name ?? product.id,
        sensory: str(custom.c_pjSensory),
        description: product.shortDescription ?? product.longDescription ?? null,
        image: primaryImage(product),
        price: product.price ?? 0,
        priceBefore: before && before > (product.price ?? 0) ? before : null,
        serves: str(custom.c_pjServes),
        validTo,
        slots,
        store,
        sides: loadSides(context, completeCandidates({ productIds: slotProductIds(rawSlots), kinds })),
    };
}

/** Opciones en chips (tamaño de bebida, sabor de rolls o helados) a partir de las variantes. */
export function simpleOptions(product: Product, name: string): SimpleOption[] {
    const labels = new Map<string, string>();
    for (const attribute of product.variationAttributes ?? []) {
        for (const value of attribute.values ?? []) {
            if (value.orderable !== false) labels.set(value.value, value.name ?? value.value);
        }
    }
    return (product.variants ?? [])
        .filter((v) => v.orderable !== false && typeof v.price === 'number')
        .map((v) => {
            const key = Object.values(v.variationValues ?? {})[0] ?? '';
            return { productId: v.productId, label: variantLabel(labels.get(key) ?? key, name), price: v.price ?? 0 };
        })
        .sort((a, b) => a.price - b.price);
}

async function loadSimple(context: Context, request: Request, product: Product): Promise<SimplePdpData> {
    const masterId = product.master?.masterId;
    const isVariant = Boolean(product.type?.variant && masterId && masterId !== product.id);
    const master = isVariant
        ? ((await fetchProductById(context, masterId as string, {
              expand: ['images', 'prices', 'variations'],
              allImages: true,
          }).catch(() => null)) ?? product)
        : product;
    const custom = master as Product & Custom;
    const name = master.name ?? master.id;
    const options = simpleOptions(master, name);
    const kind = simpleKind({ ...master, c_pjKind: custom.c_pjKind ?? (product as Product & Custom).c_pjKind });
    const requested = new URL(request.url).searchParams.get('pid') ?? (isVariant ? product.id : null);
    const store = await loadPjStore(context, request);
    const exclude = [master.id, ...options.map((o) => o.productId)];
    return {
        productId: master.id,
        name: displayName(name),
        kind,
        sensory: str(custom.c_pjSensory),
        description: master.longDescription ?? master.shortDescription ?? null,
        image: primaryImage(master) ?? primaryImage(product),
        price: options[0]?.price ?? master.price ?? product.price ?? 0,
        options,
        initialOptionId: initialSimpleOption(options, requested),
        store,
        sides: loadSides(context, completeCandidates({ productIds: exclude, kinds: kind === 'side' ? [] : [kind] })),
    };
}

/**
 * Datos de la ficha para el loader de `_app.p.$.tsx` según el tipo de producto (`pdpViewFor`):
 * pizza (PRO-03), combo con ficha o producto simple. Super Dúo y Super Trío redirigen (302) a su
 * constructor; `pz-mitades`, al armador; un combo vencido, a su aviso en `/promos/<slug>`.
 */
export async function loadPjPdp(context: Context, request: Request, product: Product): Promise<PjPdpData> {
    const view = pdpViewFor(product as Product & Custom);
    if (view === 'builder') {
        const id = product.master?.masterId ?? product.id;
        // oxlint-disable-next-line typescript/only-throw-error -- redirect() es la respuesta de React Router
        throw redirect(buildUrlFromContext(withSearch(builderPath(id), request), context), 302);
    }
    if (view === 'pizza' || view === 'halves') {
        const pizza = await loadPizzaPdp(context, request, product);
        if (pizza) return { view: 'pizza', pizza };
    }
    if (view === 'combo') {
        const combo = await loadCombo(context, request, product);
        if (combo) return { view: 'combo', combo };
    }
    return { view: 'simple', simple: await loadSimple(context, request, product) };
}
