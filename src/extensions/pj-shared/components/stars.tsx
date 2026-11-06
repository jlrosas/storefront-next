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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { formatCount, formatRating } from '../lib/format';

export interface StarsProps {
    /** Calificación de 0 a 5 (`c_pjRating`). */
    rating: number;
    /** Cantidad de opiniones (`c_pjReviewCount`). Sin valor, solo la nota. */
    count?: number | null;
    className?: string;
}

/** «★ 4,7 · 1.240 opiniones» con la estrella en el color del token (#8F5400, 5,9:1). */
export function Stars({ rating, count, className }: StarsProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    const value = formatRating(Math.min(5, Math.max(0, rating)));
    const hasCount = typeof count === 'number' && count > 0;
    const label = hasCount
        ? t('stars.labelWithCount', { rating: value, reviews: formatCount(count) })
        : t('stars.label', { rating: value });
    return (
        <span
            role="img"
            aria-label={label}
            className={cn('inline-flex items-center gap-1 text-sm text-pj-gray', className)}
            data-testid="pj-stars">
            <span aria-hidden="true" className="text-pj-star">
                ★
            </span>
            <span aria-hidden="true" className="font-bold text-pj-ink">
                {value}
            </span>
            {hasCount && <span aria-hidden="true">· {t('stars.reviews', { reviews: formatCount(count) })}</span>}
        </span>
    );
}

export default Stars;
