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
/** @sfdc-extension-file SFDC_EXT_PJ_MENU */
import {
    COMPARE_CRUST,
    PJ_SIZES,
    type MenuImage,
    type MenuKind,
    type MenuOption,
    type MenuProduct,
    type PjSize,
} from './menu-model';

/**
 * Convierte un resultado de `productSearch` (con `expand=variations,images,custom_properties,
 * represented_products`) en el producto liviano del menú. Solo lee lo que el menú pinta, así la
 * respuesta del loader no arrastra el resultado completo de SCAPI.
 */

interface HitImage {
    alt?: string;
    link?: string;
    disBaseLink?: string;
}

interface HitVariant {
    productId: string;
    name?: string;
    price?: number;
    orderable?: boolean;
    variationValues?: Record<string, string>;
}

interface HitAttributes {
    c_pjKind?: string;
    c_pjBadges?: string[];
    c_pjFoodType?: string[];
    c_pjSensory?: string;
    c_pjRating?: number;
    c_pjReviewCount?: number;
    c_pjWeeklyOrders?: number;
    c_pjHalvesEnabled?: boolean;
    c_pjServes?: string;
    c_pjPriceBefore?: number;
    c_pjValidFrom?: string;
    c_pjValidTo?: string;
}

export interface MenuSearchHit extends HitAttributes {
    productId: string;
    productName?: string;
    price?: number;
    image?: HitImage;
    variants?: HitVariant[];
    variationAttributes?: { id: string; values?: { name?: string; value: string }[] }[];
    representedProduct?: HitAttributes;
}

const KINDS: readonly MenuKind[] = ['pizza', 'builder', 'combo', 'side', 'drink', 'dessert', 'extra'];
const IMAGE_WIDTHS = [240, 360, 480, 720] as const;

function disUrl(base: string, width: number): string {
    return `${base}${base.includes('?') ? '&' : '?'}sw=${width}&q=70`;
}

export function toMenuImage(image: HitImage | undefined, alt: string): MenuImage | null {
    const base = image?.disBaseLink;
    const link = image?.link;
    if (!base && !link) return null;
    if (!base) return { src: link as string, alt };
    return {
        src: disUrl(base, 480),
        srcSet: IMAGE_WIDTHS.map((w) => `${disUrl(base, w)} ${w}w`).join(', '),
        alt,
    };
}

/** «Coca-Cola 350 ml» → «350 ml»; «1.5 L» → «1,5 L»; «Red Bull Regular» → «Regular». */
export function optionLabel(raw: string, productName: string): string {
    let label = raw.trim();
    if (label.toLowerCase().startsWith(productName.toLowerCase()) && label.length > productName.length) {
        label = label.slice(productName.length).trim();
    }
    return label.replace(/(\d)\.(\d)/g, '$1,$2');
}

function toOptions(hit: MenuSearchHit, name: string): MenuOption[] {
    const labels = new Map<string, string>();
    for (const attribute of hit.variationAttributes ?? []) {
        for (const value of attribute.values ?? []) {
            labels.set(value.value, value.name ?? value.value);
        }
    }
    return (hit.variants ?? [])
        .filter((variant) => variant.orderable !== false && typeof variant.price === 'number')
        .map((variant) => {
            const key = Object.values(variant.variationValues ?? {})[0] ?? '';
            return {
                id: variant.productId,
                label: optionLabel(labels.get(key) ?? variant.name ?? key, name),
                price: variant.price as number,
            };
        })
        .sort((a, b) => a.price - b.price);
}

export function toMenuProduct(hit: MenuSearchHit): MenuProduct {
    const name = hit.productName ?? hit.productId;
    const attrs: HitAttributes = { ...hit, ...hit.representedProduct };
    const kindRaw = attrs.c_pjKind as MenuKind | undefined;
    const kind: MenuKind = kindRaw && KINDS.includes(kindRaw) ? kindRaw : 'side';
    const variants = (hit.variants ?? []).filter((variant) => variant.orderable !== false);

    const product: MenuProduct = {
        id: hit.productId,
        name,
        kind,
        image: toMenuImage(hit.image, name),
        price: hit.price ?? 0,
        listPrice: attrs.c_pjPriceBefore ?? null,
        sensory: attrs.c_pjSensory ?? null,
        rating: typeof attrs.c_pjRating === 'number' ? attrs.c_pjRating : null,
        reviews: typeof attrs.c_pjReviewCount === 'number' ? attrs.c_pjReviewCount : null,
        serves: attrs.c_pjServes ?? null,
        badges: attrs.c_pjBadges ?? [],
        foodTypes: attrs.c_pjFoodType ?? [],
        halves: attrs.c_pjHalvesEnabled === true,
        weeklyOrders: attrs.c_pjWeeklyOrders ?? 0,
        validFrom: attrs.c_pjValidFrom ?? null,
        validTo: attrs.c_pjValidTo ?? null,
    };

    if (kind === 'pizza' || kind === 'builder') {
        const sizes: NonNullable<MenuProduct['sizes']> = {};
        for (const size of PJ_SIZES) {
            const match = variants.find(
                (v) => v.variationValues?.pjSize === size && v.variationValues?.pjCrust === COMPARE_CRUST
            );
            if (match && typeof match.price === 'number') {
                sizes[size as PjSize] = { id: match.productId, price: match.price };
            }
        }
        if (Object.keys(sizes).length > 0) {
            product.sizes = sizes;
            product.price = Math.min(...Object.values(sizes).map((s) => s.price));
        } else if (variants.length > 0) {
            // Pan Pizza y Croissant: una sola variante, un solo tamaño.
            const only = [...variants].sort((a, b) => (a.price ?? 0) - (b.price ?? 0))[0];
            product.single = {
                id: only.productId,
                price: only.price ?? product.price,
                label: only.variationValues?.pjCrust === 'croissant' ? 'single' : 'medium',
            };
            product.price = product.single.price;
        }
    } else if (variants.length > 0 && kind !== 'combo') {
        const options = toOptions(hit, name);
        if (options.length > 0) {
            product.options = options;
            product.price = options[0].price;
        }
    }
    return product;
}
