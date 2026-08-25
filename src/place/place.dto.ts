import { TransactionResponseDto } from '../transaction/transaction.dto';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePlaceRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number | null;
}

export class UpdatePlaceRequestDto extends CreatePlaceRequestDto {}

export class PlaceResponseDto extends CreatePlaceRequestDto {
  id: number;
}

export class PlaceListResponseDto {
  items: PlaceResponseDto[];
}

export class PlaceDetailResponseDto extends PlaceResponseDto {
  transactions: TransactionResponseDto[];
}
