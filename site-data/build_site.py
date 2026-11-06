#!/usr/bin/env python3
"""Genera el site archive de PapaJohnsCL para B2C Commerce a partir de site-data/source.

Uso:  python3 site-data/build_site.py
Salida: site-data/build/PapaJohnsCL/ (lista para `b2c job import`).
Las imágenes se descargan una vez a site-data/.cache/images.
Ver site-data/README.md para reconstruir el sitio completo.
"""
import hashlib
import json
import os
import re
import shutil
import unicodedata
import urllib.request
from pathlib import Path
from xml.sax.saxutils import escape

import demo_data as D

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "source"
OUT = ROOT / "build" / "PapaJohnsCL"
CACHE = ROOT / ".cache" / "images"
ASSETS = ROOT / "assets"
DW_JSON = Path(os.environ.get("PJ_DW_JSON") or next(
    (d / "dw.json" for d in ROOT.parents if (d / "dw.json").exists()), ROOT / "dw.json"))

SITE_ID = "PapaJohnsCL"
MASTER = "papajohns-cl-master"
STOREFRONT = "papajohns-cl-storefront"
PRICEBOOK = "papajohns-cl-list-prices"
INVENTORY = "inventory_papajohns_cl"
LOCALE = "es_CL"
CURRENCY = "CLP"
# Librería que el sitio tiene asignada (BM la crea junto con el sitio).
LIBRARY = "PapaJohnsCLLibrary"
# Cartucho propio de la demo primero: su dw.order.calculate reemplaza al de SFRA (precio de mitades).
CARTRIDGES = "int_papajohns_demo:app_storefrontnext_base:app_storefront_base"

# Productos que no se cargan tal cual: precio 0 o 1. «Pizza por mitades» se reemplaza por pz-mitades.
SKIP = {"Pizza por mitades", "Fanta 220 ml"}

SIZE_ORDER = ["individual", "medium", "family", "extra_large"]

CATEGORIES = [
    # id, nombre, padre, descripción
    ("ofertas", "Ofertas", "root", "Combos y precios especiales."),
    ("pizzas", "Pizzas", "root", "Nuestras pizzas, hechas con masa fresca."),
    ("pizzas-clasicas", "Clásicas", "pizzas", "Las de siempre, desde $13.900 la familiar."),
    ("pizzas-favoritas", "Favoritas", "pizzas", "Las más pedidas, $16.900 la familiar."),
    ("pizzas-premium", "Premium", "pizzas", "Más ingredientes, desde $18.900 la familiar."),
    ("pan-pizza", "Pan Pizza", "pizzas", "Masa alta y esponjosa. Solo mediana."),
    ("pizzas-croissant", "Croissant", "pizzas", "Borde de croissant. Un tamaño."),
    ("acompanamientos", "Acompañamientos", "root", "Para compartir."),
    ("postres", "Postres", "root", "El final perfecto."),
    ("bebidas", "Bebidas", "root", "Bebidas frías."),
    ("salsas-extras", "Salsas y extras", "root", "Complementa tu pedido."),
    # Oculta: solo sirve para que los productos de ingrediente (ing-*) existan en el sitio.
    ("ingredientes", "Ingredientes", "root", "Ingredientes para extras y mitades (no se muestra)."),
]
HIDDEN_CATEGORIES = {"ingredientes"}

# Fotos de las secciones del menú de papajohns.cl (formato 21:9) para las tarjetas de categoría.
CATEGORY_IMAGES = {
    "pizzas": "https://cdn.papajohns.cl/assets/landing/pizzas.webp",
    "acompanamientos": "https://cdn.papajohns.cl/assets/landing/sides.webp",
    "postres": "https://cdn.papajohns.cl/assets/landing/desserts.webp",
    "bebidas": "https://cdn.papajohns.cl/assets/landing/drinks.webp",
    "salsas-extras": "https://cdn.papajohns.cl/assets/landing/extras.webp",
}

COMPLEMENT_CATEGORY = {
    "side": "acompanamientos",
    "dessert": "postres",
    "drink": "bebidas",
    "sauce": "salsas-extras",
    "extra": "salsas-extras",
}
COMPLEMENT_KIND = {"side": "side", "dessert": "dessert", "drink": "drink", "sauce": "extra", "extra": "extra"}

# Foto del producto (S-D8): la de mayor resolución y sin texto. `photo_aggregator` es 1440×1080 y sin
# texto en casi todos; después las de 750×600. Excepciones revisadas a ojo el 06-nov.
PICTURE_ORDER = ["photo_aggregator", "pizza_edit", "icon", "photo"]
PICTURE_OVERRIDE = {
    "Pizza por mitades": "photo",  # la de agregador trae «PIZZA POR MITADES» escrito
    "Salsa de Pizza": "photo",  # 1600×600 en vez de 320×320
}
# Productos sin foto grande (< 1200 px de ancho) o sin versión sin texto (se informan en el README).
SMALL_OR_TEXT = {
    "Helados Tipo Bombones": "todas sus fotos traen texto publicitario",
    "Helados Individuales": "todas sus fotos traen texto publicitario; 750 px",
    "Helados La Cremeria": "todas sus fotos traen texto publicitario; 750 px",
    "Dulce y Truco": "todas sus fotos traen texto publicitario; 750 px",
    "Mini Palitos de Ajo (6 unidades)": "397 px",
    "Coca Cola Sin Azucar 220ml": "296 px (lata con su etiqueta)",
    "Palitos de Ajo 5 unidades": "750 px",
    "Croissant de Aceituna": "750 px",
    "Croissant de Choclo": "750 px",
    "Croissant de Pimentón": "750 px",
    "EL ÚLTIMO SLICE": "750 px (caja del juego con su marca)",
}


def slug(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def x(text):
    return escape(str(text if text is not None else "").strip())


def money(value):
    return f"{int(round(value))}"


def fetch_image(url):
    """Descarga la imagen a la caché y devuelve su nombre de archivo."""
    name = slug(Path(url.split("?")[0]).stem) + Path(url.split("?")[0]).suffix.lower()
    target = CACHE / name
    if not target.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=60) as resp:
            target.write_bytes(resp.read())
    return name


def pick_picture(name, pics):
    by_cat = {}
    for p in pics:
        by_cat.setdefault(p.get("category"), p)
    order = ([PICTURE_OVERRIDE[name]] if name in PICTURE_OVERRIDE else []) + PICTURE_ORDER
    for cat in order:
        if cat in by_cat:
            return by_cat[cat]
    return pics[0] if pics else None


def load():
    prices = json.loads((RAW / "prices.json").read_text())
    sc = json.loads((RAW / "sizes_and_crusts.json").read_text())
    stores = json.loads((RAW / "stores.json").read_text()) + json.loads((RAW / "stores_extra.json").read_text())
    ingredients = json.loads((RAW / "ingredients.json").read_text())
    return prices, sc, stores, ingredients


def stable(pid, lo, hi):
    """Número estable entre reconstrucciones, derivado del ID (reseñas de ejemplo de R4.4)."""
    h = int(hashlib.sha1(pid.encode()).hexdigest()[:8], 16)
    return lo + h % (hi - lo + 1)


def ingredient_id(name):
    return slug(name)


def build_ingredients(ingredients):
    out = []
    for i in sorted(ingredients, key=lambda i: i.get("position") or 0):
        pic = next((p for p in i.get("pictures") or [] if p.get("category") == "photo"), None) or \
            (i.get("pictures") or [None])[0]
        out.append({
            "iid": ingredient_id(i["name"]),
            "id": "ing-" + ingredient_id(i["name"]),
            "name": i["name"].strip(),
            "group": i.get("category"),
            "priced": bool(i.get("price_modifier")),
            "no_halves": bool(i.get("unavailable_for_halves")),
            "image": fetch_image(pic["url"]) if pic else None,
        })
    return out


def pizza_attrs(pid, m):
    """Atributos del contrato §4.1 para una pizza (maestro)."""
    food = sorted({D.FOOD_TYPE_MAP[f] for f in (m.get("food_type") or []) if f in D.FOOD_TYPE_MAP})
    rating, reviews, weekly = D.REVIEWS.get(pid) or (
        stable(pid + "r", 42, 45) / 10, stable(pid + "n", 100, 400), stable(pid + "w", 20, 95))
    return {
        "pjFoodType": food,
        "pjBadges": D.BADGES.get(pid, []),
        "pjRating": rating,
        "pjReviewCount": reviews,
        "pjWeeklyOrders": weekly,
        "pjBaseIngredients": D.BASE_INGREDIENTS.get(pid, []),
        "pjRedeemPoints": D.REDEEM_POINTS.get(pid),
    }


def build_products(prices, sc):
    """Devuelve (productos, asignaciones) normalizados."""
    sizes = sc["translations"]["sizes"]
    crusts = sc["translations"]["crusts"]
    crust_order = sorted(sc["select"]["crusts"], key=lambda c: sc["select"]["crusts"][c])
    group_of = {f"pz-{s}": cat for cat, items in D.PIZZA_GROUPS.items() for s in items}
    products, assignments = [], []
    seen = set()
    halves_source = None

    for item in prices:
        m = item["menuable"]
        name = m["name"].strip()
        if name == "Pizza por mitades":
            halves_source = item
        if name in SKIP:
            continue
        cat = m["category"]
        variants = item.get("variants") or []
        pic = pick_picture(name, m.get("pictures") or [])
        image = fetch_image(pic["url"]) if pic else None
        attrs = {}

        if item["menuable_type"] == "Pizza":
            seo = m.get("seo_url") or slug(name)
            pid = "pz-" + seo
            if name.startswith("Pan Pizza"):
                category = "pan-pizza"
            elif name.startswith("Croissant"):
                category = "pizzas-croissant"
            elif seo in D.BUILDERS:
                category = "pizzas"
            else:
                category = group_of[pid]
            vlist = []
            for v in variants:
                vm = v["menuable"]
                vlist.append({
                    "id": f"{pid}-{vm['size']}-{vm['crust']}",
                    "attrs": {"pjSize": vm["size"], "pjCrust": vm["crust"]},
                    "price": v["price"],
                })
            used_sizes = [s for s in SIZE_ORDER if any(v["attrs"]["pjSize"] == s for v in vlist)]
            used_crusts = [c for c in crust_order if any(v["attrs"]["pjCrust"] == c for v in vlist)]
            vattrs = [
                ("pjSize", "Tamaño", [(s, sizes[s]) for s in used_sizes]),
                ("pjCrust", "Masa", [(c, crusts[c]) for c in used_crusts]),
            ]
            if seo in D.BUILDERS:
                attrs = {"pjKind": "builder", "pjHalvesEnabled": False, "pjExtraPrices": json.dumps(D.EXTRA_PRICE)}
            else:
                attrs = {"pjKind": "pizza", **pizza_attrs(pid, m),
                         "pjHalvesEnabled": category not in ("pan-pizza", "pizzas-croissant"),
                         "pjExtraPrices": json.dumps(D.EXTRA_PRICE)}
            extras = True
        else:
            pid = "cp-" + slug(name)
            category = COMPLEMENT_CATEGORY[cat]
            attrs = {"pjKind": COMPLEMENT_KIND[cat]}
            if variants:
                vlist, values = [], []
                for v in variants:
                    vm = v["menuable"]
                    label = vm["name"].strip()
                    value = slug(label)
                    vlist.append({"id": f"{pid}-{vm['id']}", "attrs": {"pjOption": value}, "price": v["price"]})
                    values.append((value, label))
                vattrs = [("pjOption", "Opción", values)]
            else:
                vlist, vattrs = [], []
            extras = False

        if pid in D.SENSORY:
            attrs["pjSensory"] = D.SENSORY[pid]
        if pid in seen:
            continue
        seen.add(pid)
        products.append({
            "id": pid,
            "name": name,
            "short": m.get("description") or "",
            "long": m.get("full_description") or m.get("description") or "",
            "image": image,
            "price": item.get("price"),
            "variants": vlist,
            "vattrs": vattrs,
            "attrs": attrs,
            "extras": extras,
            "position": item.get("position") or 0,
        })
        assignments.append((pid, category))

    products.append(halves_product(halves_source, products, sizes, crusts, crust_order))
    assignments.append(("pz-mitades", "pizzas"))
    return products, assignments


def halves_product(item, products, sizes, crusts, crust_order):
    """pz-mitades: tamaño y masa de «Pizza por mitades»; precio base = «Arma tu pizza» (lo reemplaza el hook)."""
    m = item["menuable"]
    byop = {v["id"].replace("pz-arma-tu-pizza-", ""): v["price"]
            for p in products if p["id"] == "pz-arma-tu-pizza" for v in p["variants"]}
    vlist = []
    for v in item["variants"]:
        vm = v["menuable"]
        key = f"{vm['size']}-{vm['crust']}"
        vlist.append({"id": f"pz-mitades-{key}", "attrs": {"pjSize": vm["size"], "pjCrust": vm["crust"]},
                      "price": byop[key]})
    used_sizes = [s for s in SIZE_ORDER if any(v["attrs"]["pjSize"] == s for v in vlist)]
    used_crusts = [c for c in crust_order if any(v["attrs"]["pjCrust"] == c for v in vlist)]
    pic = pick_picture(m["name"], m.get("pictures") or [])
    return {
        "id": "pz-mitades",
        "name": "Pizza mitad y mitad",
        "short": "Dos especialidades en una pizza. Pagas el promedio de las dos mitades.",
        "long": "Elige tamaño y masa para toda la pizza y una especialidad para cada mitad. "
                "El precio es el promedio de las especialidades elegidas.",
        "image": fetch_image(pic["url"]) if pic else None,
        "price": None,
        "variants": vlist,
        "vattrs": [("pjSize", "Tamaño", [(s, sizes[s]) for s in used_sizes]),
                   ("pjCrust", "Masa", [(c, crusts[c]) for c in used_crusts])],
        "attrs": {"pjKind": "builder", "pjHalvesEnabled": False, "pjSensory": D.SENSORY["pz-mitades"],
                  "pjExtraPrices": json.dumps(D.EXTRA_PRICE)},
        "extras": True,
        "position": 0,
    }


def drinks_1500(prices):
    """Variantes de bebida de 1,5 L (las que entran en los combos)."""
    out = []
    for item in prices:
        m = item["menuable"]
        if m["category"] == "drink":
            for v in item.get("variants") or []:
                if re.search(r"1[.,]5", v["menuable"]["name"]):
                    out.append(f"cp-{slug(m['name'].strip())}-{v['menuable']['id']}")
    return out


def build_combos(prices):
    """Combos del contrato §4.1 como productos simples de precio fijo."""
    drinks = drinks_1500(prices)

    def resolve(pid):
        """Bebida maestra → su variante de 1,5 L (las demás quedan igual)."""
        return next((d for d in drinks if re.fullmatch(re.escape(pid) + r"-\d+", d)), pid)

    out = []
    for c in D.COMBOS:
        slots = []
        for s in c["slots"]:
            s = dict(s)
            s["choices"] = drinks if s["choices"] == "drink-1500" else [resolve(p) for p in s["choices"]]
            s["default"] = resolve(s["default"])
            slots.append(s)
        attrs = {
            "pjKind": "combo",
            "pjSlots": json.dumps({"slots": slots}, ensure_ascii=False),
            "pjValidTo": c["valid_to"],
            "pjDispatch": c["dispatch"],
            "pjOccasion": c["occasion"],
            "pjSensory": c["sensory"],
            "pjServes": c["serves"],
        }
        if c.get("valid_from"):
            attrs["pjValidFrom"] = c["valid_from"]
        if c.get("before"):
            attrs["pjPriceBefore"] = c["before"]
        out.append({
            "id": c["id"],
            "name": c["name"],
            "short": c["short"],
            "long": c["short"],
            "image": f"combos/{c['id']}.jpg",
            "price": c["price"],
            "variants": [],
            "vattrs": [],
            "attrs": attrs,
            "extras": False,
            "searchable": c["id"] != "cb-box-halloween",
        })
    return out


# ---------- XML del catálogo ----------

ATTR_TYPES = {}  # se llena en meta_xml; tipos de cada atributo de producto


def custom_attr_xml(attrs, pad):
    rows = []
    for key, val in attrs.items():
        if val is None or val == [] or val == "":
            continue
        if isinstance(val, list):
            vals = "".join(f"<value>{x(v)}</value>" for v in val)
            rows.append(f'{pad}<custom-attribute attribute-id="{key}">{vals}</custom-attribute>')
        elif isinstance(val, str) and re.fullmatch(r"\d{4}-\d\d-\d\dT[\d:.]+Z", val):
            # Los atributos datetime se importan con zona RFC 822 (+0000), no con «Z».
            rows.append(f'{pad}<custom-attribute attribute-id="{key}">{val[:-1]}+0000</custom-attribute>')
        elif isinstance(val, bool):
            rows.append(f'{pad}<custom-attribute attribute-id="{key}">{"true" if val else "false"}</custom-attribute>')
        else:
            rows.append(f'{pad}<custom-attribute attribute-id="{key}">{x(val)}</custom-attribute>')
    return rows


def images_xml(image, indent):
    if not image:
        return ""
    pad = " " * indent
    groups = "".join(
        f'{pad}    <image-group view-type="{vt}">\n{pad}        <image path="images/{image}"/>\n{pad}    </image-group>\n'
        for vt in ("large", "medium", "small")
    )
    return f"{pad}<images>\n{groups}{pad}</images>\n"


def extras_xml(ingredients, pad):
    """Una opción por ingrediente (pjExtras_<id>, valores no/si) en el maestro.

    Las opciones viven en el maestro (B2C no guarda opciones propias en las variantes), con el precio de
    Familiar. El hook dw.order.calculate del cartucho int_papajohns_demo cobra el precio del tamaño de la
    variante (c_pjExtraPrices); la ficha lo lee de ese mismo atributo.
    """
    price = D.EXTRA_PRICE["family"]
    rows = [f"{pad}<options>"]
    for ing in ingredients:
        p = price if ing["priced"] else 0
        rows += [
            f'{pad}    <option option-id="pjExtras_{ing["iid"]}">',
            f'{pad}        <display-name xml:lang="x-default">{x(ing["name"])}</display-name>',
            f"{pad}        <sort-mode>position</sort-mode>",
            f"{pad}        <option-values>",
            f'{pad}            <option-value value-id="no" default="true">',
            f'{pad}                <display-value xml:lang="x-default">Sin extra</display-value>',
            f'{pad}                <option-value-prices><option-value-price currency="{CURRENCY}">0</option-value-price></option-value-prices>',
            f"{pad}            </option-value>",
            f'{pad}            <option-value value-id="si" default="false">',
            f'{pad}                <display-value xml:lang="x-default">{x(ing["name"])}</display-value>',
            f'{pad}                <option-value-prices><option-value-price currency="{CURRENCY}">{p}</option-value-price></option-value-prices>',
            f"{pad}            </option-value>",
            f"{pad}        </option-values>",
            f"{pad}    </option>",
        ]
    rows.append(f"{pad}</options>")
    return rows


def product_xml(p, ingredients):
    out = [f'    <product product-id="{p["id"]}">']
    out.append(f'        <display-name xml:lang="x-default">{x(p["name"])}</display-name>')
    if p.get("short"):
        out.append(f'        <short-description xml:lang="x-default">{x(p["short"])}</short-description>')
    if p.get("long"):
        out.append(f'        <long-description xml:lang="x-default">{x(p["long"])}</long-description>')
    out.append("        <online-flag>true</online-flag>")
    out.append("        <available-flag>true</available-flag>")
    out.append(f'        <searchable-flag>{"true" if p.get("searchable", True) else "false"}</searchable-flag>')
    img = images_xml(p["image"], 8)
    if img:
        out.append(img.rstrip("\n"))
    out.append("        <tax-class-id>standard</tax-class-id>")
    out.append("        <brand>Papa Johns</brand>")
    ca = custom_attr_xml(p.get("attrs") or {}, " " * 12)
    if ca:
        out += ["        <custom-attributes>", *ca, "        </custom-attributes>"]
    if p["extras"]:
        out += extras_xml(ingredients, " " * 8)
    if p["vattrs"]:
        out.append("        <variations>")
        out.append("            <attributes>")
        for attr_id, label, values in p["vattrs"]:
            out.append(f'                <variation-attribute attribute-id="{attr_id}" variation-attribute-id="{attr_id}">')
            out.append(f'                    <display-name xml:lang="x-default">{x(label)}</display-name>')
            out.append("                    <variation-attribute-values>")
            for value, display in values:
                out.append(f'                        <variation-attribute-value value="{x(value)}">')
                out.append(f'                            <display-value xml:lang="x-default">{x(display)}</display-value>')
                out.append("                        </variation-attribute-value>")
            out.append("                    </variation-attribute-values>")
            out.append("                </variation-attribute>")
        out.append("            </attributes>")
        out.append("            <variants>")
        default_id = default_variant(p)
        for v in p["variants"]:
            default = ' default="true"' if v["id"] == default_id else ""
            out.append(f'                <variant product-id="{v["id"]}"{default}/>')
        out.append("            </variants>")
        out.append("        </variations>")
    out.append("    </product>")

    labels = {a: dict(vals) for a, _, vals in p["vattrs"]}
    for v in p["variants"]:
        suffix = " ".join(labels[a][val] for a, val in v["attrs"].items())
        attrs = dict(v["attrs"])
        size = attrs.get("pjSize")
        if size in D.SERVES:
            attrs["pjServes"] = D.SERVES[size]
        out.append(f'    <product product-id="{v["id"]}">')
        out.append(f'        <display-name xml:lang="x-default">{x(p["name"] + " " + suffix)}</display-name>')
        out.append("        <online-flag>true</online-flag>")
        out.append("        <available-flag>true</available-flag>")
        out.append("        <searchable-flag>true</searchable-flag>")
        out.append("        <tax-class-id>standard</tax-class-id>")
        out.append("        <brand>Papa Johns</brand>")
        out.append("        <custom-attributes>")
        out += custom_attr_xml(attrs, " " * 12)
        out.append("        </custom-attributes>")
        out.append("    </product>")
    return out


def default_variant(p):
    """Variante por defecto: Familiar Tradicional si existe (la que muestra el menú)."""
    for v in p["variants"]:
        if v["attrs"].get("pjSize") == "family" and v["attrs"].get("pjCrust") == "traditional":
            return v["id"]
    return p["variants"][0]["id"] if p["variants"] else None


def ingredient_product_xml(ing):
    attrs = {"pjKind": "ingredient", "pjUnavailableForHalves": ing["no_halves"],
             "pjIngredientGroup": ing["group"], "pjPriceModifier": ing["priced"]}
    out = [f'    <product product-id="{ing["id"]}">',
           f'        <display-name xml:lang="x-default">{x(ing["name"])}</display-name>',
           "        <online-flag>true</online-flag>",
           "        <available-flag>true</available-flag>",
           "        <searchable-flag>false</searchable-flag>"]
    img = images_xml(ing["image"], 8)
    if img:
        out.append(img.rstrip("\n"))
    out += ["        <tax-class-id>standard</tax-class-id>", "        <brand>Papa Johns</brand>",
            "        <custom-attributes>", *custom_attr_xml(attrs, " " * 12), "        </custom-attributes>",
            "    </product>"]
    return out


def master_catalog(products, ingredients):
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="{MASTER}">',
        "    <header>",
        "        <image-settings>",
        '            <internal-location base-path="/"/>',
        "            <view-types>",
        "                <view-type>large</view-type>",
        "                <view-type>medium</view-type>",
        "                <view-type>small</view-type>",
        "            </view-types>",
        "            <alt-pattern>${productname}</alt-pattern>",
        "            <title-pattern>${productname}</title-pattern>",
        "        </image-settings>",
        "    </header>",
        '    <category category-id="root">',
        '        <display-name xml:lang="x-default">Papa Johns Chile - Maestro</display-name>',
        "        <online-flag>true</online-flag>",
        "    </category>",
    ]
    for p in products:
        out += product_xml(p, ingredients)
    for ing in ingredients:
        out += ingredient_product_xml(ing)
    out.append("</catalog>")
    return "\n".join(out) + "\n"


def storefront_catalog(assignments):
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<catalog xmlns="http://www.demandware.com/xml/impex/catalog/2006-10-31" catalog-id="{STOREFRONT}">',
        '    <category category-id="root">',
        '        <display-name xml:lang="x-default">Papa Johns Chile</display-name>',
        "        <online-flag>true</online-flag>",
        "        <refinement-definitions>",
        '            <refinement-definition type="category" bucket-type="none">',
        '                <display-name xml:lang="x-default">Categoría</display-name>',
        "                <sort-mode>category-position</sort-mode>",
        "                <cutoff-threshold>5</cutoff-threshold>",
        "            </refinement-definition>",
        '            <refinement-definition type="price" bucket-type="none">',
        '                <display-name xml:lang="x-default">Precio</display-name>',
        "                <sort-mode>value-name</sort-mode>",
        "                <sort-direction>ascending</sort-direction>",
        "                <cutoff-threshold>5</cutoff-threshold>",
        "            </refinement-definition>",
        '            <refinement-definition type="attribute" attribute-id="pjBadges" bucket-type="none">',
        '                <display-name xml:lang="x-default">Destacadas</display-name>',
        "                <value-set>search-result</value-set>",
        "                <sort-mode>value-name</sort-mode>",
        "                <sort-direction>ascending</sort-direction>",
        "                <cutoff-threshold>10</cutoff-threshold>",
        "            </refinement-definition>",
        '            <refinement-definition type="attribute" attribute-id="pjFoodType" bucket-type="none">',
        '                <display-name xml:lang="x-default">Tipo de comida</display-name>',
        "                <value-set>search-result</value-set>",
        "                <sort-mode>value-name</sort-mode>",
        "                <sort-direction>ascending</sort-direction>",
        "                <cutoff-threshold>10</cutoff-threshold>",
        "            </refinement-definition>",
        '            <refinement-definition type="attribute" attribute-id="pjKind" bucket-type="none">',
        '                <display-name xml:lang="x-default">Tipo de producto</display-name>',
        "                <value-set>search-result</value-set>",
        "                <sort-mode>value-name</sort-mode>",
        "                <sort-direction>ascending</sort-direction>",
        "                <cutoff-threshold>10</cutoff-threshold>",
        "            </refinement-definition>",
        "        </refinement-definitions>",
        "    </category>",
    ]
    for pos, (cid, name, parent, desc) in enumerate(CATEGORIES, start=1):
        out += [
            f'    <category category-id="{cid}">',
            f'        <display-name xml:lang="x-default">{x(name)}</display-name>',
            f'        <description xml:lang="x-default">{x(desc)}</description>',
            f'        <online-flag>{"false" if cid in HIDDEN_CATEGORIES else "true"}</online-flag>',
            f"        <parent>{parent}</parent>",
            f"        <position>{pos}.0</position>",
            *([f"        <image>images/{fetch_image(CATEGORY_IMAGES[cid])}</image>"] if cid in CATEGORY_IMAGES else []),
            "        <custom-attributes>",
            f'            <custom-attribute attribute-id="showInMenu">{"false" if cid in HIDDEN_CATEGORIES else "true"}</custom-attribute>',
            "        </custom-attributes>",
            "    </category>",
        ]
    # El import es merge: se borran las asignaciones de pizzas a subcategorías que ya no les corresponden.
    pizza_subs = [c for c, _, parent, _ in CATEGORIES if parent == "pizzas"]
    for pid, cid in assignments:
        if pid.startswith("pz-"):
            for sub in pizza_subs:
                if sub != cid:
                    out.append(f'    <category-assignment category-id="{sub}" product-id="{pid}" mode="delete"/>')
    for pid, cid in assignments:
        out += [
            f'    <category-assignment category-id="{cid}" product-id="{pid}">',
            "        <primary-flag>true</primary-flag>",
            "    </category-assignment>",
        ]
    out.append("</catalog>")
    return "\n".join(out) + "\n"


def pricebook(products):
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<pricebooks xmlns="http://www.demandware.com/xml/impex/pricebook/2006-10-31">',
        "    <pricebook>",
        f'        <header pricebook-id="{PRICEBOOK}">',
        f"            <currency>{CURRENCY}</currency>",
        '            <display-name xml:lang="x-default">Precios lista CLP</display-name>',
        "            <online-flag>true</online-flag>",
        "        </header>",
        "        <price-tables>",
    ]
    for p in products:
        rows = [(v["id"], v["price"]) for v in p["variants"]] if p["variants"] else [(p["id"], p["price"])]
        for pid, price in rows:
            if price is None:
                continue
            out += [
                f'            <price-table product-id="{pid}">',
                f'                <amount quantity="1">{money(price)}</amount>',
                "            </price-table>",
            ]
    out += ["        </price-tables>", "    </pricebook>", "</pricebooks>"]
    return "\n".join(out) + "\n"


def inventory_list(list_id, description, records, default_instock="true"):
    out = [
        "    <inventory-list>",
        f'        <header list-id="{list_id}">',
        f"            <default-instock>{default_instock}</default-instock>",
        f"            <description>{x(description)}</description>",
        "            <use-bundle-inventory-only>false</use-bundle-inventory-only>",
        "            <on-order>false</on-order>",
        "        </header>",
        "        <records>",
    ]
    for pid, allocation, perpetual in records:
        out += [
            f'            <record product-id="{pid}">',
            f"                <allocation>{allocation}</allocation>",
            f"                <perpetual>{'true' if perpetual else 'false'}</perpetual>",
            "            </record>",
        ]
    out += ["        </records>", "    </inventory-list>"]
    return out


def store_list_id(store_id):
    return "inventory_" + store_id.replace("-", "_")


def inventory(products, ingredients):
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<inventory xmlns="http://www.demandware.com/xml/impex/inventory/2007-05-31">']
    records = [(pid, 1000, True) for p in products for pid in ([v["id"] for v in p["variants"]] or [p["id"]])]
    records += [(i["id"], 1000, True) for i in ingredients]
    out += inventory_list(INVENTORY, "Inventario Papa Johns Chile (perpetuo)", records)
    # Inventario por tienda de las tiendas de la demo: todo disponible (default-instock) salvo lo agotado.
    # Caso 6 (R4.6): el champiñón agotado en El Bosque.
    for sid, s in D.DEMO_STORES.items():
        recs = [("ing-champinon", 0, False)] if sid == "pj-48" else [("ing-champinon", 1000, True)]
        out += inventory_list(store_list_id(sid), f"Inventario de la tienda {s['label']}", recs)
    out.append("</inventory>")
    return "\n".join(out) + "\n"


# ---------- Tiendas ----------

DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]


def store_attrs(s):
    sid = f"pj-{s['id']}"
    demo = D.DEMO_STORES.get(sid)
    if demo:
        return {"pjPickupMinutes": demo["pickup"], "pjDeliveryMinutes": demo["delivery"],
                "pjOpenUntil": demo["open_until"], "pjOpensAt": demo["opens_at"], "pjCash": demo["cash"],
                "pjClosed": demo["closed"]}
    return {"pjPickupMinutes": s.get("pick_up_wait_time") or 15, "pjDeliveryMinutes": s.get("delivery_wait_time") or 30,
            "pjOpenUntil": "23:30", "pjOpensAt": "11:00", "pjCash": bool((s.get("payment_methods") or {}).get("cash")),
            "pjClosed": False}


def stores_xml(stores):
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<stores xmlns="http://www.demandware.com/xml/impex/store/2007-04-30">',
    ]
    for s in stores:
        sid = f"pj-{s['id']}"
        attrs = store_attrs(s)
        hours = f"Todos los días de {attrs['pjOpensAt']} a {attrs['pjOpenUntil']}"
        out += [
            f'    <store store-id="{sid}">',
            f'        <name>Papa Johns {x(s["name"].rstrip("."))}</name>',
            f'        <address1>{x(s["text_address"])}</address1>',
            f'        <city>{x(s.get("commune") or s.get("region"))}</city>',
            "        <country-code>CL</country-code>",
            f'        <phone>{x(s.get("phone"))}</phone>',
            f'        <store-hours xml:lang="x-default">{x(hours)}</store-hours>',
            f'        <latitude>{s["latitude"]}</latitude>',
            f'        <longitude>{s["longitude"]}</longitude>',
            *([f"        <inventory-list-id>{store_list_id(sid)}</inventory-list-id>"] if sid in D.DEMO_STORES else []),
            "        <store-locator-enabled-flag>true</store-locator-enabled-flag>",
            "        <custom-attributes>",
            *custom_attr_xml(attrs, " " * 12),
            "        </custom-attributes>",
            "    </store>",
        ]
    out.append("</stores>")
    return "\n".join(out) + "\n"


# ---------- Metadata ----------

def attr_def(aid, label, typ, description=""):
    extra = ""
    if typ == "string":
        extra = "\n                <min-length>0</min-length>"
    return f"""            <attribute-definition attribute-id="{aid}">
                <display-name xml:lang="x-default">{x(label)}</display-name>
                <description xml:lang="x-default">{x(description)}</description>
                <type>{typ}</type>
                <localizable-flag>false</localizable-flag>
                <mandatory-flag>false</mandatory-flag>
                <externally-managed-flag>false</externally-managed-flag>{extra}
            </attribute-definition>"""


def type_ext(type_id, attrs, group_id="papajohns", group_label="Papa Johns"):
    defs = "\n".join(attr_def(*a) for a in attrs)
    refs = "\n".join(f'                <attribute attribute-id="{a[0]}"/>' for a in attrs)
    return f"""    <type-extension type-id="{type_id}">
        <custom-attribute-definitions>
{defs}
        </custom-attribute-definitions>
        <group-definitions>
            <attribute-group group-id="{group_id}">
                <display-name xml:lang="x-default">{group_label}</display-name>
{refs}
            </attribute-group>
        </group-definitions>
    </type-extension>"""


PRODUCT_ATTRS = [
    ("pjSize", "Tamaño (Papa Johns)", "string"),
    ("pjCrust", "Masa (Papa Johns)", "string"),
    ("pjOption", "Opción (Papa Johns)", "string"),
    ("pjKind", "Tipo de producto", "string", "pizza, builder, combo, side, drink, dessert, extra, ingredient"),
    ("pjBadges", "Insignias", "set-of-string", "mas-pedida, novedad, ideal-para-2"),
    ("pjFoodType", "Tipo de comida", "set-of-string", "vegetariana, picante"),
    ("pjSensory", "Texto que se saborea", "string"),
    ("pjServes", "Para cuántos", "string", "En la variante (Para 2–3, Para 3–4, Para 4–5) o el combo"),
    ("pjWeeklyOrders", "Pedidas esta semana", "int"),
    ("pjRating", "Estrellas", "double"),
    ("pjReviewCount", "Opiniones", "int"),
    ("pjBaseIngredients", "Ingredientes base", "set-of-string", "IDs de ingrediente; el producto del ingrediente es ing-<id>"),
    ("pjHalvesEnabled", "Admite mitades", "boolean"),
    ("pjRedeemPoints", "Canjeable con puntos", "int"),
    ("pjOccasion", "Ocasión", "set-of-string", "para-1, para-2, para-3, para-4, para-6"),
    ("pjSlots", "Lo que se elige (JSON)", "text"),
    ("pjValidFrom", "Vigente desde", "datetime"),
    ("pjValidTo", "Vigente hasta", "datetime"),
    ("pjDispatch", "Modalidad", "string", "delivery, pickup, both"),
    ("pjPriceBefore", "Precio antes", "int"),
    ("pjExtraPrices", "Precio del ingrediente extra por tamaño (JSON)", "string", '{"medium":1450,"family":1940,"extra_large":2290}'),
    ("pjUnavailableForHalves", "No disponible en mitades", "boolean", "Ingrediente que no se puede poner en una mitad"),
    ("pjIngredientGroup", "Grupo de ingrediente", "string"),
    ("pjPriceModifier", "Cobra como extra", "boolean"),
]
LINE_ITEM_ATTRS = [
    ("pjHalves", "Mitades (JSON)", "text", '[{"part":1,"product":"pz-pollo-bbq"},…]'),
    ("pjParts", "Cantidad de partes", "int"),
    ("pjRemoved", "Ingredientes quitados", "set-of-string"),
    ("pjComboChoices", "Elección del combo (JSON)", "text", '[{"slot":"pizza1","product":"pz-pollo-bbq-family-traditional"},…]'),
]
STORE_ATTRS = [
    ("pjPickupMinutes", "Minutos de retiro", "int"),
    ("pjDeliveryMinutes", "Minutos de delivery", "int"),
    ("pjOpenUntil", "Abierta hasta", "string"),
    ("pjOpensAt", "Abre a las", "string"),
    ("pjCash", "Acepta efectivo", "boolean"),
    ("pjClosed", "Cerrada (forzada)", "boolean"),
]
PROFILE_ATTRS = [
    ("pjPoints", "Papa Puntos (saldo)", "int"),
    ("pjPointsLog", "Movimientos de puntos (JSON)", "text"),
    ("pjFavorites", "Favoritas", "set-of-string"),
    ("pjDoublePoints", "Puntos dobles en el próximo pedido", "boolean"),
    ("pjMarketingOptIn", "Acepta ofertas", "boolean"),
]
ORDER_ATTRS = [
    ("pjStatus", "Estado del pedido", "string", "recibido, preparacion, listo, en_camino, entregado, retirado"),
    ("pjStatusAt", "Último cambio de estado", "datetime"),
    ("pjEta", "Hora estimada", "datetime"),
    ("pjPointsEarned", "Puntos del pedido", "int"),
    ("pjPointsState", "Estado de los puntos", "string", "por_acreditar, acreditados"),
    ("pjDocType", "Boleta o factura", "string"),
    ("pjRut", "RUT", "string"),
    ("pjBusinessName", "Razón social", "string"),
    ("pjBusinessActivity", "Giro", "string"),
    ("pjBusinessAddress", "Dirección comercial", "string"),
    ("pjCashAmount", "Paga con (efectivo)", "int"),
    ("pjNote", "Nota para la tienda", "string"),
    ("pjOrderRating", "Opinión del pedido (1 a 5)", "int"),
    ("pjReminder", "Recordatorio elegido", "string"),
    ("pjRedeemed", "Puntos canjeados", "int"),
    ("pjPlacedAt", "Fecha visible del pedido (demo)", "datetime",
     "Pedidos históricos de demo: la fecha real de creación no se puede cambiar"),
    ("pjStoreId", "Tienda del pedido", "string"),
]
SHIPPING_ATTRS = [("pjMinOrder", "Pedido mínimo", "int", "Mínimo de productos para este método (delivery $12.000)")]


def option_attrs(ingredients):
    """B2C exige un atributo de producto con el mismo ID de cada opción (guarda su valor por defecto)."""
    return [(f"pjExtras_{i['iid']}", f"Extra: {i['name']}", "string") for i in ingredients]


def meta_xml(ingredients):
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<metadata xmlns="http://www.demandware.com/xml/impex/metadata/2006-10-31">
{type_ext("Product", PRODUCT_ATTRS + option_attrs(ingredients))}
{type_ext("ProductLineItem", LINE_ITEM_ATTRS)}
{type_ext("Store", STORE_ATTRS)}
{type_ext("Profile", PROFILE_ATTRS)}
{type_ext("Order", ORDER_ATTRS)}
{type_ext("ShippingMethod", SHIPPING_ATTRS)}
</metadata>
"""


def site_xml():
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<site xmlns="http://www.demandware.com/xml/impex/site/2007-04-30" site-id="{SITE_ID}">
    <name>Papa Johns Chile</name>
    <currency>{CURRENCY}</currency>
    <taxation>gross</taxation>
    <custom-cartridges>{CARTRIDGES}</custom-cartridges>
    <storefront-status>online</storefront-status>
</site>
"""


def site_preferences():
    prefs = {
        "SiteCatalog": STOREFRONT,
        "SiteCurrencies": CURRENCY,
        "SiteCustomerList": SITE_ID,
        "SiteDefaultLocale": LOCALE,
        "SiteInventoryList": INVENTORY,
        "SiteLibrary": LIBRARY,
        "SiteLocales": f"default:{LOCALE}",
        "SitePriceBooks": PRICEBOOK,
        "SiteTimezone": "America/Santiago",
        "StorefrontURLsEnabled": "true",
        "OrderLifetime": "0",
        # Cada combo o pizza personalizada es su propia línea (no se suman cantidades sobre la misma).
        "AddProductToBasketBehavior": "AllowRepeats",
    }
    rows = "\n".join(f'            <preference preference-id="{k}">{v}</preference>' for k, v in prefs.items())
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<preferences xmlns="http://www.demandware.com/xml/impex/preferences/2007-03-31">
    <standard-preferences>
        <all-instances>
{rows}
        </all-instances>
    </standard-preferences>
    <custom-preferences>
        <all-instances>
            <preference preference-id="countryCode">CL</preference>
        </all-instances>
    </custom-preferences>
</preferences>
"""


def shipping_xml():
    # Ojo: cada método necesita su atributo default explícito o el import falla en silencio.
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<shipping xmlns="http://www.demandware.com/xml/impex/shipping/2007-03-31">
    <shipping-method method-id="001" default="true">
        <display-name xml:lang="x-default">Despacho a domicilio</display-name>
        <description xml:lang="x-default">Llega en 30 a 45 minutos. Pedido mínimo $12.000</description>
        <online-flag>true</online-flag>
        <tax-class-id>standard</tax-class-id>
        <price-table>
            <amount order-value="0">1990</amount>
        </price-table>
        <custom-attributes>
            <custom-attribute attribute-id="estimatedArrivalTime">30-45 min</custom-attribute>
            <custom-attribute attribute-id="pjMinOrder">12000</custom-attribute>
        </custom-attributes>
        <currency>{CURRENCY}</currency>
    </shipping-method>
    <shipping-method method-id="005" default="false">
        <display-name xml:lang="x-default">Retiro en tienda</display-name>
        <description xml:lang="x-default">Listo en 15 minutos</description>
        <online-flag>true</online-flag>
        <tax-class-id>standard</tax-class-id>
        <price-table>
            <amount order-value="0">0</amount>
        </price-table>
        <custom-attributes>
            <custom-attribute attribute-id="estimatedArrivalTime">15 min</custom-attribute>
            <custom-attribute attribute-id="storePickupEnabled">true</custom-attribute>
        </custom-attributes>
        <currency>{CURRENCY}</currency>
    </shipping-method>
</shipping>
"""


def customer_groups_xml():
    """Grupos de la demo (contrato §2). pj-anuncio es dinámico: entra quien trae el source code PJSD26."""
    return """<?xml version="1.0" encoding="UTF-8"?>
<customer-groups xmlns="http://www.demandware.com/xml/impex/customergroup/2007-06-30">
    <customer-group group-id="pj-frecuente">
        <description>Sofía: cliente con pedidos (asignación estática por script OCAPI)</description>
        <custom-attributes/>
    </customer-group>
    <customer-group group-id="pj-reactivacion">
        <description>Valentina: reactivación (asignación estática por script OCAPI)</description>
        <custom-attributes/>
    </customer-group>
    <customer-group group-id="pj-anuncio">
        <description>Diego: llega por el anuncio del Super Dúo (source code PJSD26)</description>
        <membership-rule>
            <included-customers>
                <condition-group match-mode="all">
                    <condition>
                        <attribute-path>session.sourceCodeGroup</attribute-path>
                        <operator>is-equal</operator>
                        <string>pj-anuncio-super-duo</string>
                    </condition>
                </condition-group>
            </included-customers>
        </membership-rule>
        <custom-attributes/>
    </customer-group>
</customer-groups>
"""


SEARCHABLE_CUSTOM = ["pjSensory", "pjKind", "pjBadges", "pjFoodType"]


def search_xml():
    """Atributos buscables del sitio (incluye los de la demo para que entren al índice de producto)."""
    base = [("category.displayName", 2.0), ("product.ID", 1.0), ("product.brand", 2.0), ("product.name", 2.0)]
    base += [(f"product.custom.{a}", 1.0) for a in SEARCHABLE_CUSTOM]
    rows = "".join(f"""
        <searchable-attribute>
            <attribute-path>{path}</attribute-path>
            <boost>{boost}</boost>
            <auto-correction>true</auto-correction>
        </searchable-attribute>""" for path, boost in base)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<search xmlns="http://www.demandware.com/xml/impex/search2/2010-02-19">
    <searchable-attributes>{rows}
    </searchable-attributes>
    <index-settings>
        <indexed-locales>
            <locale>x-default</locale>
            <locale>es-CL</locale>
        </indexed-locales>
        <stemming xml:lang="x-default">English</stemming>
        <stemming xml:lang="es-CL">Spanish</stemming>
    </index-settings>
</search>
"""


def promotions_xml(drinks_1500):
    """Campaña de la demo y sus promociones (contrato §4.2).

    - pj-hazlo-combo: pizza + Palitos de Ajo + bebida 1,5 L bajan $2.490 (la oferta de la hoja, 04). La usa
      el pedido canónico de Sofía ($23.890).
    - pj-super-duo-pickup: Super Dúo solo retiro (caso 2). Existe apagada; el panel la enciende por OCAPI.
    Las demás promociones del contrato (combo-palitos-upsell, BIN, canje) son de DAT-08.
    """
    pizza_cats = "".join(f"<category-id>{c}</category-id>" for c, _, parent, _ in CATEGORIES
                         if c == "pizzas" or parent == "pizzas")
    drinks = "".join(f"<product-id>{d}</product-id>" for d in drinks_1500)

    def constraint(spec):
        return f"""
                    <product-constraint>
                        <quantity>1</quantity>
                        <product-specification>
                            <included-products>
                                <condition-group>{spec}</condition-group>
                            </included-products>
                        </product-specification>
                    </product-constraint>"""

    pizza = constraint(f'<category-condition catalog-id="{STOREFRONT}" operator="is equal">{pizza_cats}</category-condition>')
    sides = (constraint('<product-id-condition operator="is equal"><product-id>cp-palitos-de-ajo</product-id></product-id-condition>')
             + constraint(f'<product-id-condition operator="is equal">{drinks}</product-id-condition>'))
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<promotions xmlns="http://www.demandware.com/xml/impex/promotion/2008-01-31">
    <campaign campaign-id="pj-demo">
        <description>Promociones de la demo de Papa Johns Chile</description>
        <enabled-flag>true</enabled-flag>
        <customer-groups match-mode="any">
            <customer-group group-id="Everyone"/>
        </customer-groups>
    </campaign>
    <promotion promotion-id="pj-hazlo-combo">
        <enabled-flag>true</enabled-flag>
        <archived-flag>false</archived-flag>
        <searchable-flag>false</searchable-flag>
        <refinable-flag>false</refinable-flag>
        <prevent-requalifying-flag>false</prevent-requalifying-flag>
        <prorate-across-eligible-items-flag>false</prorate-across-eligible-items-flag>
        <exclusivity>no</exclusivity>
        <name xml:lang="x-default">Hazlo combo</name>
        <callout-msg xml:lang="x-default">Hazlo combo: Palitos de Ajo y bebida 1,5 L por $6.990 (ahorras $2.490)</callout-msg>
        <product-promotion-rule>
            <qualifying-products-combination>
                <product-constraints>{pizza}
                </product-constraints>
            </qualifying-products-combination>
            <discounted-products-combination>
                <product-constraints>{sides}
                </product-constraints>
            </discounted-products-combination>
            <simple-discount>
                <total-fixed-price>6990</total-fixed-price>
            </simple-discount>
        </product-promotion-rule>
    </promotion>
    <promotion promotion-id="pj-super-duo-pickup">
        <enabled-flag>false</enabled-flag>
        <archived-flag>false</archived-flag>
        <searchable-flag>false</searchable-flag>
        <refinable-flag>false</refinable-flag>
        <prevent-requalifying-flag>false</prevent-requalifying-flag>
        <prorate-across-eligible-items-flag>false</prorate-across-eligible-items-flag>
        <exclusivity>no</exclusivity>
        <name xml:lang="x-default">Super Dúo solo retiro</name>
        <callout-msg xml:lang="x-default">Super Dúo disponible solo con retiro en tienda</callout-msg>
        <product-promotion-rule>
            <discounted-products>
                <included-products>
                    <condition-group>
                        <product-id-condition operator="is equal"><product-id>cb-super-duo</product-id></product-id-condition>
                    </condition-group>
                </included-products>
            </discounted-products>
            <simple-discount>
                <fixed-price>22590</fixed-price>
            </simple-discount>
        </product-promotion-rule>
    </promotion>
    <promotion-campaign-assignment promotion-id="pj-hazlo-combo" campaign-id="pj-demo">
        <qualifiers match-mode="any">
            <customer-groups/>
            <source-codes/>
            <coupons/>
        </qualifiers>
    </promotion-campaign-assignment>
    <promotion-campaign-assignment promotion-id="pj-super-duo-pickup" campaign-id="pj-demo">
        <qualifiers match-mode="any">
            <customer-groups/>
            <source-codes/>
            <coupons/>
        </qualifiers>
    </promotion-campaign-assignment>
</promotions>
"""


def source_codes_xml():
    return """<?xml version="1.0" encoding="UTF-8"?>
<sourcecodes xmlns="http://www.demandware.com/xml/impex/sourcecode/2007-03-31">
    <sourcecode-group group-id="pj-anuncio-super-duo">
        <description>Anuncio del Super Dúo (campaña PJSD26)</description>
        <enabled-flag>true</enabled-flag>
        <code-specs>
            <code-spec>PJSD26</code-spec>
        </code-specs>
    </sourcecode-group>
</sourcecodes>
"""


def ocapi_settings():
    """Permisos OCAPI Data del API client de dw.json (se genera en build/, nunca en el repo)."""
    client = json.loads(DW_JSON.read_text())["client-id"]
    rw = {"read_attributes": "(**)", "write_attributes": "(**)"}
    return json.dumps({
        "_v": "19.5",
        "clients": [{
            "client_id": client,
            "resources": [{"resource_id": "/**", "methods": ["get", "post", "put", "patch", "delete"], **rw}],
        }],
    }, indent=2) + "\n"


def tax_xml():
    return """<?xml version="1.0" encoding="UTF-8"?>
<tax xmlns="http://www.demandware.com/xml/impex/tax/2007-02-14">
    <tax-classes>
        <tax-class class-id="exempt">
            <display-name>Exento</display-name>
        </tax-class>
        <tax-class class-id="standard" default="true">
            <display-name>IVA</display-name>
        </tax-class>
    </tax-classes>
    <tax-jurisdictions>
        <tax-jurisdiction jurisdiction-id="CL">
            <display-name>Chile</display-name>
            <address-mappings>
                <address-mapping key1="CL" key2="-"/>
            </address-mappings>
        </tax-jurisdiction>
        <tax-jurisdiction jurisdiction-id="Default" default="true">
            <display-name>Default</display-name>
        </tax-jurisdiction>
    </tax-jurisdictions>
    <tax-rates>
        <tax-rate jurisdiction-id="CL" class-id="standard">0.19</tax-rate>
        <tax-rate jurisdiction-id="CL" class-id="exempt">0.0</tax-rate>
        <tax-rate jurisdiction-id="Default" class-id="standard">0.19</tax-rate>
        <tax-rate jurisdiction-id="Default" class-id="exempt">0.0</tax-rate>
    </tax-rates>
</tax>
"""


def jobs_xml():
    """Job para reconstruir los índices de búsqueda del sitio (se ejecuta tras cada import)."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<jobs xmlns="http://www.demandware.com/xml/impex/jobs/2015-07-01">
    <job job-id="{SITE_ID}-Reindex" priority="0">
        <description>Reconstruye los índices de búsqueda de {SITE_ID}</description>
        <parameters/>
        <flow>
            <context site-id="{SITE_ID}"/>
            <step step-id="reindex" type="SearchReindex" enforce-restart="false">
                <description/>
                <parameters>
                    <parameter name="Product related search indexes">true</parameter>
                    <parameter name="Active data search index">false</parameter>
                    <parameter name="Content search index">true</parameter>
                    <parameter name="Indexer Type">Full Index Rebuild</parameter>
                </parameters>
            </step>
        </flow>
        <rules/>
        <triggers/>
    </job>
</jobs>
"""


def customer_list_xml():
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<customer-list xmlns="http://www.demandware.com/xml/impex/customer/2006-10-31" list-id="{SITE_ID}">
    <header>
        <customerno-sequence-enabled>false</customerno-sequence-enabled>
        <customer-lockout-enabled>false</customer-lockout-enabled>
        <max-failed-logins>10</max-failed-logins>
        <lockout-effective-period>30</lockout-effective-period>
        <customer-login-attempt-reset-time>30</customer-login-attempt-reset-time>
        <min-password-length>8</min-password-length>
        <min-password-special-chars>0</min-password-special-chars>
        <force-password-contains-alpha>true</force-password-contains-alpha>
        <force-password-contains-numeric>true</force-password-contains-numeric>
        <force-password-mixed-case>false</force-password-mixed-case>
        <max-password-age>365000</max-password-age>
        <max-password-reset-token-age>30</max-password-reset-token-age>
    </header>
</customer-list>
"""


def locales_xml(reference):
    """Crea es_CL copiando la configuración regional de 'es' del export de referencia."""
    text = reference.read_text()
    block = re.search(r'<locale locale-id="es">(.*?)</locale>', text, re.S).group(1)
    block = re.sub(r"<fallback-locale>.*?</fallback-locale>", "<fallback-locale>es</fallback-locale>", block)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<locales xmlns="http://www.demandware.com/xml/impex/locales/2015-04-30">
    <locale locale-id="{LOCALE}">{block}</locale>
</locales>
"""


# Contenido de Page Designer. Las fotos de promoción salen de promotions.json (por nombre de oferta)
# y se publican en la librería del sitio.
HERO_SLIDES = [
    # oferta, texto alternativo, botón, enlace
    ("Pizza del Mes Boom de Jamon", "Pizza del mes: Boom de Jamón familiar desde $9.990 con retiro en tienda",
     "Pedir Boom de Jamón", "/p/pz-boom-de-jamon"),
    ("Super Dúo", "Super Dúo: 2 pizzas familiares desde $22.590", "Elegir mis pizzas", "/c/pizzas"),
    ("BOX HALLOWEEN", "Dulce y Truco: Boom de Trencito y Cheesyqueños por $9.490", "Ver acompañamientos",
     "/c/acompanamientos"),
    ("Papa Combo Palitos", "Combi completa: pizza, bebida 1,5 L y acompañamiento desde $16.490", "Ver pizzas",
     "/c/pizzas"),
    ("Epic One!", "Epic One: pizza familiar de 1 ingrediente desde $7.990", "Ver pizzas", "/c/pizzas"),
    ("Super Cuarteto", "Super Cuarteto: 4 pizzas familiares desde $11.150 cada una", "Elegir mis pizzas",
     "/c/pizzas"),
]

MEGA_MENU_CARDS = [
    # región (categoría), oferta, título, descripción, botón, enlace
    ("pizzas", "Pizza del Mes Boom de Jamon", "Pizza del mes", "Boom de Jamón familiar a precio especial.",
     "Pedir ahora", "/p/pz-boom-de-jamon"),
    ("acompanamientos", "BOX HALLOWEEN", "Dulce y Truco", "Boom de Trencito + Cheesyqueños con salsa Hot Honey.",
     "Ver acompañamientos", "/c/acompanamientos"),
    ("postres", "COMBO BOOM DE TRENCITO", "Boom de Trencito", "El nuevo postre, ideal con tu pizza familiar.",
     "Ver postres", "/c/postres"),
    ("bebidas", "PAPA GAMER", "Papa Gamer", "Pizza mediana y 2 Red Bull a elección.", "Ver bebidas", "/c/bebidas"),
]

ANNOUNCEMENT = ("Despacho a domicilio en 30-45 min o retiro gratis en tienda", "Pedir ahora", "/c/pizzas")


def promo_images():
    """Descarga la foto principal de cada oferta y devuelve {nombre de oferta: archivo}."""
    offers = json.loads((RAW / "promotions.json").read_text())
    return {o["name"]: fetch_image(o["pictures"][0]["url"]) for o in offers if o.get("pictures")}


def pd_image(name):
    return {"path": f"images/{name}", "focal_point": {"x": 0.5, "y": 0.5}}


def pd_content(content_id, type_id, data=None, links=(), name=None):
    """Un contenido de Page Designer (página o componente) con sus componentes hijos."""
    is_page = type_id.startswith("page.")
    data_xml = f'\n        <data xml:lang="x-default">{x(json.dumps(data, ensure_ascii=False, indent=2))}</data>' if data else ""
    links_xml = ""
    if links:
        items = "".join(
            f"""
            <content-link content-id="{cid}" type="{type_id}.{region}">
                <position>{pos}.0</position>
            </content-link>"""
            for pos, (region, cid) in enumerate(links, 1)
        )
        links_xml = f"\n        <content-links>{items}\n        </content-links>"
    page_xml = searchable_xml = config_xml = ""
    if is_page:
        config_xml = '\n        <config>{"visibility": []}</config>'
        searchable_xml = "\n        <searchable-flag>false</searchable-flag>"
        page_xml = f"""
        <display-name xml:lang="x-default">{x(name or content_id)}</display-name>"""
    return f"""
    <content content-id="{content_id}">{page_xml}
        <type>{type_id}</type>{config_xml}{data_xml}
        <online-flag>true</online-flag>
        <online-flag site-id="{SITE_ID}">true</online-flag>{searchable_xml}
        <page-attributes/>{links_xml}
    </content>
"""


def library_xml(images):
    """Librería del sitio: portada, header (aviso) y mega-menu."""
    contents = []

    slides = []
    for i, (offer, alt, cta, link) in enumerate(HERO_SLIDES, 1):
        cid = f"pj-hero-{i}"
        slides.append(("slides", cid))
        contents.append(pd_content(cid, "component.Content.hero", {
            "imageUrl": pd_image(images[offer]),
            "imageAlt": alt,
            "ctaText": cta,
            "ctaLink": link,
            "ctaAriaLabel": alt,
            "buttonStyle": "Primary",
            "overlayPosition": "Bottom Left",
            "overlayAlignment": "left",
            "overlay": "None",
        }))
    contents.append(pd_content("pj-hero-carousel", "component.Layout.heroCarousel", {
        "autoPlay": True,
        "autoPlayInterval": 6000,
        "showDots": True,
        "showNavigation": True,
        "overlay": "None",
    }, slides))
    contents.append(pd_content("pj-carousel-pan-pizza", "component.Layout.productCarousel",
                               {"title": "Pan Pizza", "categoryId": "pan-pizza", "limit": 12}))
    contents.append(pd_content("pj-carousel-acompanamientos", "component.Layout.productCarousel",
                               {"title": "Para acompañar", "categoryId": "acompanamientos", "limit": 12}))
    contents.append(pd_content("homepage", "page.homePage", links=[
        ("top", "pj-hero-carousel"),
        ("afterFeatured", "pj-carousel-pan-pizza"),
        ("afterContent", "pj-carousel-acompanamientos"),
    ], name="Portada"))

    message, link_text, link_url = ANNOUNCEMENT
    contents.append(pd_content("pj-announcement", "component.Content.announcementBanner", {
        "message": message,
        "linkText": link_text,
        "linkUrl": link_url,
        "colorScheme": "primary",
        "height": "sm",
        "alignment": "center",
    }))
    contents.append(pd_content("header", "component.Layout.header", links=[("announcement", "pj-announcement")]))

    cards = []
    for region, offer, title, description, button, link in MEGA_MENU_CARDS:
        cid = f"pj-menu-{region}"
        cards.append((f"region_{region}", cid))
        contents.append(pd_content(cid, "component.Content.contentCard", {
            "title": title,
            "titleTypography": "Heading 4",
            "description": description,
            "imageUrl": pd_image(images[offer]),
            "imageAlt": title,
            "buttonText": button,
            "buttonLink": link,
            "showBackground": False,
            "showBorder": False,
        }))
    contents.append(pd_content("mega-menu", "component.Layout.megaMenu", links=cards))

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<library xmlns="http://www.demandware.com/xml/impex/library/2006-10-31" library-id="{LIBRARY}">
    <folder folder-id="root">
        <online-flag>true</online-flag>
    </folder>
{"".join(contents)}</library>
"""


def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def main():
    prices, sc, stores, raw_ingredients = load()
    ingredients = build_ingredients(raw_ingredients)
    products, assignments = build_products(prices, sc)
    combos = build_combos(prices)
    assignments = [(c["id"], "ofertas") for c in combos] + assignments + [(i["id"], "ingredientes") for i in ingredients]

    if OUT.exists():
        shutil.rmtree(OUT)
    write(OUT / "version.txt", "PapaJohnsCL site archive\n")
    write(OUT / "meta" / "system-objecttype-extensions.xml", meta_xml(ingredients))
    write(OUT / "ocapi-settings" / "wapi_data_config.json", ocapi_settings())
    write(OUT / "locales.xml", locales_xml(ROOT / "reference" / "locales.xml"))
    write(OUT / "catalogs" / MASTER / "catalog.xml", master_catalog(products + combos, ingredients))
    write(OUT / "catalogs" / STOREFRONT / "catalog.xml", storefront_catalog(assignments))
    write(OUT / "pricebooks" / f"{PRICEBOOK}.xml", pricebook(products + combos))
    write(OUT / "inventory-lists" / f"{INVENTORY}.xml", inventory(products + combos, ingredients))
    write(OUT / "jobs.xml", jobs_xml())
    write(OUT / "customer-lists" / f"{SITE_ID}.xml", customer_list_xml())
    site = OUT / "sites" / SITE_ID
    write(site / "site.xml", site_xml())
    write(site / "preferences.xml", site_preferences())
    write(site / "shipping.xml", shipping_xml())
    write(site / "tax.xml", tax_xml())
    write(site / "stores.xml", stores_xml(stores))
    write(site / "customer-groups.xml", customer_groups_xml())
    write(site / "sourcecodes.xml", source_codes_xml())
    write(site / "search2.xml", search_xml())
    write(site / "promotions.xml", promotions_xml(drinks_1500(prices)))
    for name in ("payment-methods.xml", "payment-processors.xml"):
        shutil.copy(ROOT / "reference" / name, site / name)

    category_static = OUT / "catalogs" / STOREFRONT / "static" / "default" / "images"
    category_static.mkdir(parents=True, exist_ok=True)
    for url in CATEGORY_IMAGES.values():
        name = fetch_image(url)
        shutil.copy(CACHE / name, category_static / name)

    static = OUT / "catalogs" / MASTER / "static" / "default" / "images"
    (static / "combos").mkdir(parents=True, exist_ok=True)
    for p in products + ingredients:
        if p["image"]:
            shutil.copy(CACHE / p["image"], static / p["image"])
    for c in combos:
        shutil.copy(ASSETS / c["image"], static / c["image"])

    images = promo_images()
    library = OUT / "libraries" / LIBRARY
    write(library / "library.xml", library_xml(images))
    library_static = library / "static" / "default" / "images"
    library_static.mkdir(parents=True, exist_ok=True)
    used = {o for o, *_ in HERO_SLIDES} | {c[1] for c in MEGA_MENU_CARDS}
    for offer in used:
        shutil.copy(CACHE / images[offer], library_static / images[offer])

    nvar = sum(len(p["variants"]) for p in products)
    print(f"Productos: {len(products)} maestros/simples, {nvar} variantes, {len(combos)} combos, "
          f"{len(ingredients)} ingredientes, {len(stores)} tiendas -> {OUT}")


if __name__ == "__main__":
    main()
