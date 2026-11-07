#!/usr/bin/env python3
"""Verifica con llamadas reales (SCAPI y OCAPI Data) los criterios de DAT-02 a DAT-07 y DAT-11.

Uso:  python3 site-data/ocapi/verify.py [dat02 dat03 dat04 dat05 dat06 dat07 dat11]
Imprime OK/FALLA por criterio. DAT-04 crea un pedido de invitado (no toca a los clientes de demo).
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pj  # noqa: E402

PRODUCTS = "/product/shopper-products/v1/organizations/{org}/products"
SEARCH = "/search/shopper-search/v1/organizations/{org}/product-search"
BASKETS = "/checkout/shopper-baskets/v1/organizations/{org}/baskets"
ORDERS = "/checkout/shopper-orders/v1/organizations/{org}/orders"
STORES = "/store/shopper-stores/v1/organizations/{org}/stores"

results = []


def check(name, ok, detail=""):
    results.append((name, ok))
    print(f"{'OK   ' if ok else 'FALLA'} {name}" + (f" — {detail}" if detail else ""))


class Shopper:
    """Token de invitado que se renueva y un carrito nuevo por prueba (borra los anteriores)."""

    def __init__(self):
        self.tok = pj.slas_guest()["access_token"]
        self.basket = None

    def new_basket(self):
        if self.basket:
            try:
                pj.shop("DELETE", BASKETS + f"/{self.basket}", self.tok)
            except pj.ApiError:
                pass
        self.basket = pj.shop("POST", BASKETS, self.tok, {})["basketId"]
        return self.basket

    def add(self, items):
        return pj.shop("POST", BASKETS + f"/{self.basket}/items", self.tok, items)


def dat02(s):
    attrs = ["c_pjKind", "c_pjBadges", "c_pjSensory", "c_pjWeeklyOrders", "c_pjRating", "c_pjReviewCount",
             "c_pjBaseIngredients", "c_pjHalvesEnabled"]
    p = pj.shop("GET", PRODUCTS + "/pz-super-pepperoni", s.tok, params={"expand": "images,variations"})
    missing = [a for a in attrs + ["c_pjRedeemPoints"] if a not in p]
    check("DAT-02.1 atributos en el producto (Super Pepperoni)", not missing, f"faltan {missing}" if missing else
          f"badges={p['c_pjBadges']} rating={p['c_pjRating']} canje={p['c_pjRedeemPoints']}")
    v = pj.shop("GET", PRODUCTS + "/pz-pollo-bbq-medium-traditional", s.tok)
    check("DAT-02.1 c_pjServes en la variante", v.get("c_pjServes") == "Para 2–3", v.get("c_pjServes"))
    veg = pj.shop("GET", PRODUCTS + "/pz-napolitana", s.tok).get("c_pjFoodType")
    check("DAT-02.1 c_pjFoodType", veg == ["vegetariana"], str(veg))
    groups = {"pizzas-clasicas": 5, "pizzas-favoritas": 6, "pizzas-premium": 5, "pan-pizza": 4, "pizzas-croissant": 4}
    for cg, n in groups.items():
        r = pj.shop("GET", SEARCH, s.tok, params={"refine": f"cgid={cg}", "limit": 50})
        check(f"DAT-02.2 {cg} tiene {n}", r["total"] == n, ", ".join(h["productId"] for h in r["hits"]))
    img = p["imageGroups"][0]["images"][0]["link"]
    check("DAT-02.3 foto grande del CDN (super_pepperoni_familiar 1440×1080)", "super-pepperoni-familiar" in img, img)
    bbq = pj.shop("GET", PRODUCTS + "/pz-pollo-bbq", s.tok)
    check("DAT-02.4 texto sensorial del lienzo", bbq.get("c_pjSensory") ==
          "Pollo jugoso y tocino crujiente sobre salsa BBQ ahumada.", bbq.get("c_pjSensory"))
    r = pj.shop("GET", SEARCH, s.tok, params={"q": "pollo bbq", "refine": "cgid=pizzas-favoritas", "limit": 1,
                                             "expand": "custom_properties,represented_products,variations,prices"})
    rp = r["hits"][0].get("representedProduct") or {}
    got = [a for a in attrs if a in rp]
    check("DAT-02.5 Shopper Search devuelve los atributos (representedProduct)", len(got) == len(attrs),
          f"{r['hits'][0]['productId']}: {got}")
    refs = {x["attributeId"] for x in r.get("refinements", [])}
    check("DAT-02.5 refinamientos c_pjBadges y c_pjFoodType", {"c_pjBadges", "c_pjFoodType"} <= refs, str(refs))


def dat03(s):
    # Ojo: SCAPI cachea por combinación de parámetros; esta combinación se usa solo aquí.
    p = pj.shop("GET", PRODUCTS + "/pz-pollo-bbq-family-traditional", s.tok,
                params={"expand": "options,prices,availability"})
    opts = [o for o in p.get("options", []) if o["id"].startswith("pjExtras_")]
    check("DAT-03.1 31 ingredientes como opciones pjExtras_*", len(opts) == 31, f"{len(opts)} opciones")
    ing = pj.shop("GET", PRODUCTS + "/ing-shot-de-pesto", s.tok, params={"expand": "images"})
    check("DAT-03.1 foto y marca unavailable_for_halves (ing-shot-de-pesto)",
          bool(ing.get("imageGroups")) and ing.get("c_pjUnavailableForHalves") is True)
    s.new_basket()
    r = s.add([{"productId": "pz-pollo-bbq-family-traditional", "quantity": 1,
                "optionItems": [{"optionId": "pjExtras_champinon", "optionValueId": "si"}]}])
    check("DAT-03.2 Pollo BBQ Familiar + champiñón = $16.900 + $1.940", r["productSubTotal"] == 18840,
          f"productSubTotal={r['productSubTotal']}")
    s.new_basket()
    r = s.add([{"productId": "pz-pollo-bbq-medium-traditional", "quantity": 1,
                "optionItems": [{"optionId": "pjExtras_champinon", "optionValueId": "si"}]}])
    check("DAT-03.1 extra en Mediana cobra $1.450 (hook)", r["productSubTotal"] == 13000 + 1450,
          f"productSubTotal={r['productSubTotal']}")
    inv = pj.shop("GET", PRODUCTS + "/ing-champinon", s.tok, params={"inventoryIds": "inventory_pj_48,inventory_pj_9"})
    by = {i["id"]: i["orderable"] for i in inv.get("inventories", [])}
    check("DAT-03.3 champiñón agotado en El Bosque y disponible en Salvador",
          by.get("inventory_pj_48") is False and by.get("inventory_pj_9") is True, str(by))


def dat04(s):
    halves = json.dumps([{"part": 1, "product": "pz-pollo-bbq"}, {"part": 2, "product": "pz-todas-las-carnes"}])
    s.new_basket()
    r = s.add([{"productId": "pz-mitades-family-traditional", "quantity": 1, "c_pjHalves": halves, "c_pjParts": 2}])
    item = r["productItems"][0]
    check("DAT-04.1 pz-mitades con tamaño y masa", item["productId"] == "pz-mitades-family-traditional")
    check("DAT-04.2 Pollo BBQ + Todas las Carnes Familiar = $17.900", item["basePrice"] == 17900,
          f"basePrice={item['basePrice']}")
    r = pj.shop("PATCH", BASKETS + f"/{s.basket}/items/{item['itemId']}", s.tok, {"quantity": 2})
    item = r["productItems"][0]
    check("DAT-04.3 al cambiar la cantidad (2) = $35.800", item["price"] == 35800, f"price={item['price']}")
    # Pedido final (invitado, retiro en El Bosque).
    addr = {"firstName": "Prueba", "lastName": "DAT", "address1": "Tobalaba 201", "city": "Las Condes",
            "countryCode": "CL", "phone": "+56900000000"}
    pj.shop("PUT", BASKETS + f"/{s.basket}/customer", s.tok, {"email": "verificacion@demo.pj.cl"})
    pj.shop("PUT", BASKETS + f"/{s.basket}/shipments/me/shipping-method", s.tok, {"id": "005"})
    pj.shop("PUT", BASKETS + f"/{s.basket}/shipments/me/shipping-address", s.tok, addr)
    b = pj.shop("PUT", BASKETS + f"/{s.basket}/billing-address", s.tok, addr)
    pj.shop("POST", BASKETS + f"/{s.basket}/payment-instruments", s.tok, {
        "paymentMethodId": "CREDIT_CARD", "amount": b["orderTotal"],
        "paymentCard": {"maskedNumber": "************1111", "cardType": "Visa", "expirationMonth": 1,
                        "expirationYear": 2030, "holder": "Prueba DAT"}})
    order = pj.shop("POST", ORDERS, s.tok, {"basketId": s.basket})
    s.basket = None
    oi = order["productItems"][0]
    check("DAT-04.3 en el pedido final se mantiene", oi["basePrice"] == 17900,
          f"pedido {order['orderNo']} basePrice={oi['basePrice']} status={order['status']}")
    s.new_basket()
    bad = json.dumps([{"part": 1, "product": "pz-pollo-bbq"}, {"part": 2, "product": "pz-pan-pizza-pepperoni"}])
    try:
        s.add([{"productId": "pz-mitades-family-traditional", "quantity": 1, "c_pjHalves": bad}])
        check("DAT-04.4 Pan Pizza rechazada como mitad", False, "se aceptó")
    except pj.ApiError as e:
        check("DAT-04.4 Pan Pizza rechazada como mitad", e.status == 400, e.body[:160])


def dat05(s):
    ids = ["cb-super-duo", "cb-super-trio", "cb-papa-combo-palitos", "cb-papa-flash", "cb-papa-combo-postre",
           "cb-pizza-del-mes", "cb-box-halloween"]
    r = pj.shop("GET", PRODUCTS, s.tok, params={"ids": ",".join(ids)})
    by = {p["id"]: p for p in r["data"]}
    need = ["c_pjSlots", "c_pjValidTo", "c_pjDispatch", "c_pjOccasion"]
    for pid in ids:
        p = by.get(pid, {})
        ok = pid in by and all(k in p for k in need)
        check(f"DAT-05.1 {pid}", ok, f"${p.get('price')} antes {p.get('c_pjPriceBefore')} hasta "
                                     f"{p.get('c_pjValidTo', '')[:10]} {p.get('c_pjDispatch')} {p.get('c_pjOccasion')}")
    mes = by["cb-pizza-del-mes"]
    check("DAT-05.1 Pizza del Mes $10.990, antes $21.900, hasta el 7-dic",
          mes["price"] == 10990 and mes.get("c_pjPriceBefore") == 21900 and mes["c_pjValidTo"].startswith("2026-12-07"))
    check("DAT-05.1 Box Halloween vencido el 2-nov", by["cb-box-halloween"]["c_pjValidTo"].startswith("2026-11-02"))
    s.new_basket()
    a = [{"slot": "pizza1", "product": "pz-pollo-bbq-family-traditional"},
         {"slot": "pizza2", "product": "pz-super-pepperoni-family-traditional"}]
    b = [{"slot": "pizza1", "product": "pz-todas-las-carnes-family-traditional"},
         {"slot": "pizza2", "product": "pz-hawaiana-family-traditional"}]
    s.add([{"productId": "cb-super-duo", "quantity": 1, "c_pjComboChoices": json.dumps(a)}])
    r = s.add([{"productId": "cb-super-duo", "quantity": 1, "c_pjComboChoices": json.dumps(b)}])
    lines = [(i["price"], json.loads(i["c_pjComboChoices"])[0]["product"]) for i in r["productItems"]]
    check("DAT-05.2 elección en la línea y precio fijo", len(lines) == 2 and all(p == 22590 for p, _ in lines),
          str(lines))
    promo = pj.data("GET", "/sites/PapaJohnsCL/promotions/pj-super-duo-pickup")
    check("DAT-05.3 pj-super-duo-pickup existe apagada", promo.get("enabled") is False)
    check("DAT-05.3 Super Dúo para retiro y delivery", by["cb-super-duo"]["c_pjDispatch"] == "both")


def dat06(s):
    r = pj.shop("GET", STORES, s.tok, params={"ids": "pj-48,pj-9,pj-2"})
    by = {x["id"]: x for x in r["data"]}
    exp = {"pj-48": (False, 15, -33.419657), "pj-9": (False, 35, -33.44969), "pj-2": (True, 15, -33.428823)}
    for sid, (closed, mins, lat) in exp.items():
        x = by.get(sid, {})
        ok = x.get("c_pjClosed") is closed and x.get("c_pjPickupMinutes") == mins and abs(x.get("latitude", 0) - lat) < 1e-5
        check(f"DAT-06.1 {x.get('name')}", ok, f"cerrada={x.get('c_pjClosed')} {x.get('c_pjPickupMinutes')} min "
                                                f"abre {x.get('c_pjOpensAt')} hasta {x.get('c_pjOpenUntil')}")
    check("DAT-06.2 efectivo por tienda (c_pjCash)", all("c_pjCash" in x for x in by.values()))
    s.new_basket()
    s.add([{"productId": "cp-palitos-de-ajo", "quantity": 1}])
    m = pj.shop("GET", BASKETS + f"/{s.basket}/shipments/me/shipping-methods", s.tok)
    by_m = {x["id"]: x for x in m["applicableShippingMethods"]}
    check("DAT-06.3 retiro $0 y delivery $1.990", by_m.get("005", {}).get("price") == 0 and
          by_m.get("001", {}).get("price") == 1990, str({k: v.get("price") for k, v in by_m.items()}))
    check("DAT-06.3 delivery con mínimo $12.000 (c_pjMinOrder)", by_m.get("001", {}).get("c_pjMinOrder") == 12000)


def dat07(s):
    import customers as C
    for login in ["sofia@demo.pj.cl", "diego@demo.pj.cl", "valentina@demo.pj.cl"]:
        tok = pj.slas_login(login, C.DEMO_PASSWORD)
        t, cid = tok["access_token"], tok["customer_id"]
        me = pj.shop("GET", C.SHOPPER + f"/customers/{cid}", t)
        orders = pj.shop("GET", C.SHOPPER + f"/customers/{cid}/orders", t, params={"limit": 20})
        exp = C.CUSTOMERS[login]
        check(f"DAT-07.1 {login}", me.get("c_pjPoints") == exp["points"] and orders.get("total", 0) == len(exp["orders"]),
              f"{me.get('c_pjPoints')} pts, {orders.get('total')} pedidos, favoritas {me.get('c_pjFavorites')}")
        if login.startswith("sofia"):
            last = orders["data"][0]
            items = [(i["productId"], i.get("c_pjRemoved")) for i in last["productItems"]]
            check("DAT-07.2 último pedido = canónico ($23.890, 2-oct, sin cebolla)",
                  last["orderTotal"] == 23890 and last.get("c_pjPlacedAt", "").startswith("2026-10-02"), str(items))
            cards = [p["paymentCard"].get("numberLastDigits") for p in me.get("paymentInstruments", [])]
            addr = [(a["address1"], a.get("address2")) for a in me.get("addresses", [])]
            check("DAT-07.2 Visa ····4521 y depto 504", "4521" in cards and ("Av. Providencia 1234", "depto 504") in addr,
                  f"{cards} {addr}")
    for g in ["pj-frecuente", "pj-reactivacion", "pj-anuncio"]:
        x = pj.data("GET", f"/sites/PapaJohnsCL/customer_groups/{g}")
        check(f"DAT-07.3 grupo {g}", x.get("id") == g, x.get("type", ""))
    sc = pj.data("GET", "/sites/PapaJohnsCL/source_code_groups/pj-anuncio-super-duo")
    check("DAT-07.3 source code PJSD26", "PJSD26" in json.dumps(sc), str(sc.get("specifications") or sc)[:120])


# ---------- DAT-11: Super Dúo y Super Trío como pizzas reales (S-D20) + pedidos de CHK ----------

FAM = "pz-{}-family-{}"


def combo_line(pid, value, group, extras=(), **custom):
    """Línea de pizza del constructor: opción pjCombo y c_pjComboGroup (contrato §7, DAT-11)."""
    opts = [{"optionId": "pjCombo", "optionValueId": value}] if value else []
    opts += [{"optionId": f"pjExtras_{e}", "optionValueId": "si"} for e in extras]
    line = {"productId": pid, "quantity": 1, "optionItems": opts, **custom}
    if group:
        line["c_pjComboGroup"] = group
    return line


def promos_of(item):
    return [p.get("promotionId") for p in item.get("priceAdjustments", [])]


def dat11(s):
    # 1. Super Dúo: Pollo BBQ con «+ Pepperoni» + Super Pepperoni delgada, marcadas duo y con el mismo grupo.
    s.new_basket()
    r = s.add([combo_line(FAM.format("pollo-bbq", "traditional"), "duo", "duo-1", ["pepperoni"]),
               combo_line(FAM.format("super-pepperoni", "thin"), "duo", "duo-1")])
    lines = r["productItems"]
    check("DAT-11.1 Super Dúo + «+ Pepperoni» = $22.590 + $1.940", r["productTotal"] == 22590 + 1940,
          f"productTotal={r['productTotal']} líneas={[(i['productId'], i['priceAfterItemDiscount']) for i in lines]}")
    check("DAT-11.1 la promoción es pj-super-duo en las dos líneas",
          all(promos_of(i) == ["pj-super-duo"] for i in lines), str([promos_of(i) for i in lines]))
    ext = [o for i in lines for o in i.get("optionItems", [])
           if o["optionId"] == "pjExtras_pepperoni" and o["optionValueId"] == "si"]
    check("DAT-11.3 el extra no lo absorbe la promoción", len(ext) == 1 and ext[0]["priceAfterItemDiscount"] == 1940,
          str([(o["price"], o["priceAfterItemDiscount"]) for o in ext]))
    check("DAT-11.4 SCAPI escribe y devuelve c_pjComboGroup", all(i.get("c_pjComboGroup") == "duo-1" for i in lines))
    # Al quitar una pizza del grupo, la otra vuelve a su precio normal (sin cupones que limpiar).
    r = pj.shop("DELETE", BASKETS + f"/{s.basket}/items/{lines[1]['itemId']}", s.tok)
    check("DAT-11.2 quitar una pizza deshace el Dúo (precio normal)", r["productTotal"] == 16900 + 1940,
          f"productTotal={r['productTotal']}")

    # 2. Las mismas pizzas sin marcar = precio normal (no basta con tener dos familiares).
    s.new_basket()
    r = s.add([combo_line(FAM.format("pollo-bbq", "traditional"), None, None, ["pepperoni"]),
               combo_line(FAM.format("super-pepperoni", "thin"), None, None)])
    check("DAT-11.2 sin pjCombo valen su precio normal", r["productTotal"] == 16900 + 1940 + 16900,
          f"productTotal={r['productTotal']}")

    # 3. Dúo + una familiar suelta: la suelta no entra aunque sea más cara.
    s.new_basket()
    r = s.add([combo_line(FAM.format("hawaiana", "traditional"), "duo", "duo-1"),
               combo_line(FAM.format("boom-de-jamon", "traditional"), "duo", "duo-1"),
               combo_line(FAM.format("todas-las-carnes", "traditional"), None, None)])
    loose = [i for i in r["productItems"] if not i.get("c_pjComboGroup")][0]
    check("DAT-11.2 Dúo + familiar suelta: la suelta paga $18.900", r["productTotal"] == 22590 + 18900 and
          not promos_of(loose), f"productTotal={r['productTotal']}")

    # 4. Super Trío con un extra.
    s.new_basket()
    r = s.add([combo_line(FAM.format("pollo-bbq", "traditional"), "trio", "trio-1", ["champinon"]),
               combo_line(FAM.format("todas-las-carnes", "parmesan"), "trio", "trio-1"),
               combo_line(FAM.format("napolitana-caprese", "thin"), "trio", "trio-1")])
    check("DAT-11.1 Super Trío + «+ Champiñón» = $33.900 + $1.940", r["productTotal"] == 33900 + 1940 and
          all(promos_of(i) == ["pj-super-trio"] for i in r["productItems"]), f"productTotal={r['productTotal']}")

    # 5. Dos Dúos en la misma canasta, y un Dúo incompleto con masa con recargo (no entra).
    s.new_basket()
    r = s.add([combo_line(FAM.format(p, "traditional"), "duo", g) for p, g in
               [("pollo-bbq", "duo-1"), ("hawaiana", "duo-1"), ("super-pepperoni", "duo-2"), ("boom-de-jamon", "duo-2")]])
    check("DAT-11.2 dos Dúos = 2 × $22.590", r["productTotal"] == 2 * 22590, f"productTotal={r['productTotal']}")
    s.new_basket()
    r = s.add([combo_line(FAM.format("pollo-bbq", "stuffed"), "duo", "duo-1"),
               combo_line(FAM.format("hawaiana", "traditional"), "duo", "duo-1")])
    check("DAT-11.1 masa con recargo (rellena) no entra en el Dúo", r["productTotal"] == 20390 + 13900,
          f"productTotal={r['productTotal']}")

    # 6. No choca con «Hazlo combo»: Dúo + Palitos de Ajo + Coca-Cola 1,5 L.
    s.new_basket()
    r = s.add([combo_line(FAM.format("pollo-bbq", "traditional"), "duo", "duo-1"),
               combo_line(FAM.format("super-pepperoni", "traditional"), "duo", "duo-1"),
               {"productId": "cp-palitos-de-ajo", "quantity": 1, "c_pjComboFor": "duo-1"},
               {"productId": "cp-coca-cola-2", "quantity": 1, "c_pjComboFor": "duo-1"}])
    promos = sorted({p for i in r["productItems"] for p in promos_of(i)})
    check("DAT-11.5 Dúo + Hazlo combo = $22.590 + $6.990", r["productTotal"] == 22590 + 6990 and
          promos == ["pj-hazlo-combo", "pj-super-duo"], f"productTotal={r['productTotal']} {promos}")
    check("DAT-11.4 SCAPI escribe y devuelve c_pjComboFor",
          sum(i.get("c_pjComboFor") == "duo-1" for i in r["productItems"]) == 2)

    # 7. Canje (CHK): pedido canónico de Sofía + Super Pepperoni mediana con el cupón = $23.890.
    s.new_basket()
    s.add([{"productId": FAM.format("pollo-bbq", "traditional"), "quantity": 1, "c_pjRemoved": ["cebolla"]},
           {"productId": "cp-palitos-de-ajo", "quantity": 1}, {"productId": "cp-coca-cola-sin-azucar-10", "quantity": 1},
           {"productId": "pz-super-pepperoni-medium-traditional", "quantity": 2}])
    r = pj.shop("GET", BASKETS + f"/{s.basket}", s.tok)
    check("DAT-11 canje: sin el cupón la Super Pepperoni mediana se cobra", r["productTotal"] == 16900 + 6990 + 2 * 13000,
          f"productTotal={r['productTotal']}")
    r = pj.shop("POST", BASKETS + f"/{s.basket}/coupons", s.tok, {"code": "PJ-CANJE-PUNTOS"})
    sp = [i for i in r["productItems"] if i["productId"].startswith("pz-super-pepperoni-medium")][0]
    check("DAT-11 canje: solo una Super Pepperoni mediana a $0 (de 2)", sp["priceAfterItemDiscount"] == sp["basePrice"],
          f"2 unidades: {sp['price']} → {sp['priceAfterItemDiscount']}")
    pj.shop("PATCH", BASKETS + f"/{s.basket}/items/{sp['itemId']}", s.tok, {"quantity": 1})
    r = pj.shop("GET", BASKETS + f"/{s.basket}", s.tok)
    coupon = r.get("couponItems", [{}])[0]
    check("DAT-11 canje: pedido canónico + Super Pepperoni canjeada = $23.890", r["productTotal"] == 23890,
          f"productTotal={r['productTotal']} cupón={coupon.get('code')} valid={coupon.get('valid')} "
          f"status={coupon.get('statusCode')}")

    # 8. Atributos de canasta → pedido, PJ_CASH y precio del Dúo en el pedido final (invitado, retiro El Bosque).
    s.new_basket()
    s.add([combo_line(FAM.format("pollo-bbq", "traditional"), "duo", "duo-1", ["pepperoni"]),
           combo_line(FAM.format("hawaiana", "traditional"), "duo", "duo-1")])
    attrs = {"c_pjNote": "Sin cortar, por favor", "c_pjStoreId": "pj-48", "c_pjDocType": "boleta", "c_pjRedeemed": 0,
             "c_pjPointsEarned": 24, "c_pjStatus": "recibido"}
    b = pj.shop("PATCH", BASKETS + f"/{s.basket}", s.tok, attrs)
    check("DAT-11 CHK: atributos de canasta escribibles por el comprador",
          all(b.get(k) == v for k, v in attrs.items()), str({k: b.get(k) for k in attrs}))
    methods = pj.shop("GET", BASKETS + f"/{s.basket}/payment-methods", s.tok)
    ids = [m["id"] for m in methods.get("applicablePaymentMethods", [])]
    check("DAT-11 CHK: PJ_CASH es un medio de pago aplicable", "PJ_CASH" in ids, str(ids))
    addr = {"firstName": "Prueba", "lastName": "DAT", "address1": "Tobalaba 201", "city": "Las Condes",
            "countryCode": "CL", "phone": "+56900000000"}
    pj.shop("PUT", BASKETS + f"/{s.basket}/customer", s.tok, {"email": "verificacion@demo.pj.cl"})
    pj.shop("PUT", BASKETS + f"/{s.basket}/shipments/me/shipping-method", s.tok, {"id": "005"})
    pj.shop("PUT", BASKETS + f"/{s.basket}/shipments/me/shipping-address", s.tok, addr)
    b = pj.shop("PUT", BASKETS + f"/{s.basket}/billing-address", s.tok, addr)
    pj.shop("POST", BASKETS + f"/{s.basket}/payment-instruments", s.tok,
            {"paymentMethodId": "PJ_CASH", "amount": b["orderTotal"]})
    order = pj.shop("POST", ORDERS, s.tok, {"basketId": s.basket})
    s.basket = None
    check("DAT-11 pedido con Dúo + extra y PJ_CASH = $24.530", order["productTotal"] == 22590 + 1940 and
          order["paymentInstruments"][0]["paymentMethodId"] == "PJ_CASH",
          f"pedido {order['orderNo']} total={order['orderTotal']} {order['paymentInstruments'][0]['paymentMethodId']}")
    check("DAT-11 CHK: los atributos de la canasta se copian al pedido", all(order.get(k) == v for k, v in attrs.items()),
          str({k: order.get(k) for k in attrs}))
    check("DAT-11 c_pjComboGroup llega al pedido", all(i.get("c_pjComboGroup") == "duo-1" for i in order["productItems"]))

    # 9. Venta cruzada (S-D19): bebidas 1,5 L y 2,5 L (no hay 2 L ni 3 L en el catálogo), acompañamientos y postres.
    xsell = {"cp-coca-cola-2": "1,5 L", "cp-coca-cola-3": "2,5 L", "cp-coca-cola-sin-azucar-10": "1,5 L",
             "cp-coca-cola-sin-azucar-9": "2,5 L", "cp-sprite-18": "1,5 L", "cp-sprite-19": "2,5 L",
             "cp-fanta-22": "1,5 L", "cp-fanta-23": "2,5 L", "cp-palitos-de-ajo": "", "cp-cheesyquenos": "",
             "cp-palitos-de-queso": "", "cp-cookie": "", "cp-brownie": "", "cp-cinnapie": ""}
    r = pj.shop("GET", PRODUCTS, s.tok, params={"ids": ",".join(xsell), "expand": "prices,availability,images",
                                                "inventoryIds": "inventory_pj_48,inventory_pj_9"})
    bad = [p["id"] for p in r["data"] if not (p.get("price") and p.get("inventory", {}).get("orderable")
                                              and all(i["orderable"] for i in p.get("inventories", [])))]
    bad += sorted(set(xsell) - {p["id"] for p in r["data"]})
    check("DAT-11 S-D19 venta cruzada: precio y orderable (sitio, El Bosque, Salvador)", not bad, f"fallan {bad}")


def main():
    wanted = sys.argv[1:] or ["dat02", "dat03", "dat04", "dat05", "dat06", "dat07", "dat11"]
    s = Shopper()
    for name in wanted:
        print(f"== {name.upper()}")
        try:
            globals()[name](s)
        except pj.ApiError as e:
            check(f"{name} (error de API)", False, f"{e.status} {e.body[:200]}")
    bad = [n for n, ok in results if not ok]
    print(f"\n{len(results) - len(bad)}/{len(results)} OK")


if __name__ == "__main__":
    main()
