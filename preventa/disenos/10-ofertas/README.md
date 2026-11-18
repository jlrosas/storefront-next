# 10 · Ofertas y constructor de combos

- **Lienzo:** https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk, página «10 Ofertas»
- **Estado:** borrador v1, 16-oct-2026
- **Principios que aplica** ([propuesta](../00-propuesta/README.md)): 3 (precio visible), 4 (la promesa del anuncio se cumple)

## Objetivo

Que Diego, que llega desde un anuncio, aterrice en su oferta y la arme en pocos toques; y que cualquiera compare las ofertas por ocasión. Corrige: Papa John's Chile tiene los combos en una página sin dirección propia y con banners con texto incrustado; Papa Johns EE.UU. bloquea ofertas hasta iniciar sesión; Domino's sí conserva la oferta al elegir tienda.

## Datos reales del cliente

Cada combo de la API tiene tipo (`Combo`), precio y precio original, vigencia (`start_datetime`, `end_datetime`), días disponibles, modalidad (`dispatch_method`: delivery, retiro o ambos) y si es personalizable (cantidad de ingredientes y extras gratis).

| Combo | Qué se elige | Precio | Antes | Vigencia |
|---|---|---|---|---|
| Box Halloween de Miedo | 1 pizza mediana entre 4 (Super Pepperoni, Boom de Jamón, Napolitana, The Works) + Box Dulce y Truco + bebida 1,5 L | $19.990 | $23.880 | 7-oct al 2-nov-2026 |
| Super Dúo | 2 pizzas familiares a elección | $22.590 | $27.800 | Por confirmar |
| Super Trío | 3 pizzas familiares a elección | $33.900 | $41.700 | Por confirmar |
| Papa Combo Palitos | Pizza de 3 ingredientes + acompañamiento + bebida 1,5 L | $16.490 | $17.880 | Por confirmar |
| Papa Flash | Pizza individual + mini palitos + bebida | $5.490 | $9.030 | Por confirmar |

## Pantallas

| # | Pantalla (archivo) | Qué muestra |
|---|---|---|
| 1 | Ofertas móvil (`Ofertas.dc.html`) | Filtro por ocasión (Todas, Para 1, Para 2, Para 4, Para 6+), tarjetas con foto, antes/ahora, ahorro, vigencia y modalidad |
| 2 | Constructor de combo móvil (`Combo.dc.html`) | Super Dúo paso a paso: «Pizza 1 de 2», «Pizza 2 de 2»; grilla de especialidades con foto; resumen y botón que dice lo que falta |
| 4 | Constructor · Super Trío (`Combo-Trio.dc.html`) | El mismo constructor con prop `oferta="supertrio"`: tres pizzas familiares, $33.900 (antes $41.700) |
| 5 | Constructor · Box Halloween (`Combo-Halloween.dc.html`) | Prop `oferta="halloween"`: una pizza mediana a elección; Coca-Cola 1,5 L y box Dulce y Truco ya incluidas; $19.990, hasta el 2 de noviembre. Destino del hero de Halloween |
| 3 | Ofertas escritorio (`Ofertas-Desktop.dc.html`) | Misma página en grilla, con la oferta destacada arriba |

## Reglas

1. **Cada oferta tiene URL propia** (`/promos/super-duo`) que funciona desde un anuncio aunque no haya tienda: se arma el combo y la tienda se pide al agregar.
2. **Si la oferta no aplica** en la tienda o modalidad elegida (solo retiro, días, horario), se avisa en la tarjeta antes de abrirla, con la alternativa.
3. **El constructor muestra el avance** («1 de 2 elegidas») y el botón dice lo que falta («Elige 1 pizza más»); cuando está completo: «Agregar Super Dúo · $22.590».
4. **Precio fijo visible** todo el tiempo; si una especialidad tiene recargo dentro del combo, se muestra junto a la foto («+$1.000»).
5. **Ahorro en pesos** junto al precio tachado.
6. **Vigencia visible** cuando quedan 7 días o menos («Hasta el 2 de noviembre»).

## Modelo en Commerce Cloud

| Concepto | Cómo se resuelve | Tipo |
|---|---|---|
| Combo con elección | Producto set o bundle con slots configurables, o promoción «compra X por $Y» sobre una categoría de pizzas | Desarrollo + configuración |
| Vigencia, días y modalidad | Calendario y condiciones del motor de promociones; calificador por envío (retiro o delivery) | Configuración |
| URL de oferta | Página de oferta (Page Designer) o ruta propia `/promos/:id` | Desarrollo |
| Filtro por ocasión | Atributo `c_occasion` del combo | Configuración |

## Supuestos

- Recargos por especialidad dentro del combo: sin dato en la API; el diseño no muestra recargos.
- Fotos de combos: recortes de campañas (E19).

## Historial

| Fecha | Cambio |
|---|---|
| 16-oct-2026 | v1: listado de ofertas por ocasión y constructor del Super Dúo |
| 16-oct-2026 | Constructor con prop `oferta`: Super Dúo, Super Trío (3 familiares, $33.900) y Box Halloween (1 mediana + Coca-Cola 1,5 L + box Dulce y Truco incluidos, $19.990, hasta el 2 de noviembre). El hero de Halloween y las tarjetas de Ofertas llevan a su constructor |
| 17-oct-2026 | Kit (casos 2 y 14): prop `estado="no-disponible"` en el constructor y pantalla `Combo-NoDisponible` (Super Dúo solo para retiro → retirar en El Bosque u ofertas con delivery, R2.6); pantalla `Oferta-Vencida` (el enlace de un anuncio viejo muestra tres ofertas vigentes, R2.7) |
| 17-oct-2026 | Revisión UX v2: `Oferta-Vencida` usa la oferta del Día de la Pizza (terminó el 9 de febrero) en vez de Halloween, que sigue vigente; la primera alternativa es el Box Halloween con su precio real |
