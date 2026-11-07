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
import type { PizzaCrust, PizzaSize, PizzaVariant } from './pizza';

/**
 * Pizza mitad y mitad (R2.1, 02 p3, CONTRATO §4.1): producto `pz-mitades` (variantes de tamaño y masa)
 * con los atributos de línea `c_pjHalves` (`[{"part":1,"product":"pz-pollo-bbq"},…]`) y `c_pjParts` (2).
 *
 * **El precio lo calcula el carrito** (hook `dw.order.calculate` de DAT: promedio de las mitades). Aquí
 * no se calcula el total: se muestran los precios de cada especialidad para explicar «pagas el promedio»
 * y el total que devuelve el carrito.
 */

export const HALVES_PRODUCT_ID = 'pz-mitades';
export const HALVES_PARTS = 2;

/** Orden de la grilla del lienzo (Mitades.dc.html). Las demás especialidades van al final. */
export const HALVES_FLAVOR_ORDER: readonly string[] = [
    'pz-pollo-bbq',
    'pz-super-pepperoni',
    'pz-todas-las-carnes',
    'pz-boom-de-jamon',
    'pz-italiana',
    'pz-la-cordillerana',
    'pz-napolitana-caprese',
    'pz-pollo-caprese',
    'pz-napolitana-cherry',
    'pz-the-works',
    'pz-espinacas-a-la-crema',
    'pz-vegetariana',
    'pz-canadian-bacon',
    'pz-napolitana',
    'pz-hawaiana',
    'pz-meat-and-great',
];

export interface HalfFlavor {
    /** ID del maestro de la especialidad (`pz-pollo-bbq`). */
    id: string;
    name: string;
    image: string | null;
    /** Precio de la especialidad por tamaño (masa Tradicional) para explicar el promedio. */
    prices: Record<string, number>;
}

export interface HalvesConfig {
    productId: string;
    name: string;
    sensory: string | null;
    sizes: PizzaSize[];
    crusts: PizzaCrust[];
    variants: PizzaVariant[];
    flavors: HalfFlavor[];
}

export interface HalvesSelection {
    size: string;
    crust: string;
    /** Especialidad de cada mitad (izquierda, derecha); `null` = sin elegir. */
    halves: Array<string | null>;
}

export interface HalfEntry {
    part: number;
    product: string;
}

/** Texto de `c_pjHalves` para la línea. */
export function serializeHalves(halves: Array<string | null>): string {
    const entries: HalfEntry[] = halves
        .map((product, index) => (product ? { part: index + 1, product } : null))
        .filter((entry): entry is HalfEntry => entry !== null);
    return JSON.stringify(entries);
}

/** Especialidades de una línea de mitades, en orden de parte. Tolera texto inválido (devuelve `[]`). */
export function parseHalves(raw: unknown): string[] {
    let value: unknown = raw;
    if (typeof raw === 'string') {
        try {
            value = JSON.parse(raw);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(value)) return [];
    return value
        .filter(
            (entry): entry is HalfEntry =>
                !!entry && typeof entry === 'object' && typeof (entry as HalfEntry).product === 'string'
        )
        .sort((a, b) => (a.part ?? 0) - (b.part ?? 0))
        .map((entry) => entry.product);
}

/** ¿La línea del carrito es una pizza por mitades? */
export function isHalvesItem(item: { productId?: string; c_pjHalves?: unknown }): boolean {
    return Boolean(item.c_pjHalves) || (item.productId ?? '').startsWith(`${HALVES_PRODUCT_ID}-`);
}

/** «½ Pollo BBQ · ½ Todas las Carnes» */
export function halvesLabel(names: string[]): string {
    return names.map((name) => `½ ${name}`).join(' · ');
}

/** Ruta del armador. `first`/`second` precargan mitades; `item` edita una línea del carrito. */
export const HALVES_ROUTE = '/mitades';

export function halvesHref(options: { first?: string; second?: string; item?: string } = {}): string {
    const params = new URLSearchParams();
    if (options.item) params.set('item', options.item);
    if (options.first) params.set('primera', options.first);
    if (options.second) params.set('segunda', options.second);
    const query = params.toString();
    return query ? `${HALVES_ROUTE}?${query}` : HALVES_ROUTE;
}

/** Ordena las especialidades como la grilla del lienzo. */
export function sortFlavors<T extends { id: string }>(flavors: T[]): T[] {
    const rank = (id: string) => {
        const index = HALVES_FLAVOR_ORDER.indexOf(id);
        return index === -1 ? HALVES_FLAVOR_ORDER.length : index;
    };
    return [...flavors].sort((a, b) => rank(a.id) - rank(b.id));
}

/** Selección inicial: Familiar + Tradicional y las mitades pedidas (solo especialidades válidas). */
export function initialHalvesSelection(
    config: HalvesConfig,
    halves: Array<string | null | undefined>,
    size = 'family',
    crust = 'traditional'
): HalvesSelection {
    const valid = new Set(config.flavors.map((f) => f.id));
    const parts = Array.from({ length: HALVES_PARTS }, (_, i) => {
        const id = halves[i];
        return id && valid.has(id) ? id : null;
    });
    const sizeId = config.sizes.some((s) => s.id === size) ? size : (config.sizes[0]?.id ?? size);
    const crustOk = config.variants.some((v) => v.size === sizeId && v.crust === crust);
    const crustId = crustOk
        ? crust
        : (config.variants.find((v) => v.size === sizeId && v.crust === 'traditional')?.crust ??
          config.variants.find((v) => v.size === sizeId)?.crust ??
          crust);
    return { size: sizeId, crust: crustId, halves: parts };
}

/**
 * Precio de la pizza por mitades que muestra el botón (R2.1, AUD P1-3): el promedio del precio de las dos
 * especialidades en el tamaño elegido (masa Tradicional), redondeado al peso, más el recargo de la masa.
 * `null` mientras falte una mitad o el precio de alguna. **Es lo que cobrará el hook de DAT**: mientras los
 * hooks de SCAPI estén apagados, el carrito cobra el precio base de `pz-mitades` y no este monto.
 */
export function halvesPrice(
    flavors: ReadonlyArray<Pick<HalfFlavor, 'prices'> | null>,
    size: string,
    crustSurcharge = 0
): number | null {
    if (flavors.length !== HALVES_PARTS) return null;
    const prices = flavors.map((f) => f?.prices[size]);
    if (prices.some((p) => typeof p !== 'number' || !Number.isFinite(p))) return null;
    const average = (prices as number[]).reduce((sum, p) => sum + p, 0) / prices.length;
    return Math.round(average) + crustSurcharge;
}

/** Índice de la primera mitad vacía (o -1 si están todas). */
export function nextEmptyHalf(halves: Array<string | null>): number {
    return halves.findIndex((h) => !h);
}

export interface HalvesBuilderData {
    config: HalvesConfig | null;
    /** Mitades iniciales (de `primera`/`segunda` o de la línea `item`). */
    halves: Array<string | null>;
    size: string | null;
    crust: string | null;
    /** Modo edición: línea del carrito que se actualiza con «Guardar cambios». */
    itemId: string | null;
}
