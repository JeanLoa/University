<template>
  <article class="incident-card" :class="`incident-card--${incident.priority}`">
    <div class="incident-card__header">
      <div>
        <p class="incident-card__eyebrow">
          {{ t("notifications.center.incident") }}
        </p>
        <h3>{{ displayTitle }}</h3>
      </div>

      <div class="incident-card__badges">
        <StatusBadge
            :status="incident.priority"
            :label="t(`notifications.priority.${incident.priority}`)"
        />
        <StatusBadge
            :status="incident.status"
          :label="t(`notifications.incidentStatus.${incident.status}`)"
        />
      </div>
    </div>

    <p class="incident-card__description">
      {{ displayDescription }}
    </p>

    <div class="incident-card__details">
      <div>
        <span>{{ t("notifications.center.assignedTo") }}</span>
        <strong>{{ incident.assignedTo || t("notifications.center.notAssigned") }}</strong>
      </div>
      <div>
        <span>{{ t("notifications.center.actions") }}</span>
        <strong>{{ incident.actions?.length || 0 }}</strong>
      </div>
      <div>
        <span>{{ t("notifications.center.lastMitigation") }}</span>
        <strong>{{ lastMitigationLabel }}</strong>
      </div>
    </div>

    <div class="incident-card__actions">
      <UiButton
          variant="neutral"
          :label="t('notifications.actions.assignIncident')"
          :disabled="busy"
          @click="$emit('assign', incident)"
      />
      <UiButton
          variant="neutral"
          :label="t('notifications.actions.registerAction')"
          :disabled="busy"
          @click="$emit('registerAction', incident)"
      />
      <UiButton
          v-if="canMitigate"
          variant="danger"
          :label="t('notifications.actions.mitigateIncident')"
          :disabled="busy"
          @click="$emit('mitigate', incident)"
      />
      <UiButton
          v-if="incident.status !== 'resolved' && incident.status !== 'closed'"
          variant="action"
          :label="t('notifications.actions.resolveIncident')"
          :disabled="busy"
          @click="$emit('resolve', incident.id)"
      />
      <UiButton
          v-if="incident.status !== 'closed'"
          variant="danger"
          :label="t('notifications.actions.closeIncident')"
          :disabled="busy"
          @click="$emit('close', incident.id)"
      />
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const props = defineProps({
  incident: {
    type: Object,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["assign", "registerAction", "mitigate", "resolve", "close"]);

const { t } = useTranslation();

const displayTitle = computed(() => translateOperationalText(props.incident.title, "Incidente operativo"));
const displayDescription = computed(() =>
    translateOperationalText(props.incident.description, "Sin detalle operativo registrado.")
);
const canMitigate = computed(() => {
  const priorityAllows = ["critical", "high"].includes(props.incident.priority);
  const statusAllows = ["open", "assigned", "in_progress"].includes(props.incident.status);

  return priorityAllows && statusAllows;
});

const lastMitigationAction = computed(() =>
    [...(props.incident.actions || [])]
        .filter((action) => action.actionType === "valve_closed")
        .sort((left, right) =>
            new Date(right.performedAt || right.createdAt).getTime() -
            new Date(left.performedAt || left.createdAt).getTime()
        )[0] || null
);

const lastMitigationLabel = computed(() =>
    lastMitigationAction.value?.performedBy || t("notifications.center.noMitigation")
);

function translateOperationalText(value, fallback) {
  const text = String(value || "").trim();

  if (!text) return fallback;

  if (/incident for critical anomaly detected/i.test(text)) {
    return "Incidente por anomalía crítica";
  }

  if (/critical anomaly detected/i.test(text)) {
    return "Anomalía crítica detectada";
  }

  const criticalReading = text.match(/Reading\s+([\d.,]+)\s*([a-zA-Z0-9³]+)\s+exceeded critical limit\s+([\d.,]+)\s*([a-zA-Z0-9³]+)?/i);

  if (criticalReading) {
    const unit = criticalReading[2] || criticalReading[4] || "";
    return `Lectura de ${criticalReading[1]} ${unit} sobrepasó el límite crítico de ${criticalReading[3]} ${unit}.`;
  }

  return text;
}
</script>

<style scoped>
.incident-card {
  display: grid;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  padding: 16px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.03);
}

.incident-card--critical {
  border-color: #fecaca;
  background: #fffafa;
}

.incident-card--high {
  border-color: #fed7aa;
  background: #fff7ed;
}

.incident-card__header {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.incident-card__badges,
.incident-card__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.incident-card__eyebrow {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin: 0 0 6px;
  text-transform: uppercase;
}

.incident-card h3 {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.2;
  margin: 0;
}

.incident-card__description {
  color: var(--color-text-muted);
  line-height: 1.45;
  margin: 0;
}

.incident-card__details {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.incident-card__details div {
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.68);
  padding: 10px 12px;
}

.incident-card__details span {
  display: block;
  color: var(--color-text-muted);
  font-size: 12px;
  margin-bottom: 4px;
}

.incident-card__details strong {
  display: block;
  overflow: hidden;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.incident-card__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.incident-card__actions :deep(.ui-button) {
  width: 100%;
}

@media (max-width: 700px) {
  .incident-card__header {
    flex-direction: column;
  }

  .incident-card__details,
  .incident-card__actions {
    grid-template-columns: 1fr;
  }
}
</style>
