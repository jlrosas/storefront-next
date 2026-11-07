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
import { SAMPLE_MOVES, calculatorPoints, demoMember, ordersToGoal, parsePointsLog, sessionMember } from '../lib/member';
import { isPjAccountHome } from '../lib/account-home-path';

describe('SAMPLE_MOVES', () => {
    it('suman el saldo del contrato §3 (Sofía 340, Valentina 40, Diego 0)', () => {
        const sum = (p: keyof typeof SAMPLE_MOVES) => SAMPLE_MOVES[p].reduce((acc, m) => acc + m.points, 0);
        expect(sum('sofia')).toBe(340);
        expect(sum('valentina')).toBe(40);
        expect(sum('diego')).toBe(0);
    });
});

describe('demoMember', () => {
    it('Sofía: 340 puntos, sin puntos dobles, movimientos de ejemplo', () => {
        const m = demoMember('sofia');
        expect(m).toMatchObject({ source: 'demo', firstName: 'Sofía', points: 340, doublePoints: false });
        expect(m.moves).toHaveLength(5);
    });
    it('Valentina: 40 puntos con puntos dobles', () => {
        expect(demoMember('valentina')).toMatchObject({ points: 40, doublePoints: true });
    });
    it('Diego: 0 puntos y sin movimientos', () => {
        expect(demoMember('diego')).toMatchObject({ points: 0, moves: [] });
    });
});

describe('parsePointsLog', () => {
    it('lee el JSON de customers.py, del más reciente al más antiguo', () => {
        const raw = JSON.stringify([
            { date: '2024-03-01T12:00:00.000Z', type: 'earn', points: 245, order: null, label: 'Saldo' },
            { date: '2026-10-02T20:30:00.000Z', type: 'earn', points: 23, order: '00000067', label: 'Pedido' },
            { date: '2026-10-05T20:30:00.000Z', type: 'redeem', points: 260, order: '00000070' },
        ]);
        expect(parsePointsLog(raw)).toEqual([
            { date: '2026-10-05T20:30:00.000Z', kind: 'redeem', points: -260, order: '00000070' },
            { date: '2026-10-02T20:30:00.000Z', kind: 'earn', points: 23, order: '00000067' },
            { date: '2024-03-01T12:00:00.000Z', kind: 'opening', points: 245, order: null },
        ]);
    });
    it('descarta lo que no entiende', () => {
        expect(parsePointsLog('no es json')).toEqual([]);
        expect(parsePointsLog(null)).toEqual([]);
        expect(parsePointsLog([{ date: 'x', points: 3 }, { date: '2026-01-01', points: 'a' }, 7])).toEqual([]);
    });
});

describe('sessionMember', () => {
    it('usa el saldo y el log del cliente', () => {
        const m = sessionMember(
            {
                firstName: 'Sofía',
                c_pjPoints: 340,
                c_pjPointsLog: '[{"date":"2026-10-02T20:30:00.000Z","points":23,"order":"1"}]',
            },
            'sofia'
        );
        expect(m).toMatchObject({ source: 'session', firstName: 'Sofía', points: 340, doublePoints: false });
        expect(m.moves).toHaveLength(1);
    });
    it('sin log cae a los movimientos de ejemplo del perfil; saldo inválido = 0', () => {
        const m = sessionMember({ firstName: 'Diego', c_pjPoints: 'x', c_pjDoublePoints: true }, 'valentina');
        expect(m.points).toBe(0);
        expect(m.doublePoints).toBe(true);
        expect(m.moves).toEqual(SAMPLE_MOVES.valentina);
    });
});

describe('calculadora', () => {
    it('1 punto por cada $1.000 (R1.1), el doble con puntos dobles', () => {
        expect(calculatorPoints(23890)).toBe(23);
        expect(calculatorPoints(23890, true)).toBe(46);
        expect(calculatorPoints(999)).toBe(0);
    });
    it('pedidos que faltan para 260 puntos', () => {
        expect(ordersToGoal(23890, 260, 340)).toBe(0);
        expect(ordersToGoal(23890, 260, 0)).toBe(12);
        expect(ordersToGoal(23890, 260, 40)).toBe(10);
        // Valentina: el próximo pedido suma 46, después 23 por pedido → 1 + ceil(174 / 23) = 9
        expect(ordersToGoal(23890, 260, 40, true)).toBe(9);
        expect(ordersToGoal(500, 260, 0)).toBeNull();
    });
});

describe('isPjAccountHome', () => {
    it('solo la portada de Cuenta, con o sin prefijo de sitio', () => {
        expect(isPjAccountHome('/account')).toBe(true);
        expect(isPjAccountHome('/cl/es-CL/account')).toBe(true);
        expect(isPjAccountHome('https://x.test/cl/es-CL/account/?perfil=sofia')).toBe(true);
        expect(isPjAccountHome('/cl/es-CL/account/orders')).toBe(false);
        expect(isPjAccountHome('/cl/es-CL/accounts')).toBe(false);
    });
});
