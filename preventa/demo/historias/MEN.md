# MEN · Menú y categorías (diseño 02)

### MEN-01 · Menú completo, agrupado y comparable (oleada 1)
- **Historia:** Como cliente que no conoce toda la carta, quiero ver todo el menú ordenado por nivel de precio y comparar en el tamaño que me sirve, para elegir sin leer cada precio.
- **Pantallas:** `Menu.dc.html` (390), `Menu-Desktop.dc.html` (1440).
- **Criterios:**
  1. Barra de categorías fija con conteos (Ofertas, Pizzas, Acompañamientos, Bebidas, Postres, Extras). Al tocar una, la página baja a esa sección. En escritorio va horizontal arriba, sin barra lateral.
  2. Ofertas: carrusel con las 4 más relevantes según el perfil y «Ver todas».
  3. Pizzas:
     - Selector de tamaño (Mediana · Familiar · Extra grande, Familiar por defecto) que cambia todos los precios a la vez. Pan Pizza y Croissant muestran su único tamaño.
     - Filtros Todas, Más pedidas, Vegetarianas y Picantes.
     - Grupos Clásicas, Favoritas, Premium, Pan Pizza y Croissant, cada uno con su rango de precio.
  4. Las dos tarjetas de construcción van al inicio de pizzas: «Mitad y mitad: dos sabores en una pizza, pagas el promedio» (imagen dividida) y «Arma tu pizza».
  5. Cada especialidad con mitades tiene «Agregar» y «½ Mitad», que abre el armador de PRO con esa pizza en la primera mitad.
  6. Tarjetas de pizza grandes con foto en primer plano, texto que se saborea, ★ y precio. Acompañamientos, bebidas, postres y extras van en tarjetas compactas horizontales.
  7. Sin tienda elegida se ve todo el menú (principio 1).
  8. El menú carga sin saltos de layout, con skeletons del tamaño de la foto.
  9. **Buscador** «Busca entre 74 productos» (y la lupa del encabezado) con la búsqueda del template, que muestra resultados con las mismas tarjetas.
  10. La tarjeta **«Arma tu pizza» (desde $12.400)** abre la hoja de PRO con `pz-arma-tu-pizza`: sin ingredientes base y con los extras como ingredientes.
  11. Las ofertas del menú muestran la Pizza del Mes The Works en lugar del Box Halloween (S-D1).

### MEN-02 · «Agregar» según el tipo de producto (oleada 1)
- **Pantallas:** `Simple-Add.dc.html`.
- **Requerimientos:** 04 regla 1.
- **Criterios:**
  1. En una pizza, «Agregar» abre la hoja de PRO.
  2. En una bebida, el tamaño se elige en la tarjeta y «+» la agrega directo.
  3. En un producto sin opciones, «+» lo agrega directo.
  4. Al agregar, «+» se convierte en un contador (− N +) y aparece el aviso compartido `AddedToast` con el total y «Ver pedido».
  5. Si no hay tienda elegida, la primera vez se abre el panel de TIE antes de agregar y después se agrega solo.

### MEN-03 · «Tu pedido» fijo en el menú de escritorio (oleada 1, deja el punto de inserción)
- **Criterios:**
  1. En 1440 px, la columna derecha muestra «Tu pedido» con productos, total e «Ir a pagar». Se actualiza al agregar, sin recargar la página.
  2. MEN deja la columna con el resumen estándar del carrito; CAR la enriquece en la oleada 2.

### MEN-04 · Menú con pedido en curso (oleada 3, junto a SEG)
- **Pantallas:** `Menu-EnCurso.dc.html`.
- **Criterios:**
  1. Con un pedido en curso, la franja de SEG aparece sobre la barra inferior y no tapa contenido: el menú suma su altura al relleno inferior.
