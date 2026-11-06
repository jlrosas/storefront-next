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
import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetcher } from 'react-router';
import { BottomSheet } from '@/extensions/pj-shared/components/bottom-sheet';
import { formatTime } from '@/extensions/pj-shared/lib/format';
import type { Fulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import { useStoreLocator } from '@/extensions/store-locator/providers/store-locator';
import GoogleCloudApiProvider from '@/providers/google-cloud-api';
import { resourceRoutes } from '@/route-paths';
import { cn } from '@/lib/utils';
import {
    closeFulfillmentPanel,
    notifyFulfillmentChanged,
    saveFulfillment,
    useFulfillment,
    usePanelRequest,
    type FulfillmentMeta,
    type RequireFulfillmentOptions,
} from '../lib/fulfillment-store';
import { deliveryWindowText } from '../lib/delivery-zones';
import { dayOf } from '../lib/schedule';
import { isStoreClosed, pickupMinutes, shortStoreName, type PjStore } from '../lib/store-info';
import { DeliverySection, type DeliveryValue } from './delivery-section';
import { PickupSection } from './pickup-section';
import { WhenSection, type WhenValue } from './when-section';

// «Lo antes posible» por defecto, siempre (TIE-01 criterio 5).
const ASAP: WhenValue = { mode: 'asap', day: 'today', slot: null };

type Mode = 'pickup' | 'delivery';

const PREFERENCE_ROUTE = '/resource/pj-fulfillment';

const modeClass = (on: boolean) =>
    cn(
        'min-h-[52px] cursor-pointer rounded-[14px] border-2 px-3 text-base font-bold',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
        on
            ? 'border-pj-green bg-pj-surface text-pj-green-dark shadow-pj-card'
            : 'border-transparent bg-transparent text-pj-gray'
    );

/**
 * Panel «¿Cómo lo quieres?» (Tienda.dc.html y Tienda-Delivery.dc.html): Retiro | Delivery,
 * tienda o dirección, «¿Cuándo?» y el botón que confirma y vuelve a lo que la persona estaba haciendo.
 * Comer aquí (S-D10) no se construye.
 */
export default function FulfillmentPanel(): ReactElement {
    const request = usePanelRequest();
    // Cada apertura parte de cero; al cerrar se conserva la última solicitud para la animación de salida.
    const [session, setSession] = useState<{ id: number; options: RequireFulfillmentOptions }>({ id: 0, options: {} });
    useEffect(() => {
        if (request) setSession((prev) => ({ id: prev.id + 1, options: request }));
    }, [request]);
    return (
        <GoogleCloudApiProvider>
            <PanelBody key={session.id} open={request !== null} options={session.options} />
        </GoogleCloudApiProvider>
    );
}

function PanelBody({ open, options }: { open: boolean; options: RequireFulfillmentOptions }): ReactElement {
    const { t } = useTranslation('extPjStore');
    const { fulfillment: saved } = useFulfillment();
    const setSelectedStoreInfo = useStoreLocator((s) => s.setSelectedStoreInfo);
    const storeFetcher = useFetcher();
    const [mode, setMode] = useState<Mode>(saved?.mode ?? 'pickup');
    const [when, setWhen] = useState<WhenValue>(ASAP);
    const [pickupStore, setPickupStore] = useState<PjStore | null>(null);
    const [delivery, setDelivery] = useState<DeliveryValue | null>(null);
    const [apartment, setApartment] = useState('');

    const activeStore = mode === 'pickup' ? pickupStore : (delivery?.assignment.store ?? null);
    const closedAsap = mode === 'pickup' && pickupStore !== null && isStoreClosed(pickupStore) && when.mode === 'asap';
    const needsSlot = when.mode === 'later' && !when.slot;
    const ready =
        mode === 'pickup' ? pickupStore !== null && !closedAsap && !needsSlot : delivery !== null && !needsSlot;

    const onProgram = useCallback(() => setWhen((prev) => ({ ...prev, mode: 'later', slot: null })), []);

    const confirm = () => {
        if (!ready || !activeStore) return;
        const whenValue = when.mode === 'later' && when.slot ? when.slot : 'asap';
        const scheduled = whenValue !== 'asap';
        const scheduledText = scheduled
            ? `${dayOf(whenValue) === 'today' ? t('when.today') : t('when.tomorrow')} ${formatTime(whenValue)}`.toLowerCase()
            : '';
        let fulfillment: Fulfillment;
        let meta: FulfillmentMeta;
        if (mode === 'pickup') {
            fulfillment = { mode: 'pickup', storeId: activeStore.id, when: whenValue };
            meta = {
                storeId: activeStore.id,
                storeName: shortStoreName(activeStore.name),
                timeText: scheduled ? scheduledText : `${pickupMinutes(activeStore)} min`,
                scheduled,
            };
        } else {
            const detail = apartment.trim();
            const street = delivery?.address ?? '';
            fulfillment = {
                mode: 'delivery',
                storeId: activeStore.id,
                address: detail ? `${street}, ${detail}` : street,
                when: whenValue,
            };
            meta = {
                storeId: activeStore.id,
                storeName: shortStoreName(activeStore.name),
                timeText: scheduled ? scheduledText : deliveryWindowText(activeStore),
                scheduled,
                addressText: street,
            };
        }
        saveFulfillment(fulfillment, meta);

        // La tienda elegida también queda en el store-locator del template (cookie `selectedStoreInfo`).
        const storeInfo = { id: activeStore.id, name: activeStore.name, inventoryId: activeStore.inventoryId };
        setSelectedStoreInfo(storeInfo);
        const form = new FormData();
        form.set('storeInfo', JSON.stringify(storeInfo));
        void storeFetcher.submit(form, { method: 'POST', action: resourceRoutes.setSelectedStore });
        // Con sesión, la preferencia queda en el perfil (mejor esfuerzo).
        void fetch(PREFERENCE_ROUTE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fulfillment),
        }).catch(() => undefined);

        notifyFulfillmentChanged(fulfillment);
        closeFulfillmentPanel(true);
        options.onConfirmed?.(fulfillment);
    };

    const confirmLabel = options.confirmLabel ?? (options.onConfirmed ? t('panel.confirmAndAdd') : t('panel.confirm'));

    return (
        <BottomSheet
            open={open}
            onOpenChange={(next) => {
                if (!next) closeFulfillmentPanel(false);
            }}
            title={t('panel.title')}
            description={`${options.reason ?? t('panel.reasonDefault')} ${t('panel.remember')}`}
            footer={
                <button
                    type="button"
                    onClick={confirm}
                    disabled={!ready}
                    data-testid="pj-fulfillment-confirm"
                    className="flex h-[52px] w-full cursor-pointer items-center justify-between rounded-full bg-pj-green px-5 text-base font-bold text-pj-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green disabled:cursor-not-allowed disabled:opacity-50">
                    <span>{confirmLabel}</span>
                    {options.amountLabel && <span>{options.amountLabel}</span>}
                </button>
            }>
            <div className="flex flex-col gap-3.5 pb-2">
                <div
                    role="group"
                    aria-label={t('panel.modeLabel')}
                    className="grid grid-cols-2 gap-1 rounded-xl bg-[#F4F3EE] p-1">
                    <button
                        type="button"
                        aria-pressed={mode === 'pickup'}
                        onClick={() => setMode('pickup')}
                        className={modeClass(mode === 'pickup')}>
                        {t('panel.pickup')}
                    </button>
                    <button
                        type="button"
                        aria-pressed={mode === 'delivery'}
                        onClick={() => setMode('delivery')}
                        className={modeClass(mode === 'delivery')}>
                        {t('panel.delivery')}
                    </button>
                </div>

                {mode === 'pickup' ? (
                    <PickupSection
                        selectedId={pickupStore?.id ?? null}
                        onSelect={setPickupStore}
                        asap={when.mode === 'asap'}
                        onProgram={onProgram}
                        savedStoreId={saved?.mode === 'pickup' ? saved.storeId : undefined}
                    />
                ) : (
                    <DeliverySection
                        value={delivery}
                        onChange={setDelivery}
                        apartment={apartment}
                        onApartmentChange={setApartment}
                    />
                )}

                <WhenSection store={activeStore} value={when} onChange={setWhen} />
            </div>
        </BottomSheet>
    );
}
