import { inject, Injectable } from '@angular/core';
import { GeoPoint } from '../../domain/models/geo-point.model';
import { MapPlace } from '../../domain/models/map-place.model';
import { MAP_PLACE_REPOSITORY } from '../../domain/repositories/map-place.repository';

@Injectable()
export class ResolveMapPlaceUseCase {
  private readonly placeRepository = inject(MAP_PLACE_REPOSITORY);

  execute(point: GeoPoint): Promise<MapPlace | null> {
    return this.placeRepository.findPlace(point);
  }
}
