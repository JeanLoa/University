<template>
  <article class="epic-card">
    <span class="badge badge-primary">
      {{ code }}
    </span>

    <h3>{{ title }}</h3>

    <p>{{ description }}</p>
  </article>
</template>

<script setup>
defineProps({
  code: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
});
</script>

<style scoped>
.epic-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  padding: 22px;
}

.epic-card h3 {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 900;
  margin: 16px 0 8px;
}

.epic-card p {
  color: var(--color-text-muted);
  line-height: 1.55;
  margin: 0;
}
</style>