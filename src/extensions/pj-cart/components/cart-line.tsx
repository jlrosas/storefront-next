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
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { LtoBadge } from '@/extensions/pj-shared/components/lto-badge';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { cropForPhoto, type FoodImageCrop } from '@/extensions/pj-shared/lib/photo';
import { useReducedMotion } from '@/extensions/pj-shared/hooks/use-reduced-motion';
import { PizzaSheet } from '@/extensions/pj-product/components/pizza-sheet-launcher';
import { SplitPizzaImage } from '@/extensions/pj-product/components/split-pizza-image';
import { useImageUrl } from '@/extensions/pj-product/hooks/use-image-url';
import { MinusIcon, PlusIcon } from '@/extensions/pj-product/components/icons';
import { cn } from '@/lib/utils';
import type { LineProducts, LineSummary } from '../lib/line-summary';
import { useLineQuantity } from '../hooks/use-line-quantity';
import { useCountUp } from '../hooks/use-count-up';
import { LineConfig } from './line-config';
import { TrashIcon } from './icons';

const MAX_QUANTITY = 10;

/** Foto de 72 px a 390 y 96 px a 1440 (UX-3 §3.3), sin *letterbox*. */
export function LinePhoto({
    src,
    alt,
    crop,
    halves,
    halvesLabel,
    small,
}: {
    src: string | null;
    alt: string;
    crop: FoodImageCrop;
    halves?: Array<string | null>;
    halvesLabel?: string;
    /** Línea de combo bajo su pizza: 56 px. */
    small?: boolean;
}): ReactElement {
    const { url } = useImageUrl();
    const box = small ? 'size-14' : 'size-[72px] lg:size-24';
    if (halves?.length) {
        const images = halves.map((image) => url(image, 288) ?? null);
        return (
            <>
                <SplitPizzaImage images={images} label={halvesLabel ?? alt} size={72} className="lg:hidden" />
                <SplitPizzaImage images={images} label={halvesLabel ?? alt} size={96} className="hidden lg:block" />
            </>
        );
    }
    if (!src) return <div className={cn('shrink-0 rounded-pj-card bg-pj-sand', box)} aria-hidden="true" />;
    return (
        <FoodImage
            src={src}
            alt={alt}
            crop={crop}
            aspect="1/1"
            sizes={small ? '56px' : '(min-width: 1024px) 96px, 72px'}
            className={cn('shrink-0', box, crop === 'none' && 'bg-pj-dough')}
        />
    );
}

/** Píldora de cantidad: con 1, el «−» es una papelera (UX-3 §3.3). */
export function QuantityPill({
    name,
    quantity,
    busy,
    onChange,
}: {
    name: string;
    quantity: number;
    busy: boolean;
    onChange: (quantity: number) => void;
}): ReactElement {
    const { t } = useTranslation('extPjCart');
    const last = quantity <= 1;
    return (
        <div className="flex h-11 shrink-0 items-center rounded-full border border-pj-line bg-pj-surface">
            <button
                type="button"
                onClick={() => onChange(quantity - 1)}
                disabled={busy}
                aria-label={last ? t('line.removeAria', { name }) : t('line.decreaseAria', { name })}
                data-testid={last ? 'pj-line-trash' : 'pj-line-decrease'}
                className="flex size-11 items-center justify-center rounded-full text-pj-basil disabled:opacity-50">
                {last ? <TrashIcon size={18} /> : <MinusIcon width={18} height={18} aria-hidden="true" />}
            </button>
            <span
                className="min-w-6 text-center text-base font-bold tabular-nums"
                aria-live="polite"
                aria-label={t('line.quantityAria', { name, count: quantity })}>
                {quantity}
            </span>
            <button
                type="button"
                onClick={() => onChange(quantity + 1)}
                disabled={busy || quantity >= MAX_QUANTITY}
                aria-label={t('line.increaseAria', { name })}
                className="flex size-11 items-center justify-center rounded-full text-pj-basil disabled:opacity-50">
                <PlusIcon width={18} height={18} aria-hidden="true" />
            </button>
        </div>
    );
}

/** Sello «GRATIS» 1,2 s al canjear (§3.10.5). Sin animación con «reducir movimiento»: no se muestra. */
function FreeStamp(): ReactElement | null {
    const { t } = useTranslation('extPjCart');
    const reduced = useReducedMotion();
    const [visible, setVisible] = useState(!reduced);
    useEffect(() => {
        if (!visible) return undefined;
        const timer = setTimeout(() => setVisible(false), 1200);
        return () => clearTimeout(timer);
    }, [visible]);
    if (!visible) return null;
    return (
        <span className="pointer-events-none absolute -top-2 -left-2 z-10">
            <LtoBadge variant="lime" size="sm" animate>
                {t('line.free')}
            </LtoBadge>
        </span>
    );
}

export interface CartLineProps {
    summary: LineSummary;
    products: LineProducts;
    /** La línea es la pizza canjeada con Papa Puntos ($0, «Canjeada con N Papa Puntos»). */
    canje?: { points: number; value: number; fresh: boolean } | null;
    /** Aviso bajo la línea (promo solo retiro con delivery). */
    notice?: ReactNode;
    /** Se quitó la línea: la página muestra «Quitaste X · Deshacer». */
    onRemoved: (summary: LineSummary) => void;
    /** Debajo va su «Combo Palitos y bebida»: sin divisor entre las dos. */
    joined?: boolean;
}

/**
 * Línea de `/cart` (UX-3 §3.3): foto, nombre, total con extras, configuración en una línea, extras en otra,
 * «Editar» con la hoja de PRO y la píldora de cantidad (papelera con 1). Al quitar se colapsa en 200 ms.
 */
export function CartLine({ summary, products, canje, notice, onRemoved, joined }: CartLineProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const [editing, setEditing] = useState(false);
    const [leaving, setLeaving] = useState(false);
    const { setQuantity, busy, failed, pending } = useLineQuantity(summary.itemId, () => onRemoved(summary));
    const quantity = pending && pending > 0 ? pending : summary.quantity;
    const price = useCountUp(summary.total);
    const editLabel = summary.edit === 'halves' ? t('line.editHalves') : t('line.edit');

    useEffect(() => {
        if (failed) setLeaving(false);
    }, [failed]);

    const change = (next: number) => {
        if (next <= 0) setLeaving(true);
        setQuantity(next);
    };

    const src =
        products[summary.productId]?.image ?? (summary.masterId ? products[summary.masterId]?.image : null) ?? null;
    const crop: FoodImageCrop =
        summary.kind === 'combo'
            ? 'combo'
            : summary.kind === 'pizza' || summary.kind === 'halves'
              ? cropForPhoto(summary.productId)
              : 'none';

    return (
        <li
            className={cn(
                'grid transition-[grid-template-rows,opacity] duration-200 motion-reduce:transition-none',
                leaving ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100',
                'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200',
                joined && '!border-b-0'
            )}
            data-testid="pj-cart-line"
            data-item-id={summary.itemId}
            data-kind={canje ? 'canje' : summary.kind}>
            <div className="flex min-h-0 gap-3 overflow-hidden py-4">
                <div className="relative shrink-0">
                    <LinePhoto
                        src={src}
                        alt={summary.name}
                        crop={crop}
                        halves={summary.kind === 'halves' ? summary.halves.map((half) => half.image) : undefined}
                        halvesLabel={t('line.halvesAria', {
                            parts: summary.halves.map((half) => half.name).join(', '),
                        })}
                    />
                    {canje?.fresh && <FreeStamp />}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="pj-card-title m-0 line-clamp-2 min-w-0 text-pj-heading text-balance">
                            {summary.name}
                            {canje && summary.size ? ` ${t(`size.${summary.size}` as 'size.medium')}` : ''}
                        </h3>
                        <div className="flex shrink-0 flex-col items-end">
                            {canje ? (
                                <PriceTag price={0} listPrice={canje.value} showSavings={false} size="sm" />
                            ) : (
                                <span
                                    className="text-base font-bold text-pj-ink tabular-nums"
                                    data-testid="pj-cart-line-total">
                                    {formatClp(price)}
                                </span>
                            )}
                            {!canje && summary.quantity > 1 && (
                                <span className="text-[13px] text-pj-gray-strong tabular-nums">
                                    {t('line.unitPrice', {
                                        count: summary.quantity,
                                        price: formatClp(Math.round(summary.total / summary.quantity)),
                                    })}
                                </span>
                            )}
                        </div>
                    </div>
                    {canje ? (
                        <p className="m-0 text-sm font-semibold text-pj-price">
                            {t('line.redeemed', { points: canje.points })}
                        </p>
                    ) : (
                        <LineConfig summary={summary} />
                    )}
                    {summary.savings > 0 && (
                        <p className="pj-micro m-0 text-pj-price">
                            {t('line.savings', { amount: formatClp(summary.savings) })}
                        </p>
                    )}
                    {notice}
                    {!canje && (
                        <div className="mt-0.5 flex items-center justify-between gap-2">
                            {summary.edit ? (
                                <button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                    aria-label={t('line.editAria', { name: summary.name })}
                                    className="-ml-1 inline-flex min-h-11 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                                    {editLabel}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => change(0)}
                                    disabled={busy}
                                    aria-label={t('line.removeAria', { name: summary.name })}
                                    className="-ml-1 inline-flex min-h-11 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                                    {t('line.remove')}
                                </button>
                            )}
                            <QuantityPill name={summary.name} quantity={quantity} busy={busy} onChange={change} />
                        </div>
                    )}
                    {failed && (
                        <p role="alert" className="m-0 text-sm font-semibold text-pj-price">
                            {t('line.error')}
                        </p>
                    )}
                </div>
            </div>
            {summary.edit && summary.masterId && (
                <PizzaSheet
                    productId={summary.masterId}
                    itemId={summary.itemId}
                    halfFirst={summary.edit === 'halves'}
                    open={editing}
                    onOpenChange={setEditing}
                />
            )}
        </li>
    );
}

export default CartLine;
