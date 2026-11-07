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
import type { ShopperBasketsV2 } from '@/scapi';
import { cn } from '@/lib/utils';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { flyToCart } from '@/extensions/pj-shared/lib/fly-to-cart';
import { HAZLO_COMBO_SIDE, type CrossSellDrink, type SheetUpsell, type SideProduct } from '../lib/upsell';
import type { CrossSellPlan, DrinkSize } from '../lib/cross-sell';
import type { PjCartPayload, PjCartResult } from '../lib/cart-payload';
import { CheckIcon, PlusIcon } from './icons';
import { AddedStrip, HazloComboCard } from './hazlo-combo-step';
import { useImageUrl } from '../hooks/use-image-url';

type Basket = ShopperBasketsV2.schemas['Basket'];

/** Acompañamientos y postres que se muestran (una lista corta, no un muro). */
const MAX_SIDES = 3;
const MAX_DESSERTS = 2;

/** «1.5» → «1,5 L». */
function drinkSizeLabel(size: DrinkSize): string {
    return `${size.replace('.', ',')} L`;
}

export interface CompleteOrderStepProps {
    /** Datos de `/resource/pj-upsell`; `null` mientras cargan. */
    upsell: SheetUpsell | null;
    /** Lo que se ofrece (`nextCrossSell`). */
    plan: CrossSellPlan;
    /** «Pollo BBQ agregada», «Super Dúo agregado». */
    addedTitle: string;
    addedDetail: string;
    onEdit?: () => void;
    submit: (payload: PjCartPayload) => Promise<PjCartResult>;
    busy: boolean;
    onBasket: (basket: Basket) => void;
    onClose?: () => void;
    /** `c_pjComboFor` (§7.1) de lo que se agrega: la pizza recién agregada o el grupo del combo. */
    comboFor?: string;
}

/**
 * «Completa tu pedido» (S-D19), después de toda pizza o combo con pizzas: confirma lo agregado, «Hazlo combo» arriba
 * cuando aplica (pizza suelta, la primera), bebida por tamaño en chips (o subirla a 2,5 L), acompañamientos y
 * postres con foto, precio y «+». Cada toque se refleja en el carrito real; nada es obligatorio.
 */
export function CompleteOrderStep({
    upsell,
    plan,
    addedTitle,
    addedDetail,
    onEdit,
    submit,
    busy,
    onBasket,
    onClose,
    comboFor,
}: CompleteOrderStepProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const catalog = upsell?.catalog;
    const offer = plan.hazloCombo ? (upsell?.offer ?? null) : null;
    const [picked, setPicked] = useState<Record<string, string>>({});

    const apply = async (payload: PjCartPayload): Promise<PjCartResult> => {
        const result = await submit(payload);
        if (result.success && result.basket) onBasket(result.basket);
        return result;
    };

    const toggle = async (productId: string, from?: HTMLElement | null) => {
        if (busy) return;
        const itemId = picked[productId];
        if (itemId) {
            const result = await apply({ intent: 'remove', itemIds: [itemId] });
            if (result.success) setPicked(({ [productId]: _removed, ...rest }) => rest);
            return;
        }
        void flyToCart(from);
        const result = await apply({
            intent: 'add',
            items: [{ productId, quantity: 1 }],
            ...(comboFor ? { comboFor } : {}),
        });
        const added = result.addedItemIds?.[0];
        if (result.success && added) setPicked((prev) => ({ ...prev, [productId]: added }));
    };

    // Con «Hazlo combo» a la vista, los palitos van en la oferta y no se repiten en la lista.
    const sides = (catalog?.sides ?? [])
        .filter((side) => !(offer && side.productId === HAZLO_COMBO_SIDE))
        .slice(0, MAX_SIDES);
    const desserts = (catalog?.desserts ?? []).slice(0, MAX_DESSERTS);

    return (
        <div className="-mx-4 flex flex-col bg-pj-cream lg:-mx-6" data-testid="pj-complete-order">
            <AddedStrip title={addedTitle} detail={addedDetail} onEdit={onEdit} onClose={onClose} />
            <div className="flex flex-col gap-4 px-4 pt-3.5 pb-2 lg:px-6">
                {!upsell && <div className="h-[340px] animate-pulse rounded-[18px] bg-pj-sand" aria-hidden="true" />}
                {offer && (
                    <HazloComboCard offer={offer} submit={submit} busy={busy} onBasket={onBasket} comboFor={comboFor} />
                )}
                {upsell && (
                    <h2 className="pj-card-title m-0 text-pj-heading" data-testid="pj-complete-title">
                        {t('complete.title')}
                    </h2>
                )}
                {upsell && plan.party && (
                    <p className="-mt-2 text-sm text-pj-gray-strong" data-testid="pj-complete-party">
                        {t('complete.party', { count: plan.pizzas })}
                    </p>
                )}
                {catalog && plan.drink?.mode === 'add' && catalog.drinks.length > 0 && (
                    <DrinkPicker
                        drinks={catalog.drinks}
                        suggested={plan.drink.suggested}
                        busy={busy}
                        apply={apply}
                        comboFor={comboFor}
                    />
                )}
                {catalog && plan.drink?.mode === 'upsize' && (
                    <DrinkUpsize plan={plan.drink} drinks={catalog.drinks} busy={busy} apply={apply} />
                )}
                {plan.sides && sides.length > 0 && (
                    <ProductList
                        title={t('complete.sides')}
                        products={sides}
                        picked={picked}
                        busy={busy}
                        onToggle={toggle}
                        testId="pj-complete-sides"
                    />
                )}
                {plan.desserts && desserts.length > 0 && (
                    <ProductList
                        title={t('complete.desserts')}
                        products={desserts}
                        picked={picked}
                        busy={busy}
                        onToggle={toggle}
                        testId="pj-complete-desserts"
                    />
                )}
            </div>
        </div>
    );
}

/** Bebida con sabor y tamaño en chips: un toque agrega, el mismo la quita, otro tamaño la cambia. */
function DrinkPicker({
    drinks,
    suggested,
    busy,
    apply,
    comboFor,
}: {
    drinks: CrossSellDrink[];
    suggested: DrinkSize;
    busy: boolean;
    apply: (payload: PjCartPayload) => Promise<PjCartResult>;
    comboFor?: string;
}): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    const photo = useRef<HTMLDivElement>(null);
    const [flavor, setFlavor] = useState(drinks[0].flavor);
    const [line, setLine] = useState<{ itemId: string; size: DrinkSize } | null>(null);
    const drink = drinks.find((d) => d.flavor === flavor) ?? drinks[0];

    const pickSize = async (size: DrinkSize) => {
        if (busy) return;
        const productId = drink.sizes.find((s) => s.size === size)?.productId;
        if (!productId) return;
        if (line?.size === size) {
            const result = await apply({ intent: 'remove', itemIds: [line.itemId] });
            if (result.success) setLine(null);
            return;
        }
        if (line) {
            const result = await apply({ intent: 'swap', itemId: line.itemId, productId });
            if (result.success) setLine({ itemId: line.itemId, size });
            return;
        }
        void flyToCart(photo.current);
        const result = await apply({
            intent: 'add',
            items: [{ productId, quantity: 1 }],
            ...(comboFor ? { comboFor } : {}),
        });
        const added = result.addedItemIds?.[0];
        if (result.success && added) setLine({ itemId: added, size });
    };

    const pickFlavor = async (next: CrossSellDrink['flavor']) => {
        if (busy || next === flavor) return;
        setFlavor(next);
        const productId = drinks.find((d) => d.flavor === next)?.sizes.find((s) => s.size === line?.size)?.productId;
        if (line && productId) await apply({ intent: 'swap', itemId: line.itemId, productId });
    };

    return (
        <section
            className="flex gap-3 rounded-pj-card bg-pj-surface p-3 shadow-pj-card"
            aria-labelledby="pj-complete-drink"
            data-testid="pj-complete-drink">
            <div ref={photo} className="shrink-0">
                {drink.image ? (
                    <FoodImage
                        src={url(drink.image, 192) ?? drink.image}
                        alt=""
                        crop="none"
                        aspect="1/1"
                        sizes="72px"
                        className="size-[72px] rounded-pj-card bg-pj-dough"
                    />
                ) : (
                    <div className="size-[72px] rounded-pj-card bg-pj-sand" aria-hidden="true" />
                )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <h3 id="pj-complete-drink" className="m-0 text-[17px] font-bold text-pj-ink">
                    {t('complete.drinkTitle')}
                </h3>
                {drinks.length > 1 && (
                    <div role="radiogroup" aria-label={t('upsell.flavorLabel')} className="flex flex-wrap gap-1.5">
                        {drinks.map((d) => (
                            <button
                                key={d.flavor}
                                type="button"
                                role="radio"
                                data-labeled
                                aria-checked={d.flavor === flavor}
                                onClick={() => void pickFlavor(d.flavor)}
                                className={cn(
                                    'min-h-[44px] rounded-full border-2 px-3 text-sm font-semibold',
                                    d.flavor === flavor
                                        ? 'border-pj-basil bg-pj-basil text-pj-dough'
                                        : 'border-pj-line bg-pj-surface text-pj-ink'
                                )}>
                                {t(`upsell.flavor.${d.flavor}`)}
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex flex-wrap gap-2" data-testid="pj-complete-drink-sizes">
                    {drink.sizes.map((s) => {
                        const on = line?.size === s.size;
                        const label = drinkSizeLabel(s.size);
                        return (
                            <button
                                key={s.size}
                                type="button"
                                aria-pressed={on}
                                disabled={busy}
                                onClick={() => void pickSize(s.size)}
                                aria-label={
                                    on
                                        ? t('upsell.removeAria', { name: `${drink.name} ${label}` })
                                        : t('complete.drinkAddAria', {
                                              name: `${drink.name} ${label}`,
                                              price: formatClp(s.price),
                                          })
                                }
                                data-size={s.size}
                                className={cn(
                                    'relative flex min-h-[48px] items-center gap-1.5 rounded-full border-2 px-3.5 text-[15px] font-bold disabled:opacity-70',
                                    on
                                        ? 'border-pj-basil bg-pj-basil text-pj-dough'
                                        : s.size === suggested
                                          ? 'border-pj-basil bg-pj-surface text-pj-basil'
                                          : 'border-pj-line bg-pj-surface text-pj-ink'
                                )}>
                                {on ? <CheckIcon /> : <PlusIcon width={16} height={16} aria-hidden="true" />}
                                <span>{label}</span>
                                <span className={cn('font-semibold', on ? 'text-pj-dough' : 'text-pj-gray-strong')}>
                                    {formatClp(s.price)}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {suggested === '2.5' && !line && (
                    <p className="m-0 text-[13px] font-semibold text-pj-basil">{t('complete.drinkShare')}</p>
                )}
            </div>
        </section>
    );
}

/** «Súbela a 2,5 L»: cambia la bebida 1,5 L suelta del pedido por la de 2,5 L (cobra la diferencia del catálogo). */
function DrinkUpsize({
    plan,
    drinks,
    busy,
    apply,
}: {
    plan: { itemId: string; from: string; to: string };
    drinks: CrossSellDrink[];
    busy: boolean;
    apply: (payload: PjCartPayload) => Promise<PjCartResult>;
}): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const [done, setDone] = useState(false);
    const sizes = drinks.flatMap((d) => d.sizes);
    const from = sizes.find((s) => s.productId === plan.from)?.price;
    const to = sizes.find((s) => s.productId === plan.to)?.price;
    const diff = from != null && to != null && to > from ? to - from : null;
    const upsize = async () => {
        if (busy || done) return;
        const result = await apply({ intent: 'swap', itemId: plan.itemId, productId: plan.to });
        if (result.success) setDone(true);
    };
    return (
        <section
            className="flex items-center gap-3 rounded-pj-card bg-pj-surface p-3 shadow-pj-card"
            data-testid="pj-complete-upsize">
            <p className="m-0 min-w-0 flex-1 text-[15px] font-bold text-pj-ink">
                {done ? t('complete.upsized') : t('complete.upsize')}
            </p>
            <button
                type="button"
                onClick={() => void upsize()}
                disabled={busy || done}
                aria-pressed={done}
                className={cn(
                    'min-h-[44px] shrink-0 rounded-full px-4 text-sm font-bold disabled:opacity-80',
                    done ? 'border-2 border-pj-basil text-pj-basil' : 'bg-pj-basil text-pj-dough'
                )}>
                {done ? (
                    <CheckIcon />
                ) : diff ? (
                    t('complete.upsizeCta', { price: formatClp(diff) })
                ) : (
                    t('complete.upsizeCtaNoPrice')
                )}
            </button>
        </section>
    );
}

/** Lista con foto, precio y «+» (un toque por producto; con «✓» se quita). */
function ProductList({
    title,
    products,
    picked,
    busy,
    onToggle,
    testId,
}: {
    title: string;
    products: SideProduct[];
    picked: Record<string, string>;
    busy: boolean;
    onToggle: (productId: string, from?: HTMLElement | null) => Promise<void>;
    testId: string;
}): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    return (
        <section className="flex flex-col" data-testid={testId}>
            <h3 className="mb-1 text-[13px] font-bold tracking-wide text-pj-gray-strong uppercase">{title}</h3>
            <ul>
                {products.map((product) => {
                    const on = Boolean(picked[product.productId]);
                    return (
                        <li key={product.productId} className="flex items-center gap-3 border-b border-pj-sand py-2">
                            {product.image ? (
                                <FoodImage
                                    src={url(product.image, 160) ?? product.image}
                                    alt=""
                                    bleed
                                    crop="none"
                                    sizes="60px"
                                    className="size-[60px] shrink-0 rounded-[10px] bg-pj-dough"
                                />
                            ) : (
                                <div className="size-[60px] shrink-0 rounded-[10px] bg-pj-sand" aria-hidden="true" />
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="text-[15px] font-bold">{product.name}</p>
                                {product.description && (
                                    <p className="line-clamp-1 text-xs text-pj-gray-strong">{product.description}</p>
                                )}
                                <p className="text-sm font-bold">{formatClp(product.price)}</p>
                            </div>
                            <button
                                type="button"
                                aria-pressed={on}
                                aria-label={
                                    on
                                        ? t('upsell.removeAria', { name: product.name })
                                        : t('complete.addAria', { name: product.name, price: formatClp(product.price) })
                                }
                                onClick={(event) =>
                                    void onToggle(
                                        product.productId,
                                        event.currentTarget.parentElement?.querySelector('img') ?? null
                                    )
                                }
                                disabled={busy}
                                data-product={product.productId}
                                className={cn(
                                    'flex size-[44px] shrink-0 items-center justify-center rounded-full disabled:opacity-70',
                                    on ? 'bg-pj-basil text-pj-dough' : 'bg-pj-pepperoncini text-pj-basil'
                                )}>
                                {on ? <CheckIcon /> : <PlusIcon width={20} height={20} aria-hidden="true" />}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

export default CompleteOrderStep;
