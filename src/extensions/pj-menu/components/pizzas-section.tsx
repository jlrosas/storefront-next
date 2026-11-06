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
import { formatClp } from '@/extensions/pj-shared';
import { cn } from '@/lib/utils';
import {
    groupPriceRange,
    matchesFilter,
    PIZZA_FILTERS,
    PJ_SIZES,
    pizzaCount,
    type MenuData,
    type MenuProduct,
    type PizzaFilter,
    type PjSize,
} from '../lib/menu-model';
import { asTr, type Tr } from '../lib/i18n';
import { BuildCards } from './build-cards';
import { PizzaCard } from './pizza-card';

interface PizzasSectionProps {
    menu: MenuData;
    size: PjSize;
    filter: PizzaFilter;
    onSize: (size: PjSize) => void;
    onFilter: (filter: PizzaFilter) => void;
}

const GRID = 'grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] lg:gap-3.5';

/** Pizzas (MEN-01.3 a .6): selector de tamaño, filtros, tarjetas de construcción y grupos con su rango. */
export function PizzasSection({ menu, size, filter, onSize, onFilter }: PizzasSectionProps): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const tr = asTr(t);
    const total = pizzaCount(menu.groups);
    const all = menu.groups.flatMap((group) => group.products);
    const bySlug = (id: string): MenuProduct | undefined => all.find((product) => product.id === id);
    const [left, right] = [bySlug('pz-pollo-bbq') ?? all[0], bySlug('pz-super-pepperoni') ?? all[1]];
    const filtered = menu.groups
        .map((group) => ({ ...group, products: group.products.filter((product) => matchesFilter(product, filter)) }))
        .filter((group) => group.products.length > 0);
    const flat = filtered.flatMap((group) => group.products);
    let priority = 0;

    return (
        <section
            id="pizzas"
            aria-labelledby="menu-pizzas"
            tabIndex={-1}
            className="flex scroll-mt-(--pj-menu-offset) flex-col gap-3 lg:gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-5 lg:gap-y-3">
                <h2 id="menu-pizzas" className="text-3xl lg:text-[40px]">
                    {t('pizzas.title')}{' '}
                    <span className="text-lg text-pj-gray lg:text-[22px]">{t('pizzas.count', { count: total })}</span>
                </h2>
                <div
                    role="group"
                    aria-label={t('size.label')}
                    data-testid="pj-menu-size"
                    className="grid grid-cols-3 items-center rounded-[12px] bg-[#F3EBE0] p-1 lg:flex lg:gap-1">
                    <span aria-hidden="true" className="hidden px-2 text-[13px] text-pj-gray lg:inline">
                        {t('size.labelDesktop')}
                    </span>
                    {PJ_SIZES.map((candidate) => {
                        const on = candidate === size;
                        return (
                            <button
                                key={candidate}
                                type="button"
                                aria-pressed={on}
                                onClick={() => onSize(candidate)}
                                className={cn(
                                    'min-h-11 cursor-pointer rounded-[9px] px-3.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                                    on
                                        ? 'bg-pj-surface text-pj-green-dark shadow-[0_1px_3px_rgb(0_0_0/0.12)]'
                                        : 'text-pj-gray'
                                )}>
                                {tr(`size.${candidate}`)}
                            </button>
                        );
                    })}
                </div>
                <div
                    role="group"
                    aria-label={t('filter.label')}
                    data-testid="pj-menu-filters"
                    className="flex gap-1.5 overflow-x-auto lg:flex-wrap">
                    {PIZZA_FILTERS.map((candidate) => {
                        const on = candidate === filter;
                        return (
                            <button
                                key={candidate}
                                type="button"
                                aria-pressed={on}
                                onClick={() => onFilter(candidate)}
                                className={cn(
                                    'min-h-11 shrink-0 cursor-pointer rounded-full px-3.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                                    on ? 'bg-pj-green text-pj-surface' : 'bg-[#FBE9D7] text-[#7A3A12]'
                                )}>
                                {candidate === 'all' ? t('filter.all', { count: total }) : tr(`filter.${candidate}`)}
                            </button>
                        );
                    })}
                </div>
            </div>

            <BuildCards
                mitades={menu.mitades}
                arma={menu.arma}
                size={size}
                left={left}
                right={right}
                armaImage={bySlug('pz-vegetariana')}
            />

            {filter === 'all' ? (
                filtered.map((group) => {
                    const range = groupPriceRange(group.products, size);
                    return (
                        <div
                            key={group.id}
                            className="flex flex-col gap-2 lg:gap-3"
                            data-testid={`pj-menu-group-${group.id}`}>
                            <div className="mt-1 flex items-baseline justify-between gap-3 border-b-2 border-pj-sand pb-1 lg:justify-start lg:pb-1.5">
                                <h3 className="text-[19px] font-extrabold lg:text-[22px]">{tr(`group.${group.id}`)}</h3>
                                <span className="text-xs text-pj-gray lg:text-sm">
                                    {groupNote(group.id, range, size, tr)}
                                </span>
                            </div>
                            <div className={GRID}>
                                {group.products.map((product) => (
                                    <PizzaCard
                                        key={product.id}
                                        product={product}
                                        size={size}
                                        priority={priority++ < 2}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="flex flex-col gap-2 lg:gap-3" data-testid="pj-menu-filtered">
                    <div className="mt-1 flex items-baseline justify-between gap-3 border-b-2 border-pj-sand pb-1 lg:justify-start lg:pb-1.5">
                        <h3 className="text-[19px] font-extrabold lg:text-[22px]">{tr(`filter.${filter}`)}</h3>
                        <span className="text-xs text-pj-gray lg:text-sm">
                            {t('filter.count', { count: flat.length })}
                        </span>
                    </div>
                    {flat.length > 0 ? (
                        <div className={GRID}>
                            {flat.map((product) => (
                                <PizzaCard key={product.id} product={product} size={size} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-pj-gray">{t('filter.empty')}</p>
                    )}
                </div>
            )}
        </section>
    );
}

function groupNote(id: string, range: { min: number; max: number } | null, size: PjSize, t: Tr): string {
    if (id === 'pan-pizza') return t('group.panPizza');
    if (id === 'pizzas-croissant') return t('group.croissant');
    if (!range) return '';
    const sizeLabel = t(`size.${size}`);
    return range.min === range.max
        ? t('group.rangeOne', { size: sizeLabel, price: formatClp(range.min) })
        : t('group.rangeFrom', { size: sizeLabel, price: formatClp(range.min) });
}
