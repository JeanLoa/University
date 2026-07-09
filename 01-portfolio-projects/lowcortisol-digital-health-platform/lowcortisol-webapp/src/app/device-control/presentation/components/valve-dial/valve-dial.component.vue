<template>
  <div class="valve-dial">
    <div
        ref="dialRef"
        class="valve-dial__visual"
        :class="[
          `valve-dial__visual--${resourceTone}`,
          {
            'valve-dial__visual--dragging': isDragging,
            'valve-dial__visual--disabled': disabled,
          }
        ]"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        :aria-label="`Apertura de ${valve.name}`"
        :aria-valuemin="0"
        :aria-valuemax="100"
        :aria-valuenow="normalizedValue"
        :aria-disabled="disabled"
        @pointerdown="startDrag"
        @pointermove="drag"
        @pointerup="stopDrag"
        @pointercancel="stopDrag"
        @lostpointercapture="stopDrag"
        @keydown="handleKeydown"
    >
      <svg class="valve-dial__svg" viewBox="0 0 220 220" aria-hidden="true">
        <circle class="valve-dial__track" cx="110" cy="110" r="84" />
        <path v-if="arcPath" class="valve-dial__progress" :d="arcPath" />
      </svg>

      <span class="valve-dial__knob" :style="knobStyle" />

      <div class="valve-dial__value">
        <strong>{{ normalizedValue }}%</strong>
        <span>{{ statusLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  valve: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["commit"]);

const dialRef = ref(null);
const draftValue = ref(normalizeOpening(props.valve.openingPercentage));
const isDragging = ref(false);
const lastPointerProgress = ref(null);

const normalizedValue = computed(() => Math.round(normalizeOpening(draftValue.value)));
const resourceTone = computed(() => props.valve.resourceType === "gas" ? "gas" : "water");
const statusLabel = computed(() => normalizedValue.value > 0 ? "Abierta" : "Cerrada");

const arcPath = computed(() => describeArc(normalizedValue.value));
const knobStyle = computed(() => {
  const radius = 84;
  const center = 110;
  const angle = 90 - (normalizedValue.value / 100) * 360;
  const radians = angle * Math.PI / 180;
  const x = center + radius * Math.cos(radians) - 10;
  const y = center + radius * Math.sin(radians) - 10;

  return {
    transform: `translate(${x}px, ${y}px)`,
  };
});

watch(
  () => props.valve.openingPercentage,
  (openingPercentage) => {
    draftValue.value = normalizeOpening(openingPercentage);
  }
);

function normalizeOpening(value) {
  return Math.max(0, Math.min(100, Number(value || 0)));
}

function getPointOnCircle(angle) {
  const radius = 84;
  const center = 110;
  const radians = angle * Math.PI / 180;

  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function describeArc(value) {
  const opening = normalizeOpening(value);

  if (opening <= 0) {
    return "";
  }

  const start = getPointOnCircle(90);
  const end = getPointOnCircle(90 - (opening / 100) * 359.99);
  const largeArcFlag = opening > 50 ? 1 : 0;

  return [
    "M",
    start.x,
    start.y,
    "A",
    84,
    84,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
}

function startDrag(event) {
  if (props.disabled) return;

  isDragging.value = true;
  event.currentTarget.setPointerCapture(event.pointerId);
  lastPointerProgress.value = getPointerProgress(event);
}

function drag(event) {
  if (props.disabled || !isDragging.value) return;

  updateOpeningFromPointer(event);
}

function stopDrag(event) {
  if (props.disabled || !isDragging.value) return;

  isDragging.value = false;
  lastPointerProgress.value = null;

  if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  commitValue(draftValue.value);
}

function updateOpeningFromPointer(event) {
  const pointerProgress = getPointerProgress(event);

  if (pointerProgress === null) return;

  if (lastPointerProgress.value === null) {
    lastPointerProgress.value = pointerProgress;
    return;
  }

  const angleDelta = getSignedAngleDelta(pointerProgress, lastPointerProgress.value);
  const valueDelta = angleDelta / 360 * 100;

  draftValue.value = normalizeOpening(draftValue.value + valueDelta);
  lastPointerProgress.value = pointerProgress;
}

function getPointerProgress(event) {
  const rect = dialRef.value?.getBoundingClientRect();

  if (!rect) return null;

  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  const angle = Math.atan2(y, x) * 180 / Math.PI;

  return (90 - angle + 360) % 360;
}

function getSignedAngleDelta(currentProgress, previousProgress) {
  let delta = currentProgress - previousProgress;

  if (delta > 180) {
    delta -= 360;
  }

  if (delta < -180) {
    delta += 360;
  }

  return delta;
}

function handleKeydown(event) {
  if (props.disabled) return;

  const keyHandlers = {
    ArrowRight: () => setKeyboardValue(normalizedValue.value + 5),
    ArrowUp: () => setKeyboardValue(normalizedValue.value + 5),
    ArrowLeft: () => setKeyboardValue(normalizedValue.value - 5),
    ArrowDown: () => setKeyboardValue(normalizedValue.value - 5),
    Home: () => setKeyboardValue(0),
    End: () => setKeyboardValue(100),
  };

  const handler = keyHandlers[event.key];

  if (!handler) return;

  event.preventDefault();
  handler();
}

function setKeyboardValue(value) {
  draftValue.value = normalizeOpening(value);
  commitValue(draftValue.value);
}

function commitValue(value) {
  emit("commit", Math.round(normalizeOpening(value)));
}
</script>

<style scoped>
.valve-dial {
  display: grid;
  gap: 18px;
  justify-items: center;
}

.valve-dial__visual {
  position: relative;
  width: 220px;
  max-width: 100%;
  aspect-ratio: 1;
  border-radius: 999px;
  background:
      radial-gradient(circle at center, #ffffff 0 54%, transparent 55%),
      linear-gradient(145deg, #eaf4ff, #ffffff);
  cursor: grab;
  touch-action: none;
  box-shadow:
      inset 0 0 0 1px var(--color-border),
      0 18px 36px rgba(15, 23, 42, 0.08);
}

.valve-dial__visual:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.28);
  outline-offset: 6px;
}

.valve-dial__visual--dragging {
  cursor: grabbing;
}

.valve-dial__visual--disabled {
  cursor: not-allowed;
  filter: grayscale(0.35);
  opacity: 0.58;
}

.valve-dial__visual--gas {
  background:
      radial-gradient(circle at center, #ffffff 0 54%, transparent 55%),
      linear-gradient(145deg, #fff7ed, #ffffff);
}

.valve-dial__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.valve-dial__track,
.valve-dial__progress {
  fill: none;
  stroke-linecap: round;
  stroke-width: 16;
}

.valve-dial__track {
  stroke: #e5edf7;
}

.valve-dial__progress {
  stroke: var(--color-primary);
}

.valve-dial__visual--gas .valve-dial__progress {
  stroke: #f59e0b;
}

.valve-dial__knob {
  position: absolute;
  left: 0;
  top: 0;
  width: 20px;
  height: 20px;
  border: 4px solid #ffffff;
  border-radius: 999px;
  background: var(--color-primary);
  pointer-events: none;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.28);
}

.valve-dial__visual--gas .valve-dial__knob {
  background: #f59e0b;
  box-shadow: 0 8px 18px rgba(245, 158, 11, 0.28);
}

.valve-dial__value {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  pointer-events: none;
  text-align: center;
}

.valve-dial__value strong {
  color: var(--color-text);
  font-size: 42px;
  line-height: 1;
}

.valve-dial__value span {
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 900;
  margin-top: 8px;
  text-transform: uppercase;
}

</style>
