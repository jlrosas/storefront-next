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
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ConfigProvider } from '@salesforce/storefront-next-runtime/config';
import { SiteProvider } from '@salesforce/storefront-next-runtime/site-context';
import { mockAltSiteObject, mockConfig } from '@/test-utils/config';
import { PizzaCard } from '../pizza-card';
import type { MenuProduct } from '../../lib/menu-model';

const site = mockAltSiteObject;
const locale = site.supportedLocales.find((l) => l.id === site.defaultLocale) ?? site.supportedLocales[0];

function renderCard(ui: ReactElement) {
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

const pizza: MenuProduct = {
    id: 'pz-pollo-bbq',
    name: 'Pollo BBQ',
    kind: 'pizza' as MenuProduct['kind'],
    image: { src: 'https://example.com/pollo-bbq.jpg', alt: 'Pollo BBQ' },
    price: 13000,
    listPrice: null,
    sensory: 'Pollo jugoso y tocino crujiente sobre salsa BBQ ahumada.',
    rating: 4.7,
    reviews: 1240,
    serves: null,
    badges: ['mas-pedida'],
    foodTypes: [],
    halves: true,
    weeklyOrders: 320,
    sizes: { family: { id: 'pz-pollo-bbq-fam', price: 16900 } },
    validFrom: null,
    validTo: null,
};

describe('PizzaCard (MEN-05)', () => {
    it('lleva el «+» lima de 44 px sobre la foto, el sello en Garlic + Basil y zoom al pasar el cursor', () => {
        renderCard(<PizzaCard product={pizza} size="family" />);
        const plus = screen.getByTestId('pj-menu-pizza-plus');
        expect(plus.className).toContain('bg-pj-pepperoncini');
        expect(plus.className).toContain('size-11');
        expect(plus).toHaveAttribute('aria-label');
        const badge = screen.getByTestId('pj-menu-pizza-badge');
        expect(badge.className).toContain('bg-pj-garlic');
        expect(badge.className).toContain('text-pj-basil');
        const img = screen.getByTestId('pj-food-image').querySelector('img');
        expect(img?.className).toContain('group-hover:[transform:scale(1.05)]');
        expect(screen.getByTestId('pj-menu-pizza-card').className).toContain('shadow-pj-card');
    });

    it('«½ Mitad» se muestra completo en todos los anchos (F8) y el precio va en Rich Sauce', () => {
        renderCard(<PizzaCard product={pizza} size="family" />);
        const half = screen.getByTestId('pj-menu-pizza-half');
        const labels = half.querySelectorAll('span');
        expect(labels).toHaveLength(1);
        expect(labels[0].className).not.toMatch(/hidden/);
        expect(screen.getByTestId('pj-menu-pizza-price').querySelector('.text-pj-sauce')).toHaveTextContent('$');
    });

    it('N14: el «+» de la foto es el único «Agregar» y «½ Mitad» queda como acción secundaria de 44 px', () => {
        renderCard(<PizzaCard product={pizza} size="family" />);
        expect(screen.queryByTestId('pj-menu-pizza-add')).toBeNull();
        expect(screen.getAllByRole('link', { name: 'Agregar Pollo BBQ' })).toHaveLength(1);
        expect(screen.getByTestId('pj-menu-pizza-half').className).toContain('min-h-[44px]');
    });
});
