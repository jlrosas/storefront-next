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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
import type { ReactElement, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import type { FoodImageCrop } from '@/extensions/pj-shared/lib/photo';
import { useAddLines } from '../hooks/use-home-cart';
import { imageSrcSet, scaledImage } from '../lib/images';

function PlusIcon(): ReactElement {
    return (
        <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

const PLUS =
    'absolute right-2.5 bottom-2.5 z-10 grid size-11 place-items-center rounded-full bg-pj-pepperoncini text-pj-basil shadow-pj-float transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil active:scale-[0.92] disabled:opacity-70';

/** «+» que agrega en un toque (variante ya elegida) con el aviso y el vuelo al carrito de pj-shared. */
function QuickAdd({ productId, label, toastName }: { productId: string; label: string; toastName: string }) {
    const { t } = useTranslation('extPjHome');
    const { add, pending, failed } = useAddLines(toastName);
    return (
        <>
            <button
                type="button"
                className={PLUS}
                aria-label={label}
                disabled={pending}
                aria-busy={pending}
                data-testid="pj-home-card-plus"
                onClick={() => add([{ productId, quantity: 1 }])}>
                <PlusIcon />
            </button>
            {failed && (
                <p
                    role="alert"
                    className="absolute inset-x-2.5 top-2.5 z-10 rounded-lg bg-pj-dough px-2 py-1 pj-micro text-pj-sauce">
                    {t('serves.addFailed')}
                </p>
            )}
        </>
    );
}

export interface FoodCardProps {
    name: string;
    href: string;
    image: string;
    imageAlt: string;
    crop?: FoodImageCrop;
    /** Sello sobre la foto («LA MÁS PEDIDA»), en Garlic + Basil. */
    badge?: string | null;
    /** Línea de meta: ★ y pedidos de la semana. */
    meta?: ReactNode;
    /** Descripción a 2 líneas como máximo. */
    description?: string | null;
    /** Precio en Rich Sauce Bold 20 px (ya formateado y con su prefijo). */
    price?: ReactNode;
    /** Variante que agrega el «+» en un toque; sin ella, el «+» lleva a la ficha. */
    quickAdd?: { productId: string; label: string; toastName: string } | null;
    /** Texto del «+» cuando lleva a la ficha. */
    plusLabel: string;
    /** Clases del ancho en el carrusel. */
    className?: string;
    sizes?: string;
}

/**
 * Tarjeta de comida de la Home (UX-1 §3.4, P2-11): foto 4:3 en recorte macro con radio solo arriba,
 * sello sobre la foto, «+» lima de 44 px sobre la esquina de la foto, título Condensed, ★, descripción
 * a 2 líneas y precio en Rich Sauce. Sombra cálida y zoom de la foto al pasar el cursor (escritorio).
 * Toda la tarjeta lleva a la ficha (enlace estirado); el «+» es un control aparte.
 */
export function FoodCard({
    name,
    href,
    image,
    imageAlt,
    crop = 'macro',
    badge,
    meta,
    description,
    price,
    quickAdd,
    plusLabel,
    className,
    sizes = '(min-width: 1024px) 30vw, 240px',
}: FoodCardProps): ReactElement {
    return (
        <article
            data-testid="pj-home-food-card"
            className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-pj-card bg-pj-surface text-pj-ink shadow-pj-card transition-shadow hover:shadow-pj-float lg:rounded-[20px]',
                className
            )}>
            <div className="relative">
                <FoodImage
                    src={scaledImage(image, 600)}
                    srcSet={imageSrcSet(image, [320, 480, 640, 900])}
                    sizes={sizes}
                    alt={imageAlt}
                    aspect="4/3"
                    bleed
                    crop={crop}
                    imgClassName="transition-transform duration-500 ease-out motion-reduce:transition-none lg:group-hover:[transform:scale(1.05)]"
                />
                {badge && (
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-pj-garlic px-2.5 py-1 pj-micro text-pj-basil">
                        {badge}
                    </span>
                )}
                {quickAdd ? (
                    <QuickAdd {...quickAdd} />
                ) : (
                    <Link to={href} aria-label={plusLabel} className={PLUS} data-testid="pj-home-card-plus">
                        <PlusIcon />
                    </Link>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-1 px-3.5 pt-3 pb-3.5 lg:gap-1.5 lg:px-[18px] lg:pt-4 lg:pb-5">
                <h3 className="pj-card-title">
                    <Link
                        to={href}
                        className="after:absolute after:inset-0 after:rounded-[inherit] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-pj-basil">
                        {name}
                    </Link>
                </h3>
                {meta && <p className="pj-small text-pj-gray-strong">{meta}</p>}
                {description && <p className="line-clamp-2 text-sm leading-snug text-pj-gray-strong">{description}</p>}
                {price && <p className="mt-auto pt-1 text-xl font-bold text-pj-sauce">{price}</p>}
            </div>
        </article>
    );
}
