# Encargo fijo de un agente constructor

Te lanzan con tu **código de agente** (HOM, MEN, PRO, OFE, TIE…), tus **historias**, tu **worktree** y tu **puerto**. Todo lo demás está aquí. Escribe y responde en español.

## 1. Lee primero (en este orden)

1. `demo/EQUIPO.md`: lo que es tuyo y lo que no.
2. `demo/CONTRATO.md`: nombres de datos. Lee completa la **§7** (cambios reales de DAT): manda sobre las secciones anteriores.
3. `demo/historias/README.md`: objetivos de la demo. Lo principal: **que dé hambre**.
4. Tu archivo `demo/historias/<CÓDIGO>.md`: tus historias y criterios.
5. `storefront/CLAUDE.md` (estándar de Storefront Next) y `src/extensions/README.md`.
6. Por cada historia:
   - El MD del diseño (`disenos/<NN>/README.md`).
   - La pantalla del lienzo `disenos/_canvas/<Pantalla>.dc.html`. Es el respaldo exacto del lienzo aprobado. Ábrela en el navegador a 390 y 1440 px y léele el HTML.
   - **El texto que manda es el del lienzo**, salvo los supuestos S-D del contrato (S-D17).

Rutas base: `/Users/raulcalla/workdir/AVATAR/papapizza/` (los `demo/` y `disenos/` de arriba están ahí).

## 2. Ambiente

- Trabajas **solo** en tu worktree `/Users/raulcalla/workdir/AVATAR/papapizza/storefront-wt/<CÓDIGO>` (rama `hu/<CÓDIGO>`, ya con `node_modules`). No toques el storefront principal ni otros worktrees.
- Servidor de desarrollo en **tu puerto**: `pnpm dev -- --port <PUERTO>`, o la opción que acepte `sfnext dev`. Revisa `pnpm dev --help` si no arranca en ese puerto. Córrelo en segundo plano.
- Navegador: **solo instancias sin ventana** (`mcp__chrome-devtools-headless`, `-headless-2` o `-headless-3`), la que te asignen (cárgala con ToolSearch). **Nunca** `chrome-devtools`, `-2` ni `-3`, que abren ventana (pedido de Raúl, 06-nov). Antes de usarla: cierra las páginas que no sean tuyas, borra cookies y almacenamiento de tu origen y confirma que el carrito está vacío. Al terminar, cierra tus páginas. Si no te asignaron navegador, verifica con pruebas y `curl` del HTML que renderiza el servidor.
- **Datos:** el sandbox ya tiene catálogo, combos, tiendas, ingredientes y clientes (contrato §3 y §7).
  - Las credenciales de los clientes de demo están en `site-data/ocapi/` (busca la contraseña ahí). Usa tu cliente `dev-<código-en-minúsculas>@demo.pj.cl`; si no existe, usa `val1@demo.pj.cl`.
  - **No escribas en el sandbox**: eso es solo de DAT. Si te falta un dato, usa un mock en tu extensión y repórtalo como solicitud a DAT.
- **Bloqueos conocidos (no los arregles, trabaja alrededor):**
  - Los hooks de SCAPI están apagados en el sandbox, así que el precio de mitades ($17.900) y los extras por tamaño todavía no los calcula el carrito. Construye contra el contrato; el precio se verificará cuando Raúl active el switch.
  - El cliente SLAS no tiene el scope de Shopper Context, así que `PJSD26` no activa el grupo por source code. El perfil de la demo funciona igual con la cookie `pj_perfil` y `pj_campana` (middleware de INT).
- Política del repo: paquetes con ≥ 48 h publicados. No instales paquetes salvo que sea imprescindible, y si lo haces, repórtalo.

## 3. Lo que ya existe y debes usar (`src/extensions/pj-shared`)

Importa desde `@/extensions/pj-shared`. Las historias de Storybook están en `Extensions/Papa Johns/*`.

| Pieza | API |
|---|---|
| `PriceTag` | `{ price, listPrice?, showSavings=true, size='sm'\|'md'\|'lg', prefix?, className }`. Con `listPrice` mayor que `price`: precio en rojo, anterior tachado y «Ahorras $X» |
| `Stars` | `{ rating, count?, className }` → «★ 4,7 · 1.240 opiniones» |
| `PointsBadge` | `{ points, variant='earn'\|'pending' }` → «Ganas N Papa Puntos» / «+N por acreditar» |
| `FoodImage` | `{ src, alt, srcSet?, sizes?, aspect?, bleed?, shadow?, animate?, priority?, className, imgClassName }`. Con `animate`: movimiento lento y pausa; respeta «reducir movimiento». Usa `priority` en el hero (LCP) |
| `BottomSheet` | `{ open, onOpenChange, title, description?, children, footer?, hideTitle? }`. Hoja desde abajo en móvil y panel a la derecha desde `lg`. **Cárgala con `React.lazy`** |
| `AddedToast` | Se muestra con `showAddedToast(props, duration?)` (`lib/added-toast.tsx`); props `{ productName?, points?, onUndo?, orderHref='/cart' }` |
| `FulfillmentChip` | `{ top, bottom, to? \| onClick? }`. TIE lo registra en el target `pj.header.fulfillment` |
| `TrackingStrip` | `{ status, eta, step, steps=3, detail?, href }`. SEG lo registra en `pj.layout.tracking` |
| `lib/points.ts` | `pointsFor(total, shipping=0, doublePoints=false)`, `pointsToClp(points)` |
| `lib/format.ts` | `formatClp`, `formatCount`, `formatRating`, `formatTime`, `formatReadyAt`, `formatTimeWindow`, `formatAgo` |
| `lib/profile.ts` | `getDemoProfile(context)` → `'valentina'\|'diego'\|'sofia'`; `getDemoMoment(context)` → `'almuerzo'\|'partido'\|'celebracion'\|'bajon'\|null` |
| `lib/fulfillment.ts` | `getFulfillment(request)`, `serializeFulfillmentCookie`, `readFulfillmentFromDocument`, `writeFulfillmentToDocument`, `shippingFor`, `DELIVERY_FEE_CLP`, `DELIVERY_MINIMUM_CLP` |
| `lib/routes.ts` | `PJ_ROUTES`: `/menu`, `/promos`, `/cart`, `/account`, `/puntos`, `/seguimiento`, `/store-locator`. **Usa estas rutas exactas**: el encabezado y la barra inferior ya apuntan a ellas |
| Otros | `lib/targets.ts` (`PJ_TARGETS`), `lib/features.ts` (`PJ_FEATURES`), `hooks/use-pj-me.ts` (cliente, puntos), `hooks/use-reduced-motion.ts` |

**Tokens de Tailwind:** `bg-pj-green`, `text-pj-sale`, `rounded-pj-card`, `shadow-pj-card` y los demás `--pj-*` de `src/theme/tokens/pj.css`. Títulos en Barlow Condensed 800 en mayúsculas (ya es el estilo de `h1`/`h2`).

**i18n:** cada extensión tiene `locales/es-CL/translations.json` y `locales/en-GB/translations.json`. Mantén las dos con las mismas claves (en-GB puede repetir el español) y corre `pnpm locales:aggregate-extensions`.

## 4. Cómo trabajas

- Tu código va en tu extensión `src/extensions/pj-<área>/`: rutas, componentes, locales y `target-config.json`.
- Componentes de Page Designer con `@Component` donde haya contenido editable. Después: `pnpm cartridge:generate`. **No despliegues el cartucho**: reporta que hay que hacerlo.
- Cambios al core solo en los archivos que EQUIPO §3 te asigna, con marcadores `@sfdc-extension-*`.
- Por cada historia:
  1. Construye.
  2. Revisa en el navegador cada criterio a 390 y 1440 px contra la pantalla del lienzo.
  3. Corre `pnpm typecheck`, `pnpm lint` y `pnpm test` en verde. No borres ni reemplaces pruebas: agrega las tuyas.
  4. Haz un commit en `hu/<CÓDIGO>` con el ID (`HOM-02: …`), sin trailer de coautoría y sin push.
- Rendimiento: imágenes con `srcset`, el hero con `priority`, sin saltos de layout (skeleton del tamaño de la foto) y componentes pesados con `React.lazy`.
- Accesibilidad: botones y enlaces reales, `aria-label` en íconos, contraste ≥ 4,5:1 y áreas táctiles ≥ 44 px.

## 5. Informe final (tu respuesta)

1. Por historia: hecha o pendiente, con la evidencia de cada criterio.
3. Rutas que creaste.
4. **Solicitudes a DAT** (datos que faltan).
5. **Candidatos a `pj-shared`** (piezas que otro agente podría usar).
6. Cambios al core.
7. Lo que quedó pendiente y por qué.
