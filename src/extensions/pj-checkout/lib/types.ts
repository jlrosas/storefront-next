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
import type { ShopperBasketsV2 } from '@/scapi';
import type { PjCartData } from '@/extensions/pj-cart/lib/types';
import type { LineProducts } from '@/extensions/pj-cart/lib/line-summary';
import type { PayMethod } from './checkout-model';

/** Tarjeta guardada del cliente (Mercado Pago en el proyecto; aquí la del perfil de Commerce). */
export interface SavedCard {
    id: string;
    brand: string;
    last4: string;
}

/** Quién paga: con sesión llega todo cargado (CHK-01.3); sin sesión, campos vacíos. */
export interface CheckoutContact {
    registered: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    /** Saldo de Papa Puntos (`c_pjPoints`). */
    points: number | null;
    doublePoints: boolean;
    savedCard: SavedCard | null;
}

/** Lo que `/checkout` necesita (la canasta, lo del carrito y quién paga). */
export interface PjCheckoutData {
    basket: ShopperBasketsV2.schemas['Basket'];
    cart: PjCartData;
    contact: CheckoutContact;
    /** `PJ_CASH` es un medio de pago aplicable a la canasta (si no, «Efectivo» se muestra deshabilitado). */
    cashAvailable: boolean;
}

/** Respuesta de `/action/pj-checkout-pay` cuando no se crea el pedido (si se crea, redirige). */
export interface PayFailure {
    success: false;
    /** `rejected`: el banco rechazó (tarjeta de prueba 4000…0002). `total`: el total cambió. */
    code: 'rejected' | 'total' | 'invalid' | 'empty' | 'error';
    /** Total que calcula Commerce ahora (con `total`). */
    charged?: number;
}

export interface PayFields {
    expectedTotal: number;
    method: PayMethod;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    cvv: string;
    cardNumber: string;
    cardExpiry: string;
    cardHolder: string;
    cardRut: string;
    docType: 'boleta' | 'factura';
    rut: string;
    businessName: string;
    businessActivity: string;
    businessAddress: string;
    note: string;
}

/** Lo que la confirmación muestra (CHK-05). */
export interface PjConfirmationData {
    orderNo: string;
    mode: 'pickup' | 'delivery';
    storeName: string | null;
    storeAddress: string | null;
    storeId: string | null;
    mapsUrl: string | null;
    storeCoords: { latitude: number; longitude: number } | null;
    address: string | null;
    /** Minutos a listo (retiro) o a la llegada (delivery). */
    minutes: number | null;
    placedAt: string;
    /** Hora de listo (`20:45`) o ventana de llegada (`21:05–21:15`). */
    readyAt: string | null;
    charged: number;
    shipping: number;
    payment: { kind: 'card'; brand: string; last4: string } | { kind: 'cash' } | null;
    earned: number;
    redeemed: number;
    /** Saldo después de canjear y de acreditar lo ganado (S-D12: 340 − 260 + 23 = 103). */
    balanceAfter: number | null;
    registered: boolean;
    phone: string | null;
    items: ShopperBasketsV2.schemas['ProductItem'][];
    lineProducts: LineProducts;
    comboImage: string | null;
    /** Línea canjeada del pedido (se muestra a $0). */
    canjeItemId: string | null;
    canjeValue: number;
}
