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
import { useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { MenuProduct } from '../lib/menu-model';
import { asTr } from '../lib/i18n';
import { CompactCard } from './compact-card';

const COLLAPSED_MOBILE = 3;
const COLLAPSED_DESKTOP = 6;

/**
 * Acompañamientos, bebidas, postres y extras en tarjetas compactas (MEN-01.6). Muestra los primeros
 * y «Ver los N» despliega el resto en el mismo lugar.
 */
export function CompactSection({
    id,
    titleKey,
    products,
    moreKey = 'sections.viewMore',
}: {
    id: string;
    titleKey: string;
    products: MenuProduct[];
    moreKey?: string;
}): ReactElement | null {
    const { t } = useTranslation('extPjMenu');
    const tr = asTr(t);
    const [open, setOpen] = useState(false);
    if (products.length === 0) return null;
    const expandable = products.length > COLLAPSED_MOBILE;
    return (
        <section
            id={id}
            aria-labelledby={`menu-${id}`}
            tabIndex={-1}
            className="flex scroll-mt-(--pj-menu-offset) flex-col gap-2 lg:gap-3">
            <div className="flex items-baseline justify-between">
                <h2 id={`menu-${id}`} className="text-2xl lg:text-[32px]">
                    {tr(titleKey)} <span className="text-base text-pj-gray lg:text-xl">{products.length}</span>
                </h2>
                {expandable && (
                    <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpen((value) => !value)}
                        className="min-h-11 cursor-pointer px-1 text-sm font-bold text-pj-green lg:text-base">
                        {open ? t('sections.viewLess') : tr(moreKey, { count: products.length })}
                    </button>
                )}
            </div>
            <div className="grid gap-2 lg:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] lg:gap-2.5">
                {products.map((product, index) => (
                    <CompactCard
                        key={product.id}
                        product={product}
                        className={cn(
                            !open &&
                                index >= COLLAPSED_MOBILE &&
                                (index < COLLAPSED_DESKTOP ? 'hidden lg:flex' : 'hidden')
                        )}
                    />
                ))}
            </div>
        </section>
    );
}
