import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreatePlaceRequestDto,
  UpdatePlaceRequestDto,
  PlaceListResponseDto,
  PlaceDetailResponseDto,
} from './place.dto';
import {
  InjectDrizzle,
  type DatabaseProvider,
} from '../drizzle/drizzle.provider';
import { eq, getTableColumns } from 'drizzle-orm';
import { places, userFavoritePlaces } from '../drizzle/schema';

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

  async getById(id: number): Promise<PlaceDetailResponseDto> {
    const place = await this.db.query.places.findFirst({
      where: eq(places.id, id),
      with: {
        transactions: {
          with: {
            user: true,
            place: true,
          },
        },
      },
    });

    if (!place) {
      throw new NotFoundException('No place with this id exists');
    }

    return place;
  }

  async create(place: CreatePlaceRequestDto): Promise<PlaceDetailResponseDto> {
    const [newPlace] = await this.db
      .insert(places)
      .values(place)
      .$returningId();

    return this.getById(newPlace.id);
  }

  async updateById(
    id: number,
    changes: UpdatePlaceRequestDto,
  ): Promise<PlaceDetailResponseDto> {
    await this.db.update(places).set(changes).where(eq(places.id, id));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db.delete(places).where(eq(places.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('No place with this id exists');
    }
  }

  async getFavoritePlacesByUserId(
    userId: number,
  ): Promise<PlaceListResponseDto> {
    const items = await this.db
      .select(getTableColumns(places))
      .from(userFavoritePlaces)
      .innerJoin(places, eq(places.id, userFavoritePlaces.placeId))
      .where(eq(userFavoritePlaces.userId, userId));

    return { items };
  }
}
