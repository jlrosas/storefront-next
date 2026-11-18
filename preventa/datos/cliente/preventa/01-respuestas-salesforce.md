# Respuestas de Papa Johns a las consultas de Salesforce (transcripción)

- **Origen:** `PapaJohns-Preventa/SALESFORCE - Respuestas .xlsx` (modificado el 21-10-2026).
- **Qué es:** la planilla oficial de consultas del RFP («Formato Preguntas y Respuestas»), llenada por Salesforce (proveedor «SF») y respondida por Papa Johns. Tiene dos hojas: «Consultas Admin» (14 filas) y «Consultas Técnicas» (132 filas). Columnas: n.º, Nombre Proveedor, Sección y N referencia bases, Preguntas, Respuestas.
- **Cómo leerlo:** la parte 2 es literal, generada celda a celda desde el Excel (sin corregir la ortografía del original). Los IDs `A-n` y `T-n` usan el número original de la fila; `A-1b` es una fila que viene sin número. La parte 1 es nuestra síntesis, con el ID de la respuesta que la respalda.
- **Nota interna en el archivo:** la celda G68 (junto a T-65, Zendesk) tiene el texto «QUEEEEE SI NO SOMOS ZENDESKKKKK». No es respuesta del cliente; es un comentario de alguien de nuestro lado o de Salesforce. **Hay que borrarlo antes de reenviar el archivo a cualquier persona.**

---

## Parte 1 · Síntesis: qué espera Papa Johns (objetivos y decisiones)

### 1. Forma de la propuesta y proceso comercial

- La propuesta debe ser **integral**: licencias más implementación, en una sola oferta (A-10).
- Para el **29-oct** piden «Una propuesta Integral RFP. Propuesta proveedor» (A-11). No mencionan garantías, seguros ni poderes.
- No informan los criterios de evaluación en %, el ROI exigido, la proyección de crecimiento, los vencimientos de contratos ni el commit con AWS: todo «Fuera de alcance» (A-1, A-1b, A-2, A-3, A-4, A-5, A-9).
- La fecha de firma se define con el partner seleccionado (A-6). El alta de proveedor toma ~2 semanas (A-7). Aceptan proveedores extranjeros que facturan desde EE. UU. (A-8). El modelo de contrato (propio o MSA) se define en conjunto (A-12).
- **Piden referencias de clientes, idealmente visitas** (A-13).
- La pregunta A-3 habla del «Contact Center en Peru»: parece arrastrada de otra propuesta. Conviene no repetirla.

### 2. Demo / prueba de concepto

- **Audiencia de la demo:** TD, TI, Comercial y Marketing (T-57). Ofrecen enviar el brandbook (llegó: son los PDF de marca de esta carpeta).
- **La demo debe cubrir como mínimo las capacidades informadas** (T-57, T-69).
- **Casos «¿Qué pasa si…?»:** podemos presentar los **5 que elijamos**, pero debemos ser capaces de resolver los 20 (T-58).
- **El ambiente de la POC debe quedar disponible al menos 2 semanas después de la demo** para que lo prueben (T-59).
- **Personalización visible por segmento:** banner, módulos del Home, orden del menú, promociones, PDP/tarjeta de producto y recomendaciones. Idealmente, cambios visibles entre segmentos (T-7). También por contexto, tienda, canal, ocasión y fuente de tráfico (T-112).
- **SAC/Zendesk en la POC:** hay que mostrar consulta o creación de ticket con el contexto del pedido. Sin sandbox de Zendesk se puede usar un **mock claramente identificado** (T-65).
- **Promociones de referencia para la campaña de la PoC:** «50% XL», «Super Duo», «Arma tu pizza» y combos (T-122).
- Las recomendaciones deben combinar **reglas de negocio configurables y recomendaciones inteligentes en tiempo real** según cliente, contexto, carrito e historial (T-3, T-89).

### 3. Alcance y arquitectura

- **Se reemplaza** la capa de ecommerce y experiencia, y **se evoluciona** el Backoffice. **Se mantienen** Aloha/OMS, Synerise y logística (T-66).
- **Preferencia: headless / API-first y desacoplado.** El proveedor propone el storefront y el CI/CD; buscan despliegues controlados, feature flags y autonomía futura (T-67).
- **Frontera de la orden:** la nueva plataforma gestiona experiencia y comercio, y **entrega la orden a la API Papa Johns / OMS**. OMS/NCR/Aloha siguen ejecutando en tienda (T-32, T-60). La orden se inyecta al OMS existente, que se mantiene, incluidas las franquicias (T-61). **El despacho se crea desde el OMS** y Commerce consume los estados (T-128).
- **Todo el tráfico de los canales digitales pasa hoy por la «API PJ»**, que reenvía a cada integración (T-11, T-15, T-60). Aloha recibe y orquesta las órdenes hacia cocina y tienda vía la API de NCR Aloha (T-10).
- **Capa de integración desacoplada:** Commerce no debería depender de consultar a Synerise en cada interacción crítica (T-12).
- **Idempotencia de la orden** para evitar duplicados (T-14). Las caídas de sincronización con las tiendas son raras: «no es más de un evento al año» (T-13).
- El KDS emite **4 cambios de estado por orden, por webhook** hacia su API (T-35).
- **Autenticación:** hoy centralizada en AWS Cognito, pero esperan «una plataforma adhoc a la experiencia que se diseñe» (T-21).
- **Canales:** principalmente (a) publicar la oferta centralizada y (b) recibir y centralizar las órdenes. El frontend puede variar por canal, pero debe reutilizar los mismos servicios y reglas (T-68). Los agregadores son **Uber Eats, Rappi y PedidosYa**, integrados vía la API PJ (T-33).
- **App iOS/Android:** no han decidido si mantenerla o reconstruirla. La propuesta puede recomendar el enfoque, sobre una arquitectura API-first con migración progresiva (T-131).
- Soportar otras marcas o países es **opcional pero diferenciador** (T-132).
- Cada canal, integración y medio de pago tiene su **ambiente bajo** para certificación y QA (T-31, T-62).
- **Plan:** por fases o MVP, sin salir en eventos de máxima demanda. Referencia: implementación en **2027** con piloto y escalamiento progresivo (T-70).
- **Operación posterior:** modelo híbrido. El partner da soporte o servicio gestionado y evolución; Papa Johns conserva la autonomía comercial y el gobierno (T-71). El stack actual del front se detallará con TI, y se debe evitar la dependencia tecnológica (T-110).

### 4. Cliente, datos y CRM

- **Base de clientes:** 2,5 M en total; 1,2 M activos (con al menos una interacción en los últimos 6 meses); 400 K entre 6 y 12 meses (T-1).
- **Identificador del cliente:** mail y RUT (T-4). La nueva arquitectura debe resolver la identidad y evitar perfiles duplicados (T-16).
- **Segmentación:** se hace en Synerise y en el DWH, con recencia, frecuencia, valor, historial y comportamiento. Se actualiza **semanalmente en Synerise** y mensualmente en el DWH (T-5). Si Synerise segmenta en tiempo real y puede exponerlo: **«POR CONFIRMAR»** (T-63).
- **Synerise convive** como CDP/CRM y como fuente del perfil y de las audiencias activables. Commerce consume esas capacidades (T-46).
- **Los datos son de Papa Johns:** perfil y activación en Synerise, persistencia analítica en el DWH, **sin lock-in** (T-25).
- **Consentimiento** centralizado y auditable, integrado con CRM/CDP (opt-in/out, derechos de acceso y supresión). Hoy se maneja en Synerise y el DWH (T-24).
- **Migración:** conservar al menos **24 meses** de historia (T-40).
- **Analítica:** GA4 más plataformas de medios y BI. La línea base de CAC, ROAS y recompra debe consolidarse **antes del go-live** (T-9). GA4 con un data layer estándar (T-114). Unir el comportamiento digital con la transacción en el DWH/BI (T-18).
- **BI:** el BI corporativo sigue siendo la fuente ejecutiva. La solución expone datos y eventos, y puede traer dashboards operacionales (T-6).
- Hay que fortalecer el gobierno de KPIs; el data lineage es deseado (T-26, T-27).
- **Los clientes de agregadores no son contactables** (T-51).
- **WhatsApp:** el BSP está en evaluación; hoy se usa Centribal para SAC. El canal se proyecta para marketing, servicio y, sobre todo, **venta conversacional end-to-end** (T-48). Meta: comunicarse con al menos el 5 % de los activos y contactar al menos al 3 % de los dormidos de +6 meses (T-2).
- **SAC:** el objetivo es una vista unificada de pedido, pago, estado, cupones, puntos e incidencias (T-19). La respuesta empieza con «Hoy la visión es total», que es ambiguo.
- **Nuevos canales:** hoy exigen bastante integración; buscan servicios reutilizables y menor time-to-market (T-20).

### 5. Loyalty (Papa Puntos)

- **No es prioridad para la adjudicación.** Basta con que la solución pueda integrarse con el motor de loyalty vigente y quede preparada para evolucionar (respuesta estándar en T-38, T-39, T-42, T-44, T-45 y T-64).
- Aun así, **durante el journey piden consulta, acumulación, canje y beneficios en tiempo real**, no solo comunicación (T-8). Papa Puntos está asociado al ecosistema Synerise.
- **Saldo:** la fuente es Synerise/Loyalty y Commerce lo consulta vía API o capa de integración (T-55). Debe ser casi en tiempo real y **no bloquear el checkout**; más de 1 s no es deseable (T-43).
- Se mantiene el esquema actual, sin tiers ni gamificación (T-47). Hay reversa de puntos según causal y estado de la orden (T-54). Las reglas de acumulación y compatibilidad deben ser configurables (T-53). Las reglas se entregarían como anexo en discovery (T-52).
- Hoy los puntos solo se usan en OLO (online). Tiendas y tótem vienen después (T-56).
- El catálogo de canje se relaciona con la carta y además tiene productos exclusivos (T-87).

### 6. Catálogo, configurador y precios

- **Se requiere un MDM de producto** (o una capa equivalente) como fuente de verdad, con sincronización omnicanal (T-22).
- **Origen de cada dato hoy:** productos y recetas en Aloha más Backoffice; precios en Backoffice/Aloha; promos y cupones en Backoffice (Comercial); quiebres en Backoffice (Operación); estado de tienda en Backoffice (Operación/TI). Buscan una gobernanza clara (T-107). Un producto nuevo se crea en **ambos** sistemas y quieren reducir esa duplicidad (T-73).
- **El mayor trabajo manual hoy** está en sincronizar catálogo, precios, promos y disponibilidad entre canales, en las aperturas de tienda y en los agregadores (T-108).
- **Variantes:** 4 tamaños, 2 bordes y 4 tipos de masa, con restricciones por masa y borde (T-78). Ojo: la volumetría dice 3 tamaños y 3 masas (ver `03-volumetria-xlsx.md`).
- **Pizza por mitades:** es una configuración de pizza, con IDs Aloha específicos por mitad. **Se cobra la mitad de mayor valor.** No se vende media pizza suelta (T-76, T-77).
- **El borde** es un modificador y puede llevar recargo o ID operativo según la variante (T-79).
- **Ingredientes:** se pueden agregar y quitar según las reglas del producto. Los límites, las porciones dobles y los precios deben ser configurables (T-80).
- **Especialidades y «Arma tu pizza»:** al modificar una especialidad, el cambio se maneja como modificador (T-84).
- **Combos:** los hay fijos y configurables, con elección por categoría, personalización de cada pizza y recargos por extras (T-82).
- **La oferta varía por día, horario, canal, tienda y modalidad.** Puede haber precio distinto por modalidad o canal (T-83, T-96).
- **El precio depende de tienda, canal y modalidad.** La comuna solo influye en qué tienda atiende (T-93). La estrategia de precios es central (T-74).
- **Listas de precios:** agregadores, tótem y OLO, y cada una con 3 zonas (T-94).
- **Precio tachado con vigencia:** «viene en nueva card de promociones» (T-97). Los cambios masivos requieren coordinar Backoffice y Aloha.
- **Redondeo:** puede terminar en $90 o en múltiplos de $10; «puede ser ambos» (T-99).
- **Costo de despacho:** configurable por tienda, zona, monto o promoción, con mínimos de compra según modalidad o promoción (T-98).
- **Imagen:** idealmente dinámica según la configuración; como mínimo, una imagen de alta calidad por producto o variante (T-85).
- **Badges:** hoy son manuales; también quieren etiquetas data-driven, como «más vendido» (T-86).
- **Nutrición:** existe por producto o variante. Los alérgenos por ingrediente y el cálculo dinámico están por validar (T-81).
- **Alcohol:** validar la edad y las restricciones legales de horario, tienda/zona y modalidad (T-90).
- **Convenios y precios especiales:** con bancos, partners y cupones. La facturación B2B no es core (T-95).
- **El menú cambia con frecuencia** y debe poder programarse y publicarse sin desarrollo (T-88). Compartirán la estructura del catálogo en discovery (T-92).

### 7. Disponibilidad y estado de tienda

- Hoy el quiebre se bloquea **a mano en el Backoffice**, por tienda (producto, ingrediente o promo), y la reactivación también es manual. **Quieren automatizar la dependencia ingrediente → producto** (T-75, T-102, T-103).
- No hay stock de ingredientes en tiempo real para el ecommerce. Los envasados se cuentan por unidad, pero sin control automático (T-100, T-101, T-104).
- **«Agotado» configurable:** mostrarlo cuando ayude y ofrecer alternativas, u ocultarlo según la regla comercial. **Una especialidad nunca debe bloquearse: hay que ofrecer productos o ingredientes sustitutos** (T-105).
- La saturación o falta de repartidores hoy se marca en parte a mano; quieren automatizar capacidad, pausas y alternativas para el cliente (T-130).
- El estado de tienda, la cobertura y las zonas se configuran en el Backoffice (T-23, T-106, T-126).

### 8. Promociones, cupones, gift cards y pagos

- **Promos activas por semana:** 7 «AON» y 2 tácticas. Tipos: combos, %, envío gratis, regalo, etc. (T-117). La volumetría dice 10 AON + 5 tácticas.
- **Las promociones varían** por tienda, canal, zona y modalidad, con definición central (T-116). Todo se configura en el Backoffice (T-115).
- **Cupones:** códigos únicos y masivos, cargados por CSV en el Backoffice y distribuidos por CRM, partners y otros canales (T-49, T-118).
- **BIN:** hoy Mercado Pago lo valida en tiempo real; en otros casos depende del adquirente. La nueva solución debe orquestar la elegibilidad y el descuento (T-119).
- **Gift cards:** se configuran en el Backoffice, con monto, vigencia y saldo consumible (T-120).
- **Descuento hacia Aloha:** viaja asociado a códigos o reglas de Aloha; el mapeo exacto vendrá en el diseño de integración (T-121).

### 9. Contenido, marketing y diseño

- **Marketing y Comercial deben gestionar sin desarrollo** el Home, las landings, los banners, los splash y pop-ups, el contenido de la PDP, el orden de módulos y menú, y las campañas (T-111).
- Hoy imágenes y descripciones viven en el Backoffice; **quieren integrar un CMS/DAM** (T-91).
- **SEO:** preservar el equity; mantener las URLs cuando se pueda y usar 301 controlados (T-113).
- **A/B testing:** al menos 2 tests al mes al inicio, sobre Home, PDP, promos, mensajes, orden de módulos y checkout (T-50). La herramienta actual no condiciona; la plataforma debe soportar experimentación y feature flags (T-114).
- **Diseño:** existe guía de marca; el design system digital está por validar. **Esperan que el partner proponga una experiencia world-class alineada a Papa Johns**, no que ejecute diseños existentes (T-109).

### 10. Logística y pedidos

- La última milla la gestiona **un tercero**, que asigna y despacha (T-127).
- DispatchTrack tiene seguimiento operacional; las APIs y eventos están por confirmar. La solución debe consumir estados y tracking en tiempo real (T-129).
- Hoy existen la orden futura y «repetir pedido» (T-125).
- **Sin respuesta concreta:** qué sistema calcula el ETA y si expone ETA, ventanas y costo por API (T-123, T-124); cuántas llamadas genera una orden (T-34); límites de tasa de los sistemas destino (T-37). Esas cuatro respuestas son solo la frase estándar.

### 11. Volumetría y desempeño (complementa la volumetría)

- **Día de la Pizza:** el peak fue entre las 18:00 y las 20:00, con ~27 K órdenes, «casi 9 K por hora» (T-28).
- **Franja de mayor demanda:** ~3 horas en la tarde, de 18:00 a 21:00 (T-29).
- **Las cifras de concurrencia (App 260 K, Web 245 K) son sesiones, no concurrencia simultánea.** La concurrencia real hay que medirla (T-30).
- **Rendimiento:** experiencia del usuario bajo 2,5 s; APIs críticas con P95 bajo 1 s, idealmente. **Nos piden proponer el SLA P50/P95/P99** (T-36). Las recomendaciones no deben degradar la navegación, con P95 bajo 1 s (T-41).

### Respuestas que no dicen nada nuevo

Muchas respuestas parten con la misma frase: «La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.»

- **Solo esa frase, sin más contenido:** T-34, T-37, T-123 y T-124.
- **La frase más una respuesta concreta:** T-4, T-6, T-10, T-11, T-12, T-14, T-16, T-17, T-21, T-23, T-29, T-31, T-33, T-35, T-36, T-60, T-69, T-106, T-115, T-126 y T-127.

Esa insistencia es un mensaje en sí: **la propuesta debe ser de experiencia del cliente por segmento (Sofía, Diego y Valentina) en todos los canales**, no solo de plataforma.

### Datos que no cuadran entre documentos

| Tema | Respuestas SF (este archivo) | Otro documento |
|---|---|---|
| Clientes activos | 1,2 M activos a 6 meses; 2,5 M en total (T-1) | Volumetría xlsx: «activos: 1.5M» |
| Tamaños y masas | 4 tamaños, 2 bordes, 4 masas (T-78) | Volumetría xlsx: 28 pizzas × 3 tamaños, 3 tipos de masa |
| Promos simultáneas | 7 AON + 2 tácticas por semana (T-117) | Volumetría xlsx: 10 AON + 5 tácticas |
| WhatsApp | 5 % de activos + 3 % de dormidos (T-2) | Volumetría xlsx: recuperar al menos el 2 % de inactivos, 10 K |
| Loyalty | «no es prioridad de evaluación» (T-38…) | T-8: consulta, acumulación y canje en tiempo real durante el journey |

---

## Parte 2 · Transcripción literal

### Hoja «Consultas Admin»

Título de la hoja: «Consultas y Preguntas Administrativas».

#### A-1 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> Cuándo vencen los contratos de Synerise, Zendesk y otras herramientas que podrían reemplazarse?, favor indicar fechas de vencimiento para cada uno de estos contratos.

**Respuesta Papa Johns:**
> Fuera de alcance

#### A-1b · Kit 05 · Ecosistema · (fila sin número en el original)

**Proveedor:** SF

**Pregunta:**
> Alguno de los anteriores: Synerise, Zebdesk, otros, tienen cláusulas/costos adicionales de salida?. Indicar cuáles son estos costos si existen.

**Respuesta Papa Johns:**
> Fuera de alcance

#### A-2 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> ¿Cuánto es el commit vigente con AWS (EDP, PPA u otro compromiso de gasto)? Indicar el monto anual y total en USD, y las fechas de inicio y término.

**Respuesta Papa Johns:**
> Fuera de alcance

#### A-3 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> Cual es el costo de planilla (sueldos personal + licenciamiento Zendesk + Proveedor Contact Center + otros costos) de operar el Contact Center en Peru? Tienen algun costo de salida del modelo actual?

**Respuesta Papa Johns:**
> Fuera de alcance

#### A-4 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> ¿Qué retorno debe mostrar el proyecto para aprobarse (payback máximo, VAN o TIR mínima) y en qué horizonte (3 o 5 años)?

**Respuesta Papa Johns:**
> Fuera de alcance

#### A-5 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> Pueden clarificar por favor cuáles serán los criterios de evaluación para este RFP en % (Propuesta Económica, cumplimiento técnico, Look & Feel de la página)

**Respuesta Papa Johns:**
> Fuera de alcance

#### A-6 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> Podrían indicar la fecha esperada de firma del contrato?

**Respuesta Papa Johns:**
> Se definirá con el Partner selecccionado

#### A-7 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> Podrían clarificar el proceso de creación de proveedor?, sus timings y requerimientos.

**Respuesta Papa Johns:**
> Aproximadamente 2 semanas

#### A-8 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> El proveedor de licencias americana cobra y emite facturas en los EEUU, por favor confirmar que trabajan con proveedores extranjeros.

**Respuesta Papa Johns:**
> Si confirmamos

#### A-9 · Kit 05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> Que crecimiento proyectan en Ventas/GMV/Pedidos para los siguientes 5 años? Sobre la base actual.

**Respuesta Papa Johns:**
> Fuera de alcance

#### A-10

**Proveedor:** SF

**Pregunta:**
> ¿Esperan una oferta única (licencias + implementación) liderada por un integrador, o licencias de Salesforce y propuesta del partner por separado? ¿Puede presentarse más de un partner con un mismo fabricante?

**Respuesta Papa Johns:**
> La propuesta debe ser integral

#### A-11

**Proveedor:** SF

**Pregunta:**
> ¿Qué documentos exigen el 29-oct (garantías o boletas, seguros, certificados de vigencia, poderes)?

**Respuesta Papa Johns:**
> Una propuesta Integral RFP. Propuesta proveedor

#### A-12

**Proveedor:** SF

**Pregunta:**
> ¿Usan su propio modelo de contrato o aceptan el MSA del proveedor?

**Respuesta Papa Johns:**
> Por definir con el partner a seleccionar lo importante es que se trabaje en conjunto

#### A-13

**Proveedor:** SF

**Pregunta:**
> ¿Valoran referencias de clientes? ¿En qué formato: llamada, visita o caso escrito?

**Respuesta Papa Johns:**
> si esnecesario referencia. Ideal Visitas

_Total filas con pregunta en la hoja: 14_

### Hoja «Consultas Técnicas»

Título de la hoja: «Consultas y Preguntas Técnicas».

#### T-1

**Proveedor:** SF

**Pregunta:**
> Respecto a la Volumetría de clientes y prospectos, se puede asumir una base contactable de 1M aprox? (Clientes, leads, inactivos)

**Respuesta Papa Johns:**
> base total: 2,5M. Activos 1.2 (se considera que  haya tenido almenos una interaccion los ultimos6 meses),  +6  meses a 12 meses 400K.

#### T-2

**Proveedor:** SF

**Pregunta:**
> Respecto a WhatsApp, se debe considerar en la fase inicial de este proyecto? Favor de indicar volumetría proyectada

**Respuesta Papa Johns:**
> se espera comunicar a segmentos de clientes, partir por al menos el 5% de los activos y contactar al menos al 3% de los adormidos/abandonados (+ 6 meses)

#### T-3

**Proveedor:** SF

**Pregunta:**
> Respecto a las "Recomendaciones inteligentes" significa recomendación de producto en tiempo real, o reglas de negocio configurables?

**Respuesta Papa Johns:**
> Ambas: reglas de negocio configurables + recomendaciones inteligentes en tiempo real según cliente, contexto, carrito e historial.

#### T-4

**Proveedor:** SF

**Pregunta:**
> Cuál es el identificador único del cliente entre Web, App, Call Center, Tótem y WhatsApp? ¿Dónde se resuelve hoy la identidad?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Respondiendo a la pregunta, Mail y RUT hoy en dia funciona como identificador para el cliente

#### T-5

**Proveedor:** SF

**Pregunta:**
> Cómo se calcula hoy cada segmento (Heavy, Switcher, Lapsed)? Confirmar si es en Synerise, con qué datos y con qué frecuencia?

**Respuesta Papa Johns:**
> La segmentación hoy se mueve en Synerise yennuestro data warehouse  usando recencia, frecuencia, valor, historial y comportamiento. Se actualiza de forma semanal en synerise ymensual en nuestro data wh

#### T-6

**Proveedor:** SF

**Pregunta:**
> ¿Esperan que el dashboard de marketing sea parte de la solución a proponer o que se alimente de su propio BI?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales. El BI corporativo debe seguir siendo la fuente ejecutiva. La solución debe exponer datos/eventos y puede incluir dashboards operacionales, sin reemplazar el BI.

#### T-7

**Proveedor:** SF

**Pregunta:**
> ¿Qué parte de la personalización debe verse en la POC: banner, orden del menú o recomendaciones?

**Respuesta Papa Johns:**
> Todo: banner, módulos del Home, orden del menú, promociones, PDP/tarjeta de producto y recomendaciones.ideal que puedamostrar cambios visibles por segmento.

#### T-8

**Proveedor:** SF

**Pregunta:**
> ¿Papa Puntos corre en Synerise o en otro sistema? Por favor confirmar si requieren recompensas y ofertas en tiempo real o solo comunicación?

**Respuesta Papa Johns:**
> Papa Puntos está asociado al ecosistema Synerise. Requerimos consulta, acumulación/canje y beneficios en tiempo real durante el journey, no solo comunicación.

#### T-9

**Proveedor:** SF

**Pregunta:**
> Favor de confirmar con qué herramienta miden hoy la atribución? ¿Hay una línea base de CAC, ROAS y recompra?

**Respuesta Papa Johns:**
> Hoy se utiliza GA4 complementado con plataformas de medios/BI. CAC, ROAS y recompra deben consolidarse como línea base común antes del go-live.

#### T-10

**Proveedor:** SF

**Pregunta:**
> ¿Cómo se comunican hoy sus aplicaciones Web/App con el sistema de cocina/caja en los locales ?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> La API de NCR Aloha se encarga recibir y orquestar las ordenes hacia la cocina/tienda

#### T-11

**Proveedor:** SF

**Pregunta:**
> ¿Tienen una API centralizada para enviar los pedidos o la conexión se hace punto a punto con cada tienda?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Se ingresan via api PJ y se envian al OMS mediante api NCR Aloha

#### T-12

**Proveedor:** SF

**Pregunta:**
> ¿Prefieren que el nuevo Commerce consulte a Synerise directamente en cada clic, o buscan una capa intermedia que gestione las comunicaciones entre el Commerce, el CRM y las App/Web?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales. El BI corporativo debe seguir siendo la fuente ejecutiva. La solución debe exponer datos/eventos y puede incluir dashboard /Preferimos una capa desacoplada de integración/orquestación; Commerce no debería depender de consultar Synerise en cada interacción crítica.

#### T-13

**Proveedor:** SF

**Pregunta:**
> ¿han experimentado caídas o demoras en la sincronización de pedidos hacia las tiendas?

**Respuesta Papa Johns:**
> no es mas de un evento al año

#### T-14

**Proveedor:** SF

**Pregunta:**
> ¿Buscan implementar una infraestructura con colas de procesamiento para evitar que se pierdan ventas si un local o pasarela de pago falla temporalmente?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Se debe manejar la idempotencia de la orden para evitar duplicados

#### T-15

**Proveedor:** SF

**Pregunta:**
> ¿Cuentan actualmente con un estándar único para exponer APIs hacia la Web, App, WhatsApp y Tótems, o cada canal consume servicios desarrollados de manera independiente?

**Respuesta Papa Johns:**
> Todo el consumo y trafico de informacion desde y hacia los canales digitales es a traves de nuestra api PJ y luego enviada al canal o integracion correspondiente

#### T-16

**Proveedor:** SF

**Pregunta:**
> ¿Tienen problemas de duplicidad de datos entre compras en la Web/App y compras en locales físicos?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales. La nueva arquitectura debe resolver identidad y evitar duplicidad de perfiles/datos

#### T-17

**Proveedor:** SF

**Pregunta:**
> ¿En qué sistema se configura originalmente el catálogo de productos y precios por tienda? ¿El equipo comercial debe cargar los combos manualmente en múltiples plataformas o buscan una fuente única de verdad sincronizada automáticamente?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Toda la edicion de contenido en los canales digitales es realizada en nuestro backoffice

#### T-18

**Proveedor:** SF

**Pregunta:**
> Para medir el éxito de campañas como "Arma tu Combo", ¿requieren consolidar en tiempo real los datos transaccionales del Commerce con el comportamiento de navegación en un Data Lake o Data Warehouse centralizado?

**Respuesta Papa Johns:**
> Sí. Necesitamos unir comportamiento digital y transacción para medir campaña, funnel, conversión, incrementalidad y rentabilidad en el DWH/BI.

#### T-19

**Proveedor:** SF

**Pregunta:**
> Cuando un cliente llama a Servicio al Cliente por un pedido atrasado o cancelado, ¿el operador puede ver en una sola pantalla el historial unificado (pagos, estado en Aloha, cupones aplicados y puntos)?

**Respuesta Papa Johns:**
> Hoy la visión es total. El objetivo es que SAC tenga una vista unificada de pedido, pago, estado, cupones, puntos e incidencias.

#### T-20

**Proveedor:** SF

**Pregunta:**
> Ante la integración de un nuevo canal de venta en el futuro (ej. una nueva App o canal conversacional), ¿cuánto tiempo y esfuerzo técnico les toma conectarlo a su infraestructura actual?

**Respuesta Papa Johns:**
> Hoy requiere integración y coordinación técnica relevante. Buscamos que nuevos canales consuman servicios reutilizables y reduzcan drásticamente el time-to-market.

#### T-21

**Proveedor:** SF

**Pregunta:**
> ¿Buscan centralizar la gestión de tokens de autenticación (Cognito), políticas PCI-DSS para tarjetas y privacidad de datos (GDPR/Habeas Data) en una sola capa de integración segura en lugar de implementarlo individualmente en cada sistema?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> La plataforma centraliza la autenticacion en AWS Cognito pero se espera una plataforma adhoc a la experiencia que se diseñe

#### T-22

**Proveedor:** SF

**Pregunta:**
> Se requiere Gestión Unificada del Catálogo y Precios (MDM de Producto)?

**Respuesta Papa Johns:**
> Sí. Se requiere gestión unificada de catálogo y precios o una capa equivalente de fuente de verdad y sincronización omnicanal.

#### T-23

**Proveedor:** SF

**Pregunta:**
> ¿Cómo se gestiona la fuente maestra de locales, zonas de cobertura (geocodificación) y sus respectivos horarios o estados operativos? ¿Los cambios en la ficha de un local se reflejan de forma centralizada para todos los canales?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Toda la edicion de contenido en los canales digitales es realizada en nuestro backoffice

#### T-24

**Proveedor:** SF

**Pregunta:**
> ¿cuentan con una herramienta centralizada para gestionar el ciclo de vida del consentimiento (opt-in/opt-out de marketing) y garantizar el derecho de supresión/acceso a datos personales de forma auditable? ley de protección detos.

**Respuesta Papa Johns:**
> Si a traves de synerise y en el dwh. El consentimiento debe quedar centralizado, auditable e integrado con CRM/CDP, incluyendo opt-in/out y derechos de acceso/supresión conforme a la normativa vigente.

#### T-25

**Proveedor:** SF

**Pregunta:**
> Donde esta pensado vivan los datos de los clientes?

**Respuesta Papa Johns:**
> Los datos son propiedad de Papa Johns. Esperamos perfil/activación en CDP-Synerise y persistencia analítica en el repositorio corporativo/DWH, evitando lock-in.

#### T-26

**Proveedor:** SF

**Pregunta:**
> ¿Existen definiciones estandarizadas y reglas de calidad automatizadas para KPIs críticos del negocio?

**Respuesta Papa Johns:**
> Hay KPIs definidos, pero necesitamos fortalecer gobierno, definición única, calidad y trazabilidad automatizada de métricas críticas.

#### T-27

**Proveedor:** SF

**Pregunta:**
> Si un ejecutivo de negocio necesita entender el origen de un dato (por ejemplo, cómo se calcula el acumulado de Papa Puntos o el volumen de carritos abandonados), ¿tienen visibilidad del lineaje del dato (data lineage) desde que se genera en la app/web hasta que llega al Data Warehouse/Analítica?

**Respuesta Papa Johns:**
> Si, aunque hou el lineage no está completamente visible end-to-end. Es una capacidad deseada para datos y KPIs críticos.

#### T-28 · Volumetría, bloque Transacciones, "Órdenes máximas por hora / minuto"

**Proveedor:** SF

**Pregunta:**
> ¿Cuál es el máximo de órdenes por hora y por minuto (P95, P99 y máximo absoluto) observado en el último Día de la Pizza y Cyber, desglosado por canal?

**Respuesta Papa Johns:**
> Dia De la Pizza: el peak de ordenes se dio entre las 18 y 20horas,llegandoa 27K,casi 9K por hora

#### T-29 · Volumetría, bloque Transacciones, "Órdenes por franja: Peak"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántas horas dura exactamente la franja peak que concentra el 70% de las órdenes diarias? ¿Es la misma franja en días normales y en eventos peak?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> La franja de mayor demada es de 3 horas aprox en las tardes (6-9 PM)

#### T-30 · Volumetría, bloque Transacciones, "Concurrencia máxima"

**Proveedor:** SF

**Pregunta:**
> La concurrencia peak informada (App 260 mil, Web 245 mil), ¿es simultánea, por hora o por día? ¿Qué porcentaje de esas sesiones llega a ejecutar llamadas a sistemas de back-end (carrito, pago, orden)?

**Respuesta Papa Johns:**
> Las cifras informadas corresponden a volumen de sesiones, no deben asumirse como concurrencia simultánea. La concurrencia real y % que llama backend deben medirse.

#### T-31 · Volumetría, bloque Tecnología e integraciones, "Integraciones críticas"; Kit §03 "Proceso técnico"

**Proveedor:** SF

**Pregunta:**
> ¿Pueden entregar el inventario técnico final de integraciones (sistema, protocolo REST/SOAP/SFTP/eventos, versión, dueño y ambiente de pruebas)? Se puede cubrir Aloha, NCR Cloud Connect, DispatchTrack, Synerise, Zendesk, pasarelas de pago, GA4, data warehouse y agregadores.

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Cada canal e integracion cuenta con su respectivo ambiente bajo

#### T-32 · Kit §03 "Proceso técnico" (nota final) y §05 "Ecosistema"

**Proveedor:** SF

**Pregunta:**
> ¿Dónde termina la nueva plataforma y dónde empieza Aloha/OMS? ¿La capa de integración debe orquestar la orden hasta NCR Cloud Connect o solo entregarla a la API de Papa Johns?

**Respuesta Papa Johns:**
> La nueva plataforma debe gestionar experiencia/comercio y entregar la orden a la capa/API/OMS de Papa Johns; OMS/NCR/Aloha continúan gestionando la ejecución en tienda.

#### T-33 · Volumetría, bloque Transacciones, "Órdenes Agregadores"

**Proveedor:** SF

**Pregunta:**
> ¿Cómo se integran hoy las ~200 mil órdenes mensuales de agregadores (API, webhook, tablet, manual)? ¿Quedan dentro del alcance de la nueva plataforma y de qué agregadores se trata?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Los agregadores son Uber Eats,Rappi y PedidosYA los cuales se intrgran a traves de nuestra API

#### T-34 · Kit §06 "Flujo digital" y diagrama "Flujo Online Ordering"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántas llamadas de integración genera una orden típica por etapa (cobertura, disponibilidad, precio, ETA, pago, creación en NCR, loyalty, CRM, SAC, data warehouse)?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.

#### T-35 · Kit §06 "Flujo digital" (eventos de tienda y despacho) y diagrama "Flujo Online Ordering"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántos eventos de estado emiten KDS, NCR y DispatchTrack por orden? ¿Llegan por webhook o por polling y existe hoy un broker de mensajería?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Los eventos corresponden a 4 cambios de estado para el KDS y llegan por webhook a nuestra api

#### T-36 · Volumetría, bloque Tecnología e integraciones, "Performance"

**Proveedor:** SF

**Pregunta:**
> ¿Qué latencias objetivo (P50, P95, P99) esperan por API crítica: cobertura de tienda, cálculo de ETA, checkout, pago y creación de orden?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales. Referencia: experiencia user-facing <2,5 s y APIs críticas idealmente P95 <1 s, sujeto a dependencias externas. Que proponen uds de SLA P50/P95/P99.?

#### T-37 · Kit §03 "Proceso técnico" y Volumetría, "Integraciones críticas"

**Proveedor:** SF

**Pregunta:**
> ¿Qué límites de tasa o cuotas de uso tienen los sistemas destino (NCR Cloud Connect, Webpay, Mercado Pago, Fintoc, Zendesk, Synerise, DispatchTrack)? ¿Pueden entregar ambientes de prueba con capacidad para pruebas de carga?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.

#### T-38 · Volumetría, bloque Marketing, "Base de socios"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántos socios de Papa Puntos hay hoy en total y cuántos están activos (por ejemplo, con al menos una compra en los últimos 12 meses)? ¿Cuál es el crecimiento mensual de la base?

**Respuesta Papa Johns:**
> Los aspectos específicos de Loyalty / Papa Puntos no requieren ser profundizados en esta etapa, ya que no corresponden a una prioridad de evaluación para la adjudicación de la nueva plataforma ecommerce. Para esta fase, esperamos únicamente que la solución tenga la capacidad de integrarse con el motor de Loyalty vigente y quedar preparada para futuras evoluciones. Las reglas, volumetría y funcionalidades específicas del programa se abordarán en una etapa posterior del proyecto

#### T-39 · Volumetría, bloque Marketing, "Eventos"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántos eventos de navegación, de compra y de loyalty se generan por mes y en el pico, desglosados por canal (Web, App, Tótem, Call Center, agregadores)?

**Respuesta Papa Johns:**
> Los aspectos específicos de Loyalty / Papa Puntos no requieren ser profundizados en esta etapa, ya que no corresponden a una prioridad de evaluación para la adjudicación de la nueva plataforma ecommerce. Para esta fase, esperamos únicamente que la solución tenga la capacidad de integrarse con el motor de Loyalty vigente y quedar preparada para futuras evoluciones. Las reglas, volumetría y funcionalidades específicas del programa se abordarán en una etapa posterior del proyecto

#### T-40 · Volumetría, bloque Marketing, "Migración desde Synerise"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántos años de historia y cuántos registros de clientes, órdenes, puntos, preferencias y consentimientos deben migrarse o conservarse?

**Respuesta Papa Johns:**
> al menos 24 meses

#### T-41 · Volumetría, bloque Marketing, "Recomendaciones"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántas tiendas, productos, SKUs y combos componen el catálogo sobre el que se calcularían recomendaciones? ¿Qué latencia esperan en Web y App?

**Respuesta Papa Johns:**
> Cantidad exacta de tiendas/SKUs/combos se entregará desde Backoffice. Las recomendaciones no deben degradar la navegación; objetivo P95 <1 s para respuesta funcional.

#### T-42 · Volumetría, bloque Loyalty, "Transacciones de loyalty"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántas transacciones de acumulación y de canje de puntos hay por mes y cuántas por hora en el pico (Día de la Pizza y Cyber)?

**Respuesta Papa Johns:**
> Los aspectos específicos de Loyalty / Papa Puntos no requieren ser profundizados en esta etapa, ya que no corresponden a una prioridad de evaluación para la adjudicación de la nueva plataforma ecommerce. Para esta fase, esperamos únicamente que la solución tenga la capacidad de integrarse con el motor de Loyalty vigente y quedar preparada para futuras evoluciones. Las reglas, volumetría y funcionalidades específicas del programa se abordarán en una etapa posterior del proyecto

#### T-43 · Volumetría, bloque Loyalty, "Consulta de saldo"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántas consultas de saldo de puntos por segundo se esperan en el checkout en horario peak? ¿Qué latencia máxima es aceptable?

**Respuesta Papa Johns:**
> TPS de consulta de saldo debe dimensionarse con el peak real. Como referencia, la consulta debe ser near-real-time y no bloquear checkout (>1 s no deseado).

#### T-44 · Volumetría, bloque Loyalty, "Estructura del programa"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántos niveles (tiers), tipos de recompensa y beneficios tiene el programa hoy y cuántos miembros hay en cada nivel?

**Respuesta Papa Johns:**
> Los aspectos específicos de Loyalty / Papa Puntos no requieren ser profundizados en esta etapa, ya que no corresponden a una prioridad de evaluación para la adjudicación de la nueva plataforma ecommerce. Para esta fase, esperamos únicamente que la solución tenga la capacidad de integrarse con el motor de Loyalty vigente y quedar preparada para futuras evoluciones. Las reglas, volumetría y funcionalidades específicas del programa se abordarán en una etapa posterior del proyecto

#### T-45 · Solución, bloque Loyalty, "Alcance de Papa Puntos"

**Proveedor:** SF

**Pregunta:**
> ¿Se espera migrar el programa Papa Puntos a una nueva plataforma de loyalty o integrar la nueva plataforma con el motor actual? ¿Quién lo opera hoy?

**Respuesta Papa Johns:**
> Los aspectos específicos de Loyalty / Papa Puntos no requieren ser profundizados en esta etapa, ya que no corresponden a una prioridad de evaluación para la adjudicación de la nueva plataforma ecommerce. Para esta fase, esperamos únicamente que la solución tenga la capacidad de integrarse con el motor de Loyalty vigente y quedar preparada para futuras evoluciones. Las reglas, volumetría y funcionalidades específicas del programa se abordarán en una etapa posterior del proyecto

#### T-46 · Solución, bloque Marketing, "Synerise"

**Proveedor:** SF

**Pregunta:**
> ¿La intención es reemplazar Synerise por completo o que conviva con la nueva plataforma durante una transición? Si conviven, ¿qué sistema será la fuente de verdad del perfil del cliente y de las audiencias?

**Respuesta Papa Johns:**
> Synerise debe convivir con la nueva plataforma y mantenerse como CDP/CRM y fuente de audiencias/perfil activable. Commerce consumirá esas capacidades.

#### T-47 · Solución, bloque Loyalty, "Tiers y gamificación"

**Proveedor:** SF

**Pregunta:**
> ¿Se espera incorporar niveles, beneficios por segmento o mecánicas de gamificación en esta fase o se mantiene el esquema actual?

**Respuesta Papa Johns:**
> se mantiene esquema actual

#### T-48 · Solución, bloque Marketing, "WhatsApp"

**Proveedor:** SF

**Pregunta:**
> ¿Qué proveedor de WhatsApp (BSP) utilizan hoy? ¿Será canal de marketing, de servicio o de toma de pedidos?

**Respuesta Papa Johns:**
> El BSP definitivo aún está en evaluación. WhatsApp se proyecta como canal de marketing, servicio y, especialmente, venta conversacional end-to-end. Elactual es para SACa traves de centribal

#### T-49 · Solución, bloque Loyalty, "Gestión comercial"

**Proveedor:** SF

**Pregunta:**
> ¿Cómo se crean y administran hoy los cupones, Gift Cards y cargas masivas (Backoffice, planillas, otra herramienta)? ¿Quién los gestiona?

**Respuesta Papa Johns:**
> Cupones/Gift Cards se administran desde Backoffice; las cargas masivas de cupones se realizan vía CSV. Gestión principalmente Comercial/Ecommerce.

#### T-50 · Solución, bloque Marketing, "Experimentación"

**Proveedor:** SF

**Pregunta:**
> ¿Cuántos tests A/B por mes esperan ejecutar y sobre qué elementos (asunto, contenido, oferta, horario)?

**Respuesta Papa Johns:**
> Esperamos al menos 2 tests A/B mensuales inicialmente, escalables, sobre Home, PDP, promociones, mensajes, orden de módulos y checkout.

#### T-51 · Solución, bloque Marketing, "Agregadores"

**Proveedor:** SF

**Pregunta:**
> ¿Los clientes que compran por agregadores forman parte de la base contactable? Si es así, ¿qué datos de contacto y qué consentimiento se tienen?

**Respuesta Papa Johns:**
> no

#### T-52 · Solución, bloque Loyalty, "Reglas del programa"

**Proveedor:** SF

**Pregunta:**
> ¿Pueden compartir las reglas vigentes de elegibilidad, acreditación, vigencia, canje y mínimos por modalidad (delivery, retiro, tienda)?

**Respuesta Papa Johns:**
> Las reglas de loyalty/promos/modalidad se podrian entregar como anexo funcional durante discovery/implementación.

#### T-53 · Solución, bloque Loyalty, "Promociones y cupones"

**Proveedor:** SF

**Pregunta:**
> ¿Cómo interactúan hoy los puntos con promociones, cupones y descuentos por BIN? ¿Se acumulan puntos sobre el monto con descuento o sobre el monto original?

**Respuesta Papa Johns:**
> La interacción debe respetar reglas de acumulación y compatibilidad configurables.

#### T-54 · Solución, bloque Loyalty, "Cancelaciones"

**Proveedor:** SF

**Pregunta:**
> ¿Cómo se devuelven o revierten los puntos según el motivo de la cancelación (cliente, tienda, pago rechazado, pedido atrasado)?

**Respuesta Papa Johns:**
> existe reversa de puntos asociada a anulaciones/devoluciones según causal y estado de la orden

#### T-55 · Solución, bloque Loyalty, "Saldo en checkout"

**Proveedor:** SF

**Pregunta:**
> ¿Qué sistema calcula y expone el saldo de puntos durante el checkout: el motor de loyalty, el Backoffice o la API de Papa Johns?

**Respuesta Papa Johns:**
> Synerise/Loyalty debe ser la fuente del saldo; Commerce lo consulta mediante API/capa de integración.

#### T-56 · Solución, bloque Loyalty, "Canales de acumulación"

**Proveedor:** SF

**Pregunta:**
> ¿Los puntos se acumulan y canjean también en tienda física y Tótem o solo en canales digitales?

**Respuesta Papa Johns:**
> de momento solo olo, proximamente tiendas y totem

#### T-57 · Kit §03 · Prueba de concepto / Entregable 04 "Demo con eventos sorpresa"

**Proveedor:** SF

**Pregunta:**
> ¿Qué áreas de Papa Johns participarán en la demo (TI, marketing, operaciones, SAC u otras)? Nos permite adaptar la presentación y usar términos técnicos o de marketing según la audiencia.

**Respuesta Papa Johns:**
> TD, TI, COMERCIAL Y MKTG.Si envia brandbookpj
> La demo debe abarcar las capacidades informadas como minimo esperable

#### T-58 · Kit §08 · FAQ y casos para validar / Entregable 04

**Proveedor:** SF

**Pregunta:**
> ¿Los 20 casos de "¿Qué pasa si…?" se evaluarán todos en la demo?

**Respuesta Papa Johns:**
> No necesariamente. Los 20 casos son biblioteca de evaluación; para la demo pueden prsentar los 5 que crean necesarios,pero si o si deben ser capaces de resolver todos.

#### T-59 · Kit §03 · Prueba de concepto

**Proveedor:** SF

**Pregunta:**
> ¿Esperan que el ambiente de la POC quede disponible después de la demo para que su equipo lo pruebe? Si es así, ¿por cuánto tiempo?

**Respuesta Papa Johns:**
> si, almenos dos semanas

#### T-60 · Kit §03 · Prueba de concepto (frontera backend → Aloha / OMS) / §05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> El kit indica que la frontera de integración backend → Aloha / OMS debe confirmarse. ¿Qué componente envía hoy la orden a Aloha / OMS y qué debe cubrir la nueva plataforma versus el middleware actual?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Todas la ordenes son recibidas y enviadas a traves de nuestra api

#### T-61 · Kit §05 · Ecosistema (Aloha / OMS) / Mapa de Capacidades D6-01 Orquestación y enrutamiento de pedidos (OMS)

**Proveedor:** SF

**Pregunta:**
> Nos comentaron que su OMS escala y que lo seguirán manteniendo para sus franquicias. ¿La idea es que las órdenes se inyecten en ese OMS desde Salesforce Commerce Cloud?

**Respuesta Papa Johns:**
> Sí, la referencia es inyectar las órdenes al OMS existente y mantenerlo como componente operativo, incluidas franquicias.

#### T-62 · Kit §04 · 07 Pagos e integraciones / §05 · Ecosistema (Webpay, Mercado Pago, Fintoc, tarjetas alimentarias, billeteras)

**Proveedor:** SF

**Pregunta:**
> ¿Se mantienen los contratos actuales con los medios de pago? ¿Hay ambientes sandbox disponibles para cada uno?

**Respuesta Papa Johns:**
> Cada plataforma cuenta con su respectivo ambiente bajo para certificacion y qa

#### T-63 · Kit §05 · Ecosistema · Detalle (12 CRM y fidelización)

**Proveedor:** SF

**Pregunta:**
> ¿Synerise genera segmentaciones en tiempo real? ¿Podrían exponerse (por API o eventos) para usarlas en el motor de personalización de Salesforce Commerce Cloud durante la navegación?

**Respuesta Papa Johns:**
> POR CONFIRMAR

#### T-64 · Kit §04 · 04 Cupones, Gift Cards y Loyalty / Mapa de Capacidades D9-01 a D9-03

**Proveedor:** SF

**Pregunta:**
> ¿El sistema que gestiona Papa Puntos cuenta con un ambiente sandbox? ¿Pueden entregarnos acceso y datos de prueba (clientes con saldo de puntos) para consultarlo vía API?

**Respuesta Papa Johns:**
> Los aspectos específicos de Loyalty / Papa Puntos no requieren ser profundizados en esta etapa, ya que no corresponden a una prioridad de evaluación para la adjudicación de la nueva plataforma ecommerce. Para esta fase, esperamos únicamente que la solución tenga la capacidad de integrarse con el motor de Loyalty vigente y quedar preparada para futuras evoluciones. Las reglas, volumetría y funcionalidades específicas del programa se abordarán en una etapa posterior del proyecto

#### T-65 · Kit §05 · Ecosistema (API Zendesk) / §03 · Prueba de concepto (punto 03, respuesta de SAC)

**Proveedor:** SF

**Pregunta:**
> Según el kit, la POC incluye la respuesta de SAC integrada con Zendesk. ¿Cómo piensan que abordemos el caso con Zendesk?

**Respuesta Papa Johns:**
> La POC debe demostrar el flujo SAC: consulta/creación de ticket y contexto de pedido. Si no hay sandbox Zendesk, puede usarse una integración mock claramente identificada.

**Nota en columna G (no es respuesta del cliente):** «QUEEEEE SI NO SOMOS ZENDESKKKKK»

#### T-66 · Kit §05 · Ecosistema (ECOMMERCE Core · Users · Orders) / Arquitectura cloud

**Proveedor:** SF

**Pregunta:**
> ¿Qué componentes del ecommerce actual (en AWS) se reemplazan y cuáles se mantienen? ¿Se debe migrar la base de usuarios y el historial de pedidos?

**Respuesta Papa Johns:**
> Se busca reemplazar la capa ecommerce/experiencia y evolucionar el Backoffice, manteniendo sistemas core como Aloha/OMS, Synerise y logística.

#### T-67 · Entregable 02 "Arquitectura e integraciones" / Arquitectura cloud

**Proveedor:** SF

**Pregunta:**
> ¿Tienen preferencia por un storefront nativo de Salesforce Commerce Cloud o por una arquitectura headless (frontend desacoplado que consume APIs)? ¿Cómo esperan gestionar los despliegues (ambientes, CI/CD, equipo que los ejecuta)?

**Respuesta Papa Johns:**
> Preferencia por arquitectura headless/API-first y desacoplada. El proveedor debe proponer storefront y CI/CD; buscamos despliegues controlados, feature flags y autonomía futura.

#### T-68 · Kit §04 · 06 Canales y omnicanalidad ("Administrar desde una misma lógica la oferta que consumen Web, App, agregadores, Call Center, Tótem y WhatsApp")

**Proveedor:** SF

**Pregunta:**
> Para cada canal (agregadores, Call Center y Tótem), ¿qué esperan de la nueva plataforma? a) Publicar la oferta (menú, precios, promociones y disponibilidad) para que el canal la consuma; b) recibir las órdenes del canal por API para centralizarlas; o c) proveer el frontend del canal (por ejemplo, la interfaz del Tótem o la del agente de Call Center que toma pedidos a nombre del cliente). ¿Cómo funciona hoy cada uno?

**Respuesta Papa Johns:**
> Esperamos principalmente: a) publicar oferta centralizada y b) recibir/centralizar órdenes. El frontend puede variar por canal; debe reutilizar los mismos servicios y reglas.

#### T-69 · Mapa de Capacidades (columnas Must-have / Should-have y M1–M12)

**Proveedor:** SF

**Pregunta:**
> ¿Qué representan las referencias M1 a M12? ¿Todas las capacidades Must-have deben estar en la primera fase o salida a producción?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> La demo debe abarcar las capacidades informadas como minimo esperable

#### T-70 · Entregable 05 "Plan de implementación"

**Proveedor:** SF

**Pregunta:**
> ¿Existe una fecha objetivo de salida a producción y períodos en que no se pueda salir (temporadas altas)? ¿Tienen preferencia por un enfoque por fases (MVP)?

**Respuesta Papa Johns:**
> Preferimos enfoque por fases/MVP, evitando eventos de máxima demanda. Referencia: implementación 2027 con piloto y escalamiento progresivo; fecha final post adjudicación.

#### T-71 · Kit §09 · 08 Gobierno y seguimiento

**Proveedor:** SF

**Pregunta:**
> Después de la salida a producción, ¿esperan que el partner opere la plataforma (servicio gestionado) o que la opere un equipo interno de Papa Johns?

**Respuesta Papa Johns:**
> Modelo híbrido: partner con soporte/servicio gestionado para plataforma y evolución; Papa Johns debe conservar autonomía comercial y gobierno interno.

#### T-72 · Kit §04 · Datos maestros y Back Office / §05 · Ecosistema (Tienda física: Aloha / OMS, NCR POS, KDS) / Mapa de Capacidades D12-01 (sincronizar canal digital y operación presencial)

**Proveedor:** SF

**Pregunta:**
> El kit indica que las tiendas físicas operan con Aloha / NCR POS y que el canal digital debe sincronizarse con la operación presencial. ¿Cómo ven la división de responsabilidades entre Aloha y la nueva plataforma en catálogo, precios y disponibilidad?

**Respuesta Papa Johns:**
> Aloha/NCR mantiene POS, Kitchen, fiscal y ejecución en tienda. La nueva plataforma orquesta experiencia digital, catálogo comercial, promos, checkout y captura de orden, sincronizada con Aloha/OMS.

#### T-73 · Kit §04 · 01 Productos y catálogo (identificadores Aloha) / Mapa de Capacidades D2-01

**Proveedor:** SF

**Pregunta:**
> Hoy, ¿dónde se crea un producto nuevo: en Aloha, en su back office actual o en ambos?

**Respuesta Papa Johns:**
> En ambos: Aloha requiere IDs/configuración operacional y Backoffice configura la experiencia/catalogación digital. Buscamos reducir esa duplicidad mediante sincronización.

#### T-74 · Kit §04 · 02 Menú, precios y disponibilidad / Mapa de Capacidades D2-03

**Proveedor:** SF

**Pregunta:**
> ¿Los precios y el menú varían por tienda o franquicia? Si es así, ¿los define el equipo central o cada franquiciado?

**Respuesta Papa Johns:**
> Sí, pueden variar por tienda/canal/modalidad. La estrategia es central.

#### T-75 · Kit §04 · 02 Menú, precios y disponibilidad ("bloquear quiebres y mantener consistencia con POS y agregadores") / Mapa de Capacidades D12-01

**Proveedor:** SF

**Pregunta:**
> Cuando una tienda se queda sin un producto o ingrediente:
> a) ¿Dónde se registra hoy ese quiebre: en el POS Aloha de forma automática o de forma manual en el back office?
> b) Cuando falta un ingrediente, ¿cómo se da de baja hoy cada producto afectado? Por ejemplo, si una tienda se queda sin piña, ¿la pizza hawaiana se marca como no disponible de forma automática o alguien lo hace a mano?
> c) ¿Cómo se actualiza hoy esa disponibilidad en cada canal, por ejemplo en los agregadores?

**Respuesta Papa Johns:**
> Hoy el quiebre puede bloquearse manualmente en Backoffice por tienda para producto/ingrediente/promoción. La propagación a agregadores puede requerir integración/configuración adicional. Buscamos automatizar dependencia ingrediente→producto.

#### T-76 · Kit §04 · 01 Productos y catálogo ("pizzas, ingredientes, combos, variantes, mitades… con sus identificadores Aloha") / Mapa de Capacidades D3-03 / Volumetría · Complejidad pizza configurada

**Proveedor:** SF

**Pregunta:**
> ¿Cómo se identifica hoy una pizza por mitades en el back office y en Aloha?
> a) ¿La pizza mitad y mitad es un solo producto con dos configuraciones (una por mitad) o se registran como dos productos de media pizza?
> b) ¿Cada mitad tiene su propio identificador Aloha o se usan modificadores sobre la pizza entera?
> c) ¿Se vende media pizza como producto independiente?

**Respuesta Papa Johns:**
> La pizza por mitades se maneja como producto/configuración de pizza y existen IDs Aloha específicos para mitad. No se busca vender media pizza como producto independiente.

#### T-77 · Mapa de Capacidades D3-02 y D3-03 (precio dinámico y pizza por mitades)

**Proveedor:** SF

**Pregunta:**
> En una pizza por mitades, ¿cuál es la regla de precio (precio de la mitad más cara, promedio u otra)? ¿Hay restricciones de ingredientes o combinaciones?

**Respuesta Papa Johns:**
> Se cobra la de mayor valor

#### T-78 · Mapa de Capacidades D2-02 (variantes: tamaños, masas) / Volumetría · Complejidad pizza configurada

**Proveedor:** SF

**Pregunta:**
> ¿Cuántos tamaños, tipos de masa, bordes e ingredientes manejan hoy? ¿Todas las combinaciones son válidas o hay restricciones (por ejemplo, un tipo de masa o borde solo disponible en ciertos tamaños)?

**Respuesta Papa Johns:**
> Las cantidades exactas se levantarán del catálogo. Tamaño: 4, bordes 2,tipos de masas 4, y hay restricciones por tipo de masa y borde.

#### T-79 · Mapa de Capacidades D3-01 y D3-02 (configurador y precio dinámico) / Kit §04 · 01 Productos y catálogo

**Proveedor:** SF

**Pregunta:**
> Sobre el borde de la pizza: ¿es una elección con recargo sobre la pizza, o cambia el producto (otro identificador en Aloha)? ¿El recargo varía según el tamaño?

**Respuesta Papa Johns:**
> El borde se trata como modificador/configuración y puede implicar recargo/ID operativo según variante

#### T-80 · Mapa de Capacidades D3-01 y D3-02 / Kit §04 · 01 Productos y catálogo ("Recetas")

**Proveedor:** SF

**Pregunta:**
> Sobre los ingredientes: ¿cuántos se pueden agregar como máximo? ¿Se puede pedir doble porción o quitar ingredientes de la receta base? ¿El precio de un ingrediente extra varía según el tamaño de la pizza, la tienda o el canal?

**Respuesta Papa Johns:**
> Se permite agregar/quitar ingredientes bajo reglas del producto; límites, dobles porciones y pricing deben ser configurables

#### T-81 · Mapa de Capacidades D3-04 (información nutricional y alérgenos por configuración)

**Proveedor:** SF

**Pregunta:**
> ¿Cuentan hoy con la información nutricional y de alérgenos por ingrediente, para calcularla según la configuración que arme el cliente?

**Respuesta Papa Johns:**
> Existe información nutricional a nivel de producto/variante. La disponibilidad de alérgenos por ingrediente y cálculo dinámico debe validarse.

#### T-82 · Mapa de Capacidades D4-04 (bundles y combos) y D3-03 (combos armables) / Kit §04 · 03 Promociones y reglas

**Proveedor:** SF

**Pregunta:**
> En los combos, ¿los productos son fijos o el cliente elige dentro de una categoría (por ejemplo, "2 pizzas medianas a elección + bebida")? ¿Puede personalizar cada pizza del combo, y si agrega borde o ingredientes, cambia el precio del combo?

**Respuesta Papa Johns:**
> Hay combos fijos y configurables. Deben soportar elección por categoría, personalización de pizzas y recargos por extras/bordes según regla comercial.

#### T-83 · Kit §04 · 02 Menú, precios y disponibilidad ("oferta por tienda, canal y modalidad") / §04 · 03 Promociones y reglas (horarios)

**Proveedor:** SF

**Pregunta:**
> ¿Hay productos o menús que solo se venden en ciertos horarios, días, canales o modalidades (Delivery o Pick Up)? ¿El precio de un producto cambia según la modalidad?

**Respuesta Papa Johns:**
> Sí. La oferta puede variar por día, horario, canal, tienda y modalidad Delivery/Pick Up; también puede existir precio diferenciado por modalidad/canal.

#### T-84 · Kit §04 · 01 Productos y catálogo ("Recetas") / Mapa de Capacidades D3-01

**Proveedor:** SF

**Pregunta:**
> ¿La carta tiene pizzas de especialidad con receta fija, además de una opción "arma tu pizza"? Si el cliente modifica una pizza de especialidad, ¿sigue siendo el mismo producto con otro precio o pasa a ser una pizza armada?

**Respuesta Papa Johns:**
> Sí, existen especialidades y 'Arma tu pizza'. Las modificaciones se manejan como personalización/modificadores; el tratamiento exacto en Aloha depende de IDs/reglas configuradas.

#### T-85 · Kit §07 · Experiencia digital / Mapa de Capacidades D3-01 (configurador de producto)

**Proveedor:** SF

**Pregunta:**
> ¿Esperan que la imagen de la pizza cambie según los ingredientes que el cliente elige, o basta con una imagen por producto?

**Respuesta Papa Johns:**
> Idealmente queremos soporte para visualización dinámica según configuración cuando aporte valor; como mínimo, imagen de alta calidad por producto/variante.

#### T-86 · Mapa de Capacidades D2-04 (etiquetas y badges: más vendido, picante)

**Proveedor:** SF

**Pregunta:**
> Las etiquetas como "más vendido", "picante" o "vegetariana", ¿las define marketing a mano o deben calcularse de forma automática (por ejemplo, según las ventas)?

**Respuesta Papa Johns:**
> Hoy varios atributos son configurables manualmente. Esperamos permitir también etiquetas dinámicas/data-driven, por ejemplo 'más vendido'.

#### T-87 · Mapa de Capacidades D9-02 (catálogo de canje) / Kit §04 · 04 Cupones, Gift Cards y Loyalty

**Proveedor:** SF

**Pregunta:**
> Los productos que se pueden canjear con Papa Puntos, ¿son los mismos de la carta o un catálogo aparte? ¿Se pueden personalizar al canjearlos?

**Respuesta Papa Johns:**
> Los productos de canje se relacionan con el catálogoademas de haberotros exclusivos

#### T-88 · Kit §04 · Datos maestros y Back Office / §04 · 09 Roles y trazabilidad

**Proveedor:** SF

**Pregunta:**
> ¿Con qué frecuencia cambian el menú (lanzamientos, productos de temporada) y con cuánta anticipación se preparan esos cambios antes de publicarlos?

**Respuesta Papa Johns:**
> El menú cambia de forma frecuente por campañas, lanzamientos y temporadas. Debe poder programarse con anticipación y publicarse sin desarrollo; frecuencia exacta se compartirá.

#### T-89 · Mapa de Capacidades D4-05 (upsell y cross-sell) / Kit §09 · KPI críticos ("Pedidos con recomendación")

**Proveedor:** SF

**Pregunta:**
> Las sugerencias de productos ("agrega una bebida", "pásate a tamaño familiar"), ¿las define hoy marketing a mano por producto, o esperan que se calculen automáticamente según el comportamiento de compra?

**Respuesta Papa Johns:**
> Hoy predominan reglas/configuración comercial. Esperamos combinar reglas manuales con recomendaciones automáticas basadas en comportamiento y propensión.

#### T-90 · Kit §04 · 03 Promociones y reglas ("restricciones") / Mapa de Capacidades D5-01 (validaciones en checkout)

**Proveedor:** SF

**Pregunta:**
> Sabemos que venden cerveza. ¿Qué validaciones aplican hoy a la venta de alcohol en los canales digitales (verificación de edad, horarios permitidos, tiendas o comunas habilitadas, modalidad Delivery o Pick Up)?

**Respuesta Papa Johns:**
> La venta de alcohol debe cumplir validación de edad y restricciones legales de horario, tienda/zona y modalidad.

#### T-91 · Volumetría · Activos digitales (imágenes y contenido administrados por CMS/DAM) / Volumetría · SEO

**Proveedor:** SF

**Pregunta:**
> ¿Dónde se administran hoy las imágenes y descripciones de los productos (CMS, DAM o el mismo back office)? ¿Se mantiene esa herramienta o se reemplaza?

**Respuesta Papa Johns:**
> Hoy imágenes y descripciones se gestionan principalmente en Backoffice. Esperamos que la nueva solución incorpore/integre un CMS/DAM y centralice la gestión.

#### T-92 · Kit §04 · Datos maestros y Back Office / Volumetría · SKUs / variantes ("Por levantar desde catálogo actual")

**Proveedor:** SF

**Pregunta:**
> Para planificar la migración, ¿pueden compartir la estructura actual del catálogo (campos, categorías y cómo se relacionan productos, ingredientes y combos)?

**Respuesta Papa Johns:**
> Sí. Podemos compartir la estructura actual del catálogo y relaciones producto/ingrediente/combo durante discovery técnico.

#### T-93 · Kit §04 · 02 Menú, precios y disponibilidad / Mapa de Capacidades D2-03 (precios por tamaño, canal y "eventualmente por tienda")

**Proveedor:** SF

**Pregunta:**
> ¿Los precios de la carta varían según la zona o comuna del cliente, independientemente de la tienda que lo atiende?

**Respuesta Papa Johns:**
> El precio se determina principalmente por tienda/canal/modalidad; la comuna/zona influye en asignación de tienda y delivery, no como regla independiente general.

#### T-94 · Kit §04 · 02 Menú, precios y disponibilidad / Mapa de Capacidades D2-03

**Proveedor:** SF

**Pregunta:**
> ¿Cuántas listas de precios manejan hoy (por ejemplo, por zona, canal, tienda o franquicia)? ¿Todos los productos tienen precio en cada una de ellas?

**Respuesta Papa Johns:**
> listas para agrgadores, totem,olo.y ellos por zonas (3)

#### T-95 · Mapa de Capacidades D4-02 (motor de reglas de precio: "precios especiales")

**Proveedor:** SF

**Pregunta:**
> ¿Tienen precios o descuentos especiales por tipo de cliente (jubilados, estudiantes, convenios con empresas)? ¿Cómo se valida que el cliente pertenece a ese grupo? En el caso de empresas, ¿requieren factura o condiciones de pago distintas?

**Respuesta Papa Johns:**
> Sí existen convenios/promociones segmentadas (bancos, partners, cupones). La elegibilidad se valida según mecanismo definido; facturación B2B no es requisito core salvo alcance específico.

#### T-96 · Kit §04 · 06 Canales y omnicanalidad / Mapa de Capacidades D2-03 (precio por canal)

**Proveedor:** SF

**Pregunta:**
> ¿El precio de un mismo producto es igual en Web, App, Call Center, Tótem y tienda física? ¿Y en los agregadores?

**Respuesta Papa Johns:**
> No necesariamente. Los precios pueden diferir entre canales/modalidades y los agregadores tienen condiciones/precios propios.

#### T-97 · Kit §04 · 02 Menú, precios y disponibilidad ("aplicar cambios masivos")

**Proveedor:** SF

**Pregunta:**
> ¿Muestran precio normal y precio oferta (precio tachado) con fechas de vigencia? ¿Cómo programan hoy los cambios de precio y cuántos productos cambian en un cambio masivo típico?

**Respuesta Papa Johns:**
> Sí, se manejan precios/promos con vigencia. Los cambios requieren coordinación Backoffice/Aloha y algunos son masivos. Precio tachado viene en nueva card de promociones

#### T-98 · Mapa de Capacidades D5-04 (costo de envío "según zona, tienda y promociones vigentes")

**Proveedor:** SF

**Pregunta:**
> ¿Cómo se calcula hoy el costo de despacho: fijo, por zona, por distancia, por tienda o según el monto del pedido? ¿Hay envío gratis sobre cierto monto o por promoción?

**Respuesta Papa Johns:**
> El delivery fee es configurable según reglas comerciales y puede variar por tienda/zona/monto/promoción. También existen mínimos de compra según modalidad/promoción.

#### T-99 · Mapa de Capacidades D3-02 (precio dinámico por atributo)

**Proveedor:** SF

**Pregunta:**
> Al calcular el precio de una pizza configurada (mitades, ingredientes extra, bordes), ¿aplican reglas de redondeo, por ejemplo precios terminados en $90 o en múltiplos de $10?

**Respuesta Papa Johns:**
> puede  ser ambos

#### T-100 · Kit §04 · 02 Menú, precios y disponibilidad / Mapa de Capacidades D12-01 (sincronizar disponibilidad entre canal digital y operación presencial)

**Proveedor:** SF

**Pregunta:**
> ¿Qué sistema gestiona hoy el inventario de las tiendas (Aloha, un ERP u otro)? ¿Es el mismo en tiendas propias y en franquicias?

**Respuesta Papa Johns:**
> Aloha y sistemas operacionales soportan la operación/inventario; el ecommerce hoy no dispone de un stock de ingredientes completamente automatizado en tiempo real.

#### T-101 · Kit §04 · 02 Menú, precios y disponibilidad ("bloquear quiebres") / Mapa de Capacidades D12-01

**Proveedor:** SF

**Pregunta:**
> ¿Ese sistema controla los ingredientes de cada tienda en tiempo real, o el inventario se actualiza en cierres periódicos (por turno o diarios)?

**Respuesta Papa Johns:**
> Hoy no existe una automatización completa de disponibilidad por ingrediente en tiempo real para ecommerce; se utilizan bloqueos/gestión operacional.

#### T-102 · Mapa de Capacidades D12-01 / Kit §04 · 01 Productos y catálogo ("Recetas")

**Proveedor:** SF

**Pregunta:**
> ¿Su sistema de inventario puede notificar a Salesforce Commerce Cloud qué productos quedan disponibles o no en cada tienda, considerando las recetas (por ejemplo, sin piña → pizza hawaiana no disponible)?

**Respuesta Papa Johns:**
> No de forma end-to-end hoy. Es una capacidad deseada: recibir disponibilidad y derivar automáticamente productos afectados por receta.

#### T-103 · Kit §04 · 02 Menú, precios y disponibilidad

**Proveedor:** SF

**Pregunta:**
> Cuando la tienda vuelve a tener el ingrediente, ¿el producto se reactiva solo o alguien debe hacerlo? ¿Lo hace la tienda o el equipo central?

**Respuesta Papa Johns:**
> Hoy la reactivación de bloqueos en Backoffice es manual. Buscamos poder automatizarla cuando exista una fuente confiable de stock.

#### T-104 · Kit §04 · 02 Menú, precios y disponibilidad

**Proveedor:** SF

**Pregunta:**
> Los productos envasados (bebidas, cervezas, postres), ¿se controlan por unidades en cada tienda?

**Respuesta Papa Johns:**
> asi es,pero nohay control automatizado

#### T-105 · Kit §07 · Experiencia digital / §08 · FAQ y casos para validar

**Proveedor:** SF

**Pregunta:**
> Cuando un producto no está disponible en la tienda que atiende al cliente, ¿prefieren mostrarlo como "agotado" o ocultarlo de la carta?

**Respuesta Papa Johns:**
> Preferimos una experiencia configurable: mostrar 'agotado' cuando ayude al cliente y ofrecer alternativas; ocultar cuando corresponda por regla comercial. Para especiliadades nunca debe bloqeuarse sinoofrecer productos y/o ingredientes sustitutos

#### T-106 · Kit §04 · 05 Configuración de tiendas ("estado operativo") / Mapa de Capacidades D7-04 (estado operativo de tienda en tiempo real: abierta, cerrada o con capacidad limitada)

**Proveedor:** SF

**Pregunta:**
> Cuando una tienda se apaga o se prende (cierre, falla, alta demanda o capacidad limitada):
> a) ¿Dónde se hace hoy: desde el POS, desde el back office o lo hace la tienda manualmente?
> b) ¿Ese cambio aplica a todos los canales (incluidos agregadores, Call Center y Tótem) o solo a los canales digitales?
> c) ¿Se puede apagar solo una modalidad (por ejemplo, pausar Delivery y mantener Pick Up)?
> d) ¿Esperan que Salesforce Commerce Cloud reciba ese estado y lo distribuya a los canales?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Toda la edicion de contenido y configuracion se realiza en nuestro backoffice

#### T-107 · Kit §04 · Datos maestros y Back Office (Catálogo → reglas → tiendas → canales → operación)

**Proveedor:** SF

**Pregunta:**
> Hoy, para cada tipo de información, ¿en qué sistema nace y se administra, y qué equipo lo opera?
> 1. Productos y recetas
> 2. Precios
> 3. Promociones y cupones
> 4. Disponibilidad y quiebres de stock
> 5. Estado de la tienda (abierta, cerrada, pausada)

**Respuesta Papa Johns:**
> Productos/recetas: Aloha + Backoffice. Precios: Backoffice/Aloha. Promos/cupones: Backoffice/Comercial. Quiebres: Backoffice/Operación. Estado tienda: Backoffice/Operación-TI. Buscamos una gobernanza/fuente maestra clara.

#### T-108 · Kit §04 · Datos maestros y Back Office ("simplificar la operación y dar autonomía a los equipos")

**Proveedor:** SF

**Pregunta:**
> De estos procesos, ¿cuáles les generan hoy más trabajo manual o inconsistencias entre canales?

**Respuesta Papa Johns:**
> Los mayores esfuerzos manuales están en sincronizar catálogo/precios/promos/disponibilidad entre canales, aperturas de tienda y agregadores. Es un foco central de simplificación.

#### T-109 · Kit §07 · Experiencia digital / Entregable 01 "Journey de nuestros clientes"

**Proveedor:** SF

**Pregunta:**
> ¿Tienen hoy un sistema de diseño o una guía de marca digital (por ejemplo, en Figma)? ¿El diseño de la nueva experiencia lo hará su equipo, una agencia, o esperan que lo proponga el partner?

**Respuesta Papa Johns:**
> Existe guía de marca. El design system digital consolidado debe validarse. Esperamos que el partner proponga una experiencia world-class alineada a Papa Johns, no solo ejecutar diseños existentes.

#### T-110 · Entregable 02 "Arquitectura e integraciones" / Kit §09 · 08 Gobierno y seguimiento

**Proveedor:** SF

**Pregunta:**
> ¿Qué tecnologías de frontend maneja hoy su equipo (por ejemplo, React)? ¿Su equipo seguirá desarrollando sobre la plataforma después de la salida a producción?

**Respuesta Papa Johns:**
> El stack actual se detallará con TI. La solución debe permitir operación/evolución conjunta entre partner y equipo interno, evitando dependencia tecnológica excesiva.

#### T-111 · Kit §03 · 03 "Dar autonomía con control" / Volumetría · Landings y piezas por canal / Activos digitales - banners

**Proveedor:** SF

**Pregunta:**
> ¿Qué contenidos quiere crear o cambiar marketing sin depender de desarrollo (home, landings, banners, pop-ups) y con qué frecuencia los publican?

**Respuesta Papa Johns:**
> Marketing/Comercial debe poder gestionar Home, landings, banners, splash/pop-ups, contenido PDP, orden de módulos/menú y campañas sin desarrollo. Cambios son frecuentes y ligados a campañas.

#### T-112 · Kit §02 · Personajes y perfiles (Sofía, Diego, Valentina) / Mapa de Capacidades D1-04 (mensajería y banners segmentados)

**Proveedor:** SF

**Pregunta:**
> ¿La home y las landings deben mostrar contenido distinto según el tipo de cliente (por ejemplo, Sofía, Diego o Valentina), la tienda o el canal?

**Respuesta Papa Johns:**
> Sí. Debe personalizarse por segmento (Heavy/Switcher/Lapsed), contexto, tienda, canal, ocasión y fuente de tráfico.

#### T-113 · Volumetría · SEO / Kit §03 · 01 "Atraer tráfico que convierta"

**Proveedor:** SF

**Pregunta:**
> Sobre SEO: ¿cuántas páginas indexables y landings SEO tienen hoy? ¿Es importante mantener las URLs actuales o se pueden usar redirecciones?

**Respuesta Papa Johns:**
> Cantidad de páginas/landings por levantar. Debemos preservar equity SEO: mantener URLs cuando sea posible y aplicar redirecciones 301 controladas cuando cambien.

#### T-114 · Kit §09 · 07 Omnicanalidad y escalabilidad ("A/B testing > 2 tests / mes") / Volumetría (GA4)

**Proveedor:** SF

**Pregunta:**
> ¿Usan GA4 con un data layer definido? ¿Con qué herramienta hacen hoy los tests A/B?

**Respuesta Papa Johns:**
> Sí, usamos GA4 y requerimos un data layer/eventos estándar. La herramienta actual de A/B testing no es un condicionante; la nueva plataforma debe soportar experimentación/feature flags.

#### T-115 · Kit §04 · 03 Promociones y reglas

**Proveedor:** SF

**Pregunta:**
> Hoy, ¿dónde se configuran las promociones y qué equipo las opera? ¿Las promociones de los canales digitales se administran por separado de las de tienda física (Aloha)?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Toda la edicion de contenido y configuracion se realiza en nuestro backoffice

#### T-116 · Kit §04 · 03 Promociones y reglas / §03 · 02 Gestión comercial ("canal, tienda y modalidad")

**Proveedor:** SF

**Pregunta:**
> Hoy, ¿las promociones cambian según la tienda, la zona o la comuna? Si es así, ¿son casos puntuales o algo frecuente? ¿Las define el equipo central o cada franquiciado?

**Respuesta Papa Johns:**
> Sí, pueden variar por tienda, canal, zona/modalidad. La definición es principalmente central.

#### T-117 · Kit §04 · 03 Promociones y reglas / Volumetría (promociones simultáneas "Por levantar")

**Proveedor:** SF

**Pregunta:**
> ¿Cuántas promociones tienen activas al mismo tiempo en una semana normal y en temporada alta? ¿Cuáles son los tipos más frecuentes (2x1, % de descuento, monto fijo, producto de regalo, combo a precio fijo, envío gratis)?

**Respuesta Papa Johns:**
> 7promociones AON y 2 tacticas por semana.combos, %, enviogratis, regalo, etc

#### T-118 · Kit §04 · 04 Cupones, Gift Cards y Loyalty / Volumetría (lotes de hasta 250.000 códigos)

**Proveedor:** SF

**Pregunta:**
> Hoy, ¿qué tipos de cupón usan (código único por cliente o código masivo compartido)? ¿Dónde se generan y por qué canal se entregan al cliente (por ejemplo, Synerise)?

**Respuesta Papa Johns:**
> Usamos códigos únicos y masivos. La carga puede hacerse por CSV en Backoffice y la distribución por CRM, partners u otros canales.

#### T-119 · Kit §03 · 02 Gestión comercial (BIN) / §09 · 04 Checkout y pagos ("Éxito promos por BIN > 99%")

**Proveedor:** SF

**Pregunta:**
> Hoy, las promociones bancarias por BIN, ¿dónde se validan: en la pasarela de pago, en el ecommerce o en Aloha? ¿Con qué bancos o medios de pago trabajan?

**Respuesta Papa Johns:**
> Hoy Mercado Pago soporta validación BIN en tiempo real; otros casos dependen del adquirente/pasarela. La nueva solución debe orquestar elegibilidad y descuento correctamente.

#### T-120 · Kit §04 · 04 Cupones, Gift Cards y Loyalty

**Proveedor:** SF

**Pregunta:**
> Hoy, ¿venden gift cards? ¿Con qué proveedor o sistema se emiten y se valida el saldo?

**Respuesta Papa Johns:**
> Sí. Gift Cards se configuran en Backoffice con monto/vigencia y saldo consumible.

#### T-121 · Kit §05 · Ecosistema (Aloha / OMS) / §04 · 01 Productos y catálogo ("identificadores Aloha")

**Proveedor:** SF

**Pregunta:**
> Cuando llega a Aloha una orden digital con promoción o cupón, ¿cómo se registra hoy el descuento (código de promoción de Aloha, descuento por línea o descuento sobre el total)?

**Respuesta Papa Johns:**
> El descuento llega asociado a códigos/reglas configuradas para Aloha. El mapeo exacto (línea/total/código) se entregará en el diseño de integración.

#### T-122 · Kit §03 · Prueba de concepto 01 ("Configurar una campaña y sus reglas comerciales")

**Proveedor:** SF

**Pregunta:**
> Para preparar la campaña de la PoC, ¿podrían compartirnos 2 o 3 promociones vigentes o recientes como referencia?

**Respuesta Papa Johns:**
> 50%XL,  super duo, arma tu pizza y combos

#### T-123 · Kit §06 · Flujo digital 02 ("calculan tiempos dinámicos y ETA") / Mapa de Capacidades D6-02

**Proveedor:** SF

**Pregunta:**
> Hoy, ¿qué sistema calcula el tiempo estimado de entrega (DispatchTrack, Quick Commerce, su middleware o Aloha)? ¿Considera en tiempo real la carga de la tienda y los repartidores disponibles?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.

#### T-124 · Mapa de Capacidades D5-04 (costo de envío en tiempo real) / D6-03 (agendamiento y ventanas)

**Proveedor:** SF

**Pregunta:**
> ¿Ese sistema expone por API el tiempo estimado, las ventanas disponibles y el costo de envío para una dirección y una tienda, para que Salesforce Commerce Cloud los consulte durante el checkout?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.

#### T-125 · Mapa de Capacidades D6-03 / Volumetría (Orden futura "Por levantar")

**Proveedor:** SF

**Pregunta:**
> En los pedidos programados, ¿qué sistema controla hoy las ventanas y los cupos disponibles por tienda? ¿Con cuánta anticipación se puede programar un pedido?

**Respuesta Papa Johns:**
> Existe capacidad de orden futura en el ecosistema actual y de repetir pedidos

#### T-126 · Mapa de Capacidades D7-02 (zonificación de cobertura) / Volumetría (Cobertura Delivery "Por levantar")

**Proveedor:** SF

**Pregunta:**
> Hoy, ¿dónde se administran las zonas de cobertura y qué sistema determina qué tienda atiende una dirección?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> Toda la edicion de contenido y configuracion se realiza en nuestro backoffice

#### T-127 · Kit §06 · Flujo digital 09 (Quick Commerce, flota propia o externa) / §06 (Peya Envíos, Uber Direct, Rappi)

**Proveedor:** SF

**Pregunta:**
> Hoy, ¿quién decide si un pedido lo despacha la flota propia o una externa, y en qué momento: antes de confirmar la orden o después? ¿Cambia el costo de envío o el tiempo que ve el cliente?

**Respuesta Papa Johns:**
> La propuesta se debe hacer cargo de la experiencia del cliente en los segmentos indicados en la documentación y en todos los canales.
> La gestion de Ultima Milla la reliza un tercero para la asignacion y despacho

#### T-128 · Kit §06 · Flujo digital 04 ("coordina la creación de la orden operacional y su despacho") / §05 · Ecosistema

**Proveedor:** SF

**Pregunta:**
> El kit indica que la API Papa Johns coordina la creación de la orden y su despacho. ¿Confirmamos que, una vez que la orden se inserta en su OMS, el despacho se crea desde ahí y la plataforma de ecommerce solo recibe los estados?

**Respuesta Papa Johns:**
> Sí. La referencia es que el ecommerce entregue la orden al OMS/API Papa Johns; desde allí se crea/coordina despacho y Commerce consume estados.

#### T-129 · Kit §06 · Flujo digital 08 y 11 (DispatchTrack, seguimiento) / Mapa de Capacidades D6-02

**Proveedor:** SF

**Pregunta:**
> Los estados del pedido y el enlace de seguimiento de DispatchTrack, ¿están disponibles hoy por API o eventos? ¿Por qué canales se informan hoy al cliente (app, web, SMS, email)?

**Respuesta Papa Johns:**
> DispatchTrack dispone de seguimiento operacional. El detalle de APIs/eventos y canales actuales de notificación debe confirmarse; la nueva solución debe consumir estados y tracking en tiempo real.

#### T-130 · Kit §08 · FAQ ("Delivery saturado / sin repartidores") / Mapa de Capacidades D7-04

**Proveedor:** SF

**Pregunta:**
> Hoy, cuando una tienda está saturada o sin repartidores, ¿qué sistema lo detecta: el de logística, la tienda o el call center? ¿Es automático o lo marca alguien?

**Respuesta Papa Johns:**
> La saturación combina señales de logística/operación y acciones de tienda. Hoy puede existir intervención manual; buscamos automatizar capacidad, pausas y alternativas al cliente.

#### T-131

**Proveedor:** SF

**Pregunta:**
> ¿La app iOS/Android actual se mantiene y pasa a consumir las APIs de la nueva plataforma, o esperan reconstruirla?

**Respuesta Papa Johns:**
> No cerramos aún mantener vs reconstruir. Requerimos una arquitectura API-first que permita migración progresiva y una experiencia App/Web consistente; la propuesta puede recomendar el enfoque.

#### T-132

**Proveedor:** SF

**Pregunta:**
> ¿La plataforma debe soportar otras marcas o países a futuro (crecimiento inorgánico)? ¿Y a las franquicias?

**Respuesta Papa Johns:**
> No necesariamente pero seria una capacidad diferenciadora

_Total filas con pregunta en la hoja: 132_

