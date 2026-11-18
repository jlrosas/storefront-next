# VAL-MEN-06 · Ficha, hoja y menú (paso C de la oleada de pulido)

Fecha: 2026-11-06. Worktree `storefront-wt/MEN`, rama `hu/MEN`, commit 47a1917, `pnpm dev --port 5175`. Navegador `chrome-devtools-headless-2`, contextos aislados `VAL-MEN06` y `VAL-MEN06-b` (sesión limpia, sin usuario). 390x844 DPR 2 (Android emulado, táctil), 778x900 y 1440x900. Solo carrito de invitado; nada escrito en el sandbox.

## Veredicto: APROBADA

Los 7 criterios de MEN-06 se cumplen en los viewports que aplican. Hay hallazgos menores, ninguno bloquea. Las 3 pantallas pasan de 7.

## Criterios
| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | «Hazlo combo» dentro del panel «Tu pedido» a 1440, con tienda ya elegida | ✅ | Evento `pj:hazlo-combo-offer` emitido (`{itemId, productName:"Pollo Caprese"}`). La tarjeta aparece bajo la línea recién agregada, con foto, «+$6.990», «Ahorras $2.490», selector Original/Sin azúcar/Light, «Sí, hazlo combo» (granate, 158x44) y «No, gracias» (90x44). `VAL-MEN-06-hazlo-combo-panel-con-tienda-1440.png` |
| 1b | Ídem sin tienda | ✅ | Contexto limpio: «+» abre la hoja, «Agregar» pide tienda, «Confirmar y agregar» (El Bosque) cierra y el panel muestra la oferta. `VAL-MEN-06-hazlo-combo-panel-1440.png` |
| 1c | Aceptar / rechazar / deshacer | ✅ | Aceptar: la tarjeta sale y entran «1× Palitos de Ajo $5.990» y «1× Coca-Cola Sin azúcar 1.5 LT $3.490» (total $37.790). `…-hazlo-combo-aceptado-1440.png`. Rechazar: la tarjeta sale y no queda rastro; en una nueva agregada vuelve a ofrecerse. Deshacer: en la ficha a 1440 el aviso «¡Agregada! … Deshacer · Ver mi pedido» (Deshacer 81x44) quita la línea (contador 3 → 2). El aviso del menú no lleva «Deshacer» por diseño (comentario en `menu-added-toast.tsx`). Ver H3 |
| 1d | A 390 el paso de la hoja no cambió | ✅ | Tras «Confirmar y agregar»: aviso «Boom de Jamón agregada», tarjeta «HAZLO COMBO · +$6.990» con «Sí, hazlo combo» y «O agrega por separado», «Ver pedido $13.900». `VAL-MEN-06-hazlo-combo-390.png` |
| 2 | Valoración «★ 4,7 · 1.240 opiniones · 320 esta semana», sin chip «Pedida 320 veces» | ✅ | Ficha 390 y 1440: texto exacto (1.240 es enlace); `Pedida 320 veces` ausente del DOM en ficha y hoja. Hoja Boom de Jamón: «★ 4,5 · 640 opiniones · 180 esta semana». El sello «LA MÁS PEDIDA» (LtoBadge) se conserva. `VAL-MEN-06-ficha-390.png`, `-hoja-390.png`, `-hoja-1440.png` |
| 3 | Seleccionado Basil + Dough; chip de puntos Garlic + Sauce | ✅ | Tamaño y masa elegidos: fondo `rgb(45,93,42)` y texto `rgb(245,232,220)` en ficha (390 y 1440) y hoja; en la hoja de 390 la masa usa radio Basil. Chip «Ganas 16 Papa Puntos»: texto `rgb(113,5,0)` sobre `rgb(227,194,237)` en ficha y hoja. Ver H1 por el chip lima que queda en el panel |
| 4 | Ficha sin banda vacía, foto sticky, recorte macro | ✅ | Migas pegadas al encabezado (top 60 = bottom del header, sin franja) a 390; a 1440 el contenedor de la foto es `position: sticky; top: 88px` (757 px) y la foto acompaña el scroll con «Lleva» debajo, sin columna vacía. Foto con `object-position 50% 58%` y escala (acercamiento macro visible). `VAL-MEN-06-ficha-390.png`, `-ficha-1440.png` |
| 5 | Tarjeta del menú con «+» y «½ Mitad», sin «Agregar» | ✅ | 36 tarjetas visibles a 390: ningún nodo con texto «Agregar» (queda solo como `aria-label` del «+», 44x44); «½ Mitad» 78x44, 13 px, 16 en 1440. En las Pan Pizza y Croissant no hay «½ Mitad» (producto sin mitades). `VAL-MEN-06-menu-tarjeta-390.png`, `-menu-pizzas-390.png`, `-menu-1440.png` |
| 6 | Tarjetas de cierre en las grillas (N13) | ✅ | 390 (2 col): todas las filas completas, cierres «¿Dos antojos?», «Combínala y ahorra», «¿Ninguna te convence?». 778 (3 col): el cierre ocupa 2 columnas y completa la fila. 1440 (4 col): filas completas (`VAL-MEN-06-menu-778.png`, `-menu-1440.png`) |
| 7 | Un solo «Cerrar» en la hoja con el foco en él (VAL-MEN-05 H2) | ✅ | Hay 2 en el DOM pero el segundo es `display:none` (no entra al árbol de accesibilidad); el visible mide 44x44 y es `document.activeElement` a 390 y 1440. Cierra el H2 de VAL-MEN-05 |
| N6 | Un solo título de tarjeta en el menú | ✅ | Ofertas a 1440: 24 px Papa Sans Condensed, mayúsculas, Basil (`rgb(45,93,42)`) en las 4 tarjetas; pizzas igual (`pj-card-title`). Ya no hay Bold negro ni de tipo oración |
| 8 | Contraste ADA | ✅ | Calculado sobre valores computados: Dough sobre Basil ≈ 6,2:1; Sauce sobre Garlic > 8:1; Basil sobre lima ≈ 6:1; Sauce sobre crema > 10:1 |
| 9 | Texto ≥ 12 px | ✅ | 0 nodos de texto bajo 12 px en menú (390, 778, 1440), ficha (390, 1440) y hoja (390, 1440) |
| 10 | Áreas táctiles ≥ 44 px | ✅ | «+» 44x44, título 154x44, «½ Mitad» 78x44, Cerrar 44x44, «Sí, hazlo combo» y «No, gracias» 44 de alto, Deshacer 44 de alto, selector Original/Sin azúcar/Light 83x44 |
| 11 | Consola sin errores | ✅ | Solo ruido conocido de desarrollo: HMR `ws://localhost:24678` 400 (el puerto lo ocupa otro Vite) y el aviso de hidratación por `nonce`. Sin errores CORS. Sin desborde horizontal (`scrollWidth` = 390 a 390; 763 a 778 y 1425 a 1440 por la barra de scroll) |

## H1 de VAL-MEN-05 (errores CORS): no se reprodujo
En `/menu` a 390 y a 1440, en dos sesiones aisladas y tras agregar, la consola no mostró ningún error de `fetch` ni CORS. La lista de red (`fetch`, `xhr`, `preflight`) solo tiene las llamadas del propio storefront (`getBasket`, `pj-pizza.data`, `pj-upsell.data`), todas 200. No hice `fetch` a imágenes. La hipótesis del constructor (los `fetch HEAD` del script de VAL-MEN-05 generaron los errores) es consistente con la evidencia: **H1 se cierra como ruido de automatización**.

## Notas (1 a 10, criterio de la tabla de UX-2: «entrar por los ojos» dentro de la marca)
| Pantalla | UX-2 | Ahora | Por qué |
|---|---|---|---|
| Menú | 7,5 | **8** | Títulos unificados y grilla sin huecos con tarjetas de cierre en granate/lila que dan ritmo; «+» y «½ Mitad» limpios; panel «Tu pedido» con la oferta integrada. Resta: el segmentado «Familiar» a 1440 es blanco, no Basil; fotos que cargan perezosas dejan alguna tarjeta en blanco un instante |
| Ficha | 6,5 | **7,5** | Sin banda, foto macro grande con sello y sticky en 1440, jerarquía clara (H1 Basil, precio display, valoración). Resta: el hueco entre precio y valoración en 390 y la foto del ingrediente «Mozzarella» con texto de envase |
| Hoja | 7,5 | **8** | Foto macro a sangre, sello, un solo Cerrar con foco, chips coherentes, radios Basil. Resta: a 1440 la foto es la pizza entera y no macro |

Todas ≥ 7. Meta cumplida.

## Hallazgos
| ID | Severidad | Resp. | Hallazgo |
|---|---|---|---|
| H1 | Baja | MEN | El chip «Ganas N Papa Puntos» del panel «Tu pedido» (1440) sigue en lima relleno, a diferencia del chip Garlic + Sauce de la ficha y la hoja (N7). Se lee como «seleccionado». Conviene pasarlo a Garlic + Sauce |
| H2 | Baja | MEN | Con el carrito ya con Palitos y Coca-Cola (tras aceptar «Hazlo combo»), una pizza nueva agregada a 1440 no vuelve a ofrecer el combo. Es razonable y no lo llamo defecto; confirmar que es la regla intencional (una oferta por pedido) |
| H3 | Baja | MEN | «Deshacer» no existe en el aviso del menú ni al aceptar «Hazlo combo» en el panel: quien acepta por error debe quitar las dos líneas a mano. Existe en la ficha y en la hoja. Confirmar si «deshacer» del encargo incluía el menú |
| H4 | Baja | PRO | La hoja a 1440 muestra la pizza entera en la cabecera; la ficha y la hoja a 390 usan recorte macro. Inconsistencia de recorte entre viewports |
| H5 | Informativa | DAT | La foto del ingrediente «Mozzarella» (ficha y hoja) tiene un envase con texto legible («BELLA…»); el resto son fotos de producto limpias. Pre-existente |
| H6 | Informativa | — | Segundo botón «Cerrar» sigue en el DOM con `display:none`: no es problema de accesibilidad, solo limpieza de código |

Conocidos, fuera de este paso: precio del combo $9.480 en vez de $6.990 (hooks SCAPI apagados); en la hoja y en la ficha de 390 queda visible la barra inferior atenuada bajo el fondo del diálogo (comportamiento ya aceptado en VAL-MEN-05).

## Pasada de observación (capturas abiertas)
- `menu-pizzas-390`: tarjetas de cierre (Mitad y mitad / Arma tu pizza) y primera fila con «+» lima, títulos Condensed Basil; el banner de cookies tapa la parte baja hasta aceptarlo (diseño).
- `hoja-390`, `hoja-opciones-390`: sello, H2 Basil, precio display, chips Garlic, tamaño elegido Basil, radio de masa Basil.
- `hazlo-combo-390`: oferta completa a ancho total, sin solape con el aviso.
- `ficha-390`, `ficha-1440`: migas pegadas al encabezado, foto macro, sticky.
- `menu-778`, `menu-1440`, `hazlo-combo-panel-con-tienda-1440`, `hoja-1440`: grilla completa y panel con la oferta.

## Ruido de automatización
- Varias búsquedas por texto fallaron porque los títulos son botones o están en mayúsculas; se resolvieron por `aria-label` y por selector.
- La primera captura de `/menu` a 390 llevaba el banner de cookies encima.
- «Hazlo combo» en el segundo agregado dependió del estado del carrito (ver H2), no de la herramienta.

## No cubierto
- iOS/Safari: no reproducible con este navegador.
- Comparación valor por valor contra el lienzo Figma: solo contra la especificación de UX-2.
- Ficha a 778 y hoja a 778: no se recorrieron (el encargo pedía el menú en 778; la hoja y la ficha se midieron en 390 y 1440).
- Pago y pedido completo: fuera de alcance.

## Cambios en el ambiente
- Carritos de invitado de pruebas en contextos aislados (se pierden al cerrar). Nada escrito en el sandbox más allá de eso.
- Servidor del puerto 5175 detenido. Mis páginas cerradas; queda la `VAL-R2` en `about:blank`, que no es mía.
