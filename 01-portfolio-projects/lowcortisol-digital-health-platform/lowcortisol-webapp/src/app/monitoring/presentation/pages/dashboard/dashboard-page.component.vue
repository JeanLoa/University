<template>
  <AppLayout>
    <PageHeader
        :title="t('monitoring.dashboard.title')"
        :subtitle="t('monitoring.dashboard.subtitle')"
    >
      <template #actions>
        <UiButton
            :label="t('monitoring.dashboard.createThreshold')"
            variant="neutral"
            @click="showThresholdModal = true"
        />
      </template>
    </PageHeader>

    <LoadingState
        v-if="state.loading"
        :title="t('monitoring.dashboard.loadingTitle')"
        :description="t('monitoring.dashboard.loadingDescription')"
    />

    <section v-else class="monitoring-page">
      <p v-if="state.error" class="page-alert">
        {{ t(state.error) }}
      </p>

      <section v-if="state.summary" class="section-grid section-grid--3">
        <MetricCard
            :label="t('monitoring.dashboard.waterMonitored')"
            :value="`${formatNumber(state.summary.totalWater)} L`"
            :hint="t('monitoring.dashboard.waterHint')"
            icon="W"
        />

        <MetricCard
            :label="t('monitoring.dashboard.gasMonitored')"
            :value="`${formatNumber(state.summary.totalGas)} m3`"
            :hint="t('monitoring.dashboard.gasHint')"
            icon="G"
        />

        <MetricCard
            :label="t('monitoring.dashboard.totalReadings')"
            :value="state.summary.totalReadings"
            :hint="t('monitoring.dashboard.totalReadingsHint')"
            status="active"
            :status-label="t('monitoring.dashboard.active')"
        />

        <MetricCard
            :label="t('monitoring.dashboard.activeThresholds')"
            :value="state.summary.activeThresholds"
            :hint="t('monitoring.dashboard.activeThresholdsHint')"
            status="active"
            :status-label="t('monitoring.dashboard.riskStatus')"
        />

        <MetricCard
            :label="t('monitoring.dashboard.openAnomalies')"
            :value="state.summary.openAnomalies"
            :hint="t('monitoring.dashboard.openAnomaliesHint')"
            :status="state.summary.openAnomalies > 0 ? 'warning' : 'active'"
            :status-label="state.summary.openAnomalies > 0 ? t('monitoring.status.open') : t('monitoring.status.normal')"
        />

        <MetricCard
            :label="t('monitoring.dashboard.criticalAnomalies')"
            :value="state.summary.criticalAnomalies"
            :hint="t('monitoring.dashboard.criticalAnomaliesHint')"
            :status="state.summary.criticalAnomalies > 0 ? 'critical' : 'active'"
            :status-label="state.summary.criticalAnomalies > 0 ? t('monitoring.status.critical') : t('monitoring.status.normal')"
        />
      </section>

      <SavingsLineChart
          :readings="state.readings"
          :thresholds="state.thresholds"
      />

      <UiCard variant="glass">
        <div class="resource-filter" role="group" :aria-label="t('monitoring.dashboard.resourceFilter')">
          <button
              v-for="option in resourceOptions"
              :key="option.value"
              type="button"
              class="resource-filter__option"
              :class="{ 'resource-filter__option--active': state.selectedResourceType === option.value }"
              @click="handleResourceFilter(option.value)"
          >
            {{ t(option.labelKey) }}
          </button>
        </div>
      </UiCard>

      <section class="section-grid section-grid--2">
        <UiCard
            :title="t('monitoring.dashboard.recentReadings')"
            :subtitle="t('monitoring.dashboard.recentReadingsSubtitle')"
        >
          <UsageChart v-if="state.readings.length" :items="state.readings" />

          <EmptyState
              v-else
              compact
              :title="t('monitoring.dashboard.noReadingsTitle')"
              :description="t('monitoring.dashboard.noReadingsDescription')"
              :action-label="t('monitoring.dashboard.openConduits')"
              :action-to="{ name: 'devices' }"
          />
        </UiCard>

        <UiCard
            :title="t('monitoring.dashboard.activeThresholds')"
            :subtitle="t('monitoring.dashboard.activeThresholdsSubtitle')"
        >
          <div v-if="state.thresholds.length" class="threshold-list">
            <div
                v-for="threshold in state.thresholds.slice(0, 6)"
                :key="threshold.id"
                class="threshold-card"
                :class="{
                  'threshold-card--warning': threshold.severity === 'warning',
                  'threshold-card--critical': threshold.severity === 'critical',
                }"
            >
              <div class="threshold-card__header">
                <span class="threshold-card__eyebrow">{{ getResourceLabel(threshold.resourceType) }}</span>
                <StatusBadge
                    :status="threshold.severity"
                    :label="getSeverityLabel(threshold.severity)"
                />
              </div>

              <div class="threshold-card__body">
                <div class="threshold-card__identity">
                  <strong class="threshold-card__title">{{ getThresholdLocationTitle(threshold) }}</strong>
                  <span class="threshold-card__detail">{{ getThresholdTargetName(threshold) }}</span>
                </div>

                <strong class="threshold-card__value">{{ getThresholdLimitLabel(threshold) }}</strong>
              </div>

              <span class="threshold-card__rule">{{ getThresholdRuleLabel(threshold) }}</span>
              <small class="threshold-card__meta">{{ getThresholdContextLine(threshold) }}</small>
            </div>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('monitoring.dashboard.noThresholdsTitle')"
              :description="t('monitoring.dashboard.noThresholdsDescription')"
              :action-label="t('monitoring.dashboard.createThreshold')"
              @action="showThresholdModal = true"
          />
        </UiCard>
      </section>

      <section class="section-grid section-grid--2">
        <UiCard :title="t('monitoring.dashboard.recentReadingsList')">
          <div v-if="state.readings.length" class="risk-list">
            <div
                v-for="reading in latestReadings"
                :key="reading.id"
                class="risk-card"
                :class="{
                  'risk-card--warning': reading.status === 'warning',
                  'risk-card--critical': reading.status === 'critical',
                }"
            >
              <div class="risk-card__header">
                <span class="risk-card__eyebrow">{{ getResourceLabel(reading.resourceType) }}</span>
                <StatusBadge
                    :status="reading.status"
                    :label="getStatusLabel(reading.status)"
                />
              </div>

              <div class="risk-card__body">
                <div class="risk-card__identity">
                  <strong class="risk-card__title">{{ getReadingLocationTitle(reading) }}</strong>
                  <span class="risk-card__detail">{{ getReadingSensorName(reading) }}</span>
                </div>
                <strong class="risk-card__value">{{ getReadingValueLabel(reading) }}</strong>
              </div>

              <span class="risk-card__meta">{{ getReadingContextLine(reading) }}</span>

              <div class="risk-card__footer">
                <small class="risk-card__time">{{ formatDate(reading.capturedAt) }}</small>
                <UiButton
                    v-if="isReadingAtRisk(reading)"
                    class="risk-card__action"
                    :label="getReadingActionLabel(reading)"
                    :to="getAlertRoute(reading)"
                    variant="ghost"
                />
              </div>
            </div>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('monitoring.dashboard.noReadingsTitle')"
              :description="t('monitoring.dashboard.noReadingsDescription')"
          />
        </UiCard>

        <UiCard :title="t('monitoring.dashboard.openAnomalies')">
          <div v-if="visibleAnomalies.length" class="risk-list">
            <div
                v-for="anomaly in visibleAnomalies"
                :key="anomaly.id"
                class="risk-card"
                :class="{
                  'risk-card--warning': anomaly.severity === 'warning',
                  'risk-card--critical': anomaly.severity === 'critical',
                }"
            >
              <div class="risk-card__header">
                <span class="risk-card__eyebrow">{{ getSeverityLabel(anomaly.severity) }}</span>
                <StatusBadge
                    :status="anomaly.severity"
                    :label="getStatusLabel(anomaly.status)"
                />
              </div>

              <div class="risk-card__body">
                <div class="risk-card__identity">
                  <strong class="risk-card__title">{{ getAnomalyLocationTitle(anomaly) }}</strong>
                  <span class="risk-card__detail">{{ getAnomalySensorName(anomaly) }}</span>
                </div>
                <strong class="risk-card__value">{{ getAnomalyValueLabel(anomaly) }}</strong>
              </div>

              <span class="risk-card__meta">{{ getAnomalyContextLine(anomaly) }}</span>

              <div class="risk-card__footer">
                <small class="risk-card__time">{{ getAnomalyTime(anomaly) }}</small>
                <UiButton
                    class="risk-card__action"
                    :disabled="state.saving"
                    :label="t('monitoring.dashboard.resolveAnomaly')"
                    variant="ghost"
                    @click="handleResolveAnomaly(anomaly.id)"
                />
              </div>
            </div>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('monitoring.dashboard.noAnomaliesTitle')"
              :description="t('monitoring.dashboard.noAnomaliesDescription')"
          />
        </UiCard>
      </section>
    </section>

    <CreateThresholdModal
        :open="showThresholdModal"
        :physical-options="state.physicalOptions"
        :saving="state.saving"
        @close="showThresholdModal = false"
        @submit="handleCreateThreshold"
    />
  </AppLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import EmptyState from "../../../../shared/presentation/components/empty-state/empty-state.component.vue";
import LoadingState from "../../../../shared/presentation/components/loading-state/loading-state.component.vue";
import MetricCard from "../../../../shared/presentation/components/metric-card/metric-card.component.vue";
import PageHeader from "../../../../shared/presentation/components/page-header/page-header.component.vue";
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import CreateThresholdModal from "../../components/create-threshold-modal/create-threshold-modal.component.vue";
import SavingsLineChart from "../../components/savings-line-chart/savings-line-chart.component.vue";
import UsageChart from "../../components/usage-chart/usage-chart.component.vue";

import { useMonitoringStore } from "../../../application/store/monitoring.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const {
  state,
  loadMonitoringDashboard,
  refreshMonitoringDashboard,
  filterReadingsByResource,
  createThreshold,
  resolveAnomaly,
} = useMonitoringStore();

const { t } = useTranslation();

const showThresholdModal = ref(false);
let refreshTimer = null;

const resourceOptions = [
  {
    value: "all",
    labelKey: "monitoring.resources.all",
  },
  {
    value: "water",
    labelKey: "monitoring.resources.water",
  },
  {
    value: "gas",
    labelKey: "monitoring.resources.gas",
  },
];

const latestReadings = computed(() =>
    state.readings
        .slice()
        .sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt))
        .slice(0, 6)
);

const visibleAnomalies = computed(() => {
  return state.anomalies;
});

onMounted(async () => {
  await loadMonitoringDashboard();

  refreshTimer = window.setInterval(() => {
    refreshMonitoringDashboard();
  }, 2000);
});

onBeforeUnmount(() => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
  }
});

async function handleResourceFilter(resourceType) {
  await filterReadingsByResource(resourceType);
}

async function handleCreateThreshold(payload) {
  await createThreshold(payload);
  showThresholdModal.value = false;
}

async function handleResolveAnomaly(anomalyId) {
  await resolveAnomaly(anomalyId);
}

function getThresholdDescription(threshold) {
  return [
    getResourceLabel(threshold.resourceType),
    getOperatorLabel(threshold.operator),
    `${threshold.limitValue} ${threshold.unit}`,
  ].join(" ");
}

function getThresholdLocationTitle(threshold) {
  return threshold.location?.roomName || threshold.location?.siteName || t("monitoring.dashboard.physicalLocation");
}

function getThresholdTargetName(threshold) {
  return threshold.location?.sensorName || threshold.location?.deviceName || threshold.location?.deviceGroupName || threshold.name;
}

function getThresholdLimitLabel(threshold) {
  return `${formatNumber(threshold.limitValue)} ${threshold.unit}`.trim();
}

function getThresholdRuleLabel(threshold) {
  return `${getOperatorLabel(threshold.operator)} ${getThresholdLimitLabel(threshold)}`;
}

function getThresholdContextLine(threshold) {
  return [
    threshold.location?.siteName,
    threshold.location?.deviceGroupName,
    threshold.location?.deviceName,
  ].filter(Boolean).join(" · ");
}

function getAnomalyDescription(anomaly) {
  return `${getResourceLabel(anomaly.resourceType)} ${anomaly.value} ${anomaly.unit}`;
}

function getAnomalyLocationTitle(anomaly) {
  return anomaly.location?.roomName || anomaly.location?.siteName || t("monitoring.dashboard.physicalLocation");
}

function getAnomalySensorName(anomaly) {
  return anomaly.location?.sensorName || anomaly.location?.deviceName || anomaly.location?.deviceGroupName || "";
}

function getAnomalyValueLabel(anomaly) {
  return `${formatNumber(anomaly.value)} ${anomaly.unit}`.trim();
}

function getAnomalyContextLine(anomaly) {
  return [
    anomaly.location?.siteName,
    anomaly.location?.deviceGroupName,
    anomaly.location?.deviceName,
  ].filter(Boolean).join(" · ");
}

function getAnomalyTime(anomaly) {
  return formatDate(anomaly.detectedAt || anomaly.reading?.capturedAt);
}

function isReadingAtRisk(reading) {
  return reading?.status === "warning" || reading?.status === "critical";
}

function getReadingLocationTitle(reading) {
  return reading.location?.roomName || reading.location?.siteName || t("monitoring.dashboard.physicalLocation");
}

function getReadingSensorName(reading) {
  return reading.location?.sensorName || reading.location?.deviceName || reading.location?.deviceGroupName || "";
}

function getReadingValueLabel(reading) {
  return `${formatNumber(reading.value)} ${reading.unit}`.trim();
}

function getReadingOperationalLine(reading) {
  return [
    getResourceLabel(reading.resourceType),
    reading.location?.roomName,
    reading.location?.sensorName,
    `${formatNumber(reading.value)} ${reading.unit}`,
    getStatusLabel(reading.status),
  ].filter(Boolean).join(" · ");
}

function getReadingContextLine(reading) {
  return [
    reading.location?.siteName,
    reading.location?.deviceGroupName,
    reading.location?.deviceName,
  ].filter(Boolean).join(" · ");
}

function getReadingActionLabel(reading) {
  return reading?.status === "critical"
      ? t("monitoring.dashboard.viewAlert")
      : t("monitoring.dashboard.reviewReading");
}

function getAlertRoute(reading) {
  const query = {};

  if (reading?.id) query.readingId = reading.id;
  if (reading?.sensorId) query.sensorId = reading.sensorId;
  if (reading?.status) query.severity = reading.status;

  return {
    path: "/alerts",
    query,
  };
}

function getOperatorLabel(operator) {
  const keys = {
    greater_than: "monitoring.operators.greaterThan",
    greater_or_equal: "monitoring.operators.greaterOrEqual",
    less_than: "monitoring.operators.lessThan",
    less_or_equal: "monitoring.operators.lessOrEqual",
  };

  return t(keys[operator] ?? "monitoring.operators.greaterOrEqual");
}

function getSeverityLabel(severity) {
  const keys = {
    warning: "monitoring.status.warning",
    critical: "monitoring.status.critical",
  };

  return t(keys[severity] ?? "monitoring.status.warning");
}

function getStatusLabel(status) {
  const keys = {
    normal: "monitoring.status.normal",
    warning: "monitoring.status.warning",
    critical: "monitoring.status.critical",
    open: "monitoring.status.open",
    resolved: "monitoring.status.resolved",
    closed: "monitoring.status.closed",
  };

  return t(keys[status] ?? "monitoring.status.open");
}

function getResourceLabel(resourceType) {
  const keys = {
    water: "monitoring.resources.water",
    gas: "monitoring.resources.gas",
  };

  return t(keys[resourceType] ?? "monitoring.resources.water");
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}
</script>

<style scoped>
.monitoring-page {
  display: grid;
  gap: 20px;
}

.page-alert {
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
  background: #fff5f5;
  color: var(--color-danger);
  font-weight: 800;
  margin: 0;
  padding: 12px 14px;
}

.resource-filter {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.resource-filter__option {
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  font-weight: 900;
  padding: 10px 14px;
  transition:
      background 0.2s ease,
      color 0.2s ease,
      border-color 0.2s ease;
}

.resource-filter__option--active {
  border-color: #bfdbfe;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.list {
  display: grid;
}

.list-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
  padding: 14px 0;
}

.list-item__content {
  flex: 1 1 auto;
  min-width: 0;
}

.list-item--risk {
  border: 1px solid #fde68a;
  border-radius: var(--radius-md);
  background: #fffbeb;
  padding: 12px;
}

.list-item--critical {
  border-color: #fecaca;
  background: #fff7f7;
}

.list-item:first-child {
  padding-top: 0;
}

.list-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.list-item--risk:first-child,
.list-item--risk:last-child {
  padding: 12px;
}

.list-item--risk:last-child {
  border-bottom: 1px solid #fde68a;
}

.list-item--critical:last-child {
  border-bottom-color: #fecaca;
}

.list-item span,
.list-item small {
  display: block;
  color: var(--color-text-muted);
}

.list-item small {
  font-size: 12px;
  margin-top: 4px;
}

.list-item strong {
  display: block;
  color: var(--color-text);
  font-weight: 900;
  margin-bottom: 4px;
}

.reading-line,
.reading-context {
  overflow-wrap: anywhere;
}

.list-actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.list-actions--reading {
  flex: 0 0 auto;
}

.threshold-list {
  display: grid;
  gap: 10px;
}

.threshold-card {
  display: grid;
  gap: 9px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  padding: 13px 14px;
}

.threshold-card--warning {
  border-color: #fde68a;
  background: #fffdf3;
}

.threshold-card--critical {
  border-color: #fecaca;
  background: #fff8f8;
}

.threshold-card__header,
.threshold-card__body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
}

.threshold-card__eyebrow {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.threshold-card__identity {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.threshold-card__title {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.threshold-card__detail {
  color: var(--color-text);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.threshold-card__value {
  flex: 0 0 auto;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.1;
  text-align: right;
  white-space: nowrap;
}

.threshold-card__rule,
.threshold-card__meta {
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.threshold-card__rule {
  color: var(--color-text);
  font-weight: 800;
}

.risk-list {
  display: grid;
  gap: 10px;
}

.risk-card {
  display: grid;
  gap: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  padding: 13px 14px;
}

.risk-card--warning {
  border-color: #fde68a;
  background: #fffdf3;
}

.risk-card--critical {
  border-color: #fecaca;
  background: #fff8f8;
}

.risk-card__header,
.risk-card__body,
.risk-card__footer {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
}

.risk-card__eyebrow {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.risk-card__identity {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.risk-card__title {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.risk-card__detail {
  color: var(--color-text);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.risk-card__value {
  flex: 0 0 auto;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.1;
  text-align: right;
  white-space: nowrap;
}

.risk-card__meta,
.risk-card__time {
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.risk-card__time {
  font-size: 12px;
}

.risk-card__footer {
  align-items: center;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
  padding-top: 8px;
}

.risk-card__action {
  min-height: 34px;
  padding: 8px 10px;
  font-size: 12px;
  white-space: nowrap;
}

@media (max-width: 700px) {
  .list-item,
  .list-item--action {
    flex-direction: column;
  }

  .list-actions {
    justify-content: flex-start;
  }

  .risk-card {
    grid-template-columns: 1fr;
  }

  .threshold-card__body,
  .risk-card__body,
  .risk-card__footer {
    flex-direction: column;
    align-items: flex-start;
  }

  .threshold-card__value,
  .risk-card__value {
    text-align: left;
  }
}
</style>
