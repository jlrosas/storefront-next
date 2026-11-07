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
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { PJ_EVENTS, type ConfigureProductDetail } from '@/extensions/pj-shared/lib/events';
import { Popular } from './home-blocks';
import { HomeHero } from './home-hero';
import { Favorites, MonthCard } from './home-sofia';
import { offerHref, pizzaConfigure } from '../lib/constants';
import type { FavoriteVM, OfferVM, PopularVM } from '../lib/types';

vi.mock('@/components/link', () => ({
    Link: ({ to, children, ...rest }: any) => (
        <a href={to} {...rest}>
            {children}
        </a>
    ),
}));
vi.mock('react-router', async (orig) => ({
    ...(await orig<object>()),
    useFetcher: () => ({ state: 'idle', data: undefined, submit: vi.fn() }),
}));

const combo: OfferVM = {
    id: 'cb-pizza-del-mes',
    name: 'Pizza del Mes The Works Familiar',
    price: 10990,
    listPrice: 21900,
    image: 'https://example.com/a.jpg',
    imageAlt: 'The Works',
    serves: null,
    sensory: null,
    href: '/p/cb-pizza-del-mes',
};
const pizza: OfferVM = { ...combo, id: 'pz-the-works', name: 'The Works', href: '/p/pz-the-works' };

const popular: PopularVM = {
    id: 'pz-pollo-bbq',
    name: 'Pollo BBQ',
    badge: null,
    rating: 4.7,
    weekly: 320,
    sensory: null,
    familyPrice: 16900,
    image: 'https://example.com/p.jpg',
    imageAlt: 'Pollo BBQ',
    href: '/p/pz-pollo-bbq',
    quickAddId: 'pz-pollo-bbq-family-traditional',
};

const favorite: FavoriteVM = {
    id: 'pz-pollo-bbq',
    name: 'Pollo BBQ',
    image: 'https://example.com/f.jpg',
    imageAlt: 'Pollo BBQ',
    times: 4,
    price: 16900,
    href: '/p/pz-pollo-bbq',
};

/** Escucha `pj:configure-product` como lo hace PRO (atiende con `preventDefault`). */
function listenConfigure(handled = true) {
    const seen: ConfigureProductDetail[] = [];
    const handler = (event: Event) => {
        seen.push((event as CustomEvent<ConfigureProductDetail>).detail);
        if (handled) event.preventDefault();
    };
    window.addEventListener(PJ_EVENTS.configureProduct, handler);
    return { seen, stop: () => window.removeEventListener(PJ_EVENTS.configureProduct, handler) };
}

describe('Entradas de compra de la Home (HOM-09, AUD-compra)', () => {
    let listener: ReturnType<typeof listenConfigure>;
    beforeEach(() => {
        listener = listenConfigure();
    });
    afterEach(() => listener.stop());

    test('S-D3: Super Dúo y Super Trío van al constructor; los otros combos, a su ficha', () => {
        expect(offerHref('cb-super-duo')).toBe('/promos/super-duo');
        expect(offerHref('cb-super-trio')).toBe('/promos/super-trio');
        expect(offerHref('cb-pizza-del-mes')).toBe('/p/cb-pizza-del-mes');
        expect(offerHref('cb-papa-flash')).toBe('/p/cb-papa-flash');
    });

    test('solo las pizzas abren la hoja', () => {
        expect(pizzaConfigure('pz-pollo-bbq', 'family')).toEqual({ productId: 'pz-pollo-bbq', size: 'family' });
        expect(pizzaConfigure('pz-arma-tu-pizza')).toEqual({ productId: 'pz-arma-tu-pizza', builder: 'arma-tu-pizza' });
        expect(pizzaConfigure('cb-pizza-del-mes')).toBeNull();
        expect(pizzaConfigure('cp-coca-cola')).toBeNull();
    });

    test('P1-1: el «+» de una pizza destacada abre la hoja con la Familiar, sin agregar', () => {
        render(<Popular items={[popular]} />);
        const plus = screen.getByTestId('pj-home-card-plus');
        expect(plus).toHaveAttribute('href', '/p/pz-pollo-bbq?size=family');
        expect(fireEvent.click(plus)).toBe(false);
        expect(listener.seen).toEqual([{ productId: 'pz-pollo-bbq', size: 'family' }]);
    });

    test('sin la hoja de PRO montada, el «+» sigue el enlace a la ficha', () => {
        listener.stop();
        listener = listenConfigure(false);
        render(<Popular items={[popular]} />);
        const plus = screen.getByTestId('pj-home-card-plus');
        // `fireEvent` devuelve `false` si alguien llamó a `preventDefault()`: aquí el enlace navega.
        expect(fireEvent.click(plus)).toBe(true);
        expect(plus).toHaveAttribute('href', '/p/pz-pollo-bbq?size=family');
    });

    test('P0-3: el hero de un combo lleva a su destino; el de una pizza abre la hoja', () => {
        const { unmount } = render(<HomeHero offer={combo} />);
        const cta = screen.getByTestId('pj-home-hero-cta');
        expect(cta).toHaveAttribute('href', '/p/cb-pizza-del-mes');
        fireEvent.click(cta);
        expect(listener.seen).toEqual([]);
        unmount();

        render(<HomeHero offer={pizza} />);
        fireEvent.click(screen.getByTestId('pj-home-hero-cta'));
        expect(listener.seen).toEqual([{ productId: 'pz-the-works', size: 'family' }]);
    });

    test('el destino de Page Designer manda sobre la hoja', () => {
        render(<HomeHero offer={pizza} ctaHref="/promos/super-duo" />);
        const cta = screen.getByTestId('pj-home-hero-cta');
        expect(cta).toHaveAttribute('href', '/promos/super-duo');
        fireEvent.click(cta);
        expect(listener.seen).toEqual([]);
    });

    test('P1-2: «Agregar · $16.900» de una favorita abre la hoja sobre la Home', () => {
        render(<Favorites items={[favorite]} />);
        const add = screen.getByTestId('pj-home-fav-add');
        expect(add).toHaveTextContent('$16.900');
        expect(fireEvent.click(add)).toBe(false);
        expect(listener.seen).toEqual([{ productId: 'pz-pollo-bbq', size: 'family' }]);
    });

    test('la Pizza del Mes de Sofía (combo) va a su ficha', () => {
        render(<MonthCard offer={combo} />);
        const link = screen.getByRole('link', { name: /Agregar Pizza del Mes/ });
        expect(link).toHaveAttribute('href', '/p/cb-pizza-del-mes');
        fireEvent.click(link);
        expect(listener.seen).toEqual([]);
    });
});
