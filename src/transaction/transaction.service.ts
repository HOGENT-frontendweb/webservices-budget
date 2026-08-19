import { Injectable } from '@nestjs/common';
import {
  CreateTransactionRequestDto,
  TransactionListResponseDto,
  TransactionResponseDto,
  UpdateTransactionRequestDto,
} from './transaction.dto';
import {
  type DatabaseProvider,
  InjectDrizzle,
} from '../drizzle/drizzle.provider';
import { desc } from 'drizzle-orm';
import { transactions } from '../drizzle/schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(): Promise<TransactionListResponseDto> {
    const items = await this.db.query.transactions.findMany({
      columns: {
        id: true,
        amount: true,
        date: true,
      },
      with: {
        place: true,
        user: true,
      },
      orderBy: desc(transactions.date),
    });

    return { items };
  }

  async getById(id: number): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  async create(
    dto: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  async updateById(
    id: number,
    { amount, date, placeId, userId }: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    throw new Error('Not implemented');
  }

  async deleteById(id: number): Promise<void> {
    throw new Error('Not implemented');
  }
}
