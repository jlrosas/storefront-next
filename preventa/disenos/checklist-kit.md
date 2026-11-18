# Checklist contra el kit del cliente

- **Fecha:** 17-oct-2026 (v1.3: 02.08 revisado y corregido en la revisión contra el kit v2)
- **Kit:** [transcripción completa](../datos/cliente/kit-pj/README.md) de https://cdn.papajohns.cl/kit-pj/index.html y de sus adjuntos. Los IDs de este checklist siguen las secciones del kit (00 a 10) y los del mapa de capacidades (D1-01…).
- **Qué se evaluó:** los diseños (`disenos/NN-*/README.md` y el respaldo del lienzo en `_canvas/`) y la propuesta (`00-propuesta`). No se evaluó el sitio en construcción del sandbox.
- **Relacionado:** [Revisión contra el kit v1](revision-kit-v1.md) (análisis detallado de etapas y escenarios), [Preguntas y supuestos](preguntas-y-supuestos.md).

## Cómo leerlo

| Estado | Significa |
|---|---|
| 🟢 Cumple | Está diseñado en el lienzo o resuelto por escrito en la propuesta |
| 🟡 En parte | Está, pero incompleto, simulado sin decirlo o solo en el Markdown |
| ⚪ Falta | Ni diseñado ni propuesto |
| ➖ Otro entregable | Lo pide el kit, pero no se resuelve con diseño: lo arman Comercial o Técnico en la propuesta |

**Tratamiento en la demo** (decidido el 17-oct-2026: es una demo, el objetivo es que Papa Johns nos vea como el partner correcto, no cumplir todo el kit):

| Tratamiento | Significa |
|---|---|
| Diseñar | El cliente lo ve en una pantalla del lienzo |
| Real | Se muestra en vivo en un sistema real: Commerce (sandbox), Business Manager, Page Designer, Order Management o Marketing Cloud |
| Simular | Se ve, pero lo calcula la demo con reglas reales o datos de ejemplo (Loyalty, Aloha, DispatchTrack); regla en [requerimientos de construcción](requerimientos-demo.md) |
| Explicar | Se cuenta con la arquitectura o una lámina |
| Proyecto | Queda para el proyecto; no cambia la decisión del cliente en la demo |
| Otro entregable | Lo arma Comercial o Técnico (costos, plan, KPIs) |

**Cómo se mantiene:** cuando un diseño cambia, se actualiza aquí el estado del ítem y la fecha. Un ítem pasa a 🟢 solo si se puede mostrar (pantalla del lienzo o párrafo de la propuesta).

## Resumen

| Sección del kit | Ítems | 🟢 | 🟡 | ⚪ | ➖ | Nivel |
|---|---|---|---|---|---|---|
| 00 · El desafío | 40 | 27 | 10 | 3 | 0 | Alto: video simulado, zoom, ocasiones, prueba social y microinteracciones listos; falta fotografía definitiva (C6, C7) |
| 01 · Customer journey | 16 | 7 | 8 | 0 | 1 | Medio: recorrido y OMS listos; omnicanalidad solo con lámina + un momento |
| 02 · Perfiles | 26 | 19 | 5 | 2 | 0 | Alto |
| 03 · Expectativas de propuesta | 18 | 6 | 7 | 1 | 4 | Bajo: casi todo es entregable de la propuesta |
| 04 · Back office | 11 | 4 | 5 | 2 | 0 | Bajo |
| 05 · Ecosistema | 22 | 4 | 9 | 8 | 1 | Bajo: faltan canales, API Papa Johns y NCR |
| 06 · Flujo digital | 12 | 1 | 9 | 2 | 0 | Bajo |
| 07 · Experiencia y diseño | 8 | 6 | 2 | 0 | 0 | Alto |
| 08 · Casos «¿Qué pasa si…?» | 20 | 6 | 8 | 6 | 0 | Medio: los casos elegidos para la demo están; el resto se explica |
| 09 · Indicadores | 9 | 0 | 6 | 2 | 1 | Medio-bajo |
| 10 · La propuesta | 6 | 2 | 2 | 0 | 2 | Medio-bajo |
| Mapa de capacidades | 57 | 24 | 24 | 9 | 0 | Medio |
| **Total** | **245** | **106** | **95** | **35** | **9** | **43% cumple · 39% en parte · 14% falta · 4% otro entregable** |

### Qué tanto cumple la demo

Contando solo lo que **sí entra a la demo** (Diseñar, Simular o Real): 164 ítems.

| Tratamiento | Ítems | 🟢 | 🟡 | ⚪ | ➖ |
|---|---|---|---|---|---|
| Diseñar | 89 | 65 | 23 | 1 | 0 |
| Real | 55 | 36 | 14 | 4 | 1 |
| Simular | 20 | 5 | 13 | 2 | 0 |
| **Demo** | **164** | **106 (65%)** | **50 (30%)** | **7 (4%)** | **1** |
| Explicar | 49 | 0 | 32 | 16 | 1 |
| Proyecto | 24 | 0 | 12 | 12 | 0 |
| Otro entregable | 8 | 0 | 1 | 0 | 7 |

La meta es llevar la fila «Demo» a 🟢 con el [plan de trabajo por diseño](#plan-de-trabajo-por-diseño). Lo marcado «Explicar» se resuelve en la arquitectura de [00 §3](00-propuesta/README.md) y en láminas.

**Lectura para Papa Johns:** la experiencia de compra web por perfil está bien cubierta (secciones 02 y 03 del desafío). Lo que el cliente va a echar de menos primero es lo que puso al principio del kit: **que la tienda dé hambre y sorprenda** (video, movimiento, reseñas, ocasiones por momento). Después, lo que puso en las secciones 05 y 06: **la omnicanalidad** (App, agregadores, Call Center, Tótem, WhatsApp) y **el recorrido técnico de la orden** por API Papa Johns y NCR Cloud Connect.

## Lo más importante que falta (por impacto en la evaluación)

| # | Falta | Secciones | Por qué pesa | Propuesta |
|---|---|---|---|---|
| 1 | **Movimiento y video**: hero y ficha con video corto, zoom en la foto, microinteracciones | 00, 07 | Es la primera frase del kit («que provoque hambre») y la POC «debe sorprendernos» | Componente de video de Page Designer con póster y carga diferida; tres microinteracciones (agregar, puntos, seguimiento) |
| 2 | **Reseñas y señales de popularidad** en ficha y tarjetas | 00, 07 | Prueba social pedida dos veces; el referente es Target | Datos de ejemplo en la demo; en el proyecto, integración de reseñas o desarrollo propio (C8, D36) |
| 3 | **Ocasiones por momento**: almuerzo, partido, celebración, bajón | 00, 02, 07 | Pedido explícito para Diego y en el desafío; el almuerzo es el 11% de las órdenes del día | Bloques programados por hora en Page Designer; el panel del presentador cambia la hora (D34) |
| 4 | **Omnicanalidad**: qué pasa en App, agregadores, Call Center, Tótem y WhatsApp | 01, 04, 05 | El kit pide la demo «concreta y omnicanal»; la App hace el 75% de las órdenes propias | Postura escrita en la propuesta (A10): qué canal consume la misma API de Commerce y cuál se explica con arquitectura |
| 5 | **Recorrido técnico de la orden** con API Papa Johns y NCR Cloud Connect | 05, 06, 10 | El kit lo describe paso a paso; nuestro diagrama va de OMS directo a Aloha | Corregir la arquitectura de 00 §3 y dibujar la secuencia (A11) |
| 6 | **Disponibilidad real** (promoción e ingrediente no disponibles, tienda saturada) | 00, 08 | «Disponibilidad real» está en el desafío y en 5 de los 20 casos | Diseñar casos 2 y 6 (ya marcados para la demo) |
| 7 | **Demo del back office**: cambio comercial → aprobación → publicación → impacto en la orden | 03, 04 | Es la primera tarea de la POC | Guion en Business Manager y Page Designer (ampliar 12) |
| 8 | **Comedor, Gift Card y BIN** | 01, 05, D5 | Están en el journey, el mapa de capacidades y la volumetría («BIN: requerimiento funcional obligatorio») | D31 y D32 |
| 9 | **Consentimiento y datos personales** | 01, D8, D13 | Must-have en el mapa de capacidades | Aviso de cookies y permisos en el ingreso con código |
| 10 | **Live dashboard** | 03 | Entregable explícito con «alertas, umbrales y vistas por perfil» | Tablero simulado en la demo (12) |

## Plan de trabajo por diseño

Orden de prioridad según lo que más mueve la evaluación. Cada cambio: MD → lienzo → `_canvas/`, y la regla de cálculo en [requerimientos](requerimientos-demo.md).

| Prioridad | Diseño | Cambios | Pantallas | Cierra |
|---|---|---|---|---|
| 1 | 04 Agregar al carro | Ficha: video y zoom, foto → descripción → precio, reseñas, popularidad, destacados, preguntas frecuentes, disponibilidad; hoja con ingrediente agotado; microinteracción «al carro» | `PDP-Mobile`, `PDP-Desktop`, `Sheet-Pizza` | 00.01–00.09, 00.26, 00.28–00.29, 00.33, 00.37, 08.06 |
| 1 | 01 Home | Video en el hero; Diego con «Para 3» y ocasión por hora (almuerzo, partido, celebración, bajón); aviso de cookies | `Home-Diego` y escritorio (prop `hora`), `Home` | 00.11–00.15, 02.09–02.10, D8-04 |
| 2 | 08 Seguimiento | ETA y «actualizado hace»; estados de OMS; cancelación parcial con reembolso y puntos | `Confirmacion-Delivery`, nueva `Seguimiento-Cancelacion` | 05.22, 01.09 |
| 2 | 13 Operación | Guion OMS y back office (consolas reales) | — | 01.01, 03.09, 04.11, 03.12 |
| 3 | 05 Tienda | Comedor; tienda cerrada → otra tienda | `Tienda` | 01.04, 08.01 |
| 3 | 07 Checkout | BIN, Gift Card, «Pagando…» | `Checkout`, `Checkout-Sofia` | 01.07, 08.11, D5-03 |
| 3 | 10 Ofertas | Promoción no disponible; oferta vencida | `Combo` (prop `estado`), nueva `Oferta-Vencida` | 08.02, 08.14 |
| 3 | 11 Cuenta | «¿No te llega el código?» → invitado; permisos de marketing | `Login` | 08.13, D8-04 |
| 4 | 12 Marketing y demo | Panel: hora, OMS, casos sorpresa, momento WhatsApp; dashboard en vivo; guion de 15 min | `Panel-Demo`, nueva `Dashboard-Demo` | 03.14, 10.04 |
| 5 | 06 Carrito | «Te faltan $X» o «Por $1.500 más» | `Pedido` | 02.15 |
| 5 | 02 Menú | Estrellas y popularidad en tarjetas | `Menu`, `Menu-Desktop` | 00.29, 07.04 |

---

## 00 · El desafío

### Pilar 01 · Hacer que entre por los ojos

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 00.01 | Fotografía hero | 🟡 | Diseñar | Fotos a sangre y en primer plano en Home, menú y ficha (revisión UX R1). Son recortes de campañas: faltan las tomas sin texto (C6) |
| 00.02 | Video | 🟢 | Diseñar | Video simulado (movimiento lento de la foto con pausa) en ficha y hero; MP4 real cuando el cliente entregue material (C7) |
| 00.03 | Zoom | 🟢 | Diseñar | Lupa en la ficha (móvil y escritorio) |
| 00.04 | Textura | 🟡 | Diseñar | Primeros planos de queso estirado; falta tratamiento de textura en la ficha |
| 00.05 | Ingredientes | 🟢 | Diseñar | Ingredientes con foto en la hoja y la ficha (R5) |
| 00.06 | Preparación | ⚪ | Proyecto | No se muestra cómo se hace la pizza (horno, masa); sin contenido del cliente |
| 00.07 | Movimiento | 🟢 | Diseñar | Movimiento en hero y ficha, respeta «reducir movimiento» |
| 00.08 | Caliente, abundante y recién hecha | 🟡 | Diseñar | Acento cálido y textos sensoriales (R2, R4); depende de la fotografía definitiva |
| 00.09 | La PDP genera antojo antes de hablar de precio | 🟢 | Diseñar | Ficha: foto → nombre → ★ → descripción → destacados; el precio va en tamaño y botón (D35) |

### Pilar 02 · Que el sitio entienda el momento

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 00.10 | Adaptarse a Heavy, Switcher y Non Buyer | 🟢 | Diseñar | Home por perfil (01), checkout y confirmación por cliente (07, 08) |
| 00.11 | Ocasión: almuerzo | 🟢 | Diseñar | Home de Diego: bloque Almuerzo según la hora (R4.2) |
| 00.12 | Ocasión: partido | 🟢 | Diseñar | Home de Diego: bloque Partido |
| 00.13 | Ocasión: celebración | 🟢 | Diseñar | Home de Diego: bloque Celebración (Halloween) |
| 00.14 | Ocasión: familia | 🟡 | Diseñar | «Para 4» y «Para 6 o más» con Super Dúo y Super Trío; sin bloque «familia» |
| 00.15 | Ocasión: bajón | 🟢 | Diseñar | Home de Diego: bloque Bajón |
| 00.16 | Ocasión: recompra | 🟢 | Diseñar | «¿Lo de siempre?» y Repetir (Sofía) |
| 00.17 | Banner y módulos cambian con intención | 🟢 | Diseñar | Hero y bloques por perfil; hero de temporada (Halloween) |
| 00.18 | Menú cambia con intención | 🟡 | Diseñar | Ofertas arriba para Diego; el orden por historial o afinidad sigue abierto (D7) |
| 00.19 | Recomendaciones cambian con intención | 🟡 | Diseñar | Einstein en la propuesta (12 T1); en pantalla solo «Completa tu pedido» y favoritas |

### Pilar 03 · Hacer tremendamente fácil decidir

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 00.20 | «Para 2», «para 4» | 🟢 | Diseñar | Ocasiones de Diego y filtro por ocasión en Ofertas (10) |
| 00.21 | «Más pedido» | 🟢 | Diseñar | Etiqueta en Home, menú, hoja y ficha |
| 00.22 | «Tu favorito» | 🟢 | Diseñar | Favoritas de Sofía («La pediste 6 veces») |
| 00.23 | «Mejor combinación» | 🟡 | Diseñar | «Hazlo combo» y «Conviértelo en combo»; sin maridajes («va bien con…») |
| 00.24 | Precio final claro | 🟢 | Diseñar | Total en vivo en el botón; antes/ahora con ahorro |
| 00.25 | Personalización simple | 🟢 | Diseñar | Hoja con valores preseleccionados, mitades con fotos |
| 00.26 | Disponibilidad real | 🟢 | Diseñar | Ingrediente agotado con sustituto (ficha y hoja) y promoción solo para retiro con alternativa |
| 00.27 | Menos pasos hasta el carrito | 🟢 | Diseñar | Un toque desde el listado; tienda al agregar |

### Pilar 04 · Crear una experiencia que se recuerde

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 00.28 | Reviews | 🟢 | Simular | ★ 4,7 · 1.240 opiniones, distribución y opiniones con compra verificada (datos de ejemplo, D36) |
| 00.29 | Señales de popularidad | 🟢 | Simular | «Pedida 320 veces esta semana» en ficha y ★ con pedidos de la semana en las más pedidas |
| 00.30 | Contenido editorial | 🟡 | Proyecto | Textos sensoriales; la descripción editorial de la ficha es un marcador (C5) |
| 00.31 | Recomendaciones inteligentes | 🟡 | Diseñar | Ver 00.19 |
| 00.32 | Cross-selling atractivo | 🟢 | Diseñar | «Hazlo combo» con ahorro; máximo dos momentos (R6, R7) |
| 00.33 | Microinteracciones | 🟢 | Diseñar | Al agregar: la pizza vuela al carro, el contador salta y aparecen los puntos; botón «Pagando…» |
| 00.34 | Loyalty | 🟢 | Simular | Papa Puntos en cada paso, página, cuenta y canje (09) |
| 00.35 | Recompra | 🟢 | Diseñar | Repetir, Mi cuenta, recordatorio (01, 08, 11) |
| 00.36 | Postventa | 🟢 | Diseñar | Confirmación, seguimiento siempre visible, opinión (08, 01 v3) |

### Referente (Target) y mandato

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 00.37 | Alrededor del producto: ratings, highlights, disponibilidad, alternativas de fulfillment, Q&A, recomendaciones | 🟢 | Diseñar | Ficha con calificaciones, destacados, disponibilidad, tiempo de retiro, preguntas frecuentes y «Completa tu pedido» |
| 00.38 | Pizza → deseo → decisión → relación recurrente | 🟡 | Diseñar | Decisión y relación recurrente bien resueltas; el deseo depende de 00.01 a 00.09 |
| 00.39 | Visual, emocional, personalizada, rápida y comercialmente inteligente | ⚪ | Real | «Rápida» sin evidencia: no hay medición de carga (meta < 2,5 s); el resto en 🟡 por el pilar 01 |
| 00.40 | «La POC debe sorprendernos», no una evolución de lo que tienen | ⚪ | Diseñar | Sin un elemento distintivo que no exista hoy en papajohns.cl o Melt; los candidatos son 00.02, 00.07 y 00.11 a 00.15. La propuesta no menciona el desafío (se agrega el principio 9) |

---

## 01 · Customer journey

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 01.01 | Preparación de campaña en back office | 🟢 | Real | Guion en Business Manager y Page Designer (13 · Operación, guion A) |
| 01.02 | Entradas: conservar fuente, campaña, anuncio, deep link, dispositivo, cliente y canal, y usarlos para decidir qué mostrar | 🟡 | Diseñar | Regla de perfil por `utm_campaign` y URL de oferta (01 regla 5); falta landing de campaña y continuidad Web ↔ App |
| 01.03 | Reconocimiento: datos, CRM, consentimiento y funcionamiento sin reconocer | 🟡 | Diseñar | Perfiles y vista por defecto (Valentina); falta consentimiento y la decisión de CRM (X5) |
| 01.04 | Selección de entrega: Delivery, Pick Up, comedor; cambiar sin perder | 🟡 | Diseñar | Retiro, delivery y comer aquí (05); falta mostrar lo recalculado al cambiar |
| 01.05 | Exploración: catálogo, combos, mitades, disponibilidad | 🟡 | Diseñar | Menú v3, mitades, constructor; falta producto no disponible |
| 01.06 | Carro y beneficios: cupón, puntos, incompatibilidades, carro recuperable | 🟡 | Real | Canje y combo; falta error de cupón y la vuelta desde el mensaje (M2 en 12, sin pantalla) |
| 01.07 | Checkout y pago: medios por tienda, BIN, Gift Card, rechazo sin perder ni duplicar | 🟢 | Diseñar | Mercado Pago, efectivo, BIN, Gift Card, rechazo con salida y «Pagando…» sin doble pago |
| 01.08 | Procesamiento y despacho: Ecommerce → API Papa Johns → NCR → tienda → despacho | 🟡 | Explicar | Secuencia en 00 §3; en la demo el presentador hace de tienda en OMS (13) |
| 01.09 | Postventa: eventos al cliente, contexto para SAC, NPS, orden con problemas | 🟢 | Real | OMS real: cancelación parcial con devolución y puntos; vista del pedido para SAC (13, guion B) |
| 01.10 | Recompra omnicanal con precios y disponibilidad actualizados | 🟢 | Diseñar | Repetir de Sofía y Mi cuenta; falta el aviso «algo cambió» |
| 01.11 | Demostración concreta y **omnicanal**: Web, App, agregadores, Call Center, Tótem, WhatsApp | 🟡 | Explicar | Lámina + el mensaje de WhatsApp que abre el mismo carrito en el celular (12, M2) |
| 01.12 | Explicar arquitectura, sistemas, datos y dependencias | 🟡 | Explicar | 00 §3; incompleta frente al ecosistema del kit |
| 01.13 | Mostrar cómo se administran catálogo, precios, campañas, promociones y reglas | 🟢 | Real | Guion A de 13 |
| 01.14 | Continuidad entre canales y modalidades, con errores, reintentos y SAC | 🟢 | Diseñar | Rechazo de pago, cambio de modalidad, seguimiento; dentro de la web |
| 01.15 | Conservar identidad, carrito, promociones y contexto al pasar de un canal a otro | 🟢 | Diseñar | Carrito conservado al ingresar con código y al elegir tienda; entre canales, ver 01.11 |
| 01.16 | Alcance, supuestos, responsabilidades, esfuerzo, inversión y etapas | ➖ | Otro entregable | Comercial |

## 02 · Personajes y perfiles

| ID | Perfil · paso | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 02.01 | Sofía · Entrada «Hola Sofía» | 🟢 | Diseñar | Home Sofía |
| 02.02 | Sofía · Home: Repetir → Favoritos → Puntos → Beneficios → Recomendaciones | 🟢 | Diseñar | Home Sofía (antes, en curso, después) |
| 02.03 | Sofía · Sin 50% genérico dominando | 🟢 | Diseñar | Promos en segundo plano |
| 02.04 | Sofía · Exploración por historial, afinidad, horario, modalidad | 🟡 | Diseñar | Favoritas en Home; menú sin orden por perfil (D7) |
| 02.05 | Sofía · Carrito y checkout con dirección, tienda, pago preferido, puntos | 🟢 | Diseñar | `Checkout-Sofia`, canje |
| 02.06 | Sofía · Post compra: historial → preferencias → puntos → frecuencia → próxima mejor acción | 🟢 | Diseñar | Home «después», recordatorio |
| 02.07 | Sofía · PDP producto protagonista; CTA recompra | 🟢 | Diseñar | Ficha y Home |
| 02.08 | Diego · Entrada: mantener la promesa del anuncio | 🟢 | Diseñar | Anuncio T2 del panel (Super Dúo) = «La oferta que viste» de la Home Diego; corregido en la [revisión kit v2](revision-kit-v2.md), hallazgo 1 |
| 02.09 | Diego · Home: Para 2 → Para 3 → Para 4 | 🟢 | Diseñar | Para 1, 2, 3, 4 y 6+ |
| 02.10 | Diego · Home: Almuerzo → Partido → Celebración → Bajón | 🟢 | Diseñar | Almuerzo, partido, celebración y bajón en la Home de Diego |
| 02.11 | Diego · Contestar «¿Qué necesitas resolver ahora?» | 🟢 | Diseñar | «¿Para cuántos?» |
| 02.12 | Diego · Exploración: promos arriba, más vendidos | 🟢 | Diseñar | Menú v3 y Home Diego |
| 02.13 | Diego · «Recomendados para ti» | ⚪ | Simular | No está en pantalla (12 T1) |
| 02.14 | Diego · Buena relación precio/cantidad | 🟡 | Diseñar | Ahorro en pesos en ofertas; falta comparar precio por persona |
| 02.15 | Diego · Carrito: «Por $1.500 más agrega bebida», «Te faltan $X para…», «Completa tu combo» | 🟡 | Diseñar | «Conviértelo en combo» sí; faltan los otros dos mensajes |
| 02.16 | Diego · Post compra: CRM → puntos → recompra, moverlo a Heavy | 🟡 | Simular | Bienvenida M7 en 12, sin pantalla |
| 02.17 | Diego · PDP precio + producto + conveniencia; CTA «esto te conviene ahora» | 🟢 | Diseñar | Constructor y ofertas |
| 02.18 | Valentina · Entrada «Queremos que vuelvas…» sin ser invasivo | 🟢 | Real | Home Valentina; correo de reactivación M3 (12) |
| 02.19 | Valentina · Home: promos, best sellers, novedades, beneficios del canal, Delivery/Pick Up | 🟢 | Diseñar | Home Valentina |
| 02.20 | Valentina · Exploración: tamaño → cantidad → ingredientes → precio → para cuántos | 🟢 | Diseñar | Hoja y etiquetas |
| 02.21 | Valentina · Etiquetas «Más pedido», «Favorito», «Recomendado», «Ideal para 2», «Novedad» | 🟢 | Diseñar | Home y menú |
| 02.22 | Valentina · Entrega: Delivery, Pick Up o comedor con costos y tiempos antes | 🟢 | Diseñar | Retiro, delivery y comer aquí con estado del comedor |
| 02.23 | Valentina · Checkout como invitada, sin sorpresas | 🟡 | Diseñar | `Checkout-Invitado` existe, fuera de la demo (D30) |
| 02.24 | Valentina · Post compra: estado, incidencias, feedback, loyalty | 🟢 | Diseñar | Confirmación y seguimiento |
| 02.25 | Mindset: cambia lo que ven, el orden, lo que no ven, cómo les hablamos, el beneficio y los pasos | 🟢 | Diseñar | Una portada con parámetro de perfil |
| 02.26 | «El ecommerce se adapta al cliente» también en el menú y las tarjetas | ⚪ | Proyecto | Menú y tarjetas iguales para los tres perfiles |

## 03 · Expectativas de propuesta

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 03.01 | Marketing: SEO, ads, email, push, WhatsApp, QR, landings, deep links, Web ↔ App | 🟡 | Explicar | URL por oferta, journeys de 12; sin landing de campaña, QR ni Web ↔ App |
| 03.02 | Plan de atribución por fuente (impresiones a recompra, CAC, ROAS) | ➖ | Otro entregable | Comercial |
| 03.03 | Segmentación por campaña, dispositivo, geografía, perfil, canal y modalidad | 🟡 | Explicar | Por perfil y campaña; el resto no |
| 03.04 | Línea base, fórmula, fuente, período y meta por indicador | ➖ | Otro entregable | Comercial |
| 03.05 | Comercial administra Arma tu Combo, productos, variantes, precios, cupones, BIN, Gift Cards, Papa Puntos | 🟡 | Real | Todo menos BIN y Gift Card (00 §7) |
| 03.06 | No mostrar ofertas que no se puedan cumplir | 🟢 | Diseñar | Constructor avisa que la oferta es solo para retiro y ofrece alternativa (caso 2) |
| 03.07 | Medir ventas, ticket y aporte de promociones y recomendaciones | 🟡 | Explicar | KPIs mapeados en revisión kit §5 |
| 03.08 | Roles y permisos; previsualización, aprobación, programación, historial, reversa | ⚪ | Real | No escrito (Business Manager lo trae: hay que mostrarlo) |
| 03.09 | Demo del CMS y Backoffice | 🟢 | Real | Guion A de 13 (Business Manager y Page Designer, en vivo) |
| 03.10 | Continuidad de datos, carro y contexto entre etapas y canales | 🟡 | Explicar | Entre etapas sí; entre canales no |
| 03.11 | FAQs de Papa Puntos: elegibilidad, acreditación, vigencia, mínimos, compatibilidad, devolución por cancelación | 🟡 | Proyecto | Página 09 con tres reglas; faltan las FAQ y la vigencia (D18) |
| 03.12 | Dar paso a SAC cuando la consulta lo requiera | 🟢 | Real | Opinión baja abre caso; vista de servicio en OMS (13) |
| 03.13 | Arquitectura, secuencias y plan de integración | 🟡 | Explicar | 00 §3 con API Papa Johns, NCR y secuencia; falta el plan de integración |
| 03.14 | Live dashboard con alertas, umbrales y vistas por perfil | 🟢 | Diseñar | `Dashboard-Demo`: vistas por perfil, alertas, pedidos por hora y embudo (datos de ejemplo) |
| 03.15 | POC 1 · Configurar una campaña y sus reglas | 🟢 | Real | Guion A de 13 |
| 03.16 | POC 2 · Seguir una visita hasta el checkout y la orden | 🟢 | Real | Guion de 12 minutos (12) |
| 03.17 | POC 3 · Excepciones, recuperación y respuesta de SAC | ➖ | Real | Diseño de casos en 08; la respuesta de SAC depende de X5 y Zendesk |
| 03.18 | POC 4 y 5 · KPIs, alcance, fases, costos y propuesta económica desglosada | ➖ | Otro entregable | Comercial |

## 04 · Datos maestros y back office

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 04.01 | Productos y catálogo con identificadores Aloha | 🟡 | Explicar | Catálogo con variantes y opciones; falta el mapeo a Aloha |
| 04.02 | Menú, precios y disponibilidad por tienda, canal y modalidad; cambios masivos; quiebres | 🟡 | Explicar | Por tienda sí; canal, quiebres y agregadores no |
| 04.03 | Promociones y reglas sin depender de desarrollo | 🟢 | Real | Motor de promociones (00 §4) |
| 04.04 | Cupones, Gift Cards y Loyalty con validación de saldo | 🟡 | Real | Sin Gift Card |
| 04.05 | Configuración de tiendas: dirección, horarios, menú, modalidad, cobertura, pagos, estado | 🟢 | Real | Objeto Store (05) |
| 04.06 | Canales y omnicanalidad desde una misma lógica | ⚪ | Explicar | Ver 01.11 |
| 04.07 | Pagos e integraciones por tienda | 🟡 | Explicar | Efectivo por tienda (07) |
| 04.08 | Pedidos y última milla: Delivery, Pick Up, futuros, incidencias | 🟢 | Real | OMS real: estados, cancelación y devolución (13) |
| 04.09 | Roles, auditoría y rollback | ⚪ | Real | Ver 03.08 |
| 04.10 | Reportería por tienda, canal, producto y promoción con NPS y SAC | 🟡 | Simular | Dashboard simulado con vistas por perfil; sin conexión a NPS real |
| 04.11 | Demostrar: cambio comercial → aprobación → publicación → impacto en orden → trazabilidad | 🟢 | Real | Guion A de 13: promoción → hero programado → pedido → OMS |

## 05 · Ecosistema

| ID | Sistema | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 05.01 | Web Papa Johns | 🟢 | Real | Storefront Next |
| 05.02 | App Papa Johns | ⚪ | Explicar | La propuesta no dice si la App consume Commerce (A10) |
| 05.03 | Agregadores | ⚪ | Explicar | No mencionados |
| 05.04 | Call Center | ⚪ | Explicar | No mencionado |
| 05.05 | WhatsApp | 🟡 | Real | Como canal de mensajes de Marketing Cloud (12); no como canal de venta |
| 05.06 | Ecommerce Core, Users, Orders, Middleware | 🟡 | Explicar | Commerce reemplaza Core, Users y Orders; no está escrito qué pasa con el Middleware |
| 05.07 | Webpay | ⚪ | Explicar | D31 |
| 05.08 | Mercado Pago | 🟢 | Real | Bricks (07) |
| 05.09 | Fintoc | ⚪ | Explicar | D31 |
| 05.10 | Tarjetas alimentarias (Pluxee) | ⚪ | Explicar | D31 |
| 05.11 | Billeteras digitales (GPay, Apple Pay) | ⚪ | Explicar | D31 |
| 05.12 | Efectivo y tarjeta contra entrega (diagrama de flujo) | 🟡 | Diseñar | Efectivo sí; tarjeta contra entrega no |
| 05.13 | API Papa Johns | 🟡 | Explicar | En la arquitectura y la secuencia de 00 §3 (A11) |
| 05.14 | API NCR Cloud Connect | 🟡 | Explicar | En la arquitectura y la secuencia de 00 §3 (A11) |
| 05.15 | Aloha / OMS | 🟡 | Simular | OMS → Aloha en 00 §3 |
| 05.16 | DispatchTrack | 🟡 | Simular | DispatchTrack → OMS en 00 §3 |
| 05.17 | Synerise (CRM, Loyalty, CDP) | 🟡 | Explicar | Convivencia por definir (X5, A1, A3) |
| 05.18 | Zendesk | 🟡 | Explicar | Línea punteada en 00 §3 |
| 05.19 | Tienda: Tótem, NCR POS, KDS, servidor | ➖ | Explicar | Se quedan; los eventos de KDS alimentan el seguimiento |
| 05.20 | Quick Commerce, flota propia y externa (Peya Envíos, Uber Direct, Rappi) | ⚪ | Explicar | No mencionados |
| 05.21 | Backoffice | 🟢 | Real | Business Manager y Page Designer |
| 05.22 | Seguimiento «Pedido en camino · ETA 18 min · actualizado hace 1 min» | 🟢 | Diseñar | «Llega en 18 min · actualizado hace 1 min» (08) |

## 06 · Flujo digital

| ID | Paso | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 06.01 | Cliente y canales inician la orden | 🟡 | Explicar | Solo web |
| 06.02 | Ecommerce valida disponibilidad y calcula tiempos dinámicos y ETA | 🟡 | Simular | Tiempos fijos por tienda (`c_pickupMinutes`); sin ETA dinámico |
| 06.03 | Pasarelas autorizan antes de confirmar la orden | 🟡 | Real | Mercado Pago; resto D31 |
| 06.04 | API Papa Johns crea y coordina la orden | 🟡 | Simular | Secuencia en 00 §3 (A11) |
| 06.05 | NCR Cloud Connect deriva a tienda | 🟡 | Simular | Secuencia en 00 §3 (A11) |
| 06.06 | Tienda prepara (Aloha, POS, KDS) | ⚪ | Simular | Fuera de nuestro alcance; falta decir cómo vuelve el estado |
| 06.07 | Eventos de tienda actualizan el estado | 🟡 | Simular | Estados reales de OMS; eventos de cocina simulados |
| 06.08 | DispatchTrack sincroniza el despacho y el enlace de seguimiento | 🟡 | Simular | En la arquitectura; sin enlace de seguimiento propio |
| 06.09 | Quick Commerce asigna flota | ⚪ | Explicar | No mencionado |
| 06.10 | Entrega y notificación | 🟡 | Simular | Estado «Entregado» y SMS (08, 12) |
| 06.11 | Eventos vuelven a la experiencia y a SAC | 🟢 | Real | Seguimiento siempre visible; opinión que abre caso |
| 06.12 | CRM y fidelización con Synerise | 🟡 | Explicar | X5 |

## 07 · Experiencia digital y diseño

| ID | Criterio | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 07.01 | Food first: fotografía, video, zoom, textura, ingredientes, movimiento | 🟢 | Diseñar | Fotos en primer plano, video simulado, zoom, ingredientes con foto, movimiento |
| 07.02 | Jerarquía inteligente y siguiente mejor acción | 🟢 | Diseñar | Un CTA principal por pantalla; próxima mejor acción de Sofía |
| 07.03 | Personalización visible en banners, módulos, menú, promociones y tarjetas | 🟡 | Diseñar | Banners y módulos sí; menú y tarjetas no (02.26) |
| 07.04 | PDP enriquecida: popularidad, recomendaciones, reviews, contenido que ayude a decidir | 🟢 | Diseñar | Ficha v3 (04) |
| 07.05 | Diseño por ocasión | 🟢 | Diseñar | Ocasiones por hora y por tamaño de grupo |
| 07.06 | Microinteracciones con intención | 🟢 | Diseñar | Al agregar, contador, aviso de puntos, «Pagando…» |
| 07.07 | Mobile first, rápido y accesible, en App y Web | 🟡 | Real | Mobile first sí; sin medición de velocidad ni accesibilidad; sin App |
| 07.08 | Propuesta visual y prototipo navegable («se siente como el nuevo Papa Johns») | 🟢 | Diseñar | Lienzo con pantallas enlazadas por perfil; sitio en el sandbox en construcción |

## 08 · Casos «¿Qué pasa si…?»

Estado tomado de la [revisión contra el kit v1](revision-kit-v1.md) §3. La columna «Demo» es la recomendación de esa revisión.

| ID | Caso | Estado | Tratamiento | Demo | Qué falta |
|---|---|---|---|---|---|
| 08.01 | Tienda cerrada o fuera de horario | 🟢 | Diseñar | Sí | Providencia cerrada: El Bosque o programar (05) |
| 08.02 | Promoción no disponible en la tienda | 🟢 | Diseñar | Sí | `Combo-NoDisponible` (10) |
| 08.03 | Monto mínimo de delivery | ⚪ | Proyecto | No | Faltante exacto, sugerencia o cambio a retiro |
| 08.04 | Carrito expirado o con cambios | ⚪ | Proyecto | No | Revalidar y mostrar diferencias |
| 08.05 | Cambio de delivery a retiro | 🟡 | Proyecto | Opcional | Mostrar lo recalculado |
| 08.06 | Ingrediente no disponible | 🟢 | Diseñar | Opcional | Champiñón agotado con sustituto (04) |
| 08.07 | Error en la personalización | 🟡 | Diseñar | Sí | El armador solo ofrece mitades válidas |
| 08.08 | Papa Puntos no disponibles | 🟡 | Proyecto | No | Producto sin stock para canje |
| 08.09 | Cupón vencido, usado o inválido | ⚪ | Proyecto | Opcional | Mensaje con la causa |
| 08.10 | Pago aprobado, orden no confirmada | ⚪ | Explicar | Explicarlo | Conciliación |
| 08.11 | Doble clic o pedido duplicado | 🟢 | Diseñar | Explicarlo | «Pagando… no cierres esta página» (07) |
| 08.12 | Medio de pago no disponible | 🟡 | Proyecto | No | Filtrar por tienda |
| 08.13 | Fallo en login | 🟢 | Diseñar | Sí | «¿No te llega el código?» → reenviar, correo o invitada (11) |
| 08.14 | Deep link roto | 🟢 | Diseñar | Opcional | `Oferta-Vencida` (10) |
| 08.15 | Tiempo prometido cambia durante la compra | 🟡 | Simular | Opcional | Mensaje de cambio de hora desde el panel; falta aviso dentro del checkout |
| 08.16 | Delivery saturado | ⚪ | Explicar | Opcional | Retiro, otra tienda o programar |
| 08.17 | Quiebre parcial del checkout | 🟡 | Explicar | No | Loyalty o promoción caída |
| 08.18 | Dirección ambigua | 🟡 | Proyecto | No | Corrección manual en mapa |
| 08.19 | Pedido futuro no disponible | 🟡 | Proyecto | No | La restricción |
| 08.20 | Servicio caído en peak | ⚪ | Explicar | Explicarlo | Página de contingencia y cola |

## 09 · Indicadores de éxito

| ID | Pide el kit | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 09.01 | CVR total 25% (Web 18%; hoy Web ~14% según la volumetría) | 🟡 | Explicar | Revisión kit §5: qué del diseño lo empuja; sin plan para pasar de 14% a 18% |
| 09.02 | Bounce < 30% | 🟡 | Explicar | Comida y oferta en la primera pantalla |
| 09.03 | Pago aprobado > 97% | 🟡 | Explicar | Rechazo con salida |
| 09.04 | Uptime > 99,9% | ➖ | Otro entregable | Técnico (SLA de la plataforma) |
| 09.05 | Cross-selling 35% (hoy ~25%) | 🟡 | Explicar | «Hazlo combo»; recomendaciones sin pantalla |
| 09.06 | Tiempo de carga < 2,5 s | ⚪ | Real | Sin medición en el sandbox |
| 09.07 | A/B testing > 2 tests por mes | ⚪ | Explicar | Herramienta sin definir (A5) |
| 09.08 | Indicadores de gestión mapeados al diseño | 🟡 | Explicar | 9 de 50 en revisión kit §5 |
| 09.09 | Fórmula, fuente, línea base y responsable por indicador | 🟡 | Otro entregable | Comercial; el diseño aporta qué lo mueve |

## 10 · La propuesta

| ID | Entregable | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|
| 10.01 | Journey de nuestros clientes | 🟢 | Diseñar | Diseños 01 a 12 y guion de la demo |
| 10.02 | Arquitectura e integraciones | 🟡 | Explicar | 00 §3, a corregir (A11) |
| 10.03 | Flujo técnico de la orden | 🟡 | Explicar | Secuencia en 00 §3 |
| 10.04 | Demo con eventos sorpresa | 🟢 | Diseñar | Panel con casos sorpresa (1, 2, 13, 14, ETA) y guion |
| 10.05 | Plan de implementación | ➖ | Otro entregable | Comercial y Técnico |
| 10.06 | Propuesta económica desglosada | ➖ | Otro entregable | Comercial |

## Mapa de capacidades (adjunto del kit)

Estado frente a la propuesta (00 §7) y los diseños. Prioridad según el kit.

| ID | Capacidad | Prioridad | Estado | Tratamiento | Dónde está / qué falta |
|---|---|---|---|---|---|
| D1-01 | Contenido web y landing pages sin TI, por segmento | Must | 🟢 | Real | Page Designer con visibilidad por grupo (01) |
| D1-02 | Navegación y taxonomía | Must | 🟢 | Real | Menú v3 (02) |
| D1-03 | Búsqueda con autocompletado | Should | 🟡 | Proyecto | Buscador nombrado en 02 y 00 §6; sin diseño |
| D1-04 | Banners promocionales dinámicos por contexto | Should | 🟢 | Real | Hero por perfil y de temporada |
| D1-05 | Atención conversacional embebida (chat/WhatsApp) | Should | ⚪ | Proyecto | Sin diseño |
| D2-01 | Catálogo maestro y SKU | Must | 🟢 | Real | Commerce (00 §7) |
| D2-02 | Variantes (tamaño, masa) | Must | 🟢 | Real | Hoja y selector de tamaño |
| D2-03 | Precios por variante, canal y tienda | Must | 🟡 | Explicar | Por tienda sí; por canal no tratado |
| D2-04 | Etiquetas y badges | Nice | 🟢 | Real | `c_badges` (02) |
| D2-05 | Campañas de co-branding y licencias | Nice | 🟡 | Proyecto | Box Halloween como línea temática con vigencia; sin co-branding |
| D3-01 | Configurador con reglas | Must | 🟢 | Real | Hoja «Arma tu pizza» |
| D3-02 | Precio en tiempo real por configuración | Must | 🟢 | Real | Total en el botón |
| D3-03 | Productos compuestos (mitades, combos) | Should | 🟢 | Real | Armador de N partes, constructor de combos |
| D3-04 | Nutrición y alérgenos por configuración | Should | 🟡 | Proyecto | Marcador en la ficha (C5) |
| D4-01 | Carrito persistente entre dispositivos | Must | 🟡 | Explicar | En sesión y al ingresar; entre dispositivos no tratado |
| D4-02 | Reglas de precio y descuento auditables | Must | 🟢 | Real | Motor de promociones |
| D4-03 | Cupones de un solo uso o campaña | Must | 🟡 | Real | Cupón en checkout; sin mensajes de error |
| D4-04 | Bundles y combos | Must | 🟢 | Real | Constructor y «Conviértelo en combo» |
| D4-05 | Upsell y cross-sell | Should | 🟢 | Real | Hoja y carrito |
| D5-01 | Checkout invitado o registrado con consentimientos | Must | 🟡 | Real | Registrado en la demo, invitado alternativo; sin consentimientos |
| D5-02 | Múltiples medios de pago | Must | 🟡 | Explicar | Mercado Pago y efectivo (D31) |
| D5-03 | Gift Cards | Should | 🟢 | Diseñar | Gift Card en el checkout (07) |
| D5-04 | Costo de envío en tiempo real | Must | 🟢 | Real | Panel de delivery (05) |
| D5-05 | Registro de consentimientos de compra | Must | ⚪ | Proyecto | Términos en una línea, sin registro |
| D6-01 | Enrutamiento de pedidos (OMS) | Must | 🟡 | Real | OMS fase 2; tienda asignada por dirección |
| D6-02 | Seguimiento en tiempo real | Must | 🟡 | Real | Diseñado; estados simulados |
| D6-03 | Agendamiento | Should | 🟡 | Diseñar | «Programar» en el panel; sin restricciones |
| D6-04 | Cancelaciones y reversas (pago y puntos) | Must | 🟢 | Real | Cancelación parcial con devolución y puntos en OMS (13) |
| D6-05 | Historial y recompra en un clic | Should | 🟢 | Real | Mi cuenta, Repetir |
| D7-01 | Directorio y ficha de tienda | Must | 🟡 | Proyecto | Panel con dirección y «Cómo llegar»; sin ficha ni teléfono |
| D7-02 | Zonificación de cobertura | Must | 🟡 | Simular | Asignación automática en el diseño; servicio por integrar |
| D7-03 | Horarios por tienda y canal | Must | 🟢 | Real | Panel de tienda |
| D7-04 | Estado operativo en tiempo real | Must | 🟡 | Diseñar | Abierta o cerrada; sin «capacidad limitada» |
| D8-01 | Autenticación multi-método (social, código, invitado) | Must | 🟡 | Real | Código por celular o correo; sin redes sociales |
| D8-02 | Perfil único online y presencial (RUT) | Must | ⚪ | Proyecto | Sin diseño |
| D8-03 | Direcciones y medios de pago guardados | Should | 🟢 | Real | Mi cuenta (11) |
| D8-04 | Consentimientos y preferencias de comunicación | Must | 🟢 | Diseñar | Casilla de permisos en el ingreso y aviso de cookies |
| D9-01 | Acumulación y canje de puntos | Must | 🟢 | Simular | Diseño 09 (simulado, Loyalty sin instancia) |
| D9-02 | Catálogo de canje | Should | 🟢 | Simular | Productos canjeables (09) |
| D9-03 | Vigencia, topes y combinabilidad de puntos | Should | 🟡 | Simular | Tope diario conocido; vencimiento sin dato (D18) |
| D9-04 | Campañas automáticas por comportamiento | Should | 🟢 | Real | Journeys M1 a M9 (12) |
| D10-01 | Centro de ayuda | Must | ⚪ | Proyecto | Sin diseño |
| D10-02 | Casos y tickets ligados al pedido | Must | 🟡 | Real | Opinión baja abre caso; herramienta por definir |
| D10-03 | Atención por WhatsApp o teléfono | Should | ⚪ | Proyecto | Sin diseño |
| D10-04 | Encuestas post compra | Nice | 🟢 | Real | Opinión de 1 a 5 (08, M4) |
| D11-01 | Contenido institucional | Should | ⚪ | Proyecto | Sin diseño |
| D11-02 | SEO y landings programáticas por producto y tienda | Should | 🟡 | Real | URL por oferta y por producto; sin páginas por tienda |
| D11-03 | Marca, sostenibilidad y storytelling | Nice | ⚪ | Proyecto | Sin diseño |
| D12-01 | Integración con POS de tienda | Must | 🟡 | Explicar | OMS → Aloha, fase 2 |
| D12-02 | Pasarelas de pago locales | Must | 🟡 | Real | Mercado Pago |
| D12-03 | API comercial única para web, app y call center | Must | 🟡 | Explicar | SCAPI de Commerce; App y Call Center no tratados |
| D12-04 | Plataforma de datos de cliente y analítica | Should | ⚪ | Explicar | Data Cloud fuera del alcance (A6) |
| D12-05 | Geocodificación y mapas | Must | 🟢 | Real | Google Places (05) |
| D13-01 | Protección de datos personales | Must | 🟡 | Diseñar | Aviso de cookies y permisos; falta revisión legal |
| D13-02 | Ley del Consumidor y condiciones de venta | Must | 🟡 | Proyecto | Términos en el checkout; sin revisión legal |
| D13-03 | Seguridad y PCI-DSS | Must | 🟡 | Explicar | Bricks embebido deja la tarjeta fuera de Commerce; no está escrito en la propuesta |
| D13-04 | Auditoría de transacciones | Should | ⚪ | Explicar | No escrito |

## Datos del kit que conviene usar en la propuesta

De la volumetría y el journey del kit; son cifras del cliente, no nuestras.

| Dato | Valor | Para qué sirve |
|---|---|---|
| Conversión Web hoy | ~14% (App ~22%, total ~18%) | La meta Web es 18%: +4 pp es el argumento del rediseño |
| Cross-selling hoy | ~25% de pedidos | Meta 35%: «Hazlo combo» y recomendaciones |
| Ticket promedio | $15.690 | Base para el +5% |
| Órdenes por mes | App ~300.000 · Web ~100.000 · Agregadores ~200.000 · Call Center ~20.000 · Tótem ~2.500 | La App pesa 3 veces la Web: la omnicanalidad no es opcional |
| Franjas del día | Peak 70% · Almuerzo 11% · Valle 10% · Cierre 5% · Apertura 4% | Ocasión «almuerzo» con dato real |
| Mix de modalidad (2025) | Pick Up 51% · Delivery 49% | El retiro merece el mismo cuidado que el delivery |
| Peak | Hasta 7x un día normal (Día de la Pizza, Cyber) | Caso 20 y escalabilidad |
| Tráfico por fuente | Directo 40% · Paid 35% · Orgánico 15% · CRM 10% | Prioriza la promesa del anuncio (Diego) |
| Papa Puntos | ~281.000 socios activos; meta ~1 millón | Tamaño del caso de Loyalty |
| Cupones | Lotes de hasta 250.000 códigos | Capacidad del motor de cupones |
| BIN | «Requerimiento funcional obligatorio» | D31 deja de ser opcional |

## Historial

| Fecha | Cambio |
|---|---|
| 17-oct-2026 | v1.2: estados tras diseñar las prioridades 1 a 4 del plan (ficha, Home de Diego, seguimiento con OMS, casos sorpresa, checkout, panel y dashboard) |
| 17-oct-2026 | v1.1: columna «Tratamiento en la demo» y resumen de lo que cumple la demo (164 ítems) |
| 17-oct-2026 | v1: checklist de las 11 secciones del kit y del mapa de capacidades, con resumen y prioridades |
