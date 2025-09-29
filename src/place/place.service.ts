// src/place/place.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePlaceRequestDto,
  UpdatePlaceRequestDto,
  PlaceListResponseDto,
  PlaceResponseDto,
} from './place.dto';
import {
  InjectDrizzle,
  type DatabaseProvider,
} from '../drizzle/drizzle.provider';
import { eq } from 'drizzle-orm';
import { places } from '../drizzle/schema';

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
      throw new NotFoundException('No place with this id exists');
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

  async updateById(
    id: number,
    changes: UpdatePlaceRequestDto,
  ): Promise<PlaceResponseDto> {
    await this.db.update(places).set(changes).where(eq(places.id, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(places).where(eq(places.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('No place with this id exists');
    }
  }
}
