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
import { redirect, type MiddlewareFunction } from 'react-router';
import { getConfig } from '@salesforce/storefront-next-runtime/config';
import { stripPathPrefix } from '@salesforce/storefront-next-runtime/site-context';
import { getAuth } from '@/middlewares/auth.server';
import { unprefixedRedirectTarget } from '../lib/routes';
import { demoCookieUpdates, pjDemoContext, readDemoSignals, serializeDemoCookie } from '../lib/profile';

/**
 * Middleware de la demo (CONTRATO §2): deja en `pjDemoContext` las señales del perfil y del
 * momento, y guarda `?perfil=`, `?hora=` y `?utm_campaign=` en las cookies `pj_perfil`,
 * `pj_hora` y `pj_campana`. Va después del middleware de autenticación (lee `userType`).
 */
export const pjDemoMiddleware: MiddlewareFunction<Response> = async ({ request, context }, next) => {
    const url = new URL(request.url);

    let isRegistered = false;
    try {
        isRegistered = getAuth(context).userType === 'registered';
    } catch {
        // Sin middleware de auth (pruebas aisladas): se trata como visitante.
    }
    let pathname = url.pathname;
    try {
        pathname = stripPathPrefix({ pathname: url.pathname, prefix: getConfig(context).url?.prefix || '' }) || '/';
    } catch {
        // Config no disponible: se usa la ruta completa.
    }
    context.set(pjDemoContext, readDemoSignals(request, { pathname, isRegistered }));

    const response = await next();

    const updates = demoCookieUpdates(url.searchParams);
    if (updates.length > 0) {
        const secure = url.protocol === 'https:';
        try {
            for (const update of updates) {
                response.headers.append('Set-Cookie', serializeDemoCookie(update, secure));
            }
        } catch {
            // Respuestas con cabeceras inmutables (redirecciones de la plataforma): se omite.
        }
    }
    return response;
};

/**
 * Rutas de la demo escritas sin prefijo de sitio (`/promos`, `/menu`, `/puntos`…) → 302 a
 * `/cl/es-CL/…`. Va ANTES de `siteContextMiddleware`, que responde 404 a un primer segmento que no es
 * un sitio. El prefijo sale del sitio por defecto y su locale por defecto (con sus alias).
 */
export const pjUnprefixedRedirectMiddleware: MiddlewareFunction<Response> = async ({ request, context }, next) => {
    if (request.method === 'GET') {
        try {
            const config = getConfig(context) as unknown as {
                commerce?: { sites?: { id: string; defaultLocale?: string }[] };
                defaultSiteId?: string;
                siteAliasMap?: Record<string, string>;
                localeAliasMap?: Record<string, string>;
            };
            const siteId = config.defaultSiteId;
            const site = config.commerce?.sites?.find((s) => s.id === siteId);
            if (siteId && site?.defaultLocale) {
                const prefix = `/${config.siteAliasMap?.[siteId] ?? siteId}/${config.localeAliasMap?.[site.defaultLocale] ?? site.defaultLocale}`;
                const url = new URL(request.url);
                const target = unprefixedRedirectTarget(url.pathname, prefix);
                if (target) return redirect(`${target}${url.search}`, 302);
            }
        } catch {
            // Config no disponible: se sigue.
        }
    }
    return next();
};
