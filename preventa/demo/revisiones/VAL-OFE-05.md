# VAL-OFE-05 · Promos y constructor

**Veredicto: APROBADA**

- Fecha: 2026-11-06. Código: `storefront-wt/OFE`, rama `hu/OFE`, commit 281cfbc, `pnpm dev --port 5177` (detenido al terminar).
- Navegador: `chrome-devtools-headless` (instancia 1), contexto aislado `VAL-OFE05`, sesión limpia (carrito 0, sin usuario). Móvil 390x844 (Android emulado, táctil) y escritorio 1440x900.
- Sandbox: se agregó 1 Super Dúo al carrito de invitado (escritura pedida por el encargo).

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Móvil: primera oferta destacada (split, foto grande, sello) y el resto en tarjetas | ✅ | En 390 la destacada es una tarjeta verde con foto de ~435 px, sello lima «-50%», chip lila «PIZZA DEL MES», precio display lima y CTA lima. Las otras 5 son tarjetas blancas. En 1440 la destacada es *split* (texto verde a la izquierda, foto a la derecha) y luego grilla de 3. `VAL-OFE-05-promos-390.png`, `VAL-OFE-05-promos-1440.png` (abiertas) |
| 2. *Pop* al llenar ranura y latido del CTA en «2 de 2» | ✅ | Tras elegir la pizza 2, `document.getAnimations()` devuelve `pj-pop` y `pj-beat`; el CTA tiene `animation-name: pj-beat`. `VAL-OFE-05-constructor-2de2-390.png` |
| 3. Tras agregar, el CTA pasa a «Ver mi pedido»; sin doble agregado (F4) | ✅ | El CTA pasó a «Ver mi pedido» (el aviso «¡Agregado! Super Dúo +22 Papa Puntos» también ofrece «Ver mi pedido»). Contador del header: 0 → 1. Segundo toque en el CTA: navega a `/cart`, el carrito queda con 1 línea «SUPER DÚO $22.590», cantidad 1 (input `number` = 1), contador 1. `VAL-OFE-05-constructor-agregado-390.png` |
| 4. «Agregar Super Dúo · $22.590» con espacio antes del punto medio (F10) | ✅ | Texto del botón y de su nombre accesible: «Agregar Super Dúo · $22.590». Antes: «Te falta 1 pizza» (deshabilitado), según 3.6 |
| 5. La oferta vencida usa el tono nuevo | ✅ | `/promos/box-halloween`: bloque lila con título «LLEGASTE TARDE A BOX HALLOWEEN DE MIEDO» en granate, sello «SE FUE EL 2 DE NOVIEMBRE» granate, texto «…se fue el 2 de noviembre. Pero el horno sigue prendido:» y 3 alternativas con precios reales. `VAL-OFE-05-vencida-1440.png` |
| Fotos de todas las ofertas al hacer scroll | ✅ | Las 5 imágenes de tarjetas son `loading="lazy"` y tras recorrer la página las 6 ofertas tienen `complete && naturalWidth>0` (390 y 1440). 0 imágenes rotas |
| Contraste ADA | ✅ | Precio lima sobre verde, precio granate sobre blanco, CTA y chips sin problemas visibles; texto deshabilitado «Te falta 1 pizza» exento. No se midió con herramienta, solo por captura |
| Texto mínimo 12 px | ✅ | 0 nodos de texto con fuente < 12 px en `/promos` (390 y 1440) y en el constructor |
| Táctil 44 px | ✅ | Chips del filtro 44 px de alto (antes 23 px en VAL-OFE: corregido), CTA de tarjetas 46–50 px, CTA del constructor 54–56 px. 0 controles de `main` menores de 44 px |
| Consola sin errores | ⚠️ | Solo ruido de desarrollo (ver hallazgos H2, H3). Sin errores de aplicación |

## Hallazgos

| ID | Severidad | Descripción | Responsable |
|---|---|---|---|
| H1 | Baja | Con carrito sin tienda, «Agregar» abre el panel de modalidad y, al «Confirmar», agrega el combo solo. Es coherente (resuelve el 5a de VAL-OFE), pero conviene que el panel diga que se agregará el combo. | OFE/TIE (opcional) |
| H2 | Ruido (dev) | `WebSocket ... ws://localhost:24678 ... 400` y `[vite] failed to connect to websocket`: HMR de Vite; el puerto 24678 lo comparten varios dev servers en paralelo. No existe en build. | ninguno |
| H3 | Baja (template) | Aviso de hidratación: `nonce={undefined}` vs `nonce=""` en `<link data-react-router-critical-css>`. Viene del template base, no de OFE. | INT (ya existía) |
| H4 | Baja | En el carrito, un pedido de retiro («Retiro · 15 min, El Bosque») muestra el grupo «DESPACHO A DOMICILIO – 1 DE 1 PRODUCTO / Delivery». Fuera del alcance de OFE-05; sin comparar con la rama base. | INT |
| H5 | Baja | En 1440, el sello «Para 2–3» de «Papa Combo con Postre» se monta sobre la botella de Coca-Cola de la foto. | OFE (cosmético) |
| H6 | Baja | El encabezado móvil trunca «Elige cómo lo …» (aún sin tienda). | TIE |

Notas: el carrito quedó con 1 Super Dúo en el sandbox (carrito de invitado, se pierde con la sesión).
