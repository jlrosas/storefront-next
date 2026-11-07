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
import { type ReactElement, useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { DEFAULT_DRINK_FLAVOR, type SheetUpsell } from '../lib/upsell';
import { usePjCart } from '../hooks/use-pj-cart';
import { useImageUrl } from '../hooks/use-image-url';
import { PRO_TOKENS } from '../lib/tokens';

export interface HazloComboCompactProps {
    /** «Pollo BBQ»: la pizza recién agregada. */
    productName: string;
    /** Se llama al aceptar (ya en el carrito) o al rechazar: el panel retira la tarjeta. */
    onDone: (accepted: boolean) => void;
    className?: string;
}

/**
 * «Hazlo combo» compacto para el panel «Tu pedido» de escritorio (UX-2 #52): foto, «+$6.990», la bebida
 * y «Sí, hazlo combo» en granate. Misma oferta y mismo carrito que el paso de la hoja (PRO-02).
 */
export default function HazloComboCompact({
    productName,
    onDone,
    className,
}: HazloComboCompactProps): ReactElement | null {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    const fetcher = useFetcher<SheetUpsell>();
    const { submit, busy } = usePjCart();
    const [flavor, setFlavor] = useState(DEFAULT_DRINK_FLAVOR);
    const [error, setError] = useState(false);
    const { load } = fetcher;
    useEffect(() => {
        void load('/resource/pj-upsell');
    }, [load]);

    const offer = fetcher.data?.offer ?? null;
    if (fetcher.state === 'idle' && fetcher.data && !offer) return null;

    const accept = async () => {
        if (!offer || busy) return;
        const drink = offer.drinks.find((d) => d.flavor === flavor) ?? offer.drinks[0];
        setError(false);
        const result = await submit({
            intent: 'add',
            items: [
                { productId: offer.side.productId, quantity: 1 },
                { productId: drink.productId, quantity: 1 },
            ],
        });
        if (result.success) onDone(true);
        else setError(true);
    };

    return (
        <section
            aria-label={t('upsell.compactAria', { name: productName })}
            data-testid="pj-combo-compact"
            style={PRO_TOKENS}
            className={cn(
                'flex flex-col gap-2.5 rounded-pj-card border-2 border-pj-garlic bg-pj-dough p-3 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1',
                className
            )}>
            {offer ? (
                <>
                    <div className="flex items-center gap-3">
                        {offer.image ? (
                            <FoodImage
                                src={url(offer.image, 240) ?? offer.image}
                                alt={t('upsell.imageAlt')}
                                bleed
                                crop="none"
                                className="size-[72px] shrink-0 rounded-[12px]"
                            />
                        ) : (
                            <div className="size-[72px] shrink-0 rounded-[12px] bg-pj-sand" aria-hidden="true" />
                        )}
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <p className="pj-micro text-pj-sauce">{t('upsell.kicker')}</p>
                            <p className="text-[13px] leading-snug font-semibold text-pj-ink">
                                {t('upsell.compactTitle', {
                                    side: offer.side.name,
                                    drink: t(`upsell.flavorDrink.${flavor}`, { defaultValue: '' }),
                                })}
                            </p>
                            <p className="flex flex-wrap items-baseline gap-x-1.5">
                                <span
                                    className="font-heading text-[22px] leading-none font-extrabold text-pj-sauce"
                                    data-testid="pj-combo-compact-price">
                                    +{formatClp(offer.price)}
                                </span>
                                {offer.savings > 0 && (
                                    <span className="text-xs text-pj-gray-strong">
                                        {t('upsell.savings', { amount: formatClp(offer.savings) })}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div role="radiogroup" aria-label={t('upsell.flavorLabel')} className="grid grid-cols-3 gap-1">
                        {offer.drinks.map((drink) => {
                            const on = drink.flavor === flavor;
                            return (
                                <button
                                    key={drink.flavor}
                                    type="button"
                                    role="radio"
                                    data-labeled
                                    aria-checked={on}
                                    onClick={() => setFlavor(drink.flavor)}
                                    className={cn(
                                        'min-h-[44px] rounded-full border-[1.5px] px-1 text-[13px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil',
                                        on
                                            ? 'border-pj-basil bg-pj-basil text-pj-dough'
                                            : 'border-pj-line bg-pj-surface text-pj-ink hover:border-pj-basil'
                                    )}>
                                    {t(`upsell.flavor.${drink.flavor}`, { defaultValue: drink.flavor })}
                                </button>
                            );
                        })}
                    </div>
                    {error && (
                        <p role="alert" className="text-[13px] font-semibold text-pj-sauce">
                            {t('sheet.error')}
                        </p>
                    )}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void accept()}
                            disabled={busy}
                            data-testid="pj-combo-compact-yes"
                            className="flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-pj-sauce px-3 text-sm font-bold text-pj-dough transition-transform hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-sauce active:scale-[0.97] disabled:opacity-70">
                            {t('upsell.yes')}
                        </button>
                        <button
                            type="button"
                            onClick={() => onDone(false)}
                            data-testid="pj-combo-compact-no"
                            className="flex min-h-[44px] items-center px-2 text-sm font-bold text-pj-basil underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-basil">
                            {t('upsell.compactNo')}
                        </button>
                    </div>
                </>
            ) : (
                <div className="h-[170px] animate-pulse rounded-[12px] bg-pj-sand" aria-busy="true" />
            )}
        </section>
    );
}
