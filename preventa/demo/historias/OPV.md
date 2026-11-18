# OPV · Oleada de pulido visual (aprobada por Raúl el 06-nov)

- **Fuente:** [UX-1 · Dirección visual](../revisiones/UX-1-direccion-visual.md). Cada historia cita sus ítems (P1-n, P2-n, P3-n, Fn) y su sección (3.1 a 3.6). **La especificación es la del informe**: estas historias reparten el trabajo y fijan cuándo está hecho.
- **Objetivo:** que la demo «entre por los ojos» y compita con las mejores apps de delivery, dentro de la marca oficial (S-D18). La pizza se ve cerca, hay ritmo de color, una jerarquía clara, elementos de marca, movimiento y voz BGYS.
- **Proteger** lo que funciona (UX-1, «Lo que funciona bien»): contraste, áreas táctiles de 44 px, el panel de tienda, el constructor, la oferta vencida y el Ken Burns con pausa.

## Paso A · VIS (tema y piezas comunes) — va primero

### VIS-01 · Fotografía macro en un solo componente
- **Ítems:** P1-2, F6, sección 3.2.
- **Criterios:**
  1. `FoodImage` acepta `crop="macro" | "hero" | "combo" | "none"`, con los valores del informe y sin *letterbox*.
  2. Los usos actuales de `FoodImage` en las extensiones pasan a `macro` (tarjetas y ficha) o `hero` (heros). Lo que no use `FoodImage` y muestre comida se migra a él.
  3. En la tarjeta «momento» de Diego, la pizza queda al centro (`combo`).
  4. Historia de Storybook con las 4 variantes.

### VIS-02 · Sello LTO y precio display
- **Ítems:** P1-4, P1-5, sección 3.4.
- **Criterios:**
  1. Componente nuevo `LtoBadge` (círculo, Papa Sans Condensed, 4 variantes ADA del playbook, tamaños `sm`, `md` y `lg`, rotación opcional de −3°).
  2. `PriceTag` agrega `variant="display"`: `$` en superíndice, Condensed, Rich Sauce sobre crema y lima sobre verde o granate (prop `surface`).
  3. Las pastillas «-50%» y «-19%» de las extensiones pasan a `LtoBadge`. Los precios protagonistas (hero, destacada, constructor y ficha) pasan a `display`.
  4. Historias de Storybook.

### VIS-03 · Escala tipográfica y colores fuera de paleta
- **Ítems:** P1-7, P1-8, sección 3.3, y el texto mínimo de 12 px (tabla de accesibilidad).
- **Criterios:**
  1. Siete tamaños con utilidades `.pj-display`, `.pj-h1`, `.pj-h2`, `.pj-card-title`, `.pj-body`, `.pj-small` y `.pj-micro` (≥ 12 px) en `base.css`.
  2. Los titulares van en Fresh Basil y nunca en negro. Los títulos de grupo van en Condensed.
  3. Ningún texto queda bajo 12 px.
  4. Los hex fuera de paleta de los 6 archivos del informe, y cualquier otro que encuentres con `rg '#[0-9A-Fa-f]{6}' src/extensions`, pasan a tokens oficiales.
  5. `pnpm lint` sin excepciones de color.

### VIS-04 · Ritmo de color en el tema
- **Ítems:** P1-6, sección 3.1.
- **Criterios:**
  1. Tokens y utilidades de superficie (`surface-basil`, `surface-sauce`, `surface-garlic`, `surface-dough`, `surface-pepperoncini`), cada una con su color de texto ADA correcto ya incluido.
  2. Hay sombras cálidas (`shadow-pj-float`, `shadow-pj-card` cálida) y un radio de sección.
  3. La regla «nunca dos bloques verdes seguidos» queda documentada en `pj-shared/README.md`, con la tabla de combinaciones del informe. Las pantallas las aplican en el paso B.

### VIS-05 · Micro-interacciones, aviso, barra inferior, cookies y footer
- **Ítems:** P1-9, P1-10, P2-19, sección 3.5. Si queda tiempo: P3-20 y P3-21.
- **Criterios:**
  1. Al agregar, el contador del carrito «salta» y una miniatura vuela al carrito (`flyToCart` en pj-shared). Todo respeta «reducir movimiento».
  2. El aviso «¡Agregada!» queda contenido a 390 px.
  3. La barra inferior muestra la píldora activa con el punto Tomato y etiquetas de 12 px.
  4. La barra de cookies es compacta (unos 72 px), dice «Estas cookies no se comen» y va fija sobre la barra inferior.
  5. El footer es más bajo, con el lockup «Mejores ingredientes. Mejor pizza.».
  6. Opcional: grano SVG al 4 % y `AccentWord`.

## Paso B · Pantallas (en paralelo, sobre `demo` con VIS integrado)

### HOM-07 · Home que da hambre (HOM)
- **Ítems:** P1-3, P1-6 (aplicación), P2-11 (tarjetas de la Home), P2-13, P2-17, F6, F7, F11, y los textos de la Home de la sección 3.6.
- **Criterios:**
  1. Hero a sangre en los 3 perfiles: en móvil la foto ocupa ≥ 58 % del alto, con tarjeta crema flotante, `LtoBadge` y precio display; en escritorio, layout *full*.
  2. La franja de saludo va en Garlic + Sauce y la lealtad en Sauce. No hay dos bloques verdes seguidos.
  3. La Valentina suma un carrusel por intención y el bloque de momentos.
  4. Fotos destacadas: queso estirándose y napocherry (P2-17).
  5. «Para tu viernes» deja de depender del día (F7). La tarjeta «Para 3» no deja huérfanos (F11).

### MEN-05 · Menú y tarjeta de producto (MEN, junto con la ficha de PRO)
- **Ítems:** P2-11, F8, los textos del menú y de la ficha de la sección 3.6, y la ficha con los tokens S-D18 (P1-1).
- **Criterios:**
  1. La tarjeta de pizza lleva el «+» lima sobre la foto, el sello «LA MÁS PEDIDA», sombra cálida y zoom al pasar el cursor.
  2. «½ Mitad» se lee también en móvil (F8).
  3. La ficha y la hoja de PRO usan `LtoBadge`, precio display, recorte macro y la escala tipográfica nueva.

### OFE-05 · Promos y constructor (OFE)
- **Ítems:** P2-12, P2-16, F4, F10, y los textos de promos de la sección 3.6.
- **Criterios:**
  1. En móvil la primera oferta va destacada (*split*, foto grande, sello) y el resto en tarjetas.
  2. El constructor tiene *pop* al llenar una ranura y un latido del CTA en «2 de 2».
  3. **Después de agregar, el CTA pasa a «Ver mi pedido»: no hay doble agregado (F4).**
  4. «Agregar Super Dúo · $22.590», con espacio antes del punto medio (F10).
  5. La oferta vencida usa el tono nuevo.

### TIE-04 · Locales y panel (TIE)
- **Ítems:** P2-14, P2-15, F5, F9, F12, y los textos del panel de la sección 3.6.
- **Criterios:**
  1. Locales hereda el estilo del panel (tarjetas, «Abierta · cierra 23:30», tiempo) y tiene *skeleton* mientras carga. Nunca muestra «no hay tiendas» antes de recibir la respuesta (F5).
  2. `?modo=delivery` abre en modo delivery (F12). La dirección no termina en coma («Las Condes,»).
  3. El panel usa un solo patrón de «seleccionado» (F9) y «Confirmar» con resumen.

## Cierre de la oleada

- VAL revisa cada historia en el navegador sin ventana.
- **UXD repite la revisión** con capturas antes y después de las mismas pantallas (`UX-2-…`).
- INT integra todo en `demo` y hace push con la ayuda de Raúl.

## Paso C · Cierre de UX-2 (06-nov, noche)

- **Fuente:** [UX-2 · Pulido](../revisiones/UX-2-pulido.md). Promedio de la vitrina 4 → 7, pero el constructor en escritorio, Locales, las fotos y el encabezado de Sofía quedan bajo 7. **La especificación es la de UX-2** (N1–N16 y la tabla de decisiones).
- **Criterio de cierre:** cada pantalla tocada llega a **≥ 7** en la tabla de UX-2 al revisarla de nuevo (UX-3) a 390 y 1440 px.

### Tanda C1 (en paralelo)

#### VIS-06 · Fotos nítidas y piezas comunes (VIS)
- **Ítems:** N1, N9, N10 y #48.
- **Criterios:**
  1. `FoodImage` pide `sw = ancho pintado × DPR × escala del recorte` (tope 1.440) con `srcset` 1x/2x o `sizes` correctos. El recorte nunca agranda por sobre el ancho natural. Se verifica midiendo `naturalWidth` frente al ancho pintado en la ficha, en las tarjetas del menú y en el hero.
  2. `LtoBadge` con interlineado ≈ 0,8: «LA MÁS / PEDIDA» se lee como un bloque.
  3. El aviso de agregado queda anclado bajo el encabezado; el vuelo y el salto del contador se ven.
  4. Template `store-locator`: se desregistra y se borra si `rg` confirma que nada lo importa.
  5. Combos con original de 432 px: lista para DAT.

#### HOM-08 · Home: CTA en el primer pliegue y Diego con acento (HOM)
- **Ítems:** N3, N8, #62, #63, #65 (decisión UX-2), N16 (momento).
- **Criterios:**
  1. A 390×844, con la barra inferior visible, el precio y el CTA del hero quedan completos sin scroll en los 3 perfiles (foto 50–52 %). Titular corto y `text-wrap: balance`.
  2. Diego: hero con dos pizzas, acento granate o lila, momento propio (partido o almuerzo).
  3. Sofía en 1440: «Tus favoritas» con 3 tarjetas (la tercera, «Canjéala con tus puntos» sobre Garlic); barra de puntos lima sobre pista Dough.
  4. Precio alineado en «Para 3»; sin el «4.» huérfano.
  5. `AccentWord` en «¿HAY ALGO QUE **CELEBRAR**?».

#### OFE-06 · Constructor Super Dúo en escritorio y títulos de tarjeta (OFE)
- **Ítems:** N4, N6 (Promos y constructor), N7 (constructor), N12, N13 (Promos), N15, N16 (destacada), #61.
- **Criterios:**
  1. En 1440, dos columnas: ranuras grandes *sticky* a la izquierda (fotos de 240 px, `LtoBadge` −19 %, precio display, CTA) y grilla de `FoodCard` macro a la derecha. CTA incompleto en contorno Basil con «Te falta 1 pizza», nunca gris.
  2. Títulos de tarjeta en `pj-card-title`; seleccionado en Basil + Dough.
  3. Oferta vencida: «LLEGASTE TARDE A HALLOWEEN», con la fecha solo en la pastilla.
  4. Promos sin huecos en 1440; combos sin pizzas cortadas; sello sin tapar la botella.
  5. `AccentWord` en la destacada.

### Tanda C2 (cuando se libere el navegador)

#### TIE-05 · Locales que no parece listado (TIE) — N5.
- Un solo botón relleno; «Tu tienda» marcada en Garlic + Basil; grupos «Cerca de ti» y «Todas las tiendas» (colapsado); en 1440, imagen estática de mapa con pines Basil o fachada; `<title>` de la página; tiempos que no se repitan todos iguales si el dato lo permite.

#### MEN-06 · Ficha, hoja y menú (MEN + PRO) — #52, #53, N6 (menú), N7 (ficha y hoja), N11, N13 (Favoritas), N14.
- «Hazlo combo» dentro del panel «Tu pedido» en escritorio; sale el chip «Pedida 320 veces» y el dato va a la valoración; seleccionado en Basil y chip de puntos en Garlic + Sauce; ficha sin banda vacía, foto *sticky* con recorte macro; tarjeta del menú con «+» y «½ Mitad» (sin «Agregar» duplicado).

#### INT-08 · Sesión de los perfiles en el encabezado (INT) — N2, #10, #27.
- Con `perfil=sofia|diego|valentina`, el encabezado muestra al cliente (no «Ingresar») y el chip toma la modalidad del perfil («Retiro · 15 min / El Bosque»), en todas las rutas.
