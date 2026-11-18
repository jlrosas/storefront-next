# VAL-FINAL · Recorrido completo de compra (rama `demo`, localhost:5173, sandbox zyfj-001)

- **Fecha:** 07-nov-2026 · **Navegador:** headless-2, contexto aislado por recorrido · **Viewports:** 390x844 DPR 2 (Android emulado) y 1440x900 (Diego y Sofía)
- **Pedido de prueba:** `dev-chk` → **00000111** ($23.890, +23 Papa Puntos, quedarás con 103). Un solo pedido.
- **Método:** `evaluate_script` + fragmento de EVAL-agregar (vuelos = `IMG position:fixed` agregadas al body; avisos = `data-testid*=toast`).

## Veredicto global: **APTO PARA DESPLEGAR** (con 2 hallazgos mayores y 4 menores que no rompen la compra)

El recorrido completo, de la Home a la confirmación con el número de pedido, funciona a 390 y a 1440, y los números del pedido canónico cuadran.

**Nota del recorrido de compra: 8,5 / 10.**

## Recorrido 1 · Valentina invitada (390)
| Verificación | Res. | Evidencia |
|---|---|---|
| «+/Agregar» de Pollo BBQ en la Home abre la hoja | ✅ | r1-01-hoja |
| Panel «Para agregar tu Pollo BBQ Familiar» → Retiro El Bosque → Confirmar | ✅ | texto del panel |
| «Completa tu pedido»: franja «Pollo BBQ agregada · Editar» + «Hazlo combo» + bebidas 1,5 L / 2,5 L + acompañamientos + postres | ✅ | r1-02-completa |
| «Hazlo combo» (Sin azúcar por defecto): total $16.900 + $6.990 = **$23.890** | ✅ | CTA «Ver mi pedido (3) $23.890» |
| 2.ª pizza desde la ficha con «+ Pepperoni» (Super Pepperoni $18.840): sin «Hazlo combo» | ✅ | r1-03 |
| 2,5 L sugerida en la 2.ª pizza | ⚠️ no aparece: el carrito ya tenía Coca-Cola 1,5 L (el bloque de bebidas y los acompañamientos se ocultan porque ya hay palitos y bebida; solo quedan postres). Se ve la sugerencia de 2,5 L en Super Dúo, Pizza del Mes y mitades (sin bebida). Coherente, pero no es lo que el guion describe | r1-03 |
| Carrito: extras visibles («+ Pepperoni»), «¿Le sumamos algo?» solo ofrece Cookie (no repite palitos ni Coca), totales: 16.900 + 6.990 + 18.840 = 42.730 = Productos 45.220 − 2.490 | ✅ | r1-04-carrito |
| Vuelo / aviso: 1.ª pizza fly=1 + franja (sin toast); 2.ª pizza fly=1 + franja | ✅ | `__pj` |

## Recorrido 2 · Diego (390 y 1440*)
| Verificación | 390 | 1440 | Evidencia |
|---|---|---|---|
| Hero «Armar mi Super Dúo» → constructor | ✅ | ✅ (entrada directa a `/promos/super-duo`) | r2-01 |
| Personalizar Pollo BBQ: + Pepperoni, sin cebolla; botón «Listo +$1.940»; CTA «Agregar Super Dúo · **$24.530**» | ✅ | ✅ | |
| Panel «Para agregar tu Super Dúo» y «Completa tu pedido» (2,5 L sugerida: «La de 2,5 L alcanza para toda la mesa») | ✅ | ✅ | r2-02 |
| Carrito: bloque «SUPER DÚO $24.530 · $22.590 + $1.940 en extras» con cada pizza y su detalle; Total $24.530 | ✅ | ✅ | r2-03, r2-04 |
| «Quitar Super Dúo» → «Quitaste Super Dúo · Deshacer» → Deshacer restaura el grupo con su configuración | ✅ | ✅ | |
| Vuelo al agregar el combo | ⚠️ fly=0 (solo franja) en ambos viewports | ⚠️ | ver H4 |

## Recorrido 3 · Mitades
| Verificación | Res. | Evidencia |
|---|---|---|
| `/mitades` Pollo BBQ + Todas las Carnes Familiar: botón «Agregar $17.900», panel «Confirmar y agregar $17.900» | ✅ | r3-01 |
| Carrito $17.900 y «Este pedido suma 17 Papa Puntos» (coinciden) | ✅ | texto del carrito |
| Extra en Mediana: Pollo BBQ Mediana $13.000 → «+ Pepperoni» $1.450 → $14.450 (Familiar: $1.940) | ✅ | script |
| Primera pizza: «Hazlo combo» ofrecido; fly=0 | ⚠️ ver H4 | |

## Recorrido 4 · Fichas sin template
| Verificación | Res. | Evidencia |
|---|---|---|
| `/p/cb-pizza-del-mes` agrega con complementos (palitos): «Agregar combo + 1 $16.980» = 10.990 + 5.990; luego «Completa tu pedido» | ✅ (fly=2, ver H2) | |
| `/p/cp-coca-cola` de marca, sin código postal, selector de tamaños | ✅ | r4-01 (abierta) |
| `/p/cp-brownie` de marca, sin código postal | ✅ | r4-02 |
| `/p/cb-super-duo` → 302 a `/promos/super-duo` | ✅ | `fetch` redirected, URL final |

## Recorrido 5 · Sofía con sesión (390; 1440 solo hasta el checkout)
| Verificación | Res. | Evidencia |
|---|---|---|
| Login `dev-chk` (`/login` de marca) → «Hola, Sofía · 340 puntos» | ✅ | |
| «Repetir pedido» → checkout con 4 productos | ⚠️ funciona, pero (a) repite la Super Pepperoni canjeada como línea pagada $13.000 (H-conocido #133) y (b) no hereda la modalidad/tienda («¿Retiro o delivery? Elegir»), y la tarjeta de la Home dice $38.880 y el checkout $36.890 | r5-05 |
| Armado a mano: quitar la línea de $13.000, `/puntos` → «Canjear y agregar a mi pedido» → carrito con Super Pepperoni mediana **$0** (antes $13.000), «Te quedan 80», Total **$23.890** | ✅ | r5-01, r5-02 |
| Checkout de marca con tarjeta guardada ····4521 + CVV | ✅ | r5-03 |
| Confirmación: pedido **00000111**, «¡Pago aprobado!», **+23 Papa Puntos**, «quedarás con 103 puntos» | ✅ | r5-04 |
| Desktop: checkout de dos columnas, resumen, canje visible | ✅ | r5-05-checkout-1440 |

## Recorrido 6 · 404
| Verificación | Res. | Evidencia |
|---|---|---|
| `/esta-pagina-no-existe` → título «Esta página se nos quemó» | ✅ | r6-404 |

## Recorrido 7 · Vuelo y aviso por agregado (EVAL-agregar)
| Agregado | fly | toast | franja | Res. |
|---|---|---|---|---|
| Hoja, 1.ª pizza (Pollo BBQ) | 1 | 0 | sí | ✅ (decisión VAL-PRO R2) |
| Ficha, 2.ª pizza (Super Pepperoni) | 1 | 0 | sí | ✅ |
| Constructor Super Dúo (390 y 1440) | **0** | 0 | sí | ⚠️ |
| Mitades (armador) | **0** | 0 | sí | ⚠️ |
| Ficha combo (Pizza del Mes) | **2** | 0 | sí | ❌ (doble vuelo) |

## Hallazgos
| # | Sev. | Hallazgo | Dueño |
|---|---|---|---|
| H1 | **Mayor** | Quitar la línea «Super Pepperoni» en el carrito de un pedido repetido, con el clic sintético (script) provocó la pantalla «ALGO SALIÓ MAL: Body is unusable: Body has already been read» en `src/lib/cart/basket-action.server.ts:158` (`request.formData()` leído dos veces). Con clic real (uid) funcionó. Sin confirmar: puede ser ruido de la automatización, pero un doble envío en el móvil mostraría una pantalla de error en plena demo. Captura: r5-00-error-quitar-390 | CAR / SEG |
| H2 | **Mayor** | Vuelo doble en la ficha de combo (`cb-pizza-del-mes`): fly=2 (D-P1-4 de EVAL sigue vivo) | PRO |
| H3 | Menor | «Repetir pedido» repite la pizza canjeada a $13.000 (#133), pierde la modalidad y la tienda, y el monto de la Home ($38.880) no coincide con el checkout ($36.890). Para la demo conviene armar el pedido canónico a mano o corregir | CHK / ADD |
| H4 | Menor | Sin vuelo al agregar el Super Dúo ni mitades (fly=0, solo franja); la regla pide 1 vuelo + 1 aviso o franja | OFE / PRO |
| H5 | Menor | «Ahorras $11.210» en el carrito de un Super Dúo con extras: es contra la lista de las dos pizzas (33.800) y el hero/constructor dice «antes $27.800». Dos cifras de ahorro distintas para el mismo combo | OFE / CAR |
| H6 | Menor | Tras pagar con canje, la Home sigue mostrando 340 puntos (la confirmación dice 103). Posiblemente es el saldo simulado; el presentador debe saberlo. Además, Valentina «puntos al doble» aparece en la Home, pero el carrito muestra 42 (sin duplicar) | DAT / CAR |
| H7 | Menor | La línea «Combo Palitos y bebida» usa la foto de una pizza (no de los palitos) | CAR |
| H8 | Informativo | 2,5 L sugerida y acompañamientos no aparecen en la 2.ª pizza si ya hay bebida o palitos en el carrito (ver R1) | PRO |

## No cubierto
- Valentina y el flujo «+» de la Home a 1440; Diego en el hero real a 1440; checkout con delivery y programado; Sofía pagando a 1440 (un solo pedido permitido).
- Consola y red no se listaron de forma sistemática (no se vieron errores en pantalla salvo H1).
- Safari iOS.

## Cambios en el ambiente
- Pedido 00000111 de `dev-chk` (canje de 260 puntos), sin revertir. Carritos de invitado y de `dev-chk` abandonados. Las páginas se cerraron (queda `about:blank` en VAL-R2, ajeno).
