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
/** @sfdc-extension-file SFDC_EXT_PJ_CHECKOUT */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { cropForPhoto, type FoodImageCrop } from '@/extensions/pj-shared/lib/photo';
import { LinePhoto } from '@/extensions/pj-cart/components/cart-line';
import { LineConfig } from '@/extensions/pj-cart/components/line-config';
import type { CartEntry, ComboGroup, LineProducts, LineSummary } from '@/extensions/pj-cart/lib/line-summary';

export interface OrderLinesProps {
    entries: CartEntry[];
    products: LineProducts;
    /** Pizza canjeada: a $0 con «Canjeada con N Papa Puntos». */
    canje: { itemId: string; points: number; value: number } | null;
    comboImage: string | null;
    className?: string;
}

function cropOf(summary: LineSummary): FoodImageCrop {
    if (summary.kind === 'combo') return 'combo';
    if (summary.kind === 'pizza' || summary.kind === 'halves') return cropForPhoto(summary.productId);
    return 'none';
}

function OrderLine({
    summary,
    products,
    canje,
}: {
    summary: LineSummary;
    products: LineProducts;
    canje: OrderLinesProps['canje'];
}): ReactElement {
    const { t } = useTranslation('extPjCart');
    const isCanje = canje?.itemId === summary.itemId;
    const src =
        products[summary.productId]?.image ?? (summary.masterId ? products[summary.masterId]?.image : null) ?? null;
    return (
        <div className="flex gap-3 py-3" data-testid="pj-checkout-line" data-kind={isCanje ? 'canje' : summary.kind}>
            <LinePhoto
                src={src}
                alt=""
                crop={cropOf(summary)}
                small
                halves={summary.kind === 'halves' ? summary.halves.map((half) => half.image) : undefined}
                halvesLabel={t('line.halvesAria', { parts: summary.halves.map((half) => half.name).join(', ') })}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-start justify-between gap-3">
                    <p className="pj-card-title m-0 min-w-0 text-lg text-pj-heading">
                        {summary.quantity > 1 ? `${summary.quantity}× ` : ''}
                        {summary.name}
                        {isCanje && summary.size ? ` ${t(`size.${summary.size}` as 'size.medium')}` : ''}
                    </p>
                    {isCanje && canje ? (
                        <PriceTag price={0} listPrice={canje.value} showSavings={false} size="sm" />
                    ) : (
                        <span className="shrink-0 text-base font-bold text-pj-ink tabular-nums">
                            {formatClp(summary.total)}
                        </span>
                    )}
                </div>
                {isCanje && canje ? (
                    <p className="m-0 text-sm font-semibold text-pj-price">
                        {t('line.redeemed', { points: canje.points })}
                    </p>
                ) : (
                    <LineConfig summary={summary} />
                )}
            </div>
        </div>
    );
}

function ComboOrderLine({ combo, image }: { combo: ComboGroup; image: string | null }): ReactElement {
    const { t } = useTranslation('extPjCart');
    return (
        <div className="-mt-1 mb-3 ml-4 flex gap-3 border-l-2 border-pj-line pl-3" data-testid="pj-checkout-combo">
            <LinePhoto src={image} alt="" crop="combo" small />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-start justify-between gap-3">
                    <p className="pj-card-title m-0 min-w-0 text-lg text-pj-heading">{t('line.comboName')}</p>
                    <span className="shrink-0 text-base font-bold text-pj-ink tabular-nums">
                        {formatClp(combo.total)}
                    </span>
                </div>
                <p className="m-0 text-sm text-pj-gray-strong">{combo.parts.join(' + ')}</p>
                {combo.savings > 0 && (
                    <p className="pj-micro m-0 text-pj-price">
                        {t('line.savings', { amount: formatClp(combo.savings) })}
                    </p>
                )}
            </div>
        </div>
    );
}

/**
 * Las líneas del pedido como en «Mi pedido» (UX-2 §4 regla 3), sin editar: foto, nombre, configuración en una
 * línea, extras, el combo pegado a su pizza y la pizza canjeada a $0. Las usan el checkout y la confirmación.
 */
export function OrderLines({ entries, products, canje, comboImage, className }: OrderLinesProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    return (
        <ul aria-label={t('page.linesLabel')} className={className ?? 'm-0 list-none divide-y divide-pj-line p-0'}>
            {entries.map(({ summary, combo }) => (
                <li key={summary.itemId}>
                    <OrderLine summary={summary} products={products} canje={canje} />
                    {combo && <ComboOrderLine combo={combo} image={comboImage} />}
                </li>
            ))}
        </ul>
    );
}

export default OrderLines;
