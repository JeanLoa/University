<template>
  <RouterLink
      v-if="to"
      class="ui-button"
      :class="buttonClass"
      :to="to"
      @click="emit('click', $event)"
  >
    <span v-if="icon" class="ui-button__icon" aria-hidden="true">
      {{ icon }}
    </span>

    <span>
      <slot>{{ label }}</slot>
    </span>
  </RouterLink>

  <button
      v-else
      class="ui-button"
      :class="buttonClass"
      :type="type"
      :disabled="disabled"
      @click="emit('click', $event)"
  >
    <span v-if="icon" class="ui-button__icon" aria-hidden="true">
      {{ icon }}
    </span>

    <span>
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "action",
    validator: (value) =>
        ["create", "action", "danger", "neutral", "ghost"].includes(value),
  },
  icon: {
    type: String,
    default: "",
  },
  to: {
    type: [String, Object],
    default: null,
  },
  type: {
    type: String,
    default: "button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);

const buttonClass = computed(() => ({
  [`ui-button--${props.variant}`]: true,
  "ui-button--disabled": props.disabled,
}));
</script>

<style scoped>
.ui-button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: 900;
  line-height: 1;
  padding: 12px 18px;
  transition:
      background 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      transform 0.2s ease,
      box-shadow 0.2s ease;
}

.ui-button:not(.ui-button--disabled):hover {
  transform: translateY(-1px);
}

.ui-button--create {
  background: #0ea5e9;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(14, 165, 233, 0.26);
}

.ui-button--action {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: var(--shadow-button);
}

.ui-button--danger {
  background: var(--color-danger);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(239, 68, 68, 0.22);
}

.ui-button--neutral {
  border-color: var(--color-border);
  background: var(--color-surface-soft);
  color: var(--color-text);
}

.ui-button--ghost {
  border-color: transparent;
  background: transparent;
  color: var(--color-primary);
}

.ui-button--disabled,
.ui-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
  box-shadow: none;
}

.ui-button__icon {
  font-size: 16px;
  line-height: 1;
}
</style>
