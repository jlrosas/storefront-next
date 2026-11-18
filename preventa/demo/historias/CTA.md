# CTA · Mi cuenta y Papa Puntos (diseños 11 y 09)

### CTA-01 · Mi cuenta de Sofía (oleada 3)
- **Historia:** Como Sofía, quiero ver mi pedido en curso, mis puntos y repetir un pedido anterior desde mi cuenta.
- **Pantallas:** `Cuenta.dc.html`.
- **Requerimientos:** 11 reglas 4–5.
- **Criterios:**
  1. El primer bloque es el pedido en curso, si lo hay, y abre el seguimiento (SEG-01).
  2. Papa Puntos: saldo en puntos y en pesos, con un enlace a «Mis Papa Puntos».
  3. Últimos pedidos con «Repetir» (`useReorder`), favoritos, direcciones, la tarjeta guardada Visa ····4521, los datos de factura y «Cerrar sesión».
  4. Reemplaza las páginas de cuenta del template que el diseño no tiene (wishlist, passkeys).

### CTA-02 · Página Papa Puntos (oleada 3)
- **Pantallas:** `Puntos.dc.html`.
- **Requerimientos:** 09 reglas de experiencia 1–3 y 5.
- **Criterios:**
  1. La promesa en una frase («Cada pedido te devuelve puntos para pizza gratis») y las reglas Gana y Canjea. «¿Mis puntos vencen?» queda oculto (D18), y también «¿Gano puntos si pido como invitado?» (S-D14).
  2. Calculadora «¿Cuánto pides al mes?» que muestra puntos y pesos según las reglas R1.1 y R1.3.
  3. «Qué puedes canjear» con fotos y puntos (Super Pepperoni 260, Boom de Jamón 218, Napolitana Caprese 218).
  4. Sin sesión: «Crear cuenta» abre el ingreso de ING.
  5. Contenido administrable en Page Designer.

### CTA-03 · Mis Papa Puntos (oleada 3)
- **Pantallas:** `Puntos-Cuenta.dc.html`.
- **Criterios:**
  1. «340 puntos = $17.000», «Ya puedes canjear» primero, después el próximo premio y lo que falta.
  2. Movimientos recientes desde `c_pjPointsLog`, incluido el pedido de la demo «por acreditar» o «acreditado», y el canje (−260). Saldo final del guion: **103** (S-D12).
  3. «Canjear en mi próximo pedido» lleva al menú y deja el canje sugerido para el checkout.
