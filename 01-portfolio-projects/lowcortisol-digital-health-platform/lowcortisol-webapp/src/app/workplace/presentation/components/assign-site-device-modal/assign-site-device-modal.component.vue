<template>
  <div v-if="open" class="modal-shell" role="dialog" aria-modal="true">
    <form class="modal-panel modal-panel--wide" @submit.prevent="submit">
      <header>
        <h2>Asignar dispositivo</h2>
        <p>{{ site?.name || "Sede seleccionada" }}</p>
      </header>

      <div v-if="!devices.length" class="modal-empty">
        Primero agrega sensores o valvulas a un grupo de la sede.
      </div>

      <div v-else-if="!members.length" class="modal-empty">
        Primero asigna al menos un responsable a la sede.
      </div>

      <template v-else>
        <UiSelect
            v-model="form.deviceId"
            label="Dispositivo"
            :options="deviceOptions"
        />

        <UiSelect
            v-model="form.memberId"
            label="Responsable"
            :options="memberOptions"
        />

        <p class="modal-hint">
          Esta asignacion indica quien administra o atiende el dispositivo dentro de la sede.
        </p>
      </template>

      <footer>
        <UiButton label="Cancelar" variant="ghost" type="button" @click="$emit('close')" />
        <UiButton
            label="Asignar dispositivo"
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
  devices: {
    type: Array,
    default: () => [],
  },
  members: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "submit"]);

const form = reactive({
  deviceId: "",
  memberId: "",
});

const deviceOptions = computed(() =>
    props.devices.map((device) => ({
      value: device.id,
      label: device.name,
      description: `${getDeviceTypeLabel(device.type)} / ${device.roomName} / ${device.groupName}`,
    }))
);

const memberOptions = computed(() =>
    props.members.map((member) => ({
      value: member.id,
      label: member.fullName,
      description: getRoleLabel(member.role),
    }))
);

const canSubmit = computed(() => Boolean(form.deviceId && form.memberId));

watch(
    () => props.open,
    (isOpen) => {
      if (!isOpen) return;

      form.deviceId = props.devices[0]?.id || "";
      form.memberId = props.members[0]?.id || "";
    }
);

function getDeviceTypeLabel(type) {
  const labels = {
    sensor: "Sensor",
    valve: "Valvula",
    hub: "Hub",
  };

  return labels[type] || "Dispositivo";
}

function getRoleLabel(role) {
  const labels = {
    owner: "Propietario",
    admin: "Administrador",
    operator: "Operador",
    viewer: "Observador",
  };

  return labels[role] || "Responsable";
}

function submit() {
  if (!canSubmit.value) return;

  emit("submit", {
    deviceId: form.deviceId,
    memberId: form.memberId,
  });
}
</script>

<style scoped src="../workplace-modal.css"></style>
