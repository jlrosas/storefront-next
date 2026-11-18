# VAL-PRO · Validación PRO-01 a PRO-05

Entorno: Storefront Next local (rama hu/PRO, puerto 5176, servidor propio), usuario val2@demo.pj.cl, retiro en pj-48 (El Bosque) por cookie pj_fulfillment. Navegador headless-3. Viewports 390x844 (mobile emulado, principal) y 1440x900 (flujo feliz).
Carrito vaciado al terminar (Vaciar carrito (0)).

## Veredicto
| Historia | Veredicto |
|---|---|
| PRO-01 | RECHAZADA |
| PRO-02 | RECHAZADA |
| PRO-03 | APROBADA con observaciones (LCP no medido) |
| PRO-04 | RECHAZADA |
| PRO-05 | APROBADA |

## PRO-01
| Criterio | Res. | Evidencia |
|---|---|---|
| 1 Hoja con foto grande, texto, ★ | ✅ | VAL-PRO-01-hoja-390.png / -1440.png. Pollo BBQ muestra ★ 4,7 · 1.240 opiniones |
| 2 Preselección Familiar + Tradicional, agrega con un toque | ✅ | Resumen «Familiar · Tradicional», botón $16.900 |
| 3 Variantes reales; borde de queso con recargo | ⚠️ | Sheet: +$3.490; armador: +$2.790. Inconsistente entre pantallas |
| 4 Base con foto y quitar sin cambiar precio; extras con foto y precio | ✅ | Quitar cebolla: $16.900 se mantiene, chip «Sin cebolla». Extras $1.940 con foto (VAL-PRO-01-ingredientes-390.png) |
| 5 Total en vivo y «Ganas N Papa Puntos» | ✅ | (16.900+3.490+1.940)×2 = $44.660, puntos 44 |
| 6 Champiñón agotado con sustituto | ✅ | «Agotado hoy en El Bosque · prueba el choclo», botón deshabilitado. Texto distinto al criterio («Agotado en El Bosque») |
| 7 Línea con opciones y c_pjRemoved; AddedToast con puntos y «Deshacer»; contador salta | ⚠️ | Toast «+44 Papa Puntos por acreditar», Deshacer devolvió el carrito de 3 a 2, contador 2. En 390 el toast se sale por la derecha («Ver mi pe…», VAL-PRO-02-combo-390.png). En el carrito la línea solo muestra Tamaño y Masa: no aparecen sin cebolla ni extras |
| 8 Sin tienda pasa por TIE | 🚫 | TIE en otra rama. Sin cookie de tienda el botón no abre la hoja |
| 390 / 1440 | ✅ | Hoja 480 px a la derecha en desktop (VAL-PRO-01-hoja-1440.png) |
| Áreas táctiles ≥ 44 | ✅ | Ningún control < 44 px en la hoja |
| Contraste | ✅ | Mín. 6,35:1 en textos medidos; «Agotado» 7,5:1 |

## PRO-02
| Criterio | Res. | Evidencia |
|---|---|---|
| 1 Confirmación solo tras la primera pizza, con «Editar» | ✅ | «Pollo BBQ agregada · Familiar · Borde de queso… · sin cebolla · + pepperoni» + Editar. El toast la tapa los primeros segundos |
| 2 Oferta Palitos+Coca-Cola +$6.990, Ahorras $2.490, sabores, botón rojo | ❌ | Precio, ahorro y botón rojo ok. Los sabores (Original, Sin azúcar, Light) solo aparecen tras pulsar «Sí, hazlo combo» (hazlo-combo-step.tsx: `combo &&`); el lienzo los muestra siempre |
| 3 «O agrega por separado» con 3 ítems y «+» | ✅ | Cheesyqueños, Chicken Poppers, Brownie |
| 4 Pie «Ver pedido (N) · total» y «No, gracias…» | ✅ | «Ver pedido (2) $44.660» |
| 5 No reaparece con la segunda pizza | ✅ | Italiana: sin hoja, solo toast. Tampoco en ficha |

## PRO-03
| Criterio | Res. | Evidencia |
|---|---|---|
| 1 Orden: foto con lupa y pausa → nombre → ★ → descripción → destacados → configurador | ✅ | VAL-PRO-03-ficha-top-390.png. Lupa abre diálogo y cierra; «Pausar movimiento» (animación pj-ken-burns). Precio solo en tamaños y barra |
| 2 Prueba social | ✅ | «Pedida 320 veces», distribución 78/15/4/2/1, 2 opiniones «Compra verificada». Sin «Datos de ejemplo» |
| 3 Configurador igual al de la hoja | ✅ | Mismo flujo; agotado «Champiñon · agotado» con aviso |
| 4 «Completa tu pedido» con un botón | ✅ | Palitos marcado, barra «Agregar pizza + 1 $22.890», carrito 2→4 |
| 5 FAQ; nutricional oculta | ✅ | 3 preguntas; sin tabla nutricional |
| 6 Barra fija; 2 columnas en escritorio | ⚠️ | Barra fija en mobile ok. Desktop: 2 columnas ok (VAL-PRO-03-ficha-1440.png); el botón queda en la columna derecha, sin barra inferior fija |
| 7 Al agregar: aviso, puntos, Deshacer, «Ver mi pedido» | ⚠️ | Botón pasa a «Ver mi pedido $22.890»; toast cortado a la derecha en 390 (VAL-PRO-03-agregado-390.png). La animación de vuelo no se verificó |
| 8 URL y SEO | ✅ | title «Pollo BBQ \| Papa Johns Chile», meta description, canonical |
| 9 LCP ≤ 2,5 s | 🚫 | No medido (no se corrió Lighthouse). Foto con loading=eager y fetchpriority=high |

## PRO-04
| Criterio | Res. | Evidencia |
|---|---|---|
| 1 Pizza dividida; tamaño y masa; grilla con 16 especialidades con foto | ✅ | VAL-PRO-04-armador-390.png (16 tarjetas) |
| 2 «Pagas el promedio»; Pollo BBQ + Todas las Carnes = $17.900 | ⚠️ | Texto explicativo presente, pero muestra $16.900 y $18.900 sin total. Línea de carrito $12.400. Pendiente de switch de hooks |
| 3 Precarga | ✅ | `?primera=…&segunda=…` marca ambas. Falta probar «½ Mitad» desde el menú real (solo vía /pro-demo) |
| 4 Línea del carrito: foto dividida, «½ Pollo BBQ · ½ Todas las Carnes», «Editar mitades» | ❌ | En /cart (VAL-PRO-04-carrito-390.png): título «Pizza mitad y mitad Familiar Tradicional», foto única, sin «½ …», «Editar» abre un diálogo genérico en inglés. Solo en /pro-demo aparece «Editar mitades» (va a /mitades?item=…, marcado Pollo BBQ/Todas las Carnes) |
| Puntos | ⚠️ | «+12 Papa Puntos» para la mitad y mitad, no coherente con ~17 |

## PRO-05
| Criterio | Res. | Evidencia |
|---|---|---|
| 1 Modo edición con itemId: todo marcado, «Guardar cambios» actualiza la misma línea | ✅ | Edición desde /pro-demo: marcados Familiar, Borde, sin cebolla, pepperoni, cant. 2. Agregué choclo y guardé: sigue 1 línea (cant. 2). Mitades: guardar con Italiana mantuvo 5 artículos |
| Nota | ⚠️ | En /cart la línea quedó a $20.390 c/u (16.900+3.490); no incluye pepperoni ni choclo (hoja decía $22.330+) |

## Diferencias con el lienzo
1. Combo: sabores de bebida solo tras «Sí, hazlo combo» (lienzo: siempre visibles).
2. Toast de agregado se sale del ancho en 390 y trunca el título y los puntos; tapa la confirmación de la hoja.
3. Descripción de Pollo BBQ: «…salsa BBQ ahumada.» (lienzo añade «con cebolla y mozzarella que se estira»).
4. Hoja con ingredientes extra adicionales (Piña, «Ver 15 ingredientes más»); lienzo trae 5.
5. «Champiñon» sin tilde en la «ó» en la hoja y la ficha; fotos de Champiñón y Cebolla son marcadores grises.
6. Borde de queso: +$3.490 (hoja/ficha, como el lienzo) vs +$2.790 (armador y hoja «Arma tu pizza»).
7. Al hacer scroll en la hoja en 390, el botón de cerrar se superpone al precio del recargo («+$3.490»).
8. Línea de mitades en carrito sin el formato de Pedido-Mitades.
9. Cart: línea de pizza no lista los ingredientes quitados ni los extras.

## Consola y red
- Errores: websocket HMR de Vite (ws://localhost:24678, 400): ruido de dev. Dos avisos de hidratación por `nonce` ("" vs valor) en link crítico y en JSON-LD de la ficha (no afectaron el flujo; origen sin comparar contra base).
- Aviso: preload de la foto no usado a tiempo.

## Pendiente de switch (no cuenta como fallo)
Precio de mitades ($17.900) y extra por tamaño en Mediana/Extra grande.

## Ruido de automatización y No cubierto
- Cookies: no hay CDP; el Chrome era nuevo (about:blank, sin sesión). Cookie de tienda puesta por document.cookie.
- Botón de login rotulado «Registrarse» (observación fuera de lista; fuera de PRO).
- No cubierto: LCP Lighthouse, desktop de combo/toast/armador visual, vuelo de la pizza al carrito, panel TIE, comparación visual píxel a píxel con el lienzo (solo texto/estructura).

---

## Revalidación (R2) — commit ec160dd

Entorno: localhost:5176 (servidor propio de VAL), rama hu/PRO, mobile 390x844 emulado, `val2@demo.pj.cl`, sesión aislada; carrito vaciado en /pro-demo al inicio y al final. Segunda sesión anónima y sin tienda para repetir el flujo desde la hoja.

| # | Verificación | Res. | Evidencia |
|---|---|---|---|
| 1a | Aviso «¡Agregada!» completo dentro de 390, con «Deshacer» y «Ver mi pedido» | ✅ | `VAL-PRO-R2-combo.png`: ancho 38–886/924 (dentro), título, puntos y ambos botones visibles. En la ficha se capturó a mitad de animación (translúcido sobre el header, `VAL-PRO-R2-post-confirmar.png`); en estado estable ya no está (`VAL-PRO-R2-estado-estable.png`) |
| 1b | El aviso no tapa la confirmación de «Hazlo combo» | ❌ | `VAL-PRO-R2-combo-hoja.png`: el aviso cubre la franja «Pollo BBQ agregada · Familiar · Tradicional · Editar» (texto en y≈92–115 px; el aviso llega a ≈131 px) mientras dura (unos segundos). Sí deja visibles sabores y «Sí, hazlo combo». Es mejor que en R1 (ya no trunca ni se sale), pero sigue montado sobre la cabecera de la hoja |
| 2a | Sin tienda, en la ficha, «Agregar» abre el panel con «Confirmar y agregar $…» | ✅ | Panel «¿Cómo lo quieres?», botón «Confirmar y agregar $16.900» (`VAL-PRO-R2-panel-tienda.png`) |
| 2b | Confirmar: retiro en El Bosque, se agrega con lo elegido | ✅ | Preseleccionados Retiro y El Bosque; cabecera «Retiro · 15 min El Bosque»; carrito 1; línea «Pollo BBQ Familiar Tradicional» |
| 2c | Después sigue a «Hazlo combo» | ⚠️ | En la **ficha** no: agrega directo (la ficha usa «Completa tu pedido» en línea; el código de pizza-pdp.tsx no monta HazloCombo). Desde la **hoja** (/pro-demo, sin tienda): Agregar → panel → Confirmar → «Hazlo combo» ✅. Con el carrito ya con una pizza, la hoja tampoco ofrece combo (`pizzaLineCount === 1`, por diseño) |
| 3 | Sabores Original / Sin azúcar / Light visibles antes de aceptar y el elegido es el que se agrega | ✅ | Visibles antes de «Sí, hazlo combo» (Sin azúcar por defecto). Elegí Light: «Combo agregado», y en /cart la línea es «COCA-COLA LIGHT 1.5 LT» |
| 4 | Botón de cerrar de la hoja no tapa precios al hacer scroll (390) | ✅ | El «Cerrar» queda sobre la foto y sale con el scroll; en 6 posiciones (0–839 px) ningún precio se solapó (medido por rectángulos); `VAL-PRO-R2-hoja-scroll.png` |
| 5 | Borde de queso: recargo del catálogo por pizza | ✅ | Pollo BBQ +$3.490 (ficha y hoja), Italiana +$3.790 (hoja), armador +$2.790 |
| 6a | Armador con precarga Pollo BBQ + Todas las Carnes | ✅ | Mitad izquierda Pollo BBQ, derecha Todas las Carnes, «Pagas el promedio… $16.900 y $18.900» (`VAL-PRO-R2-armador.png`) |
| 6b | Se puede agregar | ✅ | Carrito 1; abre «Hazlo combo» con «Pizza mitad y mitad agregada · ½ Pollo BBQ · ½ Todas las Carnes» |
| 6c | «Editar mitades» desde /pro-demo actualiza la misma línea | ✅ | `/mitades?item=…`, cambié la derecha a Italiana, «Guardar cambios» → /cart con 1 artículo (misma línea, no duplicó) |

Hallazgos de R2
- Aviso «¡Agregada!» sobre la cabecera de la hoja «Hazlo combo» (1b), mientras está visible.
- La ficha no lleva a «Hazlo combo» (2c): decidir si el criterio aplica a la ficha o solo a la hoja.
- Observación (CAR, no cuenta): /cart rotula «DESPACHO A DOMICILIO / Delivery» aunque la tienda es Retiro en El Bosque.
- Consola: solo websocket HMR de Vite (ruido de dev) y el aviso de hidratación por `nonce` ya conocido de R1.

No cubierto: desktop, comparación con el lienzo píxel a píxel, vuelo de la pizza, tiempo exacto de vida del aviso.
Ruido de automatización: un `evaluate_script` fue bloqueado por el clasificador por leer cookies (no se reintentó por esa vía); clics por script sobre botones de la hoja.
