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
import type { ReactElement } from 'react';
import { SeoMeta } from '@/components/seo-meta';
import type { PizzaPdpData } from '../lib/pdp.server';
import { PizzaPdp } from './pizza-pdp';

export interface PizzaProductViewProps {
    data: PizzaPdpData;
    /** URL canónica de la ficha (`/p/<id>`). */
    url: string;
    /** Descripción para SEO (`pageDescription` del producto o el texto que se saborea). */
    description?: string | null;
}

/** Ficha de pizza con su título y descripción para SEO (PRO-03 criterio 8). */
export function PizzaProductView({ data, url, description }: PizzaProductViewProps): ReactElement {
    const { config } = data;
    return (
        <>
            <SeoMeta
                title={config.name}
                description={description ?? config.sensory ?? config.description ?? undefined}
                openGraph={{ type: 'product', url, image: config.image?.src }}
            />
            <PizzaPdp config={config} sides={data.sides} initialSize={data.initialSize} />
        </>
    );
}

export default PizzaProductView;
