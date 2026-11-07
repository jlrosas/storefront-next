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
import { type ReactElement, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { addTotal, type SimplePdpData } from '../lib/combo-pdp';
import { PRO_TOKENS } from '../lib/tokens';
import { useImageUrl } from '../hooks/use-image-url';
import { AddButton, Breadcrumb, CompleteOrder, Highlights, MobileBar, QuantityStepper } from './pdp-parts';
import { useAddFlow, useSideSelection } from '../hooks/use-pdp-add';

const PHOTO =
    'aspect-[4/3] w-full lg:aspect-auto lg:h-[min(520px,calc(100svh-var(--header-height,72px)-8rem))] lg:rounded-[18px]';

/** Ancla del menú para cada tipo (las secciones de MEN). */
const MENU_SECTION: Record<SimplePdpData['kind'], string> = {
    side: 'acompanamientos',
    drink: 'bebidas',
    dessert: 'postres',
    extra: 'extras',
};

/**
 * Ficha simple de marca (PRO-08, pantalla 7 «Bebidas y extras sin hoja»): acompañamientos, bebidas,
 * postres y extras. Foto → nombre → precio → tamaño o sabor en chips (si tiene variantes) → cantidad →
 * «Completa tu pedido» → «Agregar · $X» directo con aviso. Sin código postal ni BOPIS: la tienda la pide
 * el panel de TIE al agregar.
 */
export function SimplePdp({ data }: { data: SimplePdpData }): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const me = usePjMe();
    const { url, srcSet } = useImageUrl();
    const heroRef = useRef<HTMLDivElement>(null);
    const [optionId, setOptionId] = useState<string | null>(data.initialOptionId);
    const [quantity, setQuantity] = useState(1);
    const sides = useSideSelection();
    const option = data.options.find((o) => o.productId === optionId) ?? null;
    const unitPrice = option?.price ?? data.price;
    const fullName = option ? `${data.name} ${option.label}` : data.name;
    const flow = useAddFlow({ productName: fullName, imageSrc: data.image, heroRef });
    const total = addTotal(unitPrice, quantity, [sides.total]);
    const points = pointsFor(total, 0, me?.doublePoints ?? false);

    const onAdd = () => {
        const productId = option?.productId ?? data.productId;
        void flow.add(
            {
                intent: 'add',
                items: [{ productId, quantity }, ...sides.ids.map((id) => ({ productId: id, quantity: 1 }))],
            },
            total
        );
    };

    const ctaLabel = sides.ids.length ? t('pdpx.addWith', { count: sides.ids.length }) : t('pdpx.add');
    const button = <AddButton label={ctaLabel} total={total} added={flow.added} busy={flow.busy} onAdd={onAdd} />;
    const summary = `${quantity > 1 ? `${quantity} × ` : ''}${fullName}${sides.ids.length ? ` + ${sides.ids.length}` : ''}`;

    return (
        <div
            className="-mt-8 bg-pj-cream pb-[150px] text-pj-ink lg:pb-12"
            style={PRO_TOKENS}
            data-pj-pdpx="simple"
            data-testid="pj-simple-pdp">
            <div className="mx-auto flex max-w-[1100px] flex-col lg:gap-8 lg:px-6 lg:pt-4">
                <Breadcrumb
                    section={t(`pdpx.section.${data.kind}`)}
                    sectionHref={`${PJ_ROUTES.menu}#${MENU_SECTION[data.kind]}`}
                    name={data.name}
                />
                <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                    <div
                        ref={heroRef}
                        className="relative min-w-0 lg:sticky lg:top-[calc(var(--header-height,72px)+1rem)] lg:flex-[1_1_440px]">
                        {data.image ? (
                            <FoodImage
                                src={url(data.image, 1280) ?? data.image}
                                srcSet={srcSet(data.image, [480, 780, 960, 1280])}
                                sizes="(min-width: 1024px) 45vw, 100vw"
                                alt={t('pdpx.imageAlt', { name: data.name })}
                                priority
                                bleed
                                crop="none"
                                className={cn(PHOTO, 'bg-pj-surface')}
                                imgClassName="object-contain"
                            />
                        ) : (
                            <div className={cn(PHOTO, 'bg-pj-sand')} />
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col lg:flex-[1_1_420px] lg:gap-5 lg:rounded-[18px] lg:bg-pj-surface lg:p-6">
                        <section className="flex flex-col gap-2.5 p-4 lg:gap-2 lg:p-0">
                            <h1 className="pj-h1 text-pj-basil">{data.name}</h1>
                            <PriceTag variant="display" size="md" surface="dough" price={unitPrice} />
                            {(data.sensory ?? data.description) && (
                                <p className="pj-body text-pj-gray-strong">{data.sensory ?? data.description}</p>
                            )}
                            <Highlights store={data.store} points={points} />
                        </section>

                        {data.options.length > 1 && (
                            <section
                                aria-labelledby="pj-simple-options"
                                className="flex flex-col gap-2.5 border-t-8 border-[var(--pj-section)] px-4 py-3 lg:border-0 lg:p-0"
                                data-testid="pj-simple-options">
                                <h2 id="pj-simple-options" className="pj-card-title text-pj-basil">
                                    {t(data.kind === 'drink' ? 'pdpx.chooseSize' : 'pdpx.chooseFlavor')}
                                </h2>
                                <div
                                    role="radiogroup"
                                    aria-labelledby="pj-simple-options"
                                    className="flex flex-wrap gap-2">
                                    {data.options.map((o) => {
                                        const on = o.productId === optionId;
                                        return (
                                            <button
                                                key={o.productId}
                                                type="button"
                                                role="radio"
                                                aria-checked={on}
                                                onClick={() => {
                                                    setOptionId(o.productId);
                                                    flow.reset();
                                                }}
                                                data-testid={`pj-simple-option-${o.productId}`}
                                                className={cn(
                                                    'flex min-h-[48px] flex-col items-center justify-center rounded-xl border-[1.5px] px-4 py-1 text-sm leading-tight font-bold',
                                                    on
                                                        ? 'border-pj-basil bg-pj-basil text-pj-dough'
                                                        : 'border-pj-line bg-pj-surface text-pj-ink'
                                                )}>
                                                <span>{o.label}</span>
                                                <span
                                                    className={cn(
                                                        'text-xs font-semibold',
                                                        on ? 'text-pj-dough' : 'text-pj-gray-strong'
                                                    )}>
                                                    {formatClp(o.price)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        <div className="border-t-8 border-[var(--pj-section)] px-4 py-3 lg:border-0 lg:p-0">
                            <QuantityStepper
                                value={quantity}
                                onChange={(q) => {
                                    setQuantity(q);
                                    flow.reset();
                                }}
                                name={data.name}
                            />
                        </div>

                        <div className="hidden flex-col gap-2 lg:flex">
                            <p className="truncate text-[13px] text-pj-gray" data-testid="pj-pdpx-summary">
                                {summary}
                            </p>
                            {flow.error && (
                                <p role="alert" className="text-sm font-semibold text-pj-sale">
                                    {flow.error}
                                </p>
                            )}
                            {button}
                        </div>
                    </div>
                </div>

                <CompleteOrder
                    sides={data.sides}
                    selected={sides.ids}
                    onToggle={(side) => {
                        sides.toggle(side);
                        flow.reset();
                    }}
                    hint={t('pdpx.completeHint')}
                />
            </div>

            <MobileBar summary={summary} error={flow.error}>
                {button}
            </MobileBar>
        </div>
    );
}

export default SimplePdp;
