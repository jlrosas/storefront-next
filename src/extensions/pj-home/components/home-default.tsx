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
import { useTranslation } from 'react-i18next';
import { Benefits, FirstOrderStrip, GreetingStrip, IntentRail, Popular, StartOrder } from './home-blocks';
import { Moments, Occasions } from './home-diego';
import { HomeHero } from './home-hero';
import { Favorites, MonthCard, RedeemCard, SofiaGreeting, UsualHero } from './home-sofia';
import type { HomeData } from '../lib/types';

function Main({ children }: { children: ReactNode }): ReactElement {
    return (
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 pt-8 lg:gap-16 lg:px-6 lg:pt-12">
            {children}
        </div>
    );
}

/**
 * Composición por defecto de la Home por perfil (lienzo `Home*`, ritmo de color de UX-1 §3.1). La usa la
 * ruta cuando la página `homepage` de Page Designer no trae contenido para la región; con contenido,
 * manda Page Designer con estos mismos bloques (`src/components/pj-home`).
 *
 * Ritmo (nunca dos bloques verdes seguidos): Valentina crema → verde (momentos) → crema → granate
 * (lealtad) → footer verde. Diego: crema → verde (momentos) → crema → footer. Sofía: crema → granate
 * (puntos) → crema → footer.
 */
export function HomeDefault({ data }: { data: HomeData }): ReactElement {
    const { t } = useTranslation('extPjHome');
    if (data.profile === 'diego') {
        return (
            <>
                <FirstOrderStrip />
                <HomeHero offer={data.hero} variant="ad" />
                <Main>
                    <Occasions items={data.occasions} />
                    <Moments items={data.moments} initial={data.moment} photoFromOffer />
                    <Popular items={data.popular} best compact />
                </Main>
            </>
        );
    }
    if (data.profile === 'sofia' && data.sofia) {
        return (
            <>
                <SofiaGreeting sofia={data.sofia} />
                <UsualHero sofia={data.sofia} />
                <Main>
                    <Favorites items={data.sofia.favorites} redeem={data.sofia.redeem} />
                    <div className="mx-4 flex flex-col gap-6 lg:mx-0 lg:flex-row lg:gap-5">
                        <div className="lg:min-w-[360px] lg:flex-1">
                            <RedeemCard sofia={data.sofia} />
                        </div>
                        <MonthCard offer={data.month} moment={data.moment} />
                    </div>
                </Main>
            </>
        );
    }
    return (
        <>
            <GreetingStrip />
            <HomeHero offer={data.hero} variant="season" description={t('hero.seasonDescription')} />
            <Main>
                <StartOrder />
                <Popular items={data.popular} />
                <Moments items={data.moments} initial={data.moment} photo={data.features?.cheesePull} />
                <IntentRail intents={data.intents ?? []} />
                <Benefits photo={data.features?.napocherry} />
            </Main>
        </>
    );
}

export default HomeDefault;
