<template>
  <div v-if="open && article" class="modal-shell" role="presentation" @click.self="close">
    <section class="modal-panel modal-panel--wide article-detail" role="dialog" aria-modal="true">
      <header class="article-detail__header">
        <div>
          <span class="article-detail__eyebrow">Articulo de ayuda</span>
          <h2>{{ article.title }}</h2>
          <p>{{ article.summary }}</p>
        </div>

        <span class="article-detail__category">
          {{ categoryLabel }}
        </span>
      </header>

      <section class="article-detail__block">
        <h3>Que cubre</h3>
        <p>{{ article.content || fallbackContent }}</p>
      </section>

      <section class="article-detail__block">
        <h3>Pasos recomendados</h3>
        <ol>
          <li v-for="step in steps" :key="step">
            {{ step }}
          </li>
        </ol>
      </section>

      <section class="article-detail__block article-detail__block--soft">
        <h3>Antes de crear ticket</h3>
        <ul>
          <li v-for="check in checks" :key="check">
            {{ check }}
          </li>
        </ul>
      </section>

      <footer>
        <UiButton label="Cerrar" variant="ghost" type="button" @click="close" />
        <UiButton label="Crear ticket con este tema" variant="action" type="button" @click="createTicket" />
      </footer>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";

import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  article: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "create-ticket"]);

const fallbackContent = "Guia operativa para revisar una situacion dentro de LowCortisol.";

const steps = computed(() => {
  if (Array.isArray(props.article?.steps) && props.article.steps.length > 0) {
    return props.article.steps;
  }

  return [
    "Identifica la sede, ambiente, grupo y recurso relacionado.",
    "Revisa si hay una lectura, alerta, valvula o conducto asociado.",
    "Documenta que accion esperabas y que resultado viste en pantalla.",
  ];
});

const checks = computed(() => {
  if (Array.isArray(props.article?.checks) && props.article.checks.length > 0) {
    return props.article.checks;
  }

  return [
    "La sede existe y esta activa.",
    "El sensor o valvula relacionado aparece en la ubicacion correcta.",
    "El problema se puede reproducir con los datos actuales.",
  ];
});

const categoryLabel = computed(() => {
  const labels = {
    alerts: "Alertas",
    device: "Dispositivos",
    technical: "Configuracion",
    support: "Soporte",
  };

  return labels[props.article?.category] || "Ayuda";
});

function close() {
  emit("close");
}

function createTicket() {
  emit("create-ticket", props.article);
}
</script>

<style scoped src="../support-modal.css"></style>

<style scoped>
.article-detail {
  gap: 20px;
}

.article-detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.article-detail__header > div {
  min-width: 0;
}

.article-detail__category {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  max-width: 160px;
  min-height: 30px;
  flex: 0 0 auto;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-pill);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
  line-height: 1.1;
  padding: 8px 12px;
  text-align: center;
}

.article-detail__eyebrow {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.article-detail__block {
  display: grid;
  gap: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 16px;
}

.article-detail__block--soft {
  background: var(--color-surface-soft);
}

.article-detail__block h3 {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  margin: 0;
}

.article-detail__block p {
  margin: 0;
}

.article-detail__block ol,
.article-detail__block ul {
  display: grid;
  gap: 8px;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
  padding-left: 20px;
}

.article-detail__block li {
  padding-left: 4px;
}

@media (max-width: 620px) {
  .article-detail__header {
    flex-direction: column;
  }
}
</style>
