import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  signal,
} from '@angular/core';
import { GeoPoint } from '../../../domain/models/geo-point.model';
import { GeoBounds, MapTerritory } from '../../../domain/models/map-territory.model';
import { RoadRoute, RoadRouteStatus } from '../../../domain/models/road-route.model';
import { RoutePointRole } from '../../../domain/models/route-planning.model';
import { isPointInsidePolygon, polygonBounds } from '../../../domain/services/geo-polygon.service';
import { RouteMapLayerViewModel } from '../../../application/view-models/route-map-layer.view-model';
import {
  MapLibreMap,
  MapLibreMapEvent,
  MapLibreRuntimeLoaderService,
} from '../../../infrastructure/map-rendering/maplibre-runtime-loader.service';
import { GeoJsonFeatureCollection } from '../../../application/view-models/map-geojson-layer.view-model';

interface MapPoint {
  readonly x: number;
  readonly y: number;
}

interface UrbanBlock {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly intensity: number;
}

type MapRendererStatus = 'loading' | 'ready' | 'fallback';

@Component({
  selector: 'app-route-network-map',
  templateUrl: './route-network-map.component.html',
  styleUrl: './route-network-map.component.css',
})
export class RouteNetworkMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('maplibreCanvas') private maplibreCanvas?: ElementRef<HTMLDivElement>;

  @Input() pickerMode: RoutePointRole = 'destination';
  @Input() selectedTerritory: MapTerritory | null = null;
  @Input() focusTerritories: readonly MapTerritory[] = [];
  @Input() territoryTrail = '';
  @Input() freeOriginPoint: GeoPoint | null = null;
  @Input() freeDestinationPoint: GeoPoint | null = null;
  @Input() roadRoute: RoadRoute | null = null;
  @Input() roadRouteStatus: RoadRouteStatus = 'waiting-for-points';
  @Input() geoJsonLayers: RouteMapLayerViewModel | null = null;

  @Output() mapPointSelected = new EventEmitter<GeoPoint>();

  protected readonly mapRendererStatus = signal<MapRendererStatus>('loading');

  private map: MapLibreMap | null = null;
  private mapLoaded = false;
  private lastFittedTerritoryId = '';

  constructor(
    private readonly mapLibreLoader: MapLibreRuntimeLoaderService,
    private readonly zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    void this.initializeMapLibre();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['selectedTerritory'] &&
      !changes['selectedTerritory'].firstChange &&
      (changes['selectedTerritory'].previousValue?.id !==
        changes['selectedTerritory'].currentValue?.id ||
        this.boundaryPointCount(changes['selectedTerritory'].previousValue) !==
          this.boundaryPointCount(changes['selectedTerritory'].currentValue))
    ) {
      this.lastFittedTerritoryId = '';
    }

    this.syncMapLibre();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = null;
  }

  protected mapViewBox(): string {
    if (!this.selectedTerritory) {
      return '0 0 1000 680';
    }

    const bounds = this.selectedTerritoryBounds(this.selectedTerritory);
    const topLeft = this.positionForGeo({
      latitude: bounds.north,
      longitude: bounds.west,
    });
    const bottomRight = this.positionForGeo({
      latitude: bounds.south,
      longitude: bounds.east,
    });
    const padding = this.selectedTerritory.kind === 'district' ? 68 : 34;
    const x = Math.max(0, topLeft.x - padding);
    const y = Math.max(0, topLeft.y - padding);
    const width = Math.min(1000 - x, bottomRight.x - topLeft.x + padding * 2);
    const height = Math.min(680 - y, bottomRight.y - topLeft.y + padding * 2);

    return `${x} ${y} ${Math.max(width, 260)} ${Math.max(height, 220)}`;
  }

  protected selectedTerritories(): readonly MapTerritory[] {
    return this.focusTerritories.filter((territory) => this.hasRealBoundary(territory));
  }

  protected urbanBlocks(): readonly UrbanBlock[] {
    const bounds =
      this.selectedTerritory && this.hasRealBoundary(this.selectedTerritory)
        ? polygonBounds(this.selectedTerritory.polygon ?? [])
        : this.baseBounds();
    const topLeft = this.positionForGeo({ latitude: bounds.north, longitude: bounds.west });
    const bottomRight = this.positionForGeo({ latitude: bounds.south, longitude: bounds.east });
    const columns = this.selectedTerritory?.kind === 'district' ? 8 : 12;
    const rows = this.selectedTerritory?.kind === 'district' ? 7 : 9;
    const cellWidth = (bottomRight.x - topLeft.x) / columns;
    const cellHeight = (bottomRight.y - topLeft.y) / rows;
    const blocks: UrbanBlock[] = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        if ((row + column) % 5 === 0) {
          continue;
        }

        blocks.push({
          id: `block-${row}-${column}`,
          x: topLeft.x + column * cellWidth + cellWidth * 0.2,
          y: topLeft.y + row * cellHeight + cellHeight * 0.22,
          width: cellWidth * 0.58,
          height: cellHeight * 0.52,
          intensity: 0.08 + ((row + column) % 4) * 0.025,
        });
      }
    }

    return blocks;
  }

  protected territoryPolygonPoints(territory: MapTerritory): string {
    return (territory.polygon ?? [])
      .map((geoPoint) => {
        const point = this.positionForGeo(geoPoint);

        return `${point.x},${point.y}`;
      })
      .join(' ');
  }

  protected geoJsonFeatureCount(): number {
    if (!this.geoJsonLayers) {
      return 0;
    }

    return (
      this.selectedTerritories().length +
      this.geoJsonLayers.route.features.length +
      (this.freeOriginPoint ? 1 : 0) +
      (this.freeDestinationPoint ? 1 : 0)
    );
  }

  protected routePoints(): string {
    const routePoints = this.roadRoute?.geometry ?? [];

    if (routePoints.length === 0) {
      return '';
    }

    return routePoints
      .map((geoPoint) => {
        const point = this.positionForGeo(geoPoint);
        return `${point.x},${point.y}`;
      })
      .join(' ');
  }

  protected freePointTransform(point: GeoPoint): string {
    const mapPoint = this.positionForGeo(point);

    return `translate(${mapPoint.x} ${mapPoint.y})`;
  }

  protected routeHasPoints(): boolean {
    return Boolean(this.roadRoute?.geometry.length);
  }

  protected routeLabel(): string {
    const names =
      this.roadRoute?.steps
        .map((step) => step.name.trim())
        .filter((name) => name && name !== 'Via sin nombre')
        .filter((name, index, list) => list.indexOf(name) === index)
        .slice(0, 2) ?? [];

    return names.length > 0 ? names.join(' / ') : 'Ruta vial';
  }

  protected routeLabelTransform(): string {
    const points = this.roadRoute?.geometry ?? [];
    const middle = points[Math.floor(points.length / 2)] ?? points[0];

    if (!middle) {
      return 'translate(0 0)';
    }

    const point = this.positionForGeo(middle);

    return `translate(${point.x} ${point.y - 18})`;
  }

  protected onFallbackMapClick(event: MouseEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    const bounds = svg.getBoundingClientRect();
    const [viewBoxX, viewBoxY, viewBoxWidth, viewBoxHeight] = this.mapViewBox()
      .split(' ')
      .map((value) => Number(value));
    const x = viewBoxX + ((event.clientX - bounds.left) / bounds.width) * viewBoxWidth;
    const y = viewBoxY + ((event.clientY - bounds.top) / bounds.height) * viewBoxHeight;

    this.mapPointSelected.emit(this.geoForPosition({ x, y }));
  }

  protected mapRendererLabel(): string {
    switch (this.mapRendererStatus()) {
      case 'loading':
        return 'Cargando mapa real';
      case 'ready':
        return 'MapLibre activo';
      case 'fallback':
        return 'Mapa vector local';
    }
  }

  protected roadRouteFooterLabel(): string {
    switch (this.roadRouteStatus) {
      case 'loading':
        return 'Calculando por pistas';
      case 'waiting-for-calculation':
        return 'Ruta pendiente';
      default:
        return 'Puntos libres en mapa real';
    }
  }

  private async initializeMapLibre(): Promise<void> {
    if (!this.maplibreCanvas?.nativeElement) {
      return;
    }

    try {
      const maplibregl = await this.mapLibreLoader.load();

      this.zone.runOutsideAngular(() => {
        this.map = new maplibregl.Map({
          container: this.maplibreCanvas!.nativeElement,
          style: this.createBaseMapStyle(),
          center: [-77.0675, -12.0758],
          zoom: 12.3,
          pitch: 42,
          bearing: -11,
          attributionControl: false,
        });

        this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        this.map.on('load', () => {
          this.zone.run(() => {
            this.mapLoaded = true;
            this.mapRendererStatus.set('ready');
            this.addMapLibreLayers();
            this.syncMapLibre();
          });
        });
      });
    } catch {
      this.mapRendererStatus.set('fallback');
    }
  }

  private createBaseMapStyle(): string {
    return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  }

  private addMapLibreLayers(): void {
    if (!this.map || !this.geoJsonLayers) {
      return;
    }

    this.upsertSource('sl-territory-source', this.selectedTerritoryFeatureCollection());
    this.upsertSource('sl-route-source', this.geoJsonLayers.route);
    this.upsertSource('sl-picked-points-source', this.pickedPointFeatureCollection());

    this.addLayerOnce({
      id: 'sl-territory-fill',
      type: 'fill',
      source: 'sl-territory-source',
      paint: {
        'fill-color': '#4ee6c1',
        'fill-opacity': 0.085,
      },
    });
    this.addLayerOnce({
      id: 'sl-territory-line',
      type: 'line',
      source: 'sl-territory-source',
      paint: {
        'line-color': '#4ee6c1',
        'line-dasharray': [2, 2],
        'line-opacity': 0.88,
        'line-width': 1.9,
      },
    });
    this.addLayerOnce({
      id: 'sl-route-glow',
      type: 'line',
      source: 'sl-route-source',
      paint: {
        'line-blur': 5,
        'line-color': '#19a98f',
        'line-opacity': 0.42,
        'line-width': 13,
      },
    });
    this.addLayerOnce({
      id: 'sl-route-line',
      type: 'line',
      source: 'sl-route-source',
      paint: {
        'line-color': '#063f39',
        'line-dasharray': [1.6, 1.2],
        'line-width': 4.6,
      },
    });
    this.addLayerOnce({
      id: 'sl-route-label',
      type: 'symbol',
      source: 'sl-route-source',
      layout: {
        'symbol-placement': 'line',
        'symbol-spacing': 520,
        'text-field': ['get', 'label'],
        'text-font': ['Open Sans Regular'],
        'text-size': 11.5,
        'text-rotation-alignment': 'map',
      },
      paint: {
        'text-color': '#073c37',
        'text-halo-color': '#ffffff',
        'text-halo-width': 2,
        'text-opacity': 0.86,
      },
    });
    this.addLayerOnce({
      id: 'sl-picked-points-halo',
      type: 'circle',
      source: 'sl-picked-points-source',
      paint: {
        'circle-blur': 0.35,
        'circle-color': ['match', ['get', 'role'], 'origin', '#4ee6c1', '#f6c85f'],
        'circle-opacity': 0.34,
        'circle-radius': 20,
      },
    });
    this.addLayerOnce({
      id: 'sl-picked-points-circle',
      type: 'circle',
      source: 'sl-picked-points-source',
      paint: {
        'circle-color': ['match', ['get', 'role'], 'origin', '#4ee6c1', '#f6c85f'],
        'circle-radius': 8,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
      },
    });
    this.addLayerOnce({
      id: 'sl-picked-points-label',
      type: 'symbol',
      source: 'sl-picked-points-source',
      layout: {
        'text-field': ['get', 'label'],
        'text-font': ['Open Sans Regular'],
        'text-offset': [1.15, 0],
        'text-size': 12,
      },
      paint: {
        'text-color': '#0d2f2b',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1.8,
      },
    });

    this.map.on('click', this.handleMapClick);
  }

  private syncMapLibre(): void {
    if (!this.map || !this.mapLoaded || !this.geoJsonLayers) {
      return;
    }

    this.upsertSource('sl-territory-source', this.selectedTerritoryFeatureCollection());
    this.upsertSource('sl-route-source', this.geoJsonLayers.route);
    this.upsertSource('sl-picked-points-source', this.pickedPointFeatureCollection());
    this.fitSelectedTerritory();
    this.map.resize();
  }

  private addLayerOnce(layer: Record<string, unknown>): void {
    const layerId = String(layer['id']);

    if (!this.map || this.map.getLayer(layerId)) {
      return;
    }

    this.map.addLayer(layer);
  }

  private upsertSource(id: string, data: GeoJsonFeatureCollection): void {
    if (!this.map) {
      return;
    }

    const source = this.map.getSource(id);

    if (source) {
      source.setData(data);
      return;
    }

    this.map.addSource(id, {
      type: 'geojson',
      data,
    });
  }

  private selectedTerritoryFeatureCollection(): GeoJsonFeatureCollection {
    const territories = this.focusTerritories.filter((territory) =>
      this.hasRealBoundary(territory),
    );

    if (territories.length === 0) {
      return { type: 'FeatureCollection', features: [] };
    }

    return {
      type: 'FeatureCollection',
      features: territories.map((territory) => ({
        type: 'Feature',
        id: territory.id,
        geometry: {
          type: 'Polygon',
          coordinates: [this.polygonCoordinates(territory.polygon ?? [])],
        },
        properties: {
          label: territory.label,
          kind: territory.kind,
        },
      })),
    };
  }

  private pickedPointFeatureCollection(): GeoJsonFeatureCollection {
    const features: Array<GeoJsonFeatureCollection['features'][number]> = [];

    if (this.freeOriginPoint) {
      features.push(
        this.pickedPointFeature('free-origin', 'origin', 'Origen', this.freeOriginPoint),
      );
    }

    if (this.freeDestinationPoint) {
      features.push(
        this.pickedPointFeature(
          'free-destination',
          'destination',
          'Destino',
          this.freeDestinationPoint,
        ),
      );
    }

    return {
      type: 'FeatureCollection',
      features,
    };
  }

  private pickedPointFeature(
    id: string,
    role: RoutePointRole,
    label: string,
    point: GeoPoint,
  ): GeoJsonFeatureCollection['features'][number] {
    return {
      type: 'Feature',
      id,
      geometry: {
        type: 'Point',
        coordinates: [point.longitude, point.latitude],
      },
      properties: {
        role,
        label,
      },
    };
  }

  private fitSelectedTerritory(): void {
    if (
      !this.map ||
      !this.selectedTerritory ||
      this.lastFittedTerritoryId === this.selectedTerritory.id
    ) {
      return;
    }

    this.lastFittedTerritoryId = this.selectedTerritory.id;
    const bounds = this.selectedTerritoryBounds(this.selectedTerritory);

    this.map.fitBounds(
      [
        [bounds.west, bounds.south],
        [bounds.east, bounds.north],
      ],
      {
        duration: 900,
        maxZoom: this.selectedTerritory.kind === 'district' ? 14.35 : 12.35,
        padding: this.selectedTerritory.kind === 'district' ? 92 : 56,
      },
    );
  }

  private readonly handleMapClick = (event: MapLibreMapEvent): void => {
    if (!event.lngLat) {
      return;
    }

    this.zone.run(() =>
      this.mapPointSelected.emit({
        latitude: event.lngLat!.lat,
        longitude: event.lngLat!.lng,
      }),
    );
  };

  private readonly handleNodeMouseEnter = (): void => {
    if (this.map) {
      this.map.getCanvas().style.cursor = 'pointer';
    }
  };

  private readonly handleNodeMouseLeave = (): void => {
    if (this.map) {
      this.map.getCanvas().style.cursor = '';
    }
  };

  private positionForGeo(point: GeoPoint): MapPoint {
    const bounds = this.baseBounds();
    const longitudeRatio = (point.longitude - bounds.west) / (bounds.east - bounds.west);
    const latitudeRatio = (bounds.north - point.latitude) / (bounds.north - bounds.south);

    return {
      x: longitudeRatio * 1000,
      y: latitudeRatio * 680,
    };
  }

  private geoForPosition(point: MapPoint): GeoPoint {
    const bounds = this.baseBounds();

    return {
      latitude: bounds.north - (point.y / 680) * (bounds.north - bounds.south),
      longitude: bounds.west + (point.x / 1000) * (bounds.east - bounds.west),
    };
  }

  private baseBounds(): GeoBounds {
    const territoryPoints = this.selectedTerritory?.polygon ?? [];
    const fallbackBounds = this.selectedTerritory?.bounds;
    const fallbackPoints = fallbackBounds
      ? [
          { latitude: fallbackBounds.north, longitude: fallbackBounds.west },
          { latitude: fallbackBounds.south, longitude: fallbackBounds.east },
        ]
      : [];
    const pickedPoints = [this.freeOriginPoint, this.freeDestinationPoint].filter(
      (point): point is GeoPoint => Boolean(point),
    );
    const routePoints = this.roadRoute?.geometry ?? [];
    const points = [...territoryPoints, ...fallbackPoints, ...pickedPoints, ...routePoints];
    const latitudes = points.map((point) => point.latitude);
    const longitudes = points.map((point) => point.longitude);
    const north = Math.max(...latitudes);
    const south = Math.min(...latitudes);
    const east = Math.max(...longitudes);
    const west = Math.min(...longitudes);
    const latitudePadding = Math.max((north - south) * 0.08, 0.003);
    const longitudePadding = Math.max((east - west) * 0.08, 0.003);

    return {
      north: north + latitudePadding,
      south: south - latitudePadding,
      east: east + longitudePadding,
      west: west - longitudePadding,
    };
  }

  private polygonCoordinates(points: readonly GeoPoint[]): readonly (readonly number[])[] {
    const coordinates = points.map((point) => [point.longitude, point.latitude]);
    const first = coordinates[0];
    const last = coordinates.at(-1);

    if (!first || !last || (first[0] === last[0] && first[1] === last[1])) {
      return coordinates;
    }

    return [...coordinates, first];
  }

  private selectedTerritoryBounds(territory: MapTerritory): GeoBounds {
    return this.hasRealBoundary(territory)
      ? polygonBounds(territory.polygon ?? [])
      : territory.bounds;
  }

  private hasRealBoundary(territory: MapTerritory): boolean {
    return Boolean(territory.polygon && territory.polygon.length >= 3);
  }

  private boundaryPointCount(territory: MapTerritory | null | undefined): number {
    return territory?.polygon?.length ?? 0;
  }
}
