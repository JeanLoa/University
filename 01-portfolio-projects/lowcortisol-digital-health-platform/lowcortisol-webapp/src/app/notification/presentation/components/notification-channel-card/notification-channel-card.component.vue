<template>
  <article class="channel-card">
    <div class="channel-card__content">
      <p>{{ t("notifications.center.channel") }}</p>
      <h3>{{ channel.name }}</h3>
      <span>{{ t(`notifications.channelType.${channel.type}`) }}</span>
    </div>

    <StatusBadge
        :status="channel.isActive ? 'active' : 'inactive'"
        :label="channel.isActive ? t('notifications.channelStatus.active') : t('notifications.channelStatus.inactive')"
    />

    <UiButton
        :variant="channel.isActive ? 'neutral' : 'action'"
        :label="channel.isActive ? t('notifications.actions.deactivateChannel') : t('notifications.actions.activateChannel')"
        :disabled="busy"
        @click="$emit(channel.isActive ? 'deactivate' : 'activate', channel.id)"
    />
  </article>
</template>

<script setup>
import StatusBadge from "../../../../shared/presentation/components/status-badge/status-badge.component.vue";
import UiButton from "../../../../shared/presentation/components/ui-button/ui-button.component.vue";
import { useTranslation } from "../../../../shared/application/services/translation.service";

defineProps({
  channel: {
    type: Object,
    required: true,
  },
  busy: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["activate", "deactivate"]);

const { t } = useTranslation();
</script>

<style scoped>
.channel-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  padding: 14px;
}

.channel-card__content {
  min-width: 0;
}

.channel-card__content p {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  margin: 0 0 6px;
  text-transform: uppercase;
}

.channel-card h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
  margin: 0 0 4px;
}

.channel-card__content > span {
  color: var(--color-text-muted);
  margin: 0;
}

.channel-card > .ui-button {
  grid-column: 1 / -1;
  width: 100%;
}

@media (max-width: 760px) {
  .channel-card {
    grid-template-columns: 1fr;
    justify-items: start;
  }
}
</style>
