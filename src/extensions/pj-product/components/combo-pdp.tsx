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
import { type ReactElement, Suspense, lazy, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { PriceTag } from '@/extensions/pj-shared/components/price-tag';
import { LtoBadge } from '@/extensions/pj-shared/components/lto-badge';
import { ROW_COMBO_IDS, cropForPhoto } from '@/extensions/pj-shared/lib/photo';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import {
    addTotal,
    buildComboChoices,
    chosenOption,
    defaultComboSelection,
    type ComboPdpData,
    type ComboPdpSlot,
    type ComboSelection,
} from '../lib/combo-pdp';
import { PRO_TOKENS } from '../lib/tokens';
import { useImageUrl } from '../hooks/use-image-url';
import { CheckIcon } from './icons';
import { AddButton, Breadcrumb, CompleteOrder, Highlights, MobileBar, QuantityStepper } from './pdp-parts';
import { useAddFlow, useSideSelection } from '../hooks/use-pdp-add';
import { addedKindForCombo } from '../lib/cross-sell';

const UpsellSheet = lazy(() => import('./upsell-sheet'));

/** Las fotos de combo son 4:3 (1440×1080, S-D8): en esa caja se ve la composición completa, sin cortar la bebida. */
const PHOTO = 'aspect-[4/3] w-full lg:rounded-[18px]';
const DAY_MS = 24 * 60 * 60 * 1000;

/** Vigencia visible solo si quedan 7 días o menos (regla 6 del diseño 10). */
function showsValidity(validTo: string | null): boolean {
    if (!validTo) return false;
    const left = (Date.parse(validTo) - Date.now()) / DAY_MS;
    return left >= 0 && left <= 7;
}

/**
 * Ficha de combo (PRO-08, S-D3): Pizza del Mes, Papa Flash, Papa Combo Palitos y Papa Combo con Postre.
 * Foto → sello → nombre → precio display con el «antes» → qué incluye → elecciones del combo
 * preseleccionadas con lo más pedido → «Completa tu pedido» → barra fija «Agregar · $X». Sin código
 * postal, retiro gratis ni selectores del template: la modalidad la resuelve el panel de TIE al agregar.
 */
export function ComboPdp({ data }: { data: ComboPdpData }): ReactElement {
    const { t, i18n } = useTranslation('extPjProduct');
    const me = usePjMe();
    const { url, srcSet } = useImageUrl();
    const heroRef = useRef<HTMLDivElement>(null);
    const [selection, setSelection] = useState<ComboSelection>(() => defaultComboSelection(data.slots));
    const [quantity, setQuantity] = useState(1);
    const sides = useSideSelection();
    const flow = useAddFlow({
        productName: data.name,
        imageSrc: data.image,
        heroRef,
        crossSell: data.slots.some((slot) => slot.kind === 'pizza') ? addedKindForCombo(data.productId) : undefined,
    });

    const total = addTotal(data.price, quantity, [sides.total]);
    const points = pointsFor(total, 0, me?.doublePoints ?? false);
    const percent = data.priceBefore ? Math.round((1 - data.price / data.priceBefore) * 100) : 0;
    const isMonthly = data.productId.includes('pizza-del-mes');
    const choosable = data.slots.filter((s) => s.options.length > 1);

    const sizeLabel = (slot: ComboPdpSlot): string =>
        slot.kind === 'pizza' && slot.size ? String(t(`pdpx.size.${slot.size}`, { defaultValue: '' })) : '';
    const included = data.slots.map((slot) => {
        const option = chosenOption(slot, selection);
        const size = sizeLabel(slot);
        return { slot, text: `${option?.name ?? ''}${size ? ` ${size}` : ''}`.trim() };
    });
    const summary = [data.name, ...included.filter((i) => i.slot.options.length > 1).map((i) => i.text)].join(' · ');

    const choose = (slotId: string, optionId: string) => {
        setSelection((prev) => ({ ...prev, [slotId]: optionId }));
        flow.reset();
    };

    const onAdd = () => {
        const choices = buildComboChoices(data.slots, selection);
        if (!choices) return;
        void flow.add({ intent: 'combo', productId: data.productId, quantity, choices, sides: sides.ids }, total);
    };

    const ctaLabel = sides.ids.length ? t('pdpx.addComboWith', { count: sides.ids.length }) : t('pdpx.add');
    const button = <AddButton label={ctaLabel} total={total} added={flow.added} busy={flow.busy} onAdd={onAdd} />;
    const validity =
        showsValidity(data.validTo) && data.validTo
            ? new Intl.DateTimeFormat(i18n.language || 'es-CL', {
                  day: 'numeric',
                  month: 'long',
                  timeZone: 'America/Santiago',
              }).format(new Date(Date.parse(data.validTo) - 1))
            : null;

    return (
        <div
            className="-mt-8 bg-pj-cream pb-[150px] text-pj-ink lg:pb-12"
            style={PRO_TOKENS}
            data-pj-pdpx="combo"
            data-testid="pj-combo-pdp">
            <div className="mx-auto flex max-w-[1200px] flex-col lg:gap-8 lg:px-6 lg:pt-4">
                <Breadcrumb section={t('pdpx.offers')} sectionHref={PJ_ROUTES.promos} name={data.name} />

                <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                    {/* Foto (sticky en escritorio, N11) */}
                    <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-[calc(var(--header-height,72px)+1rem)] lg:flex-[1_1_480px]">
                        <div ref={heroRef} className="relative">
                            {data.image ? (
                                <FoodImage
                                    src={url(data.image, 1280) ?? data.image}
                                    srcSet={srcSet(data.image, [480, 780, 960, 1280])}
                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                    alt={t('pdpx.imageAlt', { name: data.name })}
                                    priority
                                    bleed
                                    crop={
                                        (ROW_COMBO_IDS as readonly string[]).includes(data.productId)
                                            ? 'none'
                                            : cropForPhoto(data.productId)
                                    }
                                    className={PHOTO}
                                />
                            ) : (
                                <div className={cn(PHOTO, 'bg-pj-sand')} />
                            )}
                            {isMonthly ? (
                                <LtoBadge
                                    variant="lime"
                                    size="lg"
                                    animate
                                    label={t('pdpx.monthlyLabel')}
                                    className="pointer-events-none absolute top-3 left-3 text-[21px] shadow-pj-float lg:top-4 lg:left-4">
                                    {t('pdpx.monthly')}
                                </LtoBadge>
                            ) : (
                                percent > 0 && (
                                    <LtoBadge
                                        size="lg"
                                        animate
                                        label={t('pdpx.offLabel', { percent })}
                                        className="pointer-events-none absolute top-3 left-3 shadow-pj-float lg:top-4 lg:left-4">
                                        {t('pdpx.off', { percent })}
                                    </LtoBadge>
                                )
                            )}
                            {data.serves && (
                                <span className="pointer-events-none absolute right-3 bottom-3 rounded-full bg-pj-basil-deep/85 px-3 py-1.5 pj-small text-pj-dough">
                                    {data.serves}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="flex min-w-0 flex-col lg:flex-[1_1_440px] lg:gap-5 lg:rounded-[18px] lg:bg-pj-surface lg:p-6">
                        <section className="flex flex-col gap-2.5 p-4 lg:gap-2 lg:p-0">
                            <h1 className="pj-h1 text-pj-basil">{data.name}</h1>
                            <PriceTag
                                variant="display"
                                size="md"
                                surface="dough"
                                price={data.price}
                                listPrice={data.priceBefore}
                                listPriceLabel={
                                    data.priceBefore && isMonthly
                                        ? t('pdpx.beforeFrom', { price: formatClp(data.priceBefore) })
                                        : undefined
                                }
                            />
                            {data.sensory && <p className="pj-body text-pj-gray-strong">{data.sensory}</p>}
                            {validity && (
                                <p className="pj-small text-pj-sauce" data-testid="pj-combo-validity">
                                    {t('pdpx.until', { date: validity })}
                                </p>
                            )}
                            <Highlights store={data.store} points={points} />
                        </section>

                        {/* Qué incluye */}
                        <section
                            aria-labelledby="pj-combo-includes"
                            className="flex flex-col gap-2 border-t-8 border-[var(--pj-section)] px-4 py-3 lg:border-0 lg:p-0"
                            data-testid="pj-combo-includes">
                            <h2 id="pj-combo-includes" className="pj-card-title text-pj-basil">
                                {t('pdpx.includes')}
                            </h2>
                            <ul className="flex flex-col gap-1.5">
                                {included.map(({ slot, text }) => (
                                    <li key={slot.id} className="flex items-center gap-2.5 text-[15px]">
                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pj-basil text-pj-dough">
                                            <CheckIcon size={14} />
                                        </span>
                                        <span>
                                            <span className="text-pj-gray-strong">
                                                {slot.kind === 'pizza' ? t('pdpx.pizzaLabel') : slot.label}:{' '}
                                            </span>
                                            <strong>{text}</strong>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Elecciones del combo, con lo más pedido marcado */}
                        {choosable.map((slot) => (
                            <SlotPicker
                                key={slot.id}
                                slot={slot}
                                selected={selection[slot.id]}
                                onChoose={(id) => choose(slot.id, id)}
                                sizeLabel={sizeLabel(slot)}
                            />
                        ))}

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
                                {sides.ids.length > 0 ? ` + ${sides.ids.length}` : ''}
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
                    hint={t('pdpx.completeHintCombo')}
                />
            </div>

            <MobileBar summary={`${summary}${sides.ids.length ? ` + ${sides.ids.length}` : ''}`} error={flow.error}>
                {button}
            </MobileBar>
            {flow.upsell && (
                <Suspense fallback={null}>
                    <UpsellSheet
                        open
                        onOpenChange={(open) => {
                            if (!open) flow.closeUpsell();
                        }}
                        addedTitle={t('complete.addedCombo', { name: data.name })}
                        addedDetail={included.map((i) => i.text).join(' · ')}
                        basket={flow.upsell}
                        addedKind={addedKindForCombo(data.productId)}
                        continueToMenu
                    />
                </Suspense>
            )}
        </div>
    );
}

/** Una casilla del combo: pizzas y postres con foto; bebidas en chips. Seleccionado Basil + Dough (N7). */
function SlotPicker({
    slot,
    selected,
    onChoose,
    sizeLabel,
}: {
    slot: ComboPdpSlot;
    selected: string | undefined;
    onChoose: (optionId: string) => void;
    sizeLabel: string;
}): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    const headingId = `pj-combo-slot-${slot.id}`;
    const withPhoto = slot.kind !== 'drink';
    return (
        <section
            aria-labelledby={headingId}
            className="flex flex-col gap-2.5 border-t-8 border-[var(--pj-section)] px-4 py-3 lg:border-0 lg:p-0"
            data-testid={`pj-combo-picker-${slot.id}`}>
            <div className="flex items-baseline justify-between gap-2">
                <h2 id={headingId} className="pj-card-title text-pj-basil">
                    {t(`pdpx.choose.${slot.kind}`, { label: slot.label })}
                </h2>
                <span className="text-xs font-semibold text-pj-gray">{t('pdpx.mostOrderedFirst')}</span>
            </div>
            <div
                role="radiogroup"
                aria-labelledby={headingId}
                className={cn(
                    withPhoto
                        ? '-mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0'
                        : 'flex flex-wrap gap-2'
                )}>
                {slot.options.map((option, index) => {
                    const on = option.id === selected;
                    const name = `${option.name}${sizeLabel ? ` ${sizeLabel}` : ''}`;
                    return withPhoto ? (
                        <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => onChoose(option.id)}
                            data-testid={`pj-combo-option-${option.id}`}
                            className={cn(
                                'flex w-[124px] shrink-0 flex-col items-center gap-1.5 rounded-pj-card border-2 p-2 text-center lg:w-auto',
                                on
                                    ? 'border-pj-basil bg-pj-basil text-pj-dough'
                                    : 'border-pj-line bg-pj-surface text-pj-ink'
                            )}>
                            <span className="relative size-[84px]">
                                {option.image ? (
                                    <FoodImage
                                        src={url(option.image, 240) ?? option.image}
                                        alt=""
                                        bleed
                                        crop={slot.kind === 'pizza' ? 'macro' : 'none'}
                                        className="size-full rounded-full"
                                    />
                                ) : (
                                    <span className="block size-full rounded-full bg-pj-sand" />
                                )}
                                {on && (
                                    <span className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full bg-pj-lime text-pj-basil ring-2 ring-pj-basil">
                                        <CheckIcon size={14} />
                                    </span>
                                )}
                            </span>
                            <span className="text-[13px] leading-tight font-bold">{option.name}</span>
                            {index === 0 && (
                                <span
                                    className={cn(
                                        'text-[12px] font-bold',
                                        on ? 'text-pj-pepperoncini' : 'text-pj-sauce'
                                    )}>
                                    {t('pdpx.mostOrdered')}
                                </span>
                            )}
                            <span className="sr-only">{name}</span>
                        </button>
                    ) : (
                        <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => onChoose(option.id)}
                            data-testid={`pj-combo-option-${option.id}`}
                            className={cn(
                                'min-h-[44px] rounded-full border-[1.5px] px-4 text-sm font-bold',
                                on
                                    ? 'border-pj-basil bg-pj-basil text-pj-dough'
                                    : 'border-pj-line bg-pj-surface text-pj-ink'
                            )}>
                            {option.name}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default ComboPdp;
