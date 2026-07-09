import { inject, Injectable } from '@angular/core';
import { RoadRoute, RoadRouteRequest } from '../../domain/models/road-route.model';
import { ROAD_ROUTE_REPOSITORY } from '../../domain/repositories/road-route.repository';

@Injectable()
export class CalculateRoadRouteUseCase {
  private readonly routeRepository = inject(ROAD_ROUTE_REPOSITORY);

  execute(request: RoadRouteRequest): Promise<RoadRoute | null> {
    return this.routeRepository.findRoute(request);
  }
}
