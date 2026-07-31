import { GeoPoint } from './geo-point.model';

export type MapPlaceLookupStatus = 'idle' | 'loading' | 'ready' | 'unavailable';

export type MapPlaceSearchStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'unavailable';

export interface MapPlace {
  readonly label: string;
  readonly road?: string;
  readonly district?: string;
  readonly city?: string;
  readonly province?: string;
  readonly region?: string;
  readonly country?: string;
  readonly point: GeoPoint;
}
