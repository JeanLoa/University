import {
  GeoBounds,
  MapBoundarySource,
  TerritoryKind,
} from '../../../domain/models/map-territory.model';
import { GeoPoint } from '../../../domain/models/geo-point.model';

export interface LimaMapLayersResource {
  readonly territories: readonly MapTerritoryResource[];
}

export interface LimaBoundariesResource {
  readonly generatedAt: string;
  readonly source: string;
  readonly license: string;
  readonly boundaries: readonly MapBoundaryResource[];
}

export interface MapBoundaryResource {
  readonly territoryId: string;
  readonly relationId: number;
  readonly label: string;
  readonly sourceKey: string;
  readonly sourceUrl: string;
  readonly bounds: GeoBounds;
  readonly polygon: readonly GeoPoint[];
}

export interface MapTerritoryResource {
  readonly id: string;
  readonly parentId?: string;
  readonly label: string;
  readonly kind: TerritoryKind;
  readonly center: GeoPoint;
  readonly bounds: GeoBounds;
  readonly boundarySource?: MapBoundarySource;
  readonly polygon?: readonly GeoPoint[];
}
