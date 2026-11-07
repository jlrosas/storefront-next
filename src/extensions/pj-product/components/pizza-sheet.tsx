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
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { ShopperBasketsV2 } from '@/scapi';
import { useNavigate } from '@/hooks/use-navigate';
import { BottomSheet } from '@/extensions/pj-shared/components/bottom-sheet';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { LtoBadge } from '@/extensions/pj-shared/components/lto-badge';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import { productLto } from '../lib/lto';
import { Stars } from '@/extensions/pj-shared/components/stars';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { readFulfillmentFromDocument } from '@/extensions/pj-shared/lib/fulfillment';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { useShowAddedToast } from '@/extensions/pj-shared/lib/added-toast';
import type { PizzaSheetData } from '../routes/resource.pj-pizza';
import {
    MAX_QUANTITY,
    crustSurcharge,
    extraPriceForSize,
    defaultSelection,
    findVariant,
    normalizeSelection,
    optionItemsFor,
    selectionSummary,
    totalPrice,
    unitPrice,
    type PizzaConfig,
    type PizzaSelection,
} from '../lib/pizza';
import type { SheetUpsell } from '../lib/upsell';
import { linesTotal } from '../lib/cart-lines';
import { nextCrossSell, type CrossSellPlan } from '../lib/cross-sell';
import { COMBO_CRUSTS, COMBO_OPTION_ID, slotSurcharge, type ComboSlotPizza } from '../lib/combo-cart';
import { flyToCart } from '@/extensions/pj-shared/lib/fly-to-cart';
import { ensureFulfillment } from '../lib/fulfillment-request';
import { PRO_TOKENS } from '../lib/tokens';
import { usePjCart } from '../hooks/use-pj-cart';
import { PizzaConfigurator } from './pizza-configurator';
import { CompleteOrderStep } from './complete-order-step';
import { UpsellFooter, PJ_UPSELL_RESOURCE } from './upsell-sheet';
import { HalvesBuilder } from './halves-builder';
import { HALVES_PRODUCT_ID, type HalvesBuilderData } from '../lib/halves';
import { MinusIcon, PlusIcon } from './icons';
import { CloseIcon } from '@/extensions/pj-shared/components/icons';
import { useImageUrl } from '../hooks/use-image-url';
import { cn } from '@/lib/utils';
import { weeklyOrdersFor } from '../lib/weekly';

type Basket = ShopperBasketsV2.schemas['Basket'];

export interface PizzaSheetProps {
    /** Pizza a armar (maestro `pz-pollo-bbq` o una variante). */
    productId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Abre el armador mitad y mitad con esta pizza en la primera mitad (menú «½ Mitad»). */
    halfFirst?: boolean;
    /** Modo edición (PRO-05): línea del carrito a editar; «Guardar cambios» la actualiza sin crear otra. */
    itemId?: string;
    /** Tamaño marcado al abrir (el del selector del menú: `medium`, `family`, `extra_large`). */
    size?: string;
    /** Se llama después de agregar o guardar, con el carrito que devolvió SCAPI. */
    onSaved?: (result: { basket: Basket; itemIds: string[] }) => void;
    /**
     * Modo «ranura» del constructor de combos (S-D20): tamaño fijo, sin cantidad ni carrito. «Listo» devuelve la
     * pizza armada a la ranura con `onDone`.
     */
    slot?: { size: string; selection?: PizzaSelection | null; onDone: (pizza: ComboSlotPizza) => void };
    /**
     * Editar una pizza de un Super Dúo / Super Trío desde el carrito: tamaño fijo, masas del combo y la opción
     * `pjCombo` (`duo` / `trio`) se reenvía al guardar (§7.1).
     */
    lockedSize?: string;
    comboOption?: string;
}

type Step = 'configure' | 'upsell';

/**
 * La hoja trae su propio «Cerrar» sobre la foto (o «Volver» en mitades): la cabecera de `BottomSheet`
 * queda solo para el lector de pantalla y su botón sale del todo (VAL-MEN-05 H2: había un segundo
 * «Cerrar» de 1 px que recibía el foco inicial).
 */
const SHEET_OWN_CLOSE = '[&>div:nth-of-type(2)]:sr-only [&>div:nth-of-type(2)>button]:hidden';

/**
 * Hoja «Arma tu pizza» (Sheet-Pizza.dc.html, PRO-01) y su paso «Hazlo combo» (Complementa.dc.html,
 * PRO-02). Se monta desde el menú con `PizzaSheet` (carga diferida) y la usa CAR para editar una línea.
 */
export default function PizzaSheetContainer(props: PizzaSheetProps): ReactElement {
    if (props.halfFirst) {
        return <HalvesSheet {...props} />;
    }
    return <PizzaSheetBody {...props} />;
}

function HalvesSheet({ productId, open, onOpenChange, itemId, size, onSaved }: PizzaSheetProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const fetcher = useFetcher<HalvesBuilderData>();
    const { load } = fetcher;
    const params = new URLSearchParams();
    if (itemId) params.set('item', itemId);
    else if (productId && productId !== HALVES_PRODUCT_ID) params.set('primera', productId);
    if (size) params.set('size', size);
    const query = params.toString();
    useEffect(() => {
        if (open) void load(`/resource/pj-halves?${query}`);
    }, [open, query, load]);
    return (
        <BottomSheet
            open={open}
            onOpenChange={onOpenChange}
            title={t('halves.title')}
            hideTitle
            className={cn(SHEET_OWN_CLOSE, '[&>div:nth-of-type(3)]:pb-0')}>
            <div className="-mx-4 lg:-mx-6" style={PRO_TOKENS}>
                {fetcher.data ? (
                    <HalvesBuilder
                        data={fetcher.data}
                        layout="sheet"
                        onClose={() => onOpenChange(false)}
                        onSaved={(result) => onSaved?.(result)}
                    />
                ) : (
                    <div className="h-[600px] animate-pulse bg-pj-sand" aria-hidden="true" />
                )}
            </div>
        </BottomSheet>
    );
}

function PizzaSheetBody({
    productId,
    open,
    onOpenChange,
    itemId,
    size: initialSize,
    onSaved,
    slot,
    lockedSize,
    comboOption,
}: PizzaSheetProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const navigate = useNavigate();
    const me = usePjMe();
    const { url, srcSet } = useImageUrl();
    const showAddedToast = useShowAddedToast();
    const pizzaFetcher = useFetcher<PizzaSheetData>();
    const upsellFetcher = useFetcher<SheetUpsell>();
    const { submit, busy } = usePjCart();
    const [editItemId, setEditItemId] = useState<string | undefined>(itemId);
    const [selection, setSelection] = useState<PizzaSelection | null>(null);
    const [step, setStep] = useState<Step>('configure');
    const [basket, setBasket] = useState<Basket | null>(null);
    const [plan, setPlan] = useState<CrossSellPlan | null>(null);
    const [addedPizzaId, setAddedPizzaId] = useState<string | null>(null);
    const [storeVersion, setStoreVersion] = useState(0);
    const [error, setError] = useState<string | null>(null);
    /** Tras elegir tienda (TIE o respaldo), la hoja se recarga con su inventario y agrega sola (TIE-01 crit. 6). */
    const [addAfterStore, setAddAfterStore] = useState(false);

    const { load: loadPizza } = pizzaFetcher;
    const { load: loadUpsell } = upsellFetcher;
    const pizzaUrl = `/resource/pj-pizza?product=${encodeURIComponent(productId)}${
        itemId ? `&item=${encodeURIComponent(itemId)}` : ''
    }`;
    useEffect(() => {
        if (open) void loadPizza(pizzaUrl);
    }, [open, pizzaUrl, loadPizza, storeVersion]);
    useEffect(() => {
        if (open && !itemId && !slot) void loadUpsell(PJ_UPSELL_RESOURCE);
    }, [open, itemId, slot, loadUpsell]);

    const fixedSize = slot?.size ?? lockedSize ?? null;
    const loaded: PizzaConfig | null = pizzaFetcher.data?.config ?? null;
    // Ranura del combo o pizza de un combo: solo la Familiar y las masas que admite la promoción (§7.1).
    const config: PizzaConfig | null = useMemo(() => {
        if (!loaded || !fixedSize || !loaded.sizes.some((s) => s.id === fixedSize)) return loaded;
        return {
            ...loaded,
            sizes: loaded.sizes.filter((s) => s.id === fixedSize),
            variants: loaded.variants.filter((v) => v.size === fixedSize && COMBO_CRUSTS.includes(v.crust)),
        };
    }, [loaded, fixedSize]);
    const current = useMemo(() => {
        if (!config) return null;
        const opening = slot?.selection ??
            pizzaFetcher.data?.selection ?? {
                ...defaultSelection(config),
                ...(initialSize ? { size: initialSize } : {}),
            };
        return normalizeSelection(config, selection ?? opening);
    }, [config, selection, pizzaFetcher.data?.selection, initialSize, slot?.selection]);

    const total = config && current ? totalPrice(config, current) : 0;
    const points = pointsFor(total, 0, me?.doublePoints ?? false);
    const linePrice = config && current ? unitPrice(config, current) : 0;
    const lto = config ? productLto(config.badges) : null;
    const weeklyData = weeklyOrdersFor(config?.weeklyOrders);
    const weekly = weeklyData ? t('pdp.weeklyShort', weeklyData) : null;
    const size = config?.sizes.find((s) => s.id === current?.size);
    const summary =
        config && current
            ? selectionSummary(config, current, {
                  without: (name) => t('config.withoutLower', { name }),
                  plus: (name) => t('config.plus', { name }),
              })
            : '';

    const surcharge =
        config && current
            ? slotSurcharge({
                  extras: current.extras.length,
                  extraPrice: extraPriceForSize(config, current.size),
                  crustSurcharge: crustSurcharge(config, current.size, current.crust),
              })
            : 0;

    const add = async (): Promise<void> => {
        if (!config || !current || busy) return;
        const variant = findVariant(config, current.size, current.crust);
        if (!variant) return;
        if (slot) {
            // Modo ranura: la pizza vuelve al constructor; nada llega al carrito todavía.
            slot.onDone({
                masterId: config.productId,
                productId: variant.productId,
                crust: current.crust,
                extras: current.extras,
                removed: current.removed,
                summary,
                surcharge,
            });
            onOpenChange(false);
            return;
        }
        if (!editItemId && !readFulfillmentFromDocument()) {
            const outcome = await ensureFulfillment(`${config.name} ${size?.label ?? ''}`.trim(), formatClp(total));
            if (outcome.status === 'cancelled') return;
            if (outcome.changed) {
                // Recarga el inventario de la tienda elegida y agrega con todo lo elegido (TIE-01 crit. 6).
                setStoreVersion((v) => v + 1);
                setAddAfterStore(true);
                return;
            }
        }
        setError(null);
        const result = await submit({
            intent: 'pizza',
            ...(editItemId ? { itemId: editItemId } : {}),
            productId: variant.productId,
            quantity: current.quantity,
            optionItems: [
                ...optionItemsFor(config, current.extras, editItemId ? 'edit' : 'add'),
                ...(comboOption ? [{ optionId: COMBO_OPTION_ID, optionValueId: comboOption }] : []),
            ],
            removed: current.removed,
        });
        if (!result.success || !result.basket) {
            setError(t('sheet.error'));
            return;
        }
        const ids = result.addedItemIds ?? [];
        setBasket(result.basket);
        onSaved?.({ basket: result.basket, itemIds: ids });
        if (editItemId) {
            // «Guardar cambios» desde «Hazlo combo» vuelve a ese paso; desde el carrito cierra la hoja.
            if (addedPizzaId === editItemId) {
                setStep('upsell');
                return;
            }
            onOpenChange(false);
            return;
        }
        const pizzaId = ids[0] ?? null;
        const next = pizzaId ? nextCrossSell(result.basket, config.kind === 'builder' ? 'builder' : 'pizza') : null;
        if (next && pizzaId) {
            // «Completa tu pedido» después de toda pizza (S-D19), también en escritorio (D-P1-1): la franja
            // «<pizza> agregada · Editar» confirma, sin aviso encima; la foto vuela al carrito (D-P2-6).
            void flyToCart();
            setPlan(next);
            setAddedPizzaId(pizzaId);
            setEditItemId(undefined);
            setStep('upsell');
            return;
        }
        showAddedToast({
            productName: config.name,
            detail: summary,
            points: pointsFor(linesTotal(result.basket, ids), 0, me?.doublePoints ?? false),
            onUndo: ids.length ? () => void submit({ intent: 'remove', itemIds: ids }) : undefined,
        });
        onOpenChange(false);
    };

    const addRef = useRef(add);
    addRef.current = add;
    const reloaded = pizzaFetcher.state === 'idle' && config?.store != null;
    useEffect(() => {
        if (addAfterStore && reloaded && readFulfillmentFromDocument()) {
            setAddAfterStore(false);
            void addRef.current();
        }
    }, [addAfterStore, reloaded]);

    // Paso «Completa tu pedido».
    if (step === 'upsell' && config && current && plan) {
        return (
            <BottomSheet
                open={open}
                onOpenChange={onOpenChange}
                title={t('complete.dialogTitle')}
                hideTitle
                className={SHEET_OWN_CLOSE}
                footer={
                    <UpsellFooter
                        basket={basket}
                        onViewOrder={() => {
                            onOpenChange(false);
                            void navigate(PJ_ROUTES.cart);
                        }}
                        onContinue={() => onOpenChange(false)}
                    />
                }>
                <div style={PRO_TOKENS}>
                    <CompleteOrderStep
                        upsell={upsellFetcher.data ?? null}
                        plan={plan}
                        addedTitle={t('upsell.addedTitle', { name: config.name })}
                        addedDetail={summary}
                        onEdit={() => {
                            setEditItemId(addedPizzaId ?? undefined);
                            setStep('configure');
                        }}
                        submit={submit}
                        busy={busy}
                        onBasket={setBasket}
                        onClose={() => onOpenChange(false)}
                        comboFor={addedPizzaId ?? undefined}
                    />
                </div>
            </BottomSheet>
        );
    }

    return (
        <BottomSheet
            open={open}
            onOpenChange={onOpenChange}
            title={t('sheet.title', { name: config?.name ?? '' })}
            hideTitle
            className={SHEET_OWN_CLOSE}
            footer={
                step === 'configure' ? (
                    <div className="flex flex-col gap-2">
                        {error && (
                            <p role="alert" className="text-sm font-semibold text-pj-sale">
                                {error}
                            </p>
                        )}
                        {slot ? (
                            <button
                                type="button"
                                onClick={() => void add()}
                                disabled={!config}
                                data-testid="pj-sheet-slot-done"
                                className="flex h-[52px] items-center justify-between rounded-full bg-pj-basil px-5 text-base font-bold text-pj-dough disabled:opacity-70">
                                <span>{t('sheet.slotDone')}</span>
                                <span data-testid="pj-sheet-total">
                                    {surcharge > 0 ? `+${formatClp(surcharge)}` : t('sheet.slotIncluded')}
                                </span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-[52px] items-center rounded-full border-[1.5px] border-pj-line">
                                    <button
                                        type="button"
                                        aria-label={t('sheet.decrease')}
                                        disabled={!current || current.quantity <= 1}
                                        onClick={() =>
                                            current && setSelection({ ...current, quantity: current.quantity - 1 })
                                        }
                                        className="flex h-12 w-[44px] items-center justify-center disabled:opacity-40">
                                        <MinusIcon />
                                    </button>
                                    <span aria-live="polite" className="min-w-5 text-center text-[17px] font-bold">
                                        {current?.quantity ?? 1}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label={t('sheet.increase')}
                                        disabled={!current || current.quantity >= MAX_QUANTITY}
                                        onClick={() =>
                                            current && setSelection({ ...current, quantity: current.quantity + 1 })
                                        }
                                        className="flex h-12 w-[44px] items-center justify-center disabled:opacity-40">
                                        <PlusIcon />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => void add()}
                                    disabled={!config || busy}
                                    data-testid="pj-sheet-add"
                                    className="flex h-[52px] flex-1 items-center justify-between rounded-full bg-pj-green px-5 text-base font-bold text-pj-surface disabled:opacity-70">
                                    <span>{editItemId ? t('sheet.save') : t('sheet.add')}</span>
                                    <span data-testid="pj-sheet-total">{formatClp(total)}</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : undefined
            }>
            <div className="relative -mx-4 lg:-mx-6" style={PRO_TOKENS}>
                {/* Cerrar sobre la foto (como el lienzo): se va con el scroll y no tapa los precios. Es el
                    primer control de la hoja y no se desmonta al pasar del esqueleto a la pizza, así el foco
                    inicial queda en un botón visible (VAL-MEN-05 H2). */}
                <SheetClose onClose={() => onOpenChange(false)} />
                {config && current ? (
                    <>
                        <div className="relative">
                            {config.image ? (
                                <FoodImage
                                    src={url(config.image.src, 960) ?? config.image.src}
                                    srcSet={srcSet(config.image.src, [480, 780, 960, 1280])}
                                    sizes="(min-width: 1024px) 480px, 100vw"
                                    alt={t('sheet.imageAlt', { name: config.name })}
                                    bleed
                                    priority
                                    crop="macro"
                                    className="h-[260px] w-full lg:h-[280px]"
                                />
                            ) : (
                                <div className="h-[260px] bg-pj-sand lg:h-[280px]" aria-hidden="true" />
                            )}
                            {lto && (
                                <LtoBadge
                                    variant={lto.variant}
                                    size="md"
                                    animate
                                    label={t(`lto.${lto.key}Label`)}
                                    className="pointer-events-none absolute top-3 left-3 text-[14px] shadow-pj-float">
                                    {t(`lto.${lto.key}`)}
                                </LtoBadge>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 px-4 pt-4 pb-2 lg:px-6">
                            <h2 className="pj-h2 text-pj-basil lg:text-[40px]">{config.name}</h2>
                            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                {slot ? (
                                    <p
                                        className="m-0 text-[15px] font-bold text-pj-basil"
                                        data-testid="pj-sheet-slot-note">
                                        {t('sheet.slotNote')}
                                    </p>
                                ) : (
                                    <PriceTag variant="display" size="md" surface="dough" price={linePrice} />
                                )}
                                {config.rating != null && (
                                    <span className="inline-flex flex-wrap items-baseline gap-x-1 text-[13px]">
                                        <Stars rating={config.rating} count={config.reviewCount} />
                                        {weekly && (
                                            <span className="text-pj-gray-strong" data-testid="pj-sheet-weekly">
                                                · {weekly}
                                            </span>
                                        )}
                                    </span>
                                )}
                            </div>
                            {config.sensory && <p className="pj-body text-pj-gray-strong">{config.sensory}</p>}
                            <div className="flex flex-wrap gap-1.5">
                                {size?.serves && (
                                    <span className="rounded-full bg-pj-track px-2.5 py-1 text-xs font-semibold">
                                        {t('sheet.serves', { serves: size.serves })}
                                    </span>
                                )}
                                {points > 0 && !slot && (
                                    <span
                                        className="rounded-full bg-pj-garlic px-2.5 py-1 text-xs font-semibold text-pj-sauce"
                                        data-testid="pj-sheet-points">
                                        {t('sheet.points', { count: points })}
                                    </span>
                                )}
                            </div>
                            <p className="mt-1 text-[13px] font-semibold text-pj-green" data-testid="pj-sheet-summary">
                                {summary}
                            </p>
                        </div>
                        <PizzaConfigurator
                            config={config}
                            selection={current}
                            onChange={setSelection}
                            layout="sheet"
                            hideSize={Boolean(slot)}
                            className="lg:[&>section]:px-6"
                        />
                    </>
                ) : (
                    <SheetSkeleton failed={pizzaFetcher.state === 'idle' && pizzaFetcher.data != null && !config} />
                )}
            </div>
        </BottomSheet>
    );
}

function SheetClose({ onClose }: { onClose: () => void }): ReactElement {
    const { t } = useTranslation('extPjProduct');
    return (
        <button
            type="button"
            onClick={onClose}
            aria-label={t('sheet.close')}
            data-testid="pj-sheet-close"
            className="absolute top-3 right-3 z-10 flex size-[44px] items-center justify-center rounded-full bg-pj-surface text-pj-ink shadow-pj-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
            <CloseIcon size={20} />
        </button>
    );
}

function SheetSkeleton({ failed }: { failed: boolean }): ReactElement {
    const { t } = useTranslation('extPjProduct');
    if (failed) {
        return (
            <p role="alert" className="px-4 py-10 text-center text-pj-gray">
                {t('sheet.loadError')}
            </p>
        );
    }
    return (
        <div aria-busy="true" aria-label={t('sheet.loading')}>
            <div className="h-[230px] animate-pulse bg-pj-sand lg:h-[260px]" />
            <div className="flex flex-col gap-3 px-4 py-4">
                <div className="h-8 w-2/3 animate-pulse rounded bg-pj-sand" />
                <div className="h-4 w-full animate-pulse rounded bg-pj-sand" />
                <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-[84px] animate-pulse rounded-xl bg-pj-sand" />
                    ))}
                </div>
            </div>
        </div>
    );
}
