<template>
  <UiCard
      :title="t('workplace.physical.title')"
      :subtitle="t('workplace.physical.subtitle')"
  >
    <template #actions>
      <UiButton
          :label="t('workplace.physical.createRoom')"
          variant="neutral"
          @click="$emit('create-room')"
      />
    </template>

    <div v-if="!site" class="physical-empty">
      {{ t('workplace.sites.selectSite') }}
    </div>

    <div v-else-if="rooms.length === 0" class="physical-empty">
      {{ t('workplace.physical.noRooms') }}
    </div>

    <div v-else class="physical-model">
      <RoomCard
          v-for="room in rooms"
          :key="room.id"
          :room="room"
          :active="room.id === selectedRoomId"
          :selected-device-group-id="selectedDeviceGroupId"
          @select="$emit('select-room', $event)"
          @select-device-group="$emit('select-device-group', $event)"
          @create-device-group="$emit('create-device-group', $event)"
      />
    </div>
  </UiCard>
</template>

<script setup>
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import UiCard from "../../../../shared/presentation/components/ui-card/ui-card.component.vue";
import RoomCard from "../room-card/room-card.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  site: {
    type: Object,
    default: null,
  },
  rooms: {
    type: Array,
    default: () => [],
  },
  selectedRoomId: {
    type: String,
    default: null,
  },
  selectedDeviceGroupId: {
    type: String,
    default: null,
  },
});

defineEmits(["create-room", "create-device-group", "select-room", "select-device-group"]);

const { t } = useTranslation();
</script>

<style scoped>
.physical-model {
  display: grid;
  gap: 14px;
}

.physical-empty {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  padding: 18px;
}
</style>
