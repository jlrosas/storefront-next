# Domino's EE.UU. (www.dominos.com): recorrido de comprador

Fecha: 16-oct-2026. Chrome (servidor `chrome-devtools-3`) con VPN de salida en EE.UU.: la portada **no redirigió** a dominos.com.pe y el sitio sirvió el rediseño (cookie `X-DPZ-ROLLOUT-PHASE-100=REDESIGN`). Recorrido como invitado en escritorio (1920 px) y en móvil emulado (390x844, táctil, UA de iPhone), con retiro en tienda (ZIP 10001, tienda 170 W 23rd St). Llegué al checkout y no pulsé "Place order". No creé cuenta ni ingresé datos personales.

Leyenda: **[V]** observado · **[I]** inferencia mía. Tiempos: una sola medición cada uno.

## 1. Resumen

- **Arquitectura moderna y modular** [V]: Next.js (SSR, `x-powered-by: Next.js`) con micro-frontends (chunks webpack `shell`, `cart`, `product`, `rewards`, `auth`, `campaign`, `makeline_ui`, `service_methods`), Apollo Client contra un **BFF GraphQL propio** (`/api/web-bff/graphql`) que envuelve la API heredada Power (el carrito devuelve `oloPowerOrderId`). Akamai delante. CMS propio en `/cms/assets/`.
- **El menú y el constructor se ven sin elegir tienda** [V]; la tienda se pide al tocar "Add to cart", en un modal que conserva la URL del producto. Es justo lo que le falta a Papa John's Chile.
- **No muestra precios hasta el carrito** [V]: ni en el listado ni en el constructor (tampoco con tienda elegida). Solo las ofertas tienen precio visible. Es su punto más débil.
- **Upsell en tres momentos** [V]: modal "Cheese it up with extra cheese" al agregar, modal "Recommended add-ons" al abrir el carrito (una vez por sesión) y carrito en 5 pasos ("Step 2 Choose your sides", "Step 3 Choose your drinks"...).
- **Ofertas con URL propia** [V]: `/deals/MixAndMatch` y `/deals/5385` funcionan como enlace directo; en una sesión limpia piden la tienda y **vuelven a la misma oferta**. Un código inválido cae en `/deals` con el aviso "Deal not available".
- **Checkout de una página** [V], invitado, 8 medios de pago (Apple Pay, tarjeta, Paze, PayPal, Venmo, Cash App Pay, efectivo, gift card). Valida al salir de cada campo, sin errores anticipados. Los datos de contacto no declaran `autocomplete`.
- **Rendimiento** [V]: Lighthouse móvil da accesibilidad 97, buenas prácticas 100 y SEO 100. Datos reales de CrUX (p75): LCP 3,2 s, INP 374 ms y **CLS 1,25 (malo)**.

## 2. Arquitectura [V salvo indicación]

| Pieza | Observado |
|---|---|
| Framework | Next.js (`__NEXT_DATA__`, `_next/static`, `x-powered-by: Next.js`), páginas renderizadas en servidor (`Document.getInitialProps` en 100 ms según `server-timing`). Micro-frontends por dominio funcional (chunks `webpackChunkcart`, `product`, `rewards`, `auth`, `campaign`, `shell`) [I: module federation] |
| API | `POST /api/web-bff/graphql`; cada operación lleva la cabecera `x-dpz-api` (vistas: `StJudeThanksAndGivingHomePage`, `CampaignTilesByLocation`, `Stores`, `CartById`, `AutoAddOrPromptForStJudeRoundUpAtCheckout`, `CheckIntent`). Navegación interna por `/_next/data/<build>/invalid-locale-by-design/...json`. El BFF expone `oloPowerOrderId`: **por debajo sigue la API Power** [I] |
| Carrito | Del lado del servidor (`cartId` y `cartHash` en cookie); `getCart` devuelve precio, calorías, medios de pago por tienda, `stepUpsell` (pasos de venta cruzada), `cartUpsellDeal` y `checkoutBannerMessage` |
| CDN y seguridad | Akamai (`akstat.io`, `go-mpulse.net`, script de bot manager en `/public/<hash>`), reCAPTCHA Enterprise, Kount (antifraude), CSP estricta con lista blanca y reporte a Raygun |
| Contenido | CMS propio en `/cms/assets/<uuid>` con recorte y redimensionado en la URL (`im=Crop,...;Resize=(1700)`) |
| Experimentos | LaunchDarkly (dos claves: flags y experimentos; contexto con `marketCode: US`). La cookie `X-DPZ-E` asigna **37 experimentos** a cada visitante (14 "a", 9 "b", 5 "fallback", 9 false). Fase de despliegue del rediseño en cookie |
| Analítica | Tealium iQ (perfil `chimera`) + `collect.tealiumiq.com`, Adobe Analytics/ECID (`smetrics.dominos.com`, `demdex`), Google Ads/GA4, Amplitude (cookie `amp_`), SpeedCurve LUX (RUM), Raygun (errores). La CSP autoriza además Quantum Metric, ClickTale, Maze, TikTok, Pinterest, Snapchat, Bing, The Trade Desk, LiveIntent |
| Pagos | Braintree (PayPal, Venmo), Apple Pay, Paze, Cash App Pay/Afterpay, CyberSource; la operación `CheckIntent` pide CVV |
| Mapas | Google Maps y Places |

**Peso de la portada en escritorio, primera carga** [V]: 250 requests, 4,0 MB transferidos, 2,1 MB de JavaScript, 14 dominios (antes de rechazar las cookies). HTML de 175 KB comprimido. TTFB 0,95 s, DOMContentLoaded 2,0 s, `load` 7,3 s. Con caché y tienda elegida: TTFB 0,53 s, `load` 1,7 s.

**Lighthouse móvil, portada** [V]: accesibilidad 97 (solo falla el contraste del botón "JOIN NOW", 4,33:1), buenas prácticas 100, SEO 100. Esta versión de Lighthouse no puntúa el rendimiento; lo medí con una traza (Slow 4G y CPU 4x): **LCP 11,3 s** en laboratorio, casi todo descarga de la imagen del hero, y la traza señala 997 KB de imágenes mejorables. En CrUX (usuarios reales, p75): LCP 3,19 s, INP 374 ms, CLS 1,25. Informe: `datos/raw/dpzus-red/lighthouse/report.html`.

**SEO** [V]: URLs legibles (`/menu/specialty/S_ZZ/extravaganzza`, `/deals/MixAndMatch`), título y descripción por producto ("ExtravaganZZa Pizza Near Me | Domino's"), canonical. No hay JSON-LD en portada ni en producto, el HTML de producto no trae `h1` y el canonical de la portada usa `http://`. En el cliente, una ficha mostró el título "the_peoples_pizza_deluxe Near Me", con el identificador interno a la vista.

## 3. Recorrido, momento por momento

| # | Momento | Qué se ve [V] | Tiempo [V] | Captura |
|---|---|---|---|---|
| 1 | Portada | Modal de privacidad (CCPA) en cada carga hasta rechazar. `h1` "START YOUR ORDER" con botones DELIVERY / CARRYOUT. Hero en texto real: "TRY THE NEW DOMINO™ MIX AND MATCH CHOOSE ANY TWO FOR $6.99 EACH." + "ADD DEAL". Carrusel "EXPLORE MORE DEALS" (4 ofertas con precio), "WHAT'S NEW", bloque Rewards "EARN FREE DOMINO'S EVERY 2 ORDERS", "BROWSE MENU" con 11 categorías. Con tienda elegida, el bloque inicial pasa a "START YOUR ORDER / VIEW MENU" | TTFB 0,95 s; `load` 7,3 s en frío | dpzus-portada, dpzus-movil-portada |
| 2 | Menú sin tienda | Se ve completo, sin muro. Tarjetas con foto, nombre, descripción, botón "Customize" y carrito rápido "Add X to Cart". **Sin precio** | — | dpzus-menu-sin-tienda |
| 3 | Constructor | URL propia. Cantidad, 6 masas (foto), 3 tamaños (10"/12"/14"; Large marcado), condimento del borde, 6 salsas con cantidad Light/Normal/Extra, queso con cantidad, ingredientes incluidos **ya marcados**, cada uno con cantidad y **lado Left/Whole/Right**, "Add More Toppings", "Special Instructions", salsas para mojar e "ITEM SUMMARY". **Sin precio ni calorías**, tampoco con tienda | 6,8 s en navegación interna (una medición, valor anómalo) | dpzus-constructor-escritorio, dpzus-ficha-con-tienda, dpzus-movil-constructor |
| 4 | Elegir modalidad y tienda | Solo al pulsar "ADD TO CART": modal "How do you want your Domino's today?" con Delivery / Carryout (Carside, In-Store, Pickup Window). Retiro: "USE MY LOCATION", ZIP o ciudad y estado, mapa. 9 tiendas con "Ready In 5 - 15 minutes • Open until 2:00am" y modalidades. Ficha de confirmación: dirección, espera, horario, teléfono, **"Order Timing: Now / Later"**, horarios por modalidad, "CONFIRM CARRYOUT" | Lista ~2,5 s; confirmación 1,2 s | dpzus-tiendas, dpzus-confirmar-retiro |
| 5 | Agregar | Tras confirmar la tienda, la pizza se agrega sola ("ADDING TO CART"): se conserva la intención. Antes sale el modal "CHEESE IT UP WITH EXTRA CHEESE / NO THANKS / YES PLEASE". Después **redirige a /menu** sin confirmación visible en escritorio. En móvil, el "+" del listado agrega con un toque, muestra "MeatZZa was added to your cart." y convierte el botón en selector de cantidad | ~2,2 s | dpzus-upsell-queso, dpzus-tras-agregar-menu, dpzus-movil-listado-agregado |
| 6 | Venta cruzada | Al abrir el carrito por primera vez: "Add something delicious / RECOMMENDED ADD-ONS / We think any of these would go great with your order." (3 panes, $6.99 a $9.49, con precio) + "NO THANKS". Cookie `hasSeenWaterfallUpsell`: solo una vez | ~2,5 s | dpzus-upsell-acompanamientos, dpzus-movil-upsell |
| 7 | Carrito | Panel lateral (hoja deslizable en móvil, "Swipe right to close modal"). Aquí aparece **el primer precio**: "Large (14") Hand Tossed The People's Pizza - Deluxe — 340 Calories / 1 slice — $21.99". Pasos: 1 Confirm your selections, 2 sides, 3 drinks, 4 desserts, 5 flavor (salsas y sobres). Resumen: subtotal, impuesto $1.95, total $23.94. "Have a deal or promotion code? Add deal". Tienda, modalidad y "ASAP • 5 - 15 mins". Botón "CHECK OUT · $23.94" | — | dpzus-carrito, dpzus-movil-carrito |
| 8 | Ofertas | `/deals`: "FROM YOUR LOCAL DOMINO'S" con 16 cupones de tienda, precio grande ($11.99, $19.99…) y "POPULAR", y luego las nacionales (Mix & Match $6.99, Weeklong Carryout $7.99, Perfect Combo $19.99, The Domino™ $5.99). Cada oferta abre un constructor con URL (`/deals/5385`): "BUILD YOUR DEAL — 0 of 2+ items added — Add Pizza". **Sin precio antes/ahora ni ahorro** | TTFB 0,82 s; `load` 2,6 s | dpzus-deals, dpzus-deal-constructor |
| 9 | Checkout | `/checkout`, una página: aviso de redondeo para St. Jude ("YES, ROUND UP TODAY"), contacto (nombre, apellido, correo, teléfono, extensión), casilla "email offers… coupon for 20% off my next order", **"JOIN DOMINO'S® REWARDS — EARN FREE DOMINO'S EVERY 2 ORDERS"** con alta en línea (confirmar correo + contraseña) o "I'll sign up later", gift card, 8 medios de pago, resumen y "PLACE ORDER · $23.94". En móvil el encabezado se reduce a "Return to cart / SIGN IN" | URL en 0,8 s; listo en 3,6 s (escritorio) y 1,8 s (móvil) | dpzus-checkout, dpzus-movil-checkout |
| 10 | Rewards | `/my-deals-and-rewards` como invitado: "EARN FREE DOMINO'S EVERY 2 ORDERS / JOIN NOW / SIGN IN". Reglas: 10 puntos por pedido de $5 o más, máximo 10 por día | — | dpzus-rewards |
| 11 | Tracker | `/tracker`: "DOMINO'S TRACKER® U.S. PATENT #10,262,281 — Enter your phone below to track your order". El seguimiento se busca por teléfono, sin cuenta | — | dpzus-tracker |
| 12 | Reorden | "RECENT ITEMS" (`/menu/previous`) en el menú: "Sign in to view past orders." No pude ver Easy Order sin cuenta | — | — |

No vi buscador de productos, banner de la app (solo insignias en el pie) ni propina, que no aplica a retiro.

## 4. Escritorio vs. móvil [V]

| Tema | Escritorio | Móvil |
|---|---|---|
| Navegación | Barra superior: ORDER NOW, MENU, DEALS, MY REWARDS, TRACKER, ubicación, SIGN IN, carrito | Hamburguesa con las mismas 5 entradas, más una barra fija con modalidad, espera y tienda. **Sin navegación inferior** |
| Hero | Banda "START YOUR ORDER" + oferta | Foto a pantalla completa con tarjeta "CHOOSE CARRYOUT OR DELIVERY / ORDER ONLINE" (aun con la tienda ya elegida) y carrusel "1 / 5" |
| Constructor | Página larga | Título del producto fijo arriba y **"ADD TO CART" fijo abajo** |
| Agregar | Redirige a /menu sin aviso | Aviso "X was added to your cart." + selector de cantidad en la tarjeta |
| Carrito | Panel lateral | Hoja a pantalla completa, se cierra deslizando |
| Checkout | Encabezado completo | Encabezado reducido (sin distracciones) |

## 5. Mecanismos de enganche

Toques medidos desde la portada hasta el checkout, sin contar el teclado:

- **Escritorio, sesión nueva y ruta de producto**: categoría, producto, Add to cart, Carryout, ZIP + Find a store, tienda, Confirm carryout, No thanks (queso), carrito, No thanks (add-ons), Check out = **11 toques + ZIP** [V].
- **Móvil con tienda ya elegida y carrito rápido**: "+" en el listado, carrito, No thanks, Check out = **4 toques** [V].
- **Oferta Mix & Match**: Add deal, Add item 1, Add item 2 y luego el carrito: al menos 6 toques [V parcial: no completé la oferta].

| Mecanismo | Texto exacto y lugar [V] | Perfil | Lectura |
|---|---|---|---|
| Precio por unidad en ofertas | "CHOOSE ANY TWO FOR $6.99 EACH." (hero de portada y /deals); "CARRY OUT FOR JUST $7.99 EACH."; "GET ALL OF THIS FOR JUST $19.99." | Diego, Valentina | Precio en texto real y grande, un botón "ADD DEAL". No usa precio tachado ni porcentaje: vende el precio redondo |
| Ocasión y cantidad | "Choose any 2 or more items", "2-item minimum", "The Perfect Combo" (2 pizzas + 2 panes); "BUILD YOUR DEAL — 0 of 2+ items added" | Diego | Empuja al pedido para varios con un contador de progreso, sin etiquetas "para 2 / para 4" |
| Ofertas locales | "FROM YOUR LOCAL DOMINO'S" (16 cupones), "LOCAL DEALS FIND YOUR LOCAL STORE'S COUPONS.", etiqueta "POPULAR" | Diego, Valentina | Cupones por tienda tras elegir ubicación |
| Novedad | "NEW!" en categorías; "TRY THE NEW DOMINO™"; "WHAT'S NEW" | Valentina, Sofía | Da un motivo para volver |
| Urgencia | "limited time offer" (solo en letra legal); "Ready In 5 - 15 minutes • Open until 2:00am" | Valentina | Sin contadores ni escasez falsa; la urgencia real es el tiempo de espera, visible en todas las páginas |
| Valores por defecto | Large, Hand Tossed, salsa y queso "Normal", ingredientes marcados, ASAP, In-Store | Todos | Agregar sin decidir nada; el carrito rápido evita el constructor |
| Upsell al agregar | "CHEESE IT UP WITH EXTRA CHEESE — NO THANKS / YES PLEASE" | Diego | Modal obligatorio que interrumpe; **sin precio** del extra |
| Upsell al abrir carrito | "Add something delicious — RECOMMENDED ADD-ONS — We think any of these would go great with your order." | Diego | Una vez por sesión (cookie `hasSeenWaterfallUpsell`) |
| Carrito en pasos | "STEP 2 CHOOSE YOUR SIDES", "STEP 3 CHOOSE YOUR DRINKS", "STEP 4 CHOOSE YOUR DESSERTS", "STEP 5 CHOOSE YOUR FLAVOR" | Diego | Presenta la venta cruzada como pasos del pedido. Son 3 ocasiones de upsell antes de pagar |
| Lealtad simple | "EARN FREE DOMINO'S EVERY 2 ORDERS" en portada, /my-deals-and-rewards y checkout | Valentina → Sofía | Una regla de una línea en tres lugares. Sin barra de progreso para invitados [no vi la vista con sesión] |
| Alta en el checkout | "JOIN DOMINO'S® REWARDS … Yes, I love free pizza and more. / I'll sign up later." con contraseña en el mismo formulario | Valentina | Convierte al invitado en miembro sin salir del pago |
| Incentivo de correo | "Yes, I want to receive email offers from Domino's and a coupon for 20% off my next order" | Valentina | Captura de contacto a cambio de un cupón |
| Mensaje de recompra | `checkoutBannerMessage`: "Check out to get $5 to use on next week's order 🤑" (en la respuesta de `getCart`) | Diego → Sofía | Presente en los datos, **no lo vi en pantalla** [I: depende de un flag o experimento] |
| Causa social | "BE THE HERO, ROUND UP FOR ST. JUDE — YES, ROUND UP TODAY" al inicio del checkout | Todos | Emocional, pero está antes del formulario |
| Tracker | "DOMINO'S TRACKER® U.S. PATENT #10,262,281" en el menú principal | Valentina | Muestra confianza antes de comprar; se sigue por teléfono, sin cuenta |
| Fotos | Pizzas cenitales sobre fondo crema, masas con foto en el constructor | Todos | Sin video ni prueba social (reseñas o "más pedido" en productos): no vi ninguna |
| App | Solo insignias App Store / Google Play en el pie | — | Sin banner ni incentivo para bajar la app |
| Abandono | No vi recuperación en pantalla. Carrito persistente en cookie (`cartId`) | — | [I] el rescate ocurre por correo o push con la cuenta |

**Dónde molesta o falla** [V]:

1. **Sin precio hasta el carrito**: no se compara antes de agregar, y masas premium como "Parmesan Stuffed Crust" no anuncian su recargo.
2. **Dos modales obligatorios** (queso y add-ons) en un pedido de una pizza, además del modal de privacidad, que volvió a aparecer en la segunda página.
3. En escritorio, **tras agregar te lleva a /menu sin confirmar**: el contador del carrito es la única señal.
4. Con un solo producto de $21.99 no ofrece la oferta que lo dejaría más barato: `cartUpsellDeal` vino `null` y no hay "ahorra con Mix & Match".
5. Hero móvil con "CHOOSE CARRYOUT OR DELIVERY / ORDER ONLINE" cuando la tienda ya estaba elegida.
6. CLS de usuarios reales 1,25 y LCP de laboratorio de 11 s en 4G lenta: el hero es una foto pesada.
7. Campos de contacto sin `autocomplete` (`given-name`, `email`, `tel`); la tarjeta sí lo declara (`cc-number`, `cc-exp`, `cc-csc`).
8. Ningún medio de pago preseleccionado.

## 6. Personalización por perfil

| Patrón | Qué hace Domino's EE.UU. | Evidencia | Sofía | Diego | Valentina |
|---|---|---|---|---|---|
| Portada que cambia según el contexto | Sin tienda: "START YOUR ORDER — DELIVERY / CARRYOUT". Con tienda: "START YOUR ORDER — VIEW MENU", con la tienda y la espera en el encabezado | [V] | ● | | ● |
| Ofertas por ubicación | Operación `CampaignTilesByLocation`; "FROM YOUR LOCAL DOMINO'S" con cupones de la tienda | [V] | | ● | ● |
| Enlace directo a la oferta | `/deals/MixAndMatch` y `/deals/5385` en sesión limpia: modal de modalidad y tienda **encima de la oferta**, y luego vuelve a ella. Código inválido: "Deal not available… browse your store's deals" y cae en /deals | [V] | | ● (cumple la promesa del anuncio) | ● |
| Recent Items / Easy Order | "RECENT ITEMS" en el menú; como invitado: "Sign in to view past orders." | [V] la entrada; [no visto] el contenido | ● | | |
| My Deals & Rewards | Una sola sección para cupones personales y puntos; como invitado solo "JOIN NOW / SIGN IN" | [V] la entrada; [no visto] la vista con sesión | ● | | ● |
| Mensajes invitado vs. con sesión | Invitado: alta de Rewards en el checkout y cupón de 20% por correo | [V] el invitado; [no visto] con sesión | | | ● |
| Recompensa de recompra | "Check out to get $5 to use on next week's order" en los datos del carrito | [V] en la respuesta, no en pantalla | ● | ● | |
| Venta cruzada configurable | `stepUpsell` por pasos (SIDE, DRINKS, DESSERT, FLAVOR) que devuelve el servidor; modal "Recommended add-ons" | [V] | | ● | |
| Modalidades y Hotspots | Delivery, Carryout, Carside, In-Store, Pickup Window; la API trae `hotspot` y `deliverToMe` por tienda (no disponibles en esta) | [V] en la API; [no visto] en la interfaz | ● | | ● |
| Experimentos y flags | LaunchDarkly (flags + experimentos), 37 asignaciones en la cookie `X-DPZ-E`, despliegue por fases del rediseño | [V] | ● | ● | ● |
| Analítica y segmentación | Tealium (`collect.tealiumiq.com`), Adobe ECID/Analytics, Amplitude; Quantum Metric y ClickTale autorizados en la CSP | [V] la red y la CSP; no vi Adobe Target (`mbox`) | ● | ● | ● |
| Transparencia de costos y tiempo | Espera "5 - 15 mins" y tienda en todo el recorrido; impuesto y total desde el carrito; "Any delivery charge is not a tip paid to your driver" | [V] | | | ● |
| Compra como invitado | Checkout sin cuenta; tracker por teléfono | [V] | | | ● |
| Ocasiones ("para 2 / para 4 / partido") | **No existe**: solo "2 or more items" y combos | [V] ausente | | ✕ | |

En síntesis [I], Domino's personaliza sobre todo por **ubicación y contexto** (tienda, modalidad, cupones locales) y deja el reconocimiento de la persona para la sesión iniciada y la app. Para un invitado, el sitio es casi igual para todos, salvo los experimentos A/B. La demo de "Personajes" puede superarlo en lo que el cliente pide: reconocer a Sofía, mostrar ocasiones a Diego y tranquilizar a Valentina.

## 7. Domino's EE.UU. vs. Papa John's Chile

| Momento | Domino's EE.UU. [V] | Papa John's Chile (auditoría del 13-oct) | Ventaja |
|---|---|---|---|
| Portada | Hero en texto real con precio y botón; carrusel de ofertas; bloque de lealtad; categorías | Banner con texto incrustado, borroso, sin precio de referencia | Domino's |
| Modalidad y tienda | Se pide al agregar, en un modal; conserva el producto y lo agrega solo | Muro de dirección antes de ver el detalle; vuelve al configurador | Domino's |
| Tiendas | 9 resultados con espera, horario y modalidades; ficha con horarios y "Now / Later" | 3 tiendas cercanas, "Entrega: 15 min", sin horario ni estado | Domino's |
| Menú | Categorías con URL, carrito rápido, sin precio | Pestañas, precios de tamaños distintos mezclados | PJ (al menos muestra precio) |
| Ficha / constructor | URL propia, ingredientes con cantidad y lado izquierdo/derecho, valores marcados; sin precio ni calorías | Panel sin URL; tamaño y masa marcados; mitades; precio en el botón; "0 cal/trozo" | Domino's en estructura; PJ en precio |
| Agregar | Escritorio: redirige sin aviso. Móvil: aviso + selector de cantidad | Sin confirmación | Domino's (móvil) |
| Upsell | 3 momentos (queso, add-ons, pasos del carrito) | Mejora de borde + carrusel en el carrito | Domino's en alcance; PJ molesta menos |
| Carrito | Foto, calorías, precio, impuesto, total, tienda y espera, cupón | Sin foto ni modalidad; mejora y cupón | Domino's |
| Ofertas / cupones | Página con cupones locales y nacionales, URL por oferta, constructor "0 of 2+"; sin antes/ahora | 13 combos; la API trae precio original pero no se muestra | Domino's |
| Lealtad | "Free Domino's every 2 orders" en 3 lugares + alta en el checkout | "Estás por perder X Papa Puntos" | Domino's |
| Checkout | Una página, valida al salir del campo, 8 medios, alta de cuenta integrada; sin `autocomplete` en contacto | Una página, 3 campos en rojo al cargar, pago escondido, sin `autocomplete` | Domino's |
| Seguimiento | Tracker por teléfono, en el menú principal | No visto en Chile | Domino's |
| Reorden | "Recent Items" (requiere cuenta) | No visto | Domino's |
| Búsqueda | No hay | No hay | Empate |
| Accesibilidad (LH móvil) | 97 | 73 | Domino's |
| Buenas prácticas / SEO | 100 / 100 | 69 / 92 | Domino's |
| Peso de la portada (escritorio) | 250 req, 4,0 MB, 2,1 MB de JS | 250 req, 2,9 MB, 1,7 MB de JS | PJ (más liviana) |

## 8. Lo que la demo debería tomar de aquí (priorizado)

1. **Menú y producto visibles sin tienda; la tienda se pide al agregar y la pizza se agrega sola después** (modal sobre la misma URL). Corrige el muro de dirección de PJ Chile.
2. **Ofertas con URL propia que sobreviven a la elección de tienda** (`/promos/<id>`), con aviso claro si no aplica en esa tienda. Es el patrón para Diego que llega desde un anuncio.
3. **Constructor con URL, valores marcados e ingredientes con cantidad y lado izquierdo/derecho**, más el carrito rápido "+" en el listado para quien no quiere personalizar. Y sumar lo que Domino's no hace: **precio vivo en el botón** y recargo visible por opción.
4. **Hero en texto real con precio redondo y un botón "Agregar oferta"**; carrusel de ofertas con precio; constructor de combo con contador "0 de 2 agregados".
5. **Modalidad, tienda y espera fijas en el encabezado** durante todo el recorrido ("Retiro · 5-15 min · Tienda X", con lápiz para cambiar).
6. **Carrito en pasos** (acompañamientos, bebidas, postres) con datos del servidor, en una hoja móvil que se cierra deslizando, con foto, calorías e impuesto.
7. **Checkout de una página con validación al salir del campo, alta de Papa Puntos dentro del checkout** ("Gana X puntos con este pedido") y billeteras a la vista. Agregar el `autocomplete` y el medio preseleccionado que Domino's no tiene.
8. **Lealtad en una frase**, repetida en portada, producto y checkout.
9. **Aviso "Agregado al carrito" + selector de cantidad en la tarjeta** (patrón móvil de Domino's), no una redirección.
10. **Encabezado reducido en el checkout móvil** ("Volver al carrito").
11. **Seguimiento sin cuenta**, por teléfono o número de pedido, enlazado desde el menú principal.
12. **Experimentos y flags como capacidad de la propuesta** (Domino's corre 37 a la vez): mostrar en la demo una prueba A/B del hero o del upsell.

**No copiar**:

- Ocultar precios hasta el carrito.
- Dos modales de upsell obligatorios por pedido.
- Redirigir a /menu tras agregar.
- No sugerir la oferta más conveniente cuando el carrito la permite.
- Un hero fotográfico pesado que dispara LCP y CLS.
- Repetir el banner de cookies.
- Pedir la modalidad en el hero cuando ya está elegida.
- Título de página con identificadores internos.

## 9. Límites

- Una sesión por dispositivo y una medición por paso. La navegación interna del constructor (6,8 s) parece un valor anómalo.
- No probé delivery con dirección, propina, Hotspots en pantalla, pedido programado hasta el final, ni el Tracker en vivo (exige un pedido real).
- Sin cuenta no vi Easy Order, Recent Items con contenido, My Deals personales ni el progreso de puntos.
- No completé una oferta Mix & Match hasta el carrito, así que no vi cómo se muestra el ahorro aplicado.
- Lighthouse no dio puntaje de rendimiento; uso la traza y CrUX en su lugar.
- Evidencia de red guardada en `datos/raw/dpzus-red/` (cuerpos de 7 operaciones GraphQL e informe Lighthouse).
