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
/** @sfdc-extension-file SFDC_EXT_PJ_ACCOUNT */
import type { ReactElement, ReactNode } from 'react';
import { Form } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { useConfig } from '@salesforce/storefront-next-runtime/config';
import { buildUrl } from '@salesforce/storefront-next-runtime/site-context';
import { useCurrentSiteAndLocaleRef } from '@/hooks/use-current-site-and-locale-ref';
import { SeoMeta } from '@/components/seo-meta';
import { formatClp, formatCount } from '@/extensions/pj-shared/lib/format';
import { pointsToClp } from '@/extensions/pj-shared/lib/points';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { useReorder } from '@/extensions/pj-home/hooks/use-home-cart';
import type { PjMember } from '../lib/member';

export interface AccountHomeProps {
    member: PjMember;
}

const ROW =
    'flex min-h-16 w-full items-center justify-between gap-3 rounded-pj-card bg-pj-surface px-4 py-3 text-left text-pj-ink no-underline shadow-pj-card';

function RowText({ title, hint }: { title: string; hint: string }): ReactNode {
    return (
        <span className="flex flex-col">
            <span className="text-base font-bold">{title}</span>
            <span className="pj-small text-pj-gray-strong">{hint}</span>
        </span>
    );
}

function Chevron(): ReactElement {
    return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0 text-pj-basil">
            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

/**
 * Mi cuenta de marca (CTA-01, mínimo para la demo): saludo, saldo de Papa Puntos en puntos y en pesos, y atajos
 * a Mis Papa Puntos, Mis pedidos (del template, solo con sesión), Repetir pedido y el menú. Reemplaza la portada
 * en inglés del template; las páginas hijas de `/account` siguen siendo las del template.
 */
export function AccountHome({ member }: AccountHomeProps): ReactElement {
    const { t } = useTranslation('extPjAccount');
    const { reorder, pending, failed } = useReorder();
    const config = useConfig();
    const { siteRef, localeRef } = useCurrentSiteAndLocaleRef();
    const logoutAction = buildUrl({
        to: '/logout',
        urlConfig: config.url,
        params: { siteId: siteRef, localeId: localeRef },
    });
    const session = member.source === 'session';
    const hasHistory = session || member.profile === 'sofia';
    return (
        <div className="surface-dough pb-16" data-testid="pj-account-home">
            <SeoMeta title={t('account.metaTitle')} />
            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 pt-4 lg:px-6 lg:pt-10">
                <section className="surface-garlic rounded-pj-section p-5 lg:p-8">
                    <p className="pj-micro m-0 text-pj-accent">{t('account.eyebrow')}</p>
                    <h1 className="pj-h1 m-0 mt-2 text-pj-heading">
                        {member.firstName ? t('account.hello', { name: member.firstName }) : t('account.helloNoName')}
                    </h1>
                </section>
                <Link
                    to={PJ_ROUTES.points}
                    data-testid="pj-account-points"
                    className="surface-sauce flex min-h-11 items-center justify-between gap-4 rounded-pj-section p-5 no-underline lg:p-8">
                    <span className="flex flex-col">
                        <span className="pj-micro text-pj-accent">{t('account.pointsLink')}</span>
                        <span className="pj-h2 mt-1 text-pj-heading">{formatCount(member.points)} Papa Puntos</span>
                        <span className="text-lg font-bold text-pj-accent">
                            = {formatClp(pointsToClp(member.points))}
                        </span>
                    </span>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 shrink-0">
                        <path
                            d="M9 6l6 6-6 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </Link>
                <nav aria-label={t('account.linksLabel')}>
                    <ul className="m-0 flex list-none flex-col gap-3 p-0">
                        {hasHistory && (
                            <li>
                                <button
                                    type="button"
                                    onClick={reorder}
                                    disabled={pending}
                                    data-testid="pj-account-reorder"
                                    className={`${ROW} cursor-pointer border-0 disabled:opacity-60`}>
                                    <RowText
                                        title={pending ? t('account.repeatBusy') : t('account.repeat')}
                                        hint={t('account.repeatHint')}
                                    />
                                    <Chevron />
                                </button>
                                {failed && (
                                    <p role="alert" className="m-0 mt-2 text-base font-bold text-pj-sale">
                                        {t('account.repeatFailed')}
                                    </p>
                                )}
                            </li>
                        )}
                        {session && (
                            <li>
                                <Link to="/account/orders" className={ROW}>
                                    <RowText title={t('account.orders')} hint={t('account.ordersHint')} />
                                    <Chevron />
                                </Link>
                            </li>
                        )}
                        <li>
                            <Link to={PJ_ROUTES.menu} className={ROW}>
                                <RowText title={t('account.menu')} hint={t('account.menuHint')} />
                                <Chevron />
                            </Link>
                        </li>
                    </ul>
                </nav>
                {session ? (
                    <Form method="post" action={logoutAction}>
                        <button
                            type="submit"
                            className="inline-flex min-h-11 items-center rounded-full border-2 border-pj-basil bg-transparent px-5 text-base font-bold text-pj-basil">
                            {t('account.logout')}
                        </button>
                    </Form>
                ) : (
                    <div className="flex flex-col gap-3">
                        <p className="pj-small m-0 text-pj-gray-strong">{t('account.demoNote')}</p>
                        <Link
                            to={`${PJ_ROUTES.login}?returnUrl=${encodeURIComponent(PJ_ROUTES.account)}`}
                            className="inline-flex min-h-11 items-center self-start rounded-full border-2 border-pj-basil px-5 text-base font-bold text-pj-basil no-underline">
                            {t('account.login')}
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountHome;
