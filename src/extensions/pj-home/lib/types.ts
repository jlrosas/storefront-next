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

import type { DemoMoment, DemoProfile } from '@/extensions/pj-shared/lib/profile';

/** Una oferta o producto con foto, nombre y precio del catálogo (un solo nombre y precio, regla 3 de 01). */
export interface OfferVM {
    id: string;
    name: string;
    price: number;
    /** Precio «antes» (`c_pjPriceBefore`). */
    listPrice: number | null;
    image: string;
    imageAlt: string;
    /** «Para 3–4» (`c_pjServes`). */
    serves: string | null;
    /** Texto que se saborea (`c_pjSensory`). */
    sensory: string | null;
    href: string;
}

/** Tarjeta de «Las más pedidas» / «Más vendidos». */
export interface PopularVM {
    id: string;
    name: string;
    /** Insignia: `mas-pedida`, `ideal-para-2`, `novedad`. */
    badge: string | null;
    rating: number | null;
    weekly: number | null;
    sensory: string | null;
    /** Precio de la variante Familiar tradicional. */
    familyPrice: number | null;
    image: string;
    imageAlt: string;
    href: string;
    /** Variante Familiar tradicional para el «+» de agregar en un toque (HOM-07, P2-11). */
    quickAddId?: string | null;
}

/** Tarjeta de un carrusel por intención (HOM-07, P2-13). */
export interface RailItemVM {
    id: string;
    name: string;
    image: string;
    imageAlt: string;
    price: number;
    listPrice: number | null;
    /** `true` si el precio es «desde» (pizza con varios tamaños). */
    from: boolean;
    rating: number | null;
    href: string;
}

/** Carrusel por intención: «Para compartir», «Menos de $15 mil». */
export interface IntentVM {
    id: 'compartir' | 'economico';
    items: RailItemVM[];
}

/** Fotos destacadas (P2-17): URL lista para `scaledImage`, o `null` si no hay foto base del catálogo. */
export interface FeaturePhotosVM {
    cheesePull: string | null;
    napocherry: string | null;
}

/** Una opción de «¿Para cuántos?». `lines` solo viene en «Para 3» (se agrega al carrito). */
export interface OccasionVM {
    key: 'para-1' | 'para-2' | 'para-3' | 'para-4' | 'para-6';
    name: string;
    price: number;
    listPrice: number | null;
    image: string;
    imageAlt: string;
    href: string | null;
    /** Líneas que agrega «Para 3» (la suma de sus precios es `price`). */
    lines?: { productId: string; name: string; price: number }[];
}

export interface MomentVM {
    id: DemoMoment;
    offer: OfferVM;
}

export interface FavoriteVM {
    id: string;
    name: string;
    image: string;
    imageAlt: string;
    /** Veces que la pidió. */
    times: number;
    price: number | null;
    href: string;
}

export interface LastOrderVM {
    orderNo: string;
    /** ISO de la fecha visible del pedido (`c_pjPlacedAt`). */
    placedAt: string;
    total: number;
    /** «Pollo BBQ Familiar sin cebolla + Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L». */
    summary: string;
    heroImage: string;
    heroAlt: string;
    thumbs: { src: string; alt: string }[];
    storeLabel: string;
}

export interface SofiaVM {
    firstName: string;
    points: number;
    lastOrder: LastOrderVM | null;
    favorites: FavoriteVM[];
    /** Pizza canjeable (`c_pjRedeemPoints`) que alcanza con el saldo. */
    redeem: { id: string; name: string; image: string; points: number } | null;
    /** `true` si salen del cliente real; `false` si son los datos de ejemplo del lienzo. */
    live: boolean;
}

export interface HomeData {
    profile: DemoProfile;
    moment: DemoMoment;
    /** Hero de temporada (Valentina) o de la campaña (Diego). */
    hero: OfferVM | null;
    /** Pizza del Mes (tarjeta de Sofía). */
    month: OfferVM | null;
    popular: PopularVM[];
    occasions: OccasionVM[];
    moments: MomentVM[];
    /** Carruseles por intención (Valentina). */
    intents?: IntentVM[];
    features?: FeaturePhotosVM;
    sofia: SofiaVM | null;
}
