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
/** @sfdc-extension-file SFDC_EXT_PJ_CHECKOUT */
import { type ReactElement, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { useBasketReset } from '@/providers/basket';
import { formatClp, formatCount, formatTime } from '@/extensions/pj-shared/lib/format';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { useLineSummaries } from '@/extensions/pj-cart/hooks/use-line-summaries';
import type { SummaryLineItem } from '@/extensions/pj-cart/lib/line-summary';
import { SantiagoMap } from '@/extensions/pj-store/components/santiago-map';
import { formatPhone, trackingHref } from '../lib/checkout-model';
import type { PjConfirmationData } from '../lib/types';
import { OrderLines } from './order-lines';

function CheckIcon(): ReactElement {
    return (
        <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/**
 * Estados del pedido (CHK-05.2). Punto de inserción de SEG-01: la barra de avance en vivo reemplaza este bloque
 * (`data-pj-slot="order-status"`). En la oleada 2 se ve el estado inicial «Recibido».
 */
export function OrderStatusSteps({ data }: { data: PjConfirmationData }): ReactElement {
    const { t } = useTranslation('extPjCheckout');
    const placed = formatTime(data.placedAt);
    const steps =
        data.mode === 'pickup'
            ? [
                  { label: t('confirmation.stepReceived'), detail: t('confirmation.now', { time: placed }) },
                  { label: t('confirmation.stepPreparing'), detail: t('confirmation.stepPreparingDetail') },
                  {
                      label: t('confirmation.stepReady'),
                      detail: data.readyAt ? t('confirmation.approx', { time: data.readyAt }) : '',
                  },
              ]
            : [
                  { label: t('confirmation.stepReceived'), detail: t('confirmation.now', { time: placed }) },
                  { label: t('confirmation.stepPreparing'), detail: t('confirmation.stepPreparingDetail') },
                  { label: t('confirmation.stepOnTheWay'), detail: '' },
                  { label: t('confirmation.stepDelivered'), detail: data.readyAt ?? '' },
              ];
    return (
        <section
            aria-labelledby="pj-order-status"
            data-pj-slot="order-status"
            data-status="recibido"
            className="rounded-pj-card bg-pj-surface p-4 shadow-pj-card lg:p-5">
            <h2 id="pj-order-status" className="pj-card-title m-0 mb-3 text-xl text-pj-heading">
                {t('confirmation.statusTitle')}
            </h2>
            <ol className="m-0 list-none p-0">
                {steps.map((step, index) => {
                    const current = index === 0;
                    const last = index === steps.length - 1;
                    return (
                        <li key={step.label} className="flex gap-3" aria-current={current ? 'step' : undefined}>
                            <div className="flex flex-col items-center">
                                <span
                                    aria-hidden="true"
                                    className={
                                        current
                                            ? 'size-5 shrink-0 rounded-full border-4 border-pj-green bg-pj-lime'
                                            : 'size-5 shrink-0 rounded-full border-2 border-pj-input-line bg-pj-surface'
                                    }
                                />
                                {!last && <span aria-hidden="true" className="w-0.5 flex-1 bg-pj-line" />}
                            </div>
                            <div className="pb-4">
                                <p
                                    className={
                                        current
                                            ? 'm-0 font-extrabold text-pj-heading'
                                            : 'm-0 font-medium text-pj-gray-strong'
                                    }>
                                    {step.label}
                                </p>
                                {step.detail && <p className="m-0 text-sm text-pj-gray-strong">{step.detail}</p>}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </section>
    );
}

/**
 * «¡Pago aprobado!» de Papa Johns (CHK-05, 08): número de pedido, cuándo está listo y dónde, los estados, los
 * Papa Puntos por acreditar con el saldo que queda (S-D12) y un solo botón principal, «Seguir mi pedido».
 * A 1440, dos columnas con el mapa dibujado de la tienda.
 */
export function PjConfirmation({ data }: { data: PjConfirmationData }): ReactElement {
    const { t } = useTranslation('extPjCheckout');
    const resetBasket = useBasketReset();
    useEffect(() => {
        // El pedido consumió la canasta: el contador del encabezado vuelve a cero.
        resetBasket();
    }, [resetBasket]);

    const items = useMemo(() => data.items as SummaryLineItem[], [data.items]);
    const ignore = useMemo(() => (data.canjeItemId ? [data.canjeItemId] : []), [data.canjeItemId]);
    const { entries, products } = useLineSummaries(items, data.lineProducts, ignore);
    const store = data.storeName ?? data.storeId ?? '';
    const pickup = data.mode === 'pickup';
    const canje = data.canjeItemId ? { itemId: data.canjeItemId, points: data.redeemed, value: data.canjeValue } : null;

    const ready = pickup
        ? data.minutes
            ? t('confirmation.readyPickup', { minutes: data.minutes, store })
            : null
        : data.minutes
          ? t('confirmation.readyDelivery', { from: Math.max(5, data.minutes - 5), to: data.minutes + 5 })
          : null;
    const readyDetail = data.readyAt
        ? pickup
            ? t('confirmation.readyPickupAt', { time: data.readyAt })
            : t('confirmation.readyDeliveryAt', { window: data.readyAt })
        : null;
    const phone = data.phone ? formatPhone(data.phone) : null;

    return (
        <div className="surface-dough -mt-8 min-h-screen pb-16" data-testid="pj-confirmation">
            <div className="mx-auto grid w-full max-w-[1120px] gap-4 px-4 pt-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-8 lg:px-8 lg:pt-10">
                <div className="flex min-w-0 flex-col gap-4">
                    <section
                        aria-live="polite"
                        className="flex flex-col gap-2 rounded-pj-section bg-pj-green p-5 text-pj-surface shadow-pj-card motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-4 motion-safe:duration-500"
                        data-testid="pj-confirmation-head">
                        <span className="flex size-12 items-center justify-center rounded-full bg-pj-lime text-pj-green">
                            <CheckIcon />
                        </span>
                        <h1 className="pj-h2 m-0 text-pj-surface">
                            {data.payment?.kind === 'cash'
                                ? t('confirmation.headlineCash')
                                : t('confirmation.headline')}
                        </h1>
                        <p className="m-0 text-base font-semibold" data-testid="pj-confirmation-order">
                            {t('confirmation.orderNo', { orderNo: data.orderNo })} · {formatClp(data.charged)}
                        </p>
                        {ready && (
                            <p
                                className="m-0 font-heading text-[26px] leading-tight uppercase"
                                data-testid="pj-confirmation-ready">
                                {ready}
                            </p>
                        )}
                        {readyDetail && <p className="m-0 text-base">{readyDetail}</p>}
                        <Link
                            to={trackingHref(data.orderNo)}
                            data-testid="pj-confirmation-track"
                            className="mt-2 flex h-14 items-center justify-center rounded-full bg-pj-lime px-6 text-[17px] font-bold text-pj-green no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-surface">
                            {t('confirmation.track')}
                        </Link>
                    </section>

                    <OrderStatusSteps data={data} />

                    <section className="flex flex-col gap-3 rounded-pj-card bg-pj-surface p-4 shadow-pj-card lg:p-5">
                        {pickup ? (
                            <div className="flex items-center gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="m-0 text-base font-bold text-pj-heading">
                                        {t('confirmation.store', { store })}
                                    </p>
                                    {data.storeAddress && (
                                        <p className="m-0 text-sm text-pj-gray-strong">{data.storeAddress}</p>
                                    )}
                                </div>
                                {data.mapsUrl && (
                                    <a
                                        href={data.mapsUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={t('confirmation.directionsAria', { store })}
                                        className="inline-flex min-h-11 shrink-0 items-center rounded-full border-2 border-pj-basil px-4 text-[15px] font-bold text-pj-basil no-underline">
                                        {t('confirmation.directions')}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <div>
                                {data.address && (
                                    <p className="m-0 text-base font-bold text-pj-heading">
                                        {t('confirmation.deliveryTo', { address: data.address })}
                                    </p>
                                )}
                                {store && (
                                    <p className="m-0 text-sm text-pj-gray-strong">
                                        {t('confirmation.deliveryFrom', { store })}
                                    </p>
                                )}
                            </div>
                        )}
                        {data.storeCoords && data.storeId && (
                            <div className="hidden overflow-hidden rounded-pj-card lg:block">
                                <SantiagoMap
                                    stores={[
                                        {
                                            id: data.storeId,
                                            name: `Papa Johns ${store}`,
                                            latitude: data.storeCoords.latitude,
                                            longitude: data.storeCoords.longitude,
                                        },
                                    ]}
                                    featuredId={data.storeId}
                                    center={data.storeCoords}
                                    band
                                />
                            </div>
                        )}
                        {phone && (
                            <p className="m-0 text-sm text-pj-gray-strong">
                                {pickup ? t('confirmation.sms', { phone }) : t('confirmation.smsDelivery', { phone })}
                            </p>
                        )}
                    </section>
                </div>

                <aside className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-height,72px)+1.5rem)]">
                    <section
                        aria-label={t('points.label')}
                        className="surface-sauce flex flex-col gap-2 rounded-pj-section p-4"
                        data-testid="pj-confirmation-points">
                        <p className="m-0 font-heading text-[26px] leading-tight uppercase">
                            {t('confirmation.pointsEarned', { points: formatCount(data.earned) })}
                        </p>
                        {data.redeemed > 0 && (
                            <p className="m-0 text-base">
                                {t('confirmation.pointsRedeemed', { points: formatCount(data.redeemed) })}
                            </p>
                        )}
                        {data.balanceAfter !== null && (
                            <p className="m-0 text-base font-bold" data-testid="pj-confirmation-balance">
                                {pickup
                                    ? t('confirmation.pointsAfter', { balance: formatCount(data.balanceAfter) })
                                    : t('confirmation.pointsAfterDelivery', {
                                          balance: formatCount(data.balanceAfter),
                                      })}
                            </p>
                        )}
                        {data.registered && (
                            <Link
                                to={PJ_ROUTES.points}
                                className="inline-flex min-h-11 items-center self-start text-[15px] font-bold text-pj-dough underline underline-offset-4">
                                {t('confirmation.pointsAccount')}
                            </Link>
                        )}
                    </section>

                    <details
                        open
                        className="group rounded-pj-card bg-pj-surface p-4 shadow-pj-card lg:p-5"
                        data-testid="pj-confirmation-detail">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-base font-bold text-pj-heading">
                            {t('confirmation.detail', { total: formatClp(data.charged) })}
                            <span aria-hidden="true" className="transition-transform group-open:rotate-180">
                                ▾
                            </span>
                        </summary>
                        <OrderLines entries={entries} products={products} canje={canje} comboImage={data.comboImage} />
                        {data.shipping > 0 && (
                            <p className="m-0 flex justify-between border-t border-pj-line pt-2 text-[15px]">
                                <span>{t('confirmation.shipping')}</span>
                                <span className="font-semibold tabular-nums">{formatClp(data.shipping)}</span>
                            </p>
                        )}
                        <p className="m-0 border-t border-pj-line pt-2 text-sm text-pj-gray-strong">
                            {data.payment?.kind === 'card'
                                ? t('confirmation.paidCard', { brand: data.payment.brand, last4: data.payment.last4 })
                                : t('confirmation.paidCash')}
                        </p>
                    </details>

                    <Link
                        to={PJ_ROUTES.home}
                        className="inline-flex min-h-11 items-center self-center text-[15px] font-bold text-pj-basil underline underline-offset-4">
                        {t('confirmation.home')}
                    </Link>
                </aside>
            </div>
        </div>
    );
}

export default PjConfirmation;
