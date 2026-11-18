# VAL-OFE · Validación OFE-01 a OFE-04

- Fecha: 2026-11-06. Código: `storefront-wt/OFE`, rama `hu/OFE`, commit bd1085a, `pnpm dev` en el puerto 5177 (ya detenido).
- Navegador: `chrome-devtools-2`. Mobile 390x844 (Android emulado) y escritorio 1440x900.
- Sandbox: Super Dúo agregado una vez (escritura pedida por el encargo).
- Aviso de estado heredado: el navegador traía un carrito de invitado con 3 productos y una cookie `pj_fulfillment` de una prueba anterior. Borré las cookies, pero el carrito vive en el servidor y volvió a aparecer: el carrito terminó con 4 Super Dúo (3 heredados + 1 mío). No cambia los resultados de OFE.
- Lienzo: `Ofertas.dc.html` es una plantilla con `{{d.name}}` sin datos, así que sirve para jerarquía y orden, no para textos ni precios. `Combo-NoDisponible` solo tiene un rótulo; el texto de esa pantalla sale de `Combo.dc.html`. Para precios y textos mandan los criterios de OFE.md, la tabla §1.1 y S-D1/D3/D15/D16/D17.

## OFE-01 · Ofertas por ocasión

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Filtro Todas / Para 1 / Para 2 / Para 4 / Para 6+ | ✅ funcional | Para 1: Papa Flash. Para 2: Papa Combo con Postre y Palitos. Para 4: Pizza del Mes y Super Dúo. Para 6+: Super Trío. La URL cambia a `?para=6`. |
| 2. Destacada = Pizza del Mes The Works (S-D1); Papa Flash, Palitos y Postre abren su ficha (S-D3) | ✅ | Primera tarjeta: The Works $10.990, antes $21.900, ahorras $10.910, «Para 3–4» (S-D16). Las tres sin constructor dicen «Ver oferta»; Super Dúo y Trío dicen «Armar». `/p/cb-*` responde 200. `VAL-OFE-01-promos-390.png` |
| 2. Tarjeta: foto sin texto, nombre, ahora en rojo, antes tachado, ahorro, modalidad y vigencia (solo ≤7 días) | ✅ | Todo presente. Ninguna oferta tiene vigencia ≤7 días, así que no hay fecha. Hay 0 imágenes rotas. Papa Combo con Postre no tiene «antes» ni ahorro (la tabla no los define). |
| 3. Escritorio: grilla con la destacada arriba | ✅ | Destacada a ancho completo y luego 3 columnas, con título «¿Para cuántos?». `VAL-OFE-01-promos-1440.png` |
| 4. Caso 2: la tarjeta avisa antes de abrir y da la alternativa | ✅ | Con `?solo-retiro=1` y cookie en delivery: «Solo retiro. Con delivery no está disponible. Retírala en El Bosque · listo en 15 min, o mira las ofertas con delivery.» `VAL-OFE-03-ofertas-caso2-390.png` (guardada, no la abrí) |
| Táctil ≥44 px | ❌ | Las 5 fichas del filtro miden 23 px de alto en mobile y en escritorio (`offers-page` / `occasion-filter.tsx`). Los CTA de las tarjetas sí cumplen. |
| Contraste | ✅ | Precio 16,97:1, modalidad 6,54:1, CTA 9,7:1. |

## OFE-02 · Constructor de combos

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. `/promos/super-duo` y `/promos/super-trio` sin tienda; retiro o delivery; conserva `utm_*`; source code `PJSD26` | ✅ | Ambas dan 200 sin cookie de tienda. Con `?utm_source=meta&utm_campaign=PJSD26` se crea la cookie `pj_campana=PJSD26`. «Volver a promos» conserva los `utm_*`. Con delivery se arma igual (OFE-03). |
| 2. Casillas «Pizza 1 de 2 / 2 de 2» arriba, grilla con foto y texto, salto a la siguiente casilla vacía | ✅ | Casillas arriba y 6 especialidades con foto y descripción. Al elegir pasa a la casilla vacía; el Trío pasó de pizza 2 a pizza 3. `VAL-OFE-02-duo-inicial-390.png` |
| 3. Precio fijo y tachado siempre visibles | ✅ | «$22.590 / $27.800» arriba (Trío: $33.900 / $41.700), visibles también con el pie fijo. |
| 4. Botón «Elige 1 pizza más» / «Agregar Super Dúo · $22.590» | ✅ | Incompleto: «Elige 1 pizza más», deshabilitado. Completo: «Agregar Super Dúo» y «$22.590» en los extremos del botón, sin el punto medio literal (ver diferencias). |
| 5a. Sin tienda se abre el panel de TIE | ⚠️ | OFE dispara `pj:open-fulfillment {source:'pj-offers', reason:'add-to-cart'}` y se cancela si alguien llama `preventDefault`. El panel de TIE no está en esta rama (`hooks-fulfillment.ts`), así que hoy agrega el combo sin tienda. No se puede ver el panel; lo cubrirá la integración. |
| 5b. Entra al carrito con las pizzas elegidas a $22.590 | ⚠️ | Aparece el toast «¡Agregado! Super Dúo +22 Papa Puntos», el carrito suma 1 (de 3 a 4) y la línea dice «Super Dúo $22.590». El carrito no muestra qué pizzas se eligieron (Pollo BBQ y Super Pepperoni): el dato viaja en `c_pjComboChoices`, pero la línea no lo pinta. Hay que hacerlo visible o aceptar que se verá en PCT. La línea queda bajo «Despacho a domicilio / Delivery» sin tienda elegida. `VAL-OFE-02-carrito-390.png` |
| Táctil / contraste | ✅ | 0 botones menores de 44 px en el constructor. |

## OFE-03 · Oferta no disponible en la modalidad

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. Caso 2 + delivery: «Esta oferta es solo para retiro» con dos salidas | ✅ | Texto: «Esta oferta es solo para retiro. Elegiste delivery a Av. Providencia 1234. Puedes armarla igual y elegir cómo seguir:». Botón «Retirar en El Bosque / 0,8 km · listo en 15 min» y enlace «Ver ofertas con delivery» (va a `/promos`). Se ve en mobile y en escritorio. `VAL-OFE-03-duo-delivery-390.png`, `VAL-OFE-03-duo-delivery-1440.png` |
| 2. «Retirar en El Bosque» cambia la modalidad y conserva el combo | ✅ | La cookie pasó a `{"mode":"pickup","storeId":"pj-48"}` y aparece «Listo: retiras en El Bosque, Tobalaba 201. Tu combo sigue igual.» Se conservan Pollo BBQ y Boom de Jamón, y el botón queda «Agregar Super Dúo $22.590». `VAL-OFE-03-duo-retiro-390.png` |
| 3. En delivery el botón queda deshabilitado «Elige retiro para agregarla» | ✅ | Botón `disabled` con ese texto. |

## OFE-04 · Oferta vencida

| Criterio | Resultado | Evidencia |
|---|---|---|
| 1. «Esta oferta terminó el 2 de noviembre» y 3 ofertas vigentes con precio real | ✅ | Título en mayúsculas y chip «Terminó el 2 de noviembre». Alternativas: The Works $10.990 / $21.900, Super Dúo $22.590 / $27.800 y Papa Combo con Postre $17.490, iguales a §1.1 y a /promos. Botones «Ver todas las ofertas» e «Ir al menú». `VAL-OFE-04-vencida-390.png` |
| 2. Conserva los `utm_*` | ✅ | Las tres tarjetas y «Ver todas las ofertas» llevan `?utm_source=ig&utm_campaign=hw`. «Ir al menú» no los lleva (menor). |
| 3. Responde 200 | ✅ | `curl` con utm da 200. Un id inexistente (`/promos/inexistente`) da 404, como corresponde. |

## Diferencias visibles con el lienzo / observaciones

1. Chips del filtro de 23 px de alto, sin `aria-pressed`, así que no se anuncia cuál está activo (OFE-01).
2. Cabecera de /promos en mobile: el lienzo muestra «Retiro o delivery / Elige cómo lo quieres»; la implementación usa el header global con logo y buscador. Probablemente es otro épico.
3. «Ahorras $X» va en rojo en la implementación (el lienzo lo pinta en verde).
4. Botón completo: el lienzo y el criterio dicen «Agregar Super Dúo · $22.590»; la implementación separa nombre y precio a los extremos, sin «·».
5. Subtítulo «2 pizzas familiares ·» deja un punto medio suelto: el lienzo pone ahí la vigencia, que no existe para el Super Dúo.
6. La casilla «Pizza 1 de 2» llega ya preseleccionada con Pollo BBQ (arranca en «1 de 2 elegidas»). El lienzo no lo define; confirmar que es intencional.
7. «Volver a promos» pierde `?solo-retiro=1` (solo afecta al panel de demo).
8. «Ir al menú» en la oferta vencida no conserva los `utm_*`.
9. La línea del carrito no detalla las pizzas del combo (ver OFE-02, 5b).

## Consola y red

- Ninguna petición falló en el agregado (200, toast OK).
- Errores rojos en cada carga, solo en dev: WebSocket HMR de Vite (`ws://localhost:24678` con 400) y un aviso de hidratación por `nonce` del `<link critical.css>`. No son de OFE. Conviene verificar que no aparezcan en build.
- Sin errores propios de OFE al agregar ni al navegar.

## No cubierto

- Panel de TIE real (no existe en la rama).
- Contenido del `Combo-Trio` en escritorio (probé el Trío solo en mobile) y el flujo de Papa Flash, Palitos y Postre más allá de que sus fichas respondan 200.
- Capturas guardadas sin abrir: `VAL-OFE-03-ofertas-caso2-390.png`, `VAL-OFE-02-carrito-390.png` (esta sí la abrí) y las de pasos intermedios.
- Safari iOS.
- Vigencia ≤7 días: no hay ninguna oferta en ese rango con las fechas actuales.


## Revalidación (R2) · rama `hu/OFE` @ 806c3be · mobile 390 y escritorio 1440, contexto aislado limpio

| Verificación | Resultado | Evidencia |
|---|---|---|
| OFE-01 fichas del filtro miden 44 px o más a 390 px | ✅ | 5 fichas (`role=radio`) de 44 px. `VAL-OFE-R2-01-390.png` |
| OFE-01 fichas miden 44 px o más a 1440 px | ✅ | 5 fichas de 44 px. `VAL-OFE-R2-01-1440.png` |
| OFE-01 ficha activa anunciada con `aria-checked` | ✅ | Solo la activa tiene `aria-checked="true"`; al elegir «Para 2» pasa a ella. |
| OFE-01 el filtro sigue funcionando | ✅ | Para 1: Papa Flash. Para 2: Combo con Postre y Combo Palitos. Para 4: The Works y Super Dúo. Para 6+: Super Trío. Todas vuelve al listado completo. |
| Botón completo del constructor «Agregar Super Dúo · $22.590» | ⚠️ | Texto y precio correctos (2 de 2 elegidas, botón habilitado), pero se ve «Agregar Super Dúo· $22.590»: falta el espacio antes del «·» (en `innerText` el punto va en otra línea). Menor. `VAL-OFE-R2-02-duo-390.png` |
| Subtítulo sin punto suelto | ✅ | «2 pizzas familiares». |
| «Ir al menú» conserva el utm | ✅ | `/cl/es-CL/menu?utm_source=a`. Las tres tarjetas y «Ver todas las ofertas» también lo llevan. |

Consola: solo el ruido conocido de dev (WebSocket HMR 24678 con 400 y aviso de hidratación por `nonce`). Sin errores propios.

**Veredicto OFE-01: APROBADA.** Queda un detalle menor de espaciado en el botón del Super Dúo.
