<template>
  <Teleport to="body">
    <div v-if="open" class="notification-modal" role="dialog" aria-modal="true">
      <form class="notification-modal__panel" @submit.prevent="submit">
        <header>
          <h2>{{ t("notifications.modals.assignTitle") }}</h2>
          <button type="button" class="notification-modal__close" @click="$emit('close')">
            x
          </button>
        </header>

        <label>
          <span>{{ t("notifications.modals.assigneeName") }}</span>
          <input v-model.trim="assigneeName" required />
        </label>

        <footer>
          <UiButton
              variant="neutral"
              :label="t('notifications.actions.cancel')"
              type="button"
              @click="$emit('close')"
          />
          <UiButton
              variant="action"
              :label="t('notifications.actions.assignIncident')"
              type="submit"
          />
        </footer>
      </form>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from "vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  incident: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);
const { t } = useTranslation();
const assigneeName = ref("");

watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) assigneeName.value = props.incident?.assignedTo || "";
    }
);

function submit() {
  emit("submit", {
    assigneeId: assigneeName.value,
    assigneeName: assigneeName.value,
  });
}
</script>

<style scoped>
.notification-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.42);
  padding: 20px;
}

.notification-modal__panel {
  display: grid;
  gap: 18px;
  width: min(460px, 100%);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  padding: 22px;
}

.notification-modal__panel header,
.notification-modal__panel footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.notification-modal__panel h2 {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 900;
  margin: 0;
}

.notification-modal__close {
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
}

.notification-modal__panel label {
  display: grid;
  gap: 8px;
  color: var(--color-text);
  font-weight: 900;
}

.notification-modal__panel input,
.notification-modal__panel textarea,
.notification-modal__panel select {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  padding: 12px;
}
</style>
