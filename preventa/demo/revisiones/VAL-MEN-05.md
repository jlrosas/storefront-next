# VAL-MEN-05 · Menú y tarjeta de producto (con ficha y hoja de PRO)

Fecha: 2026-11-06. Worktree `storefront-wt/MEN`, rama `hu/MEN`, commit 0523a77, `pnpm dev --port 5175`. Navegador `chrome-devtools-headless-2`, contexto aislado `VAL-MEN05`, cookies visibles y storage limpios (sesión de invitado). Mobile 390x844 emulado (Android, táctil, DPR 2) y desktop 1440x900. Sandbox solo en lectura, salvo el carrito de invitado de la prueba (2 líneas de Pollo BBQ, sin pedido).

## Veredicto: APROBADA

Los 3 criterios de MEN-05 se cumplen en 390 y 1440. Hay hallazgos menores (ninguno bloqueante) en la tabla de hallazgos.

## Criterios
| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1a | «+» lima de 44 px sobre la foto que abre la hoja | ✅ | Botón 44x44, fondo `rgb(207,235,12)` (lima `pepperoncini`), esquina inferior derecha de la foto. En 390 con tienda sin elegir abrió la hoja de PRO («Arma tu pizza Pollo BBQ») y luego «¿Cómo lo quieres?». `VAL-MEN-05-390-tarjeta-pizza.png`, `-390-hoja.png`, `-1440-hoja.png` |
| 1b | Sello «LA MÁS PEDIDA» | ✅ | Texto en mayúsculas, 12 px, fondo Garlic `#E3C2ED` con texto Basil (contraste 4,87:1), arriba a la izquierda de la foto. Presente en las 4 más vendidas (Boom de Jamón, etc.) |
| 1c | Sombra cálida y zoom al hover | ✅ | Reposo: `rgba(113,5,0,.10) 0 6px 20px`. Hover (1440): `0 16px 36px` + `0 2px 8px` en el mismo tono cálido, transición 0,3 s. La foto pasa de `transform:none` a `scale(1.05)` (sobre el `scale` 1,45 del recorte macro). `VAL-MEN-05-1440-hover.png` |
| 1d | Sellos sin colores fuera de paleta | ✅ | Garlic `#E3C2ED`, Sauce, Pepperoncini y Basil, todos de `pj.css`. Ninguna clase hex en `pizza-card.tsx` |
| 2 | F8: «½ Mitad» legible completo en 390, sin scroll horizontal | ✅ | Texto «½ Mitad», 13 px, 70x44 px, `scrollWidth` 68 = `clientWidth` 68 (sin recorte), `whitespace-nowrap`. `scrollWidth` del documento 390 = `innerWidth` tras recorrer toda la página. En 1440, 1425 (< 1440, hay scrollbar). `VAL-MEN-05-390-tarjeta-pizza.png` |
| 3a | Ficha: `LtoBadge`, precio display, recorte macro, escala | ✅ | `/cl/es-CL/p/pz-pollo-bbq` en 390: `LtoBadge` «LA MÁS PEDIDA» lima de 88x88 (lg) arriba a la izquierda; precio `$16.900` Papa Sans Condensed 36 px Sauce con `$` en superíndice (display `md`); foto con `scale 1,45` y `object-position 50% 60%` (macro); H1 «Pollo BBQ» 38 px en Basil `rgb(45,93,42)`. `VAL-MEN-05-390-ficha.png` |
| 3b | Hoja: mismos elementos | ✅ | 390: `LtoBadge` 56 px (md), precio display, H2 «POLLO BBQ» 32 px Basil, foto macro. 1440: H2 40 px, precio 48 px, `LtoBadge` sobre la foto. `-390-hoja.png`, `-1440-hoja.png` |
| 3c | Flujo completo desde la hoja | ✅ | 390: «Agregar $16.900» pide tienda («¿Cómo lo quieres?», no es defecto: hay que elegir tienda); tras «Confirmar y agregar» (El Bosque) aparece el aviso «Pollo BBQ agregada · Familiar · Tradicional · Editar» (lima, ancho completo dentro de la hoja, sin recorte) y debajo la tarjeta «HAZLO COMBO · Suma Palitos de Ajo y Coca-Cola 1,5 L · +$6.990» con «Sí, hazlo combo». Contador de «Pedido» en 1 y del header en 1. El aviso no se superpone con «Hazlo combo». `VAL-MEN-05-390-aviso2.png`. 1440: «¡Agregada! Pollo BBQ Familiar · +16 Papa Puntos por acreditar · Deshacer · Ver mi pedido», «Mi pedido · 2», panel «Tu pedido» $33.800 (16.900 x 2, cuadra) y 33 Papa Puntos. `-1440-aviso.png` |
| 4 | Fotos con scroll real | ✅ | 390: de 65 `<img>`, las 44 visibles cargaron todas (naturalWidth > 0); 21 están en `<article>` con `display:none` (ancho 0) y nunca cargan. 1440: 53 visibles, 0 sin cargar; 12 ocultas. Las 4 de la captura de página completa que salían vacías sí cargan con scroll |
| 5a | Contraste ADA | ✅ | Texto Basil sobre blanco/crema, Sauce `#710500` sobre crema, Basil sobre lima ~6:1, sello 4,87:1. Calculado por luminancia relativa sobre los valores computados |
| 5b | Texto ≥ 12 px | ✅ | 0 nodos de texto menores de 12 px en la hoja y la ficha (390 y 1440); sello y chips a 12 px |
| 5c | Áreas táctiles ≥ 44 px | ✅ | «+», «Agregar», «½ Mitad», cerrar, − / +, tarjetas de tamaño: todos 44 px o más. En la ficha, los enlaces del *breadcrumb* miden 44 px de alto |
| 5d | Consola sin errores | ⚠️ | Solo el ruido ya conocido (HMR `ws://localhost:24678` 400, aviso de hidratación por `nonce`) más los errores CORS de H1 |

## Regresiones rechazadas antes
| Defecto previo | Estado |
|---|---|
| Desborde horizontal en 390 (F1) | ✅ no vuelve: `scrollWidth` = 390 en `/menu`, la hoja y la ficha |
| Desborde a 778 px | 🚫 no se probó (el encargo fijó 390 y 1440); ver «No cubierto» |
| Aviso cortado a 390 | ✅ no vuelve: ancho completo, `x` 0–390 |
| Aviso sobre «Hazlo combo» | ✅ no vuelve: el aviso queda arriba y el combo debajo, sin solape |
| Botón de cerrar de la hoja sobre precios | ✅ en la hoja a 390 el «Cerrar» (334,20) queda sobre la foto, sin tapar precios. Ver H2 por un segundo botón oculto |

## Hallazgos
| ID | Severidad | Resp. | Hallazgo |
|---|---|---|---|
| H1 | Media | MEN | Consola `/menu` 390: 5 errores «Access to fetch at edge.disstg.commercecloud…/images/combos/cb-super-duo.jpg … blocked by CORS» + `ERR_FAILED` (Super Dúo, Papa Combo Palitos, Cheesy Veggies, Palitos de Ajo, Palitos de queso). Son peticiones `fetch` (no `<img>`) de imágenes que nadie ve (las tarjetas están ocultas). No rompen la vista, pero ensucian la consola. **No aparecían en VAL-MEN ni VAL-PRO**: nuevo en esta rama (sin comparar contra la base). Origen no ubicado (no hay `fetch(` en `pj-menu`/`pj-shared`; podría ser precarga de imágenes) |
| H2 | Baja | PRO | La hoja tiene dos botones «Cerrar»: uno en una cabecera de 1 px de alto con `overflow:hidden` (en x −1, y −5), que recibe el foco inicial, y el visible. El foco arranca en un control invisible. Un lector de pantalla lo anuncia dos veces |
| H3 | Baja | INT | `http://localhost:5175/p/pz-pollo-bbq` (sin `/cl/es-CL`) mostró la Home (hero Pizza del Mes) en vez de la ficha, mientras `/cl/es-CL/p/pz-pollo-bbq` va bien. `/menu` sin prefijo sí redirige. Los enlaces internos llevan el prefijo, por lo que no afecta la demo; solo a quien pegue la URL corta |
| H4 | Baja | MEN | En 1440, tras agregar desde la hoja, no aparece «Hazlo combo» (en 390 sí, dentro de la hoja). Puede ser intencional (el escritorio usa el aviso + panel «Tu pedido»); confirmar contra el lienzo |
| H5 | Baja | PRO | En la ficha en 390 conviven el `LtoBadge` «LA MÁS PEDIDA» (lima, 88 px) y el chip «Pedida 320 veces esta semana» (Garlic): dos mensajes casi iguales seguidos |
| H6 | Informativa | DAT | 21 de 65 imágenes de `/menu` (390) están en tarjetas con `display:none`; con el selector por defecto no se ven. No es defecto; sirve para entender las «fotos vacías» de la captura de página completa (las visibles cargan todas) |

## Pasada de observación (capturas abiertas)
- `-390-tarjeta-pizza.png`: tarjetas 2 columnas con foto recortada, «+» lima, precio en Sauce, botones «Agregar» y «½ Mitad» completos. El banner de cookies («Estas cookies no se comen») tapa parte de la fila inferior mientras no se acepta: es el diseño.
- `-390-hoja.png` y `-390-aviso2.png`: jerarquía correcta (foto, H2 Basil, precio display, tamaños con el seleccionado en lima).
- `-1440-hover.png`, `-1440-aviso.png`: grilla de 4, sombra al hover visible en la tarjeta de Napolitana Caprese, panel lateral «Tu pedido».

## Ruido de automatización
- La primera lectura de imágenes dio 23 «rotas»: eran las ocultas (ancho 0). `scrollIntoView` y los `fetch HEAD` a la CDN no sirven para contarlas (CORS).
- La captura inicial de `/p/pz-pollo-bbq` fue la Home (H3); se repitió con el prefijo.

## No cubierto
- Viewport 778 px (regresión del desborde): no se probó.
- iOS/Safari: no reproducible con este navegador.
- Comparación contra el lienzo Figma/`Menu.dc.html` valor por valor: solo se usó la especificación de UX-1 y `VIS-API.md`.
- Compra completa ni pago: fuera de alcance.

## Cambios en el ambiente
- Carrito de invitado de la prueba con 2× Pollo BBQ Familiar Tradicional en El Bosque (sesión aislada, se pierde al cerrar el contexto). Nada escrito en el sandbox más allá del carrito de invitado.
- Servidor del puerto 5175 detenido. Página propia cerrada (queda la `VAL-R2` en `about:blank`, que no es mía).
