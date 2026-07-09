<template>
  <article class="plan-card" :class="{ 'plan-card--recommended': plan.recommended }">
    <div class="plan-card__header">
      <div>
        <span v-if="plan.recommended" class="badge badge-primary">
          {{ t('plans.page.recommended') }}
        </span>

        <h3>{{ plan.name }}</h3>
        <p>{{ plan.description }}</p>
      </div>

      <div class="plan-card__price">
        <strong>
          S/ {{ Number(plan.price).toFixed(2) }}
        </strong>

        <span>
          {{ getBillingPeriodLabel(plan.billingPeriod) }}
        </span>
      </div>
    </div>

    <div class="plan-card__capacity">
      {{ plan.maxSites }} {{ t('plans.page.sites') }} ·
      {{ plan.maxDevices }} {{ t('plans.page.devices') }}
    </div>

    <ul class="plan-card__features">
      <li v-for="feature in plan.features" :key="feature.id">
        {{ feature.name }}
      </li>
    </ul>

    <button
        class="btn-primary plan-card__button"
        type="button"
        @click="$emit('buy', plan)"
    >
      {{ active ? t('plans.page.currentPlan') : t('plans.page.buyPlan') }}
    </button>
  </article>
</template>

<script setup>
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  plan: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["buy"]);

const { t } = useTranslation();

function getPriceLabel(price) {
  return `S/ ${Number(price).toFixed(2)}`;
}

function getBillingPeriodLabel(period) {
  const keys = {
    monthly: "plans.page.monthly",
    yearly: "plans.page.yearly",
  };

  return t(keys[period] ?? "plans.page.period");
}
</script>

<style scoped>
.plan-card {
  display: grid;
  gap: 18px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  padding: 24px;
}

.plan-card--recommended {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.plan-card__header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.plan-card h3 {
  color: var(--color-text);
  font-size: 24px;
  font-weight: 900;
  margin: 10px 0 6px;
}

.plan-card p {
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.plan-card__price {
  display: grid;
  justify-items: end;
  gap: 4px;
  min-width: 96px;
  text-align: right;
  white-space: nowrap;
  margin-right: 12px;
}

.plan-card__price strong {
  display: block;
  color: var(--color-text);
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.plan-card__price span {
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;
}

.plan-card__capacity {
  color: var(--color-text-muted);
  font-weight: 800;
}

.plan-card__features {
  display: grid;
  gap: 10px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.plan-card__features li {
  color: var(--color-text);
  font-weight: 800;
}

.plan-card__features li::before {
  content: "✓";
  color: var(--color-success);
  font-weight: 900;
  margin-right: 8px;
}

.plan-card__button {
  width: 100%;
}
</style>