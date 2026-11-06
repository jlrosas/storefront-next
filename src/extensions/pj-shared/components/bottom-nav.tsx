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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */
import type { ComponentType, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { PJ_ROUTES } from '../lib/routes';
import { matchesPath } from '../hooks/use-pj-path';
import { BagIcon, HomeIcon, PizzaIcon, TagIcon, UserIcon } from './icons';

export type BottomNavItemId = 'home' | 'menu' | 'promos' | 'order' | 'account';

interface BottomNavItem {
    id: BottomNavItemId;
    to: string;
    /** Rutas que dejan activo el destino. */
    matches: readonly string[];
    Icon: ComponentType<{ size?: number; strong?: boolean }>;
}

const BOTTOM_NAV_ITEMS: readonly BottomNavItem[] = [
    { id: 'home', to: PJ_ROUTES.home, matches: [PJ_ROUTES.home], Icon: HomeIcon },
    { id: 'menu', to: PJ_ROUTES.menu, matches: [PJ_ROUTES.menu, '/c', '/p', '/search'], Icon: PizzaIcon },
    { id: 'promos', to: PJ_ROUTES.promos, matches: [PJ_ROUTES.promos], Icon: TagIcon },
    { id: 'order', to: PJ_ROUTES.cart, matches: [PJ_ROUTES.cart], Icon: BagIcon },
    {
        id: 'account',
        to: PJ_ROUTES.account,
        matches: [PJ_ROUTES.account, PJ_ROUTES.points, PJ_ROUTES.login],
        Icon: UserIcon,
    },
];

const LABEL_KEYS: Record<BottomNavItemId, 'nav.home' | 'nav.menu' | 'nav.promos' | 'nav.order' | 'nav.account'> = {
    home: 'nav.home',
    menu: 'nav.menu',
    promos: 'nav.promos',
    order: 'nav.order',
    account: 'nav.account',
};

export interface BottomNavProps {
    /** Ruta actual sin prefijo de sitio (ver `usePjPath`). Decide el destino activo. */
    currentPath: string;
    /** Productos en el pedido; con más de 0 se muestra el contador sobre «Pedido». */
    cartCount?: number;
    className?: string;
}

/**
 * Barra inferior móvil del lienzo (Home.dc.html, Menu.dc.html): cinco destinos con ícono y
 * texto, el activo en verde con una barra arriba y el contador del pedido. Fija abajo y solo
 * bajo `lg`; deja su propio espacio en el flujo para no tapar el footer.
 */
export function BottomNav({ currentPath, cartCount = 0, className }: BottomNavProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    return (
        <>
            <div
                aria-hidden="true"
                className="h-[calc(var(--pj-bottom-nav-height)+env(safe-area-inset-bottom))] lg:hidden"
            />
            <nav
                aria-label={t('nav.label')}
                data-testid="pj-bottom-nav"
                className={cn(
                    'fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-pj-line bg-pj-surface pb-[env(safe-area-inset-bottom)] lg:hidden',
                    className
                )}>
                {BOTTOM_NAV_ITEMS.map(({ id, to, matches, Icon }) => {
                    const active = matchesPath(currentPath, matches);
                    const showCount = id === 'order' && cartCount > 0;
                    const label = t(LABEL_KEYS[id]);
                    return (
                        <Link
                            key={id}
                            to={to}
                            aria-current={active ? 'page' : undefined}
                            aria-label={showCount ? t('nav.orderWithCount', { count: cartCount }) : undefined}
                            data-testid={`pj-bottom-nav-${id}`}
                            className={cn(
                                'relative flex h-[var(--pj-bottom-nav-height)] flex-col items-center justify-center gap-[3px] text-xs no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pj-basil',
                                active ? 'font-bold text-pj-basil' : 'font-semibold text-pj-gray'
                            )}>
                            {active && (
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-x-1/4 top-0 h-[3px] rounded-b-[3px] bg-pj-basil"
                                />
                            )}
                            <span className="relative">
                                <Icon size={24} strong={active} />
                                {showCount && (
                                    <span
                                        aria-hidden="true"
                                        data-testid="pj-bottom-nav-count"
                                        className="absolute -top-1.5 -right-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pj-pepperoncini px-1 text-xs font-bold leading-none text-pj-basil">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </span>
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}

export default BottomNav;
