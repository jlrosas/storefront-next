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
import { useEffect } from 'react';
import { useFetcher, useRouteLoaderData } from 'react-router';
import { useAuth } from '@/providers/auth';
import type { PjMe } from '../routes/resource.pj-me';
import type { DemoProfile } from '../lib/profile';
import { resolveHeaderAccount, type HeaderAccount } from '../lib/persona';

export const PJ_ME_RESOURCE = '/resource/pj-me';

/**
 * Nombre y Papa Puntos del cliente con sesión (saludo del encabezado). Sin sesión no pide nada.
 * Se carga después de hidratar porque el layout no revalida su loader al ingresar o salir; el
 * saludo no es contenido crítico y su espacio está reservado.
 */
export function usePjMe(): PjMe | null {
    const session = useAuth();
    const registered = session?.userType === 'registered';
    const customerId = session?.customerId ?? null;
    const fetcher = useFetcher<PjMe>({ key: 'pj-me' });
    const { load } = fetcher;
    useEffect(() => {
        if (registered) {
            void load(PJ_ME_RESOURCE);
        }
    }, [registered, customerId, load]);
    return registered ? (fetcher.data ?? null) : null;
}

/** Perfil forzado con `?perfil=` que entrega el loader de `root` (INT-08). */
export function usePjDemoProfile(): DemoProfile | null {
    return useRouteLoaderData<{ pjDemoProfile?: DemoProfile | null }>('root')?.pjDemoProfile ?? null;
}

/**
 * Quién aparece en el encabezado y en «Cuenta» de la barra inferior: el cliente con sesión, el
 * cliente de demo del perfil forzado (`?perfil=`) o el invitado. El perfil forzado llega en el
 * HTML del servidor, así que el saludo de demo se pinta sin parpadeo (INT-08).
 */
export function usePjHeaderAccount(): HeaderAccount {
    const me = usePjMe();
    const demoProfile = usePjDemoProfile();
    return resolveHeaderAccount({ me, demoProfile });
}
