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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import { formatCount } from '@/extensions/pj-shared/lib/format';

/** Desde cuántos pedidos semanales el dato suma (con menos, no presume). */
export const WEEKLY_ORDERS_MIN = 100;

/**
 * Datos de «320 esta semana» para la línea de valoración (UX-2 #53: sale el chip «Pedida 320 veces esta
 * semana» y el dato se suma a «★ 4,7 · 1.240 opiniones»). `null` bajo el mínimo o sin dato.
 */
export function weeklyOrdersFor(weeklyOrders: number | null | undefined): { count: number; formatted: string } | null {
    if (weeklyOrders == null || weeklyOrders < WEEKLY_ORDERS_MIN) return null;
    return { count: weeklyOrders, formatted: formatCount(weeklyOrders) };
}
