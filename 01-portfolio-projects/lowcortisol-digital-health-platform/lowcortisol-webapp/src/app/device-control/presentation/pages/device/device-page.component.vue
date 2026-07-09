<template>
  <AppLayout>
    <section class="page-header">
      <div>
        <h1 class="page-title">
          {{ t('deviceControl.devices.title') }}
        </h1>

        <p class="page-subtitle">
          {{ t('deviceControl.devices.subtitle') }}
        </p>
      </div>

      <button class="btn-primary" type="button" @click="handleCreateDevice">
        {{ t('deviceControl.devices.addDevice') }}
      </button>
    </section>

    <section class="grid grid-3 devices-summary">
      <UiCard :title="t('deviceControl.devices.registeredDevices')" compact>
        <p class="summary-number">{{ state.summary.totalDevices }}</p>
        <p class="summary-label">{{ t('deviceControl.devices.registeredDevices') }}</p>
      </UiCard>

      <UiCard :title="t('deviceControl.devices.activeSensors')" compact>
        <p class="summary-number">{{ state.summary.activeSensors }}</p>
        <p class="summary-label">{{ t('deviceControl.devices.activeSensors') }}</p>
      </UiCard>

      <UiCard :title="t('deviceControl.devices.closedValves')" compact>
        <p class="summary-number">{{ state.summary.closedValves }}</p>
        <p class="summary-label">{{ t('deviceControl.devices.closedValves') }}</p>
      </UiCard>

      <UiCard :title="t('deviceControl.devices.openValves')" compact>
        <p class="summary-number">{{ state.summary.openValves }}</p>
        <p class="summary-label">{{ t('deviceControl.devices.openValves') }}</p>
      </UiCard>

      <UiCard :title="t('deviceControl.devices.commandsExecuted')" compact>
        <p class="summary-number">{{ state.summary.commandsExecuted }}</p>
        <p class="summary-label">{{ t('deviceControl.devices.commandsExecuted') }}</p>
      </UiCard>

      <UiCard :title="t('deviceControl.devices.incidentMitigations')" compact>
        <p class="summary-number">{{ state.summary.incidentMitigations || 0 }}</p>
        <p class="summary-label">{{ t('deviceControl.devices.incidentMitigations') }}</p>
      </UiCard>
    </section>

    <section class="grid grid-2">
      <UiCard :title="t('deviceControl.devices.devicesList')">
        <div v-if="state.loading" class="empty-state">
          {{ t('deviceControl.devices.loading') }}
        </div>

        <div v-else-if="state.error" class="error-state">
          {{ state.error }}
        </div>

        <div v-else-if="state.devices.length === 0" class="empty-state">
          {{ t('deviceControl.devices.noDevices') }}
        </div>

        <div v-else class="device-list">
          <DeviceCard
              v-for="device in state.devices"
              :key="device.id"
              :device="device"
              :active="device.id === state.selectedDeviceId"
              @click="selectDevice(device.id)"
          />
        </div>
      </UiCard>

      <UiCard :title="t('deviceControl.devices.deviceDetail')">
        <div v-if="selectedDevice" class="detail">
          <div class="detail-header">
            <div>
              <h3>{{ selectedDevice.name }}</h3>
              <p>
                {{ getDeviceTypeLabel(selectedDevice.type) }}
                <span v-if="selectedDevice.physicalPath"> - {{ selectedDevice.physicalPath }}</span>
              </p>
            </div>

            <span class="badge" :class="selectedDevice.isOnline ? 'badge-success' : 'badge-warning'">
              {{ getStatusLabel(selectedDevice.status) }}
            </span>
          </div>

          <div class="metric-list">
            <div class="metric-row">
              <span>{{ t('deviceControl.devices.physicalLocation') }}</span>
              <strong>{{ selectedDevice.physicalPath || selectedDevice.siteName }}</strong>
            </div>

            <div class="metric-row">
              <span>{{ t('deviceControl.devices.linkedSensorsCount') }}</span>
              <strong>{{ selectedDevice.sensors.length }}</strong>
            </div>

            <div class="metric-row">
              <span>{{ t('deviceControl.devices.availableValves') }}</span>
              <strong>{{ selectedDevice.valves.length }}</strong>
            </div>

            <div class="metric-row">
              <span>{{ t('deviceControl.devices.executedCommands') }}</span>
              <strong>{{ selectedDevice.commands.length }}</strong>
            </div>
          </div>

          <button class="btn-secondary full-button" type="button" @click="handleExecuteCommand">
            {{ t('deviceControl.devices.syncDevice') }}
          </button>
        </div>

        <div v-else class="empty-state">
          {{ t('deviceControl.devices.selectDevice') }}
        </div>
      </UiCard>
    </section>

    <section class="grid grid-2 devices-bottom">
      <UiCard :title="t('deviceControl.devices.linkedSensors')">
        <div v-if="selectedDeviceSensors.length === 0" class="empty-state">
          {{ t('deviceControl.devices.noSensors') }}
        </div>

        <div v-else class="relation-list">
          <SensorCard
              v-for="sensor in selectedDeviceSensors"
              :key="sensor.id"
              :sensor="sensor"
          />
        </div>

        <button class="btn-secondary full-button" type="button" @click="handleLinkSensor">
          {{ t('deviceControl.devices.linkSensor') }}
        </button>
      </UiCard>

      <UiCard :title="t('deviceControl.devices.valveControl')">
        <div v-if="selectedDeviceValves.length === 0" class="empty-state">
          {{ t('deviceControl.devices.noValves') }}
        </div>

        <div v-else class="relation-list">
          <ValveControl
              v-for="valve in selectedDeviceValves"
              :key="valve.id"
              :valve="valve"
              @close="closeValve"
              @open="openValve"
          />
        </div>
      </UiCard>
    </section>

    <section class="grid grid-2 devices-bottom">
      <UiCard :title="t('deviceControl.devices.recentCommands')">
        <div v-if="selectedDeviceCommands.length === 0" class="empty-state">
          {{ t('deviceControl.devices.noCommands') }}
        </div>

        <div v-else class="command-list">
          <DeviceCommandCard
              v-for="command in selectedDeviceCommands"
              :key="command.id"
              :command="command"
          />
        </div>
      </UiCard>

      <UiCard :title="t('deviceControl.devices.valveOperations')">
        <div v-if="selectedDeviceValveOperations.length === 0" class="empty-state">
          {{ t('deviceControl.devices.noValveOperations') }}
        </div>

        <div v-else class="command-list">
          <ValveOperationCard
              v-for="operation in selectedDeviceValveOperations"
              :key="operation.id"
              :operation="operation"
          />
        </div>
      </UiCard>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted } from "vue";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import DeviceCommandCard from "../../components/device-command-card/device-command-card.component.vue";
import DeviceCard from "../../components/device-card/device-card.component.vue";
import SensorCard from "../../components/sensor-card/sensor-card.component.vue";
import ValveControl from "../../components/valve-control/valve-control.component.vue";
import ValveOperationCard from "../../components/valve-operation-card/valve-operation-card.component.vue";

import { useDeviceControlStore } from "../../../application/store/device-control.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const {
  state,
  loadDevicePage,
  selectDevice,
  getSelectedDevice,
  getSelectedDeviceCommands,
  getSelectedDeviceValveOperations,
  createDevice,
  linkSensor,
  closeValve,
  openValve,
  executeSyncCommand,
} = useDeviceControlStore();

const { t } = useTranslation();

const selectedDevice = computed(() => getSelectedDevice());

const selectedDeviceSensors = computed(() => selectedDevice.value?.sensors ?? []);
const selectedDeviceValves = computed(() => selectedDevice.value?.valves ?? []);
const selectedDeviceCommands = computed(() => getSelectedDeviceCommands().slice(0, 6));
const selectedDeviceValveOperations = computed(() => getSelectedDeviceValveOperations().slice(0, 6));

onMounted(async () => {
  await loadDevicePage();
});

async function handleCreateDevice() {
  const nextNumber = state.summary.totalDevices + 1;
  const targetDevice = selectedDevice.value || state.devices[0] || null;

  await createDevice({
    siteId: targetDevice?.siteId || "SITE-001",
    roomId: targetDevice?.roomId || "",
    deviceGroupId: targetDevice?.deviceGroupId || "",
    name: `${t('deviceControl.devices.additionalHub')} ${nextNumber}`,
    type: "hub",
    status: "online",
  });
}

async function handleLinkSensor() {
  if (!selectedDevice.value) return;

  const nextNumber = state.summary.totalSensors + 1;
  const isGas = nextNumber % 2 === 0;

  await linkSensor({
    deviceId: selectedDevice.value.id,
    siteId: selectedDevice.value.siteId,
    roomId: selectedDevice.value.roomId,
    deviceGroupId: selectedDevice.value.deviceGroupId,
    name: `${t('deviceControl.devices.linkedSensor')} ${nextNumber}`,
    resourceType: isGas ? "gas" : "water",
    unit: isGas ? "m3" : "L",
    threshold: isGas ? 120 : 300,
  });
}

async function handleExecuteCommand() {
  if (!selectedDevice.value) return;

  await executeSyncCommand(selectedDevice.value.id);
}

function getDeviceTypeLabel(type) {
  const keys = {
    hub: "deviceControl.types.hub",
    sensor: "deviceControl.types.sensor",
    valve: "deviceControl.types.valve",
  };

  return t(keys[type] ?? "deviceControl.types.device");
}

function getStatusLabel(status) {
  const keys = {
    online: "deviceControl.status.online",
    offline: "deviceControl.status.offline",
    maintenance: "deviceControl.status.maintenance",
  };

  return t(keys[status] ?? "deviceControl.status.unknown");
}

function getCommandLabel(commandType) {
  const keys = {
    sync: "deviceControl.commands.sync",
    closeValve: "deviceControl.commands.closeValve",
    openValve: "deviceControl.commands.openValve",
    reboot: "deviceControl.commands.reboot",
  };

  return t(keys[commandType] ?? "deviceControl.commands.command");
}

function getCommandStatusLabel(status) {
  const keys = {
    pending: "deviceControl.commands.pending",
    executed: "deviceControl.commands.executed",
    failed: "deviceControl.commands.failed",
  };

  return t(keys[status] ?? "deviceControl.commands.pending");
}
</script>

<style scoped>
.devices-summary {
  margin-bottom: 20px;
}

.devices-bottom {
  margin-top: 20px;
}

.summary-number {
  color: var(--color-text);
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
  margin: 0 0 8px;
}

.summary-label {
  color: var(--color-text-muted);
  margin: 0;
}

.empty-state,
.error-state {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  padding: 18px;
}

.error-state {
  color: var(--color-danger);
  background: #fef2f2;
  border-color: #fecaca;
}

.device-list,
.relation-list,
.command-list {
  display: grid;
  gap: 14px;
}

.detail {
  display: grid;
  gap: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.detail-header h3 {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 900;
  margin: 0 0 4px;
}

.detail-header p {
  color: var(--color-text-muted);
  margin: 0;
}

.metric-list {
  display: grid;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
  padding: 14px 0;
}

.metric-row:first-child {
  padding-top: 0;
}

.metric-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metric-row span {
  color: var(--color-text-muted);
}

.metric-row strong {
  color: var(--color-text);
  font-weight: 900;
}

.full-button {
  width: 100%;
}

.command-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.command-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.command-item strong {
  display: block;
  color: var(--color-text);
  margin-bottom: 4px;
}

.command-item span {
  color: var(--color-text-muted);
  margin: 0;
}

@media (max-width: 700px) {
  .detail-header,
  .metric-row,
  .command-item {
    flex-direction: column;
  }
}
</style>
