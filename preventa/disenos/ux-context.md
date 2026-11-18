# Contexto para la revisión UX

> Lo usa el skill `ux-review`. Se completa una vez por proyecto y se actualiza cuando cambian la demo o el alcance. Inferido el 17-oct-2026 de `disenos/`, el kit del cliente y la memoria del proyecto: corregir si algo no calza.

## Negocio

- **Cliente:** Papa Johns Chile
- **Tipo de negocio:** QSR/delivery de pizza → vertical: `qsr-delivery`
- **País y mercado:** Chile, CLP, Mercado Pago y efectivo en la demo (el kit pide además Webpay, Fintoc, Pluxee, billeteras, BIN y Gift Card); boleta o factura con RUT; Ley del Consumidor
- **Objetivo del cliente con el canal digital:** pasar de un ecommerce funcional a uno «que provoque hambre», personalizado por perfil, y subir conversión web (~14% → 18%), cross-selling (~25% → 35%), ticket (+5%) y recompra (> 30%)
- **Métricas que el cliente mira:** CVR, bounce < 30%, pago aprobado > 97%, cross-selling 35%, carga < 2,5 s, base identificada > 70% (kit, sección 09)

## Personas y tareas

| Persona | Quién es | Tarea principal | Dispositivo |
|---|---|---|---|
| Sofía | Heavy user, con sesión | Repetir su pedido en un toque y canjear puntos | Móvil y escritorio |
| Diego | Switcher, llega desde un anuncio | Armar la oferta del anuncio o la del momento (almuerzo, partido) | Móvil |
| Valentina | Lapsed, 2 años sin comprar, vuelve por un correo | Volver a confiar: ver valor, pedir sin sorpresas, seguir el pedido | Móvil |
| Presentador (Avatar) | Opera la demo | Gatillar eventos, mensajes y casos sorpresa | Escritorio |

## Marca y design system

- **Kit o brief del cliente:** `datos/cliente/kit-pj/README.md` (transcripción completa)
- **Checklist de cumplimiento existente:** `disenos/checklist-kit.md`
- **Paleta y tipografías:** verde marca #1E4D33 / #133423, lima #D7EA4A, crema #FFFBF5, rojo precio #B3261E; Barlow y Barlow Condensed

## Plataforma

- **Se construye sobre:** Salesforce B2C Commerce con **Storefront Next** (no SFRA ni PWA Kit) + Marketing Cloud + Order Management; Loyalty simulado → más cercano: `references/plataformas/sfcc-composable.md`

## Fuente de los diseños

- **Lienzo:** https://claude.ai/artifact/WAK6JrPuHueQ1fozG9EXKk
- **Respaldo local:** `disenos/_canvas/`
- **Convención de revisiones:** `disenos/revision-ux-v1.md` (la siguiente es v2)

## Alcance de la demo

- **Entra en la demo:** clientes registrados (Sofía, Diego, Valentina); Home por perfil, menú, ficha, hoja, carrito, checkout, seguimiento con OMS real, Papa Puntos simulado, Marketing Cloud real, panel del presentador, 5 casos sorpresa
- **Queda para el proyecto:** invitado, estados de borde, mínimo de delivery, App nativa, agregadores, Call Center
- **Fecha de la demo:** viernes 20-nov-2026 (solo B2C Commerce con Storefront Next; OMS y Marketing Cloud se explican con arquitectura, ver `demo/PLAN.md`)
