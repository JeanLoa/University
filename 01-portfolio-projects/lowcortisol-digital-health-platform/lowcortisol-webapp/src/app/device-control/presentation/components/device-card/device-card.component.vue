<template>
  <button
      type="button"
      class="device-card"
      :class="{ 'device-card--active': active }"
  >
    <div>
      <h3>{{ device.name }}</h3>
      <p>
        {{ getDeviceTypeLabel(device.type) }}
        <span v-if="device.physicalPath"> - {{ device.physicalPath }}</span>
      </p>
    </div>

    <span class="badge" :class="device.isOnline ? 'badge-success' : 'badge-warning'">
      {{ getStatusLabel(device.status) }}
    </span>
  </button>
</template>

<script setup>
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  device: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const { t } = useTranslation();

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
</script>

<style scoped>
.device-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 16px;
  text-align: left;
}

.device-card--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.device-card h3 {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  margin: 0 0 4px;
}

.device-card p {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
