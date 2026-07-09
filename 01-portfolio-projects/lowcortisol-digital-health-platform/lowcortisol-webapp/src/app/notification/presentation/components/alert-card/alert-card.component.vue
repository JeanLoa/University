<template>
  <article class="alert-card" :class="`alert-card--${alert.severity}`">
    <div class="alert-card__header">
      <div>
        <p class="alert-card__eyebrow">
          {{ t(`notifications.resource.${alert.resourceType}`) }}
        </p>
        <h3>{{ displayTitle }}</h3>
      </div>

      <div class="alert-card__badges">
        <StatusBadge
            :status="alert.severity"
            :label="t(`notifications.severity.${alert.severity}`)"
        />
        <StatusBadge
            :status="alert.status"
            :label="t(`notifications.status.${alert.status}`)"
        />
      </div>
    </div>

    <p class="alert-card__description">
      {{ displayDescription }}
    </p>

    <div class="alert-card__facts">
      <div>
        <span>{{ t("notifications.center.sensor") }}</span>
        <strong>{{ displaySensor }}</strong>
      </div>
      <div>
        <span>{{ t("notifications.center.acknowledgeSla") }}</span>
        <strong>{{ alert.minutesToAcknowledge }} {{ t("notifications.center.minutes") }}</strong>
      </div>
      <div>
        <span>{{ t("notifications.center.source") }}</span>
        <strong>{{ t("notifications.center.monitoring") }}</strong>
      </div>
    </div>

    <div class="alert-card__actions">
      <UiButton
          v-if="alert.status === 'open'"
          variant="neutral"
          :label="t('notifications.actions.acknowledgeAlert')"
          :disabled="busy"
          @click="$emit('acknowledge', alert.id)"
      />

      <UiButton
          v-if="canCreateIncident"
          variant="neutral"
          :label="t('notifications.actions.createIncident')"
          :disabled="busy"
          @click="$emit('createIncident', alert.id)"
      />

      <UiButton
          v-if="alert.status !== 'resolved' && alert.status !== 'closed'"
          variant="action"
          :label="t('notifications.actions.resolveAlert')"
          :disabled="busy"
          @click="$emit('resolve', alert.id)"
      />

      <UiButton
          v-if="alert.status !== 'closed'"
          variant="danger"
          :label="t('notifications.actions.closeAlert')"
          :disabled="busy"
          @click="$emit('close', alert.id)"
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
  alert: {
    type: Object,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["acknowledge", "resolve", "close", "createIncident"]);

const { t } = useTranslation();

const displayTitle = computed(() => translateOperationalText(props.alert.title, "Alerta operativa"));
const displayDescription = computed(() =>
    translateOperationalText(props.alert.description, "Sin detalle operativo registrado.")
);
const displaySensor = computed(() => {
  const sensorId = String(props.alert.sensorId || "").trim();

  if (!sensorId) return t("notifications.center.notAssigned");
  if (sensorId.length > 22 || /^[0-9-]+$/.test(sensorId)) {
    return t("notifications.center.linkedSensor");
  }

  return sensorId;
});
const canCreateIncident = computed(() => ["open", "acknowledged"].includes(props.alert.status));

function translateOperationalText(value, fallback) {
  const text = String(value || "").trim();

  if (!text) return fallback;

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
.alert-card {
  display: grid;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  padding: 16px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.03);
}

.alert-card--critical {
  border-color: #fecaca;
  background: #fffafa;
}

.alert-card--warning {
  border-color: #fde68a;
  background: #fffdf5;
}

.alert-card__header,
.alert-card__badges,
.alert-card__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.alert-card__header {
  justify-content: space-between;
  align-items: flex-start;
}

.alert-card__eyebrow {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.02em;
  margin: 0 0 6px;
  text-transform: uppercase;
}

.alert-card h3 {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.22;
  margin: 0;
}

.alert-card__description {
  color: var(--color-text-muted);
  line-height: 1.45;
  margin: 0;
}

.alert-card__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.alert-card__facts div {
  min-width: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.68);
  padding: 10px 12px;
}

.alert-card__facts span {
  display: block;
  color: var(--color-text-muted);
  font-size: 12px;
  margin-bottom: 4px;
}

.alert-card__facts strong {
  display: block;
  overflow: hidden;
  color: var(--color-text);
  font-size: 13px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-card__actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  align-items: stretch;
}

.alert-card__actions :deep(.ui-button) {
  width: 100%;
}

@media (max-width: 760px) {
  .alert-card__facts,
  .alert-card__actions {
    grid-template-columns: 1fr;
  }
}
</style>
