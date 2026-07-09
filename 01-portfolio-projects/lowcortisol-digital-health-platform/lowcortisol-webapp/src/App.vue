<template>
  <RouterView />
</template>

<script setup>
import { onMounted } from "vue";
import { ThemeService } from "./app/shared/application/services/theme.service";
import { TranslationService } from "./app/shared/application/services/translation.service";

onMounted(async () => {
  ThemeService.initialize();
  await TranslationService.initialize();
});
</script>