import { Injectable, NotFoundException } from '@nestjs/common';
import { PLACES, Place } from '../data/mock_data';
import {
  CreatePlaceRequestDto,
  UpdatePlaceRequestDto,
  PlaceListResponseDto,
  PlaceResponseDto,
} from './place.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { places } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PlaceService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(): Promise<PlaceListResponseDto> {
    const items = await this.db.query.places.findMany();
    return { items };
  }

  async getById(id: number): Promise<PlaceResponseDto> {
    const place = await this.db.query.places.findFirst({
      where: eq(places.id, id),
    });

    if (!place) {
      throw new NotFoundException(`No place with this id exists`);
    }

    return place;
  }

  async create(place: CreatePlaceRequestDto): Promise<PlaceResponseDto> {
    const [newPlace] = await this.db
      .insert(places)
      .values(place)
      .$returningId();

    return this.getById(newPlace.id);
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
