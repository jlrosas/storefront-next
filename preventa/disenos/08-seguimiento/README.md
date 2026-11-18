# 08 · Confirmación y seguimiento del pedido

- **Lienzo:** https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk, página «08 Confirmación»
- **Estado:** borrador v1, 16-oct-2026

## Objetivo

Después de pagar, el cliente sabe qué compró, cuándo estará listo y en qué estado está, sin cuenta. Es el momento para activar Papa Puntos (Valentina) y para la recompra (Sofía).

## Pantallas

| # | Pantalla (archivo) | Qué muestra |
|---|---|---|
| 1 | Confirmación móvil (`Confirmacion.dc.html`) | Número de pedido, hora estimada, estados (recibido, en preparación, listo), tienda con «Cómo llegar», puntos ganados y «Crear cuenta para guardarlos», aviso por SMS y correo |

## Reglas

1. **Estados reales** cuando exista OMS: recibido → en preparación → listo para retirar (o en camino → entregado con DispatchTrack). Antes de OMS, solo «recibido» y hora estimada.
2. **Sin cuenta:** el enlace de seguimiento llega por SMS y correo (Marketing Cloud) y también se accede con número de pedido y correo (búsqueda de pedidos de invitado de Storefront Next, `order-lookup`).
3. **Puntos ganados** visibles; si es invitado, crear cuenta en un toque para no perderlos.
4. **Próximo pedido:** «Guardar como favorito» (queda en la home de Sofía) y «¿Te lo recordamos?» con día y hora sugeridos según el pedido (recordatorio de Marketing Cloud, con consentimiento).
5. **Opinión:** una pregunta de 1 a 5 cuando el pedido está listo; si la nota es baja, se abre un caso de atención.

## Modelo

| Concepto | Cómo se resuelve | Tipo |
|---|---|---|
| Página de confirmación | `order-confirmation` de Storefront Next | Estándar + diseño |
| Búsqueda de pedido de invitado | `order-lookup` de Storefront Next | Estándar (activar `guestOrderLookup`) |
| Estados del pedido | OMS con estados desde Aloha y DispatchTrack | Integración (fase 2) |
| Avisos SMS y correo | Marketing Cloud | Integración |

## Pantalla nueva (17-oct-2026)

| Archivo | Qué muestra |
|---|---|
| `Seguimiento-Cancelacion.dc.html` | Confirmación de retiro con un producto cancelado desde la consola de OMS: aviso, devolución a la tarjeta, 50 Papa Puntos de regalo y la línea tachada en el detalle. Guion en [13](../13-operacion/README.md) |

## Historial

| Fecha | Cambio |
|---|---|
| 16-oct-2026 | v1: confirmación con estados y puntos |
| 16-oct-2026 | v2: favorito, recordatorio para el próximo pedido y opinión (revisión UX R10) |
| 16-oct-2026 | v2.1 (revisión por procesos): prop `modalidad`; nueva `Confirmacion-Delivery` (En camino, Entregado, pago en efectivo con vuelto); Mercado Pago en vez de Webpay; pedido canónico $23.890 y 23 puntos |
| 16-oct-2026 | v3: confirmación de cliente registrado (puntos ya en la cuenta, «Ver en Mi cuenta»), props `cliente` y `mitades`; `Confirmacion-Sofia`; escritorio `Confirmacion-Desktop` y `Confirmacion-Desktop-Sofia`; el seguimiento de invitado se reemplaza por el pedido en curso de Mi cuenta (11) |
| 17-oct-2026 | El seguimiento también vive fuera de esta pantalla: tarjeta en la Home y franja fija sobre la barra inferior mientras hay un pedido en curso (ver 01 Home v3) |
| 17-oct-2026 | OMS real en la demo: «Lo estamos preparando», «Llega en 18 min» y «Actualizado hace 1 min» (R3.3–R3.4); prop `cancelacion` y pantalla `Seguimiento-Cancelacion`: producto cancelado desde OMS con devolución de $2.490 y 50 Papa Puntos (R1.9, R3.6); puntos «por acreditar» hasta la entrega (R1.7) |
| 17-oct-2026 | Revisión UX v2: sin botón «Simular siguiente estado (demo)»: el estado es la prop `paso` del board (en la demo lo avanza OMS); mapa de escritorio dibujado en lugar de «[MAPA DE GOOGLE]» |
