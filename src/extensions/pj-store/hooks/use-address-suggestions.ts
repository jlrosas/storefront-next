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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useConfig } from '@salesforce/storefront-next-runtime/config';
import { useGoogleMaps } from '@/providers/google-maps-context';
import { filterSampleAddresses, type SampleAddress } from '../lib/delivery-zones';

export interface AddressChoice {
    /** `Av. Providencia 1234`. */
    main: string;
    /** `Providencia, Región Metropolitana`. */
    sub: string;
    resolve: () => Promise<{ latitude: number; longitude: number; communes: string[] } | null>;
}

interface PlaceLike {
    location?: { lat: () => number; lng: () => number } | null;
    addressComponents?: Array<{ longText?: string }> | null;
    fetchFields: (options: { fields: string[] }) => Promise<unknown>;
}

interface SuggestionLike {
    placePrediction: { text: { text: string }; toPlace: () => PlaceLike };
}

interface AutocompleteLike {
    AutocompleteSessionToken: new () => object;
    AutocompleteSuggestion: {
        fetchAutocompleteSuggestions: (request: Record<string, unknown>) => Promise<{ suggestions: SuggestionLike[] }>;
    };
}

/** Si Google no carga en este tiempo, se cae al buscador simple. */
const GOOGLE_LOAD_TIMEOUT_MS = 4500;
const DEBOUNCE_MS = 250;

function fromSample(sample: SampleAddress): AddressChoice {
    return {
        main: sample.main,
        sub: sample.sub,
        resolve: () =>
            Promise.resolve({
                latitude: sample.latitude,
                longitude: sample.longitude,
                communes: [...sample.communes],
            }),
    };
}

export interface AddressSuggestions {
    suggestions: AddressChoice[];
    /** `google` con Places; `simple` con las 3 direcciones de ejemplo (sin llave o sin respuesta). */
    mode: 'google' | 'simple';
    /** Se llama al enfocar el campo: carga Google solo cuando hace falta. */
    activate: () => void;
}

/**
 * Sugerencias de dirección (TIE-02). Usa Google Places como el checkout del template; si no hay
 * llave, no carga a tiempo o falla una consulta, cae al buscador simple con 3 direcciones de
 * ejemplo sin romper la pantalla.
 */
export function useAddressSuggestions(query: string): AddressSuggestions {
    const config = useConfig();
    const hasKey = Boolean(config?.features?.googleCloudAPI?.apiKey);
    const { places, activate: activateMaps } = useGoogleMaps();
    const [failed, setFailed] = useState(false);
    const [timedOut, setTimedOut] = useState(false);
    const [googleSuggestions, setGoogleSuggestions] = useState<AddressChoice[]>([]);
    const tokenRef = useRef<object | null>(null);
    const activatedRef = useRef(false);

    const activate = useCallback(() => {
        if (!hasKey || activatedRef.current) return;
        activatedRef.current = true;
        activateMaps();
    }, [hasKey, activateMaps]);

    useEffect(() => {
        if (!hasKey || places || !activatedRef.current) return;
        const timer = setTimeout(() => setTimedOut(true), GOOGLE_LOAD_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, [hasKey, places, query]);

    const mode: 'google' | 'simple' = hasKey && !failed && !(timedOut && !places) ? 'google' : 'simple';

    useEffect(() => {
        if (mode !== 'google' || !places || query.trim().length < 3) {
            setGoogleSuggestions([]);
            return;
        }
        let cancelled = false;
        const timer = setTimeout(() => {
            const lib = places as unknown as AutocompleteLike;
            tokenRef.current ??= new lib.AutocompleteSessionToken();
            lib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
                input: query,
                includedRegionCodes: ['cl'],
                language: 'es',
                sessionToken: tokenRef.current,
            })
                .then(({ suggestions }) => {
                    if (cancelled) return;
                    setGoogleSuggestions(
                        suggestions.slice(0, 5).map((suggestion) => {
                            const text = suggestion.placePrediction.text.text;
                            const parts = text.split(',').map((p) => p.trim());
                            return {
                                main: parts[0] || text,
                                sub: parts
                                    .slice(1)
                                    .filter((p) => p.toLowerCase() !== 'chile')
                                    .join(', '),
                                resolve: async () => {
                                    try {
                                        const place = suggestion.placePrediction.toPlace();
                                        await place.fetchFields({ fields: ['location', 'addressComponents'] });
                                        tokenRef.current = null;
                                        if (!place.location) return null;
                                        const communes = (place.addressComponents ?? [])
                                            .map((c) => c.longText ?? '')
                                            .filter(Boolean);
                                        return {
                                            latitude: place.location.lat(),
                                            longitude: place.location.lng(),
                                            communes,
                                        };
                                    } catch {
                                        setFailed(true);
                                        return null;
                                    }
                                },
                            };
                        })
                    );
                })
                .catch(() => {
                    if (!cancelled) setFailed(true);
                });
        }, DEBOUNCE_MS);
        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [mode, places, query]);

    const suggestions =
        mode === 'google' ? googleSuggestions : filterSampleAddresses(query).map((sample) => fromSample(sample));
    return { suggestions, mode, activate };
}
