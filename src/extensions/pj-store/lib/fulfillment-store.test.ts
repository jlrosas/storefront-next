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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { deliveryWindow, formatKm, isStoreClosed, shortStoreName } from './store-info';
import {
    closeFulfillmentPanel,
    openFulfillmentPanel,
    notifyFulfillmentChanged,
    PJ_FULFILLMENT_EVENTS,
    requestFromEventDetail,
    getFulfillmentState,
    requireFulfillment,
    resetFulfillmentStore,
    saveFulfillment,
} from './fulfillment-store';

describe('store-info', () => {
    it('acorta el nombre y formatea la distancia', () => {
        expect(shortStoreName('Papa Johns El Bosque')).toBe('El Bosque');
        expect(formatKm(0.8)).toBe('0,8 km');
    });
    it('la ventana de delivery es ±5 min (40 → 35–45)', () => {
        expect(deliveryWindow({ c_pjDeliveryMinutes: 40 })).toEqual({ from: 35, to: 45 });
    });
    it('solo el interruptor c_pjClosed cierra una tienda', () => {
        expect(isStoreClosed({ c_pjClosed: true })).toBe(true);
        expect(isStoreClosed({})).toBe(false);
    });
});

describe('requireFulfillment', () => {
    beforeEach(() => {
        resetFulfillmentStore();
        document.cookie = 'pj_fulfillment=; Path=/; Max-Age=0';
        window.localStorage.clear();
    });

    it('sin modalidad abre el panel con el motivo y no llama al callback', () => {
        const onConfirmed = vi.fn();
        const done = requireFulfillment({ reason: 'Para agregar tu Pollo BBQ Familiar.', onConfirmed });
        expect(done).toBe(false);
        expect(getFulfillmentState().panel?.reason).toBe('Para agregar tu Pollo BBQ Familiar.');
        expect(onConfirmed).not.toHaveBeenCalled();
        closeFulfillmentPanel();
        expect(getFulfillmentState().panel).toBeNull();
    });

    it('con modalidad guardada llama al callback al instante y no abre el panel', () => {
        saveFulfillment({ mode: 'pickup', storeId: 'pj-48', when: 'asap' }, null);
        const onConfirmed = vi.fn();
        const done = requireFulfillment({ onConfirmed });
        expect(done).toBe(true);
        expect(onConfirmed).toHaveBeenCalledWith({ mode: 'pickup', storeId: 'pj-48', when: 'asap' });
        expect(getFulfillmentState().panel).toBeNull();
    });

    it('la modalidad se recuerda: queda en la cookie pj_fulfillment', () => {
        saveFulfillment({ mode: 'delivery', storeId: 'pj-9', address: 'Av. Providencia 1234', when: 'asap' }, null);
        expect(decodeURIComponent(document.cookie)).toContain('"storeId":"pj-9"');
        resetFulfillmentStore();
        requireFulfillment({ onConfirmed: () => undefined });
        expect(getFulfillmentState().fulfillment?.address).toBe('Av. Providencia 1234');
    });
});

describe('eventos de window', () => {
    beforeEach(() => {
        resetFulfillmentStore();
        document.cookie = 'pj_fulfillment=; Path=/; Max-Age=0';
    });

    it('cerrar sin elegir dispara pj:fulfillment-dismissed y onDismissed', () => {
        const handler = vi.fn();
        const onDismissed = vi.fn();
        window.addEventListener(PJ_FULFILLMENT_EVENTS.dismissed, handler);
        requireFulfillment({ onDismissed });
        closeFulfillmentPanel(false);
        window.removeEventListener(PJ_FULFILLMENT_EVENTS.dismissed, handler);
        expect(handler).toHaveBeenCalledTimes(1);
        expect(onDismissed).toHaveBeenCalled();
    });

    it('confirmar dispara pj:fulfillment-changed con la modalidad', () => {
        const handler = vi.fn();
        window.addEventListener(PJ_FULFILLMENT_EVENTS.changed, handler);
        notifyFulfillmentChanged({ mode: 'pickup', storeId: 'pj-48', when: 'asap' });
        window.removeEventListener(PJ_FULFILLMENT_EVENTS.changed, handler);
        expect((handler.mock.calls[0][0] as CustomEvent).detail.storeId).toBe('pj-48');
    });

    it('arma el motivo a partir del detail de pj:open-fulfillment', () => {
        expect(requestFromEventDetail({ reason: 'add-to-cart' })).toEqual({});
        expect(requestFromEventDetail({ productName: 'Pollo BBQ' }).reason).toBe('Para agregar tu Pollo BBQ.');
        expect(requestFromEventDetail({ reason: 'Para agregar tu combo.' }).reason).toBe('Para agregar tu combo.');
        expect(requestFromEventDetail({ amountLabel: '$16.900', confirmLabel: 'Confirmar y agregar' })).toEqual({
            amountLabel: '$16.900',
            confirmLabel: 'Confirmar y agregar',
        });
    });
});

describe('openFulfillmentPanel con el panel ya abierto (TIE-05)', () => {
    beforeEach(() => {
        resetFulfillmentStore();
    });

    it('suma la nueva solicitud a la pendiente sin perder onConfirmed, motivo ni monto', () => {
        const onConfirmed = vi.fn();
        openFulfillmentPanel({ onConfirmed, reason: 'Para agregar tu Super Dúo.', amountLabel: '$22.590' });
        openFulfillmentPanel({ initialMode: 'delivery' });
        const panel = getFulfillmentState().panel;
        expect(panel?.onConfirmed).toBe(onConfirmed);
        expect(panel?.reason).toBe('Para agregar tu Super Dúo.');
        expect(panel?.amountLabel).toBe('$22.590');
        expect(panel?.initialMode).toBe('delivery');
    });

    it('si las dos traen callback, al confirmar se llaman ambos', () => {
        const first = vi.fn();
        const second = vi.fn();
        openFulfillmentPanel({ onConfirmed: first });
        openFulfillmentPanel({ onConfirmed: second });
        getFulfillmentState().panel?.onConfirmed?.({ mode: 'pickup', storeId: 'pj-48', when: 'asap' });
        expect(first).toHaveBeenCalledTimes(1);
        expect(second).toHaveBeenCalledTimes(1);
    });

    it('cerrado, una apertura nueva parte de cero', () => {
        openFulfillmentPanel({ onConfirmed: vi.fn() });
        closeFulfillmentPanel(true);
        openFulfillmentPanel({});
        expect(getFulfillmentState().panel?.onConfirmed).toBeUndefined();
    });
});
