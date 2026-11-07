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
import type { DemoMoment } from '@/extensions/pj-shared/lib/profile';

/** Pizza del Mes de noviembre (S-D1): The Works Familiar. */
export const SEASON_OFFER_ID = 'cb-pizza-del-mes';
export const AD_OFFER_ID = 'cb-super-duo';

/** Rutas finales de los destinos (otras áreas las construyen). */
export const HOME_ROUTES = {
    menu: '/menu',
    superDuo: '/promos/super-duo',
    superTrio: '/promos/super-trio',
    checkout: '/checkout',
    login: '/login',
} as const;

export function productHref(id: string): string {
    return `/p/${id}`;
}

/** Pizzas de «Las más pedidas» (R4.4). */
export const POPULAR_IDS = ['pz-pollo-bbq', 'pz-super-pepperoni', 'pz-todas-las-carnes'] as const;

/** «Para 3» (S-D1, tabla 1.1): Pizza del Mes The Works + Palitos de Ajo + Coca-Cola 1,5 L, suma real. */
export const FOR_THREE_IDS = [SEASON_OFFER_ID, 'cp-palitos-de-ajo', 'cp-coca-cola-2'] as const;

/** Ocasión → combo (S-D2). */
export const MOMENT_OFFER_IDS: Record<DemoMoment, string> = {
    almuerzo: 'cb-papa-flash',
    partido: 'cb-super-trio',
    celebracion: 'cb-papa-combo-postre',
    bajon: 'cb-papa-combo-palitos',
};

/** Momento que se muestra cuando la hora no es de ninguna ocasión. */
export const DEFAULT_MOMENT: DemoMoment = 'partido';

export const OCCASION_IDS = {
    'para-1': 'cb-papa-flash',
    'para-2': 'cb-papa-combo-palitos',
    'para-4': 'cb-super-duo',
    'para-6': 'cb-super-trio',
} as const;

/** Super Pepperoni mediana, canjeable con puntos (S-D12). */
export const REDEEM_ID = 'pz-super-pepperoni';
export const REDEEM_POINTS = 260;
/** Opinión mínima de «N esta semana» para mostrarse (HOM-01 criterio 4). */
export const MIN_WEEKLY_ORDERS = 100;

/** Carrusel por intención de Valentina (HOM-07, UX-1 P2-13): «Para compartir». Destino: constructor o ficha. */
export const SHARE_IDS = ['cb-super-duo', 'cb-super-trio', 'cb-papa-combo-palitos', 'cb-papa-combo-postre'] as const;
/** «Menos de $15 mil»: candidatos; se muestran los que el catálogo tenga bajo el tope. */
export const BUDGET_IDS = [
    'cb-papa-flash',
    'cb-pizza-del-mes',
    'pz-napolitana-cherry',
    'pz-napolitana',
    'pz-hawaiana',
    'pz-vegetariana',
] as const;
export const BUDGET_MAX_CLP = 15000;

/**
 * Fotos destacadas del catálogo (UX-1 §3.2 y P2-17): están en la misma carpeta estática del catálogo que el
 * resto de las fotos. `cheesePull`: una mano levanta una porción con el queso estirándose. `napocherry`:
 * primer plano con pepperoncini (el moodboard del playbook, p. 97).
 */
export const FEATURE_PHOTOS = {
    cheesePull: 'napolitana-familiar-1788736846.jpg',
    napocherry: 'napocherry-1730987248.jpg',
} as const;

/** Destino de un producto de la Home: los combos armables van a su constructor. */
export function offerHref(id: string): string {
    if (id === AD_OFFER_ID) return HOME_ROUTES.superDuo;
    if (id === 'cb-super-trio') return HOME_ROUTES.superTrio;
    return productHref(id);
}
