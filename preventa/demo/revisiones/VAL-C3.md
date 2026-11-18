# VAL-C3 · Validación de CAR-02 (carrito objetivo) y guion de agregar

Build de producción de `demo` (8ecd80b) en `http://localhost:3017/cl/es-CL/`. Navegador `chrome-devtools-headless-2`, contextos aislados `VAL-C3`, `VAL-C3-canon`, `VAL-C3-h1` y `VAL-C3-d`. 390x844 DPR 2 táctil Android y 1440x900. Sesión de Sofía: `dev-car@demo.pj.cl` (contraseña de demo del repo). No se hicieron pedidos. Se cerraron mis páginas; la vista previa sigue arriba.

## Veredicto: **RECHAZADA**

Motivo único y demo-crítico: el canje de Sofía se ve bien en `/cart` ($23.890), pero el checkout **no lo aplica** y cobra $38.880 (la Super Pepperoni a $13.000 más despacho). El panel «Tu pedido» tampoco lo refleja. Lo demás de CAR-02 funciona y es de buen nivel. Con H-1 y H-2 cerrados (sin tocar el diseño) se aprueba.

## Los 21 puntos de la §5

| # | Resultado | Evidencia |
|---|---|---|
| 1 | ✅ | Retiro: «Retiro en El Bosque · Listo en 15 min · abierta hasta 23:30». Ningún «despacho» ni «delivery» en retiro (búsqueda en el texto de la página). En delivery sí aparecen, correcto |
| 2 | ✅ | Pollo BBQ Familiar Tradicional sin cebolla + Hazlo combo (Coca-Cola Sin azúcar 1,5 L): Productos $26.380, Ahorro −$2.490, **Total $23.890**, «Este pedido suma 23 Papa Puntos», CTA «Ir a pagar $23.890». `VAL-C3-canonico-390.png` |
| 3 | 🚫 | Mitades no probadas (ver No cubierto) |
| 4 | ✅ con reserva | 0 coincidencias de las 10 palabras en `/cart` (390 y 1440), en el panel 1440 y en la hoja «Editar». Fuera de `/cart`, el **checkout** sigue siendo el del template (ver H-1) |
| 5 | ✅ | Configuración en una línea + una de extras («+ Pepperoni», sin precio). Líneas a 390: 129 px (pizza), 128 (combo). A 1440: 151 px con extras, 109 el combo |
| 6 | ✅ | Línea propia con sangría y guía, foto, «Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L», $6.990, «AHORRAS $2.490», «Quitar». Sin tachados |
| 7 | 🚫 | Super Dúo no probado |
| 8 | ✅ | «Editar Pollo BBQ»: la hoja abre con «Volver a poner Cebolla» (sin cebolla marcado). Se agregó Pepperoni: «Guardar cambios $18.840»; la línea cambió en su lugar, total $23.890 a $25.830, puntos 23 a 25 |
| 9 | ✅ | Papelera con `aria-label` «Quitar Pollo BBQ del pedido». Aviso «Quitaste Pollo BBQ · Deshacer». «Deshacer» devuelve la línea con «Familiar · Tradicional · sin cebolla» |
| 10 | ⚠️ parcial | La tarjeta «Convertir en combo» no se alcanzó a ver: la promoción ya se aplica cuando se agregan Palitos y Coca-Cola desde la ficha (quedan sueltos con precio de promoción, ver H-3). No probé Palitos y Coca-Cola sueltos sin promoción |
| 11 | ✅ | En todos los estados vistos hay a lo sumo una tarjeta (postre «¿Cerramos con algo dulce?» cuando hay combo) |
| 12 | ❌ | Bloque `surface-sauce`, «Tienes 340 puntos… Canjear 260 puntos»; al canjear: «SUPER PEPPERONI MEDIANA · $0 · $13.000 · Canjeada con 260 Papa Puntos», «Canjeaste 260 puntos. Te quedan 80, y este pedido suma 23.», «Deshacer», cookie `pj_canje`, sello «Gratis» visible ~2 s. **El checkout NO lo muestra aplicado** (H-1). `VAL-C3-canje-390.png`, `VAL-C3-checkout-canje-390.png` |
| 13 | ✅ | «TU PEDIDO ESTÁ VACÍO», foto de 232 px, «Ver el menú», sin barra fija ni CTA. A 1440 con Sofía: además «Tu último pedido · Repetir pedido». `VAL-C3-vacio-390.png` |
| 14 | ✅ | Delivery con $8.780: «Te faltan $3.220 para pedir delivery», barra (`aria-valuenow` 73) y «o cámbiate a retiro»; CTA en contorno Basil, deshabilitado: «Agrega $3.220 para delivery». Con $8.990 sería $3.010, la regla es la misma. `VAL-C3-delivery-minimo-390.png` |
| 15 | 🚫 | Providencia cerrada: no se puede forzar sin escribir `c_pjClosed` en el sandbox ni el panel PAN. No cubierto |
| 16 | 🚫 | Skeleton: no lo vi en vivo (la ruta llega renderizada en el servidor). El código existe en `cart-states.tsx`; sin carrusel en ningún estado visto |
| 17 | ✅ | 390: barra fija de 81 px (CTA 56 px, `fixed`), sin BottomNav, al final del scroll no tapa el último contenido. 1440: columna derecha `sticky` (top 79 px al hacer scroll) que empieza a la misma altura (172 px) que la tarjeta de modalidad. Título a todo el ancho |
| 18 | ⚠️ | 1440: fotos de 96 px pintados, sin letterbox, origen 139 px (nítidas). **390:** pintadas a 72 px y sin letterbox, pero el origen es de 105 px (pizza), 96 px (combo) y 72 px (cookie) contra 144 px que pide DPR 2: ligeramente blandas. Es menor (H-5) |
| 19 | ✅ parcial | 390: 0 fallas de contraste (script de luminancia sobre todo el texto visible), 0 textos < 12 px, 0 áreas táctiles < 44 px (solo el enlace «Saltar al contenido», oculto). `palette.test.ts` no se ejecutó. Contraste a 1440 no medido |
| 20 | 🚫 | `prefers-reduced-motion`: solo por código (`motion-reduce`/`useReducedMotion` en combo-line, cart-line, summary-block, use-count-up, food-image). No se probó en vivo |
| 21 | ✅ | Ver la prueba de 5 segundos abajo |

Consola: 0 errores; un aviso repetido «There are no active adapters to send the event to» (ruido, ya conocido). Red: sin fallos observados.

## Pedido canónico y venta cruzada

Total $23.890, «suma 23 Papa Puntos» e «Ir a pagar · $23.890»: ✅ a 390 con retiro. Sin sesión (solo `?perfil=sofia`) el bloque dice solo «suma 23 Papa Puntos»; el canje exige sesión y funciona con `dev-car`.

## H1 de VAL-C2 (varias pizzas, desde la ficha)

Pollo BBQ + Super Pepperoni + Pizza del Mes con Palitos de Ajo y Coca-Cola 1,5 L desde «Completa tu pedido»: **el defecto original está resuelto.** El combo ya no queda pegado a otra pizza y la línea de Pizza del Mes se lee «The Works · AHORRAS $10.910». Se mantiene un efecto residual (H-3). `VAL-C3-h1-varias-pizzas-390.png`.

## Guion de EVAL-agregar (390; solo se ejecutaron los pasos que sirven al carrito)

| Paso | Resultado | Vuelos / avisos |
|---|---|---|
| V1 primera pizza (hoja, sin cebolla) | ✅ abre «Hazlo combo» con «Pollo BBQ agregada · Editar» y «Ahorras $2.490» | vuelos 0, avisos 0 (esperado por la decisión de VAL-PRO R2) |
| V2 segunda pizza (Super Pepperoni) | ✅ sin panel de tienda y sin «Hazlo combo»; aviso «¡Agregada! Super Pepperoni… +16 Papa Puntos… Deshacer» | **avisos 1; vuelos 0** (esperado 1; el contador no vio ninguna `<img>` fija, pudo volar de otra forma) |
| V4 «Hazlo combo» con Sin azúcar | ✅ «Combo agregado · quitar», total $23.890 | 0 / 0 |
| V5 ficha Pizza del Mes + Palitos + Coca-Cola (`Agregar combo + 2 $20.470`) | ✅ aviso con «+17 Papa Puntos» y «Deshacer» | **vuelo 1 y aviso 1** (el vuelo doble D-P1-4 está corregido) |
| V8 simple desde el menú (Cookie, con modalidad ya elegida) | ⚠️ aviso del menú «Cookie agregada · $7.990 · Ver pedido»: sin puntos y sin «Deshacer» (D-P2-1 sigue) | avisos 1; vuelos 0 |
| V19 «Editar» desde el carrito | ✅ ver punto 8 | — |
| V3, V6, V7, V9, V10, V11, V12, V13, V14–V18, V20 | 🚫 no ejecutados (agotado el presupuesto de llamadas; V6 y V9 dependían de mitades y del constructor) | — |

## Notas (criterio de UX-3, «entrar por los ojos»)

| | 390 | 1440 |
|---|---|---|
| Nota | **8** | **8** |
| Por qué | Modalidad, líneas compactas, combo con guía, bloque granate y CTA con monto. Total en Condensed. Descuentos: fotos blandas a DPR 2, la modalidad ocupa tres líneas | Dos columnas, resumen sticky con granate, estados limpios. Descuentos: línea de la pizza con extras de 151 px y espacio vacío bajo la columna izquierda |

La nota solo se sostiene si se corrige H-1 y H-2: un 8 en pantalla con un cobro distinto al mostrado no pasa en la demo de Sofía.

**Prueba de 5 segundos (390):** el cliente entiende que retira en El Bosque en 15 minutos, que lleva una pizza Pollo BBQ sin cebolla con un combo, que paga $23.890 (CTA y Total) y que gana 23 Papa Puntos. Lo que no capta a la primera es que ahorra $2.490 (aparece debajo de la línea del combo) y el estado de la oferta del postre. A 1440 no se ve vacía ni de formulario (`VAL-C3-canje-1440.png`).

## Hallazgos

| ID | Sev. | Dueño | Qué | Evidencia |
|---|---|---|---|---|
| H-1 | **Alta (P0)** | CHK (con CAR para `pj_canje`) | Con el canje aplicado en `/cart` ($23.890 en CTA), `/checkout` es todavía el del template: lista la Super Pepperoni a **$13.000**, «Total 4 artículos $38.880» (= 23.890 + 13.000 + despacho $1.990), «Despacho a domicilio» en cada línea aunque la modalidad es retiro, y palitos y Coca-Cola con tachados («Guardado $1.573 / $917») y «1.5 LT». El cliente ve $23.890 y le cobrarían $38.880 | `VAL-C3-checkout-canje-390.png` |
| H-2 | Media (P1) | CAR (archivo de MEN: avisar) | El panel «Tu pedido» de 1440 ignora el canje: Super Pepperoni **$13.000**, total **$38.830** y «suma 38 Papa Puntos», contra $25.830 y 25 en `/cart` con el mismo carrito | `VAL-C3-panel-1440.png` |
| H-3 | Media-baja (P2) | CAR | Con Palitos + Coca-Cola agregados desde la ficha de Pizza del Mes, quedan como dos líneas sueltas con precio de promoción ($4.417 y $2.573; sin foto de combo ni «Ahorras» por línea) y el resumen dice «Ahorro en combos −$2.490». Es lo que prohíbe §3.4 (precios por componente). Pasa igual cuando un segundo par de Palitos y Coca-Cola llega después de que el primero ya se agrupó. Ya no hay un combo bajo la pizza equivocada |  `VAL-C3-h1-varias-pizzas-390.png`, `VAL-C3-sofia-mezcla-390.png` |
| H-4 | Baja (P2) | CAR | Contador del encabezado y subtítulo cuentan 3 productos («3 productos») para el canónico; el boceto de UX-3 dice 2 (pizza + combo). Efecto de contar los dos componentes | `VAL-C3-canonico-390.png` |
| H-5 | Baja (P3) | DAT / CAR | Fotos de línea con origen de 105, 96 y 72 px pintadas a 72 px en DPR 2 (piden 144): `sw` insuficiente | medición con `evaluate_script` |
| H-6 | Baja (P2) | MEN | Aviso del «+» de simples del menú sin puntos ni «Deshacer» (D-P2-1), distinto al de pizzas y combos | V8 |
| H-7 | Baja (P3) | CAR | Delivery muestra «Llega en 25–35 min · desde El Bosque»; UX-3 §3.2 dice «35–45 min · desde Salvador». Es dato de la tienda de la cookie, no del componente | medición de `/cart` en delivery |
| H-8 | Info | CAR / ING | `/login` sigue siendo el del template («Sign In», botón «Registrarse»). Está en AUD P1-10 | login con `dev-car` |
| H-9 | Info | Operación | Al iniciar sesión con `dev-car`, el carrito de invitado se fusionó con uno que ya tenía la cuenta (otra Pollo BBQ y Palitos + Coca-Cola). Limpié el carrito de la cuenta al terminar | `VAL-C3-sofia-mezcla-390.png` |

## No cubierto

- Mitades ($17.900, punto 3), Super Dúo (punto 7), tienda cerrada (15), skeleton y error en vivo (16), promoción «solo retiro» y sin modalidad, `prefers-reduced-motion` en vivo (20), `palette.test.ts`.
- Contraste y áreas táctiles a 1440. «Convertir en combo» al tocarla (10).
- Los pasos V3, V6, V7, V9–V18 y V20 del guion.
- Los dos primeros intentos con `click` sobre las tarjetas agregaron una pizza duplicada en un contexto que descarté; no afecta los resultados.
- `iOS Safari` no se puede probar con este navegador.

## Cambios en el ambiente

- Sesión de `dev-car@demo.pj.cl`: carrito dejado vacío y `pj_canje` deshecho. Sin pedidos. Los carritos de invitado quedaron en los contextos que cerré.

## Evidencia

