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

const SRC =
    'https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/ZYFJ_001/on/demandware.static/-/Sites-papajohns-cl-master/default/dw510bd525/images/1440x1080-1787585782.jpg';

const meta: Meta<typeof FoodImage> = {
    title: 'Extensions/Papa Johns/Food Image',
    component: FoodImage,
    tags: ['autodocs', 'interaction'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Foto de comida con srcset, recorte (`crop`: macro, hero, combo, none), sombra opcional y movimiento lento con pausa (R4.7). Con «reducir movimiento» queda quieta y sin botón.',
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

/** VIS-01: las 4 variantes de `crop` con la misma foto del CDN (1440×1080). */
export const Crops: Story = {
    render: (args) => (
        <div className="grid max-w-4xl grid-cols-2 gap-4">
            {(['macro', 'hero', 'combo', 'none'] as const).map((crop) => (
                <figure key={crop} className="flex flex-col gap-1">
                    <FoodImage {...args} className="" crop={crop} aspect={crop === 'hero' ? '16/10' : '4/3'} />
                    <figcaption className="text-sm font-bold">crop=&quot;{crop}&quot;</figcaption>
                </figure>
            ))}
        </div>
    ),
};

export const Macro: Story = { args: { crop: 'macro', shadow: true } };
export const Hero: Story = { args: { crop: 'hero', bleed: true, aspect: '16/10', className: 'max-w-2xl' } };
export const Combo: Story = { args: { crop: 'combo', aspect: '1/1' } };
