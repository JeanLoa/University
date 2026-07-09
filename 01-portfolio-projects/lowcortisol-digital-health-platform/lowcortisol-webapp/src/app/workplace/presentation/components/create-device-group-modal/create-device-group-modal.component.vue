<template>
  <div v-if="open" class="modal-shell" role="dialog" aria-modal="true">
    <form class="modal-panel" @submit.prevent="submit">
      <header>
        <h2>Crear grupo</h2>
        <p>Agrupa sensores, valvulas y hubs por recurso o zona operativa.</p>
      </header>

      <label>
        <span>Nombre del grupo</span>
        <input v-model.trim="form.name" required />
      </label>

      <UiSelect
          v-model="form.resourceType"
          label="Recurso"
          :options="resourceOptions"
      />

      <footer>
        <UiButton label="Cancelar" variant="ghost" type="button" @click="$emit('close')" />
        <UiButton label="Crear grupo" variant="create" type="submit" />
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
  roomId: {
    type: String,
    default: "",
  },
  defaultResourceType: {
    type: String,
    default: "mixed",
  },
});

const emit = defineEmits(["close", "submit"]);

const resourceOptions = [
  {
    value: "water",
    label: "Agua",
  },
  {
    value: "gas",
    label: "Gas",
  },
  {
    value: "mixed",
    label: "Mixto",
  },
];

const form = reactive({
  name: "",
  resourceType: "mixed",
});

watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        form.name = "";
        form.resourceType = props.defaultResourceType || "mixed";
      }
    }
);

function submit() {
  emit("submit", { ...form, roomId: props.roomId, status: "active" });
}
</script>

<style scoped src="../workplace-modal.css"></style>
