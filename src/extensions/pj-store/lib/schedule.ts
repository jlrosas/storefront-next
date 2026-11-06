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
/** @sfdc-extension-file SFDC_EXT_PJ_STORE */
import { PJ_TIME_ZONE } from '@/extensions/pj-shared/lib/format';
import { openUntil, opensAt, pickupMinutes, type PjStore } from './store-info';

export type ScheduleDay = 'today' | 'tomorrow';

export interface ScheduleSlot {
    /** ISO con la hora de Chile (lo que se guarda en `when`). */
    value: string;
    /** `20:45`. */
    label: string;
}

interface ChileParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
}

function chileParts(date: Date): ChileParts {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: PJ_TIME_ZONE,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).formatToParts(date);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
    return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour') % 24, minute: get('minute') };
}

/** Instante UTC de una fecha y hora de pared en Chile. */
export function chileWallTimeToDate(year: number, month: number, day: number, hour: number, minute: number): Date {
    const guess = Date.UTC(year, month - 1, day, hour, minute);
    const seen = chileParts(new Date(guess));
    const seenAsUtc = Date.UTC(seen.year, seen.month - 1, seen.day, seen.hour, seen.minute);
    return new Date(guess - (seenAsUtc - guess));
}

function toMinutes(clock: string): number {
    const [h, m] = clock.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

const STEP = 15;

/**
 * Horas disponibles para programar (de 15 en 15 min) entre la apertura y el cierre de la tienda.
 * Hoy parte desde ahora + el tiempo de preparación; mañana, desde la apertura.
 */
export function buildSlots(store: PjStore, day: ScheduleDay, now: Date = new Date()): ScheduleSlot[] {
    const today = chileParts(now);
    const base = chileWallTimeToDate(today.year, today.month, today.day, 12, 0);
    const target = day === 'today' ? base : new Date(base.getTime() + 24 * 60 * 60 * 1000);
    const t = chileParts(target);
    const open = toMinutes(opensAt(store));
    const close = toMinutes(openUntil(store));
    let start = open;
    if (day === 'today') {
        const earliest = today.hour * 60 + today.minute + pickupMinutes(store);
        start = Math.max(open, Math.ceil(earliest / STEP) * STEP);
    }
    const slots: ScheduleSlot[] = [];
    for (let minute = start; minute <= close - STEP; minute += STEP) {
        const date = chileWallTimeToDate(t.year, t.month, t.day, Math.floor(minute / 60), minute % 60);
        slots.push({ value: date.toISOString(), label: `${pad(Math.floor(minute / 60))}:${pad(minute % 60)}` });
    }
    return slots;
}

/** Día (Hoy o Mañana) de una hora programada ya guardada. */
export function dayOf(iso: string, now: Date = new Date()): ScheduleDay {
    const a = chileParts(new Date(iso));
    const b = chileParts(now);
    return a.year === b.year && a.month === b.month && a.day === b.day ? 'today' : 'tomorrow';
}
