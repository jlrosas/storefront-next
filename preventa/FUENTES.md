# Fuentes fuera del repo

- **Actualizado:** 18-nov-2026
- **Por qué:** los PDF y los videos no se suben al repo por su peso (`.gitignore`). Aquí queda qué era cada archivo, dónde está transcrito y de dónde se obtiene.
- **Regla:** el Markdown transcrito es la fuente de trabajo. El original solo se consulta para verificar.

## 1. Documentos del cliente (PDF)

| Archivo (ruta local) | Peso | Qué es | Transcrito en | URL de origen |
|---|---|---|---|---|
| `PapaJohns-Preventa/Kit del Proveedor/International BGYS Brand Playbook and Campaign Toolkit_04082024.pdf` | 24,3 MB | Playbook de marca BGYS: Papa Sans, paleta y reglas ADA | [06-brand-playbook-bgys.md](datos/cliente/preventa/06-brand-playbook-bgys.md) | _pendiente_ |
| `PapaJohns-Preventa/Kit del Proveedor/Brand Strategy - BGYS (3).pdf` | 2,4 MB | Estrategia de marca BGYS | [05-brand-strategy-bgys.md](datos/cliente/preventa/05-brand-strategy-bgys.md) | _pendiente_ |
| `PapaJohns-Preventa/Kit del Proveedor/Customer Journey Relato.pdf` | 43 KB | Relato del journey (adjunto del kit) | [kit-pj/README.md](datos/cliente/kit-pj/README.md) | Zip del kit: `https://cdn.papajohns.cl/kit-pj/assets/kit-pj-25-09-26.zip` |
| `PapaJohns-Preventa/Kit del Proveedor/Papa Johns Chile Mapa Capacidades.pdf` | 90 KB | Mapa de 57 capacidades (adjunto del kit) | [kit-pj/README.md](datos/cliente/kit-pj/README.md) | Zip del kit (misma URL) |
| `PapaJohns-Preventa/Kit del Proveedor/Volumetria Papa Johns.pdf` | 95 KB | Volumetría (versión PDF del xlsx) | [03-volumetria-xlsx.md](datos/cliente/preventa/03-volumetria-xlsx.md) | Zip del kit (misma URL) |
| `datos/cliente/kit-pj/adjuntos/*.pdf` (3) | — | Copias de los tres anteriores, extraídas del zip del kit | [kit-pj/README.md](datos/cliente/kit-pj/README.md) | Zip del kit (misma URL) |

El kit completo (HTML, CSS y scripts) sí está en el repo, en `datos/cliente/kit-pj/original/`. Se publicó en `https://cdn.papajohns.cl/kit-pj/index.html` (versión `20261007-ux`).

## 2. Videos

| Video | Qué es | Transcrito en | URL de origen |
|---|---|---|---|
| `Demo BackOffice-20261021_101031-Grabación de la reunión.mp4` (Teams, 48:07) | Demo del backoffice actual de Papa Johns, 21-oct-2026 | [backoffice-video.md](datos/cliente/backoffice-video.md) (con capturas en `backoffice-video/`), [auditoría](datos/cliente/backoffice-video-auditoria.md) y [transcripción](datos/cliente/backoffice-video/transcripcion.txt) | _pendiente_ |
| `assets/intro video.mp4` del kit | Video de introducción del kit | No se transcribió | `https://cdn.papajohns.cl/kit-pj/assets/intro%20video.mp4` (sin verificar) |

## 3. Secretos (nunca en el repo)

| Archivo | Qué tiene | Dónde se documenta |
|---|---|---|
| `dw.json` | Usuario de BM y API client del sandbox | [storefront/AMBIENTE.md §1](../AMBIENTE.md) |
| `storefront/.env` | SLAS privado, cliente OCAPI de servidor, MRT | [storefront/AMBIENTE.md §7.3](../AMBIENTE.md) |
