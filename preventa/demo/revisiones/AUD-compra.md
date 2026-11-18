# AUD · Auditoría del libreto de compra · sitio publicado

- **Fecha:** 07-nov-2026 · **Auditor:** AUD · **Sitio:** `sfnextpiz1af0959c456da71a…/cl/es-CL/` (rama `demo`, 2ff6933)
- **Cómo:** Chrome sin ventana `headless-2`, contextos aislados `aud-compra`, `aud-diego`, `aud-sofia` y `aud-valentina` (uno por recorrido, cookies limpias), a 390 px con DPR 2 y a 1440 px. Se crearon carritos de invitado, sin pedidos. No se tocó código.
- **Libreto contra el que se mide:** 04 (reglas 1 a 9, v2 «Hazlo combo», v3), 02 (mitades y Arma tu pizza), 05, 06, 10, R1–R6, `CONTRATO.md` (S-D3 y pedido canónico) y UX-2 §4.

## Veredicto

**No cumple el libreto de compra.** El recorrido de **pizza** está bien: hoja, panel de modalidad, «Hazlo combo», «Completa tu pedido» y agotado por tienda. El problema es que **todo lo que no es pizza** cae en la ficha del template, y se llega a ella desde casi todas las entradas:
- **los 40 productos** de combos, acompañamientos, bebidas, postres y extras;
- la entrada desde el nombre del producto, el menú, el buscador, Promos y la Home.

La ficha del template pide «código postal», ofrece «Retiro gratis» (BOPIS) e ignora la modalidad ya elegida. No ofrece nada para acompañar. Además, **deja agregar un Super Dúo sin elegir las pizzas**.

Lo que reporta Raúl se reproduce exactamente (AUD-01, AUD-20). Rompe la regla 1 y la regla 7 de 04, y el supuesto S-D3. El carrito sigue siendo el del template (CAR trabaja en eso).

| Recorrido | Nota (1–10) | Por qué |
|---|---|---|
| Pizza de especialidad desde el menú y su ficha | **8** | Hoja, preselección, «sin cebolla», precio en vivo, panel de modalidad, «Hazlo combo» y «Completa tu pedido» (la regla 7 agrega pizza y palitos juntos). Falta «½ Mitad» en la ficha |
| «Arma tu pizza» | **7** | Hoja correcta y champiñón «agotado en El Bosque» (R4.6). Título duplicado. El carrito pierde los extras |
| Mitades | **5** | El armador funciona, pero el botón no muestra precio y cobra el base ($12.400, +12 puntos), no el promedio de $17.900 (R2.1) |
| Super Dúo y Super Trío desde Promos y la Home | **7** | Constructor, panel y aviso correctos |
| Super Dúo y Super Trío desde el menú y el buscador | **1** | Abren `/p/cb-super-duo` del template y se agregan **sin elegir pizzas** |
| Pizza del Mes, Papa Flash, Papa Combo Palitos y Papa Combo con Postre (todas las entradas) | **2** | Ficha del template: código postal, «Retiro gratis», «Agregar al carrito» sin aviso y sin elegir nada |
| Acompañamientos, bebida y postre desde el «+» del menú | **8** | Se agregan directo con aviso. La bebida elige tamaño en la tarjeta (regla 1) |
| Acompañamientos, bebida y postre desde el nombre (ficha) | **2** | Ficha del template. La bebida queda sin tamaño preseleccionado («Selecciona todas tus opciones arriba») |
| Guion de Sofía (repetir) | **3** (sin sesión) | Sin sesión, «Repetir pedido» lleva a `/login` del template («Registrarse», Apple y Google). No se pudo probar con sesión (ver nota de ambiente). La Pizza del Mes de su Home lleva al template |
| Guion de Diego (Super Dúo desde la Home) | **7** | Constructor, panel de retiro y aviso correctos. En el carrito el combo dice «Despacho a domicilio» y no muestra las pizzas |
| Guion de Valentina (arma con extras + bebida) | **5** | El CTA del hero «Lo quiero $10.990» lleva al template. El «+» de sus destacadas agrega la pizza sin hoja ni «Hazlo combo». El armado y la bebida funcionan, pero el carrito muestra la línea a $12.400 sin los extras |
| Invitado sin tienda: panel, delivery y retiro | **8** | Panel conforme a 05: dirección con sugerencia, Salvador asignada, 35–45 min, despacho $1.990 y mínimo $12.000. El retiro muestra distancias, estado y tiempos. Fuera del menú el texto es genérico |
| Carrito | **3** | Template: sin configuración, «Es un regalo», «Despacho a domicilio» con retiro, «Editar» en inglés y cupón a la vista |

## Tabla «tipo de producto × entrada»

✅ = cumple el libreto · ❌ = no cumple · — = no existe esa entrada.

| Tipo | Entrada | Abre hoy | Debería abrir (libreto) | | Captura |
|---|---|---|---|---|---|
| Pizza de especialidad | Menú «+» | Hoja «Arma tu pizza» → panel (sin tienda) → «Hazlo combo» | Hoja (04 R1, R6; 05) | ✅ | AUD-03, 04, 06 |
| Pizza de especialidad | Nombre → ficha | Ficha PRO con «Completa tu pedido»; pizza y palitos se agregan juntos | Ficha 04 p.5 (R7) | ✅ (sin «½ Mitad») | — |
| Pizza de especialidad | Home Valentina «+» | Agrega directo tras el panel; sin hoja ni «Hazlo combo» | Hoja (04 R1; 02 «regla única, conserva Hazlo combo») | ❌ | AUD-18 |
| Pizza de especialidad | Home Sofía «Agregar · $16.900» | Navega a la ficha | Hoja sin salir (04 objetivo) | ❌ | — |
| Pizza de especialidad | Buscador | Ficha PRO | Ficha | ✅ | — |
| Arma tu pizza | Tarjeta del menú | Hoja | Hoja (02 v3) | ✅ | — |
| Arma tu pizza | `/p/pz-arma-tu-pizza` | Ficha PRO | Ficha | ✅ | — |
| Mitades | Tarjeta del menú, «½ Mitad», `/p/pz-mitades` | `/mitades` (armador) | Armador 02 p.3 | ✅ (precio ❌) | AUD-10 |
| Mitades | Ficha de pizza | Sin entrada | «Mitades» en la ficha móvil (04 historial) | ❌ | — |
| Pizza del Mes | Hero de Valentina, Home de Sofía, menú, Promos y buscador | Ficha template `/p/cb-pizza-del-mes` | Ficha con lo más pedido y «Agregar» (S-D3); «Completa tu pedido» (04 R7) | ❌ | AUD-01, 18, 20 |
| Super Dúo | Home de Diego y Promos «Armar» | `/promos/super-duo` (constructor) | Constructor (10, S-D3) | ✅ | AUD-14, 15 |
| Super Dúo | Menú (Ofertas) y buscador | Ficha template; agrega sin elegir pizzas | Constructor (S-D3; 10 regla 1) | ❌ | AUD-22, 23 |
| Super Trío | Home y Promos | Constructor | Constructor | ✅ | — |
| Super Trío | Buscador | Ficha template | Constructor | ❌ | AUD-22 |
| Papa Flash | Home de Diego («Para 1»), Promos y buscador | Ficha template; agrega sin aviso | Ficha con lo más pedido (S-D3) | ❌ | AUD-12, 13 |
| Papa Combo Palitos | Home (Valentina y Diego), menú, Promos y buscador | Ficha template | Ficha con lo más pedido (S-D3) | ❌ | AUD-11 |
| Papa Combo con Postre | Home de Valentina, menú, Promos y buscador | Ficha template | Ficha con lo más pedido (S-D3) | ❌ | AUD-11 |
| Acompañamiento (palitos, croissant*) | Menú «+» | Agrega directo con aviso | Directo con aviso (04 R1) | ✅ | AUD-07 |
| Acompañamiento | Nombre → ficha | Ficha template | Ficha simple PJ (04 p.7) | ❌ | — |
| Bebida con tamaño | Menú: chip de tamaño + «+» | Agrega el tamaño elegido con aviso | 04 R1 | ✅ | AUD-07 |
| Bebida con tamaño | Nombre → ficha | Ficha template sin tamaño elegido, tamaños desordenados (2.5 antes de 1.5) y un «Hazlo combo: Palitos…» fuera de lugar | Tamaño preseleccionado y «Agregar» | ❌ | AUD-24 |
| Postre | Menú «+» | Directo con aviso | 04 R1 | ✅ | AUD-07 |
| Postre | Nombre → ficha | Ficha template | Ficha simple PJ | ❌ | AUD-25 |

\* Los Croissant son pizzas (`pz-croissant-*`) y abren la hoja: ✅.

## Desvíos priorizados

### P0 · Rompen la compra o la demo

| # | Pantalla | Evidencia | Qué debe pasar | Dueño |
|---|---|---|---|---|
| P0-1 | Ficha `/p/<id>` de **todo lo que no es pizza** (40 productos, lista abajo) | AUD-01, 12, 20, 23, 24, 25. Muestra «Introduce tu código postal…», «Retiro gratis en», «Agregar al carrito», sin aviso al agregar y sin complementos. Con «Retiro · El Bosque» en el chip, ninguna opción aparece marcada | Una ficha PJ para combos y productos simples: <ul><li>foto, nombre y precio;</li><li>lo más pedido preseleccionado (S-D3);</li><li>«Agregar» que pasa por el panel de TIE si no hay tienda;</li><li>aviso con puntos;</li><li>«Completa tu pedido» (04 R7).</li></ul>Sin el bloque BOPIS ni el código postal. Es el #96 (PRO-08), con el alcance medido aquí | PRO |
| P0-2 | Super Dúo y Super Trío en la ficha del template | AUD-23: «Dos pizzas familiares a elección», con «Agregar al carrito» activo y **sin elegir pizzas**. Se llega desde las Ofertas del menú (`/p/cb-super-duo`) y el buscador (`/p/cb-super-duo`, `/p/cb-super-trio`) | `/p/cb-super-duo` y `/p/cb-super-trio` redirigen a `/promos/super-duo` y `/promos/super-trio`. Las tarjetas del menú y del buscador enlazan al constructor | OFE (redirección), MEN (enlaces) |
| P0-3 | Hero de la Home de Valentina «Lo quiero $10.990» y «Agregar $10.990» de la Pizza del Mes de Sofía | AUD-18. Es el primer CTA de la demo y lleva a AUD-01 | Mientras no exista P0-1: abrir la hoja de The Works Familiar (es una pizza) con el precio del combo, o la ficha PJ de P0-1 | HOM / PRO |
| P0-4 | Papa Flash, Papa Combo Palitos y Papa Combo con Postre (tarjetas «Para 1», «Para 2» y «Antojo de noche» de Diego y Valentina, y Promos «Ver oferta») | AUD-11, 13, 14. Se agregan **en silencio**: el contador sube de 9 a 10 sin aviso ni elección de pizza o bebida. La línea del carrito no dice qué pizza ni qué bebida lleva | Ficha S-D3 con lo más pedido a la vista («Pepperoni individual · Mini palitos · Coca-Cola 350 ml») y aviso. La línea del carrito lleva ese detalle (`c_pjComboChoices`) | PRO + OFE |

### P1 · No cumplen el libreto

| # | Pantalla | Evidencia | Qué debe pasar | Dueño |
|---|---|---|---|---|
| P1-1 | «+» de las pizzas destacadas en la Home de Valentina | Panel → «¡Agregada! Pollo BBQ Familiar» directo, sin hoja ni «Hazlo combo» aunque es la primera pizza del pedido | 04 R1 y 02: el «Agregar» de una pizza abre la hoja, la única que conserva tienda y «Hazlo combo». Si el «+» de un toque es una decisión de HOM, debe al menos abrir «Hazlo combo» después (04 R6) | HOM (con la hoja de PRO) |
| P1-2 | «Agregar · $16.900» y «$18.900» de las favoritas de Sofía | Navega a `/p/pz-pollo-bbq` | Abrir la hoja sobre la Home («sin salir de donde está», 04 objetivo) | HOM |
| P1-3 | Armador de mitades | AUD-10. Con Pollo BBQ + Todas las Carnes el botón dice «Agregar · Pagas el promedio», sin monto. El aviso dice «+12 Papa Puntos» (cobra $12.400) | Botón «Agregar · $17.900» y cobro de $17.900 (R2.1, 04 R3, pedido canónico). El cobro depende del interruptor de hooks (bloqueo de Raúl); **el precio en el botón no depende de eso** y lo puede calcular el armador | PRO (botón); Raúl/DAT (hook) |
| P1-4 | Ficha de pizza | Sin entrada a mitades (solo una pregunta frecuente) | Botón «½ Mitad» que lleve a `/mitades?mitad1=<id>` (04 historial: «la ficha móvil lleva al armador de mitades») | PRO |
| P1-5 | Carrito, línea de pizza configurada | AUD-19: «Arma tu pizza Familiar Tradicional $12.400» sin «+ pepperoni + choclo» (subtotal $36.670 correcto). AUD-08: Pollo BBQ sin «sin cebolla». Confirma #34 y #37 | 06 R3, UX-2 §4.3 | CAR (en curso) |
| P1-6 | Carrito, modalidad | AUD-16 y 19: «Despacho a domicilio – 3 de 3» y chip «Delivery» en cada línea, con «Retiro · El Bosque» elegido. Confirma #38 | Primera tarjeta «Retiro en El Bosque · listo en 15 min» (UX-2 §4.2) | CAR |
| P1-7 | Carrito, línea de combo | AUD-16: «SUPER DÚO $22.590» sin las dos pizzas. «Hazlo combo» aparece como dos líneas sueltas (Palitos $4.417 y Coca-Cola $2.573), no como un combo | Línea «Combo» con su detalle (06 R2; CAR-01 5b) | CAR |
| P1-8 | Carrito, «Editar» | AUD-09: diálogo «EDITAR ARTÍCULO DEL CARRITO» con «Review product details, choose options, and add the item to your cart.», «Close», «Actualización», y tamaño «Individual» para la Pollo BBQ | «Editar» abre la hoja de PRO con todo marcado (06 R3). Confirma #34 | CAR |
| P1-9 | Panel de modalidad abierto desde la Home o un constructor | «Elige cómo quieres tu pedido…» (Diego con el Super Dúo, Valentina con la Pollo BBQ). Desde el menú sí dice «Para agregar tu Pollo BBQ Familiar» | 05 R1: «Para agregar tu Super Dúo…» desde cualquier entrada | TIE (+ HOM y OFE pasan el nombre) |
| P1-10 | Sin sesión, «Repetir pedido» de Sofía | AUD-17: `/login` del template («Registrarse», «¿No tiene una cuenta? Únete», Apple y Google). Confirma #23 | Ingreso de ING con marca, o el ingreso con código. El presentador nunca debe caer aquí | ING / INT |

### P2 · Pulido

| # | Pantalla | Evidencia | Qué debe pasar | Dueño |
|---|---|---|---|---|
| P2-1 | Carrito | «Es un regalo. Más información.» en cada línea, «¿Tiene un código promocional?» (06 R5: cupón solo en el checkout; además trata de «usted»), «Envío: Por determinar», «Continuar a finalizar compra» y «Coca-Cola Coca-Cola 350 ML» | Quitar el regalo y el cupón. CTA «Ir a pagar · $X». Nombres de DAT (#19) | CAR / DAT |
| P2-2 | Hoja de «Arma tu pizza» | El encabezado del diálogo dice «ARMA TU PIZZA ARMA TU PIZZA» | Si el producto es el constructor, solo «Arma tu pizza» | PRO |
| P2-3 | Ficha y hoja de «Arma tu pizza» | «Tu masa, tu salsa y hasta 10 ingredientes», pero no se elige la salsa | Quitar «tu salsa» o agregar el selector | PRO / DAT |
| P2-4 | «Tu pedido» del menú a 1440 | AUD-21: muestra «Tu pedido está vacío… por ahora» durante unos segundos con «Mi pedido · 3» en el encabezado | *Skeleton* mientras carga | MEN |
| P2-5 | «Tu pedido» del menú a 1440 | Las líneas no muestran la configuración («1× Arma tu pizza Familiar Tradicional $12.400») y el total es $36.670 | Misma línea que CAR («Familiar · Tradicional · + pepperoni, choclo», con el precio con extras) | MEN / CAR |
| P2-6 | Aviso de agregado a 390 | AUD-07: «Cookie agregada · $40.…» truncado; «Chicken Poppers agregada» (concordancia) | Total completo; «agregado» o «¡Listo!» neutro | MEN / INT (#92) |
| P2-7 | Constructor y combos | Tras «Agregar Super Dúo» no se ofrece nada (bebida o postre) | Un momento de venta cruzada (KPI de 35%): una tarjeta compacta, sin repetir «Hazlo combo» si ya se ofreció | OFE |
| P2-8 | Ficha del template de bebida | AUD-24: «Hazlo combo: Palitos de Ajo y bebida 1,5 L por $6.990» como *callout* en la Coca-Cola | Lo resuelve P0-1; que DAT revise a qué productos aplica el `calloutMsg` | DAT |
| P2-9 | Menú, Bebidas | «Bebidas 8» frente a 10 de producción (02); «1,5 LT» frente a «1,5 L» | Datos (#19) | DAT |

### Evidencia nueva sobre pendientes conocidos

- **#79 (precio de «Hazlo combo»):** el 07-nov el carrito **sí aplica** el precio: Palitos $5.990 → $4.417 y Coca-Cola Sin azúcar $3.490 → $2.573, que suman $6.990 (AUD-08). Lo que falta es mostrarlo como una línea de combo (P1-7).
- **#96:** el alcance real son 40 productos y 6 entradas (tabla de arriba), no solo `cb-pizza-del-mes`.

## Rastros del template a la vista

| Texto o componente | Dónde |
|---|---|
| «Introduce tu código postal para ver la estimación de entrega» | 40 fichas no-pizza (AUD-01) |
| «Retiro gratis en … / Seleccionar tienda» (BOPIS) | 40 fichas no-pizza |
| «Agregar al carrito», «Disponible:», «PAPA JOHNS» como marca encima del nombre | 40 fichas no-pizza |
| «Selecciona todas tus opciones arriba» | Ficha de bebidas |
| «Review product details, choose options, and add the item to your cart.», «Close» (inglés) | Carrito → Editar (AUD-09) |
| «Es un regalo. Más información.» | Cada línea del carrito |
| «¿Tiene un código promocional?», «Envío: Por determinar», «Continuar a finalizar compra» | Carrito |
| «Despacho a domicilio» con retiro | Carrito |
| «Registrarse», «¿No tiene una cuenta? Únete», Apple y Google | `/login` |
| Logos de tarjetas | No se ven en el carrito actual (no se recorrió el checkout) |

## Productos que hoy caen en la ficha del template (40)

Verificado el 07-nov con el HTML del servidor de cada `/p/<id>`: los 40 muestran «código postal», «Retiro gratis» y «Agregar al carrito». Las 24 pizzas, `pz-arma-tu-pizza` y `pz-mitades` **no** caen en el template.

| Tipo | IDs |
|---|---|
| Combos (7) | `cb-pizza-del-mes`, `cb-super-duo`, `cb-super-trio`, `cb-papa-flash`, `cb-papa-combo-palitos`, `cb-papa-combo-postre`, `cb-box-halloween` (vencido; debería mostrar «Esta oferta terminó», R2.7) |
| Acompañamientos (13) | `cp-dulce-y-truco`, `cp-chicken-poppers`, `cp-rolls`, `cp-cheesy-veggies`, `cp-palitos-de-ajo`, `cp-palitos-de-queso`, `cp-alitas-de-pollo`, `cp-palitos-de-ajo-5-unidades`, `cp-palitos-de-queso-y-tocino`, `cp-mini-palitos-de-ajo-6-unidades`, `cp-pesto-rolls`, `cp-mini-palitos-de-ajo-y-queso`, `cp-cheesyquenos` |
| Bebidas (8) | `cp-coca-cola`, `cp-coca-cola-light`, `cp-coca-cola-sin-azucar`, `cp-coca-cola-sin-azucar-220ml`, `cp-sprite`, `cp-sprite-zero`, `cp-fanta`, `cp-red-bull` |
| Postres (9) | `cp-cookie`, `cp-brownie`, `cp-pie-con-nutella`, `cp-helados-la-cremeria`, `cp-cinnapie`, `cp-helados-tipo-bombones`, `cp-boom-de-trencito`, `cp-palitos-de-canela`, `cp-helados-individuales` |
| Extras (3) | `cp-pepperoncini`, `cp-salsa-de-pizza`, `cp-el-ultimo-slice` |

## Nota de ambiente

- Contextos `aud-*` cerrados. No se tocó la página ajena `VAL-R2`.
- **Carritos de invitado abandonados:**
  - `aud-compra`: unos 10 productos, delivery a Av. Providencia 1234;
  - `aud-diego`: un Super Dúo, retiro en El Bosque;
  - `aud-valentina`: Pollo BBQ, Arma tu pizza y Coca-Cola 1,5 L, retiro en El Bosque.
- **Sofía con sesión no se probó:** leer la contraseña de demo de los scripts de `site-data/ocapi/` quedó bloqueado por permisos. Para cerrar ese guion, VAL necesita `val2@demo.pj.cl` en `headless-2`.
- Cloudflare devolvió 429 al pedir muchas fichas seguidas. Con 6 s de pausa respondió bien.
