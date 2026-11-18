# CHK · Checkout y confirmación (diseños 07 y 08)

El checkout de una página de Storefront Next se adapta a un restaurante. No se diseña desde cero.

### CHK-01 · Checkout de una página para registrados (oleada 2, Opus)
- **Historia:** Como Valentina, ya identificada, quiero pagar en una sola página con mis datos cargados, para terminar en menos de un minuto.
- **Pantallas:** `Checkout.dc.html` (cliente valentina, retiro), `Checkout-Desktop.dc.html`.
- **Requerimientos:** 07 distribución v2 y reglas 1–5, R1.1, R1.2.
- **Criterios:**
  1. Encabezado reducido: «Volver al pedido» y logo.
  2. Entrega: modalidad, tienda y hora, con «Cambiar». Reemplaza la dirección y los métodos de envío del template.
  3. Pasos numerados:
     - 1 Tus datos: ya cargados, en una línea, con «Editar».
     - 2 Pago: dos tarjetas grandes lado a lado; la elegida se abre debajo.
     - 3 Comprobante.
  4. Al final, colapsados: «¿Tienes un cupón?», «Agregar nota para la tienda» y el resumen del pedido con el total visible.
  5. Botón fijo abajo con el verbo según el pago y el total («Pagar · $23.890»). Encima, los términos en una línea. Se ven los puntos que gana (dobles para Valentina: 46).
  6. Validación al salir del campo, nunca al cargar. Autocompletado `name`, `tel`, `email`, `organization`.
  7. Escritorio: pasos a la izquierda y resumen fijo a la derecha con el botón de pago.

### CHK-02 · Pago con tarjeta y efectivo (oleada 2, Opus)
- **Pantallas:** `Checkout.dc.html`, `Checkout-Delivery.dc.html`, `Checkout-Rechazo.dc.html`.
- **Requerimientos:** 07 tabla de pago, R2.8, S-D4.
- **Criterios:**
  1. **Tarjeta** (con la forma de Bricks): número con las marcas aceptadas, MM/AA, CVV, titular, RUT del titular y cuotas, más el enlace «Prefiero pagar con mi cuenta de Mercado Pago». Paga con `PJ_CARD_DEMO`.
  2. **Efectivo**, según la modalidad:
     - Retiro: «Efectivo al retirar · Pagas en la caja».
     - Delivery: «Efectivo al recibir» con «¿Con cuánto pagas?» (monto exacto, $30.000, $40.000, otro, como en el lienzo) y el vuelto calculado, guardado en `c_pjCashAmount`.
  3. **Doble clic:** al primer toque el botón pasa a «Pagando… no cierres esta página», deshabilitado. El pedido se crea una sola vez.
  4. **Rechazo:** con `4000 0000 0000 0002`, vuelve con los datos intactos, un aviso con el motivo y dos alternativas: otra tarjeta o efectivo.

### CHK-03 · Sofía paga en segundos (oleada 2)
- **Pantallas:** `Checkout-Sofia.dc.html`, `Checkout-Desktop-Sofia.dc.html`.
- **Requerimientos:** R1.8, R2.4.
- **Criterios:**
  1. Datos en una línea y tarjeta guardada Visa ····4521, que solo pide el CVV.
  2. **Canje en el checkout**, como en el lienzo: «Canjear una Super Pepperoni mediana por 260 puntos» suma la pizza a $0 (`pj-canje-puntos`). Al pagar, el saldo baja y queda en **103** (S-D12; `/resource/pj-demo/points`, `c_pjRedeemed`).
  3. **Descuento por BIN:** solo cuando el panel activa ese caso, «Descuento Banco de ejemplo · −$X» (20%, tope $5.000) aparece antes de pagar (cupón `BINDEMO`). Apagado, Sofía paga $23.890 y gana 23.
  4. Recorrido completo desde «Repetir pedido» en la Home, directo al checkout, hasta el pedido creado en menos de 1 minuto.

### CHK-04 · Comprobante y gift card (oleada 2)
- **Requerimientos:** S-D11, R2.5.
- **Criterios:**
  1. Boleta por defecto. Factura abre RUT (validado con el dígito verificador al salir del campo, con formato 76.123.456-7), razón social, giro y dirección. Se guardan en `c_pjDoc*`.
  2. Gift Card `PJ-GIFT-2026` en «¿Tienes un cupón o gift card?»: descuenta $10.000 del total y el resto se paga con tarjeta o efectivo.
  3. Un cupón inválido muestra un mensaje claro junto al campo.

### CHK-05 · ¡Pago aprobado! en la misma pantalla (oleada 2)
- **Pantallas:** `Confirmacion.dc.html`, `Confirmacion-Sofia.dc.html`, `Confirmacion-Delivery.dc.html`, `Confirmacion-Desktop*.dc.html`.
- **Requerimientos:** 07 revisión UX v2 (9), 08 reglas 3 y 4, R1.7.
- **Criterios:**
  1. Al aprobarse, aparece «¡Pago aprobado!» con el número de pedido, cuándo está listo, la tienda con «Cómo llegar» y «+23 Papa Puntos por acreditar». Un solo botón principal: «Seguir mi pedido». Los textos de SMS o correo cambian según S-D13.
  2. **CHK es dueño de la pantalla de confirmación.** Deja el punto de inserción de los estados, donde SEG-01 monta la barra de avance en vivo. En la oleada 2 se ve el estado inicial «Recibido».
  3. «Guardar como favorito» (agrega a `c_pjFavorites`) y «¿Te lo recordamos el viernes?» (guarda `c_pjReminder`; «Listo, te lo recordaremos el viernes»).
  4. La versión de delivery muestra la dirección, la ventana 21:05–21:15 y el pago en efectivo con vuelto.
  5. Escritorio: dos columnas con el mapa dibujado (no un marcador de texto).

### CHK-06 · El pedido queda bien registrado (oleada 2)
- **Criterios:**
  1. El pedido en Commerce tiene las líneas con opciones, mitades y combos, la modalidad, la tienda, el pago, el comprobante, la nota, `c_pjPointsEarned` y `c_pjStatus = recibido`.
  2. Se puede ver en Business Manager y con SCAPI.
