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
import type { ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface AccentWordProps {
    /** La palabra o frase corta de acento («THE WORKS», «HAY ALGO»). */
    children: ReactNode;
    /**
     * Pares ADA: `sauce` lima sobre Rich Sauce (por defecto, p. 51) · `basil` lima sobre Fresh Basil ·
     * `lime` Rich Sauce sobre lima (para usar sobre fondos oscuros).
     */
    tone?: 'sauce' | 'basil' | 'lime';
    className?: string;
}

const TONE = {
    sauce: 'bg-pj-sauce text-pj-pepperoncini [-webkit-text-stroke:2px_var(--pj-sauce)]',
    basil: 'bg-pj-basil text-pj-pepperoncini [-webkit-text-stroke:2px_var(--pj-basil)]',
    lime: 'bg-pj-pepperoncini text-pj-sauce [-webkit-text-stroke:2px_var(--pj-pepperoncini)]',
} as const;

/**
 * Palabra de acento de la marca (UX-1 §3.3, P3-21). La fuente Pappy no está en el proyecto y no se imita
 * con otra manuscrita: va en Papa Sans Condensed dentro de un sello rotado −3° (la rotación de Pappy,
 * playbook p. 44), con contorno de 2 px pintado bajo el relleno (`paint-order: stroke`). Si llega Pappy,
 * se cambia aquí y cambian todas las pantallas. Hereda el tamaño del titular que la contiene.
 */
export function AccentWord({ children, tone = 'sauce', className }: AccentWordProps): ReactElement {
    return (
        <span
            data-testid="pj-accent-word"
            className={cn(
                'mx-[0.08em] inline-block -rotate-3 rounded-[0.18em] px-[0.22em] pt-[0.08em] pb-[0.02em] font-heading leading-[0.95] tracking-normal uppercase [paint-order:stroke_fill]',
                TONE[tone],
                className
            )}>
            {children}
        </span>
    );
}

export default AccentWord;
