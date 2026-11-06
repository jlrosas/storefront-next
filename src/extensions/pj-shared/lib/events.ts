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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */
import { readFulfillmentFromDocument, writeFulfillmentToDocument, type Fulfillment } from './fulfillment';

/**
 * Eventos de `window` que conectan las extensiones sin importarse entre sí (una sola definición).
 *
 * **Modalidad y tienda (TIE).** Quien necesita tienda antes de agregar llama a `ensureStore()`:
 * 1. Si ya hay `pj_fulfillment` con tienda, resuelve `true` al instante.
 * 2. Si no, dispara `pj:open-fulfillment` (cancelable). El panel de TIE lo escucha, llama a
 *    `preventDefault()` («yo me encargo») y se abre.
 * 3. Al confirmar, TIE escribe la cookie y dispara `pj:fulfillment-changed` (`detail: Fulfillment`)
 *    → `ensureStore()` resuelve `true`. Si se cierra sin elegir, `pj:fulfillment-dismissed` → `false`.
 * 4. Si nadie llama a `preventDefault()` (TIE no montado), resuelve `true` para no bloquear la demo.
 *
 * **Configurar producto (PRO).** El menú, la Home o las ofertas llaman a `requestConfigure(detail)`:
 * dispara `pj:configure-product` (cancelable). PRO abre su hoja y llama a `preventDefault()`; si
 * devuelve `false`, quien llama navega a `configureFallbackHref(detail)`.
 */
export const PJ_EVENTS = {
    openFulfillment: 'pj:open-fulfillment',
    fulfillmentChanged: 'pj:fulfillment-changed',
    fulfillmentDismissed: 'pj:fulfillment-dismissed',
    configureProduct: 'pj:configure-product',
} as const;

/** Alias con los nombres que usa TIE (`PJ_FULFILLMENT_EVENTS.open/changed/dismissed`). */
export const PJ_FULFILLMENT_EVENTS = {
    open: PJ_EVENTS.openFulfillment,
    changed: PJ_EVENTS.fulfillmentChanged,
    dismissed: PJ_EVENTS.fulfillmentDismissed,
} as const;

/** `detail` de `pj:open-fulfillment`. Todo opcional; TIE usa textos por defecto. */
export interface OpenFulfillmentDetail {
    /** Quién lo pide (`pj-menu`, `pj-offers`, `pj-product`, `pj-home`…). Informativo. */
    source?: string;
    /**
     * Motivo. Una frase con espacios se muestra tal cual («Para agregar tu Super Dúo.»); un código
     * sin espacios (`add-to-cart`) usa el texto por defecto del panel.
     */
    reason?: string;
    /** Si viene y `reason` no es una frase, el panel dice «Para agregar tu {productName}.» */
    productName?: string;
    /** Monto a la derecha del botón de confirmar («$16.900»). */
    amountLabel?: string;
    /** Texto del botón de confirmar («Confirmar y agregar»). */
    confirmLabel?: string;
}

/** `detail` de `pj:fulfillment-changed`: la modalidad ya guardada en la cookie. */
export type FulfillmentChangedDetail = Fulfillment;

/** Tamaños del menú (`pjSize`). */
export type PjSize = 'individual' | 'medium' | 'family' | 'extra_large';

/** `detail` de `pj:configure-product`. */
export interface ConfigureProductDetail {
    /** Producto maestro (`pz-pollo-bbq`, `pz-arma-tu-pizza`, `pz-mitades`). */
    productId: string;
    /** «½ Mitad»: abre el armador de mitades con `productId` en la primera mitad. */
    halfFirst?: boolean;
    /** Armador pedido desde las tarjetas de construcción. */
    builder?: 'mitades' | 'arma-tu-pizza';
    /** Tamaño elegido en el menú, para que la hoja lo traiga marcado. */
    size?: PjSize;
}

declare global {
    interface WindowEventMap {
        'pj:open-fulfillment': CustomEvent<OpenFulfillmentDetail>;
        'pj:fulfillment-changed': CustomEvent<FulfillmentChangedDetail>;
        'pj:fulfillment-dismissed': CustomEvent<undefined>;
        'pj:configure-product': CustomEvent<ConfigureProductDetail>;
    }
}

/** Hay tienda elegida (cookie `pj_fulfillment` con `storeId`). En el servidor, `true`. */
export function hasStore(): boolean {
    if (typeof document === 'undefined') return true;
    return Boolean(readFulfillmentFromDocument()?.storeId);
}

/**
 * Pide abrir el panel de tienda (TIE). Devuelve `true` si alguien lo tomó (`preventDefault`).
 */
export function requestFulfillmentPanel(detail: OpenFulfillmentDetail = {}): boolean {
    if (typeof window === 'undefined') return false;
    const event = new CustomEvent<OpenFulfillmentDetail>(PJ_EVENTS.openFulfillment, { cancelable: true, detail });
    window.dispatchEvent(event);
    return event.defaultPrevented;
}

/**
 * Resuelve `true` cuando ya se puede agregar (hay tienda, o se eligió en el panel, o el panel no
 * está montado) y `false` si el cliente cerró el panel sin elegir.
 */
export function ensureStore(detail: OpenFulfillmentDetail = { reason: 'add-to-cart' }): Promise<boolean> {
    if (hasStore()) return Promise.resolve(true);
    if (!requestFulfillmentPanel(detail)) return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
        const done = (value: boolean) => {
            window.removeEventListener(PJ_EVENTS.fulfillmentChanged, onChanged);
            window.removeEventListener(PJ_EVENTS.fulfillmentDismissed, onDismissed);
            resolve(value);
        };
        const onChanged = () => done(true);
        const onDismissed = () => done(false);
        window.addEventListener(PJ_EVENTS.fulfillmentChanged, onChanged);
        window.addEventListener(PJ_EVENTS.fulfillmentDismissed, onDismissed);
    });
}

/** Escribe la modalidad en la cookie y avisa al resto de la página (`pj:fulfillment-changed`). */
export function changeFulfillment(value: Fulfillment): void {
    writeFulfillmentToDocument(value);
    notifyFulfillmentChanged(value);
}

/** Avisa que la modalidad cambió (después de escribir la cookie). */
export function notifyFulfillmentChanged(value: Fulfillment): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent<FulfillmentChangedDetail>(PJ_EVENTS.fulfillmentChanged, { detail: value }));
}

/** Avisa que el panel se cerró sin elegir. */
export function notifyFulfillmentDismissed(): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(PJ_EVENTS.fulfillmentDismissed));
}

/** Pide a PRO configurar un producto. `true` si lo atendió; `false` → navegar al respaldo. */
export function requestConfigure(detail: ConfigureProductDetail): boolean {
    if (typeof window === 'undefined') return false;
    const event = new CustomEvent<ConfigureProductDetail>(PJ_EVENTS.configureProduct, { detail, cancelable: true });
    window.dispatchEvent(event);
    return event.defaultPrevented;
}

/** Destino de respaldo cuando nadie atiende `pj:configure-product`. */
export function configureFallbackHref(detail: ConfigureProductDetail): string {
    if (detail.halfFirst) return `/p/pz-mitades?mitad1=${encodeURIComponent(detail.productId)}`;
    return `/p/${detail.productId}${detail.size ? `?size=${detail.size}` : ''}`;
}
