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
import type { PjPdpData } from '../lib/product-pdp.server';
import { PizzaProductView } from './pizza-product-view';
import { ComboPdp } from './combo-pdp';
import { SimplePdp } from './simple-pdp';

export interface PjProductViewProps {
    data: PjPdpData;
    url: string;
    description?: string | null;
}

/** Ficha de Papa Johns según el tipo de producto (PRO-08): pizza, combo con ficha o producto simple. */
export function PjProductView({ data, url, description }: PjProductViewProps): ReactElement {
    if (data.view === 'pizza') return <PizzaProductView data={data.pizza} url={url} description={description} />;
    const page = data.view === 'combo' ? data.combo : data.simple;
    return (
        <>
            <SeoMeta
                title={page.name}
                description={description ?? page.sensory ?? page.description ?? undefined}
                openGraph={{ type: 'product', url, image: page.image ?? undefined }}
            />
            {data.view === 'combo' ? <ComboPdp data={data.combo} /> : <SimplePdp data={data.simple} />}
        </>
    );
}

export default PjProductView;
