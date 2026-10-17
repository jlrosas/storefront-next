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

import { defineConfig } from '@salesforce/storefront-next-runtime/config';
import baseConfig, { protectedConfigPaths } from './config.server.base';

export default defineConfig(
    {
        ...baseConfig,
        app: {
            ...baseConfig?.app,
            commerce: {
                ...baseConfig?.app?.commerce,
                sites: [
                    {
                        id: 'PapaJohnsCL',
                        defaultLocale: 'es-CL',
                        defaultCurrency: 'CLP',
                        supportedLocales: [{ id: 'es-CL', preferredCurrency: 'CLP' }],
                        supportedCurrencies: ['CLP'],
                    },
                ],
            },
            defaultSiteId: 'PapaJohnsCL',
            siteAliasMap: { PapaJohnsCL: 'cl' },
            i18n: {
                ...baseConfig?.app?.i18n,
                // El fallback debe ir al final.
                supportedLngs: ['es-CL', 'en-GB'],
            },
            features: {
                ...baseConfig?.app?.features,
                // Los botones de pago rápido del template son simulados.
                expressPayments: { enabled: false },
            },
            global: {
                ...baseConfig?.app?.global,
                branding: { name: 'Papa Johns', logoAlt: 'Papa Johns Chile' },
            },
        },
    },
    { protectedPaths: protectedConfigPaths }
);
