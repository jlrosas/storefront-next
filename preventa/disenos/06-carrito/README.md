# 06 · Carrito (Mi pedido)

- **Lienzo:** https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk, página «04 Agregar al carro», pantalla 4 «Mi pedido»
- **Estado:** borrador v2, 16-oct-2026
- **Principios que aplica** ([propuesta](../00-propuesta/README.md)): 3 (precio visible), 5 (puntos)

## Objetivo

Que el cliente vea exactamente lo que va a recibir, pague el mejor precio posible sin tener que buscarlo y llegue al checkout con un toque.

## Pantallas

| # | Pantalla (archivo) | Qué muestra |
|---|---|---|
| 1 | Mi pedido (`Pedido.dc.html`) | Modalidad y tienda, líneas con foto y configuración, «Conviértelo en combo» cuando conviene, puntos, total y «Ir a pagar» |

## Reglas

1. **Una sola oferta en el carrito** (máximo dos momentos de venta cruzada en todo el pedido, ver [revisión UX](../revision-ux-v1.md) R7):
   - Si los productos del carrito arman un combo vigente más barato (por ejemplo, pizza + palitos + bebida 1,5 L), se ofrece **«Conviértelo en combo y ahorra $X»**. Es la oferta prioritaria porque baja el precio y mantiene lo elegido.
   - Si no hay combo posible, se ofrece una mejora de la pizza (borde de queso) que respeta la masa elegida.
2. **Al aceptar el combo**, las líneas sueltas se agrupan en una línea «Combo» con su detalle y el total baja de inmediato.
3. **Cada pizza muestra su configuración** (tamaño, masa, sin o con ingredientes) y «Editar» vuelve a la hoja con todo marcado.
4. **Puntos que gana** con el total actual.
5. **Cupón:** solo en el checkout (revisión por procesos, T7); el carrito no lo muestra.

## Modelo en Commerce Cloud

| Concepto | Cómo se resuelve | Tipo |
|---|---|---|
| Detectar que conviene un combo | Promoción de tipo «producto con descuento por conjunto» (bundle/combo) del motor de promociones; Storefront Next muestra la promoción aplicable | Configuración + desarrollo |
| Agrupar líneas como combo | Producto set o bundle con precio de combo | Desarrollo |
| Mejora de masa | Cambio de variante de la línea | Estándar |

## Supuestos

- Ahorro del combo en el diseño: $2.490 sobre Palitos de Ajo + Coca-Cola 1,5 L (ejemplo, E18).

## Historial

| Fecha | Cambio |
|---|---|
| 16-oct-2026 | v1: pantalla «Mi pedido» dentro del diseño 04 |
| 16-oct-2026 | v2: «Conviértelo en combo» como oferta prioritaria; mejora de masa solo si no hay combo |
