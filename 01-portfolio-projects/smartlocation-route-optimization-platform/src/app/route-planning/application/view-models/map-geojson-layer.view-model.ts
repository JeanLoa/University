export type GeoJsonGeometryType = 'Point' | 'LineString' | 'Polygon';

export interface GeoJsonFeatureCollection {
  readonly type: 'FeatureCollection';
  readonly features: readonly GeoJsonFeature[];
}

export interface GeoJsonFeature {
  readonly type: 'Feature';
  readonly id: string;
  readonly geometry: GeoJsonGeometry;
  readonly properties: Record<string, string | number | boolean>;
}

export type GeoJsonFeatureCoordinates = readonly number[] | readonly (readonly number[])[] | readonly (readonly (readonly number[])[])[];

export interface GeoJsonGeometry {
  readonly type: GeoJsonGeometryType;
  readonly coordinates: GeoJsonFeatureCoordinates;
}

