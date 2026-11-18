# VAL-MEN · Validación de MEN-01 a MEN-03

Fecha: 2026-11-06. Rama `hu/MEN`, `sfnext dev` en :5175 (HMR 24678 ocupado por otro servidor: ruido). Navegador `chrome-devtools-headless-2`. Mobile 390x844 emulado (Android, táctil) y desktop 1440x900. Lienzo abierto como archivo (`Menu-Desktop.dc.html` muestra solo plantillas `{{..}}` sin datos: se comparó estructura y textos fijos; `Menu.dc.html` y `Simple-Add.dc.html` se compararon por su código).

## Veredicto
- MEN-01: RECHAZADA (F1, desborde horizontal en mobile).
- MEN-02: APROBADA (funcional; el aviso se ve cortado en mobile por F1).
- MEN-03: APROBADA.

## Preparación y contaminación
- El navegador venía con la página 2 y un carrito del agente constructor. Se cerró la página y se borraron las cookies visibles (`document.cookie`) y el storage.
- Las cookies httpOnly (`usid`, `cc-at`) no se pueden borrar así: Commerce devolvió el mismo carrito de invitado, con 1× Coca-Cola Light 1,5 LT. El encabezado mostró «0 productos» porque lee la cookie `__sfdc_basket`, que sí borré.
- Por eso los totales de la prueba incluyen ese producto: «Ver pedido (2)» tras mi primera adición (el contador de la tarjeta decía 1 porque cuenta la variante de 350 ml) y «Tu pedido» con 4 líneas. Es ruido de arranque, no defecto.
- Incidente: `get_network_request` sobre `cart-item-add.data` imprimió el token `cc-at` de un invitado de prueba de la sesión local. Es un token de invitado de corta vida (expira en 30 min) y no lo copié a ningún archivo. Aun así queda anotado.

## MEN-01
| CA | Resultado | Evidencia |
|---|---|---|
| 1 Barra de categorías con conteos | ✅ conteos; ⚠️ «fija» en mobile no verificable | 390: Ofertas 6, Pizzas 24, Acompañamientos 13, Bebidas 8, Postres 9, Extras 3. Las anclas bajan a la sección: Pizzas queda en top 116 px, bajo el header sticky y la barra. En 1440 la barra es horizontal arriba, sin lateral, y se mantiene fija con «Bebidas» activa (`VAL-MEN-1440-inicio.png`). En mobile, tras un scroll largo (`VAL-MEN-390-ancla-extras.png`) ni header ni barra se ven: no se pudo confirmar por F1. Extras no puede alinearse arriba por estar al final de la página (esperable) |
| 2 Ofertas: carrusel de 4 + «Ver todas» | ✅ | 4 tarjetas, «Ver las 6» → `/promos`. En 1440, grilla de 4 con insignias -50%, -19%, -8%. El texto del lienzo es «Ver las 16 ofertas» (dato de plantilla) |
| 3 Selector de tamaño | ✅ | Mediana: 10.900, 13.000, 14.400, 18.900. Familiar (por defecto): 13.900, 16.900, 18.900, 21.900. Extra grande: 17.900, 21.900, 24.000, 26.900. Los 24 productos siguen. Pan Pizza queda en Mediana $12.900 y Croissant en «Única» $13.990, sin cambios |
| 3 Filtros | ✅ | Más vendidas 4 (Boom de Jamón, Super Pepperoni, Pollo BBQ, Todas las Carnes). Vegetarianas 6. Picantes 3. Todas 24 |
| 3 Grupos con rango | ✅ | Clásicas «Familiar $13.900», Favoritas «$16.900», Premium «desde $18.900» (cambia con el tamaño). Pan Pizza «Solo mediana · sin mitades» y Croissant «Un tamaño · sin mitades», igual que el lienzo |
| 4 Mitad y mitad / Arma tu pizza al inicio | ✅ | Ambas presentes, con los textos del lienzo. Mitad y mitad → `/p/pz-mitades?size=family`. Arma tu pizza «Desde $12.400 en Familiar» → `/p/pz-arma-tu-pizza?size=family`. No se hizo clic en ninguna (hoja de PRO fuera de esta rama) |
| 5 «Agregar» y «½ Mitad» | ✅ por enlace | «Usar Hawaiana en una pizza mitad y mitad» → `/p/pz-mitades?mitad1=pz-hawaiana`. Las especialidades sin mitades (Pan Pizza, Croissant) no lo llevan. «Agregar» → `/p/<id>` (respaldo aceptado) |
| 6 Tarjetas | ✅ | Pizzas grandes con foto, texto, ★ y precio, en 2 columnas. Acompañamientos, bebidas, postres y extras en tarjetas compactas horizontales |
| 7 Sin tienda se ve todo | ✅ | |
| 8 Sin saltos de layout | ✅ | CLS 0 en 390 y 0,0001 en 1440 (PerformanceObserver desde el inicio de la carga). Las 64 imágenes tienen contenedor con tamaño. Los skeletons no se observaron: la carga es SSR y no hay estado intermedio |
| 9 Buscador | ✅ | «Busca entre 65 productos» (63 de las secciones + 2 de construcción). «pepperoni» → «9 PRODUCTOS» con las mismas tarjetas, URL `?q=pepperoni`. «zzzxq» → «0 PRODUCTOS · No encontramos «zzzxq». Prueba con «pepperoni», «palitos» o «coca».» (`VAL-MEN-390-busqueda-vacia.png`). El filtrado funciona al pulsar Enter, no mientras se escribe |
| 10 Arma tu pizza → pz-arma-tu-pizza | ✅ por enlace | Enlace correcto. La hoja de PRO no se abre en esta rama |
| 11 Pizza del Mes The Works | ✅ | Primera oferta: «Pizza del Mes The Works Familiar $10.990, antes $21.900». No hay Box Halloween |
| Mobile general | ❌ | Ver F1 |

## MEN-02
| CA | Resultado | Evidencia |
|---|---|---|
| 1 Pizza → hoja de PRO | ⚠️ | «Agregar» es un enlace a `/p/<id>` (respaldo acordado). No se siguió el enlace |
| 2 Bebida: tamaño en la tarjeta y «+» agrega | ✅ | Coca-Cola Light: 350 ml $1.790, 591 ml $2.090, 1,5 LT $3.490, 2,5 LT $4.490. El botón cambia a «Agregar Coca-Cola Light 350 ml». Un solo POST `cart-item-add` con `cp-coca-cola-light-67`, cantidad 1 |
| 3 Sin opciones: «+» directo | ✅ | Cookie y Brownie se agregan con «+» |
| 4 Contador − N + y aviso | ✅ (desktop) / ⚠️ (mobile) | La tarjeta muestra «− 1 +» con botones de 44x44 (`VAL-MEN-390-bebida-agregada.png`). El aviso de desktop dice «¡Agregada! Cookie · Total $13.270 · +7 Papa Puntos por acreditar · Deshacer · Ver pedido». El total cuadra: 3.490 + 1.790 + 7.990 = 13.270. Diferencia con el lienzo: `Simple-Add` usa «<nombre> agregada · $total», sin Papa Puntos ni «Deshacer». En mobile el aviso es «Ver pedido (2)» y queda cortado por F1 |
| 5 Sin tienda: panel de TIE | no evaluado | Excluido por el encargo |

## MEN-03
| CA | Resultado | Evidencia |
|---|---|---|
| 1 Columna «Tu pedido» en 1440 | ✅ | `aside` sticky de 320 px con líneas, Total, «Ir a pagar» → `/cl/es-CL/checkout` y «Ganas N Papa Puntos». Se actualiza sin recargar: un marcador en `window` sobrevivió, y se agregaron Cookie ($13.270) y Brownie ($21.260). El Brownie tardó más de 1,5 s en aparecer y estuvo a los ~4 s: es una latencia, no un fallo. En mobile la columna está oculta, como corresponde. El estado vacío («Todavía no agregas nada…» del lienzo) no se probó por la contaminación del carrito |
| 2 Resumen estándar con punto de inserción | ✅ | Es el resumen estándar, sin enriquecimiento |

## Diferencias visibles con el lienzo
- En 1440 el selector dice «Precios en | Mediana Familiar Extra grande». Coincide con el lienzo.
- El header real trae el logo y «Ingresar»/«Mi pedido · 4». El lienzo trae el pill «Retiro o delivery» (TIE, otra rama).
- Aviso de agregado: el real añade Papa Puntos y «Deshacer» (ver MEN-02 CA4).
- «Arma tu pizza» muestra «Desde $15.400 en Extra grande» al cambiar el tamaño. El lienzo fija «$12.400 en Familiar». Es coherente con el selector.
- En los postres con variantes (Helados, Cinnapie), el selector de sabores usa chips con scroll horizontal cortados en el borde de la tarjeta. No hay referencia directa en el lienzo.
- «Ver las 6 ofertas» frente a «Ver las 16» del lienzo: es dato, no cuenta.

## Hallazgos
- **F1 (relevante, mobile 390, reproducido):** el carrusel de Ofertas (`-mx-4 ... overflow-x-auto`, contenedor `grid` con `flex min-w-0`) ensancha el documento: `scrollWidth` 778 contra 390 de ancho visual, y `innerHeight` pasa a 1684. Se aisló ocultando solo la sección `#ofertas`: el ancho vuelve a 390. Consecuencias observadas:
  - La barra inferior fija mide 778 px y «Pedido» y «Cuenta» quedan fuera de pantalla (`VAL-MEN-390-inicio.png`).
  - El banner de cookies y el aviso «Ver pedido (N)» se cortan por la derecha.
  - No se pudo confirmar la barra de categorías fija en mobile tras un scroll largo.
  - Sin confirmar en un teléfono real: la emulación de este navegador puede exagerarlo. El aislamiento por DOM sí es del código.
- **Áreas táctiles (390):** pasan los botones de agregar, «½», filtros, selector de tamaño, chips de tamaño de bebida y las categorías (todos de 44 px o más). No pasan:
  - «Ver las 6» (52x20).
  - Los enlaces de nombre de producto (158x18 en pizzas y 226x20 en compactas). No se midió si la tarjeta completa es táctil.
  - El `input` de búsqueda mide 24 px de alto, pero su contenedor se ve de 44 o más.
- **Contraste:** botón Agregar 9,7. Descripción 10,25. Categoría inactiva 9,7. Opiniones 6,54. Todos cumplen AA.
- **Consola (1440):**
  - Error: WebSocket HMR :24678 (entorno, ruido).
  - Error: «hydration mismatch» por `nonce` de `critical.css` (solo dev, probablemente sin efecto).
  - Avisos: precarga de 3 imágenes (`napolitana-caprese`, `hawaiana`, `cb-pizza-del-mes`) no usadas.
  - No hay errores de aplicación ni requests fallidas.
- Búsqueda: el recuento dice 9 productos y se ven 8 botones «Agregar». Uno de los resultados es un producto con enlace, sin añadir directo. No se verificó cuál es.

## No cubierto
- Clic en «Agregar» de pizza, «½» y «Arma tu pizza» (solo se verificaron los enlaces).
- Skeletons (no se observó ningún estado de carga).
- Panel de TIE (CA5 de MEN-02).
- Estado vacío de «Tu pedido».
- iOS/Safari.
- Capturas guardadas sin abrir: `VAL-MEN-390-top.png` (abierta) y `VAL-MEN-390-bebida-agregada.png` (abierta). Todas las demás se abrieron.

## Evidencia

## Revalidación (R2)
Rama `hu/MEN` commit f6faa72, servidor local :5175, headless-2, contexto aislado (cookies limpias, carrito vacío al inicio). Viewport 390x844 (innerWidth = 390 comprobado) y 1440x900.

| # | Verificación | Resultado | Evidencia |
|---|---|---|---|
| 1a | `scrollWidth` ≤ 390 al cargar, tras scroll largo (0 a 8000 px) y tras agregar producto | ✅ 390 en los tres momentos | `VAL-MEN-R2-390-inicio.png`, `-scroll.png` |
| 1b | Barra inferior con 5 destinos completos | ✅ Inicio, Menú, Promos, Pedido, Cuenta, de 0 a 390 px (78 px cada uno, fixed) | `VAL-MEN-R2-390-inicio.png` |
| 1c | Barra de categorías fija tras scroll | ✅ sticky, top 60 px en scroll 1500, 4000 y 8000 | evaluate_script |
| 1d | «Ver pedido (N)» completo | ✅ barra de 12 a 378 px, 52 px de alto. Sin confirmar a ojo: en la captura el banner de cookies la tapa | `-bebida-agregada.png` |
| 1e | Aviso de agregado completo dentro de la pantalla | ❌ La caja del aviso mide de 32 a 452 px (`max-w-[420px]`) y el botón «Ver pedido» llega a 436 px. En la captura el botón queda cortado por la derecha. Estable a 1,5 s y 2,5 s, no es animación | `VAL-MEN-R2-390-bebida-agregada.png` |
| 2 | Áreas táctiles ≥ 44 px a 390 | ✅ de 170 elementos interactivos solo bajan de 44 el enlace «Saltar al contenido» (1x1, oculto) y el `input` de búsqueda (24 px; su contenedor mide 44) | evaluate_script |
| 3 | Aviso de bebida: «<nombre> agregada · $total» + «Ver pedido», sin «Deshacer» ni puntos | ✅ texto: «Coca-Cola 1,5 L agregada · $3.490 / Ver pedido»; sin «Deshacer». Con la segunda bebida: «Coca Cola Sin Azucar 220ml agregada · $4.490». Es el total del pedido, coherente | evaluate_script |
| 4a | Selector de tamaño cambia precios (1440) | ✅ Familiar $13.900, Mediana $10.900, Extra grande $17.900 | `VAL-MEN-R2-1440-regresion.png` |
| 4b | Filtros | ✅ «Vegetarianas» activo, aparece la sección «Vegetarianas 6 pizzas»; URL `?tam=extra_large&filtro=veg` | misma captura |
| 4c | «Tu pedido» se actualiza | ✅ total $4.490 a $7.980 al agregar una Coca-Cola Light; «Mi pedido · 3» | misma captura |

### Fallos
- R2-F1 (mobile 390): el aviso de producto agregado desborda por la derecha (caja de 32 a 452 px, botón «Ver pedido» hasta 436 px) y el botón se corta. No agrega scroll horizontal (`scrollWidth` 390), pero se ve cortado.

### Notas
- Al abrir la sesión por defecto el carrito ya traía 4 productos (sesión heredada del navegador); se descartó y se rehízo la prueba en un contexto aislado con carrito vacío.
- Ruido de servidor: las cookies httpOnly no se pueden borrar desde la página; se usó contexto aislado en su lugar.
- No cubierto: iOS/Safari; panel TIE.

**Veredicto R2: MEN-01 y MEN-02 RECHAZADAS** (solo por R2-F1; el resto aprobado).
