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
/** @sfdc-extension-file SFDC_EXT_PJ_CHECKOUT */
import { describe, expect, it } from 'vitest';
import {
    cardBrand,
    chargeFor,
    formatCardNumber,
    formatExpiry,
    formatPhone,
    formatRut,
    invalidFields,
    luhnValid,
    parseExpiry,
    phoneValid,
    redeemedFromNote,
    rutValid,
    shipmentNote,
    trackingHref,
} from '../lib/checkout-model';
import type { PayFields } from '../lib/types';

const CANJE = { itemId: 'sp', productId: 'pz-super-pepperoni-medium-traditional', points: 260, value: 13000 };

/** Canasta canónica de Sofía con el canje (VAL-C3 H-1): Commerce calcula $36.890. */
const canonical = {
    orderTotal: 36890,
    shippingTotal: 0,
    productItems: [
        { itemId: 'pz', price: 16900, priceAfterItemDiscount: 16900, priceAfterOrderDiscount: 16900 },
        { itemId: 'pa', price: 5990, priceAfterItemDiscount: 4417, priceAfterOrderDiscount: 4417 },
        { itemId: 'co', price: 3490, priceAfterItemDiscount: 2573, priceAfterOrderDiscount: 2573 },
        { itemId: 'sp', price: 13000, priceAfterItemDiscount: 13000, priceAfterOrderDiscount: 13000 },
    ],
};

describe('chargeFor (lo cobrado = lo que se ve)', () => {
    it('sin promoción de canje, cobra $23.890 aunque Commerce calcule $36.890', () => {
        expect(chargeFor(canonical, CANJE)).toEqual({ orderTotal: 36890, canjeCharge: 13000, charged: 23890 });
    });

    it('con la promoción pj-canje-puntos, cobra lo que dice Commerce', () => {
        const promo = {
            orderTotal: 23890,
            productItems: [
                ...canonical.productItems.slice(0, 3),
                {
                    itemId: 'sp',
                    price: 13000,
                    priceAfterItemDiscount: 0,
                    priceAfterOrderDiscount: 0,
                    priceAdjustments: [{ promotionId: 'pj-canje-puntos' }],
                },
            ],
        };
        expect(chargeFor(promo, CANJE).charged).toBe(23890);
    });

    it('sin canje o con una línea que ya no existe, cobra el total de Commerce', () => {
        expect(chargeFor(canonical, null).charged).toBe(36890);
        expect(chargeFor(canonical, { ...CANJE, itemId: 'otra' }).charged).toBe(36890);
    });

    it('suma las opciones de la línea canjeada', () => {
        const withOption = {
            orderTotal: 15000,
            productItems: [
                {
                    itemId: 'sp',
                    price: 13000,
                    priceAfterOrderDiscount: 13000,
                    optionItems: [{ price: 2000, priceAfterOrderDiscount: 2000 }],
                },
            ],
        };
        expect(chargeFor(withOption, CANJE).charged).toBe(0);
    });
});

describe('tarjeta', () => {
    it('valida Luhn y reconoce solo las marcas aceptadas', () => {
        expect(luhnValid('4242 4242 4242 4242')).toBe(true);
        expect(luhnValid('4242 4242 4242 4241')).toBe(false);
        expect(cardBrand('4000 0000 0000 0002')).toBe('Visa');
        expect(cardBrand('5555 5555 5555 4444')).toBe('Mastercard');
        expect(cardBrand('3782 822463 10005')).toBe('Amex');
        expect(cardBrand('6011 1111 1111 1117')).toBeNull();
    });

    it('da formato al número y al vencimiento mientras se escribe', () => {
        expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
        expect(formatExpiry('1229')).toBe('12/29');
        expect(formatExpiry('1')).toBe('1');
    });

    it('acepta solo vencimientos futuros', () => {
        const now = new Date(2026, 10, 7);
        expect(parseExpiry('12/29', now)).toEqual({ month: 12, year: 2029 });
        expect(parseExpiry('11/26', now)).toEqual({ month: 11, year: 2026 });
        expect(parseExpiry('10/26', now)).toBeNull();
        expect(parseExpiry('13/29', now)).toBeNull();
    });
});

describe('RUT y celular', () => {
    it('valida el dígito verificador y da formato', () => {
        expect(rutValid('76.123.456-7')).toBe(false);
        expect(rutValid('76.086.428-5')).toBe(true);
        expect(rutValid('11.111.111-1')).toBe(true);
        expect(formatRut('760864285')).toBe('76.086.428-5');
    });

    it('celular chileno con o sin +56', () => {
        expect(phoneValid('+56976543210')).toBe(true);
        expect(phoneValid('9 7654 3210')).toBe(true);
        expect(phoneValid('22345678')).toBe(false);
        expect(formatPhone('+56976543210')).toBe('+56 9 7654 3210');
    });
});

describe('nota del envío', () => {
    it('deja el canje legible y se puede leer de vuelta', () => {
        const note = shipmentNote({
            canje: { points: 260, name: 'Super Pepperoni mediana' },
            payment: 'Pago: tarjeta de prueba (sin pasarela)',
            document: 'Boleta',
            note: 'cortar en 12',
        });
        expect(note).toBe(
            'Canje Papa Puntos: 260 puntos (Super Pepperoni mediana) | Pago: tarjeta de prueba (sin pasarela) | Boleta | Nota: cortar en 12'
        );
        expect(redeemedFromNote(note)).toBe(260);
        expect(redeemedFromNote('Boleta')).toBe(0);
    });
});

describe('invalidFields', () => {
    const base: PayFields = {
        expectedTotal: 23890,
        method: 'saved-card',
        firstName: 'Sofía',
        lastName: 'Muñoz',
        email: 'sofia@demo.pj.cl',
        phone: '+56 9 7654 3210',
        cvv: '123',
        cardNumber: '',
        cardExpiry: '',
        cardHolder: '',
        cardRut: '',
        docType: 'boleta',
        rut: '',
        businessName: '',
        businessActivity: '',
        businessAddress: '',
        note: '',
    };

    it('Sofía con tarjeta guardada solo necesita el CVV', () => {
        expect(invalidFields(base, true)).toEqual([]);
        expect(invalidFields({ ...base, cvv: '' }, true)).toEqual(['cvv']);
        expect(invalidFields(base, false)).toEqual(['method']);
    });

    it('tarjeta nueva pide número, vencimiento, CVV, titular y RUT', () => {
        expect(invalidFields({ ...base, method: 'new-card', cvv: '' }, false)).toEqual([
            'cardNumber',
            'cardExpiry',
            'cvv',
            'cardHolder',
            'cardRut',
        ]);
    });

    it('efectivo no pide tarjeta; factura pide los datos de la empresa', () => {
        expect(invalidFields({ ...base, method: 'cash', cvv: '' }, false)).toEqual([]);
        expect(invalidFields({ ...base, docType: 'factura' }, true)).toEqual([
            'rut',
            'businessName',
            'businessActivity',
            'businessAddress',
        ]);
    });
});

describe('trackingHref', () => {
    it('lleva al seguimiento de SEG con el número de pedido', () => {
        expect(trackingHref('00000100')).toBe('/seguimiento?pedido=00000100');
    });
});
