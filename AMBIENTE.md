# Ambiente de la demo Papa Johns Chile · cómo reconstruirlo

- **Actualizado:** 18-nov-2026
- **Por qué existe:** el 18-nov se borró el sandbox `zyfj-001`, donde corría la demo. Este documento reúne lo que se configuró en ese ambiente entre el 16-oct y el 07-nov. Sale del repo y del historial de las sesiones de construcción. Sirve para levantar un sandbox nuevo sin depender de la memoria de nadie.
- **Alcance:** sandbox B2C Commerce (ODS), Account Manager, SLAS, Business Manager, cartuchos, datos del sitio y Managed Runtime (MRT) con Storefront Next.
- **Regla:** este documento no lleva secretos. Las claves viven en `dw.json` (raíz de `papapizza/`) y en `storefront/.env`, ninguno versionado.

## 0. Resumen: qué se reconstruye solo y qué es manual

| Pieza | Cómo se recrea | Automatizado |
|---|---|---|
| Sandbox ODS | `b2c sandbox create` (§2) | ✅ CLI |
| Permisos OCAPI Data y WebDAV del API client de `dw.json` | `--permissions-client-id` / `--ocapi-settings` / `--webdav-settings` al crear el sandbox; el site import reescribe los de OCAPI (§3.4) | ✅ CLI + import |
| Sitio `PapaJohnsCL`: catálogo, precios, inventario, tiendas, metadata, promociones, cupones, grupos, source codes, envíos, impuestos, pagos, preferencias, cartridge path, job de reindexación | `site-data/rebuild.sh` (§5) | ✅ repo |
| Cartucho `int_papajohns_demo` (hooks) | `rebuild.sh`, paso 2 | ✅ repo |
| Cartucho `app_storefrontnext_base` (metadata de Page Designer) y contenido de la Home | `pnpm cartridge:generate` + `pnpm cartridge:deploy` + import de su `staticfiles` (§6) | ⚠️ semi: el import de la librería es manual |
| Clientes de demo, puntos, direcciones, tarjeta y pedidos | `site-data/ocapi/customers.py` (dentro de `rebuild.sh`) | ✅ repo |
| Super Dúo/Trío, canje, `PJ_CASH` (DAT-11) | Dentro de `build_site.py`. `dat11.py` solo lo reaplica | ✅ repo |
| Feature switch de hooks de SCAPI | Business Manager (§4.1) | ❌ manual. No es importable |
| Clientes SLAS y sus scopes | `b2c slas client create` (§3.3) | ✅ CLI, con los valores de este documento |
| «Enable Email Verification» (ingreso con código) | Business Manager (§4.2) | ❌ manual. Nunca se activó en `zyfj-001` |
| Proyecto y ambiente de MRT con eCDN | Asistente de Storefront Next en BM / MRT (§7) | ❌ manual |
| Variables del storefront (`.env`) y de MRT | Editar `.env` + `pnpm config:push-env` (§7.3) | ⚠️ semi |

## 1. Inventario del ambiente borrado (`zyfj-001`)

Valores públicos o identificadores, sin secretos. Con el sandbox nuevo **todos cambian**; la columna «Dónde está escrito» dice qué archivo actualizar.

| Concepto | Valor en `zyfj-001` | Dónde está escrito |
|---|---|---|
| Realm / instancia | `zyfj` / `zyfj-001.dx.commercecloud.salesforce.com` | `dw.json` (`hostname`) |
| Organización SCAPI | `f_ecom_zyfj_001` | `.env` (`PUBLIC__app__commerce__api__organizationId`), `site-data/ocapi/pj.py` (`ORG`) |
| Short code SCAPI | `2362k62d` | `.env` (`…__shortCode`), `site-data/ocapi/pj.py` (`SHORT_CODE`) |
| Tenant SLAS | `zyfj_001` | Parámetro `--tenant-id` del CLI |
| Code version activa | `SFRA_UPC_08_21_2026` (venía con el sandbox; `dw.json` decía `develop`) | `site-data/rebuild.sh` (`PJ_CODE_VERSION`), `dw.json` (`code-version`) |
| API client de `dw.json` (CLI, OCAPI Data, WebDAV, import) | `a7708868-…` | `dw.json` (`client-id`, `client-secret`) |
| API client de servidor (OCAPI desde el storefront y despliegue a MRT con `--mrt-backend scapi`) | `25208e59-…` | `.env` (`SFCC_OAUTH_CLIENT_ID`, `SFCC_OAUTH_CLIENT_SECRET`) |
| SLAS privado del storefront | `09a63d7a-…` (`privateKeyEnabled=true`) | `.env` (`PUBLIC__app__commerce__api__clientId`, `COMMERCE_API_SLAS_SECRET`) |
| SLAS público con PKCE (scripts de datos y pruebas) | `313c6a6e-…`, redirect `http://localhost:5173/callback` | `site-data/ocapi/pj.py` (`SLAS_CLIENT`, `REDIRECT`) |
| Usuario de BM | El de `dw.json` (`username`) | `dw.json` |
| Sitio | `PapaJohnsCL` (alias `Sites-PapaJohnsCL-Site`), locale `es_CL`, moneda CLP, zona `America/Santiago` | `build_site.py`, `config.server.ts` (`siteAliasMap: { PapaJohnsCL: 'cl' }`), `.env` (`PUBLIC__app__commerce__sites`) |
| Librería | `PapaJohnsCLLibrary` (compartida) | `build_site.py` (`LIBRARY`) |
| Cartridge path | `int_papajohns_demo:app_storefrontnext_base:app_storefront_base` | `build_site.py` (`CARTRIDGES`, va en `site.xml`) |
| Proyecto / ambiente MRT | `sfnext-pizza-6ba5ff` / `sfnext-piz-1af0959c` (arm64, Node 24, eCDN) | `.env` (`MRT_PROJECT`, `MRT_TARGET`) |
| URL pública (eCDN) | `https://sfnextpiz1af0959c456da71a.zyfj-001.my.commercecloud.salesforce.com/cl/es-CL/` | `preventa/README.md`, `preventa/demo/PLAN.md` |
| Origen MRT (no se usa directo) | `sfnext-pizza-6ba5ff-sfnext-piz-1af0959c.sfdc-8tgtt5-ecom1.exp-delivery.com`, que responde 403 por diseño: solo acepta tráfico de eCDN | — |
| Último bundle | 6 (commit `e4da058`, 07-nov) | — |

**Datos de prueba que quedaron en `zyfj-001` y no se recrean:** `ZZ_PRUEBA_DELIVERY_TRAMOS` (envío offline), `ZZ_PRUEBA_250K` (cupón de 250.000 códigos, prueba del 27-oct) y la librería huérfana `PapaJohnsCL`. No hace falta recrearlos.

## 2. Crear el sandbox

```bash
cd storefront
pnpm -s b2c sandbox create --realm zyfj --profile medium \
  --ttl 0 \                                   # sin vencimiento; el valor por defecto es 24 h
  --permissions-client-id <client-id de dw.json> --set-permissions \
  --emails <correos del equipo> --wait \
  --config ../dw.json --dotenv-file=
pnpm -s b2c sandbox list --config ../dw.json --dotenv-file=
```

- **TTL:** el CLI crea los sandboxes con 24 h de vida por defecto. Hay que revisar si el realm permite `--ttl 0`. Si no lo permite, conviene programar `b2c sandbox update` para extenderlo y `--auto-scheduled` para apagarlo de noche sin perderlo. La demo debe seguir viva al menos 2 semanas después del 20-nov (T-59).
- **Permisos:** `--set-permissions` da al API client los permisos por defecto de OCAPI y WebDAV. Así funcionan `b2c code deploy`, `b2c webdav` y `b2c job import` desde el primer momento. Después, el import del sitio deja el permiso amplio de OCAPI Data que usan los scripts (`/**` con `get/post/put/patch/delete`, `read_attributes` y `write_attributes` `(**)`).
- **Code version:** el sandbox nuevo no traerá `SFRA_UPC_08_21_2026`. Hay que crear y activar una propia, por ejemplo `pj_demo`: `b2c code deploy … -v pj_demo --activate`. Luego se usa en `PJ_CODE_VERSION` y en `dw.json`, para que ambos digan lo mismo.
- **`app_storefront_base`:** está en el cartridge path porque `zyfj-001` traía SFRA. Desde el 18-nov el cartucho trae los 4 módulos de SFRA que usa, así que se puede quitar de `CARTRIDGES`.

## 3. Account Manager y SLAS

### 3.1 API client de `dw.json` (herramientas)

- **Uso:** CLI `b2c`, OCAPI Data (`site-data/ocapi/pj.py`, token `client_credentials` contra `https://account.demandware.com/dwsso/oauth2/access_token`), WebDAV e import y export de jobs.
- **En Account Manager:** el cliente tiene que estar asignado a la organización del realm y tener los roles de API de B2C Commerce para la instancia nueva, con su filtro de tenant.
- **Si WebDAV u OCAPI responden 401,** la clave venció: se renueva en `dw.json`. Para WebDAV también sirve `--auth-methods client-credentials`.

### 3.2 API client de servidor (storefront y MRT)

- **Uso actual:** solo el despliegue a MRT con `--mrt-backend scapi`. El bundle quedó firmado por `scapi-25208e59-…@salesforce.com`. El CLI de Storefront Next lee `SFCC_CLIENT_ID`, `SFCC_CLIENT_SECRET`, `SFCC_SHORTCODE` y `SFCC_TENANT_ID` (`docs/README-CONFIG.md`).
- **Hoy no necesita permisos de OCAPI:** ningún archivo de `src/` llama a OCAPI. Las rutas `/resource/pj-demo/*` (puntos, estado del pedido, tienda cerrada; CONTRATO §4.6), que lo usarían, no se construyeron. Si se construyen, hay que agregarle los recursos de §3.4 que escriben pedidos y clientes.

### 3.4 Permisos de OCAPI y WebDAV

Solo los necesita el **API client de `dw.json`**. El storefront usa SCAPI con SLAS; OCAPI **Shop** no se usa. Los hooks `dw.ocapi.shop.*` del cartucho son puntos de extensión que SCAPI también ejecuta, no permisos.

**Qué se usó en `zyfj-001`, por herramienta:**

| Quién | Recurso OCAPI Data | Métodos |
|---|---|---|
| `pj.site_import` y `b2c job import` / `job run` (import y reindexación) | `/jobs/*/executions`, `/jobs/*/executions/*` | post, get |
| `b2c job search` / `job log` | `/job_execution_search` | post |
| `b2c code deploy` / `code list` (activar code version) | `/code_versions`, `/code_versions/*` | get, patch |
| `customers.py` (puntos, favoritas, doble puntaje) | `/customer_lists/*/customers/*` | get, patch |
| `customers.py` (grupos estáticos de Sofía y Valentina) | `/sites/*/customer_groups/*`, `/sites/*/customer_groups/*/members/*` | get, put |
| `customers.py` (historial: atributos y estado de los pedidos) | `/sites/*/orders/*` (solo patch: **no acepta get**), `/sites/*/orders/*/status` | patch, put |
| `verify.py` (comprobaciones) | `/sites`, `/sites/*/promotions/*`, `/sites/*/source_code_groups/*`, `/sites/*/coupons/*` | get |
| Mantenimiento de promociones (memoria DAT-11) | `/sites/*/promotion_search`, `/sites/*/promotions/*` | post, delete |

**Configuración elegida para la demo (18-nov): amplia.** Es la que funcionó en `zyfj-001` y evita que BM rechace métodos recurso por recurso. La versión con lo mínimo necesario queda en la tabla de arriba para un ambiente de proyecto. Al validarla, BM rechazó `get` en `/sites/*/orders/*`, que solo acepta `patch`.

OCAPI Data (*Administration › Site Development › Open Commerce API Settings*, tipo **Data**, contexto **Global**). Es lo mismo que genera `ocapi_settings()` en `build_site.py`:

```json
{
  "_v": "19.5",
  "clients": [{
    "client_id": "<client-id de dw.json>",
    "resources": [{"resource_id": "/**", "methods": ["get", "post", "put", "patch", "delete"], "read_attributes": "(**)", "write_attributes": "(**)"}]
  }]
}
```

WebDAV (*Administration › Organization › WebDAV Client Permissions*). No admite comodín: cada carpeta raíz se declara aparte. Los logs se dan de solo lectura. `/temp` no es una ruta válida en esta pantalla (BM la rechazó el 18-nov):

```json
{
  "clients": [{
    "client_id": "<client-id de dw.json>",
    "permissions": [
      {"path": "/impex",       "operations": ["read_write"]},
      {"path": "/cartridges",  "operations": ["read_write"]},
      {"path": "/static",      "operations": ["read_write"]},
      {"path": "/catalogs",    "operations": ["read_write"]},
      {"path": "/libraries",   "operations": ["read_write"]},
      {"path": "/dynamic",     "operations": ["read_write"]},
      {"path": "/logs",        "operations": ["read"]},
      {"path": "/securitylogs","operations": ["read"]}
    ]
  }]
}
```

Lo que de verdad usaron las herramientas: `/impex` (zip del import), `/cartridges` (`code deploy`) y `/logs` (log de los jobs). El resto queda por comodidad en la demo.

**El orden importa (problema del huevo y la gallina):** el import que trae `wapi_data_config.json` necesita que el cliente **ya** pueda subir el zip por WebDAV y lanzar `/jobs/*/executions`. Por eso:

1. Al crear el sandbox, `--set-permissions --permissions-client-id <client-id>` da los permisos por defecto de OCAPI y WebDAV. Si se quiere fijar desde el inicio, se pasan los JSON de arriba con `--ocapi-settings` y `--webdav-settings`.
2. Si el sandbox ya existe sin permisos, se pegan en BM: *Administration › Site Development › Open Commerce API Settings* (tipo **Data**, contexto **Global**) y *Administration › Organization › WebDAV Client Permissions*.
3. Desde ahí, `rebuild.sh` funciona. **Ojo:** el import **reemplaza** la configuración global de OCAPI Data por la del archivo. Si en el sandbox hay otros clientes con permisos (por ejemplo, de otro equipo), hay que agregarlos en `ocapi_settings()` o se pierden.

**Cómo verificarlo:** `pnpm -s b2c code list --config ../dw.json --dotenv-file=` (OCAPI) y `pnpm -s b2c webdav ls -r impex --config ../dw.json --dotenv-file=` (WebDAV). Si responden 401, la clave venció; si responden 403, falta el permiso.

### 3.3 Clientes SLAS

Se crean con el CLI y se anotan en `.env` y `pj.py`:

```bash
# Privado: el storefront (SSR)
pnpm -s b2c slas client create --tenant-id <tenant> --short-code <short> \
  --name pj-storefront --channels PapaJohnsCL \
  --default-scopes --scopes sfcc.shopper-context.rw \
  --redirect-uri https://<host-ecdn>/callback,http://localhost:5173/callback \
  --callback-uri https://<host-ecdn>/callback,http://localhost:5173/callback \
  --config ../dw.json --dotenv-file=

# Público con PKCE: scripts de datos (pj.py) y pruebas
pnpm -s b2c slas client create --public --tenant-id <tenant> --short-code <short> \
  --name pj-scripts --channels PapaJohnsCL --default-scopes \
  --redirect-uri http://localhost:5173/callback \
  --config ../dw.json --dotenv-file=
```

- **Scopes del cliente privado del storefront (18-nov):** `sfcc.session_bridge sfcc.shopper-experience sfcc.shopper-experience.qualifiers sfcc.shopper-standard sfcc.pwdless_login sfcc.shopper-context.rw`. `sfcc.shopper-standard` cubre productos, búsqueda, carrito, pedidos y cuenta. **`sfcc.shopper-experience` es aparte** (no lo cubre `.qualifiers`): sin él, SCAPI responde 403 a los componentes `header` y `mega-menu` de Page Designer, aunque la página cargue.
- **`sfcc.shopper-context.rw` es obligatorio.** Sin ese scope, el source code `PJSD26` (Diego, anuncio del Super Dúo) no llega a la sesión ni activa el grupo `pj-anuncio`. En `zyfj-001` faltaba y Raúl lo agregó el 07-nov.
- Hay que confirmar con `b2c slas client get <id> --tenant-id … --short-code …` que los scopes quedaron bien.
- Los puertos de los worktrees (5174–5186) solo hacen falta como redirect si se prueba el login en ellos.

## 4. Business Manager: lo que no se puede importar

| # | Dónde | Qué | Sin esto |
|---|---|---|---|
| 4.1 | *Administration › Global Preferences › Feature Switches* | **«Enable Salesforce Commerce Cloud API hook execution»** | SCAPI no ejecuta los hooks del cartucho: no hay precio de mitades ($17.900), extras por tamaño, validación de combos, rechazo de Pan Pizza o Croissant como mitad ni pedido mínimo de delivery. El 06-nov se perdió tiempo creyendo que el hook no estaba registrado |
| 4.2 | Preferencias de login del sitio | **«Enable Email Verification»** (BI-05) | `/login` queda con correo y contraseña en lugar del ingreso con código (`PUBLIC__app__features__passwordlessLogin__*`) |
| 4.3 | — | Promoción `pj-bin-banco` con la lista `c_pjBinList` (CONTRATO §4.2) | **No existe en el repo** (ni en `build_site.py`, ni en los scripts, ni en el storefront): nunca se construyó. Si el panel la necesita, hay que crearla en `build_site.py`, no a mano |
| 4.4 | Roles del usuario de BM | Acceso al sitio `PapaJohnsCL` y a Page Designer | No se puede editar la Home ni revisar el contenido |

## 5. Datos del sitio (desde el repo)

```bash
cd storefront
# 0. Actualizar lo que depende de la instancia: dw.json, .env, pj.py (§1) y PJ_CODE_VERSION
export PJ_CODE_VERSION=<code version del paso 2>
site-data/rebuild.sh                       # archivo del sitio → cartucho → import → reindex → clientes
python3 site-data/ocapi/verify.py          # en zyfj-001 quedó en 43/43 (DAT-02/03/04/11) con los hooks activos
```

Lo que hay que saber del import (aprendido en `zyfj-001`):

- Todos los comandos del CLI llevan `--config ../dw.json --dotenv-file=`.
- El job puede decir OK aunque haya fallado una parte, así que hay que leer siempre el log: `pnpm b2c job log` o `pnpm b2c webdav get jobs/sfcc-site-archive-import/… --root logs`. Bajarlo por WebDAV directo da 403.
- **Librería:** siempre `PapaJohnsCLLibrary`. Con otro ID, Page Designer no encuentra los tipos («No matching page type found»).
- **Métodos de envío:** sin `default="false"` el import falla con «Internal bulker runtime exception». No aceptan `mode="delete"`: se borran en BM.
- **Orden dentro de los XML:** en `promotions.xml` van todas las `<promotion>` antes de las asignaciones a campaña, y en `payment-methods.xml` los métodos van antes de `payment-card`. `build_site.py` ya lo respeta.
- **Promociones por OCAPI:** no existe la colección `/promotions`. Se usa `promotion_search`, y para borrar `DELETE /sites/{site}/promotions/{id}`.
- **Cupones masivos:** van en `<coupon-codes coupon-id>`, sin tope. 250.000 códigos se importan en unos 2,5 minutos.
- **Caché de SCAPI:** el storefront pide categorías con `personalized=none`, que queda en caché. Para verificar un import, consultar sin ese parámetro.
- **Horarios de promociones:** se exportan con hora en `Z`. Revisar la zona del sitio (`America/Santiago`).
- **Fotos:** se descargan una vez de papajohns.cl a `site-data/.cache/images`, que no se versiona. Las de los combos están en `site-data/assets/combos/` (versionadas; se regeneran con `compose_combo_images.py`, que requiere Pillow).
- **Dependencias:** el repo exige paquetes publicados hace ≥ 48 h (`minimumReleaseAge 2880`). No hay que saltarse esa política.

## 6. Page Designer (Home, encabezado y mega-menú)

```bash
cd storefront
pnpm cartridge:generate        # regenera cartridges/app_storefrontnext_base/cartridge/experience/** desde los @Component
pnpm cartridge:validate
pnpm cartridge:deploy -- -v <code version> --config ../dw.json --dotenv-file=
```

- El contenido (páginas y componentes con su segmentación por grupo `pj-frecuente`, `pj-anuncio` y `pj-reactivacion`) está en `cartridges/app_storefrontnext_base/staticfiles/cartridge/impex/default/sites/SITEID/library/library.xml`. Para importarlo hay que cambiar `SITEID` por `PapaJohnsCL` y la librería por `PapaJohnsCLLibrary`, y luego pasarlo por `pj.site_import(carpeta)` o por `b2c job import`. **Este paso nunca quedó en `rebuild.sh` (BI-40); ver §9, mejora 3.**
- `build_site.py` también genera una librería con los slides del hero y las tarjetas del mega-menú (`libraries/PapaJohnsCLLibrary/library.xml`). Hay que comprobar que los dos imports no se pisen.
- En los componentes con `@Component`, los tipos se importan con `import type` separado y los loaders desde `./loaders`, nunca `*.server` directo. Si no, `pnpm build` falla aunque `pnpm dev` funcione.

## 7. Managed Runtime con Storefront Next

### 7.1 Crear el ambiente

`sfnext-pizza-6ba5ff` / `sfnext-piz-1af0959c` lo creó Raúl el 06-nov, cerca de las 20:00 (hora de Chile), con el asistente de Storefront Next («quick start bundle»). El ambiente quedó **ligado a la instancia** con eCDN (`configured_cdn: ecdn`) y un hostname `*.zyfj-001.my.commercecloud.salesforce.com`. **Con el sandbox borrado ese ambiente ya no tiene backend:** hay que crear uno nuevo ligado a la instancia nueva y anotar:

- `MRT_PROJECT` y `MRT_TARGET` (o `MRT_ENVIRONMENT`) en `.env`;
- el hostname de eCDN que entrega el asistente (será la URL de la demo);
- ese mismo hostname como redirect y callback de SLAS (§3.3).

> Falta documentar: la ruta exacta en BM o MRT del asistente y las opciones elegidas. La sesión en que se hizo no quedó registrada. **Al recrearlo, anotar cada pantalla aquí.**

### 7.2 Desplegar

```bash
cd storefront
pnpm build                                   # obligatorio: en la práctica sfnext push subió el build/ que había (bundle 3, 07-nov: 502 en /menu y /promos)
SFNEXT_DATA_STORE_UNAVAILABLE_MODE=fallback npx sfnext preview -p 3017
#   probar: /cl/es-CL/  /menu  /promos  /promos/super-duo  /mitades  /p/pz-pollo-bbq  /p/cb-pizza-del-mes  /store-locator  /cart
pnpm sfnext push --mrt-backend scapi --wait --message "<qué cambia>"
```

- `--mrt-backend scapi` se autentica con OAuth de Account Manager (cliente de §3.2) y sube el bundle por SCAPI (`Uploading bundle via SCAPI (<short code>)`). La alternativa `legacy` usa la llave de MRT en `~/.mobify` (`b2c mrt save-credentials`).
- Cada despliegue tarda entre 2 y 2,5 minutos (`in_progress` → `finished`).
- La vista previa por http no guarda las cookies `Secure` (perfil y canasta). Los flujos con sesión se prueban en `pnpm dev` (puerto 5173) o en el sitio público.
- El puerto 3000 lo ocupa otra app local; por eso se usa el 3017.
- Logs en vivo: `pnpm b2c mrt tail-logs`.
- Si cambian los hooks, el cartucho se despliega aparte (`rebuild.sh` paso 2 o `b2c code deploy cartridges -c int_papajohns_demo -v <cv>`).

### 7.3 Variables

| Variable | Valor | Nota |
|---|---|---|
| `PUBLIC__app__commerce__api__clientId` | SLAS privado (§3.3) | |
| `PUBLIC__app__commerce__api__organizationId` | `f_ecom_<realm>_<nnn>` | |
| `PUBLIC__app__commerce__api__shortCode` | Short code de la instancia | |
| `PUBLIC__app__commerce__api__privateKeyEnabled` | `true` | Con `COMMERCE_API_SLAS_SECRET` |
| `PUBLIC__app__commerce__api__proxy` / `__callback` | `/mobify/proxy/api` / `/callback` | |
| `PUBLIC__app__defaultSiteId`, `PUBLIC__app__commerce__sites` | `PapaJohnsCL`, JSON del sitio con `es-CL` y CLP | Copiar del `.env` actual |
| `PUBLIC__app__features__passwordlessLogin__*` | `enabled=true`, `mode=email` | Requiere §4.2 |
| `PUBLIC__app__features__socialLogin__enabled` | Hoy `true`; **poner `false`** | La demo no muestra Apple ni Google |
| `PUBLIC__app__features__shopperContext__enabled` | Hoy `false` | Revisar al activar §3.3 |
| `PUBLIC__app__features__googleCloudAPI__apiKey` | Opcional | Sin llave, delivery usa el respaldo local de direcciones |
| `SFCC_OAUTH_CLIENT_ID` / `_SECRET` | Cliente de §3.2 | Solo servidor; nunca con `PUBLIC__` |
| `COMMERCE_API_SLAS_SECRET` | Secreto del SLAS privado | |
| `MRT_PROJECT`, `MRT_TARGET` | §7.1 | |

En MRT, las variables de servidor se suben con `pnpm config:push-env` (`b2c mrt env var push`). Para ver la configuración resultante: `pnpm config:inspect`.

## 8. Comprobación final (en este orden)

1. `pnpm -s b2c code list` → la code version activa es la del cartucho.
2. `python3 site-data/ocapi/verify.py` → todo OK. Si fallan las mitades o los extras por tamaño, falta el feature switch (§4.1).
3. `pnpm dev` y entrar a `http://localhost:5173/cl/es-CL/?perfil=sofia`, `?perfil=diego` y `?perfil=valentina`.
4. Sofía: login → carrito → canje (pedido canónico $23.890) → checkout → confirmación.
5. Diego: `?utm_campaign=PJSD26` → Super Dúo $22.590 (y con extras, $24.530).
6. `pnpm build` + `preview -p 3017` → push → mismas rutas en la URL de eCDN.

## 9. Mejoras para que la próxima vez sea un solo comando

Estas mejoras están propuestas y no aplicadas: sin sandbox no se pueden probar.

1. **Un solo origen de los valores de la instancia.** Hoy `ORG`, `SHORT_CODE` y `SLAS_CLIENT` están fijos en `site-data/ocapi/pj.py`. Conviene que los lea de `storefront/.env` (`PUBLIC__app__commerce__api__*`) y que `rebuild.sh` exija `PJ_CODE_VERSION`, sin el valor por defecto `SFRA_UPC_08_21_2026`.
2. **Permisos de OCAPI como archivo versionado.** Sacar de `ocapi_settings()` el comodín `/**` y versionar los JSON de §3.4 (OCAPI y WebDAV) para pasarlos a `b2c sandbox create --ocapi-settings/--webdav-settings`. Si se construyen las rutas `/resource/pj-demo/*`, agregar ahí el cliente `SFCC_OAUTH_CLIENT_ID` con solo los recursos que escriben pedidos y clientes.
3. **Page Designer dentro de `rebuild.sh`:** `cartridge:generate` y `cartridge:deploy`, más el import del `library.xml` de `staticfiles` con el `SITEID` reemplazado (cierra BI-40).
4. **Script `bootstrap.sh`** que encadene: sandbox (§2), clientes SLAS (§3.3), escritura de `.env` y `dw.json` con los valores nuevos, `rebuild.sh`, `verify.py` y un recordatorio de los pasos manuales de §4 y §7.1.
5. **Exportar el sandbox con regularidad:** correr `site-data/export_sandbox.sh <carpeta>` antes de cada hito (ya existe; la última foto es `reference/sandbox-2026-11-06`). Además, revisar el TTL con `b2c sandbox get`.
6. **Credenciales fuera de la máquina de una persona:** guardar `dw.json` y `.env` en el gestor de secretos del equipo, con este documento como índice de qué va en cada uno.

## 10. Bitácora de la reconstrucción (18-nov-2026)

El sandbox nuevo conservó hostname (`zyfj-001`), organización, short code y tenant SLAS: los clientes `313c6a6e…` y `09a63d7a…` siguieron vivos. La code version activa es `version1`, vacía. También aparecieron los sitios de SFRA `RefArch` y `RefArchGlobal`.

| Paso | Resultado | Qué se corrigió en el repo |
|---|---|---|
| Permisos OCAPI y WebDAV | Pegados en BM (§3.4). BM rechazó `get` en `/sites/*/orders/*` y la ruta `/temp` de WebDAV | §3.4 |
| `rebuild.sh` | Falló en el paso 2: ponía `--config` antes del subcomando y el CLI lo rechaza. **Nunca había corrido de punta a punta** | `rebuild.sh`: los flags van al final (`CFG`) |
| Import, primera vez | «OK» con 3 errores y 35 avisos: faltaban `countryCode` (preferencia), `showInMenu` (categoría), `storePickupEnabled` y `estimatedArrivalTime` (métodos de envío). En `zyfj-001` venían de la metadata de SFRA | `build_site.py`: `CATEGORY_ATTRS`, `SITE_PREF_ATTRS` y los dos atributos de envío |
| Page Designer | «No matching page type»: faltaba `app_storefrontnext_base` en la code version | Se desplegó con `b2c code deploy cartridges -c app_storefrontnext_base -v version1` **antes** del import |
| Librería | El import no puede asignar una librería compartida a un sitio (ni `site.xml` ni `library.xml` lo permiten); el sitio nace con librería privada. Luego la `homepage` respondió por SCAPI (`typeId homePage`) | — |
| Import, segunda vez | 0 errores; 399 s | — |
| `customers.py` | Un cliente recién registrado da 400 «Invalid Customer» con el primer token; esperar con el mismo token no sirve | `customers.py`: espera 10 s y vuelve a hacer login (1 reintento bastó en los 18 clientes) |
| `verify.py` | 65/70: fallan DAT-03.1 y DAT-04.2/3/4 (hooks), porque falta el feature switch | Raúl activó el feature switch de hooks de SCAPI (§4.1) |
| Hooks activos | 500 «Hook Execution Error»: `calculate.js` usaba módulos de SFRA (`util/collections`, `helpers/basketCalculationHelpers` → `helpers/hooks`, `hooks/taxes`) que en `zyfj-001` venían de `app_storefront_base` desplegado y aquí no existen. Visto en `error-odspod-0-appserver-*.log` | Los 4 módulos se copiaron sin cambios al cartucho (idénticos en tres proyectos SFRA 7.x). **El cartucho ya no depende de SFRA** |
| `verify.py` | **70/70** | — |
| MRT | El ambiente `sfnext-piz-1af0959c` siguió ligado a la instancia (mismo hostname): **no hubo que recrearlo**. Bundle 7 con `pnpm build` → vista previa en 3017 → `pnpm sfnext push --mrt-backend scapi --wait`; 12 rutas en 200 y la 404 en 404 en el sitio público | — |
| Shopper Experience ✅ | La vista previa registraba 403 de SCAPI en `shopper-experience/.../components/header` y `mega-menu` (las páginas cargan igual). Ya pasaba el 07-nov en `zyfj-001`. Causa: al cliente SLAS privado le faltaba `sfcc.shopper-experience` (tenía solo `.qualifiers`). Raúl lo agregó y la vista previa quedó con 0 errores | §3.3 |

Orden que funcionó: permisos → feature switch → `app_storefrontnext_base` → `PJ_CODE_VERSION=version1 site-data/rebuild.sh` → `verify.py` (70/70). Si un hook responde 500, el detalle está en el log de errores: `pnpm b2c webdav get error-odspod-0-appserver-<fecha>.log -r logs -o <archivo>`.
