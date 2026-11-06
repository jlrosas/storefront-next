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
import { fn } from 'storybook/test';
import { FulfillmentChip } from '../fulfillment-chip';

const meta: Meta<typeof FulfillmentChip> = {
    title: 'Extensions/Papa Johns/Fulfillment Chip',
    component: FulfillmentChip,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Chip de modalidad y tienda del encabezado verde. Lo llena TIE en el UITarget pj.header.fulfillment.',
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="flex max-w-md items-center bg-header-background p-4">
                <Story />
            </div>
        ),
    ],
    args: { top: 'Retiro o delivery', bottom: 'Elige cómo lo quieres', onClick: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Unset: Story = {};

export const PickupSelected: Story = {
    args: { top: 'Retiro · listo en 15 min', bottom: 'El Bosque', to: '/tienda', onClick: undefined },
};
