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
import { groupHazloCombo, summarizeLine, type LineLabels, type SummaryLineItem } from '../lib/line-summary';
import { cartBlocks, readdGroupPayload, summarizeComboGroup } from '../lib/combo-group';
import { crossSellProduct, pickCartSection } from '../lib/cart-model';
import type { CrossSellCatalog } from '@/extensions/pj-product/lib/upsell';

const labels: LineLabels = {
    size: (id) => ({ family: 'Familiar', medium: 'Mediana' })[id] ?? '',
    crust: (id) => ({ traditional: 'Tradicional', thin: 'Delgada' })[id] ?? '',
    without: (name) => `sin ${name}`,
    plus: (name) => `+ ${name}`,
};
const names = { 'cb-super-duo': 'Super Dúo', 'cb-super-trio': 'Super Trío' };

const duoPizza = (itemId: string, productId: string, extra: Partial<SummaryLineItem> = {}): SummaryLineItem => ({
    itemId,
    productId,
    productName: 'Pizza',
    quantity: 1,
    price: 16900,
    priceAfterItemDiscount: 11295,
    c_pjComboGroup: 'duo-abc123',
    optionItems: [{ optionId: 'pjCombo', optionValueId: 'duo', price: 0 }],
    priceAdjustments: [{ promotionId: 'pj-super-duo', price: -5605 }],
    ...extra,
});

const catalog: CrossSellCatalog = {
    drinks: [
        {
            flavor: 'original',
            name: 'Coca-Cola',
            image: 'coca.png',
            sizes: [
                { size: '1.5', productId: 'cp-coca-cola-2', price: 3490 },
                { size: '2.5', productId: 'cp-coca-cola-3', price: 4490 },
            ],
        },
    ],
    sides: [{ productId: 'cp-palitos-de-ajo', name: 'Palitos de Ajo', description: null, price: 5990, image: null }],
    desserts: [{ productId: 'cp-cookie', name: 'Cookie', description: null, price: 7990, image: null }],
};

describe('VEN · grupo Super Dúo en el carrito (S-D20, §7.1)', () => {
    const items = [
        duoPizza('a', 'pz-pollo-bbq-family-traditional', {
            optionItems: [
                { optionId: 'pjCombo', optionValueId: 'duo', price: 0 },
                { optionId: 'pjExtras_pepperoni', optionValueId: 'si', itemText: 'Pepperoni', price: 1940 },
            ],
        }),
        duoPizza('b', 'pz-super-pepperoni-family-thin'),
    ];
    const summaries = items.map((item) => summarizeLine(item, labels));

    it('la línea filtra pjCombo (no es un extra) y lee el grupo', () => {
        expect(summaries[0].extras.map((e) => e.id)).toEqual(['pepperoni']);
        expect(summaries[0].comboGroup).toBe('duo-abc123');
        expect(summaries[0].comboOption).toBe('duo');
        expect(summaries[1].detail).toBe('Familiar · Delgada');
    });

    it('el grupo muestra $22.590 + extras y no la suma repartida', () => {
        const group = summarizeComboGroup(summaries, names);
        expect(group).toMatchObject({ name: 'Super Dúo', price: 22590, extras: 1940, total: 24530, missing: 0 });
        expect(group?.savings).toBe(16900 * 2 + 1940 - 24530);
    });

    it('con una pizza menos avisa y muestra lo que cobra la canasta', () => {
        const single = summarizeComboGroup(
            [
                summarizeLine(
                    duoPizza('b', 'pz-super-pepperoni-family-thin', {
                        priceAfterItemDiscount: 16900,
                        priceAdjustments: [],
                    }),
                    labels
                ),
            ],
            names
        );
        expect(single?.missing).toBe(1);
        expect(single?.total).toBe(16900);
        expect(single?.savings).toBe(0);
    });

    it('cartBlocks junta las pizzas del grupo y deja el resto suelto', () => {
        const cookie = summarizeLine(
            { itemId: 'c', productId: 'cp-cookie', productName: 'Cookie', price: 7990 },
            labels
        );
        const blocks = cartBlocks(
            [...summaries, cookie].map((summary) => ({ summary, combo: null })),
            names
        );
        expect(blocks.map((b) => b.type)).toEqual(['group', 'entry']);
        expect(blocks[0].type === 'group' ? blocks[0].entries.length : 0).toBe(2);
    });

    it('«Deshacer» vuelve a armar el combo con sus extras y quitados', () => {
        const group = summarizeComboGroup(summaries, names);
        const payload = group ? readdGroupPayload(group, summaries) : null;
        expect(payload).toEqual({
            intent: 'combo-pizzas',
            comboId: 'cb-super-duo',
            pizzas: [
                {
                    productId: 'pz-pollo-bbq-family-traditional',
                    optionItems: [{ optionId: 'pjExtras_pepperoni', optionValueId: 'si' }],
                    removed: [],
                },
                { productId: 'pz-super-pepperoni-family-thin', optionItems: [], removed: [] },
            ],
        });
    });
});

describe('VEN · «Hazlo combo» se pega por c_pjComboFor (§7.1)', () => {
    it('ancla palitos + bebida a la pizza que dice c_pjComboFor, aunque no estén contiguos', () => {
        const promo = [{ promotionId: 'pj-hazlo-combo', price: -1000 }];
        const lines = [
            summarizeLine({ itemId: 'p1', productId: 'pz-pollo-bbq-family-traditional', price: 16900 }, labels),
            summarizeLine({ itemId: 'p2', productId: 'pz-hawaiana-family-traditional', price: 16900 }, labels),
            summarizeLine({ itemId: 'x', productId: 'cp-cookie', price: 7990 }, labels),
            summarizeLine(
                {
                    itemId: 's',
                    productId: 'cp-palitos-de-ajo',
                    price: 5990,
                    priceAdjustments: promo,
                    c_pjComboFor: 'p1',
                },
                labels
            ),
            summarizeLine(
                { itemId: 'd', productId: 'cp-coca-cola-2', price: 3490, priceAdjustments: promo, c_pjComboFor: 'p1' },
                labels
            ),
        ];
        const entries = groupHazloCombo(lines, { side: 'cp-palitos-de-ajo', drinks: ['cp-coca-cola-2'] });
        expect(entries.map((e) => e.summary.itemId)).toEqual(['p1', 'p2', 'x']);
        expect(entries[0].combo?.itemIds).toEqual(['s', 'd']);
    });
});

describe('VEN · «¿Le sumamos algo?» en el carrito (S-D19)', () => {
    const ctx = {
        hasDrinkCandidate: true,
        hasDessertCandidate: true,
        comboSide: 'cp-palitos-de-ajo',
        comboDrinks: ['cp-coca-cola-2'],
        storeClosed: false,
        catalog,
    };
    const entry = (item: SummaryLineItem) => ({ summary: summarizeLine(item, labels), combo: null });

    it('tres recomendaciones sin pizzas, con nombre y tamaño de la bebida', () => {
        const items = [{ itemId: 'a', productId: 'pz-pollo-bbq-family-traditional', price: 16900 }];
        const section = pickCartSection(items.map(entry), { productItems: items }, ctx);
        expect(section?.kind).toBe('recommend');
        const recs = section?.kind === 'recommend' ? section.items : [];
        expect(recs.map((r) => [r.kind, r.name, r.price])).toEqual([
            ['drink', 'Coca-Cola 1,5 L', 3490],
            ['side', 'Palitos de Ajo', 5990],
            ['dessert', 'Cookie', 7990],
        ]);
    });

    it('sin la categoría que ya está en el pedido', () => {
        const items = [
            { itemId: 'a', productId: 'pz-pollo-bbq-family-traditional', price: 16900 },
            { itemId: 'b', productId: 'pz-hawaiana-family-traditional', price: 16900 },
            { itemId: 'c', productId: 'cp-cookie', price: 7990 },
        ];
        const section = pickCartSection(items.map(entry), { productItems: items }, ctx);
        const recs = section?.kind === 'recommend' ? section.items : [];
        expect(recs.map((r) => r.kind)).toEqual(['drink', 'side']);
        expect(recs[0].productId).toBe('cp-coca-cola-3');
    });

    it('palitos y bebida sueltos: «Conviértelo en combo» primero (una sola sección)', () => {
        const items = [
            { itemId: 'a', productId: 'pz-pollo-bbq-family-traditional', price: 16900 },
            { itemId: 's', productId: 'cp-palitos-de-ajo', price: 5990 },
            { itemId: 'd', productId: 'cp-coca-cola-2', price: 3490 },
        ];
        expect(pickCartSection(items.map(entry), { productItems: items }, ctx)).toEqual({ kind: 'convert' });
    });

    it('tienda cerrada: nada', () => {
        const items = [{ itemId: 'a', productId: 'pz-pollo-bbq-family-traditional', price: 16900 }];
        expect(pickCartSection(items.map(entry), { productItems: items }, { ...ctx, storeClosed: true })).toBeNull();
    });

    it('crossSellProduct no inventa productos fuera del catálogo', () => {
        expect(crossSellProduct(catalog, 'cp-brownie')).toBeNull();
    });
});
