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
import { useFetchers } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { routes } from '@/route-paths';
import { getOrCreateCheckoutCorrelationId } from '@/lib/checkout/correlation';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { cn } from '@/lib/utils';
import type { CheckoutBlock } from '../lib/cart-model';
import { useCountUp } from '../hooks/use-count-up';

export interface CheckoutCtaProps {
    total: number;
    block: CheckoutBlock;
    /** Lo que falta para delivery («Agrega $3.010 para delivery»). */
    missing: number;
    registered: boolean;
    className?: string;
}

const BASE =
    'flex h-14 w-full items-center justify-between rounded-full px-6 text-[17px] font-bold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green';

/** ¿Hay un cambio del carrito en curso? (cantidad, quitar, editar, oferta o canje). */
function useCartBusy(): boolean {
    return useFetchers().some(
        (fetcher) => fetcher.state !== 'idle' && /\/(action|resource)\/(pj-cart|cart-)/.test(fetcher.formAction ?? '')
    );
}

/**
 * «Ir a pagar · $total» (UX-3 §3.8): Basil con el monto. Mientras se actualiza dice «Actualizando…»; si no se
 * puede pagar, va en contorno con la razón en el propio botón. Sin sesión lleva al ingreso de ING.
 */
export function CheckoutCta({ total, block, missing, registered, className }: CheckoutCtaProps): ReactElement {
    const { t } = useTranslation('extPjCart');
    const busy = useCartBusy();
    const [opening, setOpening] = useState(false);
    const shown = useCountUp(total);
    const amount = formatClp(shown);

    if (block) {
        const reason =
            block === 'no-fulfillment'
                ? t('summary.blockNoFulfillment')
                : block === 'store-closed'
                  ? t('summary.blockClosed')
                  : block === 'pickup-only'
                    ? t('summary.blockPickupOnly')
                    : t('summary.blockMinimum', { amount: formatClp(missing) });
        return (
            <button
                type="button"
                disabled
                aria-disabled="true"
                data-testid="pj-cart-checkout"
                data-block={block}
                className={cn(BASE, 'justify-center border-2 border-pj-basil bg-transparent text-pj-basil', className)}>
                {reason}
            </button>
        );
    }
    if (busy || opening) {
        return (
            <button
                type="button"
                disabled
                aria-busy="true"
                data-testid="pj-cart-checkout"
                className={cn(BASE, 'bg-pj-green text-pj-surface opacity-90', className)}>
                <span>{opening ? t('summary.opening') : t('summary.updating')}</span>
                <span>{amount}</span>
            </button>
        );
    }
    const to = registered ? routes.checkout : `${routes.login}?returnUrl=${encodeURIComponent(routes.checkout)}`;
    return (
        <Link
            to={to}
            onClick={() => {
                getOrCreateCheckoutCorrelationId();
                setOpening(true);
            }}
            aria-label={t('summary.checkoutAria', { total: formatClp(total) })}
            data-testid="pj-cart-checkout"
            className={cn(BASE, 'bg-pj-green text-pj-surface hover:bg-pj-green-dark', className)}>
            <span>{t('summary.checkout')}</span>
            <span className="tabular-nums">{amount}</span>
        </Link>
    );
}

export default CheckoutCta;
