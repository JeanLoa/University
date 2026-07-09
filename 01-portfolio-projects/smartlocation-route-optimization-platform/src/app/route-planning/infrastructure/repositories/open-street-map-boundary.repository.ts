import { Injectable } from '@angular/core';
import { GeoPoint } from '../../domain/models/geo-point.model';
import { MapBoundarySource } from '../../domain/models/map-territory.model';
import { MapBoundaryRepository } from '../../domain/repositories/map-boundary.repository';
import limaBoundariesResource from '../resources/map-layers/lima-boundaries.resource.json';
import { LimaBoundariesResource } from '../resources/map-layers/lima-map-layers.resource';

interface OverpassGeometryPoint {
  readonly lat: number;
  readonly lon: number;
}

interface OverpassMember {
  readonly type: string;
  readonly role: string;
  readonly geometry?: readonly OverpassGeometryPoint[];
}

interface OverpassElement {
  readonly type: string;
  readonly geometry?: readonly OverpassGeometryPoint[];
  readonly members?: readonly OverpassMember[];
}

interface OverpassResponse {
  readonly elements?: readonly OverpassElement[];
}

@Injectable()
export class OpenStreetMapBoundaryRepository implements MapBoundaryRepository {
  private readonly cachePrefix = 'smartlocation.boundary.v1.';
  private readonly endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
  ];
  private readonly localBoundaryByKey = this.buildLocalBoundaryMap(limaBoundariesResource as LimaBoundariesResource);
  private readonly memoryCache = new Map<string, readonly GeoPoint[]>();

  async findBoundary(source: MapBoundarySource): Promise<readonly GeoPoint[]> {
    if (source.provider !== 'openstreetmap') {
      return [];
    }

    const sourceKey = this.boundarySourceKey(source);
    const localBoundary = this.findLocalBoundary(source);

    if (localBoundary.length >= 3) {
      return localBoundary;
    }

    const cachedBoundary = this.readCachedBoundary(sourceKey);

    if (cachedBoundary.length >= 3) {
      return cachedBoundary;
    }

    const queries = this.boundaryQueries(source);

    for (const query of queries) {
      for (const endpoint of this.endpoints) {
        try {
          const response = await fetch(`${endpoint}?data=${encodeURIComponent(query)}`);

          if (!response.ok) {
            continue;
          }

          const payload = (await response.json()) as OverpassResponse;
          const ring = this.extractOuterRing(payload);

          if (ring.length >= 3) {
            this.writeCachedBoundary(sourceKey, ring);
            return ring;
          }
        } catch {
          continue;
        }
      }
    }

    return [];
  }

  private buildLocalBoundaryMap(resource: LimaBoundariesResource): Map<string, readonly GeoPoint[]> {
    const boundaries = new Map<string, readonly GeoPoint[]>();

    for (const boundary of resource.boundaries) {
      if (boundary.polygon.length < 3) {
        continue;
      }

      boundaries.set(boundary.sourceKey, boundary.polygon);
      boundaries.set(`relation:${boundary.relationId}`, boundary.polygon);
    }

    return boundaries;
  }

  private findLocalBoundary(source: MapBoundarySource): readonly GeoPoint[] {
    for (const sourceKey of this.boundaryLookupKeys(source)) {
      const boundary = this.localBoundaryByKey.get(sourceKey);

      if (boundary && boundary.length >= 3) {
        return boundary;
      }
    }

    return [];
  }

  private boundaryQueries(source: MapBoundarySource): readonly string[] {
    if (Number.isFinite(source.relationId)) {
      return [
        `[out:json][timeout:25];relation(${source.relationId});out geom;`,
        `[out:json][timeout:25];relation(${source.relationId})->.boundary;way(r.boundary);out geom;`,
      ];
    }

    if (source.queryName && Number.isFinite(source.parentRelationId)) {
      const queryName = this.escapeOverpassString(source.queryName);

      return [
        `[out:json][timeout:25];relation(${source.parentRelationId});map_to_area->.lima;relation(area.lima)["boundary"="administrative"]["admin_level"="8"]["name"="${queryName}"];out geom;`,
        `[out:json][timeout:25];relation(${source.parentRelationId});map_to_area->.lima;relation(area.lima)["boundary"="administrative"]["admin_level"="8"]["name"="${queryName}"]->.boundary;way(r.boundary);out geom;`,
      ];
    }

    return [];
  }

  private boundaryLookupKeys(source: MapBoundarySource): readonly string[] {
    const keys = [this.boundarySourceKey(source)];

    if (Number.isFinite(source.relationId)) {
      keys.push(`relation:${source.relationId}`);
    }

    if (source.queryName && Number.isFinite(source.parentRelationId)) {
      keys.push(`query:${source.parentRelationId}:${source.queryName}`);
    }

    return [...new Set(keys)];
  }

  private boundarySourceKey(source: MapBoundarySource): string {
    return source.relationId
      ? `relation:${source.relationId}`
      : `query:${source.parentRelationId ?? 'global'}:${source.queryName ?? ''}`;
  }

  private readCachedBoundary(sourceKey: string): readonly GeoPoint[] {
    const memoryBoundary = this.memoryCache.get(sourceKey);

    if (memoryBoundary && memoryBoundary.length >= 3) {
      return memoryBoundary;
    }

    try {
      const storage = this.browserStorage();
      const rawBoundary = storage?.getItem(`${this.cachePrefix}${encodeURIComponent(sourceKey)}`);

      if (!rawBoundary) {
        return [];
      }

      const boundary = JSON.parse(rawBoundary) as readonly GeoPoint[];
      const validBoundary = this.validBoundary(boundary);

      if (validBoundary.length >= 3) {
        this.memoryCache.set(sourceKey, validBoundary);
      }

      return validBoundary;
    } catch {
      return [];
    }
  }

  private writeCachedBoundary(sourceKey: string, boundary: readonly GeoPoint[]): void {
    const validBoundary = this.validBoundary(boundary);

    if (validBoundary.length < 3) {
      return;
    }

    this.memoryCache.set(sourceKey, validBoundary);

    try {
      this.browserStorage()?.setItem(`${this.cachePrefix}${encodeURIComponent(sourceKey)}`, JSON.stringify(validBoundary));
    } catch {
      return;
    }
  }

  private browserStorage(): Storage | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }

    return window.localStorage;
  }

  private validBoundary(boundary: readonly GeoPoint[]): readonly GeoPoint[] {
    if (!Array.isArray(boundary)) {
      return [];
    }

    return boundary.filter(
      (point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude),
    );
  }

  private escapeOverpassString(value: string): string {
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  private extractOuterRing(payload: OverpassResponse): readonly GeoPoint[] {
    const relation = payload.elements?.find((element) => element.type === 'relation');
    const relationSegments =
      relation?.members
        ?.filter((member) => member.type === 'way' && this.isBoundaryRole(member.role) && member.geometry?.length)
        .map((member) => member.geometry!.map((point) => ({ latitude: point.lat, longitude: point.lon }))) ?? [];
    const waySegments =
      payload.elements
        ?.filter((element) => element.type === 'way' && element.geometry?.length)
        .map((element) => element.geometry!.map((point) => ({ latitude: point.lat, longitude: point.lon }))) ?? [];
    const segments = relationSegments.length > 0 ? relationSegments : waySegments;

    return this.assembleLargestRing(segments);
  }

  private isBoundaryRole(role: string): boolean {
    return role === 'outer' || role === '';
  }

  private assembleLargestRing(segments: readonly (readonly GeoPoint[])[]): readonly GeoPoint[] {
    const unusedSegments = segments.map((segment) => [...segment]);
    const rings: GeoPoint[][] = [];

    while (unusedSegments.length > 0) {
      const ring = unusedSegments.shift() ?? [];

      while (ring.length > 0) {
        const tail = ring[ring.length - 1];
        const matchingIndex = unusedSegments.findIndex((segment) => {
          const first = segment[0];
          const last = segment[segment.length - 1];

          return this.samePoint(tail, first) || this.samePoint(tail, last);
        });

        if (matchingIndex < 0) {
          break;
        }

        const [nextSegment] = unusedSegments.splice(matchingIndex, 1);
        const first = nextSegment[0];
        const orientedSegment = this.samePoint(tail, first) ? nextSegment : [...nextSegment].reverse();

        ring.push(...orientedSegment.slice(1));
      }

      if (ring.length >= 3) {
        rings.push(this.closeRing(ring));
      }
    }

    return rings.sort((left, right) => right.length - left.length)[0] ?? [];
  }

  private closeRing(points: readonly GeoPoint[]): GeoPoint[] {
    const first = points[0];
    const last = points[points.length - 1];

    if (!first || !last || this.samePoint(first, last)) {
      return [...points];
    }

    return [...points, first];
  }

  private samePoint(left: GeoPoint, right: GeoPoint): boolean {
    return Math.abs(left.latitude - right.latitude) < 0.0000001 && Math.abs(left.longitude - right.longitude) < 0.0000001;
  }
}
