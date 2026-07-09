<template>
  <article class="valve-control">
    <div>
      <h3>{{ valve.name }}</h3>
      <p>{{ getResourceLabel(valve.resourceType) }} · {{ valve.openingPercentage }}%</p>
    </div>

    <div class="valve-control__actions">
      <span class="badge" :class="valve.isOpen ? 'badge-success' : 'badge-danger'">
        {{ getStatusLabel(valve.status) }}
      </span>

      <button
          v-if="valve.isOpen"
          class="btn-secondary"
          type="button"
          @click="$emit('close', valve.id)"
      >
        {{ t('deviceControl.actions.close') }}
      </button>

      <button
          v-else
          class="btn-secondary"
          type="button"
          @click="$emit('open', valve.id)"
      >
        {{ t('deviceControl.actions.open') }}
      </button>
    </div>
  </article>
</template>

<script setup>
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  valve: {
    type: Object,
    required: true,
  },
});

defineEmits(["close", "open"]);

const { t } = useTranslation();

function getResourceLabel(resourceType) {
  const keys = {
    water: "deviceControl.resources.water",
    gas: "deviceControl.resources.gas",
  };

  return t(keys[resourceType] ?? "deviceControl.resources.water");
}

function getStatusLabel(status) {
  const keys = {
    open: "deviceControl.status.open",
    closed: "deviceControl.status.closed",
    maintenance: "deviceControl.status.maintenance",
  };

  return t(keys[status] ?? "deviceControl.status.unknown");
}
</script>

<style scoped>
.valve-control {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.valve-control:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.valve-control h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
  margin: 0 0 4px;
}

.valve-control p {
  color: var(--color-text-muted);
  margin: 0;
}

.valve-control__actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 700px) {
  .valve-control,
  .valve-control__actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
