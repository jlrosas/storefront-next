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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { cropForPhoto } from '@/extensions/pj-shared/lib/photo';
import { SplitPizzaImage } from '@/extensions/pj-product/components/split-pizza-image';
import { useImageUrl } from '@/extensions/pj-product/hooks/use-image-url';
import type { ComboGroup, LineProducts, LineSummary } from '../lib/line-summary';
import { linePrice } from '../lib/cart-model';

export interface CompactLineProps {
    summary: LineSummary;
    combo?: ComboGroup | null;
    /** Fotos (las del recurso `/resource/pj-cart-lines`). */
    products?: LineProducts;
    /** La línea es la pizza canjeada con Papa Puntos: «$0» con el precio de catálogo tachado (VAL-C3 H-2). */
    canje?: { value: number } | null;
}

/**
 * Línea del panel «Tu pedido» del menú (UX-3 §3.12): foto de 48 px, nombre de 16 Bold (sin «1×» con cantidad
 * 1), configuración y extras en una línea de 13 px y, debajo, su «Combo Palitos y bebida» con sangría.
 */
export function CompactLine({ summary, combo, products = {}, canje }: CompactLineProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { url } = useImageUrl();
    const src =
        products[summary.productId]?.image ?? (summary.masterId ? products[summary.masterId]?.image : null) ?? null;
    const config = [summary.detail, summary.extras.map((extra) => t('line.plus', { name: extra.name })).join(' · ')]
        .filter(Boolean)
        .join(' · ');
    return (
        <div className="flex flex-col gap-2" data-testid="pj-compact-line" data-kind={summary.kind}>
            <div className="flex gap-2.5">
                {summary.kind === 'halves' && summary.halves.length ? (
                    <SplitPizzaImage
                        images={summary.halves.map((half) => url(half.image, 144) ?? null)}
                        label={summary.name}
                        size={48}
                    />
                ) : src ? (
                    <FoodImage
                        src={src}
                        alt=""
                        crop={
                            summary.kind === 'combo'
                                ? 'combo'
                                : summary.kind === 'other'
                                  ? 'none'
                                  : cropForPhoto(summary.productId)
                        }
                        aspect="1/1"
                        sizes="48px"
                        className="size-12 shrink-0"
                    />
                ) : (
                    <div className="size-12 shrink-0 rounded-pj-card bg-pj-sand" aria-hidden="true" />
                )}
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="flex justify-between gap-2">
                        <span className="min-w-0 text-base font-bold text-pj-heading">
                            {summary.quantity > 1 ? `${summary.quantity}× ` : ''}
                            {summary.name}
                        </span>
                        {canje ? (
                            <span
                                className="flex shrink-0 items-baseline gap-1.5 tabular-nums"
                                data-testid="pj-compact-canje">
                                <span className="font-bold text-pj-price">{formatClp(0)}</span>
                                <s className="text-[13px] text-pj-gray-strong">{formatClp(canje.value)}</s>
                            </span>
                        ) : (
                            <span className="shrink-0 font-bold tabular-nums">{formatClp(linePrice(summary))}</span>
                        )}
                    </span>
                    {config && <span className="text-[13px] leading-snug text-pj-gray-strong">{config}</span>}
                </div>
            </div>
            {combo && (
                <div className="ml-6 flex flex-col border-l-2 border-pj-line pl-3" data-testid="pj-compact-combo">
                    <span className="flex justify-between gap-2">
                        <span className="text-[15px] font-bold text-pj-heading">{t('line.comboName')}</span>
                        <span className="shrink-0 font-bold tabular-nums">{formatClp(combo.total)}</span>
                    </span>
                    <span className="text-[13px] text-pj-gray-strong">{combo.parts.join(' + ')}</span>
                    {combo.savings > 0 && (
                        <span className="pj-micro text-pj-price">
                            {t('line.savings', { amount: formatClp(combo.savings) })}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default CompactLine;
