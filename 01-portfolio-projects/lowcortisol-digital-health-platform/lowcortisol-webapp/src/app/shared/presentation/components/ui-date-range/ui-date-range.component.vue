<template>
  <div ref="root" class="ui-date-range">
    <div v-if="label || description" class="ui-date-range__header">
      <span v-if="label" class="ui-date-range__label">{{ label }}</span>
      <small v-if="description">{{ description }}</small>
    </div>

    <div class="ui-date-range__fields">
      <div class="ui-date-range__field">
        <button
            class="ui-date-range__control"
            :class="{ 'ui-date-range__control--active': activeField === 'start' }"
            type="button"
            :aria-expanded="activeField === 'start'"
            @click="openPicker('start')"
        >
          <strong>{{ formatDisplayDate(startDate) }}</strong>
          <span class="ui-date-range__icon" aria-hidden="true">v</span>
        </button>
        <small class="ui-date-range__hint">{{ startLabel }}</small>
      </div>

      <div class="ui-date-range__field">
        <button
            class="ui-date-range__control"
            :class="{ 'ui-date-range__control--active': activeField === 'end' }"
            type="button"
            :aria-expanded="activeField === 'end'"
            @click="openPicker('end')"
        >
          <strong>{{ formatDisplayDate(endDate) }}</strong>
          <span class="ui-date-range__icon" aria-hidden="true">v</span>
        </button>
        <small class="ui-date-range__hint">{{ endLabel }}</small>
      </div>
    </div>

    <div v-if="activeField" class="ui-date-range__popover">
      <header class="ui-date-range__calendar-header">
        <button type="button" class="ui-date-range__month-button" @click="moveMonth(-1)">
          Anterior
        </button>

        <div>
          <strong>{{ visibleMonthLabel }}</strong>
          <span>{{ activeField === "start" ? "Selecciona el inicio" : "Selecciona el final" }}</span>
        </div>

        <button
            type="button"
            class="ui-date-range__month-button"
            :disabled="nextMonthIsDisabled"
            @click="moveMonth(1)"
        >
          Siguiente
        </button>
      </header>

      <div class="ui-date-range__weekdays" aria-hidden="true">
        <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
      </div>

      <div class="ui-date-range__days">
        <button
            v-for="day in calendarDays"
            :key="day.key"
            class="ui-date-range__day"
            :class="{
              'ui-date-range__day--muted': !day.currentMonth,
              'ui-date-range__day--today': day.isToday,
              'ui-date-range__day--selected': day.isSelected,
              'ui-date-range__day--range': day.isInRange
            }"
            type="button"
            :disabled="day.disabled"
            @click="selectDate(day.value)"
        >
          {{ day.day }}
        </button>
      </div>

      <footer class="ui-date-range__calendar-footer">
        <button type="button" @click="clearActiveDate">Borrar</button>
        <button type="button" @click="selectToday">Hoy</button>
      </footer>
    </div>

    <p v-if="validationMessage" class="ui-date-range__message">
      {{ validationMessage }}
    </p>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  startDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "Rango de fechas",
  },
  description: {
    type: String,
    default: "",
  },
  startLabel: {
    type: String,
    default: "Desde",
  },
  endLabel: {
    type: String,
    default: "Hasta",
  },
  minDate: {
    type: String,
    default: "",
  },
  maxDate: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:startDate", "update:endDate", "change"]);

const weekdays = ["DO", "LU", "MA", "MI", "JU", "VI", "SA"];
const monthFormatter = new Intl.DateTimeFormat("es-PE", {
  month: "long",
  year: "numeric",
});
const displayFormatter = new Intl.DateTimeFormat("es-PE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const root = ref(null);
const activeField = ref("");
const todayInput = toDateInputValue(new Date());
const visibleMonth = ref(startOfMonth(inputToDate(props.endDate || props.startDate || todayInput)));

const safeMaxDate = computed(() => props.maxDate || todayInput);
const visibleMonthLabel = computed(() => capitalize(monthFormatter.format(visibleMonth.value)));
const nextMonthIsDisabled = computed(() => {
  const nextMonth = addMonths(visibleMonth.value, 1);
  return toDateInputValue(startOfMonth(nextMonth)) > startOfMonthValue(safeMaxDate.value);
});

const validationMessage = computed(() => {
  if (props.startDate && props.endDate && props.startDate > props.endDate) {
    return "La fecha inicial no puede ser posterior a la fecha final.";
  }

  if (
      (props.startDate && props.startDate > safeMaxDate.value) ||
      (props.endDate && props.endDate > safeMaxDate.value)
  ) {
    return "No se pueden generar reportes con fechas futuras.";
  }

  return "";
});

const calendarDays = computed(() => {
  const firstDay = startOfMonth(visibleMonth.value);
  const startOffset = firstDay.getDay();
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const value = toDateInputValue(date);

    return {
      key: `${value}-${index}`,
      value,
      day: date.getDate(),
      currentMonth: date.getMonth() === visibleMonth.value.getMonth(),
      disabled: isDateDisabled(value),
      isToday: value === todayInput,
      isSelected: value === props.startDate || value === props.endDate,
      isInRange: isInRange(value),
    };
  });
});

watch(
    () => [props.startDate, props.endDate],
    () => {
      if (!activeField.value) return;
      visibleMonth.value = startOfMonth(inputToDate(getActiveValue() || todayInput));
    }
);

function openPicker(field) {
  activeField.value = activeField.value === field ? "" : field;
  if (activeField.value) {
    visibleMonth.value = startOfMonth(inputToDate(getActiveValue() || todayInput));
  }
}

function selectDate(value) {
  if (!activeField.value || isDateDisabled(value)) return;

  if (activeField.value === "start") {
    const nextEnd = props.endDate && props.endDate < value ? value : props.endDate;
    emitRange(value, nextEnd);
  } else {
    const nextStart = props.startDate && props.startDate > value ? value : props.startDate;
    emitRange(nextStart, value);
  }

  activeField.value = "";
}

function selectToday() {
  const today = normalizeDate(todayInput, props.minDate, safeMaxDate.value);
  if (!isDateDisabled(today)) {
    selectDate(today);
  }
}

function clearActiveDate() {
  if (activeField.value === "start") {
    emitRange("", props.endDate);
  } else if (activeField.value === "end") {
    emitRange(props.startDate, "");
  }

  activeField.value = "";
}

function moveMonth(direction) {
  const nextMonth = addMonths(visibleMonth.value, direction);
  if (direction > 0 && toDateInputValue(startOfMonth(nextMonth)) > startOfMonthValue(safeMaxDate.value)) {
    return;
  }

  visibleMonth.value = nextMonth;
}

function emitRange(startDate, endDate) {
  const nextStart = normalizeDate(startDate, props.minDate, safeMaxDate.value);
  const nextEnd = normalizeDate(endDate, nextStart || props.minDate, safeMaxDate.value);

  emit("update:startDate", nextStart);
  emit("update:endDate", nextEnd);
  emit("change", { startDate: nextStart, endDate: nextEnd });
}

function isDateDisabled(value) {
  if (props.minDate && value < props.minDate) return true;
  if (safeMaxDate.value && value > safeMaxDate.value) return true;
  if (activeField.value === "start" && props.endDate && value > props.endDate) return true;
  if (activeField.value === "end" && props.startDate && value < props.startDate) return true;
  return false;
}

function isInRange(value) {
  return Boolean(props.startDate && props.endDate && value > props.startDate && value < props.endDate);
}

function getActiveValue() {
  return activeField.value === "start" ? props.startDate : props.endDate;
}

function formatDisplayDate(value) {
  if (!value) return "Seleccionar";
  return displayFormatter.format(inputToDate(value));
}

function normalizeDate(value, minDate, maxDate) {
  if (!value) return "";
  if (maxDate && value > maxDate) return maxDate;
  if (minDate && value < minDate) return minDate;
  return value;
}

function inputToDate(value) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfMonthValue(value) {
  return toDateInputValue(startOfMonth(inputToDate(value)));
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function toDateInputValue(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function handleClickOutside(event) {
  if (!root.value || root.value.contains(event.target)) return;
  activeField.value = "";
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.ui-date-range {
  position: relative;
  display: grid;
  gap: 10px;
  min-width: 0;
}

.ui-date-range__header {
  display: grid;
  gap: 4px;
}

.ui-date-range__label {
  color: var(--color-text);
  font-weight: 900;
}

.ui-date-range__header small {
  color: var(--color-text-muted);
  font-weight: 700;
  line-height: 1.35;
}

.ui-date-range__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(132px, 1fr));
  gap: 8px;
  border: 0;
  background: transparent;
  padding: 0;
}

.ui-date-range__field {
  display: grid;
  gap: 8px;
  min-width: 0;
}

.ui-date-range__control {
  display: grid;
  min-height: 46px;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  color: var(--color-text);
  padding: 10px 12px;
  text-align: left;
  transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
}

.ui-date-range__control:hover,
.ui-date-range__control--active {
  border-color: var(--color-primary);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
}

.ui-date-range__control strong,
.ui-date-range__hint {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ui-date-range__control strong {
  font-size: 14px;
  font-weight: 900;
}

.ui-date-range__hint {
  display: block;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 800;
  line-height: 1.35;
  padding-left: 2px;
}

.ui-date-range__icon {
  grid-row: 1;
  grid-column: 2;
  color: var(--color-text-muted);
  font-weight: 900;
}

.ui-date-range__popover {
  position: absolute;
  z-index: 80;
  top: calc(100% + 10px);
  right: 0;
  width: min(370px, calc(100vw - 32px));
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: #ffffff;
  box-shadow: 0 24px 70px rgba(15, 23, 42, 0.18);
  padding: 16px;
}

.ui-date-range__calendar-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
}

.ui-date-range__calendar-header div {
  display: grid;
  gap: 3px;
  text-align: center;
}

.ui-date-range__calendar-header strong {
  color: var(--color-text);
  font-size: 17px;
  font-weight: 900;
}

.ui-date-range__calendar-header span {
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 800;
}

.ui-date-range__month-button,
.ui-date-range__calendar-footer button {
  min-height: 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface-soft);
  color: var(--color-text);
  font-size: 12px;
  font-weight: 900;
  padding: 8px 10px;
}

.ui-date-range__month-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ui-date-range__weekdays,
.ui-date-range__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.ui-date-range__weekdays {
  margin-bottom: 6px;
}

.ui-date-range__weekdays span {
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 900;
  text-align: center;
}

.ui-date-range__day {
  aspect-ratio: 1;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text);
  font-weight: 900;
  transition:
      background 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease,
      box-shadow 0.2s ease;
}

.ui-date-range__day:not(:disabled):hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.ui-date-range__day--muted {
  color: #94a3b8;
}

.ui-date-range__day--today {
  border-color: #93c5fd;
}

.ui-date-range__day--range {
  background: #eff6ff;
  color: var(--color-primary);
}

.ui-date-range__day--selected {
  background: var(--color-primary);
  color: #ffffff;
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.22);
}

.ui-date-range__day:disabled {
  cursor: not-allowed;
  color: #cbd5e1;
  opacity: 0.58;
}

.ui-date-range__calendar-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-top: 1px solid var(--color-border);
  margin-top: 14px;
  padding-top: 12px;
}

.ui-date-range__calendar-footer button:last-child {
  border-color: #bfdbfe;
  background: #eff6ff;
  color: var(--color-primary);
}

.ui-date-range__message {
  border: 1px solid #fde68a;
  border-radius: var(--radius-sm);
  background: #fffbeb;
  color: #92400e;
  font-size: 13px;
  font-weight: 800;
  margin: 0;
  padding: 9px 11px;
}

@media (max-width: 620px) {
  .ui-date-range__fields {
    grid-template-columns: 1fr;
  }

  .ui-date-range__popover {
    right: auto;
    left: 0;
  }
}
</style>
