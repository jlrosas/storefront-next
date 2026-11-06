'use strict';

/**
 * Reglas de la demo de Papa Johns Chile que comparten los hooks.
 * - Pizza por mitades (R2.1): precio = promedio de las especialidades de c_pjHalves.
 * - Combos: la elección (c_pjComboChoices) debe calzar con c_pjSlots y la oferta debe estar vigente.
 */

var ProductMgr = require('dw/catalog/ProductMgr');

var HALVES_MASTER = 'pz-mitades';
var MIN_PARTS = 2;
var MAX_PARTS = 4;

function parseJson(value) {
    if (!value) {
        return null;
    }
    try {
        return JSON.parse(value);
    } catch (e) {
        return undefined;
    }
}

function masterOf(product) {
    if (!product) {
        return null;
    }
    return product.variant ? product.masterProduct : product;
}

function isHalvesProduct(productOrId) {
    var id = typeof productOrId === 'string' ? productOrId : productOrId && productOrId.ID;
    return !!id && (id === HALVES_MASTER || id.indexOf(HALVES_MASTER + '-') === 0);
}

/**
 * Valida el JSON de mitades. Devuelve null si está bien o el mensaje de error.
 */
function validateHalves(halvesJson, partsValue) {
    var halves = parseJson(halvesJson);
    if (halves === undefined || !Array.isArray(halves)) {
        return 'c_pjHalves debe ser un arreglo JSON [{"part":1,"product":"pz-…"}, …]';
    }
    var parts = partsValue ? Number(partsValue) : halves.length;
    if (parts < MIN_PARTS || parts > MAX_PARTS || halves.length !== parts) {
        return 'La pizza por mitades necesita ' + parts + ' partes y trae ' + halves.length;
    }
    for (var i = 0; i < halves.length; i += 1) {
        var id = halves[i] && halves[i].product;
        var product = masterOf(id ? ProductMgr.getProduct(id) : null);
        if (!product) {
            return 'La especialidad ' + id + ' no existe';
        }
        if (product.custom.pjHalvesEnabled !== true) {
            return product.name + ' no se puede pedir como mitad';
        }
    }
    return null;
}

function unitPrice(product) {
    var price = product && product.priceModel ? product.priceModel.price : null;
    return price && price.available ? price.value : null;
}

/**
 * Precio unitario de una pizza por mitades: promedio de la variante de cada especialidad con el tamaño y la
 * masa de la pizza. Devuelve null si falta un dato (se mantiene el precio base del catálogo).
 */
function halvesPrice(lineItem) {
    var product = lineItem.product;
    if (!product || !isHalvesProduct(product)) {
        return null;
    }
    var halves = parseJson(lineItem.custom.pjHalves);
    if (!halves || !Array.isArray(halves) || !halves.length) {
        return null;
    }
    var size = product.custom.pjSize;
    var crust = product.custom.pjCrust;
    var total = 0;
    for (var i = 0; i < halves.length; i += 1) {
        var master = masterOf(ProductMgr.getProduct(halves[i].product));
        if (!master) {
            return null;
        }
        var variant = ProductMgr.getProduct(master.ID + '-' + size + '-' + crust) ||
            ProductMgr.getProduct(master.ID + '-' + size + '-traditional');
        var price = unitPrice(variant);
        if (price === null) {
            return null;
        }
        total += price;
    }
    return Math.round(total / halves.length);
}

/**
 * Valida un combo al agregarlo: vigencia (c_pjValidFrom/To) y elección según c_pjSlots.
 */
function validateCombo(product, choicesJson) {
    if (!product || product.custom.pjKind !== 'combo') {
        return null;
    }
    var now = new Date();
    if (product.custom.pjValidTo && product.custom.pjValidTo < now) {
        return 'Esta oferta terminó';
    }
    if (product.custom.pjValidFrom && product.custom.pjValidFrom > now) {
        return 'Esta oferta aún no empieza';
    }
    if (!choicesJson) {
        return null;
    }
    var choices = parseJson(choicesJson);
    var config = parseJson(product.custom.pjSlots);
    if (choices === undefined || !Array.isArray(choices)) {
        return 'c_pjComboChoices debe ser un arreglo JSON [{"slot":"pizza1","product":"…"}, …]';
    }
    var slots = {};
    ((config && config.slots) || []).forEach(function (slot) {
        slots[slot.id] = slot;
    });
    for (var i = 0; i < choices.length; i += 1) {
        var choice = choices[i] || {};
        var slot = slots[choice.slot];
        if (!slot) {
            return 'El combo no tiene el espacio ' + choice.slot;
        }
        var ok = (slot.choices || []).some(function (allowed) {
            return choice.product === allowed || String(choice.product).indexOf(allowed + '-') === 0;
        });
        if (!ok) {
            return choice.product + ' no se puede elegir en ' + slot.label;
        }
    }
    return null;
}

module.exports = {
    HALVES_MASTER: HALVES_MASTER,
    isHalvesProduct: isHalvesProduct,
    validateHalves: validateHalves,
    halvesPrice: halvesPrice,
    validateCombo: validateCombo
};
