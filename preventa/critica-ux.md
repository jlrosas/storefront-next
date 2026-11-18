# Crítica de usabilidad: Melt Pizzas y Papa John's Chile

Fecha: 13-oct-2026. Recorrido como comprador en celular (emulación de 390x844), sesión nueva, sin iniciar sesión, una pizza por sitio, hasta el checkout sin pagar. Complementa `exploracion.md`. La comparación completa, momento por momento y con capturas, está en la pestaña "Análisis de UX" del documento de gerencia; este archivo se corrigió tras una segunda sesión en Melt. Es una revisión experta de una sesión por sitio, no una prueba con usuarios: las mediciones son de una sola carga.

## Veredicto

**Melt no es el mejor sitio; es la mejor vitrina.** Gana en los primeros diez segundos: se entiende qué venden, cuánto cuesta y dónde tocar. Papa John's Chile gana en lo que viene después: pedir es más corto y tiene menos tropiezos.

| Etapa del comprador | Mejor hoy | Por qué |
|---|---|---|
| Primera impresión | Melt | Oferta legible con precio antes/ahora; Papa John's muestra un banner borroso con letra ilegible |
| Encontrar qué pedir | Melt | Lista compacta con precio comparable y navegación inferior; Papa John's mezcla tamaños en el precio |
| Elegir tienda o dirección | Papa John's | Vuelve a la pizza que tocaste; Melt te deja en la portada |
| Armar la pizza | Papa John's | Viene preseleccionada: un toque para agregar; Melt obliga a 3 pasos |
| Carrito | Empate | Ambos sugieren acompañamientos; Melt muestra los puntos que ganas y Papa John's la mejora |
| Pagar | Papa John's | Una página y 3 campos; Melt va por pasos |
| Lealtad | Melt | Explica el programa; Papa John's solo avisa que pierdes puntos |

Conclusión para la venta: el cliente no necesita "ser Melt". Necesita **la vitrina de Melt sobre su propio motor de pedido**, corrigiendo los defectos de ambos.

## Melt Pizzas

### Lo que hace bien

- **Portada que vende en una pantalla.** "Hit del mes", nombre, tamaño, $9.990, precio tachado, -40% y un botón. No hay que leer una imagen.
- **Barra inferior tipo app** (Inicio, Promos, Menú, Melt Points, Carrito) siempre visible: el pulgar llega a todo.
- **Lista de promos compacta:** foto, nombre, descripción, precio antes/ahora y botón "+". Se ven cuatro o cinco ofertas por pantalla y se comparan de un vistazo.
- **Etiquetas "Solo delivery" / "Solo retiro"** en la foto: evitan la decepción al final.
- **Ficha en hoja inferior** que se abre sobre la lista, sin cambiar de página.
- **El botón principal dice el paso que falta** ("Selecciona masa") en lugar de un "Agregar" apagado.
- **"Incluido" y "Gratis"** junto a cada opción: se sabe qué no cuesta más.

### Lo que le criticaría

| Problema | Gravedad | Qué haría |
|---|---|---|
| La oferta de portada lleva al listado de promos, no al producto. Además se llama "Special Mix" en portada y "Hit del mes" en la lista, con precio original distinto ($16.700 y $16.790) | Alta | El botón abre el producto listo para agregar; un solo nombre y un solo precio, tomados del catálogo |
| Si agregas sin haber elegido tienda, redirige a otra página y luego te deja en la portada sin confirmar. La pizza queda en el carrito, pero parece perdida | Alta | Elegir tienda en un panel sobre la misma pantalla, volver al producto y confirmar |
| Velocidad irregular: 14 s y 27 s en carrito y checkout en una sesión, 2 s y 3 s en otra | Baja | No usarla como argumento; medir la demo |
| Salsa obligatoria sin opción "sin salsa", y masa sin valor por defecto: tres pasos para una pizza que no quieres modificar | Media | Preseleccionar lo más pedido; todo lo gratuito es opcional |
| Checkout por pasos, correo primero, medios de pago ocultos hasta confirmar el envío | Media | Una página, pago visible desde el inicio |
| El botón de WhatsApp tapa el "+" del último producto visible | Media | Mover la ayuda a la barra inferior o al encabezado |
| La barra inferior marca "Menú" estando en "Promos" | Baja | Estado activo correcto |
| El texto de la foto ("HIT DEL MES") queda bajo el botón de cerrar; "Producto con precio promocional" aparece dos veces | Baja | Fotos sin texto incrustado; contenido revisado |
| No explica qué es la masa "Nueva York" | Baja | Una línea descriptiva por opción |
| Sitio móvil separado (`m.`) | Media | Un solo sitio adaptable |

## Papa John's Chile

### Lo que tiene y conviene conservar

- **Conserva tu pizza.** Tocas una pizza, eliges tienda y vuelve al configurador de esa pizza.
- **Un toque para agregar.** Tamaño familiar y masa ya vienen marcados; el botón muestra el precio y se actualiza.
- **Carrito claro:** mejora sugerida ("borde de queso por sólo $3.790"), acompañamientos con "+", cupón y total en el botón.
- **Checkout en una página** con tres campos y compra como invitado.
- **Pedido programado** ("Cuanto antes" o "Más tarde") al elegir tienda.
- **Aviso de puntos que pierdes** ("Estás por perder 18 Papa Puntos"): buen incentivo al registro.
- **Fotos de producto apetitosas** y pestañas de categoría fijas.
- **Pizza por mitades y "Arma tu pizza"**, que Melt no ofrece.

### Lo que cambiaría

| Problema | Gravedad | Qué haría |
|---|---|---|
| La portada depende de un banner con el texto dentro de la imagen: se ve borroso, la letra legal es ilegible y dice "desde" sin precio de referencia. Tardó varios segundos en aparecer y dejó la pantalla en blanco | Alta | Hero con texto real, precio antes/ahora y botón; imagen liviana |
| Pide dirección antes de mostrar el detalle de cualquier pizza, en una pantalla casi vacía y sin decir por qué | Alta | Mostrar el producto primero; pedir tienda al agregar, con "usar mi ubicación" visible desde el inicio |
| No hay página de producto ni dirección propia: no se puede compartir una pizza ni llegar desde Google | Alta | Página por producto, además del panel rápido |
| Las tarjetas muestran el precio de tamaños distintos ("Familiar: $18.900" junto a "Mediana: $13.990"): no se puede comparar | Media | Un mismo tamaño de referencia o "desde"; precio tachado cuando hay oferta |
| El checkout muestra todos los campos en rojo y con error antes de que escribas | Media | Validar al salir de cada campo |
| El medio de pago está escondido tras una fila en rojo ("Debes elegir un método de pago") | Media | Medios de pago a la vista, con el más usado preseleccionado |
| Los campos no declaran autocompletado: el celular no rellena nombre, teléfono ni correo | Media | Atributos de autocompletado y teclado adecuado |
| El botón "Comenzar pedido" y WhatsApp flotan sobre el contenido y tapan títulos y tarjetas | Media | Barra inferior fija con las acciones |
| Al agregar no hay confirmación: solo cambia el número del carrito | Media | Aviso breve con "Ver pedido" y total |
| Para retiro dice "Entrega: 15 min"; no muestra distancia, horario ni si está abierta; "Usar mi ubicación" aparece solo al tocar el campo | Media | "Listo en 15 min", distancia, estado y horario |
| "0 cal/trozo · 0 trozos" en la ficha | Baja | Ocultar el dato si no existe |
| El carrito no muestra foto de la pizza ni la modalidad elegida | Baja | Foto, y resumen de retiro o delivery |
| La mejora sugerida cambia tu masa sin decirlo ("Mejora a Tradicional con borde…" teniendo Masa Maestra) | Baja | Ofrecer el borde sobre la masa elegida, o advertir el cambio |
| Papa Puntos aparece como aviso, pero no se explica cuánto ganas ni qué canjeas | Media | "Con este pedido ganas 18 puntos" desde el producto, y página con las reglas |
| Sin buscador | Baja | Buscador en el encabezado |

Nota: en esta sesión, la ficha de la pizza Italiana en celular mostró solo tamaño y masa. La personalización de ingredientes la vi antes en escritorio; falta confirmar si en celular está disponible para todas las pizzas.

## Qué debe tener la demo para superar a ambos

1. **Hero con texto real que abre el producto**, no un listado.
2. **Lista de menú compacta al estilo Melt**, con precio comparable y botón "+".
3. **Hoja rápida de producto con valores preseleccionados**: un toque para agregar, y además página propia por producto.
4. **Tienda en un panel**, pedida al agregar, que conserva el pedido; con ubicación, distancia, horario y pedido programado.
5. **Confirmación al agregar** con total y acceso al pedido.
6. **Carrito con mejora sugerida y acompañamientos**, con foto y modalidad.
7. **Checkout en una página**, sin errores anticipados, con autocompletado y pago a la vista.
8. **Puntos visibles desde el producto**, no solo como pérdida al final.
9. **Barra inferior** con Inicio, Menú, Promos, Pedido y Cuenta; ayuda dentro de la barra, sin botones flotantes.
10. **Menos de 2 segundos por paso**, medido y mostrado en la demo.

## Límites de esta revisión

- Una sesión por sitio, en emulación móvil, sin pago real ni cuenta registrada.
- El flujo de delivery con dirección real y el seguimiento del pedido no se probaron.
- La espera del banner de Papa John's se observó en una carga; el valor exacto puede variar.
- Para decidir con certeza qué prefiere el comprador hace falta una prueba con 5 a 8 clientes reales.
