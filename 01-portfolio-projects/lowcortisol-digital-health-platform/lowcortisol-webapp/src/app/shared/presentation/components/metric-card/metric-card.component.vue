<template>
  <UiCard class="metric-card" variant="metric" compact>
    <div class="metric-card__header">
      <span v-if="icon" class="metric-card__icon" aria-hidden="true">
        {{ icon }}
      </span>

      <StatusBadge
          v-if="status"
          :status="status"
          :label="statusLabel"
      />
    </div>

    <p class="metric-card__label">
      {{ label }}
    </p>

    <strong class="metric-card__value">
      {{ value }}
    </strong>

    <p v-if="hint" class="metric-card__hint">
      {{ hint }}
    </p>
  </UiCard>
</template>

<script setup>
import UiCard from "../ui-card/ui-card.component.vue";
import StatusBadge from "../status-badge/status-badge.component.vue";

defineProps({
  label: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Number],
    default: 0,
  },
  hint: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    default: "",
  },
  statusLabel: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.metric-card {
  min-height: 158px;
}

.metric-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  min-height: 28px;
  margin-bottom: 14px;
}

.metric-card__icon {
  display: inline-grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 900;
}

.metric-card__label {
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 900;
  margin: 0 0 8px;
}

.metric-card__value {
  display: block;
  color: var(--color-text);
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
}

.metric-card__hint {
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.35;
  margin: 10px 0 0;
}
</style>
