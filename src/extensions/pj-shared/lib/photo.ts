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
