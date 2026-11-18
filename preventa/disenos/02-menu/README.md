# 02 · Menú y categorías (PLP)

- **Lienzo:** https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk, página «02 Menú»
- **Estado:** borrador v3, 16-oct-2026
- **Principios que aplica** ([propuesta](../00-propuesta/README.md)): 1 (ver antes de elegir tienda), 2 (un toque), 3 (precio comparable)

## El catálogo que hay que mostrar (producción, 16-oct-2026)

No diseñamos un menú nuevo: **estos productos ya se venden**. El PLP tiene que ordenarlos sin perder ninguno.

| Categoría | Productos | Cómo son |
|---|---|---|
| Ofertas | 16 | Combos con precio fijo, vigencia y modalidad; varios con elección de pizzas |
| Pizzas | 24 | 16 especialidades en 3 a 4 tamaños + 4 Pan Pizza (solo mediana) + 4 Croissant (un tamaño) |
| Constructores | 2 | «Arma tu pizza» (desde Familiar $12.400) y «Pizza por mitades» |
| Acompañamientos | 11 | Precio único, se agregan directo |
| Bebidas | 10 | Un atributo (tamaño) |
| Postres | 9 | Precio único (los helados tienen sabor) |
| Extras | 2 | Pepperoncini y el juego «El último slice» |

Total: unos 74 productos. La API que guardamos el 13-oct (`datos/raw/prices.json`) tiene cifras levemente distintas (13 acompañamientos, 9 bebidas, 13 combos); mandan las de producción.

### Cómo se agrupan las 24 pizzas (propuesta, por nivel de precio Familiar)

| Grupo | Pizzas | Familiar |
|---|---|---|
| Clásicas | Napolitana, Napolitana Cherry, Napolitana Caprese, Hawaiana, Boom de Jamón | $13.900 |
| Favoritas | Pollo BBQ, Super Pepperoni, Vegetariana, La Cordillerana, Pollo Caprese, Canadian Bacon | $16.900 |
| Premium | Todas las Carnes, Italiana, Espinacas a la Crema, Meat & Great, The Works | $18.900 – $21.900 |
| Pan Pizza | Pepperoni, The Works, Boom de Jamón, Napolitana | Solo mediana $12.900 |
| Croissant | Pepperoni, Aceituna, Choclo, Pimentón | Un tamaño $13.990 |

Los grupos coinciden con los niveles de precio del cliente: el comprador entiende en qué rango está sin leer cada precio. Filtros transversales: Más pedidas, Vegetarianas (5 especialidades y 2 Croissant), Picantes (Italiana, The Works, Pan Pizza The Works).

## Pizza por mitades: cómo funciona hoy (revisado en producción con Chrome DevTools, 16-oct-2026)

| Aspecto | Hoy en papajohns.cl |
|---|---|
| Entrada | Banner «Pizza por MITADES» junto a «Arma tu PIZZA», arriba de la lista de pizzas |
| Antes de armar | Pide dirección o tienda (muro de dirección) |
| Pasos | Tamaño y masa → Mitad 1 → Mitad 2, en un panel lateral |
| Tamaños | Mediana, Familiar, Extra grande; masa Tradicional, Delgada o Borde de queso (+$2.790) para toda la pizza |
| Cada mitad | «Especialidad (opcional)» en una lista desplegable sin fotos (16 especialidades; no incluye Pan Pizza ni Croissant) o armarla con ingredientes (+$970 cada uno en Familiar) |
| Precio | Base de «Arma tu pizza» + la mitad del sobreprecio de cada especialidad. **Equivale al promedio de las dos**: Pollo BBQ ($16.900) + Todas las Carnes ($18.900) = **$17.900** |
| Problemas | Lista desplegable sin fotos, no se ve cómo queda la pizza, cada mitad repite salsa, queso y 15 ingredientes, y desde la tarjeta de una pizza no se puede empezar una pizza por mitades |

### Por qué importa para el negocio

- **Resuelve el pedido de grupo:** cuando dos personas no se ponen de acuerdo, la alternativa es pedir dos pizzas o ninguna. Con mitades, una sola pizza Familiar deja contentos a ambos.
- **El precio promedio es justo y fácil de explicar:** «pagas el promedio de las dos mitades». Hay que decirlo en pantalla.
- **En Perú es normal tener 4 sabores (cuartos).** El diseño debe soportar «N partes» configurable por país y tamaño: Chile hoy usa 2; si se habilitan 4, el mismo armador funciona.

## Crítica del menú de escritorio v2

| Problema | Efecto |
|---|---|
| Barra lateral con 5 categorías ocupa una columna completa | Pierde espacio para productos, que es lo que vende |
| Grilla única de 3 columnas para todo | Bebidas y postres ocupan el mismo espacio que las pizzas |
| Solo 6 pizzas de 24, sin agrupar | No se ve la amplitud del catálogo ni cómo encontrar algo |
| No hay entrada a mitades ni a «Arma tu pizza» | Se pierde una función que el cliente ya vende |
| Sin selector de tamaño | El precio Familiar no sirve para Pan Pizza ni Croissant, y no se puede comparar en Mediana |
| Sin carrito visible | En escritorio hay espacio para mostrar el pedido mientras se compra |

## Propuesta v3

**Estructura (móvil y escritorio):**

1. **Barra de categorías fija** con el conteo: Ofertas 16 · Pizzas 24 · Acompañamientos 11 · Bebidas 10 · Postres 9 · Extras 2. En escritorio, horizontal arriba con el buscador; sin barra lateral.
2. **Ofertas:** carrusel con las 4 más relevantes según el perfil y «Ver las 16».
3. **Pizzas:**
   - Encabezado con **selector de tamaño** (Mediana · Familiar · Extra grande) que cambia todos los precios. Pan Pizza y Croissant muestran su único tamaño.
   - **Filtros:** Todas, Más pedidas, Vegetarianas, Picantes.
   - **Dos tarjetas de construcción** al inicio: «Mitad y mitad: dos sabores en una pizza, pagas el promedio» (con la pizza dividida en la imagen) y «Arma tu pizza».
   - **Pizzas agrupadas** (Clásicas, Favoritas, Premium, Pan Pizza, Croissant), cada grupo con su rango de precio.
   - **Cada tarjeta de especialidad tiene «Agregar» y «½ Mitad»**: «½ Mitad» abre el armador con esa pizza ya puesta en la primera mitad.
4. **Acompañamientos, bebidas, postres y extras** en tarjetas compactas horizontales (foto chica, nombre, precio, «+»): ocupan menos y se recorren rápido.
5. **Escritorio:** columna derecha con **«Tu pedido»** fija (productos, total, «Ir a pagar»).

**Armador de mitades (nuevo):** ver pantalla 3.

## Pantallas

| # | Pantalla (archivo) | Qué muestra |
|---|---|---|
| 1 | Menú móvil (`Menu.dc.html`) | Barra con conteos, selector de tamaño, filtros, tarjetas de construcción, pizzas por grupo con «½ Mitad», resto en tarjetas compactas |
| 2 | Menú escritorio (`Menu-Desktop.dc.html`) | Lo mismo en 4 columnas, con «Tu pedido» fijo a la derecha |
| 3 | Armador de mitades (`Mitades.dc.html`) | Pizza dividida que se arma a la vista; tamaño y masa para toda la pizza; elegir cada mitad con fotos; precio promedio explicado; parámetro `partes` (2 o 4) |

## Reglas

1. **Precio comparable:** el selector de tamaño cambia todos los precios a la vez; Familiar por defecto.
2. **Mitades:** tamaño y masa son de toda la pizza; cada mitad es una especialidad (con foto) o «Arma la tuya». Precio = promedio de las partes (regla actual del cliente). Pan Pizza y Croissant no admiten mitades.
3. **Partes configurables:** 2 en Chile hoy; 4 si el país o el tamaño lo habilita (pregunta D22).
4. **«½ Mitad» desde la tarjeta** solo en las 16 especialidades que admiten mitades.
5. **Botón según tipo de producto** (ver [04](../04-agregar-al-carro/README.md)).
6. **Sin tienda elegida** se ve todo; la tienda se pide al agregar ([05](../05-tienda-y-modalidad/README.md)).

## Modelo en Commerce Cloud

| Concepto | Cómo se resuelve | Tipo |
|---|---|---|
| Categorías y grupos de pizzas | Catálogo de navegación con subcategorías (Clásicas, Favoritas, Premium, Pan Pizza, Croissant) | Configuración |
| Selector de tamaño en el listado | Precio de la variante del tamaño elegido (Shopper Search con variantes) | Desarrollo |
| Pizza por mitades | Producto configurable con N partes; cada parte guarda especialidad e ingredientes en atributos de la línea; precio calculado por regla (promedio) en un hook de cálculo | Desarrollo |
| Filtros | Atributos `c_badges` y `c_foodType` (vegetariana, picante) | Configuración |

## Historial

| Fecha | Cambio |
|---|---|
| 16-oct-2026 | v1: menú móvil y escritorio |
| 16-oct-2026 | v2 (móvil): pizzas en tarjeta grande, promos con foto, precio en rojo |
| 16-oct-2026 | v2 (escritorio): promos en tarjetas anchas con foto, pizzas con primer plano y texto sensorial, precio de oferta en rojo |
| 16-oct-2026 | v3: catálogo completo de producción, pizzas agrupadas por nivel de precio, selector de tamaño, mitad y mitad desde el listado y armador con N partes, escritorio sin barra lateral y con «Tu pedido» |
| 16-oct-2026 | Revisión por procesos: «Agregar» de una pizza abre la hoja (regla única, conserva tienda y «Hazlo combo»); escritorio «Ir a pagar» → checkout de escritorio |
| 16-oct-2026 | Pizza mitad y mitad en el pedido: `Pedido-Mitades` (foto dividida, «½ Pollo BBQ · ½ Todas las Carnes», «Editar mitades» vuelve al armador); misma línea en el checkout y la confirmación (prop `mitades`). Precio de ejemplo $17.900 |
