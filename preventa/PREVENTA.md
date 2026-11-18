# Preventa Papa Johns Chile · mapa de documentos (24-oct)

- **Actualizado:** 24-oct-2026
- **Qué es:** el mapa de la preventa (propuesta, alcance, documentos del cliente) tal como quedó el 24-oct. El traspaso técnico está en [README.md](README.md).
- **Nosotros:** Avatar, partner e **implementador** de Salesforce. **Cliente:** Papa Johns Chile. **RFP:** nuevo e-commerce.

## 1. Hitos

| Fecha | Hito | Estado |
|---|---|---|
| 16 y 17-oct | Kit del cliente transcrito; propuesta de diseño v1.2 y lienzo de la demo | Hecho |
| 21-oct | Demo del backoffice actual de Papa Johns (video) | Analizado y auditado |
| 23-oct | Reunión con Salesforce (preguntas P1, P2, P3, P17, P23, P14) | Hecha; **falta registrar las respuestas** |
| 19 a 26-oct | Construcción de la demo (Navegación, Checkout, Mi Cuenta) | En curso ([línea de tiempo](datos/cliente/preventa/02-linea-de-tiempo.md)) |
| **29-oct** | **Entrega de la propuesta integral** y demo | Pendiente |

## 2. Alcance vigente

**Decisión del 24-oct-2026:** la propuesta incluye **B2C Commerce + Order Management + MuleSoft**.

| Producto | Estado en la propuesta | En la demo |
|---|---|---|
| B2C Commerce (Storefront Next, SCAPI, BM, Page Designer, Einstein, SLAS) | Núcleo | Real (sandbox) |
| **Order Management** | **Se propone** (24-oct) | Real (instancia) |
| **MuleSoft** | **Se propone** como capa de integración (24-oct) | Por definir |
| Marketing Cloud | Por confirmar (16-oct: dentro; 21-oct: choca con Synerise) | Real (instancia) |
| Loyalty Management | Por confirmar (Papa Puntos vive en Synerise; el cliente dice que no es prioridad) | Simulado |
| Data Cloud, Service Cloud | Fuera; se muestran como visión por fases | No |

**Lo que se queda en el cliente** (respuestas T-32, T-60, T-61, T-128): Aloha/NCR Cloud Connect y su OMS de tienda (incluidas franquicias), API Papa Johns como puerta de canales y agregadores, Synerise (CRM, CDP y Papa Puntos), Zendesk, DispatchTrack, DWH. **Esto define el reto de OMS y MuleSoft:** Salesforce OMS no reemplaza el OMS de tienda; hay que decir qué hace cada uno.

### Historial de la postura

| Fecha | Postura | Dónde |
|---|---|---|
| 16-oct | Commerce + Marketing Cloud + Loyalty + OMS (fase posterior) | [00-propuesta](disenos/00-propuesta/README.md) |
| 17-oct | OMS con instancia real en la demo | [00-propuesta §2.2](disenos/00-propuesta/README.md), [requerimientos-demo](disenos/requerimientos-demo.md) |
| 21-oct | Las respuestas del cliente chocan con MC, OMS y Loyalty → se recomienda solo Commerce + integración | «Qué se quiere del nuevo e-commerce» (§10) |
| 23-oct | Escenarios A, B (recomendado) y C | [solucion-vista-unificada](propuesta/solucion-vista-unificada.md) |
| **24-oct** | **Commerce + OMS + MuleSoft** | Este índice |
| **24-oct (tarde)** | **C1** (fase 1): Commerce + OMS + MuleSoft; Synerise, Zendesk **y el backoffice actual** se quedan. **C2**: backoffice nuevo en Core, Data Cloud, Service + Agentforce, MC, Loyalty, OCI | [alcance OMS](propuesta/oms/alcance-oms.md), [alcance MuleSoft](propuesta/mulesoft/alcance-mulesoft.md) |
| **24-oct (cierre)** | **Una sola propuesta:** B2C Commerce (con Cimulate) + Order Management (registra y sincroniza órdenes) + Marketing Cloud (campañas y notificaciones por WhatsApp con links) + MuleSoft. Se suma sin reemplazar; el backoffice nuevo es la evolución. A, C1 y C2 pasan al anexo | [vista unificada §3](propuesta/solucion-vista-unificada.md), [diapositivas](propuesta/propuestas-diapositivas.md) |
| **24-oct (reunión con Juan)** | Business Manager toma la oferta digital y el backoffice opera el resto; tres opciones para su futuro, sin lámina agresiva. Marketing Cloud: solo campañas por WhatsApp con link, clientes del e-commerce, opt-in asumido. Solo se proyecta la fase 1. **Entregables:** diagrama general + alcance de OMS, MuleSoft y Marketing Cloud; **estimación el lunes** | [diapositivas](propuesta/propuestas-diapositivas.md) |

## 3. Documentos

Estado: **Vigente** · **Actualizar** (hay que alinearlo al alcance del 24-oct) · **Histórico** (se consulta, no se actualiza).

### 3.1 Fuentes del cliente (fuente de verdad, no se editan)

| Documento | Qué tiene | Estado |
|---|---|---|
| [Kit del cliente](datos/cliente/kit-pj/README.md) | Journey, expectativas, back office, ecosistema, 20 casos, KPIs, mapa de 57 capacidades, flujo Online Ordering | Vigente |
| [Perfiles del kit](datos/cliente/kit-pj-perfiles.md) | Sofía, Diego, Valentina | Vigente |
| [Respuestas a Salesforce](datos/cliente/preventa/01-respuestas-salesforce.md) | 132 técnicas (T-n) y 14 administrativas (A-n) | Vigente |
| [Preventa: índice y objetivos](datos/cliente/preventa/README.md) | Qué hay que entregar y datos que no cuadran | Vigente |
| [Volumetría](datos/cliente/preventa/03-volumetria-xlsx.md) | Órdenes, picos, sesiones | Vigente |
| [Marca BGYS](datos/cliente/preventa/05-brand-strategy-bgys.md), [playbook](datos/cliente/preventa/06-brand-playbook-bgys.md) | Guía de marca | Vigente |
| [Formato de preguntas](datos/cliente/preventa/04-formato-preguntas.md) | Plantilla del cliente (antes de reenviar el xlsx, borrar el comentario de G68) | Vigente |
| [Backoffice actual (video 21-oct)](datos/cliente/backoffice-video.md) y [auditoría](datos/cliente/backoffice-video-auditoria.md) | Módulos, reglas, dolores, 23 preguntas abiertas, capturas | Vigente |
| `PapaJohns-Preventa/` | Originales (PDF, xlsx, html) | Vigente |

### 3.2 Investigación y benchmark

| Documento | Qué tiene | Estado |
|---|---|---|
| [exploracion.md](exploracion.md) | Auditoría de papajohns.cl, Melt y PJ Perú, benchmark | Histórico |
| [critica-ux.md](critica-ux.md) | Recorrido de compra Melt vs. PJ Chile | Histórico |
| [informe-pjus](datos/raw/informe-pjus.md), [informe-dpzus](datos/raw/informe-dpzus.md) | Papa Johns y Domino's EE.UU. | Histórico |
| `datos/raw/`, `capturas/`, `extraccion/` | Páginas, Lighthouse, capturas y scripts de extracción | Histórico |

### 3.3 Diseño de la demo

| Documento | Qué tiene | Estado |
|---|---|---|
| [00 · Qué recomendamos](disenos/00-propuesta/README.md) | Principios, arquitectura, rol de cada producto, decisiones (cerradas con los supuestos) | Vigente v1.3 (24-oct) |
| [Índice de diseños](disenos/README.md) y carpetas 01 a 13 | Especificación por pantalla; lienzo en claude.ai | Vigente |
| [13 · Operación](disenos/13-operacion/README.md) | Consola de OMS en la demo; la cancelación se presenta como fase siguiente | Vigente v1.1 (24-oct) |
| [Requerimientos de la demo](disenos/requerimientos-demo.md) | Reglas R1–R6 (puntos, precio, pago, estados OMS, MC, panel), con lo que es solo demo frente a la propuesta | Vigente v1.1 (24-oct) |
| [Checklist contra el kit](disenos/checklist-kit.md) | Cumplimiento del kit por ID | Vigente |
| [Preguntas y supuestos](disenos/preguntas-y-supuestos.md) | Registro de decisiones de diseño, cerradas con la propuesta y los supuestos | Vigente (24-oct) |
| Revisiones (kit v1–v2, procesos v1, UX v1–v2), [ux-context](disenos/ux-context.md) | Revisiones del lienzo | Histórico |

### 3.4 Propuesta

| Documento | Qué tiene | Estado |
|---|---|---|
| [Vista unificada](propuesta/solucion-vista-unificada.md) v3.0 | AS-IS, propuesta (§3), Business Manager vs. backoffice (§3.1), Marketing Cloud (§4), futuro del backoffice (§5), dueños de los datos (§7), temas transversales (§8), preguntas comerciales a Salesforce (§9), supuestos S1 a S24 (§11) | Vigente (`.docx` regenerado el 24-oct) |
| [Anexo: preguntas investigadas](propuesta/anexo-preguntas-investigadas.md) | Las 29 preguntas evaluadas para Salesforce, con investigación y decisión | Archivo |
| [Propuesta para diapositivas](propuesta/propuestas-diapositivas.md) | Guion de la [presentación](https://claude.ai/artifact/8w1HbZtkmJBQaeVnWjon2s) de 15 láminas: propuesta, arquitectura, opcionales, Commerce, backoffice, OMS, MuleSoft (casos, tres etapas y catálogo de 15 APIs) y Marketing Cloud | Vigente |
| [Anexo: alternativas evaluadas](propuesta/anexo-alternativas-evaluadas.md) | TO-BE A, C1, C2 y su comparación | Archivo |
| [Matriz de trazabilidad](propuesta/matriz-trazabilidad.md) v2 | 57 capacidades, back office (13), casos, X1–X27, N1–N11, servicios; producto por requisito y supuestos S1–S24 | Vigente (24-oct), base de la estimación |
| [Backoffice en Core](propuesta/backoffice/backoffice-en-core.md) | Qué funciones del backoffice del video caben en Core, cuáles se construyen y cuáles quedan en B2C; viaje a Commerce y publicación inmediata; preguntas SF-B1 a SF-B7 | Borrador (activo 4) |
| `Papa Johns Chile - Que se quiere del nuevo e-commerce.docx` | Resumen de lo que pide el cliente (§10 recomendaba solo Commerce) | Histórico en su §10 |

### 3.5 Construcción

| Carpeta | Qué tiene |
|---|---|
| [`demo/PLAN.md`](demo/PLAN.md) | **Plan de implementación de la demo** (20-nov): fases, tareas, estado y bitácora |
| `storefront/` | Storefront Next de la demo (sandbox PapaJohnsCL) |
| `dw.json` | Credenciales del sandbox: **no compartir ni subir** |

## 4. Activos por producir

En orden. Cada uno indica de qué depende.

| # | Activo | Qué responde | Depende de | Ubicación propuesta |
|---|---|---|---|---|
| 1 | **Respuestas de Salesforce del 23-oct** | Qué dijo Salesforce a P1, P2, P3, P17, P23 (y P14) | Tus notas de la reunión | `propuesta/solucion-vista-unificada.md` §9 |
| 2 | **Alcance de OMS** · borrador v1 | Qué hace Salesforce OMS frente al OMS de tienda (Aloha); flujos que entran (captura, estados, cancelación, reembolso, compensación, SAC) y los que no; objetivos medibles; qué es demo y qué es proyecto | Activo 1; T-32, T-54, T-61, T-128; §3-08 de la matriz; 13 Operación | `propuesta/oms/alcance-oms.md` |
| 3 | **Alcance de MuleSoft** · borrador v1 (+ [backoffice y API PJ](propuesta/mulesoft/backoffice-y-api-pj.md)) | Qué integraciones pasan por MuleSoft (Aloha/API PJ, Synerise, DispatchTrack, Zendesk, pasarelas, DWH, agregadores), patrones (API-led, eventos, lotes), objetivos (tiempos, cero pérdida de órdenes), qué no hace | Activo 2 (los flujos de OMS definen las integraciones); §9 datos maestros; N5, N6, N11 | `propuesta/mulesoft/alcance-mulesoft.md` |
| 4 | **Torre de control (backoffice)** | BM + extensiones, consola propia **o Salesforce Core** (borrador: [backoffice-en-core](propuesta/backoffice/backoffice-en-core.md) recomienda Core para la operación y BM para lo comercial); cómo se cubren las filas 05, 08, 09, 11 y 12 | Activos 2 y 3; [video del backoffice](datos/cliente/backoffice-video.md) y su [auditoría](datos/cliente/backoffice-video-auditoria.md) | `propuesta/backoffice/` |
| 5 | ~~Matriz v2~~ | Hecho el 24-oct | — | `propuesta/matriz-trazabilidad.md` |
| 6 | Costeo | Jornadas por rol y fase | Activo 5 | `propuesta/costeo.xlsx` |
| 7 | Propuesta integral del 29-oct | Documento para el cliente | Todos | `propuesta/` |

## 5. Contradicciones abiertas

1. ~~OMS de Salesforce vs. OMS de tienda~~: resuelto (24-oct). OMS registra y sincroniza; Aloha ejecuta en la tienda ([alcance de OMS](propuesta/oms/alcance-oms.md)).
2. ~~Marketing Cloud vs. Synerise; Loyalty~~: resuelto (24-oct). Marketing Cloud solo envía campañas por WhatsApp a los clientes del e-commerce; Synerise sigue con perfil, puntos y notificaciones; Loyalty no entra en la fase 1.
3. **«Publicación inmediata, sin caché»** (video, N11) frente al modelo de replicación de B2C: se propone un tiempo objetivo por tipo de cambio (matriz N11).
4. ~~Matriz y vista unificada vs. 00-propuesta~~: alineadas el 24-oct.
