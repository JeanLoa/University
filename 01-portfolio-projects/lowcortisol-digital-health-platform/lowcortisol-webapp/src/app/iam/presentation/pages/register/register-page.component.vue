<template>
  <AppLayout>
    <section class="auth-page">
      <UiCard :title="t('auth.register.title')">
        <p class="auth-subtitle">
          {{ t('auth.register.subtitle') }}
        </p>

        <form class="form" @submit.prevent="handleSubmit">
          <label class="form-field">
            <span>{{ t('auth.fields.fullName') }}</span>
            <input
                v-model="form.fullName"
                type="text"
                autocomplete="off"
                :placeholder="t('auth.register.fullNamePlaceholder')"
            />
          </label>

          <label class="form-field">
            <span>{{ t('auth.fields.email') }}</span>
            <input
                v-model="form.email"
                type="email"
                autocomplete="off"
                :placeholder="t('auth.register.emailPlaceholder')"
            />
          </label>

          <label class="form-field">
            <span>{{ t('auth.fields.phone') }}</span>
            <input
                v-model="form.phone"
                type="tel"
                autocomplete="off"
                :placeholder="t('auth.register.phonePlaceholder')"
            />
          </label>

          <label class="form-field">
            <span>{{ t('auth.fields.password') }}</span>
            <input
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                :placeholder="t('auth.register.passwordPlaceholder')"
            />
          </label>

          <p v-if="state.error" class="error-message">
            {{ state.error }}
          </p>

          <p v-if="state.message" class="success-message">
            {{ state.message }}
          </p>

          <button class="btn-primary" type="submit">
            {{ t('actions.register') }}
          </button>

          <RouterLink class="auth-link" :to="{ name: 'login' }">
            {{ t('actions.alreadyHaveAccount') }}
          </RouterLink>
        </form>
      </UiCard>
    </section>
  </AppLayout>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import { useIamStore } from "../../../application/store/iam.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const route = useRoute();
const router = useRouter();

const { state, signUp } = useIamStore();
const { t } = useTranslation();

const form = reactive({
  fullName: "",
  email: "",
  phone: "",
  password: "",
});

onMounted(() => {
  const planId = route.query.plan;
  const planCode = route.query.code;
  const checkout = route.query.checkout;
  const paymentMethod = route.query.paymentMethod;

  if (planId) {
    localStorage.setItem("lowcortisol.pendingPlanId", String(planId));
  }

  if (planCode) {
    localStorage.setItem("lowcortisol.pendingPlanCode", String(planCode));
  }

  if (checkout) {
    localStorage.setItem("lowcortisol.pendingCheckout", String(checkout));
  }

  if (paymentMethod) {
    localStorage.setItem("lowcortisol.pendingPaymentMethod", String(paymentMethod));
  }
});

async function handleSubmit() {
  await signUp(form);

  const pendingPlanId = localStorage.getItem("lowcortisol.pendingPlanId");
  const pendingCheckout = localStorage.getItem("lowcortisol.pendingCheckout");

  if (pendingPlanId && pendingCheckout === "paid") {
    await router.push({
      name: "plans",
      query: {
        plan: pendingPlanId,
        checkout: pendingCheckout,
      },
    });
    return;
  }

  await router.push({ name: "dashboard" });
}
</script>

<style scoped>
.auth-page {
  width: min(100%, 560px);
  margin: 0 auto;
}

.auth-subtitle {
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: -4px 0 18px;
}

.form {
  display: grid;
  gap: 16px;
}

.form-field {
  display: grid;
  gap: 8px;
}

.form-field span {
  color: var(--color-text-muted);
  font-weight: 800;
}

.form-field input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  color: var(--color-text);
  padding: 14px 16px;
  outline: none;
}

.error-message {
  color: var(--color-danger);
  font-weight: 800;
  margin: 0;
}

.success-message {
  color: var(--color-success);
  font-weight: 800;
  margin: 0;
}

.auth-link {
  color: var(--color-primary);
  font-weight: 900;
  text-align: center;
}
</style>