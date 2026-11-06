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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { FoodImage, PriceTag, Stars } from '@/extensions/pj-shared';
import { cn } from '@/lib/utils';
import { badgeFor, priceAtSize, sizeLabelKey, type MenuProduct, type PjSize } from '../lib/menu-model';
import { asTr } from '../lib/i18n';
import { configureFallbackHref, type PjConfigureDetail } from '../lib/menu-bridge';
import { useConfigure } from '../hooks/use-configure';

const BADGE_STYLE = {
    top: 'bg-pj-lime text-pj-green-dark',
    spicy: 'bg-pj-sale text-pj-surface',
    new: 'bg-pj-green text-pj-surface',
    forTwo: 'bg-pj-lime-soft text-pj-green-dark',
} as const;

/**
 * Tarjeta de pizza grande (MEN-01.6): foto en primer plano, texto que se saborea, ★ y precio en el
 * tamaño elegido. «Agregar» abre la hoja de PRO; «½ Mitad» abre el armador con esta pizza en la
 * primera mitad (solo las especialidades que admiten mitades).
 */
export function PizzaCard({
    product,
    size,
    priority = false,
}: {
    product: MenuProduct;
    size: PjSize;
    priority?: boolean;
}): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const tr = asTr(t);
    const configure = useConfigure();
    const price = priceAtSize(product, size);
    const labelKey = sizeLabelKey(product, size);
    const badge = badgeFor(product);
    const href = `/p/${product.id}`;
    const addDetail: PjConfigureDetail = { productId: product.id, size };
    const halfDetail: PjConfigureDetail = { productId: product.id, halfFirst: true, size };
    return (
        <article
            className="flex flex-col overflow-hidden rounded-pj-card bg-pj-surface shadow-pj-card lg:rounded-[16px]"
            data-testid="pj-menu-pizza-card"
            data-product-id={product.id}>
            <Link to={href} tabIndex={-1} aria-hidden="true" className="relative block">
                {product.image ? (
                    <FoodImage
                        src={product.image.src}
                        srcSet={product.image.srcSet}
                        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
                        alt=""
                        aspect="4/3"
                        bleed
                        priority={priority}
                    />
                ) : (
                    <div className="bg-pj-sand" style={{ aspectRatio: '4/3' }} />
                )}
                {badge && (
                    <span
                        className={cn(
                            'absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold',
                            BADGE_STYLE[badge]
                        )}>
                        {tr(`badge.${badge}`)}
                    </span>
                )}
            </Link>
            <div className="flex flex-1 flex-col gap-1 p-2 pb-2.5 lg:p-3">
                <Link
                    to={href}
                    className="-my-3.5 py-3.5 text-sm leading-tight font-bold text-pj-ink no-underline lg:text-base">
                    {product.name}
                </Link>
                {product.sensory && (
                    <p className="line-clamp-2 flex-1 text-xs leading-snug text-pj-gray-strong lg:text-[13px]">
                        {product.sensory}
                    </p>
                )}
                {typeof product.rating === 'number' && (
                    <Stars rating={product.rating} count={product.reviews} className="text-xs" />
                )}
                {price !== null ? (
                    <PriceTag price={price} prefix={tr(`size.${labelKey}`)} size="md" className="text-pj-gray" />
                ) : (
                    <PriceTag price={product.price} prefix={t('pizza.from')} size="md" className="text-pj-gray" />
                )}
                <div className="mt-1 flex gap-1.5">
                    <Link
                        to={href}
                        onClick={configure(addDetail)}
                        aria-label={t('pizza.addAria', { name: product.name })}
                        data-testid="pj-menu-pizza-add"
                        className="flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-pj-green text-[13px] font-bold text-pj-surface no-underline hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:text-sm">
                        {t('pizza.add')}
                    </Link>
                    {product.halves && (
                        <Link
                            to={configureFallbackHref(halfDetail)}
                            onClick={configure(halfDetail)}
                            aria-label={t('pizza.halfAria', { name: product.name })}
                            data-testid="pj-menu-pizza-half"
                            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-[1.5px] border-pj-green px-3 text-sm font-bold text-pj-green no-underline hover:bg-pj-lime-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                            <span aria-hidden="true" className="lg:hidden">
                                {t('pizza.halfShort')}
                            </span>
                            <span aria-hidden="true" className="hidden lg:inline">
                                {t('pizza.half')}
                            </span>
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
