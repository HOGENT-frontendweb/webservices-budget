import { PlaceResponseDto } from '../place/place.dto';
import { PaginationQuery } from '../common/common.dto';
import { UserResponseDto } from '../user/user.dto';

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
  user: UserResponseDto;
  place: PlaceResponseDto;
}

export class CreateTransactionRequestDto {
  placeId: number;
  userId: number;
  amount: number;
  date: Date;
}

export class UpdateTransactionRequestDto extends CreateTransactionRequestDto {}

export class TransactionQueryDto extends PaginationQuery {
  search?: string;
}
