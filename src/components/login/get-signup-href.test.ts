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
import { describe, expect, test } from 'vitest';
import { getSignupHref } from './get-signup-href';

const returnUrlOf = (href: string) => new URL(href, 'http://localhost').searchParams.get('returnUrl');

describe('getSignupHref', () => {
    test('plain signup link when there is nowhere to go back to', () => {
        expect(getSignupHref()).toBe('/signup');
        expect(getSignupHref('/')).toBe('/signup');
    });

    test('keeps the returnUrl (cart → login → create account → checkout)', () => {
        expect(getSignupHref('/checkout')).toBe('/signup?returnUrl=%2Fcheckout');
    });

    test('folds a pending action into the returnUrl', () => {
        expect(returnUrlOf(getSignupHref('/product/123', 'addToWishlist'))).toBe('/product/123?action=addToWishlist');
    });
});
