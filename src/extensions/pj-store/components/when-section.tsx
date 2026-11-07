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
/** @sfdc-extension-file SFDC_EXT_PJ_STORE */
import { useEffect, useMemo, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { buildSlots, type ScheduleDay } from '../lib/schedule';
import type { PjStore } from '../lib/store-info';

export interface WhenValue {
    mode: 'asap' | 'later';
    day: ScheduleDay;
    /** ISO de la hora elegida (solo con `later`). */
    slot: string | null;
}

interface WhenSectionProps {
    /** Tienda cuyo horario define las horas disponibles. */
    store: PjStore | null;
    value: WhenValue;
    onChange: (value: WhenValue) => void;
    className?: string;
}

const chipClass = (on: boolean) =>
    cn(
        'min-h-11 cursor-pointer rounded-pj-control px-3 text-[15px] font-bold transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil',
        on ? 'bg-pj-basil text-pj-dough' : 'bg-pj-dough-deep text-pj-basil'
    );

const selectClass =
    'h-[46px] w-full rounded-xl border-[1.5px] border-pj-input-line bg-pj-surface px-2.5 text-base text-pj-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green';

/** «¿Cuándo?»: «Lo antes posible» por defecto; «Programar» abre día y hora. */
export function WhenSection({ store, value, onChange, className }: WhenSectionProps): ReactElement {
    const { t } = useTranslation('extPjStore');
    const now = useMemo(() => new Date(), []);
    const slots = useMemo(() => (store ? buildSlots(store, value.day, now) : []), [store, value.day, now]);
    const todayHasSlots = useMemo(() => (store ? buildSlots(store, 'today', now).length > 0 : true), [store, now]);

    // Mantiene la hora elegida dentro de las disponibles de ese día/tienda.
    useEffect(() => {
        if (value.mode !== 'later') return;
        if (value.day === 'today' && !todayHasSlots) {
            onChange({ ...value, day: 'tomorrow', slot: null });
            return;
        }
        if (slots.length > 0 && !slots.some((s) => s.value === value.slot)) {
            onChange({ ...value, slot: slots[0].value });
        }
    }, [value, slots, todayHasSlots, onChange]);

    return (
        <div className={cn('flex flex-col gap-2 border-t border-pj-line pt-3.5', className)}>
            <h3 className="text-base font-bold">{t('when.title')}</h3>
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    aria-pressed={value.mode === 'asap'}
                    onClick={() => onChange({ ...value, mode: 'asap' })}
                    className={chipClass(value.mode === 'asap')}>
                    {t('when.asap')}
                </button>
                <button
                    type="button"
                    aria-pressed={value.mode === 'later'}
                    onClick={() => onChange({ ...value, mode: 'later' })}
                    className={chipClass(value.mode === 'later')}>
                    {t('when.later')}
                </button>
            </div>
            {value.mode === 'later' && (
                <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col gap-1 text-[13px] font-semibold text-pj-gray">
                        {t('when.day')}
                        <select
                            className={selectClass}
                            value={value.day}
                            onChange={(e) => onChange({ ...value, day: e.target.value as ScheduleDay, slot: null })}>
                            {todayHasSlots && <option value="today">{t('when.today')}</option>}
                            <option value="tomorrow">{t('when.tomorrow')}</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-1 text-[13px] font-semibold text-pj-gray">
                        {t('when.hour')}
                        <select
                            className={selectClass}
                            value={value.slot ?? ''}
                            disabled={slots.length === 0}
                            onChange={(e) => onChange({ ...value, slot: e.target.value })}>
                            {slots.map((slot) => (
                                <option key={slot.value} value={slot.value}>
                                    {slot.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    {store && slots.length === 0 && (
                        <p className="col-span-2 text-sm text-pj-gray" role="status">
                            {t('when.noSlots')}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
