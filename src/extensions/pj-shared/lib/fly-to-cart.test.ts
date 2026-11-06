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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bumpCartCount, findSourceImage, flyToCart } from './fly-to-cart';

const originalAnimate = Object.getOwnPropertyDescriptor(Element.prototype, 'animate');
const originalRect = Object.getOwnPropertyDescriptor(Element.prototype, 'getBoundingClientRect');
const originalMatchMedia = window.matchMedia;

function mockReducedMotion(reduce: boolean) {
    window.matchMedia = ((query: string) => ({
        matches: reduce && query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => true,
    })) as typeof window.matchMedia;
}

let animate: ReturnType<typeof vi.fn>;

beforeEach(() => {
    document.body.innerHTML = `
        <header><a data-testid="pj-header-cart" href="/cart">Pedido <span data-pj-cart-count>1</span></a></header>
        <article id="card">
            <div data-testid="pj-food-image"><img src="/pollo-bbq.jpg" alt="Pollo BBQ" /></div>
            <button id="add">Agregar</button>
        </article>`;
    Element.prototype.getBoundingClientRect = () =>
        ({
            x: 10,
            y: 10,
            left: 10,
            top: 10,
            width: 100,
            height: 80,
            right: 110,
            bottom: 90,
            toJSON: () => ({}),
        }) as DOMRect;
    animate = vi.fn(() => ({ finished: Promise.resolve() }));
    Element.prototype.animate = animate as unknown as typeof Element.prototype.animate;
});

afterEach(() => {
    if (originalAnimate) Object.defineProperty(Element.prototype, 'animate', originalAnimate);
    else delete (Element.prototype as Partial<Element>).animate;
    if (originalRect) Object.defineProperty(Element.prototype, 'getBoundingClientRect', originalRect);
    window.matchMedia = originalMatchMedia;
});

describe('flyToCart y bumpCartCount (VIS-05)', () => {
    it('encuentra la foto de la tarjeta a partir del botón tocado', () => {
        expect(findSourceImage(document.getElementById('add'))?.getAttribute('src')).toBe('/pollo-bbq.jpg');
        expect(findSourceImage(document.querySelector('header a'))).toBeNull();
    });

    it('una miniatura vuela 450 ms al carrito, se quita y el contador salta 250 ms', async () => {
        mockReducedMotion(false);
        await flyToCart(document.getElementById('add'));
        expect(animate).toHaveBeenCalledTimes(2);
        expect(animate.mock.calls[0][1]).toMatchObject({ duration: 450 });
        expect(animate.mock.calls[1][1]).toMatchObject({ duration: 250 });
        expect(animate.mock.calls[1][0]).toEqual([
            { transform: 'scale(1)' },
            { transform: 'scale(1.25)' },
            { transform: 'scale(1)' },
        ]);
        expect(document.querySelector('[data-testid="pj-fly-to-cart"]')).toBeNull();
    });

    it('con «reducir movimiento» no vuela ni salta', async () => {
        mockReducedMotion(true);
        await flyToCart(document.getElementById('add'));
        bumpCartCount();
        expect(animate).not.toHaveBeenCalled();
    });
});
