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
import { describe, expect, test, vi } from 'vitest';
import { Benefits, GreetingStrip, IntentRail } from './home-blocks';
import { MonthCard } from './home-sofia';
import type { IntentVM, OfferVM } from '../lib/types';

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

describe('bloques de la Home (HOM-07)', () => {
    test('la franja de saludo va en Garlic + Sauce con el texto nuevo', () => {
        render(<GreetingStrip />);
        const strip = screen.getByTestId('pj-home-greeting');
        expect(strip).toHaveClass('surface-garlic');
        expect(strip).toHaveTextContent('¡Volviste! Este pedido suma Papa Puntos al doble.');
    });

    test('la lealtad va en Rich Sauce, con «Pedir directo tiene premio»', () => {
        render(<Benefits />);
        expect(screen.getByTestId('pj-home-benefits')).toHaveClass('surface-sauce');
        expect(screen.getByRole('heading', { name: 'Pedir directo tiene premio' })).toBeInTheDocument();
    });

    test('F7: la Pizza del mes de Sofía no depende del día de la semana', () => {
        const { rerender } = render(<MonthCard offer={offer} moment="partido" />);
        expect(screen.getByText('Para el partido · Pizza del mes')).toBeInTheDocument();
        rerender(<MonthCard offer={offer} moment={null} />);
        expect(screen.getByText('Pizza del mes')).toBeInTheDocument();
        expect(screen.queryByText(/viernes/i)).not.toBeInTheDocument();
    });

    test('carrusel por intención: pestañas con aria-pressed y tarjetas con «+»', () => {
        const intents: IntentVM[] = [
            {
                id: 'compartir',
                items: [
                    {
                        id: 'a',
                        name: 'Super Dúo',
                        image: 'https://x.test/a.jpg',
                        imageAlt: '',
                        price: 22590,
                        listPrice: null,
                        from: false,
                        rating: 4.8,
                        href: '/promos/super-duo',
                    },
                    {
                        id: 'b',
                        name: 'Super Trío',
                        image: 'https://x.test/b.jpg',
                        imageAlt: '',
                        price: 31990,
                        listPrice: null,
                        from: false,
                        rating: null,
                        href: '/promos/super-trio',
                    },
                ],
            },
            {
                id: 'economico',
                items: [
                    {
                        id: 'c',
                        name: 'Papa Flash',
                        image: 'https://x.test/c.jpg',
                        imageAlt: '',
                        price: 5490,
                        listPrice: null,
                        from: false,
                        rating: null,
                        href: '/p/c',
                    },
                    {
                        id: 'd',
                        name: 'Napolitana',
                        image: 'https://x.test/d.jpg',
                        imageAlt: '',
                        price: 9900,
                        listPrice: null,
                        from: true,
                        rating: null,
                        href: '/p/d',
                    },
                ],
            },
        ];
        render(<IntentRail intents={intents} />);
        expect(screen.getByRole('button', { name: 'Para compartir' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('link', { name: 'Ver Super Dúo' })).toHaveAttribute('href', '/promos/super-duo');
        fireEvent.click(screen.getByRole('button', { name: 'Menos de $15 mil' }));
        expect(screen.getByText('Papa Flash')).toBeInTheDocument();
    });
});
