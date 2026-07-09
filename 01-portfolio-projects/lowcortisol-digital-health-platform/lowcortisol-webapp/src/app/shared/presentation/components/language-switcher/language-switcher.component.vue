<template>
  <div class="language-switcher">
    <button
        v-for="item in languages"
        :key="item.value"
        type="button"
        class="language-switcher__button"
        :class="{ 'language-switcher__button--active': language === item.value }"
        @click="handleLanguageChange(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
import { useTranslation } from "../../../application/services/translation.service";

const { language, setLanguage } = useTranslation();

const languages = [
  {
    value: "es",
    label: "ES",
  },
  {
    value: "en",
    label: "EN",
  },
  {
    value: "pt",
    label: "PT",
  },
];

async function handleLanguageChange(language) {
  await setLanguage(language);
}
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 40;
  display: inline-flex;
  gap: 6px;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow-soft);
  backdrop-filter: blur(14px);
}

.language-switcher__button {
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  padding: 8px 12px;
}

.language-switcher__button--active {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: var(--shadow-button);
}
</style>