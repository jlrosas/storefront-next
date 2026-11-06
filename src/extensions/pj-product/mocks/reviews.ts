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

/**
 * MOCK (solicitud a DAT): la distribución de estrellas, las opiniones con «Compra verificada» y la
 * respuesta de «¿Es picante?» no están en el catálogo. `c_pjRating`, `c_pjReviewCount` y
 * `c_pjWeeklyOrders` sí (R4.4, S-D9). Cuando DAT agregue `c_pjReviewDist` y `c_pjReviews` (JSON) al
 * producto, la ficha los lee de ahí y este archivo se borra.
 */

export interface ReviewSample {
    who: string;
    when: string;
    stars: number;
    text: string;
    order: string;
}

export interface ReviewMock {
    /** Porcentaje de opiniones con 5, 4, 3, 2 y 1 estrellas. */
    distribution: [number, number, number, number, number];
    reviews: ReviewSample[];
    /** Respuesta a «¿Es picante?». */
    spicy: string;
}

const GENERIC: ReviewMock = {
    distribution: [74, 18, 5, 2, 1],
    reviews: [
        {
            who: 'Fernanda P.',
            when: 'hace 4 días',
            stars: 5,
            text: 'Llegó caliente y bien cargada de ingredientes. La masa tradicional, perfecta.',
            order: 'Delivery',
        },
        {
            who: 'Joaquín M.',
            when: 'hace 2 semanas',
            stars: 4,
            text: 'Rica y abundante. La pedí con borde de queso y vale la pena.',
            order: 'Retiro en El Bosque',
        },
    ],
    spicy: 'No. Si te gusta el picante, agrégale pepperoni o pídela con ají aparte.',
};

const BY_PRODUCT: Record<string, Partial<ReviewMock>> = {
    'pz-pollo-bbq': {
        distribution: [78, 15, 4, 2, 1],
        reviews: [
            {
                who: 'Camila R.',
                when: 'hace 3 días',
                stars: 5,
                text: 'Llegó caliente y con harto tocino. La pedimos por mitades con la de carnes y quedamos todos felices.',
                order: 'Delivery',
            },
            {
                who: 'Matías G.',
                when: 'hace 1 semana',
                stars: 4,
                text: 'La salsa BBQ es lo mejor. Pedí sin cebolla y vino perfecta.',
                order: 'Retiro en El Bosque',
            },
        ],
        spicy: 'No. La salsa BBQ es ahumada y un poco dulce.',
    },
};

export function reviewMockFor(productId: string, spicy = false): ReviewMock {
    const mock = { ...GENERIC, ...BY_PRODUCT[productId] };
    if (spicy && !BY_PRODUCT[productId]?.spicy) {
        mock.spicy =
            'Sí, tiene un toque picante. Si lo prefieres suave, quita el ingrediente picante en «Ingredientes».';
    }
    return mock;
}
