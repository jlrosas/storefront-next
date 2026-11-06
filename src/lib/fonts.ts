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
import papaSansRegular from '/fonts/papa-sans-regular.woff2';
import papaSansCondensed from '/fonts/papa-sans-medium-condensed.woff2';

// Papa Sans Regular (texto) se precarga en <head> (root.tsx).
export const primaryFont = papaSansRegular;
// Papa Sans Medium Condensed (titulares), también precargada.
export const headingFont = papaSansCondensed;
