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
import { useLocation } from 'react-router';
import { useConfig } from '@salesforce/storefront-next-runtime/config';
import { stripPathPrefix } from '@salesforce/storefront-next-runtime/site-context';

/** Ruta actual sin el prefijo de sitio y locale (`/cl/es-CL/menu` → `/menu`). */
export function usePjPath(): string {
    const location = useLocation();
    const config = useConfig();
    const path = stripPathPrefix({ pathname: location.pathname, prefix: config.url?.prefix || '' });
    return path === '' ? '/' : path;
}

/** Si `path` cae dentro de alguna de las rutas (`/` solo coincide exacto). */
export function matchesPath(path: string, routes: readonly string[]): boolean {
    return routes.some((route) => {
        const base = route.split('#')[0];
        if (base === '/') return path === '/';
        return path === base || path.startsWith(`${base}/`);
    });
}
