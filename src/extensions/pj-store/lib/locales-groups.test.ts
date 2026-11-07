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
import { groupLocales, projectToMap } from './locales-groups';
import { shortStoreName, type PjStore } from './store-info';

const store = (id: string, extra: Partial<PjStore> = {}): PjStore => ({ id, name: `Papa Johns ${id}`, ...extra });
const stores = [store('a'), store('b', { c_pjClosed: true }), store('c'), store('d'), store('e')];

describe('groupLocales (TIE-05 · UX-2 N5)', () => {
    it('sin tienda elegida: destaca la más cercana abierta, 3 en «Cerca de ti» y el resto colapsable', () => {
        const g = groupLocales(stores, null);
        expect(g.featured?.id).toBe('a');
        expect(g.featuredIsMine).toBe(false);
        expect(g.pinned).toBeNull();
        expect(g.near.map((s) => s.id)).toEqual(['a', 'b', 'c']);
        expect(g.rest.map((s) => s.id)).toEqual(['d', 'e']);
    });

    it('si la más cercana está cerrada, destaca la siguiente abierta', () => {
        const g = groupLocales([store('x', { c_pjClosed: true }), store('y')], undefined);
        expect(g.featured?.id).toBe('y');
    });

    it('«Tu tienda» entre las cercanas: es la destacada y no se repite', () => {
        const g = groupLocales(stores, 'c');
        expect(g.featured?.id).toBe('c');
        expect(g.featuredIsMine).toBe(true);
        expect(g.pinned).toBeNull();
    });

    it('«Tu tienda» lejos: va sola arriba y sale de «Todas las tiendas»', () => {
        const g = groupLocales(stores, 'e');
        expect(g.featured?.id).toBe('e');
        expect(g.pinned?.id).toBe('e');
        expect(g.rest.map((s) => s.id)).toEqual(['d']);
    });

    it('una tienda guardada que ya no existe no rompe nada', () => {
        expect(groupLocales(stores, 'zz').featured?.id).toBe('a');
        expect(groupLocales([], 'a').featured).toBeNull();
    });
});

describe('projectToMap', () => {
    it('ubica El Bosque dentro del mapa y descarta lo que queda fuera de Santiago', () => {
        const p = projectToMap({ latitude: -33.419657, longitude: -70.599999 }, 400, 480);
        expect(p).not.toBeNull();
        expect(p?.x).toBeGreaterThan(0);
        expect(p?.x).toBeLessThan(400);
        expect(p?.y).toBeGreaterThan(0);
        expect(p?.y).toBeLessThan(480);
        expect(projectToMap({ latitude: -36.8, longitude: -73.05 }, 400, 480)).toBeNull();
        expect(projectToMap({}, 400, 480)).toBeNull();
    });
});

describe('shortStoreName', () => {
    it('capitaliza los nombres que vienen en minúscula del sandbox (VAL-TIE-04 H5)', () => {
        expect(shortStoreName('Papa Johns irarrazaval')).toBe('Irarrazaval');
        expect(shortStoreName('Papa Johns San miguel')).toBe('San Miguel');
        expect(shortStoreName('Papa Johns Camino del Monje')).toBe('Camino del Monje');
    });
});
