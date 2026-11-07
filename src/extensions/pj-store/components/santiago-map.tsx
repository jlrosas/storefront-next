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
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { projectToMap } from '../lib/locales-groups';
import { shortStoreName, type PjStore } from '../lib/store-info';
import type { Coordinates } from '../hooks/use-stores-near';

const W = 400;
const H = 480;

interface SantiagoMapProps {
    stores: PjStore[];
    /** Tienda destacada («Tu tienda» o la más cercana): pin grande en Garlic + Basil con su nombre. */
    featuredId?: string | null;
    /** Tienda bajo el cursor o el foco en la lista: su pin crece. */
    activeId?: string | null;
    /** Punto desde el que se ordena («Estás aquí»). */
    center: Coordinates;
    /** Franja baja (móvil): recorta el mapa alrededor de «Estás aquí» en vez de mostrar Santiago entero. */
    band?: boolean;
    className?: string;
}

/**
 * Mapa de Santiago estilizado (UX-2 N5): un SVG estático con el Mapocho, la Alameda, Vespucio y
 * la cordillera, más un pin Basil por tienda en su latitud y longitud reales.
 *
 * Supuesto de demo: no se usa una API de mapas (ni teselas ni llave). En el proyecto se reemplaza
 * por el mapa del proveedor que elija Papa Johns.
 */
export function SantiagoMap({
    stores,
    featuredId,
    activeId,
    center,
    band = false,
    className,
}: SantiagoMapProps): ReactElement {
    const { t } = useTranslation('extPjStore');
    const here = projectToMap(center, W, H);
    // En la franja: 200 de alto desde un poco más arriba del centro (deja ver la píldora del destacado).
    const bandTop = Math.min(Math.max((here?.y ?? H / 2) - 105, 0), H - 200);
    const viewBox = band ? `0 ${bandTop} ${W} 200` : `0 0 ${W} ${H}`;
    const featured = stores.find((s) => s.id === featuredId);
    const featuredPoint = featured ? projectToMap(featured, W, H) : null;
    const featuredName = featured ? shortStoreName(featured.name) : '';
    // Píldora con el nombre: ~7,6 unidades por carácter a 14 de fuente, más el relleno.
    const labelWidth = featuredName.length * 7.6 + 24;
    const pins = stores
        .filter((s) => s.id !== featuredId)
        .map((store) => ({ store, point: projectToMap(store, W, H) }))
        .filter((p): p is { store: PjStore; point: { x: number; y: number } } => p.point !== null);

    return (
        <figure
            data-testid="pj-locales-map"
            className={cn('relative overflow-hidden bg-pj-dough-deep text-pj-basil', className)}>
            <svg
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid slice"
                role="img"
                aria-label={t('locales.mapLabel', { count: stores.length })}
                className="block size-full">
                {/* Manzanas: retícula suave */}
                <g className="stroke-pj-line" strokeWidth="1">
                    {Array.from({ length: 13 }, (_, i) => (
                        <line key={`v${i}`} x1={i * 34} y1="0" x2={i * 34 - 40} y2={H} />
                    ))}
                    {Array.from({ length: 15 }, (_, i) => (
                        <line key={`h${i}`} x1="0" y1={i * 34} x2={W} y2={i * 34 + 12} />
                    ))}
                </g>
                {/* Cordillera al oriente */}
                <path
                    d="M330 0 L400 0 L400 480 L372 480 C360 400 392 360 366 300 C344 250 380 200 352 150 C330 110 360 60 330 0 Z"
                    className="fill-pj-vine"
                    opacity="0.22"
                />
                {/* Cerro San Cristóbal */}
                <ellipse cx="190" cy="150" rx="26" ry="16" className="fill-pj-vine" opacity="0.35" />
                {/* Vespucio (anillo) */}
                <ellipse
                    cx="196"
                    cy="232"
                    rx="168"
                    ry="196"
                    fill="none"
                    className="stroke-pj-surface"
                    strokeWidth="7"
                    opacity="0.9"
                />
                {/* Alameda y Providencia */}
                <path
                    d="M0 218 C80 214 140 208 186 196 C232 184 268 168 330 140"
                    fill="none"
                    className="stroke-pj-surface"
                    strokeWidth="6"
                />
                {/* Autopista Central */}
                <path d="M146 0 C150 120 152 240 160 480" fill="none" className="stroke-pj-surface" strokeWidth="5" />
                {/* Río Mapocho */}
                <path
                    d="M0 176 C60 182 110 172 150 166 C200 158 240 150 290 112 C320 90 350 70 400 52"
                    fill="none"
                    className="stroke-pj-garlic"
                    strokeWidth="7"
                    strokeLinecap="round"
                />

                {/* Estás aquí */}
                {here && (
                    <g transform={`translate(${here.x} ${here.y})`}>
                        <circle r="16" className="fill-pj-basil" opacity="0.14" />
                        <circle r="6" className="fill-pj-surface stroke-pj-basil" strokeWidth="3" />
                    </g>
                )}

                {/* Pines Basil */}
                {pins.map(({ store, point }) => {
                    const on = store.id === activeId;
                    return (
                        <g
                            key={store.id}
                            data-testid={`pj-map-pin-${store.id}`}
                            transform={`translate(${point.x} ${point.y}) scale(${on ? 1.35 : 1})`}
                            className="transition-transform">
                            <path
                                d="M0 0 C-2 -6 -9 -10 -9 -17 A9 9 0 1 1 9 -17 C9 -10 2 -6 0 0 Z"
                                className={on ? 'fill-pj-basil-deep' : 'fill-pj-basil'}
                            />
                            <circle cy="-17" r="3.4" className="fill-pj-dough" />
                        </g>
                    );
                })}

                {/* «Tu tienda» / la más cercana: pin grande Garlic + Basil */}
                {featured && featuredPoint && (
                    <g data-testid="pj-map-pin-featured" transform={`translate(${featuredPoint.x} ${featuredPoint.y})`}>
                        <path
                            d="M0 0 C-3 -9 -14 -15 -14 -26 A14 14 0 1 1 14 -26 C14 -15 3 -9 0 0 Z"
                            className="fill-pj-garlic stroke-pj-basil"
                            strokeWidth="3"
                        />
                        <circle cy="-26" r="5.5" className="fill-pj-basil" />
                        <g transform="translate(0 -56)">
                            <rect
                                x={-labelWidth / 2}
                                y="-13"
                                width={labelWidth}
                                height="26"
                                rx="13"
                                className="fill-pj-basil"
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="fill-pj-dough font-bold"
                                fontSize="14">
                                {featuredName}
                            </text>
                        </g>
                    </g>
                )}
            </svg>
        </figure>
    );
}
