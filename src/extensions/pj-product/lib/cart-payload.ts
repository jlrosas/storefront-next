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
import type { ShopperBasketsV2 } from '@/scapi';

/** Ruta de la acción de carrito de PRO (`routes/action.pj-cart.ts`). */
export const PJ_CART_ACTION = '/action/pj-cart';

export interface OptionItemInput {
    optionId: string;
    optionValueId: string;
}

/** Valores de opción que acepta la acción: extras (`si`/`no`) y la marca de combo `pjCombo` (`duo`/`trio`, §7.1). */
const OPTION_VALUES = ['si', 'no', 'duo', 'trio'];

/** Lo que manda la hoja, la ficha y el armador a `/action/pj-cart` (campo `payload`, JSON). */
export type PjCartPayload =
    | {
          intent: 'pizza';
          /** Con `itemId` actualiza esa línea (PRO-05) en vez de crear otra. */
          itemId?: string;
          /** Variante tamaño + masa (`pz-pollo-bbq-family-traditional`). */
          productId: string;
          quantity: number;
          optionItems: OptionItemInput[];
          /** `c_pjRemoved`. */
          removed: string[];
          /** Complementos que se agregan junto con la pizza (ficha, «Completa tu pedido»). */
          sides?: string[];
      }
    | {
          intent: 'halves';
          itemId?: string;
          /** Variante de `pz-mitades` (`pz-mitades-family-traditional`). */
          productId: string;
          quantity: number;
          /** Especialidad de cada mitad, en orden. */
          halves: string[];
      }
    | {
          /** Combo con ficha (PRO-08): el `cb-*` con sus elecciones y, en la misma llamada, los complementos. */
          intent: 'combo';
          productId: string;
          quantity: number;
          /** `c_pjComboChoices` (CONTRATO §7): `[{ slot, product }]`. */
          choices: Array<{ slot: string; product: string }>;
          sides?: string[];
      }
    | {
          /**
           * Super Dúo / Super Trío (S-D20): las pizzas como líneas de pizza normales con `pjCombo` y el mismo
           * `c_pjComboGroup` (`lib/combo-cart.ts`).
           */
          intent: 'combo-pizzas';
          comboId: string;
          pizzas: Array<{ productId: string; optionItems: OptionItemInput[]; removed: string[] }>;
      }
    | {
          /** Quita un combo armado entero: todas las líneas de su `c_pjComboGroup`. */
          intent: 'combo-remove';
          group: string;
      }
    | {
          intent: 'add';
          items: Array<{ productId: string; quantity: number }>;
          /** `c_pjComboFor` (§7.1): la pizza (`itemId`) o el grupo del combo al que acompañan estas líneas. */
          comboFor?: string;
      }
    | { intent: 'remove'; itemIds: string[] }
    | { intent: 'swap'; itemId: string; productId: string };

export interface PjCartResult {
    success: boolean;
    basket?: ShopperBasketsV2.schemas['Basket'];
    /** Líneas creadas (o la línea editada) por esta llamada, para «Deshacer» y el paso «Hazlo combo». */
    addedItemIds?: string[];
    /** `combo-pizzas`: la promoción del combo quedó aplicada a las pizzas en la canasta. */
    comboApplied?: boolean;
    /** `combo-pizzas`: grupo creado (`c_pjComboGroup`) o `null` si la canasta no aceptó el atributo. */
    comboGroup?: string | null;
    error?: { code?: string; message?: string };
}

const isString = (value: unknown): value is string => typeof value === 'string' && value.trim() !== '';
const isQuantity = (value: unknown): value is number =>
    typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 99;

/** Valida el JSON recibido; devuelve `null` si no tiene la forma esperada. */
export function parsePjCartPayload(raw: unknown): PjCartPayload | null {
    let value: unknown = raw;
    if (typeof raw === 'string') {
        try {
            value = JSON.parse(raw);
        } catch {
            return null;
        }
    }
    if (!value || typeof value !== 'object') return null;
    const p = value as Record<string, unknown>;
    switch (p.intent) {
        case 'pizza': {
            if (!isString(p.productId) || !isQuantity(p.quantity)) return null;
            const optionItems = Array.isArray(p.optionItems)
                ? p.optionItems.filter(
                      (o): o is OptionItemInput =>
                          !!o &&
                          isString((o as OptionItemInput).optionId) &&
                          OPTION_VALUES.includes((o as OptionItemInput).optionValueId)
                  )
                : [];
            return {
                intent: 'pizza',
                ...(isString(p.itemId) ? { itemId: p.itemId } : {}),
                productId: p.productId,
                quantity: p.quantity,
                optionItems,
                removed: Array.isArray(p.removed) ? p.removed.filter(isString) : [],
                sides: Array.isArray(p.sides) ? p.sides.filter(isString) : [],
            };
        }
        case 'halves': {
            if (!isString(p.productId) || !isQuantity(p.quantity) || !Array.isArray(p.halves)) return null;
            const halves = p.halves.filter(isString);
            if (halves.length !== 2) return null;
            return {
                intent: 'halves',
                ...(isString(p.itemId) ? { itemId: p.itemId } : {}),
                productId: p.productId,
                quantity: p.quantity,
                halves,
            };
        }
        case 'combo': {
            if (!isString(p.productId) || !p.productId.startsWith('cb-') || !isQuantity(p.quantity)) return null;
            if (!Array.isArray(p.choices)) return null;
            const choices = p.choices.filter(
                (c): c is { slot: string; product: string } =>
                    !!c && isString((c as { slot?: unknown }).slot) && isString((c as { product?: unknown }).product)
            );
            if (choices.length !== p.choices.length || choices.length === 0) return null;
            return {
                intent: 'combo',
                productId: p.productId,
                quantity: p.quantity,
                choices: choices.map(({ slot, product }) => ({ slot, product })),
                sides: Array.isArray(p.sides) ? p.sides.filter(isString) : [],
            };
        }
        case 'combo-pizzas': {
            if (!isString(p.comboId) || !p.comboId.startsWith('cb-') || !Array.isArray(p.pizzas)) return null;
            const pizzas = p.pizzas.flatMap((entry) => {
                const pizza = entry as { productId?: unknown; optionItems?: unknown; removed?: unknown } | null;
                if (!pizza || !isString(pizza.productId) || !pizza.productId.startsWith('pz-')) return [];
                return [
                    {
                        productId: pizza.productId,
                        optionItems: Array.isArray(pizza.optionItems)
                            ? pizza.optionItems.filter(
                                  (o): o is OptionItemInput =>
                                      !!o &&
                                      isString((o as OptionItemInput).optionId) &&
                                      (o as OptionItemInput).optionValueId === 'si'
                              )
                            : [],
                        removed: Array.isArray(pizza.removed) ? pizza.removed.filter(isString) : [],
                    },
                ];
            });
            if (pizzas.length === 0 || pizzas.length !== p.pizzas.length) return null;
            return { intent: 'combo-pizzas', comboId: p.comboId, pizzas };
        }
        case 'combo-remove':
            return isString(p.group) ? { intent: 'combo-remove', group: p.group } : null;
        case 'add': {
            if (!Array.isArray(p.items)) return null;
            const items = p.items.filter(
                (i): i is { productId: string; quantity: number } =>
                    !!i &&
                    isString((i as { productId: unknown }).productId) &&
                    isQuantity((i as { quantity: unknown }).quantity)
            );
            if (!items.length) return null;
            return isString(p.comboFor) ? { intent: 'add', items, comboFor: p.comboFor } : { intent: 'add', items };
        }
        case 'remove': {
            const itemIds = Array.isArray(p.itemIds) ? p.itemIds.filter(isString) : [];
            return itemIds.length ? { intent: 'remove', itemIds } : null;
        }
        case 'swap':
            return isString(p.itemId) && isString(p.productId)
                ? { intent: 'swap', itemId: p.itemId, productId: p.productId }
                : null;
        default:
            return null;
    }
}
