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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import { describe, expect, it } from 'vitest';
import {
    halvesHref,
    halvesLabel,
    initialHalvesSelection,
    isHalvesItem,
    parseHalves,
    serializeHalves,
    type HalvesConfig,
} from '../lib/halves';
import { comboPricing, parseClpAmounts, promotionSavingsInBasket } from '../lib/upsell';
import { basketTotal, itemCount, lineTotal, pizzaLineCount } from '../lib/cart-lines';
import { parsePjCartPayload } from '../lib/cart-payload';
import { sheetRequestFor } from '../lib/configure-bridge';

const CONFIG: HalvesConfig = {
    productId: 'pz-mitades',
    name: 'Pizza mitad y mitad',
    sensory: null,
    sizes: [{ id: 'family', label: 'Familiar', price: 12400, serves: null, extraPrice: 0 }],
    crusts: [{ id: 'traditional', label: 'Tradicional' }],
    variants: [
        {
            productId: 'pz-mitades-family-traditional',
            size: 'family',
            crust: 'traditional',
            price: 12400,
            orderable: true,
        },
    ],
    flavors: [
        { id: 'pz-pollo-bbq', name: 'Pollo BBQ', image: null, prices: { family: 16900 } },
        { id: 'pz-todas-las-carnes', name: 'Todas las Carnes', image: null, prices: { family: 18900 } },
    ],
};

describe('mitades', () => {
    it('c_pjHalves de ida y vuelta', () => {
        const raw = serializeHalves(['pz-pollo-bbq', 'pz-todas-las-carnes']);
        expect(JSON.parse(raw)).toEqual([
            { part: 1, product: 'pz-pollo-bbq' },
            { part: 2, product: 'pz-todas-las-carnes' },
        ]);
        expect(parseHalves(raw)).toEqual(['pz-pollo-bbq', 'pz-todas-las-carnes']);
        expect(parseHalves('nope')).toEqual([]);
    });

    it('mitades iniciales: solo especialidades válidas', () => {
        expect(initialHalvesSelection(CONFIG, ['pz-pollo-bbq']).halves).toEqual(['pz-pollo-bbq', null]);
        expect(initialHalvesSelection(CONFIG, ['pz-croissant', 'pz-todas-las-carnes']).halves).toEqual([
            null,
            'pz-todas-las-carnes',
        ]);
    });

    it('línea, etiqueta y rutas', () => {
        expect(isHalvesItem({ productId: 'pz-mitades-family-traditional' })).toBe(true);
        expect(isHalvesItem({ productId: 'pz-pollo-bbq-family-traditional' })).toBe(false);
        expect(halvesLabel(['Pollo BBQ', 'Todas las Carnes'])).toBe('½ Pollo BBQ · ½ Todas las Carnes');
        expect(halvesHref({ item: 'abc' })).toBe('/mitades?item=abc');
        expect(halvesHref({ first: 'pz-pollo-bbq', second: 'pz-todas-las-carnes' })).toBe(
            '/mitades?primera=pz-pollo-bbq&segunda=pz-todas-las-carnes'
        );
    });
});

describe('Hazlo combo', () => {
    it('precio y ahorro desde la promoción', () => {
        const callout = 'Hazlo combo: Palitos de Ajo y bebida 1,5 L por $6.990 (ahorras $2.490)';
        expect(parseClpAmounts(callout)).toEqual([6990, 2490]);
        expect(comboPricing(callout, 9480)).toEqual({ price: 6990, savings: 2490 });
        expect(comboPricing('Sin monto', 9480)).toEqual({ price: 9480, savings: 0 });
    });

    it('ahorro real aplicado en el carrito', () => {
        const basket = {
            productItems: [
                { priceAdjustments: [{ promotionId: 'pj-hazlo-combo', price: -1573 }] },
                { priceAdjustments: [{ promotionId: 'pj-hazlo-combo', price: -917 }] },
                { priceAdjustments: [{ promotionId: 'otra', price: -100 }] },
            ],
        };
        expect(promotionSavingsInBasket(basket)).toBe(2490);
    });
});

describe('carrito', () => {
    const basket = {
        productTotal: 23890,
        productItems: [
            {
                itemId: 'p',
                productId: 'pz-pollo-bbq-family-traditional',
                quantity: 1,
                price: 16900,
                optionItems: [
                    { optionValueId: 'si', price: 1940 },
                    { optionValueId: 'no', price: 0 },
                ],
            },
            { itemId: 'a', productId: 'cp-palitos-de-ajo', quantity: 1, price: 5990, priceAfterItemDiscount: 4417 },
            { itemId: 'c', productId: 'cp-coca-cola-sin-azucar-10', quantity: 1, price: 3490 },
        ],
    };

    it('total de línea con opciones y descuentos', () => {
        expect(lineTotal(basket.productItems[0])).toBe(18840);
        expect(lineTotal(basket.productItems[1])).toBe(4417);
    });

    it('conteos para «Hazlo combo» y «Ver pedido (N)»', () => {
        expect(pizzaLineCount(basket)).toBe(1);
        expect(itemCount(basket)).toBe(3);
        expect(basketTotal(basket)).toBe(23890);
    });

    it('valida el payload de la acción', () => {
        expect(parsePjCartPayload('{"intent":"remove","itemIds":["a"]}')).toEqual({ intent: 'remove', itemIds: ['a'] });
        expect(parsePjCartPayload('{"intent":"halves","productId":"x","quantity":1,"halves":["a"]}')).toBeNull();
        expect(
            parsePjCartPayload({
                intent: 'pizza',
                productId: 'pz-pollo-bbq-family-traditional',
                quantity: 1,
                optionItems: [
                    { optionId: 'pjExtras_choclo', optionValueId: 'si' },
                    { optionId: 'x', optionValueId: 'otro' },
                ],
                removed: ['cebolla'],
            })
        ).toEqual({
            intent: 'pizza',
            productId: 'pz-pollo-bbq-family-traditional',
            quantity: 1,
            optionItems: [{ optionId: 'pjExtras_choclo', optionValueId: 'si' }],
            removed: ['cebolla'],
            sides: [],
        });
        expect(parsePjCartPayload('basura')).toBeNull();
    });
});

describe('contrato con MEN (pj:configure-product)', () => {
    it('abre la hoja, el armador o «Arma tu pizza»', () => {
        expect(sheetRequestFor({ productId: 'pz-pollo-bbq', size: 'medium' })).toEqual({
            productId: 'pz-pollo-bbq',
            halfFirst: false,
            size: 'medium',
        });
        expect(sheetRequestFor({ productId: 'pz-pollo-bbq', halfFirst: true })?.halfFirst).toBe(true);
        expect(sheetRequestFor({ productId: 'pz-mitades', builder: 'mitades' })?.halfFirst).toBe(true);
        expect(sheetRequestFor({ productId: 'x', builder: 'arma-tu-pizza' })?.productId).toBe('pz-arma-tu-pizza');
        expect(sheetRequestFor({ productId: '' })).toBeNull();
    });
});
