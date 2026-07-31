import { computed, inject, Injectable, signal } from '@angular/core';
import { GeoPoint } from '../../domain/models/geo-point.model';
import {
  MapPlace,
  MapPlaceLookupStatus,
  MapPlaceSearchStatus,
} from '../../domain/models/map-place.model';
import { RoadRoute, RoadRouteStatus } from '../../domain/models/road-route.model';
import {
  AlgorithmOption,
  RouteAlgorithm,
  RoutePointRole,
} from '../../domain/models/route-planning.model';
import { CalculateRoadRouteUseCase } from '../use-cases/calculate-road-route.use-case';
import { ResolveMapPlaceUseCase } from '../use-cases/resolve-map-place.use-case';
import { SearchMapPlacesUseCase } from '../use-cases/search-map-places.use-case';
import {
  buildRouteMapLayerViewModel,
  RouteMapLayerViewModel,
} from '../view-models/route-map-layer.view-model';

@Injectable()
export class RoutePlanningFacade {
  private readonly calculateRoadRoute = inject(CalculateRoadRouteUseCase);
  private readonly resolveMapPlace = inject(ResolveMapPlaceUseCase);
  private readonly searchMapPlaces = inject(SearchMapPlacesUseCase);
  private roadRouteRequestVersion = 0;
  private originPlaceRequestVersion = 0;
  private destinationPlaceRequestVersion = 0;
  private originSearchRequestVersion = 0;
  private destinationSearchRequestVersion = 0;

  readonly algorithmOptions: readonly AlgorithmOption[] = [
    {
      id: 'dijkstra',
      label: 'Dijkstra',
      description: 'Menor distancia',
    },
    {
      id: 'astar',
      label: 'A*',
      description: 'Menor tiempo',
    },
    {
      id: 'bfs',
      label: 'BFS',
      description: 'Menos maniobras',
    },
  ];

  readonly selectedAlgorithm = signal<RouteAlgorithm>('astar');
  readonly autoCalculateRoute = signal(false);
  readonly pickerMode = signal<RoutePointRole>('origin');
  readonly roadRoute = signal<RoadRoute | null>(null);
  readonly roadRouteStatus = signal<RoadRouteStatus>('waiting-for-points');
  readonly roadRouteError = signal('');
  readonly freeOriginPoint = signal<GeoPoint | null>(null);
  readonly freeDestinationPoint = signal<GeoPoint | null>(null);
  readonly originPlace = signal<MapPlace | null>(null);
  readonly destinationPlace = signal<MapPlace | null>(null);
  readonly originPlaceStatus = signal<MapPlaceLookupStatus>('idle');
  readonly destinationPlaceStatus = signal<MapPlaceLookupStatus>('idle');
  readonly originSearchResults = signal<readonly MapPlace[]>([]);
  readonly destinationSearchResults = signal<readonly MapPlace[]>([]);
  readonly originSearchStatus = signal<MapPlaceSearchStatus>('idle');
  readonly destinationSearchStatus = signal<MapPlaceSearchStatus>('idle');
  readonly mapFocusPoint = signal<GeoPoint | null>(null);

  readonly mapLayerViewModel = computed<RouteMapLayerViewModel>(() =>
    buildRouteMapLayerViewModel(this.roadRoute()),
  );

  selectAlgorithm(algorithm: RouteAlgorithm): void {
    this.selectedAlgorithm.set(algorithm);
    this.handleRoadRouteInputChange();
  }

  setAutoCalculateRoute(enabled: boolean): void {
    this.autoCalculateRoute.set(enabled);

    if (enabled) {
      void this.refreshRoadRoute();
      return;
    }

    if (this.roadRouteStatus() === 'loading') {
      this.markRoadRoutePending();
    }
  }

  setPickerMode(role: RoutePointRole): void {
    this.pickerMode.set(role);
  }

  selectMapPoint(point: GeoPoint): void {
    if (this.pickerMode() === 'origin') {
      this.freeOriginPoint.set(point);
      void this.resolveSelectedPlace('origin', point);
      this.pickerMode.set('destination');
    } else {
      this.freeDestinationPoint.set(point);
      void this.resolveSelectedPlace('destination', point);
    }

    this.roadRouteError.set('');
    this.handleRoadRouteInputChange();
  }

  async searchPlaces(role: RoutePointRole, query: string): Promise<void> {
    const normalizedQuery = query.trim();
    const requestVersion =
      role === 'origin'
        ? this.originSearchRequestVersion + 1
        : this.destinationSearchRequestVersion + 1;

    if (role === 'origin') {
      this.originSearchRequestVersion = requestVersion;
    } else {
      this.destinationSearchRequestVersion = requestVersion;
    }

    if (normalizedQuery.length < 3) {
      this.setSearchState(role, [], 'idle');
      return;
    }

    this.setSearchState(role, [], 'loading');

    try {
      const places = await this.searchMapPlaces.execute(normalizedQuery);

      if (!this.isCurrentSearchRequest(role, requestVersion)) {
        return;
      }

      this.setSearchState(role, places, places.length > 0 ? 'ready' : 'empty');
    } catch {
      if (this.isCurrentSearchRequest(role, requestVersion)) {
        this.setSearchState(role, [], 'unavailable');
      }
    }
  }

  selectSearchPlace(role: RoutePointRole, place: MapPlace): void {
    if (role === 'origin') {
      this.freeOriginPoint.set(place.point);
      this.originPlace.set(place);
      this.originPlaceStatus.set('ready');
      this.originSearchResults.set([]);
      this.originSearchStatus.set('idle');
      this.pickerMode.set('destination');
    } else {
      this.freeDestinationPoint.set(place.point);
      this.destinationPlace.set(place);
      this.destinationPlaceStatus.set('ready');
      this.destinationSearchResults.set([]);
      this.destinationSearchStatus.set('idle');
    }

    this.mapFocusPoint.set({ ...place.point });
    this.roadRouteError.set('');
    this.handleRoadRouteInputChange();
  }

  async refreshRoadRoute(): Promise<void> {
    const origin = this.freeOriginPoint();
    const destination = this.freeDestinationPoint();
    const requestVersion = this.roadRouteRequestVersion + 1;

    this.roadRouteRequestVersion = requestVersion;

    if (!origin || !destination) {
      this.roadRoute.set(null);
      this.roadRouteStatus.set('waiting-for-points');
      this.roadRouteError.set('');
      return;
    }

    this.roadRouteStatus.set('loading');
    this.roadRouteError.set('');

    try {
      const route = await this.calculateRoadRoute.execute({
        origin,
        destination,
        algorithm: this.selectedAlgorithm(),
      });

      if (requestVersion !== this.roadRouteRequestVersion) {
        return;
      }

      if (!route) {
        this.roadRoute.set(null);
        this.roadRouteStatus.set('unavailable');
        this.roadRouteError.set('No se pudo resolver una ruta vial para esos puntos.');
        return;
      }

      this.roadRoute.set(route);
      this.roadRouteStatus.set('ready');
    } catch {
      if (requestVersion !== this.roadRouteRequestVersion) {
        return;
      }

      this.roadRoute.set(null);
      this.roadRouteStatus.set('unavailable');
      this.roadRouteError.set('El motor vial no respondio. Intenta de nuevo.');
    }
  }

  private handleRoadRouteInputChange(): void {
    if (this.autoCalculateRoute()) {
      void this.refreshRoadRoute();
      return;
    }

    this.markRoadRoutePending();
  }

  private markRoadRoutePending(): void {
    const origin = this.freeOriginPoint();
    const destination = this.freeDestinationPoint();

    this.roadRouteRequestVersion += 1;
    this.roadRoute.set(null);
    this.roadRouteError.set('');
    this.roadRouteStatus.set(
      origin && destination ? 'waiting-for-calculation' : 'waiting-for-points',
    );
  }

  private async resolveSelectedPlace(role: RoutePointRole, point: GeoPoint): Promise<void> {
    const requestVersion =
      role === 'origin'
        ? this.originPlaceRequestVersion + 1
        : this.destinationPlaceRequestVersion + 1;

    if (role === 'origin') {
      this.originPlaceRequestVersion = requestVersion;
      this.originPlaceStatus.set('loading');
    } else {
      this.destinationPlaceRequestVersion = requestVersion;
      this.destinationPlaceStatus.set('loading');
    }

    try {
      const place = await this.resolveMapPlace.execute(point);
      const isCurrentRequest =
        role === 'origin'
          ? requestVersion === this.originPlaceRequestVersion
          : requestVersion === this.destinationPlaceRequestVersion;

      if (!isCurrentRequest) {
        return;
      }

      if (role === 'origin') {
        this.originPlace.set(place ?? this.fallbackPlace(point));
        this.originPlaceStatus.set(place ? 'ready' : 'unavailable');
      } else {
        this.destinationPlace.set(place ?? this.fallbackPlace(point));
        this.destinationPlaceStatus.set(place ? 'ready' : 'unavailable');
      }
    } catch {
      if (role === 'origin') {
        if (requestVersion === this.originPlaceRequestVersion) {
          this.originPlace.set(this.fallbackPlace(point));
          this.originPlaceStatus.set('unavailable');
        }
      } else if (requestVersion === this.destinationPlaceRequestVersion) {
        this.destinationPlace.set(this.fallbackPlace(point));
        this.destinationPlaceStatus.set('unavailable');
      }
    }
  }

  private fallbackPlace(point: GeoPoint): MapPlace {
    return {
      label: `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`,
      country: 'Ubicacion global',
      point,
    };
  }

  private setSearchState(
    role: RoutePointRole,
    results: readonly MapPlace[],
    status: MapPlaceSearchStatus,
  ): void {
    if (role === 'origin') {
      this.originSearchResults.set(results);
      this.originSearchStatus.set(status);
      return;
    }

    this.destinationSearchResults.set(results);
    this.destinationSearchStatus.set(status);
  }

  private isCurrentSearchRequest(role: RoutePointRole, requestVersion: number): boolean {
    return role === 'origin'
      ? requestVersion === this.originSearchRequestVersion
      : requestVersion === this.destinationSearchRequestVersion;
  }
}
