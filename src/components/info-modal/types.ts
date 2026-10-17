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

import type { Ref } from 'react';

// @sfdc-extension-block-start SFDC_EXT_SHIPPING_DELIVERY
import type { ShippingEstimateOption } from '@/lib/shipping-estimate/types';
// @sfdc-extension-block-end SFDC_EXT_SHIPPING_DELIVERY

/**
 * Payment schedule data for installment payment modal
 */
export interface PaymentSchedule {
    /** Total purchase amount */
    totalAmount: number;
    /** Number of payments */
    numberOfPayments: number;
    /** Individual payment details */
    payments: Array<{
        /** Payment amount */
        amount: number;
        /** Due date or relative time (e.g., "Today", "2 weeks") */
        dueDate: string;
    }>;
}

/**
 * Step information for "How it works" sections
 */
export interface StepInfo {
    /** Step number */
    number: number;
    /** Step description text */
    text: string;
}

/** Shared fields for modal header */
interface InfoModalDataBase {
    title?: string;
    description?: string;
}

/** Data for payment schedule modal (e.g. Pay in 4) */
export interface PaymentScheduleModalData extends InfoModalDataBase {
    type: 'payment-schedule';
    paymentSchedule?: PaymentSchedule;
    steps?: StepInfo[];
    disclaimer?: string;
}

// @sfdc-extension-block-start SFDC_EXT_SHIPPING_DELIVERY
/** Data for destination-specific delivery options. */
export interface EstimatedDeliveryModalData extends InfoModalDataBase {
    type: 'estimated-delivery';
    contentTitle?: string;
    shippingOptions: ShippingEstimateOption[];
}

// @sfdc-extension-block-end SFDC_EXT_SHIPPING_DELIVERY

/**
 * Structured data for the info modal. Add new modal types by defining a new variant
 * (e.g. SizeGuideModalData) and extending this union.
 */
export type InfoModalData =
    // @sfdc-extension-block-start SFDC_EXT_SHIPPING_DELIVERY
    | EstimatedDeliveryModalData
    // @sfdc-extension-block-end SFDC_EXT_SHIPPING_DELIVERY
    | PaymentScheduleModalData;

export interface InfoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Called before Dialog restores focus after closing. */
    onCloseAutoFocus?: (event: Event) => void;
    /** Called before Dialog moves focus after opening. */
    onOpenAutoFocus?: (event: Event) => void;
    /** Optional reference to the modal title for caller-managed initial focus. */
    titleRef?: Ref<HTMLHeadingElement>;
    /** Modal data - structured data from adapter */
    data?: InfoModalData;
    /** Optional custom className for the dialog content */
    className?: string;
}
