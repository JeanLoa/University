
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
});


const benefitsSlider = document.querySelector(".benefits-grid");
const benefitsCards = document.querySelectorAll(".benefit-card");
const benefitsDots = document.querySelectorAll(".benefits-dots .dot");

if (benefitsSlider && benefitsDots.length > 0) {
  function updateBenefitsDots() {
    const center = benefitsSlider.scrollLeft + benefitsSlider.offsetWidth / 2;

    let activeIndex = 0;
    let minDistance = Infinity;

    benefitsCards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    benefitsDots.forEach(dot => dot.classList.remove("active"));

    if (benefitsDots[activeIndex]) {
      benefitsDots[activeIndex].classList.add("active");
    }
  }

  benefitsSlider.addEventListener("scroll", updateBenefitsDots);

  benefitsDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      benefitsCards[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
    });
  });

  updateBenefitsDots();
}


document.querySelectorAll('.slider-dots').forEach(dotsContainer => {

  const sliderId = dotsContainer.getAttribute('data-slider');
  const slider = document.getElementById(sliderId);

  if (!slider) return;

  const cards = slider.querySelectorAll('.plan-card');
  const dots = dotsContainer.querySelectorAll('.dot');

  function updateDots() {
    const center = slider.scrollLeft + slider.offsetWidth / 2;

    let activeIndex = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(center - cardCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[activeIndex]) {
      dots[activeIndex].classList.add('active');
    }
  }

  // 👆 detecta scroll (swipe)
  slider.addEventListener('scroll', updateDots);

  // 👇 click en puntitos
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        inline: 'center'
      });
    });
  });

  // inicial
  updateDots();
});



 const langBtns = document.querySelectorAll(".lang-toggle");
let currentLang = localStorage.getItem("lang") || "es";

const translations = {
es: {
  // NAV
  "nav.home": "Inicio",
  "nav.benefits": "Beneficio",
  "nav.features": "Funcionalidades",
  "nav.about": "Quienes Somos",
  "nav.plans": "Planes",
  "nav.contact": "Contacto",
  "nav.login": "Iniciar Sesion",

  // HOME
  "home.title": "Low cortisol",

  "home.subtitle": `Controla tus recursos,
<span>previene fugas</span>`,

  "home.description": `Monitoreo operativo de agua y gas para sedes, habitaciones,
conductos, sensores y válvulas, con alertas, incidentes y reportes de consumo.`,

  "home.primaryButton": "Ver Planes",
  "home.secondaryButton": "Solicitar Demo",

  // BENEFITS
  "benefits.badge": "Beneficios",

  "benefits.title": `¿Por qué elegir LowCortisol?`,

  "benefits.description": `Una plataforma operativa para organizar sedes, medir consumo y responder ante riesgos de agua y gas`,

  "benefits.card1.title": "Respuesta ante riesgos",

  "benefits.card1.text": `Convierte lecturas críticas en alertas e incidentes para que el equipo pueda actuar,
registrar acciones y cerrar el ciclo operativo.`,

  "benefits.card2.title": "Ahorro operativo",

  "benefits.card2.text": `Compara lecturas contra límites de consumo, revisa tendencias y encuentra oportunidades
para reducir desperdicio de agua y gas.`,

  "benefits.card3.title": "Control por ubicación",

  "benefits.card3.text": `Ordena sedes, habitaciones y grupos, y vincula sensores, válvulas y conductos
para entender dónde se origina cada consumo.`,

  // FEATURES
  "features.badge": "Funcionalidades",

  "features.title": `Funcionalidades diseñadas para una operación conectada`,

  "features.description": `Nuestra plataforma conecta ubicación, dispositivos, conductos, límites, alertas
e incidentes para administrar el consumo de agua y gas con información accionable.`,

  "features.card1.title": "Panel de monitoreo",
  "features.card1.text": `Visualiza el consumo acumulado de agua y gas desde conductos activos.`,
  "features.card1.item1": "Resumen de lecturas por recurso",
  "features.card1.item2": "Gráficos de consumo por agua o gas",
  "features.card1.item3": "Indicadores de límites y anomalías",

  "features.card2.title": "Alertas e incidentes",
  "features.card2.text": `Gestiona alertas críticas y coordina incidentes desde una consola operativa.`,
  "features.card2.item1": "Reconocimiento y cierre de alertas",
  "features.card2.item2": "Creación de incidentes desde una alerta",
  "features.card2.item3": "Registro de acciones de mitigación",

  "features.card3.title": "Reportes de consumo",
  "features.card3.text": `Genera reportes por periodo y recurso usando las lecturas registradas.`,
  "features.card3.item1": "Rangos de fecha controlados",
  "features.card3.item2": "Consumo total por agua o gas",
  "features.card3.item3": "Detalle de lecturas base",

  "features.card4.title": "Límites y anomalías",
  "features.card4.text": `Define límites de consumo para clasificar lecturas normales, advertencias y eventos críticos.`,
  "features.card4.item1": "Umbrales por recurso",
  "features.card4.item2": "Anomalías abiertas y críticas",
  "features.card4.item3": "Ciclo de riesgo trazable",

  "features.card5.title": "Dispositivos conectados",
  "features.card5.text": `Administra sensores, válvulas y conductos dentro de cada ubicación.`,
  "features.card5.item1": "Sedes, habitaciones y grupos",
  "features.card5.item2": "Válvulas asociadas a sensores",
  "features.card5.item3": "Conductos vinculados a una válvula libre",

  "features.card6.title": "Ahorro y soporte",
  "features.card6.text": `Revisa ahorro operativo y solicita ayuda cuando una incidencia necesite seguimiento.`,
  "features.card6.item1": "Insights de ahorro",
  "features.card6.item2": "Tickets de soporte",
  "features.card6.item3": "Artículos de ayuda",

  // ABOUT
  "about.badge": "Quiénes Somos",

  "about.title": "LowCortisol: Innovación en Monitoreo IoT",

  "about.description": `Transformamos la gestión de recursos hídricos y energéticos con tecnología de
vanguardia`,

  "about.vision.title": "Nuestra Visión",

  "about.vision.text": `Convertirnos en el líder global de soluciones IoT para la gestión inteligente de recursos, empoderando a hogares y empresas con tecnología accesible que previene desperdicios, protege infraestructuras y contribuye a un futuro sostenible.`,

  "about.mission.title": "Nuestra Misión",

  "about.mission.text": `Proporcionar sistemas de monitoreo IoT en tiempo real que detectan y previenen fugas de agua y gas, optimizando el consumo, reduciendo costos operativos y garantizando la seguridad mediante tecnología inteligente, accesible y escalable para todos nuestros clientes.`,

  "about.why.title": "¿Por qué LowCortisol?",

  "about.why.text": `Nuestro nombre refleja nuestro compromiso: reducir el estrés operativo asociado a recursos críticos. Con sedes organizadas, lecturas, límites, alertas e incidentes, convertimos el consumo de agua y gas en decisiones claras.`,

// SOLUTIONS
"solutions.title": "Soluciones para Todos",

"solutions.subtitle": "Adaptado a tus necesidades",

"solutions.description": `Ya sea que gestiones una sede pequeña o una operación con varias ubicaciones, LowCortisol se adapta al nivel de control que necesitas.`,

"solutions.residential.title": "Usuarios Residenciales",

"solutions.residential.subtitle": `Monitoreo inicial para una sede.`,

"solutions.residential.text": `Solución diseñada para empezar a medir agua y gas, registrar lecturas, revisar límites y atender alertas operativas sin complejidad innecesaria.`,

"solutions.residential.item1": "Una sede con hasta cinco dispositivos",
"solutions.residential.item2": "Monitoreo de agua y gas",
"solutions.residential.item3": "Alertas operativas",
"solutions.residential.item4": "Soporte por ticket",
"solutions.residential.item5": "Panel simple para revisar consumo",

"solutions.business.title": "Profesionales de Infraestructura",

"solutions.business.subtitle": `Gestión operativa centralizada y eficiente`,

"solutions.business.text": `Para administradores, jefes de mantenimiento y operadores que requieren seguimiento por sede, dispositivos conectados, reportes de consumo y respuesta coordinada ante incidentes.`,

"solutions.business.item1": "Gestión multi sede",
"solutions.business.item2": "Dispositivos, sensores, válvulas y conductos",
"solutions.business.item3": "Alertas prioritarias e incidentes",
"solutions.business.item4": "Reportes de consumo por periodo",
"solutions.business.item5": "Canales de alerta configurables",

"solutions.button": "Solicita Información",



// PLANS
"plans.badge": "Planes y Precios · Suscripción Mensual",

"plans.title": "Elige el plan perfecto para ti",

"plans.description": `Servicio por suscripción con facturación mensual. Sin compromisos a largo plazo.
Cancela cuando quieras.`,

"plans.month": "mensual",
"plans.popular": "Recomendado",
"plans.buy": "Comprar plan",

"plans.basic.title": "Essential",
"plans.basic.subtitle": "Para monitoreo inicial de una sede.",
"plans.basic.capacity": "1 sede(s) · 5 dispositivo(s)",

"plans.pro.title": "Professional",
"plans.pro.subtitle": "Para equipos que operan varias sedes.",
"plans.pro.capacity": "5 sede(s) · 35 dispositivo(s)",

"plans.businessPlan.title": "Enterprise",
"plans.businessPlan.subtitle": "Para operaciones con alta criticidad.",
"plans.businessPlan.capacity": "25 sede(s) · 250 dispositivo(s)",

"plans.feature.basicMonitoring": "Monitoreo de agua y gas",
"plans.feature.essentialAlerts": "Alertas operativas",
"plans.feature.ticketSupport": "Soporte por ticket",
"plans.feature.expandedSitesDevices": "Sedes y dispositivos ampliados",
"plans.feature.consumptionReports": "Reportes de consumo",
"plans.feature.configurableAlertChannels": "Canales de alerta configurables",
"plans.feature.multiSiteOperation": "Operación multi sede",
"plans.feature.priorityAlerts": "Alertas prioritarias",
"plans.feature.advancedOperationalSupport": "Soporte operativo avanzado",


// CONTACT
"contact.badge": "Contacto",

"contact.title": `Comienza a monitorear tus recursos hoy`,

"contact.description": `Agenda una demo personalizada y descubre cómo LowCortisol puede ayudarte
a prevenir fugas, ahorrar costos y mejorar la seguridad`,

"contact.questions": "¿Tienes preguntas?",

"contact.text": `Contáctanos y descubre cómo LowCortisol puede transformar la gestión
de tus recursos.`,

"contact.email": "Email",
"contact.phone": "Teléfono",
"contact.schedule": "Lun - Vie: 9:00 - 18:00",
"contact.office": "Oficina",

// FORM
"form.name": "Nombre Completo *",
"form.email": "Email *",
"form.clientType": "Tipo de cliente *",
"form.selectOption": "Selecciona una opción",
"form.residential": "Personas Residencial",
"form.infrastructure": "Profesionales de Infraestructura",
"form.message": "Mensaje *",
"form.submit": "ENVIAR MENSAJE",

"form.namePlaceholder": "Escribe tu nombre",
"form.emailPlaceholder": "ejemplo@gmail.com",
"form.messagePlaceholder": "Cuéntanos más",

// FOOTER
"footer.description": `Monitoreo inteligente para prevenir fugas y optimizar recursos.`,

"footer.home": "Inicio",
"footer.features": "Funcionalidades",
"footer.plans": "Planes",
"footer.contact": "Contacto",

"footer.copy": `© 2026 LowCortisol. Todos los derechos reservados.`


},

en: {
  // NAV
  "nav.home": "Home",
  "nav.benefits": "Benefits",
  "nav.features": "Features",
  "nav.about": "About Us",
  "nav.plans": "Plans",
  "nav.contact": "Contact",
  "nav.login": "Log In",

  // HOME
  "home.title": "Low cortisol",

  "home.subtitle": `Control your resources,
<span>prevent leaks</span>`,

  "home.description": `Operational monitoring for water and gas across sites, rooms,
conducts, sensors, and valves, with alerts, incidents, and consumption reports.`,

  "home.primaryButton": "View Plans",
  "home.secondaryButton": "Request Demo",


"benefits.badge": "Benefits",

"benefits.title": `Why choose LowCortisol?`,

"benefits.description": `An operations platform to organize sites, measure consumption, and respond to water and gas risks`,

// CARD 1
"benefits.card1.title": "Risk response",

"benefits.card1.text": `Turn critical readings into alerts and incidents so teams can act,
record actions, and close the operational cycle.`,

// CARD 2
"benefits.card2.title": "Operational savings",

"benefits.card2.text": `Compare readings against consumption limits, review trends, and find opportunities
to reduce water and gas waste.`,

// CARD 3
"benefits.card3.title": "Location-based control",

"benefits.card3.text": `Organize sites, rooms, and groups, then link sensors, valves, and conducts
to understand where each consumption point starts.`,

// FEATURES
"features.badge": "Features",

"features.title": `Features designed for connected operations`,

"features.description": `Our platform connects location, devices, conducts, limits, alerts,
and incidents to manage water and gas consumption with actionable information.`,

// CARD 1
"features.card1.title": "Monitoring dashboard",

"features.card1.text": `View accumulated water and gas consumption from active conducts.`,

"features.card1.item1": "Reading summaries by resource",
"features.card1.item2": "Charts for water or gas",
"features.card1.item3": "Limit and anomaly indicators",

// CARD 2
"features.card2.title": "Alerts and incidents",

"features.card2.text": `Manage critical alerts and coordinate incidents from an operations console.`,

"features.card2.item1": "Alert acknowledgement and closure",
"features.card2.item2": "Incident creation from alerts",
"features.card2.item3": "Mitigation action records",

// CARD 3
"features.card3.title": "Consumption reports",

"features.card3.text": `Generate reports by period and resource using registered readings.`,

"features.card3.item1": "Controlled date ranges",
"features.card3.item2": "Total consumption by water or gas",
"features.card3.item3": "Base reading detail",

// CARD 4
"features.card4.title": "Limits and anomalies",

"features.card4.text": `Define consumption limits to classify normal readings, warnings, and critical events.`,

"features.card4.item1": "Resource thresholds",
"features.card4.item2": "Open and critical anomalies",
"features.card4.item3": "Traceable risk cycle",

// CARD 5
"features.card5.title": "Connected devices",

"features.card5.text": `Manage sensors, valves, and conducts within each location.`,

"features.card5.item1": "Sites, rooms, and groups",
"features.card5.item2": "Valves linked to sensors",
"features.card5.item3": "Conducts linked to one free valve",

// CARD 6
"features.card6.title": "Savings and support",

"features.card6.text": `Review operational savings and request help when an incident needs follow-up.`,

"features.card6.item1": "Savings insights",
"features.card6.item2": "Support tickets",
"features.card6.item3": "Knowledge articles",

// ABOUT
"about.badge": "About Us",

"about.title": "LowCortisol: Innovation in IoT Monitoring",

"about.description": `We transform water and energy resource management with cutting-edge technology`,

// VISION
"about.vision.title": "Our Vision",

"about.vision.text": `To become the global leader in IoT solutions for intelligent resource management, empowering homes and businesses with accessible technology that prevents waste, protects infrastructure, and contributes to a sustainable future.`,

// MISSION
"about.mission.title": "Our Mission",

"about.mission.text": `To provide real-time IoT monitoring systems that detect and prevent water and gas leaks, optimizing consumption, reducing operational costs, and ensuring safety through intelligent, accessible, and scalable technology for all our clients.`,

// WHY
"about.why.title": "Why LowCortisol?",

"about.why.text": `Our name reflects our commitment: reducing the operational stress around critical resources. With organized sites, readings, limits, alerts, and incidents, we turn water and gas consumption into clear decisions.`,

// SOLUTIONS
"solutions.title": "Solutions for Everyone",

"solutions.subtitle": "Adapted to your needs",

"solutions.description": `Whether you manage a small site or an operation with multiple locations, LowCortisol adapts to the level of control you need.`,

// RESIDENTIAL
"solutions.residential.title": "Residential Users",

"solutions.residential.subtitle": `Initial monitoring for one site.`,

"solutions.residential.text": `Designed to start measuring water and gas, register readings, review limits, and handle operational alerts without unnecessary complexity.`,

"solutions.residential.item1": "One site with up to five devices",
"solutions.residential.item2": "Water and gas monitoring",
"solutions.residential.item3": "Operational alerts",
"solutions.residential.item4": "Support by ticket",
"solutions.residential.item5": "Simple dashboard for consumption review",

// BUSINESS
"solutions.business.title": "Infrastructure Professionals",

"solutions.business.subtitle": `Centralized and efficient operational management`,

"solutions.business.text": `For administrators, maintenance managers, and operators who need site tracking, connected devices, consumption reports, and coordinated incident response.`,

"solutions.business.item1": "Multi-site operation",
"solutions.business.item2": "Devices, sensors, valves, and conducts",
"solutions.business.item3": "Priority alerts and incidents",
"solutions.business.item4": "Consumption reports by period",
"solutions.business.item5": "Configurable alert channels",

// BUTTON
"solutions.button": "Request Information",

// PLANS
"plans.badge": "Plans & Pricing · Monthly Subscription",

"plans.title": "Choose the perfect plan for you",

"plans.description": `Subscription-based service with monthly billing. No long-term commitments.
Cancel anytime.`,

"plans.month": "monthly",
"plans.popular": "Recommended",
"plans.buy": "Buy plan",

"plans.basic.title": "Essential",
"plans.basic.subtitle": "For initial monitoring of one site.",
"plans.basic.capacity": "1 site(s) · 5 device(s)",

"plans.pro.title": "Professional",
"plans.pro.subtitle": "For teams operating several sites.",
"plans.pro.capacity": "5 site(s) · 35 device(s)",

"plans.businessPlan.title": "Enterprise",
"plans.businessPlan.subtitle": "For high-criticality operations.",
"plans.businessPlan.capacity": "25 site(s) · 250 device(s)",

"plans.feature.basicMonitoring": "Water and gas monitoring",
"plans.feature.essentialAlerts": "Operational alerts",
"plans.feature.ticketSupport": "Support by ticket",
"plans.feature.expandedSitesDevices": "Expanded sites and devices",
"plans.feature.consumptionReports": "Consumption reports",
"plans.feature.configurableAlertChannels": "Configurable alert channels",
"plans.feature.multiSiteOperation": "Multi-site operation",
"plans.feature.priorityAlerts": "Priority alerts",
"plans.feature.advancedOperationalSupport": "Advanced operational support",

// CONTACT
"contact.badge": "Contact",

"contact.title": `Start monitoring your resources today`,

"contact.description": `Schedule a personalized demo and discover how LowCortisol can help you
prevent leaks, reduce costs, and improve safety`,

"contact.questions": "Do you have questions?",

"contact.text": `Contact us and discover how LowCortisol can transform
your resource management.`,

"contact.email": "Email",
"contact.phone": "Phone",
"contact.schedule": "Mon - Fri: 9:00 - 18:00",
"contact.office": "Office",

// FORM
"form.name": "Full Name *",
"form.email": "Email *",
"form.clientType": "Client Type *",
"form.selectOption": "Select an option",
"form.residential": "Residential Users",
"form.infrastructure": "Infrastructure Professionals",
"form.message": "Message *",
"form.submit": "SEND MESSAGE",

"form.namePlaceholder": "Enter your name",
"form.emailPlaceholder": "example@gmail.com",
"form.messagePlaceholder": "Tell us more",

// FOOTER
"footer.description": `Smart monitoring to prevent leaks and optimize resources.`,

"footer.home": "Home",
"footer.features": "Features",
"footer.plans": "Plans",
"footer.contact": "Contact",

"footer.copy": `© 2026 LowCortisol. All rights reserved.`


}


};


function changeLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);
  currentLang = lang;

  langBtns.forEach(btn => {
    btn.textContent = lang === "es" ? "EN" : "ES";
  });
}

changeLanguage(currentLang);

langBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    changeLanguage(currentLang === "es" ? "en" : "es");
  });
});


const WEBAPP_REGISTER_URL = "https://lowcortisol-webapp.onrender.com/register";

const paymentModal = document.getElementById("payment-modal");
const paymentForm = document.getElementById("payment-form");
const paymentPlanName = document.getElementById("payment-plan-name");
const paymentPlanPrice = document.getElementById("payment-plan-price");

const cardNumberInput = document.getElementById("card-number");
const cardExpirationInput = document.getElementById("card-expiration");
const cardCvvInput = document.getElementById("card-cvv");

let selectedLandingPlan = null;

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatCardNumber(value) {
  return onlyNumbers(value)
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpirationDate(value) {
  const numbers = onlyNumbers(value).slice(0, 4);

  if (numbers.length <= 2) {
    return numbers;
  }

  return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
}

function openPaymentModal(plan) {
  selectedLandingPlan = plan;

  paymentPlanName.textContent = plan.name;
  paymentPlanPrice.textContent = `S/ ${Number(plan.price).toFixed(2)}`;

  paymentModal.classList.add("is-open");
  paymentModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("payment-open");
}

function closePaymentModal() {
  paymentModal.classList.remove("is-open");
  paymentModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("payment-open");
  paymentForm.reset();
}

document.querySelectorAll(".plan-buy-button").forEach((button) => {
  button.addEventListener("click", () => {
    openPaymentModal({
      id: button.dataset.planId,
      code: button.dataset.planCode,
      name: button.dataset.planName,
      price: button.dataset.planPrice,
    });
  });
});

document.querySelectorAll("[data-close-payment]").forEach((button) => {
  button.addEventListener("click", closePaymentModal);
});

cardNumberInput.addEventListener("input", (event) => {
  event.target.value = formatCardNumber(event.target.value);
});

cardExpirationInput.addEventListener("input", (event) => {
  event.target.value = formatExpirationDate(event.target.value);
});

cardCvvInput.addEventListener("input", (event) => {
  event.target.value = onlyNumbers(event.target.value).slice(0, 3);
});

paymentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!selectedLandingPlan) {
    return;
  }

  const params = new URLSearchParams({
    plan: selectedLandingPlan.id,
    code: selectedLandingPlan.code,
    checkout: "paid",
    paymentMethod: "card",
  });

  window.location.href = `${WEBAPP_REGISTER_URL}?${params.toString()}`;
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && paymentModal.classList.contains("is-open")) {
    closePaymentModal();
  }
});
