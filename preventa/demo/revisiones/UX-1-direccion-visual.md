# UX-1 · Dirección visual de la demo · Papa Johns Chile

- **Fecha:** 06-nov-2026
- **Alcance:** la demo construida (rama `demo` de `storefront/`, `http://localhost:5173`), a 390×844 (móvil táctil) y a 1440. Se revisaron: Home de Valentina, Diego y Sofía, Menú, Promos, constructor Super Dúo, oferta vencida (Box Halloween), ficha Pollo BBQ, panel de tienda y Locales. No se revisaron la hoja «Arma tu pizza» ni el armador de mitades, que siguen en otra rama.
- **Contexto:** QSR/delivery de pizza; perfiles Sofía, Diego y Valentina; objetivo de la demo: **que dé hambre** (principio 9) y que Papa Johns vea un partner que entiende su marca.
- **Capas aplicadas:** heurísticas base · vertical `qsr-delivery` · plataforma Storefront Next · marca oficial S-D18 (playbook BGYS: color pp. 48–88, fotografía pp. 89–97, layouts de plataforma pp. 117–128; tono en la estrategia BGYS).
- **Modo:** completa, centrada en dirección visual. Los errores funcionales van aparte, en la sección 5.
- **Método:** contraste medido con `audit-dom.js` y `contrast.py`; escala tipográfica medida en el DOM.
- **Límites:** es una revisión experta y no hubo usuarios reales. No se midió el LCP. Rappi y Uber Eats se citan como patrones conocidos: no hay capturas suyas en el proyecto. La fuente Pappy no está en el repositorio.

---

## Veredicto

La demo **funciona, pero se ve como una plantilla vestida de verde**. Usa bien la paleta oficial (cero fallas de contraste en la Home), aunque solo **3 de sus 7 colores**: verde Fresh Basil, lima y crema, en bloques planos que pesan lo mismo. La pizza aparece **chica, lejos y siempre igual**: el mismo plano de 3/4 sobre el mismo fondo turquesa, ocupando el 40 % del cuadro, en todas las tarjetas. Los titulares van en negro, sin el sistema gráfico de la marca (sellos LTO, granate, lila, la palabra de acento). Y la pantalla de decisión, la ficha, sigue siendo la del template base, porque `hu/PRO` no está integrada a `demo`.

Lo que más gana el cliente, en este orden:
1. Recortar la foto en macro y llevarla a sangre.
2. Integrar la ficha de PRO.
3. Dar ritmo de color con granate y lila.
4. Usar el sello LTO y el precio de la marca.

Los cuatro son cambios de `pj-shared` y del tema, y se notan en todas las pantallas a la vez.

---

## 1. Diagnóstico: por qué se siente «dura»

### C1. La pizza está lejos: es foto de catálogo, no de antojo · Crítica

- **Evidencia:** `UX-01`, `UX-03`, `UX-11`, `UX-17`.
  - En el hero de Valentina (390), la pizza ocupa cerca del 65 % del ancho y el 40 % del alto del cuadro. El resto es fondo turquesa liso.
  - En las tarjetas de «Las más pedidas» (1440) se repite la misma foto a 3/4, pequeña y centrada.
  - La ficha mete esa misma foto 4:3 dentro de un contenedor cuadrado, con franjas crema arriba y abajo (*letterbox*).
- **Contra la marca:** el playbook (pp. 90–93) pide «edge to edge macro… in-your-face» y un primer plano «crave-inducing». La demo muestra el producto entero y distante, que es justo el estilo que el playbook reemplaza.
- **Contra el benchmark:** Domino's y Melt llenan el ancho con la pizza (`capturas/raw/dpzus-movil-portada.jpeg` y `melt-portada.jpeg`): se ve el queso, el borde y la grasa del pepperoni.
- **Agravante:** el CDN tiene fotos mejores que no se usan donde más venden. `napolitana-familiar-1788736846.jpg` (una mano levanta una porción con el queso estirándose) y `napocherry-1730987248.jpg` (primer plano con pepperoncini) solo aparecen en la grilla del menú (`UX-08`).

### C2. Tres colores en bloques planos: verde sobre verde y lima chillón · Alta

- **Evidencia:** `UX-02`, `UX-03`, `UX-04`.
  - Recorrido de la Home de Valentina en móvil, de arriba abajo: encabezado verde → franja lima a todo el ancho → foto turquesa → bloque blanco → tarjetas verdes (Delivery y Retiro) → fotos turquesa → bloque «Pedir aquí tiene premio» en verde oscuro → footer en verde oscuro.
  - En escritorio, el hero divide la pantalla en verde oscuro sólido + turquesa: dos verdes pegados y sin contraste de temperatura.
- **Lo que falta:** Rich Sauce (granate) solo aparece en el precio y en la pastilla «-50%». Punchy Garlic (lila) no aparece en ninguna pantalla. Tangy Tomato, el rojo icónico, tampoco aparece, ni siquiera como forma decorativa (sí se permite sin texto). El playbook (p. 58) pide combinar **un tono de marca, uno complementario y uno de acento**; la demo usa marca + acento y nunca el complementario.
- **El lima:** la franja de saludo (`UX-01`) es lima a todo el ancho con texto negro. El playbook trata el lima como acento que «no debe verse solo» (p. 63), y aquí es la segunda superficie más grande de la pantalla.

### C3. Todo pesa lo mismo: sin jerarquía ni ritmo · Alta

- **Evidencia:** `UX-10` (Promos 390), `UX-02`, `UX-09`.
  - En móvil, Promos son 6 tarjetas idénticas: mismo alto, mismo fondo de foto, misma pastilla roja, mismo botón verde. No hay una oferta protagonista. En escritorio sí la hay (`UX-22`).
  - La Home de Valentina muestra solo 3 productos y termina enseguida: no tiene categorías, momento del día ni prueba social fuera de las tarjetas.
  - Los botones Delivery y Retiro son dos bloques verdes sin ícono, del mismo peso que el CTA del hero.
  - En el menú de escritorio queda una tarjeta huérfana en la última fila de «Clásicas».

### C4. La tipografía es chica, negra y con demasiados tamaños · Alta

- **Evidencia:** medición en el DOM de la Home a 390.
  - Hay **11 tamaños distintos**: 11, 13, 14, 15, 16, 17, 20, 22, 26, 30 y 34 px.
  - El H1 del hero mide 34 px y va en `#1B1D1A` (tinta negra) sobre blanco. La relación entre el titular y el cuerpo es 2,4:1; en Domino's y Melt pasa de 4:1.
  - Los títulos de grupo del menú («Clásicas», «Favoritas») van en Papa Sans Bold, en tipo oración, mientras los de sección usan Papa Sans Condensed en mayúsculas (`UX-09`). Son dos sistemas mezclados.
- **Contra la marca:** el playbook pone el titular en color de marca (Fresh Basil o Rich Sauce sobre crema, p. 61) e indica que «el logo va del mismo color que el titular». El negro no forma parte del sistema BGYS.

### C5. Faltan los elementos de la marca · Alta

- **Evidencia:** `UX-01`, `UX-10`, `UX-22`.
  - Las ofertas se marcan con una pastilla roja rectangular (`-50%`, `-19%`). El playbook define un **sello LTO circular** en Papa Sans Condensed, con el texto al 40 % del diámetro y colocado en la esquina superior izquierda de la primera letra del titular (pp. 119–121).
  - El precio es texto plano. En la marca, el precio es un lockup «precio + producto» con el signo $ en superíndice (p. 118).
  - No aparece la palabra de acento rotada 3° (Pappy), ni el lockup «Mejores ingredientes. Mejor pizza.» fuera del logo, ni el lila, ni el granate como superficie.

### C6. Colores fuera de la paleta, escritos a mano · Media

- **Evidencia:** `UX-16`, `UX-22`, `UX-14`.
  - Las pastillas «Pizza del mes» y «Para compartir» y los filtros «Para 1/2/4» van en `#7A3A12` sobre `#FBE9D7` (café sobre durazno).
  - «Cerrada · abre mañana» va en `#8A3B12` y «Abierta» en `#1E6B3A`.
  - Ninguno de estos colores está en la paleta S-D18. Se ven «cálidos», pero no son Papa Johns.
  - Dónde están: `pj-menu/components/build-cards.tsx:109`, `pizzas-section.tsx:113`, `pj-offers/components/expired-offer.tsx:102`, `offer-card.tsx:138`, `occasion-filter.tsx:72` y `pj-store/components/pickup-section.tsx:270`.

### C7. No hay movimiento donde importa · Media

- **Lo que hay:** solo el Ken Burns del hero, con su botón de pausa.
- **Lo que falta:**
  - Al agregar al carrito, el contador no reacciona y el aviso aparece cortado por la derecha a 390 px (`UX-15`).
  - Al completar el Super Dúo («2 de 2») no hay ningún gesto de celebración.
  - Las fotos no reaccionan al pasar el cursor en escritorio.
  - No hay *skeletons*: Locales muestra «Lo sentimos, no hay tiendas en esta zona» mientras carga (`UX-19`).
- **Contra la propuesta:** la sección 2.1 lo pide expresamente: «microinteracciones; movimiento en los momentos clave».

### C8. Tono correcto pero plano: no suena a «Better Get You Some» · Media

- **Evidencia:** son textos funcionales y neutros: «Esta oferta terminó el 2 de noviembre», «Elige 1 pizza más», «Tú eliges tus cookies», «Selecciona todas tus opciones arriba».
- **Contra la marca:** la estrategia BGYS pide una voz Confident, Approachable, Lighthearted y **Unexpected** («raro por la pizza, no por ser raro»). Hoy no hay ningún guiño. La sección 3.6 tiene reescrituras.

---

## 2. Benchmark: qué copiar como patrón (no como diseño)

| Referente | Qué hace mejor | Patrón para la demo |
|---|---|---|
| **Domino's EE.UU.** (`dpzus-movil-portada.jpeg`) | Foto a sangre con queso estirándose; la oferta va en una **tarjeta crema flotando sobre la foto**; el precio va **dentro del titular** y en color («FOR **$6.99** EACH»); sello «TRY THE NEW» encima de la tarjeta; la tienda y la espera fijas en el encabezado | Hero «foto a sangre + tarjeta flotante» en móvil; precio integrado al titular; sello sobre la esquina |
| **Melt** (`melt-portada.jpeg`) | Pizza vista desde arriba **llenando todo el ancho**; precio enorme (≈ 4× el cuerpo) junto a una pastilla «-40%»; titular en condensada gigante; contraste alto entre fondo oscuro y crema | Escala tipográfica agresiva y precio protagonista; foto que ocupa el ancho completo |
| **Papa Johns EE.UU. / playbook BGYS** (pp. 90–97, 118–128) | Macro de borde a borde, manos y queso estirado; fondos verdes **o granate**; sello LTO circular; layout «full» (gráfica 80 % sobre macro) y «split» (50/50 sobre producto) | Hero con layout *full* en escritorio y *split* en tarjetas de oferta; sello LTO; granate como fondo alternativo |
| **Uber Eats / Rappi** (patrón conocido, sin captura) | Tarjetas densas: foto 16:9 a sangre arriba, y abajo título, ★, tiempo y precio en dos líneas; carruseles por intención («Para compartir», «Menos de $10 mil»); *skeletons* mientras carga; botón «+» en la foto; contador del carro que salta | Densidad de información en la tarjeta; carruseles por intención en la Home de Valentina; *skeleton* en lugar de mensajes vacíos; «+» sobre la foto |
| **McDonald's (app)** | Producto recortado sobre **campos de color sólido distintos por categoría**; textos cortos con humor | Cada sección con su superficie de color (crema, granate, verde, lila), no todas verdes |

**Qué no copiar:** carruseles automáticos de 5 *slides* (Domino's y Melt), el botón flotante de WhatsApp sobre la barra (Melt) y los avisos legales largos en el hero.

---

## 3. Dirección visual propuesta (dentro de S-D18)

### 3.1 Color: un sistema de superficies, no de bloques

**Regla de base:** cada pantalla combina **un tono de marca + un complementario + un acento** (playbook p. 58). El verde deja de ser el fondo de todo y pasa a ser el ancla: el encabezado, el CTA principal y el fondo de las fotos.

| Superficie o componente | Fondo | Texto | Acento | Par ADA (p. 64) |
|---|---|---|---|---|
| Página (base) | Fluffy Dough `bg-pj-dough` | Titulares Fresh Basil `text-pj-basil`; cuerpo tinta `text-pj-ink` | — | Basil/Dough ✔ |
| Encabezado | Fresh Basil | Dough | CTA «Mi pedido» lima + texto Basil | ✔ (se mantiene) |
| Franja de saludo o beneficio (Valentina) | **Punchy Garlic** `bg-pj-garlic` | **Rich Sauce** `text-pj-sauce` | Ícono Basil | Sauce/Garlic ✔ |
| Hero (texto sobre foto) | Foto + degradado `from-pj-basil-deep/90` | Dough | Precio **lima**, sello LTO lima/Basil | Dough y lima sobre Basil ✔ |
| Bloque de lealtad («Pedir aquí tiene premio», puntos de Sofía) | **Rich Sauce** `bg-pj-sauce` | Dough | Títulos y checks en **lima** o lila | Dough, lima y lila sobre Sauce ✔ |
| Bloque de ofertas o momentos | Fresh Basil | Dough | Lila para la palabra de acento | ✔ |
| Tarjeta de producto | Blanco o Dough | Título Basil; precio **Rich Sauce** | Sello LTO | ✔ |
| Precio de oferta y ahorro | — | **Rich Sauce** (sobre crema) o **lima** (sobre Basil o Sauce) | — | ✔ (nunca Tangy Tomato) |
| Chips o filtros (reposo) | `bg-pj-dough-deep` | Basil | — | ✔ (reemplaza `#7A3A12/#FBE9D7`) |
| Chips o filtros (activo) | Basil | Dough | — | ✔ |
| Etiquetas suaves («Para compartir», «Con postre») | **Garlic** | Basil o Sauce | — | ✔ (reemplaza el durazno) |
| Estado «Cerrada» | — | Rich Sauce | Punto Tangy Tomato (decorativo) | ✔ (reemplaza `#8A3B12`) |
| Estado «Abierta» | — | Fresh Basil | Punto Ripened Vine (decorativo) | ✔ (reemplaza `#1E6B3A`) |
| Footer | Fresh Basil | Dough | Lockup BIBP en lima | ✔ |

**Dónde va Tangy Tomato** (solo formas, sin texto): el subrayado de la pestaña activa, el punto del ícono activo en la barra inferior, la barra de progreso de Papa Puntos, el sello dentado decorativo detrás de la foto en la tarjeta destacada y el punto de «Cerrada». Es el rojo que el cliente reconoce, y hoy no aparece en ninguna pantalla.

**Calidez y profundidad, sin colores nuevos:**
- Degradado en el hero: `bg-gradient-to-t from-pj-basil-deep via-pj-basil-deep/60 to-transparent` sobre la foto. Usa colores de la paleta y su derivado ya documentado.
- Sombra cálida en las tarjetas: `--pj-shadow-card: 0 6px 20px rgb(113 5 0 / 0.10)` (Rich Sauce al 10 %) en lugar del gris actual.
- **Grano** sobre la crema: SVG de ruido al 4 % en `body`. Le quita al fondo el aspecto de «pantalla vacía» y cuesta menos de 1 KB.
- **Alternar superficies** a lo largo del scroll de la Home: crema → granate (lealtad) → crema → verde (momentos) → crema → footer verde. Nunca dos superficies verdes seguidas.

### 3.2 Fotografía: tratar lo que tenemos

**1. Recorte macro de las fotos actuales.** Todas son JPG de 1440×1080 en el CDN, así que admiten zoom.

| Uso | Recorte | Cómo |
|---|---|---|
| Hero móvil | La pizza llena el ancho y se corta el borde inferior | `scale-[1.55] object-[50%_62%]`, `sw=1440` |
| Hero de escritorio (layout *full*) | Pizza a sangre en el 100 % del ancho; el texto queda encima, en el tercio izquierdo | `scale-[1.35]`, foto `absolute inset-0`, degradado `bg-gradient-to-r from-pj-basil-deep via-pj-basil-deep/70 to-transparent` |
| Tarjetas | La pizza ocupa el 90 % del ancho; el borde se sale por abajo | `scale-[1.45] object-[50%_60%]`, aspecto 4:3 |
| Ficha | Sin *letterbox*: foto a sangre 1:1 en móvil, con zoom (lupa) a macro | `aspect-square`, quitar el contenedor crema |
| Combos (pizza + bebida + postre en fila) | No forzarlos a un cuadrado: en la tarjeta «momento» de Diego se ve **la Coca-Cola al centro** y las pizzas cortadas (`UX-05`) | Aspecto 16:9 u `object-[15%_60%]` para centrar la pizza |

Este recorte es **una sola prop** en `FoodImage` (`crop="macro" | "product" | "combo"`), y con ella cambian todas las pantallas.

**2. Fotos del CDN que conviene subir de rango:**
- `images/napolitana-familiar-1788736846.jpg`: mano y queso estirándose; es la mejor foto de antojo que tenemos. Va como foto de la tarjeta destacada del bloque de momentos o como segundo *slide* del hero.
- `images/napocherry-1730987248.jpg`: primer plano con pepperoncini y salsa de ajo. Es literalmente el moodboard del playbook (p. 97).
- `images/boom-de-jamon-familiar-1788737951.jpg`: recorte cercano.
- Las de `pan-pizza-*` (`pan-pizza-pepperoni-1780504370.jpg` y otras): revisarlas para «Más vendidas».

**3. Fotos que faltan.** Supuesto explícito: no se le piden al cliente; se usan las del CDN y se declara el faltante.
- Macro del queso estirándose en las 3 pizzas más pedidas: Pollo BBQ, Super Pepperoni y Todas las Carnes.
- Ingredientes en macro para el armador (otra rama).
- Una porción en la mano sobre fondo granate, para el bloque de lealtad.
- Mientras tanto: el recorte macro más el degradado cubren el 80 % del efecto.

**4. Consistencia de fondos.** El playbook dice que «el verde es nuestro espacio en blanco» (p. 94), así que el fondo turquesa de estudio **está bien** y se mantiene. Hay que sacar de las posiciones destacadas las fotos que no calzan: Hawaiana sobre podio verde oscuro y Napolitana Cherry sobre piedra gris quedan en la grilla, no en el hero ni en «Más pedidas».

### 3.3 Tipografía

Esta escala reemplaza los 11 tamaños actuales:

| Rol | Móvil | Escritorio | Fuente | Clase sugerida |
|---|---|---|---|---|
| Display (hero) | 48/0.85 | 96/0.82 | Papa Sans Condensed, mayúsculas | `font-heading text-[48px] leading-[0.85] lg:text-[96px] uppercase` |
| Precio display | 44 | 72 | Papa Sans Condensed, `$` en superíndice | `text-[44px] lg:text-[72px]` + `<sup class="text-[0.5em] align-top">$</sup>` |
| H2 de sección | 32/0.9 | 48 | Condensed, mayúsculas, **Basil** | `text-[32px] lg:text-5xl text-pj-basil` |
| Título de tarjeta | 20/1 | 24 | Condensed, mayúsculas | `font-heading text-xl uppercase` |
| Cuerpo | 16/1.45 | 16 | Papa Sans Regular | `text-base` |
| Meta (★, tiempo) | 13 | 14 | Papa Sans Bold | `text-[13px] font-bold` |
| Etiqueta mínima | 12 | 12 | Papa Sans Bold, mayúsculas, tracking +0.04em | `text-xs tracking-wide` |

**Reglas:**
- Interlineado del display al 75–85 % del cuerpo, como pide el playbook (p. 34).
- Los titulares van en Basil sobre crema y en Dough sobre verde o granate. **Nunca en negro.**
- Todos los títulos de grupo («Clásicas», «Favoritas») pasan a Condensed en mayúsculas.

**Pappy:** no está en `public/fonts/`. **Supuesto:** no se imita con otra manuscrita, porque eso rompe la marca. Se usa un **sello de acento**: una palabra en Papa Sans Condensed, dentro de una pastilla rotada −3° (la rotación de Pappy, p. 44), con relleno lima y contorno Rich Sauce de 2 px (`paint-order: stroke`), según la combinación aprobada en la p. 51.

Ejemplos de uso:
- «PIZZA DEL MES **THE WORKS**», con «THE WORKS» en el sello.
- «¿**HAY ALGO** QUE CELEBRAR?»

Va en un solo componente `AccentWord` de `pj-shared`. Si llega Pappy, se cambia ahí.

### 3.4 Componentes

**Hero (Home y Promos)**
- **Móvil:** foto macro a sangre de **≥ 58 % del alto de la pantalla**. Sobre la parte baja de la foto flota una tarjeta crema (patrón Domino's) con:
  - el sello LTO circular en la esquina superior izquierda del titular;
  - el titular en Basil, en 48 px;
  - la descripción en una línea;
  - el precio display en Rich Sauce, con el precio tachado al lado;
  - el CTA «Lo quiero · $10.990» a todo el ancho.
- **Escritorio:** layout *full* del playbook. La foto ocupa el 100 % y el texto en Dough va sobre el degradado verde de la izquierda. Se elimina el panel verde sólido.

**Tarjeta de producto**
- Foto 4:3 en recorte macro, con radio solo arriba.
- Sello «LA MÁS PEDIDA» en Garlic + Basil sobre la foto, arriba a la izquierda.
- Botón «+» circular lima de 44 px sobre la esquina inferior derecha de la foto (patrón Uber Eats y Domino's), además de «Agregar».
- Título en Condensed de 20 px, la ★ con la cantidad en una línea, la descripción a 2 líneas y el precio en Rich Sauce Bold de 20 px.
- Sombra cálida. En escritorio, la foto hace `group-hover:scale-105 transition-transform duration-500`.

**Sello LTO (nuevo, `pj-shared/components/lto-badge.tsx`)**
- Círculo perfecto, sin rotar.
- Papa Sans Condensed centrada, con el texto al 40 % del diámetro y el interlineado al 75 %.
- Variantes ADA:
  - `lime` (lima/Basil, para «NUEVO» y «-50%»);
  - `sauce` (Sauce/Dough, para «DEL MES»);
  - `garlic` (Garlic/Sauce, para «SOLO HOY»);
  - `dough` (Dough/Basil).
- Tamaños: 56 px en tarjetas y 88 px en el hero.

**Precio (`price-tag.tsx`):** nueva variante `display`, con el `$` en superíndice y el precio anterior tachado en `text-pj-gray`. Aparte, una línea «Ahorras $X» en Rich Sauce.

**Botones**
- Los primarios se mantienen: Basil + Dough sobre crema, y lima + Basil sobre verde o granate.
- Al presionar: `active:scale-[0.97] transition-transform`.
- El precio va dentro del CTA en todo el sitio («Agregar · $16.900»), alineado a la derecha con `justify-between`.
- El «Confirmar» del panel queda con el texto a la izquierda porque usa `justify-between` y no tiene nada a la derecha (`UX-14`). Hay que centrarlo o ponerle el resumen («El Bosque · 15 min») a la derecha.

**Barras**
- La franja de saludo pasa a Garlic + Sauce, con un ícono y 44 px de alto (hoy son 2 líneas de lima).
- Barra inferior: el ítem activo va en Basil, con una píldora `bg-pj-garlic/60` detrás del ícono y el punto Tangy Tomato. La etiqueta sube de 11 a 12 px.

**Chips:** usar un solo patrón de «seleccionado» (Basil + Dough). Hoy el panel mezcla tres: el segmentado Retiro (blanco con borde), «Lo antes posible» (lima) y la tienda elegida (borde verde) (`UX-23`).

**Aviso de cookies**
- Es una barra compacta de 72 px sobre la barra inferior. Fondo Basil-deep, texto Dough, botón «Aceptar» en lima y «Opciones» como enlace.
- Hoy es una tarjeta blanca de 270 px que tapa el CTA del hero en la primera pantalla de la demo (`UX-01`).
- Texto: ver la sección 3.6.

**Footer**
- Reducir la altura en móvil en un 40 %: los enlaces en 2 columnas y los íconos en la misma línea que el ©.
- Agregar arriba el lockup **«MEJORES INGREDIENTES. MEJOR PIZZA.»** en Condensed lima sobre Basil (BIBP, p. 118). Es la firma de la marca y hoy solo está dentro del logo.

### 3.5 Movimiento y micro-interacciones

Todo usa solo `transform` y `opacity`, se apaga con `prefers-reduced-motion` y reusa `use-reduced-motion.ts`.

| Momento | Movimiento | Duración |
|---|---|---|
| Agregar al carrito | Una miniatura de la foto «vuela» hasta el ícono del carrito, el contador **salta** (escala 1 → 1,25 → 1) y el aviso entra desde arriba con «+22 Papa Puntos» contando hacia arriba | 450 + 250 ms |
| Completar el Super Dúo (2 de 2) | La miniatura de la ranura hace *pop* (escala 0,8 → 1), aparece el check y el CTA late una vez | 300 ms |
| Pasar el cursor por una tarjeta (escritorio) | La foto hace zoom a 1,05 | 500 ms, *ease-out* |
| Hero | El Ken Burns actual se mantiene, solo en el hero, y no en las tarjetas | — |
| Carga (Locales, carruseles) | *Skeleton* en `bg-pj-dough-deep` con brillo | — |
| Sello LTO | Entra con escala 0,6 → 1 y rotación de −8° a 0° una sola vez al cargar. El playbook prohíbe rotarlo en reposo, no animar su entrada | 350 ms |
| Puntos de Sofía | La barra de progreso se llena de 0 al valor al entrar en pantalla, en Tangy Tomato | 600 ms |
| *Easter egg* «Unexpected» | Al agregar la tercera pizza: el aviso dice «Esto ya es una fiesta» | — |

### 3.6 Tono: textos reescritos

| Dónde | Hoy | Propuesto |
|---|---|---|
| Franja de Valentina | «Hola de nuevo. Tu pedido de vuelta suma Papa Puntos dobles.» | «**¡Volviste!** Este pedido suma Papa Puntos al doble.» |
| Hero de Valentina | «Todo lo bueno: pepperoni, salchicha, jamón y verduras frescas. Para 3–4.» | «Pepperoni que se dora, salchicha, jamón y verduras en cada porción. Alcanza para 3 o 4.» |
| CTA del hero | «Lo quiero» | «Lo quiero · $10.990» |
| Bloque de lealtad | «PEDIR AQUÍ TIENE PREMIO» + 3 *bullets* | «**PEDIR DIRECTO TIENE PREMIO**» · «Papa Puntos desde tu primer pedido» · «Ves tu pizza salir del horno» · «Mercado Pago o efectivo, como prefieras» |
| Oferta vencida | «ESTA OFERTA TERMINÓ EL 2 DE NOVIEMBRE» | «**LLEGASTE TARDE A HALLOWEEN**» · «El Box Halloween se fue el 2 de noviembre. Pero el horno sigue prendido:» |
| Constructor (incompleto) | «Elige 1 pizza más» | «Te falta 1 pizza» |
| Constructor (sin tienda) | «Elige tu tienda para agregar» | «Elige dónde la retiras o te la llevamos» |
| Puntos de Sofía | «Ya puedes canjear una Super Pepperoni mediana» | «Tus puntos ya alcanzan para una **Super Pepperoni mediana**. ¿La sumamos?» |
| Pedido vacío (menú) | «Todavía no agregas nada. Empieza con una pizza o arma una mitad y mitad.» | «Tu pedido está vacío… por ahora.» |
| Cookies | «TÚ ELIGES TUS COOKIES» | «**ESTAS COOKIES NO SE COMEN.** Las usamos para recordar tu tienda y tu pedido.» (el pilar *Unexpected*) |
| Etiqueta de tarjeta | «Más pedida» | «LA MÁS PEDIDA» (sello) |
| Locales sin resultados | «Lo sentimos, no hay tiendas en esta zona.» | «Todavía no llegamos ahí. Prueba otra comuna o retira en la tienda más cercana.» |

**Regla del tono:** *Lighthearted* en las vitrinas (Home, Promos, avisos, estados vacíos); *Approachable* y sin chistes en la tienda, el pago y los errores.

---

## 4. Lista de cambios priorizada

**[TEMA]** = `src/theme/tokens/pj.css`, `base.css`, `animations.css`. **[SHARED]** = `src/extensions/pj-shared`. Son los que más rinden, porque cambian todas las pantallas.

### P1 · Antes de la demo

| # | Pantalla o componente | Qué cambiar | Cómo | Archivo probable | Impacto |
|---|---|---|---|---|---|
| 1 | **Ficha** (toda la demo) | Integrar la ficha de PRO a `demo`. Hoy se ve la PDP del template: «PAPA JOHNS» como marca, rango «$5.900 – $21.900», sin tamaño preseleccionado, «código postal», botón deshabilitado con error rojo antes de tocar nada (`UX-17`, `UX-18`, `UX-21`). La ficha de PRO ya está aprobada (`VAL-PRO-03-ficha-top-390.png`) | Merge de `hu/PRO` (PRO-03 y PRO-05) y migración a los tokens S-D18 | `pj-product/*` | Credibilidad: el CTA del hero y todas las tarjetas llevan aquí |
| 2 | **FoodImage** [SHARED] | Recorte macro con la prop `crop` | `crop="macro"` → `scale-[1.45] object-[50%_60%]`; `hero` → `scale-[1.55]`, `sw=1440`; `combo` → `object-[15%_60%]` o 16:9; quitar el *letterbox* | `pj-shared/components/food-image.tsx` | **Antojo** en las 10 pantallas |
| 3 | **Hero de la Home** (3 perfiles) | Móvil: foto a sangre de ≥ 58 % del alto con tarjeta crema flotante. Escritorio: layout *full* sobre la foto, sin el panel verde sólido | `relative`, foto `absolute inset-0`, degradado `from-pj-basil-deep`, tarjeta `-mt-16 mx-4 rounded-pj-section bg-pj-dough shadow-pj-float` | `pj-home/components/home-hero.tsx` | Antojo y primera impresión |
| 4 | **Sello LTO** [SHARED] | Componente nuevo que reemplaza las pastillas «-50%» y «-19%» | Círculo `rounded-full aspect-square grid place-items-center font-heading`, 4 variantes ADA, en la esquina superior izquierda del titular | `pj-shared/components/lto-badge.tsx` (nuevo); uso en `home-hero.tsx`, `offer-card.tsx` y `pizza-card.tsx` | Marca reconocible; oferta legible de un vistazo |
| 5 | **Precio display** [SHARED] | Variante `display` con `$` en superíndice, Condensed, Rich Sauce sobre crema y lima sobre verde o granate | Prop `variant="display"` | `pj-shared/components/price-tag.tsx` | Conversión: el precio se lee como oferta |
| 6 | **Ritmo de color** [TEMA] | Lealtad en Rich Sauce; franja de saludo en Garlic + Sauce; etiquetas suaves en Garlic; Tangy Tomato en decorativos | `bg-pj-sauce text-pj-dough`, `bg-pj-garlic text-pj-sauce`; nunca dos bloques verdes seguidos | `home-blocks.tsx`, `home-default.tsx`, `home-sofia.tsx` | Deja de verse «todo verde»; el sitio se ve premium |
| 7 | **Escala tipográfica** [TEMA] | 7 tamaños; titulares en Basil, no en negro; títulos de grupo en Condensed | Utilidades `.pj-display`, `.pj-h2`, `.pj-card-title` en `base.css`; `text-pj-basil` en `h1` y `h2` | `src/theme/base.css` + secciones | Jerarquía clara; foco en producto y precio |
| 8 | **Colores fuera de paleta** [TEMA] | Reemplazar `#7A3A12`, `#FBE9D7`, `#F7DDC3`, `#8A3B12` y `#1E6B3A` | Chips en `bg-pj-dough-deep text-pj-basil`; etiquetas en `bg-pj-garlic text-pj-basil`; estados en `text-pj-sauce` y `text-pj-basil` | `build-cards.tsx:109`, `pizzas-section.tsx:113`, `expired-offer.tsx:102`, `offer-card.tsx:138`, `occasion-filter.tsx:72`, `pickup-section.tsx:270` | Cumple S-D18; el cliente reconoce su marca |
| 9 | **Aviso al agregar y micro-interacciones** [SHARED] | El aviso se corta por la derecha a 390 px (`UX-15`); el contador del carrito no reacciona | Contener el aviso en `inset-x-4 max-w-[calc(100vw-2rem)]`; *bump* en el contador; vuelo de la miniatura | `pj-shared/components/added-toast.tsx`, `lib/added-toast.tsx`, `animations.css` | Feedback y sensación de app; se ve en vivo en cada agregado |
| 10 | **Cookies y footer** [TEMA] | Barra compacta con el texto «Estas cookies no se comen»; footer más bajo con el lockup BIBP | Barra fija de 72 px sobre `--pj-bottom-nav-height`; footer con `py-8`, 2 columnas | `src/components/tracking-consent-banner/index.tsx`, `src/components/footer/main-footer.tsx` | El hero queda libre en la primera pantalla; firma de marca |

### P2 · Suben el nivel

| # | Pantalla | Qué cambiar | Archivo probable | Impacto |
|---|---|---|---|---|
| 11 | Tarjeta de producto | Botón «+» lima sobre la foto, sello «LA MÁS PEDIDA», sombra cálida, zoom al pasar el cursor | `pj-menu/components/pizza-card.tsx`, `pj-home/components/home-blocks.tsx` | Venta en un toque |
| 12 | Promos móvil | La primera oferta va como destacada (layout *split*, foto grande y sello); el resto en tarjetas | `pj-offers/components/offers-page.tsx`, `offer-card.tsx` | Jerarquía; Diego ve «la» oferta |
| 13 | Home de Valentina | Agregar un carrusel por intención («Para compartir», «Menos de $15 mil») y el bloque de momentos (ya existe en Diego) | `home-default.tsx` | La Home se siente viva, no corta |
| 14 | Locales | Darle el estilo del panel (tarjetas, «Abierta · cierra 23:30», tiempo); *skeleton* al cargar; respetar `?modo=delivery`; quitar la coma final («Las Condes,») | `pj-store/components/locales-page.tsx` | Credibilidad |
| 15 | Panel de tienda | Un solo patrón de «seleccionado»; «Confirmar» centrado o con resumen | `pj-store/components/fulfillment-panel.tsx`, `when-section.tsx` | Consistencia |
| 16 | Constructor | *Pop* en la ranura, latido del CTA en «2 de 2»; tras agregar, el CTA pasa a «Ver mi pedido» | `pj-offers/components/combo-builder.tsx` | Celebración; evita el doble agregado |
| 17 | Fotos destacadas | Usar `napolitana-familiar` (queso estirándose) y `napocherry` en el bloque de momentos y en el segundo *slide* | Datos y Page Designer (DAT/HOM) | Antojo |
| 18 | Textos | Aplicar la tabla de la sección 3.6 | `locales/es-CL/*.json` de cada extensión | Voz de marca |
| 19 | Barra inferior | Píldora activa con punto Tomato; etiqueta de 12 px | `pj-shared/components/bottom-nav.tsx` | Pulido |

### P3 · Si sobra tiempo

| # | Qué | Dónde |
|---|---|---|
| 20 | Grano SVG al 4 % sobre la crema | `src/theme/base.css` |
| 21 | Componente `AccentWord` (sello rotado −3°, listo para Pappy) | `pj-shared/components/accent-word.tsx` |
| 22 | Video corto del queso estirándose en el hero (loop de 4 s, `preload="none"`, imagen de póster) | `home-hero.tsx` (si aparece material) |
| 23 | *Easter egg* al agregar la tercera pizza | `added-toast.tsx` |

---

## 5. Errores de UX funcionales

| # | Qué pasa | Dónde | Severidad | Corrección |
|---|---|---|---|---|
| F1 | **«Lo quiero» del hero lleva a la PDP del template**, que pierde el «-50%» y el «Antes desde $21.900». La promesa del hero no se cumple | Home Valentina → `/p/cb-pizza-del-mes` (`UX-24`) | Crítica · Demo | Integrar PRO o enlazar a `/promos/pizza-del-mes` |
| F2 | La ficha del template pide «código postal», no preselecciona el tamaño y muestra el error «Selecciona todas tus opciones arriba» antes de cualquier interacción | `/p/pz-pollo-bbq` (`UX-18`) | Crítica · Demo | Igual que P1-1 |
| F3 | El aviso «¡Agregado!» se corta por la derecha a 390 px y tapa el encabezado | Super Dúo (`UX-15`); VAL-PRO ya lo había visto | Alta · Demo | P1-9 |
| F4 | Después de agregar el Super Dúo, el CTA sigue activo («Agregar Super Dúo · $22.590»): un segundo toque lo agrega dos veces | `/promos/super-duo` (`UX-15`) | Alta · Demo | Cambiar el CTA a «Ver mi pedido» o reiniciar las ranuras |
| F5 | Locales muestra «Lo sentimos, no hay tiendas en esta zona» mientras carga, y luego aparecen las tiendas | `/store-locator` (`UX-19` → `UX-20`) | Alta · Demo | *Skeleton*; mostrar el mensaje vacío solo con una respuesta vacía |
| F6 | En la tarjeta «momento» de Diego, el recorte de la foto deja **la Coca-Cola al centro** y las pizzas cortadas | Home Diego (`UX-05`) | Media · Demo | P1-2 (`crop="combo"`) |
| F7 | «Para tu viernes» en la Home de Sofía depende del día: hoy (06-nov) es viernes, pero si la demo es otro día el texto falla | Home Sofía (`UX-06`) | Media · Demo | Texto por `getDemoMoment` o «Para este fin de semana» |
| F8 | El botón «½» de la tarjeta del menú no se entiende en móvil (en escritorio dice «½ Mitad») | Menú 390 (`UX-08`) | Media | Mostrar «½ Mitad» también en móvil o usar un ícono de mitades con su etiqueta |
| F9 | Hay tres patrones distintos de «seleccionado» en el mismo panel | Panel de tienda (`UX-23`) | Baja | P2-15 |
| F10 | Falta el espacio antes del punto medio: «Agregar Super Dúo· $22.590» | Constructor | Baja | Corregir la cadena |
| F11 | El texto de la tarjeta «Para 3» de Diego se parte y deja un «3» huérfano en la última línea | Home Diego, «¿Para cuántos?» | Baja | `line-clamp-2` y altura mínima de tarjeta |
| F12 | Locales ignora `?modo=delivery`, que es el destino de la tarjeta «Delivery» de la Home | `/store-locator?modo=delivery` | Media | Abrir el panel en modo delivery o filtrar |

---

## Lo que funciona bien (proteger)

- **Contraste:** 0 fallas en la Home a 390 (`audit-dom.js`), y las áreas táctiles son de ≥ 44 px. La paleta S-D18 está bien aplicada en lo que se usa.
- **El fondo verde de estudio** en las fotos es coherente con el playbook («el verde es nuestro espacio en blanco»). Hay que acercar la cámara, no cambiar el fondo.
- **El panel de tienda** (`UX-14`): estado abierta o cerrada, tiempo, «Solo programado» y «Lo antes posible / Programar». Es mejor que Domino's y PJ EE.UU.; Locales debería heredarlo.
- **El constructor Super Dúo:** ranuras «Pizza 1 de 2 / 2 de 2» con miniatura, contador en vivo y la tienda pedida al agregar, con el agregado automático después de elegirla.
- **La oferta vencida** ofrece 3 alternativas con precio: es el patrón correcto, solo le falta tono.
- **El Ken Burns con pausa y respeto por «reducir movimiento».**

## Accesibilidad medida

| Patrón | Medida | Pantallas | Corrección |
|---|---|---|---|
| Contraste de texto | 0 fallas | Home 390 | — |
| Texto de 11 px | 13 elementos (pastillas, barra inferior, «Retiro · 15 min») | Home 390 | Mínimo 12 px (escala de la sección 3.3) |
| Pares propuestos | Sauce/Dough 10,1:1 · Garlic/Sauce 7,7:1 · Basil/Garlic 4,9:1 · lima/Sauce 9,0:1 | — | Todos AA o más |
