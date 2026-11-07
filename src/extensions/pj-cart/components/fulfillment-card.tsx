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
import type { CartFulfillment } from '../lib/types';

export interface FulfillmentCardProps {
    /** La modalidad leída en el servidor (`pj_fulfillment` + tienda). */
    fulfillment: CartFulfillment | null;
}

/** Texto con su clave de traducción, para traducirlo en el componente. */
type Phrase =
    | { key: 'fulfillment.deliveryTitle'; values: { address: string } }
    | { key: 'fulfillment.deliveryTitleNoAddress'; values: { store: string } }
    | { key: 'fulfillment.pickupTitle'; values: { store: string } }
    | { key: 'fulfillment.deliveryEta'; values: { minutes: number } }
    | { key: 'fulfillment.pickupReady'; values: { minutes: number } }
    | { key: 'fulfillment.scheduled'; values: Record<string, never> }
    | { key: 'fulfillment.openUntil'; values: { time: string } };

/** Título y detalle de la tarjeta («Retiro en El Bosque» / «Listo en 15 min · Abierta hasta 23:30»). */
function fulfillmentPhrases(f: CartFulfillment): { title: Phrase; detail: Phrase[] } {
    const store = f.storeName ?? f.storeId;
    const title: Phrase =
        f.mode === 'delivery'
            ? f.address
                ? { key: 'fulfillment.deliveryTitle', values: { address: f.address } }
                : { key: 'fulfillment.deliveryTitleNoAddress', values: { store } }
            : { key: 'fulfillment.pickupTitle', values: { store } };
    const minutes = f.mode === 'delivery' ? f.deliveryMinutes : f.pickupMinutes;
    const detail: Phrase[] = [];
    if (f.when && f.when !== 'asap') detail.push({ key: 'fulfillment.scheduled', values: {} });
    else if (minutes && f.mode === 'delivery') detail.push({ key: 'fulfillment.deliveryEta', values: { minutes } });
    else if (minutes) detail.push({ key: 'fulfillment.pickupReady', values: { minutes } });
    if (f.openUntil) detail.push({ key: 'fulfillment.openUntil', values: { time: f.openUntil } });
    return { title, detail };
}

/**
 * Primera tarjeta del carrito (CAR-01 crit. 1, UX-2 §4 regla 2, #38): la modalidad del chip con «Cambiar».
 * Nunca dice «Despacho a domicilio» si el chip dice retiro: sale de la misma cookie `pj_fulfillment`.
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
              }
            : fulfillment;
    const phrases = current ? fulfillmentPhrases(current) : null;
    const say = (phrase: Phrase): string =>
        String(t(phrase.key as 'fulfillment.pickupTitle', phrase.values as { store: string }));
    const lines = phrases ? { title: say(phrases.title), detail: phrases.detail.map(say).join(' · ') } : null;
    const liveDetail = changed ? (live.meta?.timeText ?? '') : '';

    return (
        <section
            aria-label={t('fulfillment.label')}
            data-testid="pj-cart-fulfillment"
            data-mode={current?.mode ?? 'none'}
            className="flex items-center gap-3 rounded-pj-card bg-pj-surface px-4 py-3 shadow-pj-card">
            <div className="min-w-0 flex-1">
                <p className="m-0 text-base font-bold text-pj-heading">
                    {lines ? lines.title : t('fulfillment.emptyTitle')}
                </p>
                <p className="m-0 text-sm text-pj-gray-strong">
                    {lines ? lines.detail || liveDetail : t('fulfillment.emptyHint')}
                </p>
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
