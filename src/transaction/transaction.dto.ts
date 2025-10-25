import { PlaceResponseDto } from '../place/place.dto';
import { PublicUserResponseDto } from '../user/user.dto';
import { Min, IsDate, MaxDate, IsPositive, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionListResponseDto {
  items: TransactionResponseDto[];
}

export class TransactionResponseDto {
  id: number;
  amount: number;
  date: Date;
  user: PublicUserResponseDto;
  place: PlaceResponseDto;
}

export class CreateTransactionRequestDto {
  @IsInt()
  @Min(1)
  placeId: number;

  @IsPositive()
  amount: number;

  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), { message: 'Date must not be in the future' })
  date: Date;
}

export class UpdateTransactionRequestDto extends CreateTransactionRequestDto {}
