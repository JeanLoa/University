<template>
  <Teleport to="body">
    <div v-if="open" class="notification-modal" role="dialog" aria-modal="true">
      <form class="notification-modal__panel" @submit.prevent="submit">
        <header>
          <div>
            <h2>{{ t("notifications.modals.mitigationTitle") }}</h2>
            <p>{{ incident?.title }}</p>
          </div>

          <button type="button" class="notification-modal__close" @click="$emit('close')">
            x
          </button>
        </header>

        <label>
          <span>{{ t("notifications.modals.targetValve") }}</span>
          <select v-model="selectedValveId" required>
            <option
                v-for="valve in availableValves"
                :key="valve.id"
                :value="valve.id"
            >
              {{ valve.name || valve.id }} - {{ t(`deviceControl.status.${valve.status || 'unknown'}`) }}
            </option>
          </select>
        </label>

        <label>
          <span>{{ t("notifications.modals.requestedBy") }}</span>
          <input v-model.trim="requestedBy" required />
        </label>

        <label>
          <span>{{ t("notifications.modals.mitigationReason") }}</span>
          <textarea v-model.trim="reason" required rows="4" />
        </label>

        <p v-if="availableValves.length === 0" class="notification-modal__warning">
          {{ t("notifications.modals.noValvesForIncident") }}
        </p>

        <footer>
          <UiButton
              variant="neutral"
              :label="t('notifications.actions.cancel')"
              type="button"
              @click="$emit('close')"
          />
          <UiButton
              variant="danger"
              :label="t('notifications.actions.closeValve')"
              type="submit"
              :disabled="busy || availableValves.length === 0"
          />
        </footer>
      </form>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  incident: {
    type: Object,
    default: null,
  },
  valves: {
    type: Array,
    default: () => [],
  },
  devices: {
    type: Array,
    default: () => [],
  },
  busy: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);
const { t } = useTranslation();

const selectedValveId = ref("");
const requestedBy = ref("");
const reason = ref("");

const availableValves = computed(() => {
  if (!props.incident) return [];

  const incidentDevice = props.devices.find((device) => device.id === props.incident.deviceId) || null;

  return props.valves.filter((valve) =>
      valve.deviceId === props.incident.deviceId ||
      valve.siteId === props.incident.siteId ||
      valve.deviceId === incidentDevice?.id
  );
});

watch(
    () => [props.open, props.incident?.id, availableValves.value.length],
    ([isOpen]) => {
      if (!isOpen) return;

      const preferredValve =
          availableValves.value.find((valve) => valve.status === "open") ||
          availableValves.value[0] ||
          null;

      selectedValveId.value = preferredValve?.id || "";
      requestedBy.value = t("notifications.center.defaultOperator");
      reason.value = t("notifications.modals.defaultMitigationReason");
    },
    { immediate: true }
);

function submit() {
  const valve = availableValves.value.find((item) => item.id === selectedValveId.value) || null;

  emit("submit", {
    deviceId: props.incident?.deviceId || valve?.deviceId || "",
    valveId: selectedValveId.value,
    requestedBy: requestedBy.value,
    reason: reason.value,
  });
}
</script>

<style scoped>
.notification-modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.42);
  padding: 20px;
}

.notification-modal__panel {
  display: grid;
  gap: 18px;
  width: min(560px, 100%);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  padding: 22px;
}

.notification-modal__panel header,
.notification-modal__panel footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.notification-modal__panel h2 {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 900;
  margin: 0;
}

.notification-modal__panel header p {
  color: var(--color-text-muted);
  line-height: 1.45;
  margin: 6px 0 0;
}

.notification-modal__close {
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
}

.notification-modal__panel label {
  display: grid;
  gap: 8px;
  color: var(--color-text);
  font-weight: 900;
}

.notification-modal__panel input,
.notification-modal__panel textarea,
.notification-modal__panel select {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  padding: 12px;
}

.notification-modal__warning {
  border: 1px solid #fde68a;
  border-radius: var(--radius-md);
  background: #fffbeb;
  color: var(--color-warning);
  font-weight: 800;
  margin: 0;
  padding: 12px;
}
</style>
