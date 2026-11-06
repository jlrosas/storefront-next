#!/usr/bin/env python3
"""Compone las fotos de los combos a partir de las fotos de producto sin texto (S-D8).

Las fotos de oferta del CDN de papajohns.cl traen precios y títulos incrustados, así que cada combo
se arma con las fotos 1440×1080 de sus productos (fondo verde de estudio), en franjas verticales.

Requiere Pillow. Uso:  python3 site-data/compose_combo_images.py
Salida: site-data/assets/combos/<combo>.jpg (1600×1200), versionadas en el repo.
"""
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
import build_site  # noqa: E402  (reutiliza la caché y la elección de foto)

OUT = ROOT / "assets" / "combos"
SIZE = (1600, 1200)

# combo: productos (nombre en prices.json) de izquierda a derecha.
LAYOUT = {
    "cb-super-duo": ["Pollo BBQ", "Super Pepperoni"],
    "cb-super-trio": ["Pollo BBQ", "Super Pepperoni", "Todas las Carnes"],
    "cb-papa-combo-palitos": ["Pollo BBQ", "Palitos de Ajo", "Coca-Cola Sin azúcar"],
    "cb-papa-flash": ["Super Pepperoni", "Mini Palitos de Ajo y Queso", "Coca-Cola Sin azúcar"],
    "cb-papa-combo-postre": ["Pollo BBQ", "Coca-Cola Sin azúcar", "Cookie"],
    "cb-pizza-del-mes": ["The Works"],
    "cb-box-halloween": ["Super Pepperoni", "Boom de trencito", "Cheesyqueños"],
}


def place(canvas, img, cx, cell_w):
    """Pega el producto completo centrado en su celda, fundido con una máscara elíptica suave."""
    # En las fotos 1440×1080 el producto ocupa ~57 % del ancho: se escala al 90 % de la celda.
    scale = min(0.9 * cell_w / (0.57 * img.width), SIZE[1] / img.height)
    w, h = round(img.width * scale), round(img.height * scale)
    img = img.resize((w, h), Image.LANCZOS)
    mask = Image.new("L", (w, h), 0)
    mw, mh = min(w, cell_w * 1.1), h * 0.8
    ImageDraw.Draw(mask).ellipse(((w - mw) / 2, (h - mh) / 2, (w + mw) / 2, (h + mh) / 2), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(cell_w / 10))
    canvas.paste(img, (round(cx - w / 2), round(SIZE[1] / 2 - h / 2)), mask)


def compose(names, photos):
    images = [Image.open(build_site.CACHE / photos[n]).convert("RGB") for n in names]
    # Fondo: degradado vertical con el verde de estudio del centro (arriba y abajo) de la primera foto.
    first = images[0]
    cx0, cx1 = int(first.width * 0.4), int(first.width * 0.6)
    top = first.crop((cx0, 0, cx1, 60)).resize((1, 1), Image.BOX).getpixel((0, 0))
    bottom = first.crop((cx0, first.height - 60, cx1, first.height)).resize((1, 1), Image.BOX).getpixel((0, 0))
    bg = Image.new("RGB", SIZE)
    draw = ImageDraw.Draw(bg)
    for y in range(SIZE[1]):
        t = y / (SIZE[1] - 1)
        draw.line([(0, y), (SIZE[0], y)], fill=tuple(round(a + (b - a) * t) for a, b in zip(top, bottom)))
    cell = SIZE[0] / len(names)
    for i, img in enumerate(images):
        place(bg, img, cell * (i + 0.5), cell)
    return bg


def main():
    prices = json.loads((build_site.RAW / "prices.json").read_text())
    photos = {}
    for item in prices:
        m = item["menuable"]
        pic = build_site.pick_picture(m["name"].strip(), m.get("pictures") or [])
        if pic:
            photos[m["name"].strip()] = build_site.fetch_image(pic["url"])
    OUT.mkdir(parents=True, exist_ok=True)
    for combo, names in LAYOUT.items():
        compose(names, photos).save(OUT / f"{combo}.jpg", quality=86, optimize=True, progressive=True)
        print(OUT / f"{combo}.jpg")


if __name__ == "__main__":
    main()
