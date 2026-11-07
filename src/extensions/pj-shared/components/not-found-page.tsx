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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '@/components/logo';
import { photoSrcSet, withDisWidth } from '../lib/photo';
import { PJ_ROUTES } from '../lib/routes';
import { NOT_FOUND_IMAGE, withSitePrefix } from '../lib/not-found';

export interface PjNotFoundPageProps {
    /** Inicio del sitio con su prefijo (lo calcula el ErrorBoundary de `root`). */
    homepageUrl: string;
}

/**
 * Página 404 de marca (INT-10). La pinta el ErrorBoundary de `root` para cualquier 404: rutas inexistentes,
 * el catch-all cuando Shopper SEO no resuelve, productos y categorías que no existen. Sin proveedores de
 * sitio ni de configuración (corre fuera de la app), por eso usa enlaces `<a>` con el prefijo ya armado y una
 * `<img>` simple. Los textos vienen en el espacio `routeError` bajo `pjNotFound` (los inyecta el loader de root).
 */
export function PjNotFoundPage({ homepageUrl }: PjNotFoundPageProps): ReactElement {
    const { t: tRoute } = useTranslation('routeError');
    // `pjNotFound` llega en tiempo de ejecución (loader de root) y no está en los tipos de `routeError`.
    const t = tRoute as unknown as (key: string) => string;
    const home = withSitePrefix(homepageUrl, PJ_ROUTES.home);
    const links = [
        { href: withSitePrefix(homepageUrl, PJ_ROUTES.menu), label: t('pjNotFound.menu'), primary: true },
        { href: withSitePrefix(homepageUrl, PJ_ROUTES.promos), label: t('pjNotFound.promos'), primary: false },
        { href: home, label: t('pjNotFound.home'), primary: false },
    ];
    return (
        <>
            <title>{t('pjNotFound.metaTitle')}</title>
            <header className="surface-basil sticky top-0 z-50">
                <div className="mx-auto flex h-16 max-w-[1240px] items-center px-4 lg:px-6">
                    <a
                        href={home}
                        aria-label={t('pjNotFound.home')}
                        className="inline-flex min-h-11 items-center"
                        data-testid="header-logo">
                        <Logo className="h-4 w-auto [filter:var(--header-logo-filter)]" />
                    </a>
                </div>
            </header>
            <main
                id="main-content"
                data-testid="error-page"
                tabIndex={-1}
                className="surface-dough grow"
                data-pj-not-found="true">
                <div className="mx-auto grid max-w-[1240px] items-center px-4 lg:px-6 gap-8 py-10 lg:grid-cols-2 lg:gap-16 lg:py-20">
                    <div className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-full shadow-pj-float lg:max-w-[520px]">
                        <img
                            src={withDisWidth(NOT_FOUND_IMAGE, 720)}
                            srcSet={photoSrcSet(NOT_FOUND_IMAGE, [360, 520, 720, 1040])}
                            sizes="(min-width: 1024px) 520px, 360px"
                            alt={t('pjNotFound.imageAlt')}
                            width={720}
                            height={720}
                            className="size-full scale-125 object-cover"
                        />
                    </div>
                    <div className="text-center lg:text-left">
                        <p className="pj-micro m-0 text-pj-accent">{t('pjNotFound.eyebrow')}</p>
                        <h1 className="pj-h1 mt-3 mb-0 leading-[1.05] text-pj-heading">{t('pjNotFound.title')}</h1>
                        <p className="pj-body mx-auto mt-4 mb-0 max-w-md lg:mx-0">{t('pjNotFound.message')}</p>
                        <nav aria-label={t('pjNotFound.navLabel')} className="mt-8">
                            <ul className="m-0 flex list-none flex-col gap-3 p-0 sm:flex-row sm:justify-center lg:justify-start">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className={
                                                link.primary
                                                    ? 'inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-pj-green px-8 text-base font-bold text-pj-surface no-underline'
                                                    : 'inline-flex min-h-[52px] w-full items-center justify-center rounded-full border-2 border-pj-basil px-8 text-base font-bold text-pj-basil no-underline'
                                            }>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </main>
        </>
    );
}

export default PjNotFoundPage;
