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
import { LtoBadge } from '@/extensions/pj-shared/components/lto-badge';
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
import { discountPercent, imageAt, imageSrcSet, type Offer, withUtm } from '../lib/offers';
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

function PlusIcon({ className }: { className?: string }): ReactElement {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden="true"
            className={className}>
            <path d="M12 5v14M5 12h14" />
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
    // F4: tras agregar, el botón pasa a «Ver mi pedido» (un segundo toque no agrega otra vez).
    const [added, setAdded] = useState(false);
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
            setAdded(true);
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
        if (added) {
            void navigate(PJ_ROUTES.cart);
            return;
        }
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
    if (added) buttonLabel = t('builder.viewOrder');
    else if (blocked) buttonLabel = t('unavailable.addDisabled');
    else if (!complete) buttonLabel = t('builder.missing', { count: missing });
    else if (sending) buttonLabel = t('builder.adding');
    else if (waitingForStore) buttonLabel = t('builder.waitingStore');
    else buttonLabel = t('builder.add', { name: offer.name });
    const buttonEnabled = added || (complete && !blocked && !sending && !waitingForStore);

    const percent = discountPercent(offer);

    return (
        <div
            data-pj-combo-builder
            data-testid="pj-combo-builder"
            className="mx-auto -mt-8 flex w-full max-w-[1240px] flex-col bg-pj-cream pb-[calc(84px+env(safe-area-inset-bottom))] lg:mt-0 lg:grid lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)] lg:items-start lg:gap-8 lg:bg-transparent lg:px-6 lg:pt-2 lg:pb-14">
            {/* El constructor tiene su propia barra de acción abajo: no lleva barra inferior (como Combo.dc.html). */}
            <style>{`@media (prefers-reduced-motion: no-preference){@keyframes pj-pop{0%{transform:scale(.8)}60%{transform:scale(1.12)}100%{transform:scale(1)}}@keyframes pj-beat{0%,100%{transform:scale(1)}40%{transform:scale(1.04)}}[data-pj-pop]{animation:pj-pop 300ms ease-out}[data-pj-beat]{animation:pj-beat 600ms ease-out 1}}body:has([data-pj-combo-builder]) [data-testid="pj-bottom-nav"]{display:none}`}</style>

            {/* OFE-06 (UX-2 N4): en móvil, cabecera fija arriba; en escritorio, columna izquierda *sticky* con
                las ranuras grandes, el sello, el precio display y el botón. */}
            <aside className="sticky top-16 z-30 flex flex-col gap-2.5 border-b border-pj-line bg-pj-surface px-2 pt-2 pb-3 lg:top-[96px] lg:gap-5 lg:rounded-pj-section lg:border-0 lg:p-6 lg:shadow-pj-float">
                <div className="flex items-center gap-2 lg:items-start">
                    <Link
                        to={withUtm(PJ_ROUTES.promos, search)}
                        aria-label={t('builder.back')}
                        className="flex size-[44px] shrink-0 items-center justify-center rounded-full text-pj-ink focus-visible:outline-2 focus-visible:outline-pj-green lg:-ml-2">
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
                        <h1 className="text-[26px] leading-none lg:text-[44px] lg:leading-[0.9]">
                            {t('builder.title', { name: offer.name })}
                        </h1>
                        <div
                            className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-pj-gray lg:mt-2 lg:text-sm"
                            data-testid="pj-combo-price">
                            <span className="basis-full">{subtitle}</span>
                            <PriceTag
                                variant="display"
                                size="md"
                                price={offer.price}
                                listPrice={offer.priceBefore}
                                showSavings={false}
                            />
                            {percent > 0 && (
                                <LtoBadge
                                    size="sm"
                                    className="hidden lg:inline-grid lg:size-14 lg:text-[19px]"
                                    label={t('builder.offLabel', { percent })}>
                                    {t('card.off', { percent })}
                                </LtoBadge>
                            )}
                        </div>
                    </div>
                    <p
                        className="self-start pt-1 pr-2 text-[13px] font-bold text-pj-green lg:pt-3 lg:pr-0 lg:text-sm"
                        aria-live="polite"
                        data-testid="pj-combo-progress">
                        {t('builder.progress', { filled: filledCount(state.selection), total })}
                    </p>
                </div>
                <div
                    role="group"
                    aria-label={t('builder.slotsLabel')}
                    className="grid gap-2 px-2 lg:gap-3 lg:px-0"
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
                                onClick={() => {
                                    setState((s) => selectSlot(s, index));
                                }}
                                className={cn(
                                    'flex min-h-[56px] min-w-0 items-center gap-2 rounded-xl border-2 p-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:flex-col lg:items-stretch lg:gap-2.5 lg:rounded-[20px] lg:p-2.5 lg:pb-3 lg:text-center',
                                    // N7: el seleccionado es Basil relleno + Dough en todo el sitio (no lima).
                                    active
                                        ? 'border-pj-basil bg-pj-basil text-pj-dough [--pj-heading-color:var(--pj-dough)]'
                                        : 'border-pj-line bg-pj-surface text-pj-ink'
                                )}>
                                {option?.image ? (
                                    <span
                                        key={option.id}
                                        data-pj-pop
                                        className="relative size-[40px] shrink-0 lg:aspect-square lg:size-auto lg:w-full">
                                        <FoodImage
                                            src={imageAt(option.image, 520) ?? ''}
                                            srcSet={imageSrcSet(option.image, [96, 320, 520])}
                                            sizes="(min-width: 1024px) 240px, 40px"
                                            alt=""
                                            bleed
                                            crop="macro"
                                            className="size-full rounded-full shadow-pj-card"
                                        />
                                        <span className="absolute -right-1 -bottom-1 flex size-4 items-center justify-center rounded-full bg-pj-basil text-pj-dough ring-2 ring-pj-dough lg:right-[6%] lg:bottom-[6%] lg:size-9">
                                            <CheckIcon className="size-2.5 lg:size-5" />
                                        </span>
                                    </span>
                                ) : (
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'flex size-[40px] shrink-0 items-center justify-center rounded-full border-2 border-dashed lg:aspect-square lg:size-auto lg:w-full lg:border-[3px]',
                                            active ? 'border-pj-dough/80' : 'border-pj-input-line'
                                        )}>
                                        <PlusIcon className="hidden size-12 lg:block" />
                                    </span>
                                )}
                                <span className="flex min-w-0 flex-col">
                                    <span
                                        className={cn(
                                            'text-xs lg:text-[13px]',
                                            active ? 'text-pj-dough' : 'text-pj-gray'
                                        )}
                                        aria-hidden="true">
                                        {label}
                                    </span>
                                    <span
                                        className="truncate text-sm font-bold lg:pj-card-title lg:whitespace-normal"
                                        aria-hidden="true">
                                        {option?.name ?? t('builder.slotEmpty')}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="fixed inset-x-0 bottom-0 z-30 border-t border-pj-line bg-pj-surface px-4 pt-3 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:static lg:border-0 lg:bg-transparent lg:p-0">
                    <button
                        type="button"
                        key={buttonEnabled && !added ? 'ready' : 'idle'}
                        data-pj-beat={buttonEnabled && !added && total > 1 ? '' : undefined}
                        aria-disabled={!buttonEnabled}
                        onClick={onAdd}
                        data-testid="pj-combo-add"
                        className={cn(
                            'flex h-[54px] w-full items-center justify-center rounded-full border-2 px-[22px] text-base font-bold transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green active:scale-[0.97] lg:h-[60px] lg:text-[17px]',
                            // N4: incompleto en contorno Basil que dice lo que falta, nunca gris mudo.
                            buttonEnabled
                                ? 'border-pj-basil bg-pj-basil text-pj-dough hover:border-pj-green-dark hover:bg-pj-green-dark'
                                : 'cursor-not-allowed border-pj-basil bg-pj-surface text-pj-basil'
                        )}>
                        <span>
                            {buttonEnabled && !added ? `${buttonLabel} · ${formatClp(offer.price)}` : buttonLabel}
                        </span>
                    </button>
                </div>
            </aside>

            <div className="flex flex-col gap-2.5 px-4 pt-3.5 pb-4 lg:gap-4 lg:px-0 lg:pt-0">
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
                        className="rounded-xl bg-pj-garlic px-3 py-2.5 text-sm font-semibold text-pj-sauce">
                        {t('unavailable.switched', {
                            store: NEAREST_PICKUP_STORE.name,
                            address: NEAREST_PICKUP_STORE.address,
                        })}
                    </div>
                )}

                <h2 className="pj-card-title lg:text-[32px]" aria-live="polite">
                    {activeChoice
                        ? t('builder.promptChange', { n: state.active + 1 })
                        : t('builder.prompt', { n: state.active + 1 })}
                </h2>
                <div
                    role="group"
                    aria-label={t('builder.optionsLabel')}
                    className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5">
                    {activeOptions.map((option) => {
                        const on = option.id === activeChoice;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                aria-pressed={on}
                                data-testid={`pj-combo-option-${option.id}`}
                                onClick={() => {
                                    setAdded(false);
                                    setState((s) => selectOption(s, option.id));
                                }}
                                className={cn(
                                    'group relative flex flex-col overflow-hidden rounded-pj-card border-[3px] p-0 text-left shadow-pj-card transition-shadow hover:shadow-pj-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:rounded-[20px]',
                                    on ? 'border-pj-basil bg-pj-basil' : 'border-transparent bg-pj-surface'
                                )}>
                                {/* Patrón de la FoodCard de HOM: foto 4:3 en recorte macro y zoom suave al pasar el cursor. */}
                                <FoodImage
                                    src={imageAt(option.image, 480) ?? ''}
                                    srcSet={imageSrcSet(option.image, [320, 480, 640, 900])}
                                    sizes="(min-width: 1024px) 30vw, 50vw"
                                    alt=""
                                    aspect="4/3"
                                    bleed
                                    crop="macro"
                                    imgClassName="transition-transform duration-500 ease-out motion-reduce:transition-none lg:group-hover:[transform:scale(1.05)]"
                                />
                                {on && (
                                    <span className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-pj-basil text-pj-dough ring-2 ring-pj-dough lg:top-3 lg:right-3 lg:size-10">
                                        <CheckIcon className="size-4 lg:size-5" />
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        'flex flex-1 flex-col gap-1 px-3 pt-2.5 pb-3 lg:gap-1.5 lg:px-[18px] lg:pt-4 lg:pb-5',
                                        on && 'surface-basil'
                                    )}>
                                    <span className="pj-card-title">{option.name}</span>
                                    <span
                                        className={cn(
                                            'line-clamp-3 text-[13px] leading-snug lg:text-sm',
                                            on ? 'text-pj-dough' : 'text-pj-gray-strong'
                                        )}>
                                        {option.taste}
                                    </span>
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
        </div>
    );
}

export default ComboBuilder;
