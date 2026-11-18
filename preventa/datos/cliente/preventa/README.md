# Preventa Papa Johns Chile: documentación del cliente transcrita

Esta carpeta es la base de la propuesta del nuevo e-commerce de Papa Johns Chile: Salesforce Commerce Cloud, con Avatar como partner. Transcribe todo lo que llegó en `PapaJohns-Preventa/`, para no tener que volver a abrir los originales.

## Inventario de la carpeta del cliente

| Archivo original | Dónde está transcrito | Estado |
|---|---|---|
| `SALESFORCE - Respuestas .xlsx` (21-10) | [01-respuestas-salesforce.md](01-respuestas-salesforce.md) | Nuevo. 146 preguntas con respuesta del cliente, más la síntesis |
| `PapaJohns - Linea de Tiempo.xlsx` (16-10) | [02-linea-de-tiempo.md](02-linea-de-tiempo.md) | Nuevo. Plan interno del 19 al 29-oct |
| `Kit del Proveedor/Volumetria Papa Johns.xlsx` | [03-volumetria-xlsx.md](03-volumetria-xlsx.md) | Nuevo. **Versión más reciente que el PDF**; incluye las diferencias |
| `Kit del Proveedor/Formato Preguntas y Respuestas.xlsx` (13-10) | [04-formato-preguntas.md](04-formato-preguntas.md) | Plantilla con 10 preguntas sin responder, ya cubiertas en 01 |
| `Kit del Proveedor/Brand Strategy - BGYS (3).pdf` (21 láminas) | [05-brand-strategy-bgys.md](05-brand-strategy-bgys.md) | Nuevo. Estrategia de marca y tono de voz |
| `Kit del Proveedor/International BGYS Brand Playbook and Campaign Toolkit_04082024.pdf` (132 p.) | [06-brand-playbook-bgys.md](06-brand-playbook-bgys.md) | Nuevo. Toolkit visual: paleta, tipografías, lockups, fotografía, colores accesibles |
| `Kit del Proveedor/index.html` | [../kit-pj/README.md](../kit-pj/README.md) | Ya transcrito. Idéntico byte a byte al de `kit-pj/original/` |
| `Customer Journey Relato.pdf`, `Customer Journey PJ 24-09-26.png`, `Papa Johns Chile Mapa Capacidades.pdf`, `Volumetria Papa Johns.pdf`, `Flujo Online Ordering.html`, `Arquitectura cloud.png` | [../kit-pj/README.md](../kit-pj/README.md), sección «Adjuntos» | Ya transcritos. Idénticos byte a byte a `kit-pj/adjuntos/` |

## Objetivos consolidados para la propuesta

Las referencias apuntan a cada fuente: `T-n`/`A-n` son respuestas en 01, «Kit §» es el kit y «Vol.» es la volumetría.

### Qué hay que entregar

1. **Una propuesta integral** (licencias más implementación) para el **29-oct**, con referencias de clientes, idealmente visitas (A-10, A-11, A-13).
2. **Una demo frente a TD, TI, Comercial y Marketing** que cubra como mínimo las capacidades informadas (T-57, T-69).
   - Incluye **5 casos «¿Qué pasa si…?»** elegidos por nosotros, sabiendo resolver los 20 (T-58).
   - El **ambiente debe quedar disponible al menos 2 semanas** después (T-59).
3. **Personalización visible por segmento** (Sofía, Diego y Valentina) en banner, módulos del Home, orden del menú, promos, PDP/tarjeta y recomendaciones (T-7, T-112).
   - Es lo que más pesa: 25 de las 132 respuestas técnicas empiezan diciendo que la propuesta debe hacerse cargo de la experiencia por segmento en todos los canales.
4. **Campaña de la PoC** con promos reales: 50 % XL, Super Duo, Arma tu pizza y combos (T-122). Más el **flujo SAC** con ticket y contexto del pedido; un mock identificado sirve (T-65).

### Qué tiene que hacer la solución

5. **Arquitectura:** headless / API-first y desacoplada. Proponemos el storefront y el CI/CD (T-67).
   - Reemplaza la capa de ecommerce y experiencia; evoluciona el Backoffice (T-66).
   - Mantiene Aloha/OMS, Synerise y logística (T-66).
6. **Frontera de la orden:** Commerce entrega una orden idempotente a la API PJ / OMS. El OMS crea el despacho y Commerce consume los estados (T-14, T-32, T-61, T-128).
7. **Catálogo:** fuente única (MDM) de catálogo, precios y promos hacia los 6 canales, eliminando la doble carga Aloha + Backoffice (T-22, T-73, T-108).
   - **Precios** por tienda, canal y modalidad (T-74, T-94).
   - **Pizza por mitades:** se cobra la mitad más cara (T-77).
   - **Combos** fijos y configurables (T-82).
8. **Disponibilidad:** automatizar la dependencia ingrediente → producto. Una especialidad nunca se bloquea: se ofrecen sustitutos (T-102, T-105).
9. **Autonomía de Marketing:** Home, landings, banners, pop-ups, orden de módulos y menú, sin desarrollo, con CMS/DAM (T-91, T-111).
   - A/B testing desde 2 tests al mes (T-50).
   - SEO preservando URLs y usando 301 (T-113).
10. **Datos:** Synerise sigue como CDP y fuente de audiencias, sin consultarlo en cada clic. Los datos son de PJ y no debe haber lock-in. Hay que conservar 24 meses de historia (T-12, T-25, T-40, T-46).
    - **Loyalty:** basta con integrarse, pero el saldo y el canje deben ir en tiempo real sin bloquear el checkout (T-8, T-43).
11. **Escala:** picos de 7×, con 70 % de las órdenes entre las 18:00 y las 21:00 y ~9 K órdenes por hora en el Día de la Pizza. Disponibilidad de al menos 99,95 %.
    - **Debemos proponer el SLA P50/P95/P99**, con referencia de UX bajo 2,5 s y APIs con P95 bajo 1 s (Vol., T-28, T-29, T-36).
12. **Plan:** por fases o MVP en 2027, con piloto y sin salir en temporadas peak (T-70). Operación híbrida con el partner (T-71).

### Qué tiene que transmitir el diseño

13. **Que el sitio «provoque hambre»** (Kit §00). Que el cliente sienta que le importa dónde pide la pizza, en contra de lo «suficientemente bueno» (Brand Strategy, láminas 4 a 11).
14. **Tono:** Confident, Approachable, Lighthearted y Unexpected. Se revisa con los 4 filtros creativos de la lámina 17 de Brand Strategy.
15. **Paleta de marca:**
    - **Base:** Tangy Tomato `#FF0000`, Fresh Basil `#2D5D2A` y Fluffy Dough `#F5E8DC`.
    - **Complementarios:** Ripened Vine `#65A17A` y Rich Sauce `#710500`.
    - **Acentos:** Punchy Garlic `#E3C2ED` y Pickled Pepperoncini `#CFEB0C`.
    - **Tipografías:** Papa Sans Medium Condensed para titulares y Pappy de acento.
16. **Accesibilidad:** el toolkit solo aprueba 12 combinaciones de texto para digital, y **ninguna usa el rojo** (Playbook p. 132).
17. **Claim:** BIBP «Better Ingredients. Better Pizza.®» va siempre junto a BGYS «Better Get You Some», en el orden BIBP → BGYS → logo.
18. **Fotografía:** macro, para provocar antojo.
19. **El cliente espera que el partner proponga una experiencia world-class**, no que ejecute diseños existentes (T-109).

## Datos que no cuadran y conviene aclarar o elegir

| Tema | Fuente A | Fuente B |
|---|---|---|
| Clientes activos | 1,2 M a 6 meses; 2,5 M en total (T-1) | 1,5 M (Vol. xlsx) |
| Tamaños y masas | 4 tamaños, 4 masas, 2 bordes (T-78) | 3 tamaños, 3 masas (Vol. xlsx) |
| Promos simultáneas | 7 AON + 2 tácticas (T-117) | 10 AON + 5 tácticas (Vol. xlsx) |
| WhatsApp | 5 % de activos + 3 % de dormidos (T-2) | 2 % de inactivos, 10 K (Vol. xlsx) |
| Loyalty | «No es prioridad de evaluación» (T-38 y otras) | Canje y saldo en tiempo real durante el journey (T-8) |
| Rojo de marca | Color principal | Sin combinación de texto accesible en digital (Playbook p. 132) |
| Claim | En inglés en el material de marca: «Better Ingredients. Better Pizza.» y «Better Get You Some» | El Relato del kit chileno usa el logo con **«Mejores Ingredientes. Mejor Pizza.»**. BIBP ya tiene versión local; BGYS no |

**Preguntas sin respuesta útil:**
- T-34: llamadas que genera una orden.
- T-37: límites de tasa de los sistemas destino.
- T-123 y T-124: quién calcula el ETA y si lo expone por API.
- T-63: si Synerise segmenta en tiempo real; quedó «POR CONFIRMAR».

## Cómo se verificó

- **Excel:** la parte literal de 01 se generó celda a celda con un script. Después se comprobó automáticamente que **cada celda con texto** de los 4 Excel aparece en su `.md`. Se corrigieron 7 celdas: 4 descripciones abreviadas, la celda D9 de volumetría y los 2 títulos de hoja. Se revisaron filas y columnas ocultas (no hay) y formatos numéricos (`0.01` = 1 %, ticket en $).
- **PDF de marca:** primero se transcribió página por página mirando las imágenes y después se hizo una segunda pasada contra el original; cada archivo tiene su sección «Verificación» con lo dudoso. Además se revisaron a mano, contra el render, Brand Strategy láminas 4 y 17 y Playbook p. 58 (paleta) y p. 132 (colores accesibles). Todas coinciden.
- **Kit ya transcrito:** se confirmó con MD5 que los 7 archivos son idénticos. Además se comparó el texto de los PDF de Relato, Mapa de capacidades y Volumetría contra `kit-pj/README.md`: no falta ninguna palabra ni ningún ID de capacidad.
- **Antes de reenviar `SALESFORCE - Respuestas .xlsx` a alguien:** borrar el comentario interno de la celda G68.
