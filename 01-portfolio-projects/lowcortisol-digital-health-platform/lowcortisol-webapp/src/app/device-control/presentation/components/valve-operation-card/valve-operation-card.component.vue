<template>
  <article class="valve-operation-card">
    <div class="valve-operation-card__main">
      <div>
        <h3>{{ operationTitle }}</h3>
        <p>{{ reasonLabel }}</p>
      </div>

      <StatusBadge
          :status="operation.status"
          :label="statusLabel"
      />
    </div>

    <div class="valve-operation-card__meta">
      <span>{{ t("deviceControl.operations.valve") }}: {{ operation.valveId }}</span>
      <span>{{ t("deviceControl.operations.from") }}: {{ statusText(operation.previousStatus) }}</span>
      <span>{{ t("deviceControl.operations.to") }}: {{ statusText(operation.targetStatus) }}</span>
      <span v-if="operation.incidentId">{{ t("deviceControl.operations.incident") }}: {{ operation.incidentId }}</span>
      <span>{{ formattedDate }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const props = defineProps({
  operation: {
    type: Object,
    required: true,
  },
});

const { t } = useTranslation();

function statusText(status) {
  const keys = {
    open: "deviceControl.status.open",
    closed: "deviceControl.status.closed",
    opening: "deviceControl.status.opening",
    unknown: "deviceControl.status.unknown",
  };

  return t(keys[status] || keys.unknown);
}

const operationTitle = computed(() =>
    t("deviceControl.operations.closeValve")
);

const reasonLabel = computed(() => {
  const keys = {
    incident_mitigation: "deviceControl.operations.incidentMitigation",
    manual_operation: "deviceControl.operations.manualOperation",
  };

  return t(keys[props.operation.reason] || "deviceControl.operations.operationalAdjustment");
});

const statusLabel = computed(() => {
  const keys = {
    pending: "deviceControl.commands.pending",
    executed: "deviceControl.commands.executed",
    failed: "deviceControl.commands.failed",
    cancelled: "deviceControl.commands.cancelled",
  };

  return t(keys[props.operation.status] || "deviceControl.commands.executed");
});

const formattedDate = computed(() => {
  const value = props.operation.completedAt || props.operation.requestedAt || props.operation.createdAt;

  if (!value) return t("deviceControl.commands.noDate");

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
});
</script>

<style scoped>
.valve-operation-card {
  display: grid;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.valve-operation-card:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.valve-operation-card__main {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.valve-operation-card h3 {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.25;
  margin: 0 0 4px;
}

.valve-operation-card p {
  color: var(--color-text-muted);
  line-height: 1.45;
  margin: 0;
}

.valve-operation-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 800;
}

@media (max-width: 700px) {
  .valve-operation-card__main {
    flex-direction: column;
  }
}
</style>
