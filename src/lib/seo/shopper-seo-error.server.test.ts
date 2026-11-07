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
import { describe, expect, it } from 'vitest';
import { ApiError } from '@/scapi';
import { sanitizeShopperSeoError } from './shopper-seo-error.server';

function apiError(status: number) {
    return new ApiError({
        status,
        statusText: 'x',
        headers: new Headers(),
        body: { type: 't', title: 'x', detail: 'private upstream diagnostic' },
        rawBody: '{}',
        url: 'https://api.example.test/url-mapping?token=private',
        method: 'GET',
    });
}

function thrown(fn: () => unknown): unknown {
    try {
        fn();
    } catch (error) {
        return error;
    }
    return undefined;
}

describe('sanitizeShopperSeoError', () => {
    // @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
    it.each([401, 403, 404])('INT-10: un %i de Shopper SEO es una URL que no existe → 404', async (status) => {
        const error = thrown(() => sanitizeShopperSeoError(apiError(status)));
        expect(error).toBeInstanceOf(Response);
        expect((error as Response).status).toBe(404);
        expect(await (error as Response).text()).not.toContain('private');
    });
    // @sfdc-extension-block-end SFDC_EXT_PJ_SHARED

    it('un 5xx del upstream sigue siendo 502 sin detalles', async () => {
        const error = thrown(() => sanitizeShopperSeoError(apiError(503)));
        expect((error as Response).status).toBe(502);
        expect(await (error as Response).text()).toBe('Bad Gateway');
    });

    it('relanza los errores que no son de la API', () => {
        const original = new TypeError('boom');
        expect(thrown(() => sanitizeShopperSeoError(original))).toBe(original);
    });
});
