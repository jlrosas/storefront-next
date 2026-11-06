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

/**
 * Micro-interacción al agregar (VIS-05, UX-1 §3.5): una miniatura de la foto «vuela» hasta el carrito
 * (450 ms) y el carrito «salta» (escala 1 → 1,25 → 1, 250 ms). Solo `transform` y `opacity`, con la
 * Web Animations API. Con «reducir movimiento» no hay vuelo ni salto. Sin dependencias de React: se
 * puede llamar desde cualquier manejador.
 */

/** Destinos del vuelo, en orden: lo que se marque con `data-pj-cart-target`, el carrito del encabezado y «Pedido» de la barra inferior. */
export const CART_TARGET_SELECTORS = [
    '[data-pj-cart-target]',
    '[data-testid="pj-header-cart"]',
    '[data-testid="pj-bottom-nav-order"]',
] as const;

/** Contadores del carrito que saltan (encabezado y barra inferior los marcan con `data-pj-cart-count`). */
export const CART_COUNT_SELECTOR = '[data-pj-cart-count]';

export const FLY_DURATION_MS = 450;
export const BUMP_DURATION_MS = 250;

/**
 * Foto de lo último que la persona tocó (p. ej. la tarjeta cuyo «Agregar» apretó). Se guarda al tocar,
 * no al agregar, porque entre medio puede abrirse el panel de tienda y el botón deja de existir.
 */
let lastPhoto: { image: HTMLImageElement; at: number } | null = null;
const PHOTO_TTL_MS = 30000;

if (typeof document !== 'undefined') {
    const remember = (target: EventTarget | null) => {
        if (!(target instanceof Element)) return;
        const image = findSourceImage(target);
        if (image) lastPhoto = { image, at: Date.now() };
    };
    document.addEventListener('pointerdown', (event) => remember(event.target), { capture: true, passive: true });
    document.addEventListener(
        'keydown',
        (event) => {
            if (event.key === 'Enter' || event.key === ' ') remember(document.activeElement);
        },
        { capture: true, passive: true }
    );
}

/** La foto de lo último que se tocó (hace menos de 30 s y aún en pantalla), o `null`. */
export function lastTouchedPhoto(): HTMLImageElement | null {
    if (lastPhoto && Date.now() - lastPhoto.at < PHOTO_TTL_MS && lastPhoto.image.isConnected) return lastPhoto.image;
    return null;
}

const BUMP_KEYFRAMES: Keyframe[] = [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }];

function canAnimate(): boolean {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;
    return typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
}

function isVisible(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
}

/** Primer destino visible del carrito, o `null`. */
export function findCartTarget(): HTMLElement | null {
    for (const selector of CART_TARGET_SELECTORS) {
        const found = Array.from(document.querySelectorAll<HTMLElement>(selector)).find(isVisible);
        if (found) return found;
    }
    return null;
}

/**
 * Busca la foto de lo que se agregó a partir del botón que se tocó: la imagen de su tarjeta, hoja o
 * ficha (`FoodImage` primero). Si `source` ya es una imagen, la usa.
 */
export function findSourceImage(source: Element | null | undefined): HTMLImageElement | null {
    if (!source) return null;
    if (source instanceof HTMLImageElement) return source;
    if (source.closest('header, nav, footer')) return null;
    let node: Element | null = source;
    while (node && node !== document.body) {
        const image =
            node.querySelector<HTMLImageElement>('[data-testid="pj-food-image"] img') ??
            node.querySelector<HTMLImageElement>('img:not(header img, nav img, footer img)');
        if (image && isVisible(image)) return image;
        node = node.parentElement;
    }
    return null;
}

/** El contador del carrito salta (1 → 1,25 → 1). Si aún no hay contador, salta el botón del carrito. */
export function bumpCartCount(): void {
    if (!canAnimate()) return;
    const counts = Array.from(document.querySelectorAll<HTMLElement>(CART_COUNT_SELECTOR)).filter(isVisible);
    const targets = counts.length ? counts : [findCartTarget()].filter((el): el is HTMLElement => !!el);
    for (const element of targets) {
        element.animate(BUMP_KEYFRAMES, { duration: BUMP_DURATION_MS, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
    }
}

/**
 * Hace volar una miniatura de la foto de `source` hasta el carrito y luego hace saltar el contador.
 * `source` puede ser el botón tocado (busca la foto de su tarjeta) o la imagen misma; sin `source`, usa
 * la foto de lo último que la persona tocó (aunque entre medio haya elegido tienda en el panel). Sin foto o sin destino visible, solo hace saltar el contador.
 * Devuelve una promesa que se resuelve al terminar.
 */
export function flyToCart(source?: Element | null): Promise<void> {
    if (!canAnimate()) return Promise.resolve();
    const image = source ? findSourceImage(source) : lastTouchedPhoto();
    const target = findCartTarget();
    if (!image || !target) {
        bumpCartCount();
        return Promise.resolve();
    }
    const from = image.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const size = Math.max(48, Math.min(96, from.width, from.height));
    const startX = from.left + from.width / 2 - size / 2;
    const startY = from.top + from.height / 2 - size / 2;
    const dx = to.left + to.width / 2 - (startX + size / 2);
    const dy = to.top + to.height / 2 - (startY + size / 2);

    const ghost = document.createElement('img');
    ghost.src = image.currentSrc || image.src;
    ghost.alt = '';
    ghost.setAttribute('aria-hidden', 'true');
    ghost.dataset.testid = 'pj-fly-to-cart';
    Object.assign(ghost.style, {
        position: 'fixed',
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        borderRadius: '9999px',
        boxShadow: 'var(--pj-shadow-float)',
        pointerEvents: 'none',
        zIndex: '9999',
    });
    document.body.appendChild(ghost);

    const flight = ghost.animate(
        [
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(0.7)`, opacity: 1, offset: 0.55 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.25)`, opacity: 0.4 },
        ],
        { duration: FLY_DURATION_MS, easing: 'cubic-bezier(0.55, 0, 0.45, 1)', fill: 'forwards' }
    );
    return flight.finished
        .catch(() => undefined)
        .then(() => {
            ghost.remove();
            bumpCartCount();
        });
}
