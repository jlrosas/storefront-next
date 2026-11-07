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
import type { ProfileGate } from './loaders';
import { Favorites } from '@/extensions/pj-home/components/home-sofia';
import type { HomeData } from '@/extensions/pj-home/lib/types';

@Component('pjFavorites', {
    name: 'Papa Johns · Tus favoritas',
    description: 'Favoritas del cliente (c_pjFavorites) con las veces que las pidió.',
    group: 'Content',
})
@RegionDefinition([])
// oxlint-disable-next-line react-refresh/only-export-components
export class PjFavoritesMetadata {
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
    return loadProfileBlock(context, attrs.profile, getDemoProfile(context), getDemoMoment(context), 'sofia');
};

// oxlint-disable-next-line react-refresh/only-export-components
export function fallback() {
    return <div aria-hidden="true" className="mx-4 h-24 animate-pulse rounded-[18px] bg-pj-sand lg:mx-0" />;
}

export default function PjFavorites({ data }: Props) {
    if (!data?.visible) return null;
    return data.data?.sofia ? (
        <div className="lg:mx-auto lg:max-w-[1240px] lg:px-6">
            <Favorites items={data.data.sofia.favorites} redeem={data.data.sofia.redeem} />
        </div>
    ) : null;
}
