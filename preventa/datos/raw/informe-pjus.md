# Papa Johns EE.UU. (www.papajohns.com): recorrido como comprador

Fecha: 16-oct-2026. Chrome controlado por DevTools (servidor `chrome-devtools-2`), salida por VPN en Nueva York (ipinfo: New York City, US, AS21859 Zenlayer). Escritorio 1440x900 y móvil emulado 390x844 con touch. Modalidad Carryout, ZIP 10001, tienda 343 Grand St, New York, NY 10002 (storeId 4091). Sin cuenta, sin datos personales, sin pedido.

Leyenda: **[V]** observado · **[I]** inferencia.

## 0. Límite importante del recorrido

**No se pudo agregar nada al carrito.** [V] Al pulsar "Add to Order" (pizza) la llamada `POST /api/trpc/cart.addToCart` responde **400 desde `AkamaiGHost`** con una página "Invalid URL". El bloqueo ocurrió dos veces, con clic por script y con tecla Enter real. El navegador automatizado expone `navigator.webdriver = true` y la IP es de un centro de datos (VPN). Lo más probable es que Akamai Bot Manager bloquee la escritura del carrito [I]. No intenté saltarme esa protección.

Por eso **no vi** lo siguiente: confirmación al agregar, carrito con productos, upsell en carrito, puntos en el carrito, checkout, medios de pago, propina ni tracker con pedido. `/order/checkout` con el carrito vacío redirige a la portada, y `/order/track` sin sesión manda al login [V]. Lo que digo de esas etapas sale del modelo de datos que el front guarda en `localStorage` y de las páginas públicas, y va marcado así.

## 1. Arquitectura

| Pieza | Qué es | |
|---|---|---|
| Front | **Next.js App Router** (`self.__next_f`, chunks `/_next/static/chunks/app/[locale]/…`, peticiones `?_rsc=`). Hace SSR y navegación RSC. No existe `__NEXT_DATA__` | [V] |
| Versión | `1.40.3-2610131604` en el pie (build del 13-oct-2026) | [V] |
| CDN / borde | **Akamai** (`akamai-grn`, `server-timing: cdn-cache; desc=HIT`, mPulse `s.go-mpulse.net`, Bot Manager con cookies `_abck`/`bm_sz` y endpoint ofuscado `/7P9j6r6T…`) | [V] |
| Origen | `server: istio-envoy` (malla de servicios sobre Kubernetes). Según la prensa recogida en exploracion.md, la plataforma es propia sobre Google Cloud | [V] / [I] GKE |
| Despliegue gradual | Cookies `prcookie=omni` y `akacd_www_papajohns_pr` (Akamai Phased Release): el tráfico se reparte entre la app nueva y la anterior | [I] |
| API del front | **tRPC** en el mismo dominio, `/api/trpc/<router>.<proc>` con `x-trpc-source: nextjs-react`. Rutas vistas: `appConfig.get`, `menuCategory.getByStore`, `product.getByStore`, `product.getBySkus`, `createYourOwn.getCreateYourOwn`, `stores.getStoreById`, `productBuilder.getDataByStore`, `productBuilder.getNutritionalInfo`, `productModification.getCrusts`, `toppings.getToppingsByCategory`, `sauces.getByStore`, `instructionGroups.getAll`, `cart.addToCart` | [V] |
| Catálogo | Todo depende de la tienda (`storeId`). Sin tienda se usa `storeId: 0` y no se muestran precios | [V] |
| Estado cliente | Stores tipo Zustand en `localStorage`: `cart-store`, `deals-store`, `menu-store`, `store-location-store`, `customer_state` (= `"warm"`) | [V] |
| Feature flags / A/B | **LaunchDarkly**: SDK, eventos y observabilidad (`otel.observability.app.launchdarkly.com`). El contexto incluye `storeId`, así que puede variar por tienda | [V] |
| CRM / mensajería | **Braze** (`sdk.iad-05.braze.com`, `ab.storage.*` con *content cards* y *triggers*) y **Firebase** (proyecto `pji-prod-crm-firebase`, Remote Config; login sin contraseña "Log in with Quick Link") | [V] |
| Analítica | GTM `GTM-NVDDFQ` con GA4 vía proxy propio (`/pj-gtg/`), GA Universal (`analytics.js`), Google Ads/DoubleClick (`DC-2543611`), **FullStory** (grabación de sesiones), **AppDynamics** (RUM), Akamai mPulse | [V] |
| Consentimiento | OneTrust con autobloqueo y `geolocation=US;NY` | [V] |
| Otros | `p11.techlab-cdn.com` (5 scripts ofuscados, sin identificar; quizá seguridad del lado del cliente [I]), Google Maps, Font Awesome (unpkg) | [V] |
| Pagos (config.) | `appConfig` expone Google Pay (gateway y merchant ID). Hay un `foodAiMerchantId` (probablemente el agente de pedido con IA [I]) | [V] |
| Páginas SEO | `/specials/` y "Pizza Pages" son otro sitio (GA clásico, JSON-LD `CollectionPage`). Sus "ORDER NOW" llevan a `/order/specials`, no a la oferta concreta. La home de la app no tiene JSON-LD | [V] |

**Peso de la home** (escritorio, primera carga) [V]: 166 requests, ~2,5 MB transferidos, ~1,56 MB de JS, 24 dominios. TTFB 0,66 s, DOMContentLoaded 1,34 s, load 3,3 s.
En móvil, con Slow 4G y CPU 4x, sin caché: 141 requests, 1,7 MB, 1,07 MB de JS, FCP 2,5 s, **LCP 13,3 s**, load 10,5 s [V]. Esas condiciones se parecen a las de Lighthouse móvil, así que el puntaje de rendimiento sería bajo [I].

**Lighthouse móvil, home** [V]: accesibilidad **85**, buenas prácticas **81**, SEO **92**. El modo navegación de la herramienta no da puntaje de rendimiento (ver arriba). Fallos: zoom bloqueado (`user-scalable=no`), sin landmark `main` en la home, contraste del pie, orden de encabezados, objetivo táctil del carrito de 28x16 px, 4 enlaces sin texto descriptivo y una API obsoleta. Informe completo en `datos/raw/lighthouse-pjus/report.html`.

## 2. Recorrido momento a momento

| # | Momento | Qué pasa | Tiempo aprox. | Captura |
|---|---|---|---|---|
| 1 | Portada sin tienda | Barra superior "START YOUR ORDER", "TRACK MY ORDER", carrito "$0.00", MENU / DEALS / JOIN PAPA REWARDS, **campo de cupón visible en el header** y LOG IN. El hero es un carrusel de 3 tarjetas con texto real (no imagen): "FEATURED DEAL · THE WORKS // MEDIUM · Original or NY Style · From $10.99" y un botón "+". Debajo, "GREAT DEALS" con 6 tarjetas **"LOCKED"** ("UNLOCK LOCAL DEALS SELECT YOUR STORE"…), luego categorías, el bloque Papa Rewards (4 beneficios) y "ORDER FROM OUR APP" | TTFB 0,66 s · load 3,3 s | pjus-portada |
| 2 | Menú sin tienda | `/order/menu/pizza` sí se ve: pestañas de 9 categorías, carrusel de 7 masas con descripción y secciones (Most Popular, Handcrafted Specialties…). **Sin precios.** Los productos son botones, no enlaces | load 0,76 s | pjus-menu-sin-tienda |
| 3 | Muro de tienda | Al tocar "+" en un producto se va a `/order/delivery?target=/order/builder/pizza?…sku=1-1-4-24`. Hay que elegir Delivery o Carryout. Carryout pide ZIP o "Use my Current Location". Delivery pide tipo de dirección, país, calle y depto. | — | pjus-modalidad |
| 4 | Lista de tiendas | Para 10001 salen 6 tiendas con dirección, teléfono, "Directions" y horario de carryout y delivery. **No muestra distancia, tiempo estimado ni estado abierto/cerrado**, y las 3 primeras son de Nueva Jersey | ~2 s | pjus-tiendas |
| 5 | Vuelta al producto | Al elegir tienda **vuelve al configurador de la pizza tocada** (se respeta `target`). Header: "Carryout from 343 GRAND ST…" | 3,7 s desde el clic | pjus-ficha |
| 6 | Ficha / configurador | URL propia y compartible (`/order/builder/pizza?section=…&productGroup=the-works&sku=…&storeId=4091`). Nombre, **$19.49, "340 cal/slice, 8 slices"**, "WHAT'S ON IT" con chips quitables (✕), pestañas Size · Crust · Crust Flavor · Cut · Sauce · Bake · Cheese · Meats · Veggies. Tamaños S/M/L/XL con **precio relativo** ("-$4.00", "-$2.50"), L preseleccionado. 7 masas con "+$2.00" y "+100 cal", etiqueta "NEW" en Pan. Por ingrediente: **Normal/Extra** y **mitad izquierda/entera/derecha**, calorías de cada uno. Corte (Normal, Square, Clean, No Cut), horneado (Normal, Well Done). Barra fija con cantidad 1-20 y "Add to Order". Nutrición y alérgenos enlazados | carga directa 0,6 s | pjus-ficha, pjus-movil-ficha, pjus-movil-ingredientes-mitades |
| 7 | Agregar al carrito | **Bloqueado por Akamai (400).** Sin confirmación visible | — | — |
| 8 | Deals con tienda | `/order/specials`: 12 ofertas con **precio oferta y precio tachado** ($10.99 ~~$16.99~~), "FEATURED DEAL", "CARRYOUT OFFER", "20% OFF", "MINIMUM SPEND $40 · FREE DELIVERY". En portada aparece además "LUNCH SPECIAL!" | load 1,1 s | pjus-deals, pjus-portada-deals-desbloqueados |
| 9 | Armar oferta | "BUILD MY DEAL" por pasos numerados ("1 Select your pizza", "2 Select your pizza"). Papa Pairings: "Select your third item (Optional)" y "Add deal to cart (2 items min.)" | — | pjus-build-my-deal, pjus-papa-pairings |
| 10 | Carrito | Vacío: "There are no items in your order. VIEW THE MENU" | — | — |
| 11 | Checkout | No alcanzado. `cart-store` ya tiene `tip`, `orderReadyTime` (pedido programado), `noContactDelivery`, `maxBankedRewardsToUse` (Papa Dough), `dealSavingsTotal`, `totalSavings`, `loyaltyEligibleSubtotal`, `feeList` y `taxList` | — | — |
| 12 | Tracker | "TRACK MY ORDER" en el header. Sin sesión ni pedido manda al login | — | — |

## 3. Escritorio vs. móvil

| Tema | Escritorio | Móvil (390) |
|---|---|---|
| Navegación | Header de 2 filas con cupón y "TRACK MY ORDER" | Franja superior con la modalidad ("CARRYOUT: 343 Grand St…"), hamburguesa, logo y carrito; **barra sticky arriba** con MENU · DEALS · REWARDS · LOG IN. **No hay barra inferior tipo app** [V] |
| Hero | 2 tarjetas visibles | 1 tarjeta y media (se insinúa la siguiente) |
| Ficha | Dos columnas: foto y configurador con pestañas | Una columna, encabezado sticky (nombre, precio, cal) y **barra inferior fija** con cantidad y "Add to Order" [V] |
| Hoja inferior | No | No: todo son páginas completas |
| Estorbos | Botón flotante de cookies (OneTrust) abajo a la derecha | El mismo botón tapa el "+" de la segunda oferta y el borde del CTA [V] |
| App | Bloque "ORDER FROM OUR APP" al final | Igual, más `apple-itunes-app` (Smart App Banner en Safari) [V] |

## 4. Mecanismos de enganche

Toques contados en escritorio desde la portada hasta que la pizza queda lista para agregar, sin tienda previa [V]:
"+" en la pizza (1) → Carryout (2) → escribir ZIP (3) → "See Carryout Locations" (4) → "SELECT STORE" (5) → "Add to Order" (6). Lo que sigue lo deduzco del flujo estándar [I]: carrito (7) → checkout (8). Con tienda ya elegida, son 2 toques hasta agregar.

| Recurso | Evidencia (texto exacto · dónde) | ¿Funciona? |
|---|---|---|
| Precio y ahorro | "$10.99 ~~$16.99~~" y "$14.99 ~~$19.49~~" en las tarjetas de Deals y en la portada con tienda; "From $10.99" sin tienda; "$7.99 each"; "$6.99 /each" (pjus-deals) | Sí: ancla clara y precio en texto, no en imagen |
| Ahorro en carrito | El carrito guarda `dealSavingsTotal`/`totalSavings` [V]; mostrarlo como "You saved $X" es inferencia [I] | No visto |
| Valores por defecto | L, Original Crust, Normal Cheese y los toppings de la receta vienen marcados; "Add to Order" activo desde el inicio (pjus-ficha) | Sí: 1 toque para agregar |
| Precio relativo | "-$4.00" en S, "+$2.00" en Epic Stuffed: se ve el costo de cada decisión | Sí |
| Urgencia / tiempo | "LUNCH SPECIAL!" en la portada con tienda; "Offers good for a limited time" (legal) | Débil: sin contador ni hora límite |
| Escasez / bloqueo | 6 tarjetas "LOCKED" con "UNLOCK LOCAL DEALS SELECT YOUR STORE", "MORE DEALS ARE WAITING — LOG IN OR CHOOSE YOUR STORE" (pjus-portada) | Curiosidad que empuja a elegir tienda, pero oculta el precio |
| Novedad | Etiqueta roja "NEW" en Pan Crust; "FEATURED DEAL" | Sí |
| Umbral de gasto | "MINIMUM SPEND $40 · FREE DELIVERY" en Deals | Existe; no vi una barra "te faltan $X" (requiere carrito) |
| Agrupar para subir el ticket | "Papa Pairings · Get 2 or More · From $6.99 /each"; "Add deal to cart (2 items min.)"; tercer ítem opcional | Sí: sube el ticket con poca fricción |
| Lealtad | Portada: "Earn Papa Dough® faster than ever, and redeem it toward any menu item!" y los 4 iconos "Pizza = Papa Dough · Exclusive Deals · Birthday Freebie · First Dibs". FAQ: "Earn 1 point for every $1…", "Every 10 points … convert to $1 in Papa Dough", "Papa Dough … expires sixty days after you receive it", código de 12 dígitos en la boleta para reclamar puntos | Regla simple (10 % de vuelta [I]) y caducidad de 60 días que empuja a volver |
| Lealtad en el producto | En la ficha no hay "ganas X puntos" [V] | Falta |
| Cuenta | "JOIN PAPA REWARDS" fijo en el header; login sin contraseña ("Log in with Quick Link"); "Start earning Papa Dough® to redeem toward any menu item. Join Now" | Fricción baja para registrarse |
| App | "ORDER FROM OUR APP · Download the Papa Johns app for a faster ordering experience" (h1 de la home) + Smart App Banner | Discreto, sin incentivo concreto |
| Prueba social | No hay valoraciones, "más pedido" con número ni reseñas. Solo la sección "MOST POPULAR" en el menú | Débil |
| Contenido emocional | Fotos grandes de producto, tipografía condensada propia, "Better Ingredients. Better Pizza.®", masa "Fresh, never frozen. Made with 6 simple ingredients" | Sí, sin video |
| Upsell en ficha | Ninguno durante la configuración (no hay "agrega bebida"). El request lleva `papaSized:false` (mejora de tamaño "Papa Size") [I] | No visto |
| Abandono | Braze con *content cards* y *triggers* y `customer_state:"warm"` hacen posible la recuperación [I]; en sesión anónima no apareció nada | No visto |
| Post-compra | "TRACK MY ORDER" siempre en el header [V]; tracker no visto | — |

**Qué hacen mal o dónde molestan** [V]:
- El hero cuenta una oferta, pero sin tienda el "+" de "THE WORKS // MEDIUM" lleva a elegir tienda con `target=/order/specials`: **se pierde la oferta concreta** y el comprador cae en la lista general.
- **Deal link frío = 404.** `/order/specials/65920/build-my-deal` sin `storeId` en una sesión nueva muestra "LOOKS LIKE SOMEONE TOOK THE LAST SLICE" (pjus-deal-link-404). Con `storeId` sí manda a elegir tienda y conserva el destino.
- Menú sin precios hasta elegir tienda, y deals "LOCKED".
- Las tiendas no están ordenadas por cercanía real (salen primero las de NJ para un ZIP de Manhattan), y no muestran distancia, tiempo ni estado.
- Precio raro en el menú: "Create Your Own Pan Pizza $21.24 (M)" cuesta más que una L ($16.99).
- Zoom bloqueado y botón de cookies tapando controles en móvil.
- Tracker y "Papa Rewards" (Learn More) mandan al login sin explicar nada antes.

## 5. Personalización por perfil

| Patrón en PJ EE.UU. | Evidencia | Sofía (heavy) | Diego (switcher) | Valentina (dormida) |
|---|---|---|---|---|
| Recordar tienda y modalidad entre visitas (cookie `location="storeId=4091"`, header "Carryout from…") | [V] | ●●● | ● | ●● |
| Papa Rewards: 1 pt/$1, 10 pt = $1, cumpleaños, "First Dibs", "Exclusive Deals" | [V] portada y FAQ | ●●● | ●● (motivo para volver) | ●● (reactivación) |
| Papa Dough que caduca a los 60 días y puntos que caducan tras 12 meses sin actividad | [V] FAQ | ●●● | ● | ●●● (motivo de "vuelve") |
| Deals "LOCKED" hasta tienda o login: "LOG IN OR SELECT A STORE TO VIEW MORE DEALS" | [V] | ●● | ●● | ● (muro) |
| Mensajes distintos para invitado y logueado: "or sign in" junto a "Select a store"; header "JOIN PAPA REWARDS" vs. cuenta | [V] solo invitado | ●● | ● | ● |
| Segmento de visitante en el cliente (`customer_state: "warm"`) | [V] valor; uso [I] | ●● | ●● | ●● |
| Content cards y triggers de Braze en la web | [V] SDK; contenido no visto | ●●● | ●● | ●●● |
| Flags de LaunchDarkly por tienda o usuario (A/B, despliegue gradual) | [V] contexto con `storeId` | ● | ●● | ● |
| Grabación de sesiones (FullStory) y RUM (AppDynamics, mPulse) | [V] | — (medición) | — | — |
| Deal link con oferta precargada | [V] con `storeId`, va a tienda y conserva el destino. Sin `storeId` da 404. El hero en frío pierde la oferta | — | ●●● (lo hace a medias) | ●● |
| Cupón en el header ("Enter promo code · Apply") | [V] | ● | ●●● (código del anuncio) | ●● |
| Ofertas por ocasión o tamaño de grupo | No hay "para 2 / para 4 / partido". Lo más cercano: "TWO MEDIUM PIZZAS", "TWO LARGE … AND 2-LITER DRINK", "Papa Pairings · Get 2 or More" | — | ●● (implícito) | ● |
| Oferta por horario ("LUNCH SPECIAL!") | [V] | ● | ●● | ● |
| Reorden / "recent orders" / favoritos | No visible sin sesión; prensa: reorden sin toques en la app | ●●● | — | — |
| Compra como invitado | Probable (el carrito no exige login para configurar) pero no se llegó al checkout | — | ●● | ●●● |

Lectura: PJ EE.UU. tiene **las piezas técnicas** (Braze, LaunchDarkly, segmento de visitante, deals por tienda o login), pero la web anónima personaliza poco a la vista. La diferencia visible es tienda frente a sin tienda, no un perfil. No hay ocasiones ni tamaño de grupo, y el deep link de campaña es frágil.

## 6. Papa Johns EE.UU. vs. Papa John's Chile

| Momento | PJ EE.UU. | PJ Chile (auditoría 13-oct) |
|---|---|---|
| Portada | Hero con texto real, precio "From $10.99" y "+"; deals bloqueados sin tienda | Banner-imagen con texto y legales incrustados, botón flotante "Comenzar pedido" |
| Ver productos sin tienda | Sí, menú completo **sin precios** | Catálogo visible; el detalle exige dirección |
| Muro de tienda | Al tocar "+"; vuelve al producto | Al abrir el detalle; vuelve al configurador |
| Tiendas | 6 resultados con horario, sin distancia ni estado | 3 cercanas al buscar dirección |
| URL de producto | Sí, compartible (`/order/builder/pizza?…&sku=`) | No (panel, `/#Pizzas`) |
| Configurador | Pestañas por paso, chips quitables, **Normal/Extra y mitades por ingrediente**, calorías por opción, precio relativo por tamaño | 4 tamaños, 5 masas, mitades como producto aparte; "0 cal/trozo" erróneo |
| Ofertas | Lista con precio tachado y "Build my deal" por pasos | Precio único; la API trae `original_price` pero no se muestra |
| Cupón | Campo en el header en todo el sitio | Cupón o gift card en el checkout |
| Lealtad | 4 beneficios en portada, reglas claras (1 pt/$1, 10 pt = $1), caducidad | 1 pt/$1.000; "Estás por perder N Papa Puntos" en checkout |
| Agregar / carrito / checkout | **No observable** (bloqueo de Akamai) | Carrito lateral con mejora y acompañamientos; checkout de una página, invitado |
| Tracker | "TRACK MY ORDER" fijo en el header | No destacado |
| Móvil | Barra superior sticky, CTA fijo en la ficha, sin barra inferior | Hamburguesa y pestañas con scroll |
| Lighthouse móvil | A11y 85 · BP 81 · SEO 92 | A11y 73 · BP 69 · SEO 92 |
| Peso home (escritorio) | 166 req · 2,5 MB · 1,56 MB JS · 24 dominios | 250 req · 2,9 MB · 1,7 MB JS · 29 dominios |
| SEO vs. tienda | Sitio SEO aparte; "ORDER NOW" lleva a la lista de deals, no a la oferta | Landings Next.js sin precio ni compra |

## 7. Lo que la demo debería tomar de aquí (por prioridad)

1. **Ficha con URL propia y configurador por pestañas**: precio relativo por tamaño ("-$4.00", "+$2.00"), chips "WHAT'S ON IT" quitables, **Normal/Extra y mitad izquierda/entera/derecha por ingrediente**, calorías por opción y CTA fijo abajo en móvil.
2. **Receta preseleccionada y "Add to Order" activo**: un toque para la compra típica.
3. **Precio oferta y precio tachado en texto** en hero, portada y deals, con etiquetas "FEATURED DEAL", "NEW", "CARRYOUT OFFER".
4. **"Build my deal" por pasos** (1, 2, 3 opcional) con mínimo explícito ("2 items min."): base natural para las ocasiones de Diego ("para 2", "para 4").
5. **Volver al destino tras elegir tienda** (`target=`), pero **mejorado**: que la oferta del hero y el deep link sin tienda conserven la oferta exacta, nunca 404 ni lista genérica.
6. **Cupón visible en el header**, aplicable desde el link de campaña.
7. **Lealtad explicada en 4 iconos y 2 reglas**, con caducidad visible ("tu Papa Dough vence en N días") para Sofía y Valentina. Sumar lo que PJ EE.UU. no hace: puntos a ganar en la ficha y en el carrito.
8. **"TRACK MY ORDER" permanente en el header.**
9. **Ofertas que dependen de la hora** ("LUNCH SPECIAL!") como regla de contenido.
10. **Arquitectura de referencia**: feature flags por tienda y segmento (LaunchDarkly), CRM en la web (Braze, en Chile Synerise) y segmento de visitante (`customer_state`). Es el mismo patrón que la demo debe mostrar con Synerise y Salesforce.

**Lo que NO copiar**: deals "LOCKED" y menú sin precio antes de elegir tienda (mejor un precio "desde" y la tienda después); lista de tiendas sin distancia, tiempo ni estado; deep links que dan 404; zoom bloqueado; botón flotante de cookies sobre los controles; LCP de 13 s en móvil lento; JS de 1,5 MB con 6 herramientas de medición; "Learn More" de Rewards que manda directo al login.

## 8. Capturas

En `capturas/raw/`: `pjus-portada`, `pjus-menu-sin-tienda`, `pjus-modalidad`, `pjus-tiendas`, `pjus-ficha`, `pjus-deals`, `pjus-build-my-deal`, `pjus-papa-pairings`, `pjus-deal-link-404`, `pjus-portada-con-tienda`, `pjus-portada-deals-desbloqueados`, `pjus-movil-portada`, `pjus-movil-menu`, `pjus-movil-ficha`, `pjus-movil-ingredientes-mitades` (.jpeg).

## 9. No visto (pendiente con un navegador no automatizado)

Confirmación al agregar, upsell en el carrito y en el checkout, "te faltan $X para envío gratis", checkout (pasos, invitado, pagos, propina, programado), aplicación automática de la mejor oferta, tracker con pedido, reorden y favoritos (requieren cuenta), y puntuación de rendimiento de Lighthouse. Para cubrirlo hace falta un Chrome normal (no controlado por DevTools) desde EE.UU., hecho a mano.
