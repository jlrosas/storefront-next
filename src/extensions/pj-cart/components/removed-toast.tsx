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

export interface RemovedToastProps {
    /** «Quitaste Pollo BBQ» */
    message: string;
    undoLabel: string;
    undoAria: string;
    onUndo: () => void;
    onDismiss?: () => void;
}

/** «Quitaste Pollo BBQ · Deshacer» (UX-3 §3.10), con el mismo marco que el aviso de agregado. */
export function RemovedToast({ message, undoLabel, undoAria, onUndo, onDismiss }: RemovedToastProps): ReactElement {
    return (
        <div
            role="status"
            data-testid="pj-removed-toast"
            className="flex w-full max-w-[420px] items-center gap-2 rounded-pj-card bg-pj-basil px-4 py-2 text-pj-dough shadow-pj-strip">
            <p className="m-0 min-w-0 flex-1 truncate text-[15px] font-bold">{message}</p>
            <button
                type="button"
                aria-label={undoAria}
                onClick={() => {
                    onUndo();
                    onDismiss?.();
                }}
                className="flex min-h-11 shrink-0 items-center rounded-full bg-pj-pepperoncini px-4 text-sm font-bold text-pj-basil">
                {undoLabel}
            </button>
        </div>
    );
}
