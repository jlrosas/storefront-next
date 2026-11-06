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
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { HomeHero } from './home-hero';
import type { OfferVM } from '../lib/types';

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock('@/extensions/pj-shared/hooks/use-reduced-motion', () => ({ useReducedMotion: () => reduced.value }));
vi.mock('@/components/link', () => ({
    Link: ({ to, children, ...rest }: any) => (
        <a href={to} {...rest}>
            {children}
        </a>
    ),
}));

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

describe('HomeHero', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        reduced.value = false;
    });
    afterEach(() => vi.useRealTimers());

    test('el precio dice «Antes» una sola vez para el lector de pantalla', () => {
        const { container } = render(<HomeHero offer={offer} />);
        const spoken = container.querySelector('.sr-only')?.textContent ?? '';
        expect(spoken.match(/Antes/g)).toHaveLength(1);
    });

    test('sin video: foto con movimiento lento', () => {
        render(<HomeHero offer={offer} />);
        expect(screen.getByTestId('pj-food-image')).toHaveAttribute('data-motion', 'running');
        expect(screen.queryByTestId('pj-home-hero-video')).not.toBeInTheDocument();
    });

    test('con video: se monta después del primer pintado, con póster y botón de pausa', () => {
        render(<HomeHero offer={offer} video="https://example.com/hero.mp4" />);
        expect(screen.queryByTestId('pj-home-hero-video')).not.toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        const video = screen.getByTestId('pj-home-hero-video') as HTMLVideoElement;
        expect(video.muted).toBe(true);
        expect(video.loop).toBe(true);
        expect(video).toHaveAttribute('poster');
        expect(screen.getByRole('button', { name: 'Pausar movimiento' })).toBeInTheDocument();
    });

    test('con «reducir movimiento» no hay video', () => {
        reduced.value = true;
        render(<HomeHero offer={offer} video="https://example.com/hero.mp4" />);
        act(() => {
            vi.advanceTimersByTime(1500);
        });
        expect(screen.queryByTestId('pj-home-hero-video')).not.toBeInTheDocument();
    });
});
