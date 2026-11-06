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
import { AccentWord } from '../accent-word';

describe('AccentWord (VIS-05 · P3-21)', () => {
    it('es un sello en Condensed rotado −3° con lima sobre Rich Sauce por defecto', () => {
        render(
            <h2>
                Pizza del mes <AccentWord>The Works</AccentWord>
            </h2>
        );
        const word = screen.getByTestId('pj-accent-word');
        expect(word).toHaveTextContent('The Works');
        expect(word.className).toContain('-rotate-3');
        expect(word.className).toContain('font-heading');
        expect(word.className).toContain('bg-pj-sauce');
        expect(word.className).toContain('text-pj-pepperoncini');
    });

    it('tone lime invierte el par para fondos oscuros', () => {
        render(<AccentWord tone="lime">Hay algo</AccentWord>);
        expect(screen.getByTestId('pj-accent-word').className).toContain('bg-pj-pepperoncini');
    });
});
