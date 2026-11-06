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
import { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
// @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
import { PJ_EXTERNAL_LINKS, PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
// @sfdc-extension-block-end SFDC_EXT_PJ_SHARED
import SocialIcons from './social-icons';

/**
 * Footer de Papa Johns Chile (Home-Desktop.dc.html): banda verde oscuro con la marca, Locales,
 * Preguntas frecuentes, Bases legales de promociones y Política de privacidad, más las redes de
 * Papa Johns Chile. Sin newsletter, selector de idioma ni de moneda (INT-02 · criterio 4).
 */
export default function MainFooter(): ReactElement {
    const { t } = useTranslation('extPjShared');
    const linkClass =
        'inline-flex min-h-11 items-center text-footer-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-lime';

    return (
        <footer className="mt-auto bg-footer-background text-footer-foreground" data-testid="pj-footer">
            <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-10 gap-y-2 px-6 py-7 text-sm">
                <Link
                    to={PJ_ROUTES.home}
                    className="inline-flex min-h-11 items-center font-heading text-xl font-extrabold tracking-[0.5px] text-footer-foreground no-underline">
                    {t('footer.brand')}
                </Link>
                <nav aria-label={t('footer.brand')} className="flex flex-wrap gap-x-10 gap-y-0">
                    <Link to={PJ_ROUTES.stores} className={linkClass}>
                        {t('footer.stores')}
                    </Link>
                    <a href={PJ_EXTERNAL_LINKS.help} className={linkClass}>
                        {t('footer.help')}
                    </a>
                    <a href={PJ_EXTERNAL_LINKS.promoTerms} className={linkClass}>
                        {t('footer.promoTerms')}
                    </a>
                    <a href={PJ_EXTERNAL_LINKS.privacy} className={linkClass}>
                        {t('footer.privacy')}
                    </a>
                </nav>
                <SocialIcons className="lg:ml-auto" />
                <p className="w-full text-xs opacity-85">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
            </div>
        </footer>
    );
}
