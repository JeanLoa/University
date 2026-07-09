<template>
  <div v-if="open" class="modal-shell" role="dialog" aria-modal="true">
    <form class="modal-panel" @submit.prevent="submit">
      <header>
        <h2>Crear ambiente</h2>
        <p>Agrega un ambiente fisico dentro de la sede seleccionada.</p>
      </header>

      <label>
        <span>Nombre del ambiente</span>
        <input v-model.trim="form.name" required />
      </label>

      <UiSelect
          v-model="form.type"
          label="Tipo de ambiente"
          :options="roomTypeOptions"
      />

      <footer>
        <UiButton label="Cancelar" variant="ghost" type="button" @click="$emit('close')" />
        <UiButton label="Crear ambiente" variant="create" type="submit" />
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
  siteId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["close", "submit"]);

const roomTypeOptions = [
  {
    value: "kitchen",
    label: "Cocina",
  },
  {
    value: "bathroom",
    label: "Bano",
  },
  {
    value: "warehouse",
    label: "Almacen",
  },
  {
    value: "engine_room",
    label: "Sala de maquinas",
  },
  {
    value: "custom",
    label: "Personalizado",
  },
];

const form = reactive({
  name: "",
  type: "custom",
});

watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        form.name = "";
        form.type = "custom";
      }
    }
);

function submit() {
  emit("submit", { ...form, siteId: props.siteId, status: "active" });
}
</script>

<style scoped src="../workplace-modal.css"></style>
