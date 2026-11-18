# VAL-HOM · Validación de HOM-01 a HOM-04

Entorno: `storefront-wt/HOM` (rama `hu/HOM`, HEAD 4debc77), `sfnext dev --port 5174`, navegador `chrome-devtools-headless` (contexto aislado VAL-HOM). Viewports: 390x844 móvil emulado (Android) y 1440x900. Usuario de Sofía: `val1@demo.pj.cl`.

## Veredicto
- HOM-01: RECHAZADA (el aviso de cookies tapa precio y botón del hero en la primera visita en móvil).
- HOM-02: APROBADA.
- HOM-03: APROBADA.
- HOM-04: RECHAZADA (sin video en el hero; la visibilidad por grupos de clientes no está en lo entregado).

## HOM-01
| # | Criterio | Res. | Evidencia |
|---|---|---|---|
| 1a | Hero Pizza del Mes The Works Familiar $10.990, antes desde $21.900, texto (no imagen), foto grande | ✅ | 390 y 1440: `$10.990` y `Antes desde $21.900` son texto; foto 390 px nativos |
| 1b | Movimiento lento con botón de pausa | ✅ | animación `pj-ken-burns`; clic en «Pausar movimiento» pasa a `paused` y «Reanudar movimiento»; otro clic vuelve a `running`; botón 44x44 |
| 1c | Respeta «reducir movimiento» | ✅ | con `prefers-reduced-motion: reduce` la animación es `none` y no hay animaciones activas (el botón de pausa no se muestra) |
| 1d | LCP del hero ≤ 2,5 s (Lighthouse móvil) | 🚫 | No medible: dev server con la máquina cargada (otros agentes corriendo vitest). Medición informal 7,2 s, no válida. Falta medir contra build de producción |
| 2 | Saludo en una línea con el texto del lienzo; sin bloque «Pizza del mes» aparte | ✅ | «Hola de nuevo. Tu pedido de vuelta suma Papa Puntos dobles.» El lienzo lo pone debajo del encabezado y **antes** del hero (Home.dc.html línea 40); la implementación coincide con el lienzo, no con «después de la comida» del criterio. En 390 ocupa 2 líneas (en el lienzo, 1 línea a 390). Bloque «Pizza del mes» ausente |
| 3 | «Lo quiero» abre el producto listo para agregar | ✅ | `/cl/es-CL/p/cb-pizza-del-mes`: título The Works Familiar, $10.990, botón «Agregar al carrito» |
| 4a | Empieza tu pedido: Delivery «Llega en 35–45 min», Retiro «Listo en 15 min» | ✅ | Destinos `/store-locator?modo=delivery` y `?modo=pickup`; 174x69 px en 390 |
| 4b | Más vendidas con ★, insignia y «N esta semana» solo si N≥100 | ✅ | Pollo BBQ 4,7 · 320; Super Pepperoni 4,8 · 410; Todas las Carnes 4,6 · 260; insignia «Más pedida». El caso N<100 no se pudo probar (no hay datos) |
| 4c | Beneficios sin «sin crear cuenta» (S-D13) | ✅ | «Sigues tu pedido en vivo» |
| 4d | Orden de bloques del lienzo | ✅ | saludo, hero, Delivery/Retiro, más pedidas, beneficios (390 y 1440). En 1440 se agregan tarjetas Menú y Promos junto a Delivery/Retiro; el lienzo desktop no se comparó pixel a pixel |
| 5 | Cookies en la primera visita, sin tapar el hero | ❌ | En 390x844 el aviso («Consentimiento de seguimiento», top 562 a bottom 772 px) cubre el precio ($10.990, top 538) y el botón «Lo quiero» (y 604–656). Ver `VAL-HOM-valentina-390-viewport.png`. No se pudo repetir en 1440 (el contexto ya había aceptado) |
| 6 | Hero, bloques y textos editables en Page Designer, un `@Component` por bloque | ✅ | 11 `@Component` en `src/components/pj-home/` (hero-food, serves, month, popular, balance, usual, greeting, start-order, favorites, moments, benefits) |

## HOM-02 (`?utm_campaign=PJSD26`)
| # | Criterio | Res. | Evidencia |
|---|---|---|---|
| 1 | Hero «La oferta que viste»: Super Dúo $22.590, antes $27.800; botón al constructor | ✅ | Botón «Armar mi Super Dúo» a `/promos/super-duo` (52 px). El texto dice «Para 4» (S-D16), no «Alcanza para 6» del lienzo |
| 2 | Carrusel ¿Para cuántos? con foto y precios crecientes | ✅ | Para 1 Papa Flash $5.490 · Para 2 Papa Combo Palitos $16.490 · Para 3 «Pizza del Mes + Palitos + bebida» $20.470 · Para 4 Super Dúo $22.590 · Para 6+ Super Trío $33.900. Hero y carrusel coinciden en «Para 4» |
| 3a | Papa Flash y Papa Combo Palitos a su ficha | ✅ | `/p/cb-papa-flash`, `/p/cb-papa-combo-palitos` |
| 3b | «Para 3» agrega tres líneas con aviso | ✅ | Aviso «¡Agregada! Armado para 3 · +20 Papa Puntos por acreditar · Ver mi pedido»; carrito: The Works Familiar $10.990 + Palitos de Ajo $5.990 + Coca-Cola 1.5 L $3.490 = $20.470 (suma real, ícono del carrito en 3) |
| 3c | Super Dúo y Super Trío a su constructor | ✅ | `/promos/super-duo` y `/promos/super-trio` |
| 4 | ¿Y para este momento?: tarjeta que cambia con la hora, tocable, `?hora=` la fuerza | ✅ | almuerzo: Papa Flash $5.490 (`/p/cb-papa-flash`) · partido: Super Trío $33.900 · celebración: Papa Combo con Postre $17.490 (`/p/cb-papa-combo-postre`) · bajón: Papa Combo Palitos $16.490. Va después del carrusel |
| 5 | Siguen «Más vendidos»; sin «Promos del día» | ✅ | Más vendidos presente; no hay «Promos del día» |

## HOM-03 (val1@demo.pj.cl, `?perfil=sofia`)
| # | Criterio | Res. | Evidencia |
|---|---|---|---|
| 1 | «Hola, Sofía» con 340 Papa Puntos = $17.000 | ✅ | 390 y 1440; el chip enlaza a `/puntos` |
| 2a | Hero «¿Lo de siempre?» con último pedido real | ✅ | «Pollo BBQ Familiar sin cebolla + Palitos de Ajo + Coca-Cola Sin azúcar 1,5 L · 2 oct · $23.890», fotos de las tres líneas |
| 2b | «Repetir pedido» carga las líneas y va directo a `/checkout` | ✅ | Navega a `/cl/es-CL/checkout` sin pasar por «Mi pedido»; 3 líneas: Pollo BBQ Familiar $16.900, Palitos de Ajo $4.417 (lista $5.990), Coca-Cola Sin azúcar 1.5 LT $2.573 (lista $3.490) = $23.890 más despacho $1.990 = $25.880 |
| 3 | Favoritas, canje Super Pepperoni (260 puntos) y Pizza del Mes The Works | ✅ | Pollo BBQ «La pediste 4 veces» $16.900; Todas las Carnes «3 veces» $18.900; «Ya puedes canjear una Super Pepperoni mediana · Tienes 340 puntos ($17.000) · la canjeas con 260»; The Works $10.990 / $21.900 |

## HOM-04 (por código y composición por defecto)
| # | Criterio | Res. | Evidencia |
|---|---|---|---|
| 1 | Componentes registrados y generados: hero con video, ocasiones, para cuántos, más pedidas, beneficios, lo de siempre, saldo | ⚠️ | Generados 11 JSON `pj*.json` en `cartridges/.../experience/components/Content/`. Hay ocasiones (pjMoments), pjServes, pjPopular, pjBenefits, pjUsual y pjBalance. **El hero no tiene video**: `pjHeroFood` solo anima una imagen (atributo `animate`); no hay `<video>` ni campo de video |
| 2 | Visibilidad por grupos de clientes de PD (contrato §2) y una sola página `homepage` | ❌ | Hay una sola página `homepage` (`src/extensions/pj-home/page-designer/homepage.library.xml`), pero cada componente se filtra con un atributo propio `profile` (todos/valentina/diego/sofia) y el bloque `visibility` va vacío (`{"visibility": []}`). Ningún grupo (`pj-reactivacion`, `pj-anuncio`, `pj-frecuente`) está en la biblioteca; el comentario del XML lo deja como paso manual en Business Manager |
| 3 | INT cambia el hero de temporada desde BM sin desplegar | ⚠️ | `pjHeroFood` expone productId, eyebrow, description, ctaLabel, destination, variant, animate, profile. No se probó en BM (componente sin desplegar, fuera de alcance) |

## Diferencias visibles con el lienzo
- Hero de Valentina: Pizza del Mes The Works en vez de Box Halloween (esperado por S-D1/§1.1); la insignia dice -50% (el lienzo -16%).
- Saludo de Valentina: 2 líneas a 390 (el lienzo, 1).
- Diego: «Para 4» en el hero (el lienzo «Alcanza para 6», S-D16); «Para 3» a $20.470 «armado para 3» por suma real.
- Desktop de Valentina: se agregan tarjetas «Menú» y «Promos» junto a Delivery/Retiro.
- Desktop de Sofía: «Tus favoritas» muestra 2 tarjetas en una grilla de 3 columnas, con espacio vacío a la derecha.
- Cookies: el aviso es el de la plantilla base («Consentimiento de seguimiento», Rechazar/Aceptar), no el del lienzo («cookies para recordar tu tienda y tu pedido…»).
- La comparación fue por código del lienzo y lectura de capturas de la implementación. No abrí capturas del lienzo para una comparación visual lado a lado.

## Hallazgos nuevos
1. (HOM-01, bloqueante) El aviso de cookies tapa el precio y «Lo quiero» del hero en la primera visita móvil.
2. (HOM-04) Sin video en el hero, y la visibilidad por grupos de clientes depende de un atributo `profile` propio, con `visibility` vacío.
3. (HOM-03, CHK) «Repetir pedido» muestra «Retiro en El Bosque» pero el checkout abre en «Despacho a domicilio» ($1.990). Además, la línea del Pollo BBQ no muestra «sin cebolla».
4. (Menor, accesibilidad) El texto del precio para lector de pantalla queda «$10.990, Antes Antes desde $21.900» (palabra «Antes» duplicada).
5. (Menor, base) El botón de envío del formulario de `/login` se llama «Registrarse». No es de HOM.
6. (Información) `?perfil=auto` no borra las cookies `pj_campana` ni `pj_hora`; la campaña PJSD26 sigue mandando después de `?perfil=auto` (por diseño del middleware). Para volver a Sofía hay que usar `?perfil=sofia&hora=ahora`.

## Consola
- Errores de WebSocket de Vite (`ws://localhost:24678` rechazado): el puerto HMR ya lo usaba otro servidor de desarrollo; ruido del ambiente, sin efecto en el flujo.
- Aviso de hidratación (`nonce={undefined}` vs `nonce=""` en el CSS crítico): plantilla base, no de HOM.
- «There are no active adapters to send the event to»: warn de la plantilla base.
- Sin errores propios de HOM.

## Áreas táctiles y contraste
- Áreas táctiles: no hay controles visibles por debajo de 44 px en 390 ni en 1440 (pausa 44x44, CTA 52, Delivery/Retiro 69, Agregar 44, momentos 44, tarjetas 206).
- Contraste: revisión visual en las capturas (lima sobre verde oscuro, blanco sobre rojo, texto oscuro sobre blanco), sin hallazgos. No se calculó la razón numérica de ningún par.

## No cubierto
- LCP con Lighthouse (dev server cargado).
- Cookies en 1440 (la primera visita ya estaba aceptada en el contexto).
- «N esta semana» con N<100 (sin datos).
- HOM-04 en Business Manager (no desplegado).
- Perfil de Valentina con sesión real (`valentina@demo.pj.cl`); se forzó con `?perfil=valentina`.
- Safari iOS.

## Cambios en el ambiente
- Se detuvo mi servidor del puerto 5174; el 5174 quedó libre. Antes de arrancarlo no había proceso propio del constructor en ese puerto.
- Carrito de `val1` modificado (Para 3 de Diego como invitado, luego Repetir pedido). Sin pedidos creados ni escrituras en el sandbox.
- Mi página queda en `about:blank` (contexto VAL-HOM). Las páginas 1, 2 y 3 del navegador headless pertenecen a otras sesiones y no las toqué.
