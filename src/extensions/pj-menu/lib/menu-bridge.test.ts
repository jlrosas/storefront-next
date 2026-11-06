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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import { afterEach, describe, expect, it } from 'vitest';
import { configureFallbackHref, ensureStore, PJ_MENU_EVENTS, requestConfigure } from './menu-bridge';

afterEach(() => {
    document.cookie = 'pj_fulfillment=; max-age=0; path=/';
});

describe('menu-bridge', () => {
    it('requestConfigure es true solo si alguien lo atiende', () => {
        expect(requestConfigure({ productId: 'pz-pollo-bbq' })).toBe(false);
        const handler = (event: Event) => event.preventDefault();
        window.addEventListener(PJ_MENU_EVENTS.configure, handler);
        expect(requestConfigure({ productId: 'pz-pollo-bbq', halfFirst: true })).toBe(true);
        window.removeEventListener(PJ_MENU_EVENTS.configure, handler);
    });
    it('el respaldo lleva a la ficha', () => {
        expect(configureFallbackHref({ productId: 'pz-pollo-bbq', size: 'family' })).toBe(
            '/p/pz-pollo-bbq?size=family'
        );
        expect(configureFallbackHref({ productId: 'pz-pollo-bbq', halfFirst: true })).toContain('mitad1=pz-pollo-bbq');
    });
    it('sin nadie que pida tienda, agrega igual', async () => {
        await expect(ensureStore()).resolves.toBe(true);
    });
    it('espera la tienda del panel de TIE', async () => {
        const open = (event: Event) => event.preventDefault();
        window.addEventListener(PJ_MENU_EVENTS.storeRequired, open);
        const pending = ensureStore();
        window.dispatchEvent(new CustomEvent(PJ_MENU_EVENTS.storeDismissed));
        await expect(pending).resolves.toBe(false);
        const again = ensureStore();
        window.dispatchEvent(new CustomEvent(PJ_MENU_EVENTS.storeSelected));
        await expect(again).resolves.toBe(true);
        window.removeEventListener(PJ_MENU_EVENTS.storeRequired, open);
    });
});
