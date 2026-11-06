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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
import { afterEach, describe, expect, it } from 'vitest';
import {
    PJ_EVENTS,
    configureFallbackHref,
    changeFulfillment,
    ensureStore,
    hasStore,
    notifyFulfillmentChanged,
    notifyFulfillmentDismissed,
    requestConfigure,
    requestFulfillmentPanel,
    type ConfigureProductDetail,
    type OpenFulfillmentDetail,
} from './events';
import { PJ_FULFILLMENT_COOKIE, type Fulfillment } from './fulfillment';

const pickup: Fulfillment = { mode: 'pickup', storeId: 'pj-el-bosque', when: 'asap' };

function clearCookie() {
    document.cookie = `${PJ_FULFILLMENT_COOKIE}=; Path=/; Max-Age=0`;
}

afterEach(clearCookie);

describe('eventos de modalidad', () => {
    it('ensureStore resuelve true al instante si ya hay tienda', async () => {
        changeFulfillment(pickup);
        expect(hasStore()).toBe(true);
        await expect(ensureStore()).resolves.toBe(true);
    });

    it('sin tienda y sin panel montado (nadie llama a preventDefault) no bloquea', async () => {
        await expect(ensureStore()).resolves.toBe(true);
    });

    it('con panel: espera pj:fulfillment-changed (true) o pj:fulfillment-dismissed (false)', async () => {
        let received: OpenFulfillmentDetail | undefined;
        const panel = (event: CustomEvent<OpenFulfillmentDetail>) => {
            received = event.detail;
            event.preventDefault();
        };
        window.addEventListener(PJ_EVENTS.openFulfillment, panel);
        const confirmed = ensureStore({
            productName: 'Super Dúo',
            amountLabel: '$22.590',
            confirmLabel: 'Confirmar y agregar',
        });
        expect(received).toEqual({
            productName: 'Super Dúo',
            amountLabel: '$22.590',
            confirmLabel: 'Confirmar y agregar',
        });
        notifyFulfillmentChanged(pickup);
        await expect(confirmed).resolves.toBe(true);

        const dismissed = ensureStore();
        notifyFulfillmentDismissed();
        await expect(dismissed).resolves.toBe(false);
        window.removeEventListener(PJ_EVENTS.openFulfillment, panel);
    });

    it('requestFulfillmentPanel dice si alguien tomó el pedido', () => {
        expect(requestFulfillmentPanel()).toBe(false);
        const take = (event: Event) => event.preventDefault();
        window.addEventListener(PJ_EVENTS.openFulfillment, take);
        expect(requestFulfillmentPanel({ reason: 'add-to-cart' })).toBe(true);
        window.removeEventListener(PJ_EVENTS.openFulfillment, take);
    });

    it('changeFulfillment escribe la cookie y avisa', () => {
        let detail: Fulfillment | undefined;
        const onChanged = (event: CustomEvent<Fulfillment>) => {
            detail = event.detail;
        };
        window.addEventListener(PJ_EVENTS.fulfillmentChanged, onChanged);
        changeFulfillment(pickup);
        expect(detail).toEqual(pickup);
        expect(document.cookie).toContain(PJ_FULFILLMENT_COOKIE);
        window.removeEventListener(PJ_EVENTS.fulfillmentChanged, onChanged);
    });
});

describe('pj:configure-product', () => {
    it('devuelve true si PRO lo atiende y entrega el detail', () => {
        let got: ConfigureProductDetail | undefined;
        const pro = (event: CustomEvent<ConfigureProductDetail>) => {
            got = event.detail;
            event.preventDefault();
        };
        window.addEventListener(PJ_EVENTS.configureProduct, pro);
        expect(requestConfigure({ productId: 'pz-pollo-bbq', halfFirst: true, size: 'family' })).toBe(true);
        expect(got).toEqual({ productId: 'pz-pollo-bbq', halfFirst: true, size: 'family' });
        window.removeEventListener(PJ_EVENTS.configureProduct, pro);
        expect(requestConfigure({ productId: 'pz-pollo-bbq' })).toBe(false);
    });

    it('configureFallbackHref arma la ficha o el armador de mitades', () => {
        expect(configureFallbackHref({ productId: 'pz-pollo-bbq', size: 'family' })).toBe(
            '/p/pz-pollo-bbq?size=family'
        );
        expect(configureFallbackHref({ productId: 'pz-pollo-bbq', halfFirst: true })).toBe(
            '/p/pz-mitades?mitad1=pz-pollo-bbq'
        );
    });
});
