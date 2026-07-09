<template>
  <AppLayout>
    <section class="page-header">
      <div>
        <h1 class="page-title">
          {{ t('workplace.sites.title') }}
        </h1>

        <p class="page-subtitle">
          {{ t('workplace.sites.subtitle') }}
        </p>
      </div>

      <UiButton
          :label="t('workplace.physical.createSite')"
          variant="create"
          @click="siteModalOpen = true"
      />
    </section>

    <section class="sites-toolbar">
      <SiteFilter
          v-model="selectedType"
          @update:model-value="handleFilterChange"
      />
    </section>

    <section v-if="state.summary" class="grid grid-3 sites-summary">
      <UiCard :title="t('workplace.sites.registeredSites')" compact>
        <p class="summary-number">
          {{ state.summary.totalSites }}
        </p>
        <p class="summary-label">
          {{ t('workplace.sites.registeredSites') }}
        </p>
      </UiCard>

      <UiCard :title="t('workplace.physical.totalRooms')" compact>
        <p class="summary-number">
          {{ state.summary.totalRooms }}
        </p>
        <p class="summary-label">
          {{ t('workplace.physical.totalRooms') }}
        </p>
      </UiCard>

      <UiCard :title="t('workplace.physical.totalDeviceGroups')" compact>
        <p class="summary-number">
          {{ state.summary.totalDeviceGroups }}
        </p>
        <p class="summary-label">
          {{ t('workplace.physical.totalDeviceGroups') }}
        </p>
      </UiCard>

      <UiCard :title="t('workplace.physical.totalDevices')" compact>
        <p class="summary-number">
          {{ state.summary.totalDevices }}
        </p>
        <p class="summary-label">
          {{ t('workplace.physical.totalDevices') }}
        </p>
      </UiCard>

      <UiCard :title="t('workplace.sites.registeredMembers')" compact>
        <p class="summary-number">
          {{ state.summary.totalMembers }}
        </p>
        <p class="summary-label">
          {{ t('workplace.sites.registeredMembers') }}
        </p>
      </UiCard>

      <UiCard :title="t('workplace.sites.maintenanceSites')" compact>
        <p class="summary-number">
          {{ state.summary.maintenanceSites }}
        </p>
        <p class="summary-label">
          {{ t('workplace.sites.maintenanceSites') }}
        </p>
      </UiCard>
    </section>

    <div v-if="pageMessage" class="page-message">
      {{ pageMessage }}
    </div>

    <section class="grid grid-2">
      <UiCard :title="t('workplace.sites.sitesList')">
        <div v-if="state.loading" class="empty-state">
          {{ t('workplace.sites.loading') }}
        </div>

        <div v-else-if="state.error" class="error-state">
          {{ state.error }}
        </div>

        <div v-else-if="state.sites.length === 0" class="empty-state">
          {{ t('workplace.sites.emptySites') }}
        </div>

        <div v-else class="site-list">
          <button
              v-for="site in state.sites"
              :key="site.id"
              type="button"
              class="site-card"
              :class="{ 'site-card--active': site.id === state.selectedSiteId }"
              @click="selectSite(site.id)"
          >
            <div>
              <h3 class="site-card__title">
                {{ site.name }}
              </h3>
              <p class="site-card__address">
                {{ site.address }}
              </p>
            </div>

            <div class="site-card__meta">
              <span class="badge badge-primary">
                {{ getSiteTypeLabel(site.type) }}
              </span>

              <span class="badge" :class="getStatusBadgeClass(site.status)">
                {{ getStatusLabel(site.status) }}
              </span>
            </div>
          </button>
        </div>
      </UiCard>

      <UiCard :title="t('workplace.sites.siteDetail')">
        <div v-if="selectedSite" class="site-detail">
          <div class="site-detail__header">
            <div>
              <h3 class="site-detail__title">
                {{ selectedSite.name }}
              </h3>
              <p class="site-detail__subtitle">
                {{ selectedSite.address }}
              </p>
            </div>

            <div class="site-detail__actions">
              <span class="badge badge-primary">
                {{ getSiteTypeLabel(selectedSite.type) }}
              </span>

              <span class="badge" :class="getStatusBadgeClass(selectedSite.status)">
                {{ getStatusLabel(selectedSite.status) }}
              </span>
            </div>
          </div>

          <div class="metric-list">
            <div v-if="selectedSiteLocationLabel" class="metric-row">
              <span>Ubicacion seleccionada</span>
              <strong>{{ selectedSiteLocationLabel }}</strong>
            </div>

            <div class="metric-row">
              <span>{{ t('workplace.physical.rooms') }}</span>
              <strong>{{ state.rooms.length }}</strong>
            </div>

            <div class="metric-row">
              <span>{{ t('workplace.physical.deviceGroups') }}</span>
              <strong>{{ selectedSiteDeviceGroupCount }}</strong>
            </div>

            <div class="metric-row">
              <span>{{ t('workplace.sites.waterConsumption') }}</span>
              <strong>{{ selectedSite.waterConsumption }} L</strong>
            </div>

            <div class="metric-row">
              <span>{{ t('workplace.sites.gasConsumption') }}</span>
              <strong>{{ selectedSite.gasConsumption }} m3</strong>
            </div>

            <div class="metric-row">
              <span>{{ t('workplace.sites.activeIncidents') }}</span>
              <strong>{{ selectedSite.activeIncidents }}</strong>
            </div>
          </div>

          <footer class="site-detail__footer">
            <UiButton
                :label="selectedSite.status === 'inactive' ? 'Activar sede' : 'Desactivar sede'"
                variant="neutral"
                class="site-status-action"
                @click="handleToggleSiteStatus"
            />

            <UiButton
                label="Eliminar sede"
                variant="danger"
                @click="openDeleteSiteConfirmation"
            />
          </footer>
        </div>

        <div v-else class="empty-state">
          {{ t('workplace.sites.selectSite') }}
        </div>
      </UiCard>
    </section>

    <section class="physical-layout sites-bottom">
      <SitePhysicalModel
          :site="selectedSite"
          :rooms="state.rooms"
          :selected-room-id="state.selectedRoomId"
          :selected-device-group-id="state.selectedDeviceGroupId"
          @create-room="openCreateRoom"
          @create-device-group="openCreateDeviceGroup"
          @select-room="selectRoom"
          @select-device-group="selectDeviceGroup"
      />

      <UiCard
          title="Inventario del grupo"
          :subtitle="selectedRoom ? 'Ambiente: ' + selectedRoom.name : ''"
      >
        <div v-if="selectedDeviceGroup" class="device-group-detail">
          <div class="device-group-detail__header">
            <div>
              <h3>{{ selectedDeviceGroup.name }}</h3>
              <p>{{ getResourceLabel(selectedDeviceGroup.resourceType) }}</p>
            </div>

            <div class="device-group-detail__actions">
              <span class="badge" :class="getStatusBadgeClass(selectedDeviceGroup.status)">
                {{ getStatusLabel(selectedDeviceGroup.status) }}
              </span>

              <UiButton
                  label="Agregar equipo"
                  variant="neutral"
                  @click="groupDeviceModalOpen = true"
              />
            </div>
          </div>

          <div class="inventory-grid">
            <div>
              <span>Equipos</span>
              <strong>{{ selectedDeviceGroup.devices.length }}</strong>
            </div>

            <div>
              <span>Sensores</span>
              <strong>{{ selectedDeviceGroup.sensors.length }}</strong>
            </div>

            <div>
              <span>Valvulas</span>
              <strong>{{ selectedDeviceGroup.valves.length }}</strong>
            </div>
          </div>

          <div v-if="!selectedGroupHasInventory" class="empty-state">
            Este grupo aun no tiene equipos, sensores ni valvulas asignadas.
          </div>

          <div v-if="selectedDeviceGroup.sensors.length" class="inventory-section">
            <h4>Sensores</h4>

            <div class="inventory-card-list">
              <article
                  v-for="sensor in selectedDeviceGroup.sensors"
                  :key="sensor.id"
                  class="inventory-card"
              >
                <div>
                  <strong>{{ sensor.name }}</strong>
                  <span>{{ getResourceLabel(sensor.resourceType) }}</span>
                  <span>{{ sensor.currentValue }} {{ sensor.unit }}</span>
                </div>

                <div class="inventory-card__actions">
                  <span
                      class="badge"
                      :class="sensor.status === 'inactive' ? 'badge-warning' : sensor.hasExceededThreshold ? 'badge-danger' : 'badge-success'"
                  >
                    {{ sensor.status === "inactive" ? "Inactivo" : sensor.hasExceededThreshold ? "Critico" : "Normal" }}
                  </span>

                  <UiButton
                      :label="sensor.status === 'active' ? 'Desactivar' : 'Activar'"
                      variant="neutral"
                      :disabled="selectedSite?.status === 'inactive'"
                      @click="handleToggleSensorStatus(sensor)"
                  />

                  <UiButton
                      label="Eliminar"
                      variant="danger"
                      @click="openRemoveSensorConfirmation(sensor)"
                  />
                </div>
              </article>
            </div>
          </div>

          <div v-if="selectedDeviceGroup.valves.length" class="inventory-section">
            <h4>Valvulas</h4>

            <div class="inventory-card-list">
              <article
                  v-for="valve in selectedDeviceGroup.valves"
                  :key="valve.id"
                  class="inventory-card"
              >
                <div>
                  <strong>{{ valve.name }}</strong>
                  <span>{{ getResourceLabel(valve.resourceType) }}</span>
                  <span>Sensor asociado: {{ getValveAssociatedSensor(valve)?.name || "Sin sensor asociado" }}</span>
                  <span>{{ valve.openingPercentage ?? 0 }}% de apertura</span>
                </div>

                <div class="inventory-card__actions">
                  <span class="badge" :class="valve.status === 'closed' ? 'badge-warning' : 'badge-success'">
                    {{ getDeviceStatusLabel(valve.status) }}
                  </span>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          Selecciona un grupo para revisar su inventario.
        </div>
      </UiCard>
    </section>

    <section class="grid grid-2 sites-bottom">
      <UiCard title="Responsables de sede">
        <div v-if="state.members.length === 0" class="empty-state">
          Esta sede aun no tiene responsables asignados.
        </div>

        <div v-else class="relation-list">
          <div
              v-for="member in state.members"
              :key="member.id"
              class="relation-item"
          >
            <div>
              <strong>{{ member.fullName }}</strong>
              <span>{{ member.email }}</span>
            </div>

            <div class="relation-item__actions">
              <span class="badge badge-success">
                {{ getRoleLabel(member.role) }}
              </span>

              <UiButton
                  label="Eliminar"
                  variant="danger"
                  @click="openRemoveMemberConfirmation(member)"
              />
            </div>
          </div>
        </div>

        <UiButton
            class="relation-action"
            label="Asignar responsable"
            variant="neutral"
            @click="assignMemberModalOpen = true"
        />
      </UiCard>

      <UiCard title="Equipos asignados">
        <div v-if="state.assignments.length === 0" class="empty-state">
          Esta sede aun no tiene equipos asignados a responsables.
        </div>

        <div v-else class="relation-list">
          <div
              v-for="assignment in state.assignments"
              :key="assignment.id"
              class="relation-item"
          >
            <div>
              <strong>{{ assignment.deviceName }}</strong>
              <span>{{ getDeviceTypeLabel(assignment.deviceType) }}</span>
            </div>

            <div class="assignment-control">
              <span class="badge" :class="assignment.responsibleName ? 'badge-success' : 'badge-warning'">
                {{ assignment.responsibleName ? "Con responsable" : "Sin responsable" }}
              </span>

              <UiSelect
                  class="responsible-select"
                  :model-value="assignment.responsibleMemberId || ''"
                  :options="responsibleSelectOptions"
                  placeholder="Elegir responsable"
                  @change="(memberId) => handleAssignmentResponsibleChange(assignment, memberId)"
              />
            </div>
          </div>
        </div>

        <UiButton
            class="relation-action"
            label="Asignar equipo"
            variant="neutral"
            @click="assignDeviceModalOpen = true"
        />
      </UiCard>
    </section>

    <CreateSiteModal
        :open="siteModalOpen"
        @close="siteModalOpen = false"
        @submit="handleCreateSite"
    />

    <CreateRoomModal
        :open="roomModalOpen"
        :site-id="state.selectedSiteId || ''"
        @close="roomModalOpen = false"
        @submit="handleCreateRoom"
    />

    <CreateDeviceGroupModal
        :open="deviceGroupModalOpen"
        :room-id="pendingRoomId"
        :default-resource-type="pendingDeviceGroupResourceType"
        @close="deviceGroupModalOpen = false"
        @submit="handleCreateDeviceGroup"
    />

    <AddGroupDeviceModal
        :open="groupDeviceModalOpen"
        :site="selectedSite"
        :room="selectedRoom"
        :group="selectedDeviceGroup"
        :sensors="selectedDeviceGroup?.sensors || []"
        @close="groupDeviceModalOpen = false"
        @submit="handleAddDeviceToGroup"
    />

    <AssignSiteMemberModal
        :open="assignMemberModalOpen"
        :site="selectedSite"
        @close="assignMemberModalOpen = false"
        @submit="handleAssignMember"
    />

    <AssignSiteDeviceModal
        :open="assignDeviceModalOpen"
        :site="selectedSite"
        :devices="selectedSiteDevices"
        :members="state.members"
        @close="assignDeviceModalOpen = false"
        @submit="handleAssignDevice"
    />

    <ConfirmationModal
        :open="memberRemovalModalOpen"
        title="Eliminar responsable"
        :message="memberRemovalMessage"
        detail="Los equipos asignados no se eliminaran; quedaran sin responsable hasta que elijas a otra persona."
        confirm-label="Eliminar responsable"
        cancel-label="Cancelar"
        tone="danger"
        @close="memberPendingRemoval = null"
        @confirm="handleRemoveMember"
    />

    <ConfirmationModal
        :open="siteRemovalModalOpen"
        title="Eliminar sede"
        :message="siteRemovalMessage"
        detail="Se retiraran sus ambientes, grupos, equipos, sensores, valvulas y registros operativos locales asociados."
        confirm-label="Eliminar sede"
        cancel-label="Cancelar"
        tone="danger"
        @close="sitePendingRemoval = null"
        @confirm="handleDeleteSite"
    />

    <ConfirmationModal
        :open="sensorRemovalModalOpen"
        title="Eliminar sensor"
        :message="sensorRemovalMessage"
        detail="Si hay valvulas que dependen de este sensor, tambien se retiraran para no dejar controles sin medicion."
        confirm-label="Eliminar sensor"
        cancel-label="Cancelar"
        tone="danger"
        @close="sensorPendingRemoval = null"
        @confirm="handleRemoveSensor"
    />

  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import AppLayout from "../../../../shared/presentation/components/app-layout/app-layout.component.vue";
import ConfirmationModal from "../../../../shared/presentation/components/confirmation-modal/confirmation-modal.component.vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";
import UiSelect from "../../../../shared/presentation/components/ui-select/ui-select.component.vue";
import SiteFilter from "../../components/site-filter/site-filter.component.vue";
import SitePhysicalModel from "../../components/site-physical-model/site-physical-model.component.vue";
import AddGroupDeviceModal from "../../components/add-group-device-modal/add-group-device-modal.component.vue";
import AssignSiteDeviceModal from "../../components/assign-site-device-modal/assign-site-device-modal.component.vue";
import AssignSiteMemberModal from "../../components/assign-site-member-modal/assign-site-member-modal.component.vue";
import CreateSiteModal from "../../components/create-site-modal/create-site-modal.component.vue";
import CreateRoomModal from "../../components/create-room-modal/create-room-modal.component.vue";
import CreateDeviceGroupModal from "../../components/create-device-group-modal/create-device-group-modal.component.vue";

import { useWorkplaceStore } from "../../../application/store/workplace.store";
import { useTranslation } from "../../../../shared/application/services/translation.service";

const {
  state,
  loadWorkplace,
  filterSitesByType,
  selectSite,
  selectRoom,
  selectDeviceGroup,
  createSite,
  updateSiteStatus,
  deleteSite,
  createRoom,
  createDeviceGroup,
  addDeviceToGroup,
  assignMemberToSite,
  assignDeviceToSite,
  removeMemberFromSite,
  removeSensorFromGroup,
  updateSensorStatus: updateInventorySensorStatus,
  getSelectedSite,
  getSelectedRoom,
  getSelectedDeviceGroup,
} = useWorkplaceStore();

const { t } = useTranslation();

const selectedType = ref("all");
const siteModalOpen = ref(false);
const roomModalOpen = ref(false);
const deviceGroupModalOpen = ref(false);
const groupDeviceModalOpen = ref(false);
const assignMemberModalOpen = ref(false);
const assignDeviceModalOpen = ref(false);
const memberPendingRemoval = ref(null);
const sitePendingRemoval = ref(null);
const sensorPendingRemoval = ref(null);
const pendingRoomId = ref("");
const pendingDeviceGroupResourceType = ref("mixed");
const pageMessage = ref("");

const selectedSite = computed(() => getSelectedSite());
const selectedRoom = computed(() => getSelectedRoom());
const selectedDeviceGroup = computed(() => getSelectedDeviceGroup());
const selectedSiteLocationLabel = computed(() => {
  const latitude = Number(selectedSite.value?.latitude);
  const longitude = Number(selectedSite.value?.longitude);

  if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      (latitude === 0 && longitude === 0)
  ) {
    return "";
  }

  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
});
const selectedGroupHasInventory = computed(() =>
    Boolean(
        selectedDeviceGroup.value &&
        (
            selectedDeviceGroup.value.devices.length ||
            selectedDeviceGroup.value.sensors.length ||
            selectedDeviceGroup.value.valves.length
        )
    )
);
const selectedSiteDeviceGroupCount = computed(() =>
    state.rooms.reduce((count, room) => count + (room.deviceGroups?.length ?? 0), 0)
);
const selectedSiteDevices = computed(() =>
    state.rooms.flatMap((room) =>
        (room.deviceGroups || []).flatMap((group) =>
            (group.devices || []).map((device) => ({
              ...device,
              roomName: room.name,
              groupName: group.name,
            }))
        )
    )
);
const memberRemovalMessage = computed(() => {
  if (!memberPendingRemoval.value) {
    return "Esta accion requiere confirmacion.";
  }

  return `Vas a retirar a ${memberPendingRemoval.value.fullName} de esta sede.`;
});
const memberRemovalModalOpen = computed(() => Boolean(memberPendingRemoval.value));
const siteRemovalMessage = computed(() => {
  if (!sitePendingRemoval.value) {
    return "Esta accion requiere confirmacion.";
  }

  return `Vas a eliminar la sede ${sitePendingRemoval.value.name}.`;
});
const siteRemovalModalOpen = computed(() => Boolean(sitePendingRemoval.value));
const sensorRemovalMessage = computed(() => {
  if (!sensorPendingRemoval.value) {
    return "Esta accion requiere confirmacion.";
  }

  return `Vas a eliminar el sensor ${sensorPendingRemoval.value.name}.`;
});
const sensorRemovalModalOpen = computed(() => Boolean(sensorPendingRemoval.value));
const responsibleSelectOptions = computed(() => [
  {
    value: "",
    label: "Sin responsable",
    description: "El equipo queda pendiente de asignacion.",
  },
  ...state.members.map((member) => ({
    value: member.id,
    label: member.fullName,
    description: getRoleLabel(member.role),
  })),
]);

onMounted(async () => {
  await loadWorkplace();
});

async function handleFilterChange(type) {
  selectedType.value = type;
  await filterSitesByType(type);
}

function openCreateRoom() {
  if (!selectedSite.value || selectedSite.value.status === "inactive") return;

  roomModalOpen.value = true;
}

function openCreateDeviceGroup(roomId) {
  if (selectedSite.value?.status === "inactive") return;

  pendingRoomId.value = roomId || state.selectedRoomId || "";
  pendingDeviceGroupResourceType.value = "mixed";

  if (!pendingRoomId.value) return;

  selectRoom(pendingRoomId.value);
  deviceGroupModalOpen.value = true;
}

async function handleCreateSite(payload) {
  await runAction(async () => {
    await createSite({
      ...payload,
      workplaceId: state.workplace?.id ?? "WORKPLACE-001",
    });
    siteModalOpen.value = false;
  });
}

async function handleCreateRoom(payload) {
  if (!selectedSite.value) return;

  await runAction(async () => {
    await createRoom({
      ...payload,
      siteId: selectedSite.value.id,
    });
    roomModalOpen.value = false;
  });
}

async function handleCreateDeviceGroup(payload) {
  const roomId = payload.roomId || pendingRoomId.value || state.selectedRoomId;

  if (!roomId) return;

  await runAction(async () => {
    await createDeviceGroup({
      ...payload,
      roomId,
    });
    pendingRoomId.value = "";
    pendingDeviceGroupResourceType.value = "mixed";
    deviceGroupModalOpen.value = false;
  });
}

async function handleAddDeviceToGroup(payload) {
  if (!selectedDeviceGroup.value) return;

  await runAction(async () => {
    await addDeviceToGroup({
      ...payload,
      siteId: selectedSite.value?.id || payload.siteId,
      siteName: selectedSite.value?.name || "",
      siteAddress: selectedSite.value?.address || "",
      siteType: selectedSite.value?.type || "residential",
      siteStatus: selectedSite.value?.status || "active",
      roomId: selectedRoom.value?.id || payload.roomId,
      roomName: selectedRoom.value?.name || "",
      roomType: selectedRoom.value?.type || "custom",
      roomStatus: selectedRoom.value?.status || "active",
      deviceGroupId: selectedDeviceGroup.value?.id || payload.deviceGroupId,
      deviceGroupName: selectedDeviceGroup.value?.name || "",
      deviceGroupResourceType: selectedDeviceGroup.value?.resourceType || payload.resourceType,
      deviceGroupStatus: selectedDeviceGroup.value?.status || "active",
    });
    pageMessage.value = "Equipo agregado al grupo.";
    groupDeviceModalOpen.value = false;
  });
}

async function runAction(action) {
  pageMessage.value = "";

  try {
    await action();
  } catch (error) {
    pageMessage.value = error.message || "No se pudo completar la accion.";
  }
}

async function handleAssignMember(payload) {
  if (!state.selectedSiteId) return;

  await runAction(async () => {
    await assignMemberToSite({
      siteId: state.selectedSiteId,
      userId: "",
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
    });
    pageMessage.value = "Responsable asignado a la sede.";
    assignMemberModalOpen.value = false;
  });
}

function openRemoveMemberConfirmation(member) {
  memberPendingRemoval.value = member;
}

function openDeleteSiteConfirmation() {
  if (!selectedSite.value) return;

  sitePendingRemoval.value = selectedSite.value;
}

function openRemoveSensorConfirmation(sensor) {
  sensorPendingRemoval.value = sensor;
}

async function handleRemoveMember() {
  if (!memberPendingRemoval.value) return;

  const member = memberPendingRemoval.value;

  await runAction(async () => {
    await removeMemberFromSite(member.id);
    memberPendingRemoval.value = null;
    pageMessage.value = `${member.fullName} fue retirado de la sede. Sus equipos quedaron sin responsable.`;
  });
}

async function handleDeleteSite() {
  if (!sitePendingRemoval.value) return;

  const site = sitePendingRemoval.value;

  await runAction(async () => {
    await deleteSite(site.id, site);
    sitePendingRemoval.value = null;
    pageMessage.value = `${site.name} fue eliminada de la gestion local.`;
  });
}

async function handleRemoveSensor() {
  if (!sensorPendingRemoval.value) return;

  const sensor = sensorPendingRemoval.value;

  await runAction(async () => {
    await removeSensorFromGroup(sensor.id);
    sensorPendingRemoval.value = null;
    pageMessage.value = `${sensor.name} fue eliminado del grupo.`;
  });
}

async function handleToggleSensorStatus(sensor) {
  if (!selectedSite.value || selectedSite.value.status === "inactive") {
    pageMessage.value = "Activa la sede antes de operar este sensor.";
    return;
  }

  const nextStatus = sensor.status === "active" ? "inactive" : "active";

  await runAction(async () => {
    await updateInventorySensorStatus(sensor.id, nextStatus);
    pageMessage.value = nextStatus === "active"
        ? `${sensor.name} fue activado.`
        : `${sensor.name} fue desactivado y sus valvulas dependientes quedaron cerradas.`;
  });
}

async function handleAssignDevice(payload) {
  if (!state.selectedSiteId) return;

  const device = selectedSiteDevices.value.find((entry) => entry.id === payload.deviceId);
  const member = state.members.find((entry) => entry.id === payload.memberId);

  if (!device || !member) return;

  await runAction(async () => {
    await assignDeviceToSite({
      siteId: state.selectedSiteId,
      deviceId: device.id,
      deviceName: device.name,
      deviceType: device.type,
      responsibleMemberId: member.id,
      responsibleName: member.fullName,
      responsibleEmail: member.email,
    });
    pageMessage.value = `${device.name} asignado a ${member.fullName}.`;
    assignDeviceModalOpen.value = false;
  });
}

async function handleToggleSiteStatus() {
  if (!selectedSite.value) return;

  const nextStatus = selectedSite.value.status === "inactive" ? "active" : "inactive";

  await runAction(async () => {
    await updateSiteStatus(selectedSite.value.id, nextStatus, selectedSite.value);
    pageMessage.value = nextStatus === "inactive"
        ? "Sede desactivada. Sus ambientes, equipos y sensores quedaron inactivos; las valvulas se cerraron."
        : "Sede activada. Ahora puedes operar equipos, sensores y valvulas de forma independiente.";
  });
}

async function handleAssignmentResponsibleChange(assignment, memberId) {
  if (!state.selectedSiteId) return;

  const member = state.members.find((entry) => entry.id === memberId) || null;

  await runAction(async () => {
    await assignDeviceToSite({
      siteId: state.selectedSiteId,
      deviceId: assignment.deviceId,
      deviceName: assignment.deviceName,
      deviceType: assignment.deviceType,
      responsibleMemberId: member?.id || "",
      responsibleName: member?.fullName || "",
      responsibleEmail: member?.email || "",
    });

    pageMessage.value = member
        ? `${assignment.deviceName} asignado a ${member.fullName}.`
        : `${assignment.deviceName} quedo sin responsable.`;
  });
}

function getStatusBadgeClass(status) {
  const classes = {
    active: "badge-success",
    inactive: "badge-danger",
    maintenance: "badge-warning",
    online: "badge-success",
    offline: "badge-warning",
  };

  return classes[status] ?? "badge-primary";
}

function getStatusLabel(status) {
  const labels = {
    active: "Activa",
    inactive: "Inactiva",
    maintenance: "Mantenimiento",
  };

  return labels[status] ?? "Sin estado";
}

function getSiteTypeLabel(type) {
  const labels = {
    residential: "Residencial",
    business: "Empresarial",
    industrial: "Industrial",
  };

  return labels[type] ?? "Residencial";
}

function getResourceLabel(resourceType) {
  const labels = {
    water: "Agua",
    gas: "Gas",
    mixed: "Mixto",
  };

  return labels[resourceType] ?? "Mixto";
}

function getRoleLabel(role) {
  const labels = {
    owner: "Propietario",
    admin: "Administrador",
    operator: "Operador",
    viewer: "Observador",
  };

  return labels[role] ?? "Responsable";
}

function getDeviceTypeLabel(type) {
  const labels = {
    sensor: "Sensor",
    valve: "Valvula",
    hub: "Hub",
  };

  return labels[type] ?? "Dispositivo";
}

function getDeviceStatusLabel(status) {
  const labels = {
    online: "En linea",
    offline: "Sin conexion",
    maintenance: "Mantenimiento",
    open: "Abierta",
    closed: "Cerrada",
  };

  return labels[status] ?? "Sin estado";
}

function getValveAssociatedSensor(valve) {
  if (!valve || !selectedDeviceGroup.value) return null;

  return (
      selectedDeviceGroup.value.sensors.find((sensor) => sensor.id === valve.sensorId) ||
      selectedDeviceGroup.value.sensors.find(
          (sensor) =>
              sensor.deviceId === valve.deviceId &&
              sensor.resourceType === valve.resourceType
      ) ||
      null
  );
}

function getAssignmentStatusLabel(status) {
  const labels = {
    active: "Asignado",
    maintenance: "En mantenimiento",
    inactive: "Inactivo",
  };

  return labels[status] ?? "Asignado";
}
</script>

<style scoped>
.sites-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 22px;
}

.sites-summary {
  margin-bottom: 20px;
}

.sites-bottom {
  margin-top: 20px;
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
  font-size: 14px;
  margin: 0;
}

.page-message,
.empty-state,
.error-state {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  padding: 18px;
}

.page-message {
  border-style: solid;
  background: #f0f9ff;
  color: var(--color-info);
  margin-bottom: 20px;
}

.error-state {
  color: var(--color-danger);
  background: #fef2f2;
  border-color: #fecaca;
}

.site-list {
  display: grid;
  gap: 14px;
}

.site-card {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 16px;
  text-align: left;
}

.site-card--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.site-card__title {
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  margin: 0 0 4px;
}

.site-card__address {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 0;
}

.site-card__meta {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.site-detail {
  display: grid;
  gap: 20px;
}

.site-detail__header,
.device-group-detail__header {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
}

.site-detail__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.site-detail__actions :deep(.ui-button) {
  min-height: 38px;
  padding-inline: 14px;
  white-space: nowrap;
}

.site-detail__footer {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  border-top: 1px solid var(--color-border);
  padding-top: 16px;
}

.site-detail__footer :deep(.ui-button) {
  width: 100%;
}

.site-status-action :deep(.ui-button),
:deep(.site-status-action.ui-button) {
  border-color: #facc15;
  background: #fffbeb;
  color: #92400e;
  box-shadow: none;
}

.device-group-detail__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.device-group-detail__actions :deep(.ui-button) {
  min-height: 38px;
  padding-inline: 14px;
  white-space: nowrap;
}

.site-detail__title,
.device-group-detail h3 {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 900;
  margin: 0 0 6px;
}

.site-detail__subtitle,
.device-group-detail p {
  color: var(--color-text-muted);
  margin: 0;
}

.physical-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(360px, 0.9fr);
  gap: 20px;
  align-items: start;
}

.physical-layout > * {
  min-width: 0;
}

.device-group-detail {
  display: grid;
  gap: 18px;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.inventory-grid div {
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  min-width: 0;
  padding: 14px 16px;
}

.inventory-grid span {
  color: var(--color-text-muted);
  display: block;
  font-size: 13px;
  margin-bottom: 6px;
}

.inventory-grid strong {
  color: var(--color-text);
  font-size: 22px;
  font-weight: 900;
}

.inventory-section {
  display: grid;
  gap: 10px;
}

.inventory-section h4 {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 900;
  margin: 0;
}

.inventory-card-list {
  display: grid;
  gap: 10px;
}

.inventory-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 14px;
}

.inventory-card > div {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.inventory-card strong {
  color: var(--color-text);
  font-weight: 900;
  line-height: 1.25;
}

.inventory-card span {
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.35;
}

.inventory-card__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 0 0 auto;
  flex-wrap: wrap;
}

.inventory-card__actions :deep(.ui-button) {
  min-height: 34px;
  padding: 8px 11px;
}

.metric-list {
  display: grid;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
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
}

.relation-list {
  display: grid;
  gap: 12px;
}

.relation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.relation-item > div {
  min-width: 0;
}

.relation-item__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex: 0 0 auto;
  flex-wrap: wrap;
}

.relation-item__actions :deep(.ui-button) {
  min-height: 34px;
  padding: 8px 11px;
}

.assignment-control {
  display: grid;
  grid-template-columns: auto minmax(210px, 240px);
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.responsible-select {
  width: 100%;
}

.responsible-select :deep(.ui-select__control) {
  min-height: 38px;
  border-radius: var(--radius-sm);
  padding-block: 8px;
}

.relation-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.relation-item strong {
  display: block;
  color: var(--color-text);
  font-weight: 900;
  margin-bottom: 4px;
}

.relation-item span {
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.35;
}

.relation-action {
  margin-top: 18px;
  width: 100%;
}

.relation-action :deep(.ui-button),
:deep(.relation-action.ui-button) {
  width: 100%;
}

@media (max-width: 900px) {
  .physical-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .sites-toolbar {
    justify-content: stretch;
  }

  .site-card,
  .site-detail__header,
  .site-detail__actions,
  .site-detail__footer,
  .device-group-detail__header,
  .device-group-detail__actions,
  .inventory-card__actions,
  .inventory-card,
  .assignment-control,
  .relation-item__actions,
  .relation-item,
  .metric-row {
    flex-direction: column;
  }

  .assignment-control {
    grid-template-columns: 1fr;
    justify-items: stretch;
    width: 100%;
  }

  .site-card__meta {
    justify-content: flex-start;
  }

  .inventory-grid {
    grid-template-columns: 1fr;
  }

}
</style>
