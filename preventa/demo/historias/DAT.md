# DAT · Datos y Commerce (oleadas 0 a 3)

Único agente que escribe en el sandbox. Todo lo que crea queda reproducible:
- Catálogo, precios, inventario y metadata → `site-data/build_site.py` + `b2c job import`.
- Contenido, promociones, clientes y preferencias → scripts OCAPI Data API en `site-data/ocapi/` con las credenciales de `dw.json`.

Al terminar cada historia, DAT actualiza [CONTRATO.md](../CONTRATO.md) si algún nombre cambió y lo avisa a INT.

### DAT-01 · El sitio se reconstruye desde el repo (oleada 0)
- **Criterios:**
  1. Las promociones, campañas, cupones y métodos de envío que hoy existen en el sandbox se exportan y quedan en `site-data/` o en scripts OCAPI.
  2. Un comando documentado en `site-data/README.md` deja el sitio igual desde cero.

### DAT-02 · Catálogo que da hambre (oleada 0)
- **Historia:** Como cliente, quiero ver cada producto con foto grande, texto sabroso, para cuántos y qué tan pedido es, para antojarme y decidir rápido.
- **Criterios:**
  1. Atributos del [contrato §4.1](../CONTRATO.md) creados y cargados: `c_pjKind`, `c_pjBadges`, `c_pjFoodType`, `c_pjSensory`, `c_pjServes`, `c_pjWeeklyOrders`, `c_pjRating`, `c_pjReviewCount`, `c_pjBaseIngredients`, `c_pjHalvesEnabled`, `c_pjRedeemPoints`.
  2. Subcategorías de pizzas: Clásicas, Favoritas, Premium, Pan Pizza y Croissant, con los productos de la tabla del diseño 02.
  3. **Fotos:** cada producto tiene su imagen en la mayor resolución del CDN de papajohns.cl (ancho ≥ 1200 px cuando exista) y sin texto incrustado. Si no hay versión grande, se informa la lista.
  4. Los textos sensoriales y las insignias igualan los del lienzo (`Menu.dc.html`, `PDP-Mobile.dc.html`).
  5. Shopper Search devuelve los nuevos atributos (se verifica con SCAPI, sin `personalized=none` para evitar la caché).

### DAT-03 · Ingredientes y extras como opciones (oleada 0)
- **Criterios:**
  1. Los 31 ingredientes de `datos/raw/ingredients.json` quedan como valores de la opción `pjExtras`, con su foto, precio por tamaño (Mediana $1.450 · Familiar $1.940 · Extra grande $2.290) y la marca `unavailable_for_halves`.
  2. Un carrito por SCAPI con Pollo BBQ Familiar + extra champiñón suma $16.900 + $1.940.
  3. El inventario por tienda permite dejar el champiñón **agotado en El Bosque** (caso 6, R4.6).

### DAT-04 · Pizza por mitades (oleada 0, Opus)
- **Criterios:**
  1. Producto `pz-mitades` con tamaño y masa.
  2. Hook en un cartucho propio (`int_papajohns_demo`, agregado al cartridge path) que fija el precio de la línea en el promedio de las especialidades de `c_pjHalves` (R2.1). Pollo BBQ + Todas las Carnes Familiar = **$17.900**.
  3. El precio se mantiene al recalcular el carrito, al cambiar la cantidad y en el pedido final.
  4. Pan Pizza y Croissant se rechazan como mitad.

### DAT-05 · Combos (oleada 0)
- **Criterios:**
  1. Los combos del [contrato §4.1](../CONTRATO.md) existen con precio, precio antes, `c_pjSlots`, `c_pjValidTo`, `c_pjDispatch` y `c_pjOccasion`:
     - `cb-super-duo`, `cb-super-trio`, `cb-papa-combo-palitos`, `cb-papa-flash` y `cb-papa-combo-postre`.
     - `cb-pizza-del-mes`: The Works Familiar a $10.990, antes desde $21.900, hasta el 7-dic.
     - `cb-box-halloween`, vencido el 2-nov.
     Los precios, las fotos y las vigencias salen de la API de papajohns.cl consultada el 06-nov.
  2. Las pizzas elegidas dentro del combo quedan en la línea del carrito y el precio del combo no cambia según la elección.
  3. El Super Dúo se vende con retiro y delivery. `pj-super-duo-pickup` (solo retiro) existe **apagada** y la activa el panel (S-D15).

### DAT-06 · Tiendas (oleada 0)
- **Criterios:**
  1. El Bosque abierta (15 min), Salvador abierta (35 min) y Providencia cerrada (abre 12:00), con los atributos del [contrato §4.3](../CONTRATO.md) y las coordenadas reales.
  2. Efectivo habilitado según la tienda (`c_pjCash`).
  3. Métodos de envío: retiro (por tienda) y delivery con despacho $1.990 y mínimo $12.000.

### DAT-07 · Clientes de demo (oleada 0)
- **Criterios:**
  1. Los clientes del [contrato §3](../CONTRATO.md) existen con perfil, puntos, movimientos, favoritas, dirección y grupos.
  2. **Sofía** tiene 6 pedidos reales en Commerce (el último, del 2 oct, es el pedido canónico del contrato §6), así «Repetir pedido» funciona con la API estándar. Tiene la tarjeta Visa ····4521 (BIN 424242) y el depto 504, como en el lienzo.
  3. Los grupos `pj-frecuente`, `pj-anuncio` y `pj-reactivacion` y el source code `PJSD26` funcionan.

### DAT-08 · Promociones de venta (oleada 1, para la oleada 2)
- **Criterios:**
  1. `pj-hazlo-combo` y `pj-combo-palitos-upsell` funcionan: pizza + Palitos de Ajo + Coca-Cola 1,5 L baja $2.490 (R2.2).
  2. `pj-canje-puntos` deja en $0 una pizza canjeable mediana (R1.8).
  3. `pj-bin-banco` aplica 20% con tope $5.000 al cupón interno `BINDEMO`, y la lista de BIN es la preferencia `c_pjBinList` (incluye `424242`) (R2.4).
  4. La gift card `PJ-GIFT-2026` tiene $10.000 (R2.5).

### DAT-09 · Medios de pago y pedido (oleada 1, para la oleada 2)
- **Criterios:**
  1. Los medios `PJ_CARD_DEMO` y `PJ_CASH` existen y SCAPI los acepta. `PJ_CARD_DEMO` rechaza la tarjeta `4000 0000 0000 0002` (S-D4).
  2. Los atributos del pedido del [contrato §4.4](../CONTRATO.md) están creados, incluidos `c_pjOrderRating`, `c_pjReminder` y `c_pjRedeemed`.
  3. Al crear el pedido se guardan `c_pjPointsEarned` (R1.1) y `c_pjStatus = recibido`.

### DAT-10 · Operaciones de la demo (oleada 2, para la oleada 3)
- **Criterios:**
  1. El cliente de API de `dw.json` tiene permisos OCAPI Data para modificar pedidos, clientes y tiendas.
  2. Hay scripts de prueba que avanzan `c_pjStatus`, acreditan puntos, cierran una tienda y activan o apagan los casos `pj-super-duo-pickup` y BIN.
  3. Hay un script de **reinicio de la demo**: saldos (Sofía 340, Valentina 40, Diego 0), carritos vacíos, tiendas abiertas y casos apagados.
  4. Las variables de servidor para las rutas `/resource/pj-demo/*` están documentadas (sin `PUBLIC__`).
