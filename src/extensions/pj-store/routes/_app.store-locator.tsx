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
/** @sfdc-extension-file SFDC_EXT_PJ_STORE */
import type { ReactElement } from 'react';
import LocalesPage from '../components/locales-page';

/** Título de la pestaña (UX-2 N5: antes mostraba la URL). */
export function meta() {
    return [{ title: 'Locales | Papa Johns' }];
}

/**
 * `/store-locator` de Papa Johns («Locales»). El template `store-locator` registra la misma ruta y,
 * si sigue instalado, la reexporta desde aquí; si se borra (#48), esta queda como la única.
 */
export default function LocalesRoute(): ReactElement {
    return <LocalesPage />;
}
