<template>
  <AppLayout>
    <section class="about-page">
      <header class="about-hero">
        <div class="about-hero__copy">
          <span class="about-eyebrow">LowCortisol</span>
          <h1>Acerca de la plataforma</h1>
          <p>
            LowCortisol es una plataforma operativa para controlar consumo de agua y gas,
            administrar sedes, operar dispositivos, detectar riesgos y responder a incidentes.
          </p>

          <div class="about-hero__tags">
            <span>Agua</span>
            <span>Gas</span>
            <span>Monitoreo</span>
            <span>Operaciones</span>
          </div>
        </div>

        <aside class="about-hero__panel">
          <span class="panel-label">Version funcional</span>
          <strong>VS1 - VS5</strong>
          <p>
            Modelo fisico, monitoreo, alertas, persistencia operativa y mitigacion
            con valvulas conectadas.
          </p>
        </aside>
      </header>

      <section class="about-metrics" aria-label="Resumen de producto">
        <article v-for="metric in metrics" :key="metric.label" class="about-metric">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <small>{{ metric.description }}</small>
        </article>
      </section>

      <section class="about-grid about-grid--main">
        <UiCard title="Que resuelve">
          <div class="about-list">
            <p>
              Centraliza sedes, habitaciones, grupos, sensores, valvulas y conductos para
              entender donde se genera consumo.
            </p>
            <p>
              Convierte lecturas de consumo en alertas, incidentes y acciones operativas
              cuando una situacion supera los limites definidos.
            </p>
            <p>
              Permite controlar el flujo desde valvulas y conductos, dejando trazabilidad
              para reportes y soporte.
            </p>
          </div>
        </UiCard>

        <UiCard title="Flujo operativo">
          <ol class="about-flow">
            <li v-for="step in flowSteps" :key="step.title">
              <span>{{ step.index }}</span>
              <div>
                <strong>{{ step.title }}</strong>
                <p>{{ step.description }}</p>
              </div>
            </li>
          </ol>
        </UiCard>
      </section>

      <section class="about-section">
        <div class="about-section__header">
          <span class="about-eyebrow">Modulos</span>
          <h2>Superficies principales</h2>
          <p>
            Cada seccion tiene una responsabilidad concreta dentro de la operacion diaria.
          </p>
        </div>

        <div class="module-grid">
          <article v-for="module in modules" :key="module.title" class="module-card">
            <span>{{ module.code }}</span>
            <h3>{{ module.title }}</h3>
            <p>{{ module.description }}</p>
          </article>
        </div>
      </section>

      <section class="about-grid">
        <UiCard title="Arquitectura del frontend">
          <div class="architecture-stack">
            <div v-for="layer in layers" :key="layer.name">
              <strong>{{ layer.name }}</strong>
              <p>{{ layer.description }}</p>
            </div>
          </div>
        </UiCard>

        <UiCard title="Bounded contexts">
          <div class="context-chip-grid">
            <span v-for="context in boundedContexts" :key="context">
              {{ context }}
            </span>
          </div>
        </UiCard>
      </section>

      <section class="about-section">
        <div class="about-section__header">
          <span class="about-eyebrow">Estado</span>
          <h2>Capacidades actuales</h2>
        </div>

        <div class="status-grid">
          <article v-for="item in statusItems" :key="item.title" class="status-card">
            <span :class="['status-dot', 'status-dot--' + item.tone]"></span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </article>
        </div>
      </section>
    </section>
  </AppLayout>
</template>

<script setup>
import AppLayout from "../../components/app-layout/app-layout.component.vue";
import UiCard from "../../components/ui-card/ui-card.component.vue";

const metrics = [
  {
    label: "Producto",
    value: "8 modulos",
    description: "Panel, ubicacion, dispositivos, conductos, alertas, reportes, planes y soporte.",
  },
  {
    label: "Control",
    value: "Agua y gas",
    description: "Recursos operativos con sensores, valvulas y conductos.",
  },
  {
    label: "Operacion",
    value: "Tiempo real",
    description: "Consumo calculado por apertura de valvula y flujo del conducto.",
  },
  {
    label: "Modelo",
    value: "DDD",
    description: "Frontend modular por contextos y capas.",
  },
];

const flowSteps = [
  {
    index: "01",
    title: "Ubicacion",
    description: "Se registran sedes, habitaciones y grupos para ordenar la estructura fisica.",
  },
  {
    index: "02",
    title: "Dispositivos",
    description: "Se agregan sensores y valvulas, respetando el recurso y el estado de la sede.",
  },
  {
    index: "03",
    title: "Conductos",
    description: "Cada conducto se vincula a una valvula libre y consume segun su flujo configurado.",
  },
  {
    index: "04",
    title: "Monitoreo",
    description: "Las lecturas alimentan el panel, limites, anomalias, alertas y reportes.",
  },
  {
    index: "05",
    title: "Respuesta",
    description: "Las alertas generan incidentes y acciones de mitigacion cuando existe riesgo.",
  },
];

const modules = [
  {
    code: "P",
    title: "Panel",
    description: "Vista general del consumo, limites, anomalias y mediciones en tiempo real.",
  },
  {
    code: "U",
    title: "Ubicacion",
    description: "Organizacion de sedes, habitaciones y grupos fisicos.",
  },
  {
    code: "D",
    title: "Dispositivos",
    description: "Operacion de sensores y valvulas asociadas a cada grupo.",
  },
  {
    code: "C",
    title: "Conductos",
    description: "Salidas finales que generan consumo controlado por valvulas.",
  },
  {
    code: "!",
    title: "Alertas",
    description: "Centro de respuesta para alertas criticas, incidentes y canales internos.",
  },
  {
    code: "R",
    title: "Reportes",
    description: "Analisis de consumo por periodo, recurso y lecturas base.",
  },
  {
    code: "S",
    title: "Soporte",
    description: "Tickets, agentes y articulos de ayuda para resolver problemas operativos.",
  },
  {
    code: "PL",
    title: "Planes",
    description: "Capacidad comercial que limita sedes y dispositivos disponibles.",
  },
];

const layers = [
  {
    name: "Domain",
    description: "Entidades, reglas y lenguaje del negocio sin Vue ni HTTP.",
  },
  {
    name: "Application",
    description: "Stores, facades y casos de uso que coordinan las acciones.",
  },
  {
    name: "Infrastructure",
    description: "Servicios API, fallback local, resources, responses y assemblers.",
  },
  {
    name: "Presentation",
    description: "Paginas, componentes, modales y navegacion de usuario.",
  },
];

const boundedContexts = [
  "Iam",
  "Workplace",
  "DeviceControl",
  "Monitoring",
  "Notification",
  "Plan",
  "Support",
  "Shared",
];

const statusItems = [
  {
    title: "Modelo fisico operativo",
    description: "Sedes, habitaciones, grupos, sensores, valvulas y conductos conectados.",
    tone: "success",
  },
  {
    title: "Consumo y alertas",
    description: "Lecturas, limites, anomalias, alertas e incidentes preparados para operacion.",
    tone: "success",
  },
  {
    title: "Planes con limites",
    description: "Los planes condicionan la cantidad de sedes y dispositivos que puede crear el usuario.",
    tone: "success",
  },
  {
    title: "Siguientes mejoras",
    description: "Entrega externa de notificaciones, pruebas automatizadas y reportes mas ejecutivos.",
    tone: "warning",
  },
];
</script>

<style scoped>
.about-page {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  gap: 28px;
}

.about-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.55fr);
  gap: 24px;
  align-items: stretch;
}

.about-hero__copy,
.about-hero__panel,
.about-metric,
.module-card,
.status-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.about-hero__copy {
  display: grid;
  align-content: center;
  gap: 18px;
  min-height: 320px;
  padding: 36px;
}

.about-eyebrow,
.panel-label {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.about-hero h1 {
  color: var(--color-text);
  font-size: clamp(2.25rem, 6vw, 4.2rem);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 0.95;
  margin: 0;
}

.about-hero p,
.about-section__header p,
.about-list p,
.about-flow p,
.module-card p,
.architecture-stack p,
.status-card p {
  color: var(--color-text-muted);
  line-height: 1.55;
  margin: 0;
}

.about-hero__copy > p {
  max-width: 760px;
  font-size: 17px;
}

.about-hero__tags,
.context-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.about-hero__tags span,
.context-chip-grid span {
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-pill);
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 900;
}

.about-hero__panel {
  display: grid;
  align-content: end;
  gap: 12px;
  padding: 28px;
  background:
      linear-gradient(145deg, rgba(47, 128, 237, 0.12), rgba(255, 255, 255, 0.9)),
      #ffffff;
}

.about-hero__panel strong {
  color: var(--color-text);
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
}

.about-metrics,
.module-grid,
.status-grid {
  display: grid;
  gap: 18px;
}

.about-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.about-metric {
  display: grid;
  gap: 8px;
  min-height: 150px;
  padding: 22px;
}

.about-metric span,
.about-metric small {
  color: var(--color-text-muted);
  font-weight: 800;
}

.about-metric strong {
  color: var(--color-text);
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.about-grid--main :deep(.ui-card) {
  min-height: 100%;
}

.about-list,
.architecture-stack {
  display: grid;
  gap: 16px;
}

.about-flow {
  display: grid;
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.about-flow li {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
}

.about-flow li > span {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
}

.about-flow strong,
.architecture-stack strong,
.module-card h3,
.status-card h3 {
  color: var(--color-text);
  font-weight: 900;
}

.about-flow strong {
  display: block;
  margin-bottom: 4px;
}

.about-section {
  display: grid;
  gap: 18px;
}

.about-section__header {
  display: grid;
  gap: 8px;
}

.about-section__header h2 {
  color: var(--color-text);
  font-size: 28px;
  font-weight: 900;
  margin: 0;
}

.module-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.module-card {
  display: grid;
  gap: 10px;
  min-height: 190px;
  padding: 22px;
}

.module-card > span {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-pill);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 13px;
  font-weight: 900;
}

.module-card h3,
.status-card h3 {
  font-size: 18px;
  margin: 0;
}

.architecture-stack > div {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.architecture-stack > div:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.context-chip-grid span {
  background: #ffffff;
}

.status-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.status-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 14px;
  padding: 22px;
}

.status-dot {
  width: 14px;
  height: 14px;
  border-radius: var(--radius-pill);
  margin-top: 4px;
}

.status-dot--success {
  background: var(--color-success);
  box-shadow: 0 0 0 6px rgba(22, 163, 74, 0.12);
}

.status-dot--warning {
  background: #f59e0b;
  box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.15);
}

@media (max-width: 1100px) {
  .about-hero,
  .about-grid,
  .status-grid {
    grid-template-columns: 1fr;
  }

  .about-metrics,
  .module-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .about-page {
    width: min(100% - 20px, 1180px);
  }

  .about-hero__copy,
  .about-hero__panel {
    padding: 24px;
  }

  .about-metrics,
  .module-grid {
    grid-template-columns: 1fr;
  }
}
</style>