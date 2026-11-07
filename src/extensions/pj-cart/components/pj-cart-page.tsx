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
import { type ReactElement, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShopperBasketsV2 } from '@/scapi';
import { Link } from '@/components/link';
import { useBasket, useBasketUpdater } from '@/providers/basket';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { DELIVERY_MINIMUM_CLP } from '@/extensions/pj-shared/lib/fulfillment';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { usePjDemoProfile, usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { DEMO_PERSONAS } from '@/extensions/pj-shared/lib/persona';
import { usePjCart } from '@/extensions/pj-product/hooks/use-pj-cart';
import { HAZLO_COMBO_DRINKS, HAZLO_COMBO_SIDE } from '@/extensions/pj-product/lib/upsell';
import { openFulfillmentPanel } from '@/extensions/pj-store/lib/fulfillment-store';
import { useLineSummaries } from '../hooks/use-line-summaries';
import { COMBO_PROMOTIONS, type ComboGroup, type LineSummary, type SummaryLineItem } from '../lib/line-summary';
import { cartTotals, checkoutBlock, pickCartSection, type CanjeState } from '../lib/cart-model';
import { cartBlocks, readdGroupPayload, type ComboGroupSummary } from '../lib/combo-group';
import { ComboGroupBlock } from './combo-group';
import { CartRecommendations } from './cart-recommendations';
import { writeCanjeCookie } from '../lib/canje';
import { readdComboPayload, readdPayload } from '../lib/undo';
import { showRemovedToast } from '../lib/removed-toast';
import type { PjCartData } from '../lib/types';
import { CartLine } from './cart-line';
import { ComboLine } from './combo-line';
import { FulfillmentCard } from './fulfillment-card';
import { OfferCard } from './offer-card';
import { PointsBlock } from './points-block';
import { SummaryBlock } from './summary-block';
import { CheckoutCta } from './checkout-cta';
import { EmptyCart } from './cart-states';

type Basket = ShopperBasketsV2.schemas['Basket'];

export interface PjCartPageProps extends PjCartData {
    /** Canasta del loader de `/cart`; después manda la del contexto (cambios de cantidad, edición). */
    basket: Basket | undefined;
}

const COMBO_DRINKS = HAZLO_COMBO_DRINKS.map((drink) => drink.productId);

/** Delivery bajo el mínimo (§3.9): cuánto falta, barra de progreso y «o cámbiate a retiro». */
function MinimumNotice({ missing, charged }: { missing: number; charged: number }): ReactElement {
    const { t } = useTranslation('extPjCart');
    const progress = Math.min(100, Math.round((charged / DELIVERY_MINIMUM_CLP) * 100));
    return (
        <div className="flex flex-col gap-2" data-testid="pj-cart-threshold">
            <p className="m-0 text-sm font-bold text-pj-price">
                {t('summary.threshold', { amount: formatClp(missing) })}
            </p>
            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label={t('summary.progressAria', {
                    amount: formatClp(charged),
                    minimum: formatClp(DELIVERY_MINIMUM_CLP),
                })}
                className="h-1.5 overflow-hidden rounded-full bg-pj-line">
                <div className="h-full rounded-full bg-pj-basil" style={{ width: `${progress}%` }} />
            </div>
            <button
                type="button"
                onClick={() => openFulfillmentPanel({ initialMode: 'pickup' })}
                className="inline-flex min-h-11 items-center self-start px-0 text-sm font-bold text-pj-basil underline underline-offset-4">
                {t('summary.toPickup')}
            </button>
        </div>
    );
}

/**
 * «Mi pedido» (CAR-01/02, UX-3): la modalidad arriba, cada línea como la pizza que se armó con su combo debajo,
 * una sola oferta, Papa Puntos con el canje, el resumen con ahorro y canje y «Ir a pagar · $total». A 1440, dos
 * columnas con la derecha `sticky`; a 390, una columna con el CTA fijo.
 */
export function PjCartPage({
    basket: loaderBasket,
    lineProducts,
    fulfillment,
    extras,
    canje: loaderCanje,
}: PjCartPageProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const contextBasket = useBasket();
    const updateBasket = useBasketUpdater();
    const me = usePjMe();
    const demoProfile = usePjDemoProfile();
    const undoCart = usePjCart();

    // Igual que el carrito del template: la canasta del loader entra al contexto antes de pintar.
    useLayoutEffect(() => {
        if (loaderBasket?.basketId) updateBasket(loaderBasket);
    }, [loaderBasket, updateBasket]);

    const basket = contextBasket?.basketId === loaderBasket?.basketId ? (contextBasket ?? loaderBasket) : loaderBasket;
    const items = useMemo(() => (basket?.productItems ?? []) as SummaryLineItem[], [basket]);
    const [canjeState, setCanjeState] = useState<CanjeState | null>(loaderCanje ?? null);
    const ignore = useMemo(() => (canjeState ? [canjeState.itemId] : []), [canjeState]);
    const { summaries, entries } = useLineSummaries(items, lineProducts, ignore);
    const groupNames = useMemo(
        () => ({ 'cb-super-duo': t('group.name.duo'), 'cb-super-trio': t('group.name.trio') }),
        [t]
    );
    const itemsRef = useRef(new Map<string, SummaryLineItem>());
    for (const item of items) if (item.itemId) itemsRef.current.set(item.itemId, item);

    const [freshCanje, setFreshCanje] = useState<string | null>(null);
    // El canje vale mientras su línea siga en el pedido.
    const canje = canjeState && items.some((item) => item.itemId === canjeState.itemId) ? canjeState : null;
    // Si la pizza canjeada ya no está (se quitó o se vació el pedido), el canje se borra también para CHK.
    useEffect(() => {
        if (canjeState && !canje) writeCanjeCookie(null);
    }, [canjeState, canje]);

    const { submit: undoSubmit } = undoCart;
    const onRemoved = useCallback(
        (summary: LineSummary) => {
            const item = itemsRef.current.get(summary.itemId);
            const payload = item ? readdPayload(summary, item) : null;
            if (!payload) return;
            showRemovedToast({
                message: t('line.removed', { name: summary.name }),
                undoLabel: t('line.undo'),
                undoAria: t('line.undoAria', { name: summary.name }),
                onUndo: () => void undoSubmit(payload),
            });
        },
        [t, undoSubmit]
    );
    const onGroupRemoved = useCallback(
        (group: ComboGroupSummary) => {
            showRemovedToast({
                message: t('line.removed', { name: group.name }),
                undoLabel: t('line.undo'),
                undoAria: t('line.undoAria', { name: group.name }),
                onUndo: () => void undoSubmit(readdGroupPayload(group)),
            });
        },
        [t, undoSubmit]
    );
    const onComboRemoved = useCallback(
        (combo: ComboGroup) => {
            const name = t('line.comboName');
            showRemovedToast({
                message: t('line.removed', { name }),
                undoLabel: t('line.undo'),
                undoAria: t('line.undoAria', { name }),
                onUndo: () => void undoSubmit(readdComboPayload(combo)),
            });
        },
        [t, undoSubmit]
    );

    if (!summaries.length) {
        return <EmptyCart image={extras.emptyImage} />;
    }

    const delivery = fulfillment?.mode === 'delivery';
    const totals = cartTotals(summaries, { delivery, doublePoints: me?.doublePoints ?? false, canje });
    const charged = totals.total - totals.shipping;
    const storeClosed = Boolean(fulfillment?.closed);
    const pickupOnlyItems = new Set(
        delivery
            ? summaries.filter((line) => lineProducts[line.productId]?.dispatch === 'pickup').map((line) => line.itemId)
            : []
    );
    const block = checkoutBlock({
        hasFulfillment: Boolean(fulfillment),
        storeClosed,
        missingForDelivery: totals.missingForDelivery,
        pickupOnlyWithDelivery: pickupOnlyItems.size > 0,
    });
    // Una sola sección de venta cruzada: «Conviértelo en combo» o «¿Le sumamos algo?» (S-D19).
    const section = pickCartSection(entries, basket, {
        hasDrinkCandidate: Boolean(extras.drink),
        hasDessertCandidate: Boolean(extras.dessert),
        comboSide: HAZLO_COMBO_SIDE,
        comboDrinks: COMBO_DRINKS,
        storeClosed,
        catalog: extras.crossSell,
        kinds: Object.fromEntries(Object.entries(lineProducts).map(([id, product]) => [id, product.kind])),
    });
    const blocks = cartBlocks(entries, groupNames);
    const looseItems = summaries
        .filter(
            (line) =>
                (line.productId === HAZLO_COMBO_SIDE || COMBO_DRINKS.includes(line.productId)) &&
                !line.promotions.some((id) => COMBO_PROMOTIONS.includes(id))
        )
        .map((line) => ({ itemId: line.itemId, productId: line.productId }));
    // Igual que el contador «Mi pedido · N» del encabezado: unidades de la canasta.
    const count = summaries.reduce((sum, line) => sum + line.quantity, 0);
    const registered = Boolean(me?.registered);
    // CTA: con un perfil de demo (`?perfil=`) y sin sesión, el saldo es el del cliente de demo, para que el
    // canje hecho desde `/puntos` muestre «Te quedan N» y «Deshacer».
    const balance = registered ? (me?.points ?? null) : demoProfile ? DEMO_PERSONAS[demoProfile].points : null;

    const renderEntry = ({ summary, combo }: (typeof entries)[number], grouped: boolean): ReactElement[] => {
        const isCanje = canje?.itemId === summary.itemId;
        const nodes = [
            <CartLine
                key={summary.itemId}
                summary={summary}
                products={lineProducts}
                onRemoved={onRemoved}
                joined={Boolean(combo)}
                grouped={grouped}
                canje={
                    isCanje && canje
                        ? {
                              points: canje.points,
                              value: canje.value,
                              fresh: freshCanje === summary.itemId,
                          }
                        : null
                }
                notice={
                    pickupOnlyItems.has(summary.itemId) ? (
                        <p className="m-0 text-sm text-pj-price">
                            {t('line.pickupOnly')}{' '}
                            <button
                                type="button"
                                onClick={() => openFulfillmentPanel({ initialMode: 'pickup' })}
                                className="inline-flex min-h-11 items-center font-bold text-pj-basil underline underline-offset-4">
                                {t('line.toPickup')}
                            </button>
                        </p>
                    ) : null
                }
            />,
        ];
        if (combo) {
            nodes.push(
                <ComboLine
                    key={`combo-${combo.itemIds.join('-')}`}
                    combo={combo}
                    image={extras.comboImage}
                    onRemoved={onComboRemoved}
                />
            );
        }
        return nodes;
    };

    const keepBrowsing = (
        <Link
            to={PJ_ROUTES.menu}
            className="inline-flex min-h-11 items-center self-center text-[15px] font-bold text-pj-basil underline underline-offset-4">
            {t('summary.keepBrowsing')}
        </Link>
    );

    return (
        <div className="surface-dough -mt-8 min-h-screen pb-36 lg:pb-16" data-testid="pj-cart">
            <div className="mx-auto w-full max-w-[1120px] px-4 pt-6 lg:px-8 lg:pt-10">
                <div className="mb-4 flex items-baseline justify-between gap-3">
                    <h1 className="pj-h2 m-0">{t('page.title')}</h1>
                    <span className="pj-small text-pj-gray-strong" data-testid="pj-cart-count">
                        {t('page.count', { count })}
                    </span>
                </div>
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-8">
                    <div className="flex min-w-0 flex-col gap-4">
                        <FulfillmentCard fulfillment={fulfillment} />
                        <ul
                            aria-label={t('page.linesLabel')}
                            className="m-0 list-none divide-y divide-pj-line rounded-pj-card bg-pj-surface px-4 shadow-pj-card lg:px-5"
                            data-testid="pj-cart-lines">
                            {blocks.map((item) =>
                                item.type === 'group' ? (
                                    <ComboGroupBlock
                                        key={item.group.group}
                                        group={item.group}
                                        onRemoved={onGroupRemoved}>
                                        {item.entries.flatMap((entry) => renderEntry(entry, true))}
                                    </ComboGroupBlock>
                                ) : (
                                    renderEntry(item.entry, false)
                                )
                            )}
                        </ul>
                        {section?.kind === 'convert' && (
                            <OfferCard kind="convert" extras={extras} looseItems={looseItems} />
                        )}
                        {section?.kind === 'recommend' && <CartRecommendations items={section.items} />}
                    </div>
                    <aside
                        className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-height,72px)+1.5rem)] lg:rounded-pj-card lg:bg-pj-surface lg:p-5 lg:shadow-pj-card"
                        data-testid="pj-cart-side">
                        <PointsBlock
                            earn={totals.points}
                            doublePoints={me?.doublePoints ?? false}
                            balance={balance}
                            redeem={extras.redeem}
                            canje={canje}
                            onCanje={(next) => {
                                setCanjeState(next);
                                setFreshCanje(next?.itemId ?? null);
                            }}
                        />
                        {totals.missingForDelivery > 0 && (
                            <MinimumNotice missing={totals.missingForDelivery} charged={charged} />
                        )}
                        <SummaryBlock totals={totals} delivery={delivery} />
                        <CheckoutCta
                            total={totals.total}
                            block={block}
                            missing={totals.missingForDelivery}
                            registered={registered}
                            className="hidden lg:flex"
                        />
                        {keepBrowsing}
                    </aside>
                </div>
            </div>
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pj-line bg-pj-dough px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
                <CheckoutCta
                    total={totals.total}
                    block={block}
                    missing={totals.missingForDelivery}
                    registered={registered}
                />
            </div>
        </div>
    );
}

export default PjCartPage;
