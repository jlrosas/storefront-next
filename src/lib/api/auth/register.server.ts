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
import type { ActionFunctionArgs } from 'react-router';
import { ApiError, type ShopperCustomers } from '@/scapi';
import { getLogger } from '@/lib/logger.server';
import type { CustomQueryParameters } from '@/lib/api/types';
import { createApiClients } from '@/lib/api-clients.server';
import { loginRegisteredUser } from './standard-login.server';
import { getTranslation } from '@salesforce/storefront-next-runtime/i18n';

// Helper to extract custom parameters (keys starting with c_ with allowed value types)
const extractCustomParameters = (parameters: {
    [key: string]: string | number | boolean | string[] | number[];
}): CustomQueryParameters => {
    // oxlint-disable-next-line @typescript-eslint/no-unused-vars
    const { customer, password, ...customParams } = parameters;
    return customParams;
};

const LOGIN_ALREADY_IN_USE = /login[-_ ]?already[-_ ]?in[-_ ]?use|already (?:in use|registered|exists)/i;

export const isLoginAlreadyInUseError = (error: unknown): boolean => {
    if (!(error instanceof ApiError) || (error.status !== 400 && error.status !== 409)) {
        return false;
    }
    const { type = '', title = '', detail = '' } = error.body ?? {};
    return LOGIN_ALREADY_IN_USE.test(`${type} ${title} ${detail}`);
};
const describeRegistrationError = (error: unknown): Record<string, unknown> => {
    if (error instanceof ApiError) return { status: error.status, type: error.body?.type, title: error.body?.title };
    return { message: error instanceof Error ? error.message : String(error) };
};

export const registerCustomer = async (
    context: ActionFunctionArgs['context'],
    registrationData: ShopperCustomers.schemas['CustomerRegistration']
): Promise<{
    success: boolean;
    error?: string;
}> => {
    const { t } = getTranslation(context);
    const logger = getLogger(context);
    const genericError = { success: false, error: t('errors:genericTryAgain') };

    const { customer, password, ...parameters } = registrationData;
    const { login, firstName, lastName } = customer;
    const customParameters = extractCustomParameters(parameters);

    if (!login || !firstName || !lastName) {
        logger.warn('RegisterCustomer: missing required field');
        return genericError;
    }
    try {
        // The registerCustomer endpoint currently does not support custom parameters
        // so we make sure not to send any custom params here
        const clients = createApiClients(context);
        await clients.shopperCustomers.registerCustomer({
            params: {},
            body: {
                customer,
                password,
            },
        });
    } catch (error) {
        if (isLoginAlreadyInUseError(error)) {
            logger.warn('RegisterCustomer: login already in use');
            return { success: false, error: t('errors:customer.loginAlreadyInUse') };
        }
        logger.error('RegisterCustomer: registration failed', { error: describeRegistrationError(error) });
        return genericError;
    }

    const loginResult = await loginRegisteredUser(
        context,
        {
            email: login,
            password,
        },
        { customParameters }
    );
    if (!loginResult.success) {
        logger.error('RegisterCustomer: auto-login after registration failed');
        return { success: false, error: t('errors:autoLoginAfterRegistrationFailed') };
    }
    return { success: true };
};
