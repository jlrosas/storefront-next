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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import { cn } from '@/lib/utils';

/** Columnas de la grilla de pizzas por ancho: 2 (móvil), 3 (sm y lg) y 4 (xl). */
export const PIZZA_GRID = 'grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-3 lg:gap-3.5 xl:grid-cols-4';

/*
 * Clases literales (Tailwind no ve clases armadas) indexadas por el resto `n % columnas`:
 * con resto 0 la fila está completa y el cierre se oculta; si no, ocupa lo que falta.
 */
const BASE = ['hidden', 'flex col-span-1'];
const SM = ['sm:hidden', 'sm:flex sm:col-span-2', 'sm:flex sm:col-span-1'];
const LG = ['lg:hidden', 'lg:flex lg:col-span-2', 'lg:flex lg:col-span-1'];
const XL = ['xl:hidden', 'xl:flex xl:col-span-3', 'xl:flex xl:col-span-2', 'xl:flex xl:col-span-1'];

/** Clases que hacen que el cierre complete la última fila en cada ancho (N13: grillas sin huecos). */
export function closerSpanClass(count: number): string {
    return cn(BASE[count % 2], SM[count % 3], LG[count % 3], XL[count % 4]);
}
