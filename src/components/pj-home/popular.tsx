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
import { getDemoMoment, getDemoProfile } from '@/extensions/pj-shared/lib/profile';
import { loadProfileBlock } from './loaders';
import type { ProfileGate } from '@/extensions/pj-home/lib/home-data.server';
import { Popular } from '@/extensions/pj-home/components/home-blocks';
import type { HomeData } from '@/extensions/pj-home/lib/types';

@Component('pjPopular', {
    name: 'Papa Johns · Más pedidas',
    description: 'Pizzas más pedidas con ★, insignias y «N esta semana» (solo si N ≥ 100). Datos del catálogo.',
    group: 'Content',
})
@RegionDefinition([])
// oxlint-disable-next-line react-refresh/only-export-components
export class PjPopularMetadata {
    @AttributeDefinition({
        id: 'title',
        name: 'Título',
        type: 'string',
        defaultValue: 'Las más pedidas',
    })
    title?: string;

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
    data?: { visible: boolean; data: HomeData | null };
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
    return loadProfileBlock(context, attrs.profile, getDemoProfile(context), getDemoMoment(context), 'valentina');
};

// oxlint-disable-next-line react-refresh/only-export-components
export function fallback() {
    return <div aria-hidden="true" className="mx-4 h-24 animate-pulse rounded-[18px] bg-pj-sand lg:mx-0" />;
}

export default function PjPopular({ title, data }: Props) {
    if (!data?.visible) return null;
    return <Popular items={data.data?.popular ?? []} title={title || undefined} />;
}
