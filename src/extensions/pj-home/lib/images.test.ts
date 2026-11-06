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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
import { describe, expect, test } from 'vitest';
import { imageSrcSet, scaledImage } from './images';

const STATIC =
    'https://zyfj-001.my.commercecloud.salesforce.com/on/demandware.static/-/Sites-papajohns-cl-master/default/dwdc3c07f7/images/combos/cb-pizza-del-mes.jpg';

describe('imágenes por ancho', () => {
    test('las fotos del catálogo pasan por el servicio de imágenes (DIS)', () => {
        expect(scaledImage(STATIC, 640)).toBe(
            'https://zyfj-001.my.commercecloud.salesforce.com/dw/image/v2/ZYFJ_001/on/demandware.static/-/Sites-papajohns-cl-master/default/dwdc3c07f7/images/combos/cb-pizza-del-mes.jpg?sw=640&q=80'
        );
    });

    test('una URL de DIS solo suma el ancho', () => {
        expect(scaledImage('https://x.test/dw/image/v2/ZZ_001/a.jpg', 480)).toBe(
            'https://x.test/dw/image/v2/ZZ_001/a.jpg?sw=480&q=80'
        );
    });

    test('una URL ajena se devuelve igual', () => {
        expect(scaledImage('https://example.com/a.jpg', 480)).toBe('https://example.com/a.jpg');
    });

    test('srcset con un descriptor por ancho', () => {
        const set = imageSrcSet(STATIC, [480, 800]);
        expect(set.split(', ')).toHaveLength(2);
        expect(set).toContain('sw=480&q=80 480w');
        expect(set).toContain('sw=800&q=80 800w');
    });
});
