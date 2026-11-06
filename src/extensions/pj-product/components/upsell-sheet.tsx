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
import type { ShopperBasketsV2 } from '@/scapi';
import { useNavigate } from '@/hooks/use-navigate';
import { BottomSheet } from '@/extensions/pj-shared/components/bottom-sheet';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import type { SheetUpsell } from '../lib/upsell';
import { basketTotal, itemCount } from '../lib/cart-lines';
import { PRO_TOKENS } from '../lib/tokens';
import { usePjCart } from '../hooks/use-pj-cart';
import { HazloComboStep } from './hazlo-combo-step';

type Basket = ShopperBasketsV2.schemas['Basket'];

export interface UpsellSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    addedTitle: string;
    addedDetail: string;
    basket: Basket;
    onEdit: () => void;
}

/** «Hazlo combo» como hoja propia (después del armador de mitades). Se carga con `React.lazy`. */
export default function UpsellSheet({
    open,
    onOpenChange,
    addedTitle,
    addedDetail,
    basket: initialBasket,
    onEdit,
}: UpsellSheetProps): ReactElement {
    const { t } = useTranslation('extPjProduct');
    const navigate = useNavigate();
    const fetcher = useFetcher<SheetUpsell>();
    const { submit, busy } = usePjCart();
    const [basket, setBasket] = useState<Basket>(initialBasket);
    const { load } = fetcher;
    useEffect(() => {
        if (open) void load('/resource/pj-upsell');
    }, [open, load]);

    return (
        <BottomSheet
            open={open}
            onOpenChange={onOpenChange}
            title={t('upsell.dialogTitle')}
            hideTitle
            className="[&>div:nth-of-type(2)]:sr-only"
            footer={
                <div className="flex flex-col gap-1.5">
                    <button
                        type="button"
                        onClick={() => {
                            onOpenChange(false);
                            void navigate(PJ_ROUTES.cart);
                        }}
                        className="flex h-[52px] items-center justify-between rounded-full bg-pj-green px-5 text-base font-bold text-pj-surface">
                        <span>
                            {itemCount(basket) > 1
                                ? t('upsell.viewOrderCount', { count: itemCount(basket) })
                                : t('upsell.viewOrder')}
                        </span>
                        <span>{formatClp(basketTotal(basket))}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onOpenChange(false);
                            void navigate(PJ_ROUTES.menu);
                        }}
                        className="flex h-[44px] items-center justify-center text-[15px] font-bold text-pj-green">
                        {t('upsell.noThanks')}
                    </button>
                </div>
            }>
            <div style={PRO_TOKENS}>
                <HazloComboStep
                    upsell={fetcher.data ?? null}
                    addedTitle={addedTitle}
                    addedDetail={addedDetail}
                    onEdit={onEdit}
                    submit={submit}
                    busy={busy}
                    onBasket={setBasket}
                />
            </div>
        </BottomSheet>
    );
}
