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
import { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useSite } from '@salesforce/storefront-next-runtime/site-context';
import { cn } from '@/lib/utils';
import type { InfoModalProps } from './types';

// Re-export types for convenience
export type {
    InfoModalData,
    InfoModalProps,
    PaymentSchedule,
    StepInfo,
    PaymentScheduleModalData,
    // @sfdc-extension-block-start SFDC_EXT_SHIPPING_DELIVERY
    EstimatedDeliveryModalData,
    // @sfdc-extension-block-end SFDC_EXT_SHIPPING_DELIVERY
} from './types';

import { PaymentScheduleModalContent } from './renderers/payment-schedule-modal-content';
// @sfdc-extension-block-start SFDC_EXT_SHIPPING_DELIVERY
import { EstimatedDeliveryModalContent } from './renderers/estimated-delivery-modal-content';
// @sfdc-extension-block-end SFDC_EXT_SHIPPING_DELIVERY

/** Escapes a string for safe use inside a RegExp. */
function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Returns the currency symbol for regex matching (e.g. USD -> $). Unknown codes fall back to $. */
function getCurrencySymbolForRegex(currencyCode: string): string {
    const map: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: '$', AUD: '$' };
    return map[currencyCode?.toUpperCase()] ?? '$';
}

/** Modal width classes by modal type. */
const MODAL_WIDTH_CLASSES: Record<string, string> = {
    'payment-schedule': 'max-w-2xl sm:max-w-2xl',
    // @sfdc-extension-block-start SFDC_EXT_SHIPPING_DELIVERY
    'estimated-delivery': 'max-w-2xl sm:max-w-2xl',
    // @sfdc-extension-block-end SFDC_EXT_SHIPPING_DELIVERY
};

/** Modal description i18n keys by modal type. */
const MODAL_DESCRIPTIONS: Record<string, string> = {
    'payment-schedule': 'paymentScheduleDescription',
    // @sfdc-extension-block-start SFDC_EXT_SHIPPING_DELIVERY
    'estimated-delivery': 'estimatedDeliveryDescription',
    // @sfdc-extension-block-end SFDC_EXT_SHIPPING_DELIVERY
};

/**
 * InfoModal is a generic, reusable modal component that displays informational content.
 *
 * This modal accepts structured data from adapters and handles all rendering logic internally.
 * It supports payment schedule (e.g. Pay in 4) content from adapters.
 *
 * The adapter should return plain data (not React components), and this modal transforms
 * that data into the appropriate UI structure.
 *
 * @param props - Component props
 * @param props.open - Whether the modal is open
 * @param props.onOpenChange - Callback when modal open state changes
 * @param props.data - Structured modal data from adapter
 * @param props.className - Optional custom className for the dialog content
 * @returns ReactElement
 */
export default function InfoModal({
    open,
    onOpenChange,
    onCloseAutoFocus,
    onOpenAutoFocus,
    titleRef,
    data,
    className,
}: InfoModalProps): ReactElement {
    const { currency } = useSite();
    const { t } = useTranslation('infoModal');

    if (!data) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent
                    className={className}
                    onCloseAutoFocus={onCloseAutoFocus}
                    onOpenAutoFocus={onOpenAutoFocus}>
                    <DialogHeader>
                        <DialogTitle>Information</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="mt-4">No data available.</DialogDescription>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(MODAL_WIDTH_CLASSES[data.type], 'gap-0 p-0 border-0', className)}
                onCloseAutoFocus={onCloseAutoFocus}
                onOpenAutoFocus={onOpenAutoFocus}>
                <DialogDescription className="sr-only">
                    {t(MODAL_DESCRIPTIONS[data.type] ?? 'paymentScheduleDescription', '')}
                </DialogDescription>
                {data.type === 'payment-schedule' && (
                    <>
                        <DialogHeader className="p-6 pt-8 pb-0 pr-12 text-left">
                            {data.title != null && (
                                <DialogTitle className="text-2xl font-semibold text-foreground">
                                    {data.title}
                                </DialogTitle>
                            )}
                        </DialogHeader>
                        <div className="mt-4 border-b border-muted-foreground/25" aria-hidden />
                        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                            <div className="p-6 space-y-6">
                                {data.description != null
                                    ? (() => {
                                          const desc = data.description;
                                          const symbol = escapeRegex(getCurrencySymbolForRegex(currency));
                                          const amountPattern = new RegExp(`^(.*?)(${symbol}\\d[\\d,.]*)(.*)$`);
                                          const match = desc.match(amountPattern);
                                          if (match) {
                                              const [, before, amount, after] = match;
                                              return (
                                                  <p className="text-sm text-muted-foreground">
                                                      {before}
                                                      <strong className="font-semibold text-foreground">
                                                          {amount}
                                                      </strong>
                                                      {after}
                                                  </p>
                                              );
                                          }
                                          return <p className="text-sm text-muted-foreground">{desc}</p>;
                                      })()
                                    : null}
                                <PaymentScheduleModalContent
                                    paymentSchedule={data.paymentSchedule}
                                    steps={data.steps}
                                    disclaimer={data.disclaimer}
                                    currency={currency}
                                />
                            </div>
                        </div>
                        <div className="p-6 pt-4 border-t border-border">
                            <Button className="w-full" onClick={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </div>
                    </>
                )}
                {/* @sfdc-extension-block-start SFDC_EXT_SHIPPING_DELIVERY */}
                {data.type === 'estimated-delivery' && (
                    <>
                        <DialogHeader className="p-6 pt-8 pb-0 pr-12 text-left">
                            <DialogTitle
                                ref={titleRef}
                                tabIndex={-1}
                                className="text-2xl font-semibold text-foreground focus:outline-none">
                                {data.title}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 border-b border-muted-foreground/25" aria-hidden />
                        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                            <div className="p-6 space-y-6">
                                <EstimatedDeliveryModalContent
                                    contentTitle={data.contentTitle}
                                    shippingOptions={data.shippingOptions}
                                />
                            </div>
                            <div className="sticky bottom-0 border-t border-border bg-background p-6 pt-4">
                                <Button className="w-full" onClick={() => onOpenChange(false)}>
                                    {t('close')}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                {/* @sfdc-extension-block-end SFDC_EXT_SHIPPING_DELIVERY */}
            </DialogContent>
        </Dialog>
    );
}
