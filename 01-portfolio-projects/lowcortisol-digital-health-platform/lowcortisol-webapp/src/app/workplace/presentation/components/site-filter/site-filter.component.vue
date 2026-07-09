<template>
  <div class="site-filter">
    <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="site-filter__option"
        :class="{ 'site-filter__option--active': modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
    >
      {{ t(option.labelKey) }}
    </button>
  </div>
</template>

<script setup>
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  modelValue: {
    type: String,
    default: "all",
  },
});

defineEmits(["update:modelValue"]);

const { t } = useTranslation();

const options = [
  {
    value: "all",
    labelKey: "workplace.sites.all",
  },
  {
    value: "residential",
    labelKey: "workplace.sites.residential",
  },
  {
    value: "business",
    labelKey: "workplace.sites.business",
  },
  {
    value: "industrial",
    labelKey: "workplace.sites.industrial",
  },
];
</script>

<style scoped>
.site-filter {
  display: inline-flex;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.78);
  box-shadow: var(--shadow-soft);
}

.site-filter__option {
  border: none;
  border-radius: 12px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  padding: 10px 14px;
}

.site-filter__option--active {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: var(--shadow-button);
}

@media (max-width: 700px) {
  .site-filter {
    width: 100%;
    overflow-x: auto;
  }

  .site-filter__option {
    white-space: nowrap;
  }
}
</style>