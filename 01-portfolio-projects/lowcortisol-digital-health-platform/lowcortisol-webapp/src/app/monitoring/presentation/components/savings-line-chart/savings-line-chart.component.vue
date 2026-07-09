<template>
  <UiCard
      title="Consumo en tiempo real"
      subtitle="Lecturas acumuladas desde conductos activos, calculadas por apertura de valvula y tipo de salida."
      variant="glass"
  >
    <div class="resource-switch" role="group" aria-label="Recurso del grafico">
      <button
          v-for="option in resourceOptions"
          :key="option.value"
          type="button"
          class="resource-switch__button"
          :class="{ 'resource-switch__button--active': selectedResource === option.value }"
          @click="selectedResource = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="chart.points.length" class="savings-panel">
      <section class="savings-kpis" aria-label="Indicadores de consumo">
        <article class="savings-kpi">
          <span>Total acumulado</span>
          <strong>{{ formatUnit(resourceSummary.total, resourceSummary.unit) }}</strong>
          <small>{{ resourceSummary.readingsCount }} lecturas capturadas</small>
        </article>

        <article class="savings-kpi">
          <span>Ultimo intervalo</span>
          <strong>{{ formatUnit(resourceSummary.lastValue, resourceSummary.unit) }}</strong>
          <small>{{ resourceSummary.lastIntervalLabel }}</small>
        </article>

        <article class="savings-kpi">
          <span>Flujo estimado</span>
          <strong>{{ formatUnit(resourceSummary.flowPerMinute, `${resourceSummary.unit}/min`) }}</strong>
          <small>Segun apertura y tipo de conducto</small>
        </article>

        <article class="savings-kpi">
          <span>Limites activos</span>
          <strong>{{ resourceSummary.activeLimits }}</strong>
          <small>{{ resourceSummary.riskCount }} lecturas por revisar</small>
        </article>
      </section>

      <div class="savings-chart-shell">
        <div class="savings-chart-header">
          <div>
            <strong>{{ resourceSummary.title }}</strong>
            <span>{{ resourceSummary.subtitle }}</span>
          </div>

          <StatusBadge
              :status="resourceSummary.riskCount > 0 ? 'warning' : 'active'"
              :label="resourceSummary.riskCount > 0 ? 'Revisar consumo' : 'Flujo normal'"
          />
        </div>

        <svg
            class="savings-chart"
            viewBox="0 0 720 260"
            role="img"
            :aria-label="`Grafico lineal de consumo de ${resourceSummary.label}`"
            preserveAspectRatio="none"
        >
          <line
              v-for="tick in chart.ticks"
              :key="tick.label"
              class="savings-chart__grid"
              x1="48"
              x2="692"
              :y1="tick.y"
              :y2="tick.y"
          />

          <text
              v-for="tick in chart.ticks"
              :key="`label-${tick.label}`"
              class="savings-chart__axis-label"
              x="8"
              :y="tick.y + 4"
          >
            {{ tick.label }}
          </text>

          <polygon
              v-if="chart.areaPoints"
              class="savings-chart__area"
              :points="chart.areaPoints"
          />

          <polyline
              class="savings-chart__line"
              :points="chart.linePoints"
              fill="none"
          />

          <g
              v-for="point in chart.points"
              :key="point.id"
          >
            <circle
                class="savings-chart__dot"
                :class="{ 'savings-chart__dot--risk': point.status === 'warning' || point.status === 'critical' }"
                :cx="point.x"
                :cy="point.y"
                r="5"
            />
            <title>{{ getUsagePointTitle(point) }}</title>
          </g>
        </svg>

        <div class="savings-chart-footer">
          <span>Cada punto es un intervalo de medicion</span>
          <span>La linea muestra consumo acumulado</span>
          <span>{{ resourceSummary.limitHint }}</span>
        </div>
      </div>

      <section class="savings-detail" aria-label="Ultimas mediciones">
        <div
            v-for="point in recentPoints"
            :key="`detail-${point.id}`"
            class="savings-detail__item"
        >
          <div>
            <strong>{{ getUsagePointLine(point) }}</strong>
            <span>{{ getUsagePointContext(point) }}</span>
          </div>

          <StatusBadge
              :status="point.status === 'warning' || point.status === 'critical' ? point.status : 'active'"
              :label="point.status === 'warning' || point.status === 'critical' ? 'Revisar' : 'Normal'"
          />
        </div>
      </section>
    </div>

    <EmptyState
        v-else
        compact
        :title="`Sin consumo de ${resourceSummary.label.toLowerCase()}`"
        :description="`Activa un conducto de ${resourceSummary.label.toLowerCase()} para empezar a dibujar la medicion en tiempo real.`"
    />
  </UiCard>
</template>

<script setup>
import { computed, ref } from "vue";

import EmptyState from "../../../../shared/presentation/components/empty-state/empty-state.component.vue";
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

const props = defineProps({
  readings: {
    type: Array,
    default: () => [],
  },
  thresholds: {
    type: Array,
    default: () => [],
  },
});

const selectedResource = ref("water");

const resourceOptions = [
  { value: "water", label: "Agua", unit: "L" },
  { value: "gas", label: "Gas", unit: "m3" },
];

const chartSize = {
  width: 720,
  height: 260,
  left: 48,
  right: 28,
  top: 22,
  bottom: 36,
};

const selectedResourceOption = computed(() =>
    resourceOptions.find((option) => option.value === selectedResource.value) || resourceOptions[0]
);

const resourceReadings = computed(() =>
    props.readings
        .filter((reading) => reading.resourceType === selectedResource.value)
        .slice()
        .sort((left, right) => new Date(left.capturedAt) - new Date(right.capturedAt))
);

const resourceThresholds = computed(() =>
    props.thresholds.filter((threshold) =>
        threshold.resourceType === selectedResource.value &&
        threshold.isActive !== false
    )
);

const usagePoints = computed(() => {
  let total = 0;

  return resourceReadings.value.map((reading) => {
    const value = Number(reading.value || 0);
    total += value;

    return {
      id: reading.id,
      resourceType: reading.resourceType,
      value,
      cumulativeValue: total,
      unit: reading.unit || selectedResourceOption.value.unit,
      flowPerMinute: Number(reading.flowRatePerMinute || 0),
      intervalSeconds: Number(reading.intervalSeconds || 0),
      status: reading.status || "normal",
      capturedAt: reading.capturedAt ? new Date(reading.capturedAt) : new Date(),
      location: reading.location || {},
    };
  });
});

const resourceSummary = computed(() => {
  const points = usagePoints.value;
  const latestPoint = points[points.length - 1] || null;
  const label = selectedResourceOption.value.label;
  const unit = latestPoint?.unit || selectedResourceOption.value.unit;
  const total = latestPoint?.cumulativeValue || 0;
  const activeLimits = resourceThresholds.value.length;
  const riskCount = points.filter((point) => point.status === "warning" || point.status === "critical").length;

  return {
    label,
    unit,
    total,
    activeLimits,
    riskCount,
    readingsCount: points.length,
    lastValue: latestPoint?.value || 0,
    flowPerMinute: latestPoint?.flowPerMinute || 0,
    lastIntervalLabel: latestPoint?.intervalSeconds
        ? `Ultimos ${formatNumber(latestPoint.intervalSeconds)} segundos`
        : "Esperando siguiente intervalo",
    title: `Consumo acumulado de ${label.toLowerCase()}`,
    subtitle: latestPoint
        ? `${formatUnit(latestPoint.value, unit)} capturados en la ultima medicion`
        : "Aun no hay mediciones capturadas",
    limitHint: activeLimits
        ? `${activeLimits} limites clasifican estas lecturas`
        : "Sin limites: se grafica consumo, no riesgo",
  };
});

const recentPoints = computed(() =>
    chart.value.points.slice(-4).reverse()
);

const chart = computed(() => {
  const points = usagePoints.value.slice(-18);
  if (!points.length) {
    return {
      points: [],
      ticks: [],
      linePoints: "",
      areaPoints: "",
    };
  }

  const values = points.map((point) => point.cumulativeValue);
  const max = Math.max(1, ...values);
  const innerWidth = chartSize.width - chartSize.left - chartSize.right;
  const innerHeight = chartSize.height - chartSize.top - chartSize.bottom;

  const getX = (index) => {
    if (points.length === 1) return chartSize.left + innerWidth / 2;
    return chartSize.left + (innerWidth / (points.length - 1)) * index;
  };

  const getY = (value) =>
      chartSize.top + ((max - value) / max) * innerHeight;

  const plottedPoints = points.map((point, index) => ({
    ...point,
    x: getX(index),
    y: getY(point.cumulativeValue),
  }));

  const baseY = chartSize.top + innerHeight;
  const linePoints = plottedPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = [
    `${plottedPoints[0].x},${baseY}`,
    ...plottedPoints.map((point) => `${point.x},${point.y}`),
    `${plottedPoints[plottedPoints.length - 1].x},${baseY}`,
  ].join(" ");

  const ticks = [max, max / 2, 0].map((value) => ({
    y: getY(value),
    label: formatUnit(value, resourceSummary.value.unit),
  }));

  return {
    points: plottedPoints,
    ticks,
    linePoints,
    areaPoints,
  };
});

function formatNumber(value) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatPercent(value) {
  const sign = Number(value) > 0 ? "+" : "";
  return `${sign}${formatNumber(value)}%`;
}

function formatUnit(value, unit) {
  return `${formatNumber(value)} ${unit}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getTrendLabel(value) {
  if (value > 1) return `Tendencia mejorando ${formatPercent(value)}`;
  if (value < -1) return `Tendencia en deterioro ${formatPercent(value)}`;
  return "Tendencia estable";
}

function getResourceLabel(resourceType) {
  return resourceType === "gas" ? "Gas" : "Agua";
}

function getPointLine(point) {
  return [
    getResourceLabel(point.resourceType),
    point.location?.roomName,
    point.location?.sensorName,
    `${formatUnit(point.value, point.unit)} capturados`,
    `${formatUnit(point.cumulativeValue, point.unit)} acumulados`,
  ].filter(Boolean).join(" · ");
}

function getPointContext(point) {
  return [
    formatDate(point.capturedAt),
    point.flowPerMinute
        ? `${formatUnit(point.flowPerMinute, `${point.unit}/min`)} estimados`
        : "Flujo calculado por intervalo",
  ].join(" · ");
}

function getPointTitle(point) {
  return `${getPointLine(point)} · ${formatPercent(point.savingsPercent)}`;
}
function getUsagePointLine(point) {
  return [
    getResourceLabel(point.resourceType),
    point.location?.roomName,
    point.location?.sensorName,
    `${formatUnit(point.value, point.unit)} capturados`,
    `${formatUnit(point.cumulativeValue, point.unit)} acumulados`,
  ].filter(Boolean).join(" / ");
}

function getUsagePointContext(point) {
  return [
    formatDate(point.capturedAt),
    point.flowPerMinute
        ? `${formatUnit(point.flowPerMinute, `${point.unit}/min`)} estimados`
        : "Flujo calculado por intervalo",
  ].join(" / ");
}

function getUsagePointTitle(point) {
  return `${getUsagePointLine(point)} / ${getUsagePointContext(point)}`;
}
</script>

<style scoped>
.resource-switch {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-soft);
  padding: 6px;
}

.resource-switch__button {
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 900;
  min-width: 90px;
  padding: 10px 14px;
}

.resource-switch__button--active {
  border-color: rgba(37, 99, 235, 0.25);
  background: #ffffff;
  color: var(--color-primary);
  box-shadow: var(--shadow-soft);
}

.savings-panel {
  display: grid;
  gap: 18px;
}

.savings-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.savings-kpi {
  display: grid;
  gap: 5px;
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  padding: 14px;
}

.savings-kpi span,
.savings-kpi small {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 800;
}

.savings-kpi strong {
  color: var(--color-success);
  font-size: 24px;
  line-height: 1;
}

.savings-kpi strong.is-negative {
  color: var(--color-danger);
}

.savings-chart-shell {
  display: grid;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  padding: 16px;
}

.savings-chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.savings-chart-header strong,
.savings-chart-header span {
  display: block;
}

.savings-chart-header strong {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
}

.savings-chart-header span {
  color: var(--color-text-muted);
  font-size: 13px;
  margin-top: 4px;
}

.savings-chart {
  width: 100%;
  height: 260px;
  overflow: visible;
}

.savings-chart__grid {
  stroke: #e2e8f0;
  stroke-width: 1;
}

.savings-chart__zero {
  stroke: #94a3b8;
  stroke-dasharray: 6 6;
  stroke-width: 1.4;
}

.savings-chart__axis-label {
  fill: var(--color-text-muted);
  font-size: 11px;
  font-weight: 800;
}

.savings-chart__area {
  fill: rgba(14, 165, 233, 0.11);
}

.savings-chart__line {
  stroke: #0ea5e9;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 4;
}

.savings-chart__dot {
  fill: #16a34a;
  stroke: #ffffff;
  stroke-width: 3;
}

.savings-chart__dot--risk {
  fill: var(--color-danger);
}

.savings-chart-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 800;
  flex-wrap: wrap;
}

.savings-detail {
  display: grid;
  gap: 10px;
}

.savings-detail__item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
}

.savings-detail__item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.savings-detail__item div {
  min-width: 0;
}

.savings-detail__item strong,
.savings-detail__item span {
  display: block;
  overflow-wrap: anywhere;
}

.savings-detail__item strong {
  color: var(--color-text);
  font-weight: 900;
}

.savings-detail__item span {
  color: var(--color-text-muted);
  font-size: 13px;
  margin-top: 4px;
}

@media (max-width: 900px) {
  .savings-kpis {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .savings-kpis {
    grid-template-columns: 1fr;
  }

  .savings-chart-header,
  .savings-detail__item {
    flex-direction: column;
  }
}
</style>
