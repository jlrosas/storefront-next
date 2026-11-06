#!/usr/bin/env python3
"""Clientes de demo (contrato §3) y su historial. Idempotente: se puede correr varias veces.

Uso:  python3 site-data/ocapi/customers.py [--only sofia@demo.pj.cl,...] [--skip-orders]

- Registro y login por SCAPI (SLAS público del storefront), con la contraseña de demo DEMO_PASSWORD.
- Perfil (puntos, movimientos, favoritas, puntos dobles) y grupos estáticos por OCAPI Data API.
- Dirección y tarjeta guardada por SCAPI Shopper Customers.
- Pedidos históricos reales por SCAPI Shopper Baskets/Orders. La fecha de creación de un pedido no se
  puede cambiar: la fecha «visible» de la demo queda en c_pjPlacedAt (y el estado en c_pjStatus).
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import pj  # noqa: E402

SITE = pj.SITE
LIST = SITE  # customer list del sitio
DEMO_PASSWORD = "PapaDemo2026"  # cuentas ficticias del sandbox (correos @demo.pj.cl)

EL_BOSQUE = {"storeId": "pj-48", "address1": "Tobalaba 201", "city": "Las Condes"}
HOME = {"addressId": "casa", "firstName": "Sofía", "lastName": "Muñoz", "address1": "Av. Providencia 1234",
        "address2": "depto 504", "city": "Providencia", "countryCode": "CL", "stateCode": "RM",
        "phone": "+56976543210", "preferred": True}

# Visa ····4521 con BIN 424242 (la lista de la promoción por BIN). Número de prueba válido por Luhn.
CARD_BIN, CARD_LAST4 = "424242", "4521"

# Pedidos de Sofía (contrato §3 y §6): el último es el pedido canónico del 2-oct.
P = "pz-{}-family-traditional"
SOFIA_ORDERS = [
    {"date": "2026-05-16T20:40:00.000Z", "mode": "pickup", "items": [(P.format("todas-las-carnes"), 1, {})]},
    {"date": "2026-06-20T21:05:00.000Z", "mode": "delivery",
     "items": [(P.format("pollo-bbq"), 1, {}), ("cp-coca-cola-sin-azucar-10", 1, {})]},
    {"date": "2026-07-25T20:15:00.000Z", "mode": "pickup",
     "items": [(P.format("pollo-bbq"), 1, {}), (P.format("todas-las-carnes"), 1, {})]},
    {"date": "2026-08-22T21:30:00.000Z", "mode": "pickup",
     "items": [(P.format("todas-las-carnes"), 1, {}), ("cp-palitos-de-ajo", 1, {}),
               ("cp-coca-cola-sin-azucar-10", 1, {})]},
    {"date": "2026-09-13T20:50:00.000Z", "mode": "delivery",
     "items": [(P.format("pollo-bbq"), 1, {"c_pjRemoved": ["cebolla"]}), ("cp-cheesyquenos", 1, {})]},
    # Pedido canónico (§6): Pollo BBQ Familiar Tradicional sin cebolla + Hazlo combo = $23.890, El Bosque.
    {"date": "2026-10-02T20:30:00.000Z", "mode": "pickup",
     "items": [(P.format("pollo-bbq"), 1, {"c_pjRemoved": ["cebolla"]}), ("cp-palitos-de-ajo", 1, {}),
               ("cp-coca-cola-sin-azucar-10", 1, {})]},
]
VALENTINA_ORDERS = [
    {"date": "2024-11-08T20:20:00.000Z", "mode": "pickup", "items": [("pz-napolitana-family-traditional", 1, {})]},
]

SOFIA = {
    "first": "Sofía", "last": "Muñoz", "phone": "+56976543210", "points": 340,
    "favorites": ["pz-pollo-bbq", "pz-todas-las-carnes"], "double": False, "groups": ["pj-frecuente"],
    "address": HOME, "card": True, "orders": SOFIA_ORDERS,
}
CUSTOMERS = {
    "sofia@demo.pj.cl": SOFIA,
    "diego@demo.pj.cl": {"first": "Diego", "last": "Soto", "phone": "+56912345678", "points": 0, "favorites": [],
                         "double": False, "groups": [], "address": None, "card": False, "orders": []},
    "valentina@demo.pj.cl": {"first": "Valentina", "last": "Rojas", "phone": "+56987654321", "points": 40,
                             "favorites": ["pz-napolitana"], "double": True, "groups": ["pj-reactivacion"],
                             "address": None, "card": False, "orders": VALENTINA_ORDERS},
}
# Copias de Sofía: validadores (val1..3) y un cliente por agente constructor.
COPIES = [f"val{i}@demo.pj.cl" for i in (1, 2, 3)] + [
    f"dev-{c}@demo.pj.cl" for c in ("int", "hom", "men", "pro", "ofe", "tie", "car", "ing", "chk", "seg", "cta", "pan")]
for login in COPIES:
    CUSTOMERS[login] = dict(SOFIA, first="Sofía", last=f"Muñoz ({login.split('@')[0]})")

SHOPPER = "/customer/shopper-customers/v1/organizations/{org}"
BASKETS = "/checkout/shopper-baskets/v1/organizations/{org}/baskets"
ORDERS = "/checkout/shopper-orders/v1/organizations/{org}/orders"


def luhn_card(bin6, last4):
    """Número de 16 dígitos con ese BIN y últimos 4 que pasa Luhn (se ajusta un dígito del medio)."""
    for mid in range(10 ** 5):
        number = f"{bin6}{mid:06d}{last4}"
        digits = [int(d) for d in number]
        total = 0
        for i, d in enumerate(reversed(digits)):
            if i % 2:
                d *= 2
                d -= 9 if d > 9 else 0
            total += d
        if total % 10 == 0:
            return number
    raise ValueError("sin número válido")


def register(login, c):
    guest = pj.slas_guest()["access_token"]
    try:
        pj.shop("POST", SHOPPER + "/customers", guest, {
            "customer": {"login": login, "email": login, "firstName": c["first"], "lastName": c["last"],
                         "phoneMobile": c["phone"]},
            "password": DEMO_PASSWORD,
        })
        print(f"  registrado {login}")
    except pj.ApiError as e:
        if e.status in (400, 409) and ("login" in e.body.lower() or "exists" in e.body.lower()):
            print(f"  ya existía {login}")
        else:
            raise
    tok = pj.slas_login(login, DEMO_PASSWORD)
    return tok["access_token"], tok["customer_id"]


def customer_no(tok, cid):
    return pj.shop("GET", SHOPPER + f"/customers/{cid}", tok)["customerNo"]


def points_log(c, earned):
    """Movimientos de puntos: lo ganado por pedido y un saldo inicial que cuadra con el saldo del contrato."""
    log = [{"date": o["date"], "type": "earn", "points": pts, "order": no, "label": "Pedido"}
           for o, no, pts in earned]
    initial = c["points"] - sum(e["points"] for e in log)
    if c["points"] and initial:
        log.insert(0, {"date": "2024-03-01T12:00:00.000Z", "type": "earn", "points": initial, "order": None,
                       "label": "Saldo del programa anterior"})
    return log


def set_profile(no, c, earned):
    pj.data("PATCH", f"/customer_lists/{LIST}/customers/{no}", {
        "c_pjPoints": c["points"],
        "c_pjPointsLog": json.dumps(points_log(c, earned), ensure_ascii=False),
        "c_pjFavorites": c["favorites"],
        "c_pjDoublePoints": c["double"],
        "c_pjMarketingOptIn": True,
    })


def set_groups(no, groups):
    for g in groups:
        try:
            pj.data("PUT", f"/sites/{SITE}/customer_groups/{g}/members/{no}", {})
        except pj.ApiError as e:
            if e.status != 409:
                raise


def ensure_address(tok, cid, address):
    if not address:
        return
    me = pj.shop("GET", SHOPPER + f"/customers/{cid}", tok)
    if any(a.get("addressId") == address["addressId"] for a in me.get("addresses") or []):
        return
    pj.shop("POST", SHOPPER + f"/customers/{cid}/addresses", tok, address)


def ensure_card(tok, cid, holder):
    me = pj.shop("GET", SHOPPER + f"/customers/{cid}", tok)
    for pi in me.get("paymentInstruments") or []:
        if (pi.get("paymentCard") or {}).get("numberLastDigits") == CARD_LAST4:
            return
    pj.shop("POST", SHOPPER + f"/customers/{cid}/payment-instruments", tok, {
        "paymentMethodId": "CREDIT_CARD",
        "paymentCard": {"number": luhn_card(CARD_BIN, CARD_LAST4), "cardType": "Visa",
                        "expirationMonth": 8, "expirationYear": 2029, "holder": holder},
    })


def existing_orders(tok, cid):
    res = pj.shop("GET", SHOPPER + f"/customers/{cid}/orders", tok, params={"limit": 50})
    return res.get("data") or []


def place_order(tok, cid, login, c, spec):
    basket = None
    for b in (pj.shop("GET", SHOPPER + f"/customers/{cid}/baskets", tok).get("baskets") or []):
        pj.shop("DELETE", BASKETS + f"/{b['basketId']}", tok)
    basket = pj.shop("POST", BASKETS, tok, {"customerInfo": {"email": login}})
    bid = basket["basketId"]
    items = [dict({"productId": pid, "quantity": qty}, **extra) for pid, qty, extra in spec["items"]]
    pj.shop("POST", BASKETS + f"/{bid}/items", tok, items)
    if spec["mode"] == "pickup":
        method, ship = "005", {"firstName": c["first"], "lastName": c["last"], "address1": EL_BOSQUE["address1"],
                               "city": EL_BOSQUE["city"], "countryCode": "CL", "phone": c["phone"]}
    else:
        method, ship = "001", {k: v for k, v in HOME.items() if k not in ("addressId", "preferred")}
    pj.shop("PUT", BASKETS + f"/{bid}/shipments/me/shipping-method", tok, {"id": method})
    pj.shop("PUT", BASKETS + f"/{bid}/shipments/me/shipping-address", tok, ship)
    bill = {k: v for k, v in HOME.items() if k not in ("addressId", "preferred")}
    basket = pj.shop("PUT", BASKETS + f"/{bid}/billing-address", tok, bill)
    pj.shop("POST", BASKETS + f"/{bid}/payment-instruments", tok, {
        "paymentMethodId": "CREDIT_CARD", "amount": basket["orderTotal"],
        "paymentCard": {"maskedNumber": "************" + CARD_LAST4, "cardType": "Visa", "expirationMonth": 8,
                        "expirationYear": 2029, "holder": f"{c['first']} {c['last']}"},
    })
    order = pj.shop("POST", ORDERS, tok, {"basketId": bid})
    shipping = order.get("shippingTotal") or 0
    pts = int((order["orderTotal"] - shipping) // 1000)
    patch = {
        "c_pjPlacedAt": spec["date"],
        "c_pjStatus": "retirado" if spec["mode"] == "pickup" else "entregado",
        "c_pjStatusAt": spec["date"],
        "c_pjPointsEarned": pts,
        "c_pjPointsState": "acreditados",
        "c_pjStoreId": EL_BOSQUE["storeId"],
        "c_pjDocType": "boleta",
    }
    pj.data("PATCH", f"/sites/{SITE}/orders/{order['orderNo']}", patch)
    if order.get("status") == "created":
        # Sin hooks de SCAPI activos el pedido queda «created»: se coloca por OCAPI Data.
        try:
            pj.data("PUT", f"/sites/{SITE}/orders/{order['orderNo']}/status", {"status": "new"})
        except pj.ApiError as e:
            print(f"    no se pudo colocar {order['orderNo']}: {e.status} {e.body[:200]}")
    print(f"    pedido {order['orderNo']} {spec['date'][:10]} ${order['orderTotal']:,.0f} ({spec['mode']})")
    return order["orderNo"], pts


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", help="logins separados por coma")
    ap.add_argument("--skip-orders", action="store_true")
    args = ap.parse_args()
    logins = args.only.split(",") if args.only else list(CUSTOMERS)
    for login in logins:
        c = CUSTOMERS[login]
        print(login)
        tok, cid = register(login, c)
        no = customer_no(tok, cid)
        ensure_address(tok, cid, c["address"])
        if c["card"]:
            ensure_card(tok, cid, f"{c['first']} {c['last']}")
        earned = []
        done = existing_orders(tok, cid)
        if not args.skip_orders and len(done) < len(c["orders"]):
            for spec in c["orders"][len(done):]:
                order_no, pts = place_order(tok, cid, login, c, spec)
                earned.append((spec, order_no, pts))
        else:
            # Ya estaban: se reconstruyen los movimientos desde los pedidos existentes (más antiguo primero).
            for spec, o in zip(c["orders"], sorted(done, key=lambda o: o["creationDate"])):
                earned.append((spec, o["orderNo"], o.get("c_pjPointsEarned") or 0))
        set_profile(no, c, earned)
        set_groups(no, c["groups"])
        print(f"  listo: cliente {no}, {c['points']} pts, grupos {c['groups']}")


if __name__ == "__main__":
    main()
