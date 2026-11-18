# site-data · el sitio PapaJohnsCL desde el repo

Todo lo que la demo necesita en el sandbox `zyfj-001` (sitio `PapaJohnsCL`) se genera desde esta carpeta.
Dueño: DAT. Credenciales: `dw.json` de la raíz del proyecto (nunca se copia aquí).

> Antes de esto, el sandbox, los API clients, SLAS, los pasos de Business Manager y MRT: [../AMBIENTE.md](../AMBIENTE.md).

## Reconstruir el sitio desde cero

```bash
# desde la raíz del storefront
site-data/rebuild.sh                  # todo: archivo del sitio, cartucho, import, reindex y clientes
site-data/rebuild.sh --skip-customers # sin tocar clientes ni pedidos
python3 site-data/ocapi/verify.py     # comprueba los criterios DAT-02 a DAT-07 y DAT-11 con SCAPI/OCAPI reales
python3 site-data/ocapi/dat11.py      # solo DAT-11, sin reconstruir (el rebuild completo ya lo incluye)
```

`rebuild.sh` hace, en orden:

| Paso | Comando | Qué deja |
|---|---|---|
| 1 | `python3 site-data/build_site.py` | `site-data/build/PapaJohnsCL/` (no se versiona) |
| 2 | `pnpm b2c code deploy cartridges -c int_papajohns_demo -v SFRA_UPC_08_21_2026` | Cartucho de la demo en la code version **activa** (dw.json dice otra) |
| 3 | `pnpm b2c job import site-data/build/PapaJohnsCL` | Catálogo, precios, inventario, tiendas, metadata, promociones, grupos, source codes, envíos, preferencias y permisos OCAPI |
| 4 | `pnpm b2c job run PapaJohnsCL-Reindex --wait` | Índice de búsqueda |
| 5 | `python3 site-data/ocapi/customers.py` | Clientes de demo, puntos, grupos, dirección, tarjeta y pedidos (idempotente) |

Todos los comandos del CLI llevan `--config <dw.json> --dotenv-file=`. Las fotos se descargan una vez a
`site-data/.cache/images` (no se versiona). `compose_combo_images.py` (requiere Pillow) regenera las fotos de
los combos en `assets/combos/`, que sí se versionan.

Exportar lo que hay hoy en el sandbox: `site-data/export_sandbox.sh <carpeta>`. El estado previo a DAT-01
quedó en [reference/sandbox-2026-11-06](reference/sandbox-2026-11-06/README.md).

## Qué genera

| Archivo | Contenido |
|---|---|
| `build_site.py` | Archivo del sitio completo a partir de `source/` (API de papajohns.cl) y `demo_data.py` |
| `demo_data.py` | Lo editorial de la demo: grupos de pizza, textos sensoriales, insignias, reseñas (R4.4), ingredientes base, combos y tiendas de la demo |
| `source/` | `prices.json`, `sizes_and_crusts.json`, `stores.json` (13-oct), `ingredients.json` (31), `promotions-2026-11-06.json` (vigentes el 06-nov), `stores_extra.json` (El Bosque, 06-nov) |
| `ocapi/pj.py` | Cliente mínimo de OCAPI Data y SCAPI Shopper (SLAS público con PKCE) |
| `ocapi/customers.py` | Clientes de demo (contrato §3) |
| `ocapi/verify.py` | Verificación de criterios |
| `ocapi/dat11.py` | Aplica DAT-11 por WebDAV + job de importación (OCAPI): opción `pjCombo`, promociones del Dúo/Trío y del canje, cupón, `PJ_CASH`, atributos de línea y de canasta |
| `../cartridges/int_papajohns_demo` | Hooks: precio de mitades (`dw.order.calculate`), validaciones de carrito, pedido mínimo de delivery y colocación del pedido |

## Datos para los demás agentes

### Catálogo (contrato §4.1)

- **Categorías:** `ofertas` (combos), `pizzas` → `pizzas-clasicas` (5), `pizzas-favoritas` (6), `pizzas-premium` (5),
  `pan-pizza` (4), `pizzas-croissant` (4); `pz-arma-tu-pizza` y `pz-mitades` cuelgan de `pizzas`.
  `acompanamientos`, `postres`, `bebidas`, `salsas-extras`. `ingredientes` está offline (solo para que existan los `ing-*`).
- **Atributos de producto:** `c_pjKind`, `c_pjBadges`, `c_pjFoodType`, `c_pjSensory`, `c_pjWeeklyOrders`,
  `c_pjRating`, `c_pjReviewCount`, `c_pjBaseIngredients`, `c_pjHalvesEnabled`, `c_pjRedeemPoints` (maestro);
  `c_pjServes`, `c_pjSize`, `c_pjCrust` (variante); combos con `c_pjSlots`, `c_pjValidFrom`, `c_pjValidTo`,
  `c_pjDispatch`, `c_pjOccasion`, `c_pjPriceBefore`, `c_pjServes`.
- **Búsqueda:** los atributos llegan en `representedProduct` con `expand=custom_properties,represented_products`;
  `c_pjServes` de cada variante con `allVariationProperties=true&includedCustomVariationProperties=c_pjServes`.
  Refinamientos: `c_pjBadges`, `c_pjFoodType`, `c_pjKind`.
- **Extras:** una opción por ingrediente, `pjExtras_<id>` con valores `no` (por defecto) y `si`, en el maestro
  de cada pizza, `pz-arma-tu-pizza` y `pz-mitades`. El catálogo trae el precio Familiar ($1.940); el hook cobra
  el del tamaño (`c_pjExtraPrices` = `{"medium":1450,"family":1940,"extra_large":2290}`). Los ingredientes que
  no son extra pagado (salsas base, «Sin …», «Poca …») valen $0.
- **Ingredientes:** productos `ing-<id>` (foto, `c_pjUnavailableForHalves`, `c_pjIngredientGroup`,
  `c_pjPriceModifier`). El `<id>` es el mismo de `c_pjBaseIngredients`, `c_pjRemoved` y `pjExtras_<id>`.
- **Inventario por tienda:** `inventory_pj_48` (El Bosque), `inventory_pj_9` (Salvador), `inventory_pj_2`
  (Providencia), asignados a su tienda. `ing-champinon` está agotado en El Bosque (caso 6).
- **Mitades:** `pz-mitades-<size>-<crust>` con atributos de línea `c_pjHalves` y `c_pjParts`. Precio = promedio
  (hook). Pan Pizza y Croissant se rechazan como mitad (hook).
- **Combos:** productos simples de precio fijo; la elección viaja en el atributo de línea `c_pjComboChoices`
  (`[{"slot":"pizza1","product":"pz-pollo-bbq-family-traditional"},…]`), validado contra `c_pjSlots`.
  El sitio permite líneas repetidas (`AddProductToBasketBehavior = AllowRepeats`).

### Promociones (contrato §4.2)

Campaña `pj-demo`: `pj-hazlo-combo` (pizza + Palitos de Ajo + bebida 1,5 L: los dos últimos a $6.990 en total)
y `pj-super-duo-pickup` (apagada). Las de DAT-08 se agregan aquí.

DAT-11 (S-D20): `pj-super-duo` (2 familiares = $22.590) y `pj-super-trio` (3 familiares = $33.900) se aplican a
las líneas de pizza con la opción **`pjCombo` = `duo` | `trio`** (precio $0), sin cupón. Entran las 6 pizzas de
`c_pjSlots` en masas sin recargo (tradicional, delgada, parmesano). «Total fixed price» no toca las opciones:
los extras `pjExtras_*` se cobran encima. `pj-canje-puntos`: cupón `PJ-CANJE-PUNTOS`, deja en $0 una mediana
canjeable (Super Pepperoni, Boom de Jamón, Napolitana Caprese), una por pedido. Medio de pago `PJ_CASH`.

### Tiendas (contrato §4.3)

`pj-48` El Bosque (abierta, 15 min), `pj-9` Salvador (abierta, 35 min), `pj-2` Providencia (`c_pjClosed=true`,
abre 12:00). Atributos `c_pjPickupMinutes`, `c_pjDeliveryMinutes`, `c_pjOpenUntil`, `c_pjOpensAt`, `c_pjCash`,
`c_pjClosed`. Envíos: `005` retiro ($0) y `001` delivery ($1.990, `c_pjMinOrder` = 12000).

### Clientes de demo (contrato §3)

Contraseña de todos: **`PapaDemo2026`** (cuentas ficticias `@demo.pj.cl` del sandbox).

| Login | Puntos | Pedidos | Grupo |
|---|---|---|---|
| `sofia@demo.pj.cl` | 340 | 6 (el último, 2-oct, canónico $23.890) | `pj-frecuente` |
| `diego@demo.pj.cl` | 0 | 0 | `pj-anuncio` (dinámico por source code `PJSD26`) |
| `valentina@demo.pj.cl` | 40, puntos dobles | 1 (nov-2024) | `pj-reactivacion` |
| `val1..3@demo.pj.cl`, `dev-<código>@demo.pj.cl` | 340 | 6, como Sofía | `pj-frecuente` |

La fecha real de creación de un pedido no se puede cambiar: la fecha visible de cada pedido histórico está en
`c_pjPlacedAt`, y su estado en `c_pjStatus` (`retirado` / `entregado`).

## Cuidado

- **Hooks de SCAPI:** necesitan el feature switch *Administration > Global Preferences > Feature Switches >
  Enable Salesforce Commerce Cloud API hook execution*. Sin él, el precio de mitades, el extra por tamaño,
  el rechazo de mitades inválidas, el pedido mínimo y la colocación automática del pedido no corren.
- **Caché de SCAPI:** las respuestas se cachean por combinación de parámetros; tras un import, verifica con una
  combinación nueva (por ejemplo, sin `personalized=none`).
- **Imports:** son *merge*. Lo que se borra del build no desaparece solo (por eso las asignaciones viejas de
  pizzas se borran explícitamente con `mode="delete"`).
- **XML de B2C:** los valores de opción y los métodos de envío necesitan `default` explícito; los atributos
  `datetime` se importan con zona `+0000`; cada opción necesita un atributo de producto con su mismo ID.
- **Fotos sin versión grande o sin versión sin texto:** ver `SMALL_OR_TEXT` en `build_site.py`.
