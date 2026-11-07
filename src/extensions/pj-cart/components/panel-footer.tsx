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
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { routes } from '@/route-paths';
import { formatClp, formatCount } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';

/**
 * Pie del panel «Tu pedido» del menú (UX-3 §3.12): los puntos en una línea `surface-sauce` antes del CTA,
 * «Ir a pagar · $X» y «Ver mi pedido» hacia `/cart`.
 */
export function PanelFooter({ total }: { total: number }): ReactElement {
    const { t } = useTranslation('extPjCart');
    const me = usePjMe();
    const registered = Boolean(me?.registered);
    const points = pointsFor(total, 0, me?.doublePoints ?? false);
    const to = registered ? routes.checkout : `${routes.login}?returnUrl=${encodeURIComponent(routes.checkout)}`;
    return (
        <div className="flex flex-col gap-2.5" data-testid="pj-panel-footer">
            <p className="surface-sauce m-0 rounded-pj-card px-3 py-2 text-sm">
                {t('points.earnPrefix')} <strong>{t('points.earnPoints', { points: formatCount(points) })}</strong>
            </p>
            <Link
                to={to}
                aria-label={t('summary.checkoutAria', { total: formatClp(total) })}
                className="flex min-h-[52px] items-center justify-between rounded-full bg-pj-green px-5 text-base font-bold text-pj-surface no-underline hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green">
                <span>{t('summary.checkout')}</span>
                <span className="tabular-nums" data-testid="pj-menu-order-total">
                    {formatClp(total)}
                </span>
            </Link>
            <Link
                to={PJ_ROUTES.cart}
                className="inline-flex min-h-11 items-center justify-center text-[15px] font-bold text-pj-basil underline underline-offset-4">
                {t('panel.viewOrder')}
            </Link>
        </div>
    );
}

export default PanelFooter;
