import { PlaceResponseDto } from '../place/place.dto';
import { PaginationQuery } from '../common/common.dto';
import { PublicUserResponseDto } from '../user/user.dto';
import { CreateTransaction, Transaction } from '../types/transaction';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'nestjs-swagger-dto';
import { IsOptional, MaxDate } from 'class-validator';

export class TransactionListResponseDto {
  @ApiProperty({ type: () => [TransactionResponseDto] })
  items: TransactionResponseDto[];

  @ApiProperty({
    example: 1,
    description: 'Current page number',
    required: false,
  })
  page: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  pageSize: number;

  @ApiProperty({
    example: 100,
    description: 'Total number of items',
    required: false,
  })
  total: number;
}

export class TransactionResponseDto implements Omit<
  Transaction,
  'userId' | 'placeId'
> {
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

export class CreateTransactionRequestDto implements Omit<
  CreateTransaction,
  'userId'
> {
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

export class TransactionQueryDto extends PaginationQuery {
  @IsOptional()
  @ApiPropertyOptional()
  @IsString({
    name: 'search',
    description: 'Name of the place to search for',
    example: 'Loon',
  })
  search?: string;
}
