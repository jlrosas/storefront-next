#!/usr/bin/env python3
"""Descarga los datos públicos de Papa John's Chile para la demo.

Solo hace peticiones GET a los mismos endpoints que usa el sitio público.
No envía pedidos ni datos personales.

Uso:
    python3 extraccion/extraer.py                 # API + textos
    python3 extraccion/extraer.py --imagenes      # además descarga las imágenes
    python3 extraccion/extraer.py --tiendas 1-140 # rango de ids de tienda a recorrer
"""
import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.papajohns.cl"
SITIO = "https://www.papajohns.cl"
TIENDA_BASE = 22  # tienda "Providencia." usada en la exploración
MODALIDAD = "pj_delivery"
CABECERAS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Origin": SITIO,
    "Referer": SITIO + "/",
    "Accept": "application/json, text/html;q=0.9, */*;q=0.8",
}
PAUSA = 0.3  # segundos entre peticiones, para no cargar el sitio

RAIZ = Path(__file__).resolve().parent.parent / "datos"
RAW = RAIZ / "raw"

ENDPOINTS = {
    "prices": f"v1/prices?store_id={TIENDA_BASE}&dispatch_method={MODALIDAD}",
    "promotions": f"v1/offers/promotions?store_id={TIENDA_BASE}&dispatch_method={MODALIDAD}",
    "ingredients": f"v1/ingredients?store_id={TIENDA_BASE}",
    "sizes_and_crusts": "v2/sizes_and_crusts",
    "deal_pictures": f"v1/deal_pictures?dispatch_method={MODALIDAD}&category=web&store_id={TIENDA_BASE}",
    "core_settings": "v1/core_settings",
    "orders_settings": "v1/orders_settings",
}

PAGINAS = {
    "papa-puntos": SITIO + "/papa-puntos",
    "menu": SITIO + "/menu/",
    "pizzas": SITIO + "/pizzas/",
}


def bajar(url, binario=False):
    pet = urllib.request.Request(url, headers=CABECERAS)
    try:
        with urllib.request.urlopen(pet, timeout=30) as r:
            cuerpo = r.read()
            return r.status, cuerpo if binario else cuerpo.decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, b"" if binario else ""
    except (urllib.error.URLError, TimeoutError) as e:
        print(f"  error de red en {url}: {e}", file=sys.stderr)
        return 0, b"" if binario else ""
    finally:
        time.sleep(PAUSA)


def extraer_api():
    for nombre, ruta in ENDPOINTS.items():
        estado, texto = bajar(f"{API}/{ruta}")
        print(f"{estado} {nombre} ({len(texto)} bytes)")
        if estado == 200:
            (RAW / f"{nombre}.json").write_text(texto, encoding="utf-8")


def extraer_tiendas(desde, hasta):
    tiendas = []
    for i in range(desde, hasta + 1):
        estado, texto = bajar(f"{API}/v1/stores/{i}?dispatch_method={MODALIDAD}")
        if estado != 200:
            continue
        try:
            tiendas.append(json.loads(texto))
        except json.JSONDecodeError:
            continue
    (RAW / "stores.json").write_text(
        json.dumps(tiendas, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print(f"tiendas encontradas: {len(tiendas)} (ids {desde}-{hasta})")


def extraer_paginas():
    destino = RAW / "paginas"
    destino.mkdir(exist_ok=True)
    urls = dict(PAGINAS)
    estado, listado = bajar(PAGINAS["pizzas"])
    if estado == 200:
        for slug in sorted(set(re.findall(r'href="/pizzas/([a-z0-9-]+)/?"', listado))):
            urls[f"pizza-{slug}"] = f"{SITIO}/pizzas/{slug}/"
    for nombre, url in urls.items():
        estado, html = bajar(url)
        print(f"{estado} página {nombre}")
        if estado == 200:
            (destino / f"{nombre}.html").write_text(html, encoding="utf-8")


def urls_de_imagen(obj, encontradas):
    if isinstance(obj, dict):
        for v in obj.values():
            urls_de_imagen(v, encontradas)
    elif isinstance(obj, list):
        for v in obj:
            urls_de_imagen(v, encontradas)
    elif isinstance(obj, str) and re.match(r"https?://[^\s]+\.(png|jpe?g|webp|svg|gif)(\?.*)?$", obj, re.I):
        encontradas.add(obj)


def extraer_imagenes():
    encontradas = set()
    for archivo in RAW.glob("*.json"):
        urls_de_imagen(json.loads(archivo.read_text(encoding="utf-8")), encontradas)
    destino = RAIZ / "imagenes"
    destino.mkdir(exist_ok=True)
    indice, nuevas = {}, 0
    for url in sorted(encontradas):
        nombre = re.sub(r"[^A-Za-z0-9._-]", "_", url.split("://", 1)[1].split("?")[0])
        indice[url] = nombre
        ruta = destino / nombre
        if ruta.exists():
            continue
        estado, datos = bajar(url, binario=True)
        if estado == 200 and datos:
            ruta.write_bytes(datos)
            nuevas += 1
    (RAIZ / "imagenes.json").write_text(json.dumps(indice, indent=1), encoding="utf-8")
    print(f"imágenes: {len(encontradas)} referenciadas, {nuevas} descargadas ahora")


def main():
    p = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    p.add_argument("--imagenes", action="store_true", help="descargar también las imágenes")
    p.add_argument("--tiendas", default="", help="rango de ids de tienda, p. ej. 1-140")
    p.add_argument("--sin-paginas", action="store_true", help="omitir las páginas de texto")
    a = p.parse_args()

    RAW.mkdir(parents=True, exist_ok=True)
    extraer_api()
    if a.tiendas:
        desde, hasta = (int(x) for x in a.tiendas.split("-"))
        extraer_tiendas(desde, hasta)
    if not a.sin_paginas:
        extraer_paginas()
    if a.imagenes:
        extraer_imagenes()


if __name__ == "__main__":
    main()
