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
import { HALVES_PRODUCT_ID } from './halves';

/**
 * Ofertas con constructor (S-D3). Mismo contrato que `BUILDER_OFFER_IDS` de OFE; se repite aquí para que
 * pj-product no dependa de otra extensión.
 */
export const BUILDER_COMBO_IDS: readonly string[] = ['cb-super-duo', 'cb-super-trio'];

/** Constructor de un combo: `cb-super-duo` → `/promos/super-duo`. */
export function builderPath(comboId: string): string {
    return `/promos/${comboId.replace(/^cb-/, '')}`;
}

/**
 * Qué ficha abre `/p/<id>` (PRO-08, regla 1 de 04: «el Agregar depende del tipo de producto, no del
 * nombre»). Ningún producto del catálogo cae en la ficha del template.
 *
 * Fuente del tipo, en este orden (lo que trae el catálogo del sandbox, CONTRATO §4.1):
 * 1. `c_pjKind` del producto (o de su maestro, si es una variante): `pizza`, `builder`, `combo`, `side`,
 *    `drink`, `dessert`, `extra`, `ingredient`.
 * 2. Sin `c_pjKind`: la categoría primaria (`ofertas`, `pizzas*`, `pan-pizza`, `acompanamientos`, `bebidas`,
 *    `postres`, `salsas-extras`).
 * 3. Sin ninguna de las dos: el prefijo del ID (`cb-` combo, `pz-` pizza; lo demás, producto simple).
 *
 * - `halves`: `pz-mitades` → armador `/mitades`.
 * - `pizza`: ficha con configurador (PRO-03).
 * - `builder`: Super Dúo y Super Trío → 302 a su constructor `/promos/<slug>` (S-D3).
 * - `combo`: ficha de combo con sus elecciones preseleccionadas (Pizza del Mes, Papa Flash, Papa Combo
 *   Palitos, Papa Combo con Postre).
 * - `simple`: acompañamientos, bebidas, postres y extras (tamaño o sabor en chips si tiene variantes).
 */
export type PjPdpView = 'halves' | 'pizza' | 'builder' | 'combo' | 'simple';

/** Tipo de producto simple (sirve para el texto de la ficha y para «Completa tu pedido»). */
export type SimpleKind = 'side' | 'drink' | 'dessert' | 'extra';

export interface ProductKindInput {
    id: string;
    c_pjKind?: unknown;
    primaryCategoryId?: string | null;
    primaryCategory?: { id?: string } | null;
    master?: { masterId?: string } | null;
}

const CATEGORY_KIND: Record<string, string> = {
    ofertas: 'combo',
    pizzas: 'pizza',
    'pizzas-clasicas': 'pizza',
    'pizzas-favoritas': 'pizza',
    'pizzas-premium': 'pizza',
    'pan-pizza': 'pizza',
    'pizzas-croissant': 'pizza',
    acompanamientos: 'side',
    bebidas: 'drink',
    postres: 'dessert',
    'salsas-extras': 'extra',
};

/** Tipo del producto según el catálogo (`c_pjKind` → categoría → prefijo del ID). */
export function productKind(product: ProductKindInput): string {
    if (typeof product.c_pjKind === 'string' && product.c_pjKind) return product.c_pjKind;
    const category = product.primaryCategory?.id ?? product.primaryCategoryId ?? '';
    if (CATEGORY_KIND[category]) return CATEGORY_KIND[category];
    const id = product.master?.masterId ?? product.id;
    if (id.startsWith('cb-')) return 'combo';
    if (id.startsWith('pz-')) return 'pizza';
    return 'side';
}

/** Vista de la ficha para el producto (ver `PjPdpView`). */
export function pdpViewFor(product: ProductKindInput): PjPdpView {
    const masterId = product.master?.masterId ?? product.id;
    if (masterId === HALVES_PRODUCT_ID) return 'halves';
    const kind = productKind(product);
    if (kind === 'pizza' || kind === 'builder') return 'pizza';
    if (kind === 'combo') return BUILDER_COMBO_IDS.includes(masterId) ? 'builder' : 'combo';
    return 'simple';
}

/** `side`, `drink`, `dessert` o `extra` (los ingredientes sueltos y lo desconocido se tratan como `side`). */
export function simpleKind(product: ProductKindInput): SimpleKind {
    const kind = productKind(product);
    return kind === 'drink' || kind === 'dessert' || kind === 'extra' ? kind : 'side';
}
