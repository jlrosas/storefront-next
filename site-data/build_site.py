#!/usr/bin/env python3
"""Genera el site archive de PapaJohnsCL para B2C Commerce a partir de datos/raw.

Uso:  python3 site-data/build_site.py
Salida: site-data/build/PapaJohnsCL/ (lista para `b2c job import`).
Las imágenes se descargan una vez a site-data/.cache/images.
"""
import json
import re
import shutil
import unicodedata
import urllib.request
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "source"
OUT = ROOT / "build" / "PapaJohnsCL"
CACHE = ROOT / ".cache" / "images"

SITE_ID = "PapaJohnsCL"
MASTER = "papajohns-cl-master"
STOREFRONT = "papajohns-cl-storefront"
PRICEBOOK = "papajohns-cl-list-prices"
INVENTORY = "inventory_papajohns_cl"
LOCALE = "es_CL"
CURRENCY = "CLP"
# Librería que el sitio tiene asignada (BM la crea junto con el sitio).
LIBRARY = "PapaJohnsCLLibrary"

# Productos que no se cargan en esta fase: precio 0 o 1 (no vendibles tal cual).
SKIP = {"Pizza por mitades", "Fanta 220 ml"}

SIZE_ORDER = ["individual", "medium", "family", "extra_large"]

CATEGORIES = [
    # id, nombre, padre, descripción
    ("pizzas", "Pizzas", "root", "Nuestras pizzas, hechas con masa fresca."),
    ("pizzas-clasicas", "Clásicas", "pizzas", "Las favoritas de siempre."),
    ("pan-pizza", "Pan Pizza", "pizzas", "Masa alta y esponjosa."),
    ("pizzas-croissant", "Croissant", "pizzas", "Borde de croissant relleno."),
    ("acompanamientos", "Acompañamientos", "root", "Para compartir."),
    ("postres", "Postres", "root", "El final perfecto."),
    ("bebidas", "Bebidas", "root", "Bebidas frías."),
    ("salsas-extras", "Salsas y extras", "root", "Complementa tu pedido."),
]

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


def slug(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def x(text):
    return escape(str(text or "").strip())


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


def load():
    prices = json.loads((RAW / "prices.json").read_text())
    sc = json.loads((RAW / "sizes_and_crusts.json").read_text())
    stores = json.loads((RAW / "stores.json").read_text())
    return prices, sc, stores


def build_products(prices, sc):
    """Devuelve (productos, asignaciones) normalizados."""
    sizes = sc["translations"]["sizes"]
    crusts = sc["translations"]["crusts"]
    crust_order = sorted(sc["select"]["crusts"], key=lambda c: sc["select"]["crusts"][c])
    products, assignments = [], []
    seen = set()

    for item in prices:
        m = item["menuable"]
        name = m["name"].strip()
        if name in SKIP:
            continue
        cat = m["category"]
        variants = item.get("variants") or []
        pics = m.get("pictures") or []
        image = fetch_image(pics[0]["url"]) if pics else None

        if item["menuable_type"] == "Pizza":
            pid = "pz-" + (m.get("seo_url") or slug(name))
            if name.startswith("Pan Pizza"):
                category = "pan-pizza"
            elif name.startswith("Croissant"):
                category = "pizzas-croissant"
            else:
                category = "pizzas-clasicas"
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
        else:
            pid = "cp-" + slug(name)
            category = COMPLEMENT_CATEGORY[cat]
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
            "top_seller": bool(item.get("top_seller")),
            "position": item.get("position") or 0,
        })
        assignments.append((pid, category))
    return products, assignments


def images_xml(image, indent):
    if not image:
        return ""
    pad = " " * indent
    groups = "".join(
        f'{pad}    <image-group view-type="{vt}">\n{pad}        <image path="images/{image}"/>\n{pad}    </image-group>\n'
        for vt in ("large", "medium", "small")
    )
    return f"{pad}<images>\n{groups}{pad}</images>\n"


def master_catalog(products):
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
        out.append(f'    <product product-id="{p["id"]}">')
        out.append(f'        <display-name xml:lang="x-default">{x(p["name"])}</display-name>')
        if p["short"]:
            out.append(f'        <short-description xml:lang="x-default">{x(p["short"])}</short-description>')
        if p["long"]:
            out.append(f'        <long-description xml:lang="x-default">{x(p["long"])}</long-description>')
        out.append("        <online-flag>true</online-flag>")
        out.append("        <available-flag>true</available-flag>")
        out.append("        <searchable-flag>true</searchable-flag>")
        img = images_xml(p["image"], 8)
        if img:
            out.append(img.rstrip("\n"))
        out.append("        <tax-class-id>standard</tax-class-id>")
        out.append("        <brand>Papa Johns</brand>")
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
            for i, v in enumerate(p["variants"]):
                default = ' default="true"' if i == 0 else ""
                out.append(f'                <variant product-id="{v["id"]}"{default}/>')
            out.append("            </variants>")
            out.append("        </variations>")
        out.append("    </product>")

        for v in p["variants"]:
            labels = {a: dict(vals) for a, _, vals in p["vattrs"]}
            suffix = " ".join(labels[a][val] for a, val in v["attrs"].items())
            out.append(f'    <product product-id="{v["id"]}">')
            out.append(f'        <display-name xml:lang="x-default">{x(p["name"] + " " + suffix)}</display-name>')
            out.append("        <online-flag>true</online-flag>")
            out.append("        <available-flag>true</available-flag>")
            out.append("        <searchable-flag>true</searchable-flag>")
            out.append("        <tax-class-id>standard</tax-class-id>")
            out.append("        <brand>Papa Johns</brand>")
            out.append("        <custom-attributes>")
            for a, val in v["attrs"].items():
                out.append(f'            <custom-attribute attribute-id="{a}">{x(val)}</custom-attribute>')
            out.append("        </custom-attributes>")
            out.append("    </product>")

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
        "        </refinement-definitions>",
        "    </category>",
    ]
    for pos, (cid, name, parent, desc) in enumerate(CATEGORIES, start=1):
        out += [
            f'    <category category-id="{cid}">',
            f'        <display-name xml:lang="x-default">{x(name)}</display-name>',
            f'        <description xml:lang="x-default">{x(desc)}</description>',
            "        <online-flag>true</online-flag>",
            f"        <parent>{parent}</parent>",
            f"        <position>{pos}.0</position>",
            *([f"        <image>images/{fetch_image(CATEGORY_IMAGES[cid])}</image>"] if cid in CATEGORY_IMAGES else []),
            "        <custom-attributes>",
            '            <custom-attribute attribute-id="showInMenu">true</custom-attribute>',
            "        </custom-attributes>",
            "    </category>",
        ]
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


def inventory(products):
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<inventory xmlns="http://www.demandware.com/xml/impex/inventory/2007-05-31">',
        "    <inventory-list>",
        f'        <header list-id="{INVENTORY}">',
        "            <default-instock>true</default-instock>",
        "            <description>Inventario Papa Johns Chile (perpetuo)</description>",
        "            <use-bundle-inventory-only>false</use-bundle-inventory-only>",
        "            <on-order>false</on-order>",
        "        </header>",
        "        <records>",
    ]
    for p in products:
        for pid in ([v["id"] for v in p["variants"]] or [p["id"]]):
            out += [
                f'            <record product-id="{pid}">',
                "                <allocation>1000</allocation>",
                "                <perpetual>true</perpetual>",
                "            </record>",
            ]
    out += ["        </records>", "    </inventory-list>", "</inventory>"]
    return "\n".join(out) + "\n"


def stores_xml(stores):
    out = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<stores xmlns="http://www.demandware.com/xml/impex/store/2007-04-30">',
    ]
    for s in stores:
        out += [
            f'    <store store-id="pj-{s["id"]}">',
            f'        <name>Papa Johns {x(s["name"].rstrip("."))}</name>',
            f'        <address1>{x(s["text_address"])}</address1>',
            f'        <city>{x(s.get("commune") or s.get("region"))}</city>',
            "        <country-code>CL</country-code>",
            f'        <phone>{x(s.get("phone"))}</phone>',
            f'        <latitude>{s["latitude"]}</latitude>',
            f'        <longitude>{s["longitude"]}</longitude>',
            "        <store-locator-enabled-flag>true</store-locator-enabled-flag>",
            "    </store>",
        ]
    out.append("</stores>")
    return "\n".join(out) + "\n"


def meta_xml():
    def attr(aid, label):
        return f"""            <attribute-definition attribute-id="{aid}">
                <display-name xml:lang="x-default">{label}</display-name>
                <type>string</type>
                <localizable-flag>false</localizable-flag>
                <site-specific-flag>false</site-specific-flag>
                <mandatory-flag>false</mandatory-flag>
                <visible-flag>false</visible-flag>
                <externally-managed-flag>false</externally-managed-flag>
                <order-required-flag>false</order-required-flag>
                <externally-defined-flag>false</externally-defined-flag>
                <min-length>0</min-length>
            </attribute-definition>"""

    attrs = [("pjSize", "Tamaño (Papa Johns)"), ("pjCrust", "Masa (Papa Johns)"), ("pjOption", "Opción (Papa Johns)")]
    defs = "\n".join(attr(a, l) for a, l in attrs)
    refs = "\n".join(f'                <attribute attribute-id="{a}"/>' for a, _ in attrs)
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<metadata xmlns="http://www.demandware.com/xml/impex/metadata/2006-10-31">
    <type-extension type-id="Product">
        <custom-attribute-definitions>
{defs}
        </custom-attribute-definitions>
        <group-definitions>
            <attribute-group group-id="papajohns">
                <display-name xml:lang="x-default">Papa Johns</display-name>
{refs}
            </attribute-group>
        </group-definitions>
    </type-extension>
</metadata>
"""


def site_xml():
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<site xmlns="http://www.demandware.com/xml/impex/site/2007-04-30" site-id="{SITE_ID}">
    <name>Papa Johns Chile</name>
    <currency>{CURRENCY}</currency>
    <taxation>gross</taxation>
    <custom-cartridges>app_storefrontnext_base:app_storefront_base</custom-cartridges>
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
        "SiteLocales": f"default:{LOCALE}",
        "SitePriceBooks": PRICEBOOK,
        "SiteTimezone": "America/Santiago",
        "StorefrontURLsEnabled": "true",
        "OrderLifetime": "0",
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
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<shipping xmlns="http://www.demandware.com/xml/impex/shipping/2007-03-31">
    <shipping-method method-id="001" default="true">
        <display-name xml:lang="x-default">Despacho a domicilio</display-name>
        <description xml:lang="x-default">Llega en 30 a 45 minutos</description>
        <online-flag>true</online-flag>
        <tax-class-id>standard</tax-class-id>
        <price-table>
            <amount order-value="0">1990</amount>
        </price-table>
        <custom-attributes>
            <custom-attribute attribute-id="estimatedArrivalTime">30-45 min</custom-attribute>
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
    prices, sc, stores = load()
    products, assignments = build_products(prices, sc)

    if OUT.exists():
        shutil.rmtree(OUT)
    write(OUT / "version.txt", "PapaJohnsCL site archive\n")
    write(OUT / "meta" / "system-objecttype-extensions.xml", meta_xml())
    write(OUT / "locales.xml", locales_xml(ROOT / "reference" / "locales.xml"))
    write(OUT / "catalogs" / MASTER / "catalog.xml", master_catalog(products))
    write(OUT / "catalogs" / STOREFRONT / "catalog.xml", storefront_catalog(assignments))
    write(OUT / "pricebooks" / f"{PRICEBOOK}.xml", pricebook(products))
    write(OUT / "inventory-lists" / f"{INVENTORY}.xml", inventory(products))
    write(OUT / "jobs.xml", jobs_xml())
    write(OUT / "customer-lists" / f"{SITE_ID}.xml", customer_list_xml())
    site = OUT / "sites" / SITE_ID
    write(site / "site.xml", site_xml())
    write(site / "preferences.xml", site_preferences())
    write(site / "shipping.xml", shipping_xml())
    write(site / "tax.xml", tax_xml())
    write(site / "stores.xml", stores_xml(stores))
    for name in ("payment-methods.xml", "payment-processors.xml"):
        shutil.copy(ROOT / "reference" / name, site / name)

    category_static = OUT / "catalogs" / STOREFRONT / "static" / "default" / "images"
    category_static.mkdir(parents=True, exist_ok=True)
    for url in CATEGORY_IMAGES.values():
        name = fetch_image(url)
        shutil.copy(CACHE / name, category_static / name)

    static = OUT / "catalogs" / MASTER / "static" / "default" / "images"
    static.mkdir(parents=True, exist_ok=True)
    for p in products:
        if p["image"]:
            shutil.copy(CACHE / p["image"], static / p["image"])

    images = promo_images()
    library = OUT / "libraries" / LIBRARY
    write(library / "library.xml", library_xml(images))
    library_static = library / "static" / "default" / "images"
    library_static.mkdir(parents=True, exist_ok=True)
    used = {o for o, *_ in HERO_SLIDES} | {c[1] for c in MEGA_MENU_CARDS}
    for offer in used:
        shutil.copy(CACHE / images[offer], library_static / images[offer])

    nvar = sum(len(p["variants"]) for p in products)
    print(f"Productos: {len(products)} maestros/simples, {nvar} variantes, {len(stores)} tiendas -> {OUT}")


if __name__ == "__main__":
    main()
