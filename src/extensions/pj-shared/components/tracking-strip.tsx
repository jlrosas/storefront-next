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
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { cn } from '@/lib/utils';
import { ChevronRightIcon, PizzaIcon } from './icons';

export interface TrackingStripProps {
    /** Estado en palabras: «En preparación», «Listo para retirar», «En camino». */
    status: string;
    /** Hora: «Listo 20:45» (móvil) / «listo a las 20:45» (escritorio, se compone con el estado). */
    eta: string;
    /** Paso actual de 1 a `steps` (barras llenas). */
    step: number;
    /** Total de pasos de la barra (3 en el lienzo). */
    steps?: number;
    /** Línea de detalle de escritorio: «PJ-48213 · Retiro en El Bosque · actualizado hace 1 min». */
    detail?: string;
    /** Destino «Ver seguimiento». */
    href: string;
    className?: string;
}

/**
 * Franja del pedido en curso (Menu-EnCurso.dc.html y Home-Desktop con Sofía en curso).
 * Móvil: tarjeta verde oscuro fija sobre la barra inferior. Escritorio: barra a lo ancho bajo el
 * encabezado. La posición la da el layout (UITarget `pj.layout.tracking`); SEG la llena.
 */
export function TrackingStrip({
    status,
    eta,
    step,
    steps = 3,
    detail,
    href,
    className,
}: TrackingStripProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    const bars = Array.from({ length: steps }, (_, index) => index);
    const progress = (
        <span
            aria-hidden="true"
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${steps}, minmax(0, 1fr))` }}>
            {bars.map((index) => (
                <span
                    key={index}
                    className={cn(
                        'h-1 rounded-full lg:h-[5px]',
                        index < step - 1 ? 'bg-pj-pepperoncini' : index === step - 1 ? 'bg-pj-dough' : 'bg-pj-dough/25'
                    )}
                />
            ))}
        </span>
    );
    return (
        <Link
            to={href}
            aria-label={`${t('tracking.inProgress')}: ${status}, ${eta}. ${t('tracking.viewTracking')}`}
            data-testid="pj-tracking-strip"
            className={cn(
                'block bg-pj-basil text-pj-dough no-underline',
                'rounded-pj-card shadow-pj-strip lg:rounded-none lg:border-t lg:border-pj-dough/15 lg:shadow-none',
                className
            )}>
            {/* Móvil */}
            <span className="flex min-h-[54px] items-center gap-2.5 px-3 py-2 lg:hidden">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-pj-pepperoncini text-pj-basil">
                    <PizzaIcon size={20} strong />
                </span>
                <span className="flex flex-1 flex-col gap-1">
                    <span className="flex justify-between text-sm">
                        <strong>{status}</strong>
                        <span className="font-bold text-pj-pepperoncini">{eta}</span>
                    </span>
                    {progress}
                </span>
                <ChevronRightIcon size={18} />
            </span>
            {/* Escritorio */}
            <span className="mx-auto hidden max-w-[1200px] items-center gap-4 px-6 py-2.5 lg:flex">
                <span className="rounded-full bg-pj-pepperoncini px-2.5 py-1 text-xs font-extrabold uppercase tracking-[0.5px] text-pj-basil">
                    {t('tracking.inProgress')}
                </span>
                <strong className="text-base">
                    {status} · {eta}
                </strong>
                <span className="w-[220px]">{progress}</span>
                <span className="flex-1 text-sm opacity-85">{detail}</span>
                <span className="font-bold text-pj-pepperoncini">{t('tracking.viewTracking')}</span>
            </span>
        </Link>
    );
}

export default TrackingStrip;
