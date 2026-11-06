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
import { Link } from '@/components/link';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import type { MenuProduct, PjSize } from '../lib/menu-model';
import { CompactCard } from './compact-card';
import { OfferCard } from './offers-section';
import { PizzaCard } from './pizza-card';

/**
 * Resultados de la búsqueda (MEN-01.9): las mismas tarjetas del menú. Pizzas y constructores en
 * tarjeta grande, combos como oferta y el resto en tarjeta compacta.
 */
export function ResultsSection({
    query,
    results,
    size,
}: {
    query: string;
    results: MenuProduct[];
    size: PjSize;
}): ReactElement {
    const { t } = useTranslation('extPjMenu');
    return (
        <section
            aria-labelledby="menu-resultados"
            className="flex flex-col gap-3 lg:gap-4"
            data-testid="pj-menu-results">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id="menu-resultados" className="text-2xl lg:text-[32px]">
                    {t('search.resultsFor', { query })}{' '}
                    <span className="text-base text-pj-gray lg:text-xl">
                        {t('search.resultsCount', { count: results.length })}
                    </span>
                </h2>
                <Link to={PJ_ROUTES.menu} className="text-sm font-bold text-pj-green lg:text-base">
                    {t('search.viewAll')}
                </Link>
            </div>
            {results.length === 0 ? (
                <p className="text-pj-gray">{t('search.empty', { query })}</p>
            ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] lg:gap-3.5">
                    {results.map((product) =>
                        product.kind === 'pizza' || product.kind === 'builder' ? (
                            <PizzaCard key={product.id} product={product} size={size} />
                        ) : product.kind === 'combo' ? (
                            <OfferCard key={product.id} offer={product} />
                        ) : (
                            <CompactCard
                                key={product.id}
                                product={product}
                                className="col-span-2 sm:col-span-3 lg:col-span-full"
                            />
                        )
                    )}
                </div>
            )}
        </section>
    );
}
