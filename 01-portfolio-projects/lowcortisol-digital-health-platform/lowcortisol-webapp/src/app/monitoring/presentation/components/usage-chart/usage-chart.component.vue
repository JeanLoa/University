<template>
  <div class="usage-chart">
    <article
        v-for="item in displayItems"
        :key="item.id"
        class="usage-card"
        :class="{
          'usage-card--warning': item.status === 'warning',
          'usage-card--critical': item.status === 'critical',
        }"
    >
      <div class="usage-card__header">
        <span class="usage-card__eyebrow">{{ getResourceLabel(item.resourceType) }}</span>
        <StatusBadge
            :status="item.status"
            :label="getStatusLabel(item.status)"
        />
      </div>

      <div class="usage-card__body">
        <div class="usage-card__identity">
          <strong class="usage-card__title">{{ getLocationTitle(item) }}</strong>
          <span class="usage-card__detail">{{ getSensorName(item) }}</span>
        </div>

        <strong class="usage-card__value">{{ formatValue(item) }}</strong>
      </div>

      <span class="usage-card__meta">{{ getContextLine(item) }}</span>

      <div class="usage-card__track" aria-hidden="true">
        <div
            class="usage-card__bar"
            :style="{ width: `${getWidth(item.value)}%` }"
        />
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed } from "vue";

import { useTranslation } from "../../../../shared/application/services/translation.service";
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const { t } = useTranslation();

const displayItems = computed(() =>
    props.items
        .slice()
        .sort((left, right) => new Date(right.capturedAt) - new Date(left.capturedAt))
        .slice(0, 4)
);

const maxValue = computed(() =>
    Math.max(1, ...displayItems.value.map((item) => Number(item.value || 0)))
);

function getWidth(value) {
  return Math.min(100, Math.max(10, (Number(value || 0) / maxValue.value) * 100));
}

function getResourceLabel(resourceType) {
  const keys = {
    water: "monitoring.resources.water",
    gas: "monitoring.resources.gas",
  };

  return t(keys[resourceType] ?? "monitoring.resources.water");
}

function getStatusLabel(status) {
  const keys = {
    normal: "monitoring.status.normal",
    warning: "monitoring.status.warning",
    critical: "monitoring.status.critical",
  };

  return t(keys[status] ?? "monitoring.status.normal");
}

function getLocationTitle(item) {
  return item.location?.roomName || item.location?.siteName || t("monitoring.dashboard.physicalLocation");
}

function getSensorName(item) {
  return item.location?.sensorName || item.location?.deviceName || item.location?.deviceGroupName || "";
}

function getContextLine(item) {
  return [
    item.location?.siteName,
    item.location?.deviceGroupName,
    item.location?.deviceName,
    formatDate(item.capturedAt),
  ].filter(Boolean).join(" · ");
}

function formatValue(item) {
  return `${formatNumber(item.value)} ${item.unit}`.trim();
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}
</script>

<style scoped>
.usage-chart {
  display: grid;
  gap: 10px;
}

.usage-card {
  display: grid;
  gap: 9px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  padding: 13px 14px;
}

.usage-card--warning {
  border-color: #fde68a;
  background: #fffdf3;
}

.usage-card--critical {
  border-color: #fecaca;
  background: #fff8f8;
}

.usage-card__header,
.usage-card__body {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  min-width: 0;
}

.usage-card__eyebrow {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.usage-card__identity {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.usage-card__title {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 900;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.usage-card__detail {
  color: var(--color-text);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.usage-card__value {
  flex: 0 0 auto;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.1;
  text-align: right;
  white-space: nowrap;
}

.usage-card__meta {
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.usage-card__track {
  height: 8px;
  border-radius: var(--radius-pill);
  background: var(--color-surface-soft);
  overflow: hidden;
}

.usage-card__bar {
  height: 100%;
  border-radius: var(--radius-pill);
  background: var(--color-primary);
}

@media (max-width: 620px) {
  .usage-card__body {
    flex-direction: column;
    gap: 8px;
  }

  .usage-card__value {
    text-align: left;
  }
}
</style>
