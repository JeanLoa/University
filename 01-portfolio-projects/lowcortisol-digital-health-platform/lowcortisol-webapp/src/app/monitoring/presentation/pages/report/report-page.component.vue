<template>
  <AppLayout>
    <PageHeader
        :title="t('monitoring.reports.title')"
        :subtitle="t('monitoring.reports.subtitle')"
    >
      <template #actions>
        <UiButton
            variant="create"
            :label="t('monitoring.reports.generateReport')"
            @click="handleCreateReport"
        />
      </template>
    </PageHeader>

    <LoadingState
        v-if="state.loading"
        :title="t('monitoring.reports.loadingTitle')"
        :description="t('monitoring.reports.loadingDescription')"
    />

    <section v-else class="reports-page">
      <section class="section-grid section-grid--3">
        <MetricCard
            :label="t('monitoring.reports.generatedReports')"
            :value="state.reports.length"
            :hint="t('monitoring.reports.generatedReportsHint')"
        />

        <MetricCard
            :label="t('monitoring.reports.availableReadings')"
            :value="state.readings.length"
            :hint="t('monitoring.reports.availableReadingsHint')"
        />

        <MetricCard
            :label="t('monitoring.reports.anomalies')"
            :value="state.anomalies.length"
            :hint="t('monitoring.reports.anomaliesHint')"
            :status="state.anomalies.length ? 'warning' : 'active'"
        />
      </section>

      <UiCard
          title="Configurar reporte"
          subtitle="Define el nombre, el periodo y el recurso que quieres analizar."
          variant="glass"
      >
        <div class="filters">
          <label class="report-title-field">
            <span>Título del reporte</span>
            <input
                v-model="filters.title"
                type="text"
                maxlength="80"
                placeholder="Ej. Consumo semanal de agua"
            />
            <small>{{ currentReportTitle }}</small>
          </label>

          <div class="filters__controls">
            <UiSelect
                class="filters__period-control"
                v-model="filters.period"
                label="Periodo"
                :options="periodOptions"
                @change="applyPeriodPreset"
            />

            <UiSelect
                class="filters__resource-control"
                v-model="filters.resource"
                label="Recurso"
                :options="resourceOptions"
            />

            <UiDateRange
                class="filters__date-range"
                v-model:start-date="filters.startDate"
                v-model:end-date="filters.endDate"
                label="Rango de fechas"
                :max-date="todayInput"
                @change="markCustomPeriod"
            />
          </div>
        </div>
      </UiCard>

      <UiCard
          :title="currentReportTitle"
          subtitle="Vista previa calculada con los filtros actuales."
      >
        <div class="report-insights">
          <article>
            <span>Agua consumida</span>
            <strong>{{ formatNumber(reportInsight.totalWater) }} L</strong>
            <small>Total dentro del rango</small>
          </article>

          <article>
            <span>Gas consumido</span>
            <strong>{{ formatNumber(reportInsight.totalGas) }} m3</strong>
            <small>Total dentro del rango</small>
          </article>

          <article>
            <span>Mayor punto de consumo</span>
            <strong>{{ reportInsight.topConsumer.label }}</strong>
            <small>{{ reportInsight.topConsumer.detail }}</small>
          </article>

          <article>
            <span>Promedio por lectura</span>
            <strong>{{ reportInsight.averageLabel }}</strong>
            <small>{{ reportInsight.readingsCount }} lecturas analizadas</small>
          </article>
        </div>
      </UiCard>

      <section class="section-grid section-grid--2">
        <UiCard :title="t('monitoring.reports.consumptionReports')">
          <div v-if="filteredReports.length" class="report-list">
            <article
                v-for="report in filteredReports"
                :key="report.id"
                class="report-card"
            >
              <div>
                <h3>{{ report.title || getPeriodLabel(report.period) }}</h3>
                <p>{{ getReportRangeLabel(report) }}</p>
              </div>

              <div class="report-metrics">
                <StatusBadge status="active" :label="`${formatNumber(report.totalWater)} L`" />
                <StatusBadge status="active" :label="`${formatNumber(report.totalGas)} m3`" />
                <StatusBadge
                    :status="report.anomaliesCount > 0 ? 'warning' : 'active'"
                    :label="`${report.anomaliesCount} ${t('monitoring.reports.anomalies').toLowerCase()}`"
                />
              </div>
            </article>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('monitoring.reports.noReportsTitle')"
              :description="t('monitoring.reports.noReportsDescription')"
              :action-label="t('monitoring.reports.generateReport')"
              @action="handleCreateReport"
          />
        </UiCard>

        <UiCard
            :title="t('monitoring.reports.baseReadings')"
            subtitle="Navega el historial en páginas de 10 registros."
        >
          <div v-if="filteredReadings.length" class="readings-panel">
            <div class="readings-panel__header">
              <span>Mostrando {{ pageStart }}-{{ pageEnd }} de {{ filteredReadings.length }}</span>
              <strong>10 por página</strong>
            </div>

            <div class="reading-list">
            <div
                v-for="reading in paginatedReadings"
                :key="reading.id"
                class="reading-item"
            >
              <div>
                <strong>{{ getReadingTitle(reading) }}</strong>
                <span>{{ getReadingLocation(reading) }}</span>
                <small>{{ formatDateTime(reading.capturedAt) }}</small>
              </div>

              <StatusBadge
                  :status="reading.status"
                  :label="`${reading.value} ${reading.unit}`"
              />
            </div>
            </div>

            <nav class="pagination" aria-label="Paginacion de lecturas">
              <button
                  class="pagination__nav"
                  type="button"
                  :disabled="currentPage === 1"
                  @click="goToPreviousPage"
              >
                Anterior
              </button>

              <div class="pagination__pages">
                <button
                    v-for="page in visiblePageNumbers"
                    :key="page"
                    class="pagination__page"
                    :class="{ 'pagination__page--active': page === currentPage }"
                    type="button"
                    @click="goToPage(page)"
                >
                  {{ page }}
                </button>
              </div>

              <button
                  class="pagination__nav"
                  type="button"
                  :disabled="currentPage === totalPages"
                  @click="goToNextPage"
              >
                Siguiente
              </button>
            </nav>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('monitoring.reports.noReadingsTitle')"
              :description="t('monitoring.reports.noReadingsDescription')"
          />
        </UiCard>
      </section>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import EmptyState from "../../../../shared/presentation/components/empty-state/empty-state.component.vue";
import LoadingState from "../../../../shared/presentation/components/loading-state/loading-state.component.vue";
import MetricCard from "../../../../shared/presentation/components/metric-card/metric-card.component.vue";
import PageHeader from "../../../../shared/presentation/components/page-header/page-header.component.vue";
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";
import UiDateRange from "../../../../shared/presentation/components/ui-date-range/ui-date-range.component.vue";
import UiSelect from "../../../../shared/presentation/components/ui-select/ui-select.component.vue";

import { useMonitoringStore } from "../../../application/store/monitoring.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const {
  state,
  loadDashboard,
  createReport,
} = useMonitoringStore();

const { t } = useTranslation();
const READINGS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;
const todayInput = toDateInputValue(new Date());

const filters = reactive({
  title: "",
  period: "all",
  resource: "all",
  startDate: "",
  endDate: "",
});
const currentPage = ref(1);

const periodOptions = [
  { value: "all", label: "Todo el historial" },
  { value: "daily", label: "Hoy" },
  { value: "weekly", label: "Ultimos 7 dias" },
  { value: "monthly", label: "Ultimos 30 dias" },
  { value: "custom", label: "Rango personalizado" },
];
const resourceOptions = [
  { value: "all", label: t("monitoring.resources.all") },
  { value: "water", label: t("monitoring.resources.water") },
  { value: "gas", label: t("monitoring.resources.gas") },
];

const range = computed(() => ({
  start: filters.startDate ? startOfDay(filters.startDate) : null,
  end: filters.endDate ? endOfDay(filters.endDate) : null,
}));

const filteredReports = computed(() =>
  state.reports.filter((report) =>
      filters.period === "all" || report.period === filters.period
  )
);

const filteredReadings = computed(() =>
  [...state.readings].filter((reading) => {
    const capturedAt = new Date(reading.capturedAt);
    const matchesResource =
        filters.resource === "all" || reading.resourceType === filters.resource;
    const matchesStart = !range.value.start || capturedAt >= range.value.start;
    const matchesEnd = !range.value.end || capturedAt <= range.value.end;

    return matchesResource && matchesStart && matchesEnd;
  }).sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt))
);

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredReadings.value.length / READINGS_PER_PAGE))
);
const paginatedReadings = computed(() => {
  const start = (currentPage.value - 1) * READINGS_PER_PAGE;
  return filteredReadings.value.slice(start, start + READINGS_PER_PAGE);
});
const pageStart = computed(() => {
  if (!filteredReadings.value.length) return 0;
  return (currentPage.value - 1) * READINGS_PER_PAGE + 1;
});
const pageEnd = computed(() =>
    Math.min(currentPage.value * READINGS_PER_PAGE, filteredReadings.value.length)
);
const visiblePageNumbers = computed(() => {
  const pages = [];
  const halfWindow = Math.floor(MAX_VISIBLE_PAGES / 2);
  const start = Math.max(1, Math.min(
      currentPage.value - halfWindow,
      totalPages.value - MAX_VISIBLE_PAGES + 1
  ));
  const end = Math.min(totalPages.value, start + MAX_VISIBLE_PAGES - 1);

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
});

const currentReportTitle = computed(() => {
  const customTitle = filters.title.trim();
  if (customTitle) return customTitle;

  return buildDefaultReportTitle();
});

const reportInsight = computed(() => {
  const readings = filteredReadings.value;
  const waterReadings = readings.filter((reading) => reading.resourceType === "water");
  const gasReadings = readings.filter((reading) => reading.resourceType === "gas");
  const totalWater = sumReadings(waterReadings);
  const totalGas = sumReadings(gasReadings);
  const topConsumer = filters.resource === "all"
      ? getMixedResourceTopConsumer(waterReadings, gasReadings)
      : getTopConsumer(readings);

  return {
    readingsCount: readings.length,
    totalWater,
    totalGas,
    topConsumer,
    averageLabel: buildAverageLabel(waterReadings, gasReadings),
  };
});

watch(
    () => [filters.period, filters.resource, filters.startDate, filters.endDate],
    () => {
      normalizeDateRange();
      currentPage.value = 1;
    }
);

onMounted(async () => {
  await loadDashboard();
});

async function handleCreateReport() {
  const firstReading = filteredReadings.value[0];

  await createReport({
    title: currentReportTitle.value,
    siteId: firstReading?.siteId || "",
    period: filters.period === "all" ? "custom" : filters.period,
    resourceType: filters.resource,
    startDate: range.value.start?.toISOString() || null,
    endDate: range.value.end?.toISOString() || null,
  });
}

function applyPeriodPreset(value) {
  const today = new Date();

  if (value === "all") {
    filters.startDate = "";
    filters.endDate = "";
    return;
  }

  if (value === "custom") return;

  const start = new Date(today);

  if (value === "weekly") {
    start.setDate(today.getDate() - 6);
  } else if (value === "monthly") {
    start.setDate(today.getDate() - 29);
  }

  filters.startDate = toDateInputValue(start);
  filters.endDate = toDateInputValue(today);
}

function markCustomPeriod() {
  filters.period = "custom";
}

function goToPreviousPage() {
  currentPage.value = Math.max(1, currentPage.value - 1);
}

function goToNextPage() {
  currentPage.value = Math.min(totalPages.value, currentPage.value + 1);
}

function goToPage(page) {
  currentPage.value = Math.min(totalPages.value, Math.max(1, page));
}

function normalizeDateRange() {
  if (filters.startDate && filters.startDate > todayInput) {
    filters.startDate = todayInput;
  }

  if (filters.endDate && filters.endDate > todayInput) {
    filters.endDate = todayInput;
  }

  if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
    filters.endDate = filters.startDate;
  }
}

function buildDefaultReportTitle() {
  const resourceLabel = filters.resource === "all"
      ? "agua y gas"
      : getResourceLabel(filters.resource).toLowerCase();
  const periodLabel = filters.period === "all"
      ? "historico"
      : getPeriodLabel(filters.period).toLowerCase();

  return `Reporte ${periodLabel} de ${resourceLabel}`;
}

function getReadingTitle(reading) {
  return `${getResourceLabel(reading.resourceType)} - ${formatNumber(reading.value)} ${reading.unit}`;
}

function getReadingLocation(reading) {
  return reading.locationLabel || [
    reading.location?.siteName,
    reading.location?.roomName,
    reading.location?.deviceGroupName,
    reading.location?.deviceName,
    reading.location?.sensorName,
  ].filter(Boolean).join(" / ") || reading.sensorId || "Sin ubicacion";
}

function getResourceLabel(resourceType) {
  const keys = {
    water: "monitoring.resources.water",
    gas: "monitoring.resources.gas",
  };

  return t(keys[resourceType] ?? "monitoring.resources.water");
}

function getPeriodLabel(period) {
  const keys = {
    daily: "monitoring.periods.daily",
    weekly: "monitoring.periods.weekly",
    monthly: "monitoring.periods.monthly",
  };

  return t(keys[period] ?? "monitoring.periods.custom");
}

function getReportRangeLabel(report) {
  const start = report.startDate ? formatDate(report.startDate) : "inicio";
  const end = report.endDate ? formatDate(report.endDate) : "actualidad";
  const readingsCount = Number(report.readingsCount || 0);

  return `${start} - ${end} / ${readingsCount} lecturas`;
}

function getConsumerLabel(reading) {
  return reading.location?.deviceName ||
      reading.location?.sensorName ||
      reading.location?.deviceGroupName ||
      reading.location?.roomName ||
      reading.sensorId ||
      "Punto sin nombre";
}

function getTopConsumer(readings) {
  if (!readings.length) {
    return {
      label: "Sin lecturas",
      detail: "Activa un conducto para medir consumo",
    };
  }

  const totals = readings.reduce((accumulator, reading) => {
    const label = getConsumerLabel(reading);
    const resource = reading.resourceType === "gas" ? "gas" : "water";
    const key = `${resource}:${label}`;

    if (!accumulator[key]) {
      accumulator[key] = {
        label,
        resource,
        value: 0,
      };
    }

    accumulator[key].value += Number(reading.value || 0);
    return accumulator;
  }, {});
  const top = Object.values(totals)
      .sort((left, right) => right.value - left.value)[0];
  const unit = top.resource === "gas" ? "m3" : "L";

  return {
    label: top.label,
    detail: `${formatNumber(top.value)} ${unit}`,
  };
}

function getMixedResourceTopConsumer(waterReadings, gasReadings) {
  const waterTop = getTopConsumer(waterReadings);
  const gasTop = getTopConsumer(gasReadings);

  if (!waterReadings.length && !gasReadings.length) {
    return {
      label: "Sin lecturas",
      detail: "Activa un conducto para medir consumo",
    };
  }

  if (waterReadings.length && gasReadings.length) {
    return {
      label: "Ranking por recurso",
      detail: `Agua: ${waterTop.label} / Gas: ${gasTop.label}`,
    };
  }

  return waterReadings.length ? waterTop : gasTop;
}

function buildAverageLabel(waterReadings, gasReadings) {
  const parts = [];

  if (waterReadings.length) {
    parts.push(`${formatNumber(sumReadings(waterReadings) / waterReadings.length)} L`);
  }

  if (gasReadings.length) {
    parts.push(`${formatNumber(sumReadings(gasReadings) / gasReadings.length)} m3`);
  }

  return parts.length ? parts.join(" / ") : "Sin lecturas";
}

function sumReadings(readings) {
  return readings.reduce((total, reading) => total + Number(reading.value || 0), 0);
}

function startOfDay(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function endOfDay(value) {
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toDateInputValue(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-PE", {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}
</script>

<style scoped>
.reports-page {
  display: grid;
  gap: 20px;
}

.filters {
  display: grid;
  grid-template-columns:
      minmax(250px, 1fr)
      174px
      116px
      minmax(370px, 1.15fr);
  gap: 16px;
  align-items: start;
}

.filters__controls {
  display: contents;
}

.filters__period-control {
  width: 174px;
}

.filters__resource-control {
  width: 116px;
}

.filters__date-range {
  min-width: 370px;
}

.report-title-field {
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
}

.report-title-field span {
  color: var(--color-text);
  font-weight: 900;
}

.report-title-field input {
  min-height: 46px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  color: var(--color-text);
  font: inherit;
  font-weight: 900;
  padding: 10px 13px;
  transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
}

.report-title-field input:hover,
.report-title-field input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
  outline: none;
}

.report-title-field small {
  color: var(--color-text-muted);
  font-weight: 800;
  line-height: 1.35;
}

.report-insights {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.report-insights article {
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 16px;
}

.report-insights span,
.readings-panel__header span,
.reading-item small {
  color: var(--color-text-muted);
}

.report-insights span {
  display: block;
  font-size: 13px;
  margin-bottom: 8px;
}

.report-insights strong {
  display: block;
  overflow: hidden;
  color: var(--color-text);
  font-size: 20px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-insights small {
  display: block;
  color: var(--color-text-muted);
  font-weight: 800;
  margin-top: 6px;
}

.report-list,
.reading-list {
  display: grid;
  gap: 14px;
}

.report-card,
.reading-item {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 16px;
}

.report-card h3 {
  color: var(--color-text);
  font-weight: 900;
  margin: 0 0 4px;
}

.report-card p,
.reading-item span {
  color: var(--color-text-muted);
  margin: 0;
}

.report-metrics {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.reading-item strong {
  display: block;
  color: var(--color-text);
  font-weight: 900;
  margin-bottom: 4px;
}

.readings-panel {
  display: grid;
  gap: 14px;
}

.readings-panel__header,
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.readings-panel__header strong,
.pagination__nav,
.pagination__page {
  color: var(--color-text);
  font-weight: 900;
}

.reading-item small {
  display: block;
  margin-top: 6px;
}

.pagination {
  border-top: 1px solid var(--color-border);
  padding-top: 14px;
}

.pagination__pages {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.pagination__nav,
.pagination__page {
  min-height: 40px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: #ffffff;
  padding: 9px 12px;
  transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      color 0.2s ease,
      background 0.2s ease;
}

.pagination__nav:disabled,
.pagination__page:disabled {
  cursor: not-allowed;
  opacity: 0.52;
}

.pagination__nav:not(:disabled):hover,
.pagination__page:hover,
.pagination__page--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.pagination__page {
  min-width: 40px;
}

@media (max-width: 1100px) {
  .report-insights {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .filters {
    grid-template-columns: 1fr;
  }

  .report-card,
  .reading-item,
  .readings-panel__header,
  .pagination {
    align-items: flex-start;
    flex-direction: column;
  }

  .report-metrics {
    justify-content: flex-start;
  }

  .report-insights {
    grid-template-columns: 1fr;
  }
}
</style>
