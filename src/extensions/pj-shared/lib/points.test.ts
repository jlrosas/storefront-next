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
import { pointsFor, pointsToClp } from './points';

describe('pointsFor (CONTRATO §5, R1.1–R1.2)', () => {
    it('da 1 punto por cada $1.000: el pedido canónico de $23.890 suma 23', () => {
        expect(pointsFor(23890, 0)).toBe(23);
    });

    it('duplica con puntos dobles (c_pjDoublePoints): 46', () => {
        expect(pointsFor(23890, 0, true)).toBe(46);
    });

    it('el despacho no suma puntos', () => {
        expect(pointsFor(23890 + 1990, 1990)).toBe(23);
        expect(pointsFor(12990, 1990)).toBe(11);
        expect(pointsFor(25880, 1990, true)).toBe(46);
    });

    it('redondea hacia abajo y nunca es negativo', () => {
        expect(pointsFor(999, 0)).toBe(0);
        expect(pointsFor(1000, 0)).toBe(1);
        expect(pointsFor(1990, 1990)).toBe(0);
        expect(pointsFor(500, 1990)).toBe(0);
        expect(pointsFor(Number.NaN, 0)).toBe(0);
    });

    it('sin despacho informado se asume 0', () => {
        expect(pointsFor(16900)).toBe(16);
    });
});

describe('pointsToClp (S-D12)', () => {
    it('103 puntos valen $5.150', () => {
        expect(pointsToClp(103)).toBe(5150);
        expect(pointsToClp(-5)).toBe(0);
    });
});
