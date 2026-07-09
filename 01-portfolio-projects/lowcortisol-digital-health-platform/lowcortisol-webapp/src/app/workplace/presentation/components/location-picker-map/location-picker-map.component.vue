<template>
  <section class="location-picker">
    <header class="location-picker__header">
      <div>
        <h3>Ubicacion en mapa</h3>
        <p>Arrastra el mapa y haz clic sobre el punto donde estara la sede.</p>
      </div>

      <span v-if="selectedLocation" class="location-picker__coords">
        {{ selectedLocation.latitude.toFixed(5) }}, {{ selectedLocation.longitude.toFixed(5) }}
      </span>
    </header>

    <div
        ref="mapRef"
        class="location-picker__map"
        :class="{ 'location-picker__map--dragging': dragState.active }"
        role="application"
        aria-label="Selector de ubicacion con OpenStreetMap"
        @pointerdown="startDrag"
        @pointermove="dragMap"
        @pointerup="stopDrag"
        @pointercancel="stopDrag"
        @lostpointercapture="stopDrag"
        @wheel.prevent="zoomMap"
    >
      <img
          v-for="tile in visibleTiles"
          :key="tile.key"
          class="location-picker__tile"
          :src="tile.src"
          :style="{ left: `${tile.left}px`, top: `${tile.top}px` }"
          alt=""
          draggable="false"
      >

      <span class="location-picker__center" aria-hidden="true" />

      <span
          v-if="markerStyle"
          class="location-picker__marker"
          :style="markerStyle"
          aria-hidden="true"
      />

      <a
          class="location-picker__attribution"
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
      >
        OpenStreetMap
      </a>
    </div>

    <p class="location-picker__status">
      {{ statusText }}
    </p>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const emit = defineEmits(["select"]);

const tileSize = 256;
const minZoom = 11;
const maxZoom = 18;
const zoom = ref(13);
const tileCount = computed(() => 2 ** zoom.value);

const mapRef = ref(null);
const mapSize = reactive({
  width: 640,
  height: 280,
});
const center = reactive({
  latitude: -12.04637,
  longitude: -77.04279,
});
const selectedLocation = ref(null);
const statusText = ref("Selecciona la ubicacion de la sede en el mapa.");
const dragState = reactive({
  active: false,
  moved: false,
  startX: 0,
  startY: 0,
  startWorldX: 0,
  startWorldY: 0,
});

const centerWorld = computed(() => latLngToWorld(center.latitude, center.longitude));
const visibleTiles = computed(() => {
  const topLeft = getTopLeftWorld();
  const startX = Math.floor(topLeft.x / tileSize) - 1;
  const endX = Math.floor((topLeft.x + mapSize.width) / tileSize) + 1;
  const startY = Math.floor(topLeft.y / tileSize) - 1;
  const endY = Math.floor((topLeft.y + mapSize.height) / tileSize) + 1;
  const maxTile = tileCount.value;
  const tiles = [];

  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) {
      if (y < 0 || y >= maxTile) continue;

      const wrappedX = ((x % maxTile) + maxTile) % maxTile;

      tiles.push({
        key: `${zoom.value}-${wrappedX}-${y}-${x}`,
        src: `https://tile.openstreetmap.org/${zoom.value}/${wrappedX}/${y}.png`,
        left: x * tileSize - topLeft.x,
        top: y * tileSize - topLeft.y,
      });
    }
  }

  return tiles;
});

const markerStyle = computed(() => {
  if (!selectedLocation.value) return null;

  const markerWorld = latLngToWorld(
      selectedLocation.value.latitude,
      selectedLocation.value.longitude
  );
  const topLeft = getTopLeftWorld();

  return {
    left: `${markerWorld.x - topLeft.x}px`,
    top: `${markerWorld.y - topLeft.y}px`,
  };
});

onMounted(() => {
  updateMapSize();
  window.addEventListener("resize", updateMapSize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateMapSize);
});

function updateMapSize() {
  const rect = mapRef.value?.getBoundingClientRect();

  if (!rect) return;

  mapSize.width = rect.width || mapSize.width;
  mapSize.height = rect.height || mapSize.height;
}

function startDrag(event) {
  updateMapSize();
  const world = centerWorld.value;

  dragState.active = true;
  dragState.moved = false;
  dragState.startX = event.clientX;
  dragState.startY = event.clientY;
  dragState.startWorldX = world.x;
  dragState.startWorldY = world.y;
  event.currentTarget.setPointerCapture(event.pointerId);
}

function dragMap(event) {
  if (!dragState.active) return;

  const deltaX = event.clientX - dragState.startX;
  const deltaY = event.clientY - dragState.startY;

  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
    dragState.moved = true;
  }

  setCenterFromWorld(dragState.startWorldX - deltaX, dragState.startWorldY - deltaY);
}

function zoomMap(event) {
  updateMapSize();

  const nextZoom = Math.min(
      maxZoom,
      Math.max(minZoom, zoom.value + (event.deltaY < 0 ? 1 : -1))
  );

  if (nextZoom === zoom.value) return;

  const rect = mapRef.value?.getBoundingClientRect();
  if (!rect) return;

  const pointerX = event.clientX - rect.left;
  const pointerY = event.clientY - rect.top;
  const topLeft = getTopLeftWorld();
  const anchor = worldToLatLng(topLeft.x + pointerX, topLeft.y + pointerY);

  zoom.value = nextZoom;

  const anchorWorld = latLngToWorld(anchor.latitude, anchor.longitude);
  setCenterFromWorld(
      anchorWorld.x - pointerX + mapSize.width / 2,
      anchorWorld.y - pointerY + mapSize.height / 2
  );
}

async function stopDrag(event) {
  if (!dragState.active) return;

  const shouldSelect = !dragState.moved;

  dragState.active = false;

  if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  if (shouldSelect) {
    await selectLocationFromPointer(event);
  }
}

async function selectLocationFromPointer(event) {
  const rect = mapRef.value?.getBoundingClientRect();

  if (!rect) return;

  const topLeft = getTopLeftWorld();
  const worldX = topLeft.x + event.clientX - rect.left;
  const worldY = topLeft.y + event.clientY - rect.top;
  const latLng = worldToLatLng(worldX, worldY);

  selectedLocation.value = {
    latitude: latLng.latitude,
    longitude: latLng.longitude,
    name: "",
    address: "",
  };
  statusText.value = "Buscando direccion...";

  const place = await reverseGeocode(latLng.latitude, latLng.longitude);
  const location = {
    latitude: latLng.latitude,
    longitude: latLng.longitude,
    name: place.name || "Ubicacion seleccionada",
    address: place.address || `${latLng.latitude.toFixed(5)}, ${latLng.longitude.toFixed(5)}`,
  };

  selectedLocation.value = location;
  statusText.value = place.address
      ? "Ubicacion seleccionada."
      : "No se encontro un nombre para este punto; puedes ajustar el texto manualmente.";
  emit("select", location);
}

async function reverseGeocode(latitude, longitude) {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(latitude),
      lon: String(longitude),
      addressdetails: "1",
      "accept-language": "es",
    });
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params}`);

    if (!response.ok) {
      throw new Error("reverse geocoding failed");
    }

    const data = await response.json();

    return {
      name: buildPlaceName(data),
      address: data.display_name || "",
    };
  } catch {
    return {
      name: "",
      address: "",
    };
  }
}

function buildPlaceName(data) {
  const address = data.address || {};
  const road = [address.road, address.house_number].filter(Boolean).join(" ");

  return (
      data.name ||
      address.building ||
      address.amenity ||
      road ||
      address.neighbourhood ||
      address.suburb ||
      address.city ||
      data.display_name?.split(",")[0] ||
      ""
  );
}

function getTopLeftWorld() {
  return {
    x: centerWorld.value.x - mapSize.width / 2,
    y: centerWorld.value.y - mapSize.height / 2,
  };
}

function setCenterFromWorld(worldX, worldY) {
  const latLng = worldToLatLng(worldX, worldY);

  center.latitude = latLng.latitude;
  center.longitude = latLng.longitude;
}

function latLngToWorld(latitude, longitude) {
  const sinLatitude = Math.sin(latitude * Math.PI / 180);
  const worldSize = tileSize * tileCount.value;

  return {
    x: (longitude + 180) / 360 * worldSize,
    y: (
      0.5 -
      Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI)
    ) * worldSize,
  };
}

function worldToLatLng(worldX, worldY) {
  const worldSize = tileSize * tileCount.value;
  const longitude = worldX / worldSize * 360 - 180;
  const normalizedY = 0.5 - worldY / worldSize;
  const latitude = 90 - 360 * Math.atan(Math.exp(-normalizedY * 2 * Math.PI)) / Math.PI;

  return {
    latitude,
    longitude,
  };
}
</script>

<style scoped>
.location-picker {
  display: grid;
  gap: 10px;
}

.location-picker__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.location-picker__header h3 {
  color: var(--color-text);
  font-size: 16px;
  font-weight: 900;
  margin: 0 0 4px;
}

.location-picker__header p,
.location-picker__status {
  color: var(--color-text-muted);
  font-size: 13px;
  line-height: 1.45;
  margin: 0;
}

.location-picker__coords {
  flex: 0 0 auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 900;
  padding: 7px 10px;
}

.location-picker__map {
  position: relative;
  height: 280px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #dbeafe;
  cursor: grab;
  overflow: hidden;
  touch-action: none;
}

.location-picker__map--dragging {
  cursor: grabbing;
}

.location-picker__tile {
  position: absolute;
  width: 256px;
  height: 256px;
  user-select: none;
}

.location-picker__center {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(15, 23, 42, 0.3);
  border-radius: 999px;
  pointer-events: none;
  transform: translate(-50%, -50%);
}

.location-picker__marker {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 4px solid #ffffff;
  border-radius: 999px 999px 999px 0;
  background: var(--color-primary);
  box-shadow: 0 10px 22px rgba(37, 99, 235, 0.28);
  pointer-events: none;
  transform: translate(-50%, -100%) rotate(-45deg);
}

.location-picker__attribution {
  position: absolute;
  right: 8px;
  bottom: 8px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 800;
  padding: 4px 7px;
}
</style>
