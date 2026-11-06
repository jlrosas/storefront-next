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
import { type ReactElement, type ReactNode, type PropsWithChildren, useRef, useEffect, useCallback } from 'react';
import { Link } from '@/components/link';
import CartBadge from './cart-badge';
import { useTranslation } from 'react-i18next';
import logo from '/images/logo.svg';
import { UITarget } from '@/targets/ui-target';
import { Component } from '@/lib/decorators/component';
import { RegionDefinition } from '@/lib/decorators';
// @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
import { cn } from '@/lib/utils';
import { useBasketSnapshot } from '@/providers/basket';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { matchesPath, usePjPath } from '@/extensions/pj-shared/hooks/use-pj-path';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { CartIcon, SearchIcon } from '@/extensions/pj-shared/components/icons';
import { formatCount } from '@/extensions/pj-shared/lib/format';
// @sfdc-extension-block-end SFDC_EXT_PJ_SHARED

@Component('header', {
    name: 'Header',
    group: 'Layout',
    description: 'Global site header with navigation, search, and cart',
    embedded: true,
    component_id: 'header',
})
@RegionDefinition([{ id: 'announcement', name: 'Announcement', description: 'Displayed above the header' }])
// oxlint-disable-next-line react/only-export-components -- oxlint flags the co-exported Page Designer metadata class; eslint-plugin-react-refresh does not
export class HeaderMetadata {}

interface HeaderProps extends PropsWithChildren {
    beforeHeader?: ReactNode;
    /**
     * Slot rendered above the header's main row. Used for announcement banners
     * or other above-the-fold content that should sit at the top of the page.
     */
    announcementSlot?: ReactNode;
    variant?: 'full' | 'checkout';
}

export default function Header({
    children,
    beforeHeader,
    announcementSlot,
    variant = 'full',
}: HeaderProps): ReactElement {
    const { t } = useTranslation('header');
    const headerRef = useRef<HTMLElement>(null);
    const updateHeaderHeight = useCallback(() => {
        if (headerRef.current) {
            const height = `${headerRef.current.offsetHeight}px`;
            headerRef.current.style.setProperty('--header-height', height);
            document.documentElement.style.setProperty('--header-height', height);
        }
    }, []);

    useEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        updateHeaderHeight();
        const observer = new ResizeObserver(updateHeaderHeight);
        observer.observe(el);
        return () => observer.disconnect();
    }, [updateHeaderHeight]);

    if (variant === 'checkout') {
        return (
            <header
                ref={headerRef}
                className="bg-header-background text-header-foreground sticky top-0 z-50 [@media(max-height:400px)]:static">
                <div className="section-container">
                    <div className="flex items-center h-16">
                        <Link to="/" className="flex-shrink-0 flex items-center" data-testid="header-logo">
                            <img
                                src={logo}
                                alt={t('logoAlt')}
                                className="h-3 lg:h-4 w-auto [filter:var(--header-logo-filter)]"
                            />
                        </Link>
                        <div className="flex-1" />
                        <CartBadge />
                    </div>
                </div>
            </header>
        );
    }

    // @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
    return (
        <header
            ref={headerRef}
            className="bg-header-background text-header-foreground sticky top-0 z-50 [@media(max-height:400px)]:static">
            {announcementSlot}
            {beforeHeader && <div className="flex justify-end section-container">{beforeHeader}</div>}
            <PjHeaderRow>{children}</PjHeaderRow>
        </header>
    );
    // @sfdc-extension-block-end SFDC_EXT_PJ_SHARED
}

// @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
const PJ_HEADER_NAV = [
    { key: 'nav.menu', to: PJ_ROUTES.menu, matches: [PJ_ROUTES.menu, '/c', '/p', '/search'] },
    { key: 'nav.promos', to: PJ_ROUTES.promos, matches: [PJ_ROUTES.promos] },
    { key: 'nav.points', to: PJ_ROUTES.points, matches: [PJ_ROUTES.points] },
    { key: 'nav.stores', to: PJ_ROUTES.stores, matches: [PJ_ROUTES.stores] },
    { key: 'nav.tracking', to: PJ_ROUTES.tracking, matches: [PJ_ROUTES.tracking] },
] as const;

/**
 * Fila del encabezado verde del lienzo (Home.dc.html / Home-Desktop.dc.html):
 * - Móvil: logo, chip de modalidad (UITarget `pj.header.fulfillment`, ocupa el espacio libre),
 *   lupa y botón lima del pedido.
 * - Escritorio (lg): logo, Menú · Promos · Papa Puntos · Locales · Sigue tu pedido, chip de
 *   modalidad, saludo con puntos (o «Ingresar») y «Mi pedido · N».
 */
function PjHeaderRow({ children }: PropsWithChildren): ReactElement {
    const { t } = useTranslation('extPjShared');
    const { t: tHeader } = useTranslation('header');
    const currentPath = usePjPath();
    const count = useBasketSnapshot()?.totalItemCount ?? 0;
    const me = usePjMe();
    const greetingName = me?.firstName ?? null;
    const greetingPoints = me?.points ?? null;
    return (
        <div className="mx-auto flex min-h-[60px] max-w-[1240px] items-center gap-3 px-4 lg:min-h-[72px] lg:gap-7 lg:px-6">
            <Link
                to={PJ_ROUTES.home}
                className="flex shrink-0 items-center"
                data-testid="header-logo"
                aria-label={t('header.homeAria')}>
                <img src={logo} alt={tHeader('logoAlt')} className="w-auto [filter:var(--header-logo-filter)]" />
            </Link>

            <nav aria-label={t('nav.label')} className="hidden lg:flex lg:flex-wrap lg:gap-x-[22px] lg:gap-y-1">
                {PJ_HEADER_NAV.map((item) => {
                    const active = matchesPath(currentPath, item.matches);
                    return (
                        <Link
                            key={item.key}
                            to={item.to}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'flex min-h-11 items-center border-b-[3px] text-[15px] font-semibold text-header-foreground no-underline hover:border-header-foreground/40',
                                active ? 'border-pj-lime' : 'border-transparent'
                            )}>
                            {t(item.key)}
                        </Link>
                    );
                })}
                {children}
            </nav>

            <div data-pj-slot="fulfillment-chip" className="flex min-w-0 flex-1 items-center lg:ml-auto lg:flex-none">
                <UITarget targetId="pj.header.fulfillment" />
            </div>

            <Link
                to={PJ_ROUTES.menuSearch}
                aria-label={t('header.search')}
                className="flex size-11 shrink-0 items-center justify-center text-header-foreground lg:hidden">
                <SearchIcon size={22} />
            </Link>

            <Link
                to={PJ_ROUTES.account}
                data-testid="pj-header-account"
                aria-label={
                    greetingName && greetingPoints !== null
                        ? t('header.greetingAria', { name: greetingName, points: formatCount(greetingPoints) })
                        : undefined
                }
                className="hidden min-h-11 items-center gap-2 px-3.5 font-semibold text-header-foreground no-underline lg:flex">
                {greetingName ? (
                    <>
                        <span>{t('header.greeting', { name: greetingName })}</span>
                        {greetingPoints !== null && (
                            <span className="rounded-full bg-pj-lime-soft px-2.5 py-0.5 text-sm font-bold text-pj-green-dark">
                                {t('header.greetingPoints', { points: formatCount(greetingPoints) })}
                            </span>
                        )}
                    </>
                ) : (
                    t('header.signIn')
                )}
            </Link>

            <Link
                to={PJ_ROUTES.cart}
                data-testid="pj-header-cart"
                aria-label={t('header.myOrderAria', { count })}
                className="relative flex size-11 shrink-0 items-center justify-center rounded-pj-control bg-pj-lime font-bold text-pj-green-dark no-underline lg:w-auto lg:px-4">
                <CartIcon size={22} className="lg:hidden" />
                {count > 0 && (
                    <span
                        aria-hidden="true"
                        className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-pj-green-dark px-1 text-[11px] leading-none text-header-foreground lg:hidden">
                        {count > 99 ? '99+' : count}
                    </span>
                )}
                <span aria-hidden="true" className="hidden lg:inline">
                    {count > 0 ? t('header.myOrderWithCount', { count }) : t('header.myOrder')}
                </span>
            </Link>
        </div>
    );
}
// @sfdc-extension-block-end SFDC_EXT_PJ_SHARED
