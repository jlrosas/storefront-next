# VAL-C1 · Validación integrada del paso C (VIS-06, HOM-08, OFE-06, TIE-05)

Worktree `storefront-wt/VALC`, rama `val/c1` (commit 076f705: demo + hu/VIS + hu/HOM + hu/OFE + hu/TIE). `pnpm dev --port 5187`, levantado y detenido por VAL. Navegador `chrome-devtools-headless-3`, contextos aislados (`VAL-C1` en 1440, `VAL-C1b` en 390), sesión limpia. 390x844 DPR 2 táctil con UA Android y 1440x900 DPR 1. Fecha 06-nov-2026.

## Verificación estática

| Comando | Resultado |
|---|---|
| `pnpm typecheck` | ✅ sin errores |
| `pnpm lint` | ✅ exit 0 (oxlint, vertical-imports, format y e2e) |
| `pnpm vitest run` | ✅ 702 archivos pasan, 1 omitido; 12.859 pruebas pasan, 3 omitidas. Ruido de jsdom («Not implemented: navigation») y un `ERROR fail` de log de una prueba que igual pasa |

## Veredictos

| Historia | Veredicto |
|---|---|
| VIS-06 | **APROBADA** (con 2 menores) |
| HOM-08 | **APROBADA** (con 2 menores) |
| OFE-06 | **APROBADA** (con 1 menor) |
| TIE-05 | **APROBADA** (con 1 menor) |

## VIS-06

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | `sw` ≥ ancho pintado × DPR; `srcset` con `sizes`; nunca sobre el natural | ✅ | Medido con `currentSrc` (parámetro `sw`) vs ancho × DPR en 390: Home Valentina (hero 1440 para 661 px pintados, tarjetas 348 px → sw 800–1440, combos 204 px → 640), menú (tiles 252 px → 640; hero 960/720), ficha Hawaiana (foto 582 px → `sw` 1280, necesita 1164), constructor (242 px → 640). 0 imágenes rotas y 0 con `sw` bajo lo necesario. Usan `srcset` por descriptor `w` y `sizes` (p. ej. `sizes="348px"`), por eso `naturalWidth` sale dividido. En 1440: promos 960/800/400 para 911/653/384 px (DPR 1). `VAL-C1-ficha-390.png`, `VAL-C1-menu-390.png` |
| 2 | `LtoBadge` con interlineado ≈ 0,8 | ✅ | `lto-badge.tsx`: `leading-[0.75]` y `leading-[0.8]` en el texto. La píldora «LA MÁS PEDIDA» es otro componente en una línea (no se vio «LA MÁS / PEDIDA» en dos líneas, así que lo visual no se pudo comprobar; ver M1) |
| 3 | Aviso de agregado anclado bajo el encabezado; vuelo y salto del contador | ✅ | Toast a top 62–148 px con encabezado hasta 60 px (390); el contador del carrito pasa a «1». `fly-to-cart.ts` cargado. `VAL-C1-aviso-agregado-390.png` |
| 4 | Template `store-locator` desregistrado y borrado | ✅ | No existe carpeta de *template* `store-locator`. La extensión `src/extensions/store-locator` sigue porque `root.tsx` y el contexto de pruebas la importan (el `rg` la confirma en uso), por tanto no corresponde borrarla |
| 5 | Combos con original de 432 px: lista para DAT | ⚠️ solo documental | No es verificable en el sitio; el tope de recorte no agranda (criterio 1). Sin evidencia de DAT |

## HOM-08

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | 390x844 con barra inferior: precio y CTA completos, 3 perfiles | ✅ | Barra inferior desde y=779. CTA: Sofía «Repetir pedido» 710–762, Diego «Armar mi Super Dúo» 669–721, Valentina «Lo quiero» 710–762. Foto ≈ 51 % (430 de 844 px). Titular corto; `text-wrap: balance` en el h1 de Diego («SUPER DÚO») y en subtítulos; «¿LO DE SIEMPRE?» y «THE WORKS FAMILIAR» quedan con `wrap` (ver M2). `VAL-C1-home-{sofia,diego,valentina}-390-pliegue.png` |
| 1b | Con el aviso nuevo de VIS bajo el encabezado | ✅ | Banda «Primer pedido directo: +100 Papa Puntos» (Diego, granate) y «¡Volviste!…» (Valentina, lila) entre el encabezado y el hero; el CTA sigue completo |
| 2 | Diego: dos pizzas, acento granate o lila, momento propio | ✅ | Hero Super Dúo con dos pizzas; sello -19 % granate (390) y banda granate; momento «Partido» seleccionado con «Para ver el partido». En 1440 el sello del hero es lima (ver M3). `VAL-C1-home-diego-1440-full.png` |
| 3 | Sofía 1440: «Tus favoritas» con 3 tarjetas; barra de puntos lima sobre pista Dough | ✅ | Pollo BBQ, Todas las carnes y Super Pepperoni mediana («Canjéala con tus puntos», «Canjear · 260 pts» en lila/granate); barra lima `rgb(207,235,12)` sobre `bg-pj-dough/20`. `VAL-C1-home-sofia-1440-full.png` |
| 4 | Precio alineado en «Para 3»; sin «4.» huérfano | ✅ | Los 5 tarjetas «Para N» con el precio en el mismo y (1142 px) y la misma altura (363); sin «4.» suelto en el texto |
| 5 | `AccentWord` en «¿HAY ALGO QUE CELEBRAR?» | ✅ | Con el chip «Celebración»: «CELEBRAR» en píldora granate con texto lima inclinada (`VAL-C1-home-celebrar-1440.png`, sin abrir; medido por estilo: fondo `rgb(113,5,0)`) |

## OFE-06

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | 1440: dos columnas, ranuras *sticky* a la izquierda, grilla de `FoodCard` a la derecha; CTA incompleto en contorno Basil «Te falta 1 pizza» | ✅ | Panel sticky `top-16` a x=117 (500 px) con ranuras 220x273 (ver M4), `LtoBadge` -19 %, precio display, CTA blanco con borde Basil `rgb(45,93,42)` y texto Basil, deshabilitado. Grilla de 3 columnas a la derecha. `VAL-C1-constructor-incompleto-1440.png`; completo `…-completo-1440.png`; 390 `VAL-C1-constructor-390.png` (ranuras en fila, CTA contorno fijo abajo) |
| 2 | Títulos en `pj-card-title`; seleccionado en Basil + Dough | ✅ | 5 tarjetas de Promos con `pj-card-title`; seleccionada: fondo `rgb(45,93,42)` y texto `rgb(245,232,220)`; CTA completo «Agregar Super Dúo · $22.590» |
| 3 | Vencida: «LLEGASTE TARDE A HALLOWEEN», fecha solo en la pastilla | ✅ | `/promos/box-halloween` (390): pastilla «SE FUE EL 2 DE NOVIEMBRE», h1 «LLEGASTE TARDE A HALLOWEEN», sin la fecha en el título. `VAL-C1-vencida-390.png` (sin abrir) |
| 4 | Promos sin huecos 1440; combos sin cortes; sello sin tapar la botella | ✅ | Grilla 3 columnas con la tarjeta «¿Ninguna te convence?» llenando el hueco; botella visible y sello -19 % arriba a la izquierda; leve recorte lateral de los palitos en Papa Combo Palitos (aceptable). `VAL-C1-promos-1440.png` |
| 5 | `AccentWord` en la destacada | ✅ | «PIZZA DEL MES **THE WORKS**» en píldora lima inclinada |
| F4 | Sin doble agregado | ✅ | Un solo `POST /action/pj-combo-add.data` tras confirmar la tienda; «Mi pedido · 1» |

## TIE-05

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | Un solo botón relleno | ✅ | 390 y 1440: solo «Pedir en El Bosque» relleno; el resto en contorno («Programar», «Elegir», «Mi ubicación», «Delivery») |
| 2 | «Tu tienda» en Garlic + Basil | ✅ | Píldora lila con texto Basil y tarjeta con borde Basil |
| 3 | Grupos «Cerca de ti» y «Todas las tiendas» colapsado | ✅ | h2 «CERCA DE TI» (3 tarjetas) y «TODAS LAS TIENDAS · 20 tiendas más en Santiago» con `aria-expanded=false` |
| 4 | 1440: mapa SVG con pines Basil | ✅ | SVG 600x720 con pines Basil, pin de «El Bosque» resaltado; en 390 también aparece como banda. `VAL-C1-locales-1440.png`, `-390.png` |
| 5 | `<title>` | ✅ | «Locales \| Papa Johns» |
| 6 | Tiempos no todos iguales | ✅ | 15 min (El Bosque), «Solo programado» (Providencia), 35 min (Salvador) |
| 7 | Panel: Confirmar bloqueado mientras carga | ✅ | Con tiendas cargando: «Confirmar · Cargando tiendas…» `disabled=true` (a 604 ms); a 905 ms «Confirmar · El Bosque · 15 min» habilitado. `VAL-C1-constructor-panel-1440.png` |
| 8 | Agregado pendiente se retoma al confirmar (#67) | ✅ | Constructor (contexto nuevo, 1440): Agregar Super Dúo → panel → Confirmar → `set-selected-store` + `pj-combo-add` → toast «¡Agregado! Super Dúo», panel cerrado. Home (contexto nuevo, 390): «+» de Pollo BBQ → panel → Confirmar → toast «¡Agregada! Pollo BBQ Familiar», carrito «1 producto». Un solo agregado cada vez. `VAL-C1-home-mas-panel-390.png` |

## Transversales

| Verificación | Resultado | Evidencia |
|---|---|---|
| VIS-06 no rompió fotos de HOM/OFE | ✅ | 0 rotas, 0 blandas (`sw` ≥ necesario) en Home ×3, promos, constructor, menú, ficha. Las diapositivas fuera de pantalla del carrusel del menú salen con `nat=0` y `sw=480` hasta cargarse (carga diferida, no roto; ver M5) |
| HOM-08 con el aviso nuevo | ✅ | Ver HOM-08 criterio 1b |
| Contraste ADA | ✅ | 0 textos bajo 4,5:1 (3:1 grandes) en Home Valentina, menú, constructor y ficha (la única marca, «Recién salida del horno», es un falso positivo: texto sobre foto con píldora oscura) |
| Texto ≥ 12 px | ✅ | 0 textos < 12 px en las mismas pantallas |
| Áreas táctiles ≥ 44 px (390) | ⚠️ | Botón «+» 44x44; el resto ≥ 44. Los enlaces de título de categoría de Home Valentina («POLLO BBQ», «SUPER DÚO»… 23 px de alto) son enlaces de texto dentro de la tarjeta, que además es clicable completa; no se midió el resto de Home Sofía/Diego (ver No cubierto) |
| Consola | ✅ | Solo ruido conocido: WebSocket HMR `ws://localhost:24678` (400) y desajuste de hidratación por `nonce` (critical.css y JSON-LD); aviso «no active adapters». Sin errores de código propio |

## Notas por pantalla (criterio de la tabla de UX-2; meta ≥ 7)

| Pantalla | 390 | 1440 | Nota | Comentario |
|---|---|---|---|---|
| Home Sofía | 8 | 8 | **8** | Hero completo sobre la barra, «Tus favoritas» y puntos limpios. Resta: el banner de cookies tapa el CTA en la primera visita y el chip dice «Elige tienda» pese al perfil (INT-08, fuera de alcance) |
| Home Diego | 8 | 8 | **8** | Dos pizzas, aviso granate, momento «Partido», precios alineados |
| Home Valentina | 8 | — | **8** | Aviso lila, The Works con CTA completo, momentos |
| Menú | 8 | — | **8** | Carrusel de ofertas, filtros y tarjetas; foto nítida |
| Ficha (Hawaiana) | 8 | — | **8** | Foto grande sin banda vacía, CTA fijo con precio; sigue el chip «Pedida 140 veces» (MEN-06, fuera de alcance) |
| Promos | — | 8 | **8** | Destacada con acento, grilla sin huecos |
| Constructor Super Dúo | 8 | 8 | **8** | Dos columnas sticky, CTA en contorno, selección en Basil |
| Locales | 8 | 9 | **8,5** | Un solo botón relleno, mapa, grupos; muy superado el 7 |

Promedio 8,1: **todas las pantallas ≥ 7**.

## Hallazgos

| ID | Sev. | Resp. | Qué |
|---|---|---|---|
| M1 | Menor | VIS | El chip «LA MÁS PEDIDA» no se ve en dos líneas con el interlineado de `LtoBadge` (es un componente distinto); el cierre visual de la regla de 0,8 solo se comprobó en el código, no en pantalla |
| M2 | Menor | HOM | `text-wrap: balance` solo está en el h1 y subtítulos; «¿LO DE SIEMPRE?» y los h2 quedan en `wrap` (no se parten en pantalla, sin efecto visible hoy) |
| M3 | Menor | HOM | En Diego a 1440 el sello del hero (-19 %) es lima; a 390 es granate. El criterio pide acento granate o lila en ambos |
| M4 | Menor | OFE | Las ranuras del constructor a 1440 miden 220x273 y el criterio habla de fotos de 240 px |
| M5 | Menor | VIS | Hero del menú: las diapositivas ocultas piden `sw=480` (Super Dúo, Combo con Postre) aunque pintan 348–408 px a DPR 2 (necesitan ≈ 700–816). Al hacerse visibles puede verse un instante más blando; no se probó el cambio de diapositiva |
| M6 | Menor | DAT | En el constructor, «Boom de Jamón» y «Hawaiana» usan una foto macro/otro fondo que rompe el fondo verde de las otras tarjetas (la serie macro con base verde y sombra) |
| M7 | Info | TIE | Conteo: Locales dice «20 tiendas más» + 3 cercanas = 23 y el mapa «23 tiendas»; VAL-TIE-04 contó 24. Sin confirmar si falta una tienda en el grupo |
| M8 | Info | HOM | Con el banner de cookies abierto (primera visita), el CTA del hero de Sofía queda tapado a 390; con el aviso aceptado queda completo. Es del template (ya visto en VAL-TIE H4) |
| M9 | Info | TIE | Toast de agregado se trunca el nombre en 390 («Pollo BBQ F…») |

Sin hallazgos de integración: typecheck, lint y pruebas pasan y los cuatro historias conviven sin conflictos.

## Ruido de automatización
- `evaluate_script` con `sourcePath` solo acepta rutas dentro del proyecto; el script de medición se guardó en `.claude/test-evidence/VAL-C1/audit.js`.
- Los clics en el panel y en «+» se dispararon por script (`click()`); la lectura del estado cambia en 300 ms, por eso la ventana de «Cargando tiendas…» se vio a 604 ms.
- `perfil=` sin limpiar cookies manualmente entre perfiles: se verificó el saludo/aviso de cada uno (Sofía «Hola, Sofía», Diego banda granate, Valentina banda lila).

## No cubierto
- Safari iOS. Sesión de cliente real (los perfiles se probaron con `?perfil=`).
- 1440: Home Valentina, menú y ficha (solo 390); 390: Promos y Home Diego/Sofía completos (solo pliegue). Capturas guardadas sin abrir: `VAL-C1-home-celebrar-1440.png`, `VAL-C1-vencida-390.png`, `VAL-C1-constructor-completo-1440.png`, `VAL-C1-constructor-panel-1440.png`, `VAL-C1-home-mas-panel-390.png`.
- No se verificaron: tiempos de la lista «Todas las tiendas» (colapsada), «Mitad»/«Hazlo combo» (MEN-06), chip de sesión (INT-08), cambio de diapositiva del carrusel.
- Contraste/tamaño/táctiles solo medidos con script en 390 (Home Valentina, menú, constructor, ficha).

## Cambios en el ambiente
- El sandbox recibió 2 carritos de invitado (uno con Super Dúo en contexto 1440, otro con Pollo BBQ en contexto 390), creados por las pruebas de #67 y del panel; no se revierten (carritos efímeros, sin pago ni orden). Se tocó la regla «no escribas en el sandbox» solo por la prueba pedida del «+» y «Agregar» del Super Dúo.
- Servidor del 5187 detenido (sin respuesta tras el cierre). Páginas de VAL cerradas; queda la página 1 en `about:blank`.
