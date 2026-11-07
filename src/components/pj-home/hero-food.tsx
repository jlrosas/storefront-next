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
import { HomeHero } from '@/extensions/pj-home/components/home-hero';
import { loadHeroBlock } from './loaders';
import type { ProfileGate } from '@/extensions/pj-home/lib/home-data.server';
import type { OfferVM } from '@/extensions/pj-home/lib/types';

@Component('pjHeroFood', {
    name: 'Papa Johns · Hero de comida',
    description:
        'Foto a sangre con movimiento lento y pausa, nombre, precio y botón tomados del producto. Sirve para la oferta de temporada (INT la cambia desde Business Manager) y la del anuncio.',
    group: 'Content',
})
@RegionDefinition([])
// oxlint-disable-next-line react-refresh/only-export-components
export class PjHeroFoodMetadata {
    @AttributeDefinition({
        id: 'productId',
        name: 'Producto u oferta',
        description:
            'Producto del catálogo (cb-pizza-del-mes, cb-super-duo…): nombre, precio, antes y foto salen de ahí.',
        type: 'product',
        required: true,
    })
    productId?: string;

    @AttributeDefinition({
        id: 'eyebrow',
        name: 'Etiqueta',
        description: 'Texto sobre el título («Pizza del mes de noviembre», «La oferta que viste»).',
        type: 'string',
    })
    eyebrow?: string;

    @AttributeDefinition({
        id: 'description',
        name: 'Texto que se saborea',
        description: 'Sin valor se usa el del catálogo.',
        type: 'text',
    })
    description?: string;

    @AttributeDefinition({ id: 'ctaLabel', name: 'Texto del botón', type: 'string', defaultValue: 'Lo quiero' })
    ctaLabel?: string;

    @AttributeDefinition({
        id: 'destination',
        name: 'Destino del botón',
        description:
            'Ruta del producto listo para agregar o del constructor (/promos/super-duo). Sin valor: la ficha del producto.',
        type: 'string',
    })
    destination?: string;

    @AttributeDefinition({
        id: 'variant',
        name: 'Estilo',
        type: 'enum',
        values: ['season', 'ad'],
        defaultValue: 'season',
    })
    variant?: string;

    @AttributeDefinition({
        id: 'video',
        name: 'Video (URL de un MP4, hasta 6 s)',
        description:
            'Opcional. Con video, la foto es el póster y el video se carga después del primer pintado; con «reducir movimiento» no se reproduce. Sin video, la foto se mueve lento.',
        type: 'url',
    })
    video?: string;

    @AttributeDefinition({
        id: 'animate',
        name: 'Movimiento lento (con botón de pausa)',
        type: 'boolean',
        defaultValue: true,
    })
    animate?: boolean;

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

interface HeroFoodData {
    visible: boolean;
    offer: OfferVM | null;
}

interface Props {
    eyebrow?: string;
    description?: string;
    ctaLabel?: string;
    destination?: string;
    variant?: string;
    animate?: boolean;
    video?: string;
    data?: HeroFoodData;
}

// oxlint-disable-next-line react-refresh/only-export-components
export const loader = async ({
    componentData,
    context,
}: {
    componentData: unknown;
    context: LoaderFunctionArgs['context'];
}) => {
    const attrs = ((componentData as { data?: Record<string, unknown> }).data ?? {}) as {
        productId?: string;
        destination?: string;
        profile?: ProfileGate;
    };
    return loadHeroBlock(context, attrs, getDemoProfile(context));
};

// oxlint-disable-next-line react-refresh/only-export-components
export function fallback() {
    return <div aria-hidden="true" className="h-[250px] animate-pulse bg-pj-sand lg:h-[520px]" />;
}

export default function PjHeroFood({
    eyebrow,
    description,
    ctaLabel,
    destination,
    variant,
    animate = true,
    video,
    data,
}: Props) {
    if (!data?.visible) return null;
    return (
        <HomeHero
            offer={data.offer}
            variant={variant === 'ad' ? 'ad' : 'season'}
            eyebrow={eyebrow || undefined}
            description={description || undefined}
            ctaLabel={ctaLabel || undefined}
            ctaHref={destination || undefined}
            animate={animate}
            video={video || undefined}
        />
    );
}
