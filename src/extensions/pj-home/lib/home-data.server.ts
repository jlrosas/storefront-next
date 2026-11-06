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
import type { LoaderFunctionArgs } from 'react-router';
import type { ShopperProducts } from '@/scapi';
import { createApiClients } from '@/lib/api-clients.server';
import { getAuth } from '@/middlewares/auth.server';
import { getLogger } from '@/lib/logger.server';
import { siteContext, type SiteContext } from '@salesforce/storefront-next-runtime/site-context';
import type { DemoMoment, DemoProfile } from '@/extensions/pj-shared/lib/profile';
import {
    AD_OFFER_ID,
    DEFAULT_MOMENT,
    FOR_THREE_IDS,
    MOMENT_OFFER_IDS,
    OCCASION_IDS,
    POPULAR_IDS,
    REDEEM_ID,
    REDEEM_POINTS,
    SEASON_OFFER_ID,
    HOME_ROUTES,
    productHref,
} from './constants';
import { SOFIA_SAMPLE } from './mock';
import type { FavoriteVM, HomeData, LastOrderVM, MomentVM, OccasionVM, OfferVM, PopularVM, SofiaVM } from './types';

type Product = ShopperProducts.schemas['Product'] & Record<string, unknown>;
type Context = LoaderFunctionArgs['context'];

const EMPTY: Omit<HomeData, 'profile' | 'moment'> = {
    hero: null,
    month: null,
    popular: [],
    occasions: [],
    moments: [],
    sofia: null,
};

function imageOf(product: Product | undefined): string {
    const groups = product?.imageGroups ?? [];
    const group = groups.find((g) => g.viewType === 'large') ?? groups[0];
    return group?.images?.[0]?.link ?? '';
}

function num(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** Precio de la variante Familiar tradicional de una pizza; si no hay, el del producto. */
export function familyPriceOf(product: Product): number | null {
    const variants = (product.variants ?? []) as { price?: number; variationValues?: Record<string, string> }[];
    const family = variants.find(
        (v) => v.variationValues?.pjSize === 'family' && v.variationValues?.pjCrust === 'traditional'
    );
    return num(family?.price) ?? num(product.price);
}

export function offerOf(product: Product | undefined, href: string): OfferVM | null {
    if (!product || num(product.price) === null) return null;
    const before = num(product.c_pjPriceBefore);
    return {
        id: product.id,
        name: product.name ?? product.id,
        price: product.price as number,
        listPrice: before !== null && before > (product.price as number) ? before : null,
        image: imageOf(product),
        imageAlt: product.name ?? product.id,
        serves: typeof product.c_pjServes === 'string' ? product.c_pjServes : null,
        sensory: typeof product.c_pjSensory === 'string' ? product.c_pjSensory : null,
        href,
    };
}

export function popularOf(product: Product | undefined): PopularVM | null {
    if (!product) return null;
    const badges = Array.isArray(product.c_pjBadges) ? (product.c_pjBadges as string[]) : [];
    return {
        id: product.id,
        name: product.name ?? product.id,
        badge: badges[0] ?? null,
        rating: num(product.c_pjRating),
        weekly: num(product.c_pjWeeklyOrders),
        sensory: typeof product.c_pjSensory === 'string' ? product.c_pjSensory : null,
        familyPrice: familyPriceOf(product),
        image: imageOf(product),
        imageAlt: product.name ?? product.id,
        href: productHref(product.id),
    };
}

async function fetchProducts(context: Context, ids: string[]): Promise<Map<string, Product>> {
    const clients = createApiClients(context);
    const currency = (context.get(siteContext) as SiteContext | undefined)?.currency ?? undefined;
    const unique = Array.from(new Set(ids));
    const map = new Map<string, Product>();
    try {
        const { data } = await clients.shopperProducts.getProducts({
            params: { query: { ids: unique, expand: ['images', 'prices', 'variations'], allImages: false, currency } },
        });
        for (const product of (data?.data ?? []) as Product[]) map.set(product.id, product);
    } catch (error) {
        getLogger(context).warn('HomeData: getProducts failed', { error });
    }
    return map;
}

function stripVariant(productId: string, masters: readonly string[]): string {
    return masters.find((m) => productId === m || productId.startsWith(`${m}-`)) ?? productId;
}

function summaryOf(items: { productName?: string; c_pjRemoved?: unknown }[]): string {
    return items
        .map((item) => {
            const name = (item.productName ?? '').replace(/ Tradicional$/, '').replace(/ 1\.5 LT$/, ' 1,5 L');
            const removed = Array.isArray(item.c_pjRemoved) ? (item.c_pjRemoved as string[]) : [];
            return removed.length ? `${name} sin ${removed.map((r) => r.replace(/-/g, ' ')).join(', ')}` : name;
        })
        .join(' + ');
}

/** Cliente real de Sofía: saldo, favoritas y último pedido. `null` si no hay sesión de cliente. */
async function loadSofia(context: Context, products: Map<string, Product>): Promise<SofiaVM | null> {
    let auth;
    try {
        auth = getAuth(context);
    } catch {
        return null;
    }
    if (auth.userType !== 'registered' || !auth.customerId) return null;
    const clients = createApiClients(context);
    try {
        const [{ data: customer }, { data: orders }] = await Promise.all([
            clients.shopperCustomers.getCustomer({ params: { path: { customerId: auth.customerId } } }),
            clients.shopperCustomers.getCustomerOrders({
                params: { path: { customerId: auth.customerId }, query: { limit: 50 } },
            }),
        ]);
        const c = customer as Record<string, unknown>;
        const all = ((orders?.data ?? []) as unknown as Record<string, unknown>[]).filter(
            (o) => (o.status as string) !== 'cancelled' && (o.status as string) !== 'failed'
        );
        const placed = (o: Record<string, unknown>) => String(o.c_pjPlacedAt ?? o.creationDate ?? '');
        all.sort((a, b) => placed(b).localeCompare(placed(a)));
        const last = all[0];
        const items = (last?.productItems ?? []) as {
            productId: string;
            productName?: string;
            c_pjRemoved?: unknown;
        }[];
        const lineProducts = await fetchProducts(
            context,
            items.map((i) => i.productId)
        );
        const favorites = Array.isArray(c.c_pjFavorites) ? (c.c_pjFavorites as string[]) : [];
        const favProducts = await fetchProducts(context, [...favorites, REDEEM_ID]);
        for (const [id, p] of favProducts) products.set(id, p);

        const count = (master: string) =>
            all.filter((o) =>
                ((o.productItems ?? []) as { productId: string }[]).some(
                    (i) => stripVariant(i.productId, [master]) === master
                )
            ).length;
        const points = num(c.c_pjPoints) ?? 0;
        const redeemProduct = products.get(REDEEM_ID);
        const lastOrder: LastOrderVM | null = last
            ? {
                  orderNo: String(last.orderNo),
                  placedAt: placed(last),
                  total: num(last.orderTotal) ?? 0,
                  summary: summaryOf(items),
                  heroImage: imageOf(lineProducts.get(items[0]?.productId ?? '')),
                  heroAlt: items[0]?.productName ?? '',
                  thumbs: items.slice(0, 3).map((i) => ({
                      src: imageOf(lineProducts.get(i.productId)),
                      alt: i.productName ?? '',
                  })),
                  storeLabel: 'El Bosque',
              }
            : null;
        return {
            firstName: String(customer.firstName ?? 'Sofía'),
            points,
            live: true,
            lastOrder,
            favorites: favorites
                .map((id): FavoriteVM | null => {
                    const p = favProducts.get(id);
                    return p
                        ? {
                              id,
                              name: p.name ?? id,
                              image: imageOf(p),
                              imageAlt: p.name ?? id,
                              times: count(id),
                              price: familyPriceOf(p),
                              href: productHref(id),
                          }
                        : null;
                })
                .filter((f): f is FavoriteVM => f !== null),
            redeem:
                redeemProduct && points >= REDEEM_POINTS
                    ? {
                          id: REDEEM_ID,
                          name: redeemProduct.name ?? REDEEM_ID,
                          image: imageOf(redeemProduct),
                          points: REDEEM_POINTS,
                      }
                    : null,
        };
    } catch (error) {
        getLogger(context).warn('HomeData: customer fetch failed', { error });
        return null;
    }
}

/** Datos de ejemplo de Sofía completados con las fotos del catálogo (sin sesión). */
function sampleSofia(products: Map<string, Product>): SofiaVM {
    const pollo = products.get('pz-pollo-bbq');
    const carnes = products.get('pz-todas-las-carnes');
    const pepperoni = products.get(REDEEM_ID);
    const fav = (id: string, p: Product | undefined, times: number): FavoriteVM | null =>
        p
            ? {
                  id,
                  name: p.name ?? id,
                  image: imageOf(p),
                  imageAlt: p.name ?? id,
                  times,
                  price: familyPriceOf(p),
                  href: productHref(id),
              }
            : null;
    const base = SOFIA_SAMPLE;
    return {
        ...base,
        lastOrder: base.lastOrder && {
            ...base.lastOrder,
            heroImage: imageOf(pollo),
            thumbs: pollo ? [{ src: imageOf(pollo), alt: pollo.name ?? '' }] : [],
        },
        favorites: [fav('pz-pollo-bbq', pollo, 4), fav('pz-todas-las-carnes', carnes, 3)].filter(
            (f): f is FavoriteVM => f !== null
        ),
        redeem: pepperoni
            ? { id: REDEEM_ID, name: pepperoni.name ?? REDEEM_ID, image: imageOf(pepperoni), points: REDEEM_POINTS }
            : null,
    };
}

export interface HomeDataArgs {
    context: Context;
    profile: DemoProfile;
    moment: DemoMoment | null;
}

/**
 * Datos de la Home para el perfil: todo sale del catálogo (nombre, precio, antes, foto) y del
 * cliente. Nunca falla: si Commerce no responde, devuelve bloques vacíos y la Home oculta lo que falta.
 */
export async function loadHomeData({ context, profile, moment }: HomeDataArgs): Promise<HomeData> {
    const shownMoment = moment ?? DEFAULT_MOMENT;
    const ids: string[] = [SEASON_OFFER_ID, ...POPULAR_IDS];
    if (profile === 'diego') {
        ids.push(AD_OFFER_ID, ...Object.values(OCCASION_IDS), ...FOR_THREE_IDS, ...Object.values(MOMENT_OFFER_IDS));
    }
    if (profile === 'sofia') ids.push('pz-pollo-bbq', 'pz-todas-las-carnes', REDEEM_ID);
    const products = await fetchProducts(context, ids);
    const get = (id: string) => products.get(id);

    const season = offerOf(get(SEASON_OFFER_ID), productHref(SEASON_OFFER_ID));
    const popular = POPULAR_IDS.map((id) => popularOf(get(id))).filter((p): p is PopularVM => p !== null);

    if (profile === 'valentina') {
        return { ...EMPTY, profile, moment: shownMoment, hero: season, popular };
    }

    if (profile === 'diego') {
        const hero = offerOf(get(AD_OFFER_ID), HOME_ROUTES.superDuo);
        const occ = (key: OccasionVM['key'], id: string, href: string): OccasionVM | null => {
            const o = offerOf(get(id), href);
            return (
                o && {
                    key,
                    name: o.name,
                    price: o.price,
                    listPrice: o.listPrice,
                    image: o.image,
                    imageAlt: o.imageAlt,
                    href,
                }
            );
        };
        const lines = FOR_THREE_IDS.map((id) => get(id)).filter((p): p is Product => !!p && num(p.price) !== null);
        const forThree: OccasionVM | null =
            lines.length === FOR_THREE_IDS.length && season
                ? {
                      key: 'para-3',
                      name: lines.map((l) => l.name).join(' + '),
                      price: lines.reduce((sum, l) => sum + (l.price as number), 0),
                      listPrice: null,
                      image: season.image,
                      imageAlt: season.imageAlt,
                      href: null,
                      lines: lines.map((l) => ({ productId: l.id, name: l.name ?? l.id, price: l.price as number })),
                  }
                : null;
        const occasions = [
            occ('para-1', OCCASION_IDS['para-1'], productHref(OCCASION_IDS['para-1'])),
            occ('para-2', OCCASION_IDS['para-2'], productHref(OCCASION_IDS['para-2'])),
            forThree,
            occ('para-4', OCCASION_IDS['para-4'], HOME_ROUTES.superDuo),
            occ('para-6', OCCASION_IDS['para-6'], HOME_ROUTES.superTrio),
        ].filter((o): o is OccasionVM => o !== null);
        const momentHref = (m: DemoMoment) =>
            m === 'partido' ? HOME_ROUTES.superTrio : productHref(MOMENT_OFFER_IDS[m]);
        const moments = (Object.keys(MOMENT_OFFER_IDS) as DemoMoment[])
            .map((id): MomentVM | null => {
                const offer = offerOf(get(MOMENT_OFFER_IDS[id]), momentHref(id));
                return offer && { id, offer };
            })
            .filter((m): m is MomentVM => m !== null);
        return { ...EMPTY, profile, moment: shownMoment, hero, popular, occasions, moments };
    }

    const live = await loadSofia(context, products);
    return {
        ...EMPTY,
        profile,
        moment: shownMoment,
        month: season,
        sofia: live ?? sampleSofia(products),
    };
}

/** Atributo común de los componentes de la Home: a qué perfil se muestra (además de los grupos de clientes). */
export type ProfileGate = 'all' | DemoProfile;

export function visibleFor(gate: ProfileGate | undefined, profile: DemoProfile): boolean {
    return !gate || gate === 'all' || gate === profile;
}

/** Hero de Page Designer: nombre, precio, antes y foto salen del producto elegido. */
export async function loadHeroBlock(
    context: Context,
    attrs: { productId?: string; destination?: string; profile?: ProfileGate },
    profile: DemoProfile
): Promise<{ visible: boolean; offer: OfferVM | null }> {
    if (!visibleFor(attrs.profile, profile) || !attrs.productId)
        return { visible: visibleFor(attrs.profile, profile), offer: null };
    const products = await fetchProducts(context, [attrs.productId]);
    const href = attrs.destination?.trim() || productHref(attrs.productId);
    return { visible: true, offer: offerOf(products.get(attrs.productId), href) };
}

/** Bloques de Diego y Sofía de Page Designer: reutilizan la carga de la Home del perfil. */
export async function loadProfileBlock(
    context: Context,
    gate: ProfileGate | undefined,
    profile: DemoProfile,
    moment: DemoMoment | null,
    as: DemoProfile
): Promise<{ visible: boolean; data: HomeData | null }> {
    if (!visibleFor(gate, profile)) return { visible: false, data: null };
    return { visible: true, data: await loadHomeData({ context, profile: as, moment }) };
}
