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
import { Stars } from '../stars';

const meta: Meta<typeof Stars> = {
    title: 'Extensions/Papa Johns/Stars',
    component: Stars,
    tags: ['autodocs', 'interaction'],
    parameters: { layout: 'padded' },
    args: { rating: 4.7, count: 1240 },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCount: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByRole('img')).toHaveAccessibleName(/4,7/);
    },
};

export const RatingOnly: Story = { args: { count: null } };
