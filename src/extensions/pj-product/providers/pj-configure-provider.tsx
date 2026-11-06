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
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';
import { PizzaSheet } from '../components/pizza-sheet-launcher';
import { PJ_CONFIGURE_EVENT, sheetRequestFor, type PjConfigureDetail } from '../lib/configure-bridge';

/**
 * Provider global de PRO (`target-config.json` → `contextProviders`): atiende `pj:configure-product`
 * del menú (y de cualquier otra pantalla) y monta la hoja con carga diferida.
 */
export default function PjConfigureProvider({ children }: { children: ReactNode }): ReactElement {
    const [request, setRequest] = useState<{
        key: number;
        productId: string;
        halfFirst: boolean;
        size?: string;
    } | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onConfigure = (event: Event) => {
            const next = sheetRequestFor((event as CustomEvent<PjConfigureDetail>).detail);
            if (!next) return;
            event.preventDefault();
            setRequest({ ...next, key: Date.now() });
            setOpen(true);
        };
        window.addEventListener(PJ_CONFIGURE_EVENT, onConfigure);
        return () => window.removeEventListener(PJ_CONFIGURE_EVENT, onConfigure);
    }, []);

    return (
        <>
            {children}
            {request && (
                <PizzaSheet
                    key={request.key}
                    productId={request.productId}
                    halfFirst={request.halfFirst}
                    size={request.size}
                    open={open}
                    onOpenChange={setOpen}
                />
            )}
        </>
    );
}
