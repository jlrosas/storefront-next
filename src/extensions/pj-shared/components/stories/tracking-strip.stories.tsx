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
import { TrackingStrip } from '../tracking-strip';

const meta: Meta<typeof TrackingStrip> = {
    title: 'Extensions/Papa Johns/Tracking Strip',
    component: TrackingStrip,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Franja del pedido en curso: tarjeta en móvil (fija sobre la barra inferior) y barra a lo ancho en escritorio. La llena SEG en pj.layout.tracking.',
            },
        },
    },
    args: {
        status: 'En preparación',
        eta: 'Listo 20:45',
        step: 2,
        detail: 'PJ-48213 · Retiro en El Bosque · actualizado hace 1 min',
        href: '/seguimiento',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Preparing: Story = {};

export const Ready: Story = { args: { status: 'Listo para retirar', eta: 'Listo 20:45', step: 3 } };
