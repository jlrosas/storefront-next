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
/** @sfdc-extension-file SFDC_EXT_PJ_CHECKOUT */
import { type ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFetcher, useRevalidator } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { ShopperBasketsV2 } from '@/scapi';
import { Link } from '@/components/link';
import { routes } from '@/route-paths';
import { useBasket, useBasketUpdater } from '@/providers/basket';
import { formatClp } from '@/extensions/pj-shared/lib/format';
import { PJ_EXTERNAL_LINKS, PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import { useLineSummaries } from '@/extensions/pj-cart/hooks/use-line-summaries';
import { cartTotals, type CanjeState } from '@/extensions/pj-cart/lib/cart-model';
import type { SummaryLineItem } from '@/extensions/pj-cart/lib/line-summary';
import { FulfillmentCard } from '@/extensions/pj-cart/components/fulfillment-card';
import { PointsBlock } from '@/extensions/pj-cart/components/points-block';
import { SummaryBlock } from '@/extensions/pj-cart/components/summary-block';
import { cn } from '@/lib/utils';
import {
    emailValid,
    formatPhone,
    formatRut,
    invalidFields,
    PJ_CHECKOUT_PAY_ACTION,
    rutValid,
} from '../lib/checkout-model';
import type { PayFailure, PayFields, PjCheckoutData } from '../lib/types';
import { Field, StepCard } from './form-fields';
import { OrderLines } from './order-lines';
import { PaymentStep } from './payment-step';

type Basket = ShopperBasketsV2.schemas['Basket'];
type FormState = Omit<PayFields, 'expectedTotal'>;
type FieldKey = keyof FormState;

const FIELD_ORDER: FieldKey[] = [
    'firstName',
    'phone',
    'email',
    'method',
    'cardNumber',
    'cardExpiry',
    'cvv',
    'cardHolder',
    'cardRut',
    'rut',
    'businessName',
    'businessActivity',
    'businessAddress',
];

function BackIcon(): ReactElement {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            aria-hidden="true">
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

/** «¿Tienes un cupón?» y «Agregar nota para la tienda», colapsados (07 v2). */
function CheckoutExtras({
    note,
    onNote,
    basket,
}: {
    note: string;
    onNote: (note: string) => void;
    basket: Basket | undefined;
}): ReactElement {
    const { t } = useTranslation('extPjCheckout');
    const updateBasket = useBasketUpdater();
    const coupon = useFetcher<{ success: boolean; basket?: Basket }>({ key: 'pj-checkout-coupon' });
    const [couponOpen, setCouponOpen] = useState(false);
    const [noteOpen, setNoteOpen] = useState(Boolean(note));
    const [code, setCode] = useState('');
    const applied = basket?.couponItems ?? [];
    useEffect(() => {
        if (coupon.state === 'idle' && coupon.data?.success && coupon.data.basket) updateBasket(coupon.data.basket);
    }, [coupon.state, coupon.data, updateBasket]);
    const invalid = coupon.state === 'idle' && coupon.data && !coupon.data.success;
    const link =
        'inline-flex min-h-11 items-center self-start text-[15px] font-bold text-pj-basil underline underline-offset-4';
    return (
        <div className="flex flex-col gap-1 rounded-pj-card bg-pj-surface px-4 py-2 shadow-pj-card">
            {applied.map((item) => (
                <p key={item.couponItemId} className="m-0 text-sm font-semibold text-pj-basil">
                    {t('extras.couponApplied', { code: item.code })}
                </p>
            ))}
            <button
                type="button"
                aria-expanded={couponOpen}
                onClick={() => setCouponOpen(!couponOpen)}
                className={link}>
                {t('extras.coupon')}
            </button>
            {couponOpen && (
                <coupon.Form method="post" action="/action/promo-code-add" className="flex items-end gap-2 pb-2">
                    <Field
                        label={t('extras.couponLabel')}
                        name="promoCode"
                        value={code}
                        onValue={setCode}
                        autoComplete="off"
                        className="flex-1"
                        error={invalid ? t('extras.couponInvalid') : null}
                    />
                    <button
                        type="submit"
                        disabled={!code.trim() || coupon.state !== 'idle'}
                        className={cn(
                            'mb-[1px] h-12 rounded-full border-2 border-pj-basil px-5 text-[15px] font-bold text-pj-basil disabled:opacity-60',
                            invalid && 'mb-7'
                        )}>
                        {t('extras.couponApply')}
                    </button>
                </coupon.Form>
            )}
            <button type="button" aria-expanded={noteOpen} onClick={() => setNoteOpen(!noteOpen)} className={link}>
                {t('extras.note')}
            </button>
            {noteOpen && (
                <div className="flex flex-col gap-1 pb-2">
                    <label htmlFor="pj-store-note" className="text-sm font-semibold text-pj-gray-strong">
                        {t('extras.noteLabel')}
                    </label>
                    <textarea
                        id="pj-store-note"
                        value={note}
                        maxLength={300}
                        rows={2}
                        onChange={(event) => onNote(event.target.value)}
                        placeholder={t('extras.notePlaceholder')}
                        className="rounded-pj-control border-[1.5px] border-pj-input-line bg-pj-surface p-3 text-base text-pj-ink"
                    />
                </div>
            )}
        </div>
    );
}

/**
 * Checkout de Papa Johns (CHK-01/02/03, UX-2 §4): continúa «Mi pedido» con la misma modalidad arriba, las mismas
 * líneas, el canje aplicado y el mismo total. Tres pasos numerados, Papa Puntos en Sauce y un botón fijo con el
 * monto. A 1440, pasos a la izquierda y resumen fijo a la derecha con el botón de pago.
 */
export function PjCheckoutPage({ data }: { data: PjCheckoutData }): ReactElement {
    const { t } = useTranslation('extPjCheckout');
    const { t: tCart } = useTranslation('extPjCart');
    const { basket: loaderBasket, cart, contact } = data;
    const contextBasket = useBasket();
    const updateBasket = useBasketUpdater();
    const { revalidate } = useRevalidator();

    useLayoutEffect(() => {
        if (loaderBasket?.basketId) updateBasket(loaderBasket);
    }, [loaderBasket, updateBasket]);

    const basket = contextBasket?.basketId === loaderBasket?.basketId ? (contextBasket ?? loaderBasket) : loaderBasket;
    const items = useMemo(() => (basket?.productItems ?? []) as SummaryLineItem[], [basket]);
    const [canjeState, setCanjeState] = useState<CanjeState | null>(cart.canje ?? null);
    const canje = canjeState && items.some((item) => item.itemId === canjeState.itemId) ? canjeState : null;
    const ignore = useMemo(() => (canje ? [canje.itemId] : []), [canje]);
    const { summaries, entries, products } = useLineSummaries(items, cart.lineProducts, ignore);

    const delivery = cart.fulfillment?.mode === 'delivery';
    const totals = cartTotals(summaries, { delivery, doublePoints: contact.doublePoints, canje });
    const count = summaries.reduce((sum, line) => sum + line.quantity, 0);

    const [form, setForm] = useState<FormState>({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone ? formatPhone(contact.phone) : '',
        method: contact.savedCard ? 'saved-card' : 'new-card',
        cvv: '',
        cardNumber: '',
        cardExpiry: '',
        cardHolder: '',
        cardRut: '',
        docType: 'boleta',
        rut: '',
        businessName: '',
        businessActivity: '',
        businessAddress: '',
        note: '',
    });
    const patch = (next: Partial<FormState>) => setForm((prev) => ({ ...prev, ...next }));
    const [touched, setTouched] = useState<Set<FieldKey>>(new Set());
    const touch = (key: FieldKey) => setTouched((prev) => new Set(prev).add(key));
    const invalid = new Set(invalidFields(form, Boolean(contact.savedCard)));
    // Con sesión los datos van en una línea; se abren si falta algo o si el cliente toca «Editar».
    const contactComplete = Boolean(form.firstName) && emailValid(form.email) && !invalid.has('phone');
    const [editingContact, setEditingContact] = useState(!contact.registered || !contactComplete);

    const messages: Partial<Record<FieldKey, string>> = {
        firstName: t('contact.errorName'),
        phone: t('contact.errorPhone'),
        email: t('contact.errorEmail'),
        cardNumber: t('payment.errorNumber'),
        cardExpiry: t('payment.errorExpiry'),
        cvv: t('payment.errorCvv'),
        cardHolder: t('payment.errorHolder'),
        cardRut: t('payment.errorRut'),
        rut: t('payment.errorRut'),
        businessName: t('document.errorRequired'),
        businessActivity: t('document.errorRequired'),
        businessAddress: t('document.errorRequired'),
    };
    const errorOf = (key: FieldKey): string | null =>
        touched.has(key) && invalid.has(key) ? (messages[key] ?? null) : null;

    const pay = useFetcher<PayFailure>({ key: 'pj-checkout-pay' });
    const paying = pay.state !== 'idle';
    const failure = pay.state === 'idle' ? pay.data : undefined;
    const [dismissed, setDismissed] = useState<PayFailure | undefined>(undefined);
    const shownFailure = failure && failure !== dismissed ? failure : undefined;
    const lastTotalFailure = useRef<PayFailure | undefined>(undefined);
    useEffect(() => {
        // Si el total cambió en Commerce, se recarga la canasta para que el cliente vea el total nuevo.
        if (failure?.code === 'total' && lastTotalFailure.current !== failure) {
            lastTotalFailure.current = failure;
            void revalidate();
        }
    }, [failure, revalidate]);

    const verb = form.method === 'cash' ? t('pay.confirm') : t('pay.pay');
    const submit = () => {
        if (paying) return;
        const blocking = FIELD_ORDER.filter((key) => invalid.has(key));
        if (blocking.length) {
            setTouched(new Set([...touched, ...blocking]));
            if (blocking.some((key) => key === 'firstName' || key === 'phone' || key === 'email')) {
                setEditingContact(true);
            }
            // Lleva al primer campo marcado, por encima de la barra fija de pago.
            requestAnimationFrame(() => {
                const field = document.querySelector<HTMLInputElement>(
                    '[data-testid="pj-checkout"] [aria-invalid="true"]'
                );
                field?.scrollIntoView({ block: 'center' });
                field?.focus({ preventScroll: true });
            });
            return;
        }
        setDismissed(undefined);
        const body = new FormData();
        for (const [key, value] of Object.entries(form)) body.append(key, String(value));
        body.append('expectedTotal', String(totals.total));
        void pay.submit(body, { method: 'POST', action: PJ_CHECKOUT_PAY_ACTION });
    };
    const missing = FIELD_ORDER.some((key) => invalid.has(key) && touched.has(key));

    const failureNotice = shownFailure ? (
        <div role="alert" className="surface-sauce flex flex-col gap-3 rounded-pj-card p-4" data-testid="pj-pay-error">
            {shownFailure.code === 'rejected' ? (
                <>
                    <p className="m-0 text-[15px]">
                        <strong>{t('pay.rejectedTitle')}</strong> {t('pay.rejectedText')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setDismissed(shownFailure);
                                patch({ method: 'new-card', cardNumber: '', cvv: '' });
                            }}
                            className="inline-flex min-h-11 items-center rounded-full bg-pj-pepperoncini px-4 text-[15px] font-bold text-pj-sauce">
                            {t('pay.otherCard')}
                        </button>
                        {data.cashAvailable && (
                            <button
                                type="button"
                                onClick={() => {
                                    setDismissed(shownFailure);
                                    patch({ method: 'cash' });
                                }}
                                className="inline-flex min-h-11 items-center rounded-full border-2 border-pj-dough px-4 text-[15px] font-bold text-pj-dough">
                                {delivery ? t('pay.cashDelivery') : t('pay.cashPickup')}
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p className="m-0 text-[15px] font-semibold">
                    {shownFailure.code === 'total'
                        ? t('pay.totalChanged', { amount: formatClp(shownFailure.charged ?? totals.total) })
                        : shownFailure.code === 'empty'
                          ? t('pay.empty')
                          : t('pay.error')}
                </p>
            )}
        </div>
    ) : null;

    const terms = (
        <p className="m-0 text-center text-[13px] text-pj-gray-strong">
            {t('pay.termsPrefix')}{' '}
            <a
                href={PJ_EXTERNAL_LINKS.promoTerms}
                target="_blank"
                rel="noreferrer"
                className="-my-[15px] inline-block py-[15px] font-semibold text-pj-basil underline">
                {t('pay.termsLink')}
            </a>{' '}
            {t('pay.termsJoin')}{' '}
            <a
                href={PJ_EXTERNAL_LINKS.privacy}
                target="_blank"
                rel="noreferrer"
                className="-my-[15px] inline-block py-[15px] font-semibold text-pj-basil underline">
                {t('pay.privacyLink')}
            </a>
            .
        </p>
    );

    const payButton = (className?: string) =>
        paying ? (
            <div
                role="status"
                aria-busy="true"
                className={cn(
                    'flex h-14 w-full items-center justify-center gap-3 rounded-full bg-pj-green px-6 text-[17px] font-bold text-pj-surface opacity-90',
                    className
                )}
                data-testid="pj-pay-busy">
                <span
                    aria-hidden="true"
                    className="size-5 animate-spin rounded-full border-[3px] border-pj-surface border-t-transparent motion-reduce:animate-none"
                />
                {t('pay.paying')}
            </div>
        ) : (
            <button
                type="button"
                onClick={submit}
                aria-label={t('pay.aria', { verb, total: formatClp(totals.total) })}
                data-testid="pj-pay"
                className={cn(
                    'flex h-14 w-full items-center justify-between rounded-full bg-pj-green px-6 text-[17px] font-bold text-pj-surface hover:bg-pj-green-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pj-green',
                    className
                )}>
                <span>{verb}</span>
                <span className="tabular-nums">{formatClp(totals.total)}</span>
            </button>
        );

    const contactLine = [formatPhone(form.phone), form.email].filter(Boolean).join(' · ');

    return (
        <div className="surface-dough min-h-screen pb-10 lg:pb-16" data-testid="pj-checkout">
            <div className="mx-auto w-full max-w-[1120px] px-4 pt-3 lg:px-8 lg:pt-6">
                <Link
                    to={PJ_ROUTES.cart}
                    className="-ml-1 inline-flex min-h-11 items-center gap-1 text-[15px] font-bold text-pj-basil no-underline">
                    <BackIcon />
                    {t('page.back')}
                </Link>
                <h1 className="pj-h2 mt-1 mb-4">{t('page.title')}</h1>
                <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-8">
                    <div className="flex min-w-0 flex-col gap-4">
                        <FulfillmentCard fulfillment={cart.fulfillment} />

                        <StepCard
                            step={1}
                            title={t('contact.title')}
                            action={
                                contact.registered ? (
                                    <button
                                        type="button"
                                        onClick={() => setEditingContact(!editingContact)}
                                        aria-expanded={editingContact}
                                        aria-label={editingContact ? undefined : t('contact.editAria')}
                                        className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                                        {editingContact ? t('contact.done') : t('contact.edit')}
                                    </button>
                                ) : (
                                    <Link
                                        to={`${routes.login}?returnUrl=${encodeURIComponent(routes.checkout)}`}
                                        className="inline-flex min-h-11 items-center px-1 text-sm font-bold text-pj-basil underline underline-offset-4">
                                        {t('contact.login')}
                                    </Link>
                                )
                            }>
                            {editingContact ? (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label={t('contact.name')}
                                        value={form.firstName}
                                        onValue={(firstName) => patch({ firstName })}
                                        onBlur={() => touch('firstName')}
                                        error={errorOf('firstName')}
                                        autoComplete="given-name"
                                    />
                                    <Field
                                        label={t('contact.lastName')}
                                        value={form.lastName}
                                        onValue={(lastName) => patch({ lastName })}
                                        autoComplete="family-name"
                                    />
                                    <Field
                                        label={t('contact.phone')}
                                        value={form.phone}
                                        onValue={(phone) => patch({ phone })}
                                        onBlur={() => touch('phone')}
                                        error={errorOf('phone')}
                                        type="tel"
                                        inputMode="tel"
                                        autoComplete="tel"
                                    />
                                    <Field
                                        label={t('contact.email')}
                                        value={form.email}
                                        onValue={(email) => patch({ email })}
                                        onBlur={() => touch('email')}
                                        error={errorOf('email')}
                                        hint={t('contact.emailHint')}
                                        type="email"
                                        inputMode="email"
                                        autoComplete="email"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col text-[15px]" data-testid="pj-checkout-contact">
                                    <span className="font-bold text-pj-ink">
                                        {[form.firstName, form.lastName].filter(Boolean).join(' ')}
                                    </span>
                                    <span className="text-pj-gray-strong">{contactLine}</span>
                                </div>
                            )}
                        </StepCard>

                        <PaymentStep
                            values={form}
                            onChange={patch}
                            errors={{
                                cvv: errorOf('cvv'),
                                cardNumber: errorOf('cardNumber'),
                                cardExpiry: errorOf('cardExpiry'),
                                cardHolder: errorOf('cardHolder'),
                                cardRut: errorOf('cardRut'),
                            }}
                            onBlur={touch}
                            savedCard={contact.savedCard}
                            delivery={delivery}
                            total={totals.total}
                            cashAvailable={data.cashAvailable}
                        />

                        <StepCard step={3} title={t('document.title')}>
                            <div
                                role="radiogroup"
                                aria-label={t('document.label')}
                                className="grid grid-cols-2 gap-1 rounded-pj-control bg-pj-dough p-1">
                                {(['boleta', 'factura'] as const).map((doc) => (
                                    <button
                                        key={doc}
                                        type="button"
                                        role="radio"
                                        aria-checked={form.docType === doc}
                                        onClick={() => patch({ docType: doc })}
                                        className={cn(
                                            'min-h-11 rounded-[10px] text-base',
                                            form.docType === doc
                                                ? 'bg-pj-surface font-bold text-pj-heading shadow-pj-card'
                                                : 'font-semibold text-pj-gray-strong'
                                        )}>
                                        {t(`document.${doc}`)}
                                    </button>
                                ))}
                            </div>
                            {form.docType === 'boleta' ? (
                                <p className="m-0 text-[15px] text-pj-gray-strong">{t('document.boletaText')}</p>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <Field
                                        label={t('document.rut')}
                                        value={form.rut}
                                        onValue={(rut) => patch({ rut })}
                                        onBlur={() => {
                                            if (form.rut) patch({ rut: formatRut(form.rut) });
                                            touch('rut');
                                        }}
                                        error={errorOf('rut')}
                                        ok={touched.has('rut') && rutValid(form.rut) ? t('document.rutOk') : null}
                                        placeholder="76.123.456-7"
                                    />
                                    <Field
                                        label={t('document.businessName')}
                                        value={form.businessName}
                                        onValue={(businessName) => patch({ businessName })}
                                        onBlur={() => touch('businessName')}
                                        error={errorOf('businessName')}
                                        autoComplete="organization"
                                        placeholder={t('document.businessNamePlaceholder')}
                                    />
                                    <Field
                                        label={t('document.activity')}
                                        value={form.businessActivity}
                                        onValue={(businessActivity) => patch({ businessActivity })}
                                        onBlur={() => touch('businessActivity')}
                                        error={errorOf('businessActivity')}
                                        placeholder={t('document.activityPlaceholder')}
                                    />
                                    <Field
                                        label={t('document.address')}
                                        value={form.businessAddress}
                                        onValue={(businessAddress) => patch({ businessAddress })}
                                        onBlur={() => touch('businessAddress')}
                                        error={errorOf('businessAddress')}
                                        autoComplete="street-address"
                                        placeholder={t('document.addressPlaceholder')}
                                    />
                                </div>
                            )}
                        </StepCard>

                        <CheckoutExtras note={form.note} onNote={(note) => patch({ note })} basket={basket} />
                    </div>

                    <aside
                        className="flex flex-col gap-4 lg:sticky lg:top-[calc(var(--header-height,64px)+1.5rem)]"
                        data-testid="pj-checkout-side">
                        <PointsBlock
                            earn={totals.points}
                            doublePoints={contact.doublePoints}
                            balance={contact.registered ? contact.points : null}
                            redeem={cart.extras.redeem}
                            canje={canje}
                            onCanje={setCanjeState}
                        />
                        <section
                            aria-labelledby="pj-checkout-order"
                            className="flex flex-col gap-3 rounded-pj-card bg-pj-surface p-4 shadow-pj-card lg:p-5">
                            <div className="flex items-baseline justify-between gap-3">
                                <h2 id="pj-checkout-order" className="pj-card-title m-0 text-xl text-pj-heading">
                                    {t('page.orderTitle')}
                                </h2>
                                <span className="text-sm text-pj-gray-strong">{tCart('page.count', { count })}</span>
                            </div>
                            <OrderLines
                                entries={entries}
                                products={products}
                                canje={canje}
                                comboImage={cart.extras.comboImage}
                            />
                            <SummaryBlock
                                totals={totals}
                                delivery={delivery}
                                className="border-t border-pj-line pt-3"
                            />
                            <div className="hidden flex-col gap-3 lg:flex">
                                {failureNotice}
                                {missing && (
                                    <p className="m-0 text-center text-sm font-semibold text-pj-price">
                                        {t('pay.missing')}
                                    </p>
                                )}
                                {payButton()}
                                {terms}
                            </div>
                        </section>
                    </aside>
                </div>
            </div>

            <div
                data-checkout-mobile-bar
                className="fixed inset-x-0 bottom-0 z-40 flex flex-col gap-2 border-t border-pj-line bg-pj-dough px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
                {failureNotice}
                {missing && <p className="m-0 text-center text-sm font-semibold text-pj-price">{t('pay.missing')}</p>}
                {terms}
                {payButton()}
            </div>
        </div>
    );
}

export default PjCheckoutPage;
