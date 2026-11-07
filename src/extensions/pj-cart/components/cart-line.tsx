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
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { cropForPhoto } from '@/extensions/pj-shared/lib/photo';
import { PizzaSheet } from '@/extensions/pj-product/components/pizza-sheet-launcher';
import { SplitPizzaImage } from '@/extensions/pj-product/components/split-pizza-image';
import { useImageUrl } from '@/extensions/pj-product/hooks/use-image-url';
import { MinusIcon, PlusIcon } from '@/extensions/pj-product/components/icons';
import { cn } from '@/lib/utils';
import type { ComboGroup, LineProducts, LineSummary } from '../lib/line-summary';
import { useLineQuantity } from '../hooks/use-line-quantity';
import { LineConfig } from './line-config';
import { ComboAddon } from './combo-addon';

const MAX_QUANTITY = 10;
const PHOTO = 72;

export interface CartLineProps {
    summary: LineSummary;
    /** Fotos por ID de producto (loader de `/cart`). */
    products: LineProducts;
    /** «Hazlo combo» de esta pizza (palitos + bebida), si lo tiene. */
    combo?: ComboGroup | null;
}

function LinePhoto({ summary, products }: CartLineProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { url } = useImageUrl();
    if (summary.kind === 'halves' && summary.halves.length) {
        return (
            <SplitPizzaImage
                images={summary.halves.map((half) => url(half.image, PHOTO * 3) ?? null)}
                label={t('line.halvesAria', { parts: summary.halves.map((half) => half.name).join(', ') })}
                size={PHOTO}
            />
        );
    }
    const src =
        products[summary.productId]?.image ?? (summary.masterId ? products[summary.masterId]?.image : null) ?? null;
    if (!src) {
        return <div className="size-[72px] shrink-0 rounded-pj-card bg-pj-sand" aria-hidden="true" />;
    }
    return (
        <FoodImage
            src={src}
            alt={summary.name}
            crop={cropForPhoto(summary.productId)}
            aspect="1/1"
            sizes="72px"
            className="size-[72px] shrink-0"
        />
    );
}

/**
 * Línea de `/cart` (Pedido.dc.html, UX-2 §4 regla 3): foto macro de 72 px (o la pizza dividida), nombre, total
 * con extras (#37), la configuración completa (#34) y «Editar» con la hoja de PRO.
 */
export function CartLine({ summary, products, combo }: CartLineProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { setQuantity, busy, failed, pending } = useLineQuantity(summary.itemId);
    const [editing, setEditing] = useState(false);
    const quantity = pending ?? summary.quantity;
    const removing = pending === 0;
    const editLabel = summary.edit === 'halves' ? t('line.editHalves') : t('line.edit');

    return (
        <li
            className={cn('flex gap-3 py-4 transition-opacity', removing && 'opacity-50')}
            data-testid="pj-cart-line"
            data-item-id={summary.itemId}
            data-kind={summary.kind}>
            <LinePhoto summary={summary} products={products} />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="pj-card-title m-0 min-w-0 text-pj-heading text-balance">{summary.name}</h3>
                    <span className="shrink-0 text-base font-bold text-pj-ink" data-testid="pj-cart-line-total">
                        {formatClp(summary.total)}
                    </span>
                </div>
                <LineConfig summary={summary} />
                {combo && <ComboAddon combo={combo} className="mt-1" />}
                <div className="mt-1 flex items-center justify-between gap-2">
                    {summary.edit ? (
                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            aria-label={t('line.editAria', { name: summary.name })}
                            className="-ml-1 inline-flex min-h-11 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                            {editLabel}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setQuantity(0)}
                            disabled={busy}
                            aria-label={t('line.removeAria', { name: summary.name })}
                            className="-ml-1 inline-flex min-h-11 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                            {t('line.remove')}
                        </button>
                    )}
                    <div className="flex h-11 items-center rounded-full border border-pj-line bg-pj-surface">
                        <button
                            type="button"
                            onClick={() => setQuantity(quantity - 1)}
                            disabled={busy}
                            aria-label={
                                quantity <= 1
                                    ? t('line.removeAria', { name: summary.name })
                                    : t('line.decreaseAria', { name: summary.name })
                            }
                            className="flex size-11 items-center justify-center rounded-full text-pj-basil disabled:opacity-50">
                            <MinusIcon width={18} height={18} aria-hidden="true" />
                        </button>
                        <span
                            className="min-w-6 text-center text-base font-bold tabular-nums"
                            aria-live="polite"
                            aria-label={t('line.quantityAria', { name: summary.name, count: quantity })}>
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={busy || quantity >= MAX_QUANTITY}
                            aria-label={t('line.increaseAria', { name: summary.name })}
                            className="flex size-11 items-center justify-center rounded-full text-pj-basil disabled:opacity-50">
                            <PlusIcon width={18} height={18} aria-hidden="true" />
                        </button>
                    </div>
                </div>
                {failed && (
                    <p role="alert" className="m-0 text-sm font-semibold text-pj-sauce">
                        {t('line.error')}
                    </p>
                )}
            </div>
            {summary.edit && summary.masterId && (
                <PizzaSheet
                    productId={summary.masterId}
                    itemId={summary.itemId}
                    halfFirst={summary.edit === 'halves'}
                    open={editing}
                    onOpenChange={setEditing}
                />
            )}
        </li>
    );
}

export default CartLine;
