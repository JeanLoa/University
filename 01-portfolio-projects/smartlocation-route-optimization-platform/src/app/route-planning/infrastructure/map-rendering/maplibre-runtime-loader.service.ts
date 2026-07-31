import { Injectable } from '@angular/core';
import * as maplibregl from 'maplibre-gl';

export interface MapLibreGlobal {
  readonly Map: new (options: MapLibreMapOptions) => MapLibreMap;
  readonly NavigationControl: new (options?: Record<string, unknown>) => unknown;
}

export interface MapLibreMapOptions {
  readonly container: HTMLElement;
  readonly style: Record<string, unknown> | string;
  readonly center: readonly [number, number];
  readonly zoom: number;
  readonly pitch?: number;
  readonly bearing?: number;
  readonly attributionControl?: boolean;
}

export interface MapLibreMap {
  addControl(control: unknown, position?: string): void;
  addLayer(layer: Record<string, unknown>, beforeId?: string): void;
  addSource(id: string, source: Record<string, unknown>): void;
  fitBounds(
    bounds: readonly [readonly [number, number], readonly [number, number]],
    options?: Record<string, unknown>,
  ): void;
  flyTo(options: Record<string, unknown>): void;
  getCanvas(): HTMLCanvasElement;
  getLayer(id: string): unknown;
  getSource(id: string): MapLibreGeoJsonSource | undefined;
  off(
    event: string,
    layerOrListener: string | ((event: MapLibreMapEvent) => void),
    listener?: (event: MapLibreMapEvent) => void,
  ): void;
  on(event: string, listener: (event: MapLibreMapEvent) => void): void;
  on(event: string, layerId: string, listener: (event: MapLibreMapEvent) => void): void;
  remove(): void;
  resize(): void;
}

export interface MapLibreGeoJsonSource {
  setData(data: unknown): void;
}

export interface MapLibreMapEvent {
  readonly error?: Error;
  readonly lngLat?: {
    readonly lng: number;
    readonly lat: number;
  };
  readonly features?: readonly {
    readonly properties?: Record<string, string | number | boolean>;
  }[];
}

@Injectable({ providedIn: 'root' })
export class MapLibreRuntimeLoaderService {
  private readonly runtime = maplibregl as unknown as MapLibreGlobal;
  private workerConfigured = false;

  load(): Promise<MapLibreGlobal> {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return Promise.reject(new Error('MapLibre requires a browser runtime.'));
    }

    if (!this.workerConfigured) {
      const workerUrl = new URL(
        'assets/maplibre/maplibre-gl-worker.mjs',
        document.baseURI,
      ).toString();

      maplibregl.setWorkerUrl(workerUrl);
      this.workerConfigured = true;
    }

    return Promise.resolve(this.runtime);
  }
}
