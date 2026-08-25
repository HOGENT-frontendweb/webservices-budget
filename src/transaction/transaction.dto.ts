import { PlaceResponseDto } from '../place/place.dto';
import { PublicUserResponseDto } from '../user/user.dto';

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

export class CreateTransactionRequestDto {
  placeId: number;
  userId: number;
  amount: number;
  date: Date;
}

export class UpdateTransactionRequestDto extends CreateTransactionRequestDto {}
