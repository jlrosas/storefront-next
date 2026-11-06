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
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BottomSheet } from '../bottom-sheet';
import { PriceTag } from '../price-tag';

function Demo({ initiallyOpen = true }: { initiallyOpen?: boolean }) {
    const [open, setOpen] = useState(initiallyOpen);
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="min-h-11 rounded-full bg-pj-basil px-5 font-bold text-pj-dough">
                Abrir hoja
            </button>
            <BottomSheet
                open={open}
                onOpenChange={setOpen}
                title="Pollo BBQ"
                description="Pollo, tocino y salsa BBQ ahumada sobre mozzarella."
                footer={
                    <button
                        type="button"
                        className="flex min-h-12 w-full items-center justify-between rounded-full bg-pj-basil px-5 font-bold text-pj-dough">
                        <span>Agregar</span>
                        <PriceTag price={16900} className="[&_strong]:text-pj-dough" />
                    </button>
                }>
                <p className="py-4 text-[15px]">Tamaño, masa e ingredientes van aquí.</p>
            </BottomSheet>
        </>
    );
}

const meta: Meta<typeof Demo> = {
    title: 'Extensions/Papa Johns/Bottom Sheet',
    component: Demo,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Hoja que sube desde abajo en móvil y panel lateral a la derecha desde lg. Quien la usa la carga con React.lazy.',
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Closed: Story = { args: { initiallyOpen: false } };
