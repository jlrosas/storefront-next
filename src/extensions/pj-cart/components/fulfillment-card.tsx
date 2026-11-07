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
import { type ReactElement, useEffect } from 'react';
import { useRevalidator } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PJ_FULFILLMENT_EVENTS } from '@/extensions/pj-shared/lib/events';
import { hydrateFulfillment, openFulfillmentPanel, useFulfillment } from '@/extensions/pj-store/lib/fulfillment-store';
import { cn } from '@/lib/utils';
import type { CartFulfillment } from '../lib/types';
import { MotoIcon, StoreIcon } from './icons';

export interface FulfillmentCardProps {
    /** La modalidad leída en el servidor (`pj_fulfillment` + tienda). */
    fulfillment: CartFulfillment | null;
}

/** Texto con su clave de traducción, para traducirlo en el componente. */
type Phrase =
    | { key: 'fulfillment.deliveryTitle'; values: { address: string } }
    | { key: 'fulfillment.deliveryTitleNoAddress'; values: { store: string } }
    | { key: 'fulfillment.pickupTitle'; values: { store: string } }
    | { key: 'fulfillment.deliveryEta'; values: { from: number; to: number } }
    | { key: 'fulfillment.pickupReady'; values: { minutes: number } }
    | { key: 'fulfillment.scheduled'; values: Record<string, never> }
    | { key: 'fulfillment.openUntil'; values: { time: string } }
    | { key: 'fulfillment.fromStore'; values: { store: string } };

/**
 * Título y detalle (UX-3 §3.2): «Retiro en El Bosque» / «Listo en 15 min · abierta hasta 23:30», o
 * «Delivery a Av. Providencia 1234» / «Llega en 35–45 min · desde Salvador».
 */
function fulfillmentPhrases(f: CartFulfillment): { title: Phrase; detail: Phrase[] } {
    const store = f.storeName ?? f.storeId;
    const delivery = f.mode === 'delivery';
    const title: Phrase = delivery
        ? f.address
            ? { key: 'fulfillment.deliveryTitle', values: { address: f.address } }
            : { key: 'fulfillment.deliveryTitleNoAddress', values: { store } }
        : { key: 'fulfillment.pickupTitle', values: { store } };
    const detail: Phrase[] = [];
    if (f.when && f.when !== 'asap') detail.push({ key: 'fulfillment.scheduled', values: {} });
    else if (delivery && f.deliveryMinutes)
        detail.push({
            key: 'fulfillment.deliveryEta',
            values: { from: Math.max(5, f.deliveryMinutes - 5), to: f.deliveryMinutes + 5 },
        });
    else if (!delivery && f.pickupMinutes)
        detail.push({ key: 'fulfillment.pickupReady', values: { minutes: f.pickupMinutes } });
    if (delivery && f.address) detail.push({ key: 'fulfillment.fromStore', values: { store } });
    if (!delivery && f.openUntil) detail.push({ key: 'fulfillment.openUntil', values: { time: f.openUntil } });
    return { title, detail };
}

/**
 * Primera tarjeta del carrito (UX-3 §3.2, #38): la modalidad del chip con su icono y «Cambiar». Sale de la misma
 * cookie `pj_fulfillment`: nunca dice «despacho» si el chip dice retiro. Con la tienda cerrada (caso 1 del
 * panel) pasa a granate con «Programar» y «Cambiar tienda».
 */
export function FulfillmentCard({ fulfillment }: FulfillmentCardProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { revalidate } = useRevalidator();
    const live = useFulfillment();

    useEffect(() => {
        hydrateFulfillment();
        const onChanged = () => void revalidate();
        window.addEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
        return () => window.removeEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
    }, [revalidate]);

    // Si se cambió en el panel y el loader aún no vuelve, se pinta lo que eligió (con el meta de TIE).
    const changed =
        live.fulfillment &&
        (!fulfillment ||
            live.fulfillment.storeId !== fulfillment.storeId ||
            live.fulfillment.mode !== fulfillment.mode ||
            (live.fulfillment.address ?? null) !== fulfillment.address);
    const current: CartFulfillment | null =
        changed && live.fulfillment
            ? {
                  mode: live.fulfillment.mode,
                  storeId: live.fulfillment.storeId,
                  storeName: live.meta?.storeName ?? null,
                  address: live.meta?.addressText ?? live.fulfillment.address ?? null,
                  when: live.fulfillment.when,
                  pickupMinutes: null,
                  deliveryMinutes: null,
                  openUntil: null,
                  closed: false,
                  opensAt: null,
              }
            : fulfillment;
    const say = (phrase: Phrase): string =>
        String(t(phrase.key as 'fulfillment.pickupTitle', phrase.values as { store: string }));
    const phrases = current ? fulfillmentPhrases(current) : null;
    const title = phrases ? say(phrases.title) : t('fulfillment.emptyTitle');
    const detail = phrases
        ? phrases.detail.map(say).join(' · ') || (changed ? (live.meta?.timeText ?? '') : '')
        : t('fulfillment.emptyHint');

    if (current?.closed) {
        const store = current.storeName ?? current.storeId;
        const time = current.opensAt ?? '12:00';
        return (
            <section
                aria-label={t('fulfillment.label')}
                data-testid="pj-cart-fulfillment"
                data-mode={current.mode}
                data-closed="true"
                className="surface-sauce flex flex-col gap-3 rounded-pj-card p-4 shadow-pj-card">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-pj-pepperoncini text-pj-sauce">
                        <StoreIcon />
                    </span>
                    <div className="min-w-0">
                        <p className="m-0 text-base font-bold">{t('fulfillment.closedTitle', { store })}</p>
                        <p className="m-0 text-sm">{t('fulfillment.closedDetail', { time })}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <button
                        type="button"
                        onClick={() =>
                            openFulfillmentPanel({ initialWhen: 'scheduled', initialStoreId: current.storeId })
                        }
                        className="inline-flex min-h-11 items-center rounded-full bg-pj-pepperoncini px-5 text-[15px] font-bold text-pj-sauce">
                        {t('fulfillment.schedule', { time })}
                    </button>
                    <button
                        type="button"
                        onClick={() => openFulfillmentPanel()}
                        className="inline-flex min-h-11 items-center px-1 text-[15px] font-bold text-pj-dough underline underline-offset-4">
                        {t('fulfillment.changeStore')}
                    </button>
                </div>
            </section>
        );
    }

    const Icon = current?.mode === 'delivery' ? MotoIcon : StoreIcon;
    return (
        <section
            aria-label={t('fulfillment.label')}
            data-testid="pj-cart-fulfillment"
            data-mode={current?.mode ?? 'none'}
            className="flex items-center gap-3 rounded-pj-card bg-pj-surface p-4 shadow-pj-card">
            <span className="surface-pepperoncini flex size-10 shrink-0 items-center justify-center rounded-full text-pj-basil">
                <Icon />
            </span>
            <div className="min-w-0 flex-1">
                <p
                    className={cn(
                        'm-0 text-base font-bold text-pj-heading',
                        current?.mode === 'delivery' && 'truncate'
                    )}>
                    {title}
                </p>
                {detail && <p className="m-0 text-sm text-pj-gray-strong">{detail}</p>}
            </div>
            <button
                type="button"
                onClick={() => openFulfillmentPanel()}
                aria-label={t('fulfillment.changeAria')}
                className="inline-flex min-h-11 shrink-0 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                {current ? t('fulfillment.change') : t('fulfillment.choose')}
            </button>
        </section>
    );
}

export default FulfillmentCard;
