# Piezas visuales de pj-shared (VIS, 06-nov)

Todo se importa desde `@/extensions/pj-shared`. La documentación completa y la tabla de combinaciones de color están en `src/extensions/pj-shared/README.md`.

| Pieza | API |
|---|---|
| `<FoodImage crop>` | `crop: 'macro' \| 'hero' \| 'combo' \| 'none'` (por defecto `'none'`). Usos: `macro` en tarjetas y ficha; `hero` en heros (junto con `bleed` y `priority`); `combo` en combos con productos en fila; `none` en bebidas y postres. `cropForPhoto(idOrSrc, fallback='macro')` elige el recorte. Usa la propiedad CSS `scale`, así que se puede combinar con zoom por `transform` |
| `<FoodImage>` nitidez (VIS-06) | **Sin cambios de props.** `sizes` sigue describiendo la **caja**; `FoodImage` lo multiplica por la escala del recorte (`calc(100vw * 1.45)`) y, ya montada, lo reemplaza por el ancho pintado medido, así que el navegador pide `sw = ancho pintado × DPR × escala` (tope 1.440). El `srcSet` del llamador se normaliza (ningún `sw` sobre el original; se completan escalones 320–1.440); si `src` es del DIS y no hay `srcSet`, lo arma. El recorte nunca agranda la foto sobre su ancho natural (`caja × escala ≤ original`): en el hero a 1440 la escala baja a ~1,0. Utilidades en `lib/photo.ts`: `photoWidth`, `photoSrcSet`, `normalizeSrcSet`, `scaleSizes`, `clampCropScale`, `originalWidthFor`, `SMALL_ORIGINALS`, `PHOTO_MAX_WIDTH` |
| `<LtoBadge>` (interlineado 0,8 desde VIS-06) | `{ children, variant?: 'lime'\|'sauce'\|'garlic'\|'dough', size?: 'sm'(44)\|'md'(56)\|'lg'(88), tilt?, animate?, label? }`. Dos líneas con `'DEL\nMES'`. `tilt` viene apagado por defecto porque el playbook no permite rotarlo. Se ubica en la esquina superior izquierda del titular o sobre la foto |
| `<PriceTag variant="display">` | `surface?: 'auto'\|'dough'\|'basil'\|'sauce'`, `listPriceLabel?` («Antes desde $21.900»), `size`: `lg` 44/72 px (hero), `md` 36/48 (destacada y ficha), `sm` 28/32 (constructor) |
| Tipografía | `pj-display` (48/96), `pj-h1` (38/64), `pj-h2` (32/48), `pj-card-title` (20/24), `pj-body` (16), `pj-small` (13/14 en Bold), `pj-micro` (12 en Bold y mayúsculas). Los titulares toman `--pj-heading-color` |
| Superficies | `surface-basil`, `surface-sauce`, `surface-garlic`, `surface-dough`, `surface-pepperoncini`: cada una aplica fondo, texto ADA y las variables de titular, precio y acento. Dentro se usan `text-pj-heading`, `text-pj-price`, `text-pj-accent` y `text-pj-on-*`. Profundidad: `shadow-pj-card`, `shadow-pj-float`, `rounded-pj-section` (24) |
| Movimiento | `flyToCart(source?)`, `bumpCartCount()` y `[data-pj-cart-target]`. `showAddedToast` y `useShowAddedToast` ya los llaman. Todo respeta «reducir movimiento». Desde VIS-06 el aviso queda bajo el encabezado también en móvil (`theme/overrides/sonner.css`), así que el vuelo y el salto del contador se ven |
| `<AccentWord tone?>` | Palabra en un sello rotado −3° (reemplaza a Pappy): `tone` acepta `sauce`, `basil` o `lime` |

**Reglas:**
- Nunca dos bloques verdes seguidos.
- La lealtad va en `surface-sauce` y la franja de saludo en `surface-garlic`.
- Tangy Tomato nunca lleva texto.
- Prohibido escribir colores en hex en `pj-*`: lo detecta la prueba `palette.test.ts`.
- Ningún texto bajo 12 px.
