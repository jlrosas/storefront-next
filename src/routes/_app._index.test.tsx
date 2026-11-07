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
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { ShopperExperience } from '@/scapi';
import HomePage, { type HomePageData, loader } from './_app._index';
import { createTestContext } from '@/lib/test-utils';
import { fetchPageWithComponentData } from '@/lib/page-designer/page-loader.server';
import { getConfig } from '@salesforce/storefront-next-runtime/config';
import type { AppConfig } from '@/types/config';
import { pjDemoContext } from '@/extensions/pj-shared/lib/profile';
import { loadHomeData } from '@/extensions/pj-home/lib/home-data.server';
import type { HomeData, OfferVM } from '@/extensions/pj-home/lib/types';

/**
 * Ruta de la Home de Papa Johns (HOM). Reemplaza a la portada del template, así que esta prueba
 * reemplaza a la del template: valida que la región \`home\` de Page Designer manda y que, sin
 * contenido, se muestra la composición por defecto del perfil.
 */
const { regionRenderSpy } = vi.hoisted(() => ({ regionRenderSpy: vi.fn() }));

vi.mock('@/components/region', () => ({
    Region: (props: any) => {
        regionRenderSpy(props);
        return <>{props.errorElement}</>;
    },
}));

vi.mock('@/components/link', () => ({
    Link: ({ to, children, ...rest }: any) => (
        <a href={typeof to === 'string' ? to : '#'} {...rest}>
            {children}
        </a>
    ),
}));

vi.mock('@/components/seo-meta', () => ({ SeoMeta: () => null }));
vi.mock('@/lib/decorators/page-type', () => ({ PageType: () => (target: any) => target }));
vi.mock('@/lib/decorators/region-definition', () => ({
    RegionDefinition: () => (target: any) => target,
    getRegionDefinition: vi.fn(() => ({ id: 'home' })),
}));
vi.mock('@/lib/page-designer/page-loader.server', () => ({ fetchPageWithComponentData: vi.fn() }));
vi.mock('@/extensions/pj-home/lib/home-data.server', () => ({ loadHomeData: vi.fn() }));
vi.mock('@/lib/logger.server', () => ({
    getLogger: vi.fn(() => ({ error: vi.fn(), warn: vi.fn(), info: vi.fn(), debug: vi.fn() })),
}));
vi.mock('@salesforce/storefront-next-runtime/config', async (importOriginal) => {
    const actual = await importOriginal<object>();
    return { ...actual, getConfig: vi.fn() };
});
vi.mock('react-router', async (importOriginal) => {
    const actual = await importOriginal<object>();
    return { ...actual, useFetcher: () => ({ state: 'idle', data: undefined, submit: vi.fn() }) };
});
vi.mock('@/hooks/use-navigate', () => ({ useNavigate: () => vi.fn() }));
vi.mock('@/extensions/pj-shared/hooks/use-reduced-motion', () => ({ useReducedMotion: () => true }));

const season: OfferVM = {
    id: 'cb-pizza-del-mes',
    name: 'Pizza del Mes The Works Familiar',
    price: 10990,
    listPrice: 21900,
    image: 'https://example.com/the-works.jpg',
    imageAlt: 'The Works',
    serves: 'Para 3–4',
    sensory: 'Todo lo bueno.',
    href: '/p/cb-pizza-del-mes',
};

const base: HomeData = {
    profile: 'valentina',
    moment: 'partido',
    hero: season,
    month: null,
    popular: [
        {
            id: 'pz-pollo-bbq',
            name: 'Pollo BBQ',
            badge: 'mas-pedida',
            rating: 4.7,
            weekly: 320,
            sensory: null,
            familyPrice: 16900,
            image: 'https://example.com/a.jpg',
            imageAlt: 'Pollo BBQ',
            href: '/p/pz-pollo-bbq',
        },
        {
            id: 'pz-x',
            name: 'Poco pedida',
            badge: null,
            rating: 4.1,
            weekly: 40,
            sensory: null,
            familyPrice: 9900,
            image: 'https://example.com/b.jpg',
            imageAlt: 'Poco pedida',
            href: '/p/pz-x',
        },
    ],
    occasions: [],
    moments: [],
    sofia: null,
};

const createPage = (regions: any[] = []) =>
    ({ id: 'homepage', typeId: 'homepage', regions }) as ShopperExperience.schemas['Page'];

const renderHome = (overrides: Partial<HomePageData> = {}) =>
    render(
        <HomePage
            loaderData={{
                page: { ...createPage(), componentData: {} },
                home: base,
                profile: 'valentina',
                pageUrl: 'http://localhost/',
                ...overrides,
            }}
        />
    );

describe('Home de Papa Johns', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(getConfig).mockReturnValue({ url: { prefix: '' } } as unknown as AppConfig);
        vi.mocked(fetchPageWithComponentData).mockResolvedValue({ ...createPage(), componentData: {} });
        vi.mocked(loadHomeData).mockResolvedValue(base);
    });

    test('pide la región home como crítica (hero = LCP)', () => {
        renderHome();
        expect(regionRenderSpy).toHaveBeenCalledWith(expect.objectContaining({ regionId: 'home', critical: true }));
    });

    test('Valentina: hero de la Pizza del Mes con precio y antes como texto, botón a la ficha', () => {
        renderHome();
        expect(
            screen.getByRole('heading', { level: 1, name: /Pizza del Mes The Works Familiar/i })
        ).toBeInTheDocument();
        expect(screen.getAllByText('$10.990').length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Antes desde \$21\.900/).length).toBeGreaterThan(0);
        expect(screen.getByRole('link', { name: 'Lo quiero · $10.990' })).toHaveAttribute(
            'href',
            '/p/cb-pizza-del-mes'
        );
        expect(screen.getByText('¡Volviste!')).toBeInTheDocument();
    });

    test('«N esta semana» solo si N ≥ 100', () => {
        renderHome();
        expect(screen.getByText(/320 esta semana/)).toBeInTheDocument();
        expect(screen.queryByText(/40 esta semana/)).not.toBeInTheDocument();
    });

    test('los beneficios no prometen «sin crear cuenta» (S-D13)', () => {
        renderHome();
        expect(screen.queryByText(/sin crear cuenta/i)).not.toBeInTheDocument();
        expect(screen.getByText('Ves tu pizza salir del horno')).toBeInTheDocument();
    });

    test('Diego: la oferta del anuncio y «Para 3» como botón que agrega las tres líneas', () => {
        const diego: HomeData = {
            ...base,
            profile: 'diego',
            hero: {
                ...season,
                id: 'cb-super-duo',
                name: 'Super Dúo',
                price: 22590,
                listPrice: 27800,
                href: '/promos/super-duo',
            },
            occasions: [
                {
                    key: 'para-3',
                    name: 'x',
                    price: 20470,
                    listPrice: null,
                    image: 'https://example.com/c.jpg',
                    imageAlt: 'Para 3',
                    href: null,
                    lines: [{ productId: 'cb-pizza-del-mes', name: 'The Works', price: 10990 }],
                },
                {
                    key: 'para-4',
                    name: 'Super Dúo',
                    price: 22590,
                    listPrice: 27800,
                    image: 'https://example.com/d.jpg',
                    imageAlt: 'Super Dúo',
                    href: '/promos/super-duo',
                },
            ],
            moments: [{ id: 'partido', offer: { ...season, name: 'Super Trío', href: '/promos/super-trio' } }],
        };
        renderHome({ home: diego, profile: 'diego' });
        expect(screen.getByRole('heading', { level: 1, name: 'Super Dúo' })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /^Armar mi Super Dúo · \$/ })).toHaveAttribute(
            'href',
            '/promos/super-duo'
        );
        expect(screen.getByRole('button', { name: /Para 3/ })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /Para 4/ })).toHaveAttribute('href', '/promos/super-duo');
        expect(screen.getByRole('link', { name: /Para ver el partido/ })).toHaveAttribute('href', '/promos/super-trio');
    });

    test('Sofía: saludo, saldo y «Repetir pedido» con el total', () => {
        const sofia: HomeData = {
            ...base,
            profile: 'sofia',
            sofia: {
                firstName: 'Sofía',
                points: 340,
                live: true,
                lastOrder: {
                    orderNo: '1',
                    placedAt: '2026-10-02T20:30:00.000Z',
                    total: 23890,
                    summary: 'Pollo BBQ Familiar sin cebolla + Palitos de Ajo',
                    heroImage: 'https://example.com/e.jpg',
                    heroAlt: 'Pollo BBQ',
                    thumbs: [],
                    storeLabel: 'El Bosque',
                },
                favorites: [],
                redeem: {
                    id: 'pz-super-pepperoni',
                    name: 'Super Pepperoni',
                    image: 'https://example.com/f.jpg',
                    points: 260,
                },
            },
        };
        renderHome({ home: sofia, profile: 'sofia' });
        expect(screen.getAllByText(/Hola, Sofía/i).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /340 Papa Puntos, equivalen a \$17\.000/ }).length).toBeGreaterThan(
            0
        );
        expect(screen.getByRole('button', { name: /Repetir pedido/ })).toHaveTextContent('$23.890');
        expect(screen.getByText('Super Pepperoni mediana')).toBeInTheDocument();
    });

    describe('loader', () => {
        const makeArgs = (profile: 'valentina' | 'diego' | 'sofia') => {
            const context = createTestContext();
            context.set(pjDemoContext, {
                forcedProfile: profile,
                forcedMoment: null,
                campaign: null,
                pathname: '/',
                isRegistered: false,
            });
            return { request: new Request('http://localhost/cl/es-CL/'), context, params: {} } as unknown as Parameters<
                typeof loader
            >[0];
        };

        test('sin contenido en Page Designer carga los datos del perfil', async () => {
            const result = await loader(makeArgs('diego'));
            expect(loadHomeData).toHaveBeenCalledWith(expect.objectContaining({ profile: 'diego' }));
            expect(result.home).toEqual(base);
            expect(result.profile).toBe('diego');
        });

        test('con componentes en la región home manda Page Designer y no se cargan datos', async () => {
            vi.mocked(fetchPageWithComponentData).mockResolvedValue({
                ...createPage([{ id: 'home', components: [{ id: 'hero-1', typeId: 'Content.pjHeroFood' }] }]),
                componentData: {},
            });
            const result = await loader(makeArgs('valentina'));
            expect(loadHomeData).not.toHaveBeenCalled();
            expect(result.home).toBeNull();
        });
    });
});
