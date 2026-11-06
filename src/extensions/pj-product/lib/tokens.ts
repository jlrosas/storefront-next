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
 * Alias de PRO sobre la paleta oficial (VIS-03: sin hex fuera de S-D18). Antes eran colores del lienzo que `pj.css` no tenía: chips de ingredientes (Sheet-Pizza, PDP) y el
 * separador de secciones de la hoja. Se declaran como variables CSS en la raíz de cada pantalla de PRO
 * y se usan con `bg-[var(--pj-chip)]`. Candidatos a `pj-shared` (tokens).
 */
export const PRO_TOKENS = {
    '--pj-chip': 'var(--pj-dough-deep)',
    '--pj-chip-line': 'var(--pj-dough-line)',
    '--pj-removed': 'var(--pj-sauce)',
    '--pj-removed-line': 'var(--pj-input-line)',
    '--pj-section': 'var(--pj-dough-deep)',
    '--pj-split-line': 'var(--pj-dough-line)',
} as CSSProperties;
