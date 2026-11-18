# VAL-ENT · Validación de entradas de compra (HOM-09, MEN-07, TIE-06)

- **Fecha:** 07-nov-2026 · **Validador:** VAL · **Navegador:** `chrome-devtools-headless-3`, un contexto aislado por perfil (`val-ent-inv`, `-diego`, `-sofia`, `-1440`).
- **Entorno:** worktree `storefront-wt/ENT`, rama `tmp/entradas` (ead28cd), `pnpm dev --port 5189` contra el sandbox zyfj-001. Sitio PapaJohnsCL (`/cl/es-CL`).
- **Viewports:** 390 con DPR 2 (móvil emulado, táctil, UA Android) y 1440 × 900.
- **Perfiles:** Valentina (`?perfil=valentina`), Diego (`?perfil=diego&utm_campaign=PJSD26`) y Sofía (`?perfil=sofia`, **sin sesión**; no se dispuso de la contraseña de `val1@`). Carritos de invitado; sin pedidos; sin escrituras en el sandbox.

## Veredicto por historia

| Historia | Veredicto | Motivo |
|---|---|---|
| **HOM-09** (entradas de la Home) | **APROBADA** | El «+» de destacadas, de «Menos de $15 mil» y las favoritas de Sofía abren la hoja sin navegar. El hero de Valentina lleva a la ficha PRO-08. Los combos van al constructor o a su ficha. Flujo de Valentina completo. «Hazlo combo» sale solo tras la primera pizza. Observaciones de menor peso en los hallazgos |
| **MEN-07** (menú y buscador) | **APROBADA** | Ofertas y buscador (`/menu?q=super`) llevan Super Dúo y Super Trío a `/promos/<id>`; a 390 y a 1440. Con el constructor no hay forma de agregar sin elegir pizza. Quedan solo los hallazgos H1 y H4 |
| **TIE-06** (título del panel) | **RECHAZADA** | «Para agregar tu <producto>.» funciona desde la hoja de pizza, pero el panel que abre el **constructor de Super Dúo** sigue diciendo «Para agregar a tu pedido.» (H1). Es justo el caso que reportó AUD (P1-9, Diego con el Super Dúo). 05 regla 1 pide el nombre del producto |

## Tabla de entradas: perfil × entrada → destino

✅ cumple el libreto · ❌ no cumple. Destino medido con el `href`, el atributo `aria-haspopup` y el clic real (señalado con «clic») en 390 y 1440; salvo nota, igual en los dos.

| Entrada | Valentina | Diego | Sofía (`?perfil=sofia`, sin sesión) |
|---|---|---|---|
| Hero | «Lo quiero · $10.990» → `/p/cb-pizza-del-mes` (clic; ficha PRO-08: «Completa tu pedido», sin código postal ni «Retiro gratis») ✅ | «Armar mi Super Dúo» → `/promos/super-duo` (clic; constructor) ✅ | «Repetir pedido» fuera de alcance (flujo de ING/CAR) |
| «+» pizzas destacadas (Pollo BBQ, Super Pepperoni, Todas las Carnes) | Abre hoja «Arma tu pizza» en la misma Home, URL sin cambio (clic) ✅ | Abre hoja (`aria-haspopup=dialog`; clic probado en Valentina, mismo componente) ✅ | — |
| «+» «Menos de $15 mil» (Napolitana, Napolitana Cherry, Hawaiana, Vegetariana) | Abre hoja (clic en Napolitana Cherry) ✅ | — | — |
| Favoritas «Agregar · $16.900 / $18.900» | — | — | Abren hoja sin salir: Pollo BBQ (390) y Todas las Carnes (1440) (clic) ✅ |
| Tarjeta de momento (Almuerzo / Partido / Celebración / Bajón) | Almuerzo → `/p/cb-papa-flash`, Partido → `/promos/super-trio`, Celebración y Bajón → fichas PRO-08 ✅ | Igual ✅ | — |
| «Para 1» | — | `/p/cb-papa-flash` (ficha PRO-08) ✅ | — |
| «Para 2» | — | `/p/cb-papa-combo-palitos` (ficha PRO-08) ✅ | — |
| «Para 4» | — | `/promos/super-duo` (constructor; clic) ✅ | — |
| «Para 6+» | — | `/promos/super-trio` ✅ | — |
| «Para compartir» (Super Dúo y Super Trío) | `/promos/super-duo`, `/promos/super-trio` ✅ | — | — |
| «Menos de $15 mil»: Papa Flash y Pizza del Mes | `/p/cb-papa-flash`, `/p/cb-pizza-del-mes` ✅ | — | — |
| Pizza del Mes en las favoritas | — | — | «Agregar Pizza del Mes…» → `/p/cb-pizza-del-mes` (ficha PRO-08; es un combo con ficha, no pizza suelta) ✅ |
| Menú, Ofertas | Super Dúo → `/promos/super-duo`, Super Trío → `/promos/super-trio`, Pizza del Mes y Papa Combo Palitos → ficha ✅ | Igual, 390 y 1440 ✅ | — |
| Buscador `/menu?q=super` | `/promos/super-trio` y `/promos/super-duo` ✅ | Igual, 390 y 1440 ✅ | — |
| `/p/cb-super-duo` (URL directa, extra) | Redirige a `/promos/super-duo` ✅ | Igual | — |
| Panel al agregar desde la hoja | «Para agregar tu Pollo BBQ Familiar.» ✅ | — | — |
| Panel al agregar desde el constructor | — | «Para agregar a tu pedido.» ❌ (H1) | — |

## Flujo de Valentina como invitada

| Paso | 390 | 1440 |
|---|---|---|
| «+» de Pollo BBQ → hoja | ✅ (VAL-ENT-02) | ✅ |
| Agregar → panel «Para agregar tu Pollo BBQ Familiar. Lo recordamos para la próxima.» | ✅ | ✅ (VAL-ENT-06) |
| Confirmar y agregar → «Hazlo combo» (Palitos de Ajo + Coca-Cola 1,5 L, +$6.990, ahorras $2.490) | ✅ (VAL-ENT-03) | ✅ (VAL-ENT-07) |
| «No, gracias» y **segunda pizza** (Super Pepperoni) | Aviso «¡Agregada! +16 Papa Puntos», sin panel (tienda recordada) y **sin «Hazlo combo»** ✅ | Igual ✅ |

La segunda pizza no vuelve a abrir «Hazlo combo»: cumple la regla 7 de 04 («solo después de la primera pizza»). El carrito marcó 2 productos en ambos viewports. No se probó una segunda pizza tras **aceptar** el combo.

## Otras verificaciones

| Verificación | Resultado |
|---|---|
| Super Dúo: no se agrega sin elegir las pizzas desde ninguna entrada visible | ✅ En `/promos/super-duo` no hay botón «Agregar» hasta elegir la pizza 2 («Te falta 1 pizza»). El menú, el buscador, la Home y la URL directa van al constructor |
| Hero de Valentina → Pizza del Mes de PRO-08, nunca la del template | ✅ Sin «código postal», sin «Retiro gratis», sin «Agregar al carrito»; con «Completa tu pedido» (VAL-ENT-09) |
| Contraste ADA | ✅ Cálculo propio sobre Home (390), hoja de pizza (390) y «Hazlo combo» (1440): ningún texto bajo 4,5:1 (3:1 el grande). **Límite:** los textos sobre foto (hero) no se pueden medir con el cálculo, y se miraron en capturas (legibles) |
| Texto de 12 px o más | ✅ Sin textos menores de 12 px en la Home, la hoja y «Hazlo combo» |
| Áreas táctiles de 44 px o más | ⚠️ «+» y «Ver …» miden 44 × 44; los botones, chips y CTA son de 44 o más. Los **nombres de producto como enlace** miden 23 px de alto a 390 (H3) |
| Consola | Sin errores nuevos. Solo ruido del servidor de desarrollo: WebSocket de Vite (`ws://localhost:24678`, 400), y el aviso de hidratación por `nonce` en `critical.css`. Se ve en todas las pantallas, es del template y del servidor local |

## Hallazgos

| # | Severidad | Dueño | Hallazgo | Evidencia |
|---|---|---|---|---|
| H1 | **P1** | OFE (constructor) + TIE | El panel que abre el constructor de Super Dúo/Trío dice «Para agregar a tu pedido.» sin el nombre. El libreto (05 regla 1) pide «Para agregar tu Super Dúo…». El constructor no le pasa el nombre del producto al panel. Reproduce el P1-9 de AUD para Diego | VAL-ENT-04 (390); mismo texto a 1440 |
| H2 | P3 | HOM | A 390, los nombres de producto enlazados de las tarjetas (Pollo BBQ, Super Dúo, etc.) miden 23 px de alto, bajo los 44 px. No es crítico: el «+» o «Ver …» de 44 × 44 hace de entrada principal | Medición con `getBoundingClientRect` |
| H3 | P3 | HOM | «Para 1» y «Para 2» de Diego llevan a ficha, no a una hoja. Conforme al contrato (S-D3 y el libreto de combos). Se anota solo para que no se lea como pendiente | Tabla |
| H4 | P3 | MEN | A 1440 el menú se probó con el carrito de otro perfil en el contexto aislado: no se re-validó el P2-4 (skeleton «Tu pedido está vacío») porque no estaba en el alcance | — |
| H5 | Observación | HOM | Sofía forzada con `?perfil=sofia` sin sesión muestra «Hola, Sofía», 340 Papa Puntos y «Repetir pedido $23.890» con la tienda El Bosque recordada. Sirve para el presentador; con sesión real no se verificó (falta la contraseña de `val1@`) | VAL-ENT-08 |
| H6 | Observación | PRO / OFE | Hallazgos AUD P0-2, P0-3, P1-1 y P1-2 **corregidos**: Super Dúo desde el menú y el buscador (P0-2), hero de Valentina a la ficha PRO-08 (P0-3), «+» de destacadas con hoja y «Hazlo combo» (P1-1), favoritas de Sofía con hoja (P1-2). P1-9 solo parcialmente (H1). **P1-6 (carrito, modalidad «Despacho a domicilio» con retiro) no se validó: es del carrito (CAR) y no de las entradas** | — |

## No cubierto

- Sofía **con sesión** (sin contraseña de `val1@`/`val2@`); «Repetir pedido» y puntos.
- Segunda pizza **después de aceptar** «Hazlo combo»; y desde la hoja de Sofía con retiro ya elegido, más allá de ver «Hazlo combo».
- P1-6 (carrito) y cualquier pedido.
- Contraste de textos sobre foto con medición; se vieron en captura.
- Capturas de las pantallas del buscador y del menú no guardadas: la evidencia es texto (`href` y DOM).
- Safari iOS: no reproducible con este navegador.

## Cambios en el ambiente

- Se creó el `.env` en `storefront-wt/ENT/` (copia del de `storefront/`) y se levantó `pnpm dev --port 5189`. **El servidor del 5189 queda detenido.**
- Carritos de invitado de los contextos aislados (se cerraron las páginas y los contextos): `val-ent-inv` (2 pizzas), `val-ent-1440` (2 pizzas), `val-ent-sofia` (1 pizza), `val-ent-diego` (un Super Dúo no confirmado). Sin escrituras en el sandbox más allá de los carritos de invitado.
- **Incidente:** al detener el servidor, un `kill -9` alcanzó el pid 67276, que resultó ser un `Google Chrome Helper` con un socket al 5189 (no el servidor). Mis páginas ya estaban cerradas. Lo más probable es que fuera un proceso del navegador `headless-3`; si otro conector falla, es por esto.
