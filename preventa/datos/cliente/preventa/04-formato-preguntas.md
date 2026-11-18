# Formato de preguntas y respuestas del RFP (transcripción)

- **Origen:** `PapaJohns-Preventa/Kit del Proveedor/Formato Preguntas y Respuestas.xlsx` (modificado el 13-10-2026).
- **Qué es:** la plantilla oficial de Papa Johns para que los proveedores envíen consultas. Esta copia trae un **primer borrador** con 10 preguntas técnicas de Salesforce, sin respuestas. La versión respondida está en `01-respuestas-salesforce.md`.

## Hoja «Consultas Admin»

Título: «Consultas y Preguntas Administrativas». Columnas: n.º · Nombre Proveedor · Sección y N referencia bases · Preguntas · Respuestas. Las filas 1 a 40 están numeradas y vacías.

## Hoja «Consultas Técnicas»

Título: «Consultas y Preguntas Técnicas». Mismas columnas. Hay 40 filas numeradas; solo las 10 primeras tienen contenido. El proveedor es «Salesforce», la columna de sección va vacía y no hay respuestas.

| n.º | Pregunta (literal) | Pregunta equivalente en la versión respondida |
|---|---|---|
| 1 | ¿Cómo se comunican hoy sus aplicaciones Web/App con el sistema de cocina/caja en los locales (Aloha)? | T-10 |
| 2 | ¿Tienen una API centralizada para enviar los pedidos o la conexión se hace punto a punto con cada tienda? | T-11 |
| 3 | ¿Prefieren que el nuevo Commerce consulte a Synerise directamente en cada clic, o buscan una capa intermedia que gestione las comunicaciones entre el Commerce, el CRM y las App/Web? | T-12 |
| 4 | ¿han experimentado caídas o demoras en la sincronización de pedidos hacia las tiendas? ¿Buscan implementar una infraestructura con colas de procesamiento para evitar que se pierdan ventas si un local o pasarela de pago falla temporalmente? | T-13 y T-14 (se separó en dos) |
| 5 | ¿Cuentan actualmente con un estándar único para exponer APIs hacia la Web, App, WhatsApp y Tótems, o cada canal consume servicios desarrollados de manera independiente? | T-15 |
| 6 | ¿Tienen problemas de duplicidad de datos entre compras en la Web/App y compras en locales físicos? | T-16 |
| 7 | ¿En qué sistema se configura originalmente el catálogo de productos y precios por tienda? ¿El equipo comercial debe cargar los combos manualmente en múltiples plataformas o buscan una fuente única de verdad sincronizada automáticamente? | T-17 |
| 8 | Para medir el éxito de campañas como "Arma tu Combo", ¿requieren consolidar en tiempo real los datos transaccionales del Commerce con el comportamiento de navegación en un Data Lake o Data Warehouse centralizado? | T-18 |
| 9 | Cuando un cliente llama a Servicio al Cliente por un pedido atrasado o cancelado, ¿el operador puede ver en una sola pantalla el historial unificado (pagos, estado en Aloha, cupones aplicados y puntos)? | T-19 |
| 10 | Ante la integración de un nuevo canal de venta en el futuro (ej. una nueva App o canal conversacional), ¿cuánto tiempo y esfuerzo técnico les toma conectarlo a su infraestructura actual? | T-20 |

**Conclusión:** este archivo no trae información que no esté en la versión respondida. Se conserva solo como referencia del formato oficial.
