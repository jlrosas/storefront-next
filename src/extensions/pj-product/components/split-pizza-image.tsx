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
import type { ReactElement } from 'react';
import { cn } from '@/lib/utils';

export interface SplitPizzaImageProps {
    /** Foto de cada mitad (izquierda, derecha). `null` deja esa mitad vacía. */
    images: Array<string | null>;
    /** Descripción para lectores de pantalla («Pizza Familiar: Pollo BBQ, Todas las Carnes»). */
    label: string;
    /** Diámetro en píxeles (150 en el armador, 64 en la línea del carrito). */
    size?: number;
    className?: string;
}

const CLIPS = ['inset(0 50% 0 0)', 'inset(0 0 0 50%)'];

/**
 * Pizza dividida (Mitades.dc.html y Pedido-Mitades.dc.html): cada mitad muestra la foto de su
 * especialidad recortada a la mitad, con una línea al centro. Sirve para el armador y para la línea
 * del carrito de CAR.
 */
export function SplitPizzaImage({ images, label, size = 150, className }: SplitPizzaImageProps): ReactElement {
    return (
        <div
            role="img"
            aria-label={label}
            data-testid="pj-split-pizza"
            className={cn(
                'relative shrink-0 overflow-hidden rounded-full border-[3px] border-[var(--pj-split-line,var(--pj-dough-line))] bg-pj-sand',
                className
            )}
            style={{ width: size, height: size }}>
            {images
                .slice(0, 2)
                .map((src, index) =>
                    src ? (
                        <img
                            key={index === 0 ? 'left' : 'right'}
                            src={src}
                            alt=""
                            decoding="async"
                            className="absolute inset-0 size-full object-cover"
                            style={{ clipPath: CLIPS[index] }}
                        />
                    ) : null
                )}
            <span aria-hidden="true" className="absolute inset-y-0 left-1/2 -ml-[1.5px] w-[3px] bg-pj-cream" />
        </div>
    );
}

export default SplitPizzaImage;
