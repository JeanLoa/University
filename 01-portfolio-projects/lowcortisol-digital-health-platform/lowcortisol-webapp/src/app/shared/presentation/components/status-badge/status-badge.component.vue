<template>
  <span class="status-badge" :class="`status-badge--${tone}`">
    {{ label || status }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    default: "active",
  },
  label: {
    type: String,
    default: "",
  },
});

const tone = computed(() => {
  const tones = {
    active: "success",
    paid: "success",
    resolved: "success",
    open: "warning",
    assigned: "warning",
    pending: "warning",
    warning: "warning",
    maintenance: "warning",
    critical: "danger",
    danger: "danger",
    failed: "danger",
    inactive: "neutral",
    closed: "neutral",
    cancelled: "neutral",
    offline: "neutral",
  };

  return tones[props.status] || "info";
});
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  flex: 0 0 auto;
  width: fit-content;
  max-width: 100%;
  min-height: 28px;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  padding: 7px 11px;
  white-space: nowrap;
}

.status-badge--success {
  border-color: #bbf7d0;
  background: #ecfdf5;
  color: var(--color-success);
}

.status-badge--warning {
  border-color: #fde68a;
  background: #fffbeb;
  color: var(--color-warning);
}

.status-badge--danger {
  border-color: #fecaca;
  background: #fef2f2;
  color: var(--color-danger);
}

.status-badge--neutral {
  border-color: var(--color-border);
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
}

.status-badge--info {
  border-color: #bae6fd;
  background: #f0f9ff;
  color: var(--color-info);
}
</style>
