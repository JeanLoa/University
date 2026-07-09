<template>
  <AppLayout>
    <section class="auth-page">
      <UiCard :title="t('auth.login.title')">
        <p class="auth-subtitle">
          {{ t('auth.login.subtitle') }}
        </p>

        <form class="form" @submit.prevent="handleSubmit">
          <label class="form-field">
            <span>{{ t('auth.fields.email') }}</span>
            <input
                v-model="form.email"
                type="email"
                autocomplete="off"
                :placeholder="t('auth.login.emailPlaceholder')"
            />
          </label>

          <label class="form-field">
            <span>{{ t('auth.fields.password') }}</span>
            <input
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                :placeholder="t('auth.login.passwordPlaceholder')"
            />
          </label>

          <p v-if="state.error" class="error-message">
            {{ state.error }}
          </p>

          <p v-if="state.message" class="success-message">
            {{ state.message }}
          </p>

          <button class="btn-primary" type="submit">
            {{ t('actions.enter') }}
          </button>

          <div class="auth-actions">
            <RouterLink class="auth-link" :to="{ name: 'recover-password' }">
              {{ t('auth.login.forgotPassword') }}
            </RouterLink>

            <RouterLink class="auth-link" :to="{ name: 'register' }">
              {{ t('actions.createAccount') }}
            </RouterLink>
          </div>
        </form>
      </UiCard>
    </section>
  </AppLayout>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import { useIamStore } from "../../../application/store/iam.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const router = useRouter();
const { state, signIn } = useIamStore();
const { t } = useTranslation();

const form = reactive({
  email: "",
  password: "",
});

async function handleSubmit() {
  await signIn(form);
  await router.push({ name: "plans" });
}
</script>

<style scoped>
.auth-page {
  width: min(100%, 520px);
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

.auth-actions {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.auth-link {
  color: var(--color-primary);
  font-weight: 900;
}
</style>