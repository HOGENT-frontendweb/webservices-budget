import { PlaceResponseDto } from '../place/place.dto';
import { PaginationQuery } from '../common/common.dto';
import { PublicUserResponseDto } from '../user/user.dto';
import { CreateTransaction } from '../types/transaction';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  MaxDate,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionListResponseDto {
  items: TransactionResponseDto[];
  page: number;
  pageSize: number;
  total: number;
}

export class TransactionResponseDto {
  id: number;
  amount: number;
  date: Date;
  user: PublicUserResponseDto;
  place: PlaceResponseDto;
}

export class CreateTransactionRequestDto implements Omit<
  CreateTransaction,
  'id'
> {
  @IsInt()
  @Min(1)
  placeId: number;

  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  amount: number;

  @Type(() => Date)
  @IsDate()
  @MaxDate(new Date(), { message: 'Date must not be in the future' })
  date: Date;
}

export class UpdateTransactionRequestDto extends CreateTransactionRequestDto {}

export class TransactionQueryDto extends PaginationQuery {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}
