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
import { GeoBounds } from '../../../domain/models/map-territory.model';
import { RoadRoute, RoadRouteStatus } from '../../../domain/models/road-route.model';
import { RoutePointRole } from '../../../domain/models/route-planning.model';
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

type MapRendererStatus = 'loading' | 'ready' | 'fallback';

@Component({
  selector: 'app-route-network-map',
  templateUrl: './route-network-map.component.html',
  styleUrl: './route-network-map.component.css',
})
export class RouteNetworkMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('maplibreCanvas') private maplibreCanvas?: ElementRef<HTMLDivElement>;

  @Input() pickerMode: RoutePointRole = 'destination';
  @Input() freeOriginPoint: GeoPoint | null = null;
  @Input() freeDestinationPoint: GeoPoint | null = null;
  @Input() roadRoute: RoadRoute | null = null;
  @Input() roadRouteStatus: RoadRouteStatus = 'waiting-for-points';
  @Input() focusPoint: GeoPoint | null = null;
  @Input() geoJsonLayers: RouteMapLayerViewModel | null = null;

  @Output() mapPointSelected = new EventEmitter<GeoPoint>();

  protected readonly mapRendererStatus = signal<MapRendererStatus>('loading');

  private map: MapLibreMap | null = null;
  private mapLoaded = false;
  private mapLoadTimeoutId: number | null = null;
  private lastFittedRouteKey = '';
  private lastFocusPointKey = '';
  private globalViewportApplied = false;

  constructor(
    private readonly mapLibreLoader: MapLibreRuntimeLoaderService,
    private readonly zone: NgZone,
  ) {}

  ngAfterViewInit(): void {
    void this.initializeMapLibre();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roadRoute']) {
      this.lastFittedRouteKey = '';
    }

    if (changes['focusPoint']) {
      this.lastFocusPointKey = '';
    }

    this.syncMapLibre();
  }

  ngOnDestroy(): void {
    this.clearMapLoadTimeout();
    this.map?.remove();
    this.map = null;
  }

  protected mapViewBox(): string {
    return '0 0 1000 680';
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

    this.emitMapPointIfInsideSelection(this.geoForPosition({ x, y }));
  }

  protected mapRendererLabel(): string {
    switch (this.mapRendererStatus()) {
      case 'loading':
        return 'Cargando mapa real';
      case 'ready':
        return 'Mapa mundial activo';
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
          center: [0, 20],
          zoom: 1.55,
          pitch: 0,
          bearing: 0,
          attributionControl: false,
        });

        this.map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        this.map.on('click', this.handleMapClick);
        this.mapLoadTimeoutId = window.setTimeout(() => {
          this.zone.run(() => {
            if (!this.mapLoaded) {
              this.mapRendererStatus.set('fallback');
            }
          });
        }, 15000);
        this.map.on('error', (event) => {
          console.error('MapLibre could not render the real map.', event.error ?? event);
        });
        this.map.on('style.load', () => {
          this.zone.run(() => {
            this.clearMapLoadTimeout();
            this.mapLoaded = true;
            this.mapRendererStatus.set('ready');
            this.addMapLibreLayers();
            this.syncMapLibre();
          });
        });
      });
    } catch (error) {
      console.error('MapLibre could not initialize.', error);
      this.mapRendererStatus.set('fallback');
    }
  }

  private clearMapLoadTimeout(): void {
    if (this.mapLoadTimeoutId === null) {
      return;
    }

    window.clearTimeout(this.mapLoadTimeoutId);
    this.mapLoadTimeoutId = null;
  }

  private createBaseMapStyle(): Record<string, unknown> {
    return {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
            'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
          minzoom: 0,
          maxzoom: 20,
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        },
      },
      layers: [
        {
          id: 'carto-background',
          type: 'background',
          paint: {
            'background-color': '#07101f',
          },
        },
        {
          id: 'carto-dark',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 22,
        },
      ],
    };
  }

  private addMapLibreLayers(): void {
    if (!this.map) {
      return;
    }

    const routeLayer = this.geoJsonLayers?.route ?? this.emptyFeatureCollection();

    this.upsertSource('sl-route-source', routeLayer);
    this.upsertSource('sl-picked-points-source', this.pickedPointFeatureCollection());

    this.addLayerOnce({
      id: 'sl-route-glow',
      type: 'line',
      source: 'sl-route-source',
      paint: {
        'line-blur': 5,
        'line-color': '#22c55e',
        'line-opacity': 0.42,
        'line-width': 13,
      },
    });
    this.addLayerOnce({
      id: 'sl-route-line',
      type: 'line',
      source: 'sl-route-source',
      paint: {
        'line-color': '#4ade80',
        'line-width': 4.6,
      },
    });
    this.addLayerOnce({
      id: 'sl-picked-points-halo',
      type: 'circle',
      source: 'sl-picked-points-source',
      paint: {
        'circle-blur': 0.35,
        'circle-color': ['match', ['get', 'role'], 'origin', '#38bdf8', '#fbbf24'],
        'circle-opacity': 0.34,
        'circle-radius': 20,
      },
    });
    this.addLayerOnce({
      id: 'sl-picked-points-circle',
      type: 'circle',
      source: 'sl-picked-points-source',
      paint: {
        'circle-color': ['match', ['get', 'role'], 'origin', '#38bdf8', '#fbbf24'],
        'circle-radius': 8,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
      },
    });
  }

  private syncMapLibre(): void {
    if (!this.map || !this.mapLoaded) {
      return;
    }

    const routeLayer = this.geoJsonLayers?.route ?? this.emptyFeatureCollection();

    this.addMapLibreLayers();
    this.upsertSource('sl-route-source', routeLayer);
    this.upsertSource('sl-picked-points-source', this.pickedPointFeatureCollection());
    this.syncViewport();
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

  private emptyFeatureCollection(): GeoJsonFeatureCollection {
    return {
      type: 'FeatureCollection',
      features: [],
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

  private readonly handleMapClick = (event: MapLibreMapEvent): void => {
    if (!event.lngLat) {
      return;
    }

    this.zone.run(() => {
      this.emitMapPointIfInsideSelection({
        latitude: event.lngLat!.lat,
        longitude: event.lngLat!.lng,
      });
    });
  };

  private emitMapPointIfInsideSelection(point: GeoPoint): void {
    this.mapPointSelected.emit(point);
  }

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
    const pickedPoints = [this.freeOriginPoint, this.freeDestinationPoint].filter(
      (point): point is GeoPoint => Boolean(point),
    );
    const routePoints = this.roadRoute?.geometry ?? [];
    const points = [...pickedPoints, ...routePoints];

    if (points.length === 0) {
      return {
        north: 82,
        south: -60,
        east: 180,
        west: -180,
      };
    }

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

  private syncViewport(): void {
    if (!this.map) {
      return;
    }

    if (this.fitRoadRoute()) {
      return;
    }

    if (this.focusMapPoint()) {
      return;
    }

    if (!this.globalViewportApplied) {
      this.globalViewportApplied = true;
      this.map.flyTo({
        center: [0, 20],
        zoom: 1.55,
        pitch: 0,
        bearing: 0,
        duration: 900,
        essential: false,
      });
    }
  }

  private fitRoadRoute(): boolean {
    const points = this.roadRoute?.geometry ?? [];

    if (!this.map || points.length < 2) {
      return false;
    }

    const first = points[0];
    const last = points.at(-1);
    const routeKey = `${first.latitude}:${first.longitude}:${last?.latitude}:${last?.longitude}:${points.length}`;

    if (routeKey === this.lastFittedRouteKey) {
      return true;
    }

    this.lastFittedRouteKey = routeKey;
    const latitudes = points.map((point) => point.latitude);
    const longitudes = points.map((point) => point.longitude);

    this.map.fitBounds(
      [
        [Math.min(...longitudes), Math.min(...latitudes)],
        [Math.max(...longitudes), Math.max(...latitudes)],
      ],
      {
        duration: 1100,
        maxZoom: 13.5,
        padding: 84,
        essential: false,
      },
    );

    return true;
  }

  private focusMapPoint(): boolean {
    if (!this.map || !this.focusPoint) {
      return false;
    }

    const focusKey = `${this.focusPoint.latitude}:${this.focusPoint.longitude}`;

    if (focusKey === this.lastFocusPointKey) {
      return true;
    }

    this.lastFocusPointKey = focusKey;
    this.globalViewportApplied = true;
    this.map.flyTo({
      center: [this.focusPoint.longitude, this.focusPoint.latitude],
      zoom: 13.2,
      pitch: 0,
      bearing: 0,
      duration: 900,
      essential: false,
    });

    return true;
  }
}
