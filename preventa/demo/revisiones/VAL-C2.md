# VAL-C2 · Validación integrada (PRO-08 + CAR-01)

Worktree `storefront-wt/VALC`, rama `val/c2` (demo + hu/CAR + hu/PRO, commit b9f1159). `pnpm dev --port 5187` levantado y detenido por VAL. Navegador `chrome-devtools-headless-3`, contextos aislados `VAL-C2` (390), `VAL-C2b` (1440), `VAL-C2c` (390, Hazlo combo), sesión limpia. 390x844 DPR 2 táctil con UA Android; 1440x900 DPR 1. Fecha 06/07-nov-2026. URLs con prefijo `/cl/es-CL/` (sin prefijo, `/p/<id>` cae en la Home: es la configuración multi-sitio, no un defecto). Hooks SCAPI apagados: mitades cobran $12.400 y extras $1.940 fijos (anotado, no es motivo de rechazo). Pruebas estáticas no corridas por VAL (ya venían en verde).

## Veredictos

| Historia | Veredicto |
|---|---|
| PRO-08 | **APROBADA** (con 3 menores) |
| CAR-01 | **APROBADA con condición**: arreglar H1 (combo agrupado bajo la pizza equivocada) antes de la demo; 4 menores más |

Auditoría: P0-2 ✅, P0-4 ✅, P1-3 ✅ (botón; el cobro depende de hooks), P1-4 ✅, P1-5 ✅.

## PRO-08

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | 4 combos con ficha propia (`cb-pizza-del-mes`, `cb-papa-flash`, `cb-papa-combo-palitos`, `cb-papa-combo-postre`) | ✅ | Fichas con foto, «Qué incluye», «Elige tu pizza» (Flash, Palitos, Postre), «Completa tu pedido» y barra «Agregar $X». `VAL-C2-ficha-pizza-del-mes-390.png`, `VAL-C2-ficha-papa-flash-390.png` |
| 2 | 33 `cp-*`: muestra de 2 acompañamientos, 2 bebidas (una con tamaño), 2 postres, 1 extra | ✅ | `cp-palitos-de-ajo`, `cp-cheesyquenos`, `cp-coca-cola` (350 ml / 591 ml / 1,5 L / 2,5 L), `cp-red-bull-83` (Regular/Sugarfree/Yellow), `cp-brownie`, `cp-cookie`, `cp-pepperoncini` (extra). Los 7 cargan ficha PJ. `VAL-C2-ficha-acompanamiento-390.png` |
| 3 | Sin rastro del template (código postal, «Retiro gratis», inglés, selectores genéricos) | ✅ | Regex sobre el texto de `main` en 10 fichas: 0 coincidencias de «código postal / retiro gratis / add to / quantity / size / color». Sin `<select>`. Texto en español |
| 4 | Elecciones preseleccionadas | ✅ | Flash «Super Pepperoni Individual · Mini Palitos · Coca Cola Sin Azucar 220ml»; Palitos «Pollo BBQ Familiar»; Coca-Cola 1,5 L por defecto |
| 5 | «Completa tu pedido» agrega todo con un solo botón | ✅ | Flash + Cheesyqueños: botón «Agregar combo + 1 · $10.480» (5.490 + 4.990 ✓). Pizza del Mes + Palitos + Coca-Cola 1,5 L: «Agregar combo + 2 · $20.470» (10.990 + 5.990 + 3.490 ✓). Contador +2 y +3 ✓ |
| 6 | Sin tienda aparece el panel de TIE; sin código postal ni BOPIS | ✅ | `Agregar` en ficha (390 y 1440) y en la hoja del menú abre «¿Cómo lo quieres?» (Retiro/Delivery, tiendas, «Confirmar y agregar $X»). Tras confirmar agrega y el aviso sale |
| 7 | Redirecciones | ✅ | curl: `/p/cb-super-duo` 302 → `/promos/super-duo`; `/p/cb-super-trio` 302 → `/promos/super-trio`; `/p/pz-mitades` 302 → `/mitades` |
| 8 | Mitades: botón «Agregar · $17.900» | ✅ | Pollo BBQ + Todas las Carnes: botón «Agregar $17.900» (390 y 1440) y texto «Pagas el promedio de las dos mitades: Pollo BBQ $16.900 y Todas las Carnes $18.900». `VAL-C2-mitades-390.png`, `VAL-C2-mitades-1440.png`. El aviso dice «+12 Papa Puntos» y el carro cobra $12.400: efecto de hooks apagados |
| 9 | Ficha de pizza con entrada a mitades | ✅ | Enlace «Arma por mitades» → `/mitades?primera=pz-pollo-bbq` (en el menú «½ Mitad» usa `?mitad1=`; ambos funcionan; no se siguió el enlace de la ficha, solo se comprobó el href y que la ruta lee `primera`) |
| 10 | Texto ≥ 12 px y áreas táctiles ≥ 44 px (390) | ✅ | 0 elementos de texto < 12 px; únicas áreas bajo umbral en las fichas: migas «Menú» 44x44, «Promos» 45x44 (OK) |
| 11 | Contraste ADA | ⚠️ solo medido en `/cart` | `/cart`: 0 fallas (script de luminancia sobre texto hoja). Fichas: revisadas a ojo en capturas (verde #2A5C2A sobre crema, rojo sobre crema, píldora lila) sin hallazgos, sin medición |

## CAR-01

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | `/cart` usa `PjCartPage`: tamaño, masa, «sin X», «+ extra», mitades, pizzas del combo | ✅ | `VAL-C2-cart-390.png`: «Familiar · Tradicional · sin cebolla · + Pepperoni $1.940 · + Choclo $1.940»; mitades «½ Pollo BBQ · ½ Todas las Carnes»; Super Dúo «Pollo BBQ + Super Pepperoni»; Flash «Pollo BBQ + Mini Palitos de Ajo y Queso + Coca Cola Sin Azucar 220ml» |
| 2 | El total de línea incluye opciones y cuadra | ✅ | Pollo BBQ 16.900 + 2 × 1.940 = 20.780 ✓; Arma 12.400 + 2 × 1.940 = 16.280 ✓. Suma de líneas = total del panel y de `/cart` en ambas canastas (98.020 en 1440; 130.340 = 123.350 + combo 6.990 en 390). No se leyó `productTotal` de SCAPI directo (hay `Authorization`); se cruzó con la suma de líneas y el botón «Ir a pagar» |
| 3 | «Editar» abre la hoja de PRO / armador de mitades sin duplicar | ✅ | Editar pizza: hoja con la configuración restaurada (Familiar, Tradicional, Quitar Cebolla apagado, Pepperoni y Choclo), «Guardar cambios $22.720» tras sumar tomate cherry; 11 productos antes y después, solo esa línea cambia (20.780 → 22.720; total 130.340 → 132.280). Editar mitades: «Guardar cambios», cambia el sabor derecho a Super Pepperoni, sigue 1 línea |
| 4 | «Hazlo combo» agrupado bajo su pizza | ✅ con H1 | Flujo directo: pizza 1 → hoja «Hazlo combo» (con el mismo texto de configuración) → «Sí, hazlo combo» → cart: «Combo: Palitos de Ajo + Coca-Cola Sin azúcar 1.5 LT · +$6.990 · Quitar combo» dentro de la línea de Pollo BBQ; total 27.770 = 20.780 + 6.990. `VAL-C2-hazlo-combo-390.png`, `VAL-C2-cart-hazlo-combo-390.png`. Ver H1 para el caso de complementos desde ficha |
| 5 | Misma lectura en aviso, panel «Tu pedido» y `/cart` | ✅ pizzas; ⚠️ combos | Ver tabla de consistencia |
| 6 | Modalidad arriba, sin «Despacho a domicilio» en retiro | ✅ | Retiro: «Retiro en El Bosque · Listo en 15 min · Abierta hasta 23:30 · Cambiar» arriba; resumen «Retiro en tienda · Gratis». Delivery: «Delivery a Av. Providencia 1234 · Llega en 40 min», resumen «Despacho $1.990», total 134.270 = 132.280 + 1.990 ✓. `VAL-C2-cart-delivery-390.png` |
| 7 | Texto ≥ 12 px, táctiles ≥ 44 px, contraste (`/cart` 390) | ✅ | 0 textos < 12 px, 0 áreas < 44 px, 0 fallas de contraste |
| 8 | Consola sin errores nuevos | ✅ | Solo: WebSocket de Vite 24678 en uso (ruido de dev: otro servidor ocupa el puerto), aviso de hidratación `nonce` del CSS crítico (dev) y «no active adapters». Ninguno sale de PRO/CAR |

## Tabla de consistencia (texto de la configuración)

Aviso = toast tras agregar (390 y 1440). Panel = «Tu pedido» en `/menu` 1440. Carro = `/cart` 390 y 1440.

| Caso | Aviso | Panel (1440) | Carro | ¿Igual? |
|---|---|---|---|---|
| Pizza desde la ficha (Pollo BBQ, sin cebolla, + Pepperoni, + Choclo) $20.780 | «Familiar · Tradicional · sin cebolla · + Pepperoni · + Choclo» | «Familiar · Tradicional · sin cebolla · + Pepperoni · + Choclo» $20.780 | «Familiar · Tradicional · sin cebolla» + «+ Pepperoni $1.940» + «+ Choclo $1.940» $20.780 | ✅ (mismo contenido; el carro suma el precio de cada extra) |
| Pizza desde la hoja del menú (igual) | idéntico al de la ficha | (misma línea, panel en 1440 solo con la ficha) | idéntico, $20.780 | ✅ (la hoja y la ficha producen la misma línea; sin merge, quedan 2 líneas) |
| Mitades (Pollo BBQ + Todas las Carnes) | «Familiar · Tradicional · ½ Pollo BBQ · ½ Todas las Carnes» | igual, $12.400 | igual, $12.400 | ✅ (precio $12.400 por hooks apagados; el botón dijo $17.900) |
| Arma tu pizza (+ Pepperoni, + Choclo) | «Familiar · Tradicional · + Pepperoni · + Choclo» | igual, $16.280 | «Familiar · Tradicional» + extras, $16.280 | ✅ |
| Super Dúo | «Super Dúo» (sin las pizzas) | «Pollo BBQ + Super Pepperoni» $22.590 | «Pollo BBQ + Super Pepperoni» $22.590 | ⚠️ el aviso no dice qué pizzas (H3) |
| Pizza del Mes + complementos (Brownie + Chicken Poppers) | «Pizza del Mes The Works Familiar» | línea «The Works» + «1× Brownie $7.990» + «1× Chicken Poppers $6.990» | ídem, 3 líneas | ⚠️ el aviso no menciona los complementos (H3) |
| Papa Flash + Cheesyqueños | «Papa Flash» (sin pizza elegida ni complemento) | no medido en el panel | «Pollo BBQ + Mini Palitos de Ajo y Queso + Coca Cola Sin Azucar 220ml»; «Cheesyqueños $4.990» aparte | ⚠️ aviso sin detalle (H3); falta «Individual» en el carro |
| Hazlo combo (Pollo BBQ configurada + palitos + Coca-Cola Sin azúcar) | hoja: «Familiar · Tradicional · sin cebolla · + Pepperoni · + Choclo» | no medido | «Combo: Palitos de Ajo + Coca-Cola Sin azúcar 1.5 LT +$6.990» bajo la pizza | ✅ (nombre «1.5 LT» vs «1,5 L», ver H4) |
| Pizza del Mes + Palitos de Ajo + Coca-Cola 1,5 L desde la ficha | «Pizza del Mes The Works Familiar» | no medido | ❌ el combo +$6.990 aparece bajo «Arma tu pizza» y la línea de Pizza del Mes dice solo «The Works» (H1) | ❌ |

Totales: panel y carro cuadran con la suma de líneas en las canastas de 1440 (98.020) y 390 (130.340; 132.280 tras editar; 134.270 con despacho).

## Hallazgos

| ID | Sev. | Dueño | Hallazgo | Evidencia |
|---|---|---|---|---|
| H1 | Media (P1) | CAR | Con varias pizzas en el carro, los complementos «Palitos de Ajo + Coca-Cola 1,5 L» agregados con «Completa tu pedido» desde la ficha de Pizza del Mes se agrupan como «Combo: … +$6.990» bajo **otra** pizza (Arma tu pizza), no bajo la de la ficha. La línea de Pizza del Mes queda sin complementos. El cobro en sí (+$6.990 vs $9.480) lo da el motor de promociones del sandbox y es coherente con «Hazlo combo»; lo que falla es a qué línea se asocia y que alguien lea «Combo» sin haberlo pedido | Canasta 390: ver `VAL-C2-cart-390.png`; no se repite con Brownie + Poppers (línea aparte) ni con un solo pizza (`VAL-C2-cart-hazlo-combo-390.png`) |
| H2 | Baja | PRO/DAT | Mitades: el cobro es $12.400 (hooks apagados) mientras el botón dice $17.900 y el aviso suma «+12 Papa Puntos». Esperado por el ambiente; hay que reconfirmar con hooks activos | `VAL-C2-mitades-390.png`, aviso y panel |
| H3 | Baja | PRO | El aviso de agregado de Super Dúo, Papa Flash y Pizza del Mes dice solo el nombre del combo, no las pizzas ni los complementos que sí muestran el panel y el carro. Pedido de Raúl: «tiene que ser consistente todo» | tabla de consistencia |
| H4 | Baja | DAT/CAR | Nombres de producto sin pulir: «Coca-Cola Sin azúcar 1.5 LT» (carro) vs «Coca-Cola 1,5 L» (ficha, Hazlo combo); «Coca Cola Sin Azucar 220ml» sin guion ni tilde (ficha y carro de Flash); alt de imagen «Coca-Cola 1.5 L» | textos de `/cart` y de la ficha Flash |
| H5 | Baja | CAR | El carro dice «Llega en 40 min» y el encabezado «35–45 min» para el mismo delivery | `VAL-C2-cart-delivery-390.png` |
| H6 | Baja | CAR | Dos pizzas idénticas agregadas desde la ficha y desde la hoja quedan en 2 líneas con cantidad 1 (no se unen). No rompe el total | `/cart` 390 |
| H7 | Info | PRO | Título de pestaña «Super Dúo \| Papa Johns» (el resto «\| Papa Johns Chile») | título de `/promos/super-duo` |

## Observaciones fuera de la lista

- El aviso de agregado a 1440 tapa el título y el precio de la ficha mientras dura (esperado de un toast).
- Super Dúo, Papa Flash y Pizza del Mes muestran preselección clara; la hoja Hazlo combo copia exactamente la configuración de la pizza agregada.

## Ruido de automatización

- Al hacer clic en dos extras de Arma tu pizza en el mismo ciclo de JavaScript (dos `click()` seguidos sin espera) solo se registró el segundo; repetido con 700 ms de pausa, registró ambos. Es de la herramienta, no del sitio.
- Dev server: puerto 24678 de Vite ya ocupado por otro proceso (origen del error de WebSocket en consola).

## No cubierto

- Contraste medido en las fichas (solo a ojo); 2.º postre/bebida sin foto abierta (solo texto).
- Panel «Tu pedido» para Papa Flash y para Hazlo combo; «Hazlo combo» en 1440.
- Lectura directa de `productTotal` de SCAPI (cabecera `Authorization`).
- Editar a 1440; modalidad delivery a 1440; Safari iOS.

## Cambios hechos en el ambiente

- Solo carritos de invitado (3 contextos aislados). Sin pedidos ni escrituras en el sandbox.
- Servidor `pnpm dev --port 5187` detenido al terminar; páginas de prueba cerradas.

## Capturas

