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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { UITarget } from '@/targets/ui-target';
import { useBasket } from '@/providers/basket';
import { formatClp, PointsBadge, pointsFor } from '@/extensions/pj-shared';

/** Resumen estándar del carrito (MEN-03.2): productos, total e «Ir a pagar». CAR lo enriquece. */
function DefaultSummary(): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const basket = useBasket();
    const items = basket?.productItems ?? [];
    const total = basket?.productTotal ?? basket?.productSubTotal ?? 0;
    if (items.length === 0) {
        return <p className="m-0 text-[15px] text-pj-gray">{t('order.empty')}</p>;
    }
    return (
        <>
            <ul className="m-0 flex list-none flex-col gap-2 p-0" data-testid="pj-menu-order-lines">
                {items.map((item) => (
                    <li key={item.itemId} className="flex justify-between gap-2 border-b border-pj-sand pb-2 text-sm">
                        <span className="min-w-0">
                            <strong>{t('order.line', { count: item.quantity ?? 1 })}</strong>{' '}
                            {item.itemText ?? item.productName}
                        </span>
                        <span className="font-bold">{formatClp(item.price ?? 0)}</span>
                    </li>
                ))}
            </ul>
            <div className="flex flex-col gap-2.5">
                <div className="flex justify-between text-lg font-extrabold" data-testid="pj-menu-order-total">
                    <span>{t('order.total')}</span>
                    <span>{formatClp(total)}</span>
                </div>
                <Link
                    to={'/checkout'}
                    className="flex min-h-[52px] items-center justify-center rounded-full bg-pj-green text-base font-bold text-pj-surface no-underline hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                    {t('order.checkout')}
                </Link>
                <PointsBadge points={pointsFor(total)} className="self-start" />
            </div>
        </>
    );
}

/**
 * «Tu pedido» fijo en la columna derecha del menú de escritorio (MEN-03). El contenido va en el
 * punto de inserción `pj.menu.orderSummary`: CAR lo reemplaza o lo enriquece (oleada 2).
 */
export function OrderSummary(): ReactElement {
    const { t } = useTranslation('extPjMenu');
    return (
        <aside
            aria-label={t('order.title')}
            data-testid="pj-menu-order"
            className="sticky top-[calc(var(--header-height,60px)+4.5rem)] hidden max-w-85 min-w-70 flex-1 flex-col gap-3 self-start rounded-[18px] bg-pj-surface p-[18px] shadow-pj-card lg:flex">
            <h2 className="text-[26px]">{t('order.title')}</h2>
            <UITarget targetId="pj.menu.orderSummary">
                <DefaultSummary />
            </UITarget>
        </aside>
    );
}
