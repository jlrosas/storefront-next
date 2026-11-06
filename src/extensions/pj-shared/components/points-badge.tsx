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
import { formatCount } from '../lib/format';

export interface PointsBadgeProps {
    /** Papa Puntos (usa `pointsFor` de lib/points). */
    points: number;
    /** `earn` «Ganas N Papa Puntos» · `pending` «+N por acreditar». */
    variant?: 'earn' | 'pending';
    className?: string;
}

/** Píldora lima suave de Papa Puntos (principio 5: puntos en cada paso). */
export function PointsBadge({ points, variant = 'earn', className }: PointsBadgeProps): ReactElement | null {
    const { t } = useTranslation('extPjShared');
    if (!Number.isFinite(points) || points <= 0) return null;
    const count = Math.floor(points);
    const text =
        variant === 'pending'
            ? t('points.pending', { points: formatCount(count) })
            : t(count === 1 ? 'points.earnOne' : 'points.earn', { points: formatCount(count) });
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center rounded-full bg-pj-lime-soft px-3 py-1 text-[13px] font-bold text-pj-green-dark',
                className
            )}
            data-testid="pj-points-badge">
            {text}
        </span>
    );
}

export default PointsBadge;
