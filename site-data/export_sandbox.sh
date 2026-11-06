#!/usr/bin/env bash
# Exporta el sitio PapaJohnsCL del sandbox (todas sus unidades) a la carpeta indicada.
# Uso: site-data/export_sandbox.sh /ruta/de/salida
set -euo pipefail
cd "$(dirname "$0")/.."
OUT="${1:?carpeta de salida}"
pnpm -s b2c job export --config ../../dw.json --dotenv-file= \
  -d '{"sites":{"PapaJohnsCL":{"all":true}},"global_data":{"meta_data":true,"custom_types":true}}' \
  -o "$OUT" -t 900
