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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */

/**
 * Rutas de la demo (sin prefijo de sitio: se usan con `Link` de `@/components/link`).
 * El encabezado, la barra inferior y el footer navegan con estas rutas; quien construye la
 * página la crea con esta misma ruta. Si una página cambia de ruta, se pide a INT.
 */
export const PJ_ROUTES = {
    home: '/',
    /** Menú completo (MEN). */
    menu: '/menu',
    /** Buscador del menú: la lupa del encabezado móvil lleva aquí (MEN). */
    menuSearch: '/menu#buscar',
    /** Ofertas por ocasión (OFE); los combos cuelgan de /promos/<id>. */
    promos: '/promos',
    /** Mi pedido (CAR). */
    cart: '/cart',
    /** Mi cuenta (CTA); sin sesión el template redirige al ingreso. */
    account: '/account',
    /** Página Papa Puntos (CTA). */
    points: '/puntos',
    /** Seguimiento del pedido en curso (SEG). */
    tracking: '/seguimiento',
    /** Locales. */
    stores: '/store-locator',
    login: '/login',
} as const;

/**
 * Pantallas con barra inferior móvil, como en el lienzo (Home, Menu, Simple-Add, Ofertas, Puntos y
 * Puntos-Cuenta). Coincidencia EXACTA, salvo las que terminan en `/*` (listados de categoría): los
 * constructores `/promos/<id>`, la ficha, Pedido, cuenta, tienda, checkout y confirmación usan su
 * propia barra de acción abajo y no la muestran.
 */
export const PJ_BOTTOM_NAV_ROUTES: readonly string[] = [
    PJ_ROUTES.home,
    PJ_ROUTES.menu,
    '/c/*',
    '/search',
    PJ_ROUTES.promos,
    PJ_ROUTES.points,
];

/** Si la ruta (sin prefijo de sitio) lleva barra inferior. */
export function showsBottomNav(path: string, routes: readonly string[] = PJ_BOTTOM_NAV_ROUTES): boolean {
    const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
    return routes.some((route) => (route.endsWith('/*') ? clean.startsWith(route.slice(0, -1)) : clean === route));
}

/** Prefijo del único sitio de la demo (sitio `PapaJohnsCL` con alias `cl`, locale `es-CL`). */
export const PJ_SITE_PREFIX = '/cl/es-CL';

/** Rutas propias de la demo que se aceptan sin prefijo de sitio y se redirigen (prefijo de sección). */
export const PJ_UNPREFIXED_REDIRECTS: readonly string[] = [
    PJ_ROUTES.menu,
    PJ_ROUTES.promos,
    PJ_ROUTES.points,
    PJ_ROUTES.tracking,
    PJ_ROUTES.cart,
    PJ_ROUTES.account,
];

/**
 * Destino con prefijo para una ruta escrita sin él (`/promos/super-duo` → `/cl/es-CL/promos/super-duo`),
 * o `null` si ya trae el prefijo o no es una ruta de la demo.
 */
export function unprefixedRedirectTarget(pathname: string, prefix: string): string | null {
    if (!prefix || prefix === '/' || pathname === prefix || pathname.startsWith(`${prefix}/`)) return null;
    const match = PJ_UNPREFIXED_REDIRECTS.some((route) => pathname === route || pathname.startsWith(`${route}/`));
    return match ? `${prefix}${pathname}` : null;
}

export type PjRoute = (typeof PJ_ROUTES)[keyof typeof PJ_ROUTES];

/** Enlaces externos del footer (papajohns.cl). */
export const PJ_EXTERNAL_LINKS = {
    help: 'https://www.papajohns.cl/centro-de-ayuda',
    promoTerms: 'https://www.papajohns.cl/terminos-y-condiciones',
    privacy: 'https://www.papajohns.cl/politica-de-privacidad',
    instagram: 'https://www.instagram.com/papajohnschile/',
    facebook: 'https://www.facebook.com/PapaJohnsChile',
    tiktok: 'https://www.tiktok.com/@papajohns.chile',
} as const;
