<template>
  <article
      class="device-group-card"
      :class="{ 'device-group-card--active': active }"
      role="button"
      tabindex="0"
      @click="$emit('select', deviceGroup.id)"
      @keyup.enter="$emit('select', deviceGroup.id)"
  >
    <header class="device-group-card__header">
      <div>
        <h4>{{ deviceGroup.name }}</h4>
        <p>{{ getResourceLabel(deviceGroup.resourceType) }}</p>
      </div>

      <StatusBadge :status="deviceGroup.status" :label="getStatusLabel(deviceGroup.status)" />
    </header>

    <dl class="device-group-card__metrics">
      <div>
        <dt>{{ t('workplace.physical.devices') }}</dt>
        <dd>{{ deviceGroup.devices.length }}</dd>
      </div>
      <div>
        <dt>{{ t('workplace.physical.sensors') }}</dt>
        <dd>{{ deviceGroup.sensors.length }}</dd>
      </div>
      <div>
        <dt>{{ t('workplace.physical.valves') }}</dt>
        <dd>{{ deviceGroup.valves.length }}</dd>
      </div>
    </dl>
  </article>
</template>

<script setup>
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  deviceGroup: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["select"]);

const { t } = useTranslation();

function getResourceLabel(resourceType) {
  const keys = {
    water: "workplace.resources.water",
    gas: "workplace.resources.gas",
    mixed: "workplace.resources.mixed",
  };

  return t(keys[resourceType] ?? "workplace.resources.mixed");
}

function getStatusLabel(status) {
  const keys = {
    active: "workplace.status.active",
    inactive: "workplace.status.inactive",
    maintenance: "workplace.status.maintenance",
  };

  return t(keys[status] ?? "workplace.status.unknown");
}

</script>

<style scoped>
.device-group-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  cursor: pointer;
  padding: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.device-group-card:hover,
.device-group-card--active {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-soft);
  transform: translateY(-1px);
}

.device-group-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.device-group-card h4 {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 900;
  margin: 0 0 4px;
}

.device-group-card p {
  color: var(--color-text-muted);
  font-size: 13px;
  margin: 0;
}

.device-group-card__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 14px 0 0;
}

.device-group-card__metrics div {
  border-radius: var(--radius-sm);
  background: var(--color-surface-soft);
  padding: 10px;
}

.device-group-card__metrics dt {
  color: var(--color-text-muted);
  font-size: 12px;
  margin: 0 0 4px;
}

.device-group-card__metrics dd {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  margin: 0;
}
</style>
