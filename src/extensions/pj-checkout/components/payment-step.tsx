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
/** @sfdc-extension-file SFDC_EXT_PJ_CHECKOUT */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { cardBrand, formatCardNumber, formatExpiry, formatRut, type PayMethod } from '../lib/checkout-model';
import type { SavedCard } from '../lib/types';
import { ChoiceCard, Field, StepCard } from './form-fields';

export interface PaymentValues {
    method: PayMethod;
    cvv: string;
    cardNumber: string;
    cardExpiry: string;
    cardHolder: string;
    cardRut: string;
}

export interface PaymentStepProps {
    values: PaymentValues;
    onChange: (patch: Partial<PaymentValues>) => void;
    /** Errores visibles (solo de los campos que el cliente ya dejó). */
    errors: Partial<Record<keyof PaymentValues, string | null>>;
    onBlur: (field: keyof PaymentValues) => void;
    savedCard: SavedCard | null;
    delivery: boolean;
    total: number;
    /** `PJ_CASH` existe para esta canasta. */
    cashAvailable: boolean;
}

function CardIcon(): ReactElement {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true">
            <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
            <path d="M2.5 10h19M6.5 15h4" strokeLinecap="round" />
        </svg>
    );
}

function CashIcon(): ReactElement {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true">
            <rect x="2.5" y="6" width="19" height="12" rx="2" />
            <circle cx="12" cy="12" r="2.6" />
            <path d="M6 9.5v5M18 9.5v5" strokeLinecap="round" />
        </svg>
    );
}

/** Marca escrita (sin logos de terceros): solo las tarjetas que se aceptan (S-D4). */
function BrandBadge({ brand }: { brand: string }): ReactElement {
    return (
        <span className="inline-flex h-7 min-w-11 items-center justify-center rounded-md bg-pj-sauce px-2 text-xs font-extrabold tracking-wide text-pj-on-sauce uppercase">
            {brand === 'Mastercard' ? 'MC' : brand}
        </span>
    );
}

/**
 * «2 · ¿Cómo pagas?» (07 v2, CHK-02, CHK-03): tarjeta o efectivo en dos tarjetas grandes; la elegida se abre
 * debajo. Con tarjeta guardada (Sofía) solo pide el código; si no, el formulario con la forma de Bricks.
 * Pago de prueba sin pasarela (S-D4).
 */
export function PaymentStep({
    values,
    onChange,
    errors,
    onBlur,
    savedCard,
    delivery,
    total,
    cashAvailable,
}: PaymentStepProps): ReactElement {
    const { t } = useTranslation('extPjCheckout');
    const card = values.method !== 'cash';
    const brand = cardBrand(values.cardNumber);
    return (
        <StepCard step={2} title={t('payment.title')}>
            <div role="radiogroup" aria-label={t('payment.label')} className="grid grid-cols-2 gap-3">
                <ChoiceCard
                    checked={card}
                    onSelect={() => onChange({ method: savedCard ? 'saved-card' : 'new-card' })}
                    title={t('payment.card')}
                    hint={t('payment.cardHint')}
                    icon={<CardIcon />}
                    testId="pj-pay-card"
                />
                <ChoiceCard
                    checked={!card}
                    onSelect={() => onChange({ method: 'cash' })}
                    title={delivery ? t('payment.cashDelivery') : t('payment.cashPickup')}
                    hint={
                        cashAvailable
                            ? delivery
                                ? t('payment.cashDeliveryHint')
                                : t('payment.cashPickupHint')
                            : t('payment.cashUnavailable')
                    }
                    disabled={!cashAvailable}
                    icon={<CashIcon />}
                    testId="pj-pay-cash"
                />
            </div>

            {values.method === 'saved-card' && savedCard && (
                <div className="flex flex-col gap-3 rounded-pj-card bg-pj-dough p-3" data-testid="pj-pay-saved">
                    <div className="flex items-center gap-3">
                        <BrandBadge brand={savedCard.brand} />
                        <span className="flex-1 text-base font-bold text-pj-ink">
                            {t('payment.saved', { last4: savedCard.last4 })}
                        </span>
                        <button
                            type="button"
                            onClick={() => onChange({ method: 'new-card', cvv: '' })}
                            className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                            {t('payment.otherCard')}
                        </button>
                    </div>
                    <Field
                        label={t('payment.cvv')}
                        value={values.cvv}
                        onValue={(cvv) => onChange({ cvv: cvv.replace(/\D/g, '').slice(0, 4) })}
                        onBlur={() => onBlur('cvv')}
                        error={errors.cvv}
                        hint={t('payment.cvvHint')}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="123"
                        className="max-w-60"
                        data-testid="pj-pay-cvv"
                    />
                </div>
            )}

            {values.method === 'new-card' && (
                <div className="flex flex-col gap-3 rounded-pj-card bg-pj-dough p-3" data-testid="pj-pay-new">
                    <Field
                        label={t('payment.number')}
                        value={values.cardNumber}
                        onValue={(value) => onChange({ cardNumber: formatCardNumber(value) })}
                        onBlur={() => onBlur('cardNumber')}
                        error={errors.cardNumber}
                        hint={brand ? undefined : t('payment.accepted')}
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 1234 1234 1234"
                        data-testid="pj-pay-number"
                    />
                    {brand && (
                        <div className="-mt-1 flex items-center gap-2">
                            <BrandBadge brand={brand} />
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <Field
                            label={t('payment.expiry')}
                            value={values.cardExpiry}
                            onValue={(value) => onChange({ cardExpiry: formatExpiry(value) })}
                            onBlur={() => onBlur('cardExpiry')}
                            error={errors.cardExpiry}
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            placeholder="MM/AA"
                        />
                        <Field
                            label={t('payment.cvv')}
                            value={values.cvv}
                            onValue={(cvv) => onChange({ cvv: cvv.replace(/\D/g, '').slice(0, 4) })}
                            onBlur={() => onBlur('cvv')}
                            error={errors.cvv}
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            placeholder="123"
                        />
                    </div>
                    <Field
                        label={t('payment.holder')}
                        value={values.cardHolder}
                        onValue={(cardHolder) => onChange({ cardHolder })}
                        onBlur={() => onBlur('cardHolder')}
                        error={errors.cardHolder}
                        autoComplete="cc-name"
                        placeholder={t('payment.holderPlaceholder')}
                    />
                    <Field
                        label={t('payment.holderRut')}
                        value={values.cardRut}
                        onValue={(cardRut) => onChange({ cardRut })}
                        onBlur={() => {
                            if (values.cardRut) onChange({ cardRut: formatRut(values.cardRut) });
                            onBlur('cardRut');
                        }}
                        error={errors.cardRut}
                        inputMode="text"
                        placeholder="12.345.678-9"
                    />
                    <div className="flex flex-col gap-1">
                        <label htmlFor="pj-installments" className="text-sm font-semibold text-pj-gray-strong">
                            {t('payment.installments')}
                        </label>
                        <select
                            id="pj-installments"
                            className="h-12 rounded-pj-control border-[1.5px] border-pj-input-line bg-pj-surface px-3 text-base text-pj-ink">
                            <option>{t('payment.oneInstallment', { amount: formatClp(total) })}</option>
                            <option>{t('payment.moreInstallments')}</option>
                        </select>
                    </div>
                    {savedCard && (
                        <button
                            type="button"
                            onClick={() => onChange({ method: 'saved-card', cvv: '' })}
                            className="inline-flex min-h-11 items-center self-start text-sm font-bold text-pj-basil underline underline-offset-4">
                            {t('payment.useSaved')}
                        </button>
                    )}
                </div>
            )}

            {values.method === 'cash' && (
                <p
                    className="m-0 rounded-pj-card bg-pj-dough p-3 text-[15px] text-pj-ink"
                    data-testid="pj-pay-cash-text">
                    {delivery ? t('payment.cashDeliveryText') : t('payment.cashPickupText')}
                </p>
            )}
        </StepCard>
    );
}

export default PaymentStep;
