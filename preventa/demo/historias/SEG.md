# SEG · Seguimiento del pedido (diseño 08 y 01 v3)

Sin OMS: el estado vive en `c_pjStatus` y lo avanza el panel (S-D5).

### SEG-01 · Página de seguimiento (oleada 3)
- **Historia:** Como cliente que ya pagó, quiero saber en qué va mi pedido y cuándo está listo, sin llamar al local.
- **Pantallas:** `Confirmacion.dc.html` y `Confirmacion-Delivery.dc.html` (estados), `Confirmacion-Desktop.dc.html`. SEG construye el componente de estados en `pj-tracking` y lo monta en el punto que deja CHK-05; no edita la pantalla de confirmación.
- **Requerimientos:** R3.2, R3.3, R3.4, R1.7.
- **Criterios:**
  1. Barra de avance con los estados del contrato §4.4: «Lo estamos preparando», «Listo para retirar», «Llega en 18 min».
  2. Muestra «Actualizado hace X min» (desde `c_pjStatusAt`) y la hora estimada (`c_pjEta`).
  3. El estado se consulta cada 30 s mientras el pedido está en curso, y se actualiza sin recargar la página.
  4. Al pasar a entregado o retirado, los puntos pasan de «por acreditar» a «acreditados» y suben en la cuenta (`/resource/pj-demo/points`).
  5. Se llega desde «Seguir mi pedido», desde la franja y desde Mi cuenta.

### SEG-02 · Franja fija y tarjeta de pedido en curso (oleada 3)
- **Pantallas:** `Menu-EnCurso.dc.html`, `Home-Sofia-EnCurso.dc.html`, `Home-Desktop-Sofia-EnCurso.dc.html`.
- **Criterios:**
  1. Con un pedido en curso, la franja «En preparación · listo 20:45» se ve en todas las pantallas: sobre la barra inferior en móvil y bajo el encabezado en escritorio. Abre el seguimiento.
  2. Al entregarse, la franja cambia a «¿Qué tal tu pedido?» por 24 h y después desaparece.
  3. Se exporta la tarjeta de seguimiento de la Home para que HOM la use (HOM-05).

### SEG-03 · Opinión de 1 a 5 (oleada 3)
- **Criterios:**
  1. Cuando el pedido está entregado o retirado, aparece «¿Qué tal tu Pollo BBQ?» con 1 a 5. La nota se guarda en el pedido (`c_pjOrderRating`). **SEG es dueño de este componente**; HOM-06 lo usa.
  2. Con nota ≤ 2 se muestra el texto del lienzo («Lo sentimos. Te contactamos hoy para resolverlo»), sin integración con SAC en la demo.
