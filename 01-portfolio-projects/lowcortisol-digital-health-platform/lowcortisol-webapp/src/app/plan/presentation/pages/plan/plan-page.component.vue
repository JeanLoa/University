<template>
  <AppLayout>
    <section class="plans-page">
      <header class="page-header">
        <div>
          <h1>{{ t("plans.page.title") }}</h1>
          <p>{{ t("plans.page.subtitle") }}</p>
        </div>

        <button
            v-if="state.subscription?.id"
            class="btn-primary"
            type="button"
            @click="handleCancelSubscription"
        >
          {{ t("plans.page.cancelSubscription") }}
        </button>
      </header>

      <p v-if="state.error" class="error-message">
        {{ state.error }}
      </p>

      <p v-if="state.message" class="success-message">
        {{ state.message }}
      </p>

      <div
          v-if="!state.subscription?.id"
          class="subscription-warning"
      >
        {{ t("plans.page.noActiveSubscription") }}
      </div>

      <section class="summary-grid">
        <UiCard :title="t('plans.page.activePlan')">
          <strong class="summary-value">
            {{ state.summary.activePlanName || t("plans.status.unknown") }}
          </strong>

          <p class="summary-label">
            {{ getSubscriptionStatusLabel(state.summary.subscriptionStatus) }}
          </p>
        </UiCard>

        <UiCard :title="t('plans.page.capacity')">
          <strong class="summary-value">
            {{ state.summary.usedSites || 0 }} / {{ state.summary.maxSites || 0 }}
          </strong>

          <p class="summary-label">
            Sedes usadas del plan
          </p>

          <div class="capacity-bar" aria-hidden="true">
            <span :style="{ width: getCapacityPercent(state.summary.usedSites, state.summary.maxSites) + '%' }"></span>
          </div>
        </UiCard>

        <UiCard :title="t('plans.page.deviceCapacity')">
          <strong class="summary-value">
            {{ state.summary.usedDevices || 0 }} / {{ state.summary.maxDevices || 0 }}
          </strong>

          <p class="summary-label">
            Dispositivos usados del plan
          </p>

          <div class="capacity-bar" aria-hidden="true">
            <span :style="{ width: getCapacityPercent(state.summary.usedDevices, state.summary.maxDevices) + '%' }"></span>
          </div>
        </UiCard>

        <UiCard :title="t('plans.page.payments')">
          <strong class="summary-value">
            S/ {{ Number(state.summary.totalPaid || 0).toFixed(2) }}
          </strong>

          <p class="summary-label">
            {{ t("plans.page.totalPaid") }}
          </p>
        </UiCard>

        <UiCard :title="t('plans.page.serviceRequests')">
          <strong class="summary-value">
            {{ state.summary.serviceRequest || 0 }}
          </strong>

          <p class="summary-label">
            {{ t("plans.page.registeredRequests") }}
          </p>
        </UiCard>
      </section>

      <section class="plans-grid">
        <article
            v-for="plan in state.plans"
            :key="plan.id"
            class="plan-card"
            :class="{
            'plan-card-popular': plan.recommended,
            'plan-card-active': state.subscription?.planId === plan.id
          }"
        >
          <div class="plan-header">
            <div class="plan-title-block">
              <span
                  v-if="plan.recommended"
                  class="plan-badge"
              >
                {{ t("plans.page.recommended") }}
              </span>

              <h2>{{ plan.name }}</h2>
              <p>{{ plan.description }}</p>
            </div>

            <div class="plan-price-card">
              <span class="plan-currency">S/</span>
              <strong>{{ Number(plan.price || 0).toFixed(2) }}</strong>
              <small>{{ t("plans.page.monthly") }}</small>
            </div>
          </div>

          <div class="plan-capacity-grid">
            <span>
              <strong>{{ plan.maxSites }}</strong>
              <small>{{ t("plans.page.sites") }}</small>
            </span>

            <span>
              <strong>{{ plan.maxDevices }}</strong>
              <small>{{ t("plans.page.devices") }}</small>
            </span>
          </div>

          <ul class="plan-features">
            <li
                v-for="feature in plan.features || []"
                :key="feature.id"
            >
              {{ feature.name }}
            </li>
          </ul>

          <button
              class="btn-primary plan-action"
              type="button"
              :disabled="state.subscription?.planId === plan.id"
              @click="openCheckout(plan)"
          >
            {{
              state.subscription?.planId === plan.id
                  ? t("plans.page.currentPlan")
                  : state.subscription?.id
                      ? t("plans.requests.changePlan")
                      : t("plans.page.buyPlan")
            }}
          </button>
        </article>
      </section>

      <CheckoutForm
          v-if="selectedPlan"
          :plan="selectedPlan"
          @submit="handleCheckoutSubmit"
          @close="closeCheckout"
      />

      <section class="details-grid">
        <UiCard :title="t('plans.page.paymentHistory')">
          <div
              v-if="state.payments.length === 0"
              class="empty-state"
          >
            {{ t("plans.page.noPayments") }}
          </div>

          <div
              v-for="payment in state.payments"
              :key="payment.id"
              class="detail-row"
          >
            <div>
              <strong>
                S/ {{ Number(payment.amount || 0).toFixed(2) }}
              </strong>

              <p>{{ payment.method }}</p>
            </div>

            <span class="status-pill">
              {{ getPaymentStatusLabel(payment.status) }}
            </span>
          </div>
        </UiCard>

        <UiCard :title="t('plans.page.serviceRequest')">
          <div
              v-if="state.serviceRequest.length === 0"
              class="empty-state"
          >
            {{ t("plans.page.noRequest") }}
          </div>

          <div
              v-for="request in state.serviceRequest"
              :key="request.id"
              class="detail-row"
          >
            <div>
              <strong>
                {{ getRequestTypeLabel(request.type) }}
              </strong>

              <p>{{ request.description }}</p>
            </div>

            <span class="status-pill">
              {{ getRequestStatusLabel(request.status) }}
            </span>
          </div>
        </UiCard>
      </section>
    </section>
  </AppLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import CheckoutForm from "./components/checkout-form/checkout-form.component.vue";

import { usePlanStore } from "../../../application/store/plan.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const route = useRoute();
const router = useRouter();

const {
  state,
  loadPlanPage,
  subscribeToPlan,
  changePlan,
  cancelSubscription,
} = usePlanStore();

const { t } = useTranslation();

const selectedPlan = ref(null);

onMounted(async () => {
  await loadPlanPage();
  await applyLandingSelectedPlan();
});

async function applyLandingSelectedPlan() {
  const planIdFromQuery = route.query.plan ? String(route.query.plan) : "";
  const checkoutFromQuery = route.query.checkout ? String(route.query.checkout) : "";

  const pendingPlanId =
      planIdFromQuery || localStorage.getItem("lowcortisol.pendingPlanId");

  const pendingCheckout =
      checkoutFromQuery || localStorage.getItem("lowcortisol.pendingCheckout");

  if (!pendingPlanId) {
    return;
  }

  const selected = state.plans.find((plan) => plan.id === pendingPlanId);

  if (!selected) {
    clearPendingPlan();
    return;
  }

  if (pendingCheckout === "paid") {
    if (state.subscription?.planId !== pendingPlanId) {
      if (state.subscription?.id) {
        await changePlan(pendingPlanId);
      } else {
        await subscribeToPlan(pendingPlanId);
      }
    }

    clearPendingPlan();

    await router.replace({
      name: "plans",
    });

    return;
  }

  selectedPlan.value = selected;

  await router.replace({
    name: "plans",
  });
}

function openCheckout(plan) {
  if (state.subscription?.planId === plan.id) {
    return;
  }

  selectedPlan.value = plan;
}

function closeCheckout() {
  selectedPlan.value = null;
}

async function handleCheckoutSubmit() {
  if (!selectedPlan.value) {
    return;
  }

  try {
    if (state.subscription?.id) {
      await changePlan(selectedPlan.value.id);
    } else {
      await subscribeToPlan(selectedPlan.value.id);
    }

    closeCheckout();
  } catch {
    // El store ya expone el mensaje visible en la pagina de planes.
  }
}

async function handleCancelSubscription() {
  await cancelSubscription();
}

function clearPendingPlan() {
  localStorage.removeItem("lowcortisol.pendingPlanId");
  localStorage.removeItem("lowcortisol.pendingPlanCode");
  localStorage.removeItem("lowcortisol.pendingCheckout");
  localStorage.removeItem("lowcortisol.pendingPaymentMethod");
}

function getSubscriptionStatusLabel(status) {
  const labels = {
    active: t("plans.status.active"),
    cancelled: t("plans.status.cancelled"),
    suspended: t("plans.status.suspended"),
    expired: t("plans.status.expired"),
    unknown: t("plans.status.unknown"),
  };

  return labels[status] || t("plans.status.unknown");
}

function getPaymentStatusLabel(status) {
  const labels = {
    paid: t("plans.status.paid"),
    pending: t("plans.status.pending"),
    failed: t("plans.status.failed"),
    refunded: t("plans.status.refunded"),
  };

  return labels[status] || status;
}

function getRequestTypeLabel(type) {
  const labels = {
    "change-plan": t("plans.requests.changePlan"),
    cancellation: t("plans.requests.cancellation"),
    support: t("plans.requests.support"),
    request: t("plans.requests.request"),
  };

  return labels[type] || type;
}

function getRequestStatusLabel(status) {
  const labels = {
    open: t("plans.status.open"),
    resolved: t("plans.status.resolved"),
    closed: t("plans.status.closed"),
  };

  return labels[status] || status;
}

function getCapacityPercent(used, limit) {
  const normalizedLimit = Number(limit || 0);

  if (normalizedLimit <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((Number(used || 0) / normalizedLimit) * 100));
}
</script>

<style scoped>
.plans-page,
.plans-page * {
  font-family: var(--font-main);
}

.plans-page {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  gap: 28px;
}

.plans-page button,
.plans-page input,
.plans-page select,
.plans-page textarea {
  font: inherit;
}

.page-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.page-header h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
  margin: 0 0 8px;
}

.page-header p {
  color: var(--color-text-muted);
  font-size: 15px;
  font-weight: 500;
  margin: 0;
}

.subscription-warning {
  background: #eaf4ff;
  border: 1px solid #cbdff7;
  color: var(--color-primary);
  border-radius: 24px;
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 900;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.summary-grid :deep(.ui-card) {
  border-radius: 24px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.summary-value {
  display: block;
  color: var(--color-text);
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
  margin-top: 8px;
}

.summary-label {
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
  margin: 8px 0 0;
}

.capacity-bar {
  height: 10px;
  overflow: hidden;
  border-radius: var(--radius-pill);
  background: var(--color-surface-soft);
  margin-top: 14px;
}

.capacity-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-primary), var(--color-success));
  transition: width 0.22s ease;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  align-items: stretch;
}

.plan-card {
  position: relative;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: 22px;
  min-height: 470px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 26px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.plan-card-popular {
  background:
      linear-gradient(180deg, rgba(47, 128, 237, 0.12), rgba(255, 255, 255, 0.88)),
      #ffffff;
  border: 2px solid var(--color-primary);
}

.plan-card-active {
  border: 2px solid var(--color-success);
}

.plan-badge {
  display: inline-flex;
  width: fit-content;
  background: #dbeafe;
  color: var(--color-primary);
  border: 1px solid #93c5fd;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0;
}

.plan-header {
  display: grid;
  gap: 18px;
}

.plan-title-block {
  display: grid;
  gap: 12px;
}

.plan-header h2 {
  color: var(--color-text);
  font-size: clamp(1.6rem, 2vw, 2rem);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.05;
  margin: 0;
}

.plan-header p {
  color: var(--color-text-muted);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.45;
  margin: 0;
}

.plan-price-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 8px;
  align-items: end;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  padding: 16px;
  color: var(--color-text);
}

.plan-currency {
  align-self: center;
  font-size: 18px;
  font-weight: 900;
}

.plan-price-card strong {
  min-width: 0;
  overflow: hidden;
  font-size: clamp(1.8rem, 3vw, 2.35rem);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 0.9;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plan-price-card small {
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
}

.plan-capacity-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.plan-capacity-grid span {
  display: grid;
  gap: 4px;
  border: 1px solid var(--color-border);
  border-radius: 16px;
  background: var(--color-surface-soft);
  padding: 14px;
}

.plan-capacity-grid strong {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
}

.plan-capacity-grid small {
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.plan-features {
  display: grid;
  align-content: start;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.plan-features li {
  display: grid;
  grid-template-columns: 18px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.35;
}

.plan-features li::before {
  content: "\2713";
  color: var(--color-success);
  font-weight: 900;
}

.plan-action {
  width: 100%;
  border-radius: 14px;
  padding: 16px 18px;
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.details-grid :deep(.ui-card) {
  border-radius: 24px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding: 14px 0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row p {
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
  margin: 6px 0 0;
}

.status-pill {
  border-radius: 999px;
  border: 1px solid #bfdbfe;
  background: #eaf4ff;
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 900;
  padding: 10px 16px;
  white-space: nowrap;
}

.empty-state {
  border: 1px dashed var(--color-border);
  border-radius: 16px;
  color: var(--color-text-muted);
  font-size: 14px;
  font-weight: 500;
  padding: 18px;
}

.error-message {
  color: var(--color-danger);
  font-weight: 900;
}

.success-message {
  color: var(--color-success);
  font-weight: 900;
}

@media (max-width: 1100px) {
  .summary-grid,
  .plans-grid,
  .details-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
  }

  .plan-card {
    min-height: auto;
  }
}

@media (max-width: 560px) {
  .plan-price-card,
  .plan-capacity-grid {
    grid-template-columns: 1fr;
  }
}

.plans-page .plan-action {
  font-family: var(--font-main);
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
  border-radius: 14px;
  padding: 16px 18px;
}
</style>
