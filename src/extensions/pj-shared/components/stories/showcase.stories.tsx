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
import { PriceTag } from '../price-tag';
import { Stars } from '../stars';
import { PointsBadge } from '../points-badge';
import { FoodImage } from '../food-image';
import { AddedToast } from '../added-toast';
import { FulfillmentChip } from '../fulfillment-chip';
import { TrackingStrip } from '../tracking-strip';
import { BottomNav } from '../bottom-nav';
import { pointsFor } from '../../lib/points';

function Showcase() {
    return (
        <div className="mx-auto flex max-w-[1240px] flex-col gap-6 bg-pj-dough p-4 pb-24 text-pj-ink lg:pb-4">
            <h1>Piezas de pj-shared</h1>
            <div className="flex items-center bg-header-background p-3">
                <FulfillmentChip top="Retiro · listo en 15 min" bottom="El Bosque" to="/tienda" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <article className="min-w-0 overflow-hidden rounded-pj-section bg-pj-surface shadow-pj-card">
                    <FoodImage
                        src="https://edge.disstg.commercecloud.salesforce.com/dw/image/v2/ZYFJ_001/on/demandware.static/-/Sites-papajohns-cl-master/default/dw510bd525/images/1440x1080-1787585782.jpg"
                        alt="Pizza con queso estirándose"
                        aspect="16/9"
                        bleed
                        animate
                    />
                    <div className="flex flex-col gap-2 p-4">
                        <span className="text-xs font-bold uppercase text-pj-sale">Pizza del mes</span>
                        <strong className="text-lg">The Works Familiar</strong>
                        <Stars rating={4.7} count={1240} />
                        <PriceTag price={10990} listPrice={21900} />
                        <PointsBadge points={pointsFor(10990, 0)} />
                    </div>
                </article>
                <div className="flex min-w-0 flex-col gap-4">
                    <PriceTag price={23890} size="lg" />
                    <PointsBadge points={pointsFor(23890, 0)} variant="pending" />
                    <PointsBadge points={pointsFor(23890, 0, true)} />
                    <AddedToast
                        productName="Pollo BBQ Familiar"
                        points={16}
                        onUndo={() => undefined}
                        onViewOrder={() => undefined}
                    />
                    <TrackingStrip
                        status="En preparación"
                        eta="Listo 20:45"
                        step={2}
                        detail="PJ-48213 · Retiro en El Bosque · actualizado hace 1 min"
                        href="/seguimiento"
                    />
                </div>
            </div>
            <BottomNav currentPath="/menu" cartCount={2} />
        </div>
    );
}

const meta: Meta<typeof Showcase> = {
    title: 'Extensions/Papa Johns/Showcase',
    component: Showcase,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
        docs: { description: { component: 'Todas las piezas compartidas juntas, con los datos del pedido canónico.' } },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllPieces: Story = {};
