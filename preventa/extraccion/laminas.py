#!/usr/bin/env python3
"""Arma láminas comparativas (Melt frente a Papa John's) con las capturas de capturas/raw."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent.parent / "capturas"
ORIGEN = BASE / "raw"
ALTO, MARGEN, CABECERA = 860, 32, 92
MELT, PJ = (214, 32, 39), (45, 95, 46)
FUENTE = "/System/Library/Fonts/Helvetica.ttc"
f_titulo = ImageFont.truetype(FUENTE, 26, index=1)
f_nota = ImageFont.truetype(FUENTE, 19)
M, P = ("Melt", MELT), ("Papa John's", PJ)

LAMINAS = {
    "01-portada": [("melt-portada", M, "Oferta legible: precio, tachado, -40%"),
                   ("pj-portada-cargando", P, "Primer instante: banner vacío"),
                   ("pj-portada", P, "Banner con el texto en la imagen")],
    "02-promos": [("melt-promos", M, "5 promos por pantalla, antes/ahora"),
                  ("pj-promos", P, "1 promo por pantalla, solo \"desde\"")],
    "03-pizzas": [("melt-pizzas", M, "Categorías fijas, mismo tamaño"),
                  ("pj-pizzas", P, "Fotos grandes, tamaños mezclados")],
    "04-ficha": [("melt-ficha", M, "Ficha rápida: nada preseleccionado"),
                 ("melt-pdp", M, "Página propia del producto"),
                 ("pj-ficha", P, "Preseleccionado: un toque")],
    "05-personalizar": [("melt-pdp-opciones", M, "Salsa obligatoria, extras al final"),
                        ("pj-combo", P, "Combo: página propia para armarlo")],
    "06-tienda": [("melt-tienda", M, "Al agregar: salta a otra página"),
                  ("melt-tienda-retiro", M, "Lista alfabética de todo Chile"),
                  ("pj-direccion", P, "Antes de ver la pizza"),
                  ("pj-tiendas", P, "Las 3 más cercanas, programar")],
    "07-tras-agregar": [("melt-vuelta-portada", M, "Vuelve a la portada, sin aviso"),
                        ("pj-tras-agregar", P, "Vuelve al menú, sin aviso")],
    "08-carrito": [("melt-carrito", M, "Puntos que ganas y sugeridos"),
                   ("pj-carrito", P, "Mejora sugerida y sugeridos")],
    "09-pago": [("melt-checkout", M, "Paso 1 de varios: solo el correo"),
                ("pj-checkout", P, "Todo en una página, en rojo"),
                ("pj-pago", P, "Medios de pago en otra pantalla")],
    "10-puntos": [("melt-puntos", M, "Reglas claras y llamado a registrarse"),
                  ("pj-puntos", P, "Una frase y preguntas frecuentes")],
}

for nombre, paneles in LAMINAS.items():
    imgs = []
    for archivo, (marca, color), nota in paneles:
        im = Image.open(ORIGEN / f"{archivo}.jpeg").convert("RGB")
        im = im.crop((0, 0, im.width, min(im.height, 2532)))
        ancho = round(im.width * ALTO / im.height)
        imgs.append((im.resize((ancho, ALTO), Image.LANCZOS), marca, nota, color))
    total = sum(i[0].width for i in imgs) + MARGEN * (len(imgs) + 1)
    lam = Image.new("RGB", (total, ALTO + CABECERA + MARGEN), (245, 245, 242))
    d = ImageDraw.Draw(lam)
    x = MARGEN
    for im, marca, nota, color in imgs:
        d.rounded_rectangle((x, 18, x + d.textlength(marca, font=f_titulo) + 24, 54), 8, fill=color)
        d.text((x + 12, 22), marca, font=f_titulo, fill="white")
        d.text((x, 62), nota, font=f_nota, fill=(40, 40, 40))
        lam.paste(im, (x, CABECERA))
        d.rectangle((x - 1, CABECERA - 1, x + im.width, CABECERA + ALTO), outline=(200, 200, 195))
        x += im.width + MARGEN
    lam.save(BASE / f"{nombre}.jpg", quality=82)
    print(nombre, lam.size)
