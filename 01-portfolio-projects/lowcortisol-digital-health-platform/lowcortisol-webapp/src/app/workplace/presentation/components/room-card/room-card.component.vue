<template>
  <article class="room-card" :class="{ 'room-card--active': active }">
    <header class="room-card__header">
      <button class="room-card__select" type="button" @click="$emit('select', room.id)">
        <span>{{ room.name }}</span>
        <small>{{ getRoomTypeLabel(room.type) }}</small>
      </button>

      <StatusBadge :status="room.status" :label="getStatusLabel(room.status)" />
    </header>

    <div v-if="room.deviceGroups.length === 0" class="room-card__empty">
      {{ t('workplace.physical.noDeviceGroups') }}
    </div>

    <div v-else class="room-card__groups">
      <DeviceGroupCard
          v-for="deviceGroup in room.deviceGroups"
          :key="deviceGroup.id"
          :device-group="deviceGroup"
          :active="deviceGroup.id === selectedDeviceGroupId"
          @select="$emit('select-device-group', $event)"
      />
    </div>

    <button class="room-card__action" type="button" @click="$emit('create-device-group', room.id)">
      {{ t('workplace.physical.createDeviceGroup') }}
    </button>
  </article>
</template>

<script setup>
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import DeviceGroupCard from "../device-group-card/device-group-card.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  room: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  selectedDeviceGroupId: {
    type: String,
    default: null,
  },
});

defineEmits(["select", "select-device-group", "create-device-group"]);

const { t } = useTranslation();

function getRoomTypeLabel(type) {
  const keys = {
    kitchen: "workplace.roomTypes.kitchen",
    bathroom: "workplace.roomTypes.bathroom",
    warehouse: "workplace.roomTypes.warehouse",
    engine_room: "workplace.roomTypes.engineRoom",
    custom: "workplace.roomTypes.custom",
  };

  return t(keys[type] ?? "workplace.roomTypes.custom");
}

function getStatusLabel(status) {
  const keys = {
    active: "workplace.status.active",
    inactive: "workplace.status.inactive",
    maintenance: "workplace.status.maintenance",
  };

  return t(keys[status] ?? "workplace.status.unknown");
}

</script>

<style scoped>
.room-card {
  display: grid;
  gap: 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 16px;
}

.room-card--active {
  border-color: var(--color-primary);
}

.room-card__header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.room-card__select {
  border: 0;
  background: transparent;
  color: var(--color-text);
  padding: 0;
  text-align: left;
}

.room-card__select span {
  display: block;
  font-size: 17px;
  font-weight: 900;
}

.room-card__select small {
  color: var(--color-text-muted);
  display: block;
  font-size: 13px;
  margin-top: 4px;
}

.room-card__groups {
  display: grid;
  gap: 12px;
}

.room-card__empty {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  padding: 14px;
}

.room-card__action {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-primary);
  font-weight: 900;
  padding: 12px;
}
</style>
