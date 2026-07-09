import { Injectable } from '@angular/core';

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
  fitBounds(bounds: readonly [readonly [number, number], readonly [number, number]], options?: Record<string, unknown>): void;
  getCanvas(): HTMLCanvasElement;
  getLayer(id: string): unknown;
  getSource(id: string): MapLibreGeoJsonSource | undefined;
  off(event: string, layerOrListener: string | ((event: MapLibreMapEvent) => void), listener?: (event: MapLibreMapEvent) => void): void;
  on(event: string, listener: (event: MapLibreMapEvent) => void): void;
  on(event: string, layerId: string, listener: (event: MapLibreMapEvent) => void): void;
  remove(): void;
  resize(): void;
}

export interface MapLibreGeoJsonSource {
  setData(data: unknown): void;
}

export interface MapLibreMapEvent {
  readonly lngLat?: {
    readonly lng: number;
    readonly lat: number;
  };
  readonly features?: readonly {
    readonly properties?: Record<string, string | number | boolean>;
  }[];
}

declare global {
  interface Window {
    maplibregl?: MapLibreGlobal;
  }
}

@Injectable({ providedIn: 'root' })
export class MapLibreRuntimeLoaderService {
  private readonly scriptId = 'smartlocation-maplibre-gl-js';
  private readonly styleId = 'smartlocation-maplibre-gl-css';
  private readonly scriptUrl = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.js';
  private readonly styleUrl = 'https://unpkg.com/maplibre-gl/dist/maplibre-gl.css';
  private loadPromise: Promise<MapLibreGlobal> | null = null;

  load(): Promise<MapLibreGlobal> {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return Promise.reject(new Error('MapLibre requires a browser runtime.'));
    }

    if (window.maplibregl) {
      return Promise.resolve(window.maplibregl);
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.injectStylesheet();
    this.loadPromise = new Promise<MapLibreGlobal>((resolve, reject) => {
      const existingScript = document.getElementById(this.scriptId) as HTMLScriptElement | null;
      const script = existingScript ?? document.createElement('script');
      const timeout = window.setTimeout(() => {
        reject(new Error('MapLibre runtime load timed out.'));
      }, 8000);

      script.id = this.scriptId;
      script.src = this.scriptUrl;
      script.async = true;
      script.onload = () => {
        window.clearTimeout(timeout);

        if (window.maplibregl) {
          resolve(window.maplibregl);
          return;
        }

        reject(new Error('MapLibre did not expose window.maplibregl.'));
      };
      script.onerror = () => {
        window.clearTimeout(timeout);
        reject(new Error('Unable to load MapLibre runtime.'));
      };

      if (!existingScript) {
        document.head.appendChild(script);
      }
    });

    return this.loadPromise;
  }

  private injectStylesheet(): void {
    if (document.getElementById(this.styleId)) {
      return;
    }

    const link = document.createElement('link');
    link.id = this.styleId;
    link.rel = 'stylesheet';
    link.href = this.styleUrl;
    document.head.appendChild(link);
  }
}
