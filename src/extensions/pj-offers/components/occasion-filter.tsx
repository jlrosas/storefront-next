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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { OCCASION_FILTERS, type OccasionFilterId } from '../lib/offers';

export interface OccasionFilterProps {
    value: OccasionFilterId;
    onChange: (value: OccasionFilterId) => void;
    className?: string;
}

/**
 * Filtro «¿Para cuántos?» (criterio OFE-01.1): Todas, Para 1, Para 2, Para 4, Para 6+.
 * Es un `radiogroup`: flechas para moverse y áreas táctiles de 44 px.
 */
export function OccasionFilter({ value, onChange, className }: OccasionFilterProps): ReactElement {
    const { t } = useTranslation('extPjOffers');
    const ids = OCCASION_FILTERS.map((f) => f.id);

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
        const step =
            event.key === 'ArrowRight' || event.key === 'ArrowDown'
                ? 1
                : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
                  ? -1
                  : 0;
        if (step === 0) return;
        event.preventDefault();
        const next = ids[(index + step + ids.length) % ids.length];
        onChange(next);
        requestAnimationFrame(() =>
            (event.currentTarget.parentElement?.querySelector(`[data-filter="${next}"]`) as HTMLElement | null)?.focus()
        );
    };

    return (
        <div
            role="radiogroup"
            aria-label={t('page.filterAria')}
            className={cn('flex gap-2 overflow-x-auto pb-0.5 lg:flex-wrap lg:overflow-visible', className)}>
            {ids.map((id, index) => {
                const on = id === value;
                return (
                    <button
                        key={id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        tabIndex={on ? 0 : -1}
                        data-filter={id}
                        data-labeled=""
                        onClick={() => onChange(id)}
                        onKeyDown={(event) => onKeyDown(event, index)}
                        className={cn(
                            'min-h-[44px] shrink-0 rounded-full px-4 text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                            on ? 'bg-pj-green text-pj-surface' : 'bg-[#FBE9D7] text-[#7A3A12] hover:bg-[#F7DDC3]'
                        )}>
                        {t(`filters.${id}`)}
                    </button>
                );
            })}
        </div>
    );
}

export default OccasionFilter;
