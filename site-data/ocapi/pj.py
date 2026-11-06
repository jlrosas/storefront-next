"""Cliente mínimo de OCAPI Data API y SCAPI Shopper para el sandbox de la demo.

Lee las credenciales de dw.json (nunca se copian al repo): el primero que encuentra subiendo desde este
archivo (raíz del proyecto papapizza), o el que indique PJ_DW_JSON.

Uso como librería:  from pj import data, shop, slas_guest
"""
import base64
import hashlib
import json
import os
import secrets
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent


def _find_dw_json():
    """dw.json del proyecto: PJ_DW_JSON o el primero que aparezca subiendo desde este archivo."""
    if os.environ.get("PJ_DW_JSON"):
        return Path(os.environ["PJ_DW_JSON"])
    for parent in HERE.parents:
        if (parent / "dw.json").exists():
            return parent / "dw.json"
    raise FileNotFoundError("No se encontró dw.json (defínelo con PJ_DW_JSON)")


DW_JSON = _find_dw_json()
SITE = "PapaJohnsCL"
OCAPI_VERSION = "v24_5"

# SCAPI (Shopper) del sitio: valores públicos del .env del storefront.
ORG = "f_ecom_zyfj_001"
SHORT_CODE = "2362k62d"
SLAS_CLIENT = "313c6a6e-4337-460b-a83c-21bd30c92a2b"
SCAPI = f"https://{SHORT_CODE}.api.commercecloud.salesforce.com"

_cfg = None
_token = None


def cfg():
    global _cfg
    if _cfg is None:
        _cfg = json.loads(DW_JSON.read_text())
    return _cfg


def host():
    return cfg()["hostname"]


class ApiError(Exception):
    def __init__(self, status, body, url):
        super().__init__(f"{status} {url}\n{body[:2000]}")
        self.status, self.body, self.url = status, body, url


def http(method, url, body=None, headers=None, raw=False):
    data = None
    headers = dict(headers or {})
    if body is not None:
        if isinstance(body, (bytes, str)):
            data = body.encode() if isinstance(body, str) else body
        else:
            data = json.dumps(body).encode()
            headers.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            text = resp.read()
            if raw:
                return text
            return json.loads(text) if text else {}
    except urllib.error.HTTPError as e:
        text = e.read().decode(errors="replace")
        if e.code == 401 and "account.demandware.com" not in url and "shopper" not in url:
            sys.stderr.write("401: la clave de dw.json venció o no tiene permisos. Detente y avisa.\n")
        raise ApiError(e.code, text, url) from None


def token():
    """Token de cliente (client_credentials) del API client de dw.json."""
    global _token
    if _token and _token[1] > time.time() + 60:
        return _token[0]
    c = cfg()
    basic = base64.b64encode(f'{c["client-id"]}:{c["client-secret"]}'.encode()).decode()
    res = http(
        "POST",
        "https://account.demandware.com/dwsso/oauth2/access_token",
        "grant_type=client_credentials",
        {"Authorization": f"Basic {basic}", "Content-Type": "application/x-www-form-urlencoded"},
    )
    _token = (res["access_token"], time.time() + int(res.get("expires_in", 1500)))
    return _token[0]


def data(method, path, body=None, params=None):
    """Llamada a OCAPI Data API. `path` empieza con '/' (p. ej. '/sites/PapaJohnsCL/campaigns')."""
    q = "?" + urllib.parse.urlencode(params) if params else ""
    url = f"https://{host()}/s/-/dw/data/{OCAPI_VERSION}{path}{q}"
    return http(method, url, body, {"Authorization": f"Bearer {token()}"})


def data_all(path, key="data", count=200, params=None):
    out, start = [], 0
    while True:
        p = dict(params or {}, start=start, count=count)
        res = data("GET", path, params=p)
        items = res.get(key) or []
        out += items
        start += len(items)
        if not items or start >= res.get("total", 0):
            return out


# ---------- SCAPI Shopper (SLAS público con PKCE) ----------

def _pkce():
    verifier = base64.urlsafe_b64encode(secrets.token_bytes(64)).rstrip(b"=").decode()
    challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).rstrip(b"=").decode()
    return verifier, challenge


def _no_redirect_opener():
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None

    return urllib.request.build_opener(NoRedirect)


def _code_from(url, body):
    try:
        resp = _no_redirect_opener().open(urllib.request.Request(url, data=body, method="POST" if body else "GET",
                                                                  headers={"Content-Type": "application/x-www-form-urlencoded"} if body else {}))
        loc = resp.headers.get("Location") or resp.geturl()
    except urllib.error.HTTPError as e:
        loc = e.headers.get("Location")
        if not loc:
            raise ApiError(e.code, e.read().decode(errors="replace"), url) from None
    return urllib.parse.parse_qs(urllib.parse.urlparse(loc).query)


REDIRECT = "http://localhost:5173/callback"


def _exchange(code, usid, verifier):
    body = urllib.parse.urlencode({
        "grant_type": "authorization_code_pkce", "code": code, "usid": usid,
        "code_verifier": verifier, "client_id": SLAS_CLIENT, "redirect_uri": REDIRECT, "channel_id": SITE,
    })
    return http("POST", f"{SCAPI}/shopper/auth/v1/organizations/{ORG}/oauth2/token", body,
                {"Content-Type": "application/x-www-form-urlencoded"})


def slas_guest():
    verifier, challenge = _pkce()
    q = urllib.parse.urlencode({
        "client_id": SLAS_CLIENT, "redirect_uri": REDIRECT, "response_type": "code", "hint": "guest",
        "code_challenge": challenge, "channel_id": SITE,
    })
    qs = _code_from(f"{SCAPI}/shopper/auth/v1/organizations/{ORG}/oauth2/authorize?{q}", None)
    return _exchange(qs["code"][0], qs["usid"][0], verifier)


def slas_login(email, password):
    """Login de cliente registrado (B2C) con PKCE público."""
    verifier, challenge = _pkce()
    url = f"{SCAPI}/shopper/auth/v1/organizations/{ORG}/oauth2/login"
    basic = base64.b64encode(f"{email}:{password}".encode()).decode()
    body = urllib.parse.urlencode({
        "client_id": SLAS_CLIENT, "redirect_uri": REDIRECT, "response_type": "code",
        "code_challenge": challenge, "channel_id": SITE,
    }).encode()
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "Authorization": f"Basic {basic}", "Content-Type": "application/x-www-form-urlencoded"})
    try:
        resp = _no_redirect_opener().open(req)
        loc = resp.headers.get("Location") or resp.geturl()
    except urllib.error.HTTPError as e:
        loc = e.headers.get("Location")
        if not loc:
            raise ApiError(e.code, e.read().decode(errors="replace"), url) from None
    qs = urllib.parse.parse_qs(urllib.parse.urlparse(loc).query)
    return _exchange(qs["code"][0], qs["usid"][0], verifier)


def shop(method, path, tok, body=None, params=None):
    """Llamada a SCAPI Shopper. `path` relativo a la org, p. ej. '/checkout/shopper-baskets/v1/.../baskets'."""
    p = dict(params or {})
    p.setdefault("siteId", SITE)
    url = f"{SCAPI}{path.format(org=ORG)}?{urllib.parse.urlencode(p, doseq=True)}"
    return http(method, url, body, {"Authorization": f"Bearer {tok}"})


if __name__ == "__main__":
    # Prueba rápida: lista los sitios visibles por OCAPI.
    print(json.dumps(data("GET", "/sites", params={"select": "(data.(id))"}), indent=1))
