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
import { DEMO_PERSONAS } from '@/extensions/pj-shared/lib/persona';
import { PESOS_PER_POINT, pointsFor } from '@/extensions/pj-shared/lib/points';
import type { DemoProfile } from '@/extensions/pj-shared/lib/profile';

/** Un movimiento de Papa Puntos (`c_pjPointsLog`, S-D6). `points` negativo = canje. */
export interface PointsMove {
    /** ISO 8601. */
    date: string;
    kind: 'earn' | 'redeem' | 'opening';
    points: number;
    /** Número de pedido, si el movimiento viene de uno. */
    order: string | null;
}

/** Socio de Papa Puntos que muestran `/puntos` y `/account` (CTA). */
export interface PjMember {
    /** `session`: cliente real de Commerce. `demo`: perfil forzado con `?perfil=` (INT-08). */
    source: 'session' | 'demo';
    profile: DemoProfile | null;
    firstName: string;
    points: number;
    doublePoints: boolean;
    /** Movimientos más recientes primero (todos de ejemplo en la demo). */
    moves: PointsMove[];
}

/** Cuántos movimientos se muestran. */
export const MOVES_SHOWN = 5;

/**
 * Movimientos de ejemplo por perfil cuando no hay sesión (o el cliente no trae `c_pjPointsLog`). Suman el saldo
 * del contrato §3: Sofía 340 (pedidos de su historial + saldo del programa anterior), Valentina 40, Diego 0.
 */
export const SAMPLE_MOVES: Readonly<Record<DemoProfile, readonly PointsMove[]>> = {
    sofia: [
        { date: '2026-10-02T20:30:00.000Z', kind: 'earn', points: 23, order: '00047110' },
        { date: '2026-09-13T20:50:00.000Z', kind: 'earn', points: 21, order: '00046205' },
        { date: '2026-08-22T21:30:00.000Z', kind: 'earn', points: 24, order: '00045188' },
        { date: '2026-07-25T20:15:00.000Z', kind: 'earn', points: 27, order: '00044102' },
        { date: '2024-03-01T12:00:00.000Z', kind: 'opening', points: 245, order: null },
    ],
    valentina: [
        { date: '2024-11-08T20:20:00.000Z', kind: 'earn', points: 13, order: '00031877' },
        { date: '2024-03-01T12:00:00.000Z', kind: 'opening', points: 27, order: null },
    ],
    diego: [],
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

/**
 * Lee `c_pjPointsLog` (JSON de `site-data/ocapi/customers.py`: `{date, type, points, order, label}`).
 * Lo que no se entiende se descarta; el resultado va del más reciente al más antiguo.
 */
export function parsePointsLog(raw: unknown): PointsMove[] {
    let list: unknown = raw;
    if (typeof raw === 'string') {
        try {
            list = JSON.parse(raw);
        } catch {
            return [];
        }
    }
    if (!Array.isArray(list)) return [];
    const moves: PointsMove[] = [];
    for (const entry of list) {
        if (!isRecord(entry)) continue;
        const points = Number(entry.points);
        const date = typeof entry.date === 'string' ? entry.date : '';
        if (!Number.isFinite(points) || points === 0 || Number.isNaN(Date.parse(date))) continue;
        const order = typeof entry.order === 'string' && entry.order ? entry.order : null;
        const kind: PointsMove['kind'] = points < 0 || entry.type === 'redeem' ? 'redeem' : order ? 'earn' : 'opening';
        moves.push({ date, kind, points: kind === 'redeem' ? -Math.abs(points) : points, order });
    }
    return moves.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

/** Socio de demo (perfil forzado, sin sesión). */
export function demoMember(profile: DemoProfile): PjMember {
    const persona = DEMO_PERSONAS[profile];
    return {
        source: 'demo',
        profile,
        firstName: persona.firstName,
        points: persona.points,
        doublePoints: profile === 'valentina',
        moves: [...SAMPLE_MOVES[profile]],
    };
}

/** Socio con sesión: datos del cliente de Commerce; si no trae movimientos, los de ejemplo de su perfil. */
export function sessionMember(
    customer: { firstName?: string | null } & Record<string, unknown>,
    profile: DemoProfile | null
): PjMember {
    const points = Number(customer.c_pjPoints);
    const moves = parsePointsLog(customer.c_pjPointsLog);
    return {
        source: 'session',
        profile,
        firstName: customer.firstName?.trim() || '',
        points: Number.isFinite(points) && points > 0 ? Math.floor(points) : 0,
        doublePoints: customer.c_pjDoublePoints === true,
        moves: moves.length ? moves : profile ? [...SAMPLE_MOVES[profile]] : [],
    };
}

/** Calculadora (R1.1, R1.2): puntos de un pedido de `amount` pesos, con o sin puntos dobles. */
export function calculatorPoints(amount: number, doublePoints = false): number {
    return pointsFor(amount, 0, doublePoints);
}

/**
 * Cuántos pedidos de `amount` faltan para juntar `goal` puntos partiendo de `balance` (0 = ya alcanza).
 * Con puntos dobles (Valentina, R1.2) solo el próximo pedido suma el doble. `null` si el pedido no suma (bajo $1.000).
 */
export function ordersToGoal(amount: number, goal: number, balance = 0, doublePoints = false): number | null {
    let missing = Math.max(0, goal - Math.max(0, balance));
    if (missing === 0) return 0;
    const per = calculatorPoints(amount);
    if (per <= 0) return null;
    if (!doublePoints) return Math.ceil(missing / per);
    missing -= calculatorPoints(amount, true);
    return missing <= 0 ? 1 : 1 + Math.ceil(missing / per);
}

/** Montos sugeridos de la calculadora: ticket promedio del cliente (preventa), el pedido de Sofía y uno grande. */
export const CALCULATOR_PRESETS = [15690, 23890, 40000] as const;
export const CALCULATOR_MIN = PESOS_PER_POINT * 5;
export const CALCULATOR_MAX = 100000;
export const CALCULATOR_STEP = 10;
