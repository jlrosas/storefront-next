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
import { deliveryWindow, haversineKm, isStoreClosed, type PjStore } from './store-info';

/**
 * Zonas de reparto de la demo (supuesto: en el proyecto son un servicio propio o del cliente,
 * ver 05 «Modelo en Commerce Cloud»). Cada tienda reparte en las comunas de su zona; una
 * tienda sin entrada reparte en la comuna donde está. La zona de Providencia queda con la tienda
 * Providencia y Salvador (la que la cubre cuando Providencia está cerrada), no con El Bosque.
 */
export const DELIVERY_ZONES: Record<string, readonly string[]> = {
    'pj-2': ['providencia', 'santiago'],
    'pj-9': ['providencia', 'ñuñoa', 'santiago', 'macul'],
    'pj-48': ['las condes', 'vitacura', 'lo barnechea'],
};

export interface DeliveryPoint {
    latitude: number;
    longitude: number;
    /** Comunas que Google u otra fuente asocia a la dirección (cualquiera sirve para la zona). */
    communes: readonly string[];
}

export interface DeliveryAssignment {
    store: PjStore;
    /** Tienda de la zona que estaba cerrada y por eso se asignó otra. */
    skippedClosed: PjStore | null;
}

function normalize(value: string): string {
    return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function covers(store: PjStore, communes: readonly string[]): boolean {
    const zone = (DELIVERY_ZONES[store.id] ?? (store.city ? [store.city] : [])).map(normalize);
    return communes.map(normalize).some((commune) => zone.includes(commune));
}

/**
 * Regla por cercanía (TIE-02): entre las tiendas que reparten en la comuna, la más cercana que
 * esté abierta. Si ninguna está abierta, la más cercana abierta de todas. Devuelve `null` si
 * no hay tiendas abiertas.
 */
export function assignDeliveryStore(stores: readonly PjStore[], point: DeliveryPoint): DeliveryAssignment | null {
    const withDistance = stores
        .flatMap((s) =>
            typeof s.latitude === 'number' && typeof s.longitude === 'number'
                ? [{ store: s, km: haversineKm(point.latitude, point.longitude, s.latitude, s.longitude) }]
                : []
        )
        .sort((a, b) => a.km - b.km);
    const inZone = withDistance.filter((entry) => covers(entry.store, point.communes));
    const pool = inZone.length > 0 ? inZone : withDistance;
    const open = pool.find((entry) => !isStoreClosed(entry.store)) ?? withDistance.find((e) => !isStoreClosed(e.store));
    if (!open) return null;
    const firstOfZone = pool[0]?.store;
    const skippedClosed = firstOfZone && isStoreClosed(firstOfZone) ? firstOfZone : null;
    return { store: open.store, skippedClosed };
}

/** «35–45 min» de la tienda asignada. */
export function deliveryWindowText(store: PjStore): string {
    const { from, to } = deliveryWindow(store);
    return `${from}–${to} min`;
}

/** Direcciones de ejemplo cuando Google Places no responde (TIE-02, criterio 4). */
export interface SampleAddress {
    main: string;
    sub: string;
    latitude: number;
    longitude: number;
    communes: readonly string[];
}

export const SAMPLE_ADDRESSES: readonly SampleAddress[] = [
    {
        main: 'Av. Providencia 1234',
        sub: 'Providencia, Región Metropolitana',
        latitude: -33.4262,
        longitude: -70.6143,
        communes: ['Providencia'],
    },
    {
        main: 'Av. Apoquindo 3000',
        sub: 'Las Condes, Región Metropolitana',
        latitude: -33.4175,
        longitude: -70.5988,
        communes: ['Las Condes'],
    },
    {
        main: 'Av. Irarrázaval 2400',
        sub: 'Ñuñoa, Región Metropolitana',
        latitude: -33.4549,
        longitude: -70.6082,
        communes: ['Ñuñoa'],
    },
];

/** Filtra los ejemplos por lo que escribió la persona (si no escribió nada, los tres). */
export function filterSampleAddresses(query: string): readonly SampleAddress[] {
    const q = normalize(query);
    if (q.length < 2) return SAMPLE_ADDRESSES;
    const found = SAMPLE_ADDRESSES.filter((a) => normalize(`${a.main} ${a.sub}`).includes(q));
    return found.length > 0 ? found : SAMPLE_ADDRESSES;
}
