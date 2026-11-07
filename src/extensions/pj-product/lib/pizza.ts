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

/**
 * Modelo del configurador de pizza (hoja «Arma tu pizza» y ficha). Funciones puras: sirven en el
 * servidor (loader) y en el cliente (precio en vivo). Nombres del catálogo según CONTRATO §4.1 y §7:
 * - Tamaño y masa: variantes `pjSize` / `pjCrust`.
 * - Ingredientes base: `c_pjBaseIngredients` (IDs sin prefijo → productos `ing-<id>`).
 * - Extras: una opción por ingrediente, `pjExtras_<id>`, con valores `no` y `si`.
 * - Quitados: atributo de línea `c_pjRemoved` (lista de IDs).
 */

export type PizzaSizeId = 'individual' | 'medium' | 'family' | 'extra_large' | (string & {});

/** Tamaños que dibuja el lienzo (Sheet-Pizza, PDP). La Individual existe en el catálogo pero no en la hoja. */
export const SHEET_SIZES: readonly string[] = ['medium', 'family', 'extra_large'];

/** Orden de las masas en la hoja: las incluidas primero y los bordes con recargo al final. */
export const CRUST_ORDER: readonly string[] = ['traditional', 'thin', 'parmesan', 'stuffed', 'parmesan_base'];

/** Preselección de la hoja (04 regla 2): lo más pedido. */
export const DEFAULT_SIZE = 'family';
export const DEFAULT_CRUST = 'traditional';

/** Extras que se muestran primero (los del lienzo); el resto queda en «Ver más ingredientes». */
export const FEATURED_EXTRAS: readonly string[] = [
    'extra-mozzarella',
    'pepperoni',
    'champinon',
    'choclo',
    'tomate-cherry',
    'pina',
];

/** Precio del extra por tamaño cuando el producto no trae `c_pjExtraPrices` (CONTRATO §4.1). */
export const FALLBACK_EXTRA_PRICES: Readonly<Record<string, number>> = {
    medium: 1450,
    family: 1940,
    extra_large: 2290,
};

export const EXTRA_OPTION_PREFIX = 'pjExtras_';

export interface PizzaImage {
    src: string;
    alt: string;
}

export interface PizzaVariant {
    productId: string;
    size: string;
    crust: string;
    price: number;
    orderable: boolean;
}

export interface PizzaSize {
    id: string;
    label: string;
    /** Precio de la masa más barata de ese tamaño (la que se muestra en el botón del tamaño). */
    price: number;
    /** «Para 3–4» (`c_pjServes` de la variante). */
    serves: string | null;
    /** Precio de cada ingrediente extra en este tamaño. */
    extraPrice: number;
}

export interface PizzaCrust {
    id: string;
    label: string;
}

export interface PizzaIngredient {
    /** ID sin prefijo (`cebolla`), el mismo de `c_pjBaseIngredients`, `c_pjRemoved` y `pjExtras_<id>`. */
    id: string;
    /** Nombre para mostrar («Cebolla», «Mozzarella»). */
    name: string;
    image: string | null;
    /** `c_pjIngredientGroup` (para sugerir un sustituto del mismo grupo). */
    group: string | null;
    /** Disponible en la tienda elegida (inventario de la tienda). Sin tienda, siempre `true`. */
    available: boolean;
}

export interface PizzaStore {
    id: string;
    /** «El Bosque» (sin «Papa Johns»). */
    name: string;
    inventoryId: string;
    mode: 'pickup' | 'delivery';
    pickupMinutes: number | null;
    deliveryMinutes: number | null;
}

export interface PizzaConfig {
    /** ID del maestro (`pz-pollo-bbq`). */
    productId: string;
    name: string;
    kind: string;
    /** Texto que se saborea (`c_pjSensory`). */
    sensory: string | null;
    /** Lo que lleva («Queso mozzarella, pollo…»). */
    description: string | null;
    image: PizzaImage | null;
    rating: number | null;
    reviewCount: number | null;
    weeklyOrders: number | null;
    badges: string[];
    /** `c_pjFoodType`: `vegetariana`, `picante`. */
    foodTypes: string[];
    halvesEnabled: boolean;
    sizes: PizzaSize[];
    crusts: PizzaCrust[];
    variants: PizzaVariant[];
    base: PizzaIngredient[];
    extras: PizzaIngredient[];
    store: PizzaStore | null;
}

export interface PizzaSelection {
    size: string;
    crust: string;
    /** IDs de ingredientes base quitados (`c_pjRemoved`). */
    removed: string[];
    /** IDs de extras agregados (`pjExtras_<id>` = `si`). */
    extras: string[];
    quantity: number;
}

/** Línea del carrito tal como la necesita el configurador (subconjunto del `ProductItem` de SCAPI). */
export interface PizzaBasketItem {
    itemId?: string;
    productId?: string;
    quantity?: number;
    optionItems?: Array<{ optionId?: string; optionValueId?: string }>;
    c_pjRemoved?: string[] | string | null;
    [key: string]: unknown;
}

export const MAX_QUANTITY = 10;

/**
 * Nombre del ingrediente como lo escribe el lienzo: «Mozzarella base» → «Mozzarella», «Tomate Cherry» →
 * «Tomate cherry». Las siglas en mayúsculas (BBQ) se conservan.
 */
export function displayIngredientName(name: string): string {
    const words = name
        .replace(/\s+base$/i, '')
        .trim()
        .split(/\s+/);
    return words
        .map((word, index) => {
            if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
            if (word.length > 1 && word === word.toUpperCase()) return word;
            return word.toLowerCase();
        })
        .join(' ');
}

/** «Sin cebolla», «sin salsa BBQ»: el nombre en minúsculas salvo siglas. */
export function lowerIngredientName(name: string): string {
    return name
        .split(/\s+/)
        .map((word) => (word.length > 1 && word === word.toUpperCase() ? word : word.toLowerCase()))
        .join(' ');
}

/** Tamaños y masas con variante real para el tamaño, en el orden de la hoja. */
export function crustsForSize(config: Pick<PizzaConfig, 'crusts' | 'variants'>, size: string): PizzaCrust[] {
    const ids = new Set(config.variants.filter((v) => v.size === size).map((v) => v.crust));
    return config.crusts.filter((crust) => ids.has(crust.id));
}

export function findVariant(
    config: Pick<PizzaConfig, 'variants'>,
    size: string,
    crust: string
): PizzaVariant | undefined {
    return config.variants.find((v) => v.size === size && v.crust === crust);
}

/** Precio más bajo del tamaño (la base sobre la que se cobra el recargo de la masa). */
export function basePriceForSize(config: Pick<PizzaConfig, 'variants'>, size: string): number {
    const prices = config.variants.filter((v) => v.size === size).map((v) => v.price);
    return prices.length ? Math.min(...prices) : 0;
}

/** Recargo de la masa en ese tamaño según el catálogo (0 = «Incluida»). */
export function crustSurcharge(config: Pick<PizzaConfig, 'variants'>, size: string, crust: string): number {
    const variant = findVariant(config, size, crust);
    if (!variant) return 0;
    return Math.max(0, variant.price - basePriceForSize(config, size));
}

/**
 * Corrige una selección para que siempre apunte a una variante real: si la masa no existe en el
 * tamaño, vuelve a la Tradicional (o a la primera disponible). Quita extras agotados.
 */
export function normalizeSelection(config: PizzaConfig, selection: PizzaSelection): PizzaSelection {
    const size = config.sizes.some((s) => s.id === selection.size)
        ? selection.size
        : (config.sizes.find((s) => s.id === DEFAULT_SIZE)?.id ?? config.sizes[0]?.id ?? selection.size);
    const crusts = crustsForSize(config, size);
    const crust = crusts.some((c) => c.id === selection.crust)
        ? selection.crust
        : (crusts.find((c) => c.id === DEFAULT_CRUST)?.id ?? crusts[0]?.id ?? selection.crust);
    const baseIds = new Set(config.base.map((b) => b.id));
    const extraIds = new Set(config.extras.filter((e) => e.available).map((e) => e.id));
    return {
        size,
        crust,
        removed: [...new Set(selection.removed)].filter((id) => baseIds.has(id)),
        extras: [...new Set(selection.extras)].filter((id) => extraIds.has(id)),
        quantity: Math.min(MAX_QUANTITY, Math.max(1, Math.floor(selection.quantity) || 1)),
    };
}

/** Selección con la que abre la hoja (04 regla 2): Familiar + Tradicional, sin cambios, 1 unidad. */
export function defaultSelection(config: PizzaConfig): PizzaSelection {
    return normalizeSelection(config, {
        size: DEFAULT_SIZE,
        crust: DEFAULT_CRUST,
        removed: [],
        extras: [],
        quantity: 1,
    });
}

export function extraPriceForSize(config: Pick<PizzaConfig, 'sizes'>, size: string): number {
    return config.sizes.find((s) => s.id === size)?.extraPrice ?? FALLBACK_EXTRA_PRICES[size] ?? 0;
}

/**
 * Precio unitario en vivo (04 regla 3): precio de la variante (tamaño + masa) + extras × precio por
 * tamaño. Quitar ingredientes no cambia el precio (regla 4).
 */
export function unitPrice(config: PizzaConfig, selection: PizzaSelection): number {
    const variant = findVariant(config, selection.size, selection.crust);
    const base = variant?.price ?? basePriceForSize(config, selection.size);
    return base + selection.extras.length * extraPriceForSize(config, selection.size);
}

export function totalPrice(config: PizzaConfig, selection: PizzaSelection): number {
    return unitPrice(config, selection) * selection.quantity;
}

/**
 * Sustituto sugerido para un extra agotado: el primer extra disponible del mismo grupo, priorizando
 * los destacados del lienzo («Agotado hoy en El Bosque · prueba el choclo»).
 */
export function substituteFor(config: Pick<PizzaConfig, 'extras'>, extraId: string): PizzaIngredient | null {
    const target = config.extras.find((e) => e.id === extraId);
    if (!target) return null;
    const candidates = config.extras.filter(
        (e) => e.id !== extraId && e.available && (target.group ? e.group === target.group : true)
    );
    const rank = (e: PizzaIngredient) => {
        const index = FEATURED_EXTRAS.indexOf(e.id);
        return index === -1 ? FEATURED_EXTRAS.length : index;
    };
    return [...candidates].sort((a, b) => rank(a) - rank(b))[0] ?? null;
}

/** Extras ordenados: los destacados del lienzo primero, luego el resto en el orden del catálogo. */
export function sortExtras<T extends { id: string }>(extras: T[]): T[] {
    const rank = (id: string) => {
        const index = FEATURED_EXTRAS.indexOf(id);
        return index === -1 ? FEATURED_EXTRAS.length : index;
    };
    return extras
        .map((extra, index) => ({ extra, index }))
        .sort((a, b) => rank(a.extra.id) - rank(b.extra.id) || a.index - b.index)
        .map(({ extra }) => extra);
}

export interface SelectionSummaryLabels {
    /** «sin {{name}}» */
    without: (name: string) => string;
    /** «+ {{name}}» */
    plus: (name: string) => string;
}

/**
 * «Familiar · Tradicional · sin cebolla · + Choclo» (línea de resumen de la hoja y la ficha). Los extras van con
 * su nombre («+ Pepperoni»), igual que en el carrito de CAR (`pj-cart/lib/line-summary.ts`).
 */
export function selectionSummary(
    config: PizzaConfig,
    selection: PizzaSelection,
    labels: SelectionSummaryLabels
): string {
    const parts: string[] = [];
    const size = config.sizes.find((s) => s.id === selection.size);
    const crust = config.crusts.find((c) => c.id === selection.crust);
    if (size) parts.push(size.label);
    if (crust) parts.push(crust.label);
    for (const ingredient of config.base) {
        if (selection.removed.includes(ingredient.id)) parts.push(labels.without(lowerIngredientName(ingredient.name)));
    }
    for (const ingredient of config.extras) {
        if (selection.extras.includes(ingredient.id)) parts.push(labels.plus(ingredient.name));
    }
    return parts.join(' · ');
}

/**
 * `optionItems` para SCAPI. Al agregar basta con los `si` (SCAPI completa el resto con `no`, verificado
 * con el carrito real el 06-nov). Al editar hay que mandar también los `no` para apagar lo que estaba.
 */
export function optionItemsFor(
    config: Pick<PizzaConfig, 'extras'>,
    extras: string[],
    mode: 'add' | 'edit' = 'add'
): Array<{ optionId: string; optionValueId: 'si' | 'no' }> {
    if (mode === 'add') {
        return extras.map((id) => ({ optionId: `${EXTRA_OPTION_PREFIX}${id}`, optionValueId: 'si' as const }));
    }
    return config.extras.map((extra) => ({
        optionId: `${EXTRA_OPTION_PREFIX}${extra.id}`,
        optionValueId: extras.includes(extra.id) ? ('si' as const) : ('no' as const),
    }));
}

/** IDs quitados de una línea (`c_pjRemoved` llega como lista; se tolera texto JSON o separado por comas). */
export function removedFromItem(item: Pick<PizzaBasketItem, 'c_pjRemoved'>): string[] {
    const raw = item.c_pjRemoved;
    if (Array.isArray(raw)) return raw.filter((id): id is string => typeof id === 'string' && id !== '');
    if (typeof raw === 'string' && raw.trim() !== '') {
        try {
            const parsed: unknown = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed.filter((id): id is string => typeof id === 'string');
        } catch {
            return raw
                .split(',')
                .map((id) => id.trim())
                .filter(Boolean);
        }
    }
    return [];
}

/** Extras en `si` de una línea. */
export function extrasFromItem(item: Pick<PizzaBasketItem, 'optionItems'>): string[] {
    return (item.optionItems ?? [])
        .filter((o) => o.optionValueId === 'si' && o.optionId?.startsWith(EXTRA_OPTION_PREFIX))
        .map((o) => (o.optionId as string).slice(EXTRA_OPTION_PREFIX.length));
}

/** Selección marcada a partir de una línea existente del carrito (PRO-05, modo edición). */
export function selectionFromItem(config: PizzaConfig, item: PizzaBasketItem): PizzaSelection {
    const variant = config.variants.find((v) => v.productId === item.productId);
    return normalizeSelection(config, {
        size: variant?.size ?? DEFAULT_SIZE,
        crust: variant?.crust ?? DEFAULT_CRUST,
        removed: removedFromItem(item),
        extras: extrasFromItem(item),
        quantity: item.quantity ?? 1,
    });
}

/** ¿El producto se arma en la hoja? (pizzas y «Arma tu pizza»; no mitades ni combos). */
export function isConfigurablePizza(product: { id?: string; c_pjKind?: unknown }): boolean {
    if (product.c_pjKind === 'pizza') return true;
    return product.c_pjKind === 'builder' && product.id !== 'pz-mitades';
}
