import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AlgorithmOption,
  RouteAlgorithm,
  RoutePointRole,
} from '../../../domain/models/route-planning.model';
import { GeoPoint } from '../../../domain/models/geo-point.model';
import { MapPlace, MapPlaceLookupStatus } from '../../../domain/models/map-place.model';
import { RoadRouteStatus } from '../../../domain/models/road-route.model';
import { MapTerritory } from '../../../domain/models/map-territory.model';
import { UiSelectComponent, UiSelectOption } from '../../../../shared/presentation/components/ui-select/ui-select.component';

@Component({
  selector: 'app-route-control-panel',
  imports: [UiSelectComponent],
  templateUrl: './route-control-panel.component.html',
  styleUrl: './route-control-panel.component.css',
})
export class RouteControlPanelComponent {
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
  @Input() roadRouteStatus: RoadRouteStatus = 'waiting-for-points';
  @Input() roadRouteError = '';

  @Output() provinceChanged = new EventEmitter<string>();
  @Output() districtChanged = new EventEmitter<string>();
  @Output() algorithmChanged = new EventEmitter<RouteAlgorithm>();
  @Output() autoCalculateChanged = new EventEmitter<boolean>();
  @Output() pickerModeChanged = new EventEmitter<RoutePointRole>();
  @Output() routeRequested = new EventEmitter<void>();

  protected pointLabel(point: GeoPoint | null): string {
    if (!point) {
      return 'Marca un punto en el mapa';
    }

    return `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`;
  }

  protected placeLabel(point: GeoPoint | null, place: MapPlace | null, status: MapPlaceLookupStatus): string {
    if (status === 'loading') {
      return 'Detectando zona...';
    }

    if (place?.label) {
      return place.label;
    }

    return this.pointLabel(point);
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
