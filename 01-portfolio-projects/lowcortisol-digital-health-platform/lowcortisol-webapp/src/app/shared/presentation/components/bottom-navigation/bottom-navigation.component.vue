<template>
  <nav class="bottom-navigation" aria-label="Navegacion principal">
    <RouterLink
        v-for="item in items"
        :key="item.name"
        :to="item.to"
        class="bottom-navigation__item"
        :class="{ 'bottom-navigation__item--active': route.name === item.name }"
    >
      <span class="bottom-navigation__icon">
        {{ item.icon }}
      </span>

      <span class="bottom-navigation__label">
        {{ item.label }}
      </span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const items = [
  {
    name: "dashboard",
    label: "Panel",
    icon: "P",
    to: {
      name: "dashboard",
    },
  },
  {
    name: "sites",
    label: "Ubicacion",
    icon: "U",
    to: {
      name: "sites",
    },
  },
  {
    name: "valves",
    label: "Dispositivos",
    icon: "V",
    to: {
      name: "valves",
    },
  },
  {
    name: "devices",
    label: "Conductos",
    icon: "C",
    to: {
      name: "devices",
    },
  },
  {
    name: "alerts",
    label: "Alertas",
    icon: "!",
    to: {
      name: "alerts",
    },
  },
  {
    name: "reports",
    label: "Reportes",
    icon: "R",
    to: {
      name: "reports",
    },
  },
  {
    name: "support",
    label: "Soporte",
    icon: "?",
    to: {
      name: "support",
    },
  },
];
</script>

<style scoped>
.bottom-navigation {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
  min-height: var(--bottom-nav-height);
  padding: 10px 14px;
  border-top: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
}

.bottom-navigation__item {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  min-width: 0;
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  font-weight: 900;
  padding: 8px 6px;
}

.bottom-navigation__item--active {
  border-color: var(--color-text);
  color: var(--color-text);
  background: #ffffff;
}

.bottom-navigation__icon {
  display: grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 999px;
  background: var(--color-surface-soft);
  font-size: 11px;
  line-height: 1;
}

.bottom-navigation__label {
  overflow: hidden;
  max-width: 100%;
  font-size: 9.5px;
  line-height: 1.05;
  letter-spacing: 0;
  text-transform: uppercase;
  text-align: center;
  white-space: normal;
}

@media (max-width: 900px) {
  .bottom-navigation {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    max-height: 132px;
    overflow-y: auto;
  }
}

@media (max-width: 520px) {
  .bottom-navigation {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    padding: 8px;
  }

  .bottom-navigation__label {
    font-size: 9px;
  }
}
</style>
