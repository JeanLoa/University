<template>
  <div v-if="open" class="modal-shell" role="presentation" @click.self="close">
    <form class="modal-panel modal-panel--wide" role="dialog" aria-modal="true" @submit.prevent="submit">
      <header>
        <h2>Crear ticket</h2>
        <p>Describe el problema para que soporte pueda revisar el contexto correcto.</p>
      </header>

      <label class="modal-field">
        <span>Titulo del ticket</span>
        <input
            v-model="form.title"
            type="text"
            placeholder="Ej. No puedo cerrar una valvula de agua"
        />
      </label>

      <div class="modal-grid">
        <UiSelect
            v-model="form.category"
            label="Tipo de solicitud"
            :options="categoryOptions"
        />

        <div class="ticket-priority">
          <span>Prioridad estimada</span>
          <strong>{{ priorityLabel }}</strong>
          <small>{{ priorityHint }}</small>
        </div>
      </div>

      <label class="modal-field">
        <span>Detalle</span>
        <textarea
            v-model="form.description"
            placeholder="Cuenta que estabas intentando hacer, donde ocurrio y que resultado esperabas."
        ></textarea>
      </label>

      <p class="modal-hint">
        El ticket se guarda con tu sesion actual y abre una conversacion para continuar el seguimiento.
      </p>

      <p v-if="error" class="modal-warning">
        {{ error }}
      </p>

      <footer>
        <UiButton label="Cancelar" variant="ghost" type="button" @click="close" />
        <UiButton label="Crear ticket" variant="action" type="submit" />
      </footer>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiSelect from "../../../../shared/presentation/components/ui-select/ui-select.component.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  initialTicket: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["close", "submit"]);

const categoryOptions = [
  {
    value: "incident",
    label: "Alerta o incidente",
    description: "Riesgo operativo, consumo anomalo o respuesta urgente.",
  },
  {
    value: "device",
    label: "Dispositivos",
    description: "Valvulas, sensores, medicion, estado o asociacion fisica.",
  },
  {
    value: "technical",
    label: "Configuracion",
    description: "Sedes, conductos, reportes o uso de la plataforma.",
  },
  {
    value: "support",
    label: "Consulta general",
    description: "Duda operativa que requiere orientacion.",
  },
];

const form = reactive({
  title: "",
  description: "",
  category: "technical",
});

const error = ref("");

const priorityLabel = computed(() => {
  const labels = {
    incident: "Alta",
    device: "Alta",
    technical: "Media",
    support: "Media",
  };

  return labels[form.category] || "Media";
});

const priorityHint = computed(() => {
  const hints = {
    incident: "Se atiende primero porque puede afectar agua, gas o continuidad.",
    device: "Requiere revision de dispositivos, medicion o enlace con conducto.",
    technical: "Se revisa como configuracion de uso o datos.",
    support: "Se responde como consulta operativa.",
  };

  return hints[form.category] || hints.technical;
});

watch(
    () => props.open,
    (open) => {
      if (!open) return;
      resetForm();
    }
);

function resetForm() {
  form.title = props.initialTicket.title || "";
  form.description = props.initialTicket.description || "";
  form.category = props.initialTicket.category || "technical";
  error.value = "";
}

function close() {
  emit("close");
}

function submit() {
  const title = form.title.trim();
  const description = form.description.trim();

  if (!title || !description) {
    error.value = "Completa el titulo y el detalle antes de crear el ticket.";
    return;
  }

  emit("submit", {
    title,
    description,
    category: form.category,
  });
}
</script>

<style scoped src="../support-modal.css"></style>

<style scoped>
.ticket-priority {
  display: grid;
  gap: 6px;
  align-content: center;
  min-height: 78px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 12px 14px;
}

.ticket-priority span {
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 900;
}

.ticket-priority strong {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
}

.ticket-priority small {
  color: var(--color-text-muted);
  font-weight: 800;
  line-height: 1.4;
}
</style>
