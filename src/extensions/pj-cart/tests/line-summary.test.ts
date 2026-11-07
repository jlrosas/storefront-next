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
import {
    lineKind,
    lineProductIds,
    lineText,
    parseComboChoices,
    parseVariantId,
    stripVariantSuffix,
    summariesTotal,
    summarizeLine,
    type LineLabels,
    type SummaryLineItem,
} from '../lib/line-summary';
import { selectionSummary, type PizzaConfig } from '@/extensions/pj-product/lib/pizza';

const SIZES: Record<string, string> = { medium: 'Mediana', family: 'Familiar', extra_large: 'Extra grande' };
const CRUSTS: Record<string, string> = { traditional: 'Tradicional', stuffed: 'Borde de queso mozzarella' };
const labels: LineLabels = {
    size: (id) => SIZES[id] ?? '',
    crust: (id) => CRUSTS[id] ?? '',
    without: (name) => `sin ${name}`,
    plus: (name) => `+ ${name}`,
};

const option = (id: string, name: string, on: boolean, price = 1940) => ({
    optionId: `pjExtras_${id}`,
    optionValueId: on ? 'si' : 'no',
    itemText: `${name}: ${on ? name : 'Sin extra'}`,
    price: on ? price : 0,
    priceAfterItemDiscount: on ? price : 0,
});

/** Línea tal como la devuelve SCAPI (sandbox, 06-nov): Pollo BBQ con 2 extras y sin cebolla. */
const polloBbq: SummaryLineItem = {
    itemId: 'line-1',
    productId: 'pz-pollo-bbq-family-traditional',
    productName: 'Pollo BBQ Familiar Tradicional',
    itemText: 'Pollo BBQ Familiar Tradicional',
    quantity: 1,
    price: 16900,
    priceAfterItemDiscount: 16900,
    optionItems: [
        option('choclo', 'Choclo', false),
        option('cebolla', 'Cebolla', false),
        option('champinon', 'Champiñon', true),
        option('pepperoni', 'Pepperoni', true),
        option('salsa-bbq', 'Salsa BBQ', false),
    ],
    c_pjRemoved: ['cebolla'],
};

const halves: SummaryLineItem = {
    itemId: 'line-2',
    productId: 'pz-mitades-family-traditional',
    productName: 'Pizza mitad y mitad Familiar Tradicional',
    quantity: 1,
    price: 12400,
    optionItems: [option('pepperoni', 'Pepperoni', false)],
    c_pjHalves: '[{"part":2,"product":"pz-super-pepperoni"},{"part":1,"product":"pz-pollo-bbq"}]',
    c_pjParts: 2,
};

const superDuo: SummaryLineItem = {
    itemId: 'line-3',
    productId: 'cb-super-duo',
    productName: 'Super Dúo',
    quantity: 1,
    price: 22590,
    c_pjComboChoices:
        '[{"slot":"pizza1","product":"pz-pollo-bbq-family-traditional"},{"slot":"pizza2","product":"pz-todas-las-carnes-family-traditional"}]',
};

const names = {
    'pz-pollo-bbq': { name: 'Pollo BBQ', image: 'https://img/pollo.jpg' },
    'pz-super-pepperoni': { name: 'Super Pepperoni', image: 'https://img/pepperoni.jpg' },
    'pz-todas-las-carnes': { name: 'Todas las Carnes', image: null },
};

describe('parseVariantId', () => {
    it('separa maestro, tamaño y masa (también masas con guion bajo)', () => {
        expect(parseVariantId('pz-pollo-bbq-family-traditional')).toEqual({
            masterId: 'pz-pollo-bbq',
            size: 'family',
            crust: 'traditional',
        });
        expect(parseVariantId('pz-the-works-extra_large-parmesan_base')).toEqual({
            masterId: 'pz-the-works',
            size: 'extra_large',
            crust: 'parmesan_base',
        });
        expect(parseVariantId('cb-super-duo')).toBeNull();
    });
});

describe('lineKind', () => {
    it('distingue pizza, mitades, combo y el resto', () => {
        expect(lineKind('pz-pollo-bbq-family-traditional')).toBe('pizza');
        expect(lineKind('pz-arma-tu-pizza-family-traditional')).toBe('pizza');
        expect(lineKind('pz-mitades-family-traditional')).toBe('halves');
        expect(lineKind('cb-super-duo')).toBe('combo');
        expect(lineKind('cp-coca-cola-2')).toBe('other');
    });
});

describe('summarizeLine · pizza con extras y un ingrediente quitado', () => {
    const summary = summarizeLine(polloBbq, labels, names);

    it('nombre sin tamaño ni masa, y tamaño · masa · sin cebolla', () => {
        expect(summary.name).toBe('Pollo BBQ');
        expect(summary.detail).toBe('Familiar · Tradicional · sin cebolla');
    });

    it('lista solo los extras en «si», con su precio (las opciones en «no» no se muestran)', () => {
        expect(summary.extras).toEqual([
            { id: 'champinon', name: 'Champiñon', price: 1940 },
            { id: 'pepperoni', name: 'Pepperoni', price: 1940 },
        ]);
    });

    it('el total de la línea suma los extras (#37)', () => {
        expect(summary.total).toBe(16900 + 1940 * 2);
    });

    it('con 2 pizzas, el extra se muestra por pizza y el total suma todo', () => {
        const double = summarizeLine(
            {
                ...polloBbq,
                quantity: 2,
                price: 33800,
                priceAfterItemDiscount: 33800,
                optionItems: [option('pepperoni', 'Pepperoni', true, 3880)],
            },
            labels
        );
        expect(double.extras).toEqual([{ id: 'pepperoni', name: 'Pepperoni', price: 1940 }]);
        expect(double.total).toBe(33800 + 3880);
    });

    it('«Editar» abre la hoja con el maestro de la pizza', () => {
        expect(summary.edit).toBe('sheet');
        expect(summary.masterId).toBe('pz-pollo-bbq');
    });

    it('en una línea: igual orden que el resumen de la hoja', () => {
        expect(lineText(summary, labels)).toBe('Familiar · Tradicional · sin cebolla · + Champiñon · + Pepperoni');
    });

    it('lee igual que el resumen de la hoja de PRO para la misma pizza', () => {
        const config = {
            sizes: [{ id: 'family', label: 'Familiar' }],
            crusts: [{ id: 'traditional', label: 'Tradicional' }],
            base: [{ id: 'cebolla', name: 'Cebolla' }],
            extras: [
                { id: 'champinon', name: 'Champiñon' },
                { id: 'pepperoni', name: 'Pepperoni' },
            ],
        } as unknown as PizzaConfig;
        const sheet = selectionSummary(
            config,
            {
                size: 'family',
                crust: 'traditional',
                removed: ['cebolla'],
                extras: ['champinon', 'pepperoni'],
                quantity: 1,
            },
            labels
        );
        expect(lineText(summary, labels)).toBe(sheet);
    });

    it('sin nombres del catálogo, quita el sufijo del nombre de la línea', () => {
        expect(summarizeLine(polloBbq, labels).name).toBe('Pollo BBQ');
    });

    it('con borde, la masa lo dice', () => {
        const stuffed = summarizeLine(
            {
                ...polloBbq,
                productId: 'pz-pollo-bbq-family-stuffed',
                productName: 'Pollo BBQ Familiar Borde de queso mozzarella',
            },
            labels
        );
        expect(stuffed.detail).toBe('Familiar · Borde de queso mozzarella · sin cebolla');
        expect(stuffed.name).toBe('Pollo BBQ');
    });
});

describe('summarizeLine · mitades', () => {
    const summary = summarizeLine(halves, labels, names);

    it('«½ Pollo BBQ · ½ Super Pepperoni» en orden de parte, con foto de cada mitad', () => {
        expect(summary.kind).toBe('halves');
        expect(summary.name).toBe('Pizza mitad y mitad');
        expect(summary.detail).toBe('Familiar · Tradicional · ½ Pollo BBQ · ½ Super Pepperoni');
        expect(summary.halves.map((h) => h.image)).toEqual(['https://img/pollo.jpg', 'https://img/pepperoni.jpg']);
        expect(summary.extras).toEqual([]);
        expect(summary.edit).toBe('halves');
    });
});

describe('summarizeLine · combo', () => {
    it('lista las pizzas elegidas desde c_pjComboChoices (CAR-01 5b)', () => {
        const summary = summarizeLine(superDuo, labels, names);
        expect(summary.kind).toBe('combo');
        expect(summary.name).toBe('Super Dúo');
        expect(summary.detail).toBe('Pollo BBQ + Todas las Carnes');
        expect(summary.edit).toBeNull();
        expect(summary.total).toBe(22590);
    });
});

describe('utilidades', () => {
    it('parseComboChoices tolera texto inválido', () => {
        expect(parseComboChoices('no-json')).toEqual([]);
        expect(parseComboChoices([{ slot: 'a', product: 'x' }, null])).toEqual([{ slot: 'a', product: 'x' }]);
    });

    it('lineProductIds junta maestros, mitades y elecciones del combo sin repetir', () => {
        expect(lineProductIds([polloBbq, halves, superDuo]).sort()).toEqual(
            [
                'cb-super-duo',
                'pz-mitades',
                'pz-mitades-family-traditional',
                'pz-pollo-bbq',
                'pz-pollo-bbq-family-traditional',
                'pz-super-pepperoni',
                'pz-todas-las-carnes',
            ].sort()
        );
    });

    it('stripVariantSuffix solo quita el sufijo exacto', () => {
        expect(stripVariantSuffix('Pollo BBQ Familiar Tradicional', 'Familiar', 'Tradicional')).toBe('Pollo BBQ');
        expect(stripVariantSuffix('Super Dúo', '', '')).toBe('Super Dúo');
    });

    it('la suma de las líneas cuadra con productTotal de SCAPI ($73.990 en el sandbox)', () => {
        const arma: SummaryLineItem = {
            itemId: 'line-4',
            productId: 'pz-arma-tu-pizza-family-traditional',
            productName: 'Arma tu pizza Familiar Tradicional',
            price: 12400,
            optionItems: [
                option('choclo', 'Choclo', true),
                option('pepperoni', 'Pepperoni', true),
                option('tomate-cherry', 'Tomate cherry', true),
            ],
        };
        const all = [polloBbq, halves, superDuo, arma].map((item) => summarizeLine(item, labels, names));
        expect(summariesTotal(all)).toBe(73990);
    });
});
