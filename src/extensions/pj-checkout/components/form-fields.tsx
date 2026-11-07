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
/** @sfdc-extension-file SFDC_EXT_PJ_CHECKOUT */
import { type InputHTMLAttributes, type ReactElement, type ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';

/** Paso numerado del checkout (07 v2): «1 Tus datos», «2 ¿Cómo pagas?», «3 Comprobante». */
export function StepCard({
    step,
    title,
    action,
    children,
    className,
}: {
    step: number;
    title: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}): ReactElement {
    const id = useId();
    return (
        <section
            aria-labelledby={id}
            className={cn('flex flex-col gap-3 rounded-pj-card bg-pj-surface p-4 shadow-pj-card lg:p-5', className)}>
            <div className="flex items-center gap-3">
                <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pj-green text-sm font-bold text-pj-surface">
                    {step}
                </span>
                <h2 id={id} className="pj-card-title m-0 flex-1 text-xl text-pj-heading">
                    {title}
                </h2>
                {action}
            </div>
            {children}
        </section>
    );
}

export interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    label: string;
    value: string;
    onValue: (value: string) => void;
    /** Mensaje si el campo es inválido; solo se muestra después de salir del campo (07 regla 2). */
    error?: string | null;
    hint?: string;
    ok?: string | null;
    prefix?: string;
}

/** Campo con etiqueta arriba, 48 px de alto y el error debajo, unido con `aria-describedby`. */
export function Field({
    label,
    value,
    onValue,
    error,
    hint,
    ok,
    prefix,
    className,
    ...input
}: FieldProps): ReactElement {
    const id = useId();
    const messageId = `${id}-msg`;
    const message = error ?? ok ?? hint;
    return (
        <div className={cn('flex flex-col gap-1', className)}>
            <label htmlFor={id} className="text-sm font-semibold text-pj-gray-strong">
                {label}
            </label>
            <div
                className={cn(
                    'flex h-12 items-center overflow-hidden rounded-pj-control border-[1.5px] bg-pj-surface focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-pj-green',
                    error ? 'border-pj-price' : 'border-pj-input-line'
                )}>
                {prefix && (
                    <span className="flex h-full items-center bg-pj-dough px-3 text-base text-pj-ink">{prefix}</span>
                )}
                <input
                    id={id}
                    value={value}
                    onChange={(event) => onValue(event.target.value)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={message ? messageId : undefined}
                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-3.5 text-base text-pj-ink outline-none placeholder:text-pj-gray"
                    {...input}
                />
            </div>
            {message && (
                <p
                    id={messageId}
                    className={cn(
                        'm-0 text-sm',
                        error
                            ? 'font-semibold text-pj-price'
                            : ok
                              ? 'font-semibold text-pj-basil'
                              : 'text-pj-gray-strong'
                    )}>
                    {message}
                </p>
            )}
        </div>
    );
}

/** Dos o más opciones como tarjetas grandes lado a lado (`role="radio"`). */
export function ChoiceCard({
    checked,
    onSelect,
    title,
    hint,
    icon,
    testId,
    disabled = false,
}: {
    disabled?: boolean;
    checked: boolean;
    onSelect: () => void;
    title: string;
    hint?: string;
    icon?: ReactNode;
    testId?: string;
}): ReactElement {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={checked}
            aria-disabled={disabled || undefined}
            onClick={disabled ? undefined : onSelect}
            data-testid={testId}
            className={cn(
                'relative flex min-h-[96px] flex-col items-start gap-1 rounded-pj-card border-2 p-3 text-left',
                checked ? 'border-pj-basil bg-pj-surface shadow-pj-card' : 'border-pj-line bg-pj-surface',
                disabled && 'cursor-not-allowed border-dashed bg-pj-dough'
            )}>
            <span
                aria-hidden="true"
                className={cn(
                    'absolute top-2 right-2 flex size-[22px] items-center justify-center rounded-full',
                    checked ? 'bg-pj-green text-pj-surface' : 'border-2 border-pj-input-line'
                )}>
                {checked && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </span>
            {icon && <span className="text-pj-basil">{icon}</span>}
            <span className="text-base font-bold text-pj-heading">{title}</span>
            {hint && <span className="text-sm text-pj-gray-strong">{hint}</span>}
        </button>
    );
}
