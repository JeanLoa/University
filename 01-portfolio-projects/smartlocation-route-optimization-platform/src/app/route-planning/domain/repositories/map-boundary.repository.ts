import { InjectionToken } from '@angular/core';
import { GeoPoint } from '../models/geo-point.model';
import { MapBoundarySource } from '../models/map-territory.model';

export interface MapBoundaryRepository {
  findBoundary(source: MapBoundarySource): Promise<readonly GeoPoint[]>;
}

export const MAP_BOUNDARY_REPOSITORY = new InjectionToken<MapBoundaryRepository>('MapBoundaryRepository');
