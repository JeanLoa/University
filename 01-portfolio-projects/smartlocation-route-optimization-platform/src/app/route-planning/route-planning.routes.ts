import { Routes } from '@angular/router';
import { CalculateRoadRouteUseCase } from './application/use-cases/calculate-road-route.use-case';
import { ResolveMapPlaceUseCase } from './application/use-cases/resolve-map-place.use-case';
import { SearchMapPlacesUseCase } from './application/use-cases/search-map-places.use-case';
import { RoutePlanningFacade } from './application/facades/route-planning.facade';
import { MAP_PLACE_REPOSITORY } from './domain/repositories/map-place.repository';
import { ROAD_ROUTE_REPOSITORY } from './domain/repositories/road-route.repository';
import { NominatimMapPlaceRepository } from './infrastructure/repositories/nominatim-map-place.repository';
import { OsrmDrivingRouteRepository } from './infrastructure/repositories/osrm-driving-route.repository';

export const ROUTE_PLANNING_ROUTES: Routes = [
  {
    path: '',
    providers: [
      RoutePlanningFacade,
      CalculateRoadRouteUseCase,
      ResolveMapPlaceUseCase,
      SearchMapPlacesUseCase,
      {
        provide: MAP_PLACE_REPOSITORY,
        useClass: NominatimMapPlaceRepository,
      },
      {
        provide: ROAD_ROUTE_REPOSITORY,
        useClass: OsrmDrivingRouteRepository,
      },
    ],
    loadComponent: () =>
      import('./presentation/pages/route-planner-page/route-planner-page.component').then(
        (component) => component.RoutePlannerPageComponent,
      ),
  },
];
