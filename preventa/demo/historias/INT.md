# INT · Integrador (oleada 0)

Base que necesitan todos antes de construir en paralelo.

### INT-01 · Base visual del lienzo
- **Historia:** Como cliente de Papa Johns, quiero que la tienda se vea como el diseño aprobado, para reconocer la marca y que la comida destaque.
- **Pantallas:** todas, tomando los colores y la tipografía de `Home.dc.html` y `Menu.dc.html`:
  - Fondo crema `#FFFBF5`, verde `#1E4D33`, lima `#D7EA4A`, rojo oferta `#B3261E`, tinta `#1B1D1A`, gris `#5A5F57`.
  - Barlow Condensed 800 en mayúsculas para títulos y Barlow para texto.
- **Criterios:**
  1. Los tokens de `src/theme/tokens/*.css` usan los colores del lienzo, y Barlow / Barlow Condensed reemplazan a Geist en todo el sitio.
  2. Precio de oferta en `#B3261E`; botones y navegación en verde; estrellas `#8F5400`.
  3. Todos los textos cumplen 4,5:1 de contraste y las áreas táctiles son de al menos 44 px.
  4. Ninguna página del template queda con el estilo anterior: se revisan Home, PLP, PDP, carrito, checkout y cuenta.

### INT-02 · Layout: encabezado, barra inferior y punto de franja
- **Historia:** Como cliente, quiero moverme entre Inicio, Menú, Promos, Pedido y Cuenta con un toque, y ver siempre mi modalidad y tienda.
- **Pantallas:** encabezado y barra inferior de `Home.dc.html`, `Menu.dc.html` y `Home-Desktop.dc.html`; `Menu-EnCurso.dc.html` (lugar de la franja).
- **Criterios:**
  1. **Móvil:** barra inferior fija con cinco destinos con ícono y texto. El activo va en verde con una barra arriba, y «Pedido» muestra la cantidad de productos.
  2. **Escritorio:** encabezado verde con Menú, Promos y Papa Puntos; saludo con puntos si hay sesión; botón «Mi pedido · N».
  3. El encabezado tiene el punto de inserción `FulfillmentChip` (lo llena TIE) y sobre la barra inferior está el de `TrackingStrip` (lo llena SEG). Los dos quedan vacíos sin romper el layout.
  4. Se eliminan del template lo que el diseño no tiene (wishlist, selector de moneda o idioma visible, footer de retail genérico). El footer queda con redes de Chile y enlaces legales.

### INT-03 · Extensiones registradas
- **Criterios:**
  1. `src/extensions/config.json` registra `pj-shared`, `pj-home`, `pj-menu`, `pj-product`, `pj-offers`, `pj-store`, `pj-cart`, `pj-login`, `pj-checkout`, `pj-tracking`, `pj-account` y `pj-presenter`, cada una con su carpeta, `translations.json` es-CL vacío y `target-config.json`.
  2. `pnpm dev`, `pnpm typecheck` y `pnpm build` pasan con las extensiones vacías.

### INT-04 · Piezas compartidas
- **Criterios:**
  1. Existen en `pj-shared` las piezas de [CONTRATO §5](../CONTRATO.md), cada una con su historia de Storybook y pruebas de `points.ts`, `profile.ts`, `format.ts` y `fulfillment.ts`.
  2. `pointsFor(23890, 0) = 23`; con puntos dobles da 46; el despacho no suma.
  3. `?perfil=` y `?hora=` se guardan en cookie y `getDemoProfile` aplica la regla del contrato §2.
  4. `FoodImage` no se mueve si el sistema pide «reducir movimiento» y tiene botón de pausa cuando se anima.

### INT-05 · Worktrees y puertos
- **Criterios:**
  1. Hay un worktree por agente de la oleada, con `pnpm install` hecho y su puerto en `.env.local` (EQUIPO §4.1).
  2. La rama `demo` es la base y está en verde.
