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
import { ApiError } from '@/scapi';

export function sanitizeShopperSeoError(error: unknown): never {
    if (error instanceof ApiError) {
        // @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
        // INT-10: un 4xx de Shopper SEO (403 sin el scope en el cliente SLAS, 404 sin mapeo) no es una
        // falla del upstream: la URL simplemente no existe para el comprador → página 404 de marca, no 502.
        if (error.status >= 400 && error.status < 500) {
            // oxlint-disable-next-line typescript/only-throw-error
            throw new Response('Not Found', { status: 404 });
        }
        // @sfdc-extension-block-end SFDC_EXT_PJ_SHARED
        // React Router treats thrown Responses as route errors.
        // oxlint-disable-next-line typescript/only-throw-error
        throw new Response('Bad Gateway', { status: 502 });
    }
    throw error;
}
