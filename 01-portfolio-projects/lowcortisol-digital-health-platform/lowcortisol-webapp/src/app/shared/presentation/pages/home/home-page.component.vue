<template>
  <AppLayout>
    <PageHeader
        :eyebrow="t('home.eyebrow')"
        :title="t('home.title')"
        :subtitle="t('home.subtitle')"
    >
      <template #actions>
        <UiButton
            variant="create"
            :to="{ name: 'dashboard' }"
            :label="t('home.actions.goMonitoring')"
        />

        <UiButton
            variant="neutral"
            :to="{ name: 'sites' }"
            :label="t('home.actions.goSites')"
        />
      </template>
    </PageHeader>

    <LoadingState
        v-if="state.loading"
        :title="t('home.loading.title')"
        :description="t('home.loading.description')"
    />

    <section v-else class="home-dashboard">
      <UiCard
          class="home-hero"
          variant="elevated"
          :eyebrow="t('home.hero.eyebrow')"
          :title="t('home.hero.title')"
          :subtitle="t('home.hero.subtitle')"
      >
        <template #actions>
          <StatusBadge
              :status="dashboard.overallStatus"
              :label="getOverallStatusLabel(dashboard.overallStatus)"
          />
        </template>

        <div class="home-hero__content">
          <p>{{ t('home.hero.message') }}</p>

          <div class="home-hero__actions">
            <UiButton
                variant="action"
                :to="{ name: 'alerts' }"
                :label="t('home.actions.goAlerts')"
            />

            <UiButton
                variant="ghost"
                :to="{ name: 'reports' }"
                :label="t('home.actions.goReports')"
            />
          </div>
        </div>
      </UiCard>

      <section class="section-grid section-grid--4">
        <MetricCard
            :label="t('home.metrics.water')"
            :value="`${dashboard.metrics.waterMonitored} L`"
            :hint="t('home.metrics.waterHint')"
            icon="W"
        />

        <MetricCard
            :label="t('home.metrics.gas')"
            :value="`${dashboard.metrics.gasMonitored} m3`"
            :hint="t('home.metrics.gasHint')"
            icon="G"
        />

        <MetricCard
            :label="t('home.metrics.sensors')"
            :value="dashboard.metrics.activeSensors"
            :hint="t('home.metrics.sensorsHint')"
            status="active"
            :status-label="t('home.status.active')"
        />

        <MetricCard
            :label="t('home.metrics.criticalAlerts')"
            :value="dashboard.metrics.criticalAlerts"
            :hint="t('home.metrics.criticalAlertsHint')"
            :status="dashboard.metrics.criticalAlerts > 0 ? 'critical' : 'active'"
            :status-label="dashboard.metrics.criticalAlerts > 0 ? t('home.status.warning') : t('home.status.active')"
        />

        <MetricCard
            :label="t('home.metrics.sites')"
            :value="dashboard.metrics.activeSites"
            :hint="t('home.metrics.sitesHint')"
            icon="S"
        />

        <MetricCard
            :label="t('home.metrics.devices')"
            :value="dashboard.metrics.activeDevices"
            :hint="t('home.metrics.devicesHint')"
            icon="D"
        />

        <MetricCard
            class="home-dashboard__wide"
            :label="t('home.metrics.plan')"
            :value="dashboard.metrics.activePlanName || t('home.empty.noPlanValue')"
            :hint="t('home.metrics.planHint')"
            :status="dashboard.plan ? 'paid' : 'pending'"
            :status-label="dashboard.plan ? t('home.status.active') : t('home.status.pending')"
        />
      </section>

      <section class="section-grid section-grid--2">
        <UiCard :title="t('home.sections.monitoringStatus')" variant="glass">
          <div v-if="dashboard.monitoring.readings.length" class="home-list">
            <article
                v-for="reading in dashboard.monitoring.readings"
                :key="reading.id"
                class="home-list__item"
            >
              <div>
                <strong>{{ getResourceLabel(reading.resourceType) }}</strong>
                <span>{{ reading.sensorId }}</span>
              </div>

              <StatusBadge
                  :status="reading.status"
                  :label="`${reading.value} ${reading.unit}`"
              />
            </article>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('home.empty.noReadingsTitle')"
              :description="t('home.empty.noReadingsDescription')"
              :action-label="t('home.actions.goMonitoring')"
              :action-to="{ name: 'dashboard' }"
          />
        </UiCard>

        <UiCard :title="t('home.sections.recentAnomalies')" variant="glass">
          <div v-if="dashboard.monitoring.anomalies.length" class="home-list">
            <article
                v-for="anomaly in dashboard.monitoring.anomalies"
                :key="anomaly.id"
                class="home-list__item"
            >
              <div>
                <strong>{{ getSeverityLabel(anomaly.severity) }}</strong>
                <span>{{ anomaly.description }}</span>
              </div>

              <StatusBadge
                  :status="anomaly.severity"
                  :label="getAnomalyStatusLabel(anomaly.status)"
              />
            </article>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('home.empty.noAlertsTitle')"
              :description="t('home.empty.noAlertsDescription')"
          />
        </UiCard>
      </section>

      <section class="section-grid section-grid--3">
        <UiCard :title="t('home.sections.mainSites')">
          <div v-if="dashboard.sites.length" class="home-list">
            <article
                v-for="site in dashboard.sites"
                :key="site.id"
                class="home-list__item home-list__item--stack"
            >
              <div>
                <strong>{{ site.name }}</strong>
                <span>{{ site.address }}</span>
              </div>

              <StatusBadge
                  :status="site.status"
                  :label="getSiteStatusLabel(site.status)"
              />
            </article>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('home.empty.noSitesTitle')"
              :description="t('home.empty.noSitesDescription')"
              :action-label="t('home.actions.createSite')"
              :action-to="{ name: 'sites' }"
          />
        </UiCard>

        <UiCard :title="t('home.sections.criticalDevices')">
          <div v-if="dashboard.devices.length" class="home-list">
            <article
                v-for="device in dashboard.devices"
                :key="device.id"
                class="home-list__item home-list__item--stack"
            >
              <div>
                <strong>{{ device.name }}</strong>
                <span>{{ t('home.labels.site') }} {{ device.siteId }}</span>
              </div>

              <StatusBadge
                  :status="device.status"
                  :label="getDeviceStatusLabel(device.status)"
              />
            </article>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('home.empty.noDevicesTitle')"
              :description="t('home.empty.noDevicesDescription')"
              :action-label="t('home.actions.goDevices')"
              :action-to="{ name: 'devices' }"
          />
        </UiCard>

        <UiCard :title="t('home.sections.planSummary')">
          <div v-if="dashboard.plan" class="plan-summary">
            <strong>{{ dashboard.plan.name }}</strong>
            <span>
              {{ dashboard.plan.maxSites }} {{ t('home.labels.sites') }} /
              {{ dashboard.plan.maxDevices }} {{ t('home.labels.devices') }}
            </span>
            <UiButton
                variant="neutral"
                :to="{ name: 'plans' }"
                :label="t('home.actions.goPlans')"
            />
          </div>

          <EmptyState
              v-else
              compact
              :title="t('home.empty.noPlanTitle')"
              :description="t('home.empty.noPlanDescription')"
              :action-label="t('home.actions.goPlans')"
              :action-to="{ name: 'plans' }"
          />
        </UiCard>
      </section>

      <section class="section-grid section-grid--2">
        <UiCard :title="t('home.sections.tickets')">
          <div v-if="dashboard.tickets.length" class="home-list">
            <article
                v-for="ticket in dashboard.tickets"
                :key="ticket.id"
                class="home-list__item"
            >
              <div>
                <strong>{{ ticket.title }}</strong>
                <span>{{ ticket.description }}</span>
              </div>

              <StatusBadge
                  :status="ticket.status"
                  :label="getTicketStatusLabel(ticket.status)"
              />
            </article>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('home.empty.noTicketsTitle')"
              :description="t('home.empty.noTicketsDescription')"
              :action-label="t('home.actions.goSupport')"
              :action-to="{ name: 'support' }"
          />
        </UiCard>

        <UiCard :title="t('home.sections.reports')">
          <div v-if="dashboard.monitoring.reports.length" class="home-list">
            <article
                v-for="report in dashboard.monitoring.reports"
                :key="report.id"
                class="home-list__item"
            >
              <div>
                <strong>{{ getPeriodLabel(report.period) }}</strong>
                <span>{{ t('home.labels.site') }} {{ report.siteId }}</span>
              </div>

              <StatusBadge
                  status="active"
                  :label="`${report.totalWater} L / ${report.totalGas} m3`"
              />
            </article>
          </div>

          <EmptyState
              v-else
              compact
              :title="t('home.empty.noReportsTitle')"
              :description="t('home.empty.noReportsDescription')"
              :action-label="t('home.actions.goReports')"
              :action-to="{ name: 'reports' }"
          />
        </UiCard>
      </section>
    </section>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive } from "vue";

import { HomeDashboardFacade } from "../../../application/services/home-dashboard.facade";
import { useTranslation } from "../../../application/services/translation.service";

import AppLayout from "../../components/app-layout/app-layout.component.vue";
import EmptyState from "../../components/empty-state/empty-state.component.vue";
import LoadingState from "../../components/loading-state/loading-state.component.vue";
import MetricCard from "../../components/metric-card/metric-card.component.vue";
import PageHeader from "../../components/page-header/page-header.component.vue";
import StatusBadge from "../../components/status-badge/status-badge.component.vue";
import UiButton from "../../components/ui-button/ui-button.component.vue";
import UiCard from "../../components/ui-card/ui-card.component.vue";

const homeDashboardFacade = new HomeDashboardFacade();
const { t } = useTranslation();

const dashboard = reactive({
  overallStatus: "active",
  metrics: {
    waterMonitored: 0,
    gasMonitored: 0,
    activeSensors: 0,
    criticalAlerts: 0,
    activeSites: 0,
    activeDevices: 0,
    activePlanName: "",
  },
  monitoring: {
    readings: [],
    anomalies: [],
    reports: [],
  },
  sites: [],
  devices: [],
  tickets: [],
  plan: null,
});

const state = reactive({
  loading: true,
});

onMounted(async () => {
  const data = await homeDashboardFacade.getDashboard();
  Object.assign(dashboard, data);
  state.loading = false;
});

function getOverallStatusLabel(status) {
  return status === "warning" ? t("home.status.warning") : t("home.status.active");
}

function getResourceLabel(resourceType) {
  const keys = {
    water: "monitoring.resources.water",
    gas: "monitoring.resources.gas",
  };

  return t(keys[resourceType] || "monitoring.resources.water");
}

function getSeverityLabel(severity) {
  const keys = {
    warning: "monitoring.status.warning",
    critical: "monitoring.status.critical",
  };

  return t(keys[severity] || "monitoring.status.warning");
}

function getAnomalyStatusLabel(status) {
  const keys = {
    open: "monitoring.status.open",
    resolved: "monitoring.status.resolved",
    closed: "monitoring.status.closed",
  };

  return t(keys[status] || "monitoring.status.open");
}

function getSiteStatusLabel(status) {
  const keys = {
    active: "workplace.status.active",
    inactive: "workplace.status.inactive",
    maintenance: "workplace.status.maintenance",
  };

  return t(keys[status] || "workplace.status.unknown");
}

function getDeviceStatusLabel(status) {
  const keys = {
    online: "deviceControl.status.online",
    offline: "deviceControl.status.offline",
    maintenance: "deviceControl.status.maintenance",
  };

  return t(keys[status] || "deviceControl.status.unknown");
}

function getTicketStatusLabel(status) {
  const keys = {
    open: "support.status.open",
    assigned: "support.status.assigned",
    resolved: "support.status.resolved",
    closed: "support.status.closed",
  };

  return t(keys[status] || "support.status.unknown");
}

function getPeriodLabel(period) {
  const keys = {
    daily: "monitoring.periods.daily",
    weekly: "monitoring.periods.weekly",
    monthly: "monitoring.periods.monthly",
  };

  return t(keys[period] || "monitoring.periods.custom");
}
</script>

<style scoped>
.home-dashboard {
  display: grid;
  gap: 22px;
}

.home-hero__content {
  display: grid;
  gap: 18px;
}

.home-hero__content p {
  max-width: 760px;
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1.55;
  margin: 0;
}

.home-hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.home-dashboard__wide {
  grid-column: span 2;
}

.home-list {
  display: grid;
  gap: 12px;
}

.home-list__item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.home-list__item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.home-list__item strong {
  display: block;
  color: var(--color-text);
  font-weight: 900;
  margin-bottom: 4px;
}

.home-list__item span {
  color: var(--color-text-muted);
  line-height: 1.35;
}

.plan-summary {
  display: grid;
  gap: 12px;
}

.plan-summary strong {
  color: var(--color-text);
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}

.plan-summary span {
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .home-dashboard__wide {
    grid-column: span 1;
  }
}

@media (max-width: 700px) {
  .home-list__item {
    flex-direction: column;
  }
}
</style>
