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
import { type ReactElement, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { PauseIcon, PlayIcon } from './icons';
import {
    CROP_SCALE,
    FOOD_IMAGE_CROP,
    type FoodImageCrop,
    KEN_BURNS_SCALE,
    clampCropScale,
    cropScaleAt,
    isDisUrl,
    normalizeSrcSet,
    originalWidthFor,
    photoSrcSet,
    photoWidth,
    scaleSizes,
} from '../lib/photo';

/** Ancho de `lg` (escritorio) para saber qué escala usa el recorte `hero`. */
const DESKTOP_QUERY = '(min-width: 1024px)';

export type { FoodImageCrop };

export interface FoodImageProps {
    /** URL de la foto (S-D8: la mayor resolución disponible, sin texto incrustado). */
    src: string;
    /** Texto alternativo que describe la comida («Pollo BBQ con queso estirándose»). */
    alt: string;
    /**
     * `srcset` responsivo (`url 640w, url 1280w`). Si `src` es del DIS y no se pasa, `FoodImage` lo arma
     * (320–1.440 px). En URLs del DIS ningún candidato pasa del original (VIS-06).
     */
    srcSet?: string;
    /**
     * `sizes` de la **caja** de la foto (`(min-width: 1024px) 50vw, 100vw`). `FoodImage` lo multiplica por
     * la escala del recorte y, ya montada, lo reemplaza por el ancho medido: así pide `sw = ancho pintado ×
     * DPR × escala` (VIS-06).
     */
    sizes?: string;
    /** Relación de aspecto del recorte (`16/9`, `4/3`, `1/1`). Reserva el espacio: sin saltos de layout. */
    aspect?: string;
    /** Recorte a sangre: sin bordes redondeados (hero y fichas). Por defecto redondea como tarjeta. */
    bleed?: boolean;
    /** Recorte de la foto (`macro`, `hero`, `combo` o `none`). Por defecto `none`. */
    crop?: FoodImageCrop;
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
 * Foto de comida del lienzo (CONTRATO §5, R4.7): `srcset`, recorte `object-cover` (sin *letterbox*) con
 * zoom macro por `crop`, sombra
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
    crop = 'none',
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
    const frameRef = useRef<HTMLDivElement>(null);
    // Medida de la caja (cliente): ancho y si estamos en escritorio. `null` en SSR y en la hidratación.
    const [box, setBox] = useState<{ width: number; desktop: boolean } | null>(null);

    useEffect(() => {
        const el = frameRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return;
        const update = () => {
            const width = el.offsetWidth;
            const desktop = typeof window.matchMedia === 'function' && window.matchMedia(DESKTOP_QUERY).matches;
            setBox((prev) =>
                prev && prev.width === width && prev.desktop === desktop ? prev : width > 0 ? { width, desktop } : prev
            );
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // VIS-06 (UX-2 N1): resolución según lo que se pinta, no según la caja.
    const disSource = isDisUrl(src);
    const originalWidth = originalWidthFor(src);
    const motionScale = moving ? KEN_BURNS_SCALE : 1;
    // El recorte nunca agranda la foto por encima del original (caja × escala ≤ ancho natural).
    const baseScale = box ? cropScaleAt(crop, box.desktop) : CROP_SCALE[crop];
    const cropScale = box ? clampCropScale(baseScale, box.width, originalWidth) : baseScale;
    const scaleStyle = box && crop !== 'none' && cropScale < baseScale ? { scale: String(cropScale) } : undefined;
    const finalSrcSet = srcSet
        ? normalizeSrcSet(srcSet, originalWidth)
        : disSource
          ? photoSrcSet(src, undefined, originalWidth)
          : undefined;
    // Antes de medir: el `sizes` del llamador × escala. Ya medida: el ancho pintado exacto (CSS px; el
    // navegador multiplica por el DPR al elegir).
    const finalSizes = finalSrcSet
        ? box
            ? `${photoWidth(box.width, 1, cropScale * motionScale, Number.MAX_SAFE_INTEGER)}px`
            : scaleSizes(sizes ?? '100vw', CROP_SCALE[crop] * motionScale)
        : undefined;

    return (
        <div
            ref={frameRef}
            className={cn(
                'relative overflow-hidden bg-pj-sand',
                !bleed && 'rounded-pj-card',
                shadow && 'shadow-pj-card',
                className
            )}
            style={aspect ? { aspectRatio: aspect } : undefined}
            data-testid="pj-food-image"
            data-crop={crop}
            data-motion={moving ? (paused ? 'paused' : 'running') : 'none'}>
            <img
                src={src}
                srcSet={finalSrcSet}
                sizes={finalSizes}
                alt={alt}
                loading={priority ? 'eager' : 'lazy'}
                fetchPriority={priority ? 'high' : undefined}
                decoding="async"
                className={cn(
                    'block h-full w-full object-cover',
                    FOOD_IMAGE_CROP[crop],
                    moving && 'animate-[pj-ken-burns_14s_ease-in-out_infinite_alternate] motion-reduce:animate-none',
                    imgClassName
                )}
                style={
                    scaleStyle || (moving && paused)
                        ? { ...scaleStyle, ...(moving && paused ? { animationPlayState: 'paused' } : {}) }
                        : undefined
                }
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
