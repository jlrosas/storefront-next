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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */
import { type ReactElement, Suspense, lazy, useState } from 'react';
import type { PizzaSheetProps } from './pizza-sheet';

const LazyPizzaSheet = lazy(() => import('./pizza-sheet'));

/**
 * Hoja «Arma tu pizza» con carga diferida (regla de overlays del template): el código de la hoja no se
 * descarga hasta la primera vez que `open` es `true`, y después queda montada para animar el cierre.
 *
 * @example
 * // MEN · «Agregar» en una pizza
 * <PizzaSheet productId="pz-pollo-bbq" open={open} onOpenChange={setOpen} />
 * // MEN · «½ Mitad»
 * <PizzaSheet productId="pz-pollo-bbq" halfFirst open={open} onOpenChange={setOpen} />
 * // CAR · «Editar» en una línea de pizza
 * <PizzaSheet productId={item.productId} itemId={item.itemId} open={open} onOpenChange={setOpen} />
 */
export function PizzaSheet(props: PizzaSheetProps): ReactElement | null {
    const [mounted, setMounted] = useState(props.open);
    if (props.open && !mounted) setMounted(true);
    if (!mounted) return null;
    return (
        <Suspense fallback={null}>
            <LazyPizzaSheet {...props} />
        </Suspense>
    );
}

export type { PizzaSheetProps };
export default PizzaSheet;
