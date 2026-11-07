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
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { DEFAULT_DRINK_FLAVOR, type HazloComboOffer } from '../lib/upsell';
import type { PjCartPayload, PjCartResult } from '../lib/cart-payload';
import { CheckIcon } from './icons';
import { CloseIcon } from '@/extensions/pj-shared/components/icons';
import { useImageUrl } from '../hooks/use-image-url';

type Basket = ShopperBasketsV2.schemas['Basket'];

export interface HazloComboCardProps {
    offer: HazloComboOffer;
    submit: (payload: PjCartPayload) => Promise<PjCartResult>;
    busy: boolean;
    onBasket: (basket: Basket) => void;
    /** `c_pjComboFor` (§7.1): la pizza o el grupo al que se pega el combo en el carrito. */
    comboFor?: string;
}

/**
 * Oferta «Hazlo combo» (Complementa.dc.html, PRO-02): Palitos de Ajo + Coca-Cola 1,5 L con el precio y el ahorro
 * de la promoción `pj-hazlo-combo`, sabor de la bebida y un botón que agrega o quita las dos líneas.
 */
export function HazloComboCard({ offer, submit, busy, onBasket, comboFor }: HazloComboCardProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    const [combo, setCombo] = useState<{ side: string; drink: string } | null>(null);
    const [flavor, setFlavor] = useState(DEFAULT_DRINK_FLAVOR);

    const apply = async (payload: PjCartPayload): Promise<PjCartResult> => {
        const result = await submit(payload);
        if (result.success && result.basket) onBasket(result.basket);
        return result;
    };

    const toggleCombo = async () => {
        if (busy) return;
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
            ...(comboFor ? { comboFor } : {}),
        });
        const [side, drinkItem] = result.addedItemIds ?? [];
        if (result.success && side && drinkItem) setCombo({ side, drink: drinkItem });
    };

    const pickFlavor = async (next: string) => {
        if (busy || next === flavor) return;
        setFlavor(next);
        // Sin combo agregado solo se recuerda el sabor; con combo se cambia la línea de la bebida.
        const drink = offer.drinks.find((d) => d.flavor === next);
        if (combo && drink) await apply({ intent: 'swap', itemId: combo.drink, productId: drink.productId });
    };

    return (
        <article
            className={cn(
                'overflow-hidden rounded-[18px] border-2 bg-pj-surface shadow-pj-card',
                combo ? 'border-pj-green' : 'border-transparent'
            )}
            data-testid="pj-combo-offer">
            <div className="relative">
                {offer.image && (
                    <FoodImage
                        src={url(offer.image, 800) ?? offer.image}
                        alt={t('upsell.imageAlt')}
                        bleed
                        crop="none"
                        className="h-[170px] w-full"
                    />
                )}
                {offer.savings > 0 && (
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-pj-sauce px-2.5 py-1 text-xs font-bold text-pj-dough">
                        {t('upsell.savings', { amount: formatClp(offer.savings) })}
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-2 px-3.5 pt-3 pb-3.5">
                <p className="text-xs font-bold tracking-wide text-pj-sale uppercase">{t('upsell.kicker')}</p>
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
                <div role="radiogroup" aria-label={t('upsell.flavorLabel')} className="flex flex-wrap gap-1.5">
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
                                        ? 'border-pj-basil bg-pj-basil text-pj-dough'
                                        : 'border-pj-line bg-pj-surface text-pj-ink'
                                )}>
                                {t(`upsell.flavor.${drink.flavor}`, { defaultValue: drink.flavor })}
                            </button>
                        );
                    })}
                </div>
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
                            : 'bg-pj-sauce text-pj-dough'
                    )}>
                    {combo ? t('upsell.added') : t('upsell.yes')}
                </button>
            </div>
        </article>
    );
}

export interface AddedStripProps {
    /** «Pollo BBQ agregada». */
    title: string;
    /** «Familiar · Tradicional · sin cebolla». */
    detail: string;
    onEdit?: () => void;
    onClose?: () => void;
}

/** Franja «<pizza> agregada · Editar» que confirma lo agregado arriba del paso (reemplaza al aviso). */
export function AddedStrip({ title, detail, onEdit, onClose }: AddedStripProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    return (
        <div
            className="flex items-center gap-3 border-b border-pj-lime-soft bg-pj-lime-soft px-4 py-3"
            aria-live="polite">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-pj-green text-pj-lime">
                <CheckIcon />
            </span>
            <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold text-pj-green-dark" data-testid="pj-added-strip-title">
                    {title}
                </p>
                <p className="text-[13px] text-pj-gray-strong">{detail}</p>
            </div>
            {onEdit && (
                <button
                    type="button"
                    onClick={onEdit}
                    className="flex min-h-[44px] items-center px-1 text-sm font-bold text-pj-green underline-offset-4 hover:underline">
                    {t('upsell.edit')}
                </button>
            )}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={t('sheet.close')}
                    data-testid="pj-upsell-close"
                    className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-pj-surface text-pj-ink shadow-pj-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil">
                    <CloseIcon size={20} />
                </button>
            )}
        </div>
    );
}
