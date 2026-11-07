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
/** @sfdc-extension-file SFDC_EXT_PJ_STORE */
import { useSyncExternalStore } from 'react';
import {
    readFulfillmentFromDocument,
    writeFulfillmentToDocument,
    type Fulfillment,
} from '@/extensions/pj-shared/lib/fulfillment';

/**
 * Lo que el encabezado necesita mostrar de la modalidad elegida y que la cookie `pj_fulfillment`
 * (CONTRATO §4.3) no guarda: nombre de la tienda y tiempo. Vive en `localStorage`, ligado al
 * `storeId` de la cookie.
 */
export interface FulfillmentMeta {
    storeId: string;
    storeName: string;
    /** Retiro: «15 min». Delivery: «35–45 min». Programado: «mañana 12:00». */
    timeText: string;
    /** El pedido está programado (no es «lo antes posible»). */
    scheduled?: boolean;
    /** Dirección para mostrar (delivery), con depto si lo hay. */
    addressText?: string;
}

/** Qué pide quien abre el panel. */
export interface RequireFulfillmentOptions {
    /**
     * Frase completa que explica para qué se pide, con punto final: «Para agregar tu Pollo BBQ
     * Familiar.» El panel le suma «Lo recordamos para la próxima.»
     */
    reason?: string;
    /** Se llama una vez guardada la modalidad (y cerrado el panel), con la modalidad elegida. */
    onConfirmed?: (fulfillment: Fulfillment) => void;
    /** Texto del botón de confirmar. Por defecto «Confirmar y agregar» si hay `onConfirmed`, si no «Confirmar». */
    confirmLabel?: string;
    /** Se llama si la persona cierra el panel sin elegir. */
    onDismissed?: () => void;
    /** Monto que se muestra a la derecha del botón («$16.900»). */
    amountLabel?: string;
    /** Modalidad con la que abre el panel (por defecto, la guardada o retiro). Locales usa `?modo=delivery`. */
    initialMode?: 'pickup' | 'delivery';
    /** Tienda que abre marcada en retiro (la que se tocó en Locales). */
    initialStoreId?: string;
    /** `scheduled` abre con «Programar» preseleccionado (tienda cerrada en Locales). */
    initialWhen?: 'asap' | 'scheduled';
}

interface State {
    fulfillment: Fulfillment | null;
    meta: FulfillmentMeta | null;
    panel: RequireFulfillmentOptions | null;
    hydrated: boolean;
}

const META_KEY = 'pj_fulfillment_meta';
const SERVER_STATE: State = { fulfillment: null, meta: null, panel: null, hydrated: false };

let state: State = SERVER_STATE;
const listeners = new Set<() => void>();

function emit(next: Partial<State>): void {
    state = { ...state, ...next };
    listeners.forEach((listener) => listener());
}

function readMeta(storeId: string): FulfillmentMeta | null {
    try {
        const raw = window.localStorage.getItem(META_KEY);
        if (!raw) return null;
        const meta = JSON.parse(raw) as FulfillmentMeta;
        return meta?.storeId === storeId ? meta : null;
    } catch {
        return null;
    }
}

function writeMeta(meta: FulfillmentMeta | null): void {
    try {
        if (meta) window.localStorage.setItem(META_KEY, JSON.stringify(meta));
        else window.localStorage.removeItem(META_KEY);
    } catch {
        // Sin almacenamiento (modo privado): el chip cae al nombre de la tienda de la cookie.
    }
}

/** Lee la cookie y el meta del navegador. Idempotente; no hace nada en el servidor. */
export function hydrateFulfillment(): void {
    if (typeof document === 'undefined') return;
    const fulfillment = readFulfillmentFromDocument();
    const meta = fulfillment ? readMeta(fulfillment.storeId) : null;
    const same =
        state.hydrated &&
        JSON.stringify(state.fulfillment) === JSON.stringify(fulfillment) &&
        JSON.stringify(state.meta) === JSON.stringify(meta);
    if (!same) emit({ fulfillment, meta, hydrated: true });
}

/** Guarda la modalidad (cookie `pj_fulfillment` + meta) y avisa a quien la mira. */
export function saveFulfillment(fulfillment: Fulfillment | null, meta: FulfillmentMeta | null): void {
    if (typeof document !== 'undefined') {
        writeFulfillmentToDocument(fulfillment);
        writeMeta(meta);
    }
    emit({ fulfillment, meta, hydrated: true });
}

export function getFulfillmentState(): State {
    return state;
}

export function subscribeFulfillment(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Abre el panel (aunque ya haya modalidad: lo usa el chip para cambiarla). */
export function openFulfillmentPanel(options: RequireFulfillmentOptions = {}): void {
    emit({ panel: options });
}

/** Eventos de `window` que son el mecanismo estándar para abrir el panel desde otras extensiones. */
export const PJ_FULFILLMENT_EVENTS = {
    open: 'pj:open-fulfillment',
    changed: 'pj:fulfillment-changed',
    dismissed: 'pj:fulfillment-dismissed',
} as const;

function dispatch(name: string, detail?: unknown): void {
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(name, { detail }));
}

/** Cierra el panel. Sin elegir (`confirmed = false`) dispara `pj:fulfillment-dismissed`. */
export function closeFulfillmentPanel(confirmed = false): void {
    const request = state.panel;
    emit({ panel: null });
    if (!confirmed && request) {
        dispatch(PJ_FULFILLMENT_EVENTS.dismissed);
        request.onDismissed?.();
    }
}

/** Avisa que la modalidad cambió (después de escribir la cookie). */
export function notifyFulfillmentChanged(fulfillment: Fulfillment): void {
    dispatch(PJ_FULFILLMENT_EVENTS.changed, fulfillment);
}

/**
 * Convierte el `detail` de `pj:open-fulfillment` en solicitud: `reason` con espacios se usa como
 * frase; `amountLabel` («$16.900») y `confirmLabel` («Confirmar y agregar») personalizan el botón; si trae `productName`, «Para agregar tu {productName}.»; un código como `add-to-cart` usa el texto por defecto.
 */
export function requestFromEventDetail(detail: unknown): RequireFulfillmentOptions {
    const d = (detail ?? {}) as {
        reason?: unknown;
        productName?: unknown;
        amountLabel?: unknown;
        confirmLabel?: unknown;
    };
    const options: RequireFulfillmentOptions = {};
    if (typeof d.reason === 'string' && d.reason.includes(' ')) options.reason = d.reason;
    else if (typeof d.productName === 'string' && d.productName) options.reason = `Para agregar tu ${d.productName}.`;
    if (typeof d.amountLabel === 'string') options.amountLabel = d.amountLabel;
    if (typeof d.confirmLabel === 'string') options.confirmLabel = d.confirmLabel;
    return options;
}

/**
 * Pide la modalidad antes de agregar: si ya hay una elegida llama a `onConfirmed` al instante y
 * devuelve `true`; si no, abre el panel con el motivo y llama a `onConfirmed` al confirmar
 * (devuelve `false`). Si la persona cierra el panel sin confirmar, no se llama.
 */
export function requireFulfillment(options: RequireFulfillmentOptions = {}): boolean {
    hydrateFulfillment();
    const current = state.fulfillment;
    if (current) {
        options.onConfirmed?.(current);
        return true;
    }
    openFulfillmentPanel(options);
    return false;
}

/** Estado actual de la modalidad, para pintar el encabezado, el carrito o el checkout. */
export function useFulfillment(): { fulfillment: Fulfillment | null; meta: FulfillmentMeta | null } {
    const snapshot = useSyncExternalStore(subscribeFulfillment, getFulfillmentState, () => SERVER_STATE);
    return { fulfillment: snapshot.fulfillment, meta: snapshot.meta };
}

/** Gancho para componentes: `const { requireFulfillment } = useRequireFulfillment()`. */
export function useRequireFulfillment() {
    const { fulfillment, meta } = useFulfillment();
    return { fulfillment, meta, requireFulfillment, openFulfillmentPanel };
}

export function usePanelRequest(): RequireFulfillmentOptions | null {
    return useSyncExternalStore(
        subscribeFulfillment,
        () => state.panel,
        () => null
    );
}

/** Solo para pruebas. */
export function resetFulfillmentStore(): void {
    state = SERVER_STATE;
    listeners.clear();
}
