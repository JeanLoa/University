import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import {
  AlgorithmOption,
  RouteAlgorithm,
  RouteMapScope,
  RoutePointRole,
} from '../../../domain/models/route-planning.model';
import { GeoPoint } from '../../../domain/models/geo-point.model';
import {
  MapPlace,
  MapPlaceLookupStatus,
  MapPlaceSearchStatus,
} from '../../../domain/models/map-place.model';
import { RoadRouteStatus } from '../../../domain/models/road-route.model';
import { MapTerritory } from '../../../domain/models/map-territory.model';
import {
  UiSelectComponent,
  UiSelectOption,
} from '../../../../shared/presentation/components/ui-select/ui-select.component';

@Component({
  selector: 'app-route-control-panel',
  imports: [UiSelectComponent],
  templateUrl: './route-control-panel.component.html',
  styleUrl: './route-control-panel.component.css',
})
export class RouteControlPanelComponent implements OnDestroy {
  protected readonly searchRoles: readonly RoutePointRole[] = ['origin', 'destination'];

  @Input() mapScope: RouteMapScope = 'global';
  @Input() selectedAlgorithm: RouteAlgorithm = 'astar';
  @Input() autoCalculateRoute = false;
  @Input() pickerMode: RoutePointRole = 'destination';
  @Input() algorithmOptions: readonly AlgorithmOption[] = [];
  @Input() provinceOptions: readonly MapTerritory[] = [];
  @Input() districtOptions: readonly MapTerritory[] = [];
  @Input() selectedProvinceId = '';
  @Input() selectedDistrictId = '';
  @Input() freeOriginPoint: GeoPoint | null = null;
  @Input() freeDestinationPoint: GeoPoint | null = null;
  @Input() originPlace: MapPlace | null = null;
  @Input() destinationPlace: MapPlace | null = null;
  @Input() originPlaceStatus: MapPlaceLookupStatus = 'idle';
  @Input() destinationPlaceStatus: MapPlaceLookupStatus = 'idle';
  @Input() originSearchResults: readonly MapPlace[] = [];
  @Input() destinationSearchResults: readonly MapPlace[] = [];
  @Input() originSearchStatus: MapPlaceSearchStatus = 'idle';
  @Input() destinationSearchStatus: MapPlaceSearchStatus = 'idle';
  @Input() roadRouteStatus: RoadRouteStatus = 'waiting-for-points';
  @Input() roadRouteError = '';

  @Output() mapScopeChanged = new EventEmitter<RouteMapScope>();
  @Output() provinceChanged = new EventEmitter<string>();
  @Output() districtChanged = new EventEmitter<string>();
  @Output() algorithmChanged = new EventEmitter<RouteAlgorithm>();
  @Output() autoCalculateChanged = new EventEmitter<boolean>();
  @Output() pickerModeChanged = new EventEmitter<RoutePointRole>();
  @Output() placeSearchRequested = new EventEmitter<{
    readonly role: RoutePointRole;
    readonly query: string;
  }>();
  @Output() placeSelected = new EventEmitter<{
    readonly role: RoutePointRole;
    readonly place: MapPlace;
  }>();
  @Output() routeRequested = new EventEmitter<void>();

  protected originSearchQuery = '';
  protected destinationSearchQuery = '';
  protected activeSearchRole: RoutePointRole | null = null;

  private readonly searchTimers: Partial<Record<RoutePointRole, number>> = {};
  private closeSearchTimer: number | null = null;

  ngOnDestroy(): void {
    Object.values(this.searchTimers).forEach((timer) => window.clearTimeout(timer));

    if (this.closeSearchTimer !== null) {
      window.clearTimeout(this.closeSearchTimer);
    }
  }

  protected pointLabel(point: GeoPoint | null): string {
    if (!point) {
      return 'Marca un punto en el mapa';
    }

    return `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
  }

  protected placeLabel(
    point: GeoPoint | null,
    place: MapPlace | null,
    status: MapPlaceLookupStatus,
  ): string {
    if (status === 'loading') {
      return 'Detectando zona...';
    }

    if (place?.label) {
      return place.label;
    }

    return this.pointLabel(point);
  }

  protected searchResults(role: RoutePointRole): readonly MapPlace[] {
    return role === 'origin' ? this.originSearchResults : this.destinationSearchResults;
  }

  protected searchStatus(role: RoutePointRole): MapPlaceSearchStatus {
    return role === 'origin' ? this.originSearchStatus : this.destinationSearchStatus;
  }

  protected searchStatusLabel(role: RoutePointRole): string {
    switch (this.searchStatus(role)) {
      case 'loading':
        return 'Buscando en OpenStreetMap...';
      case 'empty':
        return 'No encontramos coincidencias. Prueba con ciudad y pais.';
      case 'unavailable':
        return 'La busqueda no respondio. Intenta de nuevo.';
      default:
        return '';
    }
  }

  protected showSearchResults(role: RoutePointRole): boolean {
    return this.activeSearchRole === role && this.searchResults(role).length > 0;
  }

  protected onSearchInput(role: RoutePointRole, event: Event): void {
    const query = (event.target as HTMLInputElement).value;

    if (role === 'origin') {
      this.originSearchQuery = query;
    } else {
      this.destinationSearchQuery = query;
    }

    this.activeSearchRole = role;
    const existingTimer = this.searchTimers[role];

    if (existingTimer !== undefined) {
      window.clearTimeout(existingTimer);
    }

    if (query.trim().length < 3) {
      this.placeSearchRequested.emit({ role, query });
      return;
    }

    this.searchTimers[role] = window.setTimeout(() => {
      this.placeSearchRequested.emit({ role, query });
    }, 350);
  }

  protected onSearchFocus(role: RoutePointRole): void {
    if (this.closeSearchTimer !== null) {
      window.clearTimeout(this.closeSearchTimer);
      this.closeSearchTimer = null;
    }

    this.activeSearchRole = role;
  }

  protected onSearchBlur(): void {
    this.closeSearchTimer = window.setTimeout(() => {
      this.activeSearchRole = null;
    }, 160);
  }

  protected choosePlace(role: RoutePointRole, place: MapPlace): void {
    const compactLabel = this.compactSearchLabel(place);

    if (role === 'origin') {
      this.originSearchQuery = compactLabel;
    } else {
      this.destinationSearchQuery = compactLabel;
    }

    this.activeSearchRole = null;
    this.placeSelected.emit({ role, place });
  }

  protected compactSearchLabel(place: MapPlace): string {
    const parts = [place.road, place.district, place.city, place.region, place.country]
      .filter((part): part is string => Boolean(part))
      .filter((part, index, list) => list.indexOf(part) === index);

    return parts.slice(0, 3).join(', ') || place.label;
  }

  protected zoneLabel(place: MapPlace | null): string {
    if (!place) {
      return 'Zona pendiente';
    }

    const parts = [place.district, place.city, place.province]
      .filter((part): part is string => Boolean(part))
      .filter((part, index, list) => list.indexOf(part) === index);

    return parts.length > 0 ? parts.join(' / ') : 'Zona sin nombre';
  }

  protected canCalculateRoadRoute(): boolean {
    return Boolean(
      this.freeOriginPoint &&
      this.freeDestinationPoint &&
      this.roadRouteStatus !== 'loading' &&
      this.roadRouteStatus !== 'outside-territory',
    );
  }

  protected roadRouteStatusLabel(): string {
    if (this.roadRouteError) {
      return this.roadRouteError;
    }

    switch (this.roadRouteStatus) {
      case 'loading':
        return 'Calculando recorrido por pistas';
      case 'ready':
        return 'Ruta vial lista';
      case 'waiting-for-calculation':
        return 'Listo para calcular ruta';
      case 'outside-territory':
        return 'Marca puntos dentro del contorno';
      case 'unavailable':
        return 'Ruta no disponible';
      case 'waiting-for-points':
        return 'Marca origen y destino en el mapa';
    }
  }

  protected provinceSelectOptions(): readonly UiSelectOption[] {
    return this.provinceOptions.map((province) => ({
      id: province.id,
      label: province.label,
    }));
  }

  protected districtSelectOptions(): readonly UiSelectOption[] {
    return [
      { id: '', label: 'Todos los distritos' },
      ...this.districtOptions.map((district) => ({
        id: district.id,
        label: district.label,
      })),
    ];
  }

  protected algorithmSelectOptions(): readonly UiSelectOption[] {
    return this.algorithmOptions.map((option) => ({
      id: option.id,
      label: option.label,
    }));
  }

  protected onAlgorithmChanged(algorithm: string): void {
    this.algorithmChanged.emit(algorithm as RouteAlgorithm);
  }

  protected onAutoCalculateChanged(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.autoCalculateChanged.emit(input.checked);
  }
}
