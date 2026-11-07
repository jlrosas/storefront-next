# pj-shared · piezas comunes de la demo de Papa Johns Chile

Componentes, utilidades y reglas visuales que usan todas las extensiones `pj-*`. Se importan desde
`@/extensions/pj-shared`. La marca manda: paleta y tipografía oficiales (S-D18, playbook BGYS).
La dirección visual está en `demo/revisiones/UX-1-direccion-visual.md`.

## Ritmo de color (VIS-04, UX-1 §3.1)

**Regla de base:** cada pantalla combina **un tono de marca + un complementario + un acento** (playbook
p. 58). El verde es el ancla (encabezado, CTA principal, fondo de las fotos), no el fondo de todo.

**Regla de oro: nunca dos bloques verdes seguidos.** Al bajar por una pantalla, alterna superficies:
crema → granate (lealtad) → crema → verde (momentos) → crema → footer verde. Si dos secciones verdes
quedan pegadas, cambia una a `surface-sauce` o mete una crema entre ellas.

### Superficies

Cada utilidad trae el fondo, el texto ADA, el color de titular (`text-pj-heading`), el de precio
(`text-pj-price`, que usa `PriceTag variant="display"` sin `surface`) y el de acento (`text-pj-accent`).

| Utilidad | Fondo | Texto | Titular | Precio / acento | Contraste |
|---|---|---|---|---|---|
| `surface-basil` | Fresh Basil | Dough | Dough | lima | 6,4 · lima 5,7 · lila 4,9 |
| `surface-sauce` | Rich Sauce | Dough | Dough | lima (lila como 2.º acento) | 10,1 · lima 9,0 · lila 7,7 |
| `surface-garlic` | Punchy Garlic | Rich Sauce | Rich Sauce | Basil | 7,7 · Basil 4,9 |
| `surface-dough` | Fluffy Dough | tinta | Basil | Rich Sauce | 14,1 · Basil 6,4 · Sauce 10,1 |
| `surface-pepperoncini` | Pickled Pepperoncini | Basil | Basil | Rich Sauce | 5,7 · Sauce 9,0 |

Tokens equivalentes en `src/theme/tokens/pj.css`: `--pj-on-basil`, `--pj-on-sauce`, `--pj-on-garlic`,
`--pj-on-dough`, `--pj-on-pepperoncini` (y sus `text-pj-on-*`).

### Combinaciones por componente (UX-1 §3.1)

| Superficie o componente | Fondo | Texto | Acento |
|---|---|---|---|
| Página (base) | Fluffy Dough `bg-pj-dough` | Titulares Basil; cuerpo tinta | — |
| Encabezado | Fresh Basil | Dough | CTA «Mi pedido» lima + texto Basil |
| Franja de saludo o beneficio (Valentina) | `surface-garlic` | Rich Sauce | Ícono Basil |
| Hero (texto sobre foto) | Foto + `bg-gradient-to-t from-pj-basil-deep via-pj-basil-deep/60 to-transparent` | Dough | Precio lima, `LtoBadge` lima |
| Bloque de lealtad (puntos, «Pedir directo tiene premio») | `surface-sauce` | Dough | Títulos y checks en lima o lila |
| Bloque de ofertas o momentos | `surface-basil` | Dough | Lila para la palabra de acento |
| Tarjeta de producto | Blanco o Dough + `shadow-pj-card` | Título Basil; precio Rich Sauce | `LtoBadge` |
| Precio de oferta y ahorro | — | Rich Sauce sobre crema; lima sobre Basil o Sauce | Nunca Tangy Tomato |
| Chips o filtros (reposo) | `bg-pj-dough-deep` | Basil | — |
| Chips o filtros (activo) | Basil | Dough | — |
| Etiquetas suaves («Para compartir», «Con postre») | Garlic | Basil o Sauce | — |
| Estado «Cerrada» | — | Rich Sauce | Punto Tangy Tomato (decorativo) |
| Estado «Abierta» | — | Fresh Basil | Punto Ripened Vine (decorativo) |
| Footer | Fresh Basil | Dough | Lockup BIBP en lima |

**Tangy Tomato** (`bg-pj-tomato`) solo va en formas, nunca con texto: subrayado de la pestaña activa,
punto del ícono activo de la barra inferior, barra de progreso de Papa Puntos, sello dentado decorativo
y punto de «Cerrada». **Ripened Vine** tampoco lleva texto.

### Profundidad sin colores nuevos

- Sombras cálidas: `shadow-pj-card` (tarjetas, Rich Sauce al 10 %) y `shadow-pj-float` (tarjeta que
  flota sobre la foto, hojas y barras fijas).
- Grano: el `body` lleva un ruido SVG al 4 % sobre la crema (`base.css`).
- Radio de sección: `rounded-pj-section` (24 px) para bloques de lealtad, momentos y la tarjeta flotante
  del hero. Tarjetas: `rounded-pj-card` (14 px). Controles: `rounded-pj-control` (10 px).

## Tipografía (VIS-03, UX-1 §3.3)

| Utilidad | Móvil | Escritorio | Uso |
|---|---|---|---|
| `pj-display` | 48/0.85 | 96/0.82 | Titular del hero |
| `pj-h1` | 38/0.9 | 64/0.88 | Título de página y de ficha |
| `pj-h2` | 32/0.9 | 48/0.9 | Título de sección |
| `pj-card-title` | 20/1 | 24/1 | Título de tarjeta y de grupo («Clásicas») |
| `pj-body` | 16/1.45 | 16/1.45 | Cuerpo |
| `pj-small` | 13 | 14 | Meta (★, tiempo), Bold |
| `pj-micro` | 12 | 12 | Etiqueta mínima, Bold, mayúsculas, +0.04em |

Los titulares (`h1`, `h2` y las utilidades de titular) van en `--pj-heading-color`: Basil sobre crema y
blanco, Dough sobre verde o granate. **Nunca en negro.** Ningún texto baja de 12 px (lo vigila
`lib/palette.test.ts`, junto con la prohibición de hex a mano en `pj-*`).

## Piezas visuales

- `FoodImage crop="macro" | "hero" | "combo" | "none"` y `cropForPhoto(idOrSrc, fallback)`.
- **Nitidez (VIS-06):** pasa en `sizes` el ancho de la **caja**; `FoodImage` lo multiplica por la escala del
  recorte y, ya montada, usa el ancho pintado medido. Pide al DIS `sw = ancho pintado × DPR × escala`, con
  tope en el original (1.440, o el de `SMALL_ORIGINALS`), y el recorte nunca agranda la foto por encima de
  su ancho natural. Si `src` es del DIS, el `srcSet` es opcional.
- `LtoBadge` (sello LTO circular) y `PriceTag variant="display"`.
- `flyToCart(source?)` y `bumpCartCount()` (`lib/fly-to-cart.ts`): al agregar, la foto vuela al
  carrito y el contador salta. `showAddedToast` ya lo llama; nada se mueve con «reducir movimiento».
- `AccentWord`: palabra de acento en un sello rotado −3° (en lugar de Pappy).

