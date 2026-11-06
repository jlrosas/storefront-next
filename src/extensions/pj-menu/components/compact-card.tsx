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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import { useState, type ReactElement } from 'react';
import { Link } from '@/components/link';
import { FoodImage, PriceTag } from '@/extensions/pj-shared';
import { AddControl } from './add-control';
import { useCartLine } from '../hooks/use-cart-line';
import { defaultOption, type MenuProduct } from '../lib/menu-model';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

/**
 * Tarjeta compacta horizontal de acompañamientos, bebidas, postres y extras (MEN-01.6, MEN-02):
 * foto chica, nombre, precio y «+». Si el producto tiene opciones (tamaño de la bebida, sabor), se
 * eligen en la misma tarjeta y «+» agrega directo esa variante.
 */
export function CompactCard({ product, className }: { product: MenuProduct; className?: string }): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const options = product.options ?? [];
    const [optionId, setOptionId] = useState<string | undefined>(() => defaultOption(options)?.id);
    const option = options.find((candidate) => candidate.id === optionId);
    const productId = option?.id ?? product.id;
    const price = option?.price ?? product.price;
    const line = useCartLine({
        productId,
        name: option ? `${product.name} ${option.label}` : product.name,
        price,
    });
    return (
        <article
            className={cn('flex flex-col gap-2 rounded-pj-card bg-pj-surface p-2 lg:p-2.5', className)}
            data-testid="pj-menu-compact-card">
            <div className="flex items-center gap-2.5 lg:gap-3">
                {product.image && (
                    <FoodImage
                        src={product.image.src}
                        srcSet={product.image.srcSet}
                        sizes="64px"
                        alt={product.image.alt}
                        aspect="1/1"
                        className="size-[52px] shrink-0 rounded-[10px] lg:size-16"
                    />
                )}
                <div className="min-w-0 flex-1">
                    <Link
                        to={`/p/${product.id}`}
                        className="-my-3 block py-3 text-sm font-bold text-pj-ink no-underline lg:text-[15px]">
                        {product.name}
                    </Link>
                    <PriceTag price={price} size="sm" className="text-pj-gray" />
                </div>
                <AddControl line={line} name={product.name} optionLabel={option?.label} />
            </div>
            {options.length > 1 && (
                <div
                    role="group"
                    aria-label={t('compact.options', { name: product.name })}
                    className="flex gap-1.5 overflow-x-auto pb-0.5">
                    {options.map((candidate) => {
                        const on = candidate.id === option?.id;
                        return (
                            <button
                                key={candidate.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setOptionId(candidate.id)}
                                className={cn(
                                    'min-h-[44px] shrink-0 cursor-pointer rounded-[10px] border-2 px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                                    on
                                        ? 'border-pj-green bg-pj-lime-soft text-pj-green-dark'
                                        : 'border-pj-line bg-pj-surface text-pj-ink'
                                )}>
                                {candidate.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </article>
    );
}
