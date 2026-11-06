'use strict';

/**
 * Pedido de la demo (SCAPI Shopper Orders).
 * - beforePOST: delivery exige el pedido mínimo del método de envío (c_pjMinOrder, $12.000).
 * - afterPOST: no hay pasarela (S-D4): el pedido se coloca y queda «recibido».
 */

var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var Status = require('dw/system/Status');
var Logger = require('dw/system/Logger').getLogger('pj-demo', 'order');

exports.beforePOST = function (basket) {
    var shipments = basket.shipments.iterator();
    var merchandise = basket.adjustedMerchandizeTotalGrossPrice.value;
    while (shipments.hasNext()) {
        var method = shipments.next().shippingMethod;
        var min = method && method.custom.pjMinOrder;
        if (min && merchandise < min) {
            return new Status(Status.ERROR, 'PJ_MIN_ORDER', 'El delivery requiere un pedido mínimo de $' + min);
        }
    }
    return undefined;
};

exports.afterPOST = function (order) {
    if (order.status.value !== Order.ORDER_STATUS_CREATED) {
        return undefined;
    }
    var placed = OrderMgr.placeOrder(order);
    if (placed.error) {
        Logger.error('No se pudo colocar el pedido {0}: {1}', order.orderNo, placed.message);
        return undefined;
    }
    order.setConfirmationStatus(Order.CONFIRMATION_STATUS_CONFIRMED);
    order.setExportStatus(Order.EXPORT_STATUS_READY);
    if (!order.custom.pjStatus) {
        order.custom.pjStatus = 'recibido';
        order.custom.pjStatusAt = new Date();
    }
    return undefined;
};
