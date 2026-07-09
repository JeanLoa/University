<template>
  <div ref="root" class="ui-select" :class="{ 'ui-select--open': open }">
    <span v-if="label" class="ui-select__label">{{ label }}</span>

    <button
        class="ui-select__control"
        type="button"
        :aria-expanded="open"
        :aria-label="label || selectedOption?.label || 'Seleccionar opcion'"
        @click="toggle"
        @keydown.down.prevent="openMenu"
        @keydown.enter.prevent="toggle"
        @keydown.esc.prevent="close"
    >
      <span class="ui-select__value">
        {{ selectedOption?.label || placeholder }}
      </span>

      <span class="ui-select__chevron" aria-hidden="true">v</span>
    </button>

    <div v-if="open" class="ui-select__menu" role="listbox">
      <button
          v-for="option in options"
          :key="option.value"
          class="ui-select__option"
          :class="{ 'ui-select__option--active': option.value === modelValue }"
          type="button"
          role="option"
          :aria-selected="option.value === modelValue"
          @click="select(option.value)"
      >
        <span>{{ option.label }}</span>
        <small v-if="option.description">{{ option.description }}</small>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Seleccionar",
  },
  options: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const root = ref(null);
const open = ref(false);

const selectedOption = computed(() =>
    props.options.find((option) => option.value === props.modelValue) || null
);

function toggle() {
  open.value = !open.value;
}

function openMenu() {
  open.value = true;
}

function close() {
  open.value = false;
}

function select(value) {
  emit("update:modelValue", value);
  emit("change", value);
  close();
}

function handleClickOutside(event) {
  if (!root.value || root.value.contains(event.target)) return;
  close();
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.ui-select {
  position: relative;
  display: grid;
  gap: 8px;
}

.ui-select__label {
  color: var(--color-text);
  font-weight: 800;
}

.ui-select__control {
  display: flex;
  min-height: 46px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  color: var(--color-text);
  font-weight: 900;
  padding: 10px 13px;
  text-align: left;
  transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
}

.ui-select__control:hover,
.ui-select--open .ui-select__control {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.ui-select__value {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-select__chevron {
  color: var(--color-text-muted);
  flex: 0 0 auto;
  font-size: 18px;
  line-height: 1;
}

.ui-select__menu {
  position: absolute;
  z-index: 60;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  display: grid;
  gap: 4px;
  max-height: 250px;
  overflow: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.16);
  padding: 6px;
}

.ui-select__option {
  display: grid;
  gap: 2px;
  width: 100%;
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text);
  font-weight: 900;
  padding: 10px 11px;
  text-align: left;
}

.ui-select__option:hover,
.ui-select__option--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.ui-select__option small {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
}
</style>
