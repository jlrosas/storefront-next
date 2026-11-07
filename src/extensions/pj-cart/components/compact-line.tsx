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
import { formatClp } from '@/extensions/pj-shared/lib/format';
import type { LineSummary } from '../lib/line-summary';
import { LineConfig } from './line-config';

export interface CompactLineProps {
    summary: LineSummary;
}

/**
 * Línea del panel «Tu pedido» del menú (MEN-03): «1× Pollo BBQ», el total con extras y la misma
 * configuración que `/cart` (`LineConfig`).
 */
export function CompactLine({ summary }: CompactLineProps): ReactElement {
    return (
        <div className="flex flex-col gap-0.5" data-testid="pj-compact-line" data-kind={summary.kind}>
            <span className="flex justify-between gap-2">
                <span className="min-w-0">
                    <strong>{summary.quantity}×</strong> {summary.name}
                </span>
                <span className="shrink-0 font-bold">{formatClp(summary.total)}</span>
            </span>
            <LineConfig summary={summary} showExtraPrices={false} className="text-[13px]" />
        </div>
    );
}

export default CompactLine;
