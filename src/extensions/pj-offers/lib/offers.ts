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
import { PJ_TIME_ZONE } from '@/extensions/pj-shared/lib/format';

/**
 * Modelo de las ofertas (OFE · diseño 10). Todo sale de los combos `cb-*` de la categoría
 * `ofertas` (CONTRATO §4.1 y §7): `c_pjSlots`, `c_pjValidFrom`, `c_pjValidTo`, `c_pjDispatch`,
 * `c_pjOccasion`, `c_pjPriceBefore` y `c_pjServes`. Funciones puras, seguras en cliente y servidor.
 */

/** Ofertas con constructor (S-D3): solo las dibujadas en el lienzo. Las demás abren su ficha. */
export const BUILDER_OFFER_IDS = ['cb-super-duo', 'cb-super-trio'] as const;
/** La oferta destacada (S-D1): Pizza del Mes The Works. */
export const FEATURED_OFFER_ID = 'cb-pizza-del-mes';
/** Promoción que el panel enciende para el caso 2 (Super Dúo solo retiro, S-D15). */
export const PICKUP_ONLY_PROMOTION_ID = 'pj-super-duo-pickup';
/** Vigencia visible solo cuando quedan 7 días o menos (regla 6 del diseño 10). */
export const VALIDITY_VISIBLE_DAYS = 7;

export type SlotKind = 'pizza' | 'side' | 'drink' | 'dessert';
export type Dispatch = 'both' | 'pickup' | 'delivery';

export interface ComboSlot {
    id: string;
    kind: SlotKind;
    label: string;
    /** Tamaño de la pizza (`family`, `medium`, `individual`). */
    size?: string;
    /** IDs de producto entre los que se elige. */
    choices: string[];
    default?: string;
}

export interface Offer {
    /** ID del producto en Commerce (`cb-super-duo`). */
    id: string;
    /** Parte de la URL: `/promos/super-duo`. */
    slug: string;
    name: string;
    description: string;
    /** Foto sin texto incrustado (S-D8). */
    image: string | null;
    price: number;
    priceBefore: number | null;
    /** «Para 4», «Para 6 o más»… (S-D16: un solo número por oferta). */
    serves: string | null;
    /** `para-1`, `para-2`, `para-4`, `para-6`… */
    occasions: string[];
    dispatch: Dispatch;
    validFrom: string | null;
    validTo: string | null;
    slots: ComboSlot[];
    hasBuilder: boolean;
    /** Solo retiro por el caso 2 (promoción activa o modo forzado de desarrollo). */
    pickupOnly: boolean;
}

export type OfferStatus = 'active' | 'expired' | 'upcoming';

export const OCCASION_FILTERS = [
    { id: 'todas', occasion: null },
    { id: '1', occasion: 'para-1' },
    { id: '2', occasion: 'para-2' },
    { id: '4', occasion: 'para-4' },
    { id: '6', occasion: 'para-6' },
] as const;

export type OccasionFilterId = (typeof OCCASION_FILTERS)[number]['id'];

export function isOccasionFilterId(value: unknown): value is OccasionFilterId {
    return OCCASION_FILTERS.some((f) => f.id === value);
}

export function slugFromId(id: string): string {
    return id.replace(/^cb-/, '');
}

export function idFromSlug(slug: string): string {
    return slug.startsWith('cb-') ? slug : `cb-${slug}`;
}

export function hasBuilder(id: string): boolean {
    return (BUILDER_OFFER_IDS as readonly string[]).includes(id);
}

export function filterByOccasion(offers: readonly Offer[], filter: OccasionFilterId): Offer[] {
    const entry = OCCASION_FILTERS.find((f) => f.id === filter);
    if (!entry || entry.occasion === null) return [...offers];
    return offers.filter((o) => o.occasions.includes(entry.occasion));
}

export function offerStatus(offer: Pick<Offer, 'validFrom' | 'validTo'>, now: Date): OfferStatus {
    const time = now.getTime();
    if (offer.validTo && Date.parse(offer.validTo) <= time) return 'expired';
    if (offer.validFrom && Date.parse(offer.validFrom) > time) return 'upcoming';
    return 'active';
}

/** Día calendario (`AAAA-MM-DD`) en la zona de Chile. */
function chileDay(value: Date): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: PJ_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(value);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
    return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Días de calendario que faltan hasta el fin de la oferta (0 = termina hoy). */
export function daysLeft(validTo: string | null, now: Date): number | null {
    if (!validTo) return null;
    const end = Date.parse(validTo);
    if (Number.isNaN(end)) return null;
    const dayMs = 24 * 60 * 60 * 1000;
    return Math.round(
        (Date.parse(`${chileDay(new Date(end))}T00:00:00Z`) - Date.parse(`${chileDay(now)}T00:00:00Z`)) / dayMs
    );
}

/** `true` si la vigencia debe mostrarse en la tarjeta (quedan 7 días o menos). */
export function showsValidity(validTo: string | null, now: Date): boolean {
    const left = daysLeft(validTo, now);
    return left !== null && left >= 0 && left <= VALIDITY_VISIBLE_DAYS;
}

/** `2 de noviembre`: día y mes en la zona de Chile. */
export function formatDayMonth(value: string | Date): string {
    return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', timeZone: PJ_TIME_ZONE }).format(
        typeof value === 'string' ? new Date(value) : value
    );
}

export function savings(offer: Pick<Offer, 'price' | 'priceBefore'>): number {
    return offer.priceBefore && offer.priceBefore > offer.price ? offer.priceBefore - offer.price : 0;
}

export function discountPercent(offer: Pick<Offer, 'price' | 'priceBefore'>): number {
    return offer.priceBefore && offer.priceBefore > offer.price
        ? Math.round((1 - offer.price / offer.priceBefore) * 100)
        : 0;
}

/** «Para 6 o más» se muestra «Para 6+» como en el lienzo. */
export function whoLabel(serves: string | null): string | null {
    if (!serves) return null;
    return serves.replace(/(\d+)\s+o\s+más/i, '$1+');
}

/** Pasa a lista lo que Commerce entrega como texto, lista o nada. */
function toStringList(value: unknown): string[] {
    if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string');
    if (typeof value === 'string' && value !== '') return [value];
    return [];
}

export function parseSlots(raw: unknown): ComboSlot[] {
    if (typeof raw !== 'string' || raw === '') return [];
    try {
        const parsed = JSON.parse(raw) as { slots?: unknown };
        if (!Array.isArray(parsed.slots)) return [];
        return parsed.slots.flatMap((slot): ComboSlot[] => {
            if (!slot || typeof slot !== 'object') return [];
            const s = slot as Record<string, unknown>;
            if (typeof s.id !== 'string') return [];
            return [
                {
                    id: s.id,
                    kind: (['pizza', 'side', 'drink', 'dessert'].includes(String(s.kind))
                        ? s.kind
                        : 'pizza') as SlotKind,
                    label: typeof s.label === 'string' ? s.label : s.id,
                    size: typeof s.size === 'string' ? s.size : undefined,
                    choices: toStringList(s.choices),
                    default: typeof s.default === 'string' ? s.default : undefined,
                },
            ];
        });
    } catch {
        return [];
    }
}

/** Producto de SCAPI con los atributos propios de la demo. */
export interface OfferProductLike {
    id: string;
    name?: string;
    price?: number;
    shortDescription?: string;
    longDescription?: string;
    c_pjSlots?: unknown;
    c_pjValidFrom?: unknown;
    c_pjValidTo?: unknown;
    c_pjDispatch?: unknown;
    c_pjOccasion?: unknown;
    c_pjPriceBefore?: unknown;
    c_pjServes?: unknown;
    imageGroups?: { viewType?: string; images?: { disBaseLink?: string; link?: string }[] }[];
    productPromotions?: { promotionId?: string }[];
}

export function productImage(product: Pick<OfferProductLike, 'imageGroups'>): string | null {
    const groups = product.imageGroups ?? [];
    const group = groups.find((g) => g.viewType === 'large') ?? groups[0];
    const image = group?.images?.[0];
    return image?.disBaseLink ?? image?.link ?? null;
}

/** `srcset` de la red de imágenes de Commerce (parámetro `sw`). */
export function imageSrcSet(src: string | null, widths: readonly number[] = [400, 800, 1200]): string | undefined {
    if (!src || !src.includes('/dw/image/')) return undefined;
    return widths.map((w) => `${src}?sw=${w}&q=80 ${w}w`).join(', ');
}

/** Una foto de la red de imágenes de Commerce a un ancho dado. */
export function imageAt(src: string | null, width: number): string | null {
    if (!src) return null;
    return src.includes('/dw/image/') ? `${src}?sw=${width}&q=80` : src;
}

export function offerFromProduct(product: OfferProductLike, options: { forcePickupOnly?: boolean } = {}): Offer {
    const dispatchRaw = String(product.c_pjDispatch ?? 'both');
    const dispatch: Dispatch = dispatchRaw === 'pickup' || dispatchRaw === 'delivery' ? dispatchRaw : 'both';
    const promoPickup = (product.productPromotions ?? []).some((p) => p.promotionId === PICKUP_ONLY_PROMOTION_ID);
    const before = Number(product.c_pjPriceBefore);
    return {
        id: product.id,
        slug: slugFromId(product.id),
        name: product.name ?? product.id,
        description: product.shortDescription ?? product.longDescription ?? '',
        image: productImage(product),
        price: product.price ?? 0,
        priceBefore: Number.isFinite(before) && before > (product.price ?? 0) ? before : null,
        serves: typeof product.c_pjServes === 'string' ? product.c_pjServes : null,
        occasions: toStringList(product.c_pjOccasion),
        dispatch,
        validFrom: typeof product.c_pjValidFrom === 'string' ? product.c_pjValidFrom : null,
        validTo: typeof product.c_pjValidTo === 'string' ? product.c_pjValidTo : null,
        slots: parseSlots(product.c_pjSlots),
        hasBuilder: hasBuilder(product.id),
        pickupOnly:
            dispatch === 'pickup' || (product.id === 'cb-super-duo' && (promoPickup || !!options.forcePickupOnly)),
    };
}

/** Texto de la modalidad en la tarjeta. */
export function dispatchKey(offer: Pick<Offer, 'dispatch' | 'pickupOnly'>): 'both' | 'pickup' | 'delivery' {
    if (offer.pickupOnly) return 'pickup';
    return offer.dispatch;
}

/** Ordena: la destacada primero, el resto como llega de Commerce. */
export function orderOffers(offers: readonly Offer[]): Offer[] {
    return [...offers].sort((a, b) => Number(b.id === FEATURED_OFFER_ID) - Number(a.id === FEATURED_OFFER_ID));
}

/** Suma `utm_*` de la URL a un destino interno para no perder la campaña. */
export function withUtm(path: string, search: string | URLSearchParams): string {
    const source = typeof search === 'string' ? new URLSearchParams(search) : search;
    const utm = new URLSearchParams();
    source.forEach((value, key) => {
        if (key.startsWith('utm_')) utm.append(key, value);
    });
    const query = utm.toString();
    if (!query) return path;
    return path.includes('?') ? `${path}&${query}` : `${path}?${query}`;
}
