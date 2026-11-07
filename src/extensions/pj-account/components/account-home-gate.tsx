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
import { type ReactElement, Suspense, use } from 'react';
import type { PjMember } from '../lib/member';
import { AccountHome } from './account-home';

function Resolved({ member }: { member: Promise<PjMember | null> }): ReactElement | null {
    const resolved = use(member);
    return resolved ? <AccountHome member={resolved} /> : null;
}

/**
 * Portada de marca de «Cuenta» (CTA-01) con el socio que entrega el loader de `/account` como promesa. El
 * espacio queda reservado mientras llega (sin salto de layout).
 */
export function AccountHomeGate({ member }: { member: Promise<PjMember | null> }): ReactElement {
    return (
        <Suspense fallback={<div className="surface-dough min-h-[70vh]" aria-busy="true" />}>
            <Resolved member={member} />
        </Suspense>
    );
}

export default AccountHomeGate;
