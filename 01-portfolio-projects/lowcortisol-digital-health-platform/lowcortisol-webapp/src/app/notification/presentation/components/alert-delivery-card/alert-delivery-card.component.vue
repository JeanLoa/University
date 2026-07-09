<template>
  <article class="delivery-card">
    <div>
      <p class="delivery-card__eyebrow">
        {{ t("notifications.center.delivery") }}
      </p>
      <h3>{{ displayTitle }}</h3>
      <p>{{ displayDescription }}</p>
    </div>

    <div class="delivery-card__meta">
      <StatusBadge
          :status="delivery.status"
          :label="t(`notifications.deliveryStatus.${delivery.status}`)"
      />
      <span>{{ t(`notifications.channelType.${delivery.channelType}`) }}</span>
      <span>{{ delivery.recipientDisplayName || t("notifications.center.notAssigned") }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from "vue";

import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const props = defineProps({
  delivery: {
    type: Object,
    required: true,
  },
});

const { t } = useTranslation();

const displayTitle = computed(() =>
    translateOperationalText(props.delivery.messageTitle, t("notifications.center.delivery"))
);
const displayDescription = computed(() =>
    translateOperationalText(props.delivery.messageDescription, t("notifications.center.noDeliveryDescription"))
);

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
.delivery-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  padding: 14px;
}

.delivery-card__eyebrow {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  margin: 0 0 6px;
  text-transform: uppercase;
}

.delivery-card h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
  margin: 0 0 4px;
}

.delivery-card p,
.delivery-card__meta {
  color: var(--color-text-muted);
  margin: 0;
}

.delivery-card__meta {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (max-width: 760px) {
  .delivery-card {
    grid-template-columns: 1fr;
  }

  .delivery-card__meta {
    justify-content: flex-start;
  }
}
</style>
