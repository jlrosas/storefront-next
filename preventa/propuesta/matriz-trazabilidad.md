# Papa Johns Chile · Matriz de trazabilidad: qué pide el kit y cómo lo resolvemos

- **Estado:** v2.1, 28-oct-2026. Esfuerzos **preliminares**, base de la estimación; los vacíos se cierran con los supuestos S1 a S24 de la [vista unificada §11](solucion-vista-unificada.md).
- **Alcance:** la propuesta de fase 1 ([vista unificada §3](solucion-vista-unificada.md)): **B2C Commerce** (Storefront Next, SCAPI, Business Manager, Page Designer, Einstein, SLAS, búsqueda con IA de Cimulate) + **Order Management** (registra y sincroniza las órdenes de todos los canales) + **Marketing Cloud** (campañas por WhatsApp con link) + **MuleSoft** (15 APIs). Se mantienen Aloha/NCR, API PJ, Synerise, Zendesk, DispatchTrack, el DWH y el backoffice actual para lo operativo ([§3.1](solucion-vista-unificada.md)).
- **Fuentes:** mapa de capacidades, Kit §01–§09, respuestas `T-n` ([kit](../datos/cliente/kit-pj/README.md), [respuestas](../datos/cliente/preventa/01-respuestas-salesforce.md)) y la demo de su backoffice del 21-oct ([backoffice-video.md](../datos/cliente/backoffice-video.md); se cita como «Video [mm:ss]»).

## Cómo leerla

| Columna | Valores |
|---|---|
| **Tipo** (el que pide el kit) | **Estándar**: viene en el producto · **Config.**: se configura sin código · **Integración**: conectar con un sistema del cliente o de terceros · **Desarrollo**: código nuestro · **Tercero**: herramienta fuera de Salesforce (licencia del cliente) · **Roadmap**: fase posterior · **Servicio**: trabajo que no es software |
| **Resp.** | **AV** = Avatar · **PJ** = Papa Johns · **SF** = Salesforce · **3º** = proveedor externo |
| **Esf.** (esfuerzo de Avatar) | **S** ≤ 5 jornadas · **M** 5–15 · **L** 15–40 · **XL** > 40 · **—** = sin esfuerzo nuestro en la fase 1. Son órdenes de magnitud para priorizar, **no una estimación** |
| **Componentes** | **B2C** = B2C Commerce · **BM** = Business Manager · **PD** = Page Designer · **SN** = Storefront Next · **INT** = MuleSoft · **OMS** = Salesforce Order Management |

---

## 0. Qué cubre esta matriz y qué no

| Fuente del cliente | Cobertura | Dónde |
|---|---|---|
| Mapa de capacidades (57) | 57 de 57 | Sección 2 |
| Back office, Kit §04 (10) + demo del backoffice (3 nuevas) | 13 | Sección 3 |
| Áreas de la propuesta, Kit §03 (6) | 6 de 6 | Sección 4 |
| Casos «¿Qué pasa si…?», Kit §08 (20) | 20 de 20 | Sección 5 |
| Pedidos del kit fuera del mapa | 27 (3 del video) | Sección 6 |
| Requisitos no funcionales (volumetría, SLA, datos) | 11 (1 del video) | Sección 6b |
| Respuestas del cliente a Salesforce (132 técnicas) | 132 de 132 citadas en esta matriz; verificado con un script | Columnas «Resp. del cliente» y sección 6c |
| KPI de éxito, Kit §09 | Los 5 críticos, enlazados a sus capacidades | Sección 6d |
| Producto que resuelve cada requisito | Por producto | Sección 1b |

**No cubre:** las 14 preguntas administrativas (A-n), que son del proceso comercial, ni los perfiles y el diseño visual, que están en `disenos/` y en el [checklist del kit](../disenos/checklist-kit.md).

---

## 1. Resumen

| Cómo se resuelven las 57 capacidades del mapa | N.º |
|---|---|
| Solo estándar o configuración de Salesforce | 12 |
| Integración, sin desarrollo propio | 19 |
| Con desarrollo nuestro (solo o combinado) | 24 |
| Del cliente o roadmap, sin trabajo en la fase 1 | 2 |

De esas 57, **4 usan una herramienta de terceros** del cliente: Google Maps (autocompletar direcciones), plataforma de consentimiento, centro de ayuda y chat. La cobertura (D7-02) reutiliza la lógica actual (S17).

**Las piezas XL (lo que define el costo):**

| # | Pieza | Por qué es XL |
|---|---|---|
| 1 | **D3-03 + D4-04** · Pizza por mitades y combos armables | Lógica a medida sobre el modelo de producto, IDs Aloha por mitad, se cobra la mitad más cara |
| 2 | **D5-02 / D12-02** · Medios de pago | Una integración por medio, más reglas por canal, tienda y modalidad, conciliación e idempotencia. El MVP lleva los medios que hoy acepta la web (S24) |
| 3 | **D12-01** · Integración con la API PJ / NCR / Aloha | Órdenes, estados, quiebres e IDs, vía MuleSoft; el inventario técnico de APIs se hace en discovery |

**Bajaron con los supuestos del 24-oct:** D7-02 cobertura (de XL a M: se reutiliza la lógica actual, S17), X8 app móvil (servicio opcional, S4), O6 dashboard en vivo (de L a XL a M: sobre su BI, S20).

**Los vacíos que más mueven el costo** (ETA, boleta, segmentos de Synerise, notificaciones, call center) están cerrados con supuestos: S18, S19, S5, S22 y S16. Si alguno no se cumple, el esfuerzo cambia como indica la columna «Qué cambia si no se cumple» de la vista §11.


## 1b. Qué producto cumple cada requisito

| Quién lo resuelve | Requisitos | N.º aprox. |
|---|---|---|
| **B2C Commerce** (Storefront Next, SCAPI, Business Manager, Page Designer, SLAS) | D1-01 a D1-04, D2 completo, D3 completo, D4-01 a D4-04, D5-01, D5-04, D5-05, D6-03, D6-05, D7-01, D7-03, D8-01, D8-03, D9-02, D11 completo, D12-03, D13-03, D13-04, X1 (popularidad), X5, X6, X12, X16, X21, X23 | ~40 |
| **Einstein y Cimulate** (búsqueda con IA, en B2C Commerce) | D1-03, D4-05, X21 | 3 |
| **Order Management** | D6-01, D6-02, D6-04 (registro del estado), D10-02 (contexto del pedido), D12-04 (órdenes al DWH), §3-08, S3 | 7 |
| **Marketing Cloud** | X22 | 1 |
| **MuleSoft** | D2-01, D5-03, D6-01, D6-02, D6-04, D7-02, D7-04, D8-02, D8-04, D9-01, D9-02, D9-04, D10-02, D12-01, D12-03, D12-04, X1 (calificación), X2, X3 | ~19 |
| **Sistemas que el cliente mantiene** (Aloha/API PJ, backoffice actual, Synerise, Zendesk, DispatchTrack, DWH) | D5-03 y X27 (backoffice), D6-01, D6-04, D7-02 y D7-04 (backoffice), D8-02, D8-04, D9 completo, D10-01 a D10-03, D12-01, D12-04, X2, X3, X9, X14, X24, O6 | ~22 |
| **Terceros** (herramienta del cliente) | D12-05 (Google), D13-01 (CMP), X13 (sala de espera), X18 (APM); opcionales: X1 (reseñas con texto), X12 (herramienta de A/B) | 6 |
| **Ningún producto: solo desarrollo o servicio** | D3-03 (mitades), X10 (tótem), X11 (conciliación), N1 a N11, servicios S1 a S8 | — |
| **Fuera de la fase 1** | X4 comedor (S23), X8 app nueva (opcional, S4), D10-03, O4 y X19 (Service Cloud + Agentforce, fase futura), X20 | — |

Un requisito puede aparecer en más de una fila, porque varios se resuelven entre Commerce, la integración y un sistema del cliente. **Service Cloud, Loyalty Management y Data Cloud no entran en la fase 1:** lo que tocarían (D9, D10-03, X19) lo cubren sistemas que Papa Johns mantiene o queda para una fase futura ([vista unificada §8.2](solucion-vista-unificada.md)).

---

## 2. Mapa de capacidades del cliente (57)

### D1 · Experiencia digital y descubrimiento

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D1-01 | Contenido web y landings, segmentado | Must | T-88, T-91, T-111 | PD + grupos de clientes; componentes propios en SN | Config. + Desarrollo | AV | M | Supuesto: sin DAM; versiones por convención y video externo ([vista unificada §11](solucion-vista-unificada.md), S6 a S8) | Marketing publica una landing segmentada sin despliegue |
| D1-02 | Navegación y taxonomía | Must | — | Catálogo y categorías de B2C | Estándar + Config. | AV | S | — | Recorrer el menú por categoría en web y app |
| D1-03 | Búsqueda con autocompletado | Should | — | Búsqueda de B2C con IA (Cimulate) | Estándar + Config. | AV | S | Sinónimos y errores en español («peperoni») | Buscar con error de tipeo y encontrar |
| D1-04 | Banners dinámicos por contexto | Should | T-7, T-112 | PD con visibilidad por grupo y programación; segmentos de Synerise vía INT | Config. + Integración | AV | M | Supuesto S5: Synerise entrega atributos con su refresco semanal | Sofía, Diego y Valentina ven banners distintos |
| D1-05 | Chat embebido | Should | T-48 | Widget de Zendesk o Centribal | Tercero + Integración | PJ / AV | S | Centribal sigue atendiendo el SAC por WhatsApp (S10) | Abrir el chat desde la ficha con el contexto |

### D2 · Catálogo y producto

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D2-01 | Catálogo maestro y SKU, sincronizado con todos los canales | Must | T-22, T-66, T-73, T-107, T-108 | B2C maestro de la oferta digital; Aloha dueño de los IDs; INT sincroniza (sección 9) | Config. + Integración | AV | L | Matriz de dueños acordada en discovery | Crear un producto una vez y verlo en web, tótem y un agregador, con su ID Aloha |
| D2-02 | Variantes (tamaño, masa, borde) | Must | T-78 | Producto maestro y variantes | Estándar + Config. | AV | S | 4 tamaños y 4 masas (T-78) contra 3 y 3 (volumetría) | Elegir combinaciones; las inválidas no aparecen |
| D2-03 | Precio por variante, canal, tienda y modalidad | Must | T-74, T-83, T-93, T-94, T-96 | Price books por canal × zona; la lista activa se elige con la **Shopper Context API** (por tienda, segmento de sesión o código de campaña); no en hooks, por la caché | Config. + Desarrollo | AV | L | Límites sobrados (5.000 listas; el cliente usa 9). Pendiente: caché con 9 listas × N tiendas (P12) | Mismo producto, precio distinto en Delivery y Pick Up y por zona |
| D2-04 | Badges («más vendido», «picante») | Nice | T-86 | Datos de venta por producto de B2C (Active Data) + atributos de producto | Config. | AV | S | — | El badge «Más pedida» cambia según las órdenes |
| D2-05 | Co-branding con vigencia | Nice | — | Categorías con vigencia + PD | Config. | AV | S | — | Una línea temática aparece y desaparece en su fecha |

### D3 · Configurador

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D3-01 | Configurador con reglas (mínimos, máximos, dobles) | Must | T-79, T-80, T-84, T-85 | Opciones de producto + componente configurador en SN | Desarrollo | AV | L | Reglas configurables por Comercial | Armar una pizza; la regla inválida guía al cliente (caso 7) |
| D3-02 | Precio dinámico por configuración | Must | T-77, T-79, T-80, T-99 | Opciones con precio + hooks de cálculo del carrito | Desarrollo | AV | M | Redondeo a $90 o $10 (T-99) | El precio cambia en vivo al sumar ingrediente doble |
| D3-03 | Compuestos: mitades y combos armables | Should | T-76, T-77, T-82 | Bundles o sets + lógica propia; IDs Aloha por mitad | Desarrollo | AV | **XL** | Supuesto: mitades y combos armables son desarrollo | Mitades: se cobra la más cara y llega a Aloha con sus IDs |
| D3-04 | Nutrición y alérgenos por configuración | Should | T-81 | Atributos por ingrediente + cálculo | Desarrollo | AV | M | Datos por ingrediente por validar | Las calorías cambian según la configuración |

### D4 · Carrito, precios y promociones

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D4-01 | Carrito persistente entre sesión y dispositivos | Must | — | Basket de SCAPI + unión al iniciar sesión | Estándar | AV | S | — | El invitado inicia sesión y conserva el carrito; sigue en la app |
| D4-02 | Reglas de precio y descuento | Must | T-95, T-115, T-116, T-121 | Motor de promociones de B2C | Estándar + Config. | AV | M | Condiciones por tienda, canal y modalidad pueden pedir calificadores propios | Promo válida solo en Pick Up de una tienda |
| D4-03 | Cupones únicos y de campaña | Must | T-49, T-118 | Cupones de B2C, carga masiva | Estándar + Config. | AV | S | Migrar los cupones vigentes | Cupón ya usado: mensaje con la causa (caso 9) |
| D4-04 | Bundles y combos | Must | T-82, T-122 | Promos de bundle + configurador (con D3-03) | Config. + Desarrollo | AV | L | Se estima junto con D3-03 | «Arma tu Combo» con recargos por extras |
| D4-05 | Upsell y cross-sell | Should | T-3, T-89 | Einstein Recommendations + reglas | Estándar + Config. | AV | M | Einstein necesita historial; arranque en frío | % de pedidos con recomendación (meta 35 %) |

### D5 · Checkout y pagos

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D5-01 | Checkout invitado y registrado, con validaciones y consentimientos | Must | T-90 | Checkout de una página en SN; validación de alcohol | Desarrollo | AV | L | — | Checkout en < 90 s |
| D5-02 | Multi-medio de pago (7 o más) | Must | T-119 | Una integración por pasarela + reglas por canal, tienda y modalidad + BIN | Integración + Desarrollo | AV | **XL** | Supuesto: se reutiliza la experiencia de Avatar con Webpay y Mercado Pago; el MVP lleva los medios que hoy acepta la web (S24) | Cada medio aprueba y rechaza sin duplicar (casos 10, 11, 12) |
| D5-03 | Gift cards | Should | T-120 | Se mantienen en el backoffice actual en la fase 1; Commerce las consulta y redime vía INT (I3) | Integración | AV | M | [Vista unificada §3.1](solucion-vista-unificada.md) | Pagar una parte con gift card |
| D5-04 | Costo de envío en tiempo real | Must | T-98, T-124 | Métodos de envío con tabla de costos por monto, restringidos por grupo de tiendas (probado en el sandbox) + reglas por zona y promo | Config. + Desarrollo | AV | M | Supuesto S18: el ETA lo entrega el sistema actual | Envío gratis sobre $X en la zona Y |
| D5-05 | Registro de consentimientos de la compra | Must | — | Términos aceptados guardados en la orden | Desarrollo | AV | S | Ley 21.719 | La orden guarda la versión de términos aceptada |

### D6 · Pedidos y fulfillment

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D6-01 | Orquestación y enrutamiento (OMS) | Must | T-32, T-61, T-128 | **OMS registra la orden de todos los canales**; Commerce asigna la tienda (D7-02) y MuleSoft entrega la orden idempotente a la API PJ, que sigue hablando con NCR; Aloha la ejecuta en la tienda | Estándar + Integración | AV + PJ | L | [Alcance de OMS](oms/alcance-oms.md) | La orden llega una sola vez a la tienda correcta |
| D6-02 | Seguimiento en tiempo real | Must | T-35, T-123, T-129 | Estados de la API PJ y DispatchTrack → MuleSoft → OMS → B2C; enlace de DispatchTrack | Integración + Desarrollo | AV | L | Estado visible < 10 s después de la cocina | El cliente ve los 4 estados del KDS y el reparto |
| D6-03 | Pedido programado | Should | T-124, T-125 | Franjas por tienda, canal y producto | Desarrollo | AV | M | — | Programar para las 20:30; franja inválida bloqueada (caso 19) |
| D6-04 | Cancelación y reversa de pago y puntos | Must | T-54 | El estado de cancelación llega a OMS y a los canales; la reversa del pago y de los puntos sigue en los procesos actuales | Integración | AV | S | Cancelación parcial, reembolso y reversa de puntos automáticos: fase futura ([alcance de OMS §3.1](oms/alcance-oms.md), [MuleSoft](mulesoft/alcance-mulesoft.md) I13 e I14) | El pedido cancelado se ve cancelado en todos los canales |
| D6-05 | Historial y recompra | Should | T-125 | Historial vía SCAPI + «Repetir» con revalidación | Estándar + Desarrollo | AV | M | Migrar 24 meses de órdenes (T-40) | Repetir un pedido antiguo con precios actuales |

### D7 · Tiendas y cobertura

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D7-01 | Directorio y ficha de tienda | Must | — | Stores de B2C + páginas por tienda | Estándar + Desarrollo | AV | S | — | Ficha con horario y cómo llegar |
| D7-02 | Zonas de cobertura: qué tienda atiende una dirección | Must | T-126 | Lógica actual de cobertura (backoffice y API PJ), que Commerce consulta en línea vía INT (I23) | Integración | AV + PJ | M | Supuesto S17. Si hay que rehacerla, motor de zonas con Google Maps (XL) | Una dirección en el límite cae en la tienda correcta (caso 18) |
| D7-03 | Horarios por tienda y modalidad | Must | T-106 | Stores + horarios por modalidad | Config. + Desarrollo | AV | M | — | Retiro hasta las 23:00 y delivery hasta las 22:30 (caso 1) |
| D7-04 | Estado de tienda en tiempo real (abierta, pausada, saturada) | Must | T-103, T-104, T-106, T-130 | Se opera en el backoffice actual; INT lo lleva a la lista de inventario por tienda vía SCAPI Admin directo en producción (el sitio lo ve en ≤ 60 s); la regla ingrediente → producto en INT | Integración + Desarrollo | AV | L | Señales de logística por definir en discovery | Pausar una tienda y verlo en < 1 min (caso 16) |

### D8 · Identidad y cliente

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D8-01 | Login social, código por correo e invitado | Must | T-21 | SLAS | Estándar + Config. | AV | M | Supuesto: migración en el primer login o acceso con código | Login con Google y con código; fallo de login → invitado (caso 13) |
| D8-02 | Perfil único (online y presencial vía RUT) | Must | T-4, T-16, T-46 | SLAS + Synerise como perfil maestro; llave mail/RUT | Integración | AV | L | La compra presencial con RUT depende de Aloha y Synerise | El mismo cliente se reconoce en web, app y tienda |
| D8-03 | Direcciones y medios de pago guardados | Should | — | Libreta de direcciones de B2C + tokenización en la pasarela | Estándar + Integración | AV | M | Tokenización distinta por pasarela | Comprar con una tarjeta guardada |
| D8-04 | Consentimientos y preferencias | Must | T-24 | Synerise maestro; B2C captura y sincroniza | Integración | AV | M | — | Un opt-out en la web llega a Synerise |

### D9 · Loyalty (Papa Puntos)

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D9-01 | Acumulación y canje | Must | T-8, T-43, T-55, T-64 | Synerise; B2C consulta vía INT con caché, sin bloquear el checkout | Integración | AV | L | Reglas como anexo en discovery (T-52) | Canje en el carrito en < 1 s; con Synerise caído el checkout sigue (casos 8, 17) |
| D9-02 | Catálogo de canje | Should | T-87 | Productos canjeables en B2C + validación en Synerise | Config. + Integración | AV | M | — | Canjear una bebida con puntos |
| D9-03 | Vigencia, topes y combinabilidad | Should | T-53, T-64 | Motor vigente en Synerise | Tercero (existente) | PJ | S | Loyalty no es prioridad (T-38) | El vencimiento se muestra en la cuenta |
| D9-04 | Campañas automatizadas | Should | T-46 | Synerise; B2C emite eventos (S22) | Integración | AV | M | — | Un carrito abandonado dispara el mensaje de Synerise |

### D10 · Atención al cliente

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D10-01 | Centro de ayuda con búsqueda | Must | — | Zendesk Guide (o contenido en PD) | Tercero + Integración | PJ / AV | S | Supuesto: si no tienen Zendesk Guide, las preguntas frecuentes van como contenido en PD | Buscar «¿cuándo vencen mis puntos?» |
| D10-02 | Casos vinculados a pedido o boleta | Must | T-19, T-65 | Zendesk + app lateral con el contexto del pedido que OMS entrega por MuleSoft (EXP-01) | Integración + Desarrollo | AV | M | No hay app de marketplace para B2C: app lateral propia (Zendesk Apps Framework). Mock en la POC | El agente ve pedido, pago, cupón y puntos |
| D10-03 | Canal conversacional y telefónico | Should | T-48 | Centribal/Zendesk hoy; Service Cloud + Agentforce en una fase futura | Tercero / Roadmap | PJ | — | S10: el WhatsApp de Marketing Cloud es solo de salida | — |
| D10-04 | Encuesta post-compra | Nice | — | NPS existente; su calificación alimenta las estrellas de la ficha (X1) | Integración | AV | S | — | Encuesta tras la entrega |

### D11 · Contenido y SEO

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D11-01 | Contenido institucional | Should | — | PD y biblioteca de contenidos | Estándar + Config. | AV | S | — | Publicar una página sin TI |
| D11-02 | SEO técnico y landings programáticas | Should | T-113 | SSR en SN, sitemap, URLs, 301, páginas por tienda | Desarrollo | AV | M | Mapa de redirecciones del sitio actual | Una URL antigua responde 301 a la nueva |
| D11-03 | Storytelling de marca | Nice | — | PD | Config. | AV | S | Fotografía y video del cliente | — |

### D12 · Integración y datos

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D12-01 | Integración con POS (órdenes, disponibilidad, puntos) | Must | T-72, T-75, T-100 a T-102 | INT ↔ API PJ ↔ NCR/Aloha; puntos vía Synerise | Integración | AV + PJ | **XL** | T-34 y T-37 sin respuesta: el inventario técnico de APIs se hace en discovery (S1) | Orden y quiebre de ida y vuelta con una tienda simulada |
| D12-02 | Pasarelas locales | Must | — | Ver D5-02 | Integración | AV | (en D5-02) | — | — |
| D12-03 | API única de oferta para todos los canales | Must | T-20, T-68 | SCAPI para web, app, tótem y call center; los agregadores siguen recibiendo el menú desde el backoffice actual, con la oferta que le entrega INT (PRC-01) | Estándar + Integración | AV | M | Publicación directa a agregadores: etapa 4 de MuleSoft (SYS-08, I17) | Un cambio de precio llega a web, tótem y al menú del agregador |
| D12-04 | Datos de cliente y analítica | Should | T-6, T-18, T-25 | GA4 con data layer + órdenes de todos los canales desde OMS al DWH por INT (PRC-07) | Integración + Desarrollo | AV | M | El BI es del cliente | Una orden web cruzada con su sesión de GA4 en el DWH |
| D12-05 | Geocodificación y mapas | Must | — | Google Maps/Places | Tercero + Integración | PJ (licencia) / AV | M | — | Autocompletar y geocodificar una dirección (caso 18) |

### D13 · Seguridad y cumplimiento

| ID | Capacidad | Prio. | Resp. del cliente | Cómo se resuelve | Tipo | Resp. | Esf. | Supuesto o pendiente | Cómo se prueba |
|---|---|---|---|---|---|---|---|---|---|
| D13-01 | Consentimiento y datos personales | Must | T-24 | Plataforma de consentimiento de cookies (CMP) + Synerise + derechos de acceso y supresión | Tercero + Integración | PJ / AV | M | S21: la CMP la provee el cliente. Ley 21.719 (vigencia prevista para dic-2026) | Sin consentimiento no se cargan tags; una solicitud de supresión se cumple |
| D13-02 | Cumplimiento comercial (Ley del Consumidor) | Must | — | Términos, precios finales, boleta | Desarrollo + Servicio | PJ / AV | S | S19: la boleta la emite Aloha/POS | Revisión legal del cliente |
| D13-03 | Seguridad y PCI-DSS | Must | — | Plataforma PCI de SF + pagos tokenizados + WAF + protección de bots | Estándar + Config. | SF / AV | M | Alcance PCI menor si el pago es alojado por la pasarela | Pentest antes del go-live |
| D13-04 | Auditoría de transacciones | Should | — | Historial de la orden, logs de BM y de INT | Estándar + Desarrollo | AV | M | — | Rastrear un cambio de precio y una orden de punta a punta |

---

## 3. Back office (Kit §04)

La mayoría está en el mapa; esta tabla marca **lo que el mapa no cubre**.

| # | Capacidad | Cubierta por | Lo que falta | Tipo | Esf. |
|---|---|---|---|---|---|
| 01 | Productos y catálogo con IDs Aloha | D2-01, D3-01, D3-03 | — | — | — |
| 02 | Menú, precios y disponibilidad | D2-03, D7-04 | Cambios masivos de precio (herramienta o importación). **Video [03:24]:** cada tienda tiene un menú según su tipología (chica, mall, regular) y otro por canal (propio, tótem, PedidosYa); B2C tiene un catálogo por sitio, así que el surtido por tienda es desarrollo (listas de inventario o atributos por tienda) | Config. + Desarrollo | **M** (era S) |
| 03 | Promociones y reglas | D4-02, D4-04 | **Video [04:25–18:40]:** dos ejes de canal (venta y entrega) con precio, textos e imágenes propios; precio tienda ≠ domicilio; franja horaria; máx. 6 destacadas; temporizador; «pizza de reemplazo»; regla aplicable a tienda, grupo, menú, todas o ninguna [36:32]. Calificadores y atributos propios sobre el motor de promociones, más la pantalla para armarla («no es trivial» hoy) | Config. + Desarrollo | **M** |
| 04 | Cupones, gift cards y loyalty | D4-03, D5-03, D9 | — | — | — |
| 05 | Configuración de tiendas | D7-01 a D7-04 | **Video [22:20–30:40]:** menús por canal, modo de pedido por perfil, IDs de 8 integraciones, polígonos de reparto y exclusión, horarios con varias franjas, tiempos con excepciones, proveedor de última milla, clonar tienda. **En la fase 1:** datos, horarios y modos de la tienda en BM (atributos propios, carga por importación); polígonos, última milla, cierres y excepciones siguen en el backoffice actual ([vista §3.1](solucion-vista-unificada.md)) | Config. + Desarrollo | **M** (era L) |
| 06 | Canales y omnicanalidad | D12-03 | — | — | — |
| 07 | Pagos e integraciones por tienda | D5-02 | Medios e identificadores de comercio por tienda. **Video:** hoy se activan por tienda y se ordenan por modalidad; además piden **prender y apagar medios en masa** [34:57]; su catálogo es incoherente (7 en la tienda, 10 en el orden) | Config. + Desarrollo | M |
| 08 | **Pedidos y última milla: consultar, filtrar por tienda y canal, gestionar incidencias** | **OMS** | OMS registra las órdenes de todos los canales y se consultan y filtran con sus vistas estándar. La consola de incidencias por tienda es fase futura ([alcance de OMS §3.1](oms/alcance-oms.md)) | Estándar + Config. | **S a M** (era L) |
| 09 | **Roles, auditoría, historial y rollback** | BM (roles y logs) | **Flujo de aprobación** y **reversa por cambio**: no existen nativos (documentado); el historial de cambios guarda 1 a 7 días. **Video:** los permisos van por tienda (el gerente de mercado ve solo las suyas); los roles de BM son por sitio y módulo, no por tienda, así que **los permisos por tienda siguen en el backoffice actual**. La aprobación de cambios comerciales en BM es desarrollo, o parte del backoffice nuevo (opciones 2 y 3, vista §5) | Desarrollo | **L** |
| 10 | Reportería por tienda, canal, producto y promoción, con NPS y SAC | — | Ver O6 (S20). **Video [34:00]:** el dashboard NPS sigue en el backoffice actual | — | — |
| 11 | **Diagnóstico por tienda: qué promociones no se pueden vender y por qué** | Backoffice actual | **Video [19:30]:** panel por tienda calculado en el momento. **Sigue en el backoffice actual en la fase 1** (no existe en BM, vista §3.1); replicarlo es parte del backoffice nuevo | — | — (era L) |
| 12 | **Bloqueo de producto, ingrediente, promoción o combo por tienda y variante, con sustituto** | D7-04 | **Video [31:30–32:41]:** bloquear la XL en una tienda; el selector también bloquea **promociones y combos completos**. El bloqueo se sigue operando en el backoffice actual y viaja a Commerce en ≤ 60 s (PRC-02). La regla de sustitución es nueva, en el storefront | Integración + Desarrollo | M |
| 13 | **Configuración general y grupos de tiendas** | D5-04 | **Video [35:10–37:37]:** montos mín. y máx., monto mínimo ligado a puntos (se mantiene la regla actual), pedido anticipado hasta 48 h, apagar canales; por grupo, delivery fijo **o** por tramos (excluyentes; el tramo 1 parte en el mínimo del grupo) y proveedores de última milla deshabilitados. Preferencias de sitio y atributos de tienda | Config. + Desarrollo | S |

**Demostración que pide el kit:** cambio comercial → aprobación → publicación por canal → impacto en una orden → trazabilidad para Operaciones y SAC. Hoy **la aprobación (09) y la trazabilidad para Operaciones (08)** son las partes sin resolver.

**Decisión (24-oct):** el cliente pidió un backoffice o «torre de control» nuevo (Video [07:06]). En la fase 1, **Business Manager toma lo comercial** (catálogo, precios, promociones, cupones, contenido y datos de tienda) y **el backoffice actual sigue con lo operativo** (cierres, bloqueos, zonas, permisos por tienda, menú de agregadores, gift cards, NPS y el panel de la fila 11). Su futuro se evalúa en el camino con tres opciones ([vista unificada §5](solucion-vista-unificada.md)); en las tres, las APIs de MuleSoft se mantienen.

---

## 4. Áreas de la propuesta (Kit §03)

| # | Área | Cómo se responde | Tipo | Resp. | Esf. |
|---|---|---|---|---|---|
| O1 | Marketing digital: del anuncio a la orden; plan de medición y atribución con línea base | Data layer y UTM (D12-04) + plan de medición con fórmula, fuente y línea base por KPI | Desarrollo + Servicio | AV + PJ | M |
| O2 | Gestión comercial: campaña configurable y medible | D2, D4, D9 + reportes | Config. | AV | (incluido) |
| O3 | Autonomía con control: roles, previsualización, aprobación, programación, historial, reversa | BM + PD + §04-09 | Config. + Desarrollo | AV | (en §3) |
| O4 | Journey y FAQ de Papa Puntos respondidas «según las reglas vigentes», con derivación a SAC | Centro de ayuda (D10-01) con las reglas; asistente en fase 2 | Config. + Roadmap | AV / PJ | S |
| O5 | Proceso técnico: arquitectura, fuentes de verdad, APIs, idempotencia, monitoreo y soporte | Documento de arquitectura y plan de integración | Servicio | AV | M |
| O6 | **Dashboard en vivo con alertas, umbrales y vistas por perfil** | Supuesto S20: sobre su BI actual y los reportes de Commerce, OMS y GA4. Si esperan una herramienta nueva, Tableau o CRM Analytics | Integración + Servicio | AV / PJ | **M** (era L a XL) |

---

## 5. Los 20 casos «¿Qué pasa si…?» (Kit §08)

| # | Caso | Capacidades | Cómo se resuelve | Tipo | Esf. adicional |
|---|---|---|---|---|---|
| 1 | Tienda cerrada o fuera de horario | D7-03, D7-04, D6-03 | Mensaje con la causa + otra tienda, pedido futuro o Pick Up | Desarrollo | S |
| 2 | Promo no disponible en la tienda (deep link) | D4-02, X7 | Calificadores de la promo + página de la oferta con alternativa | Desarrollo | S |
| 3 | Monto mínimo de delivery | D5-04 | Faltante exacto + sugerencias o cambio a Pick Up | Config. + Desarrollo | S |
| 4 | Carrito expirado o con cambios | D4-01, D6-05 | Revalidar y mostrar diferencias | Desarrollo | S |
| 5 | Cambio de Delivery a Pick Up | D2-03, D4-02 | Recalcular precio, promos y tiempos conservando el carrito | Desarrollo | M |
| 6 | Ingrediente no disponible | D7-04, D3-01 | Bloquear solo la configuración afectada + sustitutos; la especialidad nunca se bloquea (T-105) | Desarrollo | M |
| 7 | Configuración inválida | D3-01 | Validación de reglas en tiempo real | Desarrollo | (en D3-01) |
| 8 | Papa Puntos insuficientes | D9-01 | Mensaje con la causa sin romper el checkout | Integración | (en D9-01) |
| 9 | Cupón vencido o usado | D4-03 | Mensaje por causa | Estándar + Desarrollo | S |
| 10 | Pago aprobado, orden no confirmada | D5-02, X11 | **Conciliación** automática o asistida | Desarrollo | **M a L** |
| 11 | Doble clic, pedido duplicado | D6-01 | Idempotencia en checkout e INT | Desarrollo | (en D6-01) |
| 12 | Medio de pago no disponible | D5-02 | Filtrar medios por canal, tienda y modalidad | Desarrollo | (en D5-02) |
| 13 | Fallo de login | D8-01 | Continuar como invitado y conservar el carrito | Estándar | S |
| 14 | Deep link roto | X7 | Fallback a una página válida conservando la atribución | Desarrollo | S |
| 15 | El tiempo prometido cambia | D6-02, X3 | Recalcular el ETA antes del pago | Integración | (en X3, S18) |
| 16 | Delivery saturado | D7-04 | Ofrecer Pick Up, otra tienda o pedido futuro | Desarrollo | (en D7-04) |
| 17 | Quiebre parcial del checkout | INT | Degradación controlada: cortacircuitos y continuidad sin loyalty, BIN o promo | Desarrollo | M |
| 18 | Dirección ambigua | D7-02, D12-05 | Corrección manual, sugerencias y asignación transparente | Desarrollo | (en D7-02) |
| 19 | Pedido futuro no disponible | D6-03 | Franja válida o compra inmediata | Desarrollo | (en D6-03) |
| 20 | Caída en peak | X13 | Sala de espera, throttling, mensajes de contingencia, observabilidad | Tercero + Desarrollo | M |

---

## 6. Lo que pide el kit y no está en el mapa

| # | Capacidad | Fuente | Cómo se resuelve | Tipo | Resp. | Esf. | Pendiente |
|---|---|---|---|---|---|---|---|
| X1 | **Ratings & Reviews** | Kit §00-04, §07 | **Fase 1:** popularidad con los datos de venta de B2C (D2-04) y estrellas con la calificación del NPS, que INT trae a un atributo de producto. **Opcional:** reseñas con texto y moderación, con un proveedor | Config. + Integración + Desarrollo (+ Tercero opcional) | AV (PJ si hay tercero) | M | Supuesto S15 |
| X2 | **Notificaciones transaccionales** (confirmación, estado por SMS, push o WhatsApp) | Flujo Online Ordering, journey 9 | Siguen en Synerise, con los eventos de Commerce y los estados que OMS publica por MuleSoft | Integración | AV / PJ | M | Supuesto S22 |
| X3 | **ETA dinámico** | Kit §05, D6-02, caso 15 | Lo calcula el sistema actual (API PJ o DispatchTrack) y Commerce lo consulta en línea vía INT (I23) | Integración | AV | M | Supuesto S18. Si no hay fuente, cálculo propio (L) |
| X4 | **Comedor** como tercera modalidad, con capacidad | Journey 4 | Fuera de la fase 1 | Roadmap | — | — | Supuesto S23 |
| X5 | **Promos bancarias por BIN** (éxito > 99 %) | T-119, KPI §09-04 | Consulta del BIN antes del pago + promoción condicionada | Desarrollo + Integración | AV | M | Depende de cada pasarela |
| X6 | **Imagen dinámica según la configuración** | T-85, Kit §07 | Composición por capas o servicio de imágenes; mínimo: una foto por variante | Desarrollo | AV | M (o S con el mínimo) | Fotografía por ingrediente |
| X7 | **Deep links Web ↔ App** con contexto de campaña | Kit §01-2, §03-01 | Links universales (iOS Universal Links y Android App Links) sobre el dominio de la web, con el código de campaña | Config. + Desarrollo | AV | M | Supuesto S13; la app debe soportarlos |
| X8 | **App móvil** | T-131 | **Servicio opcional:** app nueva para Android e iOS sobre Commerce. Si no se contrata, el equipo de Papa Johns adapta la actual, con soporte nuestro | Desarrollo (opcional) | AV | **XL** si se contrata; soporte estimado aparte | Supuesto S4 |
| X9 | **Pantalla del agente de Call Center** | T-68 | El call center mantiene su herramienta y la conecta a Commerce por SCAPI con un usuario de servicio; el cobro sigue como hoy | Integración | AV + PJ | M (era L) | Supuesto S16. Una pantalla nueva para el agente es desarrollo aparte |
| X10 | **Frontend del tótem** | T-68 | El tótem consume SCAPI y los content assets | Integración o Desarrollo | AV | M | Supuesto: se adapta el frontend actual del tótem; uno nuevo es desarrollo aparte |
| X11 | **Conciliación de pagos** | Caso 10 | Proceso que compara pasarela y órdenes | Desarrollo | AV | M a L | — |
| X12 | **A/B testing y feature flags** (> 2 tests al mes) | T-50, T-67, T-114 | Marco de experimentos con Shopper Context: el front asigna la versión, un grupo de clientes dinámico la activa en promociones, precios, Page Designer y textos alternativos; medición en GA4 y en la orden ([vista unificada](solucion-vista-unificada.md), S14). Herramienta de terceros como opcional | Config. + Desarrollo (+ Tercero opcional) | AV (PJ si hay tercero) | M | El A/B nativo de BM no cubre textos de tarjeta ni está documentado con Storefront Next; flags estáticos (P16) |
| X13 | **Sala de espera y degradación en peak** | Casos 17 y 20 | Sala de espera virtual + cortacircuitos | Tercero + Desarrollo | AV / PJ | M | — |
| X14 | **Boleta o factura electrónica** | D10-02, D13-02 | La emite Aloha/POS, como hoy; Commerce envía los datos con la orden | Integración | AV | S | Supuesto S19. Si la emite el e-commerce, integrar un emisor (L) |
| X15 | **Antifraude** | — (no aparece) | Lo cubren las pasarelas de pago | Config. | AV | S | Supuesto S21. Si hace falta una herramienta, se integra un tercero |
| X16 | **Venta de alcohol** | T-90 | Edad, horario, tienda y modalidad | Desarrollo | AV | S | — |
| X17 | **Migraciones** | T-40, T-113, Video [07:27] | Usuarios desde Cognito, 24 meses de órdenes, URLs con 301; **también las promociones activas** (con slugs con emojis) y la configuración de tiendas, zonas y menús | Desarrollo | AV | L | Volumen de datos; las promociones migradas hay que remapearlas al motor de B2C |
| X18 | **Observabilidad, pruebas de carga y CI/CD** | T-67, KPI §09-06, §09-07 | APM, pruebas de 7× coordinadas con Salesforce, pipeline con flags | Tercero + Desarrollo | AV | M | — |
| X19 | Venta conversacional por WhatsApp | T-48 | Service Cloud + Agentforce sobre el org de OMS | Roadmap | — | — | Fase futura ([vista unificada §5](solucion-vista-unificada.md)). En la propuesta, WhatsApp lleva a la web o la app con un link |
| X20 | Otras marcas o países | T-132 (opcional) | Multisitio de B2C | Roadmap | — | — | Diferenciador; no estimar |
| X21 | **Personalización por segmento** en banner, módulos del Home, orden del menú, promos, ficha y recomendaciones; también por contexto, tienda, canal, ocasión y fuente | T-3, T-5, T-7, T-12, T-112 | Grupos de clientes de B2C alimentados con segmentos de Synerise y la fuente de tráfico + PD + Einstein. **Es el pedido más repetido de la Q&A** | Config. + Integración + Desarrollo | AV | L | Supuesto S5: refresco semanal de Synerise |
| X22 | **Campañas por WhatsApp** a ≥ 5 % de activos y ≥ 3 % de dormidos | T-1, T-2, T-51 | Marketing Cloud con los clientes del e-commerce (exportación programada desde Commerce, opt-in asumido); botón con link universal a la web o la app | Config. + Integración | AV | M | Supuestos S10 a S13 de la vista unificada |
| X23 | **Precio tachado con vigencia y cambios masivos** | T-97, T-117 | Price books con fechas + promociones (7 AON y 2 tácticas por semana) | Estándar + Config. | AV | S | La «nueva card de promociones» por definir en diseño |
| X24 | **Despacho por un tercero; puntos en tiendas y tótem a futuro** | T-127, T-56 | Nada que construir en la fase 1: el despacho lo asigna el tercero desde Aloha; los puntos en tienda son roadmap | Roadmap | — | — | — |
| X25 | **Propinas** | Video (API `enabled_tip_module`) | Monto en el checkout y envío a la orden | Desarrollo | AV | S | Supuesto: se incluye porque la API actual ya lo soporta |
| X26 | **Cupón por abandono y códigos de invitación** | Video [35:10] | Cupones de B2C; el disparo del cupón por abandono, en el front. Los códigos de invitación con Papa Puntos siguen en el backoffice y Synerise | Config. + Desarrollo | AV | S | Supuesto S22 |
| X27 | **Menús para agregadores** (PedidosYa, Uber Eats, Just Eat) | Video [22:20] | El backoffice actual los sigue publicando, con la oferta que le entrega MuleSoft (PRC-01) | Integración | AV / PJ | M | Publicación directa: etapa 4 de MuleSoft (SYS-08, I17) |

## 6b. Requisitos no funcionales

| # | Requisito | Fuente | Cómo se cumple | Resp. | Esf. |
|---|---|---|---|---|---|
| N1 | Experiencia < 2,5 s; APIs críticas P95 < 1 s; recomendaciones P95 < 1 s. **Nosotros proponemos el SLA P50/P95/P99** | T-36, T-41, KPI §09-06 | CDN y caché de SCAPI, SSR de Storefront Next, caché en INT para Synerise y estados; presupuesto de rendimiento por página | AV + SF | M |
| N2 | Disponibilidad ≥ 99,95 % (volumetría) y uptime > 99,9 % (KPI) | Vol., KPI §09 | SLA de la plataforma de Salesforce + diseño de INT sin punto único de falla | SF + AV | (en X18) |
| N3 | Picos de 7×; ~9 K órdenes/hora y 27 K en 3 horas el Día de la Pizza; 70 % entre 18:00 y 21:00 | T-28, T-29, Vol. | Pruebas de carga coordinadas con Salesforce; capacidad de INT y de la API PJ | AV + PJ | (en S5) |
| N4 | Las sesiones informadas (App 260 K, Web 245 K) **no** son concurrencia; la concurrencia real hay que medirla | T-30 | Medir antes de dimensionar; supuesto explícito en la propuesta | AV + PJ | S |
| N5 | Sin pérdida de órdenes ante caídas: colas y reintentos | T-13, T-14 | Colas e idempotencia en INT; caídas de sincronización con tiendas: < 1 evento al año | AV | (en D6-01) |
| N6 | API PJ como puerta única de los canales y los agregadores | T-10, T-11, T-15, T-33, T-60 | INT entrega a la API PJ; los agregadores siguen entrando por ella | AV + PJ | (en D12-01) |
| N7 | Ambiente bajo por cada canal, integración y medio de pago | T-31, T-62 | Plan de ambientes y datos de prueba | AV + PJ | S |
| N8 | Datos de Papa Johns, sin lock-in; 24 meses de historia; consentimiento auditable | T-24, T-25, T-40, T-110 | Exportación al DWH; Synerise como perfil maestro; migración (X17) | AV | (en X17) |
| N9 | Gobierno de KPIs y data lineage de punta a punta («capacidad deseada») | T-26, T-27 | Diccionario de datos y trazabilidad de la exportación al DWH; el lineage completo es del BI del cliente | AV + PJ | S |
| N10 | Plan por fases o MVP en 2027, piloto, sin salir en temporadas peak; Must-have en la demo | T-57, T-59, T-69, T-70 | Plan de implementación; la demo cubre los Must-have ante TD, TI, Comercial y Marketing, y su ambiente queda 2 semanas. **Video [15:39]: la demo debe incluir Arma tu pizza** | AV | (en S1) |
| N11 | **Publicación inmediata, «sin caché»**: un cambio del backoffice se ve al instante en el sitio; «casi mandatorio». Matiz: su backoffice **guarda y publica en dos pasos** (botón «Publicar» en los listados), así que su «inmediato» empieza al publicar | Video [05:59] | Choca con la replicación staging → producción de B2C (la completa invalida caché en ~15 min) y con la caché de página. Vía: precios, inventario y estado de tienda editados en producción por SCAPI Admin o jobs (≤ 60 s); promociones y contenido con replicación granular. Proponer un tiempo objetivo por tipo de cambio en vez de «inmediato» | AV + SF | M |

## 6c. Respuestas sin requisito propio

Se citan para que conste que se revisaron. No agregan trabajo en la fase 1:

| Respuestas | Qué dicen | Efecto |
|---|---|---|
| T-39, T-42, T-44, T-45, T-47 | Loyalty no es prioridad; se mantiene el esquema actual sin niveles | Solo la integración de D9-01 |
| T-58 | Los 20 casos son una biblioteca; en la demo se presentan 5, pero hay que saber resolver todos | Sección 5 completa |
| T-17, T-23 | La edición de contenido, tiendas y zonas está hoy en el Backoffice | Confirma D2-01, D7 y la matriz de dueños |

## 6d. KPI críticos (Kit §09) y qué los mueve

| KPI | Meta | Capacidades que lo mueven |
|---|---|---|
| Conversión App + Web | 25 % | X21, D3-01, D5-01, D7-02, N1 |
| Bounce rate | < 30 % | X21, D1-01, D1-04, N1 |
| Pago aprobado | > 97 % | D5-02, X5, X11 |
| Uptime | > 99,9 % | N2, X13, X18 |
| Cross-selling | 35 % | D4-05, D4-04, X21 |

---

## 7. Servicios (no son funcionalidad, pero se costean)

| # | Servicio | Fuente | Esf. |
|---|---|---|---|
| S1 | Discovery: reglas de loyalty, catálogo, matriz de dueños, inventario de APIs | T-52, T-92 | M |
| S2 | Diseño UX/UI world-class y design system digital | T-109, Kit §07 | L |
| S3 | Fotografía y video (o coordinación con la agencia del cliente) | Kit §00, §07 | Por definir |
| S4 | Plan de medición: ~50 indicadores con fórmula, fuente y línea base antes del go-live | Kit §09, T-9 | M |
| S5 | QA, pruebas de carga y piloto por tiendas | T-70 | L |
| S6 | Gestión del cambio y capacitación de Comercial, Marketing, Operación y SAC | T-71 | M |
| S7 | Gobierno: comité mensual, roadmap trimestral, plan de acción por KPI | KPI §09-08 | Recurrente |
| S8 | Operación post go-live: soporte gestionado, evolutivos, incidencias críticas en < 2 h | T-71, KPI §09-06 | Recurrente |

---

## 8. Siguientes pasos

1. Las preguntas a Salesforce son solo comerciales ([vista unificada §9](solucion-vista-unificada.md)); el registro de las preguntas investigadas está en el [anexo](anexo-preguntas-investigadas.md).
2. Ya no hay preguntas al cliente: los vacíos que más mueven el costo (App, notificaciones, boleta, ETA, zonas de cobertura) están cerrados con supuestos en la [vista unificada §11](solucion-vista-unificada.md) (S4, S17 a S19, S22).
3. Pasar esta matriz a la planilla de costeo: una fila por capacidad, con roles y jornadas.

## Historial

| Fecha | Cambio |
|---|---|
| 28-oct-2026 | v2.1: D12-03 y X27: la publicación directa a agregadores es la etapa 4 de MuleSoft (SYS-08) |
| 24-oct-2026 | v2: alineada con la propuesta de fase 1 (Commerce + OMS + Marketing Cloud + MuleSoft). Cabecera y 1b por producto; D6-01, D6-02, D6-04, D12-03 y D12-04 con OMS; Business Manager vs. backoffice actual en §3 (05, 08, 09, 11, 12); las preguntas al cliente pasan a supuestos S4, S5, S10, S13, S15 a S24; bajan D7-02, X9, O6 y §3-08; X1 con popularidad y estrellas en la fase 1 |
| 23-oct-2026 | v1.5: correcciones de la auditoría del video: §3-07 (activación masiva de medios), 11 (sube a L), 12 (también promos y combos), 13 (puntos por confirmar, tramos excluyentes) y N11 (guardar y publicar) |
| 23-oct-2026 | v1.4: demo del backoffice del 21-oct: §3 suma 11 a 13 y ajusta 02, 03, 05, 09 y 10; X25 a X27; N11 (publicación inmediata); X17 y N10 ampliados |
| 23-oct-2026 | v1: 57 capacidades del mapa, back office §04, áreas §03, 20 casos, 20 capacidades fuera del mapa y 8 servicios |
| 23-oct-2026 | v1.3: ajustes por la investigación en la documentación oficial: D2-03 (Shopper Context), D7-04, D10-02, D12-03, X9 (sube a L), X12, X19 y §04-09 |
| 23-oct-2026 | v1.2: los supuestos de D3-03, D5-02 y D8-01 reemplazan preguntas que ya no se le hacen a Salesforce; referencias como P12, P16 y P18 |
| 23-oct-2026 | v1.1: sección 0 (cobertura), 1b (producto por requisito), X21 a X24, 6b (no funcionales), 6c y 6d; resumen recalculado; verificado que las 132 respuestas técnicas están citadas |
