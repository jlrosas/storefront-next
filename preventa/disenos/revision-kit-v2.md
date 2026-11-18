# Revisión contra el kit del cliente v2 · ¿el lienzo cumple los objetivos?

- **Fecha:** 17-oct-2026
- **Alcance:** los 51 boards (89 variantes) del [lienzo](https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk) publicado. Se comprobó que lo publicado es idéntico a `_canvas/`. Se contrastó con el [kit completo](../datos/cliente/kit-pj/README.md): secciones 00 a 10 y adjuntos.
- **Pregunta:** no ítem por ítem (eso es el [checklist](checklist-kit.md)), sino **¿el lienzo logra lo que el kit quiere lograr?** Se revisaron los cuatro principios del desafío, la experiencia esperada por perfil, los criterios de diseño, la POC y los KPI.
- **Contexto:** QSR/delivery de pizza · Sofía, Diego, Valentina y el presentador · demo comercial para ganar el RFP (`ux-context.md`).
- **Capas aplicadas:** heurísticas base · vertical `qsr-delivery` · plataforma `sfcc-storefront-next` · kit del cliente y checklist.
- **Modo:** incremental sobre la [revisión contra el kit v1](revision-kit-v1.md) y la [revisión UX v2](revision-ux-v2.md); experimental (prueba del skill `ux-review`, con crítica del skill al final).
- **Límites:** revisión experta sin usuarios. Se vieron renderizadas la Home móvil de Valentina y la de Sofía. El resto se revisó desde el código y con `audit-dc.js --variants`, que da 0 fallas de contraste y 0 textos de presentador o marcadores en las pantallas del cliente. Lo que el kit pide fuera de la tienda (back office, arquitectura, propuesta económica) no se juzga aquí: se indica en qué entregable vive.

## Correcciones aplicadas (17-oct-2026, lienzo v57)

| Hallazgo | Estado | Qué se hizo |
|---|---|---|
| 1 Promesa del anuncio de Diego | Resuelto | El anuncio T2 del panel es ahora el Super Dúo («2 pizzas familiares por $22.590», `source_code=PJSD26`, foto del Super Dúo), la misma oferta que abre la Home de Diego. Guion de 12 y historial de 01 actualizados; checklist 02.08 vuelve a 🟢 |

## Veredicto

**El lienzo cumple bien la mitad del kit que habla de la tienda web y se queda corto en la que habla de sorprender y de omnicanalidad.**

- **Personalización por perfil.** Es lo más sólido. La Home de Sofía sigue al pie de la letra el orden que pide el kit (repetir → favoritas → puntos → beneficio → recomendación). Diego tiene ocasiones y «¿Para cuántos?». Valentina tiene razones para volver.
- **«Hacer fácil decidir».** También está resuelto: precios claros, combos y disponibilidad real con salida.

Hay tres problemas que el cliente notaría:

1. **La promesa del anuncio de Diego no se cumple.** El anuncio que muestra el panel es el Box Halloween, y la Home dice «La oferta que viste: Super Dúo». Es justo el ejemplo que pone el kit de lo que no debe pasar.
2. **El hambre depende de material que no tenemos.** El video es una foto en movimiento y las fotos son recortes de campañas. El principio 01 y el «debe sorprendernos» descansan en eso.
3. **La omnicanalidad casi no se ve.** El kit pide una demo «concreta y omnicanal», pero el lienzo es solo web, más mensajes de WhatsApp y SMS en el teléfono del presentador. La App hace 3 veces las órdenes de la Web.

El primero se corrige en minutos. Los otros dos son decisiones de alcance que conviene tomar antes de la demo.

## Cumplimiento por objetivo del kit

Escala: **Cumple** · **En parte** · **No cumple** · **Otro entregable** (no es del lienzo).

### El desafío (00) y la experiencia (07)

| Objetivo del kit | Veredicto | Evidencia en el lienzo | Qué falta |
|---|---|---|---|
| **01 · Entrar por los ojos**: hero, video, zoom, textura, ingredientes, «la PDP genera antojo antes que el precio» | En parte | Primeros planos de queso estirado a sangre (Home, menú, ficha); zoom; ingredientes con foto; movimiento con pausa; la ficha pone foto → nombre → ★ → descripción antes del precio | Video real y fotos sin texto del cliente (C6, C7); «preparación» (horno, masa) no aparece. Ver hallazgo 2 |
| **02 · Que el sitio entienda el momento** (perfil y ocasión) | Cumple | Tres Homes distintas; Sofía en tres momentos (antes, en curso, después); Diego cambia por hora (almuerzo, partido, celebración, bajón); hero de temporada | El menú no se reordena por perfil (D7); las recomendaciones no cambian en pantalla |
| **03 · Hacer tremendamente fácil decidir** | Cumple | Para 1/2/3/4/6+, «Más pedida», «Ideal para 2», «La pediste 6 veces», total en el botón, mitades, «Hazlo combo» con ahorro, promoción e ingrediente no disponibles con alternativa | Precio por persona en las ocasiones (02.14) |
| **04 · Una experiencia que se recuerde** | En parte | Opiniones y «320 esta semana», Papa Puntos visibles, postventa con calificación, recordatorio del viernes, cancelación explicada en lenguaje del cliente | **Recomendaciones inteligentes** en pantalla; contenido editorial; microinteracciones más allá de «agregar» |
| «La POC debe sorprendernos» | En parte | El panel del presentador con guion por perfil, teléfono que recibe el mensaje y dashboard en vivo es el momento más sorprendente de la demo | La tienda en sí sorprende poco sin el material visual definitivo |
| 07 · Food first | En parte | Igual que el principio 01 | |
| 07 · Jerarquía inteligente | Cumple | Un CTA principal por pantalla; el momento de Diego ya no compite con el hero (v2) | |
| 07 · Personalización visible | Cumple | Banner, módulos, promos y tarjetas cambian por perfil | |
| 07 · PDP enriquecida | Cumple | Ficha con destacados, opiniones, popularidad, «completa tu pedido», disponibilidad | Reseñas son datos de ejemplo (C8, D36) |
| 07 · Diseño por ocasión | Cumple | Ocasiones de Diego y filtro por ocasión en Ofertas | «Familia» no tiene bloque propio |
| 07 · Microinteracciones con intención | En parte | Aviso al agregar con «Deshacer», puntos por acreditar, barra de seguimiento | Transiciones; el resto es estático |
| 07 · Mobile first, rápido y accesible | Cumple (diseño) | Todo nace en 390 px; contraste AA en todas las variantes | Rendimiento no demostrable en un lienzo; algunos controles de 34 a 43 px (ver accesibilidad) |

### Los perfiles (02)

| Perfil | Experiencia que espera el kit | Veredicto | Evidencia | Qué falta |
|---|---|---|---|---|
| **Sofía** | «Papa Johns me conoce. No me hace perder tiempo» | Cumple | «Hola, Sofía», «¿Lo de siempre?» con su pedido, tienda y tarjeta, «Repetir pedido $23.890» en el primer viewport; favoritas con «La pediste 6 veces»; canje visible; Home «después» con calificación | Menú ordenado por su historial (D7) |
| **Diego** | «Entendió exactamente lo que necesitaba y me hizo fácil decidir» | En parte | «¿Para cuántos?», ocasiones por hora, combos con ahorro, oferta no disponible con salida | **La promesa del anuncio** (hallazgo 1); «Recomendados para ti»; «Por $1.500 más agrega bebida» en el carrito (hallazgo 3) |
| **Valentina** | «Volver fue mucho mejor de lo que recordaba» | En parte | «Hola de nuevo · puntos dobles», «Pedir aquí tiene premio» con tres razones, tiempos de delivery y retiro en la Home, despacho y mínimo en el panel de tienda, seguimiento sin cuenta, invitado como salida | La **propuesta de reactivación** es una franja delgada; el hero es el mismo Halloween de cualquiera (hallazgo 4) |

### La POC (03) y la propuesta (10)

| Pedido del kit | Veredicto | Dónde vive |
|---|---|---|
| 1. Configurar una campaña y sus reglas | Otro entregable | [13 Operación](13-operacion/README.md): Business Manager y Page Designer reales |
| 2. Seguir una visita hasta el checkout y la orden | Cumple | Lienzo completo por perfil + OMS real |
| 3. Probar excepciones, recuperación y respuesta de SAC | En parte | Casos sorpresa en el panel (tienda cerrada, promo no disponible, no llega el código, oferta vencida, rechazo, cancelación). SAC solo aparece como «nota baja abre un caso» |
| 4. Presentar KPIs | Cumple (simulado) | `Dashboard-Demo` con vistas por perfil (negocio, marketing, operación, SAC) |
| 5. Propuesta económica | Otro entregable | Comercial |
| 10.4 · Demo con eventos sorpresa | Cumple | Panel del presentador: guion numerado y «Más eventos y casos sorpresa» |
| 01 · Demo **omnicanal** (Web, App, agregadores, Call Center, Tótem, WhatsApp) | No cumple | Solo web y mensajes. Ver hallazgo 5 (A10) |
| 05–06 · Recorrido técnico de la orden (API Papa Johns, NCR) | Otro entregable | Arquitectura de [00 §3](00-propuesta/README.md), ya corregida con API Papa Johns y NCR |

### Los KPI críticos (09)

El lienzo no mide KPI, pero cada pantalla debería empujar alguno. Lo que más pesa:

| KPI crítico | Meta | Qué del lienzo lo empuja | Brecha |
|---|---|---|---|
| CVR total | 25% (hoy ~18%) | Promesa del anuncio, «¿Para cuántos?», repetir en un toque, checkout corto | La promesa rota de Diego ataca justo el tráfico Paid (35% de las sesiones) |
| Bounce | < 30% | Comida primero en el primer viewport de los tres perfiles | Material visual |
| Pago aprobado | > 97% | Rechazo con salida a otra tarjeta o efectivo; «Pagando…» evita el doble pago | — |
| Cross-selling | 35% (hoy ~25%) | «Hazlo combo», «Completa tu pedido», «Convertir» en el carrito | Sin recomendaciones personalizadas ni mensaje de umbral con precio exacto |
| Uptime | > 99,9% | No es de diseño | Arquitectura |

## Hallazgos, de mayor a menor impacto

### 1. La Home de Diego no muestra la oferta del anuncio que la trajo · Crítica · Demo

- **Dónde:** `Panel-Demo`, evento T2 «Anuncio de campaña (Halloween)»: el teléfono muestra «Box Halloween de Miedo · $19.990» y abre `Home-Diego`. La Home de Diego (móvil y escritorio) abre con **«La oferta que viste · Super Dúo $22.590»**.
- **Qué pasa:** el anuncio promete una cosa y la página dice que vio otra. El guion de [12](12-marketing/README.md) («anuncio de Halloween → landing con la promesa del anuncio») y el MD de [01](01-home/README.md) («la oferta exacta del anuncio: Super Dúo») se contradicen.
- **Principio:** el kit, Diego paso 01: «Si hizo clic en "2 pizzas por $X", no debe caer en un Home genérico». Coherencia de la demo.
- **Qué pierde el cliente:** en vivo, es el primer momento de Diego y el que mejor demuestra «conservar el contexto de entrada» (etapa 2 del journey). Si el equipo de Papa Johns lo nota, cae el argumento de personalización por fuente, que es el 35% de su tráfico.
- **Recomendación:** cambiar el anuncio T2 al **Super Dúo** («2 pizzas familiares por $22.590»). Coincide palabra por palabra con el ejemplo del kit y no toca la Home. Ajustar el guion de 12 («anuncio del Super Dúo») y dejar Halloween para Valentina y el correo. Alternativa: que la Home de Diego tenga la prop `anuncio` (superduo | halloween) y el panel la fije.

### 2. «Entrar por los ojos» depende de material que aún no existe · Alta · Demo

- **Dónde:** hero de la Home, `PDP-Mobile`, `PDP-Desktop`.
- **Qué pasa:** el movimiento es un zoom lento de una foto. Las fotos son recortes de piezas de campaña (C6), y no hay video (C7) ni tomas de preparación (00.06).
- **Principio:** es la primera frase del kit, «Queremos uno que provoque hambre», y su cierre: «La POC debe sorprendernos».
- **Qué pierde el cliente:** el principio que más pesa en la evaluación de diseño se demuestra con el material más débil. Si en la demo se dice «video», el cliente ve una foto.
- **Recomendación:** pedir esta semana al cliente 3 piezas: 6 s de horno o queso estirado, 2 fotos de producto sin texto y 1 de ingredientes. Si no llegan, usar un clip de stock con licencia solo en el hero, y decir en el guion que es «material de referencia». Es la mejora con más retorno por hora de todo el lienzo.

### 3. Diego no ve recomendaciones ni un empujón con precio exacto · Alta · Demo

- **Dónde:** `Menu`, `Pedido`, `Carrito-Desktop`.
- **Qué pasa:** no hay ningún «Recomendados para ti» en pantalla (02.13). El carrito ofrece «Convertir en combo · Ahorras $2.490», pero no los dos mensajes que el kit escribe literalmente: «Por $1.500 más agrega bebida» y «Te faltan $X para…» (02.15).
- **Principio:** kit 02 (Diego, pasos 03 y 04), principio 04 («recomendaciones inteligentes, cross-selling atractivo») y KPI crítico de cross-selling (35%).
- **Qué pierde el cliente:** el KPI crítico de cross-selling (de 25% a 35%) no tiene una pantalla que lo demuestre con personalización. Hoy el «Hazlo combo» es igual para todos.
- **Recomendación:** en el menú de Diego, una fila «Recomendados para ti» con 3 tarjetas (la etiqueta puede decir «Porque viste el Super Dúo»). En `Pedido`, una línea «Por $1.490 más, súmale una Coca-Cola 1,5 L», calculada contra el precio real. Se simula con Einstein en la propuesta (12 T1).

### 4. La reactivación de Valentina es demasiado tímida · Media · Demo

- **Dónde:** `Home` (Valentina, por defecto) y `Home-Desktop`.
- **Qué pasa:** lo que la trae de vuelta (el correo M3: «Valentina, queremos que vuelvas · Papa Puntos dobles») aparece como una franja de una línea sobre un hero de Halloween, el mismo que vería cualquier visitante.
- **Principio:** kit 02, Valentina: «Banner: propuesta potente de reactivación» y «Home: promoción + best sellers + razones para volver». La promesa del correo debería continuar en la Home, igual que en el caso de Diego con su anuncio.
- **Qué pierde el cliente:** el perfil más difícil (lapsed) es el que mejor muestra que la plataforma reconoce el contexto de entrada. Hoy esa continuidad pasa desapercibida.
- **Recomendación:** que el hero de Valentina lleve la promesa del correo como antetítulo y beneficio («Para tu vuelta · puntos dobles en este pedido», con la cifra: «ganas 46 puntos en vez de 23»), manteniendo la foto del Box Halloween. Sin agregar bloques nuevos.

### 5. La demo no muestra ningún canal fuera de la web · Alta · Demo (decisión)

- **Dónde:** todo el lienzo; el único otro canal es el teléfono del panel (WhatsApp y SMS).
- **Qué pasa:** el kit pide una demostración «concreta y omnicanal» y una plataforma «que se adapte entre Web y App». La App hace ~300.000 órdenes al mes, frente a ~100.000 de la Web. La pregunta A10 sigue abierta.
- **Qué pierde el cliente:** es la brecha más visible de las secciones 01, 04 y 05. Un competidor que muestre la App o un pedido por WhatsApp con el mismo carrito gana ese punto sin discusión.
- **Recomendación:** decidir A10 antes de la demo. El mínimo creíble con el lienzo son dos boards:
  - **«Retomar en la App»**: el carrito abandonado de Diego abierto en la App, con el mismo contenido.
  - **«Seguir por WhatsApp»**: estado del pedido y repetir.

  El resto (Call Center, Tótem, agregadores) va a una lámina de arquitectura: misma API de catálogo, precio y promoción (D12-03).

### 6. Las fechas atan la demo a una semana · Media · Demo

- **Dónde:** Halloween «hasta el 2 de noviembre» (Home, Combo, Ofertas, Dashboard), «Para tu viernes» (Home de Sofía), historial de puntos con fechas de agosto a octubre.
- **Qué pasa:** la fecha de la demo sigue «por definir». Si es después del 2 de noviembre, el hero de toda la tienda muestra una oferta vencida. Si no es viernes, la tarjeta de Sofía suena rara en vivo (el 17-oct es sábado).
- **Recomendación:** fijar la fecha de la demo en `ux-context.md`. Si cae después del 2-nov, cambiar la campaña de temporada (es justo la demostración de «Marketing cambia sin desarrollador»). Cambiar «Para tu viernes» por «Para esta noche».

### 7. El menú de Sofía es el mismo que el de todos · Media · Demo

- **Dónde:** `Menu`, `Menu-Desktop`.
- **Qué pasa:** el kit pide ordenar la exploración de Sofía por historial y afinidad, y dejar las promociones en segundo plano. La Home lo hace, pero el menú no cambia (D7 abierta).
- **Recomendación:** una prop `perfil` en el menú, que para Sofía ponga primero «Tus favoritas» y deje las ofertas al final. Es un cambio de orden, no un diseño nuevo.

## Lo que funciona bien

- **La Home de Sofía es la mejor pantalla del lienzo frente al kit.** Responde punto por punto al orden pedido, sin un 50% genérico arriba. El «Repetir pedido» con total, tienda y tarjeta en el primer viewport es exactamente «te conozco, hagámoslo fácil».
- **La disponibilidad real tiene salida en todos los casos diseñados.** Oferta solo para retiro con cambio en un toque y «Tu combo sigue igual»; ingrediente agotado con sustituto; tienda cerrada con otra tienda. Es lo que el kit llama «sin mostrar ofertas que no se puedan cumplir».
- **El panel del presentador convierte la demo en un recorrido verificable.** Tiene guion numerado por perfil, teléfono con el mensaje real de cada journey y casos sorpresa plegados. Responde a «no buscamos una presentación genérica: queremos recorrer un caso, cambiar condiciones, observar la operación».
- **Las tres razones para volver de Valentina** (puntos desde el primer pedido, seguimiento sin cuenta, pago con Mercado Pago o efectivo) contestan sus miedos sin inventar cuál fue su problema, como pide el kit.
- **El dashboard con vistas por perfil** (negocio, marketing, operación, SAC) cubre el entregable 03.06 sin construir analítica.

## Accesibilidad medida (`audit-dc.js --variants`, 89 variantes)

| Patrón | Medida | Pantallas | Corrección |
|---|---|---|---|
| Contraste de texto e íconos | 0 fallas | Todas | — |
| Chip de puntos en la Home de Sofía | 34 px de alto | `Home-Sofia*` | 44 px: es el acceso a su saldo |
| Botones «Agregar» de favoritas y «Canjear» | 40 a 42 px | Home de Sofía, Checkout, Menú | 44 px en móvil |
| Filtros y categorías del menú | 38 a 43 px | `Menu` | 44 px |
| Etiquetas de 10 a 11 px | «Más vendida», «Solo por Halloween», barra inferior | Home, Menú, Checkout | Subir a 12 px como mínimo |
| Enlace sin nombre accesible | 1 patrón | Menú, Pedido | Agregar `aria-label` |

Nada de esto bloquea la demo. Conviene corregirlo antes de que el área de TI del cliente revise el prototipo.

## Fuera del lienzo: lo que el kit pide y vive en otro entregable

| Pedido | Entregable | Estado |
|---|---|---|
| Campaña de punta a punta en back office (03.1, 04) | 13 Operación | Guion con consolas reales |
| Arquitectura con API Papa Johns, NCR, DispatchTrack | 00 §3 | Corregida (decisión 8) |
| Synerise frente a Marketing Cloud | 00, decisión 1 | **Abierta** (A1, X5) |
| Plan de medición y atribución (03.1) | Propuesta | Pendiente |
| Propuesta económica desglosada (10.6) | Comercial | Pendiente |

## Seguimiento de la revisión contra el kit v1

| v1 | Estado | Comentario |
|---|---|---|
| K1 Synerise | Sigue | A1 y X5 abiertas: es la decisión de mayor riesgo comercial, porque el kit dice que Synerise se queda |
| K2 Invitado para Valentina | Resuelto | «¿No te llega el código?» lleva a invitado conservando el pedido |
| K3 Medios de pago, BIN y Gift Card | Resuelto en parte | Gift Card y descuento por banco en el checkout; los demás medios se dicen en voz alta |
| K4 Comedor | Resuelto | «Comer aquí» en el panel de tienda |
| Pedido después de pagar (ETA, «actualizado hace») | Resuelto | Seguimiento en la Home de Sofía y en la confirmación |
| Casos «¿Qué pasa si…?» elegidos (1, 2, 7, 13, rechazo) | Resuelto | Más el 6 (ingrediente), el 14 (oferta vencida) y la cancelación por OMS |
| Lo que se demuestra fuera de la tienda (panel) | Resuelto | Panel y dashboard |
| PDP con reseñas y popularidad | Resuelto | Con datos de ejemplo (C8) |
| «Recomendados para ti» y «Por $1.500 más» | Sigue | Hallazgo 3 |
| Carro recuperable desde un mensaje | Resuelto | M2 en el panel; falta mostrar el carrito en otro dispositivo (hallazgo 5) |

## Cómo validarlo

- **Hallazgo 1:** pedir a alguien del equipo que no conozca el lienzo que toque el anuncio en el panel y diga qué oferta esperaba ver.
- **Hallazgo 2:** mostrar la ficha a 3 personas de Comercial durante 5 segundos y preguntar si se ve como video y si da hambre, antes y después del material nuevo.
- **Hallazgo 4:** test de 5 segundos con la Home de Valentina: ¿qué gana si pide hoy?

## Anexo · Crítica del skill `ux-review` (modo experimental)

**Aplicado el 17-oct-2026:**
- `audit-dc.js` cruza ahora cada mensaje o anuncio con la pantalla que abre (sección «Promesas»): con el panel anterior marca ✗ el anuncio de Diego, y con el actual lo da por cumplido. Además valida fechas contra la fecha de la demo y agrupa las áreas táctiles por alto.
- Hay un modo «contra brief» en el SKILL.md, con su tabla en `informe.md`.
- Nota sobre el scroll en `fuentes.md` y filas «promesa» y «fecha de la demo» en `heuristicas.md` §12.

Nuevo con el auditor: el SMS «Sofía, ¿lo de siempre? $23.890» abre un checkout que muestra el total con el descuento del banco y nunca el subtotal de $23.890. No es grave, porque paga menos, pero conviene que el checkout muestre «Subtotal $23.890 · Descuento banco −$X» para que el monto del SMS se reconozca.

| Aspecto | Qué pasó | Propuesta de cambio (archivo) |
|---|---|---|
| Lo que detectó bien | La medición estática dejó libre el tiempo para el juicio de fondo. El cruce del contexto de entrada (panel → Home) encontró la promesa rota | — |
| Lo que se le escapó | `audit-dc.js` no cruza los mensajes del panel con la pantalla que abren. El hallazgo 1 salió leyendo el código, no de la herramienta, y las revisiones v1 y v2 no lo vieron | `audit-dc.js`: comparar el título del mensaje (`msg.title`) con el `h1` del board de `href`; `heuristicas.md` §12: «la promesa de cada mensaje o anuncio se cumple en la pantalla que abre» |
| Pedido de tipo «¿cumple el kit?» | El skill trata el kit como una capa más del paso 6, y su informe es de hallazgos. Esta pregunta pedía un veredicto por objetivo | SKILL.md: un modo o variante «contra brief», con tabla de cumplimiento por objetivo antes de los hallazgos; `informe.md`: plantilla de esa tabla |
| Ruido | Las áreas de 40 a 43 px salen en 62 líneas; para una demo pesan poco | `audit-dc.js`: agrupar por patrón (mismo texto y tamaño) en el resumen |
| Pasos que no se pudieron seguir | En «Play full screen» el scroll de la rueda no avanza el board, así que solo se ve el primer viewport | `fuentes.md`: avisar que el resto de la pantalla se revisa desde el código o con capturas por sección |
| Fechas | El auditor lista las fechas, pero no conoce la fecha de la demo ni detecta días de la semana («viernes») | `audit-dc.js`: leer la fecha de `ux-context.md` y marcar fechas vencidas y días de la semana |
