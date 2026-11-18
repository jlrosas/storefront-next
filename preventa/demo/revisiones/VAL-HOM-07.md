# VAL-HOM-07 · Home que da hambre

**Veredicto: APROBADA** (con hallazgos menores, ninguno bloqueante)

- Fecha: 2026-11-06. Código: `storefront-wt/HOM`, rama `hu/HOM`, commit 3c13523, `pnpm dev --port 5174` (detenido al terminar).
- Navegador: `chrome-devtools-headless` (instancia 1), un contexto aislado por perfil (`VAL-HOM07-v`, `-d`, `-s`), sesión limpia al inicio. Móvil 390x844 (Android emulado, táctil) y escritorio 1440x900, **datos reales del sandbox** (todas las llamadas a imágenes y productos respondieron 200; no hubo 5xx).
- Sandbox: en el perfil Valentina se agregaron 2 pizzas al carrito de invitado (Pollo BBQ y Super Pepperoni), pedido por el encargo.

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Hero a sangre en los 3 perfiles; móvil: foto ≥ 58 %, tarjeta crema, sello, precio display; escritorio *full* | ✅ | En 390 el contenedor de la foto mide 506 px de 844 = **60 %** en Valentina, Diego y Sofía. Tarjeta crema flotante con `rounded` y sombra, sello `-50 %` (granate en móvil, lima en escritorio) o `-19 %`, precio display (`$10.990` / `$22.590`), CTA «Lo quiero · $10.990» y «Armar mi Super Dúo · $22.590» (Sofía: «Repetir pedido · $23.890»). En 1440 el hero es *full*: foto a todo el ancho con degradado Basil-deep y texto sobre ella. `VAL-HOM-07-valentina-hero-390.png`, `…-valentina-full-390.jpeg`, `…-valentina-full-1440.jpeg`, `…-diego-full-390.jpeg`, `…-diego-full-1440.jpeg`, `…-sofia-full-390.jpeg`, `…-sofia-full-1440.jpeg` (todas abiertas) |
| 2. Saludo en Garlic + Sauce, lealtad en Sauce, nunca dos verdes seguidos | ✅ (⚠️ Sofía) | Valentina: franja `surface-garlic` (rgb 227,194,237, 44 px) con «¡Volviste! Este pedido suma Papa Puntos al doble.» en granate; lealtad «PEDIR DIRECTO TIENE PREMIO» en `surface-sauce` (rgb 113,5,0). Orden en Valentina: lila → hero crema → Basil (momentos) → crema → granate → footer Basil: ningún par verde-verde. Diego: hero → crema → Basil (momentos) → crema → footer. Sofía: granate (puntos) entre crema y footer. En Sofía el saludo «HOLA, SOFÍA» va sobre crema (no hay franja lila); ver H3 |
| 3. Valentina suma carrusel por intención y bloque de momentos | ✅ | Carrusel «¿Qué se te antoja?» con chips «Para compartir / Menos de $15 mil» y 4 tarjetas, y «¿Y para este momento?» con chips Almuerzo/Partido/Celebración/Bajón, foto de queso estirándose y tarjeta del combo. El bloque de momentos también aparece en Diego |
| 4. Fotos destacadas: queso estirándose y napocherry | ✅ | `napolitana-familiar-1788736846.jpg` (alt «Una mano levanta una pizza…») en el bloque de momentos y `napocherry-1730987248.jpg` en el bloque de lealtad de Valentina: ambas **200** en `list_network_requests` y `complete && naturalWidth > 0`. 0 imágenes rotas en los 3 perfiles. Sin 404 para DAT. El hero de Sofía usa el Pollo BBQ con queso estirándose |
| 5. F7 y F11 | ✅ | F7: ningún perfil contiene «viernes»; el bloque usa el momento («Fin de semana · Celebración», «Para celebrar · Pizza del mes»). F11: la tarjeta «Para 3» de Diego (título «Pizza del Mes + Palitos + bebida» en 2 líneas, «$20.470», «armado para 3») no deja un «3» huérfano en 390 ni en 1440. `VAL-HOM-07-diego-para3-390.png` (abierta) |
| «+» de «Las más pedidas» | ✅ | Sin tienda, el primer «+» abre el panel «¿Cómo lo quieres?»; al «Confirmar» agrega y muestra «¡Agregada! Pollo BBQ Familiar +16 Papa Puntos» y el contador pasa 0 → 1. Con tienda, un solo toque en el «+» de Super Pepperoni: aviso «¡Agregada! … +33 Papa Puntos» y contador 2. Todas las variantes probadas (Pollo BBQ, Super Pepperoni) son orderables; Todas las Carnes no se agregó |
| Contraste, 12 px, 44 px | ✅ | 0 textos < 12 px en los 3 perfiles (390 y 1440). «+» de 44x44; enlaces de títulos de tarjeta de 23 px de alto pero con `::after` absoluto que cubre la tarjeta. 0 controles bajo 44 px aparte de esos |
| Consola | ⚠️ | Solo ruido de desarrollo (H4, H5) |

## Hallazgos

| ID | Severidad | Descripción | Responsable |
|---|---|---|---|
| H1 | Baja | Valentina, hero móvil: la descripción «…Alcanza para 3 o 4.» termina con «4.» huérfano en la última línea (mismo defecto que F11, en el hero). Sugerencia: `text-wrap: balance` o «Alcanza para 3–4.» | HOM |
| H2 | Baja | Con el aviso de cookies abierto, en 390 el aviso cubre la descripción y el CTA del hero en la primera pantalla. Es el comportamiento esperado del aviso compacto de VIS-05 (se cierra con «Aceptar»); solo para tenerlo presente en la demo. | VIS |
| H3 | Baja | Sofía no tiene franja de saludo en Garlic: el saludo es el titular «HOLA, SOFÍA» sobre crema con la píldora de puntos lima. Si el criterio 2 exige lila también para Sofía, falta. Decisión de UXD/HOM. | HOM / UXD |
| H4 | Ruido (dev) | `WebSocket … ws://localhost:24678 … 400` y `[vite] failed to connect to websocket`: HMR de Vite, puerto compartido con otros dev servers. | ninguno |
| H5 | Baja (template) | Aviso de hidratación por `nonce={undefined}` vs `nonce=""` en `<link data-react-router-critical-css>`. Viene del template base. | INT |
| H6 | Baja | Sofía en 1440: «Tus favoritas» deja 2 tarjetas a la izquierda y un tercio vacío a la derecha; la barra de progreso de puntos es rojo puro (Tangy Tomato) sobre granate, de bajo contraste (decorativa, sin texto). | HOM |
| H7 | Baja | Diego en 1440: la tarjeta «Para 3» tiene título de 2 líneas y el precio queda 18 px más arriba que en sus vecinas (desalineación de la línea de precio). | HOM |
| H8 | Observación | El encabezado móvil trunca «Elige cómo lo …» (sin tienda elegida). | TIE |

Notas: el carrito de invitado del sandbox quedó con 2 pizzas (Valentina). La prueba de `?perfil=` guardó la cookie `pj_perfil`; cada perfil corrió en su propio contexto aislado.
