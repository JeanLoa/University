<template>
  <article
      class="ui-card"
      :class="[
        `ui-card--${variant}`,
        { 'ui-card--compact': compact }
      ]"
  >
    <header
        v-if="eyebrow || title || subtitle || $slots.actions"
        class="ui-card__header"
    >
      <div>
        <p v-if="eyebrow" class="ui-card__eyebrow">
          {{ eyebrow }}
        </p>

        <h2 v-if="title" class="ui-card__title">
          {{ title }}
        </h2>

        <p v-if="subtitle" class="ui-card__subtitle">
          {{ subtitle }}
        </p>
      </div>

      <div v-if="$slots.actions" class="ui-card__actions">
        <slot name="actions" />
      </div>
    </header>

    <slot />
  </article>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  eyebrow: {
    type: String,
    default: "",
  },
  subtitle: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "default",
    validator: (value) =>
        [
          "default",
          "metric",
          "warning",
          "success",
          "danger",
          "glass",
          "elevated",
        ].includes(value),
  },
  compact: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.ui-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  padding: 24px;
  transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
}

.ui-card--compact {
  padding: 22px;
}

.ui-card--metric {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}

.ui-card--warning {
  border-color: #fde68a;
  background: #fffbeb;
}

.ui-card--success {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.ui-card--danger {
  border-color: #fecaca;
  background: #fff5f5;
}

.ui-card--glass {
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(14px);
}

.ui-card--elevated {
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.12);
}

.ui-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 16px;
}

.ui-card__eyebrow {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0;
  margin: 0 0 6px;
  text-transform: uppercase;
}

.ui-card__title {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
}

.ui-card__subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.45;
  margin: 8px 0 0;
}

.ui-card__actions {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (max-width: 700px) {
  .ui-card__header {
    flex-direction: column;
  }

  .ui-card__actions {
    justify-content: flex-start;
  }
}
</style>
