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
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const EXTENSIONS = join(__dirname, '..', '..');

function sources(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) return name === 'locales' ? [] : sources(path);
        return /\.(ts|tsx)$/.test(name) && !/\.(test|stories)\.tsx?$/.test(name) ? [path] : [];
    });
}

const PJ_FILES = readdirSync(EXTENSIONS)
    .filter((name) => name.startsWith('pj-'))
    .flatMap((name) => sources(join(EXTENSIONS, name)));

describe('Paleta S-D18 y texto mínimo en las extensiones pj-* (VIS-03)', () => {
    it('ningún archivo escribe colores hex a mano: todo va por tokens --pj-*', () => {
        const offenders = PJ_FILES.filter((file) => /#[0-9A-Fa-f]{6}\b/.test(readFileSync(file, 'utf8')));
        expect(offenders).toEqual([]);
    });

    it('ningún texto usa tamaños bajo 12 px', () => {
        const offenders = PJ_FILES.filter((file) =>
            /text-\[(?:[0-9]|1[01])(?:\.\d+)?px\]/.test(readFileSync(file, 'utf8'))
        );
        expect(offenders).toEqual([]);
    });
});
