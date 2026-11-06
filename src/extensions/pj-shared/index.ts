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
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */

/**
 * Piezas compartidas de la demo (CONTRATO §5). Seguras en cliente y servidor.
 * Lo de servidor se importa por su ruta: `middlewares/demo.server` y `routes/resource.pj-me`.
 */
export { PriceTag, type PriceTagProps } from './components/price-tag';
export { Stars, type StarsProps } from './components/stars';
export { PointsBadge, type PointsBadgeProps } from './components/points-badge';
export { FoodImage, type FoodImageProps } from './components/food-image';
export { BottomSheet, type BottomSheetProps } from './components/bottom-sheet';
export { AddedToast, type AddedToastProps } from './components/added-toast';
export { BottomNav, type BottomNavProps } from './components/bottom-nav';
export { FulfillmentChip, type FulfillmentChipProps } from './components/fulfillment-chip';
export { TrackingStrip, type TrackingStripProps } from './components/tracking-strip';
export { showAddedToast, useShowAddedToast, type ShowAddedToastOptions } from './lib/added-toast';
export * from './lib/events';
export * from './lib/points';
export * from './lib/format';
export * from './lib/profile';
export * from './lib/fulfillment';
export { cropForPhoto, ROW_COMBO_IDS, FOOD_IMAGE_CROP, type FoodImageCrop } from './lib/photo';
export { PJ_ROUTES, PJ_EXTERNAL_LINKS, PJ_BOTTOM_NAV_ROUTES, showsBottomNav } from './lib/routes';
export { PJ_TARGETS } from './lib/targets';
export { PJ_FEATURES } from './lib/features';
export { usePjPath, matchesPath } from './hooks/use-pj-path';
export { usePjMe } from './hooks/use-pj-me';
export { useReducedMotion } from './hooks/use-reduced-motion';
