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
import { type ReactElement, useState } from 'react';
import { useBasket } from '@/providers/basket';
import { Link } from '@/components/link';
import { PizzaSheet } from '../components/pizza-sheet-launcher';
import { HalvesLineSummary } from '../components/halves-line-summary';
import { halvesHref, isHalvesItem } from '../lib/halves';
import { usePjCart } from '../hooks/use-pj-cart';

/**
 * /pro-demo — banco de pruebas de PRO mientras MEN y CAR no integran la hoja (solo para VAL e INT;
 * no está enlazado desde el sitio). Monta `PizzaSheet` como lo hará el menú y lista las líneas de pizza
 * del carrito con «Editar» (PRO-05) y «Editar mitades» (PRO-04).
 */
export default function ProDemo(): ReactElement {
    const basket = useBasket({ autoLoad: true });
    const { submit, busy } = usePjCart();
    const allIds = (basket?.productItems ?? []).map((item) => item.itemId ?? '').filter(Boolean);
    const [sheet, setSheet] = useState<{ productId: string; halfFirst?: boolean; itemId?: string } | null>(null);
    const pizzas = (basket?.productItems ?? []).filter((item) => (item.productId ?? '').startsWith('pz-'));
    const button = 'min-h-[44px] rounded-full bg-pj-green px-4 text-sm font-bold text-pj-surface';
    return (
        <div className="mx-auto flex max-w-[720px] flex-col gap-4 p-4">
            <h1>Banco de pruebas PRO</h1>
            <div className="flex flex-wrap gap-2">
                <button type="button" className={button} onClick={() => setSheet({ productId: 'pz-pollo-bbq' })}>
                    Agregar Pollo BBQ
                </button>
                <button type="button" className={button} onClick={() => setSheet({ productId: 'pz-italiana' })}>
                    Agregar Italiana
                </button>
                <button type="button" className={button} onClick={() => setSheet({ productId: 'pz-arma-tu-pizza' })}>
                    Arma tu pizza
                </button>
                <button
                    type="button"
                    className={button}
                    onClick={() => setSheet({ productId: 'pz-pollo-bbq', halfFirst: true })}>
                    ½ Mitad Pollo BBQ
                </button>
                <Link
                    className={`${button} flex items-center no-underline`}
                    to={halvesHref({ first: 'pz-pollo-bbq', second: 'pz-todas-las-carnes' })}>
                    Mitades de Sofía
                </Link>
            </div>
            <h2>Pizzas en el carrito</h2>
            <button
                type="button"
                className={`${button} self-start`}
                disabled={busy || allIds.length === 0}
                data-testid="pj-demo-empty"
                onClick={() => void submit({ intent: 'remove', itemIds: allIds })}>
                Vaciar carrito ({allIds.length})
            </button>
            <ul className="flex flex-col gap-3">
                {pizzas.map((item) =>
                    isHalvesItem(item as { productId?: string; c_pjHalves?: unknown }) ? (
                        <li key={item.itemId} data-item-id={item.itemId} className="rounded-pj-card bg-pj-surface p-3">
                            <HalvesLineSummary itemId={item.itemId ?? ''} halves={[]} detail={item.productName} />
                        </li>
                    ) : (
                        <li
                            key={item.itemId}
                            data-item-id={item.itemId}
                            className="flex items-center justify-between rounded-pj-card bg-pj-surface p-3">
                            <span>
                                {item.productName} · {item.quantity}
                            </span>
                            <button
                                type="button"
                                className={button}
                                onClick={() => setSheet({ productId: item.productId ?? '', itemId: item.itemId })}>
                                Editar
                            </button>
                        </li>
                    )
                )}
            </ul>
            {sheet && (
                <PizzaSheet
                    key={JSON.stringify(sheet)}
                    productId={sheet.productId}
                    halfFirst={sheet.halfFirst}
                    itemId={sheet.itemId}
                    open
                    onOpenChange={(open) => !open && setSheet(null)}
                />
            )}
        </div>
    );
}
