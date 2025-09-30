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
import { and, eq } from 'drizzle-orm';
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
    const [newTransaction] = await this.db
      .insert(transactions)
      .values({
        ...dto,
        date: new Date(dto.date),
      })
      .$returningId();

    return this.getById(newTransaction.id);
  }

  async updateById(
    id: number,
    { amount, date, placeId, userId }: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    await this.db
      .update(transactions)
      .set({
        amount,
        date: new Date(date),
        placeId,
      })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));

    return this.getById(id);
  }

  async deleteById(id: number): Promise<void> {
    const [result] = await this.db
      .delete(transactions)
      .where(eq(transactions.id, id));

    if (result.affectedRows === 0) {
      throw new NotFoundException('No transaction with this id exists');
    }
  }
}
