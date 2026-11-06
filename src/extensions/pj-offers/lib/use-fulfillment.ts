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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import { useEffect, useState } from 'react';
import type { Fulfillment } from '@/extensions/pj-shared/lib/fulfillment';
import { PJ_FULFILLMENT_EVENTS, readFulfillmentFromDocument } from './hooks-fulfillment';

/**
 * Modalidad elegida, viva en el cliente: parte del valor del servidor (sin parpadeo en SSR),
 * se relee de la cookie al hidratar y se actualiza con `pj:fulfillment-changed` (TIE u OFE).
 */
export function useFulfillment(initial: Fulfillment | null): Fulfillment | null {
    const [value, setValue] = useState<Fulfillment | null>(initial);
    useEffect(() => {
        setValue(readFulfillmentFromDocument());
        const onChange = () => setValue(readFulfillmentFromDocument());
        window.addEventListener(PJ_FULFILLMENT_EVENTS.changed, onChange);
        return () => window.removeEventListener(PJ_FULFILLMENT_EVENTS.changed, onChange);
    }, []);
    return value;
}
