# 07 · Checkout

- **Lienzo:** https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk, página «07 Checkout»
- **Estado:** borrador v2, 16-oct-2026
- **Principios que aplica** ([propuesta](../00-propuesta/README.md)): 3 (precio visible), 5 (puntos), 7 (rápido y accesible)

## Punto de partida: el checkout de Storefront Next

Storefront Next ya trae un checkout de una página con contacto, dirección, opciones de envío, pago, pagos exprés, compra como invitado y registro opcional al final. **No se diseña desde cero: se adapta a un restaurante.**

| Lo que trae | Qué cambiamos |
|---|---|
| Dirección de envío y métodos de envío | Se reemplaza por el resumen de modalidad (Retiro o Delivery), tienda y cuándo, ya elegidos en [05](../05-tienda-y-modalidad/README.md) |
| Contacto | Nombre, celular (+56) y correo, con `autocomplete` y teclado adecuado |
| Pago con tarjeta y pagos exprés | **Solo Mercado Pago y efectivo** (decisión del 16-oct-2026) |
| — | **Comprobante: boleta (por defecto) o factura con RUT** |
| Registro al final | «Guarda tus Papa Puntos»: crear cuenta con un toque, mostrando los puntos que gana |
| — | Cupón detrás de un enlace, resumen del pedido colapsado, nota para la tienda |

## Crítica de la v1 (por qué cambia la distribución)

| Problema en v1 | Efecto | Cambio en v2 |
|---|---|---|
| Siete bloques con el mismo peso visual, uno debajo del otro | No hay jerarquía: el cliente no sabe qué es obligatorio | Tres pasos numerados (Tus datos, Pago, Comprobante) y lo opcional al final, colapsado |
| Cuatro medios de pago iguales en una lista | Más opciones de las necesarias y difíciles de comparar | Dos opciones grandes, una al lado de la otra |
| Al elegir un medio solo cambiaba el borde | No se sabe qué pasa después (¿me redirige?, ¿pago en cuotas?, ¿necesito vuelto?) | La opción elegida se abre y explica qué sigue |
| El botón cambiaba de texto lejos de la opción elegida | La relación entre elegir y pagar no se ve | El panel abierto repite la acción y el botón fijo usa el mismo verbo |
| Cupón como bloque completo | Invita a salir a buscar cupones (abandono) | Enlace «¿Tienes un cupón?» |
| Resumen del pedido abierto | Alarga la página | Colapsado con el total visible; se abre si el cliente quiere revisar |
| Sin comprobante | En Chile la empresa puede pedir factura | Boleta por defecto; factura opcional con RUT |

## Distribución v2 (móvil, de arriba abajo)

1. Encabezado reducido: «Volver al pedido» y logo.
2. Entrega: modalidad, tienda y hora, con «Cambiar».
3. **1 · Tus datos:** nombre, celular, correo. Enlace «Ingresar» para quien tiene cuenta.
4. **2 · Pago:** Mercado Pago | Efectivo, en dos tarjetas lado a lado; la elegida se abre debajo.
5. **3 · Comprobante:** Boleta | Factura; con factura se abren los datos de la empresa.
6. Opcionales: «Guarda tus Papa Puntos», «¿Tienes un cupón?», «Agregar nota para la tienda».
7. Resumen del pedido colapsado.
8. Botón fijo abajo: verbo según el pago + total; términos en una línea encima.

## Pago

| | Mercado Pago | Efectivo |
|---|---|---|
| Cuándo se ofrece | Siempre (activo en las 32 tiendas) | Solo si la tienda lo acepta (27 de 32); si no, se muestra deshabilitado con el motivo |
| Nombre según modalidad | Mercado Pago | «Efectivo al retirar» (retiro) · «Efectivo al recibir» (delivery) |
| Al elegirlo se abre | **Formulario de tarjeta de Mercado Pago Bricks dentro de la página**: número de tarjeta (con marcas aceptadas), vencimiento MM/AA, código de seguridad, nombre del titular, RUT del titular y cuotas. Debajo, «Prefiero pagar con mi cuenta de Mercado Pago» (saldo) | Retiro: «Pagas en la caja al retirar.» Delivery: «¿Con cuánto pagas?» (monto exacto, $20.000, $30.000, otro) y el vuelto calculado |
| Botón | «Pagar · $X» | «Confirmar pedido · $X» |
| Si falla | Vuelve al checkout con los datos intactos y el mensaje del rechazo | — |

**Decisión (16-oct-2026):** Mercado Pago con **Checkout Bricks** (Card Payment Brick embebido en la página, con el tema de la marca), sin redirección. El pago con la cuenta de Mercado Pago (Wallet Brick) queda como opción secundaria. Los campos exactos (por ejemplo, el documento del titular) los define Bricks según el país; el diseño los muestra como se esperan en Chile.

## Comprobante (boleta o factura)

| | Boleta (por defecto) | Factura |
|---|---|---|
| Qué pide | Nada más: la boleta electrónica llega al correo | RUT de la empresa, razón social, giro y dirección comercial (comuna) |
| Validación | — | RUT con dígito verificador al salir del campo; formato automático (76.123.456-7) |
| Con sesión | — | Recuerda los datos de la empresa |

Papa John's Chile hoy no pide RUT ni ofrece factura en el checkout web (invitado, retiro, observado el 13-oct-2026), y su API no tiene campos de facturación. **Por confirmar con el cliente** si ofrece factura en línea (pregunta B8).

## Pantallas

| # | Pantalla (archivo) | Qué muestra |
|---|---|---|
| 1 | Checkout móvil · retiro (`Checkout.dc.html`) | Distribución v2 con Mercado Pago (Bricks) abierto; parámetros `modalidad` y `pago` |
| 1b | Checkout móvil · delivery (`Checkout-Delivery.dc.html`) | El mismo checkout en delivery con efectivo al recibir y cálculo de vuelto |
| 2 | Checkout escritorio (`Checkout-Desktop.dc.html`) | Pasos a la izquierda, resumen fijo a la derecha con el botón de pago |

## Reglas

1. **Una página**, sin pasos ocultos: el medio de pago se ve desde el inicio.
2. **Validación al salir del campo**, nunca errores al cargar.
3. **Autocompletado:** `name`, `tel`, `email`, `organization` (razón social); teclado numérico para el celular.
4. **Encabezado reducido:** solo logo y «Volver al pedido».
5. **Total siempre visible** en el botón fijo.
6. **Sofía** (con sesión): datos, medio de pago y datos de factura guardados; canje de puntos. **Valentina** (invitada): solo lo indispensable.

## Modelo en Commerce Cloud

| Concepto | Cómo se resuelve | Tipo |
|---|---|---|
| Checkout de una página | `src/components/checkout` de Storefront Next | Estándar |
| Modalidad y tienda | Envío con tienda (extensión `bopis`) | Estándar + desarrollo |
| Mercado Pago | Checkout Bricks (Card Payment Brick + Wallet Brick) integrado en el checkout de Storefront Next; el pago se confirma en el servidor | Integración |
| Efectivo al retirar o al recibir | Medio de pago personalizado, habilitado por tienda (`cash` de la tienda) | Desarrollo + configuración |
| Boleta o factura | Atributos del pedido (`c_documentType`, `c_rut`, `c_businessName`, `c_businessActivity`, `c_businessAddress`) enviados al sistema de facturación del cliente | Desarrollo + integración |
| Puntos a ganar y canje | Loyalty Management (simulado) | Integración |
| Confirmación y avisos | Marketing Cloud (correo y SMS transaccionales) | Integración |

## Historial

| Fecha | Cambio |
|---|---|
| 16-oct-2026 | v1: checkout móvil y escritorio adaptado del de Storefront Next |
| 16-oct-2026 | v2: solo Mercado Pago y efectivo; pago que se abre al elegirlo; boleta o factura con RUT; pasos numerados; cupón y resumen colapsados |
| 16-oct-2026 | v2.1: Mercado Pago con formulario de tarjeta embebido (Bricks); pantalla de delivery con efectivo y vuelto |
| 16-oct-2026 | v2.2 (revisión por procesos): variante de cliente reconocido (`Checkout-Sofia`: datos en una línea, tarjeta guardada de Mercado Pago con CVV, canje de puntos); pedido canónico $23.890; cupón solo aquí; hora de delivery 21:05–21:15 |
| 16-oct-2026 | v3 (demo con clientes registrados): prop `cliente` (valentina por defecto, sofia, invitado); Valentina con datos cargados, tarjeta nueva con «Guardar en Mercado Pago» y puntos dobles; `Checkout-Rechazo` con aviso y alternativas; prop `mitades`; escritorio registrado (`Checkout-Desktop`, `Checkout-Desktop-Sofia`) con canje; el invitado queda como `Checkout-Invitado` (alternativo, fuera de la demo); cada checkout lleva a su confirmación |
| 17-oct-2026 | Kit: descuento por BIN detectado en la tarjeta guardada de Sofía (20%, tope $5.000, R2.4); Gift Card PJ-GIFT-2026 de $10.000 (R2.5); botón «Pagando… no cierres esta página» que evita el doble pago y luego «Pago aprobado» (R2.8, caso 11); puntos sin contar el despacho (R1.1) |
| 17-oct-2026 | Revisión UX v2 (9): al aprobarse el pago aparece en la misma pantalla «¡Pago aprobado!» con número de pedido, cuándo está listo y puntos; un solo botón «Seguir mi pedido». Se quita el paso intermedio «Pago aprobado · ver mi pedido» |
