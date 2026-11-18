# 09 · Papa Puntos

- **Lienzo:** https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk, página «09 Papa Puntos»
- **Estado:** borrador v1, 16-oct-2026
- **Principios que aplica** ([propuesta](../00-propuesta/README.md)): 5 (puntos en cada paso)
- **Producto:** Loyalty Management (sin instancia: en la demo se simula). Hoy el programa corre en Synerise (pregunta A3).

## Objetivo

Que el programa se entienda en diez segundos, que el cliente sepa cuánto tiene y qué puede canjear ya, y que canjear sea un toque dentro del carrito. Responde a la crítica: Papa John's Chile solo avisa «estás por perder puntos»; Melt explica el programa con una calculadora.

## Reglas del programa (de la configuración del cliente)

| Regla | Valor | Fuente |
|---|---|---|
| Acumulación | 1 punto por cada $1.000 | `points_convert_factor` = 0,001 |
| Valor del punto al canjear | $50 por punto (lectura del campo; equivale a 5% de vuelta) | `loyalty_point_amount_value` = 50 |
| Tope diario | 5.000 puntos por día | `max_daily_points` |
| Productos canjeables | Super Pepperoni, Boom de Jamón, Napolitana, Napolitana Caprese, Pan Pizzas | `with_enabled_loyalty` por producto |
| Vencimiento | Sin dato | Por confirmar (D18) |

## Pantallas

| # | Pantalla (archivo) | Qué muestra |
|---|---|---|
| 1 | Página Papa Puntos (`Puntos.dc.html`) | Promesa en una frase, tres reglas, calculadora «¿Cuánto pides al mes?», qué puedes canjear y con cuántos puntos, alta en un toque |
| 2 | Mis Papa Puntos · Sofía (`Puntos-Cuenta.dc.html`) | Saldo en puntos y en pesos, «Ya puedes canjear», próximo premio, movimientos recientes |
| 3 | Canje en el carrito (`Puntos-Canje.dc.html`) | El carrito de Sofía con «Canjear con tus puntos»: la pizza canjeada pasa a $0 y el saldo baja |

## Reglas de experiencia

1. **Una frase, tres reglas:** «Cada pedido te devuelve puntos para pizza gratis». Gana · Canjea · Vence (cuando se confirme).
2. **Siempre en pesos además de puntos:** «340 puntos = $17.000 para canjear».
3. **Lo que ya puedes canjear primero**, después lo que te falta.
4. **Canje en el carrito**, no en una página aparte: la pizza canjeable aparece con «Canjear por N puntos».
5. **Sin cuenta:** la página explica y ofrece crear la cuenta; en el checkout, «Guarda tus Papa Puntos».

## Modelo

| Concepto | Cómo se resuelve | Tipo |
|---|---|---|
| Saldo, acumulación y canje | Loyalty Management (miembro, transacciones, canje) | Integración |
| Mostrar saldo en el sitio | Llamada a Loyalty desde Storefront Next (con sesión) | Desarrollo |
| Producto canjeado a $0 | Promoción de Commerce aplicada al canjear (cupón generado por Loyalty) | Desarrollo + configuración |
| Página del programa | Page Designer (contenido administrable) | Estándar + componentes |
| En la demo | Saldo y movimientos simulados | — |

## Supuestos

- 1 punto = $50 al canjear (lectura de `loyalty_point_amount_value`).
- Costo en puntos de cada pizza canjeable = precio de la mediana / $50 (Super Pepperoni 260, Boom de Jamón 218, Napolitana Caprese 218).
- Saldo y movimientos de Sofía son de ejemplo.

## Historial

| Fecha | Cambio |
|---|---|
| 16-oct-2026 | v1: página del programa, cuenta de Sofía y canje en el carrito |
| 17-oct-2026 | Revisión UX v2: se oculta «¿Mis puntos vencen?» hasta confirmar la vigencia (D18) |
