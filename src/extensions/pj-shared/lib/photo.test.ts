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
import {
    PHOTO_MAX_WIDTH,
    clampCropScale,
    cropForPhoto,
    cropScaleAt,
    disWidth,
    isDisUrl,
    normalizeSrcSet,
    originalWidthFor,
    photoSrcSet,
    photoWidth,
    scaleSizes,
    withDisWidth,
} from './photo';

const DIS =
    'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/ZYFJ_001/on/demandware.static/-/Sites-papajohns-cl-master/default/dwea5f5ac0/images/pollo-bbq-familiar-1788736553.webp';

describe('cropForPhoto (VIS-01)', () => {
    it('los combos en fila van en combo; el resto en el recorte por defecto', () => {
        expect(cropForPhoto('cb-papa-flash')).toBe('combo');
        expect(cropForPhoto('https://cdn/x/images/combos/cb-papa-combo-postre.jpg?sw=480')).toBe('combo');
        expect(cropForPhoto('cb-super-duo')).toBe('macro');
        expect(cropForPhoto('cb-pizza-del-mes', 'hero')).toBe('hero');
        expect(cropForPhoto(null)).toBe('macro');
    });
});

describe('nitidez de FoodImage (VIS-06, UX-2 N1)', () => {
    it('sw = ancho pintado × DPR × escala del recorte, con tope en el original', () => {
        // Ficha a 390 con DPR 2 y recorte macro: 390 × 2 × 1,45 = 1.131.
        expect(photoWidth(390, 2, 1.45)).toBe(1131);
        // Tarjeta del menú a 390: caja de 174 px → 505.
        expect(photoWidth(174, 2, 1.45)).toBe(505);
        // Hero a 1440 con DPR 1: 1.440 × 1,35 pasa del original → 1.440.
        expect(photoWidth(1440, 1, 1.35)).toBe(PHOTO_MAX_WIDTH);
        expect(photoWidth(300, 3, 1, 750)).toBe(750);
        expect(photoWidth(200, 0.5, 0.8)).toBe(200);
        expect(photoWidth(0, 2, 1.45)).toBe(0);
    });

    it('el recorte nunca agranda la foto por encima de su ancho natural', () => {
        expect(clampCropScale(1.45, 174)).toBe(1.45);
        expect(clampCropScale(1.35, 1425)).toBe(1.01);
        expect(clampCropScale(1.35, 1600)).toBe(1);
        expect(clampCropScale(1.45, 600, 750)).toBe(1.25);
        expect(clampCropScale(1, 2000)).toBe(1);
        expect(clampCropScale(1.45, 0)).toBe(1.45);
    });

    it('hero acerca menos en escritorio', () => {
        expect(cropScaleAt('hero', false)).toBe(1.55);
        expect(cropScaleAt('hero', true)).toBe(1.35);
        expect(cropScaleAt('macro', true)).toBe(1.45);
        expect(cropScaleAt('none', false)).toBe(1);
    });

    it('reconoce las URLs del DIS y cambia sw sin tocar el resto', () => {
        expect(isDisUrl(DIS)).toBe(true);
        expect(isDisUrl('/images/pizza.jpg')).toBe(false);
        expect(isDisUrl(null)).toBe(false);
        expect(withDisWidth(`${DIS}?sfrm=jpg&sw=780&q=70`, 1131)).toBe(`${DIS}?sfrm=jpg&sw=1131&q=70`);
        expect(withDisWidth(DIS, 640)).toBe(`${DIS}?sw=640`);
        expect(withDisWidth(`${DIS}?q=70`, 640)).toBe(`${DIS}?q=70&sw=640`);
        expect(disWidth(`${DIS}?sfrm=jpg&sw=780`)).toBe(780);
        expect(disWidth(DIS)).toBeNull();
    });

    it('arma el srcset del DIS sin repetir y con tope', () => {
        expect(photoSrcSet(`${DIS}?q=70`, [480, 960, 1600, 2000])).toBe(
            `${DIS}?q=70&sw=480 480w, ${DIS}?q=70&sw=960 960w, ${DIS}?q=70&sw=1440 1440w`
        );
        expect(photoSrcSet(DIS, [320, 900], 750)).toBe(`${DIS}?sw=320 320w, ${DIS}?sw=750 750w`);
    });

    it('normaliza el srcset del llamador: tope en el original y escalones hasta 1.440', () => {
        const at = (w: number) => `${DIS}?sfrm=jpg&sw=${w}&q=70 ${w}w`;
        const caller = [480, 780, 1600].map(at).join(', ');
        expect(normalizeSrcSet(caller)).toBe([320, 480, 640, 780, 800, 960, 1200, 1440].map(at).join(', '));
        const small = [240, 720].map((w) => `${DIS}?sw=${w} ${w}w`).join(', ');
        expect(normalizeSrcSet(small, 750)).toBe(
            [240, 320, 480, 640, 720, 750].map((w) => `${DIS}?sw=${w} ${w}w`).join(', ')
        );
        // Fuera del DIS o con descriptores x: tal cual.
        expect(normalizeSrcSet('/a.jpg 640w, /b.jpg 1280w')).toBe('/a.jpg 640w, /b.jpg 1280w');
        expect(normalizeSrcSet(`${DIS}?sw=400 1x, ${DIS}?sw=800 2x`)).toBe(`${DIS}?sw=400 1x, ${DIS}?sw=800 2x`);
    });

    it('multiplica sizes por la escala del recorte', () => {
        expect(scaleSizes('(min-width: 1024px) 50vw, 100vw', 1.45)).toBe(
            '(min-width: 1024px) calc(50vw * 1.45), calc(100vw * 1.45)'
        );
        expect(scaleSizes('(min-width: 1024px) calc(100vw - 2rem), 240px', 1.595)).toBe(
            '(min-width: 1024px) calc(calc(100vw - 2rem) * 1.595), calc(240px * 1.595)'
        );
        expect(scaleSizes('50vw', 1)).toBe('50vw');
        expect(scaleSizes('auto', 1.45)).toBe('auto');
    });

    it('conoce los originales chicos del catálogo', () => {
        expect(originalWidthFor(`${DIS}?sw=480`)).toBe(PHOTO_MAX_WIDTH);
        expect(originalWidthFor('https://x/dw/image/v2/images/croissantchoclo-750x600-1787676179.webp?sw=480')).toBe(
            750
        );
        expect(originalWidthFor('https://x/images/coca-cola-220-1684421414.png')).toBe(296);
        expect(originalWidthFor(undefined)).toBe(PHOTO_MAX_WIDTH);
    });
});
