# HOM · Home (diseño 01)

Una sola portada que cambia según quién llega. Se arma con componentes de Page Designer y la decide `getDemoProfile`.

### HOM-01 · Home de Valentina, que da hambre (oleada 1)
- **Historia:** Como Valentina, que vuelvo después de 2 años, quiero ver primero comida que se me antoje y una oferta clara, para animarme a pedir de nuevo.
- **Pantallas:** `Home.dc.html` (390) y `Home-Desktop.dc.html` (1440).
- **Requerimientos:** R4.1, R4.7, R4.8, S-D1, S-D8.
- **Criterios:**
  1. Lo primero que se ve es el hero de temporada **Pizza del Mes The Works Familiar a $10.990, antes desde $21.900** (S-D1, tabla §1.1), con foto a sangre en primer plano y movimiento lento con botón de pausa. Respeta «reducir movimiento». El precio es texto, nunca parte de la imagen. **LCP del hero ≤ 2,5 s** en móvil (Lighthouse).
  2. El saludo va en una línea bajo el encabezado, después de la comida, con el texto del lienzo («Hola de nuevo. Tu pedido de vuelta suma Papa Puntos dobles»). El bloque «Pizza del mes» del lienzo se quita porque ya es el hero.
  3. El botón del hero abre el producto listo para agregar, no un listado.
  4. Bloques en el orden del lienzo:
     - Empieza tu pedido (Delivery o Retiro, con tiempos).
     - «Más vendidas», con ★ e insignias, y «N esta semana» solo si N ≥ 100.
     - Beneficios del canal propio, sin «sin crear cuenta» (S-D13).
  5. Aviso de cookies en la primera visita, que no tapa el hero.
  6. El hero, los bloques y los textos se editan en Page Designer, y cada bloque tiene su componente con `@Component`.

### HOM-02 · Home de Diego: la promesa del anuncio (oleada 1)
- **Historia:** Como Diego, que llego desde el anuncio del Super Dúo, quiero ver esa misma oferta al entrar, para comprarla sin buscarla.
- **Pantallas:** `Home-Diego.dc.html`, `Home-Desktop-Diego.dc.html`.
- **Requerimientos:** R4.1, R4.2, R4.3, S-D2, T2 (`PJSD26`).
- **Criterios:**
  1. Con `?utm_campaign=PJSD26` el hero es «La oferta que viste»: Super Dúo a $22.590, antes $27.800, con el mismo nombre y precio que el anuncio. El botón abre el constructor del Super Dúo.
  2. «¿Para cuántos?» en carrusel con foto: Para 1 Papa Flash $5.490 · Para 2 Papa Combo Palitos $16.490 · Para 3 «armado para 3» (Pizza del Mes The Works + Palitos + bebida 1,5 L, suma real) · Para 4 Super Dúo · Para 6+ Super Trío. Los precios crecen con las personas. El hero dice «Para 4», igual que el carrusel (S-D16).
  3. **Destinos:** Papa Flash y Papa Combo Palitos abren su ficha (S-D3). «Para 3» agrega las tres líneas al carrito con el aviso. Super Dúo y Super Trío abren su constructor.
  4. «¿Y para este momento?» va después, como una tarjeta compacta que cambia con la hora (S-D2: Almuerzo Papa Flash · Partido Super Trío · Celebración Papa Combo con Postre · Bajón Papa Combo Palitos) y se puede tocar. `?hora=` la fuerza.
  5. Siguen «Más vendidos». No hay «Promos del día»: no están en el lienzo.

### HOM-03 · Home de Sofía: «¿Lo de siempre?» (oleada 1)
- **Historia:** Como Sofía, cliente frecuente, quiero repetir mi pedido de siempre en un toque y ver mis puntos, para pedir en segundos.
- **Pantallas:** `Home-Sofia.dc.html`, `Home-Desktop-Sofia.dc.html`.
- **Requerimientos:** R1.6, R4.1.
- **Criterios:**
  1. «Hola, Sofía» con su saldo: 340 Papa Puntos = $17.000.
  2. El hero «¿Lo de siempre?» muestra su último pedido real (Pollo BBQ Familiar sin cebolla + Combo Palitos de Ajo con Coca-Cola Sin azúcar 1,5 L · 2 oct · $23.890) con foto en primer plano y «Repetir pedido». **Como en el lienzo, «Repetir pedido» carga el pedido en el carrito con `useReorder` y lleva directo al checkout** (CHK-03), sin pasar por «Mi pedido».
  3. Favoritas (desde `c_pjFavorites`), «Ya puedes canjear una Super Pepperoni mediana (260 puntos)» y la Pizza del Mes The Works.

### HOM-04 · Componentes de Page Designer de la Home (oleada 1)
- **Criterios:**
  1. Componentes registrados y generados en el cartucho: hero de comida con video, ocasiones, carrusel «Para cuántos», más pedidas, beneficios, «¿Lo de siempre?» y saldo.
  2. La visibilidad por perfil usa grupos de clientes de Page Designer (contrato §2), y una sola página `homepage` sirve a los tres perfiles.
  3. INT puede cambiar el hero de temporada desde Business Manager sin desplegar código.

### HOM-05 · Home de Sofía con pedido en curso (oleada 3)
- **Pantallas:** `Home-Sofia-EnCurso.dc.html`, `Home-Desktop-Sofia-EnCurso.dc.html`.
- **Requerimientos:** R1.7, S-D5.
- **Criterios:**
  1. Si Sofía tiene un pedido con `c_pjStatus` distinto de entregado o retirado, la tarjeta de seguimiento de SEG reemplaza a «¿Lo de siempre?»: estado, «listo a las 20:45», El Bosque, «Cómo llegar» y «Ver detalle».
  2. Debajo: «+23 Papa Puntos al retirar», «¿Te lo recordamos el viernes?» y favoritas.
  3. No se ofrece «Repetir» el mismo día.

### HOM-06 · Home de Sofía después de recibir (oleada 3)
- **Pantallas:** `Home-Sofia-Despues.dc.html`.
- **Criterios:**
  1. Si el pedido se entregó o se retiró hace menos de 24 h, aparece «¿Qué tal tu Pollo BBQ?» con 1 a 5 estrellas, **usando el componente de SEG-03** (HOM no lo construye).
  2. Se muestran los puntos actualizados: **103** ($5.150) después del canje (S-D12), y lo que le falta para el próximo canje.
  3. Aparece la próxima mejor acción: «La próxima, prueba Todas las Carnes por mitades», que abre el armador con esas mitades.
