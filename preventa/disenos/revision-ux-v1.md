# Revisión crítica de UX · diseños v1

- **Fecha:** 16-oct-2026
- **Alcance:** las 18 pantallas del lienzo (01 Home, 02 Menú, 04 Agregar al carro, 05 Tienda, 07 Checkout, 08 Confirmación)
- **Pregunta:** ¿el sitio da hambre o es más usable? ¿Está alineado con los objetivos de negocio de un e-commerce?
- **Límite:** revisión experta hecha sobre los diseños y su contenido, sin prueba con usuarios ni revisión visual pantalla por pantalla del lienzo renderizado.

## Veredicto

**Hoy el diseño es más usable que apetitoso. Ordena bien la compra, pero no vende la comida.** Se parece más a un buen formulario que a una vitrina de pizzas.

Eso no es solo una impresión. «Dar hambre» depende de cosas medibles: cuánto espacio ocupa la foto, qué tan cerca está la comida, el color que la rodea y las palabras con que se describe. En esas cuatro variables, los diseños v1 se quedan cortos. El cliente pidió «que se parezca a Melt», y lo que Melt hace bien es justamente la vitrina.

La respuesta correcta no es elegir entre hambre y usabilidad, sino **usar cada una donde vende**:

| Momento | Qué tiene que hacer | Hoy |
|---|---|---|
| Home, menú, ficha, inicio de la hoja | **Dar hambre**: foto grande, texto que se saborea, oferta clara | Débil |
| Elegir tienda, carrito, checkout | **Ser invisible**: rápido, claro, sin errores | Bien |

## Puntaje por pantalla

Escala de 1 a 5. «Hambre» = deseo de comer al verla. «Usabilidad» = facilidad para completar la tarea.

| Pantalla | Hambre | Usabilidad | Comentario |
|---|---|---|---|
| Home · Valentina | 2 | 4 | El saludo empuja la comida bajo el pliegue; la primera pantalla es texto y verde |
| Home · Diego | 2 | 4 | Dos fotos chicas de pizza sobre verde oscuro; la oferta no se ve tan apetitosa como el anuncio que la trajo |
| Home · Sofía | 3 | 5 | Para una cliente frecuente, «Repetir pedido» importa más que la foto. Bien resuelto |
| Home escritorio | 3 | 4 | El hero dividido funciona; las tarjetas de promo usan fotos de pizza como reemplazo del combo |
| Menú móvil | 2 | 4 | Fotos de 92 px y texto denso: se lee como lista de precios |
| Menú escritorio | 3 | 4 | Grilla correcta, pero todas las fotos son iguales (pizza sobre fondo verde) |
| Hoja «Arma tu pizza» | 2 | 5 | Muy usable; después de la foto todo es formulario. Los ingredientes son texto, no imagen |
| Hoja «Complementa» | 2 | 4 | Fotos de 64 px en lista: parece un formulario de extras, no una tentación |
| Mi pedido | 2 | 4 | Correcto. La mejora sugerida no tiene foto |
| Ficha móvil y escritorio | 3 | 4 | Buena estructura; la descripción es una lista de ingredientes |
| Tienda y modalidad | — | 4 | Bien. Inconsistencia: la tienda elegida es «El Bosque», pero el panel lista Providencia, Salvador y Líder Suecia |
| Checkout | — | 4 | Una página, validación correcta. Largo en móvil (7 bloques); falta RUT si se pide boleta o factura |
| Confirmación | 2 | 4 | Clara. Es el mejor momento para sugerir el próximo pedido y no se aprovecha |

## Problemas, de mayor a menor impacto

### 1. La fotografía no da hambre (impacto alto)

- Todas las fotos de producto del cliente son la pizza entera, vista desde lejos, sobre un fondo verde de estudio. Puestas sobre nuestra marca verde, quedan **verde sobre verde**: monótono y sin textura.
- Las fotos que sí dan hambre (el queso estirándose en la Pizza del Mes) son las de promociones, y traen el texto incrustado.
- En el menú y en los complementos las fotos miden 64 a 92 px: no se ve la comida.

### 2. El color calma en vez de abrir el apetito (impacto alto)

- La paleta es verde oscuro, crema y lima. Comunica marca y orden, pero el apetito se asocia a tonos cálidos (rojo tomate, naranja de horno, dorado de masa).
- El rojo solo aparece en las etiquetas de descuento.

### 3. Los textos describen, no tientan (impacto medio)

- «Queso mozzarella, pollo, tocino, cebolla y salsa BBQ» es una lista de ingredientes, no una razón para pedir.
- Los ingredientes en la hoja son solo texto, aunque la API del cliente tiene foto de cada ingrediente.

### 4. Demasiados momentos de venta cruzada (impacto medio)

- Hoy hay cuatro: «Complementa» después de cada pizza, «Completa tu pedido» en la ficha, la mejora en el carrito y el carrusel del carrito. En la crítica de Domino's dijimos que dos ventas cruzadas obligatorias por pedido molestan; nosotros tenemos más.
- La meta del kit es venta cruzada en 35% de los pedidos, no muchas ofertas por pedido.

### 5. La venta cruzada vende productos sueltos, no combos (impacto medio, impacto alto en ticket)

- El cliente ya tiene combos con descuento (Papa Combo Palitos, Papa Combo con Postre). Agregar palitos y bebida por separado cuesta más que el combo, y no se lo decimos al cliente.
- Una oferta «Hazlo combo» sube el ticket y además se siente como ahorro.

### 6. El home no muestra lo que está pasando (impacto medio)

- El cliente tiene hoy una campaña de Halloween (Box Halloween de Miedo, Dulce y Truco). La demo es en octubre y el home no la refleja.
- Mostrar la campaña de temporada es la mejor forma de probar lo que el cliente pidió: **contenido que el equipo de marketing cambia sin desarrollador**.

### 7. La primera pantalla de Valentina empieza con texto (impacto medio)

- El saludo «Qué bueno verte de nuevo» ocupa la parte de arriba y la Pizza del Mes queda a medias. Para quien vuelve tras dos años, la comida debe aparecer primero y el saludo ser una línea.

### 8. Detalles de usabilidad (impacto bajo)

- Tienda inconsistente entre pantallas (El Bosque frente a Providencia).
- Checkout móvil largo: el resumen del pedido podría ir colapsado y el cupón detrás de un enlace.
- Falta decidir RUT, boleta o factura (pregunta B8).
- La confirmación no ofrece nada para el próximo pedido (Sofía) ni la reseña.

## Lo que está bien y hay que conservar

- Un toque para agregar con valores preseleccionados (corrige el principal problema de Melt).
- Precio en vivo en el botón y precio comparable en el menú.
- Tienda pedida al agregar, sin perder el pedido.
- Checkout de una página con pago visible.
- La home cambia por perfil: es la respuesta directa a la pregunta del kit.
- Puntos visibles en cada paso.

## Alineación con los objetivos del negocio (kit del cliente)

| Objetivo del kit | Qué lo mueve en el diseño | Estado v1 | Qué falta |
|---|---|---|---|
| Conversión 25% (web 18%) | Un toque para agregar, tienda al agregar, checkout de una página | Bien | Apetito en home y menú para que el visitante empiece a comprar |
| Rebote menor a 30% | Primera pantalla de la home | Débil | Comida y oferta en la primera pantalla, sin texto antes |
| Venta cruzada en 35% de los pedidos | Complementa, ficha, carrito | Exceso de momentos | Menos momentos, mejor oferta: «Hazlo combo» con ahorro visible |
| Base identificada mayor a 70% | «Guarda tus Papa Puntos» en checkout y confirmación | Bien | Mostrar el beneficio antes (en la home de Valentina) |
| Mejora por personalización +5% | Home por perfil | Bien | Medirlo: definir A/B (pregunta A5) |
| Carga menor a 2,5 s | — | Riesgo | Fotos más grandes exigen imágenes optimizadas (WebP, tamaños responsivos de Storefront Next) |

## Recomendaciones para la v2

| # | Cambio | Dónde | Para qué |
|---|---|---|---|
| R1 | **Dirección de fotografía**: pedir al cliente las tomas sin texto de sus campañas (primer plano, queso estirado, porción levantada) y usar recortes cercanos a sangre | Home, menú, ficha, hoja | Hambre |
| R2 | **Acento cálido para la comida**: rojo tomate para precio y ofertas, fondo cálido detrás de las fotos; el verde queda para marca y navegación | Todo | Hambre sin perder marca |
| R3 | **Menú móvil con pizzas en tarjeta grande** (foto a todo el ancho o dos por fila); acompañamientos y bebidas siguen en lista compacta | Menú | Hambre en lo principal, rapidez en lo simple |
| R4 | **Textos que se saborean** en Page Designer («salsa BBQ ahumada, tocino crujiente») y la lista de ingredientes debajo | Ficha, hoja, menú | Hambre y contenido administrable |
| R5 | **Ingredientes con foto** en la hoja (la API ya las tiene) | Hoja, ficha | Hambre y claridad |
| R6 | **«Hazlo combo»** en lugar de productos sueltos: «Agrega Palitos de Ajo + bebida 1,5 L y ahorra $X» | Complementa, carrito | Ticket promedio y venta cruzada |
| R7 | **Dos momentos de venta cruzada como máximo**: «Hazlo combo» al agregar la primera pizza y una mejora en el carrito; la ficha conserva su sección porque el cliente la busca | Hoja, carrito | Menos fricción |
| R8 | **Home de temporada**: Halloween como hero en la v2, cambiado desde Page Designer en la demo | Home | Hambre y prueba de gestión de contenido |
| R9 | **Valentina: comida primero**, saludo en una línea | Home | Rebote |
| R10 | **Confirmación con próxima acción**: «Guárdala como favorita» y «Repetir el viernes» (recordatorio de Marketing Cloud) | Confirmación | Recompra |
| R11 | Corregir tienda inconsistente, resumen colapsado en checkout | Tienda, checkout | Consistencia |

## Estado de aplicación (16-oct-2026)

| Recomendación | Estado |
|---|---|
| R1 Fotografía | Aplicada con recortes de campañas y fotos de tótem del cliente; definitiva pendiente de C6 |
| R2 Acento cálido | Aplicada en home, menú y hoja |
| R3 Menú con tarjetas grandes | Aplicada en móvil y escritorio |
| R4 Textos sensoriales | Aplicada en home, menú y hoja |
| R5 Ingredientes con foto | Aplicada en la hoja y en la ficha (móvil y escritorio) |
| R6 «Hazlo combo» | Aplicada en la hoja (paso 3) y en el carrito («Conviértelo en combo») |
| R7 Dos momentos de venta cruzada | Aplicada: combo en la hoja y una sola oferta en el carrito (combo o mejora de masa) |
| R8 Home de temporada | Aplicada (Halloween) en móvil y escritorio |
| R9 Valentina: comida primero | Aplicada |
| R10 Confirmación con próxima acción | Aplicada: favorito, recordatorio y opinión |
| R11 Tienda inconsistente y checkout | Aplicada: checkout v2.1 y tienda unificada en Providencia |

## Preguntas nuevas para el registro

Se agregan a `preguntas-y-supuestos.md`: C6 (fotografía sin texto y primeros planos), D16 (aprobar «Hazlo combo» con el precio de los combos actuales), D17 (hero de temporada Halloween en la demo).
