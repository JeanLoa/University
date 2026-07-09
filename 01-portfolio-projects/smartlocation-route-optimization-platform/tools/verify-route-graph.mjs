import { readFile } from 'node:fs/promises';

const resourcePath = new URL(
  '../src/app/route-planning/infrastructure/resources/lima-route-graph.resource.json',
  import.meta.url,
);
const mapLayersPath = new URL(
  '../src/app/route-planning/infrastructure/resources/map-layers/lima-map-layers.resource.json',
  import.meta.url,
);
const districtsPath = new URL(
  '../src/app/route-planning/infrastructure/resources/map-layers/lima-districts.resource.json',
  import.meta.url,
);
const resource = JSON.parse(await readFile(resourcePath, 'utf8'));
const baseMapLayers = JSON.parse(await readFile(mapLayersPath, 'utf8'));
const limaDistricts = JSON.parse(await readFile(districtsPath, 'utf8'));
const mapLayers = {
  ...baseMapLayers,
  territories: [
    ...baseMapLayers.territories.filter((territory) => territory.kind !== 'district'),
    ...limaDistricts,
  ],
};
const errors = [];
const nodeIds = new Set();
const nodesById = new Map();
const nodeDistrictIds = new Set();

if (!resource.metadata?.sourceNotebook) {
  errors.push('Missing source notebook metadata.');
}

for (const node of resource.nodes ?? []) {
  if (nodeIds.has(node.id)) {
    errors.push(`Duplicate node id: ${node.id}`);
  }

  nodeIds.add(node.id);
  nodesById.set(node.id, node);
  nodeDistrictIds.add(node.districtId);

  if (!Number.isFinite(node.point?.latitude) || !Number.isFinite(node.point?.longitude)) {
    errors.push(`Invalid coordinates for node: ${node.id}`);
  }

  if (!node.districtId) {
    errors.push(`Missing district id for node: ${node.id}`);
  }
}

for (const edge of resource.edges ?? []) {
  if (!nodeIds.has(edge.from)) {
    errors.push(`Edge ${edge.id} references missing origin node ${edge.from}.`);
  }

  if (!nodeIds.has(edge.to)) {
    errors.push(`Edge ${edge.id} references missing destination node ${edge.to}.`);
  }

  if (!Number.isFinite(edge.distanceMeters) || edge.distanceMeters <= 0) {
    errors.push(`Edge ${edge.id} has invalid distance.`);
  }

  if (edge.travelTimeSeconds !== undefined && (!Number.isFinite(edge.travelTimeSeconds) || edge.travelTimeSeconds <= 0)) {
    errors.push(`Edge ${edge.id} has invalid travel time.`);
  }

  if (edge.path !== undefined) {
    if (!Array.isArray(edge.path) || edge.path.length < 2) {
      errors.push(`Edge ${edge.id} path needs at least two coordinates.`);
    }

    const fromNode = nodesById.get(edge.from);
    const toNode = nodesById.get(edge.to);
    const firstPoint = edge.path[0];
    const lastPoint = edge.path.at(-1);

    if (fromNode && firstPoint && !isNearPoint(fromNode.point, firstPoint)) {
      errors.push(`Edge ${edge.id} path does not start near origin node.`);
    }

    if (toNode && lastPoint && !isNearPoint(toNode.point, lastPoint)) {
      errors.push(`Edge ${edge.id} path does not end near destination node.`);
    }
  }
}

const reachable = canReach(
  resource.edges,
  resource.notebookBenchmark?.origin ? 'san-miguel-origin' : resource.nodes?.[0]?.id,
  resource.notebookBenchmark?.destination ? 'jesus-maria-destination' : resource.nodes?.at(-1)?.id,
);

if (!reachable) {
  errors.push('Notebook origin and destination anchors are not connected.');
}

const territoryIds = new Set();
const nodesByDistrictId = new Map();

for (const territory of mapLayers.territories ?? []) {
  territoryIds.add(territory.id);

  if (!territory.label || !territory.kind) {
    errors.push(`Invalid territory: ${territory.id}`);
  }

  if (
    !Number.isFinite(territory.bounds?.north) ||
    !Number.isFinite(territory.bounds?.south) ||
    !Number.isFinite(territory.bounds?.east) ||
    !Number.isFinite(territory.bounds?.west) ||
    territory.bounds.north <= territory.bounds.south ||
    territory.bounds.east <= territory.bounds.west
  ) {
    errors.push(`Invalid bounds for territory: ${territory.id}`);
  }

  if (territory.polygon !== undefined) {
    errors.push(`Territory ${territory.id} has a local polygon. Use a boundarySource instead of a hand-drawn border.`);
  }

  if (territory.kind === 'district') {
    if (territory.boundarySource?.provider !== 'openstreetmap') {
      errors.push(`District ${territory.id} needs an OpenStreetMap boundarySource.`);
    }

    if (
      !Number.isFinite(territory.boundarySource?.relationId) &&
      (!territory.boundarySource?.queryName || !Number.isFinite(territory.boundarySource?.parentRelationId))
    ) {
      errors.push(`District ${territory.id} needs a relation id or a scoped OpenStreetMap query name.`);
    }

    if (!territory.boundarySource?.sourceUrl) {
      errors.push(`District ${territory.id} needs a source URL.`);
    }
  }
}

for (const territory of mapLayers.territories ?? []) {
  if (territory.parentId && !territoryIds.has(territory.parentId)) {
    errors.push(`Territory ${territory.id} references missing parent ${territory.parentId}.`);
  }
}

for (const districtId of nodeDistrictIds) {
  if (!territoryIds.has(districtId)) {
    errors.push(`Node references missing district ${districtId}.`);
  }
}

for (const node of resource.nodes ?? []) {
  const districtNodes = nodesByDistrictId.get(node.districtId) ?? [];
  districtNodes.push(node);
  nodesByDistrictId.set(node.districtId, districtNodes);
}

for (const districtId of nodeDistrictIds) {
  const nodes = nodesByDistrictId.get(districtId) ?? [];

  if (nodes.length < 2) {
    errors.push(`District ${districtId} with route coverage needs at least two selectable route nodes.`);
  }
}

for (const street of mapLayers.streets ?? []) {
  if (!street.path || street.path.length < 2) {
    errors.push(`Street ${street.id} needs at least two coordinates.`);
  }

  for (const districtId of street.districtIds ?? []) {
    if (!territoryIds.has(districtId)) {
      errors.push(`Street ${street.id} references missing district ${districtId}.`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(
  `Route graph resource OK: ${resource.nodes.length} nodes, ${resource.edges.length} edges, ${mapLayers.territories.length} territories, ${mapLayers.streets.length} streets, source ${resource.metadata.sourceNodeCount}/${resource.metadata.sourceEdgeCount}.`,
);

function canReach(edges, originNodeId, destinationNodeId) {
  const adjacency = new Map();

  for (const edge of edges) {
    pushNeighbor(adjacency, edge.from, edge.to);

    if (edge.bidirectional) {
      pushNeighbor(adjacency, edge.to, edge.from);
    }
  }

  const queue = [originNodeId];
  const visited = new Set(queue);

  while (queue.length > 0) {
    const nodeId = queue.shift();

    if (nodeId === destinationNodeId) {
      return true;
    }

    for (const neighbor of adjacency.get(nodeId) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return false;
}

function pushNeighbor(adjacency, from, to) {
  const neighbors = adjacency.get(from) ?? [];
  neighbors.push(to);
  adjacency.set(from, neighbors);
}

function isNearPoint(left, right) {
  return Math.abs(left.latitude - right.latitude) < 0.0025 && Math.abs(left.longitude - right.longitude) < 0.0025;
}
