# UX-3 · Carrito «Mi pedido» · diagnóstico y especificación para CAR

- **Fecha:** 07-nov-2026 · **Autor:** UXD · **Pedido por:** Raúl («no lo veo tan bueno; en el lienzo no está el carro»)
- **Modo:** incremental sobre [UX-2 §4](UX-2-pulido.md) (las 8 reglas de la oleada 2), con foco en una sola pantalla: `/cart` y el panel «Tu pedido» del menú.
- **Capas:** vertical `qsr-delivery`, Storefront Next, marca S-D18 (Papa Sans + paleta BGYS con reglas ADA) y [VIS-API](../VIS-API.md).
- **Fuentes:**
  - Lienzo `WAK6JrPuHueQ1fozG9EXKk` (versión 1794020050) y su respaldo `disenos/_canvas/`.
  - Diseños 04, 06, 07 y 09, `requerimientos-demo.md`, [CONTRATO](../CONTRATO.md) §1, §4 y §6, y la historia [CAR](../historias/CAR.md).
  - Evidencia:
    - del template publicado: `UX-2-cart-390/1440`, `AUD-08`, `AUD-09`, `AUD-16` y `AUD-19`;
    - de lo que lleva CAR: `CAR-01-390`, `CAR-01-1440`, `CAR-01-mitades-combo-390` y `CAR-01-panel-1440`.
  - Código: la rama `demo` (sin CAR) y `git -C storefront-wt/CAR diff demo` (commit `019b494` más cambios sin commitear: `combo-addon.tsx`, `cart-line.tsx`, `pj-cart-page.tsx` y `order-summary.tsx`).
- **Límites:**
  - Sin navegador: los tres están ocupados. Se juzga con capturas y código.
  - El HTML publicado de `/cart` se pidió una sola vez y respondió 200: carrito vacío de invitado, sin `pj-cart`. Lo publicado sigue siendo el template.
  - Rappi, Uber Eats, PedidosYa y Domino's se comparan como patrones conocidos, sin capturas nuevas.
  - Es una revisión experta, sin usuarios.

---

## 1. Diagnóstico

### 1.1 Por qué «no se ve bien»

Hay dos carritos, y Raúl ve el peor:

| | Qué es | Dónde se ve |
|---|---|---|
| **A · Publicado (rama `demo`)** | El carrito del template de Storefront Next con colores PJ | El sitio público hoy. Evidencia: `UX-2-cart-*`, `AUD-08/16/19` |
| **B · CAR-01 (worktree, sin integrar)** | `/cart` propio (`pj-cart`) | Solo en `CAR-01-*` |

**A · El template.** Tiene seis causas, ordenadas por cuánto se notan en la demo:

1. **Contradice lo que el cliente eligió.**
   - Encabezado «Retiro · El Bosque» y, debajo, «DESPACHO A DOMICILIO – 1 DE 1 PRODUCTO».
   - Una etiqueta «Delivery» en cada línea.
   - Es lo primero que lee el ojo y resta credibilidad: el sitio no recuerda lo que acabo de decirle.
2. **No muestra la pizza que armé.**
   - El Super Dúo sale sin sus pizzas.
   - La Pollo BBQ sale sin «sin cebolla».
   - La «Arma tu pizza» cuesta $12.400 sin sus extras.
   - «Hazlo combo» aparece como dos líneas sueltas con precios tachados que nadie entiende: Palitos «$5.990 $4.417» y Coca-Cola «$3.490 $2.573 · Guardado $917».
3. **Ruido del template que no es de Papa Johns:**
   - «Es un regalo. Más información.» con un radio en cada línea;
   - «Cantidad:» como etiqueta;
   - «¿Tiene un código promocional?», que además trata de usted y contradice 06 R5;
   - «Envío: Por determinar»;
   - «Continuar a finalizar compra»;
   - logos de Visa, Mastercard, Amex y Discover (no los aceptamos: S-D4);
   - un carrusel de recomendaciones que a 390 queda en *skeleton* vacío;
   - un acordeón «Total estimado» que esconde el total.
4. **Composición de formulario, no de comida.**
   - Una caja con borde dentro de otra caja.
   - Línea de 300 px de alto por producto: foto de 128 px con *letterbox* crema arriba y abajo, y el precio y la cantidad apilados a la derecha.
   - En `AUD-08`, seis productos ocupan 5.500 px a 390.
5. **Sin recompensa ni venta.** No hay Papa Puntos, ni «Conviértelo en combo», ni canje. El carrito es el momento de mayor intención y no suma nada al ticket ni a la lealtad.
6. **El CTA no dice cuánto pago.** «Continuar a finalizar compra» va sin monto, y el total queda colapsado.

**B · CAR-01.** Va en la dirección correcta:
- modalidad arriba;
- títulos Condensed en Basil;
- configuración en una línea;
- extras;
- foto dividida en las mitades;
- «Editar» con la hoja de PRO;
- CTA fijo «Ir a pagar · $X».

Le falta lo que hace que un carrito *se vea bien* y no solo *esté bien*:
- **Composición plana:** todo son tarjetas blancas sobre Dough. No hay ningún bloque de marca con peso: ni granate de lealtad, ni oferta. A 1440 se lee como un formulario angosto con una tarjeta-resumen chica y mucho vacío.
- **El combo queda incrustado en la línea de la pizza:** una caja crema cuyo texto parte en cuatro renglones a 390 («Combo: Palitos / de Ajo + Coca- / Cola Sin azúcar / 1.5 LT · +$6.990»), sin foto y con «1.5 LT» en vez de «1,5 L».
- **Extras en una fila por ingrediente y con su precio:** dos extras suman dos filas en negrita verde. Pesa más que el nombre de la pizza.
- **Puntos en lila (`surface-garlic`) con texto granate.** La regla de VIS dice que la lealtad va en `surface-sauce`, y no hay canje.
- **No hay oferta** (CAR-02), ni canje (CAR-04), ni estados (cerrada, mínimo, error).
- **El vacío es solo texto.**
- **Precio de las mitades en $12.400:** el contrato dice $17.900 (R2.1). Falta el hook de cálculo, que es un bloqueo de DAT y Raúl, no de CAR, pero en la demo se ve como un error del carrito.

### 1.2 Notas (1 a 10, «entrar por los ojos» dentro de la marca)

| Carrito | 390 | 1440 | Comentario |
|---|---|---|---|
| A · Publicado (template) | **3** | **3** | Igual que en UX-2 y AUD. Contradice la modalidad, oculta la configuración, trae ruido del template y no muestra puntos |
| B · CAR-01 (evidencia del 06-nov 23:41) | **6** | **5** | Correcto y de marca, pero plano. A 1440 sobra espacio y falta jerarquía. El combo incrustado y los extras en filas meten ruido |
| Resto de la demo (UX-2) | ≈ 7–8 | ≈ 7 | La Home de Valentina está en 8 |
| **Objetivo de esta especificación** | **8** | **8** | — |

### 1.3 Contra las mejores apps de delivery (patrones conocidos)

| Patrón | Rappi / Uber Eats / PedidosYa / Domino's | Template | CAR-01 | Objetivo |
|---|---|---|---|---|
| Tienda y modalidad arriba | Siempre (Uber: tienda + «Delivery/Pickup» como conmutador) | ✗ (contradice) | ✓ | ✓ con icono y estado |
| Línea compacta: foto, nombre, opciones, precio, cantidad | ✓ (90–110 px por línea) | ✗ (300 px) | ✓ (≈150 px) | ✓ (≤ 120 px a 390) |
| Cantidad 1 → «−» se vuelve papelera | Uber Eats, PedidosYa | ✗ | ✗ | ✓ |
| Quitar con «Deshacer» | Uber Eats | ✗ | ✗ | ✓ |
| Una venta cruzada | Domino's («Don't forget»), Uber («Frequently bought together»): ellos ponen carruseles y nosotros, por la regla 06 R1, una tarjeta | carrusel vacío | ✗ | ✓ una tarjeta |
| Lealtad visible en el carrito | Domino's (Piece of the Pie), Starbucks | ✗ | lila, sin canje | ✓ granate con canje |
| Ahorro explícito | Rappi, PedidosYa («Ahorras $X») | tachados sueltos | ✗ | ✓ fila «Ahorro en combos» |
| CTA fijo con el monto | PedidosYa («Ir a pagar $X»), Rappi | ✗ | ✓ | ✓ |
| Identidad de marca | Domino's sí; Rappi y Uber son neutros | baja | media | alta: el único carrito de la lista que *parece Papa Johns* |

---

## 2. Qué dice el diseño y qué le falta

### 2.1 ¿El lienzo tiene el carrito?

**Sí, pero disperso y viejo.** No existe una página «06 Carrito»: el índice de páginas del lienzo va de 01 a 12 **sin la 06**. Por eso Raúl no lo encuentra. El carrito está repartido en cuatro artboards de tres páginas distintas:

| Artboard | Página del lienzo | Qué muestra |
|---|---|---|
| `Pedido.dc.html` («3 · Mi pedido (carrito)», 390) | 04 Agregar al carro | Encabezado de app con flecha, «Retiro en El Bosque · Listo en 15 min · Abierta hasta 23:30 · Cambiar», líneas con foto de 68 px, configuración, «Editar», cantidad, «Conviértelo en combo» (borde rojo, «Ahorras $2.490», «Convertir en combo») o «Mejora tu pizza» (borde de queso), cinta lima «Con este pedido ganas N Papa Puntos», «Ahorro por combo −$2.490», «Retiro en tienda · Gratis» y CTA «Ir a pagar · $total» |
| `Pedido-Mitades.dc.html` (390) | 02 Menú | Lo mismo con foto dividida y «Editar mitades» |
| `Carrito-Desktop.dc.html` (1280) | 04 Agregar al carro | **Panel lateral de 440 px** sobre la página oscurecida: líneas sin cantidad ni «Editar», «Convertir», «340 Papa Puntos. Canjea una Super Pepperoni mediana gratis al pagar.», Total, «Ir a pagar» y «Seguir viendo el menú» |
| `Puntos-Canje.dc.html` (390) | 09 Papa Puntos | Pedido canónico de Sofía ($23.890) con «Con tus Papa Puntos · Suma una Super Pepperoni mediana gratis por 260 puntos · Canjear», luego «Canjeaste 260 puntos. Te quedan 80. · Deshacer», y la línea a $0 con $13.000 tachado |

**Lo construido frente al lienzo:**
- CAR-01 cumple la anatomía de `Pedido` (modalidad, línea y CTA con monto).
- Le faltan las dos piezas que dan color al lienzo: la tarjeta de oferta con borde rojo y el canje.
- El escritorio se construyó como página de dos columnas, no como el panel de 440 px. Lo doy por bueno (ver §3.1).

### 2.2 Vacíos del lienzo y del 06 que la demo necesita cubrir

| # | Vacío | Cómo se cierra (supuesto UXD) |
|---|---|---|
| V1 | Marca vieja (Barlow, #1E4D33, #B3261E y cinta lima) | S-D18: Papa Sans, Basil, Rich Sauce y superficies de VIS. Esta especificación reemplaza los colores del lienzo |
| V2 | Escritorio solo como panel lateral; no hay página `/cart` a 1440 | Página de dos columnas (§3.1). El panel «Tu pedido» del menú cumple el rol del cajón lateral |
| V3 | Combo y canje nunca aparecen juntos, y no se dice si el canje cuenta como «oferta» | El canje **no** es venta cruzada: es lealtad. Pueden convivir una oferta y un bloque de puntos |
| V4 | No hay variante de delivery (despacho $1.990, mínimo $12.000, dirección) | §3.9, estado «mínimo no alcanzado» |
| V5 | No hay estados: vacío, cargando, error, tienda cerrada, promoción no disponible | §3.9 |
| V6 | No hay línea de combo armado (Super Dúo) | Línea con las pizzas elegidas (`c_pjComboChoices`) |
| V7 | La línea de «Hazlo combo» agregada desde la hoja (pizza + palitos + bebida con precio de promoción) no está dibujada; el lienzo solo dibuja la conversión en el carrito | §3.4: línea propia «Combo Palitos y bebida», pegada a su pizza |
| V8 | Al quitar no hay «Deshacer», y la cantidad 1 → 0 no está resuelta | §3.10 |
| V9 | 06 R1 permite «Mejora tu pizza» (borde de queso) como segunda opción. Exige cambiar la variante de la línea y no suma productos | §3.5: la segunda opción pasa a ser un complemento (postre o bebida). El borde de queso queda para el proyecto |
| V10 | UX-2 regla 5 dice «suma 33 Papa Puntos» | **Corrección:** el pedido canónico suma **23** (R1.1, CONTRATO §6). 33 era el total de la captura con dos pizzas |

---

## 3. Especificación del carrito objetivo

### 3.1 Estructura y orden de los bloques

Orden único para los dos anchos (de arriba a abajo):

1. **Título** «MI PEDIDO» (`pj-h2`) + contador «3 productos» (`pj-small`, gris fuerte), alineados a la línea base.
2. **Tarjeta de modalidad** (§3.2).
3. **Líneas** en una sola tarjeta (§3.3). Los combos van como línea propia (§3.4).
4. **Una oferta** (§3.5), si aplica.
5. **Papa Puntos** (§3.6).
6. **Resumen** (§3.7).
7. «Seguir viendo el menú» (enlace).
8. **CTA fijo** (§3.8).

- **390:** una columna, con márgenes de 16 px. Los bloques 1 a 7 hacen *scroll*. El CTA va en una barra fija sobre la zona segura y **no hay `BottomNav`** en `/cart`.
- **1440:** contenedor de 1120 px y grilla `minmax(0,1fr) 400px` con 32 px de separación.
  - Columna izquierda: bloques 1 a 4 y el enlace 7.
  - Columna derecha, `sticky` bajo el encabezado: una tarjeta con los bloques 5 a 8. No hay barra fija.
  - La columna derecha empieza a la altura de la tarjeta de modalidad, no a la del título: se quita el `lg:mt-[68px]` y el título pasa a ocupar el ancho completo, sobre la grilla.
- **Panel lateral del lienzo:** no se construye. Su función la cumple «Tu pedido», el panel `sticky` del menú (MEN-03), que comparte las piezas compactas (§3.12). «Mi pedido · N» del encabezado lleva a `/cart` desde cualquier página.

### 3.2 La modalidad arriba

Una tarjeta blanca (`bg-pj-surface rounded-pj-card shadow-pj-card`, 16 px de padding) con tres piezas:
- **Icono** de 40 px en un círculo `surface-pepperoncini`: tienda para retiro, moto para delivery. Trazo Basil, `aria-hidden`.
- **Texto:**

  | Modalidad | Título (16 px, Bold, `text-pj-heading`) | Detalle (14 px, `text-pj-gray-strong`) |
  |---|---|---|
  | Retiro | «Retiro en El Bosque» | «Listo en 15 min · abierta hasta 23:30» |
  | Delivery | «Delivery a Av. Providencia 1234, depto 504» (con elipsis en una línea) | «Llega en 35–45 min · desde Salvador» |

- **«Cambiar»** a la derecha: Bold, Basil, subrayado, 44 px de alto. Abre el panel de tienda de TIE.

Reglas:
- Es la misma fuente que el chip del encabezado (`pj_fulfillment`). Nunca dice «despacho» si el chip dice retiro.
- Sin modalidad elegida: «¿Retiro o delivery?» con «Elige cómo lo quieres y te decimos cuándo está listo.» y el botón «Elegir». El CTA queda en el estado «Elige retiro o delivery» (§3.9).

### 3.3 Las líneas

**Anatomía (390):** fila con 12 px de separación y 16 px de padding vertical. Divisor `divide-pj-line` entre líneas. Altura objetivo de 96 a 120 px.

```
┌──────┐ POLLO BBQ                         $18.840
│ foto │ Familiar · Tradicional · sin cebolla
│ 72px │ + Pepperoni
└──────┘ Editar                      ( − 1 + )
```

| Elemento | Especificación |
|---|---|
| Foto | 72 px a 390 y 96 px a 1440. `FoodImage crop={cropForPhoto(id)}` y `aspect="1/1"`, con `rounded-pj-card`. Pizza: `macro`, a sangre y sin *letterbox*. Mitades: `SplitPizzaImage`. Combo de palitos y bebida: `combo`. Bebida y postre: `none` sobre `bg-pj-dough`. Sin foto: cuadro `bg-pj-sand`, nunca un ícono roto |
| Nombre | `pj-card-title` (20/24) en `text-pj-heading`, sin repetir tamaño ni masa en el nombre («POLLO BBQ», no «POLLO BBQ FAMILIAR TRADICIONAL»). Máximo dos líneas con `text-balance` |
| Precio | Total de la línea con opciones (×cantidad), 16 px, Bold, `text-pj-ink` y `tabular-nums`, a la derecha del nombre. Con cantidad > 1, debajo: «2 × $16.900» en 13 px gris. Línea canjeada: «$0» en `text-pj-price` con «$13.000» tachado (`PriceTag` en `sm`) |
| Configuración | **Una** línea en `pj-small` (14 Regular) gris fuerte: «Familiar · Tradicional · sin cebolla». Mitades: «Familiar · Tradicional · ½ Pollo BBQ · ½ Todas las Carnes». Super Dúo: «Pollo BBQ + Todas las Carnes». Bebida: «1,5 L · Sin azúcar» |
| Extras | **Una sola línea**, en 14 px Bold Basil y sin precio unitario: «+ Pepperoni · + Choclo». Si no cabe, pasa a la línea siguiente. El precio de los extras ya está en el total de la línea (#37). Hoy CAR pinta una fila por extra con su precio: hay que compactarla |
| Editar | Pizza: «Editar». Mitades: «Editar mitades». Abre la hoja de PRO en modo edición, con todo marcado y la modalidad arriba. 14 px Bold Basil subrayado, 44 px de alto. Combos y productos simples no llevan «Editar» |
| Cantidad | Píldora de 44 px de alto con borde `pj-line`, botones de 44 × 44 y número `tabular-nums` con `aria-live`. **Con cantidad 1, el «−» pasa a ser una papelera** (`aria-label="Quitar Pollo BBQ del pedido"`). Tope 10 |
| Quitar | Solo con la papelera, o con «Quitar» en las líneas sin «Editar». Siempre con «Deshacer» (§3.10) |

**1440:** la misma anatomía con foto de 96 px y nombre de 24 px. La cantidad y el precio van en la misma fila del nombre (precio a la derecha y píldora debajo del precio), para que la línea no pase de 128 px.

### 3.4 Combos y «Hazlo combo» agrupados

- **Combo armado** (Super Dúo, Super Trío, Papa Combo…):
  - una línea con la foto del combo (`crop="combo"`), el nombre «SUPER DÚO» y la configuración con lo elegido según `c_pjComboChoices`: «Pollo BBQ + Todas las Carnes», o «Pepperoni individual · Mini palitos · Coca-Cola 350 ml»;
  - debajo, «Ahorras $5.210» en `pj-micro` con `text-pj-price` (Rich Sauce), calculado con `c_pjPriceBefore` menos el precio;
  - lleva «Quitar» y cantidad, sin «Editar» en la demo.
- **«Hazlo combo» (palitos + bebida con el precio de la promoción):**
  - **línea propia, no una caja dentro de la pizza**;
  - va inmediatamente después de su pizza, con una sangría de 16 px y una guía vertical de 2 px en `pj-line` a la izquierda, que la conecta visualmente con la pizza (patrón de «modificador» de Uber Eats);
  - contenido: foto `combo` de 56 px; nombre «COMBO PALITOS Y BEBIDA»; configuración «Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L»; precio $6.990; debajo, «Ahorras $2.490» en Rich Sauce; y solo «Quitar», sin cantidad (sigue a su pizza);
  - **nunca se muestran los precios tachados por componente** («$5.990 $4.417 · Guardado $917»).
- **Al quitar la pizza**, su combo pasa a dos líneas sueltas a precio normal y reaparece la oferta «Conviértelo en combo» (§3.5).

### 3.5 Una sola venta cruzada

Se muestra **una tarjeta como máximo**, la primera que aplique según esta prioridad. Nunca un carrusel.

| Prioridad | Condición | Tarjeta |
|---|---|---|
| 1 | Hay pizza + Palitos de Ajo + bebida 1,5 L sueltos (promoción `pj-combo-palitos-upsell`) | **«Conviértelo en combo»** |
| 2 | Hay pizza, ninguna bebida y no se tomó «Hazlo combo» | «¿Y para tomar?» · Coca-Cola 1,5 L · $3.490 · «+» |
| 3 | Hay pizza y ningún postre | «¿Cerramos con algo dulce?» · Cookie · $7.990 · «+» |
| — | Si no, o si la tienda está cerrada | Nada |

**Tarjeta «Conviértelo en combo»:**
- Blanca, con borde de 2 px Rich Sauce y `rounded-pj-card`.
- Foto `combo` a sangre a la izquierda: 104 px a 390 y 120 px a 1440.
- Eyebrow `pj-micro` en Rich Sauce: «AHORRAS $2.490».
- Texto de 16 px Bold: «Tus Palitos y tu Coca-Cola salen más baratos en combo».
- Botón píldora `bg-pj-sauce` con texto Dough, 44 px de alto: «Convertir en combo».

**Tarjetas 2 y 3:** el mismo marco con borde `pj-line` (sin rojo, porque no hay ahorro), foto `none`, nombre, precio y un botón «+» lima de 44 px, que es el mismo «+» del menú. Al agregar se ve `flyToCart`, y la tarjeta se reemplaza por la siguiente regla o desaparece.

- El precio y el ahorro los entrega la promoción (CAR-02). Nunca se calculan en el cliente.
- Con «Hazlo combo», «Conviértelo en combo» y esta tarjeta hay dos momentos de venta cruzada en el pedido (04 R7): uno en la hoja y uno aquí.

### 3.6 Papa Puntos y canje

Es el **único bloque de color fuerte** del carrito: `surface-sauce` (Rich Sauce con texto Dough y acento lima), `rounded-pj-section` y 16 px de padding.

**Sin sesión, o sin saldo suficiente:**
- Una sola línea: «Este pedido suma **23 Papa Puntos**».
- Valentina, con `c_pjDoublePoints`: «Este pedido suma **46 Papa Puntos** (dobles por volver)».
- Si el saldo no alcanza para el canjeable más barato: «Te faltan 178 puntos para una pizza gratis».

**Sofía (340 puntos), antes de canjear:**
```
┌────────────────────────────────────────────┐ surface-sauce
│ ESTE PEDIDO SUMA 23 PAPA PUNTOS            │ pj-micro, lima
│ ┌────┐ Tienes 340 puntos.                  │
│ │foto│ Llévate una Super Pepperoni         │ 16 Bold Dough
│ └────┘ mediana gratis                      │
│        [ Canjear 260 puntos ]              │ píldora lima, texto Sauce
└────────────────────────────────────────────┘
```

**Después de canjear:**
- Aparece una línea nueva en la lista: «SUPER PEPPERONI MEDIANA», «Canjeada con 260 Papa Puntos», «$0» con «$13.000» tachado.
- El bloque pasa a decir: «Canjeaste 260 puntos. Te quedan 80, y este pedido suma 23.» con el botón secundario «Deshacer» (contorno Dough).

Reglas:
- Usa el componente compartido con CHK-03, que es su dueño. Si se canjea en el carrito, el checkout lo muestra aplicado y viceversa. En el guion de Sofía el canje ocurre en el checkout (S-D12): el carrito ofrece el mismo interruptor.
- Los puntos se calculan con `pointsFor(total, despacho, doble)`. El canje no cambia los puntos ganados: 23.

### 3.7 Resumen

Va sin tarjeta a 390, sobre Dough, y dentro de la tarjeta derecha a 1440. Es una lista `dl` de 15 px:

| Fila | Texto | Valor |
|---|---|---|
| Productos | «Productos» | Suma **antes** de los ahorros de combo («$26.380»), o la del motor |
| Ahorro (solo si hay) | «Ahorro en combos» | «−$2.490», en `text-pj-price` (Rich Sauce) y Bold |
| Canje (solo si hay) | «Canje Papa Puntos» | «−$13.000», en `text-pj-price` |
| Modalidad | «Retiro en tienda» / «Despacho» | «Gratis» / «$1.990» |
| **Total** | «Total» (20 Bold) | **«$23.890»** en Papa Sans Condensed de 28 px y `tabular-nums`. No se usa `PriceTag display`, que es para la vitrina |

- Sin «Envío: Por determinar» y sin «estimado»: el total es el que se paga.
- Si la promoción no entrega el «antes» de los productos, se omite la fila de ahorro y el ahorro se ve solo en la línea del combo. Nunca un número inventado.

### 3.8 CTA fijo con el monto

- **390:** barra fija `bg-pj-dough` con borde superior `pj-line`, padding de 12 px y `env(safe-area-inset-bottom)`. Dentro, un botón píldora Basil de 56 px a todo el ancho: «Ir a pagar» a la izquierda y «$23.890» a la derecha, en 17 px Bold, con texto Dough.
- **1440:** el mismo botón, en el ancho de la tarjeta derecha. Debajo va «Seguir viendo el menú».
- `aria-label` «Ir a pagar $23.890».
- Sin sesión, lleva al ingreso de ING; con sesión, a `/checkout`.
- Mientras se actualiza la canasta: «Actualizando…», `aria-busy` y deshabilitado, sin cambiar el ancho.
- Deshabilitado **siempre con una razón en el propio botón** (§3.9), en contorno Basil. Nunca un gris mudo.

### 3.9 Estados

| Estado | Qué se ve | CTA |
|---|---|---|
| **Vacío** | `surface-dough` con una foto de pizza `FoodImage macro` de 160 px, «TU PEDIDO ESTÁ VACÍO» (`pj-h2`) y «Elige tu pizza y la armamos como te gusta.». Botón Basil «Ver el menú». **Para Sofía** (con historial), además una tarjeta «Tu último pedido · Pollo BBQ Familiar sin cebolla + Combo Palitos · $23.890» con «Repetir pedido», si HOM ya expone «repetir». Si no, solo «Ver el menú» | Sin barra fija |
| **Cargando** | *Skeleton* con la misma forma: tarjeta de modalidad, tres líneas (cuadro de 72 px + dos barras) y el resumen. `bg-pj-sand` con pulso suave y sin movimiento si se pide reducirlo. Nunca el carrusel del template | «Ir a pagar» en *skeleton* |
| **Error al cambiar una línea** | La línea vuelve a su valor anterior y debajo aparece «No pudimos actualizar tu pedido. Inténtalo de nuevo.» en Rich Sauce, con `role="alert"` | Normal |
| **Error al cargar** | «No pudimos cargar tu pedido.» con «Reintentar» (Basil). El tono es *Approachable*, sin chistes | Oculto |
| **Mínimo no alcanzado** (delivery bajo $12.000) | Una línea sobre el resumen, en 14 px Bold Rich Sauce: «Te faltan $3.010 para pedir delivery». Debajo, una barra de progreso de 6 px (Basil sobre `pj-line`) y el enlace «o cámbiate a retiro» (abre el panel de TIE). Es la línea de umbral de CAR-03: no cuenta como oferta | Contorno: «Agrega $3.010 para delivery» (deshabilitado) |
| **Tienda cerrada** (Providencia, caso 1, panel) | La tarjeta de modalidad pasa a `surface-sauce`: «Providencia está cerrada» / «Abre a las 12:00». Botones: «Programar para las 12:00» (lima) y «Cambiar tienda» (enlace Dough). Se oculta la oferta | Contorno: «Tienda cerrada · elige otra» |
| **Promoción no disponible** (caso 2: Super Dúo solo retiro, con delivery) | Bajo la línea, en 14 px Rich Sauce: «Esta promo es solo para retiro», con «Cambiar a retiro» | Contorno: «Revisa tu pedido» |
| **Sin modalidad** | La tarjeta muestra «¿Retiro o delivery?» con «Elegir» | Contorno: «Elige retiro o delivery» |

### 3.10 Micro-interacciones

Todas respetan «reducir movimiento»: sin animación, con el cambio inmediato.

1. **Cantidad:** el precio de la línea y el total «cuentan» hacia el valor nuevo (220 ms, con `tabular-nums` para que no salte el ancho). El contador del encabezado usa `bumpCartCount()`.
2. **Quitar:** la línea se colapsa en altura (200 ms) y aparece un aviso bajo el encabezado: «Quitaste Pollo BBQ · Deshacer» (5 s). «Deshacer» la restaura con la misma configuración: se vuelve a agregar con sus opciones.
3. **Convertir en combo:** las dos líneas sueltas se funden en la línea de combo (*fade* y desplazamiento de 200 ms). La fila «Ahorro en combos −$2.490» aparece con un destello lima de 600 ms y el total cuenta hacia abajo. La tarjeta de oferta desaparece.
4. **Agregar desde la tarjeta 2 o 3:** `flyToCart` desde la foto de la tarjeta, y la línea nueva entra con un *fade* de 200 ms.
5. **Canjear:** la línea a $0 entra con un sello «GRATIS» (`LtoBadge` lima, `sm`, sin rotar) durante 1,2 s. El saldo del bloque cuenta de 340 a 80.
6. **«Editar»:** la hoja de PRO sube con la modalidad visible. Al guardar, la línea se actualiza en su lugar, sin recargar la página ni moverla al final.
7. **CTA:** al tocarlo, pasa a «Abriendo pago…» para evitar el doble toque.

### 3.11 Textos (tono BGYS: *Approachable*, tuteo, sin chistes en el pago)

| Elemento | Texto |
|---|---|
| Título | «Mi pedido» · contador «1 producto» / «3 productos» |
| Modalidad | «Retiro en {tienda}» · «Listo en {n} min · abierta hasta {hora}» · «Delivery a {dirección}» · «Llega en {rango} min» · «Cambiar» |
| Línea | «Editar» · «Editar mitades» · «Quitar» · «sin cebolla» · «+ Pepperoni» · «2 × $16.900» · «Ahorras $2.490» · «Canjeada con 260 Papa Puntos» |
| Combo | «Combo Palitos y bebida» · «Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L» |
| Oferta 1 | «Ahorras $2.490» · «Tus Palitos y tu Coca-Cola salen más baratos en combo» · «Convertir en combo» |
| Oferta 2 y 3 | «¿Y para tomar?» · «¿Cerramos con algo dulce?» |
| Puntos | «Este pedido suma 23 Papa Puntos» · «Tienes 340 puntos. Llévate una Super Pepperoni mediana gratis» · «Canjear 260 puntos» · «Canjeaste 260 puntos. Te quedan 80, y este pedido suma 23.» · «Deshacer» |
| Resumen | «Productos» · «Ahorro en combos» · «Canje Papa Puntos» · «Retiro en tienda» · «Despacho» · «Gratis» · «Total» |
| CTA | «Ir a pagar · $23.890» · «Actualizando…» · «Abriendo pago…» |
| Aviso | «Quitaste {producto} · Deshacer» |
| Vacío | «Tu pedido está vacío» · «Elige tu pizza y la armamos como te gusta.» · «Ver el menú» · «Repetir pedido» |
| Errores | «No pudimos actualizar tu pedido. Inténtalo de nuevo.» · «No pudimos cargar tu pedido.» · «Reintentar» |
| Umbral y cierre | «Te faltan $X para pedir delivery» · «o cámbiate a retiro» · «Providencia está cerrada» · «Abre a las 12:00» · «Programar para las 12:00» · «Esta promo es solo para retiro» |

Formato: CLP con punto de miles («$23.890»), volumen con coma decimal («1,5 L», nunca «1.5 LT») y nombres de producto de DAT sin la marca repetida («Coca-Cola 350 ml», no «Coca-Cola Coca-Cola 350 ML»).

### 3.12 Tokens y piezas de VIS

- **Superficies:** página `surface-dough`, tarjetas `bg-pj-surface` + `shadow-pj-card` + `rounded-pj-card`, lealtad `surface-sauce` (+ `rounded-pj-section`), tienda cerrada `surface-sauce` e icono de modalidad `surface-pepperoncini`.
  - **Se quita `surface-garlic` del bloque de puntos.**
  - Regla «nunca dos bloques verdes seguidos»: el CTA Basil queda separado del encabezado por todo el contenido.
- **Tipografía:**
  - `pj-h2` en el título; `pj-card-title` en el nombre de cada línea; `pj-small` en la configuración; `pj-micro` en los eyebrows («AHORRAS $2.490», «ESTE PEDIDO SUMA…»).
  - El total va en Condensed de 28 px.
  - Ningún texto bajo 12 px.
- **Color de texto:** `text-pj-heading` (titulares), `text-pj-ink` (precios), `text-pj-gray-strong` (detalle), `text-pj-price` (ahorro, canje y precio de oferta; es Rich Sauce) y `text-pj-basil` (enlaces). Tangy Tomato no lleva texto. Ningún color en hex dentro de `pj-cart` (`palette.test.ts`).
- **Piezas:** `FoodImage` + `cropForPhoto`, `SplitPizzaImage`, `PriceTag` (línea canjeada), `LtoBadge` (sello «GRATIS»), `flyToCart`, `bumpCartCount`, `AddedToast` / sonner (para «Quitaste…»), el «+» lima del menú, la hoja `PizzaSheet` de PRO y el panel de TIE.
- **Panel «Tu pedido» (MEN-03, 1440):**
  - Foto de 48 px por línea (hoy no tiene), nombre de 16 Bold, configuración de 13, extras en la misma línea y combo como línea con sangría.
  - Puntos en una línea `surface-sauce` **antes** del CTA, no como chip lima debajo.
  - CTA «Ir a pagar · $X» y enlace «Ver mi pedido» hacia `/cart`.
  - Se quita el prefijo «1×» cuando la cantidad es 1.

### 3.13 Componentes del template que deben desaparecer de la vista

En `/cart`, en el panel y en «Editar»:
- «Carrito (N artículos)».
- La cabecera de envío «Despacho a domicilio – N de N productos» y su icono de camión.
- La etiqueta «Delivery» de cada línea.
- «Es un regalo. Más información.» y su radio.
- La etiqueta «Cantidad:».
- «Eliminar» (pasa a ser «Quitar» o la papelera).
- El diálogo «Editar artículo del carrito» («Review product details…», «Close», «Actualización»).
- Los precios tachados por componente del combo y «Guardado $X».
- El acordeón «Total estimado (N productos)».
- «Envío: Por determinar».
- «¿Tiene un código promocional?» (el cupón va solo en el checkout, 06 R5).
- «Continuar a finalizar compra».
- Los logos de Visa, Mastercard, Amex y Discover.
- El carrusel de recomendaciones y su *skeleton*.
- El *letterbox* crema de las fotos.

### 3.14 Bocetos

**390 × 844 · Sofía, retiro, con «Hazlo combo» (pedido canónico)**

```
┌──────────────────────────────────────┐
│ PAPA JOHNS   Retiro·15 min   🔍 [🛒2]│ encabezado del sitio (Basil)
├──────────────────────────────────────┤ surface-dough
│ MI PEDIDO                 2 productos│ pj-h2
│ ┌──────────────────────────────────┐ │
│ │(◉) Retiro en El Bosque   Cambiar │ │ tarjeta blanca
│ │    Listo en 15 min · abierta     │ │
│ │    hasta 23:30                   │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │
│ │┌────┐ POLLO BBQ          $16.900 │ │
│ ││foto│ Familiar · Tradicional ·   │ │
│ │└────┘ sin cebolla                │ │
│ │       Editar          (🗑 1 +)   │ │
│ │  ┃ ┌──┐ COMBO PALITOS    $6.990  │ │ sangría + guía
│ │  ┃ └──┘ Palitos de Ajo + Coca-   │ │
│ │  ┃      Cola Sin azúcar 1,5 L    │ │
│ │  ┃      AHORRAS $2.490   Quitar  │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │ (oferta: no aplica, ya hay
│ │ ┌────┐ ¿CERRAMOS CON ALGO DULCE? │ │  combo y bebida → postre)
│ │ │foto│ Cookie · $7.990      (+)  │ │
│ └──────────────────────────────────┘ │
│ ┌──────────────────────────────────┐ │ surface-sauce
│ │ ESTE PEDIDO SUMA 23 PAPA PUNTOS  │ │
│ │ ┌──┐ Tienes 340 puntos. Llévate  │ │
│ │ └──┘ una Super Pepperoni gratis  │ │
│ │      [ Canjear 260 puntos ]      │ │ lima
│ └──────────────────────────────────┘ │
│ Productos                   $26.380  │
│ Ahorro en combos            −$2.490  │ Rich Sauce
│ Retiro en tienda              Gratis │
│ ──────────────────────────────────── │
│ Total                       $23.890  │ Condensed 28
│        Seguir viendo el menú         │
├──────────────────────────────────────┤ barra fija
│ (  Ir a pagar            $23.890   ) │ Basil 56 px
└──────────────────────────────────────┘
```

**1440 × 900 · el mismo pedido**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ PAPA JOHNS  Menú Promos Papa Puntos Locales …   [Retiro·El Bosque] [Mi pedido·2]│
├──────────────────────────────────────────────────────────────────────────────┤
│        MI PEDIDO                                              2 productos     │
│        ┌──────────────────────────────────────────┐  ┌──────────────────────┐ │
│        │(◉) Retiro en El Bosque           Cambiar │  │ surface-sauce        │ │
│        │    Listo en 15 min · abierta hasta 23:30 │  │ ESTE PEDIDO SUMA 23  │ │
│        └──────────────────────────────────────────┘  │ PAPA PUNTOS          │ │
│        ┌──────────────────────────────────────────┐  │ Tienes 340 puntos …  │ │
│        │┌──────┐ POLLO BBQ               $16.900  │  │ [Canjear 260 puntos] │ │
│        ││ foto │ Familiar · Tradicional ·         │  ├──────────────────────┤ │
│        ││ 96px │ sin cebolla          (🗑 1 +)    │  │ Productos   $26.380  │ │
│        │└──────┘ Editar                           │  │ Ahorro      −$2.490  │ │
│        │   ┃ ┌────┐ COMBO PALITOS Y BEBIDA $6.990 │  │ Retiro       Gratis  │ │
│        │   ┃ └────┘ Palitos de Ajo + Coca-Cola   │  │ Total       $23.890  │ │
│        │   ┃        AHORRAS $2.490      Quitar    │  │ (Ir a pagar $23.890) │ │
│        └──────────────────────────────────────────┘  │ Seguir viendo el menú│ │
│        ┌──────────────────────────────────────────┐  └──────────────────────┘ │
│        │┌──────┐ ¿CERRAMOS CON ALGO DULCE?        │       (sticky)            │
│        ││ foto │ Cookie · $7.990            (+)   │                           │
│        └──────────────────────────────────────────┘                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

**390 · con Palitos y Coca-Cola sueltos (prioridad 1 de la oferta)**

```
│ │┌────┐ PALITOS DE AJO      $5.990   │ │
│ │┌────┐ COCA-COLA SIN AZÚCAR $3.490  │ │
│ └──────────────────────────────────┘ │
│ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │ borde Rich Sauce 2 px
│ ┃┌──────┐ AHORRAS $2.490            ┃ │
│ ┃│ foto │ Tus Palitos y tu Coca-Cola┃ │
│ ┃│combo │ salen más baratos en combo┃ │
│ ┃└──────┘ [ Convertir en combo ]    ┃ │ Rich Sauce, texto Dough
│ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
```

---

## 4. Tabla de cambios

| # | Cambio | Estado | Dueño |
|---|---|---|---|
| 1 | `/cart` propio en lugar del template, modalidad arriba desde `pj_fulfillment` y «Cambiar» | ✅ hecho en CAR-01 (sin integrar) | CAR |
| 2 | Línea con foto macro o dividida, configuración en una línea, mitades, combo con lo elegido y total con opciones | ✅ en CAR-01 | CAR |
| 3 | «Editar» y «Editar mitades» con la hoja de PRO en modo edición | ✅ en CAR-01 (verificar en VAL que la línea se actualiza en su lugar) | CAR + PRO |
| 4 | CTA fijo «Ir a pagar · $X» y «Seguir viendo el menú» | ✅ en CAR-01 | CAR |
| 5 | **Extras en una sola línea sin precio unitario** («+ Pepperoni · + Choclo») | ⬜ encargar | CAR |
| 6 | **«Hazlo combo» como línea propia con sangría, foto, «Ahorras $2.490» y «Quitar»** (reemplaza la caja `ComboAddon` dentro de la pizza) | ⬜ encargar (CAR lo está tocando: ajustar) | CAR |
| 7 | **Puntos en `surface-sauce` con el canje** (CAR-04), con componente compartido con CHK-03 | ⬜ encargar | CAR + CHK |
| 8 | **Una oferta con prioridad** (combo, luego bebida, luego postre), con la tarjeta de borde Rich Sauce (CAR-02) | ⬜ encargar | CAR (precio: DAT) |
| 9 | **Resumen con «Ahorro en combos» y «Canje Papa Puntos»**, y total en Condensed de 28 px | ⬜ encargar | CAR |
| 10 | **Cantidad 1 → papelera, y «Quitaste X · Deshacer»** | ⬜ encargar | CAR |
| 11 | **1440:** foto de 96 px, título a todo el ancho, columna derecha `sticky` con puntos, resumen y CTA (sin `mt-[68px]`) | ⬜ encargar | CAR |
| 12 | **Estados:** vacío con foto (y «Repetir pedido» si existe), *skeleton* con forma, error al cargar, mínimo con barra, tienda cerrada, promoción solo retiro y sin modalidad, cada uno con su CTA con razón | ⬜ encargar | CAR (cerrada y promoción: PAN las fuerza; TIE da el panel) |
| 13 | Micro-interacciones: el total cuenta, fusión al convertir y sello «GRATIS» al canjear | ⬜ encargar | CAR |
| 14 | Panel «Tu pedido» del menú: foto de 48 px, puntos en Sauce antes del CTA, sin «1×» y enlace «Ver mi pedido» | ⬜ encargar | CAR (archivo de MEN: avisar a MEN) |
| 15 | Precio de las mitades en $17.900 (hoy $12.400): hook `dw.order.calculate` y *feature switch* de hooks SCAPI | ⬜ bloqueo | DAT / Raúl |
| 16 | Nombres de producto: «1,5 L» y no «1.5 LT»; «Coca-Cola 350 ml» y no «Coca-Cola Coca-Cola 350 ML» | ⬜ | DAT (#19) |
| 17 | Promociones `pj-combo-palitos-upsell` (con el ahorro exacto) y `pj-canje-puntos` | ⬜ verificar | DAT |
| 18 | El checkout refleja el canje del carrito y abre con la misma tarjeta de modalidad | ⬜ | CHK |
| 19 | Interruptores del panel: tienda cerrada, Super Dúo solo retiro y vaciar los carritos al reiniciar | ⬜ | PAN |
| 20 | «Ir a pagar» sin sesión abre el ingreso de marca | ⬜ | ING |
| 21 | **Integrar CAR a `demo` y desplegar:** mientras no se integre, Raúl sigue viendo el template | ⬜ | INT |
| 22 | Lienzo: crear la página «06 Carrito» y mover allí `Pedido`, `Pedido-Mitades`, `Carrito-Desktop` y `Puntos-Canje` (hoy están en 02, 04 y 09) | Opcional | Diseño (no bloquea la demo) |

---

## 5. Criterio de cierre (VAL, con `sofia`/`val*`, a 390×844 DPR 2 y a 1440×900)

El carrito llega a **8 o más** si se cumple todo lo siguiente.

**Credibilidad**
- [ ] 1. Con «Retiro · El Bosque» en el chip, la primera tarjeta dice «Retiro en El Bosque · Listo en 15 min · abierta hasta 23:30». Ninguna palabra «despacho» ni «delivery» aparece en la página.
- [ ] 2. El pedido canónico (Pollo BBQ Familiar Tradicional sin cebolla + «Hazlo combo» con Coca-Cola Sin azúcar 1,5 L) muestra el **total $23.890** y «Este pedido suma **23** Papa Puntos». CTA: «Ir a pagar · $23.890».
- [ ] 3. Mitades Pollo BBQ + Todas las Carnes = **$17.900** (si sigue en $12.400 por el hook, el cierre queda condicionado a DAT y se anota).
- [ ] 4. Ningún texto de §3.13 aparece en `/cart`, en el panel ni al editar. Se verifica buscando en el DOM «regalo», «Cantidad:», «promocional», «Por determinar», «finalizar compra», «Eliminar», «Review», «Close», «Visa» y «estimado».

**Líneas**
- [ ] 5. Cada pizza muestra tamaño, masa, quitados y extras en **una** línea de configuración más **una** de extras como máximo. Ninguna línea mide más de 140 px a 390, salvo un nombre de dos líneas.
- [ ] 6. «Hazlo combo» se ve como **una línea propia** bajo su pizza, con sangría, foto, «Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L», $6.990 y «Ahorras $2.490». No hay precios tachados por componente.
- [ ] 7. El Super Dúo muestra «Pollo BBQ + Todas las Carnes».
- [ ] 8. «Editar» abre la hoja de PRO con todo marcado. Al guardar, la línea cambia en su lugar y el total se actualiza.
- [ ] 9. Con cantidad 1, el «−» es una papelera con `aria-label`. Al quitar aparece «Quitaste … · Deshacer», y «Deshacer» devuelve la línea con su configuración.

**Venta y lealtad**
- [ ] 10. Con Palitos y Coca-Cola 1,5 L sueltos aparece **una sola** tarjeta «Ahorras $2.490 · Convertir en combo». Al tocarla, las dos líneas pasan a «Combo Palitos y bebida», aparece «Ahorro en combos −$2.490» y el total baja.
- [ ] 11. En ningún estado hay dos tarjetas de oferta.
- [ ] 12. El bloque de puntos es `surface-sauce`. Sofía ve «Tienes 340 puntos…» con «Canjear 260 puntos». Al canjear entra «Super Pepperoni mediana · $0» con $13.000 tachado, «Te quedan 80» y «Deshacer», y el checkout lo muestra aplicado.

**Estados**
- [ ] 13. Carrito vacío: foto, título, «Ver el menú» y sin barra fija.
- [ ] 14. Delivery con $8.990 en productos: «Te faltan $3.010 para pedir delivery», con barra y CTA en contorno con la razón.
- [ ] 15. Providencia cerrada (panel): tarjeta granate «Abre a las 12:00» con «Programar» y «Cambiar tienda», y CTA con la razón.
- [ ] 16. El *skeleton* tiene la forma de las líneas: no hay carrusel.

**Forma y accesibilidad**
- [ ] 17. A 390 el CTA queda fijo y visible en todo el *scroll*, y no se superpone con el último contenido (`pb` suficiente). A 1440 la columna derecha es `sticky` y empieza a la altura de la tarjeta de modalidad.
- [ ] 18. Fotos sin *letterbox*, nítidas (`sw` ≥ ancho pintado × DPR) y de 72 px a 390 y 96 px a 1440.
- [ ] 19. Medición `audit-dom.js` en `/cart` a 390: 0 fallas de contraste, 0 textos bajo 12 px y 0 áreas táctiles bajo 44 px en botones de acción. `palette.test.ts` en verde.
- [ ] 20. Con `prefers-reduced-motion`, ninguna animación, y los valores cambian igual.
- [ ] 21. **Prueba de 5 segundos (UXD):** mirando `/cart` a 390, se responde sin buscar qué voy a recibir, dónde lo retiro, cuánto pago y cuántos puntos gano. A 1440, la página no se ve vacía ni de formulario.

UXD vuelve a puntuar con las capturas de VAL. Con los puntos 1 a 12 y 17 a 21 cumplidos, la nota mínima es 8 en ambos anchos.
