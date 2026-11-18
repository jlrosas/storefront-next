# REV · Revisión de historias antes de construir (oleadas 0 a 3)

- **Fecha:** 06-nov-2026 · **Revisor:** REV (modo A) · **Demo:** viernes 20-nov-2026
- **Alcance:** las 57 historias de `demo/historias/` (INT, DAT, HOM, MEN, PRO, OFE, TIE, CAR, ING, CHK, SEG, CTA, PAN).
- **Contra qué:**
  - Los objetivos de `historias/README.md`.
  - `CONTRATO.md` y `EQUIPO.md`.
  - Los diseños 01–12 y R1–R6.
  - Las revisiones UX v2 y kit v2 (sus decisiones no se reabren).
  - El HTML de cada pantalla de `disenos/_canvas/` (respaldo idéntico al lienzo publicado): textos, orden, precios, props y estados.
- **Contexto respetado:**
  - Solo B2C Commerce con Storefront Next.
  - Clientes registrados.
  - Fotos de papajohns.cl.
  - Prioridad: el hambre y la compra.
  - Objetivo: que Papa Johns vea un buen partner, no cumplir todo el kit.

## 1. Veredicto general

Las historias cubren los tres guiones y casi todo el lienzo. Se pueden lanzar las oleadas 0 y 1 después de ajustar los criterios. Antes de la oleada 2 hay que resolver tres cosas:

- **Los números de Sofía no cuadran.** El canje y el descuento por BIN contradicen los «23 puntos» y los «363».
- **El recorrido de Sofía es distinto al del lienzo.** El lienzo va de «Repetir» directo al checkout, con el canje ahí.
- **Quedan textos que prometen SMS, correo o invitado.** La demo sin Marketing Cloud no los cumple.

**Conteo: ✅ 22 · ⚠️ 35 · ❌ 0.** Ninguna historia queda fuera de objetivo, pero hay 7 criterios para sacar (§4).

## 2. Hallazgos transversales (afectan a varias historias)

| # | Hallazgo | Evidencia en el lienzo | Impacto en Papa Johns | Historias |
|---|---|---|---|---|
| T1 | **Los puntos de Sofía no cuadran en el guion «paga con canje».** El checkout móvil de Sofía aplica el BIN por defecto, y el canje deja el saldo en 80. Aun así, la confirmación y la Home «después» dicen +23 y 363. | `Checkout.dc.html` (cliente=sofia): `binOn = isSofia && method === 'mp'`, y −20% sobre $23.890 da −$4.778, total **$19.112**, **19 puntos**. «Canjeaste 260 puntos. Te quedan 80» (`Puntos-Canje`). `Confirmacion.dc.html`: «quedarás con (340 + earned)» = 363. `Home.dc.html` (después): «Ahora tienes 363 ($18.150)». `Checkout-Desktop-Sofia` sin BIN: $23.890 | Alguien de Papa Johns que siga la cuenta (340 − 260 + 23 = 103, no 363) pierde la confianza justo en el programa de puntos, que es su principal herramienta de recompra | HOM-05, HOM-06, CHK-03, CHK-05, SEG-01, CTA-03, DAT-07, DAT-08 |
| T2 | **Textos que la demo no cumple** sin Marketing Cloud ni invitado | Lo que dicen las pantallas: <ul><li>«Te avisamos por SMS en cada paso. El enlace para seguirlo también llegó a tu correo» (`Checkout`, al aprobar el pago).</li><li>«Te avisamos por SMS al +56 9 8765 4321 cuando esté listo» (`Confirmacion`).</li><li>«Te enviamos el recordatorio por SMS o correo» (`Confirmacion`).</li><li>«Te lo enviamos por SMS al +56 9 8765 4321» (`Login`, aunque S-D7 puede dejar el código solo en el panel).</li><li>«Sigues tu pedido en vivo, sin crear cuenta» (beneficios en `Home`).</li><li>«Seguir sin cuenta» y «Pagar como invitada con mi pedido» (`Login`).</li><li>La pregunta «¿Gano puntos si pido como invitado?» (`Puntos`).</li></ul> | El objetivo 2 pide «sin promesas falsas». Si el presentador dice «les llegó el SMS» y no llega nada, o alguien toca «Seguir sin cuenta» y no pasa nada, la demo parece una maqueta | CHK-05, SEG-01, ING-01, HOM-01, CTA-02 |
| T3 | **Criterios con textos parafraseados.** VAL compara textos exactos («mismos textos»), así que va a rechazar o aprobar según qué fuente lea | Ejemplos: <ul><li>«Qué bueno verte de nuevo» frente a «**Hola de nuevo.** Tu pedido de vuelta suma Papa Puntos dobles».</li><li>«Más pedidas» frente a «Más vendidas».</li><li>«Para agregar tu Pollo BBQ, dinos cómo lo quieres» frente a «¿Cómo lo quieres?» + «Para agregar tu Pollo BBQ Familiar. Lo recordamos para la próxima».</li><li>«Lo sentimos, te contactaremos» frente a «Lo sentimos. Te contactamos hoy para resolverlo».</li></ul> | Retrabajo de VAL y de los constructores en una semana corta | HOM-01, HOM-05, HOM-06, MEN-01, PRO-01, TIE-01, TIE-03, SEG-03, CTA-02, CHK-01 |
| T4 | **Los datos de Sofía del contrato no son los del lienzo** | <ul><li>Tarjeta: el contrato dice «•••• 4242» y el lienzo «Visa ····4521» (`Home`, `Checkout`, `Cuenta`, `Confirmacion`).</li><li>Dirección: el contrato dice «depto. 502» y el lienzo «depto 504» (`Checkout`, `Confirmacion`, `Cuenta`).</li><li>Último pedido: el contrato dice «Pollo BBQ Familiar + Palitos de Ajo + Coca-Cola 1,5 L»; el lienzo dice «Pollo BBQ Familiar **sin cebolla** y **Combo** Palitos de Ajo con Coca-Cola **Sin azúcar** 1,5 L · 2 oct». Solo con el combo da $23.890.</li></ul> | Sofía «la clienta que conocemos» se contradice entre la Home y la cuenta | DAT-07, HOM-03, CHK-03, CTA-01 |
| T5 | **Dos historias son dueñas de la misma pantalla** | <ul><li>`Confirmacion*`: CHK-05 (estados, favorito, recordatorio, delivery, escritorio) y SEG-01 (estados, escritorio).</li><li>La opinión «¿Qué tal tu…?»: HOM-06 y SEG-03.</li></ul> | Conflictos en el mismo archivo en las oleadas 2 y 3, o la pantalla hecha dos veces | CHK-05, SEG-01, HOM-06, SEG-03 |

## 3. Tabla por historia

### INT · Integrador

| ID | Estado | Qué cambiar (con cita) |
|---|---|---|
| INT-01 | ✅ | Los tokens coinciden con el lienzo (`#FFFBF5`, `#1E4D33`, `#D7EA4A`, `#B3261E`, `#1B1D1A`, `#5A5F57`, estrella `#8F5400`) |
| INT-02 | ⚠️ | <ul><li>El encabezado de escritorio del lienzo trae también «Locales» y, en `Home-Desktop`, «Sigue tu pedido». Hay que decidir: «Locales» abre el `store-locator` del template; «Sigue tu pedido» abre el seguimiento si hay sesión, si no se oculta (el invitado está fuera).</li><li>El footer del lienzo es «Locales · Preguntas frecuentes · Bases legales de promociones», sin redes. El criterio 4 inventa «redes de Chile».</li><li>Agregar el estado del encabezado sin modalidad: «Retiro o delivery / Elige cómo lo quieres».</li></ul> |
| INT-03 | ✅ | — (nota: `PLAN.md` todavía dice «una extensión `papajohns-demo`»; manda `EQUIPO.md`) |
| INT-04 | ✅ | `AddedToast` existe en dos variantes en el lienzo: con puntos y «Deshacer» (`PDP-*`), y simple «Coca-Cola 1,5 L agregada · $26.380 · Ver pedido» (`Simple-Add`). Que la pieza acepte las dos |
| INT-05 | ✅ | — |

### DAT · Datos y Commerce

| ID | Estado | Qué cambiar |
|---|---|---|
| DAT-01 | ⚠️ | Criterio 3 (borrar `ZZ_PRUEBA_DELIVERY_TRAMOS` y la librería huérfana) **no suma a la demo** y es destructivo en el único sandbox. Pasarlo a después del 20-nov o pedir confirmación de Raúl |
| DAT-02 | ⚠️ | <ul><li>Los textos sensoriales no están en `Menu.dc.html` (móvil), sí en `Menu-Desktop.dc.html` («Pollo jugoso y tocino sobre BBQ ahumada.»). En `PDP-*` y `Sheet-Pizza` hay otra versión larga. Definir que `c_pjSensory` = texto corto de `Menu-Desktop` y la descripción larga = `PDP-Mobile`.</li><li>Insignias: el lienzo usa «Más vendida» (menú y ficha), «Más pedida», «Ideal para 2» y «Para los con hambre» (`Home`). No aparece «Novedad». Alinear `c_pjBadges` con el lienzo o decidir un solo nombre.</li></ul> |
| DAT-03 | ✅ | — |
| DAT-04 | ✅ | — |
| DAT-05 | ⚠️ | <ul><li>Criterio 3, «El Super Dúo es solo retiro», contradice el lienzo: `Ofertas` y `Ofertas-Desktop` dicen «Retiro y delivery» para el Super Dúo. El caso 2 es un **caso sorpresa que activa el panel** (`Panel-Demo`: «Casos sorpresa · 2 · Promoción no disponible»). Si queda fijo, Diego no puede pedir delivery y la promesa del anuncio se rompe. Debe ser un calificador **activable** (ver DAT-10 y PAN-01).</li><li>`cb-papa-combo-palitos` necesita casillas de acompañamiento y bebida que el lienzo no dibuja (ver OFE-02).</li><li>`cb-papa-flash` no tiene constructor ni destino en el lienzo (`href: '#'`): definir qué hace «Para 1» y «Almuerzo».</li></ul> |
| DAT-06 | ✅ | — |
| DAT-07 | ⚠️ | Cargar a Sofía **igual que el lienzo** (T4): <ul><li>Último pedido PJ-47110 del 2-oct: Pollo BBQ Familiar Tradicional sin cebolla + Combo Palitos con Coca-Cola Sin azúcar 1,5 L = $23.890.</li><li>Pedidos del 18-sep ($31.480, Super Dúo) y del 4-sep ($17.900, mitades + Boom de Jamón con puntos) (`Cuenta`).</li><li>Movimientos +23 / +31 / −218 / +24 (`Puntos-Cuenta`).</li><li>Favoritas Pollo BBQ, Todas las Carnes y Hawaiana con «La pediste 6/3/2 veces» (`Home`).</li><li>Factura «Comercial Andes SpA · RUT 76.123.456-7» (`Cuenta`).</li><li>Tarjeta y depto según la decisión D7.</li></ul> |
| DAT-08 | ✅ | El BIN funciona, pero su efecto en el guion de Sofía es la decisión D6 |
| DAT-09 | ⚠️ | Faltan atributos del pedido que piden otras historias: <ul><li>La nota de opinión: SEG-03 usa `c_pjRating`, que en el contrato §4.1 es un atributo **de producto**. Proponer `c_pjOrderRating`.</li><li>La preferencia «¿Te lo recordamos el viernes?» (CHK-05, HOM-05).</li></ul> Agregarlos al contrato §4.4 |
| DAT-10 | ⚠️ | Agregar el script y la ruta para activar o desactivar el calificador «solo retiro» del Super Dúo (caso 2). El contrato §4.6 solo tiene `order-status`, `points` y `store-closed` |

### HOM · Home

| ID | Estado | Qué cambiar |
|---|---|---|
| HOM-01 | ⚠️ | <ul><li>**S-D1** (decisión D1).</li><li>Saludo: el lienzo dice «**Hola de nuevo.** Tu pedido de vuelta suma Papa Puntos dobles» y lo pone **como primera línea, bajo el encabezado y sobre el hero** (`Home.dc.html`, `Home-Desktop.dc.html`; 01 v2: «el saludo pasa a una línea bajo el encabezado»). El criterio 2 cambia el texto y el lugar.</li><li>El lienzo ya tiene un bloque «Pizza del mes» (Boom de Jamón $10.990) **entre «Empieza tu pedido» y «Las más pedidas»**. Si la Pizza del Mes pasa al hero, ese bloque se duplica, y la historia no dice qué va en su lugar.</li><li>Escritorio: el lienzo suma «Menú» y «Promos» a los accesos y «Ver todo el menú» en el hero.</li><li>Insignias: «Para los con hambre», no «Novedad» (DAT-02).</li><li>Beneficio «Sigues tu pedido en vivo, sin crear cuenta» (T2): cambiarlo por uno que la demo cumpla.</li></ul> |
| HOM-02 | ⚠️ | <ul><li>**S-D2** (decisión D2): el lienzo dice Partido = **Super Trío** $33.900 («Para ver el partido»; también en `Panel-Demo` y en 01 v4). El contrato lo cambia a Super Dúo, que repetiría el hero y la tarjeta «Para 4», justo lo que corrigió UX v2 (hallazgo 3).</li><li>«Promos del día» (criterio 4) **no está en el lienzo** (`Home-Diego` y `Home-Desktop-Diego` cierran con «Más vendidos»). Sacarlo.</li><li>Incoherencia del lienzo: el hero dice «Alcanza para 6» y el carrusel pone el Super Dúo en «Para 4» (D8).</li><li>Definir el destino de «Para 3 · Pizza del mes + Palitos + bebida $20.470» (en el lienzo va a `Ofertas`) y de «Para 1 / Papa Flash».</li></ul> |
| HOM-03 | ⚠️ | <ul><li>«Repetir pedido $23.890» va **directo al checkout** en el lienzo (`href="Checkout-Sofia.dc.html"`, también en escritorio y en `Cuenta`). El criterio 2 lo manda a «Mi pedido»: agrega un paso y contradice «un toque» (principio 2) y «Sofía en < 1 min» (decisión D5).</li><li>Textos del hero: «¿Lo de siempre? · Tu último pedido, 2 oct», «Pollo BBQ Familiar sin cebolla y Combo Palitos de Ajo con Coca-Cola Sin azúcar 1,5 L», «Retiro en El Bosque · listo en 15 min · Mercado Pago, Visa ····4521».</li><li>En el encabezado dice «340 Papa Puntos»; el «= $17.000» va en el bloque de canje («Tienes 340 puntos ($17.000) · la canjeas con 260»).</li></ul> |
| HOM-04 | ✅ | Sirve a «administrable» (principio 8) |
| HOM-05 | ⚠️ | <ul><li>El texto del lienzo es «**+23 Papa Puntos** se suman cuando retires. Quedarás con 363.» y «¿Te lo recordamos el viernes a las 20:00?». «Quedarás con 363» depende de D6 (T1).</li><li>El lienzo mantiene también el canje y «Para tu viernes · Pizza del mes» bajo las favoritas.</li></ul> |
| HOM-06 | ⚠️ | <ul><li>363 depende de D6.</li><li>La próxima acción del lienzo es «Elegida para ti · la próxima / Tu Pollo BBQ, ahora mitad y mitad con Todas las Carnes / Pediste las dos este año. Familiar $17.900, pagas el promedio» con el botón «Armarla», no «La próxima, prueba…».</li><li>Agregar «Retirado hoy a las 20:44».</li><li>La opinión está duplicada con SEG-03 (T5): HOM la muestra y SEG la guarda.</li></ul> |

### MEN · Menú

| ID | Estado | Qué cambiar |
|---|---|---|
| MEN-01 | ⚠️ | <ul><li>Filtros: en el lienzo son «Más vendidas», «Todas (24)», «Vegetarianas» y «Picantes». En móvil el filtro por defecto es **Más vendidas** y en escritorio «Todas».</li><li>Ofertas: en móvil son 3 tarjetas y «Ver las 16»; en escritorio, «Ofertas de hoy», 4 tarjetas y «Ver las 16 ofertas». «Según el perfil» no está en el lienzo.</li><li>El criterio 6 pide ★ en las tarjetas de pizza, pero el lienzo no las tiene (R4.4 sí las pide). Decidir; es barato y suma prueba social.</li><li>**El buscador** («Busca entre 74 productos») no está en ninguna historia (§5).</li><li>«Arma tu pizza · Desde $12.400 en Familiar» no tiene producto en DAT ni historia en PRO (§5).</li></ul> |
| MEN-02 | ✅ | — |
| MEN-03 | ✅ | Agregar «Ganas N Papa Puntos» bajo «Ir a pagar» y el texto vacío «Todavía no agregas nada…» (`Menu-Desktop`) |
| MEN-04 | ✅ | — |

### PRO · Producto

| ID | Estado | Qué cambiar |
|---|---|---|
| PRO-01 | ⚠️ | <ul><li>La hoja del lienzo **no tiene ★**: tiene «Para 3–4 personas · Ganas N Papa Puntos» y la línea de resumen («Familiar · Tradicional · sin cebolla»).</li><li>El texto del agotado es «Agotado hoy en El Bosque · prueba el choclo».</li><li>En el lienzo la Familiar tiene «8 trozos», igual que la Mediana.</li></ul> |
| PRO-02 | ✅ | Agregar «$9.480 por separado» y que el sabor aparezca al tocar «Sí, hazlo combo» (por defecto, Sin azúcar) |
| PRO-03 | ✅ | En el lienzo, «Más vendida · Pedida 320 veces esta semana» va **sobre** el nombre. «Lleva: Queso mozzarella, pollo…» va solo en escritorio |
| PRO-04 | ⚠️ | <ul><li>Criterio 3 (4 partes) es **alcance de más**: el lienzo lo tiene apagado (`permitirCuatro` false) y Chile usa 2.</li><li>El borde de queso cuesta **+$2.790** en `Mitades` y **+$3.490** en `Sheet-Pizza`, `PDP` y `Pedido`. Fijar uno: la variante real.</li><li>«O arma esta parte con tus ingredientes» no tiene historia: ocultarlo.</li></ul> |
| PRO-05 | ✅ | — |

### OFE · Ofertas

| ID | Estado | Qué cambiar |
|---|---|---|
| OFE-01 | ⚠️ | <ul><li>Con S-D1, la lista móvil y la **oferta destacada de escritorio** (Box Halloween, «Armar mi box») necesitan reemplazo. La historia no lo dice.</li><li>Todas las tarjetas del lienzo dicen «Retiro y delivery». El criterio 4 aplica solo cuando el panel activa el caso 2 (DAT-05).</li><li>En `Ofertas-Desktop` la Pizza del mes figura «Para 4», y en la Home «Para 3» (D8).</li></ul> |
| OFE-02 | ⚠️ | <ul><li>**S-D3**: el constructor de Papa Combo Palitos (acompañamiento + bebida) no está dibujado; el lienzo solo elige pizzas y deja «Papa Combo Palitos» con `href: '#'`. Es alcance nuevo (decisión D3).</li><li>`PJSD26` debe aplicarse solo con el `utm` del anuncio, no en las tres URL.</li><li>El lienzo abre con «Pizza 1 de 2» ya puesta (Pollo BBQ); confirmar si se replica.</li></ul> |
| OFE-03 | ✅ | Los textos coinciden con `Combo-NoDisponible` |
| OFE-04 | ⚠️ | <ul><li>**S-D1** (decisión D1): la pantalla del lienzo es la del **Día de la Pizza, «Terminó el 9 de febrero»** (UX v2, hallazgo 1, resuelto así), con H1 «Esta oferta ya terminó». Su primera alternativa es el **Box Halloween**, que ahora sería la vencida.</li><li>Definir las 3 alternativas vigentes («la más parecida» no está definida).</li><li>`Panel-Demo` ya usa `/promos/box-halloween`.</li></ul> |

### TIE · Tienda y modalidad

| ID | Estado | Qué cambiar |
|---|---|---|
| TIE-01 | ⚠️ | <ul><li>**S-D10** (decisión D4): el lienzo muestra tres segmentos (Retiro · Delivery · Comer aquí).</li><li>Textos del lienzo: «¿Cómo lo quieres?», «Para agregar tu Pollo BBQ Familiar. Lo recordamos para la próxima.», «Cerrada · abre mañana 12:00», «Solo programado» y el aviso «Providencia está cerrada ahora (abre mañana a las 12:00). Tu pedido no se pierde: elige otra opción.»</li><li>El botón es «Confirmar y agregar $16.900».</li></ul> |
| TIE-02 | ✅ | El respaldo sin Google (criterio 4) es un buen seguro para la demo |
| TIE-03 | ⚠️ | <ul><li>El chip del lienzo tiene dos líneas: «Retiro · listo en 15 min» / «El Bosque». Sin elección: «Retiro o delivery» / «Elige cómo lo quieres».</li><li>Criterio 2b («si un producto no está en la nueva tienda, se avisa en el carrito») es un estado de borde sin pantalla: va al proyecto.</li></ul> |

### CAR · Carrito

| ID | Estado | Qué cambiar |
|---|---|---|
| CAR-01 | ⚠️ | <ul><li>El lienzo tiene **contador − N + por línea**, «Cambiar bebida» en la línea del combo, y las filas «Ahorro por combo −$2.490» y «Retiro en tienda · Gratis».</li><li>En móvil no hay «Seguir viendo el menú» (sí en escritorio).</li><li>En escritorio está la nota «340 Papa Puntos. Canjea una Super Pepperoni mediana gratis al pagar».</li></ul> |
| CAR-02 | ✅ | El botón móvil dice «Convertir en combo»; el de escritorio, «Convertir» |
| CAR-03 | ⚠️ | <ul><li>La línea (b), «Por $1.500 más agrega una bebida 1,5 L», **contradice el precio del lienzo**: la Coca-Cola 1,5 L cuesta $3.490 (`Menu`, `Simple-Add`). Además es una segunda oferta en el carrito, y la regla 1 de 06 es «una sola oferta».</li><li>Ninguna línea de umbral aparece en `Pedido.dc.html`.</li><li>Dejar solo (a), el mínimo de delivery, que sí ayuda a Diego.</li></ul> |
| CAR-04 | ⚠️ | <ul><li>En el lienzo el canje **agrega** una Super Pepperoni mediana nueva: «Suma una Super Pepperoni mediana gratis por 260 puntos» + «Canjear», la línea queda en «$0» con «$13.000» tachado, y aparece «Canjeaste 260 puntos. Te quedan 80.» con «Deshacer». No convierte una pizza que ya está.</li><li>El canje **también está en el checkout** (CHK-03, D5).</li><li>El criterio 4 (tope de 5.000 por día) no se ve ni se puede probar con 340 puntos: es alcance de más.</li></ul> |

### ING · Ingreso

| ID | Estado | Qué cambiar |
|---|---|---|
| ING-01 | ⚠️ | <ul><li>Si S-D7 deja el código solo en el panel, «Te lo enviamos por SMS al +56 9 8765 4321» es falso (T2). El texto debe seguir al canal real.</li><li>«Seguir sin cuenta» y «Pagar como invitada con mi pedido» llevan a `Checkout-Invitado` (fuera): decidir si se ocultan o quedan como texto (D9).</li><li>El paso 3 solo está dibujado para Valentina. Falta el texto de Diego (0 puntos, sin dobles).</li></ul> |
| ING-02 | ✅ | — |

### CHK · Checkout y confirmación

| ID | Estado | Qué cambiar |
|---|---|---|
| CHK-01 | ⚠️ | <ul><li>Los pasos del lienzo son «1 Tus datos» (con «Cambiar»), «2 ¿Cómo pagas?» y «3 Comprobante».</li><li>Falta el bloque de puntos de Valentina: «Tus Papa Puntos · 40 puntos · Este pedido suma 46: dobles por volver. Quedas con 86. Con 218 canjeas una pizza mediana.»</li><li>En escritorio, «Factura» viene marcada por defecto en el lienzo; confirmar.</li></ul> |
| CHK-02 | ⚠️ | <ul><li>Billetes: el lienzo tiene «Monto exacto · $30.000 · $40.000 · Otro monto». El criterio pone **$20.000**, que no alcanza para el delivery canónico ($25.880).</li><li>**S-D4** (decisión D5b): el lienzo rotula el pago como «Mercado Pago», «Formulario seguro de Mercado Pago» y «Mercado Pago guarda tu tarjeta», pero es una tarjeta simulada.</li><li>«Deshabilitado si la tienda no lo acepta» no tiene pantalla: va al proyecto.</li></ul> |
| CHK-03 | ⚠️ | <ul><li>Tarjeta ····4521 en el lienzo y 4242 en el contrato (T4, D7).</li><li>Con el BIN activo el total de Sofía es $19.112 y gana 19 puntos (T1, D6).</li><li>**Falta el canje en el checkout**: el lienzo lo tiene con «Suma una Super Pepperoni mediana gratis por 260 puntos» + «Canjear»/«Quitar», y es el único lugar donde Sofía puede canjear si «Repetir» va directo al pago (D5).</li></ul> |
| CHK-04 | ⚠️ | El lienzo tiene **dos** desplegables: «¿Tienes un cupón?» y «¿Tienes una Gift Card?», con el mensaje «Gift Card aplicada: −$10.000. El resto ($X) lo pagas con el medio elegido.» |
| CHK-05 | ⚠️ | <ul><li>El aviso del lienzo dice «Ganas N Papa Puntos, se acreditan al recibirlo» y no trae «Cómo llegar» (está en la página de seguimiento).</li><li>Quitar o cambiar «Te avisamos por SMS en cada paso…» y «Te enviamos el recordatorio por SMS o correo» (T2).</li><li>Repartir con SEG-01: CHK hace el aviso de pago aprobado, el favorito y el recordatorio; SEG hace la página de estados (T5).</li></ul> |
| CHK-06 | ✅ | — |

### SEG · Seguimiento

| ID | Estado | Qué cambiar |
|---|---|---|
| SEG-01 | ⚠️ | <ul><li>Se superpone con CHK-05 (T5).</li><li>En retiro, el lienzo termina en «Listo para retirar · 20:45 aprox.» y no dibuja «Retirado». Definir qué ve el cliente cuando PAN-02 marca «retirado» (la Home dice «Retirado hoy a las 20:44»).</li><li>El texto de SMS de la página (T2).</li></ul> |
| SEG-02 | ✅ | — |
| SEG-03 | ⚠️ | <ul><li>Texto del lienzo: «Lo sentimos. Te contactamos hoy para resolverlo.» (`Home`) y «Lo sentimos. Un ejecutivo te contactará hoy…» (`Confirmacion`): unificar en uno.</li><li>En la confirmación la pregunta es «¿Qué tal tu pedido?»; en la Home, «¿Qué tal tu Pollo BBQ?».</li><li>El atributo de la nota (DAT-09).</li><li>Duplicado con HOM-06 (T5).</li></ul> |

### CTA · Cuenta y puntos

| ID | Estado | Qué cambiar |
|---|---|---|
| CTA-01 | ⚠️ | <ul><li>Las filas del lienzo: «Medios de pago · Visa ····4521 guardada en Mercado Pago», «Tiendas y direcciones · Casa: Av. Providencia 1234, depto 504», «Datos de factura · Comercial Andes SpA», «Tus datos y avisos».</li><li>Arriba va «Sesión iniciada con +56 9 7654 3210».</li><li>«Repetir» va al checkout. Datos según DAT-07.</li></ul> |
| CTA-02 | ⚠️ | <ul><li>Son **tres** reglas: Gana · Acumula · Canjea.</li><li>El botón es «Crear mi cuenta».</li><li>Quitar la pregunta «¿Gano puntos si pido como invitado?» (T2).</li></ul> |
| CTA-03 | ⚠️ | <ul><li>«Próximo premio y lo que falta» **no está** en `Puntos-Cuenta`.</li><li>El lienzo tiene «Canjear en mi próximo pedido» por premio, que ninguna historia cubre. Decidir si reserva el canje (atributo) o se quita.</li></ul> |

### PAN · Panel

| ID | Estado | Qué cambiar |
|---|---|---|
| PAN-01 | ⚠️ | <ul><li>El guion del lienzo (Valentina 7, Diego 7, Sofía 6) está hecho **casi entero de eventos de Marketing Cloud y OMS** (M3, M2, M5, M4, M6, «Abrir el pedido en la consola de OMS»). La historia no define los pasos del guion sin ellos. Escribirlos por perfil, por ejemplo Sofía: abrir Home → Repetir → pagar con canje → avanzar a preparación → +15 min → listo → retirado → Home después.</li><li>El caso 2 necesita el interruptor de DAT-10.</li><li>Falta el caso 13, «No llega el código», que ING-01 sí construye.</li></ul> |
| PAN-02 | ✅ | Sugerencia: junto al evento, «(segunda etapa: lo recibe Marketing Cloud)», para no sugerir que hoy se envía |

## 4. Alcance de más (se puede sacar sin perder la demo)

| Qué | Historia | Por qué |
|---|---|---|
| Pizza de 4 partes | PRO-04 crit. 3 | Apagada en el lienzo; Chile usa 2; suma pruebas al hook de precio |
| Tope de 5.000 puntos por día | CAR-04 crit. 4 | Invisible y no se puede probar con 340 puntos |
| «Promos del día» en la Home de Diego | HOM-02 crit. 4 | No está en el lienzo |
| Línea «Por $1.500 más agrega una bebida» | CAR-03 (b) | Precio falso frente a $3.490 y segunda oferta en el carrito |
| Aviso de producto no disponible al cambiar de tienda | TIE-03 crit. 2b | Estado de borde, sin pantalla; va al proyecto |
| Efectivo deshabilitado por tienda con motivo | CHK-02 crit. 2c | Estado de borde, sin pantalla |
| Borrado de datos de prueba en el sandbox | DAT-01 crit. 3 | No suma a la demo y es irreversible |
| Constructor de Papa Combo Palitos | OFE-02 / S-D3 | No está dibujado; solo hace falta si Diego lo usa en el guion (D3) |

## 5. Huecos (el lienzo o los guiones lo piden y nadie lo cubre)

| Hueco | Dónde se ve | Sugerencia |
|---|---|---|
| **Buscador del menú** | `Menu` («Busca entre 74 productos»), `Menu-Desktop`, lupa del encabezado de `Home` | Usar la búsqueda del template (MEN) o quitar la lupa y el campo |
| **«Arma tu pizza» (desde $12.400)** | `Menu`, `Menu-Desktop` | Producto armable en DAT y la hoja de PRO sin ingredientes base, o quitar la tarjeta |
| **Qué pasa con el Halloween en cada lugar** (S-D1) | `Home` (bloque «Pizza del mes» que se repite), `Menu`/`Menu-Desktop` (ofertas), `Ofertas`, `Ofertas-Desktop` (destacada), `Oferta-Vencida` (1.ª alternativa), Celebración de Diego | Una tabla de reemplazos en el contrato, después de D1 |
| **Destino de Papa Flash y de «Para 3»** | `Home-Diego` (Para 1, Para 3, Almuerzo), `Ofertas` (`href: '#'`) | Papa Flash → ficha simple «Agregar»; Para 3 → agrega las 3 líneas al carrito |
| **Pasos del guion del panel sin Marketing Cloud ni OMS** | `Panel-Demo` | En PAN-01 |
| **«Locales»** en el encabezado y el footer | `Home-Desktop`, `Menu-Desktop`, `Ofertas-Desktop` | `store-locator` del template (TIE o INT) |
| **Canje en el checkout** | `Checkout` (sofia), `Checkout-Desktop-Sofia` | En CHK-03 |
| **«Canjear en mi próximo pedido»** | `Puntos-Cuenta` | En CTA-03 o quitarlo |
| **Atributos del pedido para la opinión y el recordatorio** | `Home` (después), `Confirmacion` | En DAT-09 y en el contrato §4.4 |
| **Paso 3 del ingreso para Diego** | `Login` (solo Valentina) | ING-01: «Hola, Diego · este pedido suma N puntos» |
| **Rendimiento** (principio 7) | — | Solo está en PLAN D5.2: agregar el LCP del hero a HOM-01 y PRO-03 como criterio |
| **Interruptor del caso 2** | `Panel-Demo` | DAT-10 + PAN-01 |

## 6. Decisiones para Raúl (supuestos que se apartan del lienzo; REV no los aprueba)

| ID | Supuesto | Qué cambia frente al lienzo | Opciones | Qué pesa para Papa Johns |
|---|---|---|---|---|
| **D1** | **S-D1 · Halloween vencido → Pizza del Mes en el hero; Box Halloween como oferta vencida** | Hay que cambiar el hero de `Home` y `Home-Desktop` y 6 lugares más (§5). Además reabre la solución de UX v2, hallazgo 1 («Día de la Pizza, terminó el 9 de febrero»), en `Oferta-Vencida` | <ul><li>a) Aceptar S-D1 con la tabla de reemplazos.</li><li>b) Otro hero de temporada vigente al 20-nov.</li><li>c) Mantener el Día de la Pizza como vencida y usar la Pizza del Mes solo como hero.</li></ul> | Kit v2 (hallazgo 6) ya pedía cambiar la temporada si la demo era después del 2-nov: es justo «Marketing cambia sin desarrollador». El riesgo es dejar el Halloween vigente en algún rincón |
| **D2** | **S-D2 · Partido = Super Dúo y Celebración = Super Trío** | El lienzo, 01 v4 y el panel dicen Partido = Super Trío y Celebración = Halloween | <ul><li>a) Lienzo: Partido = Trío y Celebración = otro combo vigente.</li><li>b) Contrato: Partido = Dúo, que repite el hero tres veces en la misma Home.</li></ul> | UX v2, hallazgo 3: dos ofertas protagonistas diluyen la del anuncio |
| **D3** | **S-D3 · Constructor de Papa Combo Palitos** | No está dibujado (necesita acompañamiento y bebida) | <ul><li>a) Sacarlo: Papa Combo Palitos abre su ficha.</li><li>b) Diseñarlo antes de la oleada 1.</li></ul> | No está en ningún guion; es tiempo de constructor sin retorno |
| **D4** | **S-D10 · Sin «Comer aquí»** | El lienzo muestra 3 modalidades. Kit v2 marcó K4 «Comedor: Resuelto», y el kit lo pide en el recorrido de Valentina (checklist 01.04 y 02.22) | <ul><li>a) Quitarlo y mencionarlo en la presentación.</li><li>b) Dejar el segmento visible con la lista de comedores, sin flujo.</li></ul> | No suma hambre ni compra; quitarlo baja un ítem del kit que ya se había mostrado como resuelto |
| **D5** | **Recorrido de Sofía** (HOM-03 → «Mi pedido» y canje en el carrito) | El lienzo va de «Repetir» al checkout con el canje dentro (`Home`, `Cuenta`, `Checkout` sofia) | <ul><li>a) Lienzo: «Repetir» → checkout con canje (CHK-03).</li><li>b) Historias: «Repetir» → carrito → canje → checkout (un paso más).</li></ul> | «Sofía en < 1 minuto» es el momento más fuerte frente al kit (kit v2: «la mejor pantalla del lienzo») |
| **D5b** | **S-D4 · Tarjeta simulada con forma de Mercado Pago** | El lienzo rotula «Mercado Pago», «Formulario seguro de Mercado Pago» y «Mercado Pago guarda tu tarjeta» | <ul><li>a) Dejar la marca y decir en voz alta que es simulado.</li><li>b) Rotular «Tarjeta de crédito o débito» y nombrar a Mercado Pago solo en la presentación.</li></ul> | Credibilidad si alguien pregunta «¿esto ya es Mercado Pago?» |
| **D6** | **BIN y canje en el guion de Sofía** | Lienzo móvil: BIN activo ($19.112, 19 puntos). Escritorio y confirmación: $23.890, 23 puntos, «363» aunque canjeó | <ul><li>a) BIN apagado en el guion principal (se muestra aparte) y saldo final 80 + 23 = **103**.</li><li>b) BIN activo: $19.112, 19 puntos, saldo **99**.</li><li>c) Sin canje en el guion: 363.</li></ul> Corregir HOM-05, HOM-06, CHK-05 y CTA-03 con el número elegido | T1: el error se ve en vivo |
| **D7** | **Datos de Sofía:** tarjeta 4242 o 4521, depto 502 o 504, composición del último pedido | Contrato frente al lienzo (T4) | <ul><li>a) Adoptar el lienzo: ····4521 (el BIN 424242 vive en la lista y no depende de los últimos 4), depto 504, «sin cebolla + Combo… Sin azúcar».</li><li>b) Mantener el contrato y aceptar que la demo difiere del lienzo.</li></ul> | Coherencia entre la Home, la cuenta y el checkout |
| **D8** | **«Alcanza para 6» frente a «Para 4»** (Super Dúo) y Pizza del mes «Para 3» o «Para 4» | Incoherencias del propio lienzo (`Home-Diego`, `Panel-Demo` T2, `Ofertas-Desktop`) | Un solo número por oferta (regla 3 de 01: «un solo nombre y un solo precio») | La promesa del anuncio (principio 4) incluye para cuántos alcanza |
| **D9** | **Invitado visible** | `Login`: «Seguir sin cuenta» y «Pagar como invitada con mi pedido» | <ul><li>a) Ocultarlos.</li><li>b) Dejarlos como texto sin enlace (ING-01, criterio 7).</li></ul> | Un toque en vivo que lleva a ninguna parte |
| **D10** | **Super Dúo solo retiro** (DAT-05, crit. 3) | El lienzo lo ofrece en «Retiro y delivery». El caso 2 es sorpresa del panel | <ul><li>a) Calificador activable desde el panel.</li><li>b) Fijo, y Diego compra con retiro.</li></ul> | Si es fijo y Diego elige delivery, la promesa del anuncio falla |
