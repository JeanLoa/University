<template>
  <article class="sensor-card">
    <div>
      <h3>{{ sensor.name }}</h3>
      <p>{{ getResourceLabel(sensor.resourceType) }} · {{ sensor.currentValue }} {{ sensor.unit }}</p>
    </div>

    <span class="badge" :class="sensor.hasExceededThreshold ? 'badge-danger' : 'badge-success'">
      {{ sensor.hasExceededThreshold ? t('deviceControl.sensor.thresholdExceeded') : t('deviceControl.sensor.normal') }}
    </span>
  </article>
</template>

<script setup>
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  sensor: {
    type: Object,
    required: true,
  },
});

const { t } = useTranslation();

function getResourceLabel(resourceType) {
  const keys = {
    water: "deviceControl.resources.water",
    gas: "deviceControl.resources.gas",
  };

  return t(keys[resourceType] ?? "deviceControl.resources.water");
}
</script>

<style scoped>
.sensor-card {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.sensor-card:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.sensor-card h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
  margin: 0 0 4px;
}

.sensor-card p {
  color: var(--color-text-muted);
  margin: 0;
}

@media (max-width: 700px) {
  .sensor-card {
    flex-direction: column;
  }
}
</style>
