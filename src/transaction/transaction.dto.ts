import { PlaceResponseDto } from '../place/place.dto';
import { PublicUserResponseDto } from '../user/user.dto';
import { MaxDate } from 'class-validator';
import { IsNumber, IsDate } from 'nestjs-swagger-dto';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionListResponseDto {
  @ApiProperty({ type: () => [TransactionResponseDto] })
  items: TransactionResponseDto[];
}

export class TransactionResponseDto {
  @ApiProperty({ example: 1, description: 'ID of the transaction' })
  id: number;

  @ApiProperty({
    description: 'Transaction amount',
    minimum: 1,
    type: 'number',
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction date',
    type: 'string',
    format: 'date-time',
  })
  date: Date;

  @ApiProperty({
    description: 'User who made the transaction',
    type: () => PublicUserResponseDto,
  })
  user: PublicUserResponseDto;

  @ApiProperty({
    description: 'Place where the transaction occurred',
    type: () => PlaceResponseDto,
  })
  place: PlaceResponseDto;
}

export class CreateTransactionRequestDto {
  @IsNumber({ name: 'placeId', min: 1 })
  placeId: number;

  @IsNumber({ name: 'amount' })
  amount: number;

  @IsDate({
    format: 'date-time',
    name: 'date',
  })
  @MaxDate(() => new Date())
  date: Date;
}

export class UpdateTransactionRequestDto extends CreateTransactionRequestDto {}
