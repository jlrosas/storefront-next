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
import { FoodImage, Stars, formatClp } from '@/extensions/pj-shared';
import { cn } from '@/lib/utils';
import { badgeFor, priceAtSize, sizeLabelKey, type MenuProduct, type PjSize } from '../lib/menu-model';
import { asTr } from '../lib/i18n';
import { configureFallbackHref, type PjConfigureDetail } from '../lib/menu-bridge';
import { useConfigure } from '../hooks/use-configure';
import { PlusIcon } from './menu-icons';

/** Sellos de la tarjeta (UX-1 §3.1): pares ADA de la paleta S-D18, nunca Tangy Tomato con texto. */
const BADGE_STYLE = {
    top: 'bg-pj-garlic text-pj-basil',
    spicy: 'bg-pj-sauce text-pj-dough',
    new: 'bg-pj-pepperoncini text-pj-basil',
    forTwo: 'bg-pj-garlic text-pj-sauce',
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
    const pricePrefix = price !== null ? tr(`size.${labelKey}`) : t('pizza.from');
    return (
        <article
            className="group flex flex-col overflow-hidden rounded-pj-card bg-pj-surface shadow-pj-card transition-shadow duration-300 hover:shadow-pj-float lg:rounded-[16px]"
            data-testid="pj-menu-pizza-card"
            data-product-id={product.id}>
            <div className="relative">
                <Link to={href} tabIndex={-1} aria-hidden="true" className="block">
                    {product.image ? (
                        <FoodImage
                            src={product.image.src}
                            srcSet={product.image.srcSet}
                            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
                            alt=""
                            aspect="4/3"
                            bleed
                            crop="macro"
                            priority={priority}
                            imgClassName="transition-transform duration-500 ease-out motion-safe:group-hover:[transform:scale(1.05)]"
                        />
                    ) : (
                        <div className="bg-pj-sand" style={{ aspectRatio: '4/3' }} />
                    )}
                </Link>
                {badge && (
                    <span
                        data-testid="pj-menu-pizza-badge"
                        className={cn(
                            'pointer-events-none absolute top-2 left-2 rounded-full px-2.5 py-1 pj-micro shadow-pj-card',
                            BADGE_STYLE[badge]
                        )}>
                        {tr(`badge.${badge}`)}
                    </span>
                )}
                {/* «+» lima sobre la foto (UX-1 §3.4, patrón Uber Eats/Domino's): agrega en un toque. */}
                <Link
                    to={href}
                    onClick={configure(addDetail)}
                    aria-label={t('pizza.addAria', { name: product.name })}
                    data-testid="pj-menu-pizza-plus"
                    className="absolute right-2 bottom-2 flex size-11 items-center justify-center rounded-full bg-pj-pepperoncini text-pj-basil no-underline shadow-pj-float transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.92]">
                    <PlusIcon size={22} />
                </Link>
            </div>
            <div className="flex flex-1 flex-col gap-1.5 p-2.5 pb-3 lg:p-3.5">
                <Link to={href} className="-my-3 py-3 pj-card-title text-pj-basil no-underline hover:underline">
                    {product.name}
                </Link>
                {typeof product.rating === 'number' && (
                    <Stars rating={product.rating} count={product.reviews} className="text-[13px]" />
                )}
                {product.sensory && (
                    <p className="line-clamp-2 flex-1 text-[13px] leading-snug text-pj-gray-strong lg:text-sm">
                        {product.sensory}
                    </p>
                )}
                {/* N14: el «+» de la foto agrega; «½ Mitad» queda como única acción secundaria, junto al precio. */}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 pt-1">
                    <p className="flex flex-wrap items-baseline gap-x-1.5" data-testid="pj-menu-pizza-price">
                        <span className="text-[13px] font-bold text-pj-gray">{pricePrefix}</span>
                        <span className="text-xl leading-none font-bold text-pj-sauce">
                            {formatClp(price ?? product.price)}
                        </span>
                    </p>
                    {product.halves && (
                        <Link
                            to={configureFallbackHref(halfDetail)}
                            onClick={configure(halfDetail)}
                            aria-label={t('pizza.halfAria', { name: product.name })}
                            data-testid="pj-menu-pizza-half"
                            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1 rounded-full border-[1.5px] border-pj-basil px-3.5 text-[13px] font-bold whitespace-nowrap text-pj-basil no-underline transition-transform hover:bg-pj-basil hover:text-pj-dough focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.97] lg:text-sm">
                            <span aria-hidden="true">{t('pizza.half')}</span>
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
