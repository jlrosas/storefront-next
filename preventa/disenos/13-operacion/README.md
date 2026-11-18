# 13 · Operación: back office y Order Management

- **Estado:** borrador v1.1, 24-oct-2026
- **Alcance de OMS en la propuesta:** Order Management **registra y sincroniza** las órdenes de todos los canales; MuleSoft lo conecta con la API PJ / Aloha, DispatchTrack, Zendesk y el DWH. Cancelaciones, reembolsos, compensaciones y la consola de incidencias por tienda son **fase futura** ([alcance de OMS](../../propuesta/oms/alcance-oms.md)). La demo muestra algunas de esas acciones para enseñar hacia dónde crece; se presentan así, no como alcance de la fase 1
- **Lienzo:** sin pantallas propias. Se usan las consolas reales (Business Manager, Page Designer, Order Management, Marketing Cloud); lo que ve el cliente en la tienda está en [01](../01-home/README.md), [08](../08-seguimiento/README.md) y [12](../12-marketing/README.md)
- **Requerimientos:** [R3 y R5 de requerimientos de construcción](../requerimientos-demo.md)

## Objetivo y alineación con el cliente

El kit pide como **primera tarea de la POC** «configurar una campaña y sus reglas comerciales», y además que el partner muestre «una modificación comercial → su aprobación → publicación por canal → impacto en una orden → trazabilidad para Operaciones y SAC». También pide ver qué pasa con la orden después del pago y qué ve SAC.

En una demo de tienda eso no se ve. Esta página es el **guion de la parte operativa**: dos consolas reales y lo que el cliente ve en la tienda al mismo tiempo.

Para Papa Johns el argumento es: **el equipo comercial publica sin TI, el pedido tiene un solo registro de punta a punta y SAC ve todo en una pantalla.** Es lo que hoy les cuesta (banners con texto incrustado, órdenes repartidas entre Ecommerce, API Papa Johns y Aloha).

## Qué es real y qué se simula

| Parte | En la demo | Cómo se presenta |
|---|---|---|
| Promoción, calendario y contenido | Real (Business Manager y Page Designer) | En vivo |
| Pedido después del pago | Real (Order Management) | En vivo |
| Tienda (Aloha, NCR, KDS) y despacho (DispatchTrack) | Simulado | El presentador avanza el pedido en OMS «como si fuera la tienda». Se explica con la arquitectura dónde entran MuleSoft, la API Papa Johns y NCR Cloud Connect (00 §3) |
| Puntos | Simulado (R1) | «Así se integra con Synerise vía MuleSoft» |
| Mensajes al cliente | Real (Marketing Cloud, M1) | Llegan al celular del presentador. En la propuesta, los avisos de estado los envía Synerise (S22) |

## Guion A · De la campaña al pedido (4 min)

| Paso | Consola | Qué hace el presentador | Qué ve el cliente |
|---|---|---|---|
| A1 | Business Manager → Promociones | Abre «Super Dúo»: precio fijo, vigencia, calificador «solo retiro en El Bosque» | Que Comercial maneja reglas sin desarrollador |
| A2 | Business Manager → Campañas | Le asigna el grupo de clientes «Llegan desde anuncio» y un *source code* | Que la promesa del anuncio se configura, no se programa |
| A3 | Page Designer | Programa el hero de la Home de Diego con la oferta, con fecha de inicio; previsualiza como Diego | Previsualización por perfil y programación |
| A4 | Tienda | Abre la tienda con el enlace del anuncio: aparece el hero y el constructor | El cambio publicado en la tienda |
| A5 | Tienda | Diego arma el Super Dúo y paga | — |
| A6 | Order Management | Abre el pedido recién creado: promoción aplicada, pago, productos | **Un solo registro del pedido**, con la promoción que lo originó (trazabilidad) |

## Guion B · El pedido después del pago y SAC (4 min)

| Paso | Consola | Qué hace el presentador | Qué ve el cliente (tienda y celular) |
|---|---|---|---|
| B1 | OMS | Pedido de Valentina en «Recibido» | Franja fija «Recibido · llega 21:05–21:15» |
| B2 | OMS | Pasa la Fulfillment Order a «En preparación» | La barra avanza; «actualizado hace 1 min» |
| B3 | OMS | «Falta la bebida en la tienda»: cancela esa línea. Se dice que es la **fase siguiente** sobre el mismo registro | En la tienda: línea tachada, «Te devolvimos $2.490» y «+50 Papa Puntos por la molestia» (`Seguimiento-Cancelacion`). En el celular: SMS de M1 |
| B4 | OMS (vista de servicio) | Muestra el pedido como lo vería un agente: pagos, historial de estados y, en la demo, el reembolso. En la propuesta, el agente lo ve en Zendesk con el contexto que entrega MuleSoft | **Lo que hoy SAC no tiene**: el caso completo sin preguntar al local |
| B5 | OMS | Pasa a «En camino» y el panel fija «llega en 18 min» | «En camino · llega en 18 min»; SMS de M1 |
| B6 | OMS | Marca «Entregado» | Puntos acreditados; «¿Qué tal tu pedido?» en la Home |

Si la integración de estados de OMS hacia la tienda no está lista para la demo, el panel del presentador envía el mismo estado (R3.5); se dice en voz alta.

## Reglas

1. **El pedido de la demo siempre se abre en OMS** después del pago: es la prueba de que existe un solo registro.
2. **Estados del cliente mapeados a OMS** según la tabla de [R3](../requerimientos-demo.md#r3--pedido-estados-y-eta-oms-real--simulado).
3. **Cancelación parcial** con reembolso del producto y compensación en puntos (R1.9); nunca cancelar el pedido completo en la demo. Se presenta como fase futura, no como parte de la fase 1.
4. **Datos de prueba**: los pedidos de la demo usan el contacto del presentador.

## Modelo

| Concepto | Cómo se resuelve | Tipo |
|---|---|---|
| Pedido de Commerce en OMS | Conector B2C Commerce ↔ Order Management (Order Summary + Fulfillment Order) | Integración (estándar, validar en la org, B11) |
| Avance del pedido | Estados de Fulfillment Order en la consola | Estándar |
| Cancelación y reembolso parcial | Acciones de Order Summary (cancelar ítem, reembolso) | Estándar. En la propuesta, fase futura |
| Estado en la tienda | Consulta del estado desde Storefront Next | Desarrollo |
| Mensaje al cliente | Demo: Flow de OMS → Journey Builder (M1). Propuesta: Synerise, con los estados que entrega MuleSoft (S22) | Integración |
| Compensación en puntos | Demo: simulado (R1.9). Propuesta: Synerise vía MuleSoft, en la fase futura de cancelaciones | Simulado |
| Tienda, API Papa Johns, NCR, DispatchTrack | Fuera de la demo; en el proyecto, OMS entrega el pedido a la API Papa Johns vía MuleSoft, una sola vez, y recibe los estados de cocina y reparto | Explicar |
| Contexto para el SAC | En el proyecto, Zendesk consulta orden, pago y estado vía MuleSoft | Explicar |

## Decisiones abiertas

- **B11:** ¿qué org de OMS conectamos al sandbox y está el conector configurado?
- **D38:** ¿quién opera la consola de OMS durante la demo (el presentador o un segundo integrante)?

## Historial

| Fecha | Cambio |
|---|---|
| 17-oct-2026 | v1: OMS con instancia real en la demo; guion de campaña a pedido y de pedido a SAC |
| 24-oct-2026 | v1.1: alcance de OMS de la propuesta (registra y sincroniza; cancelaciones, reembolsos y consola de incidencias en fase futura); MuleSoft entre OMS y los sistemas de Papa Johns; puntos en Synerise; avisos de estado por Synerise (S22) |
