# Papa Johns Chile · Anexo: preguntas investigadas (23 y 24-oct)

- **Estado:** archivo. Registro de las 29 preguntas que se evaluaron para Salesforce, con la respuesta propuesta, la investigación en la documentación y la decisión de cada una.
- **Vigente:** las preguntas que siguen abiertas y los supuestos están en la [vista unificada §9 y §11](solucion-vista-unificada.md). Algunas respuestas de este anexo hablan de escenarios anteriores (A, C1, «sin OMS»); la propuesta vigente está en la vista unificada §3.

---

## Preguntas con respuesta propuesta: ¿las cierras tú o quedan para Salesforce?

Cada pregunta trae lo que ya sabemos, por el proyecto, la experiencia de Avatar o el sandbox con Storefront Next 2026.10 que tenemos andando. **Confianza** indica cuánto confías en la respuesta propuesta si decides cerrarla tú.

**Decisión del usuario (23-oct) y resultado de la investigación:**

| Estado | Preguntas | N.º |
|---|---|---|
| **Se pregunta a Salesforce en la reunión** (no está en la documentación: comercial, alcance, referencias) | 1, 2, 3, 17, 23 | 5 |
| **Respondida con documentación**, con una duda puntual que se pregunta si hay tiempo | 14 | 1 |
| **Respondida con documentación**, con una duda puntual que queda para discovery | 12, 16, 19, 20, 21, 28, 29 | 7 |
| **Respondida con documentación**, cerrada | 5, 6, 18, 22 | 4 |
| **No se pregunta en esta etapa** (queda como supuesto) | 4, 7, 8, 9, 10, 11, 13, 15, 24, 25, 26, 27 | 12 |

La investigación se hizo el 23-oct en developer.salesforce.com, help.salesforce.com, Anypoint Exchange, la documentación de Storefront Next de nuestro repo y los portales de desarrolladores de Zendesk y de los agregadores. Cada respuesta trae sus fuentes.

### 1 Alcance

**1. ⭐ ¿Con qué productos va Salesforce a la cuenta?**
- Propuesta: Commerce + MuleSoft (o alternativa) en la fase 1, y la plataforma completa como lámina de visión. *(24-oct: decisión final: Commerce + OMS + Marketing Cloud + MuleSoft, y Business Manager con la oferta digital; el futuro del backoffice se evalúa en el camino; §3 a §5.)*
- Confianza: — (es su decisión).
- Sugerencia: **Salesforce**.
- **Decisión: se pregunta a Salesforce.** [x] Queda para Salesforce

**3. ¿Hay referencias QSR o delivery en LATAM con B2C Commerce?**
- Propuesta: no tenemos una referencia QSR propia que mostrar; el cliente pide referencias y visitas (A-13).
- Confianza: —.
- Sugerencia: **Salesforce**.
- **Decisión: se pregunta a Salesforce.** [x] Queda para Salesforce

### 2 Con qué contamos

**4. ⭐ ¿Cuántos sandboxes y qué ambientes vienen? ¿Hay ambiente para pruebas de carga?**
- Propuesta: B2C Commerce trae el grupo de instancias principal (desarrollo, staging y producción) más sandboxes bajo demanda según el contrato. Las pruebas de carga se coordinan con Salesforce por un caso de soporte, normalmente sobre producción antes del go-live.
- Confianza: media. La estructura la conoces; la cantidad de sandboxes depende del contrato.
- Sugerencia: **tú, confirmando la cantidad con Salesforce**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: Grupo de instancias estándar (desarrollo, staging, producción) más sandboxes bajo demanda; la cantidad la fija el contrato. Las pruebas de carga se coordinan en la implementación.

**5. ¿Qué tan maduro está Storefront Next? ¿Qué le falta?**
- Propuesta: lo tenemos andando en el sandbox PapaJohnsCL (plantilla 2026.10, Managed Runtime). Trae Page Designer, adaptadores para Einstein y datos de SCAPI. Hay que revisar en el sandbox: pedido a nombre del cliente, multisitio y pruebas A/B.
- Confianza: media-alta en lo que ya usamos; baja en su roadmap.
- Sugerencia: **tú, confirmando el roadmap 2027 con Salesforce**.
- **Investigado en la documentación (23-oct):** Storefront Next está **disponible para producción desde junio de 2026** (B2C Commerce 26.6), con versiones mensuales del SDK (1.0 a 1.4, octubre). Salesforce lo marca como la opción recomendada. Trae Page Designer nativo, multisitio, adaptadores para Einstein y Data 360, e integración con OMS y Salesforce Payments. Limitaciones documentadas: no tiene los content slots de SFRA; **no soporta Trusted Agent on Behalf** (ver P14); el localizador devuelve como máximo 200 tiendas en 100 km; la herramienta de migración desde SFRA está en developer preview.
- Fuentes: developer.salesforce.com/docs/commerce/commerce-vibes/guide/sfnext-release-notes.html · …/which-product.html · …/b2c-commerce/guide/sfnext-page-designer.html
- **Decisión: respondida con documentación.** Cerrada.

**6. ¿Hay aceleradores o implementaciones de referencia para QSR?**
- Propuesta: no conocemos uno público para configurador de pizza o combos; lo estimamos como desarrollo.
- Confianza: media.
- Sugerencia: **Salesforce**.
- **Investigado en la documentación (23-oct):** **Salesforce no tiene aceleradores para restaurantes ni QSR.** Las plantillas de Storefront Next son Foundations, Retail, Beauty, Footwear, Furniture y Luxury. Lo más cercano es la solución para supermercados (SFRA, 2020) con gestor de franjas horarias. Nuestra plantilla trae selección de tienda, retiro en tienda y despacho. Hay ofertas de partners (por ejemplo, el «QSR Accelerator» de OSF Digital), no verificadas.
- Fuentes: developer.salesforce.com/docs/commerce/commerce-solutions/guide/grocery-sk.html · …/commerce-vibes/guide/sfnext-template-compare.html
- **Decisión: respondida con documentación.** Cerrada; configurador, combos y pedido programado son desarrollo nuestro.

**7. ¿Hay integraciones de pago certificadas para Chile?**
- Propuesta: Avatar ya integró **Webpay y Mercado Pago** en SFCC (SFRA). En headless se reutiliza la lógica del servidor, pero el front y los hooks de SCAPI se adaptan. Fintoc, Pluxee, Rutpay y la carga contra entrega se estiman como desarrollo; GPay y Apple Pay van a través de la pasarela.
- Confianza: alta en Webpay y Mercado Pago; media en el resto.
- Sugerencia: **tú**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: Se reutiliza la experiencia de Avatar con Webpay y Mercado Pago; Fintoc, Pluxee, Rutpay y el pago contra entrega son desarrollo.

**8. ¿Qué soporte técnico de Salesforce tenemos durante la implementación?**
- Propuesta: depende del plan de éxito que compre el cliente (estándar, Premier o Signature) y de si se suman servicios profesionales de Salesforce.
- Confianza: media.
- Sugerencia: **Salesforce**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: El soporte depende del plan de éxito que compre el cliente; no lo incluimos en nuestro costo.

**9. ¿Pueden extender los sandboxes de la POC 2 semanas y acompañar la demo?**
- Propuesta: —.
- Sugerencia: **Salesforce**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: La extensión de los sandboxes de la POC y el acompañamiento en la demo se coordinan aparte, más cerca de la demo.

### 3 Cómo construir Commerce

**10. ⭐ ¿Qué garantiza la plataforma en los picos y qué diseñamos nosotros?**
- Propuesta: Salesforce escala la infraestructura (SaaS) y Managed Runtime escala el storefront. Nosotros diseñamos la caché (CDN y SCAPI), evitamos llamadas sin caché en el camino crítico y dimensionamos la integración y la API PJ. Hay que saber las cifras del SLA, los límites de SCAPI y si se avisa antes de un evento.
- Confianza: media en el reparto; baja en las cifras.
- Sugerencia: **Salesforce**, por las cifras.
- **Decisión: no se pregunta en esta etapa.** Supuesto: Proponemos nuestro propio SLA P50/P95/P99 (T-36) como supuesto, con cifras a confirmar con Salesforce antes de firmar.

**11. ¿Mitades, combos e ingredientes dobles salen con el modelo estándar?**
- Propuesta: tamaño, masa y borde con variantes; ingredientes como opciones de producto con precio; combos fijos con bundles. **Las mitades y los combos armables son desarrollo**: una estructura por mitad, un hook de cálculo que cobra la mitad más cara y el mapeo a los IDs Aloha.
- Confianza: alta.
- Sugerencia: **tú**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: Mitades y combos armables son desarrollo sobre variantes, opciones y bundles.

**12. ¿Price books por tienda × canal × modalidad × zona?**
- Propuesta: price books por canal × zona (9, según T-94), asignados por sitio o grupo de clientes; la elección por tienda y modalidad en la sesión es desarrollo. Validarlo con una prueba en el sandbox.
- Confianza: media.
- Sugerencia: **tú, confirmando el límite de price books y el rendimiento con Salesforce**.
- **Investigado en la documentación (23-oct):** **No hay problema de límites:** hasta 5.000 listas de precios por instancia (700 editables) y hasta 2.000 asignaciones por tienda; el cliente usa 9. En headless, la lista activa se elige desde el servidor con la **Shopper Context API**: por tienda (`assignmentQualifiers`), por segmento de sesión para el canal o la modalidad (`customQualifiers` y grupos de clientes dinámicos) o por código de campaña (`sourceCode`). **Elegirla en un hook, como en SFRA, no es compatible con la caché de SCAPI.**
- Fuentes: salesforcecommercecloud.github.io/b2c-dev-doc/docs/current/quota/html/Object_Quotas.html · developer.salesforce.com/docs/commerce/commerce-api/guide/shopper-context-api.html · …/shopper-context-api-store-specific.html
- **Decisión: respondida con documentación.** Queda para discovery: cuántas variantes de caché aguanta tener 9 listas por 100 a 300 tiendas, y cómo se recalcula el carrito al cambiar de tienda o de modalidad.

**13. ¿Cómo se migra desde Cognito a SLAS?**
- Propuesta: Cognito no exporta los hashes de las contraseñas. Hay tres opciones: (a) federar Cognito como proveedor de identidad (OIDC) en SLAS durante la transición; (b) migrar en el primer login; (c) acceso con código por correo, que evita la contraseña. Las órdenes de 24 meses se importan como historial.
- Confianza: media-alta en el diagnóstico; media en la federación.
- Sugerencia: **tú, confirmando con Salesforce que SLAS acepta Cognito como proveedor**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: Migración en el primer login o acceso con código por correo; la federación con Cognito se valida en discovery.

**14. ¿Cómo toma pedidos el Call Center a nombre del cliente? ¿Y el tótem?**
- Propuesta: SLAS tiene un flujo de agente de confianza que actúa en nombre del cliente (*Trusted Agent on Behalf*); el tótem usa un cliente privado de SLAS como invitado.
- Confianza: media.
- Sugerencia: **tú, confirmando que el flujo de agente funciona en headless**.
- **Investigado en la documentación (23-oct):** SLAS tiene el flujo **Trusted Agent on Behalf**, y el ejemplo de la documentación es justamente un call center (el agente entra con Account Manager; el token dura 15 minutos y no se renueva; requiere permisos funcionales `Login_On_Behalf` y `Create_Order_On_Behalf`). **Pero Storefront Next no lo soporta** (tabla oficial: «No»). La pantalla del agente es **desarrollo propio sobre SCAPI**. Para el tótem no hay guía oficial: lo indicado es un cliente SLAS privado con sesión de invitado.
- Fuentes: developer.salesforce.com/docs/commerce/commerce-api/guide/slas-trusted-agent.html · developer.salesforce.com/docs/commerce/b2c-commerce/guide/sfnext-login-support.html
- **Decisión: respondida con documentación.** Se pregunta en la reunión si hay tiempo: si hay fecha para soportar el flujo en Storefront Next y qué herramienta de agente recomiendan mientras tanto.

**15. ¿Hay SDK móvil para que la App consuma SCAPI?**
- Propuesta: SCAPI es REST y se consume desde cualquier App. Existe el SDK de JavaScript (`commerce-sdk-isomorphic`); no tenemos certeza de SDK nativos para iOS o Android.
- Confianza: baja en los nativos.
- Sugerencia: **Salesforce**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: La App consume SCAPI por REST; el enfoque (adaptar o reconstruir) depende de la decisión del cliente (T-131).

**16. ¿Alcanzan Page Designer y la biblioteca para el DAM? ¿Qué herramienta A/B con Storefront Next?**
- Propuesta: Page Designer cubre página y contenido, pero no es un DAM. Business Manager tiene pruebas A/B pensadas para el storefront clásico; con headless hay que validar.
- Confianza: media-baja.
- Sugerencia: **Salesforce**.
- **Investigado en la documentación (23-oct):** **Page Designer no es un DAM.** Salesforce ofrece Salesforce CMS, cuyo contenido se copia a la página. Las imágenes se sirven optimizadas con el servicio de imágenes dinámicas. **No está documentado que las pruebas A/B de Business Manager funcionen con Storefront Next** (la herramienta de migración dice que hay que «recrearlas»). Los feature flags son configuración estática y cambiarlos redespliega el entorno. Experimentos y flags van con una herramienta de terceros.
- Fuentes: help.salesforce.com/s/articleView?id=cc.b2c_ab_testing.htm · developer.salesforce.com/docs/commerce/b2c-commerce/guide/b2c-dev-for-page-designer.html · …/sfnext-migration-tool.html
- **Decisión: respondida con documentación.** Queda para discovery: si las pruebas A/B de Business Manager aplican a peticiones SCAPI de Storefront Next.

### 4 Datos maestros e integración

**17. ⭐ ¿Hay QSR donde Commerce sea el maestro de la oferta para otros canales?**
- Propuesta: no lo sabemos; el patrón de industria suele ser el POS o una herramienta de menú (sección 7.5).
- Sugerencia: **Salesforce**.
- **Decisión: se pregunta a Salesforce.** [x] Queda para Salesforce

**18. ¿Commerce cubre aprobación, programación, historial y rollback?**
- Propuesta: hay roles y permisos en Business Manager, programación en promociones, price books y Page Designer, y control por replicación de staging a producción (se puede deshacer la última replicación). **No hay flujo de aprobación general**: se construye o se resuelve con un procedimiento.
- Confianza: media-alta.
- Sugerencia: **tú**.
- **Investigado en la documentación (23-oct):** **No hay flujo de aprobación nativo** para catálogo, precios, promociones ni Page Designer. El control documentado es separar roles: uno prepara la publicación y otro la ejecuta. Hay programación por fechas (listas de precios, campañas, visibilidad en Page Designer, publicaciones recurrentes). El historial de cambios guarda **entre 1 y 7 días** y en producción no registra catálogo, precios ni contenido; promociones y cupones no tienen historial. «Deshacer» revierte solo la última publicación completa. No hay versionado de páginas de Page Designer.
- Fuentes: help.salesforce.com/s/articleView?id=cc.b2c_change_history.htm · …id=cc.b2c__replication_best_practices.htm · …id=cc.b2c_undo_data_replication_process.htm
- **Decisión: respondida con documentación.** Cerrada (aprobación y reversa son desarrollo, como teníamos en la matriz).

**19. ¿Cuánto tarda la replicación y cuántas al día?**
- Propuesta: con un catálogo de este tamaño (cientos de productos, no miles) toma minutos; se agenda. Recomendamos pocas al día y dejar la disponibilidad fuera de la replicación.
- Confianza: media.
- Sugerencia: **tú, confirmando la cifra con Salesforce o con un proyecto anterior**.
- **Investigado en la documentación (23-oct):** Se publica de staging a producción: catálogos, listas de precios, promociones, cupones, contenido y tiendas. **El inventario no se publica**: se carga directo en producción. Hay **publicación granular** para productos, precios y páginas, «varias veces al día», que se puede disparar por API. Una publicación completa invalida la caché en unos 15 minutos. Se recomienda en horas de poco tráfico. **No hay una duración documentada.**
- Fuentes: help.salesforce.com/s/articleView?id=cc.b2c_data_replication.htm · …id=cc.b2c_granular_data_replications.htm · developer.salesforce.com/docs/commerce/commerce-api/references/replications
- **Decisión: respondida con documentación.** Queda para discovery: duración típica de una publicación con el volumen del cliente.

**20. ⭐ ¿Quiebres por tienda en minutos: inventory list u Omnichannel Inventory? ¿«Sin piña, sin hawaiana»?**
- Propuesta: una lista de inventario por tienda, actualizada por API directo en producción, alcanza para bloquear y desbloquear. La regla ingrediente → producto es **desarrollo** en la capa de integración: ninguno de los dos modela recetas. Omnichannel Inventory solo si se necesita más volumen o latencia.
- Confianza: media.
- Sugerencia: **tú, confirmando los límites de llamadas con Salesforce**.
- **Investigado en la documentación (23-oct):** **Lista de inventario por tienda**, actualizada por API (SCAPI Admin Inventory Lists) directo en producción; para bloquear basta con dejar el stock en 0. El sitio lo ve en hasta 60 segundos por la caché de disponibilidad. **Omnichannel Inventory** tarda segundos, pero limita a 100 actualizaciones cada 10 segundos. **Ninguno modela recetas**: «sin piña, sin hawaiana» es desarrollo en la capa de integración.
- Fuentes: developer.salesforce.com/docs/commerce/commerce-api/references/inventory-lists · …/commerce-api/guide/throttle-rates.html · help.salesforce.com/s/articleView?id=cc.b2c_inventory_management_omnichannel_inventory.htm
- **Decisión: respondida con documentación.** Queda para discovery: latencia de punta a punta de la API de inventario y si tiene un límite de llamadas no publicado.

**21. ¿MuleSoft tiene conectores para Uber Eats, Rappi y PedidosYa?**
- Propuesta: no lo sabemos; hoy los agregadores entran por la API PJ.
- Sugerencia: **Salesforce**.
- **Investigado en la documentación (23-oct):** **MuleSoft no tiene conectores para Uber Eats, Rappi ni PedidosYa** (búsqueda en Anypoint Exchange). Los tres tienen APIs de menú y de órdenes, pero con aprobación previa; PedidosYa pide NDA y es más limitado en catálogo. Las cadenas suelen publicar con un middleware de menú (por ejemplo Deliverect, que integra los tres) o desde el POS. **Contexto (prensa, no oficial):** en julio de 2026 Uber anunció la compra de Delivery Hero y PedidosYa Chile se vendería a otro dueño (cierre previsto en 2027).
- Fuentes: anypoint.mulesoft.com/exchange · developer.uber.com/docs/eats/guides/menu · dev-portal.rappi.com · integrar.pedidosya.com · deliverect.com/es/integrations/uber-eats
- **Decisión: respondida con documentación.** Queda para discovery: si existe algún activo privado o de partners para agregadores.

**22. ¿Hay aceleradores de MuleSoft para B2C Commerce?**
- Propuesta: existe un acelerador de MuleSoft para retail con plantillas de Commerce; hay que ver si sirve para catálogo, precios, inventario y órdenes en este caso.
- Confianza: media-baja.
- Sugerencia: **Salesforce**.
- **Investigado en la documentación (23-oct):** Existe el **MuleSoft Accelerator for Retail** (última versión de marzo de 2024) con una API de sistema para B2C (productos, inventario, estado de orden, promociones; **no** listas de precios), pero usa OCAPI, que Salesforce declaró obsoleta en 2026. Los conectores de B2C para Mule 4 están deprecados desde abril de 2025. Salesforce recomienda el conector HTTP sobre SCAPI. **Sirve como referencia de arquitectura, no como acelerador real.**
- Fuentes: anypoint.mulesoft.com/exchange/org.mule.examples/mulesoft-accelerator-for-retail · docs.mulesoft.com/release-notes/connector/commerce-cloud-b2c-data-connector-release-notes-mule-4 · developer.salesforce.com/docs/commerce/commerce-api/guide/why-use-scapi.html
- **Decisión: respondida con documentación.** Cerrada.

**23. Si el cliente no compra MuleSoft, ¿Salesforce sigue apoyando la oferta?**
- Sugerencia: **Salesforce**.
- **Decisión: se pregunta a Salesforce.** [x] Queda para Salesforce

### 5 Otros productos

**24. ¿Qué construiríamos en OMS si el cliente mantiene Aloha?**
- Propuesta: no entra en la fase 1 (sección 8.4). Solo preguntar si Salesforce insiste en incluirlo.
- Sugerencia: **Salesforce**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: OMS no entra en la fase 1 (sección 8.4).

**25. ¿Mostramos OMS en la demo?**
- Propuesta: como evolución, no como fase 1, o no mostrarlo; es una decisión nuestra (sección 8.4).
- Confianza: alta.
- Sugerencia: **tú**, y si quieres, escuchas la opinión de Salesforce.
- **Decisión: no se pregunta en esta etapa.** Supuesto: Decisión nuestra: OMS se muestra como evolución o no se muestra.

**26. ¿Data Cloud puede leer de Synerise o del DWH sin migrar? ¿Qué esfuerzo tiene un caso mínimo?**
- Propuesta: Data Cloud tiene *zero copy* con algunos data warehouses (Redshift entre ellos); Synerise no tiene conector conocido, así que iría por API o archivo.
- Confianza: media-baja.
- Sugerencia: **Salesforce**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: Data Cloud no entra en la fase 1; se reevalúa si Synerise no entrega segmentos en tiempo real (T-63).

**27. ¿Alcanza la personalización sin Data Cloud para Sofía, Diego y Valentina?**
- Propuesta: sí. Grupos de clientes dinámicos por reglas (con atributos que llegan de Synerise), grupos por código de campaña para la fuente de tráfico, Page Designer con visibilidad por grupo y Einstein para recomendaciones. El límite es la frescura del segmento de Synerise (semanal).
- Confianza: alta.
- Sugerencia: **tú**.
- **Decisión: no se pregunta en esta etapa.** Supuesto: La personalización se resuelve con grupos de clientes, Page Designer y Einstein (sección 10, P27).

**28. ¿Hay conector de Zendesk que muestre órdenes de Commerce?**
- Propuesta: se revisa el marketplace de Zendesk; si no hay uno que sirva, es una app lateral de Zendesk que consulta a la capa de integración (esfuerzo M en la matriz, D10-02).
- Confianza: media.
- Sugerencia: **tú**.
- **Investigado en la documentación (23-oct):** **No hay app en el marketplace de Zendesk que muestre órdenes de B2C Commerce.** agnoStack lo anuncia «en los próximos meses»; la app «Salesforce» del marketplace es para Sales/Service Cloud. El patrón documentado es una **app lateral propia** (Zendesk Apps Framework) que llama a una API nuestra, y esa API consulta SCAPI.
- Fuentes: developer.zendesk.com/documentation/apps/app-developer-guide/making-api-requests-from-a-zendesk-app · zendesk.com/marketplace/apps/support/835629/commercetools-by-agnostack
- **Decisión: respondida con documentación.** Queda para discovery: qué endpoint de SCAPI busca órdenes por correo o por cliente con credenciales de servidor.

**29. ¿Agentforce para Commerce sobre WhatsApp está disponible en Chile y en español?**
- Sugerencia: **Salesforce**.
- **Investigado en la documentación (23-oct):** **El agente de compras de B2C Commerce (Shopper Agent) solo habla inglés y solo funciona en el chat del sitio**; WhatsApp se anunció para el agente B2B. La alternativa es **Agentforce Service Agent** en el canal de WhatsApp de Service Cloud, con español disponible (es_ES y es_MX, no es_CL) y conexión directa con Meta sin BSP; pero para tomar pedidos hay que construir las acciones contra SCAPI. No hay documentación de disponibilidad por país.
- Fuentes: help.salesforce.com/s/articleView?id=cc.b2c_shopper_agent_language_locale_support.htm · …id=cc.b2c_shopper_agent_limitations.htm · …id=service.messaging_whatsapp_enhanced.htm
- **Decisión: respondida con documentación.** Queda para discovery: roadmap de español y WhatsApp para el Shopper Agent, y disponibilidad en Chile.
