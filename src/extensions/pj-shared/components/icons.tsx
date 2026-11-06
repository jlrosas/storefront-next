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
import type { ReactElement, SVGProps } from 'react';

/** Íconos del lienzo (trazo, `currentColor`, 24×24). Decorativos: `aria-hidden`. */
type IconProps = SVGProps<SVGSVGElement> & { size?: number; strong?: boolean };

function Icon({ size = 24, strong = false, children, ...props }: IconProps & { children: React.ReactNode }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strong ? 2.2 : 1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
            {...props}>
            {children}
        </svg>
    );
}

export function HomeIcon(props: IconProps): ReactElement {
    return (
        <Icon {...props}>
            <path d="M3 11 12 4l9 7" />
            <path d="M5 10v10h14V10" />
            <path d="M10 20v-5h4v5" />
        </Icon>
    );
}

export function PizzaIcon(props: IconProps): ReactElement {
    return (
        <Icon {...props}>
            <path d="M12 3 3.5 19.5c5.5 2 11.5 2 17 0L12 3z" />
            <circle cx="10.5" cy="13" r="1.2" />
            <circle cx="13.8" cy="16.2" r="1.2" />
            <circle cx="12.2" cy="9.4" r="1" />
        </Icon>
    );
}

export function TagIcon(props: IconProps): ReactElement {
    return (
        <Icon {...props}>
            <path d="M20.5 12.5 12.5 20.5a1.5 1.5 0 0 1-2.1 0L3.5 13.6V3.5h10.1l6.9 6.9a1.5 1.5 0 0 1 0 2.1z" />
            <circle cx="8" cy="8" r="1.4" />
        </Icon>
    );
}

export function BagIcon(props: IconProps): ReactElement {
    return (
        <Icon {...props}>
            <path d="M5 8h14l-1.2 12.2H6.2z" />
            <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
        </Icon>
    );
}

export function UserIcon(props: IconProps): ReactElement {
    return (
        <Icon {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c1.6-4 4.6-6 8-6s6.4 2 8 6" />
        </Icon>
    );
}

export function SearchIcon(props: IconProps): ReactElement {
    return (
        <Icon strong {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </Icon>
    );
}

export function CartIcon(props: IconProps): ReactElement {
    return (
        <Icon {...props} strokeWidth={2}>
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" />
        </Icon>
    );
}

export function ChevronRightIcon(props: IconProps): ReactElement {
    return (
        <Icon {...props} strokeWidth={2.4}>
            <path d="m9 18 6-6-6-6" />
        </Icon>
    );
}

export function CloseIcon(props: IconProps): ReactElement {
    return (
        <Icon strong {...props}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </Icon>
    );
}

export function PauseIcon(props: IconProps): ReactElement {
    return (
        <Icon strong {...props}>
            <path d="M9 5v14" />
            <path d="M15 5v14" />
        </Icon>
    );
}

export function PlayIcon(props: IconProps): ReactElement {
    return (
        <Icon strong {...props}>
            <path d="M7 4.5v15l12-7.5z" />
        </Icon>
    );
}
