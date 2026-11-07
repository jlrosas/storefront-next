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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
import type { LoaderFunctionArgs } from 'react-router';
import { Component } from '@/lib/decorators/component';
import { AttributeDefinition } from '@/lib/decorators/attribute-definition';
import { RegionDefinition } from '@/lib/decorators';
import { getDemoProfile } from '@/extensions/pj-shared/lib/profile';
import { visibleFor } from './loaders';
import type { ProfileGate } from '@/extensions/pj-home/lib/home-data.server';
import { Benefits } from '@/extensions/pj-home/components/home-blocks';

@Component('pjBenefits', {
    name: 'Papa Johns · Beneficios del canal propio',
    description: '«Pedir directo tiene premio» con tres beneficios, sobre Rich Sauce.',
    group: 'Content',
})
@RegionDefinition([])
// oxlint-disable-next-line react-refresh/only-export-components
export class PjBenefitsMetadata {
    @AttributeDefinition({
        id: 'title',
        name: 'Título',
        type: 'string',
    })
    title?: string;

    @AttributeDefinition({
        id: 'benefit1',
        name: 'Beneficio 1',
        type: 'string',
    })
    benefit1?: string;

    @AttributeDefinition({
        id: 'benefit2',
        name: 'Beneficio 2',
        type: 'string',
    })
    benefit2?: string;

    @AttributeDefinition({
        id: 'benefit3',
        name: 'Beneficio 3',
        type: 'string',
    })
    benefit3?: string;

    @AttributeDefinition({
        id: 'profile',
        name: 'Perfil',
        description:
            'A quién se muestra además de los grupos de clientes de la página: todos, Valentina, Diego o Sofía.',
        type: 'enum',
        values: ['all', 'valentina', 'diego', 'sofia'],
        defaultValue: 'all',
    })
    profile?: string;
}

interface Props {
    title?: string;
    benefit1?: string;
    benefit2?: string;
    benefit3?: string;
    data?: { visible: boolean };
}

// oxlint-disable-next-line react-refresh/only-export-components
export const loader = ({
    componentData,
    context,
}: {
    componentData: unknown;
    context: LoaderFunctionArgs['context'];
}) => {
    const attrs = ((componentData as { data?: { profile?: ProfileGate } }).data ?? {}) as { profile?: ProfileGate };
    return Promise.resolve({ visible: visibleFor(attrs.profile, getDemoProfile(context)) });
};

// oxlint-disable-next-line react-refresh/only-export-components
export function fallback() {
    return <div aria-hidden="true" className="mx-4 h-24 animate-pulse rounded-[18px] bg-pj-sand lg:mx-0" />;
}

export default function PjBenefits({ title, benefit1, benefit2, benefit3, data }: Props) {
    if (!data?.visible) return null;
    return (
        <Benefits title={title || undefined} items={[benefit1, benefit2, benefit3].filter((b): b is string => !!b)} />
    );
}
