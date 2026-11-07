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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import type { DemoMoment, DemoProfile } from '@/extensions/pj-shared/lib/profile';

/**
 * Modelo del menú (MEN-01): lo que el servidor arma a partir de la búsqueda de SCAPI y lo que la
 * página pinta. Sin dependencias de servidor: se prueba y se importa también desde el cliente.
 * Atributos del catálogo: CONTRATO §4.1 y §7.
 */

export type PjSize = 'medium' | 'family' | 'extra_large';
export const PJ_SIZES: readonly PjSize[] = ['medium', 'family', 'extra_large'];
/** Familiar por defecto (criterio MEN-01.3). */
export const DEFAULT_SIZE: PjSize = 'family';
/** Masa con la que se compara el precio por tamaño. */
export const COMPARE_CRUST = 'traditional';

export type MenuKind = 'pizza' | 'builder' | 'combo' | 'side' | 'drink' | 'dessert' | 'extra';

/** Subcategorías de `pizzas` en el orden del lienzo. */
export const PIZZA_GROUP_IDS = [
    'pizzas-clasicas',
    'pizzas-favoritas',
    'pizzas-premium',
    'pan-pizza',
    'pizzas-croissant',
] as const;
export type PizzaGroupId = (typeof PIZZA_GROUP_IDS)[number];

export type PizzaFilter = 'all' | 'top' | 'veg' | 'spicy';
export const PIZZA_FILTERS: readonly PizzaFilter[] = ['all', 'top', 'veg', 'spicy'];

export interface MenuImage {
    src: string;
    srcSet?: string;
    alt: string;
}

export interface MenuOption {
    /** ID de la variante que se agrega al carrito. */
    id: string;
    label: string;
    price: number;
}

export interface MenuProduct {
    id: string;
    name: string;
    kind: MenuKind;
    image: MenuImage | null;
    /** Precio base (el menor de la búsqueda). */
    price: number;
    /** `c_pjPriceBefore` (ofertas). */
    listPrice: number | null;
    sensory: string | null;
    rating: number | null;
    reviews: number | null;
    serves: string | null;
    badges: string[];
    foodTypes: string[];
    /** `c_pjHalvesEnabled`: tiene «½ Mitad». */
    halves: boolean;
    weeklyOrders: number;
    /** Pizzas con tamaños: variante y precio (masa tradicional) por tamaño. */
    sizes?: Partial<Record<PjSize, { id: string; price: number }>>;
    /** Pan Pizza y Croissant: único tamaño. */
    single?: { id: string; price: number; label: 'medium' | 'single' };
    /** Bebidas, helados, rolls…: variaciones que no son tamaño de pizza. */
    options?: MenuOption[];
    validFrom: string | null;
    validTo: string | null;
}

export interface PizzaGroup {
    id: PizzaGroupId;
    products: MenuProduct[];
}

export interface MenuData {
    offers: MenuProduct[];
    groups: PizzaGroup[];
    mitades: MenuProduct | null;
    arma: MenuProduct | null;
    sides: MenuProduct[];
    drinks: MenuProduct[];
    desserts: MenuProduct[];
    extras: MenuProduct[];
}

export function isPjSize(value: unknown): value is PjSize {
    return typeof value === 'string' && (PJ_SIZES as readonly string[]).includes(value);
}

export function isPizzaFilter(value: unknown): value is PizzaFilter {
    return typeof value === 'string' && (PIZZA_FILTERS as readonly string[]).includes(value);
}

export function pizzaCount(groups: readonly PizzaGroup[]): number {
    return groups.reduce((total, group) => total + group.products.length, 0);
}

/** Productos que el buscador recorre: «Busca entre N productos». */
export function totalProducts(menu: MenuData): number {
    return (
        menu.offers.length +
        pizzaCount(menu.groups) +
        (menu.mitades ? 1 : 0) +
        (menu.arma ? 1 : 0) +
        menu.sides.length +
        menu.drinks.length +
        menu.desserts.length +
        menu.extras.length
    );
}

/** Precio de una pizza en el tamaño elegido; `null` si no se vende en ese tamaño. */
export function priceAtSize(product: MenuProduct, size: PjSize): number | null {
    if (product.single) return product.single.price;
    return product.sizes?.[size]?.price ?? null;
}

/** Etiqueta del tamaño que acompaña al precio: «Familiar», «Mediana», «Única». */
export type SizeLabelKey = PjSize | 'single';
export function sizeLabelKey(product: MenuProduct, size: PjSize): SizeLabelKey {
    if (product.single) return product.single.label === 'single' ? 'single' : 'medium';
    return size;
}

export function matchesFilter(product: MenuProduct, filter: PizzaFilter): boolean {
    switch (filter) {
        case 'top':
            return product.badges.includes('mas-pedida');
        case 'veg':
            return product.foodTypes.includes('vegetariana');
        case 'spicy':
            return product.foodTypes.includes('picante');
        default:
            return true;
    }
}

/** Insignia que se dibuja sobre la foto: más vendida, picante, novedad o ideal para 2. */
export type BadgeKey = 'top' | 'spicy' | 'new' | 'forTwo';
export function badgeFor(product: MenuProduct): BadgeKey | null {
    if (product.badges.includes('mas-pedida')) return 'top';
    if (product.foodTypes.includes('picante')) return 'spicy';
    if (product.badges.includes('novedad')) return 'new';
    if (product.badges.includes('ideal-para-2')) return 'forTwo';
    return null;
}

export interface PriceRange {
    min: number;
    max: number;
}

/** Rango de precio de un grupo en el tamaño elegido (los productos sin ese tamaño no cuentan). */
export function groupPriceRange(products: readonly MenuProduct[], size: PjSize): PriceRange | null {
    const prices = products.map((p) => priceAtSize(p, size)).filter((n): n is number => typeof n === 'number');
    if (prices.length === 0) return null;
    return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function discountPercent(price: number, listPrice: number | null): number | null {
    if (!listPrice || listPrice <= price) return null;
    return Math.round(((listPrice - price) / listPrice) * 100);
}

/** Vigencia de una oferta (`c_pjValidFrom` / `c_pjValidTo`). */
export function isOfferValid(product: MenuProduct, now: Date = new Date()): boolean {
    const t = now.getTime();
    if (product.validFrom && new Date(product.validFrom).getTime() > t) return false;
    if (product.validTo && new Date(product.validTo).getTime() < t) return false;
    return true;
}

const OFFERS_BY_PROFILE: Record<DemoProfile, readonly string[]> = {
    valentina: ['cb-pizza-del-mes', 'cb-super-duo', 'cb-papa-combo-palitos', 'cb-papa-combo-postre'],
    diego: ['cb-super-duo', 'cb-super-trio', 'cb-pizza-del-mes', 'cb-papa-combo-palitos'],
    sofia: ['cb-papa-combo-palitos', 'cb-pizza-del-mes', 'cb-super-duo', 'cb-papa-flash'],
};

const OFFER_BY_MOMENT: Record<DemoMoment, string> = {
    almuerzo: 'cb-papa-flash',
    partido: 'cb-super-trio',
    celebracion: 'cb-papa-combo-postre',
    bajon: 'cb-papa-combo-palitos',
};

export const FEATURED_OFFERS = 4;

/**
 * Combos que se arman en su constructor (S-D3): Super Dúo y Super Trío nunca abren la ficha, porque
 * ahí se agregarían sin elegir las pizzas (AUD-compra P0-2).
 */
export const COMBO_BUILDER_HREFS: Readonly<Record<string, string>> = {
    'cb-super-duo': '/promos/super-duo',
    'cb-super-trio': '/promos/super-trio',
};

/** Destino de una tarjeta de oferta: su constructor si lo tiene; si no, la ficha del combo. */
export function offerHref(id: string): string {
    return COMBO_BUILDER_HREFS[id] ?? `/p/${id}`;
}

/**
 * Las ofertas más relevantes según el perfil y el momento (R4.1, R4.2): primero la del momento,
 * luego el orden del perfil y, si faltan, las de mayor descuento. Solo ofertas vigentes.
 */
export function rankOffers(
    offers: readonly MenuProduct[],
    profile: DemoProfile,
    moment: DemoMoment | null,
    now: Date = new Date()
): MenuProduct[] {
    const valid = offers.filter((offer) => isOfferValid(offer, now));
    const priority = [...(moment ? [OFFER_BY_MOMENT[moment]] : []), ...OFFERS_BY_PROFILE[profile]];
    const ranked: MenuProduct[] = [];
    for (const id of priority) {
        const found = valid.find((offer) => offer.id === id);
        if (found && !ranked.includes(found)) ranked.push(found);
    }
    const rest = valid
        .filter((offer) => !ranked.includes(offer))
        .sort((a, b) => (discountPercent(b.price, b.listPrice) ?? 0) - (discountPercent(a.price, a.listPrice) ?? 0));
    return [...ranked, ...rest];
}

/** Variante seleccionada por defecto de un producto con opciones: 1,5 L si existe; si no, la primera. */
export function defaultOption(options: readonly MenuOption[]): MenuOption | undefined {
    return options.find((option) => /1[.,]5/.test(option.label)) ?? options[0];
}
