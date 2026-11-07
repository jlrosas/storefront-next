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
import { CANJE_PROMOTION_ID, type CanjeState } from '@/extensions/pj-cart/lib/cart-model';
import { PJ_ROUTES } from '@/extensions/pj-shared/lib/routes';
import type { PayFields } from './types';

/**
 * Reglas del checkout de Papa Johns (CHK-01..03): cuánto se cobra con el canje aplicado, la tarjeta de prueba,
 * el RUT y el texto que queda en el envío del pedido. Funciones puras: sirven al servidor y al cliente.
 */

/** Métodos de envío del sandbox (DAT): `001` despacho a domicilio ($1.990), `005` retiro en tienda ($0). */
/** Acción de pago (`routes/action.pj-checkout-pay.ts`). */
export const PJ_CHECKOUT_PAY_ACTION = '/action/pj-checkout-pay';

export const DELIVERY_METHOD_ID = '001';
export const PICKUP_METHOD_ID = '005';

/**
 * Cupón que dispararía la promoción `pj-canje-puntos` (solicitud a DAT). Mientras no exista, el canje se cobra a
 * $0 con el medio de pago por el total visible (supuesto de demo, ver `chargeFor`).
 */
export const CANJE_COUPON_CODE = 'PJ-CANJE-PUNTOS';

/** Tarjeta de prueba que el banco rechaza (S-D4). */
export const REJECTED_TEST_CARD = '4000000000000002';

/** Medio de pago en efectivo de Commerce (CONTRATO §4.2). No existe todavía en el sandbox: solicitud a DAT. */
export const CASH_METHOD_ID = 'PJ_CASH';

export type PayMethod = 'saved-card' | 'new-card' | 'cash';

/** Lo mínimo de la canasta (o del pedido) que mira el cobro. */
interface PricedItem {
    itemId?: string;
    productId?: string;
    price?: number;
    priceAfterItemDiscount?: number;
    priceAfterOrderDiscount?: number;
    priceAdjustments?: Array<{ promotionId?: string }>;
    optionItems?: PricedItem[];
}

export interface PricedContainer {
    orderTotal?: number;
    shippingTotal?: number;
    productItems?: PricedItem[];
}

const money = (value: number | undefined): number => (typeof value === 'number' && Number.isFinite(value) ? value : 0);

function itemCharge(item: PricedItem): number {
    const own = money(item.priceAfterOrderDiscount ?? item.priceAfterItemDiscount ?? item.price);
    return own + (item.optionItems ?? []).reduce((sum, option) => sum + itemCharge(option), 0);
}

/** La línea canjeada ya está a $0 por la promoción de Commerce. */
export function canjeCoveredByPromotion(item: PricedItem | undefined): boolean {
    return Boolean(item?.priceAdjustments?.some((adjustment) => adjustment.promotionId === CANJE_PROMOTION_ID));
}

export interface Charge {
    /** Lo que calcula Commerce (`orderTotal`). */
    orderTotal: number;
    /** Lo que Commerce todavía cobra por la pizza canjeada (0 si la promoción la deja en $0). */
    canjeCharge: number;
    /** Lo que paga el cliente: el total que ve en el carrito y en el checkout. */
    charged: number;
}

/**
 * Cuánto se cobra (H-1 de VAL-C3). Si la promoción `pj-canje-puntos` existe, Commerce ya deja la línea en $0 y
 * `charged = orderTotal`. Si no existe (hoy), la pizza canjeada se resta del total de Commerce: es lo que el
 * cliente vio en `/cart`. El medio de pago se crea por `charged`.
 */
export function chargeFor(container: PricedContainer | null | undefined, canje: CanjeState | null): Charge {
    const orderTotal = money(container?.orderTotal);
    const line = canje ? container?.productItems?.find((item) => item.itemId === canje.itemId) : undefined;
    const canjeCharge = line && !canjeCoveredByPromotion(line) ? itemCharge(line) : 0;
    return { orderTotal, canjeCharge, charged: Math.max(0, orderTotal - canjeCharge) };
}

// ─── Tarjeta ───────────────────────────────────────────────────────────────────

export const digitsOnly = (value: string): string => value.replace(/\D/g, '');

export function luhnValid(number: string): boolean {
    const digits = digitsOnly(number);
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0;
    for (let i = 0; i < digits.length; i += 1) {
        let d = Number(digits[digits.length - 1 - i]);
        if (i % 2 === 1) {
            d *= 2;
            if (d > 9) d -= 9;
        }
        sum += d;
    }
    return sum % 10 === 0;
}

/** Marca por el número (solo las que se aceptan: S-D4). */
export function cardBrand(number: string): 'Visa' | 'Mastercard' | 'Amex' | null {
    const digits = digitsOnly(number);
    if (/^4/.test(digits)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(digits)) return 'Mastercard';
    if (/^3[47]/.test(digits)) return 'Amex';
    return null;
}

/** «1234 1234 1234 1234» mientras se escribe. */
export function formatCardNumber(value: string): string {
    return digitsOnly(value)
        .slice(0, 19)
        .replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** «MM/AA» → mes y año completo, o `null` si no es una fecha futura. */
export function parseExpiry(value: string, now: Date = new Date()): { month: number; year: number } | null {
    const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim());
    if (!match) return null;
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    if (month < 1 || month > 12) return null;
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    return endOfMonth >= now ? { month, year } : null;
}

export function formatExpiry(value: string): string {
    const digits = digitsOnly(value).slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export const cvvValid = (value: string, brand: string | null = null): boolean =>
    new RegExp(brand === 'Amex' ? '^\\d{4}$' : '^\\d{3}$').test(value.trim());

export const maskCard = (number: string): string => `************${digitsOnly(number).slice(-4)}`;

// ─── RUT ───────────────────────────────────────────────────────────────────────

/** Dígito verificador (módulo 11). */
function rutCheckDigit(body: string): string {
    let sum = 0;
    let factor = 2;
    for (let i = body.length - 1; i >= 0; i -= 1) {
        sum += Number(body[i]) * factor;
        factor = factor === 7 ? 2 : factor + 1;
    }
    const rest = 11 - (sum % 11);
    return rest === 11 ? '0' : rest === 10 ? 'K' : String(rest);
}

const cleanRut = (value: string): string => value.replace(/[^0-9kK]/g, '').toUpperCase();

export function rutValid(value: string): boolean {
    const clean = cleanRut(value);
    if (clean.length < 2) return false;
    const body = clean.slice(0, -1);
    return /^\d{6,8}$/.test(body) && rutCheckDigit(body) === clean.slice(-1);
}

/** «761234567» → «76.123.456-7». */
export function formatRut(value: string): string {
    const clean = cleanRut(value);
    if (clean.length < 2) return value.trim();
    const body = clean.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${body}-${clean.slice(-1)}`;
}

// ─── Contacto ──────────────────────────────────────────────────────────────────

/** «+56976543210» → «+56 9 7654 3210». */
export function formatPhone(value: string | null | undefined): string {
    const digits = digitsOnly(value ?? '');
    const local = digits.startsWith('56') ? digits.slice(2) : digits;
    if (local.length !== 9) return (value ?? '').trim();
    return `+56 ${local[0]} ${local.slice(1, 5)} ${local.slice(5)}`;
}

/** Celular chileno: 9 dígitos que empiezan con 9 (con o sin +56). */
export function phoneValid(value: string): boolean {
    const digits = digitsOnly(value);
    const local = digits.startsWith('56') && digits.length === 11 ? digits.slice(2) : digits;
    return /^9\d{8}$/.test(local);
}

export const emailValid = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

// ─── Lo que queda en el envío del pedido ─────────────────────────────────────

/**
 * El canje no tiene atributo en la canasta (DAT definió `c_pjRedeemed` solo en el pedido), así que queda escrito
 * en `c_storePickupMessage` del envío, que se ve en Business Manager y en el pedido de SCAPI.
 */
const CANJE_PATTERN = /Canje Papa Puntos: (\d+) puntos/;

export interface ShipmentNoteInput {
    canje: { points: number; name: string } | null;
    payment: string;
    document: string | null;
    note: string | null;
}

export function shipmentNote({ canje, payment, document, note }: ShipmentNoteInput): string {
    return [
        canje ? `Canje Papa Puntos: ${canje.points} puntos (${canje.name})` : null,
        payment,
        document,
        note ? `Nota: ${note}` : null,
    ]
        .filter(Boolean)
        .join(' | ')
        .slice(0, 1000);
}

/** Puntos canjeados que dice la nota del envío (0 si no hay canje). */
export function redeemedFromNote(note: string | null | undefined): number {
    const match = CANJE_PATTERN.exec(note ?? '');
    return match ? Number(match[1]) : 0;
}

// ─── Formulario ────────────────────────────────────────────────────────────────

/** Lo que el formulario debe traer completo antes de tocar la canasta (los mismos chequeos que el cliente). */
export function invalidFields(
    fields: Omit<PayFields, 'expectedTotal'> & { expectedTotal?: number },
    hasSavedCard: boolean
): Array<keyof PayFields> {
    const bad: Array<keyof PayFields> = [];
    if (!fields.firstName) bad.push('firstName');
    if (!emailValid(fields.email)) bad.push('email');
    if (!phoneValid(fields.phone)) bad.push('phone');
    if (fields.method === 'saved-card') {
        if (!hasSavedCard) bad.push('method');
        if (!cvvValid(fields.cvv)) bad.push('cvv');
    }
    if (fields.method === 'new-card') {
        if (!luhnValid(fields.cardNumber) || !cardBrand(fields.cardNumber)) bad.push('cardNumber');
        if (!parseExpiry(fields.cardExpiry)) bad.push('cardExpiry');
        if (!cvvValid(fields.cvv, cardBrand(fields.cardNumber))) bad.push('cvv');
        if (!fields.cardHolder) bad.push('cardHolder');
        if (!rutValid(fields.cardRut)) bad.push('cardRut');
    }
    if (fields.docType === 'factura') {
        if (!rutValid(fields.rut)) bad.push('rut');
        if (!fields.businessName) bad.push('businessName');
        if (!fields.businessActivity) bad.push('businessActivity');
        if (!fields.businessAddress) bad.push('businessAddress');
    }
    if (fields.expectedTotal !== undefined && !Number.isFinite(fields.expectedTotal)) bad.push('expectedTotal');
    return bad;
}

/** «Seguir mi pedido»: el seguimiento es de SEG (oleada 3); aquí solo el enlace con el número de pedido. */
export function trackingHref(orderNo: string): string {
    return `${PJ_ROUTES.tracking}?pedido=${encodeURIComponent(orderNo)}`;
}
