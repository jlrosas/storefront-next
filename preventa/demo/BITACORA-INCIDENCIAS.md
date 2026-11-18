# Bitácora de incidencias · Demo Papa Johns Chile

- **Creada:** 07-nov-2026, por pedido de Raúl: «los pendientes vamos a revisarlos después; hay que documentarlos en una bitácora de incidencias».
- **Corte:** rama `demo` (`e4da058`) con todo integrado y desplegada en MRT (bundle 6, 07-nov). Validación final: **apta, 8,5/10** (`revisiones/VAL-FINAL.md`; pedido de prueba 00000111 en `dev-chk`).
- **Fuente:** los pendientes abiertos de [INTEGRACION.md](INTEGRACION.md) (columna «#»), consolidados y clasificados. Esa columna sigue siendo el registro histórico; esta bitácora es la lista de trabajo.

## Cómo se usa

| Campo | Valores |
|---|---|
| Severidad | **B** bloquea la demo · **A** se nota en la demo · **M** pulido · **T** deuda técnica (no se ve) |
| Estado | ⬜ abierta · 🔎 verificar: probablemente resuelta por trabajo posterior · 🧑 decisión de Raúl · ✅ cerrada (con fecha y commit) |
| Dueño | El agente o rol: INT, DAT, HOM, MEN, PRO, OFE, TIE, CAR, CHK, CTA, ING, SEG, UXD, ADD (unificación de agregar) |

Al cerrar una incidencia: cambiar el estado a ✅, anotar fecha y commit, y marcar la fila de INTEGRACION.md.

## 1. Decisiones pendientes de Raúl

| ID | # | Incidencia | Sev. | Estado |
|---|---|---|---|---|
| BI-01 | 139 | Supuestos de DAT-11: (a) masas con recargo fuera del Dúo/Trío; (b) el canje cubre las 3 medianas canjeables, no solo la Super Pepperoni; (c) `pj-super-duo-pickup` (Dúo solo retiro, caso 2 del panel) sigue apuntando a `cb-super-duo`; (d) los 3 extras gratis del Super Dúo real no se aplican (S-D20 cobra los extras) | A | 🧑 |
| BI-02 | 142 | «Ahorras» del Super Dúo: el carrito dice $11.210 (contra los precios de catálogo) y el constructor $5.210 (contra `c_pjPriceBefore` $27.800). Definir cuál cifra manda | A | 🧑 |
| BI-03 | 143 | Subir la bebida de un combo de 1,5 L a 2,5 L requiere otra promoción. Hoy solo se sube una bebida suelta. En el catálogo no hay 2 L ni 3 L: el tamaño grande es 2,5 L | M | 🧑 |
| BI-04 | 81 | A 390 px, la ficha, `/mitades`, `/store-locator` y `/cart` no tienen barra inferior y el cliente no aparece. Opciones: achicar el logo móvil o poner el avatar en lugar de la lupa | M | 🧑 (con UXD) |
| BI-05 | 136 | Ingreso sin contraseña con código: requiere activar «Enable Email Verification» en el sandbox. Sin eso, `/login` es correo + contraseña | A | 🧑 |

## 2. Compra: funcionales

| ID | # | Incidencia | Sev. | Dueño | Estado |
|---|---|---|---|---|---|
| BI-10 | 106 | Hay 9 mecanismos de agregar y 5 avisos distintos. Unificar en `requestConfigure` → `usePjAdd()` → `/action/pj-cart` y retirar `/action/pj-combo-add`, `/action/pj-home-cart` y los avisos propios. VEN ya centralizó la venta cruzada (`nextCrossSell`) y los intents del Dúo | A | ADD | ⬜ |
| BI-11 | 109, 129, 133, 22 | «Repetir pedido»: reemplaza el carrito sin avisar, pierde «sin cebolla» y los extras, agrega la pizza canjeada como línea de $13.000 y salta directo al checkout | A | ADD/CAR | ⬜ |
| BI-12 | 101 | Sin sesión, «Repetir pedido» de Sofía lleva al login | A | ING | ⬜ |
| BI-13 | 108, 116, 126 | Avisos de agregado incompletos: los combos solo muestran el nombre (sin pizzas ni complementos); el «+» del menú no tiene puntos ni «Deshacer»; el «Para 3» de Diego agrega el combo sin elecciones | M | ADD | ⬜ |
| BI-14 | 113 | La favorita de Sofía abre la hoja sin «sin cebolla»: `ConfigureProductDetail` necesita `crust` y `removed` | M | ADD/PRO | ⬜ |
| BI-15 | 137 | «Mis pedidos» (template) falla con `getCustomerOrders`. **No abrir en la demo** | A | SEG/CTA | ⬜ |
| BI-16 | 144 | El panel «Tu pedido» del menú muestra sueltas las pizzas del Dúo y todavía escucha `pj:hazlo-combo-offer` | M | MEN | ⬜ |
| BI-17 | 93, 94 | Chip con `?perfil=sofia`: parpadea «Elige tienda» → «Retiro, pj-48» → «Retiro · 15 min / El Bosque»; `localStorage` conserva la tienda del perfil anterior | M | INT/TIE | ⬜ |
| BI-18 | 6 | Parpadeo del chip: leer `pj_fulfillment` en el loader del layout | M | INT | ⬜ |
| BI-19 | 21 | `?perfil=auto` no borra `pj_campana` ni `pj_hora` | M | INT | ⬜ |
| BI-20 | 75 | Desde la barra fija de la ficha, sin la foto en pantalla, no hay vuelo al carrito (solo salta el contador) | M | PRO | ⬜ |
| BI-21 | 84 | El aviso del menú no tiene «Deshacer», y la hoja a 1440 muestra la pizza entera y no el recorte macro | M | MEN/PRO | ⬜ |
| BI-22 | 50 | La hoja tiene un segundo «Cerrar» oculto (`display:none`): solo limpieza | T | PRO | ⬜ |
| BI-23 | 51 | `/p/pz-pollo-bbq` sin `/cl/es-CL` muestra la Home. Los enlaces internos llevan el prefijo | M | INT | ⬜ |
| BI-24 | 70 | «+100 Papa Puntos en el primer pedido directo» (Diego) es un supuesto: nada lo calcula. Anotarlo en CONTRATO | M | INT/CTA | ⬜ |
| BI-25 | 31 | La ruta de prueba `/pro-demo` sigue accesible: dejarla solo en desarrollo | T | INT | ⬜ |
| BI-26 | 22, 29 | Checkout con «Despacho a domicilio» en retiro, y envío por defecto en vez de la tienda | A | CHK | 🔎 resuelto en CHK `de7dba1` (pedido 00000100 con retiro en pj-48) |
| BI-27 | 107 | «Hazlo combo» después de cada pizza en escritorio | A | PRO | 🔎 resuelto en VEN `89d5910` (`nextCrossSell`) |
| BI-28 | 121, 105 | Canje simulado con cookie, sin promoción en Commerce | A | DAT/CHK | 🔎 resuelto en DAT-11 (`PJ-CANJE-PUNTOS`, pedido canónico $23.890) |
| BI-30 | VAL-F H1 | Quitar una línea del carrito repetido dio «Algo salió mal: Body is unusable» (`basket-action.server.ts:158` lee `request.formData()` dos veces). Con clic real funcionó; confirmar si es doble envío | A | CAR | ⬜ |
| BI-31 | VAL-F H2 | La ficha de combo (`cb-pizza-del-mes`) vuela dos veces al carrito (D-P1-4 sigue en esa ficha); el Super Dúo y las mitades no tienen vuelo, solo franja | M | PRO/ADD | ⬜ |
| BI-32 | VAL-F | La Home de Sofía sigue en 340 puntos tras canjear y pagar (el saldo no se descuenta en el perfil) | A | CTA/DAT | ⬜ |
| BI-33 | VAL-F | La línea agrupada «Combo Palitos y bebida» usa foto de pizza | M | CAR | ⬜ |
| BI-34 | VAL-F | La Home dice $38.880 y el checkout $36.890 para el pedido repetido (ver BI-11) | A | ADD/CAR | ⬜ |
| BI-29 | 134, 23 | `/login` del template («Registrarse», Apple/Google) | A | ING | 🔎 en parte: CTA lo tradujo y quitó las redes; sin encabezado de marca |

## 3. Datos del catálogo y del sandbox (DAT)

| ID | # | Incidencia | Sev. | Estado |
|---|---|---|---|---|
| BI-40 | 9, 39, 8 | Regenerar `static-registry.ts` y el cartucho de Page Designer, desplegarlo, importar `homepage.library.xml` y asignar grupos de clientes | A | ⬜ |
| BI-41 | 19, 104 | Nombres: «Coca-Cola Coca-Cola 350 ml», «1,5 LT» en vez de «1,5 L», «Coca Cola Sin Azucar 220ml» sin tildes | M | ⬜ |
| BI-42 | 28, 33 | «Champiñon» sin tilde; fotos de los ingredientes Champiñón y Cebolla en gris; reseñas mock (`c_pjReviewDist`, `c_pjReviews`); `c_pjServes` no llega en las variantes | M | ⬜ |
| BI-43 | 59, 78 | Nombres de tienda sin tilde ni mayúscula («irarrazaval», «San miguel», «Peñalolen», «Maipu»); `c_pjPickupMinutes` igual en casi todas las tiendas | M | ⬜ |
| BI-44 | 42, 104 | `c_pjRating` y `c_pjBadges` en combos; `c_pjSensory` en bebidas, helados y extras | M | ⬜ |
| BI-45 | 104 | Foto de Helados La Cremería con texto publicitario (S-D8) | M | ⬜ |
| BI-46 | 41 | Variantes familiares *orderable* para el «+» de un toque (Pollo BBQ, Super Pepperoni, Todas las Carnes) | M | 🔎 verificar |
| BI-47 | 69, 72, 73 | Fotos chicas: `cb-super-duo` y Super Trío (432 px), `coca-cola-220` (296), `mini-palitos` (397), las de `750x600`. Heros ≥ 2.000 px para recuperar el zoom a 1440 | A | ⬜ |
| BI-48 | 45, 91 | Foto macro del queso estirándose para la ficha; «Boom de Jamón» y «Hawaiana» con fotos de otro fondo | M | ⬜ |
| BI-49 | 13 | Atributo de cliente `c_pjFulfillment` (última modalidad) | T | ⬜ |

## 4. Visual y UX

| ID | # | Incidencia | Sev. | Dueño | Estado |
|---|---|---|---|---|---|
| BI-60 | 92 | El banner de cookies tapa el CTA del hero de Sofía a 390; el nombre se trunca en el aviso de agregado | M | INT/VIS | ⬜ |
| BI-61 | 71 | Diego a 390: las dos pizzas del hero quedan en la mitad baja de la foto | M | VIS/UXD | ⬜ |
| BI-62 | 88 | `text-wrap: balance` en más títulos; el sello del hero de Diego es lima a 1440 y granate a 390 | M | HOM | ⬜ |
| BI-63 | 83 | El chip «Ganas N Papa Puntos» del panel sigue en lima (N7: Garlic + Sauce) | M | MEN/VIS | ⬜ |
| BI-64 | 61 | El sello «Para 2–3» tapa la botella en la foto de Papa Combo con Postre a 1440 | M | OFE | ⬜ |
| BI-65 | 89 | Ranuras del constructor de 220 px (el criterio pedía 240) | M | OFE | ⬜ |
| BI-66 | 90 | Las diapositivas ocultas del hero del menú piden `sw` 480 | M | VIS | ⬜ |
| BI-67 | 120 | En la Home, los nombres enlazados miden 23 px de alto a 390 (el «+» de 44 px es la entrada principal) | M | HOM | ⬜ |
| BI-68 | 11, 18 | Hex fuera de paleta en MEN (`#F3EBE0`, `#FBE9D7`, …) y token `bg-pj-sand` en HOM | M | INT | 🔎 verificar (VIS-03 los migró; confirmar con `rg`) |
| BI-69 | 32 | Espacio antes del «·» en «Agregar Super Dúo · $22.590» | M | OFE | 🔎 resuelto en OFE-05 |
| BI-70 | 26 | Revalidar OFE-01 en el navegador | M | VAL | 🔎 cubierto por VAL-OFE-05 y VAL-C1 |
| BI-71 | 12 | LCP del hero y de la ficha: medir con build de producción + Lighthouse móvil (no comparar velocidad con Melt hasta tenerlo) | A | INT (F5) | ⬜ |

## 5. Deuda técnica (no se ve en la demo)

| ID | # | Incidencia | Dueño |
|---|---|---|---|
| BI-80 | 2, 17 | Eventos de modalidad y `pj:configure-product` duplicados entre OFE, TIE y MEN: una sola implementación en `pj-shared` | INT |
| BI-81 | 14, 76, 68 | Helpers de imágenes repetidos (`pj-home/lib/images.ts`, `pj-offers/lib/offers.ts`): usar `photoSrcSet` y `cropForPhoto` (+ `fullRowFraming`) de `pj-shared` | INT/HOM/OFE |
| BI-82 | 20, 30, 46, 47, 80, 43 | Candidatos a `pj-shared`: `useCartLine`, avisos y vuelo, `productLto`, skeleton, `BottomSheet hideClose`, `PointsBadge`, `HazloComboCompact`, `FoodCard`, keyframes `pj-pop`/`pj-beat`/`pj-in` | INT |
| BI-83 | 77 | La ruta `store-locator` del template reexporta la de `pj-store`, y el panel aún usa `useStoreLocator` del template | INT |
| BI-84 | 110 | Sin pruebas de las acciones PJ (`pj-cart`, `pj-combo-add`, `pj-home-cart`) ni e2e de los flujos de compra | ADD/INT |

## Notas para la demo (no son incidencias, son reglas de presentación)

- **No abrir:** «Mis pedidos» (BI-15), `/login` (BI-29, BI-05), meltpizzas.com en vivo, ni comparaciones de velocidad sin Lighthouse (BI-71).
- **Opiniones y movimientos de puntos:** son datos de ejemplo; presentarlos así.
- **Despliegue:** siempre `pnpm build` + `npx sfnext preview -p 3017` antes de `pnpm sfnext push`. La vista previa por http no guarda las cookies `Secure` (perfil y canasta), así que los flujos con sesión se prueban en el servidor de desarrollo o en el sitio publicado.
