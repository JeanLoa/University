import { inject, Injectable } from '@angular/core';
import { MapPlace } from '../../domain/models/map-place.model';
import { MAP_PLACE_REPOSITORY } from '../../domain/repositories/map-place.repository';

@Injectable()
export class SearchMapPlacesUseCase {
  private readonly placeRepository = inject(MAP_PLACE_REPOSITORY);

  execute(query: string, limit = 6): Promise<readonly MapPlace[]> {
    return this.placeRepository.searchPlaces(query, limit);
  }
}
