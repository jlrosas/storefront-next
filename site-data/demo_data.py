"""Datos editoriales de la demo (contrato §4.1, diseño 02, lienzo y R4.4).

Lo que no viene de la API de papajohns.cl vive aquí: grupos de pizza, textos sensoriales, insignias,
reseñas de ejemplo, ingredientes base, combos y atributos de las tiendas de la demo.
"""

# ---------- Pizzas: grupos (diseño 02, «Cómo se agrupan las 24 pizzas») ----------
PIZZA_GROUPS = {
    "pizzas-clasicas": ["napolitana", "napolitana-cherry", "napolitana-caprese", "hawaiana", "boom-de-jamon"],
    "pizzas-favoritas": ["pollo-bbq", "super-pepperoni", "vegetariana", "la-cordillerana", "pollo-caprese",
                         "canadian-bacon"],
    "pizzas-premium": ["todas-las-carnes", "italiana", "espinacas-a-la-crema", "meat-and-great", "the-works"],
}

# Productos constructores (c_pjKind = builder), asignados a la categoría «pizzas».
BUILDERS = {"arma-tu-pizza"}

# ---------- Texto que se saborea (c_pjSensory) ----------
# Las seis primeras son las del lienzo (Home, Combo, PDP). El resto es propuesta editorial.
SENSORY = {
    "pz-pollo-bbq": "Pollo jugoso y tocino crujiente sobre salsa BBQ ahumada.",
    "pz-super-pepperoni": "Doble pepperoni que se dora en los bordes y extra queso.",
    "pz-todas-las-carnes": "Pepperoni, jamón, tocino y salchicha italiana en cada porción.",
    "pz-boom-de-jamon": "Doble jamón y mozzarella que se estira.",
    "pz-napolitana-caprese": "Tomate cherry, mozzarella y pesto.",
    "pz-hawaiana": "Piña dulce, jamón y extra queso.",
    "pz-napolitana": "Tomate fresco, orégano y mozzarella que se funde.",
    "pz-napolitana-cherry": "Tomates cherry que revientan en el horno, con orégano y mozzarella.",
    "pz-vegetariana": "Champiñón, pimiento, aceitunas y tomate sobre mozzarella dorada.",
    "pz-la-cordillerana": "Chorizo y carne con pimentón y cebolla, sabor de parrilla.",
    "pz-pollo-caprese": "Pollo tierno, tomate cherry y un shot de pesto fresco.",
    "pz-canadian-bacon": "Lomito canadiense y tocino bajo una capa de parmesano y romano.",
    "pz-italiana": "Pepperoni y salchicha italiana con aceitunas, champiñón y orégano.",
    "pz-espinacas-a-la-crema": "Salsa alfredo cremosa con jamón, tocino, tomate y champiñón.",
    "pz-meat-and-great": "Carne, jamón, tocino, salchicha y pepperoni con un toque de BBQ.",
    "pz-the-works": "Todo lo bueno: pepperoni, salchicha, jamón y verduras frescas.",
    "pz-pan-pizza-pepperoni": "Masa alta y esponjosa con pepperoni y queso hasta el borde.",
    "pz-pan-pizza-the-works": "Masa alta al sartén cargada de carnes y verduras.",
    "pz-pan-pizza-boom-de-jamon": "Masa esponjosa al sartén con doble jamón y queso de borde a borde.",
    "pz-pan-pizza-napolitana": "Masa alta con tomate, orégano y mozzarella dorada.",
    "pz-croissant-de-pepperoni": "Borde croissant crujiente y hojaldrado con pepperoni.",
    "pz-croissant-de-aceituna": "Borde croissant hojaldrado con aceitunas y mozzarella.",
    "pz-croissant-de-choclo": "Borde croissant crujiente con choclo dulce y mozzarella.",
    "pz-croissant-de-pimenton": "Borde croissant hojaldrado con pimentón asado y mozzarella.",
    "pz-arma-tu-pizza": "Tu masa, tu salsa y hasta 10 ingredientes a tu gusto.",
    "pz-mitades": "Dos sabores en una pizza: pagas el promedio de las dos mitades.",
    "cp-palitos-de-ajo": "Recién horneados, con mantequilla de ajo y parmesano.",
    "cp-cheesyquenos": "Mozzarella fundida en masa de pizza.",
    "cp-chicken-poppers": "12 trozos de pechuga apanada, dorados y crujientes.",
    "cp-cookie": "Tibio, con chips de chocolate.",
    "cp-brownie": "Brownie húmedo de chocolate, para cerrar con algo dulce.",
}

# ---------- Insignias (c_pjBadges) y tipo de comida (c_pjFoodType) ----------
# Insignias del lienzo: «Más vendida/Más pedida» (Menu, Home) e «Ideal para 2» (Home).
# «novedad» queda definida pero ningún producto del lienzo la usa.
BADGES = {
    "pz-pollo-bbq": ["mas-pedida"],
    "pz-super-pepperoni": ["mas-pedida", "ideal-para-2"],
    "pz-todas-las-carnes": ["mas-pedida"],
    "pz-boom-de-jamon": ["mas-pedida"],
}
# Del campo food_type de la API (vegetarian / spicy), que coincide con los filtros del lienzo.
FOOD_TYPE_MAP = {"vegetarian": "vegetariana", "spicy": "picante"}

# ---------- Popularidad y reseñas (R4.4) ----------
REVIEWS = {
    # producto: (estrellas, opiniones, pedidas esta semana)
    "pz-pollo-bbq": (4.7, 1240, 320),
    "pz-todas-las-carnes": (4.6, 980, 260),
    "pz-super-pepperoni": (4.8, 2110, 410),
    "pz-boom-de-jamon": (4.5, 640, 180),
    "pz-napolitana": (4.4, 510, 150),
    "pz-hawaiana": (4.3, 720, 140),
}
# El resto: 4,2–4,5 estrellas, 100–400 opiniones, < 100 pedidas (no se muestra). Se derivan del ID para
# que sean estables entre reconstrucciones.

# ---------- Canje con puntos (c_pjRedeemPoints) ----------
REDEEM_POINTS = {"pz-super-pepperoni": 260, "pz-boom-de-jamon": 218, "pz-napolitana-caprese": 218}

# ---------- Para cuántos (c_pjServes, en la variante) ----------
SERVES = {"individual": "Para 1", "medium": "Para 2–3", "family": "Para 3–4", "extra_large": "Para 4–5"}

# ---------- Ingredientes base de cada especialidad (c_pjBaseIngredients) ----------
# IDs de ingrediente = slug del nombre en ingredients.json. Salen de la descripción de cada pizza.
BASE_INGREDIENTS = {
    "pz-todas-las-carnes": ["mozzarella-base", "pepperoni", "jamon", "tocino", "salchicha-italiana"],
    "pz-pollo-bbq": ["mozzarella-base", "pollo", "tocino", "cebolla", "salsa-bbq"],
    "pz-italiana": ["mozzarella-base", "pepperoni", "salchicha-italiana", "aceitunas-negras", "champinon"],
    "pz-super-pepperoni": ["extra-mozzarella", "pepperoni"],
    "pz-boom-de-jamon": ["mozzarella-base", "jamon"],
    "pz-la-cordillerana": ["chorizo", "carne", "cebolla"],
    "pz-napolitana-caprese": ["mozzarella-base", "tomate-cherry", "shot-de-pesto"],
    "pz-pollo-caprese": ["salsa-tomate", "pollo", "tomate-cherry", "shot-de-pesto", "mozzarella-base"],
    "pz-napolitana-cherry": ["mozzarella-base", "tomate-cherry"],
    "pz-the-works": ["mozzarella-base", "salchicha-italiana", "pepperoni", "jamon", "cebolla", "pimiento-verde",
                     "aceitunas-negras", "champinon"],
    "pz-espinacas-a-la-crema": ["mozzarella-base", "salsa-alfredo", "jamon", "tocino", "tomate", "champinon"],
    "pz-vegetariana": ["mozzarella-base", "cebolla", "pimiento-verde", "tomate", "aceitunas-negras", "champinon"],
    "pz-canadian-bacon": ["mozzarella-base", "lomito-canadiense", "tocino", "parmesano-y-romano"],
    "pz-napolitana": ["mozzarella-base", "tomate"],
    "pz-hawaiana": ["pina", "jamon", "extra-mozzarella"],
    "pz-meat-and-great": ["carne", "jamon", "tocino", "salchicha-italiana", "pepperoni", "shot-de-bbq"],
}

# Precio de un ingrediente extra por tamaño (contrato §4.1 = ingredient_prices.normal de la API).
EXTRA_PRICE = {"medium": 1450, "family": 1940, "extra_large": 2290}

# ---------- Combos (contrato §4.1, API de papajohns.cl del 06-nov) ----------
# Pizzas elegibles en los constructores (las del lienzo Combo.dc.html) y lo que trae cada combo.
COMBO_PIZZAS = ["pz-pollo-bbq", "pz-super-pepperoni", "pz-todas-las-carnes", "pz-boom-de-jamon",
                "pz-napolitana-caprese", "pz-hawaiana"]
ALL_SPECIALTIES = [f"pz-{s}" for g in PIZZA_GROUPS.values() for s in g]


def pizza_slot(n, total, size, choices, default=None, label=None):
    return {
        "id": f"pizza{n}", "kind": "pizza", "label": label or (f"Pizza {n} de {total}" if total > 1 else "Tu pizza"),
        "size": size, "choices": choices, "default": default or choices[0],
    }


COMBOS = [
    {
        "id": "cb-super-duo", "offer_id": 82, "name": "Super Dúo", "price": 22590, "before": 27800,
        "short": "Dos pizzas familiares a elección.",
        "sensory": "Elige tus dos favoritas, recién salidas del horno.",
        "valid_to": "2055-05-05T00:00:00.000Z", "dispatch": "both", "occasion": ["para-4"],
        "slots": [pizza_slot(1, 2, "family", COMBO_PIZZAS, "pz-pollo-bbq"),
                  pizza_slot(2, 2, "family", COMBO_PIZZAS, "pz-super-pepperoni")],
        "serves": "Para 4",
    },
    {
        "id": "cb-super-trio", "offer_id": 740, "name": "Super Trío", "price": 33900, "before": 41700,
        "short": "Tres pizzas familiares a elección.",
        "sensory": "Tres familiares a elección para todo el grupo.",
        "valid_to": "2030-12-31T10:15:00.000Z", "dispatch": "both", "occasion": ["para-6"],
        "slots": [pizza_slot(1, 3, "family", COMBO_PIZZAS, "pz-pollo-bbq"),
                  pizza_slot(2, 3, "family", COMBO_PIZZAS, "pz-super-pepperoni"),
                  pizza_slot(3, 3, "family", COMBO_PIZZAS, "pz-todas-las-carnes")],
        "serves": "Para 6 o más",
    },
    {
        "id": "cb-papa-combo-palitos", "offer_id": 791, "name": "Papa Combo Palitos", "price": 16490, "before": 17880,
        "short": "Pizza, palitos de ajo y bebida 1,5 L.",
        "sensory": "Pizza familiar, palitos de ajo recién horneados y bebida helada.",
        "valid_to": "2119-12-14T23:45:00.000Z", "dispatch": "both", "occasion": ["para-2"],
        "slots": [pizza_slot(1, 1, "family", ALL_SPECIALTIES, "pz-pollo-bbq"),
                  {"id": "side", "kind": "side", "label": "Acompañamiento", "choices": ["cp-palitos-de-ajo"],
                   "default": "cp-palitos-de-ajo"},
                  {"id": "drink", "kind": "drink", "label": "Bebida 1,5 L", "choices": "drink-1500",
                   "default": "cp-coca-cola-sin-azucar"}],
        "serves": "Para 2",
    },
    {
        "id": "cb-papa-flash", "offer_id": 754, "name": "Papa Flash", "price": 5490, "before": 9030,
        "short": "Pizza individual, mini palitos y bebida.",
        "sensory": "Tu almuerzo en 15 minutos: pizza individual, mini palitos y bebida.",
        "valid_to": "2027-01-03T19:00:00.000Z", "dispatch": "both", "occasion": ["para-1"],
        "slots": [pizza_slot(1, 1, "individual",
                             ["pz-pollo-bbq", "pz-super-pepperoni", "pz-todas-las-carnes", "pz-boom-de-jamon",
                              "pz-italiana", "pz-vegetariana", "pz-napolitana"], "pz-super-pepperoni"),
                  {"id": "side", "kind": "side", "label": "Mini palitos", "choices": ["cp-mini-palitos-de-ajo-y-queso"],
                   "default": "cp-mini-palitos-de-ajo-y-queso"},
                  {"id": "drink", "kind": "drink", "label": "Bebida", "choices": ["cp-coca-cola-sin-azucar-220ml"],
                   "default": "cp-coca-cola-sin-azucar-220ml"}],
        "serves": "Para 1",
    },
    {
        "id": "cb-papa-combo-postre", "offer_id": 271, "name": "Papa Combo con Postre", "price": 17490, "before": None,
        "short": "Pizza, bebida 1,5 L y postre.",
        "sensory": "El trío perfecto: pizza, bebida y un postre horneado.",
        "valid_to": "2049-05-02T23:45:00.000Z", "dispatch": "both", "occasion": ["para-2", "para-3"],
        "slots": [pizza_slot(1, 1, "family", ALL_SPECIALTIES, "pz-pollo-bbq"),
                  {"id": "drink", "kind": "drink", "label": "Bebida 1,5 L", "choices": "drink-1500",
                   "default": "cp-coca-cola"},
                  {"id": "dessert", "kind": "dessert", "label": "Postre",
                   "choices": ["cp-cookie", "cp-brownie", "cp-cinnapie", "cp-palitos-de-canela"],
                   "default": "cp-cookie"}],
        "serves": "Para 2–3",
    },
    {
        "id": "cb-pizza-del-mes", "offer_id": 512, "name": "Pizza del Mes The Works Familiar", "price": 10990,
        "before": 21900, "before_label": "Antes desde $21.900",
        "short": "The Works Familiar a precio de pizza del mes.",
        "sensory": "Todo lo bueno: pepperoni, salchicha, jamón y verduras frescas.",
        "valid_to": "2026-12-07T00:00:00.000Z", "dispatch": "both", "occasion": ["para-3", "para-4"],
        "slots": [pizza_slot(1, 1, "family", ["pz-the-works"], "pz-the-works", label="The Works Familiar")],
        "serves": "Para 3–4",
    },
    {
        "id": "cb-box-halloween", "offer_id": 798, "name": "Box Halloween de Miedo", "price": 19990, "before": 23880,
        "short": "Pizza mediana, Coca-Cola 1,5 L y box Dulce y Truco.",
        "sensory": "Pizza mediana, bebida y la box Dulce y Truco con Boom de Trencito y Cheesyqueños.",
        "valid_from": "2026-10-07T00:00:00.000Z",
        "valid_to": "2026-11-02T14:10:00.000Z", "dispatch": "both", "occasion": ["para-2"],
        "slots": [pizza_slot(1, 1, "medium",
                             ["pz-super-pepperoni", "pz-boom-de-jamon", "pz-napolitana", "pz-the-works"],
                             "pz-super-pepperoni", label="Pizza mediana"),
                  {"id": "drink", "kind": "drink", "label": "Coca-Cola 1,5 L", "choices": ["cp-coca-cola"],
                   "default": "cp-coca-cola"},
                  {"id": "box", "kind": "side", "label": "Box Dulce y Truco", "choices": ["cp-dulce-y-truco"],
                   "default": "cp-dulce-y-truco"}],
        "serves": "Para 2",
    },
]

# ---------- Tiendas de la demo (contrato §4.3) ----------
# store-id: atributos. El resto de las tiendas usa los tiempos de la API y abre 11:00–23:30.
DEMO_STORES = {
    "pj-48": {"label": "El Bosque", "pickup": 15, "delivery": 30, "open_until": "23:30", "opens_at": "11:00",
              "cash": True, "closed": False},
    "pj-9": {"label": "Salvador", "pickup": 35, "delivery": 40, "open_until": "23:00", "opens_at": "11:00",
             "cash": True, "closed": False},
    "pj-2": {"label": "Providencia", "pickup": 15, "delivery": 30, "open_until": "23:30", "opens_at": "12:00",
             "cash": True, "closed": True},
}
