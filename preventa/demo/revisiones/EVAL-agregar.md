# EVAL · Todos los mecanismos para agregar al carro

- **Fecha:** 07-nov-2026 · **Evaluador:** EVAL · **Rama:** `demo` (2ff6933), `storefront/`
- **Cómo:** lectura del código de la rama `demo` y de los diffs en curso (`git -C storefront-wt/<X> diff demo`) de PRO (PRO-08), HOM (HOM-09), MEN (MEN-07), TIE (TIE-06), ENT (integración temporal de HOM + MEN + TIE) y CAR (CAR-00, CAR-01). Evidencia del navegador tomada de [AUD-compra](AUD-compra.md), sin repetirla. Dos peticiones `curl` al sitio publicado, con 7 s entre ellas: `/search?q=palitos` y `/c/acompanamientos`. No se tocó código ni se usaron navegadores.
- **Libreto:**
  - [04](../../disenos/04-agregar-al-carro/README.md): reglas 1 a 9, v2 y v3;
  - [02](../../disenos/02-menu/README.md): mitades y Arma tu pizza;
  - [05](../../disenos/05-tienda-y-modalidad/README.md): regla 1;
  - [06](../../disenos/06-carrito/README.md);
  - [10](../../disenos/10-ofertas/README.md);
  - R1.1 y R2.1 de [requerimientos-demo.md](../../disenos/requerimientos-demo.md);
  - [CONTRATO](../CONTRATO.md): S-D3, §4.1, §6 y §7.

## Veredicto por tipo de producto

**La pizza cumple el libreto; el resto no, y la causa es la misma: hay 9 puertas de entrada distintas con 5 avisos distintos.** Solo la hoja y la ficha de pizza siguen la cadena completa: panel de tienda, línea con configuración, aviso con puntos y «Deshacer», y venta cruzada según la regla. Cada extensión escribió su propio «agregar», con su propia acción de servidor, su propio panel de tienda y su propio aviso. El trabajo en curso cierra casi todos los P0 de AUD **cambiando hacia dónde lleva cada entrada**, pero no reduce el número de mecanismos. PRO-08, de hecho, suma una segunda forma de agregar combos.

| Tipo | Hoy (`demo`) | Con el trabajo en curso | Qué falta y nadie corrige |
|---|---|---|---|
| **Pizza de especialidad** | ✅ desde el menú y la ficha · ❌ desde la Home (el «+» agrega sin la hoja; «Agregar» de Sofía navega) | ✅ HOM-09 abre la hoja desde la Home | En escritorio, «Hazlo combo» se ofrece **después de cada pizza**, no solo de la primera (D-P1-1). En la ficha la foto vuela dos veces (D-P1-4) |
| **Arma tu pizza** | ✅ hoja (pide tienda **al abrir**) | ✅ | Carrito sin extras (CAR lo corrige) |
| **Mitades** | ⚠️ armador ✅; el botón no tiene monto y el cobro es el base | ⚠️ PRO-08 pone el monto en el botón ($17.900) y la entrada «½ Mitad» en la ficha | El aviso sigue diciendo **+12 puntos** (precio base del carrito) contra $17.900 en el botón (D-P1-3). Depende del interruptor de hooks |
| **Super Dúo / Super Trío** | ✅ desde Promos y la Home · ❌ desde el menú, el buscador y `/p/cb-super-*` (se agregan sin pizzas) | ✅ MEN-07 (enlaces) + PRO-08 (302 al constructor) | El aviso no tiene «Deshacer» y los puntos restan el despacho (D-P1-2). El panel no dice «Super Dúo» (D-P2-4) |
| **Combos con ficha** (Pizza del Mes, Papa Flash, Combo Palitos, Combo con Postre) | ❌ ficha del template: se agregan sin elecciones, sin aviso y sin panel | ✅ PRO-08: ficha con lo más pedido, `c_pjComboChoices` y «Completa tu pedido» | El «Para 3» de Diego agrega `cb-pizza-del-mes` **sin `c_pjComboChoices`** y con puntos de todo el carrito (D-P1-5) |
| **Acompañamiento, bebida, postre, extra** | ✅ con el «+» del menú · ❌ desde el nombre (ficha del template) | ✅ PRO-08: ficha simple | El «+» del menú usa el aviso propio del menú, sin puntos ni «Deshacer» (D-P2-1). `/search` y `/c/*` del template siguen vivos (D-P2-2) |
| **Repetir pedido** | ⚠️ con sesión **reemplaza el carrito** y va al checkout; sin sesión, `/login` del template | Sin cambios | Pierde los extras (`optionItems`) y borra el carrito sin avisar (D-P2-5). `/login` (AUD P1-10, ING/INT) |

## 1. Inventario de mecanismos (rama `demo`)

Abreviaturas:
- **Tienda:** cómo pide la modalidad si no hay tienda elegida.
- **Micro:** las cinco piezas de la microinteracción v3:
  - V = vuelo;
  - C = contador que salta;
  - A = aviso «¡Agregada!»;
  - P = «+N Papa Puntos»;
  - D = «Deshacer».

| # | Mecanismo (archivo) | Se dispara desde | Agrega | Acción de servidor | Tienda | Qué guarda en la línea | Micro | Venta cruzada |
|---|---|---|---|---|---|---|---|---|
| **M1** | **Hoja de pizza** `PizzaSheet` (`pj-product/components/pizza-sheet.tsx` → `usePjCart`) vía `pj:configure-product` (`PjConfigureProvider`) | Menú: «Agregar» de `PizzaCard` y la tarjeta «Arma tu pizza» · Carrito «Editar» (con `itemId`; CAR-01) · Home (HOM-09, en curso) | Pizza, Arma tu pizza | `/action/pj-cart` `intent: pizza` → `addItemToBasket` (o `updateItemInBasket` al editar) | `ensureFulfillment` → `ensureStore` de pj-shared con nombre y monto, **al agregar**. Arma tu pizza pide la tienda **al abrir** la hoja (`pj-configure-provider.tsx:43`) | Variante tamaño-masa · `optionItems` `pjExtras_<id>=si` · `c_pjRemoved` | Pizza que no es la primera: V, C (dos veces: `bumpCartCounters` y el de `flyToCart`), A, P (de la línea, `linesTotal`), D. **Primera pizza en móvil:** sin aviso ni vuelo; la franja «agregada · Editar» del paso «Hazlo combo» la reemplaza (decisión de VAL-PRO R2) | «Hazlo combo» si `pizzaLineCount === 1` ✅. **En escritorio, con «Tu pedido» a la vista, `requestComboOffer` se dispara con cualquier pizza** (`pizza-sheet.tsx:245`, antes de mirar si es la primera) ❌ |
| **M2** | **Paso «Hazlo combo»** `HazloComboStep` | Dentro de M1 y de M5 (`UpsellSheet`) | Palitos de Ajo + bebida 1,5 L (`pj-hazlo-combo`) · «O agrega por separado» | `/action/pj-cart` `intent: add / remove / swap` | Hereda la de M1 | Líneas sueltas sin atributos; el precio del combo lo pone la promoción | Estado «Agregado» en el paso; sin aviso. Quitar sirve de deshacer | Es la venta cruzada |
| **M3** | **«Hazlo combo» compacto** `HazloComboCompact` en `OrderSummary` (`pj-menu/components/order-summary.tsx`) | Menú de escritorio (≥ lg), después de M1 | Palitos + bebida 1,5 L | `/action/pj-cart` `intent: add` | Hereda | Igual que M2 | Ninguna: la oferta solo se cierra | Se muestra si no hay palitos en el carrito, **sin mirar si es la primera pizza** ❌ |
| **M4** | **Ficha de pizza** `PizzaPdp` (`pizza-pdp.tsx`) | `/p/pz-*`: nombre en el menú, buscador del menú, tarjeta de la Home y favoritas de Sofía (hoy) | Pizza + complementos marcados | `/action/pj-cart` `intent: pizza` con `sides` | `ensureFulfillment`, siempre | Igual que M1, más una línea simple por complemento | V **dos veces** (`cart-bump.flyToCart` desde la foto, más `pj-shared.flyToCart` dentro de `showAddedToast`), C dos veces, A, P, D; el botón pasa a «Ver mi pedido» ✅ | «Completa tu pedido» (04 R7) ✅ |
| **M5** | **Armador de mitades** `HalvesBuilder`, como hoja (`halfFirst`) o como página `/mitades` | Menú: «½ Mitad», la tarjeta «Mitad y mitad» y `/p/pz-mitades` (redirige) · Carrito «Editar mitades» (CAR-01) · Ficha de pizza (PRO-08) | Pizza por mitades | `/action/pj-cart` `intent: halves` | `ensureFulfillment` (sin monto en `demo`; PRO-08 lo agrega) | `pz-mitades-<tamaño>-<masa>` · `c_pjHalves` · `c_pjParts=2` | V, C, A, **P del precio base** ($12.400 → 12, contra el promedio R2.1), D. Muestra **aviso y además** «Hazlo combo», al revés que M1 | «Hazlo combo» (`UpsellSheet`) si es la primera pizza ✅ |
| **M6** | **«+» de producto simple del menú** `useCartLine` (`pj-menu/hooks/use-cart-line.tsx`) + `CompactCard` | Menú: Acompañamientos, Bebidas (con el tamaño elegido en la tarjeta), Postres y Extras · resultados del buscador del menú | Acompañamiento, bebida, postre, extra | **Template** `/action/cart-item-add` (y `cart-item-update` / `cart-item-remove` para − y +) | `ensureStore` **copiado** en `pj-menu/lib/menu-bridge.ts` (mismos eventos), solo si la cantidad es 0. Sin nombre en `demo`; MEN-07 lo agrega | `productId` y cantidad | V, C, A propio `MenuAddedToast` («X agregada · $total del carrito» y «Ver pedido»). **Sin P ni D.** El «+» pasa a contador (04 p.7) ✅ | No (correcto: 04 R6 solo después de una pizza) |
| **M7** | **Home: agregar líneas** `useAddLines` (`pj-home/hooks/use-home-cart.tsx`) | Home: «+» de las pizzas destacadas (`QuickAdd`; HOM-09 lo retira) · «Para 3» de Diego (`ForThreeCard`) | Pizza Familiar (hoy) · `cb-pizza-del-mes` + Palitos + Coca-Cola 1,5 L | `/action/pj-home-cart` `intent: add` | En `demo`, despacho propio del evento; HOM-09 pasa a `ensureStore` de pj-shared con nombre | `productId` y cantidad. **El combo va sin `c_pjComboChoices`** | V, C, A propio `HomeAddedToast` con **P de todo el carrito** (`pointsFor(basket.productTotal)`), **sin D** | Ninguna (la pizza de `QuickAdd` se salta «Hazlo combo»: AUD P1-1) |
| **M8** | **Repetir pedido** `useReorder` (`use-home-cart.tsx`) | Home de Sofía | Las líneas del último pedido | `/action/pj-home-cart` `intent: reorder`: **borra el carrito** y agrega | No pide tienda; va directo al checkout | `productId`, cantidad y todos los `c_*` (`c_pjRemoved`, `c_pjHalves`, `c_pjComboChoices`). **No copia `optionItems`** (se pierden los extras) | Ninguna: navega al checkout | — |
| **M9** | **Constructor de combos** `ComboBuilder` (`pj-offers/components/combo-builder.tsx`) | `/promos/super-duo` y `/promos/super-trio`: Promos «Armar», Home de Diego (hero, «Para 4», «Para 6», momento Partido) · menú y buscador (MEN-07) · `/p/cb-super-*` (PRO-08) | Super Dúo, Super Trío | `/action/pj-combo-add`: valida `c_pjSlots` con `validateChoices` de OFE | Propio: `requestFulfillmentPanel` de `pj-offers/lib/hooks-fulfillment.ts`, sin nombre ni monto | `cb-*` · `c_pjComboChoices` | V, C, A propio `ComboAddedToast` con **P = `pointsFor(offer.price, despacho)`**: le resta el despacho a una línea e ignora los puntos dobles de Valentina. **Sin D.** El botón pasa a «Ver mi pedido» ✅ | Ninguna después del combo (AUD P2-7) |
| **M10** | **Ficha del template** `ProductContent` → `useProductActions` (`hooks/product/use-product-actions.ts`), `addToCartWithAddons` | `/p/<id>` de los **40** productos que no son pizza (AUD): nombre en el menú, buscador, Promos «Ver oferta», Home (hero, «Para 1», «Para 2» y momentos) | Combos (sin elegir nada), simples | Template `/action/cart-item-add` (y `cart-set-add` / `cart-bundle-add`, sin uso en el catálogo PJ) | **Ninguna.** Bloque BOPIS y código postal | `productId` y cantidad | Aviso y mini carrito del template | Recomendaciones Einstein del template |
| **M11** | **Lista de productos del template** `ProductTile` → `QuickAddButton` → `CartItemModal` → M10 | `/search?q=…` y `/c/<categoría>`: **siguen respondiendo 200** (título «Results for "palitos"», 8 `product-tile`). Solo se llega por URL: el encabezado y la barra inferior llevan al buscador del menú | Cualquiera | Template `cart-item-add` | Ninguna | `productId` | Template | — |
| **M12** | **Carrito del template**: `CartItemModal` «Editar» (actualiza, no agrega), `bonus-product-modal` y `bonus-product-selection` → `/action/bonus-product-add`, recomendaciones «También te puede gustar» | `/cart` del template (CAR-01 lo reemplaza por `PjCartPage`) | Producto de regalo de una promoción (ninguna promoción PJ lo usa) | Template | Ninguna | — | Template | — |
| **M13** | **Lista de deseos → carrito** (`wishlist-list-item.tsx`) | `/account/wishlist` (`/wishlist` redirige ahí). `PJ_FEATURES.wishlist = false` oculta los corazones, pero la ruta sigue viva | Cualquiera | Template `cart-item-add` | Ninguna | `productId` | Template | — |
| — | `LastOrderCard` (`components/last-order-card`) | Nadie lo monta (código muerto) | — | — | — | — | — | — |

### En curso, todavía fuera de `demo`

| # | Mecanismo | Rama | Qué cambia |
|---|---|---|---|
| **M14** | **Ficha de combo** `ComboPdp` y **ficha simple** `SimplePdp` con el hook `useAddFlow` (`hooks/use-pdp-add.ts`) | PRO (PRO-08) | Reemplaza M10 para los 40 productos. Combo: `/action/pj-cart` **`intent: combo`** con `c_pjComboChoices`, validado por un validador **nuevo** (`parseComboSlots`/`validateComboChoices` en `lib/combo-pdp.ts`), más `sides`. Simple: `intent: add` más `sides`. Tienda con `ensureFulfillment`, V (×2, igual que M4), C, A, P, D, «Ver mi pedido» y «Completa tu pedido». Super Dúo, Super Trío y combos vencidos → 302 al constructor o a `/promos` |
| M1 (Home) | `useConfigureLink` → `requestConfigure` | HOM (HOM-09) | El «+» de las destacadas, las favoritas de Sofía y el hero cuando es pizza abren la hoja. `QuickAdd` desaparece. El «Para 3» sigue en M7 |
| M6, M9 | Enlaces de oferta y nombre en el panel | MEN (MEN-07) | `offerHref`: Super Dúo y Super Trío → `/promos/<id>`. `ensureStore(name)` → «Para agregar tu Coca-Cola 1,5 L» |
| Panel | `requestFromEventDetail` | TIE (TIE-06) | `add-to-cart` sin nombre → «Para agregar a tu pedido.» y «Confirmar y agregar» |
| M1, M5 (Editar) | `CartLine` → `PizzaSheet` con `itemId` / `halfFirst` | CAR (CAR-01) | «Editar» del carrito abre la hoja de PRO (reemplaza `CartItemModal`). El aviso suma `detail` («Familiar · Tradicional · sin cebolla») |

## 2. Matriz tipo × entrada contra el libreto

✅ cumple · ❌ no cumple · ⚠️ cumple a medias · — no existe esa entrada. La columna «En curso» dice el estado **con** las ramas en curso integradas.

| Tipo | Entrada | Mecanismo hoy | Libreto | Hoy | En curso |
|---|---|---|---|---|---|
| Pizza especialidad | Menú «Agregar» | M1 | Hoja (04 R1; 02 «regla única») + «Hazlo combo» tras la primera (04 v2) | ✅ móvil · ❌ escritorio: ofrece «Hazlo combo» en cada pizza | Igual (nadie) |
| Pizza especialidad | Buscador del menú | M1 (`PizzaCard`) | Igual | ✅ | ✅ |
| Pizza especialidad | Ficha `/p/pz-*` | M4 | Ficha + «Completa tu pedido» en un solo botón (04 R7) + v3 | ✅ (vuelo doble) | ✅ + «½ Mitad» (PRO-08) |
| Pizza especialidad | Home «+» destacadas | M7 (agrega sin la hoja) | Hoja (04 R1) | ❌ | ✅ HOM-09 → M1 |
| Pizza especialidad | Home Sofía «Agregar · $16.900» | Navega a M4 | Hoja «sin salir de donde está» (04 objetivo) | ❌ | ✅ HOM-09 → M1 |
| Pizza especialidad | Carrito «Editar» | M12 (`CartItemModal` del template) | La hoja con todo marcado (06 R3) | ❌ | ✅ CAR-01 → M1 con `itemId` |
| Pizza especialidad | Repetir pedido | M8 | El pedido de siempre con su configuración | ⚠️ sin extras; borra el carrito | Igual (nadie) |
| Arma tu pizza | Menú, tarjeta | M1 (tienda al abrir) | Hoja (02 v3) | ✅ | ✅ |
| Arma tu pizza | Ficha `/p/pz-arma-tu-pizza` | M4 | Ficha | ✅ | ✅ |
| Arma tu pizza | Carrito «Editar» | M12 | Hoja (06 R3) | ❌ | ✅ CAR-01 |
| Mitades | Menú: «½ Mitad», tarjeta, `/p/pz-mitades` | M5 | Armador 02 p.3; botón con monto (04 R3); cobro del promedio (R2.1) | ⚠️ sin monto; cobra el base | ⚠️ PRO-08 pone el monto; puntos y cobro siguen en el base hasta el hook |
| Mitades | Ficha de pizza | — | «La ficha lleva al armador» (04 historial) | ❌ | ✅ PRO-08 (`/mitades?…`) |
| Mitades | Carrito «Editar mitades» | M12 | Armador (02 historial) | ❌ | ✅ CAR-01 |
| Super Dúo/Trío | Promos «Armar» y Home de Diego | M9 | Constructor (10 R1, R3; S-D3) | ✅ | ✅ (panel sin el nombre del combo) |
| Super Dúo/Trío | Menú (Ofertas) y buscador | M10 (sin pizzas) | Constructor | ❌ **P0** | ✅ MEN-07 |
| Super Dúo/Trío | URL `/p/cb-super-*` | M10 | Constructor | ❌ | ✅ PRO-08 (302) |
| Combos con ficha | Hero de Valentina, Home de Sofía, «Para 1», «Para 2», momentos, menú, buscador y Promos «Ver oferta» | M10 | Ficha con lo más pedido y «Agregar» (S-D3) + «Completa tu pedido» (04 R7) + v3 | ❌ **P0** | ✅ PRO-08 (M14) |
| Combos con ficha | Home de Diego «Para 3» | M7 | S-D3: el combo lleva sus elecciones (`c_pjComboChoices`, §7); aviso v3 | ❌ sin elecciones; puntos de todo el carrito; sin «Deshacer» | Igual (nadie) |
| Acompañamiento, postre, extra | Menú «+» | M6 | Directo con aviso (04 R1, p.7) | ✅ (aviso sin puntos ni «Deshacer»: v3 ⚠️) | ✅ + nombre en el panel (MEN-07) |
| Bebida | Menú: chip de tamaño + «+» | M6 | Tamaño en la tarjeta y directo (04 R1) | ✅ | ✅ |
| Simples | Nombre → ficha | M10 | Ficha simple PJ (04 p.7) | ❌ | ✅ PRO-08 (M14) |
| Simples | `/search?q=`, `/c/<cat>` (por URL) | M11 | No debería existir (02: el buscador es el del menú) | ❌ | Igual (nadie) |
| Cualquiera | `/account/wishlist` (por URL) | M13 | Sin lista de deseos | ❌ latente | Igual (nadie) |

### Rutas duplicadas (dos mecanismos para lo mismo, con comportamiento distinto)

| Qué se agrega | Mecanismos | En qué difieren |
|---|---|---|
| Pizza | M1 (hoja) · M7 (`QuickAdd` de la Home) · M10/M11 (template, por URL) | M7 se salta la hoja y «Hazlo combo». **HOM-09 lo retira**; M11 queda |
| Super Dúo / Super Trío | M9 (`/action/pj-combo-add` + `validateChoices` de OFE) · **M14 (`intent: combo` + `validateComboChoices` de PRO, nuevo)** · M10 (sin elecciones) | Dos acciones y dos validadores del mismo `c_pjSlots`. El aviso de M9 no tiene «Deshacer» y calcula mal los puntos; el de M14 sí los tiene. PRO-08 redirige los dúos al constructor, así que M14 solo agrega los otros combos; los dos validadores pueden divergir |
| Combo Pizza del Mes | M14 (ficha, con elecciones) · M7 «Para 3» (sin elecciones) | Misma línea `cb-pizza-del-mes`, con y sin `c_pjComboChoices` |
| Producto simple | M6 (template `cart-item-add` + `MenuAddedToast`) · M14 simple (`/action/pj-cart` + `AddedToast`) | Dos acciones y dos avisos para el mismo producto según se toque el «+» o el nombre |
| Palitos + bebida («Hazlo combo») | M2 (paso en la hoja) · M3 (panel de escritorio) | M3 no mira si es la primera pizza ni muestra aviso |
| Panel de tienda | `ensureStore` de pj-shared (PRO, HOM-09) · copia en `pj-menu/lib/menu-bridge.ts` · `requestFulfillmentPanel` de `pj-offers/lib/hooks-fulfillment.ts` · el de `use-home-cart` en `demo` (HOM-09 lo retira) | Mismos eventos, distintos textos: solo PRO pasa monto, OFE no pasa nombre |
| Aviso «¡Agregada!» | `AddedToast` (pj-shared: PRO, M14) · `MenuAddedToast` · `HomeAddedToast` · `ComboAddedToast` · aviso y mini carrito del template | Solo `AddedToast` tiene «Deshacer». Hay tres cálculos de puntos (línea / carrito / precio − despacho) |
| Vuelo y contador | `pj-shared/lib/fly-to-cart.ts` · `pj-product/lib/cart-bump.ts` (`flyToCart` y `bumpCartCounters`) | M4 y M14 llaman a las dos: dos imágenes vuelan y el contador salta dos veces |

### Rutas que se saltan el panel, la hoja o el aviso

- **Se saltan el panel de tienda:**
  - M8 (repetir) y M10, M11 y M13 (template);
  - M6 cuando la línea ya existe (correcto: el primer «+» ya pidió la tienda).
- **Se saltan la hoja** (pizza): M7 `QuickAdd` (HOM-09 lo corrige) y M10/M11.
- **Se saltan el aviso v3** (sin «Deshacer» o sin puntos):
  - M6, M7, M9 y M3;
  - M1 en la primera pizza en móvil (decisión VAL-PRO R2: la franja del paso confirma, pero no hay vuelo);
  - M8 (navega al checkout).

### Productos que se pueden agregar sin sus elecciones obligatorias

| Producto | Cómo | Estado |
|---|---|---|
| `cb-super-duo`, `cb-super-trio` | M10 desde el menú, el buscador y `/p/…` | ✅ lo corrigen MEN-07 + PRO-08 (302). **M11** (`/search`, `/c/ofertas`) sigue dejando agregarlos con el «Agregar rápido» del template ❌ |
| `cb-papa-flash`, `cb-papa-combo-palitos`, `cb-papa-combo-postre`, `cb-pizza-del-mes` | M10 | ✅ PRO-08 · ❌ M11 sigue |
| `cb-pizza-del-mes` | M7 «Para 3» | ❌ nadie |
| Cualquier `cb-*` | M8, si el pedido original no tenía `c_pjComboChoices` | Datos de DAT: el pedido de Sofía no tiene combos `cb-*`, así que no aplica a la demo |

**Barrera en el servidor:** `/action/pj-combo-add` y `intent: combo` validan `c_pjSlots`. En cambio, `/action/cart-item-add`, `/action/pj-home-cart` y `/action/pj-cart` `intent: add` aceptan un `cb-*` pelado: nada en el servidor impide un combo sin elecciones.

## 3. Desvíos priorizados

«En curso» indica si una rama ya lo corrige; «nadie» significa que ninguna rama lo toca.

### P0 · Rompen la compra o la demo

| # | Desvío | Dueño | En curso |
|---|---|---|---|
| D-P0-1 | Los 40 productos que no son pizza agregan desde la ficha del template (AUD P0-1, P0-4) | PRO | ✅ PRO-08 |
| D-P0-2 | Super Dúo y Super Trío se agregan sin pizzas desde el menú, el buscador y `/p/` (AUD P0-2) | MEN + PRO | ✅ MEN-07 + PRO-08 |
| D-P0-3 | **Orden de integración.** HOM-09 lleva el hero de Valentina y la Pizza del Mes de Sofía a `/p/cb-pizza-del-mes` (`offerHref`), que hasta PRO-08 es la ficha del template. Si ENT (HOM + MEN + TIE) entra a `demo` antes que PRO-08, el primer CTA de la demo sigue cayendo en AUD-01. Además, CAR-01 y PRO-08 tocan las mismas líneas de `halves-builder.tsx` (el bloque de `showAddedToast` y su `ensureFulfillment`) y de `pizza-pdp.tsx` | INT | **Nadie** coordina: integrar PRO-08 antes o junto con ENT, y resolver el conflicto CAR/PRO en `halves-builder.tsx` y `pizza-pdp.tsx` |

### P1 · No cumplen el libreto (y se ven en la demo)

| # | Desvío | Libreto | Dueño | En curso |
|---|---|---|---|---|
| D-P1-1 | **«Hazlo combo» después de cualquier pizza en escritorio.** `pizza-sheet.tsx:245` llama a `requestComboOffer` antes de comprobar `pizzaLineCount === 1`. `OrderSummary` solo lo descarta si ya hay palitos. Si el cliente rechaza la oferta en la primera pizza, se la vuelven a ofrecer en la segunda y la tercera | 04 v2 («solo después de la **primera** pizza»; dos momentos como máximo) | PRO (o MEN en `OrderSummary`) | **Nadie** (CAR-01 toca `OrderSummary`, pero no esa condición) |
| D-P1-2 | **Aviso del constructor** (Diego): sin «Deshacer»; los puntos son `pointsFor(offer.price, despacho)`. Con delivery, el Super Dúo dice +20 en lugar de +22, y no duplica para Valentina | 04 v3 (D37), R1.1 (el despacho se descuenta del **pedido**, no de la línea) | OFE | **Nadie** |
| D-P1-3 | **Mitades:** con PRO-08 el botón dice «Agregar · $17.900», pero el aviso calcula los puntos con la línea del carrito ($12.400 → +12), porque el hook de precio está apagado. El presentador ve dos números que no cuadran | R2.1, R1.1, pedido canónico | PRO (puntos desde `halvesPrice` mientras el hook esté apagado); Raúl/DAT (interruptor de hooks) | Parcial: PRO-08 solo el botón |
| D-P1-4 | **Vuelo doble en la ficha.** `pizza-pdp.tsx:145` llama a `cart-bump.flyToCart(hero)` y `showAddedToast` vuelve a llamar a `pj-shared.flyToCart()`: dos imágenes vuelan (700 ms y 450 ms) y el contador salta dos veces. PRO-08 copia el mismo patrón en `useAddFlow`, así que pasa a las fichas de combo y las simples | 04 v3 (una microinteracción limpia; «la demo debe competir») | PRO | **Nadie**, aunque cabe en PRO-08 (quitar `cart-bump.flyToCart` y `bumpCartCounters`) |
| D-P1-5 | **«Para 3» de Diego** (M7): agrega `cb-pizza-del-mes` sin `c_pjComboChoices`, así que el carrito de CAR no puede decir «The Works Familiar». El aviso suma los puntos de **todo el carrito** y no tiene «Deshacer» | S-D3, CONTRATO §7, 04 v3 | HOM (usar las elecciones por defecto que da `defaultComboSelection` de PRO-08) | **Nadie** (HOM-09 solo cambió el texto del panel) |
| D-P1-6 | Carrito: la línea no muestra extras ni «sin», y «Editar» es el del template (AUD P1-5, P1-8) | 06 R3 | CAR | ✅ CAR-01 |
| D-P1-7 | Panel abierto desde la Home sin el nombre del producto (AUD P1-9) | 05 R1 | HOM + TIE | ✅ HOM-09 + TIE-06 (OFE queda en D-P2-4) |

### P2 · Pulido o riesgo latente

| # | Desvío | Dueño | En curso |
|---|---|---|---|
| D-P2-1 | El «+» de simples del menú (M6) usa `MenuAddedToast`: «Cookie agregada · $40.…», con el total **del carrito** truncado, sin puntos ni «Deshacer». Desde la ficha simple de PRO-08 el mismo producto muestra `AddedToast`. Hay que elegir un aviso (04 p.7 pide «aviso con total y Ver pedido»; v3 suma puntos y «Deshacer») | MEN | Nadie |
| D-P2-2 | `/search?q=` y `/c/<categoría>` del template siguen vivos (200, «Results for…») con el «Agregar rápido» del template: sin panel y con combos sin elecciones. Solo se llega por URL, pero la barra inferior los marca como «Menú» | MEN o INT (redirigir a `/menu?q=` y `/menu#<categoría>`) | Nadie |
| D-P2-3 | `/account/wishlist` → carrito (M13): ruta viva aunque `PJ_FEATURES.wishlist = false` | INT | Nadie |
| D-P2-4 | El constructor (M9) pide el panel sin nombre. Con TIE-06 dice «Para agregar a tu pedido.», no «Para agregar tu Super Dúo.» | OFE (pasar `productName` y `amountLabel`) | Parcial (TIE-06) |
| D-P2-5 | Repetir pedido (M8): **vacía el carrito sin avisar** y no copia `optionItems`, así que una pizza con extras vuelve sin ellos. El pedido canónico de Sofía no tiene extras, por eso no se nota en el guion | HOM | Nadie |
| D-P2-6 | Primera pizza desde la hoja en móvil: sin vuelo (el aviso se suprime y con él `flyToCart`). Solo salta el contador | PRO | Nadie |
| D-P2-7 | Mitades muestra aviso **y** «Hazlo combo» a la vez; la hoja de pizza muestra solo «Hazlo combo». Dos comportamientos para «primera pizza» | PRO | Nadie |
| D-P2-8 | Nada se ofrece después de un combo del constructor (AUD P2-7) | OFE | Nadie |
| D-P2-9 | La sugerencia del carrito «Conviértelo en combo» (06 R1, R2.2), segundo momento de venta cruzada, no existe; CAR-01 solo agrupa y quita | CAR | Nadie (fuera del alcance de CAR-01) |
| D-P2-10 | Las acciones PJ (`/action/pj-cart`, `/action/pj-combo-add`, `/action/pj-home-cart`) no están en `ROOT_IRRELEVANT_MUTATIONS` (`lib/revalidation/routes/root.ts`): cada «agregar» recarga el loader raíz completo. Solo afecta el rendimiento | INT | Nadie |
| D-P2-11 | La hoja decide si pide tienda con `!readFulfillmentFromDocument()` (`pizza-sheet.tsx:202`) y no con `hasStore()`: una cookie sin `storeId` se salta el panel | PRO | Nadie |

## 4. Pruebas existentes

| Mecanismo | Pruebas unitarias o de integración | Sin probar |
|---|---|---|
| M1 hoja | `pizza.test.ts` (`optionItemsFor`, precios); `halves-upsell.test.ts` (`parsePjCartPayload`, `pizzaLineCount`, `sheetRequestFor`); `men-06.test.ts` (`requestComboOffer` con y sin panel) | El componente `PizzaSheet` (agregar, panel, paso «Hazlo combo», «Deshacer»); la acción `action.pj-cart.ts` en el servidor; la regla «solo la primera pizza» en escritorio |
| M2, M3 «Hazlo combo» | `halves-upsell.test.ts` (precio y ahorro de la promoción) | `HazloComboStep` y `HazloComboCompact` (agregar, quitar, cambiar sabor) |
| M4 ficha de pizza | — | Todo el flujo (`sides`, aviso, «Ver mi pedido»). Solo historias de Storybook |
| M5 mitades | `halves-upsell.test.ts` (`serializeHalves`, mitades iniciales); PRO-08 suma `halvesPrice` | `HalvesBuilder.save` (panel, aviso, upsell) |
| M6 «+» del menú | `menu-bridge.test.ts` (`ensureStore` del menú, `requestConfigure`); `pizza-card.test.tsx` | `useCartLine` (debounce, una petición a la vez, aviso). La acción del template `action.cart-item-add.test.tsx` sí está probada |
| M7, M8 Home | `home-blocks`, `home-hero`, `home-hom08` (render); HOM-09 suma `home-entries.test.tsx` (8 casos: el «+» y las favoritas abren la hoja) | `useAddLines`, `useReorder` y `action.pj-home-cart.ts` (reemplazo del carrito, copia de `c_*`) |
| M9 constructor | `combo.test.ts` (4 casos de `validateChoices`); `offers.test.ts` | `action.pj-combo-add.ts` y `ComboBuilder` (panel → agregar, aviso) |
| M10–M13 template | `action.cart-item-add`, `cart-set-add`, `cart-bundle-add`, `wishlist-*` (del template) | — (no son libreto PJ) |
| M14 PRO-08 | `pro-08.test.ts` (18 casos: tipo de producto, vista de ficha, payload `combo`, elecciones por defecto) | `useAddFlow`, `ComboPdp` y `SimplePdp` como componentes; `intent: combo` en el servidor |
| Comunes | `events.test.ts` (`ensureStore`, `requestConfigure`); `fly-to-cart.test.ts` (3 casos); `added-toast.test.tsx` (1 caso); `points.test.ts`; `fulfillment-store.test.ts` (TIE-06 suma casos) | `cart-bump.ts` (el vuelo duplicado); `MenuAddedToast`, `HomeAddedToast` y `ComboAddedToast` |
| **e2e** | **Ninguna** prueba e2e de PJ en `e2e/` | Todo recorrido de agregar de punta a punta |

**Conclusión:** solo hay pruebas de funciones puras (payloads, precios, validadores, eventos). **Ninguna de las tres acciones de servidor PJ ni ninguno de los nueve flujos de agregar tiene prueba.** Por eso pudo existir D-P1-1 aunque `men-06.test.ts` prueba `requestComboOffer`: la prueba verifica el evento, no **cuándo** se dispara.

## 5. Propuesta: una sola puerta de entrada

**Principio:** las pantallas deciden **qué** se agrega; una sola pieza decide **cómo**: tienda, servidor, aviso y venta cruzada.

1. **Elegir.** Todo producto que se configura entra por `requestConfigure(detail)` (`pj:configure-product`, ya existe en pj-shared). Hay que ampliar `ConfigureProductDetail` con `combo`.
   - PRO atiende pizza, Arma tu pizza y mitades con la hoja o el armador.
   - Para `cb-super-duo` y `cb-super-trio`, navega a `/promos/<id>`.
   - Para los demás combos, navega a la ficha de PRO-08.
   - Ninguna pantalla vuelve a escribir `/p/<id>` o `/promos/<id>` a mano: el destino sale de `pdpViewFor` y `builderPath` de PRO-08, movidos a pj-shared.

2. **Confirmar.** Una sola función de cliente, `usePjAdd()`, que sale del `useAddFlow` de PRO-08 y pasa a pj-shared o a un export de PRO. Hace, en orden:
   - `ensureStore({ productName, amountLabel })` de pj-shared;
   - POST a **una** acción, `/action/pj-cart`, con los intents `pizza | halves | combo | add | remove | swap | reorder`;
   - `setBasket`;
   - `showAddedToast` con el **único** `flyToCart`/`bumpCartCount` de pj-shared, los puntos de `linesTotal` de lo agregado y «Deshacer»;
   - `nextCrossSell(basket)`, una regla central: «Hazlo combo» solo si `pizzaLineCount === 1` y no hay palitos.

   El servidor valida `c_pjSlots` en **todo** `cb-*`, venga del intent que venga.

3. **Retirar:**
   - las acciones `/action/pj-combo-add` (OFE pasa a `intent: combo`) y `/action/pj-home-cart` (el «Para 3» pasa a `intent: combo` + `add`; repetir pasa a `intent: reorder`, que copia `optionItems`);
   - `MenuAddedToast`, `HomeAddedToast` y `ComboAddedToast`, que quedan como variantes de `AddedToast` con sus props;
   - las copias de `ensureStore` en `pj-menu/lib/menu-bridge.ts` y `pj-offers/lib/hooks-fulfillment.ts`, que pasan a reexportar pj-shared;
   - `pj-product/lib/cart-bump.ts`.

   Además, `/search` y `/c/*` redirigen al menú.

   El «+» del menú puede seguir usando `cart-item-update` para − y +, pero su **primer** agregado pasa por `usePjAdd`.

| Tipo | Puerta única para elegir | Puerta única para confirmar |
|---|---|---|
| Pizza, Arma tu pizza | `requestConfigure({ productId, size? })` → hoja | `usePjAdd({ intent: 'pizza' … })` |
| Mitades | `requestConfigure({ productId, halfFirst \| builder: 'mitades' })` → armador | `usePjAdd({ intent: 'halves' … })` |
| Super Dúo, Super Trío | `requestConfigure({ productId: 'cb-super-duo' })` → `/promos/super-duo` | `usePjAdd({ intent: 'combo', choices })` |
| Combos con ficha | `requestConfigure({ productId })` → ficha de PRO-08 · «Para 3»: sin elegir, con `defaultComboSelection` | `usePjAdd({ intent: 'combo', choices, sides })` |
| Simples | «+» en la tarjeta (sin elegir) o la ficha simple | `usePjAdd({ intent: 'add', items })` |
| Repetir pedido | — | `usePjAdd({ intent: 'reorder' })` (aviso «Repetimos tu pedido» o directo al checkout) |

**Orden sugerido** (sin pisar a quien trabaja hoy):
1. INT integra PRO-08 con ENT (D-P0-3).
2. PRO publica `usePjAdd` desde `useAddFlow`, ya sin el vuelo doble.
3. OFE, HOM y MEN migran su «agregar», una historia cada uno.
4. Se agrega una prueba de integración por intent en `action.pj-cart` y una de «Hazlo combo solo la primera vez».

## 6. Guion de verificación para VAL

**Preparación:**
- Chrome sin ventana, un contexto nuevo por bloque (cookies limpias, sin `pj_fulfillment`), a 390 px con DPR 2; donde se indique, también a 1440 px.
- Sitio: el ambiente donde estén integradas las ramas que se verifican. En `demo` puro, los pasos marcados **[en curso]** deben fallar como describe AUD.
- Antes de cada «Agregar», para contar vuelos y avisos, pegar en la consola:

```js
window.__pj = { fly: 0, toast: 0 };
new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
  if (!(n instanceof HTMLElement)) return;
  if (n.tagName === 'IMG' && n.style.position === 'fixed') window.__pj.fly++;
  if (n.querySelector?.('[data-testid="pj-added-toast"],[data-testid="pj-menu-added-toast"]')) window.__pj.toast++;
}))).observe(document.body, { childList: true, subtree: true });
```

- En cada agregado, revisar también la petición POST en la pestaña Red: la acción y el cuerpo (`payload`, `choices`, `lines`).

| # | Mecanismo | Pasos exactos | Resultado esperado |
|---|---|---|---|
| V1 | M1 hoja, primera pizza (390 px) | `/menu` → «Agregar» en Pollo BBQ → quitar Cebolla → «Agregar · $16.900» → en el panel, Retiro · El Bosque → «Confirmar y agregar» | El panel dice «Para agregar tu Pollo BBQ Familiar» con $16.900. POST `/action/pj-cart` `intent: pizza` con `removed: ["cebolla"]` (o el id del catálogo). Pasa al paso «Hazlo combo» con la franja «Pollo BBQ agregada · Editar»; el contador salta. `__pj.toast = 0` (decisión de VAL-PRO R2) |
| V2 | M1, segunda pizza (390 px) | En el mismo contexto: «No, gracias» → «Agregar» en Pepperoni → «Agregar» | Sin panel. Aviso «¡Agregada! Pepperoni …» con «+N Papa Puntos», N = floor(precio de la línea / 1000), y «Deshacer». **No** aparece «Hazlo combo». `__pj.fly = 1`. «Deshacer» quita solo esa línea |
| V3 | M1 en escritorio (1440 px) · **D-P1-1** | Contexto nuevo con tienda → `/menu` → «Agregar» en Pollo BBQ → «Agregar» → en «Tu pedido», cerrar la oferta sin aceptar → «Agregar» en Pepperoni → «Agregar» | **Esperado (libreto):** la oferta «Hazlo combo» aparece bajo la Pollo BBQ y **no** vuelve bajo la Pepperoni. **Hoy:** vuelve (desvío) |
| V4 | M2 «Hazlo combo» | Repetir V1 → «Sí, hazlo combo» → cambiar el sabor a Coca-Cola Sin azúcar → «Ver mi pedido» | POST `intent: add` con palitos y bebida 1,5 L, luego `intent: swap`. Total del carrito $16.900 + $6.990 = $23.890 (el precio lo aplica la promoción) |
| V5 | M4 ficha de pizza · **D-P1-4** | `/p/pz-pollo-bbq` → marcar Palitos de Ajo en «Completa tu pedido» → «Agregar» | POST `intent: pizza` con `sides: ["cp-palitos-de-ajo…"]`. Aviso con puntos y «Deshacer»; el botón pasa a «Ver mi pedido · $X». **Esperado:** `__pj.fly = 1` (hoy da 2). [en curso PRO-08] Botón «½ Mitad» → `/mitades?…` |
| V6 | M5 mitades · **D-P1-3** | `/menu` → «½ Mitad» en Pollo BBQ → segunda mitad Todas las Carnes → Familiar Tradicional → «Agregar» → elegir tienda | [en curso PRO-08] El botón dice «Agregar · $17.900» y el panel muestra $17.900. POST `intent: halves` con `halves: ["pz-pollo-bbq","pz-todas-las-carnes"]`. **Esperado:** el aviso dice +17 puntos y el carrito cobra $17.900. Hoy: +12 y $12.400 mientras el hook esté apagado. Si es la primera pizza, aparece «Hazlo combo» |
| V7 | M1 Arma tu pizza | Contexto sin tienda → tarjeta «Arma tu pizza» | El panel se abre **antes** que la hoja («Para armar tu pizza…»). Champiñón aparece «agotado» en El Bosque. Agregar con Pepperoni + Choclo → POST con dos `optionItems` `pjExtras_*` = `si` |
| V8 | M6 «+» de simples | Contexto sin tienda → `/menu#bebidas` → chip «1,5 L» de Coca-Cola → «+» → elegir tienda → «+» otra vez → «−» | Panel [en curso MEN-07: «Para agregar tu Coca-Cola 1,5 L»]. POST `/action/cart-item-add` con `cp-coca-cola-2`, luego PATCH `cart-item-update` con cantidad 2. Aviso del menú con «Ver pedido»; anotar si tiene puntos y «Deshacer» (D-P2-1). El «+» pasa a «− 2 +» |
| V9 | M9 constructor · **D-P1-2** | `/promos/super-duo?perfil=diego` sin tienda → elegir 2 pizzas → «Agregar Super Dúo · $22.590» → Delivery a Av. Providencia 1234 → confirmar | POST `/action/pj-combo-add` con `choices` de 2 elementos. El panel dice [TIE-06] «Para agregar a tu pedido.» (esperado del libreto: «…tu Super Dúo»). **Esperado:** aviso con +22 puntos y «Deshacer». Hoy: +20 y sin «Deshacer». El botón pasa a «Ver mi pedido» |
| V10 | Super Dúo por otras entradas [en curso MEN-07 + PRO-08] | 1) `/menu` → Ofertas → Super Dúo · 2) buscador del menú «dúo» → Super Dúo · 3) abrir `/p/cb-super-duo` · 4) abrir `/search?q=duo` y `/c/ofertas` | 1 a 3 terminan en `/promos/super-duo` (3 con 302). **4 (D-P2-2): esperado** que redirija al menú; hoy muestra el listado del template. Con «Agregar rápido» el combo se agrega sin pizzas: anotar |
| V11 | M14 ficha de combo [en curso PRO-08] | `/p/cb-papa-combo-palitos` (sin tienda) → no cambiar nada → «Agregar» → elegir tienda | Lo más pedido ya marcado; sin código postal ni «Retiro gratis». POST `/action/pj-cart` `intent: combo` con `choices`. Aviso con puntos y «Deshacer». El carrito (CAR-01) muestra la pizza y la bebida del combo |
| V12 | M14 ficha simple [en curso PRO-08] | `/p/cp-coca-cola` → «Agregar» | Tamaño preseleccionado; POST `intent: add`; `AddedToast` con puntos y «Deshacer». Comparar con V8: es el mismo producto con otro aviso (D-P2-1) |
| V13 | M14 combo vencido | `/p/cb-box-halloween` | 302 a `/promos/box-halloween` → «Esta oferta terminó el 2 de noviembre» con 3 alternativas (R2.7) |
| V14 | Home Valentina [en curso HOM-09] | `/?perfil=valentina` sin tienda → «+» de Pollo BBQ en las destacadas | Se abre la **hoja** sobre la Home (sin navegar). Tras agregar: panel con nombre, luego «Hazlo combo» |
| V15 | Home: hero de Valentina [en curso HOM-09 + PRO-08] | `/?perfil=valentina` → «Lo quiero $10.990» | Lleva a la ficha PJ de `cb-pizza-del-mes` (nunca a la del template: si aparece «código postal», **D-P0-3**) |
| V16 | Home de Sofía [en curso HOM-09] | Con sesión `val1@demo.pj.cl` → «Agregar · $16.900» de una favorita | Hoja de Pollo BBQ Familiar sobre la Home |
| V17 | M7 «Para 3» de Diego · **D-P1-5** | `/?perfil=diego`, con 1 producto ya en el carrito → tarjeta «Para 3» | POST `/action/pj-home-cart` `intent: add`. **Esperado:** la línea `cb-pizza-del-mes` lleva `c_pjComboChoices` (revisar la respuesta) y el aviso suma solo los puntos de esas 3 líneas, con «Deshacer». Hoy: sin elecciones, con los puntos de todo el carrito y sin «Deshacer» |
| V18 | M8 repetir · **D-P2-5** | Con sesión `val1@demo.pj.cl` y 1 producto en el carrito → Home → «Repetir pedido» | POST `intent: reorder` → checkout con Pollo BBQ «sin cebolla» + palitos + Coca-Cola Sin azúcar = $23.890. Anotar que el producto que estaba antes **desapareció** sin aviso. Sin sesión: no debe llevar a `/login` del template (AUD P1-10) |
| V19 | Carrito «Editar» [en curso CAR-01] | Desde el carrito de V1 → «Editar» en Pollo BBQ → agregar Pepperoni → «Guardar cambios» | Se abre la hoja de PRO con «sin cebolla» marcado. POST `intent: pizza` **con `itemId`** (actualiza, sin línea nueva). Sin panel y sin aviso. «Editar mitades» en la línea de V6 abre el armador |
| V20 | Lista de deseos · **D-P2-3** | Abrir `/account/wishlist` con sesión | Esperado: no existe o redirige. Anotar si muestra «Agregar al carrito» del template |

**Cierre de VAL:** por cada fila, ✅/❌ con captura y la petición de la pestaña Red. Los desvíos que se confirmen se reportan con su número (D-…) para que el dueño los tome.
