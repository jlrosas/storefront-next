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
import type { ShopperProducts } from '@/scapi';
import { builderPath, pdpViewFor, productKind, simpleKind } from '../lib/product-kind';
import {
    addTotal,
    buildComboChoices,
    completeCandidates,
    defaultComboSelection,
    initialSimpleOption,
    orderOptions,
    parseComboSlots,
    pizzaVariantFor,
    shortDrinkName,
    validateComboChoices,
    variantLabel,
    type ComboPdpSlot,
} from '../lib/combo-pdp';
import { parsePjCartPayload } from '../lib/cart-payload';
import { buildComboSlots, simpleOptions } from '../lib/product-pdp.server';
import { halvesPrice } from '../lib/halves';

type Product = ShopperProducts.schemas['Product'];

/** `c_pjSlots` real de Papa Combo Palitos (sandbox, 06-nov), recortado. */
const PALITOS_SLOTS = JSON.stringify({
    slots: [
        {
            id: 'pizza1',
            kind: 'pizza',
            label: 'Tu pizza',
            size: 'family',
            choices: ['pz-napolitana', 'pz-pollo-bbq', 'pz-super-pepperoni'],
            default: 'pz-pollo-bbq',
        },
        {
            id: 'side',
            kind: 'side',
            label: 'Acompañamiento',
            choices: ['cp-palitos-de-ajo'],
            default: 'cp-palitos-de-ajo',
        },
        {
            id: 'drink',
            kind: 'drink',
            label: 'Bebida 1,5 L',
            choices: ['cp-coca-cola-light-7', 'cp-coca-cola-2', 'cp-coca-cola-sin-azucar-10'],
            default: 'cp-coca-cola-sin-azucar-10',
        },
    ],
});

const pizza = (id: string, name: string, weekly = 0): Product =>
    ({
        id,
        name,
        c_pjWeeklyOrders: weekly,
        variants: [
            { productId: `${id}-family-thin`, variationValues: { pjSize: 'family', pjCrust: 'thin' } },
            { productId: `${id}-family-traditional`, variationValues: { pjSize: 'family', pjCrust: 'traditional' } },
            { productId: `${id}-medium-traditional`, variationValues: { pjSize: 'medium', pjCrust: 'traditional' } },
        ],
    }) as unknown as Product;

const simple = (id: string, name: string): Product => ({ id, name }) as Product;

const PALITOS_PRODUCTS: Product[] = [
    pizza('pz-napolitana', 'Napolitana', 150),
    pizza('pz-pollo-bbq', 'Pollo BBQ', 320),
    pizza('pz-super-pepperoni', 'Super Pepperoni', 410),
    simple('cp-palitos-de-ajo', 'Palitos de Ajo'),
    simple('cp-coca-cola-light-7', 'Coca-Cola Light 1.5 LT'),
    simple('cp-coca-cola-2', 'Coca-Cola 1.5 LT'),
    simple('cp-coca-cola-sin-azucar-10', 'Coca-Cola Sin azúcar 1.5 LT'),
];

describe('pdpViewFor (PRO-08 · regla 1: la ficha depende del tipo de producto)', () => {
    it('usa c_pjKind del catálogo', () => {
        expect(pdpViewFor({ id: 'pz-pollo-bbq', c_pjKind: 'pizza' })).toBe('pizza');
        expect(pdpViewFor({ id: 'pz-arma-tu-pizza', c_pjKind: 'builder' })).toBe('pizza');
        expect(pdpViewFor({ id: 'cb-pizza-del-mes', c_pjKind: 'combo' })).toBe('combo');
        expect(pdpViewFor({ id: 'cb-papa-flash', c_pjKind: 'combo' })).toBe('combo');
        expect(pdpViewFor({ id: 'cp-coca-cola', c_pjKind: 'drink' })).toBe('simple');
        expect(pdpViewFor({ id: 'cp-palitos-de-ajo', c_pjKind: 'side' })).toBe('simple');
        expect(pdpViewFor({ id: 'cp-cookie', c_pjKind: 'dessert' })).toBe('simple');
        expect(pdpViewFor({ id: 'cp-pepperoncini', c_pjKind: 'extra' })).toBe('simple');
    });
    it('Super Dúo y Super Trío van a su constructor (S-D3)', () => {
        expect(pdpViewFor({ id: 'cb-super-duo', c_pjKind: 'combo' })).toBe('builder');
        expect(pdpViewFor({ id: 'cb-super-trio', c_pjKind: 'combo' })).toBe('builder');
        expect(builderPath('cb-super-duo')).toBe('/promos/super-duo');
    });
    it('pz-mitades (maestro o variante) va al armador', () => {
        expect(pdpViewFor({ id: 'pz-mitades', c_pjKind: 'builder' })).toBe('halves');
        expect(pdpViewFor({ id: 'pz-mitades-family-thin', master: { masterId: 'pz-mitades' } })).toBe('halves');
    });
    it('sin c_pjKind usa la categoría y después el prefijo; nunca la ficha del template', () => {
        expect(productKind({ id: 'x', primaryCategoryId: 'bebidas' })).toBe('drink');
        expect(productKind({ id: 'x', primaryCategory: { id: 'postres' } })).toBe('dessert');
        expect(pdpViewFor({ id: 'x', primaryCategoryId: 'pizzas-premium' })).toBe('pizza');
        expect(pdpViewFor({ id: 'cb-nuevo' })).toBe('combo');
        expect(pdpViewFor({ id: 'pz-nueva' })).toBe('pizza');
        expect(pdpViewFor({ id: 'ing-pepperoni', c_pjKind: 'ingredient' })).toBe('simple');
        expect(pdpViewFor({ id: 'algo-raro' })).toBe('simple');
        expect(simpleKind({ id: 'ing-x', c_pjKind: 'ingredient' })).toBe('side');
    });
});

describe('ficha de combo (PRO-08)', () => {
    const slots = buildComboSlots(PALITOS_SLOTS, PALITOS_PRODUCTS);

    it('arma las casillas con lo más pedido primero y la variante del tamaño en masa tradicional', () => {
        expect(slots.map((s) => s.id)).toEqual(['pizza1', 'side', 'drink']);
        expect(slots[0].options.map((o) => o.id)).toEqual(['pz-pollo-bbq', 'pz-super-pepperoni', 'pz-napolitana']);
        expect(slots[0].options[0].product).toBe('pz-pollo-bbq-family-traditional');
        expect(slots[2].options[0]).toMatchObject({ id: 'cp-coca-cola-sin-azucar-10', name: 'Coca-Cola Sin azúcar' });
    });

    it('preselecciona lo más pedido y arma c_pjComboChoices con una entrada por casilla', () => {
        const selection = defaultComboSelection(slots);
        expect(selection).toEqual({
            pizza1: 'pz-pollo-bbq',
            side: 'cp-palitos-de-ajo',
            drink: 'cp-coca-cola-sin-azucar-10',
        });
        const choices = buildComboChoices(slots, { ...selection, drink: 'cp-coca-cola-2' });
        expect(choices).toEqual([
            { slot: 'pizza1', product: 'pz-pollo-bbq-family-traditional' },
            { slot: 'side', product: 'cp-palitos-de-ajo' },
            { slot: 'drink', product: 'cp-coca-cola-2' },
        ]);
        expect(validateComboChoices(parseComboSlots(PALITOS_SLOTS), choices)).toBe(true);
    });

    it('el servidor rechaza elecciones fuera de la casilla o de otro tamaño', () => {
        const raw = parseComboSlots(PALITOS_SLOTS);
        const base = [
            { slot: 'pizza1', product: 'pz-pollo-bbq-family-traditional' },
            { slot: 'side', product: 'cp-palitos-de-ajo' },
            { slot: 'drink', product: 'cp-coca-cola-2' },
        ];
        expect(validateComboChoices(raw, base.slice(0, 2))).toBe(false);
        expect(
            validateComboChoices(raw, [{ ...base[0], product: 'pz-pollo-bbq-medium-traditional' }, base[1], base[2]])
        ).toBe(false);
        expect(
            validateComboChoices(raw, [{ ...base[0], product: 'pz-the-works-family-traditional' }, base[1], base[2]])
        ).toBe(false);
        expect(validateComboChoices(raw, [base[0], base[1], { slot: 'drink', product: 'cp-red-bull-83' }])).toBe(false);
    });

    it('si una casilla no tiene opciones cargables, no la inventa', () => {
        expect(buildComboSlots(PALITOS_SLOTS, PALITOS_PRODUCTS.slice(0, 3))).toHaveLength(1);
        expect(parseComboSlots('no es json')).toEqual([]);
        expect(parseComboSlots(undefined)).toEqual([]);
    });

    it('elige la masa tradicional del tamaño y, si no hay, la primera de ese tamaño', () => {
        const variants = [
            { productId: 'a-family-thin', variationValues: { pjSize: 'family', pjCrust: 'thin' } },
            { productId: 'a-family-traditional', variationValues: { pjSize: 'family', pjCrust: 'traditional' } },
        ];
        expect(pizzaVariantFor(variants, 'family')).toBe('a-family-traditional');
        expect(pizzaVariantFor(variants.slice(0, 1), 'family')).toBe('a-family-thin');
        expect(pizzaVariantFor(variants, 'individual')).toBeNull();
    });

    it('ordena por la favorita de la casilla y después por pedidos de la semana', () => {
        const weekly: Record<string, number> = { a: 10, b: 50, c: 50 };
        expect(orderOptions([{ id: 'a' }, { id: 'b' }, { id: 'c' }], 'a', (id) => weekly[id]).map((o) => o.id)).toEqual(
            ['a', 'b', 'c']
        );
    });

    it('«Completa tu pedido» no repite lo que trae el combo', () => {
        // Pizza del Mes: solo pizza → acompañamientos, bebida y postre.
        expect(completeCandidates({ productIds: ['pz-the-works'], kinds: [] })).toEqual([
            'cp-palitos-de-ajo',
            'cp-cheesyquenos',
            'cp-coca-cola-2',
            'cp-brownie',
            'cp-chicken-poppers',
        ]);
        // Papa Combo Palitos: ya trae palitos y bebida.
        expect(completeCandidates({ productIds: ['cp-palitos-de-ajo', 'cp-coca-cola-2'], kinds: ['drink'] })).toEqual([
            'cp-cheesyquenos',
            'cp-brownie',
            'cp-chicken-poppers',
            'cp-cookie',
        ]);
    });

    it('el total suma combo × cantidad y los complementos (regla 7)', () => {
        // Pizza del Mes + Palitos de Ajo + Coca-Cola 1,5 L = $20.470 (CONTRATO §1.1, «Para 3» de Diego).
        expect(addTotal(10990, 1, [5990, 3490])).toBe(20470);
        expect(addTotal(1790, 2, [5990])).toBe(9570);
    });
});

describe('ficha simple (PRO-08 · pantalla 7)', () => {
    const coca = {
        id: 'cp-coca-cola',
        name: 'Coca-Cola',
        variationAttributes: [
            {
                id: 'pjOption',
                values: [
                    { value: 'coca-cola-350-ml', name: 'Coca-Cola 350 ml', orderable: true },
                    { value: '1-5-l', name: '1.5 L', orderable: true },
                ],
            },
        ],
        variants: [
            { productId: 'cp-coca-cola-2', price: 3490, orderable: true, variationValues: { pjOption: '1-5-l' } },
            {
                productId: 'cp-coca-cola-63',
                price: 1790,
                orderable: true,
                variationValues: { pjOption: 'coca-cola-350-ml' },
            },
        ],
    } as unknown as Product;

    it('tamaños en chips, del más barato al más caro, con el nombre sin repetir el producto', () => {
        const options = simpleOptions(coca, 'Coca-Cola');
        expect(options).toEqual([
            { productId: 'cp-coca-cola-63', label: '350 ml', price: 1790 },
            { productId: 'cp-coca-cola-2', label: '1,5 L', price: 3490 },
        ]);
        expect(initialSimpleOption(options, null)).toBe('cp-coca-cola-2');
        expect(initialSimpleOption(options, 'cp-coca-cola-63')).toBe('cp-coca-cola-63');
        expect(initialSimpleOption([], null)).toBeNull();
    });

    it('nombres de bebida', () => {
        expect(shortDrinkName('Coca-Cola Light 1.5 LT')).toBe('Coca-Cola Light');
        expect(variantLabel('Coca-Cola 1.5 LT', 'Coca-Cola')).toBe('1,5 L');
    });
});

describe('parsePjCartPayload · combo (PRO-08)', () => {
    it('acepta el combo con sus elecciones y complementos', () => {
        expect(
            parsePjCartPayload(
                JSON.stringify({
                    intent: 'combo',
                    productId: 'cb-pizza-del-mes',
                    quantity: 1,
                    choices: [{ slot: 'pizza1', product: 'pz-the-works-family-traditional' }],
                    sides: ['cp-palitos-de-ajo', 'cp-coca-cola-2'],
                })
            )
        ).toEqual({
            intent: 'combo',
            productId: 'cb-pizza-del-mes',
            quantity: 1,
            choices: [{ slot: 'pizza1', product: 'pz-the-works-family-traditional' }],
            sides: ['cp-palitos-de-ajo', 'cp-coca-cola-2'],
        });
    });
    it('rechaza lo que no es un combo o no trae elecciones válidas', () => {
        const base = { intent: 'combo', productId: 'cb-papa-flash', quantity: 1 };
        expect(
            parsePjCartPayload({ ...base, productId: 'pz-pollo-bbq', choices: [{ slot: 'a', product: 'b' }] })
        ).toBeNull();
        expect(parsePjCartPayload({ ...base, choices: [] })).toBeNull();
        expect(parsePjCartPayload({ ...base, choices: [{ slot: 'pizza1' }] })).toBeNull();
        expect(parsePjCartPayload({ ...base, quantity: 0, choices: [{ slot: 'a', product: 'b' }] })).toBeNull();
    });
});

describe('halvesPrice (AUD P1-3 · R2.1)', () => {
    const bbq = { prices: { family: 16900, medium: 13000 } };
    const carnes = { prices: { family: 18900, medium: 14000 } };
    it('el botón muestra el promedio de las dos mitades en el tamaño elegido', () => {
        expect(halvesPrice([bbq, carnes], 'family')).toBe(17900);
        expect(halvesPrice([bbq, carnes], 'medium', 3490)).toBe(16990);
    });
    it('sin las dos mitades o sin precio del tamaño no inventa un monto', () => {
        expect(halvesPrice([bbq, null], 'family')).toBeNull();
        expect(halvesPrice([bbq, carnes], 'extra_large')).toBeNull();
        expect(halvesPrice([bbq], 'family')).toBeNull();
    });
});

// Tipo para que el arreglo de casillas de las pruebas no se infiera como `any`.
export type _Slots = ComboPdpSlot[];
