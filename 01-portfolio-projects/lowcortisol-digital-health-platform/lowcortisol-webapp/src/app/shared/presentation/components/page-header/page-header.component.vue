<template>
  <header class="page-header-component">
    <div>
      <p v-if="eyebrow" class="page-header-component__eyebrow">
        {{ eyebrow }}
      </p>

      <h1 class="page-header-component__title">
        {{ title }}
      </h1>

      <p v-if="subtitle" class="page-header-component__subtitle">
        {{ subtitle }}
      </p>
    </div>

    <div v-if="$slots.actions" class="page-header-component__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.page-header-component {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 28px;
}

.page-header-component__eyebrow {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
  margin: 0 0 8px;
  text-transform: uppercase;
}

.page-header-component__title {
  color: var(--color-text);
  font-size: 36px;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
  margin: 0 0 8px;
}

.page-header-component__subtitle {
  color: var(--color-text-muted);
  font-size: 15px;
  line-height: 1.45;
  margin: 0;
}

.page-header-component__actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .page-header-component {
    flex-direction: column;
  }

  .page-header-component__title {
    font-size: 30px;
  }

  .page-header-component__actions {
    justify-content: flex-start;
    width: 100%;
  }
}
</style>
