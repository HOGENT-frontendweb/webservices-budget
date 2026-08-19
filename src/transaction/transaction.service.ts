import { Injectable, NotFoundException } from '@nestjs/common';
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
import { desc, eq } from 'drizzle-orm';
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
    const transaction = await this.db.query.transactions.findFirst({
      columns: {
        id: true,
        amount: true,
        date: true,
      },
      where: eq(transactions.id, id),
      with: {
        place: true,
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`No transaction with this id exists`);
    }

    return transaction;
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
