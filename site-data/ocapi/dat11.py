#!/usr/bin/env python3
"""DAT-11: Super Dúo y Super Trío como pizzas reales + promoción (S-D20), y los pedidos de CHK.

Aplica en el sandbox, sin reconstruir el sitio, solo lo que agrega DAT-11. Todo sale de build_site.py (la
misma fuente que usa rebuild.sh), así que un rebuild completo deja lo mismo.

- Opción pjCombo (no | duo | trio, $0) en las pizzas elegibles del combo (catálogo maestro).
- Promociones pj-super-duo y pj-super-trio (campaña pj-demo): N familiares con pjCombo pagan el precio del combo.
- Atributos de línea c_pjComboGroup y c_pjComboFor; atributos de canasta (Basket) que se copian al pedido.
- Canje: promoción pj-canje-puntos con el cupón de código fijo PJ-CANJE-PUNTOS.
- Medio de pago PJ_CASH (y su procesador).

Uso:  python3 site-data/ocapi/dat11.py [--dry-run]     (verificación: verify.py dat11)
Importa por WebDAV + job sfcc-site-archive-import (OCAPI Data), con las credenciales de dw.json.
"""
import shutil
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
sys.path.insert(0, str(HERE.parent))
import pj  # noqa: E402
import build_site as B  # noqa: E402


def archive(folder):
    prices, sc, _, raw_ingredients = B.load()
    ingredients = B.build_ingredients(raw_ingredients)
    products, _ = B.build_products(prices, sc)
    specs = B.combo_promo_specs(products)
    redeem = B.redeem_variants(products)

    B.write(folder / "version.txt", "PapaJohnsCL DAT-11\n")
    B.write(folder / "meta" / "system-objecttype-extensions.xml", B.meta_xml(ingredients))

    # Solo los maestros que reciben la opción pjCombo (definición completa: opciones, variaciones y variantes).
    cat = B.master_catalog([p for p in products if p["id"] in B.COMBO_MASTERS], ingredients)
    B.write(folder / "catalogs" / B.MASTER / "catalog.xml", cat)

    site = folder / "sites" / B.SITE_ID
    head = '<?xml version="1.0" encoding="UTF-8"?>\n<promotions xmlns="http://www.demandware.com/xml/impex/promotion/2008-01-31">\n'
    B.write(site / "promotions.xml", head + "\n".join([
        B.combo_promotions_xml(specs), B.redeem_promotion_xml(redeem),
        B.combo_assignments_xml(specs), B.redeem_assignment_xml()]) + "\n</promotions>\n")
    B.write(site / "coupons.xml", B.coupons_xml())
    B.write(site / "payment-methods.xml",
            '<?xml version="1.0" encoding="UTF-8"?>\n<payment-settings xmlns="http://www.demandware.com/xml/impex/'
            'paymentsettings/2009-09-15">\n' + B.PJ_PAYMENT_METHODS + "</payment-settings>\n")
    B.write(site / "payment-processors.xml",
            '<?xml version="1.0" encoding="UTF-8"?>\n<payment-processors xmlns="http://www.demandware.com/xml/impex/'
            'paymentprocessor/2007-03-31">\n' + B.PJ_PAYMENT_PROCESSORS + "</payment-processors>\n")
    return specs, redeem


def main():
    tmp = Path(tempfile.mkdtemp(prefix="dat11-"))
    try:
        specs, redeem = archive(tmp)
        for s in specs:
            print(f"{s['id']}: {s['quantity']} × familiar con pjCombo={s['value']} = ${s['price']} "
                  f"({len(s['variants'])} variantes: {', '.join(s['masters'])})")
        print(f"{B.REDEEM_PROMO}: cupón {B.REDEEM_COUPON}, {len(redeem)} variantes medianas canjeables")
        if "--dry-run" in sys.argv:
            print(f"Archivo en {tmp} (no se importa)")
            return
        ex = pj.site_import(tmp, "dat11")
        status = (ex.get("exit_status") or {}).get("code")
        print(f"Importación: {ex.get('execution_status')} {status} {ex.get('log_file_name') or ''}")
        if status != "OK":
            sys.exit(1)
    finally:
        if "--dry-run" not in sys.argv:
            shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
