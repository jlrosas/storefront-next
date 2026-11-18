# Requerimientos de construcción de la demo

- **Fecha:** 17-oct-2026
- **Para quién:** el equipo que construye la demo sobre el sandbox (Storefront Next) y conecta Marketing Cloud y Order Management.
- **Qué es:** todo lo que la demo tiene que **calcular, simular o conectar** para que las pantallas del lienzo muestren datos coherentes. Cada diseño enlaza aquí; si un diseño cambia una regla, se cambia en este documento.
- **Recordatorio:** es una demo. El objetivo es que Papa Johns vea un partner que entiende su negocio, no construir el proyecto. Lo simulado se presenta como lo que es («así se integra con Synerise vía MuleSoft»), nunca como algo que corre en producción.
- **Demo y propuesta (24-oct-2026):** la propuesta de fase 1 es B2C Commerce + Order Management (registra y sincroniza) + Marketing Cloud (solo campañas por WhatsApp con link) + MuleSoft ([vista unificada §3](../propuesta/solucion-vista-unificada.md)). Algunas reglas de la demo muestran más de lo que entra en la fase 1; cada una lo dice en su fila, para no presentarlo como alcance del proyecto.

## Cómo leerlo

| Tipo | Significa |
|---|---|
| **Real** | Corre en el sistema real de la demo: Commerce (sandbox), Marketing Cloud (instancia) u Order Management (instancia) |
| **Simulado** | Lo calcula la demo con reglas reales del cliente, sin el sistema de fondo (Synerise para Papa Puntos, Aloha, DispatchTrack, MuleSoft) |
| **Ejemplo** | Dato fijo de ejemplo, cargado en la demo |

## Postura por sistema

| Sistema | En la demo | Notas |
|---|---|---|
| Commerce Cloud (Storefront Next) | Real | Sitio PapaJohnsCL en el sandbox |
| Marketing Cloud | Segunda etapa (06-nov) | Fuera de la demo del 20-nov; se explica con la arquitectura. Diseño original: journeys M1, M2 y M3 con entrada por API ([12](12-marketing/README.md)). En la propuesta, solo campañas por WhatsApp con link; M1 y M2 los envía Synerise (S22) |
| Order Management | Segunda etapa (06-nov) | Fuera de la demo del 20-nov; el estado del pedido vive en Commerce y se avanza desde el panel ([plan](../demo/PLAN.md)). Diseño original: el pedido entra a OMS y se opera desde su consola ([13](13-operacion/README.md)) |
| Papa Puntos | Simulado | Reglas reales del programa ([09](09-papa-puntos/README.md)); en la propuesta, el programa sigue en Synerise y se integra vía MuleSoft |
| Aloha, NCR Cloud Connect, API Papa Johns | Simulado | El presentador hace de tienda: avanza el pedido en la consola de OMS |
| DispatchTrack | Simulado | ETA y «en camino» los fija el panel del presentador |
| MuleSoft | No se conecta | En la demo, Commerce y OMS hablan directo y el panel simula lo que en la propuesta llega por MuleSoft (estados, puntos). Se explica con la arquitectura ([00 §3](00-propuesta/README.md)) |
| Synerise, Zendesk | No se conectan | Se explican con la arquitectura ([00 §3](00-propuesta/README.md)) |

## R1 · Papa Puntos (Synerise, simulado)

| ID | Requerimiento | Regla | Tipo | Dónde se ve |
|---|---|---|---|---|
| R1.1 | Puntos que gana un pedido | `floor(total pagado / 1.000)`; sin contar el despacho. Pedido canónico $23.890 → 23 puntos | Simulado | Hoja, ficha, carrito, checkout, confirmación |
| R1.2 | Puntos dobles de reactivación | Valentina: R1.1 × 2 en su primer pedido de vuelta (D1, beneficio de ejemplo) | Simulado | Home y checkout de Valentina |
| R1.3 | Valor del punto al canjear | 1 punto = $50 (`loyalty_point_amount_value`) | Simulado (regla real) | Página y cuenta de puntos |
| R1.4 | Costo en puntos de un producto canjeable | `ceil(precio mediana / 50)`; solo productos con `with_enabled_loyalty` (Super Pepperoni 260, Boom de Jamón 218, Napolitana Caprese 218) | Simulado | Canje en el carrito |
| R1.5 | Tope diario | 5.000 puntos por día (`max_daily_points`) | Simulado (regla real) | Sin pantalla; validar en el canje |
| R1.6 | Saldo inicial por perfil | Sofía 340 · Valentina 40 · Diego 0 | Ejemplo | Home, cuenta, checkout |
| R1.7 | Cuándo se acreditan | Cuando el pedido pasa a «Entregado» o «Retirado» en OMS (R3.4). Antes se muestran como «por acreditar» | Simulado, disparado por OMS real | Seguimiento, Home de Sofía «después» |
| R1.8 | Canje | Aplica una promoción de Commerce que deja la pizza en $0 y descuenta el saldo simulado | Real (promoción) + simulado (saldo) | `Puntos-Canje`, `Checkout-Sofia` |
| R1.9 | Compensación por cancelación | Al cancelar un producto en OMS: reembolso parcial del producto + 50 puntos de regalo con el mensaje «Te regalamos 50 Papa Puntos por la molestia» | OMS real + simulado. Solo demo: en la propuesta, cancelaciones y compensaciones son fase futura | Seguimiento con cancelación, mensaje M1 |

## R2 · Precio, promociones y pago (Commerce)

| ID | Requerimiento | Regla | Tipo | Dónde se ve |
|---|---|---|---|---|
| R2.1 | Pizza por mitades | Precio = promedio de las especialidades de cada parte (Pollo BBQ $16.900 + Todas las Carnes $18.900 = $17.900) | Real (hook de cálculo) | Armador, carrito |
| R2.2 | «Conviértelo en combo» | Si el carrito contiene los productos de un combo vigente más barato, ofrecer el combo y mostrar el ahorro exacto | Real (promoción) | Carrito |
| R2.3 | Mensaje de umbral (Diego) | Una sola línea, la primera que aplique: (a) delivery bajo el mínimo de $12.000 → «Te faltan $X para pedir delivery»; (b) carrito sin bebida → «Por $1.500 más agrega una bebida 1,5 L» | Real | Carrito |
| R2.4 | Descuento por BIN | Si los primeros 6 dígitos de la tarjeta están en la lista de la promoción, aplicar 20% sobre productos (tope $5.000) y mostrar «Descuento Banco de ejemplo · −$X» antes de pagar | Simulado (promoción de Commerce con lista de BIN de prueba) | Checkout |
| R2.5 | Gift Card | Código `PJ-GIFT-2026` con saldo $10.000; se descuenta del total y el resto se paga con Mercado Pago o efectivo | Real (Gift Certificates de Commerce) | Checkout |
| R2.6 | Promoción no disponible en la tienda | Si la promoción tiene calificador de modalidad o tienda y no aplica, la tarjeta y el constructor muestran la causa y una alternativa válida | Real (calificadores de la promoción) | Ofertas, constructor |
| R2.7 | Oferta vencida desde un enlace | Si la URL `/promos/:id` apunta a una promoción vencida, mostrar «Esta oferta terminó el …» y tres ofertas vigentes; conservar `utm_*` | Real (desarrollo) | `Oferta-Vencida` |
| R2.8 | Doble clic en pagar | El botón pasa a «Pagando…» deshabilitado al primer toque; el pedido se crea una sola vez (clave de idempotencia por carrito) | Real | Checkout |

## R3 · Pedido, estados y ETA (OMS real + simulado)

| ID | Requerimiento | Regla | Tipo | Dónde se ve |
|---|---|---|---|---|
| R3.1 | El pedido llega a OMS | Al confirmarse el pago, el pedido de Commerce se crea en OMS como Order Summary con su Fulfillment Order (conector B2C Commerce ↔ Order Management; validar en la org, B11) | Real | Consola de OMS |
| R3.2 | Mapeo de estados | Ver tabla de estados abajo | Real | Seguimiento, franja fija, Mi cuenta |
| R3.3 | ETA | Retiro: tiempo de la tienda (`c_pickupMinutes`, El Bosque 15 min). Delivery: ventana 21:05–21:15 del pedido canónico; el panel puede sumar minutos (caso 15) | Simulado | Seguimiento, checkout |
| R3.4 | «Actualizado hace X min» | Minutos desde el último cambio de estado en OMS | Real (fecha del cambio) | Seguimiento |
| R3.5 | Estado vuelve a la tienda | Commerce consulta el estado del pedido (conector o API de OMS) al abrir la tienda y cada 30 s mientras hay un pedido en curso | Real | Franja fija y Home |
| R3.6 | Cancelación parcial | Desde la consola de OMS se cancela un producto; la tienda muestra la línea tachada, el reembolso y la compensación (R1.9) | Real + simulado. Solo demo: fase futura en la propuesta | `Seguimiento-Cancelacion` |

**Estados (propuesta de mapeo, validar con Técnico):**

| Lo que ve el cliente | Retiro | Delivery | Estado en OMS (Fulfillment Order) | Mensaje (M1) |
|---|---|---|---|---|
| Recibido | Sí | Sí | Allocated | «Recibimos tu pedido» |
| En preparación | Sí | Sí | Assigned / Pick Complete | — |
| Listo para retirar | Sí | — | Pack Complete | «Tu pedido está listo» |
| En camino | — | Sí | Pack Complete + evento de despacho simulado | «Tu pedido va en camino · llega en N min» |
| Entregado / Retirado | Sí | Sí | Fulfilled | «¿Qué tal tu pedido?» (M4) |
| Producto cancelado | Sí | Sí | Cancelación de línea en Order Summary | «Cancelamos 1 producto · te devolvimos $X» |

## R4 · Personalización y contenido (Commerce)

| ID | Requerimiento | Regla | Tipo | Dónde se ve |
|---|---|---|---|---|
| R4.1 | Perfil de la visita | Sesión con historial → Sofía; `utm_campaign` o URL de oferta → Diego; correo de reactivación o sin datos → Valentina (01 regla 5) | Real (grupos de clientes) | Home |
| R4.2 | Ocasión por hora | Hora del dispositivo o la fijada por el panel (parámetro `?hora=`): 12:00–15:00 Almuerzo · 19:00–22:00 con partido en el calendario de ejemplo → Partido · viernes y sábado 19:00–22:00 → Celebración · 22:00–02:00 Bajón · resto: «¿Para cuántos?» | Real (programación de Page Designer) + panel | Home de Diego |
| R4.3 | Combo de cada ocasión | Almuerzo: Papa Flash $5.490 · Partido: Super Dúo $22.590 · Celebración: Super Trío $33.900 · Bajón: Papa Combo Palitos $16.490 | Ejemplo (combos reales) | Home de Diego |
| R4.4 | Reseñas y popularidad | Tabla fija por producto (abajo); se muestra «Pedida N veces esta semana» solo si N ≥ 100. En la propuesta (S15): popularidad y estrellas desde el NPS en la fase 1; reseñas con texto, opcionales | Ejemplo | Ficha, tarjetas del menú |
| R4.5 | Destacados de la ficha | «Para 2–3 personas» (Familiar), «Lista en N min en {tienda}» si hay tienda elegida, «Vegetariana» o «Picante» según atributo | Real (atributos) + R3.3 | Ficha |
| R4.6 | Ingrediente agotado | Inventario por tienda de la opción; si está en 0, la opción aparece deshabilitada con «Agotado en {tienda}» y un sustituto sugerido | Real (inventario por tienda) | Hoja |
| R4.7 | Video del hero y la ficha | MP4 de hasta 6 s, sin sonido, en bucle, con imagen de póster; solo se carga después del primer pintado y no se reproduce con «reducir movimiento» | Real (componente de Page Designer) | Home, ficha |
| R4.8 | Consentimiento | Aviso de cookies en la primera visita; casilla «Quiero recibir ofertas por SMS y correo» en el ingreso con código, guardada en el perfil y enviada a Marketing Cloud | Real | Home, `Login` |

**Reseñas y popularidad de ejemplo (R4.4):**

| Producto | Estrellas | Opiniones | Pedidas esta semana |
|---|---|---|---|
| Pollo BBQ | 4,7 | 1.240 | 320 |
| Todas las Carnes | 4,6 | 980 | 260 |
| Super Pepperoni | 4,8 | 2.110 | 410 |
| Boom de Jamón | 4,5 | 640 | 180 |
| Napolitana | 4,4 | 510 | 150 |
| Hawaiana | 4,3 | 720 | 140 |
| Resto | 4,2–4,5 | 100–400 | < 100 (no se muestra) |

## R5 · Marketing Cloud (real)

| ID | Evento | Lo gatilla | Journey | Datos que viajan |
|---|---|---|---|---|
| R5.1 | `order.status_changed` | Cambio de estado en OMS (Flow de OMS) o, si no alcanza, el panel | M1 estado del pedido | Número de pedido, estado, ETA, enlace al seguimiento |
| R5.2 | `cart.abandoned` | Panel del presentador (en producción: 30 min sin pago) | M2 carrito abandonado | Enlace que reabre el mismo carrito (cliente identificado), productos, total |
| R5.3 | `reactivation` | Panel | M3 reactivación de Valentina | Enlace a la Home de Valentina con puntos dobles |
| R5.4 | Contacto | Datos del presentador en la *data extension* de demo; nunca datos de clientes reales (D33) | — | Correo y celular del presentador |

**Demo y propuesta:** en la propuesta, Marketing Cloud solo envía campañas por WhatsApp con un botón que abre la web o la app (reactivación, lanzamiento, recompra y ocasión); el estado del pedido (M1) y el carrito abandonado (M2) los sigue enviando Synerise (S22). M3 (reactivación) es el journey que coincide con la propuesta; si la instancia de la demo tiene WhatsApp (P31), conviene mostrarlo por ese canal.

## R6 · Panel del presentador y dashboard

| ID | Requerimiento | Regla |
|---|---|---|
| R6.1 | Cambiar la hora | Botones Almuerzo · Partido · Celebración · Bajón · Ahora; abren la tienda con `?hora=` |
| R6.2 | Gatillar mensajes | Botones para R5.1 a R5.3; muestran el evento técnico enviado |
| R6.3 | Atajos de OMS | Enlace directo al pedido en la consola de OMS; el avance se hace en OMS (real) |
| R6.4 | Casos sorpresa | Botones que dejan la tienda en el estado del caso: tienda cerrada (1), promoción no disponible (2), falla el código (13), oferta vencida (14), ETA +15 min (15) |
| R6.5 | Dashboard en vivo | Ventas, pedidos, ticket promedio y conversión del día: base de ejemplo + los pedidos reales de la demo (consulta a Commerce) |

## Historial

| Fecha | Cambio |
|---|---|
| 17-oct-2026 | v1: reglas de puntos, precio, pago, estados con OMS real, personalización, Marketing Cloud y panel |
| 06-nov-2026 | v1.2: OMS y Marketing Cloud pasan a la segunda etapa; la demo es solo B2C Commerce con Storefront Next ([plan](../demo/PLAN.md)) |
| 24-oct-2026 | v1.1: alineado con la propuesta de fase 1: postura de MuleSoft, Papa Puntos en Synerise (sin Loyalty Management), y notas «solo demo» en cancelación y compensación (R1.9, R3.6), reseñas (R4.4) y Marketing Cloud (R5) |
