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
import { useCallback } from 'react';
import { useConfig } from '@salesforce/storefront-next-runtime/config';
import { toDisImageUrl } from '@/lib/images/dynamic-image';

/**
 * URLs de Dynamic Imaging (DIS) en WebP al ancho pedido: las fotos del catálogo vienen en 1440 px y las
 * miniaturas (ingredientes, sabores) se muestran a 30–64 px. Sin DIS devuelve la URL original.
 */
export function useImageUrl(): {
    url: (src: string | null | undefined, width: number) => string | undefined;
    srcSet: (src: string | null | undefined, widths: number[]) => string | undefined;
} {
    const config = useConfig();
    const url = useCallback(
        (src: string | null | undefined, width: number) =>
            src ? (toDisImageUrl({ src, options: { width, format: 'webp' }, config }) ?? src) : undefined,
        [config]
    );
    const srcSet = useCallback(
        (src: string | null | undefined, widths: number[]) =>
            src ? widths.map((w) => `${url(src, w)} ${w}w`).join(', ') : undefined,
        [url]
    );
    return { url, srcSet };
}
