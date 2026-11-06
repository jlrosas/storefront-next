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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */

/**
 * Servicio de imágenes (DIS) de Commerce: las fotos del catálogo (S-D8) se piden a su ancho.
 * Una foto de 190 KB baja a ~34 KB a 640 px.
 */
const STATIC_RE = /^(https:\/\/([^/.]+)-(\d+)\.[^/]+)\/on\/demandware\.static\/(.*)$/;

/** URL de la foto escalada a `width` px; si no es de la plataforma, la devuelve igual. */
export function scaledImage(src: string, width: number): string {
    if (/\/dw\/image\/v\d+\//.test(src)) {
        return `${src + (src.includes('?') ? '&' : '?')}sw=${width}&q=80`;
    }
    const match = STATIC_RE.exec(src);
    if (!match) return src;
    const [, origin, realm, instance, rest] = match;
    return `${origin}/dw/image/v2/${realm.toUpperCase()}_${instance}/on/demandware.static/${rest}?sw=${width}&q=80`;
}

/** `srcset` de la foto a los anchos dados. */
export function imageSrcSet(src: string, widths: number[]): string {
    return widths.map((w) => `${scaledImage(src, w)} ${w}w`).join(', ');
}
