<template>
  <div v-if="open" class="modal-shell" role="dialog" aria-modal="true">
    <form class="modal-panel" @submit.prevent="submit">
      <header>
        <h2>Asignar responsable</h2>
        <p>{{ site?.name || "Sede seleccionada" }}</p>
      </header>

      <label>
        <span>Nombre completo</span>
        <input v-model.trim="form.fullName" required />
      </label>

      <label>
        <span>Correo</span>
        <input v-model.trim="form.email" required type="email" />
      </label>

      <UiSelect
          v-model="form.role"
          label="Rol operativo"
          :options="roleOptions"
      />

      <p class="modal-hint">
        El responsable quedara asociado a esta sede para seguimiento operativo y asignacion de dispositivos.
      </p>

      <footer>
        <UiButton label="Cancelar" variant="ghost" type="button" @click="$emit('close')" />
        <UiButton label="Asignar responsable" variant="create" type="submit" />
      </footer>
    </form>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiSelect from "../../../../shared/presentation/components/ui-select/ui-select.component.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  site: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const roleOptions = [
  {
    value: "owner",
    label: "Propietario",
    description: "Gestiona la sede y sus decisiones principales.",
  },
  {
    value: "admin",
    label: "Administrador",
    description: "Configura ambientes, grupos y responsables.",
  },
  {
    value: "operator",
    label: "Operador",
    description: "Atiende alertas, dispositivos e incidencias.",
  },
  {
    value: "viewer",
    label: "Observador",
    description: "Consulta informacion sin ejecutar acciones.",
  },
];

const form = reactive({
  fullName: "",
  email: "",
  role: "operator",
});

watch(
    () => props.open,
    (isOpen) => {
      if (!isOpen) return;

      form.fullName = "";
      form.email = "";
      form.role = "operator";
    }
);

function submit() {
  emit("submit", {
    fullName: form.fullName,
    email: form.email,
    role: form.role,
  });
}
</script>

<style scoped src="../workplace-modal.css"></style>
