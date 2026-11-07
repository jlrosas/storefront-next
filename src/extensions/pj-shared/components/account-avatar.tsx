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
import { cn } from '@/lib/utils';

export interface AccountAvatarProps {
    /** Inicial del nombre («S»). */
    initial: string;
    /** `sm` (24 px, barra inferior) o `md` (32 px, encabezado). */
    size?: 'sm' | 'md';
    className?: string;
}

/**
 * Avatar con la inicial del cliente (INT-08): círculo Punchy Garlic con la letra en Fresh Basil
 * (4,9:1, tokens de pj.css). Es decorativo: el enlace que lo contiene lleva el nombre.
 */
export function AccountAvatar({ initial, size = 'md', className }: AccountAvatarProps): ReactElement {
    return (
        <span
            aria-hidden="true"
            data-testid="pj-account-avatar"
            className={cn(
                'flex shrink-0 items-center justify-center rounded-full bg-pj-garlic font-bold leading-none text-pj-basil',
                size === 'md' ? 'size-8 text-base' : 'size-6 text-sm',
                className
            )}>
            {initial}
        </span>
    );
}

export default AccountAvatar;
