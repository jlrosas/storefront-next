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
import { PointsBadge } from '../points-badge';
import { pointsFor } from '../../lib/points';

const meta: Meta<typeof PointsBadge> = {
    title: 'Extensions/Papa Johns/Points Badge',
    component: PointsBadge,
    tags: ['autodocs'],
    parameters: { layout: 'padded' },
    args: { points: pointsFor(23890, 0) },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Earn: Story = {};

export const Pending: Story = { args: { variant: 'pending' } };

export const DoublePoints: Story = { args: { points: pointsFor(23890, 0, true) } };
