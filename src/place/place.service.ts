import { Injectable } from '@nestjs/common';
import { PLACES, Place } from '../data/mock_data';
import {
  CreatePlaceRequestDto,
  UpdatePlaceRequestDto,
  PlaceListResponseDto,
  PlaceResponseDto,
} from './place.dto';

@Injectable()
export class PlaceService {
  getAll(): PlaceListResponseDto {
    return { items: PLACES };
  }

  getById(id: number): PlaceResponseDto {
    const place = PLACES.find((item: Place) => item.id === id);

    if (!place) {
      throw new Error('No place with this id exists');
    }

    return place;
  }

  create({ name, rating }: CreatePlaceRequestDto): PlaceResponseDto {
    const newplace = {
      id: Math.max(...PLACES.map((item: Place) => item.id)) + 1,
      name,
      rating,
    };
    PLACES.push(newplace);
    return newplace;
  }

  updateById(
    id: number,
    { name, rating }: UpdatePlaceRequestDto,
  ): PlaceResponseDto {
    const existingPlace = this.getById(id);
    if (existingPlace) {
      existingPlace.name = name;
      existingPlace.rating = rating;
    }
    return existingPlace;
  }

  deleteById(id: number): void {
    const index = PLACES.findIndex((item: Place) => item.id === id);
    if (index >= 0) {
      PLACES.splice(index, 1);
    }
  }
}
