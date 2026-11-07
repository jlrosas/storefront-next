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
import { type ReactElement, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UITarget } from '@/targets/ui-target';
import { useBasket } from '@/providers/basket';
import { HAZLO_COMBO_SIDE, PJ_COMBO_OFFER_EVENT, type PjComboOfferDetail } from '@/extensions/pj-product';
// CAR-01/02: la línea y el pie se leen igual que en /cart (configuración, extras, combo, puntos y CTA con monto).
import { CompactLine } from '@/extensions/pj-cart/components/compact-line';
import { PanelFooter } from '@/extensions/pj-cart/components/panel-footer';
import { useLineSummaries } from '@/extensions/pj-cart/hooks/use-line-summaries';
import type { SummaryLineItem } from '@/extensions/pj-cart/lib/line-summary';

const HazloComboCompact = lazy(() => import('@/extensions/pj-product/components/hazlo-combo-compact'));

/** Oferta «Hazlo combo» abierta en el panel (UX-2 #52) y cómo retirarla. */
interface PanelOffer {
    offer: PjComboOfferDetail | null;
    dismiss: () => void;
}

/** Resumen estándar del carrito (MEN-03.2): productos, total e «Ir a pagar». CAR lo enriquece. */
function DefaultSummary({ offer, dismiss }: PanelOffer): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const basket = useBasket();
    const items = basket?.productItems ?? [];
    const total = basket?.productTotal ?? basket?.productSubTotal ?? 0;
    const { entries, products } = useLineSummaries(items as SummaryLineItem[]);
    // Si la línea ya no está (se deshizo el agregado), la oferta se va con ella.
    const anchored = offer && items.some((item) => item.itemId === offer.itemId) ? offer : null;
    if (items.length === 0) {
        return <p className="m-0 text-[15px] text-pj-gray">{t('order.empty')}</p>;
    }
    return (
        <>
            <ul className="m-0 flex list-none flex-col gap-2 p-0" data-testid="pj-menu-order-lines">
                {entries.map(({ summary, combo }) => (
                    <li key={summary.itemId} className="flex flex-col gap-2 border-b border-pj-sand pb-2 text-sm">
                        <CompactLine summary={summary} combo={combo} products={products} />
                        {anchored && anchored.itemId === summary.itemId && (
                            <Suspense
                                fallback={<div className="h-[190px] rounded-pj-card bg-pj-sand" aria-hidden="true" />}>
                                <HazloComboCompact productName={anchored.productName} onDone={dismiss} />
                            </Suspense>
                        )}
                    </li>
                ))}
            </ul>
            <PanelFooter total={total} />
        </>
    );
}

/**
 * «Tu pedido» fijo en la columna derecha del menú de escritorio (MEN-03). El contenido va en el
 * punto de inserción `pj.menu.orderSummary`: CAR lo reemplaza o lo enriquece (oleada 2).
 */
export function OrderSummary(): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const basket = useBasket();
    const ref = useRef<HTMLElement>(null);
    const [offer, setOffer] = useState<PjComboOfferDetail | null>(null);
    const hasComboSide = (basket?.productItems ?? []).some((item) => item.productId === HAZLO_COMBO_SIDE);
    const hasSideRef = useRef(hasComboSide);
    hasSideRef.current = hasComboSide;

    // «Hazlo combo» en escritorio (UX-2 #52): la hoja de PRO pregunta y, si el panel está a la vista
    // (desde lg) y el pedido aún no trae los palitos del combo, la oferta se muestra aquí.
    useEffect(() => {
        const onOffer = (event: Event) => {
            const detail = (event as CustomEvent<PjComboOfferDetail>).detail;
            const visible = Boolean(ref.current && ref.current.offsetParent !== null);
            if (!detail?.itemId || !visible || hasSideRef.current) return;
            event.preventDefault();
            setOffer(detail);
        };
        window.addEventListener(PJ_COMBO_OFFER_EVENT, onOffer);
        return () => window.removeEventListener(PJ_COMBO_OFFER_EVENT, onOffer);
    }, []);

    return (
        <aside
            ref={ref}
            aria-label={t('order.title')}
            data-testid="pj-menu-order"
            className="sticky top-[calc(var(--header-height,60px)+4.5rem)] hidden max-w-85 min-w-70 flex-1 flex-col gap-3 self-start rounded-[18px] bg-pj-surface p-[18px] shadow-pj-card lg:flex">
            <h2 className="text-[26px]">{t('order.title')}</h2>
            <UITarget targetId="pj.menu.orderSummary">
                <DefaultSummary offer={offer} dismiss={() => setOffer(null)} />
            </UITarget>
        </aside>
    );
}
