<template>
  <section class="loading-state">
    <span class="loading-state__spinner" aria-hidden="true" />

    <div>
      <h3>{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text-muted);
  padding: 20px;
}

.loading-state__spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #dbeafe;
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: loading-spin 0.8s linear infinite;
}

.loading-state h3 {
  color: var(--color-text);
  font-size: 17px;
  font-weight: 900;
  margin: 0 0 4px;
}

.loading-state p {
  margin: 0;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
