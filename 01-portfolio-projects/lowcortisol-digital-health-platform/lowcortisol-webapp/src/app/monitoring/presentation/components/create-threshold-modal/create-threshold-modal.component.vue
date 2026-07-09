<template>
  <div v-if="open" class="modal-shell" role="dialog" aria-modal="true">
    <form class="modal-panel" @submit.prevent="submit">
      <header>
        <h2>{{ t('monitoring.forms.createThresholdTitle') }}</h2>
        <p>{{ t('monitoring.forms.createThresholdSubtitle') }}</p>
      </header>

      <label>
        <span>{{ t('monitoring.forms.name') }}</span>
        <input v-model.trim="form.name" required />
      </label>

      <div class="modal-grid">
        <label>
          <span>{{ t('monitoring.forms.scope') }}</span>
          <select v-model="form.scopeType" required @change="syncScopeId">
            <option
                v-for="option in scopeOptions"
                :key="option.value"
                :value="option.value"
            >
              {{ t(option.labelKey) }}
            </option>
          </select>
        </label>

        <label>
          <span>{{ t('monitoring.forms.physicalLocation') }}</span>
          <select v-model="form.scopeId" required>
            <option value="" disabled>{{ t('monitoring.forms.selectScope') }}</option>
            <option
                v-for="item in scopeItems"
                :key="item.id"
                :value="item.id"
            >
              {{ getPhysicalLabel(item) }}
            </option>
          </select>
        </label>
      </div>

      <div class="modal-grid">
        <label>
          <span>{{ t('monitoring.forms.resourceType') }}</span>
          <select v-model="form.resourceType" required @change="syncUnit">
            <option
                v-for="option in resourceOptions"
                :key="option.value"
                :value="option.value"
            >
              {{ t(option.labelKey) }}
            </option>
          </select>
        </label>

        <label>
          <span>{{ t('monitoring.forms.operator') }}</span>
          <select v-model="form.operator" required>
            <option
                v-for="option in operatorOptions"
                :key="option.value"
                :value="option.value"
            >
              {{ t(option.labelKey) }}
            </option>
          </select>
        </label>
      </div>

      <div class="modal-grid">
        <label>
          <span>{{ t('monitoring.forms.limitValue') }}</span>
          <input v-model.number="form.limitValue" min="0" required step="0.01" type="number" />
        </label>

        <label>
          <span>{{ t('monitoring.forms.unit') }}</span>
          <input v-model.trim="form.unit" required />
        </label>
      </div>

      <label>
        <span>{{ t('monitoring.forms.severity') }}</span>
        <select v-model="form.severity" required>
          <option value="warning">{{ t('monitoring.status.warning') }}</option>
          <option value="critical">{{ t('monitoring.status.critical') }}</option>
        </select>
      </label>

      <footer>
        <UiButton
            :disabled="saving"
            :label="t('monitoring.forms.cancel')"
            type="button"
            variant="ghost"
            @click="$emit('close')"
        />
        <UiButton
            :disabled="saving || !form.scopeId"
            :label="t('monitoring.forms.submitThreshold')"
            type="submit"
            variant="create"
        />
      </footer>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  physicalOptions: {
    type: Object,
    default: () => ({
      sites: [],
      rooms: [],
      deviceGroups: [],
      sensors: [],
    }),
  },
  saving: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "submit"]);
const { t } = useTranslation();

const resourceOptions = [
  {
    value: "water",
    labelKey: "monitoring.resources.water",
  },
  {
    value: "gas",
    labelKey: "monitoring.resources.gas",
  },
];

const scopeOptions = [
  {
    value: "sensor",
    labelKey: "monitoring.forms.sensor",
  },
  {
    value: "deviceGroup",
    labelKey: "monitoring.forms.deviceGroup",
  },
  {
    value: "room",
    labelKey: "monitoring.forms.room",
  },
  {
    value: "site",
    labelKey: "monitoring.forms.site",
  },
];

const operatorOptions = [
  {
    value: "greater_than",
    labelKey: "monitoring.operators.greaterThan",
  },
  {
    value: "greater_or_equal",
    labelKey: "monitoring.operators.greaterOrEqual",
  },
  {
    value: "less_than",
    labelKey: "monitoring.operators.lessThan",
  },
  {
    value: "less_or_equal",
    labelKey: "monitoring.operators.lessOrEqual",
  },
];

const scopeKeyByType = {
  sensor: "sensors",
  deviceGroup: "deviceGroups",
  room: "rooms",
  site: "sites",
};

const payloadKeyByScope = {
  sensor: "sensorId",
  deviceGroup: "deviceGroupId",
  room: "roomId",
  site: "siteId",
};

const form = reactive({
  name: "",
  scopeType: "sensor",
  scopeId: "",
  resourceType: "water",
  operator: "greater_or_equal",
  limitValue: null,
  unit: "L",
  severity: "warning",
});

const scopeItems = computed(() =>
    props.physicalOptions[scopeKeyByType[form.scopeType]] || []
);

watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) resetForm();
    }
);

watch(
    () => props.physicalOptions,
    () => {
      if (props.open && !form.scopeId) resetForm();
    }
);

function resetForm() {
  form.name = "";
  form.scopeType = "sensor";
  form.scopeId = props.physicalOptions.sensors?.[0]?.id || "";
  form.resourceType = props.physicalOptions.sensors?.[0]?.resourceType || "water";
  form.operator = "greater_or_equal";
  form.limitValue = null;
  form.unit = getDefaultUnit(form.resourceType);
  form.severity = "warning";
}

function syncScopeId() {
  const firstItem = scopeItems.value[0];
  form.scopeId = firstItem?.id || "";

  if (form.scopeType === "sensor" && firstItem?.resourceType) {
    form.resourceType = firstItem.resourceType;
    syncUnit();
  }
}

function syncUnit() {
  form.unit = getDefaultUnit(form.resourceType);
}

function getDefaultUnit(resourceType) {
  return resourceType === "gas" ? "m3" : "L";
}

function getPhysicalLabel(item) {
  if (!item) return "";
  if (item.location) {
    const parts = [
      item.location.siteName,
      item.location.roomName,
      item.location.deviceGroupName,
      item.location.deviceName,
      item.location.sensorName || item.name,
    ].filter(Boolean);

    if (parts.length) return parts.join(" / ");
  }

  return item.name || item.id;
}

function submit() {
  const scopeKey = payloadKeyByScope[form.scopeType];

  emit("submit", {
    [scopeKey]: form.scopeId,
    name: form.name,
    resourceType: form.resourceType,
    operator: form.operator,
    limitValue: Number(form.limitValue || 0),
    unit: form.unit,
    severity: form.severity,
  });
}
</script>

<style scoped src="../monitoring-modal.css"></style>
