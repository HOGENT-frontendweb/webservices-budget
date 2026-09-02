import { TransactionResponseDto } from '../transaction/transaction.dto';
import { IsNumber, IsString } from 'nestjs-swagger-dto';
import { ApiProperty } from '@nestjs/swagger';
import { Place, CreatePlace } from '../types/place';

export class CreatePlaceRequestDto implements CreatePlace {
  @IsString({ name: 'name', maxLength: 255 })
  name: string;

  @IsNumber({
    name: 'rating',
    min: 1,
    max: 5,
    optional: true,
    format: 'int32',
    type: 'integer',
  })
  rating?: number;
}

export class UpdatePlaceRequestDto extends CreatePlaceRequestDto {}

export class PlaceResponseDto implements Place {
  @ApiProperty({ example: 1, description: 'ID of the place' })
  id: number;

  @ApiProperty({
    example: 'Loon',
    description: 'Name of the place where transactions can occur',
  })
  name: string;

  @ApiProperty({
    example: 4,
    description: 'Rating of the place (1 to 5)',
    nullable: true,
    format: 'int32',
    type: 'integer',
  })
  rating: number | null;
}

export class PlaceListResponseDto {
  items: PlaceResponseDto[];
}

export class PlaceDetailResponseDto extends PlaceResponseDto {
  @ApiProperty({ type: () => [TransactionResponseDto] })
  transactions: TransactionResponseDto[];
}
