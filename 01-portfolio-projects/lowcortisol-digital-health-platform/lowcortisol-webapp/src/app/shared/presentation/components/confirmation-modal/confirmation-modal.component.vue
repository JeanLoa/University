<template>
  <div v-if="open" class="confirmation-shell" role="presentation" @click.self="emit('close')">
    <section
        class="confirmation-modal"
        :class="`confirmation-modal--${tone}`"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
    >
      <header>
        <span class="confirmation-modal__mark" aria-hidden="true">
          !
        </span>

        <div>
          <h2 :id="titleId">
            {{ title }}
          </h2>

          <p>{{ message }}</p>
        </div>
      </header>

      <div v-if="detail" class="confirmation-modal__detail">
        {{ detail }}
      </div>

      <footer>
        <UiButton
            :label="cancelLabel"
            variant="ghost"
            type="button"
            @click="emit('close')"
        />

        <UiButton
            :label="confirmLabel"
            :variant="confirmVariant"
            type="button"
            @click="emit('confirm')"
        />
      </footer>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";

import UiButton from "../ui-button/ui-button.component.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Confirmar accion",
  },
  message: {
    type: String,
    default: "Esta accion requiere confirmacion.",
  },
  detail: {
    type: String,
    default: "",
  },
  confirmLabel: {
    type: String,
    default: "Confirmar",
  },
  cancelLabel: {
    type: String,
    default: "Cancelar",
  },
  tone: {
    type: String,
    default: "danger",
    validator: (value) => ["danger", "warning", "neutral"].includes(value),
  },
});

const emit = defineEmits(["close", "confirm"]);

const titleId = `confirmation-title-${Math.random().toString(36).slice(2, 9)}`;

const confirmVariant = computed(() =>
    props.tone === "danger" ? "danger" : "action"
);
</script>

<style scoped>
.confirmation-shell {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.48);
  padding: 20px;
}

.confirmation-modal {
  display: grid;
  gap: 18px;
  width: min(460px, 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.24);
  padding: 24px;
}

.confirmation-modal header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.confirmation-modal__mark {
  display: inline-grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 999px;
  font-weight: 900;
}

.confirmation-modal--danger .confirmation-modal__mark {
  background: #fef2f2;
  color: var(--color-danger);
}

.confirmation-modal--warning .confirmation-modal__mark {
  background: #fffbeb;
  color: #b45309;
}

.confirmation-modal--neutral .confirmation-modal__mark {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.confirmation-modal h2 {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 900;
  margin: 0 0 6px;
}

.confirmation-modal p,
.confirmation-modal__detail {
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.confirmation-modal__detail {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  font-weight: 800;
  padding: 12px 14px;
}

.confirmation-modal footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 520px) {
  .confirmation-modal footer {
    flex-direction: column-reverse;
  }

  .confirmation-modal footer :deep(.ui-button) {
    width: 100%;
  }
}
</style>
