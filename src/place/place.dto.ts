import {
  IsString,
  IsNotEmpty,
  Min,
  Max,
  IsInt,
  MaxLength,
} from 'class-validator';
import { TransactionResponseDto } from '../transaction/transaction.dto';

export class CreatePlaceRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}

export class UpdatePlaceRequestDto extends CreatePlaceRequestDto {}

export class PlaceResponseDto extends CreatePlaceRequestDto {
  id: number;
}

export class PlaceDetailResponseDto extends PlaceResponseDto {
  transactions: TransactionResponseDto[];
}

export class PlaceListResponseDto {
  items: PlaceResponseDto[];
}
