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
/** @sfdc-extension-file SFDC_EXT_PJ_STORE */
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { cn } from '@/lib/utils';
import { DEFAULT_CENTER, useStoresNear, type Coordinates } from '../hooks/use-stores-near';
import { openFulfillmentPanel } from '../lib/fulfillment-store';
import { nextOpening } from '../lib/schedule';
import {
    formatKm,
    isStoreClosed,
    opensAt,
    openUntil,
    pickupMinutes,
    shortStoreName,
    type PjStore,
} from '../lib/store-info';

/**
 * Página «Locales» (enlaces del encabezado y del footer). Hereda el estilo del panel de tienda:
 * tarjetas con «Abierta · cierra 23:30» y «Listo en N min», con *skeleton* mientras llega la
 * respuesta (nunca «no hay tiendas» antes de recibirla). `?modo=delivery` (tarjeta «Delivery» de la
 * Home) abre el panel directamente en delivery. Las tiendas de Chile no tienen código postal en
 * Commerce: se parte con las más cercanas al centro de Santiago y «Usar mi ubicación» las reordena.
 */
export default function LocalesPage(): ReactElement {
    const { t } = useTranslation('extPjStore');
    const [params] = useSearchParams();
    const [center, setCenter] = useState<Coordinates>(DEFAULT_CENTER);
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const { stores, loading, error } = useStoresNear(center);
    const deliveryRequested = params.get('modo') === 'delivery';
    const openedRef = useRef(false);

    // F12: la tarjeta «Delivery» de la Home llega con `?modo=delivery` y abre el panel en delivery.
    useEffect(() => {
        if (!deliveryRequested || openedRef.current) return;
        openedRef.current = true;
        openFulfillmentPanel({ initialMode: 'delivery' });
    }, [deliveryRequested]);

    const useMyLocation = useCallback(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setLocationError(true);
            return;
        }
        setLocating(true);
        setLocationError(false);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocating(false);
                setCenter({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            },
            () => {
                setLocating(false);
                setLocationError(true);
            },
            { timeout: 10000 }
        );
    }, []);

    return (
        <section aria-labelledby="pj-locales-heading" className="mx-auto w-full max-w-[860px] px-4 py-6 lg:py-10">
            <h1 id="pj-locales-heading" className="pj-h1">
                {t('locales.title')}
            </h1>
            <p className="pj-body mt-1 text-pj-gray">{t('locales.subtitle')}</p>
            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <button
                    type="button"
                    onClick={useMyLocation}
                    disabled={locating}
                    className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-pj-basil px-5 text-[15px] font-bold text-pj-dough transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97] disabled:opacity-60 sm:w-auto">
                    {locating ? t('pickup.locating') : t('pickup.useLocation')}
                </button>
                <button
                    type="button"
                    onClick={() => openFulfillmentPanel({ initialMode: 'delivery' })}
                    className="flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-pj-dough-deep px-5 text-[15px] font-bold text-pj-basil transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97] sm:w-auto">
                    {t('locales.delivery')}
                </button>
            </div>
            {locationError && (
                <p role="alert" className="mt-2 text-sm text-pj-sale">
                    {t('pickup.locationError')}
                </p>
            )}

            <div className="mt-5 grid gap-3 lg:grid-cols-2" aria-busy={loading}>
                {loading && stores.length === 0 && !error && <LocalesSkeleton />}
                {stores.map((store) => (
                    <LocalCard key={store.id} store={store} />
                ))}
            </div>
            {error && (
                <p role="alert" className="mt-4 text-sm text-pj-sale">
                    {t('pickup.loadError')}
                </p>
            )}
            {!loading && !error && stores.length === 0 && (
                <p role="status" className="pj-body mt-4 text-pj-gray-strong">
                    {t('locales.empty')}
                </p>
            )}
        </section>
    );
}

function LocalCard({ store }: { store: PjStore }): ReactElement {
    const { t } = useTranslation('extPjStore');
    const closed = isStoreClosed(store);
    const status = closed
        ? t(nextOpening(store).tomorrow ? 'pickup.closedTomorrow' : 'pickup.closed', { time: opensAt(store) })
        : t('pickup.open', { time: openUntil(store) });
    // Sin coma final: «Tobalaba 201 · Las Condes».
    const address = [store.address1, store.city]
        .map((part) => part?.trim().replace(/[,\s]+$/, ''))
        .filter(Boolean)
        .join(', ');
    return (
        <article
            data-testid={`pj-local-${store.id}`}
            className="flex flex-col gap-3 rounded-pj-card bg-pj-surface p-4 shadow-pj-card">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                    <h2 className="pj-card-title">{shortStoreName(store.name)}</h2>
                    <p className="text-[13px] text-pj-gray">
                        {[address, formatKm(store.distance)].filter(Boolean).join(' · ')}
                    </p>
                    <p className={cn('text-[13px] font-semibold', closed ? 'text-pj-sauce' : 'text-pj-basil')}>
                        <span
                            aria-hidden="true"
                            className={cn(
                                'mr-1.5 inline-block size-2 rounded-full align-middle',
                                closed ? 'bg-pj-tomato' : 'bg-pj-vine'
                            )}
                        />
                        {status}
                    </p>
                </div>
                <span className="shrink-0 text-right text-[13px] leading-tight font-bold whitespace-pre-line text-pj-basil">
                    {closed ? t('pickup.onlyScheduled') : t('pickup.ready', { minutes: pickupMinutes(store) })}
                </span>
            </div>
            <button
                type="button"
                onClick={() => openFulfillmentPanel({ initialMode: 'pickup', initialStoreId: store.id })}
                className="flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-pj-basil px-4 text-[15px] font-bold text-pj-dough transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97]">
                {t(closed ? 'locales.schedule' : 'locales.order', { name: shortStoreName(store.name) })}
            </button>
        </article>
    );
}

function LocalesSkeleton(): ReactElement {
    return (
        <>
            {[0, 1, 2, 3].map((i) => (
                <div
                    key={i}
                    aria-hidden="true"
                    data-testid="pj-locales-skeleton"
                    className="h-[132px] animate-pulse rounded-pj-card bg-pj-dough-deep"
                />
            ))}
        </>
    );
}
