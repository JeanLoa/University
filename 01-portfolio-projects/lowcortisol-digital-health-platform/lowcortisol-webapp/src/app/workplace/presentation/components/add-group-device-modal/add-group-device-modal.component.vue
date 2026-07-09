<template>
  <div v-if="open" class="modal-shell" role="dialog" aria-modal="true">
    <form class="modal-panel modal-panel--wide" @submit.prevent="submit">
      <header>
        <h2>Agregar equipo al grupo</h2>
        <p>{{ group?.name || "Grupo seleccionado" }}</p>
      </header>

      <label>
        <span>Nombre del equipo</span>
        <input v-model.trim="form.name" required />
      </label>

      <div class="modal-grid">
        <UiSelect
            v-model="form.deviceType"
            label="Tipo de equipo"
            :options="deviceTypeOptions"
        />

        <UiSelect
            v-model="form.resourceType"
            label="Recurso"
            :options="resourceOptions"
        />
      </div>

      <div v-if="form.deviceType === 'sensor'" class="modal-grid">
        <label>
          <span>Valor actual</span>
          <input v-model.number="form.currentValue" min="0" type="number" />
        </label>

        <label>
          <span>Limite</span>
          <input v-model.number="form.threshold" min="0" type="number" />
        </label>
      </div>

      <div v-else class="modal-grid">
        <UiSelect
            v-model="form.sensorId"
            label="Sensor asociado"
            :options="compatibleSensorOptions"
            :placeholder="compatibleSensorOptions.length ? 'Seleccionar sensor' : 'Sin sensores compatibles'"
        />

        <UiSelect
            v-model="form.valveStatus"
            label="Estado de la valvula"
            :options="valveStatusOptions"
        />
      </div>

      <p
          v-if="form.deviceType === 'valve' && compatibleSensors.length === 0"
          class="modal-warning"
      >
        Para registrar una valvula de {{ getResourceLabel(form.resourceType) }} primero debes tener un sensor de {{ getResourceLabel(form.resourceType) }} en este grupo.
      </p>

      <p class="modal-hint">
        El equipo quedara conectado al grupo seleccionado y aparecera en el inventario de la sede.
      </p>

      <footer>
        <UiButton label="Cancelar" variant="ghost" type="button" @click="$emit('close')" />
        <UiButton
            label="Agregar equipo"
            variant="create"
            type="submit"
            :disabled="!canSubmit"
        />
      </footer>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

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
  room: {
    type: Object,
    default: null,
  },
  group: {
    type: Object,
    default: null,
  },
  sensors: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "submit"]);

const deviceTypeOptions = [
  {
    value: "sensor",
    label: "Sensor",
  },
  {
    value: "valve",
    label: "Valvula",
  },
];

const resourceOptions = [
  {
    value: "water",
    label: "Agua",
  },
  {
    value: "gas",
    label: "Gas",
  },
];

const valveStatusOptions = [
  {
    value: "open",
    label: "Abierta",
  },
  {
    value: "closed",
    label: "Cerrada",
  },
];

const form = reactive({
  name: "",
  deviceType: "sensor",
  resourceType: "water",
  sensorId: "",
  currentValue: 0,
  threshold: 300,
  valveStatus: "open",
});

const compatibleSensors = computed(() =>
    props.sensors.filter(
        (sensor) =>
            sensor.resourceType === form.resourceType &&
            sensor.status !== "inactive"
    )
);

const compatibleSensorOptions = computed(() =>
    compatibleSensors.value.map((sensor) => ({
      value: sensor.id,
      label: sensor.name,
      description: `${getResourceLabel(sensor.resourceType)} - ${sensor.currentValue ?? 0} ${sensor.unit || ""}`.trim(),
    }))
);

const canSubmit = computed(() =>
    Boolean(
        props.group &&
        form.name.trim() &&
        (
            form.deviceType !== "valve" ||
            compatibleSensors.value.some((sensor) => sensor.id === form.sensorId)
        )
    )
);

watch(
    () => props.open,
    (isOpen) => {
      if (!isOpen) return;

      const resourceType = props.group?.resourceType === "gas" ? "gas" : "water";
      form.name = "";
      form.deviceType = "sensor";
      form.resourceType = resourceType;
      form.sensorId = "";
      form.currentValue = 0;
      form.threshold = resourceType === "gas" ? 120 : 300;
      form.valveStatus = "open";
    }
);

watch(
    () => form.resourceType,
    (resourceType) => {
      form.threshold = resourceType === "gas" ? 120 : 300;
      form.sensorId = compatibleSensors.value[0]?.id || "";
    }
);

watch(
    () => form.deviceType,
    (deviceType) => {
      if (deviceType === "valve") {
        form.sensorId = compatibleSensors.value[0]?.id || "";
      }
    }
);

watch(
    compatibleSensors,
    (sensors) => {
      if (form.deviceType !== "valve") return;

      if (!sensors.some((sensor) => sensor.id === form.sensorId)) {
        form.sensorId = sensors[0]?.id || "";
      }
    }
);

function submit() {
  if (!canSubmit.value) return;

  const selectedSensor = compatibleSensors.value.find((sensor) => sensor.id === form.sensorId) || null;

  emit("submit", {
    ...form,
    sensorName: selectedSensor?.name || "",
    siteId: props.site?.id || "",
    roomId: props.room?.id || "",
    deviceGroupId: props.group.id,
  });
}

function getResourceLabel(resourceType) {
  const labels = {
    water: "agua",
    gas: "gas",
    mixed: "mixto",
  };

  return labels[resourceType] || "recurso";
}
</script>

<style scoped src="../workplace-modal.css"></style>
