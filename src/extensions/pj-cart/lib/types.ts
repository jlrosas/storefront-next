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
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import type { FulfillmentMode } from '@/extensions/pj-shared/lib/fulfillment';
import type { LineProducts } from './line-summary';
import type { CanjeState } from './cart-model';
import type { CrossSellCatalog } from '@/extensions/pj-product/lib/upsell';

/** Modalidad y tienda para la primera tarjeta del carrito (UX-2 §4 regla 2). */
export interface CartFulfillment {
    mode: FulfillmentMode;
    storeId: string;
    /** «El Bosque» (sin «Papa Johns»). */
    storeName: string | null;
    address: string | null;
    when: string;
    pickupMinutes: number | null;
    deliveryMinutes: number | null;
    /** `c_pjOpenUntil` de la tienda («23:30»). */
    openUntil: string | null;
    /** Interruptor `c_pjClosed` (caso 1 del panel) y hora de apertura («12:00»). */
    closed: boolean;
    opensAt: string | null;
}

/** Producto que ofrece el carrito (bebida, postre, pizza canjeable). */
export interface CartProduct {
    productId: string;
    name: string;
    price: number;
    image: string | null;
}

/** Lo que el carrito ofrece además de las líneas (UX-3 §3.5, §3.6 y §3.9). */
export interface CartExtras {
    /** «¿Y para tomar?» (Coca-Cola 1,5 L). */
    drink: CartProduct | null;
    /** «¿Cerramos con algo dulce?» (Cookie). */
    dessert: CartProduct | null;
    /** «Conviértelo en combo»: ahorro y foto según la promoción (nunca calculado en el cliente). */
    convert: { savings: number; image: string | null } | null;
    /** Pizza canjeable con sus puntos (`c_pjRedeemPoints`). */
    redeem: (CartProduct & { points: number }) | null;
    /** Foto del carrito vacío. */
    emptyImage: string | null;
    /** Foto del combo «Palitos y bebida». */
    comboImage: string | null;
    /** Bebidas por tamaño, acompañamientos y postres de «¿Le sumamos algo?» (S-D19). */
    crossSell: CrossSellCatalog;
}

/** Lo que el loader de `/cart` agrega para CAR. */
export interface PjCartData {
    lineProducts: LineProducts;
    fulfillment: CartFulfillment | null;
    extras: CartExtras;
    /** Canje de Papa Puntos guardado en la cookie `pj_canje` (lo comparte con CHK). */
    canje: CanjeState | null;
}
