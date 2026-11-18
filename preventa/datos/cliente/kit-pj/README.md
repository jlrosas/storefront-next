# Papa Johns · Ecommerce Experience Kit 2026 (transcripción)

- **Fuente:** https://cdn.papajohns.cl/kit-pj/index.html (versión `20261007-ux`) y el adjunto «Descargar kit completo» (`assets/kit-pj-25-09-26.zip`).
- **Transcrito:** 17-oct-2026, desde el HTML y los scripts de la página. Incluye lo que solo aparece al abrir ventanas o está en el código (detalle de las 10 etapas del journey, los 20 casos «¿Qué pasa si…?» y el detalle de cada sistema del ecosistema).
- **Copia del original:** `original/` (HTML, CSS y scripts tal como se publicaron) y `adjuntos/` (contenido del zip). No se guardó el video de introducción (`assets/intro video.mp4`).
- **Uso:** el texto del kit va tal cual, sin correcciones ni interpretación. Lo que es nuestro va en [Checklist contra el kit](../../../disenos/checklist-kit.md).

## Índice

| # | Sección del kit | Ancla en la página |
|---|---|---|
| — | [Portada](#portada) | — |
| 00 | [El desafío](#00--el-desafío) | `#desafio` |
| 01 | [Customer journey](#01--customer-journey) | `#flujo` |
| 02 | [Personajes y perfiles](#02--personajes-y-perfiles) | `#perfiles` |
| 03 | [Expectativas de propuesta](#03--expectativas-de-propuesta) | `#expectativas-propuesta` |
| 04 | [Datos maestros y back office](#04--datos-maestros-y-back-office) | `#datos-maestros` |
| 05 | [Ecosistema](#05--ecosistema) | `#ecosistema` |
| 06 | [Flujo digital](#06--flujo-digital) | `#digital-flow` |
| 07 | [Experiencia digital y diseño](#07--experiencia-digital--diseño) | `#diseno` |
| 08 | [FAQ y casos para validar](#08--faq-y-casos-para-validar) | `#casos` |
| 09 | [Indicadores de éxito](#09--indicadores-de-éxito) | `#impacto-negocio` |
| 10 | [La propuesta](#10--la-propuesta) | `#kit` |
| A | [Adjuntos del kit completo](#adjuntos-del-kit-completo) | zip |

---

## Portada

**ECOMMERCE EXPERIENCE KIT · 2026**

# El customer journey en el ecosistema Ecommerce Papa Johns

Desde la creación de una campaña hasta la recompra: una experiencia omnicanal, personalizada y conectada.

Botones: «Explorar el viaje ↓» · «Ver el desafío». Navegación: Desafío · Journey · Perfiles · Expectativas · Back office · Ecosistema · Flujo digital · Diseño · Casos · KPIs.

La página abre con un video de introducción a pantalla completa («Activar sonido», «Omitir introducción»), que se muestra solo la primera vez.

---

## 00 · El desafío

### No queremos un sitio que muestre pizzas. Queremos uno que provoque hambre.

La nueva experiencia de Papa Johns debe lograr que el cliente sienta el producto antes de probarlo, encuentre rápidamente algo relevante para su momento y pueda comprar sin pensar demasiado. Queremos pasar de un ecommerce funcional a una experiencia digital emocional, inteligente y reconocible, donde imágenes, movimiento, contenido, personalización, prueba social y conveniencia trabajen juntos para provocar deseo y convertirlo en una orden.

La referencia no es solamente otra pizzería. Esperamos una experiencia comparable con los mejores ecommerce: producto protagonista, contenido visual rico, información que ayuda a decidir, recomendaciones relevantes, confianza y una interfaz que se adapte al cliente y a su contexto. Target, por ejemplo, incorpora ratings, highlights, disponibilidad, alternativas de fulfillment, Q&A y recomendaciones directamente alrededor del producto para reducir incertidumbre y facilitar la decisión.

| # | Principio | Texto |
|---|---|---|
| 01 | **Hacer que entre por los ojos** | Fotografía hero, video, zoom, textura, ingredientes, preparación y movimiento. Que la pizza se vea caliente, abundante y recién hecha. La PDP debe generar antojo antes de hablar de precio. |
| 02 | **Que el sitio entienda el momento** | No todos entran por lo mismo. La experiencia debe adaptarse al Heavy, Switcher y Non Buyer, pero también a la ocasión: almuerzo, partido, celebración, familia, bajón o recompra. Banner, módulos, menú y recomendaciones deben cambiar con intención. |
| 03 | **Hacer tremendamente fácil decidir** | “Para 2”, “para 4”, “más pedido”, “tu favorito”, “mejor combinación”, precio final claro, personalización simple y disponibilidad real. Menos esfuerzo mental, menos dudas y menos pasos hasta el carrito. |
| 04 | **Crear una experiencia que se recuerde** | Reviews, señales de popularidad, contenido editorial, recomendaciones inteligentes, cross-selling atractivo, microinteracciones, loyalty, recompra y postventa. No buscamos solo conversión: buscamos que el cliente recuerde la experiencia Papa Johns y quiera volver. |

> **No queremos que nos demuestren que pueden construir una PDP.** Queremos que nos muestren cómo transformarían una pizza en deseo, el deseo en una decisión y esa decisión en una relación recurrente con Papa Johns. La POC debe sorprendernos. Debe demostrar una experiencia visual, emocional, personalizada, rápida y comercialmente inteligente, con estándar de ecommerce referente, no simplemente una evolución de lo que tenemos hoy.

---

## 01 · Customer journey

### El viaje de nuestros clientes

Filtros: Todo · Cliente · Operación. Cada tarjeta abre una ventana «Customer journey · detalle» con el relato y «Qué esperamos».

| # | Etapa | Tipo | Etiqueta | Relato | Qué esperamos |
|---|---|---|---|---|---|
| 1 | Preparación de campaña | Operación | Back Office | Antes de que los clientes lleguen, los equipos preparan la campaña: Comercial define productos, Arma tu Combo, precios, cupones, canales y reglas; Marketing publica la landing y prepara su descubrimiento orgánico. | Mostrar cómo los equipos autorizados crean, actualizan y activan una campaña, y cómo se reflejan sus reglas en los canales de venta. |
| 2 | Entradas al ecosistema | Cliente | Descubrimiento | Cada fuente trae una intención distinta: debemos conservar el contexto de entrada y adaptar la experiencia desde el primer momento. *(Detalle abajo.)* | La nueva plataforma debe capturar y conservar el contexto de entrada end-to-end: fuente, campaña, anuncio, contenido, deep link, dispositivo, cliente identificado y canal de destino, incluso cuando el journey continúe entre Web y App. No queremos únicamente atribuir de dónde viene el cliente. Queremos que el ecommerce utilice esa señal para decidir qué mostrar, en qué orden y con qué mensaje, conservando la intención que originó la visita hasta la compra. |
| 3 | Reconocimiento | Cliente | Personalización | Al comenzar, la experiencia reconoce —cuando los datos disponibles lo permiten— si el cliente ya compra con Papa Johns o si está explorando por primera vez. Heavy user, Switcher y Non Buyer orientan la personalización, pero no son segmentos rígidos; Sofía es nuestra heavy user. | Explicar qué datos y qué CRM o plataforma de personalización se usarían, cómo se obtiene el consentimiento y cómo la experiencia sigue funcionando si no es posible reconocer al cliente. |
| 4 | Selección de entrega | Cliente | Contexto de compra | El cliente decide cómo disfrutar su pedido: Delivery, Pick Up o comer en el comedor, según disponibilidad. La tienda, la cobertura, los horarios, la disponibilidad, el costo, el espacio y el tiempo estimado dependen de esa elección. | Demostrar la validación de dirección, tienda y capacidad del comedor, y que al cambiar de modalidad se actualicen las condiciones del pedido sin borrar lo que el cliente ya avanzó. |
| 5 | Exploración y personalización | Cliente | Catálogo | Con el contexto de compra definido, el cliente explora el catálogo y arma su combo. Puede configurar una pizza por mitades y sumar acompañamientos, bebidas o postres; lo que ve debe corresponder a la disponibilidad y reglas vigentes. | Recorrer el catálogo y la configuración de productos de punta a punta, incluyendo cómo se muestran precios, opciones, restricciones y productos no disponibles. |
| 6 | Carro y beneficios | Cliente | Conversión | Antes de pagar, el cliente revisa los productos, cantidades, precios y totales. Puede ingresar un cupón y usar Papa Puntos si corresponde. Si deja la compra, el carro puede recuperarse para que continúe sin reconstruirlo. | Demostrar la validación de cupones y Papa Puntos, explicar incompatibilidades con claridad y mostrar cómo se conserva o recupera el carro. |
| 7 | Checkout y pago | Cliente | Pago | El cliente confirma sus datos, modalidad, dirección o tienda, horario, pedido y total. Luego selecciona un medio disponible —como Webpay, Mercado Pago, Fintoc, Pluxee o billeteras digitales— y completa el pago, incluido BIN o Gift Card cuando aplique. | Mostrar el recorrido hasta la confirmación. Ante un rechazo o error, explicar cómo se informa al cliente, cómo puede reintentar y cómo se evita perder o duplicar la orden. |
| 8 | Procesamiento y despacho | Operación | Operación | Con el pago aprobado, la orden pasa por Ecommerce y la API Papa Johns hacia los sistemas de operación. La tienda la recibe para prepararla y, si es Delivery, se coordina el despacho; si es Pick Up, se gestiona el retiro. Los cambios de estado alimentan el seguimiento. | Explicar y demostrar el recorrido de la orden entre Ecommerce, API Papa Johns, NCR Cloud Connect, tienda y despacho, incluyendo estados, reintentos y tratamiento de incidencias sin duplicar órdenes. |
| 9 | Postventa y fidelización | Operación | Relación | Durante y después de la entrega o el retiro, el cliente recibe confirmaciones y actualizaciones. La orden cerrada alimenta la acumulación de Papa Puntos; si surge un problema, SAC necesita contexto para brindar ayuda. La experiencia también puede activar NPS y comunicaciones postventa. | Mostrar qué eventos recibe el cliente y qué información queda disponible para SAC, fidelización y medición postventa, incluyendo cómo se gestiona una orden con problemas. |
| 10 | Recompra omnicanal | Cliente | Futuro | En una próxima ocasión, el cliente puede volver desde el canal que prefiera. Si corresponde, encuentra sus pedidos anteriores, favoritos, direcciones y beneficios, y vuelve a comprar con precios, disponibilidad y condiciones actualizados. | Demostrar cómo se facilita repetir una compra y cómo se mantiene la continuidad entre canales, sin asumir que el catálogo, los precios o la disponibilidad son siempre iguales. |

**Detalle de la etapa 2 (Entradas al ecosistema):** Nuestros clientes llegan con distintas intenciones y niveles de conocimiento de la marca. Aproximadamente el 40% del tráfico es directo, 35% proviene de Paid Media, 15% de orgánico y 10% de CRM. Esto significa que la experiencia no puede comenzar igual para todos. Un cliente directo probablemente ya conoce Papa Johns y puede venir con una intención de compra más clara; quien llega desde Paid debe mantener la promesa del anuncio y aterrizar en el producto, promoción u ocasión que originó el clic; el tráfico orgánico necesita continuidad entre su búsqueda y el contenido encontrado; y CRM debería aprovechar identificación, segmento, campaña y comportamiento previo para ofrecer una experiencia más personalizada.

### Para la propuesta: qué esperamos de nuestro partner

Que recorra el journey completo con una demostración concreta y omnicanal: cómo se ve para nuestros clientes en Web, App, agregadores, Call Center, Tótem y WhatsApp; qué ocurre detrás de cada paso y cómo se resuelven los casos que interrumpen el flujo. La propuesta debe distinguir qué está disponible, qué requiere configuración o integración y qué debe desarrollarse, siempre preservando una experiencia consistente entre canales.

- Explicar la arquitectura, los sistemas involucrados, los datos intercambiados y sus dependencias.
- Mostrar cómo se administran catálogo, precios, campañas, promociones y reglas de compra.
- Demostrar continuidad entre canales, Delivery, Pick Up y comedor, incluidos errores, reintentos y atención de SAC.
- Mostrar cómo se conserva identidad, carrito, promociones, disponibilidad y contexto al pasar de un canal a otro.
- Presentar alcance, supuestos, responsabilidades, esfuerzo, inversión y etapas de implementación.

---

## 02 · Personajes y perfiles

### La misma marca, experiencias diferentes

**La pregunta para el oferente:** ¿Puede entender quién es el cliente, qué está intentando resolver hoy y cambiar de forma visible la experiencia para hacerlo sentir reconocido, relevante y acompañado? Una misma marca. Una misma plataforma. Experiencias diferentes porque las personas llegan con necesidades diferentes. Sofía, Diego y Valentina son personajes de referencia para que la POC demuestre cómo se adapta la experiencia sin fragmentar la operación. Selecciona un perfil para ver su journey y cambia entre perfiles desde las pestañas superiores.

### 👩🏻 Heavy user · Sofía — «Sofía ya nos conoce»

Facilitar la recompra, mostrar favoritos, utilizar sus direcciones y activar sus beneficios.

- **Su realidad:** Sofía compra frecuentemente. Ya conoce el menú, probablemente sabe qué pizza quiere, tiene una dirección habitual, una tienda preferida, pedidos anteriores y relación con Papa Puntos. Su problema no es descubrir Papa Johns: su problema es perder tiempo. Cada pantalla genérica, promoción irrelevante o dato que debe ingresar de nuevo es una señal de que la marca no está aprovechando lo que ya sabe de ella.
- **Su dolor:** “Compro siempre acá. ¿Por qué tengo que empezar de cero cada vez?”
- **Lo que necesita:** Reconocimiento, velocidad y relevancia. No necesita que Papa Johns la convenza de comprar; necesita que la marca le demuestre: “Te conozco. Sé lo que te gusta. Hagámoslo fácil.”

**Customer journey esperado**

| # | Paso | Texto |
|---|---|---|
| 01 | Entrada | Si entra desde App, Web, CRM o una campaña, identificarla y conservar el contexto. La experiencia debería partir con “Hola Sofía” y no como si fuera una visitante desconocida. |
| 02 | Home / Landing | Priorizar, en este orden: Repetir último pedido → Favoritos → Papa Puntos → Beneficios → Recomendaciones personales. No queremos que la primera pantalla esté dominada por un 50% de descuento genérico: para ella, el valor está más en conveniencia y reconocimiento que en precio. |
| 03 | Exploración | Ordenar productos según historial, afinidad, horario, modalidad y probabilidad de compra. Las promociones deben existir, pero quedar en segundo plano. |
| 04 | Carrito / Checkout | Tener disponibles dirección habitual, tienda, preferencias y datos utilizados previamente. Mostrar Papa Puntos, beneficios aplicables, cross-selling relevante y medio de pago preferido cuando corresponda. |
| 05 | Post compra | Actualizar automáticamente historial → preferencias → puntos → frecuencia → próxima mejor acción, y facilitar una próxima recompra todavía más rápida. |

**Experiencia que esperamos:** “Papa Johns me conoce. No me hace perder tiempo y siempre parece saber qué quiero.”

Banner: loyalty / beneficios / novedad relevante · Home: repetir pedido, favoritos, puntos y saldo · Menú: productos afines primero · Promos: menos agresivas · PDP: producto protagonista · CTA: recompra y conveniencia

### 🧑🏻 Switcher · Diego — «Diego está scrolleando y decidiendo»

Una experiencia rápida, visual y relevante, con ofertas, recomendaciones y beneficios que le den una razón para elegirnos ahora.

- **Perfil:** Diego conoce Papa Johns, pero también considera otras marcas, agregadores y alternativas. No tiene una relación consolidada con nosotros: está haciendo scroll, comparando y decidiendo. Tenemos pocos segundos para ser relevantes.
- **Su dolor y lo que necesita:** “Tengo muchas opciones. ¿Por qué debería pedir Papa Johns?” Necesita relevancia inmediata, conveniencia y valor percibido. La plataforma debe ayudarlo a decidir, no simplemente mostrarle un catálogo.

**Customer journey esperado**

| # | Paso | Texto |
|---|---|---|
| 01 | Entrada | Mantener la promesa si viene de Meta, Google, CRM, Deep Link o campaña. Si hizo clic en “2 pizzas por $X”, no debe caer en un Home genérico. |
| 02 | Home / Landing | Presentar ocasiones y tamaño de grupo: Para 2 → Para 3 → Para 4 → Almuerzo → Partido → Celebración → Bajón. La experiencia debe contestar “¿Qué necesitas resolver ahora?” más que “¿Qué producto quieres?”. |
| 03 | Exploración | Mostrar promociones arriba; después, Más vendidos, Recomendados para ti, buena relación precio/cantidad y productos según afinidad o historial. No obligarlo a recorrer todo el menú. |
| 04 | Carrito / Checkout | Convertir antojo en decisión con producto visualmente irresistible, precio, beneficio, confianza y personalización simple. En el carrito: “Por $1.500 más agrega bebida”, “Te faltan $X para…” o “Completa tu combo”, sin bombardearlo con descuentos sin lógica. |
| 05 | Post compra | Empezar a fidelizarlo mediante CRM → Papa Puntos → recompra → beneficios → frecuencia. Una compra no significa que Diego dejó de ser Switcher: el objetivo es moverlo hacia Heavy. |

**Experiencia que esperamos:** “Papa Johns entendió exactamente lo que necesitaba y me hizo fácil decidir.”

Banner: promoción relevante y potente · Home: ocasiones y tamaño de grupo · Menú: promos arriba · Promos: más agresivas · PDP: precio + producto + conveniencia · CTA: esto te conviene ahora. *No se trata de mostrar más promociones, sino de seleccionar cuál mostrar según contexto, propensión y comportamiento.*

### 👩🏽 Non buyer · Valentina — «Valentina necesita volver a confiar»

Entender qué falló, mostrar mejoras y hacer que regresar a Papa Johns sea fácil y valga la pena.

- **Perfil:** Si Valentina lleva dos años sin comprar, no la llamaría Non Buyer: la llamaría LAPSED / DORMIDA. Tuvo relación con Papa Johns, pero dejó de comprar. Quizás tuvo una mala experiencia, encontró otra alternativa, percibe poco valor o la marca dejó de ser relevante. La peor estrategia sería tratarla como si nada hubiera pasado.
- **Su dolor y lo que necesita:** “¿Por qué debería volver si antes dejé de elegirlos?” Necesita confianza, claridad y bajo riesgo para volver. Debemos mostrar: “Papa Johns hoy es fácil, atractivo y vale la pena volver a probar.” Sin inventar cuál fue su problema, podemos demostrar que la experiencia actual es mejor.

**Customer journey esperado**

| # | Paso | Texto |
|---|---|---|
| 01 | Entrada | Recuperar la promesa si vuelve por campaña, CRM o búsqueda, con una comunicación como “Queremos que vuelvas a disfrutar Papa Johns”, sin caer en mensajes invasivos. |
| 02 | Home / Landing | Demostrar valor con promociones, best sellers, novedades, beneficios del canal propio, Delivery / Pick Up y ventajas actuales. Aquí sí puede utilizarse una promoción más agresiva como estímulo de reactivación. |
| 03 | Exploración | Reducir incertidumbre: tamaño → cantidad → ingredientes → precio → para cuántas personas → beneficio. Usar “Más pedido”, “Favorito”, “Recomendado”, “Ideal para 2” y “Novedad”. |
| 04 | Selección de entrega | Ofrecer Delivery, Pick Up o comer en el comedor según disponibilidad, explicando con anticipación costos, tiempos, ubicación y condiciones. La elección debe ser clara y no borrar el contexto del pedido. |
| 05 | Carrito / Checkout | Evitar barreras: permitir comprar como invitada, explicar costos y tiempos con anticipación, evitar sorpresas al final y solicitar solo los datos indispensables. |
| 06 | Post compra | Cumplir la promesa: entregar correctamente, comunicar estado, resolver rápido cualquier incidencia, recoger feedback y activar loyalty y recompra. Este punto es incluso más importante para Valentina que para Sofía. |

**Experiencia que esperamos:** “Volver fue mucho mejor de lo que recordaba. Fue fácil, claro y valió la pena.”

Banner: propuesta potente de reactivación · Home: promoción + best sellers + razones para volver · Menú: simple y guiado · Promos: agresivas pero fáciles de comprender · PDP: precio + conveniencia + confianza + producto · Checkout: máxima transparencia. *Una experiencia de descubrimiento, confianza y conversión; no una home excesivamente personalizada.*

### El nuevo mindset Papa Johns: de segmentar clientes a diseñar experiencias relevantes

No queremos simplemente colocar a Sofía, Diego y Valentina en tres audiencias dentro de Papa Johns. Queremos que el ecommerce se comporte distinto porque entiende que sus necesidades son distintas.

Eso debe sentirse en lo que ven, el orden en que lo ven, lo que no necesitan ver, cómo les hablamos, qué producto recomendamos, qué beneficio mostramos y cuántos pasos necesitan para comprar.

De: “Aquí está nuestro menú. Elige.” A: “Entiendo qué necesitas. Déjame ayudarte a resolverlo.”

> **El cliente no debe adaptarse a nuestro ecommerce. Nuestro ecommerce debe adaptarse al cliente.**

---

## 03 · Expectativas de propuesta

### Qué esperamos de nuestros partners

Una propuesta que conecte marketing, venta, administración y tecnología con nuestro customer journey real. Cada capacidad debe distinguirse como estándar, configuración, integración, desarrollo o roadmap, y demostrarse con evidencia y métricas.

| # | Área | Título | Qué piden | Esperamos |
|---|---|---|---|---|
| 01 | Marketing digital | Atraer tráfico que convierta | Explicar cómo la inversión digital conduce desde el anuncio hasta una orden pagada, sin perder el origen ni la intención de compra.<br>• SEO, Google Ads, redes sociales, email, push, WhatsApp, QR, landing pages, deep links y continuidad entre Web y App.<br>• Plan de atribución por fuente: impresiones, sesiones, CTR, landing view, add to cart, checkout, compra, CAC, ROAS y recompra.<br>• Segmentación por campaña, dispositivo, geografía, perfil, canal y modalidad: Delivery, Pick Up o comedor.<br>• Línea base, fórmula, fuente, período y meta para cada indicador. | Plan de medición y atribución |
| 02 | Gestión comercial | Convertir la propuesta en venta | Demostrar que Comercial puede gestionar catálogo y promociones con reglas claras para canal, tienda y modalidad de compra.<br>• Administrar “Arma tu Combo”, productos, variantes, precios, cupones, BIN, Gift Cards y Papa Puntos.<br>• Aplicar disponibilidad y reglas comerciales sin mostrar ofertas que no se puedan cumplir.<br>• Medir ventas, órdenes pagadas, ticket promedio y aporte de promociones y recomendaciones. | Caso comercial configurable y medible |
| 03 | Administración y operación | Dar autonomía con control | Mostrar cómo los equipos de Marketing, Comercial y Operaciones mantienen la experiencia al día desde las herramientas de administración.<br>• Roles y permisos para contenidos, campañas, catálogo, precios y reglas.<br>• Previsualización, aprobación, programación, historial de cambios y reversa.<br>• Responsables, dependencias y reportes para operar sin cambios de código en tareas habituales. | Demo del CMS y Backoffice |
| 04 | Customer journey y FAQ | Resolver el viaje completo | Recorrer desde la campaña y la elección Delivery / Pick Up hasta el pago, la entrega, SAC y la recompra, con una experiencia coherente para Heavy User, Switcher y Non Buyer.<br>• Demostrar continuidad de datos, carro y contexto entre etapas y canales.<br>• Resolver FAQs reales de Papa Puntos: elegibilidad (cuenta y compra online pagada), tiempos de acreditación, vigencia, canje y mínimos por modalidad, compatibilidad con promociones y devolución de puntos según el motivo de cancelación.<br>• Responder según las reglas vigentes y dar paso a SAC cuando la consulta o excepción lo requiera. | Escenarios reales, no solo pantallas |
| 05 | Proceso técnico | Integrar con confiabilidad | Presentar arquitectura, datos y responsabilidades de cada integración, diferenciando lo que ya está implementado de lo que requiere validación o desarrollo.<br>• Explicar el flujo de checkout y envío de la orden al backend, y la frontera posterior hacia Aloha / OMS.<br>• Mapear fuentes de verdad, APIs, estados, seguridad, reintentos, idempotencia, monitoreo y soporte.<br>• Considerar pagos, NCR Cloud Connect, tienda, DispatchTrack, Synerise y Zendesk. | Arquitectura, secuencias y plan de integración |
| 06 | Operación en tiempo real | Un live dashboard para decidir antes de que duela | Necesitamos una visión clara del negocio en vivo, no solo reportes posteriores. El partner debe demostrar cómo prioriza la información, detecta desvíos y adapta la vista según el perfil de cada administrador.<br>• Ventas y conversión: GMV, órdenes, ticket, CVR, funnel y mix por canal.<br>• Operación y experiencia: SLA, ETA, capacidad, quiebres, NPS, cancelaciones e incidencias.<br>• Adquisición: fuentes de tráfico, CAC, ROAS, campañas y recompra.<br>• Roles y permisos para dirección, negocio, marketing, operaciones, SAC y TI. | Dashboard live, alertas, umbrales y vistas por perfil |

### Prueba de concepto: de la propuesta a una demo verificable

No buscamos una presentación genérica: queremos recorrer un caso, cambiar condiciones, observar la operación y revisar cómo se medirá el resultado.

1. Configurar una campaña y sus reglas comerciales.
2. Seguir una visita hasta el checkout y la orden.
3. Probar excepciones, recuperación y respuesta de SAC.
4. Presentar KPIs, alcance, fases, costos y dependencias.
5. Entregar propuesta económica: implementación, licencias, operación, soporte, evolutivos y costos variables.

En cada capacidad, indicar disponibilidad (estándar, configuración, integración, desarrollo o roadmap), responsable, esfuerzo, supuestos y cómo se probará. Desglosar licencias, implementación, integraciones, operación, soporte, evolutivos y costos variables, además de fases, plazos, SLA, dependencias y exclusiones. Incluir inversión inicial, costo recurrente, supuestos de volumen, impuestos, moneda, vigencia de la oferta y condiciones de pago. Para la integración backend → Aloha / OMS, el proceso técnico del frontend marca una frontera que debe confirmarse con los equipos y el partner.

---

## 04 · Datos maestros y back office

### Lo que pasa detrás de cada orden

El nuevo Back Office debe simplificar la operación y dar autonomía a los equipos. No buscamos replicar la herramienta actual: buscamos cubrir estas capacidades críticas con reglas claras, trazabilidad y una sola fuente comercial para todo el ecosistema.

**Una fuente de verdad comercial:** Catálogo → reglas → tiendas → canales → operación

**Back Office comercial: lo que se vende y bajo qué reglas**

| # | Capacidad | Texto | Etiquetas |
|---|---|---|---|
| 01 | Productos y catálogo | Crear, editar, ordenar y relacionar pizzas, ingredientes, combos, variantes, mitades y promociones con sus identificadores Aloha. | Catálogo · Aloha · Recetas |
| 02 | Menú, precios y disponibilidad | Definir oferta por tienda, canal y modalidad; aplicar cambios masivos, bloquear quiebres y mantener consistencia con POS y agregadores. | Precio · Stock · Canal |
| 03 | Promociones y reglas | Configurar combos, bundles, descuentos, regalos, vigencias, horarios, tiendas, personalización y restricciones sin depender de desarrollo. | Bundles · Vigencia · Condiciones |
| 04 | Cupones, Gift Cards y Loyalty | Administrar códigos, cargas masivas, valores, campañas y recompensas Papa Puntos, con validación de saldo y disponibilidad. | Cupones · Gift Cards · Papa Puntos |

**Tiendas, canales y operación: cómo se publica, se vende y se cumple**

| # | Capacidad | Texto | Etiquetas |
|---|---|---|---|
| 05 | Configuración de tiendas | Crear locales con dirección, coordenadas, horarios, menú, modalidad, cobertura, medios de pago, integraciones y estado operativo. | Mapa · Horarios · Activación |
| 06 | Canales y omnicanalidad | Administrar desde una misma lógica la oferta que consumen Web, App, agregadores, Call Center, Tótem y WhatsApp. | Web · App · Agregadores · WhatsApp |
| 07 | Pagos e integraciones | Asociar medios e identificadores por tienda y operar integraciones con Aloha/POS, Synerise, pagos, despacho, analytics y órdenes. | APIs · Estados · Reintentos |
| 08 | Pedidos y última milla | Consultar Delivery, Pick Up y pedidos futuros; filtrar por tienda y canal, seguir estados y gestionar incidencias de despacho. | Order management · ETA · Tracking |
| 09 | Roles y trazabilidad | Permisos por equipo, auditoría de cambios, usuario, fecha, historial y rollback para configuraciones comerciales críticas. | Permisos · Auditoría · Rollback |
| 10 | Reportería y experiencia | Indicadores por tienda, canal, producto y promoción, conectados con NPS y SAC para conservar el contexto de cada caso. | Dashboards · NPS · SAC |

> **Qué debe demostrar el partner:** una modificación comercial → su aprobación → publicación por canal → impacto en una orden → trazabilidad para Operaciones y SAC.

---

## 05 · Ecosistema

### Una orden, múltiples sistemas

La experiencia de cliente debe mantenerse conectada desde el primer clic hasta la última milla. Selecciona una caja para abrir su detalle en primer plano.

| Grupo | Sistema | Detalle (texto de la ventana) |
|---|---|---|
| Canales | Web Papa Johns | Canal digital propio donde el cliente descubre productos, configura su pedido, aplica beneficios y completa la compra. |
| Canales | App Papa Johns | Canal móvil propio. Debe mantener el contexto del cliente y su orden durante la selección, el pago y el seguimiento. |
| Canales | Agregadores | Canales externos de venta que originan órdenes y requieren coordinación de catálogo, disponibilidad, pago y estados con la operación. |
| Canales | Call Center | Canal asistido para crear o apoyar pedidos; necesita consultar la información de la orden para orientar al cliente y a SAC. |
| Canales | WhatsApp | Canal de conversación y atención que puede apoyar descubrimiento, consultas, seguimiento y derivación a SAC, manteniendo el contexto del cliente. |
| Ecommerce | Ecommerce · Core, Users y Orders (Middleware · Tiempos dinámicos · ETA) | Concentra la experiencia de compra y la información de usuarios y órdenes. Coordina middleware, disponibilidad y tiempos estimados (ETA) entre canales y sistemas. |
| Pagos | Webpay | Pasarela de pago. Devuelve el resultado de la transacción para que la compra continúe o informe al cliente si debe reintentar. |
| Pagos | Mercado Pago | Alternativa de pago integrada al checkout. La respuesta debe asociarse a la orden correcta y evitar cobros u órdenes duplicadas. |
| Pagos | Fintoc | Opción de pago disponible en el checkout. El resultado de la autorización debe quedar trazable en el flujo de la orden. |
| Pagos | Tarjetas alimentarias | Medios de pago de alimentación que pueden estar disponibles según las condiciones de compra. El checkout debe reflejar su resultado en el total y estado de la orden. |
| Pagos | Billeteras digitales (GPay y Apple Pay) | Medios de pago digitales como GPay y Apple Pay. El checkout debe reflejar su autorización, asociarla a la orden correcta y evitar cobros duplicados. |
| Orden y operación | API Papa Johns (Pago · Orden · Despacho · Estados) | Capa de integración que coordina el resultado del pago con la creación y el envío de la orden operacional, además de sus estados y datos de despacho. |
| Orden y operación | API NCR Cloud Connect | Orquestador de órdenes hacia tienda. Recibe la orden operacional, la deriva al entorno de tienda y comunica eventos de proceso. |
| Orden y operación | Aloha / OMS | Usamos Aloha como sistema de gestión de órdenes en la operación. La integración debe llevar la orden a tienda y permitir manejar respuestas, estados y excepciones. |
| Orden y operación | API DispatchTrack | DispatchTrack · seguimiento del despacho. Integra los eventos del despacho para actualizar el estado de la orden y ofrecer una experiencia de seguimiento en vivo, desde la salida de tienda hasta la entrega. |
| Relación | CRM · Synerise | Actualmente usamos Synerise como CRM. Apoya la gestión de datos y comunicaciones de cliente, fidelización y personalización; la integración debe considerar consentimiento, eventos y beneficios como Papa Puntos. |
| Relación | API Zendesk | Zendesk · SAC. Plataforma de atención al cliente. El equipo de SAC necesita consultar contexto de la orden y sus eventos para dar seguimiento a consultas e incidencias. |
| Tienda | Tienda Tótem | Punto de operación en tienda que participa en la recepción o gestión de pedidos. Su rol específico depende de la configuración de cada local. |
| Tienda | NCR POS | Punto de venta de NCR en tienda, vinculado al flujo operacional y a la gestión de las órdenes recibidas. |
| Tienda | KDS | Kitchen Display System: presenta el trabajo de preparación al equipo de cocina y origina eventos que ayudan a actualizar el estado de la orden. |
| Tienda | Servidor tienda | Componente local que participa en la comunicación entre los sistemas de tienda y la plataforma de órdenes. |
| Despacho | Quick Commerce | Capa que coordina opciones de despacho y la asignación de flota para pedidos con entrega a domicilio. |
| Despacho | Flota propia | Repartidores gestionados por Papa Johns. Los eventos de asignación y entrega deben reflejarse en el seguimiento de la orden. |
| Despacho | Flota externa | Operadores externos que pueden apoyar la última milla. La integración debe comunicar asignación, avance y resultado del despacho. |
| Gestión | Backoffice | Herramientas internas para que los equipos gestionen y supervisen la operación, con visibilidad de pedidos e incidencias. |

Al abrir DispatchTrack, la ventana muestra una vista previa del seguimiento: **«Pedido en camino · ETA 18 min» · «Tu pedido: En reparto» · «Última actualización: Hace 1 min»**.

---

## 06 · Flujo digital

### El flujo digital de una orden

Desde que el cliente inicia su compra hasta la entrega y la postventa, la orden cruza canales, pagos, Ecommerce, sistemas de tienda, despacho y fidelización. Cada etapa explica qué información recibe, qué gestiona y qué entrega al siguiente sistema.

| # | Etapa | Texto | Acción |
|---|---|---|---|
| 01 | Cliente y canales | El cliente inicia su pedido desde Web Papa Johns, App, agregadores o Call Center. El canal recoge los productos, datos de compra y modalidad de entrega o retiro. | inicia la orden |
| 02 | Ecommerce | Core, Users, Orders y Middleware reúnen el contexto de compra, validan disponibilidad y preparan la orden. También calculan tiempos dinámicos y ETA para el canal. | prepara compra y tiempos |
| 03 | Pasarelas de pago | Webpay, Mercado Pago, Fintoc, Pluxee o las billeteras digitales procesan el medio seleccionado. La respuesta de autorización o rechazo vuelve al flujo antes de confirmar la orden. | autoriza el pago |
| 04 | API Papa Johns | Con el resultado del pago, coordina la creación de la orden operacional y su despacho. Mantiene disponibles los identificadores y estados para las integraciones posteriores. | crea y coordina la orden |
| 05 | NCR Cloud Connect | Orquesta el envío de la orden hacia la tienda y recibe eventos de avance. En la operación, la orden se gestiona con Aloha / OMS. | deriva orden a tienda |
| 06 | Tienda física | Aloha / OMS, NCR POS, KDS y los sistemas locales participan en la recepción y preparación. El equipo de tienda avanza el pedido según su proceso operativo. | prepara el pedido |
| 07 | Eventos de tienda | Los cambios de preparación se originan en tienda —por ejemplo, desde el KDS— y se comunican a NCR Cloud Connect para actualizar el estado de la orden. | informa avances |
| 08 | DispatchTrack | La integración recibe y sincroniza eventos del despacho. Permite ofrecer seguimiento en vivo mediante el enlace asociado a cada orden. | actualiza tracking |
| 09 | Quick Commerce | Coordina la asignación del pedido para la última milla, con flota propia o externa, y comunica el avance del despacho. | asigna flota |
| 10 | Entrega al cliente | El repartidor lleva la orden a la dirección indicada. El resultado de la entrega se registra para cerrar el despacho y notificar al cliente. | completa la entrega |
| 11 | Postventa y seguimiento | Los eventos de la orden y del despacho vuelven a la experiencia digital. Permiten informar al cliente y entregar contexto a SAC ante consultas o incidencias. | actualiza al cliente y SAC |
| 12 | CRM y fidelización | Synerise, nuestro CRM, se integra con los eventos definidos para personalización y fidelización. La información de compra permite gestionar beneficios y Papa Puntos. | continúa la relación |

**Sistemas conectados:** Synerise para CRM · API y Zendesk para SAC · Backoffice para gestión · Peya Envíos, Uber Direct y Rappi como alternativas de despacho. El flujo debe hacer explícitos los datos intercambiados, responsables y tratamiento de errores en cada integración.

---

## 07 · Experiencia digital & diseño

### Crear un ecommerce que provoque hambre y se recuerde

No buscamos replicar el sitio actual ni una experiencia estándar de QSR. Esperamos una visión digital world class, emocional, visualmente potente, simple y reconocible, capaz de convertir el producto en deseo y el deseo en compra.

| Criterio | Texto |
|---|---|
| Food first | Fotografía, video, zoom, textura, ingredientes y movimiento que hagan que la pizza “entre por los ojos”. |
| Jerarquía inteligente | Menos ruido, mensajes claros, navegación simple y foco permanente en la siguiente mejor acción. |
| Personalización visible | Banners, módulos, menú, promociones y tarjetas de producto adaptadas a Heavy, Switcher y Non Buyer. |
| PDP enriquecida | Producto protagonista, personalización simple, información clara, señales de popularidad, recomendaciones, reviews y contenido que ayude a decidir. |
| Diseño por ocasión | Experiencias para almuerzo, familia, partido, celebración, bajón, recompra u otros momentos relevantes. |
| Microinteracciones con intención | Movimiento, feedback, transiciones y detalles que hagan la experiencia más premium sin afectar velocidad. |
| Mobile first, rápido y accesible | Una experiencia impecable en App y Web, con performance como parte del diseño. |

**Esperamos:** propuesta visual y prototipo navegable que nos haga decir “esto se siente como el nuevo Papa Johns”, no simplemente un rediseño de ecommerce.

> No queremos un sitio que muestre pizzas. Queremos una experiencia que provoque hambre, entienda al cliente y haga memorable comprar Papa Johns.

---

## 08 · FAQ y casos para validar

### ¿Qué pasa si…?

Selecciona un evento y revisa qué debe ser capaz de resolver el partner. Casos para probar: 20 escenarios. Cada uno se presenta como «Evento de demostración».

| # | Evento | Qué debe resolver | Etiquetas |
|---|---|---|---|
| 1 | Tienda cerrada / fuera de horario | El cliente quiere comprar, pero la tienda asignada ya cerró o no está disponible. Se debe informar el motivo y ofrecer otra tienda cercana, pedido futuro o cambio a Pick Up. | Horario · Tienda · Alternativa |
| 2 | Promoción no disponible en la tienda | El cliente llega desde una campaña o deep link, pero la promoción no aplica en su tienda, canal o modalidad. Se debe explicar la restricción y ofrecer una alternativa válida. | Promociones · Deep link · Transparencia |
| 3 | Monto mínimo no cumplido para Delivery | El carrito no alcanza el mínimo exigido para despacho. La experiencia debe mostrar el faltante exacto, sugerir productos para completarlo o permitir cambiar a Pick Up. | Delivery · Carro · Conversión |
| 4 | Carrito expirado o con cambios | El cliente vuelve a un carrito guardado y la promoción, el precio o la disponibilidad cambiaron. Se debe revalidar, mostrar las diferencias y permitir continuar. | Carrito · Precios · Recuperación |
| 5 | Cambio de Delivery a Pick Up | Al cambiar la modalidad, algunos precios, tiempos, productos o beneficios dejan de aplicar. El sistema debe recalcular e informar los cambios conservando el carrito. | Omnicanal · Recalculo · Tienda |
| 6 | Ingrediente no disponible en la tienda | No está agotado el producto completo, pero sí un ingrediente, borde, masa o complemento. Se debe bloquear solo la configuración afectada y ofrecer sustitutos válidos. | Disponibilidad · Catálogo · Sustitución |
| 7 | Error en la personalización de la pizza | El cliente intenta una configuración inválida: mitades incompatibles, ingrediente no permitido o borde no disponible. Las reglas deben validarse en tiempo real y guiarlo. | Personalización · Reglas · Usabilidad |
| 8 | Papa Puntos no disponibles | El cliente intenta usar puntos, pero no tiene saldo suficiente, el producto no participa o no hay stock para canje. Se debe explicar la causa y mostrar opciones sin romper el checkout. | Loyalty · Papa Puntos · Checkout |
| 9 | Cupón vencido, usado o inválido | El cupón existe, pero expiró, ya fue redimido o no cumple las reglas. El mensaje debe identificar la causa y sugerir otra alternativa si existe. | Cupones · Reglas · Recuperación |
| 10 | Pago aprobado, orden no confirmada | El pago fue aprobado, pero una caída o timeout impidió crear la orden. Se necesita conciliación, validación del estado y recuperación automática o asistida. | Pagos · Conciliación · Confianza |
| 11 | Doble click / pedido duplicado | Por lentitud o confusión, el cliente reintenta y genera dos pedidos. La plataforma debe prevenir duplicados con idempotencia y manejar la contingencia. | Idempotencia · Peak · Órdenes |
| 12 | Medio de pago no disponible | Un medio aplica solo a Web, Delivery, ciertas tiendas o modalidades. El checkout debe filtrar correctamente la disponibilidad y evitar un rechazo tardío. | Pagos · BIN · Contexto |
| 13 | Fallo en login | El cliente no puede identificarse durante el journey. Se debe permitir continuar como invitado, conservar el carrito y facilitar la recuperación posterior. | Identidad · Carrito · Conversión |
| 14 | Deep link roto o promo mal direccionada | El cliente llega desde un anuncio, email o push a una página incorrecta o sin la promoción esperada. Se debe ofrecer un fallback manteniendo la trazabilidad. | Marketing · Deep link · Atribución |
| 15 | Tiempo prometido cambia durante la compra | La promesa de entrega se alarga por congestión. El sistema debe recalcular el tiempo en tiempo real y transparentar el cambio antes del pago. | Dynamic times · Delivery · Transparencia |
| 16 | Delivery saturado / sin repartidores | Existe cobertura, pero la tienda no puede despachar por saturación o falta de capacidad. Se debe ofrecer Pick Up, otra tienda o pedido futuro. | Capacidad · Última milla · Alternativa |
| 17 | Quiebre parcial del checkout | Falla una parte del flujo, como despacho, BIN, loyalty o una promoción. Se necesita degradación controlada y continuidad del resto cuando sea posible. | Resiliencia · Checkout · Degradación |
| 18 | Dirección ambigua o geolocalización incorrecta | El sistema no ubica bien la dirección o asigna una tienda incorrecta. Debe permitir corrección manual, sugerir direcciones y validar la asignación de forma transparente. | Geolocalización · Cobertura · Direcciones |
| 19 | Pedido futuro no disponible | El cliente quiere agendar, pero la tienda, canal o producto no permite una orden futura. Se debe informar la restricción y ofrecer una franja válida o compra inmediata. | Agendamiento · Horario · Alternativa |
| 20 | Servicio caído en peak / contingencia comercial | Una alta demanda, Cyber o Día de la Pizza provoca lentitud o una caída parcial. La demo debe mostrar colas, reintentos, throttling, mensajes de contingencia y continuidad mínima. | Peak · Continuidad · Observabilidad |

---

## 09 · Indicadores de éxito

### Cómo mediremos el éxito del partner

Estos son los resultados que deben orientar la propuesta, la implementación y la operación. Los cinco indicadores críticos concentran la expectativa de éxito; el resto permite diagnosticar y gestionar cada etapa del negocio.

**KPI críticos de éxito (pulso de la operación).** La propuesta debe explicar cómo alcanzar, monitorear y mejorar estos umbrales.

| KPI | Meta | Definición |
|---|---|---|
| CVR total | 25% | Conversión total App + Web |
| Bounce rate | < 30% | Sesiones que no avanzan |
| Pago aprobado | > 97% | Órdenes con pago exitoso |
| Uptime | > 99,9% | Disponibilidad objetivo de plataforma |
| Cross-selling | 35% | Pedidos con recomendación |

**Indicadores de gestión: el tablero completo, en segundo plano.** Metas para seguimiento por dominio. Cada partner debe indicar fuente, fórmula, periodicidad, responsable y línea base.

| Dominio | Indicador | Meta |
|---|---|---|
| 01 · Negocio y crecimiento | Ventas digitales YoY | +10% |
| | Participación digital | +1 pp |
| | Ticket promedio | +5% |
| | Órdenes por canal | +8% |
| | Mix Pick Up | 50% |
| | Margen / contribución | +1 pp |
| 02 · Adquisición y engagement | Sesiones App + Web | +15% YoY |
| | Usuarios activos / MAU | +10% |
| | Bounce rate | < 30% |
| | Engagement rate | > 70% |
| | CTR campañas | > 2,5% |
| | Recurrentes sobre total | > 55% |
| 03 · Funnel y conversión | Conversión total App + Web | 25% |
| | Conversión App | 30% |
| | Conversión Web | 18% |
| | View item → Add to cart | > 18% |
| | Add to cart → Begin checkout | > 60% |
| | Begin checkout → Purchase | > 70% |
| | Abandono de carrito | < 55% |
| | Repeat order / recompra | > 30% |
| 04 · Checkout y pagos | Aprobación de pago | > 97% |
| | Rechazo de pago | < 3% |
| | Éxito promos por BIN | > 99% |
| | Tiempo de checkout | < 90 seg |
| | Error en checkout | < 1% |
| | Conversión por medio de pago | Por canal |
| 05 · CRM, loyalty y personalización | Base identificada / logueada | > 70% |
| | Socios Papa Puntos activos | +20% |
| | Revenue atribuido a CRM | > 8% |
| | Open rate Push | > 8% |
| | Open rate Email | > 5% |
| | CTR CRM | > 2,5% |
| | Cross-selling | 35% pedidos |
| | Uplift personalización / A-B test | +5% |
| 06 · Operación y experiencia | Uptime plataforma | > 99,9% |
| | Tiempo de carga App / Web | < 2,5 seg |
| | On-time delivery / promesa | > 90% |
| | Cancelaciones / voids | < 1,5% |
| | Contact rate SAC | < 3% |
| | NPS | > 60 |
| | Incidencias críticas resueltas | < 2 h |
| 07 · Omnicanalidad y escalabilidad | Canales integrados | App, Web, Agregadores, Call Center, Totem y WhatsApp |
| | Nuevas funcionalidades | Feature flags |
| | A/B testing | > 2 tests / mes |
| | Escalabilidad peak | Soportar 7x tráfico |
| | Integraciones críticas | 100% operativas |
| | Time-to-market comercial | -50% |
| 08 · Gobierno y seguimiento | Línea base acordada | 100% |
| | Dashboard ejecutivo | Semanal + mensual |
| | Comité de seguimiento | Mensual |
| | Owner negocio + TI + partner | Definidos |
| | Roadmap de mejora continua | Trimestral |
| | Plan de acción por KPI | 100% |

**Regla de medición:** cada indicador debe tener fórmula, fuente de datos, período, segmentación, línea base, meta, periodicidad y responsable. Los KPI críticos son umbrales de éxito; los indicadores de gestión explican cómo se llega a ellos.

---

## 10 · La propuesta

### El partner debe llegar preparado para demostrar.

Más que un catálogo de funcionalidades, buscamos una respuesta concreta sobre experiencia, operación, integración, esfuerzo, evolución y viabilidad económica. La propuesta debe dejar claro cuánto cuesta construir, operar y escalar la solución, y qué recibimos en cada fase.

Botón: «Descargar kit completo →» (`assets/kit-pj-25-09-26.zip`).

1. Journey de nuestros clientes
2. Arquitectura e integraciones
3. Flujo técnico de la orden
4. Demo con eventos sorpresa
5. Plan de implementación
6. Propuesta económica desglosada

### Referencia visual: el flujo completo

Esta vista resume el journey utilizado como inspiración para el kit. (Imagen `Customer Journey PJ 24-09-26.png`, descrita abajo.)

Pie de página: «Ecommerce Experience Kit · Una experiencia real para una propuesta real.»

---

## Adjuntos del kit completo

Contenido del zip `kit-pj-25-09-26.zip` (fechas de septiembre y octubre de 2026). Los archivos están en `adjuntos/`.

| Archivo | Qué es |
|---|---|
| `Customer Journey Relato.pdf` | El journey contado como relato (transcrito abajo) |
| `Customer Journey PJ 24-09-26.png` | Infografía de las 10 etapas (descrita abajo) |
| `Papa Johns Chile Mapa Capacidades.pdf` | 57 capacidades en 13 dominios con clasificación y prioridad (transcrito abajo) |
| `Volumetria Papa Johns.pdf` | Volúmenes actuales y pendientes de la operación (transcrito abajo) |
| `Flujo Online Ordering.html` | Diagrama draw.io «PJ_Ecosistema_APPS-FLUJO ORDEN v2» (transcrito abajo) |
| `Arquitectura cloud.png` | Arquitectura actual en AWS (descrita abajo) |

### Customer Journey Relato (PDF)

Encabezado del PDF (única imagen del documento): logo verde «PAPA JOHNS» con el claim en español **«Mejores Ingredientes. Mejor Pizza.»**, la versión chilena de «Better Ingredients. Better Pizza.».

El viaje del cliente en el ecosistema Ecommerce Papa Johns comienza con la preparación de la nueva campaña comercial “Arma tu Combo”. Antes del lanzamiento, el equipo comercial ingresa al Back Office para configurar la campaña, administrando productos, categorías, imágenes, precios, cupones, canales y reglas promocionales con total autonomía comercial. Por su parte, Marketing crea la landing page optimizada para SEO. La plataforma garantiza la distribución coherente de la campaña en App, Web y demás canales del ecosistema como tótems, delivery, Call Center y WhatsApp.

Cuando un cliente interactúa con un anuncio en Instagram, un deep link lo redirige a la App o a la Web según corresponda, conservando el origen de la visita y la intención de compra. El sistema reconoce el contexto del usuario adaptando la experiencia: si es un Lover, facilita la recompra y muestra sus favoritos; si es un Switcher, presenta ofertas personalizadas para incentivar la compra; y si es un Non Buyer, destaca los productos principales para reducir las barreras de conversión. Esta personalización se gestiona en integración con Synerise.

Al ingresar, el cliente elige la modalidad de entrega. Si selecciona Delivery, se valida la cobertura de la tienda y se muestran los tiempos y costos de envío. Si opta por Pick Up, consulta tiendas y horarios disponibles. Cambiar entre estas modalidades durante el proceso actualiza automáticamente las condiciones sin perder el avance. Luego, el cliente accede a "Arma tu Combo", personaliza sus pizzas (tamaño, masa, ingredientes o mitades) y el sistema valida las reglas y ajusta los precios en tiempo real. Durante la navegación, la plataforma sugiere acompañamientos, bebidas o postres mediante recomendaciones inteligentes de cross-selling y up-selling.

En el carrito, el usuario revisa el resumen, aplica cupones o utiliza sus Papa Puntos. Si navega como invitado e inicia sesión, el carrito y el contexto se conservan intactos. En caso de abandono de la compra, el carrito se guarda y se registran eventos en Synerise para enviar comunicaciones de recuperación vía email, push o WhatsApp. Al hacer clic en el mensaje, el usuario retoma el carrito con precios y disponibilidad revalidados.

Durante el checkout, se presentan los datos del pedido, estimaciones de tiempo y opciones de pago (tarjetas, billeteras digitales, giftcards). Si se aplica una promoción bancaria, se valida el BIN de la tarjeta correspondiente. Tras la aprobación del pago, la orden se envía a Aloha y a los sistemas operacionales para gestionar la preparación, despacho o retiro en tienda, permitiendo además la gestión de incidencias, cancelaciones y programaciones futuras.

Finalmente, el cliente puede consultar el estado de su orden o contactar a Servicio al Cliente, donde el equipo cuenta con el historial unificado de la interacción. Completada la compra, se acreditan los Papa Puntos y se activan encuestas NPS o acciones de postventa. Días después, el cliente puede repetir su pedido habitual en pocos pasos, disfrutando de una experiencia consistente sin importar si inicia la compra desde la Web, la App, WhatsApp o un asistente de IA conversacional.

### Infografía «El viaje del cliente en el ecosistema Ecommerce Papa John's» (PNG)

Subtítulo: «Desde la creación de la campaña hasta la recompra, una experiencia omnicanal, personalizada y conectada.» Muestra mockups de la campaña «Arma tu Combo» en web y app.

| # | Etapa | Contenido de la infografía |
|---|---|---|
| 1 | Preparación de la campaña (Back Office) | El equipo comercial y Marketing preparan y lanzan la campaña “Arma tu Combo” con autonomía en la plataforma. Crear campaña (configurar productos, categorías, precios, cupones y reglas) → Gestionar contenido (cargar imágenes, banners y contenidos dinámicos) → Definir alcance (seleccionar canales: App, Web, Tótem, Agregadores, Call Center, WhatsApp; tiendas y vigencias) → Landing page y SEO (Marketing crea la landing page optimizada) → Publicar (la campaña queda disponible en todo el ecosistema) |
| 2 | Entradas al ecosistema | Un mismo cliente, múltiples puntos de entrada: anuncio en redes sociales, búsqueda orgánica (SEO), anuncio al Home, e-mail / push (CRM), programa Papa Puntos, deep link a promoción, acceso directo App/Web |
| 3 | Reconocimiento del cliente | La experiencia se adapta según su perfil con integración a Synerise. **Lover:** facilita la recompra, muestra favoritos y beneficios. **Switcher:** ofertas personalizadas para incentivar la compra. **Non Buyer:** destaca los productos principales y reduce barreras de conversión. Personalización en tiempo real con Synerise (historial, afinidad, frecuencia, propensión) |
| 4 | Selección de entrega | El cliente elige cómo quiere su pedido. Mockup «¿Cómo quieres tu pedido?»: Delivery / Pick Up. Validación de cobertura, tienda, horarios, tiempos y costos de envío. Posibilidad de cambiar entre modalidades sin perder el avance |
| 5 | Exploración y personalización | El cliente arma su combo a su medida. Mockup de pizza con tamaño (M, L, XL), masa (Original, Delgada, Integral), ingredientes con foto y «Agregar al carro». Personalización de pizzas (tamaño, masa, ingredientes o mitades) · Validación de reglas (según promoción, tienda y disponibilidad) · Precios en tiempo real · Recomendaciones inteligentes (cross-selling y up-selling de acompañamientos, bebidas y postres) |
| 6 | Carro y beneficios | El cliente revisa su pedido y aprovecha sus beneficios. Mockup «Tu pedido»: Arma tu Combo $11.980 (1 pizza grande ½ Pepperoni – ½ Hawaiana + bebida + 1 acompañamiento), «Agregar más productos», cupón con «Aplicar», interruptor «Usar Papa Puntos (disponibles: 1.280 pts)», total y «Continuar». Persistencia del carrito (si inicia sesión, se conserva todo el contexto) · Recuperación de carrito (eventos a Synerise para enviar email, push o WhatsApp) |
| 7 | Checkout y pago | El cliente finaliza su compra de forma simple y segura. Mockup «Medio de pago»: tarjeta de crédito/débito (Visa, Mastercard, Amex), Apple Pay / Google Pay, transferencia (RutPay/Fintoc), Giftcard, «Descuento bancario: se valida BIN automáticamente», «Pagar $11.980» |
| 8 | Procesamiento y despacho | La orden se integra y se gestiona según la modalidad. **Delivery:** envío de orden a Aloha, asignación de repartidor, zona de reparto, seguimiento en tiempo real, notificaciones al cliente. **Pick Up:** envío de orden a Aloha, preparación en tienda, notificación de retiro, tiempo estimado de preparación |
| 9 | Postventa y fidelización | Después de la compra, seguimos acompañando al cliente. Confirmación de pedido (comprobante y detalle) → Seguimiento (estado del pedido en App, Web o WhatsApp) → Servicio al Cliente (historial unificado y gestión de tickets) → Papa Puntos (acreditación de puntos y nuevos beneficios) → NPS y postventa (encuestas y comunicaciones personalizadas) |
| 10 | Recompra y omnicanalidad | El cliente vuelve cuando quiere, desde cualquier canal. Repetir pedido (en pocos pasos con sus productos favoritos) → Misma experiencia en todos los canales (App, Web, Tótem, Agregadores, Call Center, WhatsApp o IA conversacional) → Futuro (asistente de IA con el mismo catálogo, promociones y checkout) |

### Mapa de capacidades (PDF)

Columnas del original: ID, Capa, Dominio (L1), Capacidad (L2), Caso de uso, Propósito, Clasificación, Prioridad, Módulos de origen. El PDF no explica la columna «Caso de uso» (valores Sí/No) ni los módulos M1 a M13. El PDF viene sin tildes; aquí se agregaron, sin cambiar el texto.

| ID | Capa | Dominio (L1) | Capacidad (L2) | Caso de uso | Propósito | Clasificación | Prioridad | Módulos |
|---|---|---|---|---|---|---|---|---|
| D1-01 | Core | Experiencia Digital y Descubrimiento | Gestión de Contenido Web y Landing Pages | Sí | Publicar y mantener contenido de marketing (home, banners, páginas de categoría/producto) sin depender de despliegues de TI diferenciado por segmentación de cliente | Habilitadora | Must-have | M1 |
| D1-02 | Core | Experiencia Digital y Descubrimiento | Navegación y Taxonomía de Categorías | Sí | Organizar el catálogo en una estructura de navegación clara y escalable para el cliente. | Core | Must-have | M1 |
| D1-03 | Core | Experiencia Digital y Descubrimiento | Búsqueda y Descubrimiento de Producto | No | Permitir encontrar productos por texto libre con autocompletado y relevancia (capacidad no cubierta hoy). | Diferenciadora | Should-have | M1 |
| D1-04 | Core | Experiencia Digital y Descubrimiento | Mensajería y Banners Promocionales Dinámicos | Sí | Destacar ofertas y novedades de forma segmentada según contexto del usuario. | Diferenciadora | Should-have | M1 |
| D1-05 | Core | Experiencia Digital y Descubrimiento | Atención Conversacional Embebida | Sí | Ofrecer un canal de contacto inmediato (chat/WhatsApp) durante la navegación, sin salir del sitio. | Habilitadora | Should-have | M1 |
| D2-01 | Core | Catálogo y Gestión de Producto | Gestión Maestra de Catálogo y SKU | Sí | Mantener una fuente única de verdad de productos, categorías y atributos, sincronizada con todos los canales. | Core | Must-have | M3 |
| D2-02 | Core | Catálogo y Gestión de Producto | Gestión de Variantes de Producto | Sí | Modelar tamaños, masas y combinaciones de un mismo producto base como variantes vendibles. | Core | Must-have | M3 |
| D2-03 | Core | Catálogo y Gestión de Producto | Gestión de Precios por Variante y Canal | Sí | Definir y mantener precios diferenciados por tamaño, canal (web/app/call center) y eventualmente por tienda. | Core | Must-have | M3 |
| D2-04 | Core | Catálogo y Gestión de Producto | Gestión de Etiquetas y Badges Comerciales | Sí | Destacar atributos comerciales del producto (más vendido, picante, nuevo) de forma configurable. | Diferenciadora | Nice-to-have | M3 |
| D2-05 | Core | Catálogo y Gestión de Producto | Gestión de Campañas de Co-branding y Licencias | No | Soportar líneas de producto temáticas o colaboraciones de marca con vigencia temporal. | Diferenciadora | Nice-to-have | M3 |
| D3-01 | Core | Personalización y Configuración de Producto | Motor de Configuración de Producto | Sí | Permitir al cliente combinar masa, salsa, queso e ingredientes bajo reglas de negocio (mínimos, máximos, equivalencias). | Diferenciadora | Must-have | M4 |
| D3-02 | Core | Personalización y Configuración de Producto | Motor de Precios Dinámicos por Configuración | Sí | Calcular en tiempo real el precio final según cada atributo y recargo seleccionado. | Core | Must-have | M4 |
| D3-03 | Core | Personalización y Configuración de Producto | Gestión de Productos Compuestos | Sí | Modelar productos con sub-configuraciones independientes (pizza por mitades, combos armables). | Diferenciadora | Should-have | M4 |
| D3-04 | Core | Personalización y Configuración de Producto | Información Nutricional y de Alérgenos por Configuración | No | Informar al cliente calorías, porciones y alérgenos según la configuración exacta elegida. | Habilitadora | Should-have | M4 |
| D4-01 | Core | Carrito, Precios y Promociones | Gestión de Carrito Persistente | Sí | Mantener el estado del pedido en construcción a través de la sesión y entre dispositivos si el cliente está autenticado. | Core | Must-have | M5, M9 |
| D4-02 | Core | Carrito, Precios y Promociones | Motor de Reglas de Precio y Descuento | Sí | Aplicar descuentos, promociones y precios especiales de forma centralizada y auditable. | Core | Must-have | M5, M9 |
| D4-03 | Core | Carrito, Precios y Promociones | Gestión de Cupones y Códigos Promocionales | Sí | Crear, distribuir y validar códigos de descuento de un solo uso o campaña. | Core | Must-have | M5, M9 |
| D4-04 | Core | Carrito, Precios y Promociones | Motor de Bundles y Combos | Sí | Vender combinaciones de productos de distintas categorías a un precio único distinto de la suma de partes. | Diferenciadora | Must-have | M5, M9 |
| D4-05 | Core | Carrito, Precios y Promociones | Recomendaciones de Upsell y Cross-sell | Sí | Incrementar el ticket promedio sugiriendo mejoras o productos complementarios en momentos clave del flujo. | Diferenciadora | Should-have | M5, M9 |
| D5-01 | Core | Checkout y Medios de Pago | Orquestación de Checkout | Sí | Guiar al cliente (invitado o registrado) por un flujo de pago claro, con validaciones y consentimientos legales. | Core | Must-have | M6 |
| D5-02 | Core | Checkout y Medios de Pago | Gestión Multi-medio de Pago | No | Abstraer e integrar múltiples proveedores de pago (tarjetas, Webpay, transferencia, Pluxee, Rutpay, efectivo, POS en entrega) bajo una experiencia unificada. | Core | Must-have | M6 |
| D5-03 | Core | Checkout y Medios de Pago | Gestión de Gift Cards | Sí | Emitir, cargar y canjear tarjetas de regalo como medio de pago o abono. | Diferenciadora | Should-have | M6 |
| D5-04 | Core | Checkout y Medios de Pago | Cálculo de Costos de Envío en Tiempo Real | Sí | Determinar el costo de despacho según zona, tienda y promociones vigentes antes de confirmar el pago. | Core | Must-have | M6 |
| D5-05 | Core | Checkout y Medios de Pago | Registro de Consentimientos de Compra | No | Dejar trazabilidad legal de la aceptación de términos y políticas en cada transacción. | Habilitadora | Must-have | M6 |
| D6-01 | Core | Gestión de Pedidos y Fulfillment | Orquestación y Enrutamiento de Pedidos (OMS) | Sí | Dirigir cada pedido a la tienda o punto de preparación correcto según cobertura, carga y disponibilidad. | Core | Must-have | M2, M10 |
| D6-02 | Core | Gestión de Pedidos y Fulfillment | Seguimiento de Estado de Pedido en Tiempo Real | Sí | Informar al cliente el estado y tiempo estimado de su pedido desde la confirmación hasta la entrega. | Core | Must-have | M2, M10 |
| D6-03 | Core | Gestión de Pedidos y Fulfillment | Gestión de Agendamiento y Ventanas de Entrega | Sí | Permitir programar el pedido para un horario futuro en lugar de entrega inmediata. | Diferenciadora | Should-have | M2, M10 |
| D6-04 | Core | Gestión de Pedidos y Fulfillment | Gestión de Cancelaciones y Reversas | Sí | Ejecutar cancelaciones de pedido de forma controlada, revirtiendo pago y puntos asociados. | Core | Must-have | M2, M10 |
| D6-05 | Core | Gestión de Pedidos y Fulfillment | Historial de Pedidos y Recompra | Sí | Permitir al cliente autenticado revisar compras pasadas y repetirlas en un clic. | Diferenciadora | Should-have | M2, M10 |
| D7-01 | Core | Red de Tiendas y Cobertura | Directorio y Ficha de Tienda | Sí | Exponer información actualizada de cada local (dirección, teléfono, cómo llegar) al cliente. | Core | Must-have | M2, M11 |
| D7-02 | Core | Red de Tiendas y Cobertura | Motor de Zonificación de Cobertura | Sí | Determinar automáticamente qué tienda atiende una dirección de delivery dada. | Core | Must-have | M2, M11 |
| D7-03 | Core | Red de Tiendas y Cobertura | Gestión de Horarios Operativos por Tienda y Canal | Sí | Mantener horarios diferenciados de retiro y delivery por cada tienda y día de la semana. | Core | Must-have | M2, M11 |
| D7-04 | Core | Red de Tiendas y Cobertura | Estado Operativo de Tienda en Tiempo Real | Sí | Reflejar si una tienda está abierta, cerrada o con capacidad limitada en el momento de la compra. | Habilitadora | Must-have | M2, M11 |
| D8-01 | Core | Identidad de Cliente y CRM | Autenticación Multi-método | Sí | Permitir ingresar vía redes sociales, código de un solo uso por correo, o continuar como invitado, minimizando fricción. | Core | Must-have | M7 |
| D8-02 | Core | Identidad de Cliente y CRM | Perfil Único de Cliente | Sí | Unificar la identidad del cliente entre canal online y compra presencial (vía RUT) para una vista 360. | Diferenciadora | Must-have | M7 |
| D8-03 | Core | Identidad de Cliente y CRM | Gestión de Direcciones y Medios de Pago Guardados | Sí | Acelerar compras recurrentes recordando datos de entrega y pago del cliente autenticado. | Core | Should-have | M7 |
| D8-04 | Core | Identidad de Cliente y CRM | Gestión de Consentimientos y Preferencias de Comunicación | Sí | Registrar y respetar las preferencias de marketing y contacto de cada cliente. | Habilitadora | Must-have | M7 |
| D9-01 | Core | Fidelización y Marketing Relacional | Motor de Acumulación y Canje de Puntos | Sí | Calcular, acreditar y permitir canjear puntos de fidelización de forma consistente entre canales. | Diferenciadora | Must-have | M8 |
| D9-02 | Core | Fidelización y Marketing Relacional | Catálogo de Canje | Sí | Ofrecer productos o beneficios específicos canjeables por puntos, distinto del catálogo de venta regular. | Diferenciadora | Should-have | M8 |
| D9-03 | Core | Fidelización y Marketing Relacional | Motor de Reglas de Vigencia, Topes y Combinabilidad | Sí | Administrar de forma centralizada la caducidad, mínimos, topes y combinación de puntos con otras promociones. | Core | Should-have | M8 |
| D9-04 | Core | Fidelización y Marketing Relacional | Automatización de Campañas y Comunicación | Sí | Activar comunicaciones segmentadas (newsletter, recordatorios de puntos) basadas en comportamiento del cliente. | Diferenciadora | Should-have | M8 |
| D10-01 | Core | Atención al Cliente y Soporte | Base de Conocimiento y Centro de Ayuda | Sí | Resolver dudas frecuentes del cliente sin intervención humana, organizadas por tema y con búsqueda. | Habilitadora | Must-have | M12 |
| D10-02 | Core | Atención al Cliente y Soporte | Gestión de Casos y Tickets de Soporte | Sí | Canalizar, asignar y trazar reclamos o consultas vinculadas a un pedido o boleta específica. | Core | Must-have | M12 |
| D10-03 | Core | Atención al Cliente y Soporte | Canal de Atención Conversacional y Telefónico | Sí | Ofrecer alternativas de contacto directo (WhatsApp, call center) para casos que requieren atención humana. | Habilitadora | Should-have | M12 |
| D10-04 | Core | Atención al Cliente y Soporte | Encuestas de Satisfacción Post-compra | Sí | Medir la experiencia del cliente tras cada pedido para retroalimentar la operación. | Diferenciadora | Nice-to-have | M12 |
| D11-01 | Core | Contenido, SEO y Experiencia de Marca | Gestión de Contenido Institucional | Sí | Publicar y mantener actualizado contenido corporativo (marca, sostenibilidad, blog) sin dependencia de TI. | Habilitadora | Should-have | M13 |
| D11-02 | Core | Contenido, SEO y Experiencia de Marca | SEO Técnico y Landing Pages Programáticas | Sí | Generar y mantener a escala páginas de posicionamiento por producto y por tienda. | Diferenciadora | Should-have | M13 |
| D11-03 | Core | Contenido, SEO y Experiencia de Marca | Gestión de Marca, Sostenibilidad y Storytelling | Sí | Comunicar atributos diferenciadores de marca (origen de ingredientes, prácticas sostenibles) de forma consistente. | Nice-to-have | Nice-to-have | M13 |
| D12-01 | Foundation | Integración, Datos y Plataforma | Integración con POS/ERP de Tienda | Sí | Sincronizar pedidos, disponibilidad y puntos de fidelización entre el canal digital y la operación presencial. | Habilitadora | Must-have | Transversal (observado en M2, M6, M8, M9, M11) |
| D12-02 | Foundation | Integración, Datos y Plataforma | Integración con Pasarelas de Pago Locales | Sí | Conectar de forma segura con los múltiples proveedores de pago del mercado chileno requeridos por el negocio. | Habilitadora | Must-have | Transversal (observado en M2, M6, M8, M9, M11) |
| D12-03 | Foundation | Integración, Datos y Plataforma | API de Catálogo, Precio y Promoción Multicanal | Sí | Exponer una única fuente de verdad comercial consumible por sitio web, app móvil y call center. | Habilitadora | Must-have | Transversal (observado en M2, M6, M8, M9, M11) |
| D12-04 | Foundation | Integración, Datos y Plataforma | Plataforma de Datos de Cliente y Analítica | Sí | Consolidar el comportamiento del cliente entre canales para soportar decisiones comerciales y personalización. | Diferenciadora | Should-have | Transversal (observado en M2, M6, M8, M9, M11) |
| D12-05 | Foundation | Integración, Datos y Plataforma | Geocodificación y Servicios de Mapas | Sí | Traducir direcciones en coordenadas y rutas para asignación de tienda y cálculo de tiempos de entrega. | Habilitadora | Must-have | Transversal (observado en M2, M6, M8, M9, M11) |
| D13-01 | Foundation | Seguridad, Cumplimiento y Gobierno | Gestión de Consentimiento y Protección de Datos Personales | Sí | Cumplir con la normativa de protección de datos personales en cada punto de captura de información del cliente. | Habilitadora | Must-have | Transversal (observado en M6, M13) |
| D13-02 | Foundation | Seguridad, Cumplimiento y Gobierno | Cumplimiento Normativo Comercial | Sí | Alinear la operación con la Ley del Consumidor, condiciones de venta y políticas de compliance corporativo publicadas. | Habilitadora | Must-have | Transversal (observado en M6, M13) |
| D13-03 | Foundation | Seguridad, Cumplimiento y Gobierno | Gestión de Accesos y Seguridad de Plataforma | Sí | Proteger la plataforma y los datos transaccionales frente a accesos no autorizados (incluye cumplimiento PCI-DSS en pagos). | Habilitadora | Must-have | Transversal (observado en M6, M13) |
| D13-04 | Foundation | Seguridad, Cumplimiento y Gobierno | Trazabilidad y Auditoría de Transacciones | Sí | Mantener registro auditable de pedidos, pagos, puntos y cambios relevantes para resolución de disputas. | Habilitadora | Should-have | Transversal (observado en M6, M13) |

### Volumetría y dimensionamiento – Nueva Plataforma Ecommerce Omnicanal (PDF)

| Bloque | Dimensión | Indicador / descripción | Volumen actual / referencia | Estado |
|---|---|---|---|---|
| Tráfico y usuarios | Sesiones App + Web | Total de sesiones semanales generadas en los canales propios App y Web. | ~700.000 / semana | Actual |
| Tráfico y usuarios | Usuarios únicos App + Web | Usuarios únicos que visitan App y Web en una semana y/o mes. Separar de sesiones para dimensionar audiencia real. | Por levantar | Pendiente |
| Tráfico y usuarios | MAU App + Web | Usuarios activos mensuales por canal. Idealmente reportar App y Web por separado. | App ~500.000 MAU; Web por levantar | Referencial / Pendiente |
| Tráfico y usuarios | Peak de demanda | Multiplicador de tráfico observado en eventos de alta demanda respecto de un día normal: 1 por mes, 10 a 12 al año. | Hasta 7x vs. un día normal | Actual |
| Tráfico y usuarios | Eventos peak | Principales eventos que generan estrés de demanda y requieren escalabilidad extraordinaria. | Día de la Pizza, Cyber y campañas masivas | Actual |
| Tráfico y usuarios | Mix fuente de tráfico | Distribución de sesiones/usuarios por fuente: Direct, Organic, Paid, CRM, Referral, Cross-network, etc. | Por levantar por canal y período | Pendiente |
| Tráfico y usuarios | Tiempo de interacción | Tiempo medio de interacción/engagement por sesión en App y Web. | Por levantar en GA4 | Pendiente |
| Transacciones | Órdenes App | Órdenes mensuales procesadas por la App propia. | ~300.000 / mes | Actual |
| Transacciones | Órdenes Web | Órdenes mensuales procesadas por el sitio Web. | ~100.000 / mes | Actual |
| Transacciones | Órdenes Agregadores | Órdenes mensuales provenientes de marketplaces de delivery. | ~200.000 / mes | Actual |
| Transacciones | Órdenes Tótem | Órdenes mensuales procesadas por tótems de autoatención. | ~2.500 / mes | Actual |
| Transacciones | Órdenes Call Center | Órdenes mensuales gestionadas por Call Center. | ~20.000 / mes | Actual |
| Transacciones | Órdenes ecosistema actual | Volumen mensual aproximado sumando App, Web, Agregadores, Tótem y Call Center. | ~622.500 / mes | Derivado |
| Transacciones | Órdenes por franja: Apertura | Participación de las órdenes del día concentradas en la franja de apertura. | 4% | Actual |
| Transacciones | Órdenes por franja: Almuerzo | Participación de las órdenes del día concentradas en la franja de almuerzo. | 11% | Actual |
| Transacciones | Órdenes por franja: Valle | Participación de las órdenes del día concentradas en la franja valle. | 10% | Actual |
| Transacciones | Órdenes por franja: Peak | Participación de las órdenes del día concentradas en la principal franja peak. | 70% | Actual |
| Transacciones | Órdenes por franja: Cierre | Participación de las órdenes del día concentradas en la franja de cierre. | 5% | Actual |
| Transacciones | Órdenes máximas por hora / minuto | Máximo throughput transaccional observado durante eventos peak; clave para dimensionar infraestructura y autoscaling. | Por levantar: P95/P99 y máximo absoluto | Pendiente |
| Transacciones | Concurrencia máxima | Máximo número de usuarios/sesiones concurrentes durante un evento peak. | Por levantar en eventos de alta demanda | Pendiente |
| Transacciones | Ticket promedio por canal | Ticket promedio de compra por App, Web, Agregadores, Tótem y Call Center. | $15.690 | Actual |
| Transacciones | Conversión App + Web | Tasa de compra sobre sesiones en los canales propios. | ~18% | Actual |
| Transacciones | Conversión Web | Tasa de compra sobre sesiones Web. | ~14% | Actual |
| Transacciones | Conversión App | Tasa de compra sobre sesiones App. | ~22% | Actual |
| Transacciones | Mix Delivery / Pick Up | Distribución de órdenes de canales propios según modalidad de entrega. | Referencia 2025: Delivery 49% / Pick Up 51% | Actual |
| Cliente, CRM y Loyalty | Base de clientes | Tamaño de la base total e identificada, diferenciando registrados, activos y contactables. | Por levantar / consolidar Synerise + ecommerce | Pendiente |
| Cliente, CRM y Loyalty | Segmentos Lover / Switcher / Non Buyer | Distribución de clientes según frecuencia, afinidad y comportamiento de compra. | Por definir metodología y cuantificar | Pendiente |
| Cliente, CRM y Loyalty | Loyalty / Papa Puntos | Socios inscritos, socios activos y porcentaje de órdenes con acumulación o redención. | ~1M socios objetivo; ~281k activos como referencia histórica | Referencial |
| Cliente, CRM y Loyalty | Push | Volumen mensual de comunicaciones push y base habilitada para recibirlas. | ~12 campañas/mes; base histórica ~430k | Referencial |
| Cliente, CRM y Loyalty | Email | Volumen mensual de comunicaciones email y base habilitada para recibirlas. | ~8 campañas/mes; base histórica ~710k | Referencial |
| Cliente, CRM y Loyalty | WhatsApp | Volumen esperado de conversaciones, sesiones comerciales y órdenes del canal conversacional. | Nuevo canal: volumen a proyectar en RFP | Futuro |
| Cliente, CRM y Loyalty | Frecuencia de compra | Promedio de compras por cliente activo en una ventana definida (p.ej. 6 o 12 meses). | Referencia Loyalty: 5,7 compras en 6 meses; validar base total | Referencial |
| Cliente, CRM y Loyalty | Recompra | Porcentaje de órdenes/clientes que repiten compra y uso de funcionalidad 'repetir pedido'. | (sin dato) | Pendiente |
| Cliente, CRM y Loyalty | Cross-selling | Porcentaje de pedidos que incorporan al menos un ítem adicional sugerido. | ~25% de pedidos; objetivo de evolución a validar | Actual |
| Cliente, CRM y Loyalty | Personalización | Porcentaje de usuarios/sesiones susceptibles de recibir contenido, promociones o recomendaciones personalizadas. | Por levantar; integración con Synerise | Pendiente |
| Catálogo, contenido y promociones | Tiendas activas | Cantidad de tiendas operativas que deben ser soportadas por catálogo, disponibilidad, precios y fulfillment. | Por levantar cifra vigente | Pendiente |
| Catálogo, contenido y promociones | Cobertura Delivery | Número de zonas/polígonos y reglas de cobertura utilizadas para asignación de tienda y delivery. | Por levantar | Pendiente |
| Catálogo, contenido y promociones | SKUs / variantes | Cantidad de productos activos, variantes y configuraciones comercializables por canal/tienda. | Por levantar desde catálogo actual | Pendiente |
| Catálogo, contenido y promociones | Complejidad pizza configurada | Combinaciones posibles de tamaño, masa, borde, ingredientes, mitades y restricciones. | Por cuantificar; debe soportar configuración dinámica | Pendiente |
| Catálogo, contenido y promociones | Promociones simultáneas | Cantidad máxima de promociones, bundles, descuentos y reglas comerciales activas concurrentemente. | Por levantar en semanas peak | Pendiente |
| Catálogo, contenido y promociones | Cupones | Volumen de cupones activos/redimidos y capacidad de generar códigos masivos. | Referencias recientes: lotes de hasta 250.000 códigos | Referencial |
| Catálogo, contenido y promociones | Activos digitales - imágenes | Cantidad de imágenes de producto, categoría, campaña y contenido administradas por CMS/DAM. | Por levantar: activos vigentes + altas/mes | Pendiente |
| Catálogo, contenido y promociones | Activos digitales - banners | Cantidad de banners/carruseles activos y renovados por mes, diferenciados por canal/dispositivo. | Por levantar: simultáneos + renovaciones/mes | Pendiente |
| Catálogo, contenido y promociones | Activos digitales - videos | Cantidad y peso de videos utilizados en landings, campañas o contenido digital. | Por levantar: activos + GB totales | Pendiente |
| Catálogo, contenido y promociones | Landings y piezas por canal | Número de landings, splash, pop-ups, thumbnails, íconos y creatividades específicas para App, Web, Tótem y WhatsApp. | Por levantar: activos simultáneos + publicaciones/mes | Pendiente |
| Catálogo, contenido y promociones | SEO | Número de páginas indexables, landings SEO y volumen de contenido que requiere metadata, canonical, schema y control técnico. | Por levantar desde Web/CMS | Pendiente |
| Checkout, pagos y funnel | Pasos end-to-end | Cantidad de pasos/interacciones desde entrada hasta orden confirmada en journeys principales (orgánico, deep link, recompra). | Por medir por journey App/Web | Pendiente |
| Checkout, pagos y funnel | Abandono de carrito | Porcentaje de carritos iniciados que no finalizan en compra; considerar recuperación CRM. | Por levantar en GA4/Synerise | Pendiente |
| Checkout, pagos y funnel | Tasa de rechazo de pago | Porcentaje de intentos de pago rechazados sobre el total de intentos, por proveedor y medio de pago. | Por levantar por MDP/adquirente | Pendiente |
| Checkout, pagos y funnel | Medios de pago activos | Cantidad y tipo de medios integrados: débito/crédito, wallets, transferencias, giftcards y beneficios bancarios. | Tarjetas + wallets + transferencias + giftcards; inventario final por levantar | Pendiente |
| Checkout, pagos y funnel | Promociones por BIN | Capacidad de identificar emisor/BIN y aplicar beneficios o descuentos bancarios. | Requerimiento funcional obligatorio | Requisito |
| Operación y órdenes | Orden futura | Volumen/porcentaje de órdenes programadas y ventana máxima permitida. | Por levantar | Pendiente |
| Operación y órdenes | Cancelaciones / VOID | Tasa de órdenes canceladas, anuladas o con incidencias operativas. | Por levantar por canal y causal | Pendiente |
| Operación y órdenes | Disponibilidad / uptime | Nivel de disponibilidad requerido para la plataforma y servicios críticos. | Sugerido RFP: ≥99,95% mensual; validar con TI | Requisito sugerido |
| Operación y órdenes | Canales soportados | Canales que deberán consumir las capacidades de la nueva plataforma omnicanal. | App, Web, Agregadores, Call Center, Tótem y WhatsApp | Objetivo |
| Tecnología e integraciones | Integraciones críticas | Sistemas que deben interoperar con la plataforma: POS/OMS, CRM/CDP, pagos, analytics, loyalty, despacho y terceros. | Aloha, Synerise, GA4, pagos, despacho y otros; inventario técnico por completar | Pendiente |
| Tecnología e integraciones | Performance | Tiempos objetivo de respuesta/carga de Home, menú, producto, carrito y checkout, incluyendo escenarios peak. | Por definir SLA; medir P50/P95/P99 | Pendiente |
| Tecnología e integraciones | Escalabilidad | Capacidad de absorber picos de tráfico y transacciones sin degradación relevante de experiencia. | Debe soportar al menos peak observado de 7x + holgura de crecimiento | Requisito |
| Tecnología e integraciones | Crecimiento | Capacidad para acompañar crecimiento de usuarios, órdenes, canales y funcionalidades a 3-5 años. | Dimensionar mínimo 3 años; escenario de crecimiento por definir | Pendiente |

### Flujo Online Ordering (diagrama draw.io «FLUJO ORDEN v2»)

**Leyenda:** canal de venta · tienda física · integración API · sistema in-house · sistema externo · plataforma última milla · servicio de atención al cliente · BI & Analytics · dominio negocio · flujo de datos · notificaciones cliente.

**Bloques:** Cliente · Canales de venta (Web Papa Johns, App Papa Johns, Agregadores, Callcenter, WhatsApp) · Tótem/Kiosko · eCommerce (Core, Users, Orders, Middleware) · Pasarelas de pago (Webpay, Mercado Pago, Fintoc, Tarjetas alimentarias, Efectivo contra entrega, Tarjeta contra entrega) · API Papa Johns · Orquestador de órdenes (API NCR Cloud Connect) · Tienda física (Servidor tienda, NCR/Aloha POS, KDS) · Gestión de despacho (API DispatchTrack, Quick Commerce, Flota propia, Flota externa) · Customer Data Platform (API Synerise, CRM, Loyalty) · Servicio de atención al cliente (API Zendesk, Zendesk) · BI & Analytics (Data warehouse) · Backoffice · Notificaciones cliente (push notification).

**Notificaciones al cliente (íconos del diagrama):** dos íconos de notificación (un celular con una campana y una campana roja) unidos por una flecha rotulada **«PUSH NOTIFICATION»**. La flecha parte junto al Orquestador de órdenes, el KDS y API NCR Cloud Connect, y llega al ícono junto al «CLIENTE». Es decir, los cambios de estado de la orden en tienda generan push al cliente. Corresponde al elemento «notificaciones cliente» de la leyenda.

**Pasos numerados del flujo:**

| Paso | Desde → hasta | Qué pasa |
|---|---|---|
| 1 | Canales de venta → Core; Tótem/Kiosko → Core | Crea pedido (también desde tótem) |
| 2 | Core → Canales de venta | Tiempos dinámicos de entrega (ETA) |
| 3 | Middleware → Pasarelas de pago | Solicitud de pago |
| 4 | Pasarelas de pago → API Papa Johns | Respuesta del pago |
| 5 | Middleware → API NCR Cloud Connect → Servidor tienda; Middleware → API DispatchTrack; Middleware → API Synerise | Crea orden (para tienda, para despacho y en el CRM) |
| 6 | Servidor tienda → API NCR Cloud Connect | Envía eventos del proceso de cocina (el servidor de tienda pasa la preparación al KDS) |
| 7 | API NCR Cloud Connect → Middleware | Actualización del estado de la orden |
| 8 | Middleware → API DispatchTrack; Middleware → API Synerise | Actualización de la orden en despacho y en el CRM |
| 9 | Quick Commerce → Flota propia / Flota externa | Asignación del delivery (DispatchTrack alimenta a Quick Commerce) |
| 10 | Quick Commerce → Cliente | Entrega del despacho a domicilio |
| 11 | Quick Commerce → API Papa Johns | Eventos de actualización del despacho |
| 12 | Cliente → Core | Envío de encuesta NPS |
| 13 | Canales de venta → API Zendesk | Crea caso SAC automatizado |
| 14 | Users → API Synerise | Actualización de puntos loyalty |
| 15 | API Synerise → Users | Respuesta con puntos ganados |
| 16 | Orders → Data warehouse; Servidor tienda → Data warehouse | Envío de la orden al data warehouse |

Relaciones sin número: Orders → Core y Middleware; Core → Users; Middleware → Users; API Papa Johns → eCommerce; API Synerise → Loyalty y CRM; API Zendesk → Zendesk; NCR/Aloha POS → Servidor tienda.

### Arquitectura cloud actual (PNG)

Arquitectura del ecommerce actual de Papa Johns Chile en AWS:

- **Clientes:** el usuario entra por **API Gateway** (`api.papajohns.cl`) y por **Route 53** (DNS) → `www.papajohns.cl` → **CloudFront** (CDN), que sirve desde **S3** (archivos) y **Lambda** (funciones serverless).
- **Autenticación:** **Cognito** (autenticación y autorización) con **Cache**.
- **Aplicación:** API Gateway → **LB** (load balancer) → **AWS Elastic Beanstalk** → **LB interno** → **entorno EC2** con cuatro servicios: **Core** (lógica de negocio principal), **Middleware** (servicios de integración), **Users** (gestión de usuarios) y **Orders** (gestión de órdenes).
- **Base de datos:** **RDS PostgreSQL** separado por servicio: RDS Users, RDS Core, RDS Orders y RDS Middleware.
- **Aplicaciones:** **SNS** (móvil).
- **Monitoreo y observabilidad:** **CloudWatch** (logs y métricas) y logs centralizados.
