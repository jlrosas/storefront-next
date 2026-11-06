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

/**
 * Tienda tal como la devuelve `/resource/stores` (Shopper Stores) con los atributos de la
 * demo (CONTRATO §4.3 y §7).
 */
export interface PjStore {
    id: string;
    name: string;
    address1?: string;
    city?: string;
    /** Distancia al punto de búsqueda, en km. */
    distance?: number;
    latitude?: number;
    longitude?: number;
    inventoryId?: string;
    c_pjClosed?: boolean;
    c_pjOpenUntil?: string;
    c_pjOpensAt?: string;
    c_pjPickupMinutes?: number;
    c_pjDeliveryMinutes?: number;
    c_pjCash?: boolean;
}

const DEFAULT_OPENS_AT = '11:00';
const DEFAULT_OPEN_UNTIL = '23:00';
const DEFAULT_PICKUP_MINUTES = 15;
const DEFAULT_DELIVERY_MINUTES = 30;

/** «Papa Johns El Bosque» → «El Bosque». */
export function shortStoreName(name: string): string {
    return name
        .replace(/^papa johns\s+/i, '')
        .replace(/\.$/, '')
        .trim();
}

/**
 * Cerrada solo cuando el interruptor `c_pjClosed` lo dice (caso 1 de la demo, forzable desde el
 * panel). El horario no cierra la tienda por reloj: la demo no debe depender de la hora de la sala.
 */
export function isStoreClosed(store: Pick<PjStore, 'c_pjClosed'>): boolean {
    return store.c_pjClosed === true;
}

export function opensAt(store: Pick<PjStore, 'c_pjOpensAt'>): string {
    return store.c_pjOpensAt || DEFAULT_OPENS_AT;
}

export function openUntil(store: Pick<PjStore, 'c_pjOpenUntil'>): string {
    return store.c_pjOpenUntil || DEFAULT_OPEN_UNTIL;
}

export function pickupMinutes(store: Pick<PjStore, 'c_pjPickupMinutes'>): number {
    return store.c_pjPickupMinutes ?? DEFAULT_PICKUP_MINUTES;
}

export function deliveryMinutes(store: Pick<PjStore, 'c_pjDeliveryMinutes'>): number {
    return store.c_pjDeliveryMinutes ?? DEFAULT_DELIVERY_MINUTES;
}

/** Ventana de delivery del lienzo: 40 min → «35–45». */
export function deliveryWindow(store: Pick<PjStore, 'c_pjDeliveryMinutes'>): { from: number; to: number } {
    const minutes = deliveryMinutes(store);
    return { from: Math.max(5, minutes - 5), to: minutes + 5 };
}

/** `0,8 km` con coma decimal. */
export function formatKm(km: number | undefined): string {
    if (km === undefined || !Number.isFinite(km)) return '';
    return `${km.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
}

/** Distancia en línea recta entre dos puntos, en km. */
export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const rad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
