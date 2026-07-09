<template>
  <AppLayout>
    <section class="not-found">
      <UiCard title="Página no encontrada" eyebrow="404">
        <p class="not-found__text">
          La sección solicitada no existe o fue movida.
        </p>

        <RouterLink class="btn-primary" :to="{ name: 'dashboard' }">
          Volver al panel
        </RouterLink>
      </UiCard>
    </section>
  </AppLayout>
</template>

<script setup>
import AppLayout from "../../components/app-layout/app-layout.component.vue";
import UiCard from "../../components/ui-card/ui-card.component.vue";
</script>

<style scoped>
.not-found {
  max-width: 520px;
  margin: 120px auto 0;
}

.not-found__text {
  color: var(--color-text-muted);
  margin: 0 0 22px;
}
</style>