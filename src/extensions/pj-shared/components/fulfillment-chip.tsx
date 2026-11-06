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

export interface FulfillmentChipProps {
    /** Línea chica de arriba: «Retiro · listo en 15 min» o «Retiro o delivery». */
    top: string;
    /** Línea fuerte de abajo: «El Bosque» o «Elige cómo lo quieres». */
    bottom: string;
    /** Destino al tocar (página de tienda). Si no hay, usar `onClick`. */
    to?: string;
    /** Acción al tocar (abrir la hoja de tienda) cuando no navega. */
    onClick?: () => void;
    className?: string;
}

/**
 * Chip de modalidad y tienda del encabezado verde (Home.dc.html y Home-Desktop.dc.html).
 * En móvil son dos líneas de texto que ocupan el espacio libre del encabezado; desde `lg`
 * va en una caja translúcida con borde. Lo llena TIE en el UITarget `pj.header.fulfillment`.
 */
export function FulfillmentChip({ top, bottom, to, onClick, className }: FulfillmentChipProps): ReactElement {
    const { t } = useTranslation('extPjShared');
    const classes = cn(
        'flex min-h-11 min-w-0 flex-col justify-center text-left text-header-foreground no-underline',
        'lg:rounded-pj-control lg:border lg:border-header-foreground/30 lg:bg-header-foreground/10 lg:px-3.5 lg:py-1',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-pepperoncini',
        className
    );
    const content = (
        <>
            <span className="truncate text-xs opacity-85">{top}</span>
            <span className="truncate text-[15px] font-bold lg:text-sm">{bottom}</span>
        </>
    );
    const label = t('fulfillment.changeAria', { label: `${top}, ${bottom}` });
    if (to) {
        return (
            <Link to={to} className={classes} aria-label={label} data-testid="pj-fulfillment-chip">
                {content}
            </Link>
        );
    }
    return (
        <button
            type="button"
            onClick={onClick}
            className={classes}
            aria-label={label}
            data-testid="pj-fulfillment-chip">
            {content}
        </button>
    );
}

export default FulfillmentChip;
