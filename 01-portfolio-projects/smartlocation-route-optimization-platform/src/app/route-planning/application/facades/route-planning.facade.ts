import { computed, inject, Injectable, signal } from '@angular/core';
import {
  AlgorithmOption,
  RouteAlgorithm,
  RoutePointRole,
} from '../../domain/models/route-planning.model';
import { GeoPoint } from '../../domain/models/geo-point.model';
import { MapPlace, MapPlaceLookupStatus } from '../../domain/models/map-place.model';
import { RoadRoute, RoadRouteStatus } from '../../domain/models/road-route.model';
import {
  MapBoundarySource,
  MapLayerCatalog,
  MapTerritory,
} from '../../domain/models/map-territory.model';
import { MAP_BOUNDARY_REPOSITORY } from '../../domain/repositories/map-boundary.repository';
import { isPointInsidePolygon } from '../../domain/services/geo-polygon.service';
import { LIMA_MAP_LAYERS } from '../../infrastructure/data-sources/map-layers/lima-map-layers.data-source';
import { CalculateRoadRouteUseCase } from '../use-cases/calculate-road-route.use-case';
import { ResolveMapPlaceUseCase } from '../use-cases/resolve-map-place.use-case';
import {
  buildRouteMapLayerViewModel,
  RouteMapLayerViewModel,
} from '../view-models/route-map-layer.view-model';

@Injectable()
export class RoutePlanningFacade {
  private readonly boundaryRepository = inject(MAP_BOUNDARY_REPOSITORY);
  private readonly calculateRoadRoute = inject(CalculateRoadRouteUseCase);
  private readonly resolveMapPlace = inject(ResolveMapPlaceUseCase);
  private readonly boundaryLoadQueue = new Set<string>();
  private roadRouteRequestVersion = 0;
  private originPlaceRequestVersion = 0;
  private destinationPlaceRequestVersion = 0;

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

  readonly mapLayers = signal<MapLayerCatalog>(LIMA_MAP_LAYERS);
  readonly selectedProvinceId = signal('lima-province');
  readonly selectedDistrictId = signal('');
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

  readonly provinceOptions = computed(() =>
    this.mapLayers().territories.filter((territory) => territory.kind === 'province'),
  );

  readonly districtOptions = computed(() =>
    this.mapLayers().territories.filter(
      (territory) => territory.parentId === this.selectedProvinceId(),
    ),
  );

  readonly selectedMapTerritory = computed<MapTerritory>(() => {
    const district = this.mapLayers().territories.find(
      (territory) => territory.id === this.selectedDistrictId(),
    );

    if (district) {
      return district;
    }

    return (
      this.mapLayers().territories.find(
        (territory) => territory.id === this.selectedProvinceId(),
      ) ?? this.mapLayers().territories[0]
    );
  });

  readonly mapLayerViewModel = computed<RouteMapLayerViewModel>(() =>
    buildRouteMapLayerViewModel(this.roadRoute()),
  );

  readonly selectedMapTrail = computed(() => {
    const territory = this.selectedMapTerritory();
    const territories = this.mapLayers().territories;
    const parent = territory.parentId
      ? territories.find((candidate) => candidate.id === territory.parentId)
      : undefined;
    const root = parent?.parentId
      ? territories.find((candidate) => candidate.id === parent.parentId)
      : undefined;

    return [root?.label, parent?.label, territory.label].filter(Boolean).join(' / ');
  });

  readonly focusMapTerritories = computed(() => {
    const territory = this.selectedMapTerritory();

    if (this.isAllDistrictsSelected()) {
      if (this.hasRealBoundary(territory)) {
        return [territory];
      }

      return [];
    }

    if (this.hasRealBoundary(territory)) {
      return [territory];
    }

    if (territory.kind === 'district') {
      return [];
    }

    return this.mapLayers().territories.filter(
      (candidate) => candidate.parentId === territory.id && this.hasRealBoundary(candidate),
    );
  });

  constructor() {
    void this.loadSelectedBoundaryScope().then(() => {
      void this.ensureRoadPointsInsideSelectedTerritory();
    });
  }

  selectProvince(provinceId: string): void {
    this.selectedProvinceId.set(provinceId);
    this.selectedDistrictId.set('');
    void this.loadSelectedBoundaryScope().then(() => {
      void this.ensureRoadPointsInsideSelectedTerritory();
    });
  }

  selectDistrict(districtId: string): void {
    this.selectedDistrictId.set(districtId);
    void this.loadSelectedBoundaryScope().then(() => {
      void this.ensureRoadPointsInsideSelectedTerritory();
    });
  }

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
    if (!this.isPointInsideSelectedTerritory(point)) {
      this.invalidateRoadRoute(
        'outside-territory',
        'El punto debe estar dentro del contorno seleccionado.',
      );
      return;
    }

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

    if (
      !this.isPointInsideSelectedTerritory(origin) ||
      !this.isPointInsideSelectedTerritory(destination)
    ) {
      this.roadRoute.set(null);
      this.roadRouteStatus.set('outside-territory');
      this.roadRouteError.set('Origen y destino deben estar dentro del contorno seleccionado.');
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

      if (!this.isRouteInsideSelectedTerritory(route.geometry)) {
        this.roadRoute.set(null);
        this.roadRouteStatus.set('outside-territory');
        this.roadRouteError.set('La ruta vial sale del contorno seleccionado.');
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

  private isPointInsideSelectedTerritory(point: GeoPoint): boolean {
    const territory = this.selectedMapTerritory();

    if (this.isAllDistrictsSelected()) {
      return this.isPointInsideProvinceDistrictScope(point);
    }

    if (!this.hasRealBoundary(territory)) {
      return this.isPointInsideBounds(point, territory.bounds);
    }

    return isPointInsidePolygon(point, territory.polygon ?? []);
  }

  private isRouteInsideSelectedTerritory(points: readonly GeoPoint[]): boolean {
    return points.every((point) => this.isPointInsideSelectedTerritory(point));
  }

  private async ensureRoadPointsInsideSelectedTerritory(): Promise<void> {
    const origin = this.freeOriginPoint();
    const destination = this.freeDestinationPoint();
    const originIsValid = !origin || this.isPointInsideSelectedTerritory(origin);
    const destinationIsValid = !destination || this.isPointInsideSelectedTerritory(destination);

    if (!originIsValid || !destinationIsValid) {
      if (!originIsValid) {
        this.freeOriginPoint.set(null);
        this.originPlace.set(null);
        this.originPlaceStatus.set('idle');
      }

      if (!destinationIsValid) {
        this.freeDestinationPoint.set(null);
        this.destinationPlace.set(null);
        this.destinationPlaceStatus.set('idle');
      }

      this.invalidateRoadRoute(
        'waiting-for-points',
        'Se limpiaron puntos fuera del contorno seleccionado.',
      );
      return;
    }

    if (this.autoCalculateRoute()) {
      await this.refreshRoadRoute();
      return;
    }

    this.markRoadRoutePending();
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

    if (!origin || !destination) {
      this.roadRouteStatus.set('waiting-for-points');
      return;
    }

    if (
      !this.isPointInsideSelectedTerritory(origin) ||
      !this.isPointInsideSelectedTerritory(destination)
    ) {
      this.roadRouteStatus.set('outside-territory');
      this.roadRouteError.set('Origen y destino deben estar dentro del contorno seleccionado.');
      return;
    }

    this.roadRouteStatus.set('waiting-for-calculation');
  }

  private invalidateRoadRoute(status: RoadRouteStatus, error = ''): void {
    this.roadRouteRequestVersion += 1;
    this.roadRoute.set(null);
    this.roadRouteStatus.set(status);
    this.roadRouteError.set(error);
  }

  private isPointInsideProvinceDistrictScope(point: GeoPoint): boolean {
    const districts = this.districtOptions();

    return districts.some((district) =>
      this.hasRealBoundary(district)
        ? isPointInsidePolygon(point, district.polygon ?? [])
        : this.isPointInsideBounds(point, district.bounds),
    );
  }

  private isPointInsideBounds(point: GeoPoint, bounds: MapTerritory['bounds']): boolean {
    return (
      point.latitude <= bounds.north &&
      point.latitude >= bounds.south &&
      point.longitude <= bounds.east &&
      point.longitude >= bounds.west
    );
  }

  private isAllDistrictsSelected(): boolean {
    return this.selectedDistrictId() === '';
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
    const territory = this.selectedMapTerritory();

    return {
      label: territory.label,
      district: territory.kind === 'district' ? territory.label : undefined,
      city: territory.kind === 'district' ? 'Lima' : territory.label,
      province: 'Lima',
      country: 'Peru',
      point,
    };
  }

  private async loadTerritoryBoundary(territory: MapTerritory): Promise<void> {
    const currentTerritory = this.mapLayers().territories.find(
      (candidate) => candidate.id === territory.id,
    );

    if (currentTerritory && this.hasRealBoundary(currentTerritory)) {
      return;
    }

    const source = territory.boundarySource;
    const sourceKey = source ? this.boundarySourceKey(source) : '';

    if (!source || this.boundaryLoadQueue.has(sourceKey)) {
      return;
    }

    this.boundaryLoadQueue.add(sourceKey);

    try {
      const polygon = await this.boundaryRepository.findBoundary(source);

      if (polygon.length < 3) {
        return;
      }

      this.mapLayers.update((catalog) => ({
        ...catalog,
        territories: catalog.territories.map((candidate) =>
          candidate.id === territory.id
            ? {
                ...candidate,
                polygon,
              }
            : candidate,
        ),
      }));
    } finally {
      this.boundaryLoadQueue.delete(sourceKey);
    }
  }

  private async loadSelectedBoundaryScope(): Promise<void> {
    const territory = this.selectedMapTerritory();

    await this.loadTerritoryBoundary(territory);
  }

  private boundarySourceKey(source: MapBoundarySource): string {
    return source.relationId
      ? `relation:${source.relationId}`
      : `query:${source.parentRelationId ?? 'global'}:${source.queryName ?? ''}`;
  }

  private hasRealBoundary(territory: MapTerritory): boolean {
    return Boolean(territory.polygon && territory.polygon.length >= 3);
  }
}
