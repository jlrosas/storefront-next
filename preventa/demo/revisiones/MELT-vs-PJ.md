# MELT-vs-PJ · Por qué la demo de Papa Johns tiene mejor experiencia que Melt

- **Fecha:** 07-nov-2026 · **Autor:** UXD · **Pedido por:** Raúl, para argumentar en la presentación del 20-nov
- **Modo:** revisión comparativa (skill `ux-review`, vertical `qsr-delivery`, Storefront Next). El cliente pidió «que se parezca a Melt»: este documento separa **en qué nos parecemos** (lo que le gusta) y **en qué lo superamos**, siempre por su impacto en el negocio de Papa Johns.
- **Melt, fuentes:** recorrido del 13-oct-2026 en `exploracion.md` §3 y `critica-ux.md` (móvil 390, sesión nueva, sin cuenta), y las capturas de `capturas/raw/melt-*.jpeg`. **No se navegó Melt de nuevo.**
- **PJ, fuentes:** el sitio publicado (`B` = `https://sfnextpiz1af0959c456da71a.zyfj-001.my.commercecloud.salesforce.com/cl/es-CL`) y las revisiones `UX-2`, `VAL-C1`, `AUD-compra`, `EVAL-agregar`, `UX-3`, `VAL-C3`, más `PLAN.md` e `INTEGRACION.md`. Se verificaron con `curl` (6 s entre peticiones) las rutas `/`, `/menu`, `/mitades`, `/cart`, `/login`, `/checkout`, `/account`, `/puntos`, `/search`, `/p/cb-pizza-del-mes` y `/p/cb-super-duo`.
- **KPI del cliente** (kit §09 y volumetría de la preventa): cross-selling de ~25 % a **35 %** de los pedidos; ticket promedio **$15.690**, meta **+5 %**; conversión web **18 %**; view item → add to cart **> 18 %**; add to cart → begin checkout **> 60 %**; begin checkout → purchase **> 70 %**; recompra **> 30 %**; base identificada **> 70 %**; socios Papa Puntos activos **+20 %**; bounce **< 30 %**; carga **< 2,5 s**; tiempo de checkout **< 90 s**.

---

## 1. Resumen ejecutivo

1. **Nos parecemos a Melt en lo que le gusta al cliente:** la vitrina. Foto que llena el ancho, precio grande con el antes tachado y sello de descuento, barra inferior tipo app, ficha con URL propia y barra fija de compra, lista de menú compacta con precio comparable, puntos visibles en el carrito y locales con estado y tiempo.
2. **Lo superamos donde se gana o se pierde la venta, después de la vitrina.** Melt es la mejor vitrina, pero no el mejor motor de pedido (`critica-ux.md`).
3. **La tienda reconoce a quien llega:** Valentina, Diego y Sofía ven otra portada, otra oferta y otro mensaje. En Melt todos ven el mismo «Hit del mes».
4. **La oferta del anuncio abre esa misma pizza, al mismo precio.** Se agrega en un toque, y la tienda se pide sin sacar al cliente de la pizza. Melt pide 3 elecciones obligatorias y, sin tienda, devuelve al cliente a la portada.
5. **La venta cruzada es contextual y muestra el ahorro.** Con «Hazlo combo», la Pollo BBQ de $16.900 pasa a un pedido de $23.890 (+41 %). Melt ofrece un carrusel genérico. Con el configurador completo (mitades con fotos, «sin cebolla», extras) y los Papa Puntos expresados en pesos, la propuesta apunta directo a cross-selling, ticket y recompra.
6. **Con honestidad:** Melt todavía nos gana en dos cosas. Tiene una página de puntos que explica el programa (la nuestra da error) y un checkout coherente. El nuestro es el del template y hoy cobra distinto de lo que muestra el carrito. Las dos cosas se cierran antes del 20-nov o no se muestran (§4 y §5).

---

## 2. Momento por momento

Veredicto: **Ganamos** · **Empate** · **Melt gana** · **Condicionado** (ganamos si se cierra lo indicado en §4).

| Momento | Melt hoy (evidencia) | PJ demo (captura) | Por qué es mejor para el cliente y el negocio | KPI que mueve |
|---|---|---|---|---|
| **Llegar / Home** · Ganamos | Hero con texto real: «Hit del mes · Special Mix $9.990 ~~$16.700~~ -40 %», con pizza a sangre (`melt-portada.jpeg`). Es lo que le gusta al cliente. Pero es **igual para todos**: el botón lleva al listado de promos, no al producto, y allí la misma pizza se llama «Hit del mes» a **$16.790** (`melt-vuelta-portada.jpeg`). Carrusel de 5 *slides*, WhatsApp flotante tapando contenido y home sin `h1` | Mismo patrón de vitrina, con la marca BGYS: foto a sangre, tarjeta crema, sello -50 % y precio display «$10.990 ~~Antes desde $21.900~~» (`HOM-08-valentina-despues-pantalla1-390.png`). **La portada cambia por perfil:** Valentina ve «¡Volviste! Este pedido suma Papa Puntos al doble»; Diego, «La oferta que viste · Super Dúo» con «+100 Papa Puntos» (`HOM-08-diego-despues-pantalla1-390.png`); Sofía, «¿Lo de siempre?» con su último pedido y su saldo (`HOM-08-sofia-despues-pantalla1-390.png`). El CTA abre la pizza (`VAL-ENT-09-hero-valentina-ficha-1440.png`) | El cliente reconoce lo que le gusta de Melt, pero cada visita llega a **su** oferta y no a un listado. Un nombre y un precio para la misma oferta, sin decepción al hacer clic. Paid Media trae el 35 % del tráfico y el kit pide «mantener la promesa del anuncio» | Bounce < 30 %, CVR web 18 %, CTR → view item |
| **Explorar el menú** · Empate con ventaja | Lista compacta con foto, precio antes/ahora, «+» rojo y etiquetas «Solo retiro» (`melt-vuelta-portada.jpeg`). Pestañas por sección y buscador. Defectos: la barra marca «Menú» estando en «Promos», el WhatsApp tapa el «+» del último producto y el sitio móvil es separado (`m.meltpizzas.com`) | Menú en una página con secciones, tarjetas con foto macro, sello «LA MÁS PEDIDA», «+» lima sobre la foto y precio comparable (`MEN-06-menu-390.png`, `VAL-MEN-06-menu-390.png`). Buscador y barra inferior propia (Inicio, Menú, Promos, Pedido, Cuenta) sin botones flotantes. Un solo sitio adaptable | Igual de rápido de recorrer que Melt, con más «hambre» por tarjeta y sin elementos que tapen el botón de compra. Un solo sitio es la mitad del contenido que mantener para marketing | View item → add to cart > 18 % |
| **Ficha de producto** · Ganamos | Página propia con URL, foto y barra fija. Precio «**Desde** $12.790» y botón **«Agregar al carrito» apagado** hasta completar las elecciones (`melt-pdp.jpeg`). Repite «Producto con precio promocional» | Ficha y hoja con el tamaño más pedido **ya elegido**: «Familiar · Tradicional», precio exacto **$13.900** y «Agregar $13.900» activo desde el primer segundo. ★ 4,5 · 640 opiniones · «180 esta semana», «Para 3–4 personas», «Ganas 13 Papa Puntos» y tamaños con trozos y precio (`VAL-MEN-06-hoja-390.png`, `MEN-06-ficha-390.png`). Fichas propias para combos, acompañamientos, bebidas y postres (`PRO-08-*`) | El cliente ve **cuánto paga** y **para cuántos alcanza** antes de decidir, y puede agregar sin pensar. La prueba social reduce la duda de quien vuelve después de años (Valentina) | View item → add to cart > 18 %, CVR |
| **Armar la pizza** (tamaño, masa, extras, quitar, mitades) · Ganamos (mitades: Condicionado) | Tres pasos obligatorios para una pizza que no quieres cambiar: masa sin valor por defecto y **salsa obligatoria sin opción «sin salsa»**. Contadores de radios: «Elige tu cup · Obligatorio», «Selecciona máximo 9 opciones» (`melt-pdp-opciones.jpeg`). **Sin mitades** (`exploracion.md` §3) | Un toque con valores preseleccionados. «Sin cebolla» y extras con foto y precio, e ingrediente «agotado en El Bosque» (AUD). **Mitad y mitad** con armador visual, foto por sabor y «Agregar $17.900» (`PRO-08-mitades-precio-390.png`). «Editar» desde el carrito reabre la misma hoja con lo elegido (VAL-C3 punto 8) | Se agrega más rápido lo típico y se puede pedir lo particular. Las mitades resuelven el pedido familiar («a cada uno lo suyo») que Melt no puede tomar | Add to cart, ticket (extras), CVR |
| **Combos** · Ganamos | Promos con precio antes/ahora («2 Familiares Special + Palitos $19.490 ~~$34.370~~»). Las pizzas se eligen «entre 4/5 variedades» (`melt-vuelta-portada.jpeg`). El armado del combo **no se recorrió** en la exploración (límite) | Constructor «Arma tu Super Dúo» con «2 de 2 elegidas», fotos por pizza, ranuras con check y «Agregar Super Dúo · $22.590» (`OFE-06-constructor-completo-390.png`). Los Super Dúo y Trío desde el menú, el buscador o la URL redirigen al constructor (302 verificado). Oferta vencida con mensaje propio (`OFE-06-vencida-390.png`) | El combo siempre se arma completo, con lo elegido a la vista: no se cuela un combo «vacío» al carrito, que sería un problema en la tienda. El contador comunica cuánto falta | Ticket, CVR de promos, cancelaciones < 1,5 % |
| **Venta cruzada** · Ganamos | En la ficha, «¿Quieres agregar un extra?» como lista desplegable. En el carrito, carrusel de 3 acompañamientos genéricos con «+» (`melt-pdp-opciones.jpeg`, `melt-carrito.jpeg`) | Tras la primera pizza, **«Hazlo combo»**: «Suma Palitos de Ajo y Coca-Cola 1,5 L · +$6.990 ~~$9.480~~ · Ahorras $2.490», con elección Original / Sin azúcar / Light y «Sí, hazlo combo» (`MEN-06-hazlo-combo-390.png`). En el carrito, una línea propia «AHORRAS $2.490» y **una sola** sugerencia que cambia según lo que falta («¿Cerramos con algo dulce?») (`CAR-02-canonico-390.png`) | La oferta llega en el momento de mayor intención, dice cuánto ahorras y sale armada para la pizza que acabas de elegir. Pedido canónico: $16.900 → **$23.890** (+41 % sobre la pizza; +52 % sobre el ticket promedio de $15.690) | **Cross-selling 25 % → 35 %**, ticket +5 % |
| **Modalidad y tienda** · Ganamos | Encabezado «¿Cómo quieres tu pedido?». **Si agregas sin tienda, te lleva a otra página y te deja en la portada sin confirmar**: la pizza está en el carrito, pero parece perdida (`critica-ux.md`, `melt-vuelta-portada.jpeg`). La lista de tiendas tiene horario, estado y tiempo (`melt-tienda.jpeg`), eso lo hace bien | Se ve todo sin tienda. La tienda se pide **al agregar**, en un panel sobre la misma pantalla («Para agregar tu Super Dúo»), y el cliente vuelve con la pizza agregada (`ENT-05-despues-valentina-panel-390.png`, `VAL-ENT-04-diego-constructor-panel-390.png`). En Locales: «Tu tienda», 0,8 km, «Abierta · cierra 23:30», 15 min, «Pedir en El Bosque», y una tienda cerrada con «Solo programado · Programar» (`TIE-05-locales-despues-390.png`). El encabezado recuerda «Retiro · 15 min · El Bosque» | El momento en que Melt pierde al cliente es justo donde nosotros lo retenemos. Una tienda cerrada sigue vendiendo pedidos programados. Delivery con mínimo explicado («Te faltan $3.220… o cámbiate a retiro») empuja el mix Pick Up | Add to cart → checkout > 60 %, mix Pick Up 50 % |
| **Carrito** · Ganamos (Condicionado al pagar) | «Retiro en tienda: Barrio Brasil», foto, configuración en gris, «Con este pedido estás acumulando 10 MELT Points», carrusel de 3 acompañamientos y «Hacer pedido · $16.790» (`melt-carrito.jpeg`). Es correcto y sobrio | «Mi pedido» con la modalidad arriba («Retiro en El Bosque · Listo en 15 min · abierta hasta 23:30 · Cambiar»), la línea con su configuración («Familiar · Tradicional · sin cebolla», «+ Pepperoni»), «Editar», el combo agrupado con su ahorro, papelera con «Deshacer», bloque granate «Este pedido suma 23 Papa Puntos», ahorro en el resumen e «Ir a pagar $23.890» (`CAR-02-canonico-390.png`). Vacío con «Repetir pedido» para Sofía (`CAR-02-vacio-390.png`). VAL-C3: 8/10 a 390 y 1440, 0 fallas de contraste y 0 áreas táctiles < 44 px | El cliente confirma **lo que pidió y dónde lo retira** sin abrir nada. Editar sin rehacer evita abandonos. El ahorro y los puntos a la vista protegen el ticket en el último paso | Abandono de carrito < 55 %, add to cart → checkout > 60 % |
| **Lealtad y Papa Puntos** · Mitad y mitad | **Melt gana en explicar:** página editorial «Cada 2 pedidos, tus favoritos gratis», con tres reglas, tramos 20/40/60 y calculadora, y «Melt Points» en la barra inferior (`melt-puntos.jpeg`). En el carrito: «estás acumulando 10 MELT Points». En el checkout: «Comprando como invitado no acumularás MELT Points» (`melt-checkout.jpeg`) | **Ganamos en usar:** saldo **en pesos** en la Home («340 Papa Puntos = $17.000»), «Ganas 13 Papa Puntos» en la hoja, «suma 23» en el carrito y **canje en un toque** en el carrito: «Super Pepperoni Mediana $0 ~~$13.000~~ · Canjeada con 260 Papa Puntos · Te quedan 80 · Deshacer» (`CAR-02-canje-390.png`). **No hay página del programa:** `/puntos` responde 502 | Convertir puntos en pesos y canjear dentro del pedido es lo que hace volver: el miembro de lealtad pide 2,5 veces más (`exploracion.md` §4). Falta la explicación que el cliente valora de Melt (§4) | Socios Papa Puntos activos +20 %, recompra > 30 %, base identificada > 70 % |
| **Repetir pedido** · Condicionado | **No observado**: la exploración se hizo sin cuenta. No hay evidencia de «repetir» en Melt (límite) | Home de Sofía: «Tu último pedido · 2 oct · ¿Lo de siempre? · Pollo BBQ Familiar sin cebolla + Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L · Retiro en El Bosque · listo en 15 min · Mercado Pago, Visa ····4521 · Repetir pedido $23.890» (`HOM-08-sofia-despues-pantalla1-390.png`). También en el carrito vacío. **Hoy:** con sesión, reemplaza el carrito sin avisar, pierde los extras y salta al checkout del template; sin sesión, va al login del template (`EVAL-agregar`, #22, #101, #109) | El kit lo pide para Sofía y como KPI («repetir en un clic»). La tarjeta ya es el mejor momento de recompra de la demo, pero solo si termina en nuestro carrito | Recompra > 30 %, tiempo de checkout < 90 s |
| **Personalización por perfil y hora** · Ganamos | **Ninguna observada.** El mismo hero, banner de Santander y orden para todos (`melt-portada.jpeg`) | Tres portadas (`?perfil=valentina|diego|sofia`) y el momento por hora o forzado (`?hora=almuerzo|partido|celebracion|bajon`): Diego ve «Para ver el partido» seleccionado (VAL-C1 HOM-08 §2). Saludo, aviso y oferta propios de cada perfil | Es el pedido central del kit («que el sitio entienda el momento») y lo que «sorprende», porque no existe hoy ni en papajohns.cl ni en Melt. Para el negocio, ofrecer menos descuento a quien ya compra (Sofía) y más incentivo a quien hay que convencer (Diego, Valentina) | Uplift de personalización +5 %, CVR, margen +1 pp |
| **Accesibilidad y velocidad** · Empate (falta medir) | Lighthouse móvil: accesibilidad 85, SEO 100. Sitio móvil separado, desborde horizontal en escritorio, home sin `h1` y WhatsApp sobre el «+». Velocidad **irregular**: 14 s y 27 s en una sesión, 2 s y 3 s en otra; no sirve como argumento (`exploracion.md` §3) | Un solo sitio adaptable. Carrito con 0 fallas de contraste, 0 textos < 12 px y 0 áreas táctiles < 44 px (VAL-C3); fotos servidas a la resolución en que se pintan (VAL-C1 VIS-06); `prefers-reduced-motion` en el código. Respuesta del servidor publicado: 0,7–1,0 s por página con `curl` (no es LCP). **Lighthouse y LCP sin medir** (#12, D5.2) | Accesible es vendible a todos y protege la marca ante la Ley del Consumidor. **No comparar velocidad con Melt** hasta tener nuestro Lighthouse | Carga < 2,5 s, bounce < 30 % |

### Lo que tomamos de Melt a propósito (el «se parece»)

Conviene decirlo en la presentación: no es casualidad, es la respuesta al pedido del cliente.

| De Melt | En la demo |
|---|---|
| Hero con texto real, precio enorme, antes tachado y sello de descuento | Hero con la tarjeta crema, el sello LTO circular de la marca y el precio display |
| Barra inferior tipo app | Inicio, Menú, Promos, Pedido y Cuenta, sin botones flotantes |
| Lista compacta con foto, precio comparable y «+» | Tarjetas del menú con «+» lima sobre la foto |
| Ficha con URL propia y barra fija de compra | Ficha con URL, foto *sticky* y barra con el total |
| «Incluido» y «+$» junto a cada opción | La hoja con el precio por opción (diseño 04) |
| Puntos visibles en el carrito | Puntos en la hoja, la ficha, el aviso y el carrito, con canje |
| Tiendas con estado, horario y tiempo | Locales y panel con distancia, estado, tiempo y pedido programado |

---

## 3. Los 6 momentos «wow» para mostrar en vivo frente a Melt

Recomendación de puesta en escena: la captura de Melt a la izquierda (lámina, **no el sitio en vivo**: Melt pudo cambiar desde el 13-oct) y nuestra pantalla en vivo a la derecha. Para que cada perfil empiece limpio, conviene usar una ventana de incógnito por perfil.

### W1 · «Tres clientes, tres tiendas» (personalización)

1. Abrir `B/?perfil=valentina`: «¡Volviste! Este pedido suma Papa Puntos al doble» y la Pizza del Mes.
2. Cambiar a `B/?perfil=diego&hora=partido`: «La oferta que viste · Super Dúo», «+100 Papa Puntos» y el momento «Partido».
3. Cambiar a `B/?perfil=sofia`: «Hola, Sofía», «340 Papa Puntos = $17.000» y «¿Lo de siempre?».

> **Frase:** «Melt le muestra el mismo Hit del mes a todo Chile. Papa Johns le habla a Valentina como a alguien que vuelve, a Diego con la oferta que vio en Instagram y a Sofía con su pedido de siempre. Y marketing lo cambia desde Business Manager, sin un desarrollador.»

### W2 · «El anuncio se cumple» (la promesa del hero)

1. Lámina: el hero de Melt («Special Mix $9.990 ~~$16.700~~») y, al tocarlo, el listado donde la pizza se llama «Hit del mes» a ~~$16.790~~.
2. En vivo, `B/?perfil=valentina`: tocar «Lo quiero $10.990». Se abre The Works Familiar, con ese precio y lista para agregar.

> **Frase:** «Lo que les gusta de Melt lo tienen: foto, precio grande, descuento. Pero en Melt el botón lleva a un listado, con otro nombre y otro precio. Aquí el botón abre la misma pizza al mismo precio. Cada clic de Paid Media que no se pierde es venta.»

### W3 · «Un toque, y no te saco de tu pizza» (agregar + tienda)

1. Con `B/?perfil=valentina` (sin tienda elegida), ir a `B/menu` y tocar el «+» de Pollo BBQ: la hoja ya viene en Familiar · Tradicional, con «Agregar $16.900». Tocar «Sin cebolla».
2. Tocar «Agregar». Se abre el panel «Para agregar tu Pollo BBQ»: elegir Retiro en El Bosque.
3. El cliente sigue en la pizza, con «Pollo BBQ agregada · Editar».

> **Frase:** «En Melt hay que elegir masa, salsa y cup antes de poder agregar. Y si no elegiste tienda, te saca a otra página y te deja en la portada sin decirte nada. Aquí lo típico es un toque, y la tienda se pide cuando hace falta, sin perder la pizza.»

### W4 · «Hazlo combo: la venta cruzada que suma $6.990» (continúa W3)

1. Sobre el aviso aparece «Hazlo combo: Palitos de Ajo + Coca-Cola 1,5 L · +$6.990 ~~$9.480~~ · Ahorras $2.490». Elegir «Sin azúcar» y tocar «Sí, hazlo combo».
2. Abrir `B/cart`: «Retiro en El Bosque · Listo en 15 min», la Pollo BBQ sin cebolla, el combo agrupado con «AHORRAS $2.490», «Este pedido suma 23 Papa Puntos» e «Ir a pagar $23.890».
3. **Detenerse aquí** (ver §5).

> **Frase:** «Melt pone tres acompañamientos genéricos al final. Nosotros ofrecemos el combo justo después de la pizza, armado para ella y con el ahorro a la vista. Este pedido pasa de $16.900 a $23.890. Así se lleva el cross-selling del 25 al 35 % que piden.»

### W5 · «Diego y el partido» (combo desde el anuncio)

1. `B/?perfil=diego&hora=partido`: tocar «Armar mi Super Dúo $22.590».
2. Elegir Pollo BBQ y Super Pepperoni: «2 de 2 elegidas» y «Agregar Super Dúo · $22.590».
3. Agregar: si no hay tienda, se abre el panel («Para agregar tu Super Dúo»); después, el aviso.

> **Frase:** «El switcher no quiere leer, quiere la oferta que vio. Llega a la oferta, elige dos pizzas con fotos, y el combo nunca llega incompleto a la cocina.»

### W6 · «Los puntos de Sofía valen plata» (lealtad dentro del pedido) · **Condicionado**

Solo si antes del 20-nov se cierran los riesgos R2 y R3 de §5. Sofía debe tener **la sesión iniciada antes de la presentación**, fuera de cámara.

1. `B/?perfil=sofia`: mostrar «340 Papa Puntos = $17.000» y «¿Lo de siempre? · Repetir pedido $23.890».
2. Abrir el carrito y tocar «Canjear 260 puntos»: la Super Pepperoni Mediana queda en $0 ~~$13.000~~, «Canjeaste 260 puntos. Te quedan 80, y este pedido suma 25».

> **Frase:** «Melt explica muy bien su programa, pero sus puntos se quedan en una página aparte. Aquí Sofía ve cuánto valen en pesos y los usa dentro del pedido, en un toque. Así se activa la base de socios y se sube la recompra.»

**Opcional (W7) · Mitad y mitad:** `B/mitades`, con Pollo BBQ y Todas las Carnes, muestra «Agregar $17.900». Melt no tiene mitades. Se muestra **solo el armador**, sin abrir el carrito después, mientras no se active el interruptor de hooks (§4).

---

## 4. Dónde Melt todavía nos gana o empatamos

| # | Tema | Situación hoy | Frente a Melt | Recomendación |
|---|---|---|---|---|
| 1 | **Checkout del template** | `/checkout` es el del template: «Despacho a domicilio» en cada línea aunque el pedido es de retiro, datos en formato inglés («(697) 654-3210»), tachados por componente y «1.5 LT». Con canje, **cobra $38.880** cuando el carrito mostró $23.890 (VAL-C3 H-1, `VAL-C3-checkout-canje-390.png`) | **Melt gana:** su checkout va por pasos y esconde el pago, pero es coherente con su carrito | **Arreglar antes del 20-nov (P0, CHK, ya en curso en `storefront-wt/CHK`).** Mínimo exigible: el mismo total, las mismas líneas y la misma modalidad que el carrito, y el pago a la vista. Si no llega, **no mostrarlo**: la demo termina en «Ir a pagar» y el pago se cuenta con una lámina |
| 2 | **Canje que no llega al pago** | El canje vive en la cookie `pj_canje`. La promoción `pj-canje-puntos` no existe, así que el checkout y el panel «Tu pedido» a 1440 ignoran el canje (H-2: $38.830 y «suma 38») (#121) | Melt no muestra canje en el carrito; nosotros sí, pero solo en una pantalla | **Arreglar con #1** (CHK lee `pj_canje`, o DAT publica la promoción) y corregir el panel de 1440. Si no, mostrar el canje **solo** en `/cart` a 390 |
| 3 | **Mitades a $12.400** | El armador dice «Agregar $17.900», pero el carrito cobra el precio base de $12.400 y el aviso dice «+12 puntos», porque los hooks de SCAPI están apagados (#102, AUD) | **Ganamos en función** (Melt no tiene mitades), pero un precio distinto entre el botón y el carrito quita credibilidad | **Arreglar (Raúl: interruptor de hooks de SCAPI).** También da el precio de los extras por tamaño y el pedido mínimo. Si no se activa: mostrar el armador (W7) y **no** abrir el carrito después |
| 4 | **Login del template** | `/login` y la pestaña «Cuenta» (`/account` → 302 a `/login`) muestran «Sign In», «Registrarse», Apple y Google (H-8, #23, #101) | **Empate o Melt gana** (en Melt no se recorrió el login: límite) | **No mostrarlo.** Iniciar la sesión de Sofía antes de la presentación. Si ING tiene tiempo, el ingreso con código es un buen «wow» de confianza, pero no es prioritario frente a #1 |
| 5 | **Página de Papa Puntos** | `/puntos` responde **502**, y la Home de Sofía la enlaza 5 veces: la pastilla «340 Papa Puntos», «Canjear · 260 pts» y el CTA del bloque de puntos | **Melt gana:** su página de tres reglas con calculadora es una de las cosas que, según nuestra hipótesis (A7), le gustan al cliente | **Arreglar antes del 20-nov:** <ul><li>como mínimo, que esos enlaces lleven al carrito, donde está el canje;</li><li>idealmente, una página `/puntos` con las 3 reglas (1 punto por cada $1.000; 1 punto = $50; canje por productos), una calculadora y el saldo de Sofía (diseño 09).</li></ul>Es poco trabajo y empata el punto que Melt hace mejor |
| 6 | **Repetir pedido** | Con sesión, reemplaza el carrito sin avisar, pierde los extras («sin cebolla») y salta al checkout del template. Sin sesión, va al login del template (#22, #109, #113) | Sin evidencia de Melt | **Arreglar:** que «Repetir pedido» llene el carrito con la configuración completa y abra **`/cart`**, no el checkout. Es el cierre de W6 y el KPI de recompra |
| 7 | **Combo desde la ficha de Pizza del Mes** | Al agregar Palitos y Coca-Cola desde «Completa tu pedido», quedan como líneas sueltas a $4.417 y $2.573 (VAL-C3 H-3, `CAR-02-canje-390.png`) | Melt muestra precios redondos | **No mostrar ese camino** en la demo; CAR lo agrupa si hay tiempo |
| 8 | **Fotografía pareja** | Fondos distintos en Boom de Jamón y Hawaiana (#91); originales chicos en el Super Dúo y algunos acompañamientos (#69, #72) | **Empate:** Melt tiene una fotografía uniforme (fondo negro, vista cenital) | Elegir para el guion las pizzas con la mejor foto (Pollo BBQ, Super Pepperoni, The Works) |
| 9 | **Velocidad** | Sin Lighthouse ni LCP (#12, D5.2) | **Empate por falta de dato** | Medir antes del 20-nov y mostrar **nuestros** tiempos, sin compararlos con Melt |
| 10 | **Datos de ejemplo** | «640 opiniones», «180 esta semana» y «+100 Papa Puntos en el primer pedido directo» son de ejemplo (#28, #70) | — | Si preguntan, decir que son de ejemplo y que en el proyecto vienen de la encuesta NPS y de Synerise. No presentarlos como reales |
| 11 | **Avisos distintos al agregar** | El «+» de productos simples en el menú muestra un aviso sin puntos ni «Deshacer» (H-6, EVAL: 9 mecanismos y 5 avisos) | Menor | Usar pizzas y combos en el guion; unificar en ADD si hay tiempo |

---

## 5. Riesgos de la comparación en la demo: qué no abrir

| # | No abrir / no hacer | Por qué | Qué hacer en su lugar |
|---|---|---|---|
| R1 | **«Ir a pagar» → `/checkout`**, mientras CHK no esté aprobado | Muestra el template y, con canje, un total distinto: el cliente ve $23.890 y le cobrarían $38.880 (H-1). Es el peor momento para perder credibilidad frente a Melt | Cerrar W4 y W6 en el carrito; el pago se explica con una lámina |
| R2 | **Los enlaces de puntos en la Home de Sofía** (pastilla «340 Papa Puntos», «Canjear · 260 pts») y **cualquier URL escrita a mano** | `/puntos` y cualquier ruta inexistente responden **502**: no hay página 404 | Corregir los enlaces (§4 #5). En vivo, usar solo las URL de §3, guardadas como marcadores |
| R3 | **«Repetir pedido» de Sofía** | Va al checkout del template, o al login si no hay sesión, y pierde «sin cebolla» | Hasta que se corrija (§4 #6), mostrar la tarjeta y entrar al carrito por «Pedido» |
| R4 | **El carrito después de mitades** | Cobra $12.400 contra $17.900 en el botón | Activar los hooks, o mostrar solo el armador |
| R5 | **`/login`, «Cuenta» y `/account`** | El template sale en inglés, con Apple y Google | Sesión iniciada antes de la presentación |
| R6 | **El panel «Tu pedido» a 1440 con canje** | Ignora el canje (H-2) | Mostrar el canje a 390 en `/cart` |
| R7 | **«Completa tu pedido» en la ficha de Pizza del Mes** | Deja líneas sueltas a $4.417 y $2.573 (H-3) | Usar «Hazlo combo» desde la hoja de Pollo BBQ (W4) |
| R8 | **Abrir meltpizzas.com en vivo o comparar velocidades** | Melt pudo cambiar desde el 13-oct. Su velocidad fue irregular y nosotros no tenemos medición | Usar las capturas del 13-oct como lámina, con la fecha |
| R9 | **Hablar mal de Melt** | Es el referente que eligió el cliente | Tono: «lo que les gusta de Melt, más lo que hace vender después de la vitrina» |
| R10 | **Carritos con restos** | La cuenta de prueba fusionó un carrito de invitado con uno viejo (H-9) | Vaciar los carritos de las cuentas de demo el mismo día y abrir una ventana de incógnito por perfil |

### Los 3 riesgos que hay que cerrar antes del 20-nov

1. **Checkout coherente con el carrito**, incluido el canje: el mismo total, las mismas líneas y la misma modalidad. Si no llega, la demo termina en el carrito.
2. **Los puntos y la recompra de Sofía sin callejones:** que los enlaces a `/puntos` lleven a algo (idealmente la página de 3 reglas con calculadora, que empata lo mejor de Melt) y que «Repetir pedido» lleve al carrito con la configuración.
3. **Mitades al precio correcto:** activar el interruptor de hooks de SCAPI (Raúl). Arregla también los extras por tamaño y el pedido mínimo.

---

## Límites de esta revisión

- **Melt:** es una sola sesión del 13-oct-2026 en móvil, sin cuenta, sin pago y sin delivery con dirección real. No hay evidencia de su login, su «repetir pedido», el armado de sus combos ni su personalización con sesión. Donde dice «no observado», es eso.
- **PJ:** se juzgó con las capturas y las revisiones de los agentes, más `curl` sobre el sitio publicado. No se usó navegador (están reservados), ni se midieron Lighthouse ni LCP.
- Es una revisión experta, no una prueba con usuarios. Para confirmar qué prefiere el comprador, haría falta una prueba de 5 segundos o una sesión con 5 a 8 clientes, con las capturas de Melt y de la demo lado a lado.
