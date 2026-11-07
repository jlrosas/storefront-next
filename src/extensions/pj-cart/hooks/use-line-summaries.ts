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
/** @sfdc-extension-file SFDC_EXT_PJ_CART */
import { useEffect, useMemo, useRef } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import { HAZLO_COMBO_DRINKS, HAZLO_COMBO_SIDE } from '@/extensions/pj-product/lib/upsell';
import {
    groupHazloCombo,
    type CartEntry,
    lineProductIds,
    summarizeLine,
    type LineLabels,
    type LineProducts,
    type LineSummary,
    type SummaryLineItem,
} from '../lib/line-summary';

export const PJ_CART_LINES_RESOURCE = '/resource/pj-cart-lines';

/** Textos de la línea (tamaño, masa, «sin», «+») en el idioma del sitio. */
export function useLineLabels(): LineLabels {
    const { t } = useTranslation('extPjCart');
    return useMemo(
        () => ({
            size: (id: string) => t(`size.${id}`, { defaultValue: '' }),
            crust: (id: string) => t(`crust.${id}`, { defaultValue: '' }),
            without: (name: string) => t('line.without', { name }),
            plus: (name: string) => t('line.plus', { name }),
        }),
        [t]
    );
}

/**
 * Resúmenes de las líneas. Con `seed` (loader de `/cart`) parte con lo que trae el servidor; cuando aparece un
 * producto que no conoce (panel «Tu pedido», o una línea recién agregada) pide `/resource/pj-cart-lines`.
 */
export function useLineSummaries(
    items: SummaryLineItem[] | undefined,
    seed?: LineProducts,
    /** Líneas que no cuentan como pizza para «Hazlo combo» (la pizza canjeada). */
    ignore: readonly string[] = []
): { summaries: LineSummary[]; entries: CartEntry[]; labels: LineLabels; products: LineProducts } {
    const labels = useLineLabels();
    const fetcher = useFetcher<{ lineProducts: LineProducts }>({ key: 'pj-cart-lines' });
    const { load } = fetcher;
    const names = useMemo(() => ({ ...(fetcher.data?.lineProducts ?? {}), ...(seed ?? {}) }), [fetcher.data, seed]);
    // Nombre, foto y tipo de lo que todavía no se conoce (líneas nuevas, mitades y elecciones del combo).
    const missing = lineProductIds(items).filter((id) => !names[id]);
    const missingKey = [...new Set(missing)].sort().join(',');
    // Se pide una vez por cada conjunto de IDs que falta (sin reintentos en bucle si SCAPI no los conoce).
    const requested = useRef('');
    useEffect(() => {
        if (!missingKey || requested.current === missingKey) return;
        requested.current = missingKey;
        void load(PJ_CART_LINES_RESOURCE);
    }, [missingKey, load]);
    const summaries = useMemo(
        () => (items ?? []).map((item) => summarizeLine(item, labels, names)),
        [items, labels, names]
    );
    const entries = useMemo(
        () =>
            groupHazloCombo(
                summaries,
                { side: HAZLO_COMBO_SIDE, drinks: HAZLO_COMBO_DRINKS.map((d) => d.productId) },
                ignore
            ),
        [summaries, ignore]
    );
    return { summaries, entries, labels, products: names };
}
