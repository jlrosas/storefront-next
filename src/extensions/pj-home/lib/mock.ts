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
import type { SofiaVM } from './types';

/**
 * Datos de ejemplo de Sofía (CONTRATO §3, lienzo): se usan solo cuando no hay sesión de cliente
 * (`?perfil=sofia` sin ingresar). Con `dev-hom@demo.pj.cl` salen del cliente real.
 */
export const SOFIA_SAMPLE: SofiaVM = {
    firstName: 'Sofía',
    points: 340,
    live: false,
    lastOrder: {
        orderNo: 'ejemplo',
        placedAt: '2026-10-02T20:30:00.000Z',
        total: 23890,
        summary: 'Pollo BBQ Familiar sin cebolla + Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L',
        heroImage: '',
        heroAlt: 'Pollo BBQ con el queso estirándose',
        thumbs: [],
        storeLabel: 'El Bosque',
    },
    favorites: [],
    redeem: null,
};
