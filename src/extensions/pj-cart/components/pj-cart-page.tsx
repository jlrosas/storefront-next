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
import { type ReactElement, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShopperBasketsV2 } from '@/scapi';
import { Link } from '@/components/link';
import { useBasket, useBasketUpdater } from '@/providers/basket';
import { routes } from '@/route-paths';
import { getOrCreateCheckoutCorrelationId } from '@/lib/checkout/correlation';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { DELIVERY_FEE_CLP, DELIVERY_MINIMUM_CLP } from '@/extensions/pj-shared/lib/fulfillment';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { useLineSummaries } from '../hooks/use-line-summaries';
import type { SummaryLineItem } from '../lib/line-summary';
import type { PjCartData } from '../lib/types';
import { CartLine } from './cart-line';
import { FulfillmentCard } from './fulfillment-card';

type Basket = ShopperBasketsV2.schemas['Basket'];

export interface PjCartPageProps extends PjCartData {
    /** Canasta del loader de `/cart`; después manda la del contexto (cambios de cantidad, edición). */
    basket: Basket | undefined;
}

/**
 * «Mi pedido» (CAR-01, Pedido.dc.html y Carrito-Desktop.dc.html) en lugar del carrito del template: la
 * modalidad arriba, cada línea como la pizza que se armó, los puntos y «Ir a pagar · $total».
 */
export function PjCartPage({ basket: loaderBasket, lineProducts, fulfillment }: PjCartPageProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const contextBasket = useBasket();
    const updateBasket = useBasketUpdater();
    const me = usePjMe();

    // Igual que el carrito del template: la canasta del loader entra al contexto antes de pintar.
    useLayoutEffect(() => {
        if (loaderBasket?.basketId) updateBasket(loaderBasket);
    }, [loaderBasket, updateBasket]);

    const basket = contextBasket?.basketId === loaderBasket?.basketId ? (contextBasket ?? loaderBasket) : loaderBasket;
    const items = basket?.productItems as SummaryLineItem[] | undefined;
    const { summaries, entries } = useLineSummaries(items, lineProducts);
    const count = summaries.reduce((sum, line) => sum + line.quantity, 0);

    if (!summaries.length) {
        return (
            <div className="surface-dough min-h-[60vh] px-4 py-10 text-center" data-testid="pj-cart-empty">
                <h1 className="pj-h2 m-0">{t('empty.title')}</h1>
                <p className="mx-auto mt-3 max-w-sm text-pj-gray-strong">{t('empty.hint')}</p>
                <Link
                    to={PJ_ROUTES.menu}
                    className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-pj-green px-8 text-base font-bold text-pj-surface no-underline">
                    {t('empty.cta')}
                </Link>
            </div>
        );
    }

    const products = basket?.productTotal ?? basket?.productSubTotal ?? 0;
    const delivery = fulfillment?.mode === 'delivery';
    const shipping = delivery ? DELIVERY_FEE_CLP : 0;
    const total = products + shipping;
    const points = pointsFor(total, shipping, me?.doublePoints ?? false);
    const missing = delivery ? Math.max(0, DELIVERY_MINIMUM_CLP - products) : 0;
    const checkoutLabel = t('summary.checkout');

    const summaryBlock = (
        <div className="flex flex-col gap-3">
            <p
                className="surface-garlic m-0 rounded-pj-card px-4 py-3 text-sm font-bold text-pj-sauce"
                data-testid="pj-cart-points">
                {t('summary.points', { points })}
            </p>
            {missing > 0 && (
                <p className="m-0 text-sm font-bold text-pj-sauce" data-testid="pj-cart-threshold">
                    {t('summary.threshold', { amount: formatClp(missing) })}
                </p>
            )}
            <dl className="m-0 flex flex-col gap-1.5 text-[15px]">
                <div className="flex justify-between">
                    <dt className="text-pj-gray-strong">{t('summary.subtotal')}</dt>
                    <dd className="m-0 font-semibold">{formatClp(products)}</dd>
                </div>
                <div className="flex justify-between">
                    <dt className="text-pj-gray-strong">
                        {delivery ? t('summary.deliveryFee') : t('summary.pickupFee')}
                    </dt>
                    <dd className="m-0 font-semibold">{delivery ? formatClp(shipping) : t('summary.free')}</dd>
                </div>
                <div className="flex justify-between border-t border-pj-line pt-2 text-lg font-extrabold">
                    <dt>{t('summary.total')}</dt>
                    <dd className="m-0" data-testid="pj-cart-total">
                        {formatClp(total)}
                    </dd>
                </div>
            </dl>
        </div>
    );

    const checkoutButton = (
        <Link
            to={routes.checkout}
            onClick={() => getOrCreateCheckoutCorrelationId()}
            aria-label={t('summary.checkoutAria', { total: formatClp(total) })}
            data-testid="pj-cart-checkout"
            className="flex min-h-[52px] items-center justify-between rounded-full bg-pj-green px-6 text-base font-bold text-pj-surface no-underline hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
            <span>{checkoutLabel}</span>
            <span>{formatClp(total)}</span>
        </Link>
    );

    return (
        <div className="surface-dough -mt-8 min-h-screen pb-32 lg:pb-16" data-testid="pj-cart">
            <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-4 pt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-8 lg:px-8 lg:pt-10">
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex items-baseline justify-between gap-3">
                        <h1 className="pj-h2 m-0">{t('page.title')}</h1>
                        <span className="text-sm font-semibold text-pj-gray-strong" data-testid="pj-cart-count">
                            {t('page.count', { count })}
                        </span>
                    </div>
                    <FulfillmentCard fulfillment={fulfillment} />
                    <ul
                        aria-label={t('page.linesLabel')}
                        className="m-0 list-none divide-y divide-pj-line rounded-pj-card bg-pj-surface px-4 shadow-pj-card"
                        data-testid="pj-cart-lines">
                        {entries.map(({ summary, combo }) => (
                            <CartLine key={summary.itemId} summary={summary} combo={combo} products={lineProducts} />
                        ))}
                    </ul>
                    <div className="lg:hidden">{summaryBlock}</div>
                    <Link
                        to={PJ_ROUTES.menu}
                        className="inline-flex min-h-11 items-center self-center text-[15px] font-bold text-pj-basil underline underline-offset-4 lg:self-start">
                        {t('summary.keepBrowsing')}
                    </Link>
                </div>
                <aside className="hidden flex-col gap-4 rounded-pj-card bg-pj-surface p-5 shadow-pj-card lg:sticky lg:top-[calc(var(--header-height,72px)+1.5rem)] lg:mt-[68px] lg:flex">
                    {summaryBlock}
                    {checkoutButton}
                </aside>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pj-line bg-pj-dough px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
                {checkoutButton}
            </div>
        </div>
    );
}

export default PjCartPage;
