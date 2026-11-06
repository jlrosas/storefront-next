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
import { FoodImage, formatClp } from '@/extensions/pj-shared';
import { priceAtSize, type MenuProduct, type PjSize } from '../lib/menu-model';
import { asTr } from '../lib/i18n';
import { configureFallbackHref, type PjConfigureDetail } from '../lib/menu-bridge';
import { useConfigure } from '../hooks/use-configure';

interface BuildCardsProps {
    mitades: MenuProduct | null;
    arma: MenuProduct | null;
    size: PjSize;
    /** Fotos de las dos mitades de la imagen dividida. */
    left: MenuProduct | undefined;
    right: MenuProduct | undefined;
    armaImage: MenuProduct | undefined;
}

/**
 * Las dos tarjetas de construcción al inicio de pizzas (MEN-01.4): «Mitad y mitad» (imagen dividida,
 * pagas el promedio) y «Arma tu pizza» (desde el precio del tamaño elegido). Abren el armador y la
 * hoja de PRO con `pz-mitades` y `pz-arma-tu-pizza`.
 */
export function BuildCards({ mitades, arma, size, left, right, armaImage }: BuildCardsProps): ReactElement | null {
    const { t } = useTranslation('extPjMenu');
    const tr = asTr(t);
    const configure = useConfigure();
    const halvesDetail: PjConfigureDetail = { productId: mitades?.id ?? 'pz-mitades', builder: 'mitades', size };
    const armaDetail: PjConfigureDetail = { productId: arma?.id ?? 'pz-arma-tu-pizza', builder: 'arma-tu-pizza', size };
    const armaPhoto = armaImage?.image ?? arma?.image ?? null;
    const armaPrice = arma ? priceAtSize(arma, size) : null;
    return (
        <div
            className="grid grid-cols-2 gap-2.5 lg:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] lg:gap-3.5"
            data-testid="pj-menu-build-cards">
            {mitades && (
                <Link
                    to={configureFallbackHref(halvesDetail)}
                    onClick={configure(halvesDetail)}
                    data-testid="pj-menu-build-halves"
                    className="flex flex-col items-center gap-1.5 rounded-[16px] bg-pj-green-dark p-3 text-center text-pj-surface no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:flex-row lg:gap-[18px] lg:rounded-[18px] lg:px-5 lg:py-4 lg:text-left">
                    <span
                        aria-hidden="true"
                        className="relative size-[84px] shrink-0 overflow-hidden rounded-full border-[3px] border-pj-lime lg:size-[110px]">
                        {left?.image && (
                            <img
                                src={left.image.src}
                                alt=""
                                width={110}
                                height={110}
                                className="absolute inset-0 size-full object-cover [clip-path:inset(0_50%_0_0)]"
                            />
                        )}
                        {right?.image && (
                            <img
                                src={right.image.src}
                                alt=""
                                width={110}
                                height={110}
                                className="absolute inset-0 size-full object-cover [clip-path:inset(0_0_0_50%)]"
                            />
                        )}
                        <span className="absolute inset-y-0 left-1/2 -ml-[1.5px] w-[3px] bg-pj-lime" />
                    </span>
                    <span className="flex flex-col gap-1">
                        <span className="font-heading text-xl leading-none font-extrabold text-pj-lime uppercase lg:text-[28px]">
                            {t('build.halvesTitle')}
                        </span>
                        <span className="text-xs leading-tight lg:hidden">{t('build.halvesShort')}</span>
                        <span className="hidden text-[15px] lg:block">{t('build.halvesLong')}</span>
                        <span className="hidden text-sm font-bold lg:block">{t('build.halvesCta')}</span>
                    </span>
                </Link>
            )}
            {arma && (
                <Link
                    to={configureFallbackHref(armaDetail)}
                    onClick={configure(armaDetail)}
                    data-testid="pj-menu-build-arma"
                    className="flex flex-col items-center gap-1.5 rounded-[16px] border-[1.5px] border-[#E9C9A6] bg-[#FFF3E6] p-3 text-center text-pj-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green lg:flex-row lg:gap-[18px] lg:rounded-[18px] lg:px-5 lg:py-4 lg:text-left">
                    {armaPhoto && (
                        <FoodImage
                            src={armaPhoto.src}
                            srcSet={armaPhoto.srcSet}
                            sizes="110px"
                            alt=""
                            aspect="1/1"
                            crop="macro"
                            className="size-[84px] shrink-0 rounded-full lg:size-[110px]"
                        />
                    )}
                    <span className="flex flex-col gap-1">
                        <span className="font-heading text-xl leading-none font-extrabold text-[#7A3A12] uppercase lg:text-[28px]">
                            {t('build.armaTitle')}
                        </span>
                        <span className="hidden text-[15px] lg:block">{t('build.armaLong')}</span>
                        {armaPrice !== null && (
                            <span className="text-xs leading-tight lg:text-sm lg:font-bold">
                                {t('build.armaFrom', { price: formatClp(armaPrice), size: tr(`size.${size}`) })}
                            </span>
                        )}
                    </span>
                </Link>
            )}
        </div>
    );
}
