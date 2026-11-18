# Pendientes de integración (INT)

Lo que los agentes dejaron para INT o DAT al unir sus ramas en `demo`. Se marca ✅ al resolverlo.

## Oleada 1

| # | Origen | Qué | Dueño | Estado |
|---|---|---|---|---|
| 1 | OFE, HOM | `AddedToast`/`showAddedToast` rompe la página: el Toaster está fuera de `SiteProvider` y el `Link` lo exige. Corregirlo en `pj-shared` (navegar con callback o mover el Toaster dentro del provider) y quitar las copias `combo-added-toast` (OFE) y `home-added-toast` (HOM). En 390 px el toast se corta a la derecha | INT | ✅ INT-07 |
| 2 | OFE, TIE | Mover a `pj-shared` los eventos de modalidad (`hooks-fulfillment.ts` de OFE y `PJ_FULFILLMENT_EVENTS`/`useRequireFulfillment` de TIE) y dejar una sola implementación | INT | ⬜ |
| 3 | OFE | `PJ_BOTTOM_NAV_ROUTES` usa prefijo: la barra aparece en `/promos/*`. Excluir los constructores y quitar el CSS `:has` de OFE | INT | ✅ INT-07 |
| 4 | OFE | `/promos` sin `/cl/es-CL` da 404: redirigir las rutas sin prefijo | INT | ✅ INT-07 |
| 5 | TIE | Política de permisos: `geolocation=()` bloquea «Usar mi ubicación». Fijar `geolocation=(self)` en `config.server.ts` | INT | ✅ INT-07 |
| 6 | TIE | Parpadeo del chip: leer `pj_fulfillment` en el servidor (loader del layout) | INT | ⬜ |
| 7 | HOM | Aviso de cookies: compacto (unos 130 px) y fijo sobre la barra inferior, sin tapar el precio del hero | INT | ✅ INT-07 |
| 8 | HOM | Regenerar `static-registry.ts` y el cartucho después de unir todo (conflicto probable) | INT | ⬜ |
| 9 | HOM | Desplegar el cartucho regenerado, importar `pj-home/page-designer/homepage.library.xml` y asignar grupos de clientes por componente | DAT | ⬜ |
| 10 | HOM | Conectar los textos fijos de la Home (chip «Retiro · El Bosque», tiempos de Delivery/Retiro) con `useFulfillment()` de TIE | HOM (oleada 3) | ✅ (INT-08, 63e7a18) |
| 11 | HOM | Token para el fondo de las insignias de popularidad (`bg-pj-sand`); revisar con la paleta oficial (S-D18) | INT-06 | ⬜ |
| 12 | HOM, PRO | LCP del hero y de la ficha: medir con `pnpm build` + Lighthouse móvil | INT (F5) | ⬜ |
| 13 | TIE | Atributo de cliente `c_pjFulfillment` (string) | DAT | ⬜ |
| 14 | HOM | Mover `lib/images.ts` (`scaledImage`, `imageSrcSet` vía DIS) a `pj-shared`; OFE tiene helpers parecidos | INT | ⬜ |
| 15 | OFE, VAL | Las pizzas del combo en la línea del carrito → criterio 5b de CAR-01 | CAR (oleada 2) | ✅ agregado |
| 16 | — | Changesets que pide el `CLAUDE.md` del template: no aplican a la demo (no se publica el paquete) | INT | ✅ decidido |
| 17 | MEN | Unificar los eventos `pj:configure-product` (MEN → PRO) con los de modalidad en `pj-shared` | INT | ⬜ |
| 18 | MEN | Tokens que faltan (hoy hex en clases): `#F3EBE0`, `#FBE9D7`, `#7A3A12`, `#FFF3E6`, `#E9C9A6` → mapear a la paleta oficial (S-D18) y quitar los hex | INT-06 | ⬜ |
| 19 | MEN | Datos: nombres de variantes de bebida con la marca repetida («Coca-Cola Coca-Cola 350 ml»), «1,5 LT» frente a «1,5 L», frase corta para acompañamientos | DAT | ⬜ |
| 20 | MEN | Mover `useCartLine` (contador con cola y debounce) a `pj-shared` para CAR | INT | ⬜ |
| 21 | VAL-HOM | `?perfil=auto` debe borrar también `pj_campana` y `pj_hora` (middleware de pj-shared) | INT | ⬜ |
| 22 | VAL-HOM | «Repetir pedido» de Sofía llega al checkout con «Despacho a domicilio»: el checkout debe tomar la modalidad de `pj_fulfillment` o la del último pedido (retiro en El Bosque), y la línea debe mostrar «sin cebolla» (`c_pjRemoved`) | CHK (oleada 2) | ⬜ |
| 23 | VAL-HOM | El botón de `/login` dice «Registrarse»; revisar con ING | ING (oleada 2) | ⬜ |
| 24 | VAL-MEN | Antes de cada VAL: cerrar páginas ajenas, borrar **todas** las cookies (incluidas httpOnly `usid` y `cc-at`, con CDP `Network.clearBrowserCookies`) y el almacenamiento, y confirmar el carrito vacío. No imprimir tokens de red en los informes | INT | ✅ regla |
| 25 | OFE | `core.css` tiene `[role="radio"]:not([data-labeled])` con min-height 16 px, que gana a las clases de tamaño, y la escala de espaciado no da 44 px con `min-h-11` y otras. Revisar el tema: o se corrige la regla y la escala en INT-06, o se documenta usar `min-h-[44px]` + `data-labeled` | INT-06 | ✅ INT-07 |
| 26 | OFE | Revalidar OFE-01 en el navegador sin ventana (correcciones hechas en `806c3be`, verificadas con curl y pruebas) | VAL | ⬜ en cola |
| 27 | PRO | El encabezado muestra «Ingresar» con la sesión iniciada en `/mitades` y en la ficha (`use-pj-me` o loader del layout) | INT | ✅ (INT-08, 63e7a18) |
| 28 | PRO | Datos: `c_pjReviewDist` y `c_pjReviews` (hoy son un mock en `mocks/reviews.ts`); `c_pjServes` no llega en las variantes de `getProduct`; «Champiñon» sin tilde en `ing-champinon`; `pj-hazlo-combo` debe mantener el monto en su `calloutMsg` | DAT | ⬜ |
| 29 | PRO | Las líneas se agregan al envío por defecto: asignar el envío de retiro a la tienda elegida (`pj_fulfillment`) | CAR/CHK (oleada 2) | ⬜ |
| 30 | PRO | Mover a `pj-shared`: `PizzaAddedToast`/`useShowAddedToast`, `useImageUrl`, `flyToCart`, `bumpCartCounters` y los tokens de chips | INT | ⬜ |
| 31 | PRO | La ruta de prueba `/pro-demo` sin enlace: dejarla solo para desarrollo, o protegida como el panel | INT | ⬜ |
| 32 | VAL-OFE R2 | Espacio antes del «·» en «Agregar Super Dúo · $22.590» | INT | ⬜ |
| 33 | VAL-PRO | Las fotos de los ingredientes Champiñón y Cebolla son marcadores grises: faltan las imágenes de `ing-champinon` e `ing-cebolla` | DAT | ⬜ |
| 34 | VAL-PRO | En /cart, la línea de mitades y la de pizza personalizada no muestran la configuración («sin cebolla», extras, «½ A · ½ B», foto dividida), y «Editar» abre un diálogo del template en inglés → CAR-01 usa `HalvesLineSummary` y `PizzaSheet` de PRO | CAR (oleada 2) | ✅ hecho en hu/CAR, en VAL |
| 35 | — | Se integraron en `demo` OFE, TIE, MEN (con el ajuste del aviso a 390 px, `9f66842`) y HOM; typecheck, lint y 12.767 pruebas en verde | INT | ✅ |
| 36 | PRO | El recargo del borde de queso varía según la pizza en el catálogo real (Pollo BBQ +$3.490, Italiana +$3.790, mitades y «Arma tu pizza» +$2.790). Se acepta como dato real y cada pantalla muestra el del catálogo | — | ✅ decidido |
| 37 | PRO | La línea de /cart muestra solo `price` sin `optionItems`: CAR debe sumar las opciones en `si` (usar `lineTotal` de PRO). SCAPI sí cobra el extra (verificado: `productTotal` $48.540) | CAR (oleada 2) | ✅ hecho en hu/CAR, en VAL |
| 38 | VAL-PRO R2 | `/cart` rotula «Despacho a domicilio» aunque la modalidad es retiro en El Bosque | CAR (oleada 2) | ✅ hecho en hu/CAR, en VAL |
| 39 | HOM-07 | Desplegar el cartucho regenerado (`pjGreeting.json` y `pjBenefits.json` cambiaron con `cartridge:generate`) | DAT | ⬜ |
| 40 | HOM-07 | Confirmar que existen `napolitana-familiar-1788736846.jpg` y `napocherry-1730987248.jpg` en la carpeta estática del catálogo (fotos destacadas de la Home) | DAT | ⬜ | ✅ (VAL: 200)
| 41 | HOM-07 | Variantes `pz-*-family-traditional` de Pollo BBQ, Super Pepperoni y Todas las Carnes *orderable* (el «+» de un toque) | DAT | ⬜ |
| 42 | HOM-07 | `c_pjRating` en los combos (la ★ del carrusel) | DAT | ⬜ |
| 43 | HOM-07 | Keyframes de llenado de la barra de puntos y entrada `pj-in` en `src/theme`; candidatos a pj-shared: `FoodCard` (HOM/MEN) y `pj-pop`/`pj-beat` (OFE) | INT | ⬜ |
| 44 | OFE-05 | Repetir la suite completa con el equipo libre: bajo carga reportó 5 errores sin identificar (fuera de pj-offers) | INT | ✅ (con el equipo libre: 699 archivos, 12.820 pruebas, 0 errores) |
| 45 | MEN-05 | Foto macro del queso estirándose para la ficha (la Pollo BBQ se ve «lejos» por la foto original; UX-1 §3.2) | DAT | ⬜ |
| 46 | MEN-05 | Candidato a pj-shared: `productLto` (`c_pjBadges` → sello) para HOM y OFE | INT | ⬜ |
| 47 | TIE-04 | Candidato a pj-shared: componente *skeleton* sobre `bg-pj-dough-deep` (hoy cada extensión lo repite) | INT | ⬜ |
| 48 | TIE-04 | El template `store-locator` ya no se usa en Locales pero sigue registrado; decidir si se borra | UXD/INT | ✅ no se borra (#74) |
| 49 | VAL-MEN-05 H1 | 5 errores CORS en consola de `/menu` a 390 por `fetch` de imágenes ocultas (combos, palitos); nuevos en MEN-05, origen no identificado | MEN | ✅ no se reproduce (#85) |
| 50 | VAL-MEN-05 H2 | La hoja tiene un segundo «Cerrar» invisible (cabecera de 1 px) que recibe el foco inicial | PRO | ⬜ |
| 51 | VAL-MEN-05 H3 | `/p/pz-pollo-bbq` sin `/cl/es-CL` muestra la Home (los enlaces internos llevan el prefijo) | INT | ⬜ |
| 52 | VAL-MEN-05 H4 | En 1440 no aparece «Hazlo combo» tras agregar desde la hoja (en 390 sí); confirmar contra el lienzo | MEN/UXD | ✅ (MEN-06) |
| 53 | VAL-MEN-05 H5 | Ficha a 390: sello «LA MÁS PEDIDA» y chip «Pedida 320 veces esta semana» repiten el mensaje | PRO/UXD | ✅ (MEN-06) |
| 54 | — | MEN-05 integrada en `demo` (merge de `hu/MEN`) | INT | ✅ |
| 55 | VAL-TIE-04 H1 | «Programar en X» abre el panel con «Lo antes posible» activo; debe llegar con «Programar» preseleccionado | TIE | ✅ (a5f1803) |
| 56 | VAL-TIE-04 H2 | El *skeleton* casi no se ve sobre crema (poco contraste) | TIE | ✅ (a5f1803) |
| 57 | VAL-TIE-04 H3 | Sin selección, el encabezado a 390 dice «Elige cómo lo …» truncado | TIE/INT | ✅ (a5f1803) |
| 58 | VAL-TIE-04 H4 | En el aviso de tienda cerrada, la sugerencia va rellena en Basil y parece «seleccionada» | TIE | ✅ (a5f1803) |
| 59 | VAL-TIE-04 H5 | Nombres de tienda mal escritos en el sandbox («irarrazaval», «San miguel», «Peñalolen», «Maipu») | DAT | ⬜ |
| 60 | — | TIE-04 integrada en `demo` (merge de `hu/TIE`) | INT | ✅ |
| 61 | VAL-OFE-05 | El sello «Para 2–3» se monta sobre la botella de la foto de Papa Combo con Postre en 1440 | OFE | ⬜ |
| 62 | VAL-HOM-07 H1 | Hero móvil de Valentina deja un «4.» huérfano en la última línea | HOM | ✅ (HOM-08, 37fa496) |
| 63 | VAL-HOM-07 H2 | Precio desalineado en la tarjeta «Para 3» en 1440 | HOM | ✅ (HOM-08, 37fa496) |
| 64 | VAL-HOM-07 H3 | Sofía sin franja lila de saludo («HOLA, SOFÍA» sobre crema); decidir si aplica | HOM/UXD | ✅ no aplica (UX-2) |
| 65 | VAL-HOM-07 H4 | Sofía en 1440: «Tus favoritas» deja un tercio vacío; barra de puntos Tomato sobre granate | HOM/UXD | ✅ (HOM-08, 37fa496) |
| 66 | — | OFE-05 y HOM-07 integradas en `demo`. Fotos destacadas confirmadas (200): #40 cerrado | INT | ✅ |
| 67 | OFE-06 | Panel de modalidad: si se confirma antes de que cargue, no retoma el agregado pendiente | TIE (TIE-05) | ✅ (TIE-05, VAL-C1) |
| 68 | OFE-06 | Candidato a pj-shared: `fullRowFraming` (fotos de combo en fila) para `cropForPhoto`; HOM lo necesita en el hero del Super Dúo | VIS/INT | ⬜ |
| 69 | HOM-08 | Original más grande de `cb-super-duo.jpg` y del Super Trío (432 px, se pintan a ~890 px en 1440) | DAT | ⬜ |
| 70 | HOM-08 | «+100 Papa Puntos en el primer pedido directo» es supuesto de demo: nada lo calcula (anotar en CONTRATO) | INT/CTA | ⬜ |
| 71 | HOM-08 | Diego a 390: las dos pizzas quedan en la mitad baja de la foto y la tarjeta tapa su borde; requiere recorte en `FoodImage` (o `fullRowFraming`, #68) | VIS/UXD | ⬜ |
| 72 | VIS-06 | Originales chicos a 1.440 px: `coca-cola-220` (296), `mini-palitos` (397) y los `750x600` (croissants, palitos, cartas, `h11`, `olo-2`); quedan con tope en `SMALL_ORIGINALS` | DAT | ⬜ |
| 73 | VIS-06 | Hero a 1440 pierde el zoom para no ablandarse (original 1.440 ≈ caja). **Decisión INT: nitidez primero**; recuperar el zoom con originales de hero ≥ 2.000 px (p. ej. `pollo-bbq-familiar`) | DAT | ⬜ |
| 74 | VIS-06 | #48: el template `store-locator` **no se borra**: lo usan `root.tsx`, la PDP, la confirmación, `store-preferences`, `bopis` y `pj-store` (37 importadores) | — | ✅ cerrado |
| 75 | VIS-06 | Sin vuelo al carrito desde la barra fija de la ficha cuando la foto quedó fuera de pantalla (solo salta el contador) | PRO | ⬜ |
| 76 | VIS-06 | HOM y OFE pueden dejar de armar `srcset` a mano (`pj-home/lib/images.ts`, `pj-offers/lib/offers.ts`) y usar `photoSrcSet` de pj-shared | HOM/OFE | ⬜ |
| 77 | TIE-05 | La ruta del template `store-locator` reexporta la de pj-store (marcador `SFDC_EXT_PJ_STORE`); el panel aún usa `useStoreLocator` del template | INT | ⬜ revisar |
| 78 | TIE-05 | `c_pjPickupMinutes` variado por tienda y nombres con tilde en el sandbox («Peñalolén», «Maipú», «Irarrázaval») | DAT | ⬜ |
| 79 | MEN-06 | Precio promocional de «Hazlo combo» no se aplica en el carrito ($9.480 en vez de $6.990): hooks de SCAPI apagados | Raúl (feature switch) | ✅ hooks activos (07-nov) |
| 80 | MEN-06 | Candidatos a pj-shared: `BottomSheet hideClose`, `PointsBadge` a Garlic + Sauce (N7), `HazloComboCompact` para la venta cruzada del carrito | VIS/CAR | ⬜ |
| 81 | INT-08 | A 390, en ficha, `/mitades`, `/store-locator` y `/cart` (sin barra inferior) el cliente no aparece: decidir entre achicar el logo móvil o poner el avatar en lugar de la lupa | UXD | ⬜ |
| 82 | INT-08 | Diego y Valentina sin modalidad inicial («Elige tienda»): supuesto de INT (el contrato solo fija la de Sofía) | — | ✅ supuesto |
| 83 | VAL-MEN-06 H1 | Chip «Ganas N Papa Puntos» del panel «Tu pedido» sigue en lima (debe ir Garlic + Sauce) | MEN/VIS | ⬜ |
| 84 | VAL-MEN-06 H3/H4 | Aviso del menú sin «Deshacer»; hoja a 1440 muestra la pizza entera, no macro | MEN/PRO | ⬜ |
| 85 | VAL-MEN-05 H1 | Errores CORS: no se reprodujeron en MEN-06 ni en VAL-MEN-06; eran del script de validación | — | ✅ cerrado |
| 86 | — | MEN-06 integrada en `demo` | INT | ✅ |
| 87 | VAL-C1 | VIS-06, HOM-08, OFE-06 y TIE-05 aprobadas (notas 8–8,5; promedio 8,1) e integradas en `demo` (`31f641b`). #67 resuelto | INT | ✅ |
| 88 | VAL-C1 M2/M3 | `text-wrap: balance` en más títulos; sello del hero de Diego lima en 1440 y granate en 390 | HOM | ⬜ |
| 89 | VAL-C1 M4 | Ranuras del constructor en 220 px (criterio: 240) | OFE | ⬜ |
| 90 | VAL-C1 M5 | Diapositivas ocultas del hero del menú piden `sw` 480 | VIS | ⬜ |
| 91 | VAL-C1 M6 | «Boom de Jamón» y «Hawaiana» con fotos macro de otro fondo | DAT | ⬜ |
| 92 | VAL-C1 M8/M9 | Banner de cookies tapa el CTA de Sofía a 390; nombre truncado en el aviso de agregado a 390 | INT/VIS | ⬜ |
| 93 | VAL-INT-08 H1 | Chip con `?perfil=sofia`: pasa por «Elige tienda» → «Retiro, pj-48» → «Retiro · 15 min / El Bosque» (el HTML del servidor no trae la modalidad) | INT/TIE | ⬜ |
| 94 | VAL-INT-08 H2 | `localStorage.pj_fulfillment_meta` conserva la tienda anterior al cambiar de perfil | INT | ⬜ |
| 95 | — | INT-08 integrada en `demo` (`681dcd4`) y desplegada en MRT (bundle 3) | INT | ✅ |
| 96 | Raúl 07-nov | `/p/cb-pizza-del-mes` (y todo lo que no es pizza) cae en la ficha del template: pide código postal, «retiro gratis» BOPIS y no ofrece acompañamientos. Rompe la regla 1 y la 7 del libreto (04) y S-D3 | PRO (PRO-08) | ✅ hecho en hu/PRO (f353ea3), en VAL |
| 97 | Raúl 07-nov | Auditoría completa del libreto de compra en el sitio publicado (`revisiones/AUD-compra.md`) | Auditor | ✅ hecha (P0 ×4, P1 ×7) |
| 98 | AUD P0-2/3, P1-1/2/6 | Enlaces a `/p/cb-super-duo|trio` (menú, buscador), CTA del hero y favoritas que navegan a ficha, «+» de la Home que agrega sin hoja, título del panel | HOM-09, MEN-07, TIE-06 | ✅ hecho (HOM 14ab7f4, MEN 91d0105, TIE 184271b) |
| 99 | AUD P0-4, P1-3/4 | Combos con ficha sin aviso ni elecciones; mitades sin monto en el botón; ficha sin entrada a mitades | PRO-08 | ✅ hecho en hu/PRO (f353ea3), en VAL |
| 100 | AUD P1-5 | Carrito: Super Dúo sin sus pizzas; «Hazlo combo» como dos líneas sueltas | CAR | ✅ hecho en hu/CAR, en VAL |
| 101 | AUD P1-7 | Sin sesión, «Repetir pedido» de Sofía lleva al login del template («Registrarse», Apple, Google) | ING (oleada 2) | ⬜ |
| 102 | AUD | Mitades cobra el precio base ($12.400) y no el promedio ($17.900): hooks de SCAPI apagados | Raúl (feature switch) | ✅ hooks activos (07-nov) |
| 103 | UX-3 | El carrito objetivo (`revisiones/UX-3-carrito.md`): el lienzo no tiene página «06 Carrito» (está repartido en 4 tableros de las páginas 02, 04 y 09, con la marca vieja). CAR-02 implementa la especificación; meta 8 en 390 y 1440 | CAR (CAR-02) | ✅ CAR-02 (f113361), en VAL-C3 |
| 104 | PRO-08 | DAT: foto de Helados La Cremería con texto (S-D8), `c_pjSensory` en bebidas/helados/extras, `c_pjRating`/`c_pjBadges` en combos, «Coca Cola Sin Azucar 220ml» sin tildes | DAT | ⬜ |
| 105 | UX-3 | DAT: promociones de «Conviértelo en combo» y canje de Papa Puntos; nombres «1,5 L» y «350 ml» | DAT | ⬜ |
| 106 | EVAL-agregar | 9 mecanismos de agregar y 5 avisos distintos. Unificar: entrada única `requestConfigure` → `usePjAdd()` → una sola acción `/action/pj-cart`; retirar `/action/pj-combo-add`, `/action/pj-home-cart`, avisos propios y `cart-bump.ts`; `/search` y `/c/*` al menú | ADD (después de integrar PRO-08, CAR y ENT) | ⬜ |
| 107 | EVAL D-P1-1 | «Hazlo combo» se ofrece después de cada pizza en escritorio (`pizza-sheet.tsx:245`), no solo la primera | ADD/PRO | ⬜ |
| 108 | EVAL D-P1-2/4/5 | Aviso del constructor sin «Deshacer» y puntos mal calculados; vuelo doble en la ficha; «Para 3» de Diego agrega el combo sin elecciones | ADD | ⬜ |
| 109 | EVAL | Repetir pedido vacía el carrito sin avisar y pierde los extras | ADD/CAR | ⬜ |
| 110 | EVAL | Sin pruebas de las acciones PJ (`pj-cart`, `pj-combo-add`, `pj-home-cart`) ni e2e de los flujos de agregar | ADD | ⬜ |
| 111 | EVAL D-P0-3 | Orden de integración: PRO-08 antes que ENT (si no, el hero de Valentina cae en la ficha del template) | INT | ✅ anotado |
| 112 | ENT | Panel desde el constructor Super Dúo/Trío sin nombre: OFE debe pasar `productName: offer.name` en `requestFulfillmentPanel()` | ADD/OFE | ✅ OFE-07 (adfe40a) |
| 113 | ENT | La favorita de Sofía abre la hoja sin «sin cebolla»: `ConfigureProductDetail` necesita `crust` y `removed` | ADD/PRO | ⬜ |
| 114 | INT | Al integrar: `src/components/pj-home/*` choca entre HOM-09 (`ProfileGate` en `lib/types.ts`) y CAR-00; **queda la versión de HOM** | INT | ✅ anotado |
| 115 | VAL-C2 H1 | Complementos de la ficha de Pizza del Mes agrupados como «Combo» bajo otra pizza cuando hay varias | CAR (CAR-02) | ✅ CAR-02 (f113361), en VAL-C3 |
| 116 | VAL-C2 H3 | El aviso de combos (Super Dúo, Papa Flash, Pizza del Mes) solo dice el nombre, sin pizzas ni complementos | ADD | ⬜ |
| 117 | VAL-C2 H5/H6 | «Llega en 40 min» vs «35–45 min»; dos pizzas idénticas no se juntan | CAR (CAR-02) | ✅ CAR-02 (f113361), en VAL-C3 |
| 118 | — | PRO-08 integrada en `demo` (`7015d86`) | INT | ✅ |
| 119 | — | HOM-09 y MEN-07 aprobadas (VAL-ENT); TIE-06 rechazada solo por el panel sin nombre desde el constructor, corregido con OFE-07. Las cuatro integradas en `demo` (`bdf3713`): typecheck, lint, build y 12.921 pruebas en verde | INT | ✅ |
| 120 | VAL-ENT H2 | Nombres enlazados de 23 px de alto a 390 en la Home (el «+» de 44 px es la entrada principal) | HOM | ⬜ |
| 121 | CAR-02 | Canje de Papa Puntos simulado con la cookie `pj_canje` (la promoción `pj-canje-puntos` no existe): CHK debe leer la misma cookie; DAT debe publicar la promoción | CHK/DAT | ⬜ |
| 122 | CAR-02 | Atributo de línea `c_pjComboFor` para el vínculo explícito pizza–«Hazlo combo» (hoy se infiere por el orden) | DAT | ✅ DAT-11 (4c66c05) |
| 123 | — | CAR-01 y CAR-02 integradas en `demo` (`8ecd80b`), con `src/components/pj-home/*` resuelto a la versión de HOM. typecheck, lint, build y 12.967 pruebas en verde | INT | ✅ |
| 124 | VAL-C3 H-1 | `/checkout` del template ignora el canje ($13.000, total $38.880) y dice «Despacho a domicilio» con retiro → checkout de marca | CHK (oleada 2) | ✅ CHK (de7dba1), integrado |
| 125 | VAL-C3 H-2/3/5/7 | Panel «Tu pedido» ignora el canje; complementos sueltos a precio de promoción; fotos de línea blandas a DPR 2; ETA de delivery distinto | CAR (CAR-03) | ✅ |
| 126 | VAL-C3 H-6 | El aviso del «+» del menú no tiene puntos ni «Deshacer» | ADD | ⬜ |
| 127 | — | Comparación con Melt Pizzas (`revisiones/MELT-vs-PJ.md`) para la presentación | UXD | ✅ |
| 128 | MELT | `/puntos` responde 502 (la Home de Sofía lo enlaza 5 veces); sin página 404 (toda URL inexistente da 502); «Cuenta» y `/account` al login del template en inglés | CTA + INT-10 | ✅ CTA (fa5f2a2) + INT-10 (85deef9), integrado |
| 129 | MELT | «Repetir pedido» reemplaza el carrito, pierde «sin cebolla» y salta al checkout del template | ADD/CAR | ⬜ |
| 130 | MELT | No mostrar en la demo: login, «Completa tu pedido» de Pizza del Mes (líneas sueltas, ya corregido en CAR-03), meltpizzas.com en vivo, velocidad sin Lighthouse | Raúl (guion) | ✅ anotado |
| 131 | CHK | Canje cobrado con un supuesto de demo: el medio de pago queda por $23.890 pero `orderTotal` en Commerce sigue en $36.890 hasta que exista el cupón `PJ-CANJE-PUNTOS` (pedido a DAT-11) | DAT | ✅ DAT-11 (4c66c05) |
| 132 | CHK | Efectivo (`PJ_CASH`), atributos `c_pj*` en Basket; saldo de puntos no se descuenta en el perfil (encabezado sigue en 340) | DAT / CTA | ✅ DAT-11 (4c66c05) |
| 133 | CHK | «Repetir pedido» agrega la pizza canjeada como línea de $13.000; debe saltarla | ADD/CAR | ⬜ |
| 134 | CHK | `/login` sigue siendo el del template | ING / CTA | 🔄 |
| 135 | — | CHK integrado en `demo` sin conflictos: typecheck, lint y build en verde. Pedidos de prueba 00000099–00000101 en `dev-chk` | INT | ✅ |
| 136 | CTA | Ingreso sin contraseña con código: la preferencia «Enable Email Verification» está apagada en el sandbox; `/login` traducido y sin Apple/Google, pero sin encabezado de marca | ING / Raúl (preferencia) | ⬜ |
| 137 | CTA | «Mis pedidos» del template falla (`getCustomerOrders`) para `dev-car`: no abrir en la demo | SEG/CTA | ⬜ |
| 138 | CTA | La vista previa local por http no guarda cookies `Secure` (perfil, canasta): probar en dev o en el sitio https | — | ✅ anotado |
| 139 | DAT-11 | Supuestos de DAT a confirmar: masas con recargo fuera del combo; canje cubre las 3 medianas canjeables; `pj-super-duo-pickup` (solo retiro) sigue apuntando a `cb-super-duo`; `free_extras: 3` del Super Dúo real no aplicado | Raúl | ⬜ |
| 140 | DAT-11 | No hay bebidas de 2 L ni 3 L en el catálogo: el tamaño grande es 2,5 L | — | ✅ anotado |
| 141 | VEN | VEN integrada en `demo` (S-D19 y S-D20): «Completa tu pedido» tras toda pizza o combo, «¿Le sumamos algo?», Dúo/Trío con «Personalizar» y bloque de grupo en el carrito. typecheck, lint, build y 13.037 pruebas en verde | INT | ✅ |
| 142 | VEN | «Ahorras» del Dúo: el carrito dice $11.210 (precios de catálogo) y el constructor $5.210 (`c_pjPriceBefore` $27.800); alinear el dato | DAT | ⬜ |
| 143 | VEN | Subir de tamaño la bebida de un combo (1,5 L → 2,5 L) requiere otra promoción; hoy solo se sube una bebida suelta | DAT (opcional) | ⬜ |
| 144 | VEN | Panel «Tu pedido» del menú muestra las pizzas del Dúo sueltas y aún escucha `pj:hazlo-combo-offer` | MEN | ⬜ |
