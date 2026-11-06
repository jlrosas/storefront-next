# Sandbox zyfj-001 antes de DAT-01 (06-nov-2026)

Export del sitio `PapaJohnsCL` (`b2c job export`, todas las unidades del sitio) tomado antes de que DAT
lo reconstruyera desde el repo. Sirve de referencia de lo que había:

- Promociones, campañas, cupones y source codes: **ninguno** (archivos vacíos).
- Grupos de clientes: solo los del sistema (`Everyone`, `Registered`, `Unregistered`).
- Métodos de envío: `001` Despacho a domicilio ($1.990), `005` Retiro en tienda ($0) y
  `ZZ_PRUEBA_DELIVERY_TRAMOS` (offline, de una prueba anterior; no se reconstruye).
- Preferencias, medios de pago, impuestos, búsqueda y reglas de URL: los mismos que genera `build_site.py`.

Para volver a exportar: `site-data/export_sandbox.sh <carpeta>`.
