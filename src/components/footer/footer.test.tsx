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
import { getTranslation } from '@salesforce/storefront-next-runtime/i18n';

const { t } = getTranslation();
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { ConfigProvider } from '@salesforce/storefront-next-runtime/config';
import { mockConfig, getSitePrefix, mockSiteObject } from '@/test-utils/config';
import { SiteProvider, type Site } from '@salesforce/storefront-next-runtime/site-context';
import type { AppConfig } from '@/types/config';
import Footer from './index';

// Mock useLocation to control route context
vi.mock('react-router', async () => {
    const actual = await vi.importActual<typeof import('react-router')>('react-router');
    return {
        ...actual,
        useLocation: vi.fn(),
    };
});

const { useLocation } = await import('react-router');

const mockSite: Site = mockSiteObject;

const mockLocale =
    mockSite.supportedLocales.find((l) => l.id === mockSite.defaultLocale) ?? mockSite.supportedLocales[0];

// Helper function to render component with router context
const renderWithRouter = (component: React.ReactElement, config: AppConfig = mockConfig) => {
    const router = createMemoryRouter(
        [
            {
                path: '/',
                element: (
                    <ConfigProvider config={config}>
                        <SiteProvider
                            site={mockSite}
                            locale={mockLocale}
                            language={mockSiteObject.defaultLocale}
                            currency={mockSiteObject.defaultCurrency}>
                            {component}
                        </SiteProvider>
                    </ConfigProvider>
                ),
            },
        ],
        {
            initialEntries: ['/'],
        }
    );
    return render(<RouterProvider router={router} />);
};

describe('Footer', () => {
    beforeEach(() => {
        // Default to homepage route for most tests
        vi.mocked(useLocation).mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: null,
            key: 'default',
        });
    });

    // Papa Johns (INT-02): the approved footer (Home-Desktop.dc.html) has no newsletter, locale/currency
    // switchers or retail policy links; it keeps the brand, Locales, FAQ, promo terms, privacy and socials.
    test('does not render the newsletter heading on the homepage', () => {
        renderWithRouter(<Footer />);

        expect(screen.queryByRole('heading', { name: t('footer:newsletter.title'), level: 2 })).not.toBeInTheDocument();
    });

    test('renders social media links with correct aria-labels and hrefs', () => {
        renderWithRouter(<Footer />);

        const instagramLink = screen.getByLabelText(t('footer:socialMedia.instagramLabel'));
        expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/papajohnschile/');

        const facebookLink = screen.getByLabelText(t('footer:socialMedia.facebookLabel'));
        expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/PapaJohnsChile');

        const tiktokLink = screen.getByLabelText(t('footer:socialMedia.tiktokLabel'));
        expect(tiktokLink).toHaveAttribute('href', 'https://www.tiktok.com/@papajohns.chile');
    });

    test('does not render the newsletter signup form', () => {
        renderWithRouter(<Footer />);

        expect(screen.queryByText(t('footer:newsletter.description'))).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(t('footer:newsletter.emailPlaceholder'))).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: t('footer:newsletter.subscribeButton') })).not.toBeInTheDocument();
    });

    test('does not render the Locale and Currency switchers', () => {
        renderWithRouter(<Footer />);

        expect(screen.queryAllByRole('combobox')).toHaveLength(0);
    });

    test('does not render locale options', () => {
        renderWithRouter(<Footer />);
        expect(screen.queryByRole('option', { name: 'English (UK)' })).not.toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Italiano (Italia)' })).not.toBeInTheDocument();
    });

    test('renders the Papa Johns links: Locales, FAQ, promo terms and privacy', () => {
        renderWithRouter(<Footer />);

        expect(screen.getByRole('link', { name: t('extPjShared:footer.stores') }).getAttribute('href')).toMatch(
            /\/store-locator$/
        );
        expect(screen.getByRole('link', { name: t('extPjShared:footer.help') })).toHaveAttribute(
            'href',
            'https://www.papajohns.cl/centro-de-ayuda'
        );
        expect(screen.getByRole('link', { name: t('extPjShared:footer.promoTerms') })).toHaveAttribute(
            'href',
            'https://www.papajohns.cl/terminos-y-condiciones'
        );
        expect(screen.getByRole('link', { name: t('extPjShared:footer.privacy') })).toHaveAttribute(
            'href',
            'https://www.papajohns.cl/politica-de-privacidad'
        );
        expect(screen.queryByRole('link', { name: t('footer:links.aboutUs') })).not.toBeInTheDocument();
    });

    test('renders copyright text with current year', () => {
        renderWithRouter(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(screen.getByText(t('extPjShared:footer.copyright', { year: currentYear }))).toBeInTheDocument();
    });

    test('renders footer element with theme-aware classes', () => {
        const { container } = renderWithRouter(<Footer />);

        const footer = container.querySelector('footer');
        expect(footer).toBeInTheDocument();
        expect(footer).toHaveClass('mt-auto');
        // Dark green band of the canvas, no newsletter band
        expect(footer).toHaveClass('bg-footer-background');
        expect(footer?.querySelector('.bg-newsletter-background')).not.toBeInTheDocument();
    });

    test('does not render newsletter section on homepage', () => {
        vi.mocked(useLocation).mockReturnValue({
            pathname: '/',
            search: '',
            hash: '',
            state: null,
            key: 'default',
        });

        renderWithRouter(<Footer />);

        expect(screen.queryByRole('heading', { name: t('footer:newsletter.title'), level: 2 })).not.toBeInTheDocument();
    });

    test('does not render newsletter section on site-prefixed homepage', () => {
        vi.mocked(useLocation).mockReturnValue({
            pathname: `${getSitePrefix()}`,
            search: '',
            hash: '',
            state: null,
            key: 'default',
        });

        renderWithRouter(<Footer />);

        expect(screen.queryByRole('heading', { name: t('footer:newsletter.title'), level: 2 })).not.toBeInTheDocument();
    });

    test('does not render newsletter section on non-homepage routes', () => {
        // Mock non-homepage route (e.g., product page)
        vi.mocked(useLocation).mockReturnValue({
            pathname: `${getSitePrefix()}/product/test-product`,
            search: '',
            hash: '',
            state: null,
            key: 'default',
        });

        renderWithRouter(<Footer />);

        // Newsletter should NOT be visible
        expect(screen.queryByRole('heading', { name: t('footer:newsletter.title'), level: 2 })).not.toBeInTheDocument();
        expect(screen.queryByText(t('footer:newsletter.description'))).not.toBeInTheDocument();
        expect(screen.queryByPlaceholderText(t('footer:newsletter.emailPlaceholder'))).not.toBeInTheDocument();
    });

    test('does not render newsletter on cart page', () => {
        // Mock cart route (with site prefix)
        vi.mocked(useLocation).mockReturnValue({
            pathname: `${getSitePrefix()}/cart`,
            search: '',
            hash: '',
            state: null,
            key: 'default',
        });

        renderWithRouter(<Footer />);

        // Newsletter should NOT be visible
        expect(screen.queryByRole('heading', { name: t('footer:newsletter.title'), level: 2 })).not.toBeInTheDocument();
    });

    test('does not render newsletter on category page', () => {
        // Mock category route (with site prefix)
        vi.mocked(useLocation).mockReturnValue({
            pathname: `${getSitePrefix()}/category/mens`,
            search: '',
            hash: '',
            state: null,
            key: 'default',
        });

        renderWithRouter(<Footer />);

        // Newsletter should NOT be visible
        expect(screen.queryByRole('heading', { name: t('footer:newsletter.title'), level: 2 })).not.toBeInTheDocument();
    });

    // Papa Johns: the demo is for registered customers (S-D14); the footer has no guest order lookup.
    test('does not render guest order lookup link even when enabled', () => {
        const configWithGuestOrderLookup: AppConfig = {
            ...mockConfig,
            guestOrderLookup: {
                ...mockConfig.guestOrderLookup,
                enabled: true,
            },
        };

        renderWithRouter(<Footer />, configWithGuestOrderLookup);

        expect(screen.queryByRole('link', { name: t('guestOrderLookup:footerLinkLabel') })).not.toBeInTheDocument();
    });

    test('does not render guest order lookup link when disabled', () => {
        const configWithoutGuestOrderLookup: AppConfig = {
            ...mockConfig,
            guestOrderLookup: {
                ...mockConfig.guestOrderLookup,
                enabled: false,
            },
        };

        renderWithRouter(<Footer />, configWithoutGuestOrderLookup);

        expect(screen.queryByRole('link', { name: t('guestOrderLookup:footerLinkLabel') })).not.toBeInTheDocument();
    });
});
