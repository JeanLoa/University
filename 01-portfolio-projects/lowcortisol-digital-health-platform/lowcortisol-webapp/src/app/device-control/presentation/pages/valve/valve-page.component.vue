<template>
  <AppLayout>
    <PageHeader
        title="Dispositivos"
        subtitle="Controla valvulas y sensores que miden el consumo por ubicacion."
    />

    <div v-if="state.message" class="page-message">
      {{ state.message }}
    </div>

    <section class="valves-summary">
      <UiCard title="Valvulas registradas" compact>
        <p class="summary-number">{{ state.summary.totalValves }}</p>
        <p class="summary-label">Puntos de corte disponibles</p>
      </UiCard>

      <UiCard title="Abiertas" compact>
        <p class="summary-number">{{ state.summary.openValves }}</p>
        <p class="summary-label">Permiten consumo ahora</p>
      </UiCard>

      <UiCard title="Cerradas" compact>
        <p class="summary-number">{{ state.summary.closedValves }}</p>
        <p class="summary-label">Flujo bloqueado</p>
      </UiCard>

      <UiCard title="Apertura promedio" compact>
        <p class="summary-number">{{ averageOpening }}%</p>
        <p class="summary-label">Entre valvulas disponibles</p>
      </UiCard>
    </section>

    <section class="valves-console">
      <UiCard title="Dispositivos operativos" subtitle="Selecciona una valvula para operarla y revisar su medicion asociada.">
        <div v-if="state.loading" class="empty-state">
          Cargando valvulas...
        </div>

        <div v-else-if="state.error" class="error-state">
          {{ state.error }}
        </div>

        <div v-else-if="state.valves.length === 0" class="empty-state">
          No hay valvulas registradas.
        </div>

        <div v-else class="site-stack">
          <section
              v-for="site in valveHierarchy"
              :key="site.id"
              class="site-frame"
          >
            <header class="site-frame__header">
              <div>
                <span>Sede</span>
                <strong>{{ site.name }}</strong>
              </div>

              <StatusBadge
                  :status="site.status || 'active'"
                  :label="site.status === 'inactive' ? 'Inactiva' : 'Activa'"
              />
            </header>

            <div class="room-stack">
              <section
                  v-for="room in site.rooms"
                  :key="room.id"
                  class="room-frame"
              >
                <header class="room-frame__header">
                  <span>Habitacion</span>
                  <strong>{{ room.name }}</strong>
                </header>

                <div class="group-stack">
                  <section
                      v-for="group in room.groups"
                      :key="group.id"
                      class="group-frame"
                  >
                    <header class="group-frame__header">
                      <div>
                        <span>Grupo</span>
                        <strong>{{ group.name }}</strong>
                        <small>{{ getResourceLabel(group.resourceType) }}</small>
                      </div>

                      <div class="group-frame__metrics">
                        <span>{{ group.sensorsCount }} sensores</span>
                        <span>{{ group.valves.length }} valvulas</span>
                      </div>
                    </header>

                    <div class="valve-stack">
                      <article
                          v-for="valve in group.valves"
                          :key="valve.id"
                          class="valve-stack__item"
                          :class="{ 'valve-stack__item--active': valve.id === selectedValveId }"
                      >
                        <button
                            class="valve-stack__summary"
                            type="button"
                            @click="selectValve(valve.id)"
                        >
                          <span class="valve-stack__resource" :class="`valve-stack__resource--${getResourceTone(valve)}`">
                            {{ getResourceLabel(valve.resourceType) }}
                          </span>

                          <span class="valve-stack__main">
                            <strong>{{ valve.name }}</strong>
                            <small>{{ getValveSensors(valve)[0]?.name || 'Sin sensor asociado' }}</small>
                          </span>

                          <span class="valve-stack__opening">
                            {{ normalizeOpening(valve.openingPercentage) }}%
                          </span>
                        </button>

                        <Transition name="valve-drawer">
                          <div
                              v-if="valve.id === selectedValveId"
                              class="valve-drawer"
                          >
                            <header class="valve-drawer__header">
                              <div>
                                <h3>{{ valve.name }}</h3>
                                <p>{{ getValvePath(valve) }}</p>
                              </div>

                              <div class="valve-drawer__badges">
                                <StatusBadge
                                    v-if="getValveLockLabel(valve)"
                                    status="inactive"
                                    :label="getValveLockLabel(valve)"
                                />
                                <StatusBadge
                                    :status="valve.status"
                                    :label="valve.status === 'open' ? 'Abierta' : 'Cerrada'"
                                />
                              </div>
                            </header>

                            <div class="valve-detail">
                              <ValveDial
                                  :valve="valve"
                                  :disabled="isValveLocked(valve)"
                                  @commit="(opening) => handleValveOpeningCommit(valve, opening)"
                              />

                              <div class="valve-side">
                                <section class="detail-block">
                                  <h3>Equipo conectado</h3>
                                  <div class="metric-row">
                                    <span>Recurso</span>
                                    <strong>{{ getResourceLabel(valve.resourceType) }}</strong>
                                  </div>
                                  <div class="metric-row">
                                    <span>Equipo</span>
                                    <strong>{{ getValveDevice(valve)?.name || 'Sin equipo' }}</strong>
                                  </div>
                                  <div class="metric-row">
                                    <span>Sensor principal</span>
                                    <strong>{{ getValveSensors(valve)[0]?.name || 'Sin sensor asociado' }}</strong>
                                  </div>
                                </section>

                                <div v-if="isValveLocked(valve)" class="valve-lock">
                                  {{ getValveLockMessage(valve) }}
                                </div>

                                <section class="action-row">
                                  <UiButton
                                      label="Cerrar"
                                      variant="neutral"
                                      :disabled="isValveLocked(valve) || valve.status === 'closed'"
                                      @click="closeValve(valve.id)"
                                  />
                                  <UiButton
                                      label="Abrir total"
                                      variant="action"
                                      :disabled="isValveLocked(valve) || normalizeOpening(valve.openingPercentage) === 100"
                                      @click="setValveOpening(valve.id, 100)"
                                  />
                                </section>
                              </div>
                            </div>
                          </div>
                        </Transition>
                      </article>
                    </div>
                  </section>
                </div>
              </section>
            </div>
          </section>
        </div>
      </UiCard>
    </section>

    <section class="valves-history">
      <UiCard title="Sensores asociados" subtitle="Lectura que alimenta el monitoreo de la valvula seleccionada.">
        <div v-if="selectedValveSensors.length === 0" class="empty-state">
          Esta valvula todavia no tiene sensor asociado.
        </div>

        <div v-else class="sensor-list">
          <article
              v-for="sensor in selectedValveSensors"
              :key="sensor.id"
              class="sensor-item"
          >
            <div>
              <strong>{{ sensor.name }}</strong>
              <span>{{ getResourceLabel(sensor.resourceType) }} · {{ sensor.currentValue }} {{ sensor.unit }}</span>
            </div>

            <StatusBadge
                :status="sensor.hasExceededThreshold ? 'warning' : 'active'"
                :label="sensor.hasExceededThreshold ? 'En alerta' : 'Estable'"
            />
          </article>
        </div>
      </UiCard>

      <UiCard title="Historial operativo" subtitle="Comandos y operaciones recientes de la valvula.">
        <div v-if="selectedValveOperations.length === 0 && selectedValveCommands.length === 0" class="empty-state">
          Aun no hay operaciones registradas para esta valvula.
        </div>

        <div v-else class="timeline">
          <article
              v-for="operation in selectedValveOperations"
              :key="`operation-${operation.id}`"
              class="timeline-item"
          >
            <span class="timeline-item__dot" />
            <div>
              <strong>{{ getOperationLabel(operation) }}</strong>
              <p>{{ formatOperationMeta(operation) }}</p>
            </div>
          </article>

          <article
              v-for="command in selectedValveCommands"
              :key="`command-${command.id}`"
              class="timeline-item"
          >
            <span class="timeline-item__dot timeline-item__dot--command" />
            <div>
              <strong>{{ getCommandLabel(command) }}</strong>
              <p>{{ formatCommandMeta(command) }}</p>
            </div>
          </article>
        </div>
      </UiCard>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import PageHeader from "../../../../shared/presentation/components/page-header/page-header.component.vue";
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";

import ValveDial from "../../components/valve-dial/valve-dial.component.vue";

import { useDeviceControlStore } from "../../../application/store/device-control.store";

const {
  state,
  loadDevicePage,
  closeValve,
  setValveOpening,
} = useDeviceControlStore();

const selectedValveId = ref("");

const selectedValve = computed(() =>
    state.valves.find((valve) => valve.id === selectedValveId.value) || state.valves[0] || null
);

const selectedValveSensors = computed(() => {
  if (!selectedValve.value) return [];

  return getValveSensors(selectedValve.value);
});

const selectedValveOperations = computed(() => {
  if (!selectedValve.value) return [];

  return state.valveOperations
      .filter((operation) => operation.valveId === selectedValve.value.id)
      .slice(0, 5);
});

const selectedValveCommands = computed(() => {
  if (!selectedValve.value) return [];

  return state.commands
      .filter((command) => command.valveId === selectedValve.value.id)
      .slice(0, 5);
});

const averageOpening = computed(() => {
  if (state.valves.length === 0) return 0;

  const total = state.valves.reduce(
      (sum, valve) => sum + normalizeOpening(valve.openingPercentage),
      0
  );

  return Math.round(total / state.valves.length);
});

const valveHierarchy = computed(() => {
  const sites = [];
  const siteMap = new Map();

  state.valves.forEach((valve) => {
    const device = getValveDevice(valve);
    const siteId = device?.site?.id || device?.siteId || valve.siteId || "sin-sede";
    const roomId = device?.room?.id || device?.roomId || valve.roomId || "sin-habitacion";
    const groupId = device?.deviceGroup?.id || device?.deviceGroupId || valve.deviceGroupId || "sin-grupo";
    const siteName = device?.siteName || valve.siteId || "Sin sede";
    const siteStatus = device?.site?.status || "active";
    const roomName = device?.roomName || valve.roomId || "Sin habitacion";
    const groupName = device?.deviceGroupName || valve.deviceGroupId || "Sin grupo";
    const groupResourceType = device?.deviceGroup?.resourceType || valve.resourceType || "mixed";

    if (!siteMap.has(siteId)) {
      const site = {
        id: siteId,
        name: siteName,
        status: siteStatus,
        rooms: [],
        roomMap: new Map(),
      };

      siteMap.set(siteId, site);
      sites.push(site);
    }

    const site = siteMap.get(siteId);

    if (!site.roomMap.has(roomId)) {
      const room = {
        id: roomId,
        name: roomName,
        groups: [],
        groupMap: new Map(),
      };

      site.roomMap.set(roomId, room);
      site.rooms.push(room);
    }

    const room = site.roomMap.get(roomId);

    if (!room.groupMap.has(groupId)) {
      const group = {
        id: groupId,
        name: groupName,
        resourceType: groupResourceType,
        valves: [],
        sensorsCount: getGroupSensorsCount(groupId),
      };

      room.groupMap.set(groupId, group);
      room.groups.push(group);
    }

    room.groupMap.get(groupId).valves.push(valve);
  });

  return sites.map((site) => ({
    id: site.id,
    name: site.name,
    status: site.status,
    rooms: site.rooms.map((room) => ({
      id: room.id,
      name: room.name,
      groups: room.groups,
    })),
  }));
});

watch(
  () => state.valves,
  (valves) => {
    if (!selectedValveId.value && valves.length > 0) {
      selectedValveId.value = valves[0].id;
    }
  },
  {
    immediate: true,
  }
);

onMounted(async () => {
  await loadDevicePage();
});

function selectValve(valveId) {
  selectedValveId.value = valveId;
}

function normalizeOpening(value) {
  return Math.max(0, Math.min(100, Number(value || 0)));
}

function getResourceTone(valve) {
  return valve.resourceType === "gas" ? "gas" : "water";
}

function getResourceLabel(resourceType) {
  const labels = {
    water: "Agua",
    gas: "Gas",
    mixed: "Mixta",
  };

  return labels[resourceType] || "Recurso";
}

function getValvePath(valve) {
  const device = state.devices.find((item) => item.id === valve.deviceId) || null;

  if (device?.physicalPath) {
    return device.physicalPath;
  }

  return [device?.siteName || valve.siteId, device?.roomName || valve.roomId, device?.deviceGroupName || valve.deviceGroupId]
      .filter(Boolean)
      .join(" / ") || "Sin ubicacion";
}

function getValveDevice(valve) {
  return state.devices.find((device) => device.id === valve.deviceId) || null;
}

function isValveLocked(valve) {
  return Boolean(getValveLockMessage(valve));
}

function getValveLockLabel(valve) {
  const device = getValveDevice(valve);

  if (device?.site?.status === "inactive") return "Sede inactiva";
  if (device?.status !== "online") return "Equipo apagado";

  const sensor = getValveSensors(valve)[0] || null;

  if (!sensor) return "Sin sensor";
  if (sensor.status !== "active") return "Sensor apagado";

  return "";
}

function getValveLockMessage(valve) {
  const device = getValveDevice(valve);

  if (device?.site?.status === "inactive") {
    return "Esta sede esta desactivada. Activa la sede desde Ubicacion para operar sus valvulas.";
  }

  if (device?.status !== "online") {
    return "El equipo de esta valvula esta apagado. Activa el equipo desde Ubicacion.";
  }

  const sensor = getValveSensors(valve)[0] || null;

  if (!sensor) {
    return "Esta valvula no tiene sensor asociado. Asociala a un sensor para operarla.";
  }

  if (sensor.status !== "active") {
    return "El sensor asociado esta apagado. Activa el sensor desde Ubicacion.";
  }

  return "";
}

function getValveSensors(valve) {
  if (!valve) return [];

  return state.sensors.filter((sensor) =>
      sensor.resourceType === valve.resourceType &&
      (
          sensor.id === valve.sensorId ||
          sensor.deviceId === valve.deviceId
      )
  );
}

function getValveGroupName(valve) {
  const device = state.devices.find((item) => item.id === valve.deviceId) || null;

  return device?.deviceGroupName || valve.deviceGroupId || "Sin grupo";
}

function getGroupSensorsCount(groupId) {
  if (!groupId) return 0;

  return state.sensors.filter((sensor) => {
    if (sensor.deviceGroupId === groupId) return true;

    const sensorDevice = state.devices.find((device) => device.id === sensor.deviceId) || null;

    return sensorDevice?.deviceGroup?.id === groupId || sensorDevice?.deviceGroupId === groupId;
  }).length;
}

async function handleValveOpeningCommit(valve, openingPercentage) {
  if (isValveLocked(valve)) return;

  await setValveOpening(valve.id, openingPercentage);
}

function getOperationLabel(operation) {
  if (operation.targetStatus === "closed") return "Valvula cerrada";
  if (operation.targetStatus === "open") return "Valvula abierta";

  return "Operacion de valvula";
}

function getCommandLabel(command) {
  const labels = {
    closeValve: "Comando de cierre",
    close_valve: "Comando de cierre",
    openValve: "Comando de apertura",
    open_valve: "Comando de apertura",
    sync: "Sincronizacion",
  };

  return labels[command.commandType] || "Comando operativo";
}

function formatOperationMeta(operation) {
  return [
    operation.reason || "operacion manual",
    operation.status || "registrada",
    formatDate(operation.completedAt || operation.requestedAt || operation.createdAt),
  ].filter(Boolean).join(" · ");
}

function formatCommandMeta(command) {
  return [
    command.requestedBy || "Operations",
    command.status || "pendiente",
    formatDate(command.executedAt || command.requestedAt || command.createdAt),
  ].filter(Boolean).join(" · ");
}

function formatDate(value) {
  if (!value) return "";

  return new Intl.DateTimeFormat("es", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}
</script>

<style scoped>
.valves-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 22px;
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
  margin: 0 0 6px;
}

.summary-label {
  color: var(--color-text-muted);
  font-size: 13px;
  margin: 0;
}

.valves-console {
  display: block;
}

.site-stack,
.room-stack,
.group-stack {
  display: grid;
  gap: 16px;
}

.site-frame,
.room-frame,
.group-frame {
  display: grid;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.site-frame {
  background: #ffffff;
  padding: 16px;
}

.room-frame {
  background: var(--color-surface-soft);
  padding: 14px;
}

.group-frame {
  background: #ffffff;
  border-color: #bfdbfe;
  padding: 14px;
}

.site-frame__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.site-frame__header > div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.room-frame__header,
.group-frame__header {
  display: grid;
  gap: 4px;
}

.site-frame__header span,
.room-frame__header span,
.group-frame__header span {
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.site-frame__header strong {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 900;
}

.room-frame__header strong {
  color: var(--color-text);
  font-size: 17px;
  font-weight: 900;
}

.group-frame__header {
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 14px;
}

.group-frame__header > div:first-child {
  display: grid;
  min-width: 0;
  gap: 4px;
}

.group-frame__header strong {
  overflow: hidden;
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.group-frame__header small {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 800;
}

.group-frame__metrics {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.group-frame__metrics span {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  line-height: 1;
  padding: 8px 10px;
  text-transform: none;
}

.valve-stack {
  display: grid;
  gap: 14px;
}

.valve-stack__item {
  display: grid;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  overflow: hidden;
}

.valve-stack__item--active {
  border-color: var(--color-primary);
  box-shadow: 0 18px 44px rgba(37, 99, 235, 0.1);
}

.valve-stack__summary {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  width: 100%;
  border: 0;
  background: #ffffff;
  color: var(--color-text);
  padding: 16px;
  text-align: left;
}

.valve-stack__item--active .valve-stack__summary {
  background: rgba(37, 99, 235, 0.06);
}

.valve-stack__resource {
  display: grid;
  width: 56px;
  height: 56px;
  place-items: center;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.valve-stack__resource--water {
  background: #eff6ff;
  color: var(--color-primary);
}

.valve-stack__resource--gas {
  background: #fff7ed;
  color: #c2410c;
}

.valve-stack__main {
  display: grid;
  min-width: 0;
  gap: 12px;
}

.valve-stack__main > strong,
.sensor-item strong,
.timeline-item strong {
  overflow: hidden;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 900;
  line-height: 1.25;
  text-overflow: ellipsis;
}

.sensor-item span,
.timeline-item p {
  color: var(--color-text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.valve-stack__main small {
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 800;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.valve-stack__opening {
  justify-self: end;
  color: var(--color-text);
  font-size: 22px;
  font-weight: 900;
}

.valve-drawer {
  border-top: 1px solid var(--color-border);
  background: linear-gradient(180deg, #ffffff, var(--color-surface-soft));
  padding: 18px;
}

.valve-drawer__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.valve-drawer__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.valve-drawer__header h3 {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 900;
  margin: 0 0 4px;
}

.valve-drawer__header p {
  color: var(--color-text-muted);
  line-height: 1.4;
  margin: 0;
}

.valve-drawer-enter-active,
.valve-drawer-leave-active {
  transition:
      max-height 0.28s ease,
      opacity 0.2s ease,
      transform 0.28s ease;
}

.valve-drawer-enter-from,
.valve-drawer-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
}

.valve-drawer-enter-to,
.valve-drawer-leave-from {
  max-height: 620px;
  opacity: 1;
  transform: translateY(0);
}

.valve-detail {
  display: grid;
  grid-template-columns: minmax(260px, 0.95fr) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.valve-side {
  display: grid;
  gap: 14px;
}

.valve-lock {
  border: 1px solid #fde68a;
  border-radius: var(--radius-md);
  background: #fffbeb;
  color: #92400e;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.45;
  padding: 12px 14px;
}

.detail-block {
  display: grid;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 14px;
}

.detail-block__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.detail-block h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
  margin: 0;
}

.detail-block p {
  color: var(--color-text-muted);
  font-size: 13px;
  margin: 4px 0 0;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  padding-top: 10px;
}

.metric-row:first-of-type {
  border-top: none;
  padding-top: 0;
}

.metric-row strong {
  color: var(--color-text);
  text-align: right;
}

.action-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.valves-history {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 22px;
  margin-top: 22px;
}

.sensor-list,
.timeline {
  display: grid;
  gap: 12px;
}

.sensor-item {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.sensor-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.sensor-item div {
  display: grid;
  gap: 4px;
}

.timeline-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.timeline-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.timeline-item__dot {
  width: 12px;
  height: 12px;
  margin-top: 4px;
  border-radius: 999px;
  background: var(--color-primary);
}

.timeline-item__dot--command {
  background: #f59e0b;
}

.timeline-item p {
  margin: 4px 0 0;
}

.empty-state,
.error-state {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-weight: 800;
  padding: 18px;
  text-align: center;
}

.error-state {
  border-color: #fecaca;
  color: var(--color-danger);
}

@media (max-width: 1180px) {
  .valves-summary,
  .valves-history,
  .valve-detail {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .valves-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .action-row {
    grid-template-columns: 1fr;
  }

  .valve-stack__summary {
    grid-template-columns: 1fr;
  }

  .valve-stack__resource,
  .valve-stack__opening {
    justify-self: start;
  }

  .valve-drawer__header {
    flex-direction: column;
  }
}
</style>
