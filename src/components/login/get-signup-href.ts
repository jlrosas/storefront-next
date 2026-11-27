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
import { routes } from '@/route-paths';

export function getSignupHref(returnUrl?: string | null, action?: string | null, actionParams?: string | null): string {
    const hasReturnUrl = Boolean(returnUrl) && returnUrl !== '/';
    if (!hasReturnUrl && !action && !actionParams) return routes.signup;

    const [pathAndQuery, fragment] = (returnUrl || '/').split('#');
    const [pathname, existingQuery] = pathAndQuery.split('?');
    const params = new URLSearchParams(existingQuery);
    if (action) params.set('action', action);
    if (actionParams) params.set('actionParams', actionParams);
    const query = params.toString();
    const target = `${pathname}${query ? `?${query}` : ''}${fragment ? `#${fragment}` : ''}`;
    return `${routes.signup}?${new URLSearchParams({ returnUrl: target }).toString()}`;
}
