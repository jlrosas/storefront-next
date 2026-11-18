# UX-2 · Cierre de la oleada de pulido visual · Papa Johns Chile

- **Fecha:** 06-nov-2026
- **Modo:** incremental sobre [UX-1 · Dirección visual](UX-1-direccion-visual.md), con foco en «entrar por los ojos».
- **Alcance:** la demo integrada en la rama `demo` (`http://localhost:5173/cl/es-CL/`), a 390×844 (DPR 2, táctil) y a 1440×900. Se revisaron:
  - la Home de Valentina, Diego y Sofía;
  - `/menu`, la ficha Pollo BBQ y su hoja;
  - `/promos`, el constructor Super Dúo (incompleto, completo y agregado) y `/promos/box-halloween`;
  - `/store-locator` y el panel de tienda;
  - un vistazo a `/cart`.
- **Capas:** heurísticas base, vertical `qsr-delivery`, Storefront Next y la marca S-D18 (Papa Sans y la paleta BGYS con sus reglas ADA).
- **Método:** Contraste y tipografía se midieron en el DOM con la lógica de `audit-dom.js`, y los colores sueltos con `contrast.py`.
- **Límites:**
  - Es una revisión experta, sin usuarios.
  - Rappi, Uber Eats y Domino's se comparan como patrones conocidos: no hay capturas nuevas suyas.
  - No se midió el LCP.
  - Las notas «antes» de UX-1 se asignan ahora, porque UX-1 no puso números.

---

## Veredicto

**En la vitrina, sí compite. En el momento de decidir y pagar, todavía no.**

La Home, el menú y Promos ya «entran por los ojos». Tienen:
- la foto a sangre con la tarjeta crema flotante;
- el sello LTO y el precio display;
- el granate y el lila dando ritmo;
- los «+» lima sobre la foto;
- la voz BGYS («Estas cookies no se comen», «¡Volviste!», «Pedir directo tiene premio»).

En el primer pliegue móvil, la Home de Valentina está al nivel de Domino's EE.UU. y por encima de Rappi y Uber Eats en identidad de marca: ellos son plataformas neutras y nosotros parecemos Papa Johns. El salto desde UX-1 es grande.

La cadena se corta justo cuando el usuario se compromete:
- El **constructor Super Dúo en escritorio**, la oferta del anuncio de Diego, sigue siendo una columna blanca angosta con fotos chicas y títulos negros.
- **Locales** es un muro de 25 botones verdes iguales.
- Las **fotos se ven blandas**, porque se sirven a menos resolución de la que se pintan.
- En **Sofía**, el encabezado dice «Ingresar» y «Elige tienda» justo debajo de «Hola, Sofía · Retiro en El Bosque».
- El **carrito** sigue siendo el del template.

Un cliente que mire la demo completa notará el escalón entre la vitrina y la transacción. Eso es lo que hay que cerrar en la oleada 2.

### Notas por pantalla (1 a 10, «entrar por los ojos» dentro de la marca)

| Pantalla | Antes (UX-1) | Después (UX-2) | Evidencia después |
|---|---|---|---|
| Home Valentina | 4 | **8** | `UX-2-home-valentina-390.png`, `-1440.png`, `UX-2-home-valentina-pantalla1-390.png` |
| Home Diego | 4 | **7** | `UX-2-home-diego-390.png`, `-1440.png` |
| Home Sofía | 4 | **7** (390) · **6** (1440) | `UX-2-home-sofia-390.png`, `-1440.png` |
| Menú | 5 | **7,5** | `UX-2-menu-390.png`, `UX-2-menu-grilla-390.png`, `UX-2-menu-1440.png` |
| Ficha | 2 (template) | **6,5** | `UX-2-ficha-390.png`, `-1440.png` |
| Hoja | — (no se revisó) | **7,5** | `UX-2-hoja-390.png`, `-1440.png` |
| Promos | 4 (390) · 6 (1440) | **7,5** | `UX-2-promos-390.png`, `-1440.png` |
| Constructor Super Dúo | 5 | **6** (390) · **4,5** (1440) | `UX-2-super-duo-390.png`, `-completo-390.png`, `-agregado-390.png`, `-1440.png` |
| Oferta vencida | 5 | **7** | `UX-2-box-halloween-390.png`, `-1440.png` |
| Locales | 3 | **5,5** (390) · **4** (1440) | `UX-2-locales-390.png`, `-1440.png` |
| Panel de tienda | 6 | **8** | `UX-2-panel-390.png`, `-1440.png` |
| Carrito (oleada 2) | — | **3** | `UX-2-cart-390.png`, `-1440.png` |
| **Demo, promedio de lo pulido** | **≈ 4** | **≈ 7** | — |

**Frente a la competencia:**
- La Home y Promos ya compiten (7,5 a 8).
- La ficha y la hoja están cerca (6,5 a 7,5).
- El constructor en escritorio, Locales y el carrito no compiten (3 a 4,5).

Para decir «compite» sin asterisco, ninguna pantalla del guion puede quedar bajo 7.

---

## 1. Seguimiento de los ítems de UX-1

✅ resuelto · 🟡 parcial · ❌ pendiente

### P1

| # | Ítem | Estado | Evidencia y comentario |
|---|---|---|---|
| P1-1 | Ficha de PRO integrada | ✅ | `UX-2-ficha-390.png`: sello, H1 en Basil, precio display, tamaño preseleccionado y CTA fijo «Agregar al pedido · $16.900». Antes: `UX-17-ficha-390.png` (template). Ver N11 (la foto y la franja vacía) |
| P1-2 | `FoodImage` macro | 🟡 | El macro funciona en la grilla del menú (`UX-2-menu-grilla-390.png`). Pero las tarjetas de «Las más pedidas» y «Tus favoritas» a 1440, el constructor y la ficha siguen mostrando la pizza entera y lejos. Además, las fotos se sirven a menos resolución de la que se pintan (N1) |
| P1-3 | Hero de la Home | ✅ | A sangre, con tarjeta crema, en los 3 perfiles; *full* en 1440. Ver N3: el CTA queda bajo el pliegue a 390×844 |
| P1-4 | `LtoBadge` | ✅ | En el hero, Promos, menú, ficha y hoja. Ver N9 (interlineado) |
| P1-5 | Precio display | ✅ | En el hero, Promos, ficha, hoja y constructor |
| P1-6 | Ritmo de color | 🟡 | Valentina lo cumple: lila → hero → verde → crema → granate (`UX-2-home-valentina-1440.png`). **Diego no tiene ningún bloque granate ni lila** (N8) |
| P1-7 | Escala tipográfica | 🟡 | Ningún texto bajo 12 px y 0 fallas de contraste (Home 390), pero hay **13 tamaños** distintos en la Home (meta: 7). Siguen títulos en tinta negra o en Bold de tipo oración en las ofertas del menú a 1440, el constructor y las alternativas de la oferta vencida (N6) |
| P1-8 | Colores fuera de paleta | ✅ | `rg '#[0-9A-Fa-f]{6}' src/extensions` da 0 resultados |
| P1-9 | Aviso al agregar y micro-interacciones | ✅ | El aviso queda contenido a 390, con «+22 Papa Puntos por acreditar», y el contador salta (`UX-2-super-duo-agregado-390.png`). Ver N10: el aviso tapa el encabezado y oculta el salto |
| P1-10 | Cookies y footer | ✅ | Barra compacta «ESTAS COOKIES NO SE COMEN.» (`UX-2-home-valentina-pantalla1-390.png`); footer bajo con el lockup BIBP |

### P2

| # | Ítem | Estado | Evidencia y comentario |
|---|---|---|---|
| P2-11 | Tarjeta de producto | ✅ | «+» lima, sello «LA MÁS PEDIDA» en Garlic, sombra cálida y zoom (`UX-2-menu-1440.png`) |
| P2-12 | Promos móvil con destacada | ✅ | `UX-2-promos-390.png` frente a `UX-10-promos-390.png` |
| P2-13 | Valentina con carrusel y momentos | ✅ | «¿Qué se te antoja?» y «¿Y para este momento?» |
| P2-14 | Locales | 🟡 | Hereda las tarjetas del panel, tiene *skeleton* y respeta `?modo=delivery` (VAL-TIE-04). Pero visualmente es el más «duro» de la demo (N5) |
| P2-15 | Panel de tienda | ✅ | Un solo patrón de seleccionado (Basil) y «Confirmar · El Bosque · 15 min» (`UX-2-panel-390.png` frente a `UX-14-panel-tienda-390.png`) |
| P2-16 | Constructor (*pop*, latido, «Ver mi pedido») | ✅ | Después de agregar, el CTA pasa a «Ver mi pedido» (`UX-2-super-duo-agregado-390.png`). El *pop* lo verificó VAL |
| P2-17 | Fotos destacadas | ✅ | Queso estirándose en el bloque de momentos y napocherry en la lealtad |
| P2-18 | Textos BGYS | ✅ | Ver N12 para la oferta vencida |
| P2-19 | Barra inferior | ✅ | Píldora Garlic con el punto Tomato y etiquetas de 12 px |

### P3

| # | Ítem | Estado | Evidencia y comentario |
|---|---|---|---|
| P3-20 | Grano SVG | ✅ | `base.css:596` |
| P3-21 | `AccentWord` | 🟡 | El componente existe (`VIS-API.md`), pero **no se usa en ninguna pantalla** (N16) |
| P3-22 | Video del queso | ❌ | No hay material; se mantiene como supuesto |
| P3-23 | *Easter egg* de la tercera pizza | ❌ | No está implementado |

### Errores funcionales

| # | Ítem | Estado | Evidencia y comentario |
|---|---|---|---|
| F1 | «Lo quiero» lleva al template | ✅ | Ahora abre la ficha de PRO (VAL-HOM-07) |
| F2 | Ficha del template | ✅ | Igual que P1-1 |
| F3 | Aviso cortado a 390 | ✅ | — |
| F4 | Doble agregado en el Super Dúo | ✅ | «Ver mi pedido» |
| F5 | «No hay tiendas» mientras carga | ✅ | *Skeleton* (VAL-TIE-04) |
| F6 | La Coca-Cola al centro en el combo | 🟡 | El bloque de momentos ahora usa otra foto. En «¿Qué se te antoja?» y en Promos, las fotos de combo cortan las pizzas a la mitad (Super Dúo y Super Trío) |
| F7 | «Para tu viernes» | ✅ | El momento sale por hora («Después de las 22 h») |
| F8 | «½» en móvil | ✅ | «½ Mitad» |
| F9 | Tres patrones de seleccionado en el panel | ✅ | Dentro del panel. Entre pantallas hay otro conflicto (N7) |
| F10 | Espacio antes del «·» | ✅ | «Agregar Super Dúo · $22.590» |
| F11 | Huérfanos de texto | 🟡 | Siguen el «4.» huérfano del hero de Valentina a 390 (#62) y el precio desalineado de «Para 3» a 1440 (#63) |
| F12 | `?modo=delivery` | ✅ | VAL-TIE-04 |

**Resumen:** de 33 ítems, 24 ✅, 7 🟡 y 2 ❌. Los dos ❌ son P3 opcionales.

---

## 2. Lo que más mejoró

1. **La Home pasó de «plantilla vestida de verde» a vitrina de marca.**
   - **Antes** (`VIS-home-valentina-antes-390.png`, `HOM-07-valentina-antes-390.png`): franja lima de 2 líneas, foto turquesa con la pizza lejos, tarjetas «Más pedida» planas y lealtad en verde sobre verde.
   - **Después** (`UX-2-home-valentina-390.png` y `-1440.png`): saludo en lila con granate, pizza macro a sangre, tarjeta crema flotante con sello -50 % granate, «Lo quiero · $10.990», carruseles por intención y lealtad en granate con la foto de napocherry.
   - En 1440, el hero *full* reemplaza el panel verde sólido (`HOM-07-diego-antes-1440.png` → `UX-2-home-diego-1440.png`).
2. **La ficha dejó de ser el template.**
   - **Antes** (`UX-17-ficha-390.png`): «PAPA JOHNS» como marca, rango de precios, código postal y un error rojo antes de tocar nada.
   - **Después** (`UX-2-ficha-390.png`, `UX-2-hoja-390.png`): sello LTO, H1 en Basil, `$16.900` display en Rich Sauce, tamaños en tarjetas y una barra fija con el resumen («Pollo BBQ · Familiar · Tradicional»).
3. **Promos móvil ya tiene una protagonista.**
   - **Antes** (`UX-10-promos-390.png`): 6 tarjetas idénticas con una pastilla roja rectangular.
   - **Después** (`UX-2-promos-390.png`): la Pizza del Mes destacada en verde, con sello lima, precio display lima y «Ahorras $10.910»; el resto va en tarjetas con sello circular.
   - A 1440 (`UX-2-promos-1440.png`), el *split* 50/50 del playbook queda logrado.

**Proteger:**
- el panel de tienda (`UX-2-panel-390.png`, la mejor pieza transaccional de la demo);
- el patrón «Hazlo combo» con «Sí, hazlo combo» en granate (`UX-2-menu-agregado-1440.png`);
- el contraste: 0 fallas y 0 textos bajo 12 px en la Home a 390.

---

## 3. Lo que todavía se ve «duro» o rompe la marca

### P1 · Antes de la demo

**N1 · Las fotos se ven blandas: se sirven a menos resolución de la que se pintan · todas las pantallas · VIS + DAT**
- **Medido en el DOM:**
  - Ficha a 390: el `img` tiene un ancho natural de 390 px y se pinta a 590 px CSS con DPR 2. Le faltan unos 3×.
  - Tarjetas del menú a 390: 240 px naturales pintados a 408 px CSS (unos 3,4× con DPR 2).
  - Hero de Sofía a 1440: 1.440 px naturales pintados a 2.031 px, con 1,05 de Ken Burns.
  - `cb-pizza-del-mes.jpg` pedida con `sw=800` llega a 432 px: el original del combo es chico.
- **Impacto:** en un proyector o una pantalla retina, el queso pierde textura. Es justo lo que vende el «antojo», y en un dorso a dorso con Domino's se nota.
- **Qué cambiar:**
  - `FoodImage` debe calcular `sw = ancho pintado × DPR × escala del recorte`, con tope en 1.440, y entregar `srcset` con `1x` y `2x` (o `sizes` correctos).
  - Que la escala del recorte macro nunca agrande por encima del ancho natural.
  - En combos con un original de 432 px, DAT debe buscar una versión mayor en el CDN o no usarlos en tamaños sobre 400 px CSS.

**N2 · Sofía «logueada» con el encabezado de invitado · Home Sofía (390 y 1440) · INT + TIE (#10, #27)**
- `UX-2-home-sofia-1440.png`: «HOLA, SOFÍA», «Retiro en El Bosque · Visa ····4521»… y el encabezado dice **«Ingresar»** y **«Retiro o delivery · Elige tienda»**.
- **Impacto:** es la persona *heavy user* de la demo, y la contradicción salta a la vista del cliente.
- **Qué cambiar:**
  - Con `perfil=sofia`, el layout lee la sesión del perfil y muestra «Hola, Sofía» y el avatar en lugar de «Ingresar».
  - El chip toma la última modalidad: «Retiro · 15 min / El Bosque».
  - Valentina y Diego también son clientes registrados (supuesto de la demo): el mismo arreglo les aplica.

**N3 · El CTA principal del hero queda bajo el pliegue a 390×844 · Home de los 3 perfiles · HOM**
- **Medido:**
  - «Lo quiero · $10.990» empieza en y = 840 de 844.
  - «Repetir pedido · $23.890» de Sofía empieza en y = 830.
  - Los dos quedan además detrás de la barra inferior (`UX-2-home-valentina-pantalla1-390.png` muestra el titular, pero ni el precio ni el botón).
- **Impacto:** la primera pantalla dice «qué», pero no «cuánto» ni «cómo». Domino's pone el precio y el CTA en el primer pliegue. Para Sofía, cuya tarea es repetir en un toque, es un paso extra.
- **Qué cambiar:**
  - Bajar la foto del 60 % a un 50–52 % del alto. Corrijo mi propio criterio de UX-1: lo que importa es que el CTA se vea.
  - Subir la tarjeta (`-mt-28`).
  - Acortar el titular: «THE WORKS FAMILIAR», porque la etiqueta ya dice «Pizza del mes de noviembre».
  - Aplicar `text-wrap: balance` a la descripción, que también cierra el «4.» huérfano (#62).
  - **Criterio:** a 390×844, con la barra inferior visible, el precio y el CTA quedan completos sin hacer scroll en los 3 perfiles.

**N4 · El constructor Super Dúo en escritorio es la pantalla más plana de la demo · `/promos/super-duo` a 1440 · OFE**
- `UX-2-super-duo-1440.png`: una columna blanca de unos 880 px sobre crema, fotos de 110 px de alto sin macro, títulos en tinta negra con Bold de 16 px, sin sello y con un CTA gris deshabilitado. A 390 está mejor, pero con el mismo problema en las tarjetas (`UX-2-super-duo-390.png`).
- **Impacto:** es el destino del anuncio que trae a Diego (el *switcher*). Si la vitrina promete y el constructor se ve como un formulario, el contraste lo nota cualquiera.
- **Qué cambiar:**
  - En 1440, dos columnas. A la izquierda, *sticky*: las dos ranuras grandes (fotos de 240 px que se llenan con *pop*), el `LtoBadge` -19 %, el precio display y el CTA.
  - A la derecha, la grilla de 3 columnas con `FoodCard` macro y el título en `pj-card-title` (Condensed Basil).
  - Mientras está incompleto, el CTA va en contorno Basil con «Te falta 1 pizza», no gris.
  - A 390, las mismas tarjetas macro y los títulos en Condensed.

**N5 · Locales es un muro de botones verdes · `/store-locator` (390 y 1440) · TIE**
- `UX-2-locales-1440.png`: 25 tarjetas con 25 botones Basil rellenos iguales, en una columna de unos 830 px con un tercio vacío a la derecha. «Listo en 15 min» se repite en casi todas, lo que parece dato inventado.
- A 390 (`UX-2-locales-390.png`) hay 4 rellenos seguidos en la primera pantalla, y El Bosque, la tienda ya elegida, no se marca como tuya.
- **Impacto:** se ve como un listado administrativo, cuando Uber Eats y Rappi muestran un mapa y la «tienda actual».
- **Qué cambiar:**
  - Un solo botón relleno: el de la tienda elegida, o el de la más cercana si no hay ninguna. El resto, «Elegir» en contorno.
  - Marcar «Tu tienda» en Garlic + Basil.
  - Agrupar «Cerca de ti» (las 3 primeras) y «Todas las tiendas» (colapsado).
  - En 1440, lista a la izquierda y a la derecha una imagen estática del mapa de Santiago con pines Basil (sin API de mapas; supuesto de demo) o la foto de la fachada de El Bosque.
  - Agregar `<title>`: hoy la pestaña muestra la URL.

### P2 · Suben el nivel

**N6 · Dos sistemas de título de tarjeta · Menú (ofertas), Promos, constructor y oferta vencida · OFE + MEN**
- La Home usa `pj-card-title`: Condensed, mayúsculas y Basil.
- Las ofertas del menú a 1440 (`UX-2-menu-1440.png`) van en Bold de tipo oración y en **tinta negra**; las tarjetas de Promos, en Bold Basil de tipo oración; el constructor y las alternativas de la oferta vencida, en tinta negra.
- **Qué cambiar:** una sola clase en todas las tarjetas de producto y oferta. Es lo que más «ordena» la vista sin tocar el layout.

**N7 · «Seleccionado» en dos colores según la pantalla · ficha, hoja, constructor y panel · PRO + OFE**
- El panel usa Basil relleno (resuelto en TIE-04). La ficha, la hoja y el constructor usan un relleno lima.
- En la ficha, el chip «Ganas 16 Papa Puntos», también lima, se lee como una opción elegida (`UX-2-ficha-1440.png`).
- **Decisión:** el seleccionado es **Basil relleno + texto Dough** en todo el sitio. El lima queda para el CTA sobre fondo oscuro, los sellos y el «+». El chip de puntos pasa a Garlic + Sauce.

**N8 · Diego sin acento de color y con el mismo bloque de momento que Valentina · Home Diego · HOM**
- `UX-2-home-diego-1440.png` alterna crema → verde → crema → footer verde: ni granate ni lila.
- El bloque «¿Y para este momento?» es idéntico al de Valentina: la misma foto y la misma oferta «Antojo de noche».
- El hero «Super Dúo» muestra **una** pizza; antes mostraba dos (`HOM-07-diego-antes-1440.png`), que es lo que promete el producto.
- **Qué cambiar:**
  - Volver a la foto de dos pizzas en recorte `hero`.
  - Poner «¿Para cuántos?» sobre Garlic o agregar una franja granate «Primer pedido directo: +100 Papa Puntos» (el gancho del *switcher*).
  - Darle a Diego la foto de partido o almuerzo en el bloque de momento.

**N9 · Interlineado del `LtoBadge` · todas · VIS**
- Medido: `line-height` de 31,5 px sobre 21 px (1,5), en lugar del 0,75 del playbook.
- «LA MÁS / PEDIDA» se ve como dos palabras sueltas en la ficha y la hoja (`UX-2-ficha-390.png`). La clase de tamaño (`SIZE`) pisa el `leading-[0.75]`.
- **Qué cambiar:** forzar `leading-[0.8]` en el `span` interno.

**N10 · El aviso de agregado tapa el encabezado y esconde el salto del carrito · 390 · VIS**
- `UX-2-super-duo-agregado-390.png`: el aviso cubre el logo y el carrito, y el contador «1» apenas asoma.
- **Qué cambiar:** anclar el aviso bajo el encabezado (`top: var(--pj-header-height)`), para que el vuelo de la miniatura y el salto del contador se vean.

**N11 · Ficha: franja vacía, columna vacía y foto entera · `/p/pz-pollo-bbq` · PRO (+ DAT #45)**
- Hay una banda crema vacía de unos 32 px entre el encabezado y las migas, a 390 y a 1440.
- A 1440, la columna izquierda queda vacía bajo «Lleva» (`UX-2-ficha-1440.png`).
- La foto muestra la pizza entera, no el macro.
- **Qué cambiar:**
  - Quitar la banda.
  - Hacer la foto *sticky* en 1440, para que acompañe el scroll de las opciones.
  - Aplicar el recorte `macro` real.

### P3 · Pulido

- **N12 · Oferta vencida · OFE:** «LLEGASTE TARDE A BOX HALLOWEEN DE MIEDO» no suena natural. Usar «LLEGASTE TARDE A HALLOWEEN» (texto de UX-1 §3.6). La fecha se repite en la pastilla y en la bajada: dejarla solo en la pastilla.
- **N13 · Grillas con huecos a 1440 · MEN + OFE:** «Favoritas» muestra 2 de 4 columnas (`UX-2-hoja-1440.png`, al fondo) y Promos deja 5 tarjetas sobre 3 columnas (`UX-2-promos-1440.png`). Completar la fila con una tarjeta de cierre («Arma tu pizza», «Ver el menú») o pasar a `auto-fill`.
- **N14 · Tarjeta del menú con 3 acciones · MEN:** «+», «Agregar» y «½ Mitad». El «+» y «Agregar» hacen lo mismo: fue mi recomendación de UX-1 y en la práctica sobra uno. En la grilla del menú, dejar el «+» sobre la foto y «½ Mitad» como acción secundaria; en los carruseles de la Home, solo el «+».
- **N15 · Fotos de combo partidas · OFE + HOM (F6):** Super Dúo y Super Trío cortan pizzas por la mitad en los bordes. Usar `crop="combo"` con `object-position` por producto, o encuadrar en 16:9.
- **N16 · `AccentWord` sin usar · HOM + OFE:** usarlo en 2 lugares, no más: «¿HAY ALGO QUE **CELEBRAR**?» (momento) y «PIZZA DEL MES **THE WORKS**» (destacada de Promos). Es el guiño de marca que falta y ya está construido.

### Decisiones sobre los puntos abiertos de `INTEGRACION.md`

| # | Decisión | Dueño |
|---|---|---|
| **#52** «Hazlo combo» no aparece en 1440 | **Reproducido y es un defecto, no una intención.** Sin tienda, el flujo pasa por el panel y sí muestra «Hazlo combo» (`UX-2-menu-agregado-1440.png`). Con la tienda ya elegida, solo sale el aviso (`UX-2-menu-agregado-con-tienda-1440.png`). El *cross-selling* es KPI del cliente (25 % → 35 %). **En escritorio, la oferta «Hazlo combo» aparece dentro del panel lateral «Tu pedido», bajo la línea recién agregada:** una tarjeta compacta con foto, «+$6.990», la bebida y «Sí, hazlo combo» en granate, y se va al aceptar o rechazar. El aviso queda corto | MEN (panel) con el componente de PRO · P2 |
| **#53** El sello y el chip «Pedida 320 veces» se repiten | **Queda el sello** «LA MÁS PEDIDA» sobre la foto (elemento de marca) y **sale el chip** de la ficha y la hoja. El dato se suma a la línea de valoración: «★ 4,7 · 1.240 opiniones · 320 esta semana» | PRO · P3 |
| **#64** Sofía sin franja lila | **No aplica: se cierra.** La franja lila es el mensaje de relación de Valentina («¡Volviste!»). Sofía tiene un saludo más personal: su nombre como titular y la píldora de puntos. Su acento de color es el bloque granate de Papa Puntos. Poner lila también ahí sería ruido | — |
| **#65** Sofía en 1440: tercio vacío y barra Tomato sobre granate | **Tercio vacío:** la fila pasa a 3 tarjetas. La tercera es la **Super Pepperoni mediana «Canjéala con tus puntos»** sobre Garlic, que une las favoritas con la lealtad. **Barra:** Tomato sobre Rich Sauce da 3,05:1 (pasa como componente, pero son dos rojos y no se ve). Pasa a **lima sobre una pista Dough al 20 %** (9,0:1). Tomato queda para lo decorativo sobre crema o Basil | HOM · P2 |
| **#48** Template `store-locator` | **Se desregistra y se borra.** Locales ya no lo usa, no aporta a la demo y dos implementaciones de la misma pantalla confunden a quien mantenga el código. Antes de borrarlo, INT confirma con `rg` que ninguna ruta lo importa | INT · P3 |

---

## 4. Dirección para la oleada 2 (carrito, ingreso y checkout)

El carrito de hoy (`UX-2-cart-390.png` y `-1440.png`) es el escalón más grande de la demo:
- dice «Despacho a domicilio» con retiro en El Bosque;
- muestra «Es un regalo», logos de Visa, Mastercard, Amex y Discover, y miniaturas con *letterbox*;
- tiene títulos negros y *skeletons* sin contenido a 390;
- no muestra Papa Puntos ni ofrece nada para sumar.

Para que la oleada 2 nazca al nivel de la vitrina:

1. **Lo transaccional también es de marca.**
   - Fondo Dough con grano.
   - Títulos en `pj-h2` y `pj-card-title` (Condensed Basil).
   - Precios en `PriceTag`: display solo para el total.
   - Cero tinta negra en los titulares y cero componentes del template a la vista: «Es un regalo», código postal, logos de tarjetas que no se aceptan.
2. **La modalidad manda y se ve arriba.** La primera tarjeta del carrito y del checkout es la de la tienda: «Retiro en El Bosque · listo en 15 min», con el mismo estilo del panel y «Cambiar». Nunca «Despacho a domicilio» si el chip dice retiro (#22, #29, #38).
3. **Cada línea se ve como la pizza que armé.** Foto `FoodImage crop="macro"` de 72 px, sin *letterbox*; la configuración en una línea («Familiar · Tradicional · sin cebolla», «½ Pollo BBQ · ½ Pepperoni» con foto dividida); el total con las opciones (#34, #37). «Editar» abre la hoja de PRO, nunca un diálogo del template.
4. **Un solo bloque de venta cruzada, con la misma pieza que «Hazlo combo».** Una tarjeta, no un carrusel: la sugerencia que complete el pedido (bebida o postre), con foto, precio y «+». El objetivo es el KPI de *cross-selling*, no llenar la pantalla.
5. **Los Papa Puntos son la recompensa visible del pago.** Bloque granate con «Este pedido suma 33 Papa Puntos» y, para Sofía, «Canjear 260 puntos · −$13.000» como interruptor. Es el único bloque de color fuerte del checkout, así que no compite con el CTA.
6. **Un CTA fijo con el monto, siempre en Basil.** «Ir a pagar · $33.800» y «Pagar · $33.800». A 390 queda fijo sobre la zona segura, sin barra inferior, y siempre visible. Si está deshabilitado, contorno y una razón en texto («Falta tu teléfono»), nunca un gris mudo.
7. **El ingreso sin fricción y con tono.** Los perfiles de la demo entran con sesión. Si se muestra `/login`, va con el lockup de marca, una sola columna y un botón «Ingresar» (no «Registrarse», #23). El tono es *Approachable*: sin chistes en el pago ni en los errores (regla de UX-1 §3.6).
8. **Movimiento con propósito y criterio de cierre.**
   - Al cambiar la cantidad, el total «cuenta». Al confirmar, check y *confetti* de color de marca, una vez, respetando «reducir movimiento».
   - **Criterio:** cada pantalla de la oleada 2 llega a 7 o más en esta misma tabla. UXD la revisa a 390 y 1440 antes de dar la oleada por cerrada.

---

## Accesibilidad medida (muestra)

| Patrón | Medida | Pantalla |
|---|---|---|
| Contraste de texto | 0 fallas | Home Valentina 390 |
| Texto < 12 px | 0 | Home Valentina 390 (en UX-1 había 13) |
| Tamaños de fuente distintos | 13 (meta: 7) | Home Valentina 390 |
| Áreas táctiles < 24 px | Los títulos-enlace de las tarjetas miden 23 px de alto (la tarjeta tiene además el «+» de 44 px); 1 «Saltar al contenido» de 1 px (intencional) | Home Valentina 390 |
| Tomato sobre Rich Sauce | 3,05:1 (solo componente) | Barra de puntos de Sofía |
| Lima sobre Rich Sauce | 9,02:1 | Propuesta para #65 |

## Nota de ambiente

- Las pruebas se hicieron en contextos aislados del Chrome sin ventana (`ux2-val`, `ux2-diego`, `ux2-sofia`), que ya se cerraron.
- Quedaron dos canastas de invitado abandonadas en el sandbox: un Super Dúo, y una Pollo BBQ con una Vegetariana. No afectan a otros contextos.
- No se tocó código ni configuración.
