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

/**
 * API pública de PRO para los demás agentes (MEN, CAR, HOM). Seguro en cliente; lo de servidor se
 * importa por su ruta (`lib/halves.server`, `lib/pizza.server`).
 */
export { PizzaSheet, type PizzaSheetProps } from './components/pizza-sheet-launcher';
export { HalvesBuilder, type HalvesBuilderProps } from './components/halves-builder';
export { SplitPizzaImage, type SplitPizzaImageProps } from './components/split-pizza-image';
export { HalvesLineSummary, type HalvesLineSummaryProps } from './components/halves-line-summary';
export {
    HALVES_PRODUCT_ID,
    HALVES_ROUTE,
    halvesHref,
    halvesLabel,
    isHalvesItem,
    parseHalves,
    type HalvesBuilderData,
} from './lib/halves';
export { isConfigurablePizza, removedFromItem, extrasFromItem, EXTRA_OPTION_PREFIX } from './lib/pizza';
export { PJ_CART_ACTION, type PjCartPayload, type PjCartResult } from './lib/cart-payload';
export {
    PJ_FULFILLMENT_EVENTS,
    ensureFulfillment,
    requestFulfillmentPanel,
    waitForFulfillment,
} from './lib/fulfillment-request';
export { usePjCart } from './hooks/use-pj-cart';
export { PizzaAddedToast, useShowAddedToast } from './components/pizza-added-toast';
