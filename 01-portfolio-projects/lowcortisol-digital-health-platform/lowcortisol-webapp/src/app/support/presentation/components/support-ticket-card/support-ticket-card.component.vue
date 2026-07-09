<template>
  <button
      type="button"
      class="ticket-card"
      :class="{ 'ticket-card--active': active }"
  >
    <div>
      <h3>{{ ticket.title }}</h3>
      <p>{{ ticket.description }}</p>

      <div class="ticket-card__meta">
        <span class="badge badge-primary">
          {{ getCategoryLabel(ticket.category) }}
        </span>

        <span class="badge" :class="priorityClass">
          {{ getPriorityLabel(ticket.priority) }}
        </span>

        <span class="badge badge-success">
          {{ getStatusLabel(ticket.status) }}
        </span>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const { t } = useTranslation();

const priorityClass = computed(() => {
  const classes = {
    low: "badge-primary",
    medium: "badge-warning",
    high: "badge-danger",
    critical: "badge-danger",
  };

  return classes[props.ticket.priority] ?? "badge-primary";
});

function getCategoryLabel(category) {
  const keys = {
    technical: "support.category.technical",
    billing: "support.category.billing",
    device: "support.category.device",
    incident: "support.category.incident",
  };

  return t(keys[category] ?? "support.category.support");
}

function getPriorityLabel(priority) {
  const keys = {
    low: "support.priority.low",
    medium: "support.priority.medium",
    high: "support.priority.high",
    critical: "support.priority.critical",
  };

  return t(keys[priority] ?? "support.priority.unknown");
}

function getStatusLabel(status) {
  const keys = {
    open: "support.status.open",
    assigned: "support.status.assigned",
    resolved: "support.status.resolved",
    closed: "support.status.closed",
  };

  return t(keys[status] ?? "support.status.unknown");
}
</script>

<style scoped>
.ticket-card {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 16px;
  text-align: left;
}

.ticket-card--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.ticket-card h3 {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  margin: 0 0 6px;
}

.ticket-card p {
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.ticket-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}
</style>