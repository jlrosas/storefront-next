# Revisión contra el kit del cliente v1

Fecha: 17-oct-2026. Fuente: [Papa Johns Ecommerce Experience Kit 2026](https://cdn.papajohns.cl/kit-pj/index.html), leído completo (incluye las 10 etapas del recorrido y los 20 escenarios «¿Qué pasa si…?», que están en el código de la página y no en el texto visible).

La pregunta: **como e-commerce, ¿qué se nos está olvidando frente a lo que Papa Johns pidió?**

## Resumen para el cliente

El diseño cubre bien lo que el kit llama «hacer que entre por los ojos», la home por perfil, el armado (mitades, combos) y la recompra de Sofía. Lo que falta se agrupa en cuatro temas:

1. **Decisiones que contradicen el kit** y hay que conversar antes de la demo: CRM (el kit dice Synerise), compra como invitada para Valentina, medios de pago y comedor.
2. **El pedido después de pagar** se ve poco: el kit pide estado en vivo con ETA («Pedido en camino · ETA 18 min · actualizado hace 1 min») y que la experiencia lo muestre. Se resuelve con el **seguimiento siempre visible** (ver 01 Home y 08).
3. **Escenarios de excepción:** de los 20 casos del kit, el diseño cubre 4 completos y 5 en parte.
4. **Lo que se demuestra fuera de la tienda:** preparar una campaña en el back office, el contexto de entrada (fuente, campaña, deep link) y los mensajes de CRM. Se propone simularlo con un **panel del presentador** (ver [12 · Marketing](12-marketing/README.md)).

## 1. Decisiones que hay que conversar

| # | El kit dice | El diseño hoy | Recomendación |
|---|---|---|---|
| K1 | **CRM: Synerise**, «se integra con los eventos definidos para personalización y fidelización». No menciona Salesforce ni Marketing Cloud | La propuesta usa Marketing Cloud para correos, SMS y recordatorios | Presentar Marketing Cloud como **reemplazo o complemento de Synerise** con un argumento explícito (un solo proveedor con Commerce, Loyalty y Service). Si se mantiene Synerise, Commerce le envía los mismos eventos. Pregunta X5 |
| K2 | Valentina: «**compra como invitada permitida**»; escenario «Fallo en login»: «permitir continuar como invitado, conservar el carrito» | La demo es solo con clientes registrados; el invitado queda como alternativo | Mantener la demo con registrados, pero **mostrar en un minuto el invitado** (`Checkout-Invitado` ya existe) cuando se presente a Valentina o el escenario de fallo de login. Pregunta D30 |
| K3 | Medios de pago: **Webpay, Mercado Pago, Fintoc, Pluxee, Google Pay, Apple Pay**, BIN y Gift Card | Solo Mercado Pago y efectivo (decisión del 16-oct) | Mantener la decisión para la demo y decir en voz alta que los otros medios son configuración por tienda. Agregar al menos **Gift Card y promoción por BIN** como línea en el checkout. Pregunta D31 |
| K4 | Modalidades: **Delivery, Pick Up y comedor** «según disponibilidad», con capacidad del comedor | Solo retiro y delivery | Agregar **«Comer en el local»** como tercera opción del panel de tienda cuando la tienda tiene comedor. Pregunta D32 |

## 2. Cobertura de las 10 etapas del recorrido

| Etapa del kit | Qué pide | Cobertura | Falta |
|---|---|---|---|
| Preparación de campaña | Comercial crea combo, precios, cupones y reglas; Marketing publica la landing | ⚪ No es pantalla de tienda | Demostrarlo en Business Manager y Page Designer (guion en 12) |
| Entradas al ecosistema | Conservar fuente, campaña, deep link y dispositivo, y **usarlos para decidir qué mostrar** | 🟡 Home de Diego desde un anuncio | Landing de campaña con URL propia y *source code*; fallback si el deep link falla |
| Reconocimiento | Reconocer al cliente y funcionar igual si no se puede | 🟢 Tres perfiles, ingreso con código | Consentimiento (aviso de cookies y permisos de marketing) |
| Selección de entrega | Delivery, Pick Up o comedor; cambiar sin perder lo avanzado | 🟡 Retiro y delivery | Comedor; recálculo visible al cambiar de modalidad |
| Exploración y personalización | Catálogo, combos, mitades, disponibilidad | 🟢 Menú v3, mitades, constructor | Producto no disponible en la tienda |
| Carro y beneficios | Cupón, Papa Puntos, incompatibilidades, **carro recuperable** | 🟡 Canje y «Hazlo combo» | Error de cupón; **carro abandonado** que se recupera desde un mensaje |
| Checkout y pago | Medios por tienda, BIN, Gift Card; rechazo sin perder ni duplicar | 🟡 Mercado Pago, efectivo, rechazo | Gift Card, BIN; botón que evita el doble pago |
| Procesamiento y despacho | Estados reales desde tienda y despacho | 🟡 Estados simulados | ETA y «actualizado hace X min» (fase 2 con OMS y DispatchTrack) |
| Postventa y fidelización | Confirmaciones, puntos, NPS, contexto para SAC | 🟢 Confirmación, opinión, puntos | Qué ve SAC (Service Cloud o Zendesk) |
| Recompra omnicanal | Repetir con precios y disponibilidad de hoy | 🟢 Repetir de Sofía, Mi cuenta | Aviso si algo cambió al repetir |

## 3. Los 20 escenarios «¿Qué pasa si…?»

Leyenda: 🟢 diseñado · 🟡 en parte · ⚪ no diseñado. La columna «Demo» indica si conviene mostrarlo en la demo.

| # | Escenario | Estado | Dónde / qué falta | Demo |
|---|---|---|---|---|
| 1 | Tienda cerrada o fuera de horario | 🟡 | Panel de tienda muestra «Cerrada · solo programado»; falta ofrecer otra tienda al pagar | Sí |
| 2 | Promoción no disponible en la tienda | ⚪ | Aviso en el constructor y alternativa válida | Sí (Diego) |
| 3 | Monto mínimo de delivery | ⚪ | Faltante exacto, sugerencia o cambio a retiro (se dejó fuera de la demo el 16-oct) | No |
| 4 | Carrito expirado o con cambios | ⚪ | Revalidar y mostrar diferencias | No |
| 5 | Cambio de delivery a retiro | 🟡 | El panel permite cambiar; falta mostrar qué se recalculó | Opcional |
| 6 | Ingrediente no disponible | ⚪ | Bloquear solo esa opción en la hoja y ofrecer sustituto | Opcional |
| 7 | Error en la personalización (mitades incompatibles) | 🟡 | El armador solo muestra mitades válidas | Sí |
| 8 | Papa Puntos no disponibles | 🟡 | Valentina: «te faltan 132»; falta el caso «producto sin stock para canje» | No |
| 9 | Cupón vencido, usado o inválido | ⚪ | Mensaje con la causa en el campo de cupón | Opcional |
| 10 | Pago aprobado, orden no confirmada | ⚪ | Conciliación (técnico) | Explicarlo |
| 11 | Doble clic / pedido duplicado | ⚪ | Botón «Pagando…» deshabilitado (idempotencia) | Explicarlo |
| 12 | Medio de pago no disponible | 🟡 | El efectivo cambia según modalidad; falta filtrar por tienda | No |
| 13 | Fallo en login | ⚪ | «¿No te llega el código?» → seguir como invitado con el carrito | Sí (K2) |
| 14 | Deep link roto | ⚪ | Página de oferta vencida con alternativas | Opcional |
| 15 | Tiempo prometido cambia durante la compra | ⚪ | Aviso en el checkout antes de pagar | Opcional |
| 16 | Delivery saturado | ⚪ | Ofrecer retiro, otra tienda o programar | Opcional |
| 17 | Quiebre parcial del checkout | 🟡 | El rechazo de pago tiene salida; falta loyalty o promo caída | No |
| 18 | Dirección ambigua | 🟡 | Google Places con sugerencias; falta corrección manual en mapa | No |
| 19 | Pedido futuro no disponible | 🟡 | Programar en el panel; falta la restricción | No |
| 20 | Servicio caído en peak | ⚪ | Página de contingencia y cola | Explicarlo |

**Recomendación para la demo:** mostrar 1, 2, 7, 13 y el rechazo de pago (ya diseñado). Cada uno toma menos de un minuto y muestra que la plataforma no se rompe. El resto se explica con la arquitectura.

## 4. Lo que el kit pide en la experiencia y aún no está

| Pedido del kit | Recomendación | Prioridad |
|---|---|---|
| Estado del pedido siempre visible («ETA 18 min, actualizado hace 1 min») | Seguimiento persistente en la Home y sobre la barra inferior (diseñado el 17-oct) | Alta |
| Home de Sofía después de comprar: «historial → preferencias → puntos → frecuencia → próxima mejor acción» | Home de Sofía en tres momentos: antes, con pedido en curso y después (diseñado el 17-oct) | Alta |
| PDP enriquecida: **reseñas y señales de popularidad** | «4,7 ★ · 1.240 opiniones» y «Pedida 320 veces esta semana» en la ficha y las tarjetas | Media |
| Diego: «**Recomendados para ti**» y «Por $1.500 más agrega bebida» | Bloque de Einstein Recommendations en el menú y mensaje de upgrade con precio exacto | Media |
| Carro recuperable desde un mensaje | Correo o SMS de carrito abandonado que reabre el carrito (12) | Alta (marketing) |
| Consentimiento y contexto de entrada | Aviso de cookies y permisos; landing de campaña con URL propia | Media |
| Gift Card y BIN | Línea «Gift Card» y descuento por banco en el checkout | Media |
| Comedor | Tercera modalidad en el panel de tienda | Media |

## 5. KPIs del kit que el diseño mueve

| KPI del kit | Meta | Qué del diseño lo empuja |
|---|---|---|
| Cross-selling | 35% de pedidos con recomendación | «Hazlo combo», «Completa tu pedido», recomendados |
| Ticket promedio | +5% | Combo, mejora a borde, canje que suma una pizza |
| Recompra | > 30% | Repetir, Mi cuenta, recordatorio, puntos |
| Base identificada | > 70% | Ingreso con código, sin contraseña |
| Begin checkout → purchase | > 70% | Checkout de tres pasos, tarjeta guardada |
| Tiempo de checkout | < 90 s | Repetir de Sofía: un toque y el CVV |
| Pago aprobado | > 97% | Rechazo con salida a otra tarjeta o efectivo |
| Contact rate SAC | < 3% | Seguimiento visible sin tener que llamar |
| Open rate push / email | > 8% / > 5% | Mensajes de estado y de recompra (12) |
