# Plan de implementación de la demo · Papa Johns Chile

- **Creado:** 06-nov-2026 · **Revisado:** 06-nov-2026 · **Demo:** viernes 20-nov-2026
- **Construye:** Claude · **Dueño de accesos y decisiones:** Raúl
- **Objetivo:** llevar el lienzo de la demo ([diseños 01–13](../disenos/README.md)) a una tienda en **Storefront Next** sobre el sandbox PapaJohnsCL, con una experiencia de e-commerce excelente que **dé hambre** (principio 9 de [00 · Propuesta](../disenos/00-propuesta/README.md)).
- **Alcance:** **solo B2C Commerce.** OMS y Marketing Cloud pasan a una **segunda etapa**, sin integración en esta demo; en la presentación se explican con la arquitectura.
- **Fuente de verdad:** el Markdown de cada diseño y [requerimientos-demo.md](../disenos/requerimientos-demo.md) (R1–R6). El lienzo es la referencia visual.
- **Regla de la demo:** se cuenta con clientes registrados (Sofía, Diego, Valentina). Lo simulado se presenta como simulado.

## Estado actual (06-nov-2026, noche)

| Bloque | Estado |
|---|---|
| Oleada 1: Home, Menú, Ficha y hoja (mitades, Arma tu pizza), Promos y constructor, Tienda y modalidad (HOM, MEN, PRO, OFE, TIE, INT-01..07, DAT) | ✅ integrada en `demo` |
| Pulido visual paso A: tema, fotos macro, sellos, precio display, superficies, micro-interacciones (VIS-01..05) | ✅ integrado (`257b1bf`) |
| Pulido visual paso B: HOM-07, MEN-05, OFE-05, TIE-04 | ✅ aprobado por VAL e integrado (`b820d34`); hallazgos de TIE corregidos (`a5f1803`) e integrados |
| Cierre del pulido: revisión UX-2 (antes/después) | ✅ promedio 4 → 7 ([UX-2](revisiones/UX-2-pulido.md)) |
| Pulido paso C (cierre de UX-2): VIS-06, HOM-08, OFE-06 en curso; luego TIE-05, MEN-06, INT-08 | 🔄 |
| Oleada 2: Carrito, Ingreso, Checkout (CAR, ING, CHK) | ⬜ |
| Oleada 3: Seguimiento, Cuenta, Panel del presentador (SEG, CTA, PAN) | ⬜ |
| Push a GitHub (`sfcc-sfra/storefront-next`) | ✅ 07-nov: `demo` en `681dcd4` y las ramas `hu/*` y `val/c1` (lo hace Raúl con `!`) |
| Managed Runtime | ✅ bundle 7 (18-nov, sandbox reconstruido; `demo` en `e4da058` + cambios de `site-data/` y del cartucho sin commit): https://sfnextpiz1af0959c456da71a.zyfj-001.my.commercecloud.salesforce.com/cl/es-CL/ — antes de cada push: `pnpm build` + `sfnext preview -p 3017` |

- **Probar en local:** servidor de desarrollo de la rama `demo` en `http://localhost:5173/cl/es-CL/` (perfiles con `?perfil=valentina|diego|sofia`; el perfil queda en cookie 7 días, se cambia con otro `?perfil=`).
- **Incidencias abiertas:** [BITACORA-INCIDENCIAS.md](BITACORA-INCIDENCIAS.md) (lista de trabajo clasificada). Histórico: [INTEGRACION.md](INTEGRACION.md).
- **Bloqueos de Raúl:** feature switch de hooks de SCAPI (mitades a $17.900, extras por tamaño, pedido mínimo), scope `sfcc.shopper-context.rw` en SLAS, llave de Google Places (opcional), decisión S-D10.

## Documentos de construcción

| Documento | Qué tiene |
|---|---|
| [EQUIPO.md](EQUIPO.md) | Los 14 agentes (INT, DAT, HOM, MEN, PRO, OFE, TIE, CAR, ING, CHK, SEG, CTA, PAN, VAL y REV), qué es dueño cada uno, oleadas, worktrees, puertos y el flujo construir → validar → revisar |
| [CONTRATO.md](CONTRATO.md) | Supuestos S-D1–S-D11, perfiles, clientes de demo, atributos, promociones, tiendas y piezas compartidas |
| [historias/](historias/README.md) | Objetivos de la demo y 57 historias con criterios de aceptación, una carpeta por agente |
| `revisiones/` | Informes de REV: antes de cada oleada y al cerrarla |

Las tareas D* de este plan se cumplen con las historias: D0.* → INT y DAT · D1.* → HOM, MEN, PRO, OFE, TIE · D2.* → CAR, ING, CHK · D3.* → SEG, CTA, PAN · D5.* → INT, VAL y REV.

## Cómo se sigue

- Cada tarea tiene un ID (`D<fase>.<n>`), el día, el diseño y los requerimientos que cubre, su tratamiento (Real / Simulado / Ejemplo) y su estado.
- **Estados:** ⬜ pendiente · 🔄 en curso · ✅ hecho y verificado en el navegador · ⛔ bloqueado (dice por qué) · ➖ segunda etapa.
- Al cerrar una tarea: `pnpm typecheck`, `pnpm lint` y `pnpm test` en verde; commit en `storefront/` con el ID en el mensaje; y una línea en la **Bitácora**.
- Cada fase termina con un recorrido completo en el navegador antes de pasar a la siguiente.

## Punto de partida (06-nov)

| Ya existe | Falta |
|---|---|
| Storefront Next (template oct-2026) conectado al sitio PapaJohnsCL; tema de marca, textos es-CL, portada y mega-menú en Page Designer | Todas las pantallas propias del lienzo; no hay commits desde el 16-oct |
| Catálogo de 271 productos con variaciones de tamaño (`pjSize`) y masa (`pjCrust`), precios, inventario y tiendas (`site-data/build_site.py`) | **Opciones de producto** (ingredientes, extras) y pizza por mitades |
| Promociones y cupones importados a mano en el sandbox | Que `site-data/` los pueda reconstruir |
| Login sin contraseña con código, `last-order-card` + `useReorder`, `fulfillment`, `store-locator`, `bopis`, `bonus-product-modal`, seguimiento de pedido | Activarlos y vestirlos con el diseño del lienzo |
| 76 fotos de papajohns.cl en `site-data/.cache/images` | Versiones grandes (la mitad mide 686 px de ancho o menos) |

## Decisiones técnicas

| Tema | Decisión | Por qué |
|---|---|---|
| Gestión de contenido y datos | **OCAPI Data API con las credenciales de `dw.json`** (client credentials): content assets y páginas de Page Designer, promociones, campañas, cupones, gift certificates, clientes de demo, preferencias del sitio. El site import (`build_site.py` → `b2c job import`) queda para catálogo, precios, inventario y metadata. Cada cambio por OCAPI queda en un script versionado en `storefront/site-data/ocapi/` | `dw.json` ya trae lo necesario; el sitio se puede reproducir |
| Pantallas propias | Una extensión `src/extensions/papajohns-demo/` (rutas, componentes, locales, targets) y componentes de Page Designer con `@Component` donde haya contenido editable (hero con video, ocasión, combos) | No ensucia el core del template |
| Ingredientes y extras | Option products de Commerce con precio por opción y soporte de `optionItems` en el carrito | Es real y el precio cuadra de punta a punta |
| Pizza por mitades | Producto «Pizza por mitades» con las especialidades de cada parte en atributos de la línea y hook `dw.order.calculate` que calcula el promedio (R2.1) | SCAPI ejecuta el hook en cada cálculo del carrito |
| Perfiles | Grupos de clientes + `utm_campaign` / `?hora=` (R4.1, R4.2) | Real en Commerce |
| Papa Puntos | Saldo y movimientos en atributos custom del cliente; canje con promoción real (R1.8) | Simulado, pero persiste |
| Seguimiento | Estado en un atributo custom del pedido de Commerce, avanzado desde el panel del presentador | Sin OMS se ve la pantalla 08 completa; en la segunda etapa el estado viene de OMS |
| Pago | Medio de pago de prueba sin pasarela + toast de pago rechazado | No afecta al hambre |

## Calendario

| Días | Fase |
|---|---|
| Lu 9 | F0 Base |
| Ma 10 – Ju 12 | F1 Que dé hambre |
| Vi 13 | Pulido F1 y revisión con Raúl |
| Lu 16 – Ma 17 | F2 Compra |
| Mi 18 | F3 Después de la compra |
| Ju 19 | F5 Pulido y ensayo |
| **Vi 20** | **Demo** |

## Fases

### F0 · Base · lunes 9

| ID | Tarea | Diseño / Req. | Tratamiento | Estado |
|---|---|---|---|---|
| D0.1 | Levantar el storefront en local contra el sandbox; revisar SLAS y caché de SCAPI | — | Real | ✅ |
| D0.2 | Exportar del sandbox promociones, campañas, cupones y métodos de envío a `site-data/` (scripts OCAPI en `site-data/ocapi/`) | — | Real | ✅ |
| D0.3 | Tokens de diseño del lienzo en el tema (color, tipografía, radios, sombras, estrella `#8F5400`) | 00, rev. UX v2 | Real | ✅ |
| D0.4 | Atributos para «dar hambre»: textos sensoriales, ingredientes con foto, porciones, vegetariana/picante, popularidad de ejemplo | R4.4, R4.5 | Real + Ejemplo | ✅ |
| D0.5 | Clientes de demo Sofía, Diego y Valentina con historial, direcciones, grupos y saldo de puntos | R1.6, R4.1 | Ejemplo | ✅ |
| D0.6 | Publicación: MRT si llega el ambiente (I5); si no, la demo corre en local | — | Real | ⬜ |
| D0.7 | Fotos grandes: buscar versiones de mayor resolución en el CDN de papajohns.cl y generar tamaños responsivos | rev. UX v2 | Real | ✅ |

### F1 · Que dé hambre · martes 10 a viernes 13

| ID | Tarea | Diseño / Req. | Tratamiento | Estado |
|---|---|---|---|---|
| D1.1 | Home por perfil (Sofía, Diego, Valentina) con hero de foto o video y franja de seguimiento | 01 · R4.1, R4.7 | Real | ⬜ |
| D1.2 | Ocasión por hora para Diego (Almuerzo, Partido, Celebración, Bajón) con su combo | 01 · R4.2, R4.3 | Real | ⬜ |
| D1.3 | Menú con tarjetas grandes, categorías y «Pedida N veces» | 02 · R4.4 | Real + Ejemplo | ⬜ |
| D1.4a | Option products (ingredientes y extras con precio) en el catálogo | 04 | Real | ⬜ |
| D1.4b | Hoja «Agregar al carro»: tamaño, masa, ingredientes con foto, agotado por tienda | 04 · R4.6 | Real | ⬜ |
| D1.4c | Soporte de opciones (`optionItems`) en carrito, checkout y confirmación | 04, 06 | Real | ⬜ |
| D1.5 | Ficha de producto: galería, destacados, estrellas, «Lista en N min» | 04 · R4.4, R4.5 | Real + Ejemplo | ⬜ |
| D1.6 | Armador por mitades + hook de cálculo del precio promedio | 02, 04 · R2.1 | Real | ⬜ |
| D1.7 | Ofertas y constructor de combos (Super Dúo, Super Trío, Box), promoción no disponible y oferta vencida | 10 · R2.6, R2.7 | Real | ⬜ |
| D1.8 | Tienda y modalidad (retiro / delivery, tienda cerrada) | 05 · R3.3 | Real | ⬜ |
| D1.9 | Pulido: hallazgos del `ux-review`, video del hero, transiciones y estados de carga con foto, sin saltos | — | Real | ⬜ |

**Cierre F1 (viernes 13):** recorrido Home → Menú → Ficha → Agregar en los tres perfiles, `ux-review` contra el lienzo y revisión con Raúl.

### F2 · Compra · lunes 16 y martes 17

| ID | Tarea | Diseño / Req. | Tratamiento | Estado |
|---|---|---|---|---|
| D2.1 | Carrito con «Conviértelo en combo» y una línea de umbral | 06 · R2.2, R2.3 | Real | ⬜ |
| D2.2 | Ingreso con código (sin contraseña) y consentimiento | 11 · R4.8 | Real | ⬜ |
| D2.3 | Checkout de registrado: dirección o tienda, ETA, puntos que gana | 07 · R1.1, R3.3 | Real + Simulado | ⬜ |
| D2.4 | Medios de pago: Gift Card `PJ-GIFT-2026`, descuento por banco (BIN), pago de prueba, pago rechazado como toast, doble clic | 07 · R2.4, R2.5, R2.8 | Real + Simulado | ⬜ |
| D2.5 | Confirmación con próxima acción | 08 | Real | ⬜ |

**Cierre F2:** Sofía repite su pedido de punta a punta en menos de 1 minuto; Diego llega desde una oferta y compra.

### F3 · Después de la compra · miércoles 18

| ID | Tarea | Diseño / Req. | Tratamiento | Estado |
|---|---|---|---|---|
| D3.1 | El pedido entra a OMS | 13 · R3.1 | — | ➖ |
| D3.2 | Seguimiento con estado en el pedido de Commerce, avanzado desde el panel; «actualizado hace X min» | 08 · R3.2, R3.4 | Simulado | ⬜ |
| D3.3 | Papa Puntos: saldo, por acreditar, canje en carrito, puntos dobles de Valentina | 09 · R1.1–R1.8 | Simulado | ⬜ |
| D3.4 | Mi cuenta: pedidos, repetir, direcciones, puntos | 11 | Real | ⬜ |
| D3.5 | Cancelación parcial con reembolso y compensación | 08, 13 · R3.6, R1.9 | — | ➖ |
| D3.6 | Panel del presentador: hora, casos sorpresa 1, 2, 14 y 15, avance del pedido | 12 · R6.1, R6.4 | Real | ⬜ |

### F4 · Marketing · segunda etapa

| ID | Tarea | Diseño / Req. | Estado |
|---|---|---|---|
| D4.2 | Campaña de reactivación por WhatsApp | 12 · R5.3 | ➖ |
| D4.3 | Mensajes de estado y carrito abandonado | 12 · R5.1, R5.2 | ➖ |
| D4.4 | Dashboard del día | 12 · R6.5 | ➖ |

### F5 · Pulido y ensayo · jueves 19

| ID | Tarea | Estado |
|---|---|---|
| D5.1 | Segundo `ux-review` de punta a punta y corrección de hallazgos | ⬜ |
| D5.2 | Rendimiento: Lighthouse móvil ≥ 90 en Home, Menú y Ficha; imágenes responsivas; LCP de la foto del hero | ⬜ |
| D5.3 | Accesibilidad: contraste y áreas táctiles | ⬜ |
| D5.4 | Microinteracciones (agregar al carro, puntos) | ⬜ |
| D5.5 | Regresión de los tres guiones y de los casos sorpresa en móvil y escritorio | ⬜ |
| D5.6 | Guion del presentador y plan B (capturas y video de respaldo) | ⬜ |
| D5.7 | Ambiente disponible al menos 2 semanas después de la demo (T-59) | ⬜ |

## Insumos

El acceso al sandbox está cubierto por `dw.json` (OCAPI, WebDAV, despliegues). Si responde 401, la clave venció y Raúl la renueva.

| ID | Qué | Cuándo | Si no llega | Estado |
|---|---|---|---|---|
| I1 | Fecha de la demo | — | — | ✅ 20-nov |
| I2 | Fotografía | — | — | ✅ Las de papajohns.cl |
| I3 | Org de OMS | — | — | ➖ Segunda etapa |
| I4 | Marketing Cloud | — | — | ➖ Segunda etapa |
| I5 | Proyecto y ambiente de MRT | Ju 19 | La demo corre en local | ⬜ |
| I6 | Remoto Git para `storefront/` | — | — | ✅ git@github.com:sfcc-sfra/storefront-next.git (privado) |
| I7 | Correo y celular del presentador | Lu 16 | Correo de prueba; el código se lee en el log | ⬜ |

## Bitácora

| Fecha | ID | Qué se hizo |
|---|---|---|
| 06-nov-2026 | — | Plan creado |
| 06-nov-2026 | — | Revisión con Raúl: demo el 20-nov; solo Commerce con Storefront Next (OMS y Marketing Cloud a la segunda etapa); fotos de papajohns.cl; prioridad hambre y compra; contenido y datos por OCAPI con `dw.json` |
| 06-nov-2026 | — | Equipo de agentes (EQUIPO.md), contrato (CONTRATO.md) y 57 historias (historias/); agente REV creado y lanzado sobre las historias |
| 06-nov-2026 | — | Decisiones de Raúl: S-D1 aprobado (Pizza del Mes en el hero; Box Halloween como oferta vencida); S-D4 aprobado por ahora (tarjeta simulada); S-D10 «Comer aquí» queda pendiente de revisar |
| 06-nov-2026 | REV-0 | REV revisó las 57 historias (✅ 22 · ⚠️ 35 · ❌ 0, `revisiones/REV-0-historias.md`); se aplicaron sus ajustes: recorrido de Sofía del lienzo, datos de Sofía del lienzo, textos sin SMS ni invitado, Super Dúo con delivery, buscador, «Arma tu pizza», «Locales», dueños únicos de confirmación y opinión, y se sacó el alcance de más |
| 06-nov-2026 | — | Decisiones de Raúl: canje sí y BIN como caso del panel (saldo final de Sofía 103, S-D12); se mantiene la marca Mercado Pago; Celebración = Papa Combo con Postre. API de papajohns.cl: la Pizza del Mes de noviembre es The Works Familiar $10.990 (hasta el 7-dic); reemplaza a la Boom de Jamón, que venció el 1-nov |
| 06-nov-2026 | Oleada 0 | Arranca la oleada 0: rama `demo` y worktree `storefront-wt/DAT` (rama `hu/DAT`); DAT construye DAT-01 a DAT-07 y un agente de base construye INT-01 a INT-04 en `demo` |
| 06-nov-2026 | OPV | Paso B completo en `demo` (`b820d34` + correcciones de TIE): typecheck, lint y 12.820 pruebas en verde, sin los 5 errores de antes. Lanzada la revisión UX-2 (antes y después) |
| 06-nov-2026 | OPV | OFE-06 terminada en `hu/OFE` (0af0e53; 12.823 pruebas en verde): constructor en dos columnas a 1440, CTA en contorno con «Te falta 1 pizza», títulos `pj-card-title`, seleccionado Basil, «Llegaste tarde a Halloween», Promos sin huecos, `AccentWord` en la destacada. TIE-05 lanzada en headless-3 (incluye el defecto #67 del panel) |
| 06-nov-2026 | OPV | HOM-08 terminada en `hu/HOM` (37fa496): CTA del hero completo en el primer pliegue en los 3 perfiles (foto 51 %), Diego con dos pizzas, franja granate +100 puntos y momento propio, Sofía con 3 favoritas y barra lima, #62 y #63 cerrados. MEN-06 lanzada en headless-2 |
| 06-nov-2026 | OPV | VIS-06 terminada en `hu/VIS` (116dc9a; 12.833 pruebas en verde): fotos con la resolución que se pinta (ficha 0,63 → 1,07; combos 0,59 → 1,18), sello LTO compacto, aviso bajo el encabezado a 390; #48 no se borra (lo usan 37 archivos). INT-08 lanzada en headless (worktree nuevo `storefront-wt/INT`, puerto 5186). Esperan VAL: OFE-06, HOM-08, VIS-06 |
| 06-nov-2026 | OPV | TIE-05 (3cdece8: Locales con un botón relleno, «Tu tienda», grupos, mapa SVG ilustrativo y `<title>`; panel con Confirmar bloqueado mientras carga) y MEN-06 (47a1917: «Hazlo combo» en el panel a 1440, valoración con «320 esta semana», seleccionado Basil, ficha sin banda y foto *sticky*, menú sin «Agregar» duplicado, cierres de grilla) terminadas. VAL-C1 (VIS-06 + HOM-08 + OFE-06 + TIE-05 juntas en `val/c1`) en headless-3 y VAL-MEN-06 en headless-2. INT-08 retomada por Raúl. Raúl pidió desplegar en MRT al terminar: `pnpm sfnext push --mrt-backend scapi --wait --message "Deploying quick start bundle."` |
| 07-nov-2026 | OPV | VAL aprobó MEN-06 (menú 8, ficha 7,5, hoja 8) y se integró en `demo`. INT-08 terminada (63e7a18: el encabezado lee el perfil activo, chip con la modalidad de Sofía, #10 y #27): se fusionó con HOM-08 en `hu/INT` resolviendo 3 conflictos aditivos. VAL-C1 retomado tras el corte por límite de uso |
| 07-nov-2026 | OPV | VAL-C1 aprobó VIS-06, HOM-08, OFE-06 y TIE-05 (todas ≥ 8; promedio 8,1 contra 4 en UX-1) y se integraron en `demo` (`31f641b`). Falta VAL-INT-08 y luego integrar `hu/INT` y desplegar en MRT |
| 07-nov-2026 | OPV | VAL aprobó INT-08 (3 hallazgos menores) y se integró en `demo` (`681dcd4`): typecheck, lint y 12.892 pruebas en verde. Desplegado en MRT con `pnpm sfnext push --mrt-backend scapi --wait` (bundle 3, «Bundle Published»). El dominio `…exp-delivery.com` y CloudFront devuelven 403: el ambiente usa eCDN (`configured_cdn: ecdn`), así que se entra por el hostname de eCDN de Commerce |
| 07-nov-2026 | INT | El bundle 3 subió un `build/` viejo (15:47): 502 en `/menu` y `/promos`, DIS sin `sw` y sin Papa Sans. Causa adicional: `pnpm build` roto por imports de `*.server` en los componentes de Page Designer de la Home (corregido en `2ff6933`). Bundle 4 desplegado: todas las rutas en 200, Papa Sans y `sw` en DIS verificados en el sitio público. Lanzado CAR (worktree `storefront-wt/CAR`) por pedido de Raúl: detalle de extras y opciones en las líneas del carrito (#34, #37, #38) |
| 07-nov-2026 | — | Raúl: «se me hace difícil comprar» en `/p/cb-pizza-del-mes` (template con código postal y BOPIS). Causa: solo las pizzas usan la ficha propia. Lanzados en paralelo PRO-08 (ficha de combos, acompañamientos, bebidas y postres según el libreto; Super Dúo/Trío → constructor), la auditoría del libreto de compra sobre el sitio publicado y CAR (detalle de líneas) |
| 07-nov-2026 | — | Auditoría del libreto (`AUD-compra.md`): pizzas 7–8; combos, acompañamientos y bebidas desde la ficha 1–2 (40 productos `cb-*`/`cp-*` en la ficha del template); carrito 3. Lanzado el agente de entradas (HOM-09, MEN-07, TIE-06) en headless-2; PRO-08 y CAR recibieron sus puntos de la auditoría |
| 07-nov-2026 | — | Raúl pidió dos revisiones más: (1) evaluación de **todos** los mecanismos para agregar al carro contra el libreto (`revisiones/EVAL-agregar.md`, en el código porque los 3 navegadores están ocupados); (2) UXD revisa el carrito, que no está bien resuelto en el lienzo, y especifica el carrito objetivo (`revisiones/UX-3-carrito.md`) para CAR |
| 07-nov-2026 | — | PRO-08 terminada (f353ea3): 4 combos con ficha propia, 33 `cp-*` con ficha simple, 302 de Super Dúo/Trío y mitades, elecciones en `c_pjComboChoices`, mitades con monto, entrada a mitades en la ficha. CAR-01 terminada (3 commits): `/cart` propio con la configuración completa de cada línea, «Editar» con la hoja, «Hazlo combo» agrupado, modalidad arriba. UX-3 (carrito): el lienzo no tiene página de carrito; especificación escrita, CAR-02 en curso en headless. VAL-C2 (PRO-08 + CAR-01) en headless-3 |
| 07-nov-2026 | — | EVAL-agregar (`revisiones/EVAL-agregar.md`): la pizza cumple el libreto, pero hay 9 mecanismos de agregar y 5 avisos. Próxima historia ADD: unificar en `requestConfigure` → `usePjAdd()` → `/action/pj-cart`, después de integrar PRO-08, CAR y ENT (en ese orden). VAL usará el guion de 20 pasos del informe |
| 07-nov-2026 | — | Entradas de compra terminadas (HOM-09, MEN-07, TIE-06): «+», favoritas y hero de pizza abren la hoja; Ofertas y buscador llevan Super Dúo/Trío al constructor; el panel dice «Para agregar tu …». Prueba de fusión: PRO-08 entra limpio; CAR choca con HOM solo en `src/components/pj-home/*` (mismo arreglo de lint hecho dos veces) |
| 07-nov-2026 | — | VAL-C2: PRO-08 aprobada e integrada en `demo` (`7015d86`); CAR-01 aprobada con condición (H1, complementos agrupados bajo la pizza equivocada), que entra en CAR-02. Consistencia ficha = hoja = aviso = panel = carrito verificada. VAL-ENT (entradas) en headless-3 |
| 07-nov-2026 | — | VAL-ENT: HOM-09 y MEN-07 aprobadas; TIE-06 rechazada por el panel sin nombre desde el constructor (OFE), corregido por INT en OFE-07 (`adfe40a`). Integradas en `demo` (`bdf3713`); todo en verde, build incluido. Falta CAR-02 y luego desplegar |
| 07-nov-2026 | — | CAR-02 terminada (f113361): carrito de UX-3 (extras en una línea, «Hazlo combo» propio, una oferta, Papa Puntos con canje, dos columnas a 1440, estados, papelera con «Deshacer»); H1 de VAL-C2 resuelto. Integrada en `demo` (`8ecd80b`), todo en verde. VAL-C3 corre sobre la vista previa de producción (puerto 3017) con los 21 puntos de UX-3 y el guion de 20 pasos de EVAL-agregar; después, despliegue |
| 07-nov-2026 | — | VAL-C3 rechazó CAR-02 solo porque el checkout del template ignora el canje (H-1); el carrito queda en 8/8 si se cierran H-1 y H-2. Desplegado el bundle 5 (`8ecd80b`): fichas sin template, entradas de compra y carrito UX-3 en el sitio público (verificado). Lanzados CHK (checkout de marca, oleada 2) en headless-3, CAR-03 en headless y la comparación con Melt (UXD) |
| 07-nov-2026 | — | Comparación con Melt (`revisiones/MELT-vs-PJ.md`): 5 diferenciadores y 7 momentos «wow»; riesgos: checkout (CHK en curso), `/puntos` y 404 en 502, «Repetir pedido» y mitades (hooks). CAR-03 (`51d737f`: panel con canje, complementos a precio normal con el ahorro aparte, ETA de delivery) integrada en `demo`. Lanzado CTA (página de Papa Puntos, 404 de marca, cuenta) en headless |
| 07-nov-2026 | — | Raúl eligió la opción A: S-D19 (venta cruzada después de toda pizza o combo y «¿Le sumamos algo?» en el carrito) y S-D20 (Super Dúo/Trío como pizzas reales personalizables + promoción). Lanzados DAT-11 (promociones, cupones y `c_pjComboGroup`/`c_pjComboFor`) y VEN (hoja «Completa tu pedido», constructor con «Personalizar», recomendaciones del carrito) en headless-2 |
| 07-nov-2026 | — | CHK terminado (`de7dba1`): checkout de marca continuo con el carrito (modalidad, líneas, canje a $0, pago con tarjeta guardada, rechazo, doble clic), confirmación con número, tienda, mapa y puntos; retiro asignado al envío (#29). El canje se cobra con un supuesto hasta que DAT cree `PJ-CANJE-PUNTOS`. Integrado en `demo` |
| 07-nov-2026 | — | CTA e INT-10 terminados e integrados en `demo`: `/puntos` de marca (saldo en pesos, canje al carrito, 3 reglas y calculadora, por perfil), cuenta de marca con «Repetir pedido» y «Cerrar sesión», login traducido sin Apple/Google, y 404 de marca (el 502 venía de `shopper-seo` 403 → ahora 404). typecheck, lint y build en verde |
| 07-nov-2026 | DAT | DAT-11 (`4c66c05`, 21/21 por SCAPI): opción `pjCombo` (duo/trio) + promociones `pj-super-duo` ($22.590) y `pj-super-trio` ($33.900) sobre pizzas reales, extras cobrados aparte; `c_pjComboGroup`/`c_pjComboFor`; canje `PJ-CANJE-PUNTOS` (pedido canónico $23.890); `PJ_CASH`; atributos en Basket. Contrato reenviado a VEN |
| 07-nov-2026 | INT | Raúl activó el feature switch de hooks de SCAPI y el scope `sfcc.shopper-context.rw`. `verify.py`: 69/70; faltaba el extra por tamaño, que el hook no implementaba: corregido en `calculate.js` y cartucho desplegado en `SFRA_UPC_08_21_2026`. Ahora DAT-02/03/04/11: 43/43 (mitades $17.900, extras por tamaño, combos) |
| 07-nov-2026 | — | VEN terminada (`89d5910`) e integrada en `demo`: S-D19 y S-D20 verificados en el sandbox (Dúo personalizado $24.530, bebida 2,5 L sugerida, «¿Le sumamos algo?»). VAL final (Sonnet, un solo recorrido) sobre el servidor de desarrollo antes de desplegar |
| 07-nov-2026 | — | VAL-FINAL: **apta para desplegar, 8,5/10** (pedido de prueba 00000111). Desplegado el bundle 6 (`e4da058`): checkout de marca, Papa Puntos, 404, venta cruzada y Dúo/Trío reales; rutas verificadas en el sitio público (404 responde 404). Hallazgos nuevos a la bitácora (BI-30 a BI-34). Creados los agentes del proyecto `pj-constructor`, `pj-validador` (Sonnet) y `pj-ux` (Opus) |
| 06-nov-2026 | OPV | UX-2 escrita: promedio 4 → 7; 24 de 33 ítems de UX-1 resueltos. Quedan bajo 7 el constructor en escritorio, Locales, la nitidez de las fotos y el encabezado de Sofía. Paso C creado en `historias/OPV.md` (VIS-06, HOM-08, OFE-06; luego TIE-05, MEN-06, INT-08) |
| 06-nov-2026 | Oleada 0 | Cerrada e integrada en `demo`: INT-01 a INT-04 (base visual, layout, 12 extensiones, pj-shared) y DAT-01 a DAT-07 (sitio reproducible, catálogo, extras, mitades, combos, tiendas y 18 clientes). Bloqueos para Raúl: feature switch de hooks de SCAPI y scope Shopper Context del cliente SLAS |
| 06-nov-2026 | Oleada 1 | Worktrees HOM, MEN, PRO, OFE y TIE (puertos 5174–5178); encargo fijo en `ENCARGO-CONSTRUCTOR.md`; lanzados los 5 constructores |
| 06-nov-2026 | Oleada 1 | Validaciones de VAL. Aprobadas: OFE-02, OFE-03, OFE-04, TIE-02, HOM-02, HOM-03, MEN-02 y MEN-03. Rechazadas y corregidas por su constructor: OFE-01 (`806c3be`), TIE-01 y TIE-03 (`e38ffbf`) y HOM-01 y HOM-04 (`921c893`; el aviso de cookies y el LCP pasan a INT). MEN-01 rechazada (el carrusel desborda a 390 px), en corrección. INT-06 hecho (`42e29bd`: Papa Sans y paleta oficial); INT-07 en curso (arreglos comunes). Regla nueva: solo Chrome sin ventana |
| 06-nov-2026 | — | Corte por límite de uso de la cuenta; al reponerse se retomaron INT-07, MEN y PRO desde donde iban y se lanzó la revalidación de OFE-01 y TIE |
| 06-nov-2026 | Oleada 1 | Revalidación: OFE-01, TIE-01 y TIE-03 APROBADAS. OFE y TIE completas, listas para unir a `demo` cuando INT-07 termine (comparten la rama) |
| 06-nov-2026 | Oleada 1 | Integradas en `demo` OFE, TIE, MEN y HOM (12.767 pruebas en verde). PRO, en corrección por VAL. Raúl: «está bien pero muy duro, no compite» → se crea el rol **UXD** (director de experiencia y diseño visual) y se lanza su primera revisión (`revisiones/UX-1-direccion-visual.md`) |
| 06-nov-2026 | Oleada 1 | **Cerrada en lo funcional:** PRO integrada en `demo` (con el ajuste del aviso sobre «Hazlo combo»); las 22 historias de HOM-01..04, MEN-01..03, PRO-01..05, OFE-01..04, TIE-01..03 y INT-01..07 están en `demo`; 12.789 pruebas en verde. UXD entregó la dirección visual (`revisiones/UX-1-direccion-visual.md`): pendiente que Raúl apruebe la oleada de pulido visual |
| 06-nov-2026 | — | Push de las 8 ramas a `git@github.com:sfcc-sfra/storefront-next.git` (privado); `demo` en `f7ee82c`. Raúl lo ejecutó con `!` porque el modo automático bloquea el push |
| 06-nov-2026 | OPV | Raúl aprueba el pulido visual. Historias en `historias/OPV.md`: paso A, VIS-01 a VIS-05 (tema y piezas comunes, worktree `hu/VIS`), ya lanzado; paso B, HOM-07, MEN-05, OFE-05 y TIE-04 en paralelo sobre VIS; cierre con VAL y una segunda revisión de UXD con antes y después |
| 06-nov-2026 | OPV | Paso A cerrado: VIS-01 a VIS-05 integradas en `demo` (12.808 pruebas en verde); la API está en `VIS-API.md`. Paso B lanzado: HOM-07 (headless), MEN-05 con la ficha (headless-2) y OFE-05 (headless-3). TIE-04 espera a que se libere una instancia de Chrome sin ventana |
| 06-nov-2026 | OPV | OFE-05 terminada en `hu/OFE` (8316197, 281cfbc): destacada en verde con sello lima, *pop* y latido en el constructor, F4 corregido (después de agregar dice «Ver mi pedido»), F10 y oferta vencida en lila. Pendiente: repetir la suite completa con el equipo libre (reportó 5 errores bajo carga, fuera de pj-offers). TIE-04 lanzada en headless-3, puerto 5178 |
| 06-nov-2026 | OPV | HOM-07 terminada en `hu/HOM` (3c13523; 12.815 pruebas en verde): hero a sangre en los tres perfiles, saludo en lila, lealtad en granate, carrusel «¿Qué se te antoja?» y momentos en Valentina, F7 y F11. Las capturas salieron de un fixture local porque el sandbox estaba caído. Hay que desplegar el cartucho (cambiaron `pjGreeting` y `pjBenefits`). Solicitudes a DAT: fotos destacadas, variantes familiares *orderable* y `c_pjRating` en combos. VAL de OFE-05 y HOM-07 lanzado en headless, con datos reales |
| 06-nov-2026 | OPV | MEN-05 terminada en `hu/MEN` (0523a77): tarjeta con «+» lima, sello «LA MÁS PEDIDA», sombra cálida y zoom; «½ Mitad» legible a 390; ficha y hoja con `LtoBadge`, precio display y escala nueva. Las fotos vacías de la captura de escritorio eran carga diferida, no un error. VAL de MEN-05 lanzado en headless-2 |
| 06-nov-2026 | OPV | TIE-04 terminada en `hu/TIE` (eab7a70): Locales con tarjetas del panel, estado abierta/cerrada, *skeleton* (F5), `?modo=delivery` (F12), dirección sin coma, un solo patrón de seleccionado (F9) y «Confirmar» con resumen. Paso B completo: las cuatro historias están en VAL |
| 06-nov-2026 | OPV | VAL aprobó MEN-05 (5 hallazgos menores, #49–53 de INTEGRACION.md) y se integró en `demo` |
| 06-nov-2026 | OPV | VAL aprobó TIE-04 (5 hallazgos menores, #55–59) y se integró en `demo`. La dirección de delivery sí funciona con el respaldo local (Places sigue en 403) |
| 06-nov-2026 | OPV | VAL aprobó OFE-05 y HOM-07 con datos reales (fotos destacadas OK) y se integraron en `demo`. Paso B integrado completo; hallazgos de TIE corregidos (`a5f1803`) e integrados |
