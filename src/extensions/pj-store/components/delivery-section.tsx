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
import { useCallback, useEffect, useRef, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { DELIVERY_FEE_CLP, DELIVERY_MINIMUM_CLP } from '@/extensions/pj-shared/lib/fulfillment';
import { fetchStoresNear } from '../hooks/use-stores-near';
import { useAddressSuggestions, type AddressChoice } from '../hooks/use-address-suggestions';
import { assignDeliveryStore, deliveryWindowText, type DeliveryAssignment } from '../lib/delivery-zones';
import { shortStoreName } from '../lib/store-info';

export interface DeliveryValue {
    /** `Av. Providencia 1234`. */
    address: string;
    assignment: DeliveryAssignment;
}

interface DeliverySectionProps {
    value: DeliveryValue | null;
    onChange: (value: DeliveryValue | null) => void;
    apartment: string;
    onApartmentChange: (value: string) => void;
}

/** Delivery: dirección con autocompletado, depto opcional y la tienda que la atiende. */
export function DeliverySection({ value, onChange, apartment, onApartmentChange }: DeliverySectionProps): ReactElement {
    const { t } = useTranslation('extPjStore');
    const [query, setQuery] = useState(value?.address ?? '');
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'resolving' | 'error' | 'noStore'>('idle');
    const { suggestions, mode, activate } = useAddressSuggestions(open ? query : '');
    const requestRef = useRef(0);
    const showList = open && suggestions.length > 0;

    useEffect(() => {
        if (value) setQuery(value.address);
    }, [value]);

    const pick = useCallback(
        async (choice: AddressChoice) => {
            const request = ++requestRef.current;
            setOpen(false);
            setQuery(choice.main);
            setStatus('resolving');
            onChange(null);
            const point = await choice.resolve();
            if (request !== requestRef.current) return;
            if (!point) {
                setStatus('error');
                return;
            }
            try {
                const stores = await fetchStoresNear(point, { radiusKm: 20, limit: 40 });
                if (request !== requestRef.current) return;
                const assignment = assignDeliveryStore(stores, point);
                if (!assignment) {
                    setStatus('noStore');
                    return;
                }
                setStatus('idle');
                onChange({ address: choice.main, assignment });
            } catch {
                if (request === requestRef.current) setStatus('error');
            }
        },
        [onChange]
    );

    return (
        <div className="flex flex-col gap-2.5">
            <label htmlFor="pj-delivery-address" className="text-[13px] font-semibold text-pj-gray">
                {t('delivery.addressLabel')}
            </label>
            <input
                id="pj-delivery-address"
                type="text"
                role="combobox"
                aria-expanded={showList}
                aria-controls="pj-delivery-suggestions"
                aria-autocomplete="list"
                autoComplete="off"
                value={query}
                placeholder={t('delivery.addressPlaceholder')}
                onFocus={() => {
                    activate();
                    setOpen(true);
                }}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                    if (value) onChange(null);
                    setStatus('idle');
                }}
                className="box-border h-12 w-full rounded-xl border-2 border-pj-green bg-pj-surface px-3.5 text-base text-pj-ink placeholder:text-pj-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green"
            />
            {mode === 'simple' && open && !value && (
                <p className="text-[13px] text-pj-gray">{t('delivery.simpleHint')}</p>
            )}
            {showList && (
                <div className="overflow-hidden rounded-xl border border-pj-line shadow-pj-card">
                    <div id="pj-delivery-suggestions" role="listbox" aria-label={t('delivery.suggestionsLabel')}>
                        {suggestions.map((choice) => (
                            <div key={`${choice.main}-${choice.sub}`}>
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={false}
                                    onClick={() => void pick(choice)}
                                    className="flex min-h-14 w-full cursor-pointer flex-col items-start justify-center border-0 border-b border-pj-track bg-pj-surface px-3.5 py-1.5 text-left text-pj-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pj-green">
                                    <span className="text-[15px] font-bold">{choice.main}</span>
                                    <span className="text-[13px] text-pj-gray">{choice.sub}</span>
                                </button>
                            </div>
                        ))}
                    </div>
                    {mode === 'google' && (
                        <div className="bg-[#FAFAF7] px-3.5 py-1.5 text-right text-[11px] text-pj-gray">
                            {t('delivery.poweredByGoogle')}
                        </div>
                    )}
                </div>
            )}
            {status === 'resolving' && (
                <p role="status" className="text-sm text-pj-gray">
                    {t('delivery.resolving')}
                </p>
            )}
            {status === 'error' && (
                <p role="alert" className="text-sm text-pj-sale">
                    {t('delivery.resolveError')}
                </p>
            )}
            {status === 'noStore' && (
                <p role="alert" className="text-sm text-pj-sale">
                    {t('delivery.noStore')}
                </p>
            )}
            {value && (
                <div className="flex flex-col gap-2.5">
                    <label htmlFor="pj-delivery-apartment" className="text-[13px] font-semibold text-pj-gray">
                        {t('delivery.apartmentLabel')}
                    </label>
                    <input
                        id="pj-delivery-apartment"
                        type="text"
                        autoComplete="address-line2"
                        value={apartment}
                        placeholder={t('delivery.apartmentPlaceholder')}
                        onChange={(e) => onApartmentChange(e.target.value)}
                        className="h-[46px] rounded-xl border-[1.5px] border-pj-input-line bg-pj-surface px-3.5 text-base text-pj-ink placeholder:text-pj-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green"
                    />
                    <div
                        data-testid="pj-delivery-assignment"
                        className="flex flex-col gap-1 rounded-[14px] bg-pj-lime-soft p-3.5 text-pj-green-dark">
                        <div className="text-[15px] font-bold">
                            {t('delivery.assigned', { name: shortStoreName(value.assignment.store.name) })}
                        </div>
                        <div className="text-sm">
                            {t('delivery.arrival', {
                                time: deliveryWindowText(value.assignment.store),
                                fee: formatClp(DELIVERY_FEE_CLP),
                            })}
                        </div>
                        <div className="text-[13px]">
                            {t('delivery.minimum', { amount: formatClp(DELIVERY_MINIMUM_CLP) })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
