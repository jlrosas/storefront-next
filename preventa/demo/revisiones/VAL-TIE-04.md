# VAL-TIE-04 · Validación de TIE-04 (Locales y panel)

Rama `hu/TIE` (commit eab7a70), `pnpm dev --port 5178` levantado y detenido por VAL. Navegador `chrome-devtools-headless-3`, contexto aislado `VAL-TIE-04`, sin cookies ni almacenamiento previos. Mobile 390x844 (táctil, UA Android) y desktop 1440x900. Fecha: 06-nov-2026, ~22:00 hora de Chile. Sin escrituras al sandbox (no se tocó el carrito).

**Veredicto: APROBADA** (cumple los 3 criterios de OPV; quedan 3 hallazgos menores y 1 de datos).

## Resultado por criterio

| # | Criterio | Resultado | Evidencia |
|---|---|---|---|
| 1a | Locales hereda el estilo del panel: tarjetas, «Abierta · cierra 23:30» / «Cerrada · abre mañana 12:00», tiempo | ✅ | 24 tiendas. El Bosque «Tobalaba 201, Las Condes · 0,8 km / Abierta · cierra 23:30 / Listo en 15 min»; Providencia «Cerrada · abre mañana 12:00 / Solo programado»; Salvador «Abierta · cierra 23:00 / Listo en 35 min». `VAL-TIE-04-locales-390.png`, `-1440.png` (grilla de 2 columnas) |
| 1b | Botón «Pedir en X» abre el panel con esa tienda | ✅ | «Pedir en El Bosque» abre el panel en Retiro con El Bosque marcado y «Confirmar El Bosque · 15 min». `VAL-TIE-04-panel-pedir-elbosque-390.png`. Con Providencia (cerrada) el botón dice «Programar en Providencia» y abre el panel con Providencia marcada (ver H1) |
| 1c | *Skeleton* mientras carga | ✅ | Con `/resource/stores` retrasada 30 s: 3 tarjetas fantasma bajo los botones (`data-testid=pj-locales-skeleton`, presente a los 37 ms). `VAL-TIE-04-locales-skeleton-390.png` (visible pero de muy bajo contraste, ver H2) |
| 1d | Nunca «no hay tiendas» antes de la respuesta (F5) | ✅ | Con respuesta retrasada 5 s y 3 s: en ningún momento apareció texto de vacío antes de la respuesta. Con respuesta vacía simulada (`stores.data=[]`) el mensaje «Todavía no llegamos ahí. Prueba otra comuna o retira en la tienda más cercana.» salió 15 ms después de la respuesta (3227 → 3242 ms), con el texto de la sección 3.6 de UX-1 |
| 2a | `?modo=delivery` abre el panel en Delivery (F12) | ✅ | 390 y 1440 px: dialog «¿CÓMO LO QUIERES?» con «Delivery» pressed y campo «Dirección de entrega». Probado también con cookie previa de retiro/Salvador: abre en Delivery igual. `VAL-TIE-04-modo-delivery-390.png`, `-1440.png` |
| 2b | Dirección sin coma final | ✅ | Ninguna de las 24 tarjetas termina en coma («Tobalaba 201, Las Condes · 0,8 km», «Av. Providencia 1349, Providencia · 1,4 km»…). Panel: «Tobalaba 201 · 0,8 km» |
| 2c | Elegir dirección en delivery | ✅ | Ver sección siguiente. Con tecleo real aparece la lista; la sugerencia se selecciona y asigna tienda |
| 3a | Un solo patrón de «seleccionado» (F9) | ✅ | Segmentado (Retiro/Delivery), «Lo antes posible»/«Programar» y la tienda elegida son los tres Basil `rgb(45,93,42)` con texto Dough `rgb(245,232,220)` (medido por estilo computado). Antes eran blanco con borde, lima y borde verde. `VAL-TIE-04-panel-pedir-elbosque-390.png` |
| 3b | «Confirmar» con resumen | ✅ | Retiro «Confirmar · El Bosque · 15 min»; delivery «Confirmar · Salvador · 35–45 min»; programado «Confirmar · Salvador · hoy 22:30». Texto a la izquierda y resumen a la derecha, ya no queda vacío |
| 3c | Confirmar una tienda y el encabezado la refleja | ✅ | Salvador desde Locales → cookie `{"mode":"pickup","storeId":"pj-9","when":"asap"}`; chip «Retiro · 35 min / Salvador». Delivery → `{"mode":"delivery","storeId":"pj-9",…,"address":"Av. Providencia 1234"}`; chip «Delivery · 35–45 min / Av. Providencia 1234» |
| 4 | Lo bueno del panel según UX-1 sigue intacto | ✅ | Siguen: estado abierta/cerrada con color, tiempo, «Solo programado», «Lo antes posible / Programar», aviso de Providencia cerrada con sugerencias («El Bosque · listo en 15 min», «Programar · mañana desde 12:00»), «Usar mi ubicación», buscador por comuna, «Ver más tiendas». `VAL-TIE-04-programar-providencia-390.png` |
| 5a | Contraste ADA | ✅ | Locales (119 textos en `main`) y panel (24 textos): ninguno bajo 4,5:1 (grandes 3:1) |
| 5b | Texto ≥ 12 px | ✅ | Sin textos menores a 12 px en Locales ni panel |
| 5c | Áreas táctiles ≥ 44 px | ✅ | Locales: botón mínimo 44 px de alto. Panel (390): ningún botón, radio o campo bajo 44 px. Chip de encabezado 44 px |
| 5d | Consola sin errores propios | ✅ | Solo ruido conocido: WebSocket HMR `ws://localhost:24678` (400) y *hydration mismatch* por `nonce` del `critical.css`, más el 403 de Google Places (ver siguiente). Sin errores del código de `pj-store` |
| — | No vuelve el chip cortado a 390 px (VAL-TIE R1) | ✅ | Chip delivery 109x44 px, `scrollWidth <= clientWidth`; primera línea «Delivery · 35–45 min» completa, la dirección va con elipsis (diseñado). Retiro: «Retiro · 35 min / Salvador» completo. Ver H3 sobre el estado sin selección |

## Elegir dirección en delivery (punto 2 del encargo)
- **Causa de que el constructor no viera sugerencias: no es de la página, es la herramienta.** Con `fill` o setter nativo más evento `input` no se despliega la lista; con clic en el combobox y `type_text` («Av. Providencia») aparece «Elige una de estas direcciones de ejemplo.» con la sugerencia «Av. Providencia 1234 / Providencia, Región Metropolitana».
- La llave de Google Places sigue dando 403 (`POST places.googleapis.com/$rpc/.../AutocompletePlaces [403]`); el respaldo local entra solo y filtra por texto. No es problema del navegador sin ventana.
- Al elegir la sugerencia: «Te lo lleva Papa Johns Salvador / Llega en 35–45 min · Despacho $1.990 / Pedido mínimo $12.000» y Confirmar se habilita.

## Hallazgos

| ID | Sev. | Resp. | Qué |
|---|---|---|---|
| H1 | Menor | TIE | «Programar en Providencia» (Locales) abre el panel con Providencia marcada pero con «Lo antes posible» activo, Confirmar deshabilitado y aviso «Providencia está cerrada ahora». La tarjeta promete programar; debería llegar con «Programar» preseleccionado (y día «Mañana»). `VAL-TIE-04-programar-providencia-390.png` |
| H2 | Menor | TIE | El *skeleton* de Locales (`bg-pj-dough-deep` sobre el fondo crema) casi no se distingue en la captura; se ve como una zona vacía con bordes tenues. Cumple F5 funcionalmente, pero «entra por los ojos» pide más presencia (más contraste o el brillo de UX-1 §3.5). `VAL-TIE-04-locales-skeleton-390.png` |
| H3 | Menor | TIE | En el estado sin elección, el encabezado a 390 px muestra «Elige cómo lo …» truncado con elipsis (se ve en `VAL-TIE-04-locales-skeleton-390.png`). El `aria-label` es completo. Es otro texto, no el chip rechazado antes; sugiero acortar a «Elige cómo lo quieres» en dos líneas o «Elige tu tienda» |
| H4 | Menor | TIE | En el aviso de Providencia cerrada, el botón «El Bosque · listo en 15 min» va relleno en Basil aunque la tienda no está seleccionada: parece un segundo estado «seleccionado» y reabre algo de la ambigüedad de F9. Mejor contorno (como «Programar») |
| H5 | Menor | DAT | Nombres de tienda en minúscula o sin tilde provenientes del sandbox: «Pedir en irarrazaval» (título IRARRAZAVAL), «Pedir en San miguel», «Peñalolen», «Maipu». El sitio los pinta tal cual |
| H6 | Info | INT | El banner de cookies (role dialog) tapa la parte baja de Locales hasta decidir; es del template (ya visto en VAL-TIE H4) |

## Ruido de automatización
- Con `fill` / setter nativo la lista de sugerencias de dirección no aparece; con `type_text` sí.
- Un `take_screenshot` inmediatamente después de pulsar «Pedir en El Bosque» salió antes de que el panel terminara de abrir (animación); se repitió y se leyó el segundo. No es defecto del sitio.
- La primera captura del *skeleton* salió con 5 s de retraso ya cargada; se repitió con 30 s.

## No cubierto
- Safari iOS. Cliente registrado (sin sesión). Autocompletado real de Google (403).
- Desktop: solo Locales, `?modo=delivery` y estilos/contraste del panel; no se repitieron los casos de Providencia ni de confirmar tienda.
- No se probó «Usar mi ubicación» (permiso de geolocalización) ni «Pedir por delivery» (botón de Locales) más allá de comprobar que existe a 44 px.
- La hora real (~22:00) no permite ver «abre 12:00» (antes de la apertura), solo «abre mañana 12:00».

## Cambios en el ambiente
- Dev server del 5178 levantado para la prueba (pid 54113) y detenido al cerrar; verificado que no queda proceso escuchando.
- Página de VAL cerrada; queda la página 1 en `about:blank`. Cookies solo en el contexto aislado, sin escrituras al sandbox.
