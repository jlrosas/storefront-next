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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { MinusIcon, PlusIcon } from './menu-icons';
import type { CartLine } from '../hooks/use-cart-line';

/**
 * «+» que se vuelve contador (− N +) al agregar (MEN-02, Simple-Add). Áreas táctiles de 44 px.
 */
export function AddControl({
    line,
    name,
    optionLabel,
}: {
    line: CartLine;
    name: string;
    optionLabel?: string;
}): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const addLabel = optionLabel ? t('compact.addOption', { name, option: optionLabel }) : t('compact.add', { name });
    if (line.quantity === 0) {
        return (
            <button
                type="button"
                aria-label={addLabel}
                aria-busy={line.resolving}
                disabled={line.resolving}
                onClick={line.increment}
                data-testid="pj-menu-add"
                className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-pj-green text-pj-surface hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green disabled:opacity-60">
                <PlusIcon />
            </button>
        );
    }
    return (
        <div
            role="group"
            aria-label={t('compact.quantity', { name, count: line.quantity })}
            data-testid="pj-menu-stepper"
            className="flex h-11 shrink-0 items-center rounded-full bg-pj-green text-pj-surface">
            <button
                type="button"
                aria-label={t('compact.remove', { name })}
                onClick={line.decrement}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-lime">
                <MinusIcon />
            </button>
            <span aria-live="polite" className="min-w-4 text-center font-bold">
                {line.quantity}
            </span>
            <button
                type="button"
                aria-label={addLabel}
                onClick={line.increment}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-lime">
                <PlusIcon />
            </button>
        </div>
    );
}
