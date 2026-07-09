<template>
  <section class="empty-state" :class="{ 'empty-state--compact': compact }">
    <p v-if="eyebrow" class="empty-state__eyebrow">
      {{ eyebrow }}
    </p>

    <h3 class="empty-state__title">
      {{ title }}
    </h3>

    <p v-if="description" class="empty-state__description">
      {{ description }}
    </p>

    <UiButton
        v-if="actionLabel && actionTo"
        class="empty-state__action"
        variant="neutral"
        :to="actionTo"
        :label="actionLabel"
    />

    <UiButton
        v-else-if="actionLabel"
        class="empty-state__action"
        variant="neutral"
        :label="actionLabel"
        @click="$emit('action')"
    />
  </section>
</template>

<script setup>
import UiButton from "../ui-button/ui-button.component.vue";

defineProps({
  eyebrow: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  actionLabel: {
    type: String,
    default: "",
  },
  actionTo: {
    type: [String, Object],
    default: null,
  },
  compact: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["action"]);
</script>

<style scoped>
.empty-state {
  display: grid;
  justify-items: start;
  gap: 8px;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  padding: 22px;
}

.empty-state--compact {
  border-radius: var(--radius-md);
  padding: 16px;
}

.empty-state__eyebrow {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
  margin: 0;
  text-transform: uppercase;
}

.empty-state__title {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  line-height: 1.15;
  margin: 0;
}

.empty-state__description {
  line-height: 1.45;
  margin: 0;
}

.empty-state__action {
  margin-top: 8px;
}
</style>
