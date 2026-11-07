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
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    getFulfillmentState,
    openFulfillmentPanel,
    PJ_FULFILLMENT_EVENTS,
    resetFulfillmentStore,
} from '../lib/fulfillment-store';
import FulfillmentPanel from './fulfillment-panel';

vi.mock('@/extensions/store-locator/providers/store-locator', () => ({
    useStoreLocator: (selector: (s: { setSelectedStoreInfo: () => void }) => unknown) =>
        selector({ setSelectedStoreInfo: () => undefined }),
}));
vi.mock('@/providers/google-cloud-api', () => ({
    default: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('react-router', async (importOriginal) => ({
    ...(await importOriginal<typeof import('react-router')>()),
    useFetcher: () => ({ submit: vi.fn(), state: 'idle', data: undefined }),
}));

const EL_BOSQUE = {
    id: 'pj-48',
    name: 'Papa Johns El Bosque',
    address1: 'Tobalaba 201',
    city: 'Las Condes',
    distance: 0.8,
    c_pjPickupMinutes: 15,
};

/** `/resource/stores` que responde cuando la prueba lo decide («el panel termina de cargar»). */
function deferStores() {
    let release: () => void = () => undefined;
    const ready = new Promise<void>((resolve) => {
        release = resolve;
    });
    vi.stubGlobal(
        'fetch',
        vi.fn(async (input: RequestInfo | URL) => {
            if (String(input).includes('stores')) {
                await ready;
                return new Response(JSON.stringify({ success: true, stores: { data: [EL_BOSQUE] } }));
            }
            return new Response('{}');
        })
    );
    return () =>
        act(async () => {
            release();
            await ready;
        });
}

describe('Panel de modalidad · Confirmar antes de que cargue (TIE-05, reportado por OFE-06)', () => {
    beforeEach(() => {
        resetFulfillmentStore();
        document.cookie = 'pj_fulfillment=; Path=/; Max-Age=0';
        window.localStorage.clear();
    });
    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it('Confirmar queda deshabilitado y avisa que carga hasta que llegan las tiendas', async () => {
        const releaseStores = deferStores();
        const onConfirmed = vi.fn();
        openFulfillmentPanel({ onConfirmed });
        render(<FulfillmentPanel />);

        const confirm = screen.getByTestId('pj-fulfillment-confirm');
        expect(confirm).toBeDisabled();
        expect(confirm).toHaveAttribute('aria-busy', 'true');
        fireEvent.click(confirm);
        expect(onConfirmed).not.toHaveBeenCalled();
        expect(getFulfillmentState().panel).not.toBeNull();

        await releaseStores();
        await waitFor(() => expect(screen.getByTestId('pj-fulfillment-confirm')).toBeEnabled());
        expect(screen.getByTestId('pj-fulfillment-confirm')).not.toHaveAttribute('aria-busy');
    });

    it('al confirmar después de cargar, retoma el agregado pendiente (onConfirmed y pj:fulfillment-changed)', async () => {
        const releaseStores = deferStores();
        const onConfirmed = vi.fn();
        const onChanged = vi.fn();
        window.addEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
        openFulfillmentPanel({ onConfirmed, amountLabel: '$22.590' });
        render(<FulfillmentPanel />);

        fireEvent.click(screen.getByTestId('pj-fulfillment-confirm'));
        await releaseStores();
        await waitFor(() => expect(screen.getByTestId('pj-fulfillment-confirm')).toBeEnabled());
        fireEvent.click(screen.getByTestId('pj-fulfillment-confirm'));

        expect(onConfirmed).toHaveBeenCalledTimes(1);
        expect(onConfirmed).toHaveBeenCalledWith({ mode: 'pickup', storeId: 'pj-48', when: 'asap' });
        expect(onChanged).toHaveBeenCalledTimes(1);
        expect(getFulfillmentState().panel).toBeNull();
        window.removeEventListener(PJ_FULFILLMENT_EVENTS.changed, onChanged);
    });

    it('el primer render ya trae la solicitud: el botón dice «Confirmar y agregar» desde el inicio', () => {
        deferStores();
        openFulfillmentPanel({ onConfirmed: vi.fn() });
        render(<FulfillmentPanel />);
        expect(screen.getByTestId('pj-fulfillment-confirm').textContent).toContain('Confirmar y agregar');
    });

    it('una segunda apertura mientras carga no pierde el agregado pendiente ni reinicia el panel', async () => {
        const releaseStores = deferStores();
        const onConfirmed = vi.fn();
        openFulfillmentPanel({ onConfirmed });
        render(<FulfillmentPanel />);
        // Otro pj:open-fulfillment (sin callback) mientras el panel todavía carga.
        act(() => openFulfillmentPanel({}));

        await releaseStores();
        await waitFor(() => expect(screen.getByTestId('pj-fulfillment-confirm')).toBeEnabled());
        fireEvent.click(screen.getByTestId('pj-fulfillment-confirm'));
        expect(onConfirmed).toHaveBeenCalledTimes(1);
    });
});
