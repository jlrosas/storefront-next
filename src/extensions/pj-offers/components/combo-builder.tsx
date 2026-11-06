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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import type { BasketActionResponse } from '@/routes/types/action-responses';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import { useNavigate } from '@/hooks/use-navigate';
import { showComboAddedToast } from '../lib/combo-toast';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { formatClp, formatCount } from '@/extensions/pj-shared/lib/format';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { shippingFor, type Fulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import {
    buildChoices,
    filledCount,
    initialState,
    missingCount,
    selectOption,
    selectSlot,
    type ComboState,
    type PizzaOption,
} from '../lib/combo';
import {
    PJ_FULFILLMENT_EVENTS,
    changeFulfillment,
    readFulfillmentFromDocument,
    requestFulfillmentPanel,
} from '../lib/hooks-fulfillment';
import { FALLBACK_DELIVERY_ADDRESS, NEAREST_PICKUP_STORE } from '../lib/mock';
import { imageAt, imageSrcSet, type Offer, withUtm } from '../lib/offers';
import { useFulfillment } from '../lib/use-fulfillment';

export const COMBO_ADD_ACTION = '/action/pj-combo-add';

export interface ComboBuilderProps {
    offer: Offer;
    /** Pizzas elegibles (fotos, texto que se saborea y variante por tamaño). */
    options: PizzaOption[];
    fulfillment: Fulfillment | null;
    /** `?…utm_*` de la URL: se conserva en los enlaces que salen de aquí. */
    search: string;
}

function CheckIcon({ className }: { className?: string }): ReactElement {
    return (
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={className}>
            <path d="m5 12 5 5 9-10" />
        </svg>
    );
}

/**
 * Constructor de combos (Combo.dc.html y Combo-Trio.dc.html, más el caso 2 de Combo-NoDisponible):
 * casillas arriba, grilla de especialidades que salta a la siguiente casilla vacía, precio fijo
 * siempre visible y un botón que dice lo que falta.
 */
export function ComboBuilder({
    offer,
    options,
    fulfillment: initialFulfillment,
    search,
}: ComboBuilderProps): ReactElement {
    const { t } = useTranslation('extPjOffers');
    const fetcher = useFetcher<BasketActionResponse>();
    const navigate = useNavigate();
    const fulfillment = useFulfillment(initialFulfillment);
    const [state, setState] = useState<ComboState>(() => initialState(offer.slots));
    const [waitingForStore, setWaitingForStore] = useState(false);
    const [switchedToPickup, setSwitchedToPickup] = useState(false);
    const lastHandled = useRef<unknown>(null);

    const total = offer.slots.length;
    const optionById = useMemo(() => Object.fromEntries(options.map((o) => [o.id, o])), [options]);
    const missing = missingCount(state.selection);
    const complete = missing === 0;
    const blocked = offer.pickupOnly && fulfillment?.mode === 'delivery';
    const switched = offer.pickupOnly && switchedToPickup && fulfillment?.mode === 'pickup';
    const sending = fetcher.state !== 'idle';
    const activeSlot = offer.slots[state.active];
    const activeChoice = state.selection[state.active];
    const activeOptions = (activeSlot?.choices ?? []).map((id) => optionById[id]).filter((o): o is PizzaOption => !!o);
    const subtitle = t('builder.subtitle', { count: total });
    const address = fulfillment?.address ?? FALLBACK_DELIVERY_ADDRESS;

    const submit = useCallback(() => {
        const choices = buildChoices(offer.slots, state.selection, optionById);
        if (!choices) return;
        void fetcher.submit(
            { productId: offer.id, choices: JSON.stringify(choices) },
            { method: 'POST', action: COMBO_ADD_ACTION }
        );
    }, [fetcher, offer.id, offer.slots, optionById, state.selection]);

    // Gancho con TIE: espera a que el cliente elija tienda y retoma el agregado.
    useEffect(() => {
        if (!waitingForStore) return undefined;
        const onChanged = () => {
            setWaitingForStore(false);
            submit();
        };
        const onDismissed = () => setWaitingForStore(false);
        window.addEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
        window.addEventListener(PJ_FULFILLMENT_EVENTS.dismissed, onDismissed);
        return () => {
            window.removeEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
            window.removeEventListener(PJ_FULFILLMENT_EVENTS.dismissed, onDismissed);
        };
    }, [waitingForStore, submit]);

    // Resultado del agregado.
    useEffect(() => {
        if (fetcher.state !== 'idle' || !fetcher.data || lastHandled.current === fetcher.data) return;
        lastHandled.current = fetcher.data;
        if (fetcher.data.success) {
            const points = pointsFor(offer.price, shippingFor(readFulfillmentFromDocument()));
            showComboAddedToast({
                title: t('toast.added', { name: offer.name }),
                points: points > 0 ? t('toast.points', { points: formatCount(points) }) : undefined,
                viewLabel: t('toast.view'),
                onView: () => void navigate(PJ_ROUTES.cart),
            });
        }
    }, [fetcher.state, fetcher.data, offer.name, offer.price, navigate, t]);

    const onAdd = () => {
        if (!complete || blocked || sending || waitingForStore) return;
        if (!readFulfillmentFromDocument() && requestFulfillmentPanel()) {
            setWaitingForStore(true);
            return;
        }
        submit();
    };

    const onPickup = () => {
        changeFulfillment({ mode: 'pickup', storeId: NEAREST_PICKUP_STORE.id, when: 'asap' });
        setSwitchedToPickup(true);
    };

    const failed = fetcher.state === 'idle' && fetcher.data && !fetcher.data.success;
    let buttonLabel: string;
    if (blocked) buttonLabel = t('unavailable.addDisabled');
    else if (!complete) buttonLabel = t('builder.missing', { count: missing });
    else if (sending) buttonLabel = t('builder.adding');
    else if (waitingForStore) buttonLabel = t('builder.waitingStore');
    else buttonLabel = t('builder.add', { name: offer.name });
    const buttonEnabled = complete && !blocked && !sending && !waitingForStore;

    return (
        <div
            data-pj-combo-builder
            data-testid="pj-combo-builder"
            className="mx-auto -mt-8 flex max-w-[880px] flex-col bg-pj-cream">
            {/* El constructor tiene su propia barra de acción abajo: no lleva barra inferior (como Combo.dc.html). */}
            <style>{'body:has([data-pj-combo-builder]) [data-testid="pj-bottom-nav"]{display:none}'}</style>

            <header className="sticky top-16 z-30 flex flex-col gap-2.5 border-b border-pj-line bg-pj-surface px-2 pt-2 pb-3 lg:top-[72px]">
                <div className="flex items-center gap-2">
                    <Link
                        to={withUtm(PJ_ROUTES.promos, search)}
                        aria-label={t('builder.back')}
                        className="flex size-[44px] items-center justify-center rounded-full text-pj-ink focus-visible:outline-2 focus-visible:outline-pj-green">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-[26px] leading-none">{t('builder.title', { name: offer.name })}</h1>
                        <div
                            className="flex flex-wrap items-baseline gap-x-2 text-[13px] text-pj-gray"
                            data-testid="pj-combo-price">
                            <span>{subtitle}</span>
                            <PriceTag
                                variant="display"
                                size="sm"
                                price={offer.price}
                                listPrice={offer.priceBefore}
                                showSavings={false}
                            />
                        </div>
                    </div>
                    <p
                        className="pr-2 text-[13px] font-bold text-pj-green"
                        aria-live="polite"
                        data-testid="pj-combo-progress">
                        {t('builder.progress', { filled: filledCount(state.selection), total })}
                    </p>
                </div>
                <div
                    role="group"
                    aria-label={t('builder.slotsLabel')}
                    className="grid gap-2 px-2"
                    style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}>
                    {offer.slots.map((slot, index) => {
                        const chosen = state.selection[index];
                        const option = chosen ? optionById[chosen] : null;
                        const active = index === state.active;
                        const label =
                            total > 1 ? t('builder.slotLabel', { n: index + 1, total }) : t('builder.slotLabelSingle');
                        return (
                            <button
                                key={slot.id}
                                type="button"
                                aria-pressed={active}
                                aria-label={`${label}: ${option?.name ?? t('builder.slotEmpty')}`}
                                data-testid={`pj-combo-slot-${index + 1}`}
                                data-filled={option ? 'true' : 'false'}
                                onClick={() => setState((s) => selectSlot(s, index))}
                                className={cn(
                                    'flex min-h-[56px] min-w-0 items-center gap-2 rounded-xl border-2 p-1.5 text-left text-pj-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                                    active ? 'border-pj-green bg-pj-lime-soft' : 'border-pj-line bg-pj-surface'
                                )}>
                                {option?.image ? (
                                    <FoodImage
                                        src={imageAt(option.image, 96) ?? ''}
                                        alt=""
                                        bleed
                                        crop="macro"
                                        className="size-[40px] shrink-0 rounded-full"
                                    />
                                ) : (
                                    <span
                                        aria-hidden="true"
                                        className="size-[40px] shrink-0 rounded-full border-2 border-dashed border-pj-input-line"
                                    />
                                )}
                                <span className="flex min-w-0 flex-col">
                                    <span className="text-xs text-pj-gray" aria-hidden="true">
                                        {label}
                                    </span>
                                    <span className="truncate text-sm font-bold" aria-hidden="true">
                                        {option?.name ?? t('builder.slotEmpty')}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </header>

            <div className="flex flex-col gap-2.5 px-4 pt-3.5 pb-4">
                {blocked && (
                    <section
                        role="alert"
                        data-testid="pj-combo-unavailable"
                        className="flex flex-col gap-2.5 rounded-[14px] border-[1.5px] border-pj-dough-line bg-pj-dough-deep px-3.5 py-3">
                        <span className="text-sm leading-snug text-pj-gray-strong">
                            <strong className="text-pj-sauce">{t('unavailable.title')}</strong>{' '}
                            {fulfillment?.address ? t('unavailable.body', { address }) : t('unavailable.bodyNoAddress')}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={onPickup}
                                className="min-h-[48px] rounded-xl bg-pj-green px-2 text-sm leading-tight font-bold text-pj-surface hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                                {t('unavailable.pickup', { store: NEAREST_PICKUP_STORE.name })}
                                <br />
                                <span className="text-xs font-medium">
                                    {t('unavailable.pickupDetail', {
                                        km: String(NEAREST_PICKUP_STORE.distanceKm).replace('.', ','),
                                        minutes: NEAREST_PICKUP_STORE.pickupMinutes,
                                    })}
                                </span>
                            </button>
                            <Link
                                to={withUtm(PJ_ROUTES.promos, search)}
                                className="flex min-h-[48px] flex-col items-center justify-center rounded-xl border-[1.5px] border-pj-green px-2 text-center text-sm leading-tight font-bold text-pj-green no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                                {t('unavailable.seeDelivery')}
                                <span className="text-xs font-medium">{t('unavailable.seeDeliveryDetail')}</span>
                            </Link>
                        </div>
                    </section>
                )}
                {switched && (
                    <div
                        role="status"
                        data-testid="pj-combo-switched"
                        className="rounded-xl bg-pj-lime-soft px-3 py-2.5 text-sm font-semibold text-pj-green-dark">
                        {t('unavailable.switched', {
                            store: NEAREST_PICKUP_STORE.name,
                            address: NEAREST_PICKUP_STORE.address,
                        })}
                    </div>
                )}

                <h2 className="font-sans text-[15px] font-bold normal-case tracking-normal" aria-live="polite">
                    {activeChoice
                        ? t('builder.promptChange', { n: state.active + 1 })
                        : t('builder.prompt', { n: state.active + 1 })}
                </h2>
                <div
                    role="group"
                    aria-label={t('builder.optionsLabel')}
                    className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
                    {activeOptions.map((option) => {
                        const on = option.id === activeChoice;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                aria-pressed={on}
                                data-testid={`pj-combo-option-${option.id}`}
                                onClick={() => setState((s) => selectOption(s, option.id))}
                                className={cn(
                                    'relative flex flex-col overflow-hidden rounded-[14px] border-[3px] bg-pj-surface p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                                    on ? 'border-pj-green' : 'border-transparent shadow-pj-card'
                                )}>
                                <FoodImage
                                    src={option.image ?? ''}
                                    srcSet={imageSrcSet(option.image, [320, 640])}
                                    sizes="(min-width: 1024px) 280px, 50vw"
                                    alt=""
                                    bleed
                                    crop="macro"
                                    className="h-[110px]"
                                />
                                {on && (
                                    <span className="absolute top-1.5 right-1.5 flex size-[24px] items-center justify-center rounded-full bg-pj-green text-pj-surface">
                                        <CheckIcon />
                                    </span>
                                )}
                                <span className="flex flex-col gap-0.5 px-2.5 pt-2 pb-2.5">
                                    <span className="text-[15px] font-bold">{option.name}</span>
                                    <span className="text-xs leading-snug text-pj-gray-strong">{option.taste}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
                {failed && (
                    <p role="alert" className="rounded-xl bg-pj-garlic px-3 py-2.5 text-sm font-semibold text-pj-sale">
                        {t('builder.addError')}
                    </p>
                )}
            </div>

            <footer className="sticky bottom-0 z-30 border-t border-pj-line bg-pj-surface px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                <button
                    type="button"
                    aria-disabled={!buttonEnabled}
                    onClick={onAdd}
                    data-testid="pj-combo-add"
                    className={cn(
                        'flex h-[54px] w-full items-center justify-center rounded-full px-[22px] text-base font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                        buttonEnabled
                            ? 'bg-pj-green text-pj-surface hover:bg-pj-green-dark lg:text-[17px]'
                            : 'cursor-not-allowed bg-pj-dough-deep text-pj-gray'
                    )}>
                    <span>{buttonLabel}</span>
                    {buttonEnabled && <span>{` · ${formatClp(offer.price)}`}</span>}
                </button>
            </footer>
        </div>
    );
}

export default ComboBuilder;
