'use strict';

/**
 * Validaciones al agregar o cambiar líneas del carrito (SCAPI Shopper Baskets).
 * Devuelven Status.ERROR (HTTP 400) solo cuando la línea no es válida; si no, no devuelven nada para que
 * la plataforma siga con su implementación.
 */

var ProductMgr = require('dw/catalog/ProductMgr');
var Status = require('dw/system/Status');
var rules = require('*/cartridge/scripts/pj/demoRules');

function error(code, message) {
    return new Status(Status.ERROR, code, message);
}

function prop(doc, camel, snake) {
    return doc[camel] !== undefined ? doc[camel] : doc[snake];
}

function check(doc, productId) {
    if (productId && rules.isHalvesProduct(productId)) {
        var halves = doc.c_pjHalves;
        if (halves) {
            var msg = rules.validateHalves(halves, doc.c_pjParts);
            if (msg) {
                return error('PJ_HALVES_INVALID', msg);
            }
        }
    } else if (doc.c_pjHalves) {
        return error('PJ_HALVES_INVALID', 'Solo la pizza por mitades (pz-mitades) lleva c_pjHalves');
    }
    var product = productId ? ProductMgr.getProduct(productId) : null;
    var comboMsg = rules.validateCombo(product, doc.c_pjComboChoices);
    if (comboMsg) {
        return error('PJ_COMBO_INVALID', comboMsg);
    }
    return null;
}

exports.beforePOST = function (basket, items) {
    var list = items || [];
    for (var i = 0; i < list.length; i += 1) {
        var result = check(list[i], prop(list[i], 'productId', 'product_id'));
        if (result) {
            return result;
        }
    }
    return undefined;
};

exports.beforePATCH = function (basket, item) {
    if (!item || (!item.c_pjHalves && !item.c_pjComboChoices)) {
        return undefined;
    }
    var productId = prop(item, 'productId', 'product_id');
    if (!productId && item.c_pjHalves) {
        // El PATCH no siempre trae el producto: se valida la regla de mitades igual.
        var msg = rules.validateHalves(item.c_pjHalves, item.c_pjParts);
        return msg ? error('PJ_HALVES_INVALID', msg) : undefined;
    }
    return check(item, productId) || undefined;
};
