import { GeoPoint } from '../models/geo-point.model';
import { GeoBounds } from '../models/map-territory.model';

const EPSILON = 0.0000001;

export function isPointInsidePolygon(point: GeoPoint, polygon: readonly GeoPoint[]): boolean {
  if (polygon.length < 3) {
    return false;
  }

  let inside = false;

  for (let currentIndex = 0, previousIndex = polygon.length - 1; currentIndex < polygon.length; previousIndex = currentIndex++) {
    const current = polygon[currentIndex];
    const previous = polygon[previousIndex];

    if (isPointOnSegment(point, previous, current)) {
      return true;
    }

    const intersects =
      current.latitude > point.latitude !== previous.latitude > point.latitude &&
      point.longitude <
        ((previous.longitude - current.longitude) * (point.latitude - current.latitude)) /
          (previous.latitude - current.latitude) +
          current.longitude;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function isPointOnSegment(point: GeoPoint, start: GeoPoint, end: GeoPoint): boolean {
  const crossProduct =
    (point.longitude - start.longitude) * (end.latitude - start.latitude) -
    (point.latitude - start.latitude) * (end.longitude - start.longitude);

  if (Math.abs(crossProduct) > EPSILON) {
    return false;
  }

  const withinLatitude =
    point.latitude >= Math.min(start.latitude, end.latitude) - EPSILON &&
    point.latitude <= Math.max(start.latitude, end.latitude) + EPSILON;
  const withinLongitude =
    point.longitude >= Math.min(start.longitude, end.longitude) - EPSILON &&
    point.longitude <= Math.max(start.longitude, end.longitude) + EPSILON;

  return withinLatitude && withinLongitude;
}

export function polygonBounds(polygon: readonly GeoPoint[]): GeoBounds {
  const latitudes = polygon.map((point) => point.latitude);
  const longitudes = polygon.map((point) => point.longitude);

  return {
    north: Math.max(...latitudes),
    south: Math.min(...latitudes),
    east: Math.max(...longitudes),
    west: Math.min(...longitudes),
  };
}
