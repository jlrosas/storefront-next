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
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { getTranslation } from '@salesforce/storefront-next-runtime/i18n';
import { FoodImage } from '../food-image';

const { t } = getTranslation();
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

afterEach(() => {
    window.matchMedia = originalMatchMedia;
});

describe('FoodImage (R4.7)', () => {
    it('se anima y tiene botón de pausa cuando el sistema no pide reducir movimiento', () => {
        mockReducedMotion(false);
        render(<FoodImage src="/pizza.jpg" alt="Pollo BBQ con queso estirándose" animate />);

        const wrapper = screen.getByTestId('pj-food-image');
        expect(wrapper).toHaveAttribute('data-motion', 'running');
        expect(screen.getByRole('img', { name: 'Pollo BBQ con queso estirándose' }).className).toContain(
            'pj-ken-burns'
        );

        const toggle = screen.getByRole('button', { name: t('extPjShared:foodImage.pause') });
        expect(toggle).toHaveAttribute('aria-pressed', 'false');

        fireEvent.click(toggle);
        expect(wrapper).toHaveAttribute('data-motion', 'paused');
        expect(screen.getByRole('img')).toHaveStyle({ animationPlayState: 'paused' });
        expect(screen.getByRole('button', { name: t('extPjShared:foodImage.play') })).toHaveAttribute(
            'aria-pressed',
            'true'
        );

        fireEvent.click(screen.getByRole('button', { name: t('extPjShared:foodImage.play') }));
        expect(wrapper).toHaveAttribute('data-motion', 'running');
    });

    it('no se mueve ni muestra pausa con «reducir movimiento»', () => {
        mockReducedMotion(true);
        render(<FoodImage src="/pizza.jpg" alt="Pizza" animate />);

        expect(screen.getByTestId('pj-food-image')).toHaveAttribute('data-motion', 'none');
        expect(screen.getByRole('img').className).not.toContain('pj-ken-burns');
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('sin animate es una foto quieta, con srcset, aspecto reservado y carga diferida', () => {
        mockReducedMotion(false);
        render(
            <FoodImage
                src="/pizza-640.jpg"
                srcSet="/pizza-640.jpg 640w, /pizza-1280.jpg 1280w"
                sizes="50vw"
                aspect="4/3"
                alt="Pizza"
            />
        );
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('srcset', '/pizza-640.jpg 640w, /pizza-1280.jpg 1280w');
        expect(img).toHaveAttribute('sizes', '50vw');
        expect(img).toHaveAttribute('loading', 'lazy');
        expect(screen.getByTestId('pj-food-image')).toHaveStyle({ aspectRatio: '4/3' });
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('priority carga la imagen de inmediato (LCP)', () => {
        render(<FoodImage src="/hero.jpg" alt="Hero" priority />);
        expect(screen.getByRole('img')).toHaveAttribute('loading', 'eager');
        expect(screen.getByRole('img')).toHaveAttribute('fetchpriority', 'high');
    });

    it('crop macro, hero y combo acercan la foto sin letterbox; none la deja tal cual (VIS-01)', () => {
        const { rerender } = render(<FoodImage src="/pizza.jpg" alt="Pizza" crop="macro" />);
        const wrapper = screen.getByTestId('pj-food-image');
        expect(wrapper).toHaveAttribute('data-crop', 'macro');
        expect(screen.getByRole('img').className).toContain('object-cover');
        expect(screen.getByRole('img').className).toContain('scale-[1.45]');
        expect(screen.getByRole('img').className).toContain('object-[50%_60%]');

        rerender(<FoodImage src="/pizza.jpg" alt="Pizza" crop="hero" />);
        expect(screen.getByRole('img').className).toContain('scale-[1.55]');
        expect(screen.getByRole('img').className).toContain('lg:scale-[1.35]');

        rerender(<FoodImage src="/pizza.jpg" alt="Pizza" crop="combo" />);
        expect(screen.getByRole('img').className).toContain('object-[0%_55%]');
        expect(screen.getByRole('img').className).toContain('scale-[1.7]');

        rerender(<FoodImage src="/pizza.jpg" alt="Pizza" />);
        expect(screen.getByTestId('pj-food-image')).toHaveAttribute('data-crop', 'none');
        expect(screen.getByRole('img').className).not.toContain('scale-');
    });

    describe('nitidez (VIS-06, UX-2 N1)', () => {
        const DIS =
            'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/ZYFJ_001/on/demandware.static/-/x/images/pollo-bbq.jpg';

        it('pide al DIS según lo pintado: srcset hasta 1.440 y sizes × escala del recorte', () => {
            mockReducedMotion(false);
            render(
                <FoodImage
                    src={`${DIS}?sw=780`}
                    srcSet={`${DIS}?sw=480 480w, ${DIS}?sw=1600 1600w`}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    alt="Pizza"
                    crop="macro"
                />
            );
            const img = screen.getByRole('img');
            const widths = (img.getAttribute('srcset') ?? '').split(', ').map((c) => c.split(' ')[1]);
            expect(widths).toEqual(['320w', '480w', '640w', '800w', '960w', '1200w', '1440w']);
            expect(img.getAttribute('srcset')).not.toContain('sw=1600');
            expect(img).toHaveAttribute('sizes', '(min-width: 1024px) calc(50vw * 1.45), calc(100vw * 1.45)');
        });

        it('sin srcSet arma uno para las fotos del DIS', () => {
            render(<FoodImage src={DIS} alt="Pizza" />);
            const srcset = screen.getByRole('img').getAttribute('srcset') ?? '';
            expect(srcset).toContain(`${DIS}?sw=320 320w`);
            expect(srcset).toContain(`${DIS}?sw=1440 1440w`);
            expect(screen.getByRole('img')).toHaveAttribute('sizes', '100vw');
        });

        it('ya medida, sizes es el ancho pintado y el recorte no pasa del original', () => {
            mockReducedMotion(false);
            const originalRO = globalThis.ResizeObserver;
            const widthSpy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1425);
            globalThis.ResizeObserver = class {
                observe() {}
                unobserve() {}
                disconnect() {}
            } as unknown as typeof ResizeObserver;
            try {
                render(<FoodImage src={DIS} alt="Hero" crop="macro" />);
                const img = screen.getByRole('img');
                // 1.440 / 1.425 → la escala baja de 1,45 a 1,01 y se pide lo pintado (1.440 px).
                expect(img.style.scale).toBe('1.01');
                expect(img).toHaveAttribute('sizes', '1440px');
            } finally {
                widthSpy.mockRestore();
                globalThis.ResizeObserver = originalRO;
            }
        });

        it('en una caja chica deja el recorte entero', () => {
            mockReducedMotion(false);
            const originalRO = globalThis.ResizeObserver;
            const widthSpy = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(174);
            globalThis.ResizeObserver = class {
                observe() {}
                unobserve() {}
                disconnect() {}
            } as unknown as typeof ResizeObserver;
            try {
                render(<FoodImage src={DIS} alt="Pizza" crop="macro" />);
                const img = screen.getByRole('img');
                expect(img.style.scale).toBe('');
                expect(img).toHaveAttribute('sizes', '253px');
            } finally {
                widthSpy.mockRestore();
                globalThis.ResizeObserver = originalRO;
            }
        });
    });
});
