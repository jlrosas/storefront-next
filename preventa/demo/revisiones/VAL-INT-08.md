# VAL-INT-08 · Sesión de los perfiles en el encabezado

**Veredicto: APROBADA** (con 3 hallazgos menores/medios que no bloquean).

Entorno: worktree `storefront-wt/INT`, rama `hu/INT` (6a85f76), `pnpm dev --port 5186`, Chrome headless en contexto aislado `VAL-INT08`. 390x844 DPR 2 (Android emulado) y 1440x900. Sin escrituras en el sandbox.

## Criterios
| # | Criterio | Res. | Evidencia |
|---|---|---|---|
| 1 | Con `perfil=sofia/diego/valentina` el encabezado muestra al cliente, no «Ingresar» | ✅ | 1440: «Hola, Sofía · 340 pts», «Mi cuenta: Diego» (sin píldora, 0 pts), «Valentina · 40 pts»; 390: «Sofía/Diego/Valentina» en «Cuenta» de la barra. `VAL-INT-08-home-{sofia,diego,valentina}-{390,1440}.png` |
| 2 | El chip toma la modalidad del perfil («Retiro · 15 min / El Bosque») en todas las rutas | ✅ | Sofía: chip correcto en Home, menú, ficha, `/mitades`, `/promos`, `/store-locator`, `/cart` a 390; en Home, `/mitades`, `/store-locator`, `/cart` a 1440 (menú, promos y ficha a 1440 solo por SSR, ver No cubierto). Diego/Valentina: «Retiro o delivery · Elige tienda» (modalidad borrada) |
| 3 | Casos de borde | ✅ | Sofía elige Salvador → chip «Retiro · 35 min / Salvador», la línea del hero «Retiro en Salvador · listo en 35 min», persiste al recargar con `?perfil=sofia` (gana su elección). Sofía→Diego → chip «Elige tienda». Diego→`?perfil=auto` → «Ingresar» / «Cuenta» genérica, sin chip. Cambio a Sofía desde estado con Salvador restablece El Bosque |
| 4 | Invitado no cambia | ✅ | `?perfil=auto` e invitado puro: «Ingresar», «Retiro o delivery · Elige tienda», barra «Cuenta» (`...home-auto-390.png`, `...home-invitado-1440.png`) |
| Regresión HOM-08: 3 favoritas + canje | ✅ | 1440: 3 tarjetas; la tercera (Super Pepperoni, «Canjear · 260 pts») sobre rgb(227,194,237) (lila = Garlic). 390: carrusel con las 3 y la tarjeta Papa Puntos |
| Regresión: línea «Retiro en … · listo en …» | ✅ | El Bosque 15 min → Salvador 35 min al elegir otra tienda |
| Regresión: CTA hero sobre la barra a 390x844 | ✅ | Sofía «Repetir pedido» 710–762 (barra desde 779); Valentina «Lo quiero» 710–762; Diego «Armar mi Super Dúo» 669–721 |
| #81 (cliente sin barra en ficha, `/mitades`, `/store-locator`, `/cart` a 390) | ➖ pendiente UXD | Confirmado: sin barra fija y sin cliente (0 `nav` fijos); no se rechaza |
| ADA | ✅ | Contraste en 1440: texto de nav 6,44:1, avatar 4,87:1, píldora 5,73:1. Fuente mínima del encabezado 12 px («Retiro · 15 min»). Áreas: header ≥44 px; barra 78x64; chip 390 de 74x44 sin truncar |
| Consola | ✅ | Solo ruido de dev: WebSocket HMR 24678 (400, puerto compartido con otros dev servers) y aviso de hidratación `nonce` en `critical.css`; ninguno del cambio |

## Hallazgos
| # | Sev. | Hallazgo | Resp. |
|---|---|---|---|
| H1 | Media | Parpadeo al primer render con `?perfil=sofia`: el chip pasa por «Retiro o delivery · Elige tienda» → **«Retiro, pj-48»** (ID de tienda donde va el nombre) → «Retiro · 15 min / El Bosque». Medido con MutationObserver; el SSR siempre trae «Elige tienda» (el chip de modalidad no se pinta en servidor aunque la cookie exista). Tocar el chip lo resuelve en ~1 s, pero en la demo se ve | INT (chip/`fulfillment-store`) |
| H2 | Baja | Al pasar de Sofía a Diego o a `auto`, la cookie se borra y el chip dice «Elige tienda», pero `localStorage.pj_fulfillment_meta` conserva la tienda anterior (El Bosque o Salvador). Hoy no se ve; podría filtrarse si algo lee el meta | INT |
| H3 | Baja | El banner de cookies tapa el CTA del hero (Home Sofía a 390, primera carga). Ya existía, no es de INT-08; el CTA queda sobre la barra | UXD |
| H4 | Info | `<title>` vacío en `/store-locator` (TIE-05) | TIE |
| H5 | Info | Diego (registrado, 0 pts) ve el cintillo «Primer pedido directo: +100 Papa Puntos»; consistente con el supuesto de demo, solo anotarlo | OPV |

## Evidencia

## No cubierto
- Menú, promos y ficha a 1440 con chip real (solo SSR: cuenta correcta).
- Diego, Valentina y el invitado: Home y encabezado a 390 y 1440; rutas internas de ellos solo por SSR.
- Sofía-Salvador a 1440.
- Safari iOS.
- Contraste de las tarjetas de Home (fuera de INT-08).

## Cambios en el ambiente
Ninguno en el sandbox. Servidor del 5186 detenido; página de VAL-INT08 cerrada.
