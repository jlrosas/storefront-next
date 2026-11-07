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
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PjNotFoundPage } from '../not-found-page';
import { withSitePrefix } from '../../lib/not-found';

describe('withSitePrefix', () => {
    it('une el prefijo del sitio con las rutas de la demo', () => {
        expect(withSitePrefix('/cl/es-CL/', '/menu')).toBe('/cl/es-CL/menu');
        expect(withSitePrefix('/cl/es-CL', '/')).toBe('/cl/es-CL/');
        expect(withSitePrefix('/', '/promos')).toBe('/promos');
        expect(withSitePrefix('/', '/')).toBe('/');
    });
});

describe('PjNotFoundPage (INT-10)', () => {
    it('ofrece el menú, las promos y el inicio con el prefijo del sitio, y una foto de comida', () => {
        render(<PjNotFoundPage homepageUrl="/cl/es-CL/" />);
        const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
        expect(hrefs).toEqual(expect.arrayContaining(['/cl/es-CL/menu', '/cl/es-CL/promos', '/cl/es-CL/']));
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        const photo = screen.getAllByRole('img').find((img) => img.getAttribute('srcset'));
        expect(photo?.getAttribute('src')).toContain('super-pepperoni');
        expect(screen.getByTestId('error-page')).toHaveAttribute('data-pj-not-found', 'true');
    });
});
