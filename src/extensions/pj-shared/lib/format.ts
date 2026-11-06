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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */

/** Zona horaria de las tiendas de la demo. */
export const PJ_TIME_ZONE = 'America/Santiago';

const clpFormatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 });

const decimalFormatter = new Intl.NumberFormat('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** `$22.590`: pesos chilenos sin decimales. */
export function formatClp(amount: number): string {
    // Intl puede usar un espacio duro entre el signo y el número según el motor: el lienzo no lo tiene.
    return clpFormatter.format(Math.round(amount)).replace(/\s/g, '');
}

/** `1.240`: número entero con separador de miles chileno. */
export function formatCount(value: number): string {
    return numberFormatter.format(Math.round(value));
}

/** `4,7`: calificación con un decimal y coma. */
export function formatRating(value: number): string {
    return decimalFormatter.format(value);
}

function toDate(value: Date | string | number): Date {
    return value instanceof Date ? value : new Date(value);
}

/** `20:45`: hora de 24 h en la zona de Chile. */
export function formatTime(value: Date | string | number, timeZone = PJ_TIME_ZONE): string {
    const parts = new Intl.DateTimeFormat('es-CL', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone,
    }).formatToParts(toDate(value));
    const hour = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
    return `${hour === '24' ? '00' : hour}:${minute}`;
}

/** `listo 20:45`. */
export function formatReadyAt(value: Date | string | number, timeZone = PJ_TIME_ZONE): string {
    return `listo ${formatTime(value, timeZone)}`;
}

/** `21:05–21:15`: ventana de entrega. */
export function formatTimeWindow(
    from: Date | string | number,
    to: Date | string | number,
    timeZone = PJ_TIME_ZONE
): string {
    return `${formatTime(from, timeZone)}–${formatTime(to, timeZone)}`;
}

/**
 * «hace X min» (R3.4): `hace un momento` bajo un minuto, `hace N min` bajo una hora,
 * `hace N h` bajo un día y `hace N días` después.
 */
export function formatAgo(value: Date | string | number, now: Date | string | number = Date.now()): string {
    const diffMs = Math.max(0, toDate(now).getTime() - toDate(value).getTime());
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return 'hace un momento';
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return days === 1 ? 'hace 1 día' : `hace ${days} días`;
}
