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
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FoodImage } from '../food-image';

const SRC = '/images/hero-02.webp';

const meta: Meta<typeof FoodImage> = {
    title: 'Extensions/Papa Johns/Food Image',
    component: FoodImage,
    tags: ['autodocs', 'interaction'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Foto de comida con srcset, recorte, sombra opcional y movimiento lento con pausa (R4.7). Con «reducir movimiento» queda quieta y sin botón.',
            },
        },
    },
    args: { src: SRC, alt: 'Pizza con queso estirándose', aspect: '4/3', className: 'max-w-md' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = { args: { shadow: true } };

export const Bleed: Story = { args: { bleed: true, aspect: '16/9', className: 'max-w-2xl' } };

export const Animated: Story = {
    args: { animate: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const toggle = canvas.queryByRole('button');
        // Con «reducir movimiento» en el navegador de prueba no hay botón: es el comportamiento esperado.
        if (toggle) {
            await userEvent.click(toggle);
            await expect(toggle).toHaveAttribute('aria-pressed', 'true');
        }
    },
};
