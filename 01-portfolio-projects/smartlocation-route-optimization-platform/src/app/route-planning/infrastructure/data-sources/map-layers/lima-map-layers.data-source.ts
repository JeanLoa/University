import limaMapLayersResource from '../../resources/map-layers/lima-map-layers.resource.json';
import limaDistrictsResource from '../../resources/map-layers/lima-districts.resource.json';
import limaBoundariesResource from '../../resources/map-layers/lima-boundaries.resource.json';
import { MapLayerCatalog } from '../../../domain/models/map-territory.model';
import {
  LimaBoundariesResource,
  LimaMapLayersResource,
  MapBoundaryResource,
  MapTerritoryResource,
} from '../../resources/map-layers/lima-map-layers.resource';

const LIMA_PROVINCE_BOUNDS = {
  north: -11.56,
  south: -12.53,
  east: -76.43,
  west: -77.25,
};

const LIMA_PROVINCE_RELATION_ID = 1944670;

const baseMapLayers = limaMapLayersResource as LimaMapLayersResource;
const limaDistricts = limaDistrictsResource as readonly MapTerritoryResource[];
const limaBoundaries = limaBoundariesResource as LimaBoundariesResource;
const boundaryByTerritoryId = new Map<string, MapBoundaryResource>(
  limaBoundaries.boundaries.map((boundary) => [boundary.territoryId, boundary]),
);

const withLocalBoundary = (territory: MapTerritoryResource): MapTerritoryResource => {
  const boundary = boundaryByTerritoryId.get(territory.id);

  if (!boundary) {
    return territory;
  }

  return {
    ...territory,
    bounds: boundary.bounds,
    boundarySource: {
      provider: 'openstreetmap' as const,
      relationId: boundary.relationId,
      queryName: territory.boundarySource?.queryName,
      parentRelationId: territory.boundarySource?.parentRelationId,
      sourceUrl: boundary.sourceUrl,
    },
    polygon: boundary.polygon,
  };
};

export const LIMA_MAP_LAYERS: MapLayerCatalog = {
  territories: [
    ...baseMapLayers.territories
      .filter((territory) => territory.kind !== 'district')
      .map((territory) =>
        territory.id === 'lima-province'
          ? {
              ...territory,
              bounds: LIMA_PROVINCE_BOUNDS,
              boundarySource: {
                provider: 'openstreetmap' as const,
                relationId: LIMA_PROVINCE_RELATION_ID,
                sourceUrl: `https://www.openstreetmap.org/relation/${LIMA_PROVINCE_RELATION_ID}`,
              },
            }
          : {
              ...territory,
              bounds: LIMA_PROVINCE_BOUNDS,
            },
      )
      .map(withLocalBoundary),
    ...limaDistricts.map(withLocalBoundary),
  ],
};
