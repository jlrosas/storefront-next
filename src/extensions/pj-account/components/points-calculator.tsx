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
/** @sfdc-extension-file SFDC_EXT_PJ_ACCOUNT */
import { type ReactElement, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatClp, formatCount } from '@/extensions/pj-shared/lib/format';
import { pointsToClp } from '@/extensions/pj-shared/lib/points';
import { cn } from '@/lib/utils';
import {
    CALCULATOR_MAX,
    CALCULATOR_MIN,
    CALCULATOR_PRESETS,
    CALCULATOR_STEP,
    calculatorPoints,
    ordersToGoal,
} from '../lib/member';

export interface PointsCalculatorProps {
    /** Saldo del socio (0 sin sesión): «Con N pedidos así…» parte de lo que ya tiene. */
    balance: number;
    doublePoints: boolean;
    /** Puntos de la pizza canjeable (260). */
    goal: number;
    className?: string;
}

/**
 * Calculadora (CTA-02 criterio 2, R1.1 y R1.3): «Si pides $X te llevas N puntos», su valor en pesos y cuántos
 * pedidos así faltan para la Super Pepperoni mediana gratis. Montos sugeridos más un control deslizante.
 */
export function PointsCalculator({ balance, doublePoints, goal, className }: PointsCalculatorProps): ReactElement {
    const { t } = useTranslation('extPjAccount');
    const [amount, setAmount] = useState<number>(CALCULATOR_PRESETS[1]);
    const id = useId();
    const points = calculatorPoints(amount);
    const doubled = calculatorPoints(amount, true);
    const orders = ordersToGoal(amount, goal, balance, doublePoints);

    let goalText: string;
    if (orders === 0) goalText = t('points.calcGoalReady');
    else if (orders === null) goalText = t('points.calcGoalNone');
    else goalText = t('points.calcGoal', { count: orders });

    return (
        <section
            aria-labelledby={`${id}-title`}
            data-testid="pj-points-calculator"
            className={cn('rounded-pj-section bg-pj-surface p-5 shadow-pj-card lg:p-8', className)}>
            <h2 id={`${id}-title`} className="pj-h2 m-0 text-pj-heading">
                {t('points.calcTitle')}
            </h2>
            <fieldset className="m-0 mt-4 border-0 p-0">
                <legend className="pj-small mb-2 p-0 text-pj-gray-strong">{t('points.calcPresets')}</legend>
                <div className="grid grid-cols-3 gap-2">
                    {CALCULATOR_PRESETS.map((value) => {
                        const on = value === amount;
                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setAmount(value)}
                                className={cn(
                                    'min-h-12 rounded-pj-card border-2 px-2 text-base font-bold',
                                    on
                                        ? 'border-pj-basil bg-pj-lime-soft text-pj-basil'
                                        : 'border-pj-line bg-pj-surface text-pj-ink'
                                )}>
                                {formatClp(value)}
                            </button>
                        );
                    })}
                </div>
            </fieldset>
            <label htmlFor={`${id}-range`} className="pj-small mt-5 block text-pj-gray-strong">
                {t('points.calcLabel')}: <strong className="text-pj-ink">{formatClp(amount)}</strong>
            </label>
            <input
                id={`${id}-range`}
                type="range"
                min={CALCULATOR_MIN}
                max={CALCULATOR_MAX}
                step={CALCULATOR_STEP}
                value={amount}
                aria-valuetext={formatClp(amount)}
                onChange={(event) => setAmount(Number(event.target.value))}
                className="mt-2 h-11 w-full cursor-pointer accent-pj-basil"
            />
            <div className="surface-garlic mt-4 rounded-pj-card p-4" aria-live="polite" data-testid="pj-calc-result">
                <p className="m-0 text-base">{t('points.calcResult', { amount: formatClp(amount) })}</p>
                <p className="pj-h2 m-0 mt-1 text-pj-heading">{t('points.calcPoints', { count: points })}</p>
                <p className="m-0 mt-1 text-base font-bold">
                    {t('points.calcValue', { amount: formatClp(pointsToClp(points)) })}
                </p>
                {doublePoints && (
                    <p className="m-0 mt-1 text-base font-bold text-pj-accent">
                        {t('points.calcDouble', { points: formatCount(doubled) })}
                    </p>
                )}
                <p className="m-0 mt-3 text-base">{goalText}</p>
            </div>
        </section>
    );
}

export default PointsCalculator;
