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
import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShopperBasketsV2 } from '@/scapi';
import { cn } from '@/lib/utils';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { DEFAULT_DRINK_FLAVOR, type SheetUpsell, type SideProduct } from '../lib/upsell';
import type { PjCartPayload, PjCartResult } from '../lib/cart-payload';
import { CheckIcon, PlusIcon } from './icons';
import { useImageUrl } from '../hooks/use-image-url';

type Basket = ShopperBasketsV2.schemas['Basket'];

export interface HazloComboStepProps {
    /** Datos de `/resource/pj-upsell`; `null` mientras cargan. */
    upsell: SheetUpsell | null;
    /** «Pollo BBQ agregada». */
    addedTitle: string;
    /** «Familiar · Tradicional · sin cebolla». */
    addedDetail: string;
    onEdit: () => void;
    submit: (payload: PjCartPayload) => Promise<PjCartResult>;
    busy: boolean;
    onBasket: (basket: Basket) => void;
}

/**
 * Paso «Hazlo combo» (Complementa.dc.html, PRO-02): confirma la pizza agregada con «Editar», ofrece
 * Palitos de Ajo + Coca-Cola 1,5 L con el precio y el ahorro de la promoción `pj-hazlo-combo` y, debajo,
 * «O agrega por separado». Cada toque se refleja en el carrito real (el pie muestra su total).
 */
export function HazloComboStep({
    upsell,
    addedTitle,
    addedDetail,
    onEdit,
    submit,
    busy,
    onBasket,
}: HazloComboStepProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    const [combo, setCombo] = useState<{ side: string; drink: string } | null>(null);
    const [flavor, setFlavor] = useState(DEFAULT_DRINK_FLAVOR);
    const [picked, setPicked] = useState<Record<string, string>>({});
    const offer = upsell?.offer ?? null;

    const apply = async (payload: PjCartPayload): Promise<PjCartResult> => {
        const result = await submit(payload);
        if (result.success && result.basket) onBasket(result.basket);
        return result;
    };

    const toggleCombo = async () => {
        if (!offer || busy) return;
        if (combo) {
            const result = await apply({ intent: 'remove', itemIds: [combo.side, combo.drink] });
            if (result.success) setCombo(null);
            return;
        }
        const drink = offer.drinks.find((d) => d.flavor === flavor) ?? offer.drinks[0];
        const result = await apply({
            intent: 'add',
            items: [
                { productId: offer.side.productId, quantity: 1 },
                { productId: drink.productId, quantity: 1 },
            ],
        });
        const [side, drinkItem] = result.addedItemIds ?? [];
        if (result.success && side && drinkItem) setCombo({ side, drink: drinkItem });
    };

    const pickFlavor = async (next: string) => {
        if (!offer || busy || next === flavor) return;
        setFlavor(next);
        const drink = offer.drinks.find((d) => d.flavor === next);
        if (combo && drink) await apply({ intent: 'swap', itemId: combo.drink, productId: drink.productId });
    };

    const toggleExtra = async (side: SideProduct) => {
        if (busy) return;
        const itemId = picked[side.productId];
        if (itemId) {
            const result = await apply({ intent: 'remove', itemIds: [itemId] });
            if (result.success) {
                setPicked(({ [side.productId]: _removed, ...rest }) => rest);
            }
            return;
        }
        const result = await apply({ intent: 'add', items: [{ productId: side.productId, quantity: 1 }] });
        const added = result.addedItemIds?.[0];
        if (result.success && added) setPicked((prev) => ({ ...prev, [side.productId]: added }));
    };

    return (
        <div className="-mx-4 flex flex-col bg-pj-cream lg:-mx-6" data-testid="pj-hazlo-combo">
            <div
                className="flex items-center gap-3 border-b border-pj-lime-soft bg-pj-lime-soft px-4 py-3"
                aria-live="polite">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pj-green text-pj-lime">
                    <CheckIcon />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-pj-green-dark">{addedTitle}</p>
                    <p className="text-[13px] text-pj-gray-strong">{addedDetail}</p>
                </div>
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex min-h-[44px] items-center px-1 text-sm font-bold text-pj-green underline-offset-4 hover:underline">
                    {t('upsell.edit')}
                </button>
            </div>

            <div className="flex flex-col gap-4 px-4 pt-3.5 pb-2">
                {!upsell && <div className="h-[340px] animate-pulse rounded-[18px] bg-pj-sand" aria-hidden="true" />}
                {offer && (
                    <article
                        className={cn(
                            'overflow-hidden rounded-[18px] border-2 bg-pj-surface shadow-pj-card',
                            combo ? 'border-pj-green' : 'border-transparent'
                        )}
                        data-testid="pj-combo-offer">
                        <div className="relative">
                            {offer.image && (
                                <img
                                    src={url(offer.image, 800)}
                                    alt={t('upsell.imageAlt')}
                                    className="block h-[170px] w-full object-cover"
                                    loading="lazy"
                                    decoding="async"
                                />
                            )}
                            {offer.savings > 0 && (
                                <span className="absolute top-2.5 left-2.5 rounded-full bg-pj-sale px-2.5 py-1 text-xs font-bold text-pj-surface">
                                    {t('upsell.savings', { amount: formatClp(offer.savings) })}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 px-3.5 pt-3 pb-3.5">
                            <p className="text-xs font-bold tracking-wide text-pj-sale uppercase">
                                {t('upsell.kicker')}
                            </p>
                            <h2 className="font-heading text-[26px] leading-none font-extrabold uppercase">
                                {t('upsell.title', { side: offer.side.name })}
                            </h2>
                            <p>
                                <span className="text-2xl font-extrabold text-pj-sale" data-testid="pj-combo-price">
                                    +{formatClp(offer.price)}
                                </span>{' '}
                                {offer.savings > 0 && (
                                    <span className="text-sm text-pj-gray line-through">
                                        {t('upsell.separately', { price: formatClp(offer.regularPrice) })}
                                    </span>
                                )}
                            </p>
                            {combo && (
                                <div
                                    role="radiogroup"
                                    aria-label={t('upsell.flavorLabel')}
                                    className="flex flex-wrap gap-1.5">
                                    {offer.drinks.map((drink) => {
                                        const on = drink.flavor === flavor;
                                        return (
                                            <button
                                                key={drink.flavor}
                                                type="button"
                                                role="radio"
                                                data-labeled
                                                aria-checked={on}
                                                onClick={() => void pickFlavor(drink.flavor)}
                                                className={cn(
                                                    'min-h-[44px] rounded-full border-2 px-3.5 text-sm font-semibold',
                                                    on
                                                        ? 'border-pj-green bg-pj-lime-soft text-pj-green-dark'
                                                        : 'border-pj-line bg-pj-surface text-pj-ink'
                                                )}>
                                                {t(`upsell.flavor.${drink.flavor}`, { defaultValue: drink.flavor })}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            <button
                                type="button"
                                aria-pressed={Boolean(combo)}
                                onClick={() => void toggleCombo()}
                                disabled={busy}
                                data-testid="pj-combo-toggle"
                                className={cn(
                                    'min-h-[50px] rounded-full text-base font-bold disabled:opacity-70',
                                    combo
                                        ? 'border-[1.5px] border-pj-green bg-pj-surface text-pj-green'
                                        : 'bg-pj-sale text-pj-surface'
                                )}>
                                {combo ? t('upsell.added') : t('upsell.yes')}
                            </button>
                        </div>
                    </article>
                )}

                {upsell && upsell.extras.length > 0 && (
                    <div className="flex flex-col gap-0.5">
                        <h3 className="mb-1 text-[13px] font-bold tracking-wide text-pj-gray uppercase">
                            {t('upsell.separate')}
                        </h3>
                        <ul>
                            {upsell.extras.map((side) => {
                                const on = Boolean(picked[side.productId]);
                                return (
                                    <li
                                        key={side.productId}
                                        className="flex items-center gap-3 border-b border-pj-sand py-2">
                                        {side.image && (
                                            <img
                                                src={url(side.image, 120)}
                                                alt={side.name}
                                                width={60}
                                                height={60}
                                                loading="lazy"
                                                className="size-[60px] shrink-0 rounded-[10px] object-cover"
                                            />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[15px] font-bold">{side.name}</p>
                                            {side.description && (
                                                <p className="text-xs text-pj-gray-strong">{side.description}</p>
                                            )}
                                            <p className="text-sm font-bold">{formatClp(side.price)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            aria-pressed={on}
                                            aria-label={
                                                on
                                                    ? t('upsell.removeAria', { name: side.name })
                                                    : t('upsell.addAria', { name: side.name })
                                            }
                                            onClick={() => void toggleExtra(side)}
                                            disabled={busy}
                                            className={cn(
                                                'flex size-[44px] shrink-0 items-center justify-center rounded-full',
                                                on
                                                    ? 'bg-pj-green text-pj-surface'
                                                    : 'border-[1.5px] border-pj-green bg-pj-surface text-pj-green'
                                            )}>
                                            {on ? <CheckIcon /> : <PlusIcon />}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HazloComboStep;
