#!/usr/bin/env bash
# Reconstruye el sitio PapaJohnsCL de la demo en el sandbox, desde cero y desde el repo.
# Uso (desde la raíz del storefront):  site-data/rebuild.sh [--skip-customers]
set -euo pipefail
cd "$(dirname "$0")/.."

DW="${PJ_DW_JSON:-}"
if [[ -z "$DW" ]]; then
  d="$PWD"; while [[ "$d" != "/" && ! -f "$d/dw.json" ]]; do d="$(dirname "$d")"; done
  DW="$d/dw.json"
fi
[[ -f "$DW" ]] || { echo "No se encontró dw.json (define PJ_DW_JSON)"; exit 1; }
B2C=(pnpm -s b2c)
# El CLI exige el subcomando antes de los flags: van al final de cada llamada.
CFG=(--config "$DW" --dotenv-file=)
# La code version activa del sandbox (dw.json dice otra).
CODE_VERSION="${PJ_CODE_VERSION:-SFRA_UPC_08_21_2026}"

echo "1/5 Genera el site archive"
python3 site-data/build_site.py

echo "2/5 Despliega el cartucho int_papajohns_demo en $CODE_VERSION"
"${B2C[@]}" code deploy cartridges -c int_papajohns_demo -v "$CODE_VERSION" "${CFG[@]}"

echo "3/5 Importa el sitio (catálogo, precios, inventario, tiendas, metadata, promociones, OCAPI)"
"${B2C[@]}" job import site-data/build/PapaJohnsCL -t 1800 --show-log "${CFG[@]}"

echo "4/5 Reindexa la búsqueda"
"${B2C[@]}" job run PapaJohnsCL-Reindex --wait -t 1200 "${CFG[@]}"

if [[ "${1:-}" != "--skip-customers" ]]; then
  echo "5/5 Clientes de demo, puntos, grupos y pedidos (OCAPI + SCAPI)"
  PJ_DW_JSON="$DW" python3 site-data/ocapi/customers.py
fi
echo "Listo."
