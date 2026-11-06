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
import { cropForPhoto } from './photo';

describe('cropForPhoto (VIS-01)', () => {
    it('los combos en fila van en combo; el resto en el recorte por defecto', () => {
        expect(cropForPhoto('cb-papa-flash')).toBe('combo');
        expect(cropForPhoto('https://cdn/x/images/combos/cb-papa-combo-postre.jpg?sw=480')).toBe('combo');
        expect(cropForPhoto('cb-super-duo')).toBe('macro');
        expect(cropForPhoto('cb-pizza-del-mes', 'hero')).toBe('hero');
        expect(cropForPhoto(null)).toBe('macro');
    });
});
