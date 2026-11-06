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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import type { ReactElement, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 18, ...props }: IconProps) {
    return {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
        'aria-hidden': true,
        focusable: false,
        ...props,
    };
}

export function CheckIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={3}>
            <path d="m5 12 5 5 9-10" />
        </svg>
    );
}

export function PlusIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={2.6}>
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

export function MinusIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={2.6}>
            <path d="M5 12h14" />
        </svg>
    );
}

export function BackIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={2.4}>
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

export function ZoomIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={2.2}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
        </svg>
    );
}

export function PeopleIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={2}>
            <circle cx="9" cy="8" r="3" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M3 20c.8-3.3 3.2-5 6-5s5.2 1.7 6 5M15 15.5c2.6-.4 4.6.9 5.5 4.5" />
        </svg>
    );
}

export function ClockIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={2}>
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2.5M9 2h6" />
        </svg>
    );
}

export function GiftIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={2}>
            <path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z" />
        </svg>
    );
}

export function TrendIcon(props: IconProps): ReactElement {
    return (
        <svg {...base(props)} strokeWidth={2.4}>
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M14 7h7v7" />
        </svg>
    );
}
