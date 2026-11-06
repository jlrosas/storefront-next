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
import { lazy, Suspense, useEffect, useState, type PropsWithChildren, type ReactElement } from 'react';
import { normalizeFulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import { useAuth } from '@/providers/auth';
import { fetchStoresNear, DEFAULT_CENTER } from '../hooks/use-stores-near';
import { deliveryWindowText } from '../lib/delivery-zones';
import {
    hydrateFulfillment,
    openFulfillmentPanel,
    PJ_FULFILLMENT_EVENTS,
    requestFromEventDetail,
    saveFulfillment,
    useFulfillment,
    usePanelRequest,
    type FulfillmentMeta,
} from '../lib/fulfillment-store';
import { pickupMinutes, shortStoreName } from '../lib/store-info';

// El panel pesa (hoja, Google Places): se carga la primera vez que alguien lo pide.
const FulfillmentPanel = lazy(() => import('../components/fulfillment-panel'));

/**
 * Mantiene al día la modalidad del encabezado: lee la cookie `pj_fulfillment` al hidratar, la
 * recupera del perfil si es un cliente con sesión sin cookie, y completa el nombre y el tiempo
 * de la tienda cuando solo se tiene su ID.
 */
function FulfillmentSync(): null {
    const session = useAuth();
    const registered = session?.userType === 'registered';
    const { fulfillment, meta } = useFulfillment();

    useEffect(() => {
        hydrateFulfillment();
        // Mecanismo estándar para otras extensiones (OFE, MEN, PRO): ver PJ_FULFILLMENT_EVENTS.
        const onOpen = (event: Event) => {
            event.preventDefault();
            openFulfillmentPanel(requestFromEventDetail((event as CustomEvent).detail));
        };
        // Otra extensión cambió la modalidad por su cuenta (cookie ya escrita): el chip se actualiza.
        const onChanged = () => hydrateFulfillment();
        window.addEventListener(PJ_FULFILLMENT_EVENTS.open, onOpen);
        window.addEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
        return () => {
            window.removeEventListener(PJ_FULFILLMENT_EVENTS.open, onOpen);
            window.removeEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
        };
    }, []);

    useEffect(() => {
        if (fulfillment || !registered) return;
        let cancelled = false;
        fetch('/resource/pj-fulfillment')
            .then((response) => response.json() as Promise<{ fulfillment?: unknown }>)
            .then((body) => {
                const restored = normalizeFulfillment(body.fulfillment);
                if (restored && !cancelled) saveFulfillment(restored, null);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
    }, [fulfillment, registered]);

    const storeId = fulfillment?.storeId;
    const hasMeta = meta?.storeId === storeId;
    useEffect(() => {
        if (!fulfillment || hasMeta) return;
        let cancelled = false;
        fetchStoresNear(DEFAULT_CENTER, { radiusKm: 200, limit: 200 })
            .then((stores) => {
                const store = stores.find((s) => s.id === fulfillment.storeId);
                if (!store || cancelled) return;
                const restored: FulfillmentMeta = {
                    storeId: store.id,
                    storeName: shortStoreName(store.name),
                    timeText:
                        fulfillment.mode === 'delivery' ? deliveryWindowText(store) : `${pickupMinutes(store)} min`,
                    addressText: fulfillment.address?.split(',')[0],
                };
                saveFulfillment(fulfillment, restored);
            })
            .catch(() => undefined);
        return () => {
            cancelled = true;
        };
        // La modalidad completa solo cambia junto con su ID de tienda.
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [storeId, hasMeta]);

    return null;
}

/**
 * Proveedor de la extensión (contextProviders de `target-config.json`): monta la sincronización
 * y el panel de modalidad, que otros agentes abren con `requireFulfillment()`.
 */
export default function FulfillmentProvider({ children }: PropsWithChildren): ReactElement {
    const request = usePanelRequest();
    const [everOpened, setEverOpened] = useState(false);
    useEffect(() => {
        if (request && !everOpened) setEverOpened(true);
    }, [request, everOpened]);
    return (
        <>
            {children}
            <FulfillmentSync />
            {(request || everOpened) && (
                <Suspense fallback={null}>
                    <FulfillmentPanel />
                </Suspense>
            )}
        </>
    );
}
