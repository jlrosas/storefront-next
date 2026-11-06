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
import { describe, expect, it } from 'vitest';
import { PJ_SITE_PREFIX, showsBottomNav, unprefixedRedirectTarget } from './routes';

describe('showsBottomNav', () => {
    it('sale en /, /menu, /promos exacto, /puntos, /search y los listados /c/*', () => {
        for (const path of ['/', '/menu', '/promos', '/promos/', '/puntos', '/search', '/c/pizzas']) {
            expect(showsBottomNav(path)).toBe(true);
        }
    });

    it('no sale en los constructores /promos/*, la ficha, el pedido ni la cuenta', () => {
        for (const path of [
            '/promos/super-duo',
            '/promos/box-halloween',
            '/p/pz-pollo-bbq',
            '/cart',
            '/account',
            '/checkout',
        ]) {
            expect(showsBottomNav(path)).toBe(false);
        }
    });
});

describe('unprefixedRedirectTarget', () => {
    it('agrega el prefijo a las rutas de la demo', () => {
        expect(unprefixedRedirectTarget('/promos', PJ_SITE_PREFIX)).toBe('/cl/es-CL/promos');
        expect(unprefixedRedirectTarget('/promos/super-duo', PJ_SITE_PREFIX)).toBe('/cl/es-CL/promos/super-duo');
        expect(unprefixedRedirectTarget('/menu', PJ_SITE_PREFIX)).toBe('/cl/es-CL/menu');
    });

    it('no toca rutas con prefijo ni rutas ajenas', () => {
        expect(unprefixedRedirectTarget('/cl/es-CL/promos', PJ_SITE_PREFIX)).toBeNull();
        expect(unprefixedRedirectTarget('/about-us', PJ_SITE_PREFIX)).toBeNull();
        expect(unprefixedRedirectTarget('/promosx', PJ_SITE_PREFIX)).toBeNull();
    });
});
