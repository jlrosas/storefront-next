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
import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
    if (typeof window === 'undefined' || !window.matchMedia) return () => undefined;
    const media = window.matchMedia(QUERY);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
}

function getSnapshot(): boolean {
    return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(QUERY).matches;
}

/** `true` si el sistema pide «reducir movimiento». En el servidor asume que sí (sin animar). */
export function useReducedMotion(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
