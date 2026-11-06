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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import { describe, expect, it } from 'vitest';
import { assignDeliveryStore, filterSampleAddresses, SAMPLE_ADDRESSES } from './delivery-zones';
import type { PjStore } from './store-info';

const bosque: PjStore = {
    id: 'pj-48',
    name: 'Papa Johns El Bosque',
    city: 'Las Condes',
    latitude: -33.419657,
    longitude: -70.599999,
    c_pjClosed: false,
    c_pjDeliveryMinutes: 30,
};
const providencia: PjStore = {
    id: 'pj-2',
    name: 'Papa Johns Providencia',
    city: 'Providencia',
    latitude: -33.428823,
    longitude: -70.619916,
    c_pjClosed: true,
    c_pjDeliveryMinutes: 30,
};
const salvador: PjStore = {
    id: 'pj-9',
    name: 'Papa Johns Salvador',
    city: 'Ñuñoa',
    latitude: -33.44969,
    longitude: -70.621613,
    c_pjClosed: false,
    c_pjDeliveryMinutes: 40,
};

describe('assignDeliveryStore', () => {
    const providenciaAddress = SAMPLE_ADDRESSES[0];
    const point = {
        latitude: providenciaAddress.latitude,
        longitude: providenciaAddress.longitude,
        communes: providenciaAddress.communes,
    };

    it('asigna Av. Providencia 1234 a Salvador porque Providencia está cerrada', () => {
        const result = assignDeliveryStore([bosque, providencia, salvador], point);
        expect(result?.store.id).toBe('pj-9');
        expect(result?.skippedClosed?.id).toBe('pj-2');
    });

    it('con Providencia abierta, la atiende Providencia', () => {
        const result = assignDeliveryStore([bosque, { ...providencia, c_pjClosed: false }, salvador], point);
        expect(result?.store.id).toBe('pj-2');
        expect(result?.skippedClosed).toBeNull();
    });

    it('una comuna de la zona de El Bosque se asigna a El Bosque', () => {
        const apoquindo = SAMPLE_ADDRESSES[1];
        const result = assignDeliveryStore([bosque, providencia, salvador], {
            latitude: apoquindo.latitude,
            longitude: apoquindo.longitude,
            communes: apoquindo.communes,
        });
        expect(result?.store.id).toBe('pj-48');
    });

    it('si ninguna tienda del reparto está abierta, usa la abierta más cercana', () => {
        const result = assignDeliveryStore([{ ...salvador, c_pjClosed: true }, providencia, bosque], point);
        expect(result?.store.id).toBe('pj-48');
    });

    it('devuelve null sin tiendas abiertas', () => {
        expect(assignDeliveryStore([providencia], point)).toBeNull();
    });
});

describe('filterSampleAddresses', () => {
    it('sin texto muestra las tres de ejemplo', () => {
        expect(filterSampleAddresses('')).toHaveLength(3);
    });
    it('filtra por lo escrito y, si no hay coincidencias, muestra las tres', () => {
        expect(filterSampleAddresses('providencia 12')).toHaveLength(1);
        expect(filterSampleAddresses('zzz')).toHaveLength(3);
    });
});
