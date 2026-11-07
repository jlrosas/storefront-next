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
import { type ReactElement, useEffect, useMemo, useState } from 'react';
import { useFetcher } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { ShopperBasketsV2 } from '@/scapi';
import { useNavigate } from '@/hooks/use-navigate';
import { BottomSheet } from '@/extensions/pj-shared/components/bottom-sheet';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import type { SheetUpsell } from '../lib/upsell';
import { nextCrossSell, type AddedKind, type CrossSellPlan } from '../lib/cross-sell';
import { basketTotal, itemCount } from '../lib/cart-lines';
import { PRO_TOKENS } from '../lib/tokens';
import { usePjCart } from '../hooks/use-pj-cart';
import { CompleteOrderStep } from './complete-order-step';

type Basket = ShopperBasketsV2.schemas['Basket'];

export const PJ_UPSELL_RESOURCE = '/resource/pj-upsell';

/** Ocultar la cabecera de `BottomSheet` (el paso trae su «Cerrar» en la franja). */
export const SHEET_OWN_CLOSE = '[&>div:nth-of-type(2)]:sr-only [&>div:nth-of-type(2)>button]:hidden';

export interface UpsellFooterProps {
    basket: Basket | null;
    onViewOrder: () => void;
    onContinue: () => void;
}

/** «Ver mi pedido · $total» y «Seguir viendo el menú», siempre visibles (S-D19: nada es obligatorio). */
export function UpsellFooter({ basket, onViewOrder, onContinue }: UpsellFooterProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const count = itemCount(basket);
    return (
        <div className="flex flex-col gap-1.5">
            <button
                type="button"
                onClick={onViewOrder}
                className="flex h-[52px] items-center justify-between rounded-full bg-pj-basil px-5 text-base font-bold text-pj-dough"
                data-testid="pj-upsell-view-order">
                <span>{count > 1 ? t('upsell.viewOrderCount', { count }) : t('upsell.viewOrder')}</span>
                <span>{formatClp(basketTotal(basket))}</span>
            </button>
            <button
                type="button"
                onClick={onContinue}
                data-testid="pj-upsell-continue"
                className="flex h-[44px] items-center justify-center text-[15px] font-bold text-pj-basil">
                {t('upsell.noThanks')}
            </button>
        </div>
    );
}

export interface UpsellSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    addedTitle: string;
    addedDetail: string;
    /** Canasta justo después de agregar (decide qué se ofrece). */
    basket: Basket;
    /** Qué se agregó (`nextCrossSell`). */
    addedKind: AddedKind;
    onEdit?: () => void;
    /** «Seguir viendo el menú» lleva al menú (desde la ficha o el constructor); si no, solo cierra. */
    continueToMenu?: boolean;
    /** `c_pjComboFor` de lo que se suma (la pizza o el grupo del combo). */
    comboFor?: string;
}

/**
 * «Completa tu pedido» como hoja propia (S-D19): después del armador de mitades, de la ficha de pizza o de combo y
 * del constructor del Super Dúo / Super Trío. Se carga con `React.lazy`.
 */
export default function UpsellSheet({
    open,
    onOpenChange,
    addedTitle,
    addedDetail,
    basket: initialBasket,
    addedKind,
    onEdit,
    continueToMenu = false,
    comboFor,
}: UpsellSheetProps): ReactElement | null {
    const { t } = useTranslation('extPjProduct');
    const navigate = useNavigate();
    const fetcher = useFetcher<SheetUpsell>();
    const { submit, busy } = usePjCart();
    const [basket, setBasket] = useState<Basket>(initialBasket);
    // La regla se calcula una vez, con la canasta recién agregada: así la hoja no salta mientras se suman cosas.
    const plan: CrossSellPlan | null = useMemo(
        () => nextCrossSell(initialBasket, addedKind),
        [initialBasket, addedKind]
    );
    const { load } = fetcher;
    useEffect(() => {
        if (open && plan) void load(PJ_UPSELL_RESOURCE);
    }, [open, plan, load]);
    if (!plan) return null;

    return (
        <BottomSheet
            open={open}
            onOpenChange={onOpenChange}
            title={t('complete.dialogTitle')}
            hideTitle
            className={SHEET_OWN_CLOSE}
            footer={
                <UpsellFooter
                    basket={basket}
                    onViewOrder={() => {
                        onOpenChange(false);
                        void navigate(PJ_ROUTES.cart);
                    }}
                    onContinue={() => {
                        onOpenChange(false);
                        if (continueToMenu) void navigate(PJ_ROUTES.menu);
                    }}
                />
            }>
            <div style={PRO_TOKENS}>
                <CompleteOrderStep
                    upsell={fetcher.data ?? null}
                    plan={plan}
                    addedTitle={addedTitle}
                    addedDetail={addedDetail}
                    onEdit={onEdit}
                    submit={submit}
                    busy={busy}
                    onBasket={setBasket}
                    onClose={() => onOpenChange(false)}
                    comboFor={comboFor}
                />
            </div>
        </BottomSheet>
    );
}
