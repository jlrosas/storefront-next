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
import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { cn } from '@/lib/utils';
import { DEFAULT_CENTER, useStoresNear, type Coordinates } from '../hooks/use-stores-near';
import { openFulfillmentPanel, useFulfillment } from '../lib/fulfillment-store';
import { groupLocales } from '../lib/locales-groups';
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
import { SantiagoMap } from './santiago-map';

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil';

function openStore(store: PjStore): void {
    openFulfillmentPanel({
        initialMode: 'pickup',
        initialStoreId: store.id,
        initialWhen: isStoreClosed(store) ? 'scheduled' : 'asap',
    });
}

/**
 * Página «Locales» (UX-2 N5): que se vea como Uber Eats o Rappi y no como un listado.
 *
 * - Un solo botón relleno: el de «Tu tienda» (Garlic + Basil) o, si no hay, el de la más cercana.
 *   El resto lleva «Elegir» en contorno.
 * - «Cerca de ti» (las 3 primeras, con el tiempo de retiro) y «Todas las tiendas» colapsado. El dato
 *   de tiempo casi siempre es 15 min, así que solo se muestra en «Cerca de ti» (ahí sí varía).
 * - Desde `lg`, la lista a la izquierda y un mapa estático de Santiago con pines Basil a la derecha
 *   (`SantiagoMap`, supuesto de demo: sin API de mapas). En móvil, una franja del mismo mapa.
 * - *Skeleton* mientras llega la respuesta (nunca «no hay tiendas» antes). `?modo=delivery` abre el
 *   panel en delivery.
 */
export default function LocalesPage(): ReactElement {
    const { t } = useTranslation('extPjStore');
    const [params] = useSearchParams();
    const [center, setCenter] = useState<Coordinates>(DEFAULT_CENTER);
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const { stores, loading, error } = useStoresNear(center);
    const { fulfillment } = useFulfillment();
    const groups = useMemo(() => groupLocales(stores, fulfillment?.storeId), [stores, fulfillment?.storeId]);
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

    const showSkeleton = loading && stores.length === 0 && !error;
    const cardProps = (store: PjStore) => ({
        store,
        featured: store === groups.featured,
        mine: store === groups.featured && groups.featuredIsMine,
        onActive: setActiveId,
    });

    return (
        <section
            aria-labelledby="pj-locales-heading"
            className="mx-auto w-full max-w-[1240px] px-4 pt-5 pb-10 lg:grid lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:items-start lg:gap-8 lg:px-6 lg:pt-10">
            <div className="flex min-w-0 flex-col">
                <h1 id="pj-locales-heading" className="pj-h1">
                    {t('locales.title')}
                </h1>
                <p className="pj-body mt-1 text-pj-gray">{t('locales.subtitle')}</p>
                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        onClick={useMyLocation}
                        disabled={locating}
                        className={cn(
                            'flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border-[1.5px] border-pj-basil bg-pj-surface px-4 text-[15px] font-bold whitespace-nowrap text-pj-basil transition-transform active:scale-[0.97] disabled:opacity-60 sm:flex-none',
                            focusRing
                        )}>
                        <LocateIcon />
                        {locating ? (
                            t('pickup.locating')
                        ) : (
                            <>
                                <span className="sm:hidden">{t('locales.locateShort')}</span>
                                <span className="hidden sm:inline">{t('pickup.useLocation')}</span>
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => openFulfillmentPanel({ initialMode: 'delivery' })}
                        className={cn(
                            'flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full border-[1.5px] border-pj-basil bg-pj-surface px-4 text-[15px] font-bold whitespace-nowrap text-pj-basil transition-transform active:scale-[0.97] sm:flex-none',
                            focusRing
                        )}>
                        <BikeIcon />
                        <span className="sm:hidden">{t('locales.deliveryShort')}</span>
                        <span className="hidden sm:inline">{t('locales.delivery')}</span>
                    </button>
                </div>
                {locationError && (
                    <p role="alert" className="mt-2 text-sm text-pj-sale">
                        {t('pickup.locationError')}
                    </p>
                )}

                {/* Franja de mapa en móvil: le da contexto de lugar sin empujar la lista. */}
                <SantiagoMap
                    stores={stores}
                    featuredId={groups.featured?.id}
                    activeId={activeId}
                    center={center}
                    band
                    className="-mx-4 mt-4 h-[176px] lg:hidden"
                />

                <div className="mt-5 flex flex-col gap-6" aria-busy={loading}>
                    {showSkeleton && <LocalesSkeleton />}

                    {groups.pinned && (
                        <Group title={t('locales.yourStore')}>
                            <LocalCard {...cardProps(groups.pinned)} showTime />
                        </Group>
                    )}

                    {groups.near.length > 0 && (
                        <Group title={t('locales.near')}>
                            {groups.near.map((store) => (
                                <LocalCard key={store.id} {...cardProps(store)} showTime />
                            ))}
                        </Group>
                    )}

                    {groups.rest.length > 0 && <AllStores stores={groups.rest} renderCard={cardProps} />}
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
            </div>

            {/* Escritorio: mapa fijo a la derecha (UX-2 N5). */}
            <div className="sticky top-[96px] hidden lg:block">
                <SantiagoMap
                    stores={stores}
                    featuredId={groups.featured?.id}
                    activeId={activeId}
                    center={center}
                    className="h-[calc(100dvh-136px)] max-h-[720px] min-h-[480px] rounded-pj-section shadow-pj-card"
                />
                {stores.length > 0 && (
                    <p className="pj-small mt-2 text-pj-gray">{t('locales.mapNote', { count: stores.length })}</p>
                )}
            </div>
        </section>
    );
}

function Group({ title, children }: { title: string; children: ReactNode }): ReactElement {
    const id = useId();
    return (
        <section aria-labelledby={id} className="flex flex-col gap-2.5">
            <h2 id={id} className="pj-micro text-pj-gray-strong">
                {title}
            </h2>
            {children}
        </section>
    );
}

function AllStores({
    stores,
    renderCard,
}: {
    stores: PjStore[];
    renderCard: (store: PjStore) => {
        store: PjStore;
        featured: boolean;
        mine: boolean;
        onActive: (id: string | null) => void;
    };
}): ReactElement {
    const { t } = useTranslation('extPjStore');
    const [open, setOpen] = useState(false);
    const listId = useId();
    return (
        <section className="flex flex-col gap-2.5">
            <div>
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={listId}
                    onClick={() => setOpen((v) => !v)}
                    data-testid="pj-locales-all-toggle"
                    className={cn(
                        'flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-pj-card bg-pj-surface px-4 text-left shadow-pj-card',
                        focusRing
                    )}>
                    <span className="flex flex-col">
                        <span className="pj-micro text-pj-gray-strong">{t('locales.all')}</span>
                        <span className="text-[15px] font-bold text-pj-basil">
                            {t('locales.allCount', { count: stores.length })}
                        </span>
                    </span>
                    <svg
                        aria-hidden="true"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn('shrink-0 text-pj-basil transition-transform', open && 'rotate-180')}>
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>
            </div>
            <div id={listId} hidden={!open} className="flex flex-col gap-2.5">
                {open && stores.map((store) => <LocalCard key={store.id} {...renderCard(store)} />)}
            </div>
        </section>
    );
}

function LocalCard({
    store,
    featured,
    mine,
    showTime = false,
    onActive,
}: {
    store: PjStore;
    featured: boolean;
    mine: boolean;
    showTime?: boolean;
    onActive: (id: string | null) => void;
}): ReactElement {
    const { t } = useTranslation('extPjStore');
    const closed = isStoreClosed(store);
    const name = shortStoreName(store.name);
    const status = closed
        ? t(nextOpening(store).tomorrow ? 'pickup.closedTomorrow' : 'pickup.closed', { time: opensAt(store) })
        : t('pickup.open', { time: openUntil(store) });
    // Sin coma final: «Tobalaba 201, Las Condes».
    const address = [store.address1, store.city]
        .map((part) => part?.trim().replace(/[,\s]+$/, ''))
        .filter(Boolean)
        .join(', ');
    const meta = [address, formatKm(store.distance)].filter(Boolean).join(' · ');
    // Al pasar por el botón de la tienda (o enfocarlo), su pin crece en el mapa.
    const hover = {
        onMouseEnter: () => onActive(store.id),
        onMouseLeave: () => onActive(null),
        onFocus: () => onActive(store.id),
        onBlur: () => onActive(null),
    };
    const time = closed ? t('pickup.onlyScheduled') : t('locales.minutes', { minutes: pickupMinutes(store) });

    return (
        <article
            data-testid={`pj-local-${store.id}`}
            data-featured={featured || undefined}
            className={cn(
                'flex flex-col gap-3 rounded-pj-card bg-pj-surface p-4 shadow-pj-card',
                mine && 'ring-2 ring-pj-basil'
            )}>
            <div className="flex items-start gap-3">
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    {featured && (
                        <span
                            data-testid={mine ? 'pj-local-mine' : 'pj-local-nearest'}
                            className={cn(
                                'pj-micro mb-1 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-pj-basil',
                                mine ? 'bg-pj-garlic' : 'bg-pj-dough-deep'
                            )}>
                            <PinIcon />
                            {mine ? t('locales.yourStoreBadge') : t('locales.nearestBadge')}
                        </span>
                    )}
                    <h3 className="pj-card-title">{name}</h3>
                    <p className="text-[13px] text-pj-gray">{meta}</p>
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
                <div className="flex shrink-0 flex-col items-end gap-2">
                    {showTime && (
                        <span
                            data-testid="pj-local-time"
                            className={cn(
                                'rounded-full px-2.5 py-1 text-[13px] font-bold whitespace-nowrap',
                                closed ? 'bg-pj-dough-deep text-pj-sauce' : 'bg-pj-dough-deep text-pj-basil'
                            )}>
                            {time}
                        </span>
                    )}
                    {!featured && (
                        <button
                            type="button"
                            onClick={() => openStore(store)}
                            {...hover}
                            aria-label={t(closed ? 'locales.schedule' : 'locales.chooseAria', { name })}
                            className={cn(
                                'flex min-h-11 min-w-[96px] cursor-pointer items-center justify-center rounded-full border-[1.5px] border-pj-basil bg-pj-surface px-4 text-[15px] font-bold text-pj-basil transition-transform active:scale-[0.97]',
                                focusRing
                            )}>
                            {closed ? t('locales.scheduleShort') : t('locales.choose')}
                        </button>
                    )}
                </div>
            </div>
            {featured && (
                <button
                    type="button"
                    onClick={() => openStore(store)}
                    {...hover}
                    data-testid="pj-local-primary"
                    className={cn(
                        'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-pj-basil px-4 text-base font-bold text-pj-dough transition-transform active:scale-[0.97]',
                        focusRing
                    )}>
                    {t(closed ? 'locales.schedule' : 'locales.order', { name })}
                </button>
            )}
        </article>
    );
}

function LocalesSkeleton(): ReactElement {
    return (
        <div className="flex flex-col gap-2.5">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    aria-hidden="true"
                    data-testid="pj-locales-skeleton"
                    className="flex h-[118px] animate-pulse flex-col gap-2.5 rounded-pj-card bg-pj-surface p-4 shadow-pj-card">
                    <div className="h-6 w-2/5 rounded-pj-control bg-pj-line" />
                    <div className="h-3.5 w-3/4 rounded-pj-control bg-pj-line" />
                    <div className="h-3.5 w-1/3 rounded-pj-control bg-pj-line" />
                </div>
            ))}
        </div>
    );
}

function PinIcon(): ReactElement {
    return (
        <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
        </svg>
    );
}

function LocateIcon(): ReactElement {
    return (
        <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
    );
}

function BikeIcon(): ReactElement {
    return (
        <svg
            aria-hidden="true"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="5.5" cy="17.5" r="3.5" />
            <circle cx="18.5" cy="17.5" r="3.5" />
            <path d="M15 6h2l3 11.5M5.5 17.5 9 10h6l3.5 7.5M12 10l-2-4H8" />
        </svg>
    );
}
