# 01 · Home por perfil

- **Lienzo:** https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk, página «01 Home»
- **Estado:** borrador v1, 16-oct-2026
- **Principios que aplica** ([propuesta](../00-propuesta/README.md)): 3 (precio visible), 4 (promesa del anuncio), 5 (puntos), 6 (según quién es), 8 (administrable)

## Objetivo

Una sola portada, armada en Page Designer, que cambia de orden, mensaje y oferta según quién llega. El kit pide pasar de «Aquí está nuestro menú. Elige.» a «Entiendo qué necesitas».

## Qué ve cada perfil

| Bloque | Valentina · vuelve tras 2 años (vista por defecto) | Diego · llega desde un anuncio | Sofía · cliente frecuente, reconocida |
|---|---|---|---|
| Saludo | «Qué bueno verte de nuevo» + beneficio de vuelta | — | «Hola, Sofía» + saldo de Papa Puntos |
| Hero | Pizza del Mes (Boom de Jamón Familiar $10.990, antes $13.900) | La oferta exacta del anuncio (Super Dúo $22.590, antes $27.800) | Repetir su último pedido en un toque |
| Segundo bloque | Empieza tu pedido: Delivery o Retiro, con tiempos | «¿Para cuántos?»: ocasiones con su combo y precio | Favoritas (sus pizzas más pedidas) |
| Tercer bloque | Las más pedidas, con «Ideal para 2», «Más pedida», «Novedad» | Más vendidos | Le faltan N puntos para un premio |
| Cierre | Beneficios del canal propio: puntos desde el primer pedido, seguimiento, pago seguro | Promos del día | Recomendación según su historial; promos en segundo plano |

### Ocasiones de Diego (combos reales del catálogo)

| Ocasión | Combo | Precio | Antes |
|---|---|---|---|
| Para 1 | Papa Flash Combo Individual (pizza individual + mini palitos + bebida) | $5.490 | $9.030 |
| Para 2 | Papa Combo Palitos (pizza 3 ing. + acompañamiento + bebida 1,5 L) | $16.490 | $17.880 |
| Para 4 | Super Dúo (2 familiares) | $22.590 | $27.800 |
| Para 6 o más | Super Trío (3 familiares) | $33.900 | $41.700 |

## Cambios v2 (tras la [revisión de UX v1](../revision-ux-v1.md))

| Cambio | Recomendación |
|---|---|
| Valentina ve **la comida primero**: el saludo pasa a una línea bajo el encabezado | R9 |
| **Hero de temporada**: Box Halloween de Miedo ($19.990, antes $23.880) para Valentina y en escritorio; se cambia desde Page Designer | R8 |
| **Fotos a sangre y en primer plano** (queso estirado de la Pizza del Mes, Super Dúo, combo) recortadas de las campañas del cliente, sin texto | R1 |
| **Precio de oferta en rojo tomate** (#B3261E); el verde queda para marca, navegación y botones | R2 |
| **Textos que se saborean** sobre la lista de ingredientes | R4 |
| Ocasiones de Diego con foto | R1 |

Las fotos recortadas son provisorias: se reemplazan cuando el cliente entregue tomas sin texto (pregunta C6). Los textos sensoriales son propuesta editorial, administrable en Page Designer.

## Pantallas

| # | Pantalla (archivo) | Qué muestra |
|---|---|---|
| 1 | Home móvil · Valentina (`Home.dc.html`) | Vista por defecto para quien no está identificado o vuelve por reactivación |
| 2 | Home móvil · Diego (`Home-Diego.dc.html`) | Misma portada con el bloque de anuncio y ocasiones |
| 3 | Home móvil · Sofía (`Home-Sofia.dc.html`) | Misma portada con repetir pedido, favoritas y puntos |
| 4 | Home escritorio · Valentina (`Home-Desktop.dc.html`) | Hero de Halloween a sangre, accesos de pedido, Pizza del Mes con queso estirado, más pedidas en primer plano, Papa Puntos |
| 5 | Home escritorio · Diego (`Home-Desktop-Diego.dc.html`) | Hero Super Dúo, «¿Para cuántos?» con foto, más vendidos |
| 6 | Home escritorio · Sofía (`Home-Desktop-Sofia.dc.html`) | «¿Lo de siempre?» con su pizza favorita en primer plano y repetir pedido, favoritas, puntos, Pizza del Mes |

Las pantallas 1 a 3 (móvil) y 4 a 6 (escritorio) son un mismo componente con un parámetro `perfil`: así se ve que es una sola portada que cambia por segmento.

## Reglas

1. **Texto real, nunca dentro de la imagen.** Nombre, precio, antes/ahora y botón son texto; la foto es solo producto.
2. **El botón del hero abre el producto o la oferta listos para agregar**, no un listado.
3. **Un solo nombre y un solo precio** por oferta, tomados del catálogo y del motor de promociones.
4. **Si la tienda ya está elegida**, no se vuelve a pedir modalidad: el encabezado muestra «Retiro · El Bosque · 15 min».
5. **Cómo se decide el perfil** (sin Data Cloud): sesión iniciada → Sofía si tiene historial; parámetro de campaña (`utm_campaign` o URL de oferta) → Diego; correo de reactivación o sin datos → Valentina. Se implementa con grupos de clientes de Commerce y segmentos de Marketing Cloud.

## Modelo en Commerce Cloud

| Concepto | Cómo se resuelve | Tipo |
|---|---|---|
| Bloques de portada | Componentes de Page Designer (hero, accesos, carrusel de productos, ocasiones, beneficios) | Desarrollo de componentes |
| Contenido por perfil | Visibilidad por grupo de clientes en Page Designer | Configuración |
| Repetir pedido y favoritas | Historial de pedidos de Shopper API | Desarrollo |
| Saldo de puntos | Loyalty Management (simulado en la demo) | Integración |
| Precios antes/ahora | Libros de precios y promociones | Estándar |

## Supuestos y pendientes

- **Fotos sin texto.** Las imágenes de promociones del cliente traen el texto y el precio incrustados. Para la demo usamos fotos limpias de producto; hay que pedir al cliente las fotos sin texto de cada promo.
- En las tarjetas de combos (Papa Combo Palitos, Papa Flash, Super Trío) se usa una foto de pizza como reemplazo hasta tener la foto limpia del combo.
- «Tu pedido de vuelta suma Papa Puntos dobles» (Valentina) es un beneficio de ejemplo: definir con el cliente cuál será el incentivo de reactivación.
- Saldo de Sofía (340 puntos = $17.000) y su último pedido son de ejemplo. Con las reglas reales del programa ([09](../09-papa-puntos/README.md)) ya puede canjear una Super Pepperoni mediana (260 puntos).
- Tiempos «Retiro 15 min» y «Delivery 35–45 min» son de ejemplo.

## v3 · Seguimiento siempre visible y Sofía después de comprar (17-oct-2026)

### Barra inferior con íconos

Cinco destinos con ícono y texto (el texto no se quita: los íconos solos se confunden): **Inicio** (casa), **Menú** (porción de pizza), **Promos** (etiqueta), **Pedido** (bolsa, con la cantidad de productos) y **Cuenta** (persona). El destino activo va en verde con una barra arriba.

### El pedido en curso, a la vista sin buscarlo

Como en las apps de delivery: mientras hay un pedido en curso, el cliente lo ve **apenas abre la tienda**, sin entrar a Mi cuenta.

1. **En la Home:** la tarjeta de seguimiento reemplaza al primer bloque (para Sofía, al «¿Lo de siempre?», que ya hizo). Muestra estado, hora, barra de avance, tienda o dirección y «Ver detalle».
2. **En el resto de las pantallas:** una **franja fija sobre la barra inferior** («En preparación · listo 20:45») que abre el seguimiento. Así acompaña al cliente si sigue mirando el menú.
3. **En escritorio:** la misma franja bajo el encabezado.
4. **Cuándo desaparece:** al entregarse o retirarse, la franja se cambia por «¿Qué tal tu pedido?» por 24 horas y después se va.

Para Papa Johns: menos llamadas al local y al SAC (kit: contact rate < 3%) y más tiempo del cliente en la tienda mientras espera, que es cuando más se le puede sugerir el próximo pedido.

### La Home de Sofía en tres momentos

| Momento | Qué ve primero | Después |
|---|---|---|
| **Antes** (v2) | ¿Lo de siempre? · Repetir pedido | Favoritas, canje, pizza del mes |
| **Con pedido en curso** | Seguimiento: «En preparación · listo a las 20:45», El Bosque, Cómo llegar | «+23 Papa Puntos al retirar», «¿Te lo recordamos el viernes?», favoritas (para la próxima) |
| **Después** (entregado) | «¿Qué tal tu Pollo BBQ?» (1 a 5) | Puntos actualizados (363) y canje disponible; **próxima mejor acción**: «La próxima, prueba Todas las Carnes por mitades» o la pizza del mes; recordatorio |

Es lo que pide el kit para la post-compra de Sofía: «historial → preferencias → puntos → frecuencia → próxima mejor acción». **No se vuelve a ofrecer «Repetir» el mismo día:** sería ruido.

### Pantallas nuevas

| Archivo | Qué muestra |
|---|---|
| `Home-Sofia-EnCurso.dc.html` | Home de Sofía con el pedido en curso |
| `Home-Sofia-Despues.dc.html` | Home de Sofía después de recibirlo |
| `Home-Desktop-Sofia-EnCurso.dc.html` | Escritorio con la franja de seguimiento y el pedido en curso |
| `Menu-EnCurso.dc.html` | Menú con la franja de seguimiento sobre la barra inferior |

## v4 · Que dé hambre y entienda el momento (17-oct-2026)

| Cambio | Kit | Requerimiento |
|---|---|---|
| Home de Diego: bloque «¿Qué se te antoja ahora?» con Almuerzo (Papa Flash), Partido (Super Trío), Celebración (Box Halloween) y Bajón (Papa Combo Palitos). Cambia según la hora; el cliente también puede tocar el momento | 00 pilar 02, 02 Diego paso 02 | [R4.2, R4.3](../requerimientos-demo.md) |
| «¿Para cuántos?» suma «Para 3» (Pizza del mes Familiar) y pasa a carrusel | 02 Diego paso 02 | — |
| Más pedidas con ★ y «N esta semana» | 00 pilar 04 | R4.4 (datos de ejemplo) |
| Hero de Valentina con movimiento lento (video simulado) y botón de pausa; respeta «reducir movimiento» | 00 pilar 01 | R4.7 |
| Aviso de cookies en la primera visita (Valentina) | 01 etapa 3 | R4.8 |

## Historial

| Fecha | Cambio |
|---|---|
| 16-oct-2026 | v1: tres perfiles en móvil y escritorio por defecto |
| 16-oct-2026 | v2: comida primero, hero de Halloween, fotos en primer plano, precio en rojo, textos sensoriales |
| 16-oct-2026 | v2.1: home de escritorio para los tres perfiles; hero de Sofía con Pollo BBQ en primer plano (foto de tótem del cliente) |
| 17-oct-2026 | v3: barra inferior con íconos; seguimiento siempre visible; Home de Sofía con pedido en curso y después |
| 17-oct-2026 | v4 (kit 00 · El desafío): Diego con «¿Qué se te antoja ahora?» que cambia según la hora (almuerzo, partido, celebración, bajón; prop `hora`, R4.2–R4.3) y «Para 3»; ★ y pedidos de la semana en las más pedidas (R4.4); hero de Valentina con video simulado y pausa (R4.7); aviso de cookies (R4.8) |
| 17-oct-2026 | Revisión UX v2: sin el texto explicativo de la hora en la Home de Diego; el hero ya no dice «Video» (movimiento con pausa); estrellas en #8F5400 (6:1); sin el botón «Simular siguiente estado» en la Home de Sofía en curso |
| 17-oct-2026 | Revisión UX v2 (3 y 7): la promesa del anuncio manda; «¿Y para este momento?» baja después de «¿Para cuántos?» y es una tarjeta compacta clara (sin competir con el hero del Super Dúo). «Para 3» = Pizza del mes + Palitos + bebida 1,5 L, $20.470 «armado para 3» (suma de precios, sin descuento inventado), así la escalera de precios crece con las personas |
| 17-oct-2026 | Revisión contra el kit v2 (1): el anuncio del panel (T2) ahora es el Super Dúo, igual que «La oferta que viste» de la Home de Diego |
