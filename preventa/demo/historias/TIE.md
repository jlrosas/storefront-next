# TIE · Tienda y modalidad (diseño 05)

### TIE-01 · Panel de retiro cuando hace falta (oleada 1)
- **Historia:** Como cliente, quiero elegir dónde retiro recién al agregar mi primer producto, sin perder lo que estaba eligiendo.
- **Pantallas:** `Tienda.dc.html`.
- **Requerimientos:** 05 reglas 1, 2, 4 y 6; caso 1.
- **Criterios:**
  1. El panel dice para qué lo pide: «Para agregar tu Pollo BBQ, dinos cómo lo quieres».
  2. Retiro | Delivery como opciones grandes.
  3. En retiro aparecen «Usar mi ubicación» y un buscador. Cada tienda muestra distancia, «Abierta · cierra 23:30» o «Cerrada · abre 12:00» y «Listo en N min».
  4. Providencia cerrada no se puede elegir para «Lo antes posible», pero sí para programar, y sugiere El Bosque.
  5. Cuándo: «Lo antes posible» por defecto; «Programar» abre día y hora.
  6. Al confirmar, guarda `pj_fulfillment` (y la preferencia, si hay sesión), vuelve al producto y lo agrega.
  7. Usa las extensiones `store-locator` y `bopis` del template (no se rehace el buscador).

### TIE-02 · Panel de delivery (oleada 1)
- **Pantallas:** `Tienda-Delivery.dc.html`.
- **Criterios:**
  1. Dirección con autocompletado de Google Places y número de departamento opcional.
  2. Asigna la tienda automáticamente. Para la demo, la regla es por cercanía: Av. Providencia 1234 se asigna a Salvador porque Providencia está cerrada.
  3. Muestra tiempo estimado, despacho $1.990 y mínimo $12.000.
  4. Si falta la llave de Google, cae a un buscador simple con 3 direcciones de ejemplo, sin romper la pantalla.

### TIE-03 · Modalidad visible y editable (oleada 1)
- **Criterios:**
  1. `FulfillmentChip` en el encabezado: «Retiro · El Bosque · 15 min» o «Delivery · Av. Providencia 1234 · 35–45 min». Al tocarlo, abre el panel.
  2. Cambiar la modalidad no vacía el carrito.
  3. La modalidad se recuerda entre visitas.
  4. «Locales» del encabezado y del footer abre el `store-locator` del template con las tiendas reales.
