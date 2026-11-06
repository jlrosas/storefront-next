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
import { describe, expect, it } from 'vitest';
import {
    DELIVERY_FEE_CLP,
    getFulfillment,
    normalizeFulfillment,
    parseFulfillment,
    readFulfillmentFromDocument,
    serializeFulfillmentCookie,
    shippingFor,
    writeFulfillmentToDocument,
    type Fulfillment,
} from './fulfillment';

const pickup: Fulfillment = { mode: 'pickup', storeId: 'pj-el-bosque', when: 'asap' };
const delivery: Fulfillment = {
    mode: 'delivery',
    storeId: 'pj-providencia',
    address: 'Av. Providencia 1234, depto 504',
    when: '2026-11-20T21:05:00-03:00',
};

describe('pj_fulfillment (CONTRATO §4.3)', () => {
    it('escribe y vuelve a leer la modalidad desde la cabecera Cookie', () => {
        const setCookie = serializeFulfillmentCookie(delivery);
        expect(setCookie).toMatch(/^pj_fulfillment=/);
        expect(setCookie).toContain('Path=/');
        expect(setCookie).toContain('SameSite=Lax');
        const value = setCookie.split(';')[0].slice('pj_fulfillment='.length);
        const request = new Request('https://x.test/', { headers: { Cookie: `other=1; pj_fulfillment=${value}` } });
        expect(getFulfillment(request)).toEqual(delivery);
    });

    it('acepta JSON sin codificar', () => {
        expect(parseFulfillment(JSON.stringify(pickup))).toEqual(pickup);
    });

    it('rechaza valores inválidos', () => {
        expect(parseFulfillment('no-json')).toBeNull();
        expect(parseFulfillment(JSON.stringify({ mode: 'dine-in', storeId: 'x' }))).toBeNull();
        expect(parseFulfillment(JSON.stringify({ mode: 'pickup', storeId: '' }))).toBeNull();
        expect(parseFulfillment(null)).toBeNull();
    });

    it('normaliza: when inválido pasa a asap y retiro no guarda dirección', () => {
        expect(
            normalizeFulfillment({ mode: 'pickup', storeId: ' pj-el-bosque ', address: 'x', when: 'mañana' })
        ).toEqual(pickup);
    });

    it('borra la cookie con null', () => {
        expect(serializeFulfillmentCookie(null)).toBe('pj_fulfillment=; Path=/; Max-Age=0; SameSite=Lax');
    });

    it('lee y escribe en el navegador', () => {
        const doc = { cookie: '' };
        writeFulfillmentToDocument(pickup, doc);
        // document.cookie devuelve solo nombre=valor
        doc.cookie = doc.cookie.split(';')[0];
        expect(readFulfillmentFromDocument(doc)).toEqual(pickup);
    });

    it('el despacho solo se cobra en delivery', () => {
        expect(shippingFor(delivery)).toBe(DELIVERY_FEE_CLP);
        expect(shippingFor(pickup)).toBe(0);
        expect(shippingFor(null)).toBe(0);
    });
});
