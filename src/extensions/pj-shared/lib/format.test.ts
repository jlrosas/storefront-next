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
import { formatAgo, formatClp, formatCount, formatRating, formatReadyAt, formatTime, formatTimeWindow } from './format';

describe('formatClp', () => {
    it('formatea pesos chilenos como en el lienzo', () => {
        expect(formatClp(22590)).toBe('$22.590');
        expect(formatClp(23890)).toBe('$23.890');
        expect(formatClp(1990)).toBe('$1.990');
        expect(formatClp(0)).toBe('$0');
        expect(formatClp(1234567)).toBe('$1.234.567');
    });

    it('redondea los decimales', () => {
        expect(formatClp(10990.6)).toBe('$10.991');
    });
});

describe('formatCount y formatRating', () => {
    it('usa punto de miles y coma decimal', () => {
        expect(formatCount(1240)).toBe('1.240');
        expect(formatRating(4.7)).toBe('4,7');
        expect(formatRating(5)).toBe('5,0');
    });
});

describe('horas en Chile', () => {
    // 23:45 UTC del 20-nov-2026 = 20:45 en Santiago (UTC−3, horario de verano)
    const at = new Date('2026-11-20T23:45:00Z');

    it('formatTime da la hora de 24 h de Santiago', () => {
        expect(formatTime(at)).toBe('20:45');
        expect(formatTime('2026-11-20T03:05:00Z')).toBe('00:05');
    });

    it('formatReadyAt dice «listo 20:45»', () => {
        expect(formatReadyAt(at)).toBe('listo 20:45');
    });

    it('formatTimeWindow arma la ventana de entrega', () => {
        expect(formatTimeWindow('2026-11-21T00:05:00Z', '2026-11-21T00:15:00Z')).toBe('21:05–21:15');
    });
});

describe('formatAgo («hace X min», R3.4)', () => {
    const now = new Date('2026-11-20T23:45:00Z');

    it('bajo un minuto', () => {
        expect(formatAgo(new Date(now.getTime() - 30_000), now)).toBe('hace un momento');
    });

    it('minutos, horas y días', () => {
        expect(formatAgo(new Date(now.getTime() - 60_000), now)).toBe('hace 1 min');
        expect(formatAgo(new Date(now.getTime() - 12 * 60_000), now)).toBe('hace 12 min');
        expect(formatAgo(new Date(now.getTime() - 3 * 3_600_000), now)).toBe('hace 3 h');
        expect(formatAgo(new Date(now.getTime() - 26 * 3_600_000), now)).toBe('hace 1 día');
        expect(formatAgo(new Date(now.getTime() - 3 * 86_400_000), now)).toBe('hace 3 días');
    });

    it('una fecha futura cuenta como recién', () => {
        expect(formatAgo(new Date(now.getTime() + 60_000), now)).toBe('hace un momento');
    });
});
