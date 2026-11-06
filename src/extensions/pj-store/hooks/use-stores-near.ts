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
import { useEffect, useState } from 'react';
import { resourceRoutes } from '@/route-paths';
import type { PjStore } from '../lib/store-info';

/** Punto de partida cuando la persona no comparte su ubicación: entre Providencia y Las Condes. */
export const DEFAULT_CENTER = { latitude: -33.4254, longitude: -70.6052 } as const;

export interface Coordinates {
    latitude: number;
    longitude: number;
}

/** Pide a `/resource/stores` (store-locator del template) las tiendas cerca de un punto, ordenadas por distancia. */
export async function fetchStoresNear(
    point: Coordinates,
    options: { radiusKm?: number; limit?: number; signal?: AbortSignal } = {}
): Promise<PjStore[]> {
    const params = new URLSearchParams({
        mode: 'device',
        latitude: String(point.latitude),
        longitude: String(point.longitude),
        maxDistance: String(options.radiusKm ?? 30),
        distanceUnit: 'km',
        limit: String(options.limit ?? 50),
    });
    const response = await fetch(`${resourceRoutes.stores}?${params.toString()}`, { signal: options.signal });
    if (!response.ok) throw new Error(`stores ${response.status}`);
    const body = (await response.json()) as { success?: boolean; stores?: { data?: PjStore[] } };
    if (body.success === false) throw new Error('stores error');
    return body.stores?.data ?? [];
}

export interface StoresNear {
    stores: PjStore[];
    loading: boolean;
    error: boolean;
}

/** Tiendas cerca de `point` (la ubicación de la persona o el centro por defecto). */
export function useStoresNear(point: Coordinates | null): StoresNear {
    const [state, setState] = useState<StoresNear>({ stores: [], loading: true, error: false });
    const latitude = point?.latitude;
    const longitude = point?.longitude;
    useEffect(() => {
        if (latitude === undefined || longitude === undefined) return;
        const controller = new AbortController();
        setState((prev) => ({ ...prev, loading: true, error: false }));
        fetchStoresNear({ latitude, longitude }, { signal: controller.signal })
            .then((stores) => setState({ stores, loading: false, error: false }))
            .catch((error: unknown) => {
                if ((error as Error)?.name === 'AbortError') return;
                setState({ stores: [], loading: false, error: true });
            });
        return () => controller.abort();
    }, [latitude, longitude]);
    return state;
}
