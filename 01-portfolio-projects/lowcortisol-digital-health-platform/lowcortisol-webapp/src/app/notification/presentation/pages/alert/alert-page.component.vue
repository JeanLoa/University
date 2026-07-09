<template>
  <AppLayout>
    <PageHeader
        :eyebrow="t('notifications.center.eyebrow')"
        :title="t('notifications.center.title')"
        :subtitle="t('notifications.center.subtitle')"
    >
      <template #actions>
        <StatusBadge
            v-if="state.usingFallback"
            status="warning"
            :label="t('notifications.center.fallbackMode')"
        />

        <UiButton
            variant="neutral"
            :label="t('notifications.actions.refresh')"
            :disabled="state.loading"
            @click="loadNotificationCenter"
        />
      </template>
    </PageHeader>

    <section class="notification-metrics">
      <MetricCard
          :label="t('notifications.metrics.openAlerts')"
          :value="state.summary.openAlerts"
          :hint="t('notifications.metrics.openAlertsHint')"
          status="warning"
          :status-label="t('notifications.status.open')"
      />
      <MetricCard
          :label="t('notifications.metrics.criticalAlerts')"
          :value="state.summary.criticalAlerts"
          :hint="t('notifications.metrics.criticalAlertsHint')"
          status="critical"
          :status-label="t('notifications.severity.critical')"
      />
      <MetricCard
          :label="t('notifications.metrics.openIncidents')"
          :value="state.summary.openIncidents"
          :hint="t('notifications.metrics.openIncidentsHint')"
          status="assigned"
          :status-label="t('notifications.incidentStatus.open')"
      />
      <MetricCard
          :label="t('notifications.metrics.activeChannels')"
          :value="state.summary.channelsEnabled"
          :hint="t('notifications.metrics.activeChannelsHint')"
          status="active"
          :status-label="t('notifications.channelStatus.active')"
      />
      <MetricCard
          :label="t('notifications.metrics.pendingDeliveries')"
          :value="state.summary.pendingDeliveries"
          :hint="t('notifications.metrics.pendingDeliveriesHint')"
          status="pending"
          :status-label="t('notifications.deliveryStatus.pending')"
      />
    </section>

    <LoadingState
        v-if="state.loading"
        :title="t('notifications.center.loadingTitle')"
        :description="t('notifications.center.loadingDescription')"
    />

    <section v-else class="notification-console">
      <p v-if="state.error" class="notification-message notification-message--error">
        {{ t(state.error) }}
      </p>

      <p v-if="state.message" class="notification-message notification-message--success">
        {{ t(state.message) }}
      </p>

      <div class="notification-main-grid">
        <UiCard :title="t('notifications.center.openAlerts')" class="notification-panel">
          <EmptyState
              v-if="state.alerts.length === 0"
              compact
              :title="t('notifications.empty.noAlerts')"
              :description="t('notifications.empty.noAlertsDescription')"
          />

          <div v-else class="notification-list">
            <AlertCard
                v-for="alert in state.alerts"
                :key="alert.id"
                :alert="alert"
                :busy="state.saving"
                @acknowledge="handleAcknowledgeAlert"
                @resolve="handleResolveAlert"
                @close="handleCloseAlert"
                @create-incident="handleCreateIncidentFromAlert"
            />
          </div>
        </UiCard>

        <UiCard :title="t('notifications.center.openIncidents')" class="notification-panel">
          <EmptyState
              v-if="state.openIncidents.length === 0"
              compact
              :title="t('notifications.empty.noIncidents')"
              :description="t('notifications.empty.noIncidentsDescription')"
          />

          <div v-else class="notification-list">
            <IncidentCard
                v-for="incident in state.openIncidents"
                :key="incident.id"
                :incident="incident"
                :busy="state.saving || state.mitigationLoading"
                @assign="openAssignModal"
                @register-action="openIncidentActionModal"
                @mitigate="openMitigationModal"
                @resolve="handleResolveIncident"
                @close="handleCloseIncident"
            />
          </div>
        </UiCard>
      </div>

      <div class="notification-support-grid">
        <UiCard :title="t('notifications.center.notificationChannels')" class="notification-panel">
          <EmptyState
              v-if="state.channels.length === 0"
              compact
              :title="t('notifications.empty.noChannels')"
              :description="t('notifications.empty.noChannelsDescription')"
              :action-label="t('notifications.actions.createInAppChannel')"
              @action="handleCreateInAppChannel"
          />

          <div v-else class="notification-list">
            <NotificationChannelCard
                v-for="channel in state.channels"
                :key="channel.id"
                :channel="channel"
                :busy="state.saving"
                @activate="activateChannel"
                @deactivate="deactivateChannel"
            />
          </div>
        </UiCard>

        <UiCard :title="t('notifications.center.deliveries')" class="notification-panel">
          <EmptyState
              v-if="recentDeliveries.length === 0"
              compact
              :title="t('notifications.empty.noDeliveries')"
              :description="t('notifications.empty.noDeliveriesDescription')"
          />

          <div v-else class="delivery-list">
            <AlertDeliveryCard
                v-for="delivery in recentDeliveries"
                :key="delivery.id"
                :delivery="delivery"
            />
          </div>
        </UiCard>
      </div>
    </section>

    <AssignIncidentModal
        :open="assignModalOpen"
        :incident="selectedIncident"
        @close="closeAssignModal"
        @submit="handleAssignIncident"
    />

    <IncidentActionModal
        :open="incidentActionModalOpen"
        @close="closeIncidentActionModal"
        @submit="handleRegisterIncidentAction"
    />

    <IncidentMitigationModal
        :open="mitigationModalOpen"
        :incident="selectedIncident"
        :valves="deviceControlState.valves"
        :devices="deviceControlState.devices"
        :busy="state.mitigationLoading"
        @close="closeMitigationModal"
        @submit="handleRequestIncidentMitigation"
    />
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import EmptyState from "../../../../shared/presentation/components/empty-state/empty-state.component.vue";
import LoadingState from "../../../../shared/presentation/components/loading-state/loading-state.component.vue";
import MetricCard from "../../../../shared/presentation/components/metric-card/metric-card.component.vue";
import PageHeader from "../../../../shared/presentation/components/page-header/page-header.component.vue";
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import AlertCard from "../../components/alert-card/alert-card.component.vue";
import AlertDeliveryCard from "../../components/alert-delivery-card/alert-delivery-card.component.vue";
import AssignIncidentModal from "../../components/assign-incident-modal/assign-incident-modal.component.vue";
import IncidentActionModal from "../../components/incident-action-modal/incident-action-modal.component.vue";
import IncidentCard from "../../components/incident-card/incident-card.component.vue";
import IncidentMitigationModal from "../../components/incident-mitigation-modal/incident-mitigation-modal.component.vue";
import NotificationChannelCard from "../../components/notification-channel-card/notification-channel-card.component.vue";

import { useNotificationStore } from "../../../application/store/notification.store";
import { useDeviceControlStore } from "../../../../device-control/application/store/device-control.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const {
  state,
  loadNotificationCenter,
  acknowledgeAlert,
  resolveAlert,
  closeAlert,
  createIncidentFromAlert,
  assignIncident,
  registerIncidentAction,
  requestIncidentMitigation,
  resolveIncident,
  closeIncident,
  createChannel,
  activateChannel,
  deactivateChannel,
} = useNotificationStore();

const {
  state: deviceControlState,
  loadDevicePage,
} = useDeviceControlStore();

const { t } = useTranslation();
const assignModalOpen = ref(false);
const incidentActionModalOpen = ref(false);
const mitigationModalOpen = ref(false);
const selectedIncidentId = ref(null);

const selectedIncident = computed(() =>
    state.openIncidents.find((incident) => incident.id === selectedIncidentId.value) || null
);

const recentDeliveries = computed(() =>
    [...state.deliveries]
        .sort((left, right) => {
          const leftDate = left.sentAt || left.attemptedAt || left.createdAt;
          const rightDate = right.sentAt || right.attemptedAt || right.createdAt;

          return new Date(rightDate).getTime() - new Date(leftDate).getTime();
        })
        .slice(0, 6)
);

onMounted(async () => {
  await Promise.all([
    loadNotificationCenter(),
    loadDevicePage(),
  ]);
});

async function handleAcknowledgeAlert(alertId) {
  await acknowledgeAlert(alertId, {
    acknowledgedBy: t("notifications.center.defaultOperator"),
  });
}

async function handleResolveAlert(alertId) {
  await resolveAlert(alertId, {
    resolvedBy: t("notifications.center.defaultOperator"),
    note: t("notifications.center.defaultResolution"),
  });
}

async function handleCloseAlert(alertId) {
  await closeAlert(alertId, {
    closedBy: t("notifications.center.defaultOperator"),
    note: t("notifications.center.defaultClosingNote"),
  });
}

async function handleCreateIncidentFromAlert(alertId) {
  await createIncidentFromAlert(alertId);
}

function openAssignModal(incident) {
  selectedIncidentId.value = incident.id;
  assignModalOpen.value = true;
}

function closeAssignModal() {
  assignModalOpen.value = false;
}

async function handleAssignIncident(payload) {
  await assignIncident(selectedIncidentId.value, payload);
  closeAssignModal();
}

function openIncidentActionModal(incident) {
  selectedIncidentId.value = incident.id;
  incidentActionModalOpen.value = true;
}

function closeIncidentActionModal() {
  incidentActionModalOpen.value = false;
}

async function handleRegisterIncidentAction(payload) {
  await registerIncidentAction(selectedIncidentId.value, payload);
  closeIncidentActionModal();
}

function openMitigationModal(incident) {
  selectedIncidentId.value = incident.id;
  mitigationModalOpen.value = true;
}

function closeMitigationModal() {
  mitigationModalOpen.value = false;
}

async function handleRequestIncidentMitigation(payload) {
  await requestIncidentMitigation(selectedIncidentId.value, payload);
  await loadDevicePage();
  closeMitigationModal();
}

async function handleResolveIncident(incidentId) {
  await resolveIncident(incidentId, {
    resolvedBy: t("notifications.center.defaultOperator"),
    resolution: t("notifications.center.defaultResolution"),
  });
}

async function handleCloseIncident(incidentId) {
  await closeIncident(incidentId, {
    closedBy: t("notifications.center.defaultOperator"),
    closingNote: t("notifications.center.defaultClosingNote"),
  });
}

async function handleCreateInAppChannel() {
  await createChannel({
    name: t("notifications.center.inAppChannel"),
    type: "in_app",
    isActive: true,
  });
}
</script>

<style scoped>
.notification-metrics {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.notification-console {
  display: grid;
  gap: 22px;
}

.notification-main-grid,
.notification-support-grid {
  display: grid;
  gap: 20px;
}

.notification-main-grid {
  grid-template-columns: minmax(0, 1.06fr) minmax(0, 1fr);
  align-items: start;
}

.notification-support-grid {
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  align-items: start;
}

.notification-panel {
  min-width: 0;
  overflow: hidden;
}

.notification-list,
.delivery-list {
  display: grid;
  gap: 14px;
}

.notification-message {
  grid-column: 1 / -1;
  border-radius: var(--radius-md);
  font-weight: 900;
  margin: 0;
  padding: 14px 16px;
}

.notification-message--success {
  border: 1px solid #bbf7d0;
  background: #ecfdf5;
  color: var(--color-success);
}

.notification-message--error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: var(--color-danger);
}

@media (max-width: 1180px) {
  .notification-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .notification-main-grid,
  .notification-support-grid,
  .notification-metrics {
    grid-template-columns: 1fr;
  }
}
</style>
