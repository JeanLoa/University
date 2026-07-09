import { InjectionToken } from '@angular/core';
import { GeoPoint } from '../models/geo-point.model';
import { MapPlace } from '../models/map-place.model';

export interface MapPlaceRepository {
  findPlace(point: GeoPoint): Promise<MapPlace | null>;
}

export const MAP_PLACE_REPOSITORY = new InjectionToken<MapPlaceRepository>('MAP_PLACE_REPOSITORY');
