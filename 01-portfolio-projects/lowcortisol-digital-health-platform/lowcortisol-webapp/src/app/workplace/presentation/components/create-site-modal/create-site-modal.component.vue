<template>
  <div v-if="open" class="modal-shell" role="dialog" aria-modal="true">
    <form class="modal-panel modal-panel--map" @submit.prevent="submit">
      <header>
        <h2>Crear sede</h2>
        <p>Registra una sede para organizar sus ambientes y dispositivos.</p>
      </header>

      <label>
        <span>Nombre de sede</span>
        <input v-model.trim="form.name" required @input="nameWasEdited = true" />
      </label>

      <label>
        <span>Direccion</span>
        <input v-model.trim="form.address" />
      </label>

      <LocationPickerMap @select="handleLocationSelected" />

      <UiSelect
          v-model="form.type"
          label="Tipo de sede"
          :options="siteTypeOptions"
      />

      <footer>
        <UiButton label="Cancelar" variant="ghost" type="button" @click="$emit('close')" />
        <UiButton label="Crear sede" variant="create" type="submit" />
      </footer>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiSelect from "../../../../shared/presentation/components/ui-select/ui-select.component.vue";
import LocationPickerMap from "../location-picker-map/location-picker-map.component.vue";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);

const siteTypeOptions = [
  {
    value: "residential",
    label: "Residencial",
  },
  {
    value: "business",
    label: "Empresarial",
  },
  {
    value: "industrial",
    label: "Industrial",
  },
];

const form = reactive({
  name: "",
  address: "",
  type: "residential",
  latitude: null,
  longitude: null,
});
const nameWasEdited = ref(false);

watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        form.name = "";
        form.address = "";
        form.type = "residential";
        form.latitude = null;
        form.longitude = null;
        nameWasEdited.value = false;
      }
    }
);

function handleLocationSelected(location) {
  form.latitude = location.latitude;
  form.longitude = location.longitude;
  form.address = location.address || form.address;

  if (!nameWasEdited.value && location.name) {
    form.name = location.name;
  }
}

function submit() {
  emit("submit", { ...form, status: "active" });
}
</script>

<style scoped src="../workplace-modal.css"></style>
