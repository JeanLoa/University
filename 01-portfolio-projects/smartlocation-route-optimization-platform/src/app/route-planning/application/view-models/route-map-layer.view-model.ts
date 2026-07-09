import { GeoPoint } from '../../domain/models/geo-point.model';
import { RoadRoute } from '../../domain/models/road-route.model';
import { GeoJsonFeatureCollection } from './map-geojson-layer.view-model';

export interface RouteMapLayerViewModel {
  readonly route: GeoJsonFeatureCollection;
}

export function buildRouteMapLayerViewModel(
  roadRoute: RoadRoute | null = null,
): RouteMapLayerViewModel {
  return {
    route: {
      type: 'FeatureCollection',
      features: routeFeaturesFor(roadRoute),
    },
  };
}

function routeFeaturesFor(roadRoute: RoadRoute | null): GeoJsonFeatureCollection['features'] {
  if (roadRoute && roadRoute.geometry.length > 1) {
    return [
      {
        type: 'Feature',
        id: 'road-route',
        geometry: {
          type: 'LineString',
          coordinates: toLineString(roadRoute.geometry),
        },
        properties: {
          algorithm: roadRoute.algorithm,
          criterion: 'driving',
          label: routeLabelFor(roadRoute),
          reachable: true,
        },
      },
    ];
  }

  return [];
}

function routeLabelFor(roadRoute: RoadRoute): string {
  const routeNames = roadRoute.steps
    .map((step) => step.name.trim())
    .filter((name) => name && name !== 'Via sin nombre')
    .filter((name, index, names) => names.indexOf(name) === index)
    .slice(0, 3);

  return routeNames.length > 0 ? routeNames.join(' / ') : 'Ruta vial';
}

function toLineString(points: readonly GeoPoint[]): readonly (readonly number[])[] {
  return points.map((point) => [point.longitude, point.latitude]);
}
