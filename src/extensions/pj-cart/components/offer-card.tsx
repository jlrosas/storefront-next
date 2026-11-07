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
import { type ReactElement, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { flyToCart } from '@/extensions/pj-shared/lib/fly-to-cart';
import { usePjCart } from '@/extensions/pj-product/hooks/use-pj-cart';
import { PlusIcon } from '@/extensions/pj-product/components/icons';
import { cn } from '@/lib/utils';
import type { OfferKind } from '../lib/cart-model';
import type { CartExtras } from '../lib/types';

export interface OfferCardProps {
    kind: OfferKind;
    extras: CartExtras;
    /** «Convertir en combo»: las líneas sueltas de palitos y bebida que pasan a combo. */
    looseItems: Array<{ itemId: string; productId: string }>;
}

/**
 * La única venta cruzada del carrito (UX-3 §3.5): «Conviértelo en combo» con borde Rich Sauce, o una bebida
 * o un postre con el «+» lima del menú. El precio y el ahorro vienen del catálogo y de la promoción.
 */
export function OfferCard({ kind, extras, looseItems }: OfferCardProps): ReactElement | null {
    const { t } = useTranslation('extPjCart');
    const { submit, busy } = usePjCart();
    const photo = useRef<HTMLDivElement>(null);

    if (kind === 'convert') {
        const convert = async () => {
            // Se vuelven a agregar juntas: la promoción las cobra como combo en la canasta.
            const removed = await submit({ intent: 'remove', itemIds: looseItems.map((item) => item.itemId) });
            if (!removed.success) return;
            await submit({
                intent: 'add',
                items: looseItems.map((item) => ({ productId: item.productId, quantity: 1 })),
            });
        };
        return (
            <section
                aria-label={t('offer.label')}
                data-testid="pj-cart-offer"
                data-offer="convert"
                className="flex gap-3 overflow-hidden rounded-pj-card border-2 border-pj-sauce bg-pj-surface">
                <div className="w-[104px] shrink-0 lg:w-[120px]">
                    {extras.convert?.image ? (
                        <FoodImage
                            src={extras.convert.image}
                            alt=""
                            crop="combo"
                            bleed
                            sizes="(min-width: 1024px) 120px, 104px"
                            className="h-full min-h-[120px]"
                        />
                    ) : (
                        <div className="h-full min-h-[120px] bg-pj-sand" aria-hidden="true" />
                    )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2 py-3 pr-3">
                    {extras.convert?.savings ? (
                        <p className="pj-micro m-0 text-pj-price">
                            {t('offer.convertEyebrow', { amount: formatClp(extras.convert.savings) })}
                        </p>
                    ) : null}
                    <p className="m-0 text-base font-bold text-pj-ink">{t('offer.convertText')}</p>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => void convert()}
                        className="inline-flex min-h-11 items-center self-start rounded-full bg-pj-sauce px-5 text-[15px] font-bold text-pj-dough disabled:opacity-60">
                        {t('offer.convert')}
                    </button>
                </div>
            </section>
        );
    }

    const product = kind === 'drink' ? extras.drink : extras.dessert;
    if (!product) return null;
    const title = kind === 'drink' ? t('offer.drinkTitle') : t('offer.dessertTitle');
    const add = async () => {
        void flyToCart(photo.current);
        await submit({ intent: 'add', items: [{ productId: product.productId, quantity: 1 }] });
    };
    return (
        <section
            aria-label={t('offer.label')}
            data-testid="pj-cart-offer"
            data-offer={kind}
            className="flex items-center gap-3 rounded-pj-card border border-pj-line bg-pj-surface p-3">
            <div ref={photo} className="shrink-0">
                {product.image ? (
                    <FoodImage
                        src={product.image}
                        alt={product.name}
                        crop="none"
                        aspect="1/1"
                        sizes="72px"
                        className="size-[72px] bg-pj-dough"
                    />
                ) : (
                    <div className="size-[72px] rounded-pj-card bg-pj-sand" aria-hidden="true" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="pj-card-title m-0 text-lg text-pj-heading lg:text-xl">{title}</p>
                <p className="m-0 text-sm text-pj-gray-strong">
                    {product.name} · <span className="font-bold text-pj-ink">{formatClp(product.price)}</span>
                </p>
            </div>
            <button
                type="button"
                disabled={busy}
                onClick={() => void add()}
                aria-label={t('offer.add', { name: product.name, price: formatClp(product.price) })}
                className={cn(
                    'flex size-11 shrink-0 items-center justify-center rounded-full bg-pj-pepperoncini text-pj-basil',
                    busy && 'opacity-60'
                )}>
                <PlusIcon width={20} height={20} aria-hidden="true" />
            </button>
        </section>
    );
}

export default OfferCard;
