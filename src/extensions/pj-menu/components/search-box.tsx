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
import { useEffect, useId, useRef, type FormEvent, type ReactElement } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@/hooks/use-navigate';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { SearchIcon } from '@/extensions/pj-shared/components/icons';
import { cn } from '@/lib/utils';

/**
 * Buscador del menú (MEN-01.9). Usa la búsqueda del template (SCAPI `productSearch`): al enviar,
 * recarga `/menu?q=` y los resultados salen con las mismas tarjetas.
 */
export function SearchBox({
    total,
    defaultValue,
    variant,
    className,
}: {
    total: number;
    defaultValue: string;
    variant: 'mobile' | 'desktop';
    className?: string;
}): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const generatedId = useId();
    // La lupa del encabezado móvil lleva a /menu#buscar (PJ_ROUTES.menuSearch).
    const id = variant === 'mobile' ? 'buscar' : generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const { hash } = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (variant === 'mobile' && hash === '#buscar' && inputRef.current?.offsetParent) {
            inputRef.current.focus();
        }
    }, [hash, variant]);
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const q = String(new FormData(event.currentTarget).get('q') ?? '').trim();
        void navigate(q ? `${PJ_ROUTES.menu}?q=${encodeURIComponent(q)}` : PJ_ROUTES.menu);
    };
    return (
        <form role="search" onSubmit={onSubmit} className={className} data-testid={`pj-menu-search-${variant}`}>
            <label htmlFor={id} className="sr-only">
                {t('search.label')}
            </label>
            <div
                className={cn(
                    'flex h-11 items-center gap-2 rounded-[12px] border-[1.5px] border-pj-input-line bg-pj-cream px-3',
                    variant === 'desktop' && 'w-70'
                )}>
                <SearchIcon size={20} className="shrink-0 text-pj-gray" />
                <input
                    ref={inputRef}
                    id={id}
                    name="q"
                    type="search"
                    enterKeyHint="search"
                    defaultValue={defaultValue}
                    placeholder={
                        variant === 'mobile'
                            ? t('search.placeholder', { count: total })
                            : t('search.placeholderDesktop')
                    }
                    className="min-w-0 flex-1 border-0 bg-transparent text-base text-pj-ink outline-none placeholder:text-pj-gray"
                />
            </div>
        </form>
    );
}
