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
/** @sfdc-extension-file SFDC_EXT_PJ_ACCOUNT */
import { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@/components/link';
import { useNavigate } from '@/hooks/use-navigate';
import { useBasket } from '@/providers/basket';
import { FoodImage } from '@/extensions/pj-shared/components/food-image';
import { formatClp, formatCount } from '@/extensions/pj-shared/lib/format';
import { pointsFor, pointsToClp } from '@/extensions/pj-shared/lib/points';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import type { CanjeState } from '@/extensions/pj-cart/lib/cart-model';
import { useCanje } from '@/extensions/pj-cart/hooks/use-canje';
import { cn } from '@/lib/utils';
import { MOVES_SHOWN, type PjMember, type PointsMove } from '../lib/member';
import type { RedeemOffer } from '../lib/member.server';
import { PointsCalculator } from './points-calculator';

/** Meta de canje cuando el catálogo no responde (CONTRATO §4.1). */
const DEFAULT_GOAL = 260;

const DATE_FORMAT = new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Santiago',
});

export interface PointsPageProps {
    member: PjMember | null;
    redeem: RedeemOffer | null;
    /** Canje guardado en `pj_canje` (lo comparte con el carrito y el checkout). */
    canje: CanjeState | null;
}

/** Puntos por acreditar: los del pedido en curso (carrito), sin la pizza canjeada. */
function usePendingPoints(canje: CanjeState | null, doublePoints: boolean): number {
    const basket = useBasket();
    const total = basket?.productTotal ?? 0;
    const canjeInBasket = canje && basket?.productItems?.some((item) => item.itemId === canje.itemId);
    return pointsFor(total - (canjeInBasket ? canje.value : 0), 0, doublePoints);
}

function Hero({ member, pending }: { member: PjMember | null; pending: number }): ReactElement {
    const { t } = useTranslation('extPjAccount');
    const loginHref = `${PJ_ROUTES.login}?returnUrl=${encodeURIComponent(PJ_ROUTES.points)}`;
    return (
        <section className="surface-sauce rounded-pj-section p-5 lg:p-10" data-testid="pj-points-hero">
            <p className="pj-micro m-0 text-pj-accent">{t('points.eyebrow')}</p>
            {member ? (
                <>
                    <p className="m-0 mt-3 text-base">
                        {member.firstName ? t('points.hello', { name: member.firstName }) : null}
                    </p>
                    <p
                        className="m-0 mt-1"
                        aria-label={t('points.balanceAria', {
                            points: formatCount(member.points),
                            amount: formatClp(pointsToClp(member.points)),
                        })}
                        data-testid="pj-points-balance">
                        <span className="flex flex-wrap items-baseline gap-x-3 text-pj-heading">
                            <span className="pj-display leading-none">{formatCount(member.points)}</span>
                            <span className="pj-h2 leading-none">
                                {t('points.balanceUnit', { count: member.points })}
                            </span>
                        </span>
                        <span className="mt-2 block text-xl font-bold text-pj-accent">
                            {member.points > 0
                                ? t('points.balanceValue', { amount: formatClp(pointsToClp(member.points)) })
                                : t('points.balanceZero')}
                        </span>
                    </p>
                    {member.doublePoints && <p className="m-0 mt-3 text-base font-bold">{t('points.double')}</p>}
                    <div
                        className="mt-5 rounded-pj-card border-2 border-pj-pepperoncini/60 p-4"
                        data-testid="pj-points-pending">
                        <p className="pj-micro m-0 text-pj-accent">{t('points.pendingTitle')}</p>
                        <p className="m-0 mt-1 text-base">
                            {pending > 0
                                ? t('points.pendingSome', { points: formatCount(pending) })
                                : t('points.pendingNone')}
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="pj-h1 m-0 mt-3 text-pj-heading">{t('points.promise')}</h1>
                    <p className="m-0 mt-3 max-w-xl text-base">{t('points.promiseHint')}</p>
                    <p className="m-0 mt-3 max-w-xl text-base font-bold">{t('points.guestHint')}</p>
                    <Link
                        to={loginHref}
                        data-testid="pj-points-login"
                        className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-full bg-pj-pepperoncini px-8 text-base font-bold text-pj-sauce no-underline">
                        {t('points.guestCta')}
                    </Link>
                </>
            )}
        </section>
    );
}

function RedeemCard({
    member,
    redeem,
    canje,
}: {
    member: PjMember | null;
    redeem: RedeemOffer;
    canje: CanjeState | null;
}): ReactElement {
    const { t } = useTranslation('extPjAccount');
    const navigate = useNavigate();
    const { redeem: doRedeem, busy } = useCanje();
    const [error, setError] = useState(false);
    const balance = member?.points ?? 0;
    const canRedeem = Boolean(member) && balance >= redeem.points;
    const redeemed = canje?.productId === redeem.productId;
    const title = !member
        ? t('points.redeemGuestTitle')
        : canRedeem
          ? t('points.redeemTitle')
          : t('points.redeemSoonTitle');
    const progress = Math.min(100, Math.round((balance / redeem.points) * 100));

    const onRedeem = async () => {
        setError(false);
        const next = await doRedeem({ productId: redeem.productId, points: redeem.points, price: redeem.price });
        if (!next) {
            setError(true);
            return;
        }
        void navigate(PJ_ROUTES.cart);
    };

    return (
        <section
            aria-labelledby="pj-redeem-title"
            data-testid="pj-points-redeem"
            className="rounded-pj-section bg-pj-surface p-5 shadow-pj-card lg:p-8">
            <h2 id="pj-redeem-title" className="pj-h2 m-0 text-pj-heading">
                {title}
            </h2>
            <div className="mt-4 flex items-center gap-4">
                {redeem.image ? (
                    <FoodImage
                        src={redeem.image}
                        alt={t('points.redeemSize', { name: redeem.name })}
                        crop="macro"
                        aspect="1/1"
                        sizes="(min-width: 1024px) 128px, 96px"
                        className="size-24 shrink-0 lg:size-32"
                    />
                ) : (
                    <div className="size-24 shrink-0 rounded-pj-card bg-pj-sand lg:size-32" aria-hidden="true" />
                )}
                <div className="min-w-0">
                    <p className="pj-card-title m-0 text-pj-ink">{t('points.redeemSize', { name: redeem.name })}</p>
                    <p className="m-0 mt-1 text-base font-bold text-pj-sale">
                        {t('points.redeemPoints', {
                            points: formatCount(redeem.points),
                            amount: formatClp(redeem.price),
                        })}
                    </p>
                </div>
            </div>
            {member && !canRedeem && (
                <div className="mt-4">
                    <div
                        role="progressbar"
                        aria-label={t('points.redeemProgress')}
                        aria-valuemin={0}
                        aria-valuemax={redeem.points}
                        aria-valuenow={balance}
                        className="h-3 overflow-hidden rounded-full bg-pj-sand">
                        <div className="h-full rounded-full bg-pj-basil" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="m-0 mt-2 text-base">
                        {t('points.redeemMissing', {
                            points: formatCount(redeem.points - balance),
                            have: formatCount(balance),
                            goal: formatCount(redeem.points),
                        })}
                    </p>
                </div>
            )}
            {canRedeem && redeemed && (
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <p className="m-0 text-base font-bold text-pj-basil">{t('points.redeemDone')}</p>
                    <Link
                        to={PJ_ROUTES.cart}
                        className="inline-flex min-h-11 items-center rounded-full border-2 border-pj-basil px-5 text-base font-bold text-pj-basil no-underline">
                        {t('points.redeemView')}
                    </Link>
                </div>
            )}
            {canRedeem && !redeemed && (
                <>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={() => void onRedeem()}
                        data-testid="pj-points-redeem-cta"
                        className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-pj-green px-6 text-base font-bold text-pj-surface disabled:opacity-60 sm:w-auto">
                        {busy ? t('points.redeemBusy') : t('points.redeemCta')}
                    </button>
                    <p className="pj-small m-0 mt-3 text-pj-gray-strong">{t('points.redeemHint')}</p>
                </>
            )}
            {error && (
                <p role="alert" className="m-0 mt-3 text-base font-bold text-pj-sale">
                    {t('points.redeemError')}
                </p>
            )}
        </section>
    );
}

function Rules(): ReactElement {
    const { t } = useTranslation('extPjAccount');
    const rules = [
        { title: t('points.rule1Title'), text: t('points.rule1Text') },
        { title: t('points.rule2Title'), text: t('points.rule2Text') },
        { title: t('points.rule3Title'), text: t('points.rule3Text') },
    ];
    return (
        <section aria-labelledby="pj-rules-title" data-testid="pj-points-rules">
            <h2 id="pj-rules-title" className="pj-h2 m-0 text-pj-heading">
                {t('points.rulesTitle')}
            </h2>
            <ol className="m-0 mt-4 grid list-none gap-3 p-0 md:grid-cols-3">
                {rules.map((rule, index) => (
                    <li key={rule.title} className="flex gap-4 rounded-pj-card bg-pj-surface p-4 shadow-pj-card">
                        <span
                            aria-hidden="true"
                            className="surface-sauce inline-flex size-11 shrink-0 items-center justify-center rounded-full text-xl font-extrabold">
                            {index + 1}
                        </span>
                        <div>
                            <h3 className="pj-card-title m-0 text-pj-ink">{rule.title}</h3>
                            <p className="m-0 mt-1 text-base text-pj-gray-strong">{rule.text}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}

function Moves({ moves }: { moves: PointsMove[] }): ReactElement {
    const { t } = useTranslation('extPjAccount');
    const shown = moves.slice(0, MOVES_SHOWN);
    const label = (move: PointsMove): string => {
        if (move.kind === 'redeem') return t('points.moveRedeem');
        if (move.kind === 'opening') return t('points.moveOpening');
        return t('points.moveEarn', { order: move.order ? `#${move.order.replace(/^0+/, '')}` : '' });
    };
    return (
        <section
            aria-labelledby="pj-moves-title"
            data-testid="pj-points-moves"
            className="rounded-pj-section bg-pj-surface p-5 shadow-pj-card lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="pj-moves-title" className="pj-h2 m-0 text-pj-heading">
                    {t('points.movesTitle')}
                </h2>
                <span className="pj-micro rounded-full bg-pj-sand px-3 py-1 text-pj-ink">{t('points.sample')}</span>
            </div>
            {shown.length ? (
                <ul className="m-0 mt-3 list-none divide-y divide-pj-line p-0">
                    {shown.map((move) => (
                        <li
                            key={`${move.date}-${move.points}`}
                            className="flex min-h-14 items-center justify-between gap-3 py-2">
                            <div>
                                <p className="m-0 text-base font-bold text-pj-ink">{label(move)}</p>
                                <p className="pj-small m-0 text-pj-gray-strong">
                                    {DATE_FORMAT.format(new Date(move.date))}
                                </p>
                            </div>
                            <span
                                className={cn(
                                    'text-lg font-extrabold',
                                    move.points < 0 ? 'text-pj-sale' : 'text-pj-basil'
                                )}>
                                {`${move.points > 0 ? '+' : '−'}${formatCount(Math.abs(move.points))}`}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="m-0 mt-3 text-base text-pj-gray-strong">{t('points.movesEmpty')}</p>
            )}
        </section>
    );
}

/**
 * Página Papa Puntos (CTA-02 y CTA-03 en una sola ruta, `/puntos`). Con perfil o sesión: saldo en puntos y en
 * pesos, puntos por acreditar, lo que ya puede canjear (con «Canjear», que reutiliza el canje del carrito) y
 * movimientos de ejemplo. Para todos: las tres reglas y la calculadora. Sin perfil: la promesa e «Ingresa».
 */
export function PointsPage({ member, redeem, canje }: PointsPageProps): ReactElement {
    const { t } = useTranslation('extPjAccount');
    const pending = usePendingPoints(canje, member?.doublePoints ?? false);
    const goal = redeem?.points ?? DEFAULT_GOAL;
    return (
        <div className="surface-dough pb-16" data-testid="pj-points-page">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 pt-4 lg:gap-10 lg:px-6 lg:pt-10">
                {member && <h1 className="pj-h1 m-0 text-pj-heading">{t('points.promise')}</h1>}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-8">
                    <Hero member={member} pending={pending} />
                    {redeem ? <RedeemCard member={member} redeem={redeem} canje={canje} /> : null}
                </div>
                <Rules />
                <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
                    <PointsCalculator
                        balance={member?.points ?? 0}
                        doublePoints={member?.doublePoints ?? false}
                        goal={goal}
                    />
                    {member ? (
                        <Moves moves={member.moves} />
                    ) : (
                        <section className="rounded-pj-section bg-pj-surface p-5 shadow-pj-card lg:p-8">
                            <h2 className="pj-card-title m-0 text-pj-ink">{t('points.faqDelivery')}</h2>
                            <p className="m-0 mt-2 text-base text-pj-gray-strong">{t('points.faqDeliveryAnswer')}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PointsPage;
