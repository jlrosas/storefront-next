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
/** @sfdc-extension-file SFDC_EXT_PJ_STORE */
import { useTranslation } from 'react-i18next';
import { FulfillmentChip } from '@/extensions/pj-shared/components/fulfillment-chip';
import { openFulfillmentPanel, useFulfillment } from '../lib/fulfillment-store';

/**
 * Chip de modalidad del encabezado (UITarget `pj.header.fulfillment`, TIE-03). Dice cómo y de
 * dónde se pide y, al tocarlo, abre el panel para cambiarlo. Cambiar la modalidad no toca el carrito.
 */
export default function FulfillmentChipTarget() {
    const { t } = useTranslation('extPjStore');
    const { fulfillment, meta } = useFulfillment();
    if (!fulfillment) {
        return (
            <FulfillmentChip
                top={t('chip.emptyTop')}
                bottom={t('chip.emptyBottom')}
                onClick={() => openFulfillmentPanel()}
            />
        );
    }
    const time = meta?.timeText ?? '';
    const top =
        fulfillment.mode === 'delivery'
            ? t('chip.deliveryTop', { time })
            : meta?.scheduled
              ? t('chip.pickupScheduledTop', { time })
              : t('chip.pickupTop', { time });
    const bottom =
        fulfillment.mode === 'delivery'
            ? (meta?.addressText ?? fulfillment.address ?? '')
            : (meta?.storeName ?? fulfillment.storeId);
    return (
        <FulfillmentChip
            top={top.replace(/ ·\s*$/, '')}
            bottom={bottom}
            onClick={() => openFulfillmentPanel()}
            className="[&>span:first-child]:text-xs"
        />
    );
}
