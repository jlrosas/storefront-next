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
import { describe, expect, it } from 'vitest';
import { closerSpanClass } from './grid-layout';

describe('closerSpanClass (MEN-06 · N13)', () => {
    it('Favoritas (6) a 1440 completa la fila de 4 con 2 columnas', () => {
        const classes = closerSpanClass(6).split(' ');
        expect(classes).toContain('xl:col-span-2');
        expect(classes).toContain('lg:hidden'); // 6 en 3 columnas: fila completa
        expect(classes).toContain('hidden'); // 6 en 2 columnas (móvil): fila completa
    });
    it('Clásicas (5) a 1440 ocupa las 3 columnas que faltan', () => {
        const classes = closerSpanClass(5).split(' ');
        expect(classes).toContain('xl:col-span-3');
        expect(classes).toContain('lg:col-span-1');
        expect(classes).toContain('col-span-1');
    });
    it('con la fila completa en todos los anchos no se muestra', () => {
        const classes = closerSpanClass(12).split(' ');
        expect(classes).toEqual(expect.arrayContaining(['hidden', 'sm:hidden', 'lg:hidden', 'xl:hidden']));
    });
});
