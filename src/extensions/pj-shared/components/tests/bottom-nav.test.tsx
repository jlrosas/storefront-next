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
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { getTranslation } from '@salesforce/storefront-next-runtime/i18n';
import { AllProvidersWrapper } from '@/test-utils/context-provider';
import { BottomNav } from '../bottom-nav';

const { t } = getTranslation();

function renderNav(currentPath: string, cartCount = 0) {
    const Stub = createRoutesStub([
        { path: '/', Component: () => <BottomNav currentPath={currentPath} cartCount={cartCount} /> },
    ]);
    return render(
        <AllProvidersWrapper>
            <Stub initialEntries={['/']} />
        </AllProvidersWrapper>
    );
}

describe('BottomNav (INT-02 · criterio 1)', () => {
    it('tiene cinco destinos con ícono y texto', async () => {
        renderNav('/');
        const nav = await screen.findByRole('navigation', { name: t('extPjShared:nav.label') });
        const links = nav.querySelectorAll('a');
        expect(links).toHaveLength(5);
        for (const key of ['home', 'menu', 'promos', 'order', 'account'] as const) {
            expect(screen.getByTestId(`pj-bottom-nav-${key}`).querySelector('svg')).not.toBeNull();
        }
        expect(screen.getByText(t('extPjShared:nav.home'))).toBeInTheDocument();
        expect(screen.getByText(t('extPjShared:nav.account'))).toBeInTheDocument();
    });

    it('marca el destino activo según la ruta', async () => {
        renderNav('/c/pizzas');
        expect(await screen.findByTestId('pj-bottom-nav-menu')).toHaveAttribute('aria-current', 'page');
        expect(screen.getByTestId('pj-bottom-nav-home')).not.toHaveAttribute('aria-current');
    });

    it('«Pedido» muestra la cantidad de productos', async () => {
        renderNav('/', 3);
        expect(await screen.findByTestId('pj-bottom-nav-count')).toHaveTextContent('3');
        expect(screen.getByTestId('pj-bottom-nav-order')).toHaveAccessibleName(
            t('extPjShared:nav.orderWithCount', { count: 3 })
        );
    });

    it('sin productos no muestra contador', async () => {
        renderNav('/');
        await screen.findByTestId('pj-bottom-nav');
        expect(screen.queryByTestId('pj-bottom-nav-count')).not.toBeInTheDocument();
    });
});
