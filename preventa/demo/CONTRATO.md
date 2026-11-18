# Contrato compartido de la demo

- **Fecha:** 06-nov-2026 · **Dueño:** INT (cambios solo por INT; DAT los propone)
- **Para qué:** que los agentes que trabajan en paralelo usen **los mismos nombres, datos y piezas**. Si una historia y este contrato no coinciden, manda el contrato y la diferencia se reporta.
- **Fuentes:** diseños 01–12, [requerimientos-demo.md](../disenos/requerimientos-demo.md) (R1–R6), `datos/raw/*.json` (API del cliente, 13-oct) y `storefront/site-data/`.

## 1. Supuestos de la demo (cierran vacíos del diseño)

| ID | Supuesto | Por qué |
|---|---|---|
| S-D1 ✅ aprobado (Raúl, 06-nov) | **El Box Halloween terminó el 2-nov.** El hero de temporada pasa a la **Pizza del Mes de noviembre: The Works Familiar a $10.990, antes desde $21.900**, vigente del 2-nov al 7-dic según la API de papajohns.cl consultada el 06-nov. La Boom de Jamón del lienzo venció el 1-nov. El Box Halloween pasa a ser el ejemplo real de **oferta vencida** («Esta oferta terminó el 2 de noviembre»). Los reemplazos están en la tabla §1.1 | La demo es el 20-nov; mostrar una oferta vencida como vigente resta credibilidad |
| S-D2 ✅ (Raúl, 06-nov) | **Ocasiones de Diego** (R4.3), como en el lienzo salvo Celebración: Almuerzo → Papa Flash $5.490 · Partido → **Super Trío** $33.900 · Celebración → **Papa Combo con Postre** $17.490 (pizza + bebida + postre, vigente) · Bajón → Papa Combo Palitos $16.490 | Reemplaza a Halloween en Celebración sin repetir el Super Dúo del hero (UX v2, hallazgo 3) |
| S-D3 ✅ (REV) | **Constructores de combo:** solo los dibujados, Super Dúo y Super Trío. Papa Flash, Papa Combo Palitos y Papa Combo con Postre abren su ficha con lo más pedido preseleccionado y «Agregar» | No hay diseño de otro constructor y ningún guion lo necesita |
| S-D4 ✅ aprobado por ahora (Raúl, 06-nov) | **Pago con tarjeta simulado:** formulario con la forma del Card Payment Brick (número, MM/AA, CVV, titular, RUT, cuotas), sin pasarela. **Se mantiene la marca y los textos de Mercado Pago del lienzo**; el presentador aclara que la integración es parte del proyecto. Aprueba cualquier tarjeta de prueba salvo `4000 0000 0000 0002`, que se rechaza. **Efectivo** es un medio de pago real de Commerce, habilitado por tienda | Mercado Pago entra en el proyecto; en la demo se ve igual |
| S-D5 | **Seguimiento sin OMS:** el estado vive en el pedido de Commerce (`c_pjStatus`) y lo avanza el panel del presentador | OMS pasa a la segunda etapa |
| S-D6 | **Papa Puntos simulado en Commerce:** saldo y movimientos en el perfil del cliente | Synerise o Loyalty quedan para el proyecto |
| S-D7 | **El código de ingreso** llega por el mecanismo de SLAS que se pueda configurar en el sandbox. Si no se puede enviar, el código se muestra en el panel del presentador. Nunca se usa un código fijo en la tienda | Es la experiencia real sin depender de SMS |
| S-D8 | **Fotos:** las de papajohns.cl en su mayor resolución disponible (`thumbnails.extra_large` o el original del CDN). Ninguna con texto incrustado en hero o tarjetas | Decisión del 06-nov |
| S-D9 | **Reseñas y popularidad:** datos de ejemplo de R4.4, guardados como atributos del producto | R4.4 |
| S-D10 ⏳ pendiente de revisar (Raúl, 06-nov) | **Comer aquí** (tercera modalidad de 05): por ahora no se construye; queda abierta la decisión | Si se aprueba, TIE suma una historia (estado del comedor y cantidad de personas) en la oleada 1 |
| S-D11 | **Factura con RUT:** se muestra y valida el RUT en el checkout; se guarda en el pedido, sin integración | 07 |
| S-D12 ✅ (Raúl, 06-nov) | **Números de Sofía:** paga $23.890 y canjea una Super Pepperoni mediana gratis (260 puntos). Saldo: 340 − 260 + 23 = **103** ($5.150). El descuento por banco (BIN) **no** corre en su guion: es un caso sorpresa que el panel activa | Una sola cuenta que el cliente puede seguir en vivo |
| S-D13 ✅ (REV) | **Sin promesas que la demo no cumple** (no hay Marketing Cloud). Se cambian estos textos del lienzo:<ul><li>«Te avisamos por SMS en cada paso…» → «Sigue cada paso aquí, en vivo».</li><li>«Te avisamos por SMS al +56… cuando esté listo» → «Te mostramos aquí cuando esté listo».</li><li>«Te enviamos el recordatorio por SMS o correo» → «Listo, te lo recordaremos el viernes».</li><li>«Sigues tu pedido en vivo, sin crear cuenta» → «Sigues tu pedido en vivo».</li><li>El texto del código en el ingreso dice a dónde se envió de verdad (S-D7).</li></ul> | Objetivo 2: sin promesas falsas |
| S-D14 ✅ (REV) | **Invitado oculto:** el ingreso no muestra «Seguir sin cuenta», «¿Prefieres no crear cuenta?» ni «Pagar como invitada», y la página de puntos no muestra «¿Gano puntos si pido como invitado?» | Demo con clientes registrados; un toque que lleva a ninguna parte |
| S-D15 ✅ (REV) | **Super Dúo para retiro y delivery**, como en el lienzo. «Solo retiro» (caso 2) es un interruptor del panel | Si fuera fijo y Diego eligiera delivery, la promesa del anuncio fallaría |
| S-D16 ✅ (REV) | **Un solo número por oferta:** Super Dúo «Para 4», Super Trío «Para 6 o más», Pizza del Mes Familiar «Para 3–4» | Principio 4 y regla 3 de 01 |
| S-D18 ✅ (Raúl, 06-nov) | **Marca oficial, no la del lienzo:** tipografía **Papa Sans** (la de papajohns.cl; titulares en Medium Condensed y mayúsculas, texto en Regular/Bold) y la **paleta oficial del playbook BGYS** (p. 58): Fresh Basil #2D5D2A, Pickled Pepperoncini #CFEB0C, Fluffy Dough #F5E8DC, Rich Sauce #710500, Tangy Tomato #FF0000, Punchy Garlic #E3C2ED y Ripened Vine #65A17A, con sus reglas ADA (p. 60, 64 y 65). **Tangy Tomato no lleva texto en digital**: el precio de oferta y el ahorro van en Rich Sauce. Reemplaza los colores y la Barlow del lienzo | El cliente reconoce su marca; el playbook es su fuente oficial |
| S-D19 ✅ (Raúl, 07-nov) | **Venta cruzada en toda pizza y combo con pizzas (cambia la regla v2 del libreto 04):** después de agregar cualquier pizza, mitades, Arma tu pizza, Super Dúo, Super Trío o Pizza del Mes, la hoja ofrece **«Completa tu pedido»**: bebidas por tamaño (1,5 L y 2 L o 3 L; si el combo trae bebida, subirla de tamaño), acompañamientos y postres, un toque por producto, sin obligar. «Hazlo combo» sigue siendo la oferta principal cuando aplica (pizza sola). El carrito muestra **«¿Le sumamos algo?»**: 3 recomendaciones (bebida, acompañamiento, postre) según lo que falta en el pedido, nunca pizzas | Sube el ticket y el *cross-selling* (25 % → 35 %); en delivery de pizza la bebida grande es lo normal |
| S-D20 ✅ (Raúl, 07-nov, opción A) | **Super Dúo y Super Trío como pizzas reales + promoción:** el constructor agrega las pizzas como líneas de pizza normales (cada una personalizable con la misma hoja: extras como «+ Pepperoni», «sin cebolla», masa) y una promoción de Commerce les aplica el precio del combo ($22.590 / Super Trío), activada solo cuando el cliente arma el combo (cupón o mecanismo que defina DAT). Los extras se cobran con `optionItems`, igual que en una pizza suelta. Las líneas llevan un atributo de grupo para que el carrito las muestre juntas bajo «Super Dúo» | Precio real en carrito y checkout, extras cobrados, el mismo modelo que tendría el proyecto |
| S-D17 ✅ (REV) | **Textos exactos:** los criterios citan el sentido. **El texto que manda es el del lienzo**, salvo lo que cambian los supuestos S-D | Evita retrabajo de VAL |

### 1.1 Reemplazos por S-D1 (Halloween → Pizza del Mes The Works)

| Dónde | Lienzo | Demo |
|---|---|---|
| Hero de `Home` y `Home-Desktop` (Valentina) | Box Halloween de Miedo $19.990 | Pizza del Mes The Works Familiar $10.990, antes desde $21.900 |
| Bloque «Pizza del mes» de `Home` (Valentina) | Boom de Jamón $10.990 | Se quita: ya es el hero (no se repite) |
| Pizza del Mes de Sofía (`Home-Sofia`) | Boom de Jamón | The Works $10.990 |
| Ofertas del menú (`Menu`, `Menu-Desktop`) | Box Halloween | Pizza del Mes The Works |
| Destacada de `Ofertas` y `Ofertas-Desktop` | Box Halloween | Pizza del Mes The Works |
| `Oferta-Vencida` | Día de la Pizza (terminó el 9 de febrero); 1.ª alternativa Box Halloween | **Box Halloween de Miedo, terminó el 2 de noviembre**; alternativas: Pizza del Mes The Works, Super Dúo y Papa Combo con Postre |
| Celebración de Diego | Box Halloween | Papa Combo con Postre (S-D2) |
| «Para 3» de Diego | Pizza del mes + Palitos + bebida = $20.470 | Pizza del Mes The Works + Palitos de Ajo + Coca-Cola 1,5 L; precio = suma real de las tres líneas |

## 2. Perfiles y cómo se reconocen

| Perfil | Cómo llega | Regla (R4.1) | Grupo de clientes |
|---|---|---|---|
| **Valentina** | Sin sesión, o con `?utm_campaign=reactivacion` | Por defecto | `pj-reactivacion` (al ingresar) |
| **Diego** | `?utm_campaign=PJSD26` o `/promos/super-duo` | Parámetro de campaña → source code `PJSD26` | `pj-anuncio` (por source code) |
| **Sofía** | Sesión iniciada con historial | Cliente con pedidos | `pj-frecuente` |

- **Forzar perfil (solo demo):** `?perfil=valentina|diego|sofia` guarda la cookie `pj_perfil`. Lo usan el panel y los validadores. `?perfil=auto` vuelve a la regla.
- **Forzar hora (R4.2):** `?hora=almuerzo|partido|celebracion|bajon|ahora` guarda la cookie `pj_hora`.
- **Función única:** `getDemoProfile(context)` y `getDemoMoment(context)` en `pj-shared/lib/profile.ts`, que hace INT. Nadie más decide el perfil por su cuenta.

## 3. Clientes de demo (los crea DAT)

| Login (correo) | Perfil | Saldo | Historial | Uso |
|---|---|---|---|---|
| `sofia@demo.pj.cl` | Sofía | 340 pts | 6 pedidos; el último (2 oct): Pollo BBQ Familiar sin cebolla + Combo Palitos de Ajo con Coca-Cola Sin azúcar 1,5 L ($23.890); favoritas Pollo BBQ y Todas las Carnes; tarjeta guardada Visa ····4521 (BIN 424242, en la lista de la promoción); dirección «Av. Providencia 1234, depto 504» (como en el lienzo) | Presentador |
| `diego@demo.pj.cl` | Diego | 0 pts | Sin pedidos | Presentador |
| `valentina@demo.pj.cl` | Valentina | 40 pts | 1 pedido de hace 2 años; puntos dobles en el próximo | Presentador |
| `val1@demo.pj.cl` … `val3@demo.pj.cl` | Copias de Sofía | 340 pts | Igual que Sofía | Validadores (uno por instancia de Chrome) |
| `dev-<código>@demo.pj.cl` | Copia de Sofía | 340 pts | Igual que Sofía | Un cliente por agente constructor |

Los correos `@demo.pj.cl` son ficticios. El correo y el celular del presentador (insumo I7) reemplazan a los de Sofía, Diego y Valentina antes de la demo.

## 4. Datos de Commerce (los crea DAT)

### 4.1 Catálogo

| Concepto | Nombre | Valores |
|---|---|---|
| Tipo de producto | `c_pjKind` | `pizza`, `builder`, `combo`, `side`, `drink`, `dessert`, `extra` |
| Variación (existentes) | `pjSize`, `pjCrust` | `individual`, `medium`, `family`, `extra_large` · masas del cliente |
| Grupo de pizza | Subcategorías de `pizzas` | `pizzas-clasicas`, `pizzas-favoritas`, `pizzas-premium`, `pan-pizza`, `pizzas-croissant` |
| Insignias | `c_pjBadges` (multi) | `mas-pedida`, `novedad`, `ideal-para-2` |
| Tipo de comida | `c_pjFoodType` (multi) | `vegetariana`, `picante` |
| Texto que se saborea | `c_pjSensory` | Una frase por producto (propuesta editorial) |
| Para cuántos | `c_pjServes` (en la variante) | «Para 2–3», «Para 3–4», «Para 4–5» |
| Popularidad y reseñas | `c_pjWeeklyOrders`, `c_pjRating`, `c_pjReviewCount` | Tabla R4.4 |
| Ingredientes base | `c_pjBaseIngredients` (multi, IDs) | Los de la especialidad; se pueden quitar |
| Admite mitades | `c_pjHalvesEnabled` (bool) | `true` en las 16 especialidades; `false` en Pan Pizza y Croissant |
| Canjeable con puntos | `c_pjRedeemPoints` (int) | Super Pepperoni 260, Boom de Jamón 218, Napolitana Caprese 218 |
| Ocasión (combos) | `c_pjOccasion` (multi) | `para-1`, `para-2`, `para-3`, `para-4`, `para-6` |
| Ingredientes extra | **Option product** `pjExtras` con un valor por ingrediente y precio por tamaño (Mediana $1.450, Familiar $1.940, Extra grande $2.290) | Desde `datos/raw/ingredients.json` (31 ingredientes con foto) |
| Ingredientes quitados | Atributo de la línea `c_pjRemoved` (lista de IDs) | — |
| Pizza por mitades | Producto `pz-mitades` (variaciones de tamaño y masa); atributos de la línea `c_pjHalves` (JSON `[{"part":1,"product":"pz-pollo-bbq"},…]`) y `c_pjParts` (2) | Precio = promedio de las especialidades (R2.1), calculado en el cartucho |
| Combos | Productos `cb-super-duo`, `cb-super-trio`, `cb-papa-combo-palitos`, `cb-papa-flash`, `cb-papa-combo-postre`, `cb-pizza-del-mes` (The Works Familiar $10.990, hasta el 7-dic), `cb-box-halloween` (vencido el 2-nov) | Atributos `c_pjSlots` (JSON con lo que se elige), `c_pjValidTo`, `c_pjDispatch` (`delivery`, `pickup`, `both`) |

### 4.2 Promociones y medios de pago

| ID | Qué hace | Requerimiento |
|---|---|---|
| `pj-combo-palitos-upsell` | «Conviértelo en combo»: pizza + palitos + bebida 1,5 L bajan al precio del combo | R2.2 |
| `pj-hazlo-combo` | Oferta de la hoja después de la primera pizza (+$6.990, ahorras $2.490) | 04 |
| `pj-super-duo-pickup` | Super Dúo **solo retiro**: apagada por defecto; la activa el panel (caso 2, S-D15) | R2.6 |
| `pj-bin-banco` | 20% en productos, tope $5.000, si el BIN está en la lista `c_pjBinList` (preferencia del sitio); el checkout la aplica con el cupón interno `BINDEMO` | R2.4 |
| `pj-canje-puntos` | Deja en $0 la pizza canjeada | R1.8 |
| Gift certificate `PJ-GIFT-2026` | Saldo de $10.000 | R2.5 |
| Medios de pago | `PJ_CARD_DEMO` (tarjeta simulada, S-D4), `PJ_CASH` (efectivo, habilitado por tienda con `c_pjCash`), `GIFT_CERTIFICATE` | 07 |
| Source code `PJSD26` | Asigna el grupo `pj-anuncio` (Diego) | T2 |

### 4.3 Tiendas y modalidad

- Tiendas `pj-<id>` (32). Para la demo:
  - **El Bosque:** abierta, 15 min.
  - **Salvador:** abierta, 35 min.
  - **Providencia:** **cerrada**, abre a las 12:00 (caso 1).
- Atributos: `c_pjPickupMinutes`, `c_pjDeliveryMinutes`, `c_pjOpenUntil`, `c_pjOpensAt`, `c_pjCash`, `c_pjClosed` (bool, forzable desde el panel).
- Modalidad elegida: cookie `pj_fulfillment` = `{mode: "pickup"|"delivery", storeId, address?, when: "asap"|ISO}`. Con sesión se guarda también en el perfil.
- **Delivery:** mínimo $12.000, despacho $1.990, ventana del pedido canónico 21:05–21:15.

### 4.4 Pedido

| Atributo del pedido | Valores |
|---|---|
| `c_pjStatus` | `recibido`, `preparacion`, `listo` (retiro), `en_camino` (delivery), `entregado`, `retirado` |
| `c_pjStatusAt` | ISO del último cambio («actualizado hace X min», R3.4) |
| `c_pjEta` | ISO de la hora estimada |
| `c_pjPointsEarned`, `c_pjPointsState` | Puntos del pedido; `por_acreditar` o `acreditados` (R1.7) |
| `c_pjDocType`, `c_pjRut`, `c_pjBusinessName`, `c_pjBusinessActivity`, `c_pjBusinessAddress` | Boleta o factura (S-D11) |
| `c_pjCashAmount` | Con cuánto paga (efectivo al recibir) |
| `c_pjNote` | Nota para la tienda |
| `c_pjOrderRating` | Opinión de 1 a 5 (SEG-03); no confundir con `c_pjRating` del producto |
| `c_pjReminder` | Recordatorio elegido («viernes 20:00»); sin envío en la demo |
| `c_pjRedeemed` | Puntos canjeados en el pedido (S-D12) |

### 4.5 Perfil del cliente

`c_pjPoints` (saldo), `c_pjPointsLog` (JSON de movimientos), `c_pjFavorites` (IDs de producto), `c_pjDoublePoints` (bool, Valentina), `c_pjMarketingOptIn` (bool, R4.8).

### 4.6 Operaciones de la demo (servidor)

El storefront cambia estados y puntos con **OCAPI Data API**, usando las credenciales de servidor (variables sin `PUBLIC__`, nunca en el cliente). Las rutas están en `pj-shared`:

| Ruta | Hace |
|---|---|
| `POST /resource/pj-demo/order-status` | Avanza `c_pjStatus` de un pedido (panel) |
| `POST /resource/pj-demo/points` | Acredita o descuenta puntos (al entregar, al canjear) |
| `POST /resource/pj-demo/store-closed` | Abre o cierra una tienda (caso 1) |

Solo responden si la cookie de presentador está presente.

## 5. Piezas compartidas (`src/extensions/pj-shared`, las hace INT en la oleada 0)

| Pieza | Qué es |
|---|---|
| Tokens | Colores del lienzo: verde de marca y botones, rojo tomate `#B3261E` para precios de oferta, estrella `#8F5400`, gris de texto; tipografía, radios y sombras |
| `PriceTag` | Precio ahora, precio antes tachado y ahorro en pesos; formato CLP `$22.590` |
| `Stars` | ★ 4,7 · 1.240 opiniones (color de la estrella del token) |
| `PointsBadge` | «Ganas N Papa Puntos» / «+N por acreditar» |
| `FoodImage` | Imagen responsiva con `srcset`, recorte a sangre, sombra opcional y movimiento lento con pausa (R4.7, respeta «reducir movimiento») |
| `BottomSheet` | Hoja que sube sobre la pantalla (móvil) y diálogo lateral (escritorio) |
| `AddedToast` | «¡Agregada! +N Papa Puntos por acreditar», «Deshacer» y «Ver mi pedido» |
| `BottomNav` | Inicio, Menú, Promos, Pedido (con contador), Cuenta |
| `FulfillmentChip` | «Retiro · El Bosque · 15 min» en el encabezado (lo llena TIE) |
| `TrackingStrip` (punto de inserción) | Franja fija sobre la barra inferior (la llena SEG) |
| `lib/points.ts` | `pointsFor(total, shipping)` = `floor((total − despacho) / 1000)`, ×2 si `c_pjDoublePoints` (R1.1, R1.2) |
| `lib/profile.ts` | `getDemoProfile`, `getDemoMoment` (§2) |
| `lib/fulfillment.ts` | Lee y escribe `pj_fulfillment` |
| `lib/format.ts` | CLP, horas («listo 20:45»), «hace X min» |

## 6. Pedido canónico (para que todas las pantallas cuadren)

Sofía, retiro en El Bosque: Pollo BBQ Familiar Tradicional sin cebolla $16.900 + Combo Palitos de Ajo con Coca-Cola Sin azúcar 1,5 L $6.990 → **total $23.890 → 23 puntos**, listo en 15 min. Con el canje (S-D12) suma una Super Pepperoni mediana a $0 y su saldo queda en **340 − 260 + 23 = 103**. Con mitades: Pollo BBQ + Todas las Carnes = **$17.900**.

## 7. Cambios de DAT en la oleada 0 (06-nov, rama `hu/DAT`)

Estos nombres reemplazan a los de las secciones anteriores cuando no coinciden.

| Tema | Cómo quedó |
|---|---|
| Extras | Una opción **por ingrediente**: `pjExtras_<id>`, con valores `no` y `si`, porque Commerce admite un solo valor por opción. El catálogo trae el precio Familiar ($1.940) y el hook ajusta el tamaño con `c_pjExtraPrices`. **CAR y CHK deben filtrar las opciones en `no`** al mostrar la línea |
| Ingredientes | Productos `ing-<id>` con foto (`c_pjKind = ingredient`, categoría `ingredientes` offline). `c_pjBaseIngredients` usa el `<id>` sin prefijo |
| Atributos nuevos | Producto: `c_pjPriceBefore`, `c_pjValidFrom`, `c_pjExtraPrices`, `c_pjUnavailableForHalves`, `c_pjIngredientGroup`, `c_pjPriceModifier`. Línea: `c_pjComboChoices`. Pedido: `c_pjPlacedAt`, `c_pjStoreId` |
| Categorías | `ofertas` (combos) e `ingredientes` (offline) |
| Tiendas | El Bosque `pj-48`, Salvador `pj-9`, Providencia `pj-2`; inventarios `inventory_pj_48`, `inventory_pj_9`, `inventory_pj_2` |
| Bebidas | Variantes con el ID de la API: Coca-Cola 1,5 L `cp-coca-cola-2`; Coca-Cola Sin azúcar 1,5 L `cp-coca-cola-sin-azucar-10` |
| Source code | `PJSD26` asigna el grupo `pj-anuncio-super-duo` (dinámico `pj-anuncio`) |
| Carrito | Preferencia `AddProductToBasketBehavior=AllowRepeats`: cada pizza o combo personalizado es su propia línea |
| Mínimo delivery | `c_pjMinOrder` en el método de envío; lo hace cumplir el hook |
| Clientes | Los del §3 existen; la contraseña de demo está en los scripts de `site-data/ocapi/` (no se escribe aquí) |
| Super Dúo / Super Trío (DAT-11, S-D20) | Pizzas reales con la **opción `pjCombo`** = `duo` o `trio` (precio $0; `no` por defecto) en las 6 pizzas de `c_pjSlots` (Pollo BBQ, Super Pepperoni, Todas las Carnes, Boom de Jamón, Napolitana Caprese, Hawaiana). Promociones `pj-super-duo` (2 familiares = $22.590) y `pj-super-trio` (3 = $33.900), campaña `pj-demo`, **sin cupón**: solo cuentan las líneas marcadas. Masas sin recargo: `traditional`, `thin`, `parmesan` (la rellena y la base parmesano no entran). Los extras `pjExtras_*` se cobran encima. Ver §7.1 |
| Atributos de línea nuevos | `c_pjComboGroup` (string: une las líneas de un mismo Dúo/Trío, p. ej. `duo-<uuid>`; sirve también a la venta cruzada) y `c_pjComboFor` (string, #122: la línea de «Hazlo combo» o de venta cruzada apunta al `itemId` de su pizza o al grupo). SCAPI los escribe en `addItemToBasket` y llegan al pedido |
| Canje (CHK) | Promoción `pj-canje-puntos` con el cupón de código fijo **`PJ-CANJE-PUNTOS`** (no distingue mayúsculas): deja en $0 **una** mediana canjeable (`pz-super-pepperoni-medium-*`, también Boom de Jamón y Napolitana Caprese), una por pedido; los extras de esa pizza se cobran. El cupón se acepta antes de agregar la pizza (`statusCode: no_applicable_promotion`) y pasa a `applied` al agregarla |
| Medio de pago `PJ_CASH` (CHK) | Existe y SCAPI lo lista en `getPaymentMethodsForBasket`; procesador propio `PJ_CASH` (sin autorización). Commerce no filtra medios de pago por tienda: **el checkout lo ofrece solo si la tienda tiene `c_pjCash = true`** |
| Atributos de canasta (CHK) | En **Basket** (además de Order): `c_pjRedeemed`, `c_pjPointsEarned`, `c_pjStatus`, `c_pjStoreId`, `c_pjDocType`, `c_pjRut`, `c_pjBusinessName`, `c_pjBusinessActivity`, `c_pjBusinessAddress`, `c_pjNote`. El comprador los escribe con `updateBasket` (PATCH) y Commerce los copia al pedido al crearlo |
| Venta cruzada (S-D19) | Bebidas 1,5 L y **2,5 L** (no hay 2 L ni 3 L en el catálogo): Coca-Cola `cp-coca-cola-2` / `-3`, Sin azúcar `cp-coca-cola-sin-azucar-10` / `-9`, Light `cp-coca-cola-light-7` / `-6`, Sprite `cp-sprite-18` / `-19`, Fanta `cp-fanta-22` / `-23`, Sprite Zero solo 1,5 L `cp-sprite-zero-21`. Acompañamientos y postres: categorías `acompanamientos` y `postres` (todos con foto, precio y stock en las 3 tiendas) |
| Reconstruir | `site-data/rebuild.sh` (todo; incluye DAT-11) · `--skip-customers` · solo DAT-11: `python3 site-data/ocapi/dat11.py` · verificación: `python3 site-data/ocapi/verify.py [dat11]` |

**Pendiente de habilitar (bloqueos de Raúl):**
- Feature switch de hooks de SCAPI: sin él no hay precio de mitades, extras por tamaño, rechazos ni pedido mínimo.
- Scope `sfcc.shopper-context.rw` en el cliente SLAS del storefront: sin él `PJSD26` no llega a la sesión.

### 7.1 Cómo agregar y quitar un Super Dúo o Super Trío (S-D20, DAT-11)

**Agregar** (un solo `addItemToBasket` con las N pizzas; `itemId`s nuevos porque el carrito permite repetidos). `grupo` lo genera el storefront, uno por combo armado:

```json
[
  {"productId": "pz-pollo-bbq-family-traditional", "quantity": 1, "c_pjComboGroup": "duo-7f3a",
   "c_pjRemoved": ["cebolla"],
   "optionItems": [{"optionId": "pjCombo", "optionValueId": "duo"},
                   {"optionId": "pjExtras_pepperoni", "optionValueId": "si"}]},
  {"productId": "pz-super-pepperoni-family-thin", "quantity": 1, "c_pjComboGroup": "duo-7f3a",
   "optionItems": [{"optionId": "pjCombo", "optionValueId": "duo"}]}
]
```

- Super Trío: 3 líneas con `"optionValueId": "trio"` y un grupo `trio-…`.
- Siempre `quantity: 1` por pizza y la variante **familiar** en masa `traditional`, `thin` o `parmesan`. Una pizza con otra masa o tamaño no entra y el grupo queda a precio normal: el constructor no debe ofrecer esas masas dentro del combo.
- No hay cupón. Lo que activa el precio es la opción `pjCombo` de la línea: dos familiares sueltas siguen a su precio normal.
- Resultado: cada línea del grupo trae `priceAdjustments` con `promotionId: "pj-super-duo"` (o `pj-super-trio`). El precio se reparte en proporción al precio de lista (Pollo BBQ + Super Pepperoni = 11.295 + 11.295). El carrito muestra el grupo como **«Super Dúo» = suma de `priceAfterItemDiscount` de sus líneas + sus extras**.
- Con dos Dúos del mismo tipo en el carrito, Commerce puede emparejar las pizzas distinto que los grupos: el total queda bien (2 × $22.590), pero el reparto por línea puede no calzar con cada grupo. Para mostrar el precio de cada grupo, usa $22.590 (o $33.900) + sus extras.
- `pjCombo` es una opción de producto. Al pintar la línea, **filtra `pjCombo`** igual que los `pjExtras_*` en `no`. Al **editar** una pizza del grupo (PATCH con `optionItems`), reenvía `pjCombo`.

**Quitar:** borra todas las líneas del grupo (`removeItemFromBasket` por cada `itemId` con ese `c_pjComboGroup`). Si se quita una sola pizza, la otra queda marcada y vuelve a su precio normal. Por eso el carrito ofrece «Quitar Super Dúo» (todas las líneas) o, al quitar una pizza, quita también las demás de su grupo o les pone `pjCombo = no`. No hay cupón que limpiar.

**Hazlo combo y venta cruzada en un grupo:** se agregan como líneas normales con `c_pjComboFor` = el grupo o el `itemId` de la pizza. `pj-hazlo-combo` convive con el Dúo: Dúo + Palitos de Ajo + Coca-Cola 1,5 L = $22.590 + $6.990.

