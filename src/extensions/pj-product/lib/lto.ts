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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import type { LtoBadgeVariant } from '@/extensions/pj-shared/components/lto-badge';

/** Clave de traducción (`lto.*`) y par ADA del sello LTO de la ficha y la hoja (UX-1 §3.4, MEN-05). */
export interface ProductLto {
    key: 'top' | 'new' | 'forTwo';
    variant: LtoBadgeVariant;
}

/**
 * Sello de la pizza según sus insignias (`c_pjBadges`, CONTRATO §3): «LA MÁS PEDIDA» manda sobre
 * «NUEVA» y «PARA DOS». Va sobre la foto verde, así que usa lima + Basil (o Garlic + Sauce para «PARA DOS»).
 */
export function productLto(badges: readonly string[]): ProductLto | null {
    if (badges.includes('mas-pedida')) return { key: 'top', variant: 'lime' };
    if (badges.includes('novedad')) return { key: 'new', variant: 'lime' };
    if (badges.includes('ideal-para-2')) return { key: 'forTwo', variant: 'garlic' };
    return null;
}
