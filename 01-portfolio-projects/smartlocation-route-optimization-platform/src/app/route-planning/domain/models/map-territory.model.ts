import { GeoPoint } from './geo-point.model';

export type TerritoryKind = 'metropolitan-area' | 'province' | 'district';

export type BoundaryProvider = 'openstreetmap';

export interface GeoBounds {
  readonly north: number;
  readonly south: number;
  readonly east: number;
  readonly west: number;
}

export interface MapBoundarySource {
  readonly provider: BoundaryProvider;
  readonly relationId?: number;
  readonly parentRelationId?: number;
  readonly queryName?: string;
  readonly sourceUrl: string;
}

export interface MapTerritory {
  readonly id: string;
  readonly parentId?: string;
  readonly label: string;
  readonly kind: TerritoryKind;
  readonly center: GeoPoint;
  readonly bounds: GeoBounds;
  readonly boundarySource?: MapBoundarySource;
  readonly polygon?: readonly GeoPoint[];
}

export interface MapLayerCatalog {
  readonly territories: readonly MapTerritory[];
}
