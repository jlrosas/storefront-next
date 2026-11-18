# 12 · Marketing y simulación de la demo

## Objetivo y alineación con el cliente

El kit mide el éxito también fuera de la tienda: revenue atribuido a CRM > 8%, open rate push > 8% y email > 5%, CTR CRM > 2,5%, recompra > 30%, cross-selling 35%. Además pide en la prueba de concepto «configurar una campaña y sus reglas» y «seguir una visita hasta el checkout y la orden».

En una demo, eso no se ve si solo se navega la tienda. Se propone **gatillar cada mensaje y cada personalización en vivo**, desde un **panel del presentador**, y que los mensajes lleguen de verdad al teléfono del presentador usando la instancia de Marketing Cloud que ya existe.

> Nota: el kit nombra a **Synerise** como CRM (K1 en `revision-kit-v1.md`). Todo lo de esta página funciona igual si los eventos van a Synerise; la diferencia es el argumento comercial.

## Recomendaciones de marketing (por prioridad)

### Mensajes (Marketing Cloud: Journey Builder, Email, SMS con MobileConnect, WhatsApp)

| # | Journey | Disparador (evento de Commerce) | Perfil | Canal | Lleva a | KPI del kit |
|---|---|---|---|---|---|---|
| M1 | **Estado del pedido** | Cambio de estado de la orden (recibido, listo / en camino, entregado) | Todos | SMS o WhatsApp + correo | Seguimiento | Contact rate SAC < 3%, NPS > 60 |
| M2 | **Carrito abandonado** | Carrito con productos y sin pago en 30 min (cliente identificado) | Diego, Valentina | Correo + SMS | El carrito tal cual quedó | Abandono < 55% |
| M3 | **Reactivación** | Segmento sin compras en más de 18 meses | Valentina | Correo | Home de Valentina con puntos dobles | Recurrentes > 55% |
| M4 | **Post-compra y opinión** | Orden entregada + 1 h | Todos | Correo o WhatsApp | Encuesta de 1 a 5; ≤ 2 abre caso en SAC | NPS > 60 |
| M5 | **Puntos acreditados / ya puedes canjear** | Puntos acreditados (Loyalty) y saldo ≥ umbral | Sofía, Diego | Correo + push web | Canje en el carrito | Socios activos +20% |
| M6 | **Recordatorio elegido** | Opt-in «¿Te lo recordamos el viernes?» de la confirmación | Sofía | SMS | Repetir pedido en un toque | Recompra > 30% |
| M7 | **Bienvenida** | Primera compra de un cliente nuevo | Diego | Correo | Papa Puntos y su primera recompensa | Switcher → Heavy |
| M8 | Puntos por vencer | Puntos que vencen en 15 días (D18) | Todos | Correo | Canje | Socios activos |
| M9 | Cumpleaños | Fecha de nacimiento del perfil | Registrados | Correo | Cupón de regalo | CTR CRM |

### En la tienda (B2C Commerce)

| # | Herramienta | Para qué | Dónde se ve |
|---|---|---|---|
| T1 | **Einstein Product Recommendations** | «Completa tu pedido», «Recomendados para ti» (Diego), «Tus favoritas» (Sofía) | Hoja, ficha, Mi pedido, Home |
| T2 | **Campañas, *source codes* y grupos de clientes** | Mantener la promesa del anuncio de Diego desde el clic hasta el pago | Home de Diego, constructor |
| T3 | **Page Designer con programación y visibilidad por grupo** | Hero de Halloween que cambia solo por fecha; bloques por perfil | Home |
| T4 | **Motor de promociones** | Hazlo combo, Super Dúo, **promoción por BIN**, cupones con mensaje de error claro | Hoja, carrito, checkout |
| T5 | **Pruebas A/B** | Ej.: hero de Sofía «Repetir» vs. «Favoritas» (kit: más de 2 tests al mes) | Home |
| T6 | **Orden por afinidad (Einstein Predictive Sort)** | Menú ordenado por perfil (D7) | Menú |
| T7 | **Señales de popularidad** | «Pedida 320 veces esta semana», reseñas en la ficha | Tarjetas y ficha |
| T8 | **Gift Certificates** | Gift Card como medio de pago | Checkout |

### Servicio y medición

- **Service Cloud** (o Zendesk, que nombra el kit): una opinión de 1 o 2 estrellas abre un caso con el pedido adjunto.
- **Dashboard en vivo** (kit, sección 06): ventas por canal, conversión, pagos rechazados, órdenes en curso. Se simula con un tablero aparte.

## Cómo se simula en la demo

### El panel del presentador (`Panel-Demo.dc.html`)

Una pantalla de escritorio que el presentador tiene abierta en una segunda ventana. **No es parte de la tienda**: reemplaza lo que en producción harían los sistemas (OMS, Loyalty, Marketing Cloud).

1. **Elegir el perfil y el momento:** Valentina, Diego o Sofía; antes, durante o después de la compra.
2. **Gatillar eventos con un botón:**
   - *Antes:* enviar el correo de reactivación a Valentina, abrir la campaña de Diego (anuncio → landing), simular carrito abandonado.
   - *Durante:* avanzar el estado del pedido (recibido → en preparación → listo / en camino), cambiar el ETA.
   - *Después:* acreditar puntos, enviar la encuesta, enviar el recordatorio del viernes.
3. **Ver el efecto en dos lados:** en la tienda (seguimiento en la Home, puntos, banner) y en un **teléfono de muestra** con el mensaje recibido (SMS, WhatsApp o correo).
4. **Registro de eventos:** cada botón muestra el evento técnico que lo generó (por ejemplo, `order.status_changed → Journey Builder M1`), para la parte técnica de la presentación.

### Con la instancia real de Marketing Cloud

Para que el cliente **vea llegar el mensaje al teléfono**, el panel llama a la API de eventos de Journey Builder con el correo y el celular del presentador (datos de prueba, nunca de clientes reales). Requiere:

- Una *data extension* de contactos de demo (Valentina, Diego, Sofía con los datos del presentador).
- Tres journeys con entrada por API: M1 estado del pedido, M2 carrito abandonado y M3 reactivación (los más visibles).
- Plantillas de correo y SMS con la marca.
- MobileConnect habilitado con un número corto o largo para Chile (o WhatsApp si la cuenta lo tiene). **Por confirmar (B10).**

Si no se puede enviar SMS real, el panel muestra el mensaje en el teléfono de muestra y se envía solo el correo.

## Guion sugerido (12 minutos)

1. **Valentina (4 min):** el presentador gatilla M3 → llega el correo → toca «Volver» → Home de Valentina → arma su pedido → ingresa con código → paga → la Home muestra el seguimiento → el presentador avanza el estado → llega el SMS «Tu pedido está listo».
2. **Diego (4 min):** anuncio del Super Dúo («2 pizzas familiares por $22.590») → landing con la promesa del anuncio → constructor → abandona → el presentador gatilla M2 → correo → vuelve al carrito intacto → paga.
3. **Sofía (4 min):** Home reconocida → Repetir → paga con CVV y canje → Home con pedido en curso → entregado → Home «después»: puntos, opinión, próxima mejor acción → el presentador gatilla M6 el «viernes».

## Pantallas

| # | Archivo | Qué muestra |
|---|---|---|
| 1 | `Panel-Demo.dc.html` | Panel del presentador: perfil y momento, botones por etapa, teléfono con el mensaje recibido y registro de eventos |

## Decisiones abiertas

- **X5:** ¿Marketing Cloud reemplaza a Synerise o convive con él?
- **B10:** ¿La instancia de Marketing Cloud tiene MobileConnect (SMS) o WhatsApp para Chile?
- **D33:** ¿El presentador usa su propio celular y correo para recibir los mensajes de la demo?

## Historial

| Fecha | Cambio |
|---|---|
| 17-oct-2026 | v1: recomendaciones de marketing, herramientas de Commerce y panel del presentador |
| 17-oct-2026 | Panel v2: grupos «Hora del día» (Diego), «Order Management (real)» (abrir pedido, cancelar producto) y «Casos sorpresa» (1, 2, 13, 14); M2 llega por WhatsApp y abre el mismo carrito (el momento omnicanal); enlace al nuevo `Dashboard-Demo` (vistas por perfil, alertas, pedidos por hora, embudo; datos de ejemplo) |
| 17-oct-2026 | Revisión UX v2: texto gris del panel en #A3A69E (5,65:1) |
| 17-oct-2026 | Revisión UX v2 (8): el panel muestra el guion numerado del perfil elegido (Valentina 7 pasos, Diego 7, Sofía 6) con el siguiente paso destacado, «✓ hecho» y «Reiniciar»; el resto de eventos y los casos sorpresa van en «Más eventos y casos sorpresa» (desplegable) |
| 17-oct-2026 | Revisión contra el kit v2 (1): el anuncio T2 de Diego es el Super Dúo («2 pizzas familiares por $22.590», `source_code=PJSD26`), la misma oferta que abre su Home; Halloween queda para Valentina y la temporada |
