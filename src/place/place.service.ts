// src/place/place.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PLACES, Place } from '../data/mock_data';
import { CreatePlaceRequestDto, UpdatePlaceRequestDto, PlaceListResponseDto, PlaceResponseDto } from './place.dto';

@Injectable()
export class PlaceService {

  getAll(): PlaceListResponseDto {
    return { items: PLACES };
  }

  getById(id: number): PlaceResponseDto {
    const place = PLACES.find((item: Place) => item.id === id);

    if (!place) {
      throw new NotFoundException('No place with this id exists');
    }

    return place;
  }

  create({ name, rating }: CreatePlaceRequestDto): PlaceResponseDto {
    const newplace = { id: Math.max(...PLACES.map((item: Place) => item.id)) + 1, name, rating };
    PLACES.push(newplace);
    return newplace;
  }

  updateById(id: number, { name, rating }: UpdatePlaceRequestDto): PlaceResponseDto {
    let existingplace = this.getById(id);
    if (existingplace) {
      existingplace = { id: id, name, rating }
    }
    return existingplace;
  }

  deleteById(id: number): void {
    const index = PLACES.findIndex((item: Place) => item.id === id);
    if (index >= 0) {
      PLACES.splice(index, 1);
    }
  }
}
