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
/**
 * Loaders de los componentes de Page Designer de la Home (patrón del template: `product-tile/loaders.ts`).
 * Los componentes no importan `*.server` directamente: el build de producción lo prohíbe en el grafo del cliente.
 */
export { loadHeroBlock, loadProfileBlock, visibleFor } from '@/extensions/pj-home/lib/home-data.server';
export type { ProfileGate } from '@/extensions/pj-home/lib/home-data.server';
