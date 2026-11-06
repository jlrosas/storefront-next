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
/** @sfdc-extension-file SFDC_EXT_PJ_PRODUCT */

/** Contadores del pedido del layout de INT (encabezado y barra inferior). */
const COUNTER_SELECTORS =
    '[data-testid="pj-header-cart"] > span, [data-testid="shopping-cart-badge"], [data-testid="pj-bottom-nav-count"], [data-pj-cart-count]';

function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/**
 * «El contador del pedido salta» (D37): anima los contadores existentes sin tocar el encabezado (es
 * de INT). Espera un cuadro para que el número nuevo ya esté pintado.
 */
export function bumpCartCounters(): void {
    if (typeof document === 'undefined' || prefersReducedMotion()) return;
    window.requestAnimationFrame(() => {
        window.setTimeout(() => {
            document.querySelectorAll<HTMLElement>(COUNTER_SELECTORS).forEach((el) => {
                el.animate?.([{ transform: 'scale(1)' }, { transform: 'scale(1.45)' }, { transform: 'scale(1)' }], {
                    duration: 450,
                    easing: 'cubic-bezier(.3,1.6,.5,1)',
                });
            });
        }, 60);
    });
}

/**
 * «La pizza vuela al carro» (ficha, D37): una copia de la foto viaja desde `from` hasta el ícono del
 * pedido del encabezado. Sin destino visible o con «reducir movimiento», no hace nada.
 */
export function flyToCart(from: HTMLElement | null, imageSrc: string | null): void {
    if (!from || !imageSrc || typeof document === 'undefined' || prefersReducedMotion()) return;
    const target = Array.from(
        document.querySelectorAll<HTMLElement>(
            '[data-testid="pj-header-cart"], [data-testid="shopping-cart-icon"], [data-testid="pj-bottom-nav-order"], [data-pj-cart-target]'
        )
    ).find((el) => el.getBoundingClientRect().width > 0);
    if (!target) return;
    const a = from.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const size = Math.min(120, a.width, a.height);
    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    Object.assign(img.style, {
        position: 'fixed',
        left: `${a.left + a.width / 2 - size / 2}px`,
        top: `${a.top + a.height / 2 - size / 2}px`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '999px',
        objectFit: 'cover',
        zIndex: '100',
        pointerEvents: 'none',
    });
    document.body.appendChild(img);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2);
    const dy = b.top + b.height / 2 - (a.top + a.height / 2);
    const animation = img.animate?.(
        [
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.2 },
        ],
        { duration: 700, easing: 'cubic-bezier(.5,-0.2,.7,1)' }
    );
    if (animation) animation.onfinish = () => img.remove();
    else img.remove();
}
