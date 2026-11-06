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

/**
 * Aviso de Simple-Add: «<nombre> agregada · $total» con «Ver pedido», sin «Deshacer» ni puntos
 * (eso es de las pizzas, en PRO). El destino es un callback con `useNavigate`: el Toaster global
 * está fuera de `SiteProvider` y `Link` no funciona ahí.
 */
export function MenuAddedToast({ name, onView }: { name: string; onView: () => void }): ReactElement {
    const { t } = useTranslation('extPjMenu');
    return (
        <div
            role="status"
            data-testid="pj-menu-added-toast"
            className="flex w-full max-w-[420px] items-center gap-3 rounded-pj-card bg-pj-green-dark px-4 py-3 text-pj-surface shadow-pj-strip">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">{name}</p>
            <button
                type="button"
                onClick={onView}
                className="flex min-h-[44px] shrink-0 cursor-pointer items-center rounded-full bg-pj-lime px-4 text-sm font-bold text-pj-green-dark">
                {t('order.viewOrder')}
            </button>
        </div>
    );
}
