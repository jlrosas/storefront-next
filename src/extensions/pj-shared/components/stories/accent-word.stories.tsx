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
import { AccentWord } from '../accent-word';

const meta: Meta<typeof AccentWord> = {
    title: 'Extensions/Papa Johns/Accent Word',
    component: AccentWord,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Palabra de acento (UX-1 §3.3): Papa Sans Condensed en un sello rotado −3°, en lugar de la manuscrita Pappy que no está en el proyecto.',
            },
        },
    },
    args: { children: 'The Works', tone: 'sauce' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InHeadline: Story = {
    render: (args) => (
        <h2 className="pj-h2 bg-pj-dough p-4">
            Pizza del mes <AccentWord {...args} />
        </h2>
    ),
};

export const OnBasil: Story = {
    args: { tone: 'lime', children: 'Hay algo' },
    render: (args) => (
        <h2 className="pj-h2 surface-basil p-4">
            ¿<AccentWord {...args} /> que celebrar?
        </h2>
    ),
};
