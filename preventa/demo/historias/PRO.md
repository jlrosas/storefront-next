# PRO · Producto: hoja, «Hazlo combo», ficha y mitades (diseños 04 y 02 p3)

### PRO-01 · Hoja «Arma tu pizza» (oleada 1, Opus)
- **Historia:** Como cliente, quiero ajustar mi pizza sin salir del menú y agregarla en un toque, para pedir rápido y a mi gusto.
- **Pantallas:** `Sheet-Pizza.dc.html`.
- **Requerimientos:** 04 reglas 2–5 y 8, R1.1, R4.6.
- **Criterios:**
  1. La hoja sube sobre el menú con foto grande y cercana, el texto que se saborea y ★.
  2. Abre preseleccionada en Familiar + Tradicional: se agrega con un toque, sin elegir nada.
  3. Tamaño y masa son variantes reales. El borde de queso muestra el recargo real del catálogo (el lienzo usa «+$3.490»; `Mitades` dice +$2.790, y manda el catálogo de DAT en todas las pantallas).
  4. Los ingredientes base aparecen con foto y se pueden quitar sin cambiar el precio (se muestra «Sin cebolla»). Los extras aparecen con foto y precio según el tamaño (opción `pjExtras`).
  5. El botón muestra el total en vivo: (tamaño + masa + extras) × cantidad. Debajo, «Ganas N Papa Puntos».
  6. **Champiñón agotado en El Bosque** (con tienda elegida): el chip aparece bloqueado con «Agotado en El Bosque» y sugiere un sustituto.
  7. Al agregar:
     - La línea del carrito lleva las opciones y `c_pjRemoved`.
     - Aparece `AddedToast` con «+N Papa Puntos por acreditar» y «Deshacer».
     - El contador del pedido salta.
  8. Sin tienda elegida, pasa primero por el panel de TIE y vuelve a la hoja con todo conservado.

### PRO-02 · «Hazlo combo» después de la primera pizza (oleada 1)
- **Pantallas:** `Complementa.dc.html`.
- **Requerimientos:** 04 v2 (R6, R7), DAT-08.
- **Criterios:**
  1. Solo después de agregar la **primera** pizza del pedido, la hoja confirma «Pollo BBQ agregada · Familiar · Tradicional · sin cebolla» con «Editar».
  2. Oferta principal: «Suma Palitos de Ajo y Coca-Cola 1,5 L · +$6.990 · Ahorras $2.490», con sabor de la bebida (Original, Sin azúcar, Light) y botón rojo «Sí, hazlo combo». El precio y el ahorro los entrega la promoción, no la pantalla.
  3. Debajo, «O agrega por separado»: Cheesyqueños, Chicken Poppers y Brownie con «+».
  4. Pie con «Ver pedido (N) · total» y «No, gracias. Seguir viendo el menú».
  5. No vuelve a aparecer con la segunda pizza.

### PRO-03 · Ficha de producto que da hambre antes que precio (oleada 1)
- **Pantallas:** `PDP-Mobile.dc.html`, `PDP-Desktop.dc.html`.
- **Requerimientos:** 04 v3, R4.4, R4.5, R4.6, R4.7, D35–D37.
- **Criterios:**
  1. Orden: foto con movimiento lento, pausa y lupa → nombre → ★ 4,7 · 1.240 opiniones → descripción que se saborea → destacados (para cuántos según el tamaño, «Lista en 15 min en El Bosque» si hay tienda, disponible hoy, puntos que ganas) → configurador. El precio aparece en el tamaño y en el botón, no antes del antojo.
  2. «Pedida 320 veces esta semana», la distribución de estrellas y dos opiniones con «Compra verificada». No dice «Datos de ejemplo» en pantalla.
  3. El configurador es el mismo de la hoja (PRO-01), incluido el ingrediente agotado.
  4. «Completa tu pedido»: los complementos marcados se agregan junto con la pizza con un solo botón.
  5. Hay preguntas frecuentes (porciones, picante, mitades). La información nutricional se oculta hasta tener el dato.
  6. Barra fija con el total; en escritorio, dos columnas (foto a la izquierda, configurador a la derecha).
  7. Al agregar: la pizza vuela al carro, el contador salta, aparece el aviso con puntos y «Deshacer», y el botón pasa a «Ver mi pedido».
  8. URL propia `/p/<id>` con título y descripción para SEO.
  9. **LCP de la foto ≤ 2,5 s** en móvil (Lighthouse).

### PRO-04 · Armador mitad y mitad (oleada 1, Opus)
- **Historia:** Como pareja que no se pone de acuerdo, queremos una pizza con dos sabores y saber cuánto pagamos, para pedir una sola Familiar.
- **Pantallas:** `Mitades.dc.html`, `Pedido-Mitades.dc.html` (la línea).
- **Requerimientos:** R2.1, 02 reglas 2–4, DAT-04.
- **Criterios:**
  1. La pizza dividida se arma a la vista. Tamaño y masa son para toda la pizza, y cada mitad se elige de una grilla con fotos (solo las 16 especialidades).
  2. Precio explicado en pantalla: «Pagas el promedio de las dos mitades»; Pollo BBQ + Todas las Carnes Familiar = $17.900. El precio viene del carrito (hook de DAT), no de la pantalla.
  3. Desde «½ Mitad» del menú, la primera mitad viene puesta. Desde la Home de Sofía «después», vienen las dos (Pollo BBQ y Todas las Carnes).
  4. En el carrito, la línea muestra la foto dividida, «½ Pollo BBQ · ½ Todas las Carnes» y «Editar mitades», que vuelve al armador con las mitades marcadas.

### PRO-05 · Editar una pizza del carrito (oleada 1, para CAR)
- **Criterios:**
  1. Abrir la hoja en modo edición con la línea existente (`itemId`) deja todo marcado y «Guardar cambios» actualiza esa línea, sin crear otra.
