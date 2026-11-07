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
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ConfigProvider } from '@salesforce/storefront-next-runtime/config';
import { SiteProvider } from '@salesforce/storefront-next-runtime/site-context';
import { mockAltSiteObject, mockConfig } from '@/test-utils/config';
import { FulfillmentCard } from '../components/fulfillment-card';
import { CheckoutCta } from '../components/checkout-cta';
import type { CartFulfillment } from '../lib/types';

const site = mockAltSiteObject;
const locale = site.supportedLocales.find((l) => l.id === site.defaultLocale) ?? site.supportedLocales[0];

function renderUi(ui: ReactElement) {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: (
                    <ConfigProvider config={mockConfig}>
                        <SiteProvider
                            site={site}
                            locale={locale}
                            language={site.defaultLocale}
                            currency={site.defaultCurrency}>
                            {ui}
                        </SiteProvider>
                    </ConfigProvider>
                ),
            },
        ],
        { initialEntries: ['/'] }
    );
    return render(<RouterProvider router={router} />);
}

const pickup: CartFulfillment = {
    mode: 'pickup',
    storeId: 'pj-48',
    storeName: 'El Bosque',
    address: null,
    when: 'asap',
    pickupMinutes: 15,
    deliveryMinutes: 40,
    openUntil: '23:30',
    closed: false,
    opensAt: '12:00',
};

describe('FulfillmentCard (UX-3 §3.2 y §3.9)', () => {
    it('retiro: tienda, tiempo y horario, sin «despacho»', async () => {
        renderUi(<FulfillmentCard fulfillment={pickup} />);
        const card = await screen.findByTestId('pj-cart-fulfillment');
        expect(card.textContent).toContain('El Bosque');
        expect(card.textContent).toContain('15');
        expect(card.textContent).toContain('23:30');
        expect(card.textContent?.toLowerCase()).not.toContain('despacho');
    });

    it('delivery: el mismo rango que el encabezado (35–45 min)', async () => {
        renderUi(
            <FulfillmentCard
                fulfillment={{ ...pickup, mode: 'delivery', storeName: 'Salvador', address: 'Av. Providencia 1234' }}
            />
        );
        const card = await screen.findByTestId('pj-cart-fulfillment');
        expect(card.textContent).toContain('35–45');
        expect(card.textContent).toContain('Salvador');
    });

    it('tienda cerrada: granate con la hora de apertura y dos salidas', async () => {
        renderUi(<FulfillmentCard fulfillment={{ ...pickup, storeName: 'Providencia', closed: true }} />);
        const card = await screen.findByTestId('pj-cart-fulfillment');
        expect(card.getAttribute('data-closed')).toBe('true');
        expect(card.className).toContain('surface-sauce');
        expect(card.textContent).toContain('Providencia');
        expect(card.textContent).toContain('12:00');
        expect(card.querySelectorAll('button')).toHaveLength(2);
    });
});

describe('CheckoutCta (UX-3 §3.8)', () => {
    it('con el monto y su aria-label', async () => {
        renderUi(<CheckoutCta total={23890} block={null} missing={0} registered />);
        const cta = await screen.findByTestId('pj-cart-checkout');
        expect(cta.textContent).toContain('23.890');
        expect(cta.getAttribute('aria-label')).toContain('23.890');
        expect(cta.getAttribute('href')).toContain('/checkout');
    });

    it('sin sesión lleva al ingreso y vuelve al checkout', async () => {
        renderUi(<CheckoutCta total={23890} block={null} missing={0} registered={false} />);
        const cta = await screen.findByTestId('pj-cart-checkout');
        expect(cta.getAttribute('href')).toContain('/login?returnUrl=');
    });

    it('bloqueado: contorno con la razón en el propio botón', async () => {
        renderUi(<CheckoutCta total={7980} block="minimum" missing={3010} registered />);
        const cta = await screen.findByTestId('pj-cart-checkout');
        expect(cta).toBeDisabled();
        expect(cta.getAttribute('data-block')).toBe('minimum');
        expect(cta.textContent).toContain('3.010');
    });
});
