# OFE · Ofertas y constructor de combos (diseño 10)

### OFE-01 · Ofertas por ocasión (oleada 1)
- **Historia:** Como cliente, quiero comparar las ofertas según para cuántos son, para elegir la que conviene.
- **Pantallas:** `Ofertas.dc.html`, `Ofertas-Desktop.dc.html`.
- **Criterios:**
  1. Filtro por ocasión: Todas, Para 1, Para 2, Para 4, Para 6+ (`c_pjOccasion`).
  2. La destacada es la Pizza del Mes The Works (S-D1). Las ofertas que no tienen constructor (Papa Flash, Papa Combo Palitos, Papa Combo con Postre) abren su ficha (S-D3). Cada tarjeta tiene foto sin texto, nombre, precio ahora en rojo, antes tachado, ahorro en pesos, modalidad y vigencia (solo si quedan 7 días o menos).
  3. Escritorio: grilla con la oferta destacada arriba.
  4. Si la oferta no aplica a la modalidad elegida (Super Dúo con delivery, solo cuando el panel activa el caso 2), la tarjeta lo dice antes de abrirla y da la alternativa.

### OFE-02 · Constructor de combos (oleada 1)
- **Historia:** Como Diego, quiero armar el Super Dúo que vi en el anuncio en pocos toques, para comprarlo tal cual.
- **Pantallas:** `Combo.dc.html` (Super Dúo), `Combo-Trio.dc.html`. Solo estos dos constructores (S-D3).
- **Requerimientos:** 10 reglas 1–5, DAT-05.
- **Criterios:**
  1. URL propia `/promos/super-duo` y `/promos/super-trio`, que funciona sin tienda elegida. El Super Dúo se puede pedir con retiro o delivery (S-D15). Conserva los `utm_*` y aplica el source code `PJSD26`.
  2. Las casillas «Pizza 1 de 2» y «Pizza 2 de 2» van arriba. La grilla de especialidades lleva foto y texto que se saborea, y al elegir salta a la siguiente casilla vacía.
  3. El precio fijo y el tachado están siempre visibles.
  4. El botón dice lo que falta («Elige 1 pizza más»). Completo, dice «Agregar Super Dúo · $22.590».
  5. Al agregar: si no hay tienda elegida, se abre el panel de TIE. El combo entra al carrito con las pizzas elegidas y precio $22.590.

### OFE-03 · Oferta no disponible en la modalidad (oleada 1)
- **Pantallas:** `Combo-NoDisponible.dc.html`.
- **Requerimientos:** R2.6, caso 2.
- **Criterios:**
  1. **Solo cuando el panel activa el caso 2** (S-D15) y hay delivery elegido, el Super Dúo muestra «Esta oferta es solo para retiro» con dos salidas: «Retirar en El Bosque · 0,8 km · listo en 15 min» y «Ver ofertas con delivery».
  2. «Retirar en El Bosque» cambia la modalidad y conserva el combo armado: aparece «Listo: retiras en El Bosque… Tu combo sigue igual».
  3. Mientras siga en delivery, el botón queda deshabilitado con «Elige retiro para agregarla».

### OFE-04 · Enlace a una oferta vencida (oleada 1)
- **Pantallas:** `Oferta-Vencida.dc.html`.
- **Requerimientos:** R2.7, caso 14, S-D1.
- **Criterios:**
  1. `/promos/box-halloween` muestra «Esta oferta terminó el 2 de noviembre» y tres ofertas vigentes con su precio real: Pizza del Mes The Works, Super Dúo y Papa Combo con Postre (tabla §1.1).
  2. Conserva los `utm_*` de la URL.
  3. Responde 200 (no 404), para no perder la visita del anuncio.
