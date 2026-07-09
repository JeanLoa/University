<template>
  <div class="context-side-panel">
    <div
        class="context-side-panel__edge"
        aria-hidden="true"
        @mouseenter="openPanel"
    ></div>

    <Transition name="context-blur">
      <div v-if="open" class="context-side-panel__blur"></div>
    </Transition>

    <aside
        class="context-side-panel__drawer"
        :class="{ 'context-side-panel__drawer--open': open }"
        aria-label="Opciones secundarias"
        @mouseenter="openPanel"
        @mouseleave="closePanel"
    >
      <header class="context-side-panel__profile">
        <div class="context-side-panel__avatar">
          {{ userInitials }}
        </div>

        <div>
          <span>Sesion activa</span>
          <strong>{{ userName }}</strong>
          <small>{{ userEmail }}</small>
        </div>
      </header>

      <nav class="context-side-panel__nav" aria-label="Opciones de cuenta">
        <button
            v-for="item in items"
            :key="item.label"
            class="context-side-panel__link"
            type="button"
            @click="navigateTo(item)"
        >
          <span class="context-side-panel__link-icon" aria-hidden="true">
            {{ item.icon }}
          </span>

          <span>
            <strong>{{ item.label }}</strong>
            <small>{{ item.description }}</small>
          </span>
        </button>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import { AuthSessionService } from "../../../application/services/auth-session.service";

const router = useRouter();
const open = ref(false);
const user = ref(null);

const items = [
  {
    label: "Perfil",
    description: "Datos personales y acceso",
    icon: "P",
    to: { name: "profile" },
  },
  {
    label: "Configuracion",
    description: "Costos y operacion",
    icon: "C",
    to: { name: "settings" },
  },
  {
    label: "Planes",
    description: "Suscripcion y capacidad",
    icon: "S",
    to: { name: "plans" },
  },
  {
    label: "Acerca de",
    description: "Producto y arquitectura",
    icon: "A",
    to: { name: "about" },
  },
];

const userName = computed(() => user.value?.fullName || "Usuario LowCortisol");
const userEmail = computed(() => user.value?.email || "Cuenta operativa");
const userInitials = computed(() => {
  if (user.value?.initials) return user.value.initials;

  return userName.value
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "LC";
});

function refreshUser() {
  user.value = AuthSessionService.getCurrentUser();
}

function openPanel() {
  refreshUser();
  open.value = true;
}

function closePanel() {
  open.value = false;
}

async function navigateTo(item) {
  try {
    await router.push(item.to);
  } finally {
    closePanel();
  }
}

onMounted(() => {
  refreshUser();
});
</script>

<style scoped>
.context-side-panel__edge {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 45;
  width: 18px;
}

.context-side-panel__edge::after {
  position: absolute;
  top: 50%;
  right: 5px;
  width: 4px;
  height: 84px;
  border-radius: var(--radius-pill);
  background: rgba(47, 128, 237, 0.18);
  content: "";
  opacity: 0;
  transform: translateY(-50%);
  transition: opacity 0.18s ease;
}

.context-side-panel__edge:hover::after {
  opacity: 1;
}

.context-side-panel__blur {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  background: rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(7px) saturate(1.05);
}

.context-side-panel__drawer {
  position: fixed;
  top: 18px;
  right: 18px;
  bottom: calc(var(--bottom-nav-height) + 18px);
  z-index: 60;
  display: grid;
  width: min(330px, calc(100vw - 36px));
  align-content: start;
  gap: 16px;
  border: 1px solid rgba(219, 228, 240, 0.92);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.2);
  opacity: 0;
  padding: 18px;
  pointer-events: none;
  transform: translateX(calc(100% + 34px));
  transition:
      transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.18s ease;
}

.context-side-panel__drawer--open {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
}

.context-side-panel__profile {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #ffffff, var(--color-primary-light));
  padding: 14px;
}

.context-side-panel__avatar,
.context-side-panel__link-icon {
  display: grid;
  place-items: center;
  border-radius: var(--radius-pill);
  font-weight: 900;
}

.context-side-panel__avatar {
  width: 48px;
  height: 48px;
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: var(--shadow-button);
}

.context-side-panel__profile span,
.context-side-panel__profile small,
.context-side-panel__link small {
  color: var(--color-text-muted);
  font-weight: 800;
}

.context-side-panel__profile span {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
}

.context-side-panel__profile strong {
  display: block;
  overflow: hidden;
  color: var(--color-text);
  font-size: 18px;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.context-side-panel__profile small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.context-side-panel__nav {
  display: grid;
  gap: 10px;
}

.context-side-panel__link {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  color: inherit;
  cursor: pointer;
  font: inherit;
  padding: 13px;
  text-align: left;
  transition:
      border-color 0.18s ease,
      box-shadow 0.18s ease,
      transform 0.18s ease;
}

.context-side-panel__link:hover {
  border-color: var(--color-primary);
  box-shadow: 0 14px 28px rgba(47, 128, 237, 0.14);
  transform: translateX(-2px);
}

.context-side-panel__link-icon {
  width: 38px;
  height: 38px;
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.context-side-panel__link strong {
  display: block;
  color: var(--color-text);
  font-weight: 900;
}

.context-side-panel__link small {
  display: block;
  line-height: 1.35;
  margin-top: 2px;
}

.context-blur-enter-active,
.context-blur-leave-active {
  transition:
      opacity 0.22s ease,
      backdrop-filter 0.22s ease,
      background 0.22s ease;
}

.context-blur-enter-from,
.context-blur-leave-to {
  opacity: 0;
  background: rgba(15, 23, 42, 0);
  backdrop-filter: blur(0) saturate(1);
}

.context-blur-enter-to,
.context-blur-leave-from {
  opacity: 1;
}

@media (max-width: 720px) {
  .context-side-panel__edge {
    width: 12px;
  }

  .context-side-panel__drawer {
    top: 10px;
    right: 10px;
    bottom: calc(var(--bottom-nav-height) + 10px);
    width: min(310px, calc(100vw - 20px));
  }
}
</style>
