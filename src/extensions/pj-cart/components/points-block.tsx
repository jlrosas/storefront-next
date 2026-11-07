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
import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatCount } from '@/extensions/pj-shared/lib/format';
import { usePjCart } from '@/extensions/pj-product/hooks/use-pj-cart';
import { cn } from '@/lib/utils';
import type { CanjeState } from '../lib/cart-model';
import { writeCanjeCookie } from '../lib/canje';
import type { CartExtras } from '../lib/types';
import { useCountUp } from '../hooks/use-count-up';

export interface PointsBlockProps {
    /** Puntos que suma el pedido (`pointsFor`). */
    earn: number;
    doublePoints: boolean;
    /** Saldo del cliente con sesión (`null` sin sesión). */
    balance: number | null;
    redeem: CartExtras['redeem'];
    canje: CanjeState | null;
    /** Al canjear o deshacer (la página guarda el canje y marca la línea nueva). */
    onCanje: (canje: CanjeState | null) => void;
    className?: string;
}

/**
 * Papa Puntos (UX-3 §3.6): el único bloque de color fuerte, en `surface-sauce`. Sin sesión, cuánto suma el
 * pedido; con saldo suficiente, el canje de la pizza mediana; ya canjeado, el saldo que queda y «Deshacer».
 */
export function PointsBlock({
    earn,
    doublePoints,
    balance,
    redeem,
    canje,
    onCanje,
    className,
}: PointsBlockProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const { submit, busy } = usePjCart();
    const [error, setError] = useState(false);
    const left = balance !== null && canje ? balance - canje.points : balance;
    const shownLeft = useCountUp(left ?? 0, 600);
    const earnText = (
        <>
            {t('points.earnPrefix')} <strong>{t('points.earnPoints', { points: formatCount(earn) })}</strong>
            {doublePoints ? ` ${t('points.doubleSuffix')}` : ''}
        </>
    );

    const doRedeem = async () => {
        if (!redeem) return;
        setError(false);
        const result = await submit({ intent: 'add', items: [{ productId: redeem.productId, quantity: 1 }] });
        const itemId = result.addedItemIds?.[0];
        if (!result.success || !itemId) {
            setError(true);
            return;
        }
        const next: CanjeState = { itemId, productId: redeem.productId, points: redeem.points, value: redeem.price };
        writeCanjeCookie(next);
        onCanje(next);
    };

    const undo = async () => {
        if (!canje) return;
        const result = await submit({ intent: 'remove', itemIds: [canje.itemId] });
        if (!result.success) {
            setError(true);
            return;
        }
        writeCanjeCookie(null);
        onCanje(null);
    };

    let body: ReactElement;
    if (canje && balance !== null) {
        body = (
            <div className="flex flex-col gap-3">
                <p className="m-0 text-base font-bold" aria-live="polite">
                    {t('points.redeemed', {
                        points: formatCount(canje.points),
                        left: formatCount(shownLeft),
                        earn: formatCount(earn),
                    })}
                </p>
                <button
                    type="button"
                    disabled={busy}
                    onClick={() => void undo()}
                    className="inline-flex min-h-11 items-center self-start rounded-full border-2 border-pj-dough px-5 text-[15px] font-bold text-pj-dough disabled:opacity-60">
                    {t('points.undo')}
                </button>
            </div>
        );
    } else if (balance !== null && redeem && balance >= redeem.points) {
        body = (
            <div className="flex flex-col gap-2">
                <p className="pj-micro m-0 text-pj-accent">{t('points.eyebrow', { points: formatCount(earn) })}</p>
                <div className="flex gap-3">
                    {redeem.image && (
                        <FoodImage
                            src={redeem.image}
                            alt=""
                            crop="macro"
                            aspect="1/1"
                            sizes="56px"
                            className="size-14 shrink-0"
                        />
                    )}
                    <div className="flex min-w-0 flex-col gap-2">
                        <p className="m-0 text-base font-bold">
                            {t('points.offer', { balance: formatCount(balance), name: redeem.name })}
                        </p>
                        <button
                            type="button"
                            disabled={busy}
                            onClick={() => void doRedeem()}
                            data-testid="pj-cart-redeem"
                            className="inline-flex min-h-11 items-center self-start rounded-full bg-pj-pepperoncini px-5 text-[15px] font-bold text-pj-sauce disabled:opacity-60">
                            {t('points.redeem', { points: formatCount(redeem.points) })}
                        </button>
                    </div>
                </div>
            </div>
        );
    } else {
        body = (
            <div className="flex flex-col gap-1">
                <p className="m-0 text-base">{earnText}</p>
                {balance !== null && redeem && balance < redeem.points && (
                    <p className="m-0 text-sm text-pj-accent">
                        {t('points.missing', { points: formatCount(redeem.points - balance) })}
                    </p>
                )}
            </div>
        );
    }

    return (
        <section
            aria-label={t('points.label')}
            data-testid="pj-cart-points"
            className={cn('surface-sauce rounded-pj-section p-4', className)}>
            {body}
            {error && (
                <p role="alert" className="mt-2 mb-0 text-sm font-semibold">
                    {t('points.error')}
                </p>
            )}
        </section>
    );
}

export default PointsBlock;
