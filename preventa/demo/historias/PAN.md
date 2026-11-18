# PAN · Panel del presentador (diseño 12, reducido a Commerce)

No es parte de la tienda. Reemplaza lo que en producción harían OMS y Marketing Cloud.

### PAN-01 · Guion y estado de la demo (oleada 3)
- **Historia:** Como presentador, quiero llevar el guion de cada perfil y dejar la tienda en el estado que necesito, para que la demo fluya sin improvisar.
- **Pantallas:** `Panel-Demo.dc.html` (sin el teléfono de muestra ni Marketing Cloud).
- **Requerimientos:** R6.1, R6.3 (sin OMS), R6.4.
- **Criterios:**
  1. Ruta `/demo/panel` protegida con una clave de presentador en cookie. No aparece en la navegación ni en el sitemap.
  2. Elegir perfil (Valentina, Diego, Sofía) abre la tienda en otra pestaña con `?perfil=` y la URL de entrada del guion (Diego: `?utm_campaign=PJSD26`).
  3. Muestra el guion numerado del perfil elegido, con el siguiente paso destacado, «✓ hecho» y «Reiniciar».
  4. Hora del día: Almuerzo, Partido, Celebración, Bajón y Ahora (`?hora=`).
  5. Casos sorpresa:
     - 1: tienda cerrada.
     - 2: Super Dúo solo retiro (activa `pj-super-duo-pickup`, S-D15).
     - BIN: descuento por banco en la tarjeta de Sofía (S-D12).
     - 14: abre `/promos/box-halloween`.
     - 15: ETA +15 min.
     Cada uno deja la tienda en ese estado y se puede deshacer.
  5b. Guion sin Marketing Cloud ni OMS:
     - **Valentina:** abrir su Home → arma su pedido → ingresa con código → paga → avanzar el estado → retirado.
     - **Diego:** abrir el anuncio (`?utm_campaign=PJSD26`) → constructor del Super Dúo → paga.
     - **Sofía:** Home reconocida → «Repetir» → checkout con canje → avanzar el estado → Home «después» con 103 puntos.
     El correo de reactivación y el carrito abandonado se cuentan con la lámina de arquitectura.
  6. Reiniciar la demo: vacía los carritos y restaura los saldos de puntos y el estado de las tiendas.

### PAN-02 · Avanzar el pedido (oleada 3)
- **Requerimientos:** S-D5, R3.3.
- **Criterios:**
  1. Lista los pedidos de la demo de hoy, con el último arriba.
  2. Los botones recibido → en preparación → listo (o en camino) → entregado o retirado cambian `c_pjStatus` y `c_pjStatusAt`. La tienda lo refleja en ≤ 30 s.
  3. «+15 min» mueve `c_pjEta`.
  4. Muestra el último código de ingreso emitido (ING-02).
  5. Muestra el evento de cada botón, por ejemplo `order.status_changed → listo`, para la parte técnica de la presentación.
