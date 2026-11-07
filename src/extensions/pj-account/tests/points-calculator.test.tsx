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
/** @sfdc-extension-file SFDC_EXT_PJ_ACCOUNT */
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { PointsCalculator } from '../components/points-calculator';

const result = () => screen.getByTestId('pj-calc-result').textContent ?? '';

describe('PointsCalculator (CTA-02 criterio 2)', () => {
    it('parte en el pedido de Sofía: $23.890 → 23 puntos = $1.150', () => {
        render(<PointsCalculator balance={0} doublePoints={false} goal={260} />);
        expect(result()).toContain('23.890');
        expect(result()).toContain('1.150');
        expect(screen.getByRole('button', { name: '$23.890' })).toHaveAttribute('aria-pressed', 'true');
    });

    it('cambia con los montos sugeridos y el deslizador', () => {
        render(<PointsCalculator balance={0} doublePoints={false} goal={260} />);
        fireEvent.click(screen.getByRole('button', { name: '$40.000' }));
        expect(result()).toContain('40.000');
        expect(result()).toContain('2.000');
        fireEvent.change(screen.getByRole('slider'), { target: { value: '15000' } });
        expect(result()).toContain('15.000');
        expect(result()).toContain('750');
    });

    it('con puntos dobles muestra el doble (Valentina)', () => {
        render(<PointsCalculator balance={40} doublePoints goal={260} />);
        expect(result()).toContain('46');
    });
});
