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
import { PriceTag } from '../price-tag';

describe('PriceTag display (VIS-02)', () => {
    it('muestra el $ en superíndice, Condensed y Rich Sauce sobre crema', () => {
        render(<PriceTag variant="display" size="lg" surface="dough" price={10990} listPrice={21900} />);
        const now = screen.getByTestId('pj-price-display');
        expect(now).toHaveTextContent('$10.990');
        expect(now.className).toContain('first-letter:text-[0.5em]');
        expect(now.className).toContain('first-letter:align-[0.78em]');
        expect(now.className).toContain('font-heading');
        expect(now.className).toContain('text-pj-sauce');
        expect(now.className).toContain('lg:text-[72px]');
        expect(screen.getByText('$21.900')).toHaveClass('line-through');
        expect(screen.getByTestId('pj-price-tag')).toHaveAttribute('data-surface', 'dough');
    });

    it('sobre verde o granate usa lima', () => {
        render(<PriceTag variant="display" surface="sauce" price={22590} />);
        expect(screen.getByTestId('pj-price-display').className).toContain('text-pj-pepperoncini');
    });

    it('listPriceLabel cambia el texto visible y leído del precio antes', () => {
        render(
            <PriceTag
                variant="display"
                price={10990}
                listPrice={21900}
                listPriceLabel="Antes desde $21.900"
                showSavings={false}
            />
        );
        expect(screen.getByText('Antes desde $21.900', { selector: '[aria-hidden]' })).toBeInTheDocument();
        expect(screen.getByTestId('pj-price-tag').querySelector('.sr-only')).toHaveTextContent('Antes desde $21.900');
    });

    it('la variante por defecto no cambia', () => {
        render(<PriceTag price={16900} />);
        expect(screen.getByTestId('pj-price-tag')).not.toHaveAttribute('data-variant');
        expect(screen.getByText('$16.900').tagName).toBe('STRONG');
    });

    it('sin surface toma el color de precio de la superficie que lo contiene (VIS-04)', () => {
        render(<PriceTag variant="display" price={17490} listPrice={19900} />);
        expect(screen.getByTestId('pj-price-tag')).toHaveAttribute('data-surface', 'auto');
        expect(screen.getByTestId('pj-price-display').className).toContain('text-pj-price');
        expect(screen.getByText('$19.900')).toHaveClass('text-pj-price-muted');
    });
});
