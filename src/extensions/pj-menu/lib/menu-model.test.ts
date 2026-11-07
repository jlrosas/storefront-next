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
import { toMenuProduct, optionLabel } from './menu-mapper';
import { groupPriceRange, matchesFilter, offerHref, priceAtSize, rankOffers, type MenuProduct } from './menu-model';

const variant = (id: string, size: string, crust: string, price: number) => ({
    productId: id,
    price,
    variationValues: { pjSize: size, pjCrust: crust },
});

const pizza = toMenuProduct({
    productId: 'pz-x',
    productName: 'X',
    variants: [
        variant('a', 'medium', 'traditional', 13000),
        variant('b', 'family', 'traditional', 16900),
        variant('c', 'family', 'thin', 16900),
        variant('d', 'extra_large', 'traditional', 21900),
    ],
    representedProduct: {
        c_pjKind: 'pizza',
        c_pjBadges: ['mas-pedida'],
        c_pjFoodType: ['picante'],
        c_pjHalvesEnabled: true,
    },
});

const offer = (id: string, price: number, before: number | null, validTo: string | null = null): MenuProduct =>
    ({ ...pizza, id, kind: 'combo', price, listPrice: before, validTo, validFrom: null }) as MenuProduct;

describe('menu-model', () => {
    it('toma el precio por tamaño de la masa tradicional', () => {
        expect(priceAtSize(pizza, 'medium')).toBe(13000);
        expect(priceAtSize(pizza, 'family')).toBe(16900);
        expect(priceAtSize(pizza, 'extra_large')).toBe(21900);
    });
    it('Pan Pizza y Croissant muestran su único tamaño', () => {
        const croissant = toMenuProduct({
            productId: 'pz-c',
            representedProduct: { c_pjKind: 'pizza' },
            variants: [variant('c1', 'medium', 'croissant', 13990)],
        });
        expect(priceAtSize(croissant, 'extra_large')).toBe(13990);
        expect(croissant.single?.label).toBe('single');
    });
    it('filtra y calcula el rango del grupo', () => {
        expect(matchesFilter(pizza, 'top')).toBe(true);
        expect(matchesFilter(pizza, 'veg')).toBe(false);
        expect(matchesFilter(pizza, 'spicy')).toBe(true);
        expect(groupPriceRange([pizza], 'family')).toEqual({ min: 16900, max: 16900 });
    });
    it('ordena las ofertas por perfil y descarta las vencidas', () => {
        const offers = [
            offer('cb-super-duo', 22590, 27800),
            offer('cb-pizza-del-mes', 10990, 21900),
            offer('cb-box-halloween', 19990, 23880, '2026-11-02T00:00:00Z'),
        ];
        const ranked = rankOffers(offers, 'valentina', null, new Date('2026-11-06T12:00:00Z'));
        expect(ranked.map((o) => o.id)).toEqual(['cb-pizza-del-mes', 'cb-super-duo']);
        expect(rankOffers(offers, 'diego', null, new Date('2026-11-06T12:00:00Z'))[0].id).toBe('cb-super-duo');
    });
    it('limpia las etiquetas de las opciones', () => {
        expect(optionLabel('Coca-Cola 350 ml', 'Coca-Cola')).toBe('350 ml');
        expect(optionLabel('1.5 L', 'Coca-Cola')).toBe('1,5 L');
    });
});

describe('offerHref (AUD-compra P0-2)', () => {
    it('Super Dúo y Super Trío van a su constructor', () => {
        expect(offerHref('cb-super-duo')).toBe('/promos/super-duo');
        expect(offerHref('cb-super-trio')).toBe('/promos/super-trio');
    });
    it('los demás combos van a su ficha', () => {
        expect(offerHref('cb-pizza-del-mes')).toBe('/p/cb-pizza-del-mes');
        expect(offerHref('cb-papa-flash')).toBe('/p/cb-papa-flash');
    });
});
