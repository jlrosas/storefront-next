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
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import { describe, expect, it } from 'vitest';
import { cartTotals, checkoutBlock, linePrice, pickOffer, type OfferContext } from '../lib/cart-model';
import { groupHazloCombo, summarizeLine, type LineLabels, type SummaryLineItem } from '../lib/line-summary';
import { parseCanje, readCanjeCookie } from '../lib/canje';
import { readdComboPayload, readdPayload } from '../lib/undo';

const labels: LineLabels = {
    size: (id) => ({ family: 'Familiar', medium: 'Mediana' })[id] ?? '',
    crust: (id) => ({ traditional: 'Tradicional' })[id] ?? '',
    without: (name) => `sin ${name}`,
    plus: (name) => `+ ${name}`,
};
const ids = { side: 'cp-palitos-de-ajo', drinks: ['cp-coca-cola-2', 'cp-coca-cola-sin-azucar-10'] };
const ctx: OfferContext = {
    hasDrinkCandidate: true,
    hasDessertCandidate: true,
    comboSide: ids.side,
    comboDrinks: ids.drinks,
    storeClosed: false,
};

const pollo: SummaryLineItem = {
    itemId: 'p',
    productId: 'pz-pollo-bbq-family-traditional',
    productName: 'Pollo BBQ Familiar Tradicional',
    quantity: 1,
    price: 16900,
    priceAfterItemDiscount: 16900,
    optionItems: [{ optionId: 'pjExtras_cebolla', optionValueId: 'no', itemText: 'Cebolla: Sin extra', price: 0 }],
    c_pjRemoved: ['cebolla'],
};
const line = (itemId: string, productId: string, price: number, promo = 0): SummaryLineItem => ({
    itemId,
    productId,
    productName: productId,
    quantity: 1,
    price,
    priceAfterItemDiscount: price - promo,
    priceAdjustments: promo ? [{ promotionId: 'pj-hazlo-combo', price: -promo }] : [],
});
const build = (items: SummaryLineItem[]) => {
    const summaries = items.map((item) => summarizeLine(item, labels));
    return { summaries, entries: groupHazloCombo(summaries, ids) };
};

describe('cartTotals · pedido canónico de Sofía (CONTRATO §6)', () => {
    const { summaries } = build([
        pollo,
        line('s', 'cp-palitos-de-ajo', 5990, 1573),
        line('d', 'cp-coca-cola-sin-azucar-10', 3490, 917),
    ]);

    it('productos $26.380, ahorro $2.490, total $23.890 y 23 puntos', () => {
        const totals = cartTotals(summaries, { delivery: false, doublePoints: false, canje: null });
        expect(totals).toMatchObject({ products: 26380, comboSavings: 2490, canje: 0, shipping: 0, total: 23890 });
        expect(totals.points).toBe(23);
    });

    it('Valentina con puntos dobles: 46', () => {
        expect(cartTotals(summaries, { delivery: false, doublePoints: true, canje: null }).points).toBe(46);
    });

    it('el canje deja la pizza en $0 y no cambia los puntos ganados', () => {
        const withCanje = build([
            ...[pollo],
            line('s', 'cp-palitos-de-ajo', 5990, 1573),
            line('d', 'cp-coca-cola-sin-azucar-10', 3490, 917),
            line('c', 'pz-super-pepperoni-medium-traditional', 13000),
        ]);
        const totals = cartTotals(withCanje.summaries, {
            delivery: false,
            doublePoints: false,
            canje: { itemId: 'c', productId: 'pz-super-pepperoni-medium-traditional', points: 260, value: 13000 },
        });
        expect(totals).toMatchObject({ canje: 13000, total: 23890, points: 23, products: 39380 });
    });

    it('delivery: despacho $1.990 y lo que falta para el mínimo', () => {
        const small = build([line('x', 'cp-palitos-de-ajo', 5990), line('y', 'cp-brownie', 3000)]);
        const totals = cartTotals(small.summaries, { delivery: true, doublePoints: false, canje: null });
        expect(totals.shipping).toBe(1990);
        expect(totals.missingForDelivery).toBe(3010);
        expect(totals.points).toBe(8);
    });
});

describe('pickOffer · una sola oferta por prioridad (§3.5)', () => {
    it('1 · palitos y Coca-Cola 1,5 L sueltos (sin promoción) → convertir en combo', () => {
        const { entries } = build([pollo, line('s', 'cp-palitos-de-ajo', 5990), line('d', 'cp-coca-cola-2', 3490)]);
        expect(pickOffer(entries, ctx)).toBe('convert');
    });
    it('con «Hazlo combo» ya aplicado no se ofrece bebida: postre', () => {
        const { entries } = build([
            pollo,
            line('s', 'cp-palitos-de-ajo', 5990, 1573),
            line('d', 'cp-coca-cola-2', 3490, 917),
        ]);
        expect(pickOffer(entries, ctx)).toBe('dessert');
    });
    it('2 · pizza sola → bebida', () => {
        expect(pickOffer(build([pollo]).entries, ctx)).toBe('drink');
    });
    it('sin pizza o con la tienda cerrada → nada', () => {
        expect(pickOffer(build([line('d', 'cp-coca-cola-2', 3490)]).entries, ctx)).toBeNull();
        expect(pickOffer(build([pollo]).entries, { ...ctx, storeClosed: true })).toBeNull();
    });
});

describe('checkoutBlock · el CTA dice por qué no se puede pagar', () => {
    const base = { hasFulfillment: true, storeClosed: false, missingForDelivery: 0, pickupOnlyWithDelivery: false };
    it('sin bloqueo', () => expect(checkoutBlock(base)).toBeNull());
    it('prioridad: modalidad, tienda cerrada, solo retiro, mínimo', () => {
        expect(checkoutBlock({ ...base, hasFulfillment: false, storeClosed: true })).toBe('no-fulfillment');
        expect(checkoutBlock({ ...base, storeClosed: true, missingForDelivery: 10 })).toBe('store-closed');
        expect(checkoutBlock({ ...base, pickupOnlyWithDelivery: true, missingForDelivery: 10 })).toBe('pickup-only');
        expect(checkoutBlock({ ...base, missingForDelivery: 3010 })).toBe('minimum');
    });
});

describe('canje y deshacer', () => {
    it('lee la cookie pj_canje', () => {
        const value = { itemId: 'c', productId: 'pz', points: 260, value: 13000 };
        const cookie = `a=1; pj_canje=${encodeURIComponent(JSON.stringify(value))}; b=2`;
        expect(readCanjeCookie(cookie)).toEqual(value);
        expect(parseCanje('no-json')).toBeNull();
    });

    it('«Deshacer» vuelve a agregar la pizza con sus extras y quitados', () => {
        const withExtra: SummaryLineItem = {
            ...pollo,
            optionItems: [
                { optionId: 'pjExtras_pepperoni', optionValueId: 'si', itemText: 'Pepperoni: Pepperoni', price: 1940 },
            ],
        };
        const summary = summarizeLine(withExtra, labels);
        expect(readdPayload(summary, withExtra)).toEqual({
            intent: 'pizza',
            productId: 'pz-pollo-bbq-family-traditional',
            quantity: 1,
            optionItems: [{ optionId: 'pjExtras_pepperoni', optionValueId: 'si' }],
            removed: ['cebolla'],
        });
    });

    it('«Deshacer» de mitades y de un combo con elecciones', () => {
        const halves: SummaryLineItem = {
            itemId: 'h',
            productId: 'pz-mitades-family-traditional',
            quantity: 1,
            price: 12400,
            c_pjHalves: '[{"part":1,"product":"pz-pollo-bbq"},{"part":2,"product":"pz-super-pepperoni"}]',
        };
        expect(readdPayload(summarizeLine(halves, labels), halves)).toMatchObject({
            intent: 'halves',
            halves: ['pz-pollo-bbq', 'pz-super-pepperoni'],
        });
        const duo: SummaryLineItem = {
            itemId: 'd',
            productId: 'cb-super-duo',
            quantity: 1,
            price: 22590,
            c_pjComboChoices: '[{"slot":"pizza1","product":"pz-pollo-bbq-family-traditional"}]',
        };
        expect(readdPayload(summarizeLine(duo, labels), duo)).toEqual({
            intent: 'combo',
            productId: 'cb-super-duo',
            quantity: 1,
            choices: [{ slot: 'pizza1', product: 'pz-pollo-bbq-family-traditional' }],
        });
        expect(
            readdComboPayload({
                parts: [],
                itemIds: ['a', 'b'],
                productIds: ['cp-palitos-de-ajo', 'cp-coca-cola-2'],
                total: 0,
                baseTotal: 0,
                savings: 0,
            })
        ).toEqual({
            intent: 'add',
            items: [
                { productId: 'cp-palitos-de-ajo', quantity: 1 },
                { productId: 'cp-coca-cola-2', quantity: 1 },
            ],
        });
    });
});

describe('linePrice · VAL-C3 H-3', () => {
    it('palitos y bebida con promoción de combo, sueltos, se ven a precio normal', () => {
        const { entries } = build([
            line('x', 'pz-arma-tu-pizza-family-traditional', 12400),
            line('m', 'cb-pizza-del-mes', 10990),
            line('s', 'cp-palitos-de-ajo', 5990, 1573),
            line('d', 'cp-coca-cola-2', 3490, 917),
        ]);
        expect(entries.map((e) => linePrice(e.summary))).toEqual([12400, 10990, 5990, 3490]);
        const totals = cartTotals(
            entries.map((e) => e.summary),
            { delivery: false, doublePoints: false, canje: null }
        );
        expect(totals).toMatchObject({ products: 32870, comboSavings: 2490, total: 30380 });
    });
});
