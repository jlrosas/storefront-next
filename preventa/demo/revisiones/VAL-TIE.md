# VAL-TIE · Validación de TIE-01, TIE-02 y TIE-03

Rama `hu/TIE` (commit a935167). Navegador `chrome-devtools-3`. Mobile 390x844 (táctil, UA Android) y desktop 1440x900. Fecha: 06-nov-2026, ~18:30 hora de Chile.

## Entorno y desvíos
- El puerto 5178 ya tenía un servidor de la carpeta `storefront-wt/TIE` (pid 99139, iniciado antes de esta prueba). `pnpm dev -p 5178` falló con EADDRINUSE. Se probó contra ese servidor, que sirve el mismo código. No lo detuve porque no lo levanté yo.
- La página heredó una cookie `pj_fulfillment` (retiro, El Bosque). Antes de probar borré cookies y almacenamiento local, y el chip volvió a «Retiro o delivery / Elige cómo lo quieres».
- Sin escrituras al sandbox: no agregué productos al carrito.
- Google Places responde 403 (`AutocompletePlaces`), como se esperaba.
- Las direcciones se escribieron con setter nativo más evento `input`, no con tecleo real.

## TIE-01 · Panel de retiro

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | Dice para qué se pide | ✅ | «¿CÓMO LO QUIERES?» / «Para agregar tu Pollo BBQ Familiar. Lo recordamos para la próxima.» Coincide con el lienzo, que manda sobre el criterio. `VAL-TIE-01-panel-retiro-390.png` |
| 2 | Retiro \| Delivery como opciones grandes | ✅ | Segmentado de 173x52 px cada opción. Falta «Comer aquí» (S-D10 pendiente, no cuenta). |
| 3 | Retiro: ubicación, buscador, tiendas con distancia, estado y «Listo en N min» | ✅ | «Usar mi ubicación» (48 px), buscador «Ej.: Providencia». El Bosque «Tobalaba 201 · 0,8 km / Abierta · cierra 23:30 / Listo en 15 min». Providencia «Cerrada · abre 12:00 / Solo programado». Salvador «Abierta · cierra 23:00 / Listo en 35 min». |
| 4 | Providencia cerrada: no para «Lo antes posible», sí para programar, sugiere El Bosque | ✅ | Con Providencia y «Lo antes posible», Confirmar queda deshabilitado. Aparece «Providencia está cerrada ahora (abre a las 12:00). Tu pedido no se pierde: elige otra opción.» con botones «El Bosque · listo en 15 min» y «Programar · desde 12:00». Con «Programar» y «Mañana», Confirmar se habilita y las horas parten en 12:00. La sugerencia de El Bosque selecciona la tienda, quita el aviso y habilita Confirmar. Ver diferencias D1, D2 y H3. `VAL-TIE-01-providencia-cerrada-390.png`, `-1440.png` |
| 5 | Cuándo: «Lo antes posible» por defecto; «Programar» abre día y hora | ✅ | «Lo antes posible» activo por defecto. «Programar» muestra los selectores Día (Hoy/Mañana) y Hora (cada 15 min, desde 19:00 hoy). Ver D3. |
| 6 | Al confirmar guarda `pj_fulfillment` (y preferencia), vuelve al producto y lo agrega | ⚠️ parcial | Cookie guardada: `{"mode":"pickup","storeId":"pj-48","when":"asap"}`. Se envía POST `/resource/pj-fulfillment` y `/action/set-selected-store`. El panel se cierra. «Vuelve al producto y lo agrega» no se puede ver: el evento `pj:open-fulfillment` no trae continuación. Solo `requireFulfillment({onConfirmed})` la ejecuta, y ningún componente de esta rama la invoca (grep). Pasa a la integración de CAT/CAR. Con el evento solo, el botón dice «Confirmar» y no «Confirmar y agregar $16.900» como el lienzo. |
| 7 | Usa `store-locator` y `bopis` | ⚠️ parcial | Usa `/resource/stores` del template (200) y `setSelectedStoreInfo`; el código importa `extensions/store-locator`. No verifiqué `bopis` en el navegador. |

## TIE-02 · Panel de delivery

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | Dirección con autocompletado y depto opcional | ✅ con respaldo | Campo «Calle y número» y «Depto, casa u oficina (opcional)». El autocompletado de Google no se ve por el 403 y entra el respaldo. Falta la línea «Con tecnología de Google», esperable sin Google. `VAL-TIE-02-delivery-390.png` |
| 2 | Asigna tienda; Av. Providencia 1234 → Salvador | ✅ | «Te lo lleva Papa Johns Salvador». Cookie `{"mode":"delivery","storeId":"pj-9","when":"asap","address":"Av. Providencia 1234"}`. |
| 3 | Tiempo, despacho $1.990, mínimo $12.000 | ✅ | «Llega en 35–45 min · Despacho $1.990 / Pedido mínimo $12.000». |
| 4 | Sin llave de Google, buscador simple con 3 direcciones | ✅ | POST a `places.googleapis.com` responde 403. Se muestra «Elige una de estas direcciones de ejemplo.» con Av. Providencia 1234, Av. Apoquindo 3000 y Av. Irarrázaval 2400. Con «Av.», vacío o «zzz» siguen las 3. Sin errores en pantalla. |

## TIE-03 · Modalidad visible y editable

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1 | Chip en el encabezado; al tocarlo abre el panel | ❌ en 390 px | Abre el panel (en 1440 es un panel lateral). En 390 px el texto queda cortado: «Retiro · listo en 1…», «Delivery · 35–45 …», «Av. Providen…». El chip mide 97 px de ancho y 44 de alto. El texto completo solo está en el `aria-label`. En 1440 se lee completo: «Delivery · 35–45 min / Av. Providencia 1234». Ver H1. `VAL-TIE-03-chip-retiro-390.png`, `VAL-TIE-03-locales-390.png` |
| 2 | Cambiar modalidad no vacía el carrito | ⚠️ solo código | No probé con carrito real (sin escrituras al sandbox). `pj-store` no tiene referencias a basket ni cart (grep). |
| 3 | La modalidad se recuerda | ✅ con salvedad | Tras recargar, el chip y la cookie se mantienen en retiro y en delivery. Al reabrir el panel en delivery, la dirección guardada no se precarga (H2). |
| 4 | «Locales» (encabezado y footer) abre `store-locator` | ✅ | Header y footer enlazan a `/cl/es-CL/store-locator`. Desde el footer abre «NUESTROS LOCALES» con tiendas reales (El Bosque, Providencia, Salvador, Líder Suecia, etc.). En 390 px el encabezado no muestra «Locales»; está en 1440. `VAL-TIE-03-locales-390.png` |

## Otros chequeos
- **Cookie `pj_fulfillment` tras confirmar:** ✅ en retiro (pj-48) y delivery (pj-9, con dirección). Se guarda también `pj_fulfillment_meta` en localStorage.
- **Táctil:** ✅ en el panel no hay controles menores de 44x44 px (mínimos: «Ver más tiendas» 44, selectores 46). El chip mide 44 px de alto.
- **Contraste:** ✅ 23 textos del panel de retiro con contraste de 4,5 o más. El chip usa blanco con opacidad 0,85 sobre verde oscuro. El panel de delivery y las horas no se midieron.
- **Consola (error/warn):**
  - 403 de Google Places: esperado.
  - Hydration mismatch por `nonce` del `critical.css` en la raíz, ajeno a TIE.
  - WebSocket HMR `ws://localhost:24678` falla (400), ruido de entorno por el servidor ajeno.
  - No hay errores del código de `pj-store`.

## Diferencias visibles respecto del lienzo
- D1. Aviso de Providencia: lienzo «(abre mañana a las 12:00)»; implementado «(abre a las 12:00)».
- D2. Sugerencia de Programar: lienzo «mañana desde 12:00»; implementado «desde 12:00».
- D3. Día y hora son `<select>` nativos. El lienzo muestra chips de Hoy/Mañana y de horas.
- D4. Botón principal: lienzo «Confirmar y agregar $16.900»; implementado «Confirmar» cuando se abre por evento (ver TIE-01.6).
- D5. Falta «Comer aquí» (S-D10 pendiente) y «Con tecnología de Google» (esperable sin llave).
- D6. En el chip, las dos líneas van en distinto orden que el criterio. Criterio: «Retiro · El Bosque · 15 min» y «Delivery · Av. Providencia 1234 · 35–45 min». Implementado: «Retiro · listo en 15 min / El Bosque» y «Delivery · 35–45 min / Av. Providencia 1234».
- D7. La página Locales (template) muestra «A 0.80 km» con punto decimal; el panel muestra «0,8 km».

## Hallazgos
- H1 (relevante). El chip se corta en 390 px y el texto de la modalidad no se lee. Se ve «Retiro · listo en 1…» y «Delivery · 35–45 … / Av. Providen…».
- H2 (menor). Con modalidad delivery guardada, al reabrir el panel la dirección aparece vacía, Confirmar queda deshabilitado y se pierde la dirección elegida.
- H3 (menor). Para Providencia cerrada, «Hoy» ofrece horas desde 19:00 hasta 23:15 aunque la tarjeta dice «abre 12:00». El lienzo solo sugiere «mañana desde 12:00». Esto es una duda de regla de negocio.
- H4 (ruido de entorno). El banner de cookies reaparece tras «Rechazar» y tapa la parte baja; es del template.
- H5 (fuera de TIE). El hero de la home sigue mostrando «Boom de Jamón» (vencida según S-D1).

## No cubierto
- El flujo completo «vuelve al producto y lo agrega» (TIE-01.6) y el carrito intacto (TIE-03.2): faltan integración y escritura en el sandbox.
- Desktop: solo se probó el flujo feliz. Retiro en 1440 con la captura de Providencia no se abrió (`VAL-TIE-01-providencia-cerrada-1440.png` se guardó sin abrir). Delivery en 1440 muestra el panel lateral con la dirección vacía (H2).
- Autocompletado real de Google (llave con 403).
- Preferencia guardada en el perfil con sesión (no se probó con cliente registrado).
- Safari iOS.


## Revalidación (R2) · rama `hu/TIE` @ e38ffbf · mobile 390, contexto aislado limpio (sin cookies ni almacenamiento), hora local 17:24

| Verificación | Resultado | Evidencia |
|---|---|---|
| TIE-03.1 chip en retiro a 390 px se lee completo | ✅ | «Retiro · 15 min / El Bosque», sin truncar, 44 px de alto. `VAL-TIE-R2-03-chip-retiro-390.png` |
| TIE-03.1 chip en delivery a 390 px | ✅ | «Delivery · 35–45 min / Av. Providencia 1234», 44 px de alto, 109 px de ancho. La primera línea completa; la dirección va con elipsis (`text-overflow: ellipsis`, como se pidió). `VAL-TIE-R2-03-chip-delivery-390.png` |
| TIE-01.6 evento `pj:open-fulfillment` muestra «Confirmar y agregar $16.900» | ✅ | Panel «Para agregar tu Pollo BBQ Familiar…» y botón «Confirmar y agregar $16.900». Confirmando con El Bosque guarda `{"mode":"pickup","storeId":"pj-48","when":"asap"}`. `VAL-TIE-R2-01-evento-390.png` |
| Reabrir con delivery guardado: dirección cargada y Confirmar habilitado | ✅ | Tras recargar, el campo trae «Av. Providencia 1234» y «Confirmar» no está deshabilitado. `VAL-TIE-R2-02-reabrir-delivery-390.png` |
| Providencia cerrada: «abre mañana 12:00» y sin horas de hoy | ✅ | A las 17:24 dice «Cerrada · abre mañana 12:00 · Solo programado». Al elegir Programar, el día solo ofrece «Mañana» y las horas van de 12:00 a 23:15. La variante «abre 12:00» (antes de la apertura) no se probó: depende de la hora. |
| Locales muestra «0,8 km» con coma | ✅ | «A 0,8 km», «A 1,4 km», «A 3,1 km»… `VAL-TIE-R2-04-locales-390.png` |

Consola: solo ruido conocido (WebSocket HMR 24678, hidratación por `nonce` y el 403 de Google Places). Sin errores propios de TIE.

**Veredicto TIE-01 y TIE-03: APROBADAS.**
