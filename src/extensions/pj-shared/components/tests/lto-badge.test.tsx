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
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LtoBadge } from '../lto-badge';

describe('LtoBadge (VIS-02)', () => {
    it('es un círculo en Condensed con el par ADA de la variante y el tamaño pedido', () => {
        render(
            <LtoBadge variant="sauce" size="lg">
                -50%
            </LtoBadge>
        );
        const badge = screen.getByTestId('pj-lto-badge');
        expect(badge).toHaveTextContent('-50%');
        expect(badge).toHaveAttribute('data-variant', 'sauce');
        expect(badge.className).toContain('rounded-full');
        expect(badge.className).toContain('font-heading');
        expect(badge.className).toContain('bg-pj-sauce');
        expect(badge.className).toContain('text-pj-dough');
        expect(badge.className).toContain('size-[88px]');
        expect(badge.className).not.toContain('-rotate-3');
    });

    it('por defecto es lima + Basil de 56 px, sin rotar ni animar', () => {
        render(<LtoBadge>NUEVO</LtoBadge>);
        const badge = screen.getByTestId('pj-lto-badge');
        expect(badge.className).toContain('bg-pj-pepperoncini');
        expect(badge.className).toContain('text-pj-basil');
        expect(badge.className).toContain('size-14');
        expect(badge.className).not.toContain('pj-lto-in');
    });

    it('parte el texto en dos líneas con \\n, rota −3° con tilt y anima solo con motion-safe', () => {
        render(
            <LtoBadge variant="garlic" size="sm" tilt animate>
                {'SOLO\nHOY'}
            </LtoBadge>
        );
        const badge = screen.getByTestId('pj-lto-badge');
        expect(badge.querySelectorAll(':scope > span > span')).toHaveLength(2);
        expect(badge.className).toContain('-rotate-3');
        expect(badge.className).toContain('motion-safe:animate-[pj-lto-in');
    });

    it('con label se anuncia como imagen con ese nombre', () => {
        render(<LtoBadge label="50 % de descuento">-50%</LtoBadge>);
        expect(screen.getByRole('img', { name: '50 % de descuento' })).toBeInTheDocument();
    });
});
