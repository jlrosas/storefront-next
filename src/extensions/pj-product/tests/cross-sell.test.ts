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
    addedKindForCombo,
    basketContents,
    cartRecommendations,
    nextCrossSell,
    productKindOf,
} from '../lib/cross-sell';
import {
    COMBO_OPTION_ID,
    comboGroupOf,
    comboIdForOption,
    comboOptionItem,
    comboOptionOf,
    groupItemIds,
    missingInGroup,
    newComboGroup,
    parseComboGroup,
    slotSurcharge,
} from '../lib/combo-cart';
import { parsePjCartPayload } from '../lib/cart-payload';

const pizza = (itemId: string, extra: Record<string, unknown> = {}) => ({
    itemId,
    productId: 'pz-pollo-bbq-family-traditional',
    quantity: 1,
    ...extra,
});
const line = (itemId: string, productId: string, extra: Record<string, unknown> = {}) => ({
    itemId,
    productId,
    quantity: 1,
    ...extra,
});

describe('VEN · productKindOf', () => {
    it('clasifica por prefijo y por listas del catálogo', () => {
        expect(productKindOf('pz-pollo-bbq-family-traditional')).toBe('pizza');
        expect(productKindOf('cb-super-duo')).toBe('combo');
        expect(productKindOf('cp-coca-cola-3')).toBe('drink');
        expect(productKindOf('cp-sprite-18')).toBe('drink');
        expect(productKindOf('cp-palitos-de-ajo')).toBe('side');
        expect(productKindOf('cp-cookie')).toBe('dessert');
        expect(productKindOf('cp-salsa-de-pizza')).toBe('other');
    });
    it('el c_pjKind conocido manda sobre la heurística', () => {
        expect(productKindOf('cp-nuevo', { 'cp-nuevo': 'dessert' })).toBe('dessert');
    });
});

describe('VEN · nextCrossSell (S-D19)', () => {
    it('primera pizza suelta: «Hazlo combo» arriba + bebida 1,5 L sugerida + acompañamientos y postres', () => {
        const plan = nextCrossSell({ productItems: [pizza('a')] }, 'pizza');
        expect(plan).toEqual({
            hazloCombo: true,
            drink: { mode: 'add', suggested: '1.5' },
            sides: true,
            desserts: true,
            party: false,
            pizzas: 1,
        });
    });

    it('segunda pizza: «Completa tu pedido» sin repetir «Hazlo combo», con bebida grande', () => {
        const plan = nextCrossSell({ productItems: [pizza('a'), pizza('b')] }, 'pizza');
        expect(plan?.hazloCombo).toBe(false);
        expect(plan?.drink).toEqual({ mode: 'add', suggested: '2.5' });
    });

    it('mitades y Arma tu pizza también ofrecen «Hazlo combo» la primera vez', () => {
        expect(
            nextCrossSell({ productItems: [line('a', 'pz-mitades-family-traditional')] }, 'halves')?.hazloCombo
        ).toBe(true);
        expect(
            nextCrossSell({ productItems: [line('a', 'pz-arma-tu-pizza-family-thin')] }, 'builder')?.hazloCombo
        ).toBe(true);
    });

    it('con palitos o bebida ya en el pedido no ofrece «Hazlo combo»', () => {
        const plan = nextCrossSell({ productItems: [line('d', 'cp-coca-cola-2'), pizza('a')] }, 'pizza');
        expect(plan?.hazloCombo).toBe(false);
        expect(plan?.drink).toEqual({ mode: 'upsize', itemId: 'd', from: 'cp-coca-cola-2', to: 'cp-coca-cola-3' });
    });

    it('Super Dúo: sin «Hazlo combo», bebida de 2,5 L sugerida', () => {
        const basket = {
            productItems: [pizza('a', { c_pjComboGroup: 'duo-1' }), pizza('b', { c_pjComboGroup: 'duo-1' })],
        };
        const plan = nextCrossSell(basket, 'super-duo');
        expect(plan?.hazloCombo).toBe(false);
        expect(plan?.drink).toEqual({ mode: 'add', suggested: '2.5' });
        expect(plan?.party).toBe(false);
    });

    it('Super Trío: mesa grande (palitos y 2,5 L), aunque ya haya un acompañamiento', () => {
        const basket = {
            productItems: [pizza('a'), pizza('b'), pizza('c'), line('s', 'cp-cheesyquenos')],
        };
        const plan = nextCrossSell(basket, 'super-trio');
        expect(plan?.party).toBe(true);
        expect(plan?.sides).toBe(true);
        expect(plan?.drink).toEqual({ mode: 'add', suggested: '2.5' });
    });

    it('la bebida dentro de un combo cuenta como bebida y no se ofrece subirla (precio del combo)', () => {
        const basket = {
            productItems: [
                line('c', 'cb-papa-combo-postre', {
                    c_pjComboChoices: JSON.stringify([
                        { slot: 'pizza1', product: 'pz-pollo-bbq-family-traditional' },
                        { slot: 'drink', product: 'cp-coca-cola-2' },
                        { slot: 'dessert', product: 'cp-cookie' },
                    ]),
                }),
            ],
        };
        const plan = nextCrossSell(basket, 'combo');
        expect(plan?.drink).toBeNull();
        expect(plan?.desserts).toBe(false);
        expect(plan?.sides).toBe(true);
        expect(plan?.hazloCombo).toBe(false);
    });

    it('la bebida 1,5 L de «Hazlo combo» (con promoción) no se sube: rompería el precio del combo', () => {
        const basket = {
            productItems: [
                pizza('a'),
                line('s', 'cp-palitos-de-ajo', { priceAdjustments: [{ promotionId: 'pj-hazlo-combo' }] }),
                line('d', 'cp-coca-cola-2', { priceAdjustments: [{ promotionId: 'pj-hazlo-combo' }] }),
            ],
        };
        expect(nextCrossSell(basket, 'pizza')?.drink).toBeNull();
    });

    it('después de un producto simple no ofrece nada', () => {
        expect(nextCrossSell({ productItems: [line('d', 'cp-coca-cola-2')] }, 'simple')).toBeNull();
    });

    it('addedKindForCombo', () => {
        expect(addedKindForCombo('cb-super-duo')).toBe('super-duo');
        expect(addedKindForCombo('cb-super-trio')).toBe('super-trio');
        expect(addedKindForCombo('cb-pizza-del-mes')).toBe('pizza-del-mes');
        expect(addedKindForCombo('cb-papa-flash')).toBe('combo');
    });

    it('basketContents cuenta las pizzas de los combos con ficha', () => {
        const contents = basketContents({
            productItems: [
                line('c', 'cb-pizza-del-mes', {
                    quantity: 2,
                    c_pjComboChoices: [{ slot: 'pizza1', product: 'pz-the-works-family-traditional' }],
                }),
            ],
        });
        expect(contents.pizzas).toBe(2);
        expect(contents.hasCombo).toBe(true);
    });
});

describe('VEN · cartRecommendations («¿Le sumamos algo?»)', () => {
    it('una bebida, un acompañamiento y un postre según lo que falta; nunca pizzas', () => {
        const recs = cartRecommendations({ productItems: [pizza('a')] });
        expect(recs).toEqual([
            { kind: 'drink', productId: 'cp-coca-cola-2' },
            { kind: 'side', productId: 'cp-palitos-de-ajo' },
            { kind: 'dessert', productId: 'cp-cookie' },
        ]);
        expect(recs.some((r) => r.productId.startsWith('pz-'))).toBe(false);
    });

    it('si ya hay bebida no ofrece bebida; con 2+ pizzas la bebida es de 2,5 L', () => {
        expect(
            cartRecommendations({ productItems: [pizza('a'), line('d', 'cp-fanta-22')] }).map((r) => r.kind)
        ).toEqual(['side', 'dessert']);
        expect(cartRecommendations({ productItems: [pizza('a'), pizza('b')] })[0]).toEqual({
            kind: 'drink',
            productId: 'cp-coca-cola-3',
        });
    });

    it('pedido completo o vacío: nada', () => {
        expect(cartRecommendations({ productItems: [] })).toEqual([]);
        expect(
            cartRecommendations({
                productItems: [
                    pizza('a'),
                    line('d', 'cp-coca-cola-2'),
                    line('s', 'cp-cheesyquenos'),
                    line('x', 'cp-brownie'),
                ],
            })
        ).toEqual([]);
    });
});

describe('VEN · combo-cart (S-D20, CONTRATO §7.1)', () => {
    it('grupo duo-/trio- y su combo', () => {
        const group = newComboGroup('cb-super-duo', () => 0.5);
        expect(group).toMatch(/^duo-[a-z0-9]{6}$/);
        expect(parseComboGroup(group)).toEqual({ comboId: 'cb-super-duo', group });
        expect(parseComboGroup('trio-abc123')?.comboId).toBe('cb-super-trio');
        expect(parseComboGroup('otro-abc')).toBeNull();
        expect(parseComboGroup(42)).toBeNull();
        expect(comboIdForOption('trio')).toBe('cb-super-trio');
    });

    it('la opción pjCombo marca la pizza (sin cupón)', () => {
        expect(comboOptionItem('cb-super-duo')).toEqual({ optionId: COMBO_OPTION_ID, optionValueId: 'duo' });
        expect(comboOptionItem('cb-papa-flash')).toBeNull();
        expect(comboOptionOf({ optionItems: [{ optionId: 'pjCombo', optionValueId: 'trio' }] })).toBe('trio');
        expect(comboOptionOf({ optionItems: [{ optionId: 'pjCombo', optionValueId: 'no' }] })).toBeNull();
    });

    it('líneas del grupo y pizzas que faltan', () => {
        const basket = {
            productItems: [
                { itemId: 'a', c_pjComboGroup: 'duo-x1' },
                { itemId: 'b', c_pjComboGroup: 'duo-x1' },
                { itemId: 'c', c_pjComboGroup: 'duo-x2' },
            ],
        };
        expect(groupItemIds(basket, 'duo-x1')).toEqual(['a', 'b']);
        expect(comboGroupOf(basket.productItems[2])).toBe('duo-x2');
        expect(missingInGroup('cb-super-duo', 1)).toBe(1);
        expect(missingInGroup('cb-super-trio', 3)).toBe(0);
    });

    it('recargo de la ranura: extras por tamaño + masa', () => {
        expect(slotSurcharge({ extras: 1, extraPrice: 1940, crustSurcharge: 0 })).toBe(1940);
        expect(slotSurcharge({ extras: 0, extraPrice: 1940, crustSurcharge: 0 })).toBe(0);
    });

    it('el payload combo-pizzas valida pizzas y acepta duo/trio en la opción', () => {
        const ok = parsePjCartPayload(
            JSON.stringify({
                intent: 'combo-pizzas',
                comboId: 'cb-super-duo',
                pizzas: [
                    {
                        productId: 'pz-pollo-bbq-family-traditional',
                        optionItems: [{ optionId: 'pjExtras_pepperoni', optionValueId: 'si' }],
                        removed: ['cebolla'],
                    },
                    { productId: 'pz-super-pepperoni-family-thin', optionItems: [], removed: [] },
                ],
            })
        );
        expect(ok?.intent).toBe('combo-pizzas');
        expect(
            parsePjCartPayload({ intent: 'combo-pizzas', comboId: 'cb-super-duo', pizzas: [{ productId: 'cp-x' }] })
        ).toBeNull();
        const edit = parsePjCartPayload({
            intent: 'pizza',
            itemId: 'i1',
            productId: 'pz-pollo-bbq-family-traditional',
            quantity: 1,
            optionItems: [{ optionId: 'pjCombo', optionValueId: 'duo' }],
            removed: [],
        });
        expect(edit && edit.intent === 'pizza' ? edit.optionItems : null).toEqual([
            { optionId: 'pjCombo', optionValueId: 'duo' },
        ]);
        expect(parsePjCartPayload({ intent: 'combo-remove', group: 'duo-x1' })).toEqual({
            intent: 'combo-remove',
            group: 'duo-x1',
        });
        expect(
            parsePjCartPayload({ intent: 'add', items: [{ productId: 'cp-cookie', quantity: 1 }], comboFor: 'duo-x1' })
        ).toEqual({ intent: 'add', items: [{ productId: 'cp-cookie', quantity: 1 }], comboFor: 'duo-x1' });
    });
});
