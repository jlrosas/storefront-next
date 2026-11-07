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
import {
    crustSurcharge,
    defaultSelection,
    displayIngredientName,
    extrasFromItem,
    isConfigurablePizza,
    normalizeSelection,
    optionItemsFor,
    removedFromItem,
    selectionFromItem,
    selectionSummary,
    substituteFor,
    totalPrice,
    unitPrice,
} from '../lib/pizza';
import { buildPizzaConfig, paidExtraIds, storeDisplayName } from '../lib/pizza.server';

type Product = ShopperProducts.schemas['Product'];

const variant = (size: string, crust: string, price: number) => ({
    productId: `pz-pollo-bbq-${size}-${crust}`,
    price,
    orderable: true,
    variationValues: { pjSize: size, pjCrust: crust },
});

const option = (id: string, name: string, price: number) => ({
    id: `pjExtras_${id}`,
    name,
    values: [
        { id: 'no', name: 'Sin extra', price: 0, default: true },
        { id: 'si', name, price, default: false },
    ],
});

const ing = (id: string, name: string, group: string, orderable = true) =>
    ({
        id: `ing-${id}`,
        name,
        c_pjIngredientGroup: group,
        imageGroups: [{ viewType: 'large', images: [{ link: `https://img/${id}.png` }] }],
        inventories: [{ id: 'inventory_pj_48', orderable, ats: orderable ? 99 : 0, stockLevel: orderable ? 99 : 0 }],
    }) as unknown as Product;

/** Pollo BBQ como lo devuelve SCAPI el 06-nov (subconjunto). */
const POLLO = {
    id: 'pz-pollo-bbq',
    name: 'Pollo BBQ',
    c_pjKind: 'pizza',
    c_pjSensory: 'Pollo jugoso y tocino crujiente sobre salsa BBQ ahumada.',
    c_pjBaseIngredients: ['mozzarella-base', 'pollo', 'cebolla'],
    c_pjExtraPrices: '{"medium": 1450, "family": 1940, "extra_large": 2290}',
    c_pjHalvesEnabled: true,
    variationAttributes: [
        {
            id: 'pjSize',
            values: [
                { value: 'individual', name: 'Individual' },
                { value: 'medium', name: 'Mediana' },
                { value: 'family', name: 'Familiar' },
                { value: 'extra_large', name: 'Extra grande' },
            ],
        },
        {
            id: 'pjCrust',
            values: [
                { value: 'traditional', name: 'Tradicional' },
                { value: 'thin', name: 'Delgada' },
                { value: 'stuffed', name: 'Borde de queso mozzarella' },
            ],
        },
    ],
    variants: [
        variant('individual', 'traditional', 5900),
        variant('medium', 'traditional', 13000),
        variant('medium', 'thin', 13000),
        variant('family', 'traditional', 16900),
        variant('family', 'thin', 16900),
        variant('family', 'stuffed', 20390),
        variant('extra_large', 'traditional', 21900),
    ],
    options: [
        option('choclo', 'Choclo', 1940),
        option('champinon', 'Champiñón', 1940),
        option('pepperoni', 'Pepperoni', 1940),
        option('salsa-bbq', 'Salsa BBQ', 0),
    ],
} as unknown as Product;

const INGREDIENTS = [
    ing('mozzarella-base', 'Mozzarella base', 'base_cheese'),
    ing('pollo', 'Pollo', 'meat'),
    ing('cebolla', 'Cebolla', 'vegetable'),
    ing('choclo', 'Choclo', 'vegetable'),
    ing('champinon', 'Champiñón', 'vegetable', false),
    ing('pepperoni', 'Pepperoni', 'meat'),
];

const STORE = {
    id: 'pj-48',
    name: 'El Bosque',
    inventoryId: 'inventory_pj_48',
    mode: 'pickup' as const,
    pickupMinutes: 15,
    deliveryMinutes: 30,
};

describe('buildPizzaConfig', () => {
    const config = buildPizzaConfig(POLLO, INGREDIENTS, STORE);

    it('usa los tamaños del lienzo y las masas reales del catálogo', () => {
        expect(config.sizes.map((s) => [s.id, s.price, s.extraPrice])).toEqual([
            ['medium', 13000, 1450],
            ['family', 16900, 1940],
            ['extra_large', 21900, 2290],
        ]);
        expect(config.crusts.map((c) => c.id)).toEqual(['traditional', 'thin', 'stuffed']);
    });

    it('solo los extras pagados, con foto y disponibilidad por tienda', () => {
        expect(paidExtraIds(POLLO)).toEqual(['choclo', 'champinon', 'pepperoni']);
        const champinon = config.extras.find((e) => e.id === 'champinon');
        expect(champinon?.available).toBe(false);
        expect(config.base.map((b) => b.name)).toEqual(['Mozzarella', 'Pollo', 'Cebolla']);
        expect(config.base[0].image).toBe('https://img/mozzarella-base.png');
    });

    it('sin tienda todo está disponible', () => {
        expect(buildPizzaConfig(POLLO, INGREDIENTS, null).extras.every((e) => e.available)).toBe(true);
    });

    it('sugiere un sustituto del mismo grupo para el agotado', () => {
        expect(substituteFor(config, 'champinon')?.id).toBe('choclo');
    });
});

describe('precio en vivo', () => {
    const config = buildPizzaConfig(POLLO, INGREDIENTS, STORE);

    it('abre en Familiar + Tradicional a $16.900', () => {
        const selection = defaultSelection(config);
        expect([selection.size, selection.crust]).toEqual(['family', 'traditional']);
        expect(totalPrice(config, selection)).toBe(16900);
    });

    it('borde de queso con el recargo real del catálogo', () => {
        expect(crustSurcharge(config, 'family', 'stuffed')).toBe(3490);
        expect(crustSurcharge(config, 'family', 'thin')).toBe(0);
    });

    it('quitar no cambia el precio; extras según tamaño; × cantidad', () => {
        const selection = {
            size: 'family',
            crust: 'traditional',
            removed: ['cebolla'],
            extras: ['choclo'],
            quantity: 2,
        };
        expect(unitPrice(config, selection)).toBe(18840);
        expect(totalPrice(config, selection)).toBe(37680);
        expect(unitPrice(config, { ...selection, size: 'extra_large' })).toBe(21900 + 2290);
    });

    it('normaliza masas inexistentes y quita extras agotados', () => {
        const selection = normalizeSelection(config, {
            size: 'extra_large',
            crust: 'stuffed',
            removed: ['cebolla', 'x'],
            extras: ['champinon', 'choclo'],
            quantity: 40,
        });
        expect(selection).toEqual({
            size: 'extra_large',
            crust: 'traditional',
            removed: ['cebolla'],
            extras: ['choclo'],
            quantity: 10,
        });
    });

    it('resumen «Familiar · Tradicional · sin cebolla · + Choclo»', () => {
        const summary = selectionSummary(
            config,
            { size: 'family', crust: 'traditional', removed: ['cebolla'], extras: ['choclo'], quantity: 1 },
            { without: (n) => `sin ${n}`, plus: (n) => `+ ${n}` }
        );
        expect(summary).toBe('Familiar · Tradicional · sin cebolla · + Choclo');
    });
});

describe('línea del carrito', () => {
    const config = buildPizzaConfig(POLLO, INGREDIENTS, null);

    it('al agregar manda solo los «si»; al editar, todos', () => {
        expect(optionItemsFor(config, ['choclo'])).toEqual([{ optionId: 'pjExtras_choclo', optionValueId: 'si' }]);
        // Al editar van todos los extras (orden de la hoja: destacados del lienzo primero).
        expect(optionItemsFor(config, ['choclo'], 'edit')).toEqual([
            { optionId: 'pjExtras_pepperoni', optionValueId: 'no' },
            { optionId: 'pjExtras_champinon', optionValueId: 'no' },
            { optionId: 'pjExtras_choclo', optionValueId: 'si' },
        ]);
    });

    it('recupera la selección de una línea existente (modo edición)', () => {
        const item = {
            itemId: 'a1',
            productId: 'pz-pollo-bbq-family-stuffed',
            quantity: 2,
            c_pjRemoved: ['cebolla'],
            optionItems: [
                { optionId: 'pjExtras_choclo', optionValueId: 'si' },
                { optionId: 'pjExtras_pepperoni', optionValueId: 'no' },
            ],
        };
        expect(selectionFromItem(config, item)).toEqual({
            size: 'family',
            crust: 'stuffed',
            removed: ['cebolla'],
            extras: ['choclo'],
            quantity: 2,
        });
        expect(extrasFromItem(item)).toEqual(['choclo']);
        expect(removedFromItem({ c_pjRemoved: '["tocino"]' })).toEqual(['tocino']);
        expect(removedFromItem({ c_pjRemoved: null })).toEqual([]);
    });
});

describe('utilidades', () => {
    it('nombres como los escribe el lienzo', () => {
        expect(displayIngredientName('Mozzarella base')).toBe('Mozzarella');
        expect(displayIngredientName('Tomate Cherry')).toBe('Tomate cherry');
        expect(displayIngredientName('Salsa BBQ')).toBe('Salsa BBQ');
        expect(storeDisplayName('Papa Johns El Bosque')).toBe('El Bosque');
    });

    it('qué productos abren la hoja', () => {
        expect(isConfigurablePizza({ id: 'pz-pollo-bbq', c_pjKind: 'pizza' })).toBe(true);
        expect(isConfigurablePizza({ id: 'pz-arma-tu-pizza', c_pjKind: 'builder' })).toBe(true);
        expect(isConfigurablePizza({ id: 'pz-mitades', c_pjKind: 'builder' })).toBe(false);
        expect(isConfigurablePizza({ id: 'cb-super-duo', c_pjKind: 'combo' })).toBe(false);
    });
});
