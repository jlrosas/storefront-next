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
import { useMemo, type ReactElement } from 'react';
import { Outlet, redirect, type ShouldRevalidateFunctionArgs } from 'react-router';
import type { Route } from './+types/_app.account';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@salesforce/storefront-next-runtime/config';
import { House, User, Heart, ShoppingBag, MapPin, CreditCard, Building, KeyRound, LogOut } from 'lucide-react';

// Runtime SDK
import type { ShopperCustomers, ShopperConsents } from '@/scapi';

// Components
import { AccountNavList, type AccountNavItemData } from '@/components/account-navigation';
import { Card, CardContent } from '@/components/ui/card';

// Lib
import { getSubscriptions } from '@/lib/api/consent.server';
import { getCustomer } from '@/lib/api/customer.server';
import { buildUrlFromContext } from '@/lib/url.server';
import { resourceRoutes, routes } from '@/route-paths';

// Logging
import { getLogger } from '@/lib/logger.server';

// middleware
import { getAuth as getAuthServer } from '@/middlewares/auth.server';
// @sfdc-extension-line SFDC_EXT_PJ_SHARED
import { PJ_FEATURES } from '@/extensions/pj-shared/lib/features';
// @sfdc-extension-block-start SFDC_EXT_PJ_ACCOUNT
import { pjDemoContext } from '@/extensions/pj-shared/lib/profile';
import { loadPjMember } from '@/extensions/pj-account/lib/member.server';
import { isPjAccountHome } from '@/extensions/pj-account/lib/account-home-path';
import type { PjMember } from '@/extensions/pj-account/lib/member';
import { AccountHomeGate } from '@/extensions/pj-account/components/account-home-gate';
import { useIsPjAccountHome } from '@/extensions/pj-account/hooks/use-is-pj-account-home';
// @sfdc-extension-block-end SFDC_EXT_PJ_ACCOUNT

/**
 * Type definition for the account page loader data
 */
type AccountPageData = {
    customer: Promise<ShopperCustomers.schemas['Customer']>;
    subscriptions: Promise<ShopperConsents.schemas['ConsentSubscriptionResponse'] | null>;
    pjMember?: Promise<PjMember | null> /** @sfdc-extension-line SFDC_EXT_PJ_ACCOUNT */;
};

/**
 * Server-side loader function for the account page.
 * Handles authentication validation and customer data retrieval on the server.
 *
 * @param args - Loader function arguments containing request context
 * @returns Promise containing customer data or redirects to login
 */
export function loader(args: Route.LoaderArgs) {
    const logger = getLogger(args.context);
    logger.debug('Account: loader starting');

    const session = getAuthServer(args.context);
    const { accessToken, accessTokenExpiry, userType, customerId } = session;

    // @sfdc-extension-block-start SFDC_EXT_PJ_ACCOUNT
    // CTA: «Cuenta» con un perfil de demo (`?perfil=`) y sin sesión muestra la portada de marca, no el login.
    // Las páginas hijas (pedidos, direcciones…) siguen pidiendo sesión.
    const pjRegistered = Boolean(accessToken) && userType === 'registered' && Boolean(customerId);
    if (!pjRegistered && args.context.get(pjDemoContext)?.forcedProfile && isPjAccountHome(args.request.url)) {
        return {
            customer: Promise.resolve(null),
            subscriptions: Promise.resolve(null),
            pjMember: loadPjMember(args.context),
        } as unknown as AccountPageData;
    }
    // @sfdc-extension-block-end SFDC_EXT_PJ_ACCOUNT
    if (
        !accessToken ||
        typeof accessTokenExpiry !== 'number' ||
        accessTokenExpiry < Date.now() ||
        userType !== 'registered' ||
        !customerId
    ) {
        logger.warn('Account: authentication validation failed, redirecting to login');
        throw redirect(buildUrlFromContext(routes.login, args.context));
    }

    const customer = getCustomer(args.context, customerId);
    const subscriptions = getSubscriptions(args.context);

    // @sfdc-extension-block-start SFDC_EXT_PJ_ACCOUNT
    // Con sesión, en todas las páginas: la navegación del cliente a `/account` no vuelve a correr este loader.
    return { customer, subscriptions, pjMember: loadPjMember(args.context) };
    // @sfdc-extension-block-end SFDC_EXT_PJ_ACCOUNT
    return { customer, subscriptions };
}

export function shouldRevalidate({ defaultShouldRevalidate, formAction }: ShouldRevalidateFunctionArgs) {
    // Defer revalidation when a fetcher submits to our SCAPI resource route (profile/password update)
    // so AccountDetailsContent stays mounted and useScapiFetcherEffect can fire its callbacks.
    if (formAction?.includes('/resource/api/client')) {
        return false;
    }

    // Defer revalidation for OTP email verification so modal can close and email edit form can open
    if (formAction?.includes(resourceRoutes.otpRequest) || formAction?.includes(resourceRoutes.otpVerify)) {
        return false;
    }

    // Defer revalidation when sending the passwordless OTP to the new email after an email change.
    // We cannot revalidate until the user completes the verify-passwordless call and is reauthenticated
    // with a new JWT scoped to the new email.
    if (
        formAction?.includes(resourceRoutes.authorizePasswordlessEmail) ||
        formAction?.includes(resourceRoutes.verifyPasswordlessOtp)
    ) {
        return false;
    }

    // Defer revalidation for password reset action - no need to refetch customer data
    if (formAction?.includes(resourceRoutes.requestPasswordReset)) {
        return false;
    }

    // Deleting a passkey can't change customer details or consent subscriptions, so skip
    // this layout's loaders. The passkeys child route has no shouldRevalidate of its own,
    // so its credential list still refreshes on the fetcher's default action revalidation.
    if (formAction?.includes(resourceRoutes.passkeyDeleteCredential)) {
        return false;
    }

    return defaultShouldRevalidate;
}

/**
 * Account page component that renders the account navigation and child routes.
 * This component receives the loader data as props and renders the account interface.
 *
 * @param props - Component props containing loader data
 * @returns JSX element representing the account layout
 */
export default function AccountPage({ loaderData }: { loaderData: AccountPageData }): ReactElement {
    const { t } = useTranslation('account');
    const { customer, subscriptions } = loaderData;
    const config = useConfig();
    const passkeyEnabled = Boolean(config.features?.passkey?.enabled);

    // Stable context reference so child Await does not get new promise refs on every layout re-render.
    const outletContext = useMemo(() => ({ customer, subscriptions }), [customer, subscriptions]);
    const pjAccountHome = useIsPjAccountHome(); /** @sfdc-extension-line SFDC_EXT_PJ_ACCOUNT */

    const navigationItems: AccountNavItemData[] = useMemo(
        () => [
            {
                path: '/account/overview',
                icon: House,
                label: t('navigation.overview'),
            },
            {
                path: '/account',
                icon: User,
                label: t('navigation.accountDetails'),
                end: true,
            },
            // @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
            ...(PJ_FEATURES.wishlist
                ? [
                      // @sfdc-extension-block-end SFDC_EXT_PJ_SHARED
                      {
                          path: '/account/wishlist',
                          icon: Heart,
                          label: t('navigation.wishlist'),
                      },
                      // @sfdc-extension-block-start SFDC_EXT_PJ_SHARED
                  ]
                : []),
            // @sfdc-extension-block-end SFDC_EXT_PJ_SHARED
            {
                path: '/account/orders',
                icon: ShoppingBag,
                label: t('navigation.orderHistory'),
            },
            {
                path: '/account/addresses',
                icon: MapPin,
                label: t('navigation.addresses'),
            },
            {
                path: '/account/payment-methods',
                icon: CreditCard,
                label: t('navigation.paymentMethods'),
            },
            ...(passkeyEnabled
                ? [
                      {
                          path: routes.accountPasskeys,
                          icon: KeyRound,
                          label: t('navigation.passkeys'),
                      },
                  ]
                : []),
            {
                path: '/account/store-preferences',
                icon: Building,
                label: t('navigation.storePreferences'),
            },
        ],
        [t, passkeyEnabled]
    );

    const logoutItem: AccountNavItemData = useMemo(
        () => ({
            path: '',
            icon: LogOut,
            label: t('navigation.logOut'),
            action: '/logout',
            method: 'post',
        }),
        [t]
    );

    // @sfdc-extension-block-start SFDC_EXT_PJ_ACCOUNT
    if (pjAccountHome && loaderData.pjMember) {
        return <AccountHomeGate member={loaderData.pjMember} />;
    }
    // @sfdc-extension-block-end SFDC_EXT_PJ_ACCOUNT
    return (
        <div className="min-h-screen bg-background" data-testid="account-layout">
            <div className="w-full section-container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 w-full">
                    {/* Nav column: mobile accordion + desktop sidebar (one cell so sidebar stays left of content) */}
                    <div className="w-full lg:w-fit">
                        {/* Mobile Navigation Accordion */}
                        <div className="lg:hidden">
                            <Card className="bg-muted/30">
                                <CardContent className="p-4">
                                    <h2 className="text-sm font-semibold text-foreground mb-4">{t('myAccount')}</h2>
                                    <nav className="space-y-1">
                                        <AccountNavList items={navigationItems} isMobile={true} />
                                        <AccountNavList items={[logoutItem]} isMobile={true} />
                                    </nav>
                                </CardContent>
                            </Card>
                        </div>
                        {/* Desktop Sidebar Navigation */}
                        <div className="hidden lg:block">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-semibold text-foreground">{t('myAccount')}</h2>
                                <nav className="space-y-1">
                                    <AccountNavList items={navigationItems} />
                                    <AccountNavList items={[logoutItem]} />
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Child routes render here */}
                    <div className="min-w-0">
                        <Outlet context={outletContext} />
                    </div>
                </div>
            </div>
        </div>
    );
}
