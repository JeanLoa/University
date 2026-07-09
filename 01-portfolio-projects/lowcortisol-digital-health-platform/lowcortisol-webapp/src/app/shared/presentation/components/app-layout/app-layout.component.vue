<template>
  <div class="app-layout">
    <LanguageSwitcher />

    <main
        class="app-layout__main"
        :class="{ 'app-layout__main--auth': hideNavigation }"
    >
      <slot />
    </main>

    <BottomNavigation v-if="!hideNavigation" />
    <ContextSidePanel v-if="!hideNavigation" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import BottomNavigation from "../bottom-navigation/bottom-navigation.component.vue";
import ContextSidePanel from "../context-side-panel/context-side-panel.component.vue";
import LanguageSwitcher from "../language-switcher/language-switcher.component.vue";

const route = useRoute();

const hideNavigation = computed(() => Boolean(route.meta.hideNavigation));
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--color-background);
}

.app-layout__main {
  width: min(100% - 32px, var(--page-max-width));
  margin: 0 auto;
  padding: 42px 0 calc(var(--bottom-nav-height) + 42px);
}

.app-layout__main--auth {
  min-height: 100vh;
  display: grid;
  align-items: center;
  padding-bottom: 42px;
}
</style>
