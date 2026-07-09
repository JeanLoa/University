<template>
  <article class="command-card">
    <div class="command-card__main">
      <div>
        <h3>{{ commandLabel }}</h3>
        <p>{{ command.reason || t("deviceControl.commands.noReason") }}</p>
      </div>

      <StatusBadge
          :status="command.status"
          :label="statusLabel"
      />
    </div>

    <div class="command-card__meta">
      <span>{{ t("deviceControl.commands.device") }}: {{ command.deviceId }}</span>
      <span v-if="command.valveId">{{ t("deviceControl.commands.valve") }}: {{ command.valveId }}</span>
      <span v-if="command.incidentId">{{ t("deviceControl.commands.incident") }}: {{ command.incidentId }}</span>
      <span>{{ t("deviceControl.commands.requestedBy") }}: {{ command.requestedBy || t("deviceControl.commands.operations") }}</span>
      <span>{{ formattedDate }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const props = defineProps({
  command: {
    type: Object,
    required: true,
  },
});

const { t } = useTranslation();

const commandLabel = computed(() => {
  const keys = {
    sync: "deviceControl.commands.sync",
    closeValve: "deviceControl.commands.closeValve",
    close_valve: "deviceControl.commands.closeValve",
    openValve: "deviceControl.commands.openValve",
    open_valve: "deviceControl.commands.openValve",
    reboot: "deviceControl.commands.reboot",
  };

  return t(keys[props.command.commandType] || "deviceControl.commands.command");
});

const statusLabel = computed(() => {
  const keys = {
    pending: "deviceControl.commands.pending",
    executed: "deviceControl.commands.executed",
    failed: "deviceControl.commands.failed",
    cancelled: "deviceControl.commands.cancelled",
  };

  return t(keys[props.command.status] || "deviceControl.commands.pending");
});

const formattedDate = computed(() => {
  const value = props.command.executedAt || props.command.requestedAt || props.command.createdAt;

  if (!value) return t("deviceControl.commands.noDate");

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
});
</script>

<style scoped>
.command-card {
  display: grid;
  gap: 12px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
}

.command-card:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.command-card__main {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.command-card h3 {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.25;
  margin: 0 0 4px;
}

.command-card p {
  color: var(--color-text-muted);
  line-height: 1.45;
  margin: 0;
}

.command-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 800;
}

@media (max-width: 700px) {
  .command-card__main {
    flex-direction: column;
  }
}
</style>
