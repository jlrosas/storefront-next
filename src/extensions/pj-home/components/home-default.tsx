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
import type { ReactElement, ReactNode } from 'react';
import { Benefits, GreetingStrip, Popular, StartOrder } from './home-blocks';
import { Moments, Occasions } from './home-diego';
import { HomeHero } from './home-hero';
import { Favorites, MonthCard, RedeemCard, SofiaGreeting, UsualHero } from './home-sofia';
import type { HomeData } from '../lib/types';

function Main({ children }: { children: ReactNode }): ReactElement {
    return (
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 pt-6 lg:gap-11 lg:px-6 lg:pt-9">
            {children}
        </div>
    );
}

/**
 * Composición por defecto de la Home por perfil (lienzo `Home*`). La usa la ruta cuando la página
 * `homepage` de Page Designer no trae contenido para la región; con contenido, manda Page Designer
 * con estos mismos bloques (`src/components/pj-home`).
 */
export function HomeDefault({ data }: { data: HomeData }): ReactElement {
    if (data.profile === 'diego') {
        return (
            <>
                <HomeHero offer={data.hero} variant="ad" />
                <Main>
                    <Occasions items={data.occasions} />
                    <Moments items={data.moments} initial={data.moment} />
                    <Popular items={data.popular} best compact />
                </Main>
            </>
        );
    }
    if (data.profile === 'sofia' && data.sofia) {
        return (
            <>
                <SofiaGreeting sofia={data.sofia} />
                <div className="mt-[22px] lg:mt-0">
                    <UsualHero sofia={data.sofia} />
                </div>
                <Main>
                    <Favorites items={data.sofia.favorites} />
                    <div className="mx-4 flex flex-col gap-6 lg:mx-0 lg:flex-row lg:flex-wrap lg:gap-5">
                        <div className="lg:min-w-[360px] lg:flex-1">
                            <RedeemCard sofia={data.sofia} />
                        </div>
                        <MonthCard offer={data.month} />
                    </div>
                </Main>
            </>
        );
    }
    return (
        <>
            <GreetingStrip />
            <HomeHero offer={data.hero} variant="season" />
            <Main>
                <StartOrder />
                <Popular items={data.popular} />
                <Benefits />
            </Main>
        </>
    );
}

export default HomeDefault;
