# CAR · Carrito «Mi pedido» (diseños 06 y 09 p3)

### CAR-01 · Mi pedido claro (oleada 2)
- **Historia:** Como cliente, quiero ver exactamente lo que voy a recibir y cuánto pago, para ir a pagar con confianza.
- **Pantallas:** `Pedido.dc.html` (390), `Carrito-Desktop.dc.html` (panel lateral de 440 px en 1440).
- **Requerimientos:** 06 reglas 3–5, R1.1.
- **Criterios:**
  1. Arriba van la modalidad y la tienda («Retiro en El Bosque · Listo en 15 min · abierta hasta 23:30») con «Cambiar».
  2. Cada línea lleva foto, nombre, precio y configuración (tamaño, masa, «sin cebolla», extras o mitades). «Editar» abre la hoja de PRO en modo edición.
  3. Se ven los puntos que gana con el total actual y el total. Botón «Ir a pagar» y «Seguir viendo el menú».
  4. En escritorio se abre como panel lateral sobre la página, y el «Tu pedido» de MEN-03 usa el mismo componente.
  5. El cupón no aparece en el carrito: va solo en el checkout.
  5b. Una línea de combo lista las pizzas elegidas desde `c_pjComboChoices` («Pollo BBQ + Todas las Carnes»), y las opciones de extras en `no` no se muestran (contrato §7). Origen: VAL-OFE.
  6. «Ir a pagar» sin sesión abre el ingreso de ING; con sesión, lleva al checkout.

### CAR-02 · «Conviértelo en combo» (oleada 2)
- **Requerimientos:** R2.2, 06 reglas 1 y 2, DAT-08.
- **Criterios:**
  1. Si el carrito tiene pizza + Palitos de Ajo + Coca-Cola 1,5 L, aparece una sola oferta con borde rojo: «Ahorras $2.490 · Tus Palitos y tu Coca-Cola salen más baratos en combo» con «Convertir».
  2. Al convertir, las líneas sueltas pasan a «Combo Palitos y bebida» y el total baja de inmediato. Los precios vienen de la promoción.
  3. Si no hay combo posible, se ofrece la mejora a borde de queso, que respeta la masa elegida y dice exactamente qué cambia.
  4. Nunca hay más de una oferta en el carrito.

### CAR-03 · Una línea de umbral (oleada 2)
- **Requerimientos:** R2.3.
- **Criterios:**
  1. Con delivery bajo $12.000 aparece «Te faltan $X para pedir delivery». La línea de «agrega una bebida» se saca: su precio no cuadraba y sería una segunda oferta en el carrito (REV).

### CAR-04 · Canje de Papa Puntos en el carrito (oleada 2)
- **Pantallas:** `Puntos-Canje.dc.html`.
- **Requerimientos:** R1.3, R1.4, R1.5, R1.8, 09 regla 4.
- **Criterios:**
  1. Con sesión y saldo suficiente, una pizza canjeable aparece con «Canjear por N puntos» (Super Pepperoni mediana 260).
  2. Al canjear, la línea queda en $0 (promoción `pj-canje-puntos`) y se ve «Canjeaste 260 puntos. Te quedan 80». El descuento real de puntos ocurre al pagar (CHK).
  3. Si el saldo no alcanza, se muestra cuánto falta.
  4. Usa el mismo componente de canje que el checkout (CHK-03). En el guion de Sofía el canje ocurre en el checkout (S-D12); esta pantalla es la alternativa del lienzo.
