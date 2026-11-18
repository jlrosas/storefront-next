# Papa John's Chile — exploración para la demo de Salesforce

Fecha: 13-oct-2026. Auditoría hecha en Chrome sobre papajohns.cl y meltpizzas.com (escritorio y móvil emulado) y papajohns.com.pe (escritorio), más benchmark de líderes por búsqueda web. No se envió ningún pedido ni se ingresaron datos personales.

Leyenda: **[V]** observado directamente o verificado en fuente · **[S]** fuente secundaria · **[I]** inferencia mía.

## 1. Conclusión

- El sitio de Papa John's **funciona bien como motor de pedido**: tiene configurador, mitades, upsell en carrito, compra como invitado y puntos. Lo que pierde frente a Melt es **presentación, contenido y coherencia**, no funciones.
- Lo que probablemente "les encanta" de Melt **[I]**: portada editorial con texto real y precios tachados, navegación tipo app en móvil, página propia por producto con precio, y un programa de puntos explicado en tres reglas.
- Melt tiene debilidades que la demo puede superar: al agregar sin tienda te saca a otra página y te deja en la portada sin confirmar, el pago va por pasos y usa un sitio móvil separado. Su velocidad fue irregular entre sesiones y no sirve como argumento (ver sección 3).
- **Papa Johns Perú usa la misma solución que Melt** (Adobe Commerce con los mismos módulos de Infracommerce) y allí no es lenta. El rival probable de la propuesta es ese acelerador, que ya tiene una referencia de la misma marca (sección 4).
- **Riesgo comercial:** ningún líder mundial de pizza usa Salesforce Commerce Cloud para pedir, y Salesforce posiciona restaurantes con Data Cloud, Marketing, Loyalty y Agentforce, no con Commerce. Hay que decidir si la demo es "storefront nuevo" o "storefront + capa de cliente".

## 2. Papa John's Chile: estado actual

### Arquitectura [V]

| Pieza | Qué es |
|---|---|
| Tienda (`www.papajohns.cl/`) | SPA React (Vite), bundle principal de 658 KB, sin render en servidor |
| Páginas SEO (`/pizzas/`, `/pizzas/<slug>/`, `/menu/`) | Aplicación Next.js distinta, servida desde `landings.papajohns.cl` |
| API | `api.papajohns.cl` (v1/v2), JSON público sin autenticación para catálogo |
| Imágenes | `cdn.papajohns.cl` |
| Blog | `blog.papajohns.cl` |
| CDP / lealtad | Synerise (tracking, contenido dinámico, web push, cashback) |
| Otros tags | Selligent, Barilliance, Criteo, Awin, Hotjar (2 cuentas), Clarity, GA4 + GA Universal, Google Optimize, TikTok, Meta, Bing, Acuity, Sentry |
| Despacho | Flota propia más Uber Direct; campos para PedidosYa y Just Eat por tienda |
| Pagos (config. de tienda) | Webpay/crédito, Oneclick, Onepay, Mercado Pago, Fintoc, RUTPay, Sodexo, efectivo |

Home en escritorio: 250 requests, 2,9 MB, 1,7 MB de JavaScript, 29 dominios. Lighthouse móvil: accesibilidad 73, buenas prácticas 69, SEO 92.

### Limitaciones observadas [V]

1. **Dos sitios que no se hablan.** Las páginas SEO de producto no muestran precio ni botón de compra; solo "Ver más", que lleva al home. Otro header, sin carrito. Quien llega desde Google no puede comprar ahí.
2. **Producto sin URL propia en la tienda.** El detalle es un panel lateral; la dirección no cambia (`/#Pizzas`). No se puede compartir ni enlazar desde una campaña.
3. **Muro de dirección.** No se puede abrir el detalle de una pizza sin elegir antes delivery o retiro.
4. **Contenido como imagen.** Los banners llevan texto, precio y legales dentro de la imagen: ilegibles en móvil e invisibles para buscadores. `og:image` sale como `null`.
5. **Sin buscador** de productos.
6. **Errores visibles de datos y traducción:** "0 cal/trozo · 0 trozos" en el detalle; el método de pago aparece como `web_online`; la tienda por defecto es un registro ficticio ("Selecciona una tienda", coordenadas en Bolivia); `core_settings` expone `foo`/`bar`.
7. **Checkout que valida antes de tiempo:** los tres campos aparecen en rojo al cargar la página.
8. **Accesibilidad:** zoom bloqueado (`user-scalable=no`), contraste insuficiente, imágenes sin `alt`, sin landmark `main`, objetivos táctiles pequeños. El botón de WhatsApp tapa "Ver todas" en móvil.
9. **Exceso de tags:** herramientas duplicadas o descontinuadas (GA Universal, Google Optimize, dos Hotjar).
10. Aparece "La tienda está cerrada" con tienda seleccionada y aun así deja llegar al checkout. Visto una sola vez; **confirmar** si es un bug o el horario.

### Lo que ya hace bien [V]

- Configurador completo: 4 tamaños, 5 masas en el flujo (10 en la API), salsa, queso, shots, carnes, vegetales, "Arma tu pizza" y "Pizza por mitades".
- Carrito lateral con mejora sugerida ("Mejora a borde de queso por $3.490") y carrusel de acompañamientos.
- Checkout en una página, compra como invitado, cupón o gift card, aviso "Estás por perder 16 Papa Puntos".
- Etiqueta "Más vendido" y orden del catálogo por tienda.
- Papa Puntos: 1 punto por cada $1.000, canje por productos.

## 3. Melt Pizzas: qué tiene y qué le falta

### Arquitectura [V]

- **Adobe Commerce (Magento 2)**, tema Luma personalizado con RequireJS y Knockout. Implementador: **Infracommerce** (firma en el pie del checkout; módulos `SummaSolutions_*` e `Infracommerce_*`).
- Contenido con **Page Builder** (83 bloques en el home: filas, sliders, columnas, carruseles de productos).
- Pizzas como productos *bundle*; inventario por tienda (`/inventory/source/`); búsqueda con ElasticSuite.
- Dotdigital (email, SMS, chat), Mercado Pago, módulo propio de puntos (`Melt_Points`), reCAPTCHA, chatbot.
- **Sitio móvil separado** en `m.meltpizzas.com` con tema propio.
- Lighthouse móvil: accesibilidad 85, buenas prácticas 73, SEO 100.

### Ventajas frente a Papa John's [V]

| Tema | Melt | Papa John's |
|---|---|---|
| Portada | Hero con texto real: "Hit del mes", $9.990, precio tachado, etiqueta -40%, botón | Banner-imagen con todo incrustado |
| Inicio del pedido | Bloque "Empieza tu pedido": Delivery, Retiro, Menú, Promos, Combos, Puntos, Locales | Botón flotante "Comenzar pedido" |
| Promos | Precio antes/ahora en cada tarjeta, etiquetas "Solo delivery" / "Solo retiro" | Precio único; la API trae `original_price` pero la portada no lo muestra |
| Producto | Página propia con URL, precio y barra fija de compra; se ve sin elegir tienda | Panel sin URL, tras el muro de dirección |
| Navegación móvil | Barra inferior tipo app (Inicio, Promos, Menú, Puntos, Carrito) | Menú hamburguesa y pestañas con scroll |
| Menú | Una página con 10 secciones y anclas | Pestañas por categoría |
| Buscador | Sí | No |
| Lealtad | Página editorial: tres reglas, tramos de canje 20/40/60 y calculadora interactiva; 40% en el primer pedido | Una frase y una lista de preguntas frecuentes |
| Tiendas | Lista con horario, estado abierto/cerrado y tiempo estimado; mapa para delivery | Buscador de dirección con 3 tiendas cercanas |
| Cross-sell | Bloque "¿Quieres agregar un extra?" en el carrito | Carrusel en el carrito (equivalente) |
| SEO | Datos estructurados `Restaurant` con `OrderAction`; landings de contenido | Solo `Organization` |

### Debilidades de Melt [V]

- **Velocidad irregular:** en la primera sesión el carrito tardó 14,2 s en responder y el checkout 27 s en cargar; en una segunda sesión el mismo día tardaron 2 s y 3 s. No se puede afirmar que sea lento.
- **Rompe el hilo al agregar:** sin tienda elegida, redirige a otra página y luego deja en la portada o el menú, sin confirmación. La pizza sí queda en el carrito (corregido en la segunda sesión: antes creí que se perdía), pero el comprador no lo ve.
- Checkout por pasos: los medios de pago no se ven hasta confirmar los datos.
- Dos sitios (escritorio y móvil) que mantener; desborde horizontal en escritorio; home sin `h1`.
- Sin mitades visibles en la página de producto; la personalización son listas de radios y contadores.

## 4. Líderes mundiales

| Cadena | Venta digital | Lealtad | Plataforma |
|---|---|---|---|
| Domino's (EE.UU.) | Más de 85% de las ventas **[S]** | 37,3 M de miembros activos, cierre 2025 **[V]** | Propia, sobre Microsoft Azure |
| Papa Johns (global) | Cerca de 70% por canales propios **[S]** | Casi 41 M de miembros, Q4 2025 **[V]** | Propia, sobre Google Cloud |
| Pizza Hut | Sin cifra propia | Sin cifra | Byte by Yum! **[V]** |
| Little Caesars | No publica | — | No pública |

Qué ofrecen y explica esas ventas:

- **Domino's:** tracker con hora estimada, pedido guardado para reordenar, cupones personales ("My Deals") en primer plano, lealtad dentro del checkout, web y app rediseñadas en 2025 con feedback pagado de clientes **[V]**.
- **Papa Johns global:** app nueva (40% más rápida, +0,7% de conversión), agente de pedido con IA que aplica sola la mejor combinación de ofertas, reorden sin toques, pedido por voz y grupal **[V]**. Los miembros de lealtad piden 2,5 veces más **[V]**.
- **Chile:** Papa John's lidera con 172 locales **[V]**; Telepizza y Pizza Hut cerraron en enero de 2025 **[V]**. Domino's 49, Melt 44, Little Caesars 44 (datos 2024). dominospizza.cl es básico: sin lealtad visible y vacía el carrito al cambiar de modalidad **[V]**.

### Alcance de esta sección: los sitios de EE.UU. no se pudieron recorrer [V]

Todo lo anterior sobre Domino's y Papa Johns global viene de prensa y reportes, no de usar sus sitios. Intenté recorrerlos en Chrome el 13-oct-2026 y ambos bloquean por ubicación en el CDN (Akamai), antes de llegar a la aplicación:

- `dominos.com` (cualquier ruta) responde 302 hacia `dominos.com.pe`.
- `papajohns.com` (cualquier ruta) sirve una página internacional estática de 16 KB que redirige a `papajohns.com.pe`.

Para recorrerlos hace falta una conexión con salida en EE.UU. Lo que sí cargó (Domino's Perú solo en portada; Papa Johns Perú recorrido hasta el checkout, ver apartado siguiente):

| Sitio | Plataforma | Observaciones |
|---|---|---|
| dominos.com.pe | Plataforma global de Domino's (objetos `dpz`/`jsDPZ`, métricas en `smetrics.dominos.com`, LaunchDarkly, Tealium) | Portada mínima: "Empieza tu pedido" con Entrega o Recoger, Pizza Tracker en el menú, garantía de 30 minutos. No es necesariamente el rediseño de EE.UU. de 2025 |
| papajohns.com.pe | **Adobe Commerce (Magento 2)**, tema `Ngr/papajohns`, recomendaciones de Adobe, gopersonal.ai | Misma plataforma que Melt. Promos con precio tachado y etiqueta de descuento (-47%), "Sigue tu pedido", "Mis favoritos", pedido por WhatsApp |

Dato útil para la venta: **un franquiciado de Papa Johns en la región ya opera sobre una plataforma comercial de e-commerce (Adobe)**, igual que Melt. Confirma que el modelo es viable para la marca y que el competidor a vencer en la propuesta es Adobe Commerce.

### Papa Johns Perú: recorrido hasta el checkout [V]

Recorrido en escritorio el 13-oct-2026: portada, listado, producto, selección de tienda (retiro), carrito y primer paso del checkout. Me detuve donde pide el correo.

**Es la misma solución que Melt.** Comparte con meltpizzas.com los módulos `SummaSolutions_Inventory`, `SummaTheme_StorePickup`, `SummaTheme_PageBuilder`, `Infracommerce_*`, la ruta `/inventory/source/` para elegir tienda, la barra fija de compra en el producto y el checkout que empieza por el correo. Operador: NGR (tema `Ngr/papajohns`, módulos `Ngr_*`). Todo indica un mismo implementador (Infracommerce) con un acelerador para restaurantes sobre Adobe Commerce **[I]**. Es Adobe Commerce de pago, no Magento Open Source: usa Page Builder, recomendaciones de Adobe, saldo de cliente, gift cards y puntos (`reward`), con Fastly delante.

| Aspecto | Papa Johns Perú | Frente a Papa John's Chile |
|---|---|---|
| Portada | 109 bloques de Page Builder; carruseles "Promos imperdibles", "Recomendadas para ti", "Los más vendidos"; precio antes/ahora y etiqueta de descuento (-12% a -66%); preguntas frecuentes con datos estructurados; h1 presente | Chile usa banners con texto incrustado y sin precio tachado en portada |
| Producto | URL propia (`/pepperoni`), título y descripción para buscadores, datos estructurados de producto, imagen para redes, favoritos, visible sin elegir tienda | Chile no tiene URL de producto y exige dirección antes de ver el detalle |
| Configurador | Pasos en acordeón con contador "Selección 0/1": tamaño (5, con precio antes/ahora), masa (4) y extras. En Pepperoni no deja quitar ni agregar ingredientes ni armar mitades | Chile es más completo: ingredientes, mitades, "Arma tu pizza" |
| Tienda | Página con pestañas Delivery / Retiro, 72 locales con estado "Abierto", mapa y "Usar mi ubicación actual" | Similar en función; Chile lo resuelve en un modal |
| Carrito | Lateral con subtotal; página de carrito con cupón. No vi venta cruzada | Chile tiene mejora sugerida y carrusel de acompañamientos |
| Checkout | Por pasos (Mi bolsa, Envío, Pago), invitado, correo primero. Medios configurados: Izipay, Yape, Niubiz, PayPal | Chile lo resuelve en una página |
| Otros | Buscador, "Sigue tu pedido", "Mis pedidos: repite tu antojo", pedido por WhatsApp | Chile no tiene buscador |

Mediciones (una carga cada una): portada con respuesta en 0,17 s y carga en 1,6 s; producto 1,0 s; carrito 2,0 s; checkout 3,9 s. Lighthouse móvil en portada: accesibilidad 85, buenas prácticas 54, SEO 100. Un solo dominio para escritorio y móvil (no redirige a un sitio `m.`).

Puntos débiles: portada pesada (913 KB de HTML, cerca de 200 scripts de 26 dominios de terceros, 10 MB descomprimidos); buenas prácticas 54; no encontré una página que explique el programa de puntos, aunque el módulo `Infracommerce_LoyaltyPoints` está cargado.

**Qué cambia para la venta:**

- **La lentitud de Melt no es de la plataforma.** La misma solución en Perú carga carrito y checkout en 2 a 4 segundos. El argumento "Adobe es lento" no se sostiene, y tampoco "Melt es lento": su segunda medición fue de 2 a 3 segundos.
- **El rival probable es Infracommerce con Adobe Commerce**, que ya tiene dos referencias de pizzería en la región, una de ellas de la misma marca. Si el cliente pide a Infracommerce "lo de Melt", recibe algo ya construido. Conviene preguntar al cliente si ya conversó con ellos.
- **Lo que les gusta de Melt existe con marca Papa Johns.** El sitio de Perú sirve para mostrarle al cliente cómo se vería su marca con ese patrón y para validar qué es lo que les gusta.
- **Dónde puede ganar la demo:** el configurador completo de Chile (ingredientes y mitades) dentro de una página de producto con URL, venta cruzada en carrito, checkout en una página, programa de puntos visible, y la capa de cliente que este acelerador no muestra.

**Mi recomendación de referencias de usabilidad [I]** (basada en cifras de venta digital, no en una evaluación propia de la experiencia)**:** Domino's EE.UU. (el estándar del sector), Papa Johns EE.UU. (misma marca: alinea la propuesta con la casa matriz) y Melt como referencia local del gusto del cliente.

Pendientes del benchmark: la propiedad actual de PJ Chile es contradictoria entre fuentes (Lezo Partners vs. Drake Foods); las cifras de 85% y 70% no se confirmaron en documento primario; no hay caso público de pizzería o QSR latinoamericano sobre Salesforce. El caso citable más cercano es Casey's (Marketing Cloud + Data Cloud).

## 5. Datos disponibles para cargar la demo [V]

La API pública entrega todo el catálogo en JSON, sin necesidad de raspar HTML:

| Endpoint | Contenido |
|---|---|
| `v1/prices?store_id=&dispatch_method=` | 60 productos (24 pizzas, 13 acompañamientos, 9 postres, 9 bebidas, extras), 219 variantes con precio, 436 imágenes |
| `v1/offers/promotions?store_id=&dispatch_method=` | 13 combos con precio, precio original, vigencia, días y reglas de ingredientes |
| `v1/ingredients?store_id=` | 29 ingredientes en 8 categorías, con íconos |
| `v2/sizes_and_crusts` | Tamaños, masas y precio por ingrediente extra |
| `v1/deal_pictures?...` | Banners con vigencia y días de la semana |
| `v1/stores/<id>?dispatch_method=pj_delivery` | Tienda: dirección, coordenadas, tiempos, medios de pago |
| `v1/core_settings`, `v1/orders_settings` | Reglas: mínimo de delivery $12.000, valor del punto, topes |

Falta resolver el listado de tiendas: `v1/stores` responde 400 sin parámetros; hay que capturar la llamada que hace el buscador de dirección o recorrer los identificadores.

## 6. Propuesta de demo

Mensaje central: **"Lo que les gusta de Melt, sin sus problemas, y administrado por su propio equipo de marketing."**

1. **Portada editable (Page Designer).** Recrear el estilo Melt con datos de Papa John's: hero con texto y precio tachado, bloque "Empieza tu pedido", carrusel de promos. Cambiar en vivo la promo de Halloween sin desarrollador.
2. **Promociones (motor de promociones).** Combos, 40% con tarjeta Banco Falabella los martes, cupón, promo solo retiro, con vigencia y calendario. Mostrar precio antes/ahora automático.
3. **Página de producto con URL** y configurador: tamaño, masa, ingredientes y mitades. Resuelve el punto 1 y 2 de las limitaciones.
4. **Carrito y checkout rápido:** mejora sugerida, acompañamientos recomendados, invitado, una página. Mostrar los tiempos propios de la demo, sin compararlos con Melt.
5. **Tienda y modalidad sin perder el carrito** (delivery o retiro, precios e inventario por tienda).
6. **Capa de cliente** (si entra en el alcance): Papa Puntos visible en todo el recorrido, reorden en un clic, campaña de carrito abandonado, agente de servicio para "¿dónde está mi pedido?".
7. **Móvil primero:** barra inferior tipo app, un solo sitio responsivo.

Carga de datos: catálogo, precios, combos, ingredientes e imágenes desde la API; 3 a 5 tiendas de Santiago.

## 7. Decisiones abiertas

- **Alcance de la demo:** solo Commerce Cloud, o Commerce más Data Cloud, Marketing, Loyalty y Agentforce.
- **Storefront:** SFRA o Composable (PWA Kit). Composable calza mejor con el argumento de velocidad y con su equipo React actual **[I]**.
- **Qué les gusta de Melt:** validar con el cliente las hipótesis de la sección 1 antes de construir.
- **Sistemas que se quedan:** POS, despacho y Synerise; definir si la propuesta los integra o los reemplaza.
- **Uso de los datos:** confirmar con el cliente el permiso para usar su catálogo e imágenes en la demo.
