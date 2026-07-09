<template>
  <article class="metric-card">
    <p class="metric-card__label">
      {{ label }}
    </p>

    <strong class="metric-card__value">
      {{ value }}
    </strong>
  </article>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  value: {
    type: [String, Number],
    default: 0,
  },
  hint: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.metric-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  padding: 22px;
}

.metric-card__label {
  color: var(--color-text-muted);
  font-weight: 800;
  margin: 0 0 10px;
}

.metric-card__value {
  display: block;
  color: var(--color-text);
  font-size: 34px;
  line-height: 1;
  font-weight: 900;
}
</style>