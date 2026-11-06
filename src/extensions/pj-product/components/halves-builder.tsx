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
import { type ReactElement, Suspense, lazy, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ShopperBasketsV2 } from '@/scapi';
import { cn } from '@/lib/utils';
import { Link } from '@/components/link';
import { useNavigate } from '@/hooks/use-navigate';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { pointsFor } from '@/extensions/pj-shared/lib/points';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { usePjMe } from '@/extensions/pj-shared/hooks/use-pj-me';
import { useShowAddedToast } from '@/extensions/pj-shared/lib/added-toast';
import { crustSurcharge, findVariant } from '../lib/pizza';
import { initialHalvesSelection, nextEmptyHalf, type HalvesBuilderData, type HalvesSelection } from '../lib/halves';
import { linesTotal, pizzaLineCount } from '../lib/cart-lines';
import { PRO_TOKENS } from '../lib/tokens';
import { usePjCart } from '../hooks/use-pj-cart';
import { SplitPizzaImage } from './split-pizza-image';
import { ensureFulfillment } from '../lib/fulfillment-request';
import { BackIcon } from './icons';
import { useImageUrl } from '../hooks/use-image-url';

const UpsellSheet = lazy(() => import('./upsell-sheet'));

type Basket = ShopperBasketsV2.schemas['Basket'];

export interface HalvesBuilderProps {
    /** Datos de `loadHalvesBuilderData` (ruta `/mitades` o `/resource/pj-halves`). */
    data: HalvesBuilderData;
    /** `page`: ruta propia con «Volver al menú». `sheet`: dentro de la hoja del menú. */
    layout: 'page' | 'sheet';
    onClose?: () => void;
    onSaved?: (result: { basket: Basket; itemIds: string[] }) => void;
}

const HALF_LABEL_KEYS = ['halves.left', 'halves.right'] as const;

/**
 * Armador mitad y mitad (Mitades.dc.html, PRO-04). Tamaño y masa son de toda la pizza; cada mitad se
 * elige de la grilla de especialidades con foto. **El precio lo pone el carrito** (hook de DAT, promedio
 * de las mitades): aquí se explica «pagas el promedio» con el precio de cada especialidad y, una vez
 * agregada, se muestra el precio que devolvió el carrito.
 */
export function HalvesBuilder({ data, layout, onClose, onSaved }: HalvesBuilderProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const { url } = useImageUrl();
    const navigate = useNavigate();
    const me = usePjMe();
    const showAddedToast = useShowAddedToast();
    const { submit, busy } = usePjCart();
    const config = data.config;
    const [selection, setSelection] = useState<HalvesSelection | null>(() =>
        config ? initialHalvesSelection(config, data.halves, data.size ?? undefined, data.crust ?? undefined) : null
    );
    const [active, setActive] = useState(() => {
        const empty = selection ? nextEmptyHalf(selection.halves) : 0;
        return empty === -1 ? 0 : empty;
    });
    /** «Editar» desde «Hazlo combo»: al guardar vuelve a esa hoja. */
    const [upsellEdit, setUpsellEdit] = useState(false);
    const [cartPrice, setCartPrice] = useState<number | null>(null);
    const [upsell, setUpsell] = useState<{ basket: Basket; detail: string; itemId: string } | null>(null);
    const [editItemId, setEditItemId] = useState<string | null>(data.itemId);
    const [error, setError] = useState<string | null>(null);

    if (!config || !selection) {
        return (
            <p role="alert" className="px-4 py-10 text-center text-pj-gray">
                {t('sheet.loadError')}
            </p>
        );
    }

    const flavorById = new Map(config.flavors.map((f) => [f.id, f]));
    const chosen = selection.halves.map((id) => (id ? (flavorById.get(id) ?? null) : null));
    const filled = chosen.filter(Boolean).length;
    const missing = selection.halves.length - filled;
    const sizeLabel = config.sizes.find((s) => s.id === selection.size)?.label ?? '';
    const crustLabel = config.crusts.find((c) => c.id === selection.crust)?.label ?? '';
    const crustsForSize = config.crusts.filter((c) =>
        config.variants.some((v) => v.size === selection.size && v.crust === c.id)
    );
    const surcharge = crustSurcharge(config, selection.size, selection.crust);
    const editing = Boolean(editItemId);
    const detail = [sizeLabel, crustLabel, ...chosen.map((f) => (f ? `½ ${f.name}` : null)).filter(Boolean)].join(
        ' · '
    );

    const change = (patch: Partial<HalvesSelection>) => {
        const next = { ...selection, ...patch };
        if (!config.variants.some((v) => v.size === next.size && v.crust === next.crust)) {
            next.crust = config.variants.find((v) => v.size === next.size && v.crust === 'traditional')
                ? 'traditional'
                : (config.variants.find((v) => v.size === next.size)?.crust ?? next.crust);
        }
        setSelection(next);
        setCartPrice(null);
    };

    const pickFlavor = (id: string) => {
        const halves = [...selection.halves];
        halves[active] = id;
        change({ halves });
        const empty = nextEmptyHalf(halves);
        if (empty !== -1) setActive(empty);
    };

    const save = async () => {
        if (missing > 0 || busy) return;
        const variant = findVariant(config, selection.size, selection.crust);
        if (!variant) return;
        if (!editItemId) {
            const outcome = await ensureFulfillment(t('halves.toastName', { size: sizeLabel }));
            if (outcome.status === 'cancelled') return;
        }
        setError(null);
        const result = await submit({
            intent: 'halves',
            ...(editItemId ? { itemId: editItemId } : {}),
            productId: variant.productId,
            quantity: 1,
            halves: selection.halves as string[],
        });
        if (!result.success || !result.basket) {
            setError(t('sheet.error'));
            return;
        }
        const ids = result.addedItemIds ?? [];
        const price = linesTotal(result.basket, ids);
        setCartPrice(price);
        onSaved?.({ basket: result.basket, itemIds: ids });
        if (editing) {
            if (upsellEdit) {
                setUpsellEdit(false);
                setEditItemId(null);
                setUpsell({ basket: result.basket, detail, itemId: editItemId as string });
                return;
            }
            if (layout === 'page') void navigate(PJ_ROUTES.cart);
            else onClose?.();
            return;
        }
        showAddedToast({
            productName: t('halves.toastName', { size: sizeLabel }),
            points: pointsFor(price, 0, me?.doublePoints ?? false),
            onUndo: ids.length ? () => void submit({ intent: 'remove', itemIds: ids }) : undefined,
        });
        if (pizzaLineCount(result.basket) === 1 && ids[0]) {
            setUpsell({ basket: result.basket, detail, itemId: ids[0] });
        }
    };

    const priceNote = (() => {
        if (filled < 2) return t('halves.noteEmpty');
        const [a, b] = chosen;
        const base = t('halves.noteBoth', {
            a: a?.name,
            pa: formatClp(a?.prices[selection.size] ?? 0),
            b: b?.name,
            pb: formatClp(b?.prices[selection.size] ?? 0),
        });
        return surcharge > 0 ? `${base} ${t('halves.noteCrust', { price: formatClp(surcharge) })}` : base;
    })();

    const backClass =
        'flex size-[44px] items-center justify-center rounded-full text-pj-ink focus-visible:outline-2 focus-visible:outline-pj-green';

    return (
        <div
            className={cn('flex flex-col bg-pj-cream text-pj-ink', layout === 'page' && 'min-h-[calc(100dvh-60px)]')}
            style={PRO_TOKENS}
            data-testid="pj-halves-builder">
            <header className="flex shrink-0 items-center gap-1.5 border-b border-pj-sand bg-pj-surface px-2 py-1.5">
                {layout === 'page' ? (
                    <Link
                        to={editing ? PJ_ROUTES.cart : PJ_ROUTES.menu}
                        aria-label={editing ? t('halves.backCart') : t('halves.back')}
                        className={backClass}>
                        <BackIcon size={22} />
                    </Link>
                ) : (
                    <button type="button" onClick={onClose} aria-label={t('halves.back')} className={backClass}>
                        <BackIcon size={22} />
                    </button>
                )}
                <h1 className="flex-1 font-heading text-2xl font-extrabold uppercase">{t('halves.title')}</h1>
            </header>

            <div className="flex flex-1 flex-col gap-3.5 px-4 pt-3.5 pb-4">
                <div className="flex items-center gap-3.5">
                    <SplitPizzaImage
                        images={chosen.map((f) => url(f?.image, 320) ?? null)}
                        label={t('halves.pizzaAria', {
                            size: sizeLabel,
                            parts: chosen.map((f) => f?.name ?? t('halves.unchosen')).join(', '),
                        })}
                    />
                    <div className="flex flex-1 flex-col gap-1.5">
                        {selection.halves.map((_, index) => {
                            const flavor = chosen[index];
                            const on = index === active;
                            return (
                                <button
                                    key={HALF_LABEL_KEYS[index]}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => setActive(index)}
                                    data-testid={`pj-half-slot-${index + 1}`}
                                    className={cn(
                                        'flex min-h-[44px] flex-col items-start rounded-[10px] border-2 px-2.5 py-1 text-left',
                                        on ? 'border-pj-green bg-pj-lime-soft' : 'border-pj-sand bg-pj-surface'
                                    )}>
                                    <span className="text-[11px] text-pj-gray">{t(HALF_LABEL_KEYS[index])}</span>
                                    <span className="text-sm font-bold">{flavor?.name ?? t('halves.choose')}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <p className="text-[13px] font-bold text-pj-gray">{t('halves.wholePizza')}</p>
                    <div role="radiogroup" aria-label={t('config.size')} className="grid grid-cols-3 gap-1.5">
                        {config.sizes.map((size) => {
                            const on = size.id === selection.size;
                            return (
                                <button
                                    key={size.id}
                                    type="button"
                                    role="radio"
                                    data-labeled
                                    aria-checked={on}
                                    onClick={() => change({ size: size.id })}
                                    className={cn(
                                        'min-h-[44px] rounded-[10px] border-2 text-sm font-bold',
                                        on
                                            ? 'border-pj-green bg-pj-lime-soft text-pj-green-dark'
                                            : 'border-pj-sand bg-pj-surface text-pj-ink'
                                    )}>
                                    {size.label}
                                </button>
                            );
                        })}
                    </div>
                    <label className="flex items-center gap-2 text-sm font-semibold">
                        {t('config.crust')}
                        <select
                            value={selection.crust}
                            onChange={(event) => change({ crust: event.target.value })}
                            className="h-[44px] flex-1 rounded-[10px] border-[1.5px] border-pj-input-line bg-pj-surface px-2.5 text-[15px]">
                            {crustsForSize.map((crust) => {
                                const add = crustSurcharge(config, selection.size, crust.id);
                                return (
                                    <option key={crust.id} value={crust.id}>
                                        {add > 0 ? `${crust.label} (+${formatClp(add)})` : crust.label}
                                    </option>
                                );
                            })}
                        </select>
                    </label>
                </div>

                <div className="flex flex-col gap-2">
                    <p className="text-[15px] font-bold" aria-live="polite">
                        {t('halves.prompt', { half: t(HALF_LABEL_KEYS[active]).toLowerCase() })}
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {config.flavors.map((flavor) => {
                            const on = selection.halves[active] === flavor.id;
                            return (
                                <button
                                    key={flavor.id}
                                    type="button"
                                    aria-pressed={on}
                                    onClick={() => pickFlavor(flavor.id)}
                                    data-testid={`pj-flavor-${flavor.id}`}
                                    className={cn(
                                        'flex flex-col items-center gap-1 rounded-xl border-2 bg-pj-surface px-1 py-2',
                                        on ? 'border-pj-green' : 'border-transparent shadow-pj-card'
                                    )}>
                                    {flavor.image ? (
                                        <img
                                            src={url(flavor.image, 128)}
                                            alt=""
                                            width={64}
                                            height={64}
                                            loading="lazy"
                                            decoding="async"
                                            className="size-16 rounded-full bg-pj-sand object-cover"
                                        />
                                    ) : (
                                        <span aria-hidden="true" className="size-16 rounded-full bg-pj-sand" />
                                    )}
                                    <span className="text-center text-xs leading-tight font-bold">{flavor.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <p
                    className="rounded-xl bg-[var(--pj-chip)] px-3 py-2.5 text-[13px] leading-snug text-pj-gray-strong"
                    data-testid="pj-halves-price-note">
                    {priceNote}
                    {cartPrice != null && (
                        <>
                            {' '}
                            <strong className="text-pj-ink" data-testid="pj-halves-cart-price">
                                {t('halves.cartPrice', { price: formatClp(cartPrice) })}
                            </strong>
                        </>
                    )}
                </p>
            </div>

            <footer
                className={cn('sticky bottom-0 z-10 shrink-0 border-t border-pj-line bg-pj-surface px-4 pt-3 pb-4')}>
                {error && (
                    <p role="alert" className="mb-2 text-sm font-semibold text-pj-sale">
                        {error}
                    </p>
                )}
                {missing > 0 ? (
                    <div
                        aria-disabled="true"
                        className="flex h-[54px] items-center justify-center rounded-full bg-pj-track text-base font-bold text-pj-gray">
                        {t('halves.missing', { count: missing })}
                    </div>
                ) : (
                    <button
                        type="button"
                        onClick={() => void save()}
                        disabled={busy}
                        data-testid="pj-halves-add"
                        className="flex h-[54px] w-full items-center justify-between rounded-full bg-pj-green px-[22px] text-[17px] font-bold text-pj-surface disabled:opacity-70">
                        <span>{editing ? t('sheet.save') : t('sheet.add')}</span>
                        <span>{t('halves.average')}</span>
                    </button>
                )}
            </footer>

            {upsell && (
                <Suspense fallback={null}>
                    <UpsellSheet
                        open
                        onOpenChange={(open) => {
                            if (!open) {
                                setUpsell(null);
                                onClose?.();
                            }
                        }}
                        addedTitle={t('halves.addedTitle')}
                        addedDetail={upsell.detail}
                        basket={upsell.basket}
                        onEdit={() => {
                            setEditItemId(upsell.itemId);
                            setUpsellEdit(true);
                            setUpsell(null);
                        }}
                    />
                </Suspense>
            )}
        </div>
    );
}

export default HalvesBuilder;
