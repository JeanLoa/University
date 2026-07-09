<template>
  <AppLayout>
    <section class="page-header">
      <div>
        <h1 class="page-title">Conductos</h1>
        <p class="page-subtitle">
          Administra salidas de agua o gas controladas por una valvula y medidas por su sensor asociado.
        </p>
      </div>

      <UiButton label="Agregar conducto" variant="action" @click="openCreateModal" />
    </section>

    <div v-if="state.message" class="page-message">
      {{ state.message }}
    </div>

    <section class="grid grid-3 devices-summary">
      <UiCard title="Conductos registrados" compact>
        <p class="summary-number">{{ conduits.length }}</p>
        <p class="summary-label">Salidas finales configuradas</p>
      </UiCard>

      <UiCard title="Conductos de agua" compact>
        <p class="summary-number">{{ waterConduits }}</p>
        <p class="summary-label">Canos, mangueras y salidas de agua</p>
      </UiCard>

      <UiCard title="Conductos de gas" compact>
        <p class="summary-number">{{ gasConduits }}</p>
        <p class="summary-label">Tuberias y salidas de gas</p>
      </UiCard>

      <UiCard title="Valvulas libres" compact>
        <p class="summary-number">{{ freeValves.length }}</p>
        <p class="summary-label">Disponibles para nuevos conductos</p>
      </UiCard>

      <UiCard title="Valvulas asignadas" compact>
        <p class="summary-number">{{ assignedValveCount }}</p>
        <p class="summary-label">Controlan un conducto</p>
      </UiCard>

      <UiCard title="Sensores activos" compact>
        <p class="summary-number">{{ state.summary.activeSensors }}</p>
        <p class="summary-label">Miden consumo de salida</p>
      </UiCard>
    </section>

    <section class="grid grid-2">
      <UiCard title="Listado de conductos">
        <div v-if="state.loading" class="empty-state">
          Cargando conductos...
        </div>

        <div v-else-if="state.error" class="error-state">
          {{ state.error }}
        </div>

        <div v-else-if="conduits.length === 0" class="empty-state">
          Aun no hay conductos registrados. Agrega uno y asignale una valvula libre.
        </div>

        <div v-else class="conduit-list">
          <button
              v-for="conduit in conduits"
              :key="conduit.id"
              type="button"
              class="conduit-card"
              :class="{ 'conduit-card--active': conduit.id === state.selectedDeviceId }"
              @click="selectDevice(conduit.id)"
          >
            <div>
              <h3>{{ conduit.name }}</h3>
              <p>
                {{ getConduitTypeLabel(conduit.conduitType) }} - {{ getResourceLabel(conduit.resourceType) }}
              </p>
              <small>{{ getConduitPath(conduit) }}</small>
            </div>

            <StatusBadge
                :status="conduit.flowStatus === 'active' || conduit.status === 'online' ? 'active' : 'warning'"
                :label="conduit.flowStatus === 'active' ? 'Activo' : getStatusLabel(conduit.status)"
            />
          </button>
        </div>
      </UiCard>

      <UiCard title="Detalle del conducto">
        <div v-if="selectedConduit" class="detail">
          <div class="detail-header">
            <div>
              <h3>{{ selectedConduit.name }}</h3>
              <p>
                {{ getConduitTypeLabel(selectedConduit.conduitType) }} - {{ getResourceLabel(selectedConduit.resourceType) }}
              </p>
            </div>

            <StatusBadge
                :status="selectedConduit.flowStatus === 'active' || selectedConduit.status === 'online' ? 'active' : 'warning'"
                :label="selectedConduit.flowStatus === 'active' ? 'Activo' : getStatusLabel(selectedConduit.status)"
            />
          </div>

          <div class="metric-list">
            <div class="metric-row">
              <span>Ubicacion fisica</span>
              <strong>{{ getConduitPath(selectedConduit) }}</strong>
            </div>

            <div class="metric-row">
              <span>Valvula asignada</span>
              <strong>{{ selectedValve?.name || "Sin valvula" }}</strong>
            </div>

            <div class="metric-row">
              <span>Apertura de valvula</span>
              <strong>{{ selectedValve?.openingPercentage ?? 0 }}%</strong>
            </div>

            <div class="metric-row">
              <span>Flujo configurado</span>
              <strong>{{ formatFlowRate(selectedConduit.flowRatePerMinute, selectedConduit.resourceType) }}</strong>
            </div>

            <div class="metric-row">
              <span>Sensor de medicion</span>
              <strong>{{ selectedSensor?.name || "Sin sensor" }}</strong>
            </div>

            <div class="metric-row">
              <span>Lectura del conducto</span>
              <strong>{{ selectedSensor ? `${selectedSensor.currentValue} ${selectedSensor.unit}` : "0" }}</strong>
            </div>

            <div class="metric-row">
              <span>Estado de consumo</span>
              <strong>{{ selectedConduit.flowStatus === "active" ? "Activo" : "Detenido" }}</strong>
            </div>

            <div class="metric-row">
              <span>Ultimo consumo generado</span>
              <strong>{{ formatConsumption(selectedConduit.lastConsumptionValue, selectedConduit.resourceType) }}</strong>
            </div>

            <div class="metric-row">
              <span>Consumo acumulado</span>
              <strong>{{ formatConsumption(selectedConduit.totalConsumption, selectedConduit.resourceType) }}</strong>
            </div>
          </div>

          <p v-if="actionError" class="modal-warning">
            {{ actionError }}
          </p>

          <p v-else-if="selectedValve && !canActivateSelectedConduit" class="modal-warning">
            Para activar este conducto, la valvula debe estar abierta y su sensor debe estar activo.
          </p>

          <div class="detail-actions">
            <UiButton
                label="Activar conducto"
                variant="action"
                :disabled="!canActivateSelectedConduit"
                @click="handleActivateSelectedConduit"
            />

            <UiButton
                label="Detener conducto"
                variant="neutral"
                :disabled="selectedConduit.flowStatus !== 'active'"
                @click="handleDeactivateSelectedConduit"
            />

            <UiButton
                label="Desanclar conducto"
                variant="danger"
                @click="openRemoveConduitConfirmation"
            />
          </div>
        </div>

        <div v-else class="empty-state">
          Selecciona un conducto para revisar su valvula y su sensor.
        </div>
      </UiCard>
    </section>

    <section class="grid grid-2 devices-bottom">
      <UiCard title="Valvula del conducto">
        <div v-if="!selectedValve" class="empty-state">
          Este conducto no tiene valvula asociada.
        </div>

        <div v-else class="relation-card">
          <div>
            <h3>{{ selectedValve.name }}</h3>
            <p>{{ getResourceLabel(selectedValve.resourceType) }} - {{ selectedValve.openingPercentage ?? 0 }}% de apertura</p>
          </div>

          <StatusBadge
              :status="selectedValve.status === 'open' ? 'active' : 'warning'"
              :label="selectedValve.status === 'open' ? 'Abierta' : 'Cerrada'"
          />
        </div>
      </UiCard>

      <UiCard title="Sensor que mide la salida">
        <div v-if="!selectedSensor" class="empty-state">
          La valvula asociada aun no tiene sensor de medicion.
        </div>

        <div v-else class="relation-card">
          <div>
            <h3>{{ selectedSensor.name }}</h3>
            <p>{{ getResourceLabel(selectedSensor.resourceType) }} - {{ selectedSensor.currentValue }} {{ selectedSensor.unit }}</p>
          </div>

          <StatusBadge
              :status="selectedSensor.status === 'active' ? 'active' : 'warning'"
              :label="selectedSensor.status === 'active' ? 'Activo' : 'Apagado'"
          />
        </div>
      </UiCard>
    </section>

    <div v-if="conduitModalOpen" class="modal-shell" role="dialog" aria-modal="true">
      <form class="modal-panel" @submit.prevent="handleCreateConduit">
        <header>
          <h2>Agregar conducto</h2>
          <p>El conducto necesita una valvula libre. Una valvula solo puede controlar un conducto.</p>
        </header>

        <label>
          <span>Nombre del conducto</span>
          <input v-model.trim="conduitForm.name" required />
        </label>

        <div class="modal-grid">
          <UiSelect
              v-model="conduitForm.siteId"
              label="Sede"
              :options="siteOptions"
              :placeholder="siteOptions.length ? 'Seleccionar sede' : 'No hay sedes con valvulas libres'"
          />

          <UiSelect
              v-model="conduitForm.roomId"
              label="Habitacion"
              :options="roomOptions"
              :placeholder="conduitForm.siteId ? 'Seleccionar habitacion' : 'Primero elige una sede'"
          />
        </div>

        <div class="modal-grid">
          <UiSelect
              v-model="conduitForm.resourceType"
              label="Recurso"
              :options="resourceOptions"
          />

          <UiSelect
              v-model="conduitForm.conduitType"
              label="Tipo de conducto"
              :options="conduitTypeOptions"
          />
        </div>

        <label>
          <span>Flujo del conducto ({{ getFlowUnit(conduitForm.resourceType) }})</span>
          <input
              v-model.number="conduitForm.flowRatePerMinute"
              min="0.01"
              step="0.01"
              required
              type="number"
          />
          <small class="field-hint">
            Se sugerira un valor por tipo de conducto, pero puedes ajustarlo para probar consumos mas reales.
          </small>
        </label>

        <div class="valve-picker">
          <div class="valve-picker__header">
            <span>Valvulas libres disponibles</span>
            <small>Solo aparecen las valvulas libres de la sede, habitacion y recurso elegidos.</small>
          </div>

          <p v-if="!conduitForm.siteId || !conduitForm.roomId" class="modal-warning">
            Selecciona una sede y una habitacion para ver las valvulas que pueden controlar el conducto.
          </p>

          <p v-else-if="availableValveCards.length === 0" class="modal-warning">
            No hay valvulas libres de {{ getResourceLabel(conduitForm.resourceType) }} en esta habitacion. Crea una valvula con sensor o libera una antes de registrar este conducto.
          </p>

          <div v-else class="valve-option-grid">
            <button
                v-for="option in availableValveCards"
                :key="option.value"
                type="button"
                class="valve-option-card"
                :class="{ 'valve-option-card--active': option.value === conduitForm.valveId }"
                @click="conduitForm.valveId = option.value"
            >
              <div>
                <h3>{{ option.label }}</h3>
                <p>{{ option.location }}</p>
                <small>Sensor: {{ option.sensorName }}</small>
              </div>

              <strong>{{ option.opening }}%</strong>
            </button>
          </div>
        </div>

        <p v-if="actionError" class="modal-warning">
          {{ actionError }}
        </p>

        <footer>
          <UiButton label="Cancelar" variant="ghost" type="button" @click="closeCreateModal" />
          <UiButton
              label="Registrar conducto"
              variant="create"
              type="submit"
              :disabled="!canCreateConduit"
          />
        </footer>
      </form>
    </div>

    <ConfirmationModal
        :open="removeConduitModalOpen"
        title="Desanclar conducto"
        message="El conducto se eliminara de la operacion, pero la valvula y el sensor asociados se conservaran."
        :detail="selectedConduit ? `${selectedConduit.name} dejara libre su valvula asignada.` : ''"
        confirm-label="Desanclar"
        cancel-label="Cancelar"
        tone="danger"
        @close="removeConduitModalOpen = false"
        @confirm="handleRemoveSelectedConduit"
    />
  </AppLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import ConfirmationModal from "../../../../shared/presentation/components/confirmation-modal/confirmation-modal.component.vue";
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";
import UiSelect from "../../../../shared/presentation/components/ui-select/ui-select.component.vue";

import { useDeviceControlStore } from "../../../application/store/device-control.store";

const {
  state,
  loadDevicePage,
  refreshDevicePage,
  selectDevice,
  createConduit,
  removeConduit,
  activateConduit,
  deactivateConduit,
} = useDeviceControlStore();

const conduitModalOpen = ref(false);
const removeConduitModalOpen = ref(false);
const actionError = ref("");
let refreshTimer = null;
const conduitForm = reactive({
  name: "",
  siteId: "",
  roomId: "",
  resourceType: "water",
  conduitType: "cano",
  flowRatePerMinute: 8,
  valveId: "",
});

const resourceOptions = [
  { value: "water", label: "Agua" },
  { value: "gas", label: "Gas" },
];

const conduitTypes = [
  { value: "cano", label: "Cano", resourceType: "water", flowRatePerMinute: 8 },
  { value: "manguera", label: "Manguera", resourceType: "water", flowRatePerMinute: 14 },
  { value: "regadera", label: "Regadera", resourceType: "water", flowRatePerMinute: 9 },
  { value: "ducha", label: "Ducha", resourceType: "water", flowRatePerMinute: 10 },
  { value: "lavamanos", label: "Lavamanos", resourceType: "water", flowRatePerMinute: 5 },
  { value: "lavadero", label: "Lavadero", resourceType: "water", flowRatePerMinute: 7 },
  { value: "inodoro", label: "Inodoro", resourceType: "water", flowRatePerMinute: 6 },
  { value: "riego", label: "Salida de riego", resourceType: "water", flowRatePerMinute: 18 },
  { value: "tuberia_agua", label: "Tuberia de agua", resourceType: "water", flowRatePerMinute: 20 },
  { value: "tuberia_gas", label: "Tuberia de gas", resourceType: "gas", flowRatePerMinute: 1.6 },
  { value: "cocina_gas", label: "Cocina a gas", resourceType: "gas", flowRatePerMinute: 0.8 },
  { value: "calentador_gas", label: "Calentador a gas", resourceType: "gas", flowRatePerMinute: 1.1 },
  { value: "quemador", label: "Quemador", resourceType: "gas", flowRatePerMinute: 1.3 },
  { value: "linea_gas", label: "Linea industrial de gas", resourceType: "gas", flowRatePerMinute: 2.2 },
];

const conduits = computed(() => state.conduits);
const waterConduits = computed(() =>
    conduits.value.filter((conduit) => conduit.resourceType === "water").length
);
const gasConduits = computed(() =>
    conduits.value.filter((conduit) => conduit.resourceType === "gas").length
);
const assignedValveCount = computed(() =>
    new Set(conduits.value.map((conduit) => conduit.valveId).filter(Boolean)).size
);
const freeValvePlacements = computed(() =>
    state.valves
        .map((valve) => buildValvePlacement(valve))
        .filter((placement) =>
            placement.sensor &&
            !placement.valve.conduitId &&
            !conduits.value.some((conduit) => conduit.valveId === placement.valve.id)
        )
);
const freeValves = computed(() =>
    freeValvePlacements.value.map((placement) => placement.valve)
);
const siteOptions = computed(() =>
    toUniqueOptions(
        freeValvePlacements.value
            .filter((placement) => placement.siteId)
            .map((placement) => ({
              value: placement.siteId,
              label: placement.siteName,
            }))
    )
);
const roomOptions = computed(() =>
    toUniqueOptions(
        freeValvePlacements.value
            .filter((placement) => placement.siteId === conduitForm.siteId && placement.roomId)
            .map((placement) => ({
              value: placement.roomId,
              label: placement.roomName,
            }))
    )
);
const selectedConduit = computed(() =>
    conduits.value.find((conduit) => conduit.id === state.selectedDeviceId) || conduits.value[0] || null
);
const selectedValve = computed(() => getConduitValve(selectedConduit.value));
const selectedSensor = computed(() => getConduitSensor(selectedConduit.value));
const canActivateSelectedConduit = computed(() =>
    Boolean(
        selectedConduit.value &&
        selectedValve.value &&
        selectedValve.value.status === "open" &&
        Number(selectedValve.value.openingPercentage || 0) > 0 &&
        selectedSensor.value?.status === "active"
    )
);
const conduitTypeOptions = computed(() =>
    conduitTypes
        .filter((type) => type.resourceType === conduitForm.resourceType)
        .map((type) => ({
          value: type.value,
          label: type.label,
        }))
);
const availableValvePlacements = computed(() =>
    freeValvePlacements.value.filter((placement) =>
        placement.siteId === conduitForm.siteId &&
        placement.roomId === conduitForm.roomId &&
        placement.valve.resourceType === conduitForm.resourceType
    )
);
const availableValveCards = computed(() =>
    availableValvePlacements.value.map((placement) => ({
      value: placement.valve.id,
      label: placement.valve.name,
      location: [placement.siteName, placement.roomName, placement.deviceGroupName]
          .filter(Boolean)
          .join(" / "),
      sensorName: placement.sensor?.name || "Sensor asociado",
      opening: placement.valve.openingPercentage ?? 0,
    }))
);
const canCreateConduit = computed(() =>
    Boolean(
        conduitForm.name.trim() &&
        conduitForm.siteId &&
        conduitForm.roomId &&
        conduitForm.valveId &&
        Number(conduitForm.flowRatePerMinute || 0) > 0
    )
);

watch(
    () => conduitForm.siteId,
    () => {
      if (!roomOptions.value.some((option) => option.value === conduitForm.roomId)) {
        conduitForm.roomId = roomOptions.value[0]?.value || "";
      }

      conduitForm.valveId = "";
    }
);

watch(
    () => conduitForm.roomId,
    () => {
      conduitForm.valveId = "";
    }
);

watch(
    () => conduitForm.resourceType,
    () => {
      conduitForm.conduitType = conduitTypeOptions.value[0]?.value || "";
      applySuggestedFlowRate();
      conduitForm.valveId = "";
    }
);

watch(
    () => conduitForm.conduitType,
    () => {
      applySuggestedFlowRate();
    }
);

watch(
    availableValveCards,
    (options) => {
      if (!options.some((option) => option.value === conduitForm.valveId)) {
        conduitForm.valveId = "";
      }
    }
);

onMounted(async () => {
  await loadDevicePage();

  if (!state.selectedDeviceId && conduits.value.length > 0) {
    selectDevice(conduits.value[0].id);
  }

  refreshTimer = window.setInterval(() => {
    refreshDevicePage();
  }, 2000);
});

onBeforeUnmount(() => {
  if (refreshTimer) {
    window.clearInterval(refreshTimer);
  }
});

function openCreateModal() {
  actionError.value = "";
  conduitForm.name = "";
  conduitForm.siteId = siteOptions.value[0]?.value || "";
  conduitForm.roomId = roomOptions.value[0]?.value || "";
  conduitForm.resourceType = "water";
  conduitForm.conduitType = "cano";
  conduitForm.flowRatePerMinute = getSuggestedFlowRate("cano");
  conduitForm.valveId = "";
  conduitModalOpen.value = true;
}

function closeCreateModal() {
  actionError.value = "";
  conduitModalOpen.value = false;
}

async function handleCreateConduit() {
  if (!canCreateConduit.value) return;

  actionError.value = "";

  try {
    await createConduit({
      name: conduitForm.name,
      siteId: conduitForm.siteId,
      roomId: conduitForm.roomId,
      resourceType: conduitForm.resourceType,
      conduitType: conduitForm.conduitType,
      flowRatePerMinute: Number(conduitForm.flowRatePerMinute || 0),
      valveId: conduitForm.valveId,
    });

    closeCreateModal();
  } catch (error) {
    actionError.value = error.message || "No se pudo registrar el conducto.";
  }
}

function openRemoveConduitConfirmation() {
  if (!selectedConduit.value) return;

  removeConduitModalOpen.value = true;
}

async function handleRemoveSelectedConduit() {
  if (!selectedConduit.value) return;

  actionError.value = "";

  try {
    await removeConduit(selectedConduit.value.id);
    removeConduitModalOpen.value = false;
  } catch (error) {
    actionError.value = error.message || "No se pudo desanclar el conducto.";
  }
}

async function handleActivateSelectedConduit() {
  if (!selectedConduit.value) return;

  actionError.value = "";

  try {
    await activateConduit(selectedConduit.value.id);
  } catch (error) {
    actionError.value = error.message || "No se pudo activar el conducto.";
  }
}

async function handleDeactivateSelectedConduit() {
  if (!selectedConduit.value) return;

  actionError.value = "";

  try {
    await deactivateConduit(selectedConduit.value.id);
  } catch (error) {
    actionError.value = error.message || "No se pudo detener el conducto.";
  }
}

function getConduitValve(conduit) {
  if (!conduit) return null;

  return state.valves.find((valve) => valve.id === conduit.valveId) || null;
}

function getConduitSensor(conduit) {
  if (!conduit) return null;

  return state.sensors.find((sensor) => sensor.id === conduit.sensorId) || null;
}

function buildValvePlacement(valve) {
  const valveDevice = findValveDevice(valve);
  const sensor = getValveSensor(valve);

  return {
    valve,
    sensor,
    siteId: valve.siteId || valveDevice?.siteId || "",
    siteName: valveDevice?.siteName || valve.siteId || "Sede sin nombre",
    roomId: valve.roomId || valveDevice?.roomId || "",
    roomName: valveDevice?.roomName || valve.roomId || "Habitacion sin nombre",
    deviceGroupId: valve.deviceGroupId || valveDevice?.deviceGroupId || "",
    deviceGroupName: valveDevice?.deviceGroupName || valve.deviceGroupId || "",
  };
}

function findValveDevice(valve) {
  return state.devices.find((device) => device.id === valve?.deviceId) || null;
}

function getValveSensor(valve) {
  if (!valve) return null;

  return (
      state.sensors.find((sensor) => sensor.id === valve.sensorId) ||
      state.sensors.find((sensor) =>
          sensor.deviceId === valve.deviceId &&
          sensor.resourceType === valve.resourceType
      ) ||
      null
  );
}

function toUniqueOptions(options) {
  const seen = new Set();

  return options.filter((option) => {
    if (!option.value || seen.has(option.value)) return false;

    seen.add(option.value);
    return true;
  });
}

function getConduitPath(conduit) {
  return conduit?.physicalPath || [conduit?.siteName, conduit?.roomName, conduit?.deviceGroupName]
      .filter(Boolean)
      .join(" / ") || "Sin ubicacion";
}

function getConduitTypeLabel(type) {
  const match = conduitTypes.find((entry) => entry.value === type);

  return match?.label || "Conducto";
}

function getResourceLabel(resourceType) {
  const labels = {
    water: "Agua",
    gas: "Gas",
  };

  return labels[resourceType] || "Recurso";
}

function getResourceUnit(resourceType) {
  return resourceType === "gas" ? "m3" : "L";
}

function getFlowUnit(resourceType) {
  return resourceType === "gas" ? "m3/min" : "L/min";
}

function getSuggestedFlowRate(conduitType) {
  const match = conduitTypes.find((entry) => entry.value === conduitType);

  return match?.flowRatePerMinute || (conduitForm.resourceType === "gas" ? 1 : 8);
}

function applySuggestedFlowRate() {
  conduitForm.flowRatePerMinute = getSuggestedFlowRate(conduitForm.conduitType);
}

function formatConsumption(value, resourceType) {
  return `${Number(value || 0)} ${getResourceUnit(resourceType)}`;
}

function formatFlowRate(value, resourceType) {
  return `${Number(value || 0)} ${getFlowUnit(resourceType)}`;
}

function getStatusLabel(status) {
  const labels = {
    online: "En linea",
    offline: "Apagado",
    maintenance: "Mantenimiento",
  };

  return labels[status] || "Sin estado";
}
</script>

<style scoped>
.devices-summary {
  margin-bottom: 20px;
}

.devices-bottom {
  margin-top: 20px;
}

.page-message {
  border: 1px solid #bae6fd;
  border-radius: var(--radius-md);
  background: #f0f9ff;
  color: var(--color-info);
  font-weight: 800;
  margin-bottom: 18px;
  padding: 14px 16px;
}

.summary-number {
  color: var(--color-text);
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
  margin: 0 0 8px;
}

.summary-label {
  color: var(--color-text-muted);
  margin: 0;
}

.empty-state,
.error-state {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  padding: 18px;
}

.error-state {
  color: var(--color-danger);
  background: #fef2f2;
  border-color: #fecaca;
}

.conduit-list {
  display: grid;
  gap: 14px;
}

.conduit-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 16px;
  text-align: left;
}

.conduit-card--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.conduit-card > div {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.conduit-card h3,
.detail-header h3,
.relation-card h3 {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  margin: 0;
}

.conduit-card p,
.conduit-card small,
.detail-header p,
.relation-card p {
  color: var(--color-text-muted);
  line-height: 1.4;
  margin: 0;
}

.detail {
  display: grid;
  gap: 20px;
}

.detail-header,
.relation-card {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: flex-start;
}

.metric-list {
  display: grid;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
  padding: 14px 0;
}

.metric-row:first-child {
  padding-top: 0;
}

.metric-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.metric-row span {
  color: var(--color-text-muted);
}

.metric-row strong {
  color: var(--color-text);
  font-weight: 900;
  text-align: right;
}

.detail-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.relation-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 16px;
}

.modal-shell {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  background: rgba(15, 23, 42, 0.44);
  padding: 20px;
}

.modal-panel {
  display: grid;
  gap: 16px;
  width: min(560px, 100%);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.22);
  padding: 24px;
}

.modal-panel h2 {
  color: var(--color-text);
  font-size: 22px;
  margin: 0 0 6px;
}

.modal-panel p {
  color: var(--color-text-muted);
  margin: 0;
}

.modal-panel label {
  display: grid;
  gap: 8px;
  color: var(--color-text);
  font-weight: 800;
}

.modal-panel input {
  min-height: 44px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
}

.field-hint {
  color: var(--color-text-muted);
  font-weight: 700;
  line-height: 1.4;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.valve-picker {
  display: grid;
  gap: 12px;
}

.valve-picker__header {
  display: grid;
  gap: 4px;
}

.valve-picker__header span {
  color: var(--color-text);
  font-weight: 900;
}

.valve-picker__header small {
  color: var(--color-text-muted);
  font-weight: 700;
  line-height: 1.4;
}

.valve-option-grid {
  display: grid;
  gap: 10px;
}

.valve-option-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  color: var(--color-text);
  padding: 14px;
  text-align: left;
  transition:
      border-color 0.2s ease,
      background 0.2s ease,
      box-shadow 0.2s ease;
}

.valve-option-card:hover,
.valve-option-card--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.12);
}

.valve-option-card > div {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.valve-option-card h3 {
  font-size: 16px;
  font-weight: 900;
  margin: 0;
}

.valve-option-card p,
.valve-option-card small {
  color: var(--color-text-muted);
  line-height: 1.35;
  margin: 0;
}

.valve-option-card strong {
  color: var(--color-text);
  flex: 0 0 auto;
  font-size: 20px;
  font-weight: 900;
}

.modal-warning {
  border: 1px solid #fde68a;
  border-radius: var(--radius-md);
  background: #fffbeb;
  color: #92400e;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.5;
  padding: 12px;
}

.modal-panel footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

@media (max-width: 700px) {
  .detail-header,
  .metric-row,
  .relation-card,
  .conduit-card {
    flex-direction: column;
  }

  .valve-option-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .modal-grid {
    grid-template-columns: 1fr;
  }

  .detail-actions {
    grid-template-columns: 1fr;
  }
}
</style>
