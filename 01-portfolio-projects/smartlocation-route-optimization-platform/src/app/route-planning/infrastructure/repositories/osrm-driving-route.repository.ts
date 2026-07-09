import { Injectable } from '@angular/core';
import { GeoPoint } from '../../domain/models/geo-point.model';
import {
  RoadRoute,
  RoadRouteRequest,
  RoadRouteStep,
  RoadRouteWaypoint,
} from '../../domain/models/road-route.model';
import { RouteAlgorithm } from '../../domain/models/route-planning.model';
import { RoadRouteRepository } from '../../domain/repositories/road-route.repository';

interface OsrmRouteResponse {
  readonly code?: string;
  readonly routes?: readonly OsrmRoute[];
  readonly waypoints?: readonly OsrmWaypoint[];
}

interface OsrmRoute {
  readonly distance: number;
  readonly duration: number;
  readonly geometry?: {
    readonly coordinates?: readonly (readonly [number, number])[];
  };
  readonly legs?: readonly OsrmLeg[];
}

interface OsrmLeg {
  readonly steps?: readonly OsrmStep[];
}

interface OsrmStep {
  readonly name?: string;
  readonly distance: number;
  readonly duration: number;
}

interface OsrmWaypoint {
  readonly name?: string;
  readonly location?: readonly [number, number];
}

@Injectable()
export class OsrmDrivingRouteRepository implements RoadRouteRepository {
  private readonly routeServiceUrl = 'https://router.project-osrm.org/route/v1/driving';

  async findRoute(request: RoadRouteRequest): Promise<RoadRoute | null> {
    const pythonRoute = await this.findPythonRoute(request);

    if (pythonRoute) {
      return pythonRoute;
    }

    const url = this.buildRouteUrl(request);
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as OsrmRouteResponse;
    const route = this.selectRoute(payload.routes ?? [], request.algorithm);
    const coordinates = route?.geometry?.coordinates ?? [];

    if (payload.code !== 'Ok' || !route || coordinates.length < 2) {
      return null;
    }

    return {
      provider: 'osrm',
      algorithm: request.algorithm,
      distanceMeters: route.distance,
      durationSeconds: route.duration,
      geometry: coordinates.map(([longitude, latitude]) => ({ latitude, longitude })),
      snappedOrigin: this.waypointFor(payload.waypoints?.[0], 'Origen'),
      snappedDestination: this.waypointFor(payload.waypoints?.[1], 'Destino'),
      steps: this.stepsFor(route),
    };
  }

  private async findPythonRoute(request: RoadRouteRequest): Promise<RoadRoute | null> {
    try {
      const response = await fetch(this.buildPythonRouteUrl(request));

      if (!response.ok) {
        return null;
      }

      return (await response.json()) as RoadRoute;
    } catch {
      return null;
    }
  }

  private buildPythonRouteUrl(request: RoadRouteRequest): string {
    const params = new URLSearchParams({
      originLat: request.origin.latitude.toFixed(7),
      originLon: request.origin.longitude.toFixed(7),
      destinationLat: request.destination.latitude.toFixed(7),
      destinationLon: request.destination.longitude.toFixed(7),
      algorithm: request.algorithm,
    });

    return `${this.pythonRouteServiceUrl()}?${params.toString()}`;
  }

  private pythonRouteServiceUrl(): string {
    if (typeof window !== 'undefined' && window.location.port !== '4200') {
      return '/route';
    }

    return 'http://127.0.0.1:8010/route';
  }

  private buildRouteUrl(request: RoadRouteRequest): string {
    const origin = this.coordinateFor(request.origin);
    const destination = this.coordinateFor(request.destination);
    const params = new URLSearchParams({
      alternatives: request.algorithm === 'astar' ? 'false' : '3',
      overview: 'full',
      geometries: 'geojson',
      steps: 'true',
    });

    return `${this.routeServiceUrl}/${origin};${destination}?${params.toString()}`;
  }

  private selectRoute(
    routes: readonly OsrmRoute[],
    algorithm: RouteAlgorithm,
  ): OsrmRoute | undefined {
    if (routes.length === 0) {
      return undefined;
    }

    const rankedRoutes = [...routes];

    switch (algorithm) {
      case 'dijkstra':
        return rankedRoutes.sort(
          (first, second) => first.distance - second.distance || first.duration - second.duration,
        )[0];
      case 'bfs':
        return rankedRoutes.sort(
          (first, second) =>
            this.stepCount(first) - this.stepCount(second) ||
            first.distance - second.distance ||
            first.duration - second.duration,
        )[0];
      case 'astar':
        return rankedRoutes.sort(
          (first, second) => first.duration - second.duration || first.distance - second.distance,
        )[0];
    }
  }

  private stepCount(route: OsrmRoute): number {
    return (route.legs ?? []).reduce((total, leg) => total + (leg.steps?.length ?? 0), 0);
  }

  private coordinateFor(point: GeoPoint): string {
    return `${point.longitude.toFixed(6)},${point.latitude.toFixed(6)}`;
  }

  private waypointFor(
    waypoint: OsrmWaypoint | undefined,
    fallbackLabel: string,
  ): RoadRouteWaypoint {
    const [longitude, latitude] = waypoint?.location ?? [0, 0];

    return {
      label: waypoint?.name || fallbackLabel,
      point: { latitude, longitude },
    };
  }

  private stepsFor(route: OsrmRoute): readonly RoadRouteStep[] {
    return (route.legs ?? []).flatMap((leg) =>
      (leg.steps ?? []).map((step) => ({
        name: step.name || 'Via sin nombre',
        distanceMeters: step.distance,
        durationSeconds: step.duration,
      })),
    );
  }
}
