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
import { FoodImage } from '@/extensions/pj-shared';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { cn } from '@/lib/utils';
import type { MenuProduct, PjSize } from '../lib/menu-model';
import { configureFallbackHref, type PjConfigureDetail } from '../lib/menu-bridge';
import { useConfigure } from '../hooks/use-configure';
import { closerSpanClass } from '../lib/grid-layout';

export type GridCloserKind = 'halves' | 'arma' | 'promos';

const SURFACE: Record<GridCloserKind, string> = {
    halves: 'surface-basil',
    arma: 'surface-garlic',
    promos: 'surface-sauce',
};

interface GridCloserProps {
    kind: GridCloserKind;
    /** Productos de la grilla: definen cuánto falta para completar la fila. */
    count: number;
    size: PjSize;
    /** Pizza de la grilla que se propone (primera mitad, foto). */
    product?: MenuProduct;
}

/**
 * Tarjeta de cierre de la grilla (UX-2 N13): completa la última fila con una invitación a seguir
 * armando el pedido, en vez de dejar columnas vacías a 1440. Con la fila completa no se muestra.
 */
export function GridCloser({ kind, count, size, product }: GridCloserProps): ReactElement | null {
    const { t } = useTranslation('extPjMenu');
    const configure = useConfigure();
    if (count === 0) return null;
    const detail: PjConfigureDetail | null =
        kind === 'halves'
            ? { productId: product?.id ?? 'pz-mitades', halfFirst: Boolean(product), builder: 'mitades', size }
            : kind === 'arma'
              ? { productId: 'pz-arma-tu-pizza', builder: 'arma-tu-pizza', size }
              : null;
    const to = detail ? configureFallbackHref(detail) : PJ_ROUTES.promos;
    const photo = product?.image ?? null;
    return (
        <Link
            to={to}
            onClick={detail ? configure(detail) : undefined}
            data-testid="pj-menu-grid-closer"
            data-kind={kind}
            className={cn(
                closerSpanClass(count),
                SURFACE[kind],
                'group @container relative min-h-[200px] flex-col justify-center overflow-hidden rounded-pj-card no-underline shadow-pj-card transition-shadow duration-300 hover:shadow-pj-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil lg:rounded-[16px]'
            )}>
            {photo && (
                <FoodImage
                    src={photo.src}
                    srcSet={photo.srcSet}
                    sizes="(min-width: 1024px) 360px, 50vw"
                    alt=""
                    bleed
                    crop="macro"
                    className="absolute inset-y-0 right-0 hidden w-[42%] @[400px]:block"
                    imgClassName="transition-transform duration-500 ease-out motion-safe:group-hover:[transform:scale(1.05)]"
                />
            )}
            <span className="relative flex flex-col gap-2 p-4 @[400px]:max-w-[56%] lg:p-6">
                {photo && (
                    <FoodImage
                        src={photo.src}
                        srcSet={photo.srcSet}
                        sizes="96px"
                        alt=""
                        aspect="1/1"
                        bleed
                        crop="macro"
                        className="mb-1 size-[88px] rounded-full shadow-pj-float @[400px]:hidden"
                    />
                )}
                <span className="pj-card-title text-pj-heading @[400px]:text-[32px]">{t(`closer.${kind}.title`)}</span>
                <span className="text-[13px] leading-snug lg:text-[15px]">
                    {t(`closer.${kind}.body`, { name: product?.name ?? '' })}
                </span>
                <span className="inline-flex min-h-[44px] items-center text-sm font-bold text-pj-accent underline-offset-4 group-hover:underline lg:text-[15px]">
                    {t(`closer.${kind}.cta`)}
                </span>
            </span>
        </Link>
    );
}
