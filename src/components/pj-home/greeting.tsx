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
import type { ProfileGate } from './loaders';
import { GreetingStrip } from '@/extensions/pj-home/components/home-blocks';

@Component('pjGreeting', {
    name: 'Papa Johns · Saludo de vuelta',
    description: 'Franja lila bajo el encabezado: «¡Volviste! Este pedido suma Papa Puntos al doble.»',
    group: 'Content',
})
@RegionDefinition([])
// oxlint-disable-next-line react-refresh/only-export-components
export class PjGreetingMetadata {
    @AttributeDefinition({
        id: 'strong',
        name: 'Texto en negrita',
        type: 'string',
        defaultValue: '¡Volviste!',
    })
    strong?: string;

    @AttributeDefinition({
        id: 'rest',
        name: 'Resto del texto',
        type: 'string',
        defaultValue: 'Este pedido suma Papa Puntos al doble.',
    })
    rest?: string;

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
    strong?: string;
    rest?: string;
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

export default function PjGreeting({ strong, rest, data }: Props) {
    if (!data?.visible) return null;
    return <GreetingStrip strong={strong || undefined} rest={rest || undefined} />;
}
