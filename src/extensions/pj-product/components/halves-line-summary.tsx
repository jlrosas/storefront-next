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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { halvesHref, halvesLabel } from '../lib/halves';
import { SplitPizzaImage } from './split-pizza-image';
import { useImageUrl } from '../hooks/use-image-url';

export interface HalvesLineSummaryProps {
    itemId: string;
    /** Mitades de la línea en orden (de `loadHalvesLines` en el loader del carrito). */
    halves: Array<{ id: string; name: string; image: string | null }>;
    /** «Familiar · Tradicional» */
    detail?: string;
    className?: string;
}

/**
 * Para CAR (Pedido-Mitades.dc.html): foto dividida, «½ Pollo BBQ · ½ Todas las Carnes» y «Editar mitades»,
 * que vuelve al armador con las mitades marcadas (`/mitades?item=<itemId>`).
 */
export function HalvesLineSummary({ itemId, halves, detail, className }: HalvesLineSummaryProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    const names = halves.map((h) => h.name);
    return (
        <div className={className} data-testid="pj-halves-line">
            <div className="flex items-center gap-3">
                <SplitPizzaImage
                    images={halves.map((h) => url(h.image, 160) ?? null)}
                    label={t('halves.lineAria', { parts: names.join(', ') })}
                    size={64}
                />
                <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold">{t('halves.lineName')}</p>
                    <p className="text-[13px] text-pj-gray-strong">
                        {[detail, halvesLabel(names)].filter(Boolean).join(' · ')}
                    </p>
                    <Link
                        to={halvesHref({ item: itemId })}
                        className="inline-flex min-h-[44px] items-center text-sm font-bold text-pj-green">
                        {t('halves.editLine')}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default HalvesLineSummary;
