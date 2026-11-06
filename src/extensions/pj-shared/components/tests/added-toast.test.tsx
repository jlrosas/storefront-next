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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { getTranslation } from '@salesforce/storefront-next-runtime/i18n';
import { AddedToast } from '../added-toast';

const { t } = getTranslation();

describe('AddedToast', () => {
    it('se pinta sin router ni SiteProvider (el Toaster global está fuera de ellos)', () => {
        const onViewOrder = vi.fn();
        const onUndo = vi.fn();
        const onDismiss = vi.fn();
        render(
            <AddedToast
                productName="Pollo BBQ Familiar"
                points={16}
                onUndo={onUndo}
                onViewOrder={onViewOrder}
                onDismiss={onDismiss}
            />
        );
        expect(screen.getByRole('status')).toHaveTextContent('Pollo BBQ Familiar');
        fireEvent.click(screen.getByRole('button', { name: t('extPjShared:toast.viewOrder') }));
        expect(onViewOrder).toHaveBeenCalledOnce();
        fireEvent.click(screen.getByRole('button', { name: t('extPjShared:toast.undo') }));
        expect(onUndo).toHaveBeenCalledOnce();
        expect(onDismiss).toHaveBeenCalledTimes(2);
    });
});
