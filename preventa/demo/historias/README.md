# Historias de usuario de la demo

- **Fecha:** 06-nov-2026 · **Versión:** v1 (pendiente de la revisión de REV)
- **Fuente:**
  - El lienzo https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk. Se verificó el 06-nov que la versión publicada es idéntica al respaldo `disenos/_canvas/`.
  - Los diseños `disenos/01`–`12`, R1–R6 y [CONTRATO.md](../CONTRATO.md).
- **Ajustada con la revisión de REV del 06-nov** ([REV-0](../revisiones/REV-0-historias.md)) y con las decisiones de Raúl (S-D1, S-D2, S-D4 y S-D12 en el [contrato](../CONTRATO.md)).
- **Cómo se leen:**
  - Cada historia tiene un dueño (ver [EQUIPO.md](../EQUIPO.md)), las pantallas del lienzo que debe igualar y criterios de aceptación que VAL comprueba en el navegador.
  - **Igualar el lienzo** significa: misma jerarquía, textos, orden, precios y estados en 390 px y 1440 px. La implementación usa los componentes de Storefront Next y los tokens de `pj-shared`.

## Objetivos de la demo (contra esto revisa REV)

1. **Que dé hambre** (principio 9): la comida primero, fotos grandes y a sangre, textos que se saborean, precio después del antojo.
2. **Que Papa Johns vea un partner que entiende su negocio** ([demo-no-proyecto](../../disenos/README.md)): los tres perfiles del kit con sus recorridos completos, sin promesas falsas.
3. **Los tres guiones de punta a punta** (12 · guion sugerido, sin Marketing Cloud ni OMS):
   - **Valentina:** llega por reactivación → Home → arma su pedido → ingresa con código → paga → sigue su pedido.
   - **Diego:** anuncio del Super Dúo → la promesa se cumple → constructor → compra.
   - **Sofía:** reconocida → «¿Lo de siempre?» → paga con canje → pedido en curso → después.
4. **Principios del diseño 00:** ver antes de elegir tienda (1), un toque (2), precio visible y comparable (3), la promesa del anuncio se cumple (4), puntos en cada paso (5), según quién es (6), rápido y accesible (7), administrable (8), que dé hambre (9).
5. **Solo Commerce:** lo que en el diseño hacía OMS o Marketing Cloud se simula como dice el [contrato](../CONTRATO.md).

## Índice

| Agente | Archivo | Historias | Oleada |
|---|---|---|---|
| INT · Integrador | [INT.md](INT.md) | INT-01 a INT-05 | 0 |
| DAT · Datos y Commerce | [DAT.md](DAT.md) | DAT-01 a DAT-10 | 0 → 3 |
| HOM · Home | [HOM.md](HOM.md) | HOM-01 a HOM-06 | 1 y 3 |
| MEN · Menú | [MEN.md](MEN.md) | MEN-01 a MEN-04 | 1 |
| PRO · Producto | [PRO.md](PRO.md) | PRO-01 a PRO-05 | 1 |
| OFE · Ofertas | [OFE.md](OFE.md) | OFE-01 a OFE-04 | 1 |
| TIE · Tienda | [TIE.md](TIE.md) | TIE-01 a TIE-03 | 1 |
| CAR · Carrito | [CAR.md](CAR.md) | CAR-01 a CAR-04 | 2 |
| ING · Ingreso | [ING.md](ING.md) | ING-01 a ING-02 | 2 |
| CHK · Checkout | [CHK.md](CHK.md) | CHK-01 a CHK-06 | 2 |
| SEG · Seguimiento | [SEG.md](SEG.md) | SEG-01 a SEG-03 | 3 |
| CTA · Cuenta y puntos | [CTA.md](CTA.md) | CTA-01 a CTA-03 | 3 |
| PAN · Panel | [PAN.md](PAN.md) | PAN-01 a PAN-02 | 3 |

## Fuera de la demo (no se construye)

- Checkout y seguimiento de invitado (`Checkout-Invitado`).
- Cancelación parcial desde OMS (`Seguimiento-Cancelacion`).
- Mensajes de Marketing Cloud y el teléfono de muestra del panel.
- `Dashboard-Demo`.
- Modalidad «Comer aquí» (pendiente de revisar, S-D10).
- Constructor del Box Halloween (`Combo-Halloween`, vencido: S-D1).
- Constructor de Papa Combo Palitos (no está dibujado: S-D3).
- Pizza de 4 partes, tope diario de puntos, efectivo deshabilitado por tienda, aviso de producto no disponible al cambiar de tienda (estados de borde, quedan para el proyecto).
- Opciones de invitado en el ingreso y en la página de puntos (S-D14).
