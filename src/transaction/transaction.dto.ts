import { PlaceResponseDto } from '../place/place.dto';
import { UserResponseDto } from '../user/user.dto';

export class TransactionListResponseDto {
  items: TransactionResponseDto[];
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
