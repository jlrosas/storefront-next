# Auditoría de `backoffice-video.md` contra el video

- **Documento auditado:** [backoffice-video.md](backoffice-video.md). No se modificó.
- **Fuente:** `Demo BackOffice-20261021_101031-Grabación de la reunión.mp4` (1920×1080, 16 fps, 48:07).
- **Método:**
  - Saqué un frame cada 5 s del tramo 00:00–44:20 (532 frames a 1280 px) y detecté cambios de escena con umbral bajo (`scene>0.02`, 340 cortes). Leí con OCR la barra de dirección a resolución completa cada 5 s. Revisé a mano los 119 frames que difieren entre sí. En los tramos dudosos bajé a 1 frame por segundo, a resolución completa: tipos de bloqueo, carga de métodos de pago, DevTools, toggle de tramos y la sección «Aplicación Móvil».
  - Volví a transcribir con Whisper large-v3-turbo seis tramos con huecos o dudas: 23:10, 23:45, 25:55, 33:00, 33:55–35:15 y 35:50.
  - Los segundos citados tienen un margen de ±3 s.
- **Evidencia visual:** en [backoffice-video/auditoria/](backoffice-video/auditoria/), archivos `a01`–`a08`.
- **Veredictos:**
  - **CORRECTA:** lo que dice el documento coincide con lo que se ve o se oye.
  - **CORREGIR:** el documento dice algo distinto de lo que muestra el video, o lo presenta como visto cuando solo se dijo.
  - **NO VERIFICABLE:** no se ve en pantalla ni se dice con claridad.
  - **FALTANTE:** algo que se ve o se dice, que sirve para costear un backoffice nuevo y que el documento omite.

---

## 1. Línea de tiempo de pantallas (propia)

| Tramo | URL o pantalla | Pestaña, modal, sección o scroll visible |
|---|---|---|
| 00:00–00:04 | Cámaras de Teams | Sin pantalla compartida |
| 00:05–00:57 | `papajohns-backoffice-demo.goldentiger1.chatgpt.site/#slide-1` | Lámina 1, «Backoffice que mueve la operación» |
| 00:58–02:47 | `…#slide-2` | Lámina 2, «Reglas que definen la experiencia»: 01 Promociones, 02 Tienda, 03 Control |
| 02:48–03:02 | `…#slide-3` | Lámina 3, «Una oferta, con condiciones claras» |
| 03:03–03:08 | `…#slide-4` | Lámina 4 por un instante (se adelantó) |
| 03:09–03:17 | `backoffice.stage.papajohns.cl` | Home vacía; el cursor recorre el menú lateral |
| 03:18–05:17 | `/offers` («Promociones») | Pestaña Combos (Promos y PapaPartner no se abren); scroll del listado en 04:15 |
| 05:18–13:07 | `/offers/combos/3` («Editar combo») | Parte superior: bloque «Info para card B». Queda fija durante la conversación 06:17–13:00 |
| 13:08–14:02 | Ídem | Scroll: textos, SEO, cupón de cortesía, agrupador, despacho, plataforma, precios, ocultar, link, temporizador, vigencia, disponibilidad |
| 14:03–14:32 | Ídem | «Configuración de ingredientes para CYOP» |
| 14:33–16:37 | Ídem | «Grupo de productos». Desplegable Tipo abierto en 15:00; desplegable Producto abierto de 15:08 a 16:30; «Grupo de menús y/o tiendas» en 16:25 |
| 16:38–18:47 | Ídem | Imágenes por canal; de 17:00 a 18:45 la pantalla queda fija en las imágenes de Tótem |
| 18:48–19:22 | `…#slide-4` | Lámina 4 |
| 19:23–20:12 | `/stores` («Tiendas») | Listado; scroll en 19:55 |
| 20:13–20:52 | `/stores` | Panel lateral «5 de ABRIL! – Promociones asociadas», abierto desde la columna Incidencias de #155 |
| 20:53–20:58 | `/stores/155` | «Cargando tienda…» y vuelta atrás («¿puedo ir una cosa atrás?») |
| 20:59–22:07 | `/stores` | Listado fijo. **No se abre el panel Filtros ni se ordena ninguna columna** |
| 22:08–22:12 | `/stores` | Panel «Promociones asociadas» otra vez |
| 22:13–22:22 | `/stores` | Listado; cursor sobre «Estimado retiro» |
| 22:23–28:07 | `/stores/155` («Editar tienda», pestaña Configuración) | 22:30 datos y menús; 22:50 modo de pedido y última milla; 22:55 FarEye y espacios públicos; 23:15–24:10 identificadores; 23:35–24:15 métodos de pago; 24:10–25:00 tiempos; 25:00–25:35 geolocalización, zonas **vacías** y mapa con pin; 25:35–27:50 agendar cierre y horarios; 27:55 zonas; **28:04 «Agregar» zona de reparto → hexágono por defecto** |
| 28:08–29:27 | `papajohns.cl` (producción) + DevTools (Network, Fetch/XHR) | 28:20 modal «¿Cómo quieres pedir hoy?» con la tienda «[LAB] Laboratorio Chile PROD v19»; 28:30–28:47 autocompletado «providencia 1348»; 28:50 «Desde tienda Providencia.»; 28:57 Headers de `near_me`; 29:08 Preview de `near_me`; 29:10–29:25 Preview de `delivery`; 29:20 pestaña «Retiro en punto» con 3 tiendas |
| 29:28–30:42 | `/stores/155` | 29:30 zona creada; 29:35 horarios y botones Limpiar/Actualizar; 30:05–30:15 scroll hasta arriba (teléfono, menús) |
| 30:43–30:47 | `…#slide-4` | Lámina 4 |
| 30:48–31:32 | `…#slide-5` | Lámina 5, «La operación cambia; el commerce debe responder» |
| 31:33–32:52 | `/disabled` («Productos Deshabilitados») | 31:40 modal «Agregar producto/ingrediente a deshabilitar»; 31:55 Super Pepperoni con Familiar/Tradicional; 32:05 Coca-Cola con «coca cola 591 ml»; **32:15 desplegable Tipo abierto**; 32:20 The Works SUPER con «Familiar / undefined»; 32:50 modal cerrado |
| 32:53–33:52 | `/payment-methods` («Ordenar métodos de pago») | Primer segundo: lista provisional de 7 métodos con límite 4. Desde 33:00: lista real de 10 métodos con límite 3 |
| 33:53–35:07 | `/dashboard-nps?start_date=2026-10-20T00:00:00-03:00&timezone=true` | 34:00 scroll a «Detalle NPS tiendas» y «Detalle preguntas»; queda fijo hasta 35:07 |
| 35:08–36:02 | `/settings` («Configuraciones») | Arriba en 35:15; scroll hasta «Aplicación Móvil» en 35:50 |
| 36:03–36:08 | `/stores-groups` | Listado de 2 grupos |
| 36:09–42:07 | `/stores-groups/28` («Editar grupo», breadcrumb `storesGroupsUpdate`) | 36:14 tramos en OFF; **~36:33 el presentador activa los tramos**; 37:50 «Proveedor de última milla que queremos deshabilitar»; 37:55 tiendas asignadas. Queda fijo durante las preguntas |
| 42:08–42:32 | `…#slide-6` | Lámina 6, «¿Cómo llegan estas reglas al commerce?» |
| 42:33–44:07 | `…#slide-7` | Lámina 7, «Configurar, responder y aprender» |
| 44:08–48:07 | Cámaras de Teams | Fin de la pantalla compartida |

---

## 2. Hallazgos por afirmación

Revisé **114 puntos**: 105 afirmaciones del documento más 9 faltantes.

- **81 CORRECTA:** K1–K62 y 19 de las filas N.
- **19 CORREGIR:** C1–C19, ordenadas por importancia.
- **4 NO VERIFICABLE:** N4, N18, N19 y N20. Además, C9 y C12 tienen una parte no verificable.
- **1 sin veredicto:** N21, inferencias que el documento ya rotula como tales.
- **9 FALTANTE:** F1–F9, en la sección 3.

### 2.1 Correcciones (ordenadas por importancia)

| # | Afirmación del documento | Veredicto | Evidencia | Corrección |
|---|---|---|---|---|
| C1 | Bloqueo de productos: «Agregar producto o ingrediente a deshabilitar por tienda: tipo (Pizza, Complemento…)» (inventario y fila 31:30) | **CORREGIR** | 32:15–32:17, desplegable Tipo abierto: **Pizza, Complemento, Ingrediente, Promociones, Combos** ([a01](backoffice-video/auditoria/a01-bloqueo-tipos-promociones-combos.jpg)) | El bloqueo por tienda también aplica a **promociones y combos completos**, no solo a productos e ingredientes. Es un requisito: el nuevo commerce debe poder apagar una promo o un combo en una tienda sin despublicarlo en las demás |
| C2 | Métodos de pago: «La activación o desactivación se hace en Tiendas > Editar tienda» | **CORREGIR** (hay una contradicción que el documento no menciona) | La pantalla dice en 33:00: *«Aquí solo puedes configurar el orden. Para editar o desactivar métodos, ve a Tiendas > Editar tienda»* ([a04](backoffice-video/auditoria/a04-metodos-pago-texto-ui.jpg)). Pero la re-transcripción de 34:57 dice: *«En la parte de los métodos de pago… acá ya lo podemos ver de forma masiva. Aparte de ordenar, incluso podemos quitar, apagar o prender alguno»*, y en 24:20: *«a través de ella se puede hacer masivo»*. En 34:57 la pantalla muestra el Dashboard NPS, no Métodos de pago ([a05](backoffice-video/auditoria/a05-pantalla-durante-frase-metodos-pago.jpg)) | La UI actual solo ordena. **El negocio espera prender y apagar medios de pago en forma masiva** (todas o varias tiendas). Hay que registrarlo como requisito y como contradicción a confirmar. El menú «⋮» de cada fila no se abrió |
| C3 | Tiendas, panel de promociones asociadas: «motivo ("Grupo requerido no disponible en el menú", "N elementos bloqueados")» | **CORREGIR** (matiz de regla) | 20:15 y 22:10: «7 Publicadas · 6 Disponibles · 1 No disponible». Solo #220 Combo Familiar aparece **No disponible**, con «Grupo requerido no disponible en el menú». En cambio, «2/3 elementos bloqueados» aparece en promos marcadas **Disponible** (#3, #289, #296, #307, #308) ([a02](backoffice-video/auditoria/a02-panel-incidencias-estado-promo.jpg)) | Tener elementos bloqueados **no** vuelve no vendible una promo: la promo sigue vendible, presumiblemente con las otras opciones o con la pizza de reemplazo. Lo que la vuelve no disponible es que falte un grupo **requerido** en el menú. El motor de disponibilidad debe distinguir los dos casos |
| C4 | Editar tienda: «el polígono de reparto y las zonas de exclusión dibujados en Google Maps por servicio al cliente [25:02–25:55]» y, en el inventario, «Zonas de reparto y zonas de exclusión (polígonos en Google Maps); ver zonas colindantes», listado como función vista | **CORREGIR** (dicho, no visto) | 25:00–27:55: la tienda 155 muestra «No existen zonas de delivery para esta tienda» y «No existen zonas de exclusión»; el mapa solo tiene un pin y el «Agregar» de exclusión está deshabilitado. El toggle «Ver zonas de reparto colindantes» queda en OFF todo el tiempo. Hacia 28:04 se pulsa «Agregar» y aparece un **hexágono por defecto** con el campo «Nombre de la zona (requerido)» ([a03](backoffice-video/auditoria/a03-zonas-sin-poligono-y-hexagono.jpg)) | No se dibujó ningún polígono a mano ni se vio una zona de exclusión ni el solapamiento: todo eso es **(D)**. Sí se ve que: (a) una zona nueva nace como un hexágono editable alrededor de la tienda, (b) cada zona tiene nombre obligatorio y toggle de activación, y (c) la exclusión solo se habilita cuando ya existe una zona de reparto |
| C5 | Configuraciones: «monto mínimo para pagar con puntos ("puntos con tema loyalty")» y la regla «monto mínimo para usar puntos (2.000) (V)» | **CORREGIR** | 35:15: el campo dice «Precio mínimo con puntos ($) 2000» ([a08](backoffice-video/auditoria/a08-settings-precio-minimo-puntos.jpg)). Lo que se dice en 35:33 es *«cuál es el precio mínimo para poder **tener** puntos con temas loyalty»* | La etiqueta es ambigua y lo dicho apunta a **acumular** puntos, no a pagar con ellos. Hay que dejarlo como pregunta abierta: ¿mínimo para acumular o para canjear? Afecta el diseño de Loyalty |
| C6 | Grupos de tiendas: «Editar: … cobro de delivery por tramos (4.990–9.999 → $2.000…)», presentado como la configuración del grupo «Piloto Delivery Fee» | **CORREGIR** (matiz) | 36:14: al abrir el grupo, los tramos están en **OFF** y rige el cobro fijo de **990**. Hacia 36:33 el presentador activa el toggle y aparece «Reemplazado por delivery por tramos» ([a06](backoffice-video/auditoria/a06-tramos-activados-en-vivo.jpg)). No se ve si se guardó | La configuración guardada en stage es cobro fijo de 990, con tramos ya cargados pero inactivos. Los tramos se mostraron activándolos en vivo. Además, el cobro fijo y los tramos son **excluyentes**, y el «Desde» de cada tramo está bloqueado (candado): el del tramo 1 es igual al «Precio mínimo para entrega» del grupo (4.990) |
| C7 | Tiendas: «Hay orden por tiempo de entrega y filtros de tiendas cerradas (total, solo delivery, solo pickup) [21:51–22:05]» y, en el inventario, «ordenar, **filtros** (cerradas total o por modalidad)» como función vista | **CORREGIR** (dicho, no visto) | 20:59–22:07: el listado no cambia. El botón «Filtros» y las flechas de orden en «Estimado entrega» y «Estimado retiro» se ven, pero no se usan | Los filtros de cerradas total, solo delivery y solo pickup son **(D)**. Ni el panel ni sus opciones se ven |
| C8 | Horarios: «en la captura se ven franjas que pasan de medianoche (V)» | **CORREGIR** | 26:40 y 29:35: ninguna franja cruza las 00:00. La apertura nocturna se carga como **otra franja del día siguiente**: Sábado «00:00 A 01:00» y «11:30 A 23:45»; Domingo igual. Viernes solo tiene «11:30 A 23:45» ([a07](backoffice-video/auditoria/a07-horarios-madrugada.jpg)) | El modelo actual no admite franjas que crucen la medianoche: la madrugada se registra como franja del día siguiente. Además, los horarios de entrega **no** copian los de tienda: el sábado de entrega no tiene la franja 00:00–01:00. Hay que tenerlo en cuenta al migrar horarios |
| C9 | Última milla: «Por tienda: PedidosYa Envíos, Uber Direct, DispatchTrack (que a su vez usa Uber Direct) y FarEye (toggle)… (D/V)» | **CORREGIR** (precisar V y D) | En la tienda se ve el proveedor «PedidosYa Envíos» (desplegable sin abrir) y «Habilitar Last mile: FarEye» en OFF. Uber Direct y DispatchTrack aparecen como proveedores **a deshabilitar en el grupo** (37:50) y en la API (`external_delivery_company: "uber_direct"`). Lo dicho en 23:24 es «Uber Direct, a través de DispatchTrack» | Por tienda solo se ve PedidosYa Envíos y el toggle FarEye. Que Uber Direct y DispatchTrack sean opciones del desplegable de la tienda es **NO VERIFICABLE** |
| C10 | Recorrido «28:00–29:35 Front `papajohns.cl`» y «22:20–28:00 Editar tienda» | **CORREGIR** (tiempos) | El front empieza en 28:08. Entre 28:00 y 28:07 sigue Editar tienda, con la creación de la zona | Editar tienda: 22:23–28:07. Front: 28:08–29:27 |
| C11 | «Las láminas 2–4 [02:40–03:09]» y «Lámina 1 [00:00–02:40]» | **CORREGIR** (tiempos) | OCR de la URL: la lámina 1 está hasta 00:57 y la lámina 2 desde 00:58 hasta 02:47 | Lámina 1: 00:05–00:57. Lámina 2: 00:58–02:47. Lámina 3: 02:48. Lámina 4: 03:03 (un instante) |
| C12 | API: «`…/v1/stores/delivery?latitude=…`, con `Cache-Control: max-age=0, private, must-revalidate`» | **CORREGIR** (precisar) | 28:57: la URL completa y las cabeceras visibles son las de `near_me`: `https://api.papajohns.cl/v1/pickup_places/near_me?latitude=-33.428332&longitude=-70.61971&quantity_near_stores=3`, `Cache-Control: max-age=0, private, must-revalidate`, `ETag`, `Access-Control-Max-Age: 7200`. De la otra llamada solo se ve `delivery?latitude=…` en la lista de red | El `Cache-Control` corresponde a `near_me`. El prefijo `/v1/stores/` de la llamada `delivery` no se ve: NO VERIFICABLE |
| C13 | Editar combo: «Textos por modalidad… **Card A/B**… Mostrar badge» | **CORREGIR** (menor) | 05:20 y 13:10: «Mostrar Badge» solo existe dentro del bloque «Info para card B (Experimento octubre)». Los campos son «Nombre» y «Nombre para domicilio», no un campo por retiro | El nombre base sirve para retiro y no hay un campo «para retiro». El badge es parte del experimento card B, no del combo base |
| C14 | Bloqueo: «Se bloquea un producto o un ingrediente para una tienda **o para todas**» (fila 31:30) | **CORREGIR** (dicho, no visto) | 31:40: el campo «Tienda *» es obligatorio y su desplegable no se abre. El listado pide «Seleccione una tienda en la parte superior para ver sus productos deshabilitados». Lo de «a todas las tiendas o solo a una» se dice en 31:41 | Bloquear en todas las tiendas es **(D)**. Lo que se ve es un bloqueo por tienda, con un listado filtrado por tienda |
| C15 | Configuraciones (inventario): «Usuarios: puntos que gana el usuario al aplicar su código de invitación» | **CORREGIR** (menor) | 35:10: el campo dice «Puntos que el usuario gana al **ser aplicado** su código de invitación *» | Gana puntos **quien invita**, cuando otro usa su código. La regla del documento («puntos para quien invita») está bien; la fila del inventario no |
| C16 | Grupos de tiendas: «El objetivo de los tramos es el incentivo de ticket… [36:48–37:15]», con el ejemplo «desde 10 mil hasta 14 mil 990» | **CORREGIR** (menor) | En pantalla, el tramo 2 va de 10.000 a **14.999** → $1.000 (36:35). Lo dicho («14 mil 990») no coincide | Usar los valores de pantalla |
| C17 | Métodos de pago: «Corte "Límite compartido: 3 métodos visibles primero"» | **CORREGIR** (añadir) | 32:55: durante 1 s aparece una lista de 7 métodos (Efectivo, Tarjeta, Webpay, Oneclick | Sodexo, Mercado Pago, Fintoc) con «Límite compartido: **4**» y «Guardar cambios» deshabilitado. En 33:00 carga la lista real: 10 métodos, límite 3 | Es un estado de carga o un valor por defecto. Sirve para ver que el catálogo de métodos no es uniforme (ver F4) |
| C18 | Fila 19:30: «Algarrobal… el modo de pick-up está apagado» (implícito en el estado por modalidad) | **CORREGIR** (atribución) | 19:44: Algarrobal (#93) tiene **los dos** íconos en rojo y «Por horario». La frase dicha es *«Algarrobal tiene el modo delivery y el modo de pick-up está apagado»* | Están cerradas las dos modalidades, por horario. El documento no lo afirma de forma explícita, pero conviene no tomar la frase como ejemplo de cierre parcial |
| C19 | Fuente de verdad sobre «Cintor = probablemente Fintoc» | **CORREGIR** (se puede confirmar) | En el front de producción, 28:30 y 29:10, hay un banner «PAGA con **fintoc** y PARTICIPA por una MOTO», y Fintoc está en el orden de métodos | «Cintor» = **Fintoc**, con evidencia visual de una campaña activa con ese medio |

### 2.2 Afirmaciones correctas (resumen verificado)

| # | Afirmación del documento | Veredicto | Evidencia |
|---|---|---|---|
| K1 | Ambiente `backoffice.stage.papajohns.cl`. Se dice «ambiente de pruebas» [05:20] y «no tiene las últimas liberaciones» [32:03] | CORRECTA | OCR de la URL; re-transcripción de 05:15 |
| K2 | Presentación de 7 láminas en `papajohns-backoffice-demo.goldentiger1.chatgpt.site` | CORRECTA | URL `#slide-1`…`#slide-7`; «07 / 07» |
| K3 | Fecha 21-oct-2026, desde las 10:10; útil hasta 44:10; duración 48:07 | CORRECTA | Reloj «Mié 21 oct. 10:15» en 05:00; 2887 s |
| K4 | Menú lateral completo (Productos / Gestión de tiendas / NPS / Configuraciones / Usuarios, con sus ítems) | CORRECTA | 03:10 y 32:55 |
| K5 | Bandera de Chile en la cabecera | CORRECTA | Todas las pantallas del backoffice |
| K6 | Lámina 3: «La oferta aparece donde corresponde. Su alcance depende del canal, despacho y vigencia.» | CORRECTA | 02:50 |
| K7 | Listado de promociones: pestañas Combos/Promos/PapaPartner, columnas, Publicar, Agregar oferta, aviso de 6 destacadas, editar/clonar/eliminar | CORRECTA | 03:25, 04:15. (Promos y PapaPartner no se abren) |
| K8 | Promociones ligadas a menús y menús a tiendas según tipología (chica, mall, regular) | CORRECTA (D) | 03:24–03:58 |
| K9 | Canal de venta y canal de entrega; promos exclusivas por cualquiera de los dos | CORRECTA (D) | 04:17–04:54; campos «Plataforma» y «Método de despacho» en 13:40 |
| K10 | Cita «cualquier cambio… se ve de forma inmediata… casi que mandatorio… no sea una actualización cada X tiempo» | CORRECTA | 05:38–06:02 |
| K11 | Cita «no tiene una capa de caché… esto es in situ» | CORRECTA | 06:05–06:14 |
| K12 | Lucas, de integraciones, pregunta por la tecnología y la conexión | CORRECTA | 06:33–08:02 (además menciona AWS, ver F8) |
| K13 | Esperan un backoffice nuevo en la licitación («Pero nuevo») | CORRECTA | 07:06 |
| K14 | Migración integral de clientes, promociones activas, órdenes y usuarios | CORRECTA | 07:27–07:43 |
| K15 | Les sirve el backoffice de Salesforce o una app en React o Vue | CORRECTA | 09:14–09:26 («Real, Vue» = React, Vue) |
| K16 | Benja: vistas unificadas; tiendas como «commerce + order management»; campañas en Marketing Cloud | CORRECTA | 09:41–12:24 (re-transcripción de 12:00) |
| K17 | Propuesta «el 29» | CORRECTA | 12:54 |
| K18 | Bloque «Info para card B (Experimento octubre)», presentado como experimento | CORRECTA | 05:20; deíctico «en el módulo de arriba» en 13:29 = ese bloque |
| K19 | Campos SEO: nombre, descripción y «Mostrar en página de promociones de SEO» | CORRECTA | 13:10–13:40; deíctico «la página de promociones» en 13:37 = ese toggle |
| K20 | Id cupón de cortesía 76, Personalizable, Id agrupador 8, Posición 1 | CORRECTA | 13:10 |
| K21 | Método de despacho «Ambos», Plataforma «Todas», precios 15000/15000, ingredientes gratis 4, mín./máx. 3/3 | CORRECTA | 13:40 (el deíctico de 13:46, «definir la plataforma… los precios…», calza con la pantalla) |
| K22 | Ocultar promoción, link a `web.stage.papajohns.cl/order-builder/papa-combo-😱😱-3` | CORRECTA | 13:40 |
| K23 | Temporizador: «Plazo máximo… 7 días desde la fecha de inicio» | CORRECTA | 13:55 |
| K24 | Inicio y fin con fecha y hora; disponibilidad por días con hora de inicio y término, o «Todo el día» | CORRECTA | 13:55 (13/05/2025 00:00 – 31/07/2027 23:45; L–D 00:00–23:59) |
| K25 | CYOP: Carne (límite de carnes gratuitas = 2), Premium, Shots, Vegetal | CORRECTA | 14:05–14:30 |
| K26 | Grupos de productos con Opcional, nombre y productos; tipo, producto, variante, «(Solo Crea/Arma tu pizza) Limitar ingredientes», precio delta, posición | CORRECTA | 14:35–15:10 |
| K27 | Opciones de producto: Super Pepperoni, The Works SUPER, Pollo BBQ, Arma tu pizza, Pizza por mitades | CORRECTA | 15:10–16:30 |
| K28 | «Limitar qué ingredientes se muestran» en Arma tu pizza [15:45] | CORRECTA (D/V) | 15:45: está a la vista el campo «Limitar ingredientes», pero su desplegable no se abre; el que está abierto es el de Producto. Las opciones del límite son NO VERIFICABLES |
| K29 | Pizza de reemplazo: «se mostrará automáticamente si ocurre un problema con las opciones de una promo» | CORRECTA | Texto de ayuda en 15:00; el cursor está sobre el toggle en 15:55–16:10, cuando se dice «pizza de reemplazo» (16:02) |
| K30 | Grupo de menús y/o tiendas: Lab Aloha STAGE (Aloha 19) / OLO, Las Condes / Todos, Antofagasta Centro / Todos | CORRECTA | 16:25 (además, la captura 05 muestra «5 de ABRIL!» / OLO) |
| K31 | Imágenes: web 1542×594 webp, app 500×500 webp, versiones delivery, PeYa 1440×1080 JPG/PNG, PapaPuntos 654×784 webp, Tótem 1080×416 / 150×182 / 120×120 JPG | CORRECTA | 16:40–17:00 |
| K32 | Cita «armar una promoción no es trivial» | CORRECTA | 17:02 |
| K33 | Paso opcional de cross-selling con precio exclusivo; KPI de 25–30 % | CORRECTA (D) | 17:13–18:22. La pantalla muestra imágenes de Tótem; en el combo #3 ningún grupo tiene «Opcional» activo |
| K34 | Demo con Arma tu pizza, por ser el producto más vendido y diferenciador | CORRECTA | 15:39 |
| K35 | Orden de promociones con «cronómetros» | CORRECTA (D) | 19:14 |
| K36 | Tiendas: estado por modalidad (íconos verdes o rojos), «Por horario», incidencias («Elemento bloqueado», «13 elementos bloqueados»), estimados 30/15, Publicar, Agregar tienda, clonar | CORRECTA | 19:30 |
| K37 | Panel de promociones asociadas como función nueva y «súper valorada»; caso del Tótem | CORRECTA | 20:08–20:38; panel en 20:15 |
| K38 | ID de tienda para asignar tiendas a un gerente de mercado («5 de Abril, que es el ID 155») | CORRECTA | 20:59–21:48; la fila #155 se ve en pantalla |
| K39 | Editar tienda: pestañas Configuración y Promociones, Clonar Tienda | CORRECTA | 22:30 (la pestaña Promociones no se abre) |
| K40 | Menús asociados: PJ «Menu Regular», Totem «Sin menú asociado», PedidosYa «Menu Peya 2» | CORRECTA | 22:30 |
| K41 | Modo de pedido Domicilio / Retiro en tienda / Cerrar tienda; cerrar depende del perfil | CORRECTA | 22:30; dicho en 23:00–23:17 |
| K42 | Espacios públicos («Estacionamiento Papa Johns Sta Isabel»), «no lo estamos usando» | CORRECTA | 22:55; 23:33 (ver F7) |
| K43 | Identificadores: Aloha, Uber Eats, Ncr Store, Sodexo, Webpay, Zendesk, OneClick, PedidosYa | CORRECTA | 23:20–24:10 |
| K44 | Re-transcripción «PedidosYa, Aloha, que es como el OMS, Uber Eats, Zendesk» | CORRECTA | Mi re-transcripción de 23:45 dice «periodo ya, Aloha, que es como el OMS? Uber Eats, Sendes» |
| K45 | Medios de pago por tienda: Efectivo, Tarjeta, Webpay, Oneclick, Sodexo, Mercado Pago, Fintoc | CORRECTA | 23:35 (activos: Efectivo, Tarjeta, Mercado Pago) |
| K46 | Tiempos: tiempos dinámicos (toggle), personalizados 30/15, ETA constante 12, excepciones periódicas y específicas; «van a desaparecer…», «es la promesa de entrega» | CORRECTA | 24:10–24:53 |
| K47 | Geolocalización: dirección, comuna, región, latitud y longitud, «Localidad para SEO» | CORRECTA | 24:45 (lat/long en gris; Localidad «Arica y Parinacota» para una tienda de Maipú: dato de stage incoherente) |
| K48 | Colindantes «máximo… dentro de un radio de 8km» | CORRECTA (texto) | 25:00. La función no se ejecutó (C4) |
| K49 | Explicación de cómo el front consume el polígono (API de PJ + Google Maps) | CORRECTA (D) | 26:55–27:13 |
| K50 | Front: modal «¿Cómo quieres pedir hoy?», autocompletado, «Cuanto antes (30 min aprox.)», «Más tarde, elige una hora» | CORRECTA | 28:20–28:55 |
| K51 | Retiro: 3 tiendas con promesa o «Programar pedido» | CORRECTA | 29:20 (Providencia «Entrega: 15 min aprox»; Avenida Peru y El Bosque «Programar pedido») |
| K52 | Campos de la respuesta de tienda (`business_hours`, `delivery_areas` con `exclusion`, `enabled_tip_module`, `external_delivery_company: "uber_direct"`, `future_orders_enabled`, `menu_*_id`, `order_method: "both"`, `payment_methods {cash, fpay, tenpo, credit, fintoc, onepay…}`, `seo_business_url`) | CORRECTA | 29:10–29:25 |
| K53 | Front: menú, banner Papa Puntos con 110 puntos, «Repite tu último pedido», WhatsApp | CORRECTA | 28:15 |
| K54 | Horarios de tienda y de entrega separados, con varias franjas por día; «Agregar horario» | CORRECTA | 26:40 |
| K55 | Teléfono y demás datos se ven en el sitio y la app; «guardar y… publicar la tienda» | CORRECTA | En 30:13 («arriba, arriba») la pantalla sube a Nombre y Teléfono; se dice en 30:22 |
| K56 | Lámina 5: bloqueos por tienda; montos y pagos; grupos de tiendas y NPS | CORRECTA | 30:50 |
| K57 | Variante «Familiar / undefined» como defecto de stage | CORRECTA | 32:20 (The Works SUPER) |
| K58 | Nota «si no selecciona una se bloqueará todo el producto»; variantes Todas / Familiar / Mediana | CORRECTA | 31:55, 32:20 |
| K59 | Bloqueo de la variante XL en todas las especialidades, en producción | CORRECTA (D) | 32:01–32:20 |
| K60 | Sustitutos de producto o ingrediente como diferenciador y requisito | CORRECTA (D) | 32:24–32:41 |
| K61 | Métodos de pago: Domicilio y Retiro; texto «Los primeros 6 serán visibles…» frente al límite de 3 (defecto); 10 medios listados | CORRECTA | 33:00 |
| K62 | Cita sobre acuerdos comerciales; mostrar 3 y «ver más» | CORRECTA | 33:07–33:36 (re-transcripción de 33:00) |

### 2.3 Dashboard NPS, Configuraciones, Grupos, cierre y preguntas

| # | Afirmación del documento | Veredicto | Evidencia / corrección |
|---|---|---|---|
| N1 | NPS «se puede abrir por tienda, por grupo o en total» | CORRECTA | La transcripción original tiene un hueco de 34:06 a 34:36. Mi re-transcripción dice: *«aperturado por una tienda específica, por un grupo de tienda o la totalidad»* |
| N2 | «Torre de control» para el negocio y los gerentes de mercado | CORRECTA | 34:36–34:46 |
| N3 | Puntaje, 3554 enviadas y 2 respondidas, histórico Día/Semana/Mes/Año, detalle de notas, NPS por tienda, preguntas Sí/No y de satisfacción, «Ver comentarios» | CORRECTA | 33:55–34:05 («Detalle NPS tiendas»: Papa John's Store Chile STAGE 100, Lab Aloha STAGE −100) |
| N4 | «Filtros por fecha» | NO VERIFICABLE (parcial) | El botón «Filtros» no se abre. Lo único que se ve es `start_date=2026-10-20…&timezone=true` en la URL |
| N5 | Desactivar servicios: API Core, de usuarios, de órdenes | CORRECTA | 35:15 |
| N6 | Mínimo 12.000; máximos 200.000/200.000; pedido anticipado 48 h; ETA cada 15 min | CORRECTA | 35:15 |
| N7 | Delivery fijo 0, delivery gratis desde 0, límite de entrega 40 min, cupón por abandono (Activar + cupón), invitación 25 %, App móvil: «Modal cupones», «Forzar update móvil» | CORRECTA | 35:10–35:52 (no se ve el contenido bajo «Forzar update móvil») |
| N8 | Listado de grupos: «Piloto Delivery Fee» (1) y «Tiendas Delivery» (2) | CORRECTA | 36:05 |
| N9 | Grupo: precio mínimo para entrega 4.990; cobro fijo 990; tramos 4.990–9.999 → 2.000, 10.000–14.999 → 1.000, desde 15.000 gratis; proveedores a deshabilitar; tienda asignada (Alto Hospicio) | CORRECTA (con matiz C6) | 36:14–37:55 |
| N10 | Breadcrumb `storesGroupsUpdate` como defecto | CORRECTA | 36:10 |
| N11 | «Tenemos que tener siempre la capacidad de… una tienda, un grupo, un menú completo, todas o ninguna» | CORRECTA | 36:30–36:41 |
| N12 | Luciano vio el proveedor de última milla en pantalla («scrollearon… Uber Direct») | CORRECTA | La frase de 38:14 calza con la pantalla de 37:50 |
| N13 | Uber Direct directo por API y también a través de DispatchTrack | CORRECTA (D) | 38:55–39:44 |
| N14 | En pedidos de agregadores no ven los datos del cliente; Uber avisa solo al entregar | CORRECTA (D) | 39:44–40:29 |
| N15 | Los tramos no son de loyalty: dependen del total, se calculan en el checkout y no se traspasan al agregador | CORRECTA (D) | 40:38–41:57 |
| N16 | Láminas 6 y 7 y sus textos («¿cómo mantenemos coherencia…?», «Configurar, responder y aprender», objetivo) | CORRECTA | 42:10, 42:35. El objetivo completo es «…cubra los casos reales de cada tienda **y ayude a mantener una experiencia coherente**» |
| N17 | «Nuevo centro de comando» [43:05]; Rodrigo «orgulloso de las capacidades» [43:39] | CORRECTA | Transcripción |
| N18 | Cita de 01:16, «…en el call center y en el tótem» | NO VERIFICABLE | Tanto la transcripción original como mi re-transcripción dicen «y en el todo». «Tótem» es plausible, pero no se oye con claridad |
| N19 | «Minn Navarrete – Salesforce» entre los participantes | NO VERIFICABLE | No aparece en el OCR de los rótulos (muestreo cada 20 s). Sí aparecen Bastian Hidalgo, Lucas Rojas – Salesforce, Salesforce Sala, Benjamin Noguera, Tiago Montezuma, Claudia Quezada, Francisca Arenas, Mateo Silva, «Lucas M…» y «Matías…» |
| N20 | Benja deja «campañas y **cupones**» en Marketing Cloud [12:04] | NO VERIFICABLE (parcial) | Lo de campañas en Marketing Cloud está confirmado. Lo de cupones sale de «la activación de cupos» (12:34), que es ambiguo |
| N21 | Inferencias marcadas como tales (OLO = Online Ordering, PapaPartner = alianzas, agrupador = variantes, el grupo pisa al global) | Sin cambio | Están bien rotuladas como inferencias; el video no las confirma ni las desmiente |
| N22 | Capturas 01–17: ¿la imagen muestra lo que dice la leyenda? | CORRECTA (las 17) | Revisé cada imagen. La 12 muestra la pestaña «Retiro en punto» con la respuesta JSON de `delivery` (tienda Providencia), no la de `near_me`: la leyenda «respuesta de la API de tiendas» sigue siendo válida. La 06 y la 11 muestran además los botones «Limpiar» y «Actualizar» (ver F1) |
| N23 | Correcciones de nombres en la transcripción: Picab = pickup, Disfast/Miss Patch Track = DispatchTrack, Verdaire/WordDire = Uber Direct, Pella/PIA = PedidosYa, Arma Turbiza = Arma tu pizza | CORRECTA | Coinciden con la pantalla: «PedidosYa Envíos», «Uber Direct», «DispatchTrack», «Arma tu pizza», «Retiro en tienda» |
| N24 | Pregunta abierta 1: «Publicar» frente a «inmediato» | CORRECTA, y se puede precisar | El guardado se llama **«Actualizar»** (combo y tienda, con «Limpiar»), **«Guardar»** (grupos) y **«Guardar cambios»** (orden de pagos). «Publicar» solo está en los listados de Promociones y Tiendas. Hay dos pasos: guardar y publicar |

---

## 3. Lo faltante (relevante para costear un backoffice nuevo)

| # | Qué falta | Dónde se ve o se dice | Por qué importa |
|---|---|---|---|
| F1 | **El guardado y la publicación son dos pasos.** Los formularios guardan con «Actualizar», «Guardar» o «Guardar cambios», y los listados de Promociones y Tiendas tienen «Publicar» | Captura 06; 29:35; 36:10; 33:00; 03:25; 19:30 | Define el flujo de publicación del nuevo commerce (borrador → publicado) y la invalidación de caché. Es la base de la pregunta abierta 1 |
| F2 | **Bloqueo de promociones y combos por tienda** (además de productos e ingredientes), con un listado filtrado por tienda | 32:15; 31:35 | Es un módulo más amplio de lo que dice el documento (ver C1) |
| F3 | **Diagnóstico de vendibilidad por promo**: cada promo tiene estado Disponible / No disponible, contadores Publicadas / Disponibles / No disponibles, canales APP/WEB/TOTEM (no aparece PedidosYa) y un detalle desplegable de «N elementos bloqueados» | 20:15 | Es un cálculo en tiempo real que cruza el menú, los bloqueos y los grupos requeridos. Es una de las piezas más caras de replicar |
| F4 | **El catálogo de medios de pago no es uniforme**: la tienda tiene 7 toggles; el orden tiene 10 medios (además Tenpo, Onepay y Rut Pay); la API trae `fpay`, `tenpo`, `onepay`, `credit` | 23:35; 33:00; 29:15 | Al migrar hay que unificar el catálogo de medios y decidir dónde se habilita cada uno. Se suma la expectativa de prender y apagar en forma masiva (C2) |
| F5 | **Zonas de reparto**: una zona nace como hexágono editable, tiene nombre obligatorio y toggle de activación, se borra con «Eliminar esta zona», y la exclusión depende de que exista una zona de reparto. La API expone `delivery_areas[{id, name, exclusion, enabled}]` | 28:04; 29:30; 29:15 | Da el modelo de datos mínimo del editor de polígonos |
| F6 | **Una tienda de laboratorio visible en producción**: «Desde tienda [LAB] Laboratorio Chile PROD v19 – Tienda abierta» en `papajohns.cl` | 28:20 | Hay tiendas de prueba en el catálogo productivo. La migración debe filtrarlas o marcarlas |
| F7 | **Para qué sirven los espacios públicos**: «en una zona que sea pública, un strip center, un parque, un mall… darle protagonismo para que se vea la tienda en esa zona». La API de retiro devuelve `public_spaces: null` | 23:38–23:56; 29:08 | Aunque «no se usa», existe en el modelo y en la API. Hay que decidir si se migra |
| F8 | **Pistas de infraestructura**: Lucas pregunta si «esto es lo que tienen en AWS montado»; la API responde desde `18.164.21.95` (rango típico de CloudFront; es una *inferencia*), con `ETag` y `Access-Control-Max-Age: 7200` | 06:46; 28:57 | Sirve para estimar la integración con la API actual durante la migración o la convivencia |
| F9 | **Otros detalles de UI que suman alcance**: vista lista o grilla en Promociones, Tiendas y Grupos; paginación en Grupos; «Clonar Combo» y «Clonar Tienda»; título de pestaña del front que cambia al salir («No te vayas! 😢» / «Te extrañaremos 😅»), probablemente ligado al cupón por abandono (*inferencia*); textos de ayuda de módulo («Monitorea el NPS… en tiempo real», «Gestiona los grupos de tiendas para aplicar configuraciones masivas») | 03:25; 19:30; 36:05; 05:20; 29:30–30:15; 33:55 | Son elementos menores, pero suman puntos de historia si se pide paridad funcional |

---

## 4. Qué quedó sin poder verificar

- Las opciones de los desplegables que nunca se abren: proveedor de última milla por tienda, «Limitar ingredientes», Tipo en «Grupo de menús y/o tiendas», Canal (solo se ven OLO y Todos), el «⋮» de cada medio de pago, y el selector de Tienda en bloqueos (si existe «todas»).
- Si se pulsó «Guardar» después de activar los tramos (C6) o «Agregar» en el modal de bloqueo. Por lo que se ve, el modal se cerró sin agregar.
- El prefijo completo de la URL `…delivery?latitude=…` (C12).
- Los módulos que solo aparecen en el menú (Campañas, Cupones, Gift Cards, Banners, Órdenes, Reglas, Notificaciones móviles, Clientes, Administradores, Productos) y las pestañas Promos, PapaPartner y Promociones de tienda.
- Cómo se dibuja realmente un polígono, cómo se ven las zonas de exclusión y el solapamiento con tiendas vecinas: solo se describen.
- La cita de «tótem» en 01:16 (N18) y la presencia de «Minn Navarrete» (N19).
