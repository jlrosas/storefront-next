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
import type { CSSProperties } from 'react';

/**
 * Colores del lienzo que `pj.css` (INT) todavía no tiene: chips de ingredientes (Sheet-Pizza, PDP) y el
 * separador de secciones de la hoja. Se declaran como variables CSS en la raíz de cada pantalla de PRO
 * y se usan con `bg-[var(--pj-chip)]`. Candidatos a `pj-shared` (tokens).
 */
export const PRO_TOKENS = {
    '--pj-chip': '#FFF3E6',
    '--pj-chip-line': '#E9C9A6',
    '--pj-removed': '#8A3B12',
    '--pj-removed-line': '#C9906F',
    '--pj-section': '#F4F3EE',
    '--pj-split-line': '#E9C9A6',
} as CSSProperties;
