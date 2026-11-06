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
import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { PauseIcon, PlayIcon } from './icons';

export interface FoodImageProps {
    /** URL de la foto (S-D8: la mayor resolución disponible, sin texto incrustado). */
    src: string;
    /** Texto alternativo que describe la comida («Pollo BBQ con queso estirándose»). */
    alt: string;
    /** `srcset` responsivo (`url 640w, url 1280w`). */
    srcSet?: string;
    /** `sizes` para el `srcset` (`(min-width: 1024px) 50vw, 100vw`). */
    sizes?: string;
    /** Relación de aspecto del recorte (`16/9`, `4/3`, `1/1`). Reserva el espacio: sin saltos de layout. */
    aspect?: string;
    /** Recorte a sangre: sin bordes redondeados (hero y fichas). Por defecto redondea como tarjeta. */
    bleed?: boolean;
    /** Sombra cálida de tarjeta. */
    shadow?: boolean;
    /** Movimiento lento (Ken Burns) con botón de pausa. Se omite con «reducir movimiento». */
    animate?: boolean;
    /** Imagen candidata a LCP (hero, primera foto de la ficha). */
    priority?: boolean;
    className?: string;
    imgClassName?: string;
}

/**
 * Foto de comida del lienzo (CONTRATO §5, R4.7): `srcset`, recorte `object-cover`, sombra
 * opcional y movimiento lento con pausa. Con «reducir movimiento» la foto queda quieta y no se
 * muestra el botón (no hay nada que pausar).
 */
export function FoodImage({
    src,
    alt,
    srcSet,
    sizes,
    aspect,
    bleed = false,
    shadow = false,
    animate = false,
    priority = false,
    className,
    imgClassName,
}: FoodImageProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    const reducedMotion = useReducedMotion();
    const [paused, setPaused] = useState(false);
    const moving = animate && !reducedMotion;

    return (
        <div
            className={cn(
                'relative overflow-hidden bg-pj-sand',
                !bleed && 'rounded-pj-card',
                shadow && 'shadow-pj-card',
                className
            )}
            style={aspect ? { aspectRatio: aspect } : undefined}
            data-testid="pj-food-image"
            data-motion={moving ? (paused ? 'paused' : 'running') : 'none'}>
            <img
                src={src}
                srcSet={srcSet}
                sizes={srcSet ? (sizes ?? '100vw') : undefined}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : undefined}
                decoding="async"
                className={cn(
                    'block h-full w-full object-cover',
                    moving && 'animate-[pj-ken-burns_14s_ease-in-out_infinite_alternate] motion-reduce:animate-none',
                    imgClassName
                )}
                style={moving && paused ? { animationPlayState: 'paused' } : undefined}
            />
            {moving && (
                <button
                    type="button"
                    onClick={() => setPaused((value) => !value)}
                    aria-pressed={paused}
                    aria-label={paused ? t('foodImage.play') : t('foodImage.pause')}
                    data-testid="pj-food-image-toggle"
                    className="absolute right-2 bottom-2 flex size-11 items-center justify-center rounded-full bg-pj-ink/60 text-pj-dough backdrop-blur-sm hover:bg-pj-ink/75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-pepperoncini">
                    {paused ? <PlayIcon size={18} /> : <PauseIcon size={18} />}
                </button>
            )}
        </div>
    );
}

export default FoodImage;
