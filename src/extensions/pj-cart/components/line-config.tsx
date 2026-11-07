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
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { cn } from '@/lib/utils';
import type { LineSummary } from '../lib/line-summary';

export interface LineConfigProps {
    summary: LineSummary;
    /** Muestra el precio de cada extra («+ Pepperoni $1.940»). En el panel compacto va sin precio. */
    showExtraPrices?: boolean;
    className?: string;
}

/**
 * La configuración de una línea, igual en `/cart` y en «Tu pedido»: «Familiar · Tradicional · sin cebolla»
 * (o «½ Pollo BBQ · ½ Pepperoni», o las pizzas del combo) y debajo los extras agregados.
 */
export function LineConfig({ summary, showExtraPrices = true, className }: LineConfigProps): ReactElement | null {
    const { t } = useTranslation('extPjCart');
    if (!summary.detail && summary.extras.length === 0) return null;
    return (
        <div className={cn('flex flex-col gap-0.5 text-sm leading-snug', className)} data-testid="pj-line-config">
            {summary.detail && <p className="m-0 text-pj-gray-strong">{summary.detail}</p>}
            {summary.extras.length > 0 && (
                <ul
                    className="m-0 flex list-none flex-wrap gap-x-3 gap-y-0.5 p-0 font-semibold text-pj-basil"
                    aria-label={t('line.extrasAria', {
                        list: summary.extras.map((extra) => extra.name).join(', '),
                    })}
                    data-testid="pj-line-extras">
                    {summary.extras.map((extra) => (
                        <li key={extra.id}>
                            {t('line.plus', { name: extra.name })}
                            {showExtraPrices && extra.price > 0 && (
                                <span className="font-normal text-pj-gray-strong"> {formatClp(extra.price)}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default LineConfig;
