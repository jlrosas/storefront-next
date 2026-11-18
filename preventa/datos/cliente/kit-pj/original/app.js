const introScreen = document.querySelector('#introScreen');
const introVideo = document.querySelector('#introVideo');
const introScreenSkip = document.querySelector('#introScreenSkip');
const introScreenSound = document.querySelector('#introScreenSound');
const INTRO_SEEN_KEY = 'papa-johns-experience-kit-intro-seen';

function hasSeenIntro() {
  try {
    return window.localStorage.getItem(INTRO_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

function markIntroAsSeen() {
  try {
    window.localStorage.setItem(INTRO_SEEN_KEY, 'true');
  } catch {
    // El intro sigue funcionando aunque el navegador bloquee localStorage.
  }
}

function dismissIntroScreen() {
  if (!introScreen || introScreen.classList.contains('is-hidden')) {
    return;
  }
  markIntroAsSeen();
  introVideo?.pause();
  introScreen.classList.add('is-hidden');
}

function playIntroVideo() {
  if (!introScreen || !introVideo) {
    return;
  }
  introScreen.classList.add('is-video-ready');
  introScreenSound?.setAttribute('aria-hidden', 'true');
  introVideo.currentTime = 0;
  introVideo.muted = false;
  introVideo.play().catch(() => {
    introScreen.classList.remove('is-video-ready');
    introScreenSound?.setAttribute('aria-hidden', 'false');
  });
}

function enableIntroSound() {
  playIntroVideo();
}

introScreenSkip?.addEventListener('click', dismissIntroScreen);
introScreenSound?.addEventListener('click', enableIntroSound);
introVideo?.addEventListener('ended', dismissIntroScreen);

if (hasSeenIntro()) {
  introScreen?.classList.add('is-hidden');
}

const journey = [
  {
    title: 'Preparación de campaña',
    type: 'operation',
    color: '#2d5d2a',
    story:
      'Antes de que los clientes lleguen, los equipos preparan la campaña: Comercial define productos, Arma tu Combo, precios, cupones, canales y reglas; Marketing publica la landing y prepara su descubrimiento orgánico.',
    expectation:
      'Mostrar cómo los equipos autorizados crean, actualizan y activan una campaña, y cómo se reflejan sus reglas en los canales de venta.',
    tag: 'Back Office'
  },
  {
    title: 'Entradas al ecosistema',
    type: 'customer',
    color: '#2d6cdf',
    story:
      'Cada fuente trae una intención distinta: debemos conservar el contexto de entrada y adaptar la experiencia desde el primer momento.',
    detail:
      'Nuestros clientes llegan con distintas intenciones y niveles de conocimiento de la marca. Aproximadamente el 40% del tráfico es directo, 35% proviene de Paid Media, 15% de orgánico y 10% de CRM. Esto significa que la experiencia no puede comenzar igual para todos. Un cliente directo probablemente ya conoce Papa Johns y puede venir con una intención de compra más clara; quien llega desde Paid debe mantener la promesa del anuncio y aterrizar en el producto, promoción u ocasión que originó el clic; el tráfico orgánico necesita continuidad entre su búsqueda y el contenido encontrado; y CRM debería aprovechar identificación, segmento, campaña y comportamiento previo para ofrecer una experiencia más personalizada.',
    expectation:
      'La nueva plataforma debe capturar y conservar el contexto de entrada end-to-end: fuente, campaña, anuncio, contenido, deep link, dispositivo, cliente identificado y canal de destino, incluso cuando el journey continúe entre Web y App. No queremos únicamente atribuir de dónde viene el cliente. Queremos que el ecommerce utilice esa señal para decidir qué mostrar, en qué orden y con qué mensaje, conservando la intención que originó la visita hasta la compra.',
    tag: 'Descubrimiento'
  },
  {
    title: 'Reconocimiento',
    type: 'customer',
    color: '#6654a5',
    story:
      'Al comenzar, la experiencia reconoce —cuando los datos disponibles lo permiten— si el cliente ya compra con Papa Johns o si está explorando por primera vez. Heavy user, Switcher y Non Buyer orientan la personalización, pero no son segmentos rígidos; Sofía es nuestra heavy user.',
    expectation:
      'Explicar qué datos y qué CRM o plataforma de personalización se usarían, cómo se obtiene el consentimiento y cómo la experiencia sigue funcionando si no es posible reconocer al cliente.',
    tag: 'Personalización'
  },
  {
    title: 'Selección de entrega',
    type: 'customer',
    color: '#e78a28',
    story:
      'El cliente decide cómo disfrutar su pedido: Delivery, Pick Up o comer en el comedor, según disponibilidad. La tienda, la cobertura, los horarios, la disponibilidad, el costo, el espacio y el tiempo estimado dependen de esa elección.',
    expectation:
      'Demostrar la validación de dirección, tienda y capacidad del comedor, y que al cambiar de modalidad se actualicen las condiciones del pedido sin borrar lo que el cliente ya avanzó.',
    tag: 'Contexto de compra'
  },
  {
    title: 'Exploración y personalización',
    type: 'customer',
    color: '#e21b2d',
    story:
      'Con el contexto de compra definido, el cliente explora el catálogo y arma su combo. Puede configurar una pizza por mitades y sumar acompañamientos, bebidas o postres; lo que ve debe corresponder a la disponibilidad y reglas vigentes.',
    expectation:
      'Recorrer el catálogo y la configuración de productos de punta a punta, incluyendo cómo se muestran precios, opciones, restricciones y productos no disponibles.',
    tag: 'Catálogo'
  },
  {
    title: 'Carro y beneficios',
    type: 'customer',
    color: '#6250a4',
    story:
      'Antes de pagar, el cliente revisa los productos, cantidades, precios y totales. Puede ingresar un cupón y usar Papa Puntos si corresponde. Si deja la compra, el carro puede recuperarse para que continúe sin reconstruirlo.',
    expectation:
      'Demostrar la validación de cupones y Papa Puntos, explicar incompatibilidades con claridad y mostrar cómo se conserva o recupera el carro.',
    tag: 'Conversión'
  },
  {
    title: 'Checkout y pago',
    type: 'customer',
    color: '#2d6cdf',
    story:
      'El cliente confirma sus datos, modalidad, dirección o tienda, horario, pedido y total. Luego selecciona un medio disponible —como Webpay, Mercado Pago, Fintoc, Pluxee o billeteras digitales— y completa el pago, incluido BIN o Gift Card cuando aplique.',
    expectation:
      'Mostrar el recorrido hasta la confirmación. Ante un rechazo o error, explicar cómo se informa al cliente, cómo puede reintentar y cómo se evita perder o duplicar la orden.',
    tag: 'Pago'
  },
  {
    title: 'Procesamiento y despacho',
    type: 'operation',
    color: '#2d5d2a',
    story:
      'Con el pago aprobado, la orden pasa por Ecommerce y la API Papa Johns hacia los sistemas de operación. La tienda la recibe para prepararla y, si es Delivery, se coordina el despacho; si es Pick Up, se gestiona el retiro. Los cambios de estado alimentan el seguimiento.',
    expectation:
      'Explicar y demostrar el recorrido de la orden entre Ecommerce, API Papa Johns, NCR Cloud Connect, tienda y despacho, incluyendo estados, reintentos y tratamiento de incidencias sin duplicar órdenes.',
    tag: 'Operación'
  },
  {
    title: 'Postventa y fidelización',
    type: 'operation',
    color: '#6654a5',
    story:
      'Durante y después de la entrega o el retiro, el cliente recibe confirmaciones y actualizaciones. La orden cerrada alimenta la acumulación de Papa Puntos; si surge un problema, SAC necesita contexto para brindar ayuda. La experiencia también puede activar NPS y comunicaciones postventa.',
    expectation:
      'Mostrar qué eventos recibe el cliente y qué información queda disponible para SAC, fidelización y medición postventa, incluyendo cómo se gestiona una orden con problemas.',
    tag: 'Relación'
  },
  {
    title: 'Recompra omnicanal',
    type: 'customer',
    color: '#2d5d2a',
    story:
      'En una próxima ocasión, el cliente puede volver desde el canal que prefiera. Si corresponde, encuentra sus pedidos anteriores, favoritos, direcciones y beneficios, y vuelve a comprar con precios, disponibilidad y condiciones actualizados.',
    expectation:
      'Demostrar cómo se facilita repetir una compra y cómo se mantiene la continuidad entre canales, sin asumir que el catálogo, los precios o la disponibilidad son siempre iguales.',
    tag: 'Futuro'
  }
];
window.journeySteps = journey;

const events = [
  {
    title: 'Tienda cerrada / fuera de horario',
    copy: 'El cliente quiere comprar, pero la tienda asignada ya cerró o no está disponible. Se debe informar el motivo y ofrecer otra tienda cercana, pedido futuro o cambio a Pick Up.',
    tags: ['Horario', 'Tienda', 'Alternativa']
  },
  {
    title: 'Promoción no disponible en la tienda',
    copy: 'El cliente llega desde una campaña o deep link, pero la promoción no aplica en su tienda, canal o modalidad. Se debe explicar la restricción y ofrecer una alternativa válida.',
    tags: ['Promociones', 'Deep link', 'Transparencia']
  },
  {
    title: 'Monto mínimo no cumplido para Delivery',
    copy: 'El carrito no alcanza el mínimo exigido para despacho. La experiencia debe mostrar el faltante exacto, sugerir productos para completarlo o permitir cambiar a Pick Up.',
    tags: ['Delivery', 'Carro', 'Conversión']
  },
  {
    title: 'Carrito expirado o con cambios',
    copy: 'El cliente vuelve a un carrito guardado y la promoción, el precio o la disponibilidad cambiaron. Se debe revalidar, mostrar las diferencias y permitir continuar.',
    tags: ['Carrito', 'Precios', 'Recuperación']
  },
  {
    title: 'Cambio de Delivery a Pick Up',
    copy: 'Al cambiar la modalidad, algunos precios, tiempos, productos o beneficios dejan de aplicar. El sistema debe recalcular e informar los cambios conservando el carrito.',
    tags: ['Omnicanal', 'Recalculo', 'Tienda']
  },
  {
    title: 'Ingrediente no disponible en la tienda',
    copy: 'No está agotado el producto completo, pero sí un ingrediente, borde, masa o complemento. Se debe bloquear solo la configuración afectada y ofrecer sustitutos válidos.',
    tags: ['Disponibilidad', 'Catálogo', 'Sustitución']
  },
  {
    title: 'Error en la personalización de la pizza',
    copy: 'El cliente intenta una configuración inválida: mitades incompatibles, ingrediente no permitido o borde no disponible. Las reglas deben validarse en tiempo real y guiarlo.',
    tags: ['Personalización', 'Reglas', 'Usabilidad']
  },
  {
    title: 'Papa Puntos no disponibles',
    copy: 'El cliente intenta usar puntos, pero no tiene saldo suficiente, el producto no participa o no hay stock para canje. Se debe explicar la causa y mostrar opciones sin romper el checkout.',
    tags: ['Loyalty', 'Papa Puntos', 'Checkout']
  },
  {
    title: 'Cupón vencido, usado o inválido',
    copy: 'El cupón existe, pero expiró, ya fue redimido o no cumple las reglas. El mensaje debe identificar la causa y sugerir otra alternativa si existe.',
    tags: ['Cupones', 'Reglas', 'Recuperación']
  },
  {
    title: 'Pago aprobado, orden no confirmada',
    copy: 'El pago fue aprobado, pero una caída o timeout impidió crear la orden. Se necesita conciliación, validación del estado y recuperación automática o asistida.',
    tags: ['Pagos', 'Conciliación', 'Confianza']
  },
  {
    title: 'Doble click / pedido duplicado',
    copy: 'Por lentitud o confusión, el cliente reintenta y genera dos pedidos. La plataforma debe prevenir duplicados con idempotencia y manejar la contingencia.',
    tags: ['Idempotencia', 'Peak', 'Órdenes']
  },
  {
    title: 'Medio de pago no disponible',
    copy: 'Un medio aplica solo a Web, Delivery, ciertas tiendas o modalidades. El checkout debe filtrar correctamente la disponibilidad y evitar un rechazo tardío.',
    tags: ['Pagos', 'BIN', 'Contexto']
  },
  {
    title: 'Fallo en login',
    copy: 'El cliente no puede identificarse durante el journey. Se debe permitir continuar como invitado, conservar el carrito y facilitar la recuperación posterior.',
    tags: ['Identidad', 'Carrito', 'Conversión']
  },
  {
    title: 'Deep link roto o promo mal direccionada',
    copy: 'El cliente llega desde un anuncio, email o push a una página incorrecta o sin la promoción esperada. Se debe ofrecer un fallback manteniendo la trazabilidad.',
    tags: ['Marketing', 'Deep link', 'Atribución']
  },
  {
    title: 'Tiempo prometido cambia durante la compra',
    copy: 'La promesa de entrega se alarga por congestión. El sistema debe recalcular el tiempo en tiempo real y transparentar el cambio antes del pago.',
    tags: ['Dynamic times', 'Delivery', 'Transparencia']
  },
  {
    title: 'Delivery saturado / sin repartidores',
    copy: 'Existe cobertura, pero la tienda no puede despachar por saturación o falta de capacidad. Se debe ofrecer Pick Up, otra tienda o pedido futuro.',
    tags: ['Capacidad', 'Última milla', 'Alternativa']
  },
  {
    title: 'Quiebre parcial del checkout',
    copy: 'Falla una parte del flujo, como despacho, BIN, loyalty o una promoción. Se necesita degradación controlada y continuidad del resto cuando sea posible.',
    tags: ['Resiliencia', 'Checkout', 'Degradación']
  },
  {
    title: 'Dirección ambigua o geolocalización incorrecta',
    copy: 'El sistema no ubica bien la dirección o asigna una tienda incorrecta. Debe permitir corrección manual, sugerir direcciones y validar la asignación de forma transparente.',
    tags: ['Geolocalización', 'Cobertura', 'Direcciones']
  },
  {
    title: 'Pedido futuro no disponible',
    copy: 'El cliente quiere agendar, pero la tienda, canal o producto no permite una orden futura. Se debe informar la restricción y ofrecer una franja válida o compra inmediata.',
    tags: ['Agendamiento', 'Horario', 'Alternativa']
  },
  {
    title: 'Servicio caído en peak / contingencia comercial',
    copy: 'Una alta demanda, Cyber o Día de la Pizza provoca lentitud o una caída parcial. La demo debe mostrar colas, reintentos, throttling, mensajes de contingencia y continuidad mínima.',
    tags: ['Peak', 'Continuidad', 'Observabilidad']
  }
];

const track = document.querySelector('#journeyTrack');
const controls = document.querySelectorAll('.control');

function renderJourney(filter = 'all') {
  track.innerHTML = journey
    .map(
      (step, index) => `
    <article class="journey-card ${filter !== 'all' && step.type !== filter ? 'hidden' : ''}" data-step="${String(index + 1).padStart(2, '0')}" data-type="${
        step.type
      }" style="--card-color:${step.color}">
      <h3>${step.title}</h3>
      <p class="journey-story">${step.story}</p>
      <button
        class="journey-detail-trigger"
        type="button"
        data-journey-detail="${index}"
        aria-label="Ver detalle de ${step.title}"
        aria-haspopup="dialog"
        aria-controls="journeyDetailDialog">
        Ver detalle <span aria-hidden="true">↗</span>
      </button>
      <span class="tag">${step.tag}</span>
    </article>`
    )
    .join('');
}

controls.forEach(control =>
  control.addEventListener('click', () => {
    controls.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-pressed', 'false');
    });
    control.classList.add('active');
    control.setAttribute('aria-pressed', 'true');
    renderJourney(control.dataset.filter);
  })
);

const eventList = document.querySelector('#eventList');
const eventDetail = document.querySelector('#eventDetail');
controls.forEach(control => control.setAttribute('aria-pressed', String(control.classList.contains('active'))));

const eventLayout = document.querySelector('.event-layout');
const eventMobile = window.matchMedia('(max-width: 900px)');
let selectedEvent = 0;
let mobileEventExpanded = true;

const eventScrollMore = document.querySelector('#eventScrollMore');

function updateEventScrollHint() {
  if (!eventList || !eventScrollMore) {
    return;
  }

  const hasMore = eventList.scrollHeight - eventList.clientHeight - eventList.scrollTop > 8;
  eventScrollMore.hidden = !hasMore;
  eventScrollMore.classList.toggle('is-ending', !hasMore);
}
function renderEvent(index = 0) {
  const event = events[index];
  eventDetail.classList.remove('is-visible');
  eventDetail.innerHTML = `<div class="eyebrow green">EVENTO DE DEMOSTRACIÓN</div><h3 id="eventDetailTitle">${event.title}</h3><p>${
    event.copy
  }</p><ul>${event.tags.map(tag => `<li>${tag}</li>`).join('')}</ul>`;

  requestAnimationFrame(() => {
    eventDetail.classList.add('is-visible');
  });

  selectedEvent = index;
  placeEventDetail();
}

eventList.innerHTML = events
  .map(
    (event, index) =>
      `<div class="event-item"><button class="event-button" type="button" data-event="${index}" aria-controls="eventDetail">${
        event.title
      } <span aria-hidden="true">→</span></button></div>`
  )
  .join('');
function placeEventDetail() {
  const buttons = eventList.querySelectorAll('.event-button');
  const expanded = !eventMobile.matches || mobileEventExpanded;
  buttons.forEach((button, index) => {
    const selected = index === selectedEvent;
    button.classList.toggle('active', selected && expanded);
    if (eventMobile.matches) {
      button.setAttribute('aria-expanded', String(selected && expanded));
      button.removeAttribute('aria-pressed');
    } else {
      button.setAttribute('aria-pressed', String(selected));
      button.removeAttribute('aria-expanded');
    }
  });
  eventDetail.hidden = !expanded;
  if (eventMobile.matches) {
    buttons[selectedEvent].parentElement.append(eventDetail);
  } else {
    eventLayout.append(eventDetail);
  }
}
eventMobile.addEventListener('change', () => {
  placeEventDetail();
  updateEventScrollHint();
});

eventList.addEventListener('click', event => {
  const button = event.target.closest('.event-button');
  if (button) {
    const index = Number(button.dataset.event);
    mobileEventExpanded = !eventMobile.matches || index !== selectedEvent || !mobileEventExpanded;
    renderEvent(index);
  }
});
eventList.addEventListener('scroll', updateEventScrollHint);
window.addEventListener('resize', updateEventScrollHint);

renderJourney();
updateEventScrollHint();
renderEvent();

const flowSteps = document.querySelectorAll('.digital-flow-step');
const flowTrack = document.querySelector('.digital-flow');
const flowPrev = document.querySelector('#flowPrev');
const flowNext = document.querySelector('#flowNext');
const flowPosition = document.querySelector('#flowPosition');

function updateFlowNavigation() {
  if (!flowTrack || !flowPrev || !flowNext) {
    return;
  }

  const maxScroll = flowTrack.scrollWidth - flowTrack.clientWidth;
  const atStart = flowTrack.scrollLeft <= 8;
  const atEnd = flowTrack.scrollLeft >= maxScroll - 8;
  flowPrev.disabled = atStart;
  flowNext.disabled = atEnd;
  flowPosition.textContent = atEnd
    ? '12 · último paso'
    : atStart
    ? '01 → 12 · desliza'
    : 'sigue explorando →';
}

flowSteps.forEach((step, index) => {
  step.setAttribute('tabindex', '0');
  step.setAttribute('role', 'button');
  step.setAttribute(
    'aria-label',
    `Explorar etapa ${index + 1}: ${step.querySelector('strong')?.textContent}`
  );
  step.addEventListener('click', () => {
    flowSteps.forEach(item => item.classList.remove('is-active'));
    step.classList.add('is-active');
    step.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    updateFlowNavigation();
  });
  step.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      step.click();
    }
  });
});
flowSteps[0]?.classList.add('is-active');
flowPrev?.addEventListener('click', () => {
  flowTrack?.scrollBy({ left: -(flowTrack.clientWidth * 0.82), behavior: 'smooth' });
});
flowNext?.addEventListener('click', () => {
  flowTrack?.scrollBy({ left: flowTrack.clientWidth * 0.82, behavior: 'smooth' });
});
flowTrack?.addEventListener('scroll', updateFlowNavigation, { passive: true });
window.addEventListener('resize', updateFlowNavigation);
updateFlowNavigation();

const sectionNav = document.querySelector('.section-nav');
const sectionNavToggle = document.querySelector('.section-nav-toggle');
const sectionNavLinks = Array.from(document.querySelectorAll('.section-nav a'));
const sectionNavCurrent = document.querySelector('#sectionNavCurrent');
const navSections = sectionNavLinks.map(link => document.querySelector(link.getAttribute('href')));

function closeSectionNav() {
  sectionNav.classList.remove('is-open');
  sectionNavToggle.setAttribute('aria-expanded', 'false');
}
sectionNavToggle.addEventListener('click', () => {
  const open = sectionNavToggle.getAttribute('aria-expanded') !== 'true';
  sectionNav.classList.toggle('is-open', open);
  sectionNavToggle.setAttribute('aria-expanded', String(open));
});
sectionNavLinks.forEach(link => link.addEventListener('click', closeSectionNav));
sectionNav.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeSectionNav();
    sectionNavToggle.focus();
  }
});
document.addEventListener('click', event => {
  if (!sectionNav.contains(event.target)) closeSectionNav();
});
function updateSectionNav() {
  const offset = sectionNav.offsetHeight + 32;
  let activeIndex = 0;
  navSections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= offset) activeIndex = index;
  });
  sectionNavLinks.forEach((link, index) => {
    if (index === activeIndex) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  sectionNavCurrent.textContent = sectionNavLinks[activeIndex].textContent.trim();
}
let sectionNavFrame = null;
window.addEventListener('scroll', () => {
  if (sectionNavFrame !== null) return;
  sectionNavFrame = requestAnimationFrame(() => {
    updateSectionNav();
    sectionNavFrame = null;
  });
}, { passive: true });
window.addEventListener('resize', updateSectionNav);
updateSectionNav();
