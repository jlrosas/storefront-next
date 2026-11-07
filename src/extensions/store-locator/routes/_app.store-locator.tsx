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
 * PJ: la ruta vive en pj-store (título y página «Locales»). Se reexporta para que gane aunque este
 * template siga registrado; si se borra (#48), la de pj-store queda sola.
 */
// @sfdc-extension-line SFDC_EXT_PJ_STORE
export { default, meta } from '@/extensions/pj-store/routes/_app.store-locator';
