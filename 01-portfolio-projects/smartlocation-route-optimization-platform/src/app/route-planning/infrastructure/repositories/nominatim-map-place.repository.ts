import { Injectable } from '@angular/core';
import { GeoPoint } from '../../domain/models/geo-point.model';
import { MapPlace } from '../../domain/models/map-place.model';
import { MapPlaceRepository } from '../../domain/repositories/map-place.repository';

interface NominatimReverseResponse {
  readonly display_name?: string;
  readonly name?: string;
  readonly lat?: string;
  readonly lon?: string;
  readonly address?: NominatimAddress;
}

interface NominatimAddress {
  readonly road?: string;
  readonly pedestrian?: string;
  readonly footway?: string;
  readonly cycleway?: string;
  readonly neighbourhood?: string;
  readonly suburb?: string;
  readonly city_district?: string;
  readonly district?: string;
  readonly city?: string;
  readonly town?: string;
  readonly county?: string;
  readonly state?: string;
  readonly region?: string;
  readonly country?: string;
}

@Injectable()
export class NominatimMapPlaceRepository implements MapPlaceRepository {
  private readonly reverseUrl = 'https://nominatim.openstreetmap.org/reverse';

  async findPlace(point: GeoPoint): Promise<MapPlace | null> {
    const url = this.buildReverseUrl(point);
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as NominatimReverseResponse;
    const address = payload.address ?? {};
    const road = address.road ?? address.pedestrian ?? address.footway ?? address.cycleway;
    const district =
      address.city_district ?? address.district ?? address.suburb ?? address.neighbourhood;
    const city = address.city ?? address.town;
    const province = address.county;
    const region = address.state ?? address.region;
    const label = this.compactLabel(payload, road, district, city);

    if (!label) {
      return null;
    }

    return {
      label,
      road,
      district,
      city,
      province,
      region,
      country: address.country,
      point: {
        latitude: Number(payload.lat ?? point.latitude),
        longitude: Number(payload.lon ?? point.longitude),
      },
    };
  }

  private buildReverseUrl(point: GeoPoint): string {
    const params = new URLSearchParams({
      format: 'jsonv2',
      lat: point.latitude.toFixed(7),
      lon: point.longitude.toFixed(7),
      zoom: '18',
      addressdetails: '1',
      layer: 'address',
      'accept-language': 'es',
    });

    return `${this.reverseUrl}?${params.toString()}`;
  }

  private compactLabel(
    payload: NominatimReverseResponse,
    road: string | undefined,
    district: string | undefined,
    city: string | undefined,
  ): string {
    return (
      payload.name ||
      [road, district, city].filter(Boolean).join(', ') ||
      payload.display_name ||
      ''
    );
  }
}
