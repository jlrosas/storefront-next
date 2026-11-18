# Revisión UX · Demo Papa Johns · v2 (experimental)

- **Fecha:** 17-oct-2026
- **Alcance:** pantallas nuevas o cambiadas el 17-oct en el [lienzo](https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk) (versión 54): PDP-Mobile, PDP-Desktop, Sheet-Pizza, Home y Home-Desktop (Diego, prop `hora`), Seguimiento-Cancelacion, Tienda (comedor y tienda cerrada), Checkout (Sofía con BIN, Gift Card, «Pagando…»), Combo-NoDisponible, Oferta-Vencida, Login («¿No te llega el código?»), Panel-Demo y Dashboard-Demo
- **Contexto:** QSR/delivery de pizza · Sofía, Diego, Valentina y el presentador · demo comercial para que el cliente nos elija como partner (`ux-context.md`)
- **Capas aplicadas:** heurísticas base · vertical `qsr-delivery` · plataforma `sfcc-composable` (la más cercana a Storefront Next) · kit del cliente y `checklist-kit.md`
- **Límites:** revisión experta sin usuarios. El lienzo corre en un iframe de otro dominio y el navegador bloquea leer su URL, así que **no se pudo correr `audit-dom.js`**. El contraste se midió con `contrast.py` sobre los colores del código y las áreas táctiles se leyeron de los estilos. Se vieron renderizadas la Home de Diego, la ficha de escritorio (video, zoom, agregar), el panel y el dashboard; el resto se revisó desde el HTML.
- **Modo:** experimental, para probar el skill `ux-review` (la crítica del skill va al final).

## Correcciones aplicadas (17-oct-2026, lienzo v55 y v56)

| Hallazgo | Estado | Qué se hizo |
|---|---|---|
| 1 Fecha de la oferta vencida | Resuelto | Ahora es la oferta del Día de la Pizza, que terminó el 9 de febrero |
| 2 «[PRECIO]» | Resuelto | Primera alternativa: Box Halloween $19.990 |
| 3 Dos ofertas protagonistas (Diego) | Resuelto | El momento va después de «¿Para cuántos?», en tarjeta compacta clara |
| 4 Textos para el presentador | Resuelto | Fuera de la Home de Diego, la ficha y el ingreso; el botón «Simular…» salió de 7 boards (el estado es la prop `paso`) |
| 5 «Video» | Resuelto | La etiqueta dice «Recién salida del horno»; el botón pausa el movimiento |
| 6 Estrellas | Resuelto | #8F5400: 5,9 a 6,1:1 |
| 7 «Para 3» | Resuelto | Pizza del mes + Palitos + bebida: $20.470, entre Para 2 ($16.490) y Para 4 ($22.590) |
| 8 Panel sin orden de guion | Resuelto | Guion numerado por perfil con «Siguiente»; extras y casos sorpresa plegados |
| 9 «Pago aprobado» con un toque más | Resuelto | El éxito aparece sobre el checkout, con un solo botón «Seguir mi pedido» |
| Marcadores (mapa, nutrición, vigencia) | Resuelto | Mapa dibujado; nutrición y vigencia ocultas hasta tener el dato (C5, D18) |
| Contraste del panel | Resuelto | #A3A69E: 5,65:1 |

Verificado con `audit-dc.js --variants` (89 variantes): sin fallas de contraste ni de íconos y sin textos de coherencia de demo en las pantallas del cliente.

## Seguimiento de la revisión v1

| Hallazgo v1 | Estado | Comentario |
|---|---|---|
| R1 Fotografía que no da hambre | Parcial | Primeros planos y video simulado; falta material definitivo del cliente (C6, C7) |
| R2 Acento cálido | Resuelto | |
| R3 Menú con tarjetas grandes | Resuelto | |
| R4 Textos sensoriales | Resuelto | |
| R5 Ingredientes con foto | Resuelto | |
| R6–R7 «Hazlo combo» y dos momentos de venta cruzada | Resuelto | |
| R8 Home de temporada | Resuelto | Ojo con la fecha: ver hallazgo 1 |
| R9 Valentina: comida primero | Resuelto | |
| R10 Confirmación con próxima acción | Resuelto | |
| R11 Tienda coherente y checkout | Resuelto | |

## Veredicto

Las pantallas nuevas cubren lo que faltaba del kit (video, prueba social, ocasiones, disponibilidad, OMS, casos sorpresa) y funcionan al recorrerlas. El riesgo ahora no es de usabilidad sino de **credibilidad en la demo**: una fecha que se contradice, un precio de marcador a la vista, textos para el presentador que ve el cliente y un «video» que es una foto en movimiento. Son cambios de una hora y evitan que el cliente dude de lo demás.

## Hallazgos, de mayor a menor impacto

### 1. La oferta vencida contradice la oferta vigente · Crítica · Demo

- **Dónde:** `Oferta-Vencida` (10) frente al hero de Halloween de la Home y del constructor.
- **Qué pasa:** la página dice que el Box Halloween «terminó el 2 de noviembre», pero la demo ocurre antes de esa fecha y la Home lo muestra vigente.
- **Principio:** coherencia de los datos de ejemplo entre pantallas.
- **Qué pierde el cliente:** en vivo, alguien de Papa Johns lo nota y la demo pierde credibilidad justo en un caso que buscaba mostrar solidez.
- **Recomendación:** usar una promoción ya terminada de verdad (p. ej. la del Día de la Pizza o un cupón de septiembre) y cambiar el enlace a `/promos/<esa>`.

### 2. Se ve un precio de marcador en la página de oferta vencida · Alta · Demo

- **Dónde:** `Oferta-Vencida`, primera alternativa «Papa Combo con Postre · [PRECIO]».
- **Qué pasa:** el marcador queda a la vista del cliente.
- **Qué pierde el cliente:** parece un trabajo sin terminar.
- **Recomendación:** poner el precio real del combo (está en la API del cliente) o reemplazarlo por un combo con precio conocido (Papa Combo Palitos $16.490).

### 3. La Home de Diego muestra dos ofertas protagonistas seguidas · Alta · Demo

- **Dónde:** `Home-Diego` y `Home-Desktop-Diego`, con `hora=partido`.
- **Qué pasa:** al hero del anuncio (Super Dúo, CTA verde grande) le sigue de inmediato otra tarjeta oscura de igual peso (Super Trío «Para ver el partido», CTA lima). En el primer viewport móvil compiten dos ofertas y dos CTA.
- **Principio:** un CTA principal por pantalla; la promesa del anuncio manda (kit 02, Diego paso 01).
- **Qué pierde el cliente:** el Switcher que llegó por «2 pizzas por $X» duda entre dos combos; se diluye la conversión del anuncio pagado.
- **Recomendación:** cuando la visita viene de un anuncio, bajar «¿Qué se te antoja ahora?» debajo de «¿Para cuántos?» o mostrarla compacta (fila de chips + tarjeta mediana). Si Diego entra sin anuncio, el bloque del momento puede ser el hero.

### 4. Textos para el presentador que ve el cliente final · Alta · Demo

- **Dónde:** Home de Diego («Cambia solo según la hora del día: almuerzo de 12 a 15 h…»), ficha («Datos de ejemplo» en opiniones), Login («Flujo alternativo del proyecto (fuera de la demo)»).
- **Qué pasa:** frases que explican la demo aparecen dentro de la tienda como si fueran del consumidor.
- **Principio:** coincidencia con el mundo real; la pantalla habla al cliente final.
- **Qué pierde el cliente:** la tienda se siente maqueta; en la demo distrae del mensaje.
- **Recomendación:** mover esas explicaciones a las notas del lienzo y al panel del presentador. Mantener «Datos de ejemplo» solo en el guion hablado, o como marca discreta en una esquina del board, no dentro de la sección.

### 5. El «video» es una foto en movimiento · Alta · Demo

- **Dónde:** ficha móvil y escritorio, hero de Valentina («Video · recién salida del horno»).
- **Qué pasa:** el control de pausa y la etiqueta prometen un video; lo que se mueve es la foto (zoom lento).
- **Principio:** visibilidad del estado; no prometer lo que no hay.
- **Qué pierde el cliente:** si el presentador dice «video» y el cliente ve una foto con zoom, el principio 9 (que dé hambre) pierde fuerza.
- **Recomendación:** conseguir 6 s de video del cliente (C7) o un clip de stock con licencia para la demo; mientras tanto, quitar la palabra «Video» y dejar el movimiento sin etiqueta.

### 6. Las estrellas no llegan al contraste mínimo · Media · Demo y proyecto

- **Dónde:** ficha (estrellas SVG `#D98B0B` y barras de distribución), tarjetas de más pedidas y opiniones (texto `★ 4,7` en `#B36A00`).
- **Qué pasa:** `#D98B0B` sobre blanco da **2,75:1** (gráficos piden 3:1); `#B36A00` sobre blanco da **4,22:1** en texto de 13–15 px (pide 4,5:1).
- **Recomendación:** un solo token de estrella `#8F5400` (texto y glifo) o mantener el ámbar para el glifo y el número en tinta principal.

### 7. «Para 3» cuesta menos que «Para 2» · Media · Demo

- **Dónde:** «¿Para cuántos?» de Diego (móvil y escritorio).
- **Qué pasa:** Para 2 = Papa Combo Palitos $16.490; Para 3 = Pizza del mes Familiar $10.990. La escalera de precios se rompe y la tarjeta de 3 no incluye bebida ni acompañamiento.
- **Qué pierde el cliente:** confusión al comparar; la ocasión parece armada sin lógica (el kit pide «mejor combinación»).
- **Recomendación:** para 3, Pizza del mes Familiar + bebida 1,5 L como «combo sugerido» con el total, o quitar «Para 3» si no hay combo real (pregunta D2).

### 8. El panel del presentador tiene 20 botones sin orden de guion · Media · Demo

- **Dónde:** `Panel-Demo`.
- **Qué pasa:** seis grupos y unos 20 eventos ordenados por tipo, no por el momento del guion de 15 minutos.
- **Qué pierde el cliente:** en vivo, el presentador busca el botón y se corta el ritmo.
- **Recomendación:** numerar los botones con el paso del guion (1 a 12) y destacar el siguiente; dejar los casos sorpresa en un grupo colapsable.

### 9. «Pago aprobado» pide un toque más · Baja · Demo

- **Dónde:** `Checkout` después de «Pagando…».
- **Qué pasa:** al aprobar, el botón cambia a «Pago aprobado · ver mi pedido» y hay que tocarlo.
- **Recomendación:** pasar solo a la confirmación al aprobar; en el proyecto es así.

### 10. El comedor pide «¿Cuántos son?» sin decir para qué · Baja · Proyecto

- **Dónde:** `Tienda`, modo «Comer aquí».
- **Recomendación:** decir si reserva mesa o solo ajusta el pedido; si no reserva, quitar el campo.

## Lo que funciona bien

- La ficha cuenta todo lo que pide el referente Target sin saturar: destacados en dos columnas, opiniones al final, el precio en el tamaño y el botón.
- El ingrediente agotado está bien resuelto: bloquea solo esa opción, dice dónde y propone un sustituto. Es exactamente el caso 6 del kit.
- El aviso al agregar (contador, puntos por acreditar, «Deshacer») cierra la tarea con feedback y control.
- La cancelación desde OMS se explica en lenguaje del cliente («La tienda no tenía…»), con monto y compensación. Convierte un error de operación en una demostración de servicio.
- «¿No te llega el código?» conserva el pedido y ofrece tres salidas: responde al caso 13 sin cambiar la decisión de demo con registrados.

## Accesibilidad medida

| Patrón | Medida | Pantallas | Corrección |
|---|---|---|---|
| Estrellas y barras ámbar | 2,75:1 (glifo) · 4,22:1 (texto) | Ficha, más pedidas | Token `#8F5400` |
| Barras no actuales del dashboard `#8DB59B` | 2,28:1 sobre blanco | Dashboard | Oscurecer a `#5F8F70` o agregar borde |
| Enlace «1.240 opiniones» | 32 px de alto | Ficha | Subir a 44 px |
| Botones de vista del dashboard | 40 px de alto | Dashboard | 44 px (escritorio: aceptable) |
| Resto de pares de color nuevos | 4,7:1 a 11:1 | Todas | Cumplen |

## Estados faltantes

| Estado | Flujo | Para | Comentario |
|---|---|---|---|
| Ficha sin opiniones (producto nuevo) | Ficha | Proyecto | Mostrar «Sé el primero en opinar» |
| Código de BIN no válido o banco sin promoción | Checkout | Proyecto | Hoy solo existe el caso feliz |
| Gift Card sin saldo o vencida | Checkout | Proyecto | |
| Error al cancelar en OMS o devolución rechazada | Seguimiento | Proyecto | |

## Implementabilidad (Storefront Next sobre B2C Commerce)

| Elemento | Situación | Comentario |
|---|---|---|
| Video del hero y la ficha | Requiere desarrollo | Componente de Page Designer con póster y carga diferida (R4.7) |
| Reseñas | Falta el dato | No hay reseñas hoy (C8); proveedor o módulo propio (D36) |
| Ocasión por hora | Administrable | Programación de Page Designer + grupos de clientes |
| Ingrediente agotado | Requiere desarrollo | Inventario por tienda de cada opción (R4.6) |
| BIN | Estándar + configuración | Promoción por medio de pago en Commerce; validar con Mercado Pago |
| Cancelación parcial | Estándar (OMS) | Conector y Flow a Marketing Cloud a validar (B11) |

## Cómo validarlo

- Hallazgo 3: test de 5 segundos con la Home de Diego (¿qué oferta recuerdas?) con dos variantes.
- Hallazgo 5: mostrar la ficha a 3 personas del equipo comercial y preguntar si «se ve como video».

## Detectado después con `audit-dc.js` (17-oct-2026)

Al aplicar las mejoras al skill se corrió el auditor nuevo sobre los 51 boards. Agregó lo que esta revisión no había visto:

| Qué | Dónde | Corrección |
|---|---|---|
| Botón «Simular siguiente estado (demo)» dentro de la pantalla del cliente | Confirmación (5 boards), Home de Sofía en curso, Seguimiento-Cancelacion | Mover al panel del presentador (ya avanza los estados por OMS) |
| Marcador «[MAPA DE GOOGLE]» a la vista | Confirmación de escritorio (Valentina y Sofía) | Imagen estática de mapa o quitar el bloque |
| Marcadores de contenido del cliente | Ficha («[TABLA NUTRICIONAL…]»), Papa Puntos («[VIGENCIA…]») | Ocultar hasta tener el dato (C5, D18) |
| Texto gris del panel `#8A8D85` sobre `#2A2D28` | Panel-Demo | 4,14:1: aclarar a `#A3A69E` |
| Íconos de estrella `#D98B0B` sobre crema | Ficha móvil | 2,66:1: confirma el hallazgo 6 |

## Anexo · Crítica del skill `ux-review` (modo experimental)

Ver la respuesta en la conversación del 17-oct-2026; resumen en la tabla.

| Aspecto | Qué pasó | Aplicado al skill (17-oct-2026) |
|---|---|---|
| Lienzo en iframe de otro dominio | `fuentes.md` asumía `contentDocument`; el navegador lo bloquea y `audit-dom.js` no corrió | Nuevo `scripts/audit-dc.js`: renderiza los `.dc.html` en Node (lógica, `sc-for`, `sc-if`, `dc-import`, variantes de props) y mide sin navegador. `fuentes.md` y `accesibilidad.md` lo ponen como vía principal y prohíben buscar rodeos al iframe |
| Plataforma | No había archivo para Storefront Next | Nuevo `references/plataformas/sfcc-storefront-next.md`; el SKILL.md pide identificar la plataforma por el código |
| Revisión de una demo | Sin eje de credibilidad (fechas, marcadores, textos para el presentador) | Paso 5b en el SKILL.md, §12 en `heuristicas.md`, sección en el informe y detección automática en `audit-dc.js` (marcadores, textos para el presentador, fechas) |
| Pedido acotado | No había modo para revisar solo lo nuevo | Paso 0 con modos completa, incremental y experimental (con anexo de crítica en `informe.md`) |
| Muchas pantallas | No decía qué renderizar primero | Prioridad de capturas en el paso 2 |
| Íconos | El contraste de íconos SVG no se medía | `audit-dc.js` mide 1.4.11 en íconos con significado |
