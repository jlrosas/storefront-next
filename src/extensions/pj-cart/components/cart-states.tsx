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
import { useRevalidator } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { useReorder } from '@/extensions/pj-home/hooks/use-home-cart';

const PULSE = 'bg-pj-sand motion-safe:animate-pulse';

/** Carrito vacío (UX-3 §3.9): foto, título, «Ver el menú» y, para Sofía, «Repetir pedido». Sin barra fija. */
export function EmptyCart({ image }: { image: string | null }): ReactElement {
    const { t } = useTranslation('extPjCart');
    const me = usePjMe();
    const { reorder, pending } = useReorder();
    const sofia = me?.registered && me.profile === 'sofia';
    return (
        <div
            className="surface-dough -mt-8 flex min-h-[70vh] flex-col items-center px-4 pt-10 pb-16 text-center"
            data-testid="pj-cart-empty">
            {image ? (
                <FoodImage src={image} alt="" crop="macro" aspect="1/1" sizes="160px" className="size-40" />
            ) : (
                <div className="size-40 rounded-pj-card bg-pj-sand" aria-hidden="true" />
            )}
            <h1 className="pj-h2 mt-6 mb-0">{t('empty.title')}</h1>
            <p className="mx-auto mt-3 mb-0 max-w-sm text-pj-gray-strong">{t('empty.hint')}</p>
            <Link
                to={PJ_ROUTES.menu}
                className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-pj-green px-8 text-base font-bold text-pj-surface no-underline">
                {t('empty.cta')}
            </Link>
            {sofia && (
                <section className="mt-8 flex w-full max-w-sm items-center justify-between gap-3 rounded-pj-card bg-pj-surface p-4 text-left shadow-pj-card">
                    <p className="m-0 font-bold text-pj-heading">{t('empty.lastOrder')}</p>
                    <button
                        type="button"
                        disabled={pending}
                        onClick={reorder}
                        className="inline-flex min-h-11 items-center rounded-full border-2 border-pj-basil px-4 text-sm font-bold text-pj-basil disabled:opacity-60">
                        {t('empty.repeat')}
                    </button>
                </section>
            )}
        </div>
    );
}

function SkeletonLine(): ReactElement {
    return (
        <div className="flex gap-3 py-4">
            <div className={`size-[72px] shrink-0 rounded-pj-card lg:size-24 ${PULSE}`} />
            <div className="flex flex-1 flex-col gap-2 pt-1">
                <div className={`h-5 w-1/2 rounded ${PULSE}`} />
                <div className={`h-4 w-3/4 rounded ${PULSE}`} />
            </div>
        </div>
    );
}

/** *Skeleton* con la forma del carrito (§3.9): modalidad, tres líneas y el resumen. Nunca el carrusel. */
export function PjCartSkeleton(): ReactElement {
    const { t } = useTranslation('extPjCart');
    return (
        <div className="surface-dough -mt-8 min-h-screen" data-testid="pj-cart-skeleton" aria-busy="true">
            <span className="sr-only">{t('load.loading')}</span>
            <div className="mx-auto w-full max-w-[1120px] px-4 pt-6 lg:px-8 lg:pt-10">
                <div className={`mb-4 h-10 w-48 rounded ${PULSE}`} />
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
                    <div className="flex flex-col gap-4">
                        <div className={`h-[76px] rounded-pj-card ${PULSE}`} />
                        <div className="rounded-pj-card bg-pj-surface px-4">
                            <SkeletonLine />
                            <SkeletonLine />
                            <SkeletonLine />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className={`h-24 rounded-pj-section ${PULSE}`} />
                        <div className={`h-32 rounded-pj-card ${PULSE}`} />
                        <div className={`h-14 rounded-full ${PULSE}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

/** Error al cargar (§3.9): «No pudimos cargar tu pedido.» con «Reintentar». */
export function PjCartLoadError(): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { revalidate, state } = useRevalidator();
    return (
        <div
            className="surface-dough -mt-8 flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center"
            role="alert">
            <p className="m-0 text-lg font-bold text-pj-heading">{t('load.error')}</p>
            <button
                type="button"
                disabled={state !== 'idle'}
                onClick={() => void revalidate()}
                className="inline-flex min-h-11 items-center rounded-full bg-pj-green px-6 font-bold text-pj-surface disabled:opacity-60">
                {t('load.retry')}
            </button>
        </div>
    );
}
