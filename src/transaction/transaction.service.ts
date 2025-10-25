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
import { Role } from '../auth/roles';

@Injectable()
export class TransactionService {
  constructor(
    @InjectDrizzle()
    private readonly db: DatabaseProvider,
  ) {}

  async getAll(
    userId: number,
    roles: string[],
  ): Promise<TransactionListResponseDto> {
    const items = await this.db.query.transactions.findMany({
      columns: {
        id: true,
        amount: true,
        date: true,
      },
      where: roles.includes(Role.ADMIN)
        ? undefined
        : eq(transactions.userId, userId),
      with: {
        place: true,
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { items };
  }

  async getById(
    id: number,
    userId: number,
    roles: string[],
  ): Promise<TransactionResponseDto> {
    const whereCondition = roles.includes(Role.ADMIN)
      ? eq(transactions.id, id)
      : and(eq(transactions.id, id), eq(transactions.userId, userId));
    const transaction = await this.db.query.transactions.findFirst({
      columns: {
        id: true,
        amount: true,
        date: true,
      },
      where: whereCondition,
      with: {
        place: true,
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`No transaction with this id exists`);
    }

    return transaction;
  }

  async create(
    userId: number,
    { amount, date, placeId }: CreateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    const [newTransaction] = await this.db
      .insert(transactions)
      .values({
        amount,
        date,
        userId: userId,
        placeId: placeId,
      })
      .$returningId();

    return this.getById(newTransaction.id, userId, [Role.USER]);
  }

  async updateById(
    id: number,
    userId: number,
    { amount, date, placeId }: UpdateTransactionRequestDto,
  ): Promise<TransactionResponseDto> {
    await this.db
      .update(transactions)
      .set({
        amount,
        date,
        placeId,
      })
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));

    return this.getById(id, userId, [Role.USER]);
  }

  async deleteById(id: number, userId: number): Promise<void> {
    const [result] = await this.db
      .delete(transactions)
      .where(and(eq(transactions.id, id), eq(transactions.userId, userId)));

    if (result.affectedRows === 0) {
      throw new NotFoundException('No transaction with this id exists');
    }
  }
}
