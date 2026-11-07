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
/**
 * Recorte de la foto (UX-1 §3.2). Las fotos del CDN son 1440×1080 con la pizza al ~65 % del ancho
 * sobre fondo de estudio: el recorte acerca la cámara sin cambiar el fondo.
 * - `macro`: tarjetas y ficha. La pizza llena ~90 % del ancho y el borde se sale por abajo.
 * - `hero`: heros. En móvil la pizza llena el ancho y se corta abajo; en escritorio, zoom menor.
 * - `combo`: fotos de combo en fila (pizza a la izquierda, bebida al centro, postre a la derecha). Acerca
 *   y ancla a la izquierda para que la pizza quede al centro de un cuadro vertical o cuadrado, no la bebida.
 * - `none`: la foto tal cual (bebidas, postres, ilustraciones).
 */
export type FoodImageCrop = 'macro' | 'hero' | 'combo' | 'none';

/** Clases del `<img>` por recorte. `scale` (propiedad CSS propia) convive con el Ken Burns, que usa `transform`. */
export const FOOD_IMAGE_CROP: Record<FoodImageCrop, string> = {
    macro: 'scale-[1.45] origin-[50%_60%] object-[50%_60%]',
    hero: 'scale-[1.55] origin-[50%_62%] object-[50%_62%] lg:scale-[1.35] lg:origin-[50%_55%] lg:object-[50%_55%]',
    combo: 'scale-[1.7] origin-[0%_55%] object-[0%_55%]',
    none: '',
};

/**
 * Combos cuya foto es «pizza + acompañamientos en fila» (pizza a la izquierda, bebida al centro):
 * los de ficha fija (S-D3). Super Dúo, Super Trío y la Pizza del Mes muestran solo pizzas y van en macro.
 */
export const ROW_COMBO_IDS = [
    'cb-papa-flash',
    'cb-papa-combo-palitos',
    'cb-papa-combo-postre',
    'cb-box-halloween',
] as const;

/**
 * Recorte de `FoodImage` para una foto de catálogo (UX-1 §3.2): `combo` si es un combo en fila, si no
 * `fallback` (`macro` en tarjetas). Acepta el ID del producto o la URL de la foto (`…/cb-papa-flash.jpg`).
 */
export function cropForPhoto(idOrSrc: string | null | undefined, fallback: FoodImageCrop = 'macro'): FoodImageCrop {
    if (!idOrSrc) return fallback;
    return ROW_COMBO_IDS.some((id) => idOrSrc.includes(id)) ? 'combo' : fallback;
}

/*
 * ─── Nitidez (VIS-06, UX-2 N1) ────────────────────────────────────────────────────────────────────
 * El recorte agranda la foto con `scale`, así que el navegador la pinta más ancha que su caja. El
 * `sizes` del llamador describe la caja, no lo pintado: sin corregirlo, el navegador elige una foto
 * hasta 3× más chica de lo que se ve. Aquí se calcula `sw = ancho pintado × DPR × escala del recorte`,
 * con tope en el original del catálogo.
 */

/** Ancho de los originales del catálogo (1440×1080, S-D8). Pedir más al DIS solo reescala. */
export const PHOTO_MAX_WIDTH = 1440;

/**
 * Originales del catálogo más chicos que 1.440 px (medidos en el DIS el 06-nov, VIS-06). El DIS no avisa:
 * si se le pide más, reescala y la foto se ve blanda. Pendiente con DAT: subir versiones de 1.440 px.
 */
export const SMALL_ORIGINALS: Readonly<Record<string, number>> = {
    'coca-cola-220-': 296,
    'mini-palitos-1694702225': 397,
    '750-x-600-': 750,
    '750x600-': 750,
    'h11-1723558934': 750,
    'olo-2-1791377711': 750,
};

/** Ancho del original de una foto: el registrado en `SMALL_ORIGINALS` o `PHOTO_MAX_WIDTH`. */
export function originalWidthFor(src: string | null | undefined): number {
    if (!src) return PHOTO_MAX_WIDTH;
    const file = src.split('?')[0].split('/').pop() ?? '';
    for (const [fragment, width] of Object.entries(SMALL_ORIGINALS)) {
        if (file.includes(fragment)) return Math.min(width, PHOTO_MAX_WIDTH);
    }
    return PHOTO_MAX_WIDTH;
}

/**
 * Escala mayor de cada recorte (la de `FOOD_IMAGE_CROP`; en `hero`, la de móvil). Se usa para pedir la
 * resolución: en escritorio el `hero` pinta a 1,35, así que la foto queda con algo de holgura.
 */
export const CROP_SCALE: Record<FoodImageCrop, number> = {
    macro: 1.45,
    hero: 1.55,
    combo: 1.7,
    none: 1,
};

/** Escala del recorte según el ancho de pantalla: `hero` acerca menos en escritorio (`lg`). */
export function cropScaleAt(crop: FoodImageCrop, desktop: boolean): number {
    return crop === 'hero' && desktop ? 1.35 : CROP_SCALE[crop];
}

/** Zoom máximo del movimiento lento (`pj-ken-burns` en theme/animations.css). */
export const KEN_BURNS_SCALE = 1.1;

/** Escalones del `srcset` que arma `FoodImage` cuando el llamador no lo trae. */
export const PHOTO_WIDTHS = [320, 480, 640, 800, 960, 1200, PHOTO_MAX_WIDTH] as const;

const DIS_RE = /\/dw\/image\/v\d+\//;

/** ¿La URL es del Dynamic Imaging Service de Commerce (acepta `sw`)? */
export function isDisUrl(src: string | null | undefined): boolean {
    return !!src && DIS_RE.test(src);
}

/** `sw` de una URL del DIS (o `null`). */
export function disWidth(src: string): number | null {
    const match = /[?&]sw=(\d+)/.exec(src);
    return match ? Number(match[1]) : null;
}

/** La URL del DIS pedida a `width` px (reemplaza o agrega `sw`; conserva `q`, `sfrm`, etc.). */
export function withDisWidth(src: string, width: number): string {
    const sw = Math.round(width);
    if (/[?&]sw=\d+/.test(src)) return src.replace(/([?&])sw=\d+/, `$1sw=${sw}`);
    return `${src}${src.includes('?') ? '&' : '?'}sw=${sw}`;
}

/**
 * Ancho a pedir al DIS: `ancho pintado (CSS) × DPR × escala del recorte`, redondeado hacia arriba y con
 * tope en `max` (el original). `paintedWidth` es la caja de la foto antes del recorte.
 */
export function photoWidth(paintedWidth: number, dpr = 1, scale = 1, max = PHOTO_MAX_WIDTH): number {
    if (!(paintedWidth > 0)) return 0;
    const raw = Math.ceil(paintedWidth * Math.max(dpr, 1) * Math.max(scale, 1));
    return Math.min(raw, max);
}

/**
 * Escala efectiva del recorte: nunca agranda la foto por encima de su ancho natural
 * (`caja × escala ≤ original`). Si la caja ya es más ancha que el original, queda en 1 (sin zoom).
 */
export function clampCropScale(scale: number, boxWidth: number, originalWidth = PHOTO_MAX_WIDTH): number {
    if (!(boxWidth > 0) || !(originalWidth > 0) || scale <= 1) return scale;
    const limit = originalWidth / boxWidth;
    return Math.max(1, Math.min(scale, Math.floor(limit * 100) / 100));
}

/** `srcset` en anchos `w` para una foto del DIS (sin repetir y con tope en `max`). */
export function photoSrcSet(src: string, widths: readonly number[] = PHOTO_WIDTHS, max = PHOTO_MAX_WIDTH): string {
    const steps = [...new Set(widths.map((w) => Math.min(Math.round(w), max)))].sort((a, b) => a - b);
    return steps.map((w) => `${withDisWidth(src, w)} ${w}w`).join(', ');
}

/**
 * Ajusta un `srcset` del llamador: en las URLs del DIS, ningún candidato pasa del original (`sw` y el
 * descriptor quedan en `max`) y se agregan los escalones de `PHOTO_WIDTHS` que falten, hasta `max`. Las URLs que no son
 * del DIS (o con descriptor `x`) quedan tal cual.
 */
export function normalizeSrcSet(srcSet: string, max = PHOTO_MAX_WIDTH): string {
    const candidates = srcSet
        .split(/,\s+/)
        .map((part) => part.trim())
        .filter(Boolean)
        .map((part) => {
            const [url, descriptor = ''] = part.split(/\s+/);
            return { url, descriptor };
        });
    const widthOf = (descriptor: string): number | null => {
        const match = /^(\d+)w$/.exec(descriptor);
        return match ? Number(match[1]) : null;
    };
    if (!candidates.every((c) => isDisUrl(c.url) && widthOf(c.descriptor) !== null)) return srcSet;

    const byWidth = new Map<number, string>();
    for (const { url, descriptor } of candidates) {
        const w = Math.min(widthOf(descriptor) as number, max);
        if (!byWidth.has(w)) byWidth.set(w, (disWidth(url) ?? 0) > max ? withDisWidth(url, max) : url);
    }
    // Completa la escalera con los escalones de `PHOTO_WIDTHS` (hasta `max`): sin saltos de 720 a 1.440
    // que hagan bajar el doble de lo necesario.
    const template = byWidth.get(Math.max(...byWidth.keys())) as string;
    for (const step of [...PHOTO_WIDTHS, max]) {
        const w = Math.min(step, max);
        if (!byWidth.has(w)) byWidth.set(w, withDisWidth(template, w));
    }
    const widths = [...byWidth.keys()].sort((a, b) => a - b);
    return widths.map((w) => `${byWidth.get(w)} ${w}w`).join(', ');
}

/** Divide por comas de primer nivel (las de `min()`/`calc()` no cuentan). */
function splitTopLevel(value: string, separator: RegExp): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';
    for (const ch of value) {
        if (ch === '(') depth += 1;
        if (ch === ')') depth -= 1;
        if (depth === 0 && separator.test(ch)) {
            if (current.trim()) parts.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
}

/**
 * Multiplica cada ancho de `sizes` por `factor` (`(min-width: 1024px) 50vw, 100vw` con 1,45 →
 * `(min-width: 1024px) calc(50vw * 1.45), calc(100vw * 1.45)`). Así el navegador elige el candidato del
 * `srcset` por lo que pinta y no por la caja. `auto` y el factor 1 quedan igual.
 */
export function scaleSizes(sizes: string, factor: number): string {
    if (!(factor > 1)) return sizes;
    const f = Number(factor.toFixed(3));
    return splitTopLevel(sizes, /,/)
        .map((entry) => {
            const tokens = splitTopLevel(entry, /\s/);
            const length = tokens.pop() as string;
            if (length === 'auto') return entry;
            return [...tokens, `calc(${length} * ${f})`].join(' ');
        })
        .join(', ');
}
