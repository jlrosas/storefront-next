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
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { FirstOrderStrip } from './home-blocks';
import { Moments, Occasions } from './home-diego';
import { HomeHero } from './home-hero';
import { Favorites, RedeemCard } from './home-sofia';
import { heroTitle, momentFor } from '../lib/constants';
import type { FavoriteVM, MomentVM, OfferVM, SofiaVM } from '../lib/types';

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
vi.mock('@/hooks/use-navigate', () => ({ useNavigate: () => vi.fn() }));

const offer: OfferVM = {
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

const moments: MomentVM[] = [
    {
        id: 'partido',
        offer: {
            ...offer,
            id: 'cb-super-trio',
            name: 'Super Trío',
            imageAlt: 'Super Trío',
            image: 'https://example.com/trio.jpg',
        },
    },
    { id: 'celebracion', offer: { ...offer, id: 'cb-papa-combo-postre', name: 'Papa Combo con Postre' } },
];

const fav = (id: string, name: string): FavoriteVM => ({
    id,
    name,
    image: 'https://example.com/f.jpg',
    imageAlt: name,
    times: 3,
    price: 16900,
    href: `/p/${id}`,
});

const redeem = { id: 'pz-super-pepperoni', name: 'Super Pepperoni', image: 'https://example.com/p.jpg', points: 260 };

describe('Home HOM-08', () => {
    test('N3: titular corto en el hero de temporada; el del anuncio queda igual', () => {
        expect(heroTitle('Pizza del Mes The Works Familiar')).toBe('The Works Familiar');
        expect(heroTitle('Super Dúo')).toBe('Super Dúo');
        render(<HomeHero offer={offer} animate={false} />);
        expect(screen.getByRole('heading', { level: 1, name: 'The Works Familiar' })).toBeInTheDocument();
        // La foto baja al 51 % del alto para que el precio y el CTA entren en el primer pliegue.
        expect(screen.getByTestId('pj-home-hero-photo')).toHaveClass('h-[51svh]');
    });

    test('N8: Diego tiene la franja granate «Primer pedido directo: +100 Papa Puntos»', () => {
        render(<FirstOrderStrip />);
        const strip = screen.getByTestId('pj-home-first-order');
        expect(strip).toHaveClass('surface-sauce');
        expect(strip).toHaveTextContent('Primer pedido directo: +100 Papa Puntos');
    });

    test('N8: el momento de Diego es suyo (partido o almuerzo) y distinto del de Valentina', () => {
        expect(momentFor('diego', null)).toBe('partido');
        expect(momentFor('diego', 'almuerzo')).toBe('almuerzo');
        expect(momentFor('diego', 'bajon')).toBe('partido');
        expect(momentFor('valentina', null)).toBe('celebracion');
        expect(momentFor('valentina', 'partido')).toBe('celebracion');
        expect(momentFor('valentina', 'bajon')).toBe('bajon');
    });

    test('N8: con la foto del momento, la foto grande es la del combo y la tarjeta no la repite', () => {
        render(<Moments items={moments} initial="partido" photoFromOffer />);
        const block = screen.getByTestId('pj-home-moments');
        const imgs = within(block).getAllByRole('img');
        expect(imgs).toHaveLength(1);
        expect(imgs[0]).toHaveAttribute('alt', 'Super Trío');
    });

    test('N16: «¿Hay algo que celebrar?» lleva AccentWord solo en «celebrar»', () => {
        render(<Moments items={moments} initial="partido" />);
        expect(screen.queryByTestId('pj-accent-word')).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Celebración' }));
        const accent = screen.getByTestId('pj-accent-word');
        expect(accent).toHaveTextContent(/^celebrar$/);
        expect(accent.parentElement).toHaveTextContent('¿Hay algo que celebrar?');
    });

    test('#65: «Tus favoritas» suma la Super Pepperoni mediana para canjear como tercera tarjeta, en Garlic', () => {
        render(
            <Favorites
                items={[fav('pz-pollo-bbq', 'Pollo BBQ'), fav('pz-todas-las-carnes', 'Todas las Carnes')]}
                redeem={redeem}
            />
        );
        expect(screen.getAllByRole('listitem')).toHaveLength(3);
        const card = screen.getByTestId('pj-home-fav-redeem');
        expect(card).toHaveClass('surface-garlic');
        expect(card).toHaveTextContent('Super Pepperoni mediana');
        expect(card).toHaveTextContent('Canjéala con tus puntos');
        expect(within(card).getByRole('link')).toHaveAttribute('href', '/puntos');
    });

    test('#65: sin espacio en la fila (3 favoritas) no se agrega la de canje', () => {
        render(<Favorites items={[fav('a', 'A'), fav('b', 'B'), fav('c', 'C')]} redeem={redeem} />);
        expect(screen.queryByTestId('pj-home-fav-redeem')).not.toBeInTheDocument();
    });

    test('#65: la barra de puntos es lima sobre una pista Dough al 20 %', () => {
        const sofia: SofiaVM = { firstName: 'Sofía', points: 200, live: true, lastOrder: null, favorites: [], redeem };
        render(<RedeemCard sofia={sofia} />);
        const bar = screen.getByRole('progressbar');
        expect(bar).toHaveClass('bg-pj-dough/20');
        expect(bar.firstElementChild).toHaveClass('bg-pj-pepperoncini');
        expect(bar.firstElementChild).not.toHaveClass('bg-pj-tomato');
    });

    test('#63: en «Para 3» la nota va en la misma línea del precio en escritorio', () => {
        render(
            <Occasions
                items={[
                    {
                        key: 'para-3',
                        name: 'x',
                        price: 20470,
                        listPrice: null,
                        image: 'https://example.com/c.jpg',
                        imageAlt: 'Para 3',
                        href: null,
                        lines: [{ productId: 'cb-pizza-del-mes', name: 'The Works', price: 10990 }],
                    },
                ]}
            />
        );
        expect(screen.getByText('armado para 3')).toHaveClass('lg:basis-auto');
    });
});
