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
import { LtoBadge } from '../lto-badge';

const meta: Meta<typeof LtoBadge> = {
    title: 'Extensions/Papa Johns/LTO Badge',
    component: LtoBadge,
    tags: ['autodocs', 'interaction'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Sello LTO de la marca (playbook BGYS pp. 119–121): círculo perfecto, Papa Sans Condensed centrada (~40 % del diámetro, interlineado 75 %), 4 pares ADA y 3 tamaños. Va en la esquina superior izquierda de la primera letra del titular o sobre la foto. No se rota en reposo; `tilt` (−3°) es opcional.',
            },
        },
    },
    args: { children: '-50%', variant: 'lime', size: 'md' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Lime: Story = {
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('-50%')).toBeInTheDocument();
    },
};
export const Sauce: Story = { args: { variant: 'sauce', children: 'DEL\nMES' } };
export const Garlic: Story = { args: { variant: 'garlic', children: 'SOLO\nHOY' } };
export const Dough: Story = {
    args: { variant: 'dough', children: 'NUEVO' },
    parameters: { backgrounds: { default: 'dark' } },
};

/** Las 4 variantes en los 3 tamaños, sobre crema y sobre Fresh Basil. */
export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            {(['bg-pj-dough', 'bg-pj-basil'] as const).map((bg) => (
                <div key={bg} className={`flex flex-wrap items-center gap-4 rounded-pj-card p-4 ${bg}`}>
                    {(['lime', 'sauce', 'garlic', 'dough'] as const).map((variant) =>
                        (['sm', 'md', 'lg'] as const).map((size) => (
                            <LtoBadge key={`${variant}-${size}`} variant={variant} size={size}>
                                {size === 'lg' ? 'DEL\nMES' : '-50%'}
                            </LtoBadge>
                        ))
                    )}
                </div>
            ))}
        </div>
    ),
};

export const Tilted: Story = { args: { tilt: true, size: 'lg', children: 'NUEVO' } };

export const Animated: Story = { args: { animate: true, size: 'lg', children: '-50%' } };
