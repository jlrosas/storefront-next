const systemNodes = document.querySelectorAll('.system-node');
const systemDialog = document.querySelector('#systemDialog');
const systemDialogTitle = document.querySelector('#systemDialogTitle');
const systemDialogCopy = document.querySelector('#systemDialogCopy');
const trackingPreview = document.querySelector('#trackingPreview');
const systemDialogClose = document.querySelector('.system-dialog-close');
const systemContexts = {
  web: [
    'Web Papa Johns',
    'Canal digital propio donde el cliente descubre productos, configura su pedido, aplica beneficios y completa la compra.'
  ],
  app: [
    'App Papa Johns',
    'Canal móvil propio. Debe mantener el contexto del cliente y su orden durante la selección, el pago y el seguimiento.'
  ],
  aggregators: [
    'Agregadores',
    'Canales externos de venta que originan órdenes y requieren coordinación de catálogo, disponibilidad, pago y estados con la operación.'
  ],
  'call-center': [
    'Call Center',
    'Canal asistido para crear o apoyar pedidos; necesita consultar la información de la orden para orientar al cliente y a SAC.'
  ],
  whatsapp: [
    'WhatsApp',
    'Canal de conversación y atención que puede apoyar descubrimiento, consultas, seguimiento y derivación a SAC, manteniendo el contexto del cliente.'
  ],
  ecommerce: [
    'Ecommerce · Core, Users y Orders',
    'Concentra la experiencia de compra y la información de usuarios y órdenes. Coordina middleware, disponibilidad y tiempos estimados (ETA) entre canales y sistemas.'
  ],
  webpay: [
    'Webpay',
    'Pasarela de pago. Devuelve el resultado de la transacción para que la compra continúe o informe al cliente si debe reintentar.'
  ],
  'mercado-pago': [
    'Mercado Pago',
    'Alternativa de pago integrada al checkout. La respuesta debe asociarse a la orden correcta y evitar cobros u órdenes duplicadas.'
  ],
  fintoc: [
    'Fintoc',
    'Opción de pago disponible en el checkout. El resultado de la autorización debe quedar trazable en el flujo de la orden.'
  ],
  'food-cards': [
    'Tarjetas alimentarias',
    'Medios de pago de alimentación que pueden estar disponibles según las condiciones de compra. El checkout debe reflejar su resultado en el total y estado de la orden.'
  ],
  'digital-wallets': [
    'Billeteras digitales',
    'Medios de pago digitales como GPay y Apple Pay. El checkout debe reflejar su autorización, asociarla a la orden correcta y evitar cobros duplicados.'
  ],
  'pj-api': [
    'API Papa Johns',
    'Capa de integración que coordina el resultado del pago con la creación y el envío de la orden operacional, además de sus estados y datos de despacho.'
  ],
  'ncr-cloud-connect': [
    'NCR Cloud Connect',
    'Orquestador de órdenes hacia tienda. Recibe la orden operacional, la deriva al entorno de tienda y comunica eventos de proceso.'
  ],
  aloha: [
    'Aloha / OMS',
    'Usamos Aloha como sistema de gestión de órdenes en la operación. La integración debe llevar la orden a tienda y permitir manejar respuestas, estados y excepciones.'
  ],
  dispatchtrack: [
    'DispatchTrack · seguimiento del despacho',
    'Integra los eventos del despacho para actualizar el estado de la orden y ofrecer una experiencia de seguimiento en vivo, desde la salida de tienda hasta la entrega.'
  ],
  synerise: [
    'CRM · Synerise',
    'Actualmente usamos Synerise como CRM. Apoya la gestión de datos y comunicaciones de cliente, fidelización y personalización; la integración debe considerar consentimiento, eventos y beneficios como Papa Puntos.'
  ],
  zendesk: [
    'Zendesk · SAC',
    'Plataforma de atención al cliente. El equipo de SAC necesita consultar contexto de la orden y sus eventos para dar seguimiento a consultas e incidencias.'
  ],
  'store-kiosk': [
    'Tienda Tótem',
    'Punto de operación en tienda que participa en la recepción o gestión de pedidos. Su rol específico depende de la configuración de cada local.'
  ],
  'ncr-pos': [
    'NCR POS',
    'Punto de venta de NCR en tienda, vinculado al flujo operacional y a la gestión de las órdenes recibidas.'
  ],
  kds: [
    'KDS',
    'Kitchen Display System: presenta el trabajo de preparación al equipo de cocina y origina eventos que ayudan a actualizar el estado de la orden.'
  ],
  'store-server': [
    'Servidor de tienda',
    'Componente local que participa en la comunicación entre los sistemas de tienda y la plataforma de órdenes.'
  ],
  'quick-commerce': [
    'Quick Commerce',
    'Capa que coordina opciones de despacho y la asignación de flota para pedidos con entrega a domicilio.'
  ],
  'own-fleet': [
    'Flota propia',
    'Repartidores gestionados por Papa Johns. Los eventos de asignación y entrega deben reflejarse en el seguimiento de la orden.'
  ],
  'external-fleet': [
    'Flota externa',
    'Operadores externos que pueden apoyar la última milla. La integración debe comunicar asignación, avance y resultado del despacho.'
  ],
  backoffice: [
    'Backoffice',
    'Herramientas internas para que los equipos gestionen y supervisen la operación, con visibilidad de pedidos e incidencias.'
  ]
};

function showSystemContext(node) {
  const context = systemContexts[node.dataset.system];
  if (!context || !systemDialog) {
    return;
  }

  systemNodes.forEach(item => {
    const isSelected = item === node;
    item.classList.toggle('is-selected', isSelected);
    item.setAttribute('aria-expanded', String(isSelected));
  });

  systemDialogTitle.textContent = context[0];
  systemDialogCopy.textContent = context[1];
  trackingPreview.hidden = node.dataset.system !== 'dispatchtrack';

  window.openAnimatedDialog(systemDialog);
}

systemNodes.forEach(node => {
  node.setAttribute('tabindex', '0');
  node.setAttribute('role', 'button');
  node.setAttribute('aria-controls', 'systemDialog');
  node.setAttribute('aria-expanded', 'false');
  node.addEventListener('click', () => showSystemContext(node));
  node.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showSystemContext(node);
    }
  });
});

systemDialogClose.addEventListener('click', () => window.closeAnimatedDialog(systemDialog));
systemDialog.addEventListener('click', event => {
  if (event.target === systemDialog) {
    window.closeAnimatedDialog(systemDialog);
  }
});
systemDialog.addEventListener('cancel', event => {
  event.preventDefault();
  window.closeAnimatedDialog(systemDialog);
});
systemDialog.addEventListener('close', () => {
  systemNodes.forEach(node => {
    node.classList.remove('is-selected');
    node.setAttribute('aria-expanded', 'false');
  });
});
