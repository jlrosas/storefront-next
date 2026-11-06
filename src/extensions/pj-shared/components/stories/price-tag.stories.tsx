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
import { expect, within } from 'storybook/test';
import { PriceTag } from '../price-tag';

const meta: Meta<typeof PriceTag> = {
    title: 'Extensions/Papa Johns/Price Tag',
    component: PriceTag,
    tags: ['autodocs', 'interaction'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Precio del lienzo: ahora, antes tachado y ahorro en pesos (CLP `$22.590`). Con precio antes, el precio ahora va en rojo tomate.',
            },
        },
    },
    args: { price: 22590, size: 'md' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Regular: Story = {};

export const OnSale: Story = {
    args: { price: 10990, listPrice: 21900 },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByText('$10.990')).toBeInTheDocument();
        await expect(canvas.getByText('$21.900')).toBeInTheDocument();
    },
};

export const Large: Story = { args: { price: 10990, listPrice: 21900, size: 'lg' } };

export const FromPrice: Story = { args: { price: 12400, prefix: 'desde', size: 'sm' } };
