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
/** @sfdc-extension-file SFDC_EXT_PJ_OFFERS */
import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import StoreLocatorList from '@/extensions/store-locator/components/store-locator/list';
import { useStoreLocator } from '@/extensions/store-locator/providers/store-locator';
import { DEFAULT_CENTER } from '../hooks/use-stores-near';

/**
 * Página «Locales» (enlaces del encabezado y del footer): el `store-locator` del template con las
 * tiendas reales de Papa Johns. Las tiendas de Chile no tienen código postal en Commerce, así que
 * en lugar del formulario país + código postal se parte con las más cercanas al centro de
 * Santiago y «Usar mi ubicación» las reordena desde donde está la persona.
 */
export default function LocalesPage(): ReactElement {
    const { t } = useTranslation('extPjStore');
    const config = useStoreLocator((s) => s.config);
    const setDeviceCoordinates = useStoreLocator((s) => s.setDeviceCoordinates);
    const setGeoError = useStoreLocator((s) => s.setGeoError);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        setDeviceCoordinates({ latitude: DEFAULT_CENTER.latitude, longitude: DEFAULT_CENTER.longitude });
    }, [setDeviceCoordinates]);

    const useMyLocation = useCallback(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            setGeoError(true);
            return;
        }
        setLocating(true);
        setGeoError(false);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocating(false);
                setDeviceCoordinates({ latitude: position.coords.latitude, longitude: position.coords.longitude });
            },
            () => {
                setLocating(false);
                setGeoError(true);
            },
            { timeout: config.geoTimeout }
        );
    }, [config.geoTimeout, setDeviceCoordinates, setGeoError]);

    return (
        <section aria-labelledby="pj-locales-heading" className="mx-auto w-full max-w-[860px] px-4 py-6 lg:py-10">
            <h1 id="pj-locales-heading" className="text-3xl lg:text-5xl">
                {t('locales.title')}
            </h1>
            <p className="mt-1 text-pj-gray">{t('locales.subtitle')}</p>
            <button
                type="button"
                onClick={useMyLocation}
                disabled={locating}
                className="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full bg-pj-green px-5 text-[15px] font-bold text-pj-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green disabled:opacity-60 lg:w-auto">
                {locating ? t('pickup.locating') : t('pickup.useLocation')}
            </button>
            <StoreLocatorList />
        </section>
    );
}
