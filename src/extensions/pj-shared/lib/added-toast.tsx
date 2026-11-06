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
/** @sfdc-extension-file SFDC_EXT_PJ_HOME */
/** @sfdc-extension-file SFDC_EXT_PJ_SHARED */
import { useCallback } from 'react';
import { toast } from 'sonner';
import { useNavigate } from '@/hooks/use-navigate';
import { AddedToast, type AddedToastProps } from '../components/added-toast';
import { PJ_ROUTES } from './routes';
import { flyToCart } from './fly-to-cart';

/** Clase del toast propio: quita el estilo de los avisos del template (ver theme/overrides/sonner.css). */
export const PJ_TOAST_CLASS = 'pj-toast';

/**
 * Muestra el aviso «¡Agregada!» con el Toaster global (arriba, bajo el encabezado).
 * `onViewOrder` es obligatorio: el Toaster está fuera de los providers del sitio, así que la
 * navegación la resuelve quien llama. Lo normal es usar `useShowAddedToast()`.
 */
export function showAddedToast(props: Omit<AddedToastProps, 'onDismiss'>, duration = 6000): string | number {
    // VIS-05: la foto vuela al carrito y el contador salta (nada con «reducir movimiento»).
    void flyToCart();
    return toast.custom((id) => <AddedToast {...props} onDismiss={() => toast.dismiss(id)} />, {
        duration,
        className: PJ_TOAST_CLASS,
    });
}

export type ShowAddedToastOptions = Omit<AddedToastProps, 'onDismiss' | 'onViewOrder'> & {
    /** Destino de «Ver mi pedido» (por defecto /cart). */
    orderHref?: string;
    duration?: number;
};

/**
 * Hook para mostrar el aviso desde cualquier ruta:
 * `const showAdded = useShowAddedToast(); showAdded({ productName, points: pointsFor(total), onUndo })`.
 * «Ver mi pedido» navega con el `useNavigate` del template (con prefijo de sitio).
 */
export function useShowAddedToast(): (options: ShowAddedToastOptions) => string | number {
    const navigate = useNavigate();
    return useCallback(
        ({ orderHref = PJ_ROUTES.cart, duration, ...props }: ShowAddedToastOptions) =>
            showAddedToast({ ...props, onViewOrder: () => void navigate(orderHref) }, duration),
        [navigate]
    );
}
