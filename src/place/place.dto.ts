import { IsNumber, IsString } from 'nestjs-swagger-dto';
import { TransactionResponseDto } from '../transaction/transaction.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceRequestDto {
  @IsString({ name: 'name', maxLength: 255 })
  name: string;

  @IsNumber({
    name: 'rating',
    min: 1,
    max: 5,
    format: 'int32',
    type: 'integer',
  })
  rating: number;
}

export class UpdatePlaceRequestDto extends CreatePlaceRequestDto {}

export class PlaceResponseDto {
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

export class PlaceDetailResponseDto extends PlaceResponseDto {
  @ApiProperty({ type: () => [TransactionResponseDto] })
  transactions: TransactionResponseDto[];
}

export class PlaceListResponseDto {
  @ApiProperty({ type: () => [PlaceResponseDto] })
  items: PlaceResponseDto[];
}
