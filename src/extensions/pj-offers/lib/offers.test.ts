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
import {
    featuredAccent,
    fullRowFraming,
    gridGap,
    daysLeft,
    discountPercent,
    filterByOccasion,
    formatDayMonth,
    offerFromProduct,
    offerStatus,
    orderOffers,
    savings,
    showsValidity,
    whoLabel,
    withUtm,
    type Offer,
} from './offers';

const superDuo = offerFromProduct({
    id: 'cb-super-duo',
    name: 'Super Dúo',
    price: 22590,
    c_pjPriceBefore: 27800,
    c_pjOccasion: ['para-4'],
    c_pjServes: 'Para 4',
    c_pjValidTo: '2055-05-05T00:00:00.000Z',
    c_pjSlots: JSON.stringify({
        slots: [
            {
                id: 'pizza1',
                kind: 'pizza',
                label: 'Pizza 1 de 2',
                size: 'family',
                choices: ['pz-a', 'pz-b'],
                default: 'pz-a',
            },
        ],
    }),
});

describe('offers', () => {
    it('lee el combo de Commerce', () => {
        expect(superDuo.slug).toBe('super-duo');
        expect(superDuo.hasBuilder).toBe(true);
        expect(savings(superDuo)).toBe(5210);
        expect(discountPercent(superDuo)).toBe(19);
        expect(superDuo.slots[0].choices).toEqual(['pz-a', 'pz-b']);
    });

    it('Super Dúo solo retiro: con la promoción activa o el modo forzado', () => {
        expect(superDuo.pickupOnly).toBe(false);
        expect(
            offerFromProduct({ id: 'cb-super-duo', productPromotions: [{ promotionId: 'pj-super-duo-pickup' }] })
                .pickupOnly
        ).toBe(true);
        expect(offerFromProduct({ id: 'cb-super-duo' }, { forcePickupOnly: true }).pickupOnly).toBe(true);
        expect(offerFromProduct({ id: 'cb-super-trio' }, { forcePickupOnly: true }).pickupOnly).toBe(false);
    });

    it('filtra por ocasión', () => {
        const offers = [superDuo, { ...superDuo, id: 'cb-super-trio', occasions: ['para-6'] }] as Offer[];
        expect(filterByOccasion(offers, 'todas')).toHaveLength(2);
        expect(filterByOccasion(offers, '4').map((o) => o.id)).toEqual(['cb-super-duo']);
        expect(filterByOccasion(offers, '6').map((o) => o.id)).toEqual(['cb-super-trio']);
        expect(filterByOccasion(offers, '1')).toHaveLength(0);
    });

    it('la Pizza del Mes va primero', () => {
        const offers = [superDuo, { ...superDuo, id: 'cb-pizza-del-mes' }] as Offer[];
        expect(orderOffers(offers)[0].id).toBe('cb-pizza-del-mes');
    });

    it('vigencia: solo se muestra con 7 días o menos', () => {
        const now = new Date('2026-11-06T15:00:00Z');
        expect(daysLeft('2026-12-07T00:00:00Z', now)).toBe(30);
        expect(showsValidity('2026-12-07T00:00:00Z', now)).toBe(false);
        expect(showsValidity('2026-11-13T12:00:00Z', now)).toBe(true);
        expect(showsValidity('2026-11-14T12:00:00Z', now)).toBe(false);
        expect(showsValidity(null, now)).toBe(false);
    });

    it('estado: vencida, vigente y próxima', () => {
        const now = new Date('2026-11-06T15:00:00Z');
        expect(offerStatus({ validFrom: '2026-10-07T00:00:00Z', validTo: '2026-11-02T14:10:00Z' }, now)).toBe(
            'expired'
        );
        expect(offerStatus({ validFrom: null, validTo: '2026-12-07T00:00:00Z' }, now)).toBe('active');
        expect(offerStatus({ validFrom: '2026-12-01T00:00:00Z', validTo: null }, now)).toBe('upcoming');
    });

    it('formatea el día en la zona de Chile', () => {
        expect(formatDayMonth('2026-11-02T14:10:00.000Z')).toBe('2 de noviembre');
    });

    it('«Para 6 o más» se muestra «Para 6+»', () => {
        expect(whoLabel('Para 6 o más')).toBe('Para 6+');
        expect(whoLabel('Para 4')).toBe('Para 4');
    });

    it('conserva solo los utm_*', () => {
        expect(withUtm('/promos/super-duo', '?utm_source=meta&x=1&utm_campaign=PJSD26')).toBe(
            '/promos/super-duo?utm_source=meta&utm_campaign=PJSD26'
        );
        expect(withUtm('/promos', '?x=1')).toBe('/promos');
    });
});

describe('OFE-06: encuadre, destacada y grilla', () => {
    it('las fotos en fila completa van sin zoom', () => {
        expect(fullRowFraming('cb-super-duo')?.crop).toBe('none');
        expect(fullRowFraming('cb-papa-combo-postre')).not.toBeNull();
        expect(fullRowFraming('cb-papa-flash')).toBeNull();
    });
    it('separa el nombre de la pizza del mes para el acento', () => {
        expect(featuredAccent('Pizza del Mes The Works Familiar')).toBe('The Works');
        expect(featuredAccent('Pizza del mes Pepperoni')).toBe('Pepperoni');
        expect(featuredAccent('Super Dúo')).toBeNull();
    });
    it('cuenta las celdas que faltan para cerrar la fila', () => {
        expect(gridGap(5, 3)).toBe(1);
        expect(gridGap(4, 3)).toBe(2);
        expect(gridGap(6, 3)).toBe(0);
        expect(gridGap(0, 3)).toBe(0);
    });
});
