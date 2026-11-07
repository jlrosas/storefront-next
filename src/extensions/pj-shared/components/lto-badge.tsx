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

export type LtoBadgeVariant = 'lime' | 'sauce' | 'garlic' | 'dough';
export type LtoBadgeSize = 'sm' | 'md' | 'lg';

export interface LtoBadgeProps {
    /**
     * Texto del sello en MAYÚSCULAS cortas: «-50%», «NUEVO», «DEL MES», «SOLO HOY». Para dos líneas,
     * pasa un salto de línea (`'DEL\nMES'`): el interlineado queda al 80 % (playbook p. 119, UX-2 N9).
     */
    children: ReactNode;
    /**
     * Par de colores ADA del playbook (p. 120):
     * `lime` lima + Basil («NUEVO», «-50%») · `sauce` Rich Sauce + Dough («DEL MES») ·
     * `garlic` Garlic + Sauce («SOLO HOY») · `dough` Dough + Basil. Por defecto `lime`.
     */
    variant?: LtoBadgeVariant;
    /** `sm` 44 px (miniaturas) · `md` 56 px (tarjetas) · `lg` 88 px (hero). Por defecto `md`. */
    size?: LtoBadgeSize;
    /**
     * Inclinación de −3° (la de Pappy). Opcional y apagada por defecto: el playbook (p. 121) pide no rotar
     * el sello; úsala solo en piezas de campaña donde el titular también va rotado.
     */
    tilt?: boolean;
    /** Entrada única al montar (escala 0,6 → 1 y giro −8° → 0°, 350 ms). Se omite con «reducir movimiento». */
    animate?: boolean;
    /** Texto para lectores de pantalla cuando el sello solo no se entiende («50 % de descuento»). */
    label?: string;
    className?: string;
}

const VARIANT: Record<LtoBadgeVariant, string> = {
    lime: 'bg-pj-pepperoncini text-pj-basil',
    sauce: 'bg-pj-sauce text-pj-dough',
    garlic: 'bg-pj-garlic text-pj-sauce',
    dough: 'bg-pj-dough text-pj-basil',
};

/** Diámetro y cuerpo de letra: el texto ocupa ~40 % del círculo (playbook p. 119). Nunca bajo 12 px. */
const SIZE: Record<LtoBadgeSize, string> = {
    sm: 'size-11 text-[15px]',
    md: 'size-14 text-[19px]',
    lg: 'size-[88px] text-[30px]',
};

/**
 * Sello LTO de la marca (UX-1 §3.4, playbook pp. 119–121): círculo perfecto con Papa Sans Condensed
 * centrada. Se coloca en la esquina superior izquierda de la primera letra del titular o sobre la foto.
 * Reemplaza las pastillas rectangulares «-50%» y «-19%».
 */
export function LtoBadge({
    children,
    variant = 'lime',
    size = 'md',
    tilt = false,
    animate = false,
    label,
    className,
}: LtoBadgeProps): ReactElement {
    const lines = typeof children === 'string' ? children.split('\n') : null;
    return (
        <span
            data-testid="pj-lto-badge"
            data-variant={variant}
            data-size={size}
            role={label ? 'img' : undefined}
            aria-label={label}
            className={cn(
                'inline-grid shrink-0 place-items-center rounded-full text-center font-heading leading-[0.75] tracking-normal uppercase',
                VARIANT[variant],
                SIZE[size],
                tilt && '-rotate-3',
                animate && 'motion-safe:animate-[pj-lto-in_350ms_cubic-bezier(0.34,1.56,0.64,1)_both]',
                className
            )}>
            {/* VIS-06 (UX-2 N9): el interlineado va en el span interno; en el externo, `cn` lo quita al
                fusionar la clase de tamaño (`text-[21px]` pisa `leading-*`). */}
            <span aria-hidden={label ? true : undefined} className="block pt-[0.08em] leading-[0.8]">
                {lines
                    ? lines.map((line) => (
                          <span key={line} className="block">
                              {line}
                          </span>
                      ))
                    : children}
            </span>
        </span>
    );
}

export default LtoBadge;
