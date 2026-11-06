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
import { useEffect, useRef, useState, type MouseEvent, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useReducedMotion } from '@/extensions/pj-shared';
import { cn } from '@/lib/utils';

export interface MenuCategory {
    id: string;
    label: string;
    count: number;
}

/**
 * Barra de categorías fija con conteos (MEN-01.1). Al tocar una, la página baja a esa sección; la
 * activa sigue al desplazamiento. Se queda pegada bajo el encabezado y en móvil se desliza de lado.
 */
export function CategoryBar({
    categories,
    children,
}: {
    categories: MenuCategory[];
    children?: React.ReactNode;
}): ReactElement {
    const { t } = useTranslation('extPjMenu');
    const reduced = useReducedMotion();
    const [active, setActive] = useState(categories[0]?.id ?? '');
    const navRef = useRef<HTMLElement>(null);
    const ids = categories.map((category) => category.id).join('|');

    useEffect(() => {
        const list = ids.split('|');
        let frame = 0;
        const update = () => {
            frame = 0;
            const bar = navRef.current?.parentElement?.parentElement;
            const line = (bar?.getBoundingClientRect().bottom ?? 0) + 24;
            let current = list[0];
            for (const id of list) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) current = id;
            }
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            setActive(atBottom ? list[list.length - 1] : current);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, [ids]);

    // Mantiene visible la categoría activa en la barra deslizable (solo en horizontal).
    useEffect(() => {
        const nav = navRef.current;
        const el = nav?.querySelector<HTMLElement>('[aria-current="true"]');
        if (!nav || !el) return;
        const left = el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2;
        nav.scrollTo({ left: Math.max(0, left) });
    }, [active]);

    const go = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
        setActive(id);
    };

    return (
        <div
            className="sticky top-(--header-height,60px) z-30 border-b border-pj-sand bg-pj-surface"
            data-testid="pj-menu-category-bar">
            <div className="mx-auto flex max-w-[1360px] flex-wrap items-center gap-x-1 gap-y-2 px-4 lg:px-6 lg:py-2">
                <nav
                    ref={navRef}
                    aria-label={t('categories.label')}
                    className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto lg:flex-wrap lg:gap-1 lg:overflow-visible">
                    {categories.map((category) => {
                        const on = category.id === active;
                        return (
                            <a
                                key={category.id}
                                href={`#${category.id}`}
                                onClick={go(category.id)}
                                aria-current={on ? 'true' : undefined}
                                className={cn(
                                    'flex min-h-11 shrink-0 items-center gap-1 border-b-[3px] px-2.5 text-[15px] no-underline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-pj-green lg:rounded-full lg:border-b-0 lg:px-4',
                                    on
                                        ? 'border-pj-green font-bold text-pj-green lg:bg-pj-green lg:text-pj-surface'
                                        : 'border-transparent font-semibold text-pj-gray hover:text-pj-green'
                                )}>
                                {category.label}
                                <span className="text-xs opacity-80 lg:text-[13px]">{category.count}</span>
                            </a>
                        );
                    })}
                </nav>
                {children}
            </div>
        </div>
    );
}
