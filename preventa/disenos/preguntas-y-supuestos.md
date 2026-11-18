# Preguntas y supuestos

Registro maestro para afinar con el equipo de trabajo y con el cliente. Reúne las decisiones abiertas y los supuestos de la propuesta (`00-propuesta`), de cada diseño y de la exploración (`exploracion.md`).

- **Actualizado:** 24-oct-2026
- **Desde el 24-oct-2026 no hay más ronda de preguntas con el cliente.** Las preguntas de alcance y plataforma se cerraron con la propuesta de fase 1 y sus supuestos S1 a S24 (§11 de la [vista unificada](../propuesta/solucion-vista-unificada.md)); los dueños de los datos están en su §7. Las preguntas al cliente que quedan abiertas son de la demo: se resuelven con el dato de ejemplo (sección E) y se presentan como ejemplo.
- **Cómo se usa:** cuando algo se responde, se completa la columna «Respuesta», se cambia el estado y se actualiza el diseño afectado (MD primero, después el lienzo). Las preguntas nuevas se agregan aquí con el siguiente número.
- **Estados:** Abierta · En revisión · Respondida · Descartada
- **Quién responde:** Cliente (Papa Johns Chile) · Comercial (equipo Avatar de la propuesta) · Diseño (equipo Avatar de experiencia) · Técnico (equipo Avatar de implementación)

## Resumen

| Bloque | Preguntas | Supuestos |
|---|---|---|
| A. Alcance y estrategia | 11 | — |
| B. Plataforma e integraciones | 11 | 5 |
| C. Contenido y datos del cliente | 8 | 6 |
| D. Experiencia por diseño | 38 | — |
| E. Datos de ejemplo en los diseños | — | 22 |

## A. Alcance y estrategia

| ID | Pregunta | Por qué importa | Origen | Responde | Estado | Respuesta |
|---|---|---|---|---|---|---|
| A1 | ¿Marketing Cloud reemplaza a Synerise en los canales, conviven por canal, o solo se muestra en la demo como alternativa? El kit dice que Synerise «se queda». | Define qué journeys podemos prometer y si la propuesta compite con un sistema que el cliente quiere conservar | 00 §8.1 | Cliente + Comercial | Respondida | 24-oct-2026: Synerise se queda (CRM, CDP, Papa Puntos y notificaciones). Marketing Cloud solo envía campañas por WhatsApp con link a los clientes del e-commerce. Vista §4, S2, S10, S11, S22 |
| A2 | ¿Qué edición de Marketing Cloud tenemos: Engagement (Journey Builder, Email, MobileConnect) o Marketing Cloud Next sobre Data Cloud? | Cambia cómo se arman los segmentos por perfil y qué se muestra en vivo | 00 §8.2 | Técnico | Respondida | 24-oct-2026: Marketing Cloud Engagement, con WhatsApp por Unified Messaging (S12). Next requiere Data 360, que no entra en la fase 1 |
| A3 | Papa Puntos hoy corre en Synerise (cashback). ¿Proponemos migrarlo a Loyalty Management o integrarlo? | Loyalty no tiene instancia; define cómo se presenta | 00 §8.3 | Cliente + Comercial | Respondida | 24-oct-2026: se integra con Synerise vía MuleSoft; Loyalty Management no entra en la fase 1 (vista §8.2) |
| A4 | ¿OMS entra en la propuesta comercial como fase 2 o solo como roadmap? | En un restaurante su valor está en el estado del pedido y la atención; hay que validarlo | 00 §8.4 | Comercial | Respondida | 17-oct-2026: instancia real en la demo (pedido, estados, cancelación parcial y reembolso). Aloha y DispatchTrack simulados. Ver 13. **24-oct-2026:** entra en la fase 1 para registrar y sincronizar las órdenes de todos los canales; cancelaciones y reembolsos, fase futura |
| A5 | ¿Con qué herramienta se hacen las pruebas A/B que pide el kit (más de 2 por mes)? | Es un KPI del kit sin solución definida en la propuesta | 00 §8.5 | Técnico + Comercial | Respondida | 24-oct-2026: Shopper Context con grupos de clientes y medición en GA4; una herramienta de terceros queda como opcional (S14) |
| A6 | Data Cloud no está en el alcance. ¿Lo decimos explícitamente en la propuesta como siguiente paso para unificar el perfil? | Sin él, la personalización usa grupos de clientes de Commerce y segmentos de Marketing Cloud | 00 §8.6 | Comercial | Respondida | 24-oct-2026: Data 360 no entra en la fase 1; queda como «más adelante» (vista §8.2, S1) |
| A7 | ¿Qué es exactamente lo que le gusta al cliente de Melt? Validar las hipótesis (portada editorial, navegación tipo app, ficha con URL, puntos explicados) | Toda la propuesta parte de esa hipótesis | exploración §7 | Cliente | Abierta | |
| A8 | ¿El cliente ya conversó con Infracommerce (implementador de Melt y de Papa Johns Perú sobre Adobe Commerce)? | Es el competidor probable con algo ya construido | exploración §4 | Comercial | Abierta | |
| A9 | ¿Qué sistemas se integran y cuáles se reemplazan: POS Aloha/NCR, DispatchTrack, Zendesk? | Define alcance de OMS y de atención | exploración §7; kit | Cliente + Técnico | Respondida | 24-oct-2026: se integran Aloha/NCR, API PJ, DispatchTrack, Zendesk, Synerise y el DWH vía MuleSoft; no se reemplaza ninguno (S2, vista §3) |
| A10 | El kit pide una demo omnicanal (Web, App, agregadores, Call Center, Tótem, WhatsApp) y la App hace ~300.000 órdenes al mes frente a ~100.000 de la Web. ¿Qué canales consumen la misma API de Commerce en la propuesta y cuáles se explican solo con arquitectura? | Hoy solo diseñamos la web; es la brecha más visible de las secciones 01, 04 y 05 del kit | checklist 01.11, 05.02–05.04 | Comercial + Técnico | Respondida | 24-oct-2026: Web, App, Tótem y Call Center consumen SCAPI; los agregadores siguen por la API PJ y llegan a OMS vía MuleSoft. App nueva opcional (S4); call center con su herramienta (S16) |
| A11 | El kit lleva la orden por la API Papa Johns y NCR Cloud Connect hacia Aloha. ¿Commerce (u OMS) entrega la orden a la API Papa Johns, o la reemplaza? | Nuestro diagrama (00 §3) va de OMS directo a Aloha y omite las dos capas que el cliente describe | checklist 05.13, 05.14, 06.04 | Técnico + Cliente | Respondida | 24-oct-2026: OMS entrega la orden a la API Papa Johns vía MuleSoft; la API PJ y NCR se mantienen (vista §3, alcance de OMS) |

## B. Plataforma e integraciones

| ID | Pregunta | Por qué importa | Origen | Responde | Estado | Respuesta |
|---|---|---|---|---|---|---|
| B1 | Ingredientes extra: ¿opciones de producto o líneas separadas en el carrito? | Afecta el envío al POS Aloha y el precio por tamaño | 04 | Técnico | Abierta | |
| B2 | ¿Cómo se guarda «sin cebolla» (ingrediente quitado)? Propuesta: atributo en la línea (`c_removedIngredients`) | Debe llegar a la cocina y al POS | 04 | Técnico | Abierta | |
| B3 | ¿Cómo se marca el tipo de producto (pizza, acompañamiento, bebida, postre)? Propuesta: atributo `c_productKind` | Decide si el botón abre la hoja o agrega directo | 04 | Técnico | Abierta | |
| B4 | Asignar tienda a una dirección de delivery: ¿servicio del cliente (zonas de reparto) o desarrollo nuestro? | Sin esto no hay delivery real en la demo | 05 | Cliente + Técnico | Respondida | 24-oct-2026: la cobertura la sigue resolviendo la lógica actual (backoffice y API PJ), consultada vía MuleSoft (S17). En la demo, tienda de ejemplo (E20) |
| B5 | ¿Qué medios de pago entran en la demo: Webpay, Mercado Pago, Fintoc, efectivo al retirar? ¿Hay cartuchos o sandboxes disponibles? | Integraciones con costo y plazo | 07 | Comercial + Técnico | Respondida | Solo Mercado Pago y efectivo (al retirar o al recibir), 16-oct-2026. Con Bricks embebido. Pendiente: credenciales de prueba (sandbox) de Mercado Pago |
| B6 | ¿Qué journey de Marketing Cloud se muestra en vivo? Propuesta: carrito abandonado | Requiere conectar Commerce con Marketing Cloud | 00 §9 | Comercial + Técnico | Respondida | 24-oct-2026: para alinearla con la propuesta, una campaña por WhatsApp con link (reactivación o recompra); el carrito abandonado lo envía Synerise en la propuesta (S22). Depende de la instancia con WhatsApp (P31) |
| B7 | ¿Cómo simulamos Papa Puntos en la demo (saldo, ganar, canjear) sin instancia de Loyalty? | Hay que decir con claridad qué es simulado | 00 §4 | Técnico | Respondida | Reglas de R1 en [requerimientos-demo](requerimientos-demo.md); se presenta como integración con Synerise vía MuleSoft |
| B8 | ¿El cliente ofrece factura en la compra web? ¿Con qué sistema emite boletas y facturas electrónicas? | Hoy su checkout web no pide RUT ni ofrece factura (observado el 13-oct-2026) y su API no tiene campos de facturación. El diseño v2 propone boleta por defecto y factura opcional con RUT | 07 | Cliente | Respondida | 24-oct-2026: la boleta la emite Aloha/POS, como hoy (S19) |
| B9 | Llave de Google Places restringida a `http://localhost:5173/*` (Maps JavaScript API y Places API New) en `storefront/.env` | Autocompletado de direcciones en delivery y checkout | conversación | Equipo (Raúl) | Abierta | |
| B10 | ¿La instancia de Marketing Cloud tiene MobileConnect (SMS) o WhatsApp habilitado para Chile? | 12 | Técnico | En revisión | Se pidió a Salesforce una instancia con WhatsApp para la demo (P31, vista §9) |
| B11 | ¿Qué org de Order Management conectamos al sandbox PapaJohnsCL? ¿Está disponible el conector B2C Commerce ↔ OMS y quién lo configura? | Sin esto el pedido no llega a OMS y el guion de 13 cae al panel | 13 | Técnico | Abierta | |

### Supuestos técnicos

| ID | Supuesto | Origen | Validar con | Estado |
|---|---|---|---|---|
| ST4 | Mercado Pago se integra con Checkout Bricks (formulario de tarjeta embebido) en el checkout de Storefront Next; los campos del titular (RUT) dependen de la configuración de Bricks para Chile | 07 | Técnico | Abierto (decisión de diseño tomada el 16-oct-2026) |
| ST5 | Reglas de Papa Puntos tomadas de la configuración del cliente: 1 punto por $1.000, cada punto vale $50 al canjear (lectura de `loyalty_point_amount_value`), tope de 5.000 diarios, solo productos con `with_enabled_loyalty` | 09 | Cliente + Técnico | Abierto |
| ST1 | El checkout de Storefront Next se adapta (no se construye de cero) y su registro sin contraseña con código sirve para «Guarda tus Papa Puntos» | 07 | Técnico | Abierto |
| ST2 | La búsqueda de pedido de invitado de Storefront Next (`guestOrderLookup`) sirve para el seguimiento sin cuenta | 08 | Técnico | Abierto |
| ST3 | El perfil del visitante se decide sin Data Cloud: sesión con historial → Sofía; parámetro de campaña o URL de oferta → Diego; resto → Valentina | 01 | Técnico + Comercial | Abierto |

## C. Contenido y datos del cliente

| ID | Pregunta | Por qué importa | Origen | Responde | Estado | Respuesta |
|---|---|---|---|---|---|---|
| C1 | ¿Tenemos permiso para usar su catálogo, precios e imágenes en la demo? | Toda la demo usa datos reales de su API | exploración §7 | Cliente | Abierta | |
| C2 | ¿Nos pueden entregar las fotos de cada promoción **sin texto ni precio incrustados**? | Las actuales contradicen el principio 8; hoy usamos fotos de pizza como reemplazo | 01 | Cliente | Abierta | |
| C3 | ¿Qué 3 a 5 tiendas de Santiago cargamos, con dirección, horario y tiempos reales? | El listado de tiendas de la API no se pudo resolver | 05; exploración §5 | Cliente | Abierta | |
| C4 | ¿Cuál es el costo de despacho por zona? | Aparece como [COSTO] en el diseño | 05 | Cliente | Abierta | |
| C5 | ¿Existen descripciones editoriales y tabla nutricional/alérgenos por producto? | Aparecen como marcadores en la ficha | 04 | Cliente | Abierta | |
| C6 | ¿Nos pueden entregar fotografía de producto en primer plano (queso estirado, porción levantada) y de ambiente (caja abierta, pizza humeante, mesa compartida) sin texto, además de la pizza entera? Hoy usamos recortes de campañas y las fotos de tótem | Las fotos actuales de producto no dan hambre; es la mayor palanca de la v2 | revisión UX v1 | Cliente | Abierta | |
| C7 | ¿Tienen video de producto (queso estirándose, horno, preparación) o cinemagraphs que podamos usar en el hero y la ficha? | El kit pide video y movimiento en el primer pilar del desafío; sin material, se graba o se simula | checklist 00.02, 00.06 | Cliente | Abierta | |
| C8 | ¿Tienen hoy calificaciones o reseñas de producto (app, Google, Synerise) y cifras de pedidos por producto por semana? | Prueba social y señales de popularidad («Pedida 320 veces esta semana») pedidas en el desafío y en la PDP | checklist 00.28, 00.29 | Cliente | Respondida | 24-oct-2026: supuesto S15. Popularidad con los datos de venta de Commerce y estrellas desde la encuesta NPS; reseñas con texto opcionales. En la demo, datos de ejemplo (R4.4) |

### Supuestos de catálogo (inferidos de la API del cliente)

| ID | Supuesto | Origen | Validar con | Estado |
|---|---|---|---|---|
| SC1 | Precio por tamaño de las pizzas: Mediana, Familiar, Extra grande y Borde de queso siguen el patrón de la API (Pollo BBQ: $13.000 / $16.900 / $21.900 / +$3.490) | 04 | Cliente | Abierto |
| SC2 | Masa Delgada y Masa Maestra sin recargo; borde de queso +$3.490 | 04 | Cliente | Abierto |
| SC3 | Coca-Cola: 350 ml $1.790, 1,5 L $3.490, 3 L $4.490 (tamaños inferidos de los precios) | 04 | Cliente | Abierto |
| SC6 | Borde de queso: la hoja, la ficha y Mi pedido usan +$3.490 (API); el armador de mitades en producción cobra +$2.790. ¿Cuál es el precio? ¿Depende del tamaño o de la especialidad? | 02 / 04 | Cliente | Abierto |
| SC4 | Trozos y personas por tamaño: Mediana 8 (2–3), Familiar 8 (3–4), Extra grande 10 (4–5) | 04 | Cliente | Abierto |

## D. Experiencia por diseño

| ID | Pregunta | Diseño | Responde | Estado | Respuesta |
|---|---|---|---|---|---|
| D1 | ¿Qué incentivo de reactivación usamos para Valentina? En el diseño: «Papa Puntos dobles» (ejemplo) | 01 Home | Cliente + Comercial | Abierta | |
| D2 | ¿Las ocasiones de Diego se arman con los combos actuales (Para 1: Papa Flash, Para 2: Combo Palitos, Para 4: Super Dúo, Para 6+: Super Trío)? | 01 Home | Cliente | Abierta | |
| D3 | ¿Qué ofrecemos en «Partido», «Almuerzo», «Celebración» y «Bajón»? Hoy no tienen combo asociado | 01 Home | Cliente | Abierta | |
| D4 | ¿Qué premio y umbral de puntos mostramos a Sofía? Con las reglas reales (1 punto = $50), sus 340 puntos ya alcanzan para una Super Pepperoni mediana (260). El diseño muestra «Ya puedes canjear» | 01 / 09 | Cliente | En revisión | |
| D5 | ¿Aprueban categorías y listado en una sola página de menú con secciones (como Melt), en vez de una página por categoría? | 02 Menú | Diseño + Cliente | En revisión | |
| D6 | ¿Qué etiquetas usamos y quién las administra? Propuesta: «Más pedida», «Ideal para 2», «Vegetariana», «Novedad», «Solo retiro», «Solo delivery» | 02 Menú | Cliente | Abierta | |
| D7 | ¿Con qué criterio se ordena el menú por perfil (historial, más vendidos, hora)? | 02 Menú | Técnico + Diseño | Abierta | |
| D8 | ¿Pizza por mitades dentro de la hoja rápida o solo en la ficha? | 04 Agregar | Diseño | Abierta | |
| D9 | ¿Cuántos complementos sugerimos tras agregar una pizza y con qué criterio (más vendidos, por perfil, por hora)? | 04 Agregar | Diseño + Técnico | Abierta | |
| D10 | ¿Sumamos cantidad por ingrediente (normal/extra) e ingredientes por mitad (izquierda/entera/derecha), como Papa Johns EE.UU.? | 04 Agregar | Diseño + Cliente | Abierta | |
| D11 | Tienda: la propuesta es pedirla al agregar (principio 1). El diseño 04 aún asume tienda elegida. ¿Confirmamos y ajustamos? | 04 / 05 | Diseño | En revisión | |
| D12 | Una tienda cerrada: ¿se puede elegir para pedido programado? En el diseño: sí | 05 Tienda | Cliente | Abierta | |
| D13 | Si al cambiar de tienda un producto no está disponible, ¿se avisa en el carrito y se mantiene el resto? | 05 Tienda | Cliente | Abierta | |
| D14 | ¿Se permite «Efectivo al retirar»? ¿Y en delivery? | 07 Checkout | Cliente | Respondida | Sí: al retirar y al recibir (16-oct-2026). Solo en tiendas con efectivo activo (27 de 32 según la API). Por confirmar: ¿el repartidor lleva vuelto y hasta qué monto? |
| D15 | Antes de OMS, ¿qué estados podemos mostrar en la confirmación (solo «recibido» y hora estimada)? | 08 Confirmación | Técnico | Abierta | |
| D16 | ¿Aprobamos «Hazlo combo» (convertir la pizza en un combo existente con ahorro visible) en lugar de sugerir productos sueltos? | 04 / 06 | Cliente + Diseño | Abierta | |
| D18 | ¿Los Papa Puntos vencen? ¿A los cuántos meses o por inactividad? | 09 Papa Puntos | Cliente | Abierta | |
| D19 | ¿Las especialidades tienen recargo dentro de los combos (por ejemplo, Todas las Carnes en el Super Dúo)? ¿Hay vigencia para Super Dúo y Super Trío? | 10 Ofertas | Cliente | Abierta | |
| D20 | Pizza por mitades: ¿se mantiene el precio promedio de las mitades (regla actual, verificada en producción)? | 02 / 04 | Cliente | Abierta | |
| D21 | ¿Las Pan Pizza y Croissant seguirán sin mitades? (hoy no aparecen en el armador) | 02 | Cliente | Abierta | |
| D22 | ¿Habilitamos 4 sabores (cuartos) en Chile como en Perú? ¿En qué tamaños? | 02 | Cliente + Comercial | Abierta | |
| D23 | ¿Aprueban agrupar las pizzas en Clásicas, Favoritas, Premium, Pan Pizza y Croissant (según su nivel de precio)? | 02 | Cliente | Abierta | |
| D17 | ¿La demo muestra la campaña de temporada (Halloween) como hero, cambiada en vivo desde Page Designer? | 01 Home | Comercial + Cliente | Abierta | |
| D24 | ¿Se puede pedir una pizza por mitades dentro de un combo (Super Dúo, Super Trío)? | 02 / 10 | Cliente | Abierta | |
| D25 | El canje de Papa Puntos y un cupón, ¿se pueden usar en el mismo pedido? | 07 / 09 | Cliente | Abierta | |
| D26 | En delivery, ¿quién asigna la tienda (la más cercana abierta o la zona de reparto) y se le muestra al cliente? | 05 | Cliente + Técnico | Abierta | |
| D27 | Cliente reconocido: ¿Mercado Pago guarda la tarjeta (Customers & Cards) y basta con el CVV para repetir? | 07 | Técnico | Abierta | |
| D28 | Ingreso sin contraseña: ¿el código va por SMS, correo o WhatsApp? ¿Quién paga el SMS? | 11 | Cliente + Técnico | Abierta | |
| D29 | ¿Cuánto dura la sesión recordada en el dispositivo? (propuesta: 90 días) | 11 | Cliente + Técnico | Abierta | |
| D30 | El kit pide compra como invitada para Valentina y continuar como invitado si falla el ingreso. ¿Mostramos el invitado un minuto en la demo, aunque la demo sea con registrados? | 07 / 11 | Comercial + Diseño | Abierta | |
| D31 | El kit lista Webpay, Fintoc, Pluxee, Google Pay, Apple Pay, BIN y Gift Card. ¿Agregamos al menos Gift Card y promoción por BIN a la demo? | 07 | Comercial | Abierta | |
| D32 | ¿Agregamos «Comer en el local» como tercera modalidad? ¿Qué tiendas tienen comedor? | 05 | Cliente | Respondida | 24-oct-2026: el comedor queda fuera de la fase 1 (S23) |
| D33 | ¿El presentador recibe los mensajes de la demo (correo, SMS) en su propio celular? | 12 | Comercial | Abierta | |
| D34 | ¿Qué ocasiones por momento mostramos en la demo (almuerzo 12:00–15:00, partido según calendario, bajón de noche, celebración) y con qué combo cada una? ¿Se cambia la hora desde el panel del presentador? | 01 / 10 / 12 | Diseño + Cliente | Abierta | |
| D35 | En la ficha, ¿el precio va después de la foto y la descripción («antojo antes de hablar de precio», kit 00) aunque siga a la vista (principio 3)? | 04 | Diseño | Abierta | |
| D36 | Reseñas: ¿integramos un proveedor (Bazaarvoice, PowerReviews u otro), desarrollamos un módulo propio o, en la demo, solo datos de ejemplo? | 04 / 02 | Técnico + Comercial | Respondida | 24-oct-2026: S15. Demo con datos de ejemplo; en la propuesta, reseñas con texto opcionales con un proveedor |
| D37 | ¿Qué microinteracciones entran a la demo (pizza que vuela al carro, puntos que suben, barra de seguimiento que avanza) y cómo se muestran en el lienzo? | 01 / 04 / 08 | Diseño | Abierta | |
| D38 | ¿Quién opera la consola de OMS durante la demo: el presentador o un segundo integrante? | 13 | Comercial | Abierta | |

## E. Datos de ejemplo en los diseños

Todos se reemplazan por datos reales o se marcan como «ejemplo» al presentar.

| ID | Dato de ejemplo | Dónde aparece |
|---|---|---|
| E1 | Tiempos «Retiro: listo en 15 min» y «Delivery: 35–45 min» | 01, 02, 05, 07 |
| E2 | Tienda «El Bosque» (Tobalaba 201, retiro en 15 min) como tienda elegida; en el panel, las tres tiendas reales cercanas: El Bosque 15 min, Salvador (Av. Salvador 1822) 35 min, Providencia (Av. Providencia 1349) 45 min, vistas en producción el 16-oct-2026. Distancias y horarios de ejemplo | 01, 04, 05, 07, 08 |
| E3 | Distancias y horarios de Providencia, Salvador y Líder Suecia (nombres reales) | 05 |
| E4 | Direcciones sugeridas por Google Places (Av. Providencia 1208, 1234; Av. Nueva Providencia 1881) | 05 |
| E5 | Pedido mínimo de delivery $12.000 (regla real de la API) | 05 |
| E6 | Saldo de Sofía: 340 Papa Puntos ($17.000 para canjear) y sus movimientos | 01, 09 |
| E7 | Último pedido de Sofía (2 oct): Pollo BBQ Familiar sin cebolla + Combo Palitos de Ajo con Coca-Cola Sin azúcar 1,5 L, $23.890, Mercado Pago con Visa ····4521 guardada. Es el **pedido canónico** de toda la demo (carrito, checkout, confirmación: $23.890 y 23 puntos) | 01, 06, 07, 08 |
| E8 | Veces que Sofía pidió cada favorita (6, 3, 2) | 01 |
| E9 | Fotos de pizza como reemplazo en las tarjetas de combos | 01, 02 |
| E10 | Cupón «VUELVE20» (solo como texto de ayuda) | 07 |
| E11 | Datos del cliente en el checkout (Valentina Rojas, +56 9 8765 4321) | 07, 08 |
| E21 | Datos de Sofía como cliente reconocido: Sofía Muñoz, +56 9 7654 3210, sofia.munoz@correo.cl | 07 |
| E22 | Valentina registrada: 40 Papa Puntos, sin tarjeta guardada; este pedido suma 46 (puntos dobles). Código de demo 482 913 | 07, 11 |
| E12 | Número de pedido «PJ-48213» y horas 20:27 / 20:45 | 08 |
| E13 | Dirección de la tienda: [DIRECCIÓN DE LA TIENDA] | 08 |
| E14 | Descripción editorial: [DESCRIPCIÓN EDITORIAL DESDE EL CMS] | 04 |
| E15 | Tabla nutricional: [TABLA NUTRICIONAL Y ALÉRGENOS DESDE EL CATÁLOGO] | 04 |
| E16 | Cantidad de productos por categoría en el menú de escritorio (13, 24, 13, 9, 9; tomados de la API) | 02 |
| E18 | Precio de «Hazlo combo»: +$6.990, ahorras $2.490 (lo calcularía el motor de promociones) | 04 |
| E19 | Recortes de fotos de campaña sin texto (Pizza del Mes, Super Dúo, Papa Combo Palitos, Halloween) | 01, 02, 04 |
| E20 | Despacho de $1.990 en el panel de delivery y en el checkout. En la API el costo va por tienda (se ven $990 y $3.000); la tienda asignada a Av. Providencia 1234 es Salvador | 05, 07, 08 |
| E17 | Puntos ganados calculados a 1 punto por cada $1.000 (regla real) | 04, 07, 08 |

## Otros pendientes de la exploración

| ID | Pendiente | Responde | Estado |
|---|---|---|---|
| X1 | Propiedad actual de PJ Chile: las fuentes no coinciden (Lezo Partners vs. Drake Foods) | Comercial | Abierta |
| X2 | Cifras de venta digital de Domino's (85%) y Papa Johns (70%) sin documento primario | Comercial | Abierta |
| X3 | No hay caso público de pizzería o QSR latinoamericano sobre Salesforce; el más cercano es Casey's | Comercial | Abierta |
| X4 | Recorrer los sitios de EE.UU. con conexión de salida en EE.UU. (no se pudo agregar al carrito en PJ EE.UU.) | Diseño | Abierta |
| X5 | El kit nombra a Synerise como CRM. ¿Marketing Cloud lo reemplaza o convive con él? Define el argumento comercial de la propuesta | Comercial | Respondida (24-oct-2026): conviven; Synerise sigue como CRM y Marketing Cloud solo envía campañas por WhatsApp (ver A1) |

## Historial

| Fecha | Cambio |
|---|---|
| 24-oct-2026 | Unificado con la vista unificada v3.0: A1 a A11 (salvo A7 y A8), B4, B6 a B8, B10, C8, D32, D36 y X5 cerrados con la propuesta de fase 1 y los supuestos S1 a S24; sin más ronda de preguntas con el cliente |
