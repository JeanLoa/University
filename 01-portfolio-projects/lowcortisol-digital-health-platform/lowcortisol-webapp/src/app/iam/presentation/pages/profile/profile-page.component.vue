<template>
  <AppLayout>
    <section class="page-header">
      <div>
        <h1 class="page-title">
          {{ t('profile.title') }}
        </h1>

        <p class="page-subtitle">
          {{ t('profile.subtitle') }}
        </p>
      </div>

      <button
        class="btn-primary"
        type="button"
        :disabled="state.loading || !canSaveProfile"
        @click="handleSaveProfile"
      >
        {{ t('actions.saveChanges') }}
      </button>
    </section>

    <section class="profile-grid">
      <UiCard :title="t('profile.user')">
        <div v-if="state.user" class="profile-card">
          <div class="avatar">
            {{ state.user.initials }}
          </div>

          <h2 class="profile-name">
            {{ state.user.fullName }}
          </h2>

          <p class="profile-email">
            {{ state.user.email }}
          </p>

          <span class="badge badge-success">
            {{ state.user.statusLabel }}
          </span>
        </div>
      </UiCard>

      <UiCard :title="t('profile.accessProfile')">
        <div v-if="state.accessProfile" class="metric-list">
          <div class="metric-row">
            <span>{{ t('profile.name') }}</span>
            <strong>{{ state.accessProfile.name }}</strong>
          </div>

          <div class="metric-row">
            <span>{{ t('profile.role') }}</span>
            <strong>{{ state.accessProfile.roleLabel }}</strong>
          </div>

          <div class="metric-row">
            <span>{{ t('profile.permissions') }}</span>
            <strong>{{ state.accessProfile.permissions.length }}</strong>
          </div>
        </div>
      </UiCard>
    </section>

    <section class="grid grid-2 profile-bottom">
      <UiCard :title="t('profile.updateData')">
        <form class="form" @submit.prevent="handleSaveProfile">
          <div v-if="state.error" class="profile-alert profile-alert-error">
            {{ state.error }}
          </div>

          <div v-else-if="state.message" class="profile-alert profile-alert-success">
            {{ state.message }}
          </div>

          <div class="secure-field">
            <label for="profile-full-name">
              {{ t('auth.fields.fullName') }}
            </label>

            <div class="secure-control">
              <input
                id="profile-full-name"
                v-model="form.fullName"
                type="text"
                :disabled="!editableFields.fullName"
              />

              <button
                class="edit-button"
                type="button"
                aria-label="Editar nombre"
                @click="enableField('fullName')"
              >
                ✎
              </button>
            </div>
          </div>

          <div class="secure-field">
            <label for="profile-email">
              Correo electrónico
            </label>

            <div class="secure-control">
              <input
                id="profile-email"
                :value="state.user?.email || ''"
                type="email"
                disabled
              />

              <button
                class="edit-button"
                type="button"
                aria-label="Solicitar cambio de correo"
                @click="openEmailModal"
              >
                ✎
              </button>
            </div>
          </div>

          <div class="secure-field">
            <label for="profile-phone">
              {{ t('auth.fields.phone') }}
            </label>

            <div class="secure-control">
              <input
                id="profile-phone"
                v-model="form.phone"
                type="text"
                :disabled="!editableFields.phone"
              />

              <button
                class="edit-button"
                type="button"
                aria-label="Editar telefono"
                @click="enableField('phone')"
              >
                ✎
              </button>
            </div>
          </div>

          <div class="secure-field">
            <label for="profile-password">
              Contraseña
            </label>

            <div class="secure-control">
              <input
                id="profile-password"
                value="********"
                type="text"
                disabled
              />

              <button
                class="edit-button"
                type="button"
                aria-label="Cambiar contrasena"
                @click="openPasswordModal"
              >
                ✎
              </button>
            </div>
          </div>

          <button class="btn-secondary" type="submit" :disabled="state.loading || !canSaveProfile">
            {{ t('actions.updateProfile') }}
          </button>
        </form>
      </UiCard>

      <UiCard :title="t('profile.activeSession')">
        <div class="metric-list">
          <div class="metric-row">
            <span>{{ t('profile.status') }}</span>
            <strong>
              {{ state.session?.canAccess ? t('profile.active') : '-' }}
            </strong>
          </div>

          <div class="metric-row">
            <span>{{ t('profile.token') }}</span>
            <strong>
              {{ state.session?.token ? t('profile.available') : '-' }}
            </strong>
          </div>
        </div>

        <button class="btn-secondary logout-button" type="button" @click="handleSignOut">
          {{ t('actions.closeSession') }}
        </button>
      </UiCard>
    </section>

    <div v-if="emailModal.open" class="profile-modal-overlay" @click.self="closeEmailModal">
      <section class="profile-modal" aria-modal="true" role="dialog">
        <div class="profile-modal-header">
          <p class="modal-eyebrow">Cambio de correo</p>
          <h2>¿Quieres cambiar tu correo electrónico?</h2>
          <p>
            Enviaremos una confirmación al nuevo correo. El cambio se completará
            cuando confirmes el enlace recibido.
          </p>
        </div>

        <form class="form" @submit.prevent="handleEmailChangeRequest">
          <div v-if="emailModal.error" class="profile-alert profile-alert-error">
            {{ emailModal.error }}
          </div>

          <label class="modal-field" for="new-email">
            <span>Nuevo correo electrónico</span>
            <input id="new-email" v-model="emailModal.newEmail" type="email" />
          </label>

          <div class="modal-actions">
            <button class="btn-secondary" type="button" @click="closeEmailModal">
              Cancelar
            </button>

            <button class="btn-primary" type="submit" :disabled="state.loading">
              Sí, enviar confirmación
            </button>
          </div>
        </form>
      </section>
    </div>

    <div v-if="passwordModal.open" class="profile-modal-overlay" @click.self="closePasswordModal">
      <section class="profile-modal" aria-modal="true" role="dialog">
        <div class="profile-modal-header">
          <p class="modal-eyebrow">Seguridad</p>
          <h2>Cambiar contraseña</h2>
          <p>
            Confirma tu contraseña actual y registra una nueva contraseña para
            proteger tu cuenta.
          </p>
        </div>

        <form class="form" @submit.prevent="handlePasswordChange">
          <div v-if="passwordModal.error" class="profile-alert profile-alert-error">
            {{ passwordModal.error }}
          </div>

          <label class="modal-field" for="current-password">
            <span>Contraseña actual</span>
            <input
              id="current-password"
              v-model="passwordModal.currentPassword"
              type="password"
              autocomplete="current-password"
            />
          </label>

          <label class="modal-field" for="new-password">
            <span>Nueva contraseña</span>
            <input
              id="new-password"
              v-model="passwordModal.newPassword"
              type="password"
              autocomplete="new-password"
            />
          </label>

          <label class="modal-field" for="confirm-password">
            <span>Confirmar nueva contraseña</span>
            <input
              id="confirm-password"
              v-model="passwordModal.confirmPassword"
              type="password"
              autocomplete="new-password"
            />
          </label>

          <div class="modal-actions">
            <button class="btn-secondary" type="button" @click="closePasswordModal">
              Cancelar
            </button>

            <button class="btn-primary" type="submit" :disabled="state.loading">
              Actualizar contraseña
            </button>
          </div>
        </form>
      </section>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import { useIamStore } from "../../../application/store/iam.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const router = useRouter();
const {
  state,
  loadSession,
  updateProfile,
  requestEmailChange,
  changePassword,
  signOut,
} = useIamStore();
const { t } = useTranslation();

const form = reactive({
  fullName: "",
  phone: "",
});

const editableFields = reactive({
  fullName: false,
  phone: false,
});

const emailModal = reactive({
  open: false,
  newEmail: "",
  error: "",
});

const passwordModal = reactive({
  open: false,
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
  error: "",
});

const canSaveProfile = computed(() => editableFields.fullName || editableFields.phone);

onMounted(async () => {
  await loadSession();
});

watch(
    () => state.user,
    (user) => {
      if (!user) return;

      form.fullName = user.fullName;
      form.phone = user.phone;
    },
    { immediate: true }
);

function enableField(field) {
  editableFields[field] = true;
}

async function handleSaveProfile() {
  if (!canSaveProfile.value) return;

  await updateProfile({
    fullName: form.fullName,
    phone: form.phone,
  });

  editableFields.fullName = false;
  editableFields.phone = false;
}

function openEmailModal() {
  emailModal.newEmail = state.user?.email || "";
  emailModal.error = "";
  emailModal.open = true;
}

function closeEmailModal() {
  emailModal.open = false;
  emailModal.error = "";
}

async function handleEmailChangeRequest() {
  emailModal.error = "";

  try {
    await requestEmailChange({
      newEmail: emailModal.newEmail,
    });

    closeEmailModal();
  } catch (error) {
    emailModal.error = error.message || "No se pudo solicitar el cambio de correo.";
  }
}

function openPasswordModal() {
  passwordModal.currentPassword = "";
  passwordModal.newPassword = "";
  passwordModal.confirmPassword = "";
  passwordModal.error = "";
  passwordModal.open = true;
}

function closePasswordModal() {
  passwordModal.open = false;
  passwordModal.error = "";
}

async function handlePasswordChange() {
  passwordModal.error = "";

  if (passwordModal.newPassword !== passwordModal.confirmPassword) {
    passwordModal.error = "La nueva contraseña y la confirmación no coinciden.";
    return;
  }

  try {
    await changePassword({
      currentPassword: passwordModal.currentPassword,
      newPassword: passwordModal.newPassword,
    });

    closePasswordModal();
  } catch (error) {
    passwordModal.error = error.message || "No se pudo actualizar la contraseña.";
  }
}

async function handleSignOut() {
  await signOut();
  await router.push({ name: "login" });
}
</script>

<style scoped>
.profile-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 20px;
}

.profile-bottom {
  margin-top: 20px;
}

.profile-card {
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
}

.avatar {
  display: grid;
  place-items: center;
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #ffffff;
  font-size: 34px;
  font-weight: 900;
  box-shadow: var(--shadow-button);
}

.profile-name {
  margin: 0;
  font-size: 24px;
  font-weight: 900;
}

.profile-email {
  color: var(--color-text-muted);
  margin: 0;
}

.metric-list {
  display: grid;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
  padding: 14px 0;
}

.metric-row:first-child {
  padding-top: 0;
}

.metric-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metric-row span {
  color: var(--color-text-muted);
}

.metric-row strong {
  color: var(--color-text);
  font-weight: 900;
}

.form {
  display: grid;
  gap: 16px;
}

.secure-field,
.modal-field {
  display: grid;
  gap: 8px;
}

.secure-field label,
.modal-field span {
  color: var(--color-text-muted);
  font-weight: 800;
}

.secure-control {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  overflow: hidden;
}

.secure-control:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(47, 126, 246, 0.12);
}

.secure-control input,
.modal-field input {
  border: 0;
  background: transparent;
  color: var(--color-text);
  padding: 14px 16px;
  outline: none;
  min-width: 0;
}

.modal-field input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
}

.secure-control input:disabled {
  color: var(--color-text);
  opacity: 1;
}

.edit-button {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-left: 1px solid var(--color-border);
  background: #ffffff;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 18px;
  font-weight: 900;
}

.edit-button:hover {
  background: rgba(47, 126, 246, 0.08);
}

.btn-primary:disabled,
.btn-secondary:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.profile-alert {
  border-radius: var(--radius-md);
  padding: 12px 14px;
  font-weight: 800;
}

.profile-alert-error {
  border: 1px solid #ffb4b4;
  background: #fff5f5;
  color: #ef4444;
}

.profile-alert-success {
  border: 1px solid #a7f3d0;
  background: #ecfdf5;
  color: #04a755;
}

.logout-button {
  width: 100%;
  margin-top: 18px;
}

.profile-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.38);
  backdrop-filter: blur(8px);
}

.profile-modal {
  width: min(560px, 100%);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background: #ffffff;
  padding: 28px;
  box-shadow: var(--shadow-card);
}

.profile-modal-header {
  display: grid;
  gap: 8px;
  margin-bottom: 20px;
}

.profile-modal-header h2,
.profile-modal-header p {
  margin: 0;
}

.profile-modal-header h2 {
  color: var(--color-text);
  font-size: 24px;
  font-weight: 900;
}

.profile-modal-header p:not(.modal-eyebrow) {
  color: var(--color-text-muted);
  line-height: 1.45;
}

.modal-eyebrow {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 4px;
}

@media (max-width: 800px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }

  .metric-row {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }
}
</style>
