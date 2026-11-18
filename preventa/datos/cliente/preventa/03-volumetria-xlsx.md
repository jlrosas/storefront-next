# Volumetría Papa Johns, versión Excel (transcripción y diferencias con el PDF)

- **Origen:** `PapaJohns-Preventa/Kit del Proveedor/Volumetria Papa Johns.xlsx`. Tiene dos hojas: «Volumetria_RFP» (A1:E60) y «Resumen_Ejecutivo» (A1:D12).
- **Relación con el PDF:** el PDF `Volumetria Papa Johns.pdf` (transcrito en `datos/cliente/kit-pj/README.md`) es una **versión anterior**. El Excel llena casi todos los «Por levantar», separa usuarios Web y App, y quita tres filas. **Para la propuesta manda el Excel**; el PDF sirve solo para ver qué cambió.
- **Formato de las celdas:** el ticket promedio tiene formato moneda ($). «Orden futura» vale `0.01` con formato `0%`, es decir **1 %**. Los demás números vienen sin formato. Se respeta la ortografía del original.

## Hoja «Volumetria_RFP»

Título: «Volumetría y dimensionamiento – Nueva Plataforma Ecommerce Omnicanal».

| Bloque | Dimensión | Indicador / descripción | Volumen actual / referencia | Estado | Cambio vs. PDF |
|---|---|---|---|---|---|
| Tráfico y usuarios | Sesiones App + Web | Total de sesiones mensual generadas en los canales propios App y Web. | 2.800.000 | ok | **Antes:** ~700.000 / semana. Ahora es mensual (≈ 4 × 700 K) |
| Tráfico y usuarios | Usuarios activos Web | Usuarios únicos que visitan Web en una mes. Separar de sesiones para dimensionar audiencia real. | 570.000 | ok | **Nuevo.** Reemplaza «Usuarios únicos App + Web: Por levantar» |
| Tráfico y usuarios | Usuarios activos App | Usuarios únicos que visitan App en un mes. Separar de sesiones para dimensionar audiencia real. | 560.000 | ok | **Nuevo.** Reemplaza «MAU App ~500.000; Web por levantar» |
| Tráfico y usuarios | Peak de demanda | Multiplicador de tráfico observado en eventos de alta demanda respecto de un día normal: 1 por mes, 10 a 12 al año. | Hasta 7x vs. un día normal | ok | igual |
| Tráfico y usuarios | Eventos peak | Principales eventos que generan estrés de demanda y requieren escalabilidad extraordinaria. | Día de la Pizza, Cyber y campañas masivas | ok | igual |
| Tráfico y usuarios | Mix fuente de tráfico | Distribución de sesiones/usuarios por fuente: | 40%Directo, 8% Organic, 36% Paid, 16% CRM, | ok | **Llenado** (antes «Por levantar») |
| Tráfico y usuarios | Tiempo de interacción | Tiempo medio de interacción/engagement por sesión en App y Web. | 7,06 minutos | ok | **Llenado** |
| Transacciones | Órdenes App | Órdenes mensuales procesadas por la App propia. | ~300.000 / mes | ok | igual |
| Transacciones | Órdenes Web | Órdenes mensuales procesadas por el sitio Web. | ~100.000 / mes | ok | igual |
| Transacciones | Órdenes Agregadores | Órdenes mensuales provenientes de marketplaces de delivery. | ~200.000 / mes | ok | igual |
| Transacciones | Órdenes Tótem | Órdenes mensuales procesadas por tótems de autoatención. | ~2.500 / mes | ok | igual |
| Transacciones | Órdenes Call Center | Órdenes mensuales gestionadas por Call Center. | ~20.000 / mes | ok | igual |
| Transacciones | Órdenes ecosistema actual | Volumen mensual aproximado sumando App, Web, Agregadores, Tótem y Call Center. | ~622.500 / mes | ok | igual |
| Transacciones | Órdenes por franja: Apertura | Participación de las órdenes del día concentradas en la franja de apertura. | 4% | ok | igual |
| Transacciones | Órdenes por franja: Almuerzo | Participación de las órdenes del día concentradas en la franja de almuerzo. | 11% | ok | igual |
| Transacciones | Órdenes por franja: Valle | Participación de las órdenes del día concentradas en la franja valle. | 10% | ok | igual |
| Transacciones | Órdenes por franja: Peak | Participación de las órdenes del día concentradas en la principal franja peak. | 70% | ok | igual |
| Transacciones | Órdenes por franja: Cierre | Participación de las órdenes del día concentradas en la franja de cierre. | 5% | ok | igual |
| Transacciones | Concurrencia máxima | Máximo número de usuarios/sesiones concurrentes durante un evento peak. | promedio diario app 70K - Peak 260K // Web promedio diario 30K - Peak 245K | ok | **Llenado.** Según T-30 son **sesiones, no concurrencia simultánea** |
| Transacciones | Ticket promedio por canal | Ticket promedio de compra por App, Web, Agregadores, Tótem y Call Center. | $15.690 | ok | igual (un solo valor, no viene por canal) |
| Transacciones | Conversión App + Web | Tasa de compra sobre sesiones en los canales propios. | ~18% | ok | igual |
| Transacciones | Conversión Web | Tasa de compra sobre sesiones Web. | ~14% | ok | igual |
| Transacciones | Conversión App | Tasa de compra sobre sesiones App. | ~22% | ok | igual |
| Transacciones | Mix Delivery / Pick Up | Distribución de órdenes de canales propios según modalidad de entrega. | Referencia 2025: Delivery 49% / Pick Up 51% | ok | igual |
| Cliente, CRM y Loyalty | Base de clientes | Tamaño de la base total e identificada, diferenciando registrados, activos y contactables. | activos: 1.5M | ok | **Llenado.** T-1 dice 1,2 M activos y 2,5 M en total |
| Cliente, CRM y Loyalty | Segmentos Lover / Switcher / Non Buyer | Distribución de clientes según frecuencia, afinidad y comportamiento de compra. | (vacío) | Pendiente | sigue pendiente |
| Cliente, CRM y Loyalty | Loyalty / Papa Puntos | Socios inscritos, socios activos y porcentaje de órdenes con acumulación o redención. | ~1M socios objetivo; ~281k activos como referencia histórica | ok | igual |
| Cliente, CRM y Loyalty | Push | Volumen mensual de comunicaciones push y base habilitada para recibirlas. | ~12 campañas/mes; base histórica ~430k | ok | igual |
| Cliente, CRM y Loyalty | Email | Volumen mensual de comunicaciones email y base habilitada para recibirlas. | ~8 campañas/mes; base histórica ~710k | ok | igual |
| Cliente, CRM y Loyalty | WhatsApp | Volumen esperado de conversaciones, sesiones comerciales y órdenes del canal conversacional. | Se estima recuperar al menos el 2% de cleintes inactivos o perdidos: 10K | ok | **Llenado.** T-2 dice 5 % de activos + 3 % de dormidos |
| Cliente, CRM y Loyalty | Frecuencia de compra | Promedio de compras por cliente activo en una ventana definida (p.ej. 6 o 12 meses). | Referencia Loyalty: 5,7 compras en 6 meses; validar base total | ok | igual |
| Cliente, CRM y Loyalty | Recompra | Porcentaje de órdenes/clientes que repiten compra y uso de funcionalidad 'repetir pedido'. | (vacío) | Pendiente | sigue pendiente |
| Cliente, CRM y Loyalty | Cross-selling | Porcentaje de pedidos que incorporan al menos un ítem adicional sugerido. | ~25% de pedidos; objetivo de evolución a validar | ok | igual |
| Cliente, CRM y Loyalty | Personalización | Porcentaje de usuarios/sesiones susceptibles de recibir contenido, promociones o recomendaciones personalizadas. | (vacío) | Pendiente | sigue pendiente |
| Catálogo, contenido y promociones | Tiendas activas | Cantidad de tiendas operativas que deben ser soportadas por catálogo, disponibilidad, precios y fulfillment. | 176 | ok | **Llenado** |
| Catálogo, contenido y promociones | Cobertura Delivery | Número de zonas/polígonos y reglas de cobertura utilizadas para asignación de tienda y delivery. | todo el pais | ok | **Llenado** (sin número de polígonos) |
| Catálogo, contenido y promociones | SKUs / variantes | Cantidad de productos activos, variantes y configuraciones comercializables por canal/tienda. | 50 complementos / 31 ingredientes / 28 pizzas x 3 tamaños / 3 tipos de masas | ok | **Llenado.** T-78 dice 4 tamaños, 4 masas y 2 bordes |
| Catálogo, contenido y promociones | Complejidad pizza configurada | Combinaciones posibles de tamaño, masa, borde, ingredientes, mitades y restricciones. | Configurador dinámico y multivariable: tamaño, masa, borde, ingredientes adicionales o removidos, medias pizzas y restricciones comerciales u operativas. La cantidad de combinaciones es variable según producto, tienda, canal y disponibilidad. | ok / pendiente dato | Redactado; sigue sin cifra |
| Catálogo, contenido y promociones | Promociones simultáneas | Cantidad máxima de promociones, bundles, descuentos y reglas comerciales activas concurrentemente. | 10 promocioes AON + 5 promociones tacticas | ok | **Llenado.** T-117 dice 7 AON + 2 tácticas por semana |
| Catálogo, contenido y promociones | Cupones | Volumen de cupones activos/redimidos y capacidad de generar códigos masivos. | Referencias recientes: lotes de hasta 250.000 códigos | ok | igual |
| Catálogo, contenido y promociones | Activos digitales - imágenes | Cantidad de imágenes de producto, categoría, campaña y contenido administradas por CMS/DAM. | Imágenes de catálogo, productos, categorías, promociones, campañas, banners y contenido institucional. Debe contemplarse administración multicanal, versionamiento, optimización y publicación mediante CMS/DAM. Volumetría exacta pendiente de inventario. | ok / pendiente dato | Redactado; sin cifra |
| Catálogo, contenido y promociones | Activos digitales - banners | Cantidad de banners/carruseles activos y renovados por mes, diferenciados por canal/dispositivo. | 3 a 4 por semanas difernaciados por web/app/ totem | ok | **Llenado** |
| Catálogo, contenido y promociones | Activos digitales - videos | Cantidad y peso de videos utilizados en landings, campañas o contenido digital. | Contenido audiovisual asociado a campañas, landings y acciones comerciales. La solución debe soportar videos responsivos, reproducción optimizada y distribución mediante CDN. Cantidad y almacenamiento actual pendientes de validación. | ok / pendiente dato | Redactado; sin cifra |
| Catálogo, contenido y promociones | Landings y piezas por canal | Número de landings, splash, pop-ups, thumbnails, íconos y creatividades específicas para App, Web, Tótem y WhatsApp. | Administración de home, landings, banners, splash screens, pop-ups, thumbnails, íconos y creatividades diferenciadas para Web, App, Tótem y WhatsApp, con segmentación y programación comercial. | ok / pendiente dato | Redactado; sin cifra |
| Catálogo, contenido y promociones | SEO | Número de páginas indexables, landings SEO y volumen de contenido que requiere metadata, canonical, schema y control técnico. | Arquitectura indexable que contempla home, menú, categorías, productos, promociones, regiones, tiendas y contenidos editoriales. Debe soportar metadata, canonical, sitemap, schema, redirecciones y control de indexación | ok / pendiente dato | Redactado; sin cifra |
| Checkout, pagos y funnel | Pasos end-to-end | Cantidad de pasos/interacciones desde entrada hasta orden confirmada en journeys principales (orgánico, deep link, recompra). | Journeys diferenciados por fuente de tráfico, modalidad de entrega, identificación del cliente y tipo de compra. Se requiere minimizar las interacciones desde la entrada hasta la confirmación de compra y medir cada etapa. | ok / pendiente dato | Redactado; sin cifra |
| Checkout, pagos y funnel | Abandono de carrito | Porcentaje de carritos iniciados que no finalizan en compra (Mes) | 65K APP // 33K web | ok | **Llenado** con cantidades al mes, no con % |
| Checkout, pagos y funnel | Tasa de rechazo de pago | Porcentaje de intentos de pago rechazados sobre el total de intentos, por proveedor y medio de pago. | 85% de éxito | ok | **Llenado:** 15 % de rechazo implícito |
| Checkout, pagos y funnel | Medios de pago activos | Cantidad y tipo de medios integrados: débito/crédito, wallets, transferencias, giftcards y beneficios bancarios. | Ecosistema que contempla tarjetas de débito y crédito, billeteras digitales, transferencias, beneficios bancarios y convenios. La arquitectura futura debe permitir sumar proveedores sin rediseñar el checkout. | ok / pendiente dato | Redactado |
| Checkout, pagos y funnel | Promociones por BIN | Capacidad de identificar emisor/BIN y aplicar beneficios o descuentos bancarios. | Requerimiento funcional obligatorio | ok | igual |
| Operación y órdenes | Orden futura | Volumen/porcentaje de órdenes programadas y ventana máxima permitida. | 1% | ok | **Llenado** (sin ventana máxima) |
| Operación y órdenes | Cancelaciones / VOID | Tasa de órdenes canceladas, anuladas o con incidencias operativas. | Medición de órdenes anuladas, canceladas, rechazadas e incidencias operativas, diferenciadas por canal, tienda, proveedor de pago, etapa y causa raíz. Tasa actual pendiente de extracción operacional. | ok / pendiente dato | Redactado; sin cifra |
| Operación y órdenes | Disponibilidad / uptime | Nivel de disponibilidad requerido para la plataforma y servicios críticos. | Sugerido RFP: ≥99,95% mensual; validar con TI | ok | igual |
| Operación y órdenes | Canales soportados | Canales que deberán consumir las capacidades de la nueva plataforma omnicanal. | App, Web, Agregadores, Call Center, Tótem y WhatsApp | ok | igual |
| Tecnología e integraciones | Integraciones críticas | Sistemas que deben interoperar con la plataforma: POS/OMS, CRM/CDP, pagos, analytics, loyalty, despacho y terceros. | Aloha, Synerise, GA4, pagos, despacho y otros; inventario técnico por completar | ok | igual |
| Tecnología e integraciones | Performance | Tiempos objetivo de respuesta/carga de Home, menú, producto, carrito y checkout, incluyendo escenarios peak. | (vacío) | ok | Marcado «ok» pero sin valor. T-36: UX < 2,5 s; P95 < 1 s; nos piden proponer el SLA |
| Tecnología e integraciones | Escalabilidad | Capacidad de absorber picos de tráfico y transacciones sin degradación relevante de experiencia. | Debe soportar al menos peak observado de 7x + holgura de crecimiento | ok | igual |

**Filas del PDF que el Excel ya no trae:**
- «Órdenes máximas por hora / minuto». El dato llegó en T-28: ~27 K órdenes entre 18:00 y 20:00, casi 9 K por hora.
- «Crecimiento», a 3–5 años. A-9 lo deja «Fuera de alcance».
- «Usuarios únicos App + Web» y «MAU App + Web». Quedan reemplazados por las dos filas de usuarios activos.

## Hoja «Resumen_Ejecutivo»

Título: «Resumen ejecutivo de volumetría».

| Indicador clave | Referencia | Lectura para proveedor | Prioridad |
|---|---|---|---|
| Sesiones App + Web | ~700.000 / semana | Dimensionamiento base de tráfico propio | Alta |
| Peak de tráfico | Hasta 7x | Autoscaling y resiliencia obligatorios | Crítica |
| Órdenes ecosistema | ~622.500 / mes | Alto volumen omnicanal | Crítica |
| Conversión App + Web | ~18% | Base actual a proteger/mejorar | Alta |
| Conversión App | ~22% | Canal de mayor eficiencia | Alta |
| Canales objetivo | 6 | App, Web, Agregadores, Call Center, Tótem y WhatsApp | Crítica |
| Peak horario | 70% de órdenes en franja peak | Concentración operativa relevante | Crítica |
| Cross-selling | ~25% de pedidos | Capacidad clave de personalización/monetización | Alta |
| Disponibilidad | ≥99,95% sugerido | SLA de plataforma a validar con TI | Crítica |

## Objetivos que se desprenden

- **Escala:** autoscaling y resiliencia para picos de 7×, con 70 % de las órdenes concentradas en ~3 horas (18:00–21:00).
  - Referencia de throughput: ~9 K órdenes por hora en el Día de la Pizza, sumando todos los canales.
  - Hoy la Web hace ~100 K órdenes al mes y tiene 570 K usuarios activos.
- **Disponibilidad:** al menos 99,95 % al mes. La performance la debemos proponer nosotros.
- **Conversión:** proteger y mejorar el 14 % de la Web y el 22 % de la App. La App es el canal de referencia.
- **Abandono de carrito:** 33 K carritos al mes en Web y 65 K en App. Es una oportunidad directa de recuperación.
- **Ticket y cross-selling:** ticket de $15.690 y cross-selling en ~25 % de los pedidos. Las recomendaciones son una palanca de monetización «Alta».
- **Pagos:** 85 % de éxito. Subirlo es una palanca de conversión, y el BIN es obligatorio.
- **Tráfico:** 36 % viene de Paid y 16 % de CRM. La atribución y los deep links son críticos.
- **Operación:** 176 tiendas con cobertura nacional, 10 promos AON + 5 tácticas, y 3–4 banners por semana distintos para Web, App y Tótem.
