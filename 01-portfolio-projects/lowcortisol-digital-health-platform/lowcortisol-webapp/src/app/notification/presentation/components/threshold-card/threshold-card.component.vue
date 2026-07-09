<template>
  <article class="threshold-card">
    <div>
      <h3>{{ getResourceLabel(threshold.resourceType) }}</h3>
      <p>{{ threshold.siteId }} · {{ threshold.sensorId }}</p>
    </div>

    <div class="threshold-card__limits">
      <span class="badge badge-warning">
        {{ threshold.warningLimit }} {{ threshold.unit }}
      </span>

      <span class="badge badge-danger">
        {{ threshold.criticalLimit }} {{ threshold.unit }}
      </span>
    </div>
  </article>
</template>

<script setup>
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  threshold: {
    type: Object,
    required: true,
  },
});

const { t } = useTranslation();

function getResourceLabel(resourceType) {
  const keys = {
    water: "notifications.resource.water",
    gas: "notifications.resource.gas",
  };

  return t(keys[resourceType] ?? "notifications.resource.water");
}
</script>

<style scoped>
.threshold-card {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.threshold-card:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.threshold-card h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
  margin: 0 0 4px;
}

.threshold-card p {
  color: var(--color-text-muted);
  margin: 0;
}

.threshold-card__limits {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 700px) {
  .threshold-card {
    flex-direction: column;
  }
}
</style>