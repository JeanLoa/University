import { GeoPoint } from './geo-point.model';
import { RouteAlgorithm } from './route-planning.model';

export type RoadRouteStatus =
  | 'waiting-for-points'
  | 'waiting-for-calculation'
  | 'loading'
  | 'ready'
  | 'outside-territory'
  | 'unavailable';

export interface RoadRouteRequest {
  readonly origin: GeoPoint;
  readonly destination: GeoPoint;
  readonly algorithm: RouteAlgorithm;
}

export interface RoadRouteWaypoint {
  readonly label: string;
  readonly point: GeoPoint;
}

export interface RoadRouteStep {
  readonly name: string;
  readonly distanceMeters: number;
  readonly durationSeconds: number;
}

export interface RoadRoute {
  readonly provider: 'python-osm' | 'osrm';
  readonly algorithm: RouteAlgorithm;
  readonly distanceMeters: number;
  readonly durationSeconds: number;
  readonly geometry: readonly GeoPoint[];
  readonly snappedOrigin: RoadRouteWaypoint;
  readonly snappedDestination: RoadRouteWaypoint;
  readonly steps: readonly RoadRouteStep[];
}
