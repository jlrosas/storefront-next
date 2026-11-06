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
import { useBasket, useBasketSnapshot } from '@/providers/basket';
import { formatClp } from '@/extensions/pj-shared';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';

/**
 * «Ver pedido (N) $total» fija sobre la barra inferior (móvil). Aparece al agregar el primer
 * producto. Su bottom suma `--pj-menu-strip` (la franja del pedido en curso de SEG, MEN-04).
 */
export function CartBar(): ReactElement | null {
    const { t } = useTranslation('extPjMenu');
    const count = useBasketSnapshot()?.totalItemCount ?? 0;
    const basket = useBasket();
    if (count === 0) return null;
    const total = basket ? formatClp(basket.productTotal ?? basket.productSubTotal ?? 0) : '';
    return (
        <Link
            to={PJ_ROUTES.cart}
            data-testid="pj-menu-cart-bar"
            aria-label={t('cartBar.aria', { count, total })}
            className="fixed inset-x-3 bottom-[calc(var(--pj-bottom-nav-height)+env(safe-area-inset-bottom)+12px+var(--pj-menu-strip,0px))] z-30 flex h-13 items-center justify-between rounded-full bg-pj-green px-5 font-bold text-pj-surface no-underline shadow-pj-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-lime lg:hidden">
            <span>{t('cartBar.view', { count })}</span>
            <span>{total}</span>
        </Link>
    );
}
