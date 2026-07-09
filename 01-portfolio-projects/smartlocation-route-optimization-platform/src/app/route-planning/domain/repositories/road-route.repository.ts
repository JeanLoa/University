import { InjectionToken } from '@angular/core';
import { RoadRoute, RoadRouteRequest } from '../models/road-route.model';

export interface RoadRouteRepository {
  findRoute(request: RoadRouteRequest): Promise<RoadRoute | null>;
}

export const ROAD_ROUTE_REPOSITORY = new InjectionToken<RoadRouteRepository>('ROAD_ROUTE_REPOSITORY');
