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
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useStoresNear, DEFAULT_CENTER, type Coordinates } from '../hooks/use-stores-near';
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

interface PickupSectionProps {
    selectedId: string | null;
    onSelect: (store: PjStore) => void;
    /** Hay «Lo antes posible» elegido: una tienda cerrada no sirve. */
    asap: boolean;
    onProgram: () => void;
    /** Tienda que ya estaba guardada (para abrir el panel con ella marcada). */
    savedStoreId?: string;
}

const INITIAL_VISIBLE = 3;

/** Retiro: «Usar mi ubicación», buscador por comuna y las tiendas con distancia, estado y tiempo. */
export function PickupSection({
    selectedId,
    onSelect,
    asap,
    onProgram,
    savedStoreId,
}: PickupSectionProps): ReactElement {
    const { t } = useTranslation('extPjStore');
    const [center, setCenter] = useState<Coordinates>(DEFAULT_CENTER);
    const [query, setQuery] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const { stores, loading, error } = useStoresNear(center);

    // Preselecciona la tienda guardada o, si no hay, la más cercana que esté abierta.
    useEffect(() => {
        if (selectedId || stores.length === 0) return;
        const saved = savedStoreId ? stores.find((s) => s.id === savedStoreId) : undefined;
        const first = saved ?? stores.find((s) => !isStoreClosed(s)) ?? stores[0];
        onSelect(first);
    }, [selectedId, stores, savedStoreId, onSelect]);

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
                setQuery('');
                setCenter({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            },
            () => {
                setLocating(false);
                setLocationError(true);
            },
            { timeout: 10000 }
        );
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return stores;
        return stores.filter((s) =>
            `${shortStoreName(s.name)} ${s.city ?? ''} ${s.address1 ?? ''}`.toLowerCase().includes(q)
        );
    }, [stores, query]);
    // La tienda elegida siempre se ve, aunque quede fuera de las primeras.
    const visible = useMemo(() => {
        if (query.trim() || expanded) return filtered;
        const first = filtered.slice(0, INITIAL_VISIBLE);
        const selected = filtered.find((s) => s.id === selectedId);
        return selected && !first.includes(selected) ? [...first.slice(0, INITIAL_VISIBLE - 1), selected] : first;
    }, [filtered, query, expanded, selectedId]);

    const selected = stores.find((s) => s.id === selectedId) ?? null;
    const closedPicked = Boolean(selected && isStoreClosed(selected) && asap);
    const alertRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (closedPicked) alertRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [closedPicked]);
    const suggestion = useMemo(() => stores.find((s) => !isStoreClosed(s)) ?? null, [stores]);

    return (
        <div className="flex flex-col gap-2.5">
            <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border-[1.5px] border-pj-green bg-pj-surface text-[15px] font-bold text-pj-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green disabled:opacity-60">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    <circle cx="12" cy="12" r="6" />
                </svg>
                {locating ? t('pickup.locating') : t('pickup.useLocation')}
            </button>
            {locationError && (
                <p role="alert" className="text-sm text-pj-sale">
                    {t('pickup.locationError')}
                </p>
            )}
            <label htmlFor="pj-store-search" className="text-[13px] font-semibold text-pj-gray">
                {t('pickup.searchLabel')}
            </label>
            <input
                id="pj-store-search"
                type="search"
                value={query}
                placeholder={t('pickup.searchPlaceholder')}
                onChange={(e) => setQuery(e.target.value)}
                className="h-[46px] rounded-xl border-[1.5px] border-pj-input-line bg-pj-surface px-3.5 text-base text-pj-ink placeholder:text-pj-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green"
            />

            <div role="radiogroup" aria-label={t('pickup.listLabel')} className="flex flex-col gap-2.5">
                {loading && stores.length === 0 && <StoreSkeleton />}
                {visible.map((store) => (
                    <StoreOption
                        key={store.id}
                        store={store}
                        selected={store.id === selectedId}
                        onSelect={() => onSelect(store)}
                    />
                ))}
            </div>
            {closedPicked && selected && (
                <div
                    role="alert"
                    ref={alertRef}
                    className="flex flex-col gap-2.5 rounded-[14px] border-[1.5px] border-pj-dough-line bg-pj-dough-deep px-3.5 py-3">
                    <span className="text-sm leading-snug text-pj-gray-strong">
                        <strong className="text-pj-sauce">
                            {t('pickup.closedTitle', { name: shortStoreName(selected.name) })}
                        </strong>{' '}
                        {t(nextOpening(selected).tomorrow ? 'pickup.closedBodyTomorrow' : 'pickup.closedBody', {
                            time: opensAt(selected),
                        })}
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                        {suggestion && (
                            <button
                                type="button"
                                onClick={() => onSelect(suggestion)}
                                className="min-h-12 cursor-pointer rounded-xl bg-pj-green px-2 text-sm leading-tight font-bold text-pj-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                                {shortStoreName(suggestion.name)}
                                <br />
                                <span className="text-xs font-medium">
                                    {t('pickup.suggestNowSub', { minutes: pickupMinutes(suggestion) })}
                                </span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onProgram}
                            className="min-h-12 cursor-pointer rounded-xl border-[1.5px] border-pj-green bg-pj-surface px-2 text-sm leading-tight font-bold text-pj-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                            {t('pickup.suggestLater')}
                            <br />
                            <span className="text-xs font-medium">
                                {t(
                                    nextOpening(selected).tomorrow
                                        ? 'pickup.suggestLaterSubTomorrow'
                                        : 'pickup.suggestLaterSub',
                                    {
                                        time: opensAt(selected),
                                    }
                                )}
                            </span>
                        </button>
                    </div>
                </div>
            )}
            {error && (
                <p role="alert" className="text-sm text-pj-sale">
                    {t('pickup.loadError')}
                </p>
            )}
            {!loading && !error && filtered.length === 0 && (
                <p role="status" className="text-sm text-pj-gray">
                    {t('pickup.noResults')}
                </p>
            )}
            {!query.trim() && filtered.length > INITIAL_VISIBLE && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="min-h-11 cursor-pointer self-start rounded-lg px-1 text-[15px] font-bold text-pj-green underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                    {expanded ? t('pickup.showLess') : t('pickup.showMore')}
                </button>
            )}
        </div>
    );
}

function StoreOption({
    store,
    selected,
    onSelect,
}: {
    store: PjStore;
    selected: boolean;
    onSelect: () => void;
}): ReactElement {
    const { t } = useTranslation('extPjStore');
    const closed = isStoreClosed(store);
    const status = closed
        ? t(nextOpening(store).tomorrow ? 'pickup.closedTomorrow' : 'pickup.closed', { time: opensAt(store) })
        : t('pickup.open', { time: openUntil(store) });
    return (
        <button
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={onSelect}
            data-testid={`pj-store-${store.id}`}
            className={cn(
                'flex min-h-[44px] cursor-pointer items-center gap-3 rounded-pj-card p-3 text-left shadow-pj-card transition-colors',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil',
                selected ? 'bg-pj-basil text-pj-dough' : 'bg-pj-surface text-pj-ink',
                closed && !selected && 'opacity-80'
            )}>
            <span
                aria-hidden="true"
                className={cn(
                    'flex size-[22px] shrink-0 items-center justify-center rounded-full border-2',
                    selected ? 'border-pj-dough' : 'border-pj-input-line'
                )}>
                <span className={cn('size-3 rounded-full', selected ? 'bg-pj-dough' : 'bg-transparent')} />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-base font-bold">{shortStoreName(store.name)}</span>
                <span className={cn('text-[13px]', selected ? 'text-pj-dough' : 'text-pj-gray')}>
                    {[store.address1, formatKm(store.distance)].filter(Boolean).join(' · ')}
                </span>
                <span
                    className={cn(
                        'text-[13px] font-semibold',
                        selected ? 'text-pj-lime' : closed ? 'text-pj-sauce' : 'text-pj-basil'
                    )}>
                    {status}
                </span>
            </span>
            <span
                className={cn(
                    'text-right text-[13px] leading-tight font-bold whitespace-pre-line',
                    selected ? 'text-pj-lime' : 'text-pj-basil'
                )}>
                {closed ? t('pickup.onlyScheduled') : t('pickup.ready', { minutes: pickupMinutes(store) })}
            </span>
        </button>
    );
}

function StoreSkeleton(): ReactElement {
    return (
        <>
            {[0, 1, 2].map((i) => (
                <div key={i} className="h-[88px] animate-pulse rounded-pj-card bg-pj-dough-deep" aria-hidden="true" />
            ))}
        </>
    );
}
