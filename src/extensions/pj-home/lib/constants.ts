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
