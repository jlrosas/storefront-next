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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import { readFulfillmentFromDocument } from '@/extensions/pj-shared/lib/fulfillment';
import type { PjSize } from './menu-model';

/**
 * Puntos de enganche del menú con las demás áreas (se montan en paralelo):
 *
 * **PRO · hoja de pizza y armador.** El menú dispara `pj:configure-product` (evento de `window`,
 * cancelable) con `PjConfigureDetail`. PRO escucha, llama a `event.preventDefault()` para decir
 * que lo atiende y abre su hoja (con `halfFirst`, el armador de mitades con esa pizza en la primera
 * mitad). Sin nadie que lo atienda, el menú navega a `/p/<id>`.
 *
 * **TIE · panel de tienda** (contrato estándar de INT, igual al de OFE). Antes de agregar un
 * producto simple, el menú llama a `ensureStore()`. Con tienda en la cookie `pj_fulfillment`, sigue.
 * Si no, dispara `pj:open-fulfillment` (cancelable): TIE llama a `preventDefault()`, abre su panel y
 * al confirmar dispara `pj:fulfillment-changed`; si lo cierra, `pj:fulfillment-dismissed`. Sin nadie
 * que lo atienda, agrega igual. INT moverá esto a pj-shared.
 *
 * PRO puede usar el mismo `ensureStore()` antes de su «Agregar».
 */
export const PJ_MENU_EVENTS = {
    configure: 'pj:configure-product',
    storeRequired: 'pj:open-fulfillment',
    storeSelected: 'pj:fulfillment-changed',
    storeDismissed: 'pj:fulfillment-dismissed',
} as const;

export interface PjConfigureDetail {
    /** Producto maestro del catálogo (`pz-pollo-bbq`, `pz-arma-tu-pizza`, `pz-mitades`). */
    productId: string;
    /** «½ Mitad»: abre el armador de mitades con `productId` en la primera mitad. */
    halfFirst?: boolean;
    /** Armador pedido desde las tarjetas de construcción. */
    builder?: 'mitades' | 'arma-tu-pizza';
    /** Tamaño elegido en el selector del menú, para que la hoja lo traiga marcado. */
    size?: PjSize;
}

/** `true` si alguien (PRO) atendió la configuración; `false` si hay que navegar a la ficha. */
export function requestConfigure(detail: PjConfigureDetail): boolean {
    if (typeof window === 'undefined') return false;
    const event = new CustomEvent<PjConfigureDetail>(PJ_MENU_EVENTS.configure, { detail, cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
}

/** Destino de respaldo mientras PRO no monte su hoja. */
export function configureFallbackHref(detail: PjConfigureDetail): string {
    if (detail.halfFirst) return `/p/pz-mitades?mitad1=${encodeURIComponent(detail.productId)}`;
    const params = detail.size ? `?size=${detail.size}` : '';
    return `/p/${detail.productId}${params}`;
}

/** Hay tienda elegida (cookie `pj_fulfillment` con `storeId`). */
export function hasStore(): boolean {
    if (typeof document === 'undefined') return true;
    return Boolean(readFulfillmentFromDocument()?.storeId);
}

/**
 * Resuelve `true` cuando se puede agregar y `false` si el cliente cerró el panel sin elegir. Con
 * `productName`, el panel de TIE dice «Para agregar tu {productName}.» (05 regla 1).
 */
export function ensureStore(productName?: string): Promise<boolean> {
    if (hasStore()) return Promise.resolve(true);
    const event = new CustomEvent(PJ_MENU_EVENTS.storeRequired, {
        cancelable: true,
        detail: { source: 'pj-menu', reason: 'add-to-cart', ...(productName ? { productName } : {}) },
    });
    window.dispatchEvent(event);
    if (!event.defaultPrevented) return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
        const done = (value: boolean) => {
            window.removeEventListener(PJ_MENU_EVENTS.storeSelected, onSelected);
            window.removeEventListener(PJ_MENU_EVENTS.storeDismissed, onDismissed);
            resolve(value);
        };
        const onSelected = () => done(true);
        const onDismissed = () => done(false);
        window.addEventListener(PJ_MENU_EVENTS.storeSelected, onSelected);
        window.addEventListener(PJ_MENU_EVENTS.storeDismissed, onDismissed);
    });
}
