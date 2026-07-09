<template>
  <Teleport to="body">
    <div v-if="open" class="notification-modal" role="dialog" aria-modal="true">
      <form class="notification-modal__panel" @submit.prevent="submit">
        <header>
          <h2>{{ t("notifications.modals.actionTitle") }}</h2>
          <button type="button" class="notification-modal__close" @click="$emit('close')">
            x
          </button>
        </header>

        <label>
          <span>{{ t("notifications.modals.actionType") }}</span>
          <select v-model="actionType">
            <option value="inspection">{{ t("notifications.actionType.inspection") }}</option>
            <option value="valve_closed">{{ t("notifications.actionType.valveClosed") }}</option>
            <option value="operator_note">{{ t("notifications.actionType.operatorNote") }}</option>
          </select>
        </label>

        <label>
          <span>{{ t("notifications.modals.actionDescription") }}</span>
          <textarea v-model.trim="description" required rows="4" />
        </label>

        <label>
          <span>{{ t("notifications.modals.performedBy") }}</span>
          <input v-model.trim="performedBy" required />
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
              :label="t('notifications.actions.registerAction')"
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
});

const emit = defineEmits(["close", "submit"]);
const { t } = useTranslation();
const actionType = ref("operator_note");
const description = ref("");
const performedBy = ref("");

watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        actionType.value = "operator_note";
        description.value = "";
        performedBy.value = t("notifications.center.defaultOperator");
      }
    }
);

function submit() {
  emit("submit", {
    actionType: actionType.value,
    description: description.value,
    performedBy: performedBy.value,
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
  width: min(520px, 100%);
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
