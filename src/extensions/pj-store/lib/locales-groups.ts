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
/** @sfdc-extension-file SFDC_EXT_PJ_STORE */
import { isStoreClosed, type PjStore } from './store-info';

/** Cuántas tiendas van en «Cerca de ti» (UX-2 N5). */
export const NEAR_COUNT = 3;

export interface LocalesGroups {
    /** La tienda que lleva el único botón relleno: la elegida o, si no hay, la más cercana abierta. */
    featured: PjStore | null;
    /** `true` si `featured` es la tienda guardada en `pj_fulfillment` («Tu tienda»). */
    featuredIsMine: boolean;
    /** «Tu tienda» cuando no está entre las cercanas: va arriba, sola. */
    pinned: PjStore | null;
    /** «Cerca de ti»: las primeras por distancia. */
    near: PjStore[];
    /** «Todas las tiendas» (colapsado): el resto, sin repetir las de arriba. */
    rest: PjStore[];
}

/**
 * Agrupa las tiendas de Locales (UX-2 N5): un solo destacado, «Cerca de ti» con las 3 primeras y
 * «Todas las tiendas» con las demás. Las tiendas llegan ordenadas por distancia.
 */
export function groupLocales(stores: PjStore[], myStoreId?: string | null): LocalesGroups {
    const mine = myStoreId ? (stores.find((s) => s.id === myStoreId) ?? null) : null;
    const near = stores.slice(0, NEAR_COUNT);
    const pinned = mine && !near.includes(mine) ? mine : null;
    const featured = mine ?? near.find((s) => !isStoreClosed(s)) ?? near[0] ?? null;
    const rest = stores.slice(NEAR_COUNT).filter((s) => s !== pinned);
    return { featured, featuredIsMine: Boolean(mine), pinned, near, rest };
}

/** Caja de Santiago que cubre las 23 tiendas de la demo (lat/lon), con un poco de aire. */
export const SANTIAGO_BOUNDS = { north: -33.32, south: -33.63, west: -70.8, east: -70.47 } as const;

/**
 * Proyecta lat/lon a coordenadas del SVG del mapa (equirectangular corregida por la latitud).
 * Fuera de la caja devuelve `null` (no se dibuja el pin).
 */
export function projectToMap(
    point: { latitude?: number; longitude?: number },
    width: number,
    height: number
): { x: number; y: number } | null {
    const { latitude, longitude } = point;
    if (latitude === undefined || longitude === undefined) return null;
    const { north, south, west, east } = SANTIAGO_BOUNDS;
    if (latitude > north || latitude < south || longitude < west || longitude > east) return null;
    return {
        x: ((longitude - west) / (east - west)) * width,
        y: ((north - latitude) / (north - south)) * height,
    };
}
